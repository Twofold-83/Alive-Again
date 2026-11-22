/* The house at paper-doll scale: furniture, doors and stairs, the modern home, and the attic.
 * One pixel is one doll pixel (a person is 16 x 33). Everything stands on its bottom row and is seen from the
 * front or the side, like a stage set. Helpers at the top keep the variants of one thing alike. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd, canvas }) => {
  const D = dark,
    L = lite;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale;
  const NIGHT = C.night,
    SHEET = C.white,
    FOLD = blend(C.white, C.stone, 0.45);
  const A = {};
  const S = (w, h, draw, o = {}) => ({ w, h, solid: true, draw, ...o });
  const P = (w, h, draw, o = {}) => ({ w, h, solid: false, draw, ...o });
  const dots = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };

  /* ---------- helpers ---------- */
  function drawer(c, x0, y0, x1, y1, col, knob = C.brass) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.row(y1, x0, x1, D(col));
    c.col(x1, y0, y1, D(col));
    const y = (y0 + y1) >> 1;
    if (x1 - x0 > 11) {
      c.set(x0 + 3, y, knob);
      c.set(x1 - 3, y, knob);
    } else c.set((x0 + x1) >> 1, y, knob);
  }
  /** A sunk panel: dark above and left, light below and right. */
  function panel(c, x0, y0, x1, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, D(col));
    c.col(x0, y0, y1, D(col));
    c.row(y1, x0, x1, L(col));
    c.col(x1, y0, y1, L(col));
  }
  function legs(c, xs, y0, y1, col = WD, w = 2) {
    for (const x of xs) c.rect(x, y0, x + w - 1, y1, col);
  }
  const BOOKS = [C.wine, C.navy, C.forest, C.mustard, C.slate, C.plum, C.teal, C.parchment, C.rust, C.black];
  /** A row of book spines standing on yb, at most mh tall. fill < 1 leaves gaps. */
  function books(c, x0, x1, yb, mh, seed, fill = 1) {
    const r = rnd(seed);
    let x = x0;
    while (x <= x1) {
      if (r() > fill) {
        x += 1 + ((r() * 3) | 0);
        continue;
      }
      const w = r() < 0.35 ? 2 : 1,
        h = mh - ((r() * 3) | 0),
        col = BOOKS[(r() * BOOKS.length) | 0],
        xe = Math.min(x1, x + w - 1);
      c.rect(x, yb - h + 1, xe, yb, col);
      if (h > 3) c.row(yb - h + 2, x, xe, L(col));
      x = xe + 1;
    }
  }
  /** A case with n open compartments; cb(i, x0, top, x1, base) fills each. */
  function shelves(c, x0, y0, x1, y1, col, n, cb) {
    c.rect(x0, y0, x1, y1, col);
    c.col(x0, y0, y1, L(col));
    const ih = y1 - y0 - 1;
    for (let i = 0; i < n; i++) {
      const t = y0 + 1 + Math.round((i * (ih + 1)) / n),
        b = y0 + Math.round(((i + 1) * (ih + 1)) / n) - 1;
      c.rect(x0 + 1, t, x1 - 1, b, mix(col, 0.42));
      c.row(t, x0 + 1, x1 - 1, mix(col, 0.3));
      if (cb) cb(i, x0 + 1, t, x1 - 1, b);
    }
  }
  /** A cobweb in a corner at x, y spreading sx, sy; only over what is drawn unless free. */
  function cobweb(c, x, y, sx, sy, n, free = false) {
    const col = C.ash,
      put = (px, py) => (free || c.get(px, py)) && c.set(px, py, col);
    for (let i = 0; i < n; i++) {
      put(x + sx * i, y + sy * i);
      put(x + sx * i, y);
      put(x, y + sy * i);
    }
    for (let i = 1; i < n - 1; i++) put(x + sx * (n - 1 - i), y + sy * i);
    if (n > 5) for (let i = 1; i < n - 4; i++) put(x + sx * (n - 4 - i), y + sy * i);
  }
  /** A dust sheet thrown over a shape: the outline of the thing in cloth, with folds and a ragged hem. */
  function drape(c, pts, seed = 1) {
    c.poly(pts, SHEET);
    const r = rnd(seed),
      b = Math.max(...pts.map((p) => p[1]));
    for (let x = 0; x < c.w; x++) {
      let t = 0;
      while (t < c.h && !c.get(x, t)) t++;
      if (t >= c.h) continue;
      c.set(x, t, L(SHEET));
      if (r() < 0.3) c.col(x, t + 2 + ((r() * 3) | 0), b, FOLD);
      else if (r() < 0.25) c.col(x, b - 2 - ((r() * 4) | 0), b, FOLD);
      if (r() < 0.3) c.clear(x, b);
    }
  }
  function candle(c, x, yt, yb, lit) {
    c.col(x, yt, yb, C.bone);
    if (lit) {
      c.set(x, yt - 1, C.flame);
      c.set(x, yt - 2, C.flameLight);
    } else c.set(x, yt - 1, C.black);
  }
  /** Torn cloth: a dark rip with stuffing coming out. */
  function tear(c, x, y, col, n = 3) {
    for (let i = 0; i < n; i++) c.set(x + i, y + i, mix(col, 0.4));
    c.set(x + 1, y, C.white);
    c.set(x + 2, y + 1, C.white);
    if (n > 2) c.set(x + 2, y, C.bone);
  }
  function stain(c, x0, y0, x1, y1, col, seed = 3) {
    c.oval(x0, y0, x1, y1, col);
    c.speckle(x0 - 1, y0 - 1, x1 + 2, y1 + 1, col, 4, seed);
  }

  /* ---------- seats ---------- */
  function sofa(c, col, o = {}) {
    const w = c.w,
      b = c.h - 2,
      top = o.top || 2,
      aw = o.arm || 3;
    c.rect(aw + 1, top, w - aw - 2, b - 6, col); // back
    c.row(top, aw + 2, w - aw - 3, L(col));
    c.clear(aw + 1, top);
    c.clear(w - aw - 2, top);
    if (o.wing) {
      c.rect(2, top + 1, aw + 1, b - 9, col);
      c.rect(w - aw - 2, top + 1, w - 3, b - 9, col);
      c.col(2, top + 1, b - 9, L(col));
      c.col(aw + 1, top + 3, b - 9, D(col));
      c.col(w - aw - 2, top + 3, b - 9, D(col));
    }
    c.row(b - 9, aw + 2, w - aw - 3, D(col));
    c.rect(aw + 2, b - 8, w - aw - 3, b - 5, col); // seat
    c.row(b - 8, aw + 2, w - aw - 3, L(col));
    const n = o.cush || (w > 24 ? 3 : 1);
    for (let i = 1; i < n; i++) {
      const x = aw + 1 + Math.round((i * (w - 2 * aw - 3)) / n);
      c.col(x, top + 1, b - 5, D(col));
    }
    if (o.buttons)
      for (let x = aw + 4; x < w - aw - 3; x += 4) {
        c.set(x, top + 3, D(col));
        c.set(x + 2, top + 6, D(col));
      }
    for (const x of [1, w - aw - 2]) {
      c.rect(x, b - 11, x + aw, b - 2, col); // arms
      c.row(b - 11, x, x + aw, L(col));
      c.row(b - 10, x, x + aw, L(col));
      c.row(b - 9, x, x + aw, D(col));
    }
    c.col(1, b - 9, b - 2, L(col));
    c.rect(aw + 2, b - 4, w - aw - 3, b - 2, D(col)); // skirt
    c.row(b - 4, aw + 2, w - aw - 3, mix(col, 0.5));
    legs(c, [2, w - 4], b - 1, b, o.feet || WD);
  }
  /** A wooden chair seen from the side, facing right: the back is on the left. */
  function chair(c, x, b, o = {}) {
    const col = o.col || W,
      sh = o.seat || 9,
      bh = o.back || 18,
      sw = o.w || 8;
    c.rect(x, b - bh + 1, x + 1, b, col); // back post and leg
    c.col(x, b - bh + 1, b, L(col));
    c.rect(x + sw - 2, b - sh + 1, x + sw - 1, b, col); // front leg
    c.rect(x, b - sh, x + sw - 1, b - sh + 1, o.pad || col); // seat
    c.row(b - sh, x, x + sw - 1, L(o.pad || col));
    c.row(b - 3, x + 2, x + sw - 3, D(col)); // stretcher
    c.set(x + 2, b - bh + 2, D(col)); // slats seen edge on
    c.set(x + 2, b - bh + 5, D(col));
    c.set(x, b - bh + 1, L(L(col)));
    if (o.padBack) c.rect(x + 2, b - bh + 3, x + 2, b - sh - 3, o.pad);
  }

  const ROSE = hex('#8a5560'),
    FADEDGREEN = hex('#57694e'),
    BROWN = hex('#6a4a38'),
    LEATHER = hex('#7a2b26');
  A['sofa-worn'] = S(36, 20, (c) => {
    sofa(c, ROSE);
    c.speckle(5, 3, 30, 12, blend(ROSE, C.bone, 0.4), 9, 4);
    c.rect(13, 11, 18, 12, blend(ROSE, C.bone, 0.35)); // a worn patch
    c.row(16, 6, 29, mix(ROSE, 0.45));
    dots(c, mix(ROSE, 0.45), [8, 17, 14, 17, 15, 17, 23, 17]); // sagging fringe
  });
  A['sofa-torn'] = S(36, 20, (c) => {
    sofa(c, FADEDGREEN);
    tear(c, 8, 4, FADEDGREEN, 4);
    tear(c, 21, 10, FADEDGREEN, 3);
    tear(c, 26, 4, FADEDGREEN, 3);
    c.rect(14, 12, 16, 13, C.white);
    c.set(15, 11, C.bone);
    c.line(31, 9, 33, 13, mix(FADEDGREEN, 0.4));
    c.set(17, 17, C.white); // stuffing on the floor
    c.set(18, 18, C.white);
    c.set(16, 18, C.bone);
  });
  A['sofa-sheet'] = S(36, 20, (c) => {
    drape(c, [[5, 2], [30, 2], [31, 7], [34, 8], [34, 18], [1, 18], [1, 8], [4, 7]], 11);
    c.row(9, 6, 29, FOLD);
    c.row(13, 3, 32, FOLD);
  });
  A['armchair-worn'] = S(18, 20, (c) => {
    sofa(c, BROWN);
    c.speckle(5, 3, 12, 12, L(BROWN), 8, 5);
    c.rect(7, 11, 10, 12, blend(BROWN, C.bone, 0.3));
  });
  A['armchair-torn'] = S(18, 20, (c) => {
    sofa(c, hex('#5c5a70'));
    tear(c, 6, 4, hex('#5c5a70'), 4);
    c.rect(8, 11, 10, 12, C.white);
    c.set(9, 10, C.bone);
    c.set(3, 9, C.white);
    c.set(13, 17, C.white);
    c.set(12, 18, C.bone);
  });
  A['armchair-sheet'] = S(18, 20, (c) => {
    drape(c, [[5, 2], [12, 2], [13, 7], [16, 8], [16, 18], [1, 18], [1, 8], [4, 7]], 7);
    c.row(10, 6, 11, FOLD);
  });
  A['armchair-wing'] = S(18, 25, (c) => {
    sofa(c, LEATHER, { wing: true, top: 2 });
    for (let y = 5; y < 13; y += 3) for (let x = 6 + (y % 2) * 2; x < 13; x += 3) c.set(x, y, D(LEATHER)); // buttons
    dots(c, C.brass, [1, 21, 4, 21, 13, 21, 16, 21]);
  });
  A['chaise-longue'] = S(36, 19, (c) => {
    const col = hex('#5a3a52');
    c.rect(2, 4, 8, 12, col); // raised head end
    c.rect(1, 3, 4, 6, col);
    c.row(3, 1, 4, L(col));
    c.col(1, 4, 6, L(col));
    c.line(9, 6, 14, 10, col);
    c.line(9, 7, 13, 10, col);
    c.rect(2, 10, 33, 13, col); // long seat
    c.row(10, 9, 33, L(col));
    for (let x = 12; x < 33; x += 5) c.set(x, 12, D(col));
    c.rect(2, 14, 33, 14, WD);
    c.row(14, 2, 33, W);
    legs(c, [3, 31], 15, 17, WD);
    c.set(2, 17, WD);
    c.set(33, 17, WD);
    c.rect(32, 8, 34, 10, col); // low roll at the foot
    c.row(8, 32, 34, L(col));
  });
  A['footstool'] = P(12, 9, (c) => {
    c.rect(1, 1, 10, 5, ROSE);
    c.row(1, 2, 9, L(ROSE));
    c.clear(1, 1);
    c.clear(10, 1);
    c.row(5, 1, 10, D(ROSE));
    dots(c, D(ROSE), [4, 3, 7, 3]);
    legs(c, [2, 8], 6, 7, WD);
  });

  /* ---------- small tables and stands ---------- */
  function roundTable(c, x0, x1, top, b, col) {
    const m = (x0 + x1) >> 1;
    c.rect(x0, top, x1, top + 1, col);
    c.row(top, x0, x1, L(col));
    c.rect(m, top + 2, m + 1, b - 2, D(col));
    c.col(m, top + 2, b - 2, col);
    c.row(b - 1, m - 2, m + 3, D(col));
    c.set(m - 3, b, D(col));
    c.set(m - 2, b, D(col));
    c.set(m + 3, b, D(col));
    c.set(m + 4, b, D(col));
  }
  function fringedLamp(c, x, top, base, col) {
    // shade x..x+6 wide
    c.rect(x + 1, top, x + 5, top + 1, col);
    c.rect(x, top + 2, x + 6, top + 4, col);
    c.row(top, x + 1, x + 5, L(col));
    c.col(x, top + 2, top + 4, L(col));
    for (let i = x; i <= x + 6; i += 2) c.set(i, top + 5, C.mustard);
    c.col(x + 3, top + 5, base, C.brass);
    c.row(base, x + 2, x + 4, D(C.brass));
  }
  A['side-table'] = P(12, 14, (c) => roundTable(c, 1, 10, 1, 12, W));
  A['side-table-lamp'] = P(12, 24, (c) => {
    roundTable(c, 1, 10, 11, 22, W);
    fringedLamp(c, 2, 1, 10, hex('#8a6a4c'));
  });
  A['standing-lamp-old'] = P(11, 36, (c) => {
    fringedLamp(c, 2, 1, 33, hex('#7d5a50'));
    c.rect(2, 2, 8, 6, hex('#7d5a50'));
    c.rect(3, 1, 7, 1, L(hex('#7d5a50')));
    c.col(2, 2, 6, L(hex('#7d5a50')));
    for (let i = 2; i <= 8; i += 2) c.set(i, 7, C.mustard);
    c.set(5, 18, C.gold);
    c.row(33, 3, 7, D(C.brass));
    c.row(34, 2, 8, C.brass);
  });
  A['plant-stand'] = P(14, 28, (c) => plantStand(c, false));
  A['plant-stand-dead'] = P(14, 28, (c) => plantStand(c, true));
  function plantStand(c, dead) {
    c.rect(4, 15, 9, 15, WL);
    c.rect(6, 16, 7, 24, W);
    c.line(6, 22, 3, 26, WD);
    c.line(7, 22, 10, 26, WD);
    c.col(6, 22, 26, WD);
    const pot = hex('#7a4a34');
    c.rect(4, 10, 9, 10, L(pot));
    c.rect(5, 11, 8, 14, pot);
    if (dead) {
      const tw = hex('#5c4a34');
      c.line(6, 9, 4, 3, tw);
      c.line(7, 9, 9, 2, tw);
      c.line(5, 6, 2, 5, tw);
      c.line(8, 6, 11, 6, tw);
      dots(c, C.straw, [2, 6, 11, 7, 9, 1, 3, 3, 10, 14, 3, 26]);
    } else {
      const g = C.leaf,
        gl = C.leafLight;
      for (const [x1, y1] of [[1, 5], [2, 2], [5, 1], [8, 1], [11, 3], [12, 6], [1, 9], [12, 10]]) c.line(6, 9, x1, y1, g);
      for (const [x1, y1] of [[2, 4], [4, 2], [7, 2], [10, 3], [11, 7], [3, 8]]) c.line(7, 9, x1, y1, gl);
    }
  }
  A['coat-stand'] = P(14, 37, (c) => {
    coatStand(c, 6);
    c.rect(2, 3, 9, 4, C.black); // hat
    c.rect(3, 1, 8, 2, C.black);
    c.row(3, 3, 8, hex('#3a3040'));
    const coat = hex('#4b4438');
    c.poly([[8, 7], [12, 9], [12, 24], [7, 24]], coat); // coat hanging
    c.col(8, 8, 24, L(coat));
    c.col(10, 10, 24, D(coat));
    c.set(9, 13, C.brass);
    c.set(9, 16, C.brass);
  });
  function coatStand(c, x) {
    const b = c.h - 2;
    c.col(x, 4, b - 1, W);
    c.col(x + 1, 4, b - 1, WD);
    c.line(x, 8, x - 3, 5, WD);
    c.line(x + 1, 8, x + 4, 5, WD);
    c.line(x, 11, x - 2, 9, WD);
    c.line(x + 1, 11, x + 3, 9, WD);
    c.set(x, 3, WL);
    c.line(x, b - 3, x - 3, b, WD);
    c.line(x + 1, b - 3, x + 4, b, WD);
    c.set(x, b, WD);
  }
  A['umbrella-stand'] = P(10, 19, (c) => {
    c.col(3, 2, 9, C.black); // umbrella
    c.set(2, 1, WD);
    c.set(3, 1, WD);
    c.col(5, 4, 9, C.navy);
    c.col(6, 3, 9, D(C.navy));
    c.set(6, 2, WL);
    c.col(7, 1, 9, WL); // walking stick
    c.set(8, 1, WL);
    c.rect(2, 9, 7, 17, C.brass);
    c.col(2, 9, 17, L(C.brass));
    c.row(9, 2, 7, D(C.brass));
    c.row(13, 2, 7, D(C.brass));
    c.row(17, 2, 7, D(C.brass));
  });
  A['fire-tools'] = P(9, 18, (c) => {
    c.col(4, 1, 15, C.iron);
    c.set(4, 1, C.brass);
    c.row(4, 2, 6, C.iron);
    c.col(2, 5, 13, C.ironDark); // poker
    c.col(6, 5, 11, C.ironDark); // shovel
    c.rect(5, 12, 7, 14, C.iron);
    c.row(16, 2, 6, C.ironDark);
    c.row(15, 3, 5, C.iron);
  });

  /* ---------- cabinets ---------- */
  A['sideboard'] = S(36, 19, (c) => {
    c.rect(1, 2, 34, 3, WL);
    c.row(2, 1, 34, L(WL));
    c.rect(2, 4, 33, 15, W);
    drawer(c, 3, 5, 11, 7, W);
    drawer(c, 13, 5, 22, 7, W);
    drawer(c, 24, 5, 32, 7, W);
    panel(c, 3, 9, 11, 14, W);
    panel(c, 13, 9, 17, 14, W);
    panel(c, 18, 9, 22, 14, W);
    panel(c, 24, 9, 32, 14, W);
    dots(c, C.brass, [10, 11, 16, 11, 19, 11, 25, 11]);
    c.row(15, 2, 33, WD);
    legs(c, [2, 32], 16, 17, WD);
  });
  function glassDoors(c, x0, y0, x1, y1, col, n, cb) {
    shelves(c, x0, y0, x1, y1, col, n, cb);
    const m = (x0 + x1) >> 1;
    c.col(m, y0, y1, col);
    c.col(m + 1, y0, y1, D(col));
    for (let y = y0 + 2; y < y1 - 1; y += 3) {
      c.set(x0 + 2, y, C.glass);
      c.set(m + 3, y + 1, C.glass);
    }
    c.line(x0 + 2, y0 + 5, x0 + 4, y0 + 2, C.glassLight);
    c.line(m + 3, y0 + 6, m + 5, y0 + 3, C.glassLight);
  }
  A['display-cabinet'] = S(24, 38, (c) => {
    c.rect(1, 1, 22, 2, WD);
    c.row(1, 1, 22, W);
    glassDoors(c, 2, 3, 21, 26, WD, 3, (i, x0, t, x1, b) => {
      if (i === 0) {
        c.rect(x0 + 2, b - 3, x0 + 4, b, C.bone); // a skull
        c.set(x0 + 3, b - 2, K);
        c.rect(x1 - 5, b - 4, x1 - 4, b, C.teal);
        c.set(x1 - 2, b, C.gold);
      } else if (i === 1) {
        c.rect(x0 + 1, b - 2, x0 + 3, b, C.mustard);
        c.rect(x0 + 6, b - 4, x0 + 6, b, C.glassLight);
        c.rect(x1 - 4, b - 3, x1 - 2, b, C.wine);
        c.set(x1 - 3, b - 4, C.wine);
      } else {
        c.rect(x0 + 2, b - 1, x0 + 6, b, C.stoneLight);
        c.rect(x1 - 5, b - 4, x1 - 3, b, C.plum);
        c.set(x1 - 1, b, C.bone);
      }
    });
    c.rect(2, 27, 21, 34, WD);
    panel(c, 3, 28, 11, 33, WD);
    panel(c, 12, 28, 20, 33, WD);
    dots(c, C.brass, [10, 30, 13, 30, 11, 14, 13, 14]);
    legs(c, [2, 20], 35, 36, mix(WD, 0.7));
  });
  A['china-cabinet'] = S(26, 38, (c) => {
    c.rect(1, 1, 24, 2, W);
    c.row(1, 1, 24, WL);
    shelves(c, 2, 3, 23, 21, W, 3, (i, x0, t, x1, b) => {
      for (let x = x0 + 1; x < x1 - 2; x += 5) {
        c.oval(x, b - 3, x + 3, b, i === 1 ? C.glassLight : C.white); // plates on edge
        c.set(x + 1, b - 2, i === 1 ? C.glass : C.navy);
        c.set(x + 2, b - 1, i === 1 ? C.glass : C.navy);
      }
    });
    c.rect(1, 22, 24, 23, WL);
    c.row(22, 1, 24, L(WL));
    c.rect(2, 24, 23, 36, W);
    drawer(c, 3, 25, 12, 27, W);
    drawer(c, 13, 25, 22, 27, W);
    panel(c, 3, 29, 12, 35, W);
    panel(c, 13, 29, 22, 35, W);
    dots(c, C.brass, [11, 32, 14, 32]);
  });

  /* ---------- clocks, music, wireless ---------- */
  function grandfather(c, stopped) {
    const col = stopped ? hex('#55392a') : W;
    c.rect(4, 1, 7, 1, col);
    c.rect(2, 2, 9, 2, col);
    c.rect(1, 3, 10, 12, col); // hood
    c.col(1, 3, 12, L(col));
    c.oval(2, 4, 9, 11, stopped ? C.parchment : C.cream);
    c.rect(2, 13, 9, 28, col); // trunk
    c.col(2, 13, 28, L(col));
    c.rect(4, 15, 7, 26, mix(col, 0.35));
    c.rect(1, 29, 10, 36, col); // base
    c.col(1, 29, 36, L(col));
    c.row(29, 1, 10, L(col));
    panel(c, 3, 31, 8, 34, col);
    c.row(36, 1, 10, D(col));
    if (stopped) {
      c.line(5, 7, 5, 9, K); // hands hang down
      c.line(5, 7, 6, 9, K);
      c.line(3, 5, 5, 6, D(C.parchment)); // crack
      c.line(5, 16, 7, 23, C.brass); // pendulum askew
      c.set(7, 24, C.brass);
      cobweb(c, 1, 3, 1, 1, 5);
      cobweb(c, 9, 13, -1, 1, 6);
      c.set(10, 13, C.ash);
      c.col(4, 20, 25, C.ash);
    } else {
      c.line(5, 7, 5, 5, K);
      c.line(5, 7, 7, 8, K);
      dots(c, D(C.cream), [5, 4, 8, 7, 5, 10, 3, 7]);
      c.col(5, 15, 22, C.brass);
      c.rect(5, 23, 6, 24, C.gold);
      c.set(4, 23, C.gold);
    }
  }
  A['grandfather-clock'] = S(12, 38, (c) => grandfather(c, false));
  A['grandfather-clock-stopped'] = S(12, 38, (c) => grandfather(c, true));
  A['piano-upright'] = S(32, 26, (c) => {
    const col = hex('#3b2a26');
    c.rect(1, 1, 30, 2, L(col));
    c.rect(2, 3, 29, 12, col);
    c.col(2, 3, 12, L(col));
    panel(c, 4, 4, 27, 10, col);
    c.rect(12, 6, 19, 9, C.paper); // sheet music
    dots(c, D(C.paper), [13, 7, 15, 7, 17, 7, 14, 8, 16, 8, 18, 8]);
    c.rect(1, 13, 30, 13, L(col)); // key bed
    c.rect(2, 14, 29, 15, C.white);
    for (let x = 3; x < 29; x += 2) c.set(x, 14, x % 8 === 7 ? C.white : K);
    c.row(15, 2, 29, C.bone);
    c.rect(1, 16, 30, 16, col);
    c.rect(2, 17, 29, 23, col);
    c.col(2, 17, 23, L(col));
    panel(c, 4, 18, 27, 22, col);
    legs(c, [1, 28], 14, 24, D(col), 3);
    c.rect(1, 24, 30, 24, D(col));
    dots(c, C.brass, [14, 23, 17, 23]);
  });
  A['piano-grand'] = S(46, 30, (c) => {
    const col = C.black,
      hl = hex('#3a3644');
    c.poly([[8, 13], [40, 2], [42, 3], [42, 5], [12, 13]], col); // lid, propped open
    c.line(8, 13, 40, 2, hl);
    c.line(32, 13, 35, 6, hex('#5a5560'));
    c.rect(4, 14, 42, 19, col); // body
    c.row(14, 4, 42, hl);
    c.col(4, 14, 19, hl);
    c.rect(43, 15, 43, 18, col);
    c.rect(1, 16, 5, 17, C.white); // keys
    c.row(17, 1, 5, C.bone);
    c.rect(1, 18, 4, 19, col);
    c.rect(7, 9, 12, 13, hl); // music desk
    c.rect(8, 10, 11, 12, C.paper);
    legs(c, [5, 23, 40], 20, 26, col);
    for (const x of [5, 23, 40]) {
      c.set(x, 20, hl);
      c.row(27, x, x + 1, C.brass);
    }
    c.col(13, 20, 25, hl); // pedal lyre
    c.col(15, 20, 25, hl);
    c.row(26, 12, 16, C.brass);
  });
  A['piano-stool'] = P(10, 10, (c) => {
    c.rect(1, 1, 8, 2, hex('#5a2630'));
    c.row(1, 2, 7, L(hex('#5a2630')));
    c.rect(4, 3, 5, 6, WD);
    c.row(4, 3, 6, W);
    c.row(7, 2, 7, WD);
    dots(c, WD, [1, 8, 2, 8, 7, 8, 8, 8]);
  });
  A['gramophone'] = P(18, 19, (c) => {
    c.poly([[9, 1], [16, 1], [16, 9], [12, 7], [9, 4]], C.brass); // horn
    c.poly([[11, 2], [15, 2], [15, 7], [12, 5]], mix(C.brass, 0.45));
    c.col(16, 1, 9, L(C.brass));
    c.line(9, 4, 6, 8, C.brass);
    c.line(6, 8, 6, 10, D(C.brass));
    c.rect(3, 11, 11, 11, C.black); // record
    c.set(7, 11, C.red);
    c.rect(2, 12, 13, 17, W);
    c.row(12, 2, 13, WL);
    c.row(17, 2, 13, WD);
    panel(c, 4, 14, 11, 16, W);
    c.line(14, 13, 15, 14, C.iron); // crank
    c.set(15, 15, C.iron);
  });
  A['radio-old'] = P(13, 12, (c) => {
    c.rect(2, 2, 10, 10, WL);
    c.rect(3, 1, 9, 1, WL);
    c.row(1, 4, 8, L(WL));
    c.col(1, 4, 10, WL);
    c.col(11, 4, 10, WL);
    c.col(1, 4, 10, L(WL));
    c.oval(3, 2, 9, 7, hex('#6a5a3a')); // speaker cloth
    for (let y = 3; y < 7; y += 2) c.row(y, 4, 8, hex('#4a3e28'));
    c.rect(4, 8, 8, 8, C.glow);
    dots(c, C.black, [3, 9, 9, 9]);
    c.row(10, 1, 11, WD);
  });
  function tv(c, on) {
    c.rect(1, 1, 17, 14, W);
    c.row(1, 1, 17, WL);
    c.col(1, 1, 14, WL);
    c.row(14, 1, 17, WD);
    c.rect(3, 3, 12, 12, K);
    const scr = hex('#2c3833');
    c.rect(4, 4, 11, 11, scr);
    c.rect(3, 5, 12, 10, scr);
    c.rect(5, 3, 10, 12, scr);
    if (on) {
      const r = rnd(41);
      for (let y = 3; y <= 12; y++)
        for (let x = 3; x <= 12; x++)
          if (c.get(x, y) === scr) c.set(x, y, [C.white, C.ash, C.stoneDark, C.ghost, C.slate][(r() * 5) | 0]);
      c.row(7, 4, 11, C.white);
    } else {
      c.line(5, 6, 7, 4, hex('#46544e'));
    }
    dots(c, C.bone, [15, 4, 15, 7]);
    dots(c, K, [14, 10, 15, 10, 16, 10, 14, 12, 15, 12, 16, 12]);
    c.line(3, 15, 2, 20, WD);
    c.line(15, 15, 16, 20, WD);
    c.line(4, 15, 3, 20, WD);
    c.line(14, 15, 15, 20, WD);
    c.set(6, 0, C.steel);
  }
  A['tv-old-off'] = S(19, 22, (c) => {
    tv(c, false);
    c.clear(6, 0);
  });
  A['tv-old-static'] = S(19, 22, (c) => {
    tv(c, true);
    c.clear(6, 0);
  });

  /* ---------- bookcases ---------- */
  function bookcase(c, x0, y0, x1, y1, col, fill, seed, n = 5) {
    c.rect(x0 - 1, y0 - 1, x1 + 1, y0 - 1, L(col));
    shelves(c, x0, y0, x1, y1 - 2, col, n, (i, a, t, e, b) => {
      const f = Array.isArray(fill) ? fill[i] : fill;
      if (f > 0) books(c, a, e, b, b - t - 0, seed + i * 7, f);
    });
    c.rect(x0, y1 - 1, x1, y1, D(col));
  }
  A['bookcase-full'] = S(26, 38, (c) => bookcase(c, 2, 2, 23, 36, W, 1, 3));
  A['bookcase-half'] = S(26, 38, (c) => {
    bookcase(c, 2, 2, 23, 36, hex('#5c3f2e'), [0.5, 0, 0.75, 0.25, 0.4], 9);
    c.rect(8, 13, 12, 14, C.parchment); // a book lying flat
    c.rect(4, 26, 8, 27, C.wine);
    cobweb(c, 3, 9, 1, 1, 6);
    cobweb(c, 22, 23, -1, 1, 5);
    c.row(34, 12, 20, C.ash);
  });
  A['bookcase-toppled'] = S(44, 18, (c) => {
    c.rect(1, 6, 30, 16, W); // the case on its side, back upwards
    c.row(6, 1, 30, WL);
    c.row(16, 1, 30, WD);
    for (let x = 7; x < 30; x += 6) c.col(x, 7, 15, WD);
    c.line(3, 9, 5, 12, WD);
    c.line(20, 8, 24, 10, WD);
    // books spilled
    c.rect(31, 13, 36, 14, C.wine);
    c.rect(32, 15, 38, 16, C.navy);
    c.poly([[35, 9], [38, 10], [36, 13], [34, 12]], C.forest);
    c.rect(38, 13, 42, 14, C.mustard);
    c.rect(40, 15, 42, 16, C.parchment);
    c.row(16, 31, 34, C.paper);
    c.rect(26, 3, 30, 5, C.plum);
    c.row(3, 26, 30, L(C.plum));
    c.rect(14, 4, 19, 5, C.teal);
    c.set(42, 12, C.paper);
  });

  /* ---------- fireplaces ---------- */
  function fireplace(c, o = {}) {
    const st = o.col || C.stone,
      w = c.w,
      b = c.h - 2;
    c.rect(1, 3, w - 2, 5, L(st)); // mantel
    c.row(3, 1, w - 2, L(L(st)));
    c.row(5, 2, w - 3, D(st));
    c.rect(3, 6, w - 4, b, st);
    c.col(3, 6, b, L(st));
    for (let y = 9; y < b - 2; y += 4) {
      c.row(y, 4, 7, D(st));
      c.row(y + 2, w - 8, w - 5, D(st));
    }
    c.rect(8, 11, w - 9, b, NIGHT); // opening
    c.rect(9, 10, w - 10, 10, NIGHT);
    c.rect(10, 12, w - 11, b - 3, mix(st, 0.32));
    for (let y = 13; y < b - 3; y += 3) c.row(y, 10, w - 11, mix(st, 0.24));
    c.rect(1, b - 1, w - 2, b, D(st)); // hearth
    c.row(b - 1, 1, w - 2, st);
    c.rect(8, b - 1, w - 9, b - 1, mix(st, 0.4));
    // grate
    c.row(b - 4, 12, w - 13, C.ironDark);
    for (let x = 12; x <= w - 13; x += 3) c.col(x, b - 6, b - 2, C.ironDark);
  }
  A['fireplace-cold'] = S(36, 30, (c) => {
    fireplace(c);
    c.row(25, 12, 23, C.ash);
    dots(c, C.ash, [14, 24, 15, 24, 18, 24, 20, 24, 21, 24, 11, 26, 24, 26]);
    dots(c, C.stoneDark, [16, 25, 19, 25]);
    c.rect(6, 1, 7, 2, C.brass); // a lone candlestick on the mantel
    cobweb(c, 9, 11, 1, 1, 5, true);
  });
  A['fireplace-embers'] = S(36, 30, (c) => {
    fireplace(c);
    c.row(23, 13, 22, hex('#3a2420'));
    c.row(24, 12, 23, hex('#5a2a1c'));
    dots(c, C.red, [13, 24, 16, 24, 17, 23, 20, 24, 22, 24, 15, 25, 19, 25]);
    dots(c, C.flame, [14, 24, 18, 24, 21, 23]);
    c.set(18, 23, C.flameLight);
    c.dither(11, 19, 24, 22, hex('#3a1c18'));
    c.row(27, 11, 24, hex('#4a2a22'));
  });

  /* ---------- desks and study ---------- */
  function desk(c, x0, x1, top, b, col) {
    c.rect(x0, top, x1, top + 1, L(col));
    c.row(top, x0, x1, L(L(col)));
    c.rect(x0 + 1, top + 2, x0 + 8, b - 1, col); // left pedestal
    c.rect(x1 - 8, top + 2, x1 - 1, b - 1, col);
    const n = Math.floor((b - top - 3) / 4);
    for (let i = 0; i < n; i++) {
      drawer(c, x0 + 2, top + 3 + i * 4, x0 + 7, top + 5 + i * 4, col);
      drawer(c, x1 - 7, top + 3 + i * 4, x1 - 2, top + 5 + i * 4, col);
    }
    c.rect(x0 + 9, top + 2, x1 - 9, top + 4, col);
    c.row(top + 4, x0 + 9, x1 - 9, D(col));
    c.set((x0 + x1) >> 1, top + 3, C.brass);
    c.row(b, x0 + 1, x0 + 8, D(col));
    c.row(b, x1 - 8, x1 - 1, D(col));
  }
  function bankerLamp(c, x, base) {
    // 7 wide, 7 tall
    c.rect(x, base - 6, x + 6, base - 5, hex('#3d6a4e'));
    c.row(base - 6, x + 1, x + 5, hex('#5d8a66'));
    c.row(base - 4, x + 1, x + 5, C.glow);
    c.col(x + 3, base - 3, base - 1, C.brass);
    c.row(base, x + 1, x + 5, C.brass);
  }
  A['desk-tidy'] = S(30, 24, (c) => {
    desk(c, 1, 28, 8, 22, W);
    bankerLamp(c, 3, 7);
    c.rect(14, 6, 20, 7, C.paper); // blotter and a book
    c.rect(22, 5, 26, 7, C.wine);
    c.row(5, 22, 26, L(C.wine));
  });
  A['desk-cluttered'] = S(30, 24, (c) => {
    desk(c, 1, 28, 8, 22, hex('#5f4030'));
    c.rect(2, 4, 8, 7, C.paper); // heaps of paper
    c.row(5, 2, 8, D(C.paper));
    c.rect(3, 2, 7, 3, C.parchment);
    c.rect(10, 6, 15, 7, C.navy);
    c.rect(11, 4, 16, 5, C.rust);
    c.rect(12, 2, 15, 3, C.paper);
    c.poly([[18, 7], [24, 5], [25, 7]], C.paper);
    c.rect(23, 3, 25, 7, C.black); // ink bottle
    c.set(24, 2, C.white);
    c.line(24, 2, 27, 0, C.white);
    c.clear(27, 0);
    c.set(26, 1, C.white);
    c.rect(17, 12, 21, 13, C.paper); // a sheet slipping off
    c.rect(12, 21, 16, 22, C.paper);
    c.set(17, 22, C.parchment);
  });
  A['writing-bureau'] = S(22, 28, (c) => {
    c.rect(2, 1, 19, 2, WL);
    c.rect(3, 3, 18, 8, W); // pigeonholes
    for (let x = 4; x < 18; x += 5) c.rect(x, 4, x + 3, 7, mix(W, 0.4));
    dots(c, C.paper, [5, 6, 5, 7, 10, 7, 15, 5, 15, 6, 15, 7]);
    c.poly([[2, 9], [19, 9], [20, 13], [1, 13]], WL); // the fall, open
    c.row(9, 2, 19, L(WL));
    c.rect(8, 10, 13, 11, C.paper);
    c.rect(2, 14, 19, 25, W);
    c.col(2, 14, 25, L(W));
    drawer(c, 3, 15, 18, 17, W);
    drawer(c, 3, 19, 18, 21, W);
    drawer(c, 3, 23, 18, 25, W);
    legs(c, [2, 18], 26, 26, WD);
  });
  A['typewriter'] = P(13, 10, (c) => {
    c.rect(4, 1, 9, 3, C.paper); // sheet of paper
    c.row(2, 5, 8, D(C.paper));
    c.rect(1, 4, 11, 4, C.steel); // carriage
    c.rect(2, 5, 10, 6, C.black);
    c.rect(1, 7, 11, 8, C.black);
    c.row(5, 2, 10, hex('#3a3644'));
    dots(c, C.bone, [2, 7, 4, 7, 6, 7, 8, 7, 10, 7, 3, 8, 5, 8, 7, 8, 9, 8]);
    c.set(0, 4, null);
  });
  A['globe-old'] = P(14, 26, (c) => {
    c.oval(2, 1, 11, 10, hex('#5c7a78'));
    c.poly([[4, 3], [7, 2], [8, 5], [6, 7], [4, 6]], hex('#9a8a58'));
    c.rect(9, 6, 10, 8, hex('#9a8a58'));
    c.set(3, 8, hex('#9a8a58'));
    c.line(1, 2, 12, 9, C.brass); // the meridian ring's axis
    c.set(1, 2, C.gold);
    c.col(6, 11, 21, WD);
    c.col(7, 11, 21, W);
    c.row(11, 4, 9, C.brass);
    c.line(6, 20, 3, 24, WD);
    c.line(7, 20, 10, 24, WD);
    c.col(6, 21, 24, WD);
  });
  A['telescope-brass'] = P(24, 30, (c) => {
    c.line(3, 13, 20, 3, C.brass);
    c.line(3, 14, 20, 4, C.brass);
    c.line(4, 15, 21, 5, D(C.brass));
    c.line(14, 6, 21, 2, C.gold);
    c.rect(20, 2, 22, 5, C.brass);
    c.set(2, 14, C.black);
    c.set(1, 15, C.black);
    c.rect(11, 10, 12, 12, C.iron);
    c.line(11, 12, 5, 28, WD);
    c.line(12, 12, 18, 28, WD);
    c.line(12, 12, 12, 27, W);
    c.row(20, 9, 15, D(C.brass));
  });
  function filing(c, open) {
    const col = hex('#5d6660');
    c.rect(1, 1, 11, 27, col);
    c.col(1, 1, 27, L(col));
    c.row(1, 1, 11, L(col));
    for (let i = 0; i < 4; i++) {
      const y = 2 + i * 6 + (i === 3 ? 0 : 0);
      c.frame(2, y, 10, y + 5, D(col));
      c.rect(5, y + 1, 7, y + 1, C.paper);
      c.row(y + 3, 5, 7, C.steel);
    }
    c.row(27, 1, 11, D(col));
    if (open) {
      // second drawer pulled out towards us: bigger, lower, files showing above
      c.rect(1, 8, 11, 9, mix(col, 0.35));
      dots(c, C.paper, [2, 8, 3, 8, 5, 8, 6, 8, 8, 8, 9, 8]);
      dots(c, C.parchment, [4, 8, 7, 8, 10, 8, 3, 7, 6, 7]);
      c.rect(1, 10, 11, 16, L(col));
      c.frame(1, 10, 11, 16, col);
      c.row(10, 1, 11, L(L(col)));
      c.rect(5, 11, 7, 12, C.paper);
      c.row(14, 5, 7, C.steel);
      c.row(17, 1, 11, mix(col, 0.5));
    }
  }
  A['filing-cabinet'] = S(13, 30, (c) => filing(c, false));
  A['filing-cabinet-open'] = S(13, 30, (c) => {
    filing(c, true);
    c.set(12, 27, C.paper);
    c.clear(12, 27);
  });
  function safe(c, open) {
    const col = C.iron;
    c.rect(1, 1, 16, 17, col);
    c.row(1, 1, 16, L(col));
    c.col(1, 1, 17, L(col));
    c.rect(2, 18, 3, 18, C.ironDark);
    c.rect(14, 18, 15, 18, C.ironDark);
    if (open) {
      c.rect(3, 3, 14, 15, NIGHT);
      c.row(9, 3, 14, C.ironDark);
      c.rect(5, 13, 9, 15, C.paper); // a few papers left
      c.row(14, 5, 9, D(C.paper));
      c.rect(11, 14, 13, 15, C.parchment);
      c.rect(14, 2, 16, 16, L(col)); // the door, swung towards us
      c.col(14, 2, 16, C.steel);
      c.col(16, 2, 16, col);
    } else {
      c.frame(3, 3, 14, 15, C.ironDark);
      c.frame(4, 4, 13, 14, L(col));
      c.rect(5, 5, 12, 13, col);
      c.oval(6, 7, 9, 10, C.steel); // dial
      c.set(7, 8, K);
      c.rect(11, 7, 12, 11, C.brass); // handle
      dots(c, C.ironDark, [2, 2, 15, 2, 2, 16, 15, 16]);
    }
  }
  A['safe-shut'] = S(18, 20, (c) => safe(c, false));
  A['safe-open'] = S(18, 20, (c) => safe(c, true));
  A['paper-stack'] = P(10, 8, (c) => {
    c.rect(1, 2, 8, 6, C.paper);
    for (let y = 3; y < 7; y += 2) c.row(y, 1, 8, D(C.paper));
    c.row(1, 2, 8, C.white);
    c.set(1, 4, null);
    c.clear(1, 4);
    c.set(0, 0, null);
    dots(c, D(C.parchment), [3, 1, 4, 1, 6, 1]);
  });
  A['inkwell'] = P(9, 11, (c) => {
    c.line(3, 6, 7, 1, C.white); // quill
    c.line(4, 6, 7, 2, C.bone);
    c.set(6, 1, C.white);
    c.rect(2, 7, 5, 9, C.black);
    c.rect(1, 9, 6, 9, C.black);
    c.row(6, 3, 4, C.brass);
    c.set(2, 7, hex('#3a3644'));
  });
  A['telephone-old'] = P(9, 13, (c) => {
    c.rect(3, 2, 4, 2, C.black); // mouthpiece
    c.rect(2, 1, 5, 1, C.black);
    c.col(3, 3, 9, C.black);
    c.col(4, 3, 9, hex('#3a3644'));
    c.rect(1, 10, 6, 11, C.black);
    c.row(10, 2, 5, hex('#3a3644'));
    c.row(5, 5, 6, C.brass); // hook
    c.rect(6, 4, 7, 8, C.black); // earpiece hanging
    c.set(7, 9, C.black);
  });
  A['reading-lamp'] = P(9, 9, (c) => bankerLamp(c, 1, 7));
  A['lectern'] = S(14, 28, (c) => {
    c.poly([[1, 6], [12, 2], [12, 4], [1, 8]], C.paper); // open book on the slope
    c.line(1, 6, 12, 2, C.white);
    c.line(6, 4, 6, 6, D(C.paper));
    c.poly([[1, 9], [12, 5], [12, 7], [1, 11]], WL);
    c.rect(5, 9, 8, 22, W);
    c.col(5, 9, 22, L(W));
    panel(c, 6, 12, 7, 19, W);
    c.rect(3, 23, 10, 24, W);
    c.rect(2, 25, 11, 26, WD);
    c.row(25, 2, 11, W);
  });
  A['map-table'] = S(30, 18, (c) => {
    c.rect(1, 4, 28, 5, WL);
    c.row(4, 1, 28, L(WL));
    c.rect(4, 2, 20, 3, C.parchment); // chart
    c.row(2, 4, 20, C.paper);
    dots(c, C.rust, [7, 3, 9, 3, 12, 3, 15, 3]);
    c.rect(2, 2, 3, 3, C.paper); // rolled end
    c.rect(22, 2, 24, 3, C.brass); // compass
    c.set(23, 1, C.gold);
    c.rect(2, 6, 27, 7, W);
    c.row(7, 2, 27, WD);
    legs(c, [2, 26], 8, 16, WD);
    c.row(13, 4, 25, WD);
    c.rect(8, 11, 9, 12, C.parchment); // rolled maps on the stretcher
    c.rect(12, 11, 18, 12, C.paper);
    c.set(18, 11, D(C.paper));
  });
  A['book-pile'] = P(11, 12, (c) => {
    const bk = (x0, x1, y, col) => {
      c.rect(x0, y, x1, y + 1, col);
      c.row(y, x0, x1, L(col));
      c.set(x1, y + 1, C.paper);
    };
    bk(1, 9, 9, C.wine);
    bk(2, 8, 7, C.navy);
    bk(1, 8, 5, C.forest);
    bk(3, 9, 3, C.mustard);
    bk(3, 7, 1, C.slate);
  });
  A['library-steps'] = P(16, 18, (c) => {
    for (let i = 0; i < 4; i++) {
      c.rect(1 + i * 3, 13 - i * 4, 13, 14 - i * 4, WL);
      c.rect(2 + i * 3, 15 - i * 4, 3 + i * 3, 16, WD);
    }
    c.rect(12, 2, 13, 16, W);
    c.row(16, 1, 2, WD);
    for (let i = 0; i < 4; i++) c.row(13 - i * 4, 1 + i * 3, 13, L(WL));
  });
  A['magnifier'] = P(11, 9, (c) => {
    c.oval(1, 1, 6, 6, C.brass);
    c.oval(2, 2, 5, 5, C.glassLight);
    c.set(3, 3, C.white);
    c.line(6, 6, 9, 7, WD);
    c.line(7, 6, 9, 6, WD);
  });
  A['desk-chair-old'] = P(14, 22, (c) => {
    const col = hex('#5a3028');
    c.rect(3, 1, 10, 9, col);
    c.row(1, 4, 9, L(col));
    c.clear(3, 1);
    c.clear(10, 1);
    dots(c, D(col), [5, 4, 8, 4, 5, 7, 8, 7]);
    c.col(3, 2, 9, L(col));
    c.rect(1, 9, 2, 11, W); // arms
    c.rect(11, 9, 12, 11, W);
    c.rect(2, 12, 11, 13, col);
    c.row(12, 2, 11, L(col));
    c.rect(6, 14, 7, 17, C.iron);
    c.line(6, 17, 2, 19, C.ironDark);
    c.line(7, 17, 11, 19, C.ironDark);
    c.col(6, 17, 19, C.ironDark);
    dots(c, K, [2, 20, 6, 20, 11, 20]);
  });
  A['folding-screen'] = S(30, 36, (c) => {
    const cols = [hex('#5d6a5a'), hex('#4c5a4e'), hex('#5d6a5a')];
    [[1, 3], [10, 1], [19, 3]].forEach(([x, t], i) => {
      c.rect(x, t, x + 9, 33 - (i === 1 ? 1 : 0), WD);
      c.rect(x + 1, t + 1, x + 8, 31 - (i === 1 ? 1 : 0), cols[i]);
      c.col(x, t, 33, i === 1 ? WD : W);
    });
    c.rect(1, 34, 2, 34, WD);
    c.rect(27, 34, 28, 34, WD);
    c.rect(10, 33, 11, 34, WD);
    c.rect(18, 33, 19, 34, WD);
    // faded painting: a bare branch, a pale moon, two birds
    const br = hex('#2e3430');
    c.line(3, 26, 14, 14, br);
    c.line(14, 14, 26, 10, br);
    c.line(9, 20, 5, 15, br);
    c.line(17, 13, 20, 18, br);
    c.line(22, 11, 24, 6, br);
    c.oval(21, 16, 25, 20, hex('#b5ac8a'));
    dots(c, hex('#9a5a4a'), [5, 14, 12, 15, 20, 19, 24, 5, 7, 22, 15, 12]);
    dots(c, C.bone, [4, 8, 5, 7, 6, 8, 13, 6, 14, 5, 15, 6]);
    c.dither(2, 27, 8, 31, hex('#4f5a4c'));
  });
  A['card-table'] = S(20, 15, (c) => {
    c.rect(1, 2, 18, 3, hex('#3f5e46'));
    c.row(2, 1, 18, hex('#537a5a'));
    c.row(4, 1, 18, W);
    dots(c, C.white, [4, 1, 5, 1, 7, 1, 8, 1, 12, 1, 13, 1]); // cards
    c.set(15, 1, C.red);
    c.line(3, 5, 2, 13, WD);
    c.line(16, 5, 17, 13, WD);
    c.line(4, 5, 3, 13, W);
    c.line(15, 5, 16, 13, W);
    c.line(5, 6, 14, 12, D(WD)); // folding braces
    c.line(14, 6, 5, 12, D(WD));
  });

  /* ---------- beds ---------- */
  function mattress(c, x0, x1, y0, y1, col = C.cream) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.row(y1, x0, x1, D(col));
  }
  function pillow(c, x0, y0, x1, y1, col = C.white) {
    c.rect(x0, y0, x1, y1, col);
    c.clear(x0, y0);
    c.clear(x1, y0);
    c.row(y1, x0, x1, D(col));
  }
  function blanket(c, x0, x1, y0, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.row(y1, x0, x1, D(col));
  }
  function woodBed(c, o) {
    const w = c.w,
      b = c.h - 2,
      fc = o.frame || W,
      hh = o.head || 16,
      fh = o.foot || 10,
      my = b - 8 - (o.thick || 0);
    c.rect(1, b - hh + 1, 3, b, fc); // headboard, seen edge on
    c.col(1, b - hh + 1, b, L(fc));
    c.set(2, b - hh, fc);
    c.rect(w - 4, b - fh + 1, w - 2, b, fc);
    c.col(w - 4, b - fh + 1, b, L(fc));
    c.set(w - 3, b - fh, fc);
    mattress(c, 4, w - 5, my, b - 5);
    c.rect(4, b - 4, w - 5, b - 3, fc); // side rail
    c.row(b - 4, 4, w - 5, L(fc));
    c.row(b - 3, 4, w - 5, D(fc));
    return my;
  }
  function ironBed(c, o = {}) {
    const w = c.w,
      b = c.h - 2,
      ic = o.col || C.iron,
      hh = o.head || 16,
      fh = o.foot || 12;
    const end = (x, h) => {
      c.col(x, b - h + 1, b, ic);
      c.col(x + 2, b - h + 2, b - 4, D(ic));
      c.row(b - h + 2, x, x + 2, ic);
      c.row(b - h + 6, x, x + 2, D(ic));
      c.set(x, b - h, C.brass);
    };
    end(1, hh);
    end(w - 4, fh);
    c.col(w - 2, b - fh + 1, b, ic);
    c.col(w - 4, b - fh + 2, b - 4, D(ic));
    c.set(w - 4, b - fh, null);
    c.clear(w - 4, b - fh);
    c.set(w - 2, b - fh, C.brass);
    mattress(c, 3, w - 4, b - 8, b - 5, o.tick || C.cream);
    c.row(b - 4, 2, w - 3, ic);
    return b - 8;
  }
  A['bed-single-old'] = S(38, 20, (c) => {
    const my = ironBed(c, { head: 16, foot: 11 });
    pillow(c, 5, my - 2, 10, my);
    const col = hex('#5c5a48');
    blanket(c, 13, 33, my - 1, my + 3, col);
    c.rect(13, my - 1, 15, my + 3, C.cream); // sheet turned down
    c.row(my + 1, 16, 33, D(col));
    c.row(my + 2, 16, 33, hex('#7a3a34')); // a stripe
  });
  A['bed-iron'] = S(38, 22, (c) => {
    const b = 20;
    ironBed(c, { head: 19, foot: 15, col: hex('#8d8f8a'), tick: C.white });
    c.clearRect(3, 12, 33, 16);
    mattress(c, 3, 33, 10, 13, C.white); // set higher, hospital fashion
    c.row(14, 2, 35, hex('#8d8f8a'));
    c.clearRect(2, 16, 35, 16);
    c.col(1, 2, b, hex('#8d8f8a'));
    c.col(34, 6, b, D(hex('#8d8f8a')));
    c.col(36, 6, b, hex('#8d8f8a'));
    c.col(3, 3, 15, D(hex('#8d8f8a')));
    pillow(c, 5, 8, 10, 10);
    blanket(c, 14, 33, 9, 13, hex('#9aa39a'));
    c.row(11, 14, 33, hex('#7d8880'));
    dots(c, K, [1, 20, 36, 20]); // castors
    c.rect(17, 15, 20, 16, hex('#6f706c')); // crank
  });
  A['bed-double-old'] = S(42, 26, (c) => {
    const my = woodBed(c, { head: 21, foot: 12, thick: 1 });
    c.rect(1, 4, 4, 8, WL);
    c.col(1, 4, 8, L(WL));
    pillow(c, 5, my - 3, 11, my);
    pillow(c, 7, my - 4, 12, my - 2, C.bone);
    // patchwork quilt
    const q = [C.wine, C.mustard, C.forest, C.navy, hex('#8a5560')];
    for (let x = 14; x <= 36; x += 3) for (let y = my - 1; y <= my + 4; y += 3) c.rect(x, y, Math.min(36, x + 2), y + 2, q[(((x - 14) / 3) * 2 + (y - my + 1) / 3) % 5]);
    c.row(my - 1, 14, 36, L(C.cream));
    c.rect(14, my + 5, 36, my + 5, D(C.wine));
  });
  A['bed-unmade'] = S(38, 22, (c) => {
    const my = woodBed(c, { head: 17, foot: 10 });
    pillow(c, 6, my - 3, 11, my - 1);
    c.set(5, my - 1, C.white); // pillow askew
    c.poly([[15, my - 2], [22, my - 3], [27, my - 1], [33, my + 3], [14, my + 3]], C.wine); // blanket thrown back in a heap
    c.line(15, my - 2, 22, my - 3, L(C.wine));
    c.line(22, my - 3, 27, my - 1, L(C.wine));
    c.line(18, my, 21, my + 3, D(C.wine));
    c.line(24, my, 26, my + 3, D(C.wine));
    c.poly([[26, my + 1], [33, my + 2], [33, 19], [29, 19]], C.wine); // and trailing to the floor
    c.col(30, my + 3, 19, D(C.wine));
    c.row(my + 1, 11, 14, D(C.cream)); // creases
    c.row(my + 2, 8, 10, D(C.cream));
  });
  A['bed-child'] = S(28, 17, (c) => {
    const my = woodBed(c, { head: 13, foot: 9, frame: hex('#8a8272') });
    pillow(c, 5, my - 2, 9, my);
    blanket(c, 11, 23, my - 1, my + 3, C.navy);
    dots(c, C.glow, [13, my + 1, 17, my, 20, my + 2, 15, my + 2, 22, my]);
  });
  A['bed-fourposter'] = S(46, 46, (c) => {
    const b = 44,
      dr = hex('#5a2430');
    c.rect(1, 1, 44, 4, dr); // tester
    c.row(1, 1, 44, L(dr));
    for (let x = 1; x <= 44; x += 4) {
      c.rect(x, 5, x + 2, 6, dr);
      c.set(x + 1, 7, C.gold);
    }
    c.rect(1, 5, 2, b, WD); // posts
    c.rect(43, 5, 44, b, WD);
    c.col(1, 5, b, W);
    c.col(43, 5, b, W);
    c.poly([[3, 5], [8, 5], [6, 20], [7, 26], [5, 34], [3, 36]], dr); // curtain tied back at the head
    c.line(5, 8, 4, 30, D(dr));
    c.row(26, 3, 7, C.gold);
    c.poly([[42, 5], [38, 5], [40, 22], [39, 28], [42, 36]], dr);
    c.line(41, 8, 41, 30, D(dr));
    c.row(27, 39, 42, C.gold);
    c.rect(3, 22, 5, 36, W); // headboard
    mattress(c, 3, 42, 33, 37);
    pillow(c, 6, 30, 12, 33);
    pillow(c, 8, 29, 13, 31, C.bone);
    blanket(c, 15, 42, 32, 37, hex('#6a5030'));
    c.row(34, 15, 42, C.gold);
    c.rect(3, 38, 42, 40, WD);
    c.row(38, 3, 42, W);
    c.rect(3, 41, 42, 42, dr); // valance
    for (let x = 4; x < 42; x += 3) c.col(x, 41, 42, D(dr));
  });
  A['mattress-stained'] = P(36, 9, (c) => {
    const t = hex('#a39a7c');
    c.rect(1, 2, 34, 7, t);
    c.row(2, 2, 33, L(t));
    c.clear(1, 2);
    c.clear(34, 2);
    c.row(7, 1, 34, D(t));
    for (let x = 4; x < 34; x += 4) c.col(x, 3, 6, hex('#7c8086')); // ticking stripes
    stain(c, 8, 3, 15, 6, C.blood, 2);
    stain(c, 22, 4, 27, 6, hex('#6e6238'), 5);
    c.set(16, 7, C.blood);
    tear(c, 29, 3, t, 3);
  });
  A['cradle'] = P(20, 16, (c) => {
    c.rect(2, 3, 4, 10, W); // hooded end
    c.rect(2, 2, 7, 3, W);
    c.row(2, 2, 7, WL);
    c.rect(3, 7, 17, 11, W);
    c.col(2, 3, 10, WL);
    c.row(7, 5, 17, WL);
    c.rect(6, 5, 16, 6, C.cream); // bedding
    c.row(5, 6, 16, C.white);
    panel(c, 6, 8, 15, 10, W);
    c.row(12, 3, 17, WD);
    c.poly([[1, 12], [3, 14], [16, 14], [18, 12], [17, 13], [2, 13]], WD); // rockers
    c.row(14, 4, 15, WD);
  });
  function crib(c, col, o = {}) {
    const w = c.w,
      b = c.h - 2;
    c.rect(1, 2, 2, b, col);
    c.rect(w - 3, 2, w - 2, b, col);
    c.col(1, 2, b, L(col));
    c.row(4, 3, w - 4, col);
    c.row(b - 4, 3, w - 4, col);
    for (let x = 4; x < w - 3; x += 2) c.col(x, 5, b - 5, D(col));
    if (o.bars) for (const x of o.bars) c.clearRect(x, 5, x, b - 5);
    c.rect(3, b - 6, w - 4, b - 5, o.bed || C.cream);
    c.rect(3, b - 3, w - 4, b - 3, D(col));
    c.set(1, 1, L(col));
    c.set(w - 3, 1, L(col));
  }
  A['crib-old'] = S(22, 20, (c) => {
    crib(c, hex('#8d8a7a'), { bed: hex('#9c937a'), bars: [8, 14] });
    cobweb(c, 3, 5, 1, 1, 5, true);
    c.speckle(1, 1, 20, 18, hex('#6a5a48'), 9, 3); // paint flaking
  });

  /* ---------- wardrobes and drawers ---------- */
  function wardrobeBody(c, col) {
    const w = c.w,
      b = c.h - 2;
    c.rect(1, 1, w - 2, 3, L(col)); // cornice
    c.row(1, 1, w - 2, L(L(col)));
    c.row(3, 1, w - 2, col);
    c.rect(2, 4, w - 3, b - 1, col);
    c.col(2, 4, b - 1, L(col));
    c.rect(2, b - 6, w - 3, b - 1, col);
    drawer(c, 3, b - 6, w - 4, b - 2, col);
    legs(c, [2, w - 4], b, b, D(col));
  }
  function wardrobeDoor(c, x0, x1, y0, y1, col) {
    c.rect(x0, y0, x1, y1, col);
    panel(c, x0 + 1, y0 + 1, x1 - 1, y0 + 14, col);
    panel(c, x0 + 1, y0 + 16, x1 - 1, y1 - 1, col);
  }
  A['wardrobe-old'] = S(24, 38, (c) => {
    wardrobeBody(c, W);
    wardrobeDoor(c, 3, 11, 5, 29, W);
    wardrobeDoor(c, 12, 20, 5, 29, W);
    c.col(11, 5, 29, WD);
    dots(c, C.brass, [10, 18, 13, 18, 10, 19]);
  });
  A['wardrobe-open'] = S(30, 38, (c) => {
    wardrobeBody(c, W);
    c.clearRect(23, 1, 28, 36);
    c.rect(3, 5, 20, 29, mix(W, 0.3)); // the dark inside
    c.row(7, 3, 20, C.steel); // rail
    const coats = [hex('#4b4438'), C.wine, C.navy, hex('#6a6a5a'), C.black];
    coats.forEach((col, i) => {
      const x = 4 + i * 3;
      c.set(x + 1, 8, C.steel);
      c.rect(x, 9, x + 2, 22 + (i % 2) * 4, col);
      c.col(x, 10, 22 + (i % 2) * 4, L(col));
      c.set(x, 9, null);
    });
    c.rect(4, 27, 8, 28, hex('#3a2a22')); // shoes
    c.rect(12, 28, 15, 28, C.black);
    // the two doors swung wide, seen from their inner side
    c.rect(1, 5, 2, 29, WL);
    c.clearRect(21, 5, 21, 29);
    c.rect(19, 5, 20, 29, mix(W, 0.3));
    c.rect(21, 4, 21, 29, W);
    c.rect(22, 5, 27, 30, WL);
    c.col(22, 5, 30, L(WL));
    panel(c, 23, 7, 26, 28, WL);
    c.row(30, 22, 27, D(WL));
  });
  A['wardrobe-eyes'] = S(24, 38, (c) => {
    const col = hex('#4f3528');
    wardrobeBody(c, col);
    wardrobeDoor(c, 3, 11, 5, 29, col);
    c.rect(12, 5, 20, 29, NIGHT); // the gap
    c.rect(16, 5, 20, 29, col); // right door standing ajar
    panel(c, 17, 6, 19, 19, col);
    panel(c, 17, 21, 19, 28, col);
    c.col(16, 5, 29, L(col));
    c.set(17, 18, C.brass);
    dots(c, C.glow, [13, 12, 15, 12]); // something watching
    dots(c, C.flame, [13, 13, 15, 13]);
    c.line(12, 22, 14, 24, hex('#2a2430')); // long fingers on the door edge
    dots(c, hex('#6a6a70'), [15, 21, 15, 23, 15, 25]);
  });
  function chestOfDrawers(c, col, open) {
    const w = c.w,
      b = c.h - 2;
    c.rect(1, 2, w - 2, 3, L(col));
    c.row(2, 1, w - 2, L(L(col)));
    c.rect(2, 4, w - 3, b - 1, col);
    c.col(2, 4, b - 1, L(col));
    const n = Math.floor((b - 5) / 4);
    for (let i = 0; i < n; i++) if (i !== open) drawer(c, 3, 5 + i * 4, w - 4, 7 + i * 4, col);
    legs(c, [2, w - 4], b, b, D(col));
    if (open != null) {
      const y = 5 + open * 4;
      c.rect(3, y, w - 4, y + 1, mix(col, 0.3));
      c.rect(2, y + 1, w - 3, y + 4, L(col)); // pulled out, so it sits lower and nearer
      c.row(y + 1, 2, w - 3, L(L(col)));
      c.row(y + 4, 2, w - 3, col);
      dots(c, C.brass, [5, y + 3, w - 6, y + 3]);
      c.rect(5, y - 1, 9, y, C.cream); // clothes spilling over
      c.rect(11, y, 15, y, C.wine);
      c.col(14, y, y + 3, C.wine);
      c.col(8, y, y + 2, C.cream);
      c.set(13, y + 4, C.wine);
    }
  }
  A['chest-of-drawers'] = S(22, 23, (c) => chestOfDrawers(c, W));
  A['chest-of-drawers-open'] = S(22, 23, (c) => chestOfDrawers(c, W, 1));
  A['dressing-table'] = S(26, 34, (c) => {
    const col = hex('#7a5a44');
    c.rect(7, 2, 18, 17, col); // mirror
    c.rect(9, 1, 16, 1, col);
    c.oval(8, 2, 17, 16, C.glass);
    c.rect(8, 6, 17, 16, C.glass);
    c.line(10, 9, 13, 5, C.glassLight);
    c.line(11, 12, 15, 7, C.glassLight);
    c.rect(3, 13, 5, 17, col);
    c.rect(20, 13, 22, 17, col);
    c.rect(1, 18, 24, 19, L(col));
    c.row(18, 1, 24, L(L(col)));
    c.rect(2, 20, 9, 27, col);
    c.rect(16, 20, 23, 27, col);
    drawer(c, 3, 21, 8, 23, col);
    drawer(c, 3, 25, 8, 27, col);
    drawer(c, 17, 21, 22, 23, col);
    drawer(c, 17, 25, 22, 27, col);
    c.rect(10, 20, 15, 21, col);
    legs(c, [2, 8, 16, 22], 28, 32, D(col));
    c.rect(4, 15, 5, 17, C.glassLight); // scent bottle and brush
    c.set(4, 14, C.gold);
    c.rect(19, 17, 22, 17, C.bone);
  });
  A['nightstand'] = P(12, 22, (c) => {
    candle(c, 5, 4, 7, false);
    c.row(8, 3, 7, C.brass);
    c.set(8, 7, C.brass);
    c.rect(1, 9, 10, 10, WL);
    c.row(9, 1, 10, L(WL));
    c.rect(2, 11, 9, 18, W);
    drawer(c, 3, 12, 8, 14, W);
    panel(c, 3, 16, 8, 18, W);
    legs(c, [2, 8], 19, 20, WD);
  });
  A['washstand'] = S(18, 28, (c) => {
    const en = hex('#c2c4bc');
    c.rect(11, 3, 14, 9, en); // jug
    c.set(10, 3, en);
    c.rect(12, 2, 13, 2, en);
    c.col(15, 4, 7, D(en));
    c.col(11, 3, 9, C.white);
    c.row(6, 11, 14, hex('#5a6a88'));
    c.poly([[2, 7], [9, 7], [8, 10], [3, 10]], en); // basin
    c.row(7, 2, 9, C.white);
    c.rect(1, 11, 16, 12, hex('#9a9aa0')); // marble top
    c.row(11, 1, 16, hex('#b5b5b8'));
    c.rect(2, 13, 15, 16, W);
    drawer(c, 3, 13, 14, 15, W);
    legs(c, [2, 14], 17, 25, WD);
    c.row(22, 4, 13, W);
    c.row(23, 4, 13, WD);
    c.col(1, 13, 20, C.brass); // towel rail
    c.rect(0, 0, 0, 0, null);
    c.rect(1, 14, 1, 19, C.cream);
  });
  A['bedpan'] = P(10, 8, (c) => {
    const en = hex('#c2c4bc');
    c.rect(2, 2, 7, 6, en);
    c.rect(1, 2, 8, 2, C.white);
    c.col(2, 3, 6, C.white);
    c.row(2, 1, 8, hex('#3a4a70')); // blue rim
    c.set(8, 4, en);
    c.clear(2, 6);
    c.clear(7, 6);
    c.set(5, 5, C.rust); // chipped
  });
  function trunk(c, col, o = {}) {
    const w = c.w,
      b = c.h - 2,
      t = o.top || 1;
    c.rect(1, t + 1, w - 2, b, col);
    c.rect(2, t, w - 3, t, col);
    c.row(t, 2, w - 3, L(col));
    c.col(1, t + 1, b, L(col));
    c.row(t + 4, 1, w - 2, D(col)); // lid line
    for (const x of o.straps || [4, w - 6]) {
      c.rect(x, t, x + 1, b, o.strap || hex('#3a2a20'));
      c.set(x, t + 5, C.brass);
    }
    c.rect((w >> 1) - 1, t + 4, w >> 1, t + 6, C.brass);
    dots(c, C.brass, [1, t + 1, w - 2, t + 1, 1, b, w - 2, b]);
  }
  A['trunk-old'] = S(22, 14, (c) => trunk(c, hex('#5e4a36')));
  A['blanket-box'] = S(24, 13, (c) => {
    c.rect(1, 1, 22, 2, WL);
    c.row(1, 1, 22, L(WL));
    c.rect(2, 3, 21, 10, W);
    c.col(2, 3, 10, L(W));
    panel(c, 4, 4, 10, 9, W);
    panel(c, 13, 4, 19, 9, W);
    c.set(11, 4, C.brass);
    c.row(11, 2, 3, WD);
    c.row(11, 20, 21, WD);
    c.rect(15, 1, 19, 1, C.cream); // a corner of blanket caught in the lid
    c.rect(18, 2, 19, 4, C.cream);
  });

  /* ---------- tables and chairs ---------- */
  function table(c, x0, x1, top, b, col, o = {}) {
    c.rect(x0, top, x1, top + 1, L(col));
    c.row(top, x0, x1, L(L(col)));
    c.rect(x0 + 2, top + 2, x1 - 2, top + 3, col);
    c.row(top + 3, x0 + 2, x1 - 2, D(col));
    legs(c, [x0 + 2, x1 - 3], top + 4, b, D(col));
    c.col(x0 + 2, top + 4, b, col);
    c.col(x1 - 3, top + 4, b, col);
    if (o.mid) legs(c, [(x0 + x1) >> 1], top + 4, b, D(col));
  }
  A['table-long'] = S(42, 17, (c) => table(c, 1, 40, 2, 15, W, { mid: true }));
  A['table-round'] = S(22, 16, (c) => {
    roundTable(c, 1, 20, 2, 14, W);
    c.rect(9, 5, 12, 11, W);
    c.col(9, 5, 11, WL);
    c.rect(8, 8, 13, 9, WD);
    c.row(13, 6, 15, WD);
    c.row(14, 4, 17, WD);
  });
  A['table-set'] = S(42, 24, (c) => {
    table(c, 1, 40, 9, 22, W, { mid: true });
    c.rect(1, 9, 40, 10, C.white); // cloth
    c.row(11, 1, 40, C.cream);
    for (let x = 1; x <= 40; x += 1) if (x % 4 !== 0) c.set(x, 12, C.cream);
    c.row(9, 1, 40, L(C.white));
    for (const x of [5, 14, 25, 34]) {
      c.row(8, x, x + 3, C.glassLight); // plates
      c.set(x - 1, 8, C.steel);
    }
    for (const x of [10, 30]) c.rect(x, 6, x, 8, C.glass); // glasses
    // a candelabrum in the middle
    c.col(20, 4, 8, C.brass);
    c.row(5, 18, 22, C.brass);
    candle(c, 18, 3, 4, true);
    candle(c, 20, 2, 3, true);
    candle(c, 22, 3, 4, true);
    c.row(8, 19, 21, D(C.brass));
  });
  A['table-dustsheet'] = S(42, 17, (c) => {
    drape(c, [[2, 2], [39, 2], [40, 4], [40, 13], [38, 15], [3, 15], [1, 13], [1, 4]], 23);
    c.row(4, 2, 39, FOLD);
    c.clearRect(8, 14, 12, 15);
    c.clearRect(26, 15, 33, 15);
    c.rect(4, 14, 5, 15, WD); // legs showing under the hem
    c.rect(36, 14, 37, 15, WD);
    c.clearRect(1, 14, 3, 15);
    c.clearRect(38, 14, 40, 15);
  });
  A['chair-dining'] = P(11, 21, (c) => chair(c, 1, 19, { col: W }));
  A['chair-dining-red'] = P(11, 21, (c) => {
    chair(c, 1, 19, { col: WD, pad: hex('#7a2b30'), padBack: true });
    c.rect(1, 9, 8, 10, hex('#7a2b30'));
    c.row(9, 1, 8, L(hex('#7a2b30')));
    c.rect(3, 3, 3, 6, hex('#7a2b30'));
  });
  A['chair-toppled'] = P(21, 12, (c) => {
    // the same chair, on its back
    c.rect(1, 8, 18, 9, W);
    c.row(8, 1, 18, WL);
    c.rect(9, 2, 10, 9, W);
    c.rect(18, 3, 19, 9, W);
    c.col(9, 2, 9, WL);
    c.row(10, 1, 19, WD);
    c.rect(9, 1, 10, 1, WL);
    c.row(5, 11, 17, WD);
    c.set(2, 7, WD);
    c.set(5, 7, WD);
  });
  A['chair-broken'] = P(22, 12, (c) => {
    c.poly([[1, 9], [9, 6], [10, 7], [2, 10]], W); // the back, flat
    c.line(1, 9, 9, 6, WL);
    c.rect(8, 8, 15, 9, W); // seat
    c.row(8, 8, 15, WL);
    c.line(14, 8, 17, 3, WD); // one leg in the air
    c.line(15, 8, 18, 3, W);
    dots(c, C.woodPale, [17, 2, 18, 2, 19, 1]);
    c.clear(19, 1);
    c.rect(16, 10, 20, 10, WD); // legs snapped off
    c.set(20, 9, C.woodPale);
    c.line(3, 4, 6, 5, WD);
    c.set(2, 4, C.woodPale);
    dots(c, C.woodPale, [12, 10, 7, 10, 11, 5]);
  });
  A['highchair'] = P(13, 25, (c) => {
    c.rect(2, 1, 3, 13, W);
    c.col(2, 1, 13, WL);
    c.rect(2, 2, 3, 4, WL);
    c.rect(2, 11, 9, 12, W);
    c.row(11, 2, 9, WL);
    c.rect(6, 8, 11, 8, WL); // tray
    c.col(9, 9, 10, WD);
    c.line(2, 13, 1, 23, WD);
    c.line(3, 13, 2, 23, W);
    c.line(8, 13, 10, 23, WD);
    c.line(9, 13, 11, 23, W);
    c.row(18, 2, 10, WD);
    c.row(21, 2, 10, W);
  });
  function candelabra(c, lit) {
    const b = c.h - 2;
    c.col(6, 7, b - 1, C.brass);
    c.row(b, 4, 8, C.brass);
    c.row(b - 1, 5, 7, D(C.brass));
    c.set(6, 10, C.gold);
    c.row(8, 2, 10, C.brass);
    c.set(2, 7, C.brass);
    c.set(10, 7, C.brass);
    c.set(2, 9, null);
    candle(c, 2, 4, 6, lit);
    candle(c, 6, 3, 6, lit);
    candle(c, 10, 4, 6, lit);
    if (!lit) dots(c, C.bone, [3, 6, 7, 5]); // drips
  }
  A['candelabra'] = P(13, 16, (c) => candelabra(c, false));
  A['candelabra-lit'] = P(13, 16, (c) => candelabra(c, true));
  A['serving-trolley'] = P(22, 18, (c) => {
    c.rect(2, 5, 18, 5, C.brass);
    c.rect(2, 11, 18, 11, C.brass);
    c.col(2, 3, 14, C.brass);
    c.col(18, 5, 14, D(C.brass));
    c.line(2, 3, 0, 2, C.brass);
    c.clear(0, 2);
    c.set(1, 2, C.brass);
    c.rect(5, 2, 8, 4, C.white); // teapot
    c.set(9, 3, C.white);
    c.set(4, 3, C.white);
    c.set(6, 1, C.white);
    c.rect(12, 3, 13, 4, C.white);
    c.rect(15, 4, 16, 4, C.white);
    c.rect(6, 9, 12, 10, C.glassLight); // plates below
    c.oval(1, 13, 4, 16, C.ironDark);
    c.oval(16, 13, 19, 16, C.ironDark);
    c.set(2, 14, C.steel);
    c.set(17, 14, C.steel);
  });
  A['bench-church'] = S(36, 20, (c) => {
    const col = hex('#5a3c2a');
    c.rect(1, 1, 3, 18, col); // carved end
    c.rect(2, 0, 2, 0, null);
    c.col(1, 2, 18, L(col));
    c.rect(32, 1, 34, 18, col);
    c.col(32, 2, 18, L(col));
    c.rect(4, 3, 31, 9, col); // back
    c.row(3, 4, 31, L(col));
    for (let x = 8; x < 31; x += 6) c.col(x, 4, 9, D(col));
    c.rect(4, 11, 31, 12, L(col)); // seat
    c.row(13, 4, 31, D(col));
    c.rect(4, 10, 31, 10, mix(col, 0.5));
    c.rect(4, 14, 31, 17, mix(col, 0.5));
    c.clearRect(4, 16, 31, 18);
    dots(c, C.gold, [2, 4, 33, 4]);
    c.set(2, 5, D(col));
    c.set(33, 5, D(col));
  });

  /* ====================== DOORS, WINDOWS, STAIRS ====================== */
  const GLOOM = hex('#221f2a');
  function jamb(c, fr) {
    const w = c.w,
      b = c.h - 2;
    c.rect(1, 1, w - 2, b, fr);
    c.row(1, 1, w - 2, L(fr));
    c.col(1, 1, b, L(fr));
  }
  function leaf(c, x0, x1, col, o = {}) {
    const b = c.h - 2,
      m = (x0 + x1) >> 1;
    c.rect(x0, 3, x1, b, col);
    c.col(x0, 3, b, L(col));
    if (o.plain) {
      for (let x = x0 + 3; x < x1; x += 3) c.col(x, 3, b, D(col));
    } else if (x1 - x0 >= 12) {
      panel(c, x0 + 2, 5, m - 1, 17, col);
      panel(c, m + 2, 5, x1 - 2, 17, col);
      panel(c, x0 + 2, 22, m - 1, b - 3, col);
      panel(c, m + 2, 22, x1 - 2, b - 3, col);
    } else {
      panel(c, x0 + 2, 5, x1 - 2, 17, col);
      panel(c, x0 + 2, 22, x1 - 2, b - 3, col);
    }
    if (o.knob !== false) {
      const kx = o.knobLeft ? x0 + 1 : x1 - 1;
      c.set(kx, 19, o.knob || C.brass);
      c.set(kx, 20, D(o.knob || C.brass));
    }
  }
  function beyond(c, x0, x1) {
    const b = c.h - 2;
    c.rect(x0, 3, x1, b, NIGHT);
    c.row(b, x0, x1, hex('#2c2834'));
    c.row(b - 1, x0 + 1, x1, GLOOM);
  }
  function door(c, col, state, o = {}) {
    const w = c.w,
      b = c.h - 2;
    jamb(c, o.frame || mix(col, 0.62));
    if (state === 'shut') leaf(c, 3, w - 4, col, o);
    else if (state === 'ajar') {
      beyond(c, 3, w - 4);
      leaf(c, 3, w - 8, col, o);
      c.col(w - 7, 3, b, mix(col, 0.5));
    } else {
      beyond(c, 3, w - 4);
      c.rect(3, 3, 5, b, D(col)); // the door, swung in, edge on
      c.col(3, 3, b, col);
      c.set(5, 20, C.brass);
    }
  }
  const DOORCOL = {
    oak: W,
    dark: hex('#3a2a2c'),
    white: hex('#b4b0a0'),
    green: hex('#40594a'),
    red: hex('#7a2e2a'),
    blue: hex('#35466a'),
  };
  for (const [k, col] of Object.entries(DOORCOL)) {
    const o = k === 'oak' ? { frame: WD } : k === 'white' ? { frame: hex('#8a8678') } : {};
    A['door-' + k] = S(20, 38, (c) => door(c, col, 'shut', o));
    A['door-' + k + '-ajar'] = S(20, 38, (c) => door(c, col, 'ajar', o), { solid: false });
    if (['oak', 'dark', 'white'].includes(k)) A['door-' + k + '-open'] = S(20, 38, (c) => door(c, col, 'open', o), { solid: false });
  }
  A['door-double'] = S(36, 38, (c) => {
    jamb(c, WD);
    leaf(c, 3, 17, W);
    leaf(c, 18, 32, W, { knobLeft: true });
    c.col(17, 3, 36, WD);
  });
  A['door-double-open'] = P(36, 38, (c) => {
    jamb(c, WD);
    beyond(c, 3, 32);
    c.rect(3, 3, 5, 36, D(W));
    c.col(3, 3, 36, W);
    c.rect(30, 3, 32, 36, D(W));
    c.col(32, 3, 36, W);
    dots(c, C.brass, [5, 20, 30, 20]);
    c.row(36, 8, 27, hex('#3a3540'));
  });
  A['door-glass'] = S(20, 38, (c) => {
    const col = hex('#9c9684');
    jamb(c, hex('#7a7566'));
    c.rect(3, 3, 16, 36, col);
    c.col(3, 3, 36, L(col));
    for (let j = 0; j < 4; j++)
      for (let i = 0; i < 2; i++) {
        const x = 5 + i * 6,
          y = 5 + j * 7;
        c.rect(x, y, x + 4, y + 5, hex('#3d5560'));
        c.line(x + 1, y + 3, x + 3, y + 1, C.glass);
        if ((i + j) % 3 === 0) c.set(x + 3, y + 4, C.glassLight);
      }
    panel(c, 5, 33, 15, 35, col);
    dots(c, C.brass, [15, 19, 15, 20]);
  });
  function cellDoor(c, open) {
    const st = C.stoneDark;
    jamb(c, st);
    for (let y = 5; y < 36; y += 6) {
      c.set(1, y, D(st));
      c.set(2, y, D(st));
      c.set(18, y + 3, mix(st, 0.5));
      c.set(17, y + 3, D(st));
    }
    beyond(c, 3, 16);
    const bar = C.steel,
      bd = C.iron;
    if (open) {
      for (const x of [3, 5, 7]) c.col(x, 3, 36, x === 3 ? bar : bd);
      c.row(8, 3, 7, bd);
      c.row(30, 3, 7, bd);
      c.row(19, 3, 7, bd);
    } else {
      for (let x = 4; x <= 16; x += 3) {
        c.col(x, 3, 36, bd);
        c.set(x, 4, bar);
        for (let y = 6; y < 36; y += 5) c.set(x, y, bar);
      }
      c.row(8, 3, 16, bd);
      c.row(30, 3, 16, bd);
      c.rect(13, 17, 16, 22, C.ironDark); // lock plate
      c.frame(13, 17, 16, 22, bd);
      c.set(15, 20, K);
    }
  }
  A['door-cell'] = S(20, 38, (c) => cellDoor(c, false));
  A['door-cell-open'] = P(20, 38, (c) => cellDoor(c, true));
  A['door-iron-riveted'] = S(20, 38, (c) => {
    const col = C.iron;
    jamb(c, C.ironDark);
    c.rect(3, 3, 16, 36, col);
    c.col(3, 3, 36, L(col));
    for (const y of [3, 14, 25, 36]) c.row(y, 3, 16, y === 36 ? C.ironDark : L(col));
    for (const y of [4, 13, 15, 24, 26, 35]) for (let x = 4; x <= 16; x += 3) c.set(x, y, C.steel);
    c.oval(7, 17, 12, 22, C.ironDark); // wheel
    c.oval(8, 18, 11, 21, col);
    dots(c, C.steel, [9, 19, 10, 20]);
    c.speckle(3, 26, 16, 36, C.rust, 6, 8);
    c.speckle(3, 3, 16, 12, C.rust, 14, 2);
  });
  function nail(c, x, y) {
    c.set(x, y, C.ironDark);
  }
  A['door-boarded'] = S(22, 38, (c) => {
    c.clearRect(0, 0, 21, 37);
    const d = hex('#553828');
    c.rect(2, 1, 19, 36, mix(d, 0.62));
    c.row(1, 2, 19, d);
    leaf(c, 4, 17, d, { knob: false });
    const pl = (pts, col) => {
      c.poly(pts, col);
      nail(c, pts[0][0] + 1, pts[0][1] + 1);
      nail(c, pts[1][0] - 1, pts[1][1] + 1);
    };
    pl([[1, 6], [20, 4], [20, 7], [1, 9]], WP);
    pl([[1, 14], [20, 17], [20, 20], [1, 17]], blend(WP, C.stone, 0.4));
    pl([[1, 25], [20, 23], [20, 26], [1, 28]], C.woodLight);
    pl([[2, 31], [20, 32], [20, 34], [2, 33]], WP);
    c.line(1, 8, 20, 6, D(WP));
    c.line(1, 27, 20, 25, D(C.woodLight));
  });
  A['door-broken'] = S(20, 38, (c) => {
    door(c, hex('#5a3d2c'), 'shut', { frame: WD });
    c.poly([[6, 10], [10, 7], [14, 9], [15, 15], [12, 22], [8, 24], [5, 18]], NIGHT); // smashed through
    const sp = WP;
    c.line(5, 9, 7, 12, sp);
    c.line(15, 8, 13, 11, sp);
    c.line(16, 16, 13, 16, sp);
    c.line(4, 19, 7, 18, sp);
    c.line(8, 26, 9, 22, sp);
    c.line(13, 24, 12, 21, sp);
    c.line(10, 5, 10, 8, D(hex('#5a3d2c')));
    c.line(11, 24, 12, 32, D(hex('#5a3d2c')));
    dots(c, sp, [5, 35, 6, 36, 11, 36, 14, 35, 15, 36]);
    c.clear(16, 19);
    c.set(15, 19, D(hex('#5a3d2c')));
  });
  A['door-chained'] = S(20, 38, (c) => {
    door(c, hex('#3a2a2c'), 'shut');
    const ch = (x0, y0, x1, y1) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (let i = 0; i <= n; i++) c.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, i % 2 ? C.steel : C.iron);
    };
    ch(1, 12, 18, 22);
    ch(1, 24, 18, 13);
    ch(1, 13, 18, 23);
    c.rect(8, 17, 11, 20, C.brass); // padlock
    c.row(17, 8, 11, L(C.brass));
    c.set(9, 16, C.steel);
    c.set(10, 16, C.steel);
    c.set(9, 15, C.steel);
    c.set(10, 15, C.steel);
    c.set(10, 19, K);
    dots(c, C.ironDark, [1, 12, 1, 24, 18, 22, 18, 13]);
  });
  A['door-bloody'] = S(20, 38, (c) => {
    door(c, DOORCOL.white, 'shut', { frame: hex('#8a8678') });
    const bl = C.blood;
    c.rect(8, 12, 11, 15, bl); // a handprint
    for (const x of [7, 9, 10, 12]) c.col(x, 9, 12, bl);
    c.set(8, 10, bl);
    c.set(11, 9, bl);
    c.set(6, 13, bl);
    c.set(6, 14, bl);
    c.line(10, 16, 9, 27, bl); // dragged down
    c.line(11, 16, 11, 24, D(bl));
    c.line(8, 16, 7, 21, bl);
    dots(c, bl, [9, 29, 9, 31, 13, 20, 5, 24, 12, 35, 11, 36, 13, 36]);
    c.set(15, 19, bl);
  });
  A['door-arched'] = S(24, 42, (c) => {
    const st = C.stone,
      col = hex('#5a3d2a');
    c.rect(1, 12, 22, 40, st); // stone surround
    c.oval(1, 1, 22, 24, st);
    c.oval(3, 3, 20, 26, col);
    c.rect(3, 14, 20, 40, col);
    for (let y = 10; y < 40; y += 6) {
      dots(c, D(st), [1, y, 2, y, 21, y + 3, 22, y + 3]);
    }
    dots(c, D(st), [5, 3, 18, 3, 11, 1, 12, 2, 3, 7, 20, 7]);
    for (let x = 6; x < 20; x += 3) c.col(x, 4, 40, D(col)); // planks
    c.col(3, 12, 40, L(col));
    for (const y of [12, 32]) {
      c.row(y, 3, 16, C.ironDark); // strap hinges
      c.set(17, y - 1, C.ironDark);
      c.set(17, y + 1, C.ironDark);
    }
    for (let y = 8; y < 40; y += 4) for (let x = 5; x < 20; x += 6) if (y !== 12 && y !== 32) c.set(x + ((y / 4) % 2) * 3, y, C.iron);
    c.oval(15, 21, 18, 24, C.ironDark); // ring handle
    c.set(16, 22, col);
    c.set(17, 23, col);
    c.set(16, 23, col);
    c.set(17, 22, col);
  });
  A['door-nursery'] = S(20, 38, (c) => {
    const col = hex('#b08f8c');
    door(c, col, 'shut', { frame: hex('#8f8676'), knob: C.white });
    const bare = hex('#7a5a44');
    c.poly([[5, 27], [8, 26], [9, 30], [6, 31]], bare); // paint peeling
    c.rect(12, 7, 13, 9, bare);
    c.set(14, 8, bare);
    c.rect(4, 4, 5, 5, bare);
    dots(c, C.white, [9, 31, 7, 32, 12, 10]);
    dots(c, bare, [15, 30, 14, 33, 10, 14, 3, 20]);
    for (const y of [29, 26, 24, 21, 19]) {
      c.set(17, y, K); // height marks on the frame
      c.set(18, y, K);
    }
    c.set(18, 23, C.blood);
    dots(c, C.mustard, [8, 12, 10, 11, 9, 13]); // a faded star sticker
  });
  A['trapdoor-closed'] = P(24, 10, (c) => {
    c.poly([[4, 1], [19, 1], [22, 8], [1, 8]], W);
    c.line(4, 1, 19, 1, WL);
    for (const x of [7, 11, 15]) c.line(x + (x < 11 ? 0 : 1), 1, x - (11 - x) / 2, 8, WD);
    c.row(8, 1, 22, WD);
    c.row(3, 4, 19, D(W)); // battens
    c.row(6, 3, 20, D(W));
    c.rect(10, 4, 13, 5, C.iron); // ring
    c.set(11, 5, W);
    c.set(12, 5, W);
    dots(c, C.ironDark, [3, 2, 20, 2]);
  });
  A['trapdoor-open'] = P(24, 24, (c) => {
    c.rect(4, 1, 19, 13, W); // the lid, thrown back
    c.row(1, 4, 19, WL);
    c.col(4, 1, 13, WL);
    for (const x of [8, 12, 16]) c.col(x, 2, 13, WD);
    c.row(4, 5, 18, D(W));
    c.row(10, 5, 18, D(W));
    c.rect(11, 6, 12, 7, C.iron);
    c.poly([[4, 14], [19, 14], [22, 22], [1, 22]], NIGHT); // the hole
    c.row(14, 4, 19, WD);
    c.col(8, 12, 19, WP); // ladder coming up
    c.col(14, 12, 19, WP);
    c.row(14, 9, 13, WL);
    c.row(17, 9, 13, D(WP));
    c.row(20, 9, 13, mix(WP, 0.4));
    c.col(8, 19, 21, mix(WP, 0.5));
    c.col(14, 19, 21, mix(WP, 0.5));
  });
  function cellarHatch(c, open) {
    const st = C.stone,
      col = hex('#5a5a48');
    c.rect(1, 12, 28, 14, st); // stone kerb
    c.row(12, 1, 28, L(st));
    c.poly([[5, 2], [24, 2], [27, 11], [2, 11]], open ? NIGHT : col);
    c.rect(4, 1, 25, 1, D(st));
    if (open) {
      for (let i = 0; i < 4; i++) c.row(10 - i * 2, 6 - (i >> 1) + i, 23 + (i >> 1) - i, mix(st, 0.75 - i * 0.17)); // steps going down
      c.poly([[1, 2], [4, 1], [4, 11], [1, 9]], col); // doors thrown open to either side
      c.poly([[28, 2], [25, 1], [25, 11], [28, 9]], col);
      c.col(1, 2, 9, L(col));
      c.col(28, 2, 9, D(col));
      c.clearRect(0, 10, 1, 11);
      c.clearRect(28, 10, 29, 11);
    } else {
      c.line(5, 2, 24, 2, L(col));
      c.line(14, 2, 14, 11, D(col));
      c.line(15, 2, 15, 11, mix(col, 0.5));
      for (const x of [8, 11, 18, 21]) c.line(x, 2, x + (x < 14 ? -1 : 1), 11, D(col));
      c.row(4, 5, 24, C.ironDark);
      c.row(9, 3, 26, C.ironDark);
      c.rect(12, 6, 13, 7, C.iron);
      c.rect(16, 6, 17, 7, C.iron);
      c.speckle(2, 2, 27, 11, C.moss, 12, 4);
    }
  }
  A['cellar-hatch'] = S(30, 16, (c) => cellarHatch(c, false));
  A['cellar-hatch-open'] = P(30, 16, (c) => cellarHatch(c, true));
  A['bookcase-door'] = S(26, 38, (c) => {
    bookcase(c, 2, 2, 23, 36, hex('#5f3f2c'), 1, 17);
    c.col(24, 1, 36, NIGHT); // a hairline gap down one side
    c.rect(12, 16, 13, 21, C.red); // the one book that is a lever
    c.row(17, 12, 13, C.gold);
    c.row(36, 14, 23, D(C.stone)); // a scrape on the floor
  });
  A['bookcase-door-open'] = P(36, 38, (c) => {
    c.rect(1, 1, 16, 36, C.stoneDark); // rough wall round the passage
    c.rect(3, 3, 15, 36, NIGHT);
    for (let i = 0; i < 4; i++) c.row(36 - i * 2, 4 + i, 14 - i, mix(C.stone, 0.6 - i * 0.13));
    dots(c, D(C.stoneDark), [1, 8, 2, 8, 1, 20, 2, 20, 16, 14, 16, 28, 8, 1, 9, 2]);
    cobweb(c, 3, 3, 1, 1, 6);
    bookcase(c, 19, 2, 33, 36, hex('#5f3f2c'), 1, 17); // swung aside, so seen narrower
    c.rect(17, 2, 18, 36, mix(hex('#5f3f2c'), 0.5));
    c.rect(26, 16, 27, 21, C.red);
    c.row(17, 26, 27, C.gold);
  });
  A['curtain-doorway'] = P(24, 38, (c) => {
    const dr = hex('#6e2228');
    jamb(c, WD);
    beyond(c, 3, 20);
    c.rect(2, 2, 21, 5, dr); // pelmet
    c.row(2, 2, 21, L(dr));
    for (let x = 2; x <= 21; x += 3) c.set(x + 1, 6, C.gold);
    c.poly([[3, 6], [11, 6], [9, 16], [6, 22], [7, 36], [3, 36]], dr);
    c.poly([[20, 6], [12, 6], [14, 16], [17, 22], [16, 36], [20, 36]], dr);
    for (const x of [4, 6]) c.line(x, 7, x - 1 + (x > 4 ? 0 : 0), 35, D(dr));
    for (const x of [19, 17]) c.line(x, 7, x, 35, D(dr));
    c.line(9, 7, 7, 20, L(dr));
    c.line(14, 7, 16, 20, D(dr));
    c.row(22, 3, 7, C.gold);
    c.row(22, 16, 20, C.gold);
  });
  A['bead-curtain'] = P(20, 38, (c) => {
    jamb(c, WD);
    beyond(c, 3, 16);
    const bc = [C.mustard, hex('#8a4a3a'), C.teal, C.bone, hex('#7a5a8a')];
    for (let x = 3; x <= 16; x += 2) {
      const len = 30 + ((x * 7) % 5);
      for (let y = 3; y < 3 + len; y++) c.set(x + (y > 20 && x % 4 === 1 ? ((y >> 3) & 1) : 0), y, y % 3 === 0 ? bc[(x + (y / 3) | 0) % 5] : mix(bc[(x >> 1) % 5], 0.45));
    }
  });
  A['archway-stone'] = P(28, 42, (c) => {
    const st = C.stone;
    c.rect(1, 14, 26, 40, st);
    c.oval(1, 1, 26, 28, st);
    c.oval(5, 5, 22, 30, NIGHT);
    c.rect(5, 16, 22, 40, NIGHT);
    c.row(40, 5, 22, hex('#2c2834'));
    c.row(39, 6, 22, GLOOM);
    for (let y = 16; y < 40; y += 5) {
      c.row(y, 1, 4, D(st));
      c.row(y + 2, 23, 26, D(st));
    }
    for (const [x0, y0, x1, y1] of [[4, 10, 6, 11], [7, 4, 9, 6], [13, 1, 13, 4], [18, 4, 17, 6], [22, 9, 20, 11]]) c.line(x0, y0, x1, y1, D(st));
    c.rect(12, 1, 15, 4, L(st)); // keystone
    c.col(1, 12, 40, L(st));
    c.speckle(1, 26, 4, 40, C.moss, 6, 3);
  });
  A['archway-wood'] = P(20, 38, (c) => {
    jamb(c, W);
    c.rect(3, 3, 16, 36, GLOOM);
    c.rect(3, 3, 16, 4, NIGHT);
    c.col(3, 3, 36, NIGHT);
    c.row(36, 4, 16, hex('#3a3540'));
    c.row(35, 5, 16, hex('#2c2834'));
    c.col(2, 2, 36, WD);
    c.col(17, 2, 36, WL);
    c.row(2, 2, 17, WD);
    dots(c, WD, [1, 14, 1, 26, 18, 9]);
  });
  A['garden-gate'] = S(24, 18, (c) => {
    const col = hex('#8f8a78');
    c.rect(1, 2, 2, 16, WD); // posts
    c.rect(21, 2, 22, 16, WD);
    c.set(1, 1, W);
    c.set(21, 1, W);
    for (let x = 4; x <= 18; x += 3) {
      const t = 3 + Math.abs(x - 11) / 4;
      c.rect(x, Math.round(t) + 1, x + 1, 15, col);
      c.set(x, Math.round(t), col);
      c.col(x, Math.round(t), 15, L(col));
    }
    c.row(7, 3, 20, D(col));
    c.row(13, 3, 20, D(col));
    c.line(4, 13, 19, 7, mix(col, 0.55));
    c.set(20, 9, C.iron);
    c.speckle(3, 3, 20, 15, C.moss, 14, 6);
  });
  function ironBar(c, x, y0, y1) {
    c.col(x, y0, y1, C.iron);
    c.col(x + 1, y0, y1, K);
    c.set(x, y0 - 1, C.steel); // spear point
    c.set(x, y0 - 2, C.iron);
    c.set(x + 1, y0 - 1, K);
  }
  function wroughtGate(c, open) {
    const b = c.h - 2;
    const leafOf = (x0, x1, step, flip) => {
      for (let x = x0; x <= x1; x += step) {
        const t = flip ? (x - x0) / (x1 - x0) : 1 - (x - x0) / (x1 - x0);
        ironBar(c, x, 6 - Math.round(t * 3), b);
      }
      for (const y of [9, b - 5]) {
        c.row(y, x0, x1 + 1, C.iron);
        c.row(y + 1, x0, x1 + 1, K);
      }
    };
    if (open) {
      leafOf(1, 7, 2, false);
      leafOf(26, 32, 2, true);
    } else {
      leafOf(1, 13, 4, false);
      leafOf(18, 30, 4, true);
      c.rect(15, 2, 16, b, C.iron); // meeting stiles
      c.col(17, 2, b, K);
      c.col(14, 3, b, K);
      c.set(15, 1, C.steel);
      // scrollwork
      dots(c, C.iron, [3, 12, 4, 13, 7, 12, 8, 13, 11, 12, 12, 13, 20, 12, 21, 13, 24, 12, 25, 13, 28, 12, 29, 13]);
      c.rect(14, 20, 17, 23, C.ironDark); // lock box
      c.frame(14, 20, 17, 23, K);
      c.set(16, 22, C.rust);
    }
    c.speckle(0, 0, c.w - 1, b, C.rust, 12, 5);
  }
  A['gate-wrought'] = S(34, 42, (c) => wroughtGate(c, false), { outline: false, shade: false });
  A['gate-wrought-open'] = P(36, 42, (c) => wroughtGate(c, true), { outline: false, shade: false });

  /* ---------- windows (flat on the wall) ---------- */
  function win(c, glass, o = {}) {
    const fr = o.frame || hex('#8a8474');
    c.rect(1, 1, 18, 19, fr);
    c.row(1, 1, 18, L(fr));
    c.col(1, 1, 19, L(fr));
    c.rect(1, 19, 18, 20, L(fr)); // sill
    c.row(20, 1, 18, D(fr));
    for (const [x, y] of [[3, 3], [11, 3], [3, 11], [11, 11]]) {
      c.rect(x, y, x + 5, y + 6, glass);
      if (o.cb) o.cb(x, y);
    }
  }
  A['window-frame-lit'] = P(20, 22, (c) =>
    win(c, hex('#c9a04a'), {
      cb(x, y) {
        c.rect(x, y, x + 5, y + 1, hex('#d9bc66'));
        c.set(x + 1, y + 2, C.flameLight);
      },
    }));
  const NIGHTGLASS = hex('#1f2638');
  const nightPane = (c) => (x, y) => {
    c.line(x + 1, y + 3, x + 3, y + 1, hex('#3a4660'));
  };
  A['window-frame-dark'] = P(20, 22, (c) => win(c, NIGHTGLASS, { cb: nightPane(c) }));
  A['window-frame-broken'] = P(20, 22, (c) => {
    win(c, NIGHTGLASS, { cb: nightPane(c) });
    c.poly([[4, 5], [8, 3], [8, 9], [5, 8]], K); // holes
    c.poly([[11, 12], [16, 11], [15, 17], [12, 15]], K);
    c.line(8, 9, 11, 12, hex('#3a4660'));
    c.line(11, 5, 14, 8, C.glass);
    c.line(14, 8, 16, 6, C.glass);
    c.line(4, 12, 7, 15, C.glass);
    dots(c, C.glassLight, [4, 4, 8, 4, 13, 11, 16, 12, 7, 20, 10, 19, 13, 20, 14, 19]);
    c.clearRect(9, 9, 10, 10); // the glazing bar snapped
    c.rect(9, 9, 10, 10, K);
  });
  A['window-frame-face'] = P(20, 22, (c) => {
    win(c, NIGHTGLASS, { cb: nightPane(c) });
    const g = hex('#9eaaa4');
    c.oval(5, 5, 14, 16, g); // a pale face pressed to the glass
    c.rect(6, 15, 13, 17, mix(g, 0.6));
    dots(c, K, [7, 9, 8, 9, 11, 9, 12, 9, 9, 13, 10, 13, 9, 14, 10, 14]);
    dots(c, mix(g, 0.6), [7, 10, 12, 10, 9, 11]);
    c.col(9, 3, 17, hex('#8a8474')); // the bars in front
    c.col(10, 3, 17, hex('#8a8474'));
    c.row(10, 3, 16, hex('#8a8474'));
    c.set(4, 16, g); // fingertips
    c.set(5, 17, g);
    c.set(15, 16, g);
  });
  A['window-frame-shutters'] = P(22, 22, (c) => {
    const g = hex('#48604c');
    c.rect(1, 1, 20, 19, hex('#8a8474'));
    c.rect(1, 19, 20, 20, L(hex('#8a8474')));
    for (const x0 of [2, 11]) {
      c.rect(x0, 2, x0 + 8, 18, g);
      for (let y = 3; y < 18; y += 2) c.row(y, x0 + 1, x0 + 7, D(g));
      c.col(x0, 2, 18, L(g));
      c.row(10, x0, x0 + 8, g);
    }
    c.col(10, 2, 18, mix(g, 0.4));
    dots(c, C.ironDark, [9, 10, 12, 10]);
    c.speckle(2, 2, 19, 18, hex('#8a8474'), 18, 3);
  });
  A['window-frame-curtains'] = P(20, 22, (c) => {
    const dr = hex('#5c4a5a');
    win(c, dr);
    c.rect(3, 3, 16, 17, dr);
    for (let x = 4; x <= 16; x += 2) c.col(x, 3, 17, x % 4 ? D(dr) : L(dr));
    c.col(9, 3, 17, hex('#8a8474'));
    c.col(10, 3, 17, hex('#8a8474'));
    c.row(10, 3, 16, hex('#8a8474'));
    c.set(8, 12, hex('#c9a04a')); // a chink of light
    c.set(8, 13, hex('#c9a04a'));
  });

  /* ---------- stairs ---------- */
  function sideStairs(c, n, o = {}) {
    const b = c.h - 2,
      col = o.col || W;
    for (let i = 0; i < n; i++) {
      const x = 2 + i * 4,
        y = b - 4 * (i + 1) + 1;
      c.rect(x, y, 2 + n * 4 - 1, b, col);
    }
    for (let i = 0; i < n; i++) {
      const x = 2 + i * 4,
        y = b - 4 * (i + 1) + 1;
      c.row(y, x - 1, x + 3, L(WL)); // tread with its nosing
      c.col(x, y + 1, y + 3, D(col));
      if (o.runner) c.row(y, x, x + 3, o.runner);
    }
    // panelled side below the string
    c.line(4, b - 1, 2 + n * 4 - 3, b - 4 * n + 6, D(col));
    for (let i = 2; i < n; i += 2) c.col(2 + i * 4 + 1, b - 4 * i + 6, b, D(col));
    c.row(b, 2, 2 + n * 4 - 1, D(col));
    return 2 + n * 4 - 1;
  }
  A['staircase-up'] = S(36, 44, (c) => {
    const b = 42,
      xe = sideStairs(c, 8);
    c.rect(1, b - 16, 2, b, WD); // newel
    c.set(1, b - 17, W);
    c.set(2, b - 17, W);
    c.rect(xe - 1, 1, xe, 12, WD);
    c.line(2, b - 14, xe - 1, 3, WL); // handrail
    c.line(2, b - 13, xe - 1, 4, W);
    for (let i = 1; i < 8; i++) c.col(2 + i * 4 + 1, b - 4 * i - 12 + 1, b - 4 * (i + 1), WD);
  });
  A['staircase-down'] = P(26, 38, (c) => {
    const st = C.stoneDark;
    jamb(c, st);
    for (let y = 6; y < 36; y += 6) dots(c, D(st), [1, y, 2, y, 23, y + 3, 22, y + 3]);
    c.rect(3, 3, 22, 36, NIGHT);
    for (let i = 0; i < 7; i++) {
      const y = 36 - i * 3,
        k = 0.8 - i * 0.11;
      c.rect(3 + i, y - 1, 22 - i, y, mix(C.stone, k * 0.6)); // each step lower and darker
      c.row(y - 2, 3 + i, 22 - i, mix(C.stone, k));
    }
    c.line(3, 22, 9, 16, mix(WD, 0.8)); // handrails sinking into the dark
    c.line(22, 22, 16, 16, mix(WD, 0.6));
    c.col(3, 22, 34, mix(WD, 0.8));
    c.col(22, 22, 34, mix(WD, 0.6));
  });
  A['staircase-carpet'] = S(48, 46, (c) => {
    const b = 44,
      red = hex('#7a2228');
    for (let i = 0; i < 10; i++) {
      const y = b - i * 3,
        x0 = 6 + i,
        x1 = 41 - i;
      c.rect(x0, y - 1, x1, y, mix(W, 1 - i * 0.03)); // riser
      c.row(y - 2, x0 - 1, x1 + 1, WL); // tread
      c.rect(x0 + 8, y - 1, x1 - 8, y, mix(red, 1 - i * 0.03));
      c.row(y - 2, x0 + 8, x1 - 8, L(red));
      c.set(x0 + 8, y, C.gold); // stair rods
      c.set(x1 - 8, y, C.gold);
    }
    c.rect(15, 9, 32, 14, NIGHT); // the landing above, in shadow
    c.rect(15, 13, 32, 14, hex('#2c2834'));
    for (const [x, s] of [[2, 1], [43, -1]]) {
      c.rect(x, b - 18, x + 2, b, WD); // newel posts
      c.col(x, b - 18, b, W);
      c.oval(x - 1 + (s < 0 ? 0 : 0), b - 22, x + 3, b - 18, W);
      c.set(x + 1, b - 21, WL);
    }
    c.line(4, b - 16, 14, 6, W); // rails running up and in
    c.line(4, b - 15, 14, 7, WD);
    c.line(43, b - 16, 33, 6, W);
    c.line(43, b - 15, 33, 7, WD);
    for (let i = 1; i < 9; i++) {
      c.col(4 + i, b - 15 - i * 2.2 + 2, b - i * 3 - 2, WD);
      c.col(43 - i, b - 15 - i * 2.2 + 2, b - i * 3 - 2, WD);
    }
    c.rect(13, 4, 15, 14, WD);
    c.rect(32, 4, 34, 14, WD);
  });
  function ladder(c, x0, x1, t, b, col, skip = []) {
    c.col(x0, t, b, col);
    c.col(x1, t, b, D(col));
    let i = 0;
    for (let y = b - 3; y > t + 1; y -= 5, i++) if (!skip.includes(i)) c.row(y, x0 + 1, x1 - 1, L(col));
  }
  A['ladder-wood'] = P(12, 44, (c) => ladder(c, 2, 9, 1, 42, hex('#8a6a48')));
  A['ladder-broken'] = P(14, 44, (c) => {
    const col = hex('#7a5c40');
    ladder(c, 2, 9, 1, 42, col, [2, 5, 6]);
    c.clearRect(9, 1, 9, 17); // one rail snapped off
    c.clearRect(3, 9, 9, 9);
    dots(c, WP, [9, 18, 10, 17, 8, 17]);
    c.line(3, 29, 6, 31, L(col)); // a rung hanging by one end
    c.line(9, 12, 12, 16, D(col));
    c.clearRect(9, 12, 9, 12);
    c.rect(10, 41, 12, 42, col); // bits on the floor
    c.set(12, 40, WP);
    c.row(9, 3, 5, L(col));
  });
  A['spiral-stairs'] = S(30, 54, (c) => {
    const b = 52,
      ir = C.iron;
    const pts = [];
    for (let i = 0; i < 13; i++) {
      const a = (i * Math.PI) / 4,
        ex = 14 + Math.round(Math.sin(a) * 12),
        y = b - 1 - i * 4,
        front = Math.cos(a) >= -0.01;
      pts.push([ex, y, front]);
    }
    for (const [ex, y, front] of pts) if (!front) {
      c.rect(Math.min(14, ex), y, Math.max(15, ex), y + 1, C.ironDark);
    }
    c.rect(14, 1, 15, b, ir); // the newel
    c.col(14, 1, b, C.steel);
    for (const [ex, y, front] of pts) if (front) {
      c.rect(Math.min(14, ex), y, Math.max(15, ex), y + 1, ir);
      c.row(y, Math.min(14, ex), Math.max(15, ex), C.steel);
      if (Math.abs(ex - 14) > 6) c.col(ex, y - 10, y, C.ironDark); // baluster
    }
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0, f0] = pts[i],
        [x1, y1] = pts[i + 1];
      if (f0 || pts[i + 1][2]) c.line(x0, y0 - 10, x1, y1 - 10, f0 ? C.steel : C.ironDark); // handrail
    }
    c.rect(11, b, 18, b, C.ironDark);
    c.speckle(1, 1, 28, 52, C.rust, 14, 4);
  });
  function banister(c, x0, x1, gap) {
    const col = W;
    for (let x = x0 + 2; x < x1 - 1; x += 4) {
      if (gap && x > gap[0] && x < gap[1]) continue;
      c.rect(x, 4, x + 1, 13, col);
      c.col(x, 4, 13, WL);
      c.set(x, 8, WD);
      c.set(x + 1, 8, WD);
    }
    const seg = (a, e) => {
      c.rect(a, 2, e, 3, WL);
      c.row(2, a, e, L(WL));
      c.rect(a, 14, e, 15, WD);
      c.row(14, a, e, W);
    };
    if (gap) {
      seg(x0, gap[0]);
      seg(gap[1], x1);
    } else seg(x0, x1);
  }
  A['banister'] = S(34, 18, (c) => banister(c, 1, 32));
  A['banister-broken'] = S(34, 18, (c) => {
    banister(c, 1, 32, [12, 22]);
    c.rect(11, 14, 23, 15, WD);
    c.row(14, 11, 23, W);
    dots(c, WP, [13, 2, 13, 3, 21, 3, 14, 2]);
    c.line(13, 4, 15, 7, WL); // the rail hanging down
    c.rect(15, 11, 16, 13, W); // stumps
    c.set(15, 10, WP);
    c.rect(19, 9, 20, 13, W);
    c.set(20, 8, WP);
    c.line(22, 4, 24, 3, WL);
  });
  A['banister-post'] = S(9, 22, (c) => {
    c.oval(2, 1, 6, 5, WL);
    c.set(3, 2, L(WL));
    c.rect(3, 6, 5, 6, WD);
    c.rect(2, 7, 6, 8, W);
    c.rect(3, 9, 5, 17, W);
    c.col(3, 9, 17, WL);
    panel(c, 4, 10, 4, 15, W);
    c.rect(2, 18, 6, 20, W);
    c.row(18, 2, 6, WL);
    c.row(20, 2, 6, WD);
  });
  A['stairs-attic'] = S(20, 44, (c) => {
    c.rect(1, 1, 18, 7, WD); // the hatch in the ceiling
    c.rect(3, 2, 16, 6, NIGHT);
    c.row(1, 1, 18, W);
    const col = hex('#8a6a48');
    c.line(5, 4, 3, 42, col); // steep, with flat treads
    c.line(6, 4, 4, 42, D(col));
    c.line(13, 4, 15, 42, col);
    c.line(14, 4, 16, 42, D(col));
    for (let y = 9, i = 0; y < 42; y += 4, i++) {
      const x0 = Math.round(5 - (y - 4) / 19) + 1,
        x1 = Math.round(13 + (y - 4) / 19) - 1;
      c.row(y, x0, x1, L(col));
      c.row(y + 1, x0, x1, mix(col, 0.5));
    }
    c.col(17, 7, 16, C.ash); // pull cord
    c.set(17, 17, C.brass);
  });
  A['dumbwaiter'] = S(18, 22, (c) => {
    c.rect(1, 1, 16, 20, W);
    c.row(1, 1, 16, WL);
    c.col(1, 1, 20, WL);
    c.rect(3, 3, 14, 18, NIGHT);
    c.col(7, 3, 9, C.ash); // ropes
    c.col(10, 3, 9, D(C.ash));
    c.rect(3, 3, 14, 6, hex('#5a4a3a')); // sash door half raised
    c.row(6, 3, 14, WD);
    c.row(4, 5, 12, D(hex('#5a4a3a')));
    c.rect(4, 10, 13, 18, hex('#3a2c24')); // the car
    c.row(10, 4, 13, hex('#5a4030'));
    c.row(14, 4, 13, hex('#5a4030'));
    c.rect(6, 12, 8, 13, C.steel); // a covered dish
    c.set(7, 11, C.steel);
    c.rect(1, 19, 16, 20, WL);
    c.row(20, 1, 16, WD);
    c.set(15, 10, C.brass);
  });
  A['fire-escape'] = S(34, 62, (c) => {
    const ir = C.iron,
      lt = C.steel;
    const landing = (y, x0, x1) => {
      c.rect(x0, y, x1, y + 1, ir);
      c.row(y, x0, x1, lt);
      c.row(y - 7, x0, x1, ir); // rail
      for (let x = x0; x <= x1; x += 4) c.col(x, y - 7, y, C.ironDark);
    };
    const flight = (x0, y0, x1, y1) => {
      c.line(x0, y0, x1, y1, ir);
      c.line(x0, y0 + 1, x1, y1 + 1, C.ironDark);
      c.line(x0, y0 - 7, x1, y1 - 7, ir);
      const n = Math.abs(x1 - x0);
      for (let i = 2; i < n; i += 3) {
        const x = x0 + Math.sign(x1 - x0) * i,
          y = Math.round(y0 + ((y1 - y0) * i) / n);
        c.row(y, x - 1, x + 1, lt); // treads
      }
    };
    landing(9, 1, 32);
    landing(27, 1, 32);
    landing(45, 1, 32);
    flight(6, 27, 26, 10);
    flight(26, 45, 6, 28);
    for (const x of [1, 32]) c.col(x, 2, 46, C.ironDark);
    ladder(c, 12, 18, 47, 60, ir); // the drop ladder
    c.speckle(1, 1, 32, 60, C.rust, 7, 9);
  });

  /* the plainer names of the same pieces of furniture */
  A['sofa'] = S(36, 20, (c) => sofa(c, hex('#6f6250')));
  A['sofa-blue'] = S(36, 20, (c) => sofa(c, hex('#39486a')));
  A['armchair'] = S(18, 20, (c) => sofa(c, hex('#6a3a3a')));
  A['coffee-table'] = S(26, 11, (c) => table(c, 1, 24, 1, 9, W));
  A['dining-table'] = S(42, 17, (c) => table(c, 1, 40, 2, 15, WL, { mid: true }));
  A['dresser'] = S(22, 23, (c) => chestOfDrawers(c, WL));
  A['step-ladder'] = P(12, 30, (c) => ladder(c, 2, 9, 1, 28, hex('#8a6a48')));
  A['stepladder-old'] = P(12, 30, (c) => ladder(c, 2, 9, 1, 28, hex('#6a5038'), [3]));
  A['rocking-chair'] = P(14, 22, (c) => {
    chair(c, 3, 18, { col: W });
    c.row(19, 1, 12, WD);
    c.set(0, 18, WD);
    c.set(13, 18, WD);
  });
  for (const [to, from] of [
    ['fireplace', 'fireplace-embers'],
    ['wardrobe', 'wardrobe-old'],
    ['crib', 'crib-old'],
    ['double-bed', 'bed-double-old'],
    ['front-door', 'door-red'],
    ['house-window', 'window-frame-lit'],
    ['window-curtains', 'window-frame-curtains'],
    ['coat-rack', 'coat-stand'],
    ['floor-lamp', 'standing-lamp-old'],
    ['table-lamp', 'reading-lamp'],
  ])
    A[to] = A[from];

  /* ====================== THE OTHER PICTURES ======================
   * Every thing has four pictures: the main one above, the other perspective (`side`), and both after someone
   * used the thing (`used`, `sideUsed`). In a side view the front of the thing faces right. Things drawn from
   * their long side above (beds, chairs, the grand piano) say base: 'side'; their `side` is then the front view. */
  const V = (slug, views) => {
    if (!A[slug]) throw new Error('views for ' + slug + ', which is not drawn here');
    A[slug].views = views;
  };
  const view = (w, h, draw, o = {}) => ({ w, h, draw, ...o });
  /** The main picture of a thing as its draw() leaves it (not yet shaded or outlined), to stamp into a view. */
  const raw = (slug) => {
    const t = canvas(A[slug].w, A[slug].h);
    A[slug].draw(t);
    return t;
  };
  /** A view that is the main picture with something drawn over it; w, h, dx, dy if the canvas has to grow. */
  const over = (slug, draw, o = {}) => ({
    w: o.w || A[slug].w,
    h: o.h || A[slug].h,
    draw(c) {
      c.stamp(raw(slug), o.dx || 0, o.dy == null ? c.h - A[slug].h : o.dy);
      if (draw) draw(c);
    },
  });
  /** A picture w x h fallen over: its top goes to the left (or to the right). */
  const turned = (w, h, draw, right = false) => ({
    w: h,
    h: w,
    draw(c) {
      const t = canvas(w, h);
      draw(t);
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const p = t.get(x, y);
          if (p) right ? c.set(h - 1 - y, x, p) : c.set(y, w - 1 - x, p);
        }
    },
  });
  /** The same picture seen from the other side: left and right swapped. */
  const flipped = (w, h, draw) => ({
    w,
    h,
    draw(c) {
      const t = canvas(w, h);
      draw(t);
      c.stamp(t, 0, 0, true);
    },
  });

  /* ---------- beds: the front view is seen from the foot end and a little from above ---------- */
  /** Head end and mattress of a bed running away from the viewer. Lay the bedding on the returned g
   *  (x0..x1 across, sy the far end of the mattress, ey its near edge), then call g.foot() for the foot end. */
  function bedFront(c, o = {}) {
    const b = c.h - 2,
      x0 = 1,
      x1 = o.x1 || c.w - 2,
      fc = o.frame || W,
      mh = 8 + (o.thick || 0), // the top of the mattress above the floor
      ht = o.top || 2, // the top of the headboard
      sy = ht + o.head - mh,
      ey = b - mh,
      tick = o.tick || C.cream,
      nb = Math.round((x1 - x0) / 4),
      bars = [];
    for (let i = 1; i < nb; i++) bars.push(x0 + Math.round((i * (x1 - x0)) / nb)); // far enough apart to see between them
    if (o.iron) {
      c.col(x0, ht, sy, fc);
      c.col(x1, ht, sy, fc);
      c.row(ht + 1, x0, x1, fc);
      c.row(ht + 5, x0, x1, D(fc));
      for (const x of bars) c.col(x, ht + 2, sy, D(fc));
      c.set(x0, ht - 1, C.brass);
      c.set(x1, ht - 1, C.brass);
    } else {
      c.rect(x0, ht, x1, sy, fc);
      c.row(ht, x0, x1, L(fc));
      c.col(x0, ht, sy, L(fc));
      if (sy - ht > 6) panel(c, x0 + 2, ht + 2, x1 - 2, sy - 2, fc);
      c.set(x0, ht - 1, fc);
      c.set(x1, ht - 1, fc);
    }
    c.rect(x0 + 1, sy, x1 - 1, ey, tick);
    c.row(sy, x0 + 1, x1 - 1, D(tick));
    c.rect(x0 + 1, ey + 1, x1 - 1, ey + mh - 4, D(tick)); // the near end of the mattress
    c.row(ey + 1, x0 + 1, x1 - 1, tick);
    return {
      x0: x0 + 1,
      x1: x1 - 1,
      sy,
      ey,
      b,
      tick,
      foot() {
        const fb = b - o.foot + 1;
        if (o.iron) {
          const rail = b - (o.rail || 4);
          c.col(x0, fb, b, fc);
          c.col(x1, fb, b, fc);
          c.set(x0, fb - 1, C.brass);
          c.set(x1, fb - 1, C.brass);
          c.row(fb + 1, x0, x1, fc);
          c.row(rail, x0, x1, fc);
          for (const x of bars) c.col(x, fb + 2, rail - 1, D(fc));
        } else {
          c.rect(x0, fb, x1, b - 2, fc);
          c.row(fb, x0, x1, L(fc));
          c.col(x0, fb, b - 2, L(fc));
          if (b - 2 - fb > 5) panel(c, x0 + 2, fb + 2, x1 - 2, b - 4, fc);
          c.row(b - 2, x0, x1, D(fc));
          legs(c, [x0, x1 - 1], b - 1, b, D(fc));
          c.set(x0, fb - 1, fc);
          c.set(x1, fb - 1, fc);
        }
      },
    };
  }
  function pillowFront(c, g, x0, x1, col = C.white, dy = 0) {
    const y0 = g.sy + 1 + dy,
      y1 = g.sy + 4 + dy;
    c.rect(x0, y0, x1, y1, col);
    c.set(x0, y0, g.tick);
    c.set(x1, y0, g.tick);
    c.row(y1, x0, x1, D(col));
    c.set(x0, y1, g.tick);
    c.set(x1, y1, g.tick);
  }
  /** The blanket from `from` rows below the far end down over the foot end; sheet = the turned-down sheet. */
  function coverFront(c, g, col, o = {}) {
    const by = g.sy + (o.from || 8);
    c.rect(g.x0, by, g.x1, g.ey, col);
    c.row(by, g.x0, g.x1, L(col));
    c.rect(g.x0, g.ey + 1, g.x1, g.ey + 3, D(col)); // hanging over the foot end
    if (o.sheet !== false) c.rect(g.x0, by - 2, g.x1, by - 1, o.sheet || g.tick);
    if (o.sheet !== false) c.row(by - 2, g.x0, g.x1, L(o.sheet || g.tick));
    return by;
  }
  /** ... thrown back: a corner of the blanket folded over, the bare sheet under it. */
  function coverBack(c, g, col, by) {
    const ax = g.x1 - 3,
      k = Math.min(ax - g.x0 - 2, g.ey - by - 2);
    c.poly([[g.x0, by - 2], [ax, by - 2], [g.x0, by + k]], g.tick);
    dots(c, D(g.tick), [g.x0 + 2, by, g.x0 + 3, by + 2, g.x0 + 5, by - 1, g.x0 + 1, by + 4, g.x0 + 6, by + 1]);
    c.poly([[ax, by - 1], [g.x0 + 1, by + k], [ax, by + k]], L(col)); // the blanket's underside
    c.line(ax, by - 2, g.x0, by + k, D(col));
    c.line(ax, by, ax, by + k, D(col));
    c.row(by + k, g.x0 + 1, ax, D(col));
  }
  /** In the side view: the blanket lying from xa to xb on a mattress whose top is my, thrown back in a heap. */
  function coverBackSide(c, xa, xb, my, col, o = {}) {
    const yb = my + (o.deep || 3),
      xm = xa + Math.round((xb - xa) * 0.42),
      tick = o.tick || C.cream;
    c.clearRect(xa, my - 1, xb, my - 1);
    mattress(c, xa, xm, my, yb, tick);
    dots(c, D(tick), [xa + 2, my + 1, xa + 3, my + 2, xa + 6, my + 1, xm - 2, my + 2]);
    c.poly([[xm, my - 1], [xm + 2, my - 3], [xm + 7, my - 3], [xb, my - 1], [xb, yb], [xm - 1, yb]], col);
    c.line(xm, my - 1, xm + 2, my - 3, L(col));
    c.row(my - 3, xm + 2, xm + 7, L(col));
    c.line(xm + 7, my - 3, xb, my - 1, L(col));
    c.line(xm + 3, my - 1, xm + 1, yb, D(col));
    c.line(xm + 8, my - 1, xm + 10, yb - 1, D(col));
    if (o.stripe) c.row(yb - 1, xm + 3, xb, o.stripe);
  }
  const dent = (c, x, y, col = C.white) => dots(c, D(col), [x, y, x + 1, y, x + 2, y + 1]);

  const BLANKET = hex('#5c5a48'),
    STRIPE = hex('#7a3a34');
  {
    // the old single bed: iron ends
    const front = (used) => (c) => {
      const g = bedFront(c, { iron: true, frame: C.iron, head: 16, foot: 11 });
      pillowFront(c, g, g.x0 + 2, g.x1 - 2);
      const by = coverFront(c, g, BLANKET);
      c.row(g.ey - 2, g.x0, g.x1, STRIPE);
      c.row(g.ey - 3, g.x0, g.x1, D(BLANKET));
      c.row(g.ey + 2, g.x0, g.x1, mix(STRIPE, 0.7));
      if (used) {
        coverBack(c, g, BLANKET, by);
        dent(c, g.x0 + 5, g.sy + 2);
      }
      g.foot();
    };
    V('bed-single-old', {
      base: 'side',
      side: view(20, 37, front(false)),
      used: view(38, 20, (c) => {
        const my = ironBed(c, { head: 16, foot: 11 });
        pillow(c, 5, my - 2, 10, my);
        dent(c, 7, my - 1);
        coverBackSide(c, 12, 33, my, BLANKET, { stripe: STRIPE });
      }),
      sideUsed: view(20, 37, front(true)),
    });
  }
  {
    // the hospital bed
    const ic = hex('#8d8f8a'),
      bl = hex('#9aa39a'),
      st = hex('#7d8880');
    const front = (used) => (c) => {
      const g = bedFront(c, { iron: true, frame: ic, head: 19, foot: 15, thick: 2, tick: C.white, rail: 6 });
      pillowFront(c, g, g.x0 + 2, g.x1 - 2, C.cream);
      const by = coverFront(c, g, bl, { sheet: C.cream });
      c.row(by + 3, g.x0, g.x1, st);
      c.row(g.ey - 2, g.x0, g.x1, st);
      if (used) {
        coverBack(c, g, bl, by);
        dent(c, g.x0 + 5, g.sy + 2, C.cream);
      }
      g.foot();
      c.rect(9, g.b - 5, 11, g.b - 4, hex('#6f706c')); // crank
      dots(c, K, [1, g.b, c.w - 2, g.b]);
    };
    V('bed-iron', {
      base: 'side',
      side: view(20, 40, front(false)),
      used: over('bed-iron', (c) => {
        c.clearRect(11, 8, 33, 9);
        mattress(c, 3, 33, 10, 13, C.white);
        pillow(c, 5, 8, 10, 10);
        dent(c, 7, 9);
        dots(c, D(C.white), [13, 11, 15, 12, 18, 11]);
        c.poly([[21, 10], [23, 7], [29, 7], [33, 9], [33, 13], [20, 13]], bl);
        c.line(21, 10, 23, 7, L(bl));
        c.row(7, 23, 29, L(bl));
        c.line(24, 9, 22, 13, st);
        c.line(29, 9, 31, 12, st);
      }),
      sideUsed: view(20, 40, front(true)),
    });
  }
  {
    // the old double bed with its patchwork quilt
    const q = [C.wine, C.mustard, C.forest, C.navy, hex('#8a5560')];
    const front = (used) => (c) => {
      const g = bedFront(c, { head: 21, foot: 12, thick: 1 });
      c.rect(1, 2, c.w - 2, 6, WL); // the heavy top of the headboard
      c.row(2, 1, c.w - 2, L(WL));
      c.row(6, 1, c.w - 2, D(W));
      pillowFront(c, g, g.x0 + 2, g.x0 + 12);
      pillowFront(c, g, g.x1 - 12, g.x1 - 2, C.bone);
      const by = g.sy + 8;
      c.rect(g.x0, by - 2, g.x1, by - 1, C.cream);
      for (let x = g.x0; x <= g.x1; x += 3)
        for (let y = by; y <= g.ey; y += 3) c.rect(x, y, Math.min(g.x1, x + 2), Math.min(g.ey, y + 2), q[(((x - g.x0) / 3) * 2 + (y - by) / 3) % 5]);
      c.row(by, g.x0, g.x1, L(C.cream));
      if (used) {
        coverBack(c, g, C.wine, by);
        dent(c, g.x0 + 5, g.sy + 2);
      }
      g.foot();
    };
    V('bed-double-old', {
      base: 'side',
      side: view(32, 41, front(false)),
      used: over('bed-double-old', (c) => {
        const my = 15;
        c.clearRect(14, my - 1, 36, my - 1);
        mattress(c, 4, 37, my, 19);
        pillow(c, 5, my - 3, 11, my);
        pillow(c, 7, my - 4, 12, my - 2, C.bone);
        dent(c, 8, my - 3, C.bone);
        dots(c, D(C.cream), [15, my + 1, 17, my + 2, 20, my + 1, 22, my + 3]);
        c.poly([[24, my - 1], [26, my - 4], [32, my - 4], [37, my - 2], [37, my + 4], [23, my + 4]], C.wine); // the quilt in a heap, lining upwards
        for (let x = 26; x <= 36; x += 3) c.rect(x, my + 1, Math.min(37, x + 2), my + 3, q[((x - 26) / 3) % 5]);
        c.line(24, my - 1, 26, my - 4, L(C.wine));
        c.row(my - 4, 26, 32, L(C.wine));
        c.row(my + 4, 23, 37, D(C.wine));
      }),
      sideUsed: view(32, 41, front(true)),
    });
  }
  {
    // the unmade bed; used, it has been made
    const front = (made) => (c) => {
      const g = bedFront(c, { head: 17, foot: 10, x1: 18 });
      if (made) {
        pillowFront(c, g, g.x0 + 2, g.x1 - 2);
        coverFront(c, g, C.wine);
      } else {
        pillowFront(c, g, g.x0 + 1, g.x1 - 4, C.white, 1);
        c.set(g.x1 - 3, g.sy + 2, C.white);
        dots(c, D(C.cream), [g.x0 + 3, g.sy + 7, g.x0 + 5, g.sy + 8, g.x1 - 3, g.sy + 6, g.x0 + 8, g.sy + 7]);
        const t = g.sy + 9;
        c.poly([[g.x0 + 2, t + 1], [g.x0 + 8, t - 1], [g.x1, t + 2], [g.x1, g.ey], [g.x0, g.ey], [g.x0, t + 4]], C.wine); // the blanket in a heap
        c.line(g.x0 + 2, t + 1, g.x0 + 8, t - 1, L(C.wine));
        c.line(g.x0 + 8, t - 1, g.x1, t + 2, L(C.wine));
        c.line(g.x0 + 5, t + 2, g.x0 + 3, g.ey - 1, D(C.wine));
        c.line(g.x0 + 10, t + 2, g.x0 + 12, g.ey - 2, D(C.wine));
        c.poly([[g.x1, t + 3], [g.x1 + 4, t + 6], [g.x1 + 4, g.b], [g.x1 + 2, g.b], [g.x1, g.ey]], C.wine); // and trailing to the floor
        c.col(g.x1 + 2, t + 6, g.b, D(C.wine));
      }
      g.foot();
    };
    V('bed-unmade', {
      base: 'side',
      side: view(24, 37, front(false)),
      used: view(38, 22, (c) => {
        const my = woodBed(c, { head: 17, foot: 10 });
        pillow(c, 5, my - 2, 10, my);
        blanket(c, 13, 33, my - 1, my + 3, C.wine);
        c.rect(13, my - 1, 15, my + 3, C.cream);
      }),
      sideUsed: view(24, 37, front(true)),
    });
  }
  {
    const fc = hex('#8a8272');
    const front = (used) => (c) => {
      const g = bedFront(c, { head: 13, foot: 9, frame: fc });
      pillowFront(c, g, g.x0 + 2, g.x1 - 2);
      c.clearRect(0, 0, 0, 0);
      const by = coverFront(c, g, C.navy, { from: 7 });
      dots(c, C.glow, [g.x0 + 2, by + 2, g.x0 + 7, by + 1, g.x0 + 10, by + 4, g.x0 + 4, by + 5, g.x0 + 8, by + 7, g.x0 + 1, by + 8]);
      if (used) {
        coverBack(c, g, C.navy, by);
        dent(c, g.x0 + 4, g.sy + 2);
      }
      g.foot();
    };
    V('bed-child', {
      base: 'side',
      side: view(16, 31, front(false)),
      used: view(28, 17, (c) => {
        const my = woodBed(c, { head: 13, foot: 9, frame: fc });
        pillow(c, 5, my - 2, 9, my);
        dent(c, 6, my - 1);
        coverBackSide(c, 10, 23, my, C.navy);
        dots(c, C.glow, [19, my, 21, my + 1, 17, my + 2]);
      }),
      sideUsed: view(16, 31, front(true)),
    });
  }
  {
    // the four-poster
    const dr = hex('#5a2430'),
      cov = hex('#6a5030');
    const front = (used) => (c) => {
      const b = c.h - 2,
        w = c.w,
        sy = b - 11 - 14,
        ey = b - 11,
        g = { x0: 3, x1: w - 4, sy, ey, b, tick: C.cream };
      c.rect(3, 5, w - 4, sy, mix(dr, 0.42)); // the cloth behind the head, in the shadow of the tester
      for (let x = 6; x < w - 4; x += 4) c.col(x, 5, sy, mix(dr, 0.33));
      c.rect(5, sy - 11, w - 6, sy, W); // headboard
      c.row(sy - 11, 5, w - 6, WL);
      panel(c, 7, sy - 9, w - 8, sy - 2, W);
      c.rect(3, sy, w - 4, ey, C.cream);
      c.row(sy, 3, w - 4, D(C.cream));
      pillowFront(c, g, 6, 15);
      pillowFront(c, g, w - 16, w - 7, C.bone);
      const by = coverFront(c, g, cov, { from: 7 });
      c.rect(3, ey + 1, w - 4, ey + 4, D(cov));
      c.row(ey + 2, 3, w - 4, C.gold);
      c.row(by + 2, 3, w - 4, C.gold);
      if (used) {
        coverBack(c, g, cov, by);
        dent(c, 9, sy + 2);
      }
      c.rect(3, b - 6, w - 4, b - 4, WD);
      c.row(b - 6, 3, w - 4, W);
      c.rect(3, b - 3, w - 4, b - 2, dr); // valance
      for (let x = 4; x < w - 4; x += 3) c.col(x, b - 3, b - 2, D(dr));
      c.rect(1, 1, w - 2, 4, dr); // tester
      c.row(1, 1, w - 2, L(dr));
      for (let x = 1; x <= w - 4; x += 4) {
        c.rect(x, 5, x + 2, 6, dr);
        c.set(x + 1, 7, C.gold);
      }
      c.rect(1, 5, 2, b, WD); // posts
      c.rect(w - 3, 5, w - 2, b, WD);
      c.col(1, 5, b, W);
      c.col(w - 3, 5, b, W);
      c.poly([[3, 5], [8, 5], [6, 24], [7, 31], [5, 40], [3, 43]], dr); // curtains tied back
      c.line(5, 8, 4, 36, D(dr));
      c.row(31, 3, 7, C.gold);
      c.poly([[w - 4, 5], [w - 9, 5], [w - 7, 24], [w - 8, 31], [w - 6, 40], [w - 4, 43]], dr);
      c.line(w - 6, 8, w - 5, 36, D(dr));
      c.row(31, w - 8, w - 4, C.gold);
    };
    V('bed-fourposter', {
      base: 'side',
      side: view(36, 60, front(false)),
      used: over('bed-fourposter', (c) => {
        c.clearRect(15, 32, 42, 32);
        mattress(c, 6, 42, 33, 37);
        pillow(c, 6, 30, 12, 33);
        pillow(c, 8, 29, 13, 31, C.bone);
        dent(c, 9, 30, C.bone);
        dots(c, D(C.cream), [16, 34, 18, 35, 21, 34, 24, 36]);
        c.poly([[27, 33], [29, 29], [36, 29], [42, 31], [42, 37], [26, 37]], cov);
        c.line(27, 33, 29, 29, L(cov));
        c.row(29, 29, 36, L(cov));
        c.line(30, 31, 28, 37, D(cov));
        c.line(36, 31, 38, 36, D(cov));
        c.row(35, 31, 42, C.gold);
        c.rect(43, 5, 44, 44, WD); // the post again, in front of the heap
        c.col(43, 5, 44, W);
        c.poly([[42, 30], [41, 28], [42, 36]], dr);
      }),
      sideUsed: view(36, 60, front(true)),
    });
  }
  {
    // the bare mattress; used, somebody has made a bed of it
    const t = hex('#a39a7c');
    const front = (used) => (c) => {
      c.rect(1, 2, 18, 21, t);
      c.row(2, 2, 17, L(t));
      c.clear(1, 2);
      c.clear(18, 2);
      for (let y = 5; y < 21; y += 3) c.row(y, 2, 17, hex('#7c8086')); // ticking stripes
      c.rect(1, 22, 18, 25, D(t));
      c.row(25, 1, 18, mix(t, 0.5));
      stain(c, 5, 5, 11, 10, C.blood, 2);
      stain(c, 9, 14, 14, 18, hex('#6e6238'), 5);
      c.set(8, 22, C.blood);
      tear(c, 3, 16, t, 3);
      if (used) {
        c.rect(4, 3, 14, 6, C.bone);
        c.row(6, 4, 14, D(C.bone));
        c.rect(1, 11, 18, 21, BLANKET);
        c.row(11, 1, 18, L(BLANKET));
        c.rect(1, 22, 18, 23, D(BLANKET));
        c.row(19, 1, 18, STRIPE);
        c.line(5, 13, 3, 20, D(BLANKET));
      }
    };
    V('mattress-stained', {
      base: 'side',
      side: view(20, 28, front(false)),
      used: over(
        'mattress-stained',
        (c) => {
          pillow(c, 3, 1, 9, 3, C.bone);
          blanket(c, 14, 34, 2, 6, BLANKET);
          c.row(5, 14, 34, STRIPE);
          c.line(17, 3, 15, 6, D(BLANKET));
          c.rect(31, 7, 34, 8, BLANKET);
        },
        { h: 10 },
      ),
      sideUsed: view(20, 28, front(true)),
    });
  }
  {
    // cradle and crib: a small blanket left hanging over the side
    const front = (used) => (c) => {
      c.rect(2, 3, 11, 11, W);
      c.rect(3, 2, 10, 2, WL); // the hood
      c.row(3, 2, 11, WL);
      c.col(2, 3, 11, WL);
      c.rect(4, 4, 9, 6, mix(W, 0.4));
      c.row(6, 4, 9, C.cream);
      c.row(7, 2, 11, WL); // foot board
      panel(c, 4, 8, 9, 10, W);
      c.row(12, 3, 10, WD);
      c.rect(2, 13, 3, 14, WD); // the rockers, end on
      c.rect(10, 13, 11, 14, WD);
      if (used) {
        c.rect(11, 6, 13, 12, ROSE);
        c.col(11, 6, 12, L(ROSE));
        c.set(13, 6, null);
        c.clear(13, 6);
        c.clear(12, 12);
      }
    };
    V('cradle', {
      base: 'side',
      side: view(14, 16, front(false)),
      used: over('cradle', (c) => {
        c.rect(9, 5, 14, 11, ROSE);
        c.row(5, 9, 14, L(ROSE));
        c.col(11, 6, 11, D(ROSE));
        c.rect(10, 12, 13, 12, ROSE);
        c.set(12, 13, ROSE);
      }),
      sideUsed: view(15, 16, front(true)),
    });
    const cc = hex('#8d8a7a');
    const end = (used) => (c) => {
      const t = canvas(14, 20);
      crib(t, cc, { bed: hex('#9c937a') });
      c.stamp(t, 0, 0);
      cobweb(c, 3, 5, 1, 1, 4, true);
      c.speckle(1, 1, 13, 18, hex('#6a5a48'), 9, 3);
      if (used) {
        c.rect(12, 3, 14, 11, ROSE);
        c.col(12, 3, 11, L(ROSE));
        c.clear(14, 3);
        c.clear(13, 11);
      }
    };
    V('crib-old', {
      side: view(14, 20, end(false)),
      used: over('crib-old', (c) => {
        c.rect(8, 3, 14, 10, ROSE);
        c.row(3, 8, 14, L(ROSE));
        c.col(10, 4, 10, D(ROSE));
        c.col(13, 4, 9, D(ROSE));
        c.clear(8, 10);
        c.clear(11, 10);
        c.clear(14, 10);
      }),
      sideUsed: view(16, 20, end(true)),
    });
  }

  /* ---------- wardrobes, drawers, cabinets: from the side a plain narrow case, its front to the right ---------- */
  function wardrobeSide(c, col, state) {
    const b = c.h - 2;
    c.rect(1, 1, 10, 3, L(col)); // cornice
    c.row(1, 1, 10, L(L(col)));
    c.row(3, 1, 10, col);
    c.rect(2, 4, 9, b - 1, col);
    c.col(2, 4, b - 1, L(col));
    panel(c, 4, 6, 7, b - 9, col);
    c.row(b - 7, 2, 9, D(col));
    c.row(b - 1, 2, 9, D(col));
    legs(c, [2, 8], b, b, D(col));
    if (state === 'open') {
      wardrobeDoor(c, 10, 18, 5, 29, col); // the near door, standing straight out
      c.col(10, 5, 29, D(col));
      dots(c, C.brass, [17, 18, 17, 19]);
    } else if (state === 'ajar') {
      c.rect(10, 5, 12, 29, col);
      c.col(10, 5, 29, D(col));
      c.col(12, 5, 29, L(col));
      dots(c, hex('#6a6a70'), [13, 21, 13, 23, 13, 25]); // long fingers round the edge of the door
      c.set(11, 12, C.glow);
    } else dots(c, C.brass, [10, 18, 10, 19]);
  }
  /** The wardrobe with both doors swung wide (on a canvas 30 wide), as 'wardrobe-open' is drawn. */
  function wardrobeOpen(c, col, coats) {
    const lc = L(col);
    wardrobeBody(c, col);
    c.clearRect(23, 1, 28, 36);
    c.rect(3, 5, 20, 29, mix(col, 0.3));
    c.row(7, 3, 20, C.steel);
    coats.forEach((cc, i) => {
      const x = 4 + i * 3;
      c.set(x + 1, 8, C.steel);
      if (!cc) return;
      c.rect(x, 9, x + 2, 22 + (i % 2) * 4, cc);
      c.col(x, 10, 22 + (i % 2) * 4, L(cc));
      c.clear(x, 9);
      c.set(x, 9, mix(col, 0.3));
    });
    c.rect(1, 5, 2, 29, lc);
    c.rect(19, 5, 20, 29, mix(col, 0.3));
    c.rect(21, 4, 21, 29, col);
    c.rect(22, 5, 27, 30, lc);
    c.col(22, 5, 30, L(lc));
    panel(c, 23, 7, 26, 28, lc);
    c.row(30, 22, 27, D(lc));
  }
  V('wardrobe-old', {
    side: view(12, 38, (c) => wardrobeSide(c, W, 'shut')),
    used: view(30, 38, (c) => A['wardrobe-open'].draw(c)),
    sideUsed: view(21, 38, (c) => wardrobeSide(c, W, 'open')),
  });
  V('wardrobe-open', {
    side: view(21, 38, (c) => wardrobeSide(c, W, 'open')),
    used: view(24, 38, (c) => A['wardrobe-old'].draw(c)),
    sideUsed: view(12, 38, (c) => wardrobeSide(c, W, 'shut')),
  });
  {
    // the wardrobe with something in it: thrown open, there is nothing there
    const col = hex('#4f3528');
    V('wardrobe-eyes', {
      side: view(15, 38, (c) => wardrobeSide(c, col, 'ajar')),
      used: view(30, 38, (c) => {
        wardrobeOpen(c, col, [hex('#4b4438'), null, null, C.navy, null]);
        c.rect(6, 28, 9, 28, C.black); // one shoe
        c.line(12, 9, 14, 12, C.steel); // a hanger knocked askew
      }),
      sideUsed: view(21, 38, (c) => wardrobeSide(c, col, 'open')),
    });
  }
  function drawersSide(c, col, open) {
    const b = c.h - 2,
      n = Math.floor((b - 5) / 4);
    c.rect(1, 2, 11, 3, L(col));
    c.row(2, 1, 11, L(L(col)));
    c.rect(2, 4, 10, b - 1, col);
    c.col(2, 4, b - 1, L(col));
    panel(c, 4, 6, 8, b - 3, col);
    legs(c, [2, 9], b, b, D(col));
    for (let i = 0; i < n; i++) if (i !== open) c.set(11, 6 + i * 4, C.brass);
    if (open != null) {
      const y = 5 + open * 4;
      c.rect(11, y + 1, 16, y + 4, L(col)); // the drawer, pulled out
      c.row(y + 1, 11, 16, L(L(col)));
      c.row(y + 4, 11, 16, col);
      c.set(17, y + 3, C.brass);
      c.rect(11, y, 13, y, C.cream); // clothes spilling over
      c.set(12, y - 1, C.cream);
      c.rect(14, y, 15, y, C.wine);
      c.col(14, y, y + 3, C.wine);
    }
  }
  for (const [slug, col] of [['chest-of-drawers', W], ['dresser', WL]])
    V(slug, {
      side: view(13, 23, (c) => drawersSide(c, col)),
      used: view(22, 23, (c) => chestOfDrawers(c, col, 1)),
      sideUsed: view(19, 23, (c) => drawersSide(c, col, 1)),
    });
  V('chest-of-drawers-open', {
    side: view(19, 23, (c) => drawersSide(c, W, 1)),
    used: view(22, 23, (c) => chestOfDrawers(c, W)),
    sideUsed: view(13, 23, (c) => drawersSide(c, W)),
  });

  /* ---------- bookcases ---------- */
  /** A bookcase from the side: the plain end board, and past its front edge a sliver of the books. */
  function bookcaseSide(c, col, fill = 1, seed = 3) {
    const b = c.h - 2;
    c.row(1, 1, 9, L(col));
    c.rect(2, 2, 8, b - 2, col);
    c.col(2, 2, b - 2, L(col));
    c.col(5, 4, b - 4, D(col));
    c.rect(2, b - 1, 8, b, D(col));
    for (let i = 0; i < 5; i++) {
      const t = 3 + Math.round((i * 32) / 5),
        e = 2 + Math.round(((i + 1) * 32) / 5) - 1,
        f = Array.isArray(fill) ? fill[i] : fill;
      c.col(8, t, e, mix(col, 0.42));
      if (f > 0) books(c, 8, 8, e, e - t, seed + i * 7, 1);
    }
  }
  const bookOnFloor = (c, x, y, col) => {
    c.rect(x, y, x + 5, y + 1, col);
    c.row(y, x, x + 5, L(col));
    c.set(x + 5, y + 1, C.paper);
  };
  {
    const gap = (c, x0, x1, t, e, col) => {
      c.rect(x0, t, x1, e, mix(col, 0.42));
      c.row(t, x0, x1, mix(col, 0.3));
    };
    V('bookcase-full', {
      side: view(11, 38, (c) => bookcaseSide(c, W)),
      used: over('bookcase-full', (c) => {
        gap(c, 8, 13, 9, 14, W); // books taken, a neighbour leaning into the gap
        c.line(12, 10, 10, 14, C.navy);
        gap(c, 15, 20, 22, 27, W);
        c.line(15, 23, 17, 27, C.mustard);
        bookOnFloor(c, 14, 35, C.wine);
      }),
      sideUsed: view(17, 38, (c) => {
        bookcaseSide(c, W);
        c.rect(9, 11, 10, 14, C.mustard); // one half pulled out
        c.row(11, 9, 10, L(C.mustard));
        bookOnFloor(c, 10, 35, C.wine);
      }),
    });
    const hc = hex('#5c3f2e');
    V('bookcase-half', {
      side: view(11, 38, (c) => {
        bookcaseSide(c, hc, [0.5, 0, 1, 0, 1], 9);
        cobweb(c, 2, 2, 1, 1, 4);
      }),
      used: over('bookcase-half', (c) => {
        gap(c, 8, 12, 12, 14, hc); // the book that lay flat is gone
        gap(c, 4, 8, 25, 27, hc);
        cobweb(c, 22, 23, -1, 1, 5);
        bookOnFloor(c, 5, 35, C.parchment);
        bookOnFloor(c, 12, 35, C.wine);
        c.row(34, 12, 20, C.ash);
      }),
      sideUsed: view(17, 38, (c) => {
        bookcaseSide(c, hc, [0.5, 0, 1, 0, 0], 9);
        cobweb(c, 2, 2, 1, 1, 4);
        bookOnFloor(c, 10, 35, C.parchment);
        c.rect(11, 33, 15, 34, C.wine);
        c.row(33, 11, 15, L(C.wine));
      }),
    });
    // the toppled case; used, the books have been picked up and piled
    const fallen = (c) => {
      c.rect(1, 6, 30, 16, W);
      c.row(6, 1, 30, WL);
      c.row(16, 1, 30, WD);
      for (let x = 7; x < 30; x += 6) c.col(x, 7, 15, WD);
      c.line(3, 9, 5, 12, WD);
      c.line(20, 8, 24, 10, WD);
    };
    const pile = (c, x, b, cols) => cols.forEach((col, i) => bookOnFloor(c, x + (i % 2), b - 1 - i * 2, col));
    const fallenEnd = (c) => {
      c.rect(1, 6, 9, 16, W); // the top of the case, towards us
      c.row(6, 1, 9, WL);
      c.col(1, 6, 16, WL);
      c.frame(3, 8, 7, 14, WD);
      c.row(16, 1, 9, WD);
    };
    V('bookcase-toppled', {
      base: 'side',
      side: view(20, 18, (c) => {
        fallenEnd(c);
        c.rect(10, 13, 15, 14, C.wine);
        c.rect(11, 15, 17, 16, C.navy);
        c.poly([[13, 9], [16, 10], [14, 13], [12, 12]], C.forest);
        c.rect(15, 13, 18, 14, C.mustard);
        c.rect(3, 4, 7, 5, C.plum);
        c.row(4, 3, 7, L(C.plum));
      }),
      used: view(44, 18, (c) => {
        fallen(c);
        pile(c, 32, 16, [C.navy, C.wine, C.mustard, C.forest, C.plum, C.teal, C.parchment]);
      }),
      sideUsed: view(20, 18, (c) => {
        fallenEnd(c);
        pile(c, 11, 16, [C.navy, C.wine, C.mustard, C.forest, C.plum, C.teal, C.parchment]);
      }),
    });
    // the bookcase that is a door
    const dc = hex('#5f3f2c');
    const shutSide = (c) => {
      bookcaseSide(c, dc, 1, 17);
      c.col(1, 2, 36, NIGHT); // the hairline gap, at the wall
    };
    const openSide = (c) => {
      c.rect(1, 1, 5, 36, C.stoneDark); // the wall, cut through
      c.col(1, 1, 36, L(C.stoneDark));
      c.rect(4, 3, 5, 36, NIGHT);
      dots(c, D(C.stoneDark), [2, 8, 3, 8, 2, 20, 3, 20, 2, 30]);
      bookcase(c, 8, 2, 22, 36, dc, 1, 17); // the case swung out into the room, books towards us
      c.rect(6, 2, 7, 36, mix(dc, 0.5));
      c.rect(15, 16, 16, 21, C.red);
      c.row(17, 15, 16, C.gold);
    };
    V('bookcase-door', {
      side: view(11, 38, shutSide),
      used: view(36, 38, (c) => A['bookcase-door-open'].draw(c)),
      sideUsed: view(25, 38, openSide),
    });
    V('bookcase-door-open', {
      side: view(25, 38, openSide),
      used: view(26, 38, (c) => A['bookcase-door'].draw(c)),
      sideUsed: view(11, 38, shutSide),
    });
  }

  /* ---------- cabinets and clocks ---------- */
  {
    const sbSide = (open) => (c) => {
      c.rect(1, 2, 12, 3, WL);
      c.row(2, 1, 12, L(WL));
      c.rect(2, 4, 11, 15, W);
      c.col(2, 4, 15, L(W));
      panel(c, 4, 6, 9, 13, W);
      c.row(15, 2, 11, WD);
      legs(c, [2, 10], 16, 17, WD);
      c.set(12, 6, C.brass);
      if (open) {
        c.rect(12, 9, 18, 14, W); // a door standing out
        c.row(9, 12, 18, L(W));
        panel(c, 13, 10, 17, 13, W);
        c.set(17, 11, C.brass);
      } else c.set(12, 11, C.brass);
    };
    V('sideboard', {
      side: view(14, 19, sbSide(false)),
      used: over('sideboard', (c) => {
        c.rect(13, 9, 22, 14, mix(W, 0.3)); // the middle doors open
        c.row(12, 13, 22, mix(W, 0.55));
        c.rect(14, 10, 14, 11, C.wine); // a bottle, glasses, plates
        c.set(14, 9, C.wine);
        dots(c, C.glassLight, [16, 11, 18, 11, 16, 10, 18, 10]);
        c.row(14, 15, 20, C.white);
        c.row(13, 16, 19, C.bone);
        c.rect(11, 9, 12, 15, WL); // the doors, edge on
        c.col(11, 9, 15, L(WL));
        c.rect(23, 9, 24, 15, WL);
        c.col(23, 9, 15, L(WL));
      }),
      sideUsed: view(20, 19, sbSide(true)),
    });
    const paneCol = mix(C.glass, 0.6);
    const dcSide = (open) => (c) => {
      c.rect(1, 1, 9, 2, WD);
      c.row(1, 1, 9, W);
      shelves(c, 2, 3, 8, 26, WD, 3, (i, x0, t, x1, b) => {
        if (i === 0) {
          c.rect(x0 + 1, b - 3, x0 + 2, b, C.bone);
          c.set(x1, b, C.gold);
        } else if (i === 1) {
          c.rect(x0 + 2, b - 3, x0 + 3, b, C.wine);
          c.set(x0, b, C.mustard);
        } else c.rect(x0 + 1, b - 1, x1 - 1, b, C.stoneLight);
      });
      c.line(3, 9, 5, 6, C.glassLight); // the glass side
      dots(c, C.glass, [6, 14, 4, 20, 6, 23]);
      c.rect(2, 27, 8, 34, WD);
      panel(c, 3, 28, 7, 33, WD);
      legs(c, [2, 7], 35, 36, mix(WD, 0.7));
      if (open) {
        c.rect(9, 3, 16, 26, WD); // the glazed door, standing out
        c.rect(10, 5, 15, 24, paneCol);
        c.row(14, 10, 15, WD);
        c.line(11, 11, 13, 8, C.glassLight);
        c.line(12, 21, 14, 18, C.glass);
        c.set(15, 15, C.brass);
      } else c.set(9, 14, C.brass);
    };
    V('display-cabinet', {
      side: view(11, 38, dcSide(false)),
      used: over(
        'display-cabinet',
        (c) => {
          const inner = mix(WD, 0.42);
          for (let y = 4; y <= 25; y++)
            for (let x = 13; x <= 20; x++) {
              const p = c.get(x, y);
              if (p === C.glass || p === C.glassLight) c.set(x, y, inner); // no glass in front of this half now
            }
          c.rect(16, 13, 18, 17, inner); // and one of the curios taken
          c.rect(12, 3, 13, 26, inner);
          c.col(12, 3, 26, WD);
          c.rect(23, 3, 26, 26, WD); // the door, swung towards us
          c.col(23, 3, 26, W);
          c.rect(24, 5, 25, 24, paneCol);
          c.row(14, 24, 25, WD);
          dots(c, C.glassLight, [24, 9, 25, 8, 24, 20]);
        },
        { w: 28 },
      ),
      sideUsed: view(18, 38, dcSide(true)),
    });
    const ccSide = (open) => (c) => {
      c.rect(1, 1, 8, 2, W);
      c.row(1, 1, 8, WL);
      c.rect(2, 3, 7, 21, W);
      c.col(2, 3, 21, L(W));
      panel(c, 3, 5, 6, 19, W);
      c.col(8, 3, 21, mix(W, 0.42)); // the open shelves: plates seen edge on
      for (const [y, col] of [[6, C.white], [12, C.glassLight], [18, C.white]]) c.col(8, y, y + 2, col);
      c.rect(1, 22, 10, 23, WL);
      c.row(22, 1, 10, L(WL));
      c.rect(2, 24, 9, 36, W);
      c.col(2, 24, 36, L(W));
      panel(c, 3, 26, 8, 35, W);
      c.set(10, 26, C.brass);
      if (open) {
        c.rect(10, 29, 17, 35, W);
        c.row(29, 10, 17, L(W));
        panel(c, 11, 30, 16, 34, W);
        c.set(16, 32, C.brass);
        c.clearRect(8, 6, 8, 8);
        c.col(8, 6, 8, mix(W, 0.42));
      } else c.set(10, 32, C.brass);
    };
    V('china-cabinet', {
      side: view(12, 38, ccSide(false)),
      used: over(
        'china-cabinet',
        (c) => {
          c.rect(14, 5, 17, 8, mix(W, 0.42)); // two plates taken down
          c.rect(9, 11, 12, 14, mix(W, 0.42));
          c.rect(13, 29, 22, 35, mix(W, 0.3)); // the cupboard below open
          c.row(32, 13, 22, mix(W, 0.55));
          c.rect(15, 30, 19, 31, C.white);
          c.row(31, 15, 19, D(C.white));
          c.rect(14, 34, 17, 35, C.white);
          c.rect(19, 33, 20, 35, C.glassLight);
          c.rect(24, 29, 26, 36, WL); // its door, swung towards us
          c.col(24, 29, 36, L(WL));
          c.row(36, 24, 26, D(WL));
        },
        { w: 28 },
      ),
      sideUsed: view(19, 38, ccSide(true)),
    });
    function clockSide(c, stopped, open) {
      const col = stopped ? hex('#55392a') : W;
      c.rect(3, 1, 6, 1, col);
      c.rect(2, 2, 7, 2, col);
      c.rect(1, 3, 8, 12, col); // hood
      c.col(1, 3, 12, L(col));
      c.rect(3, 5, 6, 10, mix(col, 0.35)); // its little side window
      dots(c, C.brass, [4, 7, 5, 8]);
      c.col(9, 5, 10, stopped ? C.parchment : C.cream); // the dial, edge on
      c.rect(2, 13, 7, 28, col); // trunk
      c.col(2, 13, 28, L(col));
      panel(c, 4, 15, 5, 26, col);
      c.rect(1, 29, 8, 36, col); // base
      c.col(1, 29, 36, L(col));
      c.row(29, 1, 8, L(col));
      panel(c, 3, 31, 6, 34, col);
      c.row(36, 1, 8, D(col));
      if (stopped) {
        cobweb(c, 1, 3, 1, 1, 4);
        cobweb(c, 7, 13, -1, 1, 4);
      }
      if (open) {
        c.rect(8, 13, 13, 28, col); // the long door, standing out
        c.row(13, 8, 13, L(col));
        c.rect(10, 15, 11, 26, mix(col, 0.35));
        c.set(13, 20, C.brass);
      }
    }
    const clockOpen = (slug, stopped) =>
      over(
        slug,
        (c) => {
          const col = stopped ? hex('#55392a') : W;
          c.rect(3, 14, 8, 27, mix(col, 0.3)); // the case open: weights and pendulum
          c.col(3, 14, 17, C.steel);
          c.rect(3, 18, 3, 21, C.brass);
          c.col(8, 14, 20, C.steel);
          c.rect(8, 21, 8, 24, C.brass);
          if (stopped) {
            c.line(5, 14, 7, 22, C.brass);
            c.set(7, 23, C.brass);
            cobweb(c, 8, 14, -1, 1, 5);
            c.set(5, 26, C.gold); // and a key at the bottom
            c.set(6, 27, C.gold);
            c.set(5, 27, C.gold);
          } else {
            c.col(5, 14, 22, C.brass);
            c.rect(5, 23, 6, 24, C.gold);
            c.set(4, 23, C.gold);
          }
          c.rect(11, 13, 14, 28, L(col)); // its door, swung towards us
          c.col(11, 13, 28, col);
          c.rect(12, 15, 13, 26, mix(col, 0.5));
          c.row(28, 11, 14, D(col));
        },
        { w: 16 },
      );
    V('grandfather-clock', {
      side: view(11, 38, (c) => clockSide(c, false)),
      used: clockOpen('grandfather-clock', false),
      sideUsed: view(15, 38, (c) => clockSide(c, false, true)),
    });
    V('grandfather-clock-stopped', {
      side: view(11, 38, (c) => clockSide(c, true)),
      used: clockOpen('grandfather-clock-stopped', true),
      sideUsed: view(15, 38, (c) => clockSide(c, true, true)),
    });
  }

  /* ---------- safe and filing cabinet ---------- */
  {
    const safeSide = (open) => (c) => {
      const col = C.iron;
      c.rect(1, 1, 12, 17, col);
      c.row(1, 1, 12, L(col));
      c.col(1, 1, 17, L(col));
      c.rect(2, 18, 3, 18, C.ironDark);
      c.rect(10, 18, 11, 18, C.ironDark);
      c.frame(3, 3, 10, 15, C.ironDark);
      dots(c, C.ironDark, [2, 2, 11, 2, 2, 16, 11, 16]);
      if (open) {
        c.rect(13, 2, 21, 16, L(col)); // the door, standing out: its inside
        c.row(2, 13, 21, C.steel);
        c.frame(15, 4, 20, 14, col);
        c.rect(17, 7, 18, 11, C.ironDark); // the bolt work
        c.row(9, 15, 20, C.ironDark);
        c.col(13, 2, 16, col);
      } else {
        c.col(12, 2, 16, L(col));
        c.set(13, 8, C.steel); // dial and handle
        c.set(13, 9, C.steel);
        c.set(13, 11, C.brass);
      }
    };
    V('safe-shut', {
      side: view(15, 20, safeSide(false)),
      used: view(18, 20, (c) => safe(c, true)),
      sideUsed: view(23, 20, safeSide(true)),
    });
    V('safe-open', {
      side: view(23, 20, safeSide(true)),
      used: view(18, 20, (c) => safe(c, false)),
      sideUsed: view(15, 20, safeSide(false)),
    });
    const fileSide = (open) => (c) => {
      const col = hex('#5d6660');
      c.rect(1, 1, 15, 27, col);
      c.col(1, 1, 27, L(col));
      c.row(1, 1, 15, L(col));
      c.row(27, 1, 15, D(col));
      c.frame(3, 3, 13, 25, D(col));
      c.col(15, 2, 26, D(col));
      for (let i = 0; i < 4; i++) if (!(open && i === 1)) c.set(16, 5 + i * 6, C.steel);
      if (open) {
        c.rect(16, 10, 24, 14, L(col)); // the second drawer, run right out
        c.row(10, 16, 24, L(L(col)));
        c.row(14, 16, 24, col);
        dots(c, C.paper, [16, 9, 17, 9, 19, 9, 20, 9, 22, 9, 23, 9, 17, 8, 21, 8]);
        dots(c, C.parchment, [18, 9, 21, 9, 24, 9, 19, 8, 23, 8]);
        c.rect(25, 8, 26, 14, col);
        c.col(25, 8, 14, L(col));
        c.set(27, 11, C.steel);
      }
    };
    V('filing-cabinet', {
      side: view(18, 30, fileSide(false)),
      used: view(13, 30, (c) => filing(c, true)),
      sideUsed: view(29, 30, fileSide(true)),
    });
    V('filing-cabinet-open', {
      side: view(29, 30, fileSide(true)),
      used: view(13, 30, (c) => filing(c, false)),
      sideUsed: view(18, 30, fileSide(false)),
    });
  }

  /* ---------- sofas and armchairs ---------- */
  /** A sofa or armchair from the side: the back to the left, the near arm in front of the seat. */
  function sofaSide(c, col, o = {}) {
    const b = c.h - 2,
      top = o.top || 2;
    c.rect(2, top, 5, b - 2, col); // the back
    c.col(2, top + 1, b - 2, L(col));
    c.row(top, 3, 5, L(col));
    c.clear(2, top);
    if (o.wing) {
      c.rect(4, top + 1, 9, b - 11, col);
      c.row(top + 1, 4, 8, L(col));
      c.clear(9, top + 1);
      c.col(9, top + 3, b - 11, D(col));
    }
    c.rect(6, b - 8, 13, b - 5, col); // the seat, showing past the arm
    c.row(b - 8, 6, 13, L(col));
    c.rect(6, b - 4, 13, b - 2, D(col));
    c.row(b - 4, 6, 13, mix(col, 0.5));
    c.rect(3, b - 11, 12, b - 2, col); // the arm
    c.row(b - 11, 3, 11, L(col));
    c.row(b - 10, 3, 12, L(col));
    c.row(b - 9, 3, 12, D(col));
    c.clear(12, b - 11);
    c.col(12, b - 8, b - 2, D(col));
    legs(c, [3, 11], b - 1, b, o.feet || WD);
  }
  const THROW = C.mustard;
  /** A woollen throw left over the back and the seat. */
  function throwFront(c, x0, x1, top, b) {
    c.poly([[x0 + 1, top - 1], [x1 - 1, top - 1], [x1, top + 2], [x1, b - 6], [x0, b - 6], [x0, top + 2]], THROW);
    c.row(top - 1, x0 + 1, x1 - 1, L(THROW));
    for (let y = top + 2; y < b - 6; y += 3) c.row(y, x0, x1, C.wine);
    c.col(x0 + 2, top, b - 6, D(THROW));
    for (let x = x0; x <= x1; x += 2) c.set(x, b - 5, THROW); // fringe
  }
  function throwSide(c, top) {
    c.rect(1, top - 1, 6, top + 6, THROW);
    c.row(top - 1, 2, 5, L(THROW));
    c.clear(1, top - 1);
    c.clear(6, top - 1);
    for (let y = top + 2; y < top + 6; y += 3) c.row(y, 1, 6, C.wine);
    for (let x = 1; x <= 6; x += 2) c.set(x, top + 7, THROW);
  }
  /** A dust sheet pulled off and left in a heap on the floor. */
  function sheetHeap(c, x0, x1, t, b, seed = 5) {
    const m = (x0 + x1) >> 1,
      r = rnd(seed);
    c.poly([[x0, b], [x0 + 1, t + 3], [m - 1, t], [m + 2, t + 1], [x1 - 1, t + 4], [x1, b]], SHEET);
    c.line(x0 + 1, t + 3, m - 1, t, L(SHEET));
    for (let x = x0 + 1; x < x1; x += 2) if (r() < 0.6) c.col(x, t + 4 + ((r() * 2) | 0), b - ((r() * 2) | 0), FOLD);
    c.line(m, t + 1, m + 2, b - 1, FOLD);
  }
  const seatViews = (slug, w, col, marks, sideMarks, o = {}) => {
    const h = A[slug].h,
      top = o.top || 2;
    V(slug, {
      side: view(15, h, (c) => {
        sofaSide(c, col, o);
        if (sideMarks) sideMarks(c);
      }),
      used: over(slug, (c) => throwFront(c, w > 24 ? 21 : 6, w > 24 ? 29 : 11, top, h - 2)),
      sideUsed: view(15, h, (c) => {
        sofaSide(c, col, o);
        if (sideMarks) sideMarks(c);
        throwSide(c, top);
      }),
    });
  };
  seatViews('sofa-worn', 36, ROSE, null, (c) => {
    c.speckle(3, 8, 12, 15, blend(ROSE, C.bone, 0.4), 9, 4);
    c.rect(6, 9, 9, 9, blend(ROSE, C.bone, 0.35));
  });
  seatViews('sofa-torn', 36, FADEDGREEN, null, (c) => {
    tear(c, 6, 10, FADEDGREEN, 4);
    c.set(13, 17, C.white);
    c.set(14, 18, C.bone);
  });
  seatViews('armchair-worn', 18, BROWN, null, (c) => c.speckle(3, 8, 12, 15, L(BROWN), 8, 5));
  seatViews('armchair-torn', 18, hex('#5c5a70'), null, (c) => {
    tear(c, 6, 10, hex('#5c5a70'), 4);
    c.set(13, 17, C.white);
  });
  seatViews('armchair-wing', 18, LEATHER, null, (c) => {
    dots(c, D(LEATHER), [6, 5, 7, 8, 6, 11]);
    dots(c, C.brass, [4, 21, 7, 21, 10, 21]);
  }, { wing: true });
  seatViews('sofa', 36, hex('#6f6250'));
  seatViews('sofa-blue', 36, hex('#39486a'));
  seatViews('armchair', 18, hex('#6a3a3a'));
  {
    // under the dust sheets; used, the sheet has been pulled off
    const sheetSide = (c) => {
      drape(c, [[3, 2], [6, 2], [7, 7], [13, 8], [13, 18], [1, 18], [1, 4]], 13);
      c.row(11, 4, 12, FOLD);
    };
    for (const [slug, w, col] of [['sofa-sheet', 36, hex('#6f6250')], ['armchair-sheet', 18, hex('#6a3a3a')]])
      V(slug, {
        side: view(15, 20, sheetSide),
        used: view(w + 8, 20, (c) => {
          const t = canvas(w, 20);
          sofa(t, col);
          c.stamp(t, 0, 0);
          c.rect(w - 6, 7, w - 2, 10, SHEET); // still caught on the arm
          c.row(7, w - 6, w - 2, L(SHEET));
          sheetHeap(c, w - 4, w + 6, 9, 18, w);
        }),
        sideUsed: view(22, 20, (c) => {
          sofaSide(c, col);
          sheetHeap(c, 11, 20, 10, 18, w);
        }),
      });
  }
  {
    // the chaise longue, from its foot end
    const col = hex('#5a3a52');
    const front = (used) => (c) => {
      c.rect(1, 2, 14, 9, col); // the raised head end
      c.row(2, 2, 13, L(col));
      c.clear(1, 2);
      c.clear(14, 2);
      c.row(9, 1, 14, D(col));
      dots(c, D(col), [4, 5, 8, 5, 11, 5]);
      c.rect(2, 10, 13, 24, col); // the long seat, running towards us
      c.col(2, 10, 24, L(col));
      for (let y = 12; y < 23; y += 4) dots(c, D(col), [5, y, 10, y]);
      c.rect(2, 22, 13, 24, col); // the low roll at the foot
      c.row(22, 2, 13, L(col));
      c.rect(2, 25, 13, 26, D(col));
      c.rect(2, 27, 13, 27, W);
      legs(c, [2, 12], 28, 30, WD);
      if (used) {
        c.rect(1, 13, 14, 19, THROW);
        c.row(13, 1, 14, L(THROW));
        c.row(16, 1, 14, C.wine);
        c.rect(13, 20, 14, 24, THROW);
        c.set(13, 25, THROW);
      }
    };
    V('chaise-longue', {
      base: 'side',
      side: view(16, 32, front(false)),
      used: over('chaise-longue', (c) => {
        c.rect(14, 9, 23, 14, THROW);
        c.row(9, 14, 23, L(THROW));
        c.col(17, 10, 14, C.wine);
        c.col(21, 10, 14, C.wine);
        for (let x = 14; x <= 23; x += 2) c.set(x, 15, THROW);
      }),
      sideUsed: view(16, 32, front(true)),
    });
  }
  V('footstool', {
    side: view(12, 9, (c) => A['footstool'].draw(c)),
    used: turned(12, 9, (c) => A['footstool'].draw(c)),
    sideUsed: turned(12, 9, (c) => A['footstool'].draw(c), true),
  });

  /* ---------- tables ---------- */
  /** Things left on a table whose top is the row below y: a plate, a bottle, a glass, a loaf. */
  function leftovers(c, y, xs) {
    const [p, bt, g, l] = xs;
    if (p != null) {
      c.row(y, p, p + 3, C.glassLight);
      c.set(p + 1, y - 1, C.bone);
      c.set(p + 2, y - 1, C.rust);
    }
    if (bt != null) {
      c.rect(bt, y - 3, bt + 1, y, C.forest);
      c.set(bt, y - 4, C.forest);
      c.set(bt, y - 5, C.bone);
      c.set(bt, y - 2, L(C.forest));
    }
    if (g != null) {
      c.col(g, y - 2, y - 1, C.glassLight);
      c.set(g, y, C.glass);
    }
    if (l != null) {
      c.rect(l, y - 1, l + 3, y, C.woodPale);
      c.row(y - 1, l, l + 2, L(C.woodPale));
      c.set(l + 3, y - 1, C.bone);
    }
  }
  for (const [slug, col] of [['table-long', W], ['dining-table', WL]])
    V(slug, {
      side: view(18, 17, (c) => table(c, 1, 16, 2, 15, col)),
      used: over(slug, (c) => leftovers(c, 7, [6, 15, 19, 28]), { h: 23 }),
      sideUsed: view(18, 23, (c) => {
        table(c, 1, 16, 8, 21, col);
        leftovers(c, 7, [3, 9, 12, null]);
      }),
    });
  V('coffee-table', {
    side: view(16, 11, (c) => table(c, 1, 14, 1, 9, W)),
    used: over(
      'coffee-table',
      (c) => {
        c.rect(5, 3, 11, 4, C.paper); // a newspaper and a cup
        c.row(4, 5, 11, D(C.paper));
        dots(c, C.slate, [6, 3, 8, 3, 9, 3]);
        c.rect(16, 2, 18, 4, C.white);
        c.set(19, 3, C.white);
        c.row(2, 16, 18, C.rust);
      },
      { h: 15 },
    ),
    sideUsed: view(16, 15, (c) => {
      table(c, 1, 14, 5, 13, W);
      c.rect(3, 3, 7, 4, C.paper);
      c.row(4, 3, 7, D(C.paper));
      c.rect(9, 2, 11, 4, C.white);
      c.set(12, 3, C.white);
      c.row(2, 9, 11, C.rust);
    }),
  });
  {
    const teaThings = (c, x, y) => {
      c.rect(x, y - 3, x + 3, y, C.white); // teapot
      c.set(x + 4, y - 2, C.white);
      c.set(x - 1, y - 2, C.white);
      c.set(x + 1, y - 4, C.white);
      c.row(y - 1, x, x + 3, hex('#5a6a88'));
      c.rect(x + 7, y - 1, x + 8, y, C.white); // cup
      c.set(x + 9, y - 1, C.white);
    };
    const round = (h) => over('table-round', (c) => teaThings(c, 6, 6), { h });
    V('table-round', { side: view(22, 16, (c) => A['table-round'].draw(c)), used: round(21), sideUsed: round(21) });
    V('side-table', {
      side: view(12, 14, (c) => A['side-table'].draw(c)),
      used: over(
        'side-table',
        (c) => {
          c.rect(2, 3, 6, 4, C.wine); // a book and a glass put down on it
          c.row(3, 2, 6, L(C.wine));
          c.set(6, 4, C.paper);
          c.col(8, 2, 3, C.glassLight);
          c.set(8, 4, C.glass);
        },
        { h: 18 },
      ),
      sideUsed: over(
        'side-table',
        (c) => {
          c.rect(4, 3, 7, 4, C.wine);
          c.row(3, 4, 7, L(C.wine));
          c.set(4, 4, C.paper);
          c.col(3, 2, 3, C.glassLight);
          c.set(3, 4, C.glass);
        },
        { h: 18 },
      ),
    });
    V('card-table', {
      side: view(20, 15, (c) => {
        A['card-table'].draw(c);
        c.clearRect(4, 1, 15, 1);
        dots(c, C.white, [3, 1, 4, 1, 9, 1, 10, 1, 14, 1, 15, 1]);
        c.set(6, 1, C.red);
      }),
      used: over(
        'card-table',
        (c) => {
          leftovers(c, 6, [null, 9, 12, null]); // a bottle, a glass, the stakes
          dots(c, C.gold, [14, 6, 15, 6, 15, 5, 16, 6]);
        },
        { h: 20 },
      ),
      sideUsed: over(
        'card-table',
        (c) => {
          c.clearRect(4, 6, 15, 6);
          dots(c, C.white, [3, 6, 4, 6, 14, 6, 15, 6]);
          leftovers(c, 6, [null, 7, 5, null]);
          dots(c, C.gold, [10, 6, 11, 6, 11, 5, 12, 6]);
        },
        { h: 20 },
      ),
    });
  }
  {
    // the table laid for dinner; used, dinner is over
    const cloth = (c, x0, x1) => {
      c.rect(x0, 9, x1, 10, C.white);
      c.row(11, x0, x1, C.cream);
      for (let x = x0; x <= x1; x += 1) if (x % 4 !== 0) c.set(x, 12, C.cream);
      c.row(9, x0, x1, L(C.white));
    };
    const end = (used) => (c) => {
      table(c, 1, 16, 9, 22, W);
      cloth(c, 1, 16);
      c.row(8, 3, 6, C.glassLight);
      c.set(12, 8, C.steel);
      c.rect(13, 6, 13, 8, C.glass);
      c.col(9, 4, 8, C.brass); // the candelabrum, its three candles in line
      c.row(8, 8, 10, D(C.brass));
      if (used) {
        candle(c, 9, 3, 3, false);
        dots(c, C.rust, [4, 7, 5, 7]);
        c.set(4, 8, C.bone);
        c.rect(12, 10, 14, 11, C.wine);
      } else candle(c, 9, 2, 3, true);
    };
    V('table-set', {
      side: view(18, 24, end(false)),
      used: over('table-set', (c) => {
        for (const [x, y] of [[18, 1], [18, 2], [20, 0], [20, 1], [22, 1], [22, 2], [20, 2], [18, 3], [22, 3]]) c.clear(x, y);
        dots(c, C.black, [18, 3, 20, 2, 22, 3]); // the candles burnt down
        for (const x of [5, 14, 25, 34]) dots(c, C.rust, [x + 1, 7, x + 2, 7]); // what is left on the plates
        dots(c, C.bone, [6, 8, 26, 8, 15, 7]);
        c.clear(30, 6);
        c.clear(30, 7);
        c.row(8, 29, 31, C.glass); // a glass knocked over, and the wine on the cloth
        c.rect(30, 9, 33, 10, C.wine);
        c.set(32, 11, C.wine);
        c.set(31, 12, C.wine);
      }),
      sideUsed: view(18, 24, end(true)),
    });
    // under its dust sheet; used, the sheet is off
    V('table-dustsheet', {
      side: view(18, 17, (c) => {
        drape(c, [[2, 2], [15, 2], [16, 4], [16, 13], [14, 15], [3, 15], [1, 13], [1, 4]], 31);
        c.row(4, 2, 15, FOLD);
        c.clearRect(1, 14, 2, 15);
        c.clearRect(6, 15, 10, 15);
        c.clearRect(15, 14, 16, 15);
        c.rect(3, 14, 4, 15, WD);
        c.rect(13, 14, 14, 15, WD);
      }),
      used: view(48, 17, (c) => {
        table(c, 1, 40, 2, 15, W, { mid: true });
        c.rect(35, 1, 40, 3, SHEET); // dragged off one end
        c.row(1, 35, 40, L(SHEET));
        sheetHeap(c, 37, 46, 4, 15, 9);
      }),
      sideUsed: view(24, 17, (c) => {
        table(c, 1, 16, 2, 15, W);
        c.rect(12, 1, 16, 3, SHEET);
        c.row(1, 12, 16, L(SHEET));
        sheetHeap(c, 13, 22, 4, 15, 9);
      }),
    });
  }

  /* ---------- chairs: drawn from the side above, so the other view is the front ---------- */
  function chairFront(c, x, b, o = {}) {
    const col = o.col || W,
      sh = o.seat || 9,
      bh = o.back || 18,
      x1 = x + (o.w || 9) - 1,
      pad = o.pad || col;
    legs(c, [x, x1 - 1], b - bh + 1, b, col); // the posts of the back run down into the legs
    c.col(x, b - bh + 1, b, L(col));
    c.rect(x, b - bh + 1, x1, b - bh + 2, col); // top rail
    c.row(b - bh + 1, x, x1, L(col));
    c.row(b - bh + 5, x, x1, D(col));
    if (o.padBack) c.rect(x + 2, b - bh + 3, x1 - 2, b - sh - 3, pad);
    c.rect(x, b - sh, x1, b - sh + 1, pad);
    c.row(b - sh, x, x1, L(pad));
    c.row(b - 3, x + 2, x1 - 2, D(col));
  }
  {
    const red = hex('#7a2b30');
    const redFront = (c) => {
      chairFront(c, 1, 19, { col: WD, pad: red, padBack: true });
      c.rect(1, 9, 9, 10, red);
      c.row(9, 1, 9, L(red));
    };
    const plainFront = (c) => chairFront(c, 1, 19, { col: W });
    V('chair-dining', {
      base: 'side',
      side: view(11, 21, plainFront),
      used: view(21, 12, (c) => A['chair-toppled'].draw(c)),
      sideUsed: turned(11, 21, plainFront),
    });
    V('chair-dining-red', {
      base: 'side',
      side: view(11, 21, redFront),
      used: turned(11, 21, (c) => A['chair-dining-red'].draw(c)),
      sideUsed: turned(11, 21, redFront),
    });
    V('chair-toppled', {
      base: 'side',
      side: turned(11, 21, plainFront),
      used: view(11, 21, (c) => A['chair-dining'].draw(c)),
      sideUsed: view(11, 21, plainFront),
    });
    const sticks = (c, cut) => {
      const x1 = 16 - cut;
      c.rect(2, 9, x1, 10, W); // the seat flat on the floor, the rest stacked on it
      c.row(9, 2, x1, WL);
      c.rect(3, 7, x1 - 2, 8, WD);
      c.row(7, 3, x1 - 2, W);
      c.rect(2, 5, x1 - 3, 6, W);
      c.row(5, 2, x1 - 3, WL);
      c.rect(4, 3, x1 - 1, 4, WD);
      c.row(3, 4, x1 - 1, W);
      dots(c, C.woodPale, [2, 5, x1, 9, x1 - 1, 3, 3, 7, x1 - 2, 7]);
    };
    V('chair-broken', {
      base: 'side',
      side: view(14, 12, (c) => {
        c.rect(2, 8, 10, 9, W); // the seat, end on, the back flat behind it
        c.row(8, 2, 10, WL);
        c.rect(3, 6, 9, 7, W);
        c.row(6, 3, 9, WL);
        c.line(8, 8, 10, 3, WD); // one leg in the air
        c.line(9, 8, 11, 3, W);
        dots(c, C.woodPale, [10, 2, 11, 2, 4, 10, 7, 10]);
        c.rect(1, 10, 3, 10, WD);
        c.set(1, 9, C.woodPale);
      }),
      used: view(18, 12, (c) => sticks(c, 0)), // gathered up for the fire
      sideUsed: view(12, 12, (c) => sticks(c, 6)),
    });
    const shawl = C.plum;
    const rockFront = (used) => (c) => {
      chairFront(c, 1, 18, { col: W });
      c.rect(1, 19, 2, 19, WD); // the rockers, end on
      c.rect(8, 19, 9, 19, WD);
      if (used) {
        c.poly([[1, 1], [9, 1], [9, 4], [5, 9], [1, 4]], shawl);
        c.row(1, 1, 9, L(shawl));
        dots(c, L(shawl), [3, 5, 5, 7, 7, 5]);
      }
    };
    V('rocking-chair', {
      base: 'side',
      side: view(11, 22, rockFront(false)),
      used: over('rocking-chair', (c) => {
        c.rect(2, 1, 5, 8, shawl); // a shawl left over the back
        c.row(1, 2, 5, L(shawl));
        c.set(5, 9, shawl);
        c.set(3, 9, shawl);
        c.col(2, 2, 8, D(shawl));
      }),
      sideUsed: view(11, 22, rockFront(true)),
    });
    const highFront = (used) => (c) => {
      c.rect(2, 1, 8, 4, WL); // the back
      c.row(1, 2, 8, L(WL));
      c.rect(2, 5, 8, 10, W);
      for (const x of [4, 6]) c.col(x, 5, 10, WD);
      c.rect(1, 8, 9, 8, WL); // tray
      c.row(9, 1, 9, WD);
      c.rect(2, 11, 8, 12, W);
      c.row(11, 2, 8, WL);
      c.line(2, 13, 1, 23, W);
      c.line(8, 13, 9, 23, W);
      c.row(18, 2, 8, WD);
      c.row(21, 2, 8, W);
      if (used) {
        c.rect(4, 6, 6, 7, C.white); // a bowl, and what went over the side
        c.row(6, 4, 6, C.bone);
        dots(c, C.bone, [3, 23, 4, 23, 6, 22]);
        c.set(2, 9, C.bone);
      }
    };
    V('highchair', {
      base: 'side',
      side: view(11, 25, highFront(false)),
      used: over('highchair', (c) => {
        c.rect(7, 6, 9, 7, C.white);
        c.row(6, 7, 9, C.bone);
        c.set(11, 9, C.bone);
        dots(c, C.bone, [11, 23, 12, 23, 9, 22]);
      }),
      sideUsed: view(11, 25, highFront(true)),
    });
    // the swivel chair
    const dc = hex('#5a3028');
    const swivelSide = (c) => {
      c.rect(2, 1, 4, 10, dc); // the back, edge on
      c.col(2, 2, 10, L(dc));
      c.clear(2, 1);
      c.rect(4, 9, 10, 9, W); // the arm
      c.rect(9, 10, 10, 11, W);
      c.rect(3, 12, 11, 13, dc);
      c.row(12, 3, 11, L(dc));
      c.rect(6, 14, 7, 17, C.iron);
      c.line(6, 17, 2, 19, C.ironDark);
      c.line(7, 17, 11, 19, C.ironDark);
      c.col(6, 17, 19, C.ironDark);
      dots(c, K, [2, 20, 6, 20, 11, 20]);
    };
    V('desk-chair-old', {
      side: view(14, 22, swivelSide),
      used: turned(14, 22, (c) => A['desk-chair-old'].draw(c)),
      sideUsed: turned(14, 22, swivelSide),
    });
    V('piano-stool', {
      side: view(10, 10, (c) => A['piano-stool'].draw(c)),
      used: turned(10, 10, (c) => A['piano-stool'].draw(c)),
      sideUsed: turned(10, 10, (c) => A['piano-stool'].draw(c), true),
    });
    // the pew
    const pc = hex('#5a3c2a');
    const pewEnd = (used) => (c) => {
      c.poly([[2, 1], [5, 1], [6, 9], [10, 10], [10, 18], [2, 18]], pc);
      c.col(2, 1, 18, L(pc));
      c.row(1, 2, 5, L(pc));
      c.line(4, 4, 4, 15, D(pc));
      c.line(5, 11, 8, 12, D(pc));
      c.col(8, 12, 16, D(pc));
      c.row(16, 4, 8, D(pc));
      c.set(3, 4, C.gold);
      if (used) {
        c.rect(11, 16, 16, 18, red);
        c.row(16, 11, 16, L(red));
      }
    };
    V('bench-church', {
      side: view(12, 20, pewEnd(false)),
      used: over('bench-church', (c) => {
        c.rect(12, 16, 20, 18, red); // a hassock pulled out, a hymn book left on the seat
        c.row(16, 12, 20, L(red));
        c.rect(23, 9, 26, 10, C.black);
        c.row(10, 23, 26, C.paper);
      }),
      sideUsed: view(18, 20, pewEnd(true)),
    });
  }

  /* ---------- desks ---------- */
  /** The end of a pedestal desk; the side you sit at is to the right. open: the top drawer pulled out. */
  function deskSide(c, top, b, col, open) {
    c.rect(1, top, 14, top + 1, L(col));
    c.row(top, 1, 14, L(L(col)));
    c.rect(2, top + 2, 13, b - 1, col);
    c.col(2, top + 2, b - 1, L(col));
    panel(c, 4, top + 4, 11, b - 3, col);
    c.row(b, 2, 13, D(col));
    const n = Math.floor((b - top - 3) / 4);
    for (let i = 0; i < n; i++) if (!(open && i === 0)) c.set(14, top + 4 + i * 4, C.brass);
    if (open) {
      c.rect(14, top + 4, 19, top + 6, L(col));
      c.row(top + 4, 14, 19, L(L(col)));
      c.row(top + 6, 14, 19, col);
      c.set(20, top + 5, C.brass);
      c.rect(15, top + 3, 18, top + 3, C.paper);
      c.set(16, top + 2, C.paper);
    }
  }
  /** In the front view: the top left drawer pulled out, papers in it. */
  function deskDrawerOut(c, col) {
    c.rect(3, 11, 8, 12, mix(col, 0.3));
    c.rect(2, 12, 9, 15, L(col));
    c.row(12, 2, 9, L(L(col)));
    c.row(15, 2, 9, col);
    dots(c, C.brass, [5, 14, 6, 14]);
    c.rect(4, 10, 7, 11, C.paper);
    c.row(11, 4, 7, D(C.paper));
    c.set(8, 11, C.parchment);
  }
  {
    const tidySide = (open) => (c) => {
      deskSide(c, 8, 22, W, open);
      c.rect(3, 1, 6, 2, hex('#3d6a4e')); // the lamp, end on
      c.row(1, 3, 6, hex('#5d8a66'));
      c.row(3, 4, 5, C.glow);
      c.col(5, 4, 6, C.brass);
      c.row(7, 3, 6, C.brass);
      c.rect(9, 5, 12, 7, C.wine);
      c.row(5, 9, 12, L(C.wine));
    };
    V('desk-tidy', {
      side: view(16, 24, tidySide(false)),
      used: over('desk-tidy', (c) => {
        deskDrawerOut(c, W);
        c.rect(13, 5, 21, 6, C.paper); // and a book left open on the blotter
        c.row(4, 13, 21, C.white);
        c.col(17, 4, 6, D(C.paper));
        dots(c, D(C.paper), [14, 5, 15, 5, 19, 5, 20, 5]);
      }),
      sideUsed: view(22, 24, tidySide(true)),
    });
    const cc = hex('#5f4030');
    const clutterSide = (open) => (c) => {
      deskSide(c, 8, 22, cc, open);
      c.rect(2, 4, 7, 7, C.paper);
      c.row(5, 2, 7, D(C.paper));
      c.rect(3, 2, 6, 3, C.parchment);
      c.rect(8, 6, 10, 7, C.navy);
      c.rect(11, 3, 13, 7, C.black);
      c.set(12, 2, C.white);
      c.set(13, 1, C.white);
      if (open) dots(c, C.paper, [16, 21, 17, 21, 18, 22, 19, 22]);
    };
    V('desk-cluttered', {
      side: view(16, 24, clutterSide(false)),
      used: over('desk-cluttered', (c) => {
        deskDrawerOut(c, cc);
        c.rect(1, 16, 4, 16, C.paper); // gone through in a hurry
        c.set(2, 17, C.paper);
        c.rect(19, 21, 23, 22, C.paper);
        c.set(24, 22, C.parchment);
      }),
      sideUsed: view(22, 24, clutterSide(true)),
    });
    // the bureau: its fall is open above; used, it is shut
    const bureauSide = (open) => (c) => {
      c.rect(2, 1, 6, 2, WL);
      c.poly([[2, 3], [6, 3], [9, 9], [9, 13], [2, 13]], W);
      c.col(2, 3, 13, L(W));
      c.line(6, 3, 9, 9, open ? WD : WL);
      c.rect(2, 14, 9, 25, W);
      c.col(2, 14, 25, L(W));
      panel(c, 3, 16, 8, 24, W);
      dots(c, C.brass, [10, 16, 10, 20, 10, 24]);
      legs(c, [2, 8], 26, 26, WD);
      if (open) {
        c.rect(10, 12, 15, 13, WL); // the fall, let down
        c.row(12, 10, 15, L(WL));
        c.row(14, 10, 13, WD);
        c.rect(11, 11, 13, 11, C.paper);
      } else c.line(7, 3, 10, 9, WL);
    };
    V('writing-bureau', {
      side: view(17, 28, bureauSide(true)),
      used: over('writing-bureau', (c) => {
        c.rect(2, 3, 19, 13, WL); // the fall shut over the pigeonholes
        c.row(3, 2, 19, L(WL));
        c.clear(1, 13);
        c.clear(20, 13);
        c.clear(1, 12);
        c.clear(20, 12);
        c.clear(1, 11);
        c.clear(20, 11);
        c.clear(1, 10);
        c.clear(20, 10);
        panel(c, 4, 5, 17, 11, WL);
        c.row(13, 2, 19, D(WL));
        c.set(11, 4, C.brass);
      }),
      sideUsed: view(12, 28, bureauSide(false)),
    });
  }

  /* ---------- doors: from the side a door is its edge in the frame; open, the leaf stands out towards us ---------- */
  /** The frame of a doorway, cut through and seen edge on (4 wide from x). */
  function jambSide(c, fr, x = 1) {
    const b = c.h - 2;
    c.rect(x, 1, x + 3, b, fr);
    c.col(x, 1, b, L(fr));
    c.row(1, x, x + 3, L(fr));
    c.col(x + 3, 2, b, D(fr));
  }
  /** A plain door from the side. state: 'shut' (the edge), 'ajar', 'open' (the whole leaf, its face to us). */
  function doorSide(c, col, state, o = {}) {
    const b = c.h - 2,
      fr = o.frame || mix(col, 0.62),
      kn = o.knob || C.brass;
    jambSide(c, fr);
    if (state === 'shut') {
      c.col(2, 3, b, col); // the edge of the leaf, between the stops
      c.col(3, 3, b, D(col));
      if (o.knob !== false) {
        c.set(5, 19, kn);
        c.set(5, 20, D(kn));
        c.set(0, 19, kn);
        c.set(0, 20, D(kn));
      }
    } else {
      const x1 = state === 'ajar' ? 9 : 18;
      c.col(2, 3, b, NIGHT);
      c.col(3, 3, b, NIGHT);
      if (state === 'ajar') {
        c.rect(4, 3, x1, b, col);
        c.col(4, 3, b, L(col));
        panel(c, 6, 5, x1 - 1, 17, col);
        panel(c, 6, 22, x1 - 1, b - 3, col);
        c.col(x1, 3, b, D(col));
      } else leaf(c, 5, x1, col, { ...o, knob: false });
      if (state !== 'ajar') c.col(4, 3, b, D(col));
      if (o.knob !== false) {
        c.set(x1 - 1, 19, kn);
        c.set(x1 - 1, 20, D(kn));
      }
    }
  }
  const doorShut = (col, o) => view(7, 38, (c) => doorSide(c, col, 'shut', o));
  const doorAjar = (col, o) => view(11, 38, (c) => doorSide(c, col, 'ajar', o));
  const doorOpen = (col, o) => view(20, 38, (c) => doorSide(c, col, 'open', o));
  for (const [k, col] of Object.entries(DOORCOL)) {
    const o = k === 'oak' ? { frame: WD } : k === 'white' ? { frame: hex('#8a8678') } : {};
    const front = (state) => view(20, 38, (c) => door(c, col, state, o));
    V('door-' + k, { side: doorShut(col, o), used: front('open'), sideUsed: doorOpen(col, o) });
    V('door-' + k + '-ajar', { side: doorAjar(col, o), used: front('open'), sideUsed: doorOpen(col, o) });
    if (A['door-' + k + '-open']) V('door-' + k + '-open', { side: doorOpen(col, o), used: front('shut'), sideUsed: doorShut(col, o) });
  }

  /** Cut a hole through whatever is drawn: the pixels inside the shape become see-through. */
  function hole(c, pts) {
    const m = [1, 2, 3];
    c.poly(pts, m);
    for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (c.get(x, y) === m) c.clear(x, y);
  }
  V('door-double', {
    side: doorShut(W, { frame: WD }),
    used: view(36, 38, (c) => A['door-double-open'].draw(c)),
    sideUsed: view(21, 38, (c) => {
      jambSide(c, WD);
      leaf(c, 5, 19, W);
      c.col(4, 3, 36, D(W));
    }),
  });
  V('door-double-open', {
    side: view(21, 38, (c) => {
      jambSide(c, WD);
      leaf(c, 5, 19, W);
      c.col(4, 3, 36, D(W));
    }),
    used: view(36, 38, (c) => A['door-double'].draw(c)),
    sideUsed: doorShut(W, { frame: WD }),
  });
  {
    const col = hex('#9c9684'),
      fr = hex('#7a7566');
    V('door-glass', {
      side: doorShut(col, { frame: fr }),
      used: view(20, 38, (c) => {
        door(c, col, 'open', { frame: fr });
        c.col(4, 5, 31, hex('#3d5560')); // the panes of the leaf, edge on
      }),
      sideUsed: view(20, 38, (c) => {
        jambSide(c, fr);
        c.rect(5, 3, 18, 36, col);
        c.col(5, 3, 36, L(col));
        for (let j = 0; j < 4; j++)
          for (let i = 0; i < 2; i++) {
            const x = 7 + i * 6,
              y = 5 + j * 7;
            hole(c, [[x, y], [x + 4, y], [x + 4, y + 5], [x, y + 5]]); // you see through the glass
            c.line(x + 1, y + 3, x + 3, y + 1, C.glassLight);
          }
        panel(c, 7, 33, 17, 35, col);
        dots(c, C.brass, [17, 19, 17, 20]);
        c.col(4, 3, 36, D(col));
      }),
    });
    // the cell door
    const cellSide = (open) => (c) => {
      jambSide(c, C.stoneDark);
      for (let y = 5; y < 36; y += 6) c.set(1, y, D(C.stoneDark));
      if (open) {
        c.col(2, 3, 36, NIGHT);
        c.col(3, 3, 36, NIGHT);
        for (let x = 5; x <= 17; x += 3) {
          c.col(x, 3, 36, C.iron); // the barred leaf, standing out
          c.set(x, 4, C.steel);
          for (let y = 6; y < 36; y += 5) c.set(x, y, C.steel);
        }
        c.row(8, 5, 17, C.iron);
        c.row(30, 5, 17, C.iron);
        c.rect(15, 17, 18, 22, C.ironDark);
        c.frame(15, 17, 18, 22, C.iron);
      } else {
        c.col(2, 3, 36, C.iron);
        c.col(3, 3, 36, C.ironDark);
        c.rect(5, 17, 5, 22, C.ironDark); // the lock plate
        c.set(0, 19, C.iron);
      }
    };
    V('door-cell', {
      side: view(7, 38, cellSide(false)),
      used: view(20, 38, (c) => cellDoor(c, true)),
      sideUsed: view(20, 38, cellSide(true)),
    });
    V('door-cell-open', {
      side: view(20, 38, cellSide(true)),
      used: view(20, 38, (c) => cellDoor(c, false)),
      sideUsed: view(7, 38, cellSide(false)),
    });
    // the iron door
    const ic = C.iron;
    V('door-iron-riveted', {
      side: view(8, 38, (c) => {
        jambSide(c, C.ironDark);
        c.col(2, 3, 36, L(ic));
        c.col(3, 3, 36, ic);
        c.rect(5, 18, 5, 21, C.ironDark); // the wheel, edge on
        c.set(6, 19, C.steel);
        c.set(6, 20, C.ironDark);
        c.set(0, 19, C.ironDark);
      }),
      used: view(20, 38, (c) => {
        jamb(c, C.ironDark);
        beyond(c, 3, 16);
        c.rect(3, 3, 6, 36, ic); // a hand's breadth of iron, swung in
        c.col(3, 3, 36, L(ic));
        c.col(6, 3, 36, C.ironDark);
        for (const y of [4, 13, 15, 24, 26, 35]) c.set(4, y, C.steel);
        c.rect(7, 18, 7, 21, C.ironDark);
        c.set(8, 19, C.steel);
        c.speckle(3, 26, 6, 36, C.rust, 5, 8);
      }),
      sideUsed: view(20, 38, (c) => {
        jambSide(c, C.ironDark);
        c.rect(5, 3, 18, 36, ic);
        c.col(5, 3, 36, L(ic));
        for (const y of [3, 14, 25, 36]) c.row(y, 5, 18, y === 36 ? C.ironDark : L(ic));
        for (const y of [4, 13, 15, 24, 26, 35]) for (let x = 6; x <= 18; x += 3) c.set(x, y, C.steel);
        c.oval(9, 17, 14, 22, C.ironDark);
        c.oval(10, 18, 13, 21, ic);
        dots(c, C.steel, [11, 19, 12, 20]);
        c.speckle(5, 26, 18, 36, C.rust, 6, 8);
        c.col(4, 3, 36, C.ironDark);
      }),
    });
    // boarded up; used, the boards are off
    const bd = hex('#553828');
    V('door-boarded', {
      side: view(9, 38, (c) => {
        jambSide(c, mix(bd, 0.62), 2);
        c.col(3, 3, 36, bd);
        c.col(4, 3, 36, D(bd));
        for (const [y, col] of [[5, WP], [15, blend(WP, C.stone, 0.4)], [24, C.woodLight], [31, WP]]) {
          c.rect(6, y, 6, y + 2, col); // the ends of the planks, nailed across both jambs
          c.set(7, y + 1, C.ironDark);
        }
      }),
      used: view(22, 38, (c) => {
        c.rect(2, 1, 19, 36, mix(bd, 0.62));
        c.row(1, 2, 19, bd);
        leaf(c, 4, 17, bd, { knob: false });
        dots(c, C.ironDark, [2, 7, 19, 5, 2, 15, 19, 18, 2, 26, 19, 24, 3, 32, 19, 33]); // where the nails were
        c.poly([[1, 24], [4, 23], [8, 35], [5, 36]], C.woodLight); // one still hanging by a nail
        nail(c, 2, 25);
        c.rect(7, 35, 20, 36, WP); // the rest on the floor
        c.row(35, 7, 20, L(WP));
        c.poly([[9, 31], [20, 33], [20, 34], [9, 33]], blend(WP, C.stone, 0.4));
      }),
      sideUsed: view(17, 38, (c) => {
        jambSide(c, mix(bd, 0.62), 2);
        c.col(3, 3, 36, bd);
        c.col(4, 3, 36, D(bd));
        dots(c, C.ironDark, [6, 6, 6, 16, 6, 25, 6, 32]);
        c.line(7, 27, 10, 36, C.woodLight);
        c.line(8, 27, 11, 36, D(C.woodLight));
        c.rect(8, 35, 15, 36, WP);
        c.row(35, 8, 15, L(WP));
      }),
    });
    // smashed; used, what is left of it swings open
    const bk = hex('#5a3d2c');
    V('door-broken', {
      side: view(7, 38, (c) => {
        doorSide(c, bk, 'shut', { frame: WD });
        c.clearRect(2, 10, 3, 21);
        c.rect(2, 10, 3, 21, NIGHT);
        dots(c, WP, [5, 9, 5, 12, 0, 15, 5, 16, 0, 22, 5, 23, 5, 35, 5, 36]); // splinters
      }),
      used: view(20, 38, (c) => {
        door(c, bk, 'open', { frame: WD });
        c.rect(4, 9, 5, 22, NIGHT);
        dots(c, WP, [4, 8, 5, 9, 4, 23, 5, 22, 6, 12, 6, 18]);
        dots(c, WP, [7, 35, 8, 36, 11, 36, 14, 35, 15, 36, 10, 34]);
      }),
      sideUsed: view(20, 38, (c) => {
        doorSide(c, bk, 'open', { frame: WD });
        hole(c, [[8, 10], [12, 7], [16, 9], [17, 15], [14, 22], [10, 24], [7, 18]]);
        for (const [x0, y0, x1, y1] of [[7, 9, 9, 12], [17, 8, 15, 11], [18, 16, 15, 16], [6, 19, 9, 18], [10, 26, 11, 22], [15, 24, 14, 21]]) c.line(x0, y0, x1, y1, WP);
        dots(c, WP, [7, 35, 8, 36, 13, 36]);
      }),
    });
    // chained; used, the chain hangs loose and the door stands ajar
    const cd = hex('#3a2a2c');
    const links = (c, x, y0, y1) => {
      for (let y = y0; y <= y1; y++) c.set(x, y, (y - y0) % 2 ? C.steel : C.iron);
    };
    V('door-chained', {
      side: view(7, 38, (c) => {
        doorSide(c, cd, 'shut');
        dots(c, C.steel, [5, 13, 0, 13, 5, 16, 0, 22, 5, 22, 0, 17]);
        dots(c, C.iron, [5, 14, 5, 23, 0, 14, 0, 23]);
        c.rect(5, 17, 5, 19, C.brass); // the padlock
        c.set(6, 18, C.brass);
      }),
      used: view(20, 38, (c) => {
        door(c, cd, 'ajar');
        links(c, 1, 12, 30);
        links(c, 2, 24, 33);
        links(c, 18, 13, 27);
        dots(c, C.ironDark, [1, 12, 18, 13]);
        c.rect(14, 34, 16, 36, C.brass); // the padlock on the floor, open
        c.row(34, 14, 16, L(C.brass));
        dots(c, C.steel, [14, 33, 14, 32, 15, 31]);
      }),
      sideUsed: view(11, 38, (c) => {
        doorSide(c, cd, 'ajar');
        links(c, 0, 13, 28);
        c.rect(5, 35, 6, 36, C.brass);
      }),
    });
    // bloody; used, it has been opened and something dragged through
    const wc = DOORCOL.white,
      wf = hex('#8a8678');
    V('door-bloody', {
      side: view(7, 38, (c) => {
        doorSide(c, wc, 'shut', { frame: wf });
        dots(c, C.blood, [5, 21, 4, 12, 4, 13, 4, 14, 4, 15, 5, 36, 4, 30]);
      }),
      used: view(20, 38, (c) => {
        door(c, wc, 'open', { frame: wf });
        dots(c, C.blood, [4, 11, 4, 12, 5, 12, 4, 14, 3, 15, 4, 18, 5, 21]);
        c.row(36, 6, 14, C.blood); // the trail over the threshold
        c.row(35, 8, 12, D(C.blood));
        dots(c, C.blood, [15, 36, 6, 35, 13, 34, 10, 34]);
      }),
      sideUsed: view(20, 38, (c) => {
        doorSide(c, wc, 'open', { frame: wf });
        const bl = C.blood;
        c.rect(10, 12, 13, 15, bl);
        for (const x of [9, 11, 12, 14]) c.col(x, 9, 12, bl);
        c.set(8, 13, bl);
        c.line(12, 16, 11, 27, bl);
        c.line(13, 16, 13, 24, D(bl));
        dots(c, bl, [11, 29, 11, 31, 15, 20, 7, 24, 14, 35, 13, 36, 15, 36, 17, 19]);
      }),
    });
    // the nursery door
    const nc = hex('#b08f8c'),
      nf = hex('#8f8676'),
      bare = hex('#7a5a44');
    V('door-nursery', {
      side: view(7, 38, (c) => {
        doorSide(c, nc, 'shut', { frame: nf, knob: C.white });
        for (const y of [29, 26, 24, 21]) c.set(4, y, K);
      }),
      used: view(20, 38, (c) => {
        door(c, nc, 'open', { frame: nf });
        c.set(5, 20, C.white);
        for (const y of [29, 26, 24, 21, 19]) {
          c.set(17, y, K);
          c.set(18, y, K);
        }
        c.set(18, 23, C.blood);
        dots(c, bare, [4, 8, 4, 27, 4, 28]);
      }),
      sideUsed: view(20, 38, (c) => {
        doorSide(c, nc, 'open', { frame: nf, knob: C.white });
        c.poly([[7, 27], [10, 26], [11, 30], [8, 31]], bare);
        c.rect(14, 7, 15, 9, bare);
        c.set(16, 8, bare);
        c.rect(6, 4, 7, 5, bare);
        dots(c, C.white, [11, 31, 9, 32, 14, 10]);
        dots(c, C.mustard, [10, 12, 12, 11, 11, 13]);
      }),
    });
    // the church door in its arch
    const ac = hex('#5a3d2a');
    const archSide = (open) => (c) => {
      const st = C.stone;
      c.rect(1, 3, 6, 40, st);
      c.rect(2, 1, 5, 2, st);
      c.col(1, 3, 40, L(st));
      for (let y = 10; y < 40; y += 6) dots(c, D(st), [1, y, 2, y, 5, y + 3, 6, y + 3]);
      if (open) {
        c.rect(3, 6, 4, 40, NIGHT);
        c.oval(7, 3, 24, 26, ac); // the leaf, standing out
        c.rect(7, 14, 24, 40, ac);
        for (let x = 10; x < 24; x += 3) c.col(x, 4, 40, D(ac));
        c.col(7, 12, 40, L(ac));
        for (const y of [12, 32]) {
          c.row(y, 7, 20, C.ironDark);
          c.set(21, y - 1, C.ironDark);
          c.set(21, y + 1, C.ironDark);
        }
        for (let y = 8; y < 40; y += 4) for (let x = 9; x < 24; x += 6) if (y !== 12 && y !== 32) c.set(x + ((y / 4) % 2) * 3, y, C.iron);
        c.oval(19, 21, 22, 24, C.ironDark);
        c.rect(20, 22, 21, 23, ac);
      } else {
        c.rect(3, 6, 4, 40, ac);
        c.col(4, 6, 40, D(ac));
        c.rect(7, 21, 7, 24, C.ironDark); // the ring
        dots(c, C.ironDark, [5, 12, 5, 32]);
      }
    };
    V('door-arched', {
      side: view(9, 42, archSide(false)),
      used: over('door-arched', (c) => {
        c.oval(3, 3, 20, 26, NIGHT);
        c.rect(3, 14, 20, 40, NIGHT);
        c.row(40, 3, 20, hex('#2c2834'));
        c.row(39, 4, 20, GLOOM);
        c.rect(3, 9, 5, 40, D(ac)); // the leaf swung in, edge on
        c.col(3, 9, 40, ac);
        c.set(4, 8, D(ac));
        dots(c, C.ironDark, [4, 12, 5, 12, 4, 32, 5, 32, 6, 22, 6, 23]);
      }),
      sideUsed: view(27, 42, archSide(true)),
    });
  }
  {
    // trapdoor and cellar hatch
    const trapSide = (open) => (c) => {
      const b = c.h - 2;
      if (open) {
        c.poly([[4, b - 8], [19, b - 8], [22, b], [1, b]], NIGHT); // the hole
        c.row(b - 8, 4, 19, WD);
        c.poly([[1, 2], [3, 1], [5, b - 8], [2, b - 8]], W); // the lid stood up on its hinges, edge on
        c.line(1, 2, 2, b - 8, WL);
        dots(c, C.iron, [4, 6, 4, 7]);
        c.col(13, b - 11, b - 3, WP); // the ladder coming up
        c.col(14, b - 11, b - 3, D(WP));
        dots(c, WL, [12, b - 9, 15, b - 9, 12, b - 6, 15, b - 6]);
      } else {
        c.poly([[4, 1], [19, 1], [22, 8], [1, 8]], W);
        c.line(4, 1, 19, 1, WL);
        c.row(3, 4, 19, WD); // the boards run across, seen from this side
        c.row(5, 3, 20, WD);
        c.row(8, 1, 22, WD);
        c.line(8, 1, 6, 8, D(W)); // battens
        c.line(15, 1, 17, 8, D(W));
        c.rect(18, 4, 19, 5, C.iron);
        dots(c, C.ironDark, [3, 3, 2, 6]);
      }
    };
    V('trapdoor-closed', {
      side: view(24, 10, trapSide(false)),
      used: view(24, 24, (c) => A['trapdoor-open'].draw(c)),
      sideUsed: view(24, 24, trapSide(true)),
    });
    V('trapdoor-open', {
      side: view(24, 24, trapSide(true)),
      used: view(24, 10, (c) => A['trapdoor-closed'].draw(c)),
      sideUsed: view(24, 10, trapSide(false)),
    });
    const hatchSide = (open) => (c) => {
      const st = C.stone,
        col = hex('#5a5a48');
      c.rect(1, 12, 16, 14, st); // kerb
      c.row(12, 1, 16, L(st));
      c.poly([[2, 4], [4, 4], [15, 11], [2, 11]], st); // the cheek wall under the sloping doors
      c.col(2, 4, 11, L(st));
      dots(c, D(st), [4, 8, 5, 8, 8, 10, 9, 10]);
      if (open) {
        c.line(3, 3, 15, 10, NIGHT);
        c.line(3, 4, 15, 11, NIGHT);
        c.poly([[3, 5], [15, 12], [15, 14], [3, 8]], col); // the near door, thrown over towards us
        c.line(3, 5, 15, 12, L(col));
        dots(c, C.ironDark, [5, 7, 12, 12]);
        c.poly([[3, 0], [15, 7], [15, 9], [3, 2]], D(col)); // the far one, standing up beyond
      } else {
        c.line(3, 2, 15, 9, L(col));
        c.line(3, 3, 15, 10, col);
        c.line(3, 4, 15, 11, D(col));
        dots(c, C.ironDark, [5, 4, 12, 8]);
        c.speckle(2, 2, 15, 11, C.moss, 9, 4);
      }
    };
    V('cellar-hatch', {
      side: view(18, 16, hatchSide(false)),
      used: view(30, 16, (c) => cellarHatch(c, true)),
      sideUsed: view(18, 16, hatchSide(true)),
    });
    V('cellar-hatch-open', {
      side: view(18, 16, hatchSide(true)),
      used: view(30, 16, (c) => cellarHatch(c, false)),
      sideUsed: view(18, 16, hatchSide(false)),
    });
  }
  {
    // curtains in doorways
    const dr = hex('#6e2228');
    const curtSide = (shut) => (c) => {
      jambSide(c, WD, 2);
      c.rect(1, 2, 8, 5, dr); // pelmet
      c.row(2, 1, 8, L(dr));
      dots(c, C.gold, [1, 6, 4, 6, 7, 6]);
      if (shut) {
        c.rect(6, 6, 8, 36, dr);
        c.col(6, 6, 36, L(dr));
        c.col(8, 6, 36, D(dr));
      } else {
        c.poly([[6, 6], [9, 6], [8, 16], [6, 22], [8, 36], [6, 36]], dr);
        c.line(8, 7, 7, 20, D(dr));
        c.row(22, 6, 7, C.gold);
      }
    };
    V('curtain-doorway', {
      side: view(11, 38, curtSide(false)),
      used: view(24, 38, (c) => {
        jamb(c, WD);
        c.rect(3, 6, 20, 36, dr); // drawn shut
        for (let x = 4; x <= 20; x += 2) c.col(x, 6, 36, x % 4 ? D(dr) : L(dr));
        c.col(11, 6, 36, mix(dr, 0.45));
        c.col(12, 6, 36, mix(dr, 0.45));
        c.rect(2, 2, 21, 5, dr);
        c.row(2, 2, 21, L(dr));
        for (let x = 2; x <= 21; x += 3) c.set(x + 1, 6, C.gold);
        c.row(36, 3, 20, D(dr));
      }),
      sideUsed: view(11, 38, curtSide(true)),
    });
    const bc = [C.mustard, hex('#8a4a3a'), C.teal, C.bone, hex('#7a5a8a')];
    const strand = (c, x0, y0, x1, y1, k) => {
      const n = y1 - y0;
      for (let i = 0; i <= n; i++) c.set(x0 + ((x1 - x0) * i) / n, y0 + i, i % 3 === 0 ? bc[(k + ((i / 3) | 0)) % 5] : mix(bc[k % 5], 0.45));
    };
    V('bead-curtain', {
      side: view(8, 38, (c) => {
        jambSide(c, WD);
        strand(c, 5, 3, 5, 34, 2);
        strand(c, 2, 3, 2, 33, 0);
      }),
      used: view(20, 38, (c) => {
        jamb(c, WD);
        beyond(c, 3, 16);
        [3, 4, 5, 6, 7].forEach((x, i) => strand(c, x, 3, 3 + (i >> 1), 33 + (i % 2) * 2, i)); // pushed apart, still swinging
        [16, 15, 14, 13, 12].forEach((x, i) => strand(c, x, 3, 16 - (i >> 1), 33 + (i % 2) * 2, i + 2));
        strand(c, 9, 3, 6, 30, 1);
        strand(c, 10, 3, 13, 31, 3);
      }),
      sideUsed: view(13, 38, (c) => {
        jambSide(c, WD);
        strand(c, 5, 3, 10, 31, 2);
        strand(c, 5, 3, 7, 33, 4);
        strand(c, 2, 3, 2, 33, 0);
      }),
    });
    V('archway-stone', {
      side: view(11, 42, (c) => {
        const st = C.stone;
        c.rect(1, 4, 9, 40, st);
        c.rect(2, 2, 8, 3, st);
        c.rect(3, 1, 7, 1, L(st));
        c.col(1, 4, 40, L(st));
        for (let y = 9; y < 40; y += 5) {
          c.row(y, 1, 4, D(st));
          c.row(y + 2, 6, 9, D(st));
        }
        c.speckle(1, 26, 9, 40, C.moss, 6, 3);
      }),
    });
    V('archway-wood', {
      side: view(6, 38, (c) => {
        jambSide(c, W);
        dots(c, WD, [2, 14, 3, 26, 2, 9]);
      }),
    });
    // gates
    const gc = hex('#8f8a78');
    const pickets = (c) => {
      for (let x = 4; x <= 18; x += 3) {
        const t = 3 + Math.abs(x - 11) / 4;
        c.rect(x, Math.round(t) + 1, x + 1, 15, gc);
        c.set(x, Math.round(t), gc);
        c.col(x, Math.round(t), 15, L(gc));
      }
      c.row(7, 3, 20, D(gc));
      c.row(13, 3, 20, D(gc));
      c.line(4, 13, 19, 7, mix(gc, 0.55));
      c.speckle(3, 3, 20, 15, C.moss, 14, 6);
    };
    const post = (c, x) => {
      c.rect(x, 2, x + 1, 16, WD);
      c.set(x, 1, W);
    };
    const gateSide = (open) => (c) => {
      post(c, 1);
      if (open) {
        pickets(c);
        c.set(20, 9, C.iron);
      } else {
        c.rect(3, 4, 4, 15, gc);
        c.col(3, 4, 15, L(gc));
        c.set(3, 3, gc);
        c.set(5, 9, C.iron);
      }
    };
    V('garden-gate', {
      side: view(7, 18, gateSide(false)),
      used: view(24, 18, (c) => {
        post(c, 1);
        post(c, 21);
        c.rect(3, 4, 5, 15, gc); // swung towards us, edge on
        c.col(3, 4, 15, L(gc));
        c.col(5, 4, 15, D(gc));
        c.set(4, 3, gc);
        c.set(6, 9, C.iron);
        c.set(20, 9, C.iron);
        c.set(4, 16, C.moss);
      }),
      sideUsed: view(22, 18, gateSide(true)),
    });
    const bare = { outline: false, shade: false };
    const ironLeaf = (c, x0, x1, step, flip) => {
      const b = c.h - 2;
      for (let x = x0; x <= x1; x += step) {
        const t = flip ? (x - x0) / (x1 - x0) : 1 - (x - x0) / (x1 - x0);
        ironBar(c, x, 6 - Math.round(t * 3), b);
      }
      for (const y of [9, b - 5]) {
        c.row(y, x0, x1 + 1, C.iron);
        c.row(y + 1, x0, x1 + 1, K);
      }
    };
    const wroughtSide = (open) => (c) => {
      const b = c.h - 2;
      if (open) {
        ironLeaf(c, 1, 13, 4, false); // a leaf, standing out towards us
        dots(c, C.iron, [3, 12, 4, 13, 7, 12, 8, 13, 11, 12, 12, 13]);
      } else {
        c.rect(1, 2, 2, b, C.iron);
        c.col(3, 2, b, K);
        c.col(0, 3, b, K);
        c.set(1, 1, C.steel);
        c.set(1, 0, C.iron);
        c.rect(1, 20, 2, 23, C.ironDark);
      }
      c.speckle(0, 0, c.w - 1, b, C.rust, 12, 5);
    };
    V('gate-wrought', {
      side: view(4, 42, wroughtSide(false), bare),
      used: view(36, 42, (c) => wroughtGate(c, true), bare),
      sideUsed: view(16, 42, wroughtSide(true), bare),
    });
    V('gate-wrought-open', {
      side: view(16, 42, wroughtSide(true), bare),
      used: view(34, 42, (c) => wroughtGate(c, false), bare),
      sideUsed: view(4, 42, wroughtSide(false), bare),
    });
  }

  /* ---------- windows: flat on the wall, so from the side only the frame and its sill ---------- */
  {
    const fr = hex('#8a8474'),
      lit = hex('#c9a04a'),
      gone = hex('#0e0d14');
    /** The frame edge on at x0, the glass a sliver in it, the sill standing out to the right. */
    const winSide = (c, glass, x0 = 1) => {
      c.rect(x0, 1, x0 + 2, 19, fr);
      c.col(x0, 1, 19, L(fr));
      c.row(1, x0, x0 + 2, L(fr));
      c.col(x0 + 1, 3, 17, glass);
      c.set(x0 + 1, 10, fr);
      c.rect(x0, 19, x0 + 4, 20, L(fr));
      c.row(20, x0, x0 + 4, D(fr));
    };
    const side = (glass, extra) =>
      view(7, 22, (c) => {
        winSide(c, glass);
        if (extra) extra(c);
      });
    const front = (slug) => view(A[slug].w, A[slug].h, (c) => A[slug].draw(c));
    V('window-frame-lit', { side: side(lit), used: front('window-frame-dark'), sideUsed: side(NIGHTGLASS) });
    V('window-frame-dark', { side: side(NIGHTGLASS), used: front('window-frame-lit'), sideUsed: side(lit) });
    V('window-frame-broken', {
      side: side(NIGHTGLASS, (c) => {
        c.set(2, 6, gone);
        c.set(2, 7, gone);
        c.set(2, 13, gone);
        dots(c, C.glassLight, [4, 6, 4, 13, 0, 9, 4, 18, 5, 18]);
      }),
      used: view(20, 22, (c) => {
        win(c, gone); // the last of the glass knocked out, the bars with it
        c.rect(9, 3, 10, 17, gone);
        c.rect(3, 9, 16, 10, gone);
        c.rect(9, 3, 10, 4, fr);
        c.rect(9, 16, 10, 17, fr);
        c.rect(3, 9, 4, 10, fr);
        c.set(15, 10, fr);
        c.set(16, 10, fr);
        dots(c, C.glass, [3, 3, 4, 3, 3, 4, 16, 3, 16, 4, 16, 17, 15, 17, 3, 17, 3, 16, 5, 17]);
        dots(c, C.glassLight, [5, 19, 8, 20, 11, 19, 14, 20, 15, 19, 4, 20]);
      }),
      sideUsed: side(gone, (c) => dots(c, C.glassLight, [4, 18, 5, 18, 3, 18])),
    });
    const g = hex('#9eaaa4');
    V('window-frame-face', {
      side: view(9, 22, (c) => {
        winSide(c, NIGHTGLASS, 3);
        c.rect(1, 6, 2, 13, g); // a pale head against the far side of the glass
        c.set(1, 5, g);
        c.clear(1, 13);
        dots(c, K, [2, 8, 2, 11]);
        c.set(2, 16, g);
      }),
      used: view(20, 22, (c) => {
        win(c, NIGHTGLASS, { cb: nightPane(c) });
        c.rect(7, 6, 12, 9, hex('#3a4660')); // nobody there: breath on the glass, and the marks of fingers
        c.rect(8, 5, 11, 5, hex('#3a4660'));
        c.col(9, 3, 17, fr);
        c.col(10, 3, 17, fr);
        c.row(10, 3, 16, fr);
        dots(c, mix(g, 0.6), [4, 16, 5, 15, 6, 16, 5, 17, 13, 16, 14, 15, 15, 16]);
      }),
      sideUsed: view(9, 22, (c) => winSide(c, NIGHTGLASS, 3)),
    });
    const sg = hex('#48604c');
    const louvre = (c, x0, x1) => {
      c.rect(x0, 2, x1, 18, sg);
      for (let y = 3; y < 18; y += 2) c.row(y, x0 + 1, x1 - 1, D(sg));
      c.col(x0, 2, 18, L(sg));
      c.row(10, x0, x1, sg);
    };
    V('window-frame-shutters', {
      side: side(sg, (c) => {
        c.col(4, 2, 18, sg);
        c.col(3, 2, 18, D(sg));
      }),
      used: view(38, 22, (c) => {
        const t = canvas(20, 22);
        win(t, NIGHTGLASS, { cb: nightPane(t) });
        c.stamp(t, 9, 0);
        louvre(c, 1, 8); // folded back against the wall
        louvre(c, 29, 36);
        dots(c, C.ironDark, [9, 5, 9, 15, 28, 5, 28, 15]);
      }),
      sideUsed: view(14, 22, (c) => {
        winSide(c, NIGHTGLASS);
        louvre(c, 4, 12); // a shutter standing out from the wall
      }),
    });
    const dr = hex('#5c4a5a');
    V('window-frame-curtains', {
      side: side(dr),
      used: view(20, 22, (c) => {
        win(c, lit, {
          cb(x, y) {
            c.rect(x, y, x + 5, y + 1, hex('#d9bc66'));
          },
        });
        for (const [x0, x1] of [[3, 5], [14, 16]]) {
          c.rect(x0, 3, x1, 17, dr); // the curtains drawn back
          c.col(x0 + 1, 3, 17, D(dr));
          c.col(x0, 3, 17, x0 < 9 ? L(dr) : dr);
        }
      }),
      sideUsed: side(lit),
    });
  }

  /* ---------- stairs and ladders ---------- */
  {
    // the wooden staircase, drawn from the side above: from the front it runs up and away
    const front = (broken) => (c) => {
      const b = 42,
        w = 30;
      for (let i = 0; i < 8; i++) {
        const y = b - i * 4,
          x0 = 5 + (i >> 1),
          x1 = w - 6 - (i >> 1);
        c.rect(x0, y - 2, x1, y, mix(W, 1 - i * 0.05));
        c.row(y - 3, x0 - 1, x1 + 1, L(WL));
      }
      for (const m of [0, 1]) {
        const X = (x) => (m ? w - 1 - x : x);
        c.rect(X(m ? 3 : 2), b - 16, X(m ? 2 : 3), b, WD); // newel
        c.col(X(m ? 3 : 2), b - 16, b, W);
        c.row(b - 17, X(m ? 3 : 2), X(m ? 2 : 3), W);
        c.line(X(3), b - 14, X(8), 3, WL); // handrail, running up and in
        c.line(X(3), b - 13, X(8), 4, W);
        for (let i = 1; i < 8; i++) c.col(X(3 + Math.round((i * 5) / 8)), b - 12 - Math.round((i * 25) / 8), b - i * 4 - 4, WD);
        c.rect(X(m ? 9 : 8), 1, X(m ? 8 : 9), 11, WD);
      }
      if (broken) {
        c.rect(11, 27, 18, 29, NIGHT); // a tread gone through
        dots(c, WP, [10, 27, 19, 27, 12, 30, 17, 26, 13, 26, 16, 30]);
        c.line(18, 27, 20, 30, WP);
      }
    };
    V('staircase-up', {
      base: 'side',
      side: view(30, 44, front(false)),
      used: over('staircase-up', (c) => {
        c.clearRect(13, 27, 14, 27);
        c.rect(14, 27, 17, 29, NIGHT);
        dots(c, WP, [13, 26, 18, 26, 15, 30]);
        c.line(17, 28, 19, 31, WP);
      }),
      sideUsed: view(30, 44, front(true)),
    });
    // the way down to the cellar; used, there is a light below
    const downSide = (lit) => (c) => {
      jambSide(c, C.stoneDark);
      for (let y = 6; y < 36; y += 6) dots(c, D(C.stoneDark), [1, y, 2, y + 3]);
      c.col(4, 3, 36, lit ? hex('#6a4a22') : NIGHT);
      if (lit) c.col(4, 3, 14, NIGHT);
      c.col(5, 22, 34, mix(WD, 0.8)); // the end of the handrail
      c.set(6, 21, mix(WD, 0.8));
    };
    V('staircase-down', {
      side: view(8, 38, downSide(false)),
      used: over('staircase-down', (c) => {
        c.oval(8, 7, 17, 16, hex('#3a2a20')); // somebody down there with a lamp
        c.oval(10, 9, 15, 15, hex('#6a4a22'));
        c.rect(12, 11, 13, 13, hex('#a8742c'));
        c.set(12, 12, C.flameLight);
        c.rect(9, 15, 16, 16, mix(C.stone, 0.26));
        c.row(16, 9, 16, hex('#6a5a3a')); // its light on the lowest steps
        c.row(19, 8, 17, hex('#5a5040'));
      }),
      sideUsed: view(8, 38, downSide(true)),
    });
    // the grand staircase
    const red = hex('#7a2228'),
      mud = mix(C.earth, 0.55);
    const carpetSide = (used) => (c) => {
      const b = 44,
        n = 10,
        xe = 3 + n * 4 - 1,
        X = (i) => 3 + i * 4,
        Y = (i) => b - 3 * (i + 1) + 1;
      for (let i = 0; i < n; i++) c.rect(X(i), Y(i), xe, b, W);
      for (let i = 0; i < n; i++) {
        c.row(Y(i), X(i) - 1, X(i) + 3, L(red)); // the runner over each tread
        c.col(X(i), Y(i) + 1, Y(i) + 2, red);
        c.set(X(i) + 1, Y(i) + 1, C.gold);
        if (used && i % 2 === 0) c.rect(X(i) + 1, Y(i), X(i) + 2, Y(i), mud);
      }
      c.line(5, b - 1, xe - 2, b - 3 * n + 5, D(W));
      for (let i = 2; i < n; i += 2) c.col(X(i) + 1, b - 3 * i + 4, b, D(W));
      c.row(b, 3, xe, D(W));
      c.rect(1, b - 18, 3, b, WD); // newel with its ball
      c.col(1, b - 18, b, W);
      c.oval(0, b - 22, 4, b - 18, W);
      c.set(2, b - 21, WL);
      c.rect(xe - 2, 3, xe, Y(n - 1) - 1, WD);
      c.line(4, b - 16, xe - 3, 5, W);
      c.line(4, b - 15, xe - 3, 6, WD);
      for (let i = 1; i < n; i++) c.col(X(i) + 1, Math.round(b - 15 + ((6 - (b - 15)) * (X(i) - 3)) / (xe - 7)) + 1, Y(i) - 1, WD);
    };
    V('staircase-carpet', {
      side: view(44, 46, carpetSide(false)),
      used: over('staircase-carpet', (c) => {
        for (let i = 0; i < 9; i++) {
          const x = i % 2 ? 21 : 25,
            y = 44 - i * 3;
          c.rect(x, y - 2, x + 1, y - 2, mud); // muddy feet, all the way up
          if (i < 6) c.set(x, y - 1, mud);
        }
        dots(c, mud, [19, 44, 27, 44, 23, 43]);
      }),
      sideUsed: view(44, 46, carpetSide(true)),
    });
    // ladders
    const lc = hex('#8a6a48');
    const lean = (c, col, x0 = 9) => {
      c.line(x0, 42, x0 - 7, 1, col);
      c.line(x0 + 1, 42, x0 - 6, 1, D(col));
      for (let y = 39; y > 2; y -= 5) c.set(x0 - 1 - Math.round(((42 - y) * 7) / 41), y, L(col));
    };
    V('ladder-wood', {
      side: view(13, 44, (c) => lean(c, lc)),
      used: turned(12, 44, (c) => A['ladder-wood'].draw(c)),
      sideUsed: view(12, 18, (c) => {
        c.col(2, 2, 15, lc); // flat on the floor, its foot towards us
        c.col(9, 2, 15, D(lc));
        for (let y = 4; y < 15; y += 3) c.row(y, 3, 8, L(lc));
        c.col(3, 2, 15, D(lc));
      }),
    });
    V('ladder-broken', {
      used: turned(14, 44, (c) => A['ladder-broken'].draw(c)), // and now it has come down altogether
      sideUsed: view(14, 18, (c) => {
        const col = hex('#7a5c40');
        c.col(2, 2, 15, col);
        c.col(9, 9, 15, D(col));
        c.col(3, 2, 15, D(col));
        for (const y of [4, 10, 13]) c.row(y, 4, 8, L(col));
        c.line(4, 7, 7, 8, L(col));
        dots(c, WP, [9, 8, 10, 7]);
        c.rect(10, 14, 12, 15, col);
      }),
      side: view(15, 44, (c) => {
        const col = hex('#7a5c40');
        lean(c, col);
        c.clearRect(3, 1, 7, 17);
        c.line(5, 18, 3, 6, col); // only one rail goes on up
        dots(c, WP, [6, 18, 7, 17, 5, 5]);
        c.line(7, 12, 10, 16, D(col));
        c.rect(11, 41, 13, 42, col);
        c.set(13, 40, WP);
      }),
    });
    const aFrame = (col, skip) => (c) => {
      c.line(2, 28, 6, 2, col); // the side you climb
      c.line(3, 28, 7, 2, D(col));
      c.line(12, 28, 8, 3, D(col)); // the prop
      c.rect(5, 1, 9, 1, L(col));
      c.row(16, 6, 10, D(col));
      for (let y = 25, i = 0; y > 3; y -= 5, i++) if (i !== skip) c.row(y, 3 + Math.round(((28 - y) * 4) / 26), 5 + Math.round(((28 - y) * 4) / 26), L(col));
    };
    for (const [slug, col, skip] of [['step-ladder', lc, -1], ['stepladder-old', hex('#6a5038'), 3]])
      V(slug, {
        side: view(14, 30, aFrame(col, skip)),
        used: turned(12, 30, (c) => A[slug].draw(c)),
        sideUsed: turned(14, 30, aFrame(col, skip)),
      });
    // the spiral stair looks the same from every side but for where its steps stand
    V('spiral-stairs', {
      side: view(30, 54, (c) => {
        const b = 52,
          ir = C.iron,
          pts = [];
        for (let i = 0; i < 13; i++) {
          const a = (i * Math.PI) / 4 + Math.PI / 2;
          pts.push([14 + Math.round(Math.sin(a) * 12), b - 1 - i * 4, Math.cos(a) >= -0.01]);
        }
        for (const [ex, y, f] of pts) if (!f) c.rect(Math.min(14, ex), y, Math.max(15, ex), y + 1, C.ironDark);
        c.rect(14, 1, 15, b, ir);
        c.col(14, 1, b, C.steel);
        for (const [ex, y, f] of pts)
          if (f) {
            c.rect(Math.min(14, ex), y, Math.max(15, ex), y + 1, ir);
            c.row(y, Math.min(14, ex), Math.max(15, ex), C.steel);
            if (Math.abs(ex - 14) > 6) c.col(ex, y - 10, y, C.ironDark);
          }
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, y0, f0] = pts[i],
            [x1, y1, f1] = pts[i + 1];
          if (f0 || f1) c.line(x0, y0 - 10, x1, y1 - 10, f0 ? C.steel : C.ironDark);
        }
        c.rect(11, b, 18, b, C.ironDark);
        c.speckle(1, 1, 28, 52, C.rust, 14, 4);
      }),
    });
    // banisters
    const banSide = (broken) => (c) => {
      c.rect(1, 14, 4, 15, WD);
      c.row(14, 1, 4, W);
      if (broken) {
        c.rect(2, 10, 3, 13, W); // a stump, and the rail hanging
        c.set(2, 9, WP);
        c.line(1, 3, 4, 8, WL);
        c.line(1, 2, 3, 2, WL);
        c.set(4, 9, WP);
      } else {
        c.rect(2, 4, 3, 13, W);
        c.col(2, 4, 13, WL);
        c.row(8, 2, 3, WD);
        c.rect(1, 2, 4, 3, WL);
        c.row(2, 1, 4, L(WL));
      }
    };
    V('banister', {
      side: view(6, 18, banSide(false)),
      used: view(34, 18, (c) => A['banister-broken'].draw(c)),
      sideUsed: view(6, 18, banSide(true)),
    });
    V('banister-broken', {
      side: view(6, 18, banSide(true)),
      used: view(34, 18, (c) => A['banister'].draw(c)),
      sideUsed: view(6, 18, banSide(false)),
    });
    {
      const loose = (c) => {
        c.rect(3, 6, 5, 6, WD); // the ball has come off in your hand
        c.set(4, 5, WP);
        c.rect(2, 7, 6, 8, W);
        c.rect(3, 9, 5, 17, W);
        c.col(3, 9, 17, WL);
        panel(c, 4, 10, 4, 15, W);
        c.rect(2, 18, 6, 20, W);
        c.row(18, 2, 6, WL);
        c.row(20, 2, 6, WD);
        c.oval(9, 16, 13, 20, WL);
        c.set(10, 17, L(WL));
        c.set(12, 20, WD);
      };
      V('banister-post', {
        side: view(9, 22, (c) => A['banister-post'].draw(c)),
        used: view(15, 22, loose),
        sideUsed: view(15, 22, loose),
      });
    }
    // the attic ladder; used, it is folded away and the hatch shut
    const ac = hex('#8a6a48');
    const atticSide = (away) => (c) => {
      c.rect(1, 1, 18, 3, WD); // the hatch frame, edge on
      c.row(1, 1, 18, W);
      if (away) {
        c.rect(3, 4, 16, 4, W);
        c.col(17, 4, 13, C.ash);
        c.set(17, 14, C.brass);
      } else {
        c.line(4, 4, 14, 42, ac); // steep, its foot out into the room
        c.line(5, 4, 15, 42, D(ac));
        for (let y = 9; y < 42; y += 4) c.row(y, 5 + Math.round(((y - 4) * 10) / 38), 7 + Math.round(((y - 4) * 10) / 38), L(ac));
        c.col(2, 4, 13, C.ash);
        c.set(2, 14, C.brass);
      }
    };
    V('stairs-attic', {
      side: view(20, 44, atticSide(false)),
      used: view(20, 44, (c) => {
        c.rect(1, 1, 18, 7, WD);
        c.row(1, 1, 18, W);
        c.rect(3, 2, 16, 6, W);
        panel(c, 4, 3, 15, 5, W);
        c.rect(9, 4, 10, 4, C.iron);
        c.col(17, 7, 16, C.ash);
        c.set(17, 17, C.brass);
      }),
      sideUsed: view(20, 44, atticSide(true)),
    });
    const dumbSide = (c) => {
      c.rect(1, 1, 3, 20, W);
      c.col(1, 1, 20, WL);
      c.row(1, 1, 3, WL);
      c.col(3, 3, 18, WD);
      c.rect(1, 19, 5, 20, WL);
      c.row(20, 1, 5, WD);
      c.set(4, 10, C.brass);
    };
    V('dumbwaiter', {
      side: view(7, 22, dumbSide),
      used: over('dumbwaiter', (c) => {
        c.rect(3, 7, 14, 18, NIGHT); // the car has gone: only the ropes, running
        c.col(7, 7, 18, C.ash);
        c.col(10, 7, 18, D(C.ash));
        c.row(18, 3, 14, hex('#2c2834'));
      }),
      sideUsed: view(7, 22, dumbSide),
    });
    // the fire escape; used, its drop ladder is pulled up
    const escSide = (up) => (c) => {
      const ir = C.iron,
        lt = C.steel;
      c.col(1, 2, 46, C.ironDark);
      for (const y of [11, 29]) {
        c.col(4, y, y + 15, C.ironDark); // the flights between the landings, end on
        c.col(10, y, y + 15, C.ironDark);
        for (let yy = y + 1; yy < y + 15; yy += 3) c.row(yy, 5, 9, lt);
      }
      for (const y of [9, 27, 45]) {
        c.rect(1, y, 13, y + 1, ir);
        c.row(y, 1, 13, lt);
        c.row(y - 7, 1, 13, ir);
        for (const x of [1, 7, 13]) c.col(x, y - 7, y, C.ironDark);
        c.line(2, y + 5, 5, y + 2, C.ironDark);
      }
      ladder(c, 5, 9, 47, up ? 52 : 60, ir);
      c.speckle(1, 1, 14, 60, C.rust, 7, 9);
    };
    V('fire-escape', {
      side: view(16, 62, escSide(false)),
      used: over('fire-escape', (c) => c.clearRect(11, 53, 19, 60)),
      sideUsed: view(16, 62, escSide(true)),
    });
  }

  /* ---------- lamps, stands and small things ---------- */
  const same = (p, q) => p && p[0] === q[0] && p[1] === q[1] && p[2] === q[2];
  /** Swap one colour of what is drawn for another. */
  function recolour(c, from, to) {
    for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (same(c.get(x, y), from)) c.set(x, y, to);
  }
  /** A fringed shade lit from inside: the shade glows, light shows under it. */
  function lightShade(c, col, y, x0, x1, stem) {
    const lit = blend(col, C.flameLight, 0.65);
    recolour(c, L(col), L(lit));
    recolour(c, col, lit);
    recolour(c, C.mustard, C.flameLight);
    c.row(y, x0, x1, C.glow);
    c.set(stem, y, C.brass);
  }
  {
    const lampOn = (slug, col, y, x0, x1) => over(slug, (c) => lightShade(c, col, y, x0, x1, 5));
    const asIs = (slug) => view(A[slug].w, A[slug].h, (c) => A[slug].draw(c));
    V('side-table-lamp', {
      side: asIs('side-table-lamp'),
      used: lampOn('side-table-lamp', hex('#8a6a4c'), 7, 3, 7),
      sideUsed: lampOn('side-table-lamp', hex('#8a6a4c'), 7, 3, 7),
    });
    V('standing-lamp-old', {
      side: asIs('standing-lamp-old'),
      used: lampOn('standing-lamp-old', hex('#7d5a50'), 8, 3, 7),
      sideUsed: lampOn('standing-lamp-old', hex('#7d5a50'), 8, 3, 7),
    });
    // the desk lamp
    const green = hex('#3d6a4e'),
      greenL = hex('#5d8a66'),
      beam = blend(C.glow, C.white, 0.25);
    const lampEnd = (on) => (c) => {
      const x = on ? 2 : 1;
      if (on) {
        c.poly([[x, 4], [x + 3, 4], [x + 5, 7], [x - 2, 7]], beam);
        c.rect(x, 1, x + 3, 2, greenL);
        c.row(1, x, x + 3, L(greenL));
      } else {
        c.rect(x, 1, x + 3, 2, green);
        c.row(1, x, x + 3, greenL);
      }
      c.row(3, x + 1, x + 2, C.glow);
      c.col(x + 1, 4, 6, C.brass);
      c.row(7, x, x + 3, C.brass);
    };
    V('reading-lamp', {
      side: view(6, 9, lampEnd(false)),
      used: view(11, 9, (c) => {
        c.poly([[3, 4], [7, 4], [9, 7], [1, 7]], beam); // switched on: the light falls on the desk
        c.rect(2, 1, 8, 2, greenL);
        c.row(1, 3, 7, L(greenL));
        c.row(3, 3, 7, C.flameLight);
        c.col(5, 4, 6, C.brass);
        c.row(7, 3, 7, C.brass);
      }),
      sideUsed: view(8, 9, lampEnd(true)),
    });
    // plants: knocked off the stand
    const plantFallen = (dead) => (c) => {
      c.rect(4, 15, 9, 15, WL);
      c.rect(6, 16, 7, 24, W);
      c.line(6, 22, 3, 26, WD);
      c.line(7, 22, 10, 26, WD);
      c.col(6, 22, 26, WD);
      const pot = hex('#7a4a34');
      c.rect(13, 23, 16, 26, pot); // the pot on its side, broken
      c.col(13, 23, 26, L(pot));
      c.rect(17, 24, 17, 25, pot);
      dots(c, pot, [11, 26, 19, 26, 20, 25]);
      c.rect(17, 26, 21, 26, C.earth); // earth spilled
      c.rect(18, 25, 19, 25, C.earth);
      if (dead) {
        const tw = hex('#5c4a34');
        c.line(17, 24, 22, 21, tw);
        c.line(18, 24, 23, 24, tw);
        dots(c, C.straw, [23, 20, 24, 24, 21, 23, 9, 26]);
      } else {
        for (const [x1, y1] of [[22, 19], [24, 21], [25, 24], [21, 22]]) c.line(17, 24, x1, y1, C.leaf);
        for (const [x1, y1] of [[23, 20], [24, 23], [22, 25]]) c.line(18, 24, x1, y1, C.leafLight);
      }
    };
    for (const [slug, dead] of [['plant-stand', false], ['plant-stand-dead', true]])
      V(slug, {
        side: flipped(14, 28, (c) => plantStand(c, dead)),
        used: view(27, 28, plantFallen(dead)),
        sideUsed: flipped(27, 28, plantFallen(dead)),
      });
    V('coat-stand', {
      side: flipped(14, 37, (c) => A['coat-stand'].draw(c)),
      used: view(14, 37, (c) => coatStand(c, 6)), // somebody has taken the hat and coat
      sideUsed: flipped(14, 37, (c) => coatStand(c, 6)),
    });
    const brolliesGone = (c) => {
      c.col(7, 1, 9, WL); // only the walking stick left
      c.set(8, 1, WL);
      c.rect(2, 9, 7, 17, C.brass);
      c.col(2, 9, 17, L(C.brass));
      c.row(9, 2, 7, D(C.brass));
      c.row(13, 2, 7, D(C.brass));
      c.row(17, 2, 7, D(C.brass));
    };
    V('umbrella-stand', {
      side: flipped(10, 19, (c) => A['umbrella-stand'].draw(c)),
      used: view(10, 19, brolliesGone),
      sideUsed: flipped(10, 19, brolliesGone),
    });
    const toolsSide = (poker) => (c) => {
      c.col(3, 1, 15, C.iron);
      c.set(3, 1, C.brass);
      c.row(4, 2, 4, C.iron);
      c.rect(4, 12, 5, 14, C.iron); // the shovel, behind
      c.col(5, 5, 11, C.ironDark);
      if (poker) {
        c.col(1, 5, 13, C.ironDark);
        c.set(2, 13, C.ironDark);
      }
      c.row(16, 1, 5, C.ironDark);
      c.row(15, 2, 4, C.iron);
    };
    V('fire-tools', {
      side: view(7, 18, toolsSide(true)),
      used: over('fire-tools', (c) => c.clearRect(2, 5, 2, 13)), // the poker is gone
      sideUsed: view(7, 18, toolsSide(false)),
    });
    // candles
    const candSide = (lit) => (c) => {
      const b = c.h - 2;
      c.col(3, 7, b - 1, C.brass);
      c.row(b, 1, 5, C.brass);
      c.row(b - 1, 2, 4, D(C.brass));
      c.set(3, 10, C.gold);
      c.row(8, 2, 4, C.brass);
      candle(c, 3, 3, 6, lit);
      if (!lit) c.set(4, 5, C.bone);
    };
    V('candelabra', {
      side: view(7, 16, candSide(false)),
      used: view(13, 16, (c) => candelabra(c, true)),
      sideUsed: view(7, 16, candSide(true)),
    });
    V('candelabra-lit', {
      side: view(7, 16, candSide(true)),
      used: view(13, 16, (c) => candelabra(c, false)),
      sideUsed: view(7, 16, candSide(false)),
    });
    const standSide = (lit) => (c) => {
      candle(c, 5, 4, 7, lit);
      c.row(8, 3, 7, C.brass);
      c.rect(1, 9, 10, 10, WL);
      c.row(9, 1, 10, L(WL));
      c.rect(2, 11, 9, 18, W);
      c.col(2, 11, 18, L(W));
      panel(c, 3, 12, 8, 17, W);
      c.set(10, 13, C.brass);
      legs(c, [2, 8], 19, 20, WD);
    };
    V('nightstand', {
      side: view(12, 22, standSide(false)),
      used: over('nightstand', (c) => {
        candle(c, 5, 4, 7, true); // the candle lit
        c.set(5, 1, C.flameLight);
        c.set(5, 2, C.flame);
        c.set(5, 3, C.flame);
        c.set(4, 3, C.flame);
        c.set(6, 3, C.flame);
      }),
      sideUsed: view(12, 22, (c) => {
        standSide(true)(c);
        c.set(5, 1, C.flameLight);
        c.set(5, 2, C.flame);
        c.set(5, 3, C.flame);
        c.set(4, 3, C.flame);
        c.set(6, 3, C.flame);
      }),
    });
  }

  /* ---------- music, wireless, fire ---------- */
  /** A quaver, for something that is playing. */
  function note(c, x, y) {
    c.col(x + 2, y, y + 3, C.bone);
    c.rect(x, y + 3, x + 1, y + 4, C.bone);
    c.set(x + 3, y + 1, C.bone);
  }
  {
    const pc = hex('#3b2a26');
    const uprightSide = (shut) => (c) => {
      c.rect(1, 1, 9, 2, L(pc));
      c.rect(2, 3, 8, 23, pc);
      c.col(2, 3, 23, L(pc));
      panel(c, 3, 5, 7, 11, pc);
      panel(c, 3, 18, 7, 22, pc);
      c.rect(9, 13, 13, 16, pc); // the key bed
      c.row(13, 9, 13, shut ? L(pc) : C.white);
      if (!shut) {
        c.line(9, 12, 10, 8, C.paper); // the music on its desk
        c.row(14, 9, 13, L(pc));
      }
      c.rect(11, 17, 13, 23, D(pc));
      c.rect(1, 24, 13, 24, D(pc));
      c.set(11, 23, C.brass);
    };
    V('piano-upright', {
      side: view(15, 26, uprightSide(false)),
      used: over('piano-upright', (c) => {
        c.rect(2, 14, 29, 15, pc); // the lid shut over the keys, the music put away
        c.row(14, 2, 29, L(pc));
        c.row(15, 2, 29, D(pc));
        c.rect(12, 6, 19, 9, pc);
      }),
      sideUsed: view(15, 26, uprightSide(true)),
    });
    // the grand, from the keyboard
    const gc = C.black,
      hl = hex('#3a3644');
    const grandFront = (shut) => (c) => {
      if (shut) {
        c.rect(2, 12, 29, 13, gc);
        c.row(12, 2, 29, hl);
      } else {
        c.line(3, 13, 28, 3, hl); // the lid, propped open on the far side
        c.line(3, 14, 28, 4, gc);
        c.line(4, 14, 28, 5, gc);
        c.line(24, 13, 25, 6, hex('#5a5560'));
      }
      c.rect(10, 8, 21, 13, hl); // music desk
      c.rect(12, 9, 19, 12, C.paper);
      dots(c, D(C.paper), [13, 10, 15, 10, 17, 10, 14, 11, 16, 11, 18, 11]);
      c.rect(2, 14, 29, 19, gc); // the case
      c.row(14, 2, 29, hl);
      c.col(2, 14, 19, hl);
      c.rect(4, 15, 27, 16, C.white);
      for (let x = 5; x < 27; x += 2) c.set(x, 15, x % 8 === 7 ? C.white : K);
      c.row(16, 4, 27, C.bone);
      c.rect(15, 20, 16, 25, hl); // the third leg, behind
      legs(c, [3, 27], 20, 26, gc);
      for (const x of [3, 27]) {
        c.set(x, 20, hl);
        c.row(27, x, x + 1, C.brass);
      }
      c.col(13, 20, 25, hl); // pedal lyre
      c.col(18, 20, 25, hl);
      c.row(26, 12, 19, C.brass);
    };
    V('piano-grand', {
      base: 'side',
      side: view(32, 30, grandFront(false)),
      used: view(46, 30, (c) => {
        c.rect(4, 12, 42, 13, gc); // the lid let down
        c.row(12, 4, 42, hl);
        c.rect(4, 14, 42, 19, gc);
        c.row(14, 4, 42, hl);
        c.col(4, 14, 19, hl);
        c.rect(43, 15, 43, 18, gc);
        c.rect(1, 16, 5, 17, C.white);
        c.row(17, 1, 5, C.bone);
        c.rect(1, 18, 4, 19, gc);
        legs(c, [5, 23, 40], 20, 26, gc);
        for (const x of [5, 23, 40]) {
          c.set(x, 20, hl);
          c.row(27, x, x + 1, C.brass);
        }
        c.col(13, 20, 25, hl);
        c.col(15, 20, 25, hl);
        c.row(26, 12, 16, C.brass);
      }),
      sideUsed: view(32, 30, grandFront(true)),
    });
    // the gramophone: its horn towards us
    const gramFront = (c, dy = 0) => {
      c.oval(3, 1 + dy, 12, 10 + dy, C.brass);
      c.oval(4, 2 + dy, 11, 9 + dy, mix(C.brass, 0.45));
      c.oval(6, 4 + dy, 9, 7 + dy, mix(C.brass, 0.25));
      c.line(4, 3 + dy, 6, 1 + dy, L(C.brass));
      c.rect(3, 11 + dy, 11, 11 + dy, C.black);
      c.rect(2, 12 + dy, 13, 17 + dy, W);
      c.row(12 + dy, 2, 13, WL);
      c.row(17 + dy, 2, 13, WD);
      panel(c, 4, 14 + dy, 11, 16 + dy, W);
      c.line(14, 13 + dy, 15, 14 + dy, C.iron);
      c.set(15, 15 + dy, C.iron);
    };
    V('gramophone', {
      side: view(17, 19, (c) => gramFront(c)),
      used: over(
        'gramophone',
        (c) => {
          note(c, 18, 1); // playing
          note(c, 21, 8);
        },
        { w: 26, h: 23 },
      ),
      sideUsed: view(23, 23, (c) => {
        gramFront(c, 4);
        note(c, 14, 1);
        note(c, 18, 7);
      }),
    });
    const radioSide = (on) => (c, dy = 0) => {
      c.rect(2, 2 + dy, 7, 10 + dy, WL);
      c.rect(3, 1 + dy, 6, 1 + dy, WL);
      c.col(2, 2 + dy, 10 + dy, L(WL));
      c.row(10 + dy, 1, 8, WD);
      c.frame(3, 3 + dy, 6, 8 + dy, D(WL));
      c.set(8, 8 + dy, on ? C.flameLight : C.glow);
      c.set(8, 9 + dy, C.black);
    };
    V('radio-old', {
      side: view(10, 12, (c) => radioSide(false)(c)),
      used: over(
        'radio-old',
        (c) => {
          c.rect(4, 14, 8, 14, C.flameLight); // switched on
          note(c, 13, 1);
          note(c, 16, 7);
        },
        { w: 21, h: 18 },
      ),
      sideUsed: view(18, 18, (c) => {
        radioSide(true)(c, 6);
        note(c, 10, 1);
        note(c, 13, 7);
      }),
    });
    // television
    const tvSide = (on) => (c) => {
      c.rect(4, 1, 12, 14, W);
      c.row(1, 4, 12, WL);
      c.row(14, 4, 12, WD);
      c.rect(2, 4, 3, 11, D(W)); // the tube, out at the back
      c.rect(1, 6, 1, 9, D(W));
      for (const y of [4, 6, 8]) c.row(y, 6, 10, WD);
      c.col(13, 3, 12, on ? C.white : hex('#2c3833')); // the glass of the screen
      if (on) {
        c.col(14, 4, 11, C.ghost);
        dots(c, C.ash, [13, 5, 13, 8, 13, 10]);
      }
      c.set(13, 13, C.bone);
      c.line(6, 15, 5, 20, WD);
      c.line(11, 15, 12, 20, WD);
    };
    const tvFront = (on) =>
      view(19, 22, (c) => {
        tv(c, on);
        c.clear(6, 0);
      });
    V('tv-old-off', { side: view(16, 22, tvSide(false)), used: tvFront(true), sideUsed: view(16, 22, tvSide(true)) });
    V('tv-old-static', { side: view(16, 22, tvSide(true)), used: tvFront(false), sideUsed: view(16, 22, tvSide(false)) });
    // fireplaces; used, a fire burns in them
    const tongue = (c, x, yb, h, w, col) => c.poly([[x, yb], [x + (w >> 1), yb - h], [x + w, yb]], col);
    const blaze = (c, x0, yb, h) => {
      tongue(c, x0, yb, h - 3, 4, C.red);
      tongue(c, x0 + 3, yb, h, 5, C.red);
      tongue(c, x0 + 7, yb, h - 2, 4, C.red);
      tongue(c, x0 + 1, yb, h - 5, 3, C.flame);
      tongue(c, x0 + 4, yb, h - 3, 4, C.flame);
      tongue(c, x0 + 8, yb, h - 5, 2, C.flame);
      tongue(c, x0 + 5, yb, h - 6, 2, C.flameLight);
    };
    const fireSide = (state) => (c) => {
      const st = C.stone,
        b = 28;
      c.rect(1, 6, 7, b, st); // the chimney breast
      c.col(1, 6, b, L(st));
      for (let y = 9; y < b - 2; y += 4) {
        c.row(y, 2, 4, D(st));
        c.row(y + 2, 5, 7, D(st));
      }
      c.rect(1, 3, 10, 5, L(st)); // the mantel, standing out
      c.row(3, 1, 10, L(L(st)));
      c.row(5, 2, 9, D(st));
      c.rect(1, b - 1, 12, b, D(st)); // hearth
      c.row(b - 1, 1, 12, st);
      c.col(9, b - 6, b - 2, C.ironDark); // the end of the grate
      c.row(b - 4, 8, 10, C.ironDark);
      if (state === 'cold') {
        c.rect(5, 1, 6, 2, C.brass);
        dots(c, C.ash, [10, b - 2, 11, b - 2]);
      } else if (state === 'embers') {
        dots(c, C.red, [8, b - 2, 10, b - 3]);
        c.set(10, b - 2, C.flame);
      } else {
        if (state === 'lit') c.rect(5, 1, 6, 2, C.brass);
        c.col(8, state === 'lit' ? 18 : 12, b - 2, hex('#6a4a22')); // firelight on the edge of the opening
        tongue(c, 9, b - 2, state === 'lit' ? 6 : 9, 3, C.red);
        tongue(c, 10, b - 2, state === 'lit' ? 4 : 6, 2, C.flame);
        c.set(11, b - 2, C.flameLight);
      }
    };
    const glowBack = (c) => {
      c.rect(10, 12, 25, 24, hex('#5a2a1c'));
      for (let y = 13; y < 25; y += 3) c.row(y, 10, 25, hex('#3a1c18'));
    };
    V('fireplace-cold', {
      side: view(14, 30, fireSide('cold')),
      used: over('fireplace-cold', (c) => {
        glowBack(c);
        c.rect(13, 25, 22, 26, hex('#3a2420')); // a log, and the fire catching
        c.row(25, 13, 22, hex('#5a4030'));
        blaze(c, 12, 25, 9);
        for (let x = 12; x <= 23; x += 3) c.col(x, 22, 26, C.ironDark);
        c.row(24, 12, 23, C.ironDark);
      }),
      sideUsed: view(14, 30, fireSide('lit')),
    });
    V('fireplace-embers', {
      side: view(14, 30, fireSide('embers')),
      used: over('fireplace-embers', (c) => {
        glowBack(c);
        c.rect(12, 24, 23, 26, hex('#3a2420')); // logs thrown on: a roaring fire
        c.row(24, 12, 23, hex('#5a4030'));
        blaze(c, 11, 24, 13);
        blaze(c, 15, 25, 10);
        for (let x = 12; x <= 23; x += 3) c.col(x, 23, 26, C.ironDark);
        c.row(24, 12, 23, C.ironDark);
        c.row(27, 9, 26, hex('#6a3a22'));
      }),
      sideUsed: view(14, 30, fireSide('roaring')),
    });
  }

  /* ---------- the study ---------- */
  {
    V('typewriter', {
      side: view(12, 10, (c) => {
        c.rect(2, 1, 2, 3, C.paper); // the sheet, standing in the carriage
        c.rect(1, 4, 4, 5, C.black);
        c.row(4, 1, 4, C.steel);
        c.rect(2, 6, 6, 8, C.black);
        c.rect(7, 7, 9, 8, C.black);
        c.row(5, 3, 5, hex('#3a3644'));
        dots(c, C.bone, [5, 5, 7, 6, 9, 6, 6, 5, 8, 6]);
      }),
      used: over(
        'typewriter',
        (c) => {
          c.rect(4, 1, 9, 6, C.paper); // a page typed
          c.row(1, 4, 9, C.white);
          for (const y of [2, 4]) c.row(y, 5, 8, D(D(C.paper)));
          c.set(8, 4, C.paper);
        },
        { h: 13 },
      ),
      sideUsed: view(12, 13, (c) => {
        c.rect(2, 1, 2, 6, C.paper);
        c.set(3, 1, C.paper);
        dots(c, D(D(C.paper)), [2, 2, 2, 4]);
        c.rect(1, 7, 4, 8, C.black);
        c.row(7, 1, 4, C.steel);
        c.rect(2, 9, 6, 11, C.black);
        c.rect(7, 10, 9, 11, C.black);
        c.row(8, 3, 5, hex('#3a3644'));
        dots(c, C.bone, [5, 8, 7, 9, 9, 9, 6, 8, 8, 9]);
      }),
    });
    // the globe: turned, it shows another side of the world
    const globe = (v) => (c) => {
      const land = hex('#9a8a58');
      c.oval(2, 1, 11, 10, hex('#5c7a78'));
      if (v === 0) {
        c.poly([[4, 3], [7, 2], [8, 5], [6, 7], [4, 6]], land);
        c.rect(9, 6, 10, 8, land);
        c.set(3, 8, land);
      } else if (v === 1) {
        c.poly([[6, 2], [9, 3], [10, 6], [8, 7]], land);
        c.rect(3, 5, 4, 8, land);
        c.set(6, 9, land);
      } else if (v === 2) {
        c.rect(3, 3, 5, 4, land);
        c.poly([[7, 5], [10, 4], [10, 7], [8, 9], [6, 7]], land);
        c.set(4, 7, land);
      } else {
        c.poly([[3, 4], [5, 3], [6, 6], [4, 8]], land);
        c.rect(8, 3, 9, 4, land);
        c.rect(8, 7, 9, 8, land);
      }
      c.line(1, 2, 12, 9, C.brass);
      c.set(1, 2, C.gold);
      c.col(6, 11, 21, WD);
      c.col(7, 11, 21, W);
      c.row(11, 4, 9, C.brass);
      c.line(6, 20, 3, 24, WD);
      c.line(7, 20, 10, 24, WD);
      c.col(6, 21, 24, WD);
    };
    V('globe-old', { side: view(14, 26, globe(1)), used: view(14, 26, globe(2)), sideUsed: view(14, 26, globe(3)) });
    // the telescope: from the other side it looks at us; used, it has been swung round
    const tripod = (c, m) => {
      c.rect(m, 10, m + 1, 12, C.iron);
      c.line(m, 12, m - 4, 28, WD);
      c.line(m + 1, 12, m + 5, 28, WD);
      c.line(m + 1, 12, m + 1, 27, W);
      c.row(20, m - 2, m + 3, D(C.brass));
    };
    V('telescope-brass', {
      side: view(16, 30, (c) => {
        c.rect(6, 9, 9, 11, D(C.brass)); // the tube, running away behind its great lens
        tripod(c, 7);
        c.oval(4, 2, 11, 9, C.brass);
        c.oval(5, 3, 10, 8, C.glass);
        c.line(6, 6, 8, 4, C.glassLight);
        c.set(5, 2, C.gold);
        c.set(6, 2, C.gold);
      }),
      used: view(24, 30, (c) => {
        const X = (x) => 23 - x;
        c.line(X(3), 13, X(20), 3, C.brass);
        c.line(X(3), 14, X(20), 4, C.brass);
        c.line(X(4), 15, X(21), 5, D(C.brass));
        c.line(X(14), 6, X(21), 2, C.gold);
        c.rect(X(22), 2, X(20), 5, C.brass);
        c.set(X(2), 14, C.black);
        c.set(X(1), 15, C.black);
        c.rect(11, 10, 12, 12, C.iron);
        c.line(11, 12, 5, 28, WD);
        c.line(12, 12, 18, 28, WD);
        c.line(12, 12, 12, 27, W);
        c.row(20, 9, 15, D(C.brass));
      }),
      sideUsed: view(16, 30, (c) => {
        c.rect(6, 4, 9, 6, C.brass); // now its eyepiece is towards us
        tripod(c, 7);
        c.oval(5, 6, 10, 11, C.brass);
        c.oval(6, 7, 9, 10, D(C.brass));
        c.rect(7, 8, 8, 9, C.black);
        c.row(4, 6, 9, C.gold);
      }),
    });
    const scattered = (c) => {
      c.rect(1, 5, 8, 7, C.paper); // what is left of the stack, the rest blown about
      c.row(6, 1, 8, D(C.paper));
      c.row(4, 2, 8, C.white);
      c.poly([[10, 2], [14, 1], [15, 3], [11, 4]], C.white);
      c.line(11, 3, 14, 2, D(C.paper));
      c.rect(10, 7, 15, 7, C.paper);
      c.rect(12, 6, 16, 6, C.white);
      dots(c, D(C.parchment), [3, 4, 5, 4]);
    };
    V('paper-stack', {
      side: view(10, 8, (c) => A['paper-stack'].draw(c)),
      used: view(18, 9, scattered),
      sideUsed: flipped(18, 9, scattered),
    });
    const spilt = (c) => {
      c.rect(6, 9, 11, 9, C.black); // ink spilt
      c.rect(7, 8, 9, 8, C.black);
      c.set(8, 8, hex('#3a3644'));
      c.set(12, 9, C.black);
    };
    V('inkwell', {
      side: flipped(9, 11, (c) => A['inkwell'].draw(c)),
      used: over('inkwell', spilt, { w: 14 }),
      sideUsed: flipped(14, 11, (c) => {
        c.stamp(raw('inkwell'), 0, 0);
        spilt(c);
      }),
    });
    const phone = (off) => (c) => {
      const hi = hex('#3a3644');
      c.rect(3, 2, 4, 2, C.black);
      c.rect(2, 1, 5, 1, C.black);
      c.col(3, 3, 9, C.black);
      c.col(4, 3, 9, hi);
      c.rect(1, 10, 6, 11, C.black);
      c.row(10, 2, 5, hi);
      if (off) {
        c.set(5, 4, C.brass); // off the hook: the earpiece lies beside it
        c.set(6, 3, C.brass);
        c.rect(9, 10, 13, 11, C.black);
        c.row(10, 9, 12, hi);
        c.set(13, 9, C.black);
        dots(c, C.black, [7, 9, 8, 10]);
      } else {
        c.row(5, 5, 6, C.brass);
        c.rect(6, 4, 7, 8, C.black);
        c.set(7, 9, C.black);
      }
    };
    V('telephone-old', {
      side: flipped(9, 13, phone(false)),
      used: view(15, 13, phone(true)),
      sideUsed: flipped(15, 13, phone(true)),
    });
    // the lectern: drawn from the side above
    const lectSide = (shut) => (c) => {
      if (shut) {
        c.poly([[3, 4], [11, 1], [11, 4], [3, 7]], C.wine);
        c.line(3, 4, 11, 1, L(C.wine));
      } else {
        c.poly([[1, 6], [12, 2], [12, 4], [1, 8]], C.paper);
        c.line(1, 6, 12, 2, C.white);
        c.line(6, 4, 6, 6, D(C.paper));
      }
      c.poly([[1, 9], [12, 5], [12, 7], [1, 11]], WL);
      c.rect(5, 9, 8, 22, W);
      c.col(5, 9, 22, L(W));
      panel(c, 6, 12, 7, 19, W);
      c.rect(3, 23, 10, 24, W);
      c.rect(2, 25, 11, 26, WD);
      c.row(25, 2, 11, W);
    };
    const lectFront = (shut) => (c) => {
      c.rect(1, 3, 12, 9, WL); // the slope, towards the reader
      c.row(3, 1, 12, L(WL));
      c.rect(1, 10, 12, 10, WD);
      if (shut) {
        c.rect(4, 4, 9, 9, C.wine);
        c.col(4, 4, 9, L(C.wine));
        c.col(9, 4, 9, C.paper);
        dots(c, C.gold, [6, 6, 7, 6, 6, 7, 7, 7]);
      } else {
        c.rect(2, 4, 11, 9, C.paper);
        c.row(4, 2, 11, C.white);
        c.col(6, 4, 9, D(C.paper));
        c.col(7, 5, 9, C.white);
        for (const y of [6, 8]) {
          c.row(y, 3, 5, D(D(C.paper)));
          c.row(y, 8, 10, D(D(C.paper)));
        }
      }
      c.rect(5, 11, 8, 22, W);
      c.col(5, 11, 22, L(W));
      panel(c, 6, 13, 7, 20, W);
      c.rect(3, 23, 10, 24, W);
      c.rect(2, 25, 11, 26, WD);
      c.row(25, 2, 11, W);
    };
    V('lectern', {
      base: 'side',
      side: view(14, 28, lectFront(false)),
      used: view(14, 28, lectSide(true)),
      sideUsed: view(14, 28, lectFront(true)),
    });
    // the map table; used, the chart is rolled up
    const mapEnd = (rolled) => (c) => {
      c.rect(1, 4, 14, 5, WL);
      c.row(4, 1, 14, L(WL));
      if (rolled) {
        c.rect(5, 2, 6, 3, C.parchment);
        c.set(5, 2, C.paper);
      } else {
        c.rect(3, 3, 12, 3, C.parchment);
        c.row(2, 4, 11, C.paper);
      }
      c.rect(10, 2, 11, 3, C.brass);
      c.rect(2, 6, 13, 7, W);
      c.row(7, 2, 13, WD);
      legs(c, [2, 12], 8, 16, WD);
      c.row(13, 4, 11, WD);
      c.rect(5, 11, 6, 12, C.parchment);
      c.rect(8, 11, 9, 12, C.paper);
    };
    V('map-table', {
      side: view(16, 18, mapEnd(false)),
      used: over('map-table', (c) => {
        c.clearRect(1, 1, 21, 3);
        c.rect(5, 2, 17, 3, C.parchment); // rolled, tied
        c.row(2, 5, 17, C.paper);
        c.col(11, 2, 3, C.rust);
        c.set(5, 3, D(C.parchment));
        c.set(17, 3, D(C.parchment));
      }),
      sideUsed: view(16, 18, mapEnd(true)),
    });
    V('book-pile', {
      side: view(9, 12, (c) => {
        const bk = (x0, x1, y, col) => {
          c.rect(x0, y, x1, y + 1, C.paper); // their fore-edges
          c.row(y, x0, x1, col);
          c.set(x0, y + 1, col);
        };
        bk(1, 7, 9, C.wine);
        bk(2, 6, 7, C.navy);
        bk(1, 6, 5, C.forest);
        bk(2, 7, 3, C.mustard);
        bk(2, 5, 1, C.slate);
      }),
      used: over(
        'book-pile',
        (c) => {
          c.clearRect(3, 3, 7, 4);
          c.rect(1, 2, 9, 3, C.paper); // the top one left lying open
          c.row(1, 2, 8, C.white);
          c.set(5, 1, C.paper);
          c.col(5, 2, 3, D(C.paper));
          dots(c, D(D(C.paper)), [2, 2, 3, 2, 7, 2, 8, 2]);
          c.row(4, 2, 8, C.slate);
        },
        { h: 14 },
      ),
      sideUsed: view(9, 14, (c) => {
        const bk = (x0, x1, y, col) => {
          c.rect(x0, y, x1, y + 1, C.paper);
          c.row(y, x0, x1, col);
          c.set(x0, y + 1, col);
        };
        bk(1, 7, 11, C.wine);
        bk(2, 6, 9, C.navy);
        bk(1, 6, 7, C.forest);
        bk(2, 7, 5, C.mustard);
        c.rect(1, 2, 7, 3, C.paper);
        c.row(1, 2, 6, C.white);
        c.row(4, 2, 6, C.slate);
      }),
    });
    // the library steps, drawn from the side above
    const stepsFront = (used) => (c) => {
      const dy = c.h - 18;
      for (let i = 0; i < 4; i++) {
        c.rect(2, 13 - i * 4 + dy, 11, 16 - i * 4 + dy, mix(W, 1 - i * 0.07));
        c.row(13 - i * 4 + dy, 1, 12, L(WL));
      }
      c.col(1, 2 + dy, 16 + dy, WD);
      c.col(12, 2 + dy, 16 + dy, WD);
      if (used) {
        c.rect(4, dy - 1, 9, dy, C.wine); // a book left on the top step
        c.row(dy - 1, 4, 9, L(C.wine));
        c.set(9, dy, C.paper);
      }
    };
    V('library-steps', {
      base: 'side',
      side: view(14, 18, stepsFront(false)),
      used: over(
        'library-steps',
        (c) => {
          c.rect(10, 1, 14, 2, C.wine);
          c.row(1, 10, 14, L(C.wine));
          c.set(14, 2, C.paper);
        },
        { h: 20 },
      ),
      sideUsed: view(14, 20, stepsFront(true)),
    });
    V('magnifier', {
      side: view(11, 5, (c) => {
        c.rect(1, 2, 6, 2, C.brass); // lying flat: the rim, edge on
        c.row(1, 2, 5, C.glassLight);
        c.rect(7, 2, 9, 2, WD);
      }),
      used: view(13, 11, (c) => {
        c.rect(1, 1, 10, 9, C.paper); // on a letter, the words swimming up large
        c.row(1, 1, 10, C.white);
        for (const y of [3, 5, 7]) c.row(y, 2, 9, D(C.paper));
        c.stamp(raw('magnifier'), 2, 2);
        dots(c, K, [5, 5, 6, 5, 5, 6, 6, 7]);
      }),
      sideUsed: view(12, 5, (c) => {
        c.rect(1, 3, 10, 3, C.paper);
        c.rect(2, 2, 7, 2, C.brass);
        c.row(1, 3, 6, C.glassLight);
        c.rect(8, 2, 10, 2, WD);
      }),
    });
    // the folding screen; used, it is folded up
    const sc = [hex('#5d6a5a'), hex('#4c5a4e'), hex('#5d6a5a')];
    V('folding-screen', {
      side: view(11, 36, (c) => {
        [[5, 3], [3, 1], [1, 3]].forEach(([x, t], i) => {
          c.rect(x, t, x + 3, 33 - (i === 1 ? 1 : 0), WD); // its three leaves, seen along the zigzag
          c.rect(x + 1, t + 1, x + 2, 31 - (i === 1 ? 1 : 0), sc[i]);
          c.col(x, t, 33, i === 1 ? WD : W);
        });
        c.rect(1, 34, 2, 34, WD);
        c.rect(7, 34, 8, 34, WD);
        dots(c, hex('#2e3430'), [2, 20, 3, 18, 2, 14]);
        dots(c, hex('#9a5a4a'), [3, 15, 2, 22]);
      }),
      used: view(15, 36, (c) => {
        c.rect(1, 3, 10, 33, WD);
        c.rect(2, 4, 9, 31, sc[0]);
        c.col(1, 3, 33, W);
        for (const x of [11, 12, 13]) c.col(x, 3 - (x === 12 ? 1 : 0), 33, x === 12 ? W : WD); // the other leaves, behind
        const br = hex('#2e3430');
        c.line(3, 26, 9, 19, br);
        c.line(9, 20, 5, 15, br);
        dots(c, hex('#9a5a4a'), [5, 14, 7, 22]);
        dots(c, C.bone, [4, 8, 5, 7, 6, 8]);
        c.dither(2, 27, 8, 31, hex('#4f5a4c'));
        c.rect(1, 34, 2, 34, WD);
        c.rect(12, 34, 13, 34, WD);
      }),
      sideUsed: view(8, 36, (c) => {
        for (const x of [1, 3, 5]) {
          c.rect(x, 3, x + 1, 33, WD);
          c.col(x, 3, 33, W);
        }
        c.rect(1, 34, 6, 34, WD);
      }),
    });
  }

  /* ---------- the bedroom ---------- */
  {
    const tc = hex('#7a5a44');
    const dressSide = (open) => (c) => {
      c.rect(4, 2, 5, 17, tc); // the mirror, edge on
      c.col(6, 3, 16, C.glass);
      c.rect(3, 13, 5, 17, tc);
      c.rect(1, 18, 11, 19, L(tc));
      c.row(18, 1, 11, L(L(tc)));
      c.rect(2, 20, 10, 27, tc);
      c.col(2, 20, 27, L(tc));
      panel(c, 3, 21, 9, 26, tc);
      legs(c, [2, 9], 28, 32, D(tc));
      c.rect(8, 15, 9, 17, C.glassLight);
      c.set(8, 14, C.gold);
      c.set(11, 26, C.brass);
      if (open) {
        c.rect(11, 22, 15, 25, L(tc));
        c.row(22, 11, 15, L(L(tc)));
        c.set(16, 24, C.brass);
        dots(c, C.gold, [13, 21, 14, 26, 14, 27, 13, 28]);
      } else c.set(11, 22, C.brass);
    };
    V('dressing-table', {
      side: view(13, 34, dressSide(false)),
      used: over('dressing-table', (c) => {
        c.rect(3, 21, 8, 22, mix(tc, 0.3)); // a drawer left open, a necklace over its edge
        c.rect(2, 22, 9, 25, L(tc));
        c.row(22, 2, 9, L(L(tc)));
        c.row(25, 2, 9, tc);
        c.set(5, 24, C.brass);
        dots(c, C.gold, [4, 21, 5, 21, 6, 22, 7, 23, 7, 24, 7, 26, 6, 27]);
      }),
      sideUsed: view(18, 34, dressSide(true)),
    });
    // the washstand: seen from the towel rail
    const en = hex('#c2c4bc');
    const washSide = (used) => (c) => {
      c.rect(6, 3, 9, 9, en); // jug
      c.rect(7, 2, 8, 2, en);
      c.col(6, 3, 9, C.white);
      c.row(6, 6, 9, hex('#5a6a88'));
      c.poly([[2, 7], [8, 7], [7, 10], [3, 10]], en); // basin, in front of it
      c.row(7, 2, 8, used ? hex('#5a6a88') : C.white);
      c.rect(1, 11, 11, 12, hex('#9a9aa0'));
      c.row(11, 1, 11, hex('#b5b5b8'));
      c.rect(2, 13, 10, 16, W);
      c.col(2, 13, 16, L(W));
      legs(c, [2, 9], 17, 25, WD);
      c.row(22, 4, 8, W);
      c.row(23, 4, 8, WD);
      c.row(14, 2, 10, C.brass); // the rail
      if (used) dots(c, hex('#5a6a88'), [9, 10, 5, 6, 12, 26, 13, 26, 11, 25]);
      else {
        c.rect(3, 15, 9, 21, C.cream); // and the towel on it
        c.row(15, 3, 9, L(C.cream));
        c.col(6, 16, 21, D(C.cream));
        c.row(20, 3, 9, hex('#5a6a88'));
      }
    };
    V('washstand', {
      side: view(15, 28, washSide(false)),
      used: over('washstand', (c) => {
        c.row(7, 3, 8, hex('#5a6a88')); // water in the basin, the towel taken
        c.row(8, 4, 7, hex('#5a6a88'));
        c.clearRect(1, 14, 1, 19);
        c.col(1, 13, 20, C.brass);
        dots(c, hex('#5a6a88'), [10, 10, 9, 26, 10, 26, 8, 25]);
      }),
      sideUsed: view(15, 28, washSide(true)),
    });
    const potFull = (c) => {
      c.row(2, 2, 7, hex('#8a7a3a')); // used
      c.set(1, 2, hex('#3a4a70'));
      c.set(8, 2, hex('#3a4a70'));
    };
    V('bedpan', {
      side: view(10, 8, (c) => {
        A['bedpan'].draw(c);
        c.clear(8, 4);
        c.rect(4, 4, 5, 5, C.white); // the handle, towards us
        c.set(5, 5, C.rust);
      }),
      used: over('bedpan', potFull),
      sideUsed: view(10, 8, (c) => {
        A['bedpan'].draw(c);
        c.clear(8, 4);
        c.rect(4, 4, 5, 5, C.white);
        potFull(c);
      }),
    });
    // trunk and blanket box: opened
    const kc = hex('#5e4a36'),
      strap = hex('#3a2a20'),
      lining = mix(C.parchment, 0.75);
    const trunkEnd = (open) => (c) => {
      const b = c.h - 2;
      if (open) {
        c.rect(1, b - 18, 3, b - 7, kc); // the lid stood open
        c.col(1, b - 18, b - 7, L(kc));
        c.col(3, b - 17, b - 7, lining);
        c.rect(4, b - 8, 10, b - 7, C.cream); // what is in it
        c.rect(7, b - 9, 11, b - 8, C.wine);
        c.rect(1, b - 6, 12, b, kc);
        c.row(b - 6, 1, 12, mix(kc, 0.4));
      } else {
        c.rect(1, b - 10, 12, b, kc);
        c.row(b - 11, 2, 11, L(kc));
        c.row(b - 7, 1, 12, D(kc));
      }
      c.col(1, b - 6, b, L(kc));
      c.rect(5, b - 4, 8, b - 4, strap); // handle
      c.set(5, b - 3, strap);
      c.set(8, b - 3, strap);
      dots(c, C.brass, [1, b, 12, b]);
    };
    V('trunk-old', {
      side: view(14, 14, trunkEnd(false)),
      used: view(22, 22, (c) => {
        const b = 20;
        c.rect(1, 3, 20, 12, kc); // the lid thrown back: its paper lining
        c.rect(2, 2, 19, 2, L(kc));
        c.rect(3, 4, 18, 12, lining);
        for (const x of [4, 16]) c.rect(x, 3, x + 1, 12, strap);
        dots(c, D(lining), [7, 6, 9, 8, 12, 5, 13, 9, 8, 10]);
        c.rect(3, 11, 9, 13, C.cream); // clothes
        c.row(11, 3, 9, C.white);
        c.rect(10, 12, 14, 13, C.wine);
        c.rect(14, 11, 18, 13, C.navy);
        c.row(11, 14, 18, L(C.navy));
        c.rect(1, 14, 20, b, kc);
        c.col(1, 14, b, L(kc));
        c.row(14, 1, 20, mix(kc, 0.4));
        for (const x of [4, 16]) {
          c.rect(x, 14, x + 1, b, strap);
          c.set(x, 15, C.brass);
        }
        c.rect(10, 15, 11, 16, C.brass);
        dots(c, C.brass, [1, 14, 20, 14, 1, b, 20, b]);
      }),
      sideUsed: view(14, 22, trunkEnd(true)),
    });
    const boxEnd = (open) => (c) => {
      const b = c.h - 2;
      if (open) {
        c.rect(1, b - 17, 2, b - 8, WL);
        c.col(1, b - 17, b - 8, L(WL));
        c.rect(3, b - 10, 9, b - 8, C.cream);
        c.row(b - 10, 3, 9, C.white);
        c.rect(5, b - 11, 10, b - 11, ROSE);
      } else {
        c.rect(1, b - 9, 12, b - 8, WL);
        c.row(b - 9, 1, 12, L(WL));
      }
      c.rect(2, b - 7, 11, b, W);
      c.col(2, b - 7, b, L(W));
      panel(c, 4, b - 6, 9, b - 1, W);
      c.row(b, 2, 11, WD);
    };
    V('blanket-box', {
      side: view(14, 13, boxEnd(false)),
      used: view(24, 21, (c) => {
        c.rect(1, 1, 22, 9, WL); // the lid up
        c.row(1, 1, 22, L(WL));
        panel(c, 3, 3, 20, 8, WL);
        c.rect(4, 8, 19, 10, C.cream); // blankets, folded
        c.row(8, 4, 19, C.white);
        c.row(9, 4, 19, D(C.cream));
        c.rect(6, 7, 17, 7, ROSE);
        c.rect(2, 11, 21, 18, W);
        c.col(2, 11, 18, L(W));
        c.row(11, 2, 21, mix(W, 0.4));
        panel(c, 4, 12, 10, 17, W);
        panel(c, 13, 12, 19, 17, W);
        c.row(19, 2, 3, WD);
        c.row(19, 20, 21, WD);
      }),
      sideUsed: view(14, 21, boxEnd(true)),
    });
    // the tea trolley, from its handle end; used, tea has been taken
    const trolleyEnd = (used) => (c) => {
      c.col(2, 3, 14, C.brass);
      c.col(11, 3, 14, D(C.brass));
      c.row(3, 2, 11, C.brass); // the handle across
      c.rect(2, 6, 11, 6, C.brass);
      c.rect(2, 11, 11, 11, C.brass);
      if (!used) {
        c.rect(5, 3, 8, 5, C.white); // teapot
        c.set(6, 2, C.white);
        c.row(5, 5, 8, D(C.white));
        c.rect(4, 9, 9, 10, C.glassLight);
      } else {
        c.rect(4, 10, 9, 10, C.glassLight);
        c.set(7, 5, C.white);
        dots(c, C.bone, [5, 5, 9, 5]);
      }
      c.rect(2, 13, 3, 16, C.ironDark); // wheels, edge on
      c.rect(10, 13, 11, 16, C.ironDark);
      c.set(2, 14, C.steel);
      c.set(10, 14, C.steel);
    };
    V('serving-trolley', {
      side: view(14, 18, trolleyEnd(false)),
      used: over('serving-trolley', (c) => {
        c.clearRect(4, 1, 17, 4);
        c.rect(14, 4, 16, 4, C.white); // one cup left, on its side, and the crumbs
        c.set(17, 3, C.white);
        dots(c, C.bone, [6, 4, 9, 4, 11, 4]);
        c.clearRect(6, 9, 12, 9);
      }),
      sideUsed: view(14, 18, trolleyEnd(true)),
    });
  }

  return A;
};
