/* Playing a finished turn as a small film: things glide, recorded moves replay, lines are typed out,
 * the camera leans in. A Director's turn plays its steps in order; a Player's turn plays in the order they acted. */
import { playerFields, called } from '../shared/scene-model.js';
import { clone, h } from '../core/dom.js';
import { renderStage, burst, actionParts } from './render.js';
import { sample } from './level.js';

/** How a thing looks, as far as a step can change it: shown as before until the step plays, then as the step left it. */
const LOOKS = ['scale', 'rot', 'flip', 'fx', 'pose', 'feel', 'view', 'used', 'glow'];
const pick = (from, keys) => Object.fromEntries(keys.map((k) => [k, from[k]]));
/** How long a Director's turn first shows the scene as it was. */
const LEAD_MS = 2200;

/**
 * Present the step from scene `before` to scene `after`: things glide, recorded
 * moves play, new drawing draws itself, lines appear one after another.
 * o.by says whose turn produced `after`. Returns { skip() }.
 */
export function playCut(root, before, after, o, done) {
  const frame = clone(after);
  const prev = new Map((before ? before.entities : []).map((e) => [e.id, e]));
  const fin = new Map(after.entities.map((e) => [e.id, e]));
  const old = new Set((before ? before.drawing : []).map((d) => d.id));
  const newStrokes = new Set(after.drawing.filter((d) => !old.has(d.id)).map((d) => d.id));
  const tracks = after.tracks,
    tracked = new Set(tracks.map((t) => t.id));
  const trackEnd = Math.max(0, ...tracks.map((t) => t.pts[t.pts.length - 3]));
  let moved = false;
  for (const e of frame.entities) {
    const p = prev.get(e.id);
    if (!p || p.say !== e.say) e.say = ''; // unchanged lines simply stay up; new ones appear in turn
    e.emote = p ? p.emote : '';
    e.once = '';
    if (p) {
      if (p.x !== e.x || p.y !== e.y || p.scale !== e.scale || p.rot !== e.rot) moved = true;
      Object.assign(e, { x: p.x, y: p.y }, pick(p, LOOKS)); // it starts as it was, and changes when the step plays
    } else if (before) {
      e.fresh = true;
      moved = true;
    }
    if (tracked.has(e.id)) e.tracked = true;
  }
  for (const p of prev.values())
    if (!fin.has(p.id)) {
      frame.entities.push({ ...p, say: '', emote: '' });
      moved = true;
    }
  const sameNarr = !!before && before.narration === after.narration;
  Object.assign(frame, playerFields(), {
    roll: null,
    narration: sameNarr ? after.narration : '',
    drawing: after.drawing.filter((d) => !newStrokes.has(d.id)),
  }); // what the Player did appears in its own beat
  if (before) {
    frame.backdrop = before.backdrop;
    frame.weather = before.weather;
    frame.cam = before.cam;
    frame.exits = before.exits;
    frame.level = before.level;
    frame.dark = before.dark; // the light changes when the step plays, not before
  }

  const view = { ...o, playing: true },
    steps = [];
  const sp = o.speed || 1,
    types = []; // sp > 1 plays faster (used by the simulations); types: lines being typed out
  const autoCam = o.autoCam !== false && !after.cam && !(before && before.cam);
  const at = (ms, fn) => steps.push({ ms, fn });
  /* a Director's turn opens on the scene as the Player left it, for a moment: then it is clear what changes */
  const lead = o.by === 'director' && before && !(o.frameNo > 1) && !o.noLead ? LEAD_MS : 0;
  let t = lead;
  const swap = () => {
    frame.backdrop = after.backdrop;
    frame.level = after.level;
    frame.exits = after.exits;
  };
  if (after.travel) {
    // "Traveling to ..." between two places
    at(lead, () => {
      root.classList.add('fade');
      if (o.sfx) o.sfx('whoosh');
    });
    at(lead + 380, () => {
      swap();
      view.travel = after.travel;
    });
    at(lead + 2300, () => {
      view.travel = '';
      root.classList.remove('fade');
    });
    t = lead + 2600;
  } else if (before && (before.backdrop !== after.backdrop || JSON.stringify(before.level) !== JSON.stringify(after.level))) {
    // fade through black
    at(lead, () => root.classList.add('fade'));
    at(lead + 380, swap);
    at(lead + 760, () => root.classList.remove('fade'));
    t = lead + 760;
  } else swap();
  if (after.card) {
    at(t, () => {
      view.card = after.card;
    });
    t += 1900;
    at(t, () => {
      view.card = '';
    });
    t += 200;
  }
  /* The rest is a few acts. A Director's step always plays: movement, lines, dice. A Player's turn plays speaking, walking
   * and acting in the order the Player did them (after.order). */
  let tM = t,
    tEnd = t,
    popped = false;
  const actMove = () => {
    tM = t;
    at(tM, () => {
      // everything starts moving
      frame.weather = after.weather;
      frame.dark = after.dark;
      frame.drawing = after.drawing;
      view.newStrokes = newStrokes;
      frame.cam = after.cam;
      for (const e of frame.entities) {
        const f = fin.get(e.id);
        if (!f) {
          e.gone = true;
          continue;
        }
        if (e.fresh) {
          e.pop = true;
          if (o.sfx && !after.sfx && !popped) {
            popped = true;
            o.sfx('pop');
          }
        } // newcomers pop in
        e.fresh = false;
        if (e.tracked || f.x !== e.x || f.y !== e.y) {
          e.walk = true;
          e.face = Math.sign(f.x - e.x);
        } // on the move: bob along, face the way it goes
        Object.assign(e, { once: f.once, hp: f.hp, maxHp: f.maxHp, tie: f.tie }, pick(f, LOOKS)); // a paper doll swings into its new pose
        if (!f.say) e.emote = f.emote;
        if (!e.tracked) {
          e.x = f.x;
          e.y = f.y;
        }
      }
      if (after.burst) burst(root, after.burst);
      if (after.sfx && o.sfx) o.sfx(after.sfx);
    });
    if (after.floats.length) {
      at(tM + 300, () => {
        view.floats = after.floats;
        if (o.sfx && !after.sfx) o.sfx('hit');
      });
      at(tM + 1700, () => {
        view.floats = [];
      });
    }
    const camMoved = JSON.stringify(before ? before.cam : null) !== JSON.stringify(after.cam),
      acting = after.entities.some((e) => e.once) || after.floats.length;
    t = tM + Math.max(trackEnd ? trackEnd + 250 : 0, moved || newStrokes.size || camMoved ? 950 : 300, acting ? 1100 : 0);
    if (after.award) {
      at(t, () => {
        view.award = after.award;
        if (o.sfx) o.sfx(after.award.n < 0 ? 'fail' : 'coin');
      });
      t += 1600;
      at(t, () => {
        view.award = null;
      });
    }
    tEnd = t;
    at(t, () => {
      for (const e of frame.entities) {
        e.walk = false;
        e.face = 0;
        if (e.tracked) {
          const f = fin.get(e.id);
          e.tracked = false;
          e.x = f.x;
          e.y = f.y;
        }
      }
    });
  };
  const actSay = () => {
    const sayers = after.entities.filter((e) => e.say && !(prev.has(e.id) && prev.get(e.id).say === e.say));
    if (o.by === 'player') sayers.sort((a, b) => (b.id === after.heroId) - (a.id === after.heroId));
    for (const e of sayers) {
      // each line is typed out, the camera leans in on who speaks
      at(t, () => {
        const fe = frame.entities.find((x) => x.id === e.id);
        fe.emote = e.emote;
        view.pop = e.id;
        view.speaker = e.id;
        if (autoCam) frame.cam = { x: fe.x, y: Math.max(0, fe.y - 0.1 * e.scale), z: 1.16 };
      });
      types.push({ t0: t, id: e.id, text: e.say, n: 0 });
      frame.entities.find((x) => x.id === e.id).sayLen = e.say.length;
      t += Math.min(7500, e.say.length * 24 + Math.max(1100, 600 + 28 * e.say.length));
    }
    if (sayers.length)
      at(t, () => {
        view.speaker = null;
        view.pop = null;
        frame.cam = after.cam;
      });
  };
  const actDo = () => {
    /* what the Player did is told once, in the first picture of their turn (a battle adds one picture per enemy's blow) */
    if (o.by !== 'player' || o.frameNo > 1) return;
    const did = { action: after.action, target: after.target, point: after.point, use: after.use, exit: after.exit, answer: after.answer },
      all = { ...did, reacted: after.reacted, tripped: after.tripped, felt: after.felt };
    if (!Object.values(all).some((v) => (Array.isArray(v) ? v.length : v))) return;
    const battle = after.answer && after.answer.kind === 'battle';
    if (battle) {
      // a round of a fight: its lines go up at once, the blows are the show
      at(t, () => {
        view.pop = null;
        Object.assign(frame, did);
      });
      t += 1300;
      return;
    }
    /* typed out for the Director, line by line, the way the Player read it: what they did, and what a thing answered */
    const lines = [];
    for (const r of after.reacted || []) {
      const e = fin.get(r.id),
        re = e && e.active && e.active.re && e.active.re[r.verb];
      if (!e) continue;
      lines.push(`${r.verb}: ${called(e)}`); // a clickable thing that answered by itself: the Player read this
      if (re && re.text) lines.push(`“${re.text}”`);
    }
    lines.push(...actionParts({ ...after, said: '', roll: null, reacted: [] }).map(([, text]) => text[0].toUpperCase() + text.slice(1)));
    const text = lines.join('\n');
    at(t, () => {
      view.pop = null;
      view.told = { who: (o.names && o.names.player) || 'Player', text: '' };
      view.noAct = true; // the line at the top comes back once it has been told
      Object.assign(frame, { target: after.target, point: after.point, exit: after.exit }); // what it is about is marked on the stage
    });
    types.push({ t0: t, told: true, text, n: 0 });
    t += text.length * 24 + Math.min(4000, 1300 + 22 * text.length);
    at(t, () => {
      view.told = null;
      view.noAct = o.noAct;
      Object.assign(frame, all);
    });
  };
  const acts = { walk: actMove, say: actSay, act: actDo };
  const order = o.by === 'player' ? [...new Set([...(after.order || []).filter((k) => acts[k]), 'walk', 'say', 'act'])] : ['walk', 'say', 'act'];
  for (const k of order) acts[k]();
  const asked = o.by === 'player' && after.answer && after.answer.kind === 'roll'; // the Player saw this die fall already; the Director gets the result in words
  if (after.roll && after.roll.by === o.by && asked) at(t, () => (frame.roll = after.roll));
  else if (after.roll && after.roll.by === o.by) {
    at(t, () => {
      view.dice = { ...after.roll, rolling: true };
      if (o.sfx) o.sfx('dice');
    });
    at(t + 700, () => {
      view.dice = { ...after.roll };
    });
    t += 1700;
    at(t, () => {
      view.dice = null;
      frame.roll = after.roll;
    });
  }
  if (after.narration && !sameNarr) {
    frame.narrLen = after.narration.length;
    types.push({ t0: t, id: null, text: after.narration, n: 0 });
    t += Math.min(8000, after.narration.length * 22 + Math.max(1300, 700 + 26 * after.narration.length));
  }
  const total = t + 250;
  steps.sort((a, b) => a.ms - b.ms);

  let i = 0,
    raf = 0,
    finished = false,
    lastStep = -999;
  const start = performance.now();
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    clearTimeout(guard);
    root.classList.remove('cut', 'fade');
    renderStage(root, after, o);
    if (done) done();
  };
  const tick = () => {
    if (finished) return;
    const el = (performance.now() - start) * sp;
    let dirty = false;
    while (i < steps.length && steps[i].ms <= el) {
      steps[i++].fn();
      dirty = true;
    }
    if (trackEnd && el >= tM && el <= tM + trackEnd + 250) {
      for (const tr of tracks) {
        const e = frame.entities.find((x) => x.id === tr.id),
          p = e && e.tracked && sample(tr.pts, el - tM);
        if (p) {
          if (Math.abs(p[0] - e.x) > 0.0008) e.face = Math.sign(p[0] - e.x);
          e.x = p[0];
          e.y = p[1];
        }
      }
      dirty = true;
    }
    for (const ty of types) {
      // typewriter, with a soft tick every few letters
      if (el < ty.t0 || ty.n >= ty.text.length) continue;
      const n = Math.min(ty.text.length, Math.floor((el - ty.t0) / (ty.id || ty.told ? 24 : 22)) + 1);
      if (n === ty.n) continue;
      if (o.sfx && Math.floor(n / 3) !== Math.floor(ty.n / 3)) o.sfx(ty.id ? 'talk' : 'type');
      ty.n = n;
      dirty = true;
      if (ty.told) {
        if (view.told) view.told = { ...view.told, text: ty.text.slice(0, n) };
      } else if (ty.id) {
        const fe = frame.entities.find((x) => x.id === ty.id);
        if (fe) fe.say = ty.text.slice(0, n);
      } else frame.narration = ty.text.slice(0, n);
    }
    if (o.sfx && el >= tM && el < tEnd && el - lastStep > 290 && frame.entities.some((e) => e.walk && !e.gone)) {
      lastStep = el;
      o.sfx('step');
    }
    if (dirty) renderStage(root, frame, view);
    if (el >= total) return finish();
    raf = requestAnimationFrame(tick);
  };
  const guard = setTimeout(finish, total / sp + 1500); // background tabs pause animation frames
  root.classList.add('cut');
  renderStage(root, frame, view);
  raf = requestAnimationFrame(tick);
  return { skip: finish, total };
}

/**
 * Present a whole turn. A step-by-step turn carries its earlier moments in
 * after.steps; they are played one after another, in the order they were made,
 * each with its own moves, sounds and narration, ending on `after` itself.
 */
export function playTurn(root, before, after, o, done) {
  const frames = [...(after.steps || []), after];
  let i = 0,
    cur = null,
    stopped = false,
    wait = 0;
  const bars = () => root.querySelectorAll('.bar');
  const end = () => {
    // curtain: bars away, and a "Your turn" cue if control comes back to this player
    root.classList.remove('cine');
    for (const b of bars()) b.textContent = '';
    if (o.stinger) {
      const st = h('div', { class: 'stinger' }, o.stinger);
      root.append(st);
      setTimeout(() => st.remove(), 1500);
    }
    if (done) done();
  };
  const next = () => {
    if (stopped) return;
    if (i >= frames.length) return end();
    const prev = i ? frames[i - 1] : before,
      frame = frames[i++];
    root.dataset.step = i;
    o.frameNo = i;
    cur = playCut(root, prev, frame, o, () => {
      cur = null;
      wait = setTimeout(next, 220 / (o.speed || 1));
    });
  };
  renderStage(root, before || frames[0], o); // make sure the stage exists before the bars are labelled
  root.classList.add('cine');
  if (bars()[0]) bars()[0].textContent = o.who ? `${o.who}${frames.length > 1 ? `  ·  ${frames.length} moments` : ''}  ·  click to skip` : '';
  next();
  return {
    skip() {
      if (stopped) return;
      stopped = true;
      clearTimeout(wait);
      const c = cur;
      cur = null;
      if (c) c.skip();
      renderStage(root, after, o);
      end();
    },
  };
}
