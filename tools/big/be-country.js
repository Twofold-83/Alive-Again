/*
 * Creatures of the country settings at paper-doll scale: the cottage and its kitchen, the garden gone wrong, the
 * old village and the lonely farmland. Every creature has its main picture and a roused one (views.used).
 * The drawing is in the helper files _be-country-<setting>.js; the shared helpers in _be-country-kit.js.
 */
module.exports = (kit) => {
  const k = require('./_be-country-kit.js')(kit);
  const out = {};
  /**
   * be(slug, name, w, h, draw, u): draw(g, r) with r 0 (main) or 1 (roused). u: { w, h, x, y } gives the roused
   * picture a bigger canvas; the creature is put at x, y on it (by default centred, standing on the bottom row).
   */
  const maker = (cat, catLabel) => (slug, name, w, h, draw, u = {}) => {
    if (out[slug]) throw new Error(slug + ' twice');
    const uw = u.w || w,
      uh = u.h || h,
      ux = u.x == null ? (uw - w) >> 1 : u.x,
      uy = u.y == null ? uh - h : u.y;
    out[slug] = {
      cat,
      catLabel,
      group: 'char',
      name,
      w,
      h,
      draw: (c) => draw(k.G(c), 0),
      views: { used: { w: uw, h: uh, draw: (c) => draw(k.G(c).at(ux, uy), 1) } },
    };
  };
  require('./_be-country-cottage.js')(k, maker('be-cottage', 'Cottage creatures'));
  require('./_be-country-garden.js')(k, maker('be-garden', 'Garden creatures'));
  require('./_be-country-village.js')(k, maker('be-village', 'Village creatures'));
  require('./_be-country-rural.js')(k, maker('be-rural', 'Rural creatures'));
  return out;
};
