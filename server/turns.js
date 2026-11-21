/* Turns: the clock, ending a turn (Director or Player), handing over, and the computer partner taking its turn. */
import { GRACE_MS, MAX_HISTORY, BOT_DELAY_MS } from './config.js';
import { timers, online, broadcast, touch, rooms } from './rooms.js';
import { clone, fail, str, num, r3, arr } from './util.js';
import { cutEstimate, rollDie, cleanScene, cleanTrackPts, cleanPose, cleanFeel } from './scene.js';
import { cleanRules } from '../public/shared/rules.js';
import { walkable, stepFields, playerFields } from '../public/shared/scene-model.js';
import { botMove } from './bots.js';
import { act } from './actions.js';

const botBusy = new Set();

/* The clock only runs while BOTH players are connected. */
export function syncClock(room) {
  const timed = room.deadline != null || room.remaining != null;
  if (!timed || room.ended) {
    clearTimeout(timers.get(room.code));
    room.deadline = null;
    room.remaining = null;
    return;
  }
  const both = online(room, 'director') && online(room, 'player');
  if (both && room.deadline == null) {
    room.deadline = Date.now() + room.remaining;
    room.remaining = null;
    const turn = room.turn;
    clearTimeout(timers.get(room.code));
    timers.set(
      room.code,
      setTimeout(
        () => {
          if (room.turn === turn && room.deadline != null && !room.ended) advance(room, true);
        },
        room.deadline - Date.now() + GRACE_MS,
      ),
    );
  } else if (!both && room.deadline != null) {
    room.remaining = Math.max(0, room.deadline - Date.now());
    room.deadline = null;
    clearTimeout(timers.get(room.code));
  }
}

/* Commit the current scene as a finished turn and hand over to the other side. */
function advance(room, timeout) {
  if (timeout) {
    // nothing new was submitted: drop every one-turn extra so it does not play twice
    Object.assign(room.scene, stepFields(), playerFields(), { roll: null, steps: [] });
    if (room.whose === 'player') room.scene.choices = [];
  }
  room.history.push({ turn: room.turn, by: room.whose, at: Date.now(), timeout: !!timeout, scene: clone(room.scene) });
  if (room.history.length > MAX_HISTORY) room.history.shift();
  room.turn += 1;
  room.whose = room.whose === 'director' ? 'player' : 'director';
  room.lastTimeout = !!timeout;
  clearTimeout(timers.get(room.code));
  room.deadline = null;
  room.remaining =
    room.settings.turnSeconds > 0
      ? room.settings.turnSeconds * 1000 + cutEstimate(room.scene, room.history.length > 1 ? room.history[room.history.length - 2].scene : null)
      : null;
  syncClock(room);
  touch(room);
  broadcast(room);
  maybeBot(room);
}

/* If an AI partner holds the current turn, let it "think" for a human-ish moment and then play. */
export function maybeBot(room) {
  if (room.rpg) return; // in dungeon mode the computer side lives in the host's browser
  if (!room.bot || room.ended || room.whose !== room.bot || botBusy.has(room.code)) return;
  botBusy.add(room.code);
  const turn = room.turn;
  const delay = BOT_DELAY_MS != null ? BOT_DELAY_MS : room.turn === 0 ? 1200 : 2500 + Math.random() * 3500;
  setTimeout(async () => {
    try {
      if (room.turn !== turn || room.ended || rooms.get(room.code) !== room) return;
      room.botMemory = room.botMemory || {};
      const move = await botMove({
        rules: room.rules,
        role: room.bot,
        scene: clone(room.scene),
        names: room.names,
        turn,
        memory: room.botMemory,
        history: room.history.slice(-6),
      });
      botBusy.delete(room.code);
      if (room.turn === turn && !room.ended) await act(room, room.tokens[room.bot], { ...move, type: 'submit', turn });
    } catch (e) {
      console.error('Bot turn failed:', e);
    } finally {
      botBusy.delete(room.code);
    }
  }, delay);
}

/* ---------- actions: what a client may ask for. Each takes (room, body, who) with who = { role, token }. ---------- */
export function directorOnly(who) {
  if (who.role !== 'director') throw fail(403, 'Only the Director can do that');
}

/** The Director ends a turn: the whole scene they staged, steps included. */
function submitDirector(room, body) {
  if (!room.tokens.player) throw fail(409, 'Waiting for the Player to join');
  room.scene = cleanScene(body.scene || {}, room.scene);
  const roll = rollDie(body.roll);
  if (roll) room.scene.roll = { by: 'director', ...roll };
}
/** The Player ends a turn: only what a Player may change — the hero's line and walk, an action, an answer. */
function submitPlayer(room, body) {
  const sc = room.scene,
    mode = room.rules.player;
  const hero = sc.entities.find((e) => e.id === sc.heroId);
  let action = str(body.action, mode === 'tell' ? 300 : 160);
  if (mode === 'limited' && sc.choices.length && !sc.choices.includes(action)) throw fail(400, 'Pick one of the Director’s options first');
  // the reply to what the Director asked
  const ask = sc.ask,
    ans = body.answer && typeof body.answer === 'object' ? body.answer : null;
  let answer = null,
    askRoll = 0,
    askTarget = null;
  if (ask && ask.kind === 'roll' && ask.rolled) {
    answer = { kind: 'roll', dc: ask.dc }; // rolled already, in front of the Player (see actRoll)
  } else if (ask && ans) {
    if (ask.kind === 'roll' && ans.decline)
      answer = { kind: 'roll', dc: ask.dc, declined: true }; // looked at the check and backed out
    else if (ask.kind === 'roll' && ans.roll) {
      askRoll = ask.sides;
      answer = { kind: 'roll', dc: ask.dc };
    } else if (ask.kind === 'discard') {
      const it = sc.sheet.inv.find((i) => i.id === ans.id);
      if (it) {
        sc.sheet.inv = sc.sheet.inv.filter((i) => i !== it);
        answer = { kind: 'discard', asset: it.asset, name: it.name };
      }
    } else if (ask.kind === 'place' && ask.places[ans.index]) answer = { kind: 'place', label: ask.places[ans.index].label };
    else if (ask.kind === 'target' && ask.targets.includes(ans.id)) {
      askTarget = ans.id;
      answer = { kind: 'target', verb: ask.verb || 'chooses' };
    } else if (ask.kind === 'battle' && ['attack', 'defend', 'flee'].includes(ans.move)) {
      const foe = sc.entities.find((e) => e.id === ans.id && e.hp != null && e.id !== sc.heroId);
      if (ans.move !== 'attack' || foe) {
        answer = { kind: 'battle', move: ans.move };
        askTarget = foe && ans.move === 'attack' ? foe.id : null;
      }
    }
  }
  if (mode === 'limited' && ask && ask.kind !== 'battle' && !answer) throw fail(400, 'Do what the Director asked first');
  Object.assign(sc, stepFields(), playerFields(), { steps: [] }); // the Director's one-turn extras are over
  for (const e of sc.entities) {
    if (e.id !== sc.heroId) e.say = '';
    e.once = '';
  } // lines already heard do not hang around
  sc.entities = sc.entities.filter((e) => !e.temp);
  if (hero && mode !== 'tell') {
    hero.say = str(body.say, 160);
    hero.emote = str(body.emote, 16);
    /* a paper-doll hero: the Player may strike a pose, and choose how their own character looks */
    if (/^d:h\d{3}\.t\d{3}\.a\d{3}\.l\d{3}(~[hal]\d{3},-?\d{1,2},-?\d{1,2},-?\d{1,3},[01]){0,6}$/.test(body.look)) hero.asset = body.look;
    if (hero.asset.startsWith('d:') && cleanPose(body.pose)) hero.pose = cleanPose(body.pose);
    if (hero.asset.startsWith('d:') && typeof body.feel === 'string' && cleanFeel(body.feel) !== (hero.feel || '')) {
      hero.feel = cleanFeel(body.feel);
      sc.felt = hero.feel; // told to the Director along with what the hero says and does
    }
  }
  if (hero && mode !== 'tell') {
    // free and limited will: the hero may walk
    let x = num(body.x, 0, 1, hero.x),
      y = num(body.y, 0, 1, hero.y);
    let track = Array.isArray(body.track) ? cleanTrackPts(body.track).map((v, i) => (i % 3 ? Math.min(1, Math.max(0, v)) : v)) : [];
    for (let i = 0; i < track.length; i += 3)
      if (!walkable(sc, track[i + 1], track[i + 2])) {
        track = [];
        break;
      }
    if (track.length >= 6) sc.tracks = [{ id: hero.id, pts: track }]; // the Player recorded how their hero moves
    if (walkable(sc, x, y)) {
      hero.x = r3(x);
      hero.y = r3(y);
    } else sc.tracks = []; // walls and solid things stop the hero
  }
  if (mode !== 'tell') {
    sc.use = sc.sheet.inv.some((i) => i.id === body.use) ? body.use : null;
    const thing = sc.entities.find((e) => e.id === body.target && e.id !== sc.heroId);
    if (thing && (mode === 'free' || sc.use)) sc.target = thing.id; // reach for it, or use an item on it
    const act =
      body.act && typeof body.act === 'object'
        ? sc.entities.find((e) => e.id === body.act.id && e.active && e.active.verbs.includes(body.act.verb))
        : null;
    if (act) {
      sc.target = act.id;
      sc.verb = body.act.verb;
    } // a verb on an active object
    const ex = sc.exits.find((x) => x.id === body.exit && !x.locked);
    if (ex) sc.exit = ex.id;
    if (askTarget) sc.target = askTarget;
  }
  sc.order = [...new Set(arr(body.order).filter((k) => ['say', 'walk', 'act'].includes(k)))]; // the order the Player did things in, for the replay
  sc.point = null; // adventure: the written action may point at a thing or a spot on the stage
  if (room.rules.type === 'adventure' && body.point && typeof body.point === 'object') {
    const thing = sc.entities.find((e) => e.id === body.point.id && e.id !== sc.heroId);
    if (thing) sc.point = { id: thing.id };
    else if (Number.isFinite(Number(body.point.x)) && Number.isFinite(Number(body.point.y)))
      sc.point = { x: r3(num(body.point.x, 0, 1, 0.5)), y: r3(num(body.point.y, 0, 1, 0.5)) };
  }
  sc.action = action;
  sc.answer = answer;
  const roll = (ask && ask.kind === 'roll' && ask.rolled) || rollDie(askRoll || body.roll);
  sc.roll = roll ? { by: 'player', ...roll } : null;
  sc.choices = [];
  sc.ask = null;
}
/** The Player rolls the die the Director asked for: at once, so they see how it went before ending the turn. */
export function actRoll(room, body, who) {
  if (room.ended || body.turn !== room.turn || who.role !== room.whose || room.whose !== 'player') return { ok: true, stale: true };
  const ask = room.scene.ask;
  if (!ask || ask.kind !== 'roll') throw fail(400, 'No roll was asked for');
  if (!ask.rolled) {
    ask.rolled = rollDie(ask.sides);
    touch(room);
  }
  return { ok: true, rolled: ask.rolled, dc: ask.dc };
}
export async function actSubmit(room, body, who) {
  if (room.ended || body.turn !== room.turn || who.role !== room.whose) return { ok: true, stale: true };
  if (who.role === 'director') submitDirector(room, body);
  else submitPlayer(room, body);
  advance(room, false);
  return { ok: true };
}
export async function actSettings(room, body, who) {
  directorOnly(who);
  room.settings.turnSeconds = Math.round(num(body.turnSeconds, 0, 600, room.settings.turnSeconds));
  if (body.rules && typeof body.rules === 'object') room.rules = cleanRules({ ...body.rules, type: room.rules.type }); // layers can change, the story type cannot
  if (body.info && typeof body.info === 'object')
    room.info = {
      title: str(body.info.title, 60),
      text:
        typeof body.info.text === 'string'
          ? body.info.text
              .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ')
              .trim()
              .slice(0, 800)
          : '',
    };
  touch(room);
  broadcast(room);
  return { ok: true };
}
export async function actEnd(room, body, who) {
  directorOnly(who);
  room.ended = true;
  syncClock(room);
  touch(room);
  broadcast(room);
  return { ok: true };
}
