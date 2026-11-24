/* env-suburban, part 3: porch, patio and what the children left out. Part of tools/big/env2-ruin.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring } = X;
  const { bricks, planks, boards, rust, tins, tin, bottle, litter, flame, smoke, pool, crate, mesh, grass, leaves, hedge, pane, drip } = X;
  const { TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, CARD, WATER, WATERL, SMOKE, LAWN, LAWND, HEDGE, VINYL, WARM } = X;
  setCat('env-suburban', 'Suburban');

  const RED = hex('#a8403a'),
    YEL = hex('#b8a03a'),
    PINK = hex('#b87a84'),
    PURP = hex('#7a5a8a'),
    LEMON = hex('#c9b85a'),
    PUMP = hex('#b0622a'),
    TERRA = hex('#9a5a3c'),
    COIR = hex('#8a6a40'),
    COOL = hex('#3d5a8a'),
    ACU = hex('#aaa590'),
    ALU = hex('#9a9c9e'),
    NET = hex('#c9c6b8'),
    MILK = hex('#dcd8c8');

  T('suburban-porch-swing-seat', 'porch swing seat white bench on chains floral cushion still swinging nobody on it', {
    w: 36, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2,
        dx = u ? 2 : 0;
      for (const x of [2, 32]) {
        c.rect(x, 3, x + 1, b, VINYL);
        c.col(x, 3, b, L(VINYL));
      }
      c.rect(1, 2, 34, 3, VINYL);
      c.row(2, 1, 34, L(VINYL));
      c.rect(1, b, 4, b, D(VINYL));
      c.rect(31, b, 34, b, D(VINYL));
      c.line(8, 4, 7 + dx, 16, C.steel);
      c.line(27, 4, 28 + dx, 16, C.steel);
      /* the bench */
      for (let x = 7; x <= 28; x += 3) {
        c.rect(x + dx, 14, x + 1 + dx, 22, VINYL);
        c.col(x + 1 + dx, 14, 22, D(VINYL));
      }
      c.rect(6 + dx, 13, 29 + dx, 14, VINYL);
      c.rect(5 + dx, 23, 30 + dx, 25, VINYL);
      c.row(25, 5 + dx, 30 + dx, D(VINYL));
      c.rect(5 + dx, 18, 6 + dx, 23, VINYL);
      c.rect(29 + dx, 18, 30 + dx, 23, D(VINYL));
      if (u) {
        /* the cushion on the boards, a glass rolled away */
        c.rect(10, b - 2, 22, b, PINK);
        c.row(b - 2, 10, 22, L(PINK));
        dots(c, hex('#6a8a6a'), [12, b - 1, 16, b - 1, 20, b - 1]);
        c.rect(25, b - 1, 27, b, hex('#9ebcc2'));
        c.row(b, 28, 30, hex('#8a7a40'));
        dots(c, hex('#8a8a80'), [4, 20, 4, 24, 33, 19]);
      } else {
        c.rect(7, 20, 28, 22, PINK);
        c.row(20, 7, 28, L(PINK));
        dots(c, hex('#6a8a6a'), [9, 21, 13, 21, 17, 21, 21, 21, 25, 21]);
        c.rect(12, 15, 19, 19, hex('#7a8a9a'));
        c.row(15, 12, 19, hex('#93a3b3'));
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2,
        dx = u ? 3 : 0;
      c.line(7, 3, 2, b, VINYL);
      c.line(8, 3, 13, b, D(VINYL));
      c.rect(6, 2, 9, 3, VINYL);
      c.line(7, 4, 6 + dx, 14, C.steel);
      c.line(8, 4, 10 + dx, 22, C.steel);
      c.rect(5 + dx, 13, 6 + dx, 23, VINYL);
      c.rect(5 + dx, 23, 11 + dx, 24, VINYL);
      c.row(25, 5 + dx, 11 + dx, D(VINYL));
      if (u) {
        c.rect(3, b - 1, 8, b, PINK);
        dots(c, hex('#8a8a80'), [14, 16, 15, 20]);
      } else c.rect(7, 21, 11, 22, PINK);
    },
  });

  T('suburban-bicycle-child-streamers', "child's bicycle pink with streamers training wheels basket lying on the path wheel spinning", {
    w: 10, h: 22, solid: true, base: 'side',
    sw: 30,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        /* on its side in the road */
        c.oval(2, b - 5, 12, b - 1, TYRE);
        c.oval(4, b - 4, 10, b - 2, hex('#4a4852'));
        c.oval(17, b - 7, 27, b - 3, TYRE);
        c.oval(19, b - 6, 25, b - 4, hex('#8a8a90'));
        dots(c, C.bone, [20, b - 5, 22, b - 6, 24, b - 5]);
        c.line(8, b - 3, 16, b - 6, PINK);
        c.line(9, b - 2, 20, b - 4, D(PINK));
        c.line(14, b - 5, 15, b - 9, C.steel);
        c.rect(13, b - 10, 17, b - 10, DARK);
        dots(c, YEL, [12, b - 11, 18, b - 11, 11, b - 9]);
        c.rect(22, b - 1, 26, b, hex('#a8904e'));
        c.rect(0, b, 2, b, C.white);
        dots(c, hex('#8a8a80'), [28, b - 8, 29, b - 5, 16, b - 8]);
      } else {
        ring(c, 7, b - 5, 5, TYRE, C.steel);
        ring(c, 22, b - 5, 5, TYRE, C.steel);
        c.line(7, b - 5, 12, b - 11, PINK);
        c.line(12, b - 11, 20, b - 12, PINK);
        c.line(12, b - 11, 15, b - 5, D(PINK));
        c.line(15, b - 5, 7, b - 5, PINK);
        c.line(22, b - 5, 20, b - 15, C.steel);
        c.rect(18, b - 16, 21, b - 16, DARK);
        dots(c, YEL, [17, b - 15, 17, b - 14, 16, b - 13]);
        dots(c, PURP, [18, b - 14, 16, b - 15]);
        c.rect(10, b - 13, 14, b - 12, C.white);
        c.col(12, b - 11, b - 11, C.steel);
        /* basket, training wheel */
        c.rect(22, b - 14, 26, b - 10, hex('#a8904e'));
        for (let x = 22; x <= 26; x += 2) c.col(x, b - 14, b - 10, hex('#8a7440'));
        c.line(7, b - 5, 3, b - 2, C.steel);
        c.rect(2, b - 2, 4, b, C.white);
        c.set(15, b - 4, DARK);
        c.rect(14, b - 3, 16, b - 3, DARK);
      }
    },
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 3, 8, b - 1, TYRE);
        c.row(b - 2, 2, 7, hex('#8a8a90'));
        c.line(4, b - 4, 5, b - 8, C.steel);
        c.row(b - 9, 3, 7, DARK);
        dots(c, YEL, [2, b - 10, 8, b - 9]);
        c.rect(6, b, 8, b, hex('#a8904e'));
      } else {
        c.rect(4, b - 10, 5, b, TYRE);
        c.col(4, b - 10, b, hex('#34323c'));
        c.rect(4, b - 15, 5, b - 11, PINK);
        c.row(b - 16, 1, 8, DARK);
        dots(c, YEL, [0, b - 15, 0, b - 14, 9, b - 15, 9, b - 14]);
        c.rect(2, b - 14, 7, b - 10, hex('#a8904e'));
        for (let x = 2; x <= 7; x += 2) c.col(x, b - 14, b - 10, hex('#8a7440'));
        c.rect(1, b - 2, 1, b, C.white);
        c.rect(8, b - 2, 8, b, C.white);
      }
    },
  });

  T('suburban-tricycle-red', 'red tricycle trike toddler toy left on the pavement tipped over', {
    w: 12, h: 16, solid: false, base: 'side',
    sw: 20,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        c.oval(2, b - 3, 8, b, TYRE);
        c.rect(4, b - 2, 6, b - 1, C.white);
        c.line(7, b - 2, 14, b - 4, RED);
        c.line(7, b - 1, 15, b - 3, D(RED));
        c.oval(13, b - 6, 18, b - 2, TYRE);
        c.set(15, b - 4, C.white);
        c.set(16, b - 4, C.white);
        c.line(14, b - 5, 11, b - 9, C.steel);
        c.rect(9, b - 10, 12, b - 10, DARK);
        c.rect(7, b - 4, 10, b - 3, DARK);
      } else {
        c.oval(11, b - 6, 17, b, TYRE);
        c.oval(13, b - 4, 15, b - 2, C.white);
        c.oval(2, b - 4, 6, b, TYRE);
        c.set(4, b - 2, C.white);
        c.line(4, b - 3, 12, b - 7, RED);
        c.line(4, b - 4, 12, b - 8, L(RED));
        c.line(14, b - 3, 12, b - 11, C.steel);
        c.rect(10, b - 12, 14, b - 12, DARK);
        c.rect(5, b - 8, 9, b - 7, DARK);
        c.col(7, b - 6, b - 5, C.steel);
        dots(c, YEL, [9, b - 11]);
      }
    },
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(2, b - 2, 9, b, TYRE);
        c.row(b - 1, 3, 8, C.white);
        c.line(5, b - 3, 6, b - 7, C.steel);
        c.row(b - 8, 4, 9, DARK);
        c.rect(1, b - 5, 2, b - 3, TYRE);
      } else {
        c.rect(5, b - 6, 6, b, TYRE);
        c.rect(5, b - 10, 6, b - 7, RED);
        c.row(b - 12, 2, 9, DARK);
        c.col(5, b - 11, b - 11, C.steel);
        c.rect(1, b - 3, 2, b, TYRE);
        c.rect(9, b - 3, 10, b, TYRE);
        c.row(b - 2, 3, 8, RED);
      }
    },
  });

  T('suburban-lemonade-stand', 'lemonade stand children stall crate table jug paper cups sign pitcher knocked over', {
    w: 30, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 25]) {
        c.rect(x, 3, x + 1, b, C.woodLight);
        c.col(x + 1, 3, b, C.wood);
      }
      c.rect(2, 2, 27, 9, C.bone);
      c.frame(2, 2, 27, 9, C.woodLight);
      txt(c, 5, 3, 'LEMON', hex('#8a7a2a'));
      c.set(24, 5, LEMON);
      c.rect(23, 4, 25, 6, LEMON);
      planks(c, 2, 20, 27, b, hex('#a8855c'), 4);
      c.rect(1, 18, 28, 19, C.woodPale);
      c.row(20, 2, 27, C.woodDark);
      txt(c, 11, 23, '5C', hex('#4a3a2a'));
      if (u) {
        /* the jug on its side, running off the edge */
        c.rect(8, 15, 14, 17, hex('#9ebcc2'));
        c.rect(9, 16, 13, 17, LEMON);
        c.row(18, 14, 21, LEMON);
        drip(c, 20, 19, 6, LEMON);
        drip(c, 17, 19, 3, LEMON);
        c.row(b, 16, 23, LEMON);
        c.rect(21, 16, 22, 17, C.white);
        dots(c, C.brass, [5, b, 9, b, 11, b - 1]);
        c.line(4, 4, 25, 8, RED);
      } else {
        c.rect(9, 11, 13, 17, hex('#9ebcc2'));
        c.rect(9, 13, 13, 17, LEMON);
        c.col(14, 12, 15, hex('#9ebcc2'));
        c.set(11, 12, hex('#e0d68a'));
        for (const x of [17, 20, 23]) {
          c.rect(x, 15, x + 1, 17, C.white);
          c.set(x, 15, LEMON);
        }
        c.rect(5, 16, 6, 17, hex('#6f7478'));
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      c.rect(7, 3, 8, b, C.woodLight);
      c.rect(7, 2, 8, 9, C.bone);
      planks(c, 3, 20, 12, b, mix(hex('#a8855c'), 0.9), 4);
      c.rect(2, 18, 13, 19, C.woodPale);
      if (u) {
        c.rect(5, 16, 9, 17, hex('#9ebcc2'));
        drip(c, 13, 19, 5, LEMON);
        c.row(b, 13, 15, LEMON);
      } else {
        c.rect(5, 11, 8, 17, hex('#9ebcc2'));
        c.rect(5, 13, 8, 17, LEMON);
        c.rect(10, 15, 11, 17, C.white);
      }
    },
  });

  {
    const pumpkin = (c, x, yb, w, h, lit, face) => {
      const y0 = yb - h + 1;
      c.oval(x, y0, x + w - 1, yb, PUMP);
      for (let i = 2; i < w - 1; i += 3) c.col(x + i, y0 + 1, yb - 1, D(PUMP));
      c.row(y0, x + 2, x + w - 3, L(PUMP));
      c.rect(x + (w >> 1) - 1, y0 - 2, x + (w >> 1), y0 - 1, hex('#4a5a34'));
      if (face) {
        const f = lit ? C.flameLight : hex('#2a1a14'),
          m = x + (w >> 1);
        dots(c, f, [m - 2, y0 + 2, m + 1, y0 + 2, m - 3, y0 + 2, m + 2, y0 + 2, m - 2, y0 + 3, m + 1, y0 + 3]);
        c.row(yb - 2, m - 3, m + 2, f);
        dots(c, PUMP, [m - 2, yb - 2, m + 1, yb - 2]);
        dots(c, f, [m - 3, yb - 3, m + 2, yb - 3]);
        if (lit) dots(c, C.flame, [m - 1, yb - 2, m, yb - 2]);
      }
    };
    T('suburban-jack-o-lanterns-porch', "halloween pumpkins jack o'lanterns carved faces on the step candle lit grinning", {
      w: 24, h: 15, solid: false,
      f(c, u) {
        const b = c.h - 2;
        pumpkin(c, 1, b, 12, 10, u, true);
        pumpkin(c, 13, b, 9, 7, u, true);
        if (u) dots(c, mix(WARM, 0.7), [0, b - 5, 13, b - 9, 22, b - 4, 7, b - 12]);
        else c.set(22, b, hex('#4a5a34'));
      },
      sw: 14,
      s(c, u) {
        const b = c.h - 2;
        pumpkin(c, 1, b, 11, 10, u, false);
        if (u) {
          c.col(11, b - 6, b - 2, C.flameLight);
          dots(c, mix(WARM, 0.7), [13, b - 7, 13, b - 3, 12, b - 9]);
        } else c.col(11, b - 6, b - 2, hex('#2a1a14'));
      },
    });
  }

  T('suburban-milk-bottles-doorstep', 'milk bottles on the doorstep wire carrier foil tops delivery never taken in empty note', {
    w: 16, h: 13, solid: false,
    f(c, u) {
      const b = c.h - 2;
      const bot = (x, full, lean) => {
        c.rect(x, b - 6, x + 2, b, full ? MILK : hex('#8fa8a8'));
        c.col(x, b - 6, b, full ? C.white : WATERL);
        c.rect(x + 1, b - 8, x + 1, b - 7, full ? MILK : hex('#8fa8a8'));
        if (full) c.set(x + 1, b - 9, hex('#a8403a'));
        if (!full) c.set(x + 2, b - 1, MILK);
      };
      bot(2, !u);
      bot(6, !u);
      if (u) {
        /* one on its side, a rolled note in the neck of another */
        c.rect(10, b - 2, 15, b, hex('#8fa8a8'));
        c.row(b - 2, 10, 15, WATERL);
        c.row(b, 12, 15, MILK);
        c.rect(7, b - 11, 7, b - 8, C.paper);
      } else bot(10, true);
      c.row(b - 3, 1, u ? 9 : 13, C.steel);
      c.col(1, b - 3, b, C.steel);
      if (!u) c.col(13, b - 3, b, C.steel);
      else c.col(9, b - 3, b, C.steel);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 6, 4, b, u ? hex('#8fa8a8') : MILK);
      c.col(2, b - 6, b, u ? WATERL : C.white);
      c.rect(3, b - 8, 3, b - 7, u ? hex('#8fa8a8') : MILK);
      if (!u) c.set(3, b - 9, hex('#a8403a'));
      else c.col(3, b - 11, b - 8, C.paper);
      c.row(b - 3, 1, 5, C.steel);
    },
  });

  {
    const pot = (c, x, b, tipped) => {
      if (tipped) {
        c.poly([[x, b - 4], [x + 5, b - 3], [x + 5, b], [x, b]], TERRA);
        c.col(x, b - 4, b, D(TERRA));
        c.rect(x - 4, b - 1, x - 1, b, hex('#4a3628'));
        c.line(x - 5, b - 2, x - 8, b - 4, hex('#4f6b3c'));
        dots(c, RED, [x - 9, b - 5, x - 7, b - 2]);
        return;
      }
      c.poly([[x, b - 5], [x + 5, b - 5], [x + 4, b], [x + 1, b]], TERRA);
      c.row(b - 5, x, x + 5, L(TERRA));
      c.rect(x + 1, b - 8, x + 4, b - 6, hex('#4f6b3c'));
      dots(c, hex('#2e4835'), [x + 2, b - 7, x + 4, b - 6]);
      dots(c, RED, [x + 1, b - 9, x + 3, b - 10, x + 4, b - 8, x, b - 8]);
    };
    T('suburban-doormat-flowerpots', 'doormat welcome mat home between two geranium pots spare key under the mat', {
      w: 32, h: 14, solid: false,
      f(c, u) {
        const b = c.h - 2;
        pot(c, 1, b, false);
        pot(c, u ? 24 : 25, b, u);
        if (u) {
          /* mat folded back; the key is gone, only its shape in the dust */
          c.rect(8, b, 20, b, hex('#6a6458'));
          c.poly([[8, b], [8, b - 4], [14, b - 5], [14, b - 1]], D(COIR));
          c.line(8, b - 4, 14, b - 5, COIR);
          c.rect(16, b, 18, b, hex('#8a8474'));
          c.set(19, b, hex('#8a8474'));
        } else {
          c.rect(8, b - 1, 23, b, COIR);
          c.row(b - 1, 8, 23, L(COIR));
          dots(c, hex('#4a3a2a'), [10, b - 1, 12, b - 1, 14, b - 1, 16, b - 1, 18, b - 1, 20, b - 1]);
        }
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2;
        pot(c, 2, b, false);
        if (u) c.line(8, b, 9, b - 3, D(COIR));
        else c.rect(8, b - 1, 9, b, COIR);
      },
    });
  }

  T('suburban-garden-table-parasol', 'garden table with parasol striped umbrella patio chairs jug folded shut glass knocked over', {
    w: 34, h: 44, solid: true, same: true,
    f(c, u) {
      const b = c.h - 2,
        GS = hex('#4f7a5a');
      c.rect(16, 4, 17, b, C.steel);
      c.col(16, 4, b, L(C.steel));
      c.rect(13, b, 20, b, C.iron);
      if (u) {
        c.poly([[14, 5], [19, 5], [18, 24], [15, 24]], GS);
        for (const x of [15, 18]) c.col(x, 6, 23, C.white);
        c.row(22, 14, 19, hex('#8a8a80'));
        c.rect(16, 2, 17, 4, C.bone);
      } else {
        c.poly([[1, 10], [8, 4], [25, 4], [32, 10]], GS);
        for (const [x0, x1, x2, x3] of [[5, 9, 12, 10], [15, 15, 18, 18], [24, 21, 23, 28]]) c.poly([[x0, 10], [x1, 4], [x2, 4], [x3, 10]], C.white);
        c.row(4, 8, 25, L(GS));
        for (let x = 2; x <= 31; x += 3) c.set(x, 11, C.white);
        c.rect(16, 2, 17, 3, C.bone);
      }
      /* table and two chairs */
      c.rect(6, 28, 27, 29, VINYL);
      c.row(28, 6, 27, L(VINYL));
      for (const x of [9, 24]) c.col(x, 30, b, D(VINYL));
      const chair = (x, flip) => {
        c.rect(x, 24, x + 1, b, VINYL);
        c.rect(flip ? x - 4 : x + 2, 32, flip ? x - 1 : x + 5, 33, VINYL);
        c.col(flip ? x - 4 : x + 5, 34, b, D(VINYL));
      };
      chair(1, false);
      if (u) {
        /* the other chair on its back */
        c.rect(25, b - 1, 32, b, VINYL);
        c.col(27, b - 6, b - 2, VINYL);
        c.col(32, b - 5, b - 2, D(VINYL));
        c.rect(19, 27, 21, 27, hex('#9ebcc2'));
        drip(c, 23, 30, 4, hex('#b08a4a'));
        c.row(27, 22, 24, hex('#b08a4a'));
      } else {
        chair(31, true);
        c.rect(20, 25, 21, 27, hex('#9ebcc2'));
        c.set(20, 26, hex('#b08a4a'));
      }
      c.rect(10, 23, 13, 27, hex('#9ebcc2'));
      c.rect(10, 25, 13, 27, hex('#b08a4a'));
      c.set(14, 24, hex('#9ebcc2'));
    },
  });

  T('suburban-sun-lounger', 'sun lounger garden recliner striped towel book sunglasses damp shape left on it', {
    w: 14, h: 18, solid: true, base: 'side',
    sw: 36,
    s(c, u) {
      const b = c.h - 2,
        TW = hex('#5a8a9a');
      c.rect(10, b - 6, 33, b - 5, VINYL);
      c.row(b - 6, 10, 33, L(VINYL));
      c.line(10, b - 6, 3, b - 14, VINYL);
      c.line(11, b - 6, 4, b - 14, D(VINYL));
      c.line(6, b - 10, 8, b - 4, C.steel);
      for (const x of [12, 30]) {
        c.col(x, b - 4, b, D(VINYL));
        c.row(b, x - 1, x + 1, D(VINYL));
      }
      if (u) {
        /* the towel dragged off; a wet outline where someone lay */
        c.row(b - 7, 13, 28, hex('#8a8a7a'));
        c.line(9, b - 8, 5, b - 12, hex('#8a8a7a'));
        c.poly([[26, b - 6], [33, b - 6], [35, b], [29, b]], TW);
        for (let y = b - 5; y <= b; y += 2) c.row(y, 28, 34, C.white);
        c.rect(18, b - 1, 22, b, hex('#7a3a34'));
        c.row(b, 18, 22, C.paper);
      } else {
        c.rect(11, b - 8, 30, b - 7, TW);
        for (let x = 13; x <= 30; x += 4) c.rect(x, b - 8, x + 1, b - 7, C.white);
        c.line(10, b - 8, 5, b - 13, TW);
        c.rect(18, b - 10, 22, b - 9, hex('#7a3a34'));
        c.row(b - 9, 18, 22, C.paper);
        c.rect(25, b - 9, 27, b - 9, DARK);
      }
    },
    f(c, u) {
      const b = c.h - 2,
        TW = hex('#5a8a9a');
      c.rect(2, b - 14, 11, b - 7, VINYL);
      for (let y = b - 13; y < b - 7; y += 2) c.row(y, 3, 10, D(VINYL));
      c.rect(1, b - 6, 12, b - 5, VINYL);
      c.row(b - 6, 1, 12, L(VINYL));
      for (const x of [2, 11]) c.col(x, b - 4, b, D(VINYL));
      if (u) {
        c.rect(4, b - 13, 9, b - 8, hex('#8a8a7a'));
        c.rect(8, b - 4, 13, b, TW);
        c.row(b - 2, 8, 13, C.white);
      } else {
        c.rect(3, b - 14, 10, b - 7, TW);
        for (let x = 4; x <= 10; x += 3) c.col(x, b - 14, b - 7, C.white);
        c.rect(3, b - 8, 10, b - 7, TW);
        c.rect(5, b - 9, 8, b - 8, hex('#7a3a34'));
      }
    },
  });

  T('suburban-cooler-box', 'cooler box ice chest blue picnic beer bottles lid open melted ice', {
    w: 18, h: 13, solid: false, um: [0, 5, 0], sum: [0, 5, 0],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 15, b, COOL);
      c.col(2, 5, b, L(COOL));
      c.row(b, 2, 15, D(COOL));
      c.rect(7, 7, 10, 8, D(COOL));
      if (u) {
        c.rect(2, -2, 15, 2, mix(C.white, 0.85));
        c.frame(2, -2, 15, 2, mix(C.white, 0.7));
        c.rect(3, 3, 14, 4, hex('#b8ccd0'));
        for (const x of [5, 9, 12]) {
          c.rect(x, 1, x, 3, hex('#6a4a2c'));
          c.set(x, 0, C.brass);
        }
        c.row(b, 0, 1, WATERL);
        c.row(b, 16, 17, WATERL);
        drip(c, 15, 6, 3, WATERL);
      } else {
        c.rect(1, 2, 16, 4, C.white);
        c.row(4, 1, 16, mix(C.white, 0.8));
        c.rect(6, 1, 11, 1, mix(C.white, 0.8));
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 5, 9, b, COOL);
      if (u) {
        c.rect(2, -2, 3, 4, mix(C.white, 0.85));
        c.rect(4, 3, 8, 4, hex('#b8ccd0'));
        c.col(6, 0, 3, hex('#6a4a2c'));
        c.row(b, 10, 11, WATERL);
      } else {
        c.rect(1, 2, 10, 4, C.white);
        c.row(4, 1, 10, mix(C.white, 0.8));
      }
    },
  });

  T('suburban-air-conditioner-unit', 'air conditioner condenser unit outside the house fan grille humming dripping feathers', {
    w: 24, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 22, b, CONC);
      c.rect(2, 3, 21, b - 2, ACU);
      c.row(3, 2, 21, L(ACU));
      c.col(2, 3, b - 2, L(ACU));
      c.oval(4, 5, 14, 15, hex('#2a2c32'));
      if (u) {
        ring(c, 9, 10, 3, hex('#6a6d74'));
        ring(c, 9, 10, 1.5, hex('#8a8e94'));
        dots(c, C.white, [15, 4, 17, 2, 13, 2]);
        dots(c, hex('#6a5a48'), [16, 3, 12, 3]);
        dots(c, C.blood, [6, 13, 12, 7]);
        drip(c, 19, b - 2, 1, WATERL);
        c.row(b, 17, 23, WATER);
      } else {
        c.line(9, 6, 9, 14, hex('#6a6d74'));
        c.line(5, 10, 13, 10, hex('#6a6d74'));
        c.set(9, 10, C.steel);
      }
      ring(c, 9, 10, 5, C.steel);
      for (let y = 6; y <= 14; y += 2) c.row(y, 16, 20, D(ACU));
      c.rect(17, b - 4, 19, b - 3, hex('#3a3a44'));
      c.set(19, b - 4, u ? GREENL : DARK);
      rust(c, 2, 12, 21, b - 2, 22, 3);
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 10, b, CONC);
      sideBox(c, 2, 3, 9, b - 2, ACU);
      for (let y = 6; y <= 14; y += 2) c.row(y, 3, 8, D(ACU));
      c.line(2, 6, 0, 6, hex('#3a3a44'));
      c.col(0, 2, 6, hex('#3a3a44'));
      if (u) {
        c.row(b, 10, 11, WATER);
        dots(c, C.white, [10, 4, 11, 2]);
      }
    },
  });

  T('suburban-patio-door-sliding', 'sliding patio door glass net curtains garden door slid open curtain blowing footprints', {
    w: 38, h: 40, solid: true, um: [0, 0, 0],
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 36, b, ALU);
      c.row(1, 1, 36, L(ALU));
      c.col(1, 1, b, L(ALU));
      c.rect(3, 3, 18, b - 1, hex('#34444e'));
      c.rect(20, 3, 34, b - 1, u ? DARK : hex('#34444e'));
      c.col(19, 3, b - 1, D(ALU));
      /* net curtains behind the glass */
      const net = (x0, x1) => {
        for (let x = x0; x <= x1; x++) c.col(x, 4, b - 2, (x - x0) % 3 === 0 ? mix(NET, 0.78) : mix(NET, 0.62));
      };
      net(3, 12);
      if (u) {
        /* the door stands open: the curtain is sucked out through the gap */
        c.rect(20, 3, 23, b - 1, hex('#34444e'));
        c.col(24, 3, b - 1, ALU);
        c.poly([[28, 4], [33, 4], [36, 22], [34, 30], [30, 26]], NET);
        c.line(29, 5, 32, 25, mix(NET, 0.8));
        c.line(33, 4, 36, 22, mix(NET, 0.85));
        for (const [x, y] of [[26, b], [29, b - 1], [32, b]]) c.rect(x, y, x + 1, y, hex('#4a3628'));
        c.rect(26, 12, 27, 14, hex('#2a2428'));
      } else {
        net(26, 34);
        c.line(5, 16, 10, 6, mix(C.glass, 0.8));
        c.line(22, 20, 24, 14, mix(C.glass, 0.8));
        c.rect(21, 18, 21, 22, C.steel);
        /* a small hand print low on the glass, inside */
        pat(c, 14, 28, ['w.w', 'www', '.w.'], hex('#55666e'));
      }
      c.row(b, 1, 36, D(ALU));
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 1, 5, b, ALU);
      c.col(4, 3, b - 1, hex('#34444e'));
      if (u) {
        c.poly([[6, 6], [7, 6], [8, 24], [6, 28]], NET);
        c.set(6, b, hex('#4a3628'));
      }
    },
  });

  T('suburban-rose-trellis', 'rose trellis climbing roses lattice against the wall red blooms every head cut off', {
    w: 22, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2,
        r = rnd(9);
      c.frame(2, 2, 19, b - 5, C.woodLight);
      for (let y = 3; y < b - 5; y++) for (let x = 3; x < 19; x++) if ((x + y) % 6 === 0 || (x - y + 60) % 6 === 0) c.set(x, y, C.wood);
      c.poly([[7, b - 5], [14, b - 5], [13, b], [8, b]], hex('#9a5a3c'));
      c.row(b - 5, 7, 14, hex('#b87a54'));
      /* the stems */
      c.line(10, b - 6, 6, 20, hex('#3e5a33'));
      c.line(6, 20, 9, 6, hex('#3e5a33'));
      c.line(11, b - 6, 15, 18, hex('#3e5a33'));
      c.line(15, 18, 13, 5, hex('#3e5a33'));
      for (let i = 0; i < 40; i++) {
        const x = 3 + ((r() * 15) | 0),
          y = 4 + ((r() * (b - 12)) | 0);
        c.set(x, y, r() < 0.5 ? hex('#4f6b3c') : hex('#3a5a38'));
        c.set(x + 1, y, hex('#3a5a38'));
      }
      const heads = [[5, 8], [12, 5], [16, 11], [8, 15], [14, 20], [5, 24], [11, 27], [16, 28]];
      if (u) {
        for (const [x, y] of heads) c.set(x, y, hex('#b8a47a'));
        dots(c, RED, [3, b, 5, b - 1, 16, b, 18, b - 1, 17, b, 1, b]);
        c.rect(15, b - 1, 19, b - 1, C.steel);
        c.rect(19, b, 20, b, hex('#3d5a8a'));
      } else
        for (const [x, y] of heads) {
          c.rect(x, y, x + 1, y + 1, RED);
          c.set(x, y, hex('#c86a60'));
        }
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 2, b - 5, C.woodLight);
      c.rect(2, b - 5, 6, b, hex('#9a5a3c'));
      for (let y = 5; y < b - 6; y += 3) c.set(3, y, y % 2 ? hex('#4f6b3c') : hex('#3a5a38'));
      for (const y of [6, 14, 22, 28]) {
        c.set(4, y, hex('#3a5a38'));
        if (!u) c.rect(4, y + 1, 5, y + 2, RED);
      }
      if (u) dots(c, RED, [6, b, 7, b]);
    },
  });

  T('suburban-playhouse-plastic', 'plastic playhouse wendy house children garden little door flower box someone small inside', {
    w: 28, h: 30, solid: true, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2,
        WALL = hex('#b9ad8a'),
        ROOF = hex('#8a3a34'),
        DG = hex('#4f7a5a');
      c.rect(3, 11, 24, b, WALL);
      c.col(3, 11, b, L(WALL));
      c.poly([[1, 12], [13, 2], [14, 2], [26, 12]], ROOF);
      c.line(1, 12, 13, 2, L(ROOF));
      c.poly([[6, 11], [13, 5], [14, 5], [21, 11]], WALL);
      c.rect(17, 14, 22, 19, u ? DARK : GLASSD);
      c.frame(16, 13, 23, 20, C.white);
      c.col(19, 14, 19, C.white);
      c.col(20, 14, 19, C.white);
      c.rect(16, 21, 23, 22, YEL);
      dots(c, RED, [17, 20, 19, 20, 22, 20]);
      if (u) {
        c.rect(6, 15, 13, b, DARK);
        dots(c, C.white, [9, 20, 11, 20]);
        c.rect(14, 15, 14, b, DG);
        c.rect(-0, 0, 0, 0, null);
        c.rect(25, 15, 30, b, mix(DG, 0.85));
        c.frame(25, 15, 30, b, D(DG));
        dots(c, C.white, [18, 16, 20, 16]);
        c.rect(24, 15, 24, b, WALL);
      } else {
        c.rect(6, 15, 13, b, DG);
        c.col(6, 15, b, L(DG));
        c.oval(8, 17, 11, 20, GLASSD);
        c.set(12, 23, YEL);
      }
      c.speckle(3, 11, 24, b, mix(WALL, 0.86), 16, 3);
      grass(c, 0, 5, b, 3, LAWN, 2);
    },
    sw: 24,
    s(c, u) {
      const b = c.h - 2,
        WALL = hex('#b9ad8a'),
        ROOF = hex('#8a3a34');
      c.rect(3, 12, 20, b, mix(WALL, 0.9));
      c.rect(1, 3, 22, 11, ROOF);
      c.row(3, 1, 22, L(ROOF));
      for (const y of [6, 9]) c.row(y, 1, 22, D(ROOF));
      c.rect(8, 15, 15, 21, u ? DARK : GLASSD);
      c.frame(7, 14, 16, 22, C.white);
      c.col(11, 15, 21, C.white);
      c.col(12, 15, 21, C.white);
      if (u) dots(c, C.white, [9, 17, 10, 17]);
      grass(c, 16, 23, b, 3, LAWN, 2);
    },
  });

  T('suburban-bird-feeder-pole', 'bird feeder on a pole seed table nuts sparrows garden emptied feathers', {
    w: 18, h: 40, solid: true, same: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(8, 12, 9, b, C.woodLight);
      c.col(9, 12, b, C.wood);
      c.rect(3, 10, 14, 11, C.woodLight);
      c.row(11, 3, 14, C.wood);
      c.poly([[2, 5], [8, 1], [9, 1], [15, 5]], hex('#5a4a3a'));
      c.line(2, 5, 8, 1, hex('#73604c'));
      for (const x of [4, 13]) c.col(x, 6, 9, C.wood);
      c.line(13, 11, 15, 13, C.steel);
      mesh(c, 14, 14, 16, 20, C.steel);
      if (u) {
        dots(c, hex('#8a7a66'), [5, 9, 11, 13, 3, 15, 12, 22, 6, 26]);
        dots(c, hex('#b8a47a'), [4, b, 6, b, 11, b, 13, b - 1, 12, b]);
        c.rect(2, b - 1, 4, b, hex('#6a5a48'));
        c.set(5, b, hex('#b8963a'));
      } else {
        c.rect(14, 16, 16, 20, hex('#8a6a40'));
        mesh(c, 14, 14, 16, 20, C.steel);
        c.row(9, 5, 12, hex('#b8a47a'));
        c.rect(6, 7, 8, 8, hex('#6a5a48'));
        c.set(9, 7, hex('#6a5a48'));
        c.set(5, 7, hex('#b8963a'));
        c.set(6, 6, hex('#6a5a48'));
      }
      grass(c, 5, 12, b, 3, LAWN, 2);
    },
  });
};
