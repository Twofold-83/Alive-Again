/*
 * The footer under the tool column: whose turn it is and the button that ends it.
 * For the Director that is all. For the Player it is everything they can do on their turn — say something, write a
 * free action, pick an action and aim it at the stage, walk, strike a pose, answer what the Director asked, roll.
 * Which of these are offered depends on the story's rules (rules.player: 'free', 'limited' or 'tell').
 */
import { isDoll, poseEditor } from '../core/dolls.js';
import { assetUrl } from '../core/catalog.js';
import { h } from '../core/dom.js';
import { openCheck } from './dice.js';
import { battleBox } from './battle-ui.js';
import { glyphNode } from '../stage/render.js';
import { nameOf, pointText } from '../shared/scene-model.js';
import { EMOTES } from '../shared/options.js';
import { $ } from '../core/dom.js';
import { audio } from '../core/audio.js';
import { myTurn, other, hero, app } from '../core/state.js';
import { saveDraft, changedQuiet, rebuild, submit, testPlay } from './turn.js';
import { walkHero, undoWalk, setReply, oneAction } from './walk.js';
import { render } from './view.js';
import { openStory } from './viewer.js';
import { leave } from '../shell/home.js';

/* ---------- what the Director asked for ---------- */
/** A picture the Director shows: over the whole stage; a click closes it — and, if the Director said so, ends the turn. */
function showPicture(ask) {
  let el = document.querySelector('#picture');
  if (el) el.remove();
  const over = ask.over === 'stage'; // over the stage, which shows through; or alone on black, over everything
  el = h('div', { id: 'picture', class: over ? 'over' : '' });
  (over ? $('#stageWrap') : document.body).append(el);
  const narr = h('p', { class: 'picnarr' });
  el.replaceChildren(
    h('img', { src: assetUrl(app.code, ask.image), alt: '' }),
    ask.text ? h('p', {}, ask.text) : '',
    ask.narr ? narr : '',
    h('small', {}, 'Click to go on'),
  );
  /* the narration is typed out, as on the stage */
  const text = ask.narr || '';
  let n = 0;
  const type = () => {
    if (!el.isConnected || n >= text.length) return;
    n = Math.min(text.length, n + 2);
    narr.textContent = text.slice(0, n);
    if (n % 6 < 2) audio.sfx('type');
    setTimeout(type, 45);
  };
  if (text) setTimeout(type, 500);
  el.onclick = () => {
    if (n < text.length) {
      n = text.length; // a first click shows the whole narration at once
      narr.textContent = text;
      return;
    }
    el.hidden = true;
    el.replaceChildren();
    setReply({ seen: true });
    saveDraft();
    if (ask.back) return submit();
    rebuild();
  };
}
/** The card for a roll the Director asked for; what the Player decided goes into the draft. */
function check(ask) {
  if (document.querySelector('#check:not([hidden])')) return;
  openCheck(ask, (r) => {
    if (r.rolled) {
      if (app.draft.ask) app.draft.ask.rolled = r.rolled;
      setReply({ roll: true });
      saveDraft();
      return submit(); // rolled: the Director takes over at once
    }
    setReply({ decline: true });
    saveDraft();
    rebuild();
  });
}

/** What the hero can do to the things of an adventure. */
const VERBS = ['Walk', 'Look at', 'Push', 'Pull', 'Open', 'Use', 'Pick up', 'Give', 'Talk to', 'Attack'];
const ASK_TITLES = {
  roll: () => 'Roll the die.',
  image: () => 'A picture',
  discard: () => 'Give up one of your things.',
  place: () => 'Where do you go?',
  target: (ask) => `${ask.verb || 'Choose'} — who or what?`,
};
/** The box for what the Director asked: { node, answered }. Opens the picture or the skill check by itself, once a turn. */
function askBox(ask) {
  const rp = app.draft.reply || {},
    inv = app.draft.sheet.inv;
  const opt = (label, on, fn) =>
    h(
      'button',
      {
        class: on ? 'on' : '',
        onclick: () => {
          fn();
          rebuild();
        },
      },
      label,
    );
  const once = (flag, fn) => {
    if (app[flag] === app.S.turn) return;
    app[flag] = app.S.turn;
    setTimeout(fn, 350);
  };
  let body,
    answered = true;
  if (ask.kind === 'image') {
    /* a picture from the Director: it fills the stage until it is clicked */
    answered = !!rp.seen;
    body = opt(rp.seen ? 'Look at the picture again' : 'Look at the picture', false, () => showPicture(ask));
    if (!rp.seen) once('pictureSeen', () => showPicture(ask));
  } else if (ask.kind === 'roll') {
    /* the die falls at once: the Player sees the number, and whether it was enough */
    const got = ask.rolled,
      need = ask.dc ? `You needed ${ask.dc} or more.` : '';
    answered = !!got || !!rp.decline;
    body = got
      ? h(
          'div',
          { id: 'rolled', class: 'rolled ' + (!ask.dc ? '' : got.value >= ask.dc ? 'good' : 'bad') },
          h('b', {}, String(got.value)),
          h('span', {}, !ask.dc ? `You rolled ${got.value} on the d${got.sides}.` : got.value >= ask.dc ? `Success! ${need}` : `Failed. ${need}`),
        )
      : opt(rp.decline ? 'You backed out — roll after all?' : `Roll the d${ask.sides}${ask.dc ? ` — you need ${ask.dc} or more` : ''}`, false, () =>
          check(ask),
        );
    if (!got && !rp.decline) once('checkSeen', () => check(ask)); // the turn opens on the skill check card
  } else if (ask.kind === 'discard') {
    answered = !!rp.id || !inv.length;
    body = inv.length
      ? inv.map((it) => opt(glyphNode(app.code, it.asset, 'mini'), rp.id === it.id, () => setReply({ id: it.id })))
      : h('span', { class: 'dim' }, 'You have nothing to give up.');
  } else if (ask.kind === 'place') {
    answered = rp.index != null;
    body = ask.places.map((pl, i) =>
      opt(pl.label, rp.index === i, () => {
        setReply({ index: i });
        if (!app.draft.walked) setTimeout(() => walkHero(pl.x, pl.y), 0);
      }),
    );
  } else if (ask.kind === 'target') {
    answered = !!rp.id;
    body = ask.targets.map((id) => {
      const e = app.draft.entities.find((x) => x.id === id);
      return opt(e ? nameOf(e) || glyphNode(app.code, e.asset, 'mini') : '?', rp.id === id, () => setReply({ id }));
    });
  } else return { node: null, answered: true };
  return {
    node: h('div', { class: 'askbox' }, h('b', {}, ask.text || ASK_TITLES[ask.kind](ask)), h('div', { class: 'chips wrap choices' }, body)),
    answered,
  };
}

/* ---------- the Player's own moves ---------- */
/** A button that switches something in the app's state and redraws the footer. */
const toggle = (o, label, fn) =>
  h(
    'button',
    {
      ...o,
      onclick: () => {
        fn();
        rebuild();
      },
    },
    label,
  );
function sayInput(me) {
  return h('input', {
    id: 'sayInput',
    placeholder: 'Say something…',
    maxlength: 160,
    value: me ? me.say : '',
    disabled: !me,
    enterkeyhint: 'next',
    oninput: (ev) => {
      me.say = ev.target.value;
      changedQuiet();
    },
  });
}
function freeAction() {
  const adventure = app.S.rules.type === 'adventure';
  return h('input', {
    id: 'freeAction',
    placeholder: adventure ? 'Free Action… (instead of an action)' : 'Free Action… (“open the drawer”)',
    maxlength: 160,
    value: app.draft.action,
    enterkeyhint: 'done',
    oninput: (ev) => {
      const d = app.draft,
        other = adventure && ev.target.value.trim() && (d.point || d.use || d.target);
      d.action = ev.target.value;
      if (!other) return changedQuiet();
      oneAction('words'); // one action a turn: these words take the place of what was picked before
      rebuild();
      const el = $('#freeAction');
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    },
  });
}
/** Narration only: the Player writes what they want, the Director stages it. */
function tellBox() {
  const ta = h(
    'textarea',
    { id: 'tellBox', rows: 3, maxlength: 300, placeholder: `What do you want to do? ${app.S.names.director} will make it happen.` },
    app.draft.action,
  );
  ta.addEventListener('input', () => {
    app.draft.action = ta.value;
    saveDraft();
  });
  return ta;
}
/** The Director's options, in a story where the Player chooses among them. */
function choiceChips() {
  return h(
    'div',
    { class: 'chips wrap choices' },
    app.draft.choices.map((c) =>
      toggle({ class: app.draft.action === c ? 'on' : '' }, c, () => (app.draft.action = app.draft.action === c ? '' : c)),
    ),
  );
}
function emoteChips(me) {
  return h(
    'div',
    { class: 'chips emotes' },
    EMOTES.slice(0, 8).map((e) =>
      toggle({ class: me.emote === e ? 'on' : '', 'aria-label': 'Emote ' + e }, e, () => (me.emote = me.emote === e ? '' : e)),
    ),
  );
}
/** Point and click: pick an action, then click what it is about — a thing ("Open old chest") or a spot ("Push here"). */
function actionBar() {
  const open = app.actionsOpen || app.verb;
  return h(
    'div',
    { id: 'actionBar' },
    h(
      'div',
      { class: 'row' },
      toggle(
        { id: 'actionsBtn', class: 'grow' + (open ? ' on' : '') },
        app.verb ? `${app.verb} — now click on the stage…` : app.draft.point ? pointText(app.draft) : 'Actions',
        () => {
          app.actionsOpen = !app.actionsOpen;
          app.verb = '';
        },
      ),
      app.draft.point && toggle({ id: 'pointClear', title: 'Do not do this after all' }, '✕', () => (app.draft.point = null)),
    ),
    open &&
      h(
        'div',
        { class: 'verbgrid' },
        VERBS.map((v) =>
          toggle({ 'data-verb': v, class: app.verb === v ? 'on' : '', disabled: v === 'Walk' && app.draft.walked }, v, () => {
            app.verb = app.verb === v ? '' : v;
            app.walkMode = false;
          }),
        ),
      ),
  );
}
function walkButton() {
  if (app.draft.walked) return h('button', { id: 'walkBtn', class: 'grow', onclick: undoWalk }, '↶ Take the walk back');
  return h(
    'button',
    {
      id: 'walkBtn',
      class: 'grow' + (app.walkMode ? ' recording' : ''),
      onclick: () => {
        app.walkMode = !app.walkMode;
        app.verb = '';
        render();
      },
    },
    app.walkMode ? 'Click on the stage where to go…' : 'Walk',
  );
}
/** A paper-doll hero: "Act" opens the poses and feelings. How the hero looks is the Director's to decide. */
function dollRow(me) {
  if (!isDoll(me.asset)) return null;
  return h(
    'div',
    { class: 'row', id: 'dollRow' },
    toggle({ id: 'poseBtn', class: 'grow' + (app.poseOpen ? ' on' : '') }, 'Act', () => (app.poseOpen = !app.poseOpen)),
  );
}
function poser(me) {
  if (!app.poseOpen || !isDoll(me.asset)) return null;
  const set = (k) => (v) => {
    me[k] = v;
    changedQuiet();
  };
  return poseEditor(me.asset, me.pose, set('pose'), { feel: me.feel, onFeel: set('feel') });
}
/* ---------- the footer ---------- */
const turnClock = () => h('span', { id: 'tlabel' });
const status = (...kids) => h('div', { class: 'status' }, ...kids);
const whose = () => (app.S.hotseat ? (app.S.whose === 'director' ? 'Director' : 'Player') + '’s ' : '');

function directorFoot() {
  const ready = app.S.joined.player;
  if (app.S.prep && !app.S.testing)
    return [
      h(
        'button',
        {
          id: 'testStart',
          class: 'go primary',
          title: 'Try what is on the stage as the Player. Ending the test puts everything back.',
          onclick: () => testPlay(),
        },
        '▶ Test as Player',
      ),
    ];
  return [
    h(
      'button',
      { class: 'go primary', disabled: !ready, onclick: submit },
      ready ? (app.S.turn === 0 ? 'Begin the story ▶' : `End ${whose()}turn ▶`) : 'Waiting for your Player to join…',
      turnClock(),
    ),
  ];
}
function playerFoot() {
  const me = hero(app.draft),
    mode = app.S.rules.player,
    ask = mode !== 'tell' && app.draft.ask ? askBox(app.draft.ask) : { node: null, answered: true },
    must = mode === 'limited' && !ask.answered, // limited will: first do what was asked
    choices = app.draft.choices.length > 0;
  const end = (off) =>
    h('div', { class: 'row' }, h('button', { class: 'go primary grow', disabled: !!off, onclick: submit }, `End ${whose()}turn ▶`, turnClock()));
  const walk = me && walkButton(),
    doll = me && [dollRow(me), poser(me)],
    aim = app.S.rules.type === 'adventure' && actionBar();
  if (mode === 'tell') return [tellBox(), end()];
  if (mode === 'limited' && choices)
    return [
      h('div', { class: 'dim small' }, `Choose what you do — ${app.S.names.director} decided the options:`),
      choiceChips(),
      ask.node,
      sayInput(me),
      doll,
      walk,
      end(!app.draft.choices.includes(app.draft.action) || must),
    ];
  if (mode === 'limited' && app.draft.ask) return [ask.node, sayInput(me), app.draft.ask.kind === 'place' ? null : walk, end(must)]; // do exactly what was asked
  return [ask.node, choices && choiceChips(), me && emoteChips(me), sayInput(me), freeAction(), aim, doll, walk, end()];
}
export function buildFoot() {
  const f = $('#foot'),
    S = app.S;
  let kids,
    tight = false;
  if (S.ended)
    kids = [
      h('button', { class: 'go primary', onclick: openStory }, 'Read the story'),
      h('button', { class: 'link', onclick: () => leave() }, 'Start a new story'),
    ];
  else if (S.you === 'spectator') kids = [status(`${S.names[S.whose]}'s turn`, turnClock())];
  else if (app.fight && app.fight.mine)
    [kids, tight] = [[battleBox(rebuild)], true]; // a round of my battle is playing (the last one, too, when the turn has already moved on)
  else if (app.fight)
    kids = [status('The battle…')]; // watching a round: nothing to press until it has been played
  else if (!myTurn()) kids = [status(`Waiting for ${S.joined[other()] ? S.names[other()] : 'your partner'}`, turnClock())];
  else if (app.submitting) kids = [status('Sending…')];
  else if (S.you === 'player' && S.scene.battle)
    [kids, tight] = [[battleBox(rebuild)], true]; // locked in battle: nothing but its commands until it is over
  else if (S.you === 'director') [kids, tight] = [directorFoot(), true];
  else kids = playerFoot();
  f.classList.toggle('tight', tight);
  f.replaceChildren(...kids.flat().filter(Boolean));
}
