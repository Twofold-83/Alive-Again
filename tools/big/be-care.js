/*
 * Creatures of four settings — the hospital ward at night, the washroom, the basement and the attic — at
 * paper-doll scale. Each has its main picture (as it lurks) and a roused one (views.used).
 *
 * Every creature is one function fn(c, r): r is 0 for the main picture and 1 for the roused one. It draws in its
 * own coordinates (the roused picture may go above row 0 and outside the main picture's width); the canvas is cut
 * to fit what was drawn. The sizes written after the name are only the intended ones.
 * The drawing is in tools/big/_be-care-<setting>.js, the helpers in tools/big/_be-care-kit.js.
 */
module.exports = (kit) => {
  const H = require('./_be-care-kit.js')(kit);
  const out = {};
  /* The size of a picture is taken from what fn draws: its bounding box and a pixel all round for the outline. */
  const measure = (fn, r) => {
    const c = kit.canvas(192, 192);
    fn(H.at(c, 64, 64), r);
    let x0 = 1e9,
      y0 = 1e9,
      x1 = -1,
      y1 = -1;
    for (let y = 0; y < 192; y++)
      for (let x = 0; x < 192; x++)
        if (c.px[y * 192 + x]) {
          x0 = Math.min(x0, x);
          x1 = Math.max(x1, x);
          y0 = Math.min(y0, y);
          y1 = Math.max(y1, y);
        }
    return { w: x1 - x0 + 3, h: y1 - y0 + 3, draw: (cv) => fn(H.at(cv, 65 - x0, 65 - y0), r) };
  };
  const setting = (prefix, cat, catLabel) => (slug, name, size, fn, big, more) => {
    if (out[prefix + slug]) throw new Error(prefix + slug + ' is drawn twice in be-care');
    out[prefix + slug] = { cat, catLabel, group: 'char', name, ...measure(fn, 0), views: { used: measure(fn, 1) }, ...more };
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
