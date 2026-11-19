import { CATEGORIES, PIXEL, allItems, BACKDROPS, backdropCss, assetName, loadPack, loadPixel } from './catalog.js';
import { MOODS, SFX, audio } from './audio.js';
import { startTitle } from './title.js';
import { h, clone, clamp, norm, glyphNode, renderStage, playTurn, findWalk, sample } from './stage.js';
import { openWorkshop, workshopOpen } from './workshop.js';
import { FX, EMOTES, WEATHER, BURSTS } from './consts.js';
import { resetGuided, guidedKey, guidedPick, guidedMark, guidedTool, guidedStart, buildGuided } from './guided.js';

/* ---------- small helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const rid = () => Math.random().toString(36).slice(2, 10);
const r3 = (v) => Math.round(v * 1000) / 1000;
const fmt = (ms) => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3400);
}

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
const PENS = ['#ffffff', '#15131c', '#ff5a5a', '#ffb454', '#ffe14d', '#57d38c', '#4db8ff', '#c77dff'];
const IDEAS = ['A stranger arrives who knows the hero’s name.', 'Something on stage is not what it seems.', 'The lights go out. When they return, one thing is missing.', 'A character reveals they have been lying.', 'A letter arrives. It is addressed to the hero.', 'The weather turns, and with it the mood.', 'An old friend appears — changed.', 'A door that was locked is now open.', 'Someone offers a deal that is too good.', 'The ground shakes. Time is running out.', 'A small animal leads the way somewhere unexpected.', 'The hero finds an object from their own past.', 'Two characters want opposite things from the hero.', 'It was all a stage set. What is behind it?', 'A countdown begins. Nobody says what happens at zero.'];

/* ---------- identity ---------- */
let token = localStorage.getItem('tf.token');
if (!token) { token = rid() + rid() + rid(); localStorage.setItem('tf.token', token); }
const known = () => { try { return JSON.parse(localStorage.getItem('tf.rooms') || '[]'); } catch { return []; } };
const remember = (c) => localStorage.setItem('tf.rooms', JSON.stringify([c, ...known().filter((x) => x !== c)].slice(0, 20)));

/* ---------- state ---------- */
let code = null;        // current story code
let S = null;           // last authoritative state from the server
let draft = null;       // my local, uncommitted copy of the scene (only meaningful on my turn)
let selId = null, selInv = null;            // Director: selected entity / inventory item
let submitting = false, autoTurn = -1, localDeadline = 0, connected = false;
let es = null, lastMsg = 0, uiKey = '';
let cut = null;                              // a cut scene currently playing on the main stage
let rec = false;                             // Director: dragging records a path
let drawOn = false;                          // Director: dragging draws
let walkMode = false;                        // Player: the next click on the stage is where the hero walks
let walkAnim = 0;                            // Player: animation frame of a walk being shown
const pen = { c: '#ffffff', w: 4 };

const myTurn = () => S && !S.ended && S.you === S.whose;
const other = () => (S.you === 'director' ? 'player' : 'director');
const shown = () => (myTurn() ? draft : S.scene);
const hero = (scene) => scene.entities.find((e) => e.id === scene.heroId);
const mods = () => S.rules.modules;
const directing = () => myTurn() && S.you === 'director' && !submitting;

/* ---------- network ---------- */
async function api(path, body) {
  const r = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'Something went wrong'), { status: r.status });
  return j;
}
/** POST an action; network hiccups and 5xx are retried, real refusals (4xx) are thrown. */
async function act(type, data = {}, tries = 1) {
  for (let i = 0; ; i++) {
    try { return await api(`/api/rooms/${code}/act`, { token, type, ...data }); } catch (e) {
      if ((e.status && e.status < 500) || i >= tries - 1) throw e.status ? e : new Error('No connection — please try again');
      await new Promise((ok) => setTimeout(ok, Math.min(4000, 500 * 2 ** i)));
    }
  }
}

function connect() {
  if (es) es.close();
  lastMsg = Date.now();
  const mine = (es = new EventSource(`/api/rooms/${code}/events?token=${token}`));
  mine.onopen = () => { connected = true; renderChrome(); };
  mine.onmessage = (e) => { lastMsg = Date.now(); connected = true; onState(JSON.parse(e.data)); };
  mine.addEventListener('ping', () => { lastMsg = Date.now(); });
  mine.addEventListener('gone', () => { mine.close(); leave('That story no longer exists.'); });
  mine.onerror = () => {
    if (es !== mine) return;
    connected = false; renderChrome();
    if (mine.readyState === 2) setTimeout(() => { if (es === mine && code) connect(); }, 1500);
  };
}
setInterval(() => { if (code && Date.now() - lastMsg > 40000) connect(); }, 5000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && code && (!es || es.readyState !== 1 || Date.now() - lastMsg > 20000)) connect(); });
window.addEventListener('online', () => { if (code) connect(); });

function onState(s) {
  const prev = S;
  norm(s.scene); norm(s.before);
  S = s;
  localDeadline = s.remainingMs != null ? performance.now() + s.remainingMs : 0;
  const newTurn = !prev || prev.turn !== s.turn || prev.you !== s.you || prev.ended !== s.ended;
  if (newTurn) {
    submitting = false; selId = null; selInv = null; rec = false; drawOn = false; walkMode = false; stopWalkAnim(); resetGuided();
    initDraft();
    past = []; noteChange();
    if (directing()) guidedStart(draft);
    if (prev && s.lastTimeout && prev.turn !== s.turn && prev.you === prev.whose && !s.hotseat) toast('⏰ Time ran out — your turn was sent as it was');
    if (cut) cut.skip();
    if (prev && !prev.ended && s.ended) audio.sfx('theend');
    if (prev && prev.turn !== s.turn && s.turn > 0 && !s.ended) {  // present what just happened before handing over control
      const by = s.whose === 'director' ? 'player' : 'director';
      if (s.turn === 1 && s.info.title) { const first = s.scene.steps[0] || s.scene; if (!first.card) first.card = s.info.title; }   // the story opens on its title
      cut = playTurn(stage, s.before, s.scene, { ...stageOpts(), selId: null, pendingRoll: 0, dest: null, camFrame: false, by, sfx: audio.sfx, who: `${by === 'director' ? '🎬' : '🧑'} ${s.names[by]}`, stinger: myTurn() ? (s.hotseat ? `${s.whose === 'director' ? 'Director' : 'Player'}’s turn` : 'Your turn') : '' }, () => {
        cut = null;
        if (myTurn()) { audio.blip(); if (navigator.vibrate) navigator.vibrate(120); }
        render();
      });
    }
  }
  render();
}

/** A new draft for my turn, made from the committed scene. */
function freshDraft() {
  const d = clone(S.scene);
  if (S.you === 'director') {      // last turn's lines, narration and one-turn extras are over
    const me = hero(d);
    d.said = me ? me.say : '';     // what the Player said moves from their bubble into the "Player did" strip
    for (const e of d.entities) e.say = '';
    Object.assign(d, { narration: '', tracks: [], burst: '', sfx: '', card: '', choices: [], steps: [], travel: '', award: null, floats: [] });
    d.entities = d.entities.filter((e) => !e.temp); for (const e of d.entities) e.once = '';
    d.ask = d.battle ? { kind: 'battle', text: 'Your move!', sides: 6, dc: 0, verb: '', places: [], targets: [] } : null;   // a battle keeps asking for a move
    if (d.roll && d.roll.by === 'director') d.roll = null;
  } else {
    const me = hero(d); if (me) me.say = '';
    Object.assign(d, { action: '', target: null, use: null, heroTrack: null, walked: false, reply: null, act: null, exit: null, verb: '', answer: null });
    if (d.roll && d.roll.by === 'player') d.roll = null;
  }
  d.rollWant = 0;
  return d;
}
function initDraft() {
  draft = clone(S.scene);
  if (!myTurn()) return;
  try {
    const saved = JSON.parse(sessionStorage.getItem('tf.draft') || 'null');
    if (saved && saved.code === code && saved.turn === S.turn && saved.you === S.you) { draft = norm(saved.draft); return; }
  } catch { /* ignore */ }
  draft = freshDraft();
}
const saveDraft = () => sessionStorage.setItem('tf.draft', JSON.stringify({ code, turn: S.turn, you: S.you, draft }));
const paint = () => { if (!cut && S) renderStage(stage, shown(), stageOpts()); };
/* Undo for the Director: every finished change is remembered; Ctrl+Z or the Undo button steps back. */
let past = [];
function noteChange() {
  if (!directing()) return;
  const j = JSON.stringify(draft);
  if (j !== past[past.length - 1]) { past.push(j); if (past.length > 80) past.shift(); }
}
const canUndo = () => past.length > 1;
function undo() {
  if (!canUndo()) return;
  past.pop();
  draft = JSON.parse(past[past.length - 1]);
  selId = null; resetGuided(); guidedStart(null); uiKey = ''; saveDraft(); render();
}
function changed() { noteChange(); saveDraft(); render(); }           // may rebuild the panel
function changedQuiet() { saveDraft(); paint(); renderSheet(); }    // never rebuilds the panel (the user is typing in it)
function rebuild() { uiKey = ''; changed(); }

/* The Director's turn is a list of steps. draft.steps holds the finished ones (the scene as it
 * stood at the end of each); the draft itself is the step being worked on. Everything done within
 * one step plays at the same time; the next step plays after it. */
const ONE_STEP = { tracks: [], burst: '', sfx: '', card: '', travel: '', award: null, floats: [] };   // belongs to the step that made it
const PLAYERS = { action: '', target: null, use: null, roll: null, answer: null, verb: '', exit: null };    // the Player's last turn: shown while editing, never sent back
/** What a new step inherits from the one before: speech and one-off animations are over, short-lived effects are gone. */
const carry = (d) => { d.entities = d.entities.filter((e) => !e.temp); for (const e of d.entities) { e.say = ''; e.once = ''; } Object.assign(d, clone(ONE_STEP)); return d; };
const asFrame = (d) => { const f = { ...clone(d), ...PLAYERS, steps: [] }; delete f.rollWant; delete f.said; delete f.heroTrack; return f; };
const sameLook = (a, b) => JSON.stringify({ ...a, ...ONE_STEP, steps: 0 }) === JSON.stringify({ ...b, ...ONE_STEP, steps: 0 });
const stepEmpty = () => { const f = asFrame(draft), base = asFrame(stepStart()); return sameLook(f, base) && !f.tracks.length && !f.burst && !f.sfx && !f.card && !f.travel && !f.award && !f.floats.length; };
/** The scene as the current step found it. */
function stepStart() {
  if (!draft.steps.length) return freshDraft();
  const keep = {}; for (const k of [...Object.keys(PLAYERS), 'said', 'rollWant']) keep[k] = draft[k];
  return { ...carry(clone(draft.steps[draft.steps.length - 1])), ...keep, steps: clone(draft.steps) };
}
function nextStep() {
  if (stepEmpty()) return toast('Nothing has happened in this step yet');
  if (draft.steps.length >= 79) return toast('That is a very long turn — end it and continue next turn');
  draft.steps.push(asFrame(draft));
  carry(draft);
  selId = null; resetGuided(); rebuild();
}
function resetStep() { draft = stepStart(); selId = null; resetGuided(); rebuild(); }
function clearSteps() { draft = freshDraft(); selId = null; resetGuided(); rebuild(); }
/** Go back to an earlier step: it becomes the one being worked on, later ones are dropped. */
function gotoStep(i) {
  const f = draft.steps[i];
  draft = { ...clone(f), action: draft.action, target: draft.target, use: draft.use, roll: draft.roll, said: draft.said, rollWant: draft.rollWant, steps: clone(draft.steps.slice(0, i)) };
  selId = null; resetGuided(); rebuild();
}
/** What is sent when the Director ends the turn. An untouched last step is dropped. */
function finalScene() {
  const steps = clone(draft.steps), cur = asFrame(draft);
  if (steps.length && stepEmpty()) return { ...steps.pop(), steps, rollWant: draft.rollWant };
  return { ...cur, steps, rollWant: draft.rollWant };
}

async function submit() {
  if (submitting || !myTurn()) return;
  if (cut) cut.skip();
  settleWalk();
  submitting = true; render(); audio.sfx('send');
  const turn = S.turn, me = hero(draft), roll = draft.rollWant || 0;
  const body = S.you === 'director' ? { turn, scene: finalScene(), roll }
    : { answer: draft.reply, act: draft.act, exit: draft.exit, turn, x: me && me.x, y: me && me.y, say: me ? me.say : '', emote: me ? me.emote : '', action: draft.action, target: draft.target, use: draft.use, roll, track: draft.heroTrack };
  try { await act('submit', body, 6); } catch (e) {
    if (S && S.turn === turn) { submitting = false; toast(e.message); render(); }
  }
}

/* ---------- stage input ---------- */
const stage = $('#stage');
const heroTurn = () => myTurn() && S.you === "player" && !submitting;
const heroStart = () => hero(S.scene);            // where the hero stood when the Player's turn began
const stageOpts = () => ({
  code, names: S.names, selId: directing() ? selId : null, pendingRoll: heroTurn() ? draft.rollWant || (draft.reply && draft.reply.roll ? draft.ask.sides : 0) : 0, noAct: heroTurn() && S.rules.player === 'tell',
  camFrame: directing(), pickId: heroTurn() && draft.reply ? draft.reply.id : null, pickPlace: heroTurn() && draft.reply ? draft.reply.index : null,
  dest: heroTurn() && draft.walked && draft.heroTrack ? { x: draft.heroTrack[draft.heroTrack.length - 2], y: draft.heroTrack[draft.heroTrack.length - 1] } : null,
});

/* ---------- the Player's walk: press Walk, click where to go; once per turn ---------- */
function stopWalkAnim() { cancelAnimationFrame(walkAnim); walkAnim = 0; }
/** Send the hero to (x,y). It finds its own way around walls and solid things and walks there at an easy pace. */
function walkHero(x, y) {
  const me = hero(draft), st = heroStart() || me;
  const track = findWalk(draft, st.x, st.y, x, clamp(y, 0.08, 1));
  walkMode = false;
  if (!track) { toast('There is no way to get there'); return render(); }
  draft.heroTrack = track; draft.walked = true;
  const end = track[track.length - 3], t0 = performance.now(), fx = track[track.length - 2], fy = track[track.length - 1];
  const frame = () => {                                     // show the walk right away; the Director sees the same on their turn
    const t = performance.now() - t0, p = sample(track, t);
    if (t >= end || !p) { me.x = fx; me.y = fy; walkAnim = 0; return changed(); }
    me.x = p[0]; me.y = p[1]; paint();
    walkAnim = requestAnimationFrame(frame);
  };
  stopWalkAnim(); me.x = fx; me.y = fy; saveDraft(); uiKey = ''; render();
  me.x = st.x; me.y = st.y; walkAnim = requestAnimationFrame(frame);
}
function undoWalk() {
  const me = hero(draft), st = heroStart();
  stopWalkAnim();
  if (me && st) { me.x = st.x; me.y = st.y; }
  draft.heroTrack = null; draft.walked = false; rebuild();
}
/** The Player's answer to what the Director asked; also mirrored into the draft so the stage previews it. */
function setReply(r) {
  const ask = draft.ask || {};
  draft.reply = r;
  draft.answer = null;
  if (ask.kind === 'target' || ask.kind === 'battle') draft.target = null;
  if (!r) return;
  if (ask.kind === 'place') draft.answer = { kind: 'place', label: ask.places[r.index].label };
  if (ask.kind === 'discard') { const it = draft.sheet.inv.find((i) => i.id === r.id); if (it) draft.answer = { kind: 'discard', asset: it.asset, name: it.name }; }
  if (ask.kind === 'target') { draft.answer = { kind: 'target', verb: ask.verb || 'chooses' }; draft.target = r.id; }
  if (ask.kind === 'battle') { draft.answer = { kind: 'battle', move: r.move }; draft.target = r.move === 'attack' ? r.id : null; }
}
/* ---------- active objects: hover shows the name, a click offers what the Director allowed ---------- */
function hideVerbs() { const v = $('#verbs'); if (v) v.remove(); }
function showVerbs(e, ev) {
  const wrap = $('#stageWrap'), r = wrap.getBoundingClientRect();
  wrap.append(h('div', { id: 'verbs', style: `left:${Math.min(ev.clientX - r.left, r.width - 220)}px;top:${Math.max(4, ev.clientY - r.top - 70)}px` }, h('b', {}, e.active.name),
    e.active.verbs.map((v) => h('button', { onclick: () => { draft.act = { id: e.id, verb: v }; draft.target = e.id; draft.verb = v; hideVerbs(); rebuild(); } }, v)),
    h('button', { class: 'link', onclick: hideVerbs }, 'never mind')));
}
/** Before sending the turn: a walk still being shown jumps to its end. */
function settleWalk() {
  if (!walkAnim) return;
  stopWalkAnim();
  const me = hero(draft), tr = draft.heroTrack;
  if (me && tr) { me.x = tr[tr.length - 2]; me.y = tr[tr.length - 1]; }
}
let drag = null;
function stagePos(ev) {
  const r = stage.firstElementChild.getBoundingClientRect();   // the world layer: correct even while the camera is zoomed in
  return { x: clamp((ev.clientX - r.left) / r.width, 0, 1), y: clamp((ev.clientY - r.top) / r.height, 0, 1) };
}
const dropTrack = (id) => { draft.tracks = draft.tracks.filter((t) => t.id !== id); };
const tracksEnd = () => Math.max(0, ...draft.tracks.map((t) => t.pts[t.pts.length - 3]));
const trackEnd = (id) => { const t = draft.tracks.find((x) => x.id === id); return t ? t.pts[t.pts.length - 3] : 0; };

stage.addEventListener('pointerdown', (ev) => {
  if (cut) return void cut.skip();
  if (!myTurn() || submitting) return;
  ev.preventDefault();
  if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) document.activeElement.blur();
  const p = stagePos(ev);
  const el = ev.target.closest('.ent');
  const hit = el && draft.entities.find((x) => x.id === el.dataset.id);
  drag = null;
  if (S.you === 'player') {
    const me = hero(draft);
    if (S.rules.player === 'tell') return toast('In this story you write what you want to do, and the Director makes it happen');
    if (!me) return toast('You have no character on stage right now — speak or act instead');
    hideVerbs();
    const exitEl = ev.target.closest('.exit'), placeEl = ev.target.closest('.place'), ask = draft.ask;
    if (exitEl && !walkMode) {                                     // a way out to another place
      const ex = draft.exits.find((x) => x.id === exitEl.dataset.exit);
      if (ex.locked) return toast(`“${ex.label}” is locked`);
      draft.exit = draft.exit === ex.id ? null : ex.id;
      if (draft.exit && !draft.walked) return walkHero(ex.x, ex.y);
      return changed();
    }
    if (placeEl && ask && ask.kind === 'place' && !walkMode) {    // one of the places the Director marked
      const i = Number(placeEl.dataset.place);
      setReply({ index: i });
      if (!draft.walked) return walkHero(ask.places[i].x, ask.places[i].y);
      return changed();
    }
    if (walkMode) return walkHero(p.x, p.y);
    if (hit && hit !== me) {
      if (ask && ask.kind === 'target' && ask.targets.includes(hit.id)) { setReply({ id: hit.id }); return rebuild(); }
      if (ask && ask.kind === 'battle' && hit.hp != null) { setReply({ move: 'attack', id: hit.id }); return rebuild(); }
      if (draft.use) { draft.target = draft.target === hit.id ? null : hit.id; draft.act = null; draft.verb = ''; return changed(); }   // use the chosen item ON this
      if (hit.active && hit.active.verbs.length) return showVerbs(hit, ev);                                             // an active object: what to do with it?
      if (mods().inventory && S.rules.player === 'free') { draft.target = draft.target === hit.id ? null : hit.id; draft.act = null; draft.verb = ''; return changed(); }   // reach for it
    }
    return toast(draft.walked ? 'You have already walked this turn' : 'Press “Walk”, then click where you want to go');
  } else if (drawOn) {
    if (draft.drawing.length >= 60) return toast('That is a lot of drawing — clear some first');
    drag = { stroke: { id: rid(), c: pen.c, w: pen.w, pts: [r3(p.x), r3(p.y)] } };
    draft.drawing.push(drag.stroke);
  } else {
    const mark = ev.target.closest('.exit, .place');                // exits and marked places can be dragged too
    if (mark) {
      const obj = mark.dataset.exit ? draft.exits.find((x) => x.id === mark.dataset.exit) : draft.ask.places[Number(mark.dataset.place)];
      drag = { e: obj, dx: obj.x - p.x, dy: obj.y - p.y, mark: true };
      if (mark.dataset.exit) guidedMark(mark.dataset.exit);
      uiKey = ''; stage.setPointerCapture(ev.pointerId); return render();
    }
    selId = hit ? hit.id : null; selInv = null;
    if (hit) guidedPick(hit.id);                                    // answers "which one?", or opens that thing's tools
    uiKey = '';
    if (hit) {
      drag = { e: hit, dx: hit.x - p.x, dy: hit.y - p.y };
      if (rec) {
        const off = trackEnd(hit.id);                                // a thing's moves follow each other; different things move together
        if (off >= 10000) { toast('This one already moves for the full 10 seconds of the step'); drag = null; } else drag.take = { t0: performance.now(), off, last: off, pts: [off, r3(hit.x), r3(hit.y)] };
      }
    }
  }
  if (drag) stage.setPointerCapture(ev.pointerId);
  render();
});
stage.addEventListener('pointermove', (ev) => {
  if (!drag) return;
  const p = stagePos(ev);
  if (drag.stroke) {
    const s = drag.stroke.pts, n = s.length;
    if (n < 400 && Math.hypot(p.x - s[n - 2], p.y - s[n - 1]) > 0.006) s.push(r3(p.x), r3(p.y));
    return paint();
  }
  const par = drag.e.tie && draft.entities.find((x) => x.id === drag.e.tie.to);
  if (par) {                                                        // a tied thing: dragging changes how it is held
    drag.e.tie.dx = r3(clamp(((p.x - par.x) / par.scale) * (par.flip ? -1 : 1), -1, 1)); drag.e.tie.dy = r3(clamp((p.y + 0.04 - par.y) / par.scale, -1, 1));
    return paint();
  }
  drag.e.x = clamp(p.x + drag.dx, 0, 1); drag.e.y = clamp(p.y + drag.dy, 0.08, 1);
  if (drag.mark) return paint();
  const tk = drag.take;
  if (tk) {
    const t = Math.round(tk.off + performance.now() - tk.t0);
    if (t >= 10000) return endDrag();
    if (t - tk.last >= 50) { tk.pts.push(t, r3(drag.e.x), r3(drag.e.y)); tk.last = t; }
  } else if (S.you === 'director' && !drag.dropped) { drag.dropped = true; dropTrack(drag.e.id); }
  paint();
});
function endDrag() {
  if (!drag) return;
  const d = drag; drag = null;
  if (d.take) {                                                     // store the recorded move
    const tk = d.take, t = Math.min(10000, Math.round(tk.off + performance.now() - tk.t0));
    tk.pts.push(Math.max(t, tk.last + 1), r3(d.e.x), r3(d.e.y));
    storeTrack(d.e.id, tk.off, tk.pts);
    uiKey = '';
  }
  if (d.stroke) { if (d.stroke.pts.length < 4) d.stroke.pts.push(d.stroke.pts[0], d.stroke.pts[1]); uiKey = ''; }
  if (myTurn()) changed();
}
function storeTrack(id, off, pts) {
  const old = draft.tracks.find((x) => x.id === id);
  if (old && old.pts[old.pts.length - 3] <= off) old.pts.push(...pts); else { dropTrack(id); draft.tracks.push({ id, pts }); }
}
/** A ready-made move: steps are [milliseconds, x, y]. It follows that thing's earlier moves in this step. */
function autoTrack(e, steps) {
  const off = trackEnd(e.id); let t = off;
  const pts = [off, r3(e.x), r3(e.y)];
  for (const [dt, x, y] of steps) {
    t += dt;
    if (t > 10000) break;
    pts.push(Math.round(t), r3(clamp(x, 0, 1)), r3(clamp(y, 0.08, 1)));
  }
  if (pts.length < 6) { toast('This one already moves for the full 10 seconds of the step'); return false; }
  storeTrack(e.id, off, pts);
  e.x = pts[pts.length - 2]; e.y = pts[pts.length - 1];
  return true;
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

/** Play the turn as the Player will see it: every step in order, starting from how the turn began. */
function previewCut() {
  if (cut) return cut.skip();
  audio.unlock();
  cut = playTurn(stage, S.scene, finalScene(), { ...stageOpts(), selId: null, camFrame: false, by: 'director', sfx: audio.sfx, who: '▶ Preview' }, () => { cut = null; render(); });
  render();
}

/* ---------- chrome: top bar, banner, clock ---------- */
function shareLink() {
  const url = location.origin + location.pathname + '#' + code;
  if (navigator.share) navigator.share({ title: 'Twofold', text: 'Join my story on Twofold', url }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Invite link copied'), () => prompt('Copy this invite link', url));
  else prompt('Copy this invite link', url);
}
function renderChrome() {
  if (!S) return;
  const who = (role, icon) => h('span', { class: 'who' + (S.you === role && !S.hotseat ? ' me' : '') + (!S.ended && S.whose === role ? ' turn' : '') },
    h('i', { class: 'dot' + (S.online[role] ? ' on' : '') }), (S.bot === role ? '🤖' : icon) + ' ', h('b', {}, S.joined[role] ? S.names[role] : '…'));
  $('#top').replaceChildren(
    who('director', '🎬'), who('player', '🧑'), h('span', { class: 'grow storyname' }, S.info.title ? `“${S.info.title}”` : ''),
    h('button', { class: 'code', 'aria-label': 'Copy the invite link', title: 'Copy the invite link', onclick: () => { navigator.clipboard && navigator.clipboard.writeText(location.href).then(() => toast('🔗 Invite link copied'), () => {}); } }, '🔗 ' + code),
    h('button', { onclick: openStory, 'aria-label': 'Story so far', title: 'Story so far' }, '📖'),
    h('button', { onclick: (e) => { audio.unlock(); e.currentTarget.textContent = audio.cycle(); audio.sfx('pop'); }, 'aria-label': 'Sound', title: 'Sound: loud, quiet, off' }, audio.icon));

  const b = $('#banner'); let content = null;
  if (!connected) content = ['📡 Reconnecting…'];
  else if (S.ended) content = ['🎬 The End.', h('button', { onclick: openStory }, 'Read the story')];
  else if (S.hotseat) content = [`🎭 You play both sides — now you are the ${S.whose === 'director' ? 'Director' : 'Player'}`];
  else if (S.you === 'spectator') content = ['👀 You are watching this story.'];
  else if (!S.joined[other()]) content = [`Invite your ${other() === 'player' ? 'Player' : 'Director'} — code ${code}`, h('button', { class: 'primary', onclick: shareLink }, 'Share link')];
  else if (!S.online[other()]) content = [`⏸ ${S.names[other()]} is offline${S.paused ? ' — the clock is paused' : ''}`];
  b.hidden = !content;
  if (content) b.replaceChildren(...content.map((c) => (typeof c === 'string' ? h('span', {}, c) : c)));
}
let lastTick = 0;
function tick() {
  if (!S || !code) return;
  const bar = $('#clock i'), lab = $('#tlabel');
  if (S.remainingMs == null || S.ended) { bar.style.width = '0'; if (lab) lab.textContent = ''; return; }
  const full = S.settings.turnSeconds * 1000 || 1;
  const r = S.paused ? S.remainingMs : Math.max(0, localDeadline - performance.now());
  bar.style.width = Math.min(100, (r / full) * 100) + '%';
  bar.className = r < 10000 ? 'low' : '';
  const sec = Math.ceil(r / 1000);
  if (!S.paused && myTurn() && sec <= 5 && sec > 0 && sec !== lastTick) { lastTick = sec; audio.sfx('tick'); }
  if (lab) lab.textContent = ' · ' + fmt(Math.min(r, full)) + (S.paused ? ' ⏸' : '');
  if (r <= 0 && !S.paused && myTurn() && !submitting && autoTurn !== S.turn) { autoTurn = S.turn; submit(); }
}
setInterval(tick, 250);

/* ---------- main render ---------- */
function render() {
  if (!S) return;
  const ts = $('#titleScreen'), showTitle = S.turn === 0 && !(myTurn() && S.you === 'director') && !!(S.info.title || S.info.text);
  ts.hidden = !showTitle;
  if (showTitle) ts.replaceChildren(h('h2', {}, S.info.title || 'A new story'), S.info.text && h('p', {}, S.info.text), h('small', {}, `${S.names.director} is setting the stage…`));
  const tool = directing() ? guidedTool() : '';          // the stage tool always follows the open Director screen
  rec = tool === 'rec'; drawOn = tool === 'draw';
  const scene = shown();
  paint();
  stage.classList.toggle('edit', myTurn() && !cut);
  stage.classList.toggle('drawing', directing() && drawOn);
  stage.classList.toggle('walking', heroTurn() && walkMode);
  audio.setMood(scene.mood);
  renderChrome();
  renderSheet();
  const key = [S.you, S.turn, S.whose, S.ended, S.joined.player, S.joined.director, submitting, selId, selInv, S.assets.length, S.settings.turnSeconds,
    JSON.stringify(S.rules), rec, drawOn, walkMode, myTurn() && draft.walked, !!cut, myTurn() && draft.target, myTurn() && draft.use, myTurn() && JSON.stringify([draft.reply, draft.act, draft.exit]), myTurn() && draft.steps.length, guidedKey()].join('|');
  if (workshopOpen()) return;                              // the workshop has the tools while it is open
  if (key !== uiKey) { uiKey = key; buildPanel(); buildFoot(); } else refreshMarks();
  tick();
}
function refreshMarks() {
  for (const b of document.querySelectorAll('[data-mark]')) {
    const i = b.dataset.mark.indexOf('=');
    b.classList.toggle('on', String(draft[b.dataset.mark.slice(0, i)] ?? '') === b.dataset.mark.slice(i + 1));
  }
}

/* ---------- character sheet bar: stats + inventory ---------- */
function renderSheet() {
  const el = $('#sheet'), sc = shown(), m = mods(), edit = directing(), play = myTurn() && S.you === 'player' && !submitting;
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
        class: 'chip item' + (sc.use === it.id || (edit && selInv === it.id) ? ' on' : ''), title: it.name || 'item',
        disabled: !(edit || play),
        onclick: () => { if (edit) { selInv = selInv === it.id ? null : it.id; selId = null; render(); } else { draft.use = draft.use === it.id ? null : it.id; changed(); } },
      }, glyphNode(code, it.asset)));
    }
    if (!sc.sheet.inv.length) kids.push(h('span', { class: 'dim small' }, edit ? 'empty — select something on stage and tap “Give”' : 'empty'));
  }
  el.hidden = !kids.length;
  el.replaceChildren(...kids.filter(Boolean));
}
function giveToPlayer(e) {
  if (draft.sheet.inv.length >= 24) return toast('The inventory is full');
  draft.sheet.inv.push({ id: rid(), asset: e.asset, name: assetName(e.asset) });
  removeEntity(e);
}
function removeEntity(e) {
  draft.entities = draft.entities.filter((x) => x !== e); dropTrack(e.id);
  if (draft.heroId === e.id) draft.heroId = null;
  if (draft.target === e.id) draft.target = null;
  if (selId === e.id) selId = null;
}
function setRules(patch) {
  const rules = { ...S.rules, ...patch };
  if (rules.modules.stats && !draft.sheet.stats.length) draft.sheet.stats = [{ id: rid(), name: '❤️ Health', value: 5, max: 5 }, { id: rid(), name: '💰 Gold', value: 0, max: null }];
  S.rules = rules; saveDraft(); render();
  act('settings', { rules }, 3).catch((e) => toast(e.message));
}

/* ---------- panel ---------- */
function recap(scene) {
  const lines = [];
  if (scene.narration) lines.push(h('div', {}, h('i', {}, scene.narration)));
  for (const e of scene.entities) if (e.say) lines.push(h('div', {}, glyphNode(code, e.asset, 'mini'), ' “' + e.say + '”'));
  return lines.length ? h('div', { class: 'card recap' }, lines) : null;
}
const chips = (list, key, onPick) => h('div', { class: 'chips wrap' }, list.map(([v, label]) => h('button', {
  'data-mark': `${key}=${v}`, class: String(draft[key] ?? '') === String(v) ? 'on' : '', onclick: () => { draft[key] = v; if (onPick) onPick(v); changed(); } }, label)));

const PLAYER_MODES = [
  { id: 'free', label: '🕹️ Free will', hint: 'The Player walks their hero (once per turn), speaks, and types what they do.' },
  { id: 'limited', label: '🎯 Limited will', hint: 'The Player must pick one of the options you offer each turn. They can still walk and speak.' },
  { id: 'tell', label: '📝 Narration', hint: 'The Player only writes what they want to do. Nothing moves until you stage it.' },
];
function typeCard() {
  const r = S.rules;
  return h('div', { class: 'card' }, h('h3', {}, 'Story type'),
    h('p', {}, h('b', {}, TYPES.find((t) => t.id === r.type).label), h('span', { class: 'dim small' }, '  — chosen when the story was created')),
    h('p', { class: 'dim small' }, 'Layers can be switched on and off at any time:'),
    h('div', { class: 'chips wrap' }, MODULES.map((m) => h('button', { class: r.modules[m.id] ? 'on' : '', title: m.hint, onclick: () => setRules({ modules: { ...r.modules, [m.id]: !r.modules[m.id] } }) }, m.label))),
    h('h3', {}, `How ${S.names.player} plays`),
    h('div', { class: 'chips wrap' }, PLAYER_MODES.map((m) => h('button', { 'data-pmode': m.id, class: r.player === m.id ? 'on' : '', title: m.hint, onclick: () => setRules({ player: m.id }) }, m.label))),
    h('p', { class: 'dim small' }, PLAYER_MODES.find((m) => m.id === r.player).hint));
}

function buildPanel() {
  const p = $('#panel'); p.replaceChildren();
  if (S.ended) return void p.append(h('div', { class: 'card' }, h('h3', {}, 'The story has ended'), h('p', { class: 'dim' }, 'Flip through it together, or start a new one.')), recap(S.scene) || '');
  if (!myTurn() || S.you !== 'director') {
    const tips = S.you === 'spectator' ? null
      : myTurn() ? ['Your turn', S.rules.player === 'tell' ? `Write what you want to do. ${S.names.director} will make it happen on the stage, and you will see it play out.`
        : S.rules.player === 'limited' ? `Choose one of ${S.names.director}’s options. You can also walk once and add a line of speech.`
          : `Press “Walk” and click where your hero should go (once per turn).${mods().inventory ? ' Click a thing to reach for it, or a 🎒 item to use it.' : ''} Then say something, do something — or both — and end your turn.`]
        : S.you === 'player' ? [S.turn === 0 ? `${S.names.director} is setting the stage…` : `${S.names.director} is deciding what happens…`, 'The whole world is in their hands. Watch the stage.']
          : [`${S.names.player} is making a move…`, 'When they finish you can change anything: the cast, the place, the music, what everybody says.'];
    if (S.info.text && S.you !== 'director') p.append(h('div', { class: 'card', id: 'howto' }, h('h3', {}, '📜 ' + (S.info.title || 'How to play')), h('p', { class: 'pre' }, S.info.text)));
    if (tips) p.append(h('div', { class: 'card' }, h('h3', {}, tips[0]), h('p', { class: 'dim' }, tips[1])));
    if (S.you === 'director') p.append(h('button', { id: 'wsOpen', onclick: showWorkshop }, '🛠️ Scene workshop — prepare scenes while you wait'));
    const r = recap(S.scene); if (r) p.append(r);
    return;
  }

  buildGuided(p, guidedCtx);
}
const guidedCtx = {
  get draft() { return draft; }, get S() { return S; }, get code() { return code; },
  pen, workshop: (o) => showWorkshop(o), useScene: (doc) => useScene(doc, false), travelTo: (id) => travelTo(id), rid,
  select(id) { selId = id || null; },
  nextStep, resetStep, clearSteps, gotoStep, stepEmpty, canUndo, undo, saveAsScene: () => saveAsScene(),
  cutting: () => !!cut, preview: () => previewCut(), mods: () => mods(), trackEnd: (id) => trackEnd(id), dropTrack: (id) => dropTrack(id),
  toast, act, audio, rebuild: () => rebuild(), changed: () => changed(), changedQuiet: () => changedQuiet(),
  addEntity: (a) => addEntity(a), removeEntity: (e) => removeEntity(e), giveToPlayer: (e) => giveToPlayer(e), autoTrack: (e, st) => autoTrack(e, st),
  maker: (k, f) => maker(k, f), randomScene: () => randomScene(), typeCard: () => typeCard(), setRules: (r) => setRules(r),
  setInfo: (info) => { S.info = info; act('settings', { info }, 3).catch((e) => toast(e.message)); },
  shareLink: () => shareLink(), openStory: () => openStory(), leave: () => leave(), idea: () => toast('💡 ' + IDEAS[Math.floor(Math.random() * IDEAS.length)]),
};
/* ---------- prepared scenes and the scene workshop ---------- */
const blankHero = () => ({ id: 'hero', asset: (hero(S.scene) || { asset: 'p:hero' }).asset, x: 0.5, y: 0.8, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '', solid: false });
/** Put a prepared scene (or the workshop's edit of the live one) on the stage, as part of the current step. */
function useScene(doc, live) {
  const src = doc.scene, me = hero(draft), at = src.entities.find((e) => e.id === src.heroId);
  const carried = me && !live ? draft.entities.filter((e) => e.tie && e.tie.to === me.id) : [];   // what the hero holds comes along
  const cameFrom = draft.sceneId;
  Object.assign(draft, { backdrop: src.backdrop, mood: src.mood, weather: src.weather, level: clone(src.level), tracks: [], exits: clone(src.exits || []), sceneId: live ? draft.sceneId : doc.id, cam: null });
  if (!live) draft.drawing = [];
  draft.entities = src.entities.filter((e) => e.id !== src.heroId).map((e) => ({ ...clone(e), id: live ? e.id : rid(), say: live ? e.say : '' }));
  if (me) {
    const door = !live && cameFrom && draft.exits.find((x) => x.to === cameFrom);   // arrive at the way back to where they came from
    if (door) { me.x = clamp(door.x + (door.x < 0.5 ? 0.08 : -0.08), 0.04, 0.96); me.y = clamp(door.y + (door.y < 0.3 ? 0.14 : 0.05), 0.1, 1); } else if (at) { me.x = at.x; me.y = at.y; }
    draft.entities.push(me, ...carried);
  }
  selId = null; rebuild();
}
/** The Player goes through an exit: bring in the scene behind it with a "Traveling to" moment. */
function travelTo(sceneId) {
  const doc = (S.scenes || []).find((d) => d.id === sceneId);
  if (!doc) { toast('That exit does not lead to a prepared scene yet — set it in the scene workshop'); return null; }
  useScene(doc, false);
  draft.travel = doc.name; draft.exit = null;
  rebuild();
  return doc;
}
/** Keep the scene on stage as a prepared scene, to come back to or to connect on the map. */
function saveAsScene() {
  const name = (prompt('Name for this scene', `Scene ${(S.scenes || []).length + 1}`) || '').trim().slice(0, 40);
  if (!name) return;
  const scene = norm({ ...clone(draft), ...clone(ONE_STEP), ...PLAYERS, steps: [], narration: '', choices: [], ask: null, cam: null, battle: null, said: undefined, rollWant: undefined });
  for (const e of scene.entities) { e.say = ''; e.once = ''; }
  const doc = { id: rid(), name, mx: 0.5, my: 0.5, scene };
  S.scenes = [...(S.scenes || []), doc];
  if (!draft.sceneId) draft.sceneId = doc.id;                 // the stage now "is" that scene on the map
  act('saveScenes', { scenes: S.scenes }, 3).then(() => toast(`Saved “${name}” to your prepared scenes`), (e) => toast(e.message));
  rebuild();
}
function showWorkshop(o = {}) {
  const can = directing();
  const live = can ? { id: 'live', name: 'The scene on stage now', live: true, scene: norm({ ...clone(draft), steps: [], tracks: [], said: undefined }) } : null;
  $('#panel').replaceChildren(); resetGuided();              // the same tools now work on the workshop's scene
  openWorkshop({
    code, names: S.names, scenes: clone(S.scenes || []), live, blankHero, toast, audio, adventure: S.rules.type === 'adventure', map: !!o.map,
    rules: S.rules, assets: S.assets, maker: (k, f) => maker(k, f),
    save: (scenes) => { S.scenes = clone(scenes); return act('saveScenes', { scenes }, 3).catch((e) => toast(e.message)); },
    use: can ? (doc) => useScene(doc, !!doc.live) : null,
    closed: () => { resetGuided(); if (directing()) guidedStart(draft); uiKey = ''; render(); },
  });
}

function addEntity(asset) {
  if (draft.entities.length >= 80) return void toast('The stage is full');
  let best = null;                                   // drop it on the freest spot of the ground, not on top of someone
  for (let i = 0; i < 24; i++) {
    const x = 0.1 + Math.random() * 0.8, y = 0.62 + Math.random() * 0.3;
    const gap = Math.min(9, ...draft.entities.map((o) => Math.hypot(o.x - x, (o.y - y) * 0.75)));
    if (!best || gap > best.gap) best = { x, y, gap };
  }
  const e = { id: rid(), asset, x: best.x, y: best.y, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '' };
  draft.entities.push(e); selId = e.id; selInv = null;
  return e;
}
async function randomScene() {
  try {
    const { place } = await act('randomScene', {}, 2);
    const me = hero(draft);
    draft.entities = [...place.entities, ...(me ? [me] : [])];
    Object.assign(draft, { backdrop: place.backdrop, mood: place.mood, weather: place.weather, card: place.card, narration: place.narration, tracks: [], drawing: [] });
    if (me) { me.x = 0.3; me.y = 0.82; }
    selId = null; rebuild();
    return true;
  } catch (e) { toast(e.message); return false; }
}

/** Upload-or-generate box. Both paths end in a custom asset stored with the story. */
function maker(kind, onAsset) {
  const what = kind === 'backdrop' ? 'backdrop' : 'character or thing';
  const done = (r) => { uiKey = ''; onAsset(r.asset.id); };
  const file = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async () => {
    if (!file.files[0]) return;
    try { const f = file.files[0]; done(await act('addAsset', { kind, name: f.name.replace(/\.\w+$/, ''), dataUrl: await fileToDataUrl(f, kind) })); } catch (e) { toast(e.message); }
    file.value = '';
  } });
  const promptEl = h('input', { placeholder: `Describe a ${what}…`, maxlength: 200, enterkeyhint: 'go' });
  const go = h('button', { onclick: async () => {
    if (!promptEl.value.trim()) return promptEl.focus();
    go.disabled = true; go.textContent = '…';
    try { done(await act('generate', { kind, prompt: promptEl.value })); } catch (e) { toast(e.message); go.disabled = false; go.textContent = '✨ Create'; }
  } }, '✨ Create');
  return h('div', { class: 'maker' },
    h('div', { class: 'row' }, promptEl, go),
    h('div', { class: 'row' }, h('button', { class: 'grow', onclick: () => file.click() }, '📷 Use a photo or image'), file),
    h('p', { class: 'hint' }, 'Created assets stay with this story.'));
}
async function fileToDataUrl(f, kind) {
  const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('Could not read that image')); i.src = URL.createObjectURL(f); });
  const c = document.createElement('canvas');
  if (kind === 'backdrop') {
    c.width = 640; c.height = 480;
    const s = Math.max(640 / img.width, 480 / img.height);
    c.getContext('2d').drawImage(img, (640 - img.width * s) / 2, (480 - img.height * s) / 2, img.width * s, img.height * s);
    return c.toDataURL('image/jpeg', 0.8);
  }
  const s = Math.min(1, 200 / Math.max(img.width, img.height));
  c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/png');
}

/* ---------- footer: what I say / narrate, and the End turn button ---------- */
function buildFoot() {
  const f = $('#foot'); f.replaceChildren(); f.classList.remove('tight');
  const tl = () => h('span', { id: 'tlabel' });
  const side = S.hotseat ? (S.whose === 'director' ? 'Director' : 'Player') + '’s ' : '';
  if (S.ended) return void f.append(h('button', { class: 'go primary', onclick: openStory }, '📖 Read the story'), h('button', { class: 'link', onclick: () => leave() }, 'Start a new story'));
  if (S.you === 'spectator') return void f.append(h('div', { class: 'status' }, `${S.names[S.whose]}'s turn`, tl()));
  if (!myTurn()) return void f.append(h('div', { class: 'status' }, `⏳ Waiting for ${S.joined[other()] ? S.names[other()] : 'your partner'}`, tl()));
  if (submitting) return void f.append(h('div', { class: 'status' }, 'Sending…'));
  if (S.you === 'director') {
    const ready = S.joined.player;
    f.append(
      h('button', { class: 'go primary', disabled: !ready, onclick: submit }, ready ? (S.turn === 0 ? 'Begin the story ▶' : `End ${side}turn ▶`) : 'Waiting for your Player to join…', tl()));
    f.classList.add('tight');
  } else {
    const me = hero(draft), mode = S.rules.player;
    const dice = mods().dice && h('button', { class: 'dice' + (draft.rollWant ? ' on' : ''), title: 'Roll a die with this turn', onclick: () => { draft.rollWant = draft.rollWant === 0 ? 6 : draft.rollWant === 6 ? 20 : 0; rebuild(); } }, draft.rollWant ? `🎲 d${draft.rollWant}` : '🎲');
    const walkBtn = mode !== 'tell' && me && (draft.walked
      ? h('button', { id: 'walkBtn', class: 'grow', onclick: undoWalk }, '↶ Take the walk back')
      : h('button', { id: 'walkBtn', class: 'grow' + (walkMode ? ' recording' : ''), onclick: () => { walkMode = !walkMode; render(); } }, walkMode ? 'Click on the stage where to go…' : '🚶 Walk'));
    const end = (off) => h('div', { class: 'row' }, dice, h('button', { class: 'go primary grow', disabled: !!off, onclick: submit }, `End ${side}turn ▶`, tl()));
    const say = () => h('input', { placeholder: '💬 Say something…', maxlength: 160, value: me ? me.say : '', disabled: !me, enterkeyhint: 'next', oninput: (ev) => { me.say = ev.target.value; changedQuiet(); } });
    const pick = () => h('div', { class: 'chips wrap choices' }, draft.choices.map((c) => h('button', { class: draft.action === c ? 'on' : '', onclick: () => { draft.action = draft.action === c ? '' : c; rebuild(); } }, c)));
    const ask = draft.ask, rp = draft.reply || {};
    let asked = null, answered = true;
    if (ask && mode !== 'tell') {                        // the Director asked for something specific
      const opt = (label, on, fn) => h('button', { class: on ? 'on' : '', onclick: () => { fn(); rebuild(); } }, label);
      const lab = (id) => { const e = draft.entities.find((x) => x.id === id); return e ? (e.active ? e.active.name : glyphNode(code, e.asset, 'mini')) : '?'; };
      let body;
      if (ask.kind === 'roll') { answered = !!rp.roll; body = opt(`🎲 Roll the d${ask.sides}${ask.dc ? ` — you need ${ask.dc} or more` : ''}`, rp.roll, () => { setReply(rp.roll ? null : { roll: true }); }); }
      else if (ask.kind === 'discard') { answered = !!rp.id || !draft.sheet.inv.length; body = draft.sheet.inv.length ? draft.sheet.inv.map((it) => opt(glyphNode(code, it.asset, 'mini'), rp.id === it.id, () => { setReply({ id: it.id }); })) : h('span', { class: 'dim' }, 'You have nothing to give up.'); }
      else if (ask.kind === 'place') { answered = rp.index != null; body = ask.places.map((pl, i) => opt('📍 ' + pl.label, rp.index === i, () => { setReply({ index: i }); if (!draft.walked) setTimeout(() => walkHero(pl.x, pl.y), 0); })); }
      else if (ask.kind === 'target') { answered = !!rp.id; body = ask.targets.map((id) => opt(lab(id), rp.id === id, () => { setReply({ id }); })); }
      else {
        answered = !!rp.move;
        body = [...draft.entities.filter((e) => e.hp != null && e.id !== draft.heroId).map((e) => opt(['⚔️ Attack ', lab(e.id)], rp.move === 'attack' && rp.id === e.id, () => { setReply({ move: 'attack', id: e.id }); })),
          opt('🛡️ Defend', rp.move === 'defend', () => { setReply({ move: 'defend' }); }), opt('🏃 Flee', rp.move === 'flee', () => { setReply({ move: 'flee' }); })];
      }
      const def = { roll: 'Roll the die.', discard: 'Give up one of your things.', place: 'Where do you go?', target: `${ask.verb || 'Choose'} — who or what?`, battle: 'Battle! What do you do?' }[ask.kind];
      asked = h('div', { class: 'askbox' }, h('b', {}, ask.text || def), h('div', { class: 'chips wrap choices' }, body));
    }
    const must = mode === 'limited' && ask && ask.kind !== 'battle' && !answered;
    if (mode === 'tell') {                               // narration: only words; the Director stages them
      const ta = h('textarea', { id: 'tellBox', rows: 3, maxlength: 300, placeholder: `✍️ What do you want to do? ${S.names.director} will make it happen.` }, draft.action);
      ta.addEventListener('input', () => { draft.action = ta.value; saveDraft(); });
      f.append(ta, end());
    } else if (mode === 'limited' && draft.choices.length) {   // limited will: one of the Director's options
      f.append(h('div', { class: 'dim small' }, `Choose what you do — ${S.names.director} decided the options:`), pick(), asked, say(), walkBtn, end(!draft.choices.includes(draft.action) || must));
    } else if (mode === 'limited' && ask) {              // limited will: do exactly what was asked
      f.append(asked, say(), ask.kind === 'place' ? null : walkBtn, end(must));
    } else {
      if (asked) f.append(asked);
      if (draft.choices.length) f.append(pick());
      if (me) f.append(h('div', { class: 'chips emotes' }, EMOTES.slice(0, 8).map((e) => h('button', { class: me.emote === e ? 'on' : '', 'aria-label': 'Emote ' + e, onclick: () => { me.emote = me.emote === e ? '' : e; rebuild(); } }, e))));
      f.append(say(),
        h('input', { placeholder: '✋ Do something… (“open the drawer”)', maxlength: 160, value: draft.action, enterkeyhint: 'done', oninput: (ev) => { draft.action = ev.target.value; changedQuiet(); } }),
        walkBtn, end());
    }
  }
}

/* ---------- keyboard (computers) ---------- */
document.addEventListener('keydown', (ev) => {
  if (!S || !code || !$('#story').hidden || workshopOpen()) return;
  if (ev.key === 'Escape' && walkMode) { walkMode = false; return render(); }
  const typing = /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName);
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z' && !typing && directing()) { ev.preventDefault(); return undo(); }
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'd' && !typing && directing() && selId) { ev.preventDefault(); const src = draft.entities.find((e) => e.id === selId); if (src) { const k = { ...clone(src), id: rid(), x: clamp(src.x + 0.08, 0, 1), say: '' }; draft.entities.push(k); selId = k.id; guidedPick(k.id); rebuild(); } return; }
  if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); submit(); } else if (ev.key === 'Escape' && cut) cut.skip();
  else if (!typing && directing() && selId) {
    const sel = draft.entities.find((e) => e.id === selId); if (!sel) return;
    const step = ev.shiftKey ? 0.05 : 0.01;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[ev.key]) { sel.x = clamp(sel.x + moves[ev.key][0], 0, 1); sel.y = clamp(sel.y + moves[ev.key][1], 0.08, 1); dropTrack(sel.id); }
    else if (ev.key === 'Delete' || ev.key === 'Backspace') removeEntity(sel);
    else if (ev.key === '+' || ev.key === '=') sel.scale = clamp(sel.scale * 1.15, 0.3, 6);
    else if (ev.key === '-') sel.scale = clamp(sel.scale / 1.15, 0.3, 6);
    else if (ev.key === 'r') sel.rot = (sel.rot + 15) % 360;
    else if (ev.key === 'f') sel.flip = !sel.flip;
    else return;
    ev.preventDefault(); rebuild();
  }
});

/* ---------- story viewer (flipbook of every committed turn) ---------- */
let story = null, storyAt = 0, storyCut = null, playing = false;
const storyOpts = () => ({ code, names: story.names });
const caption = (i) => { const fr = story.history[i]; return `Page ${i + 1} of ${story.history.length} · ${fr.by === 'director' ? '🎬 ' + story.names.director : '🧑 ' + story.names.player}${fr.timeout ? ' (ran out of time)' : ''}`; };
async function openStory() {
  try { story = await api(`/api/rooms/${code}/history`); } catch (e) { return toast(e.message); }
  if (!story.history.length) return toast('The story has not begun yet');
  story.history.forEach((x) => norm(x.scene));
  storyAt = story.history.length - 1;
  $('#story').hidden = false; showFrame();
}
function showFrame() {
  renderStage($('#storyStage'), story.history[storyAt].scene, storyOpts());
  $('#storyCap').textContent = caption(storyAt);
}
function stopPlay() { playing = false; if (storyCut) storyCut.skip(); storyCut = null; $('#storyPlay').textContent = '▶ Play'; }
function playFrom(i) {
  if (!playing || i >= story.history.length) return stopPlay();
  storyAt = i;
  $('#storyCap').textContent = caption(i);
  storyCut = playTurn($('#storyStage'), i ? story.history[i - 1].scene : null, story.history[i].scene, { ...storyOpts(), by: story.history[i].by, sfx: audio.sfx },
    () => { storyCut = null; if (playing) setTimeout(() => playFrom(i + 1), 700); });
}
$('#storyPrev').onclick = () => { stopPlay(); storyAt = Math.max(0, storyAt - 1); showFrame(); };
$('#storyNext').onclick = () => { stopPlay(); storyAt = Math.min(story.history.length - 1, storyAt + 1); showFrame(); };
$('#storyPlay').onclick = () => {
  if (playing) { stopPlay(); return showFrame(); }
  playing = true; $('#storyPlay').textContent = '⏸ Pause';
  playFrom(storyAt >= story.history.length - 1 ? 0 : storyAt);
};
$('#storyClose').onclick = () => { stopPlay(); $('#story').hidden = true; };
$('#storySave').onclick = () => {
  const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(story, null, 1)], { type: 'application/json' })), download: `twofold-${code}.json` });
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
};

/* ---------- home / joining ---------- */
const nameEl = $('#name'), codeEl = $('#joinCode'), errEl = $('#homeErr');
nameEl.value = localStorage.getItem('tf.name') || '';
const myName = () => { const n = nameEl.value.trim(); localStorage.setItem('tf.name', n); return n; };

function enter(c) {
  code = c; S = null; uiKey = ''; remember(c);
  if (location.hash.slice(1).toUpperCase() !== c) history.replaceState(null, '', '#' + c);
  $('#home').hidden = true; $('#game').hidden = false;
  connect();
}
function leave(msg) {
  if (es) es.close();
  if (cut) cut.skip();
  es = null; code = null; S = null;
  audio.setMood(HOME_MOOD); $('#homeSound').textContent = audio.icon;
  history.replaceState(null, '', location.pathname);
  $('#story').hidden = true; $('#game').hidden = true; $('#home').hidden = false;
  $('#invite').hidden = true; $('#newBtns').hidden = false; codeEl.value = '';
  errEl.textContent = msg || '';
}
const HOME_MOOD = 'm:spooky';
let storyType = 'free';                                    // chosen once, when the story is created
for (const b of document.querySelectorAll('#typePick button')) b.onclick = () => { storyType = b.dataset.type; for (const o of document.querySelectorAll('#typePick button')) o.classList.toggle('on', o === b); };
async function create(role, mode) {
  errEl.textContent = '';
  try { enter((await api('/api/rooms', { token, name: myName(), role, mode, type: storyType })).code); } catch (e) { errEl.textContent = e.message; }
}
async function join(c, quiet) {
  c = (c || '').trim().toUpperCase();
  if (!/^[A-Z]{5}$/.test(c)) { errEl.textContent = 'Enter the 5-letter story code'; return; }
  errEl.textContent = '';
  try { await api(`/api/rooms/${c}/join`, { token, name: myName() }); enter(c); } catch (e) {
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
codeEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') join(codeEl.value); });

function boot() {
  const c = location.hash.slice(1).toUpperCase();
  if (!/^[A-Z]{5}$/.test(c)) return;
  if (c === code) return;
  if (known().includes(c)) return void join(c, true);   // returning to my own story: straight back in
  codeEl.value = c;
  $('#newBtns').hidden = true;
  const inv = $('#invite'); inv.hidden = false; inv.textContent = `You've been invited to story ${c}. Enter your name and tap Join.`;
  $('#joinBtn').classList.add('primary');
}
window.addEventListener('hashchange', boot);
document.addEventListener('pointerdown', () => { audio.unlock(); $('#musicHint').hidden = true; }, { capture: true });
document.addEventListener('keydown', () => audio.unlock(), { capture: true });
/* a soft click on every button, so the whole interface feels alive */
document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('button, .ent.hot, select')) audio.sfx('ui'); }, { capture: true });
/* the start screen: spooky music, a pixel scene, the odd clap of thunder */
audio.setMood(HOME_MOOD);
$('#homeSound').textContent = audio.icon;
$('#homeSound').onclick = (e) => { e.currentTarget.textContent = audio.cycle(); };
startTitle($('#titleArt'), () => { if (!code) audio.sfx('thunder'); });
Promise.all([loadPack(), loadPixel()]).then(boot);
