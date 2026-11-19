import crypto from 'node:crypto';
import * as directorAI from './director-ai.js';
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, ROOM_TTL_MS } from './config.js';
import { cleanRules } from './scene.js';
import { normScene } from '../public/shared/scene-model.js';

export const rooms = new Map();   // code -> room
export const streams = new Map(); // code -> Set<{res, token}>
export const timers = new Map();  // code -> timeout handle
export const dirty = new Set();

export function newCode() {
  const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  for (;;) {
    let c = '';
    for (const b of crypto.randomBytes(5)) c += abc[b % abc.length];
    if (!rooms.has(c)) return c;
  }
}

/* ---------- rooms ---------- */
export function roleOf(room, token) {
  if (room.hotseat && token && token === room.tokens.director) return room.whose;   // one person plays both sides
  if (token && token === room.tokens.director) return 'director';
  if (token && token === room.tokens.player) return 'player';
  return 'spectator';
}
export function online(room, role) {
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
    rules: room.rules, info: room.info || { title: '', text: '' }, hotseat: !!room.hotseat, claude: directorAI.available(),
    scenes: role === 'director' || room.hotseat ? room.scenes || [] : undefined,
    historyLen: room.history.length, bot: room.bot || null, rpg: room.rpg || null,
    lastTimeout: room.lastTimeout,
  };
}

export function broadcast(room) {
  const set = streams.get(room.code);
  if (!set) return;
  for (const s of set) {
    try { s.res.write(`data: ${JSON.stringify(view(room, roleOf(room, s.token)))}\n\n`); } catch { /* closed */ }
  }
}

export function touch(room) { room.updatedAt = Date.now(); dirty.add(room.code); }

/* ---------- persistence ---------- */
export function saveDirty() {
  for (const code of dirty) {
    const room = rooms.get(code);
    if (!room) continue;
    const file = path.join(DATA_DIR, code + '.json');
    fs.writeFile(file + '.tmp', JSON.stringify(room), (err) => { if (!err) fs.rename(file + '.tmp', file, () => {}); });
  }
  dirty.clear();
}
export function loadRooms() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!/^[A-Z]{5}\.json$/.test(f)) continue;
    try {
      const room = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
      if (room.deadline != null) { room.remaining = Math.max(0, room.deadline - Date.now()); room.deadline = null; }
      normScene(room.scene);                                   // stories saved by an older version lack newer fields
      for (const hst of room.history) normScene(hst.scene);
      room.rules = cleanRules(room.rules);
      rooms.set(room.code, room);
    } catch (e) { console.error('Could not load', f, e.message); }
  }
}
export function sweep() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.updatedAt > ROOM_TTL_MS && !(streams.get(code) || { size: 0 }).size) {
      rooms.delete(code); clearTimeout(timers.get(code)); timers.delete(code);
      fs.unlink(path.join(DATA_DIR, code + '.json'), () => {});
    }
  }
}
