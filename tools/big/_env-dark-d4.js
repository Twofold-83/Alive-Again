/* Dream world, part 4: caged weather, time, post, and the last odd things. */
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
    BR = hex('#9a7a54'),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IR = C.iron,
    ID = C.ironDark,
    WARM = hex('#d9b25a'),
    DRED = hex('#8a3a34'),
    GLASS = hex('#6f8a94');

  const cage = (alt) => (c, u) => {
    const b = 40;
    c.rect(8, 22, 9, b - 1, BR); // the stand
    c.rect(5, b, 12, b, D(BR));
    c.row(b - 1, 6, 11, BR);
    ring(c, 7, 1, 10, 4, BR);
    c.oval(3, 3, 14, 12, NI);
    c.rect(3, 8, 14, 20, NI);
    if (!u) cloud(c, 5, 9, 12, 15, CLD, alt ? 5 : 2), dots(c, SEAL, [6, 17, 9, 18, 11, 17]);
    else c.line(6, 19, 9, 18, CLD); // only a feather of it left
    for (let x = 3; x <= 14; x += 2) c.col(x, 8, 20, x % 4 === 3 ? BR : D(BR));
    ring(c, 3, 3, 14, 13, BR);
    for (let x = 5; x <= 12; x += 2) c.col(x, 4, 7, D(BR));
    c.rect(3, 8, 14, 8, BR);
    c.rect(3, 20, 14, 21, BR);
    c.row(20, 3, 14, L(BR));
    if (u) {
      const dx = alt ? 3 : 10;
      c.rect(dx, 11, dx + 3, 18, NI); // the little door stands open
      c.col(dx + (alt ? -1 : 4), 11, 18, L(BR));
    }
    return () => {
      if (!u) return;
      const x = alt ? 0 : 12;
      dots(c, CLD, [x + 1, 24, x + 2, 24, x + 3, 24, x, 25, x + 1, 25, x + 2, 25, x + 3, 25, x + 4, 25, x + 1, 23, x + 2, 23]);
      dots(c, SEAL, [x + 1, 27, x + 3, 28]);
    };
  };
  O('cage-with-cloud', 'bird cage with a little cloud inside instead of a bird brass cage on a stand', {
    w: 18,
    h: 42,
    f: cage(false),
    sw: 18,
    s: cage(true),
  });

  O('swing-from-sky', 'swing hanging from the sky ropes going up into a cloud wooden seat', {
    w: 22,
    h: 60,
    solid: false,
    f(c, u) {
      const b = 58,
        dx = u ? 5 : 0;
      for (let y = 8; y <= b - 12; y++) {
        const k = Math.round((dx * (y - 8)) / (b - 20));
        c.set(6 + k, y, y % 2 ? MUST : D(MUST));
        c.set(14 + k, y, y % 2 ? MUST : D(MUST));
      }
      c.rect(4 + dx, b - 11, 16 + dx, b - 10, W);
      c.row(b - 11, 4 + dx, 16 + dx, WL);
      cloud(c, 2, 1, 18, 9, CLD, 4);
      return () => {
        if (!u) return void dots(c, mix(CLD, 0.7), [8, b + 1, 9, b + 1, 12, b + 1]);
        dots(c, C.ash, [2, b - 14, 1, b - 11, 3, b - 8]);
        c.rect(12, b - 4, 14, b - 3, DRED); // one small shoe, dropped
        c.set(15, b - 3, DRED);
      };
    },
    sw: 12,
    s(c, u) {
      const b = 58;
      for (let y = 8; y <= b - 12; y++) c.set(u ? 5 + Math.round(((y - 8) * 4) / (b - 20)) : 5, y, y % 2 ? MUST : D(MUST));
      const x = u ? 7 : 3;
      c.rect(x, b - 11 - (u ? 3 : 0), x + 4, b - 10 - (u ? 3 : 0), W);
      c.row(b - 11 - (u ? 3 : 0), x, x + 4, WL);
      cloud(c, 1, 1, 10, 9, CLD, 4);
      return () => {
        if (!u) return void dots(c, mix(CLD, 0.7), [4, b + 1, 5, b + 1]);
        dots(c, C.ash, [1, b - 14, 2, b - 10]);
        c.rect(5, b - 4, 7, b - 3, DRED);
      };
    },
  });

  function bloom(c, x, y, col, big) {
    c.set(x, y, MUST);
    dots(c, col, [x - 1, y, x + 1, y, x, y - 1, x, y + 1]);
    if (big) dots(c, L(col), [x - 1, y - 1, x + 1, y - 1, x - 1, y + 1, x + 1, y + 1]);
  }
  O('gramophone-horn-flowers', 'gramophone with flowers growing out of its horn record player brass horn blooms', {
    w: 28,
    h: 34,
    f(c, u) {
      const b = 32;
      c.rect(3, b - 9, 20, b, W);
      c.row(b - 9, 3, 20, WL);
      c.col(3, b - 9, b, WL);
      c.rect(5, b - 6, 18, b - 2, WD);
      c.rect(4, b - 11, 19, b - 10, NI); // the record
      c.row(b - 11, 6, 17, u ? C.ash : hex('#2a2a33'));
      c.set(11, b - 11, DRED);
      c.rect(21, b - 6, 23, b - 5, IR); // crank
      c.col(23, b - 8, b - 5, IR);
      c.line(13, b - 12, 15, 16, BR); // the neck of the horn
      c.line(14, b - 12, 16, 16, D(BR));
      c.poly([[13, 17], [18, 17], [25, 5], [8, 3]], BR);
      c.line(8, 3, 13, 17, L(BR));
      c.poly([[10, 4], [24, 6], [20, 10], [12, 9]], NI);
      const fl = [[11, 3, ROSE], [16, 2, LILAC], [21, 4, MINT], [14, 6, PAPER], [19, 7, ROSE]];
      for (const [x, y] of fl) c.col(x, y + 1, y + 3, hex('#44563e'));
      for (const [x, y, col] of fl) bloom(c, x, y - (u ? 1 : 0), col, u);
      return () => u && (dots(c, ROSE, [3, 4, 26, 1, 5, 9]), dots(c, LILAC, [1, 8, 24, 12]), dots(c, MOON, [6, 1, 27, 9, 2, 13]));
    },
    sw: 20,
    s(c, u) {
      const b = 32;
      c.rect(3, b - 9, 16, b, W);
      c.row(b - 9, 3, 16, WL);
      c.col(3, b - 9, b, WL);
      c.rect(5, b - 6, 14, b - 2, WD);
      c.rect(4, b - 11, 15, b - 10, NI);
      c.row(b - 11, 6, 13, u ? C.ash : hex('#2a2a33'));
      c.col(9, 18, b - 12, BR);
      c.col(10, 18, b - 12, D(BR));
      c.oval(2, 2, 17, 17, BR); // the horn, mouth toward us
      ring(c, 2, 2, 17, 17, L(BR));
      c.oval(5, 5, 14, 14, NI);
      const fl = [[7, 7, ROSE], [12, 6, LILAC], [9, 11, MINT], [13, 11, PAPER]];
      for (const [x, y, col] of fl) bloom(c, x, y, col, u);
      return () => u && (dots(c, ROSE, [0, 4, 19, 8]), dots(c, MOON, [18, 1, 1, 15]));
    },
  });

  const SAND = hex('#b89e62');
  const hourglass = (alt) => (c, u) => {
    const b = 42;
    c.rect(2, 2, 15, 4, W);
    c.row(2, 2, 15, WL);
    c.rect(2, b - 2, 15, b, W);
    c.row(b - 2, 2, 15, WL);
    c.poly([[4, 5], [13, 5], [13, 14], [9, 21], [8, 21], [4, 14]], GLASS);
    c.poly([[4, b - 3], [13, b - 3], [13, 28], [9, 21], [8, 21], [4, 28]], GLASS);
    c.col(5, 6, 13, C.glassLight);
    c.col(5, 29, b - 4, C.glassLight);
    if (!u) {
      c.poly([[5, 9], [12, 9], [12, 14], [9, 19], [8, 19], [5, 14]], SAND);
      c.col(8, 20, b - 6, SAND);
      c.poly([[5, b - 3], [12, b - 3], [10, b - 6], [7, b - 6]], SAND);
      c.row(9, 5, 12, L(SAND));
    } else {
      c.poly([[5, b - 3], [12, b - 3], [12, 30], [9, 27], [8, 27], [5, 30]], SAND); // it has all run down, and now runs up
      c.row(30, 6, 11, L(SAND));
      for (let y = 8; y <= 26; y += 2) c.set(8 + (y % 4 ? 0 : 1), y, SAND);
      c.row(5, 6, 11, SAND);
      c.row(6, 7, 10, SAND);
    }
    if (alt) c.col(3, 5, b - 3, WD), c.col(14, 5, b - 3, WD), c.col(9, 5, 8, WD), c.col(9, 34, b - 3, WD);
    else c.col(3, 5, b - 3, WD), c.col(14, 5, b - 3, WD);
    c.set(3, 20, W);
    c.set(14, 22, W);
    return () => u && dots(c, SAND, [8, 0, 10, 1, 6, 1, 16, 6, 1, 9]);
  };
  O('hourglass-giant', 'giant hourglass as tall as a person sand timer wooden frame time running', {
    w: 18,
    h: 44,
    f: hourglass(false),
    sw: 18,
    s: hourglass(true),
  });

  const WAX = hex('#d2c8a8');
  const candle = (alt) => (c, u) => {
    const b = 44;
    c.rect(4, 9, 11, b - 2, WAX);
    c.col(4, 9, b - 2, L(WAX));
    c.col(5, 9, b - 2, L(WAX));
    c.col(11, 10, b - 2, D(WAX));
    c.oval(1, b - 4, 14, b, WAX); // the pool it stands in
    c.row(b, 3, 12, D(WAX));
    c.rect(4, 8, 11, 9, D(WAX));
    c.row(9, 6, 9, hex('#a89868'));
    for (const [x, n] of alt ? [[4, 12], [8, 20], [11, 7]] : [[5, 16], [9, 9], [11, 22]]) {
      c.col(x, 9, 9 + n, L(WAX));
      c.set(x, 10 + n, WAX);
      c.set(x + 1, 9 + n, D(WAX));
    }
    c.col(8, 5, 8, NI);
    if (u) {
      c.poly([[6, 7], [8, 1], [10, 7]], C.flame);
      c.col(8, 4, 7, C.flameLight);
      c.set(8, 7, C.glow);
      c.rect(6, 17, 6, 18, hex('#7a6a4a')); // a face melts into the wax
      c.rect(9, 17, 9, 18, hex('#7a6a4a'));
      c.rect(7, 22, 8, 24, hex('#7a6a4a'));
      c.set(6, 19, D(WAX));
      c.set(9, 19, D(WAX));
    }
    return () => {
      if (u) dots(c, WARM, [4, 3, 12, 3, 3, 6, 13, 6, 8, 0]);
      else dots(c, C.ash, [8, 3, 9, 1]);
    };
  };
  O('candle-giant-melting', 'giant candle as tall as a person melting wax dripping pool flame', {
    w: 16,
    h: 46,
    f: candle(false),
    sw: 16,
    s: candle(true),
  });

  const BIRCH = hex('#b9b6a8');
  function keyTree(c, m, wide, u, seed) {
    const b = 48,
      r = rnd(seed);
    c.rect(m - 1, 14, m + 1, b, BIRCH);
    c.col(m - 1, 14, b, L(BIRCH));
    c.rect(m - 3, b - 1, m + 3, b, BIRCH);
    for (let y = 18; y < b; y += 5) c.set(m + (y % 2), y, NI), c.set(m - 1 + (y % 3), y + 2, C.stoneDark);
    const ends = [];
    for (const s of [-1, 1])
      for (let i = 0; i < 4; i++) {
        const y0 = 30 - i * 6,
          len = Math.round(wide * (0.5 + i * 0.17)),
          x1 = m + s * len,
          y1 = y0 - 8 - i;
        c.line(m, y0, x1, y1, BIRCH);
        c.line(m + s * (len >> 1), y0 - 4, m + s * (len >> 1) + s * 2, y0 - 9, BIRCH);
        ends.push([x1, y1 + 1], [m + s * (len >> 1), y0 - 3]);
      }
    c.line(m, 14, m, 4, BIRCH);
    ends.push([m, 5]);
    const fallen = [],
      keys = [];
    ends.forEach(([x, y], i) => {
      if (u && i % 4 === 1) return void fallen.push(x);
      const n = 2 + ((r() * 4) | 0),
        dx = u ? (i % 2 ? 1 : -1) : 0,
        col = [C.gold, BR, C.steel, C.brass][i % 4];
      keys.push(() => {
        for (let k = 0; k < n; k++) c.set(x + Math.round((dx * k) / n), y + k, C.stoneDark);
        const kx = x + dx,
          ky = y + n;
        c.rect(kx - 1, ky, kx, ky + 1, col); // bow, shank and bit
        c.set(kx - 1, ky + 1, D(col));
        c.col(kx, ky + 2, ky + 4, col);
        c.set(kx + 1, ky + 4, D(col));
        c.set(kx + 1, ky + 3, D(col));
      });
    });
    fallen.keys = keys;
    return fallen;
  }
  O('tree-hung-with-keys', 'tree hung with keys pale birch bare branches keys on threads swinging', {
    w: 36,
    h: 50,
    f(c, u) {
      const fallen = keyTree(c, 17, 15, u, 4);
      return () => {
        fallen.keys.forEach((k) => k());
        fallen.forEach((x, i) => {
          const fx = Math.max(2, Math.min(31, x + (i % 2 ? 2 : -2)));
          c.row(49, fx, fx + 2, i % 2 ? C.gold : BR);
          c.set(fx + 3, 48, C.gold);
        });
        if (u) star(c, 6, 9, MOON, true), star(c, 30, 14, C.white);
      };
    },
    sw: 24,
    s(c, u) {
      const fallen = keyTree(c, 11, 9, u, 9);
      return () => {
        fallen.keys.forEach((k) => k());
        fallen.forEach((x, i) => c.row(49, Math.max(2, Math.min(19, x + i)), Math.max(2, Math.min(19, x + i)) + 2, i % 2 ? C.gold : BR));
        if (u) star(c, 3, 10, MOON, true);
      };
    },
  });

  function letter(c, x, y, tilt) {
    c.rect(x, y, x + 3, y + 2, PAPER);
    c.set(x + 1 + (tilt ? 1 : 0), y + 1, DRED);
    c.row(y + 2, x, x + 3, D(PAPER));
  }
  const pillarBox = (alt) => (c, u) => {
    const b = 34;
    c.rect(3, 6, 12, b - 2, DRED);
    c.oval(2, 2, 13, 8, DRED);
    c.row(8, 2, 13, D(DRED));
    c.col(3, 9, b - 2, L(DRED));
    c.col(4, 9, b - 2, L(DRED));
    c.col(12, 9, b - 2, D(DRED));
    c.rect(2, b - 1, 13, b, hex('#2a2830'));
    c.rect(5, 11, 10, 12, NI); // the slot
    c.rect(6, 15, 9, 19, PAPER);
    c.row(16, 7, 8, NI);
    c.row(18, 7, 8, NI);
    c.rect(alt ? 5 : 6, 23, alt ? 8 : 9, 29, D(DRED));
    c.set(alt ? 8 : 6, 26, C.brass);
    if (u) c.rect(6, 10, 9, 11, PAPER), c.set(7, 10, DRED);
    letter(c, alt ? 9 : 1, b - 2, false);
    return () => {
      if (!u) return;
      letter(c, alt ? 1 : 11, 4, true);
      letter(c, alt ? 11 : 0, 13, false);
      letter(c, alt ? 0 : 12, 20, true);
      letter(c, 6, 0, false);
      letter(c, alt ? 4 : 8, b - 1, true);
      letter(c, alt ? 12 : 4, b, false);
    };
  };
  O('pillar-box-letters', 'pillar box letter box red post box letters flying out of the slot mail', {
    w: 16,
    h: 37,
    f: pillarBox(false),
    sw: 16,
    s: pillarBox(true),
  });

  const CASE = hex('#6a7888');
  O('clock-moon-pendulum', 'tall clock with no hands and a moon for a pendulum longcase grandfather clock blue', {
    w: 18,
    h: 48,
    uw: 26,
    f(c, u) {
      const b = 46;
      c.rect(3, 3, 14, 15, CASE);
      c.oval(3, 1, 14, 6, CASE);
      c.rect(4, 16, 13, b - 8, CASE);
      c.rect(2, b - 7, 15, b, CASE);
      c.col(3, 4, 15, L(CASE));
      c.col(4, 16, b - 8, L(CASE));
      c.row(b - 7, 2, 15, L(CASE));
      c.row(15, 3, 14, D(CASE));
      c.oval(5, 5, 12, 12, PAPER); // a face without hands
      for (let a = 0; a < 12; a += 3) c.set(8.5 + 3 * Math.sin((a * Math.PI) / 6), 8.5 - 3 * Math.cos((a * Math.PI) / 6), NI);
      c.rect(6, 18, 11, b - 10, u ? SKY : hex('#2a3038'));
      c.frame(5, 17, 12, b - 9, D(CASE));
      if (!u) {
        c.col(8, 18, 27, MUST);
        c.oval(6, 27, 10, 32, MOON);
        c.oval(8, 27, 11, 31, hex('#2a3038'));
      } else {
        dots(c, MOON, [7, 20, 10, 24, 8, 30, 10, 34, 7, 35]);
        c.rect(13, 17, 18, b - 9, D(CASE)); // the little door open
        c.frame(13, 17, 18, b - 9, CASE);
        c.rect(14, 19, 17, b - 11, GLASS);
      }
      return () => {
        if (!u) return;
        const t = part(6, 7, (t) => {
          t.oval(0, 0, 4, 5, MOON);
          for (let y = 0; y < 6; y++) for (let x = 0; x < 5; x++) if (((x - 3.6) / 2.4) ** 2 + ((y - 2) / 2.5) ** 2 <= 1) t.clear(x, y);
        });
        shadowed(c, t, 20, 7); // the moon has got out, and rises
        dots(c, MOON, [19, 15, 22, 17, 24, 4, 18, 3]);
      };
    },
    sw: 12,
    suw: 20,
    s(c, u) {
      const b = 46;
      c.rect(3, 3, 8, 15, CASE);
      c.row(2, 4, 7, CASE);
      c.rect(4, 16, 7, b - 8, CASE);
      c.rect(2, b - 7, 9, b, CASE);
      c.col(3, 4, 15, L(CASE));
      c.col(4, 16, b - 8, L(CASE));
      c.row(15, 3, 8, D(CASE));
      c.col(9, 5, 12, PAPER);
      c.col(8, 17, b - 9, u ? SKY : D(CASE));
      if (u) {
        c.rect(9, 17, 14, b - 9, D(CASE));
        c.frame(9, 17, 14, b - 9, CASE);
        c.rect(10, 19, 13, b - 11, GLASS);
      }
      return () => {
        if (!u) return;
        c.rect(15, 6, 16, 11, MOON);
        c.set(17, 7, MOON);
        c.set(17, 10, MOON);
        dots(c, MOON, [13, 14, 18, 3]);
      };
    },
  });

  const globe = (alt) => (c, u) => {
    const b = 28;
    c.rect(4, b - 5, 21, b, W);
    c.row(b - 5, 4, 21, WL);
    c.rect(3, b - 1, 22, b, WD);
    c.rect(10, b - 3, 15, b - 2, C.brass);
    c.oval(3, 1, 22, 24, hex('#55707c'));
    c.clearRect(0, 23, 25, 24);
    c.rect(4, 23, 21, 23, hex('#55707c'));
    ring(c, 3, 1, 22, 26, C.glassLight);
    c.clearRect(3, 23, 22, 26);
    c.rect(5, 19, 20, 22, SNOW);
    c.row(18, 7, 18, SNOW);
    // a little house and a fir
    if (alt) c.rect(9, 13, 14, 18, PAPER), c.poly([[8, 13], [15, 13], [12, 9], [11, 9]], hex('#5b5a66')), c.rect(11, 15, 12, 18, u ? WARM : NI);
    else c.rect(8, 13, 15, 18, PAPER), c.poly([[7, 13], [16, 13], [14, 10], [9, 10]], hex('#5b5a66')), c.rect(9, 15, 10, 18, DBLUE), c.rect(12, 14, 14, 16, u ? WARM : NI);
    c.row(alt ? 9 : 10, alt ? 11 : 9, alt ? 12 : 14, SNOW);
    const fx = alt ? 17 : 18;
    c.col(fx, 12, 18, hex('#2f4038'));
    c.row(14, fx - 1, fx + 1, hex('#2f4038'));
    c.row(16, fx - 1, fx + 1, hex('#2f4038'));
    c.set(6, 6, C.white);
    c.set(7, 5, C.white);
    const r = rnd(alt ? 5 : 2);
    for (let i = 0; i < (u ? 34 : 4); i++) {
      const x = 5 + ((r() * 16) | 0),
        y = 3 + ((r() * 15) | 0);
      if (((x - 12.5) / 9) ** 2 + ((y - 12.5) / 11) ** 2 < 0.85) c.set(x, y, C.white);
    }
    return () => u && dots(c, C.ash, [1, 4, 0, 8, 24, 5, 25, 9]);
  };
  O('snow-globe-giant-house', 'giant snow globe with a little house inside glass dome snowing shaken', {
    w: 26,
    h: 30,
    f: globe(false),
    sw: 26,
    s: globe(true),
  });

  const BOAT = hex('#6a5a48');
  O('rowing-boat-on-clouds', 'rowing boat resting on clouds wooden boat oars lantern sky sailing', {
    w: 46,
    h: 24,
    base: 'side',
    f(c, u) {
      const b = 22;
      c.poly([[2, 8], [43, 8], [39, 16], [8, 16]], BOAT);
      c.row(8, 2, 43, L(BOAT));
      c.row(11, 5, 41, D(BOAT));
      c.row(14, 7, 40, D(BOAT));
      c.line(2, 8, 8, 16, L(BOAT));
      c.col(41, 3, 8, IR); // the lantern on its crook at the bow
      c.rect(38, 3, 40, 3, IR);
      c.rect(37, 4, 39, 7, u ? WARM : hex('#3b4650'));
      c.set(38, 5, u ? C.flameLight : ID);
      if (!u) {
        c.line(8, 7, 30, 5, WL); // oars shipped
        c.rect(30, 4, 34, 5, WL);
      } else {
        c.line(18, 7, 10, 19, WL); // an oar out, pulling through the cloud
        c.rect(8, 18, 10, 21, WL);
        c.set(18, 6, IR);
      }
      cloud(c, 1, 13, 44, b, CLD, 6);
      cloud(c, 6, 15, 24, b - 1, CLD, 2);
      if (u) c.rect(8, 16, 10, 18, WL);
      return () => {
        if (!u) return;
        dots(c, WARM, [36, 2, 40, 1, 35, 6]);
        dots(c, CLD, [0, 10, 1, 9, 0, 13]);
      };
    },
    sw: 22,
    s(c, u) {
      const b = 22;
      c.poly([[4, 8], [17, 8], [14, 16], [10, 18], [7, 16]], BOAT); // bow on
      c.row(8, 4, 17, L(BOAT));
      c.col(10, 9, 17, L(BOAT));
      c.col(11, 9, 17, D(BOAT));
      c.line(4, 8, 7, 16, L(BOAT));
      c.col(10, 3, 8, IR);
      c.rect(9, 4, 12, 7, u ? WARM : hex('#3b4650'));
      c.set(10, 5, u ? C.flameLight : ID);
      if (u) {
        c.line(4, 8, 1, 14, WL);
        c.line(17, 8, 20, 14, WL);
        c.rect(0 + 1, 14, 1, 17, WL);
        c.rect(20, 14, 20, 17, WL);
      }
      cloud(c, 1, 14, 20, b, CLD, 6);
      return () => u && dots(c, WARM, [7, 3, 14, 4, 11, 1]);
    },
  });

  const TOOTH = hex('#dcd8c8');
  const tooth = (alt) => (c, u) => {
    const b = 24;
    c.oval(2, 2, 13, 14, TOOTH);
    c.rect(2, 8, 13, 13, TOOTH);
    if (alt) c.poly([[4, 13], [11, 13], [9, b], [7, b]], TOOTH);
    else c.poly([[2, 13], [7, 13], [5, b], [3, b]], TOOTH), c.poly([[8, 13], [13, 13], [12, b], [10, b]], TOOTH);
    c.col(3, 5, 16, L(TOOTH));
    c.set(4, 4, C.white);
    c.set(5, 3, C.white);
    c.row(2, 6, 9, D(TOOTH));
    c.set(7, 3, D(TOOTH));
    c.col(12, 6, 15, D(TOOTH));
    if (u) {
      c.line(8, 2, 7, 6, NI); // it cracks: a black hole, and something gold in it
      c.line(7, 6, 9, 9, NI);
      c.oval(6, 8, 10, 12, NI);
      c.set(8, 10, C.gold);
      c.set(alt ? 8 : 4, b - 1, C.blood);
      c.set(alt ? 7 : 11, b, C.blood);
    }
    return () => u && dots(c, C.blood, alt ? [6, b + 1, 10, b + 1] : [2, b + 1, 6, b + 1, 13, b + 1]);
  };
  O('tooth-giant', 'giant tooth molar standing on its roots as big as a stool dream of teeth', {
    w: 16,
    h: 27,
    f: tooth(false),
    sw: 16,
    s: tooth(true),
  });

  O('desk-exam-alone', 'school desk alone with an exam paper and a pencil the test you did not study for', {
    w: 28,
    h: 24,
    base: 'side',
    f(c, u) {
      const b = 22;
      c.rect(11, 8, 25, 9, WL); // desk top
      c.row(8, 11, 25, C.woodPale);
      c.rect(12, 10, 24, 12, W);
      c.col(13, 13, b, IR);
      c.col(24, 10, b, IR);
      c.row(b, 12, 25, ID);
      c.rect(2, 13, 9, 14, W); // the seat, joined to it
      c.row(13, 2, 9, WL);
      c.rect(2, 4, 3, 13, W);
      c.col(2, 4, 13, WL);
      c.col(3, 15, b, IR);
      c.col(8, 15, b, IR);
      c.row(b - 3, 8, 13, IR);
      c.row(b, 2, 9, ID);
      if (!u) {
        c.rect(15, 7, 21, 7, PAPER);
        c.rect(22, 7, 24, 7, MUST);
      } else c.set(23, 7, MUST), c.set(21, 7, MUST); // the pencil, snapped
      return () => {
        if (!u) return;
        for (const [x, y] of [[14, 2], [20, 0], [24, 4], [9, 1]]) c.rect(x, y, x + 3, y + 2, PAPER), c.row(y + 1, x + 1, x + 2, C.ash);
        dots(c, C.red, [15, 3, 21, 1]);
      };
    },
    sw: 18,
    s(c, u) {
      const b = 22;
      c.rect(3, 3, 14, 6, W); // the chair back behind
      c.row(3, 3, 14, WL);
      c.col(3, 7, 8, IR);
      c.col(14, 7, 8, IR);
      c.rect(1, 8, 16, 9, WL);
      c.row(8, 1, 16, C.woodPale);
      c.rect(2, 10, 15, 13, W);
      c.rect(4, 11, 13, 12, NI);
      c.col(2, 14, b, IR);
      c.col(15, 14, b, IR);
      c.row(b, 1, 16, ID);
      c.row(b - 4, 3, 14, IR);
      if (!u) {
        c.rect(6, 7, 11, 7, PAPER);
        c.set(13, 7, MUST);
      } else c.set(12, 7, MUST), c.set(14, 7, MUST);
      return () => {
        if (!u) return;
        for (const [x, y] of [[2, 1], [8, 0], [13, 3]]) c.rect(x, y, x + 3, y + 2, PAPER), c.row(y + 1, x + 1, x + 2, C.ash);
        dots(c, C.red, [9, 1]);
      };
    },
  });
};
