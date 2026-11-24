/* Surreal, part 3: the empty piazza and the studio: mannequins, arcades, plaster, fur and crutches. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, dayAt, night, day, wheel, flame, clock, drawer, bowler, apple, eye, notes } = H;
  const { CLD, NI, SKY, DAY, DAYl, MOON, MOONd, OUT, PORC, SEA, SEAl, SAND, APPLE, FELT, PLASTER, LOBSTER, GIR, BRICK, PINK } = P;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    MARB = hex('#a9a69e'),
    OCHRE = hex('#b08a4a'),
    TERRA = hex('#9c5a48'),
    FUR = hex('#8a6a48'),
    SKIN = hex('#c9a98c'),
    WARM = hex('#d9b45a');
  const plinth = (c, x0, x1, y0, b, col = MARB) => {
    c.rect(x0, y0, x1, b, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0, y0, b, L(col));
    c.row(b, x0, x1, D(col));
    c.rect(x0 - 1, y0, x1 + 1, y0 + 1, L(col));
  };

  O('surreal-fur-teacup', 'fur covered teacup saucer and spoon on a small stand breakfast in fur object surreal', {
    w: 20, h: 28,
    f(c, u) {
      const b = 26;
      plinth(c, 5, 14, 14, b);
      // saucer, cup, spoon: all in fur
      c.rect(2, 12, 17, 13, FUR);
      c.rect(5, 6, 13, 11, FUR);
      c.rect(6, 11, 12, 11, D(FUR));
      ring(c, 13, 7, 16, 10, FUR);
      c.rect(5, 5, 13, 5, u ? hex('#5a3a2a') : D(FUR));
      const r = rnd(3);
      for (let y = 6; y <= 13; y++) for (let x = 2; x <= 17; x++) if (c.get(x, y) === FUR && r() < 0.4) c.set(x, y, r() < 0.5 ? L(FUR) : D(FUR));
      dots(c, FUR, [4, 5, 14, 5, 3, 11, 16, 11, 1, 13, 18, 13]); // hairs standing out
      if (!u) c.rect(1, 11, 5, 11, L(FUR)); // the spoon on the saucer
      else {
        c.line(11, 5, 14, 1, L(FUR)); // the spoon stands in it; someone has poured
        c.rect(14, 0, 15, 1, L(FUR));
      }
      return () => u && dots(c, CLD, [8, 3, 7, 1, 9, 0]);
    },
    sw: 18,
    s(c, u) {
      const b = 26;
      plinth(c, 4, 13, 14, b);
      c.rect(2, 12, 15, 13, FUR);
      c.rect(4, 6, 13, 11, FUR);
      c.rect(8, 7, 9, 10, D(FUR)); // the handle towards you
      c.rect(4, 5, 13, 5, u ? hex('#5a3a2a') : D(FUR));
      const r = rnd(5);
      for (let y = 6; y <= 13; y++) for (let x = 2; x <= 15; x++) if (c.get(x, y) === FUR && r() < 0.4) c.set(x, y, r() < 0.5 ? L(FUR) : D(FUR));
      dots(c, FUR, [3, 5, 14, 5, 1, 13, 16, 13]);
      if (u) c.col(10, 1, 5, L(FUR));
      return () => u && dots(c, CLD, [6, 3, 7, 1]);
    },
  });

  O('surreal-flat-iron-with-nails', 'flat iron with a row of nails stuck to its face on a plinth useless iron the gift object surreal', {
    w: 16, h: 30, uw: 22,
    f(c, u) {
      const b = 28,
        I = C.iron;
      plinth(c, 3, 12, 14, b);
      if (!u) {
        c.poly([[5, 13], [10, 13], [10, 5], [8, 3], [7, 3], [5, 5]], I); // standing on its heel, its face to you
        c.col(6, 5, 12, L(I));
        for (let y = 5; y <= 12; y += 1) c.set(8, y, y % 2 ? C.steel : PORC); // the nails, points out
        c.rect(7, 1, 8, 2, WD);
      } else {
        // it has been tried on a shirt: the shirt in ribbons over the plinth
        c.poly([[5, 13], [10, 13], [10, 5], [8, 3], [7, 3], [5, 5]], I);
        c.col(6, 5, 12, L(I));
        for (let y = 5; y <= 12; y += 1) c.set(8, y, y % 2 ? C.steel : PORC);
        c.rect(7, 1, 8, 2, WD);
        for (const x of [12, 14, 16, 18]) {
          c.col(x, 14, 20 + (x % 3) * 2, PORC);
          c.set(x + 1, 15, PORC);
        }
        c.rect(11, 13, 19, 14, PORC);
      }
    },
    sw: 16, suw: 22,
    s(c, u) {
      const b = 28,
        I = C.iron;
      plinth(c, 3, 12, 14, b);
      c.poly([[4, 13], [9, 13], [9, 6], [6, 3], [4, 6]], I); // in profile
      c.col(4, 6, 12, L(I));
      c.rect(2, 5, 3, 11, WD); // handle
      c.set(3, 4, WD);
      c.set(3, 12, WD);
      for (let y = 5; y <= 12; y += 2) {
        c.set(10, y, C.steel);
        c.set(11, y, PORC);
      }
      if (u) {
        for (const x of [12, 15, 18]) c.col(x, 14, 19 + (x % 3) * 2, PORC);
        c.rect(11, 13, 19, 14, PORC);
      }
    },
  });

  O('surreal-metronome-with-eye', 'metronome with a paper eye clipped to its arm ticking watching object to be destroyed surreal', {
    w: 16, h: 28,
    f(c, u) {
      const b = 26;
      c.poly([[6, 6], [9, 6], [13, b], [2, b]], W);
      c.line(6, 6, 2, b, WL);
      c.rect(2, b - 2, 13, b, WD);
      c.poly([[7, 9], [8, 9], [10, b - 4], [5, b - 4]], hex('#3a2c26'));
      dots(c, C.brass, [7, 12, 7, 15, 8, 18, 7, 21]);
      // the arm and the eye on it
      const x1 = u ? 12 : 3;
      c.line(7, b - 5, x1, 3, C.steel);
      const ex = u ? 10 : 2;
      c.rect(ex, 5, ex + 4, 7, C.white);
      c.rect(ex + 1, 4, ex + 3, 8, C.white);
      c.rect(ex + 1, 5, ex + 3, 7, hex('#5a7a8c'));
      c.set(ex + 2, 6, NI);
      return () => dots(c, MOON, u ? [1, 4, 3, 6, 2, 9] : [14, 4, 12, 6]);
    },
    sw: 16,
    s(c, u) {
      const b = 26;
      c.poly([[5, 6], [10, 6], [13, b], [2, b]], W);
      c.line(5, 6, 2, b, WL);
      c.rect(2, b - 2, 13, b, WD);
      c.col(7, 2, b - 4, C.steel); // the arm swings towards you and away
      const y = u ? 9 : 4;
      c.rect(5, y, 9, y + 2, C.white);
      c.rect(6, y - 1, 8, y + 3, C.white);
      c.rect(6, y, 8, y + 2, hex('#5a7a8c'));
      c.set(7, y + 1, NI);
      return () => dots(c, MOON, u ? [2, 4, 12, 5] : [3, 12]);
    },
  });

  O('surreal-mannequin-egg-head', 'tailor dummy with an egg for a head faceless mannequin built of set squares and boards on a stand metaphysical surreal', {
    w: 20, h: 44,
    f(c, u) {
      const b = 42;
      c.rect(5, b - 2, 14, b, WD);
      c.col(9, 30, b - 3, W);
      c.col(10, 30, b - 3, WD);
      // torso: stitched cloth and a carpenter's square
      c.poly([[4, 14], [15, 14], [14, 22], [15, 30], [4, 30], [5, 22]], TERRA);
      c.col(5, 15, 29, L(TERRA));
      c.col(10, 15, 29, D(TERRA));
      dots(c, PORC, [10, 16, 10, 19, 10, 22, 10, 25, 10, 28]);
      c.poly([[12, 16], [17, 30], [12, 30]], OCHRE);
      c.line(12, 16, 17, 30, D(OCHRE));
      c.rect(2, 14, 4, 17, D(TERRA)); // shoulder caps
      c.rect(15, 14, 17, 17, D(TERRA));
      c.rect(8, 11, 11, 13, W);
      // the head: an egg with the seams of a face
      const hx = u ? 2 : 0;
      c.oval(6 + hx, 1, 13 + hx, 11, PORC);
      c.col(9 + hx, 2, 10, D(PORC));
      c.row(5, 7 + hx, 12 + hx, D(PORC));
      c.col(7 + hx, 3, 8, C.white);
      if (u) {
        // it has turned its no-face to look, and let an arm fall
        c.rect(1, b - 1, 4, b, D(TERRA));
        c.rect(0, b - 3, 1, b - 1, D(TERRA));
        c.clearRect(2, 14, 3, 17);
        c.set(4, 15, NI);
      }
    },
    sw: 14,
    s(c, u) {
      const b = 42;
      c.rect(3, b - 2, 10, b, WD);
      c.col(6, 30, b - 3, W);
      c.poly([[4, 14], [9, 14], [10, 20], [9, 30], [4, 30], [3, 20]], TERRA);
      c.col(4, 15, 29, L(TERRA));
      c.rect(5, 14, 8, 18, D(TERRA));
      c.rect(9, 22, 11, 30, OCHRE); // the square, edge on
      c.rect(5, 11, 7, 13, W);
      const hx = u ? 1 : 0;
      c.oval(3 + hx, 1, 9 + hx, 11, PORC);
      c.row(5, 4 + hx, 8 + hx, D(PORC));
      c.col(4 + hx, 3, 8, C.white);
      if (u) {
        c.rect(1, b - 1, 3, b, D(TERRA));
        c.clearRect(5, 14, 8, 15);
        c.rect(5, 14, 8, 14, NI);
      }
    },
  });

  O('surreal-arcade-long-shadow', 'piece of an arcade ochre wall with dark round arches late afternoon a shadow in one arch piazza surreal', {
    w: 44, h: 42, base: 'side',
    f(c, u) {
      const b = 40;
      c.rect(2, 3, 41, b, OCHRE);
      c.rect(1, 1, 42, 3, L(OCHRE));
      c.row(4, 2, 41, D(OCHRE));
      c.col(2, 4, b, L(OCHRE));
      for (const x of [5, 18, 31]) {
        c.oval(x, 10, x + 8, 20, NI);
        c.rect(x, 15, x + 8, b, NI);
        c.col(x + 8, 15, b, hex('#2a2838'));
      }
      c.rect(2, b - 1, 41, b, D(OCHRE));
      dots(c, D(OCHRE), [15, 8, 28, 30, 41, 12, 3, 25, 16, 22]);
      if (u) {
        // a child with a hoop, only her shadow, in the middle arch
        const SH = hex('#4a4458');
        c.rect(21, 28, 23, 34, SH);
        c.rect(21, 25, 22, 27, SH);
        c.poly([[20, 34], [24, 34], [25, 37], [19, 37]], SH);
        c.col(21, 38, b, SH);
        c.col(23, 38, b, SH);
        ring(c, 13, 33, 19, b, SH);
        c.line(19, 34, 21, 30, SH);
        c.line(21, 25, 19, 27, SH); // hair flying
      }
    },
    sw: 14,
    s(c, u) {
      const b = 40;
      c.rect(2, 3, 11, b, OCHRE);
      c.rect(1, 1, 12, 3, L(OCHRE));
      c.row(4, 2, 11, D(OCHRE));
      c.col(2, 4, b, L(OCHRE));
      c.oval(4, 10, 9, 18, NI); // the end arch: you look along the walk
      c.rect(4, 14, 9, b, NI);
      c.rect(6, 22, 7, b, hex('#2a2838'));
      c.rect(2, b - 1, 11, b, D(OCHRE));
      if (u) {
        c.rect(6, 31, 7, 36, hex('#4a4458'));
        c.set(6, 30, hex('#4a4458'));
        ring(c, 5, 36, 8, b, hex('#4a4458'));
      }
    },
  });

  O('surreal-red-tower-pennants', 'tall round tower with pennants flying white tower red roof no door far too near piazza surreal', {
    w: 22, h: 62,
    f(c, u) {
      const b = 60,
        T = hex('#c9c2b0');
      c.rect(5, 14, 16, b, T);
      c.col(5, 14, b, C.white);
      c.col(6, 14, b, L(T));
      for (let y = 14; y <= b; y++) {
        c.set(15, y, D(T));
        c.set(16, y, D(D(T)));
        c.set(14, y, blend(T, D(T), 0.5));
      }
      c.rect(4, 12, 17, 14, T);
      for (let x = 4; x <= 17; x += 2) c.set(x, 11, T);
      c.poly([[10, 3], [11, 3], [16, 11], [5, 11]], TERRA);
      c.line(10, 3, 5, 11, L(TERRA));
      c.rect(4, 30, 17, 31, D(T)); // a gallery half way
      for (let y = 20; y <= 52; y += 10) c.rect(9, y, 10, y + 3, u && y === 40 ? WARM : NI);
      c.rect(8, b - 6, 12, b, NI);
      c.oval(8, b - 8, 12, b - 4, NI);
      c.col(10, 0, 2, WD);
      // pennants: blowing left, though there is no wind; used, they have swung right
      if (!u) {
        c.poly([[9, 0], [3, 1], [9, 2]], C.red);
        c.poly([[4, 10], [0, 11], [4, 12]], C.red);
      } else {
        c.poly([[11, 0], [17, 1], [11, 2]], C.red);
        c.poly([[17, 10], [21, 11], [17, 12]], C.red);
      }
      c.rect(1, b, 20, b, D(OCHRE));
    },
    s: 'same',
  });

  O('surreal-statue-reclining-on-plinth', 'plaster statue of a sleeper lying on a long low plinth in an empty square ariadne surreal', {
    w: 44, h: 26, base: 'side',
    f(c, u) {
      const b = 24;
      plinth(c, 3, 40, 13, b);
      c.rect(1, b - 2, 42, b, D(MARB));
      dots(c, D(MARB), [10, 17, 22, 20, 33, 16]);
      if (!u) {
        // head left on her arm, hip high, knees, feet
        c.oval(5, 4, 10, 9, PLASTER);
        c.rect(5, 3, 9, 4, D(PLASTER));
        c.poly([[9, 8], [16, 6], [24, 4], [30, 7], [36, 9], [39, 12], [8, 12]], PLASTER);
        c.poly([[10, 7], [14, 2], [16, 3], [13, 8]], PLASTER); // an arm thrown up over her head
        c.line(16, 7, 24, 5, C.white);
        for (let x = 20; x <= 36; x += 3) c.line(x, 8, x + 2, 12, D(PLASTER)); // drapery
        c.rect(37, 10, 40, 12, PLASTER);
      } else {
        // she has got up and gone: the hollow she left, and the drapery
        c.row(12, 8, 36, D(MARB));
        c.rect(26, 10, 38, 12, PLASTER);
        for (let x = 27; x <= 37; x += 3) c.col(x, 10, 12, D(PLASTER));
        c.rect(36, 13, 39, 18, PLASTER);
        c.col(38, 14, 18, D(PLASTER));
        dots(c, PLASTER, [8, b + 1, 6, b - 3]);
        dots(c, PLASTER, [12, b - 3, 13, b - 3, 18, b - 3, 19, b - 3]); // white footprints along the step
      }
    },
    sw: 18,
    s(c, u) {
      const b = 24;
      plinth(c, 3, 14, 13, b);
      c.rect(1, b - 2, 16, b, D(MARB));
      if (!u) {
        c.oval(5, 5, 12, 12, PLASTER); // her feet towards you, the hip behind
        c.oval(6, 3, 11, 8, PLASTER);
        c.rect(6, 9, 8, 12, PLASTER);
        c.rect(9, 9, 11, 12, D(PLASTER));
        dots(c, D(PLASTER), [7, 12, 10, 12, 8, 6]);
      } else {
        c.rect(5, 10, 12, 12, PLASTER);
        c.col(8, 10, 12, D(PLASTER));
        c.rect(10, 13, 12, 18, PLASTER);
        dots(c, PLASTER, [5, b - 3, 6, b - 3]);
      }
    },
  });

  O('surreal-glove-nailed-to-board', 'huge red rubber glove nailed to a board with a plaster head and a green ball song of love surreal', {
    w: 26, h: 42,
    f(c, u) {
      const b = 40,
        BD = hex('#7a7a6a'),
        GL = hex('#a8503a');
      c.rect(2, 2, 23, 32, BD);
      c.row(2, 2, 23, L(BD));
      c.col(2, 2, 32, L(BD));
      c.rect(3, 33, 5, b, WD);
      c.rect(20, 33, 22, b, WD);
      // plaster head, hung
      c.oval(4, 6, 11, 16, PLASTER);
      c.rect(6, 16, 9, 18, PLASTER);
      c.col(5, 8, 13, C.white);
      dots(c, D(PLASTER), [6, 10, 9, 10, 8, 12, 7, 14, 8, 14]);
      c.rect(4, 5, 11, 6, D(PLASTER));
      // the glove
      if (!u) {
        c.rect(15, 8, 20, 18, GL);
        for (const x of [15, 17, 19]) c.col(x, 18, 23 + (x % 3), GL);
        c.col(20, 18, 22, GL);
        c.rect(13, 12, 14, 16, GL); // thumb
        c.col(15, 9, 17, L(GL));
        c.set(17, 7, C.steel); // the nail
      } else {
        // it has closed, and points
        c.rect(15, 8, 20, 16, GL);
        c.rect(15, 16, 20, 18, D(GL));
        c.rect(8, 19, 15, 20, GL); // one finger out, at the head
        c.rect(13, 12, 14, 16, GL);
        c.col(15, 9, 15, L(GL));
        c.set(17, 7, C.steel);
      }
      // the ball
      c.oval(u ? 15 : 9, b - 6, u ? 21 : 15, b, hex('#5f7a4a'));
      c.set(u ? 17 : 11, b - 5, hex('#8fa86a'));
    },
    sw: 12,
    s(c, u) {
      const b = 40,
        BD = hex('#7a7a6a'),
        GL = hex('#a8503a');
      c.rect(4, 2, 6, 32, BD);
      c.col(4, 2, 32, L(BD));
      c.rect(4, 33, 6, b, WD);
      c.oval(7, 6, 10, 16, PLASTER); // the head, a half mask on the board
      c.col(7, 5, 17, D(PLASTER));
      c.rect(7, 8, 8, 18, GL);
      if (u) c.rect(7, 19, 9, 20, GL);
      c.oval(3, b - 6, 9, b, hex('#5f7a4a'));
      c.set(5, b - 5, hex('#8fa86a'));
    },
  });

  O('surreal-soft-head-on-crutches', 'huge soft sleeping head held up on crutches no body a face like a sack sleep surreal', {
    w: 46, h: 30, base: 'side',
    f(c, u) {
      const b = 28,
        k = u ? 4 : 0; // one crutch gone: that end sags
      // the head: brow left, tapering away to the right like an empty skin
      c.poly([[3, 6], [12, 3], [24, 4], [34, 8 + (k >> 1)], [43, 13 + k], [36, 15 + k], [24, 16 + (k >> 1)], [12, 17], [5, 15], [2, 11]], SKIN);
      c.line(3, 6, 12, 3, L(SKIN));
      c.line(12, 17, 24, 16 + (k >> 1), D(SKIN));
      // closed eye with lashes, nose, mouth
      if (!u) {
        c.row(9, 11, 16, NI);
        dots(c, NI, [12, 10, 14, 10, 16, 10]);
      } else {
        c.rect(11, 8, 16, 10, C.white); // it is awake
        c.rect(13, 8, 14, 10, hex('#5a4638'));
        c.row(7, 11, 16, NI);
      }
      c.poly([[2, 9], [5, 9], [4, 14], [1, 13]], SKIN); // the nose, hanging
      c.row(15, 6, 10, D(SKIN));
      c.set(7, 14, hex('#8a5a5e'));
      c.set(8, 14, hex('#8a5a5e'));
      dots(c, D(SKIN), [20, 9, 27, 11, 33, 12 + (k >> 1)]);
      // crutches
      const crutch = (x, y) => {
        c.col(x, y + 1, b, WP);
        c.row(y, x - 2, x + 2, WP);
        c.set(x - 2, y - 1, WP);
        c.set(x + 2, y - 1, WP);
      };
      crutch(6, 17);
      crutch(16, 19);
      crutch(27, 18 + (k >> 1));
      if (!u) crutch(38, 16);
      else {
        c.rect(36, b - 1, 44, b, WP); // fallen
        c.rect(35, b - 2, 35, b, WP);
      }
      crutch(2, 13);
    },
    sw: 18,
    s(c, u) {
      const b = 28;
      // from the nose end
      c.oval(3, 2, 14, 17, SKIN);
      c.col(4, 6, 13, L(SKIN));
      c.poly([[7, 8], [10, 8], [11, 15], [6, 15]], SKIN);
      c.line(7, 8, 6, 15, D(SKIN));
      if (!u) {
        c.row(8, 4, 6, NI);
        c.row(8, 11, 13, NI);
      } else {
        c.rect(4, 7, 6, 8, C.white);
        c.set(5, 8, NI);
        c.rect(11, 7, 13, 8, C.white);
        c.set(12, 8, NI);
      }
      c.row(16, 7, 10, hex('#8a5a5e'));
      for (const x of [3, 14]) {
        c.col(x, 15, b, WP);
        c.row(14, x - 1, x + 1, WP);
      }
      c.col(8, 18, b, WP);
      c.row(17, 6, 10, WP);
      if (u) c.rect(11, b - 1, 16, b, WP);
    },
  });

  O('surreal-hand-holding-egg', 'stone hand rising from the ground holding an egg with a flower growing out of it narcissus surreal', {
    w: 20, h: 44,
    f(c, u) {
      const b = 42,
        ST = hex('#a39d8c');
      // the wrist and the fingers held up
      c.rect(6, 26, 13, b, ST);
      c.col(6, 26, b, L(ST));
      c.col(13, 26, b, D(ST));
      c.rect(4, 16, 6, 28, ST); // thumb
      c.rect(8, 14, 9, 26, ST);
      c.rect(11, 15, 12, 26, ST);
      c.rect(14, 17, 15, 28, ST);
      dots(c, D(ST), [8, 20, 11, 21, 14, 22, 9, 32, 11, 36, 8, 38]);
      dots(c, NI, [10, 30, 10, 31, 11, 33]); // a crack, and ants
      // the egg in its finger tips
      c.oval(6, 7, 14, 18, PORC);
      c.col(7, 10, 15, C.white);
      if (!u) {
        c.set(10, 7, NI);
        c.set(11, 8, NI);
        c.col(10, 4, 6, hex('#5f7048'));
        c.set(10, 3, C.white);
      } else {
        // the flower is out
        dots(c, NI, [10, 7, 11, 8, 10, 9, 9, 10, 11, 11]);
        c.col(10, 1, 6, hex('#5f7048'));
        c.set(11, 4, hex('#5f7048'));
        c.rect(8, -2, 12, 0, C.white);
        c.rect(9, -3, 11, 1, C.white);
        c.set(10, -1, WARM);
      }
      c.rect(3, b - 1, 16, b, D(ST));
    },
    uh: 48,
    sw: 14, suh: 48,
    s(c, u) {
      const b = 42,
        ST = hex('#a39d8c');
      c.rect(4, 26, 9, b, ST);
      c.col(4, 26, b, L(ST));
      c.col(9, 26, b, D(ST));
      c.rect(3, 15, 4, 27, ST);
      c.rect(9, 16, 10, 27, ST);
      c.rect(6, 22, 7, 26, D(ST));
      c.oval(3, 7, 10, 18, PORC);
      c.col(4, 10, 15, C.white);
      if (!u) {
        c.col(6, 4, 6, hex('#5f7048'));
        c.set(6, 3, C.white);
      } else {
        dots(c, NI, [6, 7, 7, 8, 6, 10]);
        c.col(6, 1, 6, hex('#5f7048'));
        c.rect(5, -2, 7, 0, C.white);
        c.rect(4, -1, 8, -1, C.white);
        c.set(6, -1, WARM);
      }
      c.rect(2, b - 1, 11, b, D(ST));
    },
  });

  O('surreal-bust-with-baguette', 'porcelain bust of a woman with a loaf of bread balanced on her head and an inkwell ants on her face surreal', {
    w: 22, h: 44,
    f(c, u) {
      const b = 42,
        BR = hex('#b8904e');
      plinth(c, 6, 15, 26, b, hex('#5a4a44'));
      c.poly([[3, 25], [5, 19], [16, 19], [18, 25]], PORC); // shoulders
      c.rect(9, 15, 12, 19, PORC);
      c.oval(6, 5, 15, 16, PORC);
      c.rect(6, 4, 15, 7, hex('#6a5a3a')); // hair
      c.col(7, 8, 13, C.white);
      dots(c, hex('#5a7a8c'), [9, 10, 12, 10]);
      c.row(13, 10, 11, hex('#8a5a5e'));
      dots(c, NI, [13, 11, 14, 12, 13, 13, 14, 14, 12, 15]); // ants
      c.rect(7, 21, 14, 21, C.gold); // a collar
      c.rect(9, 22, 12, 24, C.gold);
      // the loaf across her head, an inkwell on the loaf
      if (!u) {
        c.rect(1, 2, 20, 4, BR);
        c.row(2, 2, 19, L(BR));
        for (let x = 4; x <= 18; x += 4) c.set(x, 3, D(BR));
        c.rect(9, 0, 12, 1, C.brass);
      } else {
        c.rect(1, 2, 12, 4, BR); // somebody has eaten half
        c.row(2, 2, 11, L(BR));
        c.col(12, 2, 4, PORC);
        c.rect(7, 0, 10, 1, C.brass);
        dots(c, BR, [14, 5, 17, 20, 16, 26]);
      }
      return () => u && dots(c, BR, [18, b, 3, b]);
    },
    sw: 14,
    s(c, u) {
      const b = 42,
        BR = hex('#b8904e');
      plinth(c, 3, 10, 26, b, hex('#5a4a44'));
      c.poly([[3, 25], [4, 19], [9, 19], [11, 25]], PORC);
      c.rect(5, 15, 8, 19, PORC);
      c.oval(3, 5, 11, 16, PORC);
      c.rect(3, 4, 8, 12, hex('#6a5a3a')); // hair behind
      c.set(12, 11, PORC); // nose
      c.set(10, 10, hex('#5a7a8c'));
      c.set(11, 13, hex('#8a5a5e'));
      dots(c, NI, [9, 12, 9, 14]);
      if (!u) {
        c.rect(5, 2, 9, 4, BR); // the loaf, end on
        c.rect(6, 3, 8, 3, L(BR));
        c.rect(6, 0, 8, 1, C.brass);
      } else {
        c.rect(5, 2, 9, 4, PORC);
        c.frame(5, 2, 9, 4, BR);
        c.rect(6, 0, 8, 1, C.brass);
      }
    },
  });

  O('surreal-tree-that-is-a-leaf', 'tree in the shape of one great leaf on a trunk veins for branches turning red search for the absolute surreal', {
    w: 26, h: 48,
    f(c, u) {
      const b = 46,
        LF = u ? hex('#8a4a38') : hex('#4f6b48');
      c.rect(11, 30, 13, b, hex('#5a4638'));
      c.col(11, 30, b, hex('#6f5a4a'));
      c.rect(8, b - 1, 16, b, hex('#5a4638'));
      // the leaf
      c.poly([[12, 1], [18, 8], [22, 18], [20, 28], [12, 34], [5, 28], [2, 18], [6, 8]], LF);
      c.col(12, 3, 33, D(LF));
      for (const [y, d] of [[10, 5], [16, 7], [22, 7], [27, 5]]) {
        c.line(12, y + 3, 12 - d, y, D(LF));
        c.line(12, y + 3, 12 + d, y, D(LF));
      }
      c.line(6, 8, 2, 18, L(LF));
      c.line(12, 1, 6, 8, L(LF));
      if (u) {
        // autumn in an afternoon: pieces of it come away
        c.clearRect(18, 20, 22, 24);
        c.clearRect(3, 11, 5, 13);
        dots(c, LF, [21, 38, 22, 39, 4, 40, 5, 41, 19, b, 20, b, 6, b]);
      }
    },
    sw: 12,
    s(c, u) {
      const b = 46,
        LF = u ? hex('#8a4a38') : hex('#4f6b48');
      c.rect(5, 30, 6, b, hex('#5a4638'));
      c.rect(3, b - 1, 8, b, hex('#5a4638'));
      // the leaf edge on: a thin curved blade
      for (let y = 1; y <= 33; y++) {
        const x = 5 + Math.round(1.5 * Math.sin(y / 6));
        c.set(x, y, LF);
        c.set(x + 1, y, D(LF));
        if (y > 8 && y < 28) c.set(x - 1, y, L(LF));
      }
      if (u) dots(c, LF, [9, 38, 2, 41, 9, b]);
    },
  });

  O('surreal-bilboquet-with-eye', 'turned wooden baluster figure tall chess piece like a table leg with one eye in it bilboquet surreal', {
    w: 16, h: 46,
    f(c, u) {
      const b = 44;
      const prof = [3, 3, 4, 5, 5, 5, 4, 3, 2, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 2, 2, 3, 3, 2, 2, 2, 3, 4, 5, 5, 4, 3, 2, 2, 3, 4, 5, 6, 6, 6, 6];
      prof.forEach((r, i) => {
        const y = 2 + i;
        c.row(y, 8 - r, 7 + r, WP);
        c.set(8 - r, y, L(WP));
        c.set(7 + r, y, D(WP));
        if (r > 3) c.set(6 + r, y, W);
      });
      for (const y of [10, 21, 27, 35]) c.row(y, 6, 9, W);
      c.rect(1, b - 1, 14, b, W);
      // the eye in its head
      if (!u) {
        c.row(6, 5, 10, NI);
        dots(c, NI, [6, 7, 8, 7, 10, 7]);
      } else {
        c.rect(5, 5, 10, 7, C.white);
        c.rect(7, 5, 8, 7, hex('#5a7a8c'));
        c.set(8, 6, NI);
        c.row(4, 5, 10, NI);
      }
      return () => u && dots(c, MOON, [1, 4, 14, 5, 0, 8]);
    },
    s: 'same',
  });
};
