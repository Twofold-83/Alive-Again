import { audio } from './core/audio.js';
import { $, toast } from './core/dom.js';
import { rpgInit } from './dungeon/screen.js';
import { act } from './core/net.js';
import { startTitle } from './shell/title.js';
import { loadPack, loadPixel } from './core/catalog.js';
import { boot } from './shell/home.js';
import { app } from './core/state.js';

document.addEventListener('pointerdown', () => { audio.unlock(); $('#musicHint').hidden = true; }, { capture: true });
document.addEventListener('keydown', () => audio.unlock(), { capture: true });
/* a soft click on every button, so the whole interface feels alive */
document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('button, .ent.hot, select')) audio.sfx('ui'); }, { capture: true });
rpgInit({ act, toast, audio });
startTitle($('#titleArt'), () => { if (!app.code) audio.sfx('thunder'); });
Promise.all([loadPack(), loadPixel()]).then(boot);
