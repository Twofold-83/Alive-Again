/* Surreal, part 2: eggs, eyes, drawers and stairs: the furniture of the impossible room. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, dayAt, night, day, wheel, flame, clock, drawer, bowler, apple, eye, notes } = H;
  const { CLD, NI, SKY, DAY, DAYl, MOON, MOONd, OUT, PORC, SEA, SEAl, SAND, APPLE, FELT, PLASTER, LOBSTER, GIR, BRICK, PINK } = P;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    MARB = hex('#a9a69e'),
    EGG = hex('#d6d0be'),
    YOLK = hex('#c99a3a'),
    WARM = hex('#d9b45a');

  O('surreal-birdcage-with-egg', 'birdcage with one huge egg in it instead of a bird brass cage on a stand elective affinities surreal', {
    w: 22, h: 40,
    f(c, u) {
      const b = 38,
        B = C.brass;
      c.rect(10, 26, 11, b - 2, WD); // stand
      c.rect(6, b - 1, 15, b, WD);
      c.rect(3, 24, 18, 25, B);
      // the egg
      c.oval(6, 9, 15, 23, EGG);
      c.col(7, 13, 19, C.white);
      dots(c, D(EGG), [13, 19, 14, 16, 12, 21]);
      if (u) {
        // cracked: an eye looks out
        dots(c, NI, [9, 12, 10, 13, 11, 12, 12, 14, 13, 13, 10, 15, 11, 17, 12, 16]);
        c.rect(10, 14, 12, 15, NI);
        c.set(11, 14, WARM);
        dots(c, EGG, [8, 23, 13, 23]);
      }
      // the cage over it
      for (let x = 3; x <= 18; x += 3) {
        c.col(x, 8, 24, B);
        c.line(x, 8, 10 + (x > 10 ? 1 : 0), 3, B);
      }
      c.row(15, 3, 18, D(B));
      c.rect(10, 1, 11, 2, B);
      ring(c, 9, 0, 12, 1, B);
      return () => u && dots(c, EGG, [5, 26, 15, 27]);
    },
    s: 'same',
  });

  O('surreal-cabinet-with-eye', 'cabinet with an eye inside tall narrow cupboard that watches when opened false mirror surreal', {
    w: 24, h: 42, uw: 32, udx: 4,
    f(c, u) {
      const b = 40;
      c.rect(2, 4, 21, b - 2, W);
      c.rect(1, 2, 22, 4, WD);
      c.row(2, 1, 22, WL);
      c.col(2, 5, b - 2, WL);
      c.rect(2, b - 1, 4, b, WD);
      c.rect(19, b - 1, 21, b, WD);
      if (!u) {
        c.col(11, 5, b - 3, WD);
        c.col(12, 5, b - 3, WL);
        for (const x0 of [4, 14]) c.frame(x0, 7, x0 + 5, b - 5, WD);
        c.set(10, 22, C.brass);
        c.set(13, 22, C.brass);
        c.set(13, 24, NI);
      } else {
        c.rect(4, 6, 19, b - 3, NI);
        const IR = hex('#5a7a8c');
        eye(c, 4, 15, 19, 25, IR, true, hex('#d8d2c4'));
        repaint(c, 4, 15, 19, 25, IR, dayAt(1)); // the sky is in its iris
        ring(c, 7, 16, 15, 24, hex('#3f5a6a'));
        dots(c, PINK, [4, 20, 19, 20]);
        c.rect(-2, 4, 1, b - 3, WD);
        c.col(-2, 4, b - 3, W);
        c.rect(22, 4, 25, b - 3, WD);
        c.col(25, 4, b - 3, D(WD));
      }
    },
    sw: 12, suw: 18,
    s(c, u) {
      const b = 40;
      c.rect(2, 4, 9, b - 2, W);
      c.rect(1, 2, 10, 4, WD);
      c.row(2, 1, 10, WL);
      c.col(2, 5, b - 2, WL);
      c.frame(4, 7, 8, b - 5, WD);
      c.rect(2, b - 1, 3, b, WD);
      c.rect(8, b - 1, 9, b, WD);
      if (u) {
        c.rect(10, 4, 15, b - 3, W);
        c.col(15, 4, b - 3, WD);
        c.frame(11, 7, 14, b - 5, WD);
      } else c.set(10, 22, C.brass);
      return () => u && dots(c, hex('#d8d2c4'), [10, 19, 10, 20, 10, 21]);
    },
  });

  O('surreal-stairs-that-return', 'stairs that return to where they began endless staircase running round the top of a stone block surreal', {
    w: 36, h: 34,
    f(c, u) {
      const b = 32,
        S = hex('#b3ada0'),
        Sd = hex('#8f897c');
      // the far flight, going down as it goes right
      for (let i = 0; i < 6; i++) c.rect(4 + i * 5, 4 + i * 2, 8 + i * 5, 20, Sd);
      // the near flight, going up as it goes right: and still they meet at both ends
      for (let i = 0; i < 6; i++) {
        c.rect(2 + i * 5, 18 - i * 2, 6 + i * 5 + 1, b, S);
        c.row(18 - i * 2, 2 + i * 5, 6 + i * 5, L(S));
      }
      c.rect(2, 20, 33, b, S);
      c.col(2, 19, b, L(S));
      c.rect(2, b - 1, 33, b, Sd);
      c.rect(27, 8, 33, 14, S);
      // an archway in the block
      c.rect(14, 23, 20, b, NI);
      c.oval(14, 21, 20, 26, NI);
      // someone small going round
      const man = (x, y) => {
        c.rect(x, y - 3, x, y - 1, FELT);
        c.set(x, y - 4, PINK);
        c.row(y - 5, x - 1, x + 1, FELT);
      };
      if (!u) man(9, 15);
      else {
        man(24, 9);
        man(11, 5); // and met himself
      }
    },
    s: 'same',
  });

  function chessTable(c, u, side) {
    const b = 22,
      x0 = 2,
      x1 = side ? 19 : 29,
      A = hex('#cfc6ac'),
      B2 = hex('#3a3440');
    // legs
    c.rect(x0 + 1, 12, x0 + 2, b, WD);
    c.rect(x1 - 2, 12, x1 - 1, b, WD);
    c.rect(x0, 10, x1, 11, W);
    // the board, seen a little from above: squares missing here and there
    for (let j = 0; j < 4; j++)
      for (let x = x0 + 1; x <= x1 - 1; x++) {
        const i = Math.floor((x - x0 - 1) / 3),
          hole = (i * 3 + j * 5) % 7 === 2 || (i === 4 && j === 1);
        if (!hole) c.set(x, 6 + j, (i + j) % 2 ? A : B2);
      }
    c.row(5, x0 + 1, x1 - 1, W);
    // men
    const pawn = (x, y, col) => {
      c.rect(x, y - 2, x + 1, y, col);
      c.rect(x, y - 4, x + 1, y - 3, col);
      c.set(x - 1, y, col);
      c.set(x + 2, y, col);
    };
    if (!u) {
      pawn(x0 + 4, 6, A);
      pawn(x1 - 6, 7, B2);
      if (!side) pawn(15, 5, B2);
    } else {
      pawn(x0 + 4, 6, A);
      // two have gone through the holes
      c.rect(x1 - 9, b - 1, x1 - 5, b, B2);
      c.set(x1 - 10, b, B2);
      if (!side) {
        c.rect(10, b - 1, 14, b, A);
        c.set(15, b, A);
      }
    }
    return () => u && dots(c, B2, [x1 - 7, 14, x1 - 7, 17]);
  }
  O('surreal-chessboard-table-holes', 'chess table with squares missing from the board the pieces fall through the holes wooden table surreal', {
    w: 32, h: 24,
    f: (c, u) => chessTable(c, u, false),
    sw: 22,
    s: (c, u) => chessTable(c, u, true),
  });

  O('surreal-torso-with-drawers', 'plaster torso statue with drawers in it armless venus on a plinth chest of drawers body surreal', {
    w: 20, h: 44, uw: 24,
    f(c, u) {
      const b = 42,
        PL = PLASTER;
      c.rect(4, b - 5, 15, b, MARB);
      c.row(b - 5, 4, 15, L(MARB));
      c.row(b, 4, 15, D(MARB));
      // head, neck, torso to the hips
      c.oval(7, 1, 12, 8, PL);
      c.rect(8, 8, 11, 10, PL);
      c.poly([[5, 11], [14, 11], [15, 14], [13, 22], [15, 30], [14, b - 6], [5, b - 6], [4, 30], [6, 22], [4, 14]], PL);
      c.col(5, 12, 20, L(PL));
      c.rect(3, 11, 4, 14, D(PL)); // the arms broken off at the shoulder
      c.rect(15, 11, 16, 14, D(PL));
      c.rect(7, 0, 12, 2, D(PL)); // hair
      dots(c, D(PL), [8, 5, 11, 5, 9, 7, 10, 7, 7, 28, 12, 33]);
      // the drawers
      const dr = (y, x0, x1, open) => {
        if (!open) {
          c.frame(x0, y, x1, y + 4, D(PL));
          c.set((x0 + x1) >> 1, y + 2, C.brass);
        } else {
          c.rect(x0, y, x1, y + 1, NI);
          c.rect(x0 - 1, y + 2, x1 + 1, y + 6, PL);
          c.frame(x0 - 1, y + 2, x1 + 1, y + 6, D(PL));
          c.set((x0 + x1) >> 1, y + 4, C.brass);
        }
      };
      dr(13, 6, 13, u);
      dr(21, 7, 12, false);
      dr(27, 6, 13, u);
      if (u) {
        c.rect(14, 15, 18, 16, hex('#8a5a5e')); // a silk thing hanging out of the top one
        c.col(18, 16, 20, hex('#8a5a5e'));
      }
    },
    sw: 14, suw: 18,
    s(c, u) {
      const b = 42,
        PL = PLASTER;
      c.rect(2, b - 5, 11, b, MARB);
      c.row(b - 5, 2, 11, L(MARB));
      c.oval(4, 1, 10, 8, PL);
      c.set(11, 5, PL); // nose
      c.rect(4, 0, 8, 2, D(PL));
      c.rect(5, 8, 8, 10, PL);
      c.poly([[4, 11], [9, 11], [11, 15], [9, 22], [10, 30], [9, b - 6], [4, b - 6], [3, 30], [4, 22], [3, 14]], PL);
      c.col(4, 12, 20, L(PL));
      c.oval(4, 11, 8, 15, D(PL)); // the stump of the arm
      if (!u) {
        c.col(11, 14, 17, D(PL));
        c.col(10, 28, 31, D(PL));
      } else {
        c.rect(11, 15, 15, 19, PL); // drawers standing out of her front
        c.frame(11, 15, 15, 19, D(PL));
        c.rect(10, 29, 14, 33, PL);
        c.frame(10, 29, 14, 33, D(PL));
        c.rect(12, 14, 14, 14, hex('#8a5a5e'));
      }
    },
  });

  O('surreal-mirror-back-of-head', 'mirror that shows the back of your head gilt mirror on a mantel shelf a man seen from behind surreal', {
    w: 24, h: 40,
    f(c, u) {
      const b = 38;
      // the shelf it stands on
      c.rect(1, 28, 22, 30, MARB);
      c.row(28, 1, 22, L(MARB));
      c.rect(3, 31, 20, b, MARB);
      c.col(3, 31, b, L(MARB));
      c.rect(7, 33, 16, b, D(MARB));
      c.rect(15, 25, 19, 27, hex('#6a3440')); // a book on the shelf
      c.row(26, 15, 19, PORC);
      // frame and glass
      c.rect(3, 1, 20, 27, C.gold);
      c.frame(3, 1, 20, 27, C.brass);
      c.rect(5, 3, 18, 25, hex('#6f7f80'));
      // the man in the glass
      c.poly([[5, 25], [5, 19], [9, 16], [14, 16], [18, 19], [18, 25]], FELT); // shoulders
      if (!u) {
        c.oval(8, 6, 15, 16, hex('#3a2c26')); // the back of his head
        c.rect(10, 15, 13, 17, PINK);
        c.row(17, 9, 14, PORC);
        dots(c, hex('#5a4638'), [10, 8, 12, 9, 13, 12]);
      } else {
        c.oval(8, 6, 15, 16, PINK); // he has turned: there is no face
        c.rect(8, 6, 15, 8, hex('#3a2c26'));
        c.rect(10, 15, 13, 17, PINK);
        c.poly([[10, 17], [13, 17], [12, 21], [11, 21]], hex('#6a3440'));
        c.row(17, 9, 14, PORC);
      }
      c.line(6, 8, 9, 4, hex('#8f9d9c'));
    },
    sw: 12,
    s(c, u) {
      const b = 38;
      c.rect(1, 28, 10, 30, MARB);
      c.row(28, 1, 10, L(MARB));
      c.rect(2, 31, 8, b, MARB);
      c.col(2, 31, b, L(MARB));
      c.poly([[3, 1], [5, 1], [6, 27], [4, 27]], C.gold); // leaning back on the wall
      c.line(5, 2, 6, 26, hex('#6f7f80'));
      c.rect(7, 25, 9, 27, hex('#6a3440'));
      if (u) c.set(6, 12, PINK);
    },
  });

  function eggChair(c, u, side) {
    const b = 26,
      CH = hex('#7a5a3a');
    if (!side) {
      c.rect(3, 2, 4, b, CH);
      c.rect(11, 2, 12, b, CH);
      c.rect(3, 3, 12, 4, CH);
      c.rect(3, 8, 12, 9, CH);
      c.col(7, 5, 7, CH);
      c.col(8, 5, 7, CH);
      c.rect(2, 15, 13, 16, WL);
      c.row(21, 4, 11, D(CH));
      c.oval(4, 6, 11, 15, EGG);
      c.col(5, 9, 12, C.white);
    } else {
      c.rect(3, 2, 4, b, CH);
      c.rect(3, 15, 12, 16, WL);
      c.rect(11, 17, 12, b, CH);
      c.row(21, 5, 10, D(CH));
      c.oval(5, 6, 12, 15, EGG);
      c.col(6, 9, 12, C.white);
    }
    const ex = side ? 5 : 4;
    if (u) {
      // broken where it sat
      c.clearRect(ex, 5, ex + 7, 9);
      dots(c, EGG, [ex, 9, ex + 2, 8, ex + 4, 9, ex + 6, 8, ex + 7, 9]);
      c.rect(ex + 1, 10, ex + 6, 11, YOLK);
      c.rect(ex + 5, 12, ex + 6, 16, YOLK);
      c.col(ex + 6, 17, 22, YOLK);
      c.set(ex + 6, 23, D(YOLK));
      if (!side) {
        c.rect(3, 3, 12, 4, CH);
        c.rect(3, 8, 4, 9, CH);
        c.rect(11, 8, 12, 9, CH);
        c.col(7, 5, 7, CH);
        c.col(8, 5, 7, CH);
      }
    }
    return () => u && (c.row(b, ex + 4, ex + 8, YOLK), c.set(ex + 3, b, EGG));
  }
  O('surreal-egg-on-chair', 'egg sitting on a chair one great white egg on a plain wooden kitchen chair surreal', {
    w: 16, h: 28,
    f: (c, u) => eggChair(c, u, false),
    sw: 16,
    s: (c, u) => eggChair(c, u, true),
  });

  O('surreal-umbrella-stand-raining-men', 'umbrella stand under a rain of little men in bowler hats falling out of the air golconda surreal', {
    w: 22, h: 44,
    f(c, u) {
      const b = 42;
      // the stand
      c.rect(6, 28, 15, b, C.brass);
      c.col(6, 28, b, L(C.brass));
      c.rect(5, 27, 16, 28, C.gold);
      c.rect(5, b - 1, 16, b, D(C.brass));
      c.row(34, 6, 15, D(C.brass));
      c.col(13, 20, 27, WD); // a walking stick
      c.rect(13, 19, 15, 19, WD);
      if (!u) {
        c.col(9, 16, 27, FELT); // furled umbrella
        c.rect(8, 19, 10, 27, FELT);
        c.rect(8, 14, 9, 15, WD);
        c.set(7, 14, WD);
      } else {
        // put up: they land on it
        c.col(9, 12, 27, WD);
        c.poly([[9, 10], [1, 17], [18, 17]], FELT);
        for (const x of [5, 9, 13]) c.line(9, 10, x, 17, hex('#4a4650'));
        c.set(9, 9, C.steel);
      }
      return () => {
        const man = (x, y) => {
          const t = part(5, 10, (t) => {
            t.row(2, 1, 3, FELT);
            t.set(2, 1, FELT);
            t.set(2, 3, PINK);
            t.rect(1, 4, 3, 6, hex('#3c3a46'));
            t.set(1, 7, NI);
            t.set(3, 7, NI);
          });
          t.outline();
          c.stamp(t, x - 2, y - 2);
        };
        if (!u) for (const [x, y] of [[3, 2], [10, 5], [18, 1], [18, 14], [3, 15]]) man(x, y);
        else for (const [x, y] of [[4, 1], [15, 2], [19, 19], [2, 22]]) man(x, y);
      };
    },
    s: 'same',
  });

  O('surreal-long-legged-table', 'table on impossibly long thin legs a small laid table high over your head glass and cloth surreal', {
    w: 24, h: 56,
    f(c, u) {
      const b = 54;
      for (const x of [4, 19]) {
        c.col(x, 12, b, WD);
        c.rect(x - 1, 30, x, 31, W);
        c.set(x, b, W);
      }
      c.col(8, 12, b - 3, D(WD));
      c.col(15, 12, b - 3, D(WD));
      c.rect(2, 9, 21, 10, W);
      c.row(9, 2, 21, WL);
      c.poly([[5, 9], [18, 9], [17, 14], [6, 14]], PORC); // the cloth
      c.row(14, 6, 17, D(PORC));
      if (!u) {
        c.rect(8, 4, 10, 8, hex('#9ebcc2')); // a glass
        c.rect(8, 6, 10, 8, hex('#6a2332'));
        c.rect(14, 6, 17, 8, hex('#b8a47c')); // a loaf
        c.row(6, 14, 17, hex('#a07e4c'));
      } else {
        // the glass went over the edge
        c.rect(14, 6, 17, 8, hex('#b8a47c'));
        c.row(6, 14, 17, hex('#a07e4c'));
        c.rect(6, 9, 9, 9, hex('#6a2332'));
        c.rect(1, b - 1, 3, b, hex('#9ebcc2'));
        c.set(5, b, hex('#9ebcc2'));
        c.set(7, b - 1, hex('#9ebcc2'));
        c.row(b, 8, 12, hex('#6a2332'));
      }
      return () => u && dots(c, hex('#6a2332'), [6, 16, 6, 22, 6, 29, 6, 37, 6, 45]);
    },
    sw: 16,
    s(c, u) {
      const b = 54;
      for (const x of [4, 11]) {
        c.col(x, 12, b, WD);
        c.rect(x - 1, 30, x, 31, W);
      }
      c.rect(2, 9, 13, 10, W);
      c.row(9, 2, 13, WL);
      c.poly([[4, 9], [11, 9], [10, 14], [5, 14]], PORC);
      c.rect(8, 6, 10, 8, hex('#b8a47c'));
      if (!u) {
        c.rect(5, 4, 6, 8, hex('#9ebcc2'));
        c.rect(5, 6, 6, 8, hex('#6a2332'));
      } else {
        c.rect(4, 9, 6, 9, hex('#6a2332'));
        c.rect(1, b - 1, 2, b, hex('#9ebcc2'));
        c.row(b, 5, 8, hex('#6a2332'));
      }
      return () => u && dots(c, hex('#6a2332'), [3, 16, 3, 24, 3, 33, 3, 42]);
    },
  });

  O('surreal-man-with-apple-face', 'man in a bowler hat and overcoat with a green apple hanging before his face standing figure son of man surreal', {
    w: 20, h: 42,
    f(c, u) {
      const b = 40,
        COAT = hex('#34323c');
      c.rect(4, 14, 15, 34, COAT);
      c.rect(3, 15, 4, 28, COAT);
      c.rect(15, 15, 16, 28, COAT);
      c.col(3, 16, 27, L(COAT));
      c.col(10, 18, 34, NI);
      dots(c, NI, [9, 22, 9, 26]);
      c.rect(3, 29, 4, 30, PINK);
      c.rect(15, 29, 16, 30, PINK);
      c.poly([[8, 14], [11, 14], [10, 19], [9, 19]], PORC); // shirt
      c.col(9, 15, 19, C.blood);
      c.col(10, 15, 19, C.blood);
      c.rect(6, 35, 8, b - 1, COAT);
      c.rect(11, 35, 13, b - 1, COAT);
      c.rect(5, b, 8, b, NI);
      c.rect(11, b, 14, b, NI);
      c.oval(6, 6, 13, 14, PINK);
      bowler(c, 5, 1);
      c.rect(5, 6, 14, 6, FELT);
      if (!u) apple(c, 6, 8, 13, 14, APPLE);
      else {
        // the apple drifts aside; behind it he has no face at all
        c.row(13, 9, 10, D(PINK));
      }
      return () => {
        if (!u) return;
        const t = part(10, 11, (t) => apple(t, 1, 3, 8, 9, APPLE));
        t.outline();
        c.stamp(t, 11, 7);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 40,
        COAT = hex('#34323c');
      c.rect(4, 14, 9, 34, COAT);
      c.col(4, 15, 30, L(COAT));
      c.rect(6, 16, 8, 28, D(COAT)); // arm
      c.rect(6, 29, 8, 30, PINK);
      c.rect(5, 35, 8, b - 1, COAT);
      c.rect(5, b, 10, b, NI);
      c.oval(4, 6, 10, 14, PINK);
      c.rect(4, 6, 6, 13, hex('#3a2c26')); // hair at the back
      bowler(c, 2, 1);
      if (!u) {
        // the apple hangs a hand in front of him
        c.oval(10, 8, 12, 13, APPLE);
        c.set(11, 7, WD);
      } else {
        c.set(10, 10, D(PINK));
      }
      return () => {
        if (!u) return;
        c.set(12, 16, APPLE);
      };
    },
  });

  O('surreal-easel-painted-view', 'easel with a painting that carries on the view behind it exactly sky canvas human condition surreal', {
    w: 28, h: 44, uw: 36,
    f(c, u) {
      const b = 42;
      c.line(6, 3, 2, b, W);
      c.line(21, 3, 25, b, W);
      c.col(13, 1, 6, W);
      c.col(14, 30, b - 4, WD);
      c.rect(3, 29, 24, 30, WD);
      if (!u) {
        day(c, 4, 7, 23, 28, 5);
        c.rect(4, 23, 23, 28, P.GRASS);
        c.row(23, 4, 23, L(P.GRASS));
        c.rect(15, 16, 16, 23, hex('#5a4638'));
        c.oval(12, 11, 19, 18, hex('#46604a'));
        c.col(23, 7, 28, PORC); // only the tacked edge gives it away
        dots(c, NI, [23, 9, 23, 15, 23, 21, 23, 27]);
      } else {
        // the canvas taken down: where it stood there is a hole in the world
        c.rect(4, 7, 23, 28, NI);
        dots(c, hex('#2a2838'), [7, 10, 12, 14, 18, 11, 9, 20, 16, 23, 20, 18]);
        c.poly([[26, b], [28, 20], [34, 20], [34, b]], PORC); // the picture leans against the leg, its back to you
        c.frame(28, 21, 33, b - 1, WL);
        c.line(28, 21, 33, b - 1, WL);
      }
    },
    sw: 16,
    s(c, u) {
      const b = 42;
      c.line(9, 3, 5, b, W);
      c.line(9, 3, 13, b, WD);
      c.rect(4, 29, 7, 30, WD);
      if (!u) {
        c.poly([[8, 7], [9, 7], [7, 28], [6, 28]], PORC);
        c.col(6, 8, 28, DAY);
      } else {
        c.rect(2, 22, 3, b, PORC); // down, leaning
        c.col(2, 22, b, WL);
      }
    },
  });

  O('surreal-boots-with-toes', 'pair of boots that turn into bare feet at the toes leather lace up boots red model surreal', {
    w: 22, h: 18,
    f(c, u) {
      const b = 16,
        BT = hex('#5a4638');
      const boot = (x, k) => {
        c.rect(x + 1, 3 - k, x + 6, 10 - k, BT);
        c.rect(x, 2 - k, x + 7, 3 - k, D(BT));
        c.poly([[x + 1, 9 - k], [x + 6, 9 - k], [x + 7, b - 1 - k], [x, b - 1 - k]], BT);
        c.col(x + 1, 4 - k, 9 - k, L(BT));
        for (let y = 5 - k; y <= 9 - k; y += 2) c.row(y, x + 3, x + 4, PORC);
        // the toes
        c.rect(x, b - 3 - k, x + 7, b - k, PINK);
        c.row(b - 3 - k, x + 1, x + 6, blend(BT, PINK, 0.5));
        for (let i = 1; i <= 7; i += 2) c.set(x + i, b - k, D(PINK));
        c.row(b - 1 - k, x, x + 7, PINK);
      };
      boot(2, 0);
      boot(12, u ? 3 : 0); // one lifts for a step
      if (u) c.row(b, 13, 18, NI);
      return () => u && dots(c, hex('#8a7a64'), [11, b, 21, b - 1]);
    },
    sw: 22,
    s(c, u) {
      const b = 16,
        BT = hex('#5a4638');
      const boot = (x, k, col) => {
        c.rect(x, 3 - k, x + 5, 12 - k, col);
        c.rect(x - 1, 2 - k, x + 6, 3 - k, D(col));
        c.rect(x, 11 - k, x + 8, b - k, col);
        c.poly([[x + 6, 11 - k], [x + 13, b - 3 - k], [x + 13, b - k], [x + 6, b - k]], PINK); // the bare front of the foot
        c.row(b - k, x - 1, x + 5, NI);
        for (let i = 8; i <= 12; i += 2) c.set(x + i, b - k, D(PINK));
        c.set(x + 7, 12 - k, blend(col, PINK, 0.5));
        c.col(x, 4 - k, 10 - k, L(col));
        dots(c, PORC, [x + 5, 5 - k, x + 5, 7 - k, x + 5, 9 - k]);
      };
      boot(2, u ? 3 : 0, D(BT)); // the far one
      boot(6, 0, BT);
      if (u) c.row(b, 3, 14, NI);
    },
  });

  O('surreal-castle-on-floating-rock', 'castle on a great rock floating over the sea boulder in the air small stone castle on top surreal', {
    w: 32, h: 56,
    f(c, u) {
      const b = 54,
        R = hex('#857f76');
      // the rock
      c.oval(3, 12, 28, 40, R);
      c.poly([[5, 20], [13, 12], [22, 12], [28, 24], [24, 38], [14, 42], [6, 34]], R);
      const r = rnd(4);
      for (let i = 0; i < 26; i++) {
        const x = 4 + ((r() * 24) | 0),
          y = 13 + ((r() * 27) | 0);
        if (c.get(x, y)) c.line(x, y, x + 2, y + 1, r() < 0.5 ? L(R) : D(R));
      }
      for (let y = 12; y <= 42; y++) for (let x = 3; x <= 28; x++) if (c.get(x, y) && (x - 3) / 25 + (y - 12) / 30 > 1.25) c.set(x, y, D(R));
      // the castle
      const CS = hex('#bdb7aa');
      c.rect(9, 8, 22, 13, CS);
      c.rect(6, 4, 10, 13, CS);
      c.rect(21, 3, 25, 13, CS);
      c.col(6, 4, 13, L(CS));
      for (const x of [6, 8, 10]) c.set(x, 3, CS);
      for (const x of [21, 23, 25]) c.set(x, 2, CS);
      for (let x = 12; x <= 19; x += 2) c.set(x, 7, CS);
      c.row(14, 7, 24, D(R));
      c.col(23, 0, 1, WD);
      c.rect(24, 0, 26, 1, C.blood);
      dots(c, u ? WARM : NI, [8, 6, 8, 9, 23, 5, 23, 9, 13, 10, 18, 10]);
      c.rect(15, 10, 16, 13, NI);
      // the sea far below
      water(c, 1, b - 3, 30, b, SEA, 3);
      return () => {
        dots(c, C.white, [6, b - 4, 9, b - 4, 21, b - 4]);
        if (u) dots(c, R, [12, 44, 15, 47, 13, 50, 18, 45]); // it sheds a little
      };
    },
    s: 'same',
  });

  O('surreal-burning-tuba', 'tuba on fire brass horn lying on the ground burning quietly flames from its bell surreal', {
    w: 30, h: 26, uh: 32,
    f(c, u) {
      const b = 24,
        B = C.brass;
      // tubing
      ring(c, 6, 10, 20, b, B);
      ring(c, 7, 11, 19, b - 1, B);
      ring(c, 10, 14, 16, b - 4, D(B));
      c.rect(12, 16, 14, 18, C.gold);
      c.rect(11, 15, 15, 15, C.steel); // valves
      // the bell, opening up and right
      c.poly([[18, 14], [21, 14], [28, 4], [20, 3]], B);
      c.oval(19, 1, 28, 6, C.gold);
      c.oval(21, 2, 27, 5, D(B));
      c.rect(3, 12, 6, 13, B); // mouthpiece
      c.set(2, 12, C.steel);
      const n = u ? 2 : 1;
      c.poly([[21, 3], [24, -2 * n - 1], [27, 3]], C.flame);
      c.poly([[23, 3], [24, -n], [26, 3]], C.flameLight);
      c.poly([[8, 11], [10, 8 - n * 2], [12, 11]], C.flame);
      c.set(10, 10, C.flameLight);
      if (u) {
        c.poly([[13, 12], [16, 3], [18, 12]], C.flame);
        c.poly([[15, 12], [16, 7], [17, 12]], C.flameLight);
        dots(c, C.flame, [22, -6, 26, -5, 11, 2]);
      }
      return () => u && dots(c, C.flameLight, [20, -4, 28, -3, 14, 0, 8, 1, 24, -7]);
    },
    sw: 18, suh: 32,
    s(c, u) {
      const b = 24,
        B = C.brass;
      c.rect(5, 10, 10, b, B); // the coil, edge on
      c.col(5, 10, b, L(B));
      c.col(8, 11, b - 1, D(B));
      c.oval(3, 0, 14, 9, C.gold); // the bell towards you
      c.oval(5, 2, 12, 7, D(B));
      c.oval(7, 3, 10, 6, NI);
      const n = u ? 2 : 1;
      c.poly([[6, 5], [8, -2 * n], [11, 5]], C.flame);
      c.poly([[7, 5], [8, -n + 1], [10, 5]], C.flameLight);
      if (u) {
        c.poly([[11, 12], [13, 6], [15, 12]], C.flame);
        dots(c, C.flame, [6, -5, 11, -4]);
      }
      return () => u && dots(c, C.flameLight, [4, -3, 13, -2, 9, -6]);
    },
  });

  O('surreal-wineglass-with-cloud', 'giant wine glass with a cloud resting on its rim tall glass taller than a person surreal', {
    w: 22, h: 48,
    f(c, u) {
      const b = 46,
        G = hex('#9ebcc2'),
        Gd = hex('#5d7f8c');
      c.rect(10, 26, 11, b - 2, G);
      c.rect(5, b - 1, 16, b, G);
      c.rect(7, b - 2, 14, b - 2, G);
      c.poly([[3, 8], [18, 8], [16, 20], [12, 26], [9, 26], [5, 20]], G);
      c.poly([[5, 10], [16, 10], [15, 19], [12, 24], [9, 24], [6, 19]], blend(Gd, NI, 0.4));
      c.col(4, 9, 18, C.white);
      c.col(10, 27, b - 3, C.white);
      if (!u) cloud(c, 1, 1, 20, 9, CLD, 4);
      else {
        // the cloud has got in, and rains itself away
        cloud(c, 5, 8, 16, 14, blend(CLD, OUT, 0.3), 4);
        c.poly([[7, 19], [14, 19], [12, 24], [9, 24]], SEA);
        c.row(19, 7, 14, SEAl);
        dots(c, SEAl, [8, 16, 11, 17, 13, 15, 10, 15]);
      }
    },
    s: 'same',
  });
};
