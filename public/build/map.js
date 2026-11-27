/*
 * The map: every scene the Director has kept for this story, and the ways between them.
 *
 * Rooms are built on the stage itself; the map is where they are kept. Here the Director arranges them, renames,
 * duplicates and deletes them, connects them (a connection puts an exit in both scenes), drops in a ready-made
 * place, and moves the story to one of them. The scenes are stored with the story; a whole map can also be kept
 * on this device as a campaign, or saved to a file, to be used in another story.
 *
 * openMap(c) gets everything it needs from its caller:
 *   code, names        the story, for drawing
 *   scenes             the scenes on the map: [{ id, name, mx, my, scene }]
 *   save(scenes)       store them with the story
 *   blankHero()        a hero for a scene made here
 *   stage()            a copy of what is on the stage now (null when it is not the Director's turn)
 *   use(doc)           move the story to a scene (null when it is not the Director's turn)
 *   sceneId()          the scene the story is in
 *   titleToKeep()      the story's title screen, as a campaign keeps it
 *   useTitle(t)        make a campaign's title screen the story's (null when it is not the Director's turn)
 *   hasStoryTitle()    whether the story has a title screen already
 *   here(id)           the stage was kept as this scene: the story is in it now
 *   toast(text), closed()
 */
import { backdropCss, pixelInfo, spriteTitle } from '../core/catalog.js';
import { h, clone, clamp, rid, fill } from '../core/dom.js';
import { kept } from '../core/kept.js';
import { renderStage } from '../stage/render.js';
import { LEVEL_W, LEVEL_H, normScene, newScene, newEntity } from '../shared/scene-model.js';
import { ROOM_THEMES, themeOf, roomScene } from '../shared/rooms.js';
import { SCENARIOS } from './scenarios.js';

const M = {
  open: false,
  c: null,
  list: [], // the scenes on the map
  node: null, // the selected one (its id)
  linking: false, // the next scene clicked is connected to the selected one
  theme: 'oldhouse', // the kind of room "Room next door" builds
  saveT: 0,
  el: null,
};
export const mapOpen = () => M.open;
const root = () => document.querySelector('#storymap');

/* ---------- the scenes, and keeping them ---------- */
const library = () => M.list.map((d) => ({ id: d.id, name: d.name, mx: d.mx, my: d.my, scene: d.scene }));
function saveNow() {
  clearTimeout(M.saveT);
  M.saveT = 0;
  return M.c.save(library());
}
function saveSoon() {
  clearTimeout(M.saveT);
  M.saveT = setTimeout(saveNow, 700);
}
const roomOf = (theme, shape = 'room') => roomScene(normScene({ ...newScene(), entities: [M.c.blankHero()] }), theme, shape);
function uniqueName(base) {
  let name = base;
  for (let n = 2; M.list.some((d) => d.name === name); n++) name = `${base} ${n}`;
  return name;
}
const newName = () => uniqueName(`Scene ${M.list.length + 1}`);
/** A free spot on the map for a new scene. */
function spot(near) {
  if (near) return { mx: clamp(near.mx + 0.09, 0.06, 0.94), my: clamp(near.my + 0.11, 0.08, 0.92) };
  for (let n = 0; n < 24; n++) {
    const mx = ((n % 4) + 0.5) / 4,
      my = ((Math.floor(n / 4) % 4) + 0.5) / 4;
    if (!M.list.some((d) => Math.abs(d.mx - mx) < 0.1 && Math.abs(d.my - my) < 0.1)) return { mx, my };
  }
  return { mx: 0.1 + Math.random() * 0.8, my: 0.1 + Math.random() * 0.8 };
}
/** Put a scene on the map. Its place, its ways out and its name can be given; the rest is filled in. */
function place(name, scene, o = {}) {
  const doc = { id: rid(), name: String(name || 'Scene').slice(0, 40), ...(o.mx >= 0 && o.my >= 0 ? { mx: o.mx, my: o.my } : spot(o.near)), scene };
  Object.assign(scene, { sceneId: doc.id, steps: [], exits: o.exits || [] });
  M.list.push(doc);
  return doc;
}
function show(doc, text) {
  M.node = doc.id;
  saveNow();
  draw();
  if (text) M.c.toast(text);
}

export function openMap(c) {
  Object.assign(M, { c, open: true, node: null, linking: false });
  M.list = c.scenes.map((s) => ({ ...s, scene: normScene(s.scene) }));
  M.list.forEach((d, i) => {
    if (d.mx == null || (d.mx === 0.5 && d.my === 0.5 && M.list.length > 1 && i > 0)) {
      d.mx = ((i % 4) + 0.5) / 4;
      d.my = ((Math.floor(i / 4) % 3) + 0.5) / 3;
    }
    d.scene.sceneId = d.id;
  });
  M.el = {
    bar: h('header', {}),
    board: h('div', { class: 'mapboard' }),
    tools: h('aside', { class: 'benchtools' }),
    hint: h('p', { class: 'dim small', id: 'mapHint' }),
  };
  root().replaceChildren(M.el.bar, h('div', { class: 'benchbody' }, h('div', { class: 'mapmid' }, M.el.board, M.el.hint), M.el.tools));
  document.addEventListener('keydown', keys);
  root().hidden = false;
  draw();
}
function close() {
  if (M.saveT) saveNow();
  M.open = false;
  document.removeEventListener('keydown', keys);
  root().hidden = true;
  root().replaceChildren();
  if (M.c.closed) M.c.closed();
}
function keys(ev) {
  if (!M.open) return;
  if (ev.key === 'Escape') return close();
  const node = M.list.find((d) => d.id === M.node);
  if (!node || /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName)) return;
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'd') {
    ev.preventDefault();
    show(duplicate(node));
  } else if (ev.key === 'Delete' || ev.key === 'Backspace') {
    ev.preventDefault();
    remove(node);
  } else if (ev.key === 'Enter') goThere(node);
}

/* ---------- what can be done with a scene ---------- */
function addStage() {
  if (!M.c.stage) return;
  const scene = M.c.stage();
  const doc = place(newName(), scene, { exits: scene.exits }); // its ways out still lead where they led
  if (M.c.here) M.c.here(doc.id); // and the story is in that scene now
  show(doc, 'The stage is on the map');
}
function goThere(doc) {
  if (!M.c.use) return;
  if (M.saveT) saveNow();
  M.c.use(doc);
  M.c.toast(`The story moves to “${doc.name}”`);
  close();
}
function duplicate(doc) {
  return place(`${doc.name} (copy)`, normScene(clone(doc.scene)), { near: doc }); // the copy starts unconnected
}
function remove(doc) {
  if (!confirm(`Delete “${doc.name}” from the map?`)) return;
  M.list = M.list.filter((d) => d !== doc);
  for (const d of M.list) d.scene.exits = d.scene.exits.filter((x) => x.to !== doc.id);
  if (M.node === doc.id) M.node = null;
  saveNow();
  draw();
}
const linked = (a, b) => a.scene.exits.some((x) => x.to === b.id);
const waysBetween = (a, b) => [...a.scene.exits.filter((x) => x.to === b.id), ...b.scene.exits.filter((x) => x.to === a.id)];
function pairs() {
  const out = [];
  for (const a of M.list) for (const b of M.list) if (a.id < b.id && waysBetween(a, b).length) out.push([a, b]);
  return out;
}
/** An exit in both scenes, on the side of the stage that faces the other scene on the map. */
function connect(a, b) {
  const dx = b.mx - a.mx,
    dy = b.my - a.my,
    side = Math.abs(dx) >= Math.abs(dy);
  const at = (far) => (side ? { x: far ? 0.94 : 0.06, y: 0.6 } : { x: 0.5, y: far ? 0.95 : 0.16 });
  if (!linked(a, b)) a.scene.exits.push({ id: rid(), to: b.id, label: b.name, locked: false, ...at(side ? dx > 0 : dy > 0) });
  if (!linked(b, a)) b.scene.exits.push({ id: rid(), to: a.id, label: a.name, locked: false, ...at(side ? dx <= 0 : dy <= 0) });
}
/** A new room beside this one, with a way through in both directions. */
function nextDoor(from) {
  const doc = place(uniqueName(themeOf(M.theme).name), roomOf(M.theme), { near: from });
  connect(from, doc);
  show(doc, `“${doc.name}” is next to “${from.name}”`);
}
/** Put a whole ready-made place on the map: its rooms, their furniture, the ways between them. */
function addScenario(sc) {
  const made = {};
  for (const [key, name, theme, shape, at, props] of sc.rooms) {
    const doc = (made[key] = place(uniqueName(name), roomOf(theme, shape), { mx: at[0], my: at[1] }));
    for (const [slug, cx, cy, title, verbs] of props) {
      const asset = 'p:' + slug;
      doc.scene.entities.push(
        newEntity(asset, {
          id: rid(),
          x: (cx + 0.5) / LEVEL_W,
          y: (cy + 0.92) / LEVEL_H,
          solid: !!pixelInfo(asset).solid,
          name: title || spriteTitle(asset),
          active: { verbs: verbs || ['Look at', 'Use', 'Take'] },
        }),
      );
    }
  }
  for (const [a, b, locked] of sc.links) {
    connect(made[a], made[b]);
    if (locked) for (const x of waysBetween(made[a], made[b])) x.locked = true;
  }
  show(made[sc.rooms[0][0]], `“${sc.name}” is on the map: ${sc.rooms.length} rooms`);
}

/* ---------- campaigns and files: a whole map, to use again ---------- */
async function saveCampaign() {
  if (M.saveT) saveNow();
  const name = (document.querySelector('#campName').value || 'My campaign').trim().slice(0, 40) || 'My campaign';
  M.c.toast(
    kept.campaigns.add({ id: rid(), name, at: Date.now(), scenes: clone(library()), title: await M.c.titleToKeep() }, 'name')
      ? `Campaign “${name}” is saved: ${M.list.length} scenes with their connections`
      : 'This device has no room left to save it',
  );
  draw();
}
/** Scenes from a campaign or a file come onto this map with new ids; the connections between them are kept. */
function addScenes(scenes, max) {
  const ok = scenes.filter((s) => s && s.scene && Array.isArray(s.scene.entities)).slice(0, max),
    ids = new Map(ok.map((s) => [s.id, rid()]));
  for (const s of ok) {
    const scene = normScene(clone(s.scene)),
      doc = place(s.name, scene, {
        mx: s.mx,
        my: s.my,
        exits: (scene.exits || []).filter((x) => ids.has(x.to)).map((x) => ({ ...x, id: rid(), to: ids.get(x.to) })),
      });
    doc.id = scene.sceneId = ids.get(s.id);
  }
  saveNow();
  draw();
  return ok.length;
}
function saveFile() {
  h('a', {
    href: URL.createObjectURL(new Blob([JSON.stringify({ twofoldScenes: 1, scenes: library() })], { type: 'application/json' })),
    download: 'twofold-scenes.json',
  }).click();
}
function loadFile() {
  const file = h('input', {
    type: 'file',
    accept: '.json,application/json',
    onchange: async () => {
      try {
        const j = JSON.parse(await file.files[0].text()),
          got = Array.isArray(j) ? j : j.scenes;
        if (!Array.isArray(got) || !addScenes(got, 40)) throw new Error('No scenes in that file');
        M.c.toast('Scenes added to the map');
      } catch (e) {
        M.c.toast('Could not read that file: ' + e.message);
      }
    },
  });
  file.click();
}

/* ---------- drawing ---------- */
function draw() {
  drawBar();
  drawBoard();
  drawTools();
}
function drawBar() {
  M.el.bar.replaceChildren(
    h(
      'button',
      { id: 'mapClose', class: 'primary', title: 'Back to the story (Esc)', onclick: close },
      '◀ Back',
      h('span', { class: 'wide' }, ' to story'),
    ),
    h('b', {}, `Map (${M.list.length})`),
    h('span', { class: 'sep' }),
    h(
      'div',
      { class: 'mapacts' }, // on a phone the actions get a row of their own that scrolls sideways
      h('span', { class: 'dim small' }, 'Every scene you kept. Drag to arrange.'),
      h('span', { class: 'grow' }),
      h(
        'button',
        { id: 'mapNew', class: 'primary', disabled: !M.c.stage, title: 'Keep what is on the stage now as a scene on the map', onclick: addStage },
        '＋ Add the stage as a scene',
      ),
      h(
        'button',
        { disabled: !M.list.length, title: 'Save every scene on the map to a file, to use in another story', onclick: saveFile },
        'Save to file',
      ),
      h('button', { title: 'Add the scenes from a file to this map', onclick: loadFile }, 'Load from file'),
    ),
  );
}
/** A small picture of a scene. */
function thumb(doc) {
  const el = h('div', { class: 'stage thumb' });
  renderStage(el, { ...doc.scene, narration: '', action: '', ask: null }, { code: M.c.code, names: M.c.names, seeHidden: true, showStart: true });
  return el;
}
function line(a, b) {
  const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  ln.setAttribute('x1', a.mx * 100);
  ln.setAttribute('y1', a.my * 100);
  ln.setAttribute('x2', b.mx * 100);
  ln.setAttribute('y2', b.my * 100);
  ln.setAttribute('class', waysBetween(a, b).some((x) => x.locked) ? 'locked' : '');
  return ln;
}
/** A scene on the board: drag it to arrange, click to select (or, while connecting, to connect), double-click to go there. */
function nodeOf(d, here) {
  const board = M.el.board,
    n = h(
      'button',
      {
        class: 'node' + (M.node === d.id ? ' on' : '') + (d.id === here ? ' here' : ''),
        style: `left:${d.mx * 100}%;top:${d.my * 100}%`,
        title: d.id === here ? 'The story is here now' : '',
      },
      thumb(d),
      h('b', {}, d.name),
      d.id === here && h('small', {}, 'the story is here'),
    );
  n.dataset.node = d.id;
  n.addEventListener('dblclick', () => goThere(d));
  n.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    n.setPointerCapture(ev.pointerId);
    const r = board.getBoundingClientRect(),
      x0 = ev.clientX,
      y0 = ev.clientY;
    let moved = false;
    const mv = (e2) => {
      if (!moved && Math.hypot(e2.clientX - x0, e2.clientY - y0) < 5) return;
      moved = true;
      d.mx = clamp((e2.clientX - r.left) / r.width, 0.06, 0.94);
      d.my = clamp((e2.clientY - r.top) / r.height, 0.08, 0.92);
      n.style.left = d.mx * 100 + '%';
      n.style.top = d.my * 100 + '%';
    };
    const end = () => {
      n.removeEventListener('pointermove', mv);
      n.removeEventListener('pointerup', end);
      if (!moved) {
        const from = M.list.find((x) => x.id === M.node);
        if (M.linking && from && from !== d) {
          connect(from, d);
          M.linking = false;
          M.c.toast(`“${from.name}” and “${d.name}” are now connected`);
        } else M.node = M.node === d.id && !M.linking ? null : d.id;
      }
      saveNow();
      draw();
    };
    n.addEventListener('pointermove', mv);
    n.addEventListener('pointerup', end);
  });
  return n;
}
function drawBoard() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    here = M.c.sceneId && M.c.sceneId();
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.append(...pairs().map(([a, b]) => line(a, b)));
  fill(
    M.el.board,
    svg,
    ...M.list.map((d) => nodeOf(d, here)),
    !M.list.length &&
      h(
        'div',
        { class: 'mapempty' },
        h('h3', {}, 'The map is empty'),
        h(
          'p',
          { class: 'dim' },
          'Build a room on the stage, then keep it here with “Add the stage as a scene” — or drop in a ready-made place. It waits here until the story needs it.',
        ),
      ),
  );
  M.el.hint.textContent = M.linking
    ? 'Now click the scene to connect it to.'
    : 'Click a scene to select it, double-click to go there, drag to arrange.';
}

const big = (id, label, sub, fn, cls = '') => h('button', { id, class: 'mapact ' + cls, onclick: fn }, h('b', {}, label), h('small', {}, sub));
const about = (d) =>
  `${d.scene.entities.length - 1} things${d.scene.level ? ' · has a level' : ''}${d.scene.exits.length ? ` · ${d.scene.exits.length} exits` : ''}`;
/** A list kept on this device: one row each, to use or to forget. */
const keptRows = (items, sub, use, useTitle, forget) =>
  items.map((it) =>
    h(
      'div',
      { class: 'row myroom' },
      h('button', { class: 'grow', title: useTitle, onclick: () => use(it) }, h('b', {}, it.name), h('small', { class: 'dim' }, ' ' + sub(it))),
      h(
        'button',
        {
          title: 'Forget it',
          onclick: () => {
            if (!confirm(`Forget “${it.name}”?`)) return;
            forget(it);
            draw();
          },
        },
        '✕',
      ),
    ),
  );

function nodeCard(node) {
  const turn = 'Possible during your own turn';
  return h(
    'div',
    { class: 'card' },
    h('input', {
      id: 'mapName',
      maxlength: 40,
      value: node.name,
      title: 'Rename this scene',
      oninput: (ev) => {
        node.name = ev.target.value || 'Untitled scene';
        saveSoon();
        const b = M.el.board.querySelector(`[data-node="${node.id}"] b`);
        if (b) b.textContent = node.name;
      },
    }),
    h('small', { class: 'dim' }, about(node)),
    big('mapEdit', 'Edit', M.c.use ? 'Go there and change it on the stage' : turn, () => goThere(node), M.c.use ? '' : 'off'),
    big(
      'mapSave',
      'Save the stage into it',
      M.c.stage ? 'This scene becomes what is on the stage now' : turn,
      () => {
        if (!M.c.stage) return;
        node.scene = Object.assign(M.c.stage(), { exits: node.scene.exits || [], sceneId: node.id, steps: [] });
        show(node, `“${node.name}” is now what is on the stage`);
      },
      M.c.stage ? '' : 'off',
    ),
    big('mapNext', '+ Room next door', `A new ${themeOf(M.theme).name.toLowerCase()}, already connected to this one`, () => nextDoor(node)),
    h(
      'select',
      {
        id: 'mapTheme',
        title: 'What kind of room “Room next door” builds',
        onchange: (ev) => {
          M.theme = ev.target.value;
          draw();
        },
      },
      ROOM_THEMES.map((t) => h('option', { value: t.id, selected: t.id === M.theme ? '' : null }, 'Next door: ' + t.name)),
    ),
    big('mapDup', '⧉ Duplicate', 'A copy to change', () => show(duplicate(node))),
    big(
      'mapLink',
      M.linking ? 'Click the other scene…' : 'Connect to another scene',
      'Puts an exit in both scenes',
      () => {
        M.linking = !M.linking;
        draw();
      },
      M.linking ? 'on' : '',
    ),
    big('mapUse', '▶ Go there in the story now', M.c.use ? 'In the step you are making' : turn, () => goThere(node), M.c.use ? 'primary' : 'off'),
    big('mapDel', 'Delete', 'Remove it from the map', () => remove(node), 'danger'),
  );
}
function overviewCard() {
  return h(
    'div',
    { class: 'card' },
    h('h3', {}, 'The map'),
    h(
      'p',
      { class: 'dim small' },
      'Every scene you kept lives here. Select one to change, duplicate, connect or delete it — or to move the story there.',
    ),
    M.list.length > 0 &&
      h(
        'div',
        { class: 'col' },
        M.list.map((d) =>
          h(
            'button',
            {
              class: 'mapdoc',
              onclick: () => {
                M.node = d.id;
                draw();
              },
            },
            h('i', { style: `background:${backdropCss(M.c.code, d.scene.backdrop)}` }),
            h('span', {}, h('b', {}, d.name), h('small', {}, about(d))),
          ),
        ),
      ),
  );
}
function connectionsCard() {
  const all = pairs();
  return h(
    'div',
    { class: 'card' },
    h('h3', {}, `Connections (${all.length})`),
    h(
      'p',
      { class: 'dim small' },
      'A connection puts an exit in both scenes. When the Player walks to an exit and you agree, the story travels there.',
    ),
    all.length
      ? all.map(([a, b]) => {
          const ways = waysBetween(a, b),
            locked = ways.some((x) => x.locked);
          return h(
            'div',
            { class: 'row conn' },
            h('span', { class: 'grow' }, `${a.name} ⇄ ${b.name}`),
            h(
              'button',
              {
                class: locked ? 'on' : '',
                title: 'Lock or unlock this way',
                onclick: () => {
                  for (const x of ways) x.locked = !locked;
                  saveNow();
                  draw();
                },
              },
              locked ? 'Locked' : 'Open',
            ),
            h(
              'button',
              {
                class: 'danger',
                title: 'Remove the connection',
                onclick: () => {
                  a.scene.exits = a.scene.exits.filter((x) => x.to !== b.id);
                  b.scene.exits = b.scene.exits.filter((x) => x.to !== a.id);
                  saveNow();
                  draw();
                },
              },
              '✕',
            ),
          );
        })
      : h('p', { class: 'dim small' }, 'No connections yet.'),
  );
}
function campaignsCard() {
  return h(
    'div',
    { class: 'card', id: 'campaigns' },
    h('h3', {}, 'Campaigns'),
    h(
      'p',
      { class: 'dim small' },
      'A campaign is this whole map: every scene, where it lies, and the ways between them. Save it to prepare large sets of levels and use them in any story.',
    ),
    h(
      'div',
      { class: 'row' },
      h('input', { id: 'campName', class: 'grow', placeholder: 'Name of the campaign', maxlength: 40 }),
      h('button', { id: 'campSave', class: 'primary', disabled: !M.list.length, onclick: saveCampaign }, 'Save campaign'),
    ),
    keptRows(
      kept.campaigns.all(),
      (c) => `${c.scenes.length} scenes`,
      (c) => {
        if (!addScenes(c.scenes, 60)) return;
        M.c.toast(`“${c.name}” is on the map`);
        /* its title screen too: at once for a story without one, after asking for one that has its own */
        const t = c.title;
        if (
          M.c.useTitle &&
          t &&
          (t.title || t.text || t.picture) &&
          (!M.c.hasStoryTitle() || confirm(`Use the title screen of “${c.name}” for this story?`))
        )
          M.c.useTitle(t);
      },
      'Put this campaign on the map',
      (c) => kept.campaigns.remove(c.id),
    ),
  );
}
function roomsCard() {
  const rooms = kept.rooms.all();
  return h(
    'div',
    { class: 'card', id: 'myRooms' },
    h('h3', {}, 'My saved rooms'),
    rooms.length
      ? keptRows(
          rooms,
          (r) => `${r.scene.entities.length - 1} things`,
          (r) => show(place(uniqueName(r.name), normScene(clone(r.scene)))),
          'Put a copy of this room on the map',
          (r) => kept.rooms.remove(r.id),
        )
      : h(
          'p',
          { class: 'dim small' },
          'Nothing yet. Build a room on the stage and press “Save room”: it stays on this device and can be used in any story.',
        ),
  );
}
function drawTools() {
  const node = M.list.find((x) => x.id === M.node);
  M.el.tools.replaceChildren(
    ...(node
      ? [nodeCard(node), connectionsCard(), campaignsCard()]
      : [
          overviewCard(),
          connectionsCard(),
          h(
            'div',
            { class: 'card' },
            h('h3', {}, 'Ready-made places'),
            h(
              'p',
              { class: 'dim small' },
              'A few connected, furnished rooms with things to click. Drop one on the map and change whatever you like.',
            ),
            SCENARIOS.map((sc) => big('scn-' + sc.id, sc.name, `${sc.rooms.length} rooms — ${sc.blurb}`, () => addScenario(sc))),
          ),
          campaignsCard(),
          roomsCard(),
        ]),
  );
}
