/* Rooms in one click. A room is a level (see scene-model.js) laid out from a theme and a shape:
 * a strip of dark wall tops, a back wall two tiles high with a few details on it, and a floor to walk on.
 * Used by Build scene ("Room"), by the Map ("Room next door"), by the ready-made places and for the very
 * first scene of a new story. Plain data and one function, so the server can use it too. */
import { LEVEL_W, LEVEL_H } from './scene-model.js';

/** top: the dark upper side of a wall; wall: its face; deco: details for the back wall; floor / more: the ground and its variations. */
export const ROOM_THEMES = [
  {
    id: 'oldhouse',
    name: 'Old house',
    top: 'house-top',
    wall: 'house-wall-wood',
    deco: ['house-wall-window', 'house-wall-painting', 'house-wall-candle', 'house-wall-clock'],
    floor: 'wood-floor-h',
    more: [],
    mood: 'm:eerie',
  },
  {
    id: 'parlour',
    name: 'Parlour',
    top: 'house-top',
    wall: 'house-wall-green',
    deco: ['house-wall-fireplace', 'house-wall-painting', 'house-wall-mirror', 'house-wall-bookshelf'],
    floor: 'wood-floor-parquet',
    more: [],
    mood: 'm:mystery',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    top: 'house-top',
    wall: 'house-wall-plaster',
    deco: ['house-wall-shelf', 'house-wall-window', 'house-wall-clock'],
    floor: 'kitchen-floor',
    more: [],
    mood: 'm:sneaky',
  },
  {
    id: 'hall',
    name: 'Great hall',
    top: 'house-top',
    wall: 'house-wall-brick',
    deco: ['house-wall-candle', 'house-wall-painting', 'house-wall-candle'],
    floor: 'marble-floor',
    more: ['marble-floor-diamond'],
    mood: 'm:dungeon',
  },
  {
    id: 'cellar',
    name: 'Cellar',
    top: 'dungeon-top',
    wall: 'dungeon-wall',
    deco: ['dungeon-wall-torch', 'dungeon-wall-chains', 'dungeon-wall-mossy', 'dungeon-wall-cracked'],
    floor: 'dungeon-flagstone',
    more: ['dungeon-floor-cracked', 'dungeon-floor-mossy', 'dungeon-floor-puddle'],
    mood: 'm:dungeon',
  },
  {
    id: 'crypt',
    name: 'Crypt',
    top: 'dungeon-top',
    wall: 'dungeon-wall-mossy',
    deco: ['dungeon-wall-skull', 'dungeon-wall-torch', 'dungeon-wall-bars', 'dungeon-wall-skull'],
    floor: 'dungeon-floor-slab',
    more: ['dungeon-floor-bones', 'dungeon-floor-cracked', 'dungeon-floor-rune'],
    mood: 'm:spooky',
  },
  {
    id: 'tomb',
    name: 'Desert tomb',
    top: 'sandstone-top',
    wall: 'sandstone-wall',
    deco: ['sandstone-wall-glyphs', 'sandstone-wall-torch', 'sandstone-wall-glyphs'],
    floor: 'sandstone-floor',
    more: ['sandstone-floor-glyph'],
    mood: 'm:mystery',
  },
  {
    id: 'cave',
    name: 'Cave',
    top: 'void',
    wall: 'cave-wall',
    deco: ['cave-wall-crystal-purple', 'cave-wall-beams', 'cave-wall-iron'],
    floor: 'cave-floor',
    more: ['cave-floor-pebbles', 'cave-floor-cracked', 'cave-floor-mushrooms', 'cave-floor-moss'],
    mood: 'm:eerie',
  },
  {
    id: 'garden',
    name: 'Garden',
    outdoor: true,
    top: 'forest',
    wall: 'forest',
    deco: [],
    floor: 'grass-dark',
    more: ['grass-tufts', 'grass-leaves', 'grass-clover', 'grass-mushrooms'],
    mood: 'm:calm',
  },
  {
    id: 'graveyard',
    name: 'Graveyard',
    outdoor: true,
    top: 'forest',
    wall: 'forest',
    deco: [],
    floor: 'grass-dry',
    more: ['dirt-plain', 'grass-leaves', 'dirt-pebbles', 'grass-stones'],
    mood: 'm:spooky',
  },
  {
    id: 'snow',
    name: 'Snowfield',
    outdoor: true,
    top: 'snow-pines',
    wall: 'snow-pines',
    deco: [],
    floor: 'snow-plain',
    more: ['snow-drifts', 'snow-tracks', 'snow-rocks'],
    mood: 'm:sad',
  },
  {
    id: 'street',
    name: 'Street',
    outdoor: true,
    top: 'tile-stone-brick',
    wall: 'tile-stone-brick',
    deco: ['tile-window', 'tile-wall-torch', 'tile-window'],
    floor: 'cobble-brown',
    more: ['cobble-mossy', 'paving'],
    mood: 'm:mystery',
  },
];
/** How much of the stage the room fills. [left, top, right, bottom] of the floor, in cells. */
export const ROOM_SHAPES = [
  { id: 'room', name: 'Whole stage', floor: [1, 4, 14, 10] },
  { id: 'small', name: 'Small room', floor: [4, 5, 11, 9] },
  { id: 'corridor', name: 'Corridor', floor: [0, 6, 15, 8] },
  { id: 'tall', name: 'Narrow room', floor: [5, 4, 10, 10] },
];
export const themeOf = (id) => ROOM_THEMES.find((t) => t.id === id) || ROOM_THEMES[0];

/** Build the level for a room. Outside the room everything is left empty (black). */
export function buildRoom(themeId = 'oldhouse', shapeId = 'room', random = Math.random) {
  const t = themeOf(themeId),
    shape = ROOM_SHAPES.find((s) => s.id === shapeId) || ROOM_SHAPES[0];
  const [x0, y0, x1, y1] = shape.floor;
  const pal = [],
    index = (a, k) => {
      let i = pal.findIndex((p) => p.a === 'p:' + a);
      if (i < 0) {
        pal.push({ a: 'p:' + a, k });
        i = pal.length - 1;
      }
      return (i + 1).toString(36);
    };
  const cells = new Array(LEVEL_W * LEVEL_H).fill('0'),
    put = (x, y, ch) => {
      if (x >= 0 && y >= 0 && x < LEVEL_W && y < LEVEL_H) cells[y * LEVEL_W + x] = ch;
    };
  const wallRows = t.outdoor ? 1 : 2; // how high the back wall stands
  for (let y = y0 - wallRows - 1; y <= y1 + 1; y++)
    for (let x = x0 - 1; x <= x1 + 1; x++) {
      const inside = x >= x0 && x <= x1 && y >= y0 && y <= y1;
      if (inside) put(x, y, index(t.more.length && random() < 0.16 ? t.more[Math.floor(random() * t.more.length)] : t.floor, 'f'));
      else if (y >= y0 - wallRows && y < y0 && x >= x0 && x <= x1) put(x, y, index(t.wall, 'w'));
      else put(x, y, index(t.top, 'w'));
    }
  /* a few details along the back wall, evenly spread */
  const width = x1 - x0 + 1,
    n = Math.min(t.deco.length, Math.max(1, Math.floor(width / 4)));
  for (let i = 0; i < n && t.deco.length; i++) put(x0 + Math.round(((i + 0.5) * width) / n - 0.5), y0 - 1, index(t.deco[i % t.deco.length], 'w'));
  return { pal, cells: cells.join('') };
}
/** Where things may stand in a room of this shape, as fractions of the stage: { x0, y0, x1, y1 }. */
export function roomArea(shapeId = 'room') {
  const [x0, y0, x1, y1] = (ROOM_SHAPES.find((s) => s.id === shapeId) || ROOM_SHAPES[0]).floor;
  return { x0: (x0 + 0.5) / LEVEL_W, y0: (y0 + 0.9) / LEVEL_H, x1: (x1 + 0.5) / LEVEL_W, y1: (y1 + 0.9) / LEVEL_H };
}
/** A new scene that is a room: the level, black beyond the walls, the theme's music, the hero in the middle of the floor. */
export function roomScene(base, themeId = 'oldhouse', shapeId = 'room') {
  const area = roomArea(shapeId),
    hero = base.entities.find((e) => e.id === base.heroId);
  if (hero) {
    hero.x = (area.x0 + area.x1) / 2;
    hero.y = area.y0 + (area.y1 - area.y0) * 0.92;
  }
  return Object.assign(base, { backdrop: 'b:black', level: buildRoom(themeId, shapeId), mood: themeOf(themeId).mood, weather: '' });
}
