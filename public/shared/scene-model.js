/*
 * The scene: the one piece of data a story revolves around. The browser draws it, edits a draft of it and plays
 * it back; the server validates it and keeps the committed copy. This file is loaded by both, so the shape of a
 * scene and the rules that depend on it are written down exactly once.
 *
 * A scene's fields fall into groups with different lifetimes:
 *
 *   the place     backdrop, level, exits, sceneId, weather, mood, drawing      stays until the Director changes it
 *   the cast      entities, heroId                                             stays; lines (say) last one step
 *   the sheet     sheet { inv, stats, points }, battle                         stays
 *   one step      STEP fields: tracks, burst, sfx, card, travel, award, floats  belong to the step that made them
 *   the telling   narration, cam, steps (the earlier steps of a Director turn)
 *   for the Player  choices, ask                                               what the Director wants next turn
 *   by the Player   PLAYER fields: action, target, point, order, use, answer, verb, exit, felt, plus roll
 *                                                                              what the Player did; shown to the
 *                                                                              Director, never sent back
 */

/** A level is a grid of tiles over the backdrop: LEVEL_W x LEVEL_H cells. */
export const LEVEL_W = 16,
  LEVEL_H = 12;
export const HERO_ASSET = 'p:hero';
export const MAX_ENTITIES = 80;

/** Belongs to the step that made it: gone when the next step starts. */
export function stepFields() {
  return { tracks: [], burst: '', sfx: '', card: '', travel: '', award: null, floats: [] };
}
/** What the Player did on their turn (the die they rolled is `roll`, kept separately because either side can roll). */
export function playerFields() {
  return { action: '', target: null, point: null, order: [], use: null, answer: null, verb: '', exit: null, felt: '', reacted: [], tripped: '' };
}

/** A character or thing on the stage. x and y are fractions of the stage (0..1), y at its feet. */
export function newEntity(asset, props = {}) {
  return {
    id: '',
    asset,
    x: 0.5,
    y: 0.78,
    scale: 1,
    flip: false,
    rot: 0,
    say: '',
    fx: '',
    emote: '',
    solid: false,
    active: null,
    tie: null,
    hp: null,
    maxHp: null,
    once: '',
    temp: false,
    layer: 0,
    view: '', // which way a thing is seen: '' as drawn, 'side' from the other side
    used: false,
    near: false,
    glow: '', // a light source (see LIGHTS in options.js): it shines where the thing stands // a trap: if the hero walks close, "something happened" and the turn goes to the Director // shown as it looks after someone used it (an open door, a lit lamp)
    feel: '', // what a paper-doll character feels (see FEELS): it shows on the face
    pose: null, // a paper-doll character's joints: [head, left arm, right arm, left leg, right leg] in degrees
    ...props,
  };
}
export function newScene() {
  return {
    backdrop: 'b:room',
    mood: 'm:none',
    weather: '',
    dark: 0, // how dark the place is, 0 (lit) to 3 (pitch black): light sources cut through it
    drawing: [],
    level: null,
    exits: [],
    sceneId: '',
    entities: [newEntity(HERO_ASSET, { id: 'hero' })],
    heroId: 'hero',
    sheet: { inv: [], stats: [], points: 0 },
    battle: null,
    ...stepFields(),
    narration: '',
    cam: null,
    steps: [],
    choices: [],
    ask: null,
    ...playerFields(),
    roll: null,
  };
}
/** Fill in whatever an older or partial scene lacks, so the rest of the code never has to check. */
export function normScene(sc) {
  if (!sc) return sc;
  const base = newScene();
  for (const k of Object.keys(base)) if (sc[k] === undefined || (sc[k] === null && Array.isArray(base[k]))) sc[k] = k === 'entities' ? [] : base[k];
  for (const k of ['sceneId', 'travel', 'verb', 'weather', 'burst', 'sfx', 'card', 'narration', 'action']) sc[k] ||= '';
  sc.sheet.inv ||= [];
  sc.sheet.stats ||= [];
  sc.sheet.points ??= 0;
  sc.entities = sc.entities.map((e) => {
    const full = newEntity(e.asset, e);
    full.solid = !!full.solid;
    full.temp = !!full.temp;
    full.rot ||= 0;
    full.layer ||= 0;
    if (full.hp === undefined) full.hp = null;
    if (full.maxHp === undefined) full.maxHp = null;
    return full;
  });
  for (const f of sc.steps) normScene(f);
  return sc;
}
export function heroOf(scene) {
  return scene.entities.find((e) => e.id === scene.heroId);
}

/** The level cell under a point of the stage. */
export function cellAt(x, y) {
  return Math.min(LEVEL_H - 1, Math.floor(y * LEVEL_H)) * LEVEL_W + Math.min(LEVEL_W - 1, Math.floor(x * LEVEL_W));
}
/** How wide each library sprite is, in doll pixels (asset id -> width): filled from public/px/index.json by the
 * browser and by the server, so both agree on how much floor a bed takes up. */
export const SPRITE_WIDTH = new Map();
/** May the hero stand here? Where a level exists only floor tiles will do; solid things block everywhere. */
export function walkable(scene, x, y) {
  if (scene.level) {
    const t = scene.level.pal[parseInt(scene.level.cells[cellAt(x, y)], 36) - 1];
    if (!t || t.k !== 'f') return false;
  }
  for (const e of scene.entities) {
    if (!e.solid || e.id === scene.heroId) continue;
    const half = ((SPRITE_WIDTH.get(e.asset) || 16) / 16) * 0.031 + 0.012; // half its width (a tile is 1/16 of the stage) and a little room
    if (Math.hypot((x - e.x) / (half * e.scale), ((y - e.y + 0.02 * e.scale) * 0.75) / (0.04 * e.scale)) < 1) return false;
  }
  return true;
}
/** Where to put something new: the freest spot, not on top of someone. `top` is how far up the stage it may land
 * (a backdrop has its ground in the lower part; a tile level can be used all over). */
export function freeSpot(scene, top = 0.3) {
  const onFloor = (x, y) => !scene.level || (scene.level.pal[parseInt(scene.level.cells[cellAt(x, y)], 36) - 1] || {}).k === 'f';
  let best = null;
  for (let i = 0; i < 60; i++) {
    const x = 0.1 + Math.random() * 0.8,
      y = top + Math.random() * (0.9 - top);
    if (!onFloor(x, y) && i < 50) continue; // in a room, things stand on the floor
    const gap = Math.min(9, ...scene.entities.map((o) => Math.hypot(o.x - x, (o.y - y) * 0.75)));
    if (!best || gap > best.gap) best = { x, y, gap };
  }
  return { x: best.x, y: best.y };
}
