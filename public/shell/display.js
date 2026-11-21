/* Screen filters: how the picture is shown on this device. A matter of taste, so everyone picks their own;
 * it is remembered in this browser and changes nothing for the other person. The looks themselves are CSS
 * (css/game.css, "screen filters"): a class on <body>. */
import { h, $ } from '../core/dom.js';

export const FILTERS = [
  ['crt', 'Old monitor', 'Scan lines, edges in shadow'],
  ['clean', 'Clean', 'No scan lines, full colour'],
  ['green', 'Green screen', 'One colour, like a 1980s terminal'],
  ['amber', 'Amber screen', 'One colour, warm'],
  ['noir', 'Black and white', 'Hard contrast, no colour'],
  ['photo', 'Old photograph', 'Sepia, soft, worn at the edges'],
  ['moon', 'Moonlight', 'Cold and blue, as if at night'],
  ['fever', 'Fever', 'Red and sickly'],
  ['vhs', 'Worn tape', 'Bleeding colour and a rolling band'],
];
export function currentFilter() {
  const id = localStorage.getItem('tf.look');
  return FILTERS.some((f) => f[0] === id) ? id : 'crt';
}
export function setFilter(id) {
  for (const [f] of FILTERS) document.body.classList.toggle('look-' + f, f === id);
  localStorage.setItem('tf.look', id);
  const pick = $('#lookPick');
  if (pick) pick.value = id;
}
/** The little menu under the FX button in the top bar. */
export function toggleFilterMenu(anchor) {
  const old = $('#lookMenu');
  if (old) return void old.remove();
  const r = anchor.getBoundingClientRect();
  const menu = h(
    'div',
    { id: 'lookMenu', style: `top:${Math.round(r.bottom + 4)}px;right:${Math.max(4, Math.round(innerWidth - r.right))}px` },
    h('b', {}, 'Screen filter'),
    FILTERS.map(([id, name, hint]) =>
      h(
        'button',
        {
          'data-look': id,
          class: currentFilter() === id ? 'on' : '',
          onclick: () => {
            setFilter(id);
            menu.remove();
          },
        },
        name,
        h('small', {}, hint),
      ),
    ),
  );
  document.body.append(menu);
  setTimeout(
    () =>
      document.addEventListener('pointerdown', function away(ev) {
        if (!menu.contains(ev.target)) {
          menu.remove();
          document.removeEventListener('pointerdown', away);
        }
      }),
    0,
  );
}
/** The same choice on the start screen. */
export function initDisplay() {
  const pick = $('#lookPick');
  if (pick) {
    pick.replaceChildren(...FILTERS.map(([id, name]) => h('option', { value: id }, 'Screen: ' + name)));
    pick.onchange = () => setFilter(pick.value);
  }
  setFilter(currentFilter());
}
