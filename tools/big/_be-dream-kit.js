/*
 * Helpers for tools/big/be-dream.js (the creatures of the dream, surreal, weird and nightmare settings).
 * Everything is drawn through a "view": the canvas moved, mirrored or as it is, with the kit's primitives and a
 * few families of parts on top (eyes, teeth, hands, limbs, a doll-shaped figure). One draw function paints a
 * creature twice: g.r is false for the main picture and true for the roused one.
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const vd = (col) => mix(col, 0.42);
  const NIGHT = C.night,
    EYE = hex('#e8e2c0'),
    GUM = hex('#3a1218'),
    TOOTH = hex('#ddd6ba');

  /** Smooth a list of points into a curve. */
  const curve = (pts, n = 6) => {
    if (pts.length < 3) return pts;
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

  function view(set, get, clear) {
    const g = { set, get, clear };
    const R = Math.round;
    g.rect = (x0, y0, x1, y1, col) => {
      for (let y = R(y0); y <= R(y1); y++) for (let x = R(x0); x <= R(x1); x++) set(x, y, col);
    };
    g.row = (y, x0, x1, col) => g.rect(x0, y, x1, y, col);
    g.col = (x, y0, y1, col) => g.rect(x, y0, x, y1, col);
    g.clearRect = (x0, y0, x1, y1) => {
      for (let y = R(y0); y <= R(y1); y++) for (let x = R(x0); x <= R(x1); x++) clear(x, y);
    };
    g.pts = (list, col) => {
      for (const [x, y] of list) set(x, y, col);
    };
    g.line = (x0, y0, x1, y1, col) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (let i = 0; i <= n; i++) set(R(x0 + ((x1 - x0) * i) / n), R(y0 + ((y1 - y0) * i) / n), col);
    };
    g.path = (pts, col) => {
      for (let i = 1; i < pts.length; i++) g.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], col);
    };
    g.oval = (x0, y0, x1, y1, col) => {
      const cx = (x0 + x1) / 2,
        cy = (y0 + y1) / 2,
        rx = (x1 - x0 + 1) / 2,
        ry = (y1 - y0 + 1) / 2;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) set(x, y, col);
    };
    g.disc = (cx, cy, r, col) => {
      for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
        for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r + 0.3) set(x, y, col);
    };
    g.poly = (pts, col) => {
      const ys = pts.map((p) => p[1]);
      for (let y = Math.min(...ys); y <= Math.max(...ys); y++) {
        const xs = [];
        for (let i = 0; i < pts.length; i++) {
          const [ax, ay] = pts[i],
            [bx, by] = pts[(i + 1) % pts.length];
          if (ay === by) {
            if (ay === y) xs.push(ax, bx);
          } else if (y >= Math.min(ay, by) && y <= Math.max(ay, by)) xs.push(ax + ((bx - ax) * (y - ay)) / (by - ay));
        }
        if (xs.length) g.row(y, R(Math.min(...xs)), R(Math.max(...xs)), col);
      }
    };
    g.box = (x0, y0, x1, y1, col) => {
      g.rect(x0, y0, x1, y1, col);
      g.row(y0, x0, x1, lite(col));
      g.col(x0, y0, y1, lite(col));
      g.row(y1, x0, x1, dark(col));
      g.col(x1, y0, y1, dark(col));
    };
    g.frame = (x0, y0, x1, y1, col) => {
      g.row(y0, x0, x1, col);
      g.row(y1, x0, x1, col);
      g.col(x0, y0, y1, col);
      g.col(x1, y0, y1, col);
    };
    /** Sprinkle a colour over what is drawn in the box. */
    g.speckle = (x0, y0, x1, y1, col, every = 5, seed = 1) => {
      const r = rnd(seed + x0 * 7 + y0 * 13);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (get(x, y) && get(x, y) !== K && r() < 1 / every) set(x, y, col);
    };
    g.dither = (x0, y0, x1, y1, col, ph = 0) => {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((x + y + ph) % 2 === 0 && get(x, y)) set(x, y, col);
    };
    /** Paint only where something is drawn already (a pattern on a body). */
    g.over = (x0, y0, x1, y1, col, test) => {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (get(x, y) && (!test || test(x, y))) set(x, y, col);
    };
    /** A line w pixels thick. */
    g.thick = (x0, y0, x1, y1, w, col) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1,
        o = Math.floor((w - 1) / 2);
      for (let i = 0; i <= n; i++) {
        const x = R(x0 + ((x1 - x0) * i) / n) - o,
          y = R(y0 + ((y1 - y0) * i) / n) - o;
        g.rect(x, y, x + w - 1, y + w - 1, col);
      }
    };
    /** A limb through the points, w thick, with a darker under side. */
    g.limb = (pts, w, col, under) => {
      if (w > 1) for (let i = 1; i < pts.length; i++) g.thick(pts[i - 1][0] + 1, pts[i - 1][1] + 1, pts[i][0] + 1, pts[i][1] + 1, w - 1, under || dark(col));
      for (let i = 1; i < pts.length; i++) g.thick(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], Math.max(1, w - 1), col);
    };
    /** A round tube along a curve, from radius r0 to r1 (a tentacle, a neck, a tail). */
    g.tube = (pts, r0, r1, col, under) => {
      const p = curve(pts),
        segs = [];
      let total = 0;
      for (let i = 1; i < p.length; i++) {
        const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
        segs.push(d);
        total += d;
      }
      const pass = (colr, ox, oy, shrink) => {
        let run = 0;
        for (let i = 1; i < p.length; i++) {
          const n = Math.ceil(segs[i - 1] * 2) || 1;
          for (let k = 0; k <= n; k++) {
            const t = (run + (segs[i - 1] * k) / n) / (total || 1),
              r = Math.max(0.5, r0 + (r1 - r0) * t - shrink),
              x = p[i - 1][0] + ((p[i][0] - p[i - 1][0]) * k) / n + ox,
              y = p[i - 1][1] + ((p[i][1] - p[i - 1][1]) * k) / n + oy;
            for (let yy = Math.floor(y - r); yy <= Math.ceil(y + r); yy++)
              for (let xx = Math.floor(x - r); xx <= Math.ceil(x + r); xx++) if ((xx - x) ** 2 + (yy - y) ** 2 <= r * r) set(xx, yy, colr);
          }
          run += segs[i - 1];
        }
      };
      pass(under || dark(col), 0, 0, 0);
      pass(col, -0.5, -0.5, 0.5);
      return p;
    };
    /** Light the left and top edges of the shape, darken the right and bottom ones (the box in view coordinates). */
    g.bevel = (x0, y0, x1, y1, kl = 1.18, kd = 0.74) => {
      g.root.beveled = true;
      const todo = [];
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) {
          const p = get(x, y);
          if (!p || p === K) continue;
          const s = (get(x - 1, y) ? 0 : 1) + (get(x, y - 1) ? 0 : 1) - (get(x + 1, y) ? 0 : 1) - (get(x, y + 1) ? 0 : 1);
          if (s) todo.push([x, y, mix(p, s > 0 ? kl : kd)]);
        }
      for (const [x, y, col] of todo) set(x, y, col);
    };

    /* ---- parts ---- */
    /** An eye: r 0 = one pixel, 1 = 3 x 3, 2 = 5 x 5 … with an iris and a pupil looking towards look. */
    g.eye = (cx, cy, r, iris = K, look = [0, 0], white = EYE) => {
      if (r <= 0) return set(cx, cy, iris);
      if (r === 1) {
        g.rect(cx - 1, cy - 1, cx + 1, cy + 1, white);
        return set(cx + look[0], cy + look[1], iris);
      }
      g.disc(cx, cy, r, white);
      const ix = cx + look[0],
        iy = cy + look[1];
      if (iris !== K) g.disc(ix, iy, r >= 4 ? 2 : r - 1, iris);
      if (r >= 3 || iris === K) g.disc(ix, iy, r >= 4 ? 1 : 0, K);
      else set(ix, iy, K);
      if (r >= 3) set(ix - 1, iy - 1, white);
    };
    /** A row of teeth: every step-th pixel (step 1: a closed row with dark gaps). */
    g.teeth = (x0, x1, y, col = TOOTH, step = 2) => {
      for (let x = x0; x <= x1; x++) {
        if (step === 1) set(x, y, (x - x0) % 2 ? dark(col) : col);
        else if ((x - x0) % step === 0) set(x, y, col);
      }
    };
    /** Long teeth, len pixels, pointing dir (1 down, -1 up). */
    g.fangs = (x0, x1, y, len, dir = 1, col = TOOTH, step = 2) => {
      let i = 0;
      for (let x = x0; x <= x1; x += step, i++) g.col(x, Math.min(y, y + dir * (len - 1 - (i % 2))), Math.max(y, y + dir * (len - 1 - (i % 2))), col);
    };
    /** An open mouth: a dark hole with teeth along the top and the bottom. */
    g.maw = (x0, y0, x1, y1, o = {}) => {
      g.rect(x0, y0, x1, y1, o.in || GUM);
      if (y1 - y0 >= 3) g.rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, o.deep || K);
      const st = o.step || 2,
        col = o.col || TOOTH;
      if (o.top !== false) g.teeth(x0 + (o.off || 0), x1, y0, col, st);
      if (o.bot !== false && y1 > y0) g.teeth(x0 + 1 - (o.off || 0), x1, y1, col, st);
      if (o.tongue) g.rect(R((x0 + x1) / 2) - 1, y1 - 1, R((x0 + x1) / 2) + 1, y1 - 1, o.tongue);
    };
    /** A hand: the wrist at x, y, the fingers pointing 'd', 'u', 'l' or 'r'; len: how long the fingers are. */
    g.hand = (x, y, dir, col, len = 2) => {
      const v = { d: [0, 1], u: [0, -1], l: [-1, 0], r: [1, 0] }[dir],
        p = [-v[1], v[0]];
      for (let i = 0; i < 2; i++) for (let j = -1; j <= 1; j++) set(x + v[0] * i + p[0] * j, y + v[1] * i + p[1] * j, col);
      for (const j of [-2, 0, 2]) for (let i = 2; i < 2 + len + (j ? 0 : 1); i++) set(x + v[0] * i + p[0] * j, y + v[1] * i + p[1] * j, j > 0 ? dark(col) : col);
    };
    /** A human leg from y0 down to the floor yf; dir: which way the foot points. */
    g.hleg = (x, y0, yf, col, dir = 1, bare, shoe = NIGHT) => {
      g.rect(x, y0, x + 2, yf, col);
      g.col(x + 2, y0, yf, dark(col));
      g.col(x, y0, yf - 2, lite(col));
      if (bare) g.rect(x, yf - 4, x + 2, yf, bare);
      g.rect(dir > 0 ? x : x - 1, yf - 1, dir > 0 ? x + 3 : x + 2, yf, bare ? dark(bare) : shoe);
    };
    /** A jointed leg (insect, spider, stilt): hip, knee, foot. */
    g.jleg = (x0, y0, kx, ky, fx, fy, col, w = 1) => {
      g.limb([[x0, y0], [kx, ky], [fx, fy]], w, col);
    };
    /** Strands hanging (or rising) from the row y0 between x0 and x1, down to about y1. */
    g.strands = (x0, x1, y0, y1, col, seed = 1, gap = 1) => {
      const r = rnd(seed);
      for (let x = x0; x <= x1; x += gap) {
        const len = Math.round((y1 - y0) * (0.55 + r() * 0.45)),
          s = y1 >= y0 ? 1 : -1;
        let xx = x;
        for (let i = 0; i <= Math.abs(len); i++) {
          if (i && i % 4 === 0) xx += r() < 0.5 ? -1 : r() < 0.5 ? 1 : 0;
          set(xx, y0 + s * i, (x - x0) % 2 ? dark(col) : col);
        }
      }
    };
    /** A flame standing on x, yb, h high and about w wide. */
    g.flame = (x, yb, h, w = 3, seed = 1) => {
      const r = rnd(seed + x);
      for (let i = 0; i < h; i++) {
        const t = i / h,
          hw = (w / 2) * (1 - t ** 1.4),
          wob = Math.round(Math.sin(i * 1.3 + seed) * (t > 0.3 ? 1 : 0));
        g.row(yb - i, R(x - hw + wob), R(x + hw + wob), i < h * 0.25 ? C.red : C.flame);
        if (hw >= 1.2) g.row(yb - i, R(x - hw / 2 + wob), R(x + hw / 2 + wob), C.flameLight);
      }
      if (r() < 2) set(x + 1, yb - h - 1, C.flame);
    };
    /** A cloud: lumps along the top of an oval. */
    g.cloud = (x0, y0, x1, y1, col, seed = 1) => {
      const r = rnd(seed),
        h = y1 - y0;
      g.oval(x0, y0 + Math.round(h * 0.35), x1, y1, col);
      for (let x = x0 + 2; x < x1 - 2; ) {
        const rad = 2 + Math.round(r() * Math.min(3, h / 3));
        g.disc(x + rad, y0 + rad + Math.round(r() * 2), rad, col);
        x += rad + 1 + Math.round(r() * 2);
      }
    };
    g.at = (dx, dy) => {
      const v = view((x, y, col) => set(x + dx, y + dy, col), (x, y) => get(x + dx, y + dy), (x, y) => clear(x + dx, y + dy));
      v.root = g.root;
      return v;
    };
    /** Mirror view: x -> m - x. */
    g.flip = (m) => {
      const v = view((x, y, col) => set(m - x, y, col), (x, y) => get(m - x, y), (x, y) => clear(m - x, y));
      v.root = g.root;
      return v;
    };
    g.root = g;
    return g;
  }

  /* ---------- the doll-shaped figure ---------- */
  /** The doll's face: 8 wide, 9 tall, its top-left corner at x, y (on a figure: 4, 3). */
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
  const FACES = {
    none() {},
    blank(g, x, y, s) {
      g.set(x + 4, y + 4, s);
    },
    calm(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 3, x + 4, vd(s));
    },
    shut(g, x, y, s) {
      g.row(y + 3, x + 1, x + 2, vd(s));
      g.row(y + 3, x + 5, x + 6, vd(s));
      g.row(y + 6, x + 3, x + 4, vd(s));
    },
    stare(g, x, y, s, e) {
      g.pts([[x + 2, y + 2], [x + 5, y + 2]], C.white);
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 3, x + 4, vd(s));
    },
    wide(g, x, y, s, e) {
      // eyes far too open
      g.rect(x + 1, y + 2, x + 2, y + 3, C.white);
      g.rect(x + 5, y + 2, x + 6, y + 3, C.white);
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
      g.rect(x + 3, y + 5, x + 4, y + 8, K);
      g.pts([[x + 2, y + 6], [x + 5, y + 6]], K);
    },
    grin(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 1, x + 6, K);
      g.pts([[x, y + 5], [x + 7, y + 5]], K);
      g.pts([[x + 2, y + 6], [x + 3, y + 6], [x + 4, y + 6], [x + 5, y + 6]], C.white);
    },
    /** A smile from ear to ear, full of teeth. */
    smile(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.rect(x, y + 5, x + 7, y + 6, K);
      g.pts([[x - 1, y + 4], [x + 8, y + 4]], K);
      g.teeth(x, x + 7, y + 5, C.white, 1);
      g.teeth(x + 1, x + 6, y + 6, C.white, 2);
    },
    fangs(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.pts([[x + 1, y + 2], [x + 2, y + 2], [x + 5, y + 2], [x + 6, y + 2]], K);
      g.rect(x + 2, y + 6, x + 5, y + 7, GUM);
      g.pts([[x + 2, y + 6], [x + 5, y + 6], [x + 3, y + 7], [x + 4, y + 7]], C.white);
    },
    angry(g, x, y, s, e) {
      g.pts([[x + 1, y + 2], [x + 2, y + 2], [x + 5, y + 2], [x + 6, y + 2]], K);
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 2, x + 5, K);
    },
    dead(g, x, y, s) {
      g.pts([[x + 1, y + 3], [x + 2, y + 3], [x + 5, y + 3], [x + 6, y + 3]], K);
      g.row(y + 6, x + 3, x + 5, vd(s));
    },
    /** Lit eyes and nothing else. */
    lit(g, x, y, s, e) {
      g.rect(x + 1, y + 3, x + 2, y + 3, e);
      g.rect(x + 5, y + 3, x + 6, y + 3, e);
    },
    sewn(g, x, y, s) {
      g.row(y + 3, x + 1, x + 2, K);
      g.row(y + 3, x + 5, x + 6, K);
      g.row(y + 6, x + 2, x + 5, K);
      g.pts([[x + 2, y + 5], [x + 4, y + 5], [x + 3, y + 7], [x + 5, y + 7]], vd(s));
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
    plaits(g, h) {
      HAIR.crop(g, h);
      g.row(4, 4, 11, h);
      g.col(3, 4, 13, h);
      g.col(12, 4, 13, dark(h));
    },
    /** Hair over the whole face. */
    veil(g, h, n = 14) {
      HAIR.long(g, h, n);
      g.rect(4, 3, 11, n - 2, h);
      for (const x of [5, 7, 10]) g.col(x, 4, n - 2, dark(h));
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
      g.rect(5, -4, 10, 2, h);
      g.col(5, -4, 2, lite(h));
      g.row(2, 5, 10, band);
      g.row(3, 3, 12, h);
    },
    bowler(g, h, band = C.slate) {
      g.row(-1, 6, 9, h);
      g.rect(5, 0, 10, 2, h);
      g.set(5, 0, lite(h));
      g.row(2, 5, 10, band);
      g.row(3, 3, 12, h);
    },
    cap(g, h) {
      g.row(1, 5, 10, h);
      g.rect(4, 2, 11, 3, h);
      g.row(4, 3, 8, dark(h));
      g.row(1, 6, 8, lite(h));
    },
    /** A nightcap, its tip hanging to the right. */
    night(g, h, bob = C.white) {
      g.row(3, 3, 12, bob);
      g.rect(4, 1, 11, 2, h);
      g.rect(6, -1, 12, 0, h);
      g.rect(10, -2, 13, -1, h);
      g.rect(13, -1, 14, 3, h);
      g.rect(13, 4, 14, 5, bob);
      g.row(1, 5, 8, lite(h));
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
  /** One arm of the figure (the left one; the right one is drawn mirrored). al: its length when it hangs. */
  function arm(g, pose, yT, al, slv, hand, claw) {
    const b = yT + al;
    if (pose === 'none') return;
    if (pose === 'down') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, b - 2, slv);
      g.rect(1, b - 1, 3, b, hand);
      g.set(1, yT + 1, lite(slv));
      if (claw) for (const x of [1, 3]) g.col(x, b + 1, b + claw, hand);
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
      if (claw) for (const x of [-1, 1]) g.col(x, yT - 10 - claw, yT - 11, hand);
    } else if (pose === 'out') {
      g.rect(-2, yT + 1, 3, yT + 3, slv);
      g.row(yT + 3, -2, 3, dark(slv));
      g.rect(-4, yT + 1, -3, yT + 3, hand);
      if (claw) for (const y of [yT + 1, yT + 3]) g.row(y, -4 - claw, -5, hand);
    } else if (pose === 'reach') {
      g.rect(1, yT, 3, yT + 2, slv);
      g.rect(-1, yT + 2, 2, yT + 4, slv);
      g.rect(-3, yT + 4, 0, yT + 6, slv);
      g.rect(-5, yT + 5, -3, yT + 7, hand);
      g.pts([[-6, yT + 5], [-6, yT + 7], [-5, yT + 8]], hand);
      if (claw) g.pts([[-7, yT + 5], [-7, yT + 7], [-6, yT + 9]], hand);
    } else if (pose === 'hold') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, yT + 5, slv);
      g.rect(2, yT + 5, 5, yT + 6, slv);
      g.row(yT + 6, 2, 5, dark(slv));
      g.rect(6, yT + 4, 7, yT + 6, hand);
    } else if (pose === 'hip') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(0, yT + 1, 2, yT + 4, slv);
      g.rect(1, yT + 5, 3, yT + 6, slv);
      g.rect(3, yT + 6, 4, yT + 7, hand);
    }
  }
  /**
   * A figure in the doll's proportions, in its own coordinates: 0..15 across, hair from row 1, face rows 3..11,
   * torso from row 12 (tl rows), legs (ll rows) down to row 11 + tl + ll. Hats and raised arms go outside.
   */
  function man(g, o = {}) {
    const skin = o.skin || C.flesh,
      top = o.top || C.slate,
      slv = o.sleeve || top,
      leg = o.legs || C.black,
      shoe = o.shoe || NIGHT,
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
    const sides = [
      [poses.l, g],
      [poses.r, g.flip(15)],
    ];
    for (const [pose, v] of sides) {
      if (pose === 'down') v.col(4, yT + 1, yL - 1, vd(slv));
      arm(v, pose, yT, o.al || tl, slv, hand, o.claw);
    }
    if (o.head !== false) {
      const h = g.at(o.hx || 0, hy);
      if (o.hood) {
        hood(h, o.hood);
        g.row(yT, 3, 12, o.hood);
        g.pts([[2, yT + 1], [13, yT + 1]], o.hood);
        h.rect(5, 4, 10, 10, o.face === 'void' ? NIGHT : skin);
        h.row(11, 6, 9, o.face === 'void' ? NIGHT : skin);
        if (o.face === 'void') {
          if (o.eye) h.pts([[6, 6], [9, 6]], o.eye);
        } else {
          h.row(4, 5, 10, dark(skin));
          (FACES[o.face || 'calm'] || FACES.calm)(h, 4, 3, skin, o.eye || K);
        }
      } else {
        face(h, 4, 3, skin);
        (FACES[o.face || 'calm'] || FACES.calm)(h, 4, 3, skin, o.eye || K);
        if (o.hair) (HAIR[o.hair[0]] || HAIR.crop)(h, o.hair[1], o.hair[2]);
        if (o.hat) (HATS[o.hat[0]] || HATS.brim)(h, o.hat[1], o.hat[2]);
      }
    }
    if (o.over) o.over(g, yT, yL, yF);
    return { yT, yL, yF };
  }

  /**
   * Make the adder for one setting: mk(slug, name, w, h, draw, used) registers a creature whose draw(g, r) paints
   * the main picture (r false) and the roused one (r true). used: { w, h, dx } — a larger canvas for the roused
   * picture; the creature keeps standing on the bottom row, moved right by dx.
   */
  function maker(add, prefix, cat, catLabel, canvasOf) {
    const run = (c, draw, r, dx, dy) => {
      const g = view(
        (x, y, col) => c.set(x + dx, y + dy, col),
        (x, y) => c.get(Math.round(x + dx), Math.round(y + dy)),
        (x, y) => c.clear(Math.round(x + dx), Math.round(y + dy)),
      );
      const posts = [];
      g.r = r;
      g.W = c.w;
      g.H = c.h;
      g.x0 = -dx;
      g.y0 = -dy;
      g.x1 = c.w - 1 - dx;
      g.y1 = c.h - 1 - dy;
      g.after = (fn) => posts.push(fn);
      /** A small dark shadow on the floor under something that floats. */
      g.shadow = (x0, x1, y) =>
        posts.push(() => {
          g.row(y, x0 + 1, x1 - 1, NIGHT);
          for (let x = x0; x <= x1; x += 2) g.set(x, y + 1, NIGHT);
          g.set(x0, y, NIGHT);
          g.set(x1, y, NIGHT);
        });
      const bevel = g.bevel;
      g.bevel = (a, b, d, e, kl, kd) => (a == null ? bevel(g.x0, g.y0, g.x1, g.y1) : bevel(a, b, d, e, kl, kd));
      draw(g, r);
      if (!g.beveled) c.shade();
      if (g.lineCol !== false) c.outline(g.lineCol || K);
      for (const fn of posts) fn();
      return false;
    };
    return (slug, name, w, h, draw, u = {}) => {
      const large = w > 32 || h > 36;
      if (large && !/\blarge\b/.test(name)) name += ' large';
      const uw = u.w || w,
        uh = u.h || h;
      add(prefix + slug, cat, catLabel, name, {
        w,
        h,
        shade: false,
        outline: false,
        draw: (c) => run(c, draw, false, 0, 0),
        views: { used: { w: uw, h: uh, shade: false, outline: false, draw: (c) => run(c, draw, true, u.dx || 0, uh - h) } },
      });
    };
  }

  return { view, curve, face, FACES, HAIR, HATS, hood, man, arm, maker, vd, NIGHT, EYE, GUM, TOOTH };
};
