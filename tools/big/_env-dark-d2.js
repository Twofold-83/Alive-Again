/* Dream world, part 2: things adrift, and places that should be somewhere else. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, dots, part, turn, thin, ring, cloud, star, shadowed } = H;
  const CLD = hex('#cfcdc6'),
    NI = C.night,
    SKY = hex('#27304e'),
    MOON = hex('#e0d8a8'),
    LILAC = hex('#8a7a9c'),
    ROSE = hex('#b08a8f'),
    DBLUE = hex('#5a6a84'),
    MINT = hex('#7fa39a'),
    MUST = hex('#b09a5a'),
    PAPER = hex('#d8d3c4'),
    SNOW = hex('#dcdfe0'),
    SEA = hex('#4a6a78'),
    SEAL = hex('#7f9ea6'),
    BN = C.bone,
    BNd = D(C.bone),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IR = C.iron,
    ID = C.ironDark,
    GRASS = hex('#55684a'),
    WARM = hex('#d9b25a');

  O('paper-boat-giant', 'giant paper boat folded newspaper boat on a puddle sailing', {
    w: 32,
    h: 20,
    base: 'side',
    f(c, u) {
      const b = 18,
        y = u ? -2 : 0;
      c.poly([[2, 10 + y], [29, 10 + y], [23, 16 + y], [8, 16 + y]], PAPER); // hull
      c.poly([[10, 10 + y], [21, 10 + y], [15, 2 + y]], PAPER); // the fold that stands up
      c.line(15, 2 + y, 10, 10 + y, L(PAPER));
      c.line(15, 3 + y, 15, 10 + y, D(PAPER));
      c.line(2, 10 + y, 8, 16 + y, L(PAPER));
      c.row(10 + y, 3, 28, D(PAPER));
      c.line(15, 11 + y, 15, 16 + y, D(PAPER));
      for (let x = 6; x <= 24; x += 3) c.set(x, 12 + y + (x % 2), C.ash), c.set(x + 1, 14 + y, C.ash);
      if (u) c.set(15, 1 + y + 1, WARM), c.set(15, y + 1, C.flameLight);
      c.row(b, u ? 1 : 5, u ? 30 : 26, SEA);
      c.row(b - 1, u ? 2 : 9, u ? 29 : 22, SEA);
      if (u) {
        c.row(b - 2, 3, 28, SEA);
        for (let x = 2; x <= 28; x += 5) c.set(x, b - 2, SEAL), c.set(x + 1, b - 3, SEAL), c.set(x + 2, b - 2, SEAL);
      } else c.set(11, b - 1, SEAL);
    },
    sw: 16,
    s(c, u) {
      const b = 18,
        y = u ? -2 : 0;
      c.poly([[4, 10 + y], [11, 10 + y], [9, 16 + y], [6, 16 + y]], PAPER); // bow on
      c.poly([[5, 10 + y], [10, 10 + y], [7, 2 + y]], PAPER);
      c.line(7, 2 + y, 7, 16 + y, D(PAPER));
      c.line(4, 10 + y, 6, 16 + y, L(PAPER));
      c.set(8, 2 + y, PAPER);
      if (u) c.set(7, y + 1, C.flameLight);
      c.row(b, u ? 1 : 3, u ? 14 : 12, SEA);
      c.row(b - 1, u ? 2 : 5, u ? 13 : 10, SEA);
      if (u) {
        c.row(b - 2, 3, 12, SEA);
        dots(c, SEAL, [3, b - 2, 4, b - 3, 11, b - 2, 12, b - 3]);
      }
    },
  });

  O('kite-face', 'kite with a face diamond paper kite tail of bows smiling watching', {
    w: 20,
    h: 46,
    solid: false,
    f(c, u) {
      c.poly([[9, 1], [17, 12], [9, 28], [2, 12]], ROSE);
      c.poly([[10, 1], [17, 12], [10, 28]], D(ROSE));
      c.line(9, 1, 9, 28, WD);
      c.row(12, 2, 17, WD);
      if (!u) {
        c.row(10, 5, 7, NI); // asleep
        c.row(10, 12, 14, NI);
        dots(c, NI, [6, 17, 7, 18, 8, 18, 11, 18, 12, 18, 13, 17]);
      } else {
        c.rect(5, 8, 7, 10, C.white);
        c.rect(12, 8, 14, 10, C.white);
        c.set(6, 10, NI);
        c.set(13, 10, NI);
        c.rect(7, 16, 12, 19, NI); // and its mouth opens
        c.row(16, 8, 11, C.white);
      }
      const sway = u ? -1 : 1;
      for (let y = 29; y <= 43; y++) c.set(9 + Math.round(Math.sin((y - 29) / 3) * 2 * sway), y, CLD);
      for (const [y, col] of [[32, MUST], [37, MINT], [42, LILAC]]) {
        const x = 9 + Math.round(Math.sin((y - 29) / 3) * 2 * sway);
        c.rect(x - 2, y - 1, x - 1, y, col);
        c.rect(x + 1, y - 1, x + 2, y, D(col));
      }
      return () => u && dots(c, C.ash, [0, 6, 19, 5, 1, 22]);
    },
    sw: 10,
    s(c, u) {
      c.col(4, 1, 28, ROSE);
      c.col(5, 1, 28, D(ROSE));
      c.set(3, 12, WD);
      c.set(6, 12, WD);
      if (u) c.set(6, 9, C.white), c.set(6, 17, NI);
      const sway = u ? -1 : 1;
      for (let y = 29; y <= 43; y++) c.set(5 + Math.round(Math.sin((y - 29) / 3) * 2 * sway), y, CLD);
      for (const [y, col] of [[32, MUST], [37, MINT], [42, LILAC]]) {
        const x = 5 + Math.round(Math.sin((y - 29) / 3) * 2 * sway);
        c.rect(x, y - 1, x + 1, y, col);
      }
    },
  });

  function house(c, x0, y0, w, lit, gable) {
    const x1 = x0 + w - 1;
    c.rect(x0, y0 + 6, x1, y0 + 15, PAPER);
    c.col(x0, y0 + 6, y0 + 15, L(PAPER));
    if (gable) c.poly([[x0 - 1, y0 + 6], [x1 + 1, y0 + 6], [(x0 + x1) >> 1, y0]], hex('#5b5a66')), c.poly([[x0 + 1, y0 + 6], [x1 - 1, y0 + 6], [(x0 + x1) >> 1, y0 + 2]], PAPER);
    else c.poly([[x0 - 1, y0 + 6], [x1 + 1, y0 + 6], [x1 - 2, y0], [x0 + 2, y0]], hex('#5b5a66'));
    c.rect(x1 - 4, y0 - 2, x1 - 3, y0 + 1, C.rust); // chimney
    c.rect(x0 + 2, y0 + 10, x0 + 4, y0 + 15, DBLUE);
    c.rect(x1 - 5, y0 + 9, x1 - 2, y0 + 12, lit ? WARM : NI);
    c.col(x1 - 3, y0 + 9, y0 + 12, D(PAPER));
    c.row(y0 + 15, x0, x1, D(PAPER));
  }
  const BAL = [ROSE, LILAC, MUST, MINT, DBLUE, hex('#a8697a'), CLD];
  function balloons(c, cx, ty, list, hx, hy) {
    list.forEach(([dx, dy, k]) => {
      const x = cx + dx,
        y = ty + dy;
      c.line(x + 2, y + 7, hx, hy, CLD);
    });
    list.forEach(([dx, dy, k]) => {
      const x = cx + dx,
        y = ty + dy,
        col = BAL[k % BAL.length];
      c.oval(x, y, x + 5, y + 6, col);
      c.set(x + 1, y + 1, L(col));
      c.set(x + 2, y + 7, D(col));
    });
  }
  const ALLB = [[-11, 6, 0], [-6, 1, 1], [0, 0, 2], [5, 3, 3], [-9, 12, 4], [-3, 8, 5], [3, 10, 6], [-5, 15, 2], [1, 16, 0]];
  O('balloon-house', 'balloons carrying a little house floating house on strings up', {
    w: 28,
    h: 62,
    f(c, u) {
      const b = 60,
        hy = u ? b - 15 : 36;
      balloons(c, 12, 1 + (u ? 18 : 0), u ? ALLB.filter((_, i) => i % 3 === 1) : ALLB, 19, hy - 2);
      house(c, 6, hy, 16, !u, false);
      return () => {
        if (!u) return void dots(c, CLD, [9, 55, 10, 55, 16, 57, 17, 57, 13, 58]);
        dots(c, ROSE, [3, 8, 5, 12]); // what is left of the burst ones
        dots(c, MUST, [22, 6, 20, 11]);
        dots(c, MINT, [10, 3, 14, 14]);
      };
    },
    sw: 22,
    s(c, u) {
      const b = 60,
        hy = u ? b - 15 : 36;
      const list = ALLB.filter((_, i) => i % 2 === 0).map(([dx, dy, k]) => [dx * 0.6, dy, k]);
      balloons(c, 8, 1 + (u ? 18 : 0), u ? list.slice(0, 2) : list, 13, hy - 2);
      house(c, 4, hy, 13, !u, true);
      return () => {
        if (!u) return void dots(c, CLD, [7, 55, 8, 55, 13, 57]);
        dots(c, ROSE, [3, 8, 16, 10]);
        dots(c, MINT, [9, 3]);
      };
    },
  });

  const EARTH = hex('#6a5444'),
    LEAF = hex('#4f6650');
  function island(c, x0, x1, u, seed) {
    const m = (x0 + x1) >> 1,
      r = rnd(seed);
    c.poly([[x0, 31], [x1, 31], [x1 - 3, 36], [m + 3, 42], [m, 46], [m - 4, 40], [x0 + 3, 35]], EARTH);
    c.line(x0, 31, x0 + 3, 35, L(EARTH));
    for (let i = 0; i < 8; i++) c.set(x0 + 3 + ((r() * (x1 - x0 - 6)) | 0), 33 + ((r() * 5) | 0), i % 2 ? D(EARTH) : C.stone);
    c.col(m - 6, 38, 42, D(EARTH)); // roots
    c.col(m + 5, 38, 41, D(EARTH));
    c.rect(x0, 29, x1, 30, GRASS);
    c.row(29, x0, x1, L(GRASS));
    c.rect(m - 1, 16, m + 1, 28, WD); // the tree
    c.col(m - 1, 16, 28, W);
    c.oval(m - 8, 3, m + 8, 19, LEAF);
    c.oval(m - 6, 4, m + 2, 11, L(LEAF));
    for (let i = 0; i < 12; i++) c.set(m - 6 + ((r() * 13) | 0), 6 + ((r() * 11) | 0), u ? ROSE : D(LEAF));
    if (u) for (let i = 0; i < 8; i++) c.set(m - 7 + ((r() * 15) | 0), 5 + ((r() * 12) | 0), L(ROSE));
  }
  O('island-floating-tree', 'floating island with a tree lump of earth in the air roots grass blossom', {
    w: 34,
    h: 52,
    f(c, u) {
      island(c, 4, 29, u, 3);
      return () => {
        dots(c, CLD, [11, 49, 12, 49, 13, 50, 20, 50, 21, 50]);
        if (!u) return;
        dots(c, ROSE, [6, 22, 26, 25, 9, 26, 30, 21, 3, 27]);
        for (let y = 31; y <= 48; y += 2) c.set(27, y, SEAL), c.set(27, y + 1, SEA); // a spring runs off the edge
        dots(c, SEAL, [26, 50, 28, 50]);
      };
    },
    sw: 24,
    s(c, u) {
      island(c, 3, 20, u, 8);
      return () => {
        dots(c, CLD, [8, 49, 9, 49, 14, 50]);
        if (!u) return;
        dots(c, ROSE, [2, 22, 21, 25, 5, 26]);
        for (let y = 31; y <= 48; y += 2) c.set(11, y, SEAL), c.set(11, y + 1, SEA);
        dots(c, SEAL, [10, 50, 12, 50]);
      };
    },
  });

  O('whale-skeleton-arch', 'whale skeleton arch of ribs to walk under bones skull beached great fish', {
    w: 64,
    h: 36,
    solid: false,
    f(c, u) {
      const b = 34;
      // spine
      for (let x = 14; x <= 61; x++) {
        const y = Math.round(5 + ((x - 34) / 20) ** 2 * 6);
        c.rect(x, y, x, y + (x < 52 ? 2 : 1), x % 3 ? BN : BNd);
        if (x > 54) c.clear(x, y + 1);
      }
      // ribs
      for (let i = 0; i < 7; i++) {
        const x = 18 + i * 5,
          y0 = Math.round(7 + ((x - 34) / 20) ** 2 * 6),
          len = b - y0 - (i > 4 ? (i - 4) * 6 : 0);
        for (let k = 0; k <= len; k++) {
          const t = k / len,
            xx = x - Math.round(Math.sin(t * Math.PI) * 3);
          c.set(xx, y0 + k, BN);
          c.set(xx + 1, y0 + k, BNd);
        }
      }
      // skull
      c.poly([[1, b], [3, b - 4], [10, 10], [16, 5], [18, 9], [15, 14], [8, b - 2]], BN);
      c.line(3, b - 4, 10, 10, L(BN));
      c.oval(12, 8, 15, 11, u ? hex('#6f9aa0') : NI);
      c.line(7, b - 1, 16, 15, BNd); // lower jaw
      c.line(8, b, 17, 16, BN);
      c.line(17, 16, 17, 12, BN);
      if (u) for (const x of [21, 31, 41]) c.col(x, 9, 12, IR), c.rect(x - 1, 13, x + 1, 15, WARM), c.set(x, 14, C.flameLight);
      return () => {
        if (!u) return;
        for (const x of [21, 31, 41]) dots(c, WARM, [x - 2, 14, x + 2, 14, x, 17]);
        dots(c, hex('#6f9aa0'), [11, 7, 16, 8, 13, 12]);
      };
    },
    sw: 26,
    s(c, u) {
      const b = 34;
      // the arch of ribs behind, the skull in front
      ring(c, 2, 4, 23, b + 26, BN);
      ring(c, 3, 5, 22, b + 26, BNd);
      c.rect(11, 3, 14, 6, BN);
      c.poly([[9, b], [16, b], [17, 16], [13, 11], [12, 11], [8, 16]], BN);
      c.line(9, b, 8, 16, L(BN));
      c.oval(9, 15, 11, 18, u ? hex('#6f9aa0') : NI);
      c.oval(14, 15, 16, 18, u ? hex('#6f9aa0') : NI);
      c.col(12, 22, b, BNd);
      c.col(13, 22, b, BNd);
      if (u) c.col(12, 7, 9, IR), c.rect(11, 10, 14, 12, WARM), c.rect(12, 11, 13, 11, C.flameLight);
      return () => u && dots(c, WARM, [9, 11, 16, 11, 12, 14]);
    },
  });

  const EBON = hex('#3a2c2a');
  function shore(c, x0, x1, y, b) {
    c.rect(x0, y, x1, b, SEA);
    for (let x = x0; x <= x1; x++) if ((x * 7 + y) % 5 < 2) c.set(x, y, SEAL);
    for (let x = x0 + 2; x <= x1 - 2; x += 6) c.row(y + 2, x, x + 2, SEAL);
  }
  O('piano-on-shore', 'piano on the shore upright piano standing in the sea tide seaweed', {
    w: 38,
    h: 34,
    f(c, u) {
      const b = 32;
      c.rect(3, 4, 34, b - 1, EBON);
      c.row(4, 3, 34, L(EBON));
      c.col(3, 4, b - 1, L(EBON));
      c.rect(2, 3, 35, 4, W);
      c.rect(5, 7, 32, 14, D(EBON));
      c.rect(14, 9, 23, 12, hex('#4a3a34'));
      c.rect(2, 16, 35, 18, EBON); // key bed
      c.row(16, 2, 35, L(EBON));
      c.rect(4, 17, 33, 18, BN);
      for (let x = 5; x <= 32; x += 2) c.set(x, 17, (x % 7) % 3 ? NI : BN), c.set(x, 18, BNd);
      c.rect(4, 19, 5, b - 1, D(EBON));
      c.rect(32, 19, 33, b - 1, D(EBON));
      dots(c, C.moss, [6, 4, 7, 5, 8, 5, 8, 6, 9, 7, 26, 4, 27, 5, 27, 6, 28, 7, 28, 8, 29, 9]); // weed
      c.rect(20, 2, 22, 3, ROSE); // a starfish
      c.set(21, 1, ROSE);
      if (u) {
        for (const x of [9, 15, 16, 24, 29]) c.set(x, 17, C.ash), c.set(x, 18, NI); // keys going down by themselves
        shore(c, 1, 36, 20, b);
      } else shore(c, 1, 36, b - 4, b);
      return () => u && dots(c, MOON, [10, 13, 11, 11, 17, 12, 25, 10, 26, 13, 30, 0, 8, 1]);
    },
    sw: 18,
    s(c, u) {
      const b = 32;
      c.rect(3, 4, 10, b - 1, EBON);
      c.col(3, 4, b - 1, L(EBON));
      c.rect(2, 3, 11, 4, W);
      c.rect(11, 16, 15, 18, EBON);
      c.row(16, 11, 15, L(EBON));
      c.row(17, 12, 15, BN);
      c.rect(13, 19, 14, b - 1, D(EBON));
      dots(c, C.moss, [9, 4, 10, 5, 10, 6, 11, 7]);
      c.rect(5, 2, 7, 3, ROSE);
      if (u) c.set(14, 17, NI), shore(c, 1, 16, 20, b);
      else shore(c, 1, 16, b - 4, b);
      return () => u && dots(c, MOON, [14, 12, 16, 9, 13, 7]);
    },
  });

  function fir(c, x, b, h, col) {
    c.col(x, b - h, b, col);
    for (let k = 3; k < h; k += 4) {
      const wv = Math.max(1, Math.round((k / h) * 5));
      c.row(b - h + k, x - wv, x + wv, col);
      c.row(b - h + k + 1, x - wv + 1, x + wv - 1, D(col));
    }
  }
  const lampPost = (alt) => (c, u) => {
    const b = 58,
      x = alt ? 10 : 12,
      FIR = hex('#2f4038');
    fir(c, alt ? 3 : 4, b, alt ? 34 : 44, FIR);
    fir(c, alt ? 17 : 20, b, alt ? 46 : 30, D(FIR));
    c.rect(x, 14, x + 1, b, IR);
    c.col(x, 14, b, L(IR));
    c.rect(x - 2, b - 2, x + 3, b, ID);
    c.rect(x - 1, b - 9, x + 2, b - 3, IR);
    c.row(18, x - 3, x + 4, IR); // the ladder bar
    c.rect(x - 2, 6, x + 3, 13, u ? WARM : hex('#3b4650')); // the lantern
    if (u) c.rect(x, 8, x + 1, 12, C.flameLight);
    c.frame(x - 2, 6, x + 3, 13, ID);
    c.col(x, 6, 13, u ? C.flameLight : ID);
    c.poly([[x - 3, 5], [x + 4, 5], [x + 1, 2], [x, 2]], ID);
    c.set(x, 1, IR);
    for (let y = b - 12; y <= b - 2; y += 2) c.set(x + (y % 4 ? -1 : 2), y, C.moss); // ivy
    c.rect(1, b, 22, b, SNOW);
    c.row(b - 1, 2, 8, SNOW);
    c.row(b - 1, 15, 20, D(SNOW));
    return () => {
      if (!u) return;
      dots(c, WARM, [x - 4, 8, x + 5, 10, x - 4, 12, x + 5, 6, x, 15, x + 1, 16, x - 3, 15, x + 4, 15]);
      dots(c, SNOW, [2, 6, 7, 16, 18, 4, 21, 14, 5, 26, 16, 24, 22, 30, 1, 36, 8, 40]);
    };
  };
  O('street-lamp-forest', 'street lamp alone in a snowy forest gas lamp post among fir trees', {
    w: 24,
    h: 60,
    f: lampPost(false),
    sw: 22,
    s: lampPost(true),
  });

  const brolly = (alt) => (c, u) => {
    const b = 40;
    c.oval(1, 2, 24, 22, NI);
    c.clearRect(0, 13, 25, 24);
    c.row(12, 1, 24, hex('#2a2a36'));
    for (const x of [1, 7, 13, 19]) c.set(x, 13, NI), c.set(x + 5, 13, NI);
    c.line(12, 2, 5, 11, hex('#34343f'));
    c.line(13, 2, 20, 11, hex('#34343f'));
    c.set(12, 1, C.steel);
    c.col(12, 13, 36, WD); // the stick
    if (alt) c.rect(11, 37, 13, 39, WD), c.set(12, 38, W);
    else c.set(13, 37, WD), c.set(14, 38, WD), c.set(15, 37, WD), c.set(15, 36, WD);
    cloud(c, 5, 14, 19, 19, u ? hex('#8d8f9c') : CLD, alt ? 4 : 2); // weather of its own, under it
    if (u) c.line(10, 20, 8, 24, MOON), c.line(8, 24, 10, 24, MOON), c.line(10, 24, 8, 28, MOON);
    return () => {
      const drops = u ? 26 : 5,
        r = rnd(alt ? 9 : 4);
      for (let i = 0; i < drops; i++) {
        const x = 4 + ((r() * 17) | 0),
          y = 21 + ((r() * 16) | 0);
        if (x === 12) continue;
        c.set(x, y, SEAL);
        if (u) c.set(x, y + 1, SEA);
      }
      c.row(b, u ? 2 : 8, u ? 23 : 16, SEA);
      if (u) c.row(b + 1, 5, 20, SEA), dots(c, SEAL, [6, b, 14, b, 19, b]);
    };
  };
  O('umbrella-raining-inside', 'umbrella with rain falling inside it black umbrella little cloud storm under', {
    w: 26,
    h: 43,
    solid: false,
    f: brolly(false),
    sw: 26,
    s: brolly(true),
  });

  const ENAM = hex('#d3cfc2');
  O('bath-walking-legs', 'bathtub walking on long legs bath with bird legs water rubber duck', {
    w: 38,
    h: 34,
    base: 'side',
    f(c, u) {
      const b = 32;
      c.poly([[3, 10], [34, 10], [31, 19], [6, 19]], ENAM);
      c.rect(2, 8, 35, 9, ENAM);
      c.row(8, 2, 35, L(ENAM));
      c.row(9, 2, 35, ROSE);
      c.row(18, 7, 30, D(ENAM));
      c.row(19, 6, 31, D(ENAM));
      c.line(3, 10, 6, 19, L(ENAM));
      c.row(7, 4, 33, SEAL); // water and foam
      dots(c, C.white, [6, 6, 7, 6, 8, 5, 12, 6, 13, 6, 22, 6, 23, 5, 24, 6, 29, 6]);
      c.rect(u ? 31 : 16, u ? 3 : 5, u ? 33 : 18, u ? 4 : 6, MUST); // the duck
      c.set(u ? 34 : 19, u ? 2 : 4, MUST);
      c.set(u ? 35 : 20, u ? 3 : 5, C.flame);
      const LEG = hex('#b89a6a'),
        leg = (x, kx, ky, fx) => {
          c.line(x, 20, kx, ky, LEG);
          c.line(kx, ky, fx, b - 1, LEG);
          c.rect(fx, b, fx + 3, b, LEG);
          c.set(fx - 1, b, D(LEG));
        };
      if (!u) {
        leg(9, 7, 26, 8);
        leg(13, 11, 26, 12);
        leg(26, 24, 26, 25);
        leg(30, 28, 26, 29);
      } else {
        leg(9, 5, 25, 3);
        c.line(13, 20, 17, 24, LEG); // one leg lifted in mid stride
        c.line(17, 24, 15, 28, LEG);
        c.rect(15, 29, 18, 29, LEG);
        leg(26, 22, 25, 21);
        c.line(30, 20, 34, 24, LEG);
        c.line(34, 24, 32, 27, LEG);
        c.rect(32, 28, 35, 28, LEG);
        c.col(34, 10, 15, SEAL); // water slops over
        c.col(4, 10, 13, SEAL);
      }
      return () => u && dots(c, SEAL, [36, 12, 36, 17, 1, 14, 2, 22, 35, 24, 10, b + 1, 27, b + 1]);
    },
    sw: 22,
    s(c, u) {
      const b = 32;
      c.poly([[3, 10], [18, 10], [16, 19], [5, 19]], ENAM);
      c.oval(2, 6, 19, 11, ENAM);
      c.oval(4, 7, 17, 9, SEAL);
      ring(c, 2, 6, 19, 11, ROSE);
      c.row(6, 5, 16, L(ENAM));
      c.row(19, 5, 16, D(ENAM));
      c.line(3, 11, 5, 19, L(ENAM));
      dots(c, C.white, [6, 7, 7, 7, 13, 8, 14, 7]);
      if (!u) c.rect(9, 5, 11, 6, MUST), c.set(10, 4, MUST), c.set(11, 7, C.flame);
      const LEG = hex('#b89a6a');
      if (!u) {
        for (const x of [6, 15]) c.col(x, 20, b - 1, LEG), c.rect(x - 1, b, x + 1, b, LEG), c.set(x, 26, D(LEG));
      } else {
        c.col(6, 20, b - 1, LEG);
        c.rect(5, b, 7, b, LEG);
        c.col(15, 20, 26, LEG); // the other foot comes at us
        c.rect(13, 27, 17, 29, LEG);
        c.row(29, 13, 17, D(LEG));
        c.col(18, 11, 16, SEAL);
        c.col(3, 11, 14, SEAL);
      }
      return () => u && dots(c, SEAL, [20, 14, 1, 16, 20, 20, 10, b + 1]);
    },
  });

  const WAR = hex('#5a3a2a');
  function snowWood(c, x0, y0, x1, y1) {
    c.rect(x0, y0, x1, y1, hex('#7f93a6'));
    c.rect(x0, y1 - 8, x1, y1, SNOW);
    c.row(y1 - 9, x0 + 2, x1 - 3, SNOW);
    const T = hex('#2f3a40');
    for (const [x, h] of [[x0 + 2, 22], [x0 + 6, 16], [x1 - 3, 24], [x1 - 7, 14]]) {
      c.col(x, y1 - 6 - h, y1 - 6, T);
      for (let k = 2; k < h - 3; k += 4) c.row(y1 - 6 - h + k, x - 1 - ((k / 8) | 0), x + 1 + ((k / 8) | 0), T);
    }
    const m = (x0 + x1) >> 1;
    c.col(m, y1 - 16, y1 - 7, NI); // a far lamp-post
    c.rect(m - 1, y1 - 18, m + 1, y1 - 16, WARM);
    for (let i = 0; i < 12; i++) c.set(x0 + ((i * 7) % (x1 - x0 + 1)), y0 + 2 + ((i * 11) % (y1 - y0 - 12)), C.white);
  }
  O('wardrobe-snowy-wood', 'wardrobe that opens onto a snowy wood fur coats winter forest inside', {
    w: 26,
    h: 44,
    uw: 38,
    f(c, u) {
      const b = 42,
        o = u ? 6 : 0;
      c.rect(2 + o, 4, 23 + o, b - 2, WAR);
      c.rect(1 + o, 2, 24 + o, 4, WAR);
      c.row(2, 1 + o, 24 + o, L(WAR));
      c.col(2 + o, 5, b - 2, L(WAR));
      c.rect(3 + o, b - 1, 5 + o, b, D(WAR));
      c.rect(20 + o, b - 1, 22 + o, b, D(WAR));
      if (!u) {
        for (const x of [4, 13]) {
          c.rect(x, 7, x + 8, b - 5, D(WAR));
          c.frame(x, 7, x + 8, b - 5, WAR);
          c.rect(x + 2, 10, x + 6, b - 8, WAR);
          c.col(x + 2, 10, b - 8, L(WAR));
        }
        c.set(11, 24, C.brass);
        c.set(14, 24, C.brass);
        c.row(b - 2, 9, 17, SNOW); // snow sifts out under the doors
        dots(c, SNOW, [5, 8, 6, 9, 20, 8, 12, 7]);
      } else {
        snowWood(c, 4 + o, 6, 21 + o, b - 4);
        c.rect(4 + o, 6, 6 + o, 24, hex('#6a5a4a')); // fur coats pushed aside
        c.rect(19 + o, 6, 21 + o, 26, hex('#4f4640'));
        c.row(5, 4 + o, 21 + o, NI);
        for (const [x0, x1] of [[1, 7], [30, 36]]) {
          c.rect(x0, 5, x1, b - 3, D(WAR)); // the doors stand wide
          c.frame(x0, 5, x1, b - 3, WAR);
          c.rect(x0 + 2, 9, x1 - 2, b - 7, WAR);
        }
        c.rect(8, b - 2, 30, b, SNOW);
        c.row(b - 3, 12, 26, SNOW);
      }
      return () => u && dots(c, C.white, [9, 30, 3, 36, 33, 34, 28, 39, 5, 41, 35, 41, 18, 43]);
    },
    sw: 12,
    suw: 22,
    s(c, u) {
      const b = 42;
      c.rect(2, 4, 9, b - 2, WAR);
      c.rect(1, 2, 10, 4, WAR);
      c.row(2, 1, 10, L(WAR));
      c.col(2, 5, b - 2, L(WAR));
      c.rect(3, 8, 8, b - 6, D(WAR));
      c.rect(2, b - 1, 3, b, D(WAR));
      c.rect(8, b - 1, 9, b, D(WAR));
      if (!u) {
        c.set(10, 24, C.brass);
        c.row(b - 2, 9, 10, SNOW);
      } else {
        c.rect(10, 5, 18, b - 3, D(WAR)); // a door, open toward the room
        c.frame(10, 5, 18, b - 3, WAR);
        c.rect(12, 9, 16, b - 7, WAR);
        c.col(9, 6, b - 4, hex('#7f93a6'));
        c.rect(9, b - 2, 20, b, SNOW);
        c.row(b - 3, 10, 15, SNOW);
      }
      return () => u && dots(c, C.white, [12, 3, 20, 12, 19, 24, 21, 33, 14, 43]);
    },
  });

  const POOL = hex('#8fa3b0');
  function mirrorPool(c, x0, x1, b, u) {
    c.oval(x0, b - 8, x1, b, hex('#4a4a50'));
    c.oval(x0 + 1, b - 7, x1 - 1, b - 1, POOL);
    c.row(b - 6, x0 + 5, x1 - 8, L(POOL));
    const m = (x0 + x1) >> 1;
    if (!u) {
      c.oval(m + 3, b - 6, m + 6, b - 4, MOON); // the moon in it, though there is none above
      c.set(m + 6, b - 5, POOL);
      dots(c, C.white, [x0 + 5, b - 3, m - 3, b - 5, x1 - 4, b - 4]);
    } else {
      ring(c, m - 7, b - 7, m + 6, b - 2, L(POOL));
      ring(c, m - 4, b - 6, m + 3, b - 3, C.white);
      const PALE = hex('#c8c0b0');
      c.rect(m - 1, b - 15, m, b - 4, PALE); // an arm rises out of it
      c.col(m - 1, b - 15, b - 4, L(PALE));
      c.rect(m - 2, b - 18, m + 1, b - 16, PALE);
      dots(c, PALE, [m - 3, b - 19, m - 1, b - 20, m + 1, b - 20, m + 2, b - 19, m + 2, b - 17]);
    }
    for (const x of [x0 + 1, x0 + 3, x1 - 2]) c.col(x, b - 11 + (x % 3), b - 5, GRASS); // reeds
    c.set(x0 + 3, b - 12, WD);
  }
  O('mirror-pool', 'mirror pool still water on the ground reflecting a moon reeds silver', {
    w: 36,
    h: 14,
    uh: 24,
    solid: false,
    f(c, u) {
      mirrorPool(c, 1, 34, c.h - 2, u);
    },
    sw: 22,
    suh: 24,
    s(c, u) {
      mirrorPool(c, 1, 20, c.h - 2, u);
    },
  });

  const CAR = hex('#4f5d4c');
  O('train-carriage-alone', 'railway carriage standing alone no engine old train coach windows rails', {
    w: 64,
    h: 34,
    base: 'side',
    f(c, u) {
      const b = 32;
      c.rect(2, 6, 61, 23, CAR);
      c.rect(3, 3, 60, 5, hex('#3a3a42'));
      c.row(3, 4, 59, hex('#5a5a66'));
      c.row(6, 2, 61, L(CAR));
      c.col(2, 6, 23, L(CAR));
      c.row(15, 2, 61, MUST);
      for (let i = 0; i < 6; i++) {
        const x = 12 + i * 8;
        c.rect(x, 8, x + 5, 13, u ? WARM : NI);
        c.frame(x - 1, 7, x + 6, 14, D(CAR));
        if (u && i % 2 === 0) c.rect(x + 1 + (i % 3), 10, x + 3 + (i % 3), 13, hex('#3a3030')), c.set(x + 2 + (i % 3), 9, hex('#3a3030'));
        else if (!u) c.set(x + 1, 9, hex('#3b4650'));
      }
      c.rect(4, 8, 8, 23, u ? hex('#2a2018') : D(CAR)); // the door
      c.frame(4, 8, 8, 23, D(CAR));
      if (u) c.rect(5, 12, 7, 23, WARM), c.rect(3, 24, 9, 25, IR), c.rect(2, 27, 8, 28, IR);
      else c.rect(5, 10, 7, 13, NI), c.set(7, 17, C.brass);
      c.rect(3, 24, 60, 25, ID);
      for (const x of [9, 17, 43, 51]) {
        c.oval(x, 25, x + 5, 30, ID);
        ring(c, x, 25, x + 5, 30, IR);
        c.set(x + 2, 27, C.steel);
      }
      c.rect(0 + 1, 22, 1, 23, IR);
      c.rect(62, 22, 62, 23, IR);
      c.row(b - 1, 1, 62, C.steel); // a length of rail and nothing more
      for (let x = 2; x <= 60; x += 5) c.rect(x, b, x + 2, b, WD);
      return () => u && dots(c, CLD, [58, 1, 59, 0, 60, 1, 1, 26, 0, 25]);
    },
    sw: 22,
    s(c, u) {
      const b = 32;
      c.rect(2, 6, 19, 23, CAR);
      c.oval(2, 2, 19, 9, hex('#3a3a42'));
      c.rect(2, 6, 19, 8, CAR);
      c.row(6, 3, 18, L(CAR));
      c.col(2, 7, 23, L(CAR));
      c.row(15, 2, 19, MUST);
      c.rect(8, 8, 13, 23, u ? WARM : D(CAR));
      c.frame(8, 8, 13, 23, D(CAR));
      if (u) c.rect(9, 11, 12, 20, hex('#2a2018')), c.rect(10, 13, 11, 20, hex('#3a3030')), c.set(10, 12, hex('#3a3030'));
      else c.rect(9, 10, 12, 13, NI), c.set(12, 17, C.brass);
      for (const x of [4, 15]) c.rect(x, 9, x + 1, 12, u ? WARM : NI);
      c.rect(3, 24, 18, 25, ID);
      c.rect(4, 22, 5, 23, IR); // buffers
      c.rect(16, 22, 17, 23, IR);
      c.rect(4, 26, 5, 30, ID);
      c.rect(16, 26, 17, 30, ID);
      c.row(b - 1, 3, 4, C.steel);
      c.row(b - 1, 17, 18, C.steel);
      c.rect(2, b, 19, b, WD);
      c.set(10, 5, u ? C.red : hex('#5c1418'));
      return () => u && dots(c, WARM, [7, 24, 14, 24, 10, 26, 11, 26]);
    },
  });

  const HORSE = hex('#d0c8b4');
  O('carousel-horse-loose', 'carousel horse got loose merry go round horse with a broken brass pole fairground', {
    w: 36,
    h: 40,
    base: 'side',
    f(c, u) {
      const b = 38,
        HD = D(HORSE);
      if (!u) {
        c.rect(16, 1, 17, 14, C.brass); // the pole, snapped off above
        for (let y = 2; y <= 14; y += 3) c.set(16, y, L(C.brass)), c.set(17, y + 1, D(C.brass));
        c.set(16, 0 + 1, null);
        c.clear(17, 1);
        c.rect(16, 26, 17, 29, C.brass);
        c.clear(16, 29);
      }
      c.oval(7, 15, 26, 26, HORSE); // body
      c.row(25, 10, 23, HD);
      const hx = u ? -2 : 0,
        hy = u ? 3 : 0;
      c.poly([[21, 17], [26, 19], [30 + hx, 9 + hy], [26 + hx, 6 + hy]], HORSE); // neck
      c.poly([[25 + hx, 5 + hy], [29 + hx, 5 + hy], [34 + hx, 11 + hy], [33 + hx, 13 + hy], [29 + hx, 11 + hy], [26 + hx, 9 + hy]], HORSE); // head
      c.set(26 + hx, 4 + hy, HORSE);
      c.set(27 + hx, 3 + hy, HORSE);
      c.set(29 + hx, 7 + hy, u ? C.red : NI);
      c.set(33 + hx, 12 + hy, NI);
      c.line(31 + hx, 12 + hy, 28 + hx, 9 + hy, ROSE); // bridle
      for (let k = 0; k < 9; k++) c.set(22 + Math.round(((26 + hx - 22) * k) / 8), 16 - Math.round(((16 - 6 - hy) * k) / 8), MINT), c.set(21 + Math.round(((25 + hx - 21) * k) / 8), 17 - Math.round(((17 - 7 - hy) * k) / 8), D(MINT));
      c.rect(12, 14, 20, 17, ROSE); // saddle
      c.row(14, 12, 20, L(ROSE));
      c.rect(13, 18, 19, 19, MUST);
      c.set(16, 20, MUST);
      c.line(7, 17, 3, u ? 14 : 22, MINT); // tail
      c.line(6, 17, 2, u ? 15 : 23, D(MINT));
      const leg = (x0, y0, x1, y1, x2, y2) => {
        c.line(x0, y0, x1, y1, HORSE);
        c.line(x0 + 1, y0, x1 + 1, y1, HORSE);
        c.line(x1, y1, x2, y2, HORSE);
        c.line(x1 + 1, y1, x2 + 1, y2, HD);
        c.rect(x2, y2, x2 + 1, y2, MUST);
      };
      if (!u) {
        leg(9, 25, 6, 30, 4, 35); // frozen at the gallop
        leg(12, 25, 12, 31, 9, 36);
        leg(22, 25, 26, 28, 24, 33);
        leg(24, 24, 30, 25, 31, 30);
      } else {
        leg(9, 25, 8, 31, 8, b); // standing on its own feet now
        leg(12, 25, 13, 31, 12, b);
        leg(22, 25, 22, 31, 22, b);
        leg(24, 24, 28, 28, 27, 33);
      }
      return () => {
        if (!u) return void dots(c, C.brass, [15, b, 18, b + 1]);
        dots(c, C.ash, [31, 17, 33, 18, 34, 16]); // breath
      };
    },
    sw: 16,
    s(c, u) {
      const b = 38,
        HD = D(HORSE);
      if (!u) {
        c.rect(7, 1, 8, 8, C.brass);
        for (let y = 2; y <= 8; y += 3) c.set(7, y, L(C.brass));
        c.clear(8, 1);
      }
      c.oval(4, 14, 11, 27, HORSE); // chest
      c.rect(5, u ? 9 : 6, 10, 16, HORSE); // head, toward us
      c.rect(6, u ? 15 : 12, 9, u ? 20 : 17, HORSE);
      c.row(u ? 20 : 17, 6, 9, HD);
      dots(c, NI, [6, u ? 19 : 16, 9, u ? 19 : 16]);
      c.set(5, u ? 12 : 9, u ? C.red : NI);
      c.set(10, u ? 12 : 9, u ? C.red : NI);
      c.set(5, u ? 8 : 5, HORSE);
      c.set(10, u ? 8 : 5, HORSE);
      c.rect(7, u ? 8 : 5, 8, u ? 11 : 8, MINT);
      c.row(u ? 14 : 11, 5, 10, ROSE);
      c.rect(3, 18, 4, 22, ROSE); // saddle cloth either side
      c.rect(11, 18, 12, 22, ROSE);
      if (!u) {
        c.rect(5, 27, 6, 31, HORSE);
        c.rect(5, 32, 6, 33, MUST);
        c.rect(9, 26, 10, 28, HORSE);
        c.rect(9, 29, 10, 30, MUST);
      } else {
        c.rect(5, 27, 6, b - 1, HORSE);
        c.rect(5, b, 6, b, MUST);
        c.rect(9, 27, 10, b - 1, HD);
        c.rect(9, b, 10, b, MUST);
      }
      return () => u && dots(c, C.ash, [3, 21, 12, 22]);
    },
  });
};
