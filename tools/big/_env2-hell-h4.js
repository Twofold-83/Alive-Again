/* Hell, part 4: the lava fall, the obelisk, fences and pits, the coffin, the scales, the book, the mirror. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, chain, chainH, thin, rusty, drip, pool, bars, ring, flame, fire, sparks, skull, skullS, bone, rock, spike, wheel, eyes, planks } = H;
  const { OBS, OBL, BAS, BASL, BRIM, BRIML, EMBER, LAVA, LAVAL, SULF, SULFL, CHAR, BONE, BONED, BL, BD, NI, SOUL, SOULD, HIDE } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    WD = hex('#3c2a24'),
    WL = hex('#5a4034'),
    BR = hex('#8a7436'),
    WINE = C.wine,
    GLINT = hex('#7a6c94'),
    PAPER = C.paper;

  /* ---------- lava fall ---------- */
  function lavaFall(c, u, x1, sx) {
    const b = 42;
    rock(c, 2, 2, x1, b, BRIM, x1 + 2, 0.45);
    for (let y = 8; y < b; y += 7) c.line(3, y + 2, x1 - 1, y, D(BRIM));
    dots(c, BRIML, [4, 12, 5, 20, 4, 30, 6, 26]);
    c.rect(sx - 1, 9, sx + 2, 11, NI);
    c.row(11, sx - 1, sx + 2, EMBER);
    const bx0 = sx - 5,
      bx1 = sx + 6;
    if (u) {
      c.rect(sx - 1, 11, sx + 2, 37, LAVA);
      c.col(sx, 10, 37, LAVAL);
      c.col(sx + 2, 12, 37, EMBER);
      dots(c, LAVAL, [sx + 1, 15, sx + 1, 22, sx + 1, 30, sx - 1, 26]);
    } else {
      c.col(sx, 11, 37, LAVA);
      dots(c, LAVAL, [sx, 13, sx, 19, sx, 26, sx, 32]);
      dots(c, EMBER, [sx + 1, 14, sx + 1, 24, sx + 1, 34]);
    }
    c.rect(bx0, 37, bx1, b, BAS);
    c.row(37, bx0, bx1, BASL);
    c.col(bx0, 37, b, BASL);
    c.row(37, bx0 + 1, bx1 - 1, LAVA);
    c.row(37, sx - 2, sx + 3, LAVAL);
    dots(c, D(BAS), [bx0 + 2, 40, bx1 - 2, 39]);
    if (u) {
      c.rect(bx0 + 1, 36, bx1 - 1, 36, LAVA);
      for (const [x, n] of [[bx0, 4], [bx0 + 3, 2], [bx1 - 1, 3], [bx1, 5]]) c.col(x, 37, 37 + n, LAVA);
      c.row(b, bx0 - 2, bx0 + 1, EMBER);
      c.row(b, bx1 - 1, bx1 + 1, EMBER);
    }
    return () => sparks(c, u ? [sx - 3, 33, sx + 5, 31, sx - 4, 28, sx + 4, 25] : [sx + 3, 35], LAVA);
  }
  O('hell-lava-fall-rock', 'lava fall pouring from a red rock face into a stone basin magma cascade spout', {
    w: 24,
    h: 44,
    f: (c, u) => lavaFall(c, u, 21, 11),
    sw: 18,
    s: (c, u) => lavaFall(c, u, 13, 9),
  });

  /* ---------- obelisk ---------- */
  function obelisk(c, u, m, glyphs) {
    const b = 44,
      R = u ? LAVA : BD;
    for (let y = 4; y <= 40; y++) {
      const hw = 2 + Math.floor((y - 4) / 13);
      c.row(y, m - hw, m + 1 + hw, OBS);
      c.set(m - hw, y, OBL);
      c.set(m + 1 + hw, y, D(OBS));
    }
    dots(c, OBS, [m, 3, m + 1, 3, m, 2, m + 1, 2, m, 1]);
    c.set(m, 2, OBL);
    c.rect(m - 5, 41, m + 6, b, BAS);
    c.row(41, m - 5, m + 6, BASL);
    glyphs.forEach((g, i) => {
      const y = 8 + i * 5;
      for (let k = 0; k < g.length; k += 2) c.set(m + g[k], y + g[k + 1], R);
    });
    dots(c, GLINT, [m - 1, 6, m - 2, 20, m - 3, 33]);
    if (u) for (const [x, y] of [[m + 2, 24], [m + 1, 25], [m + 2, 26], [m + 3, 27], [m + 2, 28]]) c.set(x, y, LAVAL);
    return () => u && sparks(c, [m - 5, 12, m + 6, 18, m - 6, 28, m + 4, 5], EMBER);
  }
  O('hell-obelisk-runes', 'obelisk of black obsidian carved with runes standing stone needle glowing signs', {
    w: 14,
    h: 46,
    f: (c, u) => obelisk(c, u, 6, [[0, 0, 1, 0, 0, 1, 0, 2, 1, 2], [0, 0, 1, 1, 0, 2, 1, 2], [-1, 0, 2, 0, 0, 1, 1, 1, 0, 2], [0, 0, 0, 1, 1, 1, 2, 2, -1, 2], [-1, 0, 0, 1, 1, 0, 2, 1, 0, 2], [0, 0, 1, 0, 2, 0, 1, 1, 1, 2, -1, 2]]),
    sw: 14,
    s: (c, u) => obelisk(c, u, 6, [[0, 0, 1, 1, 0, 2], [0, 0, 1, 0, 1, 1, 1, 2], [0, 0, 0, 1, 0, 2, 1, 1], [-1, 0, 2, 0, 0, 2, 1, 2], [0, 0, 1, 1, 2, 2, -1, 1], [0, 1, 1, 0, 1, 2, 2, 1]]),
  });

  /* ---------- rib fence ---------- */
  O('hell-fence-ribs', 'fence of rib bones lashed with sinew bone palisade skull post barrier', {
    w: 34,
    h: 22,
    f(c, u) {
      const b = 20;
      for (let x = 3; x <= 30; x += 3) {
        if (u && x >= 15 && x <= 21) continue;
        const top = 4 + ((x * 7) % 3);
        c.col(x, top + 1, b, BONE);
        c.set(x + 1, top, BONE);
        c.set(x, top + 6, BONED);
        c.set(x, b, BONED);
      }
      c.row(10, 2, u ? 13 : 31, BONED);
      c.row(15, 2, u ? 13 : 31, BONED);
      if (u) {
        c.row(10, 23, 31, BONED);
        c.row(15, 23, 31, BONED);
        c.line(14, 10, 16, 13, BONED);
        bone(c, 14, b, 22, b - 1);
        bone(c, 16, b - 2, 21, b - 4);
        dots(c, BONE, [15, b - 5, 18, b]);
      }
      for (let x = 3; x <= 30; x += 6) {
        if (u && x >= 14 && x <= 22) continue;
        c.set(x, 10, HIDE);
        c.set(x, 15, HIDE);
      }
      skull(c, 1, 1);
    },
    sw: 8,
    s(c, u) {
      const b = 20;
      c.col(3, 5, b, BONE);
      c.set(4, 4, BONE);
      c.set(5, 4, BONED);
      c.set(3, b, BONED);
      c.rect(4, 10, 4, 10, BONED);
      c.rect(4, 15, 4, 15, BONED);
      dots(c, HIDE, [3, 10, 3, 15]);
      skullS(c, 2, 1 - 0);
      if (u) {
        bone(c, 5, b, 6, b - 5);
      }
    },
  });

  /* ---------- spike pit ---------- */
  function spikePit(c, u, x1, xs) {
    const b = c.h - 2;
    c.oval(2, b - 5, x1, b, BAS);
    c.oval(4, b - 4, x1 - 2, b - 1, NI);
    xs.forEach((x, i) => {
      const top = b - 12 + ((i * 5) % 4);
      c.col(x, top + 1, b - 2, IR);
      c.set(x, top, ST);
      c.set(x, top + 1, ST);
      if (u && i % 2 === 0) {
        c.set(x, top, BL);
        c.set(x, top + 1, BL);
        c.set(x, top + 3, BD);
      }
    });
    if (u) {
      // someone fell in, long ago
      const m = xs[Math.floor(xs.length / 2)];
      skull(c, m - 8, b - 10);
      for (let i = 0; i < 4; i++) c.col(m - 2 + i * 2, b - 9, b - 6, BONE);
      c.row(b - 8, m - 3, m + 5, BONED);
      bone(c, m + 6, b - 7, m + 9, b - 4);
    }
    c.row(b, 5, x1 - 3, BAS);
    dots(c, BASL, [3, b - 2, 5, b - 4, 8, b - 5]);
    return () => u && dots(c, BL, [xs[0], b - 4, xs[2], b - 3]);
  }
  O('hell-spike-pit', 'spike pit trap hole in the floor full of iron stakes impaling pit', {
    w: 34,
    h: 18,
    f: (c, u) => spikePit(c, u, 31, [7, 11, 15, 19, 23, 27]),
    sw: 22,
    s: (c, u) => spikePit(c, u, 19, [7, 10, 13, 16]),
  });

  /* ---------- the chained coffin ---------- */
  function coffinShape(c, x, w, col) {
    // x is the left edge at the shoulders, w the width there
    for (let y = 2; y <= 40; y++) {
      const k = y < 10 ? Math.round((10 - y) * 0.4) : Math.round((y - 10) * 0.07);
      c.row(y, x + k, x + w - 1 - k, col);
      c.set(x + k, y, L(col));
      c.set(x + w - 1 - k, y, D(col));
    }
  }
  O('hell-coffin-iron-chained', 'iron coffin standing upright wrapped in chains padlock sarcophagus something inside', {
    w: 18,
    h: 42,
    uw: 25,
    f(c, u) {
      const o = u ? 7 : 0;
      coffinShape(c, o + 2, 14, IR);
      if (!u) {
        c.rect(6, 7, 11, 10, NI);
        bars(c, 6, 11, 7, 10, ID, 2);
        eyes(c, 7, 8, EMBER, 3);
        dots(c, ST, [4, 13, 13, 13, 4, 37, 13, 37, 5, 4, 12, 4]);
        thin(c, 2, 16, 15, 22, ST);
        thin(c, 15, 16, 2, 22, ST);
        thin(c, 3, 28, 14, 32, ST);
        thin(c, 14, 28, 3, 32, ST);
        c.rect(7, 18, 10, 21, BR);
        c.row(18, 7, 10, L(BR));
        c.set(8, 20, NI);
      } else {
        for (let y = 4; y <= 38; y++) {
          const k = y < 10 ? Math.round((10 - y) * 0.4) : Math.round((y - 10) * 0.07);
          c.row(y, o + 4 + k, o + 13 - k, y % 9 === 3 ? D(WINE) : WINE);
        }
        c.rect(o + 5, 10, o + 12, 36, hex('#3a1420'));
        for (const x of [o + 7, o + 9, o + 11]) c.line(x, 14, x - 1, 22, WINE); // claw marks
        // the lid, flung open to the left
        for (let y = 3; y <= 40; y++) c.row(y, y < 10 ? 4 : 2, 6, IR);
        c.col(2, 10, 40, L(IR));
        c.col(6, 3, 40, ID);
        dots(c, ST, [4, 13, 4, 37]);
        thin(c, 3, 22, 3, 34, ST);
        thin(c, o + 15, 16, o + 15, 30, ST);
      }
      rusty(c, 1, 2, c.w - 2, 40, 5, 9);
      return () => u && dots(c, ST, [o + 16, 40, o + 14, 40, 9, 40]);
    },
    sw: 12,
    suw: 20,
    s(c, u) {
      c.rect(2, 3, 8, 40, IR);
      c.col(2, 3, 40, L(IR));
      c.col(8, 3, 40, ID);
      c.row(2, 3, 7, L(IR));
      if (!u) {
        c.rect(9, 4, 9, 39, ID); // the lid
        for (const y of [18, 20, 29, 31]) c.row(y, 2, 9, ST);
        c.rect(9, 18, 10, 21, BR);
      } else {
        c.col(9, 5, 38, WINE);
        c.rect(10, 3, 17, 40, IR); // the lid stands open, flat on
        c.frame(10, 3, 17, 40, ID);
        c.rect(12, 7, 15, 10, NI);
        dots(c, ST, [11, 13, 16, 13, 11, 37, 16, 37]);
        thin(c, 4, 20, 4, 34, ST);
      }
      rusty(c, 1, 2, c.w - 2, 40, 5, 9);
    },
  });

  /* ---------- the scales ---------- */
  function pan(c, x, y, what, top) {
    // a pan hanging at x (middle), its rim on row y, from a point at `top`
    c.line(x, top, x - 4, y, ST);
    c.line(x, top, x + 4, y, ST);
    c.row(y, x - 4, x + 4, BR);
    c.row(y + 1, x - 3, x + 3, D(BR));
    c.set(x - 4, y, L(BR));
    if (what === 'heart') {
      c.rect(x - 1, y - 3, x + 1, y - 1, C.red);
      c.set(x - 2, y - 3, C.red);
      c.set(x + 2, y - 3, BL);
      c.set(x, y - 4, BD);
      c.set(x + 1, y - 1, BL);
    } else if (what === 'feather') {
      c.line(x - 2, y - 1, x + 2, y - 4, hex('#efe9d8'));
      c.set(x - 1, y - 3, C.white);
      c.set(x + 1, y - 2, C.white);
    }
  }
  O('hell-scales-judgement', 'scales of judgement great balance weighing a heart against a feather brass pans', {
    w: 32,
    h: 42,
    f(c, u) {
      const b = 40;
      c.rect(15, 7, 16, 36, BR);
      c.col(15, 7, 36, L(BR));
      c.rect(14, 20, 17, 21, BR);
      c.rect(11, 37, 20, 38, BAS);
      c.rect(8, 39, 23, b, BAS);
      c.row(37, 11, 20, BASL);
      c.row(39, 8, 23, BASL);
      skull(c, 13, 1);
      const ly = u ? 11 : 8,
        ry = u ? 5 : 8;
      c.line(5, ly, 26, ry, BR);
      c.line(5, ly + 1, 26, ry + 1, D(BR));
      pan(c, 5, u ? 31 : 25, 'heart', ly + 1);
      pan(c, 26, u ? 19 : 25, 'feather', ry + 1);
      c.rect(14, 7, 17, 9, ST);
      return () => u && (drip(c, 5, 33, 2), c.set(5, b, BL));
    },
    sw: 12,
    s(c, u) {
      const b = 40;
      if (u) pan(c, 6, 19, 'feather', 6);
      c.rect(5, 7, 6, 36, BR);
      c.col(5, 7, 36, L(BR));
      c.rect(4, 20, 7, 21, BR);
      c.rect(3, 37, 8, 38, BAS);
      c.rect(2, 39, 9, b, BAS);
      c.row(37, 3, 8, BASL);
      c.row(39, 2, 9, BASL);
      skullS(c, 3, 1);
      c.rect(4, 7, 7, 9, ST);
      pan(c, 5, u ? 31 : 25, 'heart', u ? 12 : 9);
      return () => u && (drip(c, 5, 33, 2), c.set(5, b, BL));
    },
  });

  /* ---------- the book of the damned ---------- */
  O('hell-lectern-book-damned', 'lectern with the book of the damned great chained book of names red cover reading stand', {
    w: 20,
    h: 34,
    f(c, u) {
      const b = 32,
        RD = hex('#5a1c20');
      c.rect(8, 15, 11, 29, OBS);
      c.col(8, 15, 29, OBL);
      c.rect(7, 20, 12, 21, OBL);
      c.rect(5, 30, 14, 30, OBL);
      c.rect(3, 31, 16, b, OBS);
      c.row(31, 3, 16, OBL);
      c.rect(2, 12, 17, 14, WD);
      c.row(12, 2, 17, WL);
      if (!u) {
        c.rect(4, 4, 15, 11, RD);
        c.col(4, 4, 11, hex('#7a2a2e'));
        c.row(11, 4, 15, PAPER);
        dots(c, BR, [4, 4, 15, 4, 4, 10, 15, 10]);
        skull(c, 7, 5, false, BR, RD);
        thin(c, 15, 8, 17, 12, ST);
        thin(c, 17, 13, 13, 22, ST);
      } else {
        c.rect(2, 5, 17, 11, PAPER);
        c.row(4, 3, 8, PAPER);
        c.row(4, 11, 16, PAPER);
        c.col(9, 5, 11, hex('#8a8068'));
        c.col(10, 5, 11, hex('#efe9d8'));
        for (const y of [6, 8, 10]) {
          c.row(y, 3, 7, y === 8 ? EMBER : BD);
          c.row(y, 12, 16, y === 6 ? EMBER : BD);
        }
        c.row(12, 2, 17, hex('#5a1c20'));
        c.col(13, 12, 17, C.red); // the ribbon
        thin(c, 17, 13, 13, 22, ST);
      }
      return () => u && sparks(c, [5, 2, 13, 1, 9, 2], EMBER);
    },
    sw: 18,
    s(c, u) {
      const b = 32,
        RD = hex('#5a1c20');
      c.rect(6, 15, 9, 29, OBS);
      c.col(6, 15, 29, OBL);
      c.rect(5, 20, 10, 21, OBL);
      c.rect(3, 31, 12, b, OBS);
      c.row(31, 3, 12, OBL);
      c.rect(4, 30, 11, 30, OBL);
      c.line(3, 9, 14, 14, WL);
      c.line(3, 10, 14, 15, WD);
      c.rect(14, 12, 15, 13, WD); // the ledge
      if (!u) {
        c.line(4, 6, 13, 10, RD);
        c.line(4, 7, 13, 11, PAPER);
        c.line(4, 8, 13, 12, RD);
        c.line(4, 5, 13, 9, hex('#7a2a2e'));
      } else {
        c.line(4, 7, 13, 11, PAPER);
        c.line(4, 8, 13, 12, RD);
        c.line(6, 5, 9, 9, PAPER); // a leaf standing
        c.line(7, 5, 10, 9, hex('#efe9d8'));
        c.col(14, 14, 18, C.red);
      }
      return () => u && sparks(c, [6, 2, 10, 4], EMBER);
    },
  });

  /* ---------- the black mirror ---------- */
  O('hell-mirror-obsidian', 'black mirror of obsidian in a bone frame standing looking glass scrying demon reflection', {
    w: 18,
    h: 40,
    f(c, u) {
      const b = 38;
      c.line(4, 30, 2, b, BONED);
      c.line(13, 30, 15, b, BONED);
      c.row(b, 1, 4, BONE);
      c.row(b, 13, 16, BONED);
      c.oval(2, 4, 15, 31, BONED);
      ring(c, 2, 4, 15, 31, BONE);
      c.oval(4, 6, 13, 29, OBS);
      dots(c, GLINT, [6, 9, 5, 11, 6, 10, 5, 12, 10, 25, 11, 24]);
      skull(c, 6, 1);
      dots(c, BONED, [2, 17, 15, 17, 8, 31, 9, 31]);
      if (u) {
        c.rect(6, 13, 11, 20, NI);
        c.rect(7, 21, 10, 26, NI);
        dots(c, NI, [5, 12, 5, 11, 12, 12, 12, 11, 4, 10, 13, 10]);
        eyes(c, 7, 15, LAVAL, 3);
        c.row(18, 7, 10, EMBER);
        c.line(11, 7, 12, 12, GLINT);
      }
    },
    sw: 10,
    s(c, u) {
      const b = 38;
      c.line(4, 30, 2, b, BONED);
      c.line(5, 30, 7, b, BONED);
      c.row(b, 1, 3, BONE);
      c.row(b, 6, 8, BONED);
      c.rect(4, 4, 5, 31, BONE);
      c.col(5, 5, 30, BONED);
      c.col(6, 7, 28, OBS);
      skullS(c, 3, 1);
      if (u) dots(c, EMBER, [6, 15, 6, 18]);
      return () => u && sparks(c, [8, 14, 8, 17], EMBER);
    },
  });

  /* ---------- bed of nails ---------- */
  O('hell-bed-of-nails', 'bed of nails plank bed studded with iron spikes fakir torture bench', {
    w: 38,
    h: 14,
    base: 'side',
    f(c, u) {
      const b = 12;
      c.rect(2, 6, 35, 8, WD);
      c.row(6, 2, 35, WL);
      for (const x of [3, 33]) c.rect(x, 9, x + 1, b, WD);
      c.rect(17, 9, 18, b, WD);
      for (let x = 3; x <= 34; x += 2) {
        c.col(x, 3, 5, IR);
        c.set(x, 2, ST);
        if (u && x > 9 && x < 27 && x % 3) c.set(x, 2, BL), c.set(x, 3, BD);
      }
      if (u) {
        c.rect(27, 4, 31, 5, hex('#8a8474')); // a rag left on the points
        c.set(32, 5, hex('#8a8474'));
      }
      return () => u && (drip(c, 14, 9, 2), drip(c, 21, 9, 1), pool(c, 12, 22, b));
    },
    sw: 18,
    sh: 24,
    s(c, u) {
      const b = 22;
      c.rect(2, 4, 15, 18, WD);
      c.row(4, 2, 15, WL);
      c.col(2, 4, 18, WL);
      for (let y = 5; y <= 17; y += 3)
        for (let x = 3 + (y % 2); x <= 14; x += 2) {
          c.set(x, y, u && y > 6 && y < 16 && (x + y) % 3 ? BL : ST);
          c.set(x, y + 1, ID);
        }
      c.rect(2, 19, 15, 20, D(WD));
      c.rect(2, 21, 3, b, WD);
      c.rect(14, 21, 15, b, WD);
      if (u) c.rect(5, 14, 9, 16, hex('#8a8474'));
      return () => u && (drip(c, 8, 19, 2), dots(c, BL, [7, b, 8, b, 9, b]));
    },
  });

  /* ---------- the boulder ---------- */
  function boulder(c, u, x0, x1, side) {
    const b = 24,
      m = (x0 + x1) >> 1;
    c.oval(x0, 3, x1, b, BAS);
    c.oval(x0 + 2, 4, x1 - 5, b - 8, BASL);
    c.oval(x0 + 3, 6, x1 - 3, b - 2, BAS);
    dots(c, D(BAS), [m - 4, 16, m - 3, 17, m + 5, 12, m + 4, 20, m - 6, 9, m + 6, 17, m + 2, 22]);
    if (side) {
      c.rect(m - 1, 3, m + 1, b, IR);
      c.col(m - 1, 3, b, L(IR));
      ring(c, m - 2, 11, m + 2, 15, ST);
    } else {
      c.row(13, x0, x1, IR);
      c.row(14, x0, x1, ID);
      dots(c, ST, [x0 + 4, 13, m, 13, x1 - 4, 13]);
    }
    if (u) {
      // split through, the fire of the rock showing
      const z = [[0, 3], [1, 5], [0, 7], [-1, 9], [0, 11], [1, 13], [0, 15], [-1, 17], [-1, 19], [0, 21], [1, 23]];
      for (const [dx, y] of z) {
        c.rect(m + dx, y, m + dx + 1, y + 1, NI);
        c.set(m + dx, y + 1, EMBER);
        if (y > 9 && y < 19) c.set(m + dx + 1, y, LAVA);
      }
      dots(c, BAS, [m - 3, b, m + 4, b]);
    }
  }
  O('hell-boulder-chained', 'great boulder with an iron band and chain the stone a sinner must roll uphill sisyphus rock', {
    w: 30,
    h: 26,
    f(c, u) {
      boulder(c, u, 2, 23, false);
      if (!u) {
        chainH(c, 23, 27, 20, ST, 0.5);
        c.frame(25, 22, 28, 24, ST);
      } else dots(c, ST, [25, 24, 27, 24, 28, 23]);
      return () => u && sparks(c, [12, 1, 15, 2], EMBER);
    },
    sw: 24,
    s(c, u) {
      boulder(c, u, 2, 21, true);
      if (!u) thin(c, 11, 16, 11, 23, ST);
      return () => u && sparks(c, [10, 1, 14, 2], EMBER);
    },
  });

  /* ---------- the hourglass ---------- */
  function hourglass(c, u, side) {
    const b = 32,
      G = C.glass,
      ASH = C.ash;
    if (side) c.rect(7, 4, 8, 29, BONED);
    for (let y = 5; y <= 28; y++) {
      const d = Math.abs(y - 16.5),
        hw = Math.min(5, Math.max(1, Math.round(d * 0.55)));
      c.row(y, 8 - hw, 7 + hw, hex('#2c3640'));
      c.set(8 - hw, y, C.glassLight);
      c.set(7 + hw, y, G);
      const sand = u ? y >= 21 : (y >= 8 && y <= 15) || y >= 26 || (y > 15 && y < 26);
      if (sand && hw > 1) {
        if (u || y <= 15 || y >= 26) c.row(y, 9 - hw, 6 + hw, y % 3 ? ASH : D(ASH));
      }
      if (!u && y > 15 && y < 26) c.set(7, y, ASH);
    }
    if (u) skull(c, 5, 19, false, BONE);
    c.rect(2, 2, 13, 4, BONED);
    c.row(2, 2, 13, BONE);
    c.rect(2, 29, 13, 31, BONED);
    c.row(29, 2, 13, BONE);
    c.rect(1, b, 14, b, BONED);
    if (!side)
      for (const x of [2, 13]) {
        c.col(x, 5, 28, BONE);
        c.set(x, 16, BONED);
        c.set(x, 17, BONED);
      }
    else {
      dots(c, BONE, [2, 5, 13, 5, 2, 28, 13, 28]);
    }
  }
  O('hell-hourglass-great', 'great hourglass of ash in a bone frame time running out sand timer doom', {
    w: 16,
    h: 34,
    f: (c, u) => hourglass(c, u, false),
    sw: 16,
    s: (c, u) => hourglass(c, u, true),
  });

  /* ---------- the signpost ---------- */
  function arrow(c, x0, x1, y, dir, hot) {
    c.rect(x0, y, x1, y + 4, WL);
    c.row(y, x0, x1, hex('#765848'));
    c.row(y + 4, x0, x1, WD);
    const tip = dir > 0 ? x1 : x0;
    c.rect(tip + dir, y + 1, tip + dir, y + 3, WL);
    c.set(tip + 2 * dir, y + 2, WL);
    for (let x = x0 + 2; x <= x1 - 2; x += 2) if ((x * 3 + y) % 5) c.set(x, y + 2, hot ? EMBER : NI);
  }
  O('hell-signpost-abandon-hope', 'signpost at the edge of hell wooden arrows abandon all hope way marker crooked post', {
    w: 28,
    h: 42,
    f(c, u) {
      const b = 40;
      c.rect(13, 3, 14, b, WD);
      c.col(13, 3, b, WL);
      rock(c, 8, b - 3, 19, b, BAS, 6);
      arrow(c, 4, 19, 6, -1, u);
      arrow(c, 9, 24, 13, 1, u);
      if (!u) {
        // the third hangs by one nail
        c.line(9, 21, 19, 25, WL);
        c.line(9, 22, 19, 26, WL);
        c.line(9, 23, 19, 27, WD);
        dots(c, NI, [11, 22, 13, 23, 16, 25]);
        c.set(14, 22, ST);
      } else {
        c.rect(15, b - 3, 26, b - 1, WL);
        c.row(b - 1, 15, 26, WD);
        dots(c, EMBER, [17, b - 2, 19, b - 2, 22, b - 2, 24, b - 2]);
        c.set(14, 22, ST);
      }
      skullS(c, 11, 0 + 1, true);
      return () => u && sparks(c, [3, 4, 25, 11], EMBER);
    },
    sw: 10,
    s(c, u) {
      const b = 40;
      c.rect(4, 3, 5, b, WD);
      c.col(4, 3, b, WL);
      rock(c, 1, b - 3, 8, b, BAS, 6);
      c.rect(3, 6, 6, 10, WL);
      c.rect(3, 13, 6, 17, WL);
      c.col(6, 6, 10, WD);
      c.col(6, 13, 17, WD);
      if (!u) c.rect(3, 21, 6, 26, WL);
      else c.rect(6, b - 3, 8, b - 1, WL);
      skull(c, 2, 1);
    },
  });
};
