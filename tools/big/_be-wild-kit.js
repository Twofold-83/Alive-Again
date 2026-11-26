/*
 * Helpers for be-wild.js (creatures of the wilds, the apocalypse, horror and hell): a drawing surface that can be
 * moved and mirrored, with body parts on it — limbs, tubes, jaws, eyes, faces, skulls, antlers, flames.
 */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd, canvas }) => {
  const R = Math.round;
  const vd = (c) => mix(c, 0.45);
  /* colours of our own */
  const P = {
    night: hex('#16141d'),
    sh: hex('#1a1820'),
    eye: hex('#e8e2c0'),
    red: hex('#d2392c'),
    yel: hex('#d9c04a'),
    sick: hex('#8a9a5a'),
    bruise: hex('#5d4274'),
    raw: hex('#b9807a'),
    rawD: hex('#8a5560'),
    pale: hex('#d6c2a6'),
    ashen: hex('#9aa29a'),
    grey: hex('#7d7a78'),
    mud: hex('#4a3a2a'),
    bark: hex('#5a4636'),
    barkD: hex('#3c2e26'),
    gut: hex('#8a5a5e'),
    maw: hex('#34121a'),
    glowG: hex('#b4d67a'),
    ember: hex('#e0692a'),
    fur: hex('#6a5038'),
    drown: hex('#7f9aa6'),
    bog: hex('#5a4a34'),
    hide: hex('#8a6a50'),
    lava: hex('#e2702a'),
    hellR: hex('#8a2f2a'),
    hellD: hex('#5a1f22'),
    char: hex('#2a2428'),
  };
  /** Smooth a list of points into a curve. */
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

  function wrap(c, set0, get0, clear0) {
    const set = (x, y, col) => {
      if (col) set0(R(x), R(y), col);
    };
    const get = (x, y) => get0(R(x), R(y));
    const clear = (x, y) => clear0(R(x), R(y));
    const g = { c, set, get, clear };
    const span = (a, b) => [Math.min(R(a), R(b)), Math.max(R(a), R(b))];
    g.pts = (l, col) => l.forEach(([x, y]) => set(x, y, col));
    g.rect = (x0, y0, x1, y1, col) => {
      const [xa, xb] = span(x0, x1),
        [ya, yb] = span(y0, y1);
      for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) set(x, y, col);
    };
    g.clearRect = (x0, y0, x1, y1) => {
      const [xa, xb] = span(x0, x1),
        [ya, yb] = span(y0, y1);
      for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) clear(x, y);
    };
    g.row = (y, x0, x1, col) => g.rect(x0, y, x1, y, col);
    g.col = (x, y0, y1, col) => g.rect(x, y0, x, y1, col);
    g.line = (x0, y0, x1, y1, col) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (let i = 0; i <= n; i++) set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, col);
    };
    /** A line w pixels thick (a square brush). */
    g.thick = (x0, y0, x1, y1, w, col) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1,
        o = Math.floor((w - 1) / 2);
      for (let i = 0; i <= n; i++) {
        const x = R(x0 + ((x1 - x0) * i) / n),
          y = R(y0 + ((y1 - y0) * i) / n);
        g.rect(x - o, y - o, x - o + w - 1, y - o + w - 1, col);
      }
    };
    /** A jointed limb through the points, w thick. */
    g.limb = (pts, w, col) => {
      for (let i = 1; i < pts.length; i++) g.thick(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], w, col);
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
    /** An oval with a lighter upper left rim and a darker lower right one: a body, a head, a sac. */
    g.ball = (x0, y0, x1, y1, col, hi = lite(col), lo = dark(col)) => {
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
          const l = -nx * 0.55 - ny * 0.75;
          set(x, y, d > 0.4 && l < -0.42 ? lo : d > 0.5 && l > 0.6 ? hi : col);
        }
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
    /** A small picture from rows of letters. */
    g.pat = (x, y, rows, map) =>
      rows.forEach((r, j) =>
        [...r].forEach((ch, i) => {
          if (map[ch]) set(x + i, y + j, map[ch]);
        }),
      );
    /** A thick line that tapers from r0 to r1: tentacles, worms, tails, necks. */
    g.tube = (pts, r0, r1, col, under) => {
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
              for (let xx = Math.floor(x - r); xx <= Math.ceil(x + r); xx++) if ((xx - x) ** 2 + (yy - y) ** 2 <= r * r) set(xx, yy, colr);
          }
          run += segs[i - 1];
        }
      };
      pass(under || dark(col), 0, 0, 0);
      pass(col, -0.5, -0.5, 0.5);
    };
    g.worm = (pts, r0, r1, col, under) => g.tube(curve(pts), r0, r1, col, under);
    /** What is already drawn in the box gets a second colour sprinkled on. */
    g.speckle = (x0, y0, x1, y1, col, every = 5, seed = 1) => {
      const r = rnd(seed + x0 * 7 + y0 * 13);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (get(x, y) && get(x, y) !== K && r() < 1 / every) set(x, y, col);
    };
    g.dither = (x0, y0, x1, y1, col) => {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((x + y) % 2 === 0 && get(x, y)) set(x, y, col);
    };
    /** Lighten the left-most pixel of every row in the box / the top pixel of every column; darken the lowest. */
    g.lit = (x0, y0, x1, y1, k = 1.2) => {
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++)
          if (get(x, y)) {
            set(x, y, mix(get(x, y), k));
            break;
          }
    };
    g.litTop = (x0, y0, x1, y1, k = 1.2) => {
      for (let x = x0; x <= x1; x++)
        for (let y = y0; y <= y1; y++)
          if (get(x, y)) {
            set(x, y, mix(get(x, y), k));
            break;
          }
    };
    g.under = (x0, y0, x1, y1, k = 0.7) => {
      for (let x = x0; x <= x1; x++)
        for (let y = y1; y >= y0; y--)
          if (get(x, y)) {
            set(x, y, mix(get(x, y), k));
            break;
          }
    };
    /** Bites out of the bottom edge of what is drawn. */
    g.ragged = (x0, x1, y1, depth = 3, seed = 3) => {
      const r = rnd(seed);
      for (let x = x0; x <= x1; x++) {
        const d = Math.floor(r() * (depth + 1));
        for (let y = y1; y > y1 - d; y--) clear(x, y);
      }
    };
    /** Strands hanging from a row: hair, moss, weed, rags. */
    g.strands = (x0, x1, y0, len, col, seed = 2, every = 1) => {
      const r = rnd(seed);
      for (let x = x0; x <= x1; x += every) {
        const n = Math.max(1, R(len * (0.4 + r() * 0.6)));
        g.col(x, y0, y0 + n - 1, r() < 0.3 ? dark(col) : col);
      }
    };
    /* ---- parts ---- */
    /** A dark mouth with teeth: on the top edge, and on the bottom edge if it is three rows or more. */
    g.maw = (x0, y0, x1, y1, o = {}) => {
      const t = o.t || C.bone;
      g.rect(x0, y0, x1, y1, o.in || P.maw);
      for (let x = x0; x <= x1; x++) {
        if ((x - x0) % 2 === (o.ph || 0)) set(x, y0, t);
        else if (y1 - y0 >= 2) set(x, y1, o.t2 || t);
      }
      if (o.tongue && y1 - y0 >= 2) g.row(y1 - 1, x0 + 1, x1 - 1, o.tongue);
    };
    g.teeth = (y, x0, x1, col = C.bone, ph = 0) => {
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) if ((x - x0 + ph) % 2 === 0) set(x, y, col);
    };
    g.eyes = (list, col = P.eye) => g.pts(list, col);
    /** An eye in a dark socket: w x h of dark with the pupil of light in it. */
    g.socket = (x, y, w, h, col, sock = K) => {
      g.rect(x, y, x + w - 1, y + h - 1, sock);
      if (col) set(x + (w > 1 ? w - 1 : 0), y + (h > 1 ? h - 1 : 0), col);
    };
    /** A round eyeball: white with a pupil looking dx, dy. */
    g.ball_eye = (cx, cy, r, o = {}) => {
      g.oval(cx - r, cy - r, cx + r, cy + r, o.white || P.eye);
      if (r > 1) g.rect(cx + (o.dx || 0), cy + (o.dy || 0), cx + (o.dx || 0) + (r > 2 ? 1 : 0), cy + (o.dy || 0) + (r > 2 ? 1 : 0), o.iris || K);
      else set(cx + (o.dx || 0), cy + (o.dy || 0), o.iris || K);
    };
    g.ribs = (x0, x1, y0, n, step, col, spine) => {
      for (let i = 0; i < n; i++) g.row(y0 + i * step, x0 + (i === n - 1 ? 1 : 0), x1 - (i === n - 1 ? 1 : 0), col);
      if (spine) g.col(R((x0 + x1) / 2), y0 - 1, y0 + (n - 1) * step + 1, spine);
    };
    /** Fingers or claws from a wrist, spreading in direction dx, dy. */
    g.hand = (x, y, dx, dy, col, n = 3, len = 2) => {
      const px = -dy,
        py = dx,
        m = (n - 1) / 2;
      for (let i = 0; i < n; i++) {
        const k = i - m;
        g.line(x + px * k, y + py * k, x + px * k * 1.6 + dx * len, y + py * k * 1.6 + dy * len, col);
      }
    };
    /** An antler from x, y: d = -1 to the left, 1 to the right; s is its height. */
    g.antler = (x, y, d, s, col, tines = 3) => {
      const tx = x + d * s * 0.55,
        ty = y - s;
      g.line(x, y, x + d * s * 0.35, y - s * 0.45, col);
      g.line(x + d * s * 0.35, y - s * 0.45, tx, ty, col);
      for (let i = 0; i < tines; i++) {
        const t = (i + 1) / (tines + 1),
          bx = x + d * s * (t < 0.45 ? (0.35 * t) / 0.45 : 0.35 + ((t - 0.45) / 0.55) * 0.2),
          by = y - s * t,
          out = i % 2 === 0;
        g.line(bx, by, bx + (out ? d : -d) * s * (out ? 0.42 : 0.22), by - s * (out ? 0.3 : 0.32), col);
      }
    };
    /** A human skull, 7 x 8, looking at us. */
    g.skull = (x, y, col = C.bone, eye = K, jaw = 0) => {
      const m = { b: col, B: dark(col), K: eye, D: vd(col) };
      g.pat(x, y, ['.bbbbb.', 'bbbbbbb', 'bKKbKKb', 'bKKbKKb', 'bbbDbbb', '.bbbbb.'], m);
      if (jaw) g.rect(x + 1, y + 6, x + 5, y + 5 + jaw, P.maw);
      g.pat(x, y + 6 + jaw, ['.bDbDb.', '..BBB..'], m);
    };
    g.skullS = (x, y, col = C.bone, eye = K) => g.pat(x, y, ['.bbb.', 'bbbbb', 'bKbKb', 'bbbbb', '.bBb.'], { b: col, B: dark(col), K: eye });
    /**
     * A face looking at us in a box w x h with the corners off. o.eyes: 'dot' | 'hollow' | 'shut' | 'none' | 'wide';
     * o.mouth: 'line' | 'open' | 'scream' | 'grin' | 'none' | 'sewn'.
     */
    g.face = (x, y, w, h, skin, o = {}) => {
      g.rect(x, y, x + w - 1, y + h - 1, skin);
      for (const [cx, cy] of [[x, y], [x + w - 1, y], [x, y + h - 1], [x + w - 1, y + h - 1]]) clear(cx, cy);
      if (h >= 8) {
        clear(x + 1, y + h - 1);
        clear(x + w - 2, y + h - 1);
        clear(x, y + h - 2);
        clear(x + w - 1, y + h - 2);
      }
      g.col(x + w - 1, y + 1, y + h - 3, dark(skin));
      g.set(x + 1, y, lite(skin));
      g.set(x, y + 1, lite(skin));
      const ey = y + Math.max(1, Math.floor(h * 0.36)),
        e1 = x + Math.max(1, Math.floor(w * 0.22)),
        e2 = x + w - 1 - Math.max(1, Math.floor(w * 0.22)) - (w >= 8 ? 0 : 0),
        ec = o.eye || K,
        my = y + Math.min(h - 2, R(h * 0.72)),
        mx0 = x + Math.floor(w / 2) - 1,
        mx1 = x + Math.ceil(w / 2);
      const kind = o.eyes || 'dot';
      if (kind === 'dot') g.pts([[e1 + (w >= 8 ? 1 : 0), ey], [e2 - (w >= 8 ? 1 : 0), ey]], ec);
      else if (kind === 'hollow') {
        g.rect(e1, ey - 1, e1 + (w >= 7 ? 1 : 0), ey, o.sock || K);
        g.rect(e2 - (w >= 7 ? 1 : 0), ey - 1, e2, ey, o.sock || K);
        if (o.eye) g.pts([[e1 + (w >= 7 ? 1 : 0), ey], [e2, ey]], o.eye);
      } else if (kind === 'wide') {
        g.pts([[e1, ey - 1], [e1 + 1, ey - 1], [e2 - 1, ey - 1], [e2, ey - 1], [e1, ey], [e2 - 1, ey]], C.white);
        g.pts([[e1 + 1, ey], [e2, ey]], ec);
      } else if (kind === 'shut') {
        g.row(ey, e1, e1 + 1, vd(skin));
        g.row(ey, e2 - 1, e2, vd(skin));
      }
      const mo = o.mouth || 'line';
      if (mo === 'line') g.row(my, mx0, mx1, vd(skin));
      else if (mo === 'open') g.rect(mx0, my - 1, mx1, my, o.in || K);
      else if (mo === 'scream') g.rect(mx0, my - 2, mx1, Math.min(my + 1, y + h - 2), o.in || K);
      else if (mo === 'grin') {
        g.row(my, mx0 - 1, mx1 + 1, K);
        g.teeth(my, mx0, mx1, C.white);
        g.pts([[mx0 - 2, my - 1], [mx1 + 2, my - 1]], K);
      } else if (mo === 'sewn') {
        g.row(my, mx0 - 1, mx1 + 1, vd(skin));
        g.pts([[mx0 - 1, my - 1], [mx0 + 1, my + 1], [mx1, my - 1]], K);
      }
      if (h >= 8 && o.nose !== false) set(x + Math.floor(w / 2), ey + 1 + (h >= 9 ? 1 : 0), dark(skin));
    };
    /**
     * A person in the doll's proportions: cx is the left one of the two middle columns, yF the row of the feet.
     * Draws legs (or a robe), torso and head; arms are drawn by the caller from the shoulders it returns,
     * unless o.arms is 'down'.
     */
    g.man = (cx, yF, o = {}) => {
      const skin = o.skin || C.flesh,
        top = o.top || C.slate,
        leg = o.legs || C.black,
        tl = o.tl == null ? 10 : o.tl,
        ll = o.ll == null ? 10 : o.ll,
        yL = yF - ll + 1,
        yT = yL - tl,
        yH = yT - 9 + (o.hy || 0);
      if (o.robe) {
        g.rect(cx - 3, yL, cx + 4, yF, o.robe);
        g.rect(cx - 4, yL + 3, cx + 5, yF, o.robe);
        g.col(cx - 1, yL + 1, yF, dark(o.robe));
        g.col(cx + 2, yL + 3, yF, dark(o.robe));
        g.col(cx - 4, yL + 3, yF, lite(o.robe));
      } else if (ll > 0 && o.legs !== false) {
        g.rect(cx - 3, yL, cx + 4, yF, leg);
        g.col(cx - 3, yL, yF - 2, lite(leg));
        g.col(cx, yL + 1, yF, vd(leg));
        if (o.shoe !== false) {
          const sh = o.shoe || P.night;
          g.rect(cx - 3, yF - 1, cx - 1, yF, sh);
          g.rect(cx + 1, yF - 1, cx + 4, yF, sh);
          set(cx - 4, yF, sh);
          set(cx + 5, yF, sh);
        }
      }
      g.rect(cx - 2, yT, cx + 3, yL - 1, top);
      g.row(yT, cx - 3, cx + 4, top);
      g.col(cx - 2, yT + 1, yL - 1, lite(top));
      if (o.arms === 'down' || o.armL === 'down') {
        const slv = o.sleeve || top;
        g.rect(cx - 5, yT + 1, cx - 3, yL - 3, slv);
        set(cx - 5, yT + 1, lite(slv));
        g.col(cx - 3, yT + 2, yL - 2, vd(slv));
        g.rect(cx - 5, yL - 2, cx - 4, yL - 1, o.hand || skin);
      }
      if (o.arms === 'down' || o.armR === 'down') {
        const slv = o.sleeve || top;
        g.rect(cx + 4, yT + 1, cx + 6, yL - 3, slv);
        g.col(cx + 4, yT + 2, yL - 2, vd(slv));
        g.rect(cx + 5, yL - 2, cx + 6, yL - 1, o.hand || skin);
      }
      if (o.head !== false) {
        g.rect(cx, yT - 1, cx + 1, yT, dark(skin));
        g.face(cx - 3, yH, 8, 9, skin, o.face || {});
      }
      return { yT, yL, yH, sl: [cx - 4, yT + 2], sr: [cx + 5, yT + 2] };
    };
    /**
     * A dog's head looking right: the skull 5 x 5 at x, y, then a muzzle o.len long. o.open: how far the jaw drops;
     * o.eye: its colour (null for none); o.bare: the teeth show though the mouth is shut.
     */
    g.doghead = (x, y, col, o = {}) => {
      const len = o.len || 4,
        open = o.open || 0;
      g.rect(x, y, x + 4, y + 4, col);
      g.rect(x + 5, y + 2, x + 4 + len, y + 3, col);
      set(x + 5, y + 1, col);
      set(x + 4 + len, y + 2, o.nose || K);
      if (o.ear !== false) g.pts([[x + 1, y - 1], [x + 1, y - 2], [x + 2, y - 1]], o.earc || col);
      if (!open) {
        g.row(y + 4, x + 4, x + 3 + len, dark(col));
        if (o.bare) g.teeth(y + 4, x + 5, x + 3 + len, C.white);
      } else {
        g.rect(x + 4, y + 4, x + 3 + len, y + 3 + open, P.maw);
        g.row(y + 4 + open, x + 3, x + 2 + len, col);
        g.teeth(y + 4, x + 5, x + 3 + len, C.white);
        if (open >= 2) g.teeth(y + 3 + open, x + 4, x + 2 + len, C.white, 1);
      }
      if (o.eye !== null) set(x + 3, y + 1, o.eye || K);
    };
    g.chain = (x0, y0, x1, y1, a = C.steel, b = C.iron) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (let i = 0; i <= n; i++) set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, i % 2 ? b : a);
    };
    /** A flame standing on cx, yb, h tall. */
    g.flame = (cx, yb, h, col = C.flame, tip = C.flameLight, lean = 0) => {
      const wm = Math.max(1, h / 2.6);
      for (let i = 0; i < h; i++) {
        const t = i / Math.max(1, h - 1),
          hw = t < 0.25 ? wm * (0.6 + t * 1.6) : wm * Math.pow(1 - t, 0.8) * 1.15,
          ox = R(lean * t * t * h * 0.3);
        g.row(yb - i, R(cx + ox - hw), R(cx + ox + hw), col);
        if (t < 0.6 && hw >= 1.2) g.row(yb - i, R(cx + ox - hw * 0.45), R(cx + ox + hw * 0.45), tip);
      }
    };
    /** A small dark shadow on the floor under something that floats. */
    g.shadow = (cx, y, hw) => {
      g.row(y, cx - hw, cx + hw, P.sh);
      if (hw > 2) g.row(y + 1, cx - hw + 2, cx + hw - 2, P.sh);
    };
    /** Shade and outline now, so that what is drawn afterwards (a glow, a shadow) stays as it is. Return false from draw. */
    g.ink = (col) => {
      c.shade();
      c.outline(col);
    };
    g.each = (fn) => {
      for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (c.get(x, y)) fn(x, y, c.get(x, y));
    };
    g.at = (dx, dy) => wrap(c, (x, y, col) => set0(x + dx, y + dy, col), (x, y) => get0(x + dx, y + dy), (x, y) => clear0(x + dx, y + dy));
    g.flip = (m) => wrap(c, (x, y, col) => set0(m - x, y, col), (x, y) => get0(m - x, y), (x, y) => clear0(m - x, y));
    g.both = (m, fn) => {
      fn(g, 1);
      fn(g.flip(m), -1);
    };
    return g;
  }
  const surface = (c, dx = 0, dy = 0) =>
    wrap(c, (x, y, col) => c.set(x + dx, y + dy, col), (x, y) => c.get(x + dx, y + dy), (x, y) => c.clear(x + dx, y + dy));

  /**
   * The maker for one setting: mk(slug, name, fn) adds a creature whose two pictures are drawn by fn(g, r) — r is
   * 0 for the main picture and 1 for the roused one. fn draws in coordinates of its own (any, also negative); each
   * picture is measured and gets a canvas that fits it, with a free pixel all round for the outline. (Numbers
   * between name and fn are the sizes the creature was planned at, and are not used.)
   */
  const O = 40;
  const fit = (fn, r) => {
    const big = canvas(160, 160),
      res = fn(surface(big, O, O), r);
    let x0 = 1e9,
      y0 = 1e9,
      x1 = -1,
      y1 = -1;
    for (let y = 0; y < big.h; y++)
      for (let x = 0; x < big.w; x++)
        if (big.get(x, y)) {
          x0 = Math.min(x0, x);
          x1 = Math.max(x1, x);
          y0 = Math.min(y0, y);
          y1 = Math.max(y1, y);
        }
    const pad = res === false ? 0 : 1;
    return { w: x1 - x0 + 1 + 2 * pad, h: y1 - y0 + 1 + 2 * pad, draw: (c) => fn(surface(c, pad + O - x0, pad + O - y0), r) };
  };
  const maker = (out, prefix, cat, catLabel) => (slug, name, ...rest) => {
    const fn = rest.find((a) => typeof a === 'function');
    out[prefix + slug] = { cat, catLabel, group: 'char', name, ...fit(fn, 0), views: { used: fit(fn, 1) } };
  };
  return { P, vd, curve, surface, maker, wrap };
};
