/* Shared helpers of tools/big/env2-ruin.js (the world after, and a quiet suburb): how an object with its four
 * pictures is declared, a tiny letter font, wheels, drums, crates, fire, rust, grass, hedges. Not loaded on its own. */
module.exports = (kit, out) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const D = dark,
    L = lite;
  let cat = '',
    catLabel = '';
  const setCat = (c, l) => {
    cat = c;
    catLabel = l;
  };

  /** Run fn on canvas c as if it were a canvas of w x h whose corner sits at dx, dy of the real one. */
  function shifted(c, dx, dy, w, h, fn) {
    const { set, get, clear } = c,
      W0 = c.w,
      H0 = c.h;
    c.set = (x, y, col) => set(Math.round(x) + dx, Math.round(y) + dy, col);
    c.get = (x, y) => get(Math.round(x) + dx, Math.round(y) + dy);
    c.clear = (x, y) => clear(Math.round(x) + dx, Math.round(y) + dy);
    c.w = w;
    c.h = h;
    try {
      fn(c);
    } finally {
      c.set = set;
      c.get = get;
      c.clear = clear;
      c.w = W0;
      c.h = H0;
    }
  }
  function pic(w, h, fn, u, m, o) {
    const [ml, mt, mr] = m || [0, 0, 0];
    const d = {
      w: w + ml + mr,
      h: h + mt,
      draw(c) {
        if (ml || mt || mr) shifted(c, ml, mt, w, h, (cc) => fn(cc, u));
        else fn(c, u);
      },
    };
    if (o.shade === false) d.shade = false;
    if (o.outline === false) d.outline = false;
    return d;
  }
  /**
   * An object with all its pictures.
   *   w, h, f(c, used)        the front view
   *   sw, sh, s(c, used)      the side view (sh defaults to h); same: true reuses the front view
   *   base: 'side'            the main picture is the side view
   *   um, sum                 [left, top, right] room the used front / used side picture needs beyond its canvas
   *   m, sm                   the same for the unused pictures (rarely)
   */
  const T = (slug, name, o) => {
    if (out[slug]) throw new Error('env2-ruin: ' + slug + ' twice');
    if (o.same) {
      o.s = o.f;
      o.sw = o.w;
      o.sum = o.um;
      o.sm = o.m;
    }
    const F = (u) => pic(o.w, o.h, o.f, u, u ? o.um || o.m : o.m, o),
      S = (u) => (o.s ? pic(o.sw, o.sh || o.h, o.s, u, u ? o.sum || o.sm : o.sm, o) : null),
      side = o.base === 'side',
      main = side ? S(false) : F(false),
      other = side ? F(false) : S(false),
      views = {};
    if (side) views.base = 'side';
    if (other) views.side = other;
    views.used = side ? S(true) : F(true);
    if (other) views.sideUsed = side ? F(true) : S(true);
    out[slug] = { cat, catLabel, name, solid: !!o.solid, ...main, views };
  };

  /* ---------- small drawing helpers ---------- */
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  /** A little picture as text: lines of letters, pal says which colour each letter is ('.' is empty, '#' the outline). */
  const pat = (c, x, y, lines, pal) =>
    lines.forEach((r, j) => {
      for (let i = 0; i < r.length; i++) if (r[i] !== '.' && r[i] !== ' ') c.set(x + i, y + j, r[i] === '#' ? K : Array.isArray(pal) ? pal : pal[r[i]]);
    });
  /** fn drawn left-right swapped on a canvas of w x h. */
  const flip = (w, h, fn) => (c, u) => {
    const t = canvas(w, h);
    fn(t, u);
    c.stamp(t, 0, 0, true);
  };
  /** Mirror the left half of the (logical) canvas onto the right half. */
  const mir = (c) => {
    for (let y = -12; y < c.h; y++)
      for (let x = 0; x < c.w >> 1; x++) {
        const p = c.get(x, y);
        if (p) c.set(c.w - 1 - x, y, p);
        else c.clear(c.w - 1 - x, y);
      }
  };
  /** A sunk panel: dark above and left, light below and right. */
  function panel(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, D(col));
    c.col(x0, y0, y1, D(col));
    c.row(y1, x0, x1, L(col));
    c.col(x1, y0, y1, L(col));
  }
  function legs(c, xs, y0, y1, col, w = 2) {
    for (const x of xs) c.rect(x, y0, x + w - 1, y1, col);
  }
  /** A box seen from its narrow side: plain, a light back edge, the dark front edge on the right. */
  function sideBox(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, mix(col, 0.88));
    c.row(y0, x0, x1, col);
    c.col(x0, y0, y1, col);
    c.col(x1, y0, y1, D(col));
    c.row(y1, x0, x1, D(col));
  }
  /** A box with a light top row and left column only (softer than c.box). */
  function slab(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, L(col));
    c.row(y1, x0, x1, D(col));
  }

  /* a 3 x 5 letter font */
  const FONT = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111',
    F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010',
    K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '111101101101101', O: '111101101101111',
    P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010',
    Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
    4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111',
    9: '111101111001110', '!': '010010010000010', '?': '110001010000010', '-': '000000111000000', '.': '000000000000010',
    $: '011110010011110', '+': '000010111010000', '/': '001001010100100',
  };
  /** Write s at x, y (top left) in the 3 x 5 font; returns the x after the last letter. */
  function txt(c, x, y, s, col, o = {}) {
    const sp = o.sp == null ? 1 : o.sp;
    [...s].forEach((ch, i) => {
      const g = FONT[ch];
      if (g) for (let j = 0; j < 15; j++) if (g[j] === '1') c.set(x + (j % 3), y + ((j / 3) | 0), typeof col === 'function' ? col(i, ch) : col);
      x += ch === ' ' ? 2 : 3 + sp;
    });
    return x;
  }
  /** Lines of unreadable writing: dashes of col in the box. */
  function scribble(c, x0, y0, x1, y1, col, seed = 1) {
    const r = rnd(seed);
    for (let y = y0; y <= y1; y += 2) {
      let x = x0;
      while (x <= x1) {
        const n = 1 + ((r() * 3) | 0);
        c.row(y, x, Math.min(x1, x + n - 1), col);
        x += n + 1;
      }
    }
  }

  const TYRE = hex('#201e26'),
    DARK = hex('#17151c'),
    CONC = hex('#85837f'),
    CONCD = hex('#63615f'),
    GLASSD = hex('#2b3a46'),
    LAMP = C.flameLight,
    AMBER = C.flame,
    REDL = hex('#c8382e'),
    GREENL = hex('#5fb46a'),
    CARD = hex('#9a7a52'),
    CARDD = hex('#7a5d3e'),
    WATER = hex('#5f8696'),
    WATERL = hex('#a9c6cc'),
    SMOKE = hex('#6f6c72'),
    SMOKED = hex('#4a4850'),
    RUST = C.rust,
    RUSTD = hex('#5e3322'),
    RUSTL = hex('#a2603a'),
    SOOT = hex('#2a262a'),
    OLIVE = hex('#56603e'),
    OLIVED = hex('#3d4630'),
    KHAKI = hex('#8a8258'),
    CANVAS = hex('#7c7a5a'),
    TARP = hex('#3f5a70'),
    HAZ = hex('#b59a32'),
    TOXIC = hex('#8fae4a'),
    SAND = hex('#a3906a'),
    LAWN = hex('#56753f'),
    LAWND = hex('#3e5a33'),
    HEDGE = hex('#3a5a38'),
    VINYL = hex('#d2cdbd'),
    WARM = hex('#b9a860');

  /** A wheel seen from the side: a dark tyre of radius r around cx, cy with a hub. */
  function wheel(c, cx, cy, r, hub = C.steel) {
    c.oval(cx - r, cy - r, cx + r, cy + r, TYRE);
    if (r >= 3) {
      c.oval(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, hub);
      c.set(cx, cy, D(hub));
    } else if (r >= 2) c.set(cx, cy, hub);
  }
  /** A bare rim where the tyre has burnt away: sits lower. */
  function rim(c, cx, yb, r = 2) {
    c.oval(cx - r, yb - r * 2, cx + r, yb, C.ironDark);
    c.set(cx, yb - r, RUST);
  }
  /** A thin spoked wheel (bicycle, pram): a ring of col. */
  function ring(c, cx, cy, r, col, spokes) {
    for (let a = 0; a < 48; a++) c.set(cx + Math.cos((a * Math.PI) / 24) * r, cy + Math.sin((a * Math.PI) / 24) * r, col);
    if (spokes) {
      c.line(cx - r + 1, cy, cx + r - 1, cy, spokes);
      c.line(cx, cy - r + 1, cx, cy + r - 1, spokes);
      c.set(cx, cy, col);
    }
  }
  /** Bricks in the box. */
  function bricks(c, x0, y0, x1, y1, col, mortar) {
    const m = mortar || D(col);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const j = ((y - y0) / 3) | 0;
        c.set(x, y, (y - y0) % 3 === 2 || (x - x0 + (j % 2 ? 3 : 0)) % 6 === 5 ? m : col);
      }
  }
  /** Planks side by side (upright) in the box. */
  function planks(c, x0, y0, x1, y1, col, pw = 4) {
    c.rect(x0, y0, x1, y1, col);
    for (let x = x0 + pw; x <= x1; x += pw) c.col(x, y0, y1, D(col));
    c.col(x0, y0, y1, L(col));
  }
  /** Boards lying across (horizontal) in the box. */
  function boards(c, x0, y0, x1, y1, col, ph = 3) {
    c.rect(x0, y0, x1, y1, col);
    for (let y = y0; y <= y1; y += ph) c.row(y, x0, x1, L(col));
    for (let y = y0 + ph - 1; y <= y1; y += ph) c.row(y, x0, x1, D(col));
  }
  /** Slanted stripes of two colours in the box. */
  function hazard(c, x0, y0, x1, y1, a, b, w = 3) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, Math.floor((x + y) / w) % 2 ? a : b);
  }
  /** Rust blooming over what is drawn in the box. */
  function rust(c, x0, y0, x1, y1, every = 9, seed = 3) {
    c.speckle(x0, y0, x1, y1, RUST, every, seed);
    c.speckle(x0, y0, x1, y1, RUSTD, every * 2, seed + 5);
  }
  /** Soot and scorching. */
  function soot(c, x0, y0, x1, y1, every = 6, seed = 4) {
    c.speckle(x0, y0, x1, y1, SOOT, every, seed);
  }
  const TINS = [hex('#8f3b30'), hex('#3d5a6e'), hex('#9a8a3c'), hex('#5a7048'), hex('#8a8e94'), hex('#7a4a68'), hex('#b0a58a')];
  /** A row of tins standing on yb between x0 and x1: each 2-3 wide, h tall, with a paler label. */
  function tins(c, x0, x1, yb, h, seed, fill = 1, cols = TINS) {
    const r = rnd(seed);
    let x = x0;
    while (x + 1 <= x1) {
      const w = r() < 0.4 ? 3 : 2,
        col = cols[(r() * cols.length) | 0],
        hh = h - (r() < 0.3 ? 1 : 0),
        xe = Math.min(x1, x + w - 1);
      if (r() <= fill) {
        c.rect(x, yb - hh + 1, xe, yb, col);
        c.row(yb - hh + 1, x, xe, L(col));
        if (hh > 3) c.row(yb - ((hh / 2) | 0), x, xe, blend(col, C.paper, 0.6));
      }
      x = xe + 2;
    }
  }
  /** One tin can at x (2 wide) standing on yb. */
  function tin(c, x, yb, col, h = 4, w = 3) {
    c.rect(x, yb - h + 1, x + w - 1, yb, col);
    c.row(yb - h + 1, x, x + w - 1, C.steel);
    c.row(yb - 1, x, x + w - 1, blend(col, C.paper, 0.6));
  }
  /** One bottle (2 wide, h tall) standing on yb. */
  function bottle(c, x, yb, h, col) {
    c.rect(x, yb - h + 3, x + 1, yb, col);
    c.col(x, yb - h + 3, yb, L(col));
    c.set(x, yb - h + 2, col);
    c.set(x, yb - h + 1, D(col));
  }
  /** Bits of litter along the row y. */
  function litter(c, x0, x1, y, seed = 1, cols = [C.paper, CARD, hex('#8f3b30'), C.ash]) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) if (r() < 0.4) c.set(x, y - (r() < 0.25 ? 1 : 0), cols[(r() * cols.length) | 0]);
  }
  /** A small flame standing on x, yb (h 3..7). */
  function flame(c, x, yb, h = 4) {
    c.col(x, yb - h + 1, yb, C.flame);
    if (h > 3) {
      c.col(x - 1, yb - h + 3, yb, C.flame);
      c.col(x + 1, yb - h + 2, yb, C.flame);
      c.col(x, yb - h + 3, yb, C.flameLight);
      c.set(x, yb - h + 1, C.red);
    } else {
      c.set(x, yb, C.flameLight);
    }
  }
  /** A fire along x0..x1 standing on yb, tongues up to h high. */
  function fire(c, x0, x1, yb, h, seed = 1) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) {
      const t = 1 - Math.abs((x - (x0 + x1) / 2) / ((x1 - x0) / 2 + 1)),
        hh = Math.max(2, Math.round(h * (0.35 + 0.65 * t) * (0.6 + 0.4 * r())));
      c.col(x, yb - hh + 1, yb, C.flame);
      c.set(x, yb - hh + 1, C.red);
      if (hh > 3) c.col(x, yb - Math.round(hh * 0.55), yb, C.flameLight);
      if (hh > 5 && r() < 0.6) c.col(x, yb - Math.round(hh * 0.25), yb, hex('#f2e2a0'));
    }
  }
  /** Smoke or steam rising from x, yb: a wobbling line of puffs. */
  function smoke(c, x, yb, h, col = SMOKE, seed = 1) {
    const r = rnd(seed);
    let px = x;
    for (let y = yb; y > yb - h; y--) {
      if ((yb - y) % 3 !== 2) c.set(px, y, col);
      if ((yb - y) % 4 === 1) c.set(px + 1, y, col);
      px += r() < 0.4 ? 1 : r() < 0.5 ? -1 : 0;
    }
  }
  /** A puddle lying on the row y from x0 to x1. */
  function pool(c, x0, x1, y, col = WATER) {
    c.row(y, x0, x1, col);
    c.row(y, x0 + 1, x0 + 2, L(col));
  }
  /** An oil drum: w wide, standing on yb, h tall; ribs at thirds. */
  function drum(c, x, yb, w, h, col, o = {}) {
    const x1 = x + w - 1,
      y0 = yb - h + 1;
    c.rect(x, y0, x1, yb, col);
    c.col(x, y0, yb, L(col));
    c.col(x + 1, y0, yb, L(col));
    c.col(x1, y0, yb, D(col));
    c.col(x1 - 1, y0, yb, mix(col, 0.84));
    c.row(y0, x, x1, o.open ? DARK : L(col));
    for (const k of [1 / 3, 2 / 3]) c.row(y0 + Math.round(h * k), x, x1, D(col));
    c.row(yb, x, x1, D(col));
    return { x0: x, x1, y0 };
  }
  /** A wooden crate. */
  function crate(c, x0, y0, x1, y1, col = C.woodLight, o = {}) {
    c.rect(x0, y0, x1, y1, col);
    for (let y = y0 + 3; y < y1; y += 3) c.row(y, x0 + 1, x1 - 1, D(col));
    c.frame(x0, y0, x1, y1, mix(col, 0.8));
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, L(col));
    if (o.slats !== false && x1 - x0 > 8) {
      c.col(x0 + 2, y0 + 1, y1 - 1, mix(col, 0.8));
      c.col(x1 - 2, y0 + 1, y1 - 1, mix(col, 0.8));
    }
  }
  /** A row of sandbags from x0 to x1 with their top on y (each 3 high); off shifts the joints. */
  function sandbags(c, x0, x1, y, off = 0, col = SAND) {
    c.rect(x0, y, x1, y + 2, col);
    c.row(y, x0, x1, L(col));
    c.row(y + 2, x0, x1, D(col));
    for (let x = x0 + 6 - off; x < x1; x += 7) {
      c.col(x, y, y + 2, D(col));
      c.set(x, y, col);
    }
    c.clear(x0, y);
    c.clear(x1, y);
    c.clear(x0, y + 2);
    c.clear(x1, y + 2);
  }
  /** A skull about 5 x 5 at x, y (top left). */
  function skull(c, x, y, col = C.bone) {
    pat(c, x, y, ['.bbb.', 'bbbbb', 'bkbkb', '.bbb.', '.bdb.'], { b: col, k: DARK, d: D(col) });
  }
  /** The three-bladed warning sign, 5 x 5. */
  function trefoil(c, x, y, col = DARK) {
    pat(c, x, y, ['x...x', 'xx.xx', '..x..', '.xxx.', '.xxx.'], col);
  }
  /** A gas mask seen from the front, 7 x 8. */
  function gasmask(c, x, y, col = hex('#3a3d38')) {
    pat(c, x, y, ['.mmmmm.', 'mmmmmmm', 'mgGmgGm', 'mggmggm', 'mmmmmmm', '.mfffm.', '.mfFfm.', '..fff..'], { m: col, g: GLASSD, G: C.glassLight, f: hex('#55584f'), F: DARK });
  }
  /** A tyre lying flat, 12 x 4, top left at x, y. */
  function tyreFlat(c, x, y, w = 12) {
    c.rect(x, y, x + w - 1, y + 3, TYRE);
    for (const [i, j] of [[0, 0], [w - 1, 0], [0, 3], [w - 1, 3]]) c.clear(x + i, y + j);
    c.row(y, x + 2, x + w - 3, hex('#3a3842'));
    for (let i = x + 1; i < x + w - 1; i += 2) c.set(i, y + 2, hex('#34323c'));
  }
  /** A tyre standing up, radius r around cx, cy. */
  function tyreUp(c, cx, cy, r) {
    c.oval(cx - r, cy - r, cx + r, cy + r, TYRE);
    c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, hex('#34323c'));
    c.oval(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, TYRE);
    c.oval(cx - r + 3, cy - r + 3, cx + r - 3, cy + r - 3, DARK);
  }
  /** Wire mesh (chain link) in the box. */
  function mesh(c, x0, y0, x1, y1, col = C.steel) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((x + y) % 4 === 0 || (x - y + 400) % 4 === 0) c.set(x, y, col);
  }
  /** A coil of barbed wire along x0..x1: overlapping loops of height h with their bottom on yb. */
  function coil(c, x0, x1, yb, h, col = C.steel) {
    const r = (h - 1) / 2,
      rx = Math.max(1.5, r * 0.8),
      step = Math.max(2, Math.round(rx * 1.3));
    for (let x = x0 + rx; x + rx <= x1 + 0.6; x += step)
      for (let a = 0; a < 40; a++) {
        const cs = Math.cos((a * Math.PI) / 20),
          sn = Math.sin((a * Math.PI) / 20);
        c.set(x + cs * rx, yb - r + sn * r, cs < -0.2 ? D(col) : col);
      }
    for (let x = x0 + 1; x <= x1; x += 4) c.set(x, yb - h + 1, L(col));
  }
  /** Tufts of grass or weeds standing on yb. */
  function grass(c, x0, x1, yb, seed = 1, col = LAWN, tall = 2) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) {
      const v = r();
      if (v < 0.45) c.col(x, yb - ((r() * tall) | 0), yb, v < 0.15 ? L(col) : col);
    }
  }
  /** A clump of leaves: an irregular filled blob with lights (top left) and darks. */
  function leaves(c, x0, y0, x1, y1, col = HEDGE, seed = 1) {
    const r = rnd(seed);
    c.oval(x0, y0, x1, y1, col);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        if (c.get(x, y) === col) {
          const v = r(),
            t = (x - x0) / (x1 - x0 + 1) + (y - y0) / (y1 - y0 + 1);
          if (v < 0.22 && t < 0.9) c.set(x, y, L(col));
          else if (v > 0.8 && t > 0.8) c.set(x, y, D(col));
        }
  }
  /** A squared hedge in the box: leafy texture, light top. */
  function hedge(c, x0, y0, x1, y1, col = HEDGE, seed = 1) {
    const r = rnd(seed);
    c.rect(x0, y0, x1, y1, col);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const v = r();
        if (v < 0.16) c.set(x, y, y - y0 < 3 ? L(L(col)) : L(col));
        else if (v > 0.8) c.set(x, y, D(col));
      }
    c.row(y0, x0, x1, L(col));
    c.row(y1, x0, x1, D(col));
  }
  /** A pane of glass: dark with a slanting light, or lit from inside. */
  function pane(c, x0, y0, x1, y1, lit, col = GLASSD) {
    c.rect(x0, y0, x1, y1, lit ? WARM : col);
    if (!lit) {
      if (x1 - x0 >= 3) c.line(x0 + 1, y0 + Math.min(3, y1 - y0), x0 + Math.min(3, x1 - x0), y0 + 1, mix(C.glass, 0.9));
    } else c.row(y0, x0, x1, L(WARM));
  }
  /** A screen (television, monitor): off (dark with a glint), or on showing static / a picture. */
  function screen(c, x0, y0, x1, y1, on, kind = 'static', seed = 2) {
    c.rect(x0, y0, x1, y1, on ? hex('#6d8a8c') : hex('#1c2226'));
    if (!on) {
      c.line(x0 + 1, y0 + 2, x0 + 2, y0 + 1, hex('#39454a'));
      return;
    }
    if (kind === 'static') {
      const r = rnd(seed);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, r() < 0.5 ? hex('#9fb0ac') : r() < 0.5 ? hex('#4a5a5e') : hex('#c9d2c8'));
    } else if (kind === 'bars') {
      const cols = [hex('#b9b6a8'), hex('#b0a040'), hex('#4f9a98'), hex('#5a9a50'), hex('#9a4a8a'), hex('#a8403a'), hex('#3a4a9a')];
      for (let x = x0; x <= x1; x++) c.col(x, y0, y1, cols[Math.min(6, (((x - x0) * 7) / (x1 - x0 + 1)) | 0)]);
    } else {
      c.rect(x0, y0, x1, y1, hex('#7f9aa0'));
      c.row(y0, x0, x1, hex('#a9c0c0'));
    }
  }
  /** A drip running down from x, y for n pixels. */
  const drip = (c, x, y, n, col) => c.col(x, y, y + n - 1, col);

  /* ---------- cars ---------- */
  /**
   * A car from the side, front to the right, on a canvas about 48 x 22. o: col, cab [x0, x1] (roof ends), est (estate
   * back), glass, lit (lamps on), inside (cabin light), noGlass, noTyres, dead, trim, hub, door (front door open),
   * bonnet (up), boot (up), seat.
   */
  function carSide(c, o) {
    const w = c.w,
      b = c.h - 2,
      col = o.col,
      by = b - 3, // the sill
      wy = b - 11, // the waist
      ry = wy - 6, // the roof
      [c0, c1] = o.cab || [10, 34],
      glass = o.noGlass ? DARK : o.inside ? WARM : o.glass || GLASSD,
      wx = o.wheels || [10, w - 12],
      trim = o.trim || C.steel;
    c.poly([[1, wy + 2], [3, wy], [w - 7, wy], [w - 2, wy + 3], [w - 2, by], [1, by]], col);
    c.row(wy, 3, w - 7, L(col));
    c.row(by, 2, w - 3, D(col));
    c.row(by - 1, 2, w - 3, mix(col, 0.82));
    const back = o.est ? c0 + 1 : c0 + 4;
    c.poly([[c0, wy - 1], [back, ry], [c1 - 6, ry], [c1, wy - 1]], col);
    c.row(ry, back, c1 - 6, L(col));
    c.poly([[c0 + 2, wy - 1], [back + 1, ry + 2], [c1 - 7, ry + 2], [c1 - 2, wy - 1]], glass);
    if (!o.noGlass && !o.inside) c.line(c1 - 9, ry + 2, c1 - 6, wy - 2, L(glass));
    const mid = Math.round((c0 + c1) / 2) - 1;
    c.col(mid, ry + 1, wy - 1, col); // the pillars
    if (o.est) c.col(c0 + 7, ry + 1, wy - 1, col);
    c.col(mid, wy + 1, by - 1, D(col)); // doors
    c.col(c1 - 2, wy + 1, by - 1, D(col));
    c.col(c0 + 3, wy + 1, by - 3, D(col));
    c.row(wy + 2, mid - 3, mid - 2, trim);
    c.row(wy + 2, c1 - 6, c1 - 5, trim);
    c.rect(w - 3, by - 2, w - 2, by - 1, trim); // bumpers and lamps
    c.rect(1, by - 2, 2, by - 1, trim);
    c.rect(w - 3, wy + 3, w - 2, wy + 4, o.lit ? LAMP : o.dead ? C.black : C.glassLight);
    c.rect(1, wy + 3, 1, wy + 4, o.lit ? REDL : o.dead ? C.black : hex('#7a2a26'));
    if (o.door) {
      for (let y = ry + 2; y <= by - 1; y++) for (let x = mid + 1; x <= c1 - 3; x++) if (y >= wy || c.get(x, y) === glass) c.set(x, y, DARK);
      c.rect(mid + 2, wy - 2, mid + 4, by - 3, o.seat || hex('#4a3a34'));
      c.row(by - 3, mid + 2, mid + 7, o.seat || hex('#4a3a34'));
      c.set(c1 - 5, wy, C.iron);
      c.set(c1 - 5, wy - 1, C.iron);
      c.rect(c1 - 2, ry + 4, c1 - 1, by - 1, L(col));
      c.col(c1 - 1, ry + 4, by - 1, col);
      c.rect(c1 - 2, ry + 4, c1 - 1, wy - 1, mix(glass === DARK ? C.iron : C.glass, 0.9));
    }
    if (o.bonnet) {
      c.row(wy, c1 + 1, w - 7, DARK);
      c.line(c1 + 1, wy - 1, w - 8, wy - 8, col);
      c.line(c1 + 2, wy - 1, w - 7, wy - 8, D(col));
      c.line(w - 9, wy - 1, w - 9, wy - 5, C.iron);
    }
    if (o.boot) {
      c.row(wy, 3, c0 - 1, DARK);
      c.line(c0 - 1, wy - 1, 3, wy - 7, col);
      c.line(c0 - 2, wy - 1, 2, wy - 7, L(col));
    }
    for (const x of wx) {
      c.oval(x - 4, b - 8, x + 4, b, DARK);
      if (o.noTyres) rim(c, x, b, 2);
      else wheel(c, x, b - 3, 3, o.hub || C.steel);
    }
    return { wy, ry, by, b, c0, c1, mid, back, glass };
  }
  /** The same car from the front, on a canvas about 26 x 22. bonnet: up; door: the driver's door stands open to the right. */
  function carFront(c, o) {
    const w = c.w,
      b = c.h - 2,
      col = o.col,
      by = b - 3,
      wy = b - 11,
      ry = wy - 6,
      trim = o.trim || C.steel,
      glass = o.noGlass ? DARK : o.inside ? WARM : o.glass || GLASSD;
    c.rect(1, wy, w - 2, by, col);
    c.row(wy, 2, w - 3, L(col));
    c.clear(1, wy);
    c.clear(w - 2, wy);
    c.poly([[3, wy - 1], [5, ry], [w - 6, ry], [w - 4, wy - 1]], col);
    c.row(ry, 5, w - 6, L(col));
    c.poly([[5, wy - 1], [6, ry + 2], [w - 7, ry + 2], [w - 6, wy - 1]], glass);
    if (!o.noGlass && !o.inside) c.line(8, wy - 2, 10, ry + 2, L(glass));
    c.set(2, wy - 2, col); // wing mirrors
    c.set(w - 3, wy - 2, col);
    c.rect(8, wy + 3, w - 9, wy + 5, hex('#1e1c24')); // the grille
    for (let x = 9; x < w - 9; x += 2) c.col(x, wy + 3, wy + 5, C.iron);
    for (const x of [3, w - 6]) {
      c.rect(x, wy + 3, x + 2, wy + 5, o.lit ? LAMP : o.dead ? C.black : C.glassLight);
      if (!o.lit && !o.dead) c.set(x + 2, wy + 5, C.glass);
    }
    c.rect(1, by - 1, w - 2, by, trim); // the bumper
    c.row(by, 1, w - 2, D(trim));
    if (!o.noPlate) c.rect((w >> 1) - 3, by - 1, (w >> 1) + 2, by, o.plate || C.bone);
    for (const x of [2, w - 6]) c.rect(x, by + 1, x + 3, b, o.noTyres ? C.ironDark : TYRE); // the wheels
    c.rect(6, by + 1, w - 7, by + 1, DARK);
    if (o.bonnet) {
      c.rect(3, wy - 8, w - 4, wy - 1, D(col));
      c.row(wy - 8, 3, w - 4, col);
      c.rect(5, wy - 6, w - 6, wy - 2, mix(col, 0.5));
      c.row(wy, 3, w - 4, DARK);
    }
    if (o.door) {
      c.rect(w - 1, ry + 3, w + 3, by - 1, mix(col, 0.8));
      c.col(w - 1, ry + 3, by - 1, D(col));
      c.rect(w, ry + 4, w + 2, wy - 1, glass === DARK ? DARK : mix(C.glass, 0.8));
      c.row(by - 1, w - 1, w + 3, D(col));
    }
    return { wy, ry, by, b, glass };
  }
  /** Tyres seen end-on under a vehicle from the front or back: at x (w wide) from y0 to y1, with tread. */
  function tyreEnd(c, x, y0, y1, w = 5) {
    c.rect(x, y0, x + w - 1, y1, TYRE);
    for (let y = y0 + 1; y <= y1; y += 2) c.row(y, x, x + w - 1, hex('#34323c'));
  }

  return {
    ...kit, carSide, carFront, tyreEnd, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring, bricks, planks, boards, hazard, rust, soot,
    tins, tin, bottle, litter, flame, fire, smoke, pool, drum, crate, sandbags, skull, trefoil, gasmask, tyreFlat, tyreUp, mesh, coil, grass, leaves, hedge,
    pane, screen, drip, TINS,
    TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, CARD, CARDD, WATER, WATERL, SMOKE, SMOKED, RUST, RUSTD, RUSTL, SOOT, OLIVE, OLIVED, KHAKI, CANVAS,
    TARP, HAZ, TOXIC, SAND, LAWN, LAWND, HEDGE, VINYL, WARM, POLE: C.iron,
  };
};
