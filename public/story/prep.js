/* The Director's shelf: a strip under the stage, seen only by the Director. It holds the cast (characters kept in
 * the character maker) and whatever the Director has put aside for later — one press puts a thing on the stage.
 * Both are kept on this device (see core/kept.js). */
import { h, toast, clone } from '../core/dom.js';
import { kept } from '../core/kept.js';
import { app } from '../core/state.js';
import { glyphNode } from '../stage/render.js';
import { isDoll, dollNode } from '../core/dolls.js';
import { guidedCtx } from './director.js';
import { rebuild } from './turn.js';
import { spriteTitle, OWN } from '../core/catalog.js';
import { useOwn } from '../build/spriteed.js';

/** What the shelf remembers of a thing, so that it comes back the way it was prepared. */
const PREPARED = ['name', 'pose', 'feel', 'scale', 'flip', 'solid', 'active', 'near', 'view', 'used', 'glow', 'base', 'hp', 'maxHp'];

async function put(item) {
  let asset = item.asset;
  try {
    if (asset.startsWith('own:')) {
      const o = OWN.get(asset.slice(4));
      if (!o) return toast('That drawing is no longer on this device');
      asset = 'c:' + (await useOwn(o));
    }
  } catch (e) {
    return toast(e.message);
  }
  const e = guidedCtx.addEntity(asset);
  if (!e) return;
  for (const k of PREPARED) if (item[k] != null) e[k] = clone(item[k]);
  if (item.name && item.active === undefined) e.active = { verbs: ['Look at', 'Use', 'Take'], re: {} }; // kept by an older version: a named thing was a clickable one
  window.__lastAdded = e.id;
  rebuild();
}
/** Put what is selected on the stage onto the shelf. */
function prepare() {
  const e = app.draft && app.draft.entities.find((x) => x.id === app.selId);
  if (!e) return toast('Press something on the stage first, then “Keep for later”');
  let asset = e.asset;
  if (asset.startsWith('c:')) {
    const o = [...OWN.values()].find((x) => x.in && x.in[app.code] === asset.slice(2));
    if (!o) return toast('Only library things, characters and your own drawings can be kept for later');
    asset = 'own:' + o.id;
  }
  kept.shelf.add({ asset, ...Object.fromEntries(PREPARED.map((k) => [k, clone(e[k] ?? null)])) }, 'asset');
  toast('Kept on your shelf');
  renderPrep(true);
}
export function renderPrep(show) {
  const el = document.querySelector('#prep');
  if (!el) return;
  el.hidden = !show;
  if (!show) return;
  const cast = kept.cast.all(),
    prep = kept.shelf.all();
  const sig = JSON.stringify([cast, prep]);
  if (el._sig === sig) return;
  el._sig = sig;
  const tile = (item, mine) =>
    h(
      'span',
      { class: 'preptile' },
      h(
        'button',
        {
          class: 'pick',
          title: (item.name || (isDoll(item.asset) ? 'A character of your cast' : spriteTitle(item.asset))) + ' — put on the stage',
          onclick: () => put(item),
        },
        isDoll(item.asset) ? dollNode(item.asset, '', item.pose) : glyphNode(app.code, item.asset),
      ),
      mine &&
        h(
          'button',
          {
            class: 'x',
            title: 'Take off the shelf',
            onclick: () => {
              kept.shelf.remove(item.asset, 'asset');
              renderPrep(true);
            },
          },
          '✕',
        ),
    );
  el.replaceChildren(
    h('b', {}, 'Shelf'),
    h('button', { id: 'prepAdd', title: 'Keep what is selected on the stage for later', onclick: prepare }, '+ Keep for later'),
    ...(cast.length ? [h('small', { class: 'dim' }, 'Cast')] : []),
    ...cast.map((c) => tile(c, false)),
    ...(prep.length ? [h('small', { class: 'dim' }, 'Prepared')] : []),
    ...prep.map((x) => tile(x, true)),
    ...(!cast.length && !prep.length
      ? [h('small', { class: 'dim' }, 'Characters you keep in the character maker and things you keep for later wait here — only you see this.')]
      : []),
  );
}
