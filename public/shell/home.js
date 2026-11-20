/* The start screen: choose what to play, start or join a story, and come back here when leaving one. */
import { $ } from '../core/dom.js';
import { remember, known, app } from '../core/state.js';
import { connect, api } from '../core/net.js';
import { audio } from '../core/audio.js';
import { rpgStop } from '../dungeon/screen.js';
import { h } from '../core/dom.js';

const nameEl = $('#name'),
  codeEl = $('#joinCode'),
  errEl = $('#homeErr');
nameEl.value = localStorage.getItem('tf.name') || '';
function myName() {
  const n = nameEl.value.trim();
  localStorage.setItem('tf.name', n);
  return n;
}

function enter(c) {
  app.code = c;
  app.S = null;
  app.uiKey = '';
  remember(c);
  if (location.hash.slice(1).toUpperCase() !== c) history.replaceState(null, '', '#' + c);
  $('#home').hidden = true;
  $('#game').hidden = false;
  connect();
}
export function leave(msg) {
  if (app.es) app.es.close();
  if (app.cut) app.cut.skip();
  app.es = null;
  app.code = null;
  app.S = null;
  rpgStop();
  audio.setMood(HOME_MOOD);
  $('#homeSound').textContent = audio.icon;
  history.replaceState(null, '', location.pathname);
  $('#story').hidden = true;
  $('#game').hidden = true;
  $('#home').hidden = false;
  $('#invite').hidden = true;
  $('#newBtns').hidden = false;
  codeEl.value = '';
  errEl.textContent = msg || '';
}
const HOME_MOOD = 'm:spooky';
let storyType = 'free'; // chosen once, when the story is created
const HOME_LABELS = {
  // the start buttons speak the language of the chosen kind of story
  rpg: {
    newDirector: ['😈 Start as the Overlord', 'You build the castle and command its monsters'],
    newPlayer: ['🗡️ Start as the Hero', 'Sword in hand — your partner is the Overlord'],
    soloPlayer: ['🤖 Solo Hero', 'AI is the Overlord'],
    soloDirector: ['🤖 Solo Overlord', 'AI is the hero'],
    hotseat: ['🎭 Play both sides', 'Keyboard for the hero, mouse for the Overlord'],
  },
};
const homeDefault = Object.fromEntries([...document.querySelectorAll('#newBtns button')].map((b) => [b.id, b.innerHTML]));
for (const b of document.querySelectorAll('#typePick button'))
  b.onclick = () => {
    storyType = b.dataset.type;
    for (const o of document.querySelectorAll('#typePick button')) o.classList.toggle('on', o === b);
    for (const o of document.querySelectorAll('#newBtns button')) {
      const l = (HOME_LABELS[storyType] || {})[o.id];
      if (l) o.replaceChildren(l[0], h('small', {}, l[1]));
      else o.innerHTML = homeDefault[o.id];
    }
  };
async function create(role, mode) {
  errEl.textContent = '';
  try {
    enter((await api('/api/rooms', { token: app.token, name: myName(), role, mode, type: storyType })).code);
  } catch (e) {
    errEl.textContent = e.message;
  }
}
async function join(c, quiet) {
  c = (c || '').trim().toUpperCase();
  if (!/^[A-Z]{5}$/.test(c)) {
    errEl.textContent = 'Enter the 5-letter story code';
    return;
  }
  errEl.textContent = '';
  try {
    await api(`/api/rooms/${c}/join`, { token: app.token, name: myName() });
    enter(c);
  } catch (e) {
    errEl.textContent = e.status === 404 ? 'No story with that code' : e.message;
    if (quiet) leave(errEl.textContent);
  }
}
$('#newDirector').onclick = () => create('director', 'pair');
$('#newPlayer').onclick = () => create('player', 'pair');
$('#soloPlayer').onclick = () => create('player', 'bot');
$('#soloDirector').onclick = () => create('director', 'bot');
$('#hotseat').onclick = () => create('director', 'hotseat');
$('#joinBtn').onclick = () => join(codeEl.value);
codeEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') join(codeEl.value);
});

export function boot() {
  const c = location.hash.slice(1).toUpperCase();
  if (!/^[A-Z]{5}$/.test(c)) return;
  if (c === app.code) return;
  if (known().includes(c)) return void join(c, true); // returning to my own story: straight back in
  codeEl.value = c;
  $('#newBtns').hidden = true;
  const inv = $('#invite');
  inv.hidden = false;
  inv.textContent = `You've been invited to story ${c}. Enter your name and tap Join.`;
  $('#joinBtn').classList.add('primary');
}
window.addEventListener('hashchange', boot);
/* the start screen: spooky music, a pixel scene, the odd clap of thunder */
audio.setMood(HOME_MOOD);
$('#homeSound').textContent = audio.icon;
$('#homeSound').onclick = (e) => {
  e.currentTarget.textContent = audio.cycle();
};
