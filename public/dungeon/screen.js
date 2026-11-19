/* Dungeon mode: the screen. Castle editor, the game canvas, the hero's controls and the Overlord's panel.
 * The rules live in shared/dungeon-rules.js. One browser is the "host" and runs them (the hero's, normally);
 * the other watches snapshots and sends Overlord commands through the server. */
import { h, $, fill, add, toast } from '../core/dom.js';
import { audio } from '../core/audio.js';
import { act } from '../core/net.js';
import { History } from '../core/history.js';
import { spriteView } from '../core/catalog.js';
import * as R from '../shared/dungeon-rules.js';

const TS = 48, W = R.RW * TS, H = R.RH * TS;
let S = null, st = null, run = -1, def = null, mode = 'live';
let tool = null, editKey = null, viewKey = null, hover = null, painting = false;
let uiKey = '', hudKey = '', mapKey = '', lastEv = 0, raf = 0, last = 0, sending = false, sent = '', overTry = 0, saveTimer = 0;
let acc = { snap: 0, hero: 0, lord: 0, ui: 0 }, shake = 0, msgAt = { n: 0, t: 0 }, clock = 0;
const held = [], want = {}, queue = [], disp = new Map(), fxs = [], history = new History(60);

function hot() { return !!S.hotseat; }
function isHost() { return hot() || (S.bot === 'player' ? S.you === 'director' : S.you === 'player'); }
function isLord() { return hot() || S.you === 'director'; }
function heroKeys() { return isHost() && S.bot !== 'player'; }
function soloHero() { return S.bot === 'director' && S.you === 'player'; }

/* ---------- sprites ---------- */
const imgs = new Map();
function img(slug) {
  let i = imgs.get(slug);
  if (!i) { i = new Image(); i.src = spriteView(null, 'p:' + slug).img; imgs.set(slug, i); }
  return i.complete && i.naturalWidth ? i : null;
}
function icon(slug) { return h('img', { src: spriteView(null, 'p:' + slug).img, class: 'px', alt: '' }); }
function spr(g, slug, x, y, o = {}) {
  const i = img(slug);
  if (!i) return;
  const s = TS * (o.scale || 1);
  g.save();
  g.translate(x * TS + TS / 2, y * TS + TS / 2 + (o.dy || 0));
  if (o.rot) g.rotate(o.rot);
  if (o.flip) g.scale(-1, 1);
  if (o.alpha != null) g.globalAlpha *= o.alpha;
  g.drawImage(i, -s / 2, -s / 2, s, s);
  g.restore();
}
function hash(k, x, y) { let n = (x * 73856093) ^ (y * 19349663) ^ (k.charCodeAt(0) * 83492791) ^ (k.charCodeAt(2) * 2971); n = (n ^ (n >>> 13)) * 1274126177; return ((n ^ (n >>> 16)) >>> 0) % 100; }
const SIDE_ROT = { N: 0, S: Math.PI, W: -Math.PI / 2, E: Math.PI / 2 };
const ARROW_ROT = { '>': 0, V: Math.PI / 2, '<': Math.PI, A: -Math.PI / 2 };
const MOB_BY_CH = Object.fromEntries(Object.entries(R.MOBS).map(([k, m]) => [m.ch, k]));

function drawTile(g, ch, x, y, key, up, t) {
  const v = hash(key, x, y), edge = x === 0 || y === 0 || x === R.RW - 1 || y === R.RH - 1;
  spr(g, v < 6 ? 'dungeon-floor-cracked' : v < 11 ? 'dungeon-floor-mossy' : v < 14 ? 'dungeon-floor-slab' : 'tile-dungeon-floor', x, y);
  const side = R.doorSide(x, y), rot = side ? SIDE_ROT[side] : 0;
  switch (ch) {
    case '.': break;
    case '#': spr(g, edge && v > 92 ? 'dungeon-wall-mossy' : 'dungeon-wall', x, y); break;
    case 'T': spr(g, 'dungeon-wall-torch', x, y); break;
    case '%': spr(g, 'dungeon-wall-cracked', x, y); break;
    case '~': spr(g, 'water', x, y); break;
    case 'o': spr(g, 'pit', x, y); break;
    case '^': spr(g, up ? 'dungeon-spikes-up' : 'dungeon-spikes-down', x, y); break;
    case 'b': spr(g, 'barrel', x, y, { scale: 0.9 }); break;
    case 'r': spr(g, 'rubble', x, y); break;
    case 'D': g.fillStyle = '#0b0910'; g.fillRect(x * TS, y * TS, TS, TS); spr(g, 'dungeon-doorway', x, y, { rot }); break;
    case 'L': spr(g, 'dungeon-wall', x, y); spr(g, 'dungeon-door-locked', x, y, { rot }); break;
    case 'G': if (edge) spr(g, 'dungeon-wall', x, y); spr(g, edge ? 'dungeon-door-iron' : 'iron-gate', x, y, { rot }); break;
    case '_': spr(g, 'dungeon-plate', x, y); break;
    case '-': spr(g, 'dungeon-plate-down', x, y); break;
    case '>': case '<': case 'A': case 'V': spr(g, 'dungeon-wall', x, y); spr(g, 'arrow-right', x, y, { rot: ARROW_ROT[ch], scale: 0.62 }); break;
    case 'c': spr(g, 'chest', x, y, { scale: 0.9 }); break;
    case 'C': spr(g, 'chest-open', x, y, { scale: 0.9 }); break;
    case 'X': spr(g, 'dungeon-floor-rune', x, y); g.fillStyle = `rgba(255,220,90,${0.16 + 0.1 * Math.sin(t * 3)})`; g.beginPath(); g.arc(x * TS + TS / 2, y * TS + TS / 2, TS * 0.7, 0, 7); g.fill(); spr(g, 'crown', x, y, { scale: 0.8, dy: Math.sin(t * 3) * 3 - 3 }); break;
    case 'S': spr(g, 'knight', x, y, { alpha: 0.9 }); break;
    default:
      if (R.LOOT[ch]) spr(g, R.LOOT[ch].sprite, x, y, { scale: 0.7 });
      else if (MOB_BY_CH[ch]) spr(g, R.MOBS[MOB_BY_CH[ch]].sprite, x, y, { scale: R.MOBS[MOB_BY_CH[ch]].big ? 1.5 : 1 });
  }
}
function drawRoom(g, t, key, up, time) { for (let y = 0; y < R.RH; y++) for (let x = 0; x < R.RW; x++) drawTile(g, t[y * R.RW + x], x, y, key, up, time); }

/* things glide between tiles instead of jumping */
function glide(id, x, y, dt, speed = 11) {
  let p = disp.get(id);
  if (!p || Math.abs(p.x - x) + Math.abs(p.y - y) > 3) { p = { x, y }; disp.set(id, p); }
  const d = Math.hypot(x - p.x, y - p.y), s = speed * dt;
  if (d <= s) { p.x = x; p.y = y; } else { p.x += ((x - p.x) / d) * s; p.y += ((y - p.y) / d) * s; }
  p.seen = clock;
  return p;
}
const DIR_ANGLE = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };

function draw(dt) {
  const cv = $('#rpgCanvas'), g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = '#0b0910'; g.fillRect(0, 0, W, H);
  const phase = S.rpg.phase;
  if (phase === 'build') {
    if (!def || !isLord() || !def.rooms[editKey]) return;
    drawRoom(g, def.rooms[editKey].t, editKey, true, clock);
    if (hover) { g.strokeStyle = '#f2a83b'; g.lineWidth = 3; g.strokeRect(hover.x * TS + 1.5, hover.y * TS + 1.5, TS - 3, TS - 3); }
    return;
  }
  if (!st) return;
  const key = isLord() && viewKey && st.rooms[viewKey] ? viewKey : st.cur, here = key === st.cur, room = st.rooms[key], hero = st.hero, t = st.t;
  if (shake > 0) { shake -= dt; g.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10); }
  drawRoom(g, room.t, key, st.spikes, clock);
  for (const it of st.items) if (it.r === key) spr(g, R.LOOT[it.k].sprite, it.x, it.y, { scale: 0.66, dy: Math.sin(clock * 4 + it.id) * 2.5 });
  if (here) for (const b of st.bombs) spr(g, 'bomb', b.x, b.y, { scale: 0.7 + 0.12 * Math.sin(clock * 22) });
  for (const m of st.mobs) {
    if (m.r !== key) continue;
    const T = R.MOBS[m.k], p = here ? glide(m.id, m.x, m.y, dt, 1.25 / T.iv) : m, fresh = Math.min(1, (t - m.born) / 0.8), hurt = t - m.hurt < 0.18, wind = m.wind > 0;
    g.save();
    if (hurt) g.filter = 'brightness(2.6)';
    spr(g, T.sprite, p.x + (wind ? Math.sin(clock * 60) * 0.04 : 0), p.y, { flip: m.dir < 0, scale: (T.big ? 1.6 : 1) * (0.5 + fresh * 0.5), alpha: fresh < 1 ? 0.35 + fresh * 0.5 : T.ghost ? 0.8 : 1, dy: T.fly ? Math.sin(clock * 7 + m.id) * 3 - 3 : 0 });
    g.restore();
    if (wind) { g.font = `bold ${TS * 0.5}px sans-serif`; g.textAlign = 'center'; g.fillStyle = '#ff5a4a'; g.fillText('!', p.x * TS + TS / 2, p.y * TS - 2); }
    if (m.hp < T.hp || T.big) { const w = TS * (T.big ? 1.3 : 0.8), x0 = p.x * TS + TS / 2 - w / 2, y0 = p.y * TS - (T.big ? 16 : 5); g.fillStyle = '#1b1220'; g.fillRect(x0 - 1, y0 - 1, w + 2, 6); g.fillStyle = '#e0445a'; g.fillRect(x0, y0, w * Math.max(0, m.hp / Math.max(T.hp, m.hp)), 4); }
  }
  if (here) {
    for (const s of st.shots) { const p = glide('s' + s.id, s.x, s.y, dt, 13); spr(g, s.k === 'fire' ? 'fireball' : 'arrow-right', p.x, p.y, { rot: Math.atan2(s.dy, s.dx), scale: 0.7 }); }
    const p = glide('h', hero.x, hero.y, dt, 8.5), blink = t < hero.inv && Math.floor(clock * 14) % 2 === 0, swing = (t - hero.atk) / 0.2;
    if (!blink && st.phase !== 'lost') spr(g, 'knight', p.x, p.y, { flip: hero.dir === 'left', dy: p.x !== hero.x || p.y !== hero.y ? Math.sin(clock * 24) * 2 : 0 });
    if (st.phase === 'lost') spr(g, 'skull', p.x, p.y, { scale: 0.8 });
    if (swing >= 0 && swing < 1 && (st.mode === 'live' || clock - swingAt < 0.2)) {
      const a = DIR_ANGLE[hero.dir] + (swing - 0.5) * 1.5, d = R.DIRS[hero.dir];
      spr(g, hero.sword > 1 ? 'sword-gold' : 'sword', p.x + d[0] * 0.75 + Math.cos(a) * 0.1, p.y + d[1] * 0.75 + Math.sin(a) * 0.1, { rot: a + Math.PI / 4, scale: 0.85 });
    }
  }
  for (let i = fxs.length - 1; i >= 0; i--) {
    const f = fxs[i], k = (clock - f.t) / f.len;
    if (k >= 1) { fxs.splice(i, 1); continue; }
    if (f.sprite) spr(g, f.sprite, f.x, f.y, { scale: f.scale * (0.6 + k * 0.7), alpha: 1 - k });
    else if (f.text) { g.font = `bold ${TS * 0.42}px sans-serif`; g.textAlign = 'center'; g.globalAlpha = 1 - k * k; g.fillStyle = '#1b1220'; g.fillText(f.text, f.x * TS + TS / 2 + 2, f.y * TS + 10 - k * TS * 0.9 + 2); g.fillStyle = f.c; g.fillText(f.text, f.x * TS + TS / 2, f.y * TS + 10 - k * TS * 0.9); g.globalAlpha = 1; }
    else { g.globalAlpha = 1 - k; g.fillStyle = f.c; for (let j = 0; j < 7; j++) { const a = j * 0.9 + f.t, r = k * TS * 0.9; g.fillRect(f.x * TS + TS / 2 + Math.cos(a) * r - 3, f.y * TS + TS / 2 + Math.sin(a) * r - 3, 6, 6); } g.globalAlpha = 1; }
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (st.dark > t && here) {                                        // lights out: the hero sees only what is near
    const p = disp.get('h') || hero, cx = p.x * TS + TS / 2, cy = p.y * TS + TS / 2;
    const grad = g.createRadialGradient(cx, cy, TS * 0.8, cx, cy, TS * 3.1);
    const a = heroKeys() && !hot() ? 0.97 : 0.55;
    grad.addColorStop(0, 'rgba(5,3,10,0)'); grad.addColorStop(1, `rgba(5,3,10,${a})`);
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
  }
  if (!here) { g.fillStyle = 'rgba(40,20,70,.28)'; g.fillRect(0, 0, W, H); }
  if (isLord() && hover && tool && phase === 'play') {
    const ok = R.canPlace(st, key, hover.x, hover.y);
    g.strokeStyle = ok ? '#b98cff' : '#f06a6a'; g.lineWidth = 3; g.strokeRect(hover.x * TS + 1.5, hover.y * TS + 1.5, TS - 3, TS - 3);
    if (ok) { g.globalAlpha = 0.6; spr(g, tool === 'spikes' ? 'dungeon-spikes-up' : R.MOBS[tool].sprite, hover.x, hover.y); g.globalAlpha = 1; }
  }
  for (const [id, p] of disp) if (p.seen !== clock) disp.delete(id);
}
let swingAt = 0;

/* ---------- what just happened: sounds and sparks ---------- */
const EV_SFX = { swing: 'swish', hit: 'hit', hurt: 'ouch', dead: 'fail', win: 'fanfare', levelup: 'levelup', coin: 'coin', heal: 'heal', key: 'pickup', pickup: 'pickup', door: 'steps', unlock: 'unlock', locked: 'lock',
  chest: 'magic', plate: 'lock', gate: 'unlock', slam: 'slam', dark: 'spell', quake: 'thunder', shoot: 'twang', spawn: 'teleport', boom: 'boom', fuse: 'tick', break: 'hit', fall: 'fall', wind: 'tick', roar: 'growl', whisper: 'ghost', mend: 'heal', click: 'lock' };
function onEv(e) {
  const a = audio, spark = (o) => fxs.push({ t: clock, len: 0.45, c: '#fff', x: e.x, y: e.y, ...o });
  if (e.k === 'spook') a.sfx(e.v); else if (e.k === 'kill') a.sfx(e.v ? 'boom' : 'pop'); else if (e.k === 'lordturn' || e.k === 'heroturn') a.blip(); else if (e.k !== 'step' && EV_SFX[e.k]) a.sfx(EV_SFX[e.k]);
  if (e.k === 'step' && e.n % 2) a.sfx('step');
  if (e.k === 'swing') swingAt = clock;
  if (e.k === 'hit') { spark({ c: '#ffd75a' }); spark({ text: '-' + e.v, c: '#ffd75a', len: 0.7 }); }
  if (e.k === 'hurt') { spark({ c: '#f0445a' }); spark({ text: '-' + e.v, c: '#ff6a7a', len: 0.8 }); shake = 0.22; }
  if (e.k === 'kill') spark({ sprite: 'explosion', scale: e.v ? 2.4 : 1, len: 0.4 });
  if (e.k === 'boom') { spark({ sprite: 'explosion-big', scale: 2.6, len: 0.5 }); shake = 0.35; }
  if (e.k === 'spawn') spark({ c: '#b98cff', len: 0.7 });
  if (e.k === 'break') spark({ c: '#b08d5a' });
  if (e.k === 'heal' || e.k === 'mend') spark({ c: '#6be08a', len: 0.7 });
  if (e.k === 'coin' || e.k === 'key' || e.k === 'pickup' || e.k === 'chest') spark({ c: '#ffe45c' });
  if (e.k === 'levelup') spark({ text: 'LEVEL UP', c: '#8ff0a6', len: 1.4 });
  if (e.k === 'quake' || e.k === 'slam') shake = 0.6;
  if (e.k === 'spook' && e.v === 'thunder') shake = 0.4;
}

/* ---------- the loop ---------- */
function hostStep(dt) {
  if (S.rpg.phase !== 'play' || st.phase !== 'play') return;
  const bot = S.bot === 'player', now = clock;
  const tryWant = (k) => { if (want[k] > now && R.heroAct(st, { k })) want[k] = 0; };
  if (st.mode === 'live') {
    if (!bot) { tryWant('attack'); tryWant('potion'); tryWant('bomb'); const d = held[held.length - 1]; if (d) R.heroAct(st, { k: 'move', dir: d }); }
    else if ((acc.hero += dt) > 0.19) { acc.hero = 0; const a = R.autoHero(st); if (a) R.heroAct(st, a); }
    R.advance(st, dt);
    R.autoLord(st);
  } else if (st.turn.who === 'hero') {
    acc.lord = 0;
    if (bot) { if ((acc.hero += dt) > 0.3) { acc.hero = 0; const a = R.autoHero(st) || { k: 'wait' }; if (!R.heroAct(st, a)) R.heroAct(st, { k: 'wait' }); } }
    else if (queue.length) R.heroAct(st, queue.shift());
  } else { queue.length = 0; if (st.autoLord && (acc.lord += dt) > 0.9) { acc.lord = 0; R.autoLord(st); } }
}
function post(dt) {
  if (!isHost() || !st || S.rpg.phase !== 'play') return;
  const over = st.phase !== 'play', watched = !hot() && !S.bot;
  acc.snap += dt;
  if (sending) return;
  if (over) { if (clock < overTry) return; overTry = clock + 1.5; }
  else { const sig = st.seq + ':' + st.t + ':' + st.dread; if (acc.snap < (watched ? 0.15 : 4) || sig === sent) return; sent = sig; }
  acc.snap = 0; sending = true;
  act('rpgSnap', { run, state: st, over: over ? st.phase : undefined }).catch(() => {}).finally(() => { sending = false; });
}
function frame(ms) {
  raf = requestAnimationFrame(frame);
  if (!S || $('#rpg').hidden) return;
  const dt = Math.min(0.1, (ms - last) / 1000 || 0); last = ms; clock += dt;
  if (st && isHost()) hostStep(dt);
  if (st) {
    for (const e of st.ev) if (e.n > lastEv) { lastEv = e.n; onEv(e); }
    if (st.msg && st.msg.n !== msgAt.n) { msgAt = { n: st.msg.n, t: clock }; }
  }
  post(dt);
  draw(dt);
  if ((acc.ui += dt) > 0.12) { acc.ui = 0; refresh(); }
}

/* ---------- keys ---------- */
const KEY_DIR = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
const KEY_ACT = { ' ': 'attack', j: 'attack', z: 'attack', q: 'potion', c: 'potion', e: 'bomb', x: 'bomb' };
let lastKey = 0;
function onKey(e) {
  if (!S || $('#rpg').hidden) return;
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
  if (S.rpg.phase === 'build') { if (e.type === 'keydown' && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); undoEdit(); } return; }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, dir = KEY_DIR[k], actn = KEY_ACT[k];
  if (e.type === 'keydown' && k === 'Escape') { tool = null; uiKey = ''; return; }
  if (!dir && !actn) return;
  if (!heroKeys() || S.rpg.phase !== 'play') return;
  e.preventDefault();
  if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  if (e.type === 'keyup') { if (dir) { const i = held.indexOf(dir); if (i >= 0) held.splice(i, 1); } return; }
  if (st && st.mode === 'turn') { if (e.repeat && clock - lastKey < 0.13) return; lastKey = clock; if (queue.length < 2) queue.push(dir ? { k: 'move', dir } : { k: actn }); return; }
  if (dir) { if (!e.repeat) { const i = held.indexOf(dir); if (i >= 0) held.splice(i, 1); held.push(dir); } } else if (!e.repeat) want[actn] = clock + 0.22;
}
function press(k) { audio.unlock(); if (st && st.mode === 'turn') queue.push({ k }); else want[k] = clock + 0.3; }

/* ---------- the Overlord's hand ---------- */
function command(c) {
  if (!st || S.rpg.phase !== 'play') return;
  const probe = JSON.parse(JSON.stringify(st)), why = R.lordCmd(probe, c);
  if (why) { toast(why); audio.sfx('error'); return false; }
  if (isHost()) R.lordCmd(st, c);
  else { st = probe; act('rpgCmd', { cmd: c }).catch((e) => toast(e.message)); }       // shown at once; the hero's browser has the last word
  return true;
}
function tileOf(e) {
  const r = $('#rpgCanvas').getBoundingClientRect();
  const x = Math.floor(((e.clientX - r.left) / r.width) * R.RW), y = Math.floor(((e.clientY - r.top) / r.height) * R.RH);
  return x >= 0 && y >= 0 && x < R.RW && y < R.RH ? { x, y } : null;
}
function onPointer(e) {
  if (!S) return;
  const p = tileOf(e), phase = S.rpg.phase;
  if (e.type === 'pointerleave') { hover = null; if (painting) { painting = false; history.note(def); } return; }
  hover = p;
  if (!p) return;
  if (phase === 'build' && isLord() && def) {
    if (e.type === 'pointerdown') { painting = true; try { e.target.setPointerCapture(e.pointerId); } catch { /* fine */ } }
    if (e.type === 'pointerup') { painting = false; history.note(def); }                 // one stroke is one undo step
    if (painting && tool && R.paintTile(def, editKey, p.x, p.y, e.button === 2 || e.buttons === 2 ? '.' : tool)) { R.syncDoors(def); saveSoon(); mapKey = ''; }
  } else if (phase === 'play' && isLord() && e.type === 'pointerdown' && tool) {
    const key = viewKey && st.rooms[viewKey] ? viewKey : st.cur;
    command(tool === 'spikes' ? { k: 'spikes', r: key, x: p.x, y: p.y } : { k: 'spawn', m: tool, r: key, x: p.x, y: p.y });
  }
}

/* ---------- castle editor ---------- */
const PALETTE = [
  ['Build', [['.', 'Floor', 'tile-dungeon-floor'], ['#', 'Wall', 'dungeon-wall'], ['T', 'Torch', 'dungeon-wall-torch'], ['%', 'Cracked wall — a bomb opens it', 'dungeon-wall-cracked'], ['~', 'Water', 'water'], ['o', 'Pit', 'pit'], ['b', 'Barrel', 'barrel'], ['r', 'Rubble', 'rubble']]],
  ['Doors — paint on a doorway', [['D', 'Open door', 'dungeon-doorway'], ['L', 'Locked door — needs a key', 'dungeon-door-locked'], ['G', 'Gate — opens when the room is cleared', 'dungeon-door-iron']]],
  ['Traps & triggers', [['^', 'Spikes', 'dungeon-spikes-up'], ['_', 'Pressure plate', 'dungeon-plate'], ['>', 'Arrow trap →', 'arrow-right'], ['<', 'Arrow trap ←', 'arrow-left'], ['A', 'Arrow trap ↑', 'arrow-up'], ['V', 'Arrow trap ↓', 'arrow-down']]],
  ['Treasure', [['c', 'Chest', 'chest'], ...Object.entries(R.LOOT).map(([ch, l]) => [ch, l.name, l.sprite])]],
  ['Monsters', Object.values(R.MOBS).map((m) => [m.ch, `${m.name} — ${m.hp} health`, m.sprite])],
  ['Start & goal', [['S', 'The hero starts here', 'knight'], ['X', 'The crown — the hero wins by taking it', 'crown']]],
];
/** A finished change to the castle: remembered for undo, saved to the server soon. */
function commit() { history.note(def); saveSoon(); }
function undoEdit() { const earlier = history.undo(); if (!earlier) return; def = earlier; if (!def.rooms[editKey]) editKey = Object.keys(def.rooms)[0] || null; saveSoon(); uiKey = ''; }
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { if (S && S.rpg.phase === 'build' && isLord() && def) act('rpgDef', { def, mode }).catch(() => {}); }, 900); }
function setDef(d) { def = d; editKey = Object.keys(def.rooms).find((k) => def.rooms[k].t.includes('S')) || Object.keys(def.rooms)[0] || null; commit(); uiKey = ''; }
function start() {
  const why = R.checkDef(def);
  if (why) { toast(why); audio.sfx('error'); return; }
  clearTimeout(saveTimer);
  act('rpgStart', { def, mode }).catch((e) => toast(e.message));
}
function modePick() { return h('div', { class: 'seg' },
  h('button', { id: 'rpgLive', class: mode === 'live' ? 'on' : '', onclick: () => { mode = 'live'; saveSoon(); uiKey = ''; } }, '⚡ Live', h('small', {}, 'Everything moves at once')),
  h('button', { id: 'rpgTurn', class: mode === 'turn' ? 'on' : '', onclick: () => { mode = 'turn'; saveSoon(); uiKey = ''; } }, '♟️ Turn-based', h('small', {}, `Hero: ${R.AP} moves, then the Overlord`))); }

function board(pickRoom) {
  const cells = [];
  for (let y = 0; y < R.BH; y++) for (let x = 0; x < R.BW; x++) cells.push(h('button', { 'data-room': R.roomKey(x, y), onclick: () => pickRoom(R.roomKey(x, y)) }));
  return h('div', { class: 'rboard', id: 'rpgBoard' }, cells);
}
function paintBoard() {
  const el = $('#rpgBoard');
  if (!el) return;
  const build = S.rpg.phase === 'build', rooms = build ? def && def.rooms : st && st.rooms;
  if (!rooms) return;
  const key = JSON.stringify([build, editKey, viewKey, st && st.cur, Object.keys(rooms), build ? mapKey : st.mobs.length + ':' + Object.values(st.rooms).map((r) => +r.seen).join('')]);
  if (key === el.dataset.key) return;
  el.dataset.key = key;
  for (const b of el.children) {
    const k = b.dataset.room, r = rooms[k], lord = isLord();
    let cls = '', text = '', title = '';
    if (r) {
      const known = build || lord || r.seen;
      cls = known ? 'room' : 'room unseen';
      if (build) { text = r.t.includes('S') ? '🧍' : r.t.includes('X') ? '👑' : ''; if (k === editKey) cls += ' sel'; title = 'Edit this room'; }
      else {
        const n = st.mobs.filter((m) => m.r === k).length;
        text = k === st.cur ? '🧍' : known && k === st.goal && (lord || r.seen) ? '👑' : lord && n ? '👾' + n : known ? '' : '';
        if (k === st.cur) cls += ' cur';
        if (lord && k === (viewKey || st.cur)) cls += ' sel';
        if (!known) cls = 'room unseen';
        if (!lord && !r.seen) { cls = Object.keys(R.DOORS).some((s) => st.rooms[R.neighbor(k, s)] && st.rooms[R.neighbor(k, s)].seen) ? 'room unseen' : ''; text = cls ? '?' : ''; }
      }
    } else if (build) { const near = !Object.keys(rooms).length || Object.keys(R.DOORS).some((s) => rooms[R.neighbor(k, s)]); cls = near ? 'add' : ''; text = near ? '+' : ''; title = near ? 'Add a room here' : ''; }
    b.className = cls; b.textContent = text; b.title = title; b.disabled = !cls || (!build && !lord);
  }
}

/* ---------- the side panel ---------- */
function side() {
  const p = $('#rpgSide'), g = S.rpg, card = $('#rpgCard');
  card.hidden = true; card.replaceChildren();
  const showCard = (...kids) => { card.hidden = false; fill(card, ...kids); };
  p.replaceChildren();
  if (g.phase === 'build') {
    if (isLord() && def) {
      const room = def.rooms[editKey];
      add(p, 
        h('div', { class: 'rhead' }, h('h3', {}, '🏰 Build your castle'), h('button', { id: 'rpgUndo', title: 'Undo (Ctrl+Z)', onclick: undoEdit }, '↶ Undo')),
        h('input', { id: 'rpgName', placeholder: 'Name of the castle', maxlength: 40, value: def.name || '', oninput: (e) => { def.name = e.target.value; commit(); } }),
        h('small', { class: 'dim' }, 'Rooms — click one to edit it, + to add one'),
        board((k) => { if (def.rooms[k]) editKey = k; else { if (R.addRoom(def, k)) { editKey = k; commit(); } } uiKey = ''; }),
        room && h('div', { class: 'row' },
          h('button', { class: 'grow', onclick: () => { def.rooms[editKey] = { ...R.emptyRoom(), fx: room.fx, msg: room.msg }; for (const s of Object.keys(R.DOORS)) if (def.rooms[R.neighbor(editKey, s)]) def.rooms[editKey].t = R.setCh(def.rooms[editKey].t, ...R.DOORS[s], room.t[R.DOORS[s][1] * R.RW + R.DOORS[s][0]]); R.syncDoors(def); commit(); uiKey = ''; } }, '🧹 Empty this room'),
          h('button', { class: 'grow danger', onclick: () => { R.removeRoom(def, editKey); editKey = Object.keys(def.rooms)[0] || null; commit(); uiKey = ''; } }, '🗑 Remove room')),
        ...PALETTE.flatMap(([name, list]) => [h('small', { class: 'dim grp' }, name), h('div', { class: 'rpal' }, list.map(([ch, label, s]) => h('button', { 'data-tool': ch, class: tool === ch ? 'on' : '', title: label, onclick: () => { tool = ch; uiKey = ''; } }, icon(s))))]),
        h('small', { class: 'dim' }, tool ? `Painting: ${(PALETTE.flatMap((x) => x[1]).find((x) => x[0] === tool) || [])[1] || ''}. Drag on the room; right-click erases.` : 'Pick something above, then paint on the room.'),
        room && h('label', { class: 'rfield' }, h('small', { class: 'dim' }, 'Pressure plates in this room…'), h('select', { id: 'rpgFx', onchange: (e) => { room.fx = e.target.value; commit(); } }, R.PLATE_FX.map(([v, l]) => h('option', { value: v, selected: room.fx === v ? '' : null }, l)))),
        room && h('label', { class: 'rfield' }, h('small', { class: 'dim' }, 'When the hero walks in, you whisper…'), h('input', { id: 'rpgRoomMsg', maxlength: 90, placeholder: 'e.g. Turn back while you can.', value: room.msg || '', oninput: (e) => { room.msg = e.target.value; commit(); } })),
        h('small', { class: 'dim grp' }, 'How it plays'), modePick(),
        h('div', { class: 'row' }, h('button', { id: 'rpgRandom', class: 'grow', onclick: () => setDef(R.randomDef()) }, '🎲 Random castle'), h('button', { class: 'grow', onclick: () => { const d = { name: '', rooms: {} }; R.addRoom(d, '2,1'); R.paintTile(d, '2,1', 7, 5, 'S'); setDef(d); } }, '📄 Start from nothing')),
        h('button', { id: 'rpgStart', class: 'go primary', onclick: start }, '⚔️ Open the gates'));
      if (S.rpg.phase === 'build' && !S.joined.player && !hot()) p.prepend(h('p', { class: 'rnote' }, 'A castle is ready below — change anything you like while you wait for your hero.'));
    } else if (soloHero()) {
      showCard(h('h2', {}, '⚔️ The castle awaits'), h('p', {}, 'Somewhere inside is the crown. The Overlord does not want you to have it.'), modePick(),
        h('button', { id: 'rpgEnter', class: 'go primary', onclick: () => { def = R.randomDef(); start(); } }, 'Enter the castle ▶'), controls());
    } else showCard(h('h2', {}, '🏰 The Overlord is building the castle…'), h('p', {}, `${S.names.director} is laying traps, hiding keys and feeding the monsters.`), S.you === 'player' ? controls() : null);
    if (!isLord()) add(p, h('h3', {}, 'How to play'), controls());
    return;
  }
  /* playing, or just over */
  if (g.phase === 'over') {
    const heroWon = g.winner === 'player', mine = hot() || S.you === 'spectator' ? null : (S.you === 'player') === heroWon, s = (st && st.stats) || {};
    showCard(h('h2', {}, heroWon ? '👑 The hero takes the crown!' : '💀 The castle claims another hero'),
      h('p', {}, mine == null ? '' : mine ? 'You win!' : 'You lose — this time.'),
      st && h('p', { class: 'dim' }, `${s.kills || 0} monsters slain · ${s.rooms || 0} rooms explored · ${st.hero.coins} coins · level ${st.hero.lvl}`),
      isLord() ? h('button', { id: 'rpgAgain', class: 'go primary', onclick: () => act('rpgAgain').catch((e) => toast(e.message)) }, '🏰 Back to the castle workshop')
        : soloHero() ? h('button', { id: 'rpgAgain', class: 'go primary', onclick: () => act('rpgAgain').catch((e) => toast(e.message)) }, '⚔️ Another castle') : h('p', { class: 'dim' }, 'The Overlord can build a new castle.'));
  }
  if (!st) { add(p, h('p', { class: 'dim' }, 'Waiting for the hero…')); return; }
  add(p, h('div', { class: 'rhead' }, h('h3', {}, st.name ? `🏰 ${st.name}` : '🏰 The castle'), h('span', { class: 'dim' }, st.mode === 'turn' ? '♟️ turn-based' : '⚡ live')));
  add(p, board((k) => { if (!isLord() || !st.rooms[k]) return; viewKey = k === st.cur ? null : k; mapKey = ''; uiKey = ''; }));
  if (isLord()) {
    const live = g.phase === 'play';
    add(p, 
      h('small', { class: 'dim', id: 'rpgViewing' }, ''),
      h('div', { class: 'dread' }, h('b', {}, '😈 Dread'), h('div', { class: 'bar' }, h('i', { id: 'rpgDread' })), h('span', { id: 'rpgDreadN' }, '')),
      st.mode === 'turn' ? h('button', { id: 'rpgEndTurn', class: 'go primary', onclick: () => command({ k: 'endturn' }) }, 'End my turn ▶') : null,
      h('small', { class: 'dim grp' }, 'Summon a monster — pick one, then click a floor tile'),
      h('div', { class: 'rpow' }, Object.entries(R.MOBS).filter(([k]) => k !== 'boss').map(([k, m]) => h('button', { 'data-cost': m.cost, 'data-tool': k, class: tool === k ? 'on' : '', disabled: live ? null : '', title: `${m.name}: ${m.hp} health`, onclick: () => { tool = tool === k ? null : k; uiKey = ''; } }, icon(m.sprite), h('span', {}, m.name), h('b', {}, m.cost)))),
      h('small', { class: 'dim grp' }, 'Traps and dark powers'),
      h('div', { class: 'rpow' },
        h('button', { 'data-cost': R.POWERS.spikes.cost, 'data-tool': 'spikes', class: tool === 'spikes' ? 'on' : '', disabled: live ? null : '', title: 'Pick, then click a floor tile', onclick: () => { tool = tool === 'spikes' ? null : 'spikes'; uiKey = ''; } }, icon('dungeon-spikes-up'), h('span', {}, 'Spikes'), h('b', {}, R.POWERS.spikes.cost)),
        ...[['dark', '🌑'], ['arrows', '🏹'], ['quake', '🪨'], ['heal', '💚'], ['seal', '🚪']].map(([k, e]) => h('button', { 'data-cost': R.POWERS[k].cost, 'data-power': k, disabled: live ? null : '', onclick: () => command({ k }) }, h('i', {}, e), h('span', {}, R.POWERS[k].name), h('b', {}, R.POWERS[k].cost)))),
      h('small', { class: 'dim grp' }, 'Spook the hero — free'),
      h('div', { class: 'chips wrap' }, R.SPOOKS.map(([k, l]) => h('button', { disabled: live ? null : '', onclick: () => command({ k: 'spook', s: k }) }, l))),
      h('form', { class: 'row', onsubmit: (e) => { e.preventDefault(); const i = $('#rpgWhisper'); if (i.value.trim() && command({ k: 'whisper', text: i.value })) i.value = ''; } },
        h('input', { id: 'rpgWhisper', class: 'grow', maxlength: 90, placeholder: 'Whisper to the hero…', disabled: live ? null : '' }), h('button', { disabled: live ? null : '' }, 'Whisper')));
  }
  if (!isLord() || hot()) add(p, h('small', { class: 'dim grp' }, 'The hero'), controls());
}
function controls() { return h('div', { class: 'rkeys' },
  h('div', { class: 'touch' }, '🕹️ Slide your thumb on the pad to walk. ⚔️ swings your sword, 🧪 drinks a potion, 💣 drops a bomb — then run.'),
  h('div', {}, h('kbd', {}, '↑'), h('kbd', {}, '←'), h('kbd', {}, '↓'), h('kbd', {}, '→'), ' or ', h('kbd', {}, 'W'), h('kbd', {}, 'A'), h('kbd', {}, 'S'), h('kbd', {}, 'D'), ' walk'),
  h('div', {}, h('kbd', {}, 'Space'), ' swing your sword'), h('div', {}, h('kbd', {}, 'Q'), ' drink a potion'), h('div', {}, h('kbd', {}, 'E'), ' drop a bomb, then run'),
  h('div', { class: 'dim' }, 'Find keys for locked doors. Gates open when every monster in the room is gone. Take the crown to win.')); }

function hud() {
  const el = $('#rpgHud');
  if (!st || S.rpg.phase === 'build') { if (hudKey !== 'x') { hudKey = 'x'; fill(el, S.rpg.phase === 'build' && isLord() && def ? h('span', { class: 'dim' }, `Room ${editKey ? 'ABCDE'[+editKey[0]] + (+editKey[2] + 1) : ''} — pick something on the right and paint`) : ''); } return; }
  const o = st.hero, key = [o.hp, o.max, o.keys, o.potions, o.bombs, o.coins, o.lvl, o.sword, st.mode, st.turn.who, st.turn.ap, st.phase, heroKeys()].join();
  if (key === hudKey) return;
  hudKey = key;
  const hearts = [];
  for (let i = 0; i < o.max; i += 2) hearts.push(icon(o.hp >= i + 2 ? 'heart' : o.hp === i + 1 ? 'heart-half' : 'heart-empty'));
  const stat = (s, n, title) => h('span', { class: 'rstat', title }, icon(s), h('b', {}, n));
  fill(el, h('span', { class: 'hearts', id: 'rpgHearts', 'data-hp': o.hp }, hearts), stat('key-gold', o.keys, 'Keys'), stat('coin-gold', o.coins, 'Coins'), stat(o.sword > 1 ? 'sword-gold' : 'sword', 'Lv ' + o.lvl, 'Level'),
    st.mode === 'turn' ? h('span', { class: 'rturn ' + st.turn.who, id: 'rpgTurnInfo' }, st.turn.who === 'hero' ? `Hero’s turn · ${'●'.repeat(st.turn.ap)}${'○'.repeat(R.AP - st.turn.ap)}` : 'Overlord’s turn…') : null,
    h('span', { class: 'grow' }),
    heroKeys() ? h('button', { id: 'rpgSword', title: 'Swing your sword (Space)', onclick: () => press('attack') }, icon('sword'), ' Space') : null,
    heroKeys() ? h('button', { id: 'rpgPotion', title: 'Drink a potion (Q)', disabled: o.potions ? null : '', onclick: () => press('potion') }, icon('potion-red'), ` ${o.potions} · Q`) : stat('potion-red', o.potions, 'Potions'),
    heroKeys() ? h('button', { id: 'rpgBomb', title: 'Drop a bomb (E)', disabled: o.bombs ? null : '', onclick: () => press('bomb') }, icon('bomb'), ` ${o.bombs} · E`) : stat('bomb', o.bombs, 'Bombs'));
}
function refresh() {
  if (!S) return;
  const g = S.rpg, key = [g.phase, g.run, S.you, hot(), S.bot, S.joined.player, !!st, !!def, editKey, tool, mode, viewKey, st && st.mode, g.winner].join();
  if (key !== uiKey) { uiKey = key; side(); mapKey = ''; const b = $('#rpgBoard'); if (b) b.dataset.key = ''; }
  hud(); paintBoard();
  const pad = $('#rpgPad'), showPad = document.body.classList.contains('phone') && g.phase === 'play' && !!st && heroKeys();
  if (pad.hidden === showPad) pad.hidden = !showPad;
  if (showPad) { $('#padPotion').lastElementChild.textContent = st.hero.potions; $('#padBomb').lastElementChild.textContent = st.hero.bombs; $('#padPotion').classList.toggle('none', !st.hero.potions); $('#padBomb').classList.toggle('none', !st.hero.bombs); }
  const msg = $('#rpgMsg'), m = st && st.msg, on = m && g.phase === 'play' && clock - msgAt.t < 4.5;
  msg.hidden = !on;
  if (on && msg.dataset.n !== String(m.n)) { msg.dataset.n = m.n; msg.className = m.who; msg.textContent = (m.who === 'lord' ? '😈 ' : '') + m.text; }
  if (st && isLord()) {
    const bar = $('#rpgDread');
    if (bar) { bar.style.width = (st.dread / st.maxDread) * 100 + '%'; $('#rpgDreadN').textContent = `${Math.floor(st.dread)} / ${st.maxDread}`; }
    const myTurn = st.mode !== 'turn' || st.turn.who === 'lord', playing = g.phase === 'play' && st.phase === 'play';
    for (const b of document.querySelectorAll('#rpgSide [data-cost]')) b.disabled = !playing || !myTurn || st.dread < +b.dataset.cost;
    const end = $('#rpgEndTurn'); if (end) { end.disabled = !playing || st.turn.who !== 'lord'; end.textContent = st.turn.who === 'lord' ? 'End my turn ▶' : 'The hero is moving…'; }
    const v = $('#rpgViewing'); if (v) v.textContent = viewKey && viewKey !== st.cur ? 'Looking at another room — click the hero’s room (🧍) to go back' : 'Click any room to look inside. You can set things up ahead of the hero.';
    if (viewKey === st.cur) viewKey = null;
  }
  if (g.phase !== 'build') audio.setMood(g.phase === 'over' ? (g.winner === 'player' ? 'm:victory' : 'm:sad') : st && st.cur === st.goal ? 'm:boss' : st && st.dark > st.t ? 'm:spooky' : 'm:dungeon');
  else audio.setMood('m:mystery');
}

/* ---------- wiring to the rest of the app ---------- */
window.rpgDebug = { get st() { return st; }, get def() { return def; } };   // for the tests and for the curious
export function rpgInit() {
  const cv = $('#rpgCanvas');
  cv.width = W; cv.height = H;
  for (const t of ['pointerdown', 'pointermove', 'pointerup', 'pointerleave']) cv.addEventListener(t, onPointer);
  cv.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('keydown', onKey); window.addEventListener('keyup', onKey);
  window.addEventListener('blur', () => { held.length = 0; });
  /* phones: a thumb pad and three buttons under the game */
  const stick = $('#rpgStick'), knob = stick.firstElementChild;
  let padDir = null, padTimer = 0;
  const step = () => { if (padDir && st && st.mode === 'turn' && queue.length < 1) queue.push({ k: 'move', dir: padDir }); };
  const aim = (e) => {
    const r = stick.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), len = Math.hypot(dx, dy), max = r.width * 0.3;
    const dir = len < r.width * 0.11 ? null : Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
    knob.style.transform = `translate(${(dx / (len || 1)) * Math.min(len, max)}px, ${(dy / (len || 1)) * Math.min(len, max)}px)`;
    if (dir === padDir) return;
    padDir = dir; held.length = 0; stick.dataset.dir = dir || '';
    if (dir) { held.push(dir); step(); }
  };
  const release = () => { padDir = null; held.length = 0; knob.style.transform = ''; stick.dataset.dir = ''; clearInterval(padTimer); padTimer = 0; };
  stick.addEventListener('pointerdown', (e) => { e.preventDefault(); audio.unlock(); try { stick.setPointerCapture(e.pointerId); } catch { /* fine */ } clearInterval(padTimer); padTimer = setInterval(step, 230); aim(e); });
  stick.addEventListener('pointermove', (e) => { if (padTimer) aim(e); });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) stick.addEventListener(t, release);
  for (const [id, k] of [['padSword', 'attack'], ['padPotion', 'potion'], ['padBomb', 'bomb']]) $('#' + id).addEventListener('pointerdown', (e) => { e.preventDefault(); press(k); });
  $('#rpgPad').addEventListener('contextmenu', (e) => e.preventDefault());
}
/** The server's view of the story arrived (someone joined, the game started or ended, ...). */
export function rpgState(s) {
  S = s;
  const g = s.rpg;
  if (g.phase === 'build') {
    st = null; run = -1; viewKey = null; fxs.length = 0;
    if (isLord() && !def) { def = g.def && Object.keys(g.def.rooms).length ? g.def : R.randomDef(); mode = g.mode; editKey = Object.keys(def.rooms).find((k) => def.rooms[k].t.includes('S')) || Object.keys(def.rooms)[0]; tool = null; history.reset(def); if (!g.def) saveSoon(); }
    if (tool && tool.length > 1) tool = null;
  } else {
    if (tool && tool.length === 1) tool = null;
    const fresh = run !== g.run;
    if (isHost()) { if (fresh || !st) { st = g.state && g.state.v === 1 ? g.state : R.createState(g.def, g.mode, { autoLord: s.bot === 'director', autoHero: s.bot === 'player' }); lastEv = g.state ? st.seq : 0; } }
    else if (g.state) { if (fresh) lastEv = g.state.seq; st = g.state; }
    else if (fresh) st = null;
    if (fresh) { run = g.run; viewKey = null; disp.clear(); held.length = 0; queue.length = 0; sent = ''; overTry = 0; acc = { snap: 9, hero: 0, lord: 0, ui: 0 }; }
  }
  uiKey = uiKey && uiKey.startsWith(g.phase + ',') ? uiKey : '';
  refresh();
  if (!raf) raf = requestAnimationFrame(frame);
}
/** A live message relayed by the server: a snapshot for the watcher, or an Overlord command for the host. */
export function rpgEvent(m) {
  if (!S || !S.rpg) return;
  if (m.t === 'snap' && !isHost() && m.run === S.rpg.run) { if (run !== m.run) { run = m.run; lastEv = m.state.seq; } st = m.state; }
  else if (m.t === 'cmd' && isHost() && st && !hot()) R.lordCmd(st, m.cmd);
}
export function rpgStop() {
  cancelAnimationFrame(raf); raf = 0; clearTimeout(saveTimer);
  S = null; st = null; def = null; run = -1; tool = null; editKey = null; viewKey = null; uiKey = ''; hudKey = ''; history.reset(); held.length = 0; queue.length = 0; disp.clear(); fxs.length = 0;
}
