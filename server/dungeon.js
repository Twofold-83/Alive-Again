import * as rpgSim from '../public/rpg-sim.js';
import { streams, touch, broadcast, online } from './rooms.js';
import { fail } from './util.js';

/* Dungeon mode (type 'rpg') has its own rules, shared with the browser: public/rpg-sim.js. One browser runs the game; the server keeps the castle, relays and remembers. */
const rpgHost = (room) => (room.bot === 'player' ? 'director' : 'player');     // whose browser runs the game
function rpgRelay(room, obj, toHost) {
  const set = streams.get(room.code), host = room.tokens[rpgHost(room)];
  if (!set) return;
  const msg = `event: rpg\ndata: ${JSON.stringify(obj)}\n\n`;
  for (const s of set) if ((s.token === host) === toHost) { try { s.res.write(msg); } catch { /* closed */ } }
}

/* ---------- dungeon mode: one browser runs the game (the "host"); the server keeps the castle, relays and remembers ---------- */
function dungeon(room, who) {
  const g = room.rpg;
  if (!g) throw fail(409, 'This is not a dungeon story');
  const isLord = who.token === room.tokens.director, isHost = who.token === room.tokens[rpgHost(room)];
  return { g, isLord, isHost, boss: isLord || (isHost && room.bot === 'director'), mode: (m) => (m === 'turn' ? 'turn' : m === 'live' ? 'live' : g.mode) };   // boss: alone against the computer Overlord, the hero runs the show
}
export function actRpgDef(room, body, who) {
  const { g, isLord, mode } = dungeon(room, who);
  if (!isLord) throw fail(403, 'Only the Overlord builds the castle');
  g.def = rpgSim.cleanDef(body.def); g.mode = mode(body.mode); touch(room);
  return { ok: true };
}
export function actRpgStart(room, body, who) {
  const { g, boss, mode } = dungeon(room, who);
  if (!boss) throw fail(403, 'Only the Overlord can open the gates');
  const def = rpgSim.cleanDef(body.def), why = rpgSim.checkDef(def);
  if (why) throw fail(400, why);
  Object.assign(g, { phase: 'play', mode: mode(body.mode), def, state: null, run: g.run + 1, winner: null });
  touch(room); broadcast(room);
  return { ok: true };
}
export function actRpgAgain(room, body, who) {
  const { g, boss } = dungeon(room, who);
  if (!boss) throw fail(403, 'Only the Overlord can do that');
  Object.assign(g, { phase: 'build', state: null, winner: null });
  touch(room); broadcast(room);
  return { ok: true };
}
export function actRpgCmd(room, body, who) {
  const { g, isLord } = dungeon(room, who);
  if (g.phase !== 'play') throw fail(409, 'No game is running');
  if (!isLord) throw fail(403, 'Only the Overlord can do that');
  if (!online(room, rpgHost(room))) throw fail(409, 'The hero is away — the castle is frozen');
  if (!body.cmd || typeof body.cmd !== 'object' || JSON.stringify(body.cmd).length > 400) throw fail(400, 'Bad command');
  rpgRelay(room, { t: 'cmd', cmd: body.cmd }, true);
  return { ok: true };
}
export function actRpgSnap(room, body, who) {
  const { g, isHost } = dungeon(room, who);
  if (g.phase !== 'play') throw fail(409, 'No game is running');
  if (!isHost || body.run !== g.run || !body.state || typeof body.state !== 'object' || Array.isArray(body.state)) throw fail(409, 'Out of date');
  if (JSON.stringify(body.state).length > 200000) throw fail(413, 'Too large');
  g.state = body.state;
  if (Date.now() - (g.savedAt || 0) > 5000) { g.savedAt = Date.now(); touch(room); }
  if (body.over === 'won' || body.over === 'lost') { g.phase = 'over'; g.winner = body.over === 'won' ? 'player' : 'director'; touch(room); broadcast(room); }
  else rpgRelay(room, { t: 'snap', run: g.run, state: g.state }, false);
  return { ok: true };
}
