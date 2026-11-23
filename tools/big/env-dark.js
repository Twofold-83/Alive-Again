/*
 * Two dark settings at paper-doll scale, every thing with its four pictures (main, the other perspective, and
 * both after someone used it):
 *   env-horror   rust, chains and cement: the rooms of an industrial nightmare
 *   env-dream    the dream world: soft, strange and unsettling; "used" is the dream reacting
 * The things themselves are in _env-dark-*.js. Each is written as one or two functions f(c, used) and s(c, used):
 * the main picture and the other perspective, drawn fresh for the unused and the used state. A function may
 * return another function, which is run after the picture got its shading and outline (for drips, sparks, light).
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const out = {};
  const add = (slug, cat, catLabel, name, def) => {
    if (out[slug]) throw new Error('env-dark: ' + slug + ' twice');
    out[slug] = { cat, catLabel, name, ...def };
  };
  /**
   * maker(cat, label)(slug, name, o) with o = {
   *   w, h, f(c, used)          the main picture
   *   sw, sh, s(c, used)        the other perspective (left out for round things)
   *   uw, uh / suw, suh         another canvas size for the used pictures
   *   base: 'side'              the main picture is the long side
   *   solid: false, shade: false, outline: false }
   */
  const maker = (cat, label) => (slug, name, o) => {
    const wrap = (fn, u) => (c) => {
      const after = fn(c, u);
      if (o.shade !== false) c.shade();
      if (o.outline !== false) c.outline();
      if (typeof after === 'function') after();
      return false;
    };
    const views = {};
    if (o.base) views.base = o.base;
    if (o.s) views.side = { w: o.sw, h: o.sh || o.h, draw: wrap(o.s, false) };
    views.used = { w: o.uw || o.w, h: o.uh || o.h, draw: wrap(o.f, true) };
    if (o.s) views.sideUsed = { w: o.suw || o.sw, h: o.suh || o.sh || o.h, draw: wrap(o.s, true) };
    add(slug, cat, label, name, { w: o.w, h: o.h, solid: o.solid !== false, draw: wrap(o.f, false), views });
  };

  /* ---------- shared helpers ---------- */
  const D = dark,
    L = lite;
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  /** A picture of its own, not yet shaded or outlined, to stamp, turn or mirror. */
  const part = (w, h, draw) => {
    const t = canvas(w, h);
    draw(t);
    return t;
  };
  /** A picture fallen over: its top goes to the left (or to the right). */
  const turn = (t, right = false) => {
    const o = canvas(t.h, t.w);
    for (let y = 0; y < t.h; y++)
      for (let x = 0; x < t.w; x++) {
        const p = t.get(x, y);
        if (p) right ? o.set(t.h - 1 - y, x, p) : o.set(y, t.w - 1 - x, p);
      }
    return o;
  };
  /** A heavy chain, three pixels wide around x. */
  function chain(c, x, y0, y1, col = C.iron) {
    for (let y = y0; y <= y1; y++) {
      const k = (y - y0) % 5;
      if (k === 1 || k === 2) {
        c.set(x - 1, y, col);
        c.set(x + 1, y, D(col));
      } else c.set(x, y, k === 4 ? D(col) : col);
    }
  }
  /** A thin chain or cord of two tones. */
  function thin(c, x, y0, y1, col = C.iron) {
    for (let y = y0; y <= y1; y++) c.set(x, y, (y - y0) % 2 ? D(col) : col);
  }
  /** A meat hook hanging from x, y: five rows. */
  function hook(c, x, y, col = C.steel) {
    c.col(x, y, y + 1, col);
    c.col(x + 1, y + 2, y + 3, col);
    c.set(x, y + 4, D(col));
    c.set(x - 1, y + 3, col);
  }
  /** Rust eating what is drawn in the box. */
  function rusty(c, x0, y0, x1, y1, seed = 1, every = 5) {
    const r = rnd(seed + x0 * 3 + y1),
      n = Math.max(1, Math.round(((x1 - x0 + 1) * (y1 - y0 + 1)) / (every * 14))),
      put = (x, y, col) => c.get(x, y) && c.get(x, y) !== K && c.set(x, y, col);
    for (let i = 0; i < n * 3; i++) {
      const x = x0 + ((r() * (x1 - x0 + 1)) | 0),
        y = y0 + ((r() * (y1 - y0 + 1)) | 0);
      if (i % 3) {
        put(x, y, i % 2 ? C.rust : D(C.rust)); // a fleck
        continue;
      }
      put(x, y, C.rust); // a patch, running down a little
      put(x + 1, y, C.rust);
      put(x, y + 1, C.rust);
      if (r() < 0.6) put(x + 1, y + 1, D(C.rust));
      if (r() < 0.5) put(x, y + 2, D(C.rust));
      if (r() < 0.3) put(x - 1, y + 1, C.rust);
    }
  }
  /** A drip running down from x, y. */
  function drip(c, x, y, n, col = C.blood) {
    c.col(x, y, y + n - 1, col);
    c.set(x, y + n, D(col));
  }
  /** A flat pool on the floor row b from x0 to x1. */
  function pool(c, x0, x1, b, col = C.blood) {
    c.row(b, x0, x1, col);
    c.row(b - 1, x0 + 2, x1 - 2, col);
    c.set(x0 + 3, b - 1, L(col));
  }
  /** Vertical bars from x0 to x1 every `step`. */
  function bars(c, x0, x1, y0, y1, col, step = 3) {
    for (let x = x0; x <= x1; x += step) {
      c.col(x, y0, y1, col);
    }
  }
  /** A puffy cloud in the box. */
  function cloud(c, x0, y0, x1, y1, col, seed = 1) {
    const r = rnd(seed),
      w = x1 - x0 + 1,
      h = y1 - y0 + 1,
      mid = y0 + Math.round(h * 0.45);
    c.rect(x0 + 2, mid, x1 - 2, y1, col);
    c.row(y1, x0 + 3, x1 - 3, D(col));
    c.rect(x0, mid + 1, x1, y1 - 1, col);
    let x = x0 + 1;
    while (x < x1 - 2) {
      const d = Math.min(x1 - 1 - x, 4 + ((r() * Math.max(2, h * 0.6)) | 0)),
        t = Math.max(y0, mid - Math.round(d * 0.6) - ((r() * 2) | 0));
      c.oval(x, t, x + d, Math.min(y1, t + d + 1), col);
      c.set(x + 1 + (d >> 2), t + 1, L(col));
      c.set(x + 2 + (d >> 2), t + 1, L(col));
      x += Math.max(3, d - 1);
    }
    c.row(y1 - 1, x0 + 2, x1 - 2, blend(col, D(col), 0.5));
    return w;
  }
  /** A small four-pointed star. */
  function star(c, x, y, col = C.glow, big = false) {
    c.set(x, y, L(col));
    if (big) {
      c.set(x - 1, y, col);
      c.set(x + 1, y, col);
      c.set(x, y - 1, col);
      c.set(x, y + 1, col);
    }
  }
  /** The edge of an ellipse in the box. */
  function ring(c, x0, y0, x1, y1, col) {
    const cx = (x0 + x1) / 2,
      cy = (y0 + y1) / 2,
      rx = (x1 - x0 + 1) / 2,
      ry = (y1 - y0 + 1) / 2,
      inside = (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        if (inside(x, y) && !(inside(x - 1, y) && inside(x + 1, y) && inside(x, y - 1) && inside(x, y + 1))) c.set(x, y, col);
  }
  /** Stamp a picture with a dark pixel right of and under every pixel: for wire and thread, which an outline would drown. */
  function shadowed(c, t, x = 0, y = 0) {
    for (let j = 0; j < t.h; j++)
      for (let i = 0; i < t.w; i++)
        if (t.get(i, j)) {
          if (!t.get(i + 1, j)) c.set(x + i + 1, y + j, K);
          if (!t.get(i, j + 1)) c.set(x + i, y + j + 1, K);
        }
    c.stamp(t, x, y);
  }
  const H = { ...kit, ring, shadowed, D, L, dots, part, turn, chain, thin, hook, rusty, drip, pool, bars, cloud, star };

  for (const f of ['h1', 'h2', 'h3', 'h4', 'd1', 'd2', 'd3', 'd4']) {
    let m;
    try {
      m = require('./_env-dark-' + f + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_env-dark-/.test(e.message)) continue;
      throw e;
    }
    m(H, f[0] === 'h' ? maker('env-horror', 'Horror') : maker('env-dream', 'Dream world'));
  }
  return out;
};
