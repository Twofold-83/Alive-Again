/*
 * Creatures of the city: the street at night, the rough side of town, the lab and the server room, and the
 * school after hours. Each one is drawn by a single function fn(g, R) — g a view of the canvas (see
 * _be-city-kit.js), R false for the main picture and true for the roused one (`views.used`), which may sit on a
 * larger canvas: { u: [w, h, dx, dy] } puts the main picture's coordinates at dx, dy of it (dy by default so
 * that both stand on the same floor).
 */
module.exports = (kit) => {
  const T = require('./_be-city-kit.js')(kit);
  const out = {};
  const mk = (cat, catLabel) => (slug, name, w, h, fn, o = {}) => {
    if (out[slug]) throw new Error(slug + ' is drawn twice in be-city');
    const [uw = w, uh = h, dx = 0, dy = uh - h] = o.u || [];
    const flags = {};
    if (o.shade === false) flags.shade = false;
    if (o.outline === false) flags.outline = false;
    out[slug] = {
      cat,
      catLabel,
      group: 'char',
      name,
      w,
      h,
      ...flags,
      draw: (c) => fn(T.view(c), false),
      views: { used: { w: uw, h: uh, ...flags, draw: (c) => fn(T.view(c).at(dx, dy), true) } },
    };
  };
  require('./_be-city-street.js')(kit, T, mk('be-street', 'Street creatures'));
  for (const [f, cat, label] of [
    ['urban', 'be-urban', 'Urban creatures'],
    ['electronics', 'be-electronics', 'Electronics creatures'],
    ['school', 'be-school', 'School creatures'],
  ]) {
    let m = null;
    try {
      m = require.resolve('./_be-city-' + f + '.js');
    } catch (e) {
      m = null; // that setting is not drawn yet
    }
    if (m) require(m)(kit, T, mk(cat, label));
  }
  return out;
};
