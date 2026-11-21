/* The house at paper-doll scale: furniture, doors and stairs, the modern home, and the attic.
 * One pixel is one doll pixel (a person is 16 x 33). Everything stands on its bottom row and is seen from the
 * front or the side, like a stage set. Helpers at the top keep the variants of one thing alike. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }) => {
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

  /*__MORE__*/
  return A;
};
