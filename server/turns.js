/* Turns: the clock, ending a turn (Director or Player), handing over, and the computer partner taking its turn. */
import { GRACE_MS, MAX_HISTORY, BOT_DELAY_MS } from './config.js';
import { timers, online, broadcast, touch, rooms } from './rooms.js';
import { clone, fail, str, num, r3, arr } from './util.js';
import {
  fightRound,
  fightTime,
  livingFoes,
  heroHealth,
  weaponOf,
  planBattle,
  BATTLE_CMDS,
  BATTLE_LEVELS,
  FOE_MOVES,
} from '../public/shared/battle.js';
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
function advance(room, timeout, watching = 0) {
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
      ? room.settings.turnSeconds * 1000 +
        cutEstimate(
          room.scene,
          room.history.length > 1 ? room.history[room.history.length - 2].scene : null,
          room.history[room.history.length - 1].by,
        ) +
        watching // a battle's last round is watched before the turn begins
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
  const fighting = room.bot === 'player' && !!room.scene.battle, // a computer hero fights on, round after round
    seen = fighting && room.fight ? fightTime(room.fight.events) : 0; // ...once the last round has been watched
  const delay = BOT_DELAY_MS != null ? BOT_DELAY_MS : room.turn === 0 ? 1200 : seen + 2500 + Math.random() * (fighting ? 1000 : 3500);
  setTimeout(async () => {
    try {
      if (room.turn !== turn || room.ended || rooms.get(room.code) !== room) return;
      if (fighting) {
        botBusy.delete(room.code);
        const b = room.scene.battle,
          foes = b ? livingFoes(room.scene) : [];
        if (!b || b.paused) return void setTimeout(() => maybeBot(room), 3000); // the Director holds the fight: look again later
        const hp = heroHealth(room.scene),
          heal = room.scene.sheet.inv.find((i) => /potion|bandage|medicine|food|heal/i.test(i.name || i.asset || ''));
        const move = hp.get() <= hp.max * 0.3 && heal ? { move: 'item', item: heal.id } : { move: 'attack', id: foes[0] && foes[0].id };
        return void (await act(room, room.tokens[room.bot], { ...move, type: 'battle', turn }));
      }
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
  /* a battle belongs to the Player from here on: it starts, or goes on after a pause */
  const sc = room.scene;
  if (sc.battle && livingFoes(sc).length && heroHealth(sc).get() > 0) {
    sc.battle.paused = false;
    sc.ask = battleAsk(sc);
    sc.choices = [];
  } else if (sc.battle) {
    sc.battle = null; // nobody left to fight
    if (sc.ask && sc.ask.kind === 'battle') sc.ask = null;
  }
}
const battleAsk = (sc) => ({
  kind: 'battle',
  image: '',
  back: false,
  text: `Battle — round ${sc.battle.round}`,
  sides: 6,
  dc: 0,
  verb: '',
  places: [],
  targets: [],
});
/** The Player ends a turn: only what a Player may change — the hero's line and walk, an action, an answer. */
function submitPlayer(room, body) {
  const sc = room.scene,
    mode = room.rules.player;
  if (sc.battle) throw fail(400, 'You are in a battle: fight, or try to escape');
  const hero = sc.entities.find((e) => e.id === sc.heroId);
  let action = str(body.action, mode === 'tell' ? 300 : 160);
  const chosen = mode === 'limited' && sc.choices.length > 0; // then the action is one of the Director's options
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
    if (ask.kind === 'image' && ans.seen) answer = { kind: 'image' };
    else if (ask.kind === 'roll' && ans.decline)
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
    /* a paper-doll hero: the Player may strike a pose (how the hero looks is the Director's to decide) */
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
    const ex = sc.exits.find((x) => x.id === body.exit && !x.locked);
    if (ex) sc.exit = ex.id;
    if (askTarget) sc.target = askTarget;
  }
  sc.order = [...new Set(arr(body.order).filter((k) => ['say', 'walk', 'act'].includes(k)))]; // the order the Player did things in, for the replay
  /* an action aimed at the stage: a verb, and the thing or the spot it is about */
  if (mode !== 'tell' && body.point && typeof body.point === 'object') {
    const verb = str(body.point.verb, 16) || 'Look at',
      thing = sc.entities.find((e) => e.id === body.point.id && e.id !== sc.heroId);
    if (thing) sc.point = { verb, id: thing.id };
    else if (Number.isFinite(Number(body.point.x)) && Number.isFinite(Number(body.point.y)))
      sc.point = { verb, x: r3(num(body.point.x, 0, 1, 0.5)), y: r3(num(body.point.y, 0, 1, 0.5)) };
  }
  sc.action = action;
  if (room.rules.type === 'adventure') {
    /* an adventure turn holds one action: something aimed at the stage, an item used, or a free action in words */
    if (sc.point) Object.assign(sc, { use: null, target: askTarget });
    if ((sc.point || sc.use || (sc.target && !askTarget)) && !chosen) sc.action = '';
  }
  sc.answer = answer;
  const roll = (ask && ask.kind === 'roll' && ask.rolled) || rollDie(askRoll || (room.bot === 'player' ? body.roll : 0)); // the Player rolls only when the Director asks
  sc.roll = roll ? { by: 'player', ...roll } : null;
  sc.choices = [];
  sc.ask = null;
  /* reactions the Player already saw on clickable things: note them for the Director, and leave the thing used where the reaction says so */
  for (const r of Array.isArray(body.reacted) ? body.reacted.slice(0, 8) : []) {
    const e = r && sc.entities.find((x) => x.id === r.id),
      re = e && e.active && e.active.re && e.active.re[r.verb];
    if (!re) continue;
    if (re.used) e.used = true;
    sc.reacted.push({ id: e.id, verb: String(r.verb) });
  }
  /* a trap sprung: the hero walked too close to something */
  const trap = typeof body.tripped === 'string' && sc.entities.find((e) => e.id === body.tripped && e.near);
  if (trap) {
    trap.near = false; // it happens once
    trap.once = 'hit';
    if (hero) hero.once = 'hit';
    sc.tripped = trap.id;
    sc.card = 'Something happened!';
    sc.sfx = 'alarm';
  }
}
/**
 * Preparing a campaign: keep the stage being worked on with the story (nothing is played, no turn passes).
 */
export function actKeepStage(room, body, who) {
  directorOnly(who);
  if (!room.prep || room.test || room.turn !== 0) throw fail(400, 'That is only possible while preparing a campaign');
  room.scene = cleanScene(body.scene || {}, room.scene);
  touch(room);
  return { ok: true };
}
/**
 * Preparing a campaign: try the stage out as the Player. The test is ordinary play, turn after turn — and when it
 * stops, everything is as it was when it began: the stage the Director had built, no turns played, no story told.
 */
export function actTest(room, body, who) {
  if (!room.prep) throw fail(400, 'That is only possible while preparing a campaign');
  if (body.stop) {
    if (!room.test || who.role === 'spectator') return { ok: true };
    clearTimeout(timers.get(room.code));
    Object.assign(room, {
      scene: room.test.scene,
      turn: 0,
      whose: 'director',
      history: [],
      test: null,
      deadline: null,
      remaining: null,
      lastTimeout: false,
      ended: false,
    });
    touch(room);
    broadcast(room);
    return { ok: true };
  }
  directorOnly(who);
  if (room.test || room.turn !== 0) return { ok: true, stale: true };
  const stage = cleanScene(body.scene || {}, room.scene);
  room.scene = stage;
  room.test = { scene: clone(stage) };
  return actSubmit(room, { turn: 0, scene: stage }, who);
}
/**
 * The Player's command in a battle: the round is worked out at once and told as a list of events, which both
 * sides watch (room.fight: where the stage stood, and what happens on it, in order). The turn stays with the
 * Player until the battle is over — then it goes to the Director.
 */
export function actBattle(room, body, who) {
  const sc = room.scene,
    b = sc.battle;
  if (room.ended || body.turn !== room.turn || who.role !== room.whose || room.whose !== 'player') return { ok: true, stale: true };
  if (!b) throw fail(400, 'There is no battle');
  if (b.paused) throw fail(409, 'The Director has paused the battle');
  if (!BATTLE_CMDS.some((c) => c[0] === body.move)) throw fail(400, 'That is not possible in a battle');
  Object.assign(sc, stepFields(), playerFields(), { steps: [] });
  sc.entities = sc.entities.filter((e) => !e.temp);
  for (const e of sc.entities) Object.assign(e, { once: '', say: '' }); // what was said before the round is not left hanging over it
  const before = clone(sc);
  const foe = livingFoes(sc).find((e) => e.id === body.id);
  const { events, lines, over } = fightRound(
    sc,
    { move: body.move, id: foe ? foe.id : null, item: typeof body.item === 'string' ? body.item : '' },
    room.names,
    (e) => assetName(e.asset),
  );
  showFight(room, before, events);
  sc.answer = { kind: 'battle', move: body.move, lines: lines.slice(0, 8), over };
  if (!over) {
    sc.ask = battleAsk(sc);
    touch(room);
    broadcast(room);
    maybeBot(room);
    return { ok: true };
  }
  endBattle(room, over === 'won' ? 'Victory!' : over === 'fled' ? 'Got away!' : 'Defeated…');
  return { ok: true };
}
/** Both sides are shown these events, played on the stage as it stood in `before`. */
function showFight(room, before, events) {
  room.fight = { n: ((room.fight && room.fight.n) || 0) + 1, before, events };
}
/** The battle is over: the health bars go, and the Director takes it from here. */
function endBattle(room, card) {
  const sc = room.scene;
  for (const e of sc.entities) if (e.id !== sc.heroId) e.hp = e.maxHp = null;
  Object.assign(sc, { battle: null, ask: null, card });
  advance(room, false, fightTime(room.fight.events));
}
/**
 * The Director's hand on a running battle, while the fight is the Player's:
 *   pause / resume   hold the fight (the Player cannot give a command meanwhile) and let it go on
 *   say              { id, text }   someone speaks, at once: an event of its own, shown to both
 *   plan             { id, move }   what an enemy does in the coming round (FOE_MOVES; '' leaves it to chance)
 *   level            { level }      make the rest of the fight easier or harder
 *   stop                            call the battle off: nobody wins, the turn comes to the Director
 */
export function actBattleDirect(room, body, who) {
  const sc = room.scene,
    b = sc.battle;
  if (who.role !== 'director' && !room.hotseat) throw fail(403, 'Only the Director can do that');
  if (room.ended || room.whose !== 'player' || !b) return { ok: true, stale: true };
  const foe = livingFoes(sc).find((e) => e.id === body.id);
  if (body.op === 'pause' || body.op === 'resume') b.paused = body.op === 'pause';
  else if (body.op === 'say') {
    const e = sc.entities.find((x) => x.id === body.id),
      text = str(body.text, 160);
    if (!e || !text) throw fail(400, 'Who says what?');
    showFight(room, clone(sc), [{ t: 'say', who: e.id, text }]);
  } else if (body.op === 'plan') {
    if (!foe) throw fail(400, 'That one is not in the fight');
    b.plan = b.plan || {};
    if (FOE_MOVES.some((m) => m[0] && m[0] === body.move)) b.plan[foe.id] = body.move;
    else delete b.plan[foe.id];
  } else if (body.op === 'level') {
    if (!BATTLE_LEVELS.some((l) => l[0] === body.level)) throw fail(400, 'No such difficulty');
    const p = planBattle(body.level, { heroHp: heroHealth(sc).max, weapon: !!weaponOf(sc), foes: livingFoes(sc).length });
    Object.assign(b, { level: p.level, atk: p.atk, hit: p.hit, foeAtk: p.foeAtk, foeHit: p.foeHit, flee: p.flee });
  } else if (body.op === 'stop') {
    showFight(room, clone(sc), [{ t: 'end', result: 'stopped', text: 'The battle is called off' }]);
    Object.assign(sc, stepFields(), playerFields(), { steps: [] });
    sc.answer = { kind: 'battle', move: '', lines: ['The battle is called off'], over: 'stopped' };
    endBattle(room, '');
    return { ok: true };
  } else throw fail(400, 'Unknown battle command');
  touch(room);
  broadcast(room);
  return { ok: true };
}
/** The Director steps into the battle with every tool: the turn comes over at once. Ending that turn gives the fight back. */
export function actBattlePause(room, body, who) {
  const sc = room.scene;
  if (who.role !== 'director' && !room.hotseat) throw fail(403, 'Only the Director can do that');
  if (room.ended || room.whose !== 'player' || !sc.battle) return { ok: true, stale: true };
  Object.assign(sc, stepFields(), playerFields(), { steps: [] }); // the last round was already seen
  sc.battle.paused = true;
  sc.ask = null;
  advance(room, false);
  return { ok: true };
}
/** A plain name for a library thing, for the battle's lines: 'p:ritual-dagger' -> 'ritual dagger'. */
function assetName(asset) {
  return /^p:/.test(asset || '') ? asset.slice(2).replace(/-/g, ' ') : 'it';
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
      image: /^c:[A-Za-z0-9_-]{1,40}$/.test(body.info.image) ? body.info.image : '', // the story's own title picture
      onTop: !!body.info.onTop,
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
