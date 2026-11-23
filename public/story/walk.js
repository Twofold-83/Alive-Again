/* What the Player does on the stage: walking (once per turn), answering what the Director asked, verbs on active objects. */
import { clamp, h, add } from '../core/dom.js';
import { findWalk, sample } from '../stage/level.js';
import { toast, $ } from '../core/dom.js';
import { hero, heroStart, app, mods } from '../core/state.js';
import { saveDraft, paint, changed, rebuild, submit } from './turn.js';
import { audio } from '../core/audio.js';
import { walkable, called } from '../shared/scene-model.js';
import { render } from './view.js';

/* ---------- the Player's walk: press Walk, click where to go; once per turn ---------- */
export function stopWalkAnim() {
  cancelAnimationFrame(app.walkAnim);
  app.walkAnim = 0;
}
/** Send the hero to (x,y). It finds its own way around walls and solid things and walks there at an easy pace. */
export function walkHero(x, y) {
  const me = hero(app.draft),
    st = heroStart() || me;
  const track = findWalk(app.draft, st.x, st.y, x, clamp(y, 0.08, 1));
  app.walkMode = false;
  if (!track) {
    toast('There is no way to get there');
    return render();
  }
  /* a trap on the way: the walk stops there and something happens */
  let sprung = null;
  const traps = app.draft.entities.filter((e) => e.near && e.id !== me.id);
  if (traps.length)
    for (let t = 0, last = track[track.length - 3]; t <= last && !sprung; t += 40) {
      const pt = sample(track, t);
      const hit = pt && traps.find((e) => Math.hypot(pt[0] - e.x, (pt[1] - e.y) * 0.75) < 0.085 * Math.max(1, e.scale));
      if (hit && t > 0) {
        const kept = [];
        for (let i = 0; i < track.length && track[i] < t; i += 3) kept.push(track[i], track[i + 1], track[i + 2]);
        kept.push(t, pt[0], pt[1]);
        track.length = 0;
        track.push(...kept);
        sprung = hit;
      }
    }
  app.draft.heroTrack = track;
  app.draft.walked = true;
  const end = track[track.length - 3],
    t0 = performance.now(),
    fx = track[track.length - 2],
    fy = track[track.length - 1];
  const frame = () => {
    // show the walk right away; the Director sees the same on their turn
    const t = performance.now() - t0,
      p = sample(track, t);
    if (t >= end || !p) {
      me.x = fx;
      me.y = fy;
      app.walkAnim = 0;
      if (sprung) return spring(me, sprung);
      return changed();
    }
    me.x = p[0];
    me.y = p[1];
    paint();
    app.walkAnim = requestAnimationFrame(frame);
  };
  stopWalkAnim();
  me.x = fx;
  me.y = fy;
  saveDraft();
  app.uiKey = '';
  render();
  me.x = st.x;
  me.y = st.y;
  app.walkAnim = requestAnimationFrame(frame);
}
/** The hero walked into a trap: both shake, "Something happened!", and the turn goes to the Director. */
function spring(me, thing) {
  app.draft.tripped = thing.id;
  me.fx = 'shake';
  thing.fx = 'shake';
  toast('Something happened!');
  audio.sfx('alarm');
  saveDraft();
  render();
  setTimeout(() => {
    me.fx = '';
    submit();
  }, 1300);
}
export function undoWalk() {
  const me = hero(app.draft),
    st = heroStart();
  stopWalkAnim();
  if (me && st) {
    me.x = st.x;
    me.y = st.y;
  }
  app.draft.heroTrack = null;
  app.draft.walked = false;
  rebuild();
}
/** The Player's answer to what the Director asked; also mirrored into the draft so the stage previews it. */
export function setReply(r) {
  const ask = app.draft.ask || {};
  app.draft.reply = r;
  app.draft.answer = null;
  if (ask.kind === 'target') app.draft.target = null;
  if (!r) return;
  if (ask.kind === 'place') app.draft.answer = { kind: 'place', label: ask.places[r.index].label };
  if (ask.kind === 'discard') {
    const it = app.draft.sheet.inv.find((i) => i.id === r.id);
    if (it) app.draft.answer = { kind: 'discard', asset: it.asset, name: it.name };
  }
  if (ask.kind === 'target') {
    app.draft.answer = { kind: 'target', verb: ask.verb || 'chooses' };
    app.draft.target = r.id;
  }
}
/* ---------- acting on the stage: a verb, aimed at a thing or at a spot ---------- */
export function hideVerbs() {
  const v = $('#verbs');
  if (v) v.remove();
}
/** Where the hero ends up for a click at x, y: on the spot if one can stand there, else straight below it (a click high on a wall). */
function standBelow(x, y) {
  for (let yy = clamp(y, 0.08, 0.98); yy <= 0.985; yy += 0.01) if (walkable(app.draft, x, yy)) return yy;
  return null;
}
/** What the Director set up for this action on a clickable thing: shown at once, the turn goes on. */
function react(e, verb) {
  const re = e.active && e.active.re && e.active.re[verb];
  if (!re) return false;
  if (re.used) e.used = true;
  app.draft.reacted = [...(app.draft.reacted || []).filter((r) => !(r.id === e.id && r.verb === verb)), { id: e.id, verb }].slice(-8);
  const old = $('#reaction');
  if (old) old.remove();
  if (re.text) {
    const box = h(
      'div',
      { id: 'reaction', onclick: () => box.remove() },
      h('b', {}, `${verb}: ${called(e)}`),
      h('p', {}, re.text),
      h('small', {}, 'click to close'),
    );
    add($('#stageWrap'), box);
  }
  audio.sfx('pop');
  changed();
  return true;
}
/**
 * The Player does something on the stage: `verb`, to a thing (`what`) or to the spot `p` ("Push here").
 * Walking happens at once. If the Director prepared an answer for exactly this action on this thing, it shows at
 * once too. Anything else is told to the Director with the turn (draft.point).
 */
export function intend(verb, what, p) {
  if (verb === 'Walk') {
    const y = standBelow(p.x, p.y);
    if (y == null) return toast('There is nowhere to stand there');
    return walkHero(p.x, y);
  }
  if (!(what && react(what, verb))) {
    app.draft.point = what ? { verb, id: what.id } : { verb, x: Math.round(p.x * 1000) / 1000, y: Math.round(p.y * 1000) / 1000 };
    app.draft.target = null; // not reaching for something else at the same time
  }
  rebuild();
}
/** The little menu at a click: what can be done here. In an adventure every click gets one; elsewhere only clickable things do. */
export function showClickMenu(hit, p, ev) {
  hideVerbs();
  const wrap = $('#stageWrap'),
    r = wrap.getBoundingClientRect(),
    me = hero(app.draft),
    what = hit && hit !== me ? hit : null,
    adventure = app.S.rules.type === 'adventure',
    name = what ? called(what) : 'this spot',
    offered = what && what.active ? what.active.verbs : [];
  const item = (label, fn, o = {}) =>
    h(
      'button',
      {
        ...o,
        onclick: () => {
          hideVerbs();
          fn();
        },
      },
      label,
    );
  const verb = (v, o) => item(['Look at', 'Use'].includes(v) ? `${v} ${name}` : v, () => intend(v, what, p), o);
  add(
    wrap,
    h(
      'div',
      {
        id: 'verbs',
        class: 'clickmenu',
        style: `left:${Math.min(Math.max(4, ev.clientX - r.left), r.width - 190)}px;top:${Math.max(4, Math.min(ev.clientY - r.top - 20, r.height - 190))}px`,
      },
      what && h('b', {}, name),
      adventure && item('Walk here', () => intend('Walk', null, p), { id: 'cmWalk', disabled: app.draft.walked || app.S.rules.player === 'tell' }),
      adventure && verb('Look at', { id: 'cmLook' }),
      adventure && verb('Use', { id: 'cmUse' }),
      adventure &&
        what &&
        !what.active &&
        mods().inventory &&
        app.S.rules.player === 'free' &&
        item(
          `Reach for ${name}`,
          () => {
            app.draft.target = app.draft.target === what.id ? null : what.id;
            app.draft.point = null;
            changed();
          },
          { id: 'cmTake' },
        ),
      /* a clickable thing: the actions the Director offers on it */
      offered.filter((v) => !(adventure && ['Look at', 'Use'].includes(v))).map((v) => verb(v)),
      h('button', { class: 'link', onclick: hideVerbs }, 'never mind'),
    ),
  );
}
/** Before sending the turn: a walk still being shown jumps to its end. */
export function settleWalk() {
  if (!app.walkAnim) return;
  stopWalkAnim();
  const me = hero(app.draft),
    tr = app.draft.heroTrack;
  if (me && tr) {
    me.x = tr[tr.length - 2];
    me.y = tr[tr.length - 1];
  }
}
