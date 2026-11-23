/* Weird, part 2: rooms within things, and company that is not there. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, legs, body, sideBody, slab, eye, eyes, arm, drip, pool, paper, glow, figure, table, chairSide, chairFront, fallen, bricks } = H;
  const odd = setting('env-weird', 'Weird');
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IN = hex('#17151c'),
    VOID = hex('#120f1c'),
    SHADOW = hex('#2a2630'),
    MEAT = hex('#9a4038'),
    MEATD = hex('#6e2a2a'),
    PALE = hex('#c9c4b0'),
    DUMMY = hex('#b9b29a'),
    BARK = hex('#4a3a2c');

  /* ---------- a lamp shining darkness ---------- */
  odd(
    'lamp-shining-darkness',
    'standard lamp shining darkness instead of light floor lamp shade black cone',
    true,
    (c, u) => {
      const SH = hex('#9a8448');
      c.rect(4, 38, 9, 39, C.brass);
      c.row(38, 4, 9, C.gold);
      c.rect(6, 10, 7, 37, C.brass);
      c.col(6, 10, 37, C.gold);
      if (u) {
        c.poly([[1, 10], [12, 10], [21, 39], [-8, 39]], VOID); // switched on
        c.poly([[4, 12], [9, 12], [14, 39], [-1, 39]], hex('#1b1630'));
        eyes(c, 3, 27, 4, C.bone);
        eyes(c, 9, 33, 3, C.bone);
      }
      c.poly([[3, 0], [10, 0], [13, 9], [0, 9]], u ? mix(SH, 0.6) : SH);
      c.line(3, 0, 0, 9, u ? SH : L(SH));
      c.row(9, 0, 13, D(SH));
      for (let x = 0; x <= 13; x += 2) c.set(x, 10, u ? VOID : D(SH)); // fringe
      if (!u) c.col(10, 11, 14, C.brass), c.set(10, 15, C.gold); // the pull cord
    },
    null,
    { round: true },
  );

  /* ---------- a floating chair ---------- */
  const chS = (c) => chairSide(c, 0, 17, { col: W });
  const chF = (c) => chairFront(c, 0, 17, { col: W });
  odd(
    'chair-floating',
    'floating chair hovering in the air levitating wooden chair shadow',
    true,
    (c, u) => {
      if (u) return fallen(c, chS, 0, 29, true); // touch it and it drops
      chS(c);
      c.row(29, 0, 8, SHADOW);
      c.row(28, 2, 6, SHADOW);
    },
    (c, u) => {
      if (u) return fallen(c, chF, 0, 29, true);
      chF(c);
      c.row(29, 0, 9, SHADOW);
      c.row(28, 2, 7, SHADOW);
    },
    { base: 'side' },
  );

  /* ---------- a table set for nobody ---------- */
  function sitter(c, x, b, flip) {
    // the shadow of someone sitting, with nobody to cast it
    const s = flip ? -1 : 1;
    c.oval(x - 2, b - 27, x + 3, b - 21, SHADOW);
    c.rect(x - 2, b - 20, x + 3, b - 10, SHADOW);
    c.rect(x - 2, b - 11, x + 6 * s + (flip ? 3 : 0), b - 9, SHADOW);
    c.rect(x + (flip ? -5 : 3), b - 17, x + (flip ? -3 : 8), b - 16, SHADOW);
  }
  odd(
    'table-set-nobody',
    'table set for nobody dinner laid empty chairs shadow sitting candle plates',
    true,
    (c, u) => {
      const b = 25;
      chairSide(c, 0, b);
      // the other chair faces left
      c.rect(44, b - 17, 45, b, W);
      c.col(45, b - 17, b, D(W));
      c.rect(38, b - 8, 39, b, W);
      c.rect(38, b - 9, 45, b - 8, W);
      c.row(b - 9, 38, 45, WL);
      sitter(c, u ? 42 : 3, b, u);
      table(c, 8, 37, 11, b, WD);
      c.rect(7, 10, 38, 14, C.white);
      c.row(10, 7, 38, L(C.white));
      for (let x = 8; x < 38; x += 3) c.set(x, 14, D(C.white));
      c.col(22, 5, 9, C.brass); // candlestick
      c.rect(21, 9, 23, 9, C.brass);
      c.col(22, 2, 4, C.bone);
      c.rect(11, 9, 15, 9, C.bone); // plates
      c.rect(29, 9, 33, 9, C.bone);
      if (u) {
        c.line(22, 1, 23, -2, C.ash); // the candle out, the food gone, the wine over
        c.rect(12, 8, 14, 8, hex('#8a8062'));
        c.rect(26, 9, 28, 9, C.glassLight);
        c.poly([[24, 10], [29, 10], [28, 13], [26, 13]], C.wine);
        c.col(27, 14, 17, C.wine);
      } else {
        c.set(22, 1, C.flame);
        c.set(22, 0, C.flameLight);
        c.rect(12, 7, 14, 8, hex('#7a4a30')); // dinner
        c.rect(30, 7, 32, 8, hex('#7a4a30'));
        c.rect(17, 7, 17, 9, C.glassLight);
        c.set(17, 8, C.wine);
        c.rect(27, 7, 27, 9, C.glassLight);
        c.set(27, 8, C.wine);
      }
    },
    (c, u) => {
      const b = 25;
      c.rect(1, 10, 14, 14, C.white); // the table's end
      c.row(10, 1, 14, L(C.white));
      c.col(2, 15, b, WD);
      c.col(13, 15, b, WD);
      c.col(7, 5, 9, C.brass);
      c.col(7, 2, 4, C.bone);
      if (u) {
        c.oval(5, -4, 10, 2, SHADOW); // it sits at the far end now, facing you
        c.rect(4, 3, 11, 9, SHADOW);
        eyes(c, 6, -1, 2, C.bone);
        c.line(7, 1, 8, -2, C.ash);
        chairFront(c, 3, b, { col: W });
      } else {
        c.set(7, 1, C.flame);
        c.set(7, 0, C.flameLight);
        chairFront(c, 3, b, { col: W });
        c.oval(5, b - 27, 10, b - 21, SHADOW); // the back of its head
        c.rect(4, b - 20, 11, b - 10, SHADOW);
      }
    },
    { base: 'side' },
  );

  /* ---------- a tree growing through a sofa ---------- */
  const SOFA = hex('#57694e'),
    LEAFR = hex('#7a2a2a');
  function branches(c, x, y, u, few) {
    const tips = few ? [[-6, -12], [5, -14], [1, -18]] : [[-11, -10], [-5, -17], [3, -19], [10, -13], [13, -6], [-13, -3]];
    for (const [dx, dy] of tips) {
      c.line(x, y, x + dx, y + dy, BARK);
      c.line(x + dx, y + dy, x + dx + Math.sign(dx) * 2, y + dy - 3, BARK);
      c.set(x + (dx >> 1) + 1, y + (dy >> 1) - 2, BARK);
      if (u) {
        c.oval(x + dx - 2, y + dy - 4, x + dx + 3, y + dy, LEAFR); // in leaf all at once, and the leaves are red
        c.set(x + dx - 1, y + dy - 3, hex('#9a4038'));
        c.set(x + dx + 1, y + dy - 1, hex('#5a1c20'));
      }
    }
  }
  odd(
    'sofa-tree-through',
    'tree growing through a sofa trunk split cushions branches roots indoors',
    true,
    (c, u) => {
      c.rect(3, 24, 32, 34, SOFA);
      c.row(24, 4, 31, L(SOFA));
      c.rect(4, 35, 31, 38, SOFA);
      c.row(35, 4, 31, L(SOFA));
      c.rect(4, 39, 31, 41, D(SOFA));
      for (const x of [0, 31]) c.rect(x, 31, x + 4, 41, SOFA), c.row(31, x, x + 4, L(SOFA)), c.row(33, x, x + 4, D(SOFA));
      legs(c, [1, 33], 42, 43, WD);
      c.col(12, 25, 38, D(SOFA));
      c.col(24, 25, 38, D(SOFA));
      c.rect(14, 26, 22, 38, IN); // the split
      dots(c, C.white, [14, 29, 22, 33, 13, 36, 23, 27]);
      c.poly([[15, 38], [21, 38], [20, 24], [19, 6], [17, 6], [16, 24]], BARK);
      c.line(17, 8, 16, 37, L(BARK));
      c.line(19, 14, 20, 36, D(BARK));
      branches(c, 18, 8, u);
      c.line(14, 41, 8, 43, BARK); // roots
      c.line(22, 41, 28, 43, BARK);
      c.row(43, 5, 9, BARK);
      c.row(43, 27, 31, BARK);
      if (u) dots(c, LEAFR, [7, 34, 27, 37, 10, 43, 36, 43, 20, 39]);
    },
    (c, u) => {
      c.rect(0, 24, 4, 41, SOFA);
      c.col(0, 24, 41, L(SOFA));
      c.rect(0, 31, 13, 41, SOFA);
      c.row(31, 4, 13, L(SOFA));
      c.row(33, 4, 13, D(SOFA));
      c.col(13, 32, 41, D(SOFA));
      legs(c, [0, 12], 42, 43, WD);
      c.poly([[5, 31], [9, 31], [8, 20], [8, 6], [6, 6], [6, 20]], BARK);
      c.line(6, 8, 5, 30, L(BARK));
      branches(c, 7, 8, u, true);
      c.line(10, 41, 15, 43, BARK);
      if (u) dots(c, LEAFR, [15, 43, 11, 30]);
    },
  );

  /* ---------- a cupboard bleeding ---------- */
  const PAINT = hex('#b9b29a');
  odd(
    'cupboard-bleeding',
    'cupboard bleeding blood running from the doors kitchen cabinet pool',
    true,
    (c, u) => {
      body(c, 0, 1, 17, 29, PAINT);
      c.rect(-1, 0, 18, 1, PAINT);
      c.row(0, -1, 18, L(PAINT));
      c.rect(0, 30, 17, 31, mix(PAINT, 0.5));
      if (u) {
        c.rect(2, 3, 15, 28, MEATD); // open: it is not a cupboard inside
        c.oval(5, 8, 12, 24, hex('#3a1418'));
        for (let y = 5; y < 28; y += 5) c.row(y, 2, 15, C.bone), c.set(2, y + 1, C.bone), c.set(15, y + 1, C.bone), c.rect(7, y, 10, y, MEAT);
        dots(c, hex('#c8605a'), [4, 7, 13, 12, 4, 18, 12, 23]);
        slab(c, -6, 3, 28, 6, PAINT);
        slab(c, 18, 3, 28, 6, PAINT);
        drip(c, -4, 14, 9, C.blood);
        drip(c, 20, 10, 12, C.blood);
        pool(c, -6, 23, 31, C.blood);
        c.rect(3, 29, 14, 30, C.blood);
      } else {
        panel(c, 2, 3, 8, 28, PAINT);
        panel(c, 10, 3, 15, 28, PAINT);
        c.set(7, 15, C.steel);
        c.set(11, 15, C.steel);
        c.col(9, 12, 29, C.blood); // from the seam
        drip(c, 5, 28, 2, C.blood);
        drip(c, 13, 28, 3, C.blood);
        c.row(29, 3, 14, C.blood);
        pool(c, 2, 15, 31, C.blood);
      }
    },
    (c, u) => {
      sideBody(c, 0, 1, 9, 29, PAINT);
      c.rect(-1, 0, 10, 1, PAINT);
      c.row(0, -1, 10, L(PAINT));
      c.rect(0, 30, 9, 31, mix(PAINT, 0.5));
      if (u) {
        slab(c, 10, 3, 28, 8, PAINT);
        c.col(9, 4, 27, MEATD);
        drip(c, 13, 12, 10, C.blood);
        pool(c, 8, 21, 31, C.blood);
      } else c.col(9, 14, 29, C.blood), pool(c, 7, 14, 31, C.blood);
    },
  );

  /* ---------- a painting that looks back ---------- */
  odd(
    'painting-looks-back',
    'painting that looks back portrait eyes follow you gilt frame leaning out',
    false,
    (c, u) => {
      c.rect(0, 0, 17, 21, C.brass);
      c.frame(0, 0, 17, 21, C.gold);
      c.frame(1, 1, 16, 20, D(C.brass));
      c.rect(2, 2, 15, 19, hex('#2c2a26'));
      c.rect(11, 3, 14, 9, hex('#3a3a30')); // a window behind him
      if (u) {
        // he has come forward out of it
        c.rect(3, 15, 14, 25, hex('#1e1c22'));
        c.rect(5, 6, 12, 15, C.flesh);
        c.rect(5, 5, 12, 7, hex('#3a2a20'));
        c.col(5, 8, 14, D(C.flesh));
        c.rect(6, 9, 7, 10, C.white);
        c.rect(10, 9, 11, 10, C.white);
        c.set(7, 10, K);
        c.set(10, 10, K);
        c.row(13, 7, 10, MEATD);
        c.rect(8, 16, 9, 18, C.white);
        c.rect(1, 20, 3, 22, C.flesh); // a hand on the frame
        dots(c, D(C.flesh), [1, 23, 3, 23]);
        c.rect(14, 20, 16, 22, C.flesh);
      } else {
        c.rect(5, 13, 12, 19, hex('#1e1c22'));
        c.rect(7, 6, 10, 12, C.flesh);
        c.rect(7, 5, 10, 6, hex('#3a2a20'));
        c.col(10, 7, 11, D(C.flesh));
        c.set(7, 8, K); // watching you sidelong
        c.set(8, 8, C.white);
        c.set(9, 8, K);
        c.set(10, 8, C.white);
        c.rect(8, 13, 9, 14, C.white);
      }
    },
    (c, u) => {
      c.rect(0, 0, 2, 21, C.brass);
      c.col(0, 0, 21, C.gold);
      c.col(2, 0, 21, D(C.brass));
      if (u) {
        c.rect(3, 6, 7, 14, C.flesh); // his head, out in the room
        c.rect(3, 5, 6, 7, hex('#3a2a20'));
        c.set(8, 11, C.flesh);
        c.set(7, 9, K);
        c.rect(3, 15, 6, 24, hex('#1e1c22'));
        c.rect(3, 20, 5, 21, C.flesh);
      }
    },
  );

  /* ---------- the doll's house with a lit window ---------- */
  odd(
    'dolls-house-lit-window',
    'dolls house dark with one lit window tiny figure inside watching model of this house',
    true,
    (c, u) => {
      const DH = hex('#4a4450'),
        RF = hex('#2e2c38');
      body(c, 1, 8, 22, 25, DH);
      c.poly([[-1, 8], [5, 0], [18, 0], [24, 8]], RF);
      c.line(-1, 8, 5, 0, L(RF));
      c.row(8, -1, 24, D(RF));
      c.rect(16, -3, 18, 1, DH);
      const win = (x, y, lit, who) => {
        c.rect(x, y, x + 4, y + 4, lit ? C.flameLight : hex('#1e1c26'));
        c.frame(x, y, x + 4, y + 4, hex('#77747a'));
        if (who) c.rect(x + 2, y + 2, x + 2, y + 3, K), c.set(x + 2, y + 1, K);
      };
      win(4, 11, u, u);
      win(15, 11, true, true); // somebody is up
      win(4, 19, u, u);
      win(15, 19, u, u);
      if (u) {
        c.rect(10, 18, 13, 25, C.flameLight); // every light on, the door open, and they have all come to look
        c.col(11, 21, 25, K);
        c.set(11, 20, K);
        c.poly([[9, 26], [14, 26], [16, 27], [7, 27]], hex('#8a7a3c'));
      } else body(c, 10, 18, 13, 25, hex('#3a2a30')), c.set(12, 22, C.brass);
    },
    (c, u) => {
      const DH = hex('#4a4450'),
        RF = hex('#2e2c38');
      body(c, 1, 8, 12, 25, DH);
      c.poly([[1, 8], [6, 0], [7, 0], [12, 8]], DH); // the gable
      c.line(0, 9, 6, -1, RF);
      c.line(13, 9, 7, -1, RF);
      c.line(0, 8, 6, -2, L(RF));
      c.rect(4, 13, 8, 17, u ? C.flameLight : hex('#1e1c26'));
      c.frame(4, 13, 8, 17, hex('#77747a'));
      c.rect(6, 4, 7, 5, C.flameLight); // the attic light is always on
      if (u) c.col(6, 14, 16, K);
    },
  );

  /* ---------- a birdcage holding a tiny moon ---------- */
  odd(
    'birdcage-tiny-moon',
    'birdcage holding a tiny moon glowing caged moon brass cage',
    false,
    (c, u) => {
      const BG = u ? hex('#22202a') : hex('#3a3a4a');
      c.oval(1, 2, 12, 12, BG);
      c.rect(1, 7, 12, 19, BG);
      const moon = (x, y) => {
        c.oval(x - 1, y - 1, x + 4, y + 4, hex('#8a8a6a'));
        c.oval(x, y, x + 3, y + 3, C.glow);
        c.set(x + 2, y + 1, C.bone);
        c.set(x + 1, y + 2, hex('#a9a47a'));
      };
      if (!u) moon(5, 10);
      for (let x = 1; x <= 12; x += 2) for (let y = 2; y <= 19; y++) if (c.get(x, y)) c.set(x, y, x === 1 ? C.gold : C.brass);
      c.row(13, 1, 12, C.brass);
      body(c, 0, 20, 13, 22, C.brass);
      c.rect(6, 0, 7, 1, C.brass);
      c.set(6, -1, C.gold);
      c.set(7, -1, C.gold);
      if (u) {
        c.rect(5, 14, 8, 19, IN); // the little door open: it is rising
        slab(c, 9, 14, 19, 2, C.brass);
        moon(4, -10);
      }
    },
    null,
    { round: true },
  );

  /* ---------- a suitcase with a staircase in it ---------- */
  odd(
    'suitcase-staircase',
    'suitcase with a staircase inside stairs going down into luggage open case',
    true,
    (c, u) => {
      const HIDE = hex('#6a4a32');
      body(c, 0, 8, 21, 13, HIDE);
      for (const x of [0, 20]) c.rect(x, 12, x + 1, 13, C.brass);
      if (u) {
        c.rect(0, -6, 21, 3, HIDE); // the lid up
        c.row(-6, 0, 21, L(HIDE));
        c.rect(1, -5, 20, 2, hex('#7a6a52'));
        for (let x = 3; x < 20; x += 4) c.col(x, -5, 2, hex('#6a5a46'));
        c.rect(1, 4, 20, 7, IN); // and inside, steps down
        c.row(4, 2, 19, W);
        c.row(5, 4, 17, mix(W, 0.75));
        c.row(6, 6, 15, mix(W, 0.55));
        c.row(7, 8, 13, hex('#8a7a3c'));
        c.rect(10, 7, 11, 7, C.flameLight);
        c.row(3, 0, 21, D(HIDE));
      } else {
        body(c, 0, 5, 21, 8, HIDE);
        c.rect(8, 3, 13, 4, WD); // handle
        c.col(4, 5, 13, D(HIDE)); // straps
        c.col(17, 5, 13, D(HIDE));
        c.rect(4, 9, 4, 10, C.brass);
        c.rect(17, 9, 17, 10, C.brass);
        c.rect(6, 8, 15, 8, C.flameLight); // light at the seam
      }
    },
    (c, u) => {
      const HIDE = hex('#6a4a32');
      sideBody(c, 0, 8, 13, 13, HIDE);
      if (u) {
        c.rect(-1, -6, 0, 7, HIDE);
        c.col(-1, -6, 7, L(HIDE));
        c.rect(1, 6, 12, 7, hex('#8a7a3c'));
        c.rect(4, 7, 9, 7, C.flameLight);
        c.poly([[2, 5], [11, 5], [9, 1], [4, 1]], hex('#5a5230')); // light coming up out of it
      } else sideBody(c, 0, 5, 13, 8, HIDE), c.row(8, 2, 11, C.flameLight);
    },
  );

  /* ---------- the mannequin family at dinner ---------- */
  function dummySide(c, x, b, flip, face) {
    // seated, in profile (or with its head turned to you)
    const s = flip ? -1 : 1,
      X = (dx) => x + dx * s;
    c.oval(Math.min(X(0), X(4)), b - 27, Math.max(X(0), X(4)), b - 21, DUMMY);
    c.rect(Math.min(X(1), X(3)), b - 20, Math.max(X(1), X(3)), b - 19, D(DUMMY));
    c.rect(Math.min(X(0), X(4)), b - 18, Math.max(X(0), X(4)), b - 10, DUMMY);
    c.rect(Math.min(X(0), X(8)), b - 10, Math.max(X(0), X(8)), b - 8, DUMMY);
    c.rect(Math.min(X(7), X(8)), b - 7, Math.max(X(7), X(8)), b, DUMMY);
    c.row(b - 14, Math.min(X(0), X(4)), Math.max(X(0), X(4)), D(DUMMY)); // the join at the waist
    c.row(b - 8, Math.min(X(0), X(8)), Math.max(X(0), X(8)), D(DUMMY));
    if (face) {
      c.set(X(1), b - 25, K);
      c.set(X(3), b - 25, K);
      c.row(b - 23, Math.min(X(1), X(3)), Math.max(X(1), X(3)), C.red);
    }
  }
  odd(
    'mannequin-family-dinner',
    'mannequin family at dinner dummies seated at table shop dummies wrong',
    true,
    (c, u) => {
      const b = 29;
      // the child, behind the table
      c.oval(20, 6, 24, 11, DUMMY);
      c.rect(19, 13, 25, 16, DUMMY);
      c.row(12, 21, 23, D(DUMMY));
      if (u) c.set(21, 8, K), c.set(23, 8, K), c.row(10, 21, 23, C.red);
      c.rect(-1, b - 17, 0, b, W); // chairs
      c.rect(-1, b - 9, 7, b - 8, W);
      c.col(7, b - 8, b, W);
      c.rect(45, b - 17, 46, b, WD);
      c.rect(38, b - 9, 46, b - 8, W);
      c.col(38, b - 8, b, W);
      dummySide(c, 1, b, false, u);
      dummySide(c, 44, b, true, u);
      table(c, 10, 35, 16, b, WD);
      c.rect(9, 15, 36, 18, C.white);
      c.row(15, 9, 36, L(C.white));
      for (const x of [12, 21, 30]) c.rect(x, 14, x + 3, 14, C.bone); // empty plates
      if (u) {
        c.rect(5, b - 17, 11, b - 16, DUMMY); // all three have turned to you; one lifts a hand
        c.rect(11, b - 21, 12, b - 16, DUMMY);
        c.rect(35, b - 17, 40, b - 16, DUMMY);
      } else {
        c.rect(5, b - 17, 12, b - 16, DUMMY);
        c.rect(34, b - 17, 40, b - 16, DUMMY);
      }
    },
    (c, u) => {
      const b = 29;
      c.rect(3, 15, 18, 18, C.white); // the table beyond
      c.row(15, 3, 18, L(C.white));
      c.col(4, 19, b, WD);
      c.col(17, 19, b, WD);
      c.oval(15, 6, 19, 11, DUMMY); // the child at the side
      c.rect(15, 12, 19, 14, DUMMY);
      if (u) c.set(16, 8, K), c.set(18, 8, K), c.row(10, 16, 18, C.red);
      chairFront(c, 5, b, { col: W, w: 12 });
      c.oval(8, b - 27, 13, b - 21, DUMMY); // father, from behind
      c.rect(7, b - 19, 14, b - 10, DUMMY);
      c.rect(10, b - 20, 11, b - 20, D(DUMMY));
      c.row(b - 14, 7, 14, D(DUMMY));
      if (u) {
        c.set(9, b - 25, K); // his head has gone right round
        c.set(12, b - 25, K);
        c.row(b - 23, 9, 12, C.red);
        c.row(b - 20, 8, 13, D(DUMMY));
      } else c.col(13, b - 26, b - 22, D(DUMMY));
    },
    { base: 'side' },
  );

  /* ---------- a well in the floor ---------- */
  odd(
    'well-in-floor',
    'well in the floor hole stone kerb indoors deep dark rope',
    true,
    (c, u) => {
      c.oval(0, 0, 25, 10, C.stone);
      c.rect(0, 5, 25, 9, C.stone);
      c.oval(2, 1, 23, 7, VOID);
      c.row(1, 8, 17, C.stoneLight);
      c.col(0, 5, 9, C.stoneLight);
      for (let x = 4; x < 25; x += 5) c.col(x, 8, 10, C.stoneDark);
      c.row(10, 3, 22, C.stoneDark);
      c.rect(-3, 9, -1, 10, W); // broken boards round it
      c.rect(26, 9, 29, 10, WD);
      c.set(-4, 10, W);
      c.rect(20, 3, 21, 4, C.iron); // a ring, and a rope going down
      c.line(19, 4, 14, 6, C.straw);
      if (u) {
        c.rect(7, 6, 10, 8, PALE); // something has come up the rope
        dots(c, PALE, [7, 9, 9, 9, 10, 9, 6, 7]);
        c.rect(13, 7, 15, 8, PALE);
        dots(c, PALE, [13, 9, 15, 9]);
        c.oval(9, 2, 14, 5, hex('#2e3a44'));
        eyes(c, 10, 4, 2, C.bone);
        pool(c, 4, 12, 11, C.water);
      }
    },
    null,
    { round: true },
  );

  /* ---------- a pile of shoes ---------- */
  const SHOES = [hex('#2a2422'), hex('#5a3c28'), hex('#8a4038'), C.navy, C.bone, hex('#8a7434'), hex('#4a4450')];
  function shoe(c, x, y, i) {
    const col = SHOES[i % SHOES.length],
      left = i % 3 === 0;
    c.rect(x, y + 1, x + 4, y + 2, col);
    c.rect(left ? x + 2 : x, y, left ? x + 4 : x + 2, y, col);
    c.set(left ? x + 3 : x + 1, y, L(col));
    c.row(y + 2, x, x + 4, D(col));
    if (i % 4 === 1) c.rect(left ? x + 3 : x, y - 2, left ? x + 4 : x + 1, y - 1, col); // a boot
  }
  function heap(c, w, b, u, seed) {
    const rowsN = u ? [Math.ceil(w / 5) + 2, Math.ceil(w / 5) - 1] : [Math.ceil(w / 5), Math.ceil(w / 5) - 1, Math.ceil(w / 5) - 3, 1];
    let i = seed;
    rowsN.forEach((n, r) => {
      if (n < 1) return;
      const x0 = Math.round((w - n * 5) / 2) + (r & 1);
      for (let k = 0; k < n; k++) shoe(c, x0 + k * 5 - (u && r === 0 ? 0 : 0), b - 2 - r * 3, i++);
    });
  }
  odd(
    'shoes-pile',
    'pile of shoes heap of old shoes boots childrens sandals whose',
    true,
    (c, u) => {
      heap(c, 30, 13, u, 0);
      if (u) {
        c.rect(13, 0, 15, 8, PALE); // there is a foot in one of them still
        c.rect(13, -1, 18, 0, PALE);
        dots(c, D(PALE), [16, -2, 18, -2]);
        c.col(13, 1, 8, L(PALE));
      }
    },
    (c, u) => {
      heap(c, 20, 13, u, 3);
      if (u) c.rect(9, 0, 11, 8, PALE), c.rect(9, -1, 11, 0, PALE), dots(c, D(PALE), [9, -2, 11, -2]);
    },
  );
};
