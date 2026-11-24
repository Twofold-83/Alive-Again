/* Dream world II, part 3: curtains with no window, a cradle moon, a well of stars, houses that walk. */
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
    VELV = hex('#6a3440'),
    LEAF = hex('#46604a'),
    GLASS = hex('#8fb0b4');

  O('dream-curtains-no-window', 'curtains hanging in the air heavy red curtains on a brass rail no window behind them night dream', {
    w: 30, h: 42,
    f(c, u) {
      const b = 40;
      if (u) {
        // drawn back: a night that is only there between them
        night(c, 8, 5, 21, b - 6, 5);
        c.oval(15, 9, 19, 13, MOON);
        c.oval(17, 8, 20, 12, SKY);
        c.rect(8, b - 5, 21, b - 5, OUT);
      }
      const fold = (x0, x1) => {
        c.rect(x0, 4, x1, b, VELV);
        for (let x = x0 + 1; x <= x1; x += 3) c.col(x, 5, b, D(VELV));
        for (let x = x0; x <= x1; x += 3) c.col(x, 5, b - 1, L(VELV));
        c.row(b, x0, x1, D(VELV));
        c.row(b - 2, x0, x1, C.brass);
      };
      if (!u) {
        fold(3, 14);
        fold(15, 26);
        c.col(15, 4, b, D(D(VELV)));
      } else {
        fold(3, 7);
        fold(22, 26);
        c.rect(2, 22, 8, 23, C.brass); // tied back
        c.rect(21, 22, 27, 23, C.brass);
      }
      c.rect(1, 2, 28, 3, C.brass);
      c.rect(0, 1, 1, 4, C.gold);
      c.rect(28, 1, 29, 4, C.gold);
      for (let x = 4; x <= 26; x += 3) c.set(x, 4, C.gold);
      return () => u && dots(c, MOON, [10, b - 3, 14, b - 2, 19, b - 3, 12, b, 17, b]);
    },
    sw: 10,
    s(c, u) {
      const b = 40;
      c.rect(3, 4, 6, b, VELV);
      c.col(3, 5, b, L(VELV));
      c.col(5, 5, b, D(VELV));
      c.row(b - 2, 3, 6, C.brass);
      c.rect(4, 1, 5, 4, C.gold);
      if (u) {
        c.rect(2, 22, 7, 23, C.brass);
        c.clear(6, 30);
        c.clear(6, 31);
      }
      return () => u && dots(c, MOON, [8, 12, 8, 20, 1, 16, 8, b - 4]);
    },
  });

  O('dream-moon-cradle', 'cradle that is a crescent moon lying on its back with a blanket and pillow rocking dream', {
    w: 30, h: 28,
    f(c, u) {
      const b = 26,
        k = u ? 1 : 0;
      // the crescent, horns up
      c.oval(2, 2, 27, b, MOON);
      for (let y = 2; y <= b; y++) for (let x = 2; x <= 27; x++) if (((x - 14.5 - k * 2) / 11) ** 2 + ((y - 9 + k) / 11) ** 2 <= 1) c.clear(x, y);
      c.clearRect(0, 0, 29, 9);
      for (let y = 10; y <= b; y++) for (let x = 2; x <= 27; x++) if (c.get(x, y) && ((x - 14.5) / 13) ** 2 + ((y - 14) / 12.5) ** 2 > 0.82) c.set(x, y, MOONd);
      dots(c, MOONd, [8, 22, 12, 23, 20, 22]);
      // bedding in the hollow
      if (!u) {
        c.rect(8, 17, 21, 20, WH);
        c.rect(12, 17, 21, 20, LILAC);
        c.row(17, 12, 21, L(LILAC));
        c.rect(7, 16, 10, 17, WH);
      } else {
        c.rect(9, 18, 21, 20, WH);
        c.rect(19, 15, 24, 19, LILAC); // blanket dragged over the horn
        c.rect(23, 19, 25, 23, LILAC);
        c.col(25, 19, 23, D(LILAC));
        c.rect(8, 17, 11, 18, WH);
        dots(c, D(WH), [13, 19, 15, 19]);
      }
      return () => {
        star(c, 5, 5, MOON, true);
        thin(c, 5, 0, 3, CLD);
        if (u) dots(c, MOON, [1, 20, 0, 23, 28, 12, 29, 9]);
        c.row(b + 1, u ? 10 : 12, u ? 15 : 17, NI);
      };
    },
    sw: 16,
    s(c, u) {
      const b = 26;
      // end on: one horn towards you, the bowl behind
      c.oval(3, 12, 12, b, MOON);
      c.poly([[6, 10], [9, 10], [11, 17], [4, 17]], MOON);
      c.col(4, 14, 23, L(MOON));
      c.rect(10, 16, 12, 24, MOONd);
      c.row(b, 5, 10, MOONd);
      if (!u) {
        c.rect(5, 14, 10, 16, LILAC);
        c.row(14, 5, 10, L(LILAC));
      } else {
        c.rect(5, 15, 10, 16, WH);
        c.rect(9, 13, 13, 16, LILAC);
        c.rect(12, 16, 13, 22, LILAC);
      }
      return () => {
        star(c, 7, 5, MOON, true);
        thin(c, 7, 0, 3, CLD);
        if (u) dots(c, MOON, [1, 12, 14, 10]);
      };
    },
  });

  O('dream-rocking-horse-winged', 'rocking horse with wings dapple grey wooden horse on rockers feathered wings nursery dream', {
    w: 34, h: 30, uh: 34, base: 'side',
    f(c, u) {
      const b = 28,
        G = hex('#9a9a9c'),
        k = u ? -4 : 0; // it has left its rockers a little
      // rockers stay on the floor
      c.poly([[3, b - 3], [6, b], [27, b], [30, b - 3], [28, b - 3], [26, b - 1], [7, b - 1], [5, b - 3]], C.red);
      c.row(b, 7, 26, C.blood);
      // body, neck, head
      c.oval(9, 13 + k, 25, 20 + k, G);
      c.poly([[9, 15 + k], [6, 6 + k], [10, 5 + k], [14, 14 + k]], G);
      c.rect(2, 6 + k, 9, 9 + k, G);
      c.rect(2, 9 + k, 5, 10 + k, G);
      c.set(7, 4 + k, G);
      c.set(8, 4 + k, G);
      c.set(6, 7 + k, NI);
      c.set(2, 9 + k, NI);
      c.line(9, 5 + k, 13, 13 + k, P.FELT); // mane
      c.line(10, 5 + k, 14, 12 + k, P.FELT);
      dots(c, L(G), [13, 16 + k, 17, 15 + k, 21, 17 + k, 19, 19 + k, 11, 18 + k]);
      c.rect(15, 13 + k, 19, 14 + k, C.wine); // saddle
      c.poly([[25, 14 + k], [29, 17 + k], [28, 21 + k], [25, 17 + k]], P.FELT); // tail
      // legs
      for (const [x0, x1] of [[10, 6], [13, 12], [21, 24], [24, 28]]) c.line(x0, 20 + k, x1, b - 3 + (u ? -3 : 0), D(G));
      // the wing
      if (!u) {
        c.poly([[15, 14], [18, 5], [28, 8], [24, 14]], WH);
        for (let i = 0; i < 3; i++) c.line(19 + i * 3, 7 + i, 18 + i * 3, 13, D(WH));
      } else {
        c.poly([[15, 10], [14, -3], [20, -4], [26, 2], [25, 10]], WH); // up and open
        for (let i = 0; i < 3; i++) c.line(16 + i * 3, -2 + i, 17 + i * 3, 9, D(WH));
      }
      return () => u && dots(c, MOON, [4, 14, 2, 17, 30, 12, 32, 16, 16, b - 5]);
    },
    sw: 18, suh: 34,
    s(c, u) {
      const b = 28,
        G = hex('#9a9a9c'),
        k = u ? -4 : 0;
      c.rect(2, b - 1, 4, b, C.red);
      c.rect(13, b - 1, 15, b, C.red);
      c.rect(5, b - 2, 12, b - 2, C.blood);
      // wings to both sides
      if (!u) {
        c.poly([[5, 14], [1, 8], [3, 7], [6, 11]], WH);
        c.poly([[12, 14], [16, 8], [14, 7], [11, 11]], WH);
      } else {
        c.poly([[5, 10], [0, -2], [3, -3], [6, 6]], WH);
        c.poly([[12, 10], [17, -2], [14, -3], [11, 6]], WH);
        dots(c, D(WH), [2, 1, 4, 4, 15, 1, 13, 4]);
      }
      c.oval(5, 12 + k, 12, 21 + k, G);
      c.rect(6, 4 + k, 11, 13 + k, G); // head and neck, facing you
      c.rect(7, 9 + k, 10, 12 + k, L(G));
      c.set(6, 3 + k, G);
      c.set(11, 3 + k, G);
      c.set(7, 6 + k, NI);
      c.set(10, 6 + k, NI);
      c.rect(8, 3 + k, 9, 5 + k, P.FELT);
      dots(c, NI, [8, 11 + k, 9, 11 + k]);
      c.col(6, 21 + k, b - 3 + (u ? -3 : 0), D(G));
      c.col(11, 21 + k, b - 3 + (u ? -3 : 0), D(G));
      return () => u && dots(c, MOON, [1, 16, 16, 14, 8, b - 5]);
    },
  });

  O('dream-well-of-stars', 'well of stars old stone well with a little roof the water below is the night sky bucket dream', {
    w: 28, h: 40,
    f(c, u) {
      const b = 38,
        S = C.stone;
      // posts and roof
      c.rect(4, 8, 5, 26, W);
      c.rect(22, 8, 23, 26, W);
      c.poly([[13, 1], [14, 1], [26, 8], [1, 8]], hex('#59493c'));
      c.row(8, 1, 26, WD);
      c.line(13, 1, 1, 8, hex('#6f5d4c'));
      c.row(13, 6, 21, WD); // windlass
      c.rect(24, 12, 25, 14, C.iron);
      // the rope and the bucket
      thin(c, 13, 14, u ? 18 : 24, WP);
      if (u) {
        c.rect(10, 19, 16, 24, WL);
        c.row(21, 10, 16, C.iron);
        c.row(19, 10, 16, SKY);
        dots(c, MOON, [11, 19, 14, 19]);
      }
      // the stone ring
      c.rect(2, 25, 25, b, S);
      c.rect(1, 24, 26, 26, C.stoneLight);
      c.rect(4, 24, 23, 24, u ? SKY : NI); // looking in over the rim
      if (u) dots(c, MOON, [7, 24, 15, 24, 20, 24]);
      for (let y = 28; y <= b; y += 4) for (let x = 2 + ((y >> 2) % 2) * 4; x <= 25; x += 8) c.rect(x, y, Math.min(25, x + 5), y + 2, D(S));
      dots(c, P.GRASS, [3, 27, 4, 28, 20, 31, 24, 27]);
      grass(c, 1, 26, b, 3);
      return () => u && (star(c, 13, 17, MOON, true), star(c, 9, 15, C.white), star(c, 18, 16, MOON), dots(c, MOON, [11, 26, 12, 28]));
    },
    sw: 22,
    s(c, u) {
      const b = 38,
        S = C.stone;
      c.rect(9, 8, 11, 26, W);
      c.rect(1, 6, 20, 8, hex('#59493c')); // the roof, from its gable
      c.row(8, 1, 20, WD);
      c.poly([[10, 1], [11, 1], [15, 5], [6, 5]], hex('#6f5d4c'));
      c.rect(8, 12, 12, 14, WD);
      c.rect(13, 12, 16, 13, C.iron); // the crank
      c.col(16, 12, 16, C.iron);
      if (u) {
        c.rect(7, 19, 13, 24, WL);
        c.row(21, 7, 13, C.iron);
        c.row(19, 7, 13, SKY);
        c.set(9, 19, MOON);
      }
      c.rect(2, 25, 19, b, S);
      c.rect(1, 24, 20, 26, C.stoneLight);
      c.rect(4, 24, 17, 24, u ? SKY : NI);
      for (let y = 28; y <= b; y += 4) for (let x = 2 + ((y >> 2) % 2) * 4; x <= 19; x += 8) c.rect(x, y, Math.min(19, x + 5), y + 2, D(S));
      grass(c, 1, 20, b, 4);
      return () => u && (star(c, 10, 17, MOON, true), star(c, 15, 16, C.white));
    },
  });

  O('dream-signpost-everywhere', 'signpost pointing everywhere wooden fingerpost with too many arms all directions lost dream', {
    w: 28, h: 46,
    f(c, u) {
      const b = 44;
      c.rect(13, 3, 14, b, W);
      c.col(13, 3, b, WL);
      c.rect(12, 1, 15, 2, WD);
      const arm = (y, left, len, col) => {
        if (left) {
          c.rect(13 - len, y, 12, y + 3, col);
          c.set(12 - len, y + 1, col);
          c.set(12 - len, y + 2, col);
          c.row(y + 2, 14 - len, 10, D(col));
        } else {
          c.rect(15, y, 14 + len, y + 3, col);
          c.set(15 + len, y + 1, col);
          c.set(15 + len, y + 2, col);
          c.row(y + 2, 17, 12 + len, D(col));
        }
      };
      // used: every arm has swung round to point the same way
      arm(4, !u && true, 10, WP);
      arm(9, false, 11, PORC);
      arm(14, !u && true, 8, WP);
      arm(19, false, 9, WP);
      arm(24, !u && true, 11, PORC);
      arm(29, false, 6, WP);
      if (!u) {
        c.poly([[12, 33], [12, 35], [6, 39], [5, 37]], WP); // one points down
        c.poly([[15, 0], [17, 0], [20, -4], [19, -4]], WP);
      } else arm(34, false, 10, WP);
      grass(c, 8, 20, b, 2);
    },
    sw: 14,
    s(c, u) {
      const b = 44;
      c.rect(6, 3, 7, b, W);
      c.col(6, 3, b, WL);
      c.rect(5, 1, 8, 2, WD);
      // the arms end on, pointing at you and away
      for (const y of u ? [4, 9, 14, 19, 24, 29, 34] : [4, 9, 14, 19, 24, 29]) {
        c.rect(5, y, 8, y + 3, y % 2 ? WP : PORC);
        c.row(y + 3, 5, 8, D(WP));
        if (u) c.rect(6, y + 1, 7, y + 2, L(WP));
      }
      if (!u) c.rect(5, 33, 8, 39, WP);
      grass(c, 2, 11, b, 3);
    },
  });

  O('dream-bench-waiting', 'park bench with a suitcase waiting slatted green bench someone left a hat dream', {
    w: 40, h: 24, base: 'side',
    f(c, u) {
      const b = 22,
        G = hex('#4f6658');
      for (const x of [4, 28]) {
        c.rect(x, 6, x + 1, b, C.iron);
        c.rect(x - 1, 14, x + 3, 15, C.iron);
        c.col(x + 3, 15, b, C.iron);
      }
      for (const y of [6, 9]) {
        c.rect(3, y, 31, y + 1, G);
        c.row(y, 3, 31, L(G));
      }
      c.rect(2, 13, 32, 14, G);
      c.row(13, 2, 32, L(G));
      // the suitcase beside it
      if (!u) {
        c.box(33, 13, 38, b, hex('#7a5a3a'));
        c.rect(35, 11, 36, 12, WD);
        c.row(16, 33, 38, WD);
        dots(c, C.brass, [34, 17, 37, 17]);
      } else {
        // the suitcase is gone; a hat and a folded paper are left
        H.bowler(c, 8, 7);
        c.rect(20, 12, 25, 12, C.paper);
        c.row(11, 21, 25, D(C.paper));
        dots(c, GRASSd, [33, b, 35, b, 37, b]);
      }
      grass(c, 1, u ? 34 : 38, b, 6);
    },
    sw: 16,
    s(c, u) {
      const b = 22,
        G = hex('#4f6658');
      c.rect(3, 6, 4, b, C.iron);
      c.rect(3, 14, 11, 15, C.iron);
      c.col(11, 15, b, C.iron);
      c.line(4, 6, 5, 13, C.iron);
      c.rect(5, 6, 5, 7, G);
      c.rect(5, 9, 5, 10, G);
      c.rect(4, 13, 12, 13, G);
      if (!u) {
        c.box(5, 16, 9, b, hex('#7a5a3a')); // the suitcase, end on, pushed under
        c.set(7, 18, C.brass);
      } else {
        c.rect(6, 11, 10, 12, P.FELT);
        c.row(12, 5, 11, P.FELT);
        c.rect(7, 9, 9, 10, P.FELT);
      }
      grass(c, 1, 14, b, 7);
    },
  });

  O('dream-gate-with-no-fence', 'garden gate with no fence iron gate between two stone posts standing in open grass dream', {
    w: 30, h: 32, uw: 36,
    f(c, u) {
      const b = 30,
        S = C.stoneLight,
        I = C.iron;
      for (const x of [2, 23]) {
        c.rect(x, 6, x + 4, b, S);
        c.col(x + 4, 7, b, C.stone);
        c.rect(x - 1, 4, x + 5, 5, S);
        c.oval(x, 0, x + 4, 4, S);
        dots(c, P.GRASS, [x + 1, 20, x + 2, 26, x + 3, 12]);
      }
      if (!u) {
        for (let x = 8; x <= 21; x += 2) c.col(x, 10 - (Math.abs(x - 14.5) < 3 ? 2 : 0), b - 2, I);
        c.row(12, 7, 22, I);
        c.row(b - 4, 7, 22, I);
        c.rect(14, 18, 15, 19, C.brass);
      } else {
        // open, swung towards you
        c.poly([[23, 10], [29, 8], [29, b], [23, b - 2]], null);
        for (let x = 29; x <= 34; x += 2) c.col(x, 9 + (34 - x) / 3, b - 1 + (x - 29) / 5, I);
        c.line(28, 12, 34, 11, I);
        c.line(28, b - 4, 34, b - 2, I);
        dots(c, P.GRASSd, [9, b - 1, 12, b - 1, 15, b - 1, 18, b - 1]); // a path worn through
      }
      grass(c, 1, 28, b, 4);
      if (u) c.row(b, 9, 20, P.SAND);
    },
    sw: 10, suw: 22,
    s(c, u) {
      const b = 30,
        S = C.stoneLight,
        I = C.iron;
      c.rect(2, 6, 6, b, S);
      c.col(6, 7, b, C.stone);
      c.rect(1, 4, 7, 5, S);
      c.oval(2, 0, 6, 4, S);
      dots(c, P.GRASS, [3, 20, 4, 12]);
      if (!u) c.col(7, 10, b - 2, I);
      else {
        for (let x = 8; x <= 19; x += 2) c.col(x, 10, b - 2, I);
        c.row(12, 7, 19, I);
        c.row(b - 4, 7, 19, I);
        grass(c, 7, 20, b, 9);
      }
      grass(c, 1, 8, b, 5);
    },
  });

  O('dream-blanket-tent', 'blanket tent den made of a quilt over a rope lit from inside with a torch childhood dream', {
    w: 36, h: 28,
    f(c, u) {
      const b = 26,
        Q = hex('#7a6a84');
      c.poly([[17, 3], [18, 3], [33, b], [2, b]], Q);
      c.line(17, 3, 2, b, L(Q));
      for (let i = 1; i < 5; i++) c.line(17 + i, 3 + i * 5, 3 + i * 3 + 14 - i * 3, 3 + i * 5, D(Q));
      for (let y = 8; y <= b; y += 5) c.row(y, 17 - Math.round((y - 3) * 0.62), 18 + Math.round((y - 3) * 0.62), D(Q));
      dots(c, ROSE, [9, 16, 14, 11, 22, 12, 26, 19, 7, 22, 29, 23]);
      // the way in
      c.poly([[17, 9], [18, 9], [23, b], [12, b]], u ? WARM : NI);
      if (u) {
        c.poly([[17, 14], [18, 14], [20, b], [15, b]], C.flameLight);
        c.rect(16, 19, 18, b, NI); // someone small sitting in there
        c.rect(16, 17, 18, 18, NI);
      }
      c.line(18, 9, 23, b, D(Q));
      // the rope it hangs on
      c.row(2, 1, 34, WP);
      c.col(1, 2, 5, WP);
      c.col(34, 2, 5, WP);
      return () => u && dots(c, WARM, [11, b + 1, 14, b + 1, 20, b + 1, 24, b + 1]);
    },
    sw: 24,
    s(c, u) {
      const b = 26,
        Q = hex('#7a6a84');
      c.rect(3, 3, 20, b, Q); // the long side of the quilt
      c.row(3, 3, 20, L(Q));
      for (let y = 8; y <= b; y += 5) c.row(y, 3, 20, D(Q));
      for (let x = 7; x <= 20; x += 5) c.col(x, 4, b, D(Q));
      dots(c, ROSE, [5, 6, 10, 11, 15, 16, 18, 6, 5, 21, 10, 21]);
      c.rect(2, 2, 21, 2, WP);
      c.col(1, 2, 6, WP);
      c.col(22, 2, 6, WP);
      if (u) {
        // lit through the cloth
        for (let y = 9; y <= b - 1; y++) for (let x = 6; x <= 17; x++) if ((x + y) % 2 === 0) c.set(x, y, blend(Q, WARM, 0.6));
        c.rect(10, 17, 13, b - 1, D(Q));
        c.rect(10, 14, 13, 16, D(Q));
      }
    },
  });

  O('dream-fishbowl-giant', 'giant fish bowl glass bowl as tall as a child one goldfish too big for it dream', {
    w: 28, h: 30, uh: 38,
    f(c, u) {
      const b = 28,
        FISH = hex('#c0703a');
      c.oval(2, 4, 25, b, GLASS);
      c.rect(8, 2, 19, 5, GLASS);
      c.rect(7, 1, 20, 2, L(GLASS));
      c.oval(4, 9, 23, b - 1, SEA);
      c.rect(5, 9, 22, 9, SEAl);
      c.col(4, 12, 20, L(GLASS));
      c.set(5, 10, C.white);
      c.rect(9, b - 2, 18, b - 1, P.SAND);
      c.col(8, b - 8, b - 2, LEAF);
      c.set(9, b - 6, LEAF);
      c.set(7, b - 4, LEAF);
      const fish = (x, y) => {
        c.oval(x, y, x + 9, y + 5, FISH);
        c.poly([[x + 9, y + 2], [x + 13, y - 1], [x + 13, y + 6]], FISH);
        c.set(x + 2, y + 2, NI);
        c.set(x + 2, y + 1, C.white);
        dots(c, L(FISH), [x + 4, y + 1, x + 5, y + 1, x + 6, y + 2]);
        c.set(x + 5, y - 1, FISH);
      };
      if (!u) fish(7, 13);
      else dots(c, SEAl, [10, 14, 12, 12, 14, 15, 11, 18]);
      return () => {
        if (!u) return dots(c, C.white, [6, 15, 8, 12]);
        // it swims in the air over the bowl now
        const t = part(16, 9, (t) => {
          t.oval(1, 2, 10, 7, FISH);
          t.poly([[10, 4], [14, 1], [14, 8]], FISH);
          t.set(3, 4, NI);
          t.set(3, 3, C.white);
          dots(t, L(FISH), [5, 3, 6, 3, 7, 4]);
        });
        t.outline();
        c.stamp(t, 5, -9);
        dots(c, SEAl, [8, 1, 12, 0, 16, 1, 22, -3, 3, -3]);
      };
    },
    sw: 28, suh: 38,
    s(c, u) {
      const b = 28,
        FISH = hex('#c0703a');
      c.oval(2, 4, 25, b, GLASS);
      c.rect(8, 2, 19, 5, GLASS);
      c.rect(7, 1, 20, 2, L(GLASS));
      c.oval(4, 9, 23, b - 1, SEA);
      c.rect(5, 9, 22, 9, SEAl);
      c.col(4, 12, 20, L(GLASS));
      c.set(5, 10, C.white);
      c.rect(9, b - 2, 18, b - 1, P.SAND);
      c.col(19, b - 8, b - 2, LEAF);
      c.set(18, b - 6, LEAF);
      const fish = (c2, x, y) => {
        // head on
        c2.oval(x, y, x + 6, y + 7, FISH);
        c2.set(x + 1, y + 3, NI);
        c2.set(x + 5, y + 3, NI);
        c2.row(y + 5, x + 2, x + 4, D(FISH));
        c2.set(x + 3, y - 1, FISH);
        c2.set(x - 1, y + 4, FISH);
        c2.set(x + 7, y + 4, FISH);
      };
      if (!u) fish(c, 10, 12);
      else dots(c, SEAl, [10, 14, 12, 12, 14, 15]);
      return () => {
        if (!u) return;
        const t = part(11, 11, (t) => fish(t, 2, 2));
        t.outline();
        c.stamp(t, 8, -10);
        dots(c, SEAl, [8, 1, 16, 1, 22, -3]);
      };
    },
  });

  O('dream-boat-in-tree', 'rowing boat caught in a tree small boat high in the branches after a flood that never was dream', {
    w: 38, h: 52,
    f(c, u) {
      const b = 50;
      c.poly([[16, b], [17, 26], [21, 26], [23, b]], BARK);
      c.col(17, 28, b, L(BARK));
      c.line(18, 28, 8, 18, BARK);
      c.line(19, 28, 9, 18, BARK);
      c.line(20, 27, 30, 17, BARK);
      c.line(21, 28, 31, 17, BARK);
      c.rect(14, b - 1, 25, b, BARK);
      // leaves
      for (const [x, y, w, h] of [[2, 6, 14, 12], [22, 4, 14, 12], [10, 1, 16, 10], [5, 14, 9, 7], [26, 13, 10, 8]]) c.oval(x, y, x + w, y + h, LEAF);
      const r = rnd(4);
      for (let i = 0; i < 40; i++) {
        const x = 2 + ((r() * 34) | 0),
          y = 1 + ((r() * 20) | 0);
        if (c.get(x, y) === LEAF) c.set(x, y, r() < 0.5 ? L(LEAF) : D(LEAF));
      }
      // the boat, wedged
      const BT = hex('#8f8f86');
      c.poly([[5, 12], [33, 9], [30, 17], [10, 19]], BT);
      c.line(5, 12, 33, 9, L(BT));
      c.line(7, 15, 31, 12, D(BT));
      c.line(10, 19, 30, 17, D(BT));
      c.line(12, 8, 6, 22, WP); // an oar hanging out
      c.rect(5, 22, 7, 25, WP);
      if (u) {
        // a rope ladder let down, and a light aboard
        c.col(25, 18, b - 2, WP);
        c.col(29, 18, b - 2, WP);
        for (let y = 21; y <= b - 3; y += 4) c.row(y, 25, 29, WP);
        c.rect(20, 6, 22, 9, C.iron);
        c.rect(21, 7, 21, 8, C.flameLight);
      }
      grass(c, 4, 34, b, 5);
      return () => u && dots(c, MOON, [19, 7, 23, 7, 21, 4]);
    },
    sw: 28,
    s(c, u) {
      const b = 50;
      c.poly([[11, b], [12, 26], [15, 26], [17, b]], BARK);
      c.col(12, 28, b, L(BARK));
      c.line(13, 28, 6, 18, BARK);
      c.line(14, 27, 21, 17, BARK);
      c.rect(9, b - 1, 19, b, BARK);
      for (const [x, y, w, h] of [[2, 6, 12, 12], [13, 4, 12, 12], [6, 1, 14, 10], [4, 14, 8, 6], [16, 13, 8, 7]]) c.oval(x, y, x + w, y + h, LEAF);
      const r = rnd(8);
      for (let i = 0; i < 30; i++) {
        const x = 2 + ((r() * 24) | 0),
          y = 1 + ((r() * 20) | 0);
        if (c.get(x, y) === LEAF) c.set(x, y, r() < 0.5 ? L(LEAF) : D(LEAF));
      }
      const BT = hex('#8f8f86');
      c.poly([[8, 9], [19, 9], [17, 18], [10, 18]], BT); // the stern towards you
      c.row(9, 8, 19, L(BT));
      c.row(13, 9, 18, D(BT));
      c.col(13, 14, 18, D(BT));
      c.line(20, 8, 23, 22, WP);
      if (u) {
        c.col(11, 19, b - 2, WP);
        c.col(15, 19, b - 2, WP);
        for (let y = 22; y <= b - 3; y += 4) c.row(y, 11, 15, WP);
        c.rect(12, 5, 14, 8, C.iron);
        c.rect(13, 6, 13, 7, C.flameLight);
      }
      grass(c, 3, 24, b, 6);
      return () => u && dots(c, MOON, [11, 6, 15, 6, 13, 3]);
    },
  });

  O('dream-house-on-legs', 'little house walking on long bird legs hut on stilts lit window chimney dream', {
    w: 26, h: 48,
    f(c, u) {
      const b = 46,
        WALL = hex('#b9b09a'),
        ROOF = hex('#6a4a44'),
        LEG = hex('#b89a5a');
      // legs: standing, or one lifted to take a step
      const leg = (x, lift) => {
        const y1 = b - (lift ? 7 : 0);
        c.col(x, 28, 36, LEG);
        c.line(x, 36, x + (lift ? 3 : 1), y1 - 1, LEG);
        const fx = x + (lift ? 3 : 1);
        c.row(y1, fx - 2, fx + 2, LEG);
        c.set(fx - 3, y1, D(LEG));
        c.set(x, 36, D(LEG));
      };
      leg(8, false);
      leg(16, u);
      // the house
      c.rect(4, 13, 21, 28, WALL);
      c.col(4, 13, 28, L(WALL));
      c.row(28, 4, 21, D(WALL));
      c.poly([[12, 3], [13, 3], [24, 13], [1, 13]], ROOF);
      c.line(12, 3, 1, 13, L(ROOF));
      c.row(13, 1, 24, D(ROOF));
      c.rect(17, 2, 19, 8, BRICK);
      c.rect(7, 17, 11, 22, u ? WARM : NI);
      c.frame(7, 17, 11, 22, WD);
      c.col(9, 18, 21, WD);
      c.rect(15, 18, 19, 28, hex('#5a4638'));
      c.set(18, 23, C.brass);
      dots(c, D(WALL), [13, 15, 6, 25, 12, 26]);
      return () => {
        if (!u) return;
        cloud(c, 16, -1, 23, 1, C.ash, 2);
        dots(c, P.GRASSd, [17, b, 18, b, 19, b, 20, b]);
        dots(c, C.ash, [21, b - 2, 23, b - 1]);
      };
    },
    sw: 22,
    s(c, u) {
      const b = 46,
        WALL = hex('#b9b09a'),
        ROOF = hex('#6a4a44'),
        LEG = hex('#b89a5a');
      // from the side: the knees bend backwards
      const leg = (x, lift) => {
        const y1 = b - (lift ? 7 : 0);
        c.line(x, 28, x - 3, 36, LEG);
        c.line(x - 3, 36, x + (lift ? 2 : 0), y1 - 1, LEG);
        const fx = x + (lift ? 2 : 0);
        c.row(y1, fx - 1, fx + 4, LEG);
        c.set(fx - 2, y1, D(LEG));
      };
      leg(9, false);
      if (u) leg(14, true);
      c.rect(4, 13, 17, 28, WALL);
      c.col(4, 13, 28, L(WALL));
      c.row(28, 4, 17, D(WALL));
      c.rect(2, 4, 19, 13, ROOF); // the roof slope towards you
      c.row(4, 2, 19, L(ROOF));
      for (let y = 6; y <= 12; y += 3) c.row(y, 2, 19, D(ROOF));
      c.row(13, 2, 19, D(ROOF));
      c.rect(13, 1, 15, 5, BRICK);
      c.rect(8, 17, 13, 22, u ? WARM : NI);
      c.frame(8, 17, 13, 22, WD);
      c.col(10, 18, 21, WD);
      return () => u && cloud(c, 12, -2, 19, 0, C.ash, 2);
    },
  });

  O('dream-cuckoo-clock-giant', 'giant cuckoo clock carved chalet clock taller than a child pine cone weights bird dream', {
    w: 22, h: 44, uw: 28,
    f(c, u) {
      const b = 42;
      c.rect(4, 9, 17, 26, W);
      c.col(4, 9, 26, WL);
      c.poly([[10, 1], [11, 1], [20, 10], [1, 10]], WD);
      c.line(10, 1, 1, 10, W);
      c.row(10, 1, 20, D(WD));
      dots(c, LEAF, [3, 12, 4, 14, 18, 12, 17, 14, 3, 24, 18, 24, 5, 26, 16, 26]); // carved leaves
      clock(c, 10, 19, 4, PORC, u ? 12 : 11, u ? 0 : 10);
      // the little door
      c.rect(8, 10, 12, 13, u ? NI : WD);
      c.set(12, 12, u ? NI : C.brass);
      // chains and weights
      thin(c, 7, 27, 34, C.brass);
      thin(c, 13, 27, 38, C.brass);
      c.rect(6, 35, 8, 39, BARK);
      c.rect(12, 39, 14, b, BARK);
      c.set(7, 40, BARK);
      // pendulum
      const px = u ? 12 : 10;
      c.line(10, 27, px, 32, WD);
      c.rect(px - 1, 32, px + 1, 34, LEAF);
      if (u) {
        c.rect(13, 11, 17, 12, W); // the arm out
        c.rect(18, 9, 22, 12, hex('#8f8a7c')); // the bird
        c.rect(23, 10, 24, 10, C.flame);
        c.set(21, 10, NI);
        c.set(18, 8, hex('#8f8a7c'));
        c.rect(13, 10, 13, 13, WD);
      }
      return () => u && notes(c, 22, 6);
    },
    sw: 14, suw: 20,
    s(c, u) {
      const b = 42;
      c.rect(3, 9, 9, 26, W);
      c.col(3, 9, 26, WL);
      c.rect(2, 4, 11, 10, WD); // roof slope, edge on
      c.row(4, 2, 11, W);
      c.col(10, 15, 23, PORC); // the face, edge on
      c.col(9, 14, 24, D(W));
      thin(c, 6, 27, 34, C.brass);
      thin(c, 8, 27, 38, C.brass);
      c.rect(5, 35, 7, 39, BARK);
      c.rect(7, 39, 9, b, BARK);
      c.rect(u ? 10 : 9, 28, u ? 11 : 10, 33, LEAF);
      if (u) {
        c.rect(10, 11, 14, 12, W);
        c.rect(14, 9, 17, 12, hex('#8f8a7c'));
        c.set(18, 10, C.flame);
        c.set(16, 10, NI);
      }
      return () => u && notes(c, 14, 5);
    },
  });

  O('dream-firefly-jar-giant', 'giant jar of fireflies glass jar as big as a barrel full of small lights lid dream', {
    w: 18, h: 28, uh: 38,
    f(c, u) {
      const b = 26,
        G = hex('#6f8a88');
      c.rect(3, 7, 14, b, G);
      c.rect(4, 5, 13, 6, G);
      c.col(3, 8, b - 1, L(G));
      c.col(5, 9, b - 3, L(G));
      c.row(b, 4, 13, D(G));
      c.rect(4, 8, 13, b - 1, blend(G, NI, 0.55));
      c.col(5, 9, b - 3, G);
      if (!u) {
        c.rect(4, 2, 13, 4, C.brass);
        c.row(2, 4, 13, L(C.brass));
        c.row(4, 4, 13, D(C.brass));
      } else {
        c.rect(15, b - 1, 16, b, C.brass); // the lid, on the floor
        c.rect(4, 4, 13, 4, NI);
      }
      const pts = u ? [8, 20, 11, 23] : [7, 11, 10, 14, 8, 18, 12, 20, 6, 22, 11, 10, 9, 23, 12, 16];
      dots(c, C.glow, pts);
      return () => {
        if (!u) return;
        dots(c, C.glow, [8, 1, 5, -2, 11, -3, 9, -6, 3, -5, 14, -1, 13, -8, 6, -9, 1, 2, 16, 4]);
        dots(c, C.white, [9, -6, 5, -2]);
      };
    },
    s: 'same',
  });

  O('dream-envelope-giant', 'giant envelope sealed letter as big as a door leaning red wax seal dream', {
    w: 30, h: 24, uh: 30,
    f(c, u) {
      const b = 22,
        E = hex('#cfc6ac');
      c.rect(2, 4, 27, b, E);
      c.row(4, 2, 27, L(E));
      c.col(2, 4, b, L(E));
      c.line(2, b, 12, 13, D(E));
      c.line(27, b, 17, 13, D(E));
      if (!u) {
        c.line(2, 4, 14, 14, D(E));
        c.line(27, 4, 15, 14, D(E));
        c.oval(12, 12, 17, 17, C.blood);
        c.set(14, 14, C.red);
        dots(c, D(E), [21, 7, 22, 7, 23, 7, 21, 9, 22, 9]);
      } else {
        // opened: the flap up, a letter half out
        c.poly([[2, 4], [27, 4], [15, -5], [14, -5]], D(E));
        c.line(2, 4, 14, -5, E);
        c.rect(6, -2, 23, 6, C.white);
        for (let y = 0; y <= 5; y += 2) c.row(y, 8, 21 - (y % 4), hex('#8d8672'));
        c.row(7, 2, 27, D(E));
        c.rect(2, 7, 27, 8, E);
        dots(c, C.blood, [13, b + 1, 16, b + 1, 14, 9]);
      }
    },
    sw: 8, suh: 30,
    s(c, u) {
      const b = 22,
        E = hex('#cfc6ac');
      c.poly([[3, 4], [4, 4], [6, b], [3, b]], E); // it leans a little
      c.col(3, 4, b, L(E));
      if (!u) c.set(5, 14, C.blood);
      else {
        c.line(3, 4, 5, -5, D(E));
        c.rect(4, -2, 4, 5, C.white);
      }
    },
  });
};
