/*
 * People of today: the family at home, the neighbours of a worn block of flats, the too-neat suburb, the street,
 * the rough side of town, the lab and the server room, and school.
 * Seven themes, drawn one by one in tools/dolls/_modern-<theme>.js with the small vocabulary of _modern-kit.js.
 * Parts are numbered by their place in the lists: only ever add at the END of a theme file's kind — and since the
 * themes follow each other in the lists, new parts for any theme go in a new file loaded after the last one.
 */
module.exports = (kit) => {
  const lists = { heads: [], torsos: [], arms: [], legs: [] };
  const my = require('./_modern-kit.js')(kit, lists);
  for (const [file, theme] of [
    ['home', 'modernhome'],
    ['apartment', 'apartment'],
    ['suburban', 'suburban'],
    ['street', 'street'],
    ['urban', 'urban'],
    ['electronics', 'electronics'],
    ['school', 'school'],
  ]) {
    my.theme(theme);
    require(`./_modern-${file}.js`)(my);
  }
  return lists;
};
