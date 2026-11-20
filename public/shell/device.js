/* Phone or computer: chosen on the start screen (guessed the first time), changeable from the top bar.
 * Phone mode is a class on <body>; css/phone.css does the rest. */
import { renderChrome } from './chrome.js';
import { render } from '../story/view.js';
import { app } from '../core/state.js';

/* phone or computer: chosen on the start screen (guessed the first time), changeable any time from the top bar */
export function setDevice(d, keep) {
  const phone = d === 'phone';
  document.body.classList.toggle('phone', phone);
  if (keep) localStorage.setItem('tf.device', d);
  for (const b of document.querySelectorAll('#devicePick button')) b.classList.toggle('on', b.dataset.dev === d);
  app.uiKey = '';
  if (app.S) {
    renderChrome();
    if (!app.S.rpg) render();
  }
  window.dispatchEvent(new Event('resize'));
}
export function isPhone() {
  return document.body.classList.contains('phone');
}
for (const b of document.querySelectorAll('#devicePick button')) b.onclick = () => setDevice(b.dataset.dev, true);
setDevice(
  localStorage.getItem('tf.device') ||
    (matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820 ? 'phone' : 'computer'),
);
/* on a phone the keyboard takes half the screen: while typing in the tools, the stage steps aside */
document.addEventListener('focusin', (e) => {
  if (isPhone() && /^(INPUT|TEXTAREA)$/.test(e.target.tagName) && e.target.closest('#right, #rpgSide')) document.body.classList.add('typing');
});
document.addEventListener('focusout', () =>
  setTimeout(() => {
    if (!/^(INPUT|TEXTAREA)$/.test((document.activeElement || {}).tagName || '')) document.body.classList.remove('typing');
  }, 120),
);
