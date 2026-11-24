/*
 * People of the old country and the wild: the old village, lonely farmland, castle and town of the middle ages,
 * the dungeon adventure, cathedral and crypt, and the wild places. Six themes, each in a file of its own
 * (_country-<theme>.js), each with heads, torsos, arms and legs that belong together.
 * Parts are only ever ADDED AT THE END of a theme's lists... and themes at the end of THEMES: ids are places.
 */
const THEMES = ['village', 'rural', 'medieval', 'castle', 'gothic', 'wilds'];
module.exports = (kit) => {
  const h = require('./_country-kit.js')(kit);
  const out = { heads: [], torsos: [], arms: [], legs: [] };
  /* every theme has a fixed number of parts, so a part added to one theme later cannot renumber the next theme:
   * a theme that grows must first be given room at the very end (see the note in the report). */
  for (const theme of THEMES) {
    let def;
    try {
      def = require(`./_country-${theme}.js`)(kit, h);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && String(e.message).includes(`_country-${theme}`)) continue;
      throw e;
    }
    for (const k of Object.keys(out)) for (const p of def[k] || []) out[k].push({ ...p, theme });
  }
  return out;
};
