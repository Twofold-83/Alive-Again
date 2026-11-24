/*
 * Two settings of the mind at paper-doll scale, every thing with its four pictures (main, the other perspective,
 * and both after someone used it):
 *   env-dream     more of the dream world: gentle, strange things standing in fields, shallow water and sky
 *   env-surreal   the painters' impossible objects: apples, bowler hats, soft clocks, sky where a wall should be
 * The things themselves are in _env2-dream-*.js. Each is written as one or two functions f(c, used) and
 * s(c, used): the main picture and the other perspective, drawn fresh for the unused and the used state. A function
 * may return another function, which is run after the picture got its shading and outline (sparks, light, drips).
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const out = {};
  const add = (slug, cat, catLabel, name, def) => {
    if (out[slug]) throw new Error('env2-dream: ' + slug + ' twice');
    out[slug] = { cat, catLabel, name, ...def };
  };
  /** Run fn with the canvas's coordinates moved by dx, dy (a used picture on a larger canvas). */
  const shifted = (c, dx, dy, fn) => {
    if (!dx && !dy) return fn();
    const { set, get, clear } = c;
    c.set = (x, y, col) => set(Math.round(x) + dx, Math.round(y) + dy, col);
    c.get = (x, y) => get(x + dx, y + dy);
    c.clear = (x, y) => clear(x + dx, y + dy);
    try {
      return fn();
    } finally {
      c.set = set;
      c.get = get;
      c.clear = clear;
    }
  };
  /**
   * maker(cat, label)(slug, name, o) with o = {
   *   w, h, f(c, used)          the main picture
   *   sw, sh, s(c, used)        the other perspective (s: 'same' for round things: the main picture again)
   *   uw, uh, udx, udy          another canvas size for the used picture; the drawing is moved by udx, udy
   *                             (by default it stays on the bottom row, left)
   *   suw, suh, sudx, sudy      the same for the other perspective
   *   base: 'side'              the main picture is the long side
   *   solid: false, shade: false, outline: false }
   */
  const maker = (cat, label) => (slug, name, o) => {
    const wrap = (fn, u, dx, dy) => (c) => {
      const after = shifted(c, dx, dy, () => fn(c, u));
      if (o.shade !== false) c.shade();
      if (o.outline !== false) c.outline();
      if (typeof after === 'function') shifted(c, dx, dy, after);
      return false;
    };
    const s = o.s === 'same' ? o.f : o.s,
      sw = o.s === 'same' ? o.w : o.sw,
      sh = o.s === 'same' ? o.h : o.sh || o.h;
    const uw = o.uw || o.w,
      uh = o.uh || o.h,
      suw = o.suw || (o.s === 'same' ? uw : sw),
      suh = o.suh || (o.s === 'same' ? uh : sh);
    const views = {};
    if (o.base) views.base = o.base;
    if (s) views.side = { w: sw, h: sh, draw: wrap(s, false, 0, 0) };
    views.used = { w: uw, h: uh, draw: wrap(o.f, true, o.udx || 0, o.udy == null ? uh - o.h : o.udy) };
    if (s) {
      const dx = o.s === 'same' ? o.udx || 0 : o.sudx || 0,
        dy = o.s === 'same' ? (o.udy == null ? uh - o.h : o.udy) : o.sudy == null ? suh - sh : o.sudy;
      views.sideUsed = { w: suw, h: suh, draw: wrap(s, true, dx, dy) };
    }
    add(slug, cat, label, name, { w: o.w, h: o.h, solid: o.solid !== false, draw: wrap(o.f, false, 0, 0), views });
  };

  /* ---------- shared helpers ---------- */
  const D = dark,
    L = lite;
  const P = {
    CLD: hex('#cfcdc6'),
    NI: C.night,
    SKY: hex('#27304e'), // the night sky
    DAY: hex('#7d9ab0'), // the painters' day sky
    DAYl: hex('#a9bfc8'),
    MOON: hex('#e0d8a8'),
    MOONd: hex('#b3a877'),
    OUT: hex('#4a5068'),
    LILAC: hex('#8a7a9c'),
    ROSE: hex('#b08a8f'),
    DBLUE: hex('#5a6a84'),
    PORC: hex('#d6d0be'),
    GRASS: hex('#55684a'),
    GRASSd: hex('#3e5040'),
    SEA: hex('#3f6474'),
    SEAl: hex('#6f95a0'),
    SAND: hex('#b8a47c'),
    APPLE: hex('#6f8a45'),
    FELT: hex('#2a2830'), // bowler hats and overcoats
    PLASTER: hex('#c9c2b0'),
    LOBSTER: hex('#b0503a'),
    GIR: hex('#b98f4a'), // giraffe
    BRICK: hex('#8a5444'),
    PINK: hex('#b7868a'),
  };
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
  /** A thin chain or cord of two tones. */
  function thin(c, x, y0, y1, col = C.iron) {
    for (let y = y0; y <= y1; y++) c.set(x, y, (y - y0) % 2 ? D(col) : col);
  }
  /** A puffy cloud in the box. */
  function cloud(c, x0, y0, x1, y1, col = P.CLD, seed = 1) {
    const r = rnd(seed),
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
  /** Tufts of grass standing on row b. */
  function grass(c, x0, x1, b, seed = 1, col = P.GRASS) {
    const r = rnd(seed + x0);
    c.row(b, x0, x1, P.GRASSd);
    for (let x = x0; x <= x1; x++) {
      const k = r();
      if (k < 0.55) c.set(x, b - 1, col);
      if (k < 0.2) c.set(x, b - 2, L(col));
      if (k > 0.93) c.set(x, b - 1, P.GRASSd);
    }
  }
  /** Shallow water in the box, with a light line on top and short ripples. */
  function water(c, x0, y0, x1, y1, col = P.SEA, seed = 1) {
    const r = rnd(seed + y0);
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    for (let y = y0 + 1; y <= y1; y++)
      for (let x = x0 + 1; x < x1 - 1; x++)
        if (r() < 0.12) {
          c.set(x, y, P.SEAl);
          c.set(x + 1, y, P.SEAl);
          x += 3;
        }
  }
  /** Change every pixel of one colour in the box: fn(x, y) gives the new colour (sky inside a shape). */
  function repaint(c, x0, y0, x1, y1, from, fn) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (c.get(x, y) === from) c.set(x, y, fn(x, y));
  }
  /** A night sky with stars: returns the colour at x, y. */
  const nightAt = (seed = 1) => (x, y) => {
    const v = (x * 7 + y * 13 + seed * 5 + ((x * y) % 5) * 3) % 31;
    return v === 0 ? P.MOON : v === 11 && (x + y) % 2 ? C.white : P.SKY;
  };
  /** A blue day sky with small flat clouds: returns the colour at x, y. */
  const dayAt = (seed = 1) => (x, y) => {
    const yy = y + seed * 3,
      band = Math.floor(yy / 6),
      off = ((band * 7 + seed * 3) % 11) - 3,
      xx = (((x + off) % 12) + 12) % 12,
      k = yy % 6;
    if (k === 2 && xx >= 2 && xx <= 4) return C.white;
    if (k === 3 && xx >= 1 && xx <= 6) return C.white;
    if (k === 4 && xx >= 2 && xx <= 6) return P.DAYl;
    return P.DAY;
  };
  function night(c, x0, y0, x1, y1, seed = 1) {
    const f = nightAt(seed);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, f(x, y));
  }
  function day(c, x0, y0, x1, y1, seed = 1) {
    const f = dayAt(seed);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, f(x, y));
  }
  /** A spoked wheel. */
  function wheel(c, cx, cy, r, rim = C.woodDark, hub = C.iron, spoke) {
    c.oval(cx - r, cy - r, cx + r, cy + r, rim);
    if (r > 2) c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, spoke ? null : D(rim));
    if (spoke && r > 2) {
      for (let y = cy - r + 1; y <= cy + r - 1; y++) for (let x = cx - r + 1; x <= cx + r - 1; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= (r - 0.6) ** 2) c.clear(x, y);
      c.line(cx - r, cy, cx + r, cy, spoke);
      c.line(cx, cy - r, cx, cy + r, spoke);
      if (r > 3) {
        const d = Math.round(r * 0.7);
        c.line(cx - d, cy - d, cx + d, cy + d, spoke);
        c.line(cx - d, cy + d, cx + d, cy - d, spoke);
      }
    }
    c.set(cx, cy, hub);
    if (r > 3) {
      c.set(cx - 1, cy, hub);
      c.set(cx + 1, cy, hub);
      c.set(cx, cy - 1, hub);
      c.set(cx, cy + 1, hub);
    }
  }
  /** A small flame standing on x, y (its foot), n high. */
  function flame(c, x, y, n = 3) {
    c.col(x, y - n + 1, y, C.flame);
    if (n > 2) {
      c.set(x - 1, y, C.flame);
      c.set(x + 1, y - 1, C.flame);
      c.col(x, y - n + 2, y, C.flameLight);
    } else c.set(x, y, C.flameLight);
  }
  /** A clock face with two hands (hours 0..12 as angles). */
  function clock(c, cx, cy, r, face = P.PORC, hA = 10, mA = 2, rim) {
    c.oval(cx - r, cy - r, cx + r, cy + r, rim || D(face));
    c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, face);
    if (r >= 4) for (let a = 0; a < 12; a += 3) c.set(cx + (r - 1.6) * Math.sin((a * Math.PI) / 6), cy - (r - 1.6) * Math.cos((a * Math.PI) / 6), D(face));
    const hand = (a, len) => c.line(cx, cy, cx + len * Math.sin((a * Math.PI) / 6), cy - len * Math.cos((a * Math.PI) / 6), P.NI);
    hand(mA, Math.max(1, r - 2));
    hand(hA, Math.max(1, r - 3));
  }
  /** A drawer front in the box with a knob. */
  function drawer(c, x0, y0, x1, y1, col, knob = C.brass) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.row(y1, x0, x1, D(col));
    c.col(x1, y0, y1, D(col));
    c.set((x0 + x1) >> 1, (y0 + y1) >> 1, knob);
  }
  /** A bowler hat, 9 wide and 6 high, its top-left corner at x, y. */
  function bowler(c, x, y, col = P.FELT) {
    c.rect(x + 2, y + 1, x + 6, y + 4, col);
    c.row(y, x + 3, x + 5, col);
    c.row(y + 4, x + 2, x + 6, hex('#4a4650'));
    c.row(y + 5, x, x + 8, col);
    c.set(x + 2, y + 1, L(L(col)));
    c.set(x + 3, y + 1, L(col));
  }
  /** A green apple in the box, stalk and leaf above it (two rows over y0). */
  function apple(c, x0, y0, x1, y1, col = P.APPLE) {
    const w = x1 - x0 + 1,
      m = (x0 + x1) >> 1;
    c.oval(x0, y0, x1, y1, col);
    c.rect(x0 + 1, y0 + Math.round((y1 - y0) * 0.25), x1 - 1, y1 - Math.round((y1 - y0) * 0.3), col);
    c.oval(x0, y0, x0 + Math.round(w * 0.6), y1, col);
    c.oval(x1 - Math.round(w * 0.6), y0, x1, y1, col);
    // light on the left, dark below and right
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        if (c.get(x, y) === col) {
          const dx = (x - x0) / w,
            dy = (y - y0) / (y1 - y0 + 1);
          if (dx + dy > 1.45) c.set(x, y, D(col));
          else if (dx < 0.34 && dy < 0.5 && dx + dy > 0.3 && dx + dy < 0.55) c.set(x, y, L(col));
        }
    c.set(m, y0, D(col));
    if (w > 6) {
      c.set(m - 1, y0, D(col));
      c.col(m, y0 - 2, y0, C.woodDark);
      c.set(m + 1, y0 - 2, P.GRASS);
      c.set(m + 2, y0 - 3, P.GRASS);
      if (w > 12) {
        c.set(m + 2, y0 - 2, P.GRASS);
        c.set(m + 3, y0 - 3, L(P.GRASS));
      }
    } else c.set(m, y0 - 1, C.woodDark);
  }
  /** An eye in the box: white, iris, pupil; closed = a lid with lashes. */
  function eye(c, x0, y0, x1, y1, iris = P.DBLUE, open = true, white = C.white) {
    const cx = (x0 + x1) / 2,
      cy = (y0 + y1) / 2,
      r = Math.max(1, Math.round((y1 - y0) / 2) - (y1 - y0 > 5 ? 1 : 0));
    c.oval(x0, y0, x1, y1, white);
    if (!open) {
      c.oval(x0, y0, x1, y1, P.PINK);
      c.line(x0, Math.round(cy) + 1, x1, Math.round(cy) + 1, D(P.PINK));
      for (let x = x0 + 1; x < x1; x += 2) c.set(x, Math.round(cy) + 2, P.NI);
      return;
    }
    c.oval(Math.round(cx - r), Math.round(cy - r), Math.round(cx + r), Math.round(cy + r), iris);
    const pr = Math.max(0, r - 2);
    c.oval(Math.round(cx - pr), Math.round(cy - pr), Math.round(cx + pr), Math.round(cy + pr), P.NI);
    c.set(Math.round(cx - r + 1), Math.round(cy - r + 1), C.white);
  }
  /** Music notes drifting up from x, y. */
  function notes(c, x, y, col = P.MOON) {
    dots(c, col, [x, y, x, y - 1, x, y - 2, x + 1, y - 2, x - 1, y, x + 4, y - 4, x + 4, y - 5, x + 4, y - 6, x + 3, y - 4, x + 5, y - 6]);
  }
  /** A mirrored copy of a part. */
  const flip = (t) => {
    const o = canvas(t.w, t.h);
    o.stamp(t, 0, 0, true);
    return o;
  };
  const H = { ...kit, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, dayAt, night, day, wheel, flame, clock, drawer, bowler, apple, eye, notes };

  for (const f of ['d1', 'd2', 'd3', 'd4', 'd5', 's1', 's2', 's3', 's4', 's5']) {
    let m;
    try {
      m = require('./_env2-dream-' + f + '.js');
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && /_env2-dream-/.test(e.message)) continue;
      throw e;
    }
    m(H, f[0] === 'd' ? maker('env-dream', 'Dream world') : maker('env-surreal', 'Surreal'));
  }
  return out;
};
