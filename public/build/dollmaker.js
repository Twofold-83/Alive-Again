/* The character maker: put a person together from a head, a torso, arms and legs, try a pose, keep them.
 * It is a tool of its own (a full-screen overlay) that anyone may open: the Director to cast a scene,
 * the Player to decide how their own hero looks.
 *
 *   openDollMaker({ asset, pose, title, actions: [{ label, primary, run(asset, pose) }] })
 *
 * "My cast" is kept in this browser, so favourite characters are there in every story. */
import { h, fill, toast } from '../core/dom.js';
import { kept } from '../core/kept.js';
import { ENVIRONMENTS } from '../shared/environments.js';
import { DOLLS, dollNode, dollParts, dollAsset, randomDoll, poseEditor, REST, MAX_EXTRA, DOLL_W, dollDataUrl } from '../core/dolls.js';
import { openSpriteEditor } from './spriteed.js';
import { audio } from '../core/audio.js';

const TABS = [
  ['h', 'Head', 'heads'],
  ['t', 'Body', 'torsos'],
  ['a', 'Arms', 'arms'],
  ['l', 'Legs', 'legs'],
];
const M = { o: null, parts: null, pose: REST, tab: 'h', q: '', theme: '' }; // theme: only the parts made for one setting
const root = () => document.querySelector('#dollmaker');

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

const inThemeOf = (theme) => (p) => !theme || (theme === 'classic' ? !p.theme : p.theme === theme);
/** Undress the figure: bare chest, bare arms, bare legs in small white shorts — in the skin of the head it has. */
function bare() {
  const head = DOLLS.heads.find((p) => p.id === M.parts.h),
    skin = SKIN_WORDS.find((s) => head && new RegExp(`\\b${s}\\b`).test(head.name)) || 'pale';
  const find = (list, re) => (list.find((p) => re.test(p.name) && p.name.endsWith(skin)) || list.find((p) => re.test(p.name)) || {}).id;
  M.parts.t = find(DOLLS.torsos, /^bare skin chest/) || M.parts.t;
  M.parts.l = find(DOLLS.legs, /^bare skin legs white shorts/) || M.parts.l;
  M.parts.a = (DOLLS.arms.find((p) => p.name === `bare ${skin} hand`) || {}).id || M.parts.a;
  audio.sfx('pop');
  draw();
}
const SKIN_WORDS = ['pale', 'fair', 'tan', 'brown', 'ashen', 'rotten', 'drowned'];

function draw() {
  const asset = dollAsset(M.parts),
    [, , listName] = TABS.find((t) => t[0] === M.tab);
  const q = M.q.trim().toLowerCase(),
    inTheme = (p) => !M.theme || (M.theme === 'classic' ? !p.theme : p.theme === M.theme),
    list = DOLLS[listName].filter((p) => inTheme(p) && (!q || p.name.includes(q)));
  /* the settings that have parts of this kind, with how many */
  const counts = new Map();
  for (const p of DOLLS[listName]) counts.set(p.theme || 'classic', (counts.get(p.theme || 'classic') || 0) + 1);
  const themes = [['classic', 'Classic'], ['basic', 'Bare skin'], ...ENVIRONMENTS.map((e) => [e.id, e.name])].filter(([id]) => counts.has(id));
  const mine = kept.cast.all();
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
        h('img', { src: `doll/${p.id}.png`, alt: '', loading: 'lazy' }),
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
          title: M.theme ? 'Someone of the chosen setting' : 'Anyone at all',
          onclick: () => {
            M.parts = dollParts(randomDoll());
            /* with a setting chosen, the surprise is someone who belongs there */
            const one = (name) => {
              const l = DOLLS[name].filter(inThemeOf(M.theme));
              return l.length ? l[Math.floor(Math.random() * l.length)].id : null;
            };
            if (M.theme) for (const [k, , name] of TABS) M.parts[k] = one(name) || M.parts[k];
            else if (Math.random() < 0.25) M.parts.x = [{ id: M.parts.h, x: 8, y: -5, r: 16, f: true }];
            audio.sfx('dice');
            draw();
          },
        },
        'Surprise me',
      ),
      h('button', { id: 'dollBare', title: 'Undress: bare skin and small white shorts, in the skin of this head', onclick: bare }, 'Bare skin'),
      h('button', { id: 'dollClose', onclick: close }, 'Close'),
    ),
    h(
      'div',
      { class: 'benchbody dollbody' },
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
                openSpriteEditor({ from: { name: 'My character', urls: { '': src } } }); // the drawing lands under My objects
              },
            },
            'Draw on it',
          ),
          h(
            'button',
            {
              id: 'dollKeep',
              onclick: () => {
                kept.cast.add({ asset: dollAsset(M.parts), pose: [...M.pose] }, 'asset');
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
        { class: 'benchtools dolltools' },
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
        h(
          'select',
          {
            id: 'dollTheme',
            title: 'Parts made for one setting',
            'aria-label': 'Setting',
            onchange: (ev) => {
              M.theme = ev.target.value;
              draw();
            },
          },
          h('option', { value: '' }, `All settings (${DOLLS[listName].length})`),
          themes.map(([id, name]) => h('option', { value: id, selected: M.theme === id ? '' : null }, `${name} (${counts.get(id)})`)),
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
                        kept.cast.remove(c.asset, 'asset');
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
