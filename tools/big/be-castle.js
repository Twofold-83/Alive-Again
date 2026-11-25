/*
 * Creatures of four settings — medieval, castle (the dungeon), gothic, graveyard — at paper-doll scale.
 * Each is drawn twice by one function fn(g, r): as it lurks (r = 0) and roused (r = 1, the `used` picture).
 * The drawing itself is in tools/big/_be-castle-<setting>.js, the helpers in _be-castle-kit.js.
 */
module.exports = (kit) => {
  const k = require('./_be-castle-kit.js')(kit);
  const out = {};
  const maker = (prefix, cat, catLabel) => (slug, name, w, h, fn, o = {}) => {
    const W = o.uw || w,
      H = o.uh || h,
      ux = o.ux == null ? (W - w) >> 1 : o.ux;
    const flags = {};
    if (o.shade === false) flags.shade = false;
    if (o.outline === false) flags.outline = false;
    out[prefix + slug] = {
      cat,
      catLabel,
      group: 'char',
      name,
      w,
      h,
      ...flags,
      draw: (c) => fn(k.pen(c, 0, 0), 0),
      views: { used: { w: W, h: H, ...flags, draw: (c) => fn(k.pen(c, ux, H - h), 1) } },
    };
  };
  require('./_be-castle-medieval.js')(k, maker('medieval-', 'be-medieval', 'Medieval creatures'));
  require('./_be-castle-dungeon.js')(k, maker('castle-', 'be-castle', 'Castle and dungeon creatures'));
  require('./_be-castle-gothic.js')(k, maker('gothic-', 'be-gothic', 'Gothic creatures'));
  require('./_be-castle-graveyard.js')(k, maker('graveyard-', 'be-graveyard', 'Graveyard creatures'));
  return out;
};
