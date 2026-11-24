/* Hell, part 6: the gong, the chest, the urn, the pyre, the mill, the kennel, and the things by the river. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, chain, chainH, thin, rusty, drip, pool, bars, ring, flame, fire, sparks, skull, skullS, bone, rock, spike, wheel, eyes, planks } = H;
  const { OBS, OBL, BAS, BASL, BRIM, BRIML, EMBER, LAVA, LAVAL, SULF, SULFL, CHAR, BONE, BONED, BL, BD, NI, SOUL, SOULD, HIDE, DEMON } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    WD = hex('#3c2a24'),
    WL = hex('#5a4034'),
    BR = hex('#8a7436'),
    BRONZE = hex('#5a4a2c'),
    ASH = C.ash;

  /* ---------- the gong ---------- */
  O('hell-gong-bone-frame', 'great brass gong in a frame of bones mallet summons signal of hell', {
    w: 28,
    h: 40,
    f(c, u) {
      const b = 38,
        o = u ? 2 : 0;
      for (const x of [3, 23]) {
        c.rect(x, 5, x + 1, b, BONE);
        c.col(x + 1, 5, b, BONED);
        dots(c, BONE, [x - 1, 4, x + 2, 4, x - 1, b, x + 2, b]);
      }
      c.rect(2, 5, 25, 6, BONE);
      c.row(6, 2, 25, BONED);
      skull(c, 11, 1);
      thin(c, 9, 7, 9 + o, 10, HIDE);
      thin(c, 18, 7, 18 + o, 10, HIDE);
      c.oval(5 + o, 10, 22 + o, 27, BR);
      ring(c, 5 + o, 10, 22 + o, 27, L(BR));
      ring(c, 8 + o, 13, 19 + o, 24, D(BR));
      c.oval(12 + o, 17, 15 + o, 20, L(BR));
      c.set(15 + o, 20, D(BR));
      if (u) {
        for (const [x, y] of [[15, 21], [16, 22], [16, 23], [17, 24], [18, 25], [18, 26]]) c.set(x + o, y, NI);
        bone(c, 8, b, 14, b - 1); // the beater, dropped
        c.rect(14, b - 2, 16, b, HIDE);
      } else {
        bone(c, 21, 12, 21, 20);
        c.rect(20, 21, 22, 23, HIDE);
      }
      return () => u && dots(c, ASH, [2, 14, 1, 18, 2, 22, 26, 13, 27, 18, 26, 23]);
    },
    sw: 10,
    s(c, u) {
      const b = 38;
      c.rect(4, 5, 5, b, BONE);
      c.col(5, 5, b, BONED);
      dots(c, BONE, [3, 4, 6, 4]);
      c.rect(2, b, 7, b, BONED);
      skullS(c, 3, 0 + 1);
      const o = u ? 1 : 0;
      c.rect(6 + o, 10, 7 + o, 27, BR);
      c.col(6 + o, 10, 27, L(BR));
      c.set(8 + o, 18, L(BR));
      c.set(8 + o, 19, BR);
      if (u) c.rect(6, b - 2, 8, b, HIDE);
      else c.rect(3, 20, 3, 23, HIDE);
      return () => u && dots(c, ASH, [9, 13, 9, 23]);
    },
  });

  /* ---------- cursed chest ---------- */
  function chest(c, u, x1, side) {
    const b = c.h - 2,
      m = (2 + x1) >> 1;
    c.rect(2, b - 8, x1, b, WD);
    c.col(2, b - 8, b, WL);
    for (const x of side ? [2, x1] : [2, m, x1]) c.col(x, b - 8, b, IR);
    c.row(b, 2, x1, ID);
    c.row(b - 8, 2, x1, IR);
    if (!u) {
      c.rect(2, b - 13, x1, b - 9, WD);
      c.row(b - 14, 3, x1 - 1, WL);
      c.row(b - 13, 2, x1, WL);
      for (const x of side ? [2, x1] : [2, m, x1]) c.col(x, b - 13, b - 9, IR);
      if (!side) skull(c, m - 2, b - 10);
      else c.rect(x1, b - 9, x1, b - 7, BR);
    } else {
      // the lid stands open behind
      c.rect(2, b - 19, x1, b - 13, hex('#2a1c1a'));
      c.frame(2, b - 19, x1, b - 13, IR);
      c.rect(3, b - 12, x1 - 1, b - 9, NI);
      c.row(b - 9, 3, x1 - 1, BR);
      c.row(b - 10, 4, x1 - 2, BR);
      dots(c, C.gold, [4, b - 10, m - 2, b - 11, m + 3, b - 10, x1 - 3, b - 11]);
      dots(c, L(C.gold), [m, b - 11, 5, b - 9]);
      skull(c, m - 2, b - 14, false, BONE, SOULD);
      c.rect(x1 - 4, b - 9, x1 - 3, b - 6, BONE); // fingers over the rim
      c.set(x1 - 6, b - 8, BONE);
      c.set(x1 - 6, b - 7, BONED);
    }
    return () => u && dots(c, SOUL, [m - 4, b - 16, m + 4, b - 18, m, b - 21]);
  }
  O('hell-chest-cursed', 'cursed treasure chest iron bound with a skull lock gold of the dead coffer', {
    w: 24,
    h: 18,
    uh: 26,
    f: (c, u) => chest(c, u, 21, false),
    sw: 16,
    suh: 26,
    s: (c, u) => chest(c, u, 13, true),
  });

  /* ---------- urn of ashes ---------- */
  function urn(c) {
    // 10 wide, 14 high
    [[3, 6], [2, 7], [4, 5], [3, 6], [1, 8], [0, 9], [0, 9], [0, 9], [0, 9], [1, 8], [1, 8], [2, 7], [3, 6], [2, 7]].forEach(([a, z], y) => {
      c.row(y, a, z, y === 0 ? L(BRONZE) : BRONZE);
      c.set(a, y, L(BRONZE));
      c.set(z, y, D(BRONZE));
    });
    c.row(6, 1, 8, BR);
    dots(c, BR, [3, 8, 5, 8, 4, 9]);
  }
  O('hell-urn-ashes-plinth', 'urn of ashes on a stone plinth bronze funeral urn cinerary vase remains', {
    w: 16,
    h: 34,
    uw: 26,
    f(c, u) {
      const b = 32;
      c.rect(4, 19, 11, b, BAS);
      c.col(4, 19, b, BASL);
      c.rect(3, 17, 12, 18, BASL);
      c.rect(3, b - 1, 12, b, BAS);
      c.row(24, 5, 11, D(BAS));
      if (!u) c.stamp(part(10, 14, urn), 3, 3);
      else {
        c.stamp(turn(part(10, 14, urn), true), 6, 7);
        c.rect(19, 13, 20, 16, ASH);
        for (const [x, y0] of [[13, 17], [14, 18], [15, 20], [16, 24]]) c.col(x, y0, b - 3, x % 2 ? ASH : D(ASH));
        c.poly([[12, b], [15, b - 5], [18, b - 3], [22, b]], ASH);
        c.row(b, 12, 22, D(ASH));
        dots(c, BONE, [16, b - 2, 19, b - 1]);
      }
    },
    sw: 16,
    suw: 16,
    s(c, u) {
      const b = 32;
      c.rect(4, 19, 11, b, BAS);
      c.col(4, 19, b, BASL);
      c.rect(3, 17, 12, 18, BASL);
      c.rect(3, b - 1, 12, b, BAS);
      skull(c, 5, 22, false, BASL, D(BAS));
      if (!u) c.stamp(part(10, 14, urn), 3, 3);
      else {
        // seen end on, mouth to you
        c.oval(3, 7, 12, 16, BRONZE);
        ring(c, 3, 7, 12, 16, L(BRONZE));
        c.oval(6, 10, 9, 13, NI);
        c.rect(6, 13, 9, 16, ASH);
        c.col(7, 17, b - 2, ASH);
        c.col(8, 17, b - 3, D(ASH));
        c.rect(5, b - 1, 10, b, ASH);
      }
    },
  });

  /* ---------- stake and pyre ---------- */
  function pyre(c, u, x1) {
    const b = 44,
      m = (2 + x1) >> 1;
    c.rect(m, 3, m + 1, b - 4, u ? CHAR : WL);
    c.col(m + 1, 3, b - 4, u ? hex('#1c1618') : WD);
    c.set(m, 2, u ? CHAR : WL);
    if (!u) {
      thin(c, m - 1, 14, m + 2, 14, ST);
      thin(c, m - 1, 22, m + 2, 22, ST);
      c.col(m + 2, 14, 18, ST);
      c.col(m - 1, 22, 25, ST);
    }
    // the faggots
    for (let r = 0; r < 4; r++) {
      const y = b - r * 3,
        x0 = 2 + r * 2,
        xe = x1 - r * 2;
      for (let x = x0; x + 3 <= xe + 1; x += 4) {
        c.rect(x, y - 2, x + 3, y, (x + r) % 8 ? WL : WD);
        c.row(y, x, x + 3, WD);
        c.set(x, y - 1, hex('#765848'));
        if (u) c.set(x + 2, y - 1, EMBER);
      }
    }
    if (u) {
      fire(c, 3, x1 - 1, b - 9, 14, 3);
      flame(c, m, b - 16, 16, 3, 2);
      flame(c, m - 4, b - 12, 12, 2, 5);
      flame(c, m + 5, b - 12, 11, 2, 8);
      dots(c, CHAR, [m, 5, m + 1, 8, m, 10]);
    }
    return () => u && sparks(c, [m - 6, 12, m + 6, 9, m - 3, 4, m + 4, 3, m + 8, 16]);
  }
  O('hell-stake-pyre', 'stake and pyre wooden post with chains over stacked firewood burning at the stake bonfire', {
    w: 28,
    h: 46,
    f: (c, u) => pyre(c, u, 25),
    sw: 22,
    s: (c, u) => pyre(c, u, 19),
  });

  /* ---------- the bone mill ---------- */
  O('hell-bone-mill', 'bone mill grinder with hopper and crank grinding bones to meal stone machine', {
    w: 28,
    h: 32,
    f(c, u) {
      const b = 30;
      if (!u) {
        bone(c, 8, 2, 12, 7);
        bone(c, 16, 1, 13, 7);
        skull(c, 9, 4 - 1);
      } else bone(c, 14, 4, 12, 8);
      c.poly([[5, 6], [18, 6], [15, 12], [8, 12]], WL);
      c.line(5, 6, 8, 12, hex('#765848'));
      c.row(6, 5, 18, hex('#765848'));
      c.rect(4, 13, 19, 23, BAS);
      c.col(4, 13, 23, BASL);
      c.row(13, 4, 19, BASL);
      c.oval(7, 14, 16, 22, D(BAS));
      ring(c, 7, 14, 16, 22, BASL);
      c.set(11, 18, IR);
      c.set(12, 18, IR);
      for (const x of [5, 17]) c.rect(x, 24, x + 1, b, WD);
      c.rect(20, 17, 22, 18, IR);
      u ? c.col(23, 11, 18, IR) : c.col(23, 17, 24, IR);
      c.rect(23, u ? 9 : 25, 24, u ? 10 : 26, BONE);
      // the spout and the trough
      c.rect(9, 24, 13, 25, IR);
      c.rect(7, b - 2, 15, b, WD);
      c.row(b - 2, 7, 15, WL);
      if (u) {
        c.poly([[8, b - 3], [11, b - 7], [14, b - 3]], BONE);
        c.col(11, 26, b - 7, BONED);
        dots(c, BONED, [10, b - 4, 12, b - 5, 16, b, 6, b]);
      } else c.row(b - 3, 9, 13, BONED);
    },
    sw: 20,
    s(c, u) {
      const b = 30;
      if (!u) {
        bone(c, 6, 2, 9, 7);
        skullS(c, 8, 3);
      }
      c.poly([[4, 6], [13, 6], [11, 12], [6, 12]], WL);
      c.row(6, 4, 13, hex('#765848'));
      c.rect(4, 13, 13, 23, BAS);
      c.col(4, 13, 23, BASL);
      c.row(13, 4, 13, BASL);
      for (const x of [5, 11]) c.rect(x, 24, x + 1, b, WD);
      // the crank wheel, flat on
      ring(c, 5, 14, 12, 21, IR);
      c.set(8, 17, ST);
      c.set(9, 18, ST);
      u ? c.line(9, 17, 11, 14, IR) : c.line(9, 18, 11, 21, IR);
      c.rect(11, u ? 12 : 22, 12, u ? 13 : 23, BONE);
      c.rect(14, 24, 15, 25, IR);
      c.rect(13, b - 2, 17, b, WD);
      c.row(b - 2, 13, 17, WL);
      if (u) {
        c.rect(14, b - 5, 16, b - 3, BONE);
        c.set(15, b - 6, BONE);
        c.col(15, 26, b - 7, BONED);
      }
    },
  });

  /* ---------- chalice on a plinth ---------- */
  function chalice(c, u, side) {
    const b = 30;
    c.rect(5, 14, 8, b - 2, OBS);
    c.col(5, 14, b - 2, OBL);
    c.rect(3, 12, 10, 13, OBL);
    c.rect(3, b - 1, 10, b, OBS);
    c.row(b - 1, 3, 10, OBL);
    if (side) skull(c, 4, 17, false, OBL, NI);
    else dots(c, BD, [6, 17, 7, 17, 6, 18, 7, 20, 6, 21, 7, 21]);
    if (!u) {
      c.rect(4, 4, 9, 7, BR);
      c.row(4, 4, 9, L(BR));
      c.row(4, 5, 8, BL);
      c.row(8, 5, 8, D(BR));
      c.rect(6, 9, 7, 10, BR);
      c.rect(5, 11, 8, 11, BR);
      c.set(4, 5, L(BR));
    } else {
      // on its side, emptied
      c.rect(2, 8, 5, 11, BR);
      c.col(2, 8, 11, BL);
      c.rect(6, 9, 8, 10, BR);
      c.rect(9, 8, 9, 11, BR);
      c.row(8, 2, 5, L(BR));
    }
    return () => {
      if (!u) return;
      c.row(12, 3, 6, BL);
      drip(c, 3, 13, 6);
      drip(c, 5, 13, 10);
      drip(c, 4, 13, 3);
      dots(c, BL, [2, b, 3, b, 4, b]);
    };
  }
  O('hell-chalice-plinth', 'chalice of blood on a black plinth brass goblet offering cup pedestal', {
    w: 14,
    h: 32,
    f: (c, u) => chalice(c, u, false),
    sw: 14,
    s: (c, u) => chalice(c, u, true),
  });

  /* ---------- the kennel ---------- */
  O('hell-kennel-three-arches', 'kennel of the three headed hound stone doghouse with three arches chains cerberus lair', {
    w: 44,
    h: 30,
    f(c, u) {
      const b = 28;
      c.rect(3, 6, 40, b, BAS);
      c.col(3, 6, b, BASL);
      c.rect(2, 4, 41, 6, BASL);
      c.row(6, 2, 41, BAS);
      for (const y of [11, 16, 21]) c.row(y, 4, 40, D(BAS));
      spike(c, 6, 3, 3, 2, IR);
      spike(c, 22, 3, 3, 2, IR);
      spike(c, 37, 3, 3, 2, IR);
      [5, 17, 29].forEach((x, i) => {
        c.rect(x, 12, x + 9, b, NI);
        c.row(11, x + 1, x + 8, NI);
        c.row(10, x + 3, x + 6, NI);
        if (u) {
          eyes(c, x + 3, 17 + (i % 2), LAVAL, 3);
          c.row(21 + (i % 2), x + 3, x + 6, BONE);
          dots(c, NI, [x + 4, 21 + (i % 2)]);
        }
        c.set(x + 10, 20, ST);
        u ? thin(c, x + 9, 21, x + 7, 24, ST) : thin(c, x + 10, 21, x + 8, b, ST);
      });
      if (!u) {
        bone(c, 8, b, 14, b - 1);
        c.rect(32, b - 1, 37, b, BR);
      } else {
        bone(c, 12, b, 15, b);
        dots(c, BONE, [9, b, 7, b - 1]);
        c.rect(32, b - 1, 37, b, BR);
        c.row(b - 1, 33, 36, BL);
      }
      return () => u && dots(c, BL, [20, b, 24, b]);
    },
    sw: 24,
    s(c, u) {
      const b = 28;
      c.rect(3, 6, 20, b, BAS);
      c.col(3, 6, b, BASL);
      c.rect(2, 4, 21, 6, BASL);
      c.row(6, 2, 21, BAS);
      for (const y of [11, 16, 21]) c.row(y, 4, 20, D(BAS));
      spike(c, 20, 3, 3, 2, IR);
      c.rect(8, 10, 14, 15, NI);
      bars(c, 8, 14, 10, 15, IR, 2);
      if (u) eyes(c, 9, 12, LAVAL, 4);
      c.set(21, 20, ST);
      u ? dots(c, ST, [22, 21, 22, 22]) : thin(c, 22, 21, 22, b, ST);
    },
  });

  /* ---------- tar barrel ---------- */
  function tarBarrel(c, u, side) {
    const b = c.h - 2,
      T = hex('#1a171c');
    c.rect(3, b - 16, 12, b, WD);
    c.rect(2, b - 12, 13, b - 4, WD);
    c.col(3, b - 16, b, WL);
    c.col(2, b - 12, b - 4, WL);
    for (const x of [5, 8, 11]) c.col(x, b - 15, b - 1, D(WD));
    for (const y of [b - 14, b - 8, b - 2]) c.row(y, y === b - 8 ? 2 : 3, y === b - 8 ? 13 : 12, IR);
    c.row(b - 17, 4, 11, T);
    c.row(b - 16, 3, 12, T);
    for (const [x, n] of side ? [[4, 6], [9, 3], [11, 8]] : [[3, 4], [6, 8], [10, 5], [12, 2]]) c.col(x, b - 15, b - 15 + n, T);
    if (u) {
      fire(c, 4, 11, b - 17, 10, 3);
      flame(c, 7, b - 17, 13, 3, 2);
    } else {
      c.line(side ? 6 : 10, b - 17, side ? 4 : 13, b - 22, WL); // the stirring stick
    }
    return () => (u ? sparks(c, [3, 4, 12, 6, 9, 1]) : c.set(side ? 9 : 5, b, T));
  }
  O('hell-tar-barrel', 'barrel of boiling pitch tar barrel black and dripping wooden cask burning', {
    w: 16,
    h: 26,
    uh: 34,
    f: (c, u) => tarBarrel(c, u, false),
    sw: 16,
    suh: 34,
    s: (c, u) => tarBarrel(c, u, true),
  });

  /* ---------- milestone ---------- */
  O('hell-milestone-ninth', 'milestone of hell worn stone marker carved number of the circle arrow pointing down', {
    w: 16,
    h: 22,
    f(c, u) {
      const b = 20,
        R = u ? LAVA : NI;
      c.rect(3, 6, 12, b, BAS);
      c.row(5, 4, 11, BAS);
      c.row(4, 5, 10, BASL);
      c.col(3, 6, b, BASL);
      c.rect(2, b - 1, 13, b, BAS);
      // IX, and the way: down
      c.col(5, 7, 10, R);
      dots(c, R, [7, 7, 8, 8, 9, 9, 10, 10, 10, 7, 9, 8, 8, 9, 7, 10]);
      c.col(8, 12, 16, R);
      dots(c, R, [6, 14, 7, 15, 9, 15, 10, 14]);
      if (u) for (const [x, y] of [[11, 5], [11, 6], [12, 7], [11, 8], [12, 9], [12, 10], [11, 11]]) c.set(x, y, EMBER);
      else dots(c, hex('#3e4a36'), [4, 17, 5, 18, 4, 18, 11, 16]);
      return () => u && sparks(c, [13, 3, 1, 9], EMBER);
    },
    sw: 10,
    s(c, u) {
      const b = 20;
      c.rect(3, 6, 6, b, BAS);
      c.row(5, 3, 6, BAS);
      c.row(4, 4, 5, BASL);
      c.col(3, 6, b, BASL);
      c.rect(2, b - 1, 7, b, BAS);
      dots(c, D(BAS), [5, 9, 5, 10, 4, 14]);
      if (u) dots(c, EMBER, [6, 6, 6, 8, 6, 10]);
      else dots(c, hex('#3e4a36'), [4, 17, 5, 18]);
    },
  });

  /* ---------- mooring post ---------- */
  function lamp(c, x, y, lit, col = SOUL) {
    c.set(x + 1, y, ID);
    c.frame(x, y + 1, x + 2, y + 5, IR);
    c.rect(x + 1, y + 2, x + 1, y + 4, lit ? col : NI);
    if (lit) c.set(x + 1, y + 3, hex('#d5ead8'));
  }
  O('hell-mooring-post-styx', 'mooring post on the river styx wooden pile with rope ring lantern and a bowl for the ferryman coin', {
    w: 18,
    h: 36,
    f(c, u) {
      const b = 34;
      c.rect(6, 6, 10, b, WD);
      c.col(6, 6, b, WL);
      c.col(10, 6, b, hex('#2a1c1a'));
      c.row(5, 7, 9, WL);
      dots(c, D(WD), [8, 10, 8, 11, 7, 20, 8, 27, 8, 28]);
      c.rect(6, b - 4, 10, b, hex('#2a2a26')); // wet at the foot
      c.rect(11, 8, 14, 8, IR);
      lamp(c, 13, 9, u);
      if (!u) {
        ring(c, 3, 17, 8, 23, HIDE);
        ring(c, 4, 18, 7, 22, D(HIDE));
        c.col(4, 24, 30, HIDE);
        c.row(16, 6, 10, HIDE);
      } else c.row(16, 6, 10, IR);
      c.rect(12, b - 1, 16, b, BR);
      c.row(b - 2, 11, 17, L(BR));
      if (u) dots(c, C.gold, [13, b - 3, 15, b - 3]);
      return () => u && dots(c, SOULD, [12, 11, 16, 13, 14, 16]);
    },
    sw: 16,
    s(c, u) {
      const b = 34;
      c.rect(5, 6, 9, b, WD);
      c.col(5, 6, b, WL);
      c.col(9, 6, b, hex('#2a1c1a'));
      c.row(5, 6, 8, WL);
      c.rect(5, b - 4, 9, b, hex('#2a2a26'));
      lamp(c, 6, 9, u);
      c.set(7, 8, IR);
      if (!u) {
        c.rect(3, 17, 4, 23, HIDE);
        c.col(4, 18, 22, D(HIDE));
        c.col(3, 24, 30, HIDE);
        c.row(16, 5, 9, HIDE);
      } else c.row(16, 5, 9, IR);
      c.rect(10, b - 1, 13, b, BR);
      c.row(b - 2, 10, 14, L(BR));
      if (u) dots(c, C.gold, [11, b - 3, 12, b - 3]);
      return () => u && dots(c, SOULD, [4, 11, 10, 13]);
    },
  });

  /* ---------- soul lantern on a crook ---------- */
  O('hell-lantern-soul-crook', 'soul lantern hanging from an iron crook a captured soul for a light lamp post', {
    w: 16,
    h: 42,
    f(c, u) {
      const b = 40;
      c.rect(4, 6, 5, b, IR);
      c.col(4, 6, b, L(IR));
      dots(c, IR, [5, 5, 6, 4, 7, 3, 8, 3, 9, 3, 10, 4, 11, 5, 11, 6]);
      rock(c, 1, b - 3, 9, b, BAS, 3);
      thin(c, 11, 7, 11, 9, ST);
      c.row(10, 9, 13, IR);
      c.rect(9, 11, 13, 18, u ? NI : SOULD);
      c.frame(9, 11, 13, 18, IR);
      c.rect(10, 19, 12, 19, ID);
      if (!u) {
        c.rect(10, 13, 12, 16, SOUL);
        dots(c, NI, [10, 14, 12, 14]);
        c.set(11, 12, hex('#d5ead8'));
      } else {
        c.clear(13, 13);
        c.clear(13, 14);
        c.clear(13, 15);
        c.col(14, 12, 16, IR); // the little door hangs open
      }
      return () => (u ? dots(c, C.glassLight, [12, b, 14, b - 1]) : dots(c, SOULD, [7, 13, 15, 15, 11, 22]));
    },
    sw: 10,
    s(c, u) {
      const b = 40;
      c.rect(4, 3, 5, b, IR);
      c.col(4, 3, b, L(IR));
      rock(c, 1, b - 3, 8, b, BAS, 3);
      c.row(10, 3, 7, IR);
      c.rect(3, 11, 7, 18, u ? NI : SOULD);
      c.frame(3, 11, 7, 18, IR);
      c.rect(4, 19, 6, 19, ID);
      if (!u) {
        c.rect(4, 13, 6, 16, SOUL);
        c.set(6, 14, NI);
      } else c.frame(4, 12, 6, 17, ID);
      return () => !u && dots(c, SOULD, [1, 14, 8, 16]);
    },
  });

  /* ---------- summoning circle ---------- */
  function circle(c, u, x1, cand) {
    const b = c.h - 2,
      m = (2 + x1) >> 1,
      R = u ? EMBER : hex('#8a8474');
    ring(c, 2, b - 6, x1, b, R);
    ring(c, 6, b - 5, x1 - 4, b - 1, u ? LAVA : hex('#6c6658'));
    c.line(m - 6, b - 1, m, b - 5, R);
    c.line(m, b - 5, m + 6, b - 1, R);
    c.row(b - 3, m - 7, m + 7, R);
    if (u) {
      // something answers
      const S = hex('#2a2030');
      for (let y = 3; y <= b - 3; y++) {
        const hw = y < 9 ? 2 : Math.round(2 + Math.sin(y * 0.7) * 1.2 + (y - 9) * 0.12);
        c.row(y, m - hw + Math.round(Math.sin(y * 0.5)), m + hw + Math.round(Math.sin(y * 0.5)), y % 4 === 0 ? hex('#3d3146') : S);
      }
      dots(c, S, [m - 3, 2, m + 3, 2, m - 3, 1, m + 3, 1, m - 2, 3, m + 2, 3]);
      eyes(c, m - 1, 6, LAVAL, 2);
    }
    for (const [x, dy] of cand) {
      const y = b - dy;
      c.rect(x, y - 4, x + 1, y, hex('#231f29'));
      c.col(x, y - 4, y, hex('#3d3747'));
      if (u) {
        c.set(x, y - 5, C.flame);
        c.set(x, y - 6, C.flameLight);
      } else c.set(x, y - 5, NI);
    }
    return () => u && sparks(c, [m - 8, b - 12, m + 7, b - 16, m + 5, 4], EMBER);
  }
  O('hell-summoning-circle', 'summoning circle chalk pentagram on the floor ring of black candles ritual conjuring', {
    w: 36,
    h: 14,
    uh: 34,
    solid: false,
    f: (c, u) => circle(c, u, 33, [[2, 3], [9, 0], [25, 0], [32, 3], [17, 6]]),
    sw: 30,
    suh: 34,
    s: (c, u) => circle(c, u, 27, [[2, 3], [13, 0], [26, 3], [8, 6], [20, 6]]),
  });
};
