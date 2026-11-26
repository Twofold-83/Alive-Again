/*
 * Creatures of the country settings at paper-doll scale: the cottage and its kitchen, the garden gone wrong, the
 * old village and the lonely farmland. Every creature has its main picture and a roused one (views.used).
 * The drawing is in the helper files _be-country-<setting>.js; the shared helpers in _be-country-kit.js.
 */
module.exports = (kit) => {
  const k = require('./_be-country-kit.js')(kit);
  const out = {};
  /**
   * be(slug, name, draw, o): draw(g, r) with r 0 (main picture) or 1 (roused), in the creature's own coordinates.
   * The canvas of each picture is fitted to what was drawn, with one free pixel all round for the outline.
   * o.pad: empty rows under a creature that floats (o.padUsed for the roused picture, by default the same).
   */
  const fit = (slug, draw, r, pad) => {
    const big = kit.canvas(160, 160);
    draw(k.G(big).at(48, 48), r);
    let x0 = 999, x1 = -1, y0 = 999, y1 = -1;
    for (let y = 0; y < 160; y++) for (let x = 0; x < 160; x++) if (big.px[y * 160 + x]) (x0 = Math.min(x0, x)), (x1 = Math.max(x1, x)), (y0 = Math.min(y0, y)), (y1 = Math.max(y1, y));
    if (x1 < 0) throw new Error(slug + ' is empty');
    const w = x1 - x0 + 3,
      h = y1 - y0 + 3 + pad;
    if (w > 64 || h > 64) throw new Error(`${slug}${r ? ' (roused)' : ''} is ${w} x ${h}: larger than 64 x 64`);
    return { w, h, draw: (c) => draw(k.G(c).at(49 - x0, 49 - y0), r) };
  };
  const maker = (cat, catLabel) => (slug, name, draw, o = {}) => {
    if (out[slug]) throw new Error(slug + ' twice');
    out[slug] = { cat, catLabel, group: 'char', name, ...fit(slug, draw, 0, o.pad || 0), views: { used: fit(slug, draw, 1, o.padUsed == null ? o.pad || 0 : o.padUsed) } };
  };
  require('./_be-country-cottage.js')(k, maker('be-cottage', 'Cottage creatures'));
  require('./_be-country-garden.js')(k, maker('be-garden', 'Garden creatures'));
  require('./_be-country-village.js')(k, maker('be-village', 'Village creatures'));
  require('./_be-country-rural.js')(k, maker('be-rural', 'Rural creatures'));
  return out;
};
