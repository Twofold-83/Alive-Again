/* Helpers for tools/big/env2-country.js (Village, Rural): how an object is registered with its four pictures,
 * and the drawing routines the two settings share. Not a module of its own (the name starts with _). */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const D = dark,
    L = lite;
  const out = {};

  /** A view { w, h, draw } that calls fn(c, used). pad = [left, top, right]: extra room around the base picture;
   *  fn still draws in the coordinates of the base picture (x from -left, y from -top, x up to w - 1 + right). */
  const mk = (fn, w, h, pad, used, extra) => {
    const [l, t, r] = pad || [0, 0, 0];
    return {
      w: w + l + r,
      h: h + t,
      ...extra,
      draw(c) {
        if (!(l || t || r)) return fn(c, used);
        const { set, get, clear } = c,
          W0 = c.w,
          H0 = c.h;
        c.set = (x, y, col) => set(Math.round(x) + l, Math.round(y) + t, col);
        c.get = (x, y) => get(x + l, y + t);
        c.clear = (x, y) => clear(x + l, y + t);
        c.w = w;
        c.h = h;
        try {
          fn(c, used);
        } finally {
          Object.assign(c, { set, get, clear, w: W0, h: H0 });
        }
      },
    };
  };
  /**
   * reg(cat, label) gives add(slug, name, s) with s = {
   *   w, h, f(c, used)          the main picture (and its used state)
   *   sw, sh, s(c, used)        the other perspective; left out: the thing is round, f is used again
   *   base: 'side'              the main picture is the long side, s is the front
   *   u, su: [left, top, right] extra room the used pictures need
   *   solid, o                  o: options for every picture (shade: false ...)
   * }
   */
  const reg = (cat, catLabel) => (slug, name, s) => {
    if (out[slug]) throw new Error('env2-country: ' + slug + ' twice');
    const side = s.s || s.f,
      sw = s.s ? s.sw : s.sw || s.w,
      sh = s.sh || s.h,
      o = s.o || {};
    out[slug] = {
      cat,
      catLabel,
      name,
      w: s.w,
      h: s.h,
      solid: !!s.solid,
      ...o,
      draw: (c) => s.f(c, false),
      views: {
        ...(s.base ? { base: 'side' } : {}),
        side: mk(side, sw, sh, null, false, o),
        used: mk(s.f, s.w, s.h, s.u, true, o),
        sideUsed: mk(side, sw, sh, s.su || (s.s ? null : s.u), true, o),
      },
    };
  };

  /* ---------- colours of the country ---------- */
  const P = {
    OAK: hex('#5c4432'),
    GREYW: hex('#7a6e60'), // weathered boards
    PALEW: hex('#93805f'),
    TAR: hex('#3a3438'),
    THATCH: hex('#8a7646'),
    HAY: hex('#a48d4a'),
    BRICK: hex('#7a4636'),
    LIME: hex('#b4ad9a'), // whitewash
    STONE: hex('#84827c'),
    SOIL: hex('#3f2e26'),
    MUD: hex('#4d3d2c'),
    SOOT: hex('#1c1a1e'),
    TIN: hex('#858a92'),
    ZINC: hex('#6f7780'),
    WAT: hex('#5f8f98'),
    MILK: hex('#d6d2c4'),
    ROPE: hex('#9a8a5a'),
    CANVAS: hex('#8f8468'),
    SACK: hex('#9a8a62'),
    BREAD: hex('#a8743c'),
    PEWTER: hex('#7d8088'),
    TYRE: hex('#27252b'),
    FRED: hex('#8a3b2e'), // faded farm red
    FGREEN: hex('#4c6048'),
    FBLUE: hex('#4d6175'),
    FYELLOW: hex('#a8904a'),
    MEAT: hex('#8e4a44'),
    LAMP: hex('#d9c56a'),
  };

  /* ---------- small routines ---------- */
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  /** A board: lighter on top, darker below. */
  function board(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    if (y1 > y0) c.row(y1, x0, x1, D(col));
  }
  /** A plain face lit from the left. */
  function face(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, y1, L(col));
    c.col(x1, y0, y1, D(col));
  }
  /** A sunk panel: dark above and left, light below and right. */
  function panel(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, D(col));
    c.col(x0, y0, y1, D(col));
    c.row(y1, x0, x1, L(col));
    c.col(x1, y0, y1, L(col));
  }
  /** An upright post, w wide, light on the left. */
  function post(c, x, y0, y1, col, w = 2) {
    c.rect(x, y0, x + w - 1, y1, col);
    c.col(x, y0, y1, L(col));
    if (w > 2) c.col(x + w - 1, y0, y1, D(col));
  }
  function legs(c, xs, y0, y1, col = P.OAK, w = 2) {
    for (const x of xs) post(c, x, y0, y1, col, w);
  }
  /** Vertical joints of planks. */
  function planksV(c, x0, y0, x1, y1, col, step = 4) {
    for (let x = x0 + step - 1; x < x1; x += step) c.col(x, y0, y1, col);
  }
  function planksH(c, x0, y0, x1, y1, col, step = 4) {
    for (let y = y0 + step - 1; y < y1; y += step) c.row(y, x0, x1, col);
  }
  /** A wall of upright boards. */
  function boards(c, x0, y0, x1, y1, col, step = 4) {
    face(c, x0, y0, x1, y1, col);
    planksV(c, x0, y0 + 1, x1, y1, D(col), step);
  }
  /** A wall of boards lying. */
  function boardsH(c, x0, y0, x1, y1, col, step = 4) {
    face(c, x0, y0, x1, y1, col);
    planksH(c, x0 + 1, y0, x1, y1, D(col), step);
  }
  /** The dark inside of something opened. */
  function hollow(c, x0, y0, x1, y1, col = P.SOOT) {
    c.rect(x0, y0, x1, y1, col === P.SOOT ? col : mix(col, 0.36));
    c.row(y0, x0, x1, col === P.SOOT ? mix(col, 0.7) : mix(col, 0.24));
    c.col(x0, y0, y1, col === P.SOOT ? mix(col, 0.7) : mix(col, 0.28));
  }
  /** A pane of glass with a streak of light; lit: a lamp behind it. */
  function pane(c, x0, y0, x1, y1, lit, col = hex('#3f5a58')) {
    c.rect(x0, y0, x1, y1, lit ? P.LAMP : col);
    if (!lit) {
      const n = Math.min(x1 - x0, y1 - y0, 2);
      for (let i = 0; i <= n; i++) c.set(x0 + i, y1 - i, hex('#7fa39c'));
    }
  }
  /** A flame standing on x, yb. */
  function flame(c, x, yb, n = 2) {
    c.set(x, yb, C.flame);
    c.set(x, yb - 1, C.flameLight);
    if (n > 2) {
      c.set(x - 1, yb, C.flame);
      c.set(x + 1, yb, C.flame);
      c.set(x, yb - 2, C.flameLight);
      c.set(x, yb, C.flameLight);
      c.set(x, yb - 3, C.flame);
    }
  }
  /** A fire in the box x0..x1 with its feet on yb: h high. */
  function fire(c, x0, x1, yb, h, seed = 1) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) {
      const m = 1 - Math.abs((x - (x0 + x1) / 2) / ((x1 - x0) / 2 + 0.5)),
        t = Math.max(1, Math.round(h * (0.35 + 0.65 * m) * (0.6 + 0.4 * r())));
      c.col(x, yb - t + 1, yb, C.flame);
      if (t > 2) c.col(x, yb - t + 3, yb, C.flameLight);
      if (t > 3 && r() < 0.6) c.set(x, yb - t + 1, C.red);
    }
    c.row(yb, x0, x1, C.flame);
  }
  /** Wisps of steam or smoke going up from x, y. */
  function wisp(c, x, y, n = 4, col = C.ash) {
    for (let i = 0; i < n; i++) c.set(x + (i % 2 ? 1 : 0) + (i > 3 ? 1 : 0), y - i, i % 3 === 2 ? blend(col, C.white, 0.4) : col);
  }
  /** A clump of leaves filling an oval. */
  function bush(c, x0, y0, x1, y1, seed = 1, col = C.leaf, hi = C.leafLight) {
    c.oval(x0, y0, x1, y1, col);
    const r = rnd(seed);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        if (!c.get(x, y) || c.get(x, y) !== col) continue;
        const v = r(),
          left = (x - x0) / (x1 - x0 + 1) + (y - y0) / (y1 - y0 + 1);
        if (v < 0.3 - left * 0.14) c.set(x, y, hi);
        else if (v > 0.83 - left * 0.1) c.set(x, y, D(col));
      }
  }
  /** Masonry: blocks with dark joints. */
  function stones(c, x0, y0, x1, y1, col = P.STONE, bh = 4, bw = 7, seed = 1) {
    c.rect(x0, y0, x1, y1, col);
    const j = mix(col, 0.62);
    let k = 0;
    for (let y = y0; y <= y1; y += bh, k++) {
      if (y > y0) c.row(y, x0, x1, j);
      c.row(y + 1 > y1 ? y1 : y + (y > y0 ? 1 : 0), x0, x1, L(col));
      for (let x = x0 + (k % 2 ? bw >> 1 : bw) - 1; x < x1; x += bw) c.col(x, y + (y > y0 ? 1 : 0), Math.min(y1, y + bh - 1), j);
    }
    c.speckle(x0, y0, x1, y1, D(col), 14, seed);
  }
  /** Rough field stones: a dry wall. */
  function rubble(c, x0, y0, x1, y1, col = P.STONE, seed = 1) {
    c.rect(x0, y0, x1, y1, col);
    const r = rnd(seed),
      j = mix(col, 0.58);
    for (let y = y0, k = 0; y <= y1; y += 3, k++) {
      if (y > y0) c.row(y, x0, x1, j);
      for (let x = x0 + 2 + Math.floor(r() * 3); x < x1; x += 3 + Math.floor(r() * 4)) c.col(x, y + (y > y0 ? 1 : 0), Math.min(y1, y + 2), j);
      for (let x = x0; x <= x1; x++) if (c.get(x, y + 1) === col && r() < 0.35) c.set(x, y + 1, L(col));
    }
  }
  function bricks(c, x0, y0, x1, y1, col = P.BRICK, seed = 1) {
    c.rect(x0, y0, x1, y1, col);
    const j = mix(col, 0.6);
    for (let y = y0 + 2; y <= y1; y += 3) c.row(y, x0, x1, j);
    let k = 0;
    for (let y = y0; y <= y1; y += 3, k++) for (let x = x0 + (k % 2 ? 2 : 5); x <= x1; x += 6) c.col(x, y, Math.min(y1, y + 1), j);
    c.speckle(x0, y0, x1, y1, L(col), 9, seed);
    c.speckle(x0, y0, x1, y1, D(col), 11, seed + 3);
  }
  /** A spoked wheel seen from the side; nothing behind it is wiped out. */
  function wheel(c, cx, cy, r, col = P.OAK, hub = C.iron, rim) {
    const rc = rim || col;
    for (let y = cy - r; y <= cy + r; y++)
      for (let x = cx - r; x <= cx + r; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d <= r + 0.35 && d > r - 1.25) c.set(x, y, x + y < cx + cy - r * 0.6 ? L(rc) : x + y > cx + cy + r * 0.9 ? D(rc) : rc);
      }
    const sp = D(col),
      q = r - 2;
    c.line(cx - q, cy, cx + q, cy, sp);
    c.line(cx, cy - q, cx, cy + q, sp);
    if (r > 4) {
      const e = Math.round(q * 0.7);
      c.line(cx - e, cy - e, cx + e, cy + e, sp);
      c.line(cx - e, cy + e, cx + e, cy - e, sp);
    }
    c.set(cx, cy, hub);
    if (r > 6) {
      c.rect(cx - 1, cy - 1, cx + 1, cy + 1, col);
      c.set(cx, cy, hub);
    }
  }
  /** A cart wheel seen edge on (from the front of the cart). */
  function wheelEdge(c, x, y0, y1, w = 2, col = P.OAK) {
    c.rect(x, y0, x + w - 1, y1, col);
    c.col(x, y0, y1, C.iron);
    if (w > 1) c.col(x + w - 1, y0 + 1, y1 - 1, D(col));
    c.set(x, y0, C.steel);
  }
  /** A rubber tyre with its hub, from the side. */
  function tyre(c, cx, cy, r, hub = P.FRED, tread = true) {
    c.oval(cx - r, cy - r, cx + r, cy + r, P.TYRE);
    if (tread)
      for (let a = 0; a < 16; a++) {
        const x = Math.round(cx + Math.cos((a * Math.PI) / 8) * (r - 0.2)),
          y = Math.round(cy + Math.sin((a * Math.PI) / 8) * (r - 0.2));
        if (y < cy) c.set(x, y, hex('#3f3d44'));
      }
    const h = Math.max(1, Math.round(r * 0.5));
    c.oval(cx - h, cy - h, cx + h, cy + h, hub);
    if (h > 1) {
      c.set(cx - h + 1, cy - h + 1, L(hub));
      c.oval(cx - h + 1, cy - h + 1, cx + h - 1, cy + h - 1, D(hub));
      c.set(cx - 1, cy - 1, hub);
    }
    c.set(cx, cy, C.ironDark);
  }
  /** A tyre seen edge on (the front of a tractor or a truck). */
  function tyreEdge(c, x0, y0, x1, y1) {
    c.rect(x0, y0, x1, y1, P.TYRE);
    c.set(x0, y0, null);
    for (let y = y0 + 1; y < y1; y += 2) {
      c.row(y, x0, x1, hex('#3a383f'));
    }
    c.col(x0, y0 + 1, y1 - 1, hex('#3f3d44'));
  }
  /** A barrel standing. */
  function barrel(c, x0, y0, x1, y1, col = hex('#6a4c34'), hoop = C.iron) {
    c.rect(x0, y0 + 1, x1, y1 - 1, col);
    c.row(y0, x0 + 1, x1 - 1, L(col));
    c.row(y1, x0 + 1, x1 - 1, D(col));
    for (let x = x0 + 2; x < x1; x += 3) c.col(x, y0 + 1, y1 - 1, D(col));
    c.col(x0, y0 + 1, y1 - 1, L(col));
    c.col(x1, y0 + 1, y1 - 1, D(col));
    const h = y1 - y0;
    for (const y of h > 9 ? [y0 + 2, y1 - 2] : [y0 + 1, y1 - 1]) {
      c.row(y, x0, x1, hoop);
      c.set(x0, y, L(hoop));
    }
  }
  /** A barrel lying, seen from its side. */
  function barrelLying(c, x0, y0, x1, y1, col = hex('#6a4c34'), hoop = C.iron) {
    c.rect(x0 + 1, y0, x1 - 1, y1, col);
    c.col(x0, y0 + 1, y1 - 1, col);
    c.col(x1, y0 + 1, y1 - 1, D(col));
    c.row(y0, x0 + 1, x1 - 1, L(col));
    for (let y = y0 + 2; y < y1; y += 3) c.row(y, x0 + 1, x1 - 1, D(col));
    c.row(y1, x0 + 1, x1 - 1, D(col));
    for (const x of [x0 + 2, x1 - 2]) {
      c.col(x, y0, y1, hoop);
      c.set(x, y0, L(hoop));
    }
  }
  /** The head of a barrel lying towards us. */
  function barrelEnd(c, cx, cy, r, col = hex('#6a4c34'), hoop = C.iron) {
    c.oval(cx - r, cy - r, cx + r, cy + r, hoop);
    c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, L(col));
    for (let x = cx - r + 3; x < cx + r - 1; x += 3) for (let y = cy - r + 1; y <= cy + r - 1; y++) if (c.get(x, y) && c.get(x, y) !== hoop) c.set(x, y, col);
    c.set(cx, cy + Math.max(1, r - 3), C.woodDark);
  }
  /** A tied sack. */
  function sack(c, x0, y0, x1, y1, col = P.SACK) {
    const m = (x0 + x1) >> 1;
    c.rect(x0, y0 + 3, x1, y1, col);
    c.row(y0 + 2, x0 + 1, x1 - 1, col);
    c.row(y0 + 2, x0 + 1, m, L(col));
    c.col(x0, y0 + 4, y1, L(col));
    c.col(x1, y0 + 3, y1, D(col));
    c.rect(m - 1, y0, m + 1, y0, col);
    c.row(y0 + 1, m - 1, m, P.ROPE);
    c.set(x0, y1, D(col));
    if (x1 - x0 > 5) c.line(m + 1, y0 + 4, m + 2, y1 - 1, D(col));
  }
  /** A slatted crate. */
  function crate(c, x0, y0, x1, y1, col = P.PALEW) {
    face(c, x0, y0, x1, y1, col);
    for (let y = y0 + 2; y < y1; y += 3) c.row(y, x0 + 1, x1 - 1, D(col));
    c.col(x0 + 1, y0 + 1, y1, D(col));
    c.col(x1 - 1, y0 + 1, y1, D(col));
  }
  /** A milk churn standing on yb: w wide (5 or 6), h high. */
  function churn(c, x0, yb, w = 6, h = 12, col = P.TIN) {
    const x1 = x0 + w - 1,
      yt = yb - h + 1;
    c.rect(x0, yt + 4, x1, yb, col);
    c.rect(x0 + 1, yt + 1, x1 - 1, yt + 3, col);
    c.row(yt, x0, x1, L(col)); // the lid
    c.row(yt + 1, x0 + 1, x1 - 1, D(col));
    c.col(x0, yt + 4, yb, L(col));
    c.col(x1, yt + 4, yb, D(col));
    c.row(yt + 4, x0, x1, L(col));
    c.row(yb - 1, x0, x1, D(col));
    c.set(x0 - 0, yt + 6, C.ironDark);
    c.set(x1, yt + 6, C.ironDark);
  }
  /** Thatch (or hay) filling a polygon. */
  function thatch(c, pts, seed = 1, col = P.THATCH) {
    c.poly(pts, col);
    const xs = pts.map((p) => p[0]),
      ys = pts.map((p) => p[1]),
      r = rnd(seed);
    for (let y = Math.min(...ys); y <= Math.max(...ys); y++)
      for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
        if (c.get(x, y) !== col) continue;
        const v = r();
        if (v < 0.16) c.set(x, y, L(col));
        else if (v > 0.8) c.set(x, y, D(col));
      }
  }
  /** Hay or straw in a box, rough on top. */
  function hay(c, x0, y0, x1, y1, seed = 1, col = P.HAY) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) {
      const t = y0 + (r() < 0.35 ? 1 : 0);
      c.col(x, t, y1, col);
      c.set(x, t, L(col));
    }
    for (let y = y0 + 1; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const v = r();
        if (v < 0.14) c.set(x, y, L(col));
        else if (v > 0.8) c.set(x, y, D(col));
      }
  }
  /** A small heap (earth, coal, grain, dung): a mound between x0 and x1 standing on yb. */
  function heap(c, x0, x1, yb, h, col, seed = 1) {
    const r = rnd(seed),
      m = (x0 + x1) / 2,
      hw = (x1 - x0) / 2 + 0.5;
    for (let x = x0; x <= x1; x++) {
      const t = Math.max(1, Math.round(h * Math.sqrt(Math.max(0, 1 - ((x - m) / hw) ** 2)) + (r() - 0.5)));
      c.col(x, yb - t + 1, yb, col);
      c.set(x, yb - t + 1, L(col));
    }
    c.speckle(x0, yb - h, x1, yb, D(col), 4, seed);
  }
  function blood(c, pts) {
    dots(c, C.blood, pts);
  }
  /** A puddle on the ground row. */
  function puddle(c, x0, x1, y, col = P.WAT) {
    c.row(y, x0, x1, col);
    c.set(x0 + 1, y, L(col));
  }
  /** A thin broken trickle running down from x, y0 to y1. */
  function drip(c, x, y0, y1, col) {
    for (let y = y0; y <= y1; y++) if ((y - y0) % 3 !== 2) c.set(x, y, col);
  }
  /** Broken bits on the floor. */
  function shards(c, x0, x1, y, col, seed = 2) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) if (r() < 0.45) c.set(x, y - (r() < 0.3 ? 1 : 0), r() < 0.5 ? col : L(col));
  }
  /** Tufts of grass standing on yb at the given xs. */
  function grass(c, xs, yb, col = C.moss) {
    for (const x of xs) {
      c.col(x, yb - 1, yb, col);
      c.set(x + 1, yb, C.leafLight);
      c.set(x - 1, yb - (x % 2), col);
    }
  }
  /** A crow, 5 x 4, standing with its feet on y; flip: looking left. */
  function crow(c, x, y, flip) {
    const k = hex('#18161c'),
      s = flip ? -1 : 1,
      o = flip ? 4 : 0,
      p = (i, j, col) => c.set(x + o + s * i, y + j, col);
    p(1, -2, k);
    p(2, -2, k);
    p(3, -3, k);
    p(2, -3, hex('#2c2a34'));
    p(4, -3, hex('#55525c'));
    p(0, -1, k);
    p(1, -1, k);
    p(2, -1, k);
    p(2, 0, hex('#55525c'));
  }
  /** A pewter tankard, 4 x 4, standing on yb. */
  function tankard(c, x, yb, col = P.PEWTER) {
    c.rect(x, yb - 3, x + 2, yb, col);
    c.col(x, yb - 3, yb, L(col));
    c.set(x + 3, yb - 2, col);
    c.set(x + 3, yb - 1, col);
    c.row(yb - 3, x, x + 2, hex('#d0c8b0'));
  }
  /** A loaf, w wide and 3 high, lying on yb. */
  function loaf(c, x, yb, w = 6, col = P.BREAD) {
    c.rect(x, yb - 1, x + w - 1, yb, col);
    c.row(yb - 2, x + 1, x + w - 2, L(col));
    c.row(yb, x, x + w - 1, D(col));
    for (let i = x + 2; i < x + w - 1; i += 2) c.set(i, yb - 1, D(col));
  }
  /** A fish lying, head to the left; len 6 or more. */
  function fish(c, x, y, len = 7, col = hex('#8f9aa0')) {
    c.row(y, x, x + len - 3, col);
    c.row(y + 1, x + 1, x + len - 3, L(col));
    c.row(y - 1, x + 1, x + len - 4, D(col));
    c.set(x + len - 2, y, D(col));
    c.set(x + len - 1, y - 1, D(col));
    c.set(x + len - 1, y + 1, D(col));
    c.set(x + 1, y, K);
  }
  /** A rope or chain hanging or stretched. */
  function rope(c, x0, y0, x1, y1, col = P.ROPE) {
    c.line(x0, y0, x1, y1, col);
  }
  function chain(c, x0, y0, x1, y1) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) c.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, i % 2 ? C.iron : C.steel);
  }
  /** A square lantern, 5 wide and 7 high, its top at x, y. */
  function lantern(c, x, y, lit, col = C.ironDark) {
    c.row(y, x + 1, x + 3, col);
    c.rect(x, y + 1, x + 4, y + 1, col);
    c.rect(x, y + 2, x + 4, y + 5, lit ? P.LAMP : hex('#3f4a48'));
    c.col(x, y + 2, y + 5, col);
    c.col(x + 4, y + 2, y + 5, col);
    c.col(x + 2, y + 2, y + 5, lit ? C.flameLight : hex('#55605c'));
    if (lit) c.set(x + 2, y + 4, C.flame);
    else c.set(x + 2, y + 5, C.bone);
    c.row(y + 6, x, x + 4, col);
  }
  /** Somebody standing in the dark: head and shoulders, feet on yb. */
  function shape(c, x, yt, yb, col = hex('#2c2a30')) {
    c.rect(x + 1, yt, x + 3, yt + 2, col);
    c.rect(x, yt + 3, x + 4, yb, col);
  }
  return {
    out, reg, mk, P, D, L, dots, board, face, panel, post, legs, planksV, planksH, boards, boardsH, hollow, pane, flame, fire, wisp, bush, stones, rubble, bricks,
    wheel, wheelEdge, tyre, tyreEdge, barrel, barrelLying, barrelEnd, sack, crate, churn, thatch, hay, heap, blood, puddle, drip, shards, grass, crow, tankard, loaf, fish, rope, chain, lantern, shape,
  };
};
