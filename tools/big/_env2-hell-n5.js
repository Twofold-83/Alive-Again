/* Nightmare, part 5: classroom, kitchen, nursery, waiting room. */
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
    LAMP = hex('#d8cf8a'),
    PAPER = C.paper,
    PALE = hex('#a8a090'),
    ENAM = hex('#c9c4b2'),
    ENAML = hex('#e4dfd0'),
    ENAMD = hex('#9c9888'),
    HAIR = hex('#17141b');

  /* ---------- the teacher's desk ---------- */
  O('nightmare-teacher-desk-apple', 'teacher desk with an apple a hand bell and a pile of marked papers heavy wooden school desk', {
    w: 36,
    h: 26,
    f(c, u) {
      const b = 24;
      c.rect(2, 10, 33, 12, WL);
      c.row(10, 2, 33, hex('#a8855c'));
      c.row(12, 2, 33, W);
      c.rect(3, 13, 12, b, W);
      c.rect(23, 13, 32, b, W);
      c.rect(13, 13, 22, 15, W);
      c.col(3, 13, b, WL);
      c.col(23, 13, b, WL);
      for (const x of [4, 24]) {
        c.frame(x, 14, x + 7, 17, WD);
        c.frame(x, 19, x + 7, 22, WD);
        c.set(x + 3, 16, BR);
        c.set(x + 4, 20, BR);
      }
      // on top: papers, a bell, an apple
      c.rect(4, 7, 10, 9, PAPER);
      c.row(7, 4, 10, ENAML);
      dots(c, C.red, [6, 8, 9, 8]);
      c.rect(15, 7, 17, 9, BR);
      c.set(16, 6, BR);
      c.set(16, 5, WD);
      c.row(9, 14, 18, D(BR));
      if (!u) {
        c.oval(25, 6, 29, 9, C.red);
        c.set(26, 7, hex('#d0584a'));
        c.set(27, 5, WD);
        c.set(28, 5, C.moss);
      } else {
        c.oval(25, 6, 29, 9, hex('#5a3a2e')); // gone bad, and bitten
        c.rect(28, 6, 29, 7, hex('#c9b79a'));
        c.set(27, 5, WD);
        c.set(26, 8, C.rot);
        c.set(30, 7, C.rot); // and something comes out of it
        c.set(31, 6, C.rot);
        // a drawer full of them
        c.rect(24, 14, 31, 18, NI);
        c.rect(23, 19, 32, 22, WL);
        c.frame(23, 19, 32, 22, WD);
        c.set(27, 21, BR);
        for (const x of [25, 27, 29]) c.rect(x, 16, x + 1, 18, x === 27 ? hex('#5a3a2e') : hex('#7a2a24'));
      }
    },
    sw: 18,
    s(c, u) {
      const b = 24;
      c.rect(2, 10, 15, 12, WL);
      c.row(10, 2, 15, hex('#a8855c'));
      c.row(12, 2, 15, W);
      c.rect(3, 13, 14, b, W);
      c.col(3, 13, b, WL);
      c.frame(5, 15, 12, b - 2, WD);
      c.rect(4, 7, 8, 9, PAPER);
      c.oval(10, 6, 13, 9, u ? hex('#5a3a2e') : C.red);
      c.set(11, 5, WD);
      if (u) {
        c.set(13, 7, hex('#c9b79a'));
        c.rect(15, 19, 16, 22, WL); // the drawer, pulled out towards the room
        c.set(16, 18, hex('#7a2a24'));
      }
    },
  });

  /* ---------- the empty suit ---------- */
  O('nightmare-suit-standing-empty', 'empty suit standing by itself dark suit and hat with nobody in it no head no hands', {
    w: 18,
    h: 40,
    f(c, u) {
      const b = 38,
        S = hex('#2e2c38'),
        SL = hex('#45424f'),
        SD = hex('#1e1c26');
      if (!u) {
        c.rect(5, 2, 11, 5, SD); // the hat, on nothing
        c.row(6, 3, 13, SD);
        c.row(2, 5, 11, SL);
        c.row(5, 5, 11, hex('#5a2a2e'));
        c.rect(3, 11, 13, 24, S);
        c.row(10, 5, 11, S);
        c.col(3, 11, 24, SL);
        c.col(13, 12, 24, SD);
        c.rect(7, 10, 9, 14, ENAML); // a shirt front and a tie
        c.col(8, 11, 16, C.wine);
        c.line(6, 10, 8, 15, SL);
        c.line(10, 10, 8, 15, SD);
        c.rect(2, 12, 2, 25, S);
        c.rect(14, 12, 14, 25, SD);
        c.rect(5, 25, 7, b - 1, S);
        c.rect(9, 25, 11, b - 1, SD);
        c.col(5, 25, b - 1, SL);
        c.rect(4, b, 7, b, NI);
        c.rect(9, b, 12, b, NI);
        dots(c, BR, [8, 18, 8, 21]);
      } else {
        // all fallen in a heap
        c.rect(2, b - 5, 15, b, S);
        c.row(b - 6, 4, 13, S);
        c.row(b - 7, 6, 10, SL);
        c.col(2, b - 5, b, SL);
        dots(c, SD, [5, b - 3, 9, b - 2, 12, b - 4, 7, b - 1, 13, b - 1]);
        c.rect(6, b - 5, 8, b - 4, ENAML);
        c.line(8, b - 4, 11, b - 1, C.wine);
        c.rect(9, b - 11, 15, b - 8, SD);
        c.row(b - 7, 7, 16, SD);
        c.row(b - 11, 9, 15, SL);
        c.row(b - 8, 9, 15, hex('#5a2a2e'));
        c.rect(1, b, 3, b, NI);
      }
    },
    sw: 12,
    s(c, u) {
      const b = 38,
        S = hex('#2e2c38'),
        SL = hex('#45424f'),
        SD = hex('#1e1c26');
      if (!u) {
        c.rect(3, 2, 8, 5, SD);
        c.row(6, 2, 10, SD);
        c.row(5, 3, 8, hex('#5a2a2e'));
        c.rect(3, 11, 8, 24, S);
        c.row(10, 4, 7, S);
        c.col(3, 11, 24, SL);
        c.col(8, 12, 24, ENAML);
        c.rect(5, 13, 6, 25, SD); // a sleeve, and nothing in it
        c.rect(4, 25, 7, b - 1, S);
        c.col(4, 25, b - 1, SL);
        c.rect(4, b, 9, b, NI);
      } else {
        c.rect(2, b - 5, 9, b, S);
        c.row(b - 6, 3, 8, S);
        c.col(2, b - 5, b, SL);
        dots(c, SD, [4, b - 3, 7, b - 2]);
        c.rect(4, b - 11, 9, b - 8, SD);
        c.row(b - 7, 3, 10, SD);
        c.row(b - 8, 4, 9, hex('#5a2a2e'));
      }
    },
  });

  /* ---------- the family portrait ---------- */
  O('nightmare-portrait-family-faceless', 'family portrait in a gilt frame father mother and child with no faces painting on the wall', {
    w: 28,
    h: 28,
    solid: false,
    f(c, u) {
      c.rect(2, 2, 25, 25, BR);
      c.frame(2, 2, 25, 25, C.gold);
      c.row(25, 2, 25, D(BR));
      c.col(25, 2, 25, D(BR));
      c.rect(4, 4, 23, 23, hex('#4a4038'));
      c.rect(4, 4, 23, 12, hex('#5a5044'));
      const person = (x, y, w, col) => {
        c.rect(x, y, x + 3, y + 4, hex('#c2b49c'));
        c.row(y - 1, x, x + 3, hex('#3a3028'));
        c.rect(x - w, y + 6, x + 3 + w, 23, col);
        c.row(y + 5, x, x + 3, col);
        c.col(x - w, y + 6, 23, L(col));
      };
      person(7, 7, 2, hex('#2e2c38'));
      person(16, 8, 2, hex('#5a3a44'));
      if (!u) person(12, 15, 1, hex('#6f7f8c'));
      else {
        // the child is not in it any more, and the others have been scratched at
        for (const [x, y] of [[7, 7], [16, 8]]) {
          c.rect(x, y + 1, x + 3, y + 3, NI);
          c.set(x + 1, y + 2, C.red);
        }
        dots(c, ENAML, [6, 6, 11, 11, 15, 7, 20, 12, 5, 12]);
        c.rect(12, 18, 15, 23, hex('#3d342e'));
      }
    },
    sw: 6,
    s(c, u) {
      c.rect(2, 2, 3, 25, BR);
      c.col(2, 2, 25, C.gold);
      c.set(3, 25, D(BR));
      if (u) c.set(4, 12, ENAML);
    },
  });

  /* ---------- the fridge ---------- */
  O('nightmare-fridge-humming', 'humming fridge old rounded refrigerator magnets and a child drawing on the door cold light', {
    w: 16,
    h: 36,
    uw: 24,
    f(c, u) {
      const b = 34;
      c.rect(2, 3, 13, b - 1, ENAM);
      c.row(2, 3, 12, ENAML);
      c.col(2, 3, b - 1, ENAML);
      c.rect(2, b, 4, b, ID);
      c.rect(11, b, 13, b, ID);
      if (!u) {
        c.row(11, 2, 13, ENAMD);
        c.rect(11, 14, 11, 19, ST);
        c.rect(11, 6, 11, 9, ST);
        c.rect(4, 14, 8, 19, PAPER); // a drawing: two people and a tall one
        dots(c, C.red, [5, 17, 5, 18]);
        dots(c, C.navy, [6, 17, 6, 18]);
        c.col(7, 15, 18, NI);
        dots(c, C.mustard, [4, 13, 9, 22]);
        dots(c, ENAMD, [5, 27, 9, 30]);
      } else {
        c.rect(3, 4, 12, b - 2, hex('#dfe6d8'));
        c.rect(3, 4, 12, 9, hex('#b8c4bc'));
        for (const y of [10, 17, 24]) c.row(y, 3, 12, ST);
        // nothing in it but one covered plate, and a jar
        c.rect(5, 14, 9, 16, ENAMD);
        c.row(13, 6, 8, ENAMD);
        c.rect(10, 20, 11, 23, hex('#5d7f8c'));
        c.set(10, 21, EYE);
        c.rect(4, 27, 7, b - 3, hex('#5a3a2e'));
        // the door
        c.rect(14, 3, 21, b - 1, ENAM);
        c.col(14, 3, b - 1, ENAMD);
        c.rect(15, 5, 20, b - 3, hex('#b8b4a2'));
        for (const y of [12, 22]) c.row(y, 15, 20, ENAMD);
        c.rect(16, 23, 17, 27, C.white);
      }
      return () => u && dots(c, hex('#dfe6d8'), [5, b + 1 - 1, 8, b, 10, b]);
    },
    sw: 14,
    suw: 20,
    s(c, u) {
      const b = 34;
      c.rect(2, 3, 10, b - 1, ENAM);
      c.row(2, 3, 9, ENAML);
      c.col(2, 3, b - 1, ENAML);
      c.rect(2, b, 4, b, ID);
      c.rect(8, b, 10, b, ID);
      c.col(8, 4, b - 2, ENAMD);
      if (!u) {
        c.rect(11, 14, 11, 19, ST);
        c.rect(11, 6, 11, 9, ST);
      } else {
        c.col(10, 4, b - 2, hex('#dfe6d8'));
        c.rect(11, 3, 17, b - 1, ENAM); // the door, wide open, flat on
        c.col(11, 3, b - 1, ENAML);
        c.row(11, 11, 17, ENAMD);
        c.rect(12, 14, 15, 19, PAPER);
        c.col(14, 15, 18, NI);
      }
    },
  });

  /* ---------- the sink ---------- */
  function sink(c, u, x1, side) {
    const b = 30,
      m = (2 + x1) >> 1;
    c.rect(m - 2, 18, m + 2, b, ENAM);
    c.col(m - 2, 18, b, ENAML);
    c.rect(m - 3, b - 1, m + 3, b, ENAMD);
    c.rect(2, 11, x1, 13, ENAM);
    c.row(11, 2, x1, ENAML);
    c.rect(3, 14, x1 - 1, 15, ENAM);
    c.rect(5, 16, x1 - 3, 17, ENAMD);
    c.row(12, 4, x1 - 2, hex('#6a7470')); // the bowl
    if (side) {
      c.rect(3, 6, 4, 10, ST);
      c.row(6, 3, 7, ST);
      c.set(7, 7, ST);
    } else {
      c.rect(m - 1, 6, m, 10, ST);
      c.rect(m - 3, 8, m - 2, 9, STL);
      c.rect(m + 1, 8, m + 2, 9, STL);
      c.row(6, m - 1, m + 2, ST);
    }
    c.rect(x1 - 3, 9, x1 - 2, 10, hex('#b9c0a8')); // soap
    if (u) {
      // hair is coming up out of the plug hole
      c.rect(m - 2, 12, m + 3, 13, HAIR);
      for (const [x, n] of [[m - 2, 9], [m - 1, 14], [m, 11], [m + 1, 16], [m + 2, 12], [m + 3, 7]]) c.col(x, 13, 13 + n, x % 2 ? HAIR : hex('#2a2630'));
    }
    return () => (u ? dots(c, HAIR, [m, b, m + 2, b]) : c.set(side ? 7 : m + 2, 9, hex('#6a7470')));
  }
  O('nightmare-sink-hair', 'wash basin on a pedestal white sink with taps something black coming up out of the drain hair', {
    w: 24,
    h: 32,
    f: (c, u) => sink(c, u, 21, false),
    sw: 16,
    s: (c, u) => sink(c, u, 13, true),
  });

  /* ---------- the high chair ---------- */
  function highChair(c, u, side) {
    const b = 30,
      T = hex('#b5ad9a'),
      TL = hex('#cfc8b4');
    if (side) {
      c.line(4, 3, 3, b, W);
      c.line(10, 18, 12, b, WD);
      c.rect(4, 17, 10, 18, WL);
      c.rect(8, 12, 13, 13, T);
      c.row(12, 8, 13, TL);
      c.col(9, 14, 16, W);
      c.row(24, 4, 11, WD);
    } else {
      c.line(4, 3, 2, b, W);
      c.line(11, 3, 13, b, WD);
      c.rect(4, 3, 11, 4, W);
      c.rect(5, 5, 10, 11, hex('#7a8a7c'));
      c.rect(4, 17, 11, 18, WL);
      c.rect(2, 12, 13, 13, T);
      c.row(12, 2, 13, TL);
      c.row(24, 3, 12, WD);
    }
    const bx = side ? 9 : 6;
    if (!u) {
      c.rect(bx, 10, bx + 3, 11, ENAML);
      c.row(10, bx, bx + 3, hex('#8a7a5a'));
      c.set(bx + 4, 9, ST);
      c.set(bx + 5, 8, ST);
    } else {
      c.rect(bx + 2, 9, bx + 3, 11, ENAML); // tipped
      c.row(12, bx - 1, bx + 3, HAIR);
    }
    return () => {
      if (!u) return;
      drip(c, bx, 13, 6, HAIR);
      drip(c, bx + 2, 13, 3, HAIR);
      dots(c, HAIR, [bx - 1, b, bx, b, bx + 1, b]);
      dots(c, HAIR, side ? [11, 12] : [3, 12, 11, 12]); // small hand marks
    };
  }
  O('nightmare-high-chair-bowl', 'baby high chair with a bowl and spoon on the tray wooden feeding chair', {
    w: 16,
    h: 32,
    f: (c, u) => highChair(c, u, false),
    sw: 16,
    s: (c, u) => highChair(c, u, true),
  });

  /* ---------- the tricycle ---------- */
  O('nightmare-tricycle-alone', 'child tricycle red trike left alone in the hall three wheels handlebars', {
    w: 26,
    h: 20,
    base: 'side',
    f(c, u) {
      const b = 18,
        R = hex('#9a2f2a');
      if (!u) {
        ring(c, 14, b - 8, 22, b, HAIR);
        ring(c, 15, b - 7, 21, b - 1, hex('#4a4652'));
        c.set(18, b - 4, ST);
        ring(c, 2, b - 5, 7, b, HAIR);
        c.set(4, b - 2, ST);
        c.line(5, b - 4, 16, b - 8, R);
        c.line(5, b - 5, 16, b - 9, R);
        c.line(18, b - 4, 17, 3, ST);
        c.rect(15, 2, 20, 3, HAIR);
        c.rect(6, b - 9, 11, b - 8, HAIR);
        c.col(9, b - 7, b - 6, ST);
        dots(c, C.mustard, [14, 3, 13, 4]); // a ribbon on the grip
      } else {
        // on its side, one wheel still turning
        ring(c, 3, b - 3, 13, b, HAIR);
        c.row(b - 1, 5, 11, hex('#4a4652'));
        c.line(8, b - 2, 18, b - 4, R);
        c.line(8, b - 3, 18, b - 5, R);
        ring(c, 16, b - 12, 24, b - 4, HAIR);
        ring(c, 17, b - 11, 23, b - 5, hex('#4a4652'));
        c.line(18, b - 10, 22, b - 6, ST);
        c.line(22, b - 10, 18, b - 6, ST);
        c.rect(1, b - 7, 2, b - 2, HAIR);
        c.line(3, b - 4, 8, b - 3, ST);
        c.rect(12, b - 7, 15, b - 6, HAIR);
        dots(c, C.mustard, [1, b - 8, 2, b - 9]);
      }
      return () => u && dots(c, C.ash, [25, b - 10, 24, b - 13, 15, b - 13]);
    },
    sw: 16,
    s(c, u) {
      const b = 18,
        R = hex('#9a2f2a');
      if (!u) {
        c.rect(7, b - 8, 8, b, HAIR); // the front wheel, head on
        c.col(7, 3, b - 9, ST);
        c.rect(3, 2, 12, 3, HAIR);
        dots(c, C.mustard, [2, 3, 2, 4]);
        c.rect(2, b - 4, 3, b, HAIR);
        c.rect(12, b - 4, 13, b, HAIR);
        c.row(b - 3, 4, 11, R);
        c.rect(5, b - 9, 10, b - 8, HAIR);
      } else {
        c.oval(3, b - 9, 12, b, HAIR); // a back wheel, flat on, turning
        c.oval(5, b - 7, 10, b - 2, hex('#4a4652'));
        c.line(5, b - 7, 10, b - 2, ST);
        c.line(10, b - 7, 5, b - 2, ST);
        c.rect(7, b - 12, 8, b - 10, R);
        c.rect(6, b - 14, 9, b - 13, HAIR);
      }
      return () => u && dots(c, C.ash, [14, b - 8, 1, b - 10]);
    },
  });

  /* ---------- the rocking horse ---------- */
  O('nightmare-rocking-horse-eyes', 'rocking horse dapple grey wooden toy horse on rockers red saddle glass eyes nursery', {
    w: 34,
    h: 30,
    base: 'side',
    f(c, u) {
      const b = 28,
        G = hex('#a8a294'),
        GL = hex('#c9c2ae'),
        GD = hex('#7d786c');
      const o = u ? 1 : 0;
      c.rect(8, 11 + o, 22, 17 + o, G);
      c.row(10 + o, 9, 21, GL);
      c.rect(21, 5, 25, 13, G); // neck
      if (!u) {
        c.rect(24, 3, 30, 7, G);
        c.row(3, 24, 29, GL);
        c.rect(29, 6, 31, 8, G);
        c.set(27, 5, NI);
        c.set(31, 8, GD);
        dots(c, G, [24, 2, 25, 1]);
      } else {
        // it has turned its head to look at you
        c.rect(20, 1, 26, 8, G);
        c.row(1, 21, 25, GL);
        c.rect(21, 9, 25, 11, G);
        dots(c, G, [20, 0 + 1, 26, 1]);
        eyes(c, 21, 4, hex('#b3342c'), 4);
        dots(c, NI, [22, 10, 24, 10]);
        c.row(8, 21, 25, GD);
      }
      for (let y = 4; y <= 12; y++) c.set(21, y, HAIR); // mane
      c.set(20, 6, HAIR);
      c.set(20, 9, HAIR);
      c.line(7, 11 + o, 4, 16 + o, HAIR); // tail
      c.line(6, 12 + o, 3, 17 + o, HAIR);
      c.rect(13, 9 + o, 18, 12 + o, C.wine);
      c.row(9 + o, 13, 18, L(C.wine));
      c.col(15, 13 + o, 16 + o, P.HIDE);
      dots(c, GD, [10, 13 + o, 12, 15 + o, 19, 13 + o, 20, 16 + o, 23, 9]);
      c.line(10, 18 + o, 7, b - 3, G);
      c.line(11, 18 + o, 8, b - 3, GD);
      c.line(20, 18 + o, 24, b - 3, G);
      c.line(21, 18 + o, 25, b - 3, GD);
      // rockers
      [[2, -3], [3, -2], [4, -1], [5, -1], [6, 0], [26, 0], [27, -1], [28, -1], [29, -2], [30, -3]].forEach(([x, dy]) => c.rect(x, b + dy - 1, x, b + dy, W));
      c.rect(7, b - 1, 25, b, W);
      c.row(b - 1, 7, 25, WL);
    },
    sw: 14,
    s(c, u) {
      const b = 28,
        G = hex('#a8a294'),
        GL = hex('#c9c2ae'),
        GD = hex('#7d786c');
      c.rect(4, 11, 9, 18, G);
      c.col(4, 11, 18, GL);
      c.rect(4, 2, 9, 9, G);
      c.row(2, 5, 8, GL);
      dots(c, G, [4, 1, 9, 1]);
      c.rect(5, 9, 8, 10, G);
      eyes(c, 5, 5, u ? hex('#b3342c') : NI, 3);
      dots(c, NI, [6, 8, 8, 8]);
      c.col(6, 1, 3, HAIR);
      c.col(7, 1, 2, HAIR);
      c.rect(3, 13, 10, 14, C.wine);
      c.rect(4, 19, 5, b - 2, G);
      c.rect(8, 19, 9, b - 2, GD);
      c.rect(2, b - 1, 4, b, W);
      c.rect(9, b - 1, 11, b, WD);
      c.row(b - 2, 3, 10, W);
    },
  });

  /* ---------- the hole in the carpet ---------- */
  function carpetHole(c, u, x1) {
    const b = c.h - 2,
      m = (2 + x1) >> 1,
      R = P.CARP;
    c.rect(2, b - 4, x1, b, R);
    c.row(b - 4, 3, x1 - 1, L(R));
    c.row(b, 2, x1, D(R));
    for (let x = 4; x <= x1 - 2; x += 4) c.set(x, b - 2, hex('#a8904e'));
    for (let x = 2; x <= x1; x += 2) c.set(x, b + 1 - 1, D(R));
    dots(c, ENAMD, [1, b - 3, 1, b - 1, x1 + 1, b - 2, x1 + 1, b]);
    c.oval(m - 6, b - 4, m + 6, b - 1, NI);
    c.row(b - 4, m - 4, m + 4, hex('#3a2020'));
    if (u) {
      // fingers over the edge, both hands, and it is looking up
      for (const x of [m - 6, m - 5, m - 4, m + 3, m + 4, m + 5]) {
        c.col(x, b - 6, b - 4, PALE);
        c.set(x, b - 7, x % 2 ? PALE : D(PALE));
      }
      eyes(c, m - 1, b - 3, EYE, 2);
    }
  }
  O('nightmare-hole-in-carpet', 'hole in the carpet black hole in the middle of a red rug bottomless something climbing out', {
    w: 32,
    h: 9,
    uh: 12,
    solid: false,
    f: (c, u) => carpetHole(c, u, 29),
    sw: 24,
    suh: 12,
    s: (c, u) => carpetHole(c, u, 21),
  });

  /* ---------- the radio ---------- */
  O('nightmare-radio-whispering', 'old valve radio on a stool wooden wireless set cloth speaker glowing dial whispering voices', {
    w: 20,
    h: 32,
    f(c, u) {
      const b = 30;
      c.rect(3, 6, 16, 17, W);
      c.row(5, 5, 14, W);
      c.row(4, 7, 12, WL);
      c.col(3, 6, 17, WL);
      c.rect(5, 7, 14, 12, hex('#8a7a5a'));
      for (let x = 6; x <= 14; x += 2) c.col(x, 7, 12, hex('#6e6248'));
      c.rect(6, 14, 13, 15, u ? LAMP : hex('#5a5644'));
      c.set(u ? 11 : 8, 14, C.red);
      c.set(4, 15, BR);
      c.set(15, 15, BR);
      if (u) {
        // the cloth pushes out: a mouth
        c.rect(8, 9, 11, 10, NI);
        c.set(7, 8, hex('#6e6248'));
        c.set(12, 8, hex('#6e6248'));
        dots(c, NI, [7, 8, 12, 8]);
      }
      c.rect(4, 18, 15, 19, WL);
      c.line(5, 20, 3, b, W);
      c.line(14, 20, 16, b, WD);
      c.row(25, 5, 14, WD);
      return () => u && dots(c, PAPER, [1, 8, 0 + 1, 11, 18, 7, 18, 10, 17, 4, 2, 5]);
    },
    sw: 14,
    s(c, u) {
      const b = 30;
      c.rect(3, 5, 9, 17, W);
      c.row(4, 4, 8, WL);
      c.col(3, 5, 17, WL);
      c.col(10, 7, 12, hex('#8a7a5a'));
      c.set(10, 14, u ? LAMP : hex('#5a5644'));
      bars(c, 5, 8, 8, 10, WD, 2);
      c.rect(3, 18, 10, 19, WL);
      c.line(4, 20, 3, b, W);
      c.line(9, 20, 10, b, WD);
      c.row(25, 4, 9, WD);
      return () => u && dots(c, PAPER, [12, 8, 12, 11, 11, 5]);
    },
  });

  /* ---------- the waiting room ---------- */
  O('nightmare-waiting-chairs-row', 'row of waiting room chairs four plastic seats on a steel beam your number will be called', {
    w: 40,
    h: 24,
    f(c, u) {
      const b = 22,
        cols = [hex('#8a6a3a'), hex('#8a6a3a'), hex('#5d6e68'), hex('#8a6a3a')];
      c.rect(2, 16, 37, 17, ST);
      c.row(16, 2, 37, STL);
      for (const x of [5, 33]) {
        c.rect(x, 18, x + 1, b - 1, ST);
        c.rect(x - 2, b, x + 3, b, ID);
      }
      cols.forEach((col, i) => {
        const x = 2 + i * 9;
        c.rect(x, 3, x + 7, 11, col);
        c.row(3, x + 1, x + 6, L(col));
        c.col(x, 4, 11, L(col));
        c.rect(x, 13, x + 7, 15, col);
        c.row(13, x, x + 7, L(col));
        c.rect(x + 3, 6, x + 4, 7, D(col));
      });
      c.rect(12, 12, 17, 12, PAPER); // a magazine
      if (u) {
        // somebody has been waiting a long time
        c.rect(22, 9, 26, 11, hex('#2e2c38')); // a hat on the seat
        c.row(12, 20, 28, hex('#2e2c38'));
        c.rect(29, 13, 36, 15, hex('#4a3c2a')); // and the last seat is wet
        dots(c, hex('#4a3c2a'), [31, 8, 32, 9, 33, 8, 32, 10]);
        c.rect(3, 12, 5, 12, ENAML); // a ticket
      }
      return () => u && (drip(c, 31, 16, 3, hex('#2a2a26')), pool(c, 28, 36, b, hex('#2a2a26')));
    },
    sw: 14,
    s(c, u) {
      const b = 22,
        col = hex('#8a6a3a');
      c.rect(3, 3, 4, 12, col);
      c.col(3, 3, 12, L(col));
      c.rect(3, 13, 10, 15, col);
      c.row(13, 3, 10, L(col));
      c.rect(5, 16, 8, 17, ST);
      c.rect(6, 18, 7, b - 1, ST);
      c.rect(3, b, 10, b, ID);
      if (u) {
        c.rect(5, 9, 9, 11, hex('#2e2c38'));
        c.row(12, 4, 10, hex('#2e2c38'));
      } else c.row(12, 5, 9, PAPER);
    },
  });

  /* ---------- take a number ---------- */
  function ticketMachine(c, u, side) {
    const b = 38,
      RD = hex('#8a3a34');
    c.rect(5, 16, 6, b - 1, ST);
    c.rect(2, b, 9, b, ID);
    c.rect(3, b - 1, 8, b - 1, ST);
    c.rect(2, 2, 9, 7, NI);
    c.frame(2, 2, 9, 7, ST);
    // the number now being served
    const N = C.red;
    if (!side) {
      if (u) dots(c, N, [4, 3, 5, 3, 4, 4, 5, 4, 4, 5, 5, 5, 4, 6, 5, 6, 7, 3, 7, 4, 7, 5, 7, 6]);
      else dots(c, N, [4, 3, 4, 4, 4, 5, 4, 6, 6, 3, 7, 3, 6, 4, 7, 4, 6, 5, 7, 5, 6, 6, 7, 6]);
    }
    c.col(5, 8, 9, ST);
    c.rect(2, 10, 9, 16, RD);
    c.row(10, 2, 9, hex('#a85048'));
    c.col(2, 10, 16, hex('#a85048'));
    if (side) c.rect(10, 13, 10, 14, ID);
    else c.rect(4, 14, 7, 14, NI);
    const tx = side ? 10 : 5;
    if (!u) c.rect(tx, 15, tx + 1, 17, PAPER);
    else {
      // it will not stop
      for (let y = 15; y <= b - 3; y++) c.rect(tx + Math.round(Math.sin(y / 3)), y, tx + 1 + Math.round(Math.sin(y / 3)), y, y % 4 ? PAPER : ENAMD);
      c.rect(tx - 2, b - 2, tx + 2, b - 1, PAPER);
      c.row(b, tx - 3, tx + 1, ENAML);
      c.set(tx + 2, b - 3, ENAML);
    }
  }
  O('nightmare-ticket-machine-number', 'take a number machine ticket dispenser on a pole with a red number display waiting room queue', {
    w: 12,
    h: 40,
    f: (c, u) => ticketMachine(c, u, false),
    sw: 14,
    s: (c, u) => ticketMachine(c, u, true),
  });
};
