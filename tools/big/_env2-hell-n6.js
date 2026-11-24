/* Nightmare, part 6: the office, the sitting room, the hall, the street outside. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, thin, drip, pool, bars, ring, eyes, planks, shade } = H;
  const { NI, SHEET, SHEETD, PJ, SHADOW, SKIN, SICK, DWATER, WALLP, LINO, SCREEN, CARP } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    STL = hex('#b0b3ba'),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    BR = C.brass,
    EYE = hex('#e8e4d0'),
    GLASSD = hex('#1c2430'),
    GLASSL = hex('#51627a'),
    LAMP = hex('#d8cf8a'),
    PAPER = C.paper,
    WHITE = hex('#e4dfd0'),
    PALE = hex('#a8a090'),
    OFF = hex('#6a7068'),
    OFFL = hex('#868c82'),
    OFFD = hex('#4e544e'),
    HAIR = hex('#17141b');

  /* ---------- the office desk ---------- */
  function stack(c, x, y0, y1, lean = 0) {
    for (let y = y0; y <= y1; y++) {
      const o = Math.round((lean * (y1 - y)) / (y1 - y0 || 1)) + ((y * 7) % 3 === 0 ? 1 : 0);
      c.row(y, x + o, x + 5 + o, y % 2 ? PAPER : WHITE);
      if (y % 5 === 0) c.set(x + 5 + o, y, hex('#8a8068'));
    }
  }
  O('nightmare-office-desk-paper', 'office desk buried in paper grey metal desk typewriter and stacks of forms that never end', {
    w: 38,
    h: 36,
    f(c, u) {
      const b = 34;
      c.rect(2, 20, 35, 22, OFFL);
      c.row(20, 2, 35, hex('#9aa096'));
      c.row(22, 2, 35, OFF);
      c.rect(3, 23, 12, b, OFF);
      c.rect(25, 23, 34, b, OFF);
      c.col(3, 23, b, OFFL);
      c.col(25, 23, b, OFFL);
      for (const x of [4, 26]) {
        c.frame(x, 24, x + 7, 27, OFFD);
        c.frame(x, 29, x + 7, 32, OFFD);
        c.set(x + 3, 26, ST);
        c.set(x + 4, 31, ST);
      }
      // the typewriter
      c.rect(14, 15, 23, 19, HAIR);
      c.row(15, 14, 23, hex('#3a3440'));
      c.rect(15, 13, 22, 14, hex('#3a3440'));
      for (let x = 15; x <= 22; x += 2) c.set(x, 18, ST);
      c.rect(16, u ? 8 : 10, 21, 13, WHITE);
      if (u) dots(c, HAIR, [17, 9, 19, 9, 20, 9, 17, 11, 18, 11, 20, 11, 17, 12, 19, 12]);
      if (!u) {
        stack(c, 4, 4, 19, 1);
        stack(c, 27, 8, 19, 0);
        stack(c, 10, 14, 19, 0);
      } else {
        // the tall one has come down
        stack(c, 4, 15, 19, 0);
        stack(c, 27, 8, 19, 0);
        for (let i = 0; i < 9; i++) c.rect(1 + ((i * 5) % 9), b - 1 - (i >> 2), 5 + ((i * 5) % 9), b - (i >> 2), i % 2 ? PAPER : WHITE);
        c.line(9, 17, 13, b - 3, WHITE);
        c.line(10, 16, 14, b - 5, PAPER);
        dots(c, WHITE, [16, b, 19, b - 1, 21, b]);
      }
    },
    sw: 20,
    s(c, u) {
      const b = 34;
      c.rect(2, 20, 17, 22, OFFL);
      c.row(20, 2, 17, hex('#9aa096'));
      c.row(22, 2, 17, OFF);
      c.rect(3, 23, 16, b, OFF);
      c.col(3, 23, b, OFFL);
      c.frame(5, 25, 14, b - 2, OFFD);
      c.rect(9, 15, 15, 19, HAIR);
      c.rect(10, 13, 13, 14, hex('#3a3440'));
      c.rect(10, u ? 8 : 10, 12, 13, WHITE);
      if (!u) stack(c, 3, 4, 19, 1);
      else {
        stack(c, 3, 15, 19, 0);
        for (let i = 0; i < 5; i++) c.rect(1 + ((i * 3) % 5), b - 1 - (i >> 1), 5 + ((i * 3) % 5), b - (i >> 1), i % 2 ? PAPER : WHITE);
      }
    },
  });

  /* ---------- the filing cabinet ---------- */
  O('nightmare-filing-cabinet-name', 'filing cabinet four drawers grey steel one drawer has your name on it files records', {
    w: 16,
    h: 40,
    f(c, u) {
      const b = 38;
      c.rect(2, 2, 13, b, OFF);
      c.row(2, 2, 13, OFFL);
      c.col(2, 2, b, OFFL);
      for (let i = 0; i < 4; i++) {
        const y = 4 + i * 9;
        if (u && i === 1) {
          // pulled right out
          c.rect(3, y, 12, y + 2, NI);
          for (let x = 4; x <= 11; x += 2) c.col(x, y - 1, y + 2, x % 4 ? PAPER : C.mustard);
          c.rect(2, y + 3, 13, y + 9, OFFL);
          c.frame(2, y + 3, 13, y + 9, OFFD);
          c.rect(6, y + 5, 9, y + 6, WHITE);
          c.rect(6, y + 7, 9, y + 7, ST);
          c.rect(10, y + 1, 11, y + 3, PALE); // and somebody's fingers are in it
          c.set(12, y + 2, PALE);
          continue;
        }
        if (u && i === 2) continue;
        c.frame(3, y, 12, y + 7, OFFD);
        c.rect(6, y + 2, 9, y + 3, i === 1 ? WHITE : PAPER);
        c.rect(6, y + 5, 9, y + 5, ST);
        if (i === 1) c.row(y + 3, 7, 8, HAIR);
      }
      if (u) {
        c.frame(3, 26, 12, 29, OFFD);
        c.frame(3, 31, 12, 36, OFFD);
        c.rect(6, 33, 9, 33, ST);
      }
    },
    sw: 16,
    suw: 24,
    s(c, u) {
      const b = 38;
      c.rect(2, 2, 13, b, OFF);
      c.row(2, 2, 13, OFFL);
      c.col(2, 2, b, OFFL);
      c.frame(4, 5, 11, b - 3, OFFD);
      for (let i = 0; i < 4; i++) {
        const y = 4 + i * 9;
        if (u && i === 1) {
          c.rect(14, y + 1, 21, y + 7, OFFL); // the drawer, run out on its rails
          c.frame(14, y + 1, 21, y + 7, OFFD);
          c.rect(22, y + 3, 22, y + 5, ST);
          for (let x = 15; x <= 20; x += 2) c.col(x, y - 1, y, x % 4 ? PAPER : C.mustard);
          c.rect(18, y - 1, 19, y + 1, PALE);
        } else c.rect(14, y + 3, 14, y + 4, ST);
      }
    },
  });

  /* ---------- the curtain with feet ---------- */
  O('nightmare-curtain-feet-below', 'long curtain with a pair of feet showing underneath somebody is standing behind the curtain', {
    w: 26,
    h: 44,
    solid: false,
    f(c, u) {
      const b = 42,
        CU = hex('#5a3a44'),
        CL = hex('#754e58'),
        CD = hex('#40262e');
      c.rect(1, 2, 24, 3, BR);
      c.row(2, 1, 24, L(BR));
      dots(c, BR, [0 + 1, 4, 24, 4]);
      c.rect(3, 4, 22, b - 3, CU);
      for (let x = 3; x <= 22; x++) {
        const k = (x * 5) % 7;
        if (k < 2) c.col(x, 4, b - 3, CL);
        else if (k > 4) c.col(x, 4, b - 3, CD);
        if (x % 3) c.set(x, b - 2, CU);
      }
      if (!u) {
        c.rect(9, b - 1, 11, b, HAIR);
        c.rect(13, b - 1, 15, b, HAIR);
        dots(c, hex('#45414f'), [9, b - 1, 13, b - 1]);
      } else {
        // the feet are gone; the cloth stands out, and a hand has the edge of it
        for (let y = 12; y <= 30; y++) {
          const w = Math.round(3 * Math.sin(((y - 12) / 18) * Math.PI));
          c.row(y, 10 - w, 14 + w, CL);
          c.set(15 + w, y, CD);
        }
        c.rect(21, 18, 22, 22, PALE);
        c.set(20, 19, PALE);
        c.set(20, 21, PALE);
        eyes(c, 11, 14, CD, 2);
      }
    },
    sw: 9,
    s(c, u) {
      const b = 42,
        CU = hex('#5a3a44'),
        CL = hex('#754e58');
      c.rect(2, 2, 4, 3, BR);
      c.rect(3, 4, 5, b - 3, CU);
      c.col(3, 4, b - 3, CL);
      c.set(4, b - 2, CU);
      if (!u) c.rect(5, b - 1, 7, b, HAIR);
      else {
        c.rect(6, 14, 7, 28, CU);
        c.col(6, 12, 30, CL);
        c.rect(5, 18, 5, 21, PALE);
      }
    },
  });

  /* ---------- the sofa ---------- */
  O('nightmare-sofa-sitter-impression', 'old sofa with the dent of someone sitting in it worn mustard couch settee cushions', {
    w: 42,
    h: 24,
    f(c, u) {
      const b = 22,
        S = hex('#857040'),
        SL = hex('#a08a52'),
        SD = hex('#62522e'),
        ST2 = hex('#2e2a22');
      c.rect(5, 3, 36, 14, S);
      c.row(3, 6, 35, SL);
      c.rect(2, 8, 6, b - 2, S);
      c.rect(35, 8, 39, b - 2, S);
      c.row(7, 2, 6, SL);
      c.row(7, 35, 39, SL);
      c.col(2, 8, b - 2, SL);
      c.col(39, 8, b - 2, SD);
      c.rect(7, 13, 34, 16, SL);
      c.rect(7, 17, 34, b - 2, S);
      c.col(20, 13, 16, SD);
      c.col(21, 4, 12, SD);
      c.row(17, 7, 34, SD);
      for (const x of [3, 37]) c.rect(x, b - 1, x + 1, b, WD);
      dots(c, SD, [10, 6, 14, 9, 28, 7, 31, 10, 11, 19, 30, 20]);
      // the dent
      c.row(13, 24, 31, S);
      c.row(14, 25, 30, SD);
      c.rect(25, 6, 30, 10, SD);
      c.rect(26, 7, 29, 9, S);
      if (u) {
        // it has darkened into a shape
        c.rect(25, 3, 30, 7, ST2);
        c.rect(23, 8, 32, 14, ST2);
        c.rect(24, 15, 31, 16, ST2);
        c.rect(24, 17, 26, b - 2, ST2);
        c.rect(29, 17, 31, b - 2, ST2);
        dots(c, SD, [22, 9, 33, 11, 27, 2, 23, 15]);
      }
      return () => u && dots(c, hex('#2e2a22'), [24, b, 25, b, 30, b]);
    },
    sw: 20,
    s(c, u) {
      const b = 22,
        S = hex('#857040'),
        SL = hex('#a08a52'),
        SD = hex('#62522e');
      c.rect(3, 3, 7, b - 2, S);
      c.col(3, 3, b - 2, SL);
      c.row(3, 3, 7, SL);
      c.rect(4, 8, 16, b - 2, S);
      c.row(7, 5, 16, SL);
      c.row(8, 5, 16, S);
      c.col(16, 9, b - 2, SD);
      c.frame(6, 10, 14, b - 4, SD);
      c.rect(4, b - 1, 5, b, WD);
      c.rect(14, b - 1, 15, b, WD);
      if (u) {
        c.rect(8, 2, 12, 6, hex('#2e2a22')); // a head above the arm, where nobody is
        c.set(11, 4, SD);
      }
    },
  });

  /* ---------- the standard lamp ---------- */
  function floorLamp(c, u, side) {
    const b = 42,
      SH = u ? hex('#c9b878') : hex('#7a6a4a'),
      SHL = u ? hex('#e6d898') : hex('#94825c');
    c.rect(6, 12, 7, b - 2, BR);
    c.col(6, 12, b - 2, L(BR));
    c.rect(3, b - 1, 10, b, D(BR));
    c.row(b - 1, 4, 9, BR);
    c.rect(5, 22, 8, 22, D(BR));
    [[4, 9], [4, 9], [3, 10], [3, 10], [2, 11], [2, 11], [2, 11], [1, 12], [1, 12]].forEach(([a, z], i) => {
      c.row(3 + i, a, z, SH);
      c.set(a, 3 + i, SHL);
      c.set(z, 3 + i, D(SH));
    });
    for (let x = 1; x <= 12; x += 2) c.set(x, 12, SH);
    thin(c, side ? 9 : 4, 12, side ? 9 : 4, 16, hex('#8a8474'));
    return () => {
      if (!u) return;
      dots(c, LAMP, [3, 14, 10, 14, 2, 17, 11, 18, 6, 2]);
      // and by its light, someone standing there: only a darkness in the air, no line round it
      const G = hex('#2a2430');
      for (let y = 9; y <= b; y++) {
        const head = y < 14,
          x0 = head ? 14 : y < 16 ? 15 : 13,
          x1 = head ? 17 : y < 16 ? 16 : 18;
        for (let x = x0; x <= x1; x++) if ((x + y) % 2 === 0 || (head && y > 9 && y < 13)) c.set(x, y, G);
      }
    };
  }
  O('nightmare-floor-lamp-shadow', 'standard lamp with a fringed shade tall floor lamp its light shows a shadow with nobody to cast it', {
    w: 14,
    h: 44,
    uw: 20,
    f: (c, u) => floorLamp(c, u, false),
    sw: 14,
    suw: 20,
    s: (c, u) => floorLamp(c, u, true),
  });

  /* ---------- the suitcase ---------- */
  function suitcase(c, u, x1, side) {
    const b = c.h - 2,
      LE = hex('#6a4a34'),
      LL = hex('#86624a'),
      LD = hex('#4a3224');
    c.rect(2, b - 11, x1, b, LE);
    c.row(b - 11, 2, x1, LL);
    c.col(2, b - 11, b, LL);
    c.row(b, 2, x1, LD);
    if (!side) {
      for (const x of [5, x1 - 3]) c.col(x, b - 11, b, LD);
      dots(c, BR, [5, b - 6, x1 - 3, b - 6, 3, b - 1, x1 - 1, b - 1]);
    } else c.col((2 + x1) >> 1, b - 11, b, LD);
    const m = (2 + x1) >> 1;
    if (!u) {
      c.rect(m - 2, b - 14, m + 2, b - 13, LD);
      c.set(m - 2, b - 12, LD);
      c.set(m + 2, b - 12, LD);
      if (!side) {
        c.rect(x1 - 1, b - 9, x1 - 1, b - 7, PAPER); // a label with a name on it
        c.rect(x1, b - 8, x1 + 1, b - 5, PAPER);
      }
    } else {
      // open: folded clothes, a child's, and a hand laid on top
      c.rect(2, b - 20, x1, b - 12, LD);
      c.frame(2, b - 20, x1, b - 12, LE);
      c.rect(3, b - 19, x1 - 1, b - 13, hex('#5a5044'));
      c.rect(3, b - 12, x1 - 1, b - 11, PJ);
      c.row(b - 12, 3, m, WHITE);
      c.rect(m, b - 13, m + 3, b - 12, PALE);
      dots(c, PALE, [m + 4, b - 13, m + 4, b - 11, m + 5, b - 12]);
    }
  }
  O('nightmare-suitcase-in-hall', 'packed suitcase standing in the hall brown leather case with straps and a label going away', {
    w: 24,
    h: 18,
    uh: 24,
    f: (c, u) => suitcase(c, u, 20, false),
    sw: 12,
    suh: 24,
    s: (c, u) => suitcase(c, u, 9, true),
  });

  /* ---------- the front door ---------- */
  O('nightmare-front-door-letterbox', 'front door with a letterbox dark green door frosted glass someone outside fingers through the flap', {
    w: 22,
    h: 44,
    f(c, u) {
      const b = 42,
        G = hex('#2e4438'),
        GL = hex('#44604e'),
        GD = hex('#1e3026');
      c.rect(1, 2, 20, b, hex('#b5ad9a'));
      c.row(2, 1, 20, hex('#cfc8b4'));
      c.rect(3, 4, 18, b, G);
      c.col(3, 4, b, GL);
      // frosted glass, and a shape behind it
      c.rect(6, 7, 15, 17, hex('#8fa3a3'));
      c.frame(5, 6, 16, 18, GD);
      c.rect(u ? 8 : 9, u ? 8 : 10, u ? 13 : 12, 17, u ? hex('#3a4a4c') : hex('#6f8388'));
      c.rect(u ? 9 : 10, u ? 8 : 10, u ? 12 : 11, u ? 10 : 11, u ? hex('#2a383a') : hex('#62767a'));
      c.col(10, 7, 17, GD);
      c.frame(5, 28, 16, b - 3, GD);
      c.rect(8, 22, 13, 24, BR);
      c.row(22, 8, 13, L(BR));
      c.rect(9, 23, 12, 23, u ? NI : D(BR));
      c.set(16, 22, BR);
      c.rect(10, 20, 11, 20, BR);
      if (u) {
        c.rect(9, 23, 12, 24, PALE); // fingers come through
        dots(c, PALE, [9, 25, 11, 25, 12, 26, 10, 26]);
        c.rect(6, b - 1, 10, b, WHITE); // and the post on the mat
        c.rect(9, b - 2, 13, b - 1, PAPER);
      }
    },
    sw: 8,
    s(c, u) {
      const b = 42;
      c.rect(2, 2, 5, b, hex('#b5ad9a'));
      c.row(2, 2, 5, hex('#cfc8b4'));
      c.col(2, 2, b, hex('#cfc8b4'));
      c.col(5, 4, b, hex('#2e4438'));
      c.rect(6, 22, 6, 24, BR);
      if (u) {
        c.rect(6, 23, 7, 24, PALE);
        c.set(7, 25, PALE);
        c.rect(6, b - 1, 7, b, WHITE);
      }
    },
  });

  /* ---------- cinema seats ---------- */
  O('nightmare-cinema-seats-row', 'row of cinema seats red velvet tip up seats empty picture house someone sitting two rows behind', {
    w: 38,
    h: 26,
    f(c, u) {
      const b = 24,
        V = hex('#7a2a2e'),
        VL = hex('#963c3e'),
        VD = hex('#561c22');
      if (u) {
        // a head and shoulders behind the row
        c.rect(22, 1, 26, 5, SHADOW);
        c.rect(20, 6, 28, 9, SHADOW);
        eyes(c, 23, 3, EYE, 2);
      }
      for (let i = 0; i < 4; i++) {
        const x = 3 + i * 8;
        c.rect(x, 5, x + 6, 15, V);
        c.row(4, x + 1, x + 5, VL);
        c.col(x, 5, 15, VL);
        c.col(x + 6, 5, 15, VD);
        dots(c, VD, [x + 2, 8, x + 4, 8, x + 3, 11]);
        if (u && i === 1) {
          c.rect(x, 16, x + 6, 18, VL); // one seat is down
          c.row(18, x, x + 6, VD);
          c.rect(x + 2, 12, x + 4, 15, WHITE); // a carton left on it
          c.row(12, x + 2, x + 4, C.red);
          dots(c, hex('#d8cf8a'), [x + 2, 11, x + 4, 11, x + 3, 10]);
        } else {
          c.rect(x, 16, x + 6, 20, VD); // tipped up
          c.row(16, x, x + 6, V);
        }
      }
      for (let i = 0; i <= 4; i++) {
        const x = 2 + i * 8;
        c.rect(x, 12, x, b, HAIR);
        c.rect(x - 1 + (i === 0 ? 1 : 0), 12, x + (i === 4 ? 0 : 1), 13, WD);
        c.rect(x - (i === 0 ? 0 : 1), b, x + (i === 4 ? 0 : 1), b, HAIR);
      }
      return () => u && dots(c, hex('#d8cf8a'), [14, b, 17, b - 1 + 1, 9, b]);
    },
    sw: 16,
    s(c, u) {
      const b = 24,
        V = hex('#7a2a2e'),
        VL = hex('#963c3e'),
        VD = hex('#561c22');
      c.rect(3, 4, 5, 20, V);
      c.col(3, 4, 20, VL);
      c.col(5, 5, 20, VD);
      c.rect(6, 11, 11, 13, WD);
      c.rect(6, 14, 7, b, HAIR);
      c.rect(4, b, 10, b, HAIR);
      if (u) {
        c.rect(6, 16, 12, 18, VL);
        c.row(18, 6, 12, VD);
        c.rect(8, 12, 10, 15, WHITE);
        c.row(12, 8, 10, C.red);
      } else {
        c.rect(6, 15, 7, 20, VD);
      }
    },
  });

  /* ---------- the snowman indoors ---------- */
  function snowman(c, u, side) {
    const b = 32,
      SN = hex('#d6dad6'),
      SNL = hex('#f0f2ec'),
      SND = hex('#a4acae'),
      WET = hex('#5a6a72');
    if (!u) {
      c.oval(4, 17, 15, b, SN);
      c.oval(6, 9, 13, 18, SN);
      c.oval(5, 18, 10, 24, SNL);
      c.set(7, 11, SNL);
      c.set(7, 10, SNL);
      for (let y = 20; y <= b; y++) c.set(15 - (y > 28 ? 1 : 0), y, SND);
      c.rect(6, 5, 13, 8, HAIR); // hat
      c.row(9, 4, 15, HAIR);
      c.row(5, 6, 13, hex('#3a3440'));
      if (side) {
        c.set(12, 12, HAIR);
        c.row(14, 13, 16, C.flame);
      } else {
        eyes(c, 8, 12, HAIR, 3);
        c.rect(9, 14, 11, 14, C.flame);
        c.set(12, 15, C.flame);
      }
      c.rect(6, 17, 13, 18, C.wine);
      c.col(side ? 7 : 12, 19, 22, C.wine);
      dots(c, HAIR, side ? [14, 21, 15, 24] : [10, 21, 10, 24, 10, 27]);
      c.line(3, 20, 1, 15, WD);
      if (!side) c.line(16, 20, 18, 16, WD);
      c.rect(2, b, 17, b, WET);
    } else {
      // it could not last in here
      c.oval(3, b - 5, 16, b, SN);
      c.row(b - 5, 6, 12, SNL);
      c.rect(1, b, 18, b, WET);
      c.rect(8, b - 10, 14, b - 7, HAIR);
      c.row(b - 6, 6, 16, HAIR);
      c.row(b - 10, 8, 14, hex('#3a3440'));
      c.rect(3, b - 3, 7, b - 2, C.wine);
      c.row(b - 1, 5, 9, C.flame);
      dots(c, HAIR, [11, b - 2, 13, b - 1, 14, b - 3]);
      c.line(15, b - 1, 18, b - 4, WD);
    }
    return () => u && dots(c, WET, [0 + 1, b - 1, 18, b - 1]);
  }
  O('nightmare-snowman-indoors', 'snowman standing indoors melting in the hall hat scarf carrot nose coal eyes who brought it in', {
    w: 20,
    h: 34,
    f: (c, u) => snowman(c, u, false),
    sw: 20,
    s: (c, u) => snowman(c, u, true),
  });

  /* ---------- the tree of hands ---------- */
  function handTree(c, u, limbs, tx) {
    const b = 46,
      T = hex('#8a8474'),
      TL = hex('#a39c88'),
      TD = hex('#6c6658');
    for (const l of limbs) {
      for (let i = 0; i + 1 < l.length; i++) {
        c.line(l[i][0], l[i][1], l[i + 1][0], l[i + 1][1], T);
        if (i === 0) c.line(l[i][0] + 1, l[i][1], l[i + 1][0] + 1, l[i + 1][1], TD);
      }
      const [x, y] = l[l.length - 1],
        dir = x < tx + 2 ? -1 : 1;
      // a hand at the end of it
      c.rect(x - 1, y - 2, x + 1, y, PALE);
      if (!u) {
        c.set(x - 2, y - 4, PALE);
        c.set(x - 1, y - 4, PALE);
        c.set(x - 1, y - 3, PALE);
        c.set(x, y - 5, PALE);
        c.col(x, y - 4, y - 3, PALE);
        c.col(x + 1, y - 4, y - 3, D(PALE));
        c.set(x + 2, y - 3, D(PALE));
        c.set(x + 2 * dir, y - 1, PALE);
      } else {
        c.rect(x - 1, y - 3, x + 1, y - 3, D(PALE)); // closed
        c.set(x + 2 * dir, y - 2, D(PALE));
      }
    }
    c.rect(tx, 18, tx + 4, b, T);
    c.col(tx, 18, b, TL);
    c.col(tx + 4, 18, b, TD);
    c.rect(tx - 2, b - 2, tx + 6, b, T);
    c.rect(tx - 1, b - 4, tx + 5, b - 3, T);
    dots(c, TD, [tx + 2, 24, tx + 1, 31, tx + 2, 38, tx + 3, 28]);
    if (u) {
      const [x, y] = limbs[1][limbs[1].length - 1];
      c.rect(x - 1, y - 6, x + 1, y - 4, hex('#5a2a2e')); // one of them has hold of a small shoe
      c.set(x + 2, y - 4, hex('#5a2a2e'));
    }
  }
  O('nightmare-tree-of-hands', 'tree whose branches end in hands pale leafless tree fingers reaching grasping tree', {
    w: 34,
    h: 48,
    f: (c, u) => handTree(c, u, [[[15, 20], [9, 14], [5, 10]], [[18, 19], [25, 12], [29, 9]], [[16, 18], [14, 8]], [[18, 18], [21, 7]], [[15, 27], [8, 23], [4, 22]], [[19, 26], [26, 22], [30, 22]]], 14),
    sw: 24,
    s: (c, u) => handTree(c, u, [[[10, 20], [6, 13], [4, 9]], [[13, 19], [18, 11], [20, 8]], [[12, 18], [12, 7]], [[14, 26], [19, 22]]], 9),
  });

  /* ---------- the bus stop ---------- */
  O('nightmare-bus-stop-no-name', 'bus stop with no name blank sign on a pole empty timetable bench waiting for a bus that does not come', {
    w: 32,
    h: 48,
    f(c, u) {
      const b = 46;
      c.rect(5, 12, 6, b, ST);
      c.col(5, 12, b, STL);
      c.rect(3, b, 8, b, ID);
      c.oval(1, 2, 10, 11, hex('#8a3a34'));
      ring(c, 1, 2, 10, 11, hex('#a85048'));
      c.rect(3, 6, 8, 7, WHITE); // no name on it
      c.rect(3, 16, 8, 24, WHITE);
      c.frame(3, 16, 8, 24, ST);
      if (u) {
        dots(c, HAIR, [4, 18, 5, 18, 7, 18, 4, 20, 6, 20, 7, 20, 4, 22, 5, 22]); // times, now
        c.rect(4, 6, 7, 7, HAIR);
      }
      // the bench
      c.rect(12, 32, 29, 33, W);
      c.row(32, 12, 29, WL);
      c.rect(12, 24, 29, 25, W);
      c.rect(12, 28, 29, 29, W);
      c.row(24, 12, 29, WL);
      for (const x of [13, 27]) {
        c.rect(x, 24, x + 1, b, IR);
        c.rect(x - 1, b, x + 2, b, ID);
      }
      if (u) {
        // someone is waiting after all, or the shape of someone
        c.rect(26, 30, 28, 31, HAIR); // a hat put down beside
        c.row(31, 25, 29, HAIR);
      } else {
        c.line(22, 20, 21, 31, HAIR); // an umbrella somebody left
        c.set(23, 19, HAIR);
        c.set(21, 32, W);
      }
      return () => {
        if (!u) return;
        const G = hex('#2a2430');
        for (let y = 14; y <= 31; y++) for (let x = 17; x <= 23; x++) if (y > 19 ? (x + y) % 2 === 0 || y < 23 : x > 18 && x < 22) c.set(x, y, G);
        eyes(c, 19, 16, EYE, 2);
        for (let y = 34; y <= b; y++) for (const x of [18, 22]) if (y % 2) c.set(x, y, G);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 46;
      c.rect(5, 12, 6, b, ST);
      c.col(5, 12, b, STL);
      c.rect(3, b, 8, b, ID);
      c.rect(5, 2, 6, 11, hex('#8a3a34'));
      c.col(5, 2, 11, hex('#a85048'));
      c.rect(7, 16, 7, 24, WHITE);
      // the bench, end on, beyond the pole
      c.rect(8, 32, 12, 33, W);
      c.col(8, 24, b, IR);
      c.rect(8, 24, 9, 29, W);
      c.col(12, 34, b, IR);
      c.rect(7, b, 13, b, ID);
      if (!u) c.line(11, 20, 10, 31, HAIR);
      return () => {
        if (!u) return;
        const G = hex('#2a2430');
        for (let y = 14; y <= 31; y++) for (let x = 9; x <= 12; x++) if (y > 19 ? (x + y) % 2 === 0 || y < 23 : x > 9) c.set(x, y, G);
        c.set(12, 16, EYE);
      };
    },
  });

  /* ---------- the one street lamp ---------- */
  function streetLamp(c, u, side) {
    const b = 58,
      G = hex('#3d4a44'),
      GL = hex('#566860');
    c.rect(6, 12, 7, b - 4, G);
    c.col(6, 12, b - 4, GL);
    c.rect(5, b - 6, 8, b - 1, G);
    c.rect(4, b, 9, b, hex('#2a3430'));
    c.rect(5, 30, 8, 30, GL);
    if (side) {
      c.rect(4, 4, 9, 10, u ? LAMP : hex('#5a5c50'));
      c.frame(4, 4, 9, 10, G);
      c.rect(3, 3, 10, 3, G);
      c.rect(6, 1, 7, 2, G);
      c.rect(5, 11, 8, 11, G);
    } else {
      c.rect(3, 4, 10, 10, u ? LAMP : hex('#5a5c50'));
      c.frame(3, 4, 10, 10, G);
      c.col(6, 4, 10, G);
      c.rect(2, 3, 11, 3, G);
      c.rect(5, 1, 8, 2, G);
      c.rect(5, 11, 8, 11, G);
      c.rect(1, 14, 5, 14, G); // the ladder bar
      c.rect(8, 14, 12, 14, G);
    }
    if (u) c.set(side ? 6 : 4, 6, hex('#f2ecc0'));
    return () => {
      if (!u) return;
      for (let y = 12; y <= 28; y += 2) {
        const w = 1 + ((y - 12) >> 2);
        c.set(6 - w - 1, y, LAMP);
        c.set(7 + w + 1, y, LAMP);
      }
      dots(c, hex('#8a8474'), [2, 7, 11, 5, 1, 2]); // moths
      c.row(b + 1 - 1, 1, 3, hex('#77745a'));
      c.row(b, 10, 12, hex('#77745a'));
    };
  }
  O('nightmare-streetlamp-one-light', 'the only street lamp in the street old iron lamp post one light in the dark moths', {
    w: 14,
    h: 60,
    f: (c, u) => streetLamp(c, u, false),
    sw: 14,
    s: (c, u) => streetLamp(c, u, true),
  });
};
