/*
 * The scene workshop: a full-screen editor, separate from the turn, where the
 * Director builds scenes — tile levels (floors and walls), objects (solid or
 * not), backdrop, weather, music, and where the hero starts.
 *
 * It works on a list of scene documents { id, name, scene }:
 *   - prepared scenes, saved with the story and loadable during any turn
 *     ("Change the scene" > "A prepared scene"), and
 *   - on the Director's own turn, the scene that is on stage right now.
 * Prepared scenes save themselves as they are edited. They can be exported to a
 * file and imported into another story.
 */
import { PIXEL, CATEGORIES, allItems, BACKDROPS, backdropCss, pixelInfo, assetLabel } from './catalog.js';
import { MOODS } from './audio.js';
import { h, clone, clamp, norm, glyphNode, renderStage, setCell, cellAt, LEVEL_W, LEVEL_H } from './stage.js';
import { WEATHER } from './consts.js';

const W = { open: false, c: null, list: [], cur: null, tab: 'tiles', tool: 'brush', size: 1, a: '', k: 'f', tcat: '', ocat: '', q: '', sel: null, undo: [], redo: [], drag: null, walls: true, liveDirty: false, saveT: 0, el: null };
export const workshopOpen = () => W.open;
const rid = () => Math.random().toString(36).slice(2, 10);
const $root = () => document.querySelector('#workshop');

const blankScene = () => norm({
  backdrop: 'b:meadow', mood: 'm:none', narration: '', action: '', heroId: 'hero', entities: [W.c.blankHero()], drawing: [], weather: '',
  tracks: [], burst: '', sfx: '', card: '', choices: [], steps: [], sheet: { inv: [], stats: [] }, target: null, use: null, roll: null, level: null,
});
const library = () => W.list.filter((d) => !d.live).map((d) => ({ id: d.id, name: d.name, mx: d.mx, my: d.my, scene: d.scene }));
const docs = () => W.list.filter((d) => !d.live);
const tileCats = () => PIXEL.filter((c) => c.group === 'tile');
const objectCats = () => [...PIXEL.filter((c) => c.group !== 'tile'), ...PIXEL.filter((c) => c.group === 'tile').map((c) => ({ ...c, label: c.label + ' (as a piece)' })), ...CATEGORIES.map((c) => ({ ...c, label: '😀 ' + c.label }))];

export function openWorkshop(c) {
  W.c = c; W.open = true; W.sel = null; W.undo = []; W.redo = []; W.liveDirty = false; W.tab = 'tiles'; W.tool = 'brush'; W.q = ''; W.map = false; W.node = null;
  W.list = [...(c.live ? [c.live] : []), ...c.scenes.map((s) => ({ ...s, scene: norm(s.scene) }))];
  if (!W.list.length) W.list.push({ id: rid(), name: 'Scene 1', scene: blankScene() });
  docs().forEach((d, i) => { if (d.mx == null || (d.mx === 0.5 && d.my === 0.5 && docs().length > 1 && i > 0)) { d.mx = ((i % 4) + 0.5) / 4; d.my = (Math.floor(i / 4) % 3 + 0.5) / 3; } });
  W.cur = W.list[0];
  if (!W.a) { const t = tileCats()[0]; if (t) { W.a = t.items[0].asset; W.k = t.items[0].kind === 'wall' ? 'w' : 'f'; } }
  const root = $root();
  const stage = h('div', { class: 'stage', id: 'wsStage' });
  W.el = { bar: h('header', {}), list: h('aside', { class: 'wslist' }), stage, tools: h('aside', { class: 'wstools' }) };
  W.el.map = h('div', { class: 'wsmap', hidden: true });
  root.replaceChildren(W.el.bar, h('div', { class: 'wsbody' }, W.el.list, h('div', { class: 'wsmid' }, stage, W.el.map, h('p', { class: 'dim small', id: 'wsHint' })), W.el.tools));
  stage.addEventListener('pointerdown', down); stage.addEventListener('pointermove', move); stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  document.addEventListener('keydown', keys);
  root.hidden = false;
  draw();
}
function close() {
  if (W.liveDirty && !confirm('You changed the scene on stage but did not put the changes on stage. Close anyway?')) return;
  flush();
  W.open = false; document.removeEventListener('keydown', keys); $root().hidden = true; $root().replaceChildren();
}

/* ---------- saving ---------- */
function flush() { if (W.saveT) { clearTimeout(W.saveT); W.saveT = 0; W.c.save(library()); } }
function changed() {
  if (W.cur.live) W.liveDirty = true; else { clearTimeout(W.saveT); W.saveT = setTimeout(() => { W.saveT = 0; W.c.save(library()); }, 700); }
}
function remember() { W.undo.push(JSON.stringify(W.cur.scene)); if (W.undo.length > 60) W.undo.shift(); W.redo = []; }
function undo(dir) {
  const from = dir < 0 ? W.undo : W.redo, to = dir < 0 ? W.redo : W.undo;
  if (!from.length) return;
  to.push(JSON.stringify(W.cur.scene)); W.cur.scene = JSON.parse(from.pop()); W.sel = null; changed(); draw();
}
function keys(ev) {
  if (!W.open) return;
  const typing = /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName);
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z') { ev.preventDefault(); undo(ev.shiftKey ? 1 : -1); } else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'y') { ev.preventDefault(); undo(1); }
  else if (!typing && (ev.key === 'Delete' || ev.key === 'Backspace') && W.sel && W.sel !== W.cur.scene.heroId) { ev.preventDefault(); remember(); W.cur.scene.entities = W.cur.scene.entities.filter((e) => e.id !== W.sel); W.sel = null; changed(); draw(); }
}

/* ---------- drawing the workshop ---------- */
const paintStage = () => renderStage(W.el.stage, W.cur.scene, { code: W.c.code, names: W.c.names, selId: W.sel, showKinds: W.walls });
function draw() { W.el.stage.hidden = W.map; W.el.map.hidden = !W.map; if (W.map) drawMap(); else paintStage(); drawBar(); drawList(); drawTools(); }
function pick(doc) { flush(); W.cur = doc; W.sel = null; W.undo = []; W.redo = []; W.map = false; draw(); }

function drawBar() {
  const cur = W.cur, can = !!W.c.use;
  W.el.bar.replaceChildren(
    h('b', {}, '🛠️ Scene workshop'),
    h('span', { class: 'dim' }, cur.live ? 'editing the scene on stage' : `editing “${cur.name}”`),
    h('span', { class: 'grow' }),
    W.c.adventure && h('button', { id: 'wsMap', class: W.map ? 'on' : '', title: 'How the prepared scenes connect', onclick: () => { W.map = !W.map; W.node = null; draw(); } }, '🗺️ Map'),
    h('button', { title: 'Undo (Ctrl+Z)', disabled: !W.undo.length, onclick: () => undo(-1) }, '↶ Undo'),
    h('button', { title: 'Redo (Ctrl+Y)', disabled: !W.redo.length, onclick: () => undo(1) }, '↷ Redo'),
    h('button', { class: W.walls ? 'on' : '', title: 'Mark walls and solid things in red', onclick: () => { W.walls = !W.walls; draw(); } }, '▦ Show what blocks'),
    cur.live
      ? h('button', { class: 'primary', id: 'wsUse', onclick: () => { W.c.use(cur); W.liveDirty = false; close(); } }, '✓ Put these changes on stage')
      : h('button', { class: 'primary', id: 'wsUse', disabled: !can, title: can ? '' : 'You can bring a scene on stage during your own turn', onclick: () => { flush(); W.c.use(cur); close(); } }, can ? '▶ Use this scene in the story now' : 'Usable on your turn'),
    h('button', { id: 'wsClose', onclick: close }, 'Close'));
}

function drawList() {
  const cur = W.cur;
  const add = (doc) => { const n = docs().length; doc.mx = ((n % 4) + 0.5) / 4; doc.my = (Math.floor(n / 4) % 3 + 0.5) / 3; W.list.push(doc); changed(); W.c.save(library()); pick(doc); };
  const file = h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: async () => {
    try {
      const j = JSON.parse(await file.files[0].text()), got = Array.isArray(j) ? j : j.scenes;
      if (!Array.isArray(got) || !got.length) throw new Error('No scenes in that file');
      for (const s of got.slice(0, 40)) if (s && s.scene && Array.isArray(s.scene.entities)) W.list.push({ id: rid(), name: String(s.name || 'Imported scene').slice(0, 40), scene: norm(s.scene) });
      W.c.save(library()); draw(); W.c.toast('Scenes imported');
    } catch (e) { W.c.toast('Could not read that file: ' + e.message); }
    file.value = '';
  } });
  W.el.list.replaceChildren(
    h('h3', {}, 'Scenes'),
    h('div', { class: 'col' }, W.list.map((d) => h('button', { class: 'wsdoc' + (d === cur ? ' on' : ''), onclick: () => pick(d) },
      h('i', { style: `background:${backdropCss(W.c.code, d.scene.backdrop)}` }), h('span', {}, h('b', {}, d.name), h('small', {}, d.live ? 'in the story right now' : `${d.scene.entities.length - 1} things${d.scene.level ? ' · level' : ''}`))))),
    h('button', { id: 'wsNew', onclick: () => add({ id: rid(), name: `Scene ${library().length + 1}`, scene: blankScene() }) }, '＋ New scene'),
    h('button', { id: 'wsDup', onclick: () => add({ id: rid(), name: cur.live ? 'Copy of the stage' : `${cur.name} (copy)`.slice(0, 40), scene: norm({ ...clone(cur.scene), steps: [] }) }) }, cur.live ? '⧉ Save a copy as a prepared scene' : '⧉ Duplicate'),
    !cur.live && h('button', { class: 'danger', onclick: () => { if (!confirm(`Delete “${cur.name}”?`)) return; W.list = W.list.filter((d) => d !== cur); W.c.save(library()); if (!W.list.length) W.list.push({ id: rid(), name: 'Scene 1', scene: blankScene() }); pick(W.list[0]); } }, '🗑 Delete'),
    h('hr', {}),
    h('button', { disabled: !library().length, onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify({ twofoldScenes: 1, scenes: library() })], { type: 'application/json' })), download: 'twofold-scenes.json' }); a.click(); } }, '⬇ Save scenes to a file'),
    h('button', { onclick: () => file.click() }, '⬆ Load scenes from a file'), file,
    h('p', { class: 'dim small' }, 'Prepared scenes are kept with this story. Save them to a file to reuse them in another one.'));
}

/* ---------- the map: how prepared scenes connect through exits ---------- */
const linked = (a, b) => a.scene.exits.some((x) => x.to === b.id);
function connect(a, b) {
  const dx = b.mx - a.mx, dy = b.my - a.my, side = Math.abs(dx) >= Math.abs(dy);
  const at = (far) => (side ? { x: far ? 0.94 : 0.06, y: 0.6 } : { x: 0.5, y: far ? 0.95 : 0.16 });
  if (!linked(a, b)) a.scene.exits.push({ id: rid(), to: b.id, label: b.name, locked: false, ...at(side ? dx > 0 : dy > 0) });
  if (!linked(b, a)) b.scene.exits.push({ id: rid(), to: a.id, label: a.name, locked: false, ...at(side ? dx <= 0 : dy <= 0) });
}
function drawMap() {
  const m = W.el.map, list = docs();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none');
  for (const a of list) for (const b of list) if (a.id < b.id && (linked(a, b) || linked(b, a))) {
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line'), locked = [...a.scene.exits.filter((x) => x.to === b.id), ...b.scene.exits.filter((x) => x.to === a.id)].some((x) => x.locked);
    ln.setAttribute('x1', a.mx * 100); ln.setAttribute('y1', a.my * 100); ln.setAttribute('x2', b.mx * 100); ln.setAttribute('y2', b.my * 100); ln.setAttribute('class', locked ? 'locked' : '');
    svg.append(ln);
  }
  m.replaceChildren(svg, ...list.map((d) => {
    const n = h('button', { class: 'node' + (W.node === d.id ? ' on' : ''), style: `left:${d.mx * 100}%;top:${d.my * 100}%` }, h('i', { style: `background:${backdropCss(W.c.code, d.scene.backdrop)}` }), h('b', {}, d.name));
    n.dataset.node = d.id;
    n.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); n.setPointerCapture(ev.pointerId);
      const r = m.getBoundingClientRect(); let moved = false;
      const mv = (e2) => { moved = true; d.mx = clamp((e2.clientX - r.left) / r.width, 0.06, 0.94); d.my = clamp((e2.clientY - r.top) / r.height, 0.08, 0.92); n.style.left = d.mx * 100 + '%'; n.style.top = d.my * 100 + '%'; };
      const end = () => {
        n.removeEventListener('pointermove', mv); n.removeEventListener('pointerup', end);
        if (!moved) {                                       // a click: select, or connect to the one already selected
          const from = list.find((x) => x.id === W.node);
          if (from && from !== d) { connect(from, d); W.node = null; W.c.toast(`“${from.name}” and “${d.name}” are now connected`); } else W.node = W.node === d.id ? null : d.id;
        }
        W.c.save(library()); draw();
      };
      n.addEventListener('pointermove', mv); n.addEventListener('pointerup', end);
    });
    return n;
  }));
}
function mapTools() {
  const list = docs(), kids = [], hint = document.querySelector('#wsHint');
  hint.textContent = 'Click one scene, then another, to connect them. Drag scenes to arrange the map.';
  const pairs = [];
  for (const a of list) for (const b of list) if (a.id < b.id && (linked(a, b) || linked(b, a))) pairs.push([a, b]);
  const both = (a, b) => [...a.scene.exits.filter((x) => x.to === b.id), ...b.scene.exits.filter((x) => x.to === a.id)];
  const node = list.find((x) => x.id === W.node);
  kids.push(h('div', { class: 'card' }, h('h3', {}, '🗺️ The map of this adventure'),
    h('p', { class: 'dim small' }, 'Each connection puts an exit in both scenes, leading to the other. When the Player walks to an exit and you agree, the story travels to that scene.'),
    node ? h('div', { class: 'row' }, h('b', { class: 'grow' }, `“${node.name}” — now click the scene to connect it to`), h('button', { onclick: () => pick(node) }, '✏️ Edit this scene')) : h('p', { class: 'dim small' }, 'Nothing selected.')));
  kids.push(h('div', { class: 'card' }, h('h3', {}, `Connections (${pairs.length})`),
    pairs.length ? pairs.map(([a, b]) => { const ex = both(a, b), locked = ex.some((x) => x.locked);
      return h('div', { class: 'row conn' }, h('span', { class: 'grow' }, `${a.name} ⇄ ${b.name}`),
        h('button', { class: locked ? 'on' : '', title: 'Lock or unlock this way', onclick: () => { for (const x of ex) x.locked = !locked; W.c.save(library()); draw(); } }, locked ? '🔒 Locked' : '🔓 Open'),
        h('button', { class: 'danger', title: 'Remove the connection', onclick: () => { a.scene.exits = a.scene.exits.filter((x) => x.to !== b.id); b.scene.exits = b.scene.exits.filter((x) => x.to !== a.id); W.c.save(library()); draw(); } }, '✕')); })
      : h('p', { class: 'dim small' }, 'No connections yet.')));
  W.el.tools.replaceChildren(...kids);
}

function drawTools() {
  if (W.map) return mapTools();
  const sc = W.cur.scene, t = W.el.tools, kids = [];
  kids.push(h('div', { class: 'tabs' }, [['tiles', '🧱', 'Level'], ['objects', '📦', 'Objects'], ['scene', '🌄', 'Scene']].map(([id, icon, label]) =>
    h('button', { 'data-wtab': id, class: W.tab === id ? 'on' : '', onclick: () => { W.tab = id; W.sel = null; draw(); } }, h('span', {}, icon), h('small', {}, label)))));
  const hint = document.querySelector('#wsHint');

  if (W.tab === 'tiles') {
    hint.textContent = 'Paint tiles on the 16 × 12 grid. The hero walks on floor tiles only; walls and anything solid block the way.';
    const tool = (id, label, title) => h('button', { 'data-tool': id, class: 'grow' + (W.tool === id ? ' on' : ''), title, onclick: () => { W.tool = id; drawTools(); } }, label);
    const cats = tileCats(), cat = cats.find((c) => c.id === W.tcat) || cats[0];
    const count = (k) => (sc.level ? [...sc.level.cells].filter((ch) => (sc.level.pal[parseInt(ch, 36) - 1] || {}).k === k).length : 0);
    const all = (fn) => { remember(); for (let n = 0; n < LEVEL_W * LEVEL_H; n++) if (fn(n % LEVEL_W, Math.floor(n / LEVEL_W), sc.level ? sc.level.cells[n] : '0')) setCell(sc, n, W.a, W.k); changed(); draw(); };
    kids.push(
      h('div', { class: 'row' }, tool('brush', '🖌 Brush', 'Paint tiles'), tool('rect', '▭ Box', 'Drag out a filled rectangle'), tool('fill', '🪣 Fill', 'Fill an area'), tool('erase', '⌫ Erase', 'Remove tiles'), tool('pick', '💧 Pick', 'Pick a tile from the stage')),
      (W.tool === 'brush' || W.tool === 'erase') && h('div', { class: 'row' }, h('span', { class: 'dim small' }, 'Size'), [1, 2, 3].map((n) => h('button', { class: 'grow' + (W.size === n ? ' on' : ''), onclick: () => { W.size = n; drawTools(); } }, `${n}×${n}`))),
      h('div', { class: 'row' }, h('span', { class: 'dim small' }, 'This tile is'),
        h('button', { 'data-kind': 'f', class: 'grow' + (W.k === 'f' ? ' on' : ''), onclick: () => { W.k = 'f'; drawTools(); } }, '🟩 Floor'),
        h('button', { 'data-kind': 'w', class: 'grow' + (W.k === 'w' ? ' on' : ''), onclick: () => { W.k = 'w'; drawTools(); } }, '🧱 Wall')),
      cats.length > 1 && h('div', { class: 'chips wrap' }, cats.map((c) => h('button', { class: c === cat ? 'on' : '', onclick: () => { W.tcat = c.id; drawTools(); } }, c.label))),
      cat ? h('div', { class: 'grid tiles' }, cat.items.map((i) => h('button', { title: i.name + (i.kind ? ` (${i.kind})` : ''), 'aria-label': i.name, class: (W.a === i.asset ? 'on ' : '') + (i.kind === 'wall' ? 'iswall' : ''), onclick: () => { W.a = i.asset; if (i.kind) W.k = i.kind === 'wall' ? 'w' : 'f'; if (W.tool === 'erase' || W.tool === 'pick') W.tool = 'brush'; drawTools(); } }, glyphNode(W.c.code, i.asset))))
        : h('p', { class: 'dim' }, 'The tile library is missing.'),
      h('div', { class: 'row' },
        h('button', { class: 'grow', id: 'wsFillAll', onclick: () => all(() => true) }, 'Fill everything'),
        h('button', { class: 'grow', id: 'wsBorder', onclick: () => all((x, y) => x === 0 || y === 0 || x === LEVEL_W - 1 || y === LEVEL_H - 1) }, 'Border'),
        h('button', { class: 'grow', onclick: () => all((x, y, old) => old === '0') }, 'Empty tiles')),
      h('div', { class: 'row' }, h('span', { class: 'dim small grow', id: 'wsCount' }, `${count('f')} floor · ${count('w')} wall tiles`), h('button', { class: 'danger', disabled: !sc.level, onclick: () => { remember(); sc.level = null; changed(); draw(); } }, 'Clear the level')));
  } else if (W.tab === 'objects') {
    hint.textContent = 'Click an object to select it, drag it to move it. Drag the hero to where the Player starts.';
    const sel = sc.entities.find((e) => e.id === W.sel);
    if (sel) {
      const b = (label, title, fn, on) => h('button', { class: 'grow' + (on ? ' on' : ''), title, onclick: () => { remember(); fn(); changed(); draw(); } }, label);
      const isHero = sel.id === sc.heroId;
      kids.push(h('div', { class: 'seltools' },
        h('div', { class: 'row' }, h('span', { style: 'font-size:24px' }, glyphNode(W.c.code, sel.asset, 'mini')), h('b', { class: 'grow' }, isHero ? 'The hero’s starting place' : assetLabel(sel.asset))),
        h('div', { class: 'row' },
          b('➖', 'Smaller', () => { sel.scale = clamp(sel.scale / 1.25, 0.3, 6); }), b('➕', 'Bigger', () => { sel.scale = clamp(sel.scale * 1.25, 0.3, 6); }),
          b('↺', 'Rotate left', () => { sel.rot = (sel.rot - 15) % 360; }), b('↻', 'Rotate right', () => { sel.rot = (sel.rot + 15) % 360; }), b('↔️', 'Flip', () => { sel.flip = !sel.flip; })),
        !isHero && h('div', { class: 'row' },
          b('🧱 Solid', 'The hero cannot walk through it', () => { sel.solid = !sel.solid; }, sel.solid),
          b('▦ Snap', 'Snap to the middle of its tile', () => { sel.x = (Math.floor(sel.x * LEVEL_W) + 0.5) / LEVEL_W; sel.y = Math.min(1, (Math.floor(sel.y * LEVEL_H) + 1) / LEVEL_H); }),
          b('⧉ Copy', 'Duplicate', () => { const k = { ...clone(sel), id: rid(), x: clamp(sel.x + 1 / LEVEL_W, 0, 1) }; sc.entities.push(k); W.sel = k.id; }),
          b('🗑', 'Remove', () => { sc.entities = sc.entities.filter((e) => e !== sel); W.sel = null; }))));
    }
    const grid = h('div', { class: 'grid' });
    const cats = objectCats(), cat = cats.find((c) => c.id === W.ocat) || cats[0];
    const place = (i) => {
      if (sc.entities.length >= 80) return W.c.toast('This scene is full');
      remember();
      let best = null;
      for (let n = 0; n < 24; n++) { const x = 0.1 + Math.random() * 0.8, y = 0.3 + Math.random() * 0.6, gap = Math.min(9, ...sc.entities.map((o) => Math.hypot(o.x - x, (o.y - y) * 0.75))); if (!best || gap > best.gap) best = { x, y, gap }; }
      const e = { id: rid(), asset: i.asset, x: best.x, y: best.y, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '', solid: !!pixelInfo(i.asset).solid };
      sc.entities.push(e); W.sel = e.id; changed(); draw();
    };
    const fill = () => {
      const q = W.q.trim().toLowerCase(), items = q ? allItems().filter((i) => i.name.includes(q)).slice(0, 200) : cat.items;
      grid.replaceChildren(...items.map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => place(i) }, glyphNode(W.c.code, i.asset))));
    };
    fill();
    kids.push(h('input', { type: 'search', placeholder: '🔍 Search objects (table, tree, skeleton…)', value: W.q, oninput: (ev) => { W.q = ev.target.value; fill(); } }),
      h('div', { class: 'chips wrap' }, cats.map((c) => h('button', { class: c === cat && !W.q ? 'on' : '', onclick: () => { W.ocat = c.id; W.q = ''; drawTools(); } }, c.label))), grid);
  } else {
    hint.textContent = 'The backdrop shows wherever no tile is painted.';
    const set = (k, v) => { remember(); sc[k] = v; changed(); draw(); };
    kids.push(
      !W.cur.live && h('div', { class: 'card' }, h('h3', {}, 'Name'), h('input', { id: 'wsName', maxlength: 40, value: W.cur.name, oninput: (ev) => { W.cur.name = ev.target.value || 'Untitled scene'; changed(); drawBar(); }, onchange: drawList })),
      h('div', { class: 'card' }, h('h3', {}, 'Backdrop'), h('div', { class: 'grid drops' }, BACKDROPS.map((b) => h('button', { class: sc.backdrop === b.id ? 'on' : '', style: `background:${b.css}`, onclick: () => set('backdrop', b.id) }, b.name)))),
      h('div', { class: 'card' }, h('h3', {}, 'Weather'), h('div', { class: 'chips wrap' }, WEATHER.map(([v, l]) => h('button', { class: sc.weather === v ? 'on' : '', onclick: () => set('weather', v) }, l)))),
      W.c.adventure && h('div', { class: 'card' }, h('h3', {}, 'Exits to other scenes'),
        sc.exits.map((x) => h('div', { class: 'row conn' },
          h('input', { maxlength: 40, value: x.label, title: 'Label', oninput: (ev) => { x.label = ev.target.value || 'Exit'; changed(); paintStage(); } }),
          h('select', { title: 'Leads to', onchange: (ev) => { remember(); x.to = ev.target.value; changed(); } }, h('option', { value: '' }, '— to —'), docs().filter((d) => d !== W.cur).map((d) => h('option', { value: d.id, selected: x.to === d.id }, d.name))),
          h('button', { class: x.locked ? 'on' : '', title: 'Locked?', onclick: () => { remember(); x.locked = !x.locked; changed(); draw(); } }, x.locked ? '🔒' : '🔓'),
          h('button', { class: 'danger', onclick: () => { remember(); sc.exits = sc.exits.filter((y) => y !== x); changed(); draw(); } }, '✕'))),
        h('button', { id: 'wsAddExit', disabled: sc.exits.length >= 12, onclick: () => { remember(); sc.exits.push({ id: rid(), to: '', label: 'Exit', x: 0.5, y: 0.5, locked: false }); changed(); draw(); } }, '＋ Add an exit'),
        h('p', { class: 'dim small' }, 'Drag an exit on the stage to where the way out is. The 🗺️ Map connects scenes for you.')),
      h('div', { class: 'card' }, h('h3', {}, 'Music'), h('div', { class: 'list' }, MOODS.map((m) => h('button', { class: sc.mood === m.id ? 'on' : '', onclick: () => set('mood', m.id) }, m.name)))));
  }
  const top = t.scrollTop;
  t.replaceChildren(...kids.filter(Boolean));
  t.scrollTop = top;
}

/* ---------- working on the stage ---------- */
function pos(ev) {
  const r = W.el.stage.getBoundingClientRect();
  return { x: clamp((ev.clientX - r.left) / r.width, 0, 0.9999), y: clamp((ev.clientY - r.top) / r.height, 0, 0.9999) };
}
function stamp(p, erase) {
  const sc = W.cur.scene, cx = Math.floor(p.x * LEVEL_W), cy = Math.floor(p.y * LEVEL_H), o = W.size === 3 ? -1 : 0;
  let any = false;
  for (let dy = 0; dy < W.size; dy++) for (let dx = 0; dx < W.size; dx++) {
    const x = cx + dx + o, y = cy + dy + o;
    if (x < 0 || y < 0 || x >= LEVEL_W || y >= LEVEL_H) continue;
    if (setCell(sc, y * LEVEL_W + x, W.a, erase ? '' : W.k)) any = true;
  }
  if (any) paintStage();
}
function down(ev) {
  ev.preventDefault();
  if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) document.activeElement.blur();
  const sc = W.cur.scene, p = pos(ev);
  W.drag = null;
  if (W.tab === 'tiles') {
    const c = cellAt(p.x, p.y);
    if (W.tool === 'pick') {
      const tile = sc.level && sc.level.pal[parseInt(sc.level.cells[c], 36) - 1];
      if (tile) { W.a = tile.a; W.k = tile.k; W.tool = 'brush'; drawTools(); }
      return;
    }
    remember();
    if (W.tool === 'fill') {                                // flood the connected area that looks the same
      const cells = () => (sc.level ? sc.level.cells : '0'.repeat(LEVEL_W * LEVEL_H)), want = cells()[c], todo = [c], seen = new Set([c]);
      while (todo.length) {
        const n = todo.pop(), x = n % LEVEL_W, y = Math.floor(n / LEVEL_W);
        setCell(sc, n, W.a, W.k);
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) { const m = ny * LEVEL_W + nx; if (nx >= 0 && ny >= 0 && nx < LEVEL_W && ny < LEVEL_H && !seen.has(m) && cells()[m] === want) { seen.add(m); todo.push(m); } }
      }
      changed(); return draw();
    }
    if (W.tool === 'rect') { W.drag = { rect: c, base: JSON.stringify(sc.level) }; setCell(sc, c, W.a, W.k); paintStage(); } else { W.drag = { paint: true }; stamp(p, W.tool === 'erase'); }
  } else {
    const mk = ev.target.closest('.exit'), door = mk && sc.exits.find((x) => x.id === mk.dataset.exit);
    if (door) { remember(); W.drag = { e: door, dx: door.x - p.x, dy: door.y - p.y }; W.el.stage.setPointerCapture(ev.pointerId); return; }
    const el = ev.target.closest('.ent'), hit = el && sc.entities.find((e) => e.id === el.dataset.id);
    const was = W.sel; W.sel = hit ? hit.id : null;
    if (hit) { remember(); W.drag = { e: hit, dx: hit.x - p.x, dy: hit.y - p.y }; }
    if (was !== W.sel) { if (W.tab !== 'objects') W.tab = 'objects'; drawTools(); }
    paintStage();
  }
  if (W.drag) W.el.stage.setPointerCapture(ev.pointerId);
}
function move(ev) {
  const d = W.drag; if (!d) return;
  const sc = W.cur.scene, p = pos(ev);
  if (d.paint) return stamp(p, W.tool === 'erase');
  if (d.rect != null) {
    sc.level = JSON.parse(d.base);
    const c = cellAt(p.x, p.y), x0 = Math.min(d.rect % LEVEL_W, c % LEVEL_W), x1 = Math.max(d.rect % LEVEL_W, c % LEVEL_W), y0 = Math.min(Math.floor(d.rect / LEVEL_W), Math.floor(c / LEVEL_W)), y1 = Math.max(Math.floor(d.rect / LEVEL_W), Math.floor(c / LEVEL_W));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) setCell(sc, y * LEVEL_W + x, W.a, W.k);
    return paintStage();
  }
  d.e.x = clamp(p.x + d.dx, 0, 1); d.e.y = clamp(p.y + d.dy, 0.05, 1); d.moved = true;
  paintStage();
}
function up() {
  const d = W.drag; if (!d) return;
  W.drag = null;
  if (d.e && !d.moved) W.undo.pop();
  changed(); draw();
}
