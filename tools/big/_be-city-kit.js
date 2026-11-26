/*
 * Helpers for the creatures of be-city.js (street, urban, electronics, school): a view of a canvas that can be
 * moved and mirrored, and the parts creatures are made of — limbs, eyes, jaws, tentacles, a figure in the doll's
 * proportions. Every creature is ONE drawing function fn(g, R): R is false for the main picture and true for the
 * roused one, so the two pictures are the same thing by construction.
 */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }) => {
  const vd = (col) => mix(col, 0.42);
  const P = {
    EYE: hex('#e8e2c0'),
    RED: hex('#d2392c'),
    YEL: hex('#d9c04a'),
    BONE: C.bone,
    NIGHT: C.night,
    MOUTH: hex('#2a1016'),
    GUM: hex('#7a3a40'),
    TONGUE: hex('#a85a5e'),
    PALE: hex('#d6c2a6'),
    ASHEN: hex('#9aa29a'),
    SICK: hex('#8a9a62'),
    BRUISE: hex('#5d4274'),
    RAW: hex('#b98a86'),
    DEAD: hex('#8f9a94'),
    GREY: hex('#7d7a78'),
    LAMP: hex('#e9d98a'),
  };

  /* ---------- smooth curves and tubes ---------- */
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

  /* ---------- a view of a canvas: moved by dx, dy, perhaps mirrored ---------- */
  function view(c, tx = (x) => x, dy = 0) {
    const g = {
      c,
      at: (ax, ay) => view(c, (x) => tx(x + ax), dy + ay),
      flip: (m) => view(c, (x) => tx(m - x), dy),
      set: (x, y, col) => c.set(tx(x), y + dy, col),
      get: (x, y) => c.get(Math.round(tx(x)), Math.round(y + dy)),
      clear: (x, y) => c.clear(Math.round(tx(x)), Math.round(y + dy)),
      clearRect: (a, b, d, e) => c.clearRect(Math.min(tx(a), tx(d)), b + dy, Math.max(tx(a), tx(d)), e + dy),
      rect: (a, b, d, e, col) => c.rect(Math.min(tx(a), tx(d)), b + dy, Math.max(tx(a), tx(d)), e + dy, col),
      box(a, b, d, e, col) {
        g.rect(a, b, d, e, col);
        g.row(b, a, d, lite(col));
        g.col(a, b, e, lite(col));
        g.row(e, a, d, dark(col));
        g.col(d, b, e, dark(col));
      },
      frame(a, b, d, e, col) {
        g.row(b, a, d, col);
        g.row(e, a, d, col);
        g.col(a, b, e, col);
        g.col(d, b, e, col);
      },
      row: (y, a, b, col) => g.rect(a, y, b, y, col),
      col: (x, a, b, col) => g.rect(x, a, x, b, col),
      line: (a, b, d, e, col) => c.line(tx(a), b + dy, tx(d), e + dy, col),
      oval: (a, b, d, e, col) => c.oval(Math.min(tx(a), tx(d)), b + dy, Math.max(tx(a), tx(d)), e + dy, col),
      poly: (pts, col) => c.poly(pts.map((p) => [tx(p[0]), p[1] + dy]), col),
      speckle: (a, b, d, e, col, n, s) => c.speckle(Math.min(tx(a), tx(d)), b + dy, Math.max(tx(a), tx(d)), e + dy, col, n, s),
      dither: (a, b, d, e, col) => c.dither(Math.min(tx(a), tx(d)), b + dy, Math.max(tx(a), tx(d)), e + dy, col),
      pts(list, col) {
        for (const [x, y] of list) g.set(x, y, col);
      },
      /** Only where something is drawn already. */
      over(x, y, col) {
        if (g.get(x, y)) g.set(x, y, col);
      },
      /** A polyline, w pixels thick (the second pixel is the shadow side). */
      limb(pts, col, w = 1, sh) {
        for (let i = 1; i < pts.length; i++) {
          const [a, b] = pts[i - 1],
            [d, e] = pts[i],
            steep = Math.abs(e - b) >= Math.abs(d - a);
          if (w >= 3) g.line(a - (steep ? 1 : 0), b - (steep ? 0 : 1), d - (steep ? 1 : 0), e - (steep ? 0 : 1), lite(col));
          if (w >= 2) g.line(a + (steep ? 1 : 0), b + (steep ? 0 : 1), d + (steep ? 1 : 0), e + (steep ? 0 : 1), sh || dark(col));
          g.line(a, b, d, e, col);
        }
      },
      /** A tube along a smoothed curve, r0 thick at the start and r1 at the end. */
      tube(pts, r0, r1, col, under, smooth = 6) {
        const p = smooth ? curve(pts, smooth) : pts;
        const segs = [];
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
                for (let xx = Math.floor(x - r); xx <= Math.ceil(x + r); xx++) if ((xx - x) ** 2 + (yy - y) ** 2 <= r * r) g.set(xx, yy, colr);
            }
            run += segs[i - 1];
          }
        };
        pass(under || dark(col), 0, 0, 0);
        pass(col, -0.5, -0.5, 0.5);
        return p;
      },
      /** Dark rings across a tube drawn with tube(): p the points it returned, r its radius. */
      rings(p, r, every, col, from = 0, to = p.length - 1) {
        for (let i = Math.max(1, from); i < to; i += every) {
          const tx0 = p[i + 1][0] - p[i - 1][0],
            ty0 = p[i + 1][1] - p[i - 1][1],
            l = Math.hypot(tx0, ty0) || 1,
            nx = -ty0 / l,
            ny = tx0 / l;
          for (let k = -r; k <= r; k += 0.5) g.over(Math.round(p[i][0] + nx * k), Math.round(p[i][1] + ny * k), col);
        }
      },
      /** Chain-link: a diamond mesh over what is drawn in the box. */
      mesh(x0, y0, x1, y1, wire, gap) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (g.get(x, y)) g.set(x, y, (x + y) % 4 === 0 || (x - y + 400) % 4 === 0 ? wire : gap);
      },
      /** A truss (crane jib, scaffold): two chords wd apart with zigzag bracing between them. */
      lattice(x0, y0, x1, y1, wd, col) {
        const len = Math.hypot(x1 - x0, y1 - y0) || 1,
          nx = (-(y1 - y0) / len) * wd,
          ny = ((x1 - x0) / len) * wd,
          n = Math.max(1, Math.round(len / Math.abs(wd)));
        for (let i = 0; i < n; i++) {
          const ax = x0 + ((x1 - x0) * i) / n,
            ay = y0 + ((y1 - y0) * i) / n,
            bx = x0 + ((x1 - x0) * (i + 1)) / n,
            by = y0 + ((y1 - y0) * (i + 1)) / n;
          if (i % 2) g.line(ax, ay, bx + nx, by + ny, dark(col));
          else g.line(ax + nx, ay + ny, bx, by, dark(col));
        }
        g.line(x0, y0, x1, y1, col);
        g.line(x0 + nx, y0 + ny, x1 + nx, y1 + ny, col);
      },
      /** A tentacle: a tube with a row of suckers. */
      tentacle(pts, r0, col, suck) {
        const p = g.tube(pts, r0, 0.6, col);
        if (suck) for (let i = 3; i < p.length - 4; i += 4) g.set(p[i][0], p[i][1] + 1, suck);
      },
      /** Teeth along a row: every `step`-th pixel, `len` long, pointing down (dir 1) or up (-1). */
      teeth(x0, x1, y, dir = 1, col = P.BONE, step = 2, len = 1) {
        for (let x = x0; x <= x1; x += step) g.col(x, Math.min(y, y + dir * (len - 1)), Math.max(y, y + dir * (len - 1)), col);
      },
      /** A dark open mouth with teeth on both lips. o: { oval, teeth: step, len, tongue, col } */
      maw(x0, y0, x1, y1, o = {}) {
        (o.oval ? g.oval : g.rect)(x0, y0, x1, y1, o.col || P.MOUTH);
        if (o.tongue && y1 - y0 >= 3) g.rect(x0 + 2, y1 - 1, x1 - 2, y1, o.tongue === true ? P.TONGUE : o.tongue);
        const st = o.teeth || 2,
          len = o.len || 1,
          tc = o.tcol || P.BONE,
          i = o.oval ? 1 : 0;
        if (o.top !== false) g.teeth(x0 + i, x1 - i, y0 + i, 1, tc, st, len);
        if (o.bottom !== false && y1 - y0 >= 2) g.teeth(x0 + i + (st > 1 ? 1 : 0), x1 - i, y1 - i, -1, tc, st, len);
      },
      /** An eye. s 1: a point; 2: white and pupil side by side; 3: a 3 x 3 ball; 4+: a round ball with a 2 x 2 pupil. */
      eye(x, y, s = 2, iris = K, white = P.EYE) {
        if (s === 1) g.set(x, y, white);
        else if (s === 2) {
          g.set(x, y, white);
          g.set(x + 1, y, iris);
        } else if (s === 3) {
          g.rect(x, y, x + 2, y + 2, white);
          g.set(x + 1, y + 1, iris);
          g.pts([[x, y], [x + 2, y], [x, y + 2], [x + 2, y + 2]], dark(white));
        } else {
          g.oval(x, y, x + s - 1, y + s - 1, white);
          const m = Math.floor(s / 2) - 1;
          g.rect(x + m, y + m, x + m + 1, y + m + 1, iris);
        }
      },
      /** Claws or fingers: n lines fanning from x, y. dir: [dx, dy] of the middle one. */
      claws(x, y, n, dir, len = 3, col = P.BONE) {
        const a0 = Math.atan2(dir[1], dir[0]);
        for (let i = 0; i < n; i++) {
          const a = a0 + (i - (n - 1) / 2) * 0.55;
          g.line(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, col);
        }
      },
      /** A jointed leg: hip, knee, foot. */
      leg(hx, hy, kx, ky, fx, fy, col, w = 1) {
        g.limb([[hx, hy], [kx, ky], [fx, fy]], col, w);
      },
      /** Drops hanging from a point. */
      drip(x, y, len, col) {
        g.col(x, y, y + len - 1, col);
        g.set(x, y + len, lite(col));
      },
      /** A dark shadow on the floor under something that floats. */
      shadow(x0, x1, y) {
        g.row(y, x0 + 1, x1 - 1, P.NIGHT);
        for (let x = x0; x <= x1; x += 2) g.set(x, y, P.NIGHT);
      },
      /** The rows y0..y1 dissolve downwards into nothing. */
      fade(x0, x1, y0, y1) {
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const t = (y - y0) / Math.max(1, y1 - y0);
            if ((x + y) % 2 === 0 || (t > 0.6 && x % 2 === 0) || (t > 0.85 && (x + y) % 4 !== 1)) g.clear(x, y);
          }
      },
      /** Bites out of an edge: a ragged hem (down from y) over x0..x1. */
      ragged(x0, x1, y, depth = 3, seed = 3) {
        const r = rnd(seed);
        for (let x = x0; x <= x1; x++) {
          const d = Math.floor(r() * (depth + 1));
          for (let yy = y; yy > y - d; yy--) g.clear(x, yy);
        }
      },
      /** Recolour what is drawn in a box. */
      tint(x0, y0, x1, y1, fn) {
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const p = g.get(x, y);
            if (p) g.set(x, y, fn(p, x, y));
          }
      },
      /** A wheel seen from the side. */
      wheel(cx, cy, r, tyre = hex('#22202a'), hub = C.steel) {
        g.oval(cx - r, cy - r, cx + r, cy + r, tyre);
        if (r >= 2) g.oval(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, dark(hub));
        g.set(cx, cy, hub);
      },
      /** n spider legs on each side of cx, cy, the feet on row yf. */
      spiderLegs(cx, cy, s, yf, col, o = {}) {
        const n = o.n || 4;
        for (const d of [-1, 1])
          for (let i = 0; i < n; i++) {
            const kx = cx + d * (s + 2 + i * (o.step || 2)),
              ky = cy - s - 1 + i * (o.kd == null ? 1 : o.kd) - (o.lift && i === n - 1 ? o.lift : 0),
              fx = kx + d * (2 + (o.splay || 1)),
              fy = o.lift && i === n - 1 ? ky - o.lift - 2 : yf;
            g.limb([[cx + d * (s - 1), cy], [kx, ky], [fx, fy]], col, o.w || 1);
          }
      },
    };
    return g;
  }

  /* ---------- a figure in the doll's proportions (16 wide: face on 4..11, feet on row 11 + tl + ll) ---------- */
  function fig(g, o = {}) {
    const skin = o.skin || C.flesh,
      top = o.top || C.slate,
      slv = o.sleeve || top,
      leg = o.legs || C.black,
      shoe = o.shoe || P.NIGHT,
      hand = o.hand || skin,
      tl = o.tl == null ? 10 : o.tl,
      ll = o.ll == null ? 10 : o.ll,
      yT = 12,
      yL = yT + tl,
      yF = yL + ll - 1;
    if (o.robe) {
      const r = o.robe;
      g.rect(4, yL, 11, yF, r);
      if (ll > 5) g.rect(3, yL + 3, 12, yF, r);
      g.col(6, yL + 1, yF, dark(r));
      g.col(9, yL + 3, yF, dark(r));
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
    g.col(10, yT + 1, yL - 1, dark(top));
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
    if (o.body) o.body(g, yT, yL, yF);
    /* arms: 'down', 'none', or the point [x, y] the LEFT hand reaches (the right one is mirrored: give its point
       in mirrored coordinates too, i.e. as if it were the left arm) */
    const arms = o.arms && typeof o.arms === 'object' && !Array.isArray(o.arms) ? o.arms : { l: o.arms || 'down', r: o.arms || 'down' };
    for (const [pose, v] of [
      [arms.l, g],
      [arms.r, g.flip(15)],
    ]) {
      if (pose === 'none') continue;
      if (pose === 'down') {
        v.rect(2, yT, 3, yT, slv);
        v.rect(1, yT + 1, 3, yL - 2, slv);
        v.col(4, yT + 1, yL - 1, vd(slv));
        v.rect(1, yL - 1, 3, yL, hand);
        v.set(1, yT + 1, lite(slv));
      } else {
        const [ex, ey] = pose,
          mx = pose[2] == null ? (2 + ex) / 2 : pose[2],
          my = pose[3] == null ? (yT + 1 + ey) / 2 + 1 : pose[3];
        v.rect(2, yT, 3, yT + 1, slv);
        v.limb([[2, yT + 1], [mx, my], [ex, ey]], slv, 3);
        v.rect(ex - 1, ey - 1, ex + 1, ey + 1, hand);
      }
    }
    if (o.head !== false) {
      const h = g.at(o.hx || 0, o.hy || 0);
      head(h, skin, o);
    }
    if (o.after) o.after(g, yT, yL, yF);
    return { yT, yL, yF };
  }
  /** The doll's head: face on 4..11 x 3..11. o.hair: colour; o.face: 'calm' | 'none' | 'hollow' | 'wide' | fn(h, skin) */
  function head(h, skin, o = {}) {
    h.row(3, 5, 10, skin);
    h.rect(4, 4, 11, 9, skin);
    h.row(10, 5, 10, skin);
    h.row(11, 6, 9, skin);
    h.col(11, 5, 8, dark(skin));
    h.set(10, 10, dark(skin));
    h.set(4, 4, lite(skin));
    if (o.hair) {
      const hc = o.hair;
      h.row(1, 5, 10, hc);
      h.row(2, 4, 11, hc);
      h.row(3, 4, 11, hc);
      h.pts([[4, 4], [11, 4], [3, 3], [12, 3]], hc);
      h.row(1, 6, 8, lite(hc));
      if (o.long) {
        h.col(3, 3, 3 + o.long, hc);
        h.col(12, 3, 3 + o.long, dark(hc));
      }
    }
    const f = o.face || 'calm',
      e = o.eye || K;
    if (typeof f === 'function') f(h, skin);
    else if (f === 'calm') {
      h.pts([[6, 6], [9, 6]], e);
      h.row(9, 7, 8, vd(skin));
    } else if (f === 'hollow') {
      h.rect(5, 5, 6, 7, K);
      h.rect(9, 5, 10, 7, K);
      h.row(9, 6, 9, vd(skin));
    } else if (f === 'wide') {
      h.rect(5, 5, 6, 6, P.EYE);
      h.rect(9, 5, 10, 6, P.EYE);
      h.pts([[6, 6], [9, 6]], e);
      h.rect(6, 8, 9, 10, P.MOUTH);
      h.teeth(6, 9, 8, 1, P.BONE, 1);
    }
  }

  return { view, fig, head, curve, vd, P };
};
