/* Pickers shared by the Director's menu and the full-screen builder: rooms by environment. */
import { h } from '../../core/dom.js';
import { ENVIRONMENTS } from '../../shared/environments.js';
import { ROOM_THEMES } from '../../shared/rooms.js';

/** The environment a room theme belongs to first. */
export function envOfTheme(themeId) {
  return (ENVIRONMENTS.find((e) => e.rooms.includes(themeId)) || ENVIRONMENTS[0]).id;
}
/**
 * Pick a room: first the setting, then one of its rooms from a short list with a small sample of wall and floor.
 *   o.env, o.theme    what is chosen now        o.onEnv(id), o.onPick(themeId)
 */
export function roomPicker(o) {
  const env = ENVIRONMENTS.find((e) => e.id === o.env) || ENVIRONMENTS[0],
    themes = env.rooms.map((id) => ROOM_THEMES.find((t) => t.id === id)).filter(Boolean);
  const sample = (slug) => h('img', { src: `px/${slug}.png`, alt: '' });
  return h(
    'div',
    { class: 'roompick' },
    h(
      'div',
      { class: 'chips wrap envchips' },
      ENVIRONMENTS.map((e) => h('button', { 'data-env': e.id, class: e === env ? 'on' : '', onclick: () => o.onEnv(e.id) }, e.name)),
    ),
    h(
      'div',
      { class: 'roomlist' },
      themes.map((t) =>
        h(
          'button',
          { 'data-room': t.id, class: o.theme === t.id ? 'on' : '', title: `Build: ${t.name}`, onclick: () => o.onPick(t.id) },
          h('span', { class: 'swatch' }, sample(t.wall), sample(t.deco[0] || t.wall), sample(t.floor)),
          h('span', { class: 'rname' }, t.name),
        ),
      ),
    ),
  );
}
