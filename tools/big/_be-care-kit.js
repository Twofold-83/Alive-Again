/*
 * Helpers for the creatures of be-care.js (hospital, toilet, basement, attic): a moved view of a canvas, limbs,
 * tubes, hands, eyes, jaws, a figure in the doll's proportions, small vermin.
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const vd = (col) => mix(col, 0.42);

  /* colours of our own */
  const P = {
    PALE: hex('#cfc3b0'),
    DEAD: hex('#a9ad9f'),
    SICK: hex('#93a07c'),
    BRUISE: hex('#6a5278'),
    RAW: hex('#b98a86'),
    GUM: hex('#8a4a52'),
    GOWN: hex('#9db3ad'),
    SCRUB: hex('#5f8a84'),
    COAT: hex('#d6d2c2'),
    EYE: hex('#ece6c4'),
    YEL: hex('#d9c04a'),
    RED: hex('#d2392c'),
    MOULD: hex('#44503c'),
    WETC: hex('#56727a'),
    PORC: hex('#dcd6c6'),
    DUST: hex('#a89f8c'),
    WEB: hex('#bdbbb0'),
    SOOT: hex('#2a2630'),
    HAIR: hex('#231d24'),
    TOOTH: hex('#e6dfc4'),
    SHADOW: hex('#1a1820'),
    FUR: hex('#57525a'),
    BRICK: hex('#7a4636'),
    ENAMEL: hex('#d2d0c4'),
    SLIME: hex('#8a9a5a'),
  };

  /** A view of a canvas moved by dx, dy. */
  function at(c, dx, dy) {
    if (!dx && !dy) return c;
    const g = {
      w: c.w,
      h: c.h,
      base: c.base || c,
      ox: (c.ox || 0) + dx,
      oy: (c.oy || 0) + dy,
      set: (x, y, col) => c.set(x + dx, y + dy, col),
      get: (x, y) => c.get(Math.round(x + dx), Math.round(y + dy)),
      clear: (x, y) => c.clear(Math.round(x + dx), Math.round(y + dy)),
      clearRect: (a, b, d, e) => c.clearRect(a + dx, b + dy, d + dx, e + dy),
      rect: (a, b, d, e, col) => c.rect(a + dx, b + dy, d + dx, e + dy, col),
      box: (a, b, d, e, col) => c.box(a + dx, b + dy, d + dx, e + dy, col),
      frame: (a, b, d, e, col) => c.frame(a + dx, b + dy, d + dx, e + dy, col),
      row: (y, a, b, col) => c.row(y + dy, a + dx, b + dx, col),
      col: (x, a, b, col) => c.col(x + dx, a + dy, b + dy, col),
      line: (a, b, d, e, col) => c.line(a + dx, b + dy, d + dx, e + dy, col),
      oval: (a, b, d, e, col) => c.oval(a + dx, b + dy, d + dx, e + dy, col),
      poly: (pp, col) => c.poly(pp.map((p) => [p[0] + dx, p[1] + dy]), col),
      speckle: (a, b, d, e, col, n, s) => c.speckle(a + dx, b + dy, d + dx, e + dy, col, n, s),
      dither: (a, b, d, e, col) => c.dither(a + dx, b + dy, d + dx, e + dy, col),
      stamp: (o, x, y, f) => c.stamp(o, x + dx, y + dy, f),
    };
    return g;
  }
  /** A mirrored view: x -> m - x. */
  function flip(g, m) {
    return {
      set: (x, y, col) => g.set(m - x, y, col),
      get: (x, y) => g.get(m - x, y),
      clear: (x, y) => g.clear(m - x, y),
      clearRect: (a, b, d, e) => g.clearRect(m - d, b, m - a, e),
      rect: (a, b, d, e, col) => g.rect(m - d, b, m - a, e, col),
      box: (a, b, d, e, col) => g.box(m - d, b, m - a, e, col),
      frame: (a, b, d, e, col) => g.frame(m - d, b, m - a, e, col),
      row: (y, a, b, col) => g.row(y, m - b, m - a, col),
      col: (x, a, b, col) => g.col(m - x, a, b, col),
      line: (a, b, d, e, col) => g.line(m - a, b, m - d, e, col),
      oval: (a, b, d, e, col) => g.oval(m - d, b, m - a, e, col),
      poly: (pp, col) => g.poly(pp.map((p) => [m - p[0], p[1]]), col),
      speckle: (a, b, d, e, col, n, s) => g.speckle(m - d, b, m - a, e, col, n, s),
      dither: (a, b, d, e, col) => g.dither(m - d, b, m - a, e, col),
    };
  }
  const pts = (c, list, col) => {
    for (const [x, y] of list) c.set(x, y, col);
  };
  /** Both sides of a symmetric thing: fn(view) once as drawn and once mirrored about m. */
  const both = (c, m, fn) => {
    fn(c, 1);
    fn(flip(c, m), -1);
  };

  /* ---------- lines, tubes, limbs ---------- */
  /** A smooth path through the points (Catmull-Rom), n steps per span. */
  function curve(p, n = 6) {
    const out = [];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[Math.max(0, i - 1)],
        b = p[i],
        d = p[i + 1],
        e = p[Math.min(p.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const t = k / n,
          t2 = t * t,
          t3 = t2 * t;
        out.push([
          0.5 * (2 * b[0] + (-a[0] + d[0]) * t + (2 * a[0] - 5 * b[0] + 4 * d[0] - e[0]) * t2 + (-a[0] + 3 * b[0] - 3 * d[0] + e[0]) * t3),
          0.5 * (2 * b[1] + (-a[1] + d[1]) * t + (2 * a[1] - 5 * b[1] + 4 * d[1] - e[1]) * t2 + (-a[1] + 3 * b[1] - 3 * d[1] + e[1]) * t3),
        ]);
      }
    }
    out.push(p[p.length - 1]);
    return out;
  }
  function disc(c, x, y, r, col) {
    if (r < 0.75) return c.set(x, y, col);
    const n = Math.ceil(r);
    for (let j = -n; j <= n; j++) for (let i = -n; i <= n; i++) if (i * i + j * j <= r * r + 0.3) c.set(x + i, y + j, col);
  }
  /** A tube along a path, r0 thick at the start and r1 at the end, lit from the upper left. */
  function tube(c, path, r0, r1, col, o = {}) {
    const n = path.length - 1 || 1;
    path.forEach(([x, y], i) => disc(c, x, y, r0 + ((r1 - r0) * i) / n, col));
    if (o.hi !== false && r0 >= 1.4)
      path.forEach(([x, y], i) => {
        const r = r0 + ((r1 - r0) * i) / n;
        if (r >= 1.2) {
          c.set(x - r * 0.5, y - r * 0.6, o.hi || lite(col));
          c.set(x + r * 0.5, y + r * 0.7, o.lo || dark(col));
        }
      });
  }
  /** A tentacle or worm: a smooth tube through points. */
  const worm = (c, p, r0, r1, col, o) => tube(c, curve(p, 8), r0, r1, col, o);
  /** A thin jointed limb through the points; w 1 or 2 pixels thick. */
  function limb(c, p, col, w = 1) {
    for (let i = 0; i < p.length - 1; i++) {
      const [a, b] = p[i],
        [d, e] = p[i + 1];
      c.line(a, b, d, e, col);
      if (w > 1) {
        if (Math.abs(d - a) >= Math.abs(e - b)) c.line(a, b + 1, d, e + 1, dark(col));
        else c.line(a + 1, b, d + 1, e, dark(col));
      }
    }
  }
  /** A hand at x, y: a small palm and n fingers pointing dir ('d', 'u', 'l', 'r'), len long. */
  function hand(c, x, y, dir, col, len = 2, n = 3) {
    const v = dir === 'd' || dir === 'u',
      s = dir === 'd' || dir === 'r' ? 1 : -1;
    for (let i = 0; i < n; i++) {
      const k = (i - (n - 1) / 2) * 2;
      for (let j = 0; j <= len; j++) {
        const sp = j === len && Math.abs(k) > 1 ? Math.sign(k) : 0;
        if (v) c.set(x + k + sp, y + s * j, col);
        else c.set(x + s * j, y + k + sp, col);
      }
    }
    if (v) c.row(y, x - (n - 1), x + (n - 1), col);
    else c.col(x, y - (n - 1), y + (n - 1), col);
  }
  /** Fingers gripping an edge: from x0 to x1 every other pixel, len long, pointing down (dir 1) or up (-1). */
  function fingers(c, x0, x1, y, len, col, dir = 1) {
    for (let x = x0; x <= x1; x += 2) {
      c.col(x, Math.min(y, y + dir * (len - 1)), Math.max(y, y + dir * (len - 1)), col);
      c.set(x, y + dir * (len - 1), dark(col));
    }
  }
  /** Pairs of jointed legs on both sides of cx, cy, down to the floor yf. */
  function spiderLegs(c, cx, cy, o = {}) {
    const n = o.n || 4,
      col = o.col || P.SOOT,
      yf = o.yf,
      kh = o.kh == null ? 5 : o.kh,
      reach = o.reach || 6,
      step = o.step || 3,
      w = o.w || 1,
      b = o.body || 2;
    for (let i = 0; i < n; i++) {
      for (const s of [-1, 1]) {
        const kx = cx + s * (b + reach * 0.55 + i * step * 0.7),
          ky = cy - kh + i * (o.kd == null ? 1 : o.kd),
          fx = cx + s * (b + reach + i * step);
        limb(c, [[cx + s * b, cy + (i - n / 2) * (o.sy || 0.6)], [kx, ky], [fx, yf]], s < 0 ? col : dark(col), w);
        if (o.foot) c.set(fx + s, yf, o.foot);
      }
    }
  }

  /* ---------- faces ---------- */
  /** A lit eye: a white with a pupil, w wide (1: just a bright dot). */
  function eye(c, x, y, w = 2, iris = K, white = P.EYE) {
    if (w <= 1) return c.set(x, y, white);
    c.rect(x, y, x + w - 1, y + (w > 2 ? 1 : 0), white);
    c.set(x + (w > 2 ? 1 : w - 1), y + (w > 2 ? 1 : 0), iris);
  }
  /** A round staring eye of radius r with a dark rim. */
  function orb(c, x, y, r, iris = K, white = P.EYE) {
    disc(c, x, y, r + 0.6, K);
    disc(c, x, y, r - 0.3, white);
    c.set(x, y, iris);
    if (r >= 2) c.rect(x, y, x + 1, y + 1, iris);
  }
  /** Teeth along a row: every other pixel (or each, step 1). */
  function teeth(c, x0, x1, y, col = P.TOOTH, step = 2, off = 0) {
    for (let x = x0 + off; x <= x1; x += step) c.set(x, y, col);
  }
  /** An open mouth: a dark hole with teeth at top and bottom, a tongue if asked. */
  function maw(c, x0, y0, x1, y1, o = {}) {
    if (o.round) c.oval(x0, y0, x1, y1, o.col || K);
    else c.rect(x0, y0, x1, y1, o.col || K);
    const t = o.teeth || P.TOOTH,
      i = o.round ? 1 : 0;
    if (o.top !== false) teeth(c, x0 + i, x1 - i, y0, t, o.step || 2);
    if (o.bottom !== false && y1 > y0) teeth(c, x0 + i, x1 - i, y1, t, o.step || 2, 1);
    if (o.long) {
      for (let x = x0 + i; x <= x1 - i; x += 4) c.set(x, y0 + 1, t);
      for (let x = x0 + i + 1; x <= x1 - i; x += 4) c.set(x, y1 - 1, t);
    }
    if (o.tongue) c.rect(((x0 + x1) >> 1) - 1, y1 - 1, ((x0 + x1) >> 1) + 1, y1 - 1, o.tongue);
  }
  /** The doll's face: 8 wide, 9 tall, its top-left corner at x, y. */
  function face(g, x, y, skin, kind = 'calm', e = K) {
    g.row(y, x + 1, x + 6, skin);
    g.rect(x, y + 1, x + 7, y + 6, skin);
    g.row(y + 7, x + 1, x + 6, skin);
    g.row(y + 8, x + 2, x + 5, skin);
    g.col(x + 7, y + 2, y + 5, dark(skin));
    g.set(x + 6, y + 7, dark(skin));
    g.set(x, y + 1, lite(skin));
    g.set(x + 1, y, lite(skin));
    const F = {
      none() {},
      calm() {
        pts(g, [[x + 2, y + 3], [x + 5, y + 3]], e);
        g.row(y + 6, x + 3, x + 4, vd(skin));
      },
      stare() {
        pts(g, [[x + 1, y + 3], [x + 5, y + 3]], C.white);
        pts(g, [[x + 2, y + 3], [x + 6, y + 3]], e);
        g.row(y + 6, x + 3, x + 4, vd(skin));
      },
      hollow() {
        g.rect(x + 1, y + 2, x + 2, y + 3, e);
        g.rect(x + 5, y + 2, x + 6, y + 3, e);
        g.row(y + 6, x + 3, x + 4, vd(skin));
      },
      scream() {
        g.rect(x + 1, y + 2, x + 2, y + 3, e);
        g.rect(x + 5, y + 2, x + 6, y + 3, e);
        g.rect(x + 3, y + 5, x + 4, y + 8, K);
      },
      grin() {
        pts(g, [[x + 2, y + 3], [x + 5, y + 3]], e);
        g.row(y + 6, x + 1, x + 6, K);
        teeth(g, x + 2, x + 5, y + 6, P.TOOTH, 1);
        pts(g, [[x + 1, y + 5], [x + 6, y + 5]], K);
      },
      jaws() {
        g.rect(x + 1, y + 2, x + 2, y + 3, K);
        g.rect(x + 5, y + 2, x + 6, y + 3, K);
        pts(g, [[x + 2, y + 3], [x + 5, y + 3]], e);
        maw(g, x + 1, y + 5, x + 6, y + 8, {});
      },
      dead() {
        pts(g, [[x + 1, y + 3], [x + 2, y + 3], [x + 5, y + 3], [x + 6, y + 3]], K);
        g.row(y + 6, x + 3, x + 5, vd(skin));
      },
      blank() {},
      sewn() {
        pts(g, [[x + 1, y + 3], [x + 2, y + 3], [x + 5, y + 3], [x + 6, y + 3]], K);
        g.row(y + 6, x + 2, x + 5, vd(skin));
        pts(g, [[x + 2, y + 5], [x + 4, y + 5], [x + 3, y + 7], [x + 5, y + 7]], K);
      },
    };
    (F[kind] || F.calm)();
  }
  function skull(g, x, y, col = C.bone, e = K) {
    face(g, x, y, col, 'none');
    g.rect(x + 1, y + 2, x + 2, y + 4, e);
    g.rect(x + 5, y + 2, x + 6, y + 4, e);
    pts(g, [[x + 3, y + 5], [x + 4, y + 5]], vd(col));
    g.row(y + 7, x + 1, x + 6, dark(col));
    pts(g, [[x + 2, y + 7], [x + 4, y + 7], [x + 6, y + 7], [x + 3, y + 8], [x + 5, y + 8]], vd(col));
    g.clear(x, y + 6);
    g.clear(x + 7, y + 6);
  }
  const HAIRS = {
    crop(g, h) {
      g.row(2, 5, 10, h);
      g.row(3, 4, 11, h);
      g.set(4, 4, h);
      g.set(11, 4, dark(h));
    },
    thin(g, h) {
      g.col(4, 3, 6, h);
      g.col(11, 3, 6, dark(h));
      pts(g, [[3, 5], [6, 2], [9, 2]], h);
    },
    long(g, h, n = 15) {
      g.row(1, 5, 10, h);
      g.row(2, 4, 11, h);
      g.row(3, 3, 12, h);
      g.col(3, 4, n, h);
      g.col(12, 4, n, dark(h));
      g.col(4, 4, 6, h);
      g.set(11, 4, dark(h));
    },
    bun(g, h) {
      HAIRS.crop(g, h);
      g.rect(7, 0, 8, 1, h);
      g.set(4, 5, h);
      g.set(11, 5, dark(h));
    },
    wild(g, h) {
      HAIRS.long(g, h, 10);
      pts(g, [[2, 2], [4, 0], [7, 0], [10, 0], [13, 3], [2, 6], [13, 7], [2, 10]], h);
    },
    cap(g, h) {
      g.row(1, 5, 10, h);
      g.rect(4, 2, 11, 3, h);
      g.row(1, 6, 8, lite(h));
      g.row(4, 4, 11, dark(h));
    },
  };
  function arm(g, pose, yT, tl, slv, hnd, al = 0) {
    const b = yT + tl + al;
    if (pose === 'down') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, b - 2, slv);
      g.rect(1, b - 1, 3, b, hnd);
      g.set(1, yT + 1, lite(slv));
      if (al > 2) pts(g, [[1, b + 1], [3, b + 1], [1, b + 2], [3, b + 2]], hnd);
    } else if (pose === 'fwd') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, yT + 4, slv);
      g.row(yT + 4, 1, 3, dark(slv));
      g.rect(1, yT + 5, 3, yT + 7, hnd);
      pts(g, [[1, yT + 8], [3, yT + 8]], hnd);
      g.set(2, yT + 6, dark(hnd));
    } else if (pose === 'up') {
      g.rect(1, yT, 3, yT + 2, slv);
      g.rect(0, yT - 5, 2, yT, slv);
      g.rect(-1, yT - 8 - al, 1, yT - 5, slv);
      g.rect(-1, yT - 10 - al, 1, yT - 9 - al, hnd);
      pts(g, [[-2, yT - 11 - al], [0, yT - 11 - al], [2, yT - 10 - al]], hnd);
    } else if (pose === 'out') {
      g.rect(-2 - al, yT + 1, 3, yT + 3, slv);
      g.row(yT + 3, -2 - al, 3, dark(slv));
      g.rect(-4 - al, yT + 1, -3 - al, yT + 3, hnd);
      pts(g, [[-5 - al, yT], [-5 - al, yT + 2], [-5 - al, yT + 4]], hnd);
    } else if (pose === 'reach') {
      g.rect(1, yT, 3, yT + 2, slv);
      g.rect(-1, yT + 2, 2, yT + 4, slv);
      g.rect(-3 - al, yT + 4, 0, yT + 6, slv);
      g.rect(-5 - al, yT + 5, -3 - al, yT + 7, hnd);
      pts(g, [[-6 - al, yT + 5], [-6 - al, yT + 7], [-5 - al, yT + 8]], hnd);
    } else if (pose === 'hold') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, yT + 5, slv);
      g.rect(2, yT + 5, 5, yT + 6, slv);
      g.row(yT + 6, 2, 5, dark(slv));
      g.rect(6, yT + 4, 7, yT + 6, hnd);
    }
  }
  /**
   * A figure in the doll's proportions with its 16 x 33 box at x, y: head rows 3..11, torso from row 12 (tl long),
   * legs ll long. Raised or stretched arms go outside the box. Returns { yT, yL, yF } in canvas coordinates.
   */
  function fig(c, x, y, o = {}) {
    const g = at(c, x, y),
      skin = o.skin || C.flesh,
      top = o.top || C.slate,
      slv = o.sleeve || top,
      leg = o.legs || C.black,
      shoe = o.shoe || C.night,
      hnd = o.hand || skin,
      tl = o.tl || 10,
      ll = o.ll == null ? 10 : o.ll,
      yT = 12,
      yL = yT + tl,
      yF = yL + ll - 1;
    const poses = typeof o.arms === 'object' ? o.arms : { l: o.arms || 'down', r: o.arms || 'down' };
    if (o.robe) {
      const r = o.robe;
      g.rect(4, yL, 11, yF, r);
      if (ll > 5) g.rect(3, yL + 3, 12, yF, r);
      g.col(6, yL + 1, yF, dark(r));
      g.col(9, yL + 3, yF, dark(r));
      g.col(3, yL + 3, yF, lite(r));
      g.row(yF, 3, 12, dark(r));
    } else if (o.legs !== false && ll > 0) {
      g.rect(4, yL, 11, yF, leg);
      g.col(4, yL, yF - 2, lite(leg));
      g.col(7, yL + 1, yF, vd(leg));
      if (o.shoe !== false) {
        g.rect(4, yF - 1, 6, yF, shoe);
        g.rect(8, yF - 1, 11, yF, shoe);
        g.set(3, yF, shoe);
        g.set(12, yF, shoe);
      }
    }
    g.rect(5, yT, 10, yL - 1, top);
    g.row(yT, 4, 11, top);
    g.col(5, yT + 1, yL - 1, lite(top));
    if (o.coat) {
      g.rect(4, yL, 11, yL + (o.coatLen || 5), o.coat);
      g.col(7, yL + 1, yL + (o.coatLen || 5), vd(o.coat));
      g.col(4, yL, yL + (o.coatLen || 5), lite(o.coat));
    }
    if (o.head !== false) g.rect(7, yT, 8, yT, dark(skin));
    if (o.shirt) {
      g.rect(7, yT, 8, yT + 4, o.shirt);
      pts(g, [[6, yT], [9, yT]], o.shirt);
    }
    if (o.apron) {
      g.rect(5, yT + 3, 10, yL + 4, o.apron);
      g.rect(6, yT + 1, 9, yT + 2, o.apron);
    }
    if (o.belt) g.row(yL - 1, 5, 10, o.belt);
    if (o.body) o.body(g, yT, yL, yF);
    for (const [pose, v] of [
      [poses.l, g],
      [poses.r, flip(g, 15)],
    ]) {
      if (pose === 'down') v.col(4, yT + 1, yL - 1, vd(slv));
      arm(v, pose, yT, tl, slv, hnd, o.al || 0);
    }
    if (o.head !== false) {
      const h = at(g, o.hx || 0, o.hy || 0);
      if (o.face === 'skull') skull(h, 4, 3, skin, o.eye || K);
      else face(h, 4, 3, skin, o.face || 'calm', o.eye || K);
      if (o.hair) (HAIRS[o.hair] || HAIRS.crop)(h, o.hairCol || P.HAIR, o.hairLen);
    }
    return { yT: y + yT, yL: y + yL, yF: y + yF };
  }

  /* ---------- surfaces ---------- */
  /** Light from the left on what is drawn in the box: left edges lighter, bottom edges darker. */
  function vol(c, x0, y0, x1, y1, kl = 1.2, kd = 0.74) {
    const hi = [],
      lo = [];
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const p = c.get(x, y);
        if (!p || p === K) continue;
        if (!c.get(x - 1, y) || (!c.get(x, y - 1) && !c.get(x - 1, y - 1))) hi.push([x, y, p]);
        else if (!c.get(x, y + 1) || !c.get(x + 1, y)) lo.push([x, y, p]);
      }
    for (const [x, y, p] of hi) c.set(x, y, mix(p, kl));
    for (const [x, y, p] of lo) c.set(x, y, mix(p, kd));
  }
  /** A lumpy mass: an ellipse with a wobbling edge. */
  function blob(c, cx, cy, rx, ry, col, seed = 1, wob = 0.18) {
    const r = rnd(seed),
      k = [r() * 6, r() * 6, 2 + Math.floor(r() * 3), 4 + Math.floor(r() * 3)];
    for (let y = Math.floor(cy - ry - 2); y <= cy + ry + 2; y++)
      for (let x = Math.floor(cx - rx - 2); x <= cx + rx + 2; x++) {
        const a = Math.atan2((y - cy) / ry, (x - cx) / rx),
          d = Math.hypot((x - cx) / rx, (y - cy) / ry),
          lim = 1 + wob * (Math.sin(a * k[2] + k[0]) * 0.6 + Math.sin(a * k[3] + k[1]) * 0.4);
        if (d <= lim) c.set(x, y, col);
      }
  }
  /** Bites out of the bottom edge between x0 and x1: a ragged hem. */
  function ragged(c, x0, x1, y1, depth = 3, seed = 3) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) {
      const d = Math.floor(r() * (depth + 1));
      for (let y = y1; y > y1 - d; y--) c.clear(x, y);
    }
  }
  /** The rows y0..y1 dissolve downwards into nothing. */
  function fade(c, x0, x1, y0, y1) {
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const t = (y - y0) / Math.max(1, y1 - y0);
        if ((x + y) % 2 === 0 || (t > 0.6 && x % 2 === 0) || (t > 0.85 && (x + y) % 4 !== 1)) c.clear(x, y);
      }
  }
  /** A small dark shadow under something that floats. */
  const shadow = (c, x0, x1, y) => c.row(y, x0, x1, P.SHADOW);
  /** Drops running down from a point. */
  function drip(c, x, y, len, col) {
    c.col(x, y, y + len - 1, col);
    c.set(x, y + len - 1, dark(col));
  }
  /** Horizontal wrappings over what is drawn in the box (bandages, string). */
  function wraps(c, x0, y0, x1, y1, col, step = 3) {
    for (let y = y0; y <= y1; y += step) for (let x = x0; x <= x1; x++) if (c.get(x, y) && c.get(x, y) !== K) c.set(x, y + ((x >> 2) & 1 ? 0 : 0), col);
  }
  /** Change every pixel of the box that is drawn: fn(colour, x, y) -> colour. */
  function tint(c, x0, y0, x1, y1, fn) {
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const p = c.get(x, y);
        if (p) c.set(x, y, fn(p, x, y) || p);
      }
  }
  /** A stitched seam from a to b with cross ticks. */
  function seam(c, x0, y0, x1, y1, col = K) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1,
      v = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n),
        y = Math.round(y0 + ((y1 - y0) * i) / n);
      c.set(x, y, col);
      if (i % 2 === 0) {
        if (v) {
          c.set(x - 1, y, col);
          c.set(x + 1, y, col);
        } else {
          c.set(x, y - 1, col);
          c.set(x, y + 1, col);
        }
      }
    }
  }
  /** A rib cage: n ribs between x0 and x1 from y0 down, every other row. */
  function ribs(c, x0, x1, y0, n, col) {
    const m = (x0 + x1) >> 1;
    for (let i = 0; i < n; i++) {
      c.row(y0 + i * 2, x0 + (i === n - 1 ? 1 : 0), x1 - (i === n - 1 ? 1 : 0), col);
      c.set(x1 - (i === n - 1 ? 1 : 0), y0 + i * 2, dark(col));
    }
    c.col(m, y0, y0 + n * 2 - 1, dark(col));
  }

  /* ---------- vermin ---------- */
  /** A rat about 10 x 5 with its nose to the right (flipped: to the left), standing on row y. */
  function rat(c, x, y, f = false, col = P.FUR, eyec = P.RED) {
    const g = f ? flip(at(c, x, y), 0) : at(c, x, y);
    g.rect(0, -3, 5, -1, col);
    g.row(-4, 1, 4, col);
    g.rect(5, -3, 7, -1, col);
    g.set(8, -1, hex('#b98a86'));
    g.set(6, -4, hex('#b98a86'));
    g.set(6, -2, eyec);
    g.row(-4, 1, 3, lite(col));
    pts(g, [[1, 0], [5, 0]], hex('#b98a86'));
    g.line(-1, -1, -4, -2, hex('#b98a86'));
  }
  /** A bat seen from the front, wings span wide. */
  function bat(c, cx, cy, span, col, o = {}) {
    const h = span / 2,
      d = o.droop || 0;
    both(at(c, cx, cy), 0, (v) => {
      v.poly([[0, -1], [h * 0.5, -2 - d * -1], [h, d], [h * 0.75, 2 + d], [h * 0.5, 1], [h * 0.25, 3], [0, 2]], o.mem || lite(col));
      v.line(0, -1, h * 0.5, -2 + d, col);
      v.line(h * 0.5, -2 + d, h, d, col);
    });
    c.rect(cx - 1, cy - 2, cx, cy + 2, col);
    pts(c, [[cx - 2, cy - 3], [cx + 1, cy - 3]], col);
    if (o.eye) pts(c, [[cx - 1, cy - 1], [cx, cy - 1]], o.eye);
  }
  /** A moth from above: wings w wide in all, at cx, cy. */
  function moth(c, cx, cy, w, col, o = {}) {
    const h = w / 2;
    both(at(c, cx, cy), 0, (v) => {
      v.poly([[0, -1], [h, -h * 0.7], [h, 0], [1, 1]], col);
      v.poly([[0, 1], [h * 0.7, 1], [h * 0.6, h * 0.6], [1, h * 0.5]], o.low || dark(col));
      if (o.spot && h >= 3) v.set(h * 0.6, -h * 0.3, o.spot);
    });
    c.col(cx, cy - 1, cy + Math.max(1, Math.round(h * 0.5)), o.body || vd(col));
  }
  /** Sparks or motes: scattered single pixels. */
  function motes(c, x0, y0, x1, y1, n, col, seed = 5) {
    const r = rnd(seed);
    for (let i = 0; i < n; i++) c.set(x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), col);
  }

  return { P, vd, at, flip, pts, both, curve, disc, tube, worm, limb, hand, fingers, spiderLegs, eye, orb, teeth, maw, face, skull, HAIRS, arm, fig, vol, blob, ragged, fade, shadow, drip, wraps, tint, seam, ribs, rat, bat, moth, motes };
};
