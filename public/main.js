/* Twofold in the browser. Every screen lives in its own module (see README, "How the code is laid out");
 * this file starts them and wires the few things that belong to no screen in particular. */
import { initDisplay } from './shell/display.js';
import { loadDolls } from './core/dolls.js';
import { audio } from './core/audio.js';
import { $ } from './core/dom.js';
import { rpgInit } from './dungeon/screen.js';
import { startTitle } from './shell/title.js';
import { loadPack, loadPixel, loadOwn } from './core/catalog.js';
import { boot } from './shell/home.js';
import { app } from './core/state.js';

document.addEventListener(
  'pointerdown',
  () => {
    audio.unlock();
    $('#musicHint').hidden = true;
  },
  { capture: true },
);
document.addEventListener('keydown', () => audio.unlock(), { capture: true });
/* a soft click on every button, so the whole interface feels alive */
document.addEventListener(
  'click',
  (e) => {
    if (e.target.closest && e.target.closest('button, .ent.hot, select')) audio.sfx('ui');
  },
  { capture: true },
);
rpgInit();
initDisplay();
startTitle($('#titleArt'), () => {
  if (!app.code) audio.sfx('thunder');
});
loadOwn();
Promise.all([loadPack(), loadPixel(), loadDolls()]).then(boot);
