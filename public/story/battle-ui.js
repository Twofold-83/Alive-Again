/* The battle on screen. For the Player: health bars, the four commands and the log — and nothing else while the
 * fight lasts. For the Director who watches: the log and a way to pause. Rules: shared/battle.js. */
import { h, toast } from '../core/dom.js';
import { act } from '../core/net.js';
import { app, hero } from '../core/state.js';
import { glyphNode } from '../stage/render.js';
import { BATTLE_LEVELS, livingFoes, heroHealth, weaponOf, itemHeals } from '../shared/battle.js';
import { spriteTitle } from '../core/catalog.js';

const nameOf = (e) => (e.active && e.active.name) || spriteTitle(e.asset.startsWith('p:') ? e.asset : 'p:enemy');
const bar = (cls, name, hp, max, id) =>
  h(
    'div',
    { class: 'bar ' + cls, 'data-id': id || '' },
    h('b', {}, name),
    h('span', {}, `${hp} / ${max}`),
    h('i', { style: `width:${(hp / (max || 1)) * 100}%` }),
  );
const levelName = (b) => (BATTLE_LEVELS.find((l) => l[0] === b.level) || [0, ''])[1];

/** Carry out a command of the Player's: the round is fought on the server and shown to both. */
export function battleCmd(move, extra = {}) {
  if (app.liveBusy || app.cut) return;
  app.liveBusy = true;
  app.battleMenu = '';
  act('battle', { turn: app.S.turn, move, ...extra }, 2).catch((e) => {
    app.liveBusy = false;
    toast(e.message);
  });
  setTimeout(() => (app.liveBusy = false), 6000);
}
/** The Player's whole footer during a battle. rebuild() redraws it. */
export function battleBox(rebuild) {
  const sc = app.S.scene,
    b = sc.battle,
    foes = livingFoes(sc),
    hp = heroHealth(sc),
    weapon = weaponOf(sc),
    me = hero(sc),
    menu = app.battleMenu || '',
    busy = app.liveBusy || !!app.cut;
  const cmd = (id, label, fn, on) => h('button', { 'data-cmd': id, class: on ? 'on' : '', disabled: busy, onclick: fn }, label);
  const open = (id) => () => {
    app.battleMenu = menu === id ? '' : id;
    rebuild();
  };
  return h(
    'div',
    { class: 'battlebox', id: 'battleBox' },
    h('b', { class: 'actlab' }, `Battle — round ${b.round}`),
    h(
      'div',
      { class: 'battlehud', id: 'battleHud' },
      bar('hero', app.S.names.player + (weapon ? ' (armed)' : ''), hp.get(), hp.max, me && me.id),
      foes.map((e) => bar('foe', nameOf(e), e.hp, e.maxHp, e.id)),
    ),
    h(
      'div',
      { class: 'battlecmds' },
      cmd('attack', 'Attack', foes.length === 1 ? () => battleCmd('attack', { id: foes[0].id }) : open('attack'), menu === 'attack'),
      cmd('defend', 'Defend', () => battleCmd('defend')),
      cmd('item', `Item (${sc.sheet.inv.length})`, open('item'), menu === 'item'),
      cmd('escape', `Escape (${b.flee}%)`, () => battleCmd('escape')),
    ),
    menu === 'attack' &&
      h(
        'div',
        { class: 'battlepick' },
        foes.map((e) => h('button', { disabled: busy, onclick: () => battleCmd('attack', { id: e.id }) }, `Attack ${nameOf(e)}`)),
      ),
    menu === 'item' &&
      h(
        'div',
        { class: 'battlepick' },
        sc.sheet.inv.length
          ? sc.sheet.inv.map((it) =>
              h(
                'button',
                { disabled: busy, onclick: () => battleCmd('item', { item: it.id, id: foes[0] && foes[0].id }) },
                glyphNode(app.code, it.asset, 'mini'),
                ` ${it.name || ''} — ${itemHeals(it) ? 'heals you' : 'throw it'}`,
              ),
            )
          : h('small', { class: 'dim' }, 'You carry nothing.'),
      ),
    h(
      'small',
      { class: 'dim', id: 'liveNote' },
      busy ? 'The round is being fought…' : `You are in a ${levelName(b).toLowerCase()} fight: win it, or try to escape.`,
    ),
    b.log.length > 0 &&
      h(
        'div',
        { class: 'battlelog' },
        b.log.slice(-5).map((l) => h('p', {}, l)),
      ),
    app.S.hotseat && h('button', { class: 'link', id: 'liveStop', onclick: pauseBattle }, 'Director: pause the battle'),
  );
}
export function pauseBattle() {
  act('battlePause', {}, 2).catch((e) => toast(e.message));
}
/** For the Director who watches: what is happening, and the pause button. */
export function watchCard() {
  const sc = app.S.scene,
    b = sc.battle,
    hp = heroHealth(sc);
  return h(
    'div',
    { class: 'card', id: 'liveCard' },
    h('h3', {}, `Battle — round ${b.round} (${levelName(b)})`),
    h(
      'div',
      { class: 'battlehud' },
      bar('hero', app.S.names.player, hp.get(), hp.max),
      livingFoes(sc).map((e) => bar('foe', nameOf(e), e.hp, e.maxHp)),
    ),
    h(
      'p',
      { class: 'dim small' },
      `${app.S.names.player} fights it out; you see every blow as it falls. The turn comes back to you when the battle is over — or pause it to stage something.`,
    ),
    b.log.length > 0 &&
      h(
        'div',
        { class: 'battlelog' },
        b.log.slice(-6).map((l) => h('p', {}, l)),
      ),
    h('button', { class: 'primary', id: 'liveStop', onclick: pauseBattle }, 'Pause the battle'),
  );
}
