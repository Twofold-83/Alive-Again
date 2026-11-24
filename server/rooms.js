/* Stories ("rooms"): who is in them, what each side gets to see, keeping them on disk.
 * The server owns the committed scene, whose turn it is, the clock, the history and custom art;
 * browsers only edit a local draft and send it when the turn ends. */
import crypto from 'node:crypto';
import * as directorAI from './director-ai.js';
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, ROOM_TTL_MS, MAX_ROOMS } from './config.js';
import { fail, str } from './util.js';
import { botName } from './bots.js';
import { cleanRules } from '../public/shared/rules.js';
import { normScene, newScene } from '../public/shared/scene-model.js';
import { roomScene } from '../public/shared/rooms.js';

export const rooms = new Map(); // code -> room
export const streams = new Map(); // code -> Set<{res, token}>
export const timers = new Map(); // code -> timeout handle
export const dirty = new Set();

export function newCode() {
  const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  for (;;) {
    let c = '';
    for (const b of crypto.randomBytes(5)) c += abc[b % abc.length];
    if (!rooms.has(c)) return c;
  }
}

/** A new story. body: { token, name, role, mode: pair | bot | hotseat | prep, type: free | adventure | rpg }. The kind of story is chosen once, here.
 * prep: one person prepares a campaign — the stage is theirs with no turns and no clock, and can be tried out as the Player. */
export function createRoom(body) {
  if (rooms.size >= MAX_ROOMS) throw fail(503, 'Server is full, try again later');
  const role = body.role === 'player' && body.mode !== 'prep' ? 'player' : 'director';
  const prep = body.mode === 'prep' && body.type !== 'rpg';
  const mode = prep || body.mode === 'hotseat' ? 'hotseat' : body.mode === 'bot' || body.bot ? 'bot' : 'pair';
  const dungeon = body.type === 'rpg';
  const type = dungeon ? 'rpg' : body.type === 'adventure' || (body.type == null && mode === 'bot' && role === 'player') ? 'adventure' : 'free';
  const names = () => (dungeon ? { director: 'Overlord', player: 'Hero' } : { director: 'Director', player: 'Player' });
  const room = {
    code: newCode(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tokens: { director: null, player: null },
    names: names(),
    settings: { turnSeconds: dungeon ? 0 : 60 },
    turn: 0,
    whose: 'director',
    deadline: null,
    remaining: null,
    ended: false,
    lastTimeout: false,
    scene: roomScene(newScene()), // a new story opens in a dim old room
    history: [],
    assets: [],
    rules: cleanRules({ type }),
    info: { title: '', text: '' },
  };
  if (dungeon) room.rpg = { phase: 'build', mode: 'live', def: null, state: null, run: 0, winner: null };
  room.tokens[role] = body.token;
  room.names[role] = str(body.name, 20) || room.names[role];
  if (mode === 'hotseat') {
    // one person, one device, both sides
    room.hotseat = true;
    if (prep) Object.assign(room, { prep: true, settings: { turnSeconds: 0 } });
    room.tokens.director = room.tokens.player = body.token;
    room.names = names();
  } else if (mode === 'bot') {
    // solo play: the other side is played by the computer
    room.bot = role === 'director' ? 'player' : 'director';
    room.tokens[room.bot] = 'bot-' + crypto.randomBytes(16).toString('hex');
    room.names[room.bot] = botName();
  }
  rooms.set(room.code, room);
  touch(room);
  return { room, role };
}
/** Take the free seat of a story (or come back to your own). Returns the role: director, player or spectator. */
export function joinRoom(room, body) {
  let role = roleOf(room, body.token);
  if (role === 'spectator') {
    if (!room.tokens.director) role = 'director';
    else if (!room.tokens.player) role = 'player';
    if (role !== 'spectator') room.tokens[role] = body.token;
  }
  if (role !== 'spectator') {
    const name = str(body.name, 20);
    if (name) room.names[role] = name;
    touch(room);
    broadcast(room);
  }
  return role;
}
export function roleOf(room, token) {
  if (room.hotseat && token && token === room.tokens.director) return room.whose; // one person plays both sides
  if (token && token === room.tokens.director) return 'director';
  if (token && token === room.tokens.player) return 'player';
  return 'spectator';
}
export function online(room, role) {
  if (room.bot === role) return true; // an AI partner never drops off
  const set = streams.get(room.code);
  if (!set) return false;
  for (const s of set) if (s.token === room.tokens[role]) return true;
  return false;
}

function view(room, role) {
  const timed = room.deadline != null || room.remaining != null;
  return {
    code: room.code,
    you: role,
    names: room.names,
    joined: { director: !!room.tokens.director, player: !!room.tokens.player },
    online: { director: online(room, 'director'), player: online(room, 'player') },
    settings: room.settings,
    turn: room.turn,
    whose: room.whose,
    ended: room.ended,
    remainingMs: room.deadline != null ? Math.max(0, room.deadline - Date.now()) : room.remaining,
    paused: timed && room.deadline == null,
    scene: room.scene,
    assets: room.assets.map((a) => ({ id: a.id, kind: a.kind, name: a.name, part: a.part || undefined, views: a.views, base: a.base })),
    before: room.liveBefore || (room.history.length > 1 ? room.history[room.history.length - 2].scene : null),
    liveN: room.liveN || 0, // counts the rounds of a live battle: each one is shown to both sides as it happens
    rules: room.rules,
    info: room.info || { title: '', text: '' },
    hotseat: !!room.hotseat,
    prep: !!room.prep, // a campaign is being prepared here
    testing: !!room.test, // ...and tried out right now: all of it is undone when the test ends
    claude: directorAI.available(),
    scenes: role === 'director' || room.hotseat ? room.scenes || [] : undefined,
    historyLen: room.history.length,
    bot: room.bot || null,
    rpg: room.rpg || null,
    lastTimeout: room.lastTimeout,
  };
}

export function broadcast(room) {
  const set = streams.get(room.code);
  if (!set) return;
  for (const s of set) {
    try {
      s.res.write(`data: ${JSON.stringify(view(room, roleOf(room, s.token)))}\n\n`);
    } catch {
      /* closed */
    }
  }
}

export function touch(room) {
  room.updatedAt = Date.now();
  dirty.add(room.code);
}

/* ---------- persistence ---------- */
export function saveDirty() {
  for (const code of dirty) {
    const room = rooms.get(code);
    if (!room) continue;
    const file = path.join(DATA_DIR, code + '.json');
    fs.writeFile(file + '.tmp', JSON.stringify(room), (err) => {
      if (!err) fs.rename(file + '.tmp', file, () => {});
    });
  }
  dirty.clear();
}
export function loadRooms() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!/^[A-Z]{5}\.json$/.test(f)) continue;
    try {
      const room = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
      if (room.deadline != null) {
        room.remaining = Math.max(0, room.deadline - Date.now());
        room.deadline = null;
      }
      normScene(room.scene); // stories saved by an older version lack newer fields
      for (const hst of room.history) normScene(hst.scene);
      room.rules = cleanRules(room.rules);
      rooms.set(room.code, room);
    } catch (e) {
      console.error('Could not load', f, e.message);
    }
  }
}
export function sweep() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.updatedAt > ROOM_TTL_MS && !(streams.get(code) || { size: 0 }).size) {
      rooms.delete(code);
      clearTimeout(timers.get(code));
      timers.delete(code);
      fs.unlink(path.join(DATA_DIR, code + '.json'), () => {});
    }
  }
}
