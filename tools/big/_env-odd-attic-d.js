/* Attic, part 4: odds and ends, and more signs of whoever is living up here. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, legs, body, sideBody, slab, eyes, arm, paper, glow, planks, cobweb, candle, pool, books } = H;
  const att = setting('env-attic', 'Attic');
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IN = hex('#17151c'),
    ROSE = hex('#8a5560'),
    FRED = hex('#8a4038'),
    KHAKI = hex('#7a7450'),
    TIN = hex('#8a8e94');

  /* ---------- a bucket under the leak ---------- */
  att(
    'leak-bucket-drips',
    'bucket under leak roof drips water galvanised pail attic',
    false,
    (c, u) => {
      c.poly([[1, 3], [10, 3], [9, 11], [2, 11]], TIN);
      c.row(3, 1, 10, L(TIN));
      c.row(4, 2, 9, u ? C.glass : C.water);
      c.col(2, 4, 10, L(TIN));
      c.row(7, 2, 9, D(TIN));
      c.line(1, 3, 0, 0, C.iron); // the handle
      c.line(10, 3, 11, 0, C.iron);
      c.row(-1, 1, 10, C.iron);
      c.col(6, -6, -4, C.glass); // a drop on its way
      if (u) {
        c.row(3, 2, 9, C.glass); // full, and running over
        c.col(3, 4, 10, C.water);
        c.col(8, 4, 10, C.water);
        pool(c, -4, 15, 11, C.water);
        c.col(6, -9, -4, C.glass);
      } else dots(c, hex('#3a3026'), [-1, 11, 12, 11]); // the boards are damp already
    },
    null,
    { round: true },
  );

  /* ---------- deck chairs ---------- */
  function stripeCloth(c, pts, a = FRED, b = C.bone) {
    c.poly(pts, a);
    const xs = pts.map((p) => p[0]),
      ys = pts.map((p) => p[1]);
    for (let y = Math.min(...ys); y <= Math.max(...ys); y++) for (let x = Math.min(...xs); x <= Math.max(...xs); x++) if (c.get(x, y) === a && (x >> 1) & 1) c.set(x, y, b);
  }
  att(
    'deck-chairs-folded',
    'deck chairs folded striped canvas wooden summer stored attic',
    true,
    (c, u) => {
      const folded = (x, y) => {
        stripeCloth(c, [[x + 1, y + 3], [x + 10, y + 3], [x + 10, y + 20], [x + 1, y + 20]]);
        c.col(x, y, 35, WL);
        c.col(x + 11, y, 35, W);
        c.row(y + 2, x, x + 11, W);
        c.row(y + 24, x, x + 11, W);
        c.row(31, x, x + 11, WD);
      };
      folded(5, 0);
      if (u) {
        // one set up, facing you, and sat in: the canvas still holds the shape
        stripeCloth(c, [[18, 14], [29, 14], [31, 30], [16, 30]]);
        c.oval(19, 20, 28, 28, mix(FRED, 0.6));
        c.dither(19, 20, 28, 28, mix(C.bone, 0.7));
        c.line(18, 12, 15, 35, WL);
        c.line(29, 12, 32, 35, W);
        c.row(13, 18, 29, W);
        c.row(31, 15, 32, W);
      } else folded(0, 4);
    },
    (c, u) => {
      c.line(0, 35, 5, 0, WL);
      c.line(1, 35, 6, 0, FRED);
      c.line(2, 35, 7, 0, W);
      if (u) {
        c.line(9, 35, 22, 12, WL); // set up, from the side
        c.line(10, 35, 23, 12, W);
        c.line(24, 35, 12, 22, W);
        c.line(22, 12, 26, 24, W);
        c.line(21, 14, 16, 26, FRED);
        c.line(16, 26, 11, 28, FRED);
        c.line(20, 14, 15, 26, C.bone);
      } else {
        c.line(3, 35, 8, 4, WL);
        c.line(4, 35, 9, 4, C.bone);
        c.line(5, 35, 10, 4, W);
      }
    },
  );

  /* ---------- the Christmas tree in its bag ---------- */
  att(
    'christmas-tree-bagged',
    'christmas tree artificial bagged tied up stored attic star',
    true,
    (c, u) => {
      const TREE = hex('#34503c'),
        BAG = hex('#6f7a70');
      c.rect(5, 34, 8, 37, WD); // trunk and stand
      c.rect(1, 37, 12, 38, FRED);
      if (u) {
        for (let i = 0; i < 4; i++) {
          const y = 6 + i * 7,
            r = 4 + i * 2;
          c.poly([[6, y - 3], [7, y - 3], [7 + r, y + 6], [6 - r, y + 6]], i & 1 ? TREE : hex('#3d5c44'));
          c.row(y + 6, 6 - r, 7 + r, D(TREE));
        }
        c.line(2, 16, 11, 19, C.brass); // tinsel, and three baubles nobody took off
        c.line(-1, 26, 13, 29, C.brass);
        c.rect(4, 22, 5, 23, FRED);
        c.rect(10, 31, 11, 32, C.gold);
        c.rect(1, 31, 2, 32, FRED);
        c.rect(15, 36, 22, 38, BAG);
        c.row(36, 16, 21, L(BAG));
      } else {
        c.poly([[5, 4], [8, 4], [11, 20], [11, 34], [2, 34], [2, 20]], BAG);
        c.line(5, 4, 2, 20, L(BAG));
        for (const y of [10, 19, 28]) c.row(y, 2, 11, hex('#5a4a3a'));
        c.dither(4, 12, 9, 33, TREE);
        c.dither(5, 5, 8, 9, TREE);
        c.rect(6, 2, 7, 4, TREE);
      }
      c.rect(6, 0, 7, 1, C.brass); // the star
      c.set(5, 1, C.brass);
      c.set(8, 1, C.brass);
      c.set(6, -1, C.brass);
    },
    null,
    { round: true },
  );

  /* ---------- tin bath ---------- */
  att(
    'tin-bath-leaning',
    'tin bath zinc tub hanging leaning old wash attic',
    true,
    (c, u) => {
      if (u) {
        // taken down and used: grey water, a cloth, soap
        c.poly([[0, 25], [33, 25], [30, 33], [3, 33]], TIN);
        c.row(25, 0, 33, L(TIN));
        c.row(26, 1, 32, hex('#5a6a6c'));
        c.line(1, 26, 4, 32, L(TIN));
        c.row(29, 3, 30, D(TIN));
        c.rect(-1, 27, 0, 28, C.iron);
        c.rect(33, 27, 34, 28, C.iron);
        c.rect(22, 24, 27, 28, hex('#9a8f78'));
        c.col(25, 25, 28, D(hex('#9a8f78')));
        c.rect(36, 32, 38, 33, C.bone);
        return;
      }
      c.oval(0, 0, 17, 33, TIN);
      c.oval(2, 2, 15, 31, D(TIN));
      c.oval(3, 4, 14, 31, mix(TIN, 0.55));
      c.col(1, 8, 25, L(TIN));
      c.rect(7, -1, 10, 0, C.iron); // the handle, and the nail it hung on
      dots(c, C.rust, [5, 26, 6, 27, 11, 8, 12, 20]);
      cobweb(c, 4, 6, 1, 1, 4);
    },
    (c, u) => {
      if (u) {
        c.poly([[0, 25], [17, 25], [15, 33], [2, 33]], TIN);
        c.row(25, 0, 17, L(TIN));
        c.row(26, 1, 16, hex('#5a6a6c'));
        c.rect(7, 27, 10, 28, C.iron);
        c.rect(10, 24, 14, 27, hex('#9a8f78'));
        return;
      }
      c.poly([[0, 33], [3, 0], [9, 0], [8, 33]], TIN);
      c.line(0, 33, 3, 0, L(TIN));
      c.col(8, 1, 33, D(TIN));
      c.line(5, 2, 4, 32, D(TIN));
    },
  );

  /* ---------- an iron bedstead, leaning ---------- */
  function bedEnd(c, x, top, b, w) {
    const I = C.iron;
    c.col(x, top, b, I);
    c.col(x + w - 1, top, b, C.ironDark);
    c.row(top + 2, x, x + w - 1, I);
    c.row(b - 8, x, x + w - 1, I);
    for (let i = x + 3; i < x + w - 1; i += 3) c.col(i, top + 3, b - 9, C.ironDark);
    c.set(x, top - 1, C.brass);
    c.set(x + w - 1, top - 1, C.brass);
  }
  function rolled(c, x, b) {
    c.rect(x, b - 17, x + 8, b, C.cream);
    for (let i = x + 1; i < x + 8; i += 3) c.col(i, b - 17, b, hex('#6d7f8c'));
    c.oval(x, b - 19, x + 8, b - 15, C.cream);
    c.oval(x + 2, b - 18, x + 6, b - 16, D(C.cream));
    c.row(b - 11, x, x + 8, hex('#5a4a3a'));
    c.row(b - 4, x, x + 8, hex('#5a4a3a'));
  }
  att(
    'bedstead-iron-leaning',
    'iron bedstead bed ends leaning rolled mattress stored attic',
    true,
    (c, u) => {
      bedEnd(c, 0, 1, 35, 19);
      bedEnd(c, 3, 12, 35, 19);
      if (u) {
        c.rect(14, 32, 47, 35, C.cream); // the mattress unrolled: someone means to sleep here
        for (let x = 15; x < 47; x += 3) c.col(x, 32, 35, hex('#6d7f8c'));
        c.row(35, 14, 47, D(C.cream));
        c.oval(22, 31, 30, 34, hex('#9a8a5a'));
        c.rect(15, 30, 20, 31, hex('#6a6a60'));
      } else rolled(c, 23, 35);
    },
    (c, u) => {
      c.line(0, 35, 5, 1, C.iron);
      c.line(1, 35, 6, 1, C.ironDark);
      c.line(4, 35, 8, 12, C.iron);
      c.set(5, 0, C.brass);
      if (u) c.rect(8, 32, 26, 35, C.cream), c.row(35, 8, 26, D(C.cream)), c.row(33, 9, 25, hex('#6d7f8c'));
      else rolled(c, 10, 35);
    },
  );

  /* ---------- camping stove and tins ---------- */
  function tinCan(c, x, b, col, open) {
    c.rect(x, b - 4, x + 3, b, TIN);
    c.rect(x, b - 3, x + 3, b - 1, col);
    c.col(x, b - 4, b, L(TIN));
    if (open) c.row(b - 4, x, x + 3, IN), c.line(x + 3, b - 5, x + 5, b - 7, TIN), c.line(x + 1, b - 5, x, b - 8, C.steel);
  }
  att(
    'camp-stove-tins',
    'camping stove gas burner pan tins of food mug someone living here',
    false,
    (c, u) => {
      const GAS = hex('#3d5a7a');
      body(c, 0, 7, 6, 11, GAS);
      c.rect(2, 5, 4, 6, C.iron);
      c.row(4, 0, 6, C.iron); // pan rest
      c.rect(0, 1, 7, 3, TIN); // the pan
      c.row(1, 0, 7, L(TIN));
      c.rect(8, 2, 11, 2, IN);
      if (u) {
        c.row(4, 1, 5, hex('#6a8fd0')); // lit
        c.set(3, 5, hex('#6a8fd0'));
        c.line(3, 0, 4, -2, C.ash); // steam
        c.line(4, -2, 3, -4, C.ash);
        c.line(5, -1, 6, -3, C.ash);
      }
      tinCan(c, 9, 11, FRED, u);
      tinCan(c, 14, 11, C.mustard, false);
      c.rect(19, 8, 22, 11, C.white); // enamel mug
      c.row(8, 19, 22, hex('#3d4a66'));
      c.set(23, 9, C.white);
      c.set(23, 10, C.white);
    },
    (c, u) => {
      const GAS = hex('#3d5a7a');
      body(c, 0, 7, 6, 11, GAS);
      c.rect(2, 5, 4, 6, C.iron);
      c.row(4, 0, 6, C.iron);
      c.rect(0, 1, 6, 3, TIN);
      c.row(1, 0, 6, L(TIN));
      if (u) c.row(4, 1, 5, hex('#6a8fd0')), c.line(3, 0, 4, -2, C.ash), c.line(4, -2, 3, -4, C.ash);
      tinCan(c, 8, 11, FRED, u);
    },
  );

  /* ---------- photographs and string ---------- */
  att(
    'photos-pinned-string',
    'photographs pinned board red string notes watching the family obsession',
    true,
    (c, u) => {
      const BD = hex('#7a6a52');
      body(c, 0, 0, 27, 21, BD);
      const ph = [[2, 2], [11, 1], [20, 3], [4, 11], [14, 12], [22, 13]];
      ph.forEach(([x, y], i) => {
        if (u && i === 4) return c.set(x + 2, y, C.red); // one has been taken down
        c.rect(x, y, x + 4, y + 5, C.white);
        c.rect(x + 1, y + 1, x + 3, y + 3, hex('#4a4a50'));
        c.set(x + 2, y + 2, hex('#9a8f84'));
        c.set(x + 2, y, C.red);
      });
      c.line(4, 2, 13, 1, C.blood); // the string from one to the next
      c.line(13, 1, 22, 3, C.blood);
      c.line(13, 1, 6, 11, C.blood);
      c.line(6, 11, 16, 12, C.blood);
      c.line(16, 12, 24, 13, C.blood);
      c.rect(9, 17, 12, 19, C.mustard); // notes
      c.row(18, 10, 11, IN);
      if (u) {
        for (const [x, y] of [ph[0], ph[2], ph[3]]) c.line(x, y + 1, x + 4, y + 5, C.red), c.line(x + 4, y + 1, x, y + 5, C.red); // crossed out, one by one
        c.frame(21, 12, 27, 19, C.red);
      }
    },
    (c, u) => {
      const BD = hex('#7a6a52');
      c.line(0, 21, 4, 0, L(BD));
      c.line(1, 21, 5, 0, BD);
      c.line(2, 21, 6, 0, C.white);
      c.set(6, 3, C.red);
      c.set(4, 13, C.red);
      if (u) c.rect(6, 20, 9, 21, C.white), c.set(7, 20, hex('#4a4a50')); // the one taken down, on the floor
    },
  );

  /* ---------- a hole in the floor to look through ---------- */
  att(
    'peephole-floorboard',
    'peephole floorboard hole light from below spying loose board attic',
    false,
    (c, u) => {
      planks(c, 0, 4, 23, 6, WD, 8);
      c.row(4, 0, 23, W);
      c.rect(2, 2, 8, 3, ROSE); // something to kneel on
      c.row(2, 2, 8, L(ROSE));
      if (u) {
        c.rect(10, 4, 17, 5, C.flameLight); // the board up: light, and voices
        c.poly([[10, 3], [17, 3], [20, -7], [8, -7]], hex('#8a7a3c'));
        c.dither(8, -7, 20, 3, C.glow);
        c.poly([[19, 6], [24, -6], [26, -6], [22, 6]], W);
        c.line(24, -6, 19, 6, WL);
      } else {
        c.rect(12, 4, 13, 4, C.flameLight);
        c.rect(12, 2, 13, 3, hex('#8a7a3c'));
      }
    },
    (c, u) => {
      planks(c, 0, 4, 11, 6, WD, 4, false);
      c.row(4, 0, 11, W);
      c.rect(1, 2, 4, 3, ROSE);
      if (u) {
        c.rect(6, 4, 9, 5, C.flameLight);
        c.poly([[6, 3], [9, 3], [11, -7], [5, -7]], hex('#8a7a3c'));
        c.dither(5, -7, 11, 3, C.glow);
        c.rect(12, -6, 13, 6, W);
        c.col(12, -6, 6, WL);
      } else c.set(7, 4, C.flameLight), c.set(7, 3, hex('#8a7a3c'));
    },
  );

  /* ---------- army kit bag ---------- */
  const kitBag = (stencil) => (c, u) => {
    c.rect(1, 6, 10, 25, KHAKI);
    c.col(1, 6, 25, L(KHAKI));
    c.row(25, 2, 9, D(KHAKI));
    c.clear(1, 25);
    c.clear(10, 25);
    c.line(4, 9, 3, 23, D(KHAKI));
    c.col(8, 8, 24, D(KHAKI));
    if (stencil) {
      dots(c, C.bone, [4, 13, 5, 13, 6, 13, 4, 15, 6, 15, 4, 17, 5, 17, 6, 17]);
      c.row(20, 3, 8, C.bone);
    }
    if (u) {
      c.poly([[1, 6], [3, 3], [9, 4], [10, 6]], D(KHAKI)); // opened, and gone through
      c.row(5, 3, 8, IN);
      c.rect(13, 21, 17, 25, hex('#2a2422')); // boots
      c.rect(13, 24, 19, 25, hex('#2a2422'));
      paper(c, 21, 23, 26, 25);
      c.row(24, 22, 25, IN);
      c.rect(28, 22, 29, 23, FRED); // a medal
      c.rect(28, 24, 29, 25, C.gold);
    } else {
      c.poly([[2, 6], [4, 2], [7, 2], [9, 6]], KHAKI);
      c.row(4, 3, 8, C.bone); // the cord
      c.rect(5, 0, 6, 1, KHAKI);
      c.line(8, 4, 11, 8, C.bone);
    }
  };
  att('kit-bag-army', 'army kit bag khaki canvas sack stencilled number soldier attic', false, kitBag(true), kitBag(false));

  /* ---------- encyclopaedias ---------- */
  att(
    'encyclopaedias-stack',
    'encyclopaedias stack of thick books volumes pile attic',
    true,
    (c, u) => {
      const vol = (x, y, w = 13) => {
        c.rect(x, y, x + w, y + 2, C.wine);
        c.row(y, x, x + w, L(C.wine));
        c.col(x + 2, y, y + 2, C.gold);
        c.col(x + w - 2, y, y + 2, C.gold);
        c.rect(x + 5, y + 1, x + 7, y + 1, C.gold);
      };
      const xs = [0, 1, 0, 2, 1, 0, 1];
      for (let i = 0; i < (u ? 3 : 7); i++) vol(xs[i], 21 - i * 3);
      if (u) {
        // the tower has come down
        c.poly([[14, 23], [22, 12], [25, 14], [18, 23]], C.wine);
        c.line(22, 12, 14, 23, L(C.wine));
        c.poly([[19, 23], [27, 16], [30, 18], [24, 23]], D(C.wine));
        c.line(21, 22, 27, 17, C.gold);
        c.rect(27, 22, 37, 23, C.paper); // one fallen open
        c.col(32, 21, 23, D(C.paper));
        c.row(21, 27, 37, C.wine);
        c.rect(28, 22, 30, 22, hex('#5a5448'));
      } else {
        c.poly([[2, 2], [7, -1], [8, -1], [13, 2]], C.wine); // the top one face down, like a tent
        c.row(2, 2, 13, D(C.wine));
        c.line(3, 2, 7, 0, C.paper);
        c.line(12, 2, 8, 0, C.paper);
      }
    },
    (c, u) => {
      const vol = (x, y) => (c.rect(x, y, x + 9, y + 2, C.paper), c.frame(x, y, x + 9, y + 2, C.wine), c.row(y + 1, x + 1, x + 8, C.paper), c.col(x + 9, y, y + 2, D(C.wine)));
      const xs = [0, 1, 0, 1, 1, 0, 1];
      for (let i = 0; i < (u ? 3 : 7); i++) vol(xs[i], 21 - i * 3);
      if (u) c.poly([[11, 23], [16, 14], [19, 15], [15, 23]], C.wine), c.poly([[16, 23], [21, 18], [23, 20], [20, 23]], D(C.wine)), c.line(13, 22, 17, 15, C.paper);
      else c.poly([[1, 2], [5, -1], [6, -1], [10, 2]], C.wine), c.row(2, 1, 10, D(C.wine));
    },
  );

  /* ---------- a chandelier in a crate ---------- */
  function crate(c, x0, x1, y0, y1, fill) {
    c.rect(x0, y0, x1, y1, IN);
    fill();
    for (let y = y0 + 2; y < y1; y += 5) c.rect(x0, y, x1, y + 2, WL), c.row(y + 2, x0, x1, W), c.row(y, x0, x1, L(WL));
    c.rect(x0, y0, x0 + 1, y1, W);
    c.rect(x1 - 1, y0, x1, y1, WD);
    c.col(x0, y0, y1, WL);
  }
  function drops(c, pts) {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], C.glassLight), c.set(pts[i], pts[i + 1] + 1, C.glass);
  }
  att(
    'chandelier-crated',
    'chandelier in a crate crystal brass packed straw attic',
    true,
    (c, u) => {
      crate(c, 0, 21, 6, 25, () => {
        c.speckle(1, 7, 20, 24, C.straw, 2, 3);
        c.rect(9, 8, 12, 22, C.brass);
        c.row(13, 3, 18, C.brass);
        c.row(19, 5, 16, C.brass);
        drops(c, [4, 14, 8, 15, 13, 15, 17, 14, 6, 20, 15, 20]);
      });
      if (u) {
        // it has lit itself: no wire, no candles
        c.rect(10, -5, 11, 5, C.brass);
        c.row(-5, 9, 12, C.brass);
        c.row(1, 3, 18, C.brass);
        c.rect(2, -1, 4, 1, C.brass);
        c.rect(17, -1, 19, 1, C.brass);
        for (const x of [3, 10, 18]) c.rect(x, -3 - (x === 10 ? 5 : 0), x, -2 - (x === 10 ? 5 : 0), C.flameLight), c.set(x, -4 - (x === 10 ? 5 : 0), C.white);
        drops(c, [5, 2, 8, 2, 13, 2, 16, 2, 3, 2, 18, 2]);
        c.dither(1, 6, 20, 9, C.glow);
        dots(c, C.straw, [23, 25, 25, 24, 26, 25, -2, 25]);
      } else {
        c.rect(-1, 4, 22, 6, WL); // the lid nailed on
        c.row(4, -1, 22, L(WL));
        c.row(6, -1, 22, W);
        dots(c, C.iron, [1, 5, 10, 5, 20, 5]);
      }
    },
    (c, u) => {
      crate(c, 0, 13, 6, 25, () => {
        c.speckle(1, 7, 12, 24, C.straw, 2, 5);
        c.rect(6, 8, 7, 22, C.brass);
        c.row(13, 3, 10, C.brass);
        drops(c, [4, 14, 9, 14, 5, 20]);
      });
      if (u) {
        c.rect(6, -5, 7, 5, C.brass);
        c.row(1, 2, 11, C.brass);
        for (const x of [2, 11]) c.rect(x, -1, x, 0, C.brass), c.rect(x, -3, x, -2, C.flameLight);
        c.set(6, -7, C.flameLight);
        c.set(6, -6, C.flameLight);
        drops(c, [4, 2, 9, 2]);
        c.dither(1, 6, 12, 9, C.glow);
      } else {
        c.rect(-1, 4, 14, 6, WL);
        c.row(4, -1, 14, L(WL));
        c.row(6, -1, 14, W);
      }
    },
  );
};
