/*
 * Helpers for the creatures of tools/big/be-castle.js (medieval, castle, gothic, graveyard).
 * A creature is one function fn(g, r): g is a "pen" (a canvas moved so that the creature's own coordinates stay
 * the same in both pictures), r is 0 for the main picture and 1 for the roused one. The roused picture may have a
 * bigger canvas: the pen is then moved so the creature still stands on the bottom row, with the extra room above
 * and to the sides (negative coordinates).
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const vd = (col) => mix(col, 0.42);
  const P = {
    BONE: C.bone,
    BONED: hex('#a89e80'),
    EYE: hex('#e8e2c0'),
    RED: hex('#d2392c'),
    YEL: hex('#d9c04a'),
    PALE: hex('#d6c2a6'),
    ASHEN: hex('#9aa29a'),
    CORPSE: hex('#8f9a84'),
    DEADF: hex('#a9a58c'),
    NIGHT: C.night,
    SICK: hex('#7f8a4e'),
    BILE: hex('#a8a45a'),
    BRUISE: hex('#5d4274'),
    RAW: hex('#b98a86'),
    GUM: hex('#7a3a40'),
    FUR: hex('#5a4634'),
    GREYF: hex('#6e6a68'),
    SLIME: hex('#6f9a6a'),
    WAX: hex('#d8cfae'),
    SHROUD: hex('#b9b7a6'),
    MUD: hex('#4a3a2c'),
    HIDE: hex('#6b6250'),
    TROLL: hex('#6f7a5c'),
    GOB: hex('#6a7c48'),
    BLACK: hex('#1d1a22'),
    DUSK: hex('#34303c'),
  };

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

  function pen(c, dx = 0, dy = 0, sx = 1) {
    const X = (x) => sx * x + dx;
    const mm = (a, b) => [Math.min(X(a), X(b)), Math.max(X(a), X(b))];
    const g = {
      c,
      at: (ax, ay) => pen(c, X(ax), dy + ay, sx),
      flip: (m) => pen(c, X(m), dy, -sx),
      set: (x, y, col) => c.set(X(x), y + dy, col),
      get: (x, y) => c.get(Math.round(X(x)), Math.round(y + dy)),
      clear: (x, y) => c.clear(Math.round(X(x)), Math.round(y + dy)),
      rect(x0, y0, x1, y1, col) {
        const [a, b] = mm(x0, x1);
        c.rect(a, y0 + dy, b, y1 + dy, col);
      },
      clearRect(x0, y0, x1, y1) {
        const [a, b] = mm(x0, x1);
        c.clearRect(Math.round(a), Math.round(y0 + dy), Math.round(b), Math.round(y1 + dy));
      },
      box(x0, y0, x1, y1, col) {
        const [a, b] = mm(x0, x1);
        c.box(a, y0 + dy, b, y1 + dy, col);
      },
      frame(x0, y0, x1, y1, col) {
        const [a, b] = mm(x0, x1);
        c.frame(a, y0 + dy, b, y1 + dy, col);
      },
      row: (y, x0, x1, col) => g.rect(x0, y, x1, y, col),
      col: (x, y0, y1, col) => g.rect(x, y0, x, y1, col),
      line: (x0, y0, x1, y1, col) => c.line(X(x0), y0 + dy, X(x1), y1 + dy, col),
      oval(x0, y0, x1, y1, col) {
        const [a, b] = mm(x0, x1);
        c.oval(a, y0 + dy, b, y1 + dy, col);
      },
      poly: (pts, col) => c.poly(pts.map((p) => [X(p[0]), p[1] + dy]), col),
      speckle(x0, y0, x1, y1, col, n, s) {
        const [a, b] = mm(x0, x1);
        c.speckle(a, y0 + dy, b, y1 + dy, col, n, s);
      },
      dither(x0, y0, x1, y1, col) {
        const [a, b] = mm(x0, x1);
        c.dither(a, y0 + dy, b, y1 + dy, col);
      },
      pts(list, col) {
        for (const [x, y] of list) g.set(x, y, col);
      },
      /* ---- thick things ---- */
      /** A line that tapers from radius r0 to r1 along a list of points. */
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
        pass(col, -0.5 * sx, -0.5, 0.5);
      },
      /** A smooth tapering tube through the points: tentacles, worms, tails, necks. */
      worm: (pts, r0, r1, col, under) => g.tube(curve(pts, 6), r0, r1, col, under),
      /** A worm in rings: a smooth tube with a dark ring every few steps. */
      segworm(pts, r0, r1, col, every = 4, ring) {
        const p = curve(pts, 6);
        g.tube(p, r0, r1, col);
        for (let i = every; i < p.length - 2; i += every) {
          const t = i / (p.length - 1),
            rr = r0 + (r1 - r0) * t,
            ddx = p[i + 1][0] - p[i - 1][0],
            ddy = p[i + 1][1] - p[i - 1][1],
            l = Math.hypot(ddx, ddy) || 1,
            nx = -ddy / l,
            ny = ddx / l;
          for (let q = -rr; q <= rr; q += 0.5) if (g.get(p[i][0] + nx * q, p[i][1] + ny * q)) g.set(p[i][0] + nx * q, p[i][1] + ny * q, ring || dark(col));
        }
      },
      /** A tentacle with suckers. */
      tent(pts, r0, col, suck) {
        const p = curve(pts, 6);
        g.tube(p, r0, 0.6, col);
        if (suck) for (let i = 2; i < p.length - 4; i += 4) g.set(p[i][0], p[i][1] + 1, suck);
      },
      /** A jointed limb w pixels thick through the points; the far edge darker. */
      limb(pts, w, col, dk) {
        for (let i = 1; i < pts.length; i++) {
          const [x0, y0] = pts[i - 1],
            [x1, y1] = pts[i],
            flat = Math.abs(x1 - x0) > Math.abs(y1 - y0);
          for (let k = 0; k < w; k++) {
            const far = flat ? k === w - 1 : sx > 0 ? k === w - 1 : k === 0,
              cc = far && w > 1 ? dk || dark(col) : col;
            if (flat) g.line(x0, y0 + k, x1, y1 + k, cc);
            else g.line(x0 + k, y0, x1 + k, y1, cc);
          }
        }
      },
      /** n claws or fingers from x (2 apart), pointing down (dir 1) or up (-1). */
      claws(x, y, n, dir = 1, col = P.BONE, len = 2, step = 2) {
        for (let i = 0; i < n; i++) g.col(x + i * step, Math.min(y, y + dir * (len - 1)), Math.max(y, y + dir * (len - 1)), col);
      },
      /** A small hand: palm at x..x+2, fingers pointing dir (1 down, -1 up). */
      hand(x, y, dir = 1, col = P.PALE) {
        g.rect(x, y, x + 2, y + dir, col);
        g.pts([[x, y + 2 * dir], [x + 2, y + 2 * dir], [x + 1, y + 3 * dir], [x - 1, y + dir], [x + 3, y + dir]], col);
      },
      /** A dark mouth with teeth: every other pixel along the top and the bottom. */
      maw(x0, y0, x1, y1, tooth = P.BONE, o = {}) {
        if (o.round) g.oval(x0, y0, x1, y1, o.in || K);
        else g.rect(x0, y0, x1, y1, o.in || K);
        if (o.tongue && y1 - y0 >= 2) g.row((y0 + y1) >> 1, x0 + 1, x1 - 1, o.tongue);
        if (o.top !== false) for (let x = x0 + (o.ph || 0); x <= x1; x += o.step || 2) g.set(x, y0, tooth);
        if (o.bot !== false && y1 > y0) for (let x = x0 + 1 - (o.ph || 0); x <= x1; x += o.step || 2) g.set(x, y1, tooth);
      },
      /** The doll's face shape: 8 wide, 9 tall. */
      face(x, y, skin) {
        g.row(y, x + 1, x + 6, skin);
        g.rect(x, y + 1, x + 7, y + 6, skin);
        g.row(y + 7, x + 1, x + 6, skin);
        g.row(y + 8, x + 2, x + 5, skin);
        g.col(x + 7, y + 2, y + 5, dark(skin));
        g.set(x + 6, y + 7, dark(skin));
        g.set(x + 4, y + 4, dark(skin));
        g.set(x, y + 1, lite(skin));
        g.set(x + 1, y, lite(skin));
      },
      /** A skull the size of a doll's head (8 x 9). */
      skull(x, y, col = P.BONE, eye = K, glint) {
        g.face(x, y, col);
        g.rect(x + 1, y + 2, x + 2, y + 4, eye);
        g.rect(x + 5, y + 2, x + 6, y + 4, eye);
        g.set(x + 4, y + 4, col);
        g.pts([[x + 3, y + 5], [x + 4, y + 5]], vd(col));
        g.row(y + 7, x + 1, x + 6, dark(col));
        g.pts([[x + 2, y + 7], [x + 4, y + 7], [x + 6, y + 7], [x + 3, y + 8], [x + 5, y + 8]], vd(col));
        g.clear(x, y + 6);
        g.clear(x + 7, y + 6);
        if (glint) g.pts([[x + 2, y + 3], [x + 6, y + 3]], glint);
      },
      /** A small skull, 5 x 5. */
      skullS(x, y, col = P.BONE, glint, open) {
        g.row(y, x + 1, x + 3, col);
        g.rect(x, y + 1, x + 4, y + 2, col);
        g.row(y + 3, x + 1, x + 3, col);
        g.pts([[x + 1, y + 2], [x + 3, y + 2]], glint || K);
        g.set(x + 2, y + 3, vd(col));
        g.set(x, y + 1, lite(col));
        if (open) {
          g.row(y + 4, x + 1, x + 3, K);
          g.row(y + 5, x + 1, x + 3, dark(col));
        } else g.pts([[x + 1, y + 4], [x + 3, y + 4]], dark(col));
      },
      /** A tiny skull, 3 x 3. */
      skullT(x, y, col = P.BONE) {
        g.rect(x, y, x + 2, y + 1, col);
        g.set(x + 1, y + 2, dark(col));
        g.pts([[x, y + 1], [x + 2, y + 1]], K);
      },
      /** A ribcage: a spine down x, n ribs w wide to both sides from row y, every second row. */
      ribs(x, y, n, w, col = P.BONE) {
        g.col(x, y, y + n * 2, dark(col));
        for (let i = 0; i < n; i++) {
          g.row(y + i * 2, x - w, x + w, col);
          g.set(x + w, y + i * 2, dark(col));
          g.set(x, y + i * 2, lite(col));
        }
      },
      /** A long bone with knobs. */
      bone(x0, y0, x1, y1, col = P.BONE) {
        g.line(x0, y0, x1, y1, col);
        g.pts([[x0, y0 - 1], [x0 - 1, y0], [x1, y1 + 1], [x1 + 1, y1]], col);
      },
      /** A chain: links in two tones. */
      chain(x0, y0, x1, y1, col = C.iron) {
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
        for (let i = 0; i <= n; i++) g.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, i % 2 ? lite(col) : dark(col));
      },
      /** Strands hanging from row y between x0 and x1: hair, weed, rags, roots. */
      strands(x0, x1, y, lmin, lmax, col, seed = 1, step = 1) {
        const r = rnd(seed);
        for (let x = x0; x <= x1; x += step) g.col(x, y, y + Math.round(lmin + r() * (lmax - lmin)), r() < 0.35 ? dark(col) : col);
      },
      /** Bites out of the bottom edge (a ragged hem) between x0 and x1 up from row y. */
      ragged(x0, x1, y, depth = 3, seed = 3) {
        const r = rnd(seed);
        for (let x = x0; x <= x1; x++) {
          const d = Math.floor(r() * (depth + 1));
          for (let yy = y; yy > y - d; yy--) g.clear(x, yy);
        }
      },
      /** Spikes standing up (dir -1) or hanging (dir 1) along a row. */
      spikes(x0, x1, y, h, col, step = 3, dir = -1) {
        for (let x = x0; x <= x1; x += step) {
          g.col(x, Math.min(y, y + dir * (h - 1)), Math.max(y, y + dir * (h - 1)), col);
          if (h > 2) g.set(x + 1, y, dark(col));
        }
      },
      /** Bristles or spines standing on the top edge of whatever is drawn between x0 and x1. */
      ridge(x0, x1, len, col, step = 2, seed = 5) {
        const r = rnd(seed);
        for (let x = x0; x <= x1; x += step)
          for (let y = -40; y < 70; y++)
            if (g.get(x, y)) {
              const n = Math.max(1, Math.round(len * (0.6 + r() * 0.5)));
              g.col(x, y - n, y - 1, col);
              break;
            }
      },
      /** The lowest drawn row in column x (to hang things from an edge), or null. */
      under(x) {
        for (let y = 70; y > -40; y--) if (g.get(x, y)) return y;
        return null;
      },
      /** A lumpy mass: several ovals about a centre. */
      blob(cx, cy, rx, ry, col, seed = 1, n = 5) {
        const r = rnd(seed);
        g.oval(cx - rx, cy - ry, cx + rx, cy + ry, col);
        for (let i = 0; i < n; i++) {
          const a = r() * 6.283,
            px = cx + Math.cos(a) * rx * 0.6,
            py = cy + Math.sin(a) * ry * 0.6,
            q = 0.35 + r() * 0.3;
          g.oval(Math.round(px - rx * q), Math.round(py - ry * q), Math.round(px + rx * q), Math.round(py + ry * q), col);
        }
      },
      /** A big eye: white, iris, pupil (slit: a vertical pupil). r: half its width. */
      bigEye(cx, cy, rx, ry, iris, o = {}) {
        g.oval(cx - rx, cy - ry, cx + rx, cy + ry, o.white || P.EYE);
        const ir = Math.max(1, Math.round(Math.min(rx, ry) * (o.k || 0.6)));
        const ix = cx + (o.lx || 0),
          iy = cy + (o.ly || 0);
        g.oval(ix - ir, iy - ir, ix + ir, iy + ir, iris);
        if (o.slit) g.col(ix, iy - ir, iy + ir, K);
        else g.oval(ix - (ir >> 1), iy - (ir >> 1), ix + (ir >> 1), iy + (ir >> 1), K);
        if (ir > 1) g.set(ix - 1, iy - 1, P.EYE);
        if (o.lid) for (let x = cx - rx; x <= cx + rx; x++) for (let y = cy - ry; y < cy - ry + o.lid; y++) if (g.get(x, y)) g.set(x, y, o.lidCol || K);
      },
      /** Spider legs: n pairs from a body at cx, cy (half width s) down to the floor row yf. */
      spiderLegs(cx, cy, s, yf, col, o = {}) {
        const n = o.n || 4;
        for (const d of [-1, 1])
          for (let i = 0; i < n; i++) {
            const kx = cx + d * (s + 2 + i * (o.step || 2)),
              ky = cy - (o.rise == null ? s + 1 : o.rise) + i * (o.kd == null ? 1 : o.kd),
              fx = kx + d * (2 + (o.splay || 1)),
              y0 = cy - 1 + (i > 1 ? 1 : 0);
            g.line(cx + d * (s - 1), y0, kx, ky, col);
            g.line(kx, ky, fx, yf, col);
            if (o.thick) {
              g.line(cx + d * (s - 1), y0 + 1, kx, ky + 1, col);
              g.line(kx + d, ky, fx + d, yf, dark(col));
            }
          }
      },
      /** A bat wing from the shoulder x, y out to the side (dir 1 right, -1 left): bony fingers and a scalloped skin. */
      wing(x, y, span, h, bone, mem, dir = 1, lift = 0) {
        const tip = [x + dir * span, y - lift];
        const mids = [0.35, 0.65, 1].map((t) => [x + dir * span * t, y + h * (1.05 - t * 0.55) - lift * t]);
        const elbow = [x + dir * span * 0.45, y - h * 0.35 - lift];
        g.poly([[x, y], elbow, tip, ...mids.slice().reverse(), [x, y + h * 0.6]], mem);
        // scallops
        let prev = [x, y + h * 0.6];
        for (const m of mids) {
          const mx = (prev[0] + m[0]) / 2,
            my = (prev[1] + m[1]) / 2;
          g.clear(Math.round(mx), Math.round(my));
          g.clear(Math.round(mx), Math.round(my) + 1);
          g.clear(Math.round(mx) + dir, Math.round(my) + 1);
          prev = m;
        }
        g.line(x, y, elbow[0], elbow[1], bone);
        g.line(elbow[0], elbow[1], tip[0], tip[1], bone);
        for (const m of mids) g.line(elbow[0], elbow[1], m[0], m[1], bone);
      },
      /** A figure in the doll's proportions, 0..15 across: face rows 3..11, torso from row 12, feet on 11 + tl + ll. */
      man(o = {}) {
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
        if (o.belt) g.row(yL - 1, 5, 10, o.belt);
        if (o.body) o.body(g, yT, yL, yF);
        const sides = [
          [poses.l, g],
          [poses.r, g.flip(15)],
        ];
        for (const [pose, v] of sides) {
          const b = yT + tl;
          if (pose === 'down') {
            v.col(4, yT + 1, yL - 1, vd(slv));
            v.rect(2, yT, 3, yT, slv);
            v.rect(1, yT + 1, 3, b - 2, slv);
            v.rect(1, b - 1, 3, b, hand);
          } else if (pose === 'long') {
            // hanging to the knees, with claws
            v.col(4, yT + 1, yL - 1, vd(slv));
            v.rect(2, yT, 3, yT, slv);
            v.rect(1, yT + 1, 3, b + 2, slv);
            v.rect(0, b + 3, 2, b + 5, hand);
            v.pts([[-1, b + 6], [1, b + 7], [3, b + 6]], hand);
          } else if (pose === 'fwd') {
            v.rect(2, yT, 3, yT, slv);
            v.rect(1, yT + 1, 3, yT + 4, slv);
            v.row(yT + 4, 1, 3, dark(slv));
            v.rect(1, yT + 5, 3, yT + 7, hand);
            v.pts([[1, yT + 8], [3, yT + 8]], hand);
          } else if (pose === 'up') {
            v.rect(1, yT, 3, yT + 2, slv);
            v.rect(0, yT - 5, 2, yT, slv);
            v.rect(-1, yT - 8, 1, yT - 5, slv);
            v.rect(-1, yT - 10, 1, yT - 9, hand);
            v.pts([[-2, yT - 11], [0, yT - 12], [2, yT - 11]], hand);
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
        if (o.head !== false) {
          const h = g.at(o.hx || 0, o.hy || 0);
          if (o.hood) {
            const hd = o.hood;
            h.row(1, 5, 10, hd);
            h.row(2, 4, 11, hd);
            h.rect(3, 3, 12, 11, hd);
            h.row(12, 4, 11, hd);
            h.col(3, 4, 9, lite(hd));
            h.row(1, 6, 8, lite(hd));
            h.col(12, 3, 11, dark(hd));
            g.row(yT, 3, 12, hd);
            h.rect(5, 4, 10, 10, P.NIGHT);
            h.row(11, 6, 9, P.NIGHT);
            if (o.face === 'skull') {
              h.skull(4, 3, o.skin || P.BONE, K, o.eye);
              h.col(4, 4, 9, hd);
              h.col(11, 4, 9, dark(hd));
              h.row(3, 5, 10, hd);
            } else if (o.face !== 'void') {
              h.rect(5, 5, 10, 10, skin);
              h.row(11, 6, 9, skin);
              g.faceOn(h, o.face, skin, o.eye);
            } else if (o.eye) h.pts([[6, 6], [9, 6]], o.eye);
          } else if (o.face === 'skull') h.skull(4, 3, o.skin || P.BONE, K, o.eye);
          else {
            h.face(4, 3, skin);
            g.faceOn(h, o.face, skin, o.eye);
          }
        }
        if (o.over) o.over(g, yT, yL, yF);
        return { yT, yL, yF };
      },
      faceOn(h, kind = 'calm', s, e = K) {
        const x = 4,
          y = 3;
        if (kind === 'none') return;
        if (kind === 'calm') {
          h.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
          h.row(y + 6, x + 3, x + 4, vd(s));
        } else if (kind === 'hollow') {
          h.rect(x + 1, y + 2, x + 2, y + 3, K);
          h.rect(x + 5, y + 2, x + 6, y + 3, K);
          if (e !== K) h.pts([[x + 2, y + 3], [x + 6, y + 3]], e);
          h.row(y + 6, x + 3, x + 4, vd(s));
        } else if (kind === 'scream') {
          h.rect(x + 1, y + 2, x + 2, y + 3, K);
          h.rect(x + 5, y + 2, x + 6, y + 3, K);
          if (e !== K) h.pts([[x + 2, y + 3], [x + 6, y + 3]], e);
          h.rect(x + 3, y + 5, x + 4, y + 8, K);
          h.pts([[x + 2, y + 6], [x + 5, y + 6]], K);
        } else if (kind === 'grin') {
          h.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
          h.row(y + 6, x + 1, x + 6, K);
          h.pts([[x + 1, y + 5], [x + 6, y + 5]], K);
          h.pts([[x + 2, y + 6], [x + 4, y + 6]], C.white);
        } else if (kind === 'dead') {
          h.pts([[x + 1, y + 3], [x + 2, y + 3], [x + 5, y + 3], [x + 6, y + 3]], K);
          h.row(y + 6, x + 3, x + 5, vd(s));
        } else if (kind === 'angry') {
          h.pts([[x + 1, y + 2], [x + 2, y + 2], [x + 5, y + 2], [x + 6, y + 2]], K);
          h.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
          h.row(y + 6, x + 2, x + 5, K);
        } else if (kind === 'stare') {
          h.pts([[x + 2, y + 2], [x + 5, y + 2]], C.white);
          h.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
          h.row(y + 6, x + 3, x + 4, vd(s));
        }
      },
    };
    return g;
  }
  /** After the drawing: darken the right edge and outline; what is drawn after that stays as it is. */
  const fin = (g) => {
    g.c.shade();
    g.c.outline();
    return false;
  };
  return { ...kit, P, vd, pen, curve, fin };
};
