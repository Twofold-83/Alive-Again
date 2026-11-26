/*
 * Creatures of four settings — medieval, castle (the dungeon), gothic, graveyard — at paper-doll scale.
 * Each is drawn twice by one function fn(g, r): as it lurks (r = 0) and roused (r = 1, the `used` picture).
 * The drawing itself is in tools/big/_be-castle-<med|dun|got|grv><1|2>.js, the helpers in _be-castle-kit.js.
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
  /* a setting file that does not load (work in progress) must not stop the other modules: it only fails our own runs */
  const mine = process.argv.some((a) => a.includes('be-castle') || /^--dump=(medieval|castle|gothic|graveyard)-/.test(a));
  for (const [file, prefix, cat, label] of [
    ['med1', 'medieval-', 'be-medieval', 'Medieval creatures'],
    ['med2', 'medieval-', 'be-medieval', 'Medieval creatures'],
    ['dun1', 'castle-', 'be-castle', 'Castle and dungeon creatures'],
    ['dun2', 'castle-', 'be-castle', 'Castle and dungeon creatures'],
    ['got1', 'gothic-', 'be-gothic', 'Gothic creatures'],
    ['got2', 'gothic-', 'be-gothic', 'Gothic creatures'],
    ['grv1', 'graveyard-', 'be-graveyard', 'Graveyard creatures'],
    ['grv2', 'graveyard-', 'be-graveyard', 'Graveyard creatures'],
  ]) {
    try {
      require('./_be-castle-' + file + '.js')(k, maker(prefix, cat, label));
    } catch (e) {
      if (mine) throw e;
    }
  }
  return out;
};
