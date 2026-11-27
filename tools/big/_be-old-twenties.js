/* The 1920's investigation: what the cult called up, what waits in the museum cellar, the harbour and the jazz club. */
module.exports = (kit, T) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { P, maker, sub, curve, vd, each } = T;
  const out = {};
  const mk = maker(out, 'be-twenties', "1920's creatures", 'twenties-');
  const FISH = hex('#5f7f72'),
    BELLY = hex('#b9b89a'),
    SPAWN = hex('#566a58'),
    SHOG = hex('#2c3632'),
    SHOGL = hex('#4c5f54'),
    GAUNT = hex('#1c1b26'),
    GAUNTL = hex('#34364a'),
    ROBE = hex('#3a2c3e'),
    YROBE = hex('#b0923a'),
    BRASS = C.brass,
    GOLD = hex('#c0a04a'),
    BAND = hex('#d9cfae'),
    TWEED = hex('#6e5a40'),
    MIGO = hex('#a8808a'),
    EYEG = hex('#c8d07a'),
    TENC = P.TEN;

  /* 1 */
  mk('deep-one', 'deep one fish man frog eyed harbour thing gills webbed claws innsmouth', 18, 32, (g, r) => {
    const F = FISH;
    for (const v of [g, g.flip(17)]) {
      v.limb([[6, 21], [4, 25], [6, 28], [4, 30]], F, 2);
      v.row(30, 1, 6, dark(F));
      v.pts([[1, 29], [3, 29]], dark(F));
      if (!r) {
        v.limb([[4, 12], [1, 18], [2, 24]], F, 2);
        v.fingers(2, 25, 'd', BELLY, 2);
      } else {
        v.limb([[4, 12], [-1, 9], [-2, 2]], F, 2);
        v.fingers(-2, 1, 'u', BELLY, 3);
        v.pts([[-3, 0], [-1, 0]], F);
        v.pts([[3, 9], [2, 10], [3, 11], [1, 9]], C.red); // the gills flare
      }
    }
    g.ball(4, 9, 13, 23, F);
    g.oval(6, 12, 11, 22, BELLY);
    g.ribs(7, 10, 15, 3, dark(BELLY));
    for (let i = 0; i < 4; i++) g.col(7 + i, (r ? -3 : 0) + (i % 2), 3, dark(F)); // crest
    g.oval(3, 2, 14, 11, F);
    g.speckle(4, 3, 13, 10, dark(F), 6, 3);
    g.orb(2, 3, 5, 6, K, { white: P.YEL });
    g.orb(12, 3, 15, 6, K, { white: P.YEL });
    if (!r) {
      g.row(9, 5, 12, K);
      g.pts([[4, 8], [13, 8]], K);
      g.pts([[6, 12], [11, 12]], dark(F));
    } else g.maw(4, 7, 13, 11, { step: 1, round: true });
  });

  /* 2 */
  mk(
    'shoggoth',
    'shoggoth mass with many eyes black slime protoplasm mouths bubbling tekeli-li',
    48,
    30,
    (g, r) => {
      const up = r ? 10 : 0,
        bl = (x0, y0, x1, y1) => g.ball(x0, y0, x1, y1, SHOG, { liteCol: SHOGL, dark: hex('#1c2220') });
      if (r) {
        g.tent([[10, 12], [5, 2], [8, -8], [5, -12]], 2.6, SHOG);
        g.tent([[36, 10], [42, 0], [39, -8], [42, -13]], 2.4, SHOG);
        g.tent([[24, 2], [22, -8], [26, -14]], 2.2, SHOG);
        g.orb(3, -15, 6, -12, K, { white: EYEG });
        g.orb(41, -16, 44, -13, K, { white: EYEG });
        g.orb(25, -17, 28, -14, K, { white: EYEG });
      }
      bl(1, 14, 20, 28);
      bl(28, 12, 46, 28);
      bl(10, 5 - up, 36, 28);
      bl(4, 9 - up / 2, 18, 24);
      bl(30, 8 - up / 2, 43, 22);
      g.rect(3, 24, 44, 28, SHOG);
      g.row(28, 2, 45, hex('#1c2220'));
      for (const [x, y] of [[12, 8], [20, 6], [30, 9], [8, 16], [38, 14]]) g.pts([[x, y - (y < 12 ? up : 0)], [x + 1, y - (y < 12 ? up : 0)]], SHOGL);
      const eyes = [[14, 11, 3], [24, 9, 4], [33, 13, 3], [7, 19, 2], [20, 18, 2], [40, 19, 3], [28, 20, 2]];
      const more = [[18, 2, 3], [30, 0, 2], [11, 23, 2], [36, 24, 2], [24, -2, 2], [44, 23, 1], [3, 24, 1]];
      for (const [x, y, s] of r ? eyes.concat(more) : eyes) {
        const yy = y - (y < 14 ? up * 0.6 : 0);
        if (!r && s < 3) {
          g.row(yy + 1, x, x + s, hex('#1c2220')); // shut
          continue;
        }
        g.orb(x, yy, x + s, yy + s, K, { white: EYEG });
      }
      if (r) {
        g.maw(13, 13, 22, 16, { round: true });
        g.maw(27, 4, 33, 7, { round: true });
        g.maw(30, 21, 34, 23);
      }
    },
    { L: 'long' },
  );

  /* 3 */
  mk('cultist-hollow-hood', 'cultist whose hood is empty robe with nothing in it tentacles from the hood sect', 16, 34, (g, r) => {
    const b = g.at(0, 1);
    b.man({ hood: ROBE, face: 'void', top: ROBE, robe: ROBE, wide: 1, tl: 10, ll: 12, hand: P.NIGHT, arms: r ? 'up' : 'down', belt: GOLD });
    b.pts([[7, 15], [8, 15], [6, 16], [9, 16], [7, 17], [8, 17], [7, 19]], GOLD); // the sign on the breast
    if (r) {
      const TL = hex('#8f6f8c');
      b.tent([[7, 8], [5, 13], [2, 17], [0, 15]], 1.4, TL, P.SUCK);
      b.tent([[8, 8], [10, 14], [13, 19], [16, 17]], 1.4, TL, P.SUCK);
      b.tent([[7.5, 9], [7, 16], [8, 22]], 1.2, hex('#a07f98'));
      for (const v of [b, b.flip(15)]) v.tent([[0, 3], [-3, 0], [-2, -5]], 1.1, TL);
      b.set(7, 6, P.YEL);
    }
  });

  /* 4 */
  mk(
    'star-spawn',
    'star spawn with a tentacled face octopus head great old one wings claws green',
    30,
    48,
    (g, r) => {
      const S = SPAWN,
        D = dark(S);
      for (const v of [g, g.flip(29)]) {
        if (!r) v.wing(8, 16, [[3, 6], [1, 16], [3, 26]], D, vd(S));
        else v.wing(8, 16, [[0, 0], [-9, 4], [-12, 16], [-8, 27], [0, 24]], D, vd(S));
        v.limb([[10, 34], [8, 40], [10, 45]], S, 4);
        v.row(46, 5, 12, D);
        v.pts([[5, 45], [7, 45]], BELLY);
        if (!r) {
          v.limb([[7, 18], [4, 26], [5, 34]], S, 3);
          v.fingers(6, 35, 'd', BELLY, 2);
        } else {
          v.limb([[7, 18], [1, 22], [-3, 14]], S, 3);
          v.fingers(-2, 13, 'u', BELLY, 3);
        }
      }
      g.ball(7, 15, 22, 38, S);
      g.oval(10, 24, 19, 37, hex('#6f8068'));
      g.ball(8, 1, 21, 15, S, { liteCol: hex('#6f8472') }); // the dome of the head
      g.pts([[11, 4], [15, 3], [18, 6]], D);
      const tips = r ? [[3, 30], [9, 34], [14, 38], [20, 33], [27, 29]] : [[10, 27], [12, 30], [15, 32], [17, 29], [20, 26]];
      [11, 13, 15, 16, 18].forEach((x, i) => g.tent([[x, 13], [(x + tips[i][0]) / 2 + (i % 2 ? 2 : -2), (13 + tips[i][1]) / 2], tips[i]], 1.5, i % 2 ? hex('#4a5e50') : S, P.SUCK));
      for (const [x, y] of [[10, 9], [13, 10], [16, 10], [19, 9]]) g.set(x, y, r ? P.RED : K);
      if (r) g.pts([[11, 7], [18, 7]], P.RED);
    },
    { L: 'tall' },
  );

  /* 5 */
  mk('gramophone-thing', 'thing in the gramophone horn phonograph record player eye tongue from the trumpet', 20, 22, (g, r) => {
    if (r) {
      g.tent([[5, 20], [2, 21], [0, 19]], 1, TENC);
      g.tent([[14, 20], [17, 21], [19, 19]], 1, TENC);
    }
    g.box(3, 13, 16, 20, C.wood);
    g.row(12, 2, 17, C.woodDark);
    g.rect(5, 11, 13, 11, K); // the record
    g.pts([[17, 16], [18, 16], [18, 15]], C.steel);
    g.limb([[12, 11], [13, 8]], BRASS, 2);
    g.poly([[12, 8], [15, 8], [19, 0], [5, -2]], BRASS); // the horn, turned on us
    g.oval(5, -5, 19, 4, BRASS);
    g.oval(6, -4, 18, 3, GOLD);
    g.oval(8, -3, 17, 2, P.NIGHT);
    if (!r) {
      g.orb(11, -2, 14, 1, K, { white: P.YEL });
      g.pts([[7, 0], [8, -3]], lite(GOLD));
    } else {
      g.oval(8, -3, 17, 2, P.MAW);
      for (let a = 0; a < 10; a++) g.set(12.5 + Math.cos(a * 0.63) * 4.6, -0.5 + Math.sin(a * 0.63) * 2.6, P.TOOTH);
      g.tent([[12, 0], [9, 6], [4, 9], [1, 6]], 1.5, P.GUM);
      g.tent([[14, -1], [20, -5], [22, -10]], 0.9, TENC);
      g.orb(21, -13, 24, -10, K, { white: P.YEL });
    }
  });

  /* 6 */
  mk('mummy-unbound', 'museum mummy unbound unwrapping bandages lash dry dead egyptian', 16, 34, (g, r) => {
    const b = g.at(0, 1),
      W = hex('#bfb48c'),
      DR = hex('#5a4a38');
    b.man({ skin: W, face: 'none', top: W, legs: W, shoe: false, hand: r ? DR : W, arms: r ? 'reach' : { l: 'down', r: 'hold' }, neck: false });
    for (let y = 2; y < 33; y += 2) for (let x = 1; x < 15; x++) if (b.get(x, y + (x > 7 ? 1 : 0)) === W && (x + y) % 5) b.set(x, y + (x > 7 ? 1 : 0), dark(W));
    b.rect(6, 15, 9, 19, DR); // the chest already bare
    b.ribs(6, 9, 15, 3, vd(DR));
    b.col(13, 20, 30, W);
    b.pts([[14, 31], [13, 31]], W);
    b.rect(3, 31, 4, 32, C.paper); // a museum label on the toe
    if (!r) {
      b.rect(5, 6, 6, 6, K);
      b.set(9, 6, P.YEL);
    } else {
      b.rect(5, 4, 10, 10, DR);
      b.rect(5, 5, 6, 6, K);
      b.rect(9, 5, 10, 6, K);
      b.set(9, 6, P.YEL);
      b.maw(6, 8, 9, 11);
      b.tent([[4, 3], [-2, 0], [-6, 3], [-8, -1]], 0.8, W, null, 0.8);
      b.tent([[11, 4], [16, 0], [20, 2], [22, -2]], 0.8, W, null, 0.8);
      b.tent([[12, 18], [18, 20], [21, 26]], 0.8, W, null, 0.8);
      b.tent([[3, 24], [-3, 26], [-6, 31]], 0.8, W, null, 0.8);
    }
  });

  /* 7 */
  mk(
    'night-gaunt',
    'night gaunt faceless horned winged black rubbery thin barbed tail dreamlands',
    32,
    48,
    (g, r) => {
      const N = GAUNT,
        L = GAUNTL;
      g.tent(r ? [[15, 30], [22, 36], [28, 30], [31, 22]] : [[15, 30], [22, 38], [24, 44], [28, 45]], 1.2, N, null, 0.8);
      const tx = r ? 31 : 28,
        ty = r ? 22 : 45;
      g.pts([[tx + 1, ty - 1], [tx + 1, ty + 1], [tx + 2, ty]], N);
      for (const v of [g, g.flip(31)]) {
        if (!r) v.wing(12, 14, [[9, 4], [5, 14], [5, 28], [8, 36]], N, L);
        else v.wing(12, 14, [[6, 0], [-6, -2], [-14, 6], [-13, 18], [-5, 22], [4, 20]], N, L);
        v.limb([[13, 30], [11, 37], [13, 42], [12, 45]], N, 2);
        v.row(46, 9, 13, N);
        v.pts([[9, 45]], N);
        if (!r) {
          v.limb([[11, 15], [9, 24], [10, 33]], N, 2);
          v.fingers(10, 34, 'd', N, 3);
        } else {
          v.limb([[11, 15], [5, 22], [1, 30]], N, 2);
          v.fingers(1, 31, 'd', N, 3);
        }
      }
      g.poly([[12, 13], [19, 13], [18, 22], [17, 31], [14, 31], [13, 22]], N);
      g.col(13, 14, 22, L);
      g.ribs(14, 17, 17, 3, L, 3);
      g.oval(12, 4, 19, 12, N);
      g.pts([[13, 6], [13, 7], [14, 5]], L);
      for (const v of [g, g.flip(31)]) v.limb([[13, 5], [11, 3], [13, 1]], N, 1), v.set(12, 3, N);
    },
    { L: 'tall', def: { shade: false } },
  );

  /* 8 */
  mk('rat-thing-face', 'rat thing with a human face brown jenkin witch familiar tiny hands small', 16, 10, (g, r) => {
    const R = hex('#5e4a3a');
    if (!r) {
      g.tent([[4, 7], [1, 8], [-3, 6], [-5, 8]], 0.8, P.RAW, null, 0.8);
      g.oval(2, 3, 11, 8, R);
      g.pts([[4, 9], [5, 9], [9, 9], [10, 9]], P.PALE);
      g.oval(9, 1, 14, 7, R);
      g.rect(10, 2, 13, 6, P.PALE);
      g.pts([[10, 3], [13, 3]], K);
      g.row(6, 10, 13, C.ash);
      g.set(11, 5, vd(P.PALE));
      g.pts([[9, 0], [14, 0]], P.RAW);
    } else {
      g.tent([[5, 8], [1, 9], [-2, 6], [-4, 8]], 0.8, P.RAW, null, 0.8);
      g.oval(4, -1, 10, 9, R);
      g.rect(6, 2, 8, 7, hex('#8a7460'));
      g.pts([[4, 9], [5, 9], [9, 9], [10, 9]], P.PALE);
      for (const v of [g, g.flip(14)]) {
        v.limb([[4, 2], [1, 0], [1, -3]], R);
        v.pts([[0, -4], [1, -4], [2, -4], [0, -5], [2, -5]], P.PALE);
      }
      g.oval(4, -8, 10, -1, R);
      g.rect(5, -7, 9, -2, P.PALE);
      g.pts([[5, -6], [9, -6]], P.RED);
      g.rect(6, -4, 8, -3, K);
      g.pts([[6, -4], [8, -4], [7, -3]], P.TOOTH);
      g.row(-2, 5, 9, C.ash);
      g.pts([[4, -9], [10, -9]], P.RAW);
    }
  });

  /* 9 */
  mk(
    'colour-figure',
    'colour out of space glowing figure unearthly light shape blasted heath shimmer',
    16,
    36,
    (g, r) => {
      const A = hex('#a06a9c'),
        B = hex('#7fb096'),
        W = hex('#dcd4e4'),
        D = hex('#62548c'),
        s = sub(40, 60, (q) => {
          const b = q.at(12, 12);
          b.man({ skin: A, top: A, legs: A, shoe: A, hand: A, face: 'none', arms: r ? 'up' : 'down', neck: false, hair: ['long', A, 18] });
          if (r) {
            b.poly([[5, 1], [10, 1], [12, -12], [3, -12]], A);
            for (const x of [-4, 1, 14, 19]) b.line(x < 8 ? 3 : 12, 6, x, -9, A);
          }
        });
      for (let y = 0; y < s.h; y++)
        for (let x = 0; x < s.w; x++) {
          if (!s.get(x, y)) continue;
          const edge = !s.get(x - 1, y) || !s.get(x + 1, y) || !s.get(x, y - 1) || !s.get(x, y + 1),
            band = Math.floor((y * 1.3 + Math.sin(x * 0.9 + y * 0.3) * 3) / 4) % 4;
          if (edge && (x + y) % 2) continue;
          if (r && y < 12 && (x + y) % 3 === 0) continue;
          g.set(x - 12, y - 10, edge ? D : [A, W, B, A][band]);
        }
      g.rect(6, 7, 7, 8, r ? K : W);
      g.rect(10, 7, 11, 8, r ? K : W);
      if (r) g.rect(8, 10, 9, 12, K);
      // the grey ash it leaves
      g.row(35, 1, 14, C.ash);
      g.row(36, 3, 12, hex('#6a6862'));
      g.pts([[0, 36], [15, 36], [-1, 35], [16, 35]], hex('#6a6862'));
      if (r) g.pts([[-3, 30], [18, 26], [-2, 20], [19, 16], [-4, 10], [20, 4]], W);
    },
    { def: { shade: false, outline: false } },
  );

  /* 10 */
  mk('professor-changing', 'professor in the middle of changing half man half tentacled thing tweed spectacles', 18, 34, (g, r) => {
    const b = g.at(1, 1),
      SC = hex('#5f7f72');
    if (r) {
      b.tent([[12, 13], [18, 9], [20, 1], [16, -4]], 2, SC, BELLY);
      b.tent([[12, 15], [19, 17], [22, 24]], 1.5, SC, BELLY);
      b.tent([[11, 14], [16, 22], [15, 30]], 1.3, dark(SC));
    } else {
      b.tent([[12, 13], [15, 18], [14, 25], [16, 28]], 1.7, SC, BELLY);
    }
    b.man({ skin: C.flesh, face: 'old', hair: ['thin', C.ash], top: TWEED, legs: hex('#4a4034'), shirt: C.white, tie: C.wine, arms: { l: r ? 'hold' : 'down', r: 'none' }, shoe: hex('#3a2a22') });
    // the right half of him
    b.rect(8, 3, 11, 10, SC);
    b.pts([[8, 4], [8, 7], [8, 10]], C.flesh);
    b.pts([[10, 5], [10, 8], [9, 9]], P.YEL);
    b.rect(10, 12, 11, 21, SC);
    b.pts([[9, 14], [9, 18], [10, 22]], SC);
    b.rect(8, 22, 11, 31, dark(SC));
    b.pts([[8, 32], [10, 32], [12, 32], [12, 31]], SC);
    b.rect(4, 5, 7, 7, null);
    b.frame(4, 5, 7, 7, GOLD); // spectacles
    b.set(6, 6, K);
    b.set(5, 6, C.flesh);
    if (r) {
      b.rect(6, -1, 10, 3, P.MAW); // the skull opens
      b.pts([[6, -1], [8, -1], [10, -1], [7, 3], [9, 3]], P.TOOTH);
      b.tent([[8, 0], [7, -5], [9, -9]], 1, SC);
      b.tent([[9, 0], [12, -4], [11, -8]], 0.8, SC);
      b.rect(6, 9, 7, 10, K);
    }
  });

  /* 11 */
  mk(
    'flying-polyp',
    'flying polyp half invisible floating mass wind whistling tubes feelers hovering',
    24,
    32,
    (g, r) => {
      const A = hex('#8e8c9c'),
        D = hex('#5a5868');
      for (const [x, n, d] of [[5, 8, -2], [9, 11, 1], [13, 9, -1], [17, 12, 2], [20, 7, 1]]) g.tent([[x, 17], [x + d, 17 + n * (r ? 0.9 : 0.5)], [x + d * (r ? 4 : 1), 17 + n * (r ? 1.4 : 0.9)]], 1.1, D);
      g.ball(3, 6, 21, 19, A, { dark: D });
      g.ball(1, 9, 9, 17, A, { dark: D });
      g.ball(14, 3, 23, 14, A, { dark: D });
      g.ball(7, 1, 16, 10, A, { dark: D });
      for (const [x, y, s] of [[6, 10, 2], [12, 5, 2], [17, 8, 3], [11, 13, 3], [19, 14, 1], [4, 13, 1]]) {
        g.oval(x, y, x + s, y + s, K);
        if (r) g.set(x + (s > 1 ? 1 : 0), y, P.TOOTH), g.set(x + s, y + s, P.TOOTH);
      }
      g.orb(8, 6, 10, 8, r ? P.RED : K, { white: EYEG });
      // parts of it are not there
      for (let y = 0; y < 34; y++) for (let x = 0; x < 26; x++) if ((x + y) % 2 === 0 && (r ? (x * 7 + y * 3) % 11 < 2 : (x * 7 + y * 3) % 11 < 5)) g.clear(x, y);
      g.fin(D);
      if (r) {
        g.limb([[-4, 6], [-1, 3], [3, 2]], C.white);
        g.limb([[27, 16], [25, 20], [21, 22]], C.white);
        g.limb([[-3, 14], [-1, 18]], C.white);
      }
      g.shadow(34, 5, 19);
      return false;
    },
    {},
  );

  /* 12 */
  mk(
    'jazz-band-fused',
    'jazz band fused into one instrument musicians grown into horns drum brass heads',
    48,
    30,
    (g, r) => {
      const TR = hex('#22202a');
      for (const [x, k] of [[12, -1], [19, 1], [28, -1], [35, 1]]) {
        g.limb([[x, 20], [x + k, 24], [x, 27]], TR, 2);
        g.rect(x - 1, 27, x + 2, 28, C.white); // spats
        g.row(28, x - 1, x + 2, K);
      }
      // the bass neck, a trombone slide, a saxophone
      g.limb([[38, 12], [42, 3], [43, 0]], C.wood, 2);
      g.pts([[42, -1], [45, 0], [44, -1]], C.woodDark);
      g.limb([[8, 12], [3, 6], [2, 0]], BRASS, 1);
      g.limb([[10, 12], [5, 6], [4, 0]], GOLD, 1);
      g.row(-1, 2, 4, BRASS);
      g.ball(13, 8, 34, 24, BAND, { dark: hex('#a89c7a') }); // the big drum
      g.oval(13, 8, 34, 24, null);
      g.ball(12, 7, 35, 24, hex('#6a2a2c'));
      g.oval(14, 9, 33, 22, BAND);
      // heads on brass stalks
      const head = (x, y, hair) => {
        g.limb([[x + 2, y + 7], [x + 2, 12]], BRASS, 2);
        g.oval(x, y, x + 5, y + 7, P.PALE);
        g.row(y, x + 1, x + 4, hair);
        g.row(y + 1, x, x + 5, hair);
        g.pts([[x + 1, y + 3], [x + 4, y + 3]], r ? P.EYE : K);
        if (r) g.rect(x + 2, y + 5, x + 3, y + 7, K);
        else g.row(y + 5, x + 2, x + 3, vd(P.PALE));
        g.pts([[x + 1, y + 8], [x + 4, y + 8]], K); // bow tie
      };
      head(15, 1, hex('#2a2228'));
      head(22, -1, hex('#6b4630'));
      head(29, 2, hex('#2a2228'));
      // bells of horns
      const bell = (x, y, s) => {
        g.oval(x, y, x + s, y + s, GOLD);
        g.oval(x + 1, y + 1, x + s - 1, y + s - 1, r ? P.MAW : dark(BRASS));
        if (r) {
          g.pts([[x + 2, y + 1], [x + s - 2, y + 1], [x + 1, y + (s >> 1)], [x + s - 1, y + (s >> 1)], [x + 2, y + s - 1], [x + s - 2, y + s - 1]], P.TOOTH);
          g.set(x + (s >> 1), y + (s >> 1), P.GUM);
        } else g.set(x + 2, y + 2, lite(GOLD));
      };
      g.tube(curve([[12, 16], [7, 18], [4, 14]], 5), 1.4, 1.4, BRASS);
      bell(1, 8, 7);
      g.tube(curve([[35, 16], [40, 20], [43, 16]], 5), 1.4, 1.4, BRASS);
      bell(39, 9, 7);
      g.tube(curve([[30, 22], [34, 26], [38, 24]], 5), 1.2, 1.2, BRASS);
      bell(36, 19, 5);
      // gloved hands at the drum
      for (const x of [16, 30]) g.rect(x, 11, x + 2, 13, C.white), g.limb([[x + 1, 10], [x + 1, 8]], TR, 2);
      if (!r) {
        g.pts([[20, 14], [26, 14]], hex('#8a7e60'));
        g.row(18, 20, 27, hex('#8a7e60'));
      } else {
        g.maw(17, 13, 30, 19, { round: true });
        g.pts([[19, 11], [28, 11]], P.RED);
        g.tent([[23, 17], [22, 23], [25, 27]], 1.6, P.GUM);
      }
    },
    { L: 'long' },
  );

  /* 13 */
  mk('mi-go', 'mi-go fungus from yuggoth pink crustacean wings pincers brain cylinder alien', 22, 26, (g, r) => {
    const M = MIGO,
      D = dark(M),
      WG = hex('#8a9a9a');
    for (const v of [g, g.flip(21)]) {
      if (!r) v.wing(8, 8, [[3, 3], [1, 10], [3, 17]], WG, hex('#5a6a6a'));
      else v.wing(8, 8, [[2, -4], [-7, -3], [-9, 6], [-4, 13]], WG, hex('#5a6a6a'));
      v.limb([[8, 12], [4, 13], [3, 17]], M);
      v.limb([[8, 15], [5, 18], [5, 24]], M);
      v.limb([[9, 18], [8, 21], [9, 24]], D);
      v.pts([[2, 18], [4, 18], [3, 19]], D); // pincer
      if (r) {
        v.limb([[8, 10], [3, 6], [3, 1]], M);
        v.pts([[2, 0], [4, 0], [2, -1], [4, -1]], D);
      }
    }
    for (let i = 0; i < 5; i++) {
      g.rect(8 + (i > 3 ? 1 : 0), 7 + i * 3, 13 - (i > 3 ? 1 : 0), 9 + i * 3, M);
      g.row(9 + i * 3, 8, 13, D);
    }
    g.col(8, 7, 20, lite(M));
    // the head: a knot of feelers, no face
    g.oval(7, 0, 14, 7, hex('#b99aa0'));
    const rr = rnd(4);
    for (let i = 0; i < 12; i++) g.set(8 + Math.floor(rr() * 6), 1 + Math.floor(rr() * 6), r ? [P.YEL, hex('#7ac8a0'), hex('#b06aa8')][i % 3] : D);
    g.pts([[6, 1], [15, 0], [5, 3], [16, 4], [10, -1], [12, -1]], hex('#b99aa0'));
    if (!r) {
      g.rect(14, 13, 17, 18, C.steel); // the cylinder it carries
      g.row(13, 14, 17, C.glassLight);
      g.set(15, 15, C.red);
    }
  });

  /* 14 */
  mk('brain-cylinder-walker', 'brain in a metal cylinder on spider legs mi-go canister lens small machine', 12, 14, (g, r) => {
    const up = r ? -4 : 0,
      ST = C.steel;
    for (const v of [g, g.flip(11)]) {
      v.limb([[3, 9 + up], [0, 7 + up], [0, 13]], C.iron);
      v.limb([[4, 10 + up], [2, 9 + up], [3, 13]], C.iron);
    }
    g.rect(3, 4 + up, 8, 11 + up, ST);
    g.col(3, 4 + up, 11 + up, lite(ST));
    g.row(11 + up, 3, 8, dark(ST));
    g.rect(3, 1 + up, 8, 4 + up, C.glassLight);
    g.rect(4, 2 + up, 7, 4 + up, r ? hex('#d09a9a') : P.RAW);
    g.pts([[5, 2 + up], [6, 3 + up], [4, 4 + up]], dark(P.RAW));
    g.row(0 + up, 4, 7, ST);
    g.set(5, 7 + up, r ? P.RED : K);
    g.pts([[7, 7 + up], [7, 9 + up]], BRASS);
    g.row(9 + up, 4, 5, K);
    if (r) {
      g.tent([[8, 4], [12, 2], [14, -4], [12, -8]], 0.7, C.iron, null, 0.7);
      g.pts([[11, -9], [13, -9], [12, -10]], BRASS);
    }
  });

  /* 15 */
  mk('ghoul-gnawer', 'ghoul of the tunnels dog faced corpse eater hooves claws gnawing a bone rubbery', 20, 26, (g, r) => {
    const G = hex('#7f8a78'),
      D = dark(G);
    const up = r ? -6 : 0;
    for (const v of [g, g.flip(19)]) {
      v.limb([[7, 17 + up / 2], [4, 20], [6, 23]], G, 2);
      v.rect(5, 23, 7, 24, K);
      if (!r) {
        v.limb([[5, 9], [3, 13], [6, 16]], G, 2);
        v.fingers(7, 16, 'r', P.BONE, 1);
      } else {
        v.limb([[5, 9 + up], [0, 6 + up], [-2, 12 + up]], G, 2);
        v.fingers(-2, 13 + up, 'd', P.BONE, 3);
      }
    }
    g.ball(5, 7 + up, 14, 21 + up / 2, G);
    g.ribs(7, 12, 12 + up, 3, D);
    g.oval(5, 0 + up, 14, 8 + up, G);
    g.poly([[5, 2 + up], [3, -2 + up], [7, 1 + up]], G);
    g.poly([[14, 2 + up], [16, -2 + up], [12, 1 + up]], D);
    g.rect(7, 5 + up, 12, 10 + up, G); // muzzle
    g.rect(9, 5 + up, 10, 6 + up, K);
    g.pts([[7, 3 + up], [12, 3 + up]], r ? P.RED : P.YEL);
    if (!r) {
      g.row(9, 7, 12, K);
      g.rect(5, 12, 14, 13, P.BONE); // the bone
      g.pts([[4, 11], [4, 14], [15, 11], [15, 14]], P.BONE);
    } else g.maw(7, 7 + up, 12, 11 + up, { tongue: P.GUM });
  });

  /* 16 */
  mk(
    'elder-thing',
    'elder thing barrel body starfish head wings antarctic old one five ridges',
    24,
    46,
    (g, r) => {
      const E = hex('#7a8a7c'),
        D = dark(E),
        ST = hex('#b8a860');
      for (const v of [g, g.flip(23)]) {
        // the fan wings
        if (!r) v.wing(7, 16, [[4, 11], [3, 22], [5, 32]], hex('#6a7a8a'), hex('#46525e'));
        else v.wing(7, 16, [[0, 6], [-8, 10], [-9, 22], [-4, 32], [3, 34]], hex('#6a7a8a'), hex('#46525e'));
        v.tent([[8, 38], [4, 42], [1, 44]], 1.4, D);
        v.tent(r ? [[7, 22], [1, 20], [-3, 14]] : [[7, 22], [4, 26], [4, 31]], 0.9, E);
        if (r) v.pts([[-4, 13], [-2, 12], [-4, 15]], E);
      }
      g.tent([[11.5, 38], [11.5, 43], [11.5, 45]], 1.6, E);
      g.ball(6, 10, 17, 40, E);
      for (const x of [8, 11, 14]) g.col(x, 12, 38, D);
      g.col(7, 14, 36, lite(E));
      g.rect(10, 6, 13, 10, D); // neck
      // the star of the head
      const arms = r ? [[2, 0], [7, -5], [11.5, -7], [16, -5], [21, 0]] : [[4, 4], [8, 2], [11.5, 1], [15, 2], [19, 4]];
      for (const [x, y] of arms) {
        g.tent([[11.5, 6], [(x + 11.5) / 2, (y + 6) / 2 - 1], [x, y]], 1.5, ST);
        g.set(x, y, r ? P.RED : K);
      }
      g.oval(9, 4, 14, 8, ST);
      if (r) {
        g.rect(10, 5, 13, 7, P.MAW);
        g.pts([[10, 5], [12, 5], [11, 7], [13, 7]], P.TOOTH);
      }
    },
    { L: 'tall' },
  );

  /* 17 */
  mk('flapper-jointed', 'flapper dancer with too many joints head turned upside down pearls fringe dress jazz', 18, 34, (g, r) => {
    const b = g.at(1, 1),
      DR = hex('#2e5658'),
      H = hex('#1e1b24');
    b.man({ skin: P.PALE, face: 'none', head: !r, hair: ['bob', H], top: DR, legs: P.PALE, shoe: H, tl: 10, ll: 10, arms: 'none', hand: P.PALE });
    b.rect(4, 22, 11, 26, DR);
    for (let x = 4; x <= 11; x++) b.col(x, 26, 27 + (x % 2), GOLD); // fringe
    b.row(21, 4, 11, GOLD);
    b.limb([[6, 12], [5, 16], [7, 20], [9, 16], [9, 12]], C.white); // the pearls
    if (!r) {
      b.pts([[6, 6], [9, 6]], K);
      b.pts([[7, 9], [8, 9]], C.red);
      b.limb([[3, 13], [0, 17], [3, 20], [1, 24]], P.PALE, 2); // an elbow too many
      b.limb([[12, 13], [14, 18], [13, 23]], dark(P.PALE), 2);
    } else {
      // the head has gone right over
      const h = b.at(2, -1);
      h.face(4, 3, P.PALE);
      h.rect(4, 9, 11, 11, H);
      h.col(4, 5, 10, H);
      h.col(11, 5, 10, H);
      h.pts([[6, 8], [9, 8]], K);
      h.pts([[6, 7], [9, 7]], P.EYE);
      h.rect(7, 4, 8, 5, C.red);
      b.limb([[3, 13], [-2, 10], [1, 6], [-3, 2], [0, -2]], P.PALE, 2);
      b.limb([[12, 13], [17, 15], [14, 20], [19, 23], [16, 27]], dark(P.PALE), 2);
      b.fingers(0, -3, 'u', P.PALE, 1);
      b.fingers(16, 28, 'd', P.PALE, 1);
      b.pts([[-1, 16], [15, 9], [16, 11]], C.white);
    }
  });

  /* 18 */
  mk('byakhee', 'byakhee winged thing bat bird insect hybrid carrion star flyer talons', 28, 24, (g, r) => {
    const B = hex('#4a3e34'),
      O = hex('#8a7040');
    for (const v of [g, g.flip(27)]) {
      if (!r) v.wing(11, 9, [[7, 1], [3, 8], [4, 18]], dark(B), vd(B));
      else v.wing(11, 9, [[5, -6], [-6, -8], [-12, 0], [-10, 10], [-2, 12]], dark(B), vd(B));
      v.limb([[11, 17], [8, 19], [9, 22]], O);
      v.pts([[7, 22], [8, 22], [10, 22], [11, 22]], O);
    }
    g.ball(9, 8, 18, 19, B);
    for (const y of [11, 13, 15, 17]) g.row(y, 11, 16, O);
    g.oval(10, 1, 17, 9, B);
    g.poly([[10, 3], [8, 0], [12, 2]], B);
    g.poly([[17, 3], [19, 0], [15, 2]], dark(B));
    g.pts([[11, 5], [16, 5]], r ? P.RED : P.YEL);
    g.rect(13, 6, 14, 10, O); // a beak like a mole's snout
    g.set(13, 10, K);
    if (r) {
      g.rect(12, 8, 15, 12, P.MAW);
      g.pts([[12, 8], [15, 8], [12, 12], [15, 12], [13, 8]], O);
      g.pts([[13, 10], [14, 11]], P.GUM);
    }
  });

  /* 19 */
  mk(
    'motor-car-carnivore',
    'motor car that eats tin lizzie bonnet jaws radiator teeth headlamp eyes automobile',
    46,
    26,
    (g, r) => {
      const B = hex('#201e28'),
        wheel = (x) => {
          g.oval(x, 15, x + 9, 24, hex('#2e2e38'));
          g.oval(x + 2, 17, x + 7, 22, C.woodLight);
          g.line(x + 2, 19.5, x + 7, 19.5, C.wood);
          g.line(x + 4.5, 17, x + 4.5, 22, C.wood);
          g.rect(x + 4, 19, x + 5, 20, IRONY);
        },
        IRONY = C.steel;
      g.rect(8, 5, 26, 6, B); // roof
      for (const x of [9, 17, 25]) g.col(x, 6, 12, B);
      g.rect(7, 12, 30, 19, B); // body
      g.row(12, 7, 30, lite(B));
      g.rect(12, 13, 17, 18, hex('#2c2a36'));
      g.set(16, 15, BRASS);
      g.rect(10, 20, 34, 20, hex('#3a3846')); // running board
      g.rect(10, 8, 15, 11, P.NIGHT);
      if (r) g.pts([[11, 9], [13, 9]], P.EYE);
      else g.oval(18, 8, 21, 12, B); // the wheel, no driver
      if (!r) {
        g.rect(30, 11, 41, 19, B); // bonnet
        g.row(11, 30, 41, lite(B));
        g.rect(41, 10, 43, 19, hex('#3a3846')); // radiator
        for (let y = 11; y <= 18; y += 2) g.set(42, y, P.TOOTH);
        g.oval(39, 7, 42, 10, BRASS);
        g.set(41, 8, C.flameLight);
        for (const x of [32, 35, 38]) g.col(x, 13, 17, hex('#3a3846'));
      } else {
        g.poly([[30, 13], [43, 14], [43, 19], [30, 19]], B); // lower jaw
        g.poly([[30, 12], [29, 9], [41, -2], [44, 0], [33, 12]], B); // the bonnet thrown up
        g.poly([[31, 12], [41, 2], [42, 13]], P.MAW);
        for (let x = 32; x <= 42; x += 2) g.set(x, 13, P.TOOTH);
        for (let i = 0; i < 5; i++) g.set(33 + i * 2, 10 - i * 2, P.TOOTH);
        g.tent([[35, 12], [41, 15], [46, 21], [44, 24]], 1.7, P.GUM);
        g.oval(36, -4, 40, 0, BRASS);
        g.rect(37, -3, 39, -1, P.RED);
        g.pts([[2, 14], [0, 11], [3, 9], [1, 6]], C.ash); // exhaust
      }
      wheel(4);
      wheel(30);
      g.pts([[3, 16], [4, 17]], C.ash);
    },
    { L: 'long' },
  );

  /* 20 */
  mk('tome-biter', 'occult tome that bites book with teeth necronomicon eye on the cover small grimoire', 13, 10, (g, r) => {
    const L = hex('#4a3028');
    if (!r) {
      g.rect(1, 3, 11, 4, L);
      g.rect(2, 5, 11, 6, C.paper);
      g.rect(1, 7, 11, 8, dark(L));
      g.teeth(6, 3, 11, P.TOOTH, 2);
      g.orb(4, 2, 6, 4, K, { white: P.YEL });
      g.pts([[10, 3], [10, 8]], GOLD);
      g.col(0, 3, 8, L);
    } else {
      g.poly([[0, 2], [1, 2], [11, -5], [12, -4], [1, 5]], L);
      g.poly([[2, 3], [11, -3], [11, -1], [3, 4]], C.paper);
      g.rect(1, 7, 11, 8, dark(L));
      g.rect(2, 5, 11, 6, C.paper);
      g.poly([[3, 4], [11, 0], [11, 4]], P.MAW);
      for (let i = 0; i < 4; i++) g.set(5 + i * 2, 2 - i, P.TOOTH), g.set(4 + i * 2, 5, P.TOOTH);
      g.tent([[5, 4], [10, 3], [14, 6]], 0.9, C.red);
      g.orb(5, -3, 7, -1, P.RED, { white: P.YEL });
      for (const x of [2, 5, 8, 10]) g.set(x, 9, L);
    }
  });

  /* 21 */
  mk('hound-angles', 'hound of the angles lean blue thing from the corner sharp tongue tindalos smoke', 32, 20, (g, r) => {
    const H = hex('#3a4a6a'),
      L = hex('#6a7ea0'),
      D = hex('#232c44');
    const leg = (x, far, fwd) => {
      g.limb([[x, 10], [x - 3, 14], [x + (fwd ? 3 : 0), 18]], far ? D : H, 2);
      g.pts([[x + (fwd ? 4 : 1), 18], [x + (fwd ? 6 : 3), 18]], L);
    };
    leg(8, true);
    leg(21, true, r);
    g.poly([[2, 9], [8, 5], [22, 4], [26, 8], [20, 12], [9, 11]], H); // all angles
    g.poly([[9, 11], [20, 12], [14, 9]], D);
    for (const x of [9, 13, 17, 21]) g.poly([[x, 5], [x + 1, r ? 0 : 2], [x + 3, 5]], L);
    g.limb([[3, 9], [-1, 6], [-3, 9]], D);
    leg(5);
    leg(24, false, r);
    const hx = r ? 26 : 24,
      hy = r ? 1 : 5;
    g.poly([[hx - 2, hy + 3], [hx + 1, hy - 1], [hx + 8, hy + 3], [hx + 1, hy + 6]], H);
    g.poly([[hx + 1, hy - 1], [hx, hy - 4], [hx + 3, hy]], L);
    g.set(hx + 3, hy + 2, P.EYE);
    if (!r) g.limb([[hx + 7, hy + 4], [hx + 8, hy + 7]], hex('#a8d0e0'));
    else {
      g.poly([[hx + 1, hy + 5], [hx + 7, hy + 8], [hx, hy + 8]], H); // the jaw drops
      g.poly([[hx + 2, hy + 4], [hx + 7, hy + 4], [hx + 6, hy + 7], [hx + 2, hy + 6]], P.MAW);
      g.pts([[hx + 3, hy + 4], [hx + 5, hy + 4], [hx + 7, hy + 4], [hx + 4, hy + 7], [hx + 6, hy + 7]], C.white);
      g.limb([[hx + 4, hy + 6], [hx + 8, hy + 10], [hx + 7, hy + 15], [hx + 9, hy + 17]], hex('#a8d0e0'));
      g.set(hx + 3, hy + 2, P.RED);
    }
    g.pts([[1, 18], [12, 19], [15, 18], [28, 19]], hex('#5a6a8a')); // the smoke it comes in
  });

  /* 22 */
  mk(
    'yellow-king',
    'king in yellow tattered robe pallid mask crown carcosa tall stranger',
    24,
    48,
    (g, r) => {
      const Y = YROBE,
        D = hex('#7a6424'),
        cx = 11.5;
      const wd = r ? 9 : 0;
      g.poly([[7, 12], [16, 12], [19 + wd, 43], [4 - wd, 43]], Y);
      if (r)
        for (const v of [g, g.flip(23)]) {
          v.poly([[7, 13], [-8, 8], [-10, 28], [3, 32]], Y); // the robe opens like wings
          for (const [x, y] of [[-10, 29], [-6, 31], [-2, 33], [-9, 26]]) v.col(x, y, y + 3 + ((x * x) % 3), D);
        }
      else {
        g.rect(4, 14, 6, 34, Y);
        g.rect(17, 14, 19, 34, D);
        g.pts([[4, 35], [6, 36], [5, 37], [17, 35], [19, 37], [18, 36]], D);
      }
      for (const x of [9, 12, 15]) g.line(x, 14, x + (x - 12) * (r ? 1.4 : 0.6), 42, D);
      for (let x = 4 - wd; x <= 19 + wd; x++) if ((x * 5) % 7 < 3) g.clear(x, 43), g.clear(x, 42 - (x % 2));
      g.rect(7, 2, 16, 13, Y); // the cowl
      g.row(1, 8, 15, Y);
      g.col(7, 3, 12, lite(Y));
      for (const x of [8, 10, 12, 13, 15]) g.col(x, -2 + (x % 3 === 0 ? 1 : 0), 0, GOLD); // a crown, or something like one
      g.row(0, 8, 15, GOLD);
      if (!r) {
        g.oval(9, 3, 14, 11, C.white); // the pallid mask
        g.pts([[10, 6], [13, 6]], K);
        g.col(14, 5, 9, C.paper);
      } else {
        g.oval(9, 3, 14, 11, P.NIGHT);
        g.pts([[10, 5], [13, 6], [11, 8], [12, 4]], P.YEL);
        g.tent([[11, 10], [10, 15], [12, 19]], 0.9, TENC);
        g.tent([[12, 10], [14, 14], [13, 17]], 0.8, TENC);
        g.oval(-6, 16, -2, 23, C.white); // the mask, held out
        g.pts([[-5, 19], [-3, 19]], K);
        g.pts([[10, 24], [13, 24], [11.5, 26], [10, 28], [13, 28], [11.5, 22]], K); // the sign
      }
    },
    { L: 'tall' },
  );

  /* 23 */
  mk('bootleg-barrel', 'bootleg gin barrel on legs that bites rum runner cask teeth speakeasy', 16, 22, (g, r) => {
    const W = C.wood;
    for (const x of [5, 10]) {
      g.rect(x, 15, x + 1, 19, hex('#2a2832'));
      g.rect(x - 1, 19, x + 2, 20, C.white);
      g.row(20, x - 1, x + 2, K);
    }
    if (r)
      for (const v of [g, g.flip(16)]) {
        v.limb([[3, 8], [-1, 5], [-2, 10]], P.PALE, 2);
        v.fingers(-2, 11, 'd', P.PALE, 1);
      }
    g.ball(2, 1, 14, 16, W);
    g.rect(4, 1, 12, 16, W);
    for (const x of [5, 8, 11]) g.col(x, 1, 16, dark(W));
    g.col(3, 3, 14, lite(W));
    for (const y of [3, 14]) g.row(y, 3, 13, C.iron);
    if (!r) {
      g.row(8, 2, 14, C.iron);
      g.pts([[5, 10], [7, 12], [5, 12], [7, 10], [6, 11], [10, 10], [12, 12], [10, 12], [12, 10], [11, 11]], K); // XX
      g.oval(7, 5, 9, 7, K);
    } else {
      g.maw(3, 6, 13, 11, { step: 1 });
      g.tent([[8, 10], [9, 15], [7, 19]], 1.3, P.GUM);
      g.pts([[5, 4], [11, 4]], P.RED);
      g.pts([[12, 12], [13, 15], [12, 18]], hex('#b9c8c0')); // it leaks
    }
  });

  /* 24 */
  mk('newsboy-mouths', 'newsboy covered in mouths paper boy child cap shouting many mouths', 14, 25, (g, r) => {
    const b = g.at(-1, 1),
      mouth = (x, y, w2 = 2) => {
        b.rect(x, y, x + w2, y + 1, P.MAW);
        b.row(y, x, x + w2, P.TOOTH);
      };
    b.man({ skin: C.flesh, face: 'none', hat: ['cap', hex('#5a5448')], top: hex('#6a6a5a'), legs: hex('#4a4034'), tl: 7, ll: 6, arms: r ? 'out' : { l: 'down', r: 'hold' }, shoe: hex('#3a2a22') });
    b.rect(4, 5, 11, 5, hex('#3a342c')); // the peak hides the eyes
    b.line(5, 12, 10, 18, C.woodDark);
    if (!r) {
      b.rect(5, 15, 9, 19, C.paper); // the paper
      b.row(16, 6, 8, K);
      b.row(18, 6, 8, hex('#6a6456'));
      b.row(8, 5, 10, K);
      b.teeth(8, 5, 10, P.TOOTH, 2);
    } else {
      mouth(5, 7, 5);
      b.row(9, 5, 10, P.MAW);
      mouth(6, 14, 3);
      mouth(5, 17, 2);
      mouth(9, 20, 2);
      mouth(-4, 13, 1);
      mouth(18, 13, 1);
      mouth(4, 23, 2);
      b.pts([[13, 22], [15, 24], [12, 25]], C.paper);
    }
  });

  /* 25 */
  mk('telephone-ear', 'candlestick telephone with an ear and a mouth cord tentacle whispering small', 10, 17, (g, r) => {
    const B = hex('#23212b');
    if (r) for (const x of [1, 3, 6, 8]) g.col(x, 15, 16, P.PALE);
    g.rect(1, 13, 8, 15, B);
    g.row(13, 2, 7, lite(B));
    g.oval(3, 10, 6, 13, BRASS); // the dial
    g.rect(4, 4, 5, 12, B);
    g.col(4, 4, 11, lite(B));
    if (!r) {
      g.oval(3, 0, 7, 4, B);
      g.rect(4, 1, 6, 3, hex('#7a3040'));
      g.row(2, 4, 6, K);
      g.limb([[5, 6], [8, 6]], B);
      g.rect(8, 5, 9, 10, B);
      g.rect(8, 10, 9, 11, P.RAW); // the ear-piece
      g.limb([[8, 12], [9, 14]], hex('#4a3a34'));
    } else {
      g.oval(2, -2, 8, 4, B);
      g.maw(3, -1, 7, 3, { round: true, step: 1 });
      g.set(5, 2, P.GUM);
      g.tent([[5, 7], [10, 6], [12, 0], [10, -6]], 0.8, hex('#4a3a34'), null, 0.8);
      g.rect(8, -10, 11, -6, P.RAW);
      g.pts([[9, -9], [10, -8], [9, -7]], dark(P.RAW));
      g.set(8, -10, null);
      g.clear(8, -10);
    }
  });

  /* 26 */
  mk('seance-hands-ring', 'ring of seance hands joined at the wrists walking on fingers circle spider of hands small', 18, 12, (g, r) => {
    const up = r ? -4 : 0,
      H = P.PALE;
    for (const [x, dx] of [[2, -1], [5, 0], [12, 0], [15, 1]]) {
      g.limb([[8.5 + (x - 8.5) * 0.4, 5 + up], [x, 4 + up], [x + dx, 9]], x > 8 ? dark(H) : H, 2);
      g.fingers(x + dx, 9, 'd', H, 1);
      g.row(6 + up / 2, x, x + 1, C.white); // cuffs
    }
    if (r)
      for (const v of [g, g.flip(17)]) {
        v.limb([[6, 2 + up], [2, -2 + up], [1, -6 + up]], H, 2);
        v.fingers(1, -7 + up, 'u', H, 2);
      }
    g.oval(5, 2 + up, 12, 8 + up, H);
    g.pts([[6, 4 + up], [8, 3 + up], [10, 6 + up]], dark(H));
    if (!r) g.row(5, 7, 10, dark(H));
    else g.orb(7, 3 + up, 10, 6 + up, P.RED);
  });

  /* 27 */
  mk('asylum-straitjacket', 'asylum patient in a straitjacket whose head opens like a flower inmate madman', 16, 34, (g, r) => {
    const b = g.at(0, 1),
      CV = hex('#b9b294');
    b.man({ skin: P.ASHEN, face: r ? 'none' : 'hollow', head: !r, top: CV, legs: hex('#8a8672'), shoe: false, arms: 'none', hand: P.ASHEN });
    b.rect(3, 13, 12, 20, CV); // arms bound across
    b.row(16, 2, 13, dark(CV));
    b.row(18, 3, 12, dark(CV));
    for (const y of [14, 20]) b.row(y, 4, 11, C.woodDark), b.set(8, y, BRASS);
    b.rect(4, 31, 6, 31, P.ASHEN);
    b.rect(9, 31, 11, 31, P.ASHEN);
    b.col(3, 14, 19, lite(CV));
    if (r) {
      // five petals of a head
      b.rect(6, 9, 9, 12, P.ASHEN);
      for (const [x, y] of [[1, 2], [4, -3], [8, -5], [11, -3], [14, 2]]) {
        b.tent([[7.5, 9], [(x + 7.5) / 2, (y + 9) / 2 - 1], [x, y]], 1.6, P.ASHEN);
        b.set((x + 7.5) / 2 + 0.5, (y + 9) / 2, P.TOOTH);
        b.set((x * 3 + 7.5) / 4 + 0.5, (y * 3 + 9) / 4, P.TOOTH);
      }
      b.oval(5, 5, 10, 10, P.MAW);
      b.tent([[7.5, 8], [9, 14], [7, 20], [9, 24]], 1.1, P.GUM);
      b.pts([[2, 13], [13, 14], [1, 17]], C.woodDark); // straps burst
    }
  });

  /* 28 */
  mk('toad-god-sleeper', 'sleeping toad god squat furry idol come alive bat ears wide mouth tongue', 26, 20, (g, r) => {
    const F = hex('#4a4034'),
      D = dark(F),
      BL = hex('#7a6a50');
    for (const v of [g, g.flip(25)]) {
      v.poly([[6, 3], [3, -2], [9, 1]], D); // ears
      v.oval(1, 11, 8, 18, F); // haunches
      v.row(18, 0, 6, BL);
      v.pts([[0, 17], [2, 17]], BL);
      v.limb([[8, 9], [6, 13], [9, 15]], D, 2);
    }
    g.ball(4, 3, 21, 18, F);
    g.oval(8, 9, 17, 18, BL);
    g.speckle(4, 3, 21, 10, D, 5, 6);
    if (!r) {
      g.row(6, 7, 10, K);
      g.row(6, 15, 18, K);
      g.row(9, 6, 19, K);
      g.pts([[5, 8], [20, 8]], K);
    } else {
      g.oval(6, 4, 10, 7, P.YEL);
      g.oval(15, 4, 19, 7, P.YEL);
      g.row(5.5, 7, 9, K);
      g.row(5.5, 16, 18, K);
      g.maw(6, 9, 19, 14, { round: true });
      g.tent([[12.5, 12], [16, 18], [24, 16], [30, 10]], 1.6, P.GUM);
      g.oval(29, 7, 32, 10, hex('#9a4a5a'));
    }
  });

  /* 29 */
  mk('diver-suit-thing', 'diving suit with something else inside brass helmet tentacles from the faceplate harbour', 20, 36, (g, r) => {
    const b = g.at(2, 3),
      CV = hex('#8a7e5a');
    b.tent(r ? [[10, 2], [16, -2], [19, 6], [17, 14]] : [[10, 2], [15, 0], [17, 8], [16, 30]], 0.8, hex('#3a3440'), null, 0.8); // air hose
    b.man({ head: false, top: CV, legs: CV, shoe: C.ironDark, hand: hex('#6a6048'), arms: r ? 'reach' : 'down', belt: C.woodDark });
    b.rect(3, 30, 6, 32, C.ironDark);
    b.rect(9, 30, 12, 32, C.ironDark);
    b.rect(5, 14, 10, 17, C.iron); // chest weight
    b.rect(3, 11, 12, 13, BRASS); // corselet
    b.ball(3, 0, 12, 11, BRASS);
    b.oval(5, 3, 10, 9, GOLD);
    b.oval(6, 4, 9, 8, P.NIGHT);
    b.pts([[2, 5], [13, 5]], GOLD);
    b.set(4, 1, lite(GOLD));
    if (!r) b.set(8, 6, P.YEL);
    else {
      b.tent([[7, 6], [4, 12], [0, 15], [-3, 12]], 1.3, TENC, P.SUCK);
      b.tent([[8, 6], [11, 13], [16, 17]], 1.2, TENC, P.SUCK);
      b.tent([[7.5, 7], [8, 15], [6, 22]], 1.1, hex('#6a5070'));
      b.set(7, 5, P.YEL);
      b.pts([[5, 3], [10, 9], [9, 3]], C.glassLight);
      for (const v of [b, b.flip(15)]) v.tent([[-5, 19], [-8, 22], [-7, 26]], 0.9, TENC);
      b.pts([[6, 24], [9, 27], [7, 30]], hex('#6f93a8'));
    }
  });

  /* 30 */
  mk(
    'dhole-worm',
    'dhole great burrowing worm pale slimy ring of teeth bholes underworld',
    48,
    26,
    (g, r) => {
      const W = hex('#b4aa90'),
        D = hex('#847a64');
      const path = r ? [[2, 22], [10, 19], [18, 22], [26, 19], [31, 10], [30, -2], [34, -10]] : [[2, 22], [10, 18], [18, 21], [26, 14], [34, 13], [40, 18]];
      const pp = curve(path, 8);
      g.tube(pp, 2.5, 5.2, W, D);
      for (let i = 4; i < pp.length; i += 4) {
        const [x, y] = pp[i],
          [x2, y2] = pp[Math.min(pp.length - 1, i + 1)],
          rad = 2.5 + (2.7 * i) / pp.length,
          nx = -(y2 - y),
          ny = x2 - x,
          n = Math.hypot(nx, ny) || 1;
        g.line(x - (nx / n) * rad, y - (ny / n) * rad, x + (nx / n) * rad, y + (ny / n) * rad, D);
      }
      const [hx, hy] = path[path.length - 1];
      if (!r) {
        g.ball(hx - 4, hy - 5, hx + 5, hy + 5, W, { dark: D });
        g.oval(hx + 1, hy - 2, hx + 4, hy + 2, D);
        g.pts([[hx + 2, hy], [hx + 3, hy]], K);
      } else {
        g.ball(hx - 6, hy - 6, hx + 6, hy + 6, W, { dark: D });
        g.oval(hx - 4, hy - 4, hx + 4, hy + 4, P.MAW);
        for (let a = 0; a < 12; a++) g.set(hx + Math.cos(a * 0.524) * 4, hy + Math.sin(a * 0.524) * 4, P.TOOTH);
        for (let a = 0; a < 6; a++) g.set(hx + Math.cos(a * 1.05) * 2, hy + Math.sin(a * 1.05) * 2, P.TOOTH);
        g.set(hx, hy, P.GUM);
        g.pts([[36, 0], [37, 4], [35, 9]], hex('#c8d0b0')); // slime
      }
      g.pts([[6, 24], [14, 25], [22, 24]], hex('#c8d0b0'));
      g.row(25, 1, 20, D);
    },
    { L: 'long' },
  );

  /* 31 */
  mk('eye-stalk-puddle', 'eyes on stalks rising from a black puddle slime pool watching small', 16, 14, (g, r) => {
    const S = hex('#24262c');
    g.oval(0, 10, 15, 13, S);
    g.row(11, 3, 9, hex('#3e424c'));
    const st = r ? [[3, -2], [6, -8], [9, -4], [12, -9], [14, 1]] : [[3, 7], [7, 4], [11, 6]];
    for (const [x, y] of st) {
      g.tent([[x < 8 ? x + 1 : x - 1, 11], [x + (x % 2 ? 1 : -1), (y + 11) / 2], [x, y + 2]], 0.9, S, null, 0.8);
      g.orb(x - 1, y - 1, x + 1, y + 1, r ? P.RED : K, { white: EYEG });
      if (!r) g.row(y - 1, x - 1, x + 1, S); // lids half down
    }
    if (r) {
      g.rect(4, 11, 11, 12, P.MAW);
      g.teeth(11, 4, 11, P.TOOTH, 2);
    }
  });

  return out;
};
