/* The character maker: put a person together from a head, a torso, arms and legs, try a pose, keep them.
 * It is a tool of its own (a full-screen overlay) that anyone may open: the Director to cast a scene,
 * the Player to decide how their own hero looks.
 *
 *   openDollMaker({ asset, pose, title, actions: [{ label, primary, run(asset, pose) }] })
 *
 * "My cast" is kept in this browser, so favourite characters are there in every story. */
import { h, fill, toast } from '../core/dom.js';
import { DOLLS, dollNode, dollParts, dollAsset, randomDoll, poseEditor, REST } from '../core/dolls.js';
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
}
