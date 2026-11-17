import { CATEGORIES, BACKDROPS, backdropCss, assetUrl } from './catalog.js';
import { MOODS, audio } from './audio.js';

/* ---------- tiny DOM helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}
const clone = (o) => JSON.parse(JSON.stringify(o));
const rid = () => Math.random().toString(36).slice(2, 10);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = (ms) => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}

/* ---------- identity ---------- */
let token = localStorage.getItem('tf.token');
if (!token) { token = rid() + rid() + rid(); localStorage.setItem('tf.token', token); }
const known = () => { try { return JSON.parse(localStorage.getItem('tf.rooms') || '[]'); } catch { return []; } };
const remember = (c) => localStorage.setItem('tf.rooms', JSON.stringify([c, ...known().filter((x) => x !== c)].slice(0, 20)));

/* ---------- state ---------- */
let code = null;        // current room code
let S = null;           // last authoritative state from the server
let draft = null;       // my local, uncommitted copy of the scene (only meaningful on my turn)
let selId = null;       // Director: selected entity
let tab = 'cast', catId = 'people', search = '';
let submitting = false, autoTurn = -1, localDeadline = 0, connected = false;
let es = null, lastMsg = 0, uiKey = '';

const myTurn = () => S && !S.ended && S.you === S.whose;
const other = () => (S.you === 'director' ? 'player' : 'director');
const shown = () => (myTurn() ? draft : S.scene);
const hero = (scene) => scene.entities.find((e) => e.id === scene.heroId);

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
  S = s;
  localDeadline = s.remainingMs != null ? performance.now() + s.remainingMs : 0;
  if (!prev || prev.turn !== s.turn || prev.you !== s.you || prev.ended !== s.ended) {
    submitting = false; selId = null;
    initDraft();
    if (prev && myTurn()) { audio.blip(); if (navigator.vibrate) navigator.vibrate(120); }
    if (prev && s.lastTimeout && prev.turn !== s.turn && prev.you === prev.whose) toast('⏰ Time ran out — your turn was sent as it was');
  }
  render();
}

function initDraft() {
  draft = clone(S.scene);
  if (!myTurn()) return;
  try {
    const saved = JSON.parse(sessionStorage.getItem('tf.draft') || 'null');
    if (saved && saved.code === code && saved.turn === S.turn && saved.you === S.you) { draft = saved.draft; return; }
  } catch { /* ignore */ }
  if (S.you === 'director') {      // fresh turn: last turn's lines and narration are over
    for (const e of draft.entities) if (e.id !== draft.heroId) e.say = '';
    draft.narration = '';
  } else {
    const me = hero(draft); if (me) me.say = '';
    draft.action = '';
  }
}
function changed() {
  sessionStorage.setItem('tf.draft', JSON.stringify({ code, turn: S.turn, you: S.you, draft }));
  render();
}

async function submit() {
  if (submitting || !myTurn()) return;
  submitting = true; render();
  const turn = S.turn, me = hero(draft);
  const body = S.you === 'director' ? { turn, scene: draft } : { turn, x: me && me.x, y: me && me.y, say: me ? me.say : '', action: draft.action };
  try { await act('submit', body, 6); } catch (e) {
    if (S && S.turn === turn) { submitting = false; toast(e.message); render(); }
  }
}

/* ---------- stage rendering (shared by the live stage and the story viewer) ---------- */
function renderStage(root, scene, o = {}) {
  if (!root._els) {
    root._els = new Map();
    root.append(h('div', { class: 'bg' }), h('div', { class: 'ents' }), h('div', { class: 'bubbles' }), h('div', { class: 'strip act' }), h('div', { class: 'strip narr' }));
    const fit = () => root.style.setProperty('--u', root.clientWidth / 8 + 'px');
    new ResizeObserver(fit).observe(root); fit();
  }
  const [bg, ents, bubbles, actEl, narrEl] = root.children;
  const css = backdropCss(code, scene.backdrop);
  if (bg._css !== css) { bg._css = css; bg.style.background = css; }

  const live = new Set();
  for (const e of scene.entities) {
    live.add(e.id);
    let el = root._els.get(e.id);
    if (!el) { el = h('div', { class: 'ent' }); el.dataset.id = e.id; root._els.set(e.id, el); ents.append(el); }
    if (el._asset !== e.asset) {
      el._asset = e.asset;
      el.replaceChildren(e.asset.startsWith('c:')
        ? h('img', { class: 'glyph', src: assetUrl(code, e.asset), alt: '', draggable: 'false' })
        : h('span', { class: 'glyph' }, e.asset.slice(2)));
    }
    el.className = 'ent' + (e.flip ? ' flip' : '') + (e.id === scene.heroId ? ' hero' : '') + (e.id === o.selId ? ' sel' : '');
    el.style.left = e.x * 100 + '%'; el.style.top = e.y * 100 + '%';
    el.style.fontSize = `calc(var(--u) * ${e.scale})`;
    el.style.zIndex = Math.round(e.y * 1000) + 1;
  }
  for (const [id, el] of root._els) if (!live.has(id)) { el.remove(); root._els.delete(id); }

  bubbles.replaceChildren(...scene.entities.filter((e) => e.say).map((e) => h('div', {
    class: 'bubble',
    style: `left:${clamp(e.x, 0.24, 0.76) * 100}%;bottom:min(calc(${(1 - e.y) * 100}% + var(--u) * ${e.scale * 1.22 + 0.12}),82%);z-index:${Math.round(e.y * 1000) + 2000}`,
  }, e.say)));
  actEl.textContent = scene.action ? `✋ ${o.playerName || 'Player'}: ${scene.action}` : '';
  narrEl.textContent = scene.narration || '';
}

/* ---------- stage input ---------- */
const stage = $('#stage');
let drag = null;
function stagePos(ev) {
  const r = stage.getBoundingClientRect();
  return { x: clamp((ev.clientX - r.left) / r.width, 0, 1), y: clamp((ev.clientY - r.top) / r.height, 0, 1) };
}
stage.addEventListener('pointerdown', (ev) => {
  if (!myTurn() || submitting) return;
  ev.preventDefault();
  if (document.activeElement && document.activeElement.blur && /INPUT|TEXTAREA/.test(document.activeElement.tagName)) document.activeElement.blur();
  const p = stagePos(ev);
  if (S.you === 'player') {
    const me = hero(draft);
    if (!me) return toast('You have no character on stage right now — speak or act instead');
    drag = { e: me, dx: 0, dy: 0 };
    me.x = p.x; me.y = clamp(p.y, 0.08, 1);
  } else {
    const el = ev.target.closest('.ent');
    const e = el && draft.entities.find((x) => x.id === el.dataset.id);
    selId = e ? e.id : null;
    drag = e ? { e, dx: e.x - p.x, dy: e.y - p.y } : null;
  }
  if (drag) stage.setPointerCapture(ev.pointerId);
  render();
});
stage.addEventListener('pointermove', (ev) => {
  if (!drag) return;
  const p = stagePos(ev);
  drag.e.x = clamp(p.x + drag.dx, 0, 1); drag.e.y = clamp(p.y + drag.dy, 0.08, 1);
  renderStage(stage, draft, stageOpts());
});
const endDrag = () => { if (drag) { drag = null; if (myTurn()) changed(); } };
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

/* ---------- chrome: top bar, banner, clock ---------- */
function shareLink() {
  const url = location.origin + location.pathname + '#' + code;
  if (navigator.share) navigator.share({ title: 'Twofold', text: 'Join my story on Twofold', url }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Invite link copied'), () => prompt('Copy this invite link', url));
  else prompt('Copy this invite link', url);
}
function renderChrome() {
  if (!S) return;
  const who = (role, icon) => h('span', { class: 'who' + (S.you === role ? ' me' : '') + (!S.ended && S.whose === role ? ' turn' : '') },
    h('i', { class: 'dot' + (S.online[role] ? ' on' : '') }), (S.bot === role ? '🤖' : icon) + ' ', h('b', {}, S.joined[role] ? S.names[role] : '…'));
  $('#top').replaceChildren(
    who('director', '🎬'), who('player', '🧑'), h('span', { class: 'grow' }), h('span', { class: 'code' }, code),
    h('button', { onclick: openStory, 'aria-label': 'Story so far' }, '📖'),
    h('button', { onclick: (e) => { audio.unlock(); e.currentTarget.textContent = audio.toggleMute() ? '🔇' : '🔊'; }, 'aria-label': 'Sound' }, audio.muted ? '🔇' : '🔊'));

  const b = $('#banner'); let content = null;
  if (!connected) content = ['📡 Reconnecting…'];
  else if (S.ended) content = ['🎬 The End.', h('button', { onclick: openStory }, 'Read the story')];
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
  const r = S.paused ? S.remainingMs : Math.max(0, localDeadline - performance.now());
  bar.style.width = Math.min(100, (r / (S.settings.turnSeconds * 1000 || 1)) * 100) + '%';
  bar.className = r < 10000 ? 'low' : '';
  if (lab) lab.textContent = ' · ' + fmt(r) + (S.paused ? ' ⏸' : '');
  if (r <= 0 && !S.paused && myTurn() && !submitting && autoTurn !== S.turn) { autoTurn = S.turn; submit(); }
}
setInterval(tick, 250);

/* ---------- panel + footer ---------- */
const stageOpts = () => ({ selId: myTurn() && S.you === 'director' ? selId : null, playerName: S.names.player });

function render() {
  if (!S) return;
  const scene = shown();
  renderStage(stage, scene, stageOpts());
  stage.classList.toggle('edit', myTurn());
  audio.setMood(scene.mood);
  renderChrome();
  const key = [S.you, S.turn, S.whose, S.ended, S.joined.player, S.joined.director, submitting, tab, catId, selId, S.assets.length, S.settings.turnSeconds].join('|');
  if (key !== uiKey) { uiKey = key; buildPanel(); buildFoot(); } else refreshMarks();
  tick();
}

function recap(scene) {
  const lines = [];
  if (scene.narration) lines.push(h('div', {}, h('i', {}, scene.narration)));
  for (const e of scene.entities) if (e.say) lines.push(h('div', {}, glyph(e.asset), ' “' + e.say + '”'));
  if (scene.action) lines.push(h('div', {}, `✋ ${S.names.player} ${scene.action}`));
  return lines.length ? h('div', { class: 'card recap' }, lines) : null;
}
const glyph = (asset) => (asset.startsWith('c:') ? h('img', { src: assetUrl(code, asset), alt: '', style: 'height:1.2em;vertical-align:middle' }) : asset.slice(2));

function buildPanel() {
  const p = $('#panel'); p.replaceChildren();
  if (S.ended) return void p.append(h('div', { class: 'card' }, h('h3', {}, 'The story has ended'), h('p', { class: 'dim' }, 'Flip through it together, or start a new one.')), recap(S.scene) || '');
  if (!myTurn() || S.you !== 'director') {
    const tips = S.you === 'spectator' ? null
      : myTurn() ? ['Your turn', 'Tap or drag on the stage to move. Then say something, do something — or both — and end your turn.']
        : S.you === 'player' ? [S.turn === 0 ? `${S.names.director} is setting the stage…` : `${S.names.director} is deciding what happens…`, 'The whole world is in their hands. Watch the stage.']
          : [`${S.names.player} is making a move…`, 'When they finish you can change anything: the cast, the place, the music, what everybody says.'];
    if (tips) p.append(h('div', { class: 'card' }, h('h3', {}, tips[0]), h('p', { class: 'dim' }, tips[1])));
    const r = recap(S.scene); if (r) p.append(r);
    return;
  }
  /* --- Director's toolbox --- */
  const sel = draft.entities.find((e) => e.id === selId);
  if (sel) {
    const say = h('input', { placeholder: 'What do they say?', maxlength: 160, value: sel.say, enterkeyhint: 'done', oninput: (ev) => { sel.say = ev.target.value; changedQuiet(); } });
    const btn = (label, title, fn, on) => h('button', { title, 'aria-label': title, class: on ? 'on' : '', onclick: () => { fn(); changed(); } }, label);
    p.append(h('div', { class: 'seltools' },
      h('div', { class: 'row' }, h('span', { style: 'font-size:28px' }, glyph(sel.asset)), say),
      h('div', { class: 'row' },
        btn('➖', 'Smaller', () => { sel.scale = clamp(sel.scale / 1.3, 0.4, 5); }),
        btn('➕', 'Bigger', () => { sel.scale = clamp(sel.scale * 1.3, 0.4, 5); }),
        btn('↔️', 'Flip', () => { sel.flip = !sel.flip; }),
        btn('🧑 Hero', "Make this the Player's character", () => { draft.heroId = draft.heroId === sel.id ? null : sel.id; uiKey = ''; }, draft.heroId === sel.id),
        btn('🗑️', 'Remove', () => { draft.entities = draft.entities.filter((e) => e !== sel); if (draft.heroId === sel.id) draft.heroId = null; selId = null; }))));
  }
  p.append(h('div', { class: 'tabs' }, [['cast', '🎭 Cast'], ['place', '🌄 Place'], ['mood', '🎵 Mood'], ['more', '⚙️ More']]
    .map(([id, label]) => h('button', { class: tab === id ? 'on' : '', onclick: () => { tab = id; render(); } }, label))));

  if (tab === 'cast') {
    const grid = h('div', { class: 'grid' });
    const fill = () => {
      const q = search.trim().toLowerCase();
      let items;
      if (q) items = CATEGORIES.flatMap((c) => c.items).filter((i) => i.name.includes(q));
      else if (catId === 'custom') items = S.assets.filter((a) => a.kind === 'sprite').map((a) => ({ asset: 'c:' + a.id, name: a.name }));
      else items = CATEGORIES.find((c) => c.id === catId).items;
      grid.replaceChildren(...items.map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => addEntity(i.asset) }, glyph(i.asset))));
      if (!items.length) grid.append(h('p', { class: 'dim', style: 'grid-column:1/-1;margin:4px' }, q ? 'Nothing found — try the ✨ Custom tab to make it.' : 'Nothing here yet. Create something below.'));
    };
    p.append(
      h('input', { type: 'search', placeholder: '🔍 Search the cast (dragon, door, key…)', value: search, enterkeyhint: 'search', oninput: (ev) => { search = ev.target.value; fill(); } }),
      h('div', { class: 'chips' }, [...CATEGORIES, { id: 'custom', label: '✨ Custom' }].map((c) => h('button', { class: c.id === catId ? 'on' : '', onclick: () => { catId = c.id; search = ''; render(); } }, c.label))),
      grid);
    fill();
    if (catId === 'custom') {
      const any = h('input', { placeholder: 'Any emoji or short text', maxlength: 24 });
      p.append(maker('sprite', (id) => addEntity('c:' + id)),
        h('div', { class: 'row' }, any, h('button', { onclick: () => { const v = any.value.trim(); if (v) { addEntity('e:' + v); any.value = ''; } } }, 'Add')));
    }
  } else if (tab === 'place') {
    const drop = (id, name) => h('button', { 'data-drop': id, class: draft.backdrop === id ? 'on' : '', style: `background:${backdropCss(code, id)}`, onclick: () => { draft.backdrop = id; changed(); } }, name);
    p.append(h('div', { class: 'grid drops' }, BACKDROPS.map((b) => drop(b.id, b.name)), S.assets.filter((a) => a.kind === 'backdrop').map((a) => drop('c:' + a.id, a.name))),
      maker('backdrop', (id) => { draft.backdrop = 'c:' + id; changed(); }));
  } else if (tab === 'mood') {
    p.append(h('div', { class: 'list' }, MOODS.map((m) => h('button', { 'data-mood': m.id, class: draft.mood === m.id ? 'on' : '', onclick: () => { audio.unlock(); draft.mood = m.id; changed(); } }, m.name))),
      h('p', { class: 'dim', style: 'font-size:13px;margin:0' }, 'Both of you hear the mood once your turn is sent.'));
  } else {
    const sel2 = h('select', { onchange: (ev) => act('settings', { turnSeconds: Number(ev.target.value) }, 3).catch((e) => toast(e.message)) },
      [[0, 'No time limit'], [30, '30 seconds'], [45, '45 seconds'], [60, '1 minute'], [90, '1½ minutes'], [120, '2 minutes'], [180, '3 minutes']]
        .map(([v, l]) => h('option', { value: v, selected: S.settings.turnSeconds === v }, l)));
    p.append(
      h('div', { class: 'card' }, h('h3', {}, '⏱ Time per turn'), sel2, h('p', { class: 'dim', style: 'font-size:13px' }, 'Applies from the next turn. The clock pauses if either of you drops off.')),
      h('div', { class: 'card' }, h('h3', {}, `Story code: ${code}`), h('div', { class: 'row' }, h('button', { class: 'grow', onclick: shareLink }, S.bot ? '🔗 Let someone watch' : '🔗 Share invite link'), h('button', { class: 'grow', onclick: openStory }, '📖 Story so far'))),
      h('button', { class: 'danger', onclick: () => { if (confirm('End the story for both of you?')) act('end', {}, 3).catch((e) => toast(e.message)); } }, '🎬 End the story'),
      h('button', { class: 'link', onclick: () => leave() }, 'Leave to the start screen'));
  }
}
/** A draft edit that must not rebuild the panel (the user is typing in it). */
function changedQuiet() {
  sessionStorage.setItem('tf.draft', JSON.stringify({ code, turn: S.turn, you: S.you, draft }));
  renderStage(stage, draft, stageOpts());
}
function refreshMarks() {
  for (const b of document.querySelectorAll('[data-drop]')) b.classList.toggle('on', draft.backdrop === b.dataset.drop);
  for (const b of document.querySelectorAll('[data-mood]')) b.classList.toggle('on', draft.mood === b.dataset.mood);
}
function addEntity(asset) {
  if (draft.entities.length >= 80) return toast('The stage is full');
  const e = { id: rid(), asset, x: 0.3 + Math.random() * 0.4, y: 0.6 + Math.random() * 0.25, scale: 1, flip: false, say: '' };
  draft.entities.push(e); selId = e.id; changed();
}

/** Upload-or-generate box. Both paths end in a custom asset stored with the story. */
function maker(kind, onAsset) {
  const what = kind === 'backdrop' ? 'backdrop' : 'character or thing';
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
  const done = (r) => { uiKey = ''; onAsset(r.asset.id); };
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

function buildFoot() {
  const f = $('#foot'); f.replaceChildren();
  const tl = () => h('span', { id: 'tlabel' });
  if (S.ended) return void f.append(h('button', { class: 'go primary', onclick: openStory }, '📖 Read the story'), h('button', { class: 'link', onclick: () => leave() }, 'Start a new story'));
  if (S.you === 'spectator') return void f.append(h('div', { class: 'status' }, `${S.names[S.whose]}'s turn`, tl()));
  if (!myTurn()) return void f.append(h('div', { class: 'status' }, `⏳ Waiting for ${S.joined[other()] ? S.names[other()] : 'your partner'}`, tl()));
  if (submitting) return void f.append(h('div', { class: 'status' }, 'Sending…'));
  if (S.you === 'director') {
    const ready = S.joined.player;
    f.append(
      h('input', { placeholder: '📝 Narrate… (“Suddenly, the lights go out.”)', maxlength: 240, value: draft.narration, enterkeyhint: 'done', oninput: (ev) => { draft.narration = ev.target.value; changedQuiet(); } }),
      h('button', { class: 'go primary', disabled: !ready, onclick: submit }, ready ? (S.turn === 0 ? 'Begin the story ▶' : 'End turn ▶') : 'Waiting for your Player to join…', tl()));
  } else {
    const me = hero(draft);
    f.append(
      h('input', { placeholder: '💬 Say something…', maxlength: 160, value: me ? me.say : '', disabled: !me, enterkeyhint: 'next', oninput: (ev) => { me.say = ev.target.value; changedQuiet(); } }),
      h('input', { placeholder: '✋ Do something… (“open the drawer”)', maxlength: 160, value: draft.action, enterkeyhint: 'done', oninput: (ev) => { draft.action = ev.target.value; changedQuiet(); } }),
      h('button', { class: 'go primary', onclick: submit }, 'End turn ▶', tl()));
  }
}

/* ---------- story viewer (flipbook of every committed turn) ---------- */
let story = null, storyAt = 0, storyTimer = null;
async function openStory() {
  try { story = await api(`/api/rooms/${code}/history`); } catch (e) { return toast(e.message); }
  if (!story.history.length) return toast('The story has not begun yet');
  storyAt = story.history.length - 1;
  $('#story').hidden = false; showFrame();
}
function showFrame() {
  const fr = story.history[storyAt];
  renderStage($('#storyStage'), fr.scene, { playerName: story.names.player });
  $('#storyCap').textContent = `Page ${storyAt + 1} of ${story.history.length} · ${fr.by === 'director' ? '🎬 ' + story.names.director : '🧑 ' + story.names.player}${fr.timeout ? ' (ran out of time)' : ''}`;
}
function stopPlay() { clearInterval(storyTimer); storyTimer = null; $('#storyPlay').textContent = '▶ Play'; }
$('#storyPrev').onclick = () => { stopPlay(); storyAt = Math.max(0, storyAt - 1); showFrame(); };
$('#storyNext').onclick = () => { stopPlay(); storyAt = Math.min(story.history.length - 1, storyAt + 1); showFrame(); };
$('#storyPlay').onclick = () => {
  if (storyTimer) return stopPlay();
  if (storyAt >= story.history.length - 1) storyAt = 0;
  showFrame(); $('#storyPlay').textContent = '⏸ Pause';
  storyTimer = setInterval(() => { if (storyAt >= story.history.length - 1) return stopPlay(); storyAt++; showFrame(); }, 3000);
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
  es = null; code = null; S = null;
  audio.setMood('m:none');
  history.replaceState(null, '', location.pathname);
  $('#story').hidden = true; $('#game').hidden = true; $('#home').hidden = false;
  $('#invite').hidden = true; $('#newBtns').hidden = false; codeEl.value = '';
  errEl.textContent = msg || '';
}
async function create(role, bot) {
  errEl.textContent = '';
  try { enter((await api('/api/rooms', { token, name: myName(), role, bot: !!bot })).code); } catch (e) { errEl.textContent = e.message; }
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
$('#newDirector').onclick = () => create('director');
$('#newPlayer').onclick = () => create('player');
$('#soloPlayer').onclick = () => create('player', true);
$('#soloDirector').onclick = () => create('director', true);
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
boot();
