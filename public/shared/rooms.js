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
  /* built from the room sets of the sprite library: <set>-top, <set>-wall, <set>-wall-*, <set>-floor, <set>-floor-* */
  {
    id: 'scifi',
    name: 'Space station',
    top: 'scifi-top',
    wall: 'scifi-wall',
    deco: ['scifi-wall-screen', 'scifi-wall-pipes', 'scifi-wall-vent', 'scifi-wall-light', 'scifi-wall-window', 'scifi-wall-lockers'],
    floor: 'scifi-floor',
    more: ['scifi-floor-dark', 'scifi-floor-tread', 'scifi-floor-light', 'scifi-floor-grate'],
    mood: 'm:space',
  },
  {
    id: 'rosepaper',
    name: 'Rose wallpaper',
    top: 'rosepaper-top',
    wall: 'rosepaper-wall',
    deco: [
      'rosepaper-wall-window',
      'rosepaper-wall-door',
      'rosepaper-wall-portrait',
      'rosepaper-wall-lamp',
      'rosepaper-wall-stain',
      'rosepaper-wall-peeling',
    ],
    floor: 'rosepaper-floor',
    more: ['rosepaper-floor-worn', 'rosepaper-floor-dark', 'rosepaper-floor-rug', 'rosepaper-floor-stained'],
    mood: 'm:musicbox',
  },
  {
    id: 'stripepaper',
    name: 'Striped wallpaper',
    top: 'stripepaper-top',
    wall: 'stripepaper-wall',
    deco: [
      'stripepaper-wall-window',
      'stripepaper-wall-window-broken',
      'stripepaper-wall-door',
      'stripepaper-wall-picture',
      'stripepaper-wall-clock',
      'stripepaper-wall-mirror',
    ],
    floor: 'stripepaper-floor',
    more: ['stripepaper-floor-worn', 'stripepaper-floor-dusty', 'stripepaper-floor-rug', 'stripepaper-floor-cracked'],
    mood: 'm:mystery',
  },
  {
    id: 'damask',
    name: 'Blue damask',
    top: 'damask-top',
    wall: 'damask-wall',
    deco: [
      'damask-wall-window-night',
      'damask-wall-window-face',
      'damask-wall-door',
      'damask-wall-portrait-scratched',
      'damask-wall-mirror-cracked',
      'damask-wall-lamp',
    ],
    floor: 'damask-floor',
    more: ['damask-floor-dark', 'damask-floor-rug', 'damask-floor-bloody', 'damask-floor-dusty'],
    mood: 'm:lament',
  },
  {
    id: 'panel',
    name: 'Dark panelling',
    top: 'panel-top',
    wall: 'panel-wall',
    deco: ['panel-wall-window', 'panel-wall-door', 'panel-wall-portrait', 'panel-wall-candle', 'panel-wall-trophy', 'panel-wall-secret'],
    floor: 'panel-floor',
    more: ['panel-floor-worn', 'panel-floor-dark', 'panel-floor-rug', 'panel-floor-hatch'],
    mood: 'm:dread',
  },
  {
    id: 'crackplaster',
    name: 'Cracked plaster',
    top: 'crackplaster-top',
    wall: 'crackplaster-wall',
    deco: [
      'crackplaster-wall-window-broken',
      'crackplaster-wall-window-boarded',
      'crackplaster-wall-door',
      'crackplaster-wall-crack',
      'crackplaster-wall-stain',
      'crackplaster-wall-lath',
    ],
    floor: 'crackplaster-floor',
    more: ['crackplaster-floor-dusty', 'crackplaster-floor-cracked', 'crackplaster-floor-dark', 'crackplaster-floor-stained'],
    mood: 'm:eerie',
  },
  {
    id: 'nursery',
    name: 'Nursery',
    top: 'nursery-top',
    wall: 'nursery-wall',
    deco: [
      'nursery-wall-window',
      'nursery-wall-door',
      'nursery-wall-crack',
      'nursery-wall-picture',
      'nursery-wall-handprints',
      'nursery-wall-scribble',
    ],
    floor: 'nursery-floor',
    more: ['nursery-floor-worn', 'nursery-floor-rug', 'nursery-floor-dark', 'nursery-floor-blocks'],
    mood: 'm:musicbox',
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    top: 'bathroom-top',
    wall: 'bathroom-wall',
    deco: ['bathroom-wall-window', 'bathroom-wall-door', 'bathroom-wall-mirror', 'bathroom-wall-stain', 'bathroom-wall-pipe', 'bathroom-wall-towel'],
    floor: 'bathroom-floor',
    more: ['bathroom-floor-drain', 'bathroom-floor-stained', 'bathroom-floor-bloody', 'bathroom-floor-cracked'],
    mood: 'm:whisper',
  },
  {
    id: 'library',
    name: 'Library',
    top: 'library-top',
    wall: 'library-wall',
    deco: ['library-wall-window-night', 'library-wall-door', 'library-wall-gap', 'library-wall-skull', 'library-wall-ladder', 'library-wall-secret'],
    floor: 'library-floor',
    more: ['library-floor-rug', 'library-floor-dark', 'library-floor-dusty', 'library-floor-books'],
    mood: 'm:mystery',
  },
  {
    id: 'study',
    name: 'Study',
    top: 'study-top',
    wall: 'study-wall',
    deco: ['study-wall-window', 'study-wall-door', 'study-wall-portrait', 'study-wall-lamp', 'study-wall-map', 'study-wall-safe'],
    floor: 'study-floor',
    more: ['study-floor-rug', 'study-floor-dark', 'study-floor-worn', 'study-floor-papers'],
    mood: 'm:mystery',
  },
  {
    id: 'scullery',
    name: 'Scullery',
    top: 'scullery-top',
    wall: 'scullery-wall',
    deco: ['scullery-wall-window', 'scullery-wall-door', 'scullery-wall-stain', 'scullery-wall-pots', 'scullery-wall-shelf', 'scullery-wall-knives'],
    floor: 'scullery-floor',
    more: ['scullery-floor-worn', 'scullery-floor-stained', 'scullery-floor-bloody', 'scullery-floor-drain'],
    mood: 'm:sneaky',
  },
  {
    id: 'attic',
    name: 'Attic',
    top: 'attic-top',
    wall: 'attic-wall',
    deco: ['attic-wall-window-round', 'attic-wall-cobweb', 'attic-wall-hooks', 'attic-wall-bulb', 'attic-wall-gap', 'attic-wall-brace'],
    floor: 'attic-floor',
    more: ['attic-floor-dusty', 'attic-floor-hatch', 'attic-floor-dark', 'attic-floor-hole'],
    mood: 'm:whisper',
  },
  {
    id: 'cabin',
    name: 'Cabin',
    top: 'cabin-top',
    wall: 'cabin-wall',
    deco: ['cabin-wall-window', 'cabin-wall-door', 'cabin-wall-shelf', 'cabin-wall-antlers', 'cabin-wall-lantern', 'cabin-wall-rifle'],
    floor: 'cabin-floor',
    more: ['cabin-floor-worn', 'cabin-floor-rug', 'cabin-floor-hatch', 'cabin-floor-bloody'],
    mood: 'm:calm',
  },
  {
    id: 'basement',
    name: 'Basement',
    top: 'basement-top',
    wall: 'basement-wall',
    deco: [
      'basement-wall-pipe',
      'basement-wall-crack',
      'basement-wall-fusebox',
      'basement-wall-door',
      'basement-wall-window-bars',
      'basement-wall-mould',
    ],
    floor: 'basement-floor',
    more: ['basement-floor-puddle', 'basement-floor-drain', 'basement-floor-cracked', 'basement-floor-bloody'],
    mood: 'm:drone',
  },
  {
    id: 'winecellar',
    name: 'Wine cellar',
    top: 'cellar-top',
    wall: 'cellar-wall',
    deco: ['cellar-wall-crack', 'cellar-wall-candle', 'cellar-wall-door', 'cellar-wall-cobweb', 'cellar-wall-arch', 'cellar-wall-chains'],
    floor: 'cellar-floor',
    more: ['cellar-floor-puddle', 'cellar-floor-hatch', 'cellar-floor-mound', 'cellar-floor-bones'],
    mood: 'm:crypt',
  },
  {
    id: 'barn',
    name: 'Barn',
    top: 'barn-top',
    wall: 'barn-wall',
    deco: ['barn-wall-window', 'barn-wall-door', 'barn-wall-tools', 'barn-wall-lantern', 'barn-wall-harness', 'barn-wall-gap'],
    floor: 'barn-floor',
    more: ['barn-floor-dark', 'barn-floor-bloody', 'barn-floor-hatch', 'barn-floor-bare'],
    mood: 'm:eerie',
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    top: 'greenhouse-top',
    wall: 'greenhouse-wall',
    deco: [
      'greenhouse-wall-door',
      'greenhouse-wall-hooks',
      'greenhouse-wall-broken',
      'greenhouse-wall-vine',
      'greenhouse-wall-handprint',
      'greenhouse-wall-shelf',
    ],
    floor: 'greenhouse-floor',
    more: ['greenhouse-floor-cracked', 'greenhouse-floor-puddle', 'greenhouse-floor-weeds', 'greenhouse-floor-soil'],
    mood: 'm:dream',
  },
  {
    id: 'hotel',
    name: 'Hotel corridor',
    top: 'hotel-top',
    wall: 'hotel-wall',
    deco: ['hotel-wall-lamp', 'hotel-wall-picture', 'hotel-wall-stain', 'hotel-wall-door', 'hotel-wall-door-ajar', 'hotel-wall-lift'],
    floor: 'hotel-floor',
    more: ['hotel-floor-worn', 'hotel-floor-dark', 'hotel-floor-bloody', 'hotel-floor-stained'],
    mood: 'm:dread',
  },
  {
    id: 'theatre',
    name: 'Theatre',
    top: 'theatre-top',
    wall: 'theatre-wall',
    deco: ['theatre-wall-poster', 'theatre-wall-door', 'theatre-wall-gap', 'theatre-wall-masks', 'theatre-wall-rope', 'theatre-wall-lights'],
    floor: 'theatre-floor',
    more: ['theatre-floor-hatch', 'theatre-floor-dark', 'theatre-floor-mark', 'theatre-floor-spot'],
    mood: 'm:organ',
  },
  {
    id: 'chapel',
    name: 'Chapel',
    top: 'chapel-top',
    wall: 'chapel-wall',
    deco: ['chapel-wall-cross', 'chapel-wall-candle', 'chapel-wall-window', 'chapel-wall-door', 'chapel-wall-plaque', 'chapel-wall-niche'],
    floor: 'chapel-floor',
    more: ['chapel-floor-cracked', 'chapel-floor-rug', 'chapel-floor-bloody', 'chapel-floor-grave'],
    mood: 'm:organ',
  },
  {
    id: 'lab',
    name: 'Laboratory',
    top: 'lab-top',
    wall: 'lab-wall',
    deco: ['lab-wall-vent', 'lab-wall-pipe', 'lab-wall-door', 'lab-wall-screen', 'lab-wall-gauges', 'lab-wall-lever'],
    floor: 'lab-floor',
    more: ['lab-floor-bloody', 'lab-floor-hatch', 'lab-floor-plate', 'lab-floor-spill'],
    mood: 'm:drone',
  },
  {
    id: 'asylum',
    name: 'Asylum',
    top: 'asylum-top',
    wall: 'asylum-wall',
    deco: ['asylum-wall-window-bars', 'asylum-wall-stain', 'asylum-wall-door', 'asylum-wall-tally', 'asylum-wall-writing', 'asylum-wall-restraint'],
    floor: 'asylum-floor',
    more: ['asylum-floor-bloody', 'asylum-floor-stained', 'asylum-floor-drain', 'asylum-floor-cracked'],
    mood: 'm:pulse',
  },
  {
    id: 'morgue',
    name: 'Morgue',
    top: 'morgue-top',
    wall: 'morgue-wall',
    deco: ['morgue-wall-vent', 'morgue-wall-clock', 'morgue-wall-door', 'morgue-wall-drawers', 'morgue-wall-drawer-open', 'morgue-wall-hose'],
    floor: 'morgue-floor',
    more: ['morgue-floor-drain', 'morgue-floor-bloody', 'morgue-floor-cracked', 'morgue-floor-trail'],
    mood: 'm:crypt',
  },
  {
    id: 'school',
    name: 'School',
    top: 'school-top',
    wall: 'school-wall',
    deco: ['school-wall-window', 'school-wall-door', 'school-wall-clock', 'school-wall-blackboard', 'school-wall-map', 'school-wall-lockers'],
    floor: 'school-floor',
    more: ['school-floor-worn', 'school-floor-dark', 'school-floor-cracked', 'school-floor-chalk'],
    mood: 'm:lament',
  },
  {
    id: 'shop',
    name: 'Shop',
    top: 'shop-top',
    wall: 'shop-wall',
    deco: ['shop-wall-door', 'shop-wall-clock', 'shop-wall-empty', 'shop-wall-window', 'shop-wall-drawers', 'shop-wall-sign'],
    floor: 'shop-floor',
    more: ['shop-floor-worn', 'shop-floor-hatch', 'shop-floor-dusty', 'shop-floor-glass'],
    mood: 'm:town',
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
