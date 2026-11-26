/*
 * Helpers for the creatures of be-old.js (Victorian, Old time, 1920's, Apothecary).
 * at(c, dx, dy) gives a view of a canvas moved by dx, dy (and mirrored with .flip(m)) that carries the drawing
 * helpers as methods: g.tube(), g.tent(), g.limb(), g.maw(), g.orb(), g.man() ...
 * maker() registers a creature from ONE drawing function fn(g, roused, c): the main picture and the roused one
 * (views.used, on a canvas of its own size, the figure standing on the same spot) come from the same code.
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const vd = (col) => mix(col, 0.42);
  const P = {
    BONE: C.bone,
    TOOTH: hex('#e6dfc4'),
    EYE: hex('#e8e2c0'),
    RED: hex('#d2392c'),
    YEL: hex('#d9c04a'),
    PALE: hex('#d6c2a6'),
    ASHEN: hex('#9aa29a'),
    DROWN: hex('#8fa6bb'),
    SICK: hex('#8a9a5a'),
    BRUISE: hex('#5d4274'),
    RAW: hex('#b98a86'),
    GUM: hex('#7a3040'),
    MAW: hex('#2a0f14'),
    NIGHT: C.night,
    GH: C.ghost,
    GHD: hex('#62757f'),
    GHL: hex('#dfe8e4'),
    SH: hex('#17151f'),
    SHL: hex('#2a2735'),
    PORC: hex('#dcd6c6'),
    WAX: hex('#d8c9a0'),
    VEIL: hex('#24222c'),
    FUR: hex('#7a5a3c'),
    HIDE: hex('#8a6a4a'),
    DUST: hex('#a89472'),
    SLIME: hex('#6f8a4e'),
    FISH: hex('#5f7f72'),
    TEN: hex('#5a4460'),
    SUCK: hex('#b08a98'),
  };

  /** Smooth a list of points into a curve. */
  const curve = (pts, n = 8) => {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)],
        p1 = pts[i],
        p2 = pts[i + 1],
        p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const t = k / n,
          f = (a, b, d, e) => 0.5 * (2 * b + (-a + d) * t + (2 * a - 5 * b + 4 * d - e) * t * t + (-a + 3 * b - 3 * d + e) * t * t * t);
        out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  };

  const H = {};
  H.pts = (g, list, col) => {
    for (const [x, y] of list) g.set(x, y, col);
  };
  /** A thick line that tapers from radius r0 to r1, lit from the top left. */
  H.tube = (g, pts, r0, r1, col, under) => {
    const segs = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      segs.push(d);
      total += d;
    }
    const pass = (colr, ox, oy, shrink) => {
      let run = 0;
      for (let i = 1; i < pts.length; i++) {
        const n = Math.ceil(segs[i - 1] * 2) || 1;
        for (let k = 0; k <= n; k++) {
          const t = (run + (segs[i - 1] * k) / n) / (total || 1),
            r = Math.max(0.5, r0 + (r1 - r0) * t - shrink),
            x = pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * k) / n + ox,
            y = pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * k) / n + oy;
          for (let yy = Math.floor(y - r); yy <= Math.ceil(y + r); yy++)
            for (let xx = Math.floor(x - r); xx <= Math.ceil(x + r); xx++) if ((xx - x) ** 2 + (yy - y) ** 2 <= r * r) g.set(xx, yy, colr);
        }
        run += segs[i - 1];
      }
    };
    pass(under || dark(col), 0, 0, 0);
    pass(col, -0.5, -0.5, 0.5);
  };
  /** A tentacle through the points: curved, tapering, with suckers if a colour for them is given. */
  H.tent = (g, pts, r0, col = P.TEN, suck, r1 = 0.6) => {
    const p = curve(pts, 6);
    H.tube(g, p, r0, r1, col);
    if (suck) for (let i = 2; i < p.length - 4; i += 4) g.set(p[i][0] + (r0 > 2 ? 1 : 0), p[i][1] + 1, suck);
  };
  /** A jointed limb: straight pieces through the points, w pixels thick. */
  H.limb = (g, pts, col, w = 1) => {
    for (let i = 1; i < pts.length; i++) {
      const [a, b] = pts[i - 1],
        [d, e] = pts[i],
        steep = Math.abs(e - b) >= Math.abs(d - a);
      for (let k = 0; k < w; k++) g.line(a + (steep ? k : 0), b + (steep ? 0 : k), d + (steep ? k : 0), e + (steep ? 0 : k), k && w > 1 ? dark(col) : col);
    }
  };
  /** Three spread fingers or claws from x, y, pointing 'd', 'u', 'l' or 'r'. */
  H.fingers = (g, x, y, dir, col, len = 2) => {
    const v = dir === 'd' || dir === 'u',
      s = dir === 'd' || dir === 'r' ? 1 : -1;
    for (const k of [-1, 0, 1]) {
      const n = k ? len - 1 : len;
      for (let i = 0; i <= n; i++) v ? g.set(x + k, y + s * i, col) : g.set(x + s * i, y + k, col);
      if (k) v ? g.set(x + 2 * k, y + s * (n + 1), col) : g.set(x + s * (n + 1), y + 2 * k, col);
    }
  };
  /** A row of teeth: every step-th pixel. */
  H.teeth = (g, y, x0, x1, col = P.TOOTH, step = 2) => {
    for (let x = x0; x <= x1; x += step) g.set(x, y, col);
  };
  /** A mouth: a dark hole with teeth along the top and the bottom. */
  H.maw = (g, x0, y0, x1, y1, o = {}) => {
    const inn = o.in || P.MAW,
      t = o.teeth || P.TOOTH,
      st = o.step || 2;
    if (o.round) g.oval(x0, y0, x1, y1, inn);
    else g.rect(x0, y0, x1, y1, inn);
    if (o.tongue) g.rect(x0 + 2, y1 - 1, x1 - 2, y1 - 1, o.tongue);
    if (o.top !== false) for (let x = x0 + (o.off || 0); x <= x1; x += st) if (g.get(x, y0) === inn) g.set(x, y0, t);
    if (o.bottom !== false && y1 > y0) for (let x = x0 + 1 + (o.off || 0); x <= x1; x += st) if (g.get(x, y1) === inn) g.set(x, y1, t);
  };
  /** An eyeball: a white oval with an iris (and a pupil when there is room). ox, oy move the gaze. */
  H.orb = (g, x0, y0, x1, y1, iris = K, o = {}) => {
    g.oval(x0, y0, x1, y1, o.white || P.EYE);
    const cx = ((x0 + x1) >> 1) + (o.ox || 0),
      cy = ((y0 + y1) >> 1) + (o.oy || 0);
    if (x1 - x0 >= 3) {
      g.rect(cx, cy, cx + 1, cy + 1, iris);
      g.set(cx + 1, cy + 1, o.pupil || K);
    } else g.set(cx, cy, iris);
  };
  /** A rounded mass, darker towards the bottom right. */
  H.ball = (g, x0, y0, x1, y1, col, o = {}) => {
    const cx = (x0 + x1) / 2,
      cy = (y0 + y1) / 2,
      rx = (x1 - x0 + 1) / 2,
      ry = (y1 - y0 + 1) / 2,
      k = o.k == null ? 0.22 : o.k;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
        if (d > 1) continue;
        const e = ((x - cx + rx * k) / rx) ** 2 + ((y - cy + ry * k) / ry) ** 2,
          f = ((x - cx - rx * 0.3) / rx) ** 2 + ((y - cy - ry * 0.3) / ry) ** 2;
        g.set(x, y, e > 1 ? o.dark || dark(col) : o.lite !== false && f > 1.05 ? o.liteCol || lite(col) : col);
      }
  };
  H.ribs = (g, x0, x1, y0, n, col, gap = 2) => {
    for (let i = 0; i < n; i++) {
      g.row(y0 + i * gap, x0, x1, col);
      g.set(x1, y0 + i * gap, dark(col));
    }
  };
  H.drip = (g, x, y, len, col) => {
    g.col(x, y, y + len - 1, col);
  };
  /** Strands hanging down: [x, y, len, drift]. */
  H.hairs = (g, list, col) => {
    for (const [x, y, len, dr = 0] of list) g.line(x, y, x + dr, y + len - 1, col);
  };
  /** Spider legs on both sides of a body at cx, cy: n pairs, the knees `rise` above the body, the feet on row yf. */
  H.spiderLegs = (g, cx, cy, n, reach, rise, yf, col, o = {}) => {
    for (const s of [-1, 1])
      for (let i = 0; i < n; i++) {
        const t = n > 1 ? i / (n - 1) : 0.5,
          kx = cx + s * ((o.k0 || 3) + (reach * 0.55 * (i + 1)) / n),
          ky = cy - rise + i * (o.kd == null ? 1 : o.kd),
          fx = cx + s * ((o.f0 || 5) + (reach * (i + 1)) / n),
          col2 = s > 0 ? dark(col) : col;
        H.limb(g, [[cx + s * (o.b0 || 1), cy + (t - 0.5) * (o.spread || 2)], [kx, ky], [fx, yf - (o.lift ? o.lift[i] || 0 : 0)]], col2, o.w || 1);
      }
  };
  /** A bat wing: from the shoulder x, y to the tips; membrane with dark fingers. */
  H.wing = (g, x, y, tips, col, bone) => {
    const pts = [[x, y]];
    for (let i = 0; i < tips.length; i++) {
      pts.push(tips[i]);
      if (i < tips.length - 1) pts.push([(tips[i][0] + tips[i + 1][0]) / 2 + (x - tips[i][0]) * 0.18, (tips[i][1] + tips[i + 1][1]) / 2 + (y - tips[i][1]) * 0.18]);
    }
    for (let i = 1; i < pts.length - 1; i++) g.poly([[x, y], pts[i], pts[i + 1]], col);
    for (const t of tips) g.line(x, y, t[0], t[1], bone || dark(col));
  };

  /* ---------- the human figure, laid out like the paper dolls (0..15 across, head rows 1..11, torso from row 12) ---------- */
  function face(g, x, y, skin) {
    g.row(y, x + 1, x + 6, skin);
    g.rect(x, y + 1, x + 7, y + 6, skin);
    g.row(y + 7, x + 1, x + 6, skin);
    g.row(y + 8, x + 2, x + 5, skin);
    g.col(x + 7, y + 2, y + 5, dark(skin));
    g.set(x + 6, y + 7, dark(skin));
    g.set(x + 4, y + 4, dark(skin));
    g.set(x, y + 1, lite(skin));
    g.set(x + 1, y, lite(skin));
  }
  function skull(g, x, y, col = P.BONE, eye = K) {
    face(g, x, y, col);
    g.rect(x + 1, y + 2, x + 2, y + 4, eye);
    g.rect(x + 5, y + 2, x + 6, y + 4, eye);
    g.set(x + 4, y + 4, col);
    g.pts([[x + 3, y + 5], [x + 4, y + 5]], vd(col));
    g.row(y + 7, x + 1, x + 6, dark(col));
    g.pts([[x + 2, y + 7], [x + 4, y + 7], [x + 6, y + 7], [x + 3, y + 8], [x + 5, y + 8]], vd(col));
    g.clear(x, y + 6);
    g.clear(x + 7, y + 6);
  }
  H.face = face;
  H.skull = skull;
  const FACES = {
    none() {},
    calm(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 3, x + 4, vd(s));
    },
    old(g, x, y, s, e) {
      FACES.calm(g, x, y, s, e);
      g.pts([[x + 1, y + 5], [x + 6, y + 5], [x + 2, y + 1], [x + 5, y + 1]], dark(s));
    },
    stare(g, x, y, s, e) {
      g.pts([[x + 2, y + 2], [x + 5, y + 2]], C.white);
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 3, x + 4, vd(s));
    },
    hollow(g, x, y, s, e) {
      g.rect(x + 1, y + 2, x + 2, y + 3, e);
      g.rect(x + 5, y + 2, x + 6, y + 3, e);
      g.row(y + 6, x + 3, x + 4, vd(s));
    },
    scream(g, x, y, s, e) {
      g.rect(x + 1, y + 2, x + 2, y + 3, e);
      g.rect(x + 5, y + 2, x + 6, y + 3, e);
      g.rect(x + 3, y + 5, x + 4, y + 7, K);
    },
    grin(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 2, x + 5, K);
      g.pts([[x + 1, y + 5], [x + 6, y + 5]], K);
      g.pts([[x + 3, y + 6], [x + 4, y + 6]], C.white);
    },
    maw(g, x, y, s, e) {
      g.pts([[x + 2, y + 2], [x + 5, y + 2]], e);
      H.maw(g, x + 1, y + 4, x + 6, y + 7);
    },
    dead(g, x, y, s) {
      g.pts([[x + 1, y + 3], [x + 2, y + 3], [x + 5, y + 3], [x + 6, y + 3]], K);
      g.row(y + 6, x + 3, x + 5, vd(s));
    },
  };
  const HAIR = {
    bald() {},
    crop(g, h) {
      g.row(2, 5, 10, h);
      g.row(3, 4, 11, h);
      g.set(4, 4, h);
      g.set(11, 4, dark(h));
    },
    thin(g, h) {
      g.col(4, 3, 6, h);
      g.col(11, 3, 6, dark(h));
      g.set(3, 5, h);
      g.set(12, 5, dark(h));
    },
    parted(g, h) {
      HAIR.crop(g, h);
      g.row(4, 4, 8, h);
      g.set(4, 5, h);
    },
    long(g, h, n = 14) {
      g.row(1, 5, 10, h);
      g.row(2, 4, 11, h);
      g.row(3, 3, 12, h);
      g.col(3, 4, n, h);
      g.col(12, 4, n, dark(h));
      g.col(4, 4, 6, h);
      g.set(11, 4, dark(h));
    },
    bob(g, h) {
      HAIR.long(g, h, 9);
      g.row(4, 4, 10, h);
    },
    bun(g, h) {
      HAIR.crop(g, h);
      g.rect(7, 0, 8, 1, h);
      g.set(4, 5, h);
      g.set(11, 5, dark(h));
    },
    wild(g, h) {
      HAIR.long(g, h, 11);
      g.pts([[2, 2], [4, 0], [7, 0], [10, 0], [13, 3], [2, 6], [13, 7], [2, 10]], h);
    },
  };
  const HATS = {
    brim(g, h) {
      g.rect(5, 0, 10, 2, h);
      g.row(0, 6, 9, lite(h));
      g.row(3, 2, 13, h);
      g.row(2, 5, 10, dark(h));
    },
    top(g, h, band = C.wine) {
      g.rect(5, -3, 10, 2, h);
      g.col(5, -3, 2, lite(h));
      g.row(2, 5, 10, band);
      g.row(3, 3, 12, h);
    },
    cap(g, h) {
      g.row(1, 5, 10, h);
      g.rect(4, 2, 11, 3, h);
      g.row(4, 3, 8, dark(h));
      g.row(1, 6, 8, lite(h));
    },
    wide(g, h) {
      g.rect(5, 0, 10, 2, h);
      g.row(-1, 6, 9, h);
      g.row(3, 0, 15, h);
      g.row(2, 5, 10, dark(h));
      g.row(0, 6, 8, lite(h));
    },
    bonnet(g, h) {
      g.row(1, 5, 10, h);
      g.rect(3, 2, 12, 4, h);
      g.col(3, 4, 9, h);
      g.col(12, 4, 9, dark(h));
      g.row(1, 6, 8, lite(h));
    },
  };
  function hood(g, h, hy = 0) {
    g.row(1 + hy, 5, 10, h);
    g.row(2 + hy, 4, 11, h);
    g.rect(3, 3 + hy, 12, 11 + hy, h);
    g.row(12 + hy, 4, 11, h);
    g.col(3, 4 + hy, 9 + hy, lite(h));
    g.row(1 + hy, 6, 8, lite(h));
    g.col(12, 3 + hy, 11 + hy, dark(h));
  }
  function arm(g, pose, yT, tl, slv, hand) {
    const b = yT + tl;
    if (pose === 'down') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, b - 2, slv);
      g.rect(1, b - 1, 3, b, hand);
      g.set(1, yT + 1, lite(slv));
    } else if (pose === 'long') {
      // hanging far too low, the fingers spread
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, b + 3, slv);
      g.rect(1, b + 4, 3, b + 6, hand);
      g.pts([[0, b + 7], [2, b + 8], [4, b + 7], [1, b + 7], [3, b + 7]], hand);
    } else if (pose === 'fwd') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, yT + 4, slv);
      g.row(yT + 4, 1, 3, dark(slv));
      g.rect(1, yT + 5, 3, yT + 7, hand);
      g.pts([[1, yT + 8], [3, yT + 8]], hand);
      g.set(2, yT + 6, dark(hand));
    } else if (pose === 'up') {
      g.rect(1, yT, 3, yT + 2, slv);
      g.rect(0, yT - 5, 2, yT, slv);
      g.rect(-1, yT - 8, 1, yT - 5, slv);
      g.rect(-1, yT - 10, 1, yT - 9, hand);
      g.pts([[-2, yT - 11], [0, yT - 12], [2, yT - 11]], hand);
    } else if (pose === 'out') {
      g.rect(-2, yT + 1, 3, yT + 3, slv);
      g.row(yT + 3, -2, 3, dark(slv));
      g.rect(-4, yT + 1, -3, yT + 3, hand);
      g.pts([[-5, yT], [-5, yT + 2], [-5, yT + 4]], hand);
    } else if (pose === 'reach') {
      g.rect(1, yT, 3, yT + 2, slv);
      g.rect(-1, yT + 2, 2, yT + 4, slv);
      g.rect(-3, yT + 4, 0, yT + 6, slv);
      g.rect(-5, yT + 5, -3, yT + 7, hand);
      g.pts([[-6, yT + 5], [-6, yT + 7], [-5, yT + 8]], hand);
    } else if (pose === 'hold') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, yT + 5, slv);
      g.rect(2, yT + 5, 5, yT + 6, slv);
      g.row(yT + 6, 2, 5, dark(slv));
      g.rect(6, yT + 4, 7, yT + 6, hand);
    }
  }
  /** A figure in the doll's proportions; returns { yT, yL, yF }: first torso row, first leg row, the floor row. */
  H.man = (g, o = {}) => {
    const skin = o.skin || C.flesh,
      top = o.top || C.slate,
      slv = o.sleeve || top,
      leg = o.legs || C.black,
      shoe = o.shoe || P.NIGHT,
      hand = o.hand || skin,
      tl = o.tl || 10,
      ll = o.ll == null ? 10 : o.ll,
      yT = 12,
      yL = yT + tl,
      yF = yL + ll - 1,
      hy = o.hy || 0;
    const poses = typeof o.arms === 'object' ? o.arms : { l: o.arms || 'down', r: o.arms || 'down' };
    if (o.robe) {
      const r = o.robe;
      g.rect(4, yL, 11, yF, r);
      if (ll > 5) g.rect(3, yL + 3, 12, yF, r);
      if (o.wide) g.poly([[4, yL], [11, yL], [12 + o.wide, yF], [3 - o.wide, yF]], r);
      g.col(6, yL + 1, yF, dark(r));
      g.col(9, yL + 3, yF, dark(r));
      g.col(3, yL + 3, yF, lite(r));
      g.row(yF, 3 - (o.wide || 0), 12 + (o.wide || 0), dark(r));
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
    if (o.coat) {
      g.rect(4, yL, 11, yL + (o.coatLen || 5), o.coat);
      g.col(7, yL + 1, yL + (o.coatLen || 5), vd(o.coat));
    }
    if (o.neck !== false && o.head !== false) g.rect(7, yT, 8, yT, dark(skin));
    if (o.shirt) {
      g.rect(7, yT, 8, yT + 4, o.shirt);
      g.pts([[6, yT], [9, yT]], o.shirt);
    }
    if (o.tie) g.col(7, yT + 1, yT + 4, o.tie);
    if (o.belt) g.row(yL - 1, 5, 10, o.belt);
    if (o.apron) {
      g.rect(5, yT + 3, 10, yL + 4, o.apron);
      g.rect(6, yT + 1, 9, yT + 2, o.apron);
    }
    if (o.body) o.body(g, yT, yL, yF);
    for (const [pose, v] of [
      [poses.l, g],
      [poses.r, g.flip(15)],
    ]) {
      if (pose === 'none') continue;
      if (pose === 'down' || pose === 'long') v.col(4, yT + 1, yL - 1, vd(slv));
      arm(v, pose, yT, tl, slv, hand);
    }
    if (o.head !== false) {
      const h = g.at(o.hx || 0, hy);
      if (o.hood) {
        hood(h, o.hood);
        g.row(yT, 3, 12, o.hood);
        g.pts([[2, yT + 1], [13, yT + 1]], o.hood);
        if (o.face === 'void') {
          h.rect(5, 4, 10, 10, P.NIGHT);
          h.row(11, 6, 9, P.NIGHT);
          if (o.eye) h.pts([[6, 6], [9, 6]], o.eye);
        } else if (o.face === 'skull') {
          h.rect(5, 4, 10, 10, P.NIGHT);
          skull(h, 4, 3, o.skin || P.BONE);
          h.col(4, 4, 9, o.hood);
          h.col(11, 4, 9, dark(o.hood));
          h.row(3, 5, 10, o.hood);
        } else {
          h.rect(5, 4, 10, 10, skin);
          h.row(11, 6, 9, skin);
          h.row(4, 5, 10, dark(skin));
          (FACES[o.face || 'calm'] || FACES.calm)(h, 4, 3, skin, o.eye || K);
        }
      } else {
        if (o.face === 'skull') skull(h, 4, 3, o.skin || P.BONE, o.eye || K);
        else {
          face(h, 4, 3, skin);
          (FACES[o.face || 'calm'] || FACES.calm)(h, 4, 3, skin, o.eye || K);
        }
        if (o.hair) (HAIR[o.hair[0]] || HAIR.crop)(h, o.hair[1], o.hair[2]);
        if (o.hat) (HATS[o.hat[0]] || HATS.brim)(h, o.hat[1], o.hat[2]);
      }
    }
    if (o.over) o.over(g, yT, yL, yF);
    return { yT, yL, yF };
  };

  /* ---------- whole-picture effects (they work on the canvas under a view) ---------- */
  const each = (c, fn) => {
    for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (c.get(x, y)) fn(x, y, c.get(x, y));
  };
  /** Everything drawn turns to pale spectral tones. */
  H.spectral = (g, lo = hex('#465a66'), hi = P.GHL) => {
    const c = g.c;
    each(c, (x, y, p) => {
      const l = Math.min(1, (p[0] + p[1] + p[2]) / 3 / 215);
      c.px[y * c.w + x] = blend(lo, hi, Math.pow(l, 1.3));
    });
  };
  /** Rows y0..y1 (of the view) dissolve into a checkerboard and then into nothing. */
  H.fade = (g, y0, y1) => {
    const c = g.c;
    for (let y = y0 + g.dy; y <= y1 + g.dy; y++)
      for (let x = 0; x < c.w; x++) {
        const t = (y - y0 - g.dy) / Math.max(1, y1 - y0);
        if ((x + y) % 2 === 0 || (t > 0.6 && x % 2 === 0) || (t > 0.85 && (x + y) % 4 !== 1)) c.clear(x, y);
      }
  };
  /** A ragged hem: bites out of the bottom edge (row y1 of the view). */
  H.ragged = (g, y1, depth = 3, seed = 3) => {
    const c = g.c,
      r = rnd(seed);
    for (let x = 0; x < c.w; x++) {
      const d = Math.floor(r() * (depth + 1));
      for (let y = y1 + g.dy; y > y1 + g.dy - d; y--) c.clear(x, y);
    }
  };
  /** Shade and outline now (so that more can be drawn on top without an outline); the draw function then returns false. */
  H.fin = (g, col) => {
    g.c.shade();
    g.c.outline(col || K);
  };
  /** The small dark shadow under a thing that floats. */
  H.shadow = (g, y, x0, x1) => {
    g.row(y, x0 + 1, x1 - 1, P.SH);
    for (let x = x0; x <= x1; x++) if ((x + y) % 2 === 0) g.set(x, y + (x < x0 + 2 || x > x1 - 2 ? 0 : 1), P.SH);
  };

  function at(c, dx = 0, dy = 0, sx = 1) {
    const X = (x) => dx + sx * x,
      lo = (a, b) => Math.min(X(a), X(b)),
      hi = (a, b) => Math.max(X(a), X(b));
    const g = {
      c,
      dx,
      dy,
      sx,
      w: c.w,
      h: c.h,
      at: (ex, ey) => at(c, X(ex), dy + ey, sx),
      flip: (m) => at(c, X(m), dy, -sx),
      set: (x, y, col) => c.set(X(x), y + dy, col),
      get: (x, y) => c.get(Math.round(X(x)), Math.round(y + dy)),
      clear: (x, y) => c.clear(Math.round(X(x)), Math.round(y + dy)),
      clearRect: (a, b, d, e) => c.clearRect(lo(a, d), b + dy, hi(a, d), e + dy),
      rect: (a, b, d, e, col) => c.rect(lo(a, d), b + dy, hi(a, d), e + dy, col),
      box: (a, b, d, e, col) => c.box(lo(a, d), b + dy, hi(a, d), e + dy, col),
      frame: (a, b, d, e, col) => c.frame(lo(a, d), b + dy, hi(a, d), e + dy, col),
      row: (y, a, b, col) => c.row(y + dy, lo(a, b), hi(a, b), col),
      col: (x, a, b, col) => c.col(X(x), a + dy, b + dy, col),
      line: (a, b, d, e, col) => c.line(X(a), b + dy, X(d), e + dy, col),
      oval: (a, b, d, e, col) => c.oval(lo(a, d), b + dy, hi(a, d), e + dy, col),
      poly: (pts, col) => c.poly(pts.map((p) => [X(p[0]), p[1] + dy]), col),
      speckle: (a, b, d, e, col, n, s) => c.speckle(lo(a, d), b + dy, hi(a, d), e + dy, col, n, s),
      dither: (a, b, d, e, col) => c.dither(lo(a, d), b + dy, hi(a, d), e + dy, col),
      stamp: (o, x, y, fl) => c.stamp(o, sx > 0 ? X(x) : X(x) - o.w + 1, y + dy, sx > 0 ? !!fl : !fl),
    };
    for (const k of Object.keys(H)) g[k] = (...a) => H[k](g, ...a);
    return g;
  }
  /** Draw something on a canvas of its own (to stamp it several times, mirrored or not). */
  const sub = (w, h, fn) => {
    const c = canvas(w, h);
    fn(at(c), c);
    return c;
  };

  /**
   * maker(out, cat, catLabel, prefix) returns mk(slug, name, w, h, fn, o):
   *   fn(g, roused, c)   draws the creature, in the same coordinates for both pictures; it is drawn on a large
   *                      sheet and cut out, so the canvas fits the drawing (one free pixel all round for the
   *                      outline) whatever w and h say — they are only the size aimed at
   *   o.L  'tall' | 'long' a large creature (adds the word to its name)
   *   o.def               more for the definition (shade: false, outline: false)
   */
  const cut = (fn, r) => {
    const big = canvas(160, 160),
      ret = fn(at(big, 56, 56), r, big);
    let x0 = 999,
      x1 = -1,
      y0 = 999,
      y1 = -1;
    for (let y = 0; y < big.h; y++)
      for (let x = 0; x < big.w; x++)
        if (big.get(x, y)) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
    if (x1 < 0) throw new Error('nothing drawn');
    const pad = ret === false ? 0 : 1,
      w = x1 - x0 + 1 + 2 * pad,
      h = y1 - y0 + 1 + 2 * pad;
    return {
      w,
      h,
      draw(c) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (big.get(x, y)) c.set(x - x0 + pad, y - y0 + pad, big.get(x, y));
        return ret;
      },
    };
  };
  const maker = (out, cat, catLabel, prefix) => (slug, name, w, h, fn, o = {}) => {
    if (out[prefix + slug]) throw new Error('twice: ' + prefix + slug);
    out[prefix + slug] = {
      cat,
      catLabel,
      group: 'char',
      name: name + (o.L ? ' large ' + o.L : ''),
      ...(o.def || {}),
      ...cut(fn, false),
      views: { used: { ...(o.def || {}), ...cut(fn, true) } },
    };
  };

  return { P, H, at, sub, curve, vd, maker, each };
};
