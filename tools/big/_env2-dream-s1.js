/* Surreal, part 1: the large impossible things, and the first of the painters' objects. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, dayAt, night, day, wheel, flame, clock, drawer, bowler, apple, eye, notes } = H;
  const { CLD, NI, SKY, DAY, DAYl, MOON, MOONd, OUT, PORC, SEA, SEAl, SAND, APPLE, FELT, PLASTER, LOBSTER, GIR, BRICK, PINK } = P;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    MARB = hex('#a9a69e'),
    WALLP = hex('#9a8f7a'),
    ENG = hex('#2f3038'),
    ELE = hex('#7c7772'),
    FISH = hex('#8a9a9c'),
    CAR = hex('#4f5a62'),
    WARM = hex('#d9b45a');
  /** Fill everything of one marker colour on the canvas with a pattern. */
  const MARK = hex('#ff00ff');
  const fill = (c, at) => repaint(c, 0, 0, c.w - 1, c.h - 1, MARK, at);
  const seaAt = (seed = 1) => (x, y) => {
    const v = (x + y * 5 + seed) % 9,
      k = (y + seed) % 4;
    if (k === 0 && v < 3) return SEAl;
    if (k === 2 && v === 6) return C.white;
    return SEA;
  };

  /* ---------- large ---------- */
  O('surreal-locomotive-from-fireplace', 'large locomotive coming out of a fireplace steam engine in mid air marble mantel clock time transfixed surreal', {
    w: 48, h: 36, base: 'side',
    f(c, u) {
      const b = 34,
        k = u ? -8 : 0; // it has come further out
      // the chimney breast in profile, mantel, surround
      c.rect(38, 1, 46, b, WALLP);
      c.col(38, 1, b, L(WALLP));
      c.rect(38, b - 4, 46, b, D(WALLP));
      c.rect(34, 15, 40, b, MARB);
      c.col(34, 15, b, L(MARB));
      c.rect(32, 13, 41, 14, L(MARB));
      c.row(15, 33, 40, D(MARB));
      dots(c, D(MARB), [36, 20, 37, 24, 35, 29]);
      c.rect(35, 8, 38, 12, P.FELT); // the clock on it
      c.rect(36, 9, 37, 10, PORC);
      c.rect(33, 9, 33, 12, C.brass); // a candlestick
      c.set(33, 8, PORC);
      // the engine, hanging in the air
      c.rect(14 + k, 19, 33, 25, ENG);
      c.row(19, 14 + k, 33, L(L(ENG)));
      c.row(25, 14 + k, 33, D(ENG));
      c.col(20 + k, 19, 25, C.brass);
      c.col(27 + k, 19, 25, C.brass);
      c.rect(12 + k, 20, 13 + k, 24, D(ENG));
      c.rect(10 + k, 21, 11 + k, 23, u ? C.flameLight : C.brass);
      c.rect(16 + k, 13, 18 + k, 18, ENG); // funnel
      c.rect(15 + k, 12, 19 + k, 13, C.iron);
      c.oval(23 + k, 16, 26 + k, 19, C.brass);
      c.rect(11 + k, 26, 33, 27, C.blood);
      c.poly([[9 + k, 29], [12 + k, 26], [12 + k, 29]], C.blood);
      wheel(c, 16 + k, 28, 2, C.iron, C.steel);
      wheel(c, 23 + k, 28, 2, C.iron, C.steel);
      wheel(c, 30 + k, 28, 2, C.iron, C.steel);
      if (u) c.row(28, 16 + k, 30 + k, C.steel);
      c.row(b, 12 + k, 32, NI); // its shadow on the floor
      // smoke, drawn back towards the hearth
      cloud(c, 17 + k, 6, 26 + k, 11, CLD, 3);
      if (u) cloud(c, 22, 2, 31, 7, CLD, 6);
      return () => u && dots(c, C.flameLight, [8 + k, 22, 7 + k, 21, 7 + k, 23]);
    },
    sw: 30, sh: 36,
    s(c, u) {
      const b = 34;
      // mirror over the mantel
      c.rect(6, 1, 23, 9, C.gold);
      c.rect(7, 2, 22, 8, hex('#7a8a8c'));
      c.line(9, 7, 13, 3, hex('#95a4a4'));
      c.rect(13, 5, 16, 8, P.FELT); // only the clock's back is in it
      // mantel and surround
      c.rect(1, 10, 28, 11, L(MARB));
      c.rect(2, 12, 27, b, MARB);
      c.col(2, 12, b, L(MARB));
      c.row(12, 2, 27, D(MARB));
      dots(c, D(MARB), [5, 16, 6, 22, 4, 28, 24, 18, 25, 26, 14, 14]);
      c.rect(13, 5, 16, 9, P.FELT);
      c.rect(14, 6, 15, 7, PORC);
      c.rect(8, 6, 8, 9, C.brass);
      c.rect(21, 6, 21, 9, C.brass);
      c.set(8, 5, PORC);
      c.set(21, 5, PORC);
      // the opening
      c.rect(7, 16, 22, b, NI);
      c.rect(6, b - 1, 23, b, D(MARB));
      // the engine, nose on
      const g = u ? 2 : 0;
      c.oval(10 - g, 19 - g, 19 + g, 28 + g, D(ENG));
      c.oval(11 - g, 20 - g, 18 + g, 27 + g, ENG);
      ring(c, 12 - g, 21 - g, 17 + g, 26 + g, hex('#4a4c58'));
      c.set(14, 23, C.brass);
      c.set(15, 24, C.brass);
      c.rect(13, 17 - g * 2, 16, 19 - g, ENG);
      c.rect(12, 16 - g * 2, 17, 16 - g * 2, C.iron);
      c.rect(8 - g, 29 + g, 21 + g, 30 + g, C.blood);
      c.rect(13, 27 + g, 16, 28 + g, u ? C.flameLight : C.brass);
      if (!u) {
        c.rect(10, 31, 11, 32, C.iron);
        c.rect(18, 31, 19, 32, C.iron);
      }
      return () => {
        if (u) dots(c, C.flameLight, [12, 31, 17, 31, 14, 32]);
        dots(c, CLD, u ? [13, 9, 15, 7, 17, 10, 12, 12, 16, 12, 14, 13] : [14, 14, 15, 13]);
      };
    },
  });

  O('surreal-elephant-on-stilts', 'large elephant on stilt legs long thin many jointed legs carrying an obelisk space elephant surreal', {
    w: 44, h: 64, base: 'side',
    f(c, u) {
      const b = 62;
      const leg = (x, bend) => {
        if (!bend) {
          c.col(x, 26, b, ELE);
          for (const y of [36, 48]) c.rect(x - 1, y, x, y + 1, D(ELE));
          c.rect(x - 1, b, x + 1, b, D(ELE));
        } else {
          c.col(x, 26, 36, ELE); // lifted for a step
          c.line(x, 36, x - 6, 44, ELE);
          c.line(x - 6, 44, x - 4, 54, ELE);
          c.rect(x - 1, 36, x, 37, D(ELE));
          c.rect(x - 7, 44, x - 6, 45, D(ELE));
          c.rect(x - 5, 54, x - 3, 54, D(ELE));
        }
      };
      leg(31, false);
      leg(19, false);
      // the obelisk on its back
      c.poly([[23, 1], [24, 1], [27, 12], [20, 12]], hex('#a89a90'));
      c.col(22, 3, 12, L(hex('#a89a90')));
      dots(c, hex('#857a72'), [24, 5, 23, 8, 25, 10]);
      c.rect(17, 12, 30, 13, C.blood); // saddle cloth
      for (let x = 17; x <= 30; x += 2) c.set(x, 14, C.gold);
      // body and head
      c.oval(10, 12, 37, 27, ELE);
      c.oval(3, 13, 14, 24, ELE);
      c.poly([[10, 13], [15, 13], [16, 22], [12, 23]], D(ELE)); // ear
      c.set(6, 17, NI);
      c.rect(37, 17, 38, 22, D(ELE)); // tail
      dots(c, D(ELE), [20, 20, 26, 23, 32, 18, 16, 25]);
      c.row(13, 14, 34, L(ELE));
      if (!u) {
        c.poly([[3, 20], [6, 21], [5, 34], [3, 34]], ELE); // trunk hanging
        c.rect(4, 35, 5, 37, ELE);
        c.set(6, 38, ELE);
      } else {
        c.poly([[3, 20], [6, 19], [3, 10], [1, 11]], ELE); // trunk thrown up
        c.rect(1, 7, 2, 10, ELE);
        c.set(3, 6, ELE);
      }
      c.rect(6, 23, 8, 23, C.white); // tusk
      c.set(5, 24, C.white);
      leg(14, u);
      leg(26, false);
      return () => u && dots(c, hex('#a89a90'), [9, b, 12, b - 1, 7, b - 1, 5, 4, 0, 5]);
    },
    sw: 24, sh: 64,
    s(c, u) {
      const b = 62;
      const leg = (x, lift) => {
        c.col(x, 26, lift ? 50 : b, ELE);
        for (const y of [36, 48]) c.rect(x, y, x + 1, y + 1, D(ELE));
        c.rect(x - 1, lift ? 51 : b, x + 1, lift ? 51 : b, D(ELE));
      };
      leg(10, false);
      leg(13, false);
      c.poly([[11, 1], [12, 1], [15, 12], [8, 12]], hex('#a89a90'));
      c.col(10, 3, 12, L(hex('#a89a90')));
      c.rect(6, 12, 17, 13, C.blood);
      c.oval(4, 12, 19, 27, ELE);
      c.poly([[1, 13], [6, 12], [6, 23], [3, 24]], D(ELE)); // ears
      c.poly([[22, 13], [17, 12], [17, 23], [20, 24]], D(ELE));
      c.oval(7, 13, 16, 24, ELE);
      c.col(7, 16, 22, L(ELE));
      c.set(9, 17, NI);
      c.set(14, 17, NI);
      if (!u) {
        c.rect(11, 20, 12, 36, ELE);
        c.set(12, 37, ELE);
        dots(c, D(ELE), [11, 24, 12, 28, 11, 32]);
      } else {
        c.rect(11, 6, 12, 22, ELE); // trunk up, over its brow
        c.rect(10, 4, 13, 6, ELE);
        c.set(11, 5, NI);
        c.set(12, 5, NI);
      }
      c.col(9, 22, 25, C.white);
      c.col(14, 22, 25, C.white);
      leg(7, u);
      leg(16, false);
      return () => u && dots(c, hex('#a89a90'), [5, b, 3, b - 1, 9, b]);
    },
  });

  O('surreal-grand-piano-drawers', 'large grand piano with drawers in its side black piano lid up chest of drawers instrument surreal', {
    w: 48, h: 32, base: 'side',
    f(c, u) {
      const b = 30,
        PN = P.FELT;
      // lid, propped
      c.poly([[8, 12], [42, 3], [43, 5], [10, 13]], PN);
      c.line(8, 12, 42, 3, hex('#4a4650'));
      c.line(30, 12, 33, 6, WD);
      // the case
      c.rect(6, 13, 44, 20, PN);
      c.oval(40, 13, 46, 20, PN);
      c.row(13, 6, 44, hex('#4a4650'));
      c.row(20, 6, 44, NI);
      // keyboard end
      c.rect(2, 15, 6, 19, PN);
      c.row(16, 2, 6, PORC);
      c.row(17, 2, 5, NI);
      // legs and pedals
      for (const x of [5, 40]) {
        c.rect(x, 21, x + 1, b - 1, PN);
        c.set(x, b, C.brass);
        c.set(x + 1, b, C.brass);
      }
      c.rect(22, 21, 23, b - 1, PN);
      c.rect(22, b, 23, b, C.brass);
      c.col(9, 21, 26, WD);
      c.rect(8, 27, 11, 27, C.brass);
      // the drawers
      for (const x0 of [10, 20, 30]) {
        const out = u && x0 !== 20;
        if (!out) {
          c.frame(x0, 14, x0 + 8, 19, hex('#4a4650'));
          c.rect(x0 + 3, 16, x0 + 5, 16, C.brass);
        } else {
          c.rect(x0, 14, x0 + 8, 15, NI); // the dark it came out of
          c.rect(x0 - 1, 16, x0 + 9, 22, hex('#3a3742'));
          c.frame(x0 - 1, 16, x0 + 9, 22, hex('#55515c'));
          c.rect(x0 + 3, 19, x0 + 5, 19, C.brass);
          if (x0 === 10) {
            c.row(16, x0, x0 + 8, PORC); // full of loose keys
            dots(c, NI, [x0 + 1, 16, x0 + 4, 16, x0 + 7, 16]);
          } else {
            c.row(16, x0, x0 + 8, SEA); // and one of water
            dots(c, SEAl, [x0 + 2, 16, x0 + 6, 16]);
          }
        }
      }
      return () => u && dots(c, SEAl, [35, 24, 36, 27, 35, b]);
    },
    sw: 32, sh: 32,
    s(c, u) {
      const b = 30,
        PN = P.FELT;
      c.poly([[3, 12], [28, 12], [26, 2], [8, 4]], PN); // the lid, standing up behind
      c.line(8, 4, 26, 2, hex('#4a4650'));
      c.rect(2, 12, 29, 21, PN);
      c.row(12, 2, 29, hex('#4a4650'));
      c.rect(4, 14, 27, 16, PORC); // the keys
      for (let x = 5; x <= 26; x += 2) c.set(x, 14, NI);
      for (let x = 4; x <= 27; x += 3) c.set(x, 16, D(PORC));
      c.row(17, 3, 28, NI);
      for (const x of [3, 27]) {
        c.rect(x, 22, x + 1, b - 1, PN);
        c.rect(x, b, x + 1, b, C.brass);
      }
      c.col(14, 22, 26, WD);
      c.col(17, 22, 26, WD);
      c.rect(13, 27, 18, 27, C.brass);
      // drawers under the keyboard
      for (const x0 of [5, 18]) {
        const out = u && x0 === 5;
        if (!out) {
          c.frame(x0, 18, x0 + 8, 21, hex('#4a4650'));
          c.rect(x0 + 3, 19, x0 + 5, 19, C.brass);
        } else {
          c.rect(x0, 18, x0 + 8, 19, NI);
          c.rect(x0 - 1, 20, x0 + 9, 25, hex('#3a3742'));
          c.frame(x0 - 1, 20, x0 + 9, 25, hex('#55515c'));
          c.rect(x0 + 3, 23, x0 + 5, 23, C.brass);
          c.row(20, x0, x0 + 8, PORC);
          dots(c, NI, [x0 + 1, 20, x0 + 4, 20, x0 + 7, 20]);
        }
      }
    },
  });

  O('surreal-fish-headed-car', 'large car with the head of a fish old saloon car silver fish front tail fin wheels surreal', {
    w: 48, h: 28, base: 'side',
    f(c, u) {
      const b = 26;
      // tail fin at the back
      c.poly([[41, 12], [46, 4], [47, 5], [45, 12], [47, 19], [46, 20], [41, 15]], FISH);
      dots(c, D(FISH), [44, 8, 44, 16, 43, 12]);
      // the car body
      c.rect(13, 11, 42, 21, CAR);
      c.poly([[19, 11], [22, 4], [35, 4], [39, 11]], CAR);
      c.row(4, 22, 35, L(CAR));
      c.row(11, 13, 42, L(CAR));
      c.rect(13, 20, 42, 21, D(CAR));
      c.poly([[26, 4], [30, 1], [34, 4]], FISH); // a dorsal fin on the roof
      c.rect(23, 6, 28, 10, u ? WARM : hex('#7a8a8c'));
      c.rect(31, 6, 35, 10, u ? WARM : hex('#7a8a8c'));
      c.col(29, 5, 20, D(CAR));
      c.set(31, 14, C.steel);
      // the fish's head for a bonnet
      c.poly([[1, 15], [5, 10], [13, 8], [16, 11], [16, 21], [8, 21], [3, 19]], FISH);
      c.line(5, 10, 13, 8, L(FISH));
      c.col(15, 10, 20, D(FISH)); // gill
      c.col(13, 12, 19, D(FISH));
      for (let y = 12; y <= 19; y += 2) for (let x = 9; x <= 12; x += 2) c.set(x + (y % 4 ? 0 : 1), y, D(FISH));
      c.oval(6, 11, 10, 15, u ? C.flameLight : PORC);
      c.rect(8, 13, 9, 14, NI);
      if (!u) c.row(17, 2, 7, NI);
      else {
        c.poly([[1, 15], [8, 17], [3, 22]], hex('#6a3440')); // the mouth open
        dots(c, C.white, [3, 16, 5, 17, 3, 20]);
        // and a door standing open
        c.rect(21, 11, 28, 20, NI);
        c.rect(23, 13, 26, 20, hex('#6a3440'));
        c.poly([[17, 11], [20, 12], [20, 22], [17, 21]], D(CAR));
      }
      wheel(c, 14, 22, 4, P.FELT, C.steel);
      wheel(c, 36, 22, 4, P.FELT, C.steel);
      return () => u && dots(c, C.flameLight, [4, 10, 3, 12, 5, 8]);
    },
    sw: 28, sh: 28,
    s(c, u) {
      const b = 26;
      c.poly([[13, 1], [14, 1], [16, 5], [11, 5]], FISH);
      c.rect(6, 4, 21, 12, CAR); // cabin behind
      c.row(4, 6, 21, L(CAR));
      c.rect(8, 6, 19, 10, u ? WARM : hex('#7a8a8c'));
      c.col(13, 6, 10, D(CAR));
      c.rect(2, 19, 5, b, P.FELT); // wheels
      c.rect(22, 19, 25, b, P.FELT);
      // the face
      c.oval(3, 8, 24, 23, FISH);
      c.row(9, 9, 18, L(FISH));
      c.oval(4, 11, 8, 15, u ? C.flameLight : PORC);
      c.oval(19, 11, 23, 15, u ? C.flameLight : PORC);
      c.rect(6, 13, 7, 14, NI);
      c.rect(20, 13, 21, 14, NI);
      for (let x = 10; x <= 17; x += 2) c.set(x, 12 + (x % 4 ? 1 : 0), D(FISH));
      if (!u) {
        c.row(19, 8, 19, NI);
        c.set(7, 18, NI);
        c.set(20, 18, NI);
      } else {
        c.oval(8, 16, 19, 22, hex('#6a3440'));
        dots(c, C.white, [9, 17, 11, 16, 13, 16, 15, 16, 17, 17, 10, 21, 13, 22, 16, 21]);
      }
      c.rect(11, 24, 16, 25, PORC); // number plate
      dots(c, NI, [12, 24, 14, 25, 15, 24]);
      return () => u && dots(c, C.flameLight, [1, 10, 26, 10, 0, 13, 27, 13]);
    },
  });

  O('surreal-rainy-taxi', 'large taxi cab raining inside old black cab a dummy passenger in the wet snails ivy rainy taxi surreal', {
    w: 48, h: 30, base: 'side',
    f(c, u) {
      const b = 28,
        TX = P.FELT,
        RAIN = hex('#3a4a5c');
      c.rect(3, 13, 14, 21, TX); // bonnet
      c.row(13, 3, 14, hex('#4a4650'));
      c.rect(14, 4, 41, 21, TX); // cabin
      c.row(4, 14, 41, hex('#4a4650'));
      c.rect(41, 12, 44, 21, TX); // boot
      c.rect(2, 20, 45, 22, D(TX));
      c.rect(1, 15, 2, 17, u ? C.flameLight : C.steel); // lamp
      c.rect(24, 1, 31, 3, MOON); // the sign
      dots(c, NI, [25, 2, 27, 2, 29, 2]);
      // windows, rain behind the glass
      for (const [x0, x1] of [[16, 22], [25, 31], [34, 39]]) {
        c.rect(x0, 6, x1, 12, RAIN);
        for (let y = 6; y <= 12; y++) for (let x = x0; x <= x1; x++) if ((x * 3 + y * 2) % 7 === 0) c.set(x, y, SEAl);
      }
      // the passenger: a dummy with wet hair
      c.rect(27, 8, 29, 12, PLASTER);
      c.rect(26, 7, 30, 8, hex('#5a4638'));
      c.col(24, 5, 20, hex('#4a4650'));
      c.col(32, 5, 20, hex('#4a4650'));
      c.set(30, 15, C.steel);
      dots(c, P.GRASS, [5, 14, 6, 15, 8, 14, 15, 5, 16, 5, 42, 13, 40, 5, 4, 16]); // ivy on it
      dots(c, PORC, [10, 12, 36, 3]); // snails
      wheel(c, 10, 23, 4, NI, C.steel);
      wheel(c, 37, 23, 4, NI, C.steel);
      if (u) {
        // the back door opened: it all runs out
        c.rect(25, 5, 31, 20, NI);
        c.rect(27, 9, 29, 20, PLASTER);
        c.rect(26, 8, 30, 9, hex('#5a4638'));
        c.rect(27, 14, 29, 20, hex('#6a5a64'));
        c.poly([[21, 5], [24, 6], [24, 22], [21, 21]], hex('#4a4650'));
        c.rect(22, 8, 23, 12, RAIN);
        c.rect(25, 21, 31, 22, SEA);
        c.rect(22, b, 36, b, SEA);
        dots(c, SEAl, [26, 23, 28, 24, 30, 23, 27, 26, 29, 27]);
      }
      return () => u && dots(c, SEAl, [20, b, 38, b, 24, b + 1, 33, b + 1]);
    },
    sw: 28, sh: 30,
    s(c, u) {
      const b = 28,
        TX = P.FELT,
        RAIN = hex('#3a4a5c');
      c.rect(4, 4, 23, 22, TX);
      c.row(4, 4, 23, hex('#4a4650'));
      c.rect(10, 1, 17, 3, MOON);
      dots(c, NI, [11, 2, 13, 2, 15, 2]);
      c.rect(6, 6, 21, 12, RAIN); // windscreen
      for (let y = 6; y <= 12; y++) for (let x = 6; x <= 21; x++) if ((x * 3 + y * 2) % 7 === 0) c.set(x, y, SEAl);
      c.rect(15, 8, 18, 12, PLASTER);
      c.rect(14, 7, 19, 8, hex('#5a4638'));
      // radiator and lamps
      c.rect(10, 14, 17, 21, C.steel);
      for (let x = 11; x <= 16; x += 2) c.col(x, 15, 20, C.iron);
      c.oval(4, 14, 8, 18, u ? C.flameLight : PORC);
      c.oval(19, 14, 23, 18, u ? C.flameLight : PORC);
      c.rect(3, 21, 24, 22, C.steel); // bumper
      c.rect(3, 23, 6, b, NI);
      c.rect(21, 23, 24, b, NI);
      dots(c, P.GRASS, [5, 5, 6, 13, 22, 5, 23, 12, 9, 13]);
      if (u) {
        c.rect(8, b, 19, b, SEA);
        dots(c, SEAl, [10, 23, 13, 25, 17, 24, 12, 27]);
      }
      return () => u && dots(c, C.flameLight, [2, 14, 25, 14, 1, 17, 26, 17]);
    },
  });

  O('surreal-ship-made-of-sea', 'large sailing ship made of sea water three masts hull and sails cut out of waves on a beach surreal', {
    w: 46, h: 38, base: 'side',
    f(c, u) {
      const b = 36;
      // hull
      c.poly([[2, 23], [8, 26], [38, 26], [44, 21], [41, 31], [8, 31], [4, 28]], MARK);
      c.line(2, 23, 0, 21, MARK); // bowsprit
      // masts and sails
      for (const [x, top] of [[13, 6], [24, 2], [35, 5]]) {
        c.col(x, top, 26, MARK);
        c.poly([[x - 3, top + 3], [x + 3, top + 3], [x + 4, top + 8], [x - 4, top + 8]], MARK);
        c.poly([[x - 4, top + 11], [x + 4, top + 11], [x + 4, top + 18], [x - 4, top + 18]], MARK);
      }
      c.poly([[1, 21], [7, 9], [7, 21]], MARK); // jib
      c.rect(36, 5, 39, 6, MARK);
      fill(c, u ? dayAt(2) : seaAt(1));
      // the strand it stands on
      c.rect(1, 32, 44, b, SAND);
      c.row(32, 1, 44, L(SAND));
      dots(c, D(SAND), [5, 34, 14, 35, 26, 34, 37, 35, 41, 33]);
      c.rect(8, 31, 41, 31, D(SAND));
    },
    sw: 24, sh: 38,
    s(c, u) {
      const b = 36;
      c.col(11, 2, 26, MARK);
      c.poly([[5, 5], [18, 5], [19, 11], [4, 11]], MARK); // square sails, full on
      c.poly([[3, 13], [20, 13], [21, 21], [2, 21]], MARK);
      c.poly([[7, 22], [16, 22], [17, 26], [15, 31], [8, 31], [6, 26]], MARK); // the bow
      c.rect(12, 2, 14, 3, MARK);
      fill(c, u ? dayAt(2) : seaAt(1));
      c.col(11, 23, 30, u ? DAYl : SEAl); // the stem
      c.rect(1, 32, 22, b, SAND);
      c.row(32, 1, 22, L(SAND));
      dots(c, D(SAND), [4, 34, 12, 35, 19, 33]);
      c.rect(8, 31, 15, 31, D(SAND));
    },
  });

  /* ---------- the painters' objects ---------- */
  function softClock(c, x, y, w, drop, a = 2) {
    // a watch laid over an edge at x, y: flat part to the left, hanging part `drop` long
    const G = C.gold,
      F = hex('#9fb4b8');
    c.rect(x - w, y - 2, x, y, G);
    c.rect(x - w + 1, y - 1, x, y - 1, F);
    c.set(x - w, y - 2, null);
    c.oval(x - 1, y - 2, x + 6, y + drop + 2, G);
    c.rect(x - 1, y - 2, x + 2, y, G);
    c.oval(x, y - 1, x + 5, y + drop + 1, F);
    c.rect(x - 2, y - 1, x + 1, y - 1, F);
    c.line(x + 2, y + 2, x + 2, y + 2 + Math.min(5, drop - 2), NI);
    c.line(x + 2, y + 2, x + 4, y + 2 + a, NI);
    dots(c, NI, [x + 1, y + 1, x + 4, y + 1, x + 3, y + drop - 1, x - 3, y - 1, x - 6, y - 1]);
    c.rect(x - w - 1, y - 2, x - w, y - 1, G); // the winder
  }
  O('surreal-soft-clock-on-plinth', 'soft melting clock draped over the edge of a plinth limp pocket watch persistence of memory surreal', {
    w: 28, h: 28,
    f(c, u) {
      const b = 26,
        BL = hex('#7a6a58');
      c.rect(3, 9, 20, b, BL);
      c.row(9, 3, 20, L(BL));
      c.col(3, 9, b, L(BL));
      c.rect(3, b - 1, 20, b, D(BL));
      // a dead branch on it
      c.col(7, 1, 8, hex('#5a4638'));
      c.line(7, 4, 12, 2, hex('#5a4638'));
      softClock(c, 20, 8, 9, u ? 14 : 8);
      if (u) {
        c.rect(18, b, 27, b, C.gold); // it has run down to the floor
        c.rect(20, b, 26, b, hex('#9fb4b8'));
        dots(c, NI, [5, 12, 6, 13, 8, 12, 9, 14, 11, 13, 6, 16, 12, 16]); // ants
      } else dots(c, NI, [5, 12, 6, 13]);
    },
    sw: 16,
    s(c, u) {
      const b = 26,
        BL = hex('#7a6a58');
      c.rect(3, 9, 12, b, BL);
      c.row(9, 3, 12, L(BL));
      c.col(3, 9, b, L(BL));
      c.rect(3, b - 1, 12, b, D(BL));
      c.col(6, 1, 8, hex('#5a4638'));
      // the clock hanging towards you
      const G = C.gold,
        F = hex('#9fb4b8'),
        d = u ? 14 : 8;
      c.rect(5, 8, 10, 8 + d, G);
      c.rect(6, 9, 9, 7 + d, F);
      c.oval(4, 6 + d, 11, 11 + d, G);
      c.oval(5, 7 + d, 10, 10 + d, F);
      c.line(7, 10, 7, 13, NI);
      c.line(7, 10, 9, 12, NI);
      if (u) dots(c, NI, [4, 12, 11, 14, 4, 17]);
    },
  });

  O('surreal-apple-filling-room', 'green apple so big it fills a room giant apple taller than a person listening room surreal', {
    w: 46, h: 46,
    f(c, u) {
      const b = 44;
      apple(c, 2, 6, 43, b, APPLE);
      c.rect(21, 1, 23, 8, WD);
      c.poly([[24, 3], [31, 0], [34, 2], [29, 6]], P.GRASS);
      c.line(24, 4, 33, 2, P.GRASSd);
      c.oval(17, 6, 28, 9, D(APPLE));
      dots(c, D(APPLE), [10, 30, 30, 20, 34, 34, 14, 16, 24, 38, 20, 26]);
      if (u) {
        // a bite out of it, as high as a person can reach
        c.oval(30, 22, 44, 36, hex('#d6cf9e'));
        c.clearRect(41, 20, 45, 38);
        ring(c, 30, 22, 44, 36, D(APPLE));
        c.clearRect(41, 20, 45, 38);
        dots(c, hex('#b3a877'), [34, 26, 37, 30, 33, 32, 38, 34]);
        dots(c, hex('#5a4638'), [35, 28, 36, 31]);
      }
    },
    s: 'same',
  });

  O('surreal-pipe-on-easel', 'painting of a pipe on an easel this is not a pipe canvas with a line of writing under it surreal', {
    w: 28, h: 42, uh: 48,
    f(c, u) {
      const b = 40,
        BG = hex('#c9b98f');
      c.line(6, 4, 3, b, W);
      c.line(21, 4, 24, b, W);
      c.col(13, 2, 8, W);
      c.rect(4, 29, 23, 30, WD);
      c.rect(3, 8, 24, 28, WD);
      c.rect(5, 10, 22, 26, BG);
      // the pipe
      c.rect(7, 16, 15, 17, hex('#5a3a2a'));
      c.rect(15, 13, 19, 19, hex('#5a3a2a'));
      c.row(13, 15, 19, hex('#8a5a3a'));
      c.set(6, 16, P.FELT);
      c.set(7, 16, P.FELT);
      c.set(8, 16, P.FELT);
      c.row(20, 16, 18, hex('#5a3a2a'));
      for (let x = 7; x <= 20; x += 1) if (x % 4) c.set(x, 23, hex('#5a4638')); // the writing
      return () => {
        if (!u) return;
        // and yet it smokes
        dots(c, CLD, [17, 11, 18, 9, 17, 7, 16, 5, 17, 3]);
        const t = part(10, 7, (t) => cloud(t, 1, 1, 8, 5, CLD, 3));
        t.outline();
        c.stamp(t, 13, -5);
        c.set(17, 12, C.flame);
      };
    },
    sw: 16, suh: 48,
    s(c, u) {
      const b = 40;
      c.line(9, 4, 5, b, W); // front leg
      c.line(9, 4, 13, b, WD); // back leg
      c.poly([[8, 8], [9, 8], [7, 28], [6, 28]], WD); // the canvas, edge on
      c.col(6, 9, 28, hex('#c9b98f'));
      c.rect(4, 29, 7, 30, WD);
      return () => u && dots(c, CLD, [4, 12, 3, 9, 4, 6, 3, 3, 4, 0, 5, -2, 3, -3]);
    },
  });

  O('surreal-lobster-telephone', 'lobster telephone black telephone with a lobster for a receiver on a small table surreal', {
    w: 24, h: 32, uw: 34,
    f(c, u) {
      const b = 30;
      c.rect(3, 16, 20, 17, W);
      c.row(16, 3, 20, WL);
      c.col(5, 18, b, WD);
      c.col(18, 18, b, WD);
      c.row(24, 6, 17, WD);
      // the phone
      c.poly([[8, 11], [15, 11], [17, 15], [6, 15]], FELT);
      c.rect(10, 12, 13, 14, PORC);
      c.rect(11, 13, 12, 13, FELT);
      c.set(8, 10, FELT);
      c.set(15, 10, FELT);
      const lob = (x, y) => {
        // 16 wide: claws left, tail right
        c.rect(x + 5, y + 1, x + 11, y + 3, LOBSTER);
        c.row(y + 1, x + 5, x + 11, L(LOBSTER));
        c.rect(x + 12, y + 2, x + 14, y + 4, LOBSTER);
        c.rect(x + 14, y + 4, x + 15, y + 5, D(LOBSTER));
        c.rect(x, y, x + 3, y + 1, LOBSTER);
        c.rect(x, y + 3, x + 3, y + 4, LOBSTER);
        c.set(x + 4, y + 1, LOBSTER);
        c.set(x + 4, y + 3, LOBSTER);
        c.set(x + 6, y + 1, NI);
        for (let i = 7; i <= 11; i += 2) c.set(x + i, y + 4, D(LOBSTER));
        c.col(x + 9, y + 1, y + 3, D(LOBSTER));
      };
      if (!u) lob(4, 6);
      else lob(17, b - 5); // it has got down and is making off, the cord after it
      return () => {
        if (!u) return;
        c.line(15, 12, 20, 14, C.ash);
        c.line(20, 14, 24, b - 5, C.ash);
      };
    },
    sw: 18, suw: 24,
    s(c, u) {
      const b = 30;
      c.rect(3, 16, 14, 17, W);
      c.row(16, 3, 14, WL);
      c.col(5, 18, b, WD);
      c.col(12, 18, b, WD);
      c.poly([[6, 11], [9, 11], [12, 15], [5, 15]], FELT);
      c.line(10, 12, 11, 14, PORC);
      if (!u) {
        // the lobster seen from its claws
        c.rect(6, 6, 11, 9, LOBSTER);
        c.rect(4, 5, 5, 8, LOBSTER);
        c.rect(12, 5, 13, 8, LOBSTER);
        c.set(7, 7, NI);
        c.set(10, 7, NI);
        c.row(6, 6, 11, L(LOBSTER));
      } else {
        c.rect(14, b - 4, 19, b - 1, LOBSTER); // on the floor, coming your way
        c.rect(12, b - 5, 13, b - 2, LOBSTER);
        c.rect(20, b - 5, 21, b - 2, LOBSTER);
        c.set(15, b - 3, NI);
        c.set(18, b - 3, NI);
        c.row(b - 4, 14, 19, L(LOBSTER));
        c.row(b, 14, 19, D(LOBSTER));
      }
      return () => u && (c.line(11, 13, 15, 16, C.ash), c.line(15, 16, 16, b - 5, C.ash));
    },
  });

  O('surreal-giraffe-lamp-burning', 'giraffe necked lamp tall floor lamp with a giraffe neck and head its mane on fire burning giraffe surreal', {
    w: 22, h: 58,
    f(c, u) {
      const b = 56,
        SP = hex('#7a5230');
      c.rect(6, b - 1, 15, b, C.brass);
      c.rect(8, b - 3, 13, b - 2, C.brass);
      // the neck
      c.rect(9, 14, 12, b - 4, GIR);
      c.col(9, 14, b - 4, L(GIR));
      for (let y = 17; y <= b - 6; y += 5) {
        c.rect(10, y, 11, y + 2, SP);
        c.set(9, y + 3, SP);
        c.set(12, y + 1, SP);
      }
      // the head, looking left, a shade for a hat
      c.rect(4, 10, 12, 14, GIR);
      c.rect(2, 12, 5, 14, GIR);
      c.set(7, 11, NI);
      c.set(2, 13, SP);
      c.rect(12, 9, 13, 11, GIR); // ear
      c.poly([[6, 3], [12, 3], [15, 9], [3, 9]], u ? WARM : hex('#8a7a64'));
      c.row(9, 3, 15, D(hex('#8a7a64')));
      c.rect(8, 1, 10, 2, C.brass);
      // the mane, alight
      const n = u ? 3 : 1;
      for (let y = 16; y <= b - 8; y += u ? 3 : 7) {
        c.set(13, y, C.flame);
        if (u) {
          c.rect(13, y - 1, 14, y, C.flame);
          c.set(14, y - 2, C.flameLight);
          c.set(15, y - 3, C.flame);
        } else c.set(13, y - 1, C.flameLight);
      }
      return () => u && dots(c, C.flameLight, [16, 13, 17, 20, 16, 28, 18, 35, 16, 43, 2, 5, 17, 4]);
    },
    sw: 14,
    s(c, u) {
      const b = 56,
        SP = hex('#7a5230');
      c.rect(2, b - 1, 11, b, C.brass);
      c.rect(4, b - 3, 9, b - 2, C.brass);
      c.rect(5, 14, 8, b - 4, GIR);
      c.col(5, 14, b - 4, L(GIR));
      for (let y = 17; y <= b - 6; y += 5) {
        c.rect(6, y, 7, y + 2, SP);
        c.set(5, y + 3, SP);
      }
      c.rect(4, 9, 9, 15, GIR); // head on
      c.rect(5, 13, 8, 15, L(GIR));
      c.set(5, 11, NI);
      c.set(8, 11, NI);
      dots(c, SP, [6, 14, 7, 14]);
      c.set(3, 9, GIR);
      c.set(10, 9, GIR);
      c.poly([[4, 3], [9, 3], [12, 8], [1, 8]], u ? WARM : hex('#8a7a64'));
      c.rect(6, 1, 7, 2, C.brass);
      if (u) for (let y = 17; y <= b - 8; y += 4) dots(c, C.flame, [9, y, 4, y + 2, 10, y - 1, 3, y + 1]);
      else dots(c, C.flame, [9, 20, 9, 34]);
      return () => u && dots(c, C.flameLight, [11, 15, 2, 22, 11, 30, 2, 38, 12, 44]);
    },
  });

  const bigBowler = (c, x, y) => {
    // 14 wide, 8 high: a hat for a head
    c.oval(x + 2, y, x + 11, y + 9, FELT);
    c.clearRect(x, y + 7, x + 13, y + 10);
    c.rect(x + 2, y + 5, x + 11, y + 5, hex('#4a4650'));
    c.rect(x, y + 6, x + 13, y + 6, FELT);
    c.rect(x + 1, y + 7, x + 12, y + 7, NI);
    dots(c, hex('#4a4650'), [x + 4, y + 1, x + 5, y + 1, x + 3, y + 2]);
  };
  O('surreal-bowler-hats-in-a-row', 'bowler hats in a row three black hats hanging in the air at head height nobody under them surreal', {
    w: 46, h: 40, base: 'side', solid: false,
    f(c, u) {
      const b = 38;
      for (let i = 0; i < 3; i++) {
        const lift = u && i === 1;
        bigBowler(c, 1 + i * 15, lift ? 1 : 5 + (i % 2) * 2);
        c.row(b, 4 + i * 15, 11 + i * 15, NI); // the shadows where the men would stand
        if (lift) apple(c, 19, 13, 27, 21, APPLE); // under one of them, an apple
      }
    },
    sw: 16,
    s(c, u) {
      const b = 38;
      bigBowler(c, 1, u ? 1 : 5);
      if (u) apple(c, 4, 13, 12, 21, APPLE);
      c.row(b, 4, 11, NI);
    },
  });

  O('surreal-door-in-wall-of-sky', 'door in a wall of sky a piece of wall painted as blue sky and clouds with a plain wooden door surreal', {
    w: 32, h: 46, uw: 38,
    f(c, u) {
      const b = 44;
      day(c, 2, 2, 29, b, 3);
      c.rect(2, b - 3, 29, b, hex('#6a5a4a')); // skirting
      c.row(b - 3, 2, 29, hex('#8a7a64'));
      c.rect(9, 6, 22, b, WP); // frame
      if (!u) {
        c.rect(11, 8, 20, b, W);
        c.col(11, 8, b, WL);
        c.frame(13, 11, 18, 22, WD);
        c.frame(13, 26, 18, b - 4, WD);
        c.rect(18, 24, 19, 25, C.brass);
      } else {
        night(c, 11, 8, 20, b, 4); // and behind the day, night
        c.oval(14, 12, 18, 16, MOON);
        c.poly([[23, 7], [28, 5], [28, b], [23, b]], W);
        c.col(23, 7, b, WL);
        c.col(28, 5, b, WD);
        c.set(26, 24, C.brass);
        c.clearRect(29, 0, 37, 4);
      }
    },
    sw: 10, suw: 22,
    s(c, u) {
      const b = 44;
      c.rect(3, 2, 5, b, hex('#8a8478')); // the wall is a hand thick
      c.col(3, 2, b, DAY);
      c.rect(3, b - 3, 6, b, hex('#6a5a4a'));
      c.rect(6, 6, 6, b, WP);
      if (u) {
        c.rect(7, 8, 16, b, W);
        c.col(16, 8, b, WD);
        c.frame(9, 11, 14, 22, WD);
        c.frame(9, 26, 14, b - 4, WD);
        c.rect(14, 24, 15, 25, C.brass);
      } else c.set(7, 24, C.brass);
    },
  });
};
