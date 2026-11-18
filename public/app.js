import { CATEGORIES, PIXEL, allItems, BACKDROPS, backdropCss, assetName, loadPack, loadPixel } from './catalog.js';
import { MOODS, SFX, audio } from './audio.js';
import { h, clone, clamp, norm, glyphNode, renderStage, playCut, playTurn } from './stage.js';
import { FX, EMOTES, WEATHER, BURSTS } from './consts.js';
import { G, resetGuided, guidedKey, guidedPick, buildGuided } from './guided.js';

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
];
const TYPES = [
  { id: 'free', label: '🎭 Free play', hint: 'Just the stage and your imagination.', modules: {} },
  { id: 'adventure', label: '🗺️ Adventure', hint: 'Inventory, stats and dice.', modules: { inventory: true, stats: true, dice: true } },
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
let tab = 'cast', catId = 'people', search = '';
let submitting = false, autoTurn = -1, localDeadline = 0, connected = false;
let es = null, lastMsg = 0, uiKey = '';
let cut = null;                              // a cut scene currently playing on the main stage
let rec = false, animAt = 0, together = false;   // motion recording
let drawOn = false;
let dmode = localStorage.getItem('tf.dmode') === 'studio' ? 'studio' : 'guided';   // how the Director works: step by step, or all tools
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
    submitting = false; selId = null; selInv = null; rec = false; drawOn = false; animAt = 0; resetGuided();
    initDraft();
    if (prev && s.lastTimeout && prev.turn !== s.turn && prev.you === prev.whose && !s.hotseat) toast('⏰ Time ran out — your turn was sent as it was');
    if (cut) cut.skip();
    if (prev && prev.turn !== s.turn && s.turn > 0 && !s.ended) {  // present what just happened before handing over control
      const by = s.whose === 'director' ? 'player' : 'director';
      cut = playTurn(stage, s.before, s.scene, { ...stageOpts(), selId: null, pendingRoll: 0, range: null, by, sfx: audio.sfx }, () => {
        cut = null;
        if (myTurn()) { audio.blip(); if (navigator.vibrate) navigator.vibrate(120); }
        render();
      });
    }
  }
  render();
}

function initDraft() {
  draft = clone(S.scene);
  if (!myTurn()) return;
  try {
    const saved = JSON.parse(sessionStorage.getItem('tf.draft') || 'null');
    if (saved && saved.code === code && saved.turn === S.turn && saved.you === S.you) { draft = norm(saved.draft); return; }
  } catch { /* ignore */ }
  if (S.you === 'director') {      // fresh turn: last turn's lines, narration and one-turn extras are over
    for (const e of draft.entities) if (e.id !== draft.heroId) e.say = '';
    Object.assign(draft, { narration: '', tracks: [], burst: '', sfx: '', card: '', choices: [], steps: [] });
    if (draft.roll && draft.roll.by === 'director') draft.roll = null;
  } else {
    const me = hero(draft); if (me) me.say = '';
    Object.assign(draft, { action: '', target: null, use: null, heroTrack: null });
    if (draft.roll && draft.roll.by === 'player') draft.roll = null;
  }
  draft.rollWant = 0;
}
const saveDraft = () => sessionStorage.setItem('tf.draft', JSON.stringify({ code, turn: S.turn, you: S.you, draft }));
const paint = () => { if (!cut && S) renderStage(stage, shown(), stageOpts()); };
function changed() { saveDraft(); render(); }                       // may rebuild the panel
function changedQuiet() { saveDraft(); paint(); renderSheet(); }    // never rebuilds the panel (the user is typing in it)
function rebuild() { uiKey = ''; changed(); }

/* A step-by-step turn: draft.steps holds the scene as it stood after each finished event. */
const ONE_TURN = { tracks: [], burst: '', sfx: '', card: '' };
const frameKey = (sc) => JSON.stringify({ ...sc, steps: 0, rollWant: 0, ...ONE_TURN });
function commitStep() {
  if (S.turn === 0) return;                      // the opening scene simply appears
  const frame = { ...clone(draft), steps: [] };
  delete frame.rollWant;
  if (draft.steps.length < 6) draft.steps.push(frame); else draft.steps[5] = frame;
  Object.assign(draft, clone(ONE_TURN)); animAt = 0;   // moves, sounds and title cards belong to the step that made them
}
/** What is sent when the Director ends the turn: the last step becomes the scene itself unless something changed after it. */
function finalScene() {
  const sc = clone(draft), last = sc.steps[sc.steps.length - 1];
  if (last && frameKey(last) === frameKey(sc) && !sc.tracks.length && !sc.burst && !sc.sfx && !sc.card) { sc.steps.pop(); return { ...last, steps: sc.steps, rollWant: sc.rollWant }; }
  return sc;
}

async function submit() {
  if (submitting || !myTurn()) return;
  if (cut) cut.skip();
  submitting = true; render();
  const turn = S.turn, me = hero(draft), roll = draft.rollWant || 0;
  const body = S.you === 'director' ? { turn, scene: finalScene(), roll }
    : { turn, x: me && me.x, y: me && me.y, say: me ? me.say : '', emote: me ? me.emote : '', action: draft.action, target: draft.target, use: draft.use, roll, track: draft.heroTrack };
  try { await act('submit', body, 6); } catch (e) {
    if (S && S.turn === turn) { submitting = false; toast(e.message); render(); }
  }
}

/* ---------- stage input ---------- */
const stage = $('#stage');
const heroTurn = () => myTurn() && S.you === "player" && !submitting;
const heroStart = () => hero(S.scene);            // where the hero stood when the Player's turn began
const stageOpts = () => {
  const st = heroTurn() && S.rules.player === 'free' && S.rules.moveRange > 0 ? heroStart() : null;
  return { code, names: S.names, selId: directing() ? selId : null, pendingRoll: heroTurn() ? draft.rollWant : 0, noAct: heroTurn() && S.rules.player === 'tell', range: st ? { x: st.x, y: st.y, r: S.rules.moveRange } : null };
};
/** Game movement: keep a point within the hero's walking range for this turn. */
function inRange(x, y) {
  const st = heroStart(), r = S.rules.moveRange;
  if (!st || !(r > 0)) return [x, y];
  const d = Math.hypot(x - st.x, (y - st.y) * 0.75);
  return d > r ? [st.x + ((x - st.x) * r) / d, st.y + ((y - st.y) * r) / d] : [x, y];
}
let drag = null;
function stagePos(ev) {
  const r = stage.getBoundingClientRect();
  return { x: clamp((ev.clientX - r.left) / r.width, 0, 1), y: clamp((ev.clientY - r.top) / r.height, 0, 1) };
}
const dropTrack = (id) => { draft.tracks = draft.tracks.filter((t) => t.id !== id); };
const tracksEnd = () => Math.max(0, ...draft.tracks.map((t) => t.pts[t.pts.length - 3]));

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
    if (S.rules.player !== 'free') return toast(S.rules.player === 'tell' ? 'In this story you write what you want to do, and the Director makes it happen' : 'In this story you choose one of the Director’s options');
    if (!me) return toast('You have no character on stage right now — speak or act instead');
    draft.heroTrack = null;
    if (hit && hit !== me && mods().inventory) {                    // reach for a thing: the Director decides whether you get it
      draft.target = hit.id;
      [me.x, me.y] = inRange(clamp(hit.x + (me.x < hit.x ? -0.12 : 0.12), 0.04, 0.96), clamp(hit.y + 0.02, 0.08, 1));
      return changed();
    }
    draft.target = null;
    const st = heroStart() || me;
    drag = { e: me, dx: 0, dy: 0, walk: { t0: performance.now(), last: 0, pts: [0, r3(st.x), r3(st.y)] } };   // the path is replayed for the Director
    [me.x, me.y] = inRange(p.x, clamp(p.y, 0.08, 1));
  } else if (drawOn) {
    if (draft.drawing.length >= 60) return toast('That is a lot of drawing — clear some first');
    drag = { stroke: { id: rid(), c: pen.c, w: pen.w, pts: [r3(p.x), r3(p.y)] } };
    draft.drawing.push(drag.stroke);
  } else {
    selId = hit ? hit.id : null; selInv = null;
    if (hit && dmode === 'guided' && guidedPick(hit.id)) uiKey = '';
    if (hit) {
      drag = { e: hit, dx: hit.x - p.x, dy: hit.y - p.y };
      if (rec) {
        if (animAt >= 10000) { toast('The 10 seconds are used up — clear the moves to record again'); drag = null; } else drag.take = { t0: performance.now(), off: animAt, last: animAt, pts: [animAt, r3(hit.x), r3(hit.y)] };
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
  drag.e.x = clamp(p.x + drag.dx, 0, 1); drag.e.y = clamp(p.y + drag.dy, 0.08, 1);
  if (drag.walk) {
    [drag.e.x, drag.e.y] = inRange(drag.e.x, drag.e.y);
    const t = Math.round(350 + performance.now() - drag.walk.t0);
    if (t < 8000 && t - drag.walk.last >= 60) { drag.walk.pts.push(t, r3(drag.e.x), r3(drag.e.y)); drag.walk.last = t; }
    return paint();
  }
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
  if (d.walk) {                                                     // the Player's own walk: keep it if it was a real drag, not a tap
    const w = d.walk.pts; let len = 0;
    for (let i = 3; i < w.length; i += 3) len += Math.hypot(w[i + 1] - w[i - 2], w[i + 2] - w[i - 1]);
    w.push(Math.max(d.walk.last + 60, 350), r3(d.e.x), r3(d.e.y));
    draft.heroTrack = w.length >= 12 && len > 0.06 && !(S.rules.moveRange > 0) ? w : null;
  }
  if (d.take) {                                                     // store the recorded move
    const tk = d.take, t = Math.min(10000, Math.round(tk.off + performance.now() - tk.t0));
    tk.pts.push(Math.max(t, tk.last + 1), r3(d.e.x), r3(d.e.y));
    storeTrack(d.e.id, tk.off, tk.pts);
    animAt = together ? tk.off : Math.min(10000, t);
    uiKey = '';
  }
  if (d.stroke) { if (d.stroke.pts.length < 4) d.stroke.pts.push(d.stroke.pts[0], d.stroke.pts[1]); uiKey = ''; }
  if (myTurn()) changed();
}
function storeTrack(id, off, pts) {
  const old = draft.tracks.find((x) => x.id === id);
  if (old && old.pts[old.pts.length - 3] <= off) old.pts.push(...pts); else { dropTrack(id); draft.tracks.push({ id, pts }); }
}
/** A ready-made move: steps are [milliseconds, x, y], played after whatever is already recorded. */
function autoTrack(e, steps) {
  const off = tracksEnd(); let t = off;
  const pts = [off, r3(e.x), r3(e.y)];
  for (const [dt, x, y] of steps) {
    t += dt;
    if (t > 10000) break;
    pts.push(Math.round(t), r3(clamp(x, 0, 1)), r3(clamp(y, 0.08, 1)));
  }
  if (pts.length < 6) { toast('The 10 seconds of animation for this turn are used up'); return false; }
  storeTrack(e.id, off, pts);
  e.x = pts[pts.length - 2]; e.y = pts[pts.length - 1]; animAt = pts[pts.length - 3];
  return true;
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

function previewCut() {
  if (cut) return cut.skip();
  audio.unlock();
  const o = { ...stageOpts(), selId: null, by: 'director', sfx: audio.sfx }, end = () => { cut = null; render(); };
  if (draft.steps.length) cut = playTurn(stage, S.scene, finalScene(), o, end);      // step by step: replay every event in order
  else {
    const start = clone(draft);
    for (const tr of draft.tracks) { const e = start.entities.find((x) => x.id === tr.id); if (e) { e.x = tr.pts[1]; e.y = tr.pts[2]; } }
    start.drawing = []; start.narration = '';
    for (const e of start.entities) e.say = '';
    cut = playCut(stage, start, draft, o, end);
  }
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
    who('director', '🎬'), who('player', '🧑'), h('span', { class: 'grow' }), h('span', { class: 'code' }, code),
    h('button', { onclick: openStory, 'aria-label': 'Story so far', title: 'Story so far' }, '📖'),
    h('button', { onclick: (e) => { audio.unlock(); e.currentTarget.textContent = audio.toggleMute() ? '🔇' : '🔊'; }, 'aria-label': 'Sound', title: 'Sound' }, audio.muted ? '🔇' : '🔊'));

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
function tick() {
  if (!S || !code) return;
  const bar = $('#clock i'), lab = $('#tlabel');
  if (S.remainingMs == null || S.ended) { bar.style.width = '0'; if (lab) lab.textContent = ''; return; }
  const full = S.settings.turnSeconds * 1000 || 1;
  const r = S.paused ? S.remainingMs : Math.max(0, localDeadline - performance.now());
  bar.style.width = Math.min(100, (r / full) * 100) + '%';
  bar.className = r < 10000 ? 'low' : '';
  if (lab) lab.textContent = ' · ' + fmt(Math.min(r, full)) + (S.paused ? ' ⏸' : '');
  if (r <= 0 && !S.paused && myTurn() && !submitting && autoTurn !== S.turn) { autoTurn = S.turn; submit(); }
}
setInterval(tick, 250);

/* ---------- main render ---------- */
function render() {
  if (!S) return;
  const scene = shown();
  paint();
  stage.classList.toggle('edit', myTurn() && !cut);
  stage.classList.toggle('drawing', directing() && drawOn);
  audio.setMood(scene.mood);
  renderChrome();
  renderSheet();
  const key = [S.you, S.turn, S.whose, S.ended, S.joined.player, S.joined.director, submitting, tab, catId, selId, selInv, S.assets.length, S.settings.turnSeconds,
    JSON.stringify(S.rules), rec, drawOn, together, !!cut, myTurn() && draft.target, myTurn() && draft.use, dmode, guidedKey()].join('|');
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
  { id: 'free', label: '🕹️ Free will', hint: 'The Player moves, animates and speaks for their hero, and types what they do.' },
  { id: 'limited', label: '🎯 Limited will', hint: 'The Player must pick one of the options you offer each turn. They can still speak.' },
  { id: 'tell', label: '📝 Narration', hint: 'The Player only writes what they want to do. Nothing moves until you stage it.' },
];
const RANGES = [[0, 'Anywhere'], [0.15, 'A few steps'], [0.3, 'Half the stage'], [0.5, 'Most of the stage']];
function typeCard() {
  const r = S.rules;
  return h('div', { class: 'card' }, h('h3', {}, 'Story type'),
    h('div', { class: 'chips wrap' }, TYPES.map((t) => h('button', { class: r.type === t.id ? 'on' : '', title: t.hint, onclick: () => setRules({ type: t.id, modules: { inventory: false, stats: false, dice: false, ...t.modules }, moveRange: t.id === 'adventure' ? r.moveRange : 0 }) }, t.label))),
    h('p', { class: 'dim small' }, TYPES.find((t) => t.id === r.type).hint + ' Layers can be switched on and off at any time:'),
    h('div', { class: 'chips wrap' }, MODULES.map((m) => h('button', { class: r.modules[m.id] ? 'on' : '', title: m.hint, onclick: () => setRules({ modules: { ...r.modules, [m.id]: !r.modules[m.id] } }) }, m.label))),
    h('h3', {}, `How ${S.names.player} plays`),
    h('div', { class: 'chips wrap' }, PLAYER_MODES.map((m) => h('button', { 'data-pmode': m.id, class: r.player === m.id ? 'on' : '', title: m.hint, onclick: () => setRules({ player: m.id }) }, m.label))),
    h('p', { class: 'dim small' }, PLAYER_MODES.find((m) => m.id === r.player).hint),
    r.type === 'adventure' && r.player === 'free' && h('h3', {}, 'Game movement: how far the hero walks per turn'),
    r.type === 'adventure' && r.player === 'free' && h('div', { class: 'chips wrap' }, RANGES.map(([v, l]) => h('button', { 'data-range': v, class: r.moveRange === v ? 'on' : '', onclick: () => setRules({ moveRange: v }) }, l))));
}

function buildPanel() {
  const p = $('#panel'); p.replaceChildren();
  if (S.ended) return void p.append(h('div', { class: 'card' }, h('h3', {}, 'The story has ended'), h('p', { class: 'dim' }, 'Flip through it together, or start a new one.')), recap(S.scene) || '');
  if (!myTurn() || S.you !== 'director') {
    const tips = S.you === 'spectator' ? null
      : myTurn() ? ['Your turn', S.rules.player === 'tell' ? `Write what you want to do. ${S.names.director} will make it happen on the stage, and you will see it play out.`
        : S.rules.player === 'limited' ? `Choose one of ${S.names.director}’s options. You can add a line of speech.`
          : `Drag your hero to walk${S.rules.moveRange > 0 ? ' (inside the circle)' : ' — the path you draw is what the Director sees'}.${mods().inventory ? ' Tap a thing to reach for it, or a 🎒 item to use it.' : ''} Then say something, do something — or both — and end your turn.`]
        : S.you === 'player' ? [S.turn === 0 ? `${S.names.director} is setting the stage…` : `${S.names.director} is deciding what happens…`, 'The whole world is in their hands. Watch the stage.']
          : [`${S.names.player} is making a move…`, 'When they finish you can change anything: the cast, the place, the music, what everybody says.'];
    if (tips) p.append(h('div', { class: 'card' }, h('h3', {}, tips[0]), h('p', { class: 'dim' }, tips[1])));
    const r = recap(S.scene); if (r) p.append(r);
    return;
  }

  const setMode = (m) => { dmode = m; localStorage.setItem('tf.dmode', m); if (G.path.length && G.snap) draft = G.snap; resetGuided(); rec = false; drawOn = false; selId = null; rebuild(); };
  p.append(h('div', { class: 'modesw' }, h('button', { 'data-mode': 'guided', class: dmode === 'guided' ? 'on' : '', onclick: () => setMode('guided') }, '🧭 Step by step'), h('button', { 'data-mode': 'studio', class: dmode === 'studio' ? 'on' : '', onclick: () => setMode('studio') }, '🎛️ All tools')));
  if (dmode === 'guided') {
    if (S.turn === 0 && !G.path.length) p.append(h('div', { class: 'chips typerow' }, h('span', { class: 'dim small' }, 'Story type'),
      TYPES.map((t) => h('button', { class: S.rules.type === t.id ? 'on' : '', title: t.hint, onclick: () => setRules({ type: t.id, modules: { inventory: false, stats: false, dice: false, ...t.modules } }) }, t.label))));
    return buildGuided(p, guidedCtx);
  }
  p.append(h('div', { class: 'tabs' }, [['cast', '🎭', 'Cast'], ['place', '🌄', 'Place'], ['mood', '🎵', 'Mood'], ['anim', '🎬', 'Animate'], ['fx', '✨', 'Extras'], ['more', '⚙️', 'More']]
    .map(([id, icon, label]) => h('button', { 'data-tab': id, class: tab === id ? 'on' : '', onclick: () => { tab = id; rec = false; drawOn = false; render(); } }, h('span', {}, icon), h('small', {}, label)))));
  if (S.turn === 0 && tab !== 'more') p.append(h('div', { class: 'chips typerow' }, h('span', { class: 'dim small' }, 'Story type'),
    TYPES.map((t) => h('button', { class: S.rules.type === t.id ? 'on' : '', title: t.hint, onclick: () => setRules({ type: t.id, modules: { inventory: false, stats: false, dice: false, ...t.modules } }) }, t.label))));

  /* --- what the Player just asked for --- */
  const tgt = draft.target && draft.entities.find((e) => e.id === draft.target);
  if (tgt && mods().inventory) p.append(h('div', { class: 'card ask' }, h('b', {}, `${S.names.player} reaches for `, glyphNode(code, tgt.asset, 'mini')),
    h('div', { class: 'row' }, h('button', { class: 'primary grow', onclick: () => { giveToPlayer(tgt); rebuild(); } }, '🎒 Let them take it'), h('button', { class: 'grow', onclick: () => { draft.target = null; rebuild(); } }, 'Not now'))));
  const used = draft.use && draft.sheet.inv.find((i) => i.id === draft.use);
  if (used) p.append(h('div', { class: 'card ask' }, h('b', {}, `${S.names.player} uses `, glyphNode(code, used.asset, 'mini')),
    h('div', { class: 'row' }, h('button', { class: 'primary grow', onclick: () => { draft.sheet.inv = draft.sheet.inv.filter((i) => i !== used); draft.use = null; rebuild(); } }, 'It is used up'), h('button', { class: 'grow', onclick: () => { draft.use = null; rebuild(); } }, 'They keep it'))));
  const item = selInv && draft.sheet.inv.find((i) => i.id === selInv);
  if (item) p.append(h('div', { class: 'seltools' }, h('div', { class: 'row' }, h('span', { style: 'font-size:28px' }, glyphNode(code, item.asset, 'mini')),
    h('button', { class: 'grow', onclick: () => { draft.sheet.inv = draft.sheet.inv.filter((i) => i !== item); selInv = null; addEntity(item.asset); } }, '⬆️ Put on stage'),
    h('button', { class: 'grow danger', onclick: () => { draft.sheet.inv = draft.sheet.inv.filter((i) => i !== item); selInv = null; rebuild(); } }, '🗑️ Take away'))));

  /* --- selected character or thing --- */
  const sel = draft.entities.find((e) => e.id === selId);
  if (sel) {
    const btn = (label, title, fn, on) => h('button', { title, 'aria-label': title, class: on ? 'on' : '', onclick: () => { fn(); rebuild(); } }, label);
    const pick = (list, key, title) => h('select', { title, 'aria-label': title, onchange: (ev) => { sel[key] = ev.target.value; changedQuiet(); } },
      list.map(([v, l]) => h('option', { value: v, selected: sel[key] === v }, l)));
    p.append(h('div', { class: 'seltools' },
      h('div', { class: 'row' }, h('span', { style: 'font-size:28px' }, glyphNode(code, sel.asset, 'mini')),
        h('input', { placeholder: 'What do they say?', maxlength: 160, value: sel.say, enterkeyhint: 'done', oninput: (ev) => { sel.say = ev.target.value; changedQuiet(); } })),
      h('div', { class: 'row' },
        btn('➖', 'Smaller', () => { sel.scale = clamp(sel.scale / 1.3, 0.3, 6); }),
        btn('➕', 'Bigger', () => { sel.scale = clamp(sel.scale * 1.3, 0.3, 6); }),
        btn('↺', 'Rotate left', () => { sel.rot = (sel.rot - 15) % 360; }),
        btn('↻', 'Rotate right', () => { sel.rot = (sel.rot + 15) % 360; }),
        btn('↔️', 'Flip', () => { sel.flip = !sel.flip; }),
        btn('⧉', 'Copy', () => { const c = { ...clone(sel), id: rid(), x: clamp(sel.x + 0.08, 0, 1), say: '' }; draft.entities.push(c); selId = c.id; }),
        btn('🗑️', 'Remove', () => removeEntity(sel))),
      h('div', { class: 'row' },
        pick(FX, 'fx', 'Effect'),
        pick([['', 'No emote'], ...EMOTES.map((e) => [e, e])], 'emote', 'Emote'),
        btn('🧑 Hero', "Make this the Player's character", () => { draft.heroId = draft.heroId === sel.id ? null : sel.id; }, draft.heroId === sel.id),
        mods().inventory && sel.id !== draft.heroId && btn('🎒 Give', 'Put it in the Player’s inventory', () => giveToPlayer(sel)))));
  }

  if (tab === 'cast') {
    const grid = h('div', { class: 'grid' });
    const fill = () => {
      const q = search.trim().toLowerCase();
      let items;
      if (q) items = allItems().filter((i) => i.name.includes(q));
      else if (catId === 'custom') items = S.assets.filter((a) => a.kind === 'sprite').map((a) => ({ asset: 'c:' + a.id, name: a.name }));
      else items = ([...PIXEL, ...CATEGORIES].find((c) => c.id === catId) || PIXEL[0] || CATEGORIES[0]).items;
      grid.replaceChildren(...items.slice(0, 300).map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => addEntity(i.asset) }, glyphNode(code, i.asset))));
      if (!items.length) grid.append(h('p', { class: 'dim', style: 'grid-column:1/-1;margin:4px' }, q ? 'Nothing found — try the ✨ Custom tab to make it.' : 'Nothing here yet. Create something below.'));
    };
    p.append(
      h('input', { type: 'search', placeholder: '🔍 Search 600+ sprites (dragon, door, key…)', value: search, enterkeyhint: 'search', oninput: (ev) => { search = ev.target.value; fill(); } }),
      h('div', { class: 'chips wrap' }, [...PIXEL, ...CATEGORIES.map((c) => ({ ...c, label: '😀 ' + c.label })), { id: 'custom', label: '✨ Custom' }].map((c) => h('button', { class: c.id === catId ? 'on' : '', onclick: () => { catId = c.id; search = ''; render(); } }, c.label))),
      grid);
    fill();
    if (catId === 'custom') {
      const any = h('input', { placeholder: 'Any emoji or short text', maxlength: 24 });
      p.append(maker('sprite', (id) => addEntity('c:' + id)),
        h('div', { class: 'row' }, any, h('button', { onclick: () => { const v = any.value.trim(); if (v) { addEntity('e:' + v); any.value = ''; } } }, 'Add')));
    }
  } else if (tab === 'place') {
    const drop = (id, name) => h('button', { 'data-mark': `backdrop=${id}`, class: draft.backdrop === id ? 'on' : '', style: `background:${backdropCss(code, id)}`, onclick: () => { draft.backdrop = id; changed(); } }, name);
    p.append(h('div', { class: 'grid drops' }, BACKDROPS.map((b) => drop(b.id, b.name)), S.assets.filter((a) => a.kind === 'backdrop').map((a) => drop('c:' + a.id, a.name))),
      maker('backdrop', (id) => { draft.backdrop = 'c:' + id; rebuild(); }));
  } else if (tab === 'mood') {
    p.append(h('div', { class: 'list' }, MOODS.map((m) => h('button', { 'data-mark': `mood=${m.id}`, class: draft.mood === m.id ? 'on' : '', onclick: () => { audio.unlock(); draft.mood = m.id; changed(); } }, m.name))),
      h('p', { class: 'dim small' }, 'Both of you hear the mood once your turn is sent.'));
  } else if (tab === 'anim') {
    const used = tracksEnd();
    p.append(
      h('div', { class: 'card' }, h('h3', {}, '🎬 Record moves (up to 10 seconds)'),
        h('p', { class: 'dim small' }, 'Press record, then drag a character across the stage. The path and its timing are replayed for the Player before their turn. Record several, one after another or at the same time.'),
        h('button', { id: 'recBtn', class: rec ? 'recording' : 'primary', onclick: () => { rec = !rec; drawOn = false; render(); } }, rec ? '■ Recording — drag something on the stage' : '● Record a move'),
        h('div', { class: 'chips wrap' },
          h('button', { class: !together ? 'on' : '', onclick: () => { together = false; animAt = tracksEnd(); render(); } }, 'Next move: after the last'),
          h('button', { class: together ? 'on' : '', onclick: () => { together = true; animAt = 0; render(); } }, 'Next move: at the same time')),
        h('div', { class: 'meter' }, h('i', { style: `width:${used / 100}%` })),
        h('p', { class: 'dim small', id: 'animUsed' }, `${(used / 1000).toFixed(1)} of 10 seconds used · ${draft.tracks.length} moving`),
        h('div', { class: 'row' },
          h('button', { class: 'grow', id: 'previewBtn', onclick: previewCut }, cut ? '■ Stop' : '▶ Preview this turn'),
          h('button', { class: 'grow', disabled: !draft.tracks.length, onclick: () => { draft.tracks = []; animAt = 0; rebuild(); } }, '✖ Clear moves'))),
      h('div', { class: 'card' }, h('h3', {}, '✏️ Draw on the stage'),
        h('button', { id: 'drawBtn', class: drawOn ? 'recording' : '', onclick: () => { drawOn = !drawOn; rec = false; render(); } }, drawOn ? '■ Drawing — use your finger on the stage' : '✏️ Start drawing'),
        h('div', { class: 'row pens' }, PENS.map((c) => h('button', { class: 'pen' + (pen.c === c ? ' on' : ''), style: `background:${c}`, 'aria-label': 'Colour', onclick: () => { pen.c = c; drawOn = true; rec = false; uiKey = ''; render(); } }))),
        h('div', { class: 'row' },
          [['Thin', 2], ['Medium', 4], ['Thick', 9]].map(([l, w]) => h('button', { class: 'grow' + (pen.w === w ? ' on' : ''), onclick: () => { pen.w = w; uiKey = ''; render(); } }, l)),
          h('button', { class: 'grow', disabled: !draft.drawing.length, onclick: () => { draft.drawing.pop(); rebuild(); } }, '↶ Undo'),
          h('button', { class: 'grow', disabled: !draft.drawing.length, onclick: () => { draft.drawing = []; rebuild(); } }, 'Clear'))));
  } else if (tab === 'fx') {
    const choice = (i) => h('input', { placeholder: `Choice ${i + 1}`, maxlength: 40, value: draft.choices[i] || '', oninput: (ev) => { for (let k = 0; k < 3; k++) draft.choices[k] ||= ''; draft.choices[i] = ev.target.value; changedQuiet(); } });
    p.append(
      h('div', { class: 'card' }, h('h3', {}, 'Weather'), chips(WEATHER, 'weather')),
      h('div', { class: 'card' }, h('h3', {}, 'A moment, when your turn plays'), chips(BURSTS, 'burst'), h('h3', { style: 'margin-top:10px' }, 'Sound'), chips(SFX, 'sfx', (v) => { audio.unlock(); audio.sfx(v); })),
      h('div', { class: 'card' }, h('h3', {}, 'Title card'), h('input', { placeholder: 'e.g. “Chapter 2 — The Cave”', maxlength: 60, value: draft.card, oninput: (ev) => { draft.card = ev.target.value; changedQuiet(); } })),
      h('div', { class: 'card' }, h('h3', {}, `Offer ${S.names.player} quick choices`), h('div', { class: 'col' }, choice(0), choice(1), choice(2)), h('p', { class: 'dim small' }, 'They can tap one, or still type anything they like.')),
      mods().dice && h('div', { class: 'card' }, h('h3', {}, 'Roll a die with this turn'), chips([[0, 'No roll'], [6, '🎲 d6'], [20, '🎲 d20']], 'rollWant'), h('p', { class: 'dim small' }, 'The roll happens when you end the turn, so nobody can fudge it.')),
      h('div', { class: 'card' }, h('h3', {}, 'Stuck?'), h('div', { class: 'row' },
        h('button', { class: 'grow', onclick: randomScene }, '🎲 Random scene'),
        h('button', { class: 'grow', onclick: () => toast('💡 ' + IDEAS[Math.floor(Math.random() * IDEAS.length)]) }, '💡 Give me an idea'))));
  } else {
    const sel2 = h('select', { onchange: (ev) => act('settings', { turnSeconds: Number(ev.target.value) }, 3).catch((e) => toast(e.message)) },
      [[0, 'No time limit'], [30, '30 seconds'], [45, '45 seconds'], [60, '1 minute'], [90, '1½ minutes'], [120, '2 minutes'], [180, '3 minutes'], [300, '5 minutes']]
        .map(([v, l]) => h('option', { value: v, selected: S.settings.turnSeconds === v }, l)));
    p.append(
      typeCard(),
      h('div', { class: 'card' }, h('h3', {}, '⏱ Time per turn'), sel2, h('p', { class: 'dim small' }, 'Applies from the next turn. The clock pauses if either of you drops off, and extra time is added while a turn is being played back.')),
      h('div', { class: 'card' }, h('h3', {}, `Story code: ${code}`), h('div', { class: 'row' }, h('button', { class: 'grow', onclick: shareLink }, S.bot || S.hotseat ? '🔗 Let someone watch' : '🔗 Share invite link'), h('button', { class: 'grow', onclick: openStory }, '📖 Story so far'))),
      h('button', { class: 'danger', onclick: () => { if (confirm('End the story?')) act('end', {}, 3).catch((e) => toast(e.message)); } }, '🎬 End the story'),
      h('button', { class: 'link', onclick: () => leave() }, 'Leave to the start screen'));
  }
}
const guidedCtx = {
  get draft() { return draft; }, get S() { return S; }, get code() { return code; },
  setDraft(d) { draft = d; saveDraft(); },
  select(id) { selId = id || null; }, setRec(on) { rec = !!on; drawOn = false; if (on) { together = false; animAt = tracksEnd(); } },
  commitStep: () => commitStep(), setRules: (r) => setRules(r), typeCard: () => typeCard(),
  cutting: () => !!cut, preview: () => previewCut(), mods: () => mods(), tracksEnd: () => tracksEnd(),
  toast, act, audio, rebuild: () => rebuild(), changed: () => changed(), changedQuiet: () => changedQuiet(),
  addEntity: (a) => addEntity(a), removeEntity: (e) => removeEntity(e), giveToPlayer: (e) => giveToPlayer(e), autoTrack: (e, s) => autoTrack(e, s),
  maker: (k, f) => maker(k, f), randomScene: () => randomScene(),
};
function addEntity(asset) {
  if (draft.entities.length >= 80) return void toast('The stage is full');
  let best = null;                                   // drop it on the freest spot of the ground, not on top of someone
  for (let i = 0; i < 24; i++) {
    const x = 0.1 + Math.random() * 0.8, y = 0.62 + Math.random() * 0.3;
    const gap = Math.min(9, ...draft.entities.map((o) => Math.hypot(o.x - x, (o.y - y) * 0.75)));
    if (!best || gap > best.gap) best = { x, y, gap };
  }
  const e = { id: rid(), asset, x: best.x, y: best.y, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '' };
  draft.entities.push(e); selId = e.id; selInv = null; rebuild();
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
    if (dmode !== 'guided') f.append(h('input', { placeholder: '📝 Narrate… (“Suddenly, the lights go out.”)', maxlength: 240, value: draft.narration, enterkeyhint: 'done', oninput: (ev) => { draft.narration = ev.target.value; changedQuiet(); } }));
    f.append(
      h('button', { class: 'go primary', disabled: !ready || (dmode === 'guided' && G.path.length > 0), onclick: submit }, ready ? (S.turn === 0 ? 'Begin the story ▶' : `End ${side}turn ▶`) : 'Waiting for your Player to join…', tl()));
    f.classList.add('tight');
  } else {
    const me = hero(draft), mode = S.rules.player;
    const dice = mods().dice && h('button', { class: 'dice' + (draft.rollWant ? ' on' : ''), title: 'Roll a die with this turn', onclick: () => { draft.rollWant = draft.rollWant === 0 ? 6 : draft.rollWant === 6 ? 20 : 0; rebuild(); } }, draft.rollWant ? `🎲 d${draft.rollWant}` : '🎲');
    const end = (off) => h('div', { class: 'row' }, dice, h('button', { class: 'go primary grow', disabled: !!off, onclick: submit }, `End ${side}turn ▶`, tl()));
    const say = () => h('input', { placeholder: '💬 Say something…', maxlength: 160, value: me ? me.say : '', disabled: !me, enterkeyhint: 'next', oninput: (ev) => { me.say = ev.target.value; changedQuiet(); } });
    const pick = () => h('div', { class: 'chips wrap choices' }, draft.choices.map((c) => h('button', { class: draft.action === c ? 'on' : '', onclick: () => { draft.action = draft.action === c ? '' : c; rebuild(); } }, c)));
    if (mode === 'tell') {                               // narration: only words; the Director stages them
      const ta = h('textarea', { id: 'tellBox', rows: 3, maxlength: 300, placeholder: `✍️ What do you want to do? ${S.names.director} will make it happen.` }, draft.action);
      ta.addEventListener('input', () => { draft.action = ta.value; saveDraft(); });
      f.append(ta, end());
    } else if (mode === 'limited' && draft.choices.length) {   // limited will: one of the Director's options
      f.append(h('div', { class: 'dim small' }, `Choose what you do — ${S.names.director} decided the options:`), pick(), say(), end(!draft.choices.includes(draft.action)));
    } else {
      if (draft.choices.length) f.append(pick());
      if (me) f.append(h('div', { class: 'chips emotes' }, EMOTES.slice(0, 8).map((e) => h('button', { class: me.emote === e ? 'on' : '', 'aria-label': 'Emote ' + e, onclick: () => { me.emote = me.emote === e ? '' : e; rebuild(); } }, e))));
      f.append(say(),
        h('input', { placeholder: '✋ Do something… (“open the drawer”)', maxlength: 160, value: draft.action, enterkeyhint: 'done', oninput: (ev) => { draft.action = ev.target.value; changedQuiet(); } }),
        end());
    }
  }
}

/* ---------- keyboard (computers) ---------- */
document.addEventListener('keydown', (ev) => {
  if (!S || !code || !$('#story').hidden) return;
  const typing = /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName);
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
  audio.setMood('m:none');
  history.replaceState(null, '', location.pathname);
  $('#story').hidden = true; $('#game').hidden = true; $('#home').hidden = false;
  $('#invite').hidden = true; $('#newBtns').hidden = false; codeEl.value = '';
  errEl.textContent = msg || '';
}
async function create(role, mode) {
  errEl.textContent = '';
  try { enter((await api('/api/rooms', { token, name: myName(), role, mode })).code); } catch (e) { errEl.textContent = e.message; }
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
document.addEventListener('pointerdown', () => audio.unlock(), { capture: true });
Promise.all([loadPack(), loadPixel()]).then(() => { if (PIXEL.length) catId = PIXEL[0].id; boot(); });
