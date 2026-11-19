import { audio } from '../core/audio.js';
import { h, clamp } from '../core/dom.js';
import { glyphNode } from '../stage/render.js';
import { workshopOpen } from '../build/workshop.js';
import { guidedKey, guidedTool, buildGuided } from './guided.js';
import { $, rid, toast } from '../core/dom.js';
import { myTurn, shown, directing, stage, heroTurn, mods, app } from '../core/state.js';
import { paint, changed, changedQuiet, saveDraft } from './turn.js';
import { renderChrome, tick } from '../shell/chrome.js';
import { buildFoot } from './player.js';
import { act } from '../core/net.js';
import { guidedCtx, showWorkshop } from './director.js';

/* ---------- story types: a type is just a preset of layers (modules) ---------- */
const MODULES = [
  { id: 'inventory', label: '🎒 Inventory', hint: 'The Player can carry things. You decide what they get.' },
  { id: 'stats', label: '❤️ Stats', hint: 'Health, gold or anything else you want to keep count of.' },
  { id: 'dice', label: '🎲 Dice', hint: 'Either of you can roll a die with a turn.' },
  { id: 'points', label: '⭐ Points', hint: 'You award points for whatever you like.' },
];
const TYPES = [
  { id: 'free', label: '🎭 Free play', hint: 'Just the stage and your imagination.', modules: {} },
  { id: 'adventure', label: '🗺️ Adventure', hint: 'Inventory, stats and dice; levels, maps, active objects and battles.', modules: { inventory: true, stats: true, dice: true } },
];

/* ---------- main render ---------- */
export function render() {
  if (!app.S) return;
  $('#right').classList.toggle('pl', app.S.you === 'player' && !app.S.ended);     // phones: the Player's controls come first
  const ts = $('#titleScreen'), showTitle = app.S.turn === 0 && !(myTurn() && app.S.you === 'director') && !!(app.S.info.title || app.S.info.text);
  ts.hidden = !showTitle;
  if (showTitle) ts.replaceChildren(h('h2', {}, app.S.info.title || 'A new story'), app.S.info.text && h('p', {}, app.S.info.text), h('small', {}, `${app.S.names.director} is setting the stage…`));
  const tool = directing() ? guidedTool() : '';          // the stage tool always follows the open Director screen
  app.rec = tool === 'rec'; app.drawOn = tool === 'draw';
  const scene = shown();
  paint();
  stage.classList.toggle('edit', myTurn() && !app.cut);
  stage.classList.toggle('drawing', directing() && app.drawOn);
  stage.classList.toggle('walking', heroTurn() && app.walkMode);
  audio.setMood(scene.mood);
  renderChrome();
  renderSheet();
  const key = [app.S.you, app.S.turn, app.S.whose, app.S.ended, app.S.joined.player, app.S.joined.director, app.submitting, app.selId, app.selInv, app.S.assets.length, app.S.settings.turnSeconds,
    JSON.stringify(app.S.rules), app.rec, app.drawOn, app.walkMode, myTurn() && app.draft.walked, !!app.cut, myTurn() && app.draft.target, myTurn() && JSON.stringify(app.draft.point), app.pointMode, myTurn() && app.draft.use, myTurn() && JSON.stringify([app.draft.reply, app.draft.act, app.draft.exit]), myTurn() && app.draft.steps.length, guidedKey()].join('|');
  if (workshopOpen()) return;                              // the workshop has the tools while it is open
  if (key !== app.uiKey) { app.uiKey = key; buildPanel(); buildFoot(); } else refreshMarks();
  tick();
}
function refreshMarks() {
  for (const b of document.querySelectorAll('[data-mark]')) {
    const i = b.dataset.mark.indexOf('=');
    b.classList.toggle('on', String(app.draft[b.dataset.mark.slice(0, i)] ?? '') === b.dataset.mark.slice(i + 1));
  }
}

/* ---------- character sheet bar: stats + inventory ---------- */
export function renderSheet() {
  const el = $('#sheet'), sc = shown(), m = mods(), edit = directing(), play = myTurn() && app.S.you === 'player' && !app.submitting;
  const kids = [];
  if (m.stats) {
    for (const st of sc.sheet.stats) {
      const bump = (d) => () => { st.value = clamp(st.value + d, -9999, st.max ?? 9999); changedQuiet(); };
      kids.push(h('span', { class: 'chip stat' },
        edit && h('button', { onclick: bump(-1), 'aria-label': 'Less' }, '−'),
        h('b', {}, st.name), ` ${st.value}${st.max != null ? '/' + st.max : ''}`,
        edit && h('button', { onclick: bump(1), 'aria-label': 'More' }, '+'),
        edit && h('button', { class: 'x', title: 'Remove', onclick: () => { sc.sheet.stats = sc.sheet.stats.filter((x) => x !== st); changedQuiet(); } }, '✕')));
    }
    if (edit && sc.sheet.stats.length < 8) kids.push(h('button', { class: 'chip add', onclick: () => {
      const name = (prompt('Name of the stat (an emoji in front looks nice), e.g. “🛡️ Armor”') || '').trim().slice(0, 20);
      if (!name) return;
      const max = parseInt(prompt('Maximum value? Leave empty for no maximum.') || '', 10);
      sc.sheet.stats.push({ id: rid(), name, value: Number.isFinite(max) ? max : 0, max: Number.isFinite(max) ? max : null });
      changedQuiet();
    } }, '+ stat'));
  }
  if (m.points) kids.push(h('span', { class: 'chip stat', id: 'points' }, h('b', {}, '⭐ Points'), ` ${sc.sheet.points || 0}`));
  if (m.inventory) {
    kids.push(h('span', { class: 'chip label' }, '🎒'));
    for (const it of sc.sheet.inv) {
      kids.push(h('button', {
        class: 'chip item' + (sc.use === it.id || (edit && app.selInv === it.id) ? ' on' : ''), title: it.name || 'item',
        disabled: !(edit || play),
        onclick: () => { if (edit) { app.selInv = app.selInv === it.id ? null : it.id; app.selId = null; render(); } else { app.draft.use = app.draft.use === it.id ? null : it.id; changed(); } },
      }, glyphNode(app.code, it.asset)));
    }
    if (!sc.sheet.inv.length) kids.push(h('span', { class: 'dim small' }, edit ? 'empty — select something on stage and tap “Give”' : 'empty'));
  }
  el.hidden = !kids.length;
  el.replaceChildren(...kids.filter(Boolean));
}
export function setRules(patch) {
  const rules = { ...app.S.rules, ...patch };
  if (rules.modules.stats && !app.draft.sheet.stats.length) app.draft.sheet.stats = [{ id: rid(), name: '❤️ Health', value: 5, max: 5 }, { id: rid(), name: '💰 Gold', value: 0, max: null }];
  app.S.rules = rules; saveDraft(); render();
  act('settings', { rules }, 3).catch((e) => toast(e.message));
}

/* ---------- panel ---------- */
function recap(scene) {
  const lines = [];
  if (scene.narration) lines.push(h('div', {}, h('i', {}, scene.narration)));
  for (const e of scene.entities) if (e.say) lines.push(h('div', {}, glyphNode(app.code, e.asset, 'mini'), ' “' + e.say + '”'));
  return lines.length ? h('div', { class: 'card recap' }, lines) : null;
}
const PLAYER_MODES = [
  { id: 'free', label: '🕹️ Free will', hint: 'The Player walks their hero (once per turn), speaks, and types what they do.' },
  { id: 'limited', label: '🎯 Limited will', hint: 'The Player must pick one of the options you offer each turn. They can still walk and speak.' },
  { id: 'tell', label: '📝 Narration', hint: 'The Player only writes what they want to do. Nothing moves until you stage it.' },
];
export function typeCard() {
  const r = app.S.rules;
  return h('div', { class: 'card' }, h('h3', {}, 'Story type'),
    h('p', {}, h('b', {}, TYPES.find((t) => t.id === r.type).label), h('span', { class: 'dim small' }, '  — chosen when the story was created')),
    h('p', { class: 'dim small' }, 'Layers can be switched on and off at any time:'),
    h('div', { class: 'chips wrap' }, MODULES.map((m) => h('button', { class: r.modules[m.id] ? 'on' : '', title: m.hint, onclick: () => setRules({ modules: { ...r.modules, [m.id]: !r.modules[m.id] } }) }, m.label))),
    h('h3', {}, `How ${app.S.names.player} plays`),
    h('div', { class: 'chips wrap' }, PLAYER_MODES.map((m) => h('button', { 'data-pmode': m.id, class: r.player === m.id ? 'on' : '', title: m.hint, onclick: () => setRules({ player: m.id }) }, m.label))),
    h('p', { class: 'dim small' }, PLAYER_MODES.find((m) => m.id === r.player).hint));
}

function buildPanel() {
  const p = $('#panel'); p.replaceChildren();
  if (app.S.ended) return void p.append(h('div', { class: 'card' }, h('h3', {}, 'The story has ended'), h('p', { class: 'dim' }, 'Flip through it together, or start a new one.')), recap(app.S.scene) || '');
  if (!myTurn() || app.S.you !== 'director') {
    const tips = app.S.you === 'spectator' ? null
      : myTurn() ? ['Your turn', app.S.rules.player === 'tell' ? `Write what you want to do. ${app.S.names.director} will make it happen on the stage, and you will see it play out.`
        : app.S.rules.player === 'limited' ? `Choose one of ${app.S.names.director}’s options. You can also walk once and add a line of speech.`
          : `Press “Walk” and click where your hero should go (once per turn).${mods().inventory ? ' Click a thing to reach for it, or a 🎒 item to use it.' : ''} Then say something, do something — or both — and end your turn.`]
        : app.S.you === 'player' ? [app.S.turn === 0 ? `${app.S.names.director} is setting the stage…` : `${app.S.names.director} is deciding what happens…`, 'The whole world is in their hands. Watch the stage.']
          : [`${app.S.names.player} is making a move…`, 'When they finish you can change anything: the cast, the place, the music, what everybody says.'];
    if (app.S.info.text && app.S.you !== 'director') p.append(h('div', { class: 'card', id: 'howto' }, h('h3', {}, '📜 ' + (app.S.info.title || 'How to play')), h('p', { class: 'pre' }, app.S.info.text)));
    if (tips) p.append(h('div', { class: 'card' }, h('h3', {}, tips[0]), h('p', { class: 'dim' }, tips[1])));
    if (app.S.you === 'director') p.append(h('div', { class: 'row' }, h('button', { id: 'wsOpen', class: 'grow', onclick: () => showWorkshop() }, '🏗️ Build scene — while you wait'), h('button', { class: 'grow', onclick: () => showWorkshop({ map: true }) }, '🗺️ Map')));
    const r = recap(app.S.scene); if (r) p.append(r);
    return;
  }

  buildGuided(p, guidedCtx);
}
