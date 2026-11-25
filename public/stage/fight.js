/*
 * A battle on the stage. The server tells a round as a list of events (shared/battle.js); this plays them one
 * after the other on the stage as it stood before the round: the attacker winds up and darts in, the blow lands
 * with a burst, the number flies up and the health bar drains at that very moment, the beaten fall and fade, a
 * line is spoken and cleared again, and only at the end comes "Victory!". Nothing is shown before it happened.
 *
 * playFight(root, before, events, o, done) -> { skip() }
 *   o.onChange(frame, msg)   the stage changed: frame is the scene as it stands right now (health included), msg
 *                            the line of the message window — the battle's own panels are drawn from these
 *   o.sfx(name), o.speed     sound; play faster (tests)
 */
import { clone, h } from '../core/dom.js';
import { renderStage, burst } from './render.js';
import { isDoll } from '../core/dolls.js';
import { eventTime, heroHealth, facing } from '../shared/battle.js';

/* a paper doll's joints: [head, left arm, right arm, left leg, right leg] in degrees */
const WINDUP = [-6, 24, -165, -8, 14],
  STRIKE = [10, 30, -48, 16, -18],
  GUARD = [10, 128, -128, 4, -4],
  THROW = [6, 20, -100, 10, -10],
  RUN = [6, -60, -60, 40, 40],
  CHEER = [-8, 160, -160, 0, 0],
  FALLEN = [-20, 110, -70, 35, -40];

export function playFight(root, before, events, o, done) {
  const frame = clone(before),
    view = { ...o, playing: true, selId: null, dest: null, camFrame: false, noAct: true, floats: [], fightMsg: '' },
    sp = o.speed || 1,
    steps = [],
    extras = new Set(); // bursts and thrown things: elements of our own on the stage
  const ent = (id) => frame.entities.find((e) => e.id === id),
    home = new Map(frame.entities.map((e) => [e.id, { x: e.x, y: e.y, pose: e.pose, flip: e.flip, used: e.used }])),
    hp = heroHealth(frame);
  Object.assign(frame, { narration: '', action: '', point: null, target: null, answer: null, reacted: [], cam: null, ask: null });
  for (const e of frame.entities) Object.assign(e, { say: '', once: '', emote: '' });
  view.facing = facing(frame); // the two sides face each other for as long as the fight lasts
  for (const el of root.querySelectorAll('.stinger')) el.remove(); // a "Your turn" still fading must not lie over the fight
  let msg = '';
  const at = (ms, fn) => steps.push({ ms, fn }),
    sfx = (name) => o.sfx && o.sfx(name),
    say = (text) => {
      msg = view.fightMsg = text;
    },
    float = (id, text, c) => {
      view.floats = [...view.floats.filter((f) => f.id !== id), { id, text, c }];
    },
    pose = (e, p) => {
      if (e && isDoll(e.asset)) e.pose = p;
    },
    back = (e) => {
      const was = e && home.get(e.id);
      if (was) Object.assign(e, { x: was.x, y: was.y, pose: was.pose, used: was.used, face: 0, once: '' });
    };
  /** A burst where a blow lands. */
  const impact = (e, big) => {
    const world = root.firstChild,
      el = h('div', { class: 'impact' + (big ? ' big' : ''), style: `left:${e.x * 100}%;top:${(e.y - 0.09 * e.scale) * 100}%` });
    world.append(el);
    extras.add(el);
    setTimeout(() => (el.remove(), extras.delete(el)), 420);
  };
  const setHealth = (id, value) => {
    if (id === frame.heroId) hp.set(value);
    else if (ent(id)) ent(id).hp = value;
  };

  /* ---- the timeline: every event gets its stretch of time (eventTime), one after the other ---- */
  let t = 250;
  for (const ev of events) {
    const T = t,
      A = () => ent(ev.who),
      B = () => ent(ev.target),
      hero = ev.who === frame.heroId;
    if (ev.t === 'attack') {
      const dir = () => Math.sign(B().x - A().x) || 1;
      at(T, () => {
        say(ev.text.split(' — ')[0].replace(/ and misses$/, ''));
        view.floats = [];
        A().face = dir();
        pose(A(), ev.thrown ? THROW : WINDUP);
      });
      if (ev.thrown) {
        /* something is thrown: it flies from the hand to the target */
        at(T + 260, () => {
          pose(A(), STRIKE);
          sfx('whoosh');
          const a = A(),
            b = B(),
            el = h('img', {
              class: 'thrown',
              src: `px/${String(ev.thrown).slice(2)}.png`,
              alt: '',
              style: `left:${a.x * 100}%;top:${(a.y - 0.12) * 100}%`,
            });
          root.firstChild.append(el);
          extras.add(el);
          requestAnimationFrame(() => requestAnimationFrame(() => Object.assign(el.style, { left: b.x * 100 + '%', top: (b.y - 0.1) * 100 + '%' })));
          setTimeout(() => (el.remove(), extras.delete(el)), 330 / sp);
        });
      } else {
        at(T + 200, () => {
          /* dart in: right up to the target, on its near side */
          const a = A(),
            b = B();
          Object.assign(a, { x: b.x - dir() * 0.075, y: b.y + 0.004 });
          sfx('whoosh');
        });
        at(T + 420, () => {
          pose(A(), STRIKE);
          if (!isDoll(A().asset)) Object.assign(A(), { once: 'roar', used: true }); // a creature rears up as it strikes, and shows itself roused
          const w = ev.weapon && ent(ev.weapon);
          if (w) w.once = 'swing';
        });
      }
      at(T + (ev.thrown ? 560 : 500), () => {
        const b = B();
        if (!ev.hit) {
          /* a miss: the target steps aside */
          float(b.id, 'MISS', '#bbb9c4');
          b.x += dir() * 0.03;
          say(ev.text);
          return;
        }
        b.once = 'hit';
        impact(b, ev.crit || ev.heavy);
        float(b.id, (ev.crit ? 'CRIT ' : '') + '-' + ev.dmg, b.id === frame.heroId ? '#e0766a' : '#ffffff');
        setHealth(b.id, ev.hp); // the bar drains as the blow lands
        sfx(ev.crit || ev.heavy ? 'boom' : 'hit');
        if (ev.crit || ev.heavy) burst(root, 'shake');
        if (b.id === frame.heroId && ev.dmg > 0) pose(b, [16, 60, -20, -10, 12]);
        say(`${ev.text}${ev.dmg != null ? ` — ${ev.dmg}` : ''}`);
      });
      at(T + 900, () => {
        back(A());
        const b = B();
        if (b && !(ev.down && b.id === frame.heroId)) back(b);
        const w = ev.weapon && ent(ev.weapon);
        if (w) w.once = '';
      });
    } else if (ev.t === 'down') {
      at(T, () => {
        const e = A();
        if (!e) return;
        say(ev.text);
        view.floats = [];
        e.once = 'die';
        e.hp = 0;
        sfx('fall');
      });
      at(T + 820, () => {
        frame.entities = frame.entities.filter((e) => e.id !== ev.who && !(e.tie && e.tie.to === ev.who));
      });
    } else if (ev.t === 'defend') {
      at(T, () => {
        say(ev.text);
        view.floats = [];
        pose(A(), GUARD);
        A().once = 'cast';
        sfx('clash');
      });
      at(T + 760, () => back(A()));
    } else if (ev.t === 'heal') {
      at(T, () => {
        say(ev.text);
        view.floats = [];
        A().once = 'cast';
        pose(A(), CHEER);
        sfx('heal');
      });
      at(T + 420, () => {
        float(ev.who, '+' + ev.amount, '#a7d68c');
        setHealth(ev.who, ev.hp);
        say(`${ev.text} — +${ev.amount}`);
      });
      at(T + 1100, () => back(A()));
    } else if (ev.t === 'wait') {
      at(T, () => {
        say(ev.text);
        view.floats = [];
        A().emote = '...';
      });
      at(T + 760, () => (A().emote = ''));
    } else if (ev.t === 'escape' || ev.t === 'leave') {
      const edge = () => (A().x < 0.5 ? -0.12 : 1.12);
      at(T, () => {
        say(hero && !ev.ok ? ev.text.split(' — ')[0] + '…' : ev.text);
        view.floats = [];
        const a = A();
        a.face = Math.sign(edge() - a.x);
        pose(a, RUN);
        a.walk = true;
        a.x = hero && !ev.ok ? a.x + a.face * 0.12 : edge();
        sfx('steps');
      });
      if (ev.t === 'leave')
        at(T + 900, () => {
          frame.entities = frame.entities.filter((e) => e.id !== ev.who && !(e.tie && e.tie.to === ev.who));
        });
      else if (!ev.ok)
        at(T + 700, () => {
          /* no way out: back to where they stood */
          const a = A();
          back(a);
          a.walk = false;
          a.once = 'hit';
          say(ev.text);
          sfx('fail');
        });
      at(T + 1300, () => {
        const a = A();
        if (a) Object.assign(a, { walk: false, once: '' });
      });
    } else if (ev.t === 'say') {
      /* a line, typed out over the speaker's head, and taken down again */
      const text = String(ev.text || ''),
        typing = Math.min(2600, text.length * 26);
      at(T, () => {
        say('');
        view.floats = [];
        view.speaker = view.pop = ev.who;
      });
      for (let i = 1; i <= text.length; i += 2)
        at(T + (typing * i) / text.length, () => {
          const e = A();
          if (e) e.say = text.slice(0, i + 1);
          if (i % 6 === 1) sfx('talk');
        });
      at(T + eventTime(ev) - 150, () => {
        const e = A();
        if (e) e.say = '';
        view.speaker = view.pop = null;
      });
    } else if (ev.t === 'end') {
      at(T, () => {
        view.floats = [];
        say(ev.text);
        const me = ent(frame.heroId);
        if (ev.result === 'won') {
          pose(me, CHEER);
          sfx('fanfare');
        } else if (ev.result === 'lost') {
          if (me) {
            pose(me, FALLEN);
            me.rot = 90;
            me.once = 'hit';
          }
          sfx('fail');
        } else if (ev.result === 'fled') sfx('teleport');
        view.fightEnd = ev.result === 'won' ? 'Victory!' : ev.result === 'lost' ? 'Defeated…' : ev.result === 'fled' ? 'Got away!' : '';
        if (view.fightEnd) view.fightMsg = ''; // the big word says it; the panels keep the line
        for (const e of frame.entities) if (e.id !== frame.heroId) e.hp = e.maxHp = null; // the bars go
      });
    }
    /* whatever an event set in motion is settled before the next one begins */
    at(T + eventTime(ev) - 60, () => {
      for (const e of frame.entities) if (e.once && e.once !== 'die') e.once = '';
    });
    t += eventTime(ev);
  }
  const total = t + 200;
  steps.sort((a, b) => a.ms - b.ms);

  let i = 0,
    raf = 0,
    finished = false;
  const start = performance.now();
  const show = () => {
    renderStage(root, frame, view);
    if (o.onChange) o.onChange(frame, msg);
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    clearTimeout(guard);
    for (const el of extras) el.remove();
    root.classList.remove('fight');
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
    if (dirty) show();
    if (el >= total) return finish();
    raf = requestAnimationFrame(tick);
  };
  const guard = setTimeout(finish, total / sp + 1500); // background tabs pause animation frames
  root.classList.remove('cut', 'cine');
  root.classList.add('fight');
  show();
  raf = requestAnimationFrame(tick);
  return { skip: finish, total };
}
