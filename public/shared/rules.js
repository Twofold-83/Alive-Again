/* The rules of a story, for browser and server: which kind it is, which layers are on, how the Player takes part.
 *   rules = { type, modules: { inventory, stats, dice, points }, player }
 * The kind of story is chosen once, when it is created. Layers and the Player's mode can change at any time. */

/** Layers a story can switch on. */
export const LAYERS = [
  { id: 'inventory', label: 'Inventory', hint: 'The Player can carry things. You decide what they get.' },
  { id: 'stats', label: 'Stats', hint: 'Health, gold or anything else you want to keep count of.' },
  { id: 'dice', label: 'Dice', hint: 'Either of you can roll a die with a turn.' },
  { id: 'points', label: '* Points', hint: 'You award points for whatever you like.' },
];

/** Kinds of story. `modules` are the layers a kind starts with. */
export const STORY_TYPES = [
  { id: 'free', label: 'Free play', hint: 'Just the stage and your imagination.', modules: {} },
  {
    id: 'adventure',
    label: 'Adventure',
    hint: 'Inventory, stats and dice; levels, maps, active objects and battles.',
    modules: { inventory: true, stats: true, dice: true },
  },
  { id: 'rpg', label: 'Dungeon', hint: 'A hero with a sword against the Overlord’s castle. It has its own rules and screen.', modules: {} },
];

/** How the Player takes part (set by the Director). With free or limited will the hero may walk once per turn. */
export const PLAYER_MODES = [
  { id: 'free', label: 'Free will', hint: 'The Player walks their hero (once per turn), speaks, and types what they do.' },
  { id: 'limited', label: 'Limited will', hint: 'The Player must pick one of the options you offer each turn. They can still walk and speak.' },
  { id: 'tell', label: 'Narration', hint: 'The Player only writes what they want to do. Nothing moves until you stage it.' },
];

/** Whatever a client sends becomes a complete, valid set of rules. */
export function cleanRules(r) {
  const kind = STORY_TYPES.find((t) => t.id === (r && r.type)) || STORY_TYPES[0];
  const m = (r && r.modules) || kind.modules;
  return {
    type: kind.id,
    modules: { inventory: !!m.inventory, stats: !!m.stats, dice: !!m.dice, points: !!m.points },
    player: r && PLAYER_MODES.some((p) => p.id === r.player) ? r.player : 'free',
  };
}
