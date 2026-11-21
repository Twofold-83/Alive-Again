/* Playing a finished turn as a small film: things glide, recorded moves replay, lines are typed out,
 * the camera leans in. A Director's turn plays its steps in order; a Player's turn plays in the order they acted. */
import { playerFields } from '../shared/scene-model.js';
import { clone, h } from '../core/dom.js';
import { renderStage, burst } from './render.js';
import { sample } from './level.js';

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
      Object.assign(e, { x: p.x, y: p.y, scale: p.scale, rot: p.rot, flip: p.flip, fx: p.fx, pose: p.pose, feel: p.feel, view: p.view });
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
  }

  const view = { ...o, playing: true },
    steps = [];
  const sp = o.speed || 1,
    types = []; // sp > 1 plays faster (used by the simulations); types: lines being typed out
  const autoCam = o.autoCam !== false && !after.cam && !(before && before.cam);
  const at = (ms, fn) => steps.push({ ms, fn });
  let t = 0;
  const swap = () => {
    frame.backdrop = after.backdrop;
    frame.level = after.level;
    frame.exits = after.exits;
  };
  if (after.travel) {
    // "Traveling to ..." between two places
    at(0, () => {
      root.classList.add('fade');
      if (o.sfx) o.sfx('whoosh');
    });
    at(380, () => {
      swap();
      view.travel = after.travel;
    });
    at(2300, () => {
      view.travel = '';
      root.classList.remove('fade');
    });
    t = 2600;
  } else if (before && (before.backdrop !== after.backdrop || JSON.stringify(before.level) !== JSON.stringify(after.level))) {
    // fade through black
    at(0, () => root.classList.add('fade'));
    at(380, swap);
    at(760, () => root.classList.remove('fade'));
    t = 760;
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
        Object.assign(e, {
          scale: f.scale,
          rot: f.rot,
          flip: f.flip,
          fx: f.fx,
          once: f.once,
          hp: f.hp,
          maxHp: f.maxHp,
          tie: f.tie,
          pose: f.pose,
          feel: f.feel,
        }); // a paper doll swings into its new pose
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
    if (o.by === 'player' && (after.action || after.target || after.point || after.use || after.exit || after.answer)) {
      at(t, () => {
        view.pop = null;
        frame.action = after.action;
        frame.target = after.target;
        frame.point = after.point;
        frame.use = after.use;
        frame.exit = after.exit;
        frame.answer = after.answer;
        frame.verb = after.verb;
      });
      t += 1300;
    }
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
      const n = Math.min(ty.text.length, Math.floor((el - ty.t0) / (ty.id ? 24 : 22)) + 1);
      if (n === ty.n) continue;
      if (o.sfx && Math.floor(n / 3) !== Math.floor(ty.n / 3)) o.sfx(ty.id ? 'talk' : 'type');
      ty.n = n;
      dirty = true;
      if (ty.id) {
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
