/* The great house: what lives in the wallpaper, the servants' passages, the nursery and under the dust sheets. */
module.exports = (kit, T) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { P, maker, sub, curve, vd } = T;
  const out = {};
  const mk = maker(out, 'be-victorian', 'Victorian creatures', 'victorian-');
  const BRASS = C.brass,
    GILT = hex('#b08f3c'),
    LIV = hex('#3d5a44'),
    VELVET = hex('#6b2332'),
    LACE = hex('#d2c9ae'),
    MOTH = hex('#8a7a66');
  const candle = (g, x, y, big) => {
    g.col(x, y - 2, y, C.cream);
    g.set(x, y - 3, C.flame);
    g.set(x, y - 4, C.flameLight);
    if (big) g.pts([[x - 1, y - 4], [x + 1, y - 4], [x, y - 5], [x, y - 6]], C.flame), g.set(x, y - 5, C.flameLight);
  };

  /* 1 */
  mk(
    'wallpaper-lady',
    'lady in the wallpaper woman shape peeling paper pattern ghost green reaching',
    20,
    36,
    (g, r) => {
      const W = hex('#74866a'),
        D = dark(W);
      g.poly([[7, 12], [12, 12], [17, 34], [2, 34]], W);
      g.rect(4, 12, 15, 14, W);
      g.oval(6, 2, 13, 10, W);
      g.rect(8, 10, 11, 12, W);
      if (!r) {
        g.rect(3, 13, 4, 25, W);
        g.rect(15, 13, 16, 25, W);
      }
      for (let y = 3, n = 0; y < 34; y += 5, n++)
        for (let x = 3 + (n % 2) * 3; x < 18; x += 6) if (g.get(x, y) && g.get(x - 1, y + 1) && g.get(x + 1, y + 1) && g.get(x, y + 2)) g.pts([[x, y], [x - 1, y + 1], [x + 1, y + 1], [x, y + 2]], D);
      for (const x of [5, 10, 15]) for (let y = 13; y < 34; y += 2) if (g.get(x, y) === W) g.set(x, y, lite(W));
      g.pts([[2, 34], [3, 33], [17, 33], [16, 31], [4, 12], [15, 13], [6, 3], [13, 4]], C.paper);
      if (!r) {
        g.rect(7, 5, 8, 6, vd(W));
        g.rect(11, 5, 12, 6, vd(W));
        g.row(8, 9, 10, vd(W));
      } else {
        g.rect(7, 5, 8, 6, K);
        g.rect(11, 5, 12, 6, K);
        g.pts([[8, 5], [12, 5]], P.EYE);
        g.maw(8, 8, 11, 10, { step: 3 });
        // paper arms tear loose and reach
        g.limb([[4, 13], [0, 18], [-3, 15]], W, 2);
        g.limb([[15, 13], [19, 18], [22, 14]], W, 2);
        g.fingers(-4, 14, 'u', C.paper, 2);
        g.fingers(22, 12, 'u', C.paper, 2);
        g.limb([[6, 2], [4, 0], [2, 1]], C.paper);
        g.limb([[13, 3], [16, 1], [17, 3]], C.paper);
        g.limb([[2, 30], [0, 32], [-2, 31]], C.paper);
      }
    },
    { u: [30, 37, 5] },
  );

  /* 2 */
  mk(
    'butler-halved',
    'butler with no lower half torso walking on hands tailcoat spine servant ghost',
    22,
    27,
    (g, r) => {
      const lift = r ? 9 : 0,
        b = g.at(3, 2 - lift),
        BL = C.black;
      // the spine and rags that hang where the legs were
      b.col(7, 20, 23 + (r ? 4 : 0), P.BONE);
      b.col(8, 20, 22 + (r ? 5 : 0), dark(P.BONE));
      for (let y = 21; y < 23 + (r ? 5 : 0); y += 2) b.pts([[6, y], [9, y]], P.BONE);
      b.pts([[4, 20], [5, 21], [11, 20], [10, 21], [3, 21], [12, 21]], BL);
      b.man({ skin: P.PALE, face: r ? 'maw' : 'old', eye: r ? P.EYE : K, hair: ['thin', C.ash], top: BL, ll: 0, tl: 8, shirt: C.white, tie: BL, arms: r ? 'none' : 'down', hand: C.white });
      if (r) {
        // up on arms far too long
        for (const s of [0, 1]) {
          const v = s ? b.flip(15) : b;
          v.limb([[2, 13], [-1, 19], [1, 30]], BL, 2);
          v.rect(0, 31, 2, 32, C.white);
          v.fingers(1, 32, 'd', C.white, 1);
        }
      } else {
        g.pts([[2, 24], [6, 24], [15, 24], [19, 24]], C.white);
      }
      // the tray he still carries on his head
      const t = b.at(0, r ? -1 : 0);
      t.row(1, 3, 12, C.steel);
      t.oval(5, -3 + (r ? -2 : 0), 10, 0 + (r ? -2 : 0), C.steel);
      t.set(6, -2 + (r ? -2 : 0), C.white);
      if (r) t.orb(6, -1, 9, 0, P.RED);
    },
    { u: [24, 38, 1] },
  );

  /* 3 */
  mk(
    'chandelier-spider',
    'chandelier spider crystal brass candles legs fallen crawling monster',
    46,
    28,
    (g, r) => {
      const cx = 22.5,
        by = r ? -3 : 0;
      for (const s of [-1, 1])
        for (let i = 3; i >= 0; i--) {
          const kx = cx + s * (5 + 4.4 * i + (r ? i * 0.8 : 0)),
            ky = 8 + i * 2 + by - (r ? 3 : 0),
            fx = cx + s * (6 + 4.9 * i + (r && i === 3 ? 1.5 : 0)),
            fy = r && i === 0 ? 14 : 26;
          g.limb([[cx + s * 3, 13 + i + by], [kx, ky], [fx, fy]], s > 0 ? dark(BRASS) : BRASS, 2);
          g.rect(kx - 1, ky - 1, kx + 1, ky - 1, GILT);
          candle(g, kx, ky - 2, r);
        }
      g.col(22, 1 + by, 9 + by, C.ironDark);
      g.col(23, 2 + by, 9 + by, C.ironDark);
      g.ball(18, 8 + by, 27, 18 + by, BRASS);
      g.row(12 + by, 17, 28, GILT);
      for (const [x, n] of [[18, 2], [20, 4], [22, 6], [24, 5], [26, 3]]) {
        g.col(x, 19 + by, 18 + by + n, C.glassLight);
        g.set(x, 19 + by + n, C.glass);
      }
      if (!r) g.pts([[20, 10], [22, 10], [24, 10], [21, 14], [23, 14], [25, 14]], C.glassLight);
      else {
        g.pts([[20, 6], [22, 6], [24, 6], [26, 7], [19, 7]], P.RED);
        g.maw(19, 10, 26, 15, { teeth: C.glassLight, round: true });
      }
    },
    { L: 'long', u: [48, 34, 1] },
  );

  /* 4 */
  mk(
    'ectoplasm-medium',
    'seance ectoplasm figure rising from a medium mouth pale ghost spirit column',
    26,
    48,
    (g, r) => {
      const E = hex('#c9d2bc'),
        ED = hex('#8f9a88');
      // the medium, kneeling, head thrown back
      g.poly([[9, 38], [16, 38], [20, 46], [5, 46]], C.black);
      g.rect(8, 36, 17, 40, C.black);
      g.col(8, 37, 45, lite(C.black));
      g.rect(10, 30, 15, 35, P.PALE);
      g.row(30, 10, 15, hex('#4a3a34'));
      g.pts([[10, 31], [15, 31], [10, 32], [15, 32]], hex('#4a3a34'));
      g.pts([[11, 32], [14, 32]], r ? P.EYE : K);
      g.rect(12, 33, 13, 35, ED);
      // what comes out of her
      g.tube(curve([[12.5, 33], [10, 28], [14, 23], [12, 18]], 6), 1.6, 3.4, E, ED);
      g.ball(6, 9, 19, 21, E, { dark: ED });
      g.ball(9, 1, 16, 10, E, { dark: ED });
      if (!r) {
        g.tent([[7, 12], [4, 15], [4, 19]], 1.6, E);
        g.tent([[18, 12], [21, 15], [21, 19]], 1.6, E);
        g.pts([[11, 5], [14, 5]], ED);
        g.row(7, 12, 13, ED);
      } else {
        g.tent([[7, 12], [1, 15], [-2, 23], [0, 31]], 2, E);
        g.tent([[18, 12], [24, 16], [27, 24], [25, 33]], 2, E);
        g.fingers(0, 31, 'd', E, 3);
        g.fingers(25, 33, 'd', E, 3);
        g.rect(10, 4, 11, 5, K);
        g.rect(14, 4, 15, 5, K);
        g.rect(11, 7, 14, 10, K);
        g.pts([[11, 7], [14, 7]], E);
        // more faces come up in it
        for (const [x, y] of [[8, 13], [14, 15], [10, 18]]) {
          g.pts([[x, y], [x + 2, y]], K);
          g.row(y + 2, x, x + 2, ED);
          g.set(x + 1, y + 2, K);
        }
      }
    },
    { L: 'tall', u: [32, 48, 3] },
  );

  /* 5 */
  mk(
    'portrait-leaner',
    'portrait that leans out of its frame painting gilt gentleman long neck haunted picture',
    20,
    28,
    (g, r) => {
      g.box(2, 2, 17, 26, GILT);
      g.frame(3, 3, 16, 25, dark(GILT));
      g.rect(4, 4, 15, 24, hex('#2e2a2a'));
      g.rect(4, 4, 15, 9, hex('#3a3430'));
      // the sitter
      g.poly([[6, 17], [13, 17], [15, 24], [4, 24]], hex('#1e1b24'));
      g.rect(9, 16, 10, 20, C.white);
      if (!r) {
        g.oval(7, 8, 12, 15, P.PALE);
        g.row(8, 8, 11, hex('#3a2a22'));
        g.pts([[8, 11], [11, 11]], K);
        g.row(13, 9, 10, vd(P.PALE));
        g.pts([[5, 25], [6, 25], [13, 25], [14, 25]], P.PALE); // fingertips over the frame
      } else {
        g.tube(curve([[9.5, 16], [11, 10], [18, 6], [23, 9]], 6), 1.6, 1.6, P.PALE);
        g.oval(21, 6, 27, 14, P.PALE);
        g.row(6, 22, 26, hex('#3a2a22'));
        g.pts([[23, 9], [26, 9]], P.EYE);
        g.maw(23, 11, 26, 13);
        g.limb([[5, 19], [1, 22], [-2, 27]], hex('#1e1b24'), 2);
        g.fingers(-2, 26, 'd', P.PALE, 2);
        g.limb([[14, 19], [18, 21], [20, 27]], hex('#1e1b24'), 2);
        g.fingers(20, 26, 'd', P.PALE, 2);
      }
    },
    { u: [34, 30, 5] },
  );

  /* 6 */
  mk(
    'stag-upright',
    'taxidermy stag walking upright trophy head antlers stitched hide hooves sawdust',
    30,
    48,
    (g, r) => {
      const F = hex('#7a5a3c'),
        A = hex('#b8a070'),
        cx = 14.5;
      for (const s of [-1, 1]) {
        const w = r ? 1.35 : 1;
        g.limb([[cx + s * 2, 9], [cx + s * 5 * w, 5], [cx + s * 8 * w, 1]], A, 2);
        g.limb([[cx + s * 4 * w, 6], [cx + s * 3 * w, 2]], A);
        g.limb([[cx + s * 6 * w, 4], [cx + s * 10 * w, 4]], A);
        g.limb([[cx + s * 7 * w, 2], [cx + s * 11 * w, 1]], A);
      }
      g.oval(7, 17, 22, 26, C.wood); // the shield it was mounted on
      g.oval(9, 18, 20, 25, C.woodLight);
      // legs and arms: hide over wire
      const arm = (s) => {
        const v = s > 0 ? g.flip(29) : g;
        if (!r) v.limb([[10, 26], [6, 32], [7, 40]], F, 2);
        else v.limb([[10, 26], [3, 25], [-2, 18]], F, 2);
        if (!r) v.rect(6, 41, 8, 42, K);
        else v.rect(-3, 15, -1, 17, K);
      };
      arm(-1);
      arm(1);
      for (const v of [g, g.flip(29)]) {
        v.limb([[12, 35], [10, 40], [12, 43], [11, 45]], F, 2);
        v.rect(10, 45, 13, 46, K);
      }
      g.rect(11, 24, 18, 36, F);
      g.col(11, 25, 35, lite(F));
      for (let y = 26; y < 36; y += 2) g.set(r ? 13 : 15, y, C.cream);
      g.ribs(12, 13, 28, 3, dark(F), 3);
      g.ribs(16, 17, 28, 3, dark(F), 3);
      g.rect(12, 14, 17, 23, F); // neck
      g.col(17, 15, 23, dark(F));
      g.oval(10, 8, 19, 15, F);
      g.rect(12, 13, 17, 19, F);
      g.rect(13, 18, 16, 19, P.NIGHT);
      g.poly([[7, 9], [10, 10], [10, 12]], F);
      g.poly([[22, 9], [19, 10], [19, 12]], dark(F));
      g.row(8, 12, 16, lite(F));
      g.pts([[11, 11], [18, 11]], r ? P.RED : hex('#c08a2c'));
      g.pts([[11, 10], [18, 10]], K);
      if (r) {
        g.maw(12, 15, 17, 19);
        g.rect(14, 26, 15, 35, P.NIGHT); // the seam bursts
        g.pts([[14, 36], [15, 38], [13, 39], [16, 41], [14, 43], [15, 45]], C.straw);
        g.pts([[13, 27], [16, 29], [13, 31], [16, 33]], C.cream);
      }
    },
    { L: 'tall', u: [38, 48, 4] },
  );

  /* 7 */
  mk(
    'governess-porcelain',
    'nursery governess with a porcelain face cracked china woman cane black dress',
    18,
    36,
    (g, r) => {
      const b = g.at(1, 1);
      b.man({
        skin: P.PORC,
        face: 'none',
        hair: ['bun', hex('#3a2a22')],
        top: hex('#23212b'),
        robe: hex('#23212b'),
        wide: 1,
        tl: 10,
        ll: 12,
        hand: P.PORC,
        arms: r ? { l: 'up', r: 'reach' } : { l: 'down', r: 'hold' },
      });
      b.row(12, 6, 9, C.white);
      b.set(7, 13, hex('#7a8aa0'));
      if (!r) {
        b.pts([[6, 6], [9, 6]], K);
        b.pts([[7, 9], [8, 9]], hex('#a8544c'));
        b.pts([[5, 8], [10, 8]], hex('#d0a8a0'));
        b.line(9, 3, 11, 6, hex('#7a766c'));
        b.col(10, 17, 30, C.woodLight); // the cane held ready
      } else {
        // half the face has fallen in
        b.rect(7, 4, 11, 10, P.NIGHT);
        b.pts([[7, 4], [8, 5], [7, 7], [8, 9], [7, 10]], P.PORC);
        b.set(9, 6, P.RED);
        b.teeth(9, 8, 11);
        b.set(5, 6, K);
        b.set(5, 9, hex('#a8544c'));
        b.col(-1, -6, 1, C.woodLight);
        b.pts([[13, 33], [14, 34], [12, 34]], P.PORC); // shards
      }
    },
    { u: [26, 40, 5] },
  );

  /* 8 */
  mk(
    'dumbwaiter-thing',
    'dumb waiter thing in the hatch service lift box long pale arms eyes servant shaft',
    20,
    26,
    (g, r) => {
      g.col(9, 1, 3, C.straw);
      g.col(10, 1, 3, dark(C.straw));
      g.box(2, 3, 17, 24, C.wood);
      g.rect(4, 5, 15, 21, P.NIGHT);
      g.row(13, 4, 15, C.woodDark); // the shelf
      g.row(22, 3, 16, C.woodLight);
      if (!r) {
        g.pts([[7, 9], [10, 9]], P.EYE);
        g.oval(6, 15, 13, 20, C.steel); // a covered dish
        g.set(9, 14, C.steel);
        g.set(7, 16, C.white);
        g.pts([[5, 21], [6, 21], [13, 21], [14, 21]], P.PALE);
      } else {
        g.pts([[6, 7], [9, 6], [12, 8], [13, 11], [5, 10]], P.EYE);
        g.oval(6, 14, 13, 21, P.PALE);
        g.pts([[8, 16], [11, 16]], K);
        g.maw(7, 18, 12, 20);
        for (const v of [g, g.flip(19)]) {
          v.limb([[4, 12], [-2, 6], [-5, 17], [-4, 23]], P.PALE, 2);
          v.fingers(-4, 22, 'd', P.PALE, 2);
        }
      }
    },
    { u: [34, 26, 7] },
  );

  /* 9 */
  mk(
    'dinner-party-fused',
    'dinner party fused at the table guests grown together heads arms tablecloth many',
    48,
    30,
    (g, r) => {
      const lift = r ? 7 : 0,
        t = g.at(0, -lift),
        cols = [C.black, VELVET, C.black, C.plum, C.black],
        hairs = [hex('#3a2a22'), hex('#8c6240'), C.ash, hex('#2a2228'), hex('#6b4630')];
      // what holds it up
      if (!r) {
        g.rect(6, 22, 7, 28, C.woodDark);
        g.rect(40, 22, 41, 28, C.woodDark);
      } else {
        for (const [x, kx, fx] of [[8, 4, 3], [15, 12, 9], [21, 22, 19], [27, 28, 30], [33, 37, 39], [40, 44, 44]]) {
          g.limb([[x, 16], [kx, 21], [fx, 26]], P.PALE, 2);
          g.fingers(fx, 27, 'd', P.PALE, 1);
        }
      }
      // one band of shoulders, five heads
      t.rect(4, 9, 43, 16, C.black);
      for (let i = 0; i < 5; i++) {
        const x = 4 + i * 8;
        t.rect(x, 9, x + 7, 16, cols[i]);
        t.col(x + 7, 10, 16, dark(cols[i]));
        if (i % 2 === 0) t.rect(x + 3, 9, x + 4, 14, C.white);
      }
      t.rect(6, 4, 41, 7, P.PALE); // flesh runs from cheek to cheek
      for (let i = 0; i < 5; i++) {
        const x = 5 + i * 8,
          y = i % 2 ? 1 : 2;
        t.oval(x, y, x + 5, y + 7, P.PALE);
        t.row(y, x + 1, x + 4, hairs[i]);
        t.row(y + 1, x, x + 5, hairs[i]);
        if (i % 2) t.col(x, y + 1, y + 5, hairs[i]), t.col(x + 5, y + 1, y + 5, dark(hairs[i]));
        if (!r) {
          t.pts([[x + 1, y + 3], [x + 4, y + 3]], K);
          t.row(y + 5, x + 2, x + 3, vd(P.PALE));
        } else {
          t.pts([[x + 1, y + 3], [x + 4, y + 3]], P.EYE);
          t.rect(x + 2, y + 5, x + 3, y + 7, K);
        }
      }
      t.pts([[11, 5], [19, 6], [27, 5], [35, 6]], dark(P.PALE));
      // the table
      t.rect(3, 15, 44, 16, C.white);
      t.rect(4, 17, 43, 22, C.paper);
      for (let x = 4; x <= 43; x++) if (x % 4 < 2) t.set(x, 23, C.paper);
      for (const x of [9, 17, 25, 33, 39]) t.col(x, 18, 22, dark(C.paper));
      // arms grown into the cloth, plates, candles
      for (const x of [7, 15, 23, 31, 39]) {
        t.rect(x, 13, x + 2, 14, P.PALE);
        t.set(x + 1, 15, P.PALE);
      }
      for (const x of [12, 28]) t.rect(x, 14, x + 3, 14, C.steel);
      candle(t, 20, 14, r);
      candle(t, 36, 14, r);
    },
    { L: 'long', u: [48, 37] },
  );

  /* 10 */
  mk(
    'gaslight-wisp',
    'gaslight will o the wisp gas flame ghost floating blue fire face',
    10,
    18,
    (g, r) => {
      const B = hex('#5d86a0'),
        Y = C.glow;
      if (!r) {
        g.oval(2, 4, 7, 11, B);
        g.oval(3, 2, 6, 8, Y);
        g.pts([[4, 1], [5, 1]], Y);
        g.rect(4, 4, 5, 6, C.white);
        g.pts([[3, 6], [6, 6]], K);
        g.set(4, 9, K);
      } else {
        g.oval(0, 2, 9, 12, B);
        g.oval(1, -2, 8, 9, Y);
        g.pts([[3, -4], [4, -5], [5, -3], [6, -4], [-1, 5], [-2, 3], [10, 5], [11, 2]], Y);
        g.rect(3, 0, 6, 5, C.white);
        g.rect(2, 2, 3, 4, K);
        g.rect(6, 2, 7, 4, K);
        g.rect(3, 7, 6, 9, K);
        g.teeth(7, 3, 6, C.white);
      }
      g.rect(4, 12, 5, 13, BRASS); // the burner it left with
      g.fin(hex('#2a3a4a'));
      g.shadow(16, 2, 7);
      return false;
    },
    { u: [16, 24, 3] },
  );

  /* 11 */
  mk(
    'cameo-crab',
    'cameo brooch crab jewel profile gold legs small scuttling',
    14,
    10,
    (g, r) => {
      const up = r ? -2 : 0;
      for (const v of [g, g.flip(13)]) {
        v.limb([[3, 4 + up], [1, 5 + up], [1, 8]], GILT);
        v.limb([[4, 6 + up], [2, 7 + up], [3, 8]], GILT);
        if (r) {
          v.limb([[3, 2 + up], [0, 0 + up], [0, -3 + up]], GILT);
          v.pts([[-1, -4 + up], [1, -4 + up], [0, -4 + up]], GILT);
          v.clear(0, -4 + up);
        } else v.limb([[4, 3], [2, 2], [1, 3]], GILT);
      }
      g.oval(3, 1 + up, 10, 7 + up, GILT);
      g.oval(4, 2 + up, 9, 6 + up, hex('#5d6f86'));
      if (!r) g.pts([[6, 2], [7, 2], [6, 3], [7, 3], [8, 3], [6, 4], [7, 4], [6, 5], [7, 5], [5, 6], [6, 6]], C.white);
      else {
        g.rect(5, 0, 8, 2, C.white);
        g.pts([[6, 3], [7, 3], [5, 1]], C.white);
        g.pts([[6, 1], [8, 1]], K);
        g.pts([[5, 3], [8, 3]], P.RED);
      }
    },
    { u: [16, 15, 1] },
  );

  /* 12 */
  mk(
    'veil-wraith',
    'mourning veil wraith widow in black crape ghost skull under the veil',
    18,
    38,
    (g, r) => {
      const b = g.at(1, 2),
        V = P.VEIL;
      b.man({ skin: P.PALE, face: r ? 'skull' : 'hollow', top: V, robe: V, wide: 1, tl: 11, ll: 13, hand: r ? P.BONE : V, arms: r ? 'reach' : 'hold', neck: false });
      if (!r) {
        // the veil hangs over the face and down to the waist
        b.poly([[5, 0], [10, 0], [13, 4], [14, 20], [1, 20], [2, 4]], V);
        b.rect(5, 4, 10, 10, hex('#4a464e'));
        b.row(11, 6, 9, hex('#4a464e'));
        b.rect(6, 6, 6, 7, K);
        b.rect(9, 6, 9, 7, K);
        b.col(2, 5, 19, lite(V));
        for (const x of [2, 5, 9, 12]) b.set(x, 21, V);
        b.rect(6, 17, 9, 18, C.white); // a black-edged handkerchief
        b.row(19, 6, 9, K);
      } else {
        b.poly([[5, -1], [12, -1], [17, 4], [16, 12], [12, 3], [3, 3], [3, 1]], V);
        b.pts([[17, 13], [15, 14]], V);
        b.rect(6, 10, 9, 14, P.NIGHT); // the jaw hangs open
        b.row(14, 6, 9, P.BONE);
        b.teeth(13, 6, 9);
        b.pts([[6, 6], [9, 6]], P.RED);
      }
      b.ragged(35, 3, 7);
    },
    { u: [24, 39, 6] },
  );

  /* 13 */
  mk(
    'clock-walker',
    'grandfather clock that walks long case face in the dial pendulum tongue',
    20,
    48,
    (g, r) => {
      const W = hex('#5a3a28');
      for (const x of [5, 12]) {
        g.rect(x, 40, x + 1, 45, P.BONE);
        g.rect(x - 1, 45, x + 2, 46, P.BONE);
      }
      g.box(3, 33, 16, 41, W); // base
      g.box(5, 15, 14, 33, W); // trunk
      g.box(3, 3, 16, 15, W); // hood
      g.row(2, 5, 14, W);
      g.row(1, 8, 11, W);
      g.oval(5, 4, 14, 13, C.cream);
      g.pts([[9, 5], [13, 8], [9, 12], [6, 8]], dark(C.cream));
      if (!r) {
        g.rect(7, 18, 12, 30, C.woodDark);
        g.col(9, 18, 27, BRASS);
        g.oval(8, 26, 11, 29, GILT);
        g.pts([[7, 7], [12, 7]], K);
        g.line(9, 9, 9, 6, K);
        g.line(9, 9, 12, 10, K);
      } else {
        g.rect(7, 18, 12, 30, P.NIGHT);
        g.ribs(7, 12, 19, 4, P.BONE);
        g.col(9, 18, 26, P.NIGHT);
        g.box(1, 16, 4, 31, C.woodLight); // the door swung wide
        g.tube(curve([[9.5, 26], [10, 34], [13, 40], [17, 42]], 5), 1.4, 1.4, P.GUM);
        g.oval(16, 40, 19, 43, GILT);
        g.rect(6, 6, 8, 8, K);
        g.rect(11, 6, 13, 8, K);
        g.pts([[7, 7], [12, 7]], P.RED);
        g.maw(6, 10, 13, 12);
        for (const v of [g, g.flip(19)]) {
          v.limb([[4, 17], [-1, 13], [-3, 22], [-2, 28]], W, 1);
          v.fingers(-2, 28, 'd', P.BONE, 2);
        }
      }
    },
    { L: 'tall', u: [28, 48, 4] },
  );

  /* 14 */
  mk(
    'crinoline-crawler',
    'crinoline skirt that crawls on many legs hoop cage boots no body woman folded',
    44,
    26,
    (g, r) => {
      const S = hex('#5a4460'),
        ST = hex('#2a2630');
      for (let i = 0; i < 8; i++) {
        const x = 5 + i * 5,
          bend = i % 2 ? 1 : -1;
        g.limb([[x, 16], [x + bend, 20], [x, 23]], ST, 2);
        g.rect(x - 1, 23, x + 2, 24, K);
      }
      g.poly([[18, 4], [25, 4], [40, 14], [42, 18], [1, 18], [3, 14]], S);
      for (const [y, a, b] of [[8, 13, 30], [12, 6, 37], [16, 2, 41]]) g.row(y, a, b, C.steel);
      for (const x of [9, 16, 22, 28, 35]) g.line(21.5 + (x - 22) * 0.2, 4, x, 18, dark(S));
      g.clearRect(27, 13, 30, 15);
      g.rect(27, 13, 30, 15, P.NIGHT); // a tear, and the cage behind it
      g.row(12, 27, 30, C.steel);
      g.row(16, 27, 30, C.steel);
      g.rect(19, 2, 24, 4, C.cream); // the waist of a corset
      if (!r) {
        g.rect(21, 1, 22, 1, P.BONE);
        g.set(28, 14, P.EYE);
      } else {
        // she unfolds out of the waist, backwards
        g.tube(curve([[21.5, 2], [20, -4], [22, -9]], 5), 2.4, 2, C.cream);
        g.ribs(19, 23, -6, 3, dark(C.cream));
        g.tube(curve([[22, -10], [24, -13], [23, -16]], 4), 1, 1, P.PALE);
        g.oval(20, -22, 26, -15, P.PALE);
        g.hairs([[20, -22, 9, -1], [21, -23, 5], [26, -22, 10, 1], [25, -23, 4]], hex('#2a2228'));
        g.row(-22, 21, 25, hex('#2a2228'));
        g.pts([[22, -19], [25, -19]], K);
        g.maw(22, -17, 24, -16);
        g.limb([[19, -8], [12, -4], [8, 5]], P.PALE, 2);
        g.limb([[24, -8], [31, -5], [36, 4]], dark(P.PALE), 2);
        g.fingers(8, 5, 'd', P.PALE, 2);
        g.fingers(36, 4, 'd', P.PALE, 2);
        g.pts([[28, 14], [29, 13], [29, 15]], P.EYE);
      }
    },
    { L: 'long', u: [44, 50] },
  );

  /* 15 */
  mk(
    'pram-thing',
    'perambulator baby carriage thing inside long neck baby head many arms pram',
    24,
    24,
    (g, r) => {
      const B = hex('#26242e');
      for (const x of [4, 14]) {
        g.oval(x, 16, x + 6, 22, C.ironDark);
        g.oval(x + 1, 17, x + 5, 21, null);
        g.clearRect(x + 2, 18, x + 4, 20);
        g.line(x + 1, 17, x + 5, 21, C.ironDark);
        g.line(x + 5, 17, x + 1, 21, C.ironDark);
      }
      g.oval(3, 8, 20, 18, B);
      g.clearRect(3, 8, 20, 10);
      g.rect(4, 11, 19, 11, lite(B));
      if (!r) g.poly([[3, 11], [3, 6], [6, 3], [10, 3], [12, 11]], B);
      else g.poly([[3, 11], [1, 8], [2, 5], [5, 4], [7, 11]], B);
      g.line(19, 11, 22, 6, C.steel);
      g.set(22, 5, C.steel);
      g.row(14, 5, 18, hex('#4a4656'));
      if (!r) {
        g.rect(5, 6, 9, 9, P.NIGHT);
        g.pts([[6, 7], [8, 7]], P.EYE);
        g.pts([[14, 10], [15, 10], [16, 10]], P.PALE);
      } else {
        g.tube(curve([[12, 10], [10, 3], [14, -3], [13, -8]], 5), 1.8, 1.4, P.PALE);
        g.oval(9, -16, 18, -7, P.PALE);
        g.rect(11, -13, 12, -11, K);
        g.rect(15, -13, 16, -11, K);
        g.maw(11, -10, 16, -8, { step: 1 });
        for (const [x, dx] of [[6, -4], [9, -3], [16, 3], [18, 5]]) {
          g.limb([[x, 10], [x + dx, 6], [x + dx * 1.5, 9]], P.PALE);
          g.set(x + dx * 1.5, 10, P.PALE);
        }
      }
    },
    { u: [26, 42, 1] },
  );

  /* 16 */
  mk(
    'twin-maids-joined',
    'twin maids joined at the shoulder two housemaids fused aprons one body split',
    28,
    36,
    (g, r) => {
      const D = hex('#26242e'),
        gap = r ? 2 : 0,
        o = (l) => ({
          skin: P.PALE,
          face: r ? 'none' : 'hollow',
          hair: ['bun', l ? hex('#6b4630') : hex('#3a2a22')],
          top: D,
          robe: D,
          tl: 10,
          ll: 12,
          apron: C.white,
          arms: l ? { l: r ? 'reach' : 'down', r: 'none' } : { l: 'none', r: r ? 'reach' : 'down' },
        });
      const a = g.at(2 - gap, 1),
        b = g.at(10 + gap, 1);
      a.man(o(true));
      b.man(o(false));
      for (const v of [a, b]) v.rect(5, 1, 10, 2, C.white); // caps
      if (!r) {
        g.rect(12, 6, 15, 10, P.PALE); // cheek grown to cheek
        g.rect(12, 13, 15, 22, D);
        g.pts([[13, 8], [14, 7]], dark(P.PALE));
      } else {
        for (const v of [a, b]) v.pts([[6, 6], [9, 6]], P.EYE), v.rect(7, 8, 8, 10, K);
        // the seam between them opens from crown to waist
        g.rect(12, 4, 15, 24, P.MAW);
        for (let y = 5; y <= 23; y += 2) g.pts([[12, y], [15, y + 1]], P.TOOTH);
        g.col(13, 9, 21, P.GUM);
        g.col(14, 12, 26, P.GUM);
      }
    },
    { u: [38, 36, 5] },
  );

  /* 17 */
  mk(
    'footman-long',
    'footman stretched far too tall livery powdered wig long arms servant jaw',
    18,
    48,
    (g, r) => {
      const b = g.at(1, 1);
      b.man({
        skin: P.PALE,
        face: r ? 'none' : 'stare',
        hair: ['crop', C.white],
        top: LIV,
        legs: C.cream,
        shoe: C.black,
        tl: 14,
        ll: 20,
        shirt: C.white,
        arms: r ? 'out' : 'long',
        hand: C.white,
      });
      b.pts([[3, 5], [3, 7], [12, 5], [12, 7]], C.white); // side curls
      b.pts([[6, 16], [6, 19], [6, 22], [9, 16], [9, 19], [9, 22]], GILT);
      b.row(34, 4, 11, GILT);
      if (r) {
        b.pts([[6, 6], [9, 6]], K);
        b.pts([[6, 5], [9, 5]], C.white);
        b.rect(5, 8, 10, 21, P.MAW); // the jaw comes down to the waistcoat
        b.teeth(8, 5, 10);
        b.teeth(21, 6, 10);
        b.col(7, 12, 24, P.GUM);
        b.col(8, 12, 26, P.GUM);
        b.rect(5, 22, 10, 23, P.PALE);
      }
    },
    { L: 'tall', u: [28, 48, 5] },
  );

  /* 18 */
  mk(
    'glove-crawler',
    'white glove hand crawling servant bell hand severed small spider eye in the palm',
    12,
    9,
    (g, r) => {
      const W = hex('#d8d4c4');
      if (!r) {
        g.rect(3, 2, 8, 5, W);
        g.rect(8, 3, 10, 4, W);
        g.set(10, 3, C.wine);
        for (const x of [2, 4, 6, 8]) g.col(x, 5, 7, W);
        g.pts([[1, 4], [1, 5], [1, 6]], W);
        g.set(6, 3, BRASS);
        g.row(5, 3, 8, dark(W));
      } else {
        g.rect(3, -2, 8, 4, W);
        g.rect(4, 5, 7, 7, W);
        g.row(6, 4, 7, C.wine);
        for (const x of [3, 5, 7, 8]) g.col(x, -6 + (x % 3), -3, W);
        g.pts([[2, -1], [1, -2], [1, -3], [9, 0], [10, -1]], W);
        g.orb(4, -1, 7, 2, P.RED);
      }
    },
    { u: [12, 16] },
  );

  /* 19 */
  mk(
    'doll-heads-cluster',
    'cluster of porcelain doll heads on spider legs nursery cracked china small',
    16,
    14,
    (g, r) => {
      const L = hex('#3a3440');
      for (const v of [g, g.flip(15)]) {
        v.limb([[4, 7], [1, 5], [1, 12]], L);
        v.limb([[5, 9], [3, 8], [3, 12]], L);
        if (r) v.limb([[4, 5], [0, 1], [-1, -3]], L);
        else v.limb([[6, 10], [5, 9], [5, 12]], L);
      }
      const head = (x, y, s, hair) => {
        g.oval(x, y, x + s, y + s, P.PORC);
        g.row(y, x + 1, x + s - 1, hair);
        g.pts([[x, y + 1], [x + s, y + 1]], hair);
        const e = y + (s >> 1);
        g.pts([[x + 1, e], [x + s - 1, e]], r ? P.RED : K);
        if (r) g.rect(x + (s >> 1), e + 1, x + (s >> 1) + (s > 4 ? 1 : 0), e + 2, K);
        else g.set(x + (s >> 1), e + 2, hex('#a8544c'));
      };
      head(2, 4, 4, hex('#6b4630'));
      head(10, 3, 4, hex('#3a2a22'));
      head(5, 1, 6, hex('#a8904e'));
      g.line(9, 2, 10, 4, hex('#7a766c'));
      head(6, 7, 4, hex('#3a2a22'));
    },
    { u: [18, 18, 1] },
  );

  /* 20 */
  mk(
    'rocking-horse-teeth',
    'rocking horse with real teeth nursery toy dapple grey rears jaw eye',
    28,
    24,
    (g, r) => {
      const G = hex('#9a9a94'),
        W = C.wood;
      // rocker
      g.row(21, 5, 22, W);
      g.pts([[3, 19], [4, 20], [23, 20], [24, 19], [2, 18], [25, 18]], W);
      g.row(22, 6, 21, dark(W));
      g.limb([[8, 13], [6, 20]], G, 2);
      g.limb([[11, 13], [10, 20]], dark(G), 2);
      if (!r) {
        g.limb([[17, 13], [18, 20]], dark(G), 2);
        g.limb([[19, 13], [21, 20]], G, 2);
      } else {
        g.limb([[17, 12], [21, 14], [20, 18]], dark(G), 2);
        g.limb([[19, 11], [24, 12], [25, 16]], G, 2);
        g.pts([[20, 19], [25, 17]], K);
        g.pts([[18, 20], [21, 20], [19, 19]], C.woodLight); // split wood
      }
      g.oval(5, 7, 20, 14, G);
      g.speckle(6, 8, 19, 13, lite(G), 6, 4);
      g.rect(11, 6, 15, 8, VELVET); // saddle
      g.hairs([[5, 8, 7, -2], [4, 8, 6, -2], [6, 9, 6, -1]], hex('#d8d4c4'));
      // neck and head
      const hy = r ? -3 : 0;
      g.poly([[16, 8], [20, 9], [23, 3 + hy], [19, 2 + hy]], G);
      g.rect(19, 1 + hy, 24, 5 + hy, G);
      g.rect(23, 3 + hy, 26, 6 + hy, G);
      g.pts([[19, 0 + hy], [20, 0 + hy]], G);
      g.hairs([[18, 2 + hy, 6, -2], [17, 3 + hy, 5, -1]], hex('#d8d4c4'));
      g.set(21, 2 + hy, K);
      g.set(22, 2 + hy, r ? P.RED : P.EYE);
      if (!r) {
        g.rect(23, 6, 26, 6, P.TOOTH);
        g.pts([[24, 6], [26, 6]], dark(P.TOOTH));
        g.row(7, 23, 25, G);
      } else {
        g.poly([[22, 4], [26, 7], [24, 11], [21, 6]], G); // the lower jaw swings down
        g.poly([[23, 4], [26, 4], [25, 8], [23, 6]], P.MAW);
        g.teeth(4, 23, 26, P.TOOTH, 1);
        g.pts([[25, 8], [24, 9], [26, 7]], P.TOOTH);
        g.limb([[24, 6], [26, 10], [25, 13]], P.GUM);
      }
    },
    { u: [28, 28] },
  );

  /* 21 */
  mk(
    'dummy-ribcage',
    "dressmaker's dummy corset that opens like a ribcage tailor form stand wire arms",
    16,
    36,
    (g, r) => {
      const L = hex('#b5a98a');
      g.col(7, 24, 33, C.woodDark);
      g.col(8, 24, 33, C.wood);
      g.limb([[7, 31], [3, 34]], C.woodDark);
      g.limb([[8, 31], [12, 34]], C.woodDark);
      g.row(34, 6, 9, C.woodDark);
      g.rect(6, 2, 9, 4, C.woodLight); // the neck cap
      g.set(7, 1, C.woodLight);
      if (!r) {
        g.poly([[4, 5], [11, 5], [13, 9], [11, 16], [12, 24], [3, 24], [4, 16], [2, 9]], L);
        g.col(3, 9, 12, lite(L));
        g.rect(4, 12, 11, 22, C.cream); // the corset
        for (let y = 13; y <= 21; y += 2) g.pts([[7, y], [8, y + 1]], C.wine);
        g.row(24, 3, 12, dark(L));
      } else {
        g.rect(5, 5, 10, 24, P.MAW);
        g.poly([[4, 5], [5, 5], [5, 24], [1, 24], [2, 16], [-1, 9]], L);
        g.poly([[11, 5], [10, 5], [10, 24], [14, 24], [13, 16], [16, 9]], dark(L));
        for (let y = 8; y <= 22; y += 2) {
          g.row(y, 2, 6, P.BONE);
          g.row(y, 9, 13, P.BONE);
          g.pts([[1, y + 1], [14, y + 1]], P.BONE);
        }
        g.orb(6, 11, 9, 14, P.RED);
        for (const v of [g, g.flip(15)]) {
          v.limb([[2, 7], [-3, 3], [-5, 10], [-3, 15]], C.steel);
          v.fingers(-3, 15, 'd', C.steel, 2);
        }
      }
    },
    { u: [28, 36, 6] },
  );

  /* 22 */
  mk(
    'teapot-mouth',
    'teapot with teeth china tea pot tongue little legs small kitchen thing',
    15,
    11,
    (g, r) => {
      const W = hex('#d8d6cc'),
        B = hex('#4f6a8a'),
        up = r ? -3 : 0;
      if (r) for (const x of [4, 6, 8, 10]) g.limb([[x, 8 + up], [x + (x < 7 ? -1 : 1), 9]], W);
      g.oval(3, 3 + up, 11, 9 + up, W);
      g.rect(1, 4 + up, 2, 4 + up, W); // handle
      g.rect(1, 7 + up, 2, 7 + up, W);
      g.col(1, 4 + up, 7 + up, W);
      g.limb([[11, 6 + up], [13, 4 + up], [13, 3 + up]], W); // spout
      g.pts([[5, 7 + up], [7, 8 + up], [9, 7 + up]], B);
      if (!r) {
        g.row(2, 5, 9, W);
        g.set(7, 1, B);
        g.row(3, 4, 10, B);
        g.teeth(4, 5, 9, P.TOOTH, 2);
      } else {
        g.poly([[4, -4], [9, -6], [10, -5], [5, -2]], W); // lid thrown back
        g.set(8, -7, B);
        g.rect(4, 1, 10, 3, P.MAW);
        g.teeth(1, 4, 10, P.TOOTH, 2);
        g.teeth(3, 5, 10, P.TOOTH, 2);
        g.limb([[7, 2], [8, 5], [7, 8]], P.GUM);
        g.pts([[5, -1], [9, -1]], K);
      }
    },
    { u: [15, 17] },
  );

  /* 23 */
  mk(
    'moth-dress',
    'christening gown full of moths lace dress with no one in it swarm figure',
    18,
    36,
    (g, r) => {
      const moth = (x, y, c2 = MOTH) => {
        g.pts([[x - 1, y - 1], [x + 1, y - 1], [x, y]], c2);
        g.set(x, y - 1, dark(c2));
      };
      g.poly([[6, 19], [11, 19], [16, 34], [1, 34]], LACE);
      g.rect(6, 11, 11, 19, LACE);
      g.oval(2, 11, 6, 15, LACE);
      g.oval(11, 11, 15, 15, dark(LACE));
      g.rect(3, 15, 4, 23, LACE);
      g.rect(13, 15, 14, 23, dark(LACE));
      g.row(19, 6, 11, hex('#a89a80'));
      for (const y of [24, 29]) for (let x = 2; x < 16; x++) if (g.get(x, y)) g.set(x, y, x % 2 ? dark(LACE) : C.white);
      for (const x of [5, 8, 12]) g.line(x < 8 ? 7 : x > 8 ? 10 : 8, 20, x - (x < 8 ? 2 : x > 8 ? -2 : 0), 33, dark(LACE));
      g.pts([[8, 12], [8, 14], [8, 16]], dark(LACE));
      for (const [x, y] of [[5, 26], [10, 22], [12, 31]]) g.clearRect(x, y, x + 1, y + 1); // moth-eaten
      g.row(34, 1, 16, C.white);
      g.oval(5, 2, 12, 10, dark(MOTH));
      // a head of moths
      const rr = rnd(5);
      for (let i = 0; i < (r ? 22 : 12); i++) {
        const a = rr() * 6.28,
          d = rr() * (r ? 9 : 3.2);
        moth(8.5 + Math.cos(a) * d * (r ? 1.2 : 1), 6 + Math.sin(a) * d * 0.9, i % 3 ? MOTH : hex('#b8aa90'));
      }
      if (!r) {
        g.pts([[3, 24], [4, 25], [14, 24]], MOTH);
        g.pts([[7, 5], [10, 5]], K);
      } else {
        for (const [x, y] of [[2, 24], [0, 27], [4, 27], [15, 24], [17, 27], [13, 28], [-3, 20], [20, 18], [-2, 12], [19, 10]]) moth(x, y);
        g.rect(6, 4, 7, 5, K);
        g.rect(10, 4, 11, 5, K);
        g.pts([[6, 4], [10, 4]], P.EYE);
        g.rect(8, 8, 9, 10, K);
      }
    },
    { u: [28, 40, 5] },
  );

  /* 24 */
  mk(
    'mirror-double',
    'cheval mirror with someone inside pressing out looking glass double arms through',
    18,
    38,
    (g, r) => {
      const W = C.wood;
      g.col(2, 6, 35, W);
      g.col(15, 6, 35, dark(W));
      g.row(35, 1, 4, W);
      g.row(35, 13, 16, W);
      g.rect(1, 36, 4, 36, dark(W));
      g.rect(13, 36, 16, 36, dark(W));
      g.box(3, 2, 14, 31, W);
      g.rect(5, 4, 12, 29, C.glass);
      g.line(6, 5, 6, 12, C.glassLight);
      g.line(11, 22, 11, 28, C.glassLight);
      // the one in the glass
      g.poly([[6, 15], [11, 15], [12, 29], [5, 29]], P.SH);
      g.oval(6, 7, 11, 14, P.SH);
      g.pts([[7, 10], [10, 10]], P.EYE);
      if (!r) {
        g.rect(5, 18, 6, 20, P.ASHEN);
        g.rect(11, 17, 12, 19, P.ASHEN);
      } else {
        g.maw(7, 12, 10, 13);
        for (const v of [g, g.flip(17)]) {
          v.limb([[5, 17], [-1, 14], [-4, 20]], P.ASHEN, 2);
          v.fingers(-4, 21, 'd', P.ASHEN, 2);
        }
        g.limb([[8, 4], [9, 8], [7, 11]], C.white);
        g.limb([[9, 14], [11, 20], [9, 24], [10, 29]], C.white);
        g.limb([[11, 20], [12, 22]], C.white);
      }
    },
    { u: [30, 38, 6] },
  );

  /* 25 */
  mk(
    'piano-teeth',
    'grand piano with keys for teeth black beast lid jaw tongue strings music room',
    46,
    30,
    (g, r) => {
      const B = hex('#201e28'),
        leg = (x, bend) => {
          g.limb([[x, 18], [x + bend, 23], [x, 27]], B, 2);
          g.rect(x - 1, 27, x + 2, 28, BRASS);
        };
      leg(7, r ? -2 : 0);
      leg(23, 0);
      leg(40, r ? 2 : 0);
      g.poly([[2, 11], [30, 11], [43, 13], [44, 18], [2, 18]], B); // the case
      g.row(18, 3, 43, dark(B));
      g.row(11, 3, 30, lite(B));
      if (!r) {
        g.poly([[2, 9], [31, 9], [43, 11], [43, 12], [2, 10]], B); // the lid, almost shut
        g.row(9, 3, 30, hex('#3a3846'));
        for (let x = 3; x <= 20; x++) g.set(x, 11, x % 3 === 2 ? K : P.TOOTH); // keys
        g.set(26, 14, P.YEL);
        g.rect(21, 19, 24, 23, B); // pedal lyre
      } else {
        g.poly([[31, 10], [43, 12], [42, 9], [6, -8], [3, -6]], B); // the lid thrown up
        g.line(6, -8, 31, 9, hex('#3a3846'));
        g.poly([[4, -3], [30, 10], [3, 10]], P.MAW);
        for (let x = 6; x <= 26; x += 4) g.line(x, 10, x - 1, -2 + (x - 6) * 0.55, BRASS); // strings like sinew
        for (let x = 3; x <= 22; x++) g.set(x, 11, x % 3 === 2 ? K : P.TOOTH);
        for (let x = 3; x <= 21; x += 2) g.set(x, 10, P.TOOTH);
        for (let i = 0; i < 9; i++) g.set(5 + i * 2.6, -5 + i * 1.45, P.TOOTH);
        g.tube(curve([[14, 10], [6, 13], [1, 19], [3, 26]], 5), 2.2, 1.2, P.GUM);
        g.rect(33, 13, 35, 15, K);
        g.set(34, 14, P.YEL);
      }
    },
    { L: 'long', u: [46, 40] },
  );

  /* 26 */
  mk(
    'soot-child',
    'soot child chimney sweep boy made of soot black small white eyes smoke arms',
    12,
    22,
    (g, r) => {
      const S = P.SH,
        L = P.SHL;
      if (r) {
        g.tent([[4, 11], [0, 8], [-3, 2], [-1, -2]], 1.5, S);
        g.tent([[7, 11], [11, 7], [14, 1], [12, -3]], 1.5, S);
        g.tent([[4, 13], [-1, 13], [-4, 9]], 1.3, S);
        g.tent([[7, 13], [12, 13], [15, 10]], 1.3, S);
      }
      g.oval(2, 1, 9, 9, S);
      g.rect(4, 9, 7, 16, S);
      g.rect(3, 10, 8, 14, S);
      if (!r) {
        g.col(2, 10, 16, S);
        g.col(9, 10, 16, S);
      }
      g.rect(4, 16, 5, 20, S);
      g.rect(7, 16, 8, 20, S);
      g.pts([[3, 20], [9, 20]], S);
      g.pts([[3, 2], [4, 1], [3, 10], [4, 16]], L);
      g.pts([[1, 3], [10, 2], [5, 0]], S);
      if (!r) {
        g.rect(3, 4, 4, 5, P.EYE);
        g.rect(7, 4, 8, 5, P.EYE);
      } else {
        g.rect(3, 3, 4, 4, C.flame);
        g.rect(7, 3, 8, 4, C.flame);
        g.rect(4, 6, 7, 8, C.blood);
        g.row(7, 4, 7, C.flame);
        g.pts([[5, 7], [6, 7]], C.flameLight);
      }
    },
    { u: [22, 26, 5], def: { shade: false } },
  );

  /* 27 */
  mk(
    'bookworm-great',
    'great bookworm of books library worm segments spines pages grub maw',
    46,
    18,
    (g, r) => {
      const cols = [C.wine, C.forest, C.navy, C.mustard, C.wood, C.plum, C.teal, C.wine, C.forest, C.navy];
      const pos = (i) => (r && i > 5 ? [[29, 9], [32, 4], [34, -2], [35, -8]][i - 6] : [4 + i * 4, 9 + Math.round(Math.sin(i * 1.1) * 1.6)]);
      for (let i = 0; i < 10; i++) {
        const [x, y] = pos(i),
          col = cols[i];
        g.rect(x - 2, y - 4 + (i % 2), x + 1, y + 5, col);
        g.col(x - 2, y - 4 + (i % 2), y + 4, lite(col));
        g.col(x + 1, y - 3, y + 4, dark(col));
        g.row(y - 2, x - 2, x + 1, GILT);
        g.row(y + 5, x - 2, x + 1, C.paper);
        g.rect(x - 1, y + 6, x, y + 6, P.PALE);
        if (!(r && i > 5)) g.set(x - 1, y + 7, dark(P.PALE));
      }
      const [hx, hy] = r ? [38, -11] : [42, 9];
      g.ball(hx - 3, hy - 4, hx + 2, hy + 4, P.PALE);
      if (!r) {
        g.pts([[hx + 1, hy - 2]], K);
        g.pts([[hx + 2, hy + 1], [hx + 2, hy + 3]], C.woodDark);
        g.rect(hx + 2, hy + 2, hx + 2, hy + 2, C.paper);
      } else {
        g.oval(hx - 1, hy - 3, hx + 3, hy + 3, P.MAW);
        g.pts([[hx, hy - 3], [hx + 2, hy - 3], [hx + 3, hy - 1], [hx + 3, hy + 1], [hx + 2, hy + 3], [hx, hy + 3], [hx - 1, hy - 1], [hx - 1, hy + 1]], P.TOOTH);
        g.pts([[hx - 2, hy - 5], [hx - 3, hy - 3]], K);
        g.pts([[42, -4], [44, 0], [41, 3], [43, 6]], C.paper);
      }
    },
    { L: 'long', u: [46, 34] },
  );

  /* 28 */
  mk(
    'ballerina-box',
    'music box ballerina figurine that turns blades for arms small porcelain dancer',
    12,
    19,
    (g, r) => {
      g.box(2, 11, 9, 16, C.wood);
      g.row(11, 2, 9, GILT);
      g.pts([[10, 13], [11, 13], [11, 12]], BRASS);
      g.col(5, 8, 10, P.PORC);
      g.col(6, 9, 10, dark(P.PORC));
      g.rect(3, 6, 8, 7, hex('#b9a0a0')); // tutu
      g.rect(5, 4, 6, 5, P.PORC);
      g.rect(5, 1, 6, 3, P.PORC);
      g.row(1, 5, 6, hex('#3a2a22'));
      if (!r) {
        g.pts([[4, 4], [3, 3], [3, 2], [4, 1], [7, 4], [8, 3], [8, 2], [7, 1]], P.PORC); // arms in a ring
        g.set(6, 2, K);
      } else {
        g.rect(5, 1, 6, 2, hex('#3a2a22')); // the head has turned right round
        g.pts([[5, 3], [6, 3]], P.RED);
        g.line(4, 4, -1, 3, C.steel);
        g.line(7, 4, 12, 3, C.steel);
        g.pts([[-2, 3], [13, 3]], C.white);
        g.pts([[1, 6], [10, 7], [0, 8], [11, 5]], hex('#b9a0a0'));
      }
    },
    { u: [18, 19, 3] },
  );

  /* 29 */
  mk(
    'rat-king',
    'rat king rats knotted by their tails pantry vermin many heads small',
    24,
    13,
    (g, r) => {
      const R = hex('#6a5f58');
      const rat = (x, y, dx, col) => {
        g.oval(x, y, x + 5, y + 3, col);
        const hx = dx > 0 ? x + 5 : x - 2,
          hy = y + (r ? -2 : 1);
        g.rect(hx, hy, hx + 2, hy + 2, col);
        g.set(dx > 0 ? hx + 3 : hx - 1, hy + 1, P.RAW);
        g.set(dx > 0 ? hx : hx + 2, hy - 1, P.RAW);
        g.set(hx + 1, hy, r ? P.RED : K);
        if (r) g.set(dx > 0 ? hx + 2 : hx, hy + 2, P.TOOTH);
      };
      for (const [a, b] of [[10, 4], [16, 4], [10, 9], [16, 9]]) g.line(a, b, 13, 7, P.RAW);
      rat(5, 2, -1, dark(R));
      rat(16, 2, 1, dark(R));
      rat(4, 8, -1, lite(R));
      rat(17, 8, 1, lite(R));
      g.rect(12, 5, 14, 8, P.RAW);
      g.pts([[12, 5], [14, 8], [13, 6], [12, 7]], dark(P.RAW));
    },
    { u: [24, 15] },
  );

  /* 30 */
  mk(
    'curtain-strangler',
    'velvet curtain with a face in it drapes hands inside tassel cord strangler',
    18,
    40,
    (g, r) => {
      const V = VELVET;
      g.row(2, 1, 16, BRASS);
      g.pts([[1, 1], [16, 1], [1, 3], [16, 3]], GILT);
      const fold = (x0, x1) => {
        g.rect(x0, 3, x1, 37, V);
        for (let x = x0; x <= x1; x++) if ((x - x0) % 3 === 2) g.col(x, 4, 37, dark(V));
        g.col(x0, 4, 37, lite(V));
      };
      if (!r) {
        fold(3, 14);
        g.rect(5, 8, 11, 9, lite(V)); // a brow pushing through the cloth
        g.col(8, 9, 12, lite(V));
        g.rect(6, 10, 7, 10, dark(V));
        g.rect(10, 10, 11, 10, dark(V));
        g.row(14, 7, 10, dark(V));
        g.pts([[4, 21], [5, 20], [6, 21], [12, 23], [13, 22]], lite(V)); // fingers
        g.row(26, 3, 14, GILT);
        g.col(15, 26, 31, GILT);
        g.rect(14, 31, 16, 33, GILT);
      } else {
        fold(1, 5);
        fold(12, 16);
        g.rect(6, 3, 11, 37, P.NIGHT);
        g.pts([[7, 7], [10, 7]], P.EYE);
        g.maw(7, 10, 10, 12);
        for (const [y, s] of [[15, -1], [18, 1], [22, -1], [26, 1], [30, -1]]) {
          const v = s > 0 ? g.flip(17) : g;
          v.limb([[8, y], [3, y + 2], [-2, y]], P.PALE, 2);
          v.fingers(-2, y, 'l', P.PALE, 1);
        }
        g.tube(curve([[14, 26], [19, 24], [21, 18], [18, 14]], 5), 0.8, 0.8, GILT);
        g.oval(16, 10, 20, 14, null);
        g.frame(17, 10, 19, 13, GILT);
      }
      for (const x of [3, 4, 9, 13, 14]) g.clear(x, 37);
    },
    { u: [28, 40, 5] },
  );

  /* 31 */
  mk(
    'dome-head',
    'wax head under a glass dome flowers growing from the eyes parlour ornament small',
    12,
    17,
    (g, r) => {
      g.rect(2, 13, 9, 14, C.woodDark);
      g.pts([[2, 15], [5, 15], [9, 15]], C.woodDark);
      g.rect(3, 6, 8, 12, P.WAX);
      g.row(5, 4, 7, P.WAX);
      g.col(8, 7, 11, dark(P.WAX));
      g.pts([[4, 8], [7, 8]], K);
      if (!r) {
        g.pts([[4, 7], [7, 7]], C.wine);
        g.pts([[4, 6], [7, 6]], C.moss);
        g.row(11, 5, 6, vd(P.WAX));
        g.pts([[3, 1], [4, 0], [5, 0], [6, 0], [7, 0], [8, 1], [2, 2], [9, 2]], C.glassLight);
        g.col(1, 3, 12, C.glassLight);
        g.col(10, 3, 12, C.glass);
        g.set(2, 4, C.white);
      } else {
        g.rect(5, 10, 6, 12, K);
        g.limb([[4, 7], [3, 2], [1, -3]], C.moss);
        g.limb([[7, 7], [8, 1], [10, -2]], C.moss);
        g.orb(0, -5, 2, -3, P.RED);
        g.orb(9, -4, 11, -2, P.RED);
        g.col(1, 7, 12, C.glassLight); // what is left of the dome
        g.pts([[1, 6], [2, 5], [10, 9], [10, 10], [10, 11], [10, 12], [10, 8]], C.glassLight);
        g.pts([[0, 14], [11, 15], [11, 13]], C.glassLight);
      }
    },
    { u: [14, 23, 1] },
  );

  return out;
};
