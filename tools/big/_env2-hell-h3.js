/* Hell, part 3: the pool, the clerk's desk, the jars, the statue, the tree, the pit, the bell, the forge. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, chain, chainH, thin, rusty, drip, pool, bars, ring, flame, fire, sparks, skull, skullS, bone, rock, spike, wheel, eyes, planks } = H;
  const { OBS, OBL, BAS, BASL, BRIM, BRIML, EMBER, LAVA, LAVAL, SULF, SULFL, CHAR, BONE, BONED, BL, BD, NI, SOUL, SOULD, HIDE } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    WD = hex('#3c2a24'),
    WL = hex('#5a4034'),
    BR = hex('#8a7436'),
    CASE = hex('#3a2226'),
    CASEL = hex('#553238'),
    STONE = hex('#5a5560'),
    BRONZE = hex('#5a4a2c'),
    PARCH = C.parchment;

  /* ---------- sulphur pool ---------- */
  function sulf(c, u, x1) {
    const b = c.h - 2,
      m = (2 + x1) >> 1;
    c.rect(4, b - 2, x1 - 3, b, SULF);
    c.row(b - 2, 6, x1 - 6, SULFL);
    c.row(b, 4, x1 - 3, D(SULF));
    dots(c, D(SULF), [8, b - 1, m + 3, b - 1, x1 - 7, b - 1]);
    rock(c, 1, b - 4, 7, b, BAS, 1, 0.4);
    rock(c, x1 - 6, b - 5, x1, b, BAS, 2, 0.6);
    dots(c, SULFL, [3, b - 4, x1 - 3, b - 5, 6, b - 2]);
    if (u) {
      // a hand comes up out of it
      c.rect(m, b - 9, m + 1, b - 2, BONE);
      c.col(m + 1, b - 9, b - 2, BONED);
      dots(c, BONE, [m - 1, b - 11, m - 1, b - 10, m, b - 11, m, b - 10, m + 2, b - 11, m + 2, b - 10, m + 1, b - 10, m + 3, b - 9, m + 1, b - 12]);
      ring(c, m - 3, b - 3, m + 4, b - 1, SULFL);
      ring(c, 9 - 2, b - 4, 9 + 1, b - 2, SULFL);
      dots(c, SULF, [m - 2, b - 4, m + 3, b - 5]);
    } else {
      c.set(m - 3, b - 3, SULFL);
      c.rect(m + 2, b - 3, m + 3, b - 3, SULFL);
    }
    return () => dots(c, SULFL, u ? [m - 5, b - 8, m + 5, b - 12, m - 6, b - 14, 5, b - 9, x1 - 4, b - 10] : [m - 2, b - 6, m + 4, b - 8]);
  }
  O('hell-sulphur-pool', 'sulphur pool yellow brimstone pond stinking water rocks bubbling acid', {
    w: 32,
    h: 14,
    uh: 22,
    f: (c, u) => sulf(c, u, 29),
    sw: 22,
    suh: 22,
    s: (c, u) => sulf(c, u, 19),
  });

  /* ---------- black candle stand ---------- */
  function bcandle(c, x, y0, y1, lit) {
    c.rect(x, y0, x + 1, y1, hex('#231f29'));
    c.col(x, y0, y1, hex('#3d3747'));
    if (lit) {
      c.set(x, y0 - 1, C.flame);
      c.set(x + 1, y0 - 1, EMBER);
      c.set(x, y0 - 2, C.flameLight);
      c.set(x, y0 - 3, C.flame);
    } else c.set(x + 1, y0 - 1, NI);
  }
  O('hell-candle-stand-black', 'black candle stand wrought iron candelabrum three black candles ritual light', {
    w: 18,
    h: 38,
    f(c, u) {
      const b = 36;
      c.rect(8, 12, 9, b - 2, IR);
      c.col(8, 12, b - 2, L(IR));
      c.rect(7, 20, 10, 21, ST);
      c.rect(7, 28, 10, 28, ST);
      c.row(b - 1, 6, 11, IR);
      c.row(b, 4, 13, ID);
      c.row(15, 4, 13, IR);
      c.col(3, 12, 14, IR);
      c.col(14, 12, 14, IR);
      dots(c, IR, [4, 16, 13, 16, 5, 17, 12, 17]);
      c.row(11, 2, 5, ST);
      c.row(11, 12, 15, ST);
      c.row(9, 7, 10, ST);
      c.rect(8, 10, 9, 11, IR);
      bcandle(c, 3, u ? 7 : 5, 10, u);
      bcandle(c, 8, u ? 5 : 3, 8, u);
      bcandle(c, 13, u ? 8 : 5, 10, u);
      if (u) dots(c, hex('#231f29'), [2, 12, 2, 13, 15, 12, 7, 10]);
      skull(c, 6, 22);
    },
    sw: 12,
    s(c, u) {
      const b = 36;
      c.rect(5, 12, 6, b - 2, IR);
      c.col(5, 12, b - 2, L(IR));
      c.rect(4, 20, 7, 21, ST);
      c.rect(4, 28, 7, 28, ST);
      c.row(b - 1, 3, 8, IR);
      c.row(b, 2, 9, ID);
      c.row(9, 4, 7, ST);
      c.rect(5, 10, 6, 11, IR);
      c.row(13, 7, 9, IR); // the near arm, coming at you
      c.row(11, 7, 10, ST);
      bcandle(c, 5, u ? 5 : 3, 8, u);
      bcandle(c, 8, u ? 8 : 5, 10, u);
      skullS(c, 4, 22);
    },
  });

  /* ---------- the contract desk ---------- */
  O('hell-contract-desk-quill', 'contract desk with quill and parchment devil clerk writing desk inkwell blood signature', {
    w: 26,
    h: 30,
    f(c, u) {
      const b = 28;
      c.rect(4, 14, 21, b, CASE);
      c.col(4, 14, b, CASEL);
      c.frame(7, 16, 18, b - 2, D(CASE));
      c.rect(3, b - 1, 22, b, D(CASE));
      c.rect(2, 9, 23, 12, WL);
      c.row(9, 2, 23, hex('#765848'));
      c.rect(2, 13, 23, 13, WD);
      // the contract, hanging over the edge
      c.rect(8, 8, 17, 23, PARCH);
      c.col(8, 8, 23, L(PARCH));
      for (const y of [10, 12, 14, 16, 18]) c.row(y, 10, y % 4 ? 15 : 14, hex('#6e6248'));
      c.set(9, 24, PARCH);
      c.set(16, 24, PARCH);
      c.rect(14, 21, 15, 22, C.red);
      if (u) {
        dots(c, BL, [10, 20, 11, 21, 12, 20, 13, 21, 11, 19, 12, 22]);
        c.line(3, 11, 7, 8, BONE); // the quill laid down
        c.set(7, 8, BL);
        c.set(3, 11, hex('#efe9d8'));
      } else {
        for (const x of [10, 12]) c.set(x, 21, hex('#6e6248'));
        c.line(21, 5, 23, 1, BONE);
        c.set(23, 1, hex('#efe9d8'));
        c.set(22, 2, hex('#efe9d8'));
      }
      c.rect(19, 6, 21, 8, NI);
      c.row(6, 19, 21, u ? BL : BD);
      skull(c, 3, 4);
      return () => u && (drip(c, 12, 24, 2), c.set(12, b, BL));
    },
    sw: 18,
    s(c, u) {
      const b = 28;
      c.rect(4, 14, 12, b, CASE);
      c.col(4, 14, b, CASEL);
      c.rect(3, b - 1, 13, b, D(CASE));
      c.poly([[3, 8], [14, 11], [14, 13], [3, 12]], WL);
      c.line(3, 8, 14, 11, hex('#765848'));
      c.line(3, 13, 14, 13, WD);
      c.line(7, 8, 14, 10, PARCH);
      c.rect(15, 10, 15, 23, PARCH);
      c.set(14, 10, L(PARCH));
      if (u) {
        c.set(15, 20, BL);
        c.set(15, 21, BL);
        c.line(4, 8, 7, 7, BONE);
      } else {
        c.line(5, 5, 3, 1, BONE);
        c.set(3, 1, hex('#efe9d8'));
      }
      c.rect(4, 6, 6, 8, NI);
      c.row(6, 4, 6, u ? BL : BD);
      return () => u && drip(c, 15, 24, 2);
    },
  });

  /* ---------- soul jars ---------- */
  function jar(c, x, y, light, big) {
    const G = C.glass;
    c.rect(x, y + 1, x + 3, y + 5, light ? D(light) : hex('#27313a'));
    c.frame(x, y + 1, x + 3, y + 5, G);
    c.col(x, y + 1, y + 5, C.glassLight);
    c.row(y, x + 1, x + 2, BR);
    if (light) {
      c.rect(x + 1, y + 3, x + 2, y + 4, light);
      if (big) c.set(x + 1, y + 2, L(light));
    }
  }
  O('hell-soul-jar-shelf', 'shelf of soul jars glass jars with captured souls glowing lights collection dark wood', {
    w: 26,
    h: 38,
    f(c, u) {
      const b = 36,
        V = hex('#a79cc4'),
        G = hex('#a3c4b0');
      c.rect(4, 4, 21, b, hex('#1f1a20'));
      const lights = [[SOUL, V, null], [G, SOUL, V], [null, SOUL, G]];
      [5, 15, 25].forEach((y, r) =>
        [5, 11, 17].forEach((x, i) => {
          if (u && r === 1 && i === 1) return;
          jar(c, x, y, lights[r][i], u && !(r === 1));
        }),
      );
      if (u) {
        // one jar lies broken, and what was in it is leaving
        dots(c, C.glassLight, [11, 20, 13, 19, 14, 20, 12, 20]);
        dots(c, C.glass, [10, 20, 15, 20, 13, 20]);
        c.set(16, 20, BR);
      }
      for (const y of [11, 21, 31]) {
        c.rect(2, y, 23, y + 1, WD);
        c.row(y, 2, 23, WL);
      }
      for (const x of [2, 22]) {
        c.rect(x, 2, x + 1, b, WD);
        c.col(x, 2, b, WL);
      }
      c.rect(2, 2, 23, 3, WL);
      skull(c, 10, 33 - 1 + 0, false, BONED);
      c.rect(4, 33, 21, 33, hex('#1f1a20'));
      return () => {
        if (!u) return;
        dots(c, SOUL, [13, 17, 12, 15, 13, 13, 14, 11, 13, 9, 12, 7, 12, 5]);
        dots(c, L(SOUL), [13, 16, 12, 14, 14, 12, 13, 8]);
        dots(c, SOULD, [14, 15, 11, 10, 14, 6]);
      };
    },
    sw: 12,
    s(c, u) {
      const b = 36;
      c.rect(2, 2, 8, b, WD);
      c.col(2, 2, b, WL);
      c.row(2, 2, 8, WL);
      c.col(8, 3, b, hex('#1f1a20'));
      for (const y of [11, 21, 31]) c.row(y, 2, 9, WL);
      [5, 15, 25].forEach((y, r) => {
        if (u && r === 1) return dots(c, C.glassLight, [9, 20, 10, 20]);
        c.rect(9, y + 1, 9, y + 5, r === 2 ? hex('#27313a') : SOULD);
        c.set(9, y + 3, r === 2 ? C.glass : SOUL);
        c.set(9, y, BR);
      });
      return () => u && dots(c, SOUL, [10, 17, 10, 15, 9, 13, 10, 11, 10, 8]);
    },
  });

  /* ---------- demon statue ---------- */
  O('hell-demon-statue', 'demon statue horned winged gargoyle crouching on a plinth dark stone idol devil', {
    w: 24,
    h: 46,
    f(c, u) {
      const b = 44,
        S = STONE,
        e = u ? LAVAL : NI;
      c.poly([[7, 20], [2, 9], [3, 27], [6, 33]], D(S));
      c.poly([[16, 20], [21, 9], [20, 27], [17, 33]], D(S));
      c.line(2, 9, 6, 33, S);
      c.line(21, 9, 17, 33, mix(S, 0.5));
      c.oval(6, 19, 17, 36, S);
      c.rect(8, 12, 15, 19, S);
      c.row(11, 9, 14, L(S));
      c.col(8, 12, 19, L(S));
      dots(c, S, [7, 11, 7, 10, 6, 9, 6, 8, 16, 11, 16, 10, 17, 9, 17, 8]);
      dots(c, L(S), [6, 7, 17, 7]);
      c.rect(9, 14, 10, 14, e);
      c.rect(13, 14, 14, 14, e);
      dots(c, D(S), [9, 13, 10, 13, 13, 13, 14, 13, 11, 16, 12, 16]);
      c.row(18, 9, 14, u ? EMBER : D(S));
      dots(c, BONE, [9, 19, 14, 19]);
      for (const x of [6, 15]) {
        c.rect(x, 26, x + 2, 35, L(S)); // arms on the knees
        c.col(x + 2, 26, 35, D(S));
        dots(c, D(S), [x, 35, x + 2, 35]);
      }
      c.rect(10, 22, 13, 30, D(S));
      dots(c, S, [11, 23, 12, 25, 11, 27]);
      c.rect(4, 37, 19, b, BAS);
      c.row(37, 4, 19, BASL);
      c.rect(3, b - 1, 20, b, BAS);
      c.row(40, 5, 18, D(BAS));
      rusty(c, 3, 8, 20, b, 3, 7, hex('#3e4a36'));
      if (u) {
        flame(c, 11, 21, 3, 1, 1);
        c.row(18, 10, 13, LAVA);
      }
      return () => u && sparks(c, [11, 10, 5, 13, 18, 12]);
    },
    sw: 18,
    s(c, u) {
      const b = 44,
        S = STONE,
        e = u ? LAVAL : NI;
      c.poly([[6, 20], [2, 8], [2, 28], [5, 33]], D(S));
      c.line(2, 8, 2, 28, S);
      c.rect(5, 19, 11, 36, S);
      c.col(5, 19, 36, L(S));
      c.rect(7, 12, 12, 19, S);
      c.row(11, 8, 11, L(S));
      c.rect(13, 15, 14, 17, S); // the snout
      dots(c, S, [7, 11, 6, 10, 6, 9, 5, 8]);
      c.set(5, 7, L(S));
      c.set(11, 14, e);
      c.set(11, 13, D(S));
      c.row(18, 11, 14, u ? EMBER : D(S));
      c.set(14, 19, BONE);
      c.rect(10, 26, 13, 35, L(S));
      c.col(13, 26, 35, D(S));
      c.rect(9, 30, 14, 36, S); // the knee
      c.rect(3, 37, 14, b, BAS);
      c.row(37, 3, 14, BASL);
      c.rect(2, b - 1, 15, b, BAS);
      c.row(40, 4, 13, D(BAS));
      rusty(c, 2, 8, 15, b, 3, 7, hex('#3e4a36'));
      if (u) {
        c.rect(15, 17, 16, 18, LAVA);
        c.set(16, 16, C.flameLight);
        c.set(15, 19, EMBER);
      }
      return () => u && sparks(c, [16, 14, 15, 21]);
    },
  });

  /* ---------- the burning tree ---------- */
  function tree(c, u, lim, o) {
    const b = 46;
    const br = lim.map((l) => l.map(([x, y]) => [x + o, y]));
    for (const l of br)
      for (let i = 0; i + 1 < l.length; i++) {
        c.line(l[i][0], l[i][1], l[i + 1][0], l[i + 1][1], CHAR);
        if (i === 0) c.line(l[i][0] + 1, l[i][1], l[i + 1][0] + 1, l[i + 1][1], hex('#1c1618'));
      }
    const tx = 14 + o;
    c.rect(tx, 22, tx + 3, b, CHAR);
    c.col(tx, 22, b, hex('#463a3a'));
    c.col(tx + 3, 22, b, hex('#1c1618'));
    c.rect(tx - 1, b - 3, tx + 4, b, CHAR);
    c.rect(tx - 3, b - 1, tx + 6, b, CHAR);
    dots(c, EMBER, [tx + 1, 28, tx + 2, 33, tx + 1, 39, tx + 2, 24, tx + 1, 43]);
    dots(c, LAVA, [tx + 1, 29, tx + 2, 34]);
    for (const l of br) {
      const [x, y] = l[l.length - 1],
        [mx, my] = l[1] || l[0];
      if (u) {
        flame(c, x, y, 7, 2, x);
        flame(c, mx, my - 1, 6, 2, mx + 3);
        flame(c, (x + mx) >> 1, ((y + my) >> 1) - 1, 5, 1, y);
        c.set(mx, my, EMBER);
      } else {
        c.set(x, y, EMBER);
        c.set(mx, my, EMBER);
      }
    }
    if (!u) {
      const [x, y] = br[0][br[0].length - 1];
      flame(c, x, y - 1, 3, 1, 1);
      const [x2, y2] = br[br.length - 1][1];
      flame(c, x2, y2 - 1, 3, 1, 2);
    } else {
      flame(c, tx + 1, 24, 6, 2, 5);
      fire(c, tx - 2, tx + 5, b, 4, 5);
    }
  }
  const LIMBS = [
    [[15, 24], [9, 14], [4, 10]],
    [[16, 23], [22, 13], [27, 9]],
    [[15, 19], [12, 9]],
    [[17, 17], [20, 8]],
    [[15, 30], [8, 24]],
  ];
  O('hell-tree-burning', 'burning tree black dead tree on fire charred trunk embers never consumed', {
    w: 32,
    h: 48,
    f(c, u) {
      tree(c, u, LIMBS, 0);
      return () => sparks(c, u ? [6, 2, 13, 1, 24, 2, 29, 5, 2, 7, 18, 0 + 1] : [5, 5, 26, 4], u ? C.flameLight : EMBER);
    },
    sw: 24,
    s(c, u) {
      tree(c, u, [[[15, 24], [10, 13], [8, 9]], [[16, 22], [20, 12], [22, 8]], [[15, 18], [14, 8]], [[16, 30], [21, 25]]], -5);
      return () => sparks(c, u ? [4, 3, 10, 1, 19, 2, 21, 6] : [4, 5, 18, 4], u ? C.flameLight : EMBER);
    },
  });

  /* ---------- the pit and its ladder ---------- */
  O('hell-pit-ladder', 'pit with a ladder coming up out of it hole in the ground way down to the abyss rungs', {
    w: 24,
    h: 28,
    f(c, u) {
      const b = 26;
      c.oval(2, b - 6, 21, b, BAS);
      c.oval(4, b - 5, 19, b - 1, NI);
      c.row(b - 2, 7, 16, u ? EMBER : BD);
      c.row(b - 1, 8, 15, u ? LAVA : EMBER);
      if (u) {
        c.rect(10, b - 9, 13, b - 6, CHAR); // a head, coming up
        eyes(c, 10, b - 8, LAVAL, 3);
      }
      for (const x of [8, 15]) {
        c.col(x, 3, b - 3, WL);
        c.set(x, 2, C.woodLight);
      }
      for (let y = 5; y <= b - 4; y += 4) c.row(y, 9, 14, WD);
      if (u) {
        c.rect(7, 12, 9, 13, CHAR); // hands on the rails
        c.rect(14, 8, 16, 9, CHAR);
        dots(c, hex('#463a3a'), [7, 12, 14, 8]);
      }
      c.row(b, 5, 18, BAS);
      c.row(b - 1, 3, 5, BASL);
      dots(c, BASL, [3, b - 3, 5, b - 5, 9, b - 6]);
      dots(c, D(BAS), [19, b - 2, 17, b - 5]);
    },
    sw: 18,
    s(c, u) {
      const b = 26;
      c.oval(2, b - 6, 15, b, BAS);
      c.oval(4, b - 5, 13, b - 1, NI);
      c.row(b - 2, 6, 11, u ? EMBER : BD);
      c.row(b - 1, 7, 10, u ? LAVA : EMBER);
      if (u) {
        c.rect(8, b - 9, 11, b - 6, CHAR);
        c.set(11, b - 8, LAVAL);
      }
      c.line(6, 2, 9, b - 3, WL);
      c.line(7, 2, 10, b - 3, WD);
      for (let y = 5; y <= b - 4; y += 4) c.set(6 + Math.round((y - 2) / 7) - 1, y, WD);
      if (u) c.rect(7, 12, 9, 13, CHAR);
      c.row(b, 5, 12, BAS);
      dots(c, BASL, [3, b - 3, 5, b - 5]);
    },
  });

  /* ---------- the hell bell ---------- */
  const shear = (t, k) => {
    const o = canvas(t.w + Math.ceil(Math.abs(k) * t.h), t.h);
    for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) if (t.get(x, y)) o.set(x + Math.round(k * y), y, t.get(x, y));
    return o;
  };
  const bellPart = (glow) =>
    part(14, 18, (t) => {
      [[4, 9], [3, 10], [3, 10], [3, 10], [2, 11], [2, 11], [2, 11], [2, 11], [2, 11], [1, 12], [1, 12], [1, 12], [0, 13], [0, 13]].forEach(([a, z], y) => {
        t.row(y, a, z, BRONZE);
        t.set(a, y, L(BRONZE));
        t.set(a + 1, y, hex('#786338'));
        t.set(z, y, D(BRONZE));
      });
      t.row(13, 0, 13, D(BRONZE));
      t.row(12, 0, 13, hex('#786338'));
      skull(t, 5, 3, false, hex('#786338'), D(BRONZE));
      for (const [x, y] of [[9, 13], [9, 12], [10, 11], [10, 10], [9, 9], [10, 8]]) t.set(x, y, glow ? EMBER : NI);
      t.rect(6, 14, 7, 16, IR);
      t.set(6, 17, ID);
      t.set(7, 17, ID);
    });
  O('hell-bell-great', 'great bell of hell cracked bronze bell in a wooden frame tolling doom rope', {
    w: 28,
    h: 42,
    f(c, u) {
      const b = 40;
      for (const x of [3, 22]) {
        c.rect(x, 6, x + 2, b, WD);
        c.col(x, 6, b, WL);
        c.rect(x - 2, b - 1, x + 4, b, WD);
        c.line(x + (x < 10 ? 3 : -1), 16, x + (x < 10 ? 7 : -5), 8, WD);
      }
      c.rect(1, 4, 26, 7, WD);
      c.row(4, 1, 26, WL);
      dots(c, ST, [4, 6, 23, 6]);
      c.rect(12, 8, 15, 9, IR);
      if (u) c.stamp(shear(bellPart(true), 0.3), 7, 10);
      else c.stamp(bellPart(false), 7, 10);
      const rx = u ? 17 : 13;
      thin(c, rx, 28, u ? 15 : 13, 36, HIDE);
      c.set(u ? 15 : 13, 37, BR);
      return () => u && dots(c, C.ash, [25, 14, 26, 17, 25, 20, 5 + 3, 24]);
    },
    sw: 18,
    s(c, u) {
      const b = 40;
      c.stamp(bellPart(u), 2, 10);
      c.rect(7, 6, 10, b, WD);
      c.col(7, 6, b, WL);
      c.rect(6, 4, 11, 7, WD);
      c.row(4, 6, 11, WL);
      c.rect(2, b - 1, 15, b, WD);
      c.row(b - 1, 2, 15, WL);
      c.line(6, 30, 3, b - 2, WD);
      c.line(11, 30, 14, b - 2, WD);
      thin(c, 13, 24, u ? 15 : 13, 36, HIDE);
      c.set(u ? 15 : 13, 37, BR);
      return () => u && dots(c, C.ash, [16, 14, 1, 17, 16, 21]);
    },
  });

  /* ---------- anvil ---------- */
  O('hell-anvil-soul-forge', 'anvil on a stump with hammer black iron forge smith of hell chain links hot iron', {
    w: 28,
    h: 22,
    f(c, u) {
      const b = 20;
      c.rect(8, 13, 17, b, WD);
      c.col(8, 13, b, WL);
      c.row(13, 8, 17, WL);
      dots(c, D(WD), [11, 15, 14, 17, 12, 18]);
      c.row(7, 3, 20, ST);
      c.row(8, 5, 20, IR);
      c.row(9, 8, 18, IR);
      c.rect(10, 10, 15, 11, ID);
      c.row(12, 8, 17, IR);
      c.set(3, 8, IR);
      if (u) {
        c.row(6, 7, 16, LAVA);
        c.row(6, 9, 13, LAVAL);
        c.set(17, 6, EMBER);
        c.rect(19, 4, 23, 6, ID); // the hammer left on the face
        c.row(4, 19, 23, IR);
        c.line(21, 7, 25, 11, WL);
      } else {
        c.line(20, b, 23, 11, WL);
        c.rect(21, 8, 25, 10, ID);
        c.row(8, 21, 25, IR);
      }
      ring(c, 2, b - 2, 5, b, ST);
      ring(c, 4, b - 1, 7, b, IR);
      return () => u && sparks(c, [9, 3, 14, 2, 5, 4, 12, 4]);
    },
    sw: 16,
    s(c, u) {
      const b = 20;
      c.rect(3, 13, 11, b, WD);
      c.col(3, 13, b, WL);
      c.row(13, 3, 11, WL);
      c.row(7, 4, 10, ST);
      c.row(8, 4, 10, IR);
      c.row(9, 5, 9, IR);
      c.rect(6, 10, 8, 11, ID);
      c.row(12, 4, 10, IR);
      if (u) {
        c.rect(6, 6, 7, 6, LAVAL);
        c.rect(9, 4, 11, 6, ID);
        c.row(4, 9, 11, IR);
      } else {
        c.line(12, b, 13, 11, WL);
        c.rect(12, 8, 14, 10, ID);
        c.row(8, 12, 14, IR);
      }
      return () => u && sparks(c, [5, 3, 8, 2]);
    },
  });

  /* ---------- bellows and hearth ---------- */
  O('hell-bellows-forge-hearth', 'great bellows blowing a forge hearth leather and wood coals fire smithy', {
    w: 38,
    h: 26,
    base: 'side',
    f(c, u) {
      const b = 24,
        t = u ? 11 : 6;
      c.poly([[4, t + 2], [19, 12], [19, 14], [4, 17]], HIDE);
      for (let x = 6; x <= 17; x += 3) c.line(x, t + 3 + Math.round(((x - 4) * (10 - t)) / 15), x, 16 - Math.round((x - 4) / 6), D(HIDE));
      c.poly([[3, t], [20, 11], [20, 12], [3, t + 2]], WL);
      c.poly([[3, 17], [20, 14], [20, 15], [3, 19]], WD);
      c.line(3, t, 20, 11, hex('#765848'));
      c.rect(1, t - 1, 3, t, WD);
      c.rect(20, 12, 25, 13, IR);
      dots(c, BR, [5, t + 1, 9, t + 2 + (u ? 0 : 1), 5, 18]);
      c.rect(6, 19, 7, b, WD);
      c.rect(16, 16, 17, b, WD);
      c.row(b, 4, 19, WD);
      // the hearth
      c.rect(25, 12, 35, b, BAS);
      c.col(25, 12, b, BASL);
      c.row(12, 25, 35, BASL);
      for (const y of [16, 20]) c.row(y, 26, 35, D(BAS));
      dots(c, D(BAS), [30, 13, 30, 14, 28, 17, 28, 18, 32, 21, 32, 22]);
      c.row(11, 26, 34, CHAR);
      dots(c, EMBER, [27, 11, 30, 11, 33, 11]);
      if (u) {
        fire(c, 26, 34, 10, 8, 2);
        c.row(11, 26, 34, LAVA);
      } else {
        c.row(10, 28, 32, CHAR);
        c.set(30, 10, EMBER);
        flame(c, 31, 9, 2, 1, 1);
      }
      return () => u && sparks(c, [28, 1, 33, 3, 36, 6, 25, 4]);
    },
    sw: 18,
    s(c, u) {
      const b = 24,
        t = u ? 11 : 6;
      c.rect(5, t, 12, t + 1, WL); // the bellows beyond, end on
      c.rect(6, t + 2, 11, 11, HIDE);
      c.col(11, t + 2, 11, D(HIDE));
      c.rect(8, t - 1, 9, t - 1, WD);
      c.rect(3, 12, 14, b, BAS);
      c.col(3, 12, b, BASL);
      c.row(12, 3, 14, BASL);
      for (const y of [16, 20]) c.row(y, 4, 14, D(BAS));
      dots(c, D(BAS), [8, 13, 8, 14, 6, 17, 6, 18, 11, 21, 11, 22]);
      c.rect(8, 14, 9, 15, IR); // the nozzle comes through
      c.row(11, 4, 13, CHAR);
      dots(c, EMBER, [5, 11, 8, 11, 12, 11]);
      if (u) {
        fire(c, 4, 13, 10, 8, 2);
        c.row(11, 4, 13, LAVA);
      } else flame(c, 9, 10, 2, 1, 1);
      return () => u && sparks(c, [5, 1, 12, 2, 15, 5]);
    },
  });

  /* ---------- the door of faces ---------- */
  function face(c, x, y, col) {
    c.rect(x, y + 1, x + 4, y + 5, col);
    c.row(y, x + 1, x + 3, L(col));
    c.row(y + 6, x + 1, x + 3, col);
    dots(c, NI, [x + 1, y + 2, x + 3, y + 2, x + 2, y + 4, x + 2, y + 5]);
  }
  O('hell-door-of-faces', 'door of faces dark red door with screaming faces in relief gate to the inferno', {
    w: 22,
    h: 42,
    f(c, u) {
      const b = 40,
        RD = hex('#4a2024'),
        RL = hex('#6e3236');
      c.rect(1, 4, 20, b, BAS);
      c.row(3, 3, 18, BASL);
      c.col(1, 4, b, BASL);
      dots(c, D(BAS), [2, 12, 2, 13, 19, 20, 19, 21, 2, 30, 19, 33]);
      if (!u) {
        c.rect(4, 7, 17, b, RD);
        c.row(6, 6, 15, RD);
        for (const [x, y] of [[5, 8], [12, 9], [8, 16], [5, 24], [12, 23], [9, 31]]) face(c, x, y, RL);
        c.col(4, 7, b, RL);
        ring(c, 14, 18, 16, 21, BR);
      } else {
        c.rect(4, 7, 17, b, BD);
        c.row(6, 6, 15, BD);
        c.rect(7, 33, 17, b, EMBER);
        dots(c, EMBER, [9, 28, 13, 26, 15, 30, 10, 24]);
        fire(c, 7, 17, b, 17, 4);
        c.rect(4, 7, 6, b, RD); // the leaf, pushed in
        c.col(4, 7, b, RL);
        dots(c, RL, [5, 12, 5, 20, 5, 28]);
      }
      return () => u && sparks(c, [10, 12, 14, 16, 9, 20]);
    },
    sw: 9,
    suw: 20,
    s(c, u) {
      const b = 40,
        RD = hex('#4a2024'),
        RL = hex('#6e3236');
      c.rect(2, 4, 6, b, BAS);
      c.row(3, 3, 5, BASL);
      c.col(2, 4, b, BASL);
      dots(c, D(BAS), [4, 12, 4, 13, 5, 30]);
      if (u) {
        c.rect(7, 7, 17, b, RD);
        c.col(7, 7, b, RL);
        face(c, 9, 9, RL);
        face(c, 11, 18, RL);
        face(c, 9, 27, RL);
        c.rect(15, 18, 16, 21, BR);
      } else c.rect(7, 18, 7, 21, BR);
      return () => u && sparks(c, [8, 5, 10, 3], EMBER);
    },
  });

  /* ---------- the well of souls ---------- */
  function wellWall(c, x0, x1, u) {
    const b = 30;
    c.rect(x0, 20, x1, b, BAS);
    c.col(x0, 20, b, BASL);
    for (const y of [23, 27]) c.row(y, x0 + 1, x1, D(BAS));
    for (let x = x0 + 3; x < x1; x += 5) {
      c.col(x, 21, 22, D(BAS));
      c.col(x + 2, 24, 26, D(BAS));
      c.col(x, 28, 29, D(BAS));
    }
    c.rect(x0 - 1, 18, x1 + 1, 19, BASL);
    c.row(19, x0 + 2, x1 - 2, u ? SOUL : SOULD);
    c.row(18, x0 - 1, x1 + 1, hex('#7a6c70'));
  }
  function wisp(c, x, y0, y1) {
    c.rect(x - 2, y0 + 2, x + 2, y1, SOUL);
    c.row(y0, x - 1, x + 1, SOUL);
    c.row(y0 + 1, x - 2, x + 2, SOUL);
    c.col(x + 2, y0 + 2, y1, SOULD);
    dots(c, NI, [x - 1, y0 + 2, x + 1, y0 + 2, x, y0 + 4, x, y0 + 5]);
    c.col(x - 3, y0 + 6, y0 + 8, SOUL);
    c.col(x + 3, y0 + 5, y0 + 7, SOULD);
  }
  O('hell-well-of-souls', 'well of souls stone well with a pale green glow windlass chain ghosts rising', {
    w: 28,
    h: 32,
    f(c, u) {
      const b = 30;
      if (u) wisp(c, 13, 7, 18);
      else thin(c, 13, 8, 13, 17, ST);
      for (const x of [4, 20]) {
        c.rect(x, 4, x + 1, 18, WD);
        c.col(x, 4, 18, WL);
      }
      c.rect(3, 5, 22, 7, WL);
      c.row(7, 3, 22, WD);
      c.rect(23, 5, 24, 6, IR);
      c.col(25, 5, 10, IR);
      c.set(25, 11, BONE);
      wellWall(c, 3, 22, u);
      if (u) dots(c, SOUL, [9, 17, 10, 17, 16, 17, 17, 17]);
      return () => u && dots(c, SOULD, [8, 12, 18, 10, 13, 3, 7, 15]);
    },
    sw: 22,
    s(c, u) {
      if (u) wisp(c, 13, 7, 18);
      wellWall(c, 3, 18, u);
      c.rect(9, 4, 11, 18, WD);
      c.col(9, 4, 18, WL);
      ring(c, 7, 3, 13, 9, IR);
      c.set(10, 6, ST);
      c.line(10, 6, 13, 10, IR);
      c.set(13, 11, BONE);
      return () => u && dots(c, SOULD, [17, 10, 15, 4, 6, 13]);
    },
  });
};
