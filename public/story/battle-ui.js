/*
 * The battle's panels. For the Player: the health of everyone in the fight, a message window and the four
 * commands — and nothing else while the fight lasts. For the Director who watches: the same view, and a hand on
 * the fight: pause it, give someone a line, decide an enemy's next move, change how hard it is, step in, call it
 * off. Rules: shared/battle.js. What happens on the stage: stage/fight.js.
 *
 * While a round is being played the panels show the fight as it stands on the stage at that moment (app.fight:
 * the frame being animated and the line of the message window), not the outcome the server already knows.
 */
import { h, toast } from '../core/dom.js';
import { act } from '../core/net.js';
import { app } from '../core/state.js';
import { glyphNode } from '../stage/render.js';
import { BATTLE_LEVELS, FOE_MOVES, livingFoes, heroHealth, weaponOf, itemHeals } from '../shared/battle.js';
import { spriteTitle, assetLabel } from '../core/catalog.js';

const nameOf = (e) => e.name || spriteTitle(e.asset.startsWith('p:') ? e.asset : 'p:enemy');
const levelName = (b) => (BATTLE_LEVELS.find((l) => l[0] === b.level) || [0, ''])[1];
/** The fight as the stage shows it right now. */
const fightScene = () => (app.fight && app.fight.frame) || app.S.scene;
const playing = () => !!app.fight;

/* ---------- health: one bar each, kept in step with the stage ---------- */
const bar = (cls, name, hp, max, id) =>
  h(
    'div',
    { class: 'bar ' + cls, 'data-id': id || '' },
    h('b', {}, name),
    h('span', {}, `${hp} / ${max}`),
    h('i', { style: `width:${(hp / (max || 1)) * 100}%` }),
  );
function hud(sc) {
  const hp = heroHealth(sc),
    weapon = weaponOf(sc);
  return h(
    'div',
    { class: 'battlehud' },
    bar('hero', app.S.names.player + (weapon ? ' (armed)' : ''), hp.get(), hp.max, sc.heroId),
    livingFoes(sc).map((e) => bar('foe', nameOf(e), e.hp, e.maxHp, e.id)),
  );
}
/** A blow has landed on the stage: move the bars and the message, without redrawing the panels. */
export function syncBattle() {
  const sc = fightScene(),
    hp = heroHealth(sc);
  for (const el of document.querySelectorAll('.battlehud .bar')) {
    const id = el.dataset.id,
      e = sc.entities.find((x) => x.id === id),
      now = id === sc.heroId ? [hp.get(), hp.max] : e && e.hp != null ? [e.hp, e.maxHp] : null;
    if (!now) {
      el.classList.add('down'); // beaten, or gone
      el.querySelector('i').style.width = '0';
      continue;
    }
    el.querySelector('span').textContent = `${now[0]} / ${now[1]}`;
    el.querySelector('i').style.width = (now[0] / (now[1] || 1)) * 100 + '%';
    el.classList.toggle('low', now[0] <= now[1] * 0.3);
  }
  for (const el of document.querySelectorAll('.battlemsg')) el.textContent = (app.fight && app.fight.msg) || '…';
}

/* ---------- the Player ---------- */
/** Carry out a command of the Player's: the round is fought on the server and played on both screens. */
export function battleCmd(move, extra = {}) {
  const b = app.S.scene.battle;
  if (!b || b.paused || app.liveBusy || app.cut) return;
  app.liveBusy = true;
  app.battleMenu = '';
  clearTimeout(app.liveTimer);
  app.liveTimer = setTimeout(() => (app.liveBusy = false), 8000);
  act('battle', { turn: app.S.turn, move, ...extra }, 2).catch((e) => {
    app.liveBusy = false;
    toast(e.message);
  });
}
/** The Player's whole footer during a battle. rebuild() redraws it. */
export function battleBox(rebuild) {
  const sc = fightScene(),
    b = sc.battle || app.S.scene.battle,
    live = app.S.scene.battle, // null once the fight is decided: then only its last round is still playing
    foes = livingFoes(sc),
    menu = app.battleMenu || '',
    busy = playing() || app.liveBusy || !live;
  const cmd = (id, label, fn, on) => h('button', { 'data-cmd': id, class: on ? 'on' : '', onclick: fn }, label);
  const open = (id) => () => {
    app.battleMenu = menu === id ? '' : id;
    rebuild();
  };
  const message = playing()
    ? (app.fight && app.fight.msg) || '…'
    : live && live.paused
      ? `${app.S.names.director} has paused the battle…`
      : app.liveBusy
        ? '…'
        : menu === 'attack'
          ? 'Attack whom?'
          : menu === 'item'
            ? 'Use what?'
            : `What will ${app.S.names.player} do?`;
  return h(
    'div',
    { class: 'battlebox' + (busy ? ' busy' : ''), id: 'battleBox' },
    h('b', { class: 'actlab' }, `Battle — round ${b ? b.round : ''}${b ? ' · ' + levelName(b) : ''}`),
    h('div', { id: 'battleHud' }, hud(sc)),
    h('div', { class: 'battlemsg', id: 'battleMsg' }, message),
    !busy &&
      !(live && live.paused) &&
      h(
        'div',
        { class: 'battlecmds' },
        cmd('attack', 'Attack', foes.length === 1 ? () => battleCmd('attack', { id: foes[0].id }) : open('attack'), menu === 'attack'),
        cmd('defend', 'Defend', () => battleCmd('defend')),
        cmd('item', `Item (${sc.sheet.inv.length})`, open('item'), menu === 'item'),
        cmd('escape', `Escape (${live.flee}%)`, () => battleCmd('escape')),
      ),
    !busy &&
      menu === 'attack' &&
      h(
        'div',
        { class: 'battlepick' },
        foes.map((e) => h('button', { 'data-foe': e.id, onclick: () => battleCmd('attack', { id: e.id }) }, `${nameOf(e)}  ${e.hp}/${e.maxHp}`)),
      ),
    !busy &&
      menu === 'item' &&
      h(
        'div',
        { class: 'battlepick' },
        sc.sheet.inv.length
          ? sc.sheet.inv.map((it) =>
              h(
                'button',
                { onclick: () => battleCmd('item', { item: it.id, id: foes[0] && foes[0].id }) },
                glyphNode(app.code, it.asset, 'mini'),
                ` ${it.name || ''} — ${itemHeals(it) ? 'heals you' : 'throw it'}`,
              ),
            )
          : h('small', { class: 'dim' }, 'You carry nothing.'),
      ),
  );
}

/* ---------- the Director ---------- */
const direct = (op, extra = {}) => act('battleDirect', { op, ...extra }, 2).catch((e) => toast(e.message));
/** For the Director who watches: the fight as it stands, and a hand on it. */
export function watchCard() {
  const sc = fightScene(),
    live = app.S.scene.battle,
    b = sc.battle || live;
  if (!b) return null;
  if (app.S.hotseat && !live)
    return h('div', { class: 'card', id: 'liveCard' }, h('h3', {}, 'The battle is decided'), h('p', { class: 'dim' }, 'Watch the last round…'));
  const both = !!app.S.hotseat, // one person plays both sides: the Player's panel already shows the fight
    foes = live ? livingFoes(app.S.scene) : [],
    who = h(
      'select',
      { id: 'liveSayWho', title: 'Who speaks' },
      app.S.scene.entities
        .filter((e) => !e.tie)
        .map((e) => h('option', { value: e.id }, e.id === app.S.scene.heroId ? app.S.names.player : e.name || assetLabel(e.asset))),
    ),
    line = h('input', { id: 'liveSayText', class: 'grow', maxlength: 160, placeholder: 'A line, spoken at once…', enterkeyhint: 'send' });
  const speak = () => {
    const text = line.value.trim();
    if (!text) return;
    direct('say', { id: who.value, text });
    line.value = '';
  };
  line.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') speak();
  });
  return h(
    'div',
    { class: 'card battlecard', id: 'liveCard' },
    h('h3', {}, both ? 'The Director’s hand' : `Battle — round ${b.round} · ${levelName(b)}`),
    !both && hud(sc),
    !both &&
      h(
        'div',
        { class: 'battlemsg' },
        playing()
          ? (app.fight && app.fight.msg) || '…'
          : live && live.paused
            ? 'Paused. The fight waits for you.'
            : `${app.S.names.player} is choosing…`,
      ),
    live &&
      h(
        'div',
        { class: 'col livetools' },
        h(
          'button',
          { id: 'livePause', class: live.paused ? 'primary' : '', onclick: () => direct(live.paused ? 'resume' : 'pause') },
          live.paused ? '▶ Go on with the battle' : '⏸ Pause the battle',
        ),
        h(
          'small',
          { class: 'dim' },
          live.paused
            ? `${app.S.names.player} cannot act until you let the battle go on.`
            : 'It pauses before the next command. Lines and plans work either way.',
        ),
        h('b', { class: 'actlab' }, 'Someone speaks'),
        h('div', { class: 'row' }, who, line, h('button', { id: 'liveSay', onclick: speak }, 'Say')),
        foes.length > 0 && h('b', { class: 'actlab' }, 'Next move of the enemies'),
        foes.map((e) =>
          h(
            'div',
            { class: 'row liveplan' },
            h('span', { class: 'grow' }, nameOf(e)),
            h(
              'select',
              { 'data-foe': e.id, title: 'What it does in the coming round', onchange: (ev) => direct('plan', { id: e.id, move: ev.target.value }) },
              FOE_MOVES.map(([id, label]) => h('option', { value: id, selected: ((live.plan || {})[e.id] || '') === id ? '' : null }, label)),
            ),
          ),
        ),
        h(
          'div',
          { class: 'row' },
          h('span', { class: 'dim small' }, 'How hard'),
          h(
            'select',
            { id: 'liveLevel', class: 'grow', onchange: (ev) => direct('level', { level: ev.target.value }) },
            BATTLE_LEVELS.map(([id, label]) => h('option', { value: id, selected: live.level === id ? '' : null }, label)),
          ),
        ),
        h(
          'div',
          { class: 'row' },
          h(
            'button',
            {
              id: 'liveStep',
              class: 'grow',
              title: 'The turn comes to you with every tool; ending it gives the fight back',
              onclick: () => act('battlePause', {}, 2).catch((e) => toast(e.message)),
            },
            'Step in with all tools',
          ),
          h(
            'button',
            {
              id: 'liveOff',
              class: 'danger',
              onclick: () => {
                if (confirm('Call the battle off? Nobody wins; the turn comes to you.')) direct('stop');
              },
            },
            'Call it off',
          ),
        ),
      ),
    b.log.length > 0 &&
      !both &&
      h(
        'div',
        { class: 'battlelog' },
        (live || b).log.slice(-6).map((l) => h('p', {}, l)),
      ),
  );
}
