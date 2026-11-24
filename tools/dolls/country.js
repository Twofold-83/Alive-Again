/*
 * People of the old country and the wild: the old village, lonely farmland, castle and town of the middle ages,
 * the dungeon adventure, cathedral and crypt, and the wild places. Six themes, each in a file of its own
 * (_country-<theme>.js), each with heads, torsos, arms and legs that belong together; the pictures are written
 * as rows of characters (see _country-kit.js).
 *
 * A part's id is its place in the list, and the lists here are the theme files one after the other. So NEVER add a
 * part to one of the six theme files (it would renumber every later theme): new parts go into a new file whose
 * name is added at the END of MORE below; its parts name their own `theme`.
 */
const THEMES = ['village', 'rural', 'medieval', 'castle', 'gothic', 'wilds'];
/** later additions: files _country-<name>.js, in the order they were added */
const MORE = [];
module.exports = (kit) => {
  const h = require('./_country-kit.js')(kit);
  const out = { heads: [], torsos: [], arms: [], legs: [] };
  for (const theme of THEMES) {
    const def = require(`./_country-${theme}.js`)(kit, h);
    for (const k of Object.keys(out)) for (const p of def[k] || []) out[k].push({ ...p, theme });
  }
  for (const file of MORE) {
    const def = require(`./_country-${file}.js`)(kit, h);
    for (const k of Object.keys(out)) for (const p of def[k] || []) out[k].push(p);
  }
  return out;
};
