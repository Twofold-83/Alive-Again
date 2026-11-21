/* Paper-doll characters: a person put together from a head, a torso, an arm sprite and a leg sprite
 * (public/doll, made by tools/make-dolls.js), whose head, arms and legs can be turned at the joints.
 *
 * On the stage such a character is an ordinary thing whose `asset` names its parts:
 *     d:h012.t033.a005.l010
 * and whose `pose` holds five angles in degrees: [head, left arm, right arm, left leg, right leg]
 * ("left" is the left side of the picture). 0 means hanging straight down (the head: upright). */
import { h } from './dom.js';

export const DOLLS = { heads: [], torsos: [], arms: [], legs: [] };
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
export function dollNode(asset, cls = '', pose) {
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
  poseDoll(el, pose);
  return el;
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
 * A big figure whose head, arms and legs are turned by dragging them, plus the ready-made poses.
 * onChange(pose) is called while dragging and after a preset.
 */
export function poseEditor(asset, pose, onChange) {
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
  return h(
    'div',
    { class: 'poser' },
    h('div', { class: 'poserstage' }, figure),
    h('small', { class: 'dim' }, 'Drag the head, an arm or a leg to turn it.'),
    h(
      'div',
      { class: 'chips wrap' },
      POSES.map(([name, angles]) => h('button', { 'data-pose': name, onclick: () => set([...angles]) }, name)),
    ),
  );
}
