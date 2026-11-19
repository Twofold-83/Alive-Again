/*
 * The Director's panel. A turn is built step by step:
 *
 *   - The step bar on top shows the steps of this turn. Everything done within
 *     one step plays at the same time; "+ Next step" starts what comes after.
 *     There is no limit on steps. A step can be reset, earlier steps can be
 *     returned to, and "Clear steps" starts the turn over.
 *   - Below it, one question at a time: "What happens in this step?" -> a broad
 *     choice -> narrower choices. Nothing here is modal: Back only navigates,
 *     and the stage always shows the step as it currently stands.
 *
 * G.path is where the Director is in the question tree, G.sel the character or
 * thing the current question is about. Each screen of the tree is one function
 * in screens/; buildGuided() draws the step bar, makes the shared kit of helpers
 * and hands it to the screen that is open.
 */
import { allItems, assetLabel } from '../core/catalog.js';
import { h, clamp } from '../core/dom.js';
import { glyphNode } from '../stage/render.js';
import { SCREENS } from './screens/index.js';

export const G = { path: [], sel: null, log: [], busy: false, cat: '', q: '', note: '', ask: '' };
export function resetGuided() { Object.assign(G, { path: [], sel: null, log: [], busy: false, cat: '', q: '', note: '', exit: null, pick: null, foe: null, askKind: '' }); }
export function guidedKey() { return [G.path.join('>'), G.sel, G.log.length, G.busy, G.cat, G.exit, G.pick, G.foe, G.style, (G.did || []).length].join('~'); }
/** At the start of the Director's turn: in a battle, the battle tools are what they need. */
export function guidedStart(d) { G.did = []; if (d && d.battle) G.path = ['battle']; }

/** Which stage tool the open screen needs: dragging records a path, or draws. */
export function guidedTool() { const top = G.path[G.path.length - 1]; return top === 'move:rec' ? 'rec' : top === 'draw' ? 'draw' : ''; }

const PICKERS = ['speak', 'move', 'give', 'tie'];   // questions that start with "which one?"
/** A tap on something on the stage: answers an open "which one?", otherwise opens that thing's own tools. */
export function guidedPick(id) {
  const top = G.path[G.path.length - 1] || '';
  if (top === 'tie') { G.pick = id; return; }
  if (PICKERS.includes(top) && !G.sel) { G.sel = id; return; }
  if (!top || top === 'thing' || top === 'exit') { G.path = ['thing']; G.sel = id; }
}
/** A click on an exit marker opens that exit's tools. */
export function guidedMark(exitId) {
  const top = G.path[G.path.length - 1] || '';
  if (!top || top === 'thing' || top === 'exit') { G.path = ['exit']; G.sel = null; G.exit = exitId; }
}
export function short(s, n = 28) { return s.length > n ? s.slice(0, n) + '…' : s; }

export function buildGuided(p, c) {
  const d = c.draft, S = c.S, code = c.code, top = G.path[G.path.length - 1] || '';
  const sel = d.entities.find((e) => e.id === G.sel);
  const me = d.entities.find((e) => e.id === d.heroId);
  const lab = (e) => assetLabel(e.asset);
  const ws = c.mode === 'workshop';                       // the same tools, used on a prepared scene in the workshop
  const setup = ws || S.turn === 0, stepNo = ws ? 1 : d.steps.length + 1;
  if (p._gpath !== G.path.join('>') + G.sel) { p._gpath = G.path.join('>') + G.sel; p.scrollTop = 0; }

  /* ---------- navigation ---------- */
  const home = () => { G.path = []; G.sel = null; c.select(null); };
  const enter = (step) => { G.path.push(step); c.select(G.sel); c.rebuild(); };
  const back = () => {
    if (PICKERS.includes(top) && G.sel && G.path.length === 1) G.sel = null; else G.path.pop();
    if (!G.path.length) G.sel = null;
    c.select(G.sel); c.rebuild();
  };
  const done = (label) => { if (label && !setup) G.log.push(label); home(); c.rebuild(); };

  /* ---------- the step bar ---------- */
  if (!setup) {
    p.append(h('div', { class: 'stepbar' },
      h('div', { class: 'steps' }, h('span', { class: 'dim small' }, 'Steps'),
        d.steps.map((_, i) => h('button', { class: 'stepchip', title: 'Go back to this step (later steps are removed)', onclick: () => { if (confirm(`Go back to step ${i + 1}? Steps after it will be removed.`)) c.gotoStep(i); } }, String(i + 1))),
        h('button', { class: 'stepchip on', title: 'The step you are working on' }, String(stepNo)),
        h('button', { class: 'stepadd', id: 'nextStep', title: 'Finish this step and start what happens after it', onclick: () => c.nextStep() }, '＋ Next step')),
      h('div', { class: 'row' },
        h('button', { class: 'grow', id: 'previewBtn', onclick: c.preview }, c.cutting() ? '■ Stop' : '▶ Preview turn'),
        h('button', { class: 'grow', id: 'undoBtn', title: 'Undo the last change (Ctrl+Z)', disabled: !c.canUndo(), onclick: () => c.undo() }, '↶ Undo'),
        h('button', { class: 'grow', id: 'resetStep', title: 'Undo everything in this step', onclick: () => c.resetStep() }, '⟲ Reset step'),
        h('button', { class: 'grow', id: 'clearSteps', title: 'Start the whole turn over', onclick: () => { if (d.steps.length === 0 || confirm('Remove every step of this turn and start over?')) c.clearSteps(); } }, '🗑 Clear steps'))));
  }

  /* ---------- building blocks ---------- */
  const head = (title, sub) => p.append(h('div', { class: 'ghead' }, h('button', { class: 'gback', onclick: back, 'aria-label': 'Back' }, '◀ Back'), h('div', {}, h('b', {}, title), sub && h('small', {}, sub))));
  const opt = (icon, label, hint, fn, on) => h('button', { class: 'gopt' + (on ? ' on' : ''), onclick: fn }, h('span', { class: 'gi' }, icon), h('span', { class: 'gl' }, h('b', {}, label), hint && h('small', {}, hint)));
  const doneBtn = (label, text = '✓ Done') => h('button', { class: 'primary gdone', onclick: () => done(typeof label === 'function' ? label() : label) }, text);
  const picker = (title) => {
    head(title, 'Pick one here, or click it on the stage.');
    p.append(d.entities.length ? h('div', { class: 'grid' }, d.entities.map((e) => h('button', { class: e.id === d.heroId ? 'heroopt' : '', onclick: () => { G.sel = e.id; c.select(e.id); c.rebuild(); } }, glyphNode(code, e.asset))))
      : h('p', { class: 'dim' }, 'The stage is empty. Go back and add something first.'));
  };
  const chips = (list, key, onPick) => h('div', { class: 'chips wrap' }, list.map(([v, label]) => h('button', {
    'data-mark': `${key}=${v}`, class: String(d[key] ?? '') === String(v) ? 'on' : '', onclick: () => { d[key] = v; if (onPick) onPick(v); c.changed(); } }, label)));
  const lookRow = () => {
    const b = (label, title, fn) => h('button', { class: 'grow', title, 'aria-label': title, onclick: () => { fn(); c.changed(); } }, label);
    return h('div', { class: 'row' },
      b('➖', 'Smaller', () => { sel.scale = clamp(sel.scale / 1.3, 0.3, 6); }), b('➕', 'Bigger', () => { sel.scale = clamp(sel.scale * 1.3, 0.3, 6); }),
      b('↺', 'Rotate left', () => { sel.rot = (sel.rot - 15) % 360; }), b('↻', 'Rotate right', () => { sel.rot = (sel.rot + 15) % 360; }), b('↔️', 'Flip', () => { sel.flip = !sel.flip; }));
  };
  const sayInput = (ph) => h('input', { placeholder: ph, maxlength: 160, value: sel.say, enterkeyhint: 'done', oninput: (ev) => { sel.say = ev.target.value; c.changedQuiet(); } });
  const pickSel = (list, key, title) => h('select', { title, 'aria-label': title, onchange: (ev) => { sel[key] = ev.target.value; c.changedQuiet(); } }, list.map(([v, l]) => h('option', { value: v, selected: sel[key] === v }, l)));
  const walk = (label, x, y) => {       // an automatic move, timed by distance
    const ms = clamp(Math.hypot(x - sel.x, y - sel.y) * 3200, 500, 3000);
    if (c.autoTrack(sel, [[ms, x, y]])) done(`${lab(sel)} ${label}`);
  };
  /** Enter: start outside the screen and walk to where the thing stands now. */
  const comeIn = (fromX) => { const ms = clamp(Math.abs(sel.x - fromX) * 3200, 500, 3000); c.dropTrack(sel.id); d.tracks.push({ id: sel.id, pts: [0, fromX, sel.y, Math.round(ms), sel.x, sel.y] }); return true; };
  const place = (asset) => { const e = c.addEntity(asset); if (e) { G.sel = e.id; G.path = ['thing']; if (!setup) G.log.push(`${lab(e)} appears`); c.select(e.id); c.rebuild(); } };
  const itemGrid = (items, onPick) => h('div', { class: 'grid' }, items.map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => onPick(i) }, glyphNode(code, i.asset))));
  const searchGrid = (onPick, ph) => {
    const grid = h('div', { class: 'grid' });
    const fill = () => {
      const q = G.q.trim().toLowerCase();
      const items = q ? allItems().filter((i) => i.name.includes(q)).slice(0, 150) : [];
      grid.replaceChildren(...items.map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => onPick(i) }, glyphNode(code, i.asset))));
      if (q && !items.length) grid.append(h('p', { class: 'dim', style: 'grid-column:1/-1;margin:4px' }, 'Nothing found.'));
    };
    fill();
    return [h('input', { type: 'search', placeholder: ph, value: G.q, enterkeyhint: 'search', oninput: (ev) => { G.q = ev.target.value; fill(); } }), grid];
  };

  const kit = { p, c, d, S, code, top, sel, me, lab, ws, setup, stepNo, home, enter, back, done, head, opt, doneBtn, picker, chips, lookRow, sayInput, pickSel, walk, comeIn, place, itemGrid, searchGrid };
  const screen = SCREENS[top || 'root'];
  if (screen) return void screen(kit);
  home(); buildGuided(p, c);
}
