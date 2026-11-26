/*
 * Creatures of four settings at paper-doll scale: the wild places (forest, marsh and moor), the apocalypse, horror
 * and hell. Every creature has two pictures: as it lurks, and roused (views.used).
 * The drawing surface and the body parts are in _be-wild-kit.js, the creatures in _be-wild-<setting>.js.
 */
module.exports = (kit) => {
  const out = {};
  const mine = require('./_be-wild-kit.js')(kit);
  const T = { ...kit, ...mine };
  const sets = [
    ['wilds', 'be-wilds', 'Wild places creatures'],
    ['apocalypse', 'be-apocalypse', 'Apocalypse creatures'],
    ['horror', 'be-horror', 'Horror creatures'],
    ['hell', 'be-hell', 'Hell creatures'],
  ];
  for (const [id, cat, label] of sets) {
    let fn;
    try {
      fn = require(`./_be-wild-${id}.js`);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && String(e.message).includes(`_be-wild-${id}.js`)) continue;
      throw e;
    }
    fn({ ...T, mk: mine.maker(out, id + '-', cat, label) });
  }
  return out;
};
