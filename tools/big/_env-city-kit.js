/* Shared helpers of tools/big/env-city.js (street, urban, basement): how an object with its four pictures is
 * declared, a tiny letter font, wheels and cars, bricks, tins, cobwebs and the like. Not loaded on its own. */
module.exports = (kit, out) => {
  const { C, K, hex, mix, blend, dark, lite, rnd, canvas } = kit;
  const D = dark,
    L = lite;
  let cat = '',
    catLabel = '';
  const setCat = (c, l) => {
    cat = c;
    catLabel = l;
  };

  /** Run fn on canvas c as if it were a canvas of w x h whose corner sits at dx, dy of the real one. */
  function shifted(c, dx, dy, w, h, fn) {
    const { set, get, clear } = c,
      W0 = c.w,
      H0 = c.h;
    c.set = (x, y, col) => set(Math.round(x) + dx, Math.round(y) + dy, col);
    c.get = (x, y) => get(Math.round(x) + dx, Math.round(y) + dy);
    c.clear = (x, y) => clear(Math.round(x) + dx, Math.round(y) + dy);
    c.w = w;
    c.h = h;
    try {
      fn(c);
    } finally {
      c.set = set;
      c.get = get;
      c.clear = clear;
      c.w = W0;
      c.h = H0;
    }
  }
  /** One picture: fn(c, used) draws on a canvas of w x h; m = [left, top, right] extra room (for a used picture
   *  that sticks out: fn then simply draws beyond its canvas). */
  function pic(w, h, fn, u, m, o) {
    const [ml, mt, mr] = m || [0, 0, 0];
    const d = {
      w: w + ml + mr,
      h: h + mt,
      draw(c) {
        if (ml || mt || mr) shifted(c, ml, mt, w, h, (cc) => fn(cc, u));
        else fn(c, u);
      },
    };
    if (o.shade === false) d.shade = false;
    if (o.outline === false) d.outline = false;
    return d;
  }
  /**
   * An object with all its pictures.
   *   w, h, f(c, used)        the front view
   *   sw, sh, s(c, used)      the side view (sh defaults to h); same: true reuses the front view
   *   base: 'side'            the main picture is the side view
   *   um, sum                 [left, top, right] room the used front / used side picture needs beyond its canvas
   *   m, sm                   the same for the unused pictures (rarely)
   *   solid
   */
  const T = (slug, name, o) => {
    if (out[slug]) throw new Error('env-city: ' + slug + ' twice');
    if (o.same) {
      o.s = o.f;
      o.sw = o.w;
      o.sum = o.um;
      o.sm = o.m;
    }
    const F = (u) => pic(o.w, o.h, o.f, u, u ? o.um || o.m : o.m, o),
      S = (u) => (o.s ? pic(o.sw, o.sh || o.h, o.s, u, u ? o.sum || o.sm : o.sm, o) : null),
      side = o.base === 'side',
      main = side ? S(false) : F(false),
      other = side ? F(false) : S(false),
      views = {};
    if (side) views.base = 'side';
    if (other) views.side = other;
    if (o.noUsed !== true) {
      views.used = side ? S(true) : F(true);
      if (other) views.sideUsed = side ? F(true) : S(true);
    }
    out[slug] = { cat, catLabel, name, solid: !!o.solid, ...main, views };
  };

  /* ---------- small drawing helpers ---------- */
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  /** A little picture as text: lines of letters, pal says which colour each letter is ('.' is empty). */
  const pat = (c, x, y, lines, pal) =>
    lines.forEach((r, j) => {
      for (let i = 0; i < r.length; i++) if (r[i] !== '.' && r[i] !== ' ') c.set(x + i, y + j, r[i] === '#' ? K : Array.isArray(pal) ? pal : pal[r[i]]);
    });
  /** fn drawn left-right swapped on a canvas of w x h. */
  const flip = (w, h, fn) => (c, u) => {
    const t = canvas(w, h);
    fn(t, u);
    c.stamp(t, 0, 0, true);
  };
  /** Mirror the left half of the (logical) canvas onto the right half. */
  const mir = (c) => {
    for (let y = -8; y < c.h; y++)
      for (let x = 0; x < c.w >> 1; x++) {
        const p = c.get(x, y);
        if (p) c.set(c.w - 1 - x, y, p);
        else c.clear(c.w - 1 - x, y);
      }
  };
  /** A sunk panel: dark above and left, light below and right. */
  function panel(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, D(col));
    c.col(x0, y0, y1, D(col));
    c.row(y1, x0, x1, L(col));
    c.col(x1, y0, y1, L(col));
  }
  function legs(c, xs, y0, y1, col, w = 2) {
    for (const x of xs) c.rect(x, y0, x + w - 1, y1, col);
  }
  /** A box seen from its narrow side: plain, a light back edge, the dark front edge on the right. */
  function sideBox(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, mix(col, 0.88));
    c.row(y0, x0, x1, col);
    c.col(x0, y0, y1, col);
    c.col(x1, y0, y1, D(col));
    c.row(y1, x0, x1, D(col));
  }

  /* a 3 x 5 letter font */
  const FONT = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111',
    F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010',
    K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '111101101101101', O: '111101101101111',
    P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010',
    Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
    4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111',
    9: '111101111001110', '!': '010010010000010', '?': '110001010000010', '-': '000000111000000', '.': '000000000000010',
    $: '011110010011110', '>': '100010001010100', '<': '001010100010001', '+': '000010111010000', '/': '001001010100100',
  };
  /** Write s at x, y (top left) in the 3 x 5 font; returns the x after the last letter. `only` = which letters to draw. */
  function txt(c, x, y, s, col, o = {}) {
    const sp = o.sp == null ? 1 : o.sp;
    [...s].forEach((ch, i) => {
      const g = FONT[ch];
      if (g && (!o.only || o.only(i, ch)))
        for (let j = 0; j < 15; j++) if (g[j] === '1') c.set(x + (j % 3), y + ((j / 3) | 0), typeof col === 'function' ? col(i, ch) : col);
      x += ch === ' ' ? 2 : 3 + sp;
    });
    return x;
  }
  /** Lines of unreadable writing: dashes of col in the box. */
  function scribble(c, x0, y0, x1, y1, col, seed = 1) {
    const r = rnd(seed);
    for (let y = y0; y <= y1; y += 2) {
      let x = x0;
      while (x <= x1) {
        const n = 1 + ((r() * 3) | 0);
        c.row(y, x, Math.min(x1, x + n - 1), col);
        x += n + 1;
      }
    }
  }

  const TYRE = hex('#201e26'),
    CONC = hex('#85837f'),
    CONCD = hex('#63615f'),
    TARMAC = hex('#3a3a42'),
    GLASSD = hex('#2b3a46'),
    LAMP = C.flameLight,
    AMBER = C.flame,
    REDL = hex('#c8382e'),
    GREENL = hex('#5fb46a'),
    BLUEL = hex('#5a86c8'),
    CARD = hex('#9a7a52'),
    CARDD = hex('#7a5d3e'),
    BAG = hex('#26242c'),
    DIRTW = hex('#b9b6a8'),
    WATER = hex('#5f8696'),
    WATERL = hex('#a9c6cc'),
    SMOKE = hex('#6f6c72');

  /** A wheel seen from the side: a dark tyre of radius r around cx, cy with a hub. */
  function wheel(c, cx, cy, r, hub = C.steel) {
    c.oval(cx - r, cy - r, cx + r, cy + r, TYRE);
    if (r >= 3) {
      c.oval(cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2, hub);
      c.set(cx, cy, D(hub));
    } else if (r >= 2) c.set(cx, cy, hub);
  }
  /** A thin spoked wheel (bicycle, pram): a ring of col. */
  function ring(c, cx, cy, r, col, spokes) {
    for (let a = 0; a < 48; a++) c.set(cx + Math.cos((a * Math.PI) / 24) * r, cy + Math.sin((a * Math.PI) / 24) * r, col);
    if (spokes) {
      c.line(cx - r + 1, cy, cx + r - 1, cy, spokes);
      c.line(cx, cy - r + 1, cx, cy + r - 1, spokes);
      c.set(cx, cy, col);
    }
  }
  /** Bricks in the box. */
  function bricks(c, x0, y0, x1, y1, col, mortar) {
    c.rect(x0, y0, x1, y1, col);
    const m = mortar || D(col);
    for (let y = y0, i = 0; y <= y1; y += 3, i++) {
      c.row(y + 2, x0, x1, m);
      for (let x = x0 + (i % 2 ? 2 : 5); x <= x1; x += 6) c.col(x, y, Math.min(y1, y + 1), m);
    }
  }
  /** Planks side by side (upright) in the box. */
  function planks(c, x0, y0, x1, y1, col, pw = 4) {
    c.rect(x0, y0, x1, y1, col);
    for (let x = x0 + pw; x <= x1; x += pw) c.col(x, y0, y1, D(col));
    c.col(x0, y0, y1, L(col));
  }
  /** Black and yellow (or red and white) slanted stripes in the box. */
  function hazard(c, x0, y0, x1, y1, a, b, w = 3) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, Math.floor((x + y) / w) % 2 ? a : b);
  }
  /** A cobweb in a corner at x, y spreading sx, sy. */
  function cobweb(c, x, y, sx, sy, n, free = true) {
    const col = C.ash,
      put = (px, py) => (free || c.get(px, py)) && c.set(px, py, col);
    for (let i = 0; i < n; i++) {
      put(x + sx * i, y + sy * i);
      put(x + sx * i, y);
      put(x, y + sy * i);
    }
    for (let i = 1; i < n - 1; i++) put(x + sx * (n - 1 - i), y + sy * i);
  }
  const TINS = [hex('#8f3b30'), hex('#3d5a6e'), hex('#9a8a3c'), hex('#5a7048'), hex('#8a8e94'), hex('#7a4a68'), hex('#b0a58a')];
  /** A row of tins / jars / boxes standing on yb between x0 and x1: each 2-3 wide, h tall, with a paler label. */
  function tins(c, x0, x1, yb, h, seed, fill = 1, cols = TINS) {
    const r = rnd(seed);
    let x = x0;
    while (x + 1 <= x1) {
      const w = r() < 0.4 ? 3 : 2,
        col = cols[(r() * cols.length) | 0],
        hh = h - (r() < 0.3 ? 1 : 0),
        xe = Math.min(x1, x + w - 1);
      if (r() <= fill) {
        c.rect(x, yb - hh + 1, xe, yb, col);
        c.row(yb - hh + 1, x, xe, L(col));
        if (hh > 3) c.row(yb - ((hh / 2) | 0), x, xe, blend(col, C.paper, 0.6));
      }
      x = xe + 2;
    }
  }
  const BOTTLES = [hex('#3f5f48'), hex('#6a4a2c'), hex('#7e8f8c'), hex('#8f3b30'), hex('#b0a070'), hex('#4a5a78')];
  /** A row of bottles standing on yb. */
  function bottles(c, x0, x1, yb, h, seed, fill = 1, cols = BOTTLES) {
    const r = rnd(seed);
    for (let x = x0; x + 1 <= x1; x += 3) {
      const col = cols[(r() * cols.length) | 0];
      if (r() > fill) continue;
      c.rect(x, yb - h + 3, x + 1, yb, col);
      c.col(x, yb - h + 3, yb, L(col));
      c.set(x, yb - h + 2, col);
      c.set(x, yb - h + 1, D(col));
      c.set(x + 1, yb - 1, blend(col, C.paper, 0.6));
      c.set(x, yb - 1, blend(col, C.paper, 0.7));
    }
  }
  /** Bits of litter along the row y. */
  function litter(c, x0, x1, y, seed = 1, cols = [C.paper, CARD, hex('#8f3b30'), C.ash]) {
    const r = rnd(seed);
    for (let x = x0; x <= x1; x++) if (r() < 0.4) c.set(x, y - (r() < 0.25 ? 1 : 0), cols[(r() * cols.length) | 0]);
  }
  /** A small flame standing on x, yb (h 3..6). */
  function flame(c, x, yb, h = 4) {
    c.col(x, yb - h + 1, yb, C.flame);
    if (h > 3) {
      c.col(x - 1, yb - h + 3, yb, C.flame);
      c.col(x + 1, yb - h + 2, yb, C.flame);
      c.col(x, yb - h + 3, yb, C.flameLight);
      c.set(x, yb - h + 1, C.red);
    } else {
      c.set(x, yb, C.flameLight);
    }
  }
  /** Smoke or steam rising from x, yb: a wobbling line of puffs. */
  function smoke(c, x, yb, h, col = SMOKE, seed = 1) {
    const r = rnd(seed);
    let px = x;
    for (let y = yb; y > yb - h; y--) {
      if ((yb - y) % 3 !== 2) c.set(px, y, col);
      if ((yb - y) % 4 === 1) c.set(px + 1, y, col);
      px += r() < 0.4 ? 1 : r() < 0.5 ? -1 : 0;
    }
  }
  /** A puddle lying on the row y from x0 to x1. */
  function pool(c, x0, x1, y, col = WATER) {
    c.row(y, x0, x1, col);
    c.row(y, x0 + 1, x0 + 2, L(col));
  }

  /* ---------- cars ---------- */
  /**
   * A car from the side, front to the right, on a canvas about 48 x 22. o: col, cab [x0, x1] (roof ends), est (estate
   * back), glass, lit (lamps on), inside (cabin light), noGlass, noTyres, hub.
   */
  function carSide(c, o) {
    const w = c.w,
      b = c.h - 2,
      col = o.col,
      by = b - 3, // the sill
      wy = b - 11, // the waist
      ry = wy - 6, // the roof
      [c0, c1] = o.cab || [10, 34],
      glass = o.noGlass ? hex('#17151c') : o.inside ? hex('#b9a860') : o.glass || GLASSD,
      wx = o.wheels || [10, w - 12];
    c.poly([[1, wy + 2], [3, wy], [w - 7, wy], [w - 2, wy + 3], [w - 2, by], [1, by]], col);
    c.row(wy, 3, w - 7, L(col));
    c.row(by, 2, w - 3, D(col));
    c.row(by - 1, 2, w - 3, mix(col, 0.82));
    /* the cabin */
    const back = o.est ? c0 + 1 : c0 + 4;
    c.poly([[c0, wy - 1], [back, ry], [c1 - 6, ry], [c1, wy - 1]], col);
    c.row(ry, back, c1 - 6, L(col));
    c.poly([[c0 + 2, wy - 1], [back + 1, ry + 2], [c1 - 7, ry + 2], [c1 - 2, wy - 1]], glass);
    if (!o.noGlass && !o.inside) c.line(c1 - 9, ry + 2, c1 - 6, wy - 2, L(glass));
    const mid = Math.round((c0 + c1) / 2) - 1;
    c.col(mid, ry + 1, wy - 1, col); // the pillars
    if (o.est) c.col(c0 + 6, ry + 1, wy - 1, col);
    /* doors */
    c.col(mid, wy + 1, by - 1, D(col));
    c.col(c1 - 2, wy + 1, by - 1, D(col));
    c.col(c0 + 3, wy + 1, by - 3, D(col));
    c.row(wy + 2, mid - 3, mid - 2, o.trim || C.steel);
    c.row(wy + 2, c1 - 6, c1 - 5, o.trim || C.steel);
    /* bumpers and lamps */
    c.rect(w - 3, by - 2, w - 2, by - 1, o.trim || C.steel);
    c.rect(1, by - 2, 2, by - 1, o.trim || C.steel);
    c.rect(w - 3, wy + 3, w - 2, wy + 4, o.lit ? LAMP : o.dead ? C.black : C.glassLight);
    c.rect(1, wy + 3, 1, wy + 4, o.lit ? REDL : o.dead ? C.black : hex('#7a2a26'));
    /* wheels */
    for (const x of wx) {
      c.oval(x - 4, b - 8, x + 4, b, hex('#17151c'));
      if (o.noTyres) {
        c.oval(x - 2, b - 4, x + 2, b, C.ironDark);
        c.set(x, b - 2, C.rust);
      } else wheel(c, x, b - 3, 3, o.hub || C.steel);
    }
    return { wy, ry, by, b, c0, c1, mid, back };
  }
  /** The same car from the front, on a canvas about 26 x 22. */
  function carFront(c, o) {
    const w = c.w,
      b = c.h - 2,
      col = o.col,
      by = b - 3,
      wy = b - 11,
      ry = wy - 6,
      glass = o.noGlass ? hex('#17151c') : o.inside ? hex('#b9a860') : o.glass || GLASSD;
    c.rect(1, wy, w - 2, by, col);
    c.row(wy, 2, w - 3, L(col));
    c.clear(1, wy);
    c.clear(w - 2, wy);
    c.poly([[3, wy - 1], [5, ry], [w - 6, ry], [w - 4, wy - 1]], col);
    c.row(ry, 5, w - 6, L(col));
    c.poly([[5, wy - 1], [6, ry + 2], [w - 7, ry + 2], [w - 6, wy - 1]], glass);
    if (!o.noGlass && !o.inside) c.line(8, wy - 2, 10, ry + 2, L(glass));
    c.set(2, wy - 2, col); // wing mirrors
    c.set(w - 3, wy - 2, col);
    c.rect(8, wy + 3, w - 9, wy + 5, hex('#1e1c24')); // the grille
    for (let x = 9; x < w - 9; x += 2) c.col(x, wy + 3, wy + 5, C.iron);
    for (const x of [3, w - 6]) {
      c.rect(x, wy + 3, x + 2, wy + 5, o.lit ? LAMP : o.dead ? C.black : C.glassLight);
      if (!o.lit && !o.dead) c.set(x + 2, wy + 5, C.glass);
    }
    c.rect(1, by - 1, w - 2, by, o.trim || C.steel); // the bumper
    c.row(by, 1, w - 2, D(o.trim || C.steel));
    if (!o.noPlate) c.rect((w >> 1) - 3, by - 1, (w >> 1) + 2, by, o.plate || C.bone);
    for (const x of [2, w - 6]) c.rect(x, by + 1, x + 3, b, o.noTyres ? C.ironDark : TYRE); // the wheels
    c.rect(6, by + 1, w - 7, by + 1, hex('#17151c'));
    return { wy, ry, by, b };
  }

  return {
    ...kit, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, txt, scribble, wheel, ring, bricks, planks, hazard, cobweb, tins, bottles,
    litter, flame, smoke, pool, carSide, carFront, TINS, BOTTLES,
    TYRE, CONC, CONCD, TARMAC, GLASSD, LAMP, AMBER, REDL, GREENL, BLUEL, CARD, CARDD, BAG, DIRTW, WATER, WATERL, SMOKE,
  };
};
