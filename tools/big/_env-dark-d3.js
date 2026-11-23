/* Dream world, part 3: creatures, flocks and fields, and things stacked where they should not be. */
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
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IR = C.iron,
    ID = C.ironDark,
    GRASS = hex('#55684a'),
    WARM = hex('#d9b25a'),
    DRED = hex('#8a3a34');

  const lighthouse = (alt) => (c, u) => {
    const b = 44;
    c.oval(1, b - 5, 16, b + 3, C.stoneDark); // its rock
    c.clearRect(0, b + 1, 17, b + 4);
    c.row(b - 4, 4, 9, C.stone);
    c.poly([[5, 13], [12, 13], [14, b - 4], [3, b - 4]], PAPER);
    for (const y of [17, 27, 37]) c.rect(4, y, 13, y + 4, DRED);
    c.clearRect(0, 13, 3, 20);
    for (let y = 13; y <= b - 4; y++) {
      const k = Math.round(((y - 13) * 2) / (b - 17));
      c.clearRect(0, y, 4 - k, y);
      c.clearRect(13 + k, y, 17, y);
      c.set(5 - k, y, c.get(5 - k, y) === DRED ? L(DRED) : L(PAPER));
    }
    c.rect(3, 11, 14, 12, ID); // gallery
    dots(c, IR, [3, 10, 6, 10, 9, 10, 12, 10, 14, 10]);
    c.rect(6, 6, 11, 10, u ? WARM : hex('#3b4650'));
    if (u) c.rect(8, 7, 9, 9, C.flameLight);
    c.col(6, 6, 10, ID);
    c.col(11, 6, 10, ID);
    c.poly([[5, 5], [12, 5], [9, 2], [8, 2]], DRED);
    c.set(8, 1, IR);
    if (!alt) c.rect(8, b - 9, 9, b - 5, WD), c.set(9, b - 7, C.brass);
    c.rect(8, 22, 9, 24, u ? WARM : NI);
    dots(c, SNOW, [1, b, 2, b - 1, 15, b, 16, b - 1, 3, b]);
    return () => {
      if (!u) return;
      if (alt) return void dots(c, WARM, [4, 6, 13, 6, 4, 9, 13, 9, 8, 4, 9, 4, 5, 4, 12, 4]);
      for (let k = 1; k <= 5; k++) dots(c, k % 2 ? WARM : MOON, [5 - k, 8 - (k >> 1), 5 - k, 8 + (k >> 1), 12 + k, 8 - (k >> 1), 12 + k, 8 + (k >> 1)]);
    };
  };
  O('lighthouse-small', 'lighthouse the size of a person little striped lighthouse on a rock lamp beam', {
    w: 18,
    h: 46,
    f: lighthouse(false),
    sw: 18,
    s: lighthouse(true),
  });

  const CAT = hex('#7a7672'),
    CATd = hex('#55524f');
  O('cat-giant-sleeping', 'giant sleeping cat curled up as big as a sofa grey tabby', {
    w: 50,
    h: 26,
    base: 'side',
    f(c, u) {
      const b = 24;
      c.oval(3, 6, 42, b, CAT);
      c.oval(6, 7, 30, 16, L(CAT));
      for (let x = 10; x <= 32; x += 5) c.line(x, 7 + Math.abs(x - 22) / 5, x - 2, 14, CATd);
      c.oval(33, 10, 47, b, CAT); // the head on its paws
      c.poly([[34, 12], [35, 7], [38, 10]], CAT);
      c.poly([[43, 10], [u ? 47 : 46, u ? 6 : 7], [47, 12]], CAT);
      c.set(36, 9, ROSE);
      c.set(45, 9, ROSE);
      c.row(13, 38, 42, CATd);
      if (u) {
        c.rect(36, 16, 38, 17, hex('#a8a05a')); // one eye opens
        c.col(37, 16, 17, NI);
      } else c.row(17, 36, 38, NI);
      c.row(17, 42, 44, NI);
      c.set(40, 19, ROSE);
      dots(c, NI, [39, 21, 40, 20 + 1, 41, 21]);
      dots(c, CLD, [34, 20, 33, 21, 46, 20, 47, 21]);
      c.rect(30, b - 2, 37, b, L(CAT)); // paws
      c.set(33, b, CATd);
      // the tail, round to the front
      const ty = u ? b - 5 : b - 1;
      c.rect(4, b - 2, 26, b, CAT);
      c.row(b - 2, 5, 25, L(CAT));
      for (let x = 7; x <= 24; x += 4) c.col(x, b - 2, b, CATd);
      c.rect(26, ty - 1, 29, ty + 1, CATd);
      if (u) c.rect(25, b - 4, 27, b - 2, CAT);
      return () => {
        if (!u) dots(c, CLD, [48, 4, 49, 2, 47, 6]); // z z z
      };
    },
    sw: 30,
    s(c, u) {
      const b = 24;
      c.oval(2, 3, 27, b, CAT); // the mound of it behind
      c.oval(5, 4, 20, 12, L(CAT));
      for (let x = 7; x <= 23; x += 4) c.col(x, 4 + Math.abs(x - 15) / 3, 9, CATd);
      c.oval(7, 9, 22, b, CAT);
      c.poly([[8, 12], [9, 6], [13, 10]], CAT);
      c.poly([[16, 10], [20, 6], [21, 12]], CAT);
      c.set(10, 9, ROSE);
      c.set(19, 9, ROSE);
      c.rect(13, 11, 16, 12, CATd);
      for (const x of [10, 17]) {
        if (u) c.rect(x, 15, x + 2, 16, hex('#a8a05a')), c.col(x + 1, 15, 16, NI);
        else c.row(16, x, x + 2, NI);
      }
      c.set(14, 18, ROSE);
      c.set(15, 18, ROSE);
      dots(c, NI, [13, 20, 14, 19 + 1, 15, 20, 16, 20]);
      dots(c, CLD, [8, 19, 6, 20, 21, 19, 23, 20]);
      c.rect(9, b - 1, 13, b, L(CAT));
      c.rect(16, b - 1, 20, b, L(CAT));
      c.rect(22, b - 2, 27, b, CATd); // tail tip
    },
  });

  const DEER = hex('#8a6a50');
  function candleTip(c, x, y, u) {
    c.col(x, y - 2, y, BN);
    c.set(x, y - 3, u ? C.flameLight : C.black);
    if (u) c.set(x, y - 4, C.flame);
  }
  O('deer-candle-antlers', 'deer with candles on its antlers stag white spots forest spirit', {
    w: 36,
    h: 46,
    base: 'side',
    f(c, u) {
      const b = 44,
        hy = u ? -2 : 0;
      c.oval(5, 22, 24, 31, DEER);
      c.row(30, 8, 21, D(DEER));
      c.row(31, 9, 20, PAPER);
      dots(c, PAPER, [9, 24, 12, 23, 15, 25, 18, 24, 11, 26]);
      c.rect(4, 22, 5, 24, PAPER); // tail
      c.poly([[20, 24], [25, 26], [28, 15 + hy], [24, 14 + hy]], DEER); // neck
      c.poly([[24, 11 + hy], [28, 11 + hy], [33, 15 + hy], [32, 17 + hy], [27, 16 + hy], [24, 15 + hy]], DEER);
      c.set(23, 11 + hy, DEER);
      c.set(22, 10 + hy, DEER);
      c.set(28, 13 + hy, u ? MOON : NI);
      c.set(33, 16 + hy, NI);
      for (const [x, k] of [[7, 0], [10, 1], [19, 0], [22, 1]]) {
        c.col(x, 31, b - 1, k ? D(DEER) : DEER);
        c.col(x + 1, 31, 36, k ? D(DEER) : DEER);
        c.set(x, b, NI);
      }
      // antlers, and a candle on each tine
      const A = BN;
      c.line(25, 10 + hy, 22, 3 + hy, A);
      c.line(23, 6 + hy, 19, 5 + hy, A);
      c.line(27, 10 + hy, 30, 4 + hy, A);
      c.line(29, 6 + hy, 33, 6 + hy, A);
      for (const [x, y] of [[22, 2], [19, 4], [30, 3], [33, 5], [26, 6]]) candleTip(c, x, y + hy + (x === 26 ? 3 : 0), u);
      return () => u && dots(c, WARM, [20, 0, 24, 1, 28, 0, 34, 1, 17, 2, 31, 9]);
    },
    sw: 22,
    s(c, u) {
      const b = 44,
        hy = u ? -2 : 0;
      c.oval(6, 20, 15, 32, DEER); // chest
      c.rect(8, 28, 13, 31, PAPER);
      c.rect(8, 12 + hy, 13, 22, DEER);
      c.rect(9, 17 + hy, 12, 21 + hy, D(DEER)); // muzzle
      c.row(21 + hy, 10, 11, NI);
      c.set(8, 15 + hy, u ? MOON : NI);
      c.set(13, 15 + hy, u ? MOON : NI);
      c.rect(5, 12 + hy, 7, 13 + hy, DEER);
      c.rect(14, 12 + hy, 16, 13 + hy, DEER);
      c.col(8, 32, b - 1, DEER);
      c.col(13, 32, b - 1, D(DEER));
      c.set(8, b, NI);
      c.set(13, b, NI);
      const A = BN;
      c.line(9, 11 + hy, 5, 5 + hy, A);
      c.line(6, 7 + hy, 2, 7 + hy, A);
      c.line(12, 11 + hy, 16, 5 + hy, A);
      c.line(15, 7 + hy, 19, 7 + hy, A);
      for (const [x, y] of [[5, 4], [2, 6], [16, 4], [19, 6]]) candleTip(c, x, y + hy, u);
      return () => u && dots(c, WARM, [3, 1, 7, 0, 14, 0, 18, 1, 10, 4, 11, 4]);
    },
  });

  function crane(c, x, y, col, up, flip) {
    const X = (i) => (flip ? x + 7 - i : x + i);
    for (let i = 0; i <= 6; i++) c.set(X(i), y + 3, i < 2 ? D(col) : col);
    c.set(X(6), y + 2, col);
    c.set(X(7), y + 1, col);
    c.set(X(8), y + 2, D(col));
    c.set(X(0), y + 2, D(col));
    if (up) c.set(X(3), y, col), c.set(X(3), y + 1, col), c.set(X(4), y + 1, D(col)), c.set(X(2), y + 2, col), c.set(X(3), y + 2, col), c.set(X(4), y + 2, D(col));
    else c.set(X(2), y + 4, col), c.set(X(3), y + 4, col), c.set(X(4), y + 4, D(col)), c.set(X(3), y + 5, D(col));
  }
  const CR = [[2, 30, 0], [14, 26, 1], [5, 16, 2], [18, 12, 0], [9, 5, 1], [20, 34, 2]];
  const CRC = [PAPER, ROSE, MINT];
  O('paper-cranes-flock', 'flock of paper cranes origami birds hovering in the air folded paper', {
    w: 32,
    h: 44,
    solid: false,
    f(c, u) {
      CR.forEach(([x, y, k], i) => {
        if (u && i === 5) {
          c.poly([[20, 38], [28, 36], [29, 40], [21, 42]], PAPER); // one comes undone: a sheet of paper, falling
          c.line(20, 38, 29, 40, D(PAPER));
          return;
        }
        crane(c, x + (u ? (i % 2 ? 3 : -1) : 0), u ? Math.max(1, y - 5 - i) : y, CRC[k], u ? i % 2 === 0 : i % 2 === 1, i % 3 === 1);
      });
      return () => u && dots(c, CLD, [4, 34, 16, 30, 8, 22, 24, 20]);
    },
    sw: 18,
    s(c, u) {
      CR.forEach(([x, y, k], i) => {
        if (u && i === 5) return void (c.rect(9, 38, 14, 41, PAPER), c.row(41, 9, 14, D(PAPER)));
        const cx = 3 + ((x * 0.45) | 0),
          cy = u ? Math.max(1, y - 5 - i) : y,
          col = CRC[k],
          wy = (u ? i % 2 === 0 : i % 2 === 1) ? -1 : 1;
        c.rect(cx + 2, cy + 2, cx + 3, cy + 4, col); // head on: a body and two wings
        c.set(cx + 2, cy + 1, D(col));
        for (let j = 1; j <= 3; j++) c.set(cx + 2 - j, cy + 3 + wy * j, col), c.set(cx + 3 + j, cy + 3 + wy * j, D(col));
      });
    },
  });

  function eyeFlowers(c, xs, b, u) {
    c.row(b, xs[0] - 3, xs[xs.length - 1] + 3, D(GRASS));
    for (let x = xs[0] - 3; x <= xs[xs.length - 1] + 3; x += 2) c.col(x, b - 1 - ((x * 5) % 3), b, x % 3 ? GRASS : D(GRASS));
    xs.forEach((x, i) => {
      const h = 11 + ((i * 5) % 6),
        t = b - h,
        col = i % 2 ? LILAC : ROSE;
      c.col(x, t + 3, b - 1, hex('#44563e'));
      c.set(x + (i % 2 ? 1 : -1), t + 7, GRASS);
      if (!u) {
        c.rect(x - 1, t, x + 1, t + 3, col); // a bud, shut like an eyelid
        c.set(x, t - 1, col);
        c.col(x, t, t + 3, D(col));
        c.set(x - 1, t, L(col));
      } else {
        c.oval(x - 2, t - 1, x + 2, t + 3, C.white);
        c.rect(x - 1, t, x + 1, t + 2, i % 3 ? hex('#5a7a78') : hex('#7a6a4a'));
        c.set(x, t + 1, NI);
        dots(c, col, [x - 3, t - 1, x + 3, t - 1, x - 3, t + 3, x + 3, t + 3, x, t - 2, x, t + 4]);
      }
    });
  }
  O('eye-flowers-field', 'field of eyes like flowers stems with eyes instead of blooms watching meadow', {
    w: 36,
    h: 22,
    solid: false,
    f(c, u) {
      eyeFlowers(c, [5, 11, 17, 23, 30], 20, u);
    },
    sw: 20,
    s(c, u) {
      eyeFlowers(c, [5, 11, 15], 20, u);
    },
  });

  O('cloud-sheep', 'cloud sheep a sheep made of cloud floating just off the ground black face rain', {
    w: 30,
    h: 26,
    base: 'side',
    f(c, u) {
      const b = 24,
        col = u ? hex('#8d8f9c') : CLD;
      for (const x of [8, 11, 19, 22]) c.col(x, 15, 19, NI);
      cloud(c, 3, 4, 24, 16, col, 3);
      cloud(c, 5, 6, 20, 15, col, 7);
      c.rect(23, 7, 27, 12, hex('#2a2830')); // the face
      c.set(22, 7, hex('#2a2830'));
      c.set(22, 6, hex('#2a2830'));
      c.set(26, 9, PAPER);
      c.row(12, 24, 26, hex('#2a2830'));
      return () => {
        if (!u) return void dots(c, mix(CLD, 0.7), [9, b, 10, b, 14, b, 20, b, 21, b]); // a shadow: it does not touch the ground
        for (const x of [6, 10, 14, 17, 21]) for (let y = 17 + (x % 3); y < b; y += 3) c.set(x, y, SEAL), c.set(x, y + 1, SEA);
        c.row(b, 4, 23, SEA);
        dots(c, SEAL, [7, b, 15, b, 20, b]);
      };
    },
    sw: 20,
    s(c, u) {
      const b = 24,
        col = u ? hex('#8d8f9c') : CLD;
      for (const x of [6, 13]) c.col(x, 15, 19, NI);
      cloud(c, 2, 3, 17, 16, col, 5);
      c.rect(7, 7, 12, 13, hex('#2a2830'));
      c.rect(5, 7, 6, 8, hex('#2a2830'));
      c.rect(13, 7, 14, 8, hex('#2a2830'));
      c.set(8, 9, PAPER);
      c.set(11, 9, PAPER);
      c.row(12, 9, 10, ROSE);
      return () => {
        if (!u) return void dots(c, mix(CLD, 0.7), [7, b, 8, b, 12, b]);
        for (const x of [4, 9, 15]) for (let y = 17 + (x % 3); y < b; y += 3) c.set(x, y, SEAL), c.set(x, y + 1, SEA);
        c.row(b, 3, 16, SEA);
      };
    },
  });

  function jar(c, x, y, lit, open) {
    c.rect(x, y + 1, x + 3, y + 5, lit ? hex('#6f7f6a') : hex('#4a5a60'));
    c.col(x, y + 1, y + 5, C.glassLight);
    if (!open) c.rect(x, y, x + 3, y, MUST);
    if (lit) c.set(x + 1, y + 3, C.glow), c.set(x + 2, y + 3, MOON), c.set(x + 1, y + 2, MOON), c.set(x + 2, y + 4, MOON);
  }
  O('star-jars-shelf', 'jars of stars on a shelf glass jars each holding a caught star glowing', {
    w: 26,
    h: 36,
    f(c, u) {
      const b = 34;
      c.col(2, 4, b, WD);
      c.col(23, 4, b, WD);
      c.set(2, 3, W);
      c.set(23, 3, W);
      for (const y of [12, 22, 32]) c.rect(2, y, 23, y + 1, W), c.row(y, 2, 23, WL);
      const J = [[4, 6], [10, 6], [17, 6], [6, 16], [14, 16], [19, 16], [5, 26], [12, 26], [18, 26]];
      J.forEach(([x, y], i) => {
        if (u && i === 4) {
          c.rect(13, 19, 18, 21, hex('#4a5a60')); // tipped over, lid off, empty
          c.row(19, 13, 18, C.glassLight);
          c.set(20, 21, MUST);
          return;
        }
        jar(c, x, y, i !== 6, false);
      });
      return () => {
        dots(c, MOON, [3, 9, 22, 19, 9, 29]);
        if (u) star(c, 21, 4, C.glow, true), star(c, 19, 9, MOON), star(c, 18, 13, MOON), c.set(24, 1, C.white);
      };
    },
    sw: 12,
    s(c, u) {
      const b = 34;
      c.rect(2, 4, 3, b, WD);
      c.col(2, 4, b, W);
      c.line(3, 30, 8, 22, WD);
      for (const y of [12, 22, 32]) c.rect(2, y, 9, y + 1, W), c.row(y, 2, 9, WL);
      jar(c, 5, 6, true, false);
      if (u) c.rect(5, 19, 9, 21, hex('#4a5a60')), c.row(19, 5, 9, C.glassLight);
      else jar(c, 5, 16, true, false);
      jar(c, 5, 26, false, false);
      return () => {
        dots(c, MOON, [10, 9, 10, 18]);
        if (u) star(c, 9, 13, C.glow, true), star(c, 10, 3, MOON);
      };
    },
  });

  const boxWater = (alt) => (c, u) => {
    const b = 44,
      WTR = u ? hex('#7fb0a6') : hex('#4f7a80');
    c.rect(2, 5, 17, b, DRED);
    c.oval(2, 2, 17, 8, DRED);
    c.col(2, 6, b, L(DRED));
    c.rect(5, 6, 14, 7, u ? MOON : PAPER); // the sign
    c.rect(1, b - 1, 18, b, D(DRED));
    for (let y = 10; y <= b - 9; y += 7)
      for (let x = 4; x <= 12; x += 4) {
        c.rect(x, y, x + 2, y + 5, WTR);
        c.set(x, y, L(WTR));
      }
    if (alt) c.rect(4, 10, 14, b - 5, WTR), c.col(8, 10, b - 5, DRED), c.col(12, 10, b - 5, DRED), c.rect(4, 22, 14, 23, DRED);
    dots(c, C.moss, [5, 36, 5, 34, 6, 32, 13, 37, 13, 35, 12, 33, 9, 38]); // weed growing inside
    c.rect(alt ? 5 : 9, 26, alt ? 6 : 10, 26, ROSE); // a fish
    c.set(alt ? 7 : 11, 26, D(ROSE));
    dots(c, C.white, [6, 13, 10, 19, 13, 12, 5, 21]);
    if (u) {
      c.rect(8, 17, 9, 21, NI); // the receiver floats up on its cord
      c.set(10, 22, NI);
      c.set(11, 23, NI);
    } else c.rect(12, 18, 13, 22, NI);
    if (!alt) c.set(15, 25, C.brass);
    return () => {
      c.row(b + 1, u ? 0 : 5, u ? 19 : 14, SEA);
      if (!u) return void c.set(9, b, SEAL);
      c.col(16, b - 6, b, SEAL); // it runs out at the door
      dots(c, C.white, [7, 1, 11, 0, 9, 3]);
      dots(c, SEAL, [3, b + 1, 12, b + 1, 17, b + 1]);
    };
  };
  O('telephone-box-underwater', 'telephone box full of water red phone box flooded inside fish seaweed', {
    w: 20,
    h: 47,
    f: boxWater(false),
    sw: 20,
    s: boxWater(true),
  });

  const BOOKS = [C.wine, C.navy, C.forest, C.mustard, C.slate, C.plum, C.teal, C.parchment, hex('#8a5560')];
  function bookStack(c, x0, x1, y0, y1, seed) {
    const r = rnd(seed);
    let y = y1;
    while (y >= y0) {
      const h = y - y0 < 2 ? y - y0 + 1 : 2 + ((r() * 2) | 0),
        col = BOOKS[(r() * BOOKS.length) | 0],
        dx = (r() * 2) | 0;
      c.rect(x0 + dx, y - h + 1, x1 - ((r() * 2) | 0), y, col);
      c.row(y - h + 1, x0 + dx, x1 - 1, L(col));
      c.set(x0 + dx + 2, y - (h >> 1), C.gold);
      c.col(x1, y - h + 1, y, PAPER);
      y -= h;
    }
  }
  O('staircase-of-books', 'staircase made of books stacked volumes steps going up to nothing library', {
    w: 42,
    h: 38,
    base: 'side',
    f(c, u) {
      const b = 36;
      for (let i = 0; i < 5; i++) {
        const top = b - 6 * (i + 1) + 1;
        if (u && i === 4) bookStack(c, 1 + i * 8, 8 + i * 8, top + 14, b, 3 + i);
        else bookStack(c, 1 + i * 8, 8 + i * 8, top, b, 3 + i);
      }
      if (u) {
        c.rect(33, 16, 39, 17, C.wine); // books sliding off the top
        c.line(34, 13, 40, 11, C.navy);
        c.line(34, 14, 40, 12, PAPER);
      }
      return () => {
        if (!u) return;
        c.line(28, 4, 31, 6, PAPER); // one flies off, flapping
        c.line(31, 6, 34, 3, PAPER);
        c.set(31, 7, C.wine);
        dots(c, C.ash, [36, 9, 38, 20]);
      };
    },
    sw: 20,
    s(c, u) {
      const b = 36;
      for (let i = 4; i >= 0; i--) {
        if (u && i === 4) continue;
        const top = b - 6 * (i + 1) + 1;
        bookStack(c, 2 + (i >> 1), 17 - (i >> 1), top, top + 5, 3 + i);
        c.row(top, 2 + (i >> 1), 17 - (i >> 1), PAPER);
      }
      if (u) {
        c.rect(4, 8, 10, 9, C.wine);
        c.line(9, 5, 15, 7, C.navy);
        c.line(9, 6, 15, 8, PAPER);
      }
      return () => u && (c.line(3, 1, 6, 3, PAPER), c.line(6, 3, 9, 0, PAPER));
    },
  });

  function chairS(c, x, b, col, flip) {
    const X = (i) => (flip ? x + 8 - i : x + i);
    c.col(X(0), b - 13, b, col);
    c.col(X(1), b - 13, b - 7, D(col));
    c.set(X(0), b - 13, L(col));
    for (let i = 0; i <= 8; i++) c.set(X(i), b - 6, L(col)), c.set(X(i), b - 5, col);
    c.col(X(7), b - 4, b, col);
    c.col(X(8), b - 4, b, D(col));
    for (let i = 2; i <= 6; i++) c.set(X(i), b - 2, D(col));
  }
  function chairF(c, x, b, col) {
    c.rect(x, b - 13, x + 8, b - 7, col);
    c.rect(x + 2, b - 11, x + 6, b - 8, D(col));
    c.row(b - 13, x, x + 8, L(col));
    c.rect(x, b - 6, x + 8, b - 5, L(col));
    c.col(x, b - 4, b, col);
    c.col(x + 8, b - 4, b, D(col));
    c.row(b - 2, x + 1, x + 7, D(col));
  }
  const CH = [W, hex('#5a6a84'), WL, hex('#8a5560')];
  O('tower-of-chairs', 'tower of chairs stacked one on another impossibly high teetering pile', {
    w: 22,
    h: 62,
    uw: 30,
    f(c, u) {
      const b = 60;
      for (let i = 0; i < 4; i++) {
        const lean = u ? i * 2 : i % 2;
        if (u && i === 3) {
          const t = part(9, 14, (t) => chairS(t, 0, 13, CH[3], false)); // the top one is on its way down
          c.stamp(turn(t, true), 15, 6);
        } else chairS(c, 5 + lean, b - i * 14, CH[i], i % 2 === 1);
      }
      return () => u && dots(c, C.ash, [14, 3, 28, 22, 27, 4]);
    },
    sw: 14,
    suw: 20,
    s(c, u) {
      const b = 60;
      for (let i = 0; i < 4; i++) {
        if (u && i === 3) {
          c.rect(9, 6, 17, 12, CH[3]); // falling toward us, seat first
          c.frame(9, 6, 17, 12, D(CH[3]));
          dots(c, CH[3], [9, 13, 17, 13, 9, 4, 17, 4, 9, 5, 17, 5]);
        } else chairF(c, 2 + (i % 2) + (u ? i : 0), b - i * 14, CH[i]);
      }
    },
  });

  O('window-frame-weather', 'window frame hanging in the air with other weather behind it storm rain sash window', {
    w: 24,
    h: 46,
    f(c, u) {
      const STORM = hex('#4a5060');
      c.rect(2, 5, 21, 33, PAPER);
      c.row(5, 2, 21, L(PAPER));
      c.col(2, 5, 33, L(PAPER));
      c.rect(1, 33, 22, 34, D(PAPER)); // the sill
      c.rect(4, 7, 19, 31, u ? hex('#6a7284') : STORM);
      cloud(c, 4, 7, 13, 12, hex('#7a7c88'), 3);
      cloud(c, 10, 9, 19, 14, hex('#6a6c78'), 5);
      for (let i = 0; i < 26; i++) c.set(4 + ((i * 7) % 16), 14 + ((i * 11) % 18), SEAL);
      if (u) c.line(9, 12, 7, 18, MOON), c.line(7, 18, 10, 18, MOON), c.line(10, 18, 8, 24, MOON);
      c.col(11, 7, 31, PAPER);
      c.col(12, 7, 31, D(PAPER));
      const sash = u ? 12 : 19; // the lower sash, pushed up when used
      c.rect(4, sash, 19, sash + 1, PAPER);
      if (u) c.rect(4, 26, 19, 31, hex('#3a4050')), c.rect(4, 12, 19, 13, PAPER), c.row(25, 4, 19, D(PAPER));
      return () => {
        dots(c, CLD, [6, 38, 7, 38, 16, 39, 17, 39, 11, 41]); // it hangs on nothing
        if (!u) return;
        for (let i = 0; i < 12; i++) c.set(2 + ((i * 5) % 20), 35 + ((i * 3) % 8), i % 2 ? SEAL : SEA); // the rain comes through
        c.row(45, 3, 20, SEA);
        dots(c, SEAL, [6, 45, 14, 45]);
      };
    },
    sw: 12,
    s(c, u) {
      c.rect(4, 5, 6, 33, PAPER);
      c.col(4, 5, 33, L(PAPER));
      c.col(6, 6, 32, hex('#4a5060'));
      c.rect(3, 33, 8, 34, D(PAPER));
      if (u) c.rect(7, 12, 7, 25, PAPER);
      return () => {
        dots(c, CLD, [4, 38, 5, 38, 6, 40]);
        if (!u) return;
        for (let i = 0; i < 10; i++) c.set(7 + ((i * 3) % 5), 27 + i * 2 - ((i * 3) % 5), i % 2 ? SEAL : SEA);
        c.row(45, 5, 11, SEA);
      };
    },
  });

  const PJ = hex('#aab7c4'),
    PJs = hex('#6f809a');
  function stripes(c, x0, y0, x1, y1) {
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) if (c.get(x, y) === PJ && (x - x0) % 3 === 1) c.set(x, y, PJs);
  }
  O('pyjamas-empty-standing', 'the dreamer s own empty pyjamas standing up with nobody inside striped nightclothes slippers', {
    w: 18,
    h: 34,
    uh: 12,
    solid: false,
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.oval(2, b - 6, 15, b, PJ); // fallen in a heap
        c.rect(1, b - 2, 16, b, PJ);
        stripes(c, 1, b - 6, 16, b);
        c.line(4, b - 3, 9, b - 5, D(PJs));
        c.line(9, b - 1, 14, b - 3, D(PJs));
        c.rect(11, b - 7, 13, b - 6, PJ);
        c.set(12, b - 7, NI);
        c.rect(0 + 1, b, 3, b, ROSE);
        return;
      }
      c.rect(4, 4, 13, 18, PJ); // jacket
      c.rect(2, 5, 3, 17, PJ); // sleeves
      c.rect(14, 5, 15, 17, PJ);
      c.rect(5, 19, 8, b - 2, PJ); // legs
      c.rect(10, 19, 13, b - 2, PJ);
      stripes(c, 2, 4, 15, b - 2);
      c.rect(7, 3, 10, 5, NI); // nobody in the collar
      c.set(6, 3, PJ);
      c.set(11, 3, PJ);
      c.line(6, 4, 8, 7, L(PJ));
      c.line(11, 4, 9, 7, L(PJ));
      for (const y of [9, 12, 15]) c.set(9, y, PAPER);
      c.row(18, 4, 13, D(PJs));
      c.row(17, 2, 3, NI);
      c.row(17, 14, 15, NI);
      c.row(b - 2, 5, 8, NI);
      c.row(b - 2, 10, 13, NI);
      c.rect(4, b - 1, 8, b, ROSE); // slippers
      c.rect(10, b - 1, 14, b, ROSE);
      c.row(b - 1, 5, 7, L(ROSE));
    },
    sw: 12,
    suw: 14,
    suh: 12,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        c.oval(2, b - 6, 11, b, PJ);
        c.rect(1, b - 2, 12, b, PJ);
        stripes(c, 1, b - 6, 12, b);
        c.line(3, b - 3, 8, b - 5, D(PJs));
        c.rect(9, b, 12, b, ROSE);
        return;
      }
      c.rect(3, 4, 8, 18, PJ);
      c.rect(4, 19, 8, b - 2, PJ);
      stripes(c, 3, 4, 8, b - 2);
      c.rect(5, 6, 6, 17, D(PJ)); // the sleeve
      c.row(17, 5, 6, NI);
      c.rect(5, 3, 8, 4, NI);
      c.set(4, 3, PJ);
      c.row(18, 3, 8, D(PJs));
      c.row(b - 2, 4, 8, NI);
      c.rect(4, b - 1, 10, b, ROSE);
      c.row(b - 1, 6, 9, L(ROSE));
    },
  });
};
