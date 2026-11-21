/* Paper-doll characters: a person put together from a head, a torso, an arm sprite and a leg sprite
 * (public/doll, made by tools/make-dolls.js), whose head, arms and legs can be turned at the joints.
 *
 * On the stage such a character is an ordinary thing whose `asset` names its parts:
 *     d:h012.t033.a005.l010
 * and whose `pose` holds five angles in degrees: [head, left arm, right arm, left leg, right leg]
 * ("left" is the left side of the picture). 0 means hanging straight down (the head: upright). */
import { h } from './dom.js';
import { FEELS } from '../shared/options.js';

export const DOLLS = { heads: [], torsos: [], arms: [], legs: [], feels: [] };
export async function loadDolls() {
  try {
    const r = await fetch('doll/index.json', { cache: 'no-cache' });
    if (r.ok) Object.assign(DOLLS, await r.json());
  } catch {
    /* no doll parts: the character maker stays empty */
  }
}

/** Where each part sits in the figure, in figure pixels (the whole figure is 16 x 33), and the joint it turns about. */
const RIG = {
  ll: { x: 3, y: 21, w: 6, h: 12, px: 3, py: 0.5, mirror: true },
  lr: { x: 7, y: 21, w: 6, h: 12, px: 3, py: 0.5 },
  t: { x: 2, y: 11, w: 12, h: 11, px: 6, py: 5 },
  al: { x: 0, y: 12, w: 5, h: 12, px: 2.5, py: 1 },
  ar: { x: 11, y: 12, w: 5, h: 12, px: 2.5, py: 1, mirror: true },
  h: { x: 1, y: 0, w: 14, h: 13, px: 7, py: 12 },
};
export const DOLL_W = 16,
  DOLL_H = 33;
/** The order of the angles in a pose. */
export const JOINTS = ['h', 'al', 'ar', 'll', 'lr'];
export const REST = [0, 6, -6, 0, 0];
/** Ready-made poses, for one press. */
export const POSES = [
  ['Stand', REST],
  ['Arms up', [0, 160, -160, 0, 0]],
  ['Wave', [8, 6, -150, 0, 0]],
  ['Point', [0, 6, -92, 0, 0]],
  ['Reach', [0, 78, -78, 0, 0]],
  ['Cower', [18, 150, -150, 8, -8]],
  ['Stride', [0, -28, -28, 22, 22]],
  ['Run', [6, -60, -60, 40, 40]],
  ['Kick', [0, 30, -30, 0, -75]],
  ['Shrug', [0, 40, -40, 0, 0]],
  ['Hang head', [28, 2, -2, 0, 0]],
  ['Sprawl', [-20, 110, -70, 35, -40]],
  ['Sit', [0, 24, -24, 82, 82]],
  ['Creep', [16, -50, -72, 26, -14]],
  ['Dance', [-8, 124, -40, -22, 26]],
  ['Hide face', [20, 172, -172, 0, 0]],
  ['Beg', [-14, 120, -120, 0, 0]],
  ['Stagger', [-24, 44, -12, -18, 30]],
];

export const isDoll = (asset) => typeof asset === 'string' && asset.startsWith('d:');
export function dollParts(asset) {
  const m = /^d:(h\d+)\.(t\d+)\.(a\d+)\.(l\d+)$/.exec(asset || '');
  return m ? { h: m[1], t: m[2], a: m[3], l: m[4] } : { h: 'h001', t: 't001', a: 'a001', l: 'l001' };
}
export const dollAsset = (p) => `d:${p.h}.${p.t}.${p.a}.${p.l}`;
export function randomDoll() {
  const pick = (list, fallback) => (list.length ? list[Math.floor(Math.random() * list.length)].id : fallback);
  return dollAsset({ h: pick(DOLLS.heads, 'h001'), t: pick(DOLLS.torsos, 't001'), a: pick(DOLLS.arms, 'a001'), l: pick(DOLLS.legs, 'l001') });
}
const u = (n) => `calc(var(--dp) * ${n})`;

/** The figure as an element. It scales with the font size around it (a whole figure is about 1.55em tall). */
export function dollNode(asset, cls = '', pose, feel) {
  const p = dollParts(asset),
    src = { ll: p.l, lr: p.l, t: p.t, al: p.a, ar: p.a, h: p.h };
  const el = h('span', { class: 'doll ' + cls });
  for (const key of ['ll', 'lr', 't', 'al', 'ar', 'h']) {
    const g = RIG[key];
    const part = h(
      'span',
      { class: 'dpart ' + key, style: `left:${u(g.x)};top:${u(g.y)};width:${u(g.w)};height:${u(g.h)};transform-origin:${u(g.px)} ${u(g.py)}` },
      h('img', { src: `doll/${src[key]}.png`, alt: '', draggable: 'false', class: g.mirror ? 'flip' : '' }),
    );
    part.dataset.part = key;
    el.append(part);
  }
  el.dataset.head = p.h;
  poseDoll(el, pose);
  feelDoll(el, feel);
  return el;
}
/** The whole figure as one picture (16 x 33, standing at rest), for the sprite editor. */
export async function dollDataUrl(asset, feel) {
  const p = dollParts(asset),
    src = { ll: p.l, lr: p.l, t: p.t, al: p.a, ar: p.a, h: p.h },
    cv = Object.assign(document.createElement('canvas'), { width: DOLL_W, height: DOLL_H }),
    g = cv.getContext('2d');
  const img = (url) =>
    new Promise((ok) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = () => ok(null);
      im.src = url;
    });
  for (const key of ['ll', 'lr', 't', 'al', 'ar', 'h']) {
    const r = RIG[key],
      fi = key === 'h' ? DOLLS.feels.indexOf(feel) : -1,
      im = await img(fi >= 0 ? `doll/f-${p.h}.png` : `doll/${src[key]}.png`);
    if (!im) continue;
    g.save();
    if (r.mirror) {
      g.translate(r.x + r.w, r.y);
      g.scale(-1, 1);
    } else g.translate(r.x, r.y);
    g.drawImage(im, fi >= 0 ? fi * r.w : 0, 0, r.w, r.h, 0, 0, r.w, r.h);
    g.restore();
  }
  return cv.toDataURL('image/png');
}
/** Put a feeling on the face of a figure made by dollNode ('' for the face the head came with). */
export function feelDoll(el, feel) {
  feel = feel || '';
  if ((el.dataset.feel || '') === feel) return;
  el.dataset.feel = feel;
  const head = el.querySelector('.dpart.h'),
    n = DOLLS.feels.length,
    i = DOLLS.feels.indexOf(feel);
  let face = head.querySelector('.face');
  if (i < 0) return void (face && face.remove());
  if (!face) head.append((face = h('i', { class: 'face' })));
  face.style.cssText = `background-image:url("doll/f-${el.dataset.head}.png");background-size:${n * 100}% 100%;background-position:${(i / (n - 1)) * 100}% 0`;
}
/** Turn the joints of a figure made by dollNode. */
export function poseDoll(el, pose) {
  const a = Array.isArray(pose) && pose.length === 5 ? pose : REST;
  JOINTS.forEach((key, i) => {
    const part = el.querySelector('.dpart.' + key);
    if (part) part.style.transform = `rotate(${a[i] || 0}deg)`;
  });
}

/**
 * What a character does and feels: a big figure whose head, arms and legs are turned by dragging them, ready-made
 * things to do, and the feelings that show on the face.
 * onChange(pose) is called while dragging and after a preset; o.feel is the feeling now, o.onFeel(feel) a new one.
 */
export function poseEditor(asset, pose, onChange, o = {}) {
  let cur = [...(Array.isArray(pose) && pose.length === 5 ? pose : REST)];
  const figure = dollNode(asset, 'big live', cur);
  const set = (next) => {
    cur = next.map((v) => Math.round(v));
    poseDoll(figure, cur);
    onChange([...cur]);
  };
  let drag = null;
  const turn = (ev) => {
    const g = RIG[drag],
      box = figure.getBoundingClientRect(),
      dp = box.width / DOLL_W;
    const dx = ev.clientX - (box.left + (g.x + g.px) * dp),
      dy = ev.clientY - (box.top + (g.y + g.py) * dp);
    if (Math.hypot(dx, dy) < dp * 1.5) return;
    let deg = drag === 'h' ? (Math.atan2(dx, -dy) * 180) / Math.PI : (Math.atan2(-dx, dy) * 180) / Math.PI;
    if (drag === 'h') deg = Math.max(-45, Math.min(45, deg));
    const next = [...cur];
    next[JOINTS.indexOf(drag)] = deg;
    set(next);
  };
  figure.addEventListener('pointerdown', (ev) => {
    const part = ev.target.closest('.dpart');
    if (!part || part.dataset.part === 't') return;
    ev.preventDefault();
    drag = part.dataset.part;
    figure.setPointerCapture(ev.pointerId);
    figure.classList.add('dragging');
  });
  figure.addEventListener('pointermove', (ev) => {
    if (drag) turn(ev);
  });
  const stop = () => {
    drag = null;
    figure.classList.remove('dragging');
  };
  figure.addEventListener('pointerup', stop);
  figure.addEventListener('pointercancel', stop);
  let feel = o.feel || '';
  feelDoll(figure, feel);
  const feels = h('div', { class: 'chips wrap feels' });
  const drawFeels = () =>
    feels.replaceChildren(
      ...[['', 'As usual'], ...FEELS].map(([id, label]) =>
        h(
          'button',
          {
            'data-feel': id || 'none',
            class: id === feel ? 'on' : '',
            onclick: () => {
              feel = id;
              feelDoll(figure, feel);
              drawFeels();
              o.onFeel(feel);
            },
          },
          label,
        ),
      ),
    );
  drawFeels();
  return h(
    'div',
    { class: 'poser' },
    h('div', { class: 'poserstage' }, figure),
    h('small', { class: 'dim' }, 'Drag the head, an arm or a leg to turn it.'),
    o.onFeel && h('b', { class: 'actlab' }, 'Feels'),
    o.onFeel && feels,
    h('b', { class: 'actlab' }, 'Does'),
    h(
      'div',
      { class: 'chips wrap' },
      POSES.map(([name, angles]) => h('button', { 'data-pose': name, onclick: () => set([...angles]) }, name)),
    ),
  );
}
