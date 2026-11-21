/* A turn in a story: the draft being edited, undo, the Director's steps, and sending the turn.
 * onState() is where every message from the server arrives. */
import { audio } from '../core/audio.js';
import { rpgState } from '../dungeon/screen.js';
import { renderStage } from '../stage/render.js';
import { playTurn } from '../stage/playback.js';
import { clone } from '../core/dom.js';
import { History } from '../core/history.js';
import { normScene, stepFields, playerFields } from '../shared/scene-model.js';
import { resetGuided, guidedStart } from './guided.js';
import { $, toast } from '../core/dom.js';
import { myTurn, directing, stage, hero, shown, heroTurn, app } from '../core/state.js';
import { stopWalkAnim, settleWalk } from './walk.js';
import { renderChrome } from '../shell/chrome.js';
import { render, renderSheet } from './view.js';
import { act } from '../core/net.js';

export function onState(s) {
  $('#main').hidden = !!s.rpg;
  $('#rpg').hidden = !s.rpg;
  $('#clock').hidden = !!s.rpg;
  if (s.rpg) {
    app.S = s;
    renderChrome();
    rpgState(s);
    return;
  } // dungeon mode has its own screen and its own engine
  const prev = app.S;
  normScene(s.scene);
  normScene(s.before);
  app.S = s;
  app.localDeadline = s.remainingMs != null ? performance.now() + s.remainingMs : 0;
  const newTurn = !prev || prev.turn !== s.turn || prev.you !== s.you || prev.ended !== s.ended;
  if (newTurn) {
    app.submitting = false;
    app.selId = null;
    app.selInv = null;
    app.rec = false;
    app.drawOn = false;
    app.walkMode = false;
    app.pointMode = false;
    stopWalkAnim();
    resetGuided();
    initDraft();
    history.reset();
    noteChange();
    if (directing()) guidedStart(app.draft);
    if (prev && s.lastTimeout && prev.turn !== s.turn && prev.you === prev.whose && !s.hotseat) toast('Time ran out — your turn was sent as it was');
    if (app.cut) app.cut.skip();
    if (prev && !prev.ended && s.ended) audio.sfx('theend');
    if (prev && prev.turn !== s.turn && s.turn > 0 && !s.ended) {
      // present what just happened before handing over control
      const by = s.whose === 'director' ? 'player' : 'director';
      if (s.turn === 1 && s.info.title) {
        const first = s.scene.steps[0] || s.scene;
        if (!first.card) first.card = s.info.title;
      } // the story opens on its title
      app.cut = playTurn(
        stage,
        s.before,
        s.scene,
        {
          ...stageOpts(),
          selId: null,
          pendingRoll: 0,
          dest: null,
          camFrame: false,
          by,
          sfx: audio.sfx,
          who: s.names[by],
          stinger: myTurn() ? (s.hotseat ? `${s.whose === 'director' ? 'Director' : 'Player'}’s turn` : 'Your turn') : '',
        },
        () => {
          app.cut = null;
          if (myTurn()) {
            audio.blip();
            if (navigator.vibrate) navigator.vibrate(120);
          }
          render();
        },
      );
    }
  }
  render();
}

/** A new draft for my turn, made from the committed scene. */
function freshDraft() {
  const d = clone(app.S.scene);
  if (app.S.you === 'director') {
    // last turn's lines, narration and one-turn extras are over
    const me = hero(d);
    d.said = me ? me.say : ''; // what the Player said moves from their bubble into the "Player did" strip
    for (const e of d.entities) e.say = '';
    Object.assign(d, stepFields(), { narration: '', choices: [], steps: [] });
    d.entities = d.entities.filter((e) => !e.temp);
    for (const e of d.entities) e.once = '';
    d.ask = d.battle ? { kind: 'battle', text: 'Your move!', sides: 6, dc: 0, verb: '', places: [], targets: [] } : null; // a battle keeps asking for a move
    if (d.roll && d.roll.by === 'director') d.roll = null;
  } else {
    const me = hero(d);
    if (me) me.say = '';
    Object.assign(d, playerFields(), { heroTrack: null, walked: false, reply: null, act: null });
    if (d.roll && d.roll.by === 'player') d.roll = null;
  }
  d.rollWant = 0;
  return d;
}
function initDraft() {
  app.draft = clone(app.S.scene);
  if (!myTurn()) return;
  try {
    const saved = JSON.parse(sessionStorage.getItem('tf.draft') || 'null');
    if (saved && saved.code === app.code && saved.turn === app.S.turn && saved.you === app.S.you) {
      app.draft = normScene(saved.draft);
      return;
    }
  } catch {
    /* ignore */
  }
  app.draft = freshDraft();
}
export function saveDraft() {
  syncOrder();
  sessionStorage.setItem('tf.draft', JSON.stringify({ code: app.code, turn: app.S.turn, you: app.S.you, draft: app.draft }));
}
export function paint() {
  if (!app.cut && app.S) renderStage(stage, shown(), stageOpts());
}
/* Undo for the Director: every finished change is remembered; Ctrl+Z or the Undo button steps back. */
const history = new History();
function noteChange() {
  if (directing()) history.note(app.draft);
}
export function canUndo() {
  return history.canUndo;
}
export function undo() {
  const earlier = history.undo();
  if (!earlier) return;
  app.draft = earlier;
  app.selId = null;
  resetGuided();
  guidedStart(null);
  app.uiKey = '';
  saveDraft();
  render();
}
/** The Player's turn is replayed in the order they did things: speaking, walking, acting. Whatever is new goes last; whatever was taken back drops out. */
function syncOrder() {
  if (!app.S || app.S.you !== 'player' || !app.draft) return;
  const me = hero(app.draft),
    has = {
      say: !!(me && me.say),
      walk: !!app.draft.walked,
      act: !!(
        app.draft.action ||
        app.draft.target ||
        app.draft.point ||
        app.draft.use ||
        app.draft.exit ||
        app.draft.act ||
        (app.draft.reply && !app.draft.reply.roll)
      ),
    };
  app.draft.order = (app.draft.order || []).filter((k) => has[k]);
  for (const k of Object.keys(has)) if (has[k] && !app.draft.order.includes(k)) app.draft.order.push(k);
}
export function changed() {
  noteChange();
  saveDraft();
  render();
} // may rebuild the panel
export function changedQuiet() {
  saveDraft();
  paint();
  renderSheet();
} // never rebuilds the panel (the user is typing in it)
export function rebuild() {
  app.uiKey = '';
  changed();
}

/* The Director's turn is a list of steps. draft.steps holds the finished ones (the scene as it
 * stood at the end of each); the draft itself is the step being worked on. Everything done within
 * one step plays at the same time; the next step plays after it. */
export const ONE_STEP = stepFields(); // belongs to the step that made it
export const PLAYERS = { ...playerFields(), roll: null }; // the Player's last turn: shown while editing, never sent back
/** What a new step inherits from the one before: speech and one-off animations are over, short-lived effects are gone. */
function carry(d) {
  d.entities = d.entities.filter((e) => !e.temp);
  for (const e of d.entities) {
    e.say = '';
    e.once = '';
  }
  Object.assign(d, clone(ONE_STEP));
  return d;
}
function asFrame(d) {
  const f = { ...clone(d), ...PLAYERS, steps: [] };
  delete f.rollWant;
  delete f.said;
  delete f.heroTrack;
  return f;
}
function sameLook(a, b) {
  return JSON.stringify({ ...a, ...ONE_STEP, steps: 0 }) === JSON.stringify({ ...b, ...ONE_STEP, steps: 0 });
}
export function stepEmpty() {
  const f = asFrame(app.draft),
    base = asFrame(stepStart());
  return sameLook(f, base) && !f.tracks.length && !f.burst && !f.sfx && !f.card && !f.travel && !f.award && !f.floats.length;
}
/** The scene as the current step found it. */
function stepStart() {
  if (!app.draft.steps.length) return freshDraft();
  const keep = {};
  for (const k of [...Object.keys(PLAYERS), 'said', 'rollWant']) keep[k] = app.draft[k];
  return { ...carry(clone(app.draft.steps[app.draft.steps.length - 1])), ...keep, steps: clone(app.draft.steps) };
}
export function nextStep() {
  if (stepEmpty()) return toast('Nothing has happened in this step yet');
  if (app.draft.steps.length >= 79) return toast('That is a very long turn — end it and continue next turn');
  app.draft.steps.push(asFrame(app.draft));
  carry(app.draft);
  app.selId = null;
  resetGuided();
  rebuild();
}
export function resetStep() {
  app.draft = stepStart();
  app.selId = null;
  resetGuided();
  rebuild();
}
export function clearSteps() {
  app.draft = freshDraft();
  app.selId = null;
  resetGuided();
  rebuild();
}
/** Go back to an earlier step: it becomes the one being worked on, later ones are dropped. */
export function gotoStep(i) {
  const f = app.draft.steps[i];
  app.draft = {
    ...clone(f),
    action: app.draft.action,
    target: app.draft.target,
    use: app.draft.use,
    roll: app.draft.roll,
    said: app.draft.said,
    rollWant: app.draft.rollWant,
    steps: clone(app.draft.steps.slice(0, i)),
  };
  app.selId = null;
  resetGuided();
  rebuild();
}
/** What is sent when the Director ends the turn. An untouched last step is dropped. */
function finalScene() {
  const steps = clone(app.draft.steps),
    cur = asFrame(app.draft);
  if (steps.length && stepEmpty()) return { ...steps.pop(), steps, rollWant: app.draft.rollWant };
  return { ...cur, steps, rollWant: app.draft.rollWant };
}

export async function submit() {
  if (app.submitting || !myTurn()) return;
  if (app.cut) app.cut.skip();
  settleWalk();
  app.submitting = true;
  render();
  audio.sfx('send');
  const turn = app.S.turn,
    me = hero(app.draft),
    roll = app.draft.rollWant || 0;
  const body =
    app.S.you === 'director'
      ? { turn, scene: finalScene(), roll }
      : {
          answer: app.draft.reply,
          act: app.draft.act,
          exit: app.draft.exit,
          turn,
          x: me && me.x,
          y: me && me.y,
          say: me ? me.say : '',
          emote: me ? me.emote : '',
          pose: me ? me.pose : null,
          feel: me ? me.feel || '' : '',
          look: app.draft.look,
          action: app.draft.action,
          target: app.draft.target,
          point: app.draft.point,
          order: app.draft.order,
          use: app.draft.use,
          roll,
          track: app.draft.heroTrack,
        };
  try {
    await act('submit', body, 6);
  } catch (e) {
    if (app.S && app.S.turn === turn) {
      app.submitting = false;
      toast(e.message);
      render();
    }
  }
} // where the hero stood when the Player's turn began
function stageOpts() {
  return {
    code: app.code,
    names: app.S.names,
    selId: directing() ? app.selId : null,
    pendingRoll: heroTurn()
      ? app.draft.rollWant || (app.draft.reply && app.draft.reply.roll && !(app.draft.ask && app.draft.ask.rolled) ? app.draft.ask.sides : 0)
      : 0,
    dice: app.rollShow || undefined,
    noAct: heroTurn() && app.S.rules.player === 'tell',
    camFrame: directing(),
    pickId: heroTurn() && app.draft.reply ? app.draft.reply.id : null,
    pickPlace: heroTurn() && app.draft.reply ? app.draft.reply.index : null,
    dest:
      heroTurn() && app.draft.walked && app.draft.heroTrack
        ? { x: app.draft.heroTrack[app.draft.heroTrack.length - 2], y: app.draft.heroTrack[app.draft.heroTrack.length - 1] }
        : null,
  };
}

/** Play the turn as the Player will see it: every step in order, starting from how the turn began. */
export function previewCut() {
  if (app.cut) return app.cut.skip();
  audio.unlock();
  app.cut = playTurn(
    stage,
    app.S.scene,
    finalScene(),
    { ...stageOpts(), selId: null, camFrame: false, by: 'director', sfx: audio.sfx, who: '▶ Preview' },
    () => {
      app.cut = null;
      render();
    },
  );
  render();
}
