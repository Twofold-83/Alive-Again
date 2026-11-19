import { assetLabel } from '../core/catalog.js';
import { h } from '../core/dom.js';
import { glyphNode } from '../stage/render.js';
import { EMOTES } from '../core/consts.js';
import { $ } from '../core/dom.js';
import { myTurn, other, hero, mods, app } from '../core/state.js';
import { saveDraft, changedQuiet, rebuild, submit } from './turn.js';
import { walkHero, undoWalk, setReply } from './walk.js';
import { render } from './view.js';
import { openStory } from './viewer.js';
import { leave } from '../shell/home.js';

/* ---------- footer: what I say / narrate, and the End turn button ---------- */
export function buildFoot() {
  const f = $('#foot'); f.replaceChildren(); f.classList.remove('tight');
  const tl = () => h('span', { id: 'tlabel' });
  const side = app.S.hotseat ? (app.S.whose === 'director' ? 'Director' : 'Player') + '’s ' : '';
  if (app.S.ended) return void f.append(h('button', { class: 'go primary', onclick: openStory }, '📖 Read the story'), h('button', { class: 'link', onclick: () => leave() }, 'Start a new story'));
  if (app.S.you === 'spectator') return void f.append(h('div', { class: 'status' }, `${app.S.names[app.S.whose]}'s turn`, tl()));
  if (!myTurn()) return void f.append(h('div', { class: 'status' }, `⏳ Waiting for ${app.S.joined[other()] ? app.S.names[other()] : 'your partner'}`, tl()));
  if (app.submitting) return void f.append(h('div', { class: 'status' }, 'Sending…'));
  if (app.S.you === 'director') {
    const ready = app.S.joined.player;
    f.append(
      h('button', { class: 'go primary', disabled: !ready, onclick: submit }, ready ? (app.S.turn === 0 ? 'Begin the story ▶' : `End ${side}turn ▶`) : 'Waiting for your Player to join…', tl()));
    f.classList.add('tight');
  } else {
    const me = hero(app.draft), mode = app.S.rules.player;
    const dice = mods().dice && h('button', { class: 'dice' + (app.draft.rollWant ? ' on' : ''), title: 'Roll a die with this turn', onclick: () => { app.draft.rollWant = app.draft.rollWant === 0 ? 6 : app.draft.rollWant === 6 ? 20 : 0; rebuild(); } }, app.draft.rollWant ? `🎲 d${app.draft.rollWant}` : '🎲');
    const walkBtn = mode !== 'tell' && me && (app.draft.walked
      ? h('button', { id: 'walkBtn', class: 'grow', onclick: undoWalk }, '↶ Take the walk back')
      : h('button', { id: 'walkBtn', class: 'grow' + (app.walkMode ? ' recording' : ''), onclick: () => { app.walkMode = !app.walkMode; app.pointMode = false; render(); } }, app.walkMode ? 'Click on the stage where to go…' : '🚶 Walk'));
    const end = (off) => h('div', { class: 'row' }, dice, h('button', { class: 'go primary grow', disabled: !!off, onclick: submit }, `End ${side}turn ▶`, tl()));
    const pointed = () => { const pt = app.draft.point, e = pt && pt.id && app.draft.entities.find((x) => x.id === pt.id); return e ? (e.active ? e.active.name : assetLabel(e.asset)) : 'that spot'; };
    const pointRow = () => app.S.rules.type === 'adventure' && h('div', { class: 'row', id: 'pointRow' },
      h('button', { id: 'pointBtn', class: 'grow' + (app.pointMode ? ' recording' : app.draft.point ? ' on' : ''), title: 'Tie what you wrote to something on the stage', onclick: () => { app.pointMode = !app.pointMode; app.walkMode = false; render(); } },
        app.pointMode ? 'Click a thing or a spot on the stage…' : app.draft.point ? `👉 ${pointed()} — click to point at something else` : '👉 Point at something on the stage'),
      app.draft.point && h('button', { id: 'pointClear', title: 'Point at nothing', onclick: () => { app.draft.point = null; if (app.draft.action === 'Look at') app.draft.action = ''; rebuild(); } }, '✕'));
    const say = () => h('input', { placeholder: '💬 Say something…', maxlength: 160, value: me ? me.say : '', disabled: !me, enterkeyhint: 'next', oninput: (ev) => { me.say = ev.target.value; changedQuiet(); } });
    const pick = () => h('div', { class: 'chips wrap choices' }, app.draft.choices.map((c) => h('button', { class: app.draft.action === c ? 'on' : '', onclick: () => { app.draft.action = app.draft.action === c ? '' : c; rebuild(); } }, c)));
    const ask = app.draft.ask, rp = app.draft.reply || {};
    let asked = null, answered = true;
    if (ask && mode !== 'tell') {                        // the Director asked for something specific
      const opt = (label, on, fn) => h('button', { class: on ? 'on' : '', onclick: () => { fn(); rebuild(); } }, label);
      const lab = (id) => { const e = app.draft.entities.find((x) => x.id === id); return e ? (e.active ? e.active.name : glyphNode(app.code, e.asset, 'mini')) : '?'; };
      let body;
      if (ask.kind === 'roll') { answered = !!rp.roll; body = opt(`🎲 Roll the d${ask.sides}${ask.dc ? ` — you need ${ask.dc} or more` : ''}`, rp.roll, () => { setReply(rp.roll ? null : { roll: true }); }); }
      else if (ask.kind === 'discard') { answered = !!rp.id || !app.draft.sheet.inv.length; body = app.draft.sheet.inv.length ? app.draft.sheet.inv.map((it) => opt(glyphNode(app.code, it.asset, 'mini'), rp.id === it.id, () => { setReply({ id: it.id }); })) : h('span', { class: 'dim' }, 'You have nothing to give up.'); }
      else if (ask.kind === 'place') { answered = rp.index != null; body = ask.places.map((pl, i) => opt('📍 ' + pl.label, rp.index === i, () => { setReply({ index: i }); if (!app.draft.walked) setTimeout(() => walkHero(pl.x, pl.y), 0); })); }
      else if (ask.kind === 'target') { answered = !!rp.id; body = ask.targets.map((id) => opt(lab(id), rp.id === id, () => { setReply({ id }); })); }
      else {
        answered = !!rp.move;
        body = [...app.draft.entities.filter((e) => e.hp != null && e.id !== app.draft.heroId).map((e) => opt(['⚔️ Attack ', lab(e.id)], rp.move === 'attack' && rp.id === e.id, () => { setReply({ move: 'attack', id: e.id }); })),
          opt('🛡️ Defend', rp.move === 'defend', () => { setReply({ move: 'defend' }); }), opt('🏃 Flee', rp.move === 'flee', () => { setReply({ move: 'flee' }); })];
      }
      const def = { roll: 'Roll the die.', discard: 'Give up one of your things.', place: 'Where do you go?', target: `${ask.verb || 'Choose'} — who or what?`, battle: 'Battle! What do you do?' }[ask.kind];
      asked = h('div', { class: 'askbox' }, h('b', {}, ask.text || def), h('div', { class: 'chips wrap choices' }, body));
    }
    const must = mode === 'limited' && ask && ask.kind !== 'battle' && !answered;
    if (mode === 'tell') {                               // narration: only words; the Director stages them
      const ta = h('textarea', { id: 'tellBox', rows: 3, maxlength: 300, placeholder: `✍️ What do you want to do? ${app.S.names.director} will make it happen.` }, app.draft.action);
      ta.addEventListener('input', () => { app.draft.action = ta.value; saveDraft(); });
      f.append(ta, pointRow(), end());
    } else if (mode === 'limited' && app.draft.choices.length) {   // limited will: one of the Director's options
      f.append(h('div', { class: 'dim small' }, `Choose what you do — ${app.S.names.director} decided the options:`), pick(), asked, say(), walkBtn, end(!app.draft.choices.includes(app.draft.action) || must));
    } else if (mode === 'limited' && ask) {              // limited will: do exactly what was asked
      f.append(asked, say(), ask.kind === 'place' ? null : walkBtn, end(must));
    } else {
      if (asked) f.append(asked);
      if (app.draft.choices.length) f.append(pick());
      if (me) f.append(h('div', { class: 'chips emotes' }, EMOTES.slice(0, 8).map((e) => h('button', { class: me.emote === e ? 'on' : '', 'aria-label': 'Emote ' + e, onclick: () => { me.emote = me.emote === e ? '' : e; rebuild(); } }, e))));
      f.append(say(),
        h('input', { placeholder: '✋ Do something… (“open the drawer”)', maxlength: 160, value: app.draft.action, enterkeyhint: 'done', oninput: (ev) => { app.draft.action = ev.target.value; changedQuiet(); } }),
        pointRow(), walkBtn, end());
    }
  }
}
