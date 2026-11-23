/* The skill check: when the Director asks for a roll, the Player's turn opens on a card that says what the roll
 * is for and what is needed, and offers to roll or to back out. The die is a real little die: it tumbles across
 * the card, lands, and the card says how it went. */
import { h } from '../core/dom.js';
import { act } from '../core/net.js';
import { audio } from '../core/audio.js';
import { app } from '../core/state.js';

const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
/** A die showing `value`: pips for a d6, the number on a twenty-sider. */
export function dieFace(sides, value) {
  if (sides === 6)
    return h(
      'div',
      { class: 'die d6' },
      Array.from({ length: 9 }, (_, i) => h('i', { class: PIPS[value].includes(i) ? 'pip' : '' })),
    );
  return h('div', { class: 'die d20' }, h('b', {}, String(value)));
}
function root() {
  let el = document.querySelector('#check');
  if (!el) document.body.append((el = h('div', { id: 'check', hidden: true })));
  return el;
}
export function closeCheck() {
  root().hidden = true;
  root().replaceChildren();
}
/**
 * Open the card for the roll the Director asked for. done(result) is called when the Player leaves the card:
 * { rolled: { sides, value } } after a roll, { backedOut: true } otherwise.
 */
export function openCheck(ask, done) {
  const el = root(),
    tray = h('div', { class: 'tray' }),
    verdict = h('p', { class: 'verdict' }),
    buttons = h('div', { class: 'row' });
  const leave = (result) => {
    closeCheck();
    done(result);
  };
  const roll = async () => {
    buttons.replaceChildren();
    let r;
    try {
      r = await act('roll', { turn: app.S.turn }, 3);
    } catch (e) {
      verdict.textContent = e.message;
      return buttons.replaceChildren(h('button', { onclick: () => leave({ backedOut: true }) }, 'Back'));
    }
    if (!r.rolled) return leave({ backedOut: true });
    audio.sfx('dice');
    /* tumble: the die shows other faces while it rolls across the tray, then lands on its number */
    let n = 0;
    const holder = h('div', { class: 'tumble' });
    tray.replaceChildren(holder);
    const spin = setInterval(() => {
      holder.replaceChildren(dieFace(r.rolled.sides, 1 + Math.floor(Math.random() * r.rolled.sides)));
      if (++n > 11) {
        clearInterval(spin);
        holder.replaceChildren(dieFace(r.rolled.sides, r.rolled.value));
        holder.className = 'tumble landed';
        const ok = !ask.dc || r.rolled.value >= ask.dc;
        verdict.textContent = !ask.dc ? `You rolled ${r.rolled.value}.` : ok ? `${r.rolled.value} — success!` : `${r.rolled.value} — not enough.`;
        verdict.className = 'verdict ' + (!ask.dc ? '' : ok ? 'good' : 'bad');
        if (ask.dc) audio.sfx(ok ? 'levelup' : 'fail');
        /* the result stands for three seconds, then the turn goes back to the Director */
        buttons.replaceChildren(h('small', { class: 'dim grow', id: 'checkDone' }, 'Back to the story…'));
        setTimeout(() => leave({ rolled: r.rolled }), 3000);
      }
    }, 85);
  };
  tray.append(dieFace(ask.sides, ask.sides === 6 ? 6 : 20));
  buttons.append(
    h('button', { class: 'primary grow', id: 'checkRoll', onclick: roll }, `Roll the d${ask.sides}`),
    h('button', { class: 'grow', id: 'checkBack', onclick: () => leave({ backedOut: true }) }, 'Back out'),
  );
  el.replaceChildren(
    h(
      'div',
      { class: 'checkcard' },
      h('small', { class: 'actlab' }, 'Skill check'),
      h('h2', {}, ask.text || 'Roll the die'),
      h('p', { class: 'need' }, ask.dc ? `You need ${ask.dc} or more on a d${ask.sides}.` : `Roll a d${ask.sides}.`),
      tray,
      verdict,
      buttons,
    ),
  );
  el.hidden = false;
}
