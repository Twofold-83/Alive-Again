/* env-basement: a cellar full of things kept and hidden. Part of tools/big/env-city.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, txt, scribble, wheel, ring } = X;
  const { bricks, planks, hazard, cobweb, tins, bottles, litter, flame, smoke, pool } = X;
  const { TYRE, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, BLUEL, CARD, CARDD, BAG, DIRTW, WATER, WATERL, SMOKE, POLE, DARK } = X;
  setCat('env-basement', 'Basement');

  const VOID = hex('#0e0c12'),
    TICK = C.cream,
    HESS = hex('#8a7a58'),
    FROST = hex('#c9d3d4'),
    COPPER = hex('#9a5a34'),
    COAL = hex('#1c1a20'),
    BRICKN = hex('#7a4a3c');
  const stripes = (c, x0, y0, x1, y1, col, step = 3) => {
    for (let x = x0 + 1; x <= x1; x += step) c.col(x, y0, y1, col);
  };

  /* ---------- cold and white ---------- */
  T('chest-freezer-cellar', 'chest freezer cellar white lid frost frozen hand meat parcels', {
    w: 32, h: 18, solid: true, um: [0, 12, 0], sum: [0, 12, 0],
    f(c, u) {
      const b = c.h - 2,
        E = DIRTW;
      c.rect(1, 5, 30, b, E);
      c.col(1, 5, b, C.white);
      c.row(b, 1, 30, D(E));
      c.rect(23, b - 4, 28, b - 2, mix(E, 0.7));
      for (let x = 24; x < 28; x += 2) c.col(x, b - 4, b - 2, C.iron);
      c.set(4, 8, u ? GREENL : hex('#2c4a30'));
      c.speckle(1, b - 3, 30, b, C.rust, 9, 2);
      for (const [x, n] of [[9, 3], [17, 5]]) c.col(x, b - n, b, mix(C.rust, 0.9));
      if (u) {
        c.rect(1, -9, 30, 2, mix(E, 0.8));
        c.frame(1, -9, 30, 2, E);
        c.row(-9, 1, 30, C.white);
        c.rect(2, 3, 29, 5, FROST);
        c.row(3, 2, 29, C.white);
        c.rect(5, 3, 10, 4, hex('#8a6a58'));
        c.rect(18, 3, 25, 4, hex('#7a4a4a'));
        c.row(3, 18, 25, FROST);
        pat(c, 12, -1, ['f.f.f', 'f.f.f', 'fffff', 'fffff', '.fff.', '.fff.'], { f: hex('#a08f8c') });
        dots(c, hex('#7a6a6a'), [13, 2, 15, 2]);
        c.row(5, 1, 30, E);
        dots(c, C.white, [3, 6, 8, 7, 20, 6, 27, 7]);
      } else {
        c.rect(1, 3, 30, 5, C.white);
        c.row(5, 1, 30, D(E));
        c.rect(13, 5, 18, 5, C.steel);
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2,
        E = DIRTW;
      sideBox(c, 1, 5, 12, b, E);
      c.speckle(1, b - 3, 12, b, C.rust, 9, 2);
      if (u) {
        c.rect(1, -9, 2, 4, mix(E, 0.8));
        c.col(1, -9, 4, C.white);
        c.rect(3, 3, 11, 4, FROST);
        c.rect(8, 0, 9, 3, hex('#a9b0b4'));
      } else {
        c.rect(1, 3, 12, 5, C.white);
        c.row(5, 1, 12, D(E));
        c.set(13, 5, C.steel);
      }
    },
  });
  {
    const FRG = hex('#b5ae98');
    T('fridge-on-its-back', 'old fridge lying on its back cellar dumped door lid stagnant water', {
      w: 14, h: 14, solid: true, base: 'side', um: [0, 12, 0], sum: [0, 12, 0],
      sw: 40,
      s(c, u) {
        const b = c.h - 2;
        c.rect(1, 4, 37, b, FRG);
        c.col(1, 4, b, L(FRG));
        c.row(b, 1, 37, D(FRG));
        c.rect(38, 5, 38, 6, C.iron);
        c.rect(38, b - 2, 38, b - 1, C.iron);
        c.col(27, 4, b, D(FRG));
        c.speckle(1, 4, 37, b, C.rust, 16, 3);
        scribble(c, 5, 7, 10, 7, C.steel, 2);
        if (u) {
          c.rect(1, -10, 37, 2, mix(FRG, 0.85));
          c.frame(1, -10, 37, 2, FRG);
          for (const y of [-7, -3]) c.row(y, 3, 24, C.steel);
          c.col(26, -9, 1, D(FRG));
          c.rect(2, 3, 36, 4, VOID);
          c.row(4, 2, 36, hex('#3a4a40'));
          dots(c, hex('#5a6a52'), [6, 4, 14, 4, 22, 4, 31, 4]);
          pat(c, 16, 2, ['.hhh.', 'hhfhh', 'hhhhh'], { h: hex('#3a2c22'), f: hex('#a9b0b4') });
        } else {
          c.rect(1, 2, 37, 3, L(FRG));
          c.row(3, 1, 37, D(FRG));
          c.rect(29, 1, 33, 1, C.steel);
        }
      },
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 4, 12, b, FRG);
        c.col(1, 4, b, L(FRG));
        c.row(b, 1, 12, D(FRG));
        c.rect(3, 6, 10, b - 2, mix(FRG, 0.8));
        for (let y = 7; y < b - 2; y += 2) c.row(y, 4, 9, C.iron);
        c.speckle(1, 4, 12, b, C.rust, 14, 3);
        if (u) {
          c.rect(1, -10, 2, 2, mix(FRG, 0.85));
          c.col(1, -10, 2, FRG);
          c.rect(3, 3, 11, 3, VOID);
          c.row(4, 2, 11, hex('#3a4a40'));
          c.rect(6, 2, 8, 3, hex('#3a2c22'));
        } else {
          c.rect(1, 2, 12, 3, L(FRG));
          c.row(3, 1, 12, D(FRG));
        }
      },
    });
  }

  /* ---------- work ---------- */
  T('bench-vice-cellar', 'workbench with vice cellar hammer saw doll head clamped blood', {
    w: 36, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2,
        VB = hex('#34506a');
      c.rect(1, 10, 34, 12, C.woodLight);
      c.row(10, 1, 34, C.woodPale);
      c.row(12, 1, 34, C.wood);
      for (const x of [2, 30]) {
        c.rect(x, 13, x + 3, b, C.wood);
        c.col(x, 13, b, C.woodLight);
      }
      c.row(b - 4, 6, 29, C.wood);
      c.rect(8, b - 8, 11, b - 5, hex('#8a8e94'));
      c.row(b - 8, 8, 11, C.white);
      c.rect(14, b - 7, 20, b - 5, CARD);
      c.rect(23, b - 9, 25, b - 5, hex('#3f5f48'));
      c.rect(4, 6, 11, 9, VB);
      c.row(6, 4, 11, L(VB));
      c.rect(4, 3, 5, 5, C.iron);
      c.rect(10, 3, 11, 5, C.iron);
      c.col(8, 13, 17, C.steel);
      c.set(8, 18, C.black);
      c.rect(27, 6, 30, 9, mix(C.glassLight, 0.8));
      dots(c, C.iron, [28, 8, 29, 7, 28, 9, 29, 9]);
      if (u) {
        c.rect(6, 2, 9, 5, C.flesh);
        c.row(1, 6, 9, hex('#6a4a2a'));
        dots(c, DARK, [7, 3, 9, 3]);
        c.set(8, 5, C.blood);
        c.col(7, 10, 15, C.blood);
        c.set(6, 11, C.blood);
        c.set(7, b, C.blood);
        c.line(15, 9, 24, 8, C.steel);
        c.rect(22, 6, 24, 7, C.wood);
        dots(c, C.woodPale, [13, 9, 17, 9, 19, 9]);
      } else {
        c.rect(14, 8, 20, 9, C.wood);
        c.rect(20, 7, 22, 9, C.iron);
        c.poly([[15, 5], [24, 5], [24, 7], [15, 6]], C.steel);
        c.rect(24, 4, 26, 7, C.wood);
      }
    },
    sw: 16, sum: [0, 0, 0],
    s(c, u) {
      const b = c.h - 2,
        VB = hex('#34506a');
      c.rect(1, 10, 12, 12, C.woodLight);
      c.row(10, 1, 12, C.woodPale);
      c.row(12, 1, 12, C.wood);
      c.rect(2, 13, 4, b, C.wood);
      c.rect(9, 13, 11, b, C.wood);
      c.row(b - 4, 4, 9, C.wood);
      c.rect(6, 6, 11, 9, VB);
      c.rect(7, 3, 8, 5, C.iron);
      c.rect(u ? 11 : 9, 3, u ? 12 : 10, 5, C.iron);
      c.row(7, 12, 13, C.steel);
      c.col(14, 5, 9, C.steel);
      if (u) {
        c.rect(9, 2, 10, 5, C.flesh);
        c.row(1, 9, 10, hex('#6a4a2a'));
        c.col(12, 10, 14, C.blood);
      }
    },
  });
  {
    const PEG = hex('#9a7a52');
    const tool = {
      hammer: (c, x, y, ghost) => {
        c.rect(x, y, x + 4, y + 1, ghost || C.iron);
        c.rect(x + 2, y + 2, x + 2, y + 9, ghost || C.wood);
      },
      saw: (c, x, y, ghost) => {
        c.poly([[x, y + 2], [x + 10, y], [x + 10, y + 4]], ghost || C.steel);
        c.rect(x + 11, y, x + 13, y + 4, ghost || C.wood);
        if (!ghost) c.set(x + 12, y + 2, PEG);
      },
      spanner: (c, x, y) => {
        c.col(x + 1, y + 1, y + 8, C.steel);
        c.rect(x, y, x + 2, y, C.steel);
        c.set(x + 1, y, PEG);
        c.rect(x, y + 9, x + 2, y + 9, C.steel);
      },
      driver: (c, x, y) => {
        c.col(x, y, y + 4, C.steel);
        c.rect(x, y + 5, x, y + 8, hex('#8f3b30'));
      },
    };
    T('pegboard-tool-outlines', 'pegboard tools on the wall hammer saw spanner painted outlines missing', {
      w: 28, h: 26, shade: false,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 26, b, PEG);
        c.row(1, 1, 26, L(PEG));
        c.col(1, 1, b, L(PEG));
        c.col(26, 1, b, D(PEG));
        c.row(b, 1, 26, D(PEG));
        for (let y = 3; y < b; y += 3) for (let x = 3; x < 26; x += 3) c.set(x, y, D(PEG));
        const ghost = blend(PEG, C.white, 0.55);
        tool.saw(c, 4, 4, u ? ghost : null);
        tool.hammer(c, 4, 12, u ? ghost : null);
        tool.spanner(c, 12, 12);
        tool.driver(c, 17, 12);
        tool.driver(c, 20, 13);
        c.rect(22, 4, 24, 9, hex('#3f5f48'));
        c.set(23, 3, C.iron);
        if (u) {
          dots(c, C.iron, [6, 3, 12, 3, 6, 11]);
          dots(c, C.blood, [8, 16, 8, 18, 9, 21]);
        }
      },
      sw: 6,
      s(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 2, b, PEG);
        c.col(1, 1, b, L(PEG));
        if (!u) c.rect(3, 4, 3, 8, C.steel);
        if (!u) c.rect(3, 12, 4, 13, C.iron);
        c.col(3, 14, 20, C.steel);
        if (u) dots(c, C.iron, [3, 4, 3, 12]);
      },
    });
  }
  {
    const PAINT = [C.white, hex('#6a7a5e'), hex('#7a2a26'), hex('#3a4a66'), hex('#a08a3a')];
    const tin = (c, x, yb, col, tipped) => {
      if (tipped) {
        c.rect(x, yb - 3, x + 5, yb, hex('#8a8e94'));
        c.col(x + 5, yb - 3, yb, col);
        c.row(yb - 3, x, x + 4, C.white);
        return;
      }
      c.rect(x, yb - 4, x + 3, yb, hex('#8a8e94'));
      c.row(yb - 4, x, x + 3, col);
      c.col(x, yb - 3, yb, C.white);
      c.col(x + 2, yb - 3, yb - 1 - (x % 3), col);
      c.set(x + 1, yb - 5, C.iron);
      c.set(x + 2, yb - 5, C.iron);
    };
    T('paint-tins-shelf', 'shelf of paint tins pots brushes cellar spilled red paint dripping', {
      w: 26, h: 30, solid: true,
      f(c, u) {
        const b = c.h - 2;
        for (const x of [1, 23]) {
          c.rect(x, 1, x + 1, b, C.wood);
          c.col(x, 1, b, C.woodLight);
        }
        [9, 18, b - 1].forEach((y, r) => {
          c.rect(1, y, 24, y + 1, C.woodLight);
          c.row(y + 1, 1, 24, C.wood);
          for (let i = 0; i < 4; i++) {
            if (r === 0 && i === 3) continue;
            if (u && r === 1 && i === 1) tin(c, 8, y - 1, PAINT[2], true);
            else tin(c, 3 + i * 5, y - 1, PAINT[(r * 2 + i) % 5]);
          }
        });
        c.rect(19, 4, 21, 8, mix(C.glassLight, 0.8));
        c.col(19, 1, 4, C.wood);
        c.col(21, 2, 4, C.wood);
        c.set(19, 0, C.black);
        if (u) {
          c.rect(13, 17, 15, 17, PAINT[2]);
          c.col(14, 18, b, PAINT[2]);
          c.col(15, 18, 23, PAINT[2]);
          c.col(13, 18, 21, PAINT[2]);
          c.row(b, 11, 18, PAINT[2]);
          c.set(12, b - 1, PAINT[2]);
        }
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2;
        c.rect(2, 1, 7, b, mix(C.wood, 0.9));
        c.col(2, 1, b, C.woodLight);
        for (const y of [9, 18, b - 1]) {
          c.rect(1, y, 8, y + 1, C.woodLight);
          c.rect(3, y - 5, 6, y - 1, hex('#8a8e94'));
          c.row(y - 5, 3, 6, PAINT[(y + 1) % 5]);
        }
        if (u) {
          c.col(8, 18, b, PAINT[2]);
          c.row(b, 6, 8, PAINT[2]);
        }
      },
    });
  }

  /* ---------- kept ---------- */
  {
    const T1 = hex('#35503e'),
      T2 = hex('#6a4a38'),
      T3 = hex('#9a8058');
    T('trunk-stack-cellar', 'stack of trunks suitcases luggage cellar open case veil letters', {
      w: 26, h: 28, solid: true, um: [0, 6, 0], sum: [0, 6, 0],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 17, 24, b, T1);
        c.row(17, 1, 24, L(T1));
        c.col(1, 17, b, L(T1));
        for (const x of [6, 19]) c.col(x, 17, b, C.woodDark);
        for (const [x, y] of [[1, 17], [24, 17], [1, b], [24, b]]) c.set(x, y, C.brass);
        c.rect(11, 19, 14, 20, C.brass);
        c.row(21, 1, 24, D(T1));
        c.rect(3, 9, 22, 16, T2);
        c.row(9, 3, 22, L(T2));
        c.col(3, 9, 16, L(T2));
        c.row(12, 3, 22, D(T2));
        c.rect(10, 13, 15, 13, C.brass);
        dots(c, C.brass, [6, 12, 19, 12]);
        c.rect(5, 5, 19, 8, T3);
        c.col(5, 5, 8, L(T3));
        c.rect(15, 6, 17, 7, C.paper);
        c.set(7, 7, hex('#8f3b30'));
        if (u) {
          c.rect(5, -3, 19, 3, D(T3));
          c.frame(5, -3, 19, 3, T3);
          c.rect(6, 3, 18, 4, DARK);
          c.poly([[8, 4], [13, 2], [15, 4], [16, 9], [9, 10]], C.white);
          dots(c, C.ghost, [10, 5, 12, 7, 14, 8, 11, 9]);
          c.rect(6, 3, 8, 4, C.paper);
          c.row(3, 6, 8, C.wine);
        } else {
          c.rect(5, 3, 19, 4, T3);
          c.row(3, 5, 19, L(T3));
          c.row(5, 5, 19, D(T3));
          c.rect(11, 2, 13, 2, C.woodDark);
          cobweb(c, 20, 8, 1, -1, 4);
        }
      },
      sw: 16,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 17, 14, b, T1);
        c.rect(6, 20, 9, 21, C.woodDark);
        sideBox(c, 2, 9, 13, 16, T2);
        c.rect(6, 12, 9, 12, C.woodDark);
        sideBox(c, 3, 5, 11, 8, T3);
        if (u) {
          c.rect(3, -3, 4, 4, D(T3));
          c.rect(5, 3, 11, 4, DARK);
          c.poly([[8, 4], [11, 3], [12, 9], [9, 9]], C.white);
        } else {
          c.rect(3, 3, 11, 4, T3);
          c.row(3, 3, 11, L(T3));
        }
      },
    });
  }
  {
    const BK = hex('#6a3a34');
    T('bicycle-hung-wall', 'bicycle hung on the wall hooks old bike cellar front wheel off', {
      w: 32, h: 27, um: [0, 0, 0],
      f(c, u) {
        const b = c.h - 2;
        for (const x of [9, 22]) {
          c.col(x, 1, 5, C.iron);
          c.set(x + 1, 6, C.iron);
          c.set(x - 1, 1, C.iron);
        }
        ring(c, 7, 17, 5, TYRE, C.steel);
        c.line(7, 17, 11, 9, BK);
        c.line(11, 9, 22, 9, BK);
        c.row(8, 11, 22, L(BK));
        c.line(11, 9, 15, 17, BK);
        c.line(15, 17, 22, 9, BK);
        c.line(7, 17, 15, 17, BK);
        c.rect(14, 17, 16, 18, C.iron);
        c.col(11, 6, 8, C.iron);
        c.row(5, 9, 12, C.black);
        c.row(6, 20, 23, C.black);
        if (u) {
          c.line(22, 9, 24, 15, BK);
          c.set(24, 16, C.steel);
          c.oval(19, b - 2, 30, b, TYRE);
          c.row(b - 1, 21, 28, C.steel);
          c.row(b - 1, 24, 25, C.iron);
        } else {
          ring(c, 25, 17, 5, TYRE, C.steel);
          c.line(25, 17, 22, 7, BK);
          cobweb(c, 12, 10, 1, 1, 5);
        }
      },
      sw: 9,
      s(c, u) {
        const b = c.h - 2;
        c.col(2, 1, 5, C.iron);
        c.row(6, 2, 4, C.iron);
        if (u) {
          c.col(4, 8, 16, BK);
          c.row(6, 2, 7, C.black);
          c.rect(2, b - 1, 7, b, TYRE);
        } else {
          c.col(4, 12, 22, TYRE);
          c.col(5, 13, 21, C.steel);
          c.col(4, 7, 11, BK);
          c.row(6, 2, 7, C.black);
          c.rect(3, 4, 5, 5, C.black);
        }
      },
    });
  }
  T('sledge-wooden-upright', 'wooden sledge sled toboggan stood on end rope runners winter', {
    w: 12, h: 30, um: [0, 0, 18], sum: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2,
        W = C.woodLight;
      if (u) {
        c.row(b, 2, 24, C.iron);
        c.line(24, b, 27, b - 4, C.iron);
        c.line(25, b, 28, b - 4, W);
        c.rect(3, b - 6, 22, b - 5, W);
        c.row(b - 6, 3, 22, C.woodPale);
        for (const x of [5, 12, 19]) c.col(x, b - 4, b - 1, C.wood);
        c.line(27, b - 4, 22, b - 6, C.straw);
        c.row(b, 26, 29, C.straw);
        return;
      }
      for (const x of [2, 8]) {
        c.rect(x, 4, x + 1, b, W);
        c.col(x, 4, b, C.woodPale);
        c.col(x + 1, 4, b, C.iron);
      }
      c.line(2, 4, 4, 1, W);
      c.line(9, 4, 7, 1, W);
      for (let y = 8; y <= b - 4; y += 4) {
        c.rect(3, y, 8, y + 1, C.woodPale);
        c.row(y + 1, 3, 8, C.wood);
      }
      c.line(4, 2, 5, 6, C.straw);
      c.line(7, 2, 6, 6, C.straw);
      c.col(5, 6, 10, C.straw);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2,
        W = C.woodLight;
      if (u) {
        c.rect(1, b - 6, 12, b - 5, W);
        c.row(b - 6, 1, 12, C.woodPale);
        c.col(2, b - 4, b, C.wood);
        c.col(11, b - 4, b, C.wood);
        c.row(b, 1, 3, C.iron);
        c.row(b, 10, 12, C.iron);
        return;
      }
      c.line(2, 2, 5, b, C.iron);
      c.line(3, 2, 6, b, W);
      c.set(1, 1, W);
      c.line(4, 6, 6, b - 4, C.woodPale);
      c.line(5, 6, 6, 10, C.straw);
    },
  });
  T('skis-poles-leaning', 'old wooden skis and poles leaning winter sports fallen over', {
    w: 11, h: 44, um: [0, 0, 32], sum: [0, 0, 30],
    f(c, u) {
      const b = c.h - 2,
        SK = hex('#7a4a30');
      if (u) {
        c.rect(1, b - 1, 38, b, SK);
        c.row(b - 1, 1, 38, L(SK));
        c.line(38, b - 1, 41, b - 3, SK);
        c.rect(16, b - 2, 20, b - 2, C.steel);
        c.line(4, b - 6, 40, b - 1, SK);
        c.line(4, b - 7, 40, b - 2, L(SK));
        c.line(2, b - 3, 30, b - 9, C.iron);
        c.rect(6, b - 5, 6, b - 2, C.iron);
        c.set(31, b - 10, C.woodDark);
        return;
      }
      for (const x of [2, 5]) {
        c.rect(x, 3, x + 1, b, SK);
        c.col(x, 3, b, L(SK));
        c.set(x, 2, SK);
        c.set(x + (x === 2 ? 1 : 0), 1, SK);
        c.rect(x, 22, x + 1, 26, C.steel);
        c.rect(x, 10, x + 1, 11, hex('#8f3b30'));
      }
      c.col(8, 6, b, C.iron);
      c.col(9, 8, b, C.iron);
      c.rect(7, b - 4, 9, b - 4, C.woodDark);
      c.set(8, 5, C.woodDark);
      c.set(9, 7, C.woodDark);
      c.set(9, 6, C.straw);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2,
        SK = hex('#7a4a30');
      if (u) {
        c.rect(1, b - 1, 34, b, SK);
        c.row(b - 1, 1, 34, L(SK));
        c.line(34, b - 1, 36, b - 3, SK);
        c.line(3, b - 2, 28, b - 6, C.iron);
        return;
      }
      c.line(2, 3, 4, b, SK);
      c.line(3, 3, 5, b, L(SK));
      c.set(1, 1, SK);
      c.set(1, 2, SK);
      c.rect(4, 22, 5, 25, C.steel);
      c.line(4, 6, 6, b, C.iron);
      c.set(4, 5, C.woodDark);
    },
  });
  {
    const BULBS = [hex('#d0524a'), hex('#6fc070'), hex('#e0c060'), hex('#6a8ad0')];
    T('christmas-boxes-tinsel', 'christmas decorations boxes xmas tinsel baubles fairy lights cardboard', {
      w: 24, h: 24, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 12, 22, b, CARD);
        c.row(12, 1, 22, L(CARD));
        c.col(1, 12, b, L(CARD));
        c.col(22, 12, b, CARDD);
        txt(c, 4, 14, 'XMAS', hex('#7a2a26'));
        c.row(b - 1, 1, 22, CARDD);
        c.rect(4, 5, 19, 11, mix(CARD, 0.92));
        c.col(4, 5, 11, L(CARD));
        c.row(11, 4, 19, CARDD);
        c.col(11, 5, 11, CARDD);
        c.poly([[3, 5], [6, 2], [11, 4], [11, 5]], CARD);
        c.poly([[20, 5], [17, 2], [12, 4], [12, 5]], CARDD);
        for (let x = 6; x <= 17; x++) c.set(x, 4 - (x % 3 === 0 ? 1 : 0), x % 2 ? C.steel : hex('#5a7a5e'));
        c.set(14, 2, C.gold);
        c.set(14, 1, C.gold);
        c.rect(20, b - 2, 22, b, hex('#8f2a24'));
        c.set(21, b - 3, C.gold);
        c.set(20, b - 2, hex('#c0605a'));
        if (u) {
          pat(c, 8, 0, ['.yy.', 'ffff', 'ffff', 'wwww'], { y: C.gold, f: C.flesh, w: C.white });
          const path = [[6, 5], [5, 7], [4, 9], [3, 11], [2, 13], [1, 15], [3, 20], [6, 21], [9, b], [12, b - 1], [15, b], [18, b]];
          path.forEach(([x, y], i) => {
            c.set(x, y, BULBS[i % 4]);
            if (i % 3 === 0) c.set(x + 1, y, C.white);
          });
          c.line(1, 15, 3, 20, hex('#2f4a3c'));
        }
      },
      sw: 16,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 12, 14, b, CARD);
        c.col(7, 13, b, CARDD);
        sideBox(c, 3, 5, 12, 11, mix(CARD, 0.92));
        c.line(3, 5, 5, 2, CARD);
        c.line(12, 5, 10, 2, CARDD);
        for (let x = 5; x <= 10; x++) c.set(x, 4 - (x % 3 === 0 ? 1 : 0), x % 2 ? C.steel : hex('#5a7a5e'));
        if (u) [[11, 6], [12, 9], [13, 12], [14, 15], [14, 18], [15, b]].forEach(([x, y], i) => c.set(x, y, BULBS[i % 4]));
      },
    });
  }
  {
    const LINEN = hex('#a89878'),
      FOLD = blend(C.white, C.stone, 0.45);
    const sheet = (c, pts, b) => {
      c.poly(pts, C.white);
      const r = rnd(7);
      for (let x = 0; x < c.w; x++) {
        let t = 0;
        while (t < c.h && !c.get(x, t)) t++;
        if (t >= c.h) continue;
        if (r() < 0.3) c.col(x, t + 3, b, FOLD);
        if (r() < 0.3) c.clear(x, b);
      }
    };
    T('dress-dummy-sheet', 'dressmakers dummy under a dust sheet tailor form mannequin pins', {
      w: 16, h: 36, solid: true, um: [0, 0, 8], sum: [0, 0, 7],
      f(c, u) {
        const b = c.h - 2;
        c.line(7, b - 3, 3, b, C.woodDark);
        c.line(8, b - 3, 12, b, C.woodDark);
        if (u) {
          c.rect(7, 21, 8, b - 2, C.wood);
          c.poly([[4, 5], [11, 5], [12, 9], [10, 13], [11, 18], [10, 20], [5, 20], [4, 18], [5, 13], [3, 9]], LINEN);
          c.line(4, 5, 3, 9, L(LINEN));
          c.line(3, 9, 5, 13, L(LINEN));
          c.col(7, 6, 19, D(LINEN));
          c.row(20, 5, 10, D(LINEN));
          c.rect(6, 3, 9, 4, C.wood);
          c.rect(7, 1, 8, 2, C.woodDark);
          dots(c, C.steel, [5, 8, 9, 11, 6, 15, 10, 7]);
          c.rect(9, 8, 10, 9, C.blood);
          c.col(10, 10, 13, C.blood);
          c.poly([[13, b], [15, b - 4], [20, b - 3], [22, b]], C.white);
          c.line(15, b - 4, 20, b - 3, FOLD);
          c.set(18, b - 1, FOLD);
        } else {
          sheet(c, [[7, 1], [8, 1], [10, 4], [12, 6], [13, 12], [14, b - 2], [1, b - 2], [2, 12], [3, 6], [5, 4]], b - 2);
          c.line(5, 4, 3, 6, L(C.white));
          c.row(13, 4, 11, FOLD);
        }
      },
      sw: 13,
      s(c, u) {
        const b = c.h - 2;
        c.line(6, b - 3, 3, b, C.woodDark);
        c.line(6, b - 3, 9, b, C.woodDark);
        if (u) {
          c.rect(5, 21, 6, b - 2, C.wood);
          c.poly([[4, 5], [7, 5], [9, 8], [9, 10], [7, 13], [9, 17], [8, 20], [4, 20], [3, 17], [4, 13], [3, 9]], LINEN);
          c.line(4, 5, 3, 9, L(LINEN));
          c.rect(5, 3, 6, 4, C.wood);
          c.set(5, 2, C.woodDark);
          c.set(9, 9, C.blood);
          c.poly([[11, b], [12, b - 3], [16, b - 2], [17, b]], C.white);
        } else {
          sheet(c, [[5, 1], [6, 1], [8, 4], [10, 7], [11, b - 2], [1, b - 2], [2, 7], [4, 4]], b - 2);
          c.row(13, 3, 9, FOLD);
        }
      },
    });
  }
  {
    const PRAM = hex('#2a3046');
    T('pram-cellar-hood', 'old pram baby carriage hood spoked wheels cellar bundle inside', {
      w: 16, h: 28, solid: true, base: 'side',
      sw: 30,
      s(c, u) {
        const b = c.h - 2;
        ring(c, 8, b - 4, 4, TYRE, C.steel);
        ring(c, 20, b - 4, 4, TYRE, C.steel);
        c.line(8, b - 8, 20, b - 8, C.steel);
        c.line(6, b - 9, 8, b - 5, C.steel);
        c.line(22, b - 9, 20, b - 5, C.steel);
        c.poly([[3, 11], [24, 11], [22, 18], [6, 18]], PRAM);
        c.row(11, 3, 24, L(PRAM));
        c.row(14, 5, 23, C.bone);
        c.line(24, 11, 28, 6, C.steel);
        c.rect(27, 5, 28, 5, C.woodDark);
        if (u) {
          c.rect(3, 9, 8, 10, PRAM);
          c.row(9, 3, 8, L(PRAM));
          c.rect(10, 8, 19, 10, C.white);
          c.row(8, 11, 18, C.white);
          c.row(10, 10, 19, C.ash);
          c.rect(11, 6, 13, 8, hex('#a9b0b4'));
          dots(c, DARK, [11, 7, 13, 7]);
          c.row(5, 11, 13, C.white);
        } else {
          c.poly([[3, 11], [3, 6], [6, 3], [12, 3], [12, 5], [9, 6], [7, 11]], PRAM);
          c.line(3, 6, 6, 3, L(PRAM));
          c.row(3, 6, 12, L(PRAM));
          c.line(7, 11, 12, 4, C.steel);
          c.line(5, 11, 8, 4, D(PRAM));
          cobweb(c, 13, 5, 1, 1, 5);
        }
      },
      f(c, u) {
        const b = c.h - 2;
        c.rect(2, b - 8, 3, b, TYRE);
        c.rect(12, b - 8, 13, b, TYRE);
        c.row(b - 4, 4, 11, C.steel);
        c.rect(3, 11, 12, 18, PRAM);
        c.row(11, 3, 12, L(PRAM));
        c.col(3, 11, 18, L(PRAM));
        c.row(14, 4, 11, C.bone);
        c.clear(3, 18);
        c.clear(12, 18);
        if (u) {
          c.rect(3, 9, 12, 10, PRAM);
          c.rect(5, 7, 10, 10, C.white);
          c.rect(6, 5, 8, 7, hex('#a9b0b4'));
          dots(c, DARK, [6, 6, 8, 6]);
          c.row(4, 6, 8, C.white);
        } else {
          c.oval(2, 2, 13, 14, PRAM);
          c.rect(3, 11, 12, 14, PRAM);
          c.oval(4, 4, 11, 12, DARK);
          c.rect(4, 9, 11, 12, DARK);
          c.row(11, 3, 12, L(PRAM));
          c.row(14, 4, 11, C.bone);
        }
        c.row(6, 1, 14, C.woodDark);
        if (!u) c.row(6, 3, 12, PRAM);
      },
    });
  }
  {
    const RUGS = [hex('#6a3a40'), hex('#4f6470'), hex('#8a6a3a')];
    const roll = (c, x, y0, b, col) => {
      c.rect(x, y0 + 1, x + 4, b, col);
      c.col(x, y0 + 1, b, L(col));
      c.col(x + 4, y0 + 1, b, D(col));
      c.rect(x + 1, y0, x + 3, y0, C.parchment);
      c.set(x + 2, y0, col);
      for (const y of [y0 + 8, b - 8]) c.row(y, x, x + 4, C.straw);
      for (let i = x; i <= x + 4; i += 2) c.set(i, b, C.parchment);
    };
    T('carpets-rolled-leaning', 'rolled carpets rugs leaning in the corner unrolled stain hair', {
      w: 18, h: 42, solid: true, um: [0, 0, 24], sum: [0, 0, 24],
      f(c, u) {
        const b = c.h - 2;
        roll(c, 1, 3, b, RUGS[1]);
        roll(c, 11, 5, b, RUGS[2]);
        if (u) {
          c.rect(6, b - 1, 36, b, RUGS[0]);
          c.row(b - 1, 6, 36, L(RUGS[0]));
          for (let x = 8; x < 36; x += 4) c.set(x, b - 1, C.parchment);
          c.oval(35, b - 6, 40, b, RUGS[0]);
          c.oval(36, b - 5, 39, b - 1, C.parchment);
          c.set(37, b - 3, RUGS[0]);
          c.rect(18, b - 1, 27, b, hex('#3a1818'));
          c.row(b - 1, 20, 25, hex('#4a1a1a'));
          dots(c, hex('#2a2018'), [28, b - 2, 29, b - 3, 30, b - 2]);
        } else roll(c, 6, 1, b, RUGS[0]);
      },
      sw: 12,
      s(c, u) {
        const b = c.h - 2;
        for (const [dx, col] of [[0, RUGS[1]], [3, RUGS[2]]]) {
          c.poly([[1 + dx, 4], [4 + dx, 4], [8 + dx, b], [5 + dx, b]], col);
          c.line(1 + dx, 4, 5 + dx, b, L(col));
          c.row(3, 2 + dx, 3 + dx, C.parchment);
        }
        if (u) {
          c.rect(8, b - 1, 30, b, RUGS[0]);
          c.row(b - 1, 8, 30, L(RUGS[0]));
          c.oval(29, b - 6, 34, b, RUGS[0]);
          c.oval(30, b - 5, 33, b - 1, C.parchment);
          c.rect(14, b - 1, 21, b, hex('#3a1818'));
        }
      },
    });
  }
  {
    const STAIN = hex('#9a8a5c');
    const matt = (c, x0, b) => {
      c.rect(x0, 2, x0 + 21, b, TICK);
      stripes(c, x0, 3, x0 + 21, b - 1, hex('#8a94a0'), 3);
      c.frame(x0, 2, x0 + 21, b, D(TICK));
      c.clear(x0, 2);
      c.clear(x0 + 21, 2);
      for (let y = 7; y < b; y += 7) for (let x = x0 + 4; x < x0 + 20; x += 6) c.set(x, y, C.woodDark);
      c.oval(x0 + 5, 12, x0 + 14, 20, STAIN);
      c.oval(x0 + 7, 14, x0 + 12, 18, mix(STAIN, 0.8));
      c.oval(x0 + 12, 25, x0 + 17, 29, STAIN);
      c.line(x0 + 3, b - 6, x0 + 6, b - 3, hex('#4a3a2c'));
      c.set(x0 + 5, b - 5, C.white);
    };
    T('mattress-against-wall', 'stained mattress stood against the wall cellar hides a hole behind', {
      w: 26, h: 40, solid: true, um: [0, 0, 12], sum: [0, 0, 5],
      f(c, u) {
        const b = c.h - 2;
        if (u) {
          bricks(c, 1, b - 17, 15, b, hex('#5a3a34'));
          c.rect(3, b - 14, 13, b, VOID);
          c.rect(4, b - 15, 12, b - 15, VOID);
          dots(c, BRICKN, [4, b, 9, b, 16, b, 12, b - 1]);
          dots(c, C.bone, [5, b - 12, 6, b - 10, 5, b - 8]);
          matt(c, 15, b);
        } else matt(c, 2, b);
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2,
          dx = u ? 4 : 0;
        if (u) {
          c.rect(1, b - 17, 2, b, hex('#5a3a34'));
          c.rect(1, b - 14, 1, b, VOID);
          c.set(4, b, BRICKN);
        }
        c.poly([[2 + dx, 2], [4 + dx, 2], [8 + dx, b], [5 + dx, b]], TICK);
        c.line(2 + dx, 2, 5 + dx, b, D(TICK));
        c.line(4 + dx, 2, 8 + dx, b, hex('#8a94a0'));
        c.set(5 + dx, 15, STAIN);
        c.set(6 + dx, 22, STAIN);
      },
    });
  }
  {
    const KHAKI = hex('#6f6a48'),
      ARMY = hex('#5c5a54');
    T('camp-bed-folding', 'folding camp bed canvas cot army blanket cellar slept in', {
      w: 18, h: 16, solid: true, base: 'side',
      sw: 40,
      s(c, u) {
        const b = c.h - 2;
        for (const x of [6, 28]) {
          c.line(x, 8, x + 6, b, C.wood);
          c.line(x + 6, 8, x, b, C.woodDark);
        }
        c.rect(2, 7, 37, 8, KHAKI);
        c.row(7, 2, 37, L(KHAKI));
        c.row(9, 10, 28, D(KHAKI));
        c.rect(3, 4, 9, 6, TICK);
        stripes(c, 3, 4, 9, 6, hex('#8a94a0'), 2);
        c.row(6, 3, 9, D(TICK));
        if (u) {
          c.set(6, 5, D(TICK));
          c.set(7, 5, D(TICK));
          c.poly([[18, 6], [21, 3], [27, 2], [34, 5], [36, 8], [18, 8]], ARMY);
          c.line(18, 6, 21, 3, L(ARMY));
          c.line(21, 3, 27, 2, L(ARMY));
          c.line(24, 3, 22, 8, D(ARMY));
          c.line(30, 4, 31, 8, hex('#7a2a26'));
          c.rect(33, 9, 36, 12, ARMY);
          dots(c, D(KHAKI), [12, 7, 14, 8, 16, 7]);
        } else {
          c.rect(26, 4, 36, 6, ARMY);
          c.row(4, 26, 36, L(ARMY));
          c.row(5, 26, 36, D(ARMY));
          c.col(33, 4, 6, hex('#7a2a26'));
        }
      },
      f(c, u) {
        const b = c.h - 2;
        c.line(2, 8, 15, b, C.wood);
        c.line(15, 8, 2, b, C.woodDark);
        c.rect(2, 7, 15, 8, KHAKI);
        c.row(7, 2, 15, L(KHAKI));
        c.row(9, 5, 12, D(KHAKI));
        if (u) {
          c.poly([[3, 6], [6, 2], [12, 3], [14, 6]], ARMY);
          c.line(3, 6, 6, 2, L(ARMY));
          c.line(9, 3, 8, 6, hex('#7a2a26'));
          c.rect(13, 9, 15, 11, ARMY);
        } else {
          c.rect(3, 4, 14, 6, ARMY);
          c.row(4, 3, 14, L(ARMY));
          c.col(11, 4, 6, hex('#7a2a26'));
        }
      },
    });
  }

  /* ---------- plumbing and fuel ---------- */
  {
    const heater = (c, u) => {
      const b = c.h - 2,
        VERD = hex('#4f7a6a');
      bricks(c, 2, b - 3, 13, b, hex('#5a3a34'));
      c.rect(3, 7, 12, b - 4, COPPER);
      c.col(3, 7, b - 4, L(COPPER));
      c.col(4, 7, b - 4, L(COPPER));
      c.col(11, 7, b - 4, D(COPPER));
      c.row(6, 4, 11, COPPER);
      c.row(5, 5, 10, COPPER);
      c.row(5, 5, 7, L(COPPER));
      for (const y of [15, 27]) c.row(y, 3, 12, D(COPPER));
      c.rect(7, 1, 8, 4, D(COPPER));
      c.col(14, 10, b, D(COPPER));
      c.row(10, 13, 14, D(COPPER));
      c.rect(13, 22, 15, 23, hex('#8f2a24'));
      c.speckle(3, 6, 12, b - 4, VERD, 14, 4);
      dots(c, VERD, [7, 4, 14, 12, 14, 24]);
      c.rect(6, b - 9, 9, b - 7, DARK);
      if (u) {
        c.rect(6, b - 9, 9, b - 7, hex('#3a4a8a'));
        c.row(b - 7, 6, 9, hex('#6a8ad0'));
        dots(c, LAMP, [7, b - 9, 8, b - 8]);
        dots(c, WATERL, [14, 25, 14, 28, 14, 32]);
        c.row(b, 12, 15, WATER);
        smoke(c, 10, 3, 3, C.ash, 2);
      } else c.set(7, b - 8, C.iron);
    };
    T('water-heater-copper', 'copper water heater cylinder geyser boiler pipes pilot light verdigris', {
      w: 17, h: 42, solid: true,
      f: heater,
      sw: 17,
      s: flip(17, 42, heater),
    });
  }
  {
    const TK = hex('#3a4a3c'),
      OIL = hex('#1a1614');
    T('oil-tank-heating', 'heating oil tank on brick piers gauge cellar leaking puddle', {
      w: 42, h: 28, solid: true,
      f(c, u) {
        const b = c.h - 2;
        bricks(c, 5, 18, 12, b, hex('#5a3a34'));
        bricks(c, 29, 18, 36, b, hex('#5a3a34'));
        c.rect(2, 3, 39, 17, TK);
        for (const [x, y] of [[2, 3], [39, 3], [2, 17], [39, 17], [3, 3], [2, 4], [38, 3], [39, 4], [2, 16], [3, 17], [39, 16], [38, 17]]) c.clear(x, y);
        c.row(3, 4, 37, L(TK));
        c.row(4, 3, 38, L(TK));
        c.row(16, 3, 38, D(TK));
        c.row(17, 4, 37, D(TK));
        for (const x of [14, 27]) c.col(x, 3, 17, D(TK));
        c.rect(8, 1, 10, 2, C.iron);
        c.col(33, 0, 2, C.iron);
        c.rect(36, 5, 37, 15, mix(C.glassLight, 0.8));
        c.set(36, u ? 13 : 8, hex('#8f2a24'));
        c.set(37, u ? 13 : 8, hex('#8f2a24'));
        txt(c, 17, 7, 'OIL', blend(TK, C.bone, 0.55));
        c.speckle(3, 5, 35, 16, C.rust, 22, 4);
        for (const [x, n] of [[6, 4], [22, 6]]) c.col(x, 17 - n, 17, mix(C.rust, 0.85));
        c.rect(22, 18, 23, 20, C.brass);
        c.set(24, 19, hex('#8f2a24'));
        if (u) {
          c.col(22, 21, b, OIL);
          c.row(b, 13, 31, OIL);
          c.row(b - 1, 18, 27, OIL);
          dots(c, hex('#4a4a66'), [16, b, 21, b - 1, 26, b, 29, b]);
        } else c.set(22, 21, OIL);
      },
      sw: 18,
      s(c, u) {
        const b = c.h - 2;
        bricks(c, 4, 18, 13, b, hex('#5a3a34'));
        c.oval(2, 3, 15, 17, TK);
        c.oval(4, 5, 13, 15, mix(TK, 0.88));
        c.line(4, 6, 7, 4, L(TK));
        c.speckle(3, 4, 14, 16, C.rust, 14, 4);
        c.rect(8, 1, 9, 2, C.iron);
        if (u) {
          c.row(b, 9, 16, OIL);
          c.set(14, b - 1, OIL);
        }
      },
    });
  }
  {
    const pump = (c, u) => {
      const b = c.h - 2,
        PB = hex('#2f4f52');
      c.rect(1, b - 3, 18, b, CONCD);
      c.row(b - 3, 1, 18, CONC);
      c.rect(3, b - 2, 16, b - 1, u ? WATER : hex('#16222a'));
      if (u) dots(c, WATERL, [4, b - 2, 9, b - 2, 14, b - 2, 12, b - 1]);
      c.rect(6, 8, 12, b - 3, PB);
      c.col(6, 8, b - 3, L(PB));
      c.rect(5, 3, 13, 8, D(PB));
      for (let x = 6; x < 13; x += 2) c.col(x, 4, 7, PB);
      c.row(3, 5, 13, PB);
      c.set(9, 5, u ? REDL : hex('#5a2622'));
      c.rect(15, 1, 16, 12, C.ash);
      c.col(15, 1, 12, C.white);
      c.rect(13, 11, 16, 12, C.ash);
      c.row(6, 14, 17, C.stone);
      c.line(5, 4, 2, 1, DARK);
      c.set(1, 1, DARK);
      c.rect(2, u ? b - 5 : b - 3, 3, u ? b - 4 : b - 2, hex('#9a5a30'));
      c.line(4, u ? b - 5 : b - 3, 6, 10, C.iron);
      if (u) {
        dots(c, WATERL, [17, 5, 18, 4, 18, 7, 19, 6]);
        dots(c, WATER, [17, 7, 18, 9, 17, 12]);
      }
    };
    T('sump-pump-pipe', 'sump pump in a pit cellar flood pipe float switch water rising', {
      w: 20, h: 22, solid: true, um: [0, 0, 1], sum: [1, 0, 0],
      f: pump,
      sw: 20,
      s: flip(20, 22, pump),
    });
  }
  T('coal-chute-heap', 'coal chute hatch heap of coal cellar delivery hole light from the street', {
    w: 26, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 1, 19, 9, C.ironDark);
      c.frame(6, 1, 19, 9, C.iron);
      if (u) {
        c.rect(8, 3, 17, 8, hex('#5f7286'));
        c.rect(8, 3, 17, 4, hex('#8fa3b0'));
        c.rect(11, 5, 14, 8, hex('#2a2018'));
        c.row(8, 10, 15, hex('#3a2c22'));
      } else {
        c.rect(8, 3, 17, 8, C.iron);
        c.row(3, 8, 17, C.steel);
        c.rect(12, 6, 13, 6, C.steel);
        dots(c, C.rust, [9, 5, 16, 7]);
      }
      c.poly([[8, 10], [17, 10], [21, 21], [4, 21]], hex('#3a3c44'));
      c.line(8, 10, 4, 21, C.steel);
      c.line(17, 10, 21, 21, C.iron);
      if (u) {
        for (let y = 11; y <= 20; y += 2) c.row(y, 10, 15, hex('#4f5560'));
        dots(c, COAL, [11, 12, 14, 14, 10, 16, 13, 18, 15, 19, 9, 19]);
      }
      c.poly([[1, b], [4, 23], [9, u ? 18 : 20], [15, u ? 17 : 20], [21, 23], [24, b]], COAL);
      dots(c, C.slate, [5, 24, 10, 21, 14, 23, 18, 25, 8, 27, 20, 27, 12, 26, 3, 28]);
      dots(c, hex('#3a3842'), [7, 23, 16, 22, 11, 28, 22, 28]);
      dots(c, COAL, [0, b, 25, b]);
    },
    sw: 20,
    s(c, u) {
      const b = c.h - 2;
      bricks(c, 1, 1, 3, b, hex('#5a3a34'));
      c.rect(2, 2, 3, 9, u ? hex('#8fa3b0') : C.iron);
      c.poly([[4, 8], [5, 8], [14, 21], [11, 21]], hex('#3a3c44'));
      c.line(4, 8, 13, 21, C.steel);
      c.poly([[4, b], [6, 24], [11, u ? 18 : 20], [15, 23], [18, b]], COAL);
      dots(c, C.slate, [8, 24, 12, 22, 14, 26, 9, 27]);
      if (u) dots(c, COAL, [7, 11, 9, 15, 11, 17]);
    },
  });
  {
    const jug = (c, x, b, liq, blown) => {
      c.oval(x, 7, x + 6, b + 1, mix(C.glassLight, 0.75));
      c.clearRect(x, b + 1, x + 6, b + 1);
      c.oval(x + 1, 10, x + 5, b, liq);
      c.rect(x + 1, b - 1, x + 5, b, liq);
      c.col(x + 1, 9, b - 2, C.glassLight);
      c.rect(x + 2, 5, x + 4, 7, mix(C.glassLight, 0.75));
      if (blown) {
        c.rect(x + 1, 2, x + 5, 5, C.bone);
        dots(c, C.white, [x + 2, 1, x + 4, 2, x + 1, 3, x + 5, 4, x + 3, 0]);
        c.col(x + 5, 6, b, C.bone);
        c.col(x + 6, 9, b, C.white);
        c.col(x, 7, 12, C.bone);
      } else {
        c.rect(x + 2, 4, x + 4, 4, C.woodPale);
        c.col(x + 3, 1, 3, C.glassLight);
        c.set(x + 4, 1, C.glassLight);
      }
    };
    T('demijohns-home-brew', 'demijohns home brew wine glass jugs airlock fermenting foam blown bung', {
      w: 26, h: 18, solid: true, sum: [0, 0, 0],
      f(c, u) {
        const b = c.h - 2;
        jug(c, 1, b, hex('#8a6a2a'));
        jug(c, 9, b, hex('#6b2332'), u);
        jug(c, 17, b, hex('#a89a5a'));
        if (u) {
          c.row(b, 7, 18, C.bone);
          dots(c, C.white, [8, b, 16, b]);
          c.rect(21, b, 23, b, C.woodPale);
        }
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2;
        jug(c, 1, b, hex('#6b2332'), u);
        if (u) c.row(b, 1, 8, C.bone);
      },
    });
  }

  /* ---------- vermin and water ---------- */
  T('mouse-trap-cheese', 'mouse trap snap trap cheese bait sprung dead mouse', {
    w: 14, h: 8,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 12, b, C.woodPale);
      c.row(b, 1, 12, C.wood);
      if (u) {
        c.rect(6, b - 2, 7, b - 2, C.steel);
        c.col(8, b - 3, b - 2, C.steel);
        pat(c, 5, b - 5, ['..ee...', '.mmmm..', 'mmmmmm.', '.......'], { m: hex('#7a726a'), e: hex('#8a827a') });
        c.set(4, b - 3, hex('#b08a84'));
        c.line(11, b - 3, 13, b - 5, hex('#b08a84'));
        c.set(7, b - 2, C.blood);
      } else {
        c.rect(2, b - 3, 2, b - 2, C.steel);
        c.row(b - 4, 2, 6, C.steel);
        c.col(6, b - 4, b - 2, C.steel);
        c.rect(9, b - 3, 11, b - 2, hex('#c9a04a'));
        c.set(10, b - 3, hex('#8a6a2a'));
        c.set(9, b - 4, hex('#c9a04a'));
      }
    },
    sw: 9,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 1, 7, b, C.woodPale);
      c.row(b, 1, 7, C.wood);
      if (u) {
        c.oval(2, b - 5, 6, b - 2, hex('#7a726a'));
        c.row(b - 3, 1, 7, C.steel);
        c.line(6, b - 4, 8, b - 6, hex('#b08a84'));
      } else {
        c.row(b - 4, 2, 6, C.steel);
        c.col(2, b - 4, b - 2, C.steel);
        c.col(6, b - 4, b - 2, C.steel);
        c.rect(3, b - 3, 5, b - 2, hex('#c9a04a'));
      }
    },
  });
  {
    const PEL = hex('#3f8a84');
    const rat = (c, x, b) => {
      pat(c, x, b - 3, ['.p..p...', 'rrrrrr..', 'rrrrrrr.', '.rrrrr.t'], { r: hex('#6a625a'), p: hex('#b08a84'), t: hex('#b08a84') });
      c.set(x + 8, b - 1, hex('#b08a84'));
      c.set(x + 6, b - 2, DARK);
    };
    T('rat-poison-box', 'rat poison box skull label pellets cellar dead rat', {
      w: 12, h: 12, um: [0, 0, 12], sum: [0, 0, 10],
      f(c, u) {
        const b = c.h - 2,
          BX = hex('#a08a3a');
        if (u) {
          c.rect(1, b - 5, 9, b, BX);
          c.row(b - 5, 1, 9, L(BX));
          c.rect(2, b - 4, 6, b - 1, hex('#7a2a26'));
          pat(c, 3, b - 4, ['www', 'kwk', '.w.'], { w: C.white, k: DARK });
          c.rect(10, b - 4, 10, b, DARK);
          dots(c, PEL, [11, b, 13, b, 12, b - 1, 22, b]);
          rat(c, 13, b);
          return;
        }
        c.rect(2, 2, 9, b, BX);
        c.row(2, 2, 9, L(BX));
        c.col(2, 2, b, L(BX));
        c.rect(3, 4, 8, 8, hex('#7a2a26'));
        pat(c, 4, 4, ['.ww.', 'wwww', 'kwwk', '.ww.', 'w..w'], { w: C.white, k: DARK });
        c.row(b - 1, 3, 8, D(BX));
        dots(c, PEL, [10, b, 1, b]);
      },
      sw: 9,
      s(c, u) {
        const b = c.h - 2,
          BX = hex('#a08a3a');
        if (u) {
          c.rect(1, b - 5, 6, b, mix(BX, 0.88));
          c.row(b - 5, 1, 6, BX);
          dots(c, PEL, [8, b, 9, b - 1]);
          rat(c, 9, b);
          return;
        }
        sideBox(c, 2, 2, 6, b, BX);
        c.set(7, b, PEL);
      },
    });
  }
  {
    const sack = (c, x, y, w = 10) => {
      c.rect(x, y, x + w - 1, y + 3, HESS);
      c.clear(x, y);
      c.clear(x + w - 1, y);
      c.clear(x, y + 3);
      c.clear(x + w - 1, y + 3);
      c.row(y, x + 1, x + w - 2, L(HESS));
      c.row(y + 3, x + 1, x + w - 2, D(HESS));
      c.set(x + w - 2, y + 1, D(HESS));
      c.set(x + 3, y + 2, D(HESS));
    };
    T('sandbags-wall-cellar', 'sandbags wall flood defence hessian sacks cellar split sand seeping water', {
      w: 36, h: 18, solid: true,
      f(c, u) {
        const b = c.h - 2,
          SAND = hex('#b5a47c');
        for (let i = 0; i < 3; i++) sack(c, 2 + i * 11, b - 3);
        for (let i = 0; i < 3; i++) sack(c, (i ? 1 : 2) + i * 11 - (i ? 5 : 0) + (i ? 5 : 0), b - 7, i === 0 ? 9 : 10);
        sack(c, 6, b - 11);
        sack(c, 18, b - 11);
        sack(c, 12, b - 15);
        c.row(b, 2, 33, mix(HESS, 0.6));
        if (u) {
          c.rect(20, b - 6, 22, b - 4, DARK);
          c.poly([[21, b - 4], [17, b], [26, b]], SAND);
          c.col(21, b - 5, b, L(SAND));
          dots(c, L(SAND), [19, b - 1, 23, b - 1]);
          c.row(b, 0, 9, WATER);
          c.row(b - 1, 2, 6, WATER);
          dots(c, WATERL, [3, b, 7, b]);
          for (const x of [3, 8, 14]) c.set(x, b - 2, mix(HESS, 0.6));
        }
      },
      sw: 14,
      s(c, u) {
        const b = c.h - 2;
        sack(c, 2, b - 3);
        sack(c, 1, b - 7);
        sack(c, 2, b - 11, 9);
        sack(c, 3, b - 15, 8);
        if (u) {
          c.row(b, 9, 12, WATER);
          c.set(11, b - 1, hex('#b5a47c'));
          c.row(b, 12, 12, hex('#b5a47c'));
        }
      },
    });
  }
  T('cellar-door-chain-padlock', 'cellar door chained padlock plank door locked chain cut ajar darkness', {
    w: 22, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 20, b, C.stoneDark);
      c.row(1, 1, 20, C.stone);
      planks(c, 3, 3, 18, b, C.woodDark, 4);
      for (const y of [8, b - 8]) {
        c.rect(3, y, 14, y + 1, C.iron);
        c.row(y, 3, 14, L(C.iron));
      }
      c.row(b, 3, 18, VOID);
      if (u) {
        c.rect(15, 3, 18, b, VOID);
        c.col(14, 3, b, C.wood);
        for (let y = 19; y <= 30; y++) c.set(3, y, y % 2 ? C.steel : C.iron);
        c.set(2, 19, C.iron);
        c.rect(7, b - 2, 10, b, C.brass);
        c.rect(8, b - 4, 9, b - 3, C.steel);
        c.set(8, b - 1, DARK);
        dots(c, C.steel, [5, b, 12, b]);
        c.set(19, 21, C.iron);
      } else {
        for (let x = 2; x <= 19; x++) c.set(x, 19 + Math.round((x - 2) * 0.15), x % 2 ? C.steel : C.iron);
        for (let x = 2; x <= 19; x++) c.set(x, 20 + Math.round((x - 2) * 0.15), x % 2 ? C.iron : C.ironDark);
        c.rect(9, 21, 12, 25, C.brass);
        c.row(21, 9, 12, L(C.brass));
        c.rect(10, 19, 11, 20, C.steel);
        c.set(10, 23, DARK);
        c.set(17, 20, C.iron);
      }
    },
    sw: 7,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 1, 1, 4, b, C.stoneDark);
      c.col(4, 3, b, C.woodDark);
      if (u) {
        for (let y = 19; y <= 30; y++) c.set(5, y, y % 2 ? C.steel : C.iron);
        c.rect(5, b - 1, 6, b, C.brass);
      } else {
        c.rect(5, 19, 5, 20, C.steel);
        c.rect(5, 21, 6, 25, C.brass);
      }
    },
  });
};
