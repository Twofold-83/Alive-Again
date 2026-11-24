/* Dream world II, part 2: clocks in a tree, a ladder to a star, furniture that holds sea and sky. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, night, wheel, flame, clock, eye, notes } = H;
  const { CLD, NI, SKY, MOON, MOONd, OUT, LILAC, ROSE, DBLUE, PORC, GRASS, GRASSd, SEA, SEAl, BRICK } = P;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    WH = hex('#d9d5c8'),
    WARM = hex('#d9b45a'),
    BARK = hex('#5a4638'),
    WHALE = hex('#4a5a70'),
    WICK = hex('#8a6a40'),
    WICKd = hex('#6f5332'),
    MOSS = hex('#5f7048');

  O('dream-tree-of-clocks', 'tree of clocks bare tree hung with clock faces like fruit time dream', {
    w: 36, h: 48,
    f(c, u) {
      const b = 46;
      c.poly([[15, b], [16, 22], [20, 22], [22, b]], BARK);
      c.col(16, 24, b, L(BARK));
      c.line(17, 24, 8, 14, BARK);
      c.line(18, 24, 9, 14, BARK);
      c.line(19, 22, 27, 12, BARK);
      c.line(20, 23, 28, 12, BARK);
      c.line(18, 22, 18, 6, BARK);
      c.line(9, 14, 4, 10, BARK);
      c.line(9, 14, 11, 6, BARK);
      c.line(27, 12, 32, 9, BARK);
      c.line(27, 12, 25, 5, BARK);
      c.line(18, 12, 14, 3, BARK);
      c.line(18, 10, 22, 2, BARK);
      c.rect(13, b - 1, 24, b, BARK);
      const hang = (x, y, r, a, m) => {
        c.col(x, y - r - 2, y - r, CLD);
        clock(c, x, y, r, PORC, a, m, C.brass);
      };
      hang(5, 16, 3, 3, 9);
      hang(11, 22, 2, 7, 1);
      hang(18, 16, 3, 10, 2);
      hang(31, 15, 3, 5, 11);
      if (!u) {
        hang(25, 21, 3, 1, 6);
        hang(13, 10, 2, 4, 8);
      } else {
        // two have dropped, ripe
        clock(c, 28, b - 3, 3, PORC, 1, 6, C.brass);
        clock(c, 8, b - 2, 2, PORC, 4, 8, C.brass);
        dots(c, C.brass, [25, b, 31, b]);
      }
      grass(c, 2, 33, b, 4);
      return () => u && dots(c, MOON, [25, 20, 25, 24, 13, 9, 28, b - 8, 8, b - 6]);
    },
    sw: 24,
    s(c, u) {
      const b = 46;
      c.poly([[10, b], [10, 22], [13, 22], [14, b]], BARK);
      c.col(10, 24, b, L(BARK));
      c.line(11, 24, 5, 13, BARK);
      c.line(12, 23, 18, 12, BARK);
      c.line(12, 22, 12, 5, BARK);
      c.line(5, 13, 3, 8, BARK);
      c.line(18, 12, 20, 6, BARK);
      c.line(12, 10, 8, 3, BARK);
      c.line(12, 12, 16, 3, BARK);
      c.rect(8, b - 1, 16, b, BARK);
      const hang = (x, y, r, a, m) => {
        c.col(x, y - r - 2, y - r, CLD);
        clock(c, x, y, r, PORC, a, m, C.brass);
      };
      hang(4, 18, 3, 3, 9);
      hang(12, 16, 3, 10, 2);
      hang(20, 16, 2, 5, 11);
      if (!u) hang(17, 23, 3, 1, 6);
      else {
        clock(c, 18, b - 3, 3, PORC, 1, 6, C.brass);
        dots(c, C.brass, [15, b, 21, b]);
      }
      grass(c, 2, 21, b, 6);
      return () => u && dots(c, MOON, [17, 22, 17, 26, 18, b - 8]);
    },
  });

  O('dream-ladder-to-star', 'ladder to a star tall wooden ladder leaning on a yellow star in the sky dream', {
    w: 20, h: 60,
    f(c, u) {
      const b = 58;
      c.col(6, 9, b, WL);
      c.col(13, 9, b, W);
      for (let y = 13; y <= b - 2; y += 5) c.row(y, 7, 12, y % 2 ? W : WL);
      const st = (x, y, col) => {
        c.rect(x - 1, y - 1, x + 1, y + 1, col);
        c.col(x, y - 4, y + 4, col);
        c.row(y, x - 4, x + 4, col);
        c.set(x, y, C.white);
      };
      if (!u) st(10, 5, MOON);
      else st(5, b - 4, MOONd); // somebody fetched it down
      return () => {
        if (!u) dots(c, MOON, [3, 2, 17, 3, 2, 10, 17, 11]);
        else dots(c, MOON, [10, 4, 9, 7, 11, 9, 1, b - 10, 9, b - 9, 4, b - 11]);
      };
    },
    sw: 16,
    s(c, u) {
      const b = 58;
      for (let y = 9; y <= b; y++) {
        const x = 5 + Math.round(((y - 9) * 7) / (b - 9));
        c.set(x, y, WL);
        c.set(x + 1, y, W);
        if ((y - 13) % 5 === 0) c.set(x + 2, y, WD);
      }
      const st = (x, y, col) => {
        c.rect(x - 1, y - 3, x, y + 3, col);
        c.rect(x - 2, y - 1, x + 1, y + 1, col);
        dots(c, col, [x, y - 4, x, y + 4]);
      };
      if (!u) st(5, 6, MOON);
      else st(4, b - 4, MOONd);
      return () => {
        if (!u) dots(c, MOON, [1, 3, 10, 4, 9, 11]);
        else dots(c, MOON, [5, 5, 6, 8, 1, b - 10, 8, b - 10]);
      };
    },
  });

  O('dream-whale-eye-hill', 'sleeping whale eye a grey hill in the grass with one great closed eye whale back dream', {
    w: 42, h: 20, base: 'side',
    f(c, u) {
      const b = 18;
      c.oval(2, 2, 39, b + 14, WHALE);
      c.clearRect(0, b + 1, 41, b + 20);
      for (let x = 6; x <= 36; x += 5) c.set(x, 4 + ((x * 3) % 4), L(WHALE));
      dots(c, C.white, [30, 6, 31, 7, 33, 5, 9, 8, 10, 8]); // barnacles
      c.oval(13, 6, 26, 14, D(WHALE));
      if (!u) {
        c.oval(14, 7, 25, 13, blend(WHALE, C.ash, 0.4));
        c.line(14, 11, 25, 11, NI);
        dots(c, NI, [16, 12, 19, 12, 22, 12]);
      } else eye(c, 14, 7, 25, 13, hex('#6a5a3a'), true, hex('#d8d2b8'));
      grass(c, 1, 40, b, 2);
      return () => u && dots(c, GRASS, [3, b - 3, 38, b - 3, 5, b - 4]);
    },
    sw: 22,
    s(c, u) {
      const b = 18;
      c.oval(3, 2, 18, b + 14, WHALE);
      c.clearRect(0, b + 1, 21, b + 20);
      dots(c, L(WHALE), [7, 4, 12, 5]);
      c.oval(14, 6, 19, 14, D(WHALE)); // the eye, bulging from the flank
      if (!u) {
        c.rect(16, 8, 18, 12, blend(WHALE, C.ash, 0.4));
        c.set(18, 11, NI);
      } else {
        c.rect(16, 8, 18, 12, hex('#d8d2b8'));
        c.rect(17, 9, 18, 11, hex('#6a5a3a'));
        c.set(18, 10, NI);
      }
      grass(c, 1, 20, b, 3);
    },
  });

  O('dream-music-box-carousel', 'music box carousel little merry-go-round on a wooden box with a brass key tune dream', {
    w: 28, h: 32,
    f(c, u) {
      const b = 30;
      c.box(3, 23, 21, b, W);
      c.rect(4, 26, 20, 27, WD);
      c.rect(22, 25, 24, 26, C.brass); // the key
      c.rect(25, 23 + (u ? 2 : 0), 26, 26 + (u ? 2 : 0), C.brass);
      c.rect(2, 21, 22, 22, C.brass); // the turning floor
      // canopy
      c.poly([[12, 2], [1, 9], [23, 9]], ROSE);
      for (let x = 3; x <= 21; x += 4) c.line(12, 2, x, 9, PORC);
      c.rect(1, 9, 23, 10, PORC);
      for (let x = 2; x <= 22; x += 4) c.set(x, 11, ROSE);
      c.rect(12, 0, 12, 1, C.brass);
      // poles and horses
      const horse = (x, y, col) => {
        c.col(x, 11, 20, C.brass);
        c.rect(x - 2, y, x + 2, y + 2, col);
        c.rect(x - 3, y - 2, x - 2, y, col);
        c.set(x - 4, y - 1, col);
        c.set(x - 2, y + 3, col);
        c.set(x + 2, y + 3, col);
        c.set(x + 3, y, D(col));
      };
      horse(6, u ? 13 : 15, WH);
      horse(13, u ? 17 : 14, hex('#6f6a78'));
      horse(20, u ? 14 : 16, WP);
      return () => u && (notes(c, 24, 8), dots(c, MOON, [0, 14, 1, 5]));
    },
    sw: 28,
    s(c, u) {
      const b = 30;
      c.box(3, 23, 21, b, W);
      c.rect(4, 26, 20, 27, WD);
      c.rect(11, 25, 13, 27, C.brass); // the key, end on
      c.set(12, u ? 28 : 24, C.brass);
      c.rect(2, 21, 22, 22, C.brass);
      c.poly([[12, 2], [1, 9], [23, 9]], ROSE);
      for (let x = 1; x <= 23; x += 4) c.line(12, 2, x, 9, PORC);
      c.rect(1, 9, 23, 10, PORC);
      for (let x = 4; x <= 22; x += 4) c.set(x, 11, ROSE);
      c.rect(12, 0, 12, 1, C.brass);
      const horse = (x, y, col) => {
        c.col(x, 11, 20, C.brass);
        c.rect(x - 1, y - 2, x + 1, y + 2, col); // head on
        c.set(x - 1, y - 3, col);
        c.set(x + 1, y - 3, col);
        c.set(x - 1, y + 3, col);
        c.set(x + 1, y + 3, col);
        c.set(x, y - 1, NI);
      };
      horse(5, u ? 16 : 14, WP);
      horse(12, u ? 13 : 16, WH);
      horse(19, u ? 17 : 14, hex('#6f6a78'));
      return () => u && (notes(c, 24, 8), dots(c, MOON, [0, 14, 1, 5]));
    },
  });

  O('dream-balloon-basket', 'hot air balloon basket wicker gondola on ropes sandbags burner landed in a field dream', {
    w: 28, h: 46,
    f(c, u) {
      const b = 44,
        k = u ? -4 : 0, // it lifts
        ENV = hex('#9c5a48');
      // the mouth of the balloon, cut off by the sky
      c.poly([[3, 1], [24, 1], [20, 10], [7, 10]], ENV);
      for (let x = 5; x <= 22; x += 6) c.poly([[x, 1], [x + 2, 1], [x + 1 + (x < 12 ? 1 : 0), 10], [x + (x < 12 ? 2 : 0), 10]], PORC);
      c.row(10, 7, 20, WD);
      // ropes
      for (const [x0, x1] of [[7, 5], [11, 10], [16, 17], [20, 22]]) c.line(x0, 11, x1, 30 + k, WP);
      // burner
      c.rect(12, 14, 15, 16, C.iron);
      if (u) {
        c.rect(13, 9, 14, 13, C.flame);
        c.col(13, 11, 13, C.flameLight);
        c.set(14, 8, C.flame);
      }
      // basket
      c.rect(5, 31 + k, 22, 42 + k, WICK);
      c.rect(4, 30 + k, 23, 31 + k, WL);
      for (let y = 34; y <= 42; y += 2) c.row(y + k, 5, 22, WICKd);
      for (let x = 7; x <= 21; x += 3) c.col(x, 32 + k, 42 + k, WICKd);
      c.row(42 + k, 5, 22, D(WICKd));
      // sandbags
      if (!u) {
        c.rect(2, 34, 4, 38, P.SAND);
        c.set(3, 33, WP);
        c.rect(23, 35, 25, 39, P.SAND);
        c.set(24, 34, WP);
      } else {
        c.rect(1, b - 3, 4, b, P.SAND); // cut loose, lying in the grass
        c.rect(23, b - 2, 26, b, P.SAND);
        dots(c, D(P.SAND), [2, b - 1, 24, b - 1]);
        c.col(3, 34 + k, 36 + k, WP);
        c.col(24, 35 + k, 36 + k, WP);
      }
      grass(c, 1, 26, b, 5);
      if (!u) c.rect(5, 43, 22, 43, D(WICKd));
    },
    sw: 22,
    s(c, u) {
      const b = 44,
        k = u ? -4 : 0,
        ENV = hex('#9c5a48');
      c.poly([[2, 1], [19, 1], [16, 10], [5, 10]], ENV);
      for (let x = 4; x <= 16; x += 6) c.poly([[x, 1], [x + 2, 1], [x + 1 + (x < 9 ? 1 : 0), 10], [x + (x < 9 ? 2 : 0), 10]], PORC);
      c.row(10, 5, 16, WD);
      for (const [x0, x1] of [[5, 4], [10, 10], [16, 17]]) c.line(x0, 11, x1, 30 + k, WP);
      c.rect(9, 14, 12, 16, C.iron);
      if (u) {
        c.rect(10, 9, 11, 13, C.flame);
        c.col(10, 11, 13, C.flameLight);
      }
      c.rect(4, 31 + k, 17, 42 + k, WICK);
      c.rect(3, 30 + k, 18, 31 + k, WL);
      for (let y = 34; y <= 42; y += 2) c.row(y + k, 4, 17, WICKd);
      for (let x = 6; x <= 16; x += 3) c.col(x, 32 + k, 42 + k, WICKd);
      c.rect(8, 34 + k, 13, 42 + k, D(WICK)); // the little door
      c.frame(8, 34 + k, 13, 42 + k, WICKd);
      if (!u) {
        c.rect(1, 35, 3, 39, P.SAND);
        c.set(2, 34, WP);
      } else {
        c.rect(1, b - 2, 4, b, P.SAND);
        c.col(2, 35 + k, 36 + k, WP);
      }
      grass(c, 1, 20, b, 6);
      if (!u) c.rect(4, 43, 17, 43, D(WICKd));
    },
  });

  O('dream-umbrella-upturned', 'umbrella upside down black umbrella full of rain water like a pond handle up dream', {
    w: 32, h: 26,
    f(c, u) {
      const b = 24,
        UM = P.FELT;
      // the bowl of the umbrella, standing on its point
      c.poly([[1, 12], [30, 12], [22, 20], [16, 23], [9, 20]], UM);
      for (const x of [6, 11, 16, 21, 26]) c.line(x, 12, 16 + (x - 16) * 0.2, 22, L(L(UM)));
      c.rect(15, 23, 16, b, C.iron);
      c.rect(3, 11, 28, 12, SEA); // the water it holds
      c.row(11, 3, 28, SEAl);
      // shaft and crook
      c.col(16, 3, 11, WD);
      c.rect(16, 2, 19, 2, WD);
      c.col(19, 3, 5, WD);
      if (u) {
        // a paper boat on it
        c.poly([[7, 9], [14, 9], [12, 11], [9, 11]], C.paper);
        c.poly([[10, 6], [10, 9], [12, 9]], C.white);
        dots(c, SEAl, [5, 12, 24, 12]);
      }
      return () => {
        dots(c, SEAl, u ? [2, 16, 2, 19, 29, 15, 29, 18, 29, 21] : [29, 16]);
        c.row(b, 12, 19, u ? SEA : NI);
      };
    },
    sw: 32,
    s(c, u) {
      const b = 24,
        UM = P.FELT;
      c.poly([[1, 12], [30, 12], [22, 20], [16, 23], [9, 20]], UM);
      for (const x of [4, 9, 16, 23, 28]) c.line(x, 12, 16 + (x - 16) * 0.2, 22, L(L(UM)));
      c.rect(15, 23, 16, b, C.iron);
      c.rect(3, 11, 28, 12, SEA);
      c.row(11, 3, 28, SEAl);
      c.col(16, 3, 11, WD); // the crook turned towards you
      c.rect(15, 2, 17, 2, WD);
      c.rect(15, 3, 17, 5, WL);
      c.set(16, 4, WD);
      if (u) {
        c.poly([[19, 9], [25, 9], [24, 11], [20, 11]], C.paper);
        c.poly([[22, 6], [21, 9], [23, 9]], C.white);
        dots(c, SEAl, [5, 12, 26, 12]);
      }
      return () => {
        dots(c, SEAl, u ? [2, 16, 2, 19, 29, 15, 29, 18, 29, 21] : [2, 16]);
        c.row(b, 12, 19, u ? SEA : NI);
      };
    },
  });

  O('dream-wardrobe-of-sea', 'wardrobe with the sea inside old wooden wardrobe doors open onto waves and a horizon dream', {
    w: 26, h: 42, uw: 34, udx: 4,
    f(c, u) {
      const b = 40;
      c.rect(2, 4, 23, b - 2, W);
      c.rect(1, 2, 24, 4, WD);
      c.row(2, 1, 24, WL);
      c.col(2, 5, b - 2, WL);
      c.rect(2, b - 1, 4, b, WD);
      c.rect(21, b - 1, 23, b, WD);
      if (!u) {
        c.col(12, 5, b - 3, WD);
        c.col(13, 5, b - 3, WL);
        for (const x0 of [4, 15]) {
          c.frame(x0, 7, x0 + 6, 20, WD);
          c.frame(x0, 23, x0 + 6, b - 5, WD);
        }
        c.set(11, 22, C.brass);
        c.set(14, 22, C.brass);
        dots(c, SEA, [12, b - 2, 13, b - 2]); // it leaks a little
      } else {
        c.rect(4, 6, 21, 20, hex('#8f9da6')); // sky
        c.rect(4, 21, 21, b - 3, SEA);
        c.row(21, 4, 21, SEAl);
        c.oval(14, 9, 18, 13, MOON);
        dots(c, MOON, [15, 22, 16, 23, 15, 25, 16, 27]);
        dots(c, SEAl, [6, 25, 7, 25, 10, 29, 11, 29, 18, 31, 19, 31, 7, 34, 8, 34, 14, 35]);
        c.row(b - 3, 4, 21, C.white); // a wave breaking over the sill
        dots(c, C.white, [6, b - 4, 7, b - 4, 12, b - 4, 17, b - 4, 18, b - 4]);
        // doors swung wide
        c.rect(-2, 4, 1, b - 3, WD);
        c.col(-2, 4, b - 3, W);
        c.rect(24, 4, 27, b - 3, WD);
        c.col(27, 4, b - 3, D(WD));
        c.rect(5, b - 1, 20, b, SEA);
      }
      return () => u && dots(c, SEAl, [1, b, 3, b - 1, 22, b, 25, b, 28, b, -3, b]);
    },
    sw: 12, suw: 20,
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
        c.rect(10, 4, 16, b - 3, W); // a door standing out
        c.col(16, 4, b - 3, WD);
        c.frame(11, 7, 15, 20, WD);
        c.frame(11, 23, 15, b - 5, WD);
        c.row(b, 10, 18, SEA);
        dots(c, C.white, [10, b - 1, 12, b - 1, 15, b - 1]);
      } else c.set(10, 22, C.brass);
      return () => u && dots(c, SEAl, [11, b, 14, b, 17, b - 1]);
    },
  });

  O('dream-bath-of-stars', 'bath full of stars clawfoot bathtub filled with night sky instead of water dream', {
    w: 40, h: 24, base: 'side', uh: 30,
    f(c, u) {
      const b = 22,
        EN = hex('#d2cec2');
      c.poly([[2, 6], [37, 6], [35, 15], [31, 18], [8, 18], [4, 15]], EN);
      c.rect(1, 5, 38, 6, L(EN));
      c.row(7, 3, 36, D(EN));
      c.line(8, 18, 31, 18, D(EN));
      for (const [x, w] of [[4, 6], [9, 8], [16, 6], [21, 9], [29, 5]]) c.oval(x, 2 + (x % 2), x + w, 6, SKY); // the night heaped in it like foam
      c.row(4, 4, 33, SKY);
      dots(c, MOON, [6, 3, 12, 2, 14, 4, 19, 3, 24, 2, 27, 4, 31, 4]);
      dots(c, C.white, [10, 4, 23, 3]);
      c.rect(1, 5, 38, 5, L(EN));
      for (const x of [7, 30]) {
        c.rect(x, 19, x + 2, b, C.brass);
        c.set(x - 1, b, C.brass);
      }
      c.rect(36, 1, 37, 4, C.brass); // tap
      c.rect(33, 1, 36, 2, C.brass);
      c.set(33, 3, C.brass);
      return () => {
        if (!u) return dots(c, MOON, [12, 2, 25, 1]);
        // someone got in: the night slops over and rises
        dots(c, SKY, [3, 8, 3, 9, 3, 11, 20, 8, 20, 9, 36, 8, 36, 10]);
        star(c, 10, 0, MOON, true);
        star(c, 18, -4, MOON, true);
        star(c, 26, -1, C.white, true);
        dots(c, MOON, [14, -2, 22, 1, 30, -5, 8, -5, 5, 1, 34, -3, 20, 2]);
        dots(c, SKY, [12, b, 13, b, 14, b, 22, b, 23, b]);
      };
    },
    sw: 20, suh: 30,
    s(c, u) {
      const b = 22,
        EN = hex('#d2cec2');
      c.poly([[2, 6], [17, 6], [16, 15], [13, 18], [6, 18], [3, 15]], EN);
      c.rect(1, 5, 18, 6, L(EN));
      c.row(7, 3, 16, D(EN));
      for (const [x, w] of [[3, 5], [7, 6], [12, 4]]) c.oval(x, 2 + (x % 2), x + w, 6, SKY);
      dots(c, MOON, [5, 4, 9, 3, 14, 4]);
      c.rect(1, 5, 18, 5, L(EN));
      c.rect(4, 19, 5, b, C.brass);
      c.rect(14, 19, 15, b, C.brass);
      c.rect(9, 1, 10, 4, C.brass); // the tap at the far end
      c.rect(8, 1, 11, 1, C.brass);
      return () => {
        if (!u) return dots(c, MOON, [5, 2]);
        dots(c, SKY, [2, 8, 2, 10, 17, 8, 17, 9, 10, 8]);
        star(c, 6, 0, MOON, true);
        star(c, 14, -3, C.white, true);
        dots(c, MOON, [10, -5, 3, -2, 16, 1, 9, -1]);
        dots(c, SKY, [8, b, 9, b, 10, b]);
      };
    },
  });

  O('dream-bookcase-of-birds', 'bookcase whose books fly away like birds tall shelves open books flapping dream', {
    w: 26, h: 42, uh: 50,
    f(c, u) {
      const b = 40,
        cols = [C.wine, C.navy, C.forest, C.mustard, hex('#6f5a4a'), C.plum, C.teal];
      c.rect(2, 2, 23, b, W);
      c.col(2, 2, b, WL);
      c.row(2, 2, 23, WL);
      c.rect(1, 1, 24, 2, WD);
      const r = rnd(7);
      for (let s = 0; s < 4; s++) {
        const y0 = 4 + s * 9;
        c.rect(4, y0, 21, y0 + 7, D(WD));
        let x = 4;
        while (x <= 20) {
          const w = 1 + ((r() * 2) | 0),
            h = 5 + ((r() * 3) | 0),
            col = cols[(r() * cols.length) | 0],
            gone = u && ((s === 0 && x > 8 && x < 18) || (s === 1 && x > 13) || (s === 2 && x > 5 && x < 10));
          if (!gone) {
            c.rect(x, y0 + 8 - h, Math.min(21, x + w - 1), y0 + 7, col);
            c.set(x, y0 + 9 - h, L(col));
          }
          x += w + (r() < 0.2 ? 1 : 0);
        }
      }
      c.rect(2, b - 1, 23, b, WD);
      return () => {
        if (!u) return;
        // books on the wing over it
        const bird = (x, y, col) => (dots(c, col, [x - 2, y - 1, x - 1, y, x, y + 1, x + 1, y, x + 2, y - 1, x - 3, y - 1, x + 3, y - 1]), dots(c, C.paper, [x - 1, y + 1, x + 1, y + 1]), c.set(x, y + 2, K));
        bird(8, -5, C.wine);
        bird(18, -2, C.navy);
        bird(13, -8, C.forest);
        dots(c, C.paper, [5, -1, 22, -6]);
      };
    },
    sw: 10, suh: 50,
    s(c, u) {
      const b = 40;
      c.rect(2, 2, 7, b, W);
      c.col(2, 2, b, WL);
      c.rect(1, 1, 8, 2, WD);
      c.col(7, 3, b, WD);
      for (let s = 0; s < 4; s++) c.row(12 + s * 9, 3, 6, WD);
      c.rect(2, b - 1, 7, b, WD);
      return () => {
        if (!u) return;
        dots(c, C.wine, [2, -5, 3, -4, 4, -3, 5, -4, 6, -5]);
        dots(c, C.forest, [4, -9, 5, -8, 6, -9]);
        c.set(4, -2, C.paper);
      };
    },
  });

  O('dream-rain-harp', 'harp strung with rain golden harp whose strings are falling rain music dream', {
    w: 24, h: 42,
    f(c, u) {
      const b = 40,
        G = C.gold;
      // pillar, neck and sound board
      c.rect(3, 4, 4, b - 2, G);
      c.col(3, 4, b - 2, L(G));
      c.rect(2, 2, 5, 4, C.brass);
      c.line(5, 5, 12, 8, G);
      c.line(12, 8, 19, 4, G);
      c.line(5, 6, 12, 9, D(G));
      c.line(12, 9, 19, 5, D(G));
      c.rect(19, 3, 20, 6, G);
      c.poly([[19, 6], [21, 6], [8, b - 2], [4, b - 2]], C.brass);
      c.line(20, 7, 7, b - 2, D(C.brass));
      c.rect(2, b - 1, 11, b, C.brass);
      return () => {
        // the strings are rain
        for (let i = 0; i < 7; i++) {
          const x = 6 + i * 2,
            y0 = 7 + Math.abs(i - 3),
            y1 = b - 4 - i * 4.4;
          for (let y = y0; y <= y1; y++) if (u ? (y + i) % 3 : (y + i) % 4 !== 0) c.set(x + (u && y % 4 < 2 ? 1 : 0), y, (y + i) % 5 ? SEAl : C.white);
        }
        if (u) {
          c.row(b, 12, 20, SEA);
          dots(c, SEAl, [14, b, 17, b, 12, b - 2, 16, b - 3, 19, b - 2]);
          notes(c, 18, 16, SEAl);
        }
      };
    },
    sw: 12,
    s(c, u) {
      const b = 40,
        G = C.gold;
      c.rect(5, 4, 6, b - 2, G);
      c.col(5, 4, b - 2, L(G));
      c.rect(4, 2, 7, 4, C.brass);
      c.rect(4, 6, 7, b - 2, C.brass); // the sound board, edge on
      c.col(7, 6, b - 2, D(C.brass));
      c.rect(3, b - 1, 8, b, C.brass);
      return () => {
        for (let y = 7; y <= b - 4; y++) if (u ? y % 3 : y % 4) c.set(u && y % 4 < 2 ? 4 : 5, y, y % 5 ? SEAl : C.white);
        if (u) {
          c.row(b, 7, 10, SEA);
          dots(c, SEAl, [9, b - 2, 10, b - 4]);
        }
      };
    },
  });

  O('dream-mirror-moonlit', 'standing mirror cheval glass that shows a moon and a night that is not in the room dream', {
    w: 18, h: 40,
    f(c, u) {
      const b = 38;
      c.col(2, 6, b, WD);
      c.col(15, 6, b, WD);
      c.rect(1, b - 1, 4, b, WD);
      c.rect(13, b - 1, 16, b, WD);
      c.oval(3, 2, 14, 34, W);
      c.oval(4, 3, 13, 33, SKY);
      repaint(c, 4, 3, 13, 33, SKY, nightAt(4));
      c.oval(7, 7, 11, 11, MOON);
      c.set(8, 8, C.white);
      c.set(2, 18, C.brass);
      c.set(15, 18, C.brass);
      if (u) {
        // a hand laid on the glass from the other side
        const HN = hex('#a9b3b6');
        c.rect(7, 20, 10, 24, HN);
        c.col(6, 22, 23, HN);
        for (const x of [7, 8, 9, 10]) c.col(x, 17 + (x === 7 || x === 10 ? 1 : 0), 20, HN);
        c.rect(8, 25, 9, 29, D(HN));
        dots(c, C.white, [5, 16, 12, 15, 12, 26]);
      }
    },
    sw: 10,
    s(c, u) {
      const b = 38;
      c.col(4, 6, b, WD);
      c.col(5, 6, b, W);
      c.rect(2, b - 1, 7, b, WD);
      c.poly([[5, 2], [6, 2], [4, 34], [3, 34]], W); // the glass tilted in its frame
      c.line(6, 3, 4, 33, SKY);
      c.set(6, 18, C.brass);
      if (u) dots(c, hex('#a9b3b6'), [6, 20, 7, 20, 6, 22, 7, 22, 6, 21]);
      return () => u && dots(c, C.white, [8, 19, 8, 23]);
    },
  });

  O('dream-fireplace-in-field', 'fireplace standing alone in a field brick hearth and chimney with no house round it dream', {
    w: 30, h: 44, suw: 16,
    f(c, u) {
      const b = 42;
      c.rect(10, 2, 19, 17, BRICK); // chimney stack, broken at the top
      c.clearRect(10, 2, 12, 3);
      c.clearRect(17, 2, 19, 2);
      c.rect(3, 18, 26, b, BRICK);
      for (let y = 4; y <= b; y += 3) for (let x = 3 + ((y % 2) * 2); x <= 26; x += 5) if (c.get(x, y)) c.set(x, y, D(BRICK));
      for (let y = 5; y <= b; y += 3) c.row(y, 3, 26, c.get(4, y) ? blend(BRICK, D(BRICK), 0.5) : null);
      c.rect(1, 16, 28, 18, C.stoneLight); // mantel
      c.row(18, 1, 28, C.stone);
      c.rect(8, 24, 21, b, NI);
      c.rect(9, 23, 20, 23, NI);
      c.rect(8, b - 1, 21, b, C.stoneDark);
      c.rect(11, b - 3, 18, b - 2, WD); // logs
      c.rect(4, 13, 6, 15, C.brass); // a clock left on the mantel
      c.set(5, 14, PORC);
      if (u) {
        c.poly([[11, b - 3], [14, b - 11], [17, b - 6], [18, b - 3]], C.flame);
        c.poly([[13, b - 3], [14, b - 8], [16, b - 3]], C.flameLight);
        dots(c, C.flame, [10, b - 5, 19, b - 6, 16, b - 12]);
        c.row(b - 1, 9, 20, hex('#7a4a2a'));
      }
      grass(c, 1, 28, b, 8);
      return () => u && (cloud(c, 11, -2, 19, 1, C.ash, 2), dots(c, C.flameLight, [12, b - 13, 17, b - 14]));
    },
    sw: 14,
    s(c, u) {
      const b = 42;
      c.rect(4, 2, 9, 17, BRICK);
      c.clearRect(4, 2, 5, 3);
      c.rect(3, 18, 10, b, BRICK);
      for (let y = 4; y <= b; y += 3) for (let x = 3 + ((y % 2) * 2); x <= 10; x += 4) if (c.get(x, y)) c.set(x, y, D(BRICK));
      c.rect(2, 16, 12, 18, C.stoneLight);
      c.row(18, 2, 12, C.stone);
      c.col(11, 23, b, NI); // the dark of the opening
      c.rect(10, 13, 11, 15, C.brass);
      if (u) {
        c.col(11, b - 9, b, C.flame);
        dots(c, C.flameLight, [12, b - 4, 12, b - 6, 13, b - 2]);
        dots(c, C.flame, [12, b - 2, 12, b - 3, 13, b - 1]);
      }
      grass(c, 1, 12, b, 9);
      return () => u && cloud(c, 3, -2, 10, 1, C.ash, 2);
    },
  });

  O('dream-armchair-mossy', 'armchair overgrown with moss and small white flowers green chair left outdoors dream', {
    w: 24, h: 28,
    f(c, u) {
      const b = 26,
        A = hex('#6a5a4a');
      c.rect(4, 3, 19, 20, A);
      c.rect(5, 2, 18, 2, A);
      c.rect(1, 12, 5, 23, A);
      c.rect(18, 12, 22, 23, A);
      c.rect(1, 11, 5, 12, L(A));
      c.rect(18, 11, 22, 12, L(A));
      c.rect(6, 15, 17, 18, L(A));
      c.rect(2, 22, 21, 24, D(A));
      c.rect(3, 25, 4, b, WD);
      c.rect(19, 25, 20, b, WD);
      // moss creeping from the top and the left
      const r = rnd(3);
      for (let y = 2; y <= 24; y++) for (let x = 1; x <= 22; x++) if (c.get(x, y) && r() < 0.75 - (y + x * 0.6) / 34) c.set(x, y, r() < 0.3 ? L(MOSS) : MOSS);
      dots(c, C.white, [3, 12, 9, 4, 15, 6, 20, 13]);
      if (u) {
        // where someone sat, it has flowered
        for (let x = 7; x <= 16; x++) if (x % 2) c.set(x, 15 + (x % 3 ? 0 : 1), C.white);
        dots(c, C.white, [8, 17, 12, 17, 15, 16, 10, 10, 13, 11, 11, 13, 9, 13]);
        dots(c, MOON, [8, 16, 13, 16, 11, 11]);
      }
    },
    sw: 22,
    s(c, u) {
      const b = 26,
        A = hex('#6a5a4a');
      c.rect(3, 2, 7, 22, A); // the back
      c.rect(4, 12, 18, 23, A); // the arm
      c.rect(4, 11, 18, 12, L(A));
      c.rect(8, 14, 16, 22, D(A));
      c.rect(3, 22, 18, 24, D(A));
      c.rect(4, 25, 5, b, WD);
      c.rect(16, 25, 17, b, WD);
      const r = rnd(5);
      for (let y = 2; y <= 24; y++) for (let x = 3; x <= 18; x++) if (c.get(x, y) && r() < 0.8 - (y + x * 0.8) / 32) c.set(x, y, r() < 0.3 ? L(MOSS) : MOSS);
      dots(c, C.white, [4, 5, 6, 9, 10, 11]);
      if (u) dots(c, C.white, [9, 10, 11, 10, 13, 10, 15, 10, 8, 9, 12, 9, 6, 6, 5, 12]);
    },
  });

  function teaTable(c, u, front) {
    const b = 30,
      x0 = front ? 2 : 4,
      x1 = front ? 29 : 19,
      m = (x0 + x1) >> 1,
      CL = hex('#c9c0b0');
    // it floats a hand above the ground: a shadow under it
    c.row(b, x0 + 3, x1 - 3, NI);
    c.rect(x0, 16, x1, 17, CL);
    c.row(16, x0, x1, L(CL));
    c.poly([[x0, 18], [x1, 18], [x1 - 2, 23], [x0 + 2, 23]], CL);
    for (let x = x0 + 2; x <= x1 - 2; x += 3) c.col(x, 19, 23, D(CL));
    c.rect(m - 1, 24, m, 26, WD);
    c.rect(m - 3, 27, m + 2, 27, WD);
    const k = u ? 1 : 0;
    // teapot
    const px = front ? m - 2 : m,
      py = 10 - k * 6;
    c.rect(px, py, px + 5, py + 5, PORC);
    c.row(py - 1, px + 1, px + 4, PORC);
    c.set(px + 2, py - 2, ROSE);
    c.rect(px + 6, py + 1, px + 7, py + 2, PORC);
    if (front) c.rect(px - 2, py + 1, px - 1, py + 3, PORC);
    c.row(py + 3, px, px + 5, ROSE);
    // cups
    const cup = (x, y) => {
      c.rect(x, y, x + 3, y + 2, PORC);
      c.row(y, x, x + 3, hex('#7a5230'));
      c.row(y + 3, x - 1, x + 4, D(PORC));
    };
    if (front) {
      cup(x0 + 2, 12 - k * 4);
      cup(x1 - 5, 12 - k * 9);
    } else cup(x0 + 1, 12 - k * 5);
    return () => {
      if (!u) return dots(c, CLD, [px + 8, py - 1, px + 9, py - 3]);
      dots(c, MOON, [px + 2, py + 8, px + 3, py + 10, x0 + 3, 13, x1 - 4, 9, x1 - 5, 12]);
      dots(c, hex('#7a5230'), [px + 8, py + 4, px + 9, py + 6]);
    };
  }
  O('dream-tea-table-floating', 'tea table floating above the ground round table white cloth teapot and cups rising dream', {
    w: 32, h: 32,
    f: (c, u) => teaTable(c, u, true),
    sw: 24,
    s: (c, u) => teaTable(c, u, false),
  });

  O('dream-streetlamp-sleeping', 'street lamp asleep bent over drooping iron lamp post that wakes and lights dream', {
    w: 22, h: 52,
    f(c, u) {
      const b = 50,
        I = C.iron;
      c.rect(8, b - 3, 13, b, I);
      c.rect(9, b - 6, 12, b - 4, I);
      if (u) {
        c.rect(10, 12, 11, b - 7, I);
        c.col(10, 12, b - 7, L(I));
        c.row(22, 8, 13, I);
        c.poly([[8, 11], [13, 11], [14, 4], [7, 4]], C.flameLight);
        c.frame(7, 4, 14, 11, I);
        c.col(10, 5, 10, D(C.flameLight));
        c.rect(8, 2, 13, 3, I);
        c.rect(10, 0, 11, 1, I);
        c.rect(10, 7, 11, 9, C.white);
      } else {
        c.rect(10, 24, 11, b - 7, I);
        c.col(10, 24, b - 7, L(I));
        // the neck droops over to the right
        c.line(10, 24, 11, 18, I);
        c.line(11, 24, 12, 18, I);
        c.line(12, 18, 15, 15, I);
        c.line(15, 15, 18, 17, I);
        c.line(13, 17, 15, 16, I);
        c.rect(15, 18, 20, 19, I);
        c.poly([[15, 20], [20, 20], [19, 27], [16, 27]], OUT);
        c.frame(15, 20, 20, 27, I);
        c.rect(17, 28, 18, 29, I);
        c.row(31, 8, 13, I);
      }
      return () => {
        if (u) dots(c, MOON, [4, 6, 17, 6, 5, 10, 16, 10, 10, 14, 3, 2, 18, 2]);
        else dots(c, CLD, [20, 12, 21, 9, 20, 6]); // z z z
      };
    },
    sw: 14,
    s(c, u) {
      const b = 50,
        I = C.iron;
      c.rect(4, b - 3, 9, b, I);
      c.rect(5, b - 6, 8, b - 4, I);
      if (u) {
        c.rect(6, 12, 7, b - 7, I);
        c.col(6, 12, b - 7, L(I));
        c.row(22, 4, 9, I);
        c.poly([[4, 11], [9, 11], [10, 4], [3, 4]], C.flameLight);
        c.frame(3, 4, 10, 11, I);
        c.rect(4, 2, 9, 3, I);
        c.rect(6, 0, 7, 1, I);
        c.rect(6, 7, 7, 9, C.white);
      } else {
        c.rect(6, 16, 7, b - 7, I);
        c.col(6, 16, b - 7, L(I));
        c.rect(5, 14, 8, 16, I); // the bend, seen from in front
        c.rect(4, 17, 9, 18, I);
        c.poly([[4, 19], [9, 19], [8, 27], [5, 27]], OUT); // the lamp hangs down before the post
        c.frame(4, 19, 9, 27, I);
        c.rect(6, 28, 7, 29, I);
        c.row(31, 4, 9, I);
      }
      return () => {
        if (u) dots(c, MOON, [1, 6, 12, 6, 1, 10, 12, 10, 6, 14]);
        else dots(c, CLD, [11, 12, 12, 9, 11, 6]);
      };
    },
  });

  O('dream-telephone-on-column', 'telephone ringing on a stone column black dial phone alone in nowhere receiver dream', {
    w: 20, h: 38,
    f(c, u) {
      const b = 36,
        S = C.stoneLight,
        F = P.FELT;
      c.rect(5, 16, 13, b - 2, S);
      for (let x = 6; x <= 12; x += 2) c.col(x, 17, b - 3, C.stone);
      c.rect(4, 14, 14, 15, S);
      c.rect(3, b - 1, 15, b, S);
      c.row(b, 3, 15, C.stone);
      // the phone
      c.poly([[6, 8], [12, 8], [14, 13], [4, 13]], F);
      c.rect(8, 9, 10, 11, PORC);
      c.set(9, 10, F);
      c.set(7, 7, F);
      c.set(11, 7, F);
      c.row(8, 6, 12, L(L(F)));
      if (!u) {
        c.rect(3, 4, 15, 5, F); // receiver in its cradle
        c.rect(3, 6, 5, 7, F);
        c.rect(13, 6, 15, 7, F);
        c.row(4, 4, 14, L(L(F)));
      } else {
        c.rect(16, 21, 17, 30, F); // hanging by its cord, a voice coming out
        c.rect(15, 21, 16, 22, F);
        c.rect(15, 29, 16, 30, F);
      }
      return () => {
        if (!u) return dots(c, MOON, [1, 2, 0, 5, 2, 0, 17, 2, 18, 5, 16, 0]); // ringing
        for (let y = 12; y <= 20; y++) c.set(16 + (y % 2), y, C.ash);
        c.set(15, 12, C.ash);
        dots(c, CLD, [14, 33, 18, 33, 16, 35]);
      };
    },
    sw: 16,
    s(c, u) {
      const b = 36,
        S = C.stoneLight,
        F = P.FELT;
      c.rect(3, 16, 11, b - 2, S);
      for (let x = 4; x <= 10; x += 2) c.col(x, 17, b - 3, C.stone);
      c.rect(2, 14, 12, 15, S);
      c.rect(1, b - 1, 13, b, S);
      c.row(b, 1, 13, C.stone);
      c.poly([[5, 8], [8, 8], [11, 13], [4, 13]], F); // the dial slopes to the right
      c.line(9, 9, 10, 12, PORC);
      c.rect(5, 7, 7, 7, F);
      if (!u) {
        c.rect(4, 4, 8, 6, F); // receiver, end on
        c.row(4, 5, 7, L(L(F)));
      } else {
        c.rect(1, 21, 2, 30, F);
      }
      return () => {
        if (!u) return dots(c, MOON, [2, 2, 1, 5, 11, 2, 12, 5]);
        for (let y = 12; y <= 20; y++) c.set(1 + (y % 2), y, C.ash);
        dots(c, CLD, [0, 33, 3, 34]);
      };
    },
  });
};
