/*
 * The living and the undead at paper-doll scale: apparitions, monsters, animals and creatures.
 * Human-shaped things are built on man(), which lays a figure out exactly like the dolls (16 x 33: head 8 px of
 * face, torso, arms hanging at the sides, two legs); four-legged ones on quad(), birds on bird(), fish on fish().
 */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd, canvas }) => {
  const S = {};
  const prep = (c) => {
    c.pts = (list, col) => {
      for (const [x, y] of list) c.set(x, y, col);
    };
    return c;
  };
  const sp = (slug, w, h, draw, more) => (S[slug] = { w, h, draw: (c) => draw(prep(c)), ...more });

  /* ---------- colours of our own ---------- */
  const GH = C.ghost,
    GHD = hex('#62757f'),
    GHL = hex('#dfe8e4'),
    PALE = hex('#d6c2a6'),
    ASHEN = hex('#9aa29a'),
    DROWN = hex('#8fa6bb'),
    BONE = C.bone,
    NIGHT = C.night,
    EYE = hex('#e8e2c0'),
    REDEYE = hex('#d2392c'),
    YEL = hex('#d9c04a'),
    PINK = hex('#b98a86'),
    PURPLE = hex('#5d4274'),
    FUR = hex('#7a5a3c'),
    GREY = hex('#7d7a78'),
    ORANGE = hex('#b3692c'),
    GREEN = hex('#55733e'),
    BLUE = hex('#3f5f86'),
    ICE = hex('#a9cdd6');
  const vd = (col) => mix(col, 0.42); // a very dark tone of a colour: seams, slits

  /* ---------- a view of a canvas moved by dx, dy: draw a figure in its own coordinates anywhere ---------- */
  function at(c, dx, dy) {
    const g = {
      c,
      dx,
      dy,
      set: (x, y, col) => c.set(x + dx, y + dy, col),
      get: (x, y) => c.get(Math.round(x + dx), Math.round(y + dy)),
      clear: (x, y) => c.clear(x + dx, y + dy),
      clearRect: (a, b, d, e) => c.clearRect(a + dx, b + dy, d + dx, e + dy),
      rect: (a, b, d, e, col) => c.rect(a + dx, b + dy, d + dx, e + dy, col),
      box: (a, b, d, e, col) => c.box(a + dx, b + dy, d + dx, e + dy, col),
      frame: (a, b, d, e, col) => c.frame(a + dx, b + dy, d + dx, e + dy, col),
      row: (y, a, b, col) => c.row(y + dy, a + dx, b + dx, col),
      col: (x, a, b, col) => c.col(x + dx, a + dy, b + dy, col),
      line: (a, b, d, e, col) => c.line(a + dx, b + dy, d + dx, e + dy, col),
      oval: (a, b, d, e, col) => c.oval(a + dx, b + dy, d + dx, e + dy, col),
      poly: (pts, col) => c.poly(pts.map((p) => [p[0] + dx, p[1] + dy]), col),
      speckle: (a, b, d, e, col, n, s) => c.speckle(a + dx, b + dy, d + dx, e + dy, col, n, s),
      dither: (a, b, d, e, col) => c.dither(a + dx, b + dy, d + dx, e + dy, col),
      pts: (list, col) => {
        for (const [x, y] of list) c.set(x + dx, y + dy, col);
      },
    };
    return g;
  }
  /** Mirror view: x -> m - x (for the right-hand arm of a figure, or a beast facing the other way). */
  function flipX(g, m) {
    const f = {
      set: (x, y, col) => g.set(m - x, y, col),
      get: (x, y) => g.get(m - x, y),
      clear: (x, y) => g.clear(m - x, y),
      rect: (a, b, d, e, col) => g.rect(m - d, b, m - a, e, col),
      row: (y, a, b, col) => g.row(y, m - b, m - a, col),
      col: (x, a, b, col) => g.col(m - x, a, b, col),
      line: (a, b, d, e, col) => g.line(m - a, b, m - d, e, col),
      oval: (a, b, d, e, col) => g.oval(m - d, b, m - a, e, col),
      poly: (pts, col) => g.poly(pts.map((p) => [m - p[0], p[1]]), col),
      pts: (list, col) => g.pts(list.map((p) => [m - p[0], p[1]]), col),
    };
    return f;
  }
  /** Whole-canvas helpers. */
  const each = (c, fn) => {
    for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (c.get(x, y)) fn(x, y, c.get(x, y));
  };
  /** Turn everything drawn into pale spectral tones (a ghost keeps its features but loses its colours). */
  function spectral(c, lo = hex('#465a66'), hi = GHL) {
    each(c, (x, y, p) => {
      const l = Math.min(1, (p[0] + p[1] + p[2]) / 3 / 215);
      c.px[y * c.w + x] = blend(lo, hi, Math.pow(l, 1.3));
    });
  }
  /** The bottom rows dissolve into a checkerboard, then into nothing: no feet, it floats. */
  function fade(c, y0, y1) {
    for (let y = y0; y <= y1; y++)
      for (let x = 0; x < c.w; x++) {
        const t = (y - y0) / Math.max(1, y1 - y0);
        if ((x + y) % 2 === 0 || (t > 0.6 && x % 2 === 0) || (t > 0.85 && (x + y) % 4 !== 1)) c.clear(x, y);
      }
  }
  /** A ragged hem: bites out of the bottom edge of what is drawn. */
  function ragged(c, y1, depth = 3, seed = 3) {
    const r = rnd(seed);
    for (let x = 0; x < c.w; x++) {
      const d = Math.floor(r() * (depth + 1));
      for (let y = y1; y > y1 - d; y--) c.clear(x, y);
    }
  }
  const soft = (c, col) => c.outline(col); // an outline in a colour of our choosing

  /* ---------- heads ---------- */
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
  function skull(g, x, y, col = BONE, eye = K) {
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
    fangs(g, x, y, s, e) {
      g.pts([[x + 2, y + 3], [x + 5, y + 3]], e);
      g.pts([[x + 1, y + 2], [x + 2, y + 2], [x + 5, y + 2], [x + 6, y + 2]], K);
      g.row(y + 6, x + 2, x + 5, C.blood);
      g.pts([[x + 2, y + 7], [x + 5, y + 7]], C.white);
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
    widow(g, h) {
      HAIR.crop(g, h);
      g.row(4, 4, 11, h);
      g.rect(5, 4, 6, 4, null);
      g.pts([[7, 5], [8, 5], [4, 5], [11, 5]], h);
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
    witch(g, h, band = C.plum) {
      g.row(3, 1, 14, h);
      g.rect(4, 1, 11, 2, h);
      g.row(2, 4, 11, band);
      g.rect(5, -1, 10, 0, h);
      g.rect(6, -3, 9, -2, h);
      g.rect(7, -5, 9, -4, h);
      g.rect(8, -6, 10, -6, h);
      g.set(11, -5, h);
      g.col(5, -1, 1, lite(h));
    },
    helmet(g, h) {
      g.row(1, 5, 10, h);
      g.rect(4, 2, 11, 5, h);
      g.rect(3, 4, 12, 5, h);
      g.row(1, 6, 8, lite(h));
      g.col(4, 2, 4, lite(h));
      g.col(7, 5, 8, h);
      g.col(8, 5, 8, dark(h));
    },
  };
  /** A hood round the face. void: the face is a dark hole. */
  function hood(g, h, hy = 0) {
    g.row(1 + hy, 5, 10, h);
    g.row(2 + hy, 4, 11, h);
    g.rect(3, 3 + hy, 12, 11 + hy, h);
    g.row(12 + hy, 4, 11, h);
    g.col(3, 4 + hy, 9 + hy, lite(h));
    g.row(1 + hy, 6, 8, lite(h));
    g.col(12, 3 + hy, 11 + hy, dark(h));
  }

  /* ---------- the figure ---------- */
  function arm(g, pose, yT, tl, slv, hand) {
    const b = yT + tl; // last row of the hand
    if (pose === 'down') {
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, b - 2, slv);
      g.rect(1, b - 1, 3, b, hand);
      g.set(1, yT + 1, lite(slv));
    } else if (pose === 'fwd') {
      // stretched towards us: a short sleeve and a big hand
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
    } else if (pose === 'out') {
      g.rect(-2, yT + 1, 3, yT + 3, slv);
      g.row(yT + 3, -2, 3, dark(slv));
      g.rect(-4, yT + 1, -3, yT + 3, hand);
    } else if (pose === 'reach') {
      // out and a little down, fingers spread
      g.rect(1, yT, 3, yT + 2, slv);
      g.rect(-1, yT + 2, 2, yT + 4, slv);
      g.rect(-3, yT + 4, 0, yT + 6, slv);
      g.rect(-5, yT + 5, -3, yT + 7, hand);
      g.pts([[-6, yT + 5], [-6, yT + 7], [-5, yT + 8]], hand);
    } else if (pose === 'hold') {
      // bent at the elbow, the hand in front of the chest
      g.rect(2, yT, 3, yT, slv);
      g.rect(1, yT + 1, 3, yT + 5, slv);
      g.rect(2, yT + 5, 5, yT + 6, slv);
      g.row(yT + 6, 2, 5, dark(slv));
      g.rect(6, yT + 4, 7, yT + 6, hand);
    }
  }
  /**
   * A figure in the doll's proportions, in its own coordinates: 0..15 across, the head at the top (hair from row 1,
   * face rows 3..11), the feet on row 11 + tl + ll. Hats and raised arms go above row 0 and outside 0..15, so the
   * caller leaves room (see fig()).
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
    // legs, or a robe down to the floor
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
    // torso
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
    // arms
    const sides = [
      [poses.l, g],
      [poses.r, flipX(g, 15)],
    ];
    for (const [pose, v] of sides) {
      if (pose === 'down') v.col(4, yT + 1, yL - 1, vd(slv));
      arm(v, pose, yT, tl, slv, hand);
    }
    // head
    if (o.head !== false) {
      const h = at(g, o.hx || 0, hy);
      if (o.hood) {
        hood(h, o.hood);
        g.row(yT, 3, 12, o.hood);
        g.pts([[2, yT + 1], [13, yT + 1]], o.hood);
        if (o.face === 'void') {
          h.rect(5, 4, 10, 10, NIGHT);
          h.row(11, 6, 9, NIGHT);
          if (o.eye) h.pts([[6, 6], [9, 6]], o.eye);
        } else if (o.face === 'skull') {
          h.rect(5, 4, 10, 10, NIGHT);
          skull(h, 4, 3, o.skin || BONE);
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
        if (o.face === 'skull') skull(h, 4, 3, o.skin || BONE, o.eye || K);
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
  }
  /** A sprite of one figure: pad = [left, top, right] extra room for hats, raised arms and things carried. */
  function fig(slug, o, pad = [0, 0, 0], more) {
    const [l, t, r] = pad,
      h = 12 + (o.tl || 10) + (o.ll == null ? 10 : o.ll) + 1 + t;
    S[slug] = {
      w: 16 + l + r,
      h,
      draw(c) {
        const g = at(prep(c), l, t);
        man(g, o);
        if (o.after) return o.after(c, g);
      },
      ...more,
    };
  }
  /** Small things figures carry. */
  const candle = (g, x, y) => {
    g.col(x, y, y + 3, C.cream);
    g.set(x, y - 1, C.flame);
    g.set(x, y - 2, C.flameLight);
  };
  const lantern = (g, x, y) => {
    g.col(x + 1, y - 2, y - 1, C.ironDark);
    g.rect(x, y, x + 2, y + 4, C.ironDark);
    g.rect(x, y + 1, x + 2, y + 3, C.flame);
    g.set(x + 1, y + 2, C.flameLight);
  };
  const blade = (g, x, y, len = 5, dir = -1) => {
    g.col(x, y, y + dir * (len - 1), C.steel);
    g.set(x, y - dir, C.woodDark);
    g.pts([[x - 1, y - dir], [x + 1, y - dir]], C.brass);
    g.set(x, y - 2 * dir, C.woodDark);
  };
  const blood = (g, list) => g.pts(list, C.blood);

  /* ================= APPARITIONS ================= */
  /* --- ghosts: pale, soft-edged, no feet --- */
  const ghostEnd = (c, y0, o = {}) => {
    spectral(c, o.lo, o.hi);
    fade(c, y0, c.h - 2);
    soft(c, o.line || mix(GHD, 0.7));
    return false;
  };
  sp('ghost-sheet', 16, 30, (c) => {
    c.oval(3, 1, 12, 12, GH);
    c.rect(3, 7, 12, 20, GH);
    c.rect(2, 12, 13, 27, GH);
    c.rect(1, 20, 14, 27, GH);
    for (const x of [1, 2, 6, 7, 11, 12]) c.clear(x, 27);
    for (const x of [1, 7, 12]) c.clear(x, 26);
    c.col(3, 4, 20, GHL);
    c.col(2, 12, 24, GHL);
    c.col(8, 14, 26, dark(GH));
    c.col(11, 16, 26, dark(GH));
    c.col(5, 18, 26, dark(GH));
    c.col(13, 12, 26, GHD);
    c.rect(5, 5, 6, 7, K);
    c.rect(9, 5, 10, 7, K);
    c.rect(7, 10, 8, 12, K);
    fade(c, 24, 28);
    soft(c, mix(GHD, 0.7));
    return false;
  });
  fig('ghost-lady', { skin: PALE, face: 'hollow', hair: ['long', C.white, 20], top: C.stone, robe: C.stone, hand: PALE }, [0, 0, 0], { outline: false });
  S['ghost-lady'].draw = ((d) => (c) => {
    d(c);
    return ghostEnd(c, 25);
  })(S['ghost-lady'].draw);
  const ghostFig = (slug, o, pad, y0, extra) =>
    fig(
      slug,
      {
        ...o,
        after(c, g) {
          if (extra) extra(g, c);
          return ghostEnd(c, y0 + (pad ? pad[1] : 0));
        },
      },
      pad,
    );
  ghostFig('ghost-child', { skin: PALE, face: 'hollow', hair: ['plaits', C.slate], top: C.stoneLight, robe: C.stoneLight, tl: 7, ll: 7 }, [0, 0, 0], 21);
  ghostFig('ghost-headless', { head: false, top: C.ash, robe: C.ash, shirt: C.white, arms: { l: 'hold', r: 'down' }, sleeve: C.ash, hand: PALE }, [0, 0, 0], 26, (g) => {
    g.rect(6, 10, 9, 11, PALE); // the stump of the neck
    g.row(10, 6, 9, C.blood);
    face(g, 1, 14, PALE); // its own head, held in the crook of the arm
    FACES.hollow(g, 1, 14, PALE, K);
    g.row(14, 2, 7, C.slate);
    g.col(1, 15, 17, C.slate);
    g.rect(2, 22, 6, 23, C.ash);
  });
  ghostFig('ghost-bride', { skin: PALE, face: 'hollow', hair: ['long', C.slate, 12], top: C.stoneLight, robe: C.stoneLight, arms: 'hold' }, [0, 0, 0], 26, (g) => {
    for (let y = 1; y <= 19; y++) for (const x of [2, 3, 12, 13]) if ((x + y) % 2) g.set(x, y, C.white); // the veil
    g.row(1, 4, 11, C.white);
    g.row(0, 6, 9, C.white);
    g.rect(6, 14, 9, 16, C.earth); // dead flowers
    g.pts([[6, 14], [8, 13], [9, 15]], C.wine);
    g.pts([[7, 17], [8, 18], [7, 19]], C.moss);
  });
  sp(
    'ghost-face',
    16,
    20,
    (c) => {
      c.oval(2, 1, 13, 18, GH);
      c.rect(4, 14, 11, 18, GH);
      c.col(3, 5, 12, GHL);
      c.col(4, 3, 8, GHL);
      c.rect(4, 5, 6, 8, K); // hollow eyes
      c.rect(9, 5, 11, 8, K);
      c.set(4, 5, GH);
      c.set(11, 5, GH);
      c.rect(6, 11, 9, 17, K); // the mouth, wide open
      c.row(10, 7, 8, K);
      c.set(7, 9, dark(GH));
      c.col(12, 6, 14, GHD);
      fade(c, 16, 19);
      for (const [x, y] of [[2, 6], [13, 9], [3, 13], [12, 3]]) c.clear(x, y);
      soft(c, mix(GHD, 0.6));
      return false;
    },
  );
  ghostFig(
    'ghost-soldier',
    { skin: PALE, face: 'hollow', hat: ['cap', C.slate], top: C.slate, legs: C.slate, belt: C.black, shoe: C.black },
    [0, 0, 0],
    27,
    (g) => {
      g.rect(4, 4, 11, 5, C.white); // a bandage round the head
      g.set(9, 5, C.blood);
      g.line(5, 13, 10, 20, C.woodDark); // a strap across the chest
      g.pts([[7, 14], [7, 16], [7, 18]], C.brass);
      g.rect(13, 16, 13, 30, C.woodDark); // the rifle, butt on the ground
      g.col(13, 9, 16, C.ironDark);
    },
  );

  /* --- shadows: flat dark, white eyes, no outline --- */
  const SH = hex('#17151f'),
    SHL = hex('#2a2735');
  sp(
    'shadow-man',
    18,
    35,
    (c) => {
      const g = at(c, 1, 2);
      man(g, { skin: SH, face: 'none', top: SH, legs: SH, shoe: SH, hand: SH, coat: SH, coatLen: 6, hat: ['brim', SH], neck: false });
      each(c, (x, y) => (c.px[y * c.w + x] = SH));
      g.pts([[6, 6], [9, 6]], EYE);
      g.col(1, 14, 20, SHL);
      g.col(4, 23, 28, SHL);
      g.row(0, 6, 9, SHL);
    },
    { outline: false, shade: false },
  );
  sp(
    'shadow-tall',
    22,
    46,
    (c) => {
      c.oval(8, 1, 13, 8, SH); // a small head, high up
      c.rect(9, 8, 12, 10, SH);
      c.rect(7, 10, 14, 24, SH); // a narrow chest
      c.rect(8, 24, 13, 28, SH);
      c.rect(8, 28, 10, 44, SH); // legs like stilts
      c.rect(11, 28, 13, 44, SH);
      c.row(44, 7, 10, SH);
      c.row(44, 11, 14, SH);
      // arms far too long, the fingers spread
      c.rect(5, 10, 6, 13, SH);
      c.rect(4, 12, 5, 30, SH);
      c.rect(15, 10, 16, 13, SH);
      c.rect(16, 12, 17, 30, SH);
      for (const [x, d] of [[2, 6], [3, 8], [4, 9], [5, 8], [6, 5]]) c.line(4, 30, x, 30 + d, SH);
      for (const [x, d] of [[15, 5], [16, 8], [17, 9], [18, 8], [19, 6]]) c.line(17, 30, x, 30 + d, SH);
      c.set(9, 4, EYE);
      c.set(12, 4, EYE);
      c.col(7, 11, 22, SHL);
      c.col(8, 29, 40, SHL);
    },
    { outline: false, shade: false },
  );
  sp(
    'shadow-crawler',
    34,
    14,
    (c) => {
      c.oval(24, 4, 31, 10, SH); // head, low, looking at us
      c.rect(8, 3, 25, 8, SH); // the back
      c.row(2, 10, 20, SH);
      c.line(8, 3, 3, 6, SH);
      // limbs bent like a spider's
      c.line(10, 6, 6, 2, SH);
      c.line(6, 2, 3, 12, SH);
      c.line(7, 2, 4, 12, SH);
      c.line(13, 8, 11, 12, SH);
      c.line(14, 8, 12, 12, SH);
      c.line(22, 6, 26, 1, SH);
      c.line(26, 1, 28, 12, SH);
      c.line(27, 1, 29, 12, SH);
      c.line(19, 8, 21, 12, SH);
      c.line(20, 8, 22, 12, SH);
      c.row(12, 1, 4, SH);
      c.row(12, 9, 12, SH);
      c.row(12, 21, 24, SH);
      c.row(12, 28, 32, SH);
      c.set(26, 6, EYE);
      c.set(29, 6, EYE);
      c.row(3, 10, 18, SHL);
    },
    { outline: false, shade: false },
  );

  /* --- robed and hooded --- */
  const tatter = (c, seed) => ragged(c, c.h - 2, 4, seed);
  fig(
    'wraith',
    {
      hood: hex('#2b2a36'),
      face: 'void',
      eye: hex('#9fd6c8'),
      top: hex('#2b2a36'),
      robe: hex('#2b2a36'),
      arms: 'reach',
      hand: BONE,
      after(c, g) {
        g.rect(2, 22, 13, 31, hex('#2b2a36'));
        g.col(6, 22, 31, vd(hex('#2b2a36')));
        g.col(10, 24, 31, vd(hex('#2b2a36')));
        tatter(c, 5);
        for (const x of [3, 4, 9, 14, 15, 20]) c.clearRect(x, c.h - 6, x, c.h - 2);
      },
    },
    [6, 0, 6],
  );
  const robed = (slug, col, o = {}, pad, extra) =>
    fig(slug, { hood: col, top: col, robe: col, ...o, after: extra ? (c, g) => extra(g, c) : undefined }, pad);
  robed('hooded-figure', hex('#3a3a46'), { face: 'void', arms: 'down', hand: hex('#3a3a46') });
  robed('cultist-red', C.wine, { face: 'void', eye: EYE, arms: { l: 'hold', r: 'down' }, hand: PALE, belt: C.brass }, [0, 0, 0], (g) => {
    candle(g, 7, 12);
    g.rect(6, 16, 7, 17, PALE);
  });
  robed('cultist-dagger', C.black, { face: 'void', eye: REDEYE, arms: { l: 'down', r: 'up' }, hand: PALE, belt: C.wine }, [0, 4, 3], (g) => {
    blade(g, 15, -1, 5, -1);
    g.col(7, 14, 20, C.wine);
    g.pts([[6, 15], [8, 15]], C.wine);
  });
  robed('cultist-mask', C.cream, { skin: BONE, face: 'hollow', arms: 'down', hand: PALE, belt: C.earth }, [2, 6, 2], (g) => {
    g.rect(6, 9, 9, 13, BONE); // a long animal skull for a mask
    g.pts([[7, 13], [8, 13]], vd(BONE));
    g.row(13, 6, 9, dark(BONE));
    // antlers
    for (const v of [g, flipX(g, 15)]) {
      v.line(5, 2, 2, -4, C.woodPale);
      v.line(3, -1, 0, -2, C.woodPale);
      v.line(3, -3, 5, -5, C.woodPale);
      v.set(1, -5, C.woodPale);
    }
    g.pts([[5, 20], [10, 24], [6, 27]], C.blood);
  });
  fig('monk-hooded', { hood: C.earth, top: C.earth, robe: C.earth, arms: 'hold', hand: C.flesh, skin: C.flesh, face: 'dead',
    after(c, g) {
      g.rect(7, 15, 8, 17, C.flesh); // hands together
      g.col(8, 15, 17, dark(C.flesh));
      g.row(21, 4, 11, C.straw); // rope belt
      g.col(9, 22, 27, C.straw);
      g.set(9, 28, dark(C.straw));
    } });
  fig('monk-skull', { hood: C.black, face: 'skull', top: C.black, robe: C.black, arms: { l: 'hold', r: 'down' }, hand: BONE,
    after(c, g) {
      candle(g, 6, 11);
      g.pts([[7, 22], [8, 23], [7, 24], [8, 25]], C.ash); // beads
      g.rect(7, 26, 8, 27, C.brass);
    } });

  /* --- the walking dead --- */
  fig('zombie-shambler', { skin: C.rot, face: 'hollow', hair: ['thin', C.black], top: C.ash, legs: C.earth, shoe: false, arms: 'fwd', sleeve: C.ash,
    after(c, g) {
      g.pts([[6, 15], [9, 18], [5, 19]], C.rot); // skin through the holes
      g.rect(8, 14, 9, 15, C.blood);
      g.set(8, 16, C.blood);
      g.row(9, 6, 9, K); // the jaw hangs
      g.set(7, 10, C.blood);
      g.rect(4, 30, 6, 31, C.rot); // bare feet
      g.rect(8, 30, 11, 31, C.rot);
      g.pts([[5, 27], [10, 25], [9, 29]], dark(C.earth));
      g.clear(11, 29);
      g.clear(4, 28);
      g.pts([[1, 21], [14, 20]], C.blood);
    } });
  sp('zombie-crawler', 34, 12, (c) => {
    const R = C.rot;
    // the trail it leaves
    c.row(10, 1, 9, C.blood);
    c.row(9, 4, 8, dark(C.blood));
    c.rect(7, 5, 20, 9, C.ash); // torso flat on the floor, ending in rags
    c.row(4, 9, 19, C.ash);
    for (const [x, y] of [[7, 5], [7, 7], [8, 9], [6, 8], [6, 6]]) c.set(x, y, C.blood);
    c.set(7, 6, null);
    c.col(13, 5, 9, dark(C.ash));
    c.rect(15, 6, 16, 7, R);
    // head, raised
    c.rect(21, 1, 27, 7, R);
    c.row(0, 22, 26, C.black);
    c.set(21, 1, C.black);
    c.col(21, 2, 3, C.black);
    c.rect(24, 3, 25, 4, K);
    c.row(6, 24, 27, K);
    c.set(26, 7, C.blood);
    // arms dragging it forward
    c.rect(19, 8, 25, 9, C.ash);
    c.rect(26, 8, 31, 9, R);
    c.set(32, 10, R);
    c.set(32, 8, R);
    c.rect(17, 9, 22, 10, C.ash);
    c.rect(23, 10, 28, 10, R);
    c.set(29, 10, R);
  });
  sp('ghoul', 20, 28, (c) => {
    const G = hex('#878a86');
    c.rect(6, 7, 14, 16, G); // hunched back
    c.row(6, 8, 13, G);
    c.rect(7, 16, 13, 19, G);
    for (const y of [10, 12, 14]) c.row(y, 9, 12, dark(G)); // ribs
    c.rect(7, 19, 9, 25, G); // bent legs
    c.rect(11, 19, 13, 25, G);
    c.rect(5, 25, 9, 26, G);
    c.rect(11, 25, 15, 26, G);
    c.rect(4, 19, 12, 20, C.earth); // a rag
    c.rect(7, 21, 9, 21, C.earth);
    // long arms and claws
    c.rect(3, 8, 5, 18, G);
    c.rect(2, 16, 4, 22, G);
    c.rect(15, 8, 17, 18, G);
    c.rect(16, 16, 18, 22, G);
    for (const x of [1, 3, 5]) c.col(x, 23, 25, BONE);
    for (const x of [15, 17, 19]) c.col(x, 23, 25, BONE);
    // head thrust forward and low
    c.rect(6, 1, 13, 8, G);
    c.row(0, 7, 12, G);
    c.set(6, 1, null);
    c.rect(7, 3, 8, 4, K);
    c.rect(11, 3, 12, 4, K);
    c.set(8, 4, REDEYE);
    c.set(12, 4, REDEYE);
    c.rect(7, 6, 12, 8, K); // the mouth
    for (const x of [7, 9, 11]) c.set(x, 6, C.white);
    for (const x of [8, 10, 12]) c.set(x, 8, C.white);
    c.set(9, 9, C.blood);
    c.set(10, 10, C.blood);
  });
  /** A skeleton standing in the doll's proportions. */
  function bones(g, o = {}) {
    const B = o.col || BONE,
      D = dark(B);
    if (o.head !== false) skull(g, 4, 3, B, o.eye || K);
    g.col(7, 12, 21, B); // the spine
    g.col(8, 12, 21, D);
    g.row(13, 3, 12, B); // collar bones
    for (const y of [15, 17, 19]) {
      g.row(y, 5, 10, B); // ribs
      g.set(10, y, D);
    }
    g.row(16, 5, 5, B);
    g.row(18, 5, 5, B);
    g.pts([[10, 16], [10, 18]], D);
    g.rect(5, 22, 10, 23, B); // pelvis
    g.pts([[7, 23], [8, 23]], vd(B));
    for (const v of [g, flipX(g, 15)]) {
      if (o.arms !== false) {
        v.col(2, 13, 17, B); // arm
        v.set(2, 18, D);
        v.col(2, 19, 22, B);
        v.pts([[1, 23], [2, 23], [3, 23], [1, 24], [3, 24]], B); // fingers
      }
      v.col(5, 24, 26, B); // leg
      v.set(5, 27, D);
      v.col(5, 28, 30, B);
      v.rect(3, 31, 5, 31, B);
    }
  }
  sp('skeleton-standing', 16, 33, (c) => bones(c));
  sp('skeleton-armoured', 18, 34, (c) => {
    const g = at(c, 1, 1);
    bones(g);
    const R = C.rust,
      I = C.iron;
    HATS.helmet(g, I);
    g.pts([[5, 2], [9, 3], [11, 5]], R);
    g.rect(4, 13, 11, 20, I); // breastplate, eaten by rust
    g.col(4, 13, 20, lite(I));
    g.row(20, 4, 11, dark(I));
    g.col(7, 14, 19, dark(I));
    g.pts([[5, 15], [9, 14], [10, 18], [6, 19], [9, 19]], R);
    g.rect(1, 12, 3, 14, I); // pauldrons
    g.rect(12, 12, 14, 14, I);
    g.set(13, 13, R);
    g.col(15, 2, 31, C.woodDark); // a halberd to lean on
    g.rect(14, 1, 16, 4, C.steel);
    g.set(15, 0, C.steel);
    g.set(16, 3, R);
  });
  sp('skeleton-sitting', 26, 22, (c) => {
    const B = BONE,
      D = dark(B);
    const g = at(c, 0, 0);
    skull(g, 3, 2, B); // head sunk on the chest
    c.col(6, 11, 17, B); // spine
    c.col(7, 11, 17, D);
    for (const y of [12, 14, 16]) c.row(y, 4, 10, B);
    c.rect(4, 18, 9, 19, B); // pelvis
    c.row(19, 9, 16, B); // thigh
    c.set(17, 19, D);
    c.row(19, 18, 22, B); // shin
    c.col(23, 17, 19, B); // foot, toes up
    c.row(18, 8, 14, D); // the other leg, knee bent a little
    c.line(15, 17, 19, 19, B);
    c.col(2, 12, 16, B); // arms hanging
    c.line(2, 17, 1, 19, B);
    c.col(11, 12, 15, B);
    c.line(11, 16, 13, 19, B);
    for (const [x, y] of [[20, 20], [14, 20], [1, 20]]) c.set(x, y, D);
    // a cobweb between skull and shoulder
    c.set(11, 9, C.ash);
    c.set(12, 10, C.ash);
    c.set(12, 11, C.ash);
  });
  sp('skeleton-reaching', 36, 10, (c) => {
    const B = BONE,
      D = dark(B);
    const g = at(c, 0, 0);
    skull(g, 22, 0, B);
    c.clearRect(22, 8, 30, 9);
    c.row(7, 8, 22, B); // spine along the floor
    for (const x of [13, 15, 17, 19]) c.col(x, 4, 7, B); // ribs
    c.row(4, 13, 19, D);
    c.rect(7, 6, 9, 8, B); // pelvis
    c.row(8, 1, 6, B); // legs trailing
    c.set(4, 8, D);
    c.line(1, 6, 7, 7, B);
    c.row(8, 20, 27, B); // the arm it reached out with
    c.set(27, 8, D);
    c.row(8, 28, 32, B);
    for (const [x, y] of [[33, 7], [34, 7], [33, 8], [34, 8], [33, 6]]) c.set(x, y, B);
    c.line(17, 8, 22, 8, D);
  });
  fig('mummy-shuffling', { skin: C.parchment, face: 'none', top: C.parchment, legs: C.parchment, shoe: false, arms: 'fwd', hand: C.parchment, neck: false,
    after(c, g) {
      const P = C.parchment,
        D = dark(P);
      for (const y of [5, 9, 14, 17, 20, 24, 27, 30]) g.row(y, 4, 11, D); // the wrappings
      g.line(4, 7, 11, 5, D);
      g.line(5, 22, 10, 19, D);
      g.rect(5, 6, 10, 7, K); // a dark slit for the eyes
      g.pts([[6, 6], [9, 6]], YEL);
      g.pts([[1, 15], [14, 15], [2, 18], [13, 18]], D);
      g.col(0, 20, 26, P); // a loose end trailing
      g.set(1, 27, P);
      g.row(31, 3, 12, D);
      g.speckle(4, 3, 11, 31, lite(P), 7, 4);
    } }, [1, 0, 0]);
  /** A cape hanging from the shoulders behind the figure, down to row y1. */
  const cape = (g, col, lining, y1 = 29) => {
    g.rect(0, 13, 15, y1 - 3, col);
    g.rect(1, y1 - 2, 14, y1, col);
    g.col(0, 14, y1 - 3, lite(col));
    if (lining) {
      g.rect(3, 22, 12, y1, lining);
      g.col(3, 22, y1, dark(lining));
    }
  };
  sp('vampire-count', 18, 34, (c) => {
    const g = at(c, 1, 1);
    cape(g, C.black, C.wine);
    g.rect(1, 8, 3, 13, C.black); // the high collar
    g.rect(12, 8, 14, 13, C.black);
    g.col(3, 9, 12, C.wine);
    g.col(12, 9, 12, C.wine);
    man(g, { skin: hex('#cfc8b8'), face: 'fangs', eye: REDEYE, hair: ['widow', C.black], top: C.black, shirt: C.white, legs: C.black, sleeve: C.black });
    g.pts([[7, 13], [8, 13]], C.blood); // a red jewel at the throat
    g.col(7, 17, 20, C.wine);
    g.col(8, 17, 20, dark(C.wine));
  });
  sp('vampire-bat-form', 34, 34, (c) => {
    const g = at(c, 9, 1),
      W = C.black,
      M = hex('#3a2a3e');
    // cloak become wings: ribs fanning from the shoulders
    for (const v of [g, flipX(g, 15)]) {
      v.poly([[3, 12], [-8, 6], [-8, 20], [-5, 17], [-3, 21], [0, 18], [3, 23]], M);
      v.line(3, 12, -8, 6, W);
      v.line(3, 13, -8, 19, W);
      v.line(3, 13, -3, 20, W);
      v.line(3, 13, 2, 22, W);
      v.set(-8, 5, W);
    }
    man(g, { skin: hex('#a9a39a'), face: 'fangs', eye: REDEYE, hair: ['crop', W], top: W, legs: W, arms: 'none', sleeve: W });
    g.rect(3, -1, 4, 3, W); // ears like a bat's
    g.rect(11, -1, 12, 3, W);
    g.pts([[4, 1], [11, 1]], PINK);
    g.pts([[7, 7], [8, 7]], K); // a flat snout
    g.rect(3, 13, 4, 20, W);
    g.rect(11, 13, 12, 20, W);
    g.pts([[5, 31], [3, 31], [10, 31], [12, 31]], hex('#a9a39a')); // clawed feet
  });
  sp('witch-crone', 20, 36, (c) => {
    const g = at(c, 1, 9),
      R = C.black,
      SK = hex('#8f9a78');
    // bent double: the head sits low and forward
    g.rect(4, 12, 12, 16, R); // the hump
    g.row(11, 6, 11, R);
    g.rect(4, 16, 11, 25, R);
    g.rect(3, 19, 12, 25, R);
    g.col(6, 17, 25, vd(R));
    g.col(10, 19, 25, vd(R));
    g.row(25, 3, 12, vd(R));
    g.rect(4, 12, 12, 13, hex('#3d3344')); // shawl
    g.pts([[5, 14], [7, 14], [9, 14], [11, 14]], hex('#3d3344'));
    const h = at(g, 4, 2);
    face(h, 4, 3, SK);
    FACES.old(h, 4, 3, SK, K);
    h.pts([[8, 8], [8, 7]], dark(SK)); // a hooked nose
    h.set(9, 8, SK);
    h.set(5, 9, hex('#5d6a4c')); // warts
    h.set(10, 5, hex('#5d6a4c'));
    h.row(9, 6, 8, K);
    h.set(7, 9, C.white);
    h.col(3, 4, 10, C.ash);
    h.col(12, 4, 9, C.ash);
    h.set(4, 10, C.ash);
    HATS.witch(h, R, C.plum);
    g.rect(13, 14, 15, 15, R); // the arm on the stick
    g.rect(15, 15, 16, 16, SK);
    g.col(16, 10, 25, C.woodDark);
    g.pts([[15, 10], [17, 12]], C.woodDark);
    g.rect(2, 15, 3, 20, R);
    g.rect(2, 21, 3, 22, SK);
  });
  sp('scarecrow-man', 22, 36, (c) => {
    const g = at(c, 3, 2),
      SK = hex('#a8946a');
    man(g, { skin: SK, face: 'none', top: C.earth, legs: C.slate, shoe: false, arms: 'out', sleeve: C.earth, hand: C.straw, hat: ['brim', C.woodDark], neck: false, belt: C.straw });
    g.pts([[6, 6], [9, 6]], K); // button eyes
    g.pts([[5, 8], [6, 9], [7, 9], [8, 9], [9, 9], [10, 8]], K); // the stitched grin
    g.pts([[6, 10], [8, 10], [7, 8], [9, 8]], vd(SK));
    g.row(11, 5, 10, C.straw); // tied at the neck
    g.pts([[4, 12], [11, 12], [6, 12]], C.straw);
    g.rect(8, 15, 9, 16, C.mustard); // patches
    g.rect(5, 18, 6, 19, C.wine);
    g.pts([[-5, 12], [-5, 16], [-4, 12], [20, 12], [20, 16], [19, 16]], C.straw); // straw fingers
    g.pts([[4, 31], [5, 31], [3, 30], [9, 31], [11, 31], [12, 30]], C.straw); // straw feet
    g.rect(5, 28, 6, 30, C.slate);
    g.rect(9, 28, 10, 30, C.slate);
    g.pts([[5, 25], [10, 27]], C.straw);
  });
  sp('plague-doctor', 20, 36, (c) => {
    const g = at(c, 2, 2),
      B = hex('#22202a');
    man(g, { skin: hex('#b9b09a'), face: 'none', top: B, legs: B, coat: B, coatLen: 7, sleeve: B, hand: C.black, hat: ['brim', B], neck: false, arms: { l: 'down', r: 'down' } });
    g.rect(5, 4, 10, 8, hex('#b9b09a')); // the mask
    g.rect(5, 5, 6, 6, C.glass); // glass eyes
    g.rect(9, 5, 10, 6, C.glass);
    g.pts([[5, 5], [9, 5]], C.glassLight);
    g.poly([[6, 7], [9, 7], [8, 13], [7, 13]], hex('#b9b09a')); // the beak, pointing down at us
    g.col(8, 8, 13, dark(hex('#b9b09a')));
    g.set(7, 14, dark(hex('#b9b09a')));
    g.rect(4, 9, 5, 11, B);
    g.rect(10, 9, 11, 11, B);
    g.row(21, 4, 11, C.woodDark); // belt and pouch
    g.rect(9, 22, 10, 23, C.woodDark);
    g.col(15, 14, 31, C.woodDark); // cane
    g.row(13, 14, 16, C.brass);
  });
  fig('drowned-one', { skin: DROWN, face: 'hollow', hair: ['long', hex('#27313a'), 16], top: hex('#4a5a5c'), legs: hex('#33393f'), shoe: false, sleeve: hex('#4a5a5c'),
    after(c, g) {
      g.rect(4, 14, 11, 21, hex('#4a5a5c')); // bloated
      g.rect(5, 30, 6, 31, DROWN);
      g.rect(9, 30, 10, 31, DROWN);
      g.set(4, 31, DROWN);
      g.set(11, 31, DROWN);
      for (const [x, y0, y1] of [[5, 13, 18], [10, 14, 17], [2, 14, 17], [9, 22, 26]]) g.col(x, y0, y1, C.moss); // weed
      g.pts([[6, 19], [11, 18], [3, 18]], C.leafLight);
      g.pts([[1, 24], [1, 26], [14, 25], [7, 10], [12, 17], [3, 12]], C.glassLight); // dripping
      g.row(9, 6, 9, K);
      g.speckle(4, 14, 11, 29, hex('#3d4a4c'), 6, 2);
    } });
  sp('faceless-man', 16, 39, (c) => {
    const g = at(c, 0, 0);
    man(g, { skin: hex('#d9d2c2'), face: 'none', top: C.black, legs: C.black, shirt: C.white, tie: C.black, tl: 12, ll: 14, hair: ['bald'] });
    g.set(8, 7, hex('#d9d2c2'));
    g.col(5, 13, 22, vd(C.black));
    g.pts([[6, 14], [9, 14]], hex('#34303c')); // lapels
    g.col(10, 13, 22, hex('#34303c'));
    g.rect(1, 23, 3, 25, hex('#d9d2c2')); // hands hang too low
    g.rect(12, 23, 14, 25, hex('#d9d2c2'));
  });
  fig('masked-child', { skin: C.paper, face: 'none', top: C.mustard, legs: C.navy, tl: 7, ll: 6, neck: false,
    after(c, g) {
      g.rect(3, 1, 12, 11, C.paper); // a paper bag over the head
      g.col(3, 1, 11, lite(C.paper));
      g.col(12, 1, 11, dark(C.paper));
      g.pts([[4, 12], [6, 12], [9, 12], [11, 12]], C.paper);
      g.line(5, 2, 7, 4, dark(C.paper)); // creases
      g.rect(5, 5, 6, 6, K); // the face it drew on
      g.rect(9, 5, 10, 7, K);
      g.pts([[5, 9], [6, 10], [7, 9], [8, 10], [9, 9], [10, 10]], K);
      g.set(5, 7, K);
    } });
  sp('twins', 30, 27, (c) => {
    for (const dx of [0, 14]) {
      const g = at(c, dx, 0);
      man(g, { skin: PALE, face: 'stare', hair: ['bob', hex('#3a2a20')], top: hex('#6f8597'), robe: hex('#6f8597'), tl: 7, ll: 7, hand: PALE });
      g.rect(6, 12, 9, 12, C.white); // collar
      g.row(18, 4, 11, C.white); // sash
      g.rect(5, 23, 6, 25, C.white); // socks under the dress
      g.rect(9, 23, 10, 25, C.white);
      g.rect(4, 25, 6, 25, K);
      g.rect(9, 25, 11, 25, K);
      g.clearRect(3, 23, 4, 24);
      g.clearRect(11, 23, 12, 24);
      g.clearRect(7, 23, 8, 25);
      g.clear(3, 25);
      g.clear(12, 25);
      g.set(7, 1, C.wine); // a ribbon
      g.set(8, 1, C.wine);
    }
    c.rect(13, 19, 16, 20, PALE); // holding hands
  });
  sp('caretaker', 20, 34, (c) => {
    const g = at(c, 1, 2);
    man(g, { skin: C.flesh, face: 'old', hair: ['thin', C.ash], hat: ['cap', C.earth], top: C.ash, legs: hex('#3c4a5e'), sleeve: C.ash, hy: 1,
      arms: { l: 'down', r: 'down' } });
    g.rect(5, 15, 10, 21, hex('#3c4a5e')); // overalls
    g.col(5, 13, 15, hex('#3c4a5e'));
    g.col(10, 13, 15, hex('#3c4a5e'));
    g.pts([[5, 15], [10, 15]], C.brass);
    g.rect(5, 10, 10, 11, C.ash); // grey stubble on the chin
    g.row(10, 6, 9, K);
    g.pts([[9, 22], [10, 23], [9, 24], [10, 24]], C.brass); // a ring of keys
    g.set(9, 23, C.brass);
    lantern(g, 15, 23);
    g.set(15, 22, C.flesh);
  });
  sp('nurse-grim', 18, 34, (c) => {
    const g = at(c, 1, 1);
    man(g, { skin: PALE, face: 'dead', hair: ['bun', C.black], top: hex('#8fa0a8'), robe: hex('#8fa0a8'), ll: 7, apron: C.white, sleeve: hex('#8fa0a8'),
      arms: { l: 'down', r: 'hold' } });
    g.rect(5, 29, 6, 31, PALE); // legs under the hem
    g.rect(9, 29, 10, 31, PALE);
    g.rect(4, 31, 6, 31, K);
    g.rect(9, 31, 11, 31, K);
    g.rect(5, 1, 10, 2, C.white); // the cap, a red cross
    g.rect(7, 0, 8, 0, C.white);
    g.pts([[7, 1], [8, 1]], C.red);
    blood(g, [[6, 17], [7, 18], [6, 19], [9, 21], [8, 24], [9, 25], [5, 26], [7, 20], [6, 18]]);
    g.col(9, 10, 15, C.glassLight); // the syringe
    g.set(9, 9, C.steel);
    g.set(9, 8, C.steel);
    g.row(15, 8, 10, C.steel);
  });
  sp('butler', 20, 34, (c) => {
    const g = at(c, 1, 1);
    man(g, { skin: hex('#cfc8b8'), face: 'dead', hair: ['thin', C.ash], top: C.black, shirt: C.white, tie: C.black, legs: hex('#34323c'), sleeve: C.black,
      arms: { l: 'down', r: 'hold' }, hand: C.white });
    g.rect(4, 22, 5, 26, C.black); // tails
    g.rect(10, 22, 11, 26, C.black);
    g.pts([[6, 13], [9, 13]], C.black);
    g.row(15, 6, 14, C.steel); // the tray
    g.row(15, 6, 8, lite(C.steel));
    g.rect(11, 12, 12, 14, C.glass); // a glass and a dome
    g.rect(13, 13, 14, 14, C.steel);
    g.set(11, 12, C.glassLight);
  });
  sp('sexton', 22, 35, (c) => {
    const g = at(c, 4, 2);
    man(g, { skin: C.flesh, face: 'old', hair: ['thin', C.white], hat: ['brim', C.black], top: hex('#3f3a34'), coat: hex('#3f3a34'), coatLen: 6, legs: C.black,
      sleeve: hex('#3f3a34'), hy: 1 });
    g.rect(5, 10, 10, 12, C.white); // a white beard
    g.row(13, 6, 9, C.white);
    g.row(10, 7, 8, K);
    g.col(-2, 8, 31, C.woodDark); // the spade
    g.rect(-3, 25, -1, 31, C.steel);
    g.row(31, -2, -2, C.steel);
    g.clear(-3, 31);
    g.clear(-1, 31);
    g.pts([[-3, 28], [-2, 30]], C.earth);
    g.row(7, -3, -1, C.woodDark);
    g.set(1, 21, C.flesh);
    lantern(g, 14, 24);
  });
  sp('hanged-figure', 16, 46, (c) => {
    c.col(8, 0, 13, C.straw); // the rope
    for (const y of [1, 4, 7, 10]) c.set(8, y, dark(C.straw));
    const g = at(c, 0, 10);
    man(g, { skin: ASHEN, face: 'dead', hair: ['parted', C.black], top: C.cream, legs: C.earth, shoe: false, hx: 1, hy: 1, sleeve: C.cream });
    g.rect(6, 12, 10, 13, C.straw); // the noose
    g.clearRect(3, 30, 12, 31);
    g.rect(5, 30, 6, 33, ASHEN); // the feet point down
    g.rect(9, 30, 10, 33, ASHEN);
    g.col(7, 23, 29, vd(C.earth));
    g.pts([[6, 16], [9, 19]], dark(C.cream));
  });

  /* --- things half seen --- */
  sp(
    'eyes-in-dark',
    18,
    10,
    (c) => {
      c.oval(1, 1, 16, 8, SH);
      for (let y = 0; y < 10; y++) for (let x = 0; x < 18; x++) if (c.get(x, y) && (x + y) % 2 && (x < 4 || x > 13 || y < 2 || y > 7)) c.clear(x, y);
      for (const x of [5, 10]) {
        c.rect(x, 4, x + 2, 5, YEL);
        c.set(x + 1, 4, K);
        c.set(x + 1, 5, K);
        c.set(x, 4, lite(YEL));
      }
    },
    { outline: false, shade: false },
  );
  sp(
    'eyes-many',
    26,
    22,
    (c) => {
      c.oval(1, 1, 24, 20, SH);
      for (let y = 0; y < 22; y++)
        for (let x = 0; x < 26; x++) if (c.get(x, y) && (x + y) % 2 && ((x - 12.5) / 12) ** 2 + ((y - 10.5) / 10) ** 2 > 0.6) c.clear(x, y);
      const eyes = [[5, 8, 1], [10, 4, 0], [9, 10, 1], [15, 7, 1], [19, 11, 0], [13, 14, 1], [6, 14, 0], [18, 4, 0], [17, 16, 1], [10, 17, 0]];
      for (const [x, y, big] of eyes) {
        c.rect(x, y, x + 1 + big, y + (big ? 1 : 0), big ? YEL : EYE);
        c.set(x + (big ? 1 : 0), y, K);
        if (big) c.set(x + 1, y + 1, K);
      }
      c.row(18, 14, 15, SH); // one of them is shut
    },
    { outline: false, shade: false },
  );
  /** An arm coming up out of the floor at x, h tall, bending by lean. */
  const armUp = (c, x, yb, h, lean, col = ASHEN) => {
    for (let i = 0; i < h; i++) {
      const xx = Math.round(x + (lean * i) / h);
      c.rect(xx, yb - i, xx + 1, yb - i, i === 0 ? dark(col) : col);
    }
    const tx = Math.round(x + lean),
      ty = yb - h;
    c.rect(tx - 1, ty - 1, tx + 2, ty, col); // palm
    for (const fx of [tx - 1, tx + 1, tx + 2]) c.set(fx, ty - 2, col);
    c.set(tx + (lean < 0 ? -2 : 3), ty, col); // thumb
    c.set(tx, ty - 3, col);
  };
  sp('hands-floor', 34, 18, (c) => {
    c.oval(2, 14, 31, 17, SH); // the dark they come out of
    armUp(c, 6, 15, 7, -2);
    armUp(c, 12, 15, 10, 1, PALE);
    armUp(c, 18, 15, 6, -1, C.rot);
    armUp(c, 23, 15, 11, 2);
    armUp(c, 28, 15, 5, 1, PALE);
    c.row(16, 3, 30, SH);
  });
  sp('hand-wall', 22, 10, (c) => {
    c.rect(1, 1, 3, 8, C.stoneDark); // the crack it comes through
    c.col(2, 2, 7, K);
    for (const [x, y] of [[3, 1], [1, 8], [3, 0]]) c.clear(x, y);
    c.rect(3, 4, 13, 6, PALE); // forearm
    c.row(6, 3, 13, dark(PALE));
    c.rect(14, 3, 17, 6, PALE); // the hand, grasping
    c.row(2, 16, 19, PALE);
    c.row(4, 18, 20, PALE);
    c.row(6, 18, 20, PALE);
    c.row(7, 15, 17, PALE);
    c.set(20, 5, dark(PALE));
    c.set(20, 7, PALE);
  });

  /* ---------- four-legged beasts, side on, facing right ---------- */
  const TAILS = {
    none() {},
    up(c, G, o) {
      const n = o.tn || 4;
      c.col(G.bx0 - 1, G.yb - n + 2, G.yb + 1, G.col);
      c.set(G.bx0 - 2, G.yb - n + 1, G.col);
      c.set(G.bx0 - 2, G.yb - n, o.tip || G.col);
    },
    down(c, G, o) {
      const n = o.tn || 4;
      c.line(G.bx0 - 1, G.yb + 1, G.bx0 - 2, G.yb + n, G.col);
      c.set(G.bx0 - 2, G.yb + n, o.tip || G.col);
    },
    out(c, G, o) {
      const n = o.tn || 3;
      c.line(G.bx0 - 1, G.yb + 1, G.bx0 - n, G.yb + 2, o.tip || G.col);
    },
    stub(c, G, o) {
      c.rect(G.bx0 - 1, G.yb, G.bx0 - 1, G.yb + 1, o.tip || G.col);
    },
    bushy(c, G, o) {
      const n = o.tn || 5,
        t = o.tt || 3;
      c.oval(G.bx0 - n, G.yb, G.bx0, G.yb + t, G.col);
      c.rect(G.bx0 - n, G.yb + 1, G.bx0 - n + 1, G.yb + t - 1, o.tip || G.col);
    },
    horse(c, G, o) {
      const n = o.tn || 10,
        h = o.tip || dark(G.col);
      c.rect(G.bx0 - 1, G.yb + 1, G.bx0, G.yb + 3, h);
      c.rect(G.bx0 - 2, G.yb + 2, G.bx0 - 1, G.yb + n, h);
      c.set(G.bx0 - 3, G.yb + n, h);
    },
    thin(c, G, o) {
      const n = o.tn || 8;
      c.col(G.bx0 - 1, G.yb + 1, G.yb + n - 2, G.col);
      c.rect(G.bx0 - 2, G.yb + n - 1, G.bx0 - 1, G.yb + n, o.tip || dark(G.col));
    },
    curl(c, G, o) {
      c.pts([[G.bx0 - 1, G.yb + 2], [G.bx0 - 2, G.yb + 1], [G.bx0 - 2, G.yb + 3]], o.tip || G.col);
    },
    rat(c, G, o) {
      const n = o.tn || 7;
      c.line(G.bx0 - 1, G.y1 - 1, G.bx0 - n, G.y1 + 1, o.tip || PINK);
      c.set(G.bx0 - n - 1, G.y1, o.tip || PINK);
    },
  };
  const EARS = {
    none() {},
    point(c, G, o) {
      const e = o.eh || 2,
        x = G.hl + (o.ex == null ? 1 : o.ex);
      for (let i = 0; i < e; i++) c.row(G.ht - 1 - i, x, x + Math.max(0, Math.ceil((e - i) / 2) - 1), o.earc || G.col);
      if (G.hw >= 5) for (let i = 0; i < e - 1; i++) c.set(x + 3, G.ht - 1 - i, dark(o.earc || G.col));
    },
    round(c, G, o) {
      const x = G.hl + (o.ex == null ? 1 : o.ex);
      c.rect(x, G.ht - (o.eh || 1), x + 1, G.ht - 1, o.earc || G.col);
    },
    flop(c, G, o) {
      const x = G.hl + (o.ex == null ? 0 : o.ex);
      c.rect(x, G.ht + 1, x + 1, G.ht + (o.eh || 3), o.earc || dark(G.col));
    },
    long(c, G, o) {
      const e = o.eh || 4,
        x = G.hl + (o.ex == null ? 1 : o.ex);
      c.rect(x, G.ht - e, x + 1, G.ht - 1, o.earc || G.col);
      c.clear(x + 1, G.ht - e);
      c.col(x + 1, G.ht - e + 1, G.ht - 1, dark(o.earc || G.col));
    },
    side(c, G, o) {
      // sticking out sideways and back (cows, sheep, pigs)
      c.rect(G.hl - 1, G.ht, G.hl, G.ht + 1, o.earc || dark(G.col));
    },
  };
  function quad(o) {
    const L = o.L,
      B = o.B,
      ll = o.ll,
      lw = o.lw || 2,
      hw = o.hw,
      hh = o.hh,
      hov = o.hov == null ? 2 : o.hov,
      hy = o.hy == null ? -1 : o.hy,
      hdx = o.hdx || 0,
      sn = o.sn || 0,
      snh = o.snh || Math.ceil(hh / 2),
      tl = o.tl == null ? 3 : o.tl,
      earUp = o.ear && !['flop', 'side', 'none'].includes(o.ear) ? o.eh || (o.ear === 'point' ? 2 : o.ear === 'long' ? 4 : 1) : 0,
      up = Math.max(o.up || 0, -hy + earUp + (o.rise || 0), 0);
    const w = 1 + tl + L + (hw - hov) + hdx + sn + 1 + (o.padR || 0),
      h = 1 + up + B + ll + 1;
    const draw = (c) => {
      prep(c);
      const col = o.col,
        far = o.far || dark(col),
        bx0 = 1 + tl,
        bx1 = bx0 + L - 1,
        yb = 1 + up,
        y1 = yb + B - 1,
        yf = y1 + ll,
        hl = bx1 - hov + 1 + hdx,
        ht = yb + hy,
        li = o.legIn == null ? 1 : o.legIn,
        gap = o.gap == null ? 1 : o.gap,
        legc = o.legc || col,
        foot = o.foot || dark(legc);
      const G = { bx0, bx1, yb, y1, yf, hl, ht, hw, hh, col, cx: (bx0 + bx1) >> 1 };
      const leg = (x, cl, f) => {
        c.rect(x, y1 - 1, x + lw - 1, yf, cl);
        if (ll > 1) c.row(yf, x, x + lw - 1 + (o.paw ? 1 : 0), f);
      };
      if (ll > 0 && o.far !== false) {
        leg(bx0 + li + lw + gap, dark(legc), vd(legc));
        leg(bx1 - li - 2 * lw + 1 - gap, dark(legc), vd(legc));
      }
      (typeof o.tail === 'function' ? o.tail : TAILS[o.tail || 'none'])(c, G, o);
      // body
      c.rect(bx0, yb, bx1, y1, col);
      const rd = o.round == null ? (B >= 7 ? 2 : 1) : o.round;
      if (rd >= 1) {
        c.clear(bx0, yb);
        c.clear(bx0, y1);
      }
      if (rd >= 2) {
        c.clear(bx0 + 1, yb);
        c.clear(bx0, yb + 1);
        c.clear(bx0, y1 - 1);
      }
      if (rd >= 3) {
        c.clear(bx0 + 2, yb);
        c.clear(bx0, yb + 2);
        c.clear(bx0 + 1, yb + 1);
      }
      c.row(yb, bx0 + rd + 1, bx1 - 1, lite(col));
      if (o.belly) c.rect(bx0 + 2, y1 - (o.bh || 1) + 1, bx1 - 1, y1, o.belly);
      else c.row(y1, bx0 + 1, bx1, dark(col));
      if (o.tuck) for (let i = 0; i < o.tuck; i++) c.clearRect(bx0 + li + lw + 1 + i, y1 - i, bx1 - li - lw - 2 - i * 2, y1 - i);
      // neck and head
      const nk = o.nk == null ? hh : o.nk;
      c.poly([[bx1 - nk, yb], [bx1, Math.min(y1, yb + nk)], [hl + Math.min(hw - 1, nk), ht + hh - 1], [hl, ht + 1]], o.neckc || col);
      const hc = o.headc || col;
      c.rect(hl, ht, hl + hw - 1, ht + hh - 1, hc);
      if (hw >= 4) c.clear(hl, ht);
      if (hw >= 5 && sn > 0) c.clear(hl + hw - 1, ht);
      c.row(ht, hl + 1, hl + hw - 2, lite(hc));
      if (sn) {
        c.rect(hl + hw, ht + hh - snh, hl + hw + sn - 1, ht + hh - 1, o.snc || hc);
        if (o.nose !== false) c.set(hl + hw + sn - 1, ht + hh - snh, o.nose || K);
      }
      (EARS[o.ear || 'none'] || EARS.none)(c, G, o);
      if (ll > 0) {
        leg(bx0 + li, legc, foot);
        leg(bx1 - li - lw + 1, legc, foot);
      }
      if (o.eye !== false) c.set(hl + hw - 2 + (o.eyx || 0), ht + (o.ey == null ? Math.max(1, Math.floor(hh / 2) - 1) : o.ey), o.eye || K);
      if (o.x) o.x(c, G);
    };
    return { w, h, draw, ...o.def };
  }
  const Q = (slug, o) => (S[slug] = quad(o));

  /* ---------- birds, side on, facing right ---------- */
  function bird(o) {
    const bw = o.bw,
      bh = o.bh,
      hs = o.hs,
      nl = o.nl || 0,
      ov = o.ov == null ? Math.ceil(hs / 2) : o.ov,
      bl = o.bl == null ? 1 : o.bl,
      ll = o.ll == null ? 1 : o.ll,
      tl = o.tl == null ? 2 : o.tl,
      hdx = o.hdx == null ? 1 : o.hdx,
      up = Math.max(0, nl + hs - ov, o.up || 0);
    const w = 1 + tl + bw + hdx + bl + 1 + (o.padR || 0),
      h = 1 + up + bh + ll + 1;
    const draw = (c) => {
      prep(c);
      const col = o.col,
        x0 = 1 + tl,
        x1 = x0 + bw - 1,
        yb = 1 + up,
        y1 = yb + bh - 1,
        hl = x1 - hs + 1 + hdx,
        hb = yb + ov - 1 - nl,
        ht = hb - hs + 1,
        G = { x0, x1, yb, y1, hl, ht, hs, hb, yf: y1 + ll, col };
      // legs
      const lx = x0 + Math.floor(bw / 2) - 1 + (o.lx || 0),
        lc = o.leg || C.mustard;
      for (const x of bw >= 5 ? [lx, lx + 2] : [lx + 1]) {
        if (ll > 0) c.col(x, y1, y1 + ll, lc);
        if (ll > 1 || o.foot) c.set(x + 1, y1 + ll, lc);
      }
      // tail
      if (tl) {
        const ty = yb + (o.ty == null ? 1 : o.ty),
          tt = o.tt == null ? 1 : o.tt;
        c.poly([[x0 + 1, ty], [x0 - tl, ty + (o.tdy || 0)], [x0 - tl, ty + tt + (o.tdy || 0)], [x0 + 1, ty + tt + 1]], o.tailc || o.wing || dark(col));
      }
      c.oval(x0, yb, x1, y1, col);
      if (o.belly) {
        c.oval(x0 + Math.floor(bw / 3), yb + Math.floor(bh / 2), x1, y1, o.belly);
      }
      if (nl) c.rect(hl + (hs > 3 ? 1 : 0), hb - 1, hl + hs - (hs > 2 ? 2 : 1), yb + ov, o.neckc || col);
      if (o.wing) {
        c.oval(x0 + 1, yb + 1, x1 - Math.max(1, Math.floor(bw / 4)), y1 - 1, o.wing);
        c.row(yb + 1, x0 + 2, x1 - Math.max(2, Math.floor(bw / 3)), lite(o.wing));
      }
      const hc = o.headc || col;
      if (hs >= 4) c.oval(hl, ht, hl + hs - 1, hb, hc);
      else c.rect(hl, ht, hl + hs - 1, hb, hc);
      const by = ht + Math.floor(hs / 2) + (o.by || 0);
      c.rect(hl + hs, by, hl + hs + bl - 1, by + (o.bt || 1) - 1, o.beak || C.mustard);
      if (o.eye !== false) c.set(hl + hs - 2 + (hs <= 2 ? 1 : 0), ht + Math.max(0, Math.floor(hs / 2) - 1), o.eye || K);
      if (o.x) o.x(c, G);
    };
    return { w, h, draw, ...o.def };
  }
  const Bd = (slug, o) => (S[slug] = bird(o));
  /** Draw a finished sprite definition onto a bigger picture. */
  const put = (c, def, x, y, flip) => {
    const t = canvas(def.w, def.h);
    def.draw(t);
    c.stamp(t, x, y, flip);
  };

  /* ---------- a thick line that tapers: tentacles, worms, tails, necks ---------- */
  function tube(c, pts, r0, r1, col, under) {
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
          const t = (run + (segs[i - 1] * k) / n) / total,
            r = Math.max(0.5, r0 + (r1 - r0) * t - shrink),
            x = pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * k) / n + ox,
            y = pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * k) / n + oy;
          for (let yy = Math.floor(y - r); yy <= Math.ceil(y + r); yy++)
            for (let xx = Math.floor(x - r); xx <= Math.ceil(x + r); xx++) if ((xx - x) ** 2 + (yy - y) ** 2 <= r * r) c.set(xx, yy, colr);
        }
        run += segs[i - 1];
      }
    };
    pass(under || dark(col), 0, 0, 0);
    pass(col, -0.5, -0.5, 0.5);
  }
  /** Smooth a list of points into a curve (so a tentacle bends rather than kinks). */
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

  /* ---------- bats and spiders ---------- */
  function bat(c, cx, cy, span, col, o = {}) {
    const s = span >> 1,
      m = o.mem || dark(col),
      k = s / 10;
    for (let dx = 1; dx <= s; dx++) {
      const t = dx / s,
        top = cy - 1 - Math.round(3.4 * Math.sin(Math.PI * Math.min(1, t * 1.1)) * k) + (o.droop ? Math.round(t * o.droop) : 0),
        bot = Math.max(top, cy + 1 + Math.round((2.2 - 3.2 * t + 2 * Math.abs(Math.sin(Math.PI * t * 2))) * k) + (o.droop ? Math.round(t * o.droop) : 0));
      for (const x of [cx - dx, cx + dx]) {
        c.col(x, top, bot, m);
        c.set(x, top, col);
      }
    }
    if (s >= 8) for (const d of [-1, 1]) c.line(cx + d * Math.round(s * 0.5), cy - Math.round(3 * k), cx + d * Math.round(s * 0.45), cy + Math.round(2 * k), col);
    c.rect(cx - 1, cy - 2, cx + 1, cy + 2, col);
    c.set(cx - 1, cy - 3, col);
    c.set(cx + 1, cy - 3, col);
    if (span >= 12) {
      c.set(cx - 1, cy - 1, o.eye || REDEYE);
      c.set(cx + 1, cy - 1, o.eye || REDEYE);
      if (o.fangs) c.set(cx, cy + 1, C.white);
    }
  }
  function spider(c, cx, cy, s, col, o = {}) {
    // s: the half width of the body; the floor is at yf
    const yf = o.yf,
      leg = o.leg || col,
      n = 4;
    for (const d of [-1, 1])
      for (let i = 0; i < n; i++) {
        const kx = cx + d * (s + 2 + i * (o.step || 2)),
          ky = cy - s - 1 + i * (o.kd == null ? 1 : o.kd) - (i === 0 ? 0 : 0),
          fx = kx + d * (2 + (o.splay || 1)),
          y0 = cy - 1 + (i > 1 ? 1 : 0);
        c.line(cx + d * (s - 1), y0, kx, ky, leg);
        c.line(kx, ky, fx, yf, leg);
        if (o.thick) {
          c.line(cx + d * (s - 1), y0 + 1, kx, ky + 1, leg);
          c.line(kx + d, ky, fx + d, yf, dark(leg));
        }
      }
    c.oval(cx - s, cy - s, cx + s, cy + s, col); // abdomen
    c.oval(cx - Math.ceil(s * 0.6), cy + Math.floor(s * 0.3), cx + Math.ceil(s * 0.6), cy + s + Math.ceil(s * 0.7), o.head || dark(col)); // head, towards us
  }

  /* --- animals of ill omen --- */
  Q('black-dog', { L: 17, B: 7, ll: 6, lw: 2, hw: 6, hh: 6, hy: -3, hov: 1, sn: 4, snh: 3, col: hex('#1d1a22'), ear: 'point', eh: 3, tail: 'down', tn: 7, tl: 3, eye: REDEYE, tuck: 2, paw: true, nose: false,
    x(c, G) {
      c.set(G.hl + 3, G.ht + 2, REDEYE);
      c.row(G.ht + 5, G.hl + 5, G.hl + 9, K);
      c.pts([[G.hl + 6, G.ht + 5], [G.hl + 8, G.ht + 5]], C.white); // bared teeth
      c.row(G.yb - 1, G.bx0 + 9, G.bx1 - 1, hex('#1d1a22')); // hackles
      c.pts([[G.bx0 + 10, G.yb - 2], [G.bx0 + 13, G.yb - 2]], hex('#1d1a22'));
      c.row(G.yb, G.bx0 + 3, G.bx1 - 2, hex('#34303c'));
    } });
  sp('cat-black-arch', 17, 14, (c) => {
    const B = hex('#1d1a22');
    c.col(2, 1, 8, B); // tail straight up, fur on end
    c.col(3, 2, 9, B);
    c.pts([[1, 2], [4, 4], [1, 5]], B);
    c.oval(3, 4, 11, 10, B); // the arch of the back
    c.rect(3, 8, 5, 12, B);
    c.rect(4, 8, 5, 12, B);
    c.rect(9, 8, 10, 12, B);
    c.rect(7, 9, 8, 12, dark(B));
    c.clearRect(6, 10, 6, 12);
    c.pts([[5, 3], [7, 3], [9, 3]], B); // bristling
    c.rect(11, 6, 15, 10, B); // head low
    c.pts([[11, 5], [15, 5], [15, 4]], B);
    c.set(13, 7, YEL);
    c.set(15, 7, YEL);
    c.row(9, 13, 15, C.blood);
    c.set(14, 9, C.white);
    c.row(5, 5, 9, hex('#34303c'));
  });
  sp('cat-watching', 10, 13, (c) => {
    const B = hex('#1d1a22');
    c.rect(2, 3, 7, 7, B); // head
    c.pts([[2, 1], [2, 2], [3, 2], [7, 1], [7, 2], [6, 2]], B);
    c.rect(2, 7, 7, 11, B); // sitting body
    c.rect(1, 9, 8, 11, B);
    c.row(11, 6, 9, B); // tail round the feet
    c.set(3, 5, YEL);
    c.set(6, 5, YEL);
    c.col(1, 9, 10, hex('#34303c'));
  });
  Q('rat-giant', { L: 11, B: 5, ll: 2, lw: 1, hw: 4, hh: 4, hy: 1, hov: 1, sn: 3, snh: 2, col: hex('#57525a'), ear: 'round', earc: PINK, eh: 2, tail: 'rat', tn: 8, tl: 9, eye: REDEYE, nose: PINK, legc: PINK, gap: 1,
    x(c, G) {
      c.pts([[G.hl + 6, G.ht + 4], [G.hl + 5, G.ht + 4]], C.white); // teeth
      c.speckle(G.bx0, G.yb, G.bx1, G.y1, hex('#6d6870'), 6, 3);
    } });
  const ratS = { L: 5, B: 3, ll: 1, lw: 1, hw: 2, hh: 2, hy: 1, hov: 0, sn: 1, snh: 1, col: hex('#57525a'), tail: 'rat', tn: 4, tl: 5, eye: false, nose: false, far: false, round: 1 };
  sp('rats-swarm', 44, 16, (c) => {
    const cols = ['#57525a', '#4a454c', '#6a6266', '#3d3940'];
    [[0, 9, 0], [12, 10, 2], [25, 9, 1], [32, 10, 3], [5, 4, 3], [18, 4, 0], [29, 3, 2], [11, 0, 1]].forEach(([x, y, k]) => {
      const t = canvas(13, 7);
      quad({ ...ratS, col: hex(cols[k]) }).draw(t);
      t.outline();
      c.stamp(t, x, y);
      c.set(x + 9, y + 3, REDEYE);
    });
    return false;
  });
  Bd('crow-ragged', { bw: 7, bh: 5, hs: 4, bl: 2, ll: 2, tl: 3, col: hex('#1f1c26'), wing: hex('#2c2935'), beak: hex('#3a3640'), leg: hex('#3a3640'), eye: C.white, ty: 2, tdy: 1,
    x(c, G) {
      c.pts([[G.x0 - 2, G.yb + 5], [G.x0, G.y1 + 1], [G.x0 + 2, G.yb - 1], [G.hl, G.ht - 1]], hex('#1f1c26')); // feathers awry
      c.clear(G.x0 - 2, G.yb + 3);
    } });
  const crowS = { bw: 5, bh: 4, hs: 3, bl: 1, ll: 1, tl: 2, col: hex('#1f1c26'), beak: hex('#3a3640'), leg: hex('#3a3640'), eye: false, ty: 2, tdy: 1 };
  sp('crows-wire', 50, 12, (c) => {
    [[2, 0, 0], [11, 0, 1], [21, 0, 0], [30, 0, 0], [40, 0, 1]].forEach(([x, y, f]) => put(c, bird(crowS), x, y, f));
    c.outline();
    c.row(9, 0, 49, hex('#2e2e38')); // the wire
    c.row(10, 0, 49, K);
    for (const [x, y] of [[8, 3], [12, 3], [27, 3], [36, 3], [41, 3]]) c.set(x, y, EYE);
    return false;
  });
  sp('bat-flying', 24, 12, (c) => bat(c, 12, 6, 22, hex('#2e2733'), { fangs: true, mem: hex('#463a4c') }));
  sp('bats-cloud', 44, 32, (c) => {
    const B = hex('#2a2430');
    [[9, 6, 14], [27, 5, 10], [36, 13, 12], [18, 15, 16], [7, 22, 10], [30, 24, 14], [38, 4, 6], [18, 27, 8], [3, 14, 6]].forEach(([x, y, s], i) =>
      bat(c, x, y, s, B, { mem: i % 2 ? hex('#463a4c') : hex('#3a3040'), droop: (i % 3) - 1 }),
    );
  });
  sp('spider-huge', 46, 22, (c) => {
    const B = hex('#2a2428');
    spider(c, 23, 11, 6, B, { yf: 20, step: 3, splay: 3, head: hex('#3a3034'), kd: 2 });
    c.speckle(16, 5, 30, 17, hex('#4a3e40'), 4, 2); // hairy
    for (const [x, y] of [[21, 16], [24, 16], [20, 18], [25, 18], [22, 18], [23, 18], [22, 15], [23, 15]]) c.set(x, y, REDEYE);
    c.col(21, 20, 20, BONE); // fangs
    c.col(24, 20, 20, BONE);
    c.pts([[23, 7], [22, 9], [24, 9]], hex('#6b4a3a'));
  });
  sp('spider-egg-sac', 20, 26, (c) => {
    const W = hex('#b9b7ac');
    c.line(10, 0, 10, 6, W); // the threads it hangs by
    c.line(3, 0, 8, 7, W);
    c.line(17, 0, 12, 7, W);
    c.oval(4, 6, 15, 21, W);
    c.col(6, 10, 17, lite(W));
    c.speckle(5, 8, 14, 20, dark(W), 5, 3);
    c.line(7, 8, 12, 20, dark(W));
    c.line(12, 9, 7, 19, dark(W));
    c.rect(9, 15, 10, 18, K); // it has split
    c.set(10, 14, K);
    for (const [x, y] of [[9, 19], [11, 17], [8, 21], [12, 22], [6, 23], [14, 20], [10, 23], [3, 22], [16, 23]]) {
      c.set(x, y, K);
      c.set(x - 1, y - 1, hex('#2a2428'));
      c.set(x + 1, y - 1, hex('#2a2428'));
    }
  });
  sp('moth-death', 20, 13, (c) => {
    const M = hex('#6a5a46'),
      D = hex('#3a322c');
    for (const v of [c, flipX(c, 19)]) {
      v.poly([[8, 3], [2, 1], [1, 2], [1, 5], [8, 7]], M); // upper wing
      v.poly([[8, 7], [3, 7], [3, 10], [5, 11], [8, 9]], C.mustard); // lower
      v.line(2, 1, 8, 3, lite(M));
      v.pts([[3, 4], [5, 5], [2, 3]], D);
      v.row(9, 4, 7, D);
      v.pts([[8, 0], [7, -1 + 1]], D);
    }
    c.rect(9, 2, 10, 10, D); // body
    c.rect(9, 3, 10, 6, BONE); // the skull on its back
    c.pts([[9, 4], [10, 4]], K);
    c.row(6, 9, 10, dark(BONE));
  });
  sp('worms', 20, 10, (c) => {
    const W = hex('#cdbfa8'),
      P = hex('#b99a8c');
    c.oval(1, 4, 18, 8, dark(P));
    const r = rnd(7);
    for (let i = 0; i < 9; i++) {
      const x = 2 + r() * 14,
        y = 3 + r() * 4;
      tube(c, curve([[x, y], [x + 2, y - 2 + r() * 3], [x + 4, y + r() * 2 - 1]], 4), 0.8, 0.8, i % 3 ? W : P);
    }
    c.pts([[4, 2], [12, 1], [16, 3]], W);
  });
  sp('centipede-thing', 44, 12, (c) => {
    const B = hex('#5a3328'),
      Lg = hex('#8c5a3a');
    for (let i = 0; i < 12; i++) {
      const x = 3 + i * 3,
        y = 5 + Math.round(Math.sin(i * 0.9) * 1.5);
      c.line(x + 1, y + 2, x - 1 + (i % 2), 10, Lg); // legs
      c.line(x + 1, y, x + (i % 2) * 2, y - 3, dark(Lg));
      c.rect(x, y, x + 2, y + 2, B);
      c.row(y, x, x + 2, lite(B));
      c.set(x + 2, y + 1, dark(B));
    }
    c.rect(39, 3, 42, 7, hex('#6e3a2a')); // head
    c.line(42, 3, 43, 0, Lg); // feelers
    c.line(40, 3, 39, 0, Lg);
    c.set(41, 5, YEL);
    c.pts([[42, 8], [40, 8]], BONE);
    c.line(3, 6, 0, 4, Lg);
    c.line(3, 7, 0, 8, Lg);
  });
  /** One human leg hanging from x, y0 down to the floor yf; dir: which way the foot points. */
  const humanLeg = (c, x, y0, yf, col, dir = 1, bare) => {
    c.rect(x, y0, x + 2, yf, col);
    c.col(x + 2, y0, yf, dark(col));
    if (bare) c.rect(x, yf - 4, x + 2, yf, bare);
    c.rect(dir > 0 ? x : x - 1, yf - 1, dir > 0 ? x + 3 : x + 2, yf, bare || NIGHT);
  };
  sp('legs-thing', 32, 28, (c) => {
    const F = hex('#a88a78');
    humanLeg(c, 6, 10, 23, dark(C.navy), -1);
    humanLeg(c, 14, 10, 23, dark(C.earth), 1);
    humanLeg(c, 22, 10, 23, dark(C.slate), 1);
    c.oval(3, 2, 28, 15, F); // the lump they grow from
    c.oval(8, 1, 22, 8, F);
    c.speckle(4, 3, 27, 14, dark(F), 6, 5);
    c.pts([[9, 5], [15, 4], [21, 7], [12, 9]], vd(F));
    c.row(13, 6, 25, dark(F));
    humanLeg(c, 2, 12, 26, C.navy, -1);
    humanLeg(c, 9, 13, 26, C.earth, -1, F);
    humanLeg(c, 17, 13, 26, C.slate, 1);
    humanLeg(c, 25, 12, 26, C.wine, 1, F);
    c.rect(13, 6, 14, 7, K); // an eye, somewhere
    c.set(13, 6, EYE);
  });
  const TEN = hex('#5a4460'),
    SUCK = hex('#b08a98');
  const tentacle = (c, pts, r0, col = TEN, suck = SUCK) => {
    const p = curve(pts, 6);
    tube(c, p, r0, 0.6, col);
    for (let i = 2; i < p.length - 4; i += 4) c.set(p[i][0] + (r0 > 2 ? 1 : 0), p[i][1] + 1, suck);
  };
  sp('tentacles', 34, 34, (c) => {
    c.oval(4, 27, 29, 32, NIGHT); // the hole
    c.oval(7, 28, 26, 31, K);
    tentacle(c, [[12, 30], [9, 20], [5, 12], [8, 5], [13, 6]], 2.6);
    tentacle(c, [[20, 30], [23, 22], [20, 14], [24, 6], [29, 3], [31, 7]], 2.8);
    tentacle(c, [[16, 30], [17, 24], [14, 17], [17, 11], [20, 12]], 2.2, hex('#6a5070'));
    tentacle(c, [[24, 30], [28, 25], [30, 19], [27, 16]], 1.8);
    tentacle(c, [[9, 30], [4, 26], [2, 21], [5, 18]], 1.6, hex('#6a5070'));
    c.row(31, 6, 27, NIGHT);
  });
  sp('tentacle-door', 34, 10, (c) => {
    c.rect(1, 6, 4, 8, K); // the gap under the door
    tentacle(c, [[2, 7], [9, 6], [14, 7], [19, 4], [24, 6], [29, 7], [32, 4]], 2);
    c.row(8, 1, 6, NIGHT);
  });
  sp('sack-thing', 18, 24, (c) => {
    const J = hex('#8a744e');
    c.oval(2, 6, 15, 22, J);
    c.rect(3, 14, 14, 22, J);
    c.oval(9, 9, 16, 16, J); // something pushes from inside
    c.oval(1, 13, 6, 19, J);
    c.rect(6, 2, 10, 6, J); // the tied neck
    c.pts([[5, 1], [7, 1], [9, 0], [11, 2]], J);
    c.row(5, 6, 10, C.straw); // rope
    c.row(6, 5, 11, dark(C.straw));
    c.col(12, 6, 9, C.straw);
    c.speckle(2, 7, 15, 22, dark(J), 5, 9);
    c.line(5, 9, 4, 20, dark(J));
    c.line(9, 8, 10, 21, dark(J));
    c.col(3, 9, 18, lite(J));
    c.pts([[11, 13], [12, 12], [13, 13]], lite(J));
    blood(c, [[6, 21], [7, 22], [8, 22], [5, 22]]);
  });
  sp('doll-walking', 12, 18, (c) => {
    const P = hex('#dcd6c6');
    c.rect(3, 1, 8, 6, P); // porcelain head
    c.row(0, 3, 8, hex('#6b4a2a'));
    c.col(2, 1, 5, hex('#6b4a2a'));
    c.col(9, 1, 5, hex('#6b4a2a'));
    c.set(4, 3, K);
    c.set(7, 3, K);
    c.set(5, 5, C.red);
    c.set(6, 5, C.red);
    c.line(7, 1, 8, 3, K); // the crack
    c.set(8, 4, K);
    c.rect(3, 7, 8, 12, C.wine); // dress
    c.rect(2, 10, 9, 13, C.wine);
    c.row(7, 4, 7, C.white);
    c.row(13, 2, 9, C.white);
    c.col(1, 8, 10, P); // arms
    c.col(10, 7, 9, P);
    c.col(10, 3, 6, C.steel); // the knife
    c.set(10, 2, C.white);
    c.rect(3, 14, 4, 16, P);
    c.rect(7, 14, 8, 16, P);
    c.row(16, 3, 4, K);
    c.row(16, 7, 8, K);
  });
  sp('mannequin-reaching', 22, 33, (c) => {
    const g = at(c, 0, 0),
      M = hex('#c4b494');
    man(g, { skin: M, face: 'none', top: M, legs: M, shoe: false, sleeve: M, arms: { l: 'down', r: 'out' }, neck: false });
    const D = dark(M);
    g.row(12, 6, 9, D); // the joints
    g.row(21, 5, 10, D);
    g.row(26, 4, 11, D);
    g.row(17, 1, 3, D);
    g.col(14, 13, 15, D);
    g.rect(19, 13, 20, 15, M);
    g.pts([[21, 12], [21, 14], [21, 16]], M); // fingers spread
    g.rect(7, 22, 8, 23, C.woodDark); // the stand shows between the legs
    g.set(8, 7, M);
    g.col(11, 4, 9, D);
  });
  sp('clown-grim', 22, 48, (c) => {
    const g = at(c, 1, 15),
      W = hex('#d8d4c8');
    man(g, { skin: W, face: 'none', hair: ['bald'], top: hex('#8a7a56'), legs: hex('#6a5a66'), sleeve: hex('#8a7a56'), shoe: C.wine, arms: { l: 'down', r: 'up' }, hand: C.white });
    g.rect(2, 3, 3, 7, C.rust); // tufts of hair
    g.rect(12, 3, 13, 7, C.rust);
    g.pts([[6, 6], [9, 6]], K);
    g.pts([[6, 5], [9, 5], [6, 7], [9, 7]], hex('#4a5a7a'));
    g.rect(7, 7, 8, 8, C.red); // nose
    g.pts([[5, 8], [10, 8]], C.blood);
    g.row(9, 5, 10, C.blood); // the smile, painted on
    g.row(10, 6, 9, K);
    g.rect(3, 11, 12, 12, C.cream); // ruff
    g.pts([[3, 13], [5, 13], [7, 13], [9, 13], [11, 13], [2, 12], [13, 12]], C.cream);
    g.pts([[7, 15], [7, 18]], C.wine); // pompoms
    g.rect(2, 30, 6, 31, C.wine); // big shoes
    g.rect(9, 30, 13, 31, C.wine);
    g.col(16, -5, 1, C.ash); // the string
    g.oval(13, -14, 19, -6, hex('#8f2a2a')); // the balloon
    g.set(14, -11, hex('#b85a50'));
    g.set(15, -12, hex('#b85a50'));
    g.set(16, -5, hex('#8f2a2a'));
  });
  sp('organ-grinder', 26, 36, (c) => {
    const g = at(c, 1, 3);
    man(g, { skin: C.flesh, face: 'old', hair: ['thin', C.ash], hat: ['top', C.black, C.wine], top: hex('#4a3a34'), coat: hex('#4a3a34'), coatLen: 5, legs: C.black, sleeve: hex('#4a3a34'),
      arms: { l: 'down', r: 'hold' } });
    g.rect(5, 9, 10, 9, C.ash); // moustache
    // the organ on its strap and its one leg
    g.line(5, 13, 12, 17, C.woodDark);
    g.rect(11, 16, 22, 24, C.wood);
    g.frame(11, 16, 22, 24, C.woodDark);
    g.row(16, 11, 22, C.woodLight);
    for (const x of [13, 15, 17, 19]) g.col(x, 18, 22, C.brass);
    g.col(17, 25, 31, C.woodDark);
    g.row(19, 23, 24, C.iron); // the crank
    g.col(24, 17, 19, C.iron);
    // a small skeleton monkey on top, in a fez
    g.rect(14, 9, 17, 12, BONE);
    g.pts([[15, 10], [17, 10]], K);
    g.row(8, 14, 17, C.red);
    g.row(7, 15, 16, C.red);
    g.col(15, 13, 15, BONE);
    g.row(14, 13, 18, BONE);
    g.pts([[13, 15], [18, 15]], BONE);
    g.line(18, 13, 21, 11, BONE); // its tail
  });
  sp('old-woman-window', 26, 30, (c) => {
    const W = C.woodDark;
    // the rocking chair
    c.col(4, 3, 24, W);
    c.col(5, 3, 24, C.wood);
    c.rect(4, 18, 18, 19, C.wood);
    c.col(18, 14, 25, W);
    c.row(14, 12, 19, C.wood);
    for (const y of [5, 8, 11]) c.row(y, 6, 7, W);
    c.row(27, 2, 22, W); // rockers
    c.pts([[1, 26], [23, 26], [0, 25], [24, 25]], W);
    c.col(5, 24, 26, W);
    c.col(18, 24, 26, W);
    const g = at(c, 4, 0);
    // she sits: head, shawl, lap
    face(g, 4, 3, PALE);
    FACES.stare(g, 4, 3, PALE, K);
    g.pts([[5, 8], [10, 8]], dark(PALE));
    g.row(2, 5, 10, C.white);
    g.row(3, 4, 11, C.white);
    g.rect(7, 0, 8, 1, C.white);
    g.col(4, 4, 5, C.white);
    g.col(11, 4, 5, C.ash);
    g.rect(3, 12, 12, 18, hex('#4a4050')); // shawl
    g.row(12, 5, 10, hex('#4a4050'));
    g.pts([[4, 19], [6, 19], [8, 19], [10, 19], [12, 19]], hex('#4a4050'));
    g.rect(5, 18, 15, 21, C.black); // skirt over the knees
    g.rect(11, 21, 15, 25, C.black);
    g.rect(12, 26, 16, 26, NIGHT);
    g.col(5, 13, 17, lite(hex('#4a4050')));
    g.rect(9, 15, 11, 16, PALE); // hands and the knitting
    g.line(8, 13, 13, 17, C.steel);
    g.line(13, 13, 9, 17, C.steel);
    g.rect(11, 17, 14, 19, C.wine);
    g.col(14, 20, 23, C.wine);
  });
  sp(
    'lantern-bearer',
    22,
    36,
    (c) => {
      const g = at(c, 2, 2),
        CL = hex('#34343f');
      man(g, { hood: CL, face: 'void', top: CL, robe: CL, sleeve: CL, arms: { l: 'down', r: 'out' }, hand: CL });
      g.rect(2, 13, 13, 30, CL); // a wide cloak
      g.col(2, 14, 30, lite(CL));
      g.col(6, 16, 31, vd(CL));
      g.col(10, 18, 31, vd(CL));
      g.rect(3, 31, 12, 31, vd(CL));
      g.rect(12, 13, 17, 15, CL);
      g.col(17, 16, 17, C.ironDark);
      lantern(g, 16, 18);
      // the glow round the lantern
      for (const [x, y] of [[15, 17], [19, 17], [14, 19], [20, 19], [14, 21], [20, 21], [15, 23], [19, 23], [17, 24], [13, 20], [21, 20]]) g.set(x, y, C.glow);
      fade(c, 30, 34);
      soft(c, K);
      return false;
    },
    { shade: false },
  );
  fig('bog-body', { skin: hex('#4a382a'), face: 'hollow', hair: ['thin', hex('#7a3a1e')], top: hex('#4a382a'), legs: hex('#4a382a'), shoe: false, sleeve: hex('#4a382a'),
    after(c, g) {
      const L = hex('#4a382a'),
        D = hex('#2e2219'),
        H = hex('#6b523a');
      for (const y of [15, 17, 19]) g.row(y, 6, 9, D); // ribs under the skin
      g.col(5, 13, 20, H);
      g.col(1, 14, 20, H);
      g.col(4, 23, 29, H);
      g.row(9, 6, 9, D);
      g.rect(4, 21, 11, 23, hex('#3a3a2a')); // a rag of a loincloth
      g.pts([[5, 24], [9, 24], [10, 25]], hex('#3a3a2a'));
      g.rect(5, 11, 10, 12, C.straw); // the cord still round its neck
      g.col(10, 13, 16, C.straw);
      g.clearRect(11, 13, 11, 19); // thin, starved
      g.clearRect(4, 13, 4, 19);
      g.pts([[2, 23], [13, 24], [6, 31], [9, 31], [3, 31], [12, 31]], hex('#2a2a1e')); // peat dripping
      g.rect(4, 30, 6, 31, L);
      g.rect(8, 30, 11, 31, L);
    } });
  sp('pumpkin-head', 18, 35, (c) => {
    const g = at(c, 1, 2),
      P = hex('#b3692c');
    man(g, { head: false, top: hex('#3a3a34'), coat: hex('#3a3a34'), coatLen: 6, legs: C.black, sleeve: hex('#3a3a34'), hand: C.moss });
    g.col(7, 10, 12, C.moss);
    g.col(8, 10, 12, dark(C.moss));
    g.oval(2, 0, 13, 10, P); // the pumpkin
    g.rect(3, 2, 12, 8, P);
    g.col(5, 1, 9, dark(P));
    g.col(10, 1, 9, dark(P));
    g.col(3, 3, 7, lite(P));
    g.rect(7, -2, 8, -1, C.moss); // stalk
    g.pts([[5, 3], [5, 4], [6, 4], [10, 3], [10, 4], [9, 4]], C.flameLight); // eyes with the candle behind
    g.row(7, 4, 11, C.flameLight);
    g.pts([[5, 8], [7, 8], [8, 8], [10, 8], [4, 6], [11, 6]], C.flame);
    g.pts([[6, 7], [9, 7]], P);
    g.set(7, 5, C.flame);
    g.pts([[6, 14], [9, 16], [6, 18]], C.brass); // buttons
  });
  /*MORE*/
  return S;
};
