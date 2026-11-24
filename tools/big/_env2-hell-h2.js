/* Hell, part 2: the throne room and the yard of punishments. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, chain, chainH, thin, rusty, drip, pool, bars, ring, flame, fire, sparks, skull, skullS, bone, rock, spike, wheel, eyes } = H;
  const { OBS, OBL, BAS, BASL, BRIM, BRIML, EMBER, LAVA, LAVAL, CHAR, BONE, BONED, BL, BD, NI, SOUL, SOULD } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    WD = hex('#3c2a24'),
    WL = hex('#5a4034'),
    BR = hex('#8a7436'),
    WINE = C.wine,
    GLINT = hex('#7a6c94'),
    BREW = hex('#5e6b3a'),
    BREWL = hex('#8a9a52'),
    POT = hex('#2c2a32');

  /* ---------- the bone throne ---------- */
  O('hell-bone-throne', 'bone throne of skulls and ribs black seat of the lord of hell chair red cushion', {
    w: 23,
    h: 42,
    f(c, u) {
      const b = 40;
      spike(c, 4, 14, 12, 3, BONED, -1);
      spike(c, 19, 14, 12, 3, BONED, 2);
      c.rect(5, 8, 17, 24, OBS);
      c.col(5, 8, 24, OBL);
      for (const x of [7, 9, 11, 13, 15]) {
        c.col(x, 10, 23, x === 11 ? BONE : BONED);
        c.set(x, 10, BONE);
      }
      c.row(15, 6, 16, OBS);
      c.row(20, 6, 16, OBS);
      skull(c, 8, 2, true, BONE, u ? EMBER : NI);
      for (const x of [3, 17]) {
        c.rect(x, 21, x + 2, 28, BONED);
        c.col(x, 21, 28, BONE);
      }
      skull(c, 1, 17);
      skull(c, 17, 17);
      c.rect(5, 25, 17, 28, WINE);
      c.row(25, 6, 16, L(WINE));
      c.row(28, 5, 17, D(WINE));
      c.rect(4, 29, 18, 36, BONED);
      for (const y of [30, 32, 34]) c.row(y, 4, 18, y === 32 ? D(BONED) : BONE);
      skull(c, 9, 30, false, BONE, u ? EMBER : NI);
      c.rect(2, 37, 20, b, BAS);
      c.row(37, 2, 20, BASL);
      if (u) {
        c.rect(9, 25, 13, 26, BL);
        c.set(8, 26, BL);
      }
      return () => {
        if (!u) return;
        drip(c, 12, 27, 3);
        drip(c, 10, 27, 2);
        pool(c, 8, 15, 37);
      };
    },
    sw: 19,
    s(c, u) {
      const b = 40;
      spike(c, 3, 12, 10, 3, BONED, -1);
      c.rect(3, 8, 5, 28, OBS);
      c.col(3, 8, 28, OBL);
      dots(c, BONED, [5, 11, 5, 14, 5, 17, 5, 20, 5, 23]);
      skullS(c, 3, 3, false, BONE, u ? EMBER : NI);
      c.rect(6, 25, 14, 28, WINE);
      c.row(25, 6, 14, L(WINE));
      c.row(28, 6, 14, D(WINE));
      c.rect(6, 21, 13, 22, BONED);
      c.row(21, 6, 13, BONE);
      c.rect(12, 23, 13, 24, BONED);
      skullS(c, 11, 16);
      c.rect(4, 29, 14, 36, BONED);
      for (const y of [30, 32, 34]) c.row(y, 4, 14, y === 32 ? D(BONED) : BONE);
      c.rect(2, 37, 16, b, BAS);
      c.row(37, 2, 16, BASL);
      if (u) c.rect(10, 25, 13, 25, BL);
      return () => {
        if (!u) return;
        drip(c, 14, 26, 4);
        pool(c, 11, 16, 37);
      };
    },
  });

  /* ---------- the standing cage ---------- */
  function ghost(c, x0, y0, x1, y1, side) {
    c.rect(x0, y0 + 2, x1, y1, SOUL);
    c.row(y0, x0 + 2, x1 - 2, SOUL);
    c.row(y0 + 1, x0 + 1, x1 - 1, SOUL);
    c.col(x1, y0 + 2, y1, SOULD);
    for (let x = x0; x <= x1; x += 2) c.set(x, y1, CHAR);
    if (side) c.set(x1 - 1, y0 + 3, NI);
    else dots(c, NI, [x0 + 2, y0 + 3, x1 - 2, y0 + 3]);
    c.set(side ? x1 - 1 : (x0 + x1) >> 1, y0 + 6, NI);
  }
  function cageTall(c, x0, x1, u, inside) {
    const m = (x0 + x1) >> 1;
    c.rect(m - 1, 1, m + 1, 2, IR);
    c.set(m, 2, NI);
    [[3, 2], [4, 4], [5, 5], [6, 6], [7, 6]].forEach(([y, k]) => c.row(y, Math.max(x0, m - k), Math.min(x1, m + k), y === 3 ? L(IR) : IR));
    c.rect(x0, 8, x1, 36, CHAR);
    if (inside) inside();
    c.rect(x0 - 1, 37, x1 + 1, 40, IR);
    c.row(37, x0 - 1, x1 + 1, L(IR));
    c.row(40, x0 - 1, x1 + 1, ID);
  }
  O('hell-cage-standing-soul', 'tall iron cage standing gibbet with a trapped soul ghost prisoner bars domed', {
    w: 19,
    h: 42,
    uw: 24,
    f(c, u) {
      const o = u ? 5 : 0;
      cageTall(c, o + 3, o + 15, u, () => !u && ghost(c, 5, 14, 13, 33));
      for (const x of [3, 6, 9, 12, 15]) {
        if (u && x > 3 && x < 15) continue;
        c.col(o + x, 8, 36, IR);
      }
      c.col(o + 3, 8, 36, L(IR));
      for (const y of [8, 22, 36]) c.row(y, o + 3, o + 15, y === 8 ? IR : ID);
      if (u) {
        c.rect(o + 4, 9, o + 14, 35, NI);
        c.row(22, o + 4, o + 5, ID);
        // the door, swung out to the left
        c.frame(1, 9, o + 2, 36, IR);
        c.col(3, 9, 36, ID);
        c.col(5, 9, 36, IR);
        c.row(22, 1, o + 2, ID);
        dots(c, SOULD, [o + 9, 30, o + 8, 33, o + 11, 34]);
      } else {
        c.rect(13, 20, 14, 23, BR);
      }
      rusty(c, 1, 3, c.w - 2, 8, 3, 3);
      rusty(c, 1, 36, c.w - 2, 40, 3, 3);
      return () => u && dots(c, SOUL, [o + 9, 28]);
    },
    sw: 15,
    suw: 23,
    s(c, u) {
      cageTall(c, 3, 11, u, () => !u && ghost(c, 4, 14, 10, 33, true));
      for (const x of [3, 6, 9, 11]) c.col(x, 8, 36, IR);
      c.col(3, 8, 36, L(IR));
      for (const y of [8, 22, 36]) c.row(y, 3, 11, y === 8 ? IR : ID);
      if (u) {
        c.frame(12, 9, 20, 36, IR); // the door stands open, flat on
        bars(c, 14, 19, 9, 36, IR, 2);
        c.row(22, 12, 20, ID);
        c.rect(18, 20, 19, 23, BR);
        dots(c, SOULD, [7, 30, 6, 33]);
      }
      rusty(c, 1, 3, c.w - 2, 8, 3, 3);
      rusty(c, 1, 36, c.w - 2, 40, 3, 3);
    },
  });

  /* ---------- brazier ---------- */
  function brazierBowl(c, u, side) {
    c.row(12, 2, 15, L(IR));
    c.row(13, 2, 15, IR);
    c.row(14, 3, 14, IR);
    c.row(15, 4, 13, ID);
    c.row(16, 6, 11, ID);
    dots(c, ST, [2, 11, 15, 11, 2, 10, 15, 10]);
    c.row(11, 4, 13, CHAR);
    c.row(10, 6, 11, CHAR);
    dots(c, EMBER, [5, 11, 8, 11, 11, 11, 7, 10, 10, 10]);
    dots(c, LAVA, [6, 11, 12, 11]);
    c.rect(8, 17, 9, 21, IR);
    c.rect(7, 19, 10, 19, ST);
    if (u) {
      flame(c, 8, 10, 10, 3, 1);
      flame(c, 12, 10, 6, 1, 5);
      flame(c, 5, 10, 5, 1, 2);
    } else flame(c, 9, 9, 3, 1, 1);
    if (side) ring(c, 7, 13, 10, 16, ST);
    else {
      chainH(c, 3, 14, 14, ST, 0.6);
    }
  }
  O('hell-brazier-iron-tripod', 'iron brazier on a tripod bowl of burning coals fire light hell torch stand', {
    w: 18,
    h: 30,
    f(c, u) {
      const b = 28;
      brazierBowl(c, u, false);
      c.line(8, 21, 3, b, IR);
      c.line(9, 21, 14, b, IR);
      c.col(8, 22, b, ID);
      c.set(3, b, ID);
      c.set(14, b, ID);
      return () => u && sparks(c, [4, 3, 13, 2, 15, 6, 10, 0 + 1]);
    },
    sw: 18,
    s(c, u) {
      const b = 28;
      brazierBowl(c, u, true);
      c.line(8, 21, 5, b, ID);
      c.line(9, 21, 12, b, ID);
      c.rect(8, 22, 9, b, IR);
      c.rect(7, b, 10, b, ID);
      return () => u && sparks(c, [5, 2, 12, 4, 14, 7]);
    },
  });

  /* ---------- lava vent ---------- */
  function vent(c, u, x0, x1) {
    const b = c.h - 2,
      m = (x0 + x1) >> 1;
    rock(c, x0, b - 10, x1, b, BAS, x1, 0.5);
    c.rect(m - 2, b - 11, m + 2, b - 9, BRIM);
    c.row(b - 11, m - 1, m + 1, u ? LAVAL : LAVA);
    c.row(b - 10, m - 2, m + 2, u ? LAVA : EMBER);
    // the glowing cracks
    const crack = [[m - 1, b - 8], [m - 2, b - 7], [m - 2, b - 6], [m - 3, b - 5], [m - 4, b - 4], [m - 4, b - 3], [m + 2, b - 8], [m + 3, b - 6], [m + 3, b - 5], [m + 5, b - 3]];
    for (const [x, y] of crack) c.set(x, y, u ? LAVA : EMBER);
    if (u) {
      c.rect(m - 1, 8, m + 1, b - 11, LAVA);
      c.col(m, 6, b - 11, LAVAL);
      c.col(m - 1, 10, b - 12, EMBER);
      flame(c, m, 9, 8, 2, 3);
      dots(c, LAVA, [m - 3, 6, m + 3, 5, m - 4, 9, m + 4, 8, m - 5, 13, m + 5, 12]);
      for (const [x, y] of [[m - 3, b - 7], [m - 4, b - 6], [m - 5, b - 5], [m - 5, b - 4], [m - 6, b - 3], [m - 6, b - 2], [m + 4, b - 6], [m + 5, b - 4], [m + 6, b - 3], [m + 6, b - 2]]) c.set(x, y, y > b - 4 ? EMBER : LAVA);
      c.row(b, m - 9, m - 5, EMBER);
      c.row(b, m + 5, m + 8, EMBER);
    }
    return () => {
      if (u) sparks(c, [m - 6, 3, m + 5, 2, m + 7, 10, m - 7, 15, m + 2, 1]);
      else dots(c, C.ash, [m, b - 14, m + 1, b - 16]);
    };
  }
  O('hell-lava-vent', 'lava vent volcanic crack in the rock glowing fissure erupting fire jet magma', {
    w: 30,
    h: 18,
    uh: 36,
    solid: true,
    f: (c, u) => vent(c, u, 2, 27),
    sw: 20,
    suh: 36,
    s: (c, u) => vent(c, u, 2, 17),
  });

  /* ---------- the chained gate ---------- */
  function gatePost(c, x, side) {
    c.rect(x, 8, x + 4 + (side ? 1 : 0), 42, BAS);
    c.col(x, 8, 42, BASL);
    c.rect(x - 1, 6, x + 5 + (side ? 1 : 0), 7, BASL);
    for (const y of [15, 23, 31, 39]) c.row(y, x + 1, x + 4 + (side ? 1 : 0), D(BAS));
    side ? skullS(c, x + 1, 1) : skull(c, x, 1);
  }
  O('hell-gate-chained', 'chained gate of hell black iron double gate basalt posts skulls padlock chains', {
    w: 32,
    h: 44,
    f(c, u) {
      const b = 42;
      if (u) {
        c.rect(16, 12, 20, b, BD);
        c.rect(17, 20, 19, b, EMBER);
        c.col(18, 30, b, LAVA);
      }
      const leaf = (x0, x1, n) => {
        for (let i = 0; i < n; i++) {
          const x = Math.round(x0 + ((x1 - x0) * i) / (n - 1)),
            top = 10 + Math.round(Math.abs(x - 15.5) * 0.5);
          c.col(x, top, b, i === 0 || i === n - 1 ? IR : ID);
          c.set(x, top - 1, ST);
        }
        c.row(17, x0, x1, IR);
        c.row(38, x0, x1, IR);
      };
      leaf(7, 15, 5);
      u ? leaf(21, 24, 3) : leaf(16, 24, 5);
      gatePost(c, 2);
      gatePost(c, 25);
      if (!u) {
        thin(c, 6, 20, 25, 34, ST);
        thin(c, 25, 20, 6, 34, ST);
        thin(c, 6, 27, 25, 27, ST);
        c.rect(14, 25, 17, 29, BR);
        c.row(25, 14, 17, L(BR));
        c.set(15, 27, NI);
        c.set(16, 27, NI);
      } else {
        thin(c, 6, 20, 6, 38, ST);
        thin(c, 7, 22, 7, 39, ST);
        dots(c, ST, [8, 40, 10, 41, 12, 41, 9, 41]);
      }
      rusty(c, 7, 9, 24, b, 2, 9);
      return () => {
        if (!u) return;
        c.rect(11, b - 1, 13, b, BR);
        dots(c, ST, [8, b, 9, b, 14, b]);
        sparks(c, [18, 16, 17, 24], LAVA);
      };
    },
    sw: 12,
    suw: 22,
    s(c, u) {
      const b = 42;
      gatePost(c, 3, true);
      if (!u) {
        thin(c, 9, 20, 9, 30, ST);
        c.set(9, 31, BR);
      } else {
        // a leaf stands open towards you
        for (const x of [10, 12, 14, 16, 18]) {
          c.col(x, 12 + ((x - 10) >> 2), b, x === 18 ? IR : ID);
          c.set(x, 11 + ((x - 10) >> 2), ST);
        }
        c.row(17, 10, 18, IR);
        c.row(38, 10, 18, IR);
        dots(c, ST, [9, 40, 9, 41]);
      }
      return () => u && dots(c, ST, [20, b, 19, b]);
    },
  });

  /* ---------- the iron rack ---------- */
  O('hell-rack-iron-spiked', 'torture rack iron stretching table spiked roller windlass chains shackles', {
    w: 44,
    h: 22,
    base: 'side',
    f(c, u) {
      const b = 20;
      for (const x of [3, 38]) {
        c.rect(x, 11, x + 1, b, IR);
        c.col(x, 11, b, L(IR));
      }
      c.rect(2, 10, 41, 11, IR);
      c.row(10, 2, 41, L(IR));
      c.row(16, 5, 37, ID);
      // windlass at the head
      c.oval(3, 4, 9, 10, WD);
      ring(c, 3, 4, 9, 10, WL);
      c.set(6, 7, ST);
      u ? c.line(6, 7, 1, 9, ST) : c.line(6, 7, 3, 1, ST);
      u ? c.rect(1, 9, 1, 10, BONE) : c.rect(3, 1, 4, 1, BONE);
      c.rect(37, 6, 40, 9, IR);
      c.row(6, 37, 40, L(IR));
      // the spiked roller
      c.oval(19, 6, 25, 12, ST);
      ring(c, 19, 6, 25, 12, IR);
      dots(c, ST, [22, 5, 18, 9, 26, 9, 19, 6, 25, 6, 19, 12, 25, 12, 22, 13]);
      if (u) {
        thin(c, 10, 8, 18, 8, ST);
        thin(c, 26, 8, 36, 8, ST);
        dots(c, BL, [21, 7, 22, 8, 23, 7, 22, 6, 24, 9]);
      } else {
        thin(c, 10, 8, 13, 9, ST);
        c.frame(14, 7, 16, 9, ST);
        thin(c, 36, 8, 32, 9, ST);
        c.frame(29, 7, 31, 9, ST);
      }
      skullS(c, 28, b - 4, true);
      rusty(c, 2, 10, 41, b, 4, 5);
      return () => {
        if (!u) return;
        drip(c, 22, 14, 2);
        drip(c, 20, 13, 1);
        pool(c, 17, 26, b);
      };
    },
    sw: 22,
    s(c, u) {
      const b = 20;
      for (const x of [4, 16]) {
        c.rect(x, 11, x + 1, b, IR);
        c.col(x, 11, b, L(IR));
      }
      c.row(16, 6, 15, ID);
      c.rect(3, 5, 18, 10, WD);
      c.row(5, 3, 18, WL);
      c.row(10, 3, 18, NI);
      c.col(7, 5, 10, IR);
      c.col(14, 5, 10, IR);
      thin(c, 10, 6, 10, 10, ST);
      thin(c, 11, 5, 11, 9, ST);
      // the lever on its side
      if (u) {
        c.rect(19, 7, 20, 8, ST);
        c.rect(19, 9, 19, 12, ST);
        c.set(19, 13, BONE);
      } else {
        c.rect(19, 2, 19, 8, ST);
        c.set(19, 1, BONE);
        c.set(20, 7, ST);
      }
      c.rect(9, 2, 12, 4, ST); // the roller beyond, spikes up
      dots(c, ST, [9, 1, 12, 1]);
      if (u) dots(c, BL, [10, 3, 11, 2, 11, 4]);
      rusty(c, 3, 5, 18, b, 4, 5);
      return () => u && (drip(c, 11, 11, 3), pool(c, 7, 14, b));
    },
  });

  /* ---------- the great cauldron ---------- */
  function cauldron(c, u, x0, x1, side) {
    const b = 28,
      m = (x0 + x1) >> 1;
    c.rect(x0 + 3, b - 1, x1 - 3, b, WD);
    dots(c, EMBER, [x0 + 5, b, m, b - 1, x1 - 6, b]);
    fire(c, x0 + 4, x1 - 4, b - 2, u ? 5 : 3, 2);
    c.oval(x0, 8, x1, 25, POT);
    c.rect(x0 + 1, 7, x1 - 1, 8, hex('#45424d'));
    c.row(7, x0 + 1, x1 - 1, hex('#5c5966'));
    dots(c, hex('#5c5966'), [x0 + 2, 12, x0 + 2, 13, x0 + 2, 14, x0 + 3, 16, x0 + 3, 11]);
    for (const x of [x0 + 2, x1 - 3]) c.rect(x, 24, x + 1, b - 1, POT);
    c.row(8, x0 + 3, x1 - 3, BREW);
    if (!u) {
      dots(c, BREWL, [x0 + 6, 8, x1 - 8, 8]);
      c.set(m, 7, BREWL);
    } else {
      c.rect(x0 + 2, 6, x1 - 2, 8, BREW);
      c.row(5, x0 + 4, x1 - 5, BREW);
      dots(c, BREWL, [x0 + 4, 5, x0 + 8, 4, x1 - 6, 4, x1 - 4, 6, m + 2, 5]);
      skull(c, m - 5, 2);
      c.col(m + 4, 2, 5, BONE); // a hand, reaching up
      dots(c, BONE, [m + 3, 1, m + 5, 1, m + 6, 2]);
      for (const [x, n] of [[x0 + 2, 6], [x0 + 6, 3], [x1 - 4, 8], [x1 - 8, 4]]) c.col(x, 9, 9 + n, BREW);
    }
    if (side) ring(c, m - 2, 12, m + 2, 17, ST);
    else {
      c.rect(x0 - 1, 11, x0 - 1, 14, ST);
      c.rect(x1 + 1, 11, x1 + 1, 14, ST);
    }
  }
  O('hell-cauldron-great', 'great black cauldron over a fire boiling green brew bones witch pot hell kitchen', {
    w: 28,
    h: 30,
    f(c, u) {
      cauldron(c, u, 3, 24, false);
      return () => u && dots(c, BREWL, [2, 4, 25, 3, 9, 0 + 1]);
    },
    sw: 26,
    s(c, u) {
      cauldron(c, u, 2, 21, true);
      c.line(19, 7, 24, 2, WL); // the ladle
      c.set(24, 2, C.woodLight);
      return () => u && dots(c, BREWL, [1, 4, 16, 1]);
    },
  });

  /* ---------- the spiked wheel ---------- */
  O('hell-wheel-spiked-post', 'breaking wheel on a post spiked cartwheel torture catherine wheel execution', {
    w: 26,
    h: 44,
    f(c, u) {
      const b = 42,
        cx = 12,
        cy = 13;
      c.rect(12, 22, 13, b, WL);
      c.col(13, 22, b, WD);
      rock(c, 6, b - 4, 19, b, BAS, 4);
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 + 0.39;
        c.set(cx + Math.cos(a) * 11.4, cy + Math.sin(a) * 11.4, ST);
        c.set(cx + Math.cos(a) * 12.3, cy + Math.sin(a) * 12.3, ST);
      }
      wheel(c, cx, cy, 10, WL, WD, IR);
      ring(c, cx - 9, cy - 9, cx + 9, cy + 9, WD);
      if (u) {
        // what is left of someone, woven through the spokes
        skull(c, 4, 5);
        c.line(9, 9, 16, 15, BONE);
        bone(c, 16, 15, 20, 12);
        bone(c, 15, 16, 14, 21);
        bone(c, 8, 10, 5, 16);
        dots(c, BONED, [11, 10, 13, 12, 15, 14]);
        dots(c, BL, [10, 13, 12, 15, 9, 18, 17, 17]);
      }
      return () => {
        if (!u) return;
        drip(c, 12, 24, 5);
        drip(c, 13, 23, 2);
        dots(c, BL, [9, 39, 15, 38]);
      };
    },
    sw: 12,
    s(c, u) {
      const b = 42;
      c.rect(5, 22, 6, b, WL);
      c.col(6, 22, b, WD);
      rock(c, 2, b - 4, 9, b, BAS, 4);
      c.rect(4, 3, 7, 23, WL);
      c.col(7, 3, 23, WD);
      c.col(4, 3, 23, hex('#765848'));
      for (const y of [5, 9, 13, 17, 21]) c.row(y, 5, 6, WD);
      dots(c, ST, [3, 4, 8, 4, 3, 13, 8, 13, 3, 22, 8, 22, 5, 2, 5, 1, 9, 13]);
      c.rect(3, 12, 3, 14, IR);
      if (u) {
        bone(c, 8, 7, 9, 12);
        skullS(c, 6, 4);
        dots(c, BL, [8, 15, 7, 18, 8, 20]);
      }
      return () => u && (drip(c, 6, 25, 5), dots(c, BL, [3, 39]));
    },
  });

  /* ---------- the obsidian altar ---------- */
  function candle(c, x, y, lit) {
    c.rect(x, y, x + 1, y + 4, hex('#231f29'));
    c.col(x, y, y + 4, hex('#3d3747'));
    if (lit) {
      c.set(x, y - 1, C.flame);
      c.set(x, y - 2, C.flameLight);
    } else c.set(x, y - 1, NI);
  }
  O('hell-altar-obsidian', 'obsidian altar black glass stone slab sacrifice dagger bowl black candles blood', {
    w: 34,
    h: 22,
    f(c, u) {
      const b = 20;
      c.rect(5, 11, 28, b, OBS);
      c.col(5, 11, b, OBL);
      c.rect(10, 12, 23, b - 2, D(OBS));
      // the sign cut in the front
      const R = u ? EMBER : BD;
      c.col(16, 13, 17, R);
      c.col(17, 13, 17, R);
      c.row(16, 14, 19, R);
      c.rect(3, b - 1, 30, b, OBS);
      c.row(b - 1, 3, 30, OBL);
      c.rect(2, 7, 31, 10, OBS);
      c.row(7, 2, 31, OBL);
      dots(c, GLINT, [6, 8, 7, 9, 8, 10, 24, 8, 25, 9, 12, 8, 13, 9]);
      candle(c, 3, 2, u);
      candle(c, 29, 2, u);
      c.rect(7, 5, 11, 6, BR);
      c.row(4, 6, 12, L(BR));
      c.row(5, 7, 11, u ? BL : NI);
      // the knife
      c.row(6, 18, 23, u ? hex('#9b6a6a') : ST);
      c.set(24, 6, ST);
      c.rect(15, 6, 17, 6, WD);
      c.col(17, 5, 6, BR);
      return () => {
        if (!u) return;
        c.row(7, 12, 22, BL);
        for (const [x, n] of [[13, 5], [15, 2], [18, 7], [20, 3], [22, 4]]) drip(c, x, 8, n);
        pool(c, 13, 23, b);
      };
    },
    sw: 18,
    s(c, u) {
      const b = 20;
      c.rect(4, 11, 13, b, OBS);
      c.col(4, 11, b, OBL);
      c.rect(3, b - 1, 14, b, OBS);
      c.row(b - 1, 3, 14, OBL);
      c.rect(2, 7, 15, 10, OBS);
      c.row(7, 2, 15, OBL);
      dots(c, GLINT, [5, 8, 6, 9, 7, 10, 11, 8]);
      candle(c, 8, 2, u);
      c.rect(11, 5, 13, 6, BR);
      c.row(4, 10, 14, L(BR));
      c.row(6, 3, 6, u ? hex('#9b6a6a') : ST);
      return () => {
        if (!u) return;
        c.row(7, 3, 8, BL);
        drip(c, 3, 8, 4);
        drip(c, 6, 8, 2);
        dots(c, BL, [2, b, 3, b]);
      };
    },
  });

  /* ---------- the pillar of skulls ---------- */
  O('hell-pillar-of-skulls', 'pillar of skulls column of stacked skulls ossuary bone tower catacomb', {
    w: 17,
    h: 46,
    f(c, u) {
      const b = 44,
        e = u ? EMBER : NI;
      c.rect(3, 6, 13, 40, D(BONED));
      for (let r = 0; r < 7; r++) {
        const y = 6 + r * 5;
        if (r % 2 === 0) {
          skull(c, 3, y, false, BONE, e);
          skull(c, 9, y, false, BONED, e);
        } else {
          skull(c, 6, y, false, BONE, e);
          c.rect(3, y + 1, 4, y + 3, BONED);
          c.set(3, y + 2, e);
          c.rect(12, y + 1, 13, y + 3, BONED);
          c.set(13, y + 2, e);
        }
      }
      c.rect(2, 2, 14, 5, BAS);
      c.row(2, 2, 14, BASL);
      c.rect(2, 41, 14, b, BAS);
      c.row(41, 2, 14, BASL);
      return () => u && sparks(c, [8, 0 + 1, 15, 9, 1, 20], EMBER);
    },
    sw: 15,
    s(c, u) {
      const b = 44,
        e = u ? EMBER : NI;
      c.rect(3, 6, 11, 40, D(BONED));
      for (let r = 0; r < 7; r++) {
        const y = 6 + r * 5;
        if (r % 2 === 0) {
          skullS(c, 7, y, false, BONE, e);
          c.rect(3, y + 1, 5, y + 3, BONED);
        } else {
          skullS(c, 5, y, false, BONED, e);
          c.rect(3, y + 1, 3, y + 3, BONE);
          c.rect(11, y + 1, 11, y + 3, BONED);
        }
      }
      c.rect(2, 2, 12, 5, BAS);
      c.row(2, 2, 12, BASL);
      c.rect(2, 41, 12, b, BAS);
      c.row(41, 2, 12, BASL);
      return () => u && sparks(c, [13, 12, 13, 27], EMBER);
    },
  });

  /* ---------- hanging chains ---------- */
  function shackle(c, x, y, shut) {
    c.frame(x - 2, y, x + 2, y + 3, ST);
    c.clear(x - 2, y);
    if (!shut) c.clear(x + 2, y + 3);
    c.set(x, y, IR);
  }
  function armBone(c, x, y) {
    c.col(x, y + 4, y + 10, BONE);
    c.set(x + 1, y + 4, BONED);
    c.rect(x - 1, y + 11, x + 1, y + 12, BONE);
    c.set(x + 1, y + 12, BONED);
    c.set(x - 1, y + 13, BONE);
    c.set(x + 1, y + 13, BONED);
  }
  O('hell-chains-hanging-shackles', 'hanging chains with shackles manacles from the ceiling iron dungeon prisoner bones', {
    w: 24,
    h: 44,
    solid: false,
    f(c, u) {
      c.rect(1, 1, 22, 2, IR);
      c.row(1, 1, 22, L(IR));
      dots(c, ST, [3, 2, 12, 2, 20, 2]);
      [[5, 24], [12, 30], [19, 20]].forEach(([x, y], i) => {
        chain(c, x, 3, y, IR);
        if (u && i < 2) armBone(c, x, y + 1);
        shackle(c, x, y + 1, u && i < 2);
      });
      rusty(c, 1, 1, 22, 30, 3, 8);
      return () => u && dots(c, BD, [5, 38, 12, 43, 6, 41]);
    },
    sw: 9,
    s(c, u) {
      c.rect(2, 1, 6, 2, IR);
      c.row(1, 2, 6, L(IR));
      chain(c, 4, 3, 30, IR);
      if (u) armBone(c, 4, 31);
      shackle(c, 4, 31, u);
      shackle(c, 4, 21, false);
      return () => u && dots(c, BD, [4, 43]);
    },
  });

  /* ---------- the impaled banner ---------- */
  O('hell-banner-impaled', 'war banner on a spear with an impaled skull tattered red flag standard of hell', {
    w: 20,
    h: 48,
    f(c, u) {
      const b = 46,
        RED = hex('#7a2424'),
        end = u ? 22 : 33;
      c.rect(8, 13, 17, end, RED);
      c.col(8, 13, end, L(RED));
      c.col(13, 14, end, D(RED));
      for (let x = 8; x <= 17; x++) if ((x + (u ? 1 : 0)) % 3 === 0) c.clear(x, end), c.clear(x, end - 1);
      // a horned sign
      dots(c, BONE, [11, 17, 15, 17, 11, 18, 15, 18, 12, 19, 13, 19, 14, 19, 12, 20, 14, 20, 13, 21]);
      if (!u) dots(c, BONE, [13, 23, 13, 24, 12, 25, 14, 25, 11, 28, 13, 28, 15, 28]);
      else {
        c.row(end, 8, 17, CHAR);
        c.row(end - 1, 9, 16, CHAR);
        for (const x of [9, 12, 15]) flame(c, x, end + 4, 6, 1, x);
      }
      c.rect(5, 4, 6, b, WL);
      c.col(6, 4, b, WD);
      dots(c, ST, [5, 3, 5, 2, 5, 1, 6, 3]);
      c.rect(5, 11, 18, 12, WD);
      c.row(11, 5, 18, WL);
      skull(c, 3, 5);
      rock(c, 2, b - 4, 11, b, BAS, 3, 0.4);
      return () => {
        drip(c, 5, 10, 1, BD);
        if (u) sparks(c, [11, 30, 14, 33, 10, 36, 16, 38], EMBER);
      };
    },
    sw: 11,
    s(c, u) {
      const b = 46,
        RED = hex('#7a2424'),
        end = u ? 22 : 33;
      c.rect(6, 13, 7, end, RED);
      c.col(7, 13, end, D(RED));
      c.clear(7, end);
      if (u) {
        c.row(end, 6, 6, CHAR);
        flame(c, 6, end + 4, 6, 1, 2);
      }
      c.rect(4, 4, 5, b, WL);
      c.col(5, 4, b, WD);
      dots(c, ST, [4, 3, 4, 2, 4, 1, 5, 3]);
      c.rect(4, 11, 7, 12, WD);
      c.set(7, 11, WL);
      skullS(c, 2, 5);
      rock(c, 1, b - 4, 8, b, BAS, 3, 0.4);
      return () => u && sparks(c, [8, 30, 6, 35], EMBER);
    },
  });
};
