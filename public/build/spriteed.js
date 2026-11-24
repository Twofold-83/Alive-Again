/* The sprite editor: draw a thing pixel by pixel — all four of its pictures: as it stands, from the other side,
 * and each of the two after someone used it.
 *
 *   openSpriteEditor({ from, edit, onSave(assetId) })
 *     from   { name, slug, cat, base, urls: { '': url, side, used, sideUsed } }   a thing to start from (a library
 *            sprite, or the story's own); nothing: a new object
 *     edit   one of my own objects (see catalog.js OWN), to change it
 *
 * What is drawn is kept on this device (catalog.js: OWN, localStorage tf.objects) and sent into the story when it
 * is put on a stage, so the other player sees it too. Three ways to keep a drawing:
 *   a campaign sprite     an edited copy of a library thing; the original stays as it is
 *   permanently altered   from now on this drawing stands in for the library thing wherever it is offered here
 *   a new object          saved into "My objects" or into any category of the library
 */
import { h, toast } from '../core/dom.js';
import { act } from '../core/net.js';
import { app } from '../core/state.js';
import { OWN, keepOwn, PIXEL } from '../core/catalog.js';

const PALETTE = [
  '#0b0a10',
  '#16141d',
  '#1e1b24',
  '#2e2e38',
  '#4a4a55',
  '#565663',
  '#77747a',
  '#8b8e98',
  '#9a979a',
  '#8d8a84',
  '#e4dfd0',
  '#d8d0b4',
  '#c8bea3',
  '#b5a47c',
  '#4a2f22',
  '#6b4630',
  '#8c6240',
  '#a8855c',
  '#584031',
  '#84482a',
  '#a0603a',
  '#9a7a34',
  '#b8963a',
  '#a8904e',
  '#d98b2b',
  '#e9c45a',
  '#d9d38a',
  '#8f1d1d',
  '#b3342c',
  '#6b2332',
  '#a8697a',
  '#48305a',
  '#28304e',
  '#34566b',
  '#5d7f8c',
  '#9ebcc2',
  '#2e5658',
  '#2e4835',
  '#4a5e36',
  '#4f6b3c',
  '#6f8a3c',
  '#7c9668',
  '#5fae5a',
  '#d6c2a6',
  '#c79f7c',
  '#a57a52',
  '#6d4c36',
  '#aebfc4',
];
const VIEWS = ['', 'side', 'used', 'sideUsed'];
const NEW_MAX = 48; // a new object is at most three tiles each way: a car is 3 × 2 (48 × 32)
/** Ready sizes for a new object, in tiles. */
const PRESETS = [
  [1, 1],
  [1, 2],
  [2, 1],
  [2, 2],
  [3, 2],
  [2, 3],
];
const E = {
  o: null,
  pics: {},
  tab: '',
  base: 'front',
  col: PALETTE[0],
  tool: 'pen',
  undo: [],
  name: '',
  cat: 'own',
  from: null,
  edit: null,
  max: NEW_MAX,
};
const root = () => {
  let el = document.querySelector('#spriteed');
  if (!el) document.body.append((el = h('div', { id: 'spriteed', class: 'overlay', hidden: true })));
  return el;
};
const blank = (w = 16, hh = 16) => ({ w, h: hh, px: new Array(w * hh).fill(null) });
const cur = () => E.pics[E.tab];
const tabName = (k) => {
  const [a, b] = E.base === 'side' ? ['Side', 'Front'] : ['Front', 'Side'];
  return { '': a, side: b, used: `${a}, used`, sideUsed: `${b}, used` }[k];
};

/** Send one of my objects into this story (once): the main picture, then its other pictures. Returns the asset id. */
export async function useOwn(o) {
  const have = o.in && o.in[app.code];
  if (have && app.S.assets.some((a) => a.id === have)) return have;
  const main = await act('addAsset', { kind: 'sprite', name: o.name, dataUrl: o.pics[''], base: o.base });
  for (const k of VIEWS.slice(1))
    if (o.pics[k]) await act('addAsset', { kind: 'sprite', name: o.name, dataUrl: o.pics[k], of: main.asset.id, view: k });
  o.in = { ...(o.in || {}), [app.code]: main.asset.id };
  keepOwn();
  return main.asset.id;
}
export function forgetOwn(id) {
  OWN.delete(id);
  keepOwn();
}

function loadImage(src) {
  return new Promise((ok) => {
    const im = new Image();
    im.onload = () => {
      const w = Math.min(64, im.naturalWidth),
        hh = Math.min(64, im.naturalHeight),
        cv = Object.assign(document.createElement('canvas'), { width: w, height: hh }),
        g = cv.getContext('2d');
      g.imageSmoothingEnabled = false;
      g.drawImage(im, 0, 0, w, hh);
      const d = g.getImageData(0, 0, w, hh).data,
        px = [];
      for (let i = 0; i < w * hh; i++)
        px.push(d[i * 4 + 3] < 128 ? null : '#' + [0, 1, 2].map((k) => d[i * 4 + k].toString(16).padStart(2, '0')).join(''));
      ok({ w, h: hh, px });
    };
    im.onerror = () => ok(null);
    im.src = src;
  });
}
function toDataUrl(p) {
  const cv = Object.assign(document.createElement('canvas'), { width: p.w, height: p.h }),
    g = cv.getContext('2d');
  p.px.forEach((c, i) => {
    if (!c) return;
    g.fillStyle = c;
    g.fillRect(i % p.w, Math.floor(i / p.w), 1, 1);
  });
  return cv.toDataURL('image/png');
}
function resize(p, w, hh) {
  const px = new Array(w * hh).fill(null),
    ox = Math.floor((w - p.w) / 2),
    oy = hh - p.h; // a thing stands on its bottom row: keep the feet where they are
  for (let y = 0; y < p.h; y++)
    for (let x = 0; x < p.w; x++) {
      const nx = x + ox,
        ny = y + oy;
      if (nx >= 0 && ny >= 0 && nx < w && ny < hh) px[ny * w + nx] = p.px[y * p.w + x];
    }
  Object.assign(p, { w, h: hh, px });
}
const snap = () => {
  E.undo.push({ tab: E.tab, ...cur(), px: [...cur().px] });
  if (E.undo.length > 40) E.undo.shift();
};

/** Keep what is drawn: on this device, and in this story. kind: 'campaign' | 'alter' | 'new' | 'same' */
async function save(kind) {
  if (!E.pics[''].px.some(Boolean)) return toast('Draw the main picture first');
  const pics = {};
  for (const k of VIEWS) if (E.pics[k] && E.pics[k].px.some(Boolean)) pics[k] = toDataUrl(E.pics[k]);
  const name = E.name.trim() || (E.from && E.from.name) || 'My object';
  let o;
  if (kind === 'same') o = { ...E.edit, name, base: E.base, pics, in: {} };
  else if (kind === 'alter') {
    /* asked twice: this replaces the thing wherever it is offered on this device */
    if (
      !confirm(`Permanently alter “${E.from.name}”?\n\nFrom now on your drawing is what you get wherever “${E.from.name}” is offered on this device.`)
    )
      return;
    if (!confirm('Are you sure? The original picture will no longer be offered here (you can undo this under “Something of your own”).')) return;
    for (const x of [...OWN.values()]) if (x.slug === E.from.slug) OWN.delete(x.id);
    o = { id: 'o' + Date.now().toString(36), name, cat: E.from.cat || 'own', slug: E.from.slug, base: E.base, pics, in: {} };
  } else o = { id: 'o' + Date.now().toString(36), name, cat: kind === 'campaign' ? 'campaign' : E.cat, base: E.base, pics, in: {} };
  OWN.set(o.id, o);
  if (!keepOwn()) toast('This device has no room left: the drawing is in this story only');
  try {
    const id = await useOwn(o);
    const done = E.o.onSave;
    close();
    toast(
      kind === 'alter'
        ? `“${name}” now stands in for the original`
        : kind === 'campaign'
          ? `“${name}” is kept under Campaign sprites`
          : `“${name}” is saved`,
    );
    if (done) done(id, o);
  } catch (e) {
    toast(e.message);
  }
}

function draw() {
  const el = root(),
    p = cur(),
    cell = Math.max(5, Math.floor(Math.min(500, innerWidth - 40) / Math.max(p.w, p.h))),
    cv = Object.assign(document.createElement('canvas'), { width: p.w * cell, height: p.h * cell, id: 'spriteCanvas' }),
    g = cv.getContext('2d');
  const bg = (x, y) => ((x + y) % 2 ? '#2a2631' : '#221f29');
  const paint = () => {
    for (let y = 0; y < p.h; y++)
      for (let x = 0; x < p.w; x++) {
        g.fillStyle = p.px[y * p.w + x] || bg(x, y);
        g.fillRect(x * cell, y * cell, cell, cell);
      }
    /* tile lines: a tile is 16 pixels */
    g.fillStyle = 'rgba(255,255,255,.12)';
    for (let x = 16; x < p.w; x += 16) g.fillRect(x * cell, 0, 1, p.h * cell);
    for (let y = p.h - 16; y > 0; y -= 16) g.fillRect(0, y * cell, p.w * cell, 1);
  };
  paint();
  const at = (ev) => {
    const r = cv.getBoundingClientRect();
    return [Math.floor(((ev.clientX - r.left) / r.width) * p.w), Math.floor(((ev.clientY - r.top) / r.height) * p.h)];
  };
  const apply = (x, y) => {
    if (x < 0 || y < 0 || x >= p.w || y >= p.h) return;
    const i = y * p.w + x;
    if (E.tool === 'pick') {
      if (p.px[i]) E.col = p.px[i];
      E.tool = 'pen';
      return draw();
    }
    if (E.tool === 'fill') {
      const from = p.px[i],
        todo = [i];
      if (from === E.col) return;
      while (todo.length) {
        const k = todo.pop();
        if (p.px[k] !== from) continue;
        p.px[k] = E.col;
        const kx = k % p.w;
        if (kx > 0) todo.push(k - 1);
        if (kx < p.w - 1) todo.push(k + 1);
        if (k >= p.w) todo.push(k - p.w);
        if (k < p.w * (p.h - 1)) todo.push(k + p.w);
      }
      return paint();
    }
    p.px[i] = E.tool === 'erase' ? null : E.col;
    g.fillStyle = p.px[i] || bg(x, y);
    g.fillRect(x * cell, y * cell, cell, cell);
  };
  let down = false;
  cv.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    snap();
    down = E.tool === 'pen' || E.tool === 'erase';
    cv.setPointerCapture(ev.pointerId);
    apply(...at(ev));
  });
  cv.addEventListener('pointermove', (ev) => down && apply(...at(ev)));
  cv.addEventListener('pointerup', () => (down = false));
  const btn = (label, fn, o = {}) =>
    h(
      'button',
      {
        ...o,
        onclick: () => {
          fn();
          draw();
        },
      },
      label,
    );
  const tool = (id, label) => btn(label, () => (E.tool = id), { 'data-tool': id, class: E.tool === id ? 'on' : '' });
  const name = h('input', {
    id: 'spriteName',
    class: 'grow',
    placeholder: 'What is it?',
    maxlength: 30,
    value: E.name,
    oninput: () => (E.name = name.value),
  });
  const sizes = (k) => {
    const all = [8, 12, 16, 20, 24, 28, 32, 40, 48, 64].filter((n) => n <= E.max);
    const s = h(
      'select',
      {
        'data-size': k,
        onchange: () => {
          snap();
          resize(p, k === 'w' ? +s.value : p.w, k === 'h' ? +s.value : p.h);
          draw();
        },
      },
      [...new Set([...all, p[k]])].sort((a, b) => a - b).map((n) => h('option', { value: n, selected: n === p[k] }, String(n))),
    );
    return s;
  };
  const others = VIEWS.filter((k) => k !== E.tab && E.pics[k] && E.pics[k].px.some(Boolean));
  const cats = [['own', 'My objects'], ...PIXEL.filter((c) => c.group === 'thing').map((c) => [c.id, c.label])];
  const catSel = h(
    'select',
    { id: 'spriteCat', onchange: () => (E.cat = catSel.value) },
    cats.map(([id, label]) => h('option', { value: id, selected: id === E.cat }, label)),
  );
  el.replaceChildren(
    h(
      'div',
      { class: 'sheet spritesheet' },
      h(
        'header',
        {},
        h('b', {}, 'Sprite editor'),
        h(
          'span',
          { class: 'dim small' },
          E.from ? `Editing “${E.from.name}”` : E.edit ? `Editing “${E.edit.name}”` : 'A new object — up to 3 × 2 tiles (a car, a wagon)',
        ),
        h('span', { class: 'grow' }),
        h('button', { id: 'spriteClose', onclick: close }, 'Close'),
      ),
      h(
        'div',
        { class: 'spritebody' },
        h(
          'div',
          { class: 'spritecanvas' },
          h(
            'div',
            { class: 'tabs spritetabs' },
            VIEWS.map((k) =>
              btn(
                [tabName(k), E.pics[k].px.some(Boolean) ? h('img', { src: toDataUrl(E.pics[k]), alt: '' }) : h('small', { class: 'dim' }, ' empty')],
                () => (E.tab = k),
                { 'data-pic': k || 'main', class: E.tab === k ? 'on' : '' },
              ),
            ),
          ),
          cv,
        ),
        h(
          'div',
          { class: 'spritetools' },
          h('div', { class: 'row' }, tool('pen', 'Draw'), tool('erase', 'Erase'), tool('fill', 'Fill'), tool('pick', 'Pick colour')),
          h(
            'div',
            { class: 'swatches' },
            PALETTE.map((c) =>
              btn(
                '',
                () => {
                  E.col = c;
                  if (E.tool !== 'fill') E.tool = 'pen';
                },
                { class: 'sw' + (c === E.col ? ' on' : ''), style: `background:${c}`, 'data-col': c, title: c },
              ),
            ),
          ),
          h(
            'div',
            { class: 'row' },
            h('span', { class: 'dim small' }, 'Wide'),
            sizes('w'),
            h('span', { class: 'dim small' }, 'Tall'),
            sizes('h'),
            h('span', { class: 'dim small' }, '(a tile is 16, a person 16 × 33)'),
          ),
          E.max === NEW_MAX &&
            h(
              'div',
              { class: 'row', id: 'sizePresets' },
              h('span', { class: 'dim small' }, 'Tiles'),
              PRESETS.map(([tw, th]) =>
                h(
                  'button',
                  {
                    'data-tiles': `${tw}x${th}`,
                    class: p.w === tw * 16 && p.h === th * 16 ? 'on' : '',
                    title: tw === 3 ? 'Large: a car, a cart, a wagon' : '',
                    onclick: () => {
                      snap();
                      resize(p, tw * 16, th * 16);
                      draw();
                    },
                  },
                  `${tw} × ${th}`,
                ),
              ),
            ),
          h(
            'div',
            { class: 'row' },
            btn(
              '↶ Undo',
              () => {
                const u = E.undo.pop();
                E.tab = u.tab;
                E.pics[u.tab] = { w: u.w, h: u.h, px: u.px };
              },
              { disabled: !E.undo.length },
            ),
            btn('Mirror', () => {
              snap();
              const px = [];
              for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) px.push(p.px[y * p.w + (p.w - 1 - x)]);
              p.px = px;
            }),
            btn('Clear', () => {
              snap();
              p.px = new Array(p.w * p.h).fill(null);
            }),
          ),
          others.length > 0 &&
            h(
              'div',
              { class: 'row' },
              h('span', { class: 'dim small' }, 'Start this picture from'),
              others.map((k) =>
                btn(tabName(k), () => {
                  snap();
                  E.pics[E.tab] = { w: E.pics[k].w, h: E.pics[k].h, px: [...E.pics[k].px] };
                }),
              ),
            ),
          h(
            'label',
            { class: 'row' },
            h('input', {
              type: 'checkbox',
              checked: E.base === 'side',
              onchange: (ev) => {
                E.base = ev.target.checked ? 'side' : 'front';
                draw();
              },
            }),
            h('span', {}, 'The first picture shows the thing from the side'),
          ),
          h('div', { class: 'row' }, name),
          /* how to keep it */
          E.from && E.from.slug
            ? h(
                'div',
                { class: 'card' },
                h('button', { class: 'primary', id: 'spriteSave', onclick: () => save('campaign') }, 'Save to campaign sprites'),
                h('small', { class: 'dim' }, 'An edited copy with all its pictures. The original stays as it is.'),
                h('button', { id: 'spriteAlter', class: 'danger', onclick: () => save('alter') }, 'Permanently alter asset'),
                h('small', { class: 'dim' }, 'Your drawing stands in for the original wherever it is offered on this device.'),
              )
            : E.edit
              ? h('div', { class: 'card' }, h('button', { class: 'primary', id: 'spriteSave', onclick: () => save('same') }, 'Save changes'))
              : h(
                  'div',
                  { class: 'card' },
                  h('div', { class: 'row' }, h('span', { class: 'dim small' }, 'Save into'), catSel),
                  h('button', { class: 'primary', id: 'spriteSave', onclick: () => save('new') }, 'Save object'),
                ),
          h(
            'small',
            { class: 'dim' },
            'Drawings are kept on this device. Put on a stage they are sent into the story, so the other player sees them too.',
          ),
        ),
      ),
    ),
  );
}
function close() {
  root().hidden = true;
  root().replaceChildren();
}
export async function openSpriteEditor(o = {}) {
  Object.assign(E, { o, tab: '', undo: [], tool: 'pen', from: o.from || null, edit: o.edit || null, cat: 'own', pics: {} });
  const urls = o.edit ? o.edit.pics : o.from ? o.from.urls : {};
  E.base = (o.edit ? o.edit.base : o.from && o.from.base) || 'front';
  E.name = o.edit ? o.edit.name : o.from ? o.from.name : '';
  for (const k of VIEWS) E.pics[k] = (urls[k] && (await loadImage(urls[k]))) || blank();
  /* an empty picture starts at the size of the main one */
  for (const k of VIEWS.slice(1)) if (!E.pics[k].px.some(Boolean)) E.pics[k] = blank(E.pics[''].w, E.pics[''].h);
  E.max = o.from || o.edit ? 64 : NEW_MAX;
  root().hidden = false;
  draw();
}
