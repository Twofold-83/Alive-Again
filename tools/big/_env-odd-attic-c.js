/* Attic, part 3: nursery things put away, nests, ways in, and whoever sleeps up here. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, legs, body, sideBody, slab, eyes, arm, paper, glow, planks, cobweb, drape, candle, figure, wheelEdge, pool } = H;
  const att = setting('env-attic', 'Attic');
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IN = hex('#17151c'),
    ROSE = hex('#8a5560'),
    FRED = hex('#8a4038'),
    GREY = hex('#6a6a60'),
    CARD = hex('#8f7a58');

  /* ---------- high chair ---------- */
  att(
    'high-chair-old',
    'high chair old wooden baby feeding chair tray',
    true,
    (c, u) => {
      c.line(4, 12, 1, 29, W);
      c.line(5, 12, 2, 29, WD);
      c.line(9, 12, 12, 29, W);
      c.line(10, 12, 13, 29, WD);
      c.rect(3, 2, 4, 12, W); // back
      c.col(3, 2, 12, WL);
      c.rect(3, 12, 10, 13, W);
      c.row(12, 3, 10, WL);
      c.row(22, 3, 12, WD); // footrest
      c.rect(11, 20, 13, 20, W);
      c.col(9, 8, 11, W);
      if (u) {
        c.line(8, 8, 13, 3, W); // the tray thrown up
        c.line(9, 8, 14, 3, WD);
        c.rect(16, 27, 20, 29, C.white); // the bowl on the floor
        c.row(29, 15, 21, D(C.white));
        c.rect(22, 29, 26, 29, C.bone); // what was in it
        c.set(24, 28, C.bone);
      } else {
        c.rect(7, 7, 14, 8, W); // tray
        c.row(7, 7, 14, WL);
        c.rect(10, 5, 12, 6, C.white); // a bowl left on it
      }
    },
    (c, u) => {
      c.line(3, 12, 0, 29, W);
      c.line(10, 12, 13, 29, WD);
      c.rect(3, 2, 10, 11, mix(W, 0.45));
      c.frame(3, 2, 10, 11, W);
      c.row(2, 3, 10, WL);
      c.col(6, 3, 10, W);
      c.col(7, 3, 10, WD);
      c.rect(3, 12, 10, 13, W);
      c.row(22, 2, 11, WD);
      if (u) {
        c.rect(2, 0, 11, 1, WD); // the tray up over the back
        c.rect(15, 27, 19, 29, C.white);
        c.row(29, 14, 20, D(C.white));
        c.rect(8, 29, 12, 29, C.bone);
      } else {
        c.rect(1, 7, 12, 8, W);
        c.row(7, 1, 12, WL);
        c.rect(5, 5, 8, 6, C.white);
      }
    },
    { base: 'side' },
  );

  /* ---------- what is left of a pram ---------- */
  function spoked(c, cx, cy, r) {
    c.oval(cx - r, cy - r, cx + r, cy + r, K);
    c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, hex('#3a3836'));
    c.line(cx - r + 1, cy, cx + r - 1, cy, C.steel);
    c.line(cx, cy - r + 1, cx, cy + r - 1, C.steel);
    c.set(cx, cy, C.brass);
  }
  att(
    'pram-hood-chassis',
    'pram chassis hood wheels old perambulator frame attic',
    true,
    (c, u) => {
      spoked(c, 5, 20, 5);
      spoked(c, 22, 20, 5);
      c.line(5, 20, 8, 12, C.iron); // springs
      c.line(22, 20, 19, 12, C.iron);
      c.rect(5, 11, 22, 12, W); // the bed board
      c.row(11, 5, 22, WL);
      c.line(5, 11, 0, 3, C.iron); // handle
      c.rect(-2, 2, 1, 3, C.bone);
      const HOOD = hex('#24222a');
      if (u) {
        c.rect(20, 5, 23, 10, HOOD); // the hood folded back: there is a bundle
        for (let y = 5; y <= 10; y += 2) c.row(y, 20, 23, hex('#3c3a44'));
        c.oval(7, 6, 18, 10, C.white);
        c.row(10, 8, 17, D(C.white));
        c.line(10, 7, 12, 10, blend(C.white, C.stone, 0.45));
        c.oval(13, 7, 16, 9, hex('#6a3a2c'));
      } else {
        c.poly([[12, 10], [12, 4], [16, 0], [22, 0], [24, 4], [24, 10]], HOOD);
        for (const x of [14, 17, 20]) c.line(x, 1 + (x < 16 ? 2 : 0), 13 + (x - 14) / 2, 10, hex('#3c3a44'));
        c.line(12, 4, 16, 0, hex('#3c3a44'));
        c.set(18, 5, C.bone); // a tear in it
        c.set(19, 6, C.bone);
      }
    },
    (c, u) => {
      wheelEdge(c, 0, 20, 5);
      wheelEdge(c, 14, 20, 5);
      c.row(20, 2, 13, C.iron);
      c.rect(2, 11, 13, 12, W);
      c.row(11, 2, 13, WL);
      c.col(3, 13, 19, C.iron);
      c.col(12, 13, 19, C.iron);
      const HOOD = hex('#24222a');
      if (u) {
        c.rect(2, 8, 13, 10, HOOD);
        c.row(8, 2, 13, hex('#3c3a44'));
        c.oval(4, 4, 11, 9, C.white);
        c.oval(6, 5, 9, 8, hex('#6a3a2c'));
      } else {
        c.poly([[2, 10], [2, 3], [5, 0], [10, 0], [13, 3], [13, 10]], HOOD);
        c.poly([[4, 10], [4, 4], [6, 2], [9, 2], [11, 4], [11, 10]], IN);
        c.line(2, 3, 5, 0, hex('#3c3a44'));
      }
    },
    { base: 'side' },
  );

  /* ---------- the mirror under a sheet ---------- */
  att(
    'mirror-under-sheet',
    'mirror under sheet covered dust sheet tall looking glass gilt attic',
    true,
    (c, u) => {
      if (u) {
        c.rect(1, 0, 19, 36, C.brass); // uncovered: someone is standing in it, and it is not you
        c.frame(1, 0, 19, 36, C.gold);
        c.rect(3, 2, 17, 34, hex('#3f5560'));
        c.line(4, 4, 8, 8, C.glass);
        c.line(13, 24, 16, 27, C.glass);
        figure(c, 10, 34, 22, hex('#15171c'));
        c.rect(9, 13, 12, 16, hex('#15171c'));
        eyes(c, 10, 15, 2, C.bone);
        c.rect(3, 37, 5, 37, C.brass);
        c.rect(15, 37, 17, 37, C.brass);
        c.poly([[20, 37], [22, 32], [29, 31], [33, 37]], C.white); // the sheet
        c.line(22, 32, 29, 31, L(C.white));
        c.line(25, 33, 24, 36, blend(C.white, C.stone, 0.45));
      } else {
        drape(c, [[1, 37], [0, 6], [3, 1], [16, 0], [19, 4], [20, 37]], C.white, 7);
        c.rect(3, 37, 5, 37, C.brass); // a gilt foot shows
      }
    },
    (c, u) => {
      if (u) {
        c.line(0, 37, 5, 0, C.gold);
        c.line(1, 37, 6, 0, C.brass);
        c.line(2, 37, 7, 0, hex('#3f5560'));
        c.poly([[8, 37], [10, 33], [15, 32], [18, 37]], C.white);
      } else drape(c, [[-1, 37], [3, -1], [9, 0], [8, 37]], C.white, 5);
    },
  );

  /* ---------- hooded cradle on rockers ---------- */
  att(
    'cradle-rocking-hooded',
    'cradle rocking hooded wooden baby crib rockers old',
    true,
    (c, u) => {
      c.poly([[2, 8], [25, 8], [23, 15], [4, 15]], W);
      c.row(8, 2, 25, WL);
      c.line(9, 9, 10, 14, WD);
      c.line(17, 9, 17, 14, WD);
      c.poly([[2, 8], [2, 2], [5, 0], [10, 0], [10, 3], [9, 8]], W); // the hood
      c.line(2, 2, 5, 0, WL);
      c.col(2, 2, 8, WL);
      c.rect(11, 6, 24, 7, ROSE); // the blanket
      c.row(6, 11, 24, L(ROSE));
      c.col(6, 15, 17, WD);
      c.col(21, 15, 17, WD);
      c.row(18, 3, 24, WD); // rocker
      dots(c, WD, [2, 17, 1, 16, 25, 17, 26, 16]);
      if (u) {
        c.rect(16, 6, 22, 17, ROSE); // the blanket pulled out over the side
        c.col(18, 8, 17, D(ROSE));
        c.rect(18, 18, 25, 19, ROSE);
        c.row(6, 11, 15, IN); // and nothing where it lay
        c.row(7, 11, 15, C.cream);
      }
    },
    (c, u) => {
      c.poly([[1, 15], [0, 6], [3, 1], [6, 0], [9, 0], [12, 1], [15, 6], [14, 15]], W);
      c.line(0, 6, 3, 1, WL);
      c.poly([[3, 14], [2, 7], [5, 3], [10, 3], [13, 7], [12, 14]], IN); // into the hood
      c.rect(4, 11, 11, 14, u ? C.cream : ROSE);
      c.rect(1, 15, 14, 16, W);
      c.row(18, 2, 13, WD);
      dots(c, WD, [1, 17, 0, 16, 14, 17, 15, 16, 4, 17, 11, 17]);
      if (u) {
        c.rect(9, 11, 13, 17, ROSE);
        c.col(11, 12, 17, D(ROSE));
        c.rect(11, 18, 16, 19, ROSE);
      }
    },
    { base: 'side' },
  );

  /* ---------- hat stand ---------- */
  att(
    'hat-stand-hats',
    'hat stand old hats bowler boater veil walking stick attic',
    true,
    (c, u) => {
      c.rect(7, 4, 8, 40, WD);
      c.col(7, 4, 40, W);
      c.line(7, 40, 2, 43, WD);
      c.line(8, 40, 13, 43, WD);
      c.rect(6, 41, 9, 43, WD);
      c.line(6, 8, 3, 5, WD); // hooks
      c.line(9, 8, 12, 5, WD);
      c.line(6, 16, 4, 14, WD);
      c.line(9, 16, 11, 14, WD);
      c.line(13, 43, 11, 18, hex('#9a7a50')); // a stick
      c.rect(10, 16, 11, 17, hex('#9a7a50'));
      if (u) {
        // the hats are on the floor, and a wet coat is hanging here now
        c.poly([[4, 6], [11, 6], [13, 12], [13, 34], [3, 34], [3, 12]], hex('#3a3f48'));
        c.col(8, 8, 33, hex('#2a2e36'));
        c.line(4, 6, 3, 12, hex('#555b66'));
        dots(c, C.steel, [7, 12, 7, 17, 7, 22]);
        c.col(5, 35, 37, C.water);
        c.col(11, 35, 36, C.water);
        pool(c, 1, 12, 43, C.water);
        c.rect(-8, 40, -3, 43, K); // the bowler
        c.row(40, -9, -2, K);
        c.row(41, -7, -4, hex('#3a3836'));
      } else {
        c.rect(5, 0, 10, 3, K); // bowler on top
        c.row(4, 4, 11, K);
        c.set(6, 1, hex('#3a3836'));
        c.rect(0, 3, 4, 5, C.straw); // a boater
        c.row(6, -1, 5, C.straw);
        c.row(5, 0, 4, C.navy);
        c.oval(10, 4, 16, 8, C.plum); // and a hat with a veil
        c.dither(10, 9, 16, 13, C.ash);
        c.rect(10, 9, 16, 9, D(C.plum));
        c.set(15, 5, FRED);
      }
    },
    null,
    { round: true },
  );

  /* ---------- letters tied with ribbon ---------- */
  att(
    'letters-box-ribbon',
    'box of letters tied with ribbon love letters envelopes shoebox',
    false,
    (c, u) => {
      body(c, 0, 4, 13, 9, CARD);
      if (u) {
        c.rect(2, 2, 6, 4, C.paper); // a few left
        c.col(4, 2, 4, D(C.paper));
        c.line(8, 4, 10, 7, FRED); // the ribbon undone
        c.line(10, 7, 9, 9, FRED);
        paper(c, 15, 6, 22, 9); // one unfolded, the rest spread
        c.row(7, 16, 21, IN);
        c.row(8, 16, 19, IN);
        c.poly([[23, 9], [25, 6], [29, 7], [28, 9]], C.parchment);
        c.rect(30, 8, 35, 9, C.paper);
        c.set(34, 8, FRED);
      } else {
        c.rect(2, 0, 11, 4, C.paper);
        for (let x = 3; x < 11; x += 2) c.col(x, 0, 4, D(C.paper));
        c.set(10, 0, FRED); // a stamp
        c.row(2, 2, 11, FRED);
        c.rect(6, 1, 7, 3, FRED);
        c.set(5, 0, FRED);
        c.set(8, 0, FRED);
      }
    },
    (c, u) => {
      sideBody(c, 0, 4, 8, 9, CARD);
      if (u) {
        c.rect(2, 2, 4, 4, C.paper);
        paper(c, 10, 7, 15, 9);
        c.row(8, 11, 14, IN);
      } else {
        c.rect(1, 0, 7, 4, C.paper);
        c.row(2, 1, 7, FRED);
        c.set(4, 1, FRED);
      }
    },
  );

  /* ---------- a bird's nest on a rafter ---------- */
  function beamStub(c, x0, x1, y0, y1) {
    c.rect(x0, y0, x1, y1, W);
    c.row(y0, x0, x1, WL);
    c.row(y1, x0, x1, WD);
    dots(c, WD, [x0 + 3, y0 + 2, x0 + 4, y0 + 2, x1 - 4, y0 + 3]);
  }
  function nest(c, x0, x1, y, u) {
    const T = hex('#6a5438');
    c.oval(x0, y - 3, x1, y + 3, T);
    c.clearRect(x0, y - 4, x1, y - 2);
    c.dither(x0, y - 1, x1, y + 3, C.straw);
    c.row(y - 1, x0, x1, C.straw);
    dots(c, T, [x0 - 1, y - 1, x1 + 1, y, x0 + 2, y - 2, x1 - 3, y - 2]);
    const m = (x0 + x1) >> 1;
    if (u) {
      for (const dx of [-3, 0, 3]) {
        c.rect(m + dx, y - 3, m + dx + 1, y - 2, hex('#4a4038')); // they have hatched, and want feeding
        c.set(m + dx, y - 4, C.flame);
        c.set(m + dx + 1, y - 4, C.flameLight);
      }
      dots(c, hex('#a9c3c6'), [x0 + 1, y + 4, x1, y + 4]);
    } else for (const dx of [-3, 0, 3]) c.rect(m + dx, y - 3, m + dx + 1, y - 2, hex('#a9c3c6')), c.set(m + dx, y - 3, C.white);
  }
  att(
    'birds-nest-rafter',
    'birds nest rafter eggs twigs beam attic swallows',
    false,
    (c, u) => {
      beamStub(c, 0, 19, 8, 13);
      nest(c, 4, 15, 5, u);
    },
    (c, u) => {
      beamStub(c, 0, 7, 8, 13);
      nest(c, 0, 8, 5, u);
    },
  );

  /* ---------- wasps' nest ---------- */
  att(
    'wasp-nest-rafter',
    'wasp nest paper hanging rafter grey hornets attic',
    false,
    (c, u) => {
      const N = hex('#8d8672');
      beamStub(c, 0, 13, 0, 3);
      c.oval(2, 3, 11, 18, N);
      for (let y = 6; y < 18; y += 3) for (let x = 2; x <= 11; x++) if (c.get(x, y) === N) c.set(x, y + ((x >> 1) & 1), D(N));
      c.col(3, 7, 13, L(N));
      c.rect(6, 17, 7, 18, IN);
      if (u) {
        c.poly([[5, 8], [9, 7], [10, 13], [7, 15], [4, 12]], IN); // broken open
        c.dither(5, 9, 9, 13, C.straw);
        for (const [x, y] of [[14, 9], [-2, 13], [13, 16], [1, 20], [9, 21], [16, 4]]) c.set(x, y, C.flameLight), c.set(x + 1, y, K);
      } else c.set(8, 19, C.flameLight), c.set(9, 19, K);
    },
    null,
    { round: true },
  );

  /* ---------- the panel that comes out ---------- */
  const BOARD = hex('#6f5a44');
  att(
    'hidden-door-panel',
    'hidden door panel boarding secret crawlspace eaves attic wall',
    true,
    (c, u) => {
      planks(c, 0, 0, 21, 27, BOARD, 4);
      c.row(0, 0, 21, L(BOARD));
      c.rect(0, 26, 21, 27, D(BOARD));
      if (u) {
        c.rect(5, 8, 16, 25, IN); // someone has made a room in there
        c.rect(6, 22, 15, 25, hex('#4a463c'));
        c.row(22, 6, 15, hex('#5d584a'));
        candle(c, 13, 19, 21, true);
        c.rect(11, 16, 15, 18, hex('#5a4a2a'));
        c.set(13, 17, C.flameLight);
        c.rect(7, 20, 9, 21, C.steel);
        c.poly([[23, 27], [26, 9], [28, 9], [27, 27]], BOARD); // the panel stood aside
        c.line(26, 9, 23, 27, L(BOARD));
      } else {
        c.frame(5, 8, 16, 25, D(BOARD));
        c.set(15, 17, IN); // a finger hole
        dots(c, hex('#9a8f78'), [6, 25, 9, 26, 12, 26]); // crumbs of plaster
      }
    },
    (c, u) => {
      c.rect(0, 0, 2, 27, BOARD);
      c.col(0, 0, 27, L(BOARD));
      if (u) {
        c.col(2, 8, 25, IN);
        c.line(3, 27, 9, 10, BOARD);
        c.line(4, 27, 10, 10, D(BOARD));
        c.rect(3, 21, 4, 23, C.flameLight); // light on the floor outside
      }
    },
  );

  /* ---------- loft hatch ---------- */
  att(
    'loft-hatch-ladder',
    'loft hatch trapdoor ladder top opening floor attic way down',
    true,
    (c, u) => {
      body(c, 0, 14, 25, 17, W); // the kerb round the hole
      if (u) {
        planks(c, 1, 11, 24, 13, WD, 6); // shut, from underneath: the ladder has gone with it
        c.row(11, 1, 24, W);
        c.rect(11, 9, 14, 10, C.iron);
        c.rect(3, 12, 6, 12, C.iron); // and bolted
        c.set(7, 12, C.steel);
      } else {
        c.rect(2, 12, 23, 13, IN);
        c.dither(4, 13, 21, 13, hex('#6b6338'));
        planks(c, 1, 0, 24, 10, WD, 6); // the hatch stood open behind
        c.row(0, 1, 24, W);
        c.rect(11, 4, 14, 5, C.iron);
        c.col(8, 3, 14, C.steel); // the top of the ladder
        c.col(17, 3, 14, D(C.steel));
        c.row(6, 9, 16, C.steel);
        c.row(11, 9, 16, C.steel);
      }
    },
    (c, u) => {
      body(c, 0, 14, 19, 17, W);
      if (u) {
        c.rect(1, 11, 18, 13, WD);
        c.row(11, 1, 18, W);
        c.rect(8, 9, 10, 10, C.iron);
      } else {
        c.rect(1, 12, 18, 13, IN);
        c.rect(0, 0, 1, 13, WD);
        c.col(0, 0, 13, W);
        c.line(8, 13, 11, 3, C.steel);
        c.line(9, 13, 12, 3, D(C.steel));
        c.rect(12, 6, 13, 6, C.steel);
      }
    },
  );

  /* ---------- the bed of whoever lives up here ---------- */
  function ticking(c, x0, y0, x1, y1) {
    c.rect(x0, y0, x1, y1, C.cream);
    for (let x = x0 + 1; x <= x1; x += 3) c.col(x, y0, y1, hex('#6d7f8c'));
    c.row(y1, x0, x1, D(C.cream));
  }
  function bottleCandle(c, x, b, lit) {
    c.rect(x, b - 5, x + 2, b, hex('#3d5a40'));
    c.col(x, b - 5, b, hex('#587a5a'));
    candle(c, x + 1, b - 8, b - 6, lit);
    c.set(x + 2, b - 6, C.bone);
  }
  att(
    'mattress-squatter-candle',
    'mattress on the floor blanket candle someone lives here squatter bed attic',
    true,
    (c, u) => {
      ticking(c, 0, 7, 37, 11);
      c.oval(13, 8, 19, 11, hex('#9a8a5a')); // an old stain
      c.oval(1, 3, 9, 8, hex('#3d4350')); // a rolled coat for a pillow
      c.row(4, 3, 7, hex('#555b66'));
      if (u) {
        c.poly([[24, 8], [27, 2], [35, 1], [38, 5], [38, 11], [24, 11]], GREY); // the blanket thrown back, still warm
        c.line(27, 2, 35, 1, L(GREY));
        c.line(29, 4, 28, 10, D(GREY));
        c.line(34, 3, 35, 10, D(GREY));
        dots(c, D(C.cream), [12, 7, 15, 7, 20, 7]);
        c.rect(46, 8, 49, 11, C.steel); // a tin, opened, and a spoon
        c.row(8, 46, 49, FRED);
        c.set(50, 7, C.steel);
      } else {
        c.poly([[9, 8], [11, 4], [20, 3], [30, 5], [37, 4], [38, 11], [9, 11]], GREY);
        c.line(11, 4, 20, 3, L(GREY));
        c.line(20, 3, 30, 5, L(GREY));
        c.line(16, 5, 15, 10, D(GREY));
        c.line(27, 6, 28, 10, D(GREY));
        c.row(10, 10, 37, D(GREY));
      }
      bottleCandle(c, 41, 11, u);
    },
    (c, u) => {
      ticking(c, 0, 4, 19, 9);
      c.rect(0, 10, 19, 13, D(C.cream));
      c.row(13, 0, 19, mix(C.cream, 0.5));
      c.oval(4, 1, 15, 5, hex('#3d4350'));
      if (u) {
        c.rect(0, 9, 19, 12, GREY);
        c.row(8, 2, 17, L(GREY));
        c.rect(3, 7, 16, 8, GREY);
        dots(c, D(C.cream), [6, 6, 9, 7, 12, 6]);
      } else {
        c.rect(0, 5, 19, 12, GREY);
        c.row(5, 0, 19, L(GREY));
        c.line(5, 6, 6, 11, D(GREY));
        c.line(13, 6, 12, 11, D(GREY));
      }
      bottleCandle(c, 22, 13, u);
    },
    { base: 'side' },
  );

  /* ---------- bundles of newspapers ---------- */
  const NEWS = hex('#b5a47c');
  function bundle(c, x0, y0, x1, y1, tied = true) {
    for (let y = y0; y <= y1; y++) c.row(y, x0, x1, (y - y0) & 1 ? D(NEWS) : NEWS);
    c.row(y0, x0, x1, L(NEWS));
    if (tied) {
      const m = (x0 + x1) >> 1;
      c.col(m, y0, y1, hex('#5a4a3a'));
      c.set(m + 1, y0, hex('#5a4a3a'));
    }
  }
  att(
    'newspaper-bundles',
    'bundles of old newspapers tied string yellowed stacks attic',
    true,
    (c, u) => {
      bundle(c, 0, 4, 9, 15);
      bundle(c, 11, 8, 20, 15);
      if (u) {
        bundle(c, 11, 4, 20, 6, false); // one cut open and read: a face ringed in red
        paper(c, 22, 10, 33, 15, NEWS);
        c.rect(23, 11, 32, 11, IN);
        c.rect(23, 13, 26, 14, hex('#5a5448'));
        c.frame(22, 12, 27, 15, C.red);
        c.row(13, 28, 32, hex('#5a5448'));
        c.line(21, 7, 23, 9, hex('#5a4a3a'));
      } else {
        bundle(c, 11, 0, 20, 7);
        c.rect(1, 2, 8, 3, NEWS);
        c.row(2, 1, 8, L(NEWS));
      }
    },
    (c, u) => {
      bundle(c, 0, 4, 12, 15);
      c.row(9, 0, 12, hex('#5a4a3a'));
      if (u) paper(c, 14, 12, 19, 15, NEWS), c.row(13, 15, 18, IN), c.set(16, 14, C.red);
      else bundle(c, 1, 0, 11, 3);
    },
  );
};
