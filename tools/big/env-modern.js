/*
 * Three modern settings at paper-doll scale, every thing with its four pictures (main, other perspective, used,
 * other perspective used):
 *   env-modernhome   a 1980s–90s family home            (_env-modern-home1.js, _env-modern-home2.js)
 *   env-electronics  machines and gadgets               (_env-modern-elec1.js, _env-modern-elec2.js)
 *   env-apartment    a run-down block of flats          (_env-modern-apt1.js, _env-modern-apt2.js)
 *
 * A thing is written as obj(slug, name, { w, h, f(c, u), sw, sh, s(c, u), U, SU, base, p }):
 *   f(c, u)   draws the main picture on a w x h canvas; u is true for the used picture
 *   s(c, u)   draws the other perspective on a sw x sh canvas (in a side view the front faces right)
 *   U, SU     { w, h, dx, dy, x(c) } if the used picture needs a larger canvas: the used drawing is put at dx, dy
 *             (by default left, standing on the bottom row), then x(c) draws what sticks out (an open door ...);
 *             { own: true, w, h }: f(c, true) draws on a canvas of that size itself
 *   base      'side' if the main picture is the long side; p: true if one can walk past it
 * All four pictures are drawn afresh with the same colour variables, then shaded and outlined by make-big.js.
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const out = {};
  const D = dark,
    L = lite;

  /* ---------- colours of the modern world: plastic, melamine, chrome, velour ---------- */
  const X = {
    PL: hex('#c4bca6'), // beige plastic
    APW: hex('#d9d5c7'), // appliance white
    BLK: hex('#2b2931'), // black plastic
    GREY: hex('#6d6c72'), // grey plastic, hammered metal
    GREYL: hex('#9c9b9c'),
    CHR: hex('#9aa0a8'), // chrome
    PINE: hex('#b08a54'),
    TEAK: hex('#7a5232'),
    MEL: hex('#b9ad92'), // melamine chipboard
    VEL: hex('#6f4c3a'), // brown velour
    ORANGE: hex('#a85c2e'),
    AVO: hex('#7c8a56'), // avocado
    PINK: hex('#a8697a'),
    SCR0: hex('#20262a'), // a dead screen
    PHOS: hex('#5fae5a'), // green phosphor
    AMBER: hex('#c98a2a'),
    LEDR: hex('#d0402e'),
    LEDG: hex('#62b45c'),
    TUBE: hex('#3d5f82'), // a lit picture tube
    TUBEL: hex('#8fb0c4'),
    CONC: hex('#8a877f'), // concrete
    CONCD: hex('#65635f'),
    BRICK: hex('#7a4a3a'),
    DENIM: hex('#3f4f6e'),
    BAG: hex('#26242c'), // a bin bag
    HAZ: hex('#b89a2e'), // hazard yellow
    ROBOT: hex('#b0642a'), // robot orange
    WATERL: hex('#6f97a8'),
  };

  /* ---------- helpers ---------- */
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  const legs = (c, xs, y0, y1, col, w = 1) => {
    for (const x of xs) c.rect(x, y0, x + w - 1, y1, col);
  };
  /** A sunk panel: dark above and left, light below and right. */
  const panel = (c, x0, y0, x1, y1, col) => {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, D(col));
    c.col(x0, y0, y1, D(col));
    c.row(y1, x0, x1, L(col));
    c.col(x1, y0, y1, L(col));
  };
  /** A flat door or drawer front with a handle: h = 'l' | 'r' | 't' | 'b' | 'm' (where the handle sits) or none. */
  const door = (c, x0, y0, x1, y1, col, h = 'r', hc = X.CHR) => {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, L(col));
    c.row(y1, x0, x1, D(col));
    c.col(x1, y0, y1, D(col));
    const my = (y0 + y1) >> 1,
      mx = (x0 + x1) >> 1;
    if (h === 'r') c.col(x1 - 2, my - 1, my + 1, hc);
    else if (h === 'l') c.col(x0 + 2, my - 1, my + 1, hc);
    else if (h === 't') c.row(y0 + 2, mx - 1, mx + 1, hc);
    else if (h === 'b') c.row(y1 - 2, mx - 1, mx + 1, hc);
    else if (h === 'm') c.row(my, mx - 1, mx + 1, hc);
  };
  /** The dark inside of an opened thing. */
  const hole = (c, x0, y0, x1, y1, col = C.night) => {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, mix(col, 0.6));
    c.col(x0, y0, y1, mix(col, 0.6));
  };
  /** A screen: dead, or lit as 'text' | 'amber' | 'static' | 'tube' | 'game' | 'cam' | 'glow'. */
  const scr = (c, x0, y0, x1, y1, on, kind = 'tube', seed = 1) => {
    const r = rnd(seed + x0 * 3 + y0 * 5);
    if (!on) {
      c.rect(x0, y0, x1, y1, X.SCR0);
      c.set(x0 + 1, y0 + 1, mix(X.SCR0, 1.9));
      if (x1 - x0 > 4) c.set(x0 + 2, y0 + 1, mix(X.SCR0, 1.5));
      return;
    }
    if (kind === 'text' || kind === 'amber') {
      const ink = kind === 'text' ? X.PHOS : X.AMBER;
      c.rect(x0, y0, x1, y1, mix(ink, 0.22));
      for (let y = y0 + 1; y < y1; y += 2) c.row(y, x0 + 1, x0 + 1 + ((r() * (x1 - x0 - 2)) | 0), ink);
    } else if (kind === 'static') {
      c.rect(x0, y0, x1, y1, C.stone);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, [C.white, C.stoneDark, C.stoneLight, C.black, C.stone][(r() * 5) | 0]);
    } else if (kind === 'game') {
      c.rect(x0, y0, x1, y1, hex('#1c1a36'));
      for (let i = 0; i < (((x1 - x0) * (y1 - y0)) >> 3) + 2; i++) c.set(x0 + ((r() * (x1 - x0 + 1)) | 0), y0 + ((r() * (y1 - y0)) | 0), [X.AMBER, X.LEDR, X.PHOS, C.white][(r() * 4) | 0]);
      c.row(y1, x0, x1, X.PHOS);
    } else if (kind === 'cam') {
      c.rect(x0, y0, x1, y1, hex('#59625e'));
      c.rect(x0, y0, x1, y0 + ((y1 - y0) >> 1), hex('#7d8882'));
      c.line(x0, y1, (x0 + x1) >> 1, y0 + ((y1 - y0) >> 1), hex('#39403e'));
      c.line(x1, y1, (x0 + x1) >> 1, y0 + ((y1 - y0) >> 1), hex('#39403e'));
    } else if (kind === 'glow') {
      c.rect(x0, y0, x1, y1, C.glow);
      c.row(y0, x0, x1, L(C.glow));
    } else {
      c.rect(x0, y0, x1, y1, X.TUBE);
      c.rect(x0, y0, x1, y0 + ((y1 - y0) >> 1), blend(X.TUBE, X.TUBEL, 0.5));
      c.set(x0 + 1, y0 + 1, X.TUBEL);
      c.row(y1, x0, x1, D(X.TUBE));
    }
  };
  const led = (c, x, y, on, col = X.LEDR) => c.set(x, y, on ? col : mix(col, 0.35));
  /** A row of little lamps; cols cycles. */
  const leds = (c, x0, y, n, step, on, cols = [X.LEDR, X.LEDG, X.AMBER]) => {
    for (let i = 0; i < n; i++) led(c, x0 + i * step, y, on, cols[i % cols.length]);
  };
  /** Slats: every other row darker. */
  const vents = (c, x0, y0, x1, y1, col) => {
    for (let y = y0; y <= y1; y += 2) c.row(y, x0, x1, col);
  };
  /** A speaker cloth or mesh: a half-tone. */
  const grille = (c, x0, y0, x1, y1, col, col2) => {
    c.rect(x0, y0, x1, y1, col);
    c.dither(x0, y0, x1, y1, col2 || mix(col, 0.6));
  };
  /** A line through points [[x, y], ...]: a cable, a hose. */
  const cable = (c, pts, col) => {
    for (let i = 0; i < pts.length - 1; i++) c.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], col);
  };
  /** A coiled telephone cord hanging from x, y0 down to y1. */
  const cord = (c, x, y0, y1, col = X.BLK) => {
    for (let y = y0; y <= y1; y++) c.set(x + (y % 2), y, col);
  };
  /** A wisp of steam or smoke rising from x, y. */
  const wisp = (c, x, y, n = 4, col = C.ghost) => {
    for (let i = 0; i < n; i++) c.set(x + [0, 1, 0, -1][i % 4], y - i, i % 3 === 2 ? blend(col, C.white, 0.5) : col);
  };
  const puddle = (c, x0, x1, y, col = C.water) => {
    c.row(y, x0, x1, col);
    c.set(x0 + 1, y, L(col));
    if (x1 - x0 > 4) c.set(x1 - 2, y, L(col));
  };
  /** A spoked wheel or castor. */
  const wheel = (c, cx, cy, r, col = X.BLK, hub = X.CHR) => {
    c.oval(cx - r, cy - r, cx + r, cy + r, col);
    if (r > 2) {
      c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, mix(col, 1.5));
      c.oval(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, col);
    }
    c.set(cx, cy, hub);
  };
  const bottle = (c, x, yb, h, col) => {
    c.col(x, yb - h + 1, yb, col);
    c.col(x + 1, yb - h + 3, yb, col);
    c.set(x, yb - h + 3, L(col));
  };
  const cup = (c, x, yb, col = C.white) => {
    c.rect(x, yb - 2, x + 2, yb, col);
    c.set(x + 3, yb - 1, D(col));
    c.row(yb - 2, x, x + 2, L(col));
  };
  /** A garment hanging from y0 to y1. */
  const cloth = (c, x0, y0, x1, y1, col) => {
    c.rect(x0, y0, x1, y1, col);
    c.col(x0, y0, y1, L(col));
    if (x1 - x0 > 2) c.col(x0 + 2, y0 + 1, y1, D(col));
    c.set(x1, y1, D(col));
  };
  /** Things on a shelf between x0 and x1, standing on yb: tins, packets, jars. */
  const stuff = (c, x0, x1, yb, mh, seed, cols) => {
    const r = rnd(seed),
      P = cols || [C.wine, C.mustard, C.teal, C.paper, C.rust, X.AVO, C.navy, C.bone];
    let x = x0;
    while (x <= x1) {
      const w = 1 + ((r() * 2) | 0),
        h = Math.max(2, mh - ((r() * 3) | 0)),
        col = P[(r() * P.length) | 0],
        xe = Math.min(x1, x + w);
      if (r() < 0.8) {
        c.rect(x, yb - h + 1, xe, yb, col);
        c.row(yb - h + 1, x, xe, L(col));
        if (h > 3) c.row(yb - h + 3, x, xe, D(col));
      }
      x = xe + 1 + ((r() * 2) | 0);
    }
  };
  /** A row of shoes on yb. */
  const shoes = (c, x0, yb, n, seed) => {
    const r = rnd(seed),
      P = [X.BLK, C.woodDark, C.wine, C.white, C.navy, X.TEAK];
    for (let i = 0; i < n; i++) {
      const col = P[(r() * P.length) | 0],
        x = x0 + i * 4;
      c.rect(x, yb - 1, x + 2, yb, col);
      c.set(x, yb - 2, col);
      c.set(x + 2, yb, D(col));
    }
  };
  /** A drawing w x h fallen over, as a canvas to stamp: its top goes to the left (or to the right). */
  const turn = (w, h, fn, right = false) => {
    const t = canvas(w, h),
      r = canvas(h, w);
    fn(t);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const p = t.get(x, y);
        if (p) right ? r.set(h - 1 - y, x, p) : r.set(y, w - 1 - x, p);
      }
    return r;
  };
  const tools = { ...kit, turn, D, L, X, dots, legs, panel, door, hole, scr, led, leds, vents, grille, cable, cord, wisp, puddle, wheel, bottle, cup, cloth, stuff, shoes };

  /* ---------- the four pictures of a thing ---------- */
  const setting = (cat, catLabel) => (slug, name, o) => {
    if (out[slug]) throw new Error('env-modern: ' + slug + ' twice');
    const mk = (w, h, fn, u, U) => {
      if (!U) return { w, h, draw: (c) => fn(c, u) };
      if (U.own) return { w: U.w || w, h: U.h || h, draw: (c) => fn(c, true) }; // the used drawing lays itself out
      const W = U.w || w,
        Hh = U.h || h,
        dx = U.dx || 0,
        dy = U.dy == null ? Hh - h : U.dy;
      return {
        w: W,
        h: Hh,
        draw(c) {
          const t = canvas(w, h);
          fn(t, true);
          c.stamp(t, dx, dy);
          if (U.x) U.x(c, dx, dy);
        },
      };
    };
    const views = {};
    if (o.base) views.base = o.base;
    if (o.s) views.side = mk(o.sw, o.sh, o.s, false);
    views.used = mk(o.w, o.h, o.f, true, o.U);
    if (o.s) views.sideUsed = mk(o.sw, o.sh, o.s, true, o.SU);
    out[slug] = { cat, catLabel, name, w: o.w, h: o.h, solid: !o.p, draw: (c) => o.f(c, false), views };
  };
  const load = (file, cat, label) => {
    let mod;
    try {
      mod = require(file);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && String(e.message).includes(file.slice(2))) return; // a part not written yet
      throw e;
    }
    mod(tools, setting(cat, label));
  };
  load('./_env-modern-home1.js', 'env-modernhome', 'Modern home');
  load('./_env-modern-home2.js', 'env-modernhome', 'Modern home');
  load('./_env-modern-elec1.js', 'env-electronics', 'Electronics');
  load('./_env-modern-elec2.js', 'env-electronics', 'Electronics');
  load('./_env-modern-apt1.js', 'env-apartment', 'Apartment complex');
  load('./_env-modern-apt2.js', 'env-apartment', 'Apartment complex');
  return out;
};
