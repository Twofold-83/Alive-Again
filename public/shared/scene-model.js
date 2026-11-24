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
 *   by the Player   PLAYER fields, plus roll: what the Player did; shown to the Director, never sent back
 *       action    what the Player wrote, or which of the Director's options they chose
 *       point     an action aimed at the stage: { verb, id } at a thing or { verb, x, y } at a spot ("Open old chest")
 *       use, target   an item from the inventory, and the thing it is used on (target alone: the hero reaches for it)
 *       answer    the reply to what the Director asked      exit      the way out the hero heads for
 *       reacted   what the Player did to clickable things that answered at once ([{ id, verb }])
 *       tripped   the trap the hero walked into             felt, order   the hero's feeling; the order things were done in
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
  return { action: '', target: null, point: null, order: [], use: null, answer: null, exit: null, felt: '', reacted: [], tripped: '' };
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
    active: null, // a thing the Player can click: { verbs: [...], re: { verb: { text, used } }, far } — what it answers to, and how; far: from anywhere
    tie: null,
    hp: null,
    maxHp: null,
    once: '',
    temp: false,
    layer: 0,
    view: '', // which way a thing is seen: '' as drawn, 'side' from the other side
    used: false, // shown as it looks after someone used it (an open door, a lit lamp)
    near: false, // a trap: if the hero walks close, "something happened" and the turn goes to the Director
    base: null, // where it stands, if not at its own feet: { dy, d } — dy moves the base line (stage fraction), d is its depth in tiles
    name: '', // what it is called, once the Director has named it; shown to the Player. Unnamed, it is just "this"
    glow: '', // a light source (see LIGHTS in options.js): it shines where the thing stands
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
  for (const k of ['sceneId', 'travel', 'weather', 'burst', 'sfx', 'card', 'narration', 'action']) sc[k] ||= '';
  /* older stories told an aimed action in two other ways: a verb with a target, and a written action with a bare point */
  if (sc.verb && sc.target) Object.assign(sc, { point: { verb: sc.verb, id: sc.target }, target: null });
  else if (sc.point && !sc.point.verb) Object.assign(sc, { point: { ...sc.point, verb: sc.action || 'Look at' }, action: '' });
  delete sc.verb;
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
    if (full.active && full.active.name !== undefined) {
      full.name ||= full.active.name; // older scenes kept a clickable thing's name with its actions
      delete full.active.name;
    }
    return full;
  });
  for (const f of sc.steps) normScene(f);
  return sc;
}
/** What a thing is called: the name the Director gave it. Until then it has none, and everybody calls it "this". */
export const nameOf = (e) => (e && e.name) || '';
export const called = (e) => nameOf(e) || 'this';
/** The Player's aimed action in words: "Open old chest", "Push here". `label` says what to call a thing nobody has named. */
export function pointText(scene, label = () => 'this') {
  const pt = scene.point,
    e = pt && pt.id && scene.entities.find((x) => x.id === pt.id);
  return pt ? `${pt.verb} ${e ? nameOf(e) || label(e) : 'here'}` : '';
}

/** The level cell under a point of the stage. */
export function cellAt(x, y) {
  return Math.min(LEVEL_H - 1, Math.floor(y * LEVEL_H)) * LEVEL_W + Math.min(LEVEL_W - 1, Math.floor(x * LEVEL_W));
}
/** How wide each library sprite is, in doll pixels (asset id -> width): filled from public/px/index.json by the
 * browser and by the server, so both agree on how much floor a bed takes up. */
export const SPRITE_WIDTH = new Map();
/**
 * The base of a thing: the strip of floor it stands on. It decides two things — what is drawn in front of what
 * (a thing whose base line is lower on the stage is nearer, so it is drawn later), and, for a solid thing, where
 * nobody can walk. It is as wide as the picture (the side view of a thing has its own width) and by default half a
 * tile deep, right behind the thing's feet. The Director can move the line (a candle on a table stands on the
 * table's base) and make it deeper (a bed seen from the front lies two tiles deep).
 * Returns { x0, x1, y0, y1, y } in stage fractions; y is the base line.
 */
export function baseOf(e) {
  const px = SPRITE_WIDTH.get(e.asset + (e.view === 'side' ? '|side' : '')) || SPRITE_WIDTH.get(e.asset) || 16,
    w = (px / 16 / LEVEL_W) * (e.scale || 1),
    d = (((e.base && e.base.d) || 0.5) / LEVEL_H) * (e.scale || 1),
    y = e.y + ((e.base && e.base.dy) || 0);
  return { x0: e.x - w / 2, x1: e.x + w / 2, y0: y - d, y1: y, y };
}
/**
 * Can the hero reach this thing from where they stand? A clickable thing answers only to someone close by: about
 * a tile and a half from the floor it stands on — unless the Director said it can be used from anywhere.
 */
export function withinReach(scene, e) {
  if (e.active && e.active.far) return true;
  const hero = scene.entities.find((x) => x.id === scene.heroId),
    holder = e.tie && scene.entities.find((x) => x.id === e.tie.to);
  if (!hero || holder === hero) return true; // what the hero holds is always at hand
  const b = baseOf(holder ? { ...e, x: holder.x, y: holder.y, base: null } : e),
    dx = Math.max(b.x0 - hero.x, 0, hero.x - b.x1),
    dy = Math.max(b.y0 - hero.y, 0, hero.y - b.y1);
  return (dx * LEVEL_W) ** 2 + (dy * LEVEL_H) ** 2 <= REACH * REACH;
}
export const REACH = 1.6; // in tiles

/** May the hero stand here? Where a level exists only floor tiles will do; the base of a solid thing blocks. */
export function walkable(scene, x, y) {
  if (scene.level) {
    const t = scene.level.pal[parseInt(scene.level.cells[cellAt(x, y)], 36) - 1];
    if (!t || t.k !== 'f') return false;
  }
  for (const e of scene.entities) {
    if (!e.solid || e.id === scene.heroId) continue;
    const b = baseOf(e);
    if (x > b.x0 - 0.014 && x < b.x1 + 0.014 && y > b.y0 - 0.008 && y < b.y1 + 0.012) return false; // a little room for the hero's own width
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
