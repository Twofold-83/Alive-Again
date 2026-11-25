/*
 * Helpers for the country creatures (be-country.js: cottage, garden, village, rural).
 * A creature is one function draw(g, r): g is a drawing view in the creature's own coordinates (see G below),
 * r is 0 for the picture as it lurks and 1 for the picture roused. The roused picture may get a bigger canvas;
 * the view is then moved so that the same coordinates still mean the same place on the creature.
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const vd = (col) => mix(col, 0.45); // a very dark tone of a colour: seams, slits, sockets

  /* ---------- colours of our own ---------- */
  const P = {
    EYE: hex('#e8e2c0'),
    RED: hex('#d2392c'),
    YEL: hex('#d9c04a'),
    SICK: hex('#8a9a4a'), // a sick green
    BILE: hex('#b3b04e'),
    BRUISE: hex('#5a4468'), // a bruise violet
    RAW: hex('#b9807a'), // a raw pink
    GUM: hex('#8a4a4c'),
    MAW: hex('#1c0e12'),
    PALE: hex('#cfc4ae'),
    DEAD: hex('#9aa294'),
    DROWN: hex('#8fa6a8'),
    SOOT: hex('#2a2628'),
    FUR: hex('#6a5038'),
    GREY: hex('#7d7a78'),
    MUD: hex('#4a3a2a'),
    DOUGH: hex('#d8c9a0'),
    WAX: hex('#d6cba6'),
    SLIME: hex('#7c8a58'),
    NIGHT: C.night,
    TOOTH: C.bone,
  };

  /* ---------- the drawing view ---------- */
  /** A view of canvas c through f: (x, y) -> canvas place. fl: -1 when the view is mirrored (the light then comes from the other side). */
  function G(c, f = (x, y) => [x, y], fl = 1) {
    const g = {
      c,
      set(x, y, col) {
        if (!col) return;
        const [X, Y] = f(Math.round(x), Math.round(y));
        c.set(X, Y, col);
      },
      get(x, y) {
        const [X, Y] = f(Math.round(x), Math.round(y));
        return c.get(X, Y);
      },
      clear(x, y) {
        const [X, Y] = f(Math.round(x), Math.round(y));
        c.clear(X, Y);
      },
      at: (dx, dy) => G(c, (x, y) => f(x + dx, y + dy), fl),
      flip: (m) => G(c, (x, y) => f(m - x, y), -fl),
      rect(x0, y0, x1, y1, col) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g.set(x, y, col);
      },
      clearRect(x0, y0, x1, y1) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g.clear(x, y);
      },
      row: (y, x0, x1, col) => g.rect(x0, y, x1, y, col),
      col: (x, y0, y1, col) => g.rect(x, y0, x, y1, col),
      /** A rectangle lit from the left: lighter left edge and top, darker right and bottom. */
      box(x0, y0, x1, y1, col) {
        g.rect(x0, y0, x1, y1, col);
        g.row(y0, x0, x1, lite(col));
        g.col(fl > 0 ? x0 : x1, y0, y1, lite(col));
        g.row(y1, x0, x1, dark(col));
        g.col(fl > 0 ? x1 : x0, y0, y1, dark(col));
      },
      line(x0, y0, x1, y1, col) {
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
        for (let i = 0; i <= n; i++) g.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, col);
      },
      /** A line through several points. */
      path(pts, col) {
        for (let i = 1; i < pts.length; i++) g.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], col);
      },
      pts(list, col) {
        for (const [x, y] of list) g.set(x, y, col);
      },
      oval(x0, y0, x1, y1, col) {
        const cx = (x0 + x1) / 2,
          cy = (y0 + y1) / 2,
          rx = (x1 - x0 + 1) / 2,
          ry = (y1 - y0 + 1) / 2;
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) g.set(x, y, col);
      },
      /** An oval with a lit upper left and a dark lower right: a body, a belly, a head. */
      ball(x0, y0, x1, y1, col, hi = lite(col), lo = dark(col)) {
        const cx = (x0 + x1) / 2,
          cy = (y0 + y1) / 2,
          rx = (x1 - x0 + 1) / 2,
          ry = (y1 - y0 + 1) / 2;
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const nx = (x - cx) / rx,
              ny = (y - cy) / ry,
              d = nx * nx + ny * ny;
            if (d > 1) continue;
            const t = -(nx * fl * 0.6 + ny * 0.8);
            g.set(x, y, d > 0.4 && t > 0.5 ? hi : d > 0.3 && t < -0.45 ? lo : col);
          }
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
      /** Sprinkle a colour over what is drawn in the box. */
      speckle(x0, y0, x1, y1, col, every = 5, seed = 1) {
        const r = rnd(seed + x0 * 7 + y0 * 13);
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const p = g.get(x, y);
            if (p && p !== K && r() < 1 / every) g.set(x, y, col);
          }
      },
      /** A checkerboard of a colour over what is drawn in the box. */
      dither(x0, y0, x1, y1, col) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((x + y) % 2 === 0 && g.get(x, y)) g.set(x, y, col);
      },
      /** Recolour what is drawn in the box: fn(colour) -> colour. */
      tint(x0, y0, x1, y1, fn) {
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const p = g.get(x, y);
            if (p) g.set(x, y, fn(p));
          }
      },
      /** Bites out of the bottom edge of what is drawn: a ragged hem. */
      hem(y1, x0, x1, depth = 3, seed = 3) {
        const r = rnd(seed);
        for (let x = x0; x <= x1; x++) {
          const d = Math.floor(r() * (depth + 1));
          for (let y = y1; y > y1 - d; y--) g.clear(x, y);
        }
      },
      /** A thick line that tapers from radius r0 to r1 (tentacles, tails, necks, limbs), darker underneath. */
      tube(pts, r0, r1, col, under = dark(col)) {
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
        pass(under, 0, 0, 0);
        pass(col, -0.5 * fl, -0.5, 0.5);
      },
      /** The same through a smooth curve. */
      limb: (pts, r0, r1, col, under) => g.tube(curve(pts, 6), r0, r1, col, under),
      /** An eye. s 1: a point; 2: 2 x 2 with a pupil; 3: 3 x 3 under a lid; 4: a round 4 x 4. */
      eye(x, y, s = 1, col = P.EYE, pup = K) {
        if (s === 1) g.set(x, y, col);
        else if (s === 2) {
          g.rect(x, y, x + 1, y + 1, col);
          g.set(x + 1, y + 1, pup);
        } else if (s === 3) {
          g.rect(x, y, x + 2, y + 2, col);
          g.set(x + 1, y + 1, pup);
          g.row(y, x, x + 2, vd(col));
        } else {
          g.oval(x, y, x + s - 1, y + s - 1, col);
          g.rect(x + (s >> 1) - 1, y + (s >> 1) - 1, x + (s >> 1), y + (s >> 1), pup);
        }
      },
      /** A row of teeth: every step-th pixel, len long, pointing down (dir 1) or up (-1). */
      teeth(y, x0, x1, col = P.TOOTH, step = 2, len = 1, dir = 1) {
        for (let x = x0; x <= x1; x += step) for (let k = 0; k < len; k++) g.set(x, y + k * dir, col);
      },
      /** An open mouth in the box: dark inside, teeth from above and below. o: round, col, teeth, step, len, top, bot, tongue. */
      maw(x0, y0, x1, y1, o = {}) {
        const inside = o.col || P.MAW,
          cx = (x0 + x1) / 2,
          cy = (y0 + y1) / 2,
          rx = (x1 - x0 + 1) / 2,
          ry = (y1 - y0 + 1) / 2,
          tooth = o.teeth === undefined ? P.TOOTH : o.teeth,
          step = o.step || 2,
          len = o.len || 1;
        for (let x = x0; x <= x1; x++) {
          let a = y0,
            b = y1;
          if (o.round) {
            const k = 1 - ((x - cx) / rx) ** 2;
            if (k < 0) continue;
            const hgt = Math.sqrt(k) * ry;
            a = Math.round(cy - hgt + 0.4);
            b = Math.round(cy + hgt - 0.4);
          }
          if (b < a) continue;
          g.col(x, a, b, inside);
          if (o.tongue && b - a >= 3 && x > x0 + 1 && x < x1 - 1) g.col(x, b - 1 - (o.tl || 0), b, o.tongue);
          if (!tooth) continue;
          const i = x - x0;
          if (o.top !== false && i % step === 0) g.col(x, a, Math.min(b, a + len - 1), tooth);
          if (o.bot !== false && b - a >= 2 && i % step === (step > 1 ? 1 : 0)) g.col(x, Math.max(a, b - len + 1), b, tooth);
        }
      },
      /** Fingers or claws fanning out from x, y towards dx, dy (each -1, 0 or 1). */
      claws(x, y, dx, dy, col = P.TOOTH, n = 3, len = 2) {
        for (let i = 0; i < n; i++) {
          const s = i - (n - 1) / 2,
            px = dy ? s * 1.6 : 0,
            py = dx ? s * 1.6 : 0,
            fx = dy ? s * 0.6 : 0,
            fy = dx ? s * 0.6 : 0;
          g.line(x + px, y + py, x + px + dx * len + fx, y + py + dy * len + fy, col);
        }
      },
      /** A flame in the box, pointed at the top. */
      fire(x0, y0, x1, y1, col = C.flame, core = C.flameLight) {
        const cx = (x0 + x1) / 2,
          h = y1 - y0 + 1;
        for (let y = y0; y <= y1; y++) {
          const t = (y - y0) / h,
            w = ((x1 - x0 + 1) / 2) * Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.62) * 1.05;
          g.row(y, Math.round(cx - w + 0.2 + Math.sin(y * 1.7) * 0.5), Math.round(cx + w - 0.2 + Math.sin(y * 1.7) * 0.5), col);
          if (t > 0.45 && w > 1.2) g.row(y, Math.round(cx - w / 2.4), Math.round(cx + w / 2.4), core);
        }
      },
      /** Leaves over what is drawn in the box: dabs of a lighter and a darker green. */
      leaves(x0, y0, x1, y1, col, seed = 1, every = 4) {
        const r = rnd(seed * 31 + x0 + y0 * 3);
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            if (!g.get(x, y) || r() > 1 / every) continue;
            const l = r() < 0.5 ? lite(col) : dark(col);
            g.set(x, y, l);
            if (g.get(x + 1, y) && r() < 0.6) g.set(x + 1, y, l);
          }
      },
      /** Lighten the first pixel from the left in every row of the box. */
      lit(x0, y0, x1, y1, k = 1.2) {
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const p = g.get(x, y);
            if (p) {
              g.set(x, y, mix(p, k));
              break;
            }
          }
      },
      /** A small picture from rows of letters; pal: letter -> colour. '.' and ' ' are empty. */
      pat(x, y, lines, pal) {
        lines.forEach((l, j) =>
          [...l].forEach((ch, i) => {
            if (pal[ch]) g.set(x + i, y + j, pal[ch]);
          }),
        );
      },
      /** A jointed thin leg: shoulder -> knee -> foot, w pixels thick. */
      leg(pts, col, w = 1, foot) {
        for (let k = 0; k < w; k++) g.path(pts.map(([x, y]) => [x + k, y]), k === w - 1 && w > 1 ? dark(col) : col);
        if (foot) {
          const [x, y] = pts[pts.length - 1];
          g.row(y, x - (foot < 0 ? 1 : 0), x + w - 1 + (foot > 0 ? 1 : 0), dark(col));
        }
      },
    };
    return g;
  }
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

  /* ---------- people who are no longer people ---------- */
  /** The doll's face: 8 wide, 9 tall, its top-left corner at x, y. */
  function face(g, x, y, skin) {
    g.row(y, x + 1, x + 6, skin);
    g.rect(x, y + 1, x + 7, y + 6, skin);
    g.row(y + 7, x + 1, x + 6, skin);
    g.row(y + 8, x + 2, x + 5, skin);
    g.col(x + 7, y + 2, y + 5, dark(skin));
    g.set(x + 6, y + 7, dark(skin));
    g.set(x, y + 1, lite(skin));
    g.set(x + 1, y, lite(skin));
  }
  const ARMS = {
    down: (tl) => [[2, 13], [2, 11 + tl]],
    out: () => [[2, 13], [-1, 14], [-4, 14]],
    up: () => [[2, 13], [0, 9], [0, 3]],
    claw: () => [[2, 13], [-1, 11], [-2, 6]],
    reach: () => [[2, 13], [-1, 16], [-4, 18]],
    low: () => [[2, 13], [0, 18], [-3, 23]],
    hold: () => [[2, 13], [2, 18], [6, 18]],
    wide: () => [[2, 13], [-2, 10], [-6, 9]],
  };
  /** An arm along pts (shoulder first) with a hand at the end; claws: a colour for long fingers. */
  function arm(g, pts, slv, hand, claws, r = 1.2) {
    g.tube(pts, r, r - 0.2, slv);
    const [x, y] = pts[pts.length - 1],
      [px, py] = pts[pts.length - 2],
      dx = Math.sign(Math.round((x - px) / 2)),
      dy = Math.sign(Math.round((y - py) / 2)) || (dx ? 0 : 1);
    g.rect(x - 1, y - 1, x + 1, y + 1, hand);
    if (claws) g.claws(x + dx, y + dy, dx, dy, claws, 3, 2);
  }
  /**
   * A figure in the doll's proportions in g's coordinates: 0..15 across, hair from row 1, face rows 3..11, shoulders
   * on row 12, feet on row 11 + tl + ll. o: skin, top, sleeve, legs, shoe, hand, tl, ll, robe (a skirt to the floor),
   * arms: [left, right] each a pose name or a list of points (written for the left arm), claws, head: false,
   * hair + hairStyle ('crop' | 'long' | 'bun' | 'wild'), apron, belt, eyes: false. Returns { yT, yL, yF }.
   */
  function fig(g, o = {}) {
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
      yF = yL + ll - 1;
    if (o.robe) {
      const r = o.robe;
      g.rect(4, yL, 11, yF, r);
      if (ll > 4) g.rect(3, yL + 3, 12, yF, r);
      g.col(6, yL + 1, yF, dark(r));
      g.col(9, yL + 3, yF, dark(r));
      g.col(ll > 4 ? 3 : 4, yL + 3, yF, lite(r));
      g.row(yF, 3, 12, dark(r));
    } else if (ll > 0) {
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
    if (o.head !== false) g.rect(7, yT, 8, yT, dark(skin));
    if (o.apron) {
      g.rect(5, yT + 3, 10, Math.min(yF - 2, yL + 5), o.apron);
      g.rect(6, yT + 1, 9, yT + 2, o.apron);
    }
    if (o.belt) g.row(yL - 1, 5, 10, o.belt);
    if (o.body) o.body(g, yT, yL, yF);
    const poses = o.arms || ['down', 'down'];
    [g, g.flip(15)].forEach((v, i) => {
      const p = poses[i];
      if (!p) return;
      if (p === 'down') {
        v.col(4, yT + 1, yL - 1, vd(slv));
        v.rect(2, yT, 3, yT, slv);
        v.rect(1, yT + 1, 3, yL - 2, slv);
        v.rect(1, yL - 1, 3, yL, hand);
        if (i === 0) v.col(1, yT + 1, yL - 2, lite(slv));
        if (o.claws) v.claws(2, yL + 1, 0, 1, o.claws, 3, 2);
      } else arm(v, typeof p === 'string' ? ARMS[p](tl) : p, slv, hand, o.claws);
    });
    if (o.head !== false) {
      face(g, 4, 3, skin);
      const h = o.hair;
      if (h) {
        const st = o.hairStyle || 'crop';
        g.row(2, 5, 10, h);
        g.row(3, 4, 11, h);
        g.set(4, 4, h);
        g.set(11, 4, dark(h));
        if (st === 'bun') g.rect(7, 0, 8, 1, h);
        if (st === 'long' || st === 'wild') {
          g.row(1, 5, 10, h);
          g.col(3, 3, o.hairLen || 14, h);
          g.col(12, 3, o.hairLen || 14, dark(h));
          g.col(4, 4, 6, h);
        }
        if (st === 'wild') g.pts([[2, 2], [4, 0], [7, 0], [10, 0], [13, 3], [2, 6], [13, 7], [2, 10]], h);
      }
      if (o.eyes !== false) {
        g.pts([[6, 6], [9, 6]], o.eye || K);
        g.row(9, 7, 8, vd(skin));
      }
    }
    return { yT, yL, yF };
  }

  /** Four legs for a beast seen from the side: xs the left edge of each, from row y0 to the floor yf, w wide. */
  function legs(g, xs, y0, yf, w, col, hoof) {
    xs.forEach((x, i) => {
      const c2 = i % 2 ? dark(col) : col; // the far legs are darker
      g.rect(x, y0, x + w - 1, yf, c2);
      g.col(x + w - 1, y0, yf, dark(c2));
      if (hoof) g.rect(x, yf - 1, x + w - 1, yf, hoof);
    });
  }
  /** Spider legs: n pairs from the body at cx, cy arching up to knees and down to the floor yf. */
  function spiderLegs(g, cx, cy, n, reach, yf, col, o = {}) {
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0.5,
        kx = (o.k0 || 5) + t * reach * 0.55,
        fx = (o.f0 || 7) + t * reach,
        ky = cy - (o.lift || 6) + t * (o.sag || 2);
      for (const s of [-1, 1]) {
        g.line(cx + s * 2, cy, cx + s * kx, ky, col);
        g.line(cx + s * kx, ky, cx + s * fx, yf - (o.up ? o.up(i, s) : 0), dark(col));
        if (o.thick) g.line(cx + s * 2, cy + 1, cx + s * kx, ky + 1, col);
      }
    }
  }
  /** A ribcage in the box: bone bars over a dark hollow. */
  function ribs(g, x0, y0, x1, y1, col = C.bone, hollow = P.MAW) {
    g.rect(x0, y0, x1, y1, hollow);
    for (let y = y0; y <= y1; y += 2) g.row(y, x0, x1, col);
    g.col((x0 + x1) >> 1, y0, y1, dark(col));
  }

  return { ...kit, P, vd, G, curve, face, fig, arm, ARMS, legs, spiderLegs, ribs };
};
