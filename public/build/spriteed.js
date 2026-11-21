/* The sprite editor: draw a thing pixel by pixel, from nothing or from any picture of the library.
 *
 *   openSpriteEditor({ src, name, onSave(assetId) })     src: an image url to start from (optional)
 *
 * A finished drawing goes two places: into this story (a custom asset, c:<id>), and into "My drawings" on this
 * device (localStorage tf.own), from where it can be put into any other story. */
import { h, toast } from '../core/dom.js';
import { act } from '../core/net.js';
import { app } from '../core/state.js';

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
const SIZES = [8, 12, 16, 20, 24, 32, 40, 48, 64];
const E = { o: null, w: 16, h: 16, px: [], col: PALETTE[0], tool: 'pen', undo: [], name: '' };
const root = () => {
  let el = document.querySelector('#spriteed');
  if (!el) document.body.append((el = h('div', { id: 'spriteed', class: 'overlay', hidden: true })));
  return el;
};

/** Drawings kept on this device: [{ id, name, w, h, dataUrl, in: { storyCode: assetId } }] */
export function ownDrawings() {
  try {
    const l = JSON.parse(localStorage.getItem('tf.own') || '[]');
    return Array.isArray(l) ? l : [];
  } catch {
    return [];
  }
}
function keepOwn(list) {
  try {
    localStorage.setItem('tf.own', JSON.stringify(list.slice(0, 200)));
  } catch {
    toast('This device has no room left for more drawings');
  }
}
export function forgetOwn(id) {
  keepOwn(ownDrawings().filter((d) => d.id !== id));
}
/** The asset id of one of my drawings in this story: it is sent to the story the first time it is used there. */
export async function useOwn(d) {
  if (d.in && d.in[app.code] && app.S.assets.some((a) => a.id === d.in[app.code])) return d.in[app.code];
  const r = await act('addAsset', { kind: 'sprite', name: d.name, dataUrl: d.dataUrl });
  keepOwn(ownDrawings().map((x) => (x.id === d.id ? { ...x, in: { ...(x.in || {}), [app.code]: r.asset.id } } : x)));
  return r.asset.id;
}

function resize(w, h) {
  const px = new Array(w * h).fill(null),
    ox = Math.floor((w - E.w) / 2),
    oy = h - E.h; // a thing stands on its bottom row: keep the feet where they are
  for (let y = 0; y < E.h; y++)
    for (let x = 0; x < E.w; x++) {
      const nx = x + ox,
        ny = y + oy;
      if (nx >= 0 && ny >= 0 && nx < w && ny < h) px[ny * w + nx] = E.px[y * E.w + x];
    }
  Object.assign(E, { w, h, px });
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
      Object.assign(E, { w, h: hh, px });
      ok();
    };
    im.onerror = () => ok();
    im.src = src;
  });
}
function toDataUrl() {
  const cv = Object.assign(document.createElement('canvas'), { width: E.w, height: E.h }),
    g = cv.getContext('2d');
  E.px.forEach((c, i) => {
    if (!c) return;
    g.fillStyle = c;
    g.fillRect(i % E.w, Math.floor(i / E.w), 1, 1);
  });
  return cv.toDataURL('image/png');
}

function draw() {
  const el = root(),
    cell = Math.max(6, Math.floor(Math.min(520, innerWidth - 40) / Math.max(E.w, E.h))),
    cv = Object.assign(document.createElement('canvas'), { width: E.w * cell, height: E.h * cell, id: 'spriteCanvas' }),
    g = cv.getContext('2d');
  const paint = () => {
    for (let y = 0; y < E.h; y++)
      for (let x = 0; x < E.w; x++) {
        g.fillStyle = E.px[y * E.w + x] || ((x + y) % 2 ? '#2a2631' : '#221f29');
        g.fillRect(x * cell, y * cell, cell, cell);
      }
  };
  paint();
  const at = (ev) => {
    const r = cv.getBoundingClientRect();
    return [Math.floor(((ev.clientX - r.left) / r.width) * E.w), Math.floor(((ev.clientY - r.top) / r.height) * E.h)];
  };
  const apply = (x, y) => {
    if (x < 0 || y < 0 || x >= E.w || y >= E.h) return;
    const i = y * E.w + x;
    if (E.tool === 'pick') {
      if (E.px[i]) E.col = E.px[i];
      E.tool = 'pen';
      return draw();
    }
    if (E.tool === 'fill') {
      const from = E.px[i],
        to = E.col,
        todo = [i];
      if (from === to) return;
      while (todo.length) {
        const k = todo.pop();
        if (E.px[k] !== from) continue;
        E.px[k] = to;
        const kx = k % E.w;
        if (kx > 0) todo.push(k - 1);
        if (kx < E.w - 1) todo.push(k + 1);
        if (k >= E.w) todo.push(k - E.w);
        if (k < E.w * (E.h - 1)) todo.push(k + E.w);
      }
      return paint();
    }
    E.px[i] = E.tool === 'erase' ? null : E.col;
    g.fillStyle = E.px[i] || ((x + y) % 2 ? '#2a2631' : '#221f29');
    g.fillRect(x * cell, y * cell, cell, cell);
  };
  let down = false;
  cv.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    E.undo.push({ w: E.w, h: E.h, px: [...E.px] });
    if (E.undo.length > 40) E.undo.shift();
    down = E.tool === 'pen' || E.tool === 'erase';
    cv.setPointerCapture(ev.pointerId);
    apply(...at(ev));
  });
  cv.addEventListener('pointermove', (ev) => down && apply(...at(ev)));
  cv.addEventListener('pointerup', () => (down = false));
  const tool = (id, label) =>
    h(
      'button',
      {
        'data-tool': id,
        class: E.tool === id ? 'on' : '',
        onclick: () => {
          E.tool = id;
          draw();
        },
      },
      label,
    );
  const name = h('input', { id: 'spriteName', placeholder: 'What is it?', maxlength: 30, value: E.name, oninput: () => (E.name = name.value) });
  const save = async () => {
    if (!E.px.some(Boolean)) return toast('Draw something first');
    const d = { id: 'o' + Date.now().toString(36), name: E.name.trim() || 'My drawing', w: E.w, h: E.h, dataUrl: toDataUrl(), in: {} };
    try {
      const r = await act('addAsset', { kind: 'sprite', name: d.name, dataUrl: d.dataUrl });
      d.in[app.code] = r.asset.id;
      keepOwn([d, ...ownDrawings()]);
      const done = E.o.onSave;
      close();
      toast(`“${d.name}” is kept under My drawings`);
      if (done) done(r.asset.id);
    } catch (e) {
      toast(e.message);
    }
  };
  el.replaceChildren(
    h(
      'div',
      { class: 'sheet spritesheet' },
      h('header', {}, h('b', {}, 'Sprite editor'), h('span', { class: 'grow' }), h('button', { id: 'spriteClose', onclick: close }, 'Close')),
      h(
        'div',
        { class: 'spritebody' },
        h('div', { class: 'spritecanvas' }, cv),
        h(
          'div',
          { class: 'spritetools' },
          h('div', { class: 'row' }, tool('pen', 'Draw'), tool('erase', 'Erase'), tool('fill', 'Fill'), tool('pick', 'Pick colour')),
          h(
            'div',
            { class: 'swatches' },
            PALETTE.map((c) =>
              h('button', {
                class: 'sw' + (c === E.col ? ' on' : ''),
                style: `background:${c}`,
                'data-col': c,
                title: c,
                onclick: () => {
                  E.col = c;
                  if (E.tool !== 'fill') E.tool = 'pen';
                  draw();
                },
              }),
            ),
          ),
          h(
            'div',
            { class: 'row' },
            h('span', { class: 'dim small' }, 'Wide'),
            sizeSel('w'),
            h('span', { class: 'dim small' }, 'Tall'),
            sizeSel('h'),
            h('span', { class: 'dim small' }, '(a person is 16 × 33)'),
          ),
          h(
            'div',
            { class: 'row' },
            h(
              'button',
              {
                disabled: !E.undo.length,
                onclick: () => {
                  Object.assign(E, E.undo.pop());
                  draw();
                },
              },
              '↶ Undo',
            ),
            h(
              'button',
              {
                onclick: () => {
                  E.undo.push({ w: E.w, h: E.h, px: [...E.px] });
                  const px = [];
                  for (let y = 0; y < E.h; y++) for (let x = 0; x < E.w; x++) px.push(E.px[y * E.w + (E.w - 1 - x)]);
                  E.px = px;
                  draw();
                },
              },
              'Mirror',
            ),
            h(
              'button',
              {
                onclick: () => {
                  E.undo.push({ w: E.w, h: E.h, px: [...E.px] });
                  E.px = new Array(E.w * E.h).fill(null);
                  draw();
                },
              },
              'Clear',
            ),
          ),
          h('div', { class: 'row' }, name, h('button', { class: 'primary', id: 'spriteSave', onclick: save }, 'Save')),
          h('small', { class: 'dim' }, 'Saved drawings go into this story and into “My drawings” on this device, for every story.'),
        ),
      ),
    ),
  );
}
function sizeSel(k) {
  const s = h(
    'select',
    {
      onchange: () => {
        E.undo.push({ w: E.w, h: E.h, px: [...E.px] });
        resize(k === 'w' ? +s.value : E.w, k === 'h' ? +s.value : E.h);
        draw();
      },
    },
    [...new Set([...SIZES, E[k]])].sort((a, b) => a - b).map((n) => h('option', { value: n, selected: n === E[k] }, String(n))),
  );
  return s;
}
function close() {
  root().hidden = true;
  root().replaceChildren();
}
export async function openSpriteEditor(o = {}) {
  Object.assign(E, { o, w: 16, h: 16, px: new Array(256).fill(null), undo: [], tool: 'pen', name: o.name || '' });
  if (o.src) await loadImage(o.src);
  root().hidden = false;
  draw();
}
