/*
 * Creatures of four settings — the hospital ward at night, the washroom, the basement and the attic — at
 * paper-doll scale. Each has its main picture (as it lurks) and a roused one (views.used).
 *
 * Every creature is one function fn(c, r): r is 0 for the main picture and 1 for the roused one. When the roused
 * picture needs a larger canvas, [w2, h2, dx] is given: the creature keeps standing on the bottom row, moved dx to
 * the right (by default centred), and fn may then draw above row 0 and outside 0..w-1.
 * The drawing is in tools/big/_be-care-<setting>.js, the helpers in tools/big/_be-care-kit.js.
 */
module.exports = (kit) => {
  const H = require('./_be-care-kit.js')(kit);
  const out = {};
  const setting = (prefix, cat, catLabel) => (slug, name, size, fn, big, more) => {
    const [w, h] = size;
    const used = big
      ? { w: big[0], h: big[1], draw: (c) => fn(H.at(c, big[2] == null ? (big[0] - w) >> 1 : big[2], big[1] - h), 1) }
      : { w, h, draw: (c) => fn(c, 1) };
    if (out[prefix + slug]) throw new Error(prefix + slug + ' is drawn twice in be-care');
    out[prefix + slug] = { cat, catLabel, group: 'char', name, w, h, draw: (c) => fn(c, 0), views: { used }, ...more };
  };
  for (const [file, prefix, cat, label] of [
    ['hospital', 'hospital-', 'be-hospital', 'Hospital creatures'],
    ['toilet', 'toilet-', 'be-toilet', 'Toilet creatures'],
    ['basement', 'basement-', 'be-basement', 'Basement creatures'],
    ['attic', 'attic-', 'be-attic', 'Attic creatures'],
  ]) {
    let draw;
    try {
      draw = require('./_be-care-' + file + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_be-care-/.test(e.message)) continue; // a setting not drawn yet
      throw e;
    }
    draw(kit, H, setting(prefix, cat, label));
  }
  return out;
};
