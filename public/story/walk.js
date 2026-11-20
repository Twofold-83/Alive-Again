/* What the Player does on the stage: walking (once per turn), answering what the Director asked, verbs on active objects. */
import { clamp, h } from '../core/dom.js';
import { findWalk, sample } from '../stage/level.js';
import { toast, $ } from '../core/dom.js';
import { hero, heroStart, app } from '../core/state.js';
import { saveDraft, paint, changed, rebuild } from './turn.js';
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
    app.draft.target = r.move === 'attack' ? r.id : null;
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
  wrap.append(
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
