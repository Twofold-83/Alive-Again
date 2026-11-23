/* Places of care gone quiet, at paper-doll scale: a hospital, a school and the toilets and bathrooms.
 * Every thing is new to the library and has four pictures: as it stands, from the other side, and both after
 * someone used it. A thing is written as one function per perspective, fn(c, used), drawn on a fresh canvas
 * each time (so the used picture is the same drawing with the change in it):
 *   add(slug, name, solid, { m: [w, h, fn], s: [w, h, fn], mu: [w, h], su: [w, h], base: 'side' })
 * m is the main picture, s the other perspective; mu / su the canvas of the used pictures if it has to grow.
 * In a side view the front of the thing faces right. The settings are drawn in the _env-care-*.js files. */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const D = dark,
    L = lite;
  const out = {};
  const maker =
    (cat, catLabel) =>
    (slug, name, solid, sp) => {
      if (out[slug]) throw new Error(slug + ' is drawn twice in env-care');
      const [w, h, fn] = sp.m,
        mu = sp.mu || [w, h],
        o = sp.o || {};
      const def = { cat, catLabel, name, w, h, solid: !!solid, ...o, draw: (c) => fn(c, false), views: {} };
      if (sp.base) def.views.base = sp.base;
      if (sp.s) {
        const [sw, sh, sf] = sp.s,
          su = sp.su || [sw, sh];
        def.views.side = { w: sw, h: sh, ...o, draw: (c) => sf(c, false) };
        def.views.used = { w: mu[0], h: mu[1], ...o, draw: (c) => fn(c, true) };
        def.views.sideUsed = { w: su[0], h: su[1], ...o, draw: (c) => sf(c, true) };
      } else def.views.used = { w: mu[0], h: mu[1], ...o, draw: (c) => fn(c, true) };
      out[slug] = def;
    };

  /* ---------- colours ---------- */
  const P = {
    SHEET: C.white,
    FOLD: blend(C.white, C.stone, 0.45),
    STEEL: C.steel,
    STL: L(C.steel),
    STD: D(C.steel),
    IRON: C.iron,
    ID: C.ironDark,
    BLK: C.black,
    HG: hex('#7e9c8c'), // hospital green
    MINT: hex('#a3b8a6'),
    LAM: hex('#b9ab8a'), // beige laminate
    VINYL: hex('#6a3038'),
    TEALV: hex('#3d5c5e'),
    RUB: hex('#2a2830'),
    YEL: hex('#b59a3c'),
    ORANGE: hex('#b06a34'),
    SCR: hex('#1d2b27'), // a screen switched off
    SCRON: hex('#12261c'),
    TR: hex('#7fcf8a'), // the trace on it
    WAT: hex('#8fb3bd'),
    WATD: C.water,
    BLOOD: C.blood,
    IN: hex('#1b1a22'), // the dark inside of things
    BLANK: hex('#6f8f9a'), // a pale blue blanket
    PORC: hex('#d6d3c4'), // porcelain
    PORD: hex('#a9a797'),
    TILE: hex('#c4c8bc'),
    GRIME: hex('#7a7a5c'),
    RUSTW: hex('#8a5a34'), // rusty water
    PAPER: C.paper,
    CORK: hex('#a07a4e'),
    BOARD: hex('#2f4a3c'), // a blackboard, green-black
    CHALK: hex('#cfd2c4'),
    LOCK: hex('#5f707a'), // locker blue-grey
    PLASTIC: hex('#a85a34'), // orange school plastic
  };
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  /** A sunk panel: dark above and left, light below and right. */
  function panel(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, D(col));
    c.col(x0, y0, y1, D(col));
    c.row(y1, x0, x1, L(col));
    c.col(x1, y0, y1, L(col));
  }
  /** A small wheel standing on the floor row b, two pixels wide from x. */
  function caster(c, x, b) {
    c.rect(x, b - 1, x + 1, b, P.RUB);
    c.set(x, b - 1, C.stone);
  }
  /** A thin leg down to a caster. */
  function wleg(c, x, y0, b, col = P.STEEL) {
    c.col(x, y0, b - 2, col);
    caster(c, x, b);
  }
  /** A screen: 'off', 'flat' (a flat line), 'trace' (a heartbeat), 'static', 'text', 'lit' (a plain glow). */
  function screen(c, x0, y0, x1, y1, mode, col = P.TR) {
    c.rect(x0, y0, x1, y1, mode === 'off' ? P.SCR : P.SCRON);
    const ym = (y0 + y1) >> 1;
    if (mode === 'off') {
      c.set(x0 + 1, y0 + 1, hex('#3d4f49'));
      if (x1 - x0 > 4) c.set(x0 + 2, y0 + 1, hex('#3d4f49'));
    } else if (mode === 'flat') c.row(ym, x0 + 1, x1 - 1, col);
    else if (mode === 'trace') {
      const pat = [0, 0, -1, 1, -2, 0, 0, 0];
      for (let x = x0 + 1; x < x1; x++) c.set(x, ym + pat[(x - x0) % pat.length], col);
    } else if (mode === 'static') {
      c.rect(x0, y0, x1, y1, hex('#55605c'));
      c.speckle(x0, y0, x1, y1, hex('#c8ccc2'), 3, x0 + y0);
      c.speckle(x0, y0, x1, y1, hex('#20262a'), 4, x0 + y0 + 5);
    } else if (mode === 'text') {
      for (let y = y0 + 1; y < y1; y += 2) c.row(y, x0 + 1, x0 + 1 + ((y * 7 + x0) % Math.max(2, x1 - x0 - 1)), col);
    } else if (mode === 'lit') c.rect(x0, y0, x1, y1, col);
  }
  /** A bottle standing on yb. */
  function bottle(c, x, yb, h, col, cap = P.BLK) {
    c.col(x, yb - h + 1, yb, col);
    c.set(x, yb - h, cap);
  }
  /** A row of bottles and boxes on a shelf between x0 and x1; fill < 1 leaves gaps. */
  function jars(c, x0, x1, yb, seed, fill = 1, mh = 3) {
    const r = rnd(seed),
      cols = [hex('#7a5a34'), C.glass, P.SHEET, hex('#4f6b3c'), C.glassLight, hex('#84482a'), P.PAPER];
    for (let x = x0; x <= x1; x++) {
      const k = r(),
        h = 1 + ((r() * mh) | 0),
        col = cols[(r() * cols.length) | 0];
      if (k > fill) continue;
      c.col(x, yb - h + 1, yb, col);
      if (h > 1 && r() < 0.5) c.set(x, yb - h + 1, P.BLK);
      if (r() < 0.35) x++;
    }
  }
  /** Water falling from y0 to y1 at x. */
  function stream(c, x, y0, y1, col = P.WAT) {
    c.col(x, y0, y1, col);
    for (let y = y0 + 1; y <= y1; y += 3) c.set(x, y, L(col));
  }
  /** A puddle lying on the floor row y. */
  function puddle(c, x0, x1, y, col = P.WATD) {
    c.row(y, x0, x1, col);
    c.row(y - 1, x0 + 1, x1 - 2, col);
    c.set(x0 + 2, y - 1, L(col));
  }
  /** The side of a cupboard or machine: a plain face with a frame, the front edge at x1. */
  function cabS(c, x0, y0, x1, y1, col, o = {}) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, L(col));
    c.row(y1, x0, x1, D(col));
    c.col(x1, y0 + 1, y1, D(col));
    if (o.frame !== false && x1 - x0 > 4 && y1 - y0 > 5) c.frame(x0 + 2, y0 + 2, x1 - 2, y1 - 2, D(col));
  }
  /** A door swung open, seen from the front: a narrow slab out from the hinge at xh (dir -1 to the left). */
  function doorOpenF(c, xh, y0, y1, w, col, dir = -1) {
    const xa = dir < 0 ? xh - w : xh + 1,
      xb = dir < 0 ? xh - 1 : xh + w;
    c.rect(xa, y0, xb, y1 + 1, col);
    c.col(dir < 0 ? xa : xb, y0, y1 + 1, L(col));
    c.row(y0, xa, xb, L(col));
    c.row(y1 + 1, xa, xb, D(col));
    c.col(dir < 0 ? xb : xa, y0, y1 + 1, D(col));
    return [xa, xb];
  }
  /** A door standing straight out of the front in a side view: its whole face, from x0 to x1. */
  function doorOpenS(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, D(col));
    c.col(x1, y0, y1, D(col));
    c.row(y1, x0, x1, D(col));
    if (x1 - x0 > 4 && y1 - y0 > 6) c.frame(x0 + 2, y0 + 2, x1 - 2, y1 - 2, L(col));
  }
  /** A spoked wheel. */
  function wheel(c, cx, cy, r, spoke = P.STEEL) {
    c.oval(cx - r, cy - r, cx + r, cy + r, P.RUB);
    c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, hex('#3a3942'));
    c.line(cx - r + 1, cy, cx + r - 1, cy, spoke);
    c.line(cx, cy - r + 1, cx, cy + r - 1, spoke);
    if (r > 3) {
      c.line(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, D(spoke));
      c.line(cx - r + 2, cy + r - 2, cx + r - 2, cy - r + 2, D(spoke));
    }
    c.set(cx, cy, L(spoke));
  }
  /** A sheet of paper with lines of writing. */
  function sheet(c, x0, y0, x1, y1, col = P.PAPER) {
    c.rect(x0, y0, x1, y1, col);
    for (let y = y0 + 1; y < y1; y += 2) c.row(y, x0 + 1, x1 - 1 - ((y + x0) % 2), D(col));
  }
  /** Drops and a smear of blood (or anything else) from x, y. */
  function splat(c, x, y, col = P.BLOOD) {
    dots(c, col, [x, y, x + 1, y, x + 1, y + 1, x + 2, y + 1, x - 1, y + 2, x + 3, y - 1]);
  }
  /** Stripes down a cloth. */
  function folds(c, x0, y0, x1, y1, col, step = 3, off = 0) {
    for (let x = x0 + off; x <= x1; x += step) c.col(x, y0, y1, col);
  }
  const BOOKS = [C.wine, C.navy, C.forest, C.mustard, C.slate, C.plum, C.teal, C.parchment, C.rust, C.black];
  /** A row of book spines standing on yb, at most mh tall; fill < 1 leaves gaps. */
  function books(c, x0, x1, yb, mh, seed, fill = 1) {
    const r = rnd(seed);
    let x = x0;
    while (x <= x1) {
      if (r() > fill) {
        x += 1 + ((r() * 3) | 0);
        continue;
      }
      const w = r() < 0.35 ? 2 : 1,
        h = mh - ((r() * 3) | 0),
        col = BOOKS[(r() * BOOKS.length) | 0],
        xe = Math.min(x1, x + w - 1);
      c.rect(x, yb - h + 1, xe, yb, col);
      if (h > 3) c.row(yb - h + 2, x, xe, L(col));
      x = xe + 1;
    }
  }
  /** A lying picture stood on end, or the other way: draws fn on a w x h canvas and turns it a quarter onto c. */
  function turned(c, w, h, fn, right = false, ox = 0, oy = 0) {
    const t = canvas(w, h);
    fn(t);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const p = t.get(x, y);
        if (p) right ? c.set(ox + h - 1 - y, oy + x, p) : c.set(ox + y, oy + w - 1 - x, p);
      }
  }
  const T = { ...P, D, L, dots, books, turned, canvas, panel, caster, wleg, screen, bottle, jars, stream, puddle, cabS, doorOpenF, doorOpenS, wheel, sheet, splat, folds };

  const parts = [
    ['env-hospital', 'Hospital', ['hospital-a', 'hospital-b']],
    ['env-school', 'School', ['school-a', 'school-b']],
    ['env-toilet', 'Toilet', ['toilet-a', 'toilet-b']],
  ];
  const fs = require('fs'),
    path = require('path');
  for (const [cat, label, files] of parts)
    for (const f of files) {
      const p = path.join(__dirname, `_env-care-${f}.js`);
      if (fs.existsSync(p)) require(p)(kit, T, maker(cat, label));
    }
  return out;
};
