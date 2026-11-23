/* Weird, part 4: more things that should not be. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, drawer, legs, body, sideBody, slab, eye, eyes, eyeball, arm, drip, pool, paper, glow, figure, wheelEdge } = H;
  const odd = setting('env-weird', 'Weird');
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IN = hex('#17151c'),
    VOID = hex('#120f1c'),
    SHADOW = hex('#2a2630'),
    MEAT = hex('#9a4038'),
    MEATD = hex('#6e2a2a'),
    GUM = hex('#a8606a'),
    PALE = hex('#c9c4b0'),
    ENAMEL = hex('#cfcabb'),
    SNOW = hex('#dfe3e0'),
    ICE = hex('#9ebcc2');

  /* ---------- a ladder into the dark ---------- */
  function cloud(c, x, y) {
    c.oval(x - 6, y - 8, x + 12, y + 6, VOID);
    c.oval(x - 9, y - 3, x + 2, y + 7, VOID);
    c.oval(x + 6, y - 4, x + 15, y + 8, VOID);
    c.oval(x - 2, y - 4, x + 8, y + 2, hex('#1b1630'));
  }
  odd(
    'ladder-into-dark',
    'ladder going up into darkness black cloud ceiling nothing above',
    true,
    (c, u) => {
      c.col(2, 4, 47, WL);
      c.col(11, 4, 47, W);
      for (let y = 10; y < 47; y += 5) c.row(y, 3, 10, W), c.row(y + 1, 3, 10, WD);
      cloud(c, 4, 2);
      if (u) {
        const TR = hex('#4a5a78');
        c.rect(14, 8, 15, 22, TR); // somebody went up; this much has come back
        c.col(14, 8, 22, L(TR));
        c.rect(17, 8, 18, 20, TR);
        c.rect(14, 23, 16, 24, hex('#2a2422'));
        c.rect(17, 21, 18, 23, PALE); // one foot bare
        c.set(19, 23, PALE);
        c.rect(14, 46, 18, 47, hex('#2a2422')); // a shoe
        c.rect(14, 45, 15, 45, hex('#2a2422'));
      }
    },
    (c, u) => {
      c.line(0, 47, 8, 4, WL);
      c.line(1, 47, 9, 4, W);
      for (let y = 10; y < 47; y += 5) c.set(2 + Math.round(((47 - y) * 8) / 43), y, WD);
      cloud(c, 6, 2);
      if (u) {
        c.rect(13, 8, 14, 22, hex('#4a5a78'));
        c.rect(13, 23, 16, 24, hex('#2a2422'));
        c.rect(14, 46, 18, 47, hex('#2a2422'));
      }
    },
  );

  /* ---------- an oven with winter inside ---------- */
  odd(
    'oven-snow-inside',
    'oven with snow inside cooker winter in the stove icicles cold',
    true,
    (c, u) => {
      body(c, 0, 3, 15, 21, ENAMEL);
      c.rect(0, 0, 15, 2, mix(ENAMEL, 0.9));
      c.row(0, 0, 15, L(ENAMEL));
      c.row(3, 0, 15, C.ironDark); // the hob
      dots(c, hex('#3a3836'), [3, 5, 6, 5, 9, 5, 12, 5]); // knobs
      for (const [x, n] of [[2, 2], [5, 3], [8, 1], [11, 3], [13, 2]]) c.col(x, 4, 3 + n, ICE), c.set(x, 4, SNOW); // icicles
      legs(c, [0, 14], 22, 23, C.ironDark);
      if (u) {
        c.rect(2, 8, 13, 19, hex('#31465a')); // the door down: a winter night in there
        c.rect(2, 15, 13, 19, SNOW);
        c.row(15, 2, 13, ICE);
        c.rect(3, 13, 6, 15, SNOW);
        c.col(10, 10, 15, hex('#2e4835')); // one small fir
        c.rect(9, 12, 11, 13, hex('#2e4835'));
        c.rect(8, 14, 12, 14, hex('#2e4835'));
        c.set(10, 9, SNOW);
        dots(c, SNOW, [4, 9, 7, 11, 12, 9]);
        dots(c, ICE, [6, 17, 8, 18, 10, 17]); // footprints coming out
        c.rect(1, 20, 14, 22, D(ENAMEL));
        c.row(20, 1, 14, ENAMEL);
        c.rect(3, 21, 12, 23, SNOW);
        c.rect(-2, 23, 17, 23, SNOW);
        c.set(16, 22, SNOW);
      } else {
        body(c, 2, 8, 13, 19, ENAMEL);
        c.rect(4, 11, 11, 16, ICE); // the window frosted over, from inside
        c.dither(4, 11, 11, 16, SNOW);
        c.row(9, 4, 11, C.steel);
        c.col(6, 10, 11, ICE);
      }
    },
    (c, u) => {
      sideBody(c, 0, 3, 10, 21, ENAMEL);
      c.rect(0, 0, 1, 2, mix(ENAMEL, 0.9));
      c.row(3, 0, 10, C.ironDark);
      c.col(11, 4, 6, ICE);
      legs(c, [0, 9], 22, 23, C.ironDark);
      if (u) {
        c.rect(11, 20, 20, 21, D(ENAMEL));
        c.row(20, 11, 20, ENAMEL);
        c.poly([[11, 19], [13, 16], [17, 17], [20, 19]], SNOW);
        c.col(10, 9, 18, hex('#31465a'));
        c.rect(12, 22, 23, 23, SNOW);
      } else c.rect(11, 9, 11, 9, C.steel);
    },
  );

  /* ---------- a pram full of hands ---------- */
  function spoked(c, cx, cy, r) {
    c.oval(cx - r, cy - r, cx + r, cy + r, K);
    c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, hex('#3a3836'));
    c.line(cx - r + 1, cy, cx + r - 1, cy, C.steel);
    c.line(cx, cy - r + 1, cx, cy + r - 1, C.steel);
    c.set(cx, cy, C.brass);
  }
  const up = (c, x, y0, n) => arm(c, x, y0, x, y0 - n, PALE);
  odd(
    'pram-of-hands',
    'pram full of hands baby carriage arms reaching out black perambulator',
    true,
    (c, u) => {
      const P = hex('#24222a');
      if (u) up(c, 6, 10, 9), up(c, 10, 10, 13), up(c, 14, 10, 7), up(c, 17, 10, 11), up(c, 3, 10, 5); // all of them, reaching for you
      spoked(c, 6, 21, 4);
      spoked(c, 22, 21, 4);
      c.line(6, 21, 9, 17, C.iron);
      c.line(22, 21, 19, 17, C.iron);
      c.poly([[2, 10], [26, 10], [23, 17], [6, 17]], P);
      c.row(10, 2, 26, hex('#3c3a44'));
      c.row(12, 4, 24, C.bone); // the coach line
      c.poly([[15, 10], [15, 4], [19, 0], [24, 0], [27, 4], [27, 10]], P);
      for (const x of [17, 20, 23]) c.line(x, 1 + (x < 19 ? 2 : 0), 15 + (x - 17) / 2, 9, hex('#3c3a44'));
      c.line(15, 4, 19, 0, hex('#3c3a44'));
      c.line(2, 10, -3, 3, C.iron);
      c.rect(-5, 2, -2, 3, C.bone);
      if (!u) c.rect(8, 8, 10, 9, PALE), dots(c, PALE, [8, 10, 10, 10, 9, 11]); // one small hand on the edge
    },
    (c, u) => {
      const P = hex('#24222a');
      if (u) up(c, 4, 10, 10), up(c, 8, 10, 13), up(c, 11, 10, 7);
      wheelEdge(c, 0, 21, 4);
      wheelEdge(c, 14, 21, 4);
      c.row(21, 2, 13, C.iron);
      c.poly([[1, 10], [14, 10], [13, 17], [2, 17]], P);
      c.row(10, 1, 14, hex('#3c3a44'));
      c.row(12, 2, 13, C.bone);
      if (!u) {
        c.poly([[1, 10], [1, 3], [4, 0], [11, 0], [14, 3], [14, 10]], P);
        c.poly([[3, 9], [3, 4], [5, 2], [10, 2], [12, 4], [12, 9]], IN);
        c.line(1, 3, 4, 0, hex('#3c3a44'));
        dots(c, PALE, [5, 9, 6, 9, 7, 9, 6, 8]);
      } else c.rect(1, 6, 14, 9, P), c.row(6, 1, 14, hex('#3c3a44'));
    },
    { base: 'side' },
  );

  /* ---------- coats standing with nobody in them ---------- */
  function coat(c, x, b, h, col, raise) {
    const t = b - h + 1;
    c.poly([[x + 1, t + 2], [x + 7, t + 2], [x + 9, b], [x - 1, b]], col);
    c.rect(x + 2, t, x + 6, t + 2, col);
    c.rect(x + 3, t, x + 5, t + 1, IN); // nothing in the collar
    c.col(x + 4, t + 3, b, D(col));
    dots(c, C.bone, [x + 5, t + 5, x + 5, t + 9, x + 5, t + 13]);
    c.line(x + 1, t + 2, x - 1, b, L(col));
    c.rect(x - 2, t + 3, x - 1, t + Math.round(h * 0.55), D(col)); // sleeves
    c.set(x - 2, t + Math.round(h * 0.55) + 1, IN);
    if (raise) {
      c.rect(x + 9, t + 3, x + 15, t + 4, D(col)); // one sleeve comes up to point
      c.set(x + 16, t + 3, IN);
    } else {
      c.rect(x + 9, t + 3, x + 10, t + Math.round(h * 0.55), D(col));
      c.set(x + 10, t + Math.round(h * 0.55) + 1, IN);
    }
    c.row(b, x - 1, x + 9, D(col));
  }
  odd(
    'coats-standing-empty',
    'coats standing with nobody in them empty overcoats family no heads',
    true,
    (c, u) => {
      coat(c, 2, 35, 29, hex('#2e3448'), false);
      coat(c, 26, 35, 27, hex('#55604e'), u);
      coat(c, 14, 35, 19, hex('#8a4038'), false);
      if (u) {
        c.rect(16, 13, 20, 17, hex('#8a4038')); // and the little one has put its hood up
        c.rect(17, 15, 19, 17, IN);
        eyes(c, 17, 16, 2, C.bone);
      }
    },
    (c, u) => {
      const col = hex('#2e3448');
      c.poly([[2, 9], [6, 9], [8, 35], [0, 35]], col);
      c.rect(2, 7, 5, 9, col);
      c.row(7, 3, 5, IN);
      c.line(2, 9, 0, 35, L(col));
      c.row(35, 0, 8, D(col));
      if (u) c.rect(5, 11, 12, 12, D(col)), c.set(13, 11, IN);
      else c.rect(4, 10, 5, 23, D(col)), c.set(5, 24, IN);
    },
  );

  /* ---------- a pot plant with fingers ---------- */
  odd(
    'plant-finger-leaves',
    'pot plant with fingers hand growing in a pot flesh leaves',
    false,
    (c, u) => {
      const POT = hex('#a0603a'),
        F = C.flesh;
      c.poly([[3, 17], [10, 17], [9, 22], [4, 22]], POT);
      c.rect(2, 15, 11, 16, POT);
      c.row(15, 2, 11, L(POT));
      c.row(14, 3, 10, C.earth);
      c.rect(6, 9, 7, 14, hex('#4f6b3c')); // the stalk
      c.line(5, 12, 3, 10, C.leaf);
      c.line(8, 13, 10, 11, C.leaf);
      if (u) {
        c.rect(4, 3, 9, 8, F); // a fist, and a scrap of your sleeve in it
        c.row(3, 4, 9, L(F));
        for (const x of [5, 7]) c.col(x, 4, 6, D(F));
        c.rect(3, 6, 5, 7, F);
        c.row(8, 4, 9, D(F));
        c.rect(9, 5, 11, 7, C.navy);
        c.set(12, 7, C.navy);
      } else {
        c.rect(5, 5, 8, 8, F);
        c.line(5, 5, 2, 0, F);
        c.line(6, 4, 5, -2, F);
        c.line(7, 4, 8, -3, F);
        c.line(8, 5, 11, -1, F);
        c.line(5, 8, 2, 6, F); // thumb
        dots(c, C.bone, [2, 0, 5, -2, 8, -3, 11, -1, 2, 6]); // nails
        c.row(8, 5, 8, D(F));
      }
    },
    null,
    { round: true },
  );

  /* ---------- candles burning black ---------- */
  odd(
    'candelabra-black-flame',
    'candelabra with black flames candles burning dark pewter three branch',
    false,
    (c, u) => {
      const P = C.steel;
      if (u) c.oval(-4, -8, 17, 10, SHADOW), c.oval(-1, -5, 14, 7, hex('#1b1630')); // they give off dark
      c.rect(4, 18, 9, 19, P);
      c.row(18, 4, 9, L(P));
      c.rect(6, 10, 7, 17, P);
      c.col(6, 10, 17, L(P));
      c.row(9, 1, 12, P);
      c.set(1, 8, P);
      c.set(12, 8, P);
      c.rect(5, 13, 8, 13, P);
      for (const [x, t] of [[1, 3], [6, 1], [7, 1], [12, 3]]) c.col(x, t, 7 + (x > 5 && x < 8 ? 1 : 0), C.bone);
      c.set(2, 5, C.bone); // a run of wax
      for (const [x, t] of [[1, 3], [6.5, 1], [12, 3]]) {
        if (u) {
          c.rect(x - (x === 6.5 ? 0.5 : 0), t - 3, x + (x === 6.5 ? 0.5 : 0), t - 1, VOID);
          c.set(x, t - 4, VOID);
          c.set(x + 1, t - 2, C.plum);
        } else c.set(x, t - 1, K);
      }
    },
    null,
    { round: true },
  );

  /* ---------- a rug with a lump under it ---------- */
  function rugSide(c, x0, x1, lump, big) {
    c.rect(x0, 4, x1, 6, C.wine);
    c.row(4, x0, x1, L(C.wine));
    c.row(6, x0, x1, D(C.wine));
    for (let x = x0 + 2; x < x1; x += 4) c.set(x, 5, C.gold);
    c.set(x0 - 1, 6, C.bone);
    c.set(x1 + 1, 6, C.bone);
    const h = big ? 5 : 3,
      w = big ? 10 : 8;
    c.poly([[lump - 1, 4], [lump + 2, 4 - h], [lump + w - 3, 4 - h], [lump + w, 4]], C.wine);
    c.line(lump - 1, 4, lump + 2, 4 - h, L(C.wine));
    c.row(4 - h, lump + 2, lump + w - 3, L(C.wine));
    c.set(lump + (w >> 1), 3 - (h >> 1), C.gold);
  }
  function fingersOut(c, x, y) {
    c.rect(x, y, x + 5, y, hex('#3a3440'));
    c.rect(x + 1, y - 2, x + 6, y - 2, hex('#3a3440'));
    c.rect(x, y - 1, x + 4, y - 1, IN);
    dots(c, C.bone, [x + 6, y, x + 7, y - 2, x + 5, y - 1]);
  }
  odd(
    'rug-lump-moving',
    'rug with a lump under it something moving under the carpet',
    false,
    (c, u) => {
      rugSide(c, 0, 35, u ? 25 : 7, u);
      if (u) fingersOut(c, 36, 6); // it went all the way across, and out
    },
    (c, u) => {
      rugSide(c, 0, 19, 6, u);
      for (let x = 0; x <= 19; x += 2) c.set(x, 7, C.bone); // the fringe
      if (u) c.rect(8, 7, 9, 9, hex('#3a3440')), c.rect(11, 7, 12, 10, hex('#3a3440')), c.rect(5, 7, 6, 8, hex('#3a3440')), dots(c, C.bone, [8, 10, 11, 11, 5, 9]);
    },
    { base: 'side' },
  );

  /* ---------- a radio with a mouth ---------- */
  odd(
    'radio-mouth-speaker',
    'radio with a mouth for a speaker wireless set lips talking',
    false,
    (c, u) => {
      const CL = hex('#8a7a52');
      body(c, 0, 1, 18, 13, W);
      c.rect(1, 0, 17, 0, W);
      c.rect(2, 3, 11, 11, CL);
      c.dither(2, 3, 11, 11, D(CL));
      c.oval(13, 3, 16, 6, u ? C.flameLight : C.bone);
      c.line(14, 5, 15, 3, K);
      dots(c, WD, [13, 9, 16, 9, 13, 10, 16, 10]);
      c.rect(1, 14, 2, 14, WD);
      c.rect(16, 14, 17, 14, WD);
      if (u) {
        c.oval(3, 4, 10, 11, GUM); // it has something to say
        c.oval(4, 5, 9, 10, hex('#3a1418'));
        for (let x = 4; x <= 9; x += 2) c.set(x, 5, C.bone), c.set(x, 10, C.bone);
        c.rect(6, 8, 7, 9, MEAT);
      } else {
        c.rect(3, 6, 10, 8, GUM); // lips, shut
        c.row(7, 3, 10, MEATD);
        c.set(3, 6, CL);
        c.set(10, 6, CL);
        c.set(3, 8, CL);
        c.set(10, 8, CL);
      }
    },
    (c, u) => {
      sideBody(c, 0, 1, 8, 13, W);
      c.rect(1, 0, 7, 0, W);
      c.rect(0, 14, 1, 14, WD);
      c.rect(7, 14, 8, 14, WD);
      if (u) c.rect(9, 5, 9, 10, GUM), c.rect(10, 8, 12, 9, MEAT), c.set(13, 9, MEAT); // a tongue
      else c.rect(9, 6, 9, 8, GUM);
    },
  );

  /* ---------- a chest of drawers too tall to be one ---------- */
  odd(
    'drawers-tower-steps',
    'tower of drawers impossibly tall chest of drawers pulled out like steps',
    true,
    (c, u) => {
      const n = 9;
      body(c, 0, 1, 15, 47, WD);
      c.rect(-1, 0, 16, 1, WD);
      c.row(0, -1, 16, W);
      for (let i = 0; i < n; i++) {
        const y = 2 + i * 5,
          out = u ? Math.max(0, i - 2) : 0; // lower ones come out further
        if (out) c.rect(1, y, 14, y + Math.min(2, out > 3 ? 2 : 1), IN);
        drawer(c, out ? 0 : 1, y + (out ? Math.min(2, out > 3 ? 2 : 1) : 0), out ? 15 : 14, y + 4, out ? mix(W, 0.75 + out * 0.05) : W, C.brass);
        if (u && out && i % 2) c.rect(4 + i, y, 5 + i, y, C.earth); // someone has gone up them
      }
      legs(c, [0, 14], 48, 49, mix(WD, 0.7));
    },
    (c, u) => {
      const n = 9;
      sideBody(c, 0, 1, 8, 47, WD);
      c.rect(-1, 0, 9, 1, WD);
      c.row(0, -1, 9, W);
      legs(c, [0, 7], 48, 49, mix(WD, 0.7));
      if (u)
        for (let i = 3; i < n; i++) {
          const y = 2 + i * 5,
            out = (i - 2) * 2;
          slab(c, 9, y, y + 4, out, W);
          c.row(y, 9, 8 + out, IN);
          c.set(8 + out, y, WL);
          if (i % 2) c.set(7 + out, y - 1, C.earth);
        }
    },
  );

  /* ---------- a keyhole as tall as a child ---------- */
  odd(
    'keyhole-giant-standing',
    'giant keyhole standing brass plate huge lock eye looking through',
    true,
    (c, u) => {
      c.oval(0, 0, 13, 13, C.brass);
      c.rect(1, 7, 12, 29, C.brass);
      c.col(1, 7, 29, C.gold);
      c.line(1, 5, 4, 1, C.gold);
      c.row(29, 1, 12, D(C.brass));
      dots(c, D(C.brass), [6, 1, 7, 1, 3, 27, 10, 27]);
      c.oval(3, 3, 10, 10, VOID);
      c.poly([[6, 10], [7, 10], [10, 23], [3, 23]], VOID);
      if (u) {
        c.oval(4, 4, 9, 9, C.white); // put your eye to it, and one is put to yours
        c.oval(5, 5, 8, 8, hex('#4a6a5a'));
        c.rect(6, 6, 7, 7, K);
        c.set(4, 8, D(C.white));
        c.poly([[6, 12], [7, 12], [9, 22], [4, 22]], hex('#8a7a3c'));
        c.rect(6, 15, 7, 21, C.flameLight);
      } else c.set(6, 5, hex('#3a3454')), c.rect(6, 20, 7, 22, hex('#3a3454'));
    },
    (c, u) => {
      c.rect(0, 0, 2, 29, C.brass);
      c.col(0, 0, 29, C.gold);
      c.col(2, 0, 29, D(C.brass));
      c.clear(0, 0);
      c.clear(2, 0);
      if (u) {
        c.poly([[3, 6], [3, 22], [14, 29], [14, 26]], hex('#8a7a3c')); // light through it, from the other side
        c.line(3, 6, 14, 26, C.flameLight);
        c.rect(8, 29, 16, 29, C.glow);
      }
    },
  );

  /* ---------- a tap in the air ---------- */
  odd(
    'tap-in-air-dripping',
    'tap in mid air no pipe dripping faucet floating puddle',
    false,
    (c, u) => {
      c.rect(1, 2, 8, 4, C.brass);
      c.row(2, 1, 8, C.gold);
      c.rect(7, 5, 8, 7, C.brass);
      c.rect(0, 1, 1, 5, C.steel); // where a pipe should be
      c.set(0, 3, IN);
      if (u) {
        c.rect(4, -3, 5, 1, C.brass); // turned on
        c.rect(7, 8, 8, 31, C.blood);
        c.col(7, 8, 31, hex('#b3342c'));
        pool(c, 0, 16, 32, C.blood);
        dots(c, C.blood, [5, 30, 10, 29, 11, 31]);
      } else {
        c.rect(2, 0, 7, 1, C.brass);
        c.rect(4, 0, 5, 1, C.gold);
        c.rect(7, 10, 8, 11, C.glass); // one drop, then another
        c.set(7, 10, C.glassLight);
        c.rect(7, 20, 8, 21, C.glass);
        pool(c, 3, 12, 32, C.water);
      }
    },
    (c, u) => {
      c.oval(0, 1, 5, 6, C.brass); // end on
      c.oval(1, 2, 4, 5, C.gold);
      c.rect(2, 3, 3, 4, IN);
      c.rect(2, 7, 3, 7, C.brass);
      if (u) {
        c.rect(2, -3, 3, 0, C.brass);
        c.rect(2, 8, 3, 31, C.blood);
        pool(c, -3, 9, 32, C.blood);
      } else {
        c.rect(0, 0, 5, 0, C.brass);
        c.rect(2, 10, 3, 11, C.glass);
        c.rect(2, 20, 3, 21, C.glass);
        pool(c, -1, 6, 32, C.water);
      }
    },
  );
};
