/* Dream world II, part 1: the large things that carry sleepers, and the things left standing in a field. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, night, wheel, flame, clock } = H;
  const { CLD, NI, SKY, MOON, MOONd, OUT, LILAC, ROSE, DBLUE, PORC, GRASS, GRASSd, SEA, SEAl } = P;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    WH = hex('#d9d5c8'), // swan white, sheets
    BEAK = hex('#c08a3a'),
    WARM = hex('#d9b45a'), // lamplight in a window
    QUILT = hex('#8a5a5e'),
    WHALE = hex('#4a5a70'),
    WHALEl = hex('#8f9ba6'),
    ENG = hex('#33443e'),
    VAN = hex('#2f3a5c');
  const glow = (c, x, y) => dots(c, MOON, [x - 2, y, x + 2, y, x, y - 2, x, y + 2]);

  /* ---------- large ---------- */
  O('dream-swan-boat', 'large swan boat white pleasure boat pedal boat lake lantern dream', {
    w: 48, h: 32, base: 'side',
    f(c, u) {
      const b = 30;
      // lantern on its pole at the stern
      c.col(41, 5, 14, WD);
      c.rect(39, 2, 43, 6, C.iron);
      c.rect(40, 3, 42, 5, u ? C.flameLight : OUT);
      if (u) c.set(41, 4, C.white);
      // the hull: body, tail up
      c.poly([[9, 17], [40, 15], [45, 9], [46, 10], [44, 19], [40, 25], [34, 28], [14, 28], [9, 24]], WH);
      c.row(28, 14, 34, D(WH));
      c.line(10, 25, 14, 27, D(WH));
      // the bench inside
      c.rect(22, 12, 31, 15, W);
      c.row(12, 22, 31, WL);
      c.col(26, 13, 15, WD);
      // the wing along the side
      c.poly([[16, 17], [38, 13], [41, 15], [36, 22], [18, 23]], WH);
      c.line(16, 17, 38, 13, L(WH));
      for (let i = 0; i < 4; i++) c.line(20 + i * 5, 22, 25 + i * 5, 15, D(WH));
      c.line(18, 23, 36, 22, D(WH));
      dots(c, D(WH), [43, 12, 44, 14, 42, 16]);
      // neck and head
      c.rect(9, 12, 11, 18, WH);
      c.rect(8, 6, 10, 12, WH);
      c.col(8, 6, 12, L(WH));
      c.col(11, 13, 18, D(WH));
      if (!u) {
        c.rect(5, 3, 10, 6, WH);
        c.rect(2, 5, 4, 6, BEAK);
        c.set(5, 4, NI);
        c.set(7, 4, NI);
        c.set(4, 5, NI);
      } else {
        // it looks back at whoever sits down
        c.rect(8, 3, 13, 6, WH);
        c.rect(14, 5, 16, 6, BEAK);
        c.set(13, 4, NI);
        c.set(11, 4, NI);
        c.set(14, 5, NI);
      }
      water(c, 1, b - 2, 46, b, SEA, 2);
      return () => {
        if (!u) return;
        glow(c, 41, 4);
        dots(c, SEAl, [3, b - 3, 5, b - 3, 44, b - 3]);
      };
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = 30;
      c.col(20, 5, 14, WD);
      c.rect(18, 2, 22, 6, C.iron);
      c.rect(19, 3, 21, 5, u ? C.flameLight : OUT);
      // wings to both sides
      c.poly([[2, 12], [6, 11], [8, 24], [4, 24]], WH);
      c.poly([[25, 12], [21, 11], [19, 24], [23, 24]], WH);
      c.col(2, 13, 20, L(WH));
      dots(c, D(WH), [4, 15, 5, 18, 5, 21, 23, 15, 22, 18, 22, 21]);
      // the breast
      c.oval(5, 14, 22, 29, WH);
      c.row(28, 9, 18, D(WH));
      dots(c, D(WH), [9, 22, 13, 24, 17, 22, 11, 26, 15, 26]);
      // neck and head, straight on
      c.rect(12, 7, 15, 17, WH);
      c.col(12, 7, 17, L(WH));
      c.col(15, 8, 17, D(WH));
      c.rect(11, 3, 16, 7, WH);
      if (!u) {
        c.set(11, 5, NI);
        c.set(16, 5, NI);
        c.rect(13, 6, 14, 8, BEAK);
        c.row(6, 12, 15, NI);
        c.rect(13, 6, 14, 6, BEAK);
      } else dots(c, D(WH), [13, 4, 14, 5, 12, 6]); // the back of its head
      water(c, 1, b - 2, 26, b, SEA, 3);
      return () => u && glow(c, 20, 4);
    },
  });

  O('dream-flying-bed-wings', 'large flying bed with feather wings iron bedstead quilt over clouds dream', {
    w: 48, h: 32, base: 'side',
    f(c, u) {
      const b = 30;
      cloud(c, 2, 25, 20, b, CLD, 2);
      cloud(c, 24, 26, 45, b, CLD, 7);
      // bedstead
      c.rect(7, 8, 8, 25, C.iron);
      c.col(7, 8, 25, L(C.iron));
      c.set(7, 7, C.brass);
      c.rect(41, 13, 42, 25, C.iron);
      c.set(41, 12, C.brass);
      c.row(21, 9, 40, C.iron);
      c.rect(9, 17, 40, 20, WH);
      c.row(20, 9, 40, D(WH));
      c.rect(10, 15, 16, 16, WH);
      c.row(16, 10, 16, D(WH));
      if (!u) {
        c.rect(18, 16, 40, 20, QUILT);
        c.row(16, 18, 40, L(QUILT));
        for (let x = 22; x <= 38; x += 5) c.col(x, 17, 20, D(QUILT));
        c.rect(17, 16, 18, 17, WH);
        c.rect(34, 21, 40, 22, D(QUILT));
      } else {
        c.rect(31, 13, 40, 20, QUILT); // thrown back in a heap
        c.row(13, 32, 38, L(QUILT));
        c.line(31, 14, 34, 19, D(QUILT));
        c.rect(33, 21, 40, 23, D(QUILT));
        dots(c, D(WH), [12, 15, 13, 15, 20, 18, 24, 18]);
      }
      // the near wing
      const wy = u ? 7 : 0;
      if (!u) {
        c.poly([[18, 15], [14, 4], [18, 2], [30, 6], [34, 12], [28, 15]], WH);
        c.line(14, 4, 18, 2, L(WH));
        for (let i = 0; i < 4; i++) c.line(17 + i * 4, 4 + i, 20 + i * 3, 14, D(WH));
      } else {
        c.poly([[16, 15], [30, 15], [36, 22], [30, 28], [20, 27], [14, 22]], WH); // beating down
        c.line(16, 15, 30, 15, L(WH));
        for (let i = 0; i < 4; i++) c.line(18 + i * 4, 16, 19 + i * 4, 26, D(WH));
      }
      return () => u && (star(c, 4, 22, MOON, true), star(c, 44, 6, MOON), star(c, 38, 3, C.white), dots(c, CLD, [1, 23, 46, 24]));
    },
    sw: 30, sh: 32,
    s(c, u) {
      const b = 30;
      cloud(c, 3, 25, 26, b, CLD, 4);
      // wings to both sides
      if (!u) {
        c.poly([[7, 14], [1, 5], [4, 4], [8, 9]], WH);
        c.poly([[22, 14], [28, 5], [25, 4], [21, 9]], WH);
        dots(c, D(WH), [4, 8, 6, 11, 25, 8, 23, 11]);
      } else {
        c.poly([[7, 14], [1, 17], [2, 25], [6, 22], [8, 17]], WH);
        c.poly([[22, 14], [28, 17], [27, 25], [23, 22], [21, 17]], WH);
        dots(c, D(WH), [3, 19, 5, 21, 26, 19, 24, 21]);
      }
      // headboard behind, footboard in front
      c.col(7, 6, 25, C.iron);
      c.col(22, 6, 25, C.iron);
      c.row(7, 7, 22, C.iron);
      c.row(11, 7, 22, D(C.iron));
      for (let x = 10; x <= 19; x += 3) c.col(x, 8, 15, D(C.iron));
      c.set(7, 5, C.brass);
      c.set(22, 5, C.brass);
      c.rect(8, 13, 21, 22, WH);
      c.rect(10, 13, 19, 15, WH);
      c.row(16, 10, 19, D(WH));
      if (!u) {
        c.rect(8, 17, 21, 22, QUILT);
        c.row(17, 8, 21, L(QUILT));
        c.col(12, 18, 22, D(QUILT));
        c.col(17, 18, 22, D(QUILT));
      } else {
        c.poly([[21, 16], [21, 22], [10, 22]], QUILT);
        c.line(20, 16, 10, 22, D(QUILT));
        dots(c, D(WH), [10, 18, 12, 19, 14, 18]);
      }
      c.row(22, 7, 22, C.iron);
      c.rect(8, 23, 21, 24, u ? D(WH) : D(QUILT));
      c.row(25, 7, 22, C.iron);
      return () => u && (star(c, 2, 2, MOON, true), star(c, 27, 28, C.white));
    },
  });

  O('dream-sky-locomotive', 'large steam locomotive small engine on a track of cloud train sky dream', {
    w: 48, h: 32, base: 'side',
    f(c, u) {
      const b = 30;
      cloud(c, 1, 25, 46, b, CLD, 5);
      c.row(26, 2, 45, C.iron); // the rail
      // boiler
      c.rect(8, 12, 30, 21, ENG);
      c.row(12, 8, 30, L(ENG));
      c.row(21, 8, 30, D(ENG));
      c.col(14, 12, 21, C.brass);
      c.col(22, 12, 21, C.brass);
      c.rect(6, 13, 7, 20, D(ENG));
      c.rect(4, 15, 5, 17, u ? C.flameLight : C.brass); // the lamp
      // funnel and dome
      c.rect(10, 5, 13, 11, D(ENG));
      c.rect(9, 4, 14, 5, C.iron);
      c.oval(17, 9, 21, 12, C.brass);
      // cab
      c.rect(31, 6, 41, 21, ENG);
      c.col(31, 6, 21, L(ENG));
      c.rect(30, 4, 43, 5, D(ENG));
      c.rect(33, 8, 38, 13, u ? WARM : NI);
      c.frame(33, 8, 38, 13, D(ENG));
      c.rect(42, 14, 44, 21, D(ENG)); // coal box
      dots(c, NI, [42, 13, 43, 12, 44, 13]);
      // frame, wheels, rod
      c.rect(5, 22, 44, 23, C.ironDark);
      c.poly([[2, 24], [6, 21], [6, 24]], C.rust);
      wheel(c, 12, 23, 2, C.iron, C.steel);
      wheel(c, 22, 22, 3, C.iron, C.steel);
      wheel(c, 31, 22, 3, C.iron, C.steel);
      wheel(c, 40, 23, 2, C.iron, C.steel);
      c.row(22, 22, 31, C.steel);
      // its smoke is a small cloud
      if (!u) cloud(c, 8, 1, 15, 3, CLD, 3);
      else {
        cloud(c, 7, 1, 17, 3, CLD, 3);
        c.rect(36, 16, 39, 19, C.flame); // the firebox door open
        c.rect(37, 17, 38, 18, C.flameLight);
      }
      return () => {
        if (!u) return;
        dots(c, C.flameLight, [2, 16, 1, 15, 1, 17]);
        star(c, 21, 2, MOON, true);
        star(c, 27, 4, C.white);
        star(c, 33, 1, MOON);
        star(c, 40, 2, C.white);
      };
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = 30;
      cloud(c, 1, 25, 26, b, CLD, 6);
      // cab behind
      c.rect(4, 6, 23, 21, ENG);
      c.rect(3, 4, 24, 5, D(ENG));
      c.rect(5, 8, 7, 12, u ? WARM : NI);
      c.rect(20, 8, 22, 12, u ? WARM : NI);
      // boiler face
      c.oval(7, 9, 20, 22, D(ENG));
      c.oval(8, 10, 19, 21, ENG);
      ring(c, 10, 12, 17, 19, D(ENG));
      c.set(13, 15, C.brass);
      c.set(14, 16, C.brass);
      c.rect(12, 3, 15, 9, D(ENG));
      c.rect(11, 2, 16, 3, C.iron);
      c.rect(12, 19, 15, 21, u ? C.flameLight : C.brass); // lamp
      c.frame(12, 19, 15, 21, C.iron);
      // buffer beam and wheels
      c.rect(3, 22, 24, 24, C.rust);
      c.row(22, 3, 24, L(C.rust));
      c.rect(5, 22, 7, 24, C.steel);
      c.rect(20, 22, 22, 24, C.steel);
      c.rect(6, 25, 8, 27, C.iron);
      c.rect(19, 25, 21, 27, C.iron);
      c.row(26, 3, 24, C.iron);
      cloud(c, 9, 0, 18, 2, CLD, 3);
      return () => u && (dots(c, C.flameLight, [13, 23, 14, 24, 11, 20, 16, 20]), star(c, 3, 1, MOON, true), star(c, 24, 2, C.white));
    },
  });

  O('dream-paper-ship-mast', 'large paper ship folded newspaper boat with mast and paper sail shallow water dream', {
    w: 48, h: 34, base: 'side',
    f(c, u) {
      const b = 32,
        k = u ? 3 : 0, // it has sunk a little
        PAP = C.paper,
        INK = hex('#8d8672');
      // mast and sail
      c.col(23, 2 + k, 20 + k, W);
      c.poly([[25, 4 + k], [38, 17 + k], [25, 17 + k]], PAP);
      c.line(25, 4 + k, 38, 17 + k, D(PAP));
      for (let y = 8; y <= 15; y += 2) c.row(y + k, 26, 24 + (y - 4), INK);
      c.poly([[21, 6 + k], [12, 17 + k], [21, 17 + k]], L(PAP));
      for (let y = 10; y <= 15; y += 2) c.row(y + k, 23 - (y - 6), 20, INK);
      c.rect(24, 2 + k, 27, 3 + k, C.blood); // a small flag
      // hull: the folded boat
      c.poly([[2, 19 + k], [45, 19 + k], [38, 29 + k], [9, 29 + k]], PAP);
      c.poly([[17, 19 + k], [30, 19 + k], [23, 12 + k]], L(PAP)); // the middle peak
      c.line(23, 12 + k, 30, 19 + k, D(PAP));
      c.row(19 + k, 2, 45, L(PAP));
      c.line(2, 19 + k, 9, 29 + k, D(PAP));
      c.line(23, 20 + k, 23, 29 + k, D(PAP));
      for (let y = 22; y <= 27; y += 2) {
        c.row(y + k, 8 + (y - 20), 21, INK);
        c.row(y + k, 25, 40 - (y - 20), INK);
      }
      if (u) {
        // wet and dark from below, the ink running
        for (let y = 26; y <= b; y++) for (let x = 2; x <= 45; x++) if (c.get(x, y)) c.set(x, y, blend(PAP, SEA, 0.45));
        dots(c, INK, [12, 27, 12, 28, 19, 28, 30, 27, 30, 28, 35, 28]);
      }
      water(c, 1, b - 2, 46, b, SEA, 4);
      return () => u && dots(c, SEAl, [4, b - 3, 6, b - 4, 42, b - 3, 40, b - 4, 20, b - 3]);
    },
    sw: 22, sh: 34,
    s(c, u) {
      const b = 32,
        k = u ? 3 : 0,
        PAP = C.paper,
        INK = hex('#8d8672');
      c.col(10, 2 + k, 20 + k, W);
      c.rect(11, 2 + k, 13, 3 + k, C.blood);
      c.poly([[8, 5 + k], [13, 5 + k], [15, 17 + k], [6, 17 + k]], PAP); // the sail edge on
      c.col(8, 6 + k, 17 + k, L(PAP));
      dots(c, INK, [10, 9 + k, 11, 9 + k, 10, 12 + k, 12, 12 + k, 9, 15 + k, 11, 15 + k]);
      // the bow, pointing at you
      c.poly([[4, 19 + k], [17, 19 + k], [13, 29 + k], [8, 29 + k]], PAP);
      c.poly([[4, 19 + k], [10, 19 + k], [10, 29 + k], [8, 29 + k]], L(PAP));
      c.col(10, 19 + k, 29 + k, D(PAP));
      dots(c, INK, [6, 22 + k, 7, 22 + k, 8, 24 + k, 12, 22 + k, 14, 22 + k, 12, 25 + k]);
      if (u) for (let y = 26; y <= b; y++) for (let x = 2; x <= 19; x++) if (c.get(x, y)) c.set(x, y, blend(PAP, SEA, 0.45));
      water(c, 1, b - 2, 20, b, SEA, 5);
      return () => u && dots(c, SEAl, [3, b - 3, 18, b - 3, 10, b - 3]);
    },
  });

  O('dream-whale-airship', 'large whale airship sleeping whale floating in the air with a basket gondola on ropes dream', {
    w: 48, h: 34, base: 'side',
    f(c, u) {
      const b = 32;
      // the whale
      c.oval(2, 2, 40, 18, WHALE);
      c.poly([[36, 8], [44, 4], [46, 1], [46, 7], [44, 9], [46, 13], [40, 13]], WHALE); // tail
      c.oval(4, 10, 34, 18, WHALEl); // the pale belly
      c.rect(2, 9, 30, 10, WHALE);
      for (let x = 6; x <= 26; x += 3) c.col(x, 13, 17, D(WHALEl));
      c.row(11, 3, 12, D(WHALE)); // the mouth
      c.poly([[18, 12], [24, 12], [26, 16], [21, 15]], D(WHALE)); // fin
      c.row(3, 10, 28, L(WHALE));
      if (!u) {
        c.row(8, 10, 12, NI); // asleep
        c.set(9, 7, NI);
      } else {
        c.rect(10, 6, 12, 8, C.white);
        c.rect(11, 7, 12, 8, NI);
      }
      // ropes and the basket
      c.line(14, 18, 18, 24, WP);
      c.line(30, 18, 27, 24, WP);
      c.rect(17, 24, 28, b, hex('#8a6a40'));
      c.row(24, 16, 29, WL);
      for (let y = 26; y <= b; y += 2) c.row(y, 17, 28, hex('#6f5332'));
      for (let x = 19; x <= 27; x += 3) c.col(x, 25, b, hex('#6f5332'));
      c.rect(21, 21, 23, 23, C.iron); // a lamp over the basket
      c.set(22, 22, u ? C.flameLight : OUT);
      c.col(30, 25, b, WP); // rope ladder end
      c.col(33, 25, b, WP);
      c.row(27, 30, 33, WP);
      c.row(30, 30, 33, WP);
      return () => {
        if (!u) return;
        // it breathes out stars
        star(c, 15, 0, MOON, true);
        dots(c, MOON, [13, 1, 17, 1, 12, 0, 19, 0]);
        glow(c, 22, 22);
      };
    },
    sw: 28, sh: 34,
    s(c, u) {
      const b = 32;
      c.poly([[2, 1], [7, 4], [8, 8], [4, 6]], WHALE); // tail flukes behind
      c.poly([[25, 1], [20, 4], [19, 8], [23, 6]], WHALE);
      c.oval(4, 2, 23, 19, WHALE);
      c.oval(6, 11, 21, 19, WHALEl);
      c.rect(5, 10, 22, 11, WHALE);
      for (let x = 8; x <= 20; x += 3) c.col(x, 13, 18, D(WHALEl));
      c.row(12, 7, 20, D(WHALE));
      c.row(4, 9, 16, L(WHALE));
      c.rect(1, 12, 3, 13, D(WHALE)); // fins
      c.rect(24, 12, 26, 13, D(WHALE));
      if (!u) {
        c.row(9, 5, 7, NI);
        c.row(9, 20, 22, NI);
      } else {
        c.rect(5, 8, 7, 9, C.white);
        c.set(7, 9, NI);
        c.rect(20, 8, 22, 9, C.white);
        c.set(20, 9, NI);
      }
      c.line(9, 19, 10, 24, WP);
      c.line(18, 19, 17, 24, WP);
      c.rect(9, 24, 18, b, hex('#8a6a40'));
      c.row(24, 8, 19, WL);
      for (let y = 26; y <= b; y += 2) c.row(y, 9, 18, hex('#6f5332'));
      for (let x = 11; x <= 17; x += 3) c.col(x, 25, b, hex('#6f5332'));
      c.rect(12, 21, 14, 23, C.iron);
      c.set(13, 22, u ? C.flameLight : OUT);
      return () => u && (star(c, 13, 0, MOON, true), dots(c, MOON, [11, 1, 16, 0]), glow(c, 13, 22));
    },
  });

  O('dream-moon-caravan', 'large caravan wagon night blue painted with moons and stars travelling show dream', {
    w: 48, h: 32, base: 'side',
    f(c, u) {
      const b = 30;
      // body with a barrel roof
      c.rect(6, 7, 39, 22, VAN);
      c.oval(5, 2, 40, 12, hex('#59493c'));
      c.rect(6, 8, 39, 22, VAN);
      c.row(8, 6, 39, L(VAN));
      c.row(7, 5, 40, C.brass);
      c.col(6, 8, 22, L(VAN));
      c.rect(6, 21, 39, 22, D(VAN));
      // painted moons and stars
      c.oval(10, 11, 15, 16, MOON);
      c.oval(12, 10, 16, 15, VAN);
      dots(c, MOON, [19, 11, 21, 17, 9, 19, 33, 18, 36, 11]);
      star(c, 31, 12, MOON, true);
      // window
      c.rect(23, 11, 29, 17, u ? WARM : NI);
      c.frame(23, 11, 29, 17, C.brass);
      c.col(26, 12, 16, C.brass);
      if (u) dots(c, C.flameLight, [24, 12, 25, 13]);
      // chimney
      c.rect(33, 0, 34, 3, C.iron);
      // undercarriage, wheels, steps, shaft
      c.rect(8, 23, 37, 24, WD);
      wheel(c, 13, 25, 5, WD, C.iron, WL);
      wheel(c, 33, 25, 5, WD, C.iron, WL);
      c.line(40, 23, 46, 26, W); // the shaft, resting
      c.line(40, 24, 46, 27, WD);
      c.rect(1, 23, 5, 24, W); // steps at the back
      c.rect(0, 26, 4, 27, W);
      c.col(2, 25, b, WD);
      return () => {
        if (!u) return;
        dots(c, CLD, [34, -1, 35, 0]);
        dots(c, WARM, [22, 19, 30, 19, 26, 19]);
      };
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = 30;
      c.oval(3, 2, 24, 13, hex('#59493c'));
      c.rect(4, 8, 23, 22, VAN);
      c.row(7, 3, 24, C.brass);
      c.col(4, 8, 22, L(VAN));
      // the door at the back
      if (!u) {
        c.rect(9, 10, 18, 22, DBLUE);
        c.col(9, 10, 22, L(DBLUE));
        c.col(18, 10, 22, D(DBLUE));
        c.oval(11, 12, 16, 16, MOON); // a moon window
        c.oval(13, 11, 17, 15, DBLUE);
        c.set(16, 18, C.brass);
      } else {
        c.rect(9, 10, 18, 22, WARM); // open: lamplight and the end of a bed
        c.rect(9, 10, 18, 12, hex('#8a6a3a'));
        c.rect(10, 17, 17, 22, QUILT);
        c.row(17, 10, 17, WH);
        c.rect(12, 13, 13, 15, C.flameLight);
        c.rect(19, 10, 21, 22, DBLUE); // the door, swung out
        c.col(21, 10, 22, D(DBLUE));
      }
      dots(c, MOON, [6, 11, 21, 19, 6, 17]);
      c.rect(5, 23, 22, 24, WD);
      c.rect(2, 20, 4, b, WD); // wheels, edge on
      c.rect(23, 20, 25, b, WD);
      c.col(2, 20, b, W);
      c.col(23, 20, b, W);
      c.rect(8, 25, 19, 26, W); // steps
      c.rect(7, 28, 20, 29, W);
      c.col(8, 27, b, WD);
      c.col(19, 27, b, WD);
      c.rect(19, 0, 20, 3, C.iron);
      return () => u && dots(c, WARM, [10, 24, 13, 24, 16, 24, 11, 27, 15, 27]);
    },
  });

  /* ---------- left standing in a field ---------- */
  function bedField(c, u, front) {
    const SH = WH,
      BL = hex('#6f7f8f');
    if (!front) {
      const b = 22;
      c.rect(3, 4, 4, b, W); // headboard post
      c.rect(35, 9, 36, b, W);
      c.rect(3, 4, 6, 6, WL);
      c.rect(5, 15, 34, 17, WD);
      c.rect(5, 11, 34, 14, SH);
      c.row(14, 5, 34, D(SH));
      c.rect(6, 9, 12, 10, SH);
      c.row(10, 6, 12, D(SH));
      if (!u) {
        c.rect(14, 10, 34, 14, BL);
        c.row(10, 14, 34, L(BL));
        c.rect(13, 10, 14, 11, SH);
        c.rect(30, 15, 34, 16, D(BL));
      } else {
        c.rect(27, 8, 34, 14, BL);
        c.row(8, 28, 33, L(BL));
        c.rect(29, 15, 34, 18, D(BL));
        dots(c, D(SH), [8, 9, 9, 9, 16, 12, 20, 12]);
      }
      grass(c, 1, 38, b, 3);
      // poppies in the grass; after a night, they have grown up through the sheets
      const pop = (x, y) => (c.set(x, y, C.red), c.set(x, y + 1, GRASS));
      pop(9, b - 3);
      pop(24, b - 3);
      pop(31, b - 2);
      if (u) {
        pop(18, 8);
        c.col(18, 10, 12, GRASS);
        pop(22, 9);
        c.col(22, 11, 12, GRASS);
        pop(13, 7);
        c.col(13, 9, 10, GRASS);
        dots(c, GRASS, [6, 14, 6, 15, 26, 13, 26, 12]);
      }
    } else {
      const b = 34;
      c.rect(3, 3, 16, 14, W); // headboard
      c.row(3, 3, 16, WL);
      c.col(3, 3, 14, WL);
      c.rect(5, 5, 14, 9, WD);
      c.rect(3, 12, 16, 30, SH);
      c.rect(5, 12, 14, 15, SH);
      c.row(16, 5, 14, D(SH));
      if (!u) {
        c.rect(3, 18, 16, 30, BL);
        c.row(18, 3, 16, L(BL));
        c.row(17, 3, 16, SH);
      } else {
        c.poly([[16, 17], [16, 30], [5, 30]], BL);
        c.line(15, 17, 5, 30, D(BL));
        dots(c, D(SH), [6, 20, 8, 22, 5, 25]);
      }
      c.rect(2, 28, 17, 31, W); // footboard
      c.row(28, 2, 17, WL);
      c.col(2, 28, b, W);
      c.col(17, 28, b, WD);
      grass(c, 1, 18, b, 5);
      const pop = (x, y) => (c.set(x, y, C.red), c.set(x, y + 1, GRASS));
      pop(6, b - 3);
      pop(14, b - 3);
      if (u) {
        pop(7, 17);
        c.col(7, 19, 20, GRASS);
        pop(11, 20);
        c.col(11, 22, 23, GRASS);
        pop(9, 13);
      }
    }
  }
  O('dream-bed-in-field', 'bed standing in a field wooden bed blue blanket long grass poppies dream', {
    w: 40, h: 24, base: 'side',
    f: (c, u) => bedField(c, u, false),
    sw: 20, sh: 36,
    s: (c, u) => bedField(c, u, true),
  });

  O('dream-door-in-meadow', 'door standing alone in a meadow green door in its frame grass opens onto the sea dream', {
    w: 24, h: 42, uw: 30,
    f(c, u) {
      const b = 40,
        DG = hex('#4f6658');
      c.rect(3, 2, 20, b, WP);
      c.col(3, 2, b, L(WP));
      c.row(2, 3, 20, L(WP));
      c.col(20, 3, b, D(WP));
      if (!u) {
        c.rect(5, 4, 18, b, DG);
        c.col(5, 4, b, L(DG));
        for (const [y0, y1] of [[6, 18], [22, 36]]) {
          c.frame(7, y0, 16, y1, D(DG));
          c.row(y1, 7, 16, L(DG));
        }
        c.rect(16, 20, 17, 21, C.brass);
        c.set(17, 23, NI);
      } else {
        // open: a pale sky and the sea, level with the latch
        c.rect(5, 4, 18, 21, hex('#a9b6b4'));
        c.rect(5, 22, 18, b, SEA);
        c.row(22, 5, 18, SEAl);
        dots(c, SEAl, [7, 26, 8, 26, 13, 29, 14, 29, 9, 33, 10, 33, 15, 36]);
        c.rect(8, 8, 12, 9, C.white);
        c.row(7, 9, 11, C.white);
        c.poly([[21, 3], [27, 1], [27, b], [21, b]], DG); // the door, swung out
        c.col(21, 3, b, L(DG));
        c.col(27, 1, b, D(DG));
        c.col(24, 6, 36, D(DG));
        c.set(25, 21, C.brass);
      }
      grass(c, 1, 22, b, 2);
      return () => u && dots(c, SEAl, [8, b + 1, 12, b + 1, 16, b + 1]);
    },
    sw: 12, suw: 26,
    s(c, u) {
      const b = 40,
        DG = hex('#4f6658');
      c.rect(4, 2, 7, b, WP);
      c.col(4, 2, b, L(WP));
      c.col(7, 3, b, D(WP));
      if (!u) {
        c.col(8, 4, b, DG);
        c.set(9, 20, C.brass);
      } else {
        c.rect(8, 4, 21, b, DG);
        c.col(21, 4, b, D(DG));
        for (const [y0, y1] of [[6, 18], [22, 36]]) c.frame(10, y0, 19, y1, D(DG));
        c.rect(19, 20, 20, 21, C.brass);
        grass(c, 8, 24, b, 7);
      }
      grass(c, 1, 10, b, 4);
    },
  });

  O('dream-cloud-staircase', 'staircase of clouds steps made of cloud going up white soft stairs dream', {
    w: 38, h: 40,
    f(c, u) {
      const b = 38;
      for (let i = 0; i < 5; i++) {
        const x = 1 + i * 6,
          y = b - 6 - i * 7;
        cloud(c, x, y, x + 11, y + 6, u && i === 2 ? blend(CLD, DBLUE, 0.35) : CLD, 3 + i);
        if (u && i === 2) dots(c, DBLUE, [x + 3, y + 3, x + 4, y + 3, x + 7, y + 4, x + 8, y + 4]); // a footprint pressed in
      }
      return () => {
        if (!u) return;
        dots(c, SEAl, [15, 28, 17, 30, 15, 32, 19, 27, 19, 33]); // and it rains a little under that step
        star(c, 33, 1, MOON, true);
      };
    },
    sw: 16,
    s(c, u) {
      const b = 38;
      for (let i = 0; i < 5; i++) {
        const y = b - 6 - i * 7,
          x = 1 + (i % 2);
        cloud(c, x, y, x + 12 - (i >> 1), y + 6, u && i === 2 ? blend(CLD, DBLUE, 0.35) : CLD, 5 + i);
        if (u && i === 2) dots(c, DBLUE, [x + 4, y + 3, x + 5, y + 3, x + 6, y + 4]);
      }
      return () => u && (dots(c, SEAl, [5, 28, 8, 30, 6, 32, 10, 28]), star(c, 8, 1, MOON, true));
    },
  });

  O('dream-floating-lantern', 'floating paper lantern sky lantern drifting on a thread tied to a stone dream', {
    w: 14, h: 36, solid: false,
    f(c, u) {
      const b = 34,
        PAPc = u ? hex('#d9a85a') : hex('#b8a88c');
      c.rect(3, 2, 10, 12, PAPc);
      c.rect(4, 1, 9, 1, PAPc);
      c.row(13, 4, 9, D(PAPc));
      c.col(3, 2, 12, L(PAPc));
      c.col(6, 2, 12, D(PAPc));
      c.col(9, 2, 12, D(PAPc));
      c.rect(5, 14, 8, 14, WD);
      if (u) {
        c.rect(6, 8, 7, 11, C.flameLight);
        c.set(6, 7, C.white);
      }
      c.rect(4, b - 2, 9, b, C.stone); // the stone it is tied to
      c.row(b - 2, 5, 8, C.stoneLight);
      return () => {
        thin(c, 6, 16, b - 4, CLD);
        if (u) dots(c, MOON, [1, 6, 12, 8, 1, 11, 12, 3]);
      };
    },
    s: 'same',
  });
};
