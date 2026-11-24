/* Nightmare, part 3: the bathroom, the nursery, doors and windows that are not right. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, thin, drip, pool, bars, ring, eyes, planks, shade } = H;
  const { NI, SHEET, SHEETD, PJ, SHADOW, SKIN, SICK, DWATER, DWATERL, WALLP, LINO, SCREEN, CARP } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    STL = hex('#b0b3ba'),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    BR = C.brass,
    EYE = hex('#e8e4d0'),
    ENAM = hex('#c9c4b2'),
    ENAML = hex('#e4dfd0'),
    ENAMD = hex('#9c9888'),
    GLASSD = hex('#1c2430'),
    GLASSL = hex('#51627a'),
    LAMP = hex('#d8cf8a'),
    PAPER = C.paper,
    PALE = hex('#a8a090');

  /* ---------- the bath ---------- */
  function tub(c, u, x1, taps) {
    const b = 20,
      m = (2 + x1) >> 1;
    [[8, 1], [9, 1], [10, 1], [11, 1], [12, 1], [13, 2], [14, 2], [15, 4], [16, 5]].forEach(([y, k]) => {
      c.row(y, 2 + k, x1 - k, ENAM);
      c.set(2 + k, y, ENAML);
      c.set(x1 - k, y, ENAMD);
    });
    c.row(16, 7, x1 - 5, ENAMD);
    c.row(7, 2, x1, ENAML);
    c.row(7, 4, x1 - 2, DWATER);
    dots(c, DWATERL, [6, 7, 7, 7, m + 3, 7]);
    for (const x of [6, x1 - 7]) {
      c.rect(x, 17, x + 1, b, BR);
      c.set(x - 1, b, BR);
      c.set(x + 2, b, D(BR));
    }
    dots(c, ENAMD, [8, 11, m, 13, x1 - 6, 10]);
    if (taps === 'side') {
      c.rect(3, 3, 4, 6, ST);
      c.row(3, 3, 6, ST);
      c.set(6, 4, ST);
      c.set(2, 2, STL);
      c.set(4, 2, STL);
    } else {
      c.rect(m, 3, m + 1, 6, ST);
      c.rect(m - 2, 2, m - 1, 3, STL);
      c.rect(m + 2, 2, m + 3, 3, STL);
    }
    if (u) {
      // something is coming up
      c.rect(m - 3, 4, m + 3, 7, hex('#15131a'));
      c.row(3, m - 2, m + 2, hex('#15131a'));
      dots(c, hex('#2a2832'), [m - 2, 4, m, 3, m + 2, 5]);
      c.rect(m + 7, 5, m + 8, 8, PALE); // a hand on the rim
      dots(c, PALE, [m + 6, 8, m + 9, 8, m + 7, 9, m + 9, 9]);
    }
    return () => {
      if (!u) return c.set(taps === 'side' ? 6 : m, 6, DWATERL);
      for (const [x, n] of [[m - 6, 5], [m - 4, 8], [m + 4, 3], [m + 10, 6]]) drip(c, x, 8, n, DWATER);
      pool(c, m - 8, m + 6, b, DWATER);
    };
  }
  O('nightmare-bath-dark-water', 'bath full of dark water clawfoot tub brimming black water something under the surface', {
    w: 38,
    h: 22,
    base: 'side',
    f: (c, u) => tub(c, u, 35, 'side'),
    sw: 22,
    s: (c, u) => tub(c, u, 19, 'end'),
  });

  /* ---------- dolls in a row ---------- */
  function doll(c, x, y, hair, dress, look) {
    c.rect(x + 1, y, x + 3, y + 2, hex('#d8c8b0'));
    c.row(y - 1, x + 1, x + 3, hair);
    c.set(x, y, hair);
    c.set(x + 4, y, hair);
    c.set(x, y + 1, hair);
    c.set(x + 4, y + 1, hair);
    if (look) {
      c.set(x + 2, y + 1, NI);
      c.set(x + 3, y + 1, NI);
    } else {
      c.set(x + 1, y + 1, NI);
      c.set(x + 3, y + 1, NI);
    }
    c.rect(x, y + 3, x + 4, y + 6, dress);
    c.col(x, y + 3, y + 6, L(dress));
    c.set(x + 2, y + 3, C.white);
    c.col(x + 1, y + 7, y + 8, hex('#d8c8b0'));
    c.col(x + 3, y + 7, y + 8, hex('#d8c8b0'));
    c.set(x + 1, y + 9, NI);
    c.set(x + 3, y + 9, NI);
  }
  O('nightmare-dolls-in-a-row', 'dolls in a row on a shelf five china dolls sitting staring bench of dolls', {
    w: 34,
    h: 26,
    f(c, u) {
      const b = 24,
        hairs = [hex('#5a3a2e'), hex('#a8904e'), hex('#2a2430'), hex('#84482a'), hex('#8a8474')],
        dresses = [C.wine, C.teal, hex('#8a8474'), C.navy, C.plum];
      c.rect(2, 12, 31, 13, W);
      c.row(12, 2, 31, WL);
      for (const x of [3, 29]) c.rect(x, 14, x + 1, b, W);
      c.row(19, 5, 28, WD);
      for (let i = 0; i < 5; i++) {
        if (u && i === 2) continue;
        doll(c, 3 + i * 6, 3, hairs[i], dresses[i], u);
      }
      if (u) {
        doll(c, 21, b - 9, hairs[2], dresses[2], false); // one has got down
        c.set(22, b - 8, hex('#b3342c'));
        c.set(24, b - 8, hex('#b3342c'));
      }
    },
    sw: 12,
    s(c, u) {
      const b = 24;
      c.rect(2, 12, 8, 13, W);
      c.row(12, 2, 8, WL);
      c.rect(3, 14, 4, b, W);
      c.rect(7, 14, 7, b, WD);
      // a doll, side on, legs out
      c.rect(3, 3, 5, 5, hex('#d8c8b0'));
      c.row(2, 2, 5, hex('#5a3a2e'));
      c.col(2, 3, 6, hex('#5a3a2e'));
      c.set(5, 4, NI);
      c.rect(3, 6, 6, 9, C.wine);
      c.rect(5, 10, 9, 11, hex('#d8c8b0'));
      c.set(10, 10, NI);
      c.set(10, 11, NI);
      if (u) {
        c.set(5, 4, hex('#b3342c'));
        c.rect(8, b - 6, 10, b - 4, hex('#d8c8b0'));
        c.row(b - 7, 8, 10, hex('#2a2430'));
        c.rect(8, b - 3, 10, b - 1, hex('#8a8474'));
        c.set(10, b - 5, NI);
        c.set(9, b, NI);
      }
    },
  });

  /* ---------- tv static ---------- */
  function staticScreen(c, x0, y0, x1, y1, seed, face) {
    const r = rnd(seed);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const v = r();
        c.set(x, y, v < 0.3 ? hex('#3a3e44') : v < 0.65 ? hex('#7d8488') : v < 0.9 ? hex('#aab0ae') : hex('#d6d8d0'));
      }
    if (face) {
      const m = (x0 + x1) >> 1,
        t = y0 + 1;
      for (let y = t; y <= y1; y++) for (let x = m - 3; x <= m + 3; x++) if ((x + y) % 2 === 0 || y > t + 1) c.set(x, y, (x * 3 + y) % 5 ? hex('#3a3e44') : hex('#22242a'));
      c.set(m - 2, t + 2, hex('#e4e6dc'));
      c.set(m + 2, t + 2, hex('#e4e6dc'));
      c.rect(m - 1, t + 5, m + 1, t + 6, hex('#101014'));
    }
  }
  O('nightmare-tv-static', 'television showing static old tv set on a stand snow on the screen rabbit ears hiss', {
    w: 24,
    h: 30,
    f(c, u) {
      const b = 28;
      c.line(9, 6, 5, 1, ST);
      c.line(13, 6, 18, 1, ST);
      c.rect(2, 7, 21, 20, W);
      c.row(7, 2, 21, WL);
      c.col(2, 7, 20, WL);
      c.rect(4, 9, 16, 18, NI);
      staticScreen(c, 5, 10, 15, 17, u ? 9 : 4, u);
      c.oval(18, 10, 19, 11, BR);
      c.oval(18, 13, 19, 14, ID);
      bars(c, 18, 20, 16, 18, WD, 1);
      c.rect(4, 21, 19, 22, WD);
      for (const x of [5, 17]) c.rect(x, 23, x + 1, b, WD);
      c.row(25, 7, 16, WD);
      return () => {
        if (u) dots(c, hex('#aab0ae'), [4, 12, 16, 15, 3, 16 + 3]);
        dots(c, hex('#d6d8d0'), u ? [16, 11, 4, 15] : []);
      };
    },
    sw: 18,
    s(c, u) {
      const b = 28;
      c.line(7, 6, 5, 1, ST);
      c.rect(3, 7, 12, 20, W);
      c.row(7, 3, 12, WL);
      c.col(3, 7, 20, WL);
      c.rect(13, 10, 15, 17, WD); // the back of the tube
      c.set(16, 13, ID);
      bars(c, 5, 10, 10, 12, WD, 2);
      c.col(2, 9, 18, u ? hex('#d6d8d0') : hex('#7d8488'));
      c.rect(4, 21, 13, 22, WD);
      for (const x of [5, 11]) c.rect(x, 23, x + 1, b, WD);
      return () => dots(c, hex('#aab0ae'), u ? [1, 11, 0 + 1, 15, 1, 13] : [1, 13]);
    },
  });

  /* ---------- the arm from the vent ---------- */
  O('nightmare-vent-long-arm', 'long arm reaching out of a wall vent air grille high on the wall thin pale arm hanging down', {
    w: 18,
    h: 46,
    solid: false,
    f(c, u) {
      const b = 44;
      c.rect(2, 2, 15, 12, hex('#8a8c88'));
      c.row(2, 2, 15, STL);
      c.col(2, 2, 12, STL);
      c.rect(4, 4, 13, 10, NI);
      for (const y of [4, 6, 8, 10]) c.row(y, 4, u ? 8 : 13, hex('#6c6e6c'));
      dots(c, ID, [3, 3, 14, 3, 3, 11, 14, 11]);
      const end = u ? b - 3 : 30;
      c.line(11, 8, 12, 20, SKIN);
      c.line(12, 20, 10, end, SKIN);
      c.line(12, 9, 13, 20, D(SKIN));
      c.set(12, 20, hex('#9a8672'));
      c.set(12, 21, hex('#9a8672'));
      if (u) {
        c.row(b - 2, 8, 11, SKIN);
        dots(c, SKIN, [7, b - 1, 9, b, 11, b, 12, b - 1, 6, b]);
      } else dots(c, SKIN, [9, 31, 11, 31, 10, 32, 9, 33, 11, 33]);
      if (u) eyes(c, 5, 7, EYE, 2);
    },
    sw: 10,
    s(c, u) {
      const b = 44;
      c.rect(2, 2, 4, 12, hex('#8a8c88'));
      c.col(2, 2, 12, STL);
      c.col(4, 4, 10, ID);
      const end = u ? b - 3 : 30;
      c.line(5, 8, 7, 20, SKIN);
      c.line(7, 20, 5, end, SKIN);
      c.set(7, 21, hex('#9a8672'));
      if (u) {
        c.row(b - 2, 4, 7, SKIN);
        dots(c, SKIN, [8, b - 1, 8, b, 6, b]);
      } else dots(c, SKIN, [4, 31, 6, 31, 5, 32]);
    },
  });

  /* ---------- the exam desk ---------- */
  O('nightmare-exam-desk', 'exam desk school desk with a test paper and pencil the exam you did not study for wooden chair', {
    w: 22,
    h: 26,
    f(c, u) {
      const b = 24;
      c.rect(6, 3, 15, 4, W); // the chair behind
      c.row(3, 6, 15, WL);
      c.col(6, 3, 12, W);
      c.col(15, 3, 12, WD);
      c.rect(2, 11, 19, 13, WL);
      c.row(11, 2, 19, hex('#a8855c'));
      c.row(13, 2, 19, W);
      c.rect(3, 14, 18, 16, W);
      for (const x of [3, 17]) c.rect(x, 17, x + 1, b, IR);
      c.row(21, 5, 16, ID);
      c.rect(7, 9, 14, 11, PAPER);
      c.row(9, 7, 14, hex('#e4dfd0'));
      c.set(17, 12, NI); // the inkwell
      if (!u) {
        dots(c, hex('#8a8068'), [8, 10, 10, 10, 12, 10]);
        c.row(12, 3, 6, C.mustard);
        c.set(2, 12, hex('#3a3440'));
      } else {
        dots(c, NI, [8, 9, 9, 10, 10, 9, 11, 10, 12, 9, 13, 10, 8, 11, 10, 11, 12, 11, 13, 9]);
        c.row(12, 3, 4, C.mustard); // snapped
        c.set(5, 11, C.mustard);
        c.set(6, 10, C.mustard);
        c.set(7, b, hex('#e4dfd0'));
        c.rect(5, b - 1, 6, b, PAPER);
      }
    },
    sw: 22,
    s(c, u) {
      const b = 24;
      c.col(3, 3, b, W);
      c.col(4, 3, 14, WD);
      c.rect(3, 14, 9, 15, W);
      c.col(9, 16, b, WD);
      c.line(10, 12, 19, 10, WL);
      c.line(10, 13, 19, 11, WL);
      c.line(10, 14, 19, 12, W);
      c.rect(11, 14, 18, 16, W);
      c.rect(12, 17, 13, b, IR);
      c.rect(17, 17, 18, b, IR);
      c.line(13, 10, 17, 9, PAPER);
      if (u) {
        dots(c, NI, [14, 10, 16, 9]);
        c.rect(15, b - 1, 16, b, PAPER);
      } else c.set(11, 11, C.mustard);
    },
  });

  /* ---------- the lift ---------- */
  O('nightmare-lift-door-falling', 'lift doors elevator steel sliding doors floor indicator going down open shaft no car', {
    w: 26,
    h: 44,
    f(c, u) {
      const b = 42,
        S = hex('#7d8084');
      c.rect(1, 2, 24, b, hex('#5a5d62'));
      c.row(2, 1, 24, S);
      c.col(1, 2, b, S);
      c.rect(8, 3, 15, 6, NI);
      dots(c, C.red, u ? [10, 4, 11, 5, 12, 4, 11, 4, 13, 5 - 1] : [11, 4, 10, 5, 11, 5, 12, 5]);
      if (!u) {
        c.rect(3, 8, 20, b, S);
        c.col(3, 8, b, STL);
        c.col(11, 8, b, NI);
        c.col(12, 8, b, STL);
        c.col(20, 8, b, hex('#5a5d62'));
        for (const y of [18, 30]) c.row(y, 4, 19, hex('#6c6f73'));
        c.set(11, 8, S);
      } else {
        c.rect(3, 8, 20, b, hex('#15131a'));
        c.rect(3, 8, 4, b, S); // the doors, slid back
        c.rect(19, 8, 20, b, S);
        c.col(3, 8, b, STL);
        for (const x of [9, 11, 14]) for (let y = 8; y <= (x === 11 ? 26 : b); y++) c.set(x, y, y % 3 ? hex('#3a3a45') : hex('#4a4a55'));
        dots(c, ST, [10, 27, 12, 27, 11, 28, 10, 29]); // one cable ends
        for (const y of [14, 24, 34]) c.row(y, 5, 18, hex('#221f28'));
        c.row(b, 5, 18, hex('#221f28'));
        dots(c, hex('#3a3a45'), [6, 20, 17, 30]);
      }
      c.rect(22, 20, 23, 25, ID);
      c.set(22, 21, u ? C.red : hex('#77745a'));
      c.set(22, 24, hex('#77745a'));
    },
    sw: 8,
    s(c, u) {
      const b = 42,
        S = hex('#7d8084');
      c.rect(2, 2, 5, b, hex('#5a5d62'));
      c.row(2, 2, 5, S);
      c.col(2, 2, b, S);
      c.rect(6, 20, 6, 25, ID);
      c.set(6, 21, u ? C.red : hex('#77745a'));
      if (u) c.col(5, 8, b, hex('#15131a'));
      else c.col(5, 8, b, S);
    },
  });

  /* ---------- the cot ---------- */
  O('nightmare-crib-mobile', 'cot with a mobile turning over it baby crib bars blanket nursery something was sleeping here', {
    w: 32,
    h: 40,
    base: 'side',
    f(c, u) {
      const b = 38,
        CR = hex('#b5ad9a'),
        CRL = hex('#cfc8b4');
      // the mobile
      c.col(4, 3, 20, CR);
      c.line(4, 3, 16, 2, CR);
      c.row(4, 9, 23, ST);
      const hang = u ? [[10, 9], [16, 6], [22, 10]] : [[10, 7], [16, 9], [22, 7]];
      hang.forEach(([x, y], i) => {
        thin(c, x, 5, x, y, hex('#8a8474'));
        if (i === 0) {
          c.rect(x - 1, y + 1, x + 1, y + 3, C.mustard); // a moon
          c.set(x + 1, y + 2, null);
          c.clear(x + 1, y + 2);
        } else if (i === 1) {
          c.rect(x - 1, y + 1, x + 1, y + 3, C.white); // a tooth
          c.clear(x, y + 3);
        } else {
          c.rect(x - 1, y + 2, x + 1, y + 2, C.wine); // a star
          c.col(x, y + 1, y + 3, C.wine);
        }
      });
      c.rect(3, 26, 28, 28, CR);
      c.rect(4, 23, 27, 25, SHEET);
      if (!u) {
        c.rect(10, 20, 22, 25, PJ); // a small shape under the blanket
        c.row(19, 12, 20, PJ);
        c.row(19, 12, 20, L(PJ));
        c.rect(6, 21, 9, 22, C.white);
        dots(c, D(PJ), [13, 22, 17, 23, 20, 21]);
      } else {
        c.rect(18, 22, 27, 25, PJ);
        c.row(21, 20, 26, L(PJ));
        c.rect(6, 22, 9, 22, C.white);
        dots(c, SHEETD, [11, 24, 13, 23, 15, 24]); // the dent it left
        c.row(23, 10, 16, SHEETD);
      }
      for (let x = 3; x <= 28; x += 3) {
        if (u && (x === 12 || x === 15)) continue;
        c.col(x, 15, 26, CR);
      }
      if (u) {
        c.line(12, 15, 10, 20, CR); // two bars forced apart
        c.line(10, 20, 12, 26, CR);
        c.line(15, 15, 17, 20, CR);
        c.line(17, 20, 15, 26, CR);
      }
      c.row(15, 3, 28, CRL);
      c.rect(2, 13, 3, b, CR);
      c.col(2, 13, b, CRL);
      c.rect(28, 13, 29, b, CR);
      c.row(32, 4, 27, D(CR));
    },
    sw: 20,
    s(c, u) {
      const b = 38,
        CR = hex('#b5ad9a'),
        CRL = hex('#cfc8b4');
      c.col(9, 3, 14, CR);
      c.row(4, 6, 13, ST);
      for (const [x, y, col] of [[6, u ? 9 : 7, C.mustard], [12, u ? 7 : 9, C.wine]]) {
        thin(c, x, 5, x, y, hex('#8a8474'));
        c.rect(x - 1, y + 1, x + 1, y + 3, col);
      }
      c.rect(3, 13, 16, 28, CR);
      c.row(13, 4, 15, CRL);
      c.col(3, 13, 28, CRL);
      c.rect(5, 16, 14, 25, D(CR));
      for (const x of [6, 9, 12]) c.col(x, 16, 25, CR);
      if (!u) {
        c.rect(7, 20, 12, 24, PJ);
        c.row(19, 8, 11, L(PJ));
      } else c.rect(5, 24, 14, 25, SHEET);
      c.rect(3, 29, 4, b, CR);
      c.rect(15, 29, 16, b, D(CR));
      c.row(32, 5, 14, D(CR));
    },
  });

  /* ---------- the rocking chair ---------- */
  function rocker(side) {
    return part(24, 30, (c) => {
      if (side) {
        c.rect(5, 2, 6, 18, W);
        c.col(5, 2, 18, WL);
        c.rect(5, 17, 16, 18, WL);
        c.row(18, 5, 16, W);
        c.rect(15, 12, 16, 16, W);
        c.rect(6, 12, 16, 12, WL);
        c.col(7, 19, 26, W);
        c.col(15, 19, 26, WD);
        [[2, 25], [3, 26], [4, 27], [5, 27], [6, 28], [7, 28], [8, 28], [9, 28], [10, 28], [11, 28], [12, 28], [13, 28], [14, 28], [15, 28], [16, 28], [17, 27], [18, 27], [19, 26], [20, 25], [21, 24]].forEach(([x, y]) => c.set(x, y, WD));
        c.rect(6, 4, 7, 12, C.plum); // a shawl over the back
        c.col(7, 5, 11, D(C.plum));
      } else {
        for (const x of [4, 13]) {
          c.rect(x, 2, x + 1, 27, W);
          c.col(x, 2, 27, WL);
        }
        c.rect(6, 3, 12, 4, W);
        for (const x of [7, 9, 11]) c.col(x, 5, 15, WD);
        c.rect(3, 12, 4, 13, WL);
        c.rect(14, 12, 15, 13, W);
        c.rect(4, 17, 14, 19, WL);
        c.row(19, 4, 14, W);
        c.rect(3, 27, 5, 28, WD);
        c.rect(13, 27, 15, 28, WD);
        c.row(23, 6, 12, WD);
        c.rect(6, 3, 12, 7, C.plum);
        c.row(8, 7, 11, C.plum);
        dots(c, D(C.plum), [7, 5, 10, 6, 9, 4]);
      }
    });
  }
  O('nightmare-rocking-chair-moving', 'rocking chair rocking by itself wooden rocker with a shawl nobody in it creaking', {
    w: 19,
    h: 32,
    f(c, u) {
      c.stamp(rocker(false), 0, u ? 2 : 1);
      return () => {
        if (!u) return;
        // someone not quite there is sitting in it
        const G = hex('#2a2430');
        for (let y = 5; y <= 19; y++) for (let x = 6; x <= 12; x++) if (y > 10 ? (x + y) % 2 === 0 || y < 14 : x > 7 && x < 11) c.set(x, y, G);
        eyes(c, 8, 7, EYE, 2);
        for (let y = 20; y <= 28; y += 2) dots(c, G, [7, y, 11, y]);
      };
    },
    sw: 25,
    s(c, u) {
      const t = rocker(true);
      if (!u) return void c.stamp(t, 0, 1);
      // tipped back on its rockers
      for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) if (t.get(x, y)) c.set(x + Math.round((y - 28) * 0.18) + 1, y + 1 + Math.round((x - 12) * 0.12), t.get(x, y));
      return () => {
        const G = hex('#2a2430');
        for (let y = 10; y <= 19; y++) for (let x = 5; x <= 11; x++) if ((x + y) % 2 === 0 || y < 13) c.set(x, y, G);
        c.rect(6, 5, 9, 9, G);
        c.set(9, 7, EYE);
        for (let x = 12; x <= 15; x++) if (x % 2) c.set(x, 19, G);
        for (let y = 20; y <= 26; y += 2) c.set(15, y, G);
      };
    },
  });

  /* ---------- the window ---------- */
  O('nightmare-window-night-face', 'window at night with curtains sash window black outside a face at the glass looking in', {
    w: 28,
    h: 32,
    solid: false,
    f(c, u) {
      const CU = hex('#7a6a5a'),
        CUL = hex('#94826e');
      c.rect(3, 3, 24, 27, hex('#b5ad9a'));
      c.rect(5, 5, 22, 25, GLASSD);
      c.col(13, 5, 25, hex('#b5ad9a'));
      c.col(14, 5, 25, hex('#9c9888'));
      c.row(15, 5, 22, hex('#b5ad9a'));
      dots(c, GLASSL, [6, 6, 7, 6, 6, 7, 16, 17]);
      dots(c, hex('#8a8c78'), [19, 8, 9, 20]); // far lights
      if (u) {
        c.rect(15, 16, 20, 22, PALE); // pressed to the pane
        c.row(15, 16, 19, PALE);
        c.rect(15, 23, 20, 25, hex('#2a2832'));
        dots(c, NI, [16, 18, 19, 18, 17, 21, 18, 21]);
        c.set(17, 19, hex('#8a8474'));
        dots(c, hex('#6f8388'), [8, 19, 9, 18, 10, 19, 9, 20, 8, 21, 10, 21]); // and a hand print
      }
      c.rect(2, 28, 25, 29, hex('#cfc8b4'));
      c.rect(1, 2, 26, 3, W);
      c.row(2, 1, 26, WL);
      for (const [x0, x1] of [[2, 6], [21, 25]]) {
        c.rect(x0, 4, x1, 26, CU);
        for (let x = x0; x <= x1; x += 2) c.col(x, 4, 26, x % 4 ? CUL : D(CU));
        for (let x = x0; x <= x1; x += 2) c.set(x, 27, CU);
      }
    },
    sw: 7,
    s(c, u) {
      const CU = hex('#7a6a5a');
      c.rect(2, 3, 3, 27, hex('#b5ad9a'));
      c.rect(2, 28, 5, 29, hex('#cfc8b4'));
      c.rect(2, 2, 5, 3, W);
      c.rect(4, 4, 5, 26, CU);
      c.col(4, 4, 26, hex('#94826e'));
      c.set(4, 27, CU);
      if (u) dots(c, PALE, [1, 18, 1, 19]);
    },
  });

  /* ---------- the door that is too small ---------- */
  O('nightmare-door-too-small', 'door that is much too small tiny door in the skirting board knee high little brass knob', {
    w: 14,
    h: 20,
    uw: 20,
    solid: false,
    f(c, u) {
      const b = 18;
      c.rect(2, 4, 11, b, hex('#cfc8b4'));
      c.row(3, 3, 10, hex('#cfc8b4'));
      c.row(2, 5, 8, hex('#e4dfd0'));
      if (!u) {
        c.rect(4, 5, 9, b, C.wine);
        c.row(4, 5, 8, C.wine);
        c.col(4, 5, b, L(C.wine));
        c.frame(5, 7, 8, 11, D(C.wine));
        c.frame(5, 13, 8, b - 1, D(C.wine));
        c.set(9, 12, BR);
        c.set(8, 13, LAMP); // light in the keyhole
      } else {
        c.rect(4, 5, 9, b, hex('#3a3020'));
        c.row(4, 5, 8, hex('#3a3020'));
        c.rect(5, 9, 8, b, LAMP);
        c.row(8, 6, 7, LAMP);
        for (const y of [b - 2, b - 5]) c.row(y, 5, 8, hex('#a8a060')); // little stairs going down
        eyes(c, 5, 11, NI, 2); // and someone small at the top of them
        c.rect(5, 12, 7, 14, NI);
        c.rect(12, 5, 17, b, C.wine); // the door
        c.col(12, 5, b, D(C.wine));
        c.frame(13, 7, 16, 11, D(C.wine));
        c.frame(13, 13, 16, b - 1, D(C.wine));
      }
    },
    sw: 6,
    suw: 12,
    s(c, u) {
      const b = 18;
      c.rect(2, 3, 3, b, hex('#cfc8b4'));
      c.set(2, 2, hex('#e4dfd0'));
      if (!u) c.set(4, 12, BR);
      else {
        c.rect(4, 5, 9, b, C.wine);
        c.col(4, 5, b, L(C.wine));
        c.frame(5, 7, 8, 11, D(C.wine));
        c.frame(5, 13, 8, b - 1, D(C.wine));
        c.set(9, 12, BR);
      }
      return () => u && dots(c, LAMP, [3, 9, 3, 13]);
    },
  });

  /* ---------- the door with too many locks ---------- */
  O('nightmare-door-many-locks', 'door with too many locks heavy door bolts chains padlocks keep it shut keep it out', {
    w: 22,
    h: 42,
    f(c, u) {
      const b = 40,
        DR = hex('#4e4a42'),
        DL = hex('#6a655a');
      c.rect(1, 2, 20, b, hex('#3a3632'));
      c.row(2, 1, 20, DL);
      if (u) {
        c.rect(15, 4, 18, b, NI); // ajar on the dark
        c.rect(3, 4, 14, b, DR);
        c.col(14, 4, b, hex('#2e2c28'));
        c.rect(16, 21, 16, 24, PALE); // fingers round the edge
        c.set(15, 22, PALE);
      } else c.rect(3, 4, 18, b, DR);
      c.col(3, 4, b, DL);
      c.frame(5, 7, u ? 11 : 13, 19, hex('#3a3632'));
      c.frame(5, 23, u ? 11 : 13, b - 3, hex('#3a3632'));
      const x = u ? 13 : 17;
      [6, 10, 14, 18, 24, 29, 34].forEach((y, i) => {
        if (i % 3 === 0) {
          c.rect(x - 3, y, x, y + 1, ST); // a bolt
          c.set(u ? x - 3 : x, y, STL);
          if (!u) c.rect(x + 1, y, x + 2, y + 1, ID);
        } else if (i % 3 === 1) {
          c.rect(x - 2, y, x, y + 2, BR); // a lock
          c.set(x - 1, y + 1, NI);
        } else {
          if (!u) thin(c, x - 4, y + 1, x + 2, y, ST); // a chain
          else thin(c, x - 3, y, x - 3, y + 4, ST);
          c.set(x - 4, y + 1, ID);
        }
      });
      c.rect(x - 1, 21, x, 22, BR);
      return () => u && dots(c, ST, [17, b, 15, b]);
    },
    sw: 8,
    suw: 12,
    s(c, u) {
      const b = 40;
      c.rect(2, 2, 5, b, hex('#3a3632'));
      c.row(2, 2, 5, hex('#6a655a'));
      c.col(2, 2, b, hex('#6a655a'));
      if (!u) dots(c, ST, [6, 6, 6, 18, 6, 29, 6, 14, 6, 34]);
      else {
        c.rect(6, 4, 8, b, hex('#4e4a42'));
        c.col(8, 4, b, hex('#2e2c28'));
        dots(c, ST, [9, 6, 9, 18, 9, 29]);
        dots(c, BR, [9, 10, 9, 24]);
        c.rect(9, 21, 9, 23, PALE);
      }
    },
  });

  /* ---------- the bare bulb ---------- */
  const bulb = (c, u) => {
    c.rect(3, 1, 6, 2, hex('#b5ad9a'));
    thin(c, 4, 3, 4, 20, hex('#3a3440'));
    c.rect(4, 21, 5, 22, BR);
    c.oval(3, 23, 6, 27, u ? LAMP : hex('#6a6a5a'));
    c.set(4, 24, u ? hex('#f2ecc0') : hex('#8a8a78'));
    thin(c, 7, 22, 7, 30, hex('#8a8474'));
    c.set(7, 31, BR);
    return () => {
      if (!u) return;
      dots(c, LAMP, [1, 25, 8, 25, 2, 29, 7, 29 + 4, 4, 30]);
      dots(c, hex('#8a8474'), [1, 21, 8, 19]); // moths
    };
  };
  O('nightmare-bulb-hanging-flicker', 'bare light bulb hanging on a cord from the ceiling pull string flickering light moths', {
    w: 10,
    h: 36,
    solid: false,
    f: bulb,
    sw: 10,
    s: bulb,
  });
};
