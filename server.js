'use strict';
/*
 * Twofold server — zero dependencies.
 *
 * Transport: Server-Sent Events (server -> client, full room state on every change)
 *            + plain JSON POSTs (client -> server). Both survive flaky mobile
 *            networks well: EventSource reconnects by itself and every reconnect
 *            receives the complete authoritative state.
 *
 * The server owns: rooms, roles, whose turn it is, the turn clock, the committed
 * scene, the turn history and custom assets. Clients only ever edit a local draft
 * and submit it when their turn ends.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { generateAsset } = require('./providers');
const { botMove, botName, randomPlace } = require('./bots');

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const PUBLIC = path.join(__dirname, 'public');

const GRACE_MS = 4000;              // slack after the deadline for a client's auto-submit to arrive
const MAX_BODY = 600 * 1024;
const MAX_ASSET_BYTES = 400 * 1024;
const MAX_ENTITIES = 80;
const MAX_ASSETS = 80;
const MAX_HISTORY = 1000;
const MAX_ROOMS = 5000;
const ROOM_TTL_MS = 14 * 24 * 3600 * 1000;
const ASSET_MIME = /^image\/(png|jpeg|webp|svg\+xml)$/;

const rooms = new Map();   // code -> room
const streams = new Map(); // code -> Set<{res, token}>
const timers = new Map();  // code -> timeout handle
const dirty = new Set();
const botBusy = new Set(); // codes of rooms whose bot is currently "thinking"
const BOT_DELAY_MS = process.env.BOT_DELAY_MS != null ? Number(process.env.BOT_DELAY_MS) : null;

/* ---------- helpers ---------- */
const uid = () => crypto.randomBytes(6).toString('hex');
const clone = (o) => JSON.parse(JSON.stringify(o));
const str = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');
const num = (v, lo, hi, d) => { v = Number(v); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
const fail = (status, message) => Object.assign(new Error(message), { status });

function newCode() {
  const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  for (;;) {
    let c = '';
    for (const b of crypto.randomBytes(5)) c += abc[b % abc.length];
    if (!rooms.has(c)) return c;
  }
}

function newScene() {
  return {
    backdrop: 'b:room', mood: 'm:none', narration: '', action: '', heroId: 'hero',
    entities: [{ id: 'hero', asset: 's:person', x: 0.5, y: 0.78, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '' }],
    drawing: [], weather: '',                          // persistent decoration
    tracks: [], burst: '', sfx: '', card: '', choices: [], // the Director's one-turn extras
    sheet: { inv: [], stats: [] },                     // inventory + stats (story-type layers)
    target: null, use: null, roll: null,               // the Player's one-turn extras (+ dice)
  };
}
/* Old saved stories predate some fields. */
function upgradeScene(sc) {
  const d = newScene();
  for (const k of Object.keys(d)) if (sc[k] === undefined) sc[k] = k === 'entities' ? [] : d[k];
  sc.sheet.inv = sc.sheet.inv || []; sc.sheet.stats = sc.sheet.stats || [];
  return sc;
}

const TYPES = { free: { inventory: false, stats: false, dice: false }, adventure: { inventory: true, stats: true, dice: true } };
function cleanRules(r) {
  const type = r && TYPES[r.type] ? r.type : 'free';
  const m = (r && r.modules) || TYPES[type];
  return { type, modules: { inventory: !!m.inventory, stats: !!m.stats, dice: !!m.dice } };
}

const HEX = /^#[0-9a-fA-F]{6}$/;
const r3 = (v) => Math.round(v * 1000) / 1000;
const arr = (v) => (Array.isArray(v) ? v : []);
const rollDie = (sides) => ([6, 20].includes(sides) ? { sides, value: 1 + crypto.randomInt(sides) } : null);

function cleanSheet(s) {
  const inv = [], stats = [], seen = new Set();
  const newId = (v) => { let id = str(v, 24) || uid(); if (seen.has(id)) id = uid(); seen.add(id); return id; };
  for (const it of arr(s && s.inv).slice(0, 24)) {
    if (!it || typeof it !== 'object' || !str(it.asset, 80)) continue;
    inv.push({ id: newId(it.id), asset: str(it.asset, 80), name: str(it.name, 30) });
  }
  for (const st of arr(s && s.stats).slice(0, 8)) {
    if (!st || typeof st !== 'object' || !str(st.name, 20)) continue;
    const max = st.max == null || st.max === '' ? null : Math.round(num(st.max, 0, 9999, 0));
    stats.push({ id: newId(st.id), name: str(st.name, 20), value: Math.round(num(st.value, -9999, 9999, 0)), max });
  }
  return { inv, stats };
}

function cleanScene(s, prev) {
  const seen = new Set();
  const entities = [];
  for (const e of arr(s && s.entities).slice(0, MAX_ENTITIES)) {
    if (!e || typeof e !== 'object') continue;
    let id = str(e.id, 24) || uid();
    if (seen.has(id)) id = uid();
    const asset = str(e.asset, 80);
    if (!asset) continue;
    seen.add(id);
    entities.push({
      id, asset, x: num(e.x, 0, 1, 0.5), y: num(e.y, 0, 1, 0.5), scale: num(e.scale, 0.3, 6, 1), flip: !!e.flip,
      rot: Math.round(num(e.rot, -360, 360, 0)), say: str(e.say, 160), fx: str(e.fx, 12), emote: str(e.emote, 16),
    });
  }
  const drawing = [];
  for (const d of arr(s.drawing).slice(0, 60)) {
    if (!d || !Array.isArray(d.pts)) continue;
    const pts = d.pts.slice(0, 400).map((v) => r3(num(v, 0, 1, 0)));
    if (pts.length % 2) pts.pop();
    if (pts.length >= 4) drawing.push({ id: str(d.id, 12) || uid(), c: HEX.test(d.c) ? d.c : '#ffffff', w: num(d.w, 1, 14, 4), pts });
  }
  const tracks = [];   // recorded motion: flat [ms, x, y, ms, x, y, ...], at most 10 seconds
  for (const t of arr(s.tracks).slice(0, 30)) {
    if (!t || !seen.has(t.id) || !Array.isArray(t.pts) || tracks.some((x) => x.id === t.id)) continue;
    const pts = []; let last = 0;
    for (let i = 0; i + 2 < t.pts.length && i < 660; i += 3) {
      last = Math.max(last, Math.round(num(t.pts[i], 0, 10000, 0)));
      pts.push(last, r3(num(t.pts[i + 1], 0, 1, 0)), r3(num(t.pts[i + 2], 0, 1, 0)));
    }
    if (pts.length >= 6) tracks.push({ id: t.id, pts });
  }
  return {
    backdrop: str(s.backdrop, 80) || prev.backdrop, mood: str(s.mood, 40) || 'm:none',
    narration: str(s.narration, 240), action: '', heroId: seen.has(s.heroId) ? s.heroId : null, entities,
    drawing, weather: str(s.weather, 12), tracks, burst: str(s.burst, 12), sfx: str(s.sfx, 12), card: str(s.card, 60),
    choices: arr(s.choices).map((c) => str(c, 40)).filter(Boolean).slice(0, 4),
    sheet: cleanSheet(s.sheet), target: null, use: null, roll: null,
  };
}

/* How long the other side will be watching this turn play out, so it is not charged to their clock. */
function cutEstimate(sc, before) {
  const old = new Map((before ? before.entities : []).map((e) => [e.id, e.say]));
  let ms = 1500;
  for (const t of sc.tracks) ms = Math.max(ms, 900 + t.pts[t.pts.length - 3]);
  for (const e of sc.entities) if (e.say && old.get(e.id) !== e.say) ms += 900 + 45 * e.say.length;
  if (sc.narration && !(before && before.narration === sc.narration)) ms += Math.min(4500, 900 + 40 * sc.narration.length);
  if (sc.card) ms += 2100;
  if (sc.roll) ms += 1700;
  if (sc.action || sc.target || sc.use) ms += 1300;
  return Math.min(ms, 30000);
}

/* ---------- rooms ---------- */
function roleOf(room, token) {
  if (room.hotseat && token && token === room.tokens.director) return room.whose;   // one person plays both sides
  if (token && token === room.tokens.director) return 'director';
  if (token && token === room.tokens.player) return 'player';
  return 'spectator';
}
function online(room, role) {
  if (room.bot === role) return true;   // an AI partner never drops off
  const set = streams.get(room.code);
  if (!set) return false;
  for (const s of set) if (s.token === room.tokens[role]) return true;
  return false;
}

function view(room, role) {
  const timed = room.deadline != null || room.remaining != null;
  return {
    code: room.code, you: role, names: room.names,
    joined: { director: !!room.tokens.director, player: !!room.tokens.player },
    online: { director: online(room, 'director'), player: online(room, 'player') },
    settings: room.settings, turn: room.turn, whose: room.whose, ended: room.ended,
    remainingMs: room.deadline != null ? Math.max(0, room.deadline - Date.now()) : room.remaining,
    paused: timed && room.deadline == null,
    scene: room.scene,
    assets: room.assets.map((a) => ({ id: a.id, kind: a.kind, name: a.name })),
    before: room.history.length > 1 ? room.history[room.history.length - 2].scene : null,
    rules: room.rules, hotseat: !!room.hotseat,
    historyLen: room.history.length, bot: room.bot || null,
    lastTimeout: room.lastTimeout,
  };
}

function broadcast(room) {
  const set = streams.get(room.code);
  if (!set) return;
  for (const s of set) {
    try { s.res.write(`data: ${JSON.stringify(view(room, roleOf(room, s.token)))}\n\n`); } catch { /* closed */ }
  }
}

function touch(room) { room.updatedAt = Date.now(); dirty.add(room.code); }

/* The clock only runs while BOTH players are connected. */
function syncClock(room) {
  const timed = room.deadline != null || room.remaining != null;
  if (!timed || room.ended) {
    clearTimeout(timers.get(room.code));
    room.deadline = null; room.remaining = null;
    return;
  }
  const both = online(room, 'director') && online(room, 'player');
  if (both && room.deadline == null) {
    room.deadline = Date.now() + room.remaining;
    room.remaining = null;
    const turn = room.turn;
    clearTimeout(timers.get(room.code));
    timers.set(room.code, setTimeout(() => {
      if (room.turn === turn && room.deadline != null && !room.ended) advance(room, true);
    }, room.deadline - Date.now() + GRACE_MS));
  } else if (!both && room.deadline != null) {
    room.remaining = Math.max(0, room.deadline - Date.now());
    room.deadline = null;
    clearTimeout(timers.get(room.code));
  }
}

/* Commit the current scene as a finished turn and hand over to the other side. */
function advance(room, timeout) {
  if (timeout) {   // nothing new was submitted: drop every one-turn extra so it does not play twice
    Object.assign(room.scene, { tracks: [], burst: '', sfx: '', card: '', action: '', target: null, use: null, roll: null });
    if (room.whose === 'player') room.scene.choices = [];
  }
  room.history.push({ turn: room.turn, by: room.whose, at: Date.now(), timeout: !!timeout, scene: clone(room.scene) });
  if (room.history.length > MAX_HISTORY) room.history.shift();
  room.turn += 1;
  room.whose = room.whose === 'director' ? 'player' : 'director';
  room.lastTimeout = !!timeout;
  clearTimeout(timers.get(room.code));
  room.deadline = null;
  room.remaining = room.settings.turnSeconds > 0 ? room.settings.turnSeconds * 1000 + cutEstimate(room.scene, room.history.length > 1 ? room.history[room.history.length - 2].scene : null) : null;
  syncClock(room);
  touch(room);
  broadcast(room);
  maybeBot(room);
}

/* If an AI partner holds the current turn, let it "think" for a human-ish moment and then play. */
function maybeBot(room) {
  if (!room.bot || room.ended || room.whose !== room.bot || botBusy.has(room.code)) return;
  botBusy.add(room.code);
  const turn = room.turn;
  const delay = BOT_DELAY_MS != null ? BOT_DELAY_MS : room.turn === 0 ? 1200 : 2500 + Math.random() * 3500;
  setTimeout(async () => {
    try {
      if (room.turn !== turn || room.ended || rooms.get(room.code) !== room) return;
      room.botMemory = room.botMemory || {};
      const move = await botMove({ rules: room.rules, role: room.bot, scene: clone(room.scene), names: room.names, turn, memory: room.botMemory, history: room.history.slice(-6) });
      botBusy.delete(room.code);
      if (room.turn === turn && !room.ended) await act(room, room.tokens[room.bot], { ...move, type: 'submit', turn });
    } catch (e) { console.error('Bot turn failed:', e); } finally { botBusy.delete(room.code); }
  }, delay);
}

function storeAsset(room, kind, name, mime, data) {
  if (!ASSET_MIME.test(mime)) throw fail(400, 'Unsupported image type');
  if (!Buffer.isBuffer(data) || !data.length || data.length > MAX_ASSET_BYTES) throw fail(413, 'Image is too large');
  if (room.assets.length >= MAX_ASSETS) throw fail(409, 'This story already has the maximum number of custom assets');
  const asset = { id: uid(), kind: kind === 'backdrop' ? 'backdrop' : 'sprite', name: str(name, 40) || 'custom', mime, data: data.toString('base64') };
  room.assets.push(asset);
  touch(room);
  broadcast(room);
  return { id: asset.id, kind: asset.kind, name: asset.name };
}

/* ---------- actions ---------- */
async function act(room, token, body) {
  const role = roleOf(room, token);
  const directorOnly = () => { if (role !== 'director') throw fail(403, 'Only the Director can do that'); };
  switch (body.type) {
    case 'submit': {
      if (room.ended || body.turn !== room.turn || role !== room.whose) return { ok: true, stale: true };
      if (role === 'director') {
        if (!room.tokens.player) throw fail(409, 'Waiting for the Player to join');
        room.scene = cleanScene(body.scene || {}, room.scene);
        const roll = rollDie(body.roll);
        if (roll) room.scene.roll = { by: 'director', ...roll };
      } else {
        const hero = room.scene.entities.find((e) => e.id === room.scene.heroId);
        if (hero) {
          hero.x = num(body.x, 0, 1, hero.x);
          hero.y = num(body.y, 0, 1, hero.y);
          hero.say = str(body.say, 160);
          hero.emote = str(body.emote, 16);
        }
        const sc = room.scene;
        sc.action = str(body.action, 160);
        sc.target = sc.entities.some((e) => e.id === body.target && e.id !== sc.heroId) ? body.target : null;
        sc.use = sc.sheet.inv.some((i) => i.id === body.use) ? body.use : null;
        const roll = rollDie(body.roll);
        sc.roll = roll ? { by: 'player', ...roll } : null;
        sc.tracks = []; sc.burst = ''; sc.sfx = ''; sc.card = ''; sc.choices = [];   // the Director's one-turn extras are over
      }
      advance(room, false);
      return { ok: true };
    }
    case 'settings': {
      directorOnly();
      room.settings.turnSeconds = Math.round(num(body.turnSeconds, 0, 600, room.settings.turnSeconds));
      if (body.rules && typeof body.rules === 'object') room.rules = cleanRules(body.rules);
      touch(room); broadcast(room);
      return { ok: true };
    }
    case 'randomScene': {
      directorOnly();
      return { ok: true, place: randomPlace() };
    }
    case 'end': {
      directorOnly();
      room.ended = true;
      syncClock(room); touch(room); broadcast(room);
      return { ok: true };
    }
    case 'addAsset': {
      directorOnly();
      const m = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(typeof body.dataUrl === 'string' ? body.dataUrl : '');
      if (!m) throw fail(400, 'Please pick a PNG, JPEG or WebP image');
      return { ok: true, asset: storeAsset(room, body.kind, body.name, m[1], Buffer.from(m[2], 'base64')) };
    }
    case 'generate': {
      directorOnly();
      const prompt = str(body.prompt, 200);
      if (!prompt) throw fail(400, 'Describe what you want first');
      const kind = body.kind === 'backdrop' ? 'backdrop' : 'sprite';
      const out = await generateAsset({ kind, prompt });
      return { ok: true, asset: storeAsset(room, kind, out.name || prompt, out.mime, out.data) };
    }
    default: throw fail(400, 'Unknown action');
  }
}

/* ---------- persistence ---------- */
function saveDirty() {
  for (const code of dirty) {
    const room = rooms.get(code);
    if (!room) continue;
    const file = path.join(DATA_DIR, code + '.json');
    fs.writeFile(file + '.tmp', JSON.stringify(room), (err) => { if (!err) fs.rename(file + '.tmp', file, () => {}); });
  }
  dirty.clear();
}
function loadRooms() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!/^[A-Z]{5}\.json$/.test(f)) continue;
    try {
      const room = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
      if (room.deadline != null) { room.remaining = Math.max(0, room.deadline - Date.now()); room.deadline = null; }
      upgradeScene(room.scene);
      for (const hst of room.history) upgradeScene(hst.scene);
      room.rules = cleanRules(room.rules);
      rooms.set(room.code, room);
    } catch (e) { console.error('Could not load', f, e.message); }
  }
}
function sweep() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.updatedAt > ROOM_TTL_MS && !(streams.get(code) || { size: 0 }).size) {
      rooms.delete(code); clearTimeout(timers.get(code)); timers.delete(code);
      fs.unlink(path.join(DATA_DIR, code + '.json'), () => {});
    }
  }
}

/* ---------- http ---------- */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let n = 0; const chunks = [];
    req.on('data', (c) => {
      n += c.length;
      if (n > MAX_BODY) { reject(fail(413, 'Request too large')); req.destroy(); } else chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch { reject(fail(400, 'Bad JSON')); }
    });
    req.on('error', reject);
  });
}
function json(res, status, obj) {
  const s = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Length': Buffer.byteLength(s) });
  res.end(s);
}
const validToken = (t) => typeof t === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(t);

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
function serveStatic(req, res, pathname) {
  let rel;
  try { rel = decodeURIComponent(pathname); } catch { rel = '/'; }
  if (rel === '/') rel = '/index.html';
  const file = path.join(PUBLIC, rel);
  if (!file.startsWith(PUBLIC + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(buf);
  });
}

function openStream(req, res, room, token) {
  res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.write('retry: 2000\n\n');
  if (!room) { res.end('event: gone\ndata: 1\n\n'); return; }
  const s = { res, token };
  if (!streams.has(room.code)) streams.set(room.code, new Set());
  streams.get(room.code).add(s);
  syncClock(room);
  broadcast(room);
  maybeBot(room);
  req.on('close', () => {
    const set = streams.get(room.code);
    if (set) { set.delete(s); if (!set.size) streams.delete(room.code); }
    syncClock(room);
    broadcast(room);
  });
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  if (!p.startsWith('/api/')) {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    return serveStatic(req, res, p);
  }
  if (p === '/api/health') return json(res, 200, { ok: true, rooms: rooms.size });

  if (p === '/api/rooms' && req.method === 'POST') {
    const body = await readBody(req);
    if (!validToken(body.token)) throw fail(400, 'Bad token');
    if (rooms.size >= MAX_ROOMS) throw fail(503, 'Server is full, try again later');
    const role = body.role === 'player' ? 'player' : 'director';
    const mode = body.mode === 'hotseat' ? 'hotseat' : body.mode === 'bot' || body.bot ? 'bot' : 'pair';
    const room = {
      code: newCode(), createdAt: Date.now(), updatedAt: Date.now(),
      tokens: { director: null, player: null }, names: { director: 'Director', player: 'Player' },
      settings: { turnSeconds: 60 }, turn: 0, whose: 'director', deadline: null, remaining: null,
      ended: false, lastTimeout: false, scene: newScene(), history: [], assets: [],
      rules: cleanRules({ type: mode === 'bot' && role === 'player' ? 'adventure' : 'free' }),
    };
    room.tokens[role] = body.token;
    room.names[role] = str(body.name, 20) || room.names[role];
    if (mode === 'hotseat') {             // one person, one device, both sides
      room.hotseat = true;
      room.tokens.director = room.tokens.player = body.token;
      room.names = { director: 'Director', player: 'Player' };
    } else if (mode === 'bot') {          // solo play: the other side is an AI partner
      room.bot = role === 'director' ? 'player' : 'director';
      room.tokens[room.bot] = 'bot-' + crypto.randomBytes(16).toString('hex');
      room.names[room.bot] = botName();
    }
    rooms.set(room.code, room); touch(room);
    maybeBot(room);
    return json(res, 200, { code: room.code, role });
  }

  const m = /^\/api\/rooms\/([A-Za-z]{5})\/(join|events|act|history|assets)(?:\/([a-f0-9]{12}))?$/.exec(p);
  if (!m) throw fail(404, 'Not found');
  const room = rooms.get(m[1].toUpperCase());
  const what = m[2];

  if (what === 'events' && req.method === 'GET') return openStream(req, res, room, url.searchParams.get('token'));
  if (!room) throw fail(404, 'No story with that code');

  if (what === 'join' && req.method === 'POST') {
    const body = await readBody(req);
    if (!validToken(body.token)) throw fail(400, 'Bad token');
    let role = roleOf(room, body.token);
    if (role === 'spectator') {
      if (!room.tokens.director) role = 'director'; else if (!room.tokens.player) role = 'player';
      if (role !== 'spectator') room.tokens[role] = body.token;
    }
    if (role !== 'spectator') {
      const name = str(body.name, 20);
      if (name) room.names[role] = name;
      touch(room); broadcast(room);
    }
    return json(res, 200, { code: room.code, role });
  }
  if (what === 'act' && req.method === 'POST') {
    const body = await readBody(req);
    return json(res, 200, await act(room, body.token, body));
  }
  if (what === 'history' && req.method === 'GET') {
    return json(res, 200, { code: room.code, names: room.names, ended: room.ended, history: room.history });
  }
  if (what === 'assets' && req.method === 'GET' && m[3]) {
    const a = room.assets.find((x) => x.id === m[3]);
    if (!a) throw fail(404, 'No such asset');
    const buf = Buffer.from(a.data, 'base64');
    res.writeHead(200, {
      'Content-Type': a.mime, 'Content-Length': buf.length, 'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    });
    return res.end(buf);
  }
  throw fail(405, 'Method not allowed');
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((e) => {
    if (!e.status) console.error(e);
    if (res.headersSent) return res.end();
    json(res, e.status || 500, { error: e.status ? e.message : 'Server error' });
  });
});

loadRooms();
setInterval(saveDirty, 1500);
setInterval(sweep, 3600 * 1000);
setInterval(() => { // heartbeat keeps proxies from closing idle streams and lets clients detect dead ones
  for (const set of streams.values()) for (const s of set) { try { s.res.write('event: ping\ndata: 1\n\n'); } catch { /* closed */ } }
}, 15000);
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    for (const code of rooms.keys()) dirty.add(code);
    for (const code of dirty) { try { fs.writeFileSync(path.join(DATA_DIR, code + '.json'), JSON.stringify(rooms.get(code))); } catch { /* ignore */ } }
    process.exit(0);
  });
}
server.listen(PORT, () => console.log(`Twofold listening on http://localhost:${PORT}  (${rooms.size} stories loaded)`));
