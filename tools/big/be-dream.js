/*
 * Creatures of four settings — the dream world, the surreal, the weird and the nightmare — at paper-doll scale.
 * Each has its main picture and a roused one (views.used): one draw function paints both (see _be-dream-kit.js).
 * The creatures themselves are in _be-dream-dream.js, _be-dream-surreal.js, _be-dream-weird.js and
 * _be-dream-nightmare.js.
 */
module.exports = (kit) => {
  const H = require('./_be-dream-kit.js')(kit);
  const out = {};
  const add = (slug, cat, catLabel, name, def) => {
    if (out[slug]) throw new Error(slug + ' is drawn twice in be-dream');
    out[slug] = { cat, catLabel, group: 'char', name, ...def };
  };
  const sets = [
    ['dream', 'dream-', 'be-dream', 'Dream world creatures'],
    ['surreal', 'surreal-', 'be-surreal', 'Surreal creatures'],
    ['weird', 'weird-', 'be-weird', 'Weird creatures'],
    ['nightmare', 'nightmare-', 'be-nightmare', 'Nightmare creatures'],
  ];
  for (const [file, prefix, cat, label] of sets) {
    let part;
    try {
      part = require(`./_be-dream-${file}.js`);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && e.message.includes(`_be-dream-${file}.js`)) continue; // not drawn yet
      throw e;
    }
    part(kit, H, H.maker(add, prefix, cat, label));
  }
  return out;
};
