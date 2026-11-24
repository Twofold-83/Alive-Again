/* Surreal, part 5: chance meetings and ready-mades: bread in the air, a wheel on a stool, lips to sit on. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, dayAt, night, day, wheel, flame, clock, drawer, bowler, apple, eye, notes } = H;
  const { CLD, NI, SKY, DAY, DAYl, MOON, MOONd, OUT, PORC, SEA, SEAl, SAND, APPLE, FELT, PLASTER, LOBSTER, GIR, BRICK, PINK } = P;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    MARB = hex('#a9a69e'),
    BREAD = hex('#b8904e'),
    LIP = hex('#a8343a'),
    SATIN = hex('#a8707a'),
    WARM = hex('#d9b45a');
  const MARK = hex('#ff00ff');
  const fill = (c, at) => repaint(c, 0, 0, c.w - 1, c.h - 1, MARK, at);

  const loaf = (c, x, y, w = 11) => {
    c.rect(x, y, x + w - 1, y + 2, BREAD);
    c.row(y, x + 1, x + w - 2, L(BREAD));
    c.row(y + 2, x + 1, x + w - 2, D(BREAD));
    for (let i = 2; i < w - 1; i += 3) c.set(x + i, y + 1, hex('#d9c48a'));
  };
  O('surreal-loaves-in-the-air', 'long loaves of bread hanging in the air in formation like a fleet baguettes flying golden legend surreal', {
    w: 44, h: 36, base: 'side', solid: false,
    f(c, u) {
      const b = 34;
      if (!u) {
        loaf(c, 2, 4);
        loaf(c, 17, 2);
        loaf(c, 31, 6);
        loaf(c, 9, 13);
        loaf(c, 25, 15);
      } else {
        // one was taken for supper; another has come down
        loaf(c, 2, 4);
        loaf(c, 31, 6);
        loaf(c, 9, 13);
        loaf(c, 17, 2, 6);
        c.col(23, 2, 4, PORC);
        loaf(c, 24, b - 3);
        dots(c, BREAD, [20, 8, 22, 11, 19, 14]);
      }
      for (const x of [6, 21, 36]) c.row(b, x - 2, x + 3, NI);
    },
    sw: 14,
    s(c, u) {
      const b = 34;
      const end = (x, y) => {
        c.oval(x, y, x + 3, y + 3, BREAD);
        c.set(x + 1, y + 1, hex('#d9c48a'));
      };
      end(2, 4);
      end(8, 6);
      end(5, 13);
      if (!u) end(9, 15);
      else {
        end(8, b - 4);
        c.set(5, 2, BREAD);
      }
      if (!u) end(4, 1);
      c.row(b, 3, 10, NI);
    },
  });

  O('surreal-sewing-machine-and-umbrella', 'sewing machine and an umbrella met by chance on a steel dissecting table lautreamont surreal', {
    w: 42, h: 32, base: 'side',
    f(c, u) {
      const b = 30,
        ST = C.steel;
      // the table: a slab on a central pedestal, a gutter round it
      c.rect(2, 16, 39, 18, ST);
      c.row(16, 2, 39, L(ST));
      c.row(18, 2, 39, D(ST));
      c.rect(18, 19, 23, b - 2, C.iron);
      c.col(18, 19, b - 2, L(C.iron));
      c.rect(12, b - 1, 29, b, C.iron);
      c.rect(36, 19, 37, 22, ST); // a drain pipe
      // the sewing machine
      c.rect(5, 13, 18, 15, FELT);
      c.rect(14, 6, 17, 13, FELT);
      c.rect(6, 5, 17, 7, FELT);
      c.rect(6, 8, 7, 11, FELT);
      c.set(6, 12, C.steel);
      c.oval(17, 5, 21, 9, FELT); // hand wheel
      c.set(19, 7, C.steel);
      dots(c, C.gold, [9, 6, 11, 6, 13, 6, 8, 14, 12, 14]);
      c.rect(10, 3, 11, 4, PORC); // cotton reel
      // the umbrella
      if (!u) {
        c.rect(23, 13, 37, 15, hex('#3a3440'));
        c.row(13, 23, 37, hex('#55515c'));
        c.rect(38, 13, 39, 14, WD);
        c.set(40, 15, WD);
        c.set(22, 14, C.steel);
      } else {
        // open over the machine, as if it might rain in here
        c.col(24, 2, 15, WD);
        c.rect(24, 14, 26, 15, WD);
        c.poly([[24, 0], [25, 0], [38, 8], [11, 8]], hex('#3a3440'));
        for (const x of [16, 21, 29, 34]) c.line(24, 0, x, 8, hex('#55515c'));
        c.rect(26, 12, 31, 15, PORC); // and something has been sewn: a white seam of cloth
        for (let x = 26; x <= 31; x += 2) c.set(x, 13, C.blood);
      }
    },
    sw: 20,
    s(c, u) {
      const b = 30,
        ST = C.steel;
      c.rect(2, 16, 17, 18, ST);
      c.row(16, 2, 17, L(ST));
      c.row(18, 2, 17, D(ST));
      c.rect(7, 19, 12, b - 2, C.iron);
      c.rect(4, b - 1, 15, b, C.iron);
      // machine end on: the wheel towards you
      c.rect(4, 6, 9, 15, FELT);
      c.oval(4, 5, 9, 10, FELT);
      ring(c, 4, 5, 9, 10, hex('#55515c'));
      c.set(6, 7, C.steel);
      c.rect(6, 3, 7, 4, PORC);
      if (!u) {
        c.oval(12, 12, 15, 15, hex('#3a3440')); // the umbrella's point at you
        c.set(13, 13, C.steel);
      } else {
        c.col(13, 2, 15, WD);
        c.poly([[13, 0], [14, 0], [19, 8], [3, 8]], hex('#3a3440'));
        c.line(13, 0, 8, 8, hex('#55515c'));
        c.line(13, 0, 16, 8, hex('#55515c'));
      }
    },
  });

  O('surreal-bicycle-wheel-on-stool', 'bicycle wheel fixed upside down on a white kitchen stool ready made spins when touched surreal', {
    w: 22, h: 46,
    f(c, u) {
      const b = 44;
      // stool
      c.rect(4, 28, 17, 29, PORC);
      c.line(5, 30, 3, b, PORC);
      c.line(16, 30, 18, b, PORC);
      c.line(8, 30, 7, b - 2, D(PORC));
      c.line(13, 30, 14, b - 2, D(PORC));
      c.row(37, 5, 16, D(PORC));
      // fork and wheel
      c.rect(10, 16, 11, 27, FELT);
      ring(c, 2, 2, 19, 19, FELT);
      ring(c, 3, 3, 18, 18, C.steel);
      if (!u) {
        for (let a = 0; a < 8; a++) c.line(10.5, 10.5, 10.5 + 7 * Math.cos((a * Math.PI) / 4), 10.5 + 7 * Math.sin((a * Math.PI) / 4), C.steel);
      } else {
        // turning: the spokes are a grey blur
        for (let y = 4; y <= 17; y++) for (let x = 4; x <= 17; x++) if ((x - 10.5) ** 2 + (y - 10.5) ** 2 < 46 && (x + y) % 2) c.set(x, y, C.ash);
        ring(c, 6, 6, 15, 15, C.steel);
      }
      c.rect(10, 10, 11, 11, C.iron);
      return () => u && dots(c, C.ash, [0, 6, 21, 14, 1, 16, 20, 4]);
    },
    sw: 14,
    s(c, u) {
      const b = 44;
      c.rect(2, 28, 11, 29, PORC);
      c.line(3, 30, 2, b, PORC);
      c.line(10, 30, 11, b, PORC);
      c.row(37, 3, 10, D(PORC));
      c.rect(5, 12, 5, 27, FELT); // fork
      c.rect(8, 12, 8, 27, FELT);
      c.rect(6, 2, 7, 19, FELT); // the wheel, edge on
      c.col(6, 3, 18, u ? C.ash : C.steel);
      c.rect(5, 10, 8, 11, C.iron);
      return () => u && dots(c, C.ash, [3, 5, 10, 9, 3, 15]);
    },
  });

  O('surreal-urinal-on-a-plinth', 'porcelain urinal laid on its back on a plinth and signed like a sculpture fountain ready made surreal', {
    w: 20, h: 34,
    f(c, u) {
      const b = 32,
        PC = hex('#d6d2c4');
      c.rect(3, 18, 16, b, MARB);
      c.row(18, 3, 16, L(MARB));
      c.col(3, 18, b, L(MARB));
      c.row(b, 3, 16, D(MARB));
      c.rect(2, 17, 17, 18, L(MARB));
      // the thing itself
      c.poly([[5, 16], [14, 16], [17, 10], [15, 4], [10, 2], [5, 4], [2, 10]], PC);
      c.line(5, 4, 2, 10, C.white);
      c.oval(6, 5, 13, 12, D(PC));
      c.oval(7, 6, 12, 11, hex('#8f8a7c'));
      dots(c, NI, [9, 13, 10, 13, 8, 14, 11, 14, 9, 15, 10, 15]); // drain holes
      dots(c, NI, [3, 14, 4, 15, 5, 15]); // the signature
      c.rect(9, 0, 10, 1, C.steel);
      if (u) {
        // it runs, after all
        c.oval(7, 7, 12, 11, SEA);
        c.row(8, 8, 11, SEAl);
        c.col(9, 16, 22, SEAl);
        c.col(10, 16, 26, SEA);
        c.row(b, 7, 13, SEA);
      }
      return () => u && dots(c, SEAl, [10, 28, 9, 30, 14, b + 1, 5, b + 1]);
    },
    sw: 16,
    s(c, u) {
      const b = 32,
        PC = hex('#d6d2c4');
      c.rect(3, 18, 12, b, MARB);
      c.row(18, 3, 12, L(MARB));
      c.col(3, 18, b, L(MARB));
      c.rect(2, 17, 13, 18, L(MARB));
      c.poly([[3, 16], [11, 16], [13, 12], [9, 3], [5, 2], [3, 6]], PC); // in profile: the lip stands forward
      c.line(5, 2, 3, 6, C.white);
      c.line(9, 4, 12, 12, D(PC));
      c.rect(6, 0, 7, 1, C.steel);
      if (u) {
        c.col(12, 14, 26, SEA);
        c.row(b, 10, 14, SEA);
      }
    },
  });

  O('surreal-bird-cut-from-sky', 'great bird cut out of blue sky standing against the dusk a dove of cloud and daylight large family surreal', {
    w: 40, h: 36, base: 'side', solid: false,
    f(c, u) {
      const b = 34;
      // a dove, wings up, flying left
      c.poly([[3, 16], [8, 13], [14, 14], [20, 3], [27, 2], [24, 13], [32, 15], [38, 12], [36, 19], [26, 22], [14, 22], [8, 19]], MARK);
      c.poly([[20, 14], [30, 5], [34, 6], [28, 15]], MARK); // far wing
      c.poly([[1, 17], [3, 16], [3, 18]], hex('#b8963a'));
      fill(c, u ? nightAt(2) : dayAt(3)); // touched, it is a piece of night instead
      c.set(7, 15, NI);
      // it stands on the sea's edge all the same
      water(c, 1, b - 2, 38, b, hex('#3a4a5c'), 4);
      c.row(b - 3, 12, 28, NI);
    },
    sw: 16,
    s(c, u) {
      const b = 34;
      c.oval(5, 12, 10, 22, MARK); // coming at you: body, and wings to either side
      c.poly([[5, 15], [1, 4], [3, 3], [7, 13]], MARK);
      c.poly([[10, 15], [14, 4], [12, 3], [8, 13]], MARK);
      fill(c, u ? nightAt(2) : dayAt(3));
      c.set(6, 14, NI);
      c.set(9, 14, NI);
      c.rect(7, 16, 8, 16, hex('#b8963a'));
      water(c, 1, b - 2, 14, b, hex('#3a4a5c'), 5);
      c.row(b - 3, 5, 10, NI);
    },
  });

  O('surreal-bust-full-of-sky', 'bust of a head and shoulders filled with sky and clouds on a pedestal it opens and birds come out surreal', {
    w: 20, h: 42, uh: 50,
    f(c, u) {
      const b = 40;
      c.rect(5, 26, 14, b, MARB);
      c.row(26, 5, 14, L(MARB));
      c.col(5, 26, b, L(MARB));
      c.rect(3, b - 1, 16, b, D(MARB));
      c.oval(6, 3, 13, 14, MARK);
      c.rect(8, 14, 11, 17, MARK);
      c.poly([[2, 25], [4, 18], [15, 18], [17, 25]], MARK);
      if (u) c.clearRect(6, 2, 13, 6); // the top of the head lifted off
      fill(c, dayAt(4));
      if (u) {
        c.row(7, 6, 13, NI);
        c.poly([[14, 5], [18, 2], [19, 4], [15, 8]], DAY); // the lid, tipped back
      }
      return () => {
        if (!u) return;
        const bird = (x, y) => dots(c, NI, [x - 2, y - 1, x - 1, y, x, y + 1, x + 1, y, x + 2, y - 1]);
        bird(9, 2);
        bird(5, -3);
        bird(14, -5);
        bird(10, -8);
      };
    },
    sw: 14, suh: 50,
    s(c, u) {
      const b = 40;
      c.rect(3, 26, 10, b, MARB);
      c.row(26, 3, 10, L(MARB));
      c.col(3, 26, b, L(MARB));
      c.rect(2, b - 1, 11, b, D(MARB));
      c.oval(3, 3, 10, 14, MARK);
      c.set(11, 9, MARK); // nose
      c.rect(5, 14, 8, 17, MARK);
      c.poly([[3, 25], [4, 18], [9, 18], [11, 25]], MARK);
      if (u) c.clearRect(3, 2, 10, 6);
      fill(c, dayAt(4));
      if (u) c.row(7, 3, 10, NI);
      return () => {
        if (!u) return;
        const bird = (x, y) => dots(c, NI, [x - 2, y - 1, x - 1, y, x, y + 1, x + 1, y, x + 2, y - 1]);
        bird(6, 2);
        bird(9, -4);
        bird(4, -7);
      };
    },
  });

  O('surreal-folding-screen-of-eyes', 'folding screen painted with open eyes three panels they all close when you pass spellbound surreal', {
    w: 34, h: 42,
    f(c, u) {
      const b = 40,
        PN = hex('#6a5a64');
      for (let p = 0; p < 3; p++) {
        const x0 = 2 + p * 10,
          dy = p === 1 ? 0 : 1;
        c.rect(x0, 2 + dy, x0 + 9, b - dy, PN);
        c.frame(x0, 2 + dy, x0 + 9, b - dy, WD);
        c.col(x0 + 1, 3 + dy, b - 1 - dy, L(PN));
        for (let k = 0; k < 3; k++) {
          const y = 6 + k * 11 + dy + (p % 2) * 3;
          if (y + 5 > b - 2) continue;
          eye(c, x0 + 2, y, x0 + 8, y + 4, [hex('#5a7a8c'), hex('#6f5332'), hex('#5f7a52')][(p + k) % 3], !u, C.white);
        }
        c.rect(x0, b - dy, x0, b, WD);
        c.rect(x0 + 9, b - dy, x0 + 9, b, WD);
      }
    },
    sw: 12,
    s(c, u) {
      const b = 40,
        PN = hex('#6a5a64');
      // folded zig zag, end on
      c.poly([[2, 3], [5, 2], [5, b], [2, b - 1]], PN);
      c.poly([[5, 2], [9, 3], [9, b - 1], [5, b]], D(PN));
      c.col(2, 3, b - 1, WD);
      c.col(5, 2, b, WD);
      c.col(9, 3, b - 1, WD);
      for (const y of [8, 19, 30]) {
        if (!u) {
          c.set(3, y, C.white);
          c.set(4, y, hex('#5a7a8c'));
          c.set(7, y + 2, C.white);
        } else {
          c.set(3, y, PINK);
          c.set(4, y, PINK);
          c.set(7, y + 2, PINK);
        }
      }
    },
  });

  O('surreal-lips-sofa', 'large sofa in the shape of a pair of red lips satin settee mae west lips couch surreal', {
    w: 46, h: 26, base: 'side',
    f(c, u) {
      const b = 24;
      // upper lip (the back), lower lip (the seat)
      c.poly([[2, 13], [6, 6], [14, 3], [22, 6], [23, 6], [31, 3], [39, 6], [43, 13]], LIP);
      c.line(6, 6, 14, 3, L(LIP));
      c.line(23, 6, 31, 3, L(LIP));
      c.oval(2, 12, 43, 22, LIP);
      c.row(13, 3, 42, u ? NI : D(LIP));
      dots(c, L(LIP), [8, 16, 9, 16, 10, 15, 30, 15, 31, 15]);
      for (let x = 6; x <= 40; x += 6) c.col(x, 18, 21, D(LIP));
      c.row(22, 8, 37, D(LIP));
      if (u) {
        // sat on: they part a little, and there are teeth
        c.rect(6, 12, 39, 14, NI);
        for (let x = 8; x <= 37; x += 3) c.rect(x, 12, x + 1, 13, PORC);
        c.rect(18, 14, 27, 14, hex('#8a3a4a'));
      }
      c.rect(6, 23, 7, b, WD);
      c.rect(38, 23, 39, b, WD);
    },
    sw: 18,
    s(c, u) {
      const b = 24;
      // the corner of the mouth, end on
      c.poly([[4, 13], [6, 5], [10, 3], [13, 6], [14, 13]], LIP);
      c.oval(3, 12, 15, 22, LIP);
      c.col(5, 7, 12, L(LIP));
      c.row(13, 4, 14, u ? NI : D(LIP));
      c.row(22, 5, 13, D(LIP));
      if (u) {
        c.rect(5, 12, 13, 14, NI);
        c.rect(7, 12, 8, 13, PORC);
        c.rect(10, 12, 11, 13, PORC);
      }
      c.rect(5, 23, 6, b, WD);
      c.rect(12, 23, 13, b, WD);
    },
  });

  O('surreal-wheelbarrow-armchair', 'wheelbarrow upholstered in pink satin as an armchair buttoned cushions wooden wheel surreal', {
    w: 40, h: 28, base: 'side',
    f(c, u) {
      const b = 26;
      c.line(22, 16, 37, 9, W); // handles
      c.line(22, 17, 37, 10, WD);
      c.poly([[5, 6], [9, 5], [27, 12], [25, 20], [10, 20]], WD); // the tray
      c.poly([[7, 7], [10, 7], [25, 13], [24, 18], [11, 18]], SATIN);
      c.line(7, 7, 11, 18, L(SATIN));
      for (const [x, y] of [[10, 10], [13, 13], [17, 15], [21, 16], [12, 16], [16, 12]]) c.set(x, y, D(SATIN)); // buttons
      c.poly([[4, 4], [8, 3], [10, 7], [6, 8]], SATIN); // a rolled head rest
      if (u) {
        // someone has been sitting in it: the dent, and a long glove left
        c.oval(13, 12, 21, 17, D(SATIN));
        c.rect(22, 14, 30, 15, PORC);
        c.rect(29, 16, 30, 21, PORC);
      }
      c.rect(24, 21, 25, b, WD);
      wheel(c, 9, 21, 4, WD, C.iron, WL);
      c.row(b, 4, 28, NI);
    },
    sw: 20,
    s(c, u) {
      const b = 26;
      c.poly([[3, 5], [16, 5], [15, 20], [4, 20]], WD);
      c.poly([[5, 7], [14, 7], [13, 18], [6, 18]], SATIN);
      c.col(5, 8, 17, L(SATIN));
      for (const [x, y] of [[8, 10], [11, 10], [8, 14], [11, 14]]) c.set(x, y, D(SATIN));
      c.rect(4, 3, 15, 5, SATIN);
      if (u) {
        c.oval(7, 11, 12, 16, D(SATIN));
        c.rect(13, 16, 14, 22, PORC);
      }
      c.rect(8, 19, 11, b, WD); // the wheel, edge on
      c.col(8, 19, b, C.iron);
      c.rect(4, 21, 4, b, WD);
      c.rect(15, 21, 15, b, WD);
    },
  });

  O('surreal-gramophone-with-legs', 'gramophone on a stand with a pair of legs in shoes coming out of the horn and a hand for a needle surreal', {
    w: 26, h: 44, dy: 4,
    f(c, u) {
      const b = 38;
      // stand
      c.rect(4, 22, 19, 26, W);
      c.row(22, 4, 19, WL);
      c.rect(5, 27, 6, b, WD);
      c.rect(17, 27, 18, b, WD);
      c.rect(20, 23, 22, 24, C.brass); // crank
      c.rect(6, 20, 15, 21, FELT); // the record
      c.set(10, 20, C.blood);
      // the horn opening up and right
      c.poly([[11, 18], [13, 18], [22, 6], [14, 4]], C.brass);
      c.oval(13, 2, 23, 8, C.gold);
      c.oval(15, 3, 21, 7, hex('#6f5825'));
      // a white hand on the record for a needle
      c.rect(4, 17, 8, 19, PORC);
      c.rect(2, 15, 4, 17, PORC);
      // the legs out of the horn
      const SK = hex('#c9a98c');
      const STK = hex('#d6d0be');
      if (!u) {
        c.rect(16, -2, 17, 4, STK); // stockinged calves, straight up
        c.rect(20, -2, 21, 5, STK);
        c.rect(15, -4, 17, -3, C.blood); // red shoes
        c.rect(20, -4, 22, -3, C.blood);
        c.set(18, -3, C.blood);
        c.set(23, -3, C.blood);
      } else {
        // the record turns: they kick
        c.line(17, 4, 12, -1, STK);
        c.line(18, 4, 13, -1, STK);
        c.line(20, 4, 23, -2, STK);
        c.line(21, 4, 24, -2, STK);
        c.rect(10, -3, 12, -2, C.blood);
        c.set(10, -1, C.blood);
        c.rect(23, -4, 25, -3, C.blood);
        dots(c, PORC, [7, 20, 13, 21]);
      }
      return () => u && notes(c, 2, 9, MOON);
    },
    sw: 18, sdy: 4,
    s(c, u) {
      const b = 38,
        SK = hex('#c9a98c');
      c.rect(3, 22, 14, 26, W);
      c.row(22, 3, 14, WL);
      c.rect(4, 27, 5, b, WD);
      c.rect(12, 27, 13, b, WD);
      c.rect(5, 20, 12, 21, FELT);
      c.rect(8, 12, 9, 19, C.brass);
      c.oval(3, 2, 14, 13, C.gold); // the horn, mouth on
      c.oval(5, 4, 12, 11, hex('#6f5825'));
      const STK = hex('#d6d0be');
      if (!u) {
        c.rect(6, -1, 7, 6, STK);
        c.rect(10, -1, 11, 6, STK);
        c.rect(5, -4, 7, -2, C.blood); // the soles of two red shoes
        c.rect(10, -4, 12, -2, C.blood);
      } else {
        c.line(7, 6, 3, -1, STK);
        c.line(8, 6, 4, -1, STK);
        c.line(10, 6, 14, -1, STK);
        c.line(9, 6, 13, -1, STK);
        c.rect(1, -3, 3, -2, C.blood);
        c.rect(14, -3, 16, -2, C.blood);
      }
      return () => u && notes(c, 1, 16, MOON);
    },
  });

  O('surreal-fried-egg-on-a-string', 'fried egg hanging in the air on a string with no plate the yolk about to drop surreal', {
    w: 14, h: 40, solid: false,
    f(c, u) {
      const b = 38;
      c.oval(2, 12, 11, 20, PORC);
      c.rect(3, 19, 6, 22, PORC);
      c.rect(8, 18, 10, 20, PORC);
      c.col(3, 14, 18, C.white);
      if (!u) {
        c.oval(5, 14, 9, 18, hex('#c99a3a'));
        c.set(6, 15, hex('#e9c45a'));
      } else {
        // the yolk has gone, down a long thread of itself
        c.oval(5, 14, 9, 18, D(PORC));
        c.oval(4, b - 3, 9, b, hex('#c99a3a'));
        c.set(5, b - 2, hex('#e9c45a'));
      }
      c.row(b, 3, 10, u ? hex('#c99a3a') : NI);
      return () => {
        thin(c, 6, 0, 11, CLD);
        if (u) for (let y = 19; y <= b - 4; y += 1) if (y % 3) c.set(7, y, hex('#c99a3a'));
      };
    },
    s: 'same',
  });

  O('surreal-curtain-with-man-shaped-hole', 'heavy curtain with the shape of a man in a bowler hat cut out of it and sky showing through surreal', {
    w: 28, h: 44,
    f(c, u) {
      const b = 42,
        CT = hex('#6a3440');
      c.rect(2, 3, 25, b, CT);
      for (let x = 4; x <= 24; x += 4) c.col(x, 4, b, D(CT));
      for (let x = 2; x <= 24; x += 4) c.col(x, 4, b - 1, L(CT));
      c.row(b, 2, 25, D(CT));
      c.rect(1, 1, 26, 2, C.brass);
      // the man who is not there
      c.rect(11, 9, 16, 12, MARK); // hat
      c.rect(9, 13, 18, 13, MARK);
      c.oval(11, 14, 16, 19, MARK);
      c.poly([[7, 22], [10, 20], [17, 20], [20, 22], [20, 36], [7, 36]], MARK);
      c.rect(9, 37, 12, b, MARK);
      c.rect(15, 37, 18, b, MARK);
      fill(c, u ? nightAt(5) : dayAt(1));
      if (u) {
        c.oval(13, 23, 16, 26, MOON); // a moon where his heart would be
        c.set(15, 24, SKY);
        c.set(16, 24, SKY);
      }
    },
    sw: 10,
    s(c, u) {
      const b = 42,
        CT = hex('#6a3440');
      c.rect(3, 3, 6, b, CT);
      c.col(3, 4, b, L(CT));
      c.col(5, 4, b, D(CT));
      c.rect(4, 1, 5, 2, C.brass);
      c.col(6, 9, b, u ? SKY : DAY); // the cut edge
      if (u) c.set(6, 24, MOON);
    },
  });
};
