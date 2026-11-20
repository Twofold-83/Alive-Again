/* Pointer and keyboard on the stage during a story: selecting, dragging, recording moves, drawing (Director);
 * walking, pointing, choosing (Player). */
import { clamp, clone } from '../core/dom.js';
import { stage, pen, myTurn, hero, mods, directing, app } from '../core/state.js';
import { guidedPick, guidedMark } from './guided.js';
import { rid, r3, toast, $ } from '../core/dom.js';
import { changed, rebuild, paint, undo, submit } from './turn.js';
import { walkHero, setReply, hideVerbs, showVerbs } from './walk.js';
import { render } from './view.js';
import { workshopOpen } from '../build/workshop.js';
import { removeEntity } from './director.js';

let drag = null;
function stagePos(ev) {
  const r = stage.firstElementChild.getBoundingClientRect(); // the world layer: correct even while the camera is zoomed in
  return { x: clamp((ev.clientX - r.left) / r.width, 0, 1), y: clamp((ev.clientY - r.top) / r.height, 0, 1) };
}
export function dropTrack(id) {
  app.draft.tracks = app.draft.tracks.filter((t) => t.id !== id);
}
export function trackEnd(id) {
  const t = app.draft.tracks.find((x) => x.id === id);
  return t ? t.pts[t.pts.length - 3] : 0;
}

stage.addEventListener('pointerdown', (ev) => {
  if (app.cut) return void app.cut.skip();
  if (!myTurn() || app.submitting) return;
  ev.preventDefault();
  if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) document.activeElement.blur();
  const p = stagePos(ev);
  const el = ev.target.closest('.ent');
  const hit = el && app.draft.entities.find((x) => x.id === el.dataset.id);
  drag = null;
  if (app.S.you === 'player') {
    const me = hero(app.draft);
    if (app.pointMode) {
      // what the written action is about: a thing, or a spot
      app.pointMode = false;
      app.draft.point = hit && hit !== me ? { id: hit.id } : { x: r3(p.x), y: r3(p.y) };
      if (!app.draft.action.trim()) app.draft.action = 'Look at';
      return rebuild();
    }
    if (app.S.rules.player === 'tell') return toast('In this story you write what you want to do, and the Director makes it happen');
    if (!me) return toast('You have no character on stage right now — speak or act instead');
    hideVerbs();
    const exitEl = ev.target.closest('.exit'),
      placeEl = ev.target.closest('.place'),
      ask = app.draft.ask;
    if (exitEl && !app.walkMode) {
      // a way out to another place
      const ex = app.draft.exits.find((x) => x.id === exitEl.dataset.exit);
      if (ex.locked) return toast(`“${ex.label}” is locked`);
      app.draft.exit = app.draft.exit === ex.id ? null : ex.id;
      if (app.draft.exit && !app.draft.walked) return walkHero(ex.x, ex.y);
      return changed();
    }
    if (placeEl && ask && ask.kind === 'place' && !app.walkMode) {
      // one of the places the Director marked
      const i = Number(placeEl.dataset.place);
      setReply({ index: i });
      if (!app.draft.walked) return walkHero(ask.places[i].x, ask.places[i].y);
      return changed();
    }
    if (app.walkMode) return walkHero(p.x, p.y);
    if (hit && hit !== me) {
      if (ask && ask.kind === 'target' && ask.targets.includes(hit.id)) {
        setReply({ id: hit.id });
        return rebuild();
      }
      if (ask && ask.kind === 'battle' && hit.hp != null) {
        setReply({ move: 'attack', id: hit.id });
        return rebuild();
      }
      if (app.draft.use) {
        app.draft.target = app.draft.target === hit.id ? null : hit.id;
        app.draft.act = null;
        app.draft.verb = '';
        return changed();
      } // use the chosen item ON this
      if (hit.active && hit.active.verbs.length) return showVerbs(hit, ev); // an active object: what to do with it?
      if (mods().inventory && app.S.rules.player === 'free') {
        app.draft.target = app.draft.target === hit.id ? null : hit.id;
        app.draft.act = null;
        app.draft.verb = '';
        return changed();
      } // reach for it
    }
    return toast(app.draft.walked ? 'You have already walked this turn' : 'Press “Walk”, then click where you want to go');
  } else if (app.drawOn) {
    if (app.draft.drawing.length >= 60) return toast('That is a lot of drawing — clear some first');
    drag = { stroke: { id: rid(), c: pen.c, w: pen.w, pts: [r3(p.x), r3(p.y)] } };
    app.draft.drawing.push(drag.stroke);
  } else {
    const mark = ev.target.closest('.exit, .place'); // exits and marked places can be dragged too
    if (mark) {
      const obj = mark.dataset.exit ? app.draft.exits.find((x) => x.id === mark.dataset.exit) : app.draft.ask.places[Number(mark.dataset.place)];
      drag = { e: obj, dx: obj.x - p.x, dy: obj.y - p.y, mark: true };
      if (mark.dataset.exit) guidedMark(mark.dataset.exit);
      app.uiKey = '';
      stage.setPointerCapture(ev.pointerId);
      return render();
    }
    app.selId = hit ? hit.id : null;
    app.selInv = null;
    if (hit) guidedPick(hit.id); // answers "which one?", or opens that thing's tools
    app.uiKey = '';
    if (hit) {
      drag = { e: hit, dx: hit.x - p.x, dy: hit.y - p.y };
      if (app.rec) {
        const off = trackEnd(hit.id); // a thing's moves follow each other; different things move together
        if (off >= 10000) {
          toast('This one already moves for the full 10 seconds of the step');
          drag = null;
        } else drag.take = { t0: performance.now(), off, last: off, pts: [off, r3(hit.x), r3(hit.y)] };
      }
    }
  }
  if (drag) stage.setPointerCapture(ev.pointerId);
  render();
});
stage.addEventListener('pointermove', (ev) => {
  if (!drag) return;
  const p = stagePos(ev);
  if (drag.stroke) {
    const s = drag.stroke.pts,
      n = s.length;
    if (n < 400 && Math.hypot(p.x - s[n - 2], p.y - s[n - 1]) > 0.006) s.push(r3(p.x), r3(p.y));
    return paint();
  }
  const par = drag.e.tie && app.draft.entities.find((x) => x.id === drag.e.tie.to);
  if (par) {
    // a tied thing: dragging changes how it is held
    drag.e.tie.dx = r3(clamp(((p.x - par.x) / par.scale) * (par.flip ? -1 : 1), -1, 1));
    drag.e.tie.dy = r3(clamp((p.y + 0.04 - par.y) / par.scale, -1, 1));
    return paint();
  }
  drag.e.x = clamp(p.x + drag.dx, 0, 1);
  drag.e.y = clamp(p.y + drag.dy, 0.08, 1);
  if (drag.mark) return paint();
  const tk = drag.take;
  if (tk) {
    const t = Math.round(tk.off + performance.now() - tk.t0);
    if (t >= 10000) return endDrag();
    if (t - tk.last >= 50) {
      tk.pts.push(t, r3(drag.e.x), r3(drag.e.y));
      tk.last = t;
    }
  } else if (app.S.you === 'director' && !drag.dropped) {
    drag.dropped = true;
    dropTrack(drag.e.id);
  }
  paint();
});
function endDrag() {
  if (!drag) return;
  const d = drag;
  drag = null;
  if (d.take) {
    // store the recorded move
    const tk = d.take,
      t = Math.min(10000, Math.round(tk.off + performance.now() - tk.t0));
    tk.pts.push(Math.max(t, tk.last + 1), r3(d.e.x), r3(d.e.y));
    storeTrack(d.e.id, tk.off, tk.pts);
    app.uiKey = '';
  }
  if (d.stroke) {
    if (d.stroke.pts.length < 4) d.stroke.pts.push(d.stroke.pts[0], d.stroke.pts[1]);
    app.uiKey = '';
  }
  if (myTurn()) changed();
}
function storeTrack(id, off, pts) {
  const old = app.draft.tracks.find((x) => x.id === id);
  if (old && old.pts[old.pts.length - 3] <= off) old.pts.push(...pts);
  else {
    dropTrack(id);
    app.draft.tracks.push({ id, pts });
  }
}
/** A ready-made move: steps are [milliseconds, x, y]. It follows that thing's earlier moves in this step. */
export function autoTrack(e, steps) {
  const off = trackEnd(e.id);
  let t = off;
  const pts = [off, r3(e.x), r3(e.y)];
  for (const [dt, x, y] of steps) {
    t += dt;
    if (t > 10000) break;
    pts.push(Math.round(t), r3(clamp(x, 0, 1)), r3(clamp(y, 0.08, 1)));
  }
  if (pts.length < 6) {
    toast('This one already moves for the full 10 seconds of the step');
    return false;
  }
  storeTrack(e.id, off, pts);
  e.x = pts[pts.length - 2];
  e.y = pts[pts.length - 1];
  return true;
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

/* ---------- keyboard (computers) ---------- */
document.addEventListener('keydown', (ev) => {
  if (!app.S || !app.code || !$('#story').hidden || workshopOpen()) return;
  if (ev.key === 'Escape' && (app.walkMode || app.pointMode)) {
    app.walkMode = app.pointMode = false;
    return render();
  }
  const typing = /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName);
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z' && !typing && directing()) {
    ev.preventDefault();
    return undo();
  }
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'd' && !typing && directing() && app.selId) {
    ev.preventDefault();
    const src = app.draft.entities.find((e) => e.id === app.selId);
    if (src) {
      const k = { ...clone(src), id: rid(), x: clamp(src.x + 0.08, 0, 1), say: '' };
      app.draft.entities.push(k);
      app.selId = k.id;
      guidedPick(k.id);
      rebuild();
    }
    return;
  }
  if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
    ev.preventDefault();
    submit();
  } else if (ev.key === 'Escape' && app.cut) app.cut.skip();
  else if (!typing && directing() && app.selId) {
    const sel = app.draft.entities.find((e) => e.id === app.selId);
    if (!sel) return;
    const step = ev.shiftKey ? 0.05 : 0.01;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[ev.key]) {
      sel.x = clamp(sel.x + moves[ev.key][0], 0, 1);
      sel.y = clamp(sel.y + moves[ev.key][1], 0.08, 1);
      dropTrack(sel.id);
    } else if (ev.key === 'Delete' || ev.key === 'Backspace') removeEntity(sel);
    else if (ev.key === '+' || ev.key === '=') sel.scale = clamp(sel.scale * 1.15, 0.3, 6);
    else if (ev.key === '-') sel.scale = clamp(sel.scale / 1.15, 0.3, 6);
    else if (ev.key === 'r') sel.rot = (sel.rot + 15) % 360;
    else if (ev.key === 'f') sel.flip = !sel.flip;
    else return;
    ev.preventDefault();
    rebuild();
  }
});
