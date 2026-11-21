/* The character maker: put a person together from a head, a torso, arms and legs, try a pose, keep them.
 * It is a tool of its own (a full-screen overlay) that anyone may open: the Director to cast a scene,
 * the Player to decide how their own hero looks.
 *
 *   openDollMaker({ asset, pose, title, actions: [{ label, primary, run(asset, pose) }] })
 *
 * "My cast" is kept in this browser, so favourite characters are there in every story. */
import { h, fill, toast } from '../core/dom.js';
import { DOLLS, dollNode, dollParts, dollAsset, randomDoll, poseEditor, REST, MAX_EXTRA, DOLL_W, dollDataUrl } from '../core/dolls.js';
import { openSpriteEditor } from './spriteed.js';
import { audio } from '../core/audio.js';

const TABS = [
  ['h', 'Head', 'heads'],
  ['t', 'Body', 'torsos'],
  ['a', 'Arms', 'arms'],
  ['l', 'Legs', 'legs'],
];
const M = { o: null, parts: null, pose: REST, tab: 'h', q: '' };
const root = () => document.querySelector('#dollmaker');
const cast = () => {
  try {
    return JSON.parse(localStorage.getItem('tf.cast') || '[]');
  } catch {
    return [];
  }
};
const saveCast = (list) => localStorage.setItem('tf.cast', JSON.stringify(list.slice(0, 60)));
export const dollMakerOpen = () => !root().hidden;

export function openDollMaker(o) {
  M.o = o;
  M.parts = dollParts(o.asset || randomDoll());
  M.pose = Array.isArray(o.pose) && o.pose.length === 5 ? [...o.pose] : [...REST];
  M.tab = 'h';
  M.q = '';
  root().hidden = false;
  draw();
}
function close() {
  root().hidden = true;
  root().replaceChildren();
}

/* ---------- mutations: more heads, arms and legs, put anywhere on the figure ---------- */
function mutations() {
  const xs = M.parts.x || (M.parts.x = []);
  const addX = (kind, x, y, r) => {
    if (xs.length >= MAX_EXTRA) return toast(`${MAX_EXTRA} mutations is the most one body can take`);
    xs.push({ id: M.parts[kind], x: x + xs.length * 2, y, r, f: xs.length % 2 === 1 });
    audio.sfx('pop');
    draw();
  };
  const btn = (label, title, fn) =>
    h(
      'button',
      {
        title,
        onclick: () => {
          fn();
          draw();
        },
      },
      label,
    );
  return h(
    'div',
    { class: 'card mutcard', id: 'mutations' },
    h('h3', {}, 'Mutations'),
    h('small', { class: 'dim' }, 'Grow more heads, arms and legs (they use the part chosen on the right). Drag one on the figure to move it.'),
    h(
      'div',
      { class: 'row' },
      h('button', { id: 'mutHead', class: 'grow', onclick: () => addX('h', 8, -6, 14) }, '+ Head'),
      h('button', { id: 'mutArm', class: 'grow', onclick: () => addX('a', 12, 15, -50) }, '+ Arm'),
      h('button', { id: 'mutLeg', class: 'grow', onclick: () => addX('l', 10, 21, -30) }, '+ Leg'),
    ),
    xs.map((e, i) =>
      h(
        'div',
        { class: 'row mutrow' },
        h('img', { src: `doll/${e.id}.png`, alt: '' }),
        h('span', { class: 'grow dim small' }, { h: 'Head', a: 'Arm', l: 'Leg' }[e.id[0]]),
        btn('⟲', 'Turn left', () => (e.r = ((e.r - 30 + 540) % 360) - 180)),
        btn('⟳', 'Turn right', () => (e.r = ((e.r + 30 + 540) % 360) - 180)),
        btn('↔', 'Mirror', () => (e.f = !e.f)),
        btn('✕', 'Remove', () => xs.splice(i, 1)),
      ),
    ),
  );
}
/** Dragging a mutation on the big figure moves it. */
function dragMutations() {
  const fig = root().querySelector('.poserstage .doll');
  if (!fig) return;
  let cur = null;
  fig.addEventListener('pointerdown', (ev) => {
    const part = ev.target.closest('.dpart.x');
    if (!part) return;
    ev.preventDefault();
    const e = M.parts.x[+part.dataset.x],
      dp = fig.getBoundingClientRect().width / DOLL_W;
    cur = { e, part, dp, sx: ev.clientX, sy: ev.clientY, x: e.x, y: e.y };
    fig.setPointerCapture(ev.pointerId);
  });
  fig.addEventListener('pointermove', (ev) => {
    if (!cur) return;
    cur.e.x = Math.max(-20, Math.min(30, Math.round(cur.x + (ev.clientX - cur.sx) / cur.dp)));
    cur.e.y = Math.max(-20, Math.min(40, Math.round(cur.y + (ev.clientY - cur.sy) / cur.dp)));
    cur.part.style.left = `calc(var(--dp) * ${cur.e.x})`;
    cur.part.style.top = `calc(var(--dp) * ${cur.e.y})`;
  });
  fig.addEventListener('pointerup', () => (cur = null));
}

function draw() {
  const asset = dollAsset(M.parts),
    [, , listName] = TABS.find((t) => t[0] === M.tab);
  const q = M.q.trim().toLowerCase(),
    list = DOLLS[listName].filter((p) => !q || p.name.includes(q));
  const mine = cast();
  const grid = h(
    'div',
    { class: 'dollgrid k-' + M.tab },
    list.map((p) =>
      h(
        'button',
        {
          'data-part': p.id,
          class: M.parts[M.tab] === p.id ? 'on' : '',
          title: p.name,
          'aria-label': p.name,
          onclick: () => {
            M.parts[M.tab] = p.id;
            audio.sfx('pop');
            draw();
          },
        },
        h('img', { src: `doll/${p.id}.png`, alt: '' }),
      ),
    ),
    !list.length && h('p', { class: 'dim' }, DOLLS.heads.length ? 'Nothing by that name.' : 'The body parts are missing (run tools/make-dolls.js).'),
  );
  const keepScroll = (root().querySelector('.dollgrid') || {}).scrollTop || 0;
  fill(
    root(),
    h(
      'header',
      {},
      h('b', {}, M.o.title || 'Character maker'),
      h('span', { class: 'dim small' }, 'Pick the parts, drag the limbs, keep who you like.'),
      h('span', { class: 'grow' }),
      h(
        'button',
        {
          id: 'dollRandom',
          onclick: () => {
            M.parts = dollParts(randomDoll());
            if (Math.random() < 0.25) M.parts.x = [{ id: M.parts.h, x: 8, y: -5, r: 16, f: true }];
            audio.sfx('dice');
            draw();
          },
        },
        'Surprise me',
      ),
      h('button', { id: 'dollClose', onclick: close }, 'Close'),
    ),
    h(
      'div',
      { class: 'wsbody dollbody' },
      h(
        'div',
        { class: 'dollleft' },
        poseEditor(asset, M.pose, (pose) => {
          M.pose = pose;
        }),
        mutations(),
        h(
          'div',
          { class: 'dollacts' },
          (M.o.actions || []).map((a, i) =>
            h(
              'button',
              {
                id: 'dollAct' + i,
                class: a.primary ? 'primary' : '',
                onclick: () => {
                  a.run(dollAsset(M.parts), [...M.pose]);
                  close();
                },
              },
              a.label,
            ),
          ),
          h(
            'button',
            {
              id: 'dollEdit',
              title: 'Open this figure in the sprite editor: it becomes a fixed picture you can draw on',
              onclick: async () => {
                const src = await dollDataUrl(dollAsset(M.parts));
                openSpriteEditor({ src, name: 'My character' }); // the drawing lands under My drawings
              },
            },
            'Draw on it',
          ),
          h(
            'button',
            {
              id: 'dollKeep',
              onclick: () => {
                saveCast([{ asset: dollAsset(M.parts), pose: [...M.pose] }, ...mine.filter((c) => c.asset !== dollAsset(M.parts))]);
                toast('Kept in your cast');
                draw();
              },
            },
            'Keep in my cast',
          ),
        ),
      ),
      h(
        'aside',
        { class: 'wstools dolltools' },
        h(
          'div',
          { class: 'tabs' },
          TABS.map(([id, label, name]) =>
            h(
              'button',
              {
                'data-dtab': id,
                class: M.tab === id ? 'on' : '',
                onclick: () => {
                  M.tab = id;
                  M.q = '';
                  draw();
                },
              },
              h('img', { src: `doll/${M.parts[id]}.png`, alt: '' }),
              h('small', {}, `${label} (${DOLLS[name].length})`),
            ),
          ),
        ),
        h('input', {
          type: 'search',
          id: 'dollSearch',
          placeholder: 'Search: skull, hood, striped, pale…',
          value: M.q,
          oninput: (ev) => {
            M.q = ev.target.value;
            draw();
            const i = root().querySelector('#dollSearch');
            i.focus();
            i.setSelectionRange(i.value.length, i.value.length);
          },
        }),
        grid,
        mine.length > 0 &&
          h(
            'div',
            { class: 'card' },
            h('h3', {}, `My cast (${mine.length})`),
            h(
              'div',
              { class: 'castrow' },
              mine.map((c) =>
                h(
                  'span',
                  { class: 'castitem' },
                  h(
                    'button',
                    {
                      title: 'Use this character',
                      onclick: () => {
                        M.parts = dollParts(c.asset);
                        M.pose = [...(c.pose || REST)];
                        draw();
                      },
                    },
                    dollNode(c.asset, '', c.pose),
                  ),
                  h(
                    'button',
                    {
                      class: 'link',
                      title: 'Remove from my cast',
                      onclick: () => {
                        saveCast(mine.filter((x) => x !== c));
                        draw();
                      },
                    },
                    'x',
                  ),
                ),
              ),
            ),
          ),
      ),
    ),
  );
  root().querySelector('.dollgrid').scrollTop = keepScroll;
  dragMutations();
}
