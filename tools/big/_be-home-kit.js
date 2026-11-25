/*
 * Helpers for the creatures of the home settings (tools/big/be-home.js): a drawing surface that can be moved and
 * mirrored, limbs, hands, eyes, jaws, hair, and a figure in the paper doll's proportions.
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const vd = (c) => mix(c, 0.45); // a very dark tone: seams, slits
  const P = {
    PALE: hex('#d6c2a6'),
    ASHEN: hex('#9aa29a'),
    DEAD: hex('#aab0a0'),
    SICK: hex('#8a9a6a'),
    BRUISE: hex('#5d4274'),
    RAW: hex('#b98a86'),
    GUM: hex('#8a4a50'),
    MOUTH: hex('#2a1218'),
    EYE: hex('#e8e2c0'),
    YEL: hex('#d9c04a'),
    REDEYE: hex('#d2392c'),
    TOOTH: hex('#e4dfd0'),
    HAIR: hex('#2a2428'),
    WET: hex('#3a4a52'),
    MOULD: hex('#3e4a34'),
    FUR: hex('#7a5a3c'),
    GREY: hex('#7d7a78'),
    PLASTIC: hex('#b9b7a6'),
    DENIM: hex('#3f5270'),
    PINKISH: hex('#b58a8e'),
    LAMP: hex('#e9dc9a'),
  };

  /** A smooth line through points. */
  const curve = (pts, n = 6) => {
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

  /* expressions on the doll's face (8 x 9, its corner at x, y) */
  const FACES = {
    none() {},
    calm(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 3, x + 4, vd(s));
    },
    stare(g, x, y, s, e) {
      g.pts([[x + 2, y + 2], [x + 5, y + 2]], C.white);
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 3, x + 4, vd(s));
    },
    wide(g, x, y, s, e) {
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
      g.rect(x + 3, y + 5, x + 4, y + 7, K);
    },
    smile(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 2, x + 5, C.white);
      g.pts([[x + 1, y + 5], [x + 6, y + 5]], vd(s));
    },
    grin(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.row(y + 6, x + 1, x + 6, C.white);
      g.row(y + 7, x + 2, x + 5, K);
      g.pts([[x, y + 5], [x + 7, y + 5]], K);
      g.pts([[x + 2, y + 6], [x + 4, y + 6]], dark(C.white));
    },
    gape(g, x, y, s, e) {
      g.pts([[x + 2, y + 2], [x + 5, y + 2]], e);
      g.rect(x + 2, y + 4, x + 5, y + 8, P.MOUTH);
      g.row(y + 4, x + 2, x + 5, C.white);
      g.pts([[x + 2, y + 8], [x + 4, y + 8]], C.white);
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
  };
  const HAIRS = {
    bald() {},
    crop(g, h) {
      g.row(2, 5, 10, h);
      g.row(3, 4, 11, h);
      g.set(4, 4, h);
      g.set(11, 4, dark(h));
    },
    parted(g, h) {
      HAIRS.crop(g, h);
      g.row(4, 4, 8, h);
      g.set(4, 5, h);
    },
    thin(g, h) {
      g.col(4, 3, 6, h);
      g.col(11, 3, 6, dark(h));
      g.set(3, 5, h);
      g.set(12, 5, dark(h));
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
      HAIRS.long(g, h, 9);
      g.row(4, 4, 10, h);
    },
    bun(g, h) {
      HAIRS.crop(g, h);
      g.rect(7, 0, 8, 1, h);
      g.set(4, 5, h);
      g.set(11, 5, dark(h));
    },
    perm(g, h) {
      g.row(0, 5, 10, h);
      g.rect(3, 1, 12, 3, h);
      g.rect(2, 2, 3, 7, h);
      g.rect(12, 2, 13, 7, dark(h));
      g.row(4, 4, 11, h);
      g.pts([[5, 1], [8, 2], [10, 1], [3, 5]], lite(h));
    },
    cap(g, h) {
      g.row(1, 5, 10, h);
      g.rect(4, 2, 11, 3, h);
      g.row(4, 3, 9, dark(h));
      g.row(1, 6, 8, lite(h));
    },
  };

  /** A drawing surface over a canvas (or over another surface): moved by dx, dy and, with fx, mirrored (x -> fx - x). */
  function V(s, dx = 0, dy = 0, fx = null) {
    const X = (x) => (fx == null ? x : fx - x) + dx;
    const g = {
      set(x, y, col) {
        if (col) s.set(Math.round(X(x)), Math.round(y + dy), col);
      },
      get: (x, y) => s.get(Math.round(X(x)), Math.round(y + dy)),
      clear: (x, y) => s.clear(Math.round(X(x)), Math.round(y + dy)),
      at: (ax, ay) => V(g, ax, ay),
      flip: (m) => V(g, 0, 0, m),
      rect(x0, y0, x1, y1, col) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g.set(x, y, col);
      },
      clearRect(x0, y0, x1, y1) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g.clear(x, y);
      },
      row: (y, x0, x1, col) => g.rect(x0, y, x1, y, col),
      col: (x, y0, y1, col) => g.rect(x, y0, x, y1, col),
      pts(list, col) {
        for (const [x, y] of list) g.set(x, y, col);
      },
      box(x0, y0, x1, y1, col) {
        g.rect(x0, y0, x1, y1, col);
        g.row(y0, x0, x1, lite(col));
        g.col(x0, y0, y1, lite(col));
        g.row(y1, x0, x1, dark(col));
        g.col(x1, y0, y1, dark(col));
      },
      frame(x0, y0, x1, y1, col) {
        g.row(y0, x0, x1, col);
        g.row(y1, x0, x1, col);
        g.col(x0, y0, y1, col);
        g.col(x1, y0, y1, col);
      },
      line(x0, y0, x1, y1, col) {
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
        for (let i = 0; i <= n; i++) g.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, col);
      },
      oval(x0, y0, x1, y1, col) {
        const cx = (x0 + x1) / 2,
          cy = (y0 + y1) / 2,
          rx = (x1 - x0 + 1) / 2,
          ry = (y1 - y0 + 1) / 2;
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) g.set(x, y, col);
      },
      /** An oval with a light rim top-left and a dark rim bottom-right: a round body. */
      ball(x0, y0, x1, y1, col, hi = lite(col), lo = dark(col)) {
        const cx = (x0 + x1) / 2,
          cy = (y0 + y1) / 2,
          rx = (x1 - x0 + 1) / 2,
          ry = (y1 - y0 + 1) / 2,
          inside = (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++)
            if (inside(x, y)) g.set(x, y, !inside(x + 1, y + 1) ? lo : !inside(x - 1, y - 1) && hi ? hi : col);
      },
      poly(pts, col) {
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
          if (xs.length) g.row(y, Math.round(Math.min(...xs)), Math.round(Math.max(...xs)), col);
        }
      },
      speckle(x0, y0, x1, y1, col, every = 5, seed = 1) {
        const r = rnd(seed + x0 * 7 + y0 * 13);
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (g.get(x, y) && g.get(x, y) !== K && r() < 1 / every) g.set(x, y, col);
      },
      dither(x0, y0, x1, y1, col) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((((x + y) % 2) + 2) % 2 === 0 && g.get(x, y)) g.set(x, y, col);
      },
      /** Change what is drawn in a box: fn(colour, x, y) gives the new colour (or nothing to keep it). */
      each(x0, y0, x1, y1, fn) {
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const p = g.get(x, y);
            if (p) {
              const q = fn(p, x, y);
              if (q) g.set(x, y, q);
            }
          }
      },
      tint: (x0, y0, x1, y1, k) => g.each(x0, y0, x1, y1, (p) => (p === K ? null : mix(p, k))),
      /** Light the left-most (and with top, the top-most) pixel of what is drawn in the box. */
      lit(x0, y0, x1, y1, k = 1.2) {
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++)
            if (g.get(x, y)) {
              g.set(x, y, mix(g.get(x, y), k));
              break;
            }
      },
      /** A tube along points, r0 thick at the start and r1 at the end, darker underneath. */
      tube(pts, r0, r1, col, under) {
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
      },
      /** A smooth tube through a few points. */
      worm: (pts, r0, r1, col, under) => g.tube(curve(pts, 6), r0, r1, col, under),
      /** A thin jointed limb through points: th 1 or 2 pixels thick, the second pixel darker. */
      limb(pts, col, th = 1) {
        for (let i = 1; i < pts.length; i++) {
          const [x0, y0] = pts[i - 1],
            [x1, y1] = pts[i],
            steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
          if (th > 1) g.line(x0 + (steep ? 1 : 0), y0 + (steep ? 0 : 1), x1 + (steep ? 1 : 0), y1 + (steep ? 0 : 1), dark(col));
          g.line(x0, y0, x1, y1, col);
        }
      },
      /** A clawed hand: its palm (2 x 2) at x, y, the fingers pointing 'l', 'r', 'u' or 'd', L long. */
      hand(x, y, dir, col, L = 2) {
        g.rect(x, y, x + 1, y + 1, col);
        if (dir === 'l' || dir === 'r') {
          const s = dir === 'l' ? -1 : 1,
            bx = dir === 'l' ? x - 1 : x + 2;
          g.line(bx, y - 1, bx + s * (L - 1), y - 1 - (L > 2 ? 1 : 0), col);
          g.line(bx, y, bx + s * L, y, col);
          g.line(bx, y + 2, bx + s * (L - 1), y + 2 + (L > 2 ? 1 : 0), col);
        } else {
          const s = dir === 'u' ? -1 : 1,
            by = dir === 'u' ? y - 1 : y + 2;
          g.line(x - 1, by, x - 1 - (L > 2 ? 1 : 0), by + s * (L - 1), col);
          g.line(x + 1, by, x + 1, by + s * L, col);
          g.line(x + 2, by - s, x + 2 + (L > 2 ? 1 : 0), by + s * (L - 1), col);
        }
      },
      /** An arm: a limb with a hand at its end. */
      arm(pts, col, th = 1, dir = 'd', hcol = col, L = 2) {
        g.limb(pts, col, th);
        const [x, y] = pts[pts.length - 1];
        g.hand(x, y, dir, hcol, L);
      },
      /** An eyeball: w x h of white with an iris at (ix, iy) inside it. */
      eye(x, y, w = 2, h = 1, ix = w - 1, iy = 0, iris = K, white = P.EYE) {
        g.rect(x, y, x + w - 1, y + h - 1, white);
        g.set(x + ix, y + iy, iris);
      },
      /** A round eye (3 x 3 or larger) with a dark rim. r: radius; look: where the pupil sits [-1..1, -1..1]. */
      orb(cx, cy, r = 1, look = [0, 0], iris = K, white = P.EYE) {
        g.oval(cx - r, cy - r, cx + r, cy + r, white);
        if (r >= 2) {
          g.set(cx - r + 1, cy - r + 1, lite(white));
          g.rect(cx + look[0] - (r > 2 ? 1 : 0), cy + look[1] - (r > 2 ? 1 : 0), cx + look[0] + 1, cy + look[1] + 1, iris === K ? hex('#5a4a2a') : iris);
          g.set(cx + look[0] + (r > 2 ? 0 : 1), cy + look[1] + (r > 2 ? 0 : 1), K);
        } else g.set(cx + look[0], cy + look[1], iris);
      },
      /** A row of teeth from x0 to x1 on row y, pointing dir (1 down, -1 up); every other one long. */
      teeth(x0, x1, y, dir = 1, col = P.TOOTH, step = 2, long = true) {
        for (let x = x0, i = 0; x <= x1; x += step, i++) {
          g.set(x, y, col);
          if (long && i % 2 === 0) g.set(x, y + dir, col);
        }
      },
      /** An open mouth: dark, with teeth along the top and the bottom. */
      maw(x0, y0, x1, y1, o = {}) {
        if (o.round) g.oval(x0, y0, x1, y1, o.col || P.MOUTH);
        else g.rect(x0, y0, x1, y1, o.col || P.MOUTH);
        const t = o.tooth || P.TOOTH,
          i = o.round ? 2 : 1;
        if (o.top !== false) g.teeth(x0 + i, x1 - i, y0 + (o.round ? 1 : 0), 1, t, o.step || 2, y1 - y0 > 3);
        if (o.bottom !== false) g.teeth(x0 + i + 1, x1 - i, y1 - (o.round ? 1 : 0), -1, t, o.step || 2, y1 - y0 > 4);
        if (o.tongue) g.rect(((x0 + x1) >> 1) - 1, y1 - 2, ((x0 + x1) >> 1) + 1, y1 - 1, P.GUM);
      },
      /** Strands hanging down from row y0 between x0 and x1, of uneven length up to len. */
      strands(x0, x1, y0, len, col, seed = 3, min = 0.4) {
        const r = rnd(seed);
        for (let x = x0; x <= x1; x++) {
          const n = Math.round(len * (min + (1 - min) * r()));
          g.col(x, y0, y0 + n - 1, (x - x0) % 3 === 1 ? dark(col) : col);
        }
      },
      /** Drips under an edge: a few pixels hanging from row y. */
      drips(x0, x1, y, col, seed = 5, max = 3, every = 3) {
        const r = rnd(seed);
        for (let x = x0; x <= x1; x++) if (r() < 1 / every) g.col(x, y, y + Math.floor(r() * max), col);
      },
      /** A dark patch on the floor under something that floats. */
      shadow(x0, x1, y) {
        g.row(y, x0, x1, C.night);
        g.row(y - 1, x0 + 2, x1 - 2, C.night);
      },
      /** A dotted line: stitches. */
      stitch(x0, y0, x1, y1, col = K) {
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
        for (let i = 0; i <= n; i += 2) g.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, col);
      },
      /** One human leg from x, y0 down to the floor yf, 3 wide; dir: which way the foot points; bare: skin colour of a bare shin. */
      leg(x, y0, yf, col, dir = 1, shoe = C.night, bare) {
        g.rect(x, y0, x + 2, yf, col);
        g.col(x + 2, y0, yf, dark(col));
        if (bare) g.rect(x, yf - 4, x + 2, yf, bare);
        g.rect(dir > 0 ? x : x - 1, yf - 1, dir > 0 ? x + 3 : x + 2, yf, shoe);
      },
      /** The doll's face: 8 wide, 9 tall, its top-left corner at x, y. */
      face(x, y, skin, expr = 'calm', e = K) {
        g.row(y, x + 1, x + 6, skin);
        g.rect(x, y + 1, x + 7, y + 6, skin);
        g.row(y + 7, x + 1, x + 6, skin);
        g.row(y + 8, x + 2, x + 5, skin);
        g.col(x + 7, y + 2, y + 5, dark(skin));
        g.set(x + 6, y + 7, dark(skin));
        g.set(x + 4, y + 4, dark(skin));
        g.set(x, y + 1, lite(skin));
        g.set(x + 1, y, lite(skin));
        (FACES[expr] || FACES.calm)(g, x, y, skin, e);
      },
      /** A whole head as the doll has it, in the figure's coordinates moved by hx, hy: face at 4, 3, hair over it. */
      head(hx, hy, skin, expr, hair, e) {
        const h = g.at(hx, hy);
        h.face(4, 3, skin, expr, e);
        if (hair) (HAIRS[hair[0]] || HAIRS.crop)(h, hair[1], hair[2]);
      },
      /**
       * A figure in the doll's proportions in its own coordinates: 0..15 across, hair from row 1, face rows 3..11,
       * torso from row 12 (tl long), legs (ll long), feet on row 11 + tl + ll.
       * o: skin, top, sleeve, legs, shoe, hand, tl, ll, arms ('down' | 'fwd' | 'up' | 'out' | 'reach' | 'hold' | 'none', or
       * { l, r }), robe, coat, shirt, tie, belt, apron, head: false, face, eye, hair: [kind, colour, n], body(g, yT, yL, yF).
       */
      man(o = {}) {
        const skin = o.skin || C.flesh,
          top = o.top || C.slate,
          slv = o.sleeve || top,
          leg = o.legs || C.black,
          shoe = o.shoe || C.night,
          hand = o.hand || skin,
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
        }
        if (o.head !== false) g.rect(7, yT, 8, yT, dark(skin));
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
          const b = yT + tl;
          if (pose === 'down') {
            v.col(4, yT + 1, yL - 1, vd(slv));
            v.rect(2, yT, 3, yT, slv);
            v.rect(1, yT + 1, 3, b - 2, slv);
            v.rect(1, b - 1, 3, b, hand);
            v.set(1, yT + 1, lite(slv));
          } else if (pose === 'fwd') {
            v.rect(2, yT, 3, yT, slv);
            v.rect(1, yT + 1, 3, yT + 4, slv);
            v.row(yT + 4, 1, 3, dark(slv));
            v.rect(1, yT + 5, 3, yT + 7, hand);
            v.pts([[1, yT + 8], [3, yT + 8]], hand);
            v.set(2, yT + 6, dark(hand));
          } else if (pose === 'up') {
            v.rect(1, yT, 3, yT + 2, slv);
            v.rect(0, yT - 5, 2, yT, slv);
            v.rect(-1, yT - 8, 1, yT - 5, slv);
            v.rect(-1, yT - 10, 1, yT - 9, hand);
          } else if (pose === 'out') {
            v.rect(-2, yT + 1, 3, yT + 3, slv);
            v.row(yT + 3, -2, 3, dark(slv));
            v.rect(-4, yT + 1, -3, yT + 3, hand);
          } else if (pose === 'reach') {
            v.rect(1, yT, 3, yT + 2, slv);
            v.rect(-1, yT + 2, 2, yT + 4, slv);
            v.rect(-3, yT + 4, 0, yT + 6, slv);
            v.rect(-5, yT + 5, -3, yT + 7, hand);
            v.pts([[-6, yT + 5], [-6, yT + 7], [-5, yT + 8]], hand);
          } else if (pose === 'hold') {
            v.rect(2, yT, 3, yT, slv);
            v.rect(1, yT + 1, 3, yT + 5, slv);
            v.rect(2, yT + 5, 5, yT + 6, slv);
            v.row(yT + 6, 2, 5, dark(slv));
            v.rect(6, yT + 4, 7, yT + 6, hand);
          }
        }
        if (o.head !== false) g.head(o.hx || 0, o.hy || 0, skin, o.face || 'calm', o.hair, o.eye || K);
        return { yT, yL, yF };
      },
    };
    return g;
  }

  /**
   * Register creatures of one setting. mk(slug, name, w, h, draw(g, roused), u) draws the main picture with
   * draw(g, false) and the roused one with draw(g, true) on a fresh canvas: u = { w, h, dx, dy } gives it a larger
   * canvas, the main picture's coordinates moved by dx, dy (dy by default keeps the feet on the bottom row).
   */
  const setting = (out, prefix, cat, catLabel) => (slug, name, w, h, draw, u = {}) => {
    const uw = u.w || w,
      uh = u.h || h,
      full = prefix + slug;
    if (out[full]) throw new Error(full + ' twice');
    out[full] = {
      cat,
      catLabel,
      group: 'char',
      name,
      w,
      h,
      draw(c) {
        draw(V(c), false);
      },
      views: {
        used: {
          w: uw,
          h: uh,
          draw(c) {
            draw(V(c, u.dx || 0, u.dy == null ? uh - h : u.dy), true);
          },
        },
      },
    };
  };

  return { V, P, vd, curve, setting, FACES, HAIRS };
};
