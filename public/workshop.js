/*
 * Building places, apart from the turn. Two full-screen views:
 *
 *   BUILD SCENE  one scene on the bench: level tiles (floors and walls), things (solid, active, tied),
 *                backdrop, weather, music, exits, and where the hero starts. Everything that makes a
 *                place is done here and nowhere else.
 *   MAP          every scene that was added to the map. Arrange, rename, duplicate, delete, connect
 *                (a connection puts an exit in both scenes) and go there in the story.
 *
 * A scene on the bench is added to the map with one button; from then on it saves itself.
 * Scenes on the map are kept with the story and can be saved to a file for another story.
 */
import { PIXEL, CATEGORIES, backdropCss, pixelInfo } from './catalog.js';
import { h, clone, clamp, norm, glyphNode, renderStage, setCell, cellAt, LEVEL_W, LEVEL_H } from './stage.js';
import { G, resetGuided, guidedPick, guidedMark, buildGuided } from './guided.js';

const W = { open: false, c: null, list: [], cur: null, view: 'build', node: null, tab: 'tiles', tool: 'brush', size: 1, a: '', k: 'f', tcat: '', q: '', sel: null, hist: [], redo: [], drag: null, walls: true, saveT: 0, el: null };
let bench = null;                                             // the scene last worked on, kept while the page is open: { code, doc }
export const workshopOpen = () => W.open;
const rid = () => Math.random().toString(36).slice(2, 10);
const $root = () => document.querySelector('#workshop');

const blankScene = () => norm({
  backdrop: 'b:meadow', mood: 'm:none', narration: '', action: '', heroId: 'hero', entities: [W.c.blankHero()], drawing: [], weather: '',
  tracks: [], burst: '', sfx: '', card: '', choices: [], steps: [], sheet: { inv: [], stats: [] }, target: null, use: null, roll: null, level: null,
});
const library = () => W.list.map((d) => ({ id: d.id, name: d.name, mx: d.mx, my: d.my, scene: d.scene }));
const onMap = (d = W.cur) => !!d && W.list.includes(d);
const tileCats = () => PIXEL.filter((c) => c.group === 'tile');
const newName = () => { for (let n = W.list.length + 1; ; n++) if (!W.list.some((d) => d.name === `Scene ${n}`)) return `Scene ${n}`; };
const saveNow = () => { clearTimeout(W.saveT); W.saveT = 0; return W.c.save(library()); };
const saveSoon = () => { clearTimeout(W.saveT); W.saveT = setTimeout(() => { W.saveT = 0; W.c.save(library()); }, 700); };
function flush() { if (W.saveT) saveNow(); }
/** A free spot on the map for a new scene. */
function spot(near) {
  if (near) return { mx: clamp(near.mx + 0.09, 0.06, 0.94), my: clamp(near.my + 0.11, 0.08, 0.92) };
  for (let n = 0; n < 24; n++) { const mx = ((n % 4) + 0.5) / 4, my = (Math.floor(n / 4) % 4 + 0.5) / 4; if (!W.list.some((d) => Math.abs(d.mx - mx) < 0.1 && Math.abs(d.my - my) < 0.1)) return { mx, my }; }
  return { mx: 0.1 + Math.random() * 0.8, my: 0.1 + Math.random() * 0.8 };
}

export function openWorkshop(c) {
  W.c = c; W.open = true; W.sel = null; W.node = null; W.redo = []; W.tab = 'tiles'; W.tool = 'brush'; W.q = '';
  W.list = c.scenes.map((s) => ({ ...s, scene: norm(s.scene) }));
  W.list.forEach((d, i) => { if (d.mx == null || (d.mx === 0.5 && d.my === 0.5 && W.list.length > 1 && i > 0)) { d.mx = ((i % 4) + 0.5) / 4; d.my = (Math.floor(i / 4) % 3 + 0.5) / 3; } d.scene.sceneId = d.id; });
  const kept = bench && bench.code === c.code ? W.list.find((d) => d.id === bench.doc.id) || (bench.onMap ? null : bench.doc) : null;
  W.cur = kept || (c.stage ? { id: rid(), name: newName(), scene: c.stage() } : { id: rid(), name: newName(), scene: blankScene() });
  W.view = c.map ? 'map' : 'build';
  W.hist = [JSON.stringify(W.cur.scene)];
  if (!W.a) { const t = tileCats()[0]; if (t) { W.a = t.items[0].asset; W.k = t.items[0].kind === 'wall' ? 'w' : 'f'; } }
  const root = $root(), stage = h('div', { class: 'stage', id: 'wsStage' });
  W.el = { bar: h('header', {}), stage, tools: h('aside', { class: 'wstools' }), map: h('div', { class: 'wsmap', hidden: true }) };
  root.replaceChildren(W.el.bar, h('div', { class: 'wsbody' }, h('div', { class: 'wsmid' }, stage, W.el.map, h('p', { class: 'dim small', id: 'wsHint' })), W.el.tools));
  stage.addEventListener('pointerdown', down); stage.addEventListener('pointermove', move); stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  document.addEventListener('keydown', keys);
  root.hidden = false;
  draw();
}
function close() {
  flush();
  bench = { code: W.c.code, doc: W.cur, onMap: onMap() };
  if (!onMap() && W.hist.length > 1) W.c.toast(`“${W.cur.name}” is not on the map yet — it waits in Build scene`);
  W.open = false; document.removeEventListener('keydown', keys); $root().hidden = true; $root().replaceChildren();
  if (W.c.closed) W.c.closed();
}

/* ---------- the bench ---------- */
function changed() {
  const j = JSON.stringify(W.cur.scene);                     // undo history: every finished change is remembered
  if (j !== W.hist[W.hist.length - 1]) { W.hist.push(j); if (W.hist.length > 80) W.hist.shift(); W.redo = []; }
  if (onMap()) saveSoon();
}
function remember() { /* changes are recorded when they finish, see changed() */ }
function undo(dir) {
  if (W.view !== 'build') return;
  if (dir < 0) { if (W.hist.length < 2) return; W.redo.push(W.hist.pop()); } else { if (!W.redo.length) return; W.hist.push(W.redo.pop()); }
  W.cur.scene = JSON.parse(W.hist[W.hist.length - 1]); W.sel = null; resetGuided();
  if (onMap()) saveSoon();
  draw();
}
/** Put another scene on the bench. An unsaved one with work in it is offered to the map first. */
function build(doc) {
  flush();
  if (doc !== W.cur && !onMap() && W.hist.length > 1 && confirm(`“${W.cur.name}” is not on the map yet. Add it to the map before you leave it?`)) addToMap(true);
  W.cur = doc; W.sel = null; W.hist = [JSON.stringify(doc.scene)]; W.redo = []; W.view = 'build'; W.tab = 'tiles'; resetGuided(); draw();
}
function addToMap(quiet) {
  if (onMap()) return;
  Object.assign(W.cur, spot()); W.cur.scene.sceneId = W.cur.id; W.cur.scene.steps = [];
  W.list.push(W.cur); saveNow();
  if (!quiet) { W.c.toast(`“${W.cur.name}” is on the map`); draw(); }
}
function useNow(doc) {
  if (!W.c.use) return;
  if (doc === W.cur && !onMap()) addToMap(true);
  flush(); W.c.use(doc); W.c.toast(`The story moves to “${doc.name}”`); close();
}
function duplicate(doc) {
  const copy = { id: rid(), name: `${doc.name} (copy)`.slice(0, 40), ...spot(doc), scene: norm({ ...clone(doc.scene), steps: [] }) };
  copy.scene.sceneId = copy.id; copy.scene.exits = [];           // the copy starts unconnected
  W.list.push(copy); saveNow();
  return copy;
}
function remove(doc) {
  if (!confirm(`Delete “${doc.name}” from the map?`)) return;
  W.list = W.list.filter((d) => d !== doc);
  for (const d of W.list) d.scene.exits = d.scene.exits.filter((x) => x.to !== doc.id);
  if (W.node === doc.id) W.node = null;
  saveNow(); draw();
}
function keys(ev) {
  if (!W.open) return;
  const typing = /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName), mod = ev.ctrlKey || ev.metaKey, key = ev.key.toLowerCase();
  if (W.view === 'map') {
    const node = W.list.find((d) => d.id === W.node);
    if (typing || !node) return;
    if (mod && key === 'd') { ev.preventDefault(); W.node = duplicate(node).id; draw(); } else if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); remove(node); } else if (ev.key === 'Enter') build(node);
    return;
  }
  if (mod && key === 'z') { ev.preventDefault(); undo(ev.shiftKey ? 1 : -1); } else if (mod && key === 'y') { ev.preventDefault(); undo(1); }
  else if (!typing && (ev.key === 'Delete' || ev.key === 'Backspace') && W.sel && W.sel !== W.cur.scene.heroId) { ev.preventDefault(); W.cur.scene.entities = W.cur.scene.entities.filter((e) => e.id !== W.sel); W.sel = null; resetGuided(); changed(); draw(); }
  else if (!typing && mod && key === 'd' && W.sel) { ev.preventDefault(); const src = W.cur.scene.entities.find((e) => e.id === W.sel); if (src && src.id !== W.cur.scene.heroId) { const k = { ...clone(src), id: rid(), x: clamp(src.x + 1 / LEVEL_W, 0, 1) }; W.cur.scene.entities.push(k); W.sel = k.id; changed(); draw(); } }
}

/* ---------- drawing ---------- */
const paintStage = () => renderStage(W.el.stage, W.cur.scene, { code: W.c.code, names: W.c.names, selId: W.sel, showKinds: W.walls });
function draw() { const map = W.view === 'map'; W.el.stage.hidden = map; W.el.map.hidden = !map; $root().classList.toggle('mapview', map); if (map) drawMap(); else paintStage(); drawBar(); drawTools(); }

function importFile() {
  const file = h('input', { type: 'file', accept: '.json,application/json', onchange: async () => {
    try {
      const j = JSON.parse(await file.files[0].text()), got = Array.isArray(j) ? j : j.scenes;
      if (!Array.isArray(got) || !got.length) throw new Error('No scenes in that file');
      for (const s of got.slice(0, 40)) if (s && s.scene && Array.isArray(s.scene.entities)) { const d = { id: rid(), name: String(s.name || 'Imported scene').slice(0, 40), ...spot(), scene: norm(s.scene) }; d.scene.sceneId = d.id; d.scene.exits = []; W.list.push(d); }
      saveNow(); draw(); W.c.toast('Scenes added to the map');
    } catch (e) { W.c.toast('Could not read that file: ' + e.message); }
  } });
  file.click();
}
function drawBar() {
  const cur = W.cur, can = !!W.c.use, tab = (id, label, v) => h('button', { id, class: 'wsview' + (W.view === v ? ' on' : ''), onclick: () => { if (W.view === v) return; flush(); W.view = v; W.node = null; W.sel = null; resetGuided(); draw(); } }, label);
  const kids = [tab('wsBuild', '🏗️ Build scene', 'build'), tab('wsMap', `🗺️ Map (${W.list.length})`, 'map'), h('span', { class: 'sep' })];
  if (W.view === 'build') kids.push(
    h('input', { id: 'wsName', maxlength: 40, value: cur.name, title: 'Name of this scene', oninput: (ev) => { cur.name = ev.target.value || 'Untitled scene'; if (onMap()) saveSoon(); } }),
    onMap() ? h('span', { class: 'dim small', id: 'wsSaved' }, '✓ On the map — saves itself') : h('button', { class: 'primary', id: 'wsAdd', title: 'Keep this scene: put it on the map', onclick: () => addToMap() }, '💾 Add scene to map'),
    h('span', { class: 'grow' }),
    h('button', { title: 'Undo (Ctrl+Z)', disabled: W.hist.length < 2, id: 'wsUndo', onclick: () => undo(-1) }, '↶ Undo'),
    h('button', { title: 'Redo (Ctrl+Y)', disabled: !W.redo.length, id: 'wsRedo', onclick: () => undo(1) }, '↷ Redo'),
    h('button', { class: W.walls ? 'on' : '', title: 'Mark walls and solid things in red', onclick: () => { W.walls = !W.walls; draw(); } }, '▦ Blocks'),
    h('button', { id: 'wsNew', title: 'Start a new, empty scene', onclick: () => build({ id: rid(), name: newName(), scene: blankScene() }) }, '＋ New'),
    W.c.stage && h('button', { id: 'wsFromStage', title: 'Start from a copy of what is on stage right now', onclick: () => build({ id: rid(), name: newName(), scene: W.c.stage() }) }, '🎬 From stage'),
    h('button', { class: can ? 'primary' : '', id: 'wsUse', disabled: !can, title: can ? 'Bring this scene on stage, in the step you are making' : 'You can do this during your own turn', onclick: () => useNow(cur) }, '▶ Use in story'));
  else kids.push(
    h('span', { class: 'dim small' }, 'Every scene you added. Drag to arrange.'), h('span', { class: 'grow' }),
    h('button', { id: 'mapNew', onclick: () => build({ id: rid(), name: newName(), scene: blankScene() }) }, '＋ New scene'),
    h('button', { disabled: !W.list.length, title: 'Save every scene on the map to a file, to use in another story', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify({ twofoldScenes: 1, scenes: library() })], { type: 'application/json' })), download: 'twofold-scenes.json' }); a.click(); } }, '⬇ Save to file'),
    h('button', { title: 'Add the scenes from a file to this map', onclick: importFile }, '⬆ Load from file'));
  kids.push(h('button', { id: 'wsClose', onclick: close }, 'Close'));
  W.el.bar.replaceChildren(...kids.filter(Boolean));
}

/* ---------- the map ---------- */
const linked = (a, b) => a.scene.exits.some((x) => x.to === b.id);
function connect(a, b) {
  const dx = b.mx - a.mx, dy = b.my - a.my, side = Math.abs(dx) >= Math.abs(dy);
  const at = (far) => (side ? { x: far ? 0.94 : 0.06, y: 0.6 } : { x: 0.5, y: far ? 0.95 : 0.16 });
  if (!linked(a, b)) a.scene.exits.push({ id: rid(), to: b.id, label: b.name, locked: false, ...at(side ? dx > 0 : dy > 0) });
  if (!linked(b, a)) b.scene.exits.push({ id: rid(), to: a.id, label: a.name, locked: false, ...at(side ? dx <= 0 : dy <= 0) });
}
function drawMap() {
  const m = W.el.map, list = W.list;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none');
  for (const a of list) for (const b of list) if (a.id < b.id && (linked(a, b) || linked(b, a))) {
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line'), locked = [...a.scene.exits.filter((x) => x.to === b.id), ...b.scene.exits.filter((x) => x.to === a.id)].some((x) => x.locked);
    ln.setAttribute('x1', a.mx * 100); ln.setAttribute('y1', a.my * 100); ln.setAttribute('x2', b.mx * 100); ln.setAttribute('y2', b.my * 100); ln.setAttribute('class', locked ? 'locked' : '');
    svg.append(ln);
  }
  const here = W.c.sceneId && W.c.sceneId();
  m.replaceChildren(svg, ...list.map((d) => {
    const n = h('button', { class: 'node' + (W.node === d.id ? ' on' : '') + (d.id === here ? ' here' : ''), style: `left:${d.mx * 100}%;top:${d.my * 100}%`, title: d.id === here ? 'The story is here now' : '' },
      h('i', { style: `background:${backdropCss(W.c.code, d.scene.backdrop)}` }), h('b', {}, d.name), d.id === here && h('small', {}, '📍 the story is here'));
    n.dataset.node = d.id;
    n.addEventListener('dblclick', () => build(d));
    n.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); n.setPointerCapture(ev.pointerId);
      const r = m.getBoundingClientRect(), x0 = ev.clientX, y0 = ev.clientY; let moved = false;
      const mv = (e2) => { if (!moved && Math.hypot(e2.clientX - x0, e2.clientY - y0) < 5) return; moved = true; d.mx = clamp((e2.clientX - r.left) / r.width, 0.06, 0.94); d.my = clamp((e2.clientY - r.top) / r.height, 0.08, 0.92); n.style.left = d.mx * 100 + '%'; n.style.top = d.my * 100 + '%'; };
      const end = () => {
        n.removeEventListener('pointermove', mv); n.removeEventListener('pointerup', end);
        if (!moved) {                                       // a click: select; with "connect" switched on, join it to the selected one
          const from = list.find((x) => x.id === W.node);
          if (W.linking && from && from !== d) { connect(from, d); W.linking = false; W.c.toast(`“${from.name}” and “${d.name}” are now connected`); } else W.node = W.node === d.id && !W.linking ? null : d.id;
        }
        saveNow(); draw();
      };
      n.addEventListener('pointermove', mv); n.addEventListener('pointerup', end);
    });
    return n;
  }), !list.length && h('div', { class: 'mapempty' }, h('h3', {}, 'The map is empty'), h('p', { class: 'dim' }, 'Build a scene, then press “💾 Add scene to map”. It will wait here until the story needs it.'),
    h('button', { class: 'primary', onclick: () => { W.view = 'build'; draw(); } }, '🏗️ Go to Build scene')));
}
function mapTools() {
  const list = W.list, kids = [], hint = document.querySelector('#wsHint'), adv = W.c.adventure;
  hint.textContent = W.linking ? 'Now click the scene to connect it to.' : 'Click a scene to select it, double-click to open it in Build scene, drag to arrange.';
  const pairs = [];
  for (const a of list) for (const b of list) if (a.id < b.id && (linked(a, b) || linked(b, a))) pairs.push([a, b]);
  const both = (a, b) => [...a.scene.exits.filter((x) => x.to === b.id), ...b.scene.exits.filter((x) => x.to === a.id)];
  const node = list.find((x) => x.id === W.node), big = (id, label, sub, fn, cls = '') => h('button', { id, class: 'mapact ' + cls, onclick: fn }, h('b', {}, label), h('small', {}, sub));
  if (node) kids.push(h('div', { class: 'card' },
    h('input', { id: 'mapName', maxlength: 40, value: node.name, title: 'Rename this scene', oninput: (ev) => { node.name = ev.target.value || 'Untitled scene'; saveSoon(); const b = W.el.map.querySelector(`[data-node="${node.id}"] b`); if (b) b.textContent = node.name; } }),
    h('small', { class: 'dim' }, `${node.scene.entities.length - 1} things${node.scene.level ? ' · has a level' : ''}${node.scene.exits.length ? ` · ${node.scene.exits.length} exits` : ''}`),
    big('mapEdit', '✏️ Edit', 'Open it in Build scene', () => build(node)),
    big('mapDup', '⧉ Duplicate', 'A copy to change', () => { W.node = duplicate(node).id; draw(); }),
    adv && big('mapLink', W.linking ? '🔗 Click the other scene…' : '🔗 Connect to another scene', 'Puts an exit in both scenes', () => { W.linking = !W.linking; draw(); }, W.linking ? 'on' : ''),
    big('mapUse', '▶ Go there in the story now', W.c.use ? 'In the step you are making' : 'Possible during your own turn', () => useNow(node), W.c.use ? 'primary' : 'off'),
    big('mapDel', '🗑 Delete', 'Remove it from the map', () => remove(node), 'danger')));
  else kids.push(h('div', { class: 'card' }, h('h3', {}, '🗺️ The map'), h('p', { class: 'dim small' }, 'Every scene you added lives here. Select one to edit, duplicate, connect or delete it — or to move the story there.'),
    list.length ? h('div', { class: 'col' }, list.map((d) => h('button', { class: 'wsdoc', onclick: () => { W.node = d.id; draw(); } }, h('i', { style: `background:${backdropCss(W.c.code, d.scene.backdrop)}` }), h('span', {}, h('b', {}, d.name), h('small', {}, `${d.scene.entities.length - 1} things${d.scene.level ? ' · level' : ''}`))))) : null));
  if (adv) kids.push(h('div', { class: 'card' }, h('h3', {}, `Connections (${pairs.length})`),
    h('p', { class: 'dim small' }, 'A connection puts an exit in both scenes. When the Player walks to an exit and you agree, the story travels there.'),
    pairs.length ? pairs.map(([a, b]) => { const ex = both(a, b), locked = ex.some((x) => x.locked);
      return h('div', { class: 'row conn' }, h('span', { class: 'grow' }, `${a.name} ⇄ ${b.name}`),
        h('button', { class: locked ? 'on' : '', title: 'Lock or unlock this way', onclick: () => { for (const x of ex) x.locked = !locked; saveNow(); draw(); } }, locked ? '🔒 Locked' : '🔓 Open'),
        h('button', { class: 'danger', title: 'Remove the connection', onclick: () => { a.scene.exits = a.scene.exits.filter((x) => x.to !== b.id); b.scene.exits = b.scene.exits.filter((x) => x.to !== a.id); saveNow(); draw(); } }, '✕')); })
      : h('p', { class: 'dim small' }, 'No connections yet.')));
  W.el.tools.replaceChildren(...kids.filter(Boolean));
}

function drawTools() {
  if (W.view === 'map') return mapTools();
  const sc = W.cur.scene, t = W.el.tools, kids = [];
  kids.push(h('div', { class: 'tabs' }, [['tiles', '🧱', 'Level tiles'], ['things', '🎭', 'Things & scene']].map(([id, icon, label]) =>
    h('button', { 'data-wtab': id, class: W.tab === id ? 'on' : '', onclick: () => { W.tab = id; W.sel = null; resetGuided(); draw(); } }, h('span', {}, icon), h('small', {}, label)))));
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
      cats.length > 1 && h('div', { class: 'chips wrap' }, cats.map((c) => h('button', { class: c === cat ? 'on' : '', onclick: () => { W.tcat = c.id; drawTools(); } }, c.label))),
      ...(cat ? [['floor', 'f', '🟩 Floor — the hero can walk here'], ['wall', 'w', '🧱 Walls — these block the hero']].map(([kind, k, title]) => {
        const items = cat.items.filter((i) => (i.kind === 'wall' ? 'wall' : 'floor') === kind);
        return items.length ? h('div', { class: 'col', 'data-set': kind }, h('small', { class: 'dim' }, `${title} (${items.length})`),
          h('div', { class: 'grid tiles' }, items.map((i) => h('button', { title: i.name, 'aria-label': i.name, class: (W.a === i.asset ? 'on ' : '') + (kind === 'wall' ? 'iswall' : ''), onclick: () => { W.a = i.asset; W.k = k; if (W.tool === 'erase' || W.tool === 'pick') W.tool = 'brush'; drawTools(); } }, glyphNode(W.c.code, i.asset))))) : null;
      }) : [h('p', { class: 'dim' }, 'The tile library is missing.')]),
      h('div', { class: 'row' }, h('span', { class: 'dim small' }, 'Use the chosen tile as'),
        h('button', { 'data-kind': 'f', class: 'grow' + (W.k === 'f' ? ' on' : ''), onclick: () => { W.k = 'f'; drawTools(); } }, 'Floor'),
        h('button', { 'data-kind': 'w', class: 'grow' + (W.k === 'w' ? ' on' : ''), onclick: () => { W.k = 'w'; drawTools(); } }, 'Wall')),
      h('div', { class: 'row' },
        h('button', { class: 'grow', id: 'wsFillAll', onclick: () => all(() => true) }, 'Fill everything'),
        h('button', { class: 'grow', id: 'wsBorder', onclick: () => all((x, y) => x === 0 || y === 0 || x === LEVEL_W - 1 || y === LEVEL_H - 1) }, 'Border'),
        h('button', { class: 'grow', onclick: () => all((x, y, old) => old === '0') }, 'Empty tiles')),
      h('div', { class: 'row' }, h('span', { class: 'dim small grow', id: 'wsCount' }, `${count('f')} floor · ${count('w')} wall tiles`), h('button', { class: 'danger', disabled: !sc.level, onclick: () => { remember(); sc.level = null; changed(); draw(); } }, 'Clear the level')));
  } else {
    // the same question flow and the same tools as during a turn, working on this scene
    hint.textContent = 'Click anything on the stage to change it; drag it to move it. The glowing hero marks where the Player starts.';
    const box = h('div', { class: 'col wsg' });
    const sub = h('div', { class: 'col' });
    buildGuided(sub, {
      mode: 'workshop', get draft() { return W.cur.scene; }, code: W.c.code, pen: {},
      S: { turn: 0, names: W.c.names, rules: W.c.rules, assets: W.c.assets || [], scenes: library(), claude: false },
      select(id) { W.sel = id || null; }, mods: () => W.c.rules.modules, toast: W.c.toast, audio: W.c.audio, rid, maker: W.c.maker,
      rebuild: () => { changed(); draw(); }, changed: () => { changed(); draw(); }, changedQuiet: () => { changed(); paintStage(); },
      addEntity(asset) {
        if (sc.entities.length >= 80) { W.c.toast('This scene is full'); return null; }
        let best = null;
        for (let n = 0; n < 24; n++) { const x = 0.1 + Math.random() * 0.8, y = 0.3 + Math.random() * 0.6, gap = Math.min(9, ...sc.entities.map((o) => Math.hypot(o.x - x, (o.y - y) * 0.75))); if (!best || gap > best.gap) best = { x, y, gap }; }
        const e = { id: rid(), asset, x: best.x, y: best.y, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '', solid: !!pixelInfo(asset).solid, active: null, tie: null, hp: null, maxHp: null, once: '', temp: false, layer: 0 };
        sc.entities.push(e); W.sel = e.id; return e;
      },
      removeEntity(e) { sc.entities = sc.entities.filter((x) => x !== e); for (const x of sc.entities) if (x.tie && x.tie.to === e.id) x.tie = null; W.sel = null; },
      dropTrack() {}, trackEnd: () => 0, cutting: () => false, canUndo: () => false, undo() {}, autoTrack: () => false,
    });
    box.append(sub); kids.push(box);
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
    if (door) { guidedMark(door.id); W.drag = { e: door, dx: door.x - p.x, dy: door.y - p.y }; W.el.stage.setPointerCapture(ev.pointerId); return drawTools(); }
    const el = ev.target.closest('.ent'), hit = el && sc.entities.find((e) => e.id === el.dataset.id);
    const was = W.sel; W.sel = hit ? hit.id : null;
    if (hit) { remember(); W.drag = { e: hit, dx: hit.x - p.x, dy: hit.y - p.y }; }
    if (hit) guidedPick(hit.id);
    if (was !== W.sel) { W.tab = 'things'; drawTools(); }
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
  const par = d.e.tie && sc.entities.find((x) => x.id === d.e.tie.to);
  if (par) { d.e.tie.dx = clamp(((p.x - par.x) / par.scale) * (par.flip ? -1 : 1), -1, 1); d.e.tie.dy = clamp((p.y + 0.04 - par.y) / par.scale, -1, 1); return paintStage(); }   // a tied thing: adjust how it is held
  d.e.x = clamp(p.x + d.dx, 0, 1); d.e.y = clamp(p.y + d.dy, 0.05, 1); d.moved = true;
  paintStage();
}
function up() {
  const d = W.drag; if (!d) return;
  W.drag = null;
  changed(); draw();
}
