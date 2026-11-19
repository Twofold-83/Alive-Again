/* Dungeon mode: the rules of the game, with no drawing and no network in it.
 * One browser (the "host", normally the hero's) runs this; the other side watches snapshots and sends commands.
 *
 * A castle ("def") is a board of rooms. Each room is RW x RH tiles, written as one string of characters:
 *   .  floor        #  wall         T  wall torch    %  cracked wall (a bomb opens it)
 *   ~  water        o  pit          ^  spikes        b  barrel        r  rubble
 *   D  door         L  locked door  G  gate (opens when the room has no monsters and no unpressed plates)
 *   _  pressure plate (fires the room's effect)      -  pressed plate
 *   > < A V  arrow traps            c  chest         C  opened chest
 *   S  where the hero starts        X  the crown (the hero wins by taking it)
 *   k h p m $ w +  loot: key, heart, potion, bomb, coin, better sword, heart container
 *   1-8  monsters (see MOBS)
 */
export const RW = 15, RH = 11, BW = 5, BH = 4, AP = 5;
export const DOORS = { N: [7, 0], S: [7, RH - 1], W: [0, 5], E: [RW - 1, 5] };
const OPP = { N: 'S', S: 'N', W: 'E', E: 'W' };
const SIDE_D = { N: [0, -1], S: [0, 1], W: [-1, 0], E: [1, 0] };
export const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const DIR_NAMES = Object.keys(DIRS);

export const MOBS = {
  slime: { ch: '1', name: 'Slime', hp: 2, dmg: 1, iv: 0.62, cost: 2, sprite: 'slime-green' },
  bat: { ch: '2', name: 'Bat', hp: 1, dmg: 1, iv: 0.27, cost: 2, sprite: 'bat', fly: true },
  spider: { ch: '3', name: 'Spider', hp: 2, dmg: 1, iv: 0.32, cost: 3, sprite: 'spider' },
  skeleton: { ch: '4', name: 'Skeleton', hp: 3, dmg: 1, iv: 0.44, cost: 4, sprite: 'skeleton' },
  ghost: { ch: '5', name: 'Ghost', hp: 2, dmg: 1, iv: 0.7, cost: 4, sprite: 'ghost', ghost: true, fly: true },
  archer: { ch: '6', name: 'Goblin archer', hp: 2, dmg: 1, iv: 0.5, cost: 5, sprite: 'goblin-archer', shoots: 'arrow' },
  knight: { ch: '7', name: 'Dark knight', hp: 5, dmg: 2, iv: 0.5, cost: 7, sprite: 'dark-knight' },
  boss: { ch: '8', name: 'Dragon', hp: 14, dmg: 2, iv: 0.46, cost: 99, sprite: 'dragon-red', shoots: 'fire', big: true },
};
const MOB_CH = Object.fromEntries(Object.entries(MOBS).map(([k, m]) => [m.ch, k]));
export const LOOT = {
  k: { name: 'Key', sprite: 'key-gold' }, h: { name: 'Heart', sprite: 'heart' }, p: { name: 'Potion', sprite: 'potion-red' }, m: { name: 'Bomb', sprite: 'bomb' },
  $: { name: 'Coin', sprite: 'coin-gold' }, w: { name: 'Golden sword', sprite: 'sword-gold' }, '+': { name: 'Heart container', sprite: 'heart-box' },
};
/** What a pressure plate does, chosen per room. */
export const PLATE_FX = [['open', 'Opens the gates'], ['ambush', 'Ambush! Monsters appear'], ['seal', 'Doors slam shut, monsters appear'], ['dark', 'The lights go out'], ['arrows', 'Every arrow trap fires'], ['quake', 'The ceiling comes down']];
/** What the Overlord can do while the hero is in the castle, and what it costs in dread. */
export const POWERS = {
  spikes: { name: 'Spikes', cost: 3, place: true }, dark: { name: 'Lights out', cost: 4 }, arrows: { name: 'Fire the arrow traps', cost: 3 },
  quake: { name: 'Quake', cost: 5 }, heal: { name: 'Mend the monsters', cost: 3 }, seal: { name: 'Slam the doors', cost: 6 },
};
export const SPOOKS = [['thunder', '⛈️ Thunder'], ['evil', '😈 Evil laugh'], ['ghost', '👻 Wail'], ['scream', '😱 Scream'], ['growl', '🐻 Growl'], ['knock', '✊ Knocking']];

const BORDER_OK = '#T><AV', DOOR_OK = 'DLG#', SOLID = '#T%bcCrGL><AV';
function idx(x, y) { return y * RW + x; }
function inside(x, y) { return x > 0 && y > 0 && x < RW - 1 && y < RH - 1; }
function onBoard(x, y) { return x >= 0 && y >= 0 && x < RW && y < RH; }
function rnd(n) { return Math.floor(Math.random() * n); }
function pick(a) { return a[rnd(a.length)]; }
function dist(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
export function roomKey(x, y) { return `${x},${y}`; }
export function neighbor(key, side) { const [x, y] = key.split(',').map(Number), d = SIDE_D[side]; return roomKey(x + d[0], y + d[1]); }
export function doorSide(x, y) { return Object.keys(DOORS).find((s) => DOORS[s][0] === x && DOORS[s][1] === y) || null; }

/* ---------- building a castle ---------- */
export function emptyRoom() {
  let t = '';
  for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) t += inside(x, y) ? '.' : '#';
  return { t, fx: 'open', msg: '' };
}
export function setCh(t, x, y, ch) { return t.slice(0, idx(x, y)) + ch + t.slice(idx(x, y) + 1); }
/** Keeps the outer walls whole and the doors between neighbouring rooms in step with each other. */
export function syncDoors(def) {
  for (const key of Object.keys(def.rooms)) {
    const r = def.rooms[key];
    for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) {
      if (inside(x, y)) { if ('DL'.includes(r.t[idx(x, y)])) r.t = setCh(r.t, x, y, '.'); continue; }
      const side = doorSide(x, y), ch = r.t[idx(x, y)];
      if (!side) { if (!BORDER_OK.includes(ch)) r.t = setCh(r.t, x, y, '#'); continue; }
      const other = def.rooms[neighbor(key, side)];
      if (!other) { if (!BORDER_OK.includes(ch)) r.t = setCh(r.t, x, y, '#'); continue; }
      const [ox, oy] = DOORS[OPP[side]], mine = DOOR_OK.includes(ch) ? ch : 'D';
      if (side === 'E' || side === 'S') { r.t = setCh(r.t, x, y, mine); other.t = setCh(other.t, ox, oy, mine); }
    }
  }
  return def;
}
/** A new empty room, with open doors to every room already next to it. */
export function addRoom(def, key) {
  const m = /^(\d),(\d)$/.exec(key);
  if (!m || +m[1] >= BW || +m[2] >= BH || def.rooms[key]) return false;
  const r = (def.rooms[key] = emptyRoom());
  for (const side of Object.keys(DOORS)) if (def.rooms[neighbor(key, side)]) r.t = setCh(r.t, ...DOORS[side], 'D');
  for (const side of ['N', 'W']) { const o = def.rooms[neighbor(key, side)]; if (o) o.t = setCh(o.t, ...DOORS[OPP[side]], 'D'); }
  syncDoors(def);
  return true;
}
export function removeRoom(def, key) { delete def.rooms[key]; syncDoors(def); }
/** Paint one tile, obeying what may go where. Returns true if something changed. */
export function paintTile(def, key, x, y, ch) {
  const r = def.rooms[key];
  if (!r || !onBoard(x, y)) return false;
  const side = doorSide(x, y), other = side && def.rooms[neighbor(key, side)];
  if (!inside(x, y)) {
    if (side && other) { if (!DOOR_OK.includes(ch)) return false; const [ox, oy] = DOORS[OPP[side]]; r.t = setCh(r.t, x, y, ch); other.t = setCh(other.t, ox, oy, ch); return true; }
    if (!BORDER_OK.includes(ch)) return false;
  } else if ('DLG'.includes(ch)) { if (ch !== 'G') return false; }                    // gates may stand inside a room; doors belong in the walls
  if (ch === 'S' || ch === 'X') for (const k of Object.keys(def.rooms)) def.rooms[k].t = def.rooms[k].t.replace(ch, '.');   // only one of each
  if (r.t[idx(x, y)] === ch) return false;
  r.t = setCh(r.t, x, y, ch);
  return true;
}
export function checkDef(def) {
  const all = Object.values(def.rooms).map((r) => r.t).join('');
  if (!Object.keys(def.rooms).length) return 'Add at least one room';
  if (!all.includes('S')) return 'Place the hero’s start (🧍) somewhere';
  if (!all.includes('X')) return 'Place the crown (👑) for the hero to find';
  return '';
}
export function cleanDef(d) {
  const def = { name: typeof d?.name === 'string' ? d.name.slice(0, 40) : '', rooms: {} };
  for (const [k, r] of Object.entries(d?.rooms || {})) {
    const m = /^(\d),(\d)$/.exec(k);
    if (!m || +m[1] >= BW || +m[2] >= BH || typeof r?.t !== 'string' || r.t.length !== RW * RH || /[^.#T%~o^brDLG_\-><AVcCSXkhpm$w+1-8]/.test(r.t)) continue;
    def.rooms[k] = { t: r.t, fx: PLATE_FX.some((f) => f[0] === r.fx) ? r.fx : 'open', msg: typeof r.msg === 'string' ? r.msg.replace(/[\u0000-\u001f]/g, ' ').slice(0, 90) : '' };
  }
  return syncDoors(def);
}

/** A whole castle at the press of a button: 7-9 rooms, a locked crown room with a dragon, keys, traps and treasure. */
export function randomDef() {
  const def = { name: pick(['Castle Grimhold', 'The Hollow Keep', 'Ravenmoor', 'Blackthorn Hall', 'The Sunken Fort', 'Castle Dreadwick']), rooms: {} };
  const start = roomKey(1 + rnd(BW - 2), 1 + rnd(BH - 2)), want = 7 + rnd(3);
  const order = [start], depth = { [start]: 0 }, parent = {};
  def.rooms[start] = emptyRoom();
  let guard = 0;
  while (order.length < want && guard++ < 500) {
    const from = pick(order), side = pick(['N', 'S', 'W', 'E']), k = neighbor(from, side), [x, y] = k.split(',').map(Number);
    if (x < 0 || y < 0 || x >= BW || y >= BH || def.rooms[k]) continue;
    def.rooms[k] = emptyRoom(); order.push(k); depth[k] = depth[from] + 1; parent[k] = from;
  }
  /* doors only along the way the castle grew, plus a few shortcuts: it reads like a real floor plan */
  for (const k of order) for (const side of ['E', 'S']) {
    const o = neighbor(k, side);
    if (!def.rooms[o]) continue;
    const linked = parent[k] === o || parent[o] === k || Math.random() < 0.25, [x, y] = DOORS[side], [ox, oy] = DOORS[OPP[side]];
    def.rooms[k].t = setCh(def.rooms[k].t, x, y, linked ? 'D' : '#'); def.rooms[o].t = setCh(def.rooms[o].t, ox, oy, linked ? 'D' : '#');
  }
  const goal = order.reduce((a, b) => (depth[b] > depth[a] ? b : a), start);
  const free = (r, x, y) => inside(x, y) && r.t[idx(x, y)] === '.' && x !== 7 && y !== 5;          // the cross between the doors always stays open
  const put = (r, ch, n = 1, any = false) => { for (let i = 0, g = 0; i < n && g < 200; g++) { const x = 1 + rnd(RW - 2), y = 1 + rnd(RH - 2); if (any ? r.t[idx(x, y)] === '.' && !(x === 7 && y === 5) : free(r, x, y)) { r.t = setCh(r.t, x, y, ch); i++; } } };
  const shapes = [
    (r) => { for (const [x, y] of [[3, 2], [11, 2], [3, 8], [11, 8]]) r.t = setCh(r.t, x, y, '#'); },
    (r) => { for (let x = 9; x <= 12; x++) for (let y = 2; y <= 3; y++) r.t = setCh(r.t, x, y, '~'); },
    (r) => { for (let x = 2; x <= 5; x++) r.t = setCh(r.t, x, 7, 'o'); for (let x = 9; x <= 12; x++) r.t = setCh(r.t, x, 3, 'o'); },
    (r) => { for (let y = 2; y <= 8; y++) if (y !== 5) { r.t = setCh(r.t, 4, y, '#'); r.t = setCh(r.t, 10, y, '#'); } },
    (r) => { for (const x of [2, 4, 10, 12]) for (const y of [2, 8]) r.t = setCh(r.t, x, y, 'b'); },
    (r) => { for (let x = 5; x <= 9; x++) if (x !== 7) { r.t = setCh(r.t, x, 3, '^'); r.t = setCh(r.t, x, 7, '^'); } },
    () => {},
  ];
  for (const k of order) {
    const r = def.rooms[k], d = depth[k];
    r.t = setCh(setCh(r.t, 3, 0, 'T'), 11, 0, 'T');
    if (k === start) { r.t = setCh(r.t, 7, 5, 'S'); r.msg = 'So. A hero comes for my crown…'; put(r, 'b', 3); continue; }
    if (k === goal) {
      r.t = setCh(r.t, 7, 2, 'X'); r.t = setCh(r.t, 7, 4, '8'); r.msg = 'You should not have come here.';
      for (const [x, y] of [[4, 2], [10, 2], [4, 8], [10, 8]]) r.t = setCh(r.t, x, y, '#');
      put(r, 'h', 2);
      for (const side of Object.keys(DOORS)) { const o = def.rooms[neighbor(k, side)], [x, y] = DOORS[side], [ox, oy] = DOORS[OPP[side]]; if (o && r.t[idx(x, y)] === 'D') { r.t = setCh(r.t, x, y, 'L'); o.t = setCh(o.t, ox, oy, 'L'); } }
      continue;
    }
    pick(shapes)(r);
    const roster = d < 2 ? ['1', '1', '2'] : d < 3 ? ['1', '2', '3', '4'] : ['3', '4', '4', '5', '6', '7'];
    for (let i = 0; i < 1 + Math.min(3, d) + rnd(2); i++) put(r, pick(roster));
    if (Math.random() < 0.5) put(r, 'c');
    if (Math.random() < 0.4) put(r, pick(['h', '$', '$', 'm', 'p']));
    if (Math.random() < 0.3) put(r, '^', 2 + rnd(3));
    if (Math.random() < 0.3) { r.t = setCh(r.t, 0, pick([2, 3, 7, 8]), '>'); }
    if (Math.random() < 0.3) { put(r, '_'); r.fx = pick(['ambush', 'dark', 'quake', 'seal']); }
  }
  const others = order.filter((k) => k !== start && k !== goal);
  const keyRoom = others.length ? others.reduce((a, b) => (depth[b] >= depth[a] ? b : a)) : start;
  put(def.rooms[keyRoom], 'k', 1, true);
  if (others.length > 1) put(def.rooms[pick(others)], 'w', 1, true);
  if (others.length > 2) put(def.rooms[pick(others)], '+', 1, true);
  return syncDoors(def);
}

/* ---------- a game in progress ---------- */
export function createState(def, mode, opt = {}) {
  const st = {
    v: 1, mode: mode === 'turn' ? 'turn' : 'live', t: 0, seq: 0, nid: 1, ev: [], rooms: {}, cur: null, goal: null, mobs: [], items: [], shots: [], bombs: [],
    hero: { x: 7, y: 5, dir: 'down', hp: 6, max: 6, keys: 0, potions: 1, bombs: 1, coins: 0, sword: 1, xp: 0, lvl: 1, inv: 0, cd: 0, atk: -9 },
    entry: { x: 7, y: 5 }, dread: 6, maxDread: 20, dark: 0, msg: null, phase: 'play', turn: { who: 'hero', ap: AP }, spikes: true,
    stats: { kills: 0, steps: 0, rooms: 0 }, name: def.name || '', autoLord: !!opt.autoLord, autoHero: !!opt.autoHero, ai: { lord: 2, hero: 0 },
  };
  for (const [key, r] of Object.entries(def.rooms)) {
    let t = '';
    for (let i = 0; i < r.t.length; i++) {
      const ch = r.t[i], x = i % RW, y = Math.floor(i / RW);
      if (MOB_CH[ch]) { addMob(st, MOB_CH[ch], key, x, y); t += '.'; }
      else if (LOOT[ch]) { st.items.push({ id: st.nid++, k: ch, r: key, x, y }); t += '.'; }
      else if (ch === 'S') { st.cur = key; st.hero.x = x; st.hero.y = y; t += '.'; }
      else { if (ch === 'X') st.goal = key; t += ch; }
    }
    st.rooms[key] = { t, fx: r.fx || 'open', msg: r.msg || '', seen: false, told: false };
  }
  if (!st.cur) st.cur = Object.keys(st.rooms)[0];
  st.entry = { x: st.hero.x, y: st.hero.y };
  arrive(st);
  return st;
}
function addMob(st, k, r, x, y, delay = 0) {
  const m = { id: st.nid++, k, r, x, y, hp: MOBS[k].hp, cd: st.t + delay + Math.random() * 0.3, dir: 1, hurt: -9, wind: 0, shot: 0, born: st.t };
  st.mobs.push(m);
  return m;
}
function ev(st, k, x = 0, y = 0, v = 0) { st.ev.push({ n: ++st.seq, k, x, y, v }); if (st.ev.length > 30) st.ev.splice(0, st.ev.length - 30); }
function say(st, text, who = 'sys') { st.msg = { n: ++st.seq, text, who }; }
export function tileAt(st, x, y, r = st.cur) { return onBoard(x, y) && st.rooms[r] ? st.rooms[r].t[idx(x, y)] : '#'; }
function setTile(st, x, y, ch, r = st.cur) { st.rooms[r].t = setCh(st.rooms[r].t, x, y, ch); }
function mobAt(st, x, y, r = st.cur) { return st.mobs.find((m) => m.r === r && m.x === x && m.y === y); }
function roomMobs(st, r = st.cur) { return st.mobs.filter((m) => m.r === r); }
export function spikesUp(st) { return st.spikes; }
function walk(ch, fly, ghost) { return ghost ? true : !SOLID.includes(ch) && ch !== 'D' && ch !== 'X' && (fly || (ch !== '~' && ch !== 'o')); }
function mobCanStand(st, m, x, y) { return inside(x, y) && walk(tileAt(st, x, y, m.r), MOBS[m.k].fly, MOBS[m.k].ghost) && !mobAt(st, x, y, m.r) && !(m.r === st.cur && st.hero.x === x && st.hero.y === y); }
function heroCanStand(ch) { return !SOLID.includes(ch) && ch !== '~'; }

function arrive(st) {
  const room = st.rooms[st.cur];
  if (!room.seen) { room.seen = true; st.stats.rooms++; }
  st.shots = []; st.bombs = [];
  for (const m of roomMobs(st)) { m.cd = st.t + 0.5 + Math.random() * 0.4; m.wind = 0; }
  const squat = mobAt(st, st.hero.x, st.hero.y);
  if (squat) { const spot = freeSpots(st, st.cur, 0)[0]; if (spot) { squat.x = spot.x; squat.y = spot.y; } }
  if (room.msg && !room.told) { room.told = true; say(st, room.msg, 'lord'); }
  checkGates(st);
}
function freeSpots(st, r, minDist) {
  const out = [];
  for (let y = 1; y < RH - 1; y++) for (let x = 1; x < RW - 1; x++) {
    if (st.rooms[r].t[idx(x, y)] !== '.' || mobAt(st, x, y, r) || st.items.some((i) => i.r === r && i.x === x && i.y === y)) continue;
    if (r === st.cur && dist(st.hero, { x, y }) < minDist) continue;
    out.push({ x, y });
  }
  if (r === st.cur) out.sort((a, b) => dist(a, st.hero) - dist(b, st.hero));
  return out;
}
/** Gates open as soon as the room holds no monsters and no unpressed plates. */
function checkGates(st, r = st.cur) {
  const room = st.rooms[r];
  if (!room.t.includes('G') || room.t.includes('_') || roomMobs(st, r).length) return;
  let opened = false;
  for (let i = 0; i < room.t.length; i++) if (room.t[i] === 'G') {
    const x = i % RW, y = Math.floor(i / RW), side = doorSide(x, y);
    setTile(st, x, y, inside(x, y) ? '.' : 'D', r); opened = true;
    if (side && st.rooms[neighbor(r, side)]) { const [ox, oy] = DOORS[OPP[side]]; if (tileAt(st, ox, oy, neighbor(r, side)) === 'G') setTile(st, ox, oy, 'D', neighbor(r, side)); }
  }
  if (opened && r === st.cur) ev(st, 'gate', 7, 5);
}
function hurtHero(st, dmg) {
  const h = st.hero;
  if (st.t < h.inv || st.phase !== 'play') return;
  h.hp = Math.max(0, h.hp - dmg); h.inv = st.t + (st.mode === 'turn' ? 0.5 : 0.9);
  ev(st, 'hurt', h.x, h.y, dmg);
  if (h.hp <= 0) { st.phase = 'lost'; ev(st, 'dead', h.x, h.y); }
}
function drop(st, x, y, r, chance) {
  if (Math.random() > chance || st.items.some((i) => i.r === r && i.x === x && i.y === y) || tileAt(st, x, y, r) !== '.') return;
  st.items.push({ id: st.nid++, k: Math.random() < 0.4 ? 'h' : '$', r, x, y });
}
function hitMob(st, m, dmg, fromX, fromY) {
  m.hp -= dmg; m.hurt = st.t; m.wind = 0; m.cd = Math.max(m.cd, st.t + 0.25);
  ev(st, 'hit', m.x, m.y, dmg);
  if (m.hp <= 0) {
    st.mobs.splice(st.mobs.indexOf(m), 1);
    ev(st, 'kill', m.x, m.y, m.k === 'boss' ? 1 : 0);
    st.stats.kills++; drop(st, m.x, m.y, m.r, 0.45);
    const h = st.hero; h.xp += m.k === 'boss' ? 5 : 1;
    if (h.xp >= h.lvl * 4) { h.xp -= h.lvl * 4; h.lvl++; h.max = Math.min(20, h.max + 2); h.hp = Math.min(h.max, h.hp + 2); ev(st, 'levelup', h.x, h.y, h.lvl); say(st, `Level ${h.lvl}! One more heart.`); }
    checkGates(st, m.r);
    return;
  }
  const dx = Math.sign(m.x - fromX), dy = Math.sign(m.y - fromY);            // knocked back a step
  if (!MOBS[m.k].big && (dx || dy) && mobCanStand(st, m, m.x + dx, m.y + dy)) { m.x += dx; m.y += dy; }
}
function take(st, it) {
  const h = st.hero;
  if (it.k === 'k') h.keys++; else if (it.k === 'h') { if (h.hp >= h.max) return false; h.hp = Math.min(h.max, h.hp + 2); }
  else if (it.k === 'p') h.potions++; else if (it.k === 'm') h.bombs++; else if (it.k === '$') h.coins++;
  else if (it.k === 'w') { h.sword = 2; say(st, 'A golden sword! It cuts twice as deep.'); }
  else if (it.k === '+') { h.max = Math.min(20, h.max + 2); h.hp = h.max; say(st, 'A heart container! Fully healed.'); }
  ev(st, it.k === '$' ? 'coin' : it.k === 'h' ? 'heal' : it.k === 'k' ? 'key' : 'pickup', h.x, h.y);
  return true;
}
function plate(st, x, y) {
  const room = st.rooms[st.cur];
  setTile(st, x, y, '-'); ev(st, 'plate', x, y);
  runFx(st, room.fx);
  checkGates(st);
}
function spawnPack(st, n, kinds) {
  const spots = freeSpots(st, st.cur, 3).sort(() => Math.random() - 0.5);
  for (let i = 0; i < n && i < spots.length; i++) { addMob(st, pick(kinds), st.cur, spots[i].x, spots[i].y, 0.7); ev(st, 'spawn', spots[i].x, spots[i].y); }
}
function runFx(st, fx) {
  const room = st.rooms[st.cur];
  if (fx === 'ambush') { spawnPack(st, 3, ['slime', 'skeleton', 'spider']); say(st, 'An ambush!', 'lord'); }
  else if (fx === 'seal') {
    for (let i = 0; i < room.t.length; i++) if (room.t[i] === 'D') setTile(st, i % RW, Math.floor(i / RW), 'G');
    spawnPack(st, 4, ['skeleton', 'spider', 'bat', 'slime']); ev(st, 'slam', 7, 5); say(st, 'The doors slam shut!', 'lord');
  } else if (fx === 'dark') { st.dark = st.t + 9; ev(st, 'dark', 7, 5); }
  else if (fx === 'arrows') fireTraps(st, true);
  else if (fx === 'quake') {
    ev(st, 'quake', 7, 5);
    const spots = freeSpots(st, st.cur, 0).sort(() => Math.random() - 0.5).slice(0, 7);
    for (const s of spots) { if (dist(s, st.hero) <= 1 && Math.random() < 0.5) continue; setTile(st, s.x, s.y, 'r'); }
    if (Math.random() < 0.6) hurtHero(st, 1);
  } else ev(st, 'click', st.hero.x, st.hero.y);
}
const TRAP_DIR = { '>': [1, 0], '<': [-1, 0], A: [0, -1], V: [0, 1] };
function fireTraps(st, all) {
  const room = st.rooms[st.cur], h = st.hero;
  for (let i = 0; i < room.t.length; i++) {
    const d = TRAP_DIR[room.t[i]];
    if (!d) continue;
    const x = i % RW, y = Math.floor(i / RW);
    if (!all) {                                                    // on their own, traps fire when the hero walks into their line
      let cx = x + d[0], cy = y + d[1], seen = false;
      while (onBoard(cx, cy) && !SOLID.includes(tileAt(st, cx, cy))) { if (cx === h.x && cy === h.y) { seen = true; break; } cx += d[0]; cy += d[1]; }
      const key = `${x},${y}`;
      st.ai.traps = st.ai.traps || {};
      if (!seen || (st.ai.traps[key] || 0) > st.t) continue;
      st.ai.traps[key] = st.t + 1.5;
    }
    st.shots.push({ id: st.nid++, k: 'arrow', x, y, dx: d[0], dy: d[1], next: st.t + 0.12, by: 'trap' });
    ev(st, 'shoot', x, y);
  }
}

/* ---------- the hero ---------- */
/** a: { k: 'move' | 'attack' | 'potion' | 'bomb' | 'wait', dir }. Returns true if the hero did something. */
export function heroAct(st, a) {
  const h = st.hero;
  if (st.phase !== 'play') return false;
  if (st.mode === 'turn') { if (st.turn.who !== 'hero') return false; } else if (st.t < h.cd) return false;
  let did = false;
  if (a.dir && DIRS[a.dir]) h.dir = a.dir;
  if (a.k === 'move') did = move(st);
  else if (a.k === 'attack') { attack(st); did = true; h.cd = st.t + 0.27; }
  else if (a.k === 'potion') { if (h.potions > 0 && h.hp < h.max) { h.potions--; h.hp = Math.min(h.max, h.hp + 4); ev(st, 'heal', h.x, h.y); did = true; h.cd = st.t + 0.3; } }
  else if (a.k === 'bomb') { if (h.bombs > 0 && !st.bombs.some((b) => b.x === h.x && b.y === h.y)) { h.bombs--; st.bombs.push({ id: st.nid++, x: h.x, y: h.y, at: st.t + 1.6 }); ev(st, 'fuse', h.x, h.y); did = true; h.cd = st.t + 0.3; } }
  else if (a.k === 'wait') did = true;
  if (did && st.mode === 'turn') {
    for (let i = 0; i < 5; i++) tick(st, 0.05);
    if (st.phase === 'play' && --st.turn.ap <= 0) { st.turn = { who: 'lord', ap: 0 }; st.dread = Math.min(st.maxDread, st.dread + 4); ev(st, 'lordturn'); }
  }
  return did;
}
function move(st) {
  const h = st.hero, [dx, dy] = DIRS[h.dir], x = h.x + dx, y = h.y + dy, ch = tileAt(st, x, y), side = doorSide(x, y);
  if (!onBoard(x, y)) return false;
  if (ch === 'L') {
    if (!h.keys) { if (!st.msg || st.msg.text !== 'Locked. There must be a key somewhere.') say(st, 'Locked. There must be a key somewhere.'); ev(st, 'locked', x, y); h.cd = st.t + 0.3; return false; }
    h.keys--; setTile(st, x, y, inside(x, y) ? '.' : 'D');
    if (side && st.rooms[neighbor(st.cur, side)]) { const [ox, oy] = DOORS[OPP[side]]; setTile(st, ox, oy, 'D', neighbor(st.cur, side)); }
    ev(st, 'unlock', x, y); h.cd = st.t + 0.3;
    return true;
  }
  if (ch === 'G') { ev(st, 'locked', x, y); say(st, roomMobs(st).length ? 'Sealed! Defeat every monster in the room.' : 'Sealed. Something in here must open it.'); h.cd = st.t + 0.3; return false; }
  if (ch === 'c') {
    setTile(st, x, y, 'C');
    const r = Math.random(), k = r < 0.35 ? 'p' : r < 0.6 ? 'm' : r < 0.85 ? '$' : '+';
    if (k === '$') { h.coins += 5; say(st, 'The chest holds 5 coins.'); ev(st, 'coin', x, y); } else { take(st, { k }); if (k !== '+') say(st, `The chest holds a ${LOOT[k].name.toLowerCase()}.`); }
    ev(st, 'chest', x, y); h.cd = st.t + 0.3;
    return true;
  }
  if (!heroCanStand(ch) || mobAt(st, x, y)) return false;
  if (ch === 'D' && side) {
    const nk = neighbor(st.cur, side);
    if (!st.rooms[nk]) return false;
    const [ox, oy] = DOORS[OPP[side]], d = SIDE_D[side];
    st.cur = nk; h.x = ox + d[0]; h.y = oy + d[1]; st.entry = { x: h.x, y: h.y }; h.cd = st.t + 0.3; st.stats.steps++;
    ev(st, 'door', h.x, h.y);
    arrive(st);
    return true;
  }
  h.x = x; h.y = y; h.cd = st.t + 0.135; st.stats.steps++;
  ev(st, 'step', x, y);
  for (const it of st.items.filter((i) => i.r === st.cur && i.x === x && i.y === y)) if (take(st, it)) st.items.splice(st.items.indexOf(it), 1);
  if (ch === 'o') { ev(st, 'fall', x, y); hurtHero(st, 1); h.x = st.entry.x; h.y = st.entry.y; h.cd = st.t + 0.5; }
  else if (ch === '^' && spikesUp(st)) hurtHero(st, 1);
  else if (ch === '_') plate(st, x, y);
  else if (ch === 'X') { st.phase = 'won'; ev(st, 'win', x, y); }
  return true;
}
function smash(st, x, y) {
  const ch = tileAt(st, x, y);
  if (ch === 'b' || ch === 'r') { setTile(st, x, y, '.'); ev(st, 'break', x, y); if (ch === 'b') drop(st, x, y, st.cur, 0.4); return true; }
  return false;
}
function attack(st) {
  const h = st.hero, [dx, dy] = DIRS[h.dir], x = h.x + dx, y = h.y + dy;
  h.atk = st.t; ev(st, 'swing', x, y);
  const m = mobAt(st, x, y);
  if (m) hitMob(st, m, h.sword, h.x, h.y); else smash(st, x, y);
}
function explode(st, b) {
  ev(st, 'boom', b.x, b.y);
  for (let y = b.y - 1; y <= b.y + 1; y++) for (let x = b.x - 1; x <= b.x + 1; x++) {
    if (!inside(x, y)) continue;
    if (tileAt(st, x, y) === '%') { setTile(st, x, y, '.'); ev(st, 'break', x, y); } else smash(st, x, y);
    const m = mobAt(st, x, y);
    if (m) hitMob(st, m, 3, b.x, b.y);
    if (st.hero.x === x && st.hero.y === y) hurtHero(st, 2);
  }
}

/* ---------- the world ---------- */
/** Move time on. In live mode the host calls this every frame; in turn mode every hero action is worth a quarter second. */
export function advance(st, dt) {
  if (st.phase !== 'play' || st.mode !== 'live') return;
  st.dread = Math.min(st.maxDread, st.dread + dt / 1.6);
  for (let left = Math.min(dt, 0.25); left > 0; left -= 0.05) tick(st, Math.min(0.05, left));
}
function tick(st, dt) {
  if (st.phase !== 'play') return;
  st.t += dt;
  const h = st.hero, up = Math.floor(st.t / 1.1) % 2 === 0;
  if (up !== st.spikes) { st.spikes = up; if (up && tileAt(st, h.x, h.y) === '^') hurtHero(st, 1); }
  fireTraps(st, false);
  let field = null;
  for (const m of roomMobs(st)) {
    if (st.phase !== 'play') break;
    const T = MOBS[m.k];
    if (m.wind) {                                                  // the strike that was telegraphed
      if (st.t < m.wind) continue;
      m.wind = 0; m.cd = st.t + T.iv;
      if (dist(m, h) === 1) { ev(st, 'bite', h.x, h.y); hurtHero(st, T.dmg); }
      continue;
    }
    if (st.t < m.cd) continue;
    const d = dist(m, h);
    if (m.x !== h.x) m.dir = Math.sign(h.x - m.x);
    if (T.shoots && st.t >= m.shot && (m.x === h.x || m.y === h.y) && d > 1 && clearLine(st, m, h)) {
      m.shot = st.t + (T.big ? 1.9 : 1.7); m.cd = st.t + T.iv;
      st.shots.push({ id: st.nid++, k: T.shoots, x: m.x, y: m.y, dx: Math.sign(h.x - m.x), dy: Math.sign(h.y - m.y), next: st.t + 0.12, by: 'mob', dmg: T.big ? 2 : 1 });
      ev(st, T.big ? 'roar' : 'shoot', m.x, m.y);
      continue;
    }
    if (d === 1) { m.wind = st.t + 0.38; ev(st, 'wind', m.x, m.y); continue; }
    let step = null;
    if (T.ghost || T.fly) {
      const opts = [[Math.sign(h.x - m.x), 0], [0, Math.sign(h.y - m.y)]].filter(([a, b]) => a || b);
      if (Math.abs(h.y - m.y) > Math.abs(h.x - m.x)) opts.reverse();
      if (m.k === 'bat' && Math.random() < 0.4) opts.unshift(pick(Object.values(DIRS)));
      step = opts.find(([a, b]) => mobCanStand(st, m, m.x + a, m.y + b));
    } else {
      field = field || distField(st);
      let best = field[idx(m.x, m.y)];
      if (m.k === 'archer' && d < 3) best = -1;                    // archers keep their distance
      for (const [a, b] of Object.values(DIRS)) {
        const x = m.x + a, y = m.y + b;
        if (!mobCanStand(st, m, x, y)) continue;
        const v = field[idx(x, y)];
        if (m.k === 'archer' && d < 3 ? v > best && v < 999 : v < best) { best = v; step = [a, b]; }
      }
    }
    if (step) { m.x += step[0]; m.y += step[1]; }
    m.cd = st.t + T.iv * (0.9 + Math.random() * 0.2);
  }
  for (const s of [...st.shots]) {
    while (st.t >= s.next && st.shots.includes(s)) {
      s.next += 0.085; s.x += s.dx; s.y += s.dy;
      const gone = () => st.shots.splice(st.shots.indexOf(s), 1);
      if (s.x === h.x && s.y === h.y) { hurtHero(st, s.dmg || 1); gone(); } else if (!onBoard(s.x, s.y) || SOLID.includes(tileAt(st, s.x, s.y)) || tileAt(st, s.x, s.y) === 'D') gone();
    }
  }
  for (const b of [...st.bombs]) if (st.t >= b.at) { st.bombs.splice(st.bombs.indexOf(b), 1); explode(st, b); }
}
function clearLine(st, a, b) {
  const dx = Math.sign(b.x - a.x), dy = Math.sign(b.y - a.y);
  for (let x = a.x + dx, y = a.y + dy; x !== b.x || y !== b.y; x += dx, y += dy) if (SOLID.includes(tileAt(st, x, y))) return false;
  return true;
}
/** Steps to the hero from every tile a walking monster can use. */
function distField(st, ok = (ch) => walk(ch, false, false), from = st.hero) {
  const f = new Array(RW * RH).fill(999), q = [[from.x, from.y]];
  f[idx(from.x, from.y)] = 0;
  while (q.length) {
    const [x, y] = q.shift(), v = f[idx(x, y)] + 1;
    for (const [a, b] of Object.values(DIRS)) {
      const nx = x + a, ny = y + b;
      if (!onBoard(nx, ny) || f[idx(nx, ny)] <= v || !ok(tileAt(st, nx, ny), nx, ny)) continue;
      f[idx(nx, ny)] = v; q.push([nx, ny]);
    }
  }
  return f;
}

/* ---------- the Overlord ---------- */
/** Can the Overlord put something on this tile? */
export function canPlace(st, r, x, y) {
  if (!st.rooms[r] || !inside(x, y) || st.rooms[r].t[idx(x, y)] !== '.') return false;
  if (st.mobs.some((m) => m.r === r && m.x === x && m.y === y) || st.items.some((i) => i.r === r && i.x === x && i.y === y)) return false;
  return !(r === st.cur && dist(st.hero, { x, y }) < 3);
}
/** c: { k: 'spawn' | power | 'spook' | 'whisper' | 'endturn', ... }. Returns '' or the reason it was refused. */
export function lordCmd(st, c) {
  if (st.phase !== 'play') return 'The game is over';
  if (c.k === 'whisper') { const text = String(c.text || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 90); if (text) { say(st, text, 'lord'); ev(st, 'whisper'); } return ''; }
  if (c.k === 'spook') { if (SPOOKS.some((s) => s[0] === c.s)) ev(st, 'spook', 0, 0, c.s); return ''; }
  if (st.mode === 'turn' && st.turn.who !== 'lord') return 'Wait for your turn';
  if (c.k === 'endturn') { if (st.mode === 'turn') { st.turn = { who: 'hero', ap: AP }; ev(st, 'heroturn'); } return ''; }
  const cost = c.k === 'spawn' ? (MOBS[c.m] || {}).cost : (POWERS[c.k] || {}).cost;
  if (!cost || (c.k === 'spawn' && c.m === 'boss')) return 'Unknown power';
  if (st.dread < cost) return 'Not enough dread yet';
  const here = roomMobs(st).length;
  if (c.k === 'spawn' || c.k === 'spikes') {
    if (!canPlace(st, c.r, c.x, c.y)) return 'Not there — pick an empty floor tile away from the hero';
    if (c.k === 'spawn') { if (roomMobs(st, c.r).length >= 8) return 'That room is full of monsters'; addMob(st, c.m, c.r, c.x, c.y, 0.8); if (c.r === st.cur) ev(st, 'spawn', c.x, c.y); }
    else { setTile(st, c.x, c.y, '^', c.r); if (c.r === st.cur) ev(st, 'click', c.x, c.y); }
  } else if (c.k === 'heal') { if (!here) return 'No monsters with the hero'; for (const m of roomMobs(st)) m.hp = Math.min(MOBS[m.k].hp + 2, m.hp + 2); ev(st, 'mend', 7, 5); }
  else if (c.k === 'seal') {
    if (!here) return 'No monsters with the hero — the doors would open again at once';
    const room = st.rooms[st.cur];
    for (let i = 0; i < room.t.length; i++) if (room.t[i] === 'D') setTile(st, i % RW, Math.floor(i / RW), 'G');
    ev(st, 'slam', 7, 5); say(st, 'The doors slam shut!', 'lord');
  } else runFx(st, c.k);
  st.dread -= cost;
  return '';
}
/** A simple Overlord for playing alone. The host calls this often; it acts every few seconds. */
export function autoLord(st) {
  if (st.phase !== 'play' || !st.autoLord) return;
  if (st.mode === 'turn') { if (st.turn.who !== 'lord') return; lordThink(st); if (Math.random() < 0.5) lordThink(st); lordCmd(st, { k: 'endturn' }); return; }
  if (st.t < st.ai.lord) return;
  st.ai.lord = st.t + 2.5 + Math.random() * 3;
  lordThink(st);
}
const TAUNTS = ['Turn back, little hero.', 'I can hear your heart beating.', 'These halls have eaten better than you.', 'Do you feel the walls watching?', 'My pets are hungry.', 'You will never leave.', 'Closer… closer…'];
function lordThink(st) {
  const r = Math.random(), here = roomMobs(st).length, spots = freeSpots(st, st.cur, 3);
  if (r < 0.12) return void lordCmd(st, { k: 'whisper', text: pick(TAUNTS) });
  if (r < 0.2) return void lordCmd(st, { k: 'spook', s: pick(SPOOKS)[0] });
  if (r < 0.28 && st.dread >= 8) return void lordCmd(st, { k: 'dark' });
  if (r < 0.36 && spots.length) { const s = spots[Math.min(spots.length - 1, rnd(4))]; return void lordCmd(st, { k: 'spikes', r: st.cur, x: s.x, y: s.y }); }
  if (r < 0.42 && here >= 2 && st.dread >= 10) return void lordCmd(st, { k: 'seal' });
  if (here >= 4 || !spots.length) return;
  const can = Object.keys(MOBS).filter((k) => k !== 'boss' && MOBS[k].cost <= st.dread - (st.stats.rooms < 3 ? 2 : 0));
  if (can.length) { const s = pick(spots.slice(Math.floor(spots.length / 3))); lordCmd(st, { k: 'spawn', m: pick(can), r: st.cur, x: s.x, y: s.y }); }
}

/* ---------- a simple hero, for when the Director plays alone ---------- */
/** Returns the next action for a computer-played hero, or null to stand still. */
export function autoHero(st) {
  const h = st.hero;
  if (st.phase !== 'play') return null;
  if (h.hp <= 2 && h.potions) return { k: 'potion' };
  const mobs = roomMobs(st);
  for (const d of DIR_NAMES) { const m = mobAt(st, h.x + DIRS[d][0], h.y + DIRS[d][1]); if (m) return { k: 'attack', dir: d }; }
  const safe = (ch, x, y) => heroCanStand(ch) && ch !== 'o' && ch !== 'L' && !(ch === 'D' && doorSide(x, y)) && ch !== 'X';
  const stepTo = (tx, ty) => {                               // first step of the shortest safe path to a tile
    const f = distField(st, safe, { x: tx, y: ty }), here = f[idx(h.x, h.y)];
    if (here >= 999) return null;
    let best = here, dir = null;
    for (const d of DIR_NAMES) {
      const x = h.x + DIRS[d][0], y = h.y + DIRS[d][1], end = x === tx && y === ty;
      if (onBoard(x, y) && f[idx(x, y)] < best && (end || !mobAt(st, x, y))) { best = f[idx(x, y)]; dir = d; }
    }
    return dir;
  };
  const go = (tx, ty) => {
    const d = stepTo(tx, ty);
    if (!d) return null;
    const x = h.x + DIRS[d][0], y = h.y + DIRS[d][1];
    if (tileAt(st, x, y) === '^' && spikesUp(st)) return { k: 'wait' };
    return { k: 'move', dir: d };
  };
  const tryAll = (list) => { for (const t of list.sort((a, b) => dist(a, h) - dist(b, h))) { const a = go(t.x, t.y); if (a) return a; } return null; };
  const tiles = (chars) => { const out = [], t = st.rooms[st.cur].t; for (let i = 0; i < t.length; i++) if (chars.includes(t[i])) out.push({ x: i % RW, y: Math.floor(i / RW), ch: t[i] }); return out; };
  let a = mobs.length ? tryAll(mobs.map((m) => ({ x: m.x, y: m.y }))) : null;
  a = a || tryAll(st.items.filter((i) => i.r === st.cur && !(i.k === 'h' && h.hp >= h.max))) || tryAll(tiles('cX')) || (st.rooms[st.cur].t.includes('G') ? tryAll(tiles('_')) : null);
  if (a) return a;
  /* which door? walk the castle's floor plan to the crown if a way is open, else to the nearest room not seen yet */
  const exits = (k, keys) => Object.keys(DOORS).filter((s) => st.rooms[neighbor(k, s)] && ('D'.includes(tileAt(st, ...DOORS[s], k)) || (keys && tileAt(st, ...DOORS[s], k) === 'L')));
  const seenQ = { [st.cur]: null }, q = [st.cur];
  let target = null, fallback = null;
  while (q.length) {
    const k = q.shift();
    if (k !== st.cur && (k === st.goal || !st.rooms[k].seen)) { if (k === st.goal) { target = k; break; } fallback = fallback || k; }
    for (const s of exits(k, h.keys > 0)) { const n = neighbor(k, s); if (!(n in seenQ)) { seenQ[n] = { from: k, side: s }; q.push(n); } }
  }
  target = target || fallback;
  let side = null;
  if (target) { let k = target; while (seenQ[k] && seenQ[k].from !== st.cur) k = seenQ[k].from; side = seenQ[k] && seenQ[k].side; }
  else { const ex = exits(st.cur, h.keys > 0); side = ex.length ? pick(ex) : null; }
  if (side) { const [x, y] = DOORS[side]; a = go(x, y); if (a) return a; }
  for (const d of DIR_NAMES) if ('br'.includes(tileAt(st, h.x + DIRS[d][0], h.y + DIRS[d][1]))) return { k: 'attack', dir: d };   // boxed in: cut a way out
  if (h.bombs && DIR_NAMES.some((d) => tileAt(st, h.x + DIRS[d][0], h.y + DIRS[d][1]) === '%')) return { k: 'bomb' };
  return Math.random() < 0.5 ? { k: 'move', dir: pick(DIR_NAMES) } : { k: 'wait' };
}
