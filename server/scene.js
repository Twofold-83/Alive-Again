import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PUBLIC, MAX_ENTITIES } from './config.js';
import { arr, num, r3, str, uid, HEX } from './util.js';

const HERO_ASSET = fs.existsSync(path.join(PUBLIC, 'px', 'hero.png')) ? 'p:hero' : 's:person';
export function newScene() {
  return {
    backdrop: 'b:room', mood: 'm:none', narration: '', action: '', heroId: 'hero',
    entities: [{ id: 'hero', asset: HERO_ASSET, x: 0.5, y: 0.78, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '' }],
    drawing: [], weather: '',                          // persistent decoration
    tracks: [], burst: '', sfx: '', card: '', choices: [], // the Director's one-turn extras
    steps: [],                                         // earlier moments of a step-by-step turn, played in order before this scene
    sheet: { inv: [], stats: [] },                     // inventory + stats (story-type layers)
    target: null, point: null, order: [], use: null, roll: null,               // the Player's one-turn extras (+ dice)
    level: null,                                       // tile grid: floors, walls (see cleanLevel)
    ask: null,                                         // what the Director asks of the Player this turn (see cleanAsk)
    answer: null, verb: '', exit: null,                // the Player's reply, the verb used on an active object, the exit headed for
    exits: [], sceneId: '',                            // ways out to other prepared scenes; which prepared scene this is
    cam: null,                                         // camera: { x, y, z } zoom on a point
    travel: '', award: null, floats: [],               // one step: travel title, points award, floating numbers
    battle: null,                                      // { round } while a battle is on
  };
}
/* Old saved stories predate some fields. */
export function upgradeScene(sc) {
  const d = newScene();
  for (const k of Object.keys(d)) if (sc[k] === undefined) sc[k] = k === 'entities' ? [] : d[k];
  sc.sheet.inv = sc.sheet.inv || []; sc.sheet.stats = sc.sheet.stats || [];
  return sc;
}

const TYPES = { free: { inventory: false, stats: false, dice: false }, adventure: { inventory: true, stats: true, dice: true }, rpg: { inventory: false, stats: false, dice: false } };
/* How the Player takes part (set by the Director):
 *   tell     the Player only writes what they want to do; the Director stages it
 *   free     the Player moves, animates and speaks for their hero
 *   limited  the Player must pick one of the options the Director offered
 * With free or limited will the hero may walk once per turn (click a destination); the walk is sent as a track. */
const PLAYER_MODES = ['free', 'limited', 'tell'];
export function cleanRules(r) {
  const type = r && TYPES[r.type] ? r.type : 'free';
  const m = (r && r.modules) || TYPES[type];
  return {
    type, modules: { inventory: !!m.inventory, stats: !!m.stats, dice: !!m.dice, points: !!m.points },
    player: r && PLAYER_MODES.includes(r.player) ? r.player : 'free',
  };
}
/* A level is a 16 x 12 grid of tiles over the backdrop. pal lists the tiles in use
 * ({ a: asset, k: 'f' floor | 'w' wall }); cells is 192 characters, '0' for empty,
 * otherwise a base-36 index into pal (1 = pal[0]). Where a level exists the hero
 * may only stand on floor tiles, and solid things block the way. */
const LEVEL_W = 16, LEVEL_H = 12;
function cleanLevel(l) {
  if (!l || typeof l !== 'object' || typeof l.cells !== 'string' || !/^[0-9a-z]{192}$/.test(l.cells) || !/[^0]/.test(l.cells)) return null;
  const pal = arr(l.pal).slice(0, 35).map((t) => ({ a: /^p:[a-z0-9-]{1,60}$/.test(t && t.a) ? t.a : 'p:hero', k: t && t.k === 'w' ? 'w' : 'f' }));
  let cells = '';
  for (const ch of l.cells) cells += parseInt(ch, 36) <= pal.length ? ch : '0';
  return { pal, cells };
}
export function walkable(sc, x, y) {
  if (sc.level) {
    const i = Math.min(LEVEL_H - 1, Math.floor(y * LEVEL_H)) * LEVEL_W + Math.min(LEVEL_W - 1, Math.floor(x * LEVEL_W));
    const t = sc.level.pal[parseInt(sc.level.cells[i], 36) - 1];
    if (!t || t.k !== 'f') return false;
  }
  for (const e of sc.entities) {
    if (!e.solid || e.id === sc.heroId) continue;
    if (Math.hypot((x - e.x) / (0.065 * e.scale), ((y - e.y + 0.02 * e.scale) * 0.75) / (0.04 * e.scale)) < 1) return false;
  }
  return true;
}
export function cleanTrackPts(raw) {
  const pts = []; let last = 0;
  for (let i = 0; i + 2 < raw.length && i < 660; i += 3) {
    last = Math.max(last, Math.round(num(raw[i], 0, 10000, 0)));
    pts.push(last, r3(num(raw[i + 1], -0.3, 1.3, 0)), r3(num(raw[i + 2], -0.3, 1.3, 0)));   // a little beyond the edges: things may enter from outside
  }
  return pts;
}
export const rollDie = (sides) => ([6, 20].includes(sides) ? { sides, value: 1 + crypto.randomInt(sides) } : null);

/* What the Director asks of the Player for their next turn. kind:
 *   roll     roll a die (sides 6|20; dc = the number to reach, 0 for none)
 *   discard  give up one inventory item
 *   place    walk to one of the marked places [{ label, x, y }]
 *   target   pick one of the listed characters or things (verb: "Attack", "Talk to", ...)
 *   battle   a battle move: attack an enemy, defend, or flee */
function cleanAsk(a, ids) {
  if (!a || typeof a !== 'object' || !['roll', 'discard', 'place', 'target', 'battle'].includes(a.kind)) return null;
  return {
    kind: a.kind, text: str(a.text, 120), sides: a.sides === 20 ? 20 : 6, dc: Math.round(num(a.dc, 0, 20, 0)), verb: str(a.verb, 20),
    places: arr(a.places).slice(0, 6).filter((p) => p && typeof p === 'object').map((p) => ({ label: str(p.label, 30) || 'Here', x: r3(num(p.x, 0, 1, 0.5)), y: r3(num(p.y, 0.08, 1, 0.5)) })),
    targets: arr(a.targets).filter((id) => ids.has(id)).slice(0, 12),
  };
}
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
  return { inv, stats, points: Math.round(num(s && s.points, -99999, 99999, 0)) };
}

export function cleanScene(s, prev, inner) {
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
      rot: Math.round(num(e.rot, -360, 360, 0)), say: str(e.say, 160), fx: str(e.fx, 12), emote: str(e.emote, 16), solid: !!e.solid,
      active: e.active && typeof e.active === 'object' && str(e.active.name, 40) ? { name: str(e.active.name, 40), verbs: arr(e.active.verbs).map((v) => str(v, 16)).filter(Boolean).slice(0, 6) } : null,
      tie: e.tie && typeof e.tie === 'object' && typeof e.tie.to === 'string' ? { to: str(e.tie.to, 24), dx: r3(num(e.tie.dx, -1, 1, 0)), dy: r3(num(e.tie.dy, -1, 1, 0)), front: e.tie.front !== false } : null,
      hp: e.hp == null ? null : Math.round(num(e.hp, 0, 9999, 1)), maxHp: e.hp == null ? null : Math.round(num(e.maxHp, 1, 9999, 1)),
      once: str(e.once, 12), temp: !!e.temp, layer: Math.sign(Math.round(num(e.layer, -1, 1, 0))),
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
    const pts = cleanTrackPts(t.pts);
    if (pts.length >= 6) tracks.push({ id: t.id, pts });
  }
  return {
    backdrop: str(s.backdrop, 80) || prev.backdrop, mood: str(s.mood, 40) || 'm:none',
    narration: str(s.narration, 240), action: '', heroId: seen.has(s.heroId) ? s.heroId : null, entities,
    drawing, weather: str(s.weather, 12), tracks, burst: str(s.burst, 12), sfx: str(s.sfx, 12), card: str(s.card, 60),
    choices: arr(s.choices).map((c) => str(c, 40)).filter(Boolean).slice(0, 4),
    sheet: cleanSheet(s.sheet), target: null, point: null, order: [], use: null, roll: null,
    level: cleanLevel(s.level),
    ask: cleanAsk(s.ask, seen), answer: null, verb: '', exit: null,
    exits: arr(s.exits).slice(0, 12).filter((x) => x && typeof x === 'object').map((x) => ({ id: str(x.id, 24) || uid(), to: str(x.to, 24), label: str(x.label, 40) || 'Exit', x: r3(num(x.x, 0, 1, 0.5)), y: r3(num(x.y, 0, 1, 0.5)), locked: !!x.locked })),
    sceneId: str(s.sceneId, 24),
    cam: s.cam && typeof s.cam === 'object' && num(s.cam.z, 1, 4, 1) > 1 ? { x: r3(num(s.cam.x, 0, 1, 0.5)), y: r3(num(s.cam.y, 0, 1, 0.5)), z: r3(num(s.cam.z, 1, 4, 1)) } : null,
    travel: str(s.travel, 60),
    award: s.award && typeof s.award === 'object' ? { n: Math.round(num(s.award.n, -9999, 9999, 0)), text: str(s.award.text, 60) } : null,
    floats: arr(s.floats).slice(0, 12).filter((f) => f && seen.has(f.id)).map((f) => ({ id: f.id, text: str(f.text, 12), c: HEX.test(f.c) ? f.c : '#ffffff' })),
    battle: s.battle && typeof s.battle === 'object' ? { round: Math.round(num(s.battle.round, 1, 999, 1)) } : null,
    steps: inner ? [] : arr(s.steps).slice(0, 80).filter((f) => f && typeof f === 'object').map((f) => cleanScene(f, prev, true)),
  };
}

/* How long the other side will be watching this turn play out, so it is not charged to their clock. */
export function cutEstimate(scene, before) {
  let total = 0, prev = before;
  for (const sc of [...(scene.steps || []), scene]) {
    const old = new Map((prev ? prev.entities : []).map((e) => [e.id, e.say]));
    let ms = 1500;
    for (const t of sc.tracks) ms = Math.max(ms, 900 + t.pts[t.pts.length - 3]);
    for (const e of sc.entities) if (e.say && old.get(e.id) !== e.say) ms += 900 + 45 * e.say.length;
    if (sc.narration && !(prev && prev.narration === sc.narration)) ms += Math.min(4500, 900 + 40 * sc.narration.length);
    if (sc.card) ms += 2100;
    if (sc.travel) ms += 2400;
    if (sc.award) ms += 1700;
    if (sc.roll) ms += 1700;
    if (sc.action || sc.target || sc.use || sc.point) ms += 1300;
    total += ms; prev = sc;
  }
  return Math.min(total, 240000);
}
