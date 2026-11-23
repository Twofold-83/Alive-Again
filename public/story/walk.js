/* What the Player does on the stage: walking (once per turn), answering what the Director asked, verbs on active objects. */
import { clamp, h, add } from '../core/dom.js';
import { findWalk, sample } from '../stage/level.js';
import { toast, $ } from '../core/dom.js';
import { hero, heroStart, app } from '../core/state.js';
import { saveDraft, paint, changed, rebuild, submit } from './turn.js';
import { audio } from '../core/audio.js';
import { walkable } from '../shared/scene-model.js';
import { spriteTitle } from '../core/catalog.js';
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
  if (ask.kind === 'target' || ask.kind === 'battle') app.draft.target = null;
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
  if (ask.kind === 'battle') {
    app.draft.answer = { kind: 'battle', move: r.move };
    app.draft.target = r.move === 'attack' || r.move === 'speak' ? r.id || null : null;
  }
}
/* ---------- active objects: hover shows the name, a click offers what the Director allowed ---------- */
export function hideVerbs() {
  const v = $('#verbs');
  if (v) v.remove();
}
export function showVerbs(e, ev) {
  const wrap = $('#stageWrap'),
    r = wrap.getBoundingClientRect();
  add(
    wrap,
    h(
      'div',
      { id: 'verbs', style: `left:${Math.min(ev.clientX - r.left, r.width - 220)}px;top:${Math.max(4, ev.clientY - r.top - 70)}px` },
      h('b', {}, e.active.name),
      e.active.verbs.map((v) =>
        h(
          'button',
          {
            onclick: () => {
              app.draft.act = { id: e.id, verb: v };
              app.draft.target = e.id;
              app.draft.verb = v;
              hideVerbs();
              rebuild();
            },
          },
          v,
        ),
      ),
      h('button', { class: 'link', onclick: hideVerbs }, 'never mind'),
    ),
  );
}
/* ---------- a click on the stage in an adventure: walk here, look at, use ---------- */
const nameOf = (e) => (e.active && e.active.name) || spriteTitle(e.asset.startsWith('p:') ? e.asset : 'p:thing').toLowerCase();
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
  const wrap = $('#stageWrap');
  const old = $('#reaction');
  if (old) old.remove();
  if (re.text) {
    const box = h(
      'div',
      { id: 'reaction', onclick: () => box.remove() },
      h('b', {}, `${verb}: ${nameOf(e)}`),
      h('p', {}, re.text),
      h('small', {}, 'click to close'),
    );
    add(wrap, box);
  }
  audio.sfx('pop');
  changed();
  return true;
}
export function showClickMenu(hit, p, ev) {
  hideVerbs();
  const wrap = $('#stageWrap'),
    r = wrap.getBoundingClientRect(),
    me = hero(app.draft),
    what = hit && hit !== me ? hit : null,
    name = what ? nameOf(what) : 'this spot';
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
  const plain = (verb) => () => {
    if (what && react(what, verb)) return;
    app.draft.action = verb;
    app.draft.point = what ? { id: what.id } : { x: Math.round(p.x * 1000) / 1000, y: Math.round(p.y * 1000) / 1000 };
    rebuild();
  };
  const special = what && what.active ? what.active.verbs.filter((v) => !['Look at', 'Use'].includes(v)) : [];
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
      item(
        'Walk here',
        () => {
          const y = standBelow(p.x, p.y);
          if (y == null) return toast('There is nowhere to stand there');
          walkHero(p.x, y);
        },
        { id: 'cmWalk', disabled: app.draft.walked || app.S.rules.player === 'tell' },
      ),
      item(what ? `Look at ${name}` : 'Look at this spot', plain('Look at'), { id: 'cmLook' }),
      item(what ? `Use ${name}` : 'Use this spot', plain('Use'), { id: 'cmUse' }),
      /* a clickable thing: the other actions the Director offers on it */
      special.map((v) =>
        item(v, () => {
          if (react(what, v)) return;
          app.draft.act = { id: what.id, verb: v };
          app.draft.target = what.id;
          app.draft.verb = v;
          rebuild();
        }),
      ),
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
