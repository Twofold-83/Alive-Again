/* env-urban: back alleys, shops and yards. Part of tools/big/env-city.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, txt, scribble, wheel, ring } = X;
  const { bricks, planks, hazard, tins, bottles, litter, flame, smoke, pool } = X;
  const { TYRE, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, BLUEL, CARD, CARDD, BAG, DIRTW, WATER, WATERL, SMOKE, POLE, DARK } = X;
  setCat('env-urban', 'Urban');

  const WARM = hex('#6e5a2e'), // a lit room seen from the dark
    DUMP = hex('#3a4a5e'),
    BRICK = hex('#6a4038'),
    LEATHER = hex('#7a2b26'),
    CLOTH = [hex('#7a4a5a'), hex('#4f6470'), hex('#8a8a70'), hex('#5a6a4a'), hex('#8a5a3a'), hex('#3a3a4e'), hex('#9a8f80')];
  const bag = (c, x0, y0, x1, y1, knot = true) => {
    c.oval(x0, y0, x1, y1 + 2, BAG);
    c.clearRect(x0, y1 + 1, x1, y1 + 2);
    c.row(y1, x0 + 1, x1 - 1, BAG);
    const m = (x0 + x1) >> 1;
    if (knot) {
      c.set(m, y0 - 1, BAG);
      c.set(m + 1, y0 - 2, BAG);
    }
    c.line(x0 + 2, y0 + 2, x0 + 1, y0 + 4, hex('#4a4852'));
  };
  const eyes = (c, x, y, gap = 3) => {
    c.set(x, y, C.white);
    c.set(x + gap, y, C.white);
  };

  /* ---------- the alley ---------- */
  T('dumpster-alley-lidded', 'dumpster skip bin alley rubbish container lid arm hanging out', {
    w: 36, h: 24, solid: true, um: [0, 8, 0], sum: [0, 8, 0],
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 7], [33, 7], [31, b - 1], [4, b - 1]], DUMP);
      c.line(2, 7, 4, b - 1, L(DUMP));
      c.row(7, 2, 33, L(DUMP));
      for (const x of [10, 18, 26]) c.col(x, 9, b - 2, D(DUMP));
      c.rect(1, 10, 3, 13, D(DUMP));
      c.rect(32, 10, 34, 13, D(DUMP));
      c.speckle(3, 8, 32, b - 1, C.rust, 26, 3);
      scribble(c, 12, 12, 16, 14, C.bone, 3);
      for (const [x, y, n] of [[7, 9, 5], [22, 9, 7], [29, 9, 4]]) c.col(x, y, y + n, mix(DUMP, 0.6));
      c.rect(5, b, 7, b, TYRE);
      c.rect(28, b, 30, b, TYRE);
      if (u) {
        c.rect(1, -5, 17, 5, D(DUMP));
        c.row(-5, 1, 17, DUMP);
        c.rect(2, -3, 16, 4, mix(DUMP, 0.5));
        c.rect(18, 4, 34, 6, D(DUMP));
        c.row(4, 18, 34, DUMP);
        c.rect(2, 5, 17, 6, DARK);
        bag(c, 3, 2, 9, 6, true);
        c.row(7, 2, 17, L(DUMP));
        c.rect(12, 5, 13, 9, hex('#3a3a4e'));
        c.rect(12, 10, 13, 11, C.flesh);
        c.set(12, 12, C.flesh);
      } else {
        c.rect(1, 4, 34, 6, D(DUMP));
        c.row(4, 1, 34, DUMP);
        c.col(17, 4, 6, mix(DUMP, 0.5));
        c.row(3, 6, 10, D(DUMP));
        c.row(3, 24, 28, D(DUMP));
      }
    },
    sw: 20,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 7], [17, 7], [15, b - 1], [2, b - 1]], mix(DUMP, 0.88));
      c.col(2, 7, b - 1, DUMP);
      c.row(7, 2, 17, DUMP);
      c.rect(6, 10, 12, 13, D(DUMP));
      c.speckle(3, 8, 16, b - 1, C.rust, 26, 3);
      c.rect(3, b, 5, b, TYRE);
      c.rect(12, b, 14, b, TYRE);
      if (u) {
        c.rect(1, -5, 3, 6, D(DUMP));
        c.col(1, -5, 6, DUMP);
        c.rect(4, 5, 17, 6, DARK);
        bag(c, 6, 2, 12, 6, true);
        c.row(7, 2, 17, DUMP);
        c.rect(16, 6, 17, 9, hex('#3a3a4e'));
        c.rect(16, 10, 17, 11, C.flesh);
      } else {
        c.poly([[1, 3], [18, 5], [18, 6], [1, 6]], D(DUMP));
        c.line(1, 3, 18, 5, DUMP);
      }
    },
  });
  T('fire-escape-drop-ladder', 'fire escape bottom landing drop ladder iron balcony alley', {
    w: 24, h: 62, solid: true,
    f(c, u) {
      const b = c.h - 2,
        I = hex('#2c2f36');
      c.rect(1, 12, 22, 14, I);
      c.row(12, 1, 22, C.iron);
      for (let x = 2; x <= 22; x += 2) c.set(x, 13, DARK);
      for (let x = 1; x <= 22; x += 3) c.col(x, 2, 11, I);
      c.row(2, 1, 22, C.iron);
      c.row(7, 1, 22, I);
      c.line(1, 15, 5, 20, I);
      c.line(22, 15, 18, 20, I);
      const end = u ? b : 38;
      for (const x of [8, 15]) {
        c.col(x, 9, end, C.iron);
        c.set(x, 8, C.steel);
      }
      for (let y = 17; y <= end - 1; y += 3) c.row(y, 9, 14, I);
      if (!u) {
        c.rect(7, 38, 16, 39, I);
        dots(c, C.rust, [8, 40, 15, 40]);
      } else c.rect(7, 15, 16, 16, I);
      c.speckle(1, 2, 22, b, C.rust, 30, 5);
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2,
        I = hex('#2c2f36');
      c.rect(1, 12, 9, 14, I);
      c.row(12, 1, 9, C.iron);
      for (const x of [1, 5, 9]) c.col(x, 2, 11, I);
      c.row(2, 1, 9, C.iron);
      c.row(7, 1, 9, I);
      c.line(1, 15, 5, 20, I);
      const end = u ? b : 38;
      c.rect(9, 9, 10, end, C.iron);
      for (let y = 17; y <= end - 1; y += 3) c.set(8, y, I);
      c.speckle(1, 2, 10, b, C.rust, 30, 5);
    },
  });
  T('shutter-roller-graffiti', 'steel roller shutter shop front closed graffiti padlock half open', {
    w: 36, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2,
        end = u ? 20 : b;
      if (u) {
        c.rect(3, 21, 32, b, hex('#121016'));
        c.row(b, 3, 32, hex('#2a2620'));
        c.rect(5, b - 6, 12, b - 1, hex('#2a2620'));
        c.rect(7, b - 10, 13, b - 7, hex('#221e1a'));
        c.rect(21, 25, 27, b - 1, WARM);
        c.rect(23, 28, 25, b - 1, DARK);
        c.rect(23, 26, 25, 28, DARK);
        c.set(22, 30, DARK);
        c.set(26, 30, DARK);
      }
      for (let y = 6; y <= end; y++) c.row(y, 3, 32, y % 2 ? C.steel : mix(C.steel, 0.72));
      c.rect(1, 1, 34, 5, C.ironDark);
      c.row(1, 1, 34, C.iron);
      for (const x of [1, 33]) {
        c.rect(x, 6, x + 1, b, C.iron);
        c.col(x, 6, b, L(C.iron));
      }
      if (u) {
        c.row(end, 3, 32, C.iron);
        scribble(c, 6, 10, 20, 14, C.plum, 5);
      } else {
        scribble(c, 6, 14, 20, 20, C.plum, 5);
        txt(c, 9, 22, 'KEV', hex('#3f6a6a'), { k: 2 });
        c.line(8, 34, 30, 32, hex('#3f6a6a'));
        for (const [x, y, n] of [[10, 32, 4], [17, 32, 6], [28, 32, 3]]) c.col(x, y, y + n, hex('#3f6a6a'));
        c.rect(17, b - 2, 18, b - 1, C.brass);
        c.row(b, 3, 32, C.iron);
      }
      c.speckle(3, 6, 32, end, C.rust, 60, 2);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 6, 5, C.ironDark);
      c.row(1, 1, 6, C.iron);
      c.rect(2, 6, 3, b, C.iron);
      c.col(2, 6, b, L(C.iron));
      c.col(4, 6, u ? 20 : b, mix(C.steel, 0.8));
      if (u) c.set(5, b - 1, WARM);
      if (u) c.set(5, b - 3, WARM);
    },
  });

  /* ---------- neon ---------- */
  const NR = hex('#e0524a'),
    NP = hex('#d76a9a'),
    NC = hex('#6fd0c8'),
    NG = hex('#74c66a'),
    NY = hex('#e6cf6a'),
    BOARD = hex('#1a1820');
  const off = (col) => mix(blend(col, C.stone, 0.65), 0.55);
  const board = (c) => {
    c.rect(1, 1, c.w - 2, c.h - 2, BOARD);
    c.frame(1, 1, c.w - 2, c.h - 2, C.ironDark);
  };
  /** A neon sign from the side: the board edge-on, a bracket to the wall, the tubes standing proud. */
  const neonSide = (col, lit) => (c, u) => {
    const b = c.h - 2,
      on = lit(u);
    c.rect(2, 1, 3, b, C.ironDark);
    c.col(2, 1, b, C.iron);
    c.row(3, 1, 1, C.iron);
    c.set(1, 3, C.iron);
    c.set(1, b - 2, C.iron);
    for (let y = 3; y <= b - 2; y += 2) c.set(4, y, on ? col : off(col));
    if (on) for (let y = 3; y <= b - 2; y += 4) c.set(5, y, L(col));
  };
  T('neon-sign-bar', 'neon sign bar red glowing tubes pub night', {
    w: 28, h: 16,
    f(c, u) {
      board(c);
      txt(c, 3, 3, 'BAR', u ? off(NR) : NR, { k: 2 });
      if (!u) txt(c, 3, 3, 'BAR', L(NR), { k: 2, only: () => false });
      if (!u) for (const [x, y] of [[3, 3], [11, 3], [19, 3], [3, 8], [11, 8], [19, 8]]) c.set(x, y, C.white);
    },
    sw: 7,
    s: neonSide(NR, (u) => !u),
  });
  T('neon-sign-hotel', 'neon sign hotel pink flickering letters dead tube night', {
    w: 44, h: 16,
    f(c, u) {
      board(c);
      txt(c, 3, 3, 'HOTEL', (i) => (u && i === 3 ? off(NP) : NP), { k: 2 });
      for (const [x, y, i] of [[3, 3, 0], [11, 3, 1], [19, 3, 2], [27, 3, 3], [35, 3, 4], [3, 9, 0], [35, 9, 4]]) if (!(u && i === 3)) c.set(x, y, C.white);
    },
    sw: 7,
    s: neonSide(NP, () => true),
  });
  T('neon-sign-open', 'neon sign open shop window blue red switched on', {
    w: 27, h: 14,
    f(c, u) {
      board(c);
      const ringc = u ? NC : off(NC),
        t = u ? NR : off(NR);
      for (let a = 0; a < 64; a++) c.set(13 + Math.cos((a * Math.PI) / 32) * 10.4, 6.5 + Math.sin((a * Math.PI) / 32) * 4.4, ringc);
      txt(c, 6, 4, 'OPEN', t);
      if (u) dots(c, C.white, [6, 4, 10, 4, 14, 4, 18, 4, 4, 4, 22, 9]);
    },
    sw: 7,
    s: neonSide(NC, (u) => u),
  });
  T('neon-sign-arrow', 'neon sign arrow pointing this way yellow chevrons switched on', {
    w: 28, h: 13,
    f(c, u) {
      board(c);
      const col = u ? NY : off(NY);
      c.rect(3, 5, 17, 7, col);
      c.poly([[17, 2], [25, 6], [17, 10]], col);
      c.rect(4, 6, 16, 6, BOARD);
      c.poly([[18, 4], [22, 6], [18, 8]], BOARD);
      if (u) dots(c, C.white, [3, 5, 10, 5, 17, 2, 24, 6]);
    },
    sw: 7,
    s: neonSide(NY, (u) => u),
  });
  T('neon-sign-cross', 'neon sign green cross pharmacy chemist glowing', {
    w: 15, h: 15,
    f(c, u) {
      board(c);
      const col = u ? off(NG) : NG;
      c.rect(5, 2, 9, 12, col);
      c.rect(2, 5, 12, 9, col);
      c.rect(6, 3, 8, 11, BOARD);
      c.rect(3, 6, 11, 8, BOARD);
      if (!u) dots(c, C.white, [5, 2, 2, 5, 12, 9, 9, 12]);
      if (!u) c.rect(7, 6, 7, 8, mix(NG, 0.45));
      if (!u) c.row(7, 6, 8, mix(NG, 0.45));
    },
    sw: 7,
    s: neonSide(NG, (u) => !u),
  });

  /* ---------- shops ---------- */
  {
    const CT = hex('#6a5a48');
    T('shop-counter-till', 'shop counter cash register till corner shop sweets jar drawer open', {
      w: 36, h: 22, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 9, 34, b, CT);
        c.col(1, 9, b, L(CT));
        for (const x of [3, 14, 25]) panel(c, x, 11, x + 8, b - 2, CT);
        c.rect(1, 7, 34, 8, L(CT));
        c.row(8, 1, 34, D(CT));
        c.rect(22, 2, 31, 6, hex('#2a2a36'));
        c.row(2, 23, 30, C.slate);
        c.rect(23, 3, 26, 4, u ? hex('#7fae7a') : hex('#2c4a30'));
        for (const x of [28, 30]) for (const y of [3, 5]) c.set(x, y, C.bone);
        c.rect(4, 2, 7, 6, mix(C.glassLight, 0.8));
        c.row(1, 4, 7, C.red);
        dots(c, hex('#b0703a'), [5, 4, 6, 5, 5, 6]);
        dots(c, hex('#8f3b30'), [6, 3, 4, 5]);
        c.rect(11, 5, 17, 6, C.paper);
        c.row(5, 11, 17, C.black);
        if (u) {
          c.rect(22, 7, 31, 9, C.steel);
          c.rect(23, 8, 30, 8, DARK);
          dots(c, C.brass, [24, 8, 27, 8]);
          c.set(29, 8, hex('#7a8a6a'));
        }
      },
      sw: 14, sum: [0, 0, 2],
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 2, 9, 10, b, CT);
        c.rect(1, 7, 12, 8, L(CT));
        c.row(8, 1, 12, D(CT));
        c.poly([[4, 6], [4, 2], [8, 2], [10, 5], [10, 6]], hex('#2a2a36'));
        c.set(9, 4, C.bone);
        if (u) {
          c.rect(11, 6, 14, 7, C.steel);
          c.set(13, 6, C.brass);
        }
      },
    });
  }
  {
    const SH = hex('#8a8880');
    T('shelves-tinned-food', 'shop shelves tins tinned food cans groceries corner shop looted', {
      w: 28, h: 38, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 26, b, mix(SH, 0.55));
        c.rect(1, 1, 26, 2, SH);
        c.col(1, 1, b, SH);
        c.col(26, 1, b, D(SH));
        [10, 19, 28, b].forEach((y, i) => {
          c.rect(1, y, 26, y, L(SH));
          tins(c, 3, 24, y - 1, 6, i * 7 + 3, u ? [0.7, 0.25, 0.5, 0.15][i] : 0.95);
          if (y < b) dots(c, C.paper, [5, y, 12, y, 19, y]);
        });
        if (u) {
          c.rect(20, b - 2, 22, b, X.TINS[0]);
          c.rect(14, b - 1, 17, b, X.TINS[4]);
          c.set(14, b - 1, L(X.TINS[4]));
        }
      },
      sw: 10, sum: [0, 0, 5],
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 1, 6, b, SH);
        [10, 19, 28, b].forEach((y, i) => {
          c.rect(7, y, 8, y, L(SH));
          if (!u || i % 2 === 0) c.rect(7, y - 5, 8, y - 1, X.TINS[i]);
        });
        if (u) {
          c.rect(10, b - 1, 13, b, X.TINS[4]);
        }
      },
    });
  }
  {
    const FR = hex('#24252e'),
      COLD = hex('#6f8f98');
    T('drinks-fridge-glass', 'drinks fridge glass door shop cooler bottles cans lit cold', {
      w: 18, h: 38, solid: true, um: [0, 0, 6], sum: [0, 0, 9],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 16, b, FR);
        c.col(1, 1, b, C.iron);
        c.rect(2, 2, 15, 6, hex('#7a2a2c'));
        txt(c, 4, 2, 'ICE', C.bone);
        c.rect(2, 8, 15, b - 4, u ? L(COLD) : COLD);
        [15, 22, 29].forEach((y, i) => {
          c.row(y, 2, 15, C.steel);
          bottles(c, 3, 14, y - 1, 6, i + 2, u ? 0.45 : 1);
        });
        bottles(c, 3, 14, b - 5, 5, 9, u ? 0.3 : 0.9);
        for (let x = 3; x < 15; x += 2) c.set(x, b - 2, C.iron);
        if (u) {
          c.rect(17, 8, 21, b - 4, mix(C.glassLight, 0.85));
          c.frame(17, 8, 21, b - 4, C.steel);
          c.line(18, 14, 20, 10, C.white);
          dots(c, C.white, [4, b - 4, 9, b - 4, 13, b - 5, 7, b - 3]);
        } else {
          c.col(14, 12, 24, C.steel);
          c.line(4, 13, 7, 9, C.glassLight);
          c.frame(2, 8, 15, b - 4, C.iron);
        }
      },
      sw: 12,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 1, 9, b, FR);
        c.col(1, 1, b, C.iron);
        if (u) {
          c.col(10, 8, b - 4, L(COLD));
          c.rect(11, 8, 19, b - 4, mix(C.glassLight, 0.85));
          c.frame(11, 8, 19, b - 4, C.steel);
          c.line(13, 16, 16, 11, C.white);
          c.col(18, 14, 24, C.iron);
        } else {
          c.col(10, 8, b - 4, C.steel);
          c.set(11, 18, C.steel);
        }
      },
    });
  }
  {
    const mag = (c, x, y, i) => {
      const col = CLOTH[i % CLOTH.length];
      c.rect(x, y, x + 3, y + 5, col);
      c.row(y, x, x + 3, i % 2 ? C.bone : C.red);
      c.rect(x + 1, y + 2, x + 2, y + 3, i % 3 ? C.flesh : C.bone);
    };
    T('magazine-rack-shop', 'magazine rack newsagent comics papers wire stand', {
      w: 22, h: 30, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 20, b - 2, hex('#2a2a36'));
        c.col(1, 1, b - 2, C.iron);
        for (let r = 0; r < 4; r++) {
          const y = 2 + r * 6;
          c.row(y + 5, 1, 20, C.iron);
          for (let i = 0; i < 4; i++) if (!u || (r * 4 + i) % 3 !== 1) mag(c, 2 + i * 5, y, r * 4 + i);
        }
        legs(c, [2, 18], b - 1, b, C.iron, 2);
        if (u) {
          c.rect(8, b - 1, 14, b, C.paper);
          c.col(11, b - 1, b, C.slate);
          c.rect(9, b - 1, 10, b - 1, hex('#7a4a5a'));
          c.set(13, b, C.slate);
        }
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2;
        c.poly([[2, 1], [4, 1], [8, b - 2], [2, b - 2]], hex('#2a2a36'));
        c.col(2, 1, b - 2, C.iron);
        for (let r = 0; r < 4; r++) {
          const y = 2 + r * 6;
          if (!u || r % 2) c.line(4 + r, y, 5 + r, y + 5, CLOTH[r]);
          c.set(5 + r, y + 5, C.iron);
          c.set(6 + r, y + 5, C.iron);
        }
        c.rect(2, b - 1, 8, b, C.iron);
      },
    });
  }
  {
    const FM = hex('#4a2f5a');
    T('fruit-machine-pub', 'fruit machine slot machine one armed bandit gambling jackpot lights', {
      w: 16, h: 36, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 1, 14, b, FM);
        c.col(1, 1, b, L(FM));
        c.rect(2, 2, 13, 8, u ? hex('#b0903a') : hex('#3a2a22'));
        txt(c, 3, 3, 'WIN', u ? C.white : hex('#6e5a2e'));
        c.rect(2, 10, 13, 16, C.ironDark);
        for (let i = 0; i < 3; i++) {
          const x = 3 + i * 4;
          c.rect(x, 11, x + 2, 15, u ? C.white : hex('#8d8a84'));
          if (u) pat(c, x, 11, ['rrr', '..r', '.r.', '.r.', '.r.'], { r: C.red });
          else if (i === 0) pat(c, x, 12, ['.g.', 'r.r'], { g: hex('#4a5e36'), r: hex('#7a2a26') });
          else if (i === 1) c.rect(x, 12, x + 2, 13, hex('#3a3a4e'));
          else pat(c, x, 12, ['.y.', 'yyy', '.y.'], { y: hex('#8a7a3a') });
        }
        c.rect(1, 18, 14, 20, L(FM));
        for (let i = 0; i < 3; i++) c.rect(3 + i * 4, 19, 4 + i * 4, 19, u ? [REDL, LAMP, GREENL][i] : [hex('#5a2622'), hex('#5e4a22'), hex('#24452e')][i]);
        c.set(13, 14, C.steel);
        c.rect(3, b - 7, 12, b - 5, DARK);
        c.row(b - 4, 3, 12, C.steel);
        scribble(c, 3, 23, 12, 25, D(FM), 3);
        if (u) {
          dots(c, C.gold, [5, b - 5, 7, b - 5, 8, b - 6, 10, b - 5, 6, b, 11, b]);
          dots(c, LAMP, [2, 9, 13, 9, 2, 17, 13, 17]);
        }
      },
      sw: 13,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 1, 9, b, FM);
        c.rect(10, 18, 11, 20, L(FM));
        c.rect(10, b - 6, 10, b - 4, C.steel);
        c.col(10, 2, 8, u ? hex('#b0903a') : hex('#3a2a22'));
        c.col(10, 10, 16, u ? C.white : C.ironDark);
        scribble(c, 3, 6, 7, 20, D(FM), 6);
        if (u) dots(c, LAMP, [11, 9, 11, 17]);
        if (u) c.set(11, b, C.gold);
      },
    });
  }
  {
    const WM = hex('#a9a698');
    const washer = (c, x, b, state) => {
      c.rect(x, 2, x + 13, b, WM);
      c.col(x, 2, b, L(WM));
      c.col(x + 13, 2, b, D(WM));
      c.rect(x + 1, 3, x + 12, 6, mix(WM, 0.8));
      c.set(x + 2, 4, DARK);
      c.set(x + 4, 4, DARK);
      c.rect(x + 9, 4, x + 11, 5, C.iron);
      c.set(x + 7, 4, state === 'run' ? REDL : hex('#5a2622'));
      c.oval(x + 2, 9, x + 11, 18, C.steel);
      c.oval(x + 3, 10, x + 10, 17, state === 'run' ? hex('#7a2a2c') : state === 'open' ? hex('#0e0c12') : GLASSD);
      if (state === 'run') {
        pat(c, x + 4, 11, ['..ww..', '.w..w.', 'w.....', '.w..w.', '..ww..'], { w: hex('#c9a0a0') });
      } else if (state === 'open') {
        c.rect(x + 5, 15, x + 8, 20, CLOTH[0]);
        c.col(x + 6, 16, 21, CLOTH[2]);
        c.set(x + 8, 21, CLOTH[0]);
      } else c.line(x + 4, 13, x + 6, 11, L(GLASSD));
      c.row(b, x, x + 13, mix(WM, 0.6));
    };
    T('laundrette-washers-row', 'laundrette washing machines row front loaders coin laundry red water', {
      w: 46, h: 26, solid: true,
      f(c, u) {
        const b = c.h - 2;
        washer(c, 2, b, u ? 'open' : 'shut');
        washer(c, 16, b, 'shut');
        washer(c, 30, b, u ? 'run' : 'shut');
        c.row(1, 2, 43, L(WM));
        if (u) {
          c.oval(0, 9, 3, 18, C.steel);
          c.col(1, 11, 16, mix(C.glass, 0.8));
          dots(c, C.white, [33, b, 36, b, 38, b - 1, 41, b]);
          dots(c, hex('#7a2a2c'), [35, b, 40, b]);
        }
      },
      sw: 14, sum: [0, 0, 4],
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 2, 10, b, WM);
        c.row(1, 1, 10, L(WM));
        if (u) {
          c.rect(11, 12, 15, 13, C.steel);
          c.rect(11, 14, 12, 20, CLOTH[0]);
          c.col(10, 10, 17, hex('#0e0c12'));
        } else c.rect(11, 10, 11, 17, C.steel);
      },
    });
    T('laundrette-dryers-stacked', 'laundrette tumble dryers stacked coin operated steel hot drum', {
      w: 20, h: 40, solid: true,
      f(c, u) {
        const b = c.h - 2,
          S = C.steel;
        c.rect(1, 1, 18, b, S);
        c.col(1, 1, b, L(S));
        c.col(18, 1, b, D(S));
        c.rect(2, 2, 17, 5, mix(S, 0.75));
        dots(c, DARK, [4, 3, 6, 3, 13, 4]);
        c.rect(15, 3, 16, 4, C.iron);
        c.set(9, 3, u ? AMBER : hex('#5e4a22'));
        for (const [y, st] of [[7, u ? 'hot' : 0], [22, u ? 'open' : 0]]) {
          c.oval(3, y, 16, y + 13, C.ironDark);
          c.oval(4, y + 1, 15, y + 12, st === 'hot' ? hex('#8a5a2a') : st === 'open' ? hex('#0e0c12') : GLASSD);
          if (st === 'hot') pat(c, 6, y + 4, ['.oo..o.', 'o..oo..', '..o..oo', '.o.oo..'], { o: hex('#c98a3a') });
          else if (st === 'open') {
            c.rect(8, y + 10, 10, y + 15, C.white);
            c.set(10, y + 16, C.white);
            c.row(y + 12, 8, 10, C.ash);
          } else c.line(6, y + 6, 9, y + 3, L(GLASSD));
        }
        c.row(21, 1, 18, D(S));
        if (u) {
          c.oval(0, 23, 2, 34, C.ironDark);
          c.row(b, 6, 9, C.ash);
        }
      },
      sw: 13, sum: [0, 0, 4],
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 1, 10, b, C.steel);
        c.row(21, 1, 10, D(C.steel));
        c.rect(11, 10, 11, 17, C.ironDark);
        if (u) {
          c.rect(11, 27, 15, 28, C.ironDark);
          c.rect(11, 29, 12, 34, C.white);
          c.col(10, 24, 33, hex('#0e0c12'));
          c.set(11, 13, AMBER);
        } else c.rect(11, 25, 11, 32, C.ironDark);
      },
    });
  }
  T('barber-chair-leather', 'barber chair red leather chrome pedestal hairdresser cape hair clippings', {
    w: 20, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2,
        S = C.steel;
      c.oval(4, b - 2, 15, b, S);
      c.row(b, 5, 14, D(S));
      c.rect(8, 21, 11, b - 2, S);
      c.col(8, 21, b - 2, L(S));
      c.rect(6, 23, 13, 24, S);
      c.row(24, 6, 13, D(S));
      c.rect(5, 6, 14, 15, LEATHER);
      c.row(6, 5, 14, L(LEATHER));
      c.rect(7, 2, 12, 5, LEATHER);
      c.row(2, 7, 12, L(LEATHER));
      dots(c, D(LEATHER), [8, 9, 11, 9, 8, 12, 11, 12]);
      c.rect(5, 16, 14, 19, LEATHER);
      c.row(16, 5, 14, L(LEATHER));
      c.row(19, 5, 14, D(LEATHER));
      for (const x of [2, 15]) {
        c.rect(x, 13, x + 2, 18, DIRTW);
        c.rect(x, 12, x + 2, 12, LEATHER);
        c.col(x, 13, 18, C.white);
      }
      c.rect(17, 19, 18, 20, C.black);
      c.set(16, 20, S);
      if (u) {
        c.poly([[5, 7], [14, 7], [16, 13], [17, 21], [2, 21], [3, 13]], C.white);
        for (const x of [5, 9, 13]) c.col(x, 12, 21, C.ash);
        c.row(21, 2, 17, C.ash);
        dots(c, C.woodDark, [7, 15, 8, 17, 11, 14, 12, 18, 10, 19, 3, b, 6, b - 1, 16, b, 13, b - 1, 1, b]);
        dots(c, C.blood, [10, 10, 10, 11, 11, 12]);
      }
    },
    sw: 24,
    s(c, u) {
      const b = c.h - 2,
        S = C.steel;
      c.oval(5, b - 2, 16, b, S);
      c.row(b, 6, 15, D(S));
      c.rect(9, 20, 12, b - 2, S);
      c.col(9, 20, b - 2, L(S));
      c.poly([[4, 5], [7, 5], [9, 17], [6, 17]], LEATHER);
      c.line(4, 5, 6, 17, L(LEATHER));
      c.rect(3, 1, 6, 4, LEATHER);
      c.row(1, 3, 6, L(LEATHER));
      c.rect(6, 16, 16, 19, LEATHER);
      c.row(16, 7, 16, L(LEATHER));
      c.row(19, 6, 16, D(LEATHER));
      c.rect(8, 12, 15, 13, DIRTW);
      c.row(12, 8, 15, LEATHER);
      c.col(14, 14, 15, S);
      c.line(16, 19, 20, 23, S);
      c.rect(18, 23, 22, 24, S);
      c.row(24, 18, 22, D(S));
      c.rect(2, 17, 3, 18, C.black);
      c.set(4, 18, S);
      if (u) {
        c.poly([[6, 6], [9, 7], [12, 15], [17, 16], [18, 21], [7, 21]], C.white);
        c.line(9, 9, 11, 20, C.ash);
        c.row(21, 7, 18, C.ash);
        dots(c, C.woodDark, [10, 12, 13, 18, 15, 17, 4, b, 18, b, 20, b - 1, 2, b]);
        dots(c, C.blood, [8, 9, 9, 11]);
      }
    },
  });
  {
    const PAD = hex('#26242c'),
      PADL = hex('#3e3c48');
    T('tattoo-chair-black', 'tattoo chair black padded bench studio paper cover ink blood straps', {
      w: 16, h: 22, solid: true, base: 'side',
      sw: 38,
      s(c, u) {
        const b = c.h - 2,
          S = C.steel;
        c.rect(8, b - 1, 30, b, S);
        c.rect(17, 14, 20, b - 2, S);
        c.col(17, 14, b - 2, L(S));
        c.poly([[2, 3], [5, 3], [14, 11], [14, 13], [11, 13]], PAD);
        c.line(3, 3, 13, 11, PADL);
        c.rect(12, 10, 25, 13, PAD);
        c.row(10, 13, 25, PADL);
        c.poly([[25, 10], [35, 12], [35, 15], [25, 13]], PAD);
        c.line(25, 10, 35, 12, PADL);
        c.rect(15, 6, 21, 7, PAD);
        c.col(18, 8, 9, S);
        c.line(5, 3, 14, 10, C.white);
        c.row(9, 14, 24, C.white);
        if (u) {
          dots(c, C.blood, [17, 9, 18, 9, 20, 9, 9, 6, 10, 7]);
          dots(c, hex('#1e2a4a'), [15, 9, 22, 9, 23, 9, 12, 9]);
          c.col(23, 14, 18, C.woodDark);
          c.set(23, 19, S);
          c.col(13, 14, 17, C.woodDark);
          dots(c, C.blood, [21, b, 22, b - 1]);
        }
      },
      f(c, u) {
        const b = c.h - 2,
          S = C.steel;
        c.rect(3, b - 1, 12, b, S);
        c.rect(6, 15, 9, b - 2, S);
        c.rect(3, 3, 12, 9, PAD);
        c.row(3, 3, 12, PADL);
        c.rect(2, 10, 13, 15, PAD);
        c.row(10, 2, 13, PADL);
        c.rect(1, 6, 2, 9, PAD);
        c.rect(13, 6, 14, 9, PAD);
        c.rect(6, 4, 9, 13, C.white);
        if (u) {
          dots(c, C.blood, [7, 7, 8, 8, 7, 11, 8, 12, 7, 12]);
          dots(c, hex('#1e2a4a'), [6, 6, 9, 10, 8, 5]);
          c.col(2, 16, 19, C.woodDark);
          c.col(13, 16, 18, C.woodDark);
        }
      },
    });
  }
  T('pawn-shop-cage', 'pawn shop counter cage bars hatch pawnbroker loans guitar watches', {
    w: 36, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2,
        I = hex('#2c2f36'),
        W = C.woodDark;
      c.rect(2, 2, 33, 25, u ? WARM : hex('#15131a'));
      const g = u ? 1 : 0.55;
      c.row(10, 3, 32, mix(C.wood, g));
      c.row(18, 3, 32, mix(C.wood, g));
      pat(c, 5, 3, ['.g.', '.g.', '.g.', 'ggg', 'gkg', 'ggg', '.g.'], { g: mix(hex('#9a6a3a'), g), k: DARK });
      c.rect(11, 5, 16, 9, mix(hex('#5a5048'), g));
      c.rect(12, 6, 15, 8, mix(C.glass, g));
      dots(c, mix(C.gold, g), [20, 9, 22, 9, 24, 9, 26, 9, 28, 8, 30, 9]);
      c.rect(5, 13, 9, 17, mix(hex('#7a4a5a'), g));
      c.rect(12, 14, 14, 17, mix(C.steel, g));
      c.rect(26, 12, 31, 17, mix(hex('#4f6470'), g));
      c.set(28, 14, mix(C.bone, g));
      for (let x = 4; x <= 31; x += 3) c.col(x, 2, 25, I);
      c.row(12, 2, 33, I);
      c.frame(1, 1, 34, 25, C.iron);
      c.rect(13, 19, 22, 25, u ? DARK : I);
      c.frame(13, 19, 22, 25, C.iron);
      c.rect(1, 26, 34, 27, C.woodLight);
      c.row(27, 1, 34, C.wood);
      c.rect(1, 28, 34, b, W);
      c.col(1, 28, b, C.wood);
      c.rect(7, 30, 28, 36, C.bone);
      txt(c, 9, 31, 'LOANS', C.wine);
      if (u) {
        c.rect(15, 24, 20, 26, hex('#7a8a6a'));
        c.row(24, 15, 20, hex('#9aa888'));
        c.set(17, 25, DARK);
        c.set(17, 4, LAMP);
        c.set(18, 4, LAMP);
        c.row(5, 16, 19, mix(LAMP, 0.8));
        eyes(c, 16, 21, 3);
      } else dots(c, C.steel, [17, 22, 18, 22]);
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 1, 8, 25, u ? WARM : hex('#15131a'));
      c.rect(9, 1, 10, 25, C.iron);
      c.row(1, 2, 10, C.iron);
      c.col(2, 1, 25, hex('#2c2f36'));
      c.row(12, 2, 10, hex('#2c2f36'));
      c.rect(1, 26, 11, 27, C.woodLight);
      sideBox(c, 2, 28, 10, b, C.woodDark);
      if (u) c.rect(10, 25, 11, 25, hex('#7a8a6a'));
    },
  });
  {
    const TARP = hex('#4a5a78');
    const roof = (c, x0, x1) => {
      c.poly([[x0, 3], [x1, 3], [x1 - 1, 9], [x0 + 1, 9]], TARP);
      c.row(3, x0, x1, L(TARP));
      for (let x = x0 + 4; x < x1; x += 6) c.line(x, 4, x - 1, 9, D(TARP));
      for (let x = x0 + 1; x < x1; x += 3) c.set(x, 10, D(TARP));
    };
    T('market-stall-tarpaulin', 'market stall tarpaulin roof jumble table light bulbs night covered', {
      w: 46, h: 42, solid: true,
      f(c, u) {
        const b = c.h - 2;
        c.col(2, 4, b, C.iron);
        c.col(43, 4, b, C.iron);
        roof(c, 1, 44);
        for (let x = 6; x <= 40; x += 6) {
          c.set(x, 12, C.iron);
          c.set(x, 13, u ? LAMP : hex('#6e6a5a'));
          if (u) dots(c, mix(LAMP, 0.75), [x - 1, 13, x + 1, 13, x, 14]);
        }
        c.row(11, 3, 42, DARK);
        c.rect(3, 25, 42, 26, C.woodLight);
        c.row(26, 3, 42, C.wood);
        c.rect(4, 27, 41, b - 3, hex('#6a3a40'));
        for (let x = 7; x < 41; x += 5) c.col(x, 28, b - 3, hex('#4a2830'));
        legs(c, [4, 40], b - 2, b, C.woodDark, 2);
        if (u) {
          tins(c, 5, 16, 24, 5, 3, 1);
          c.rect(18, 20, 22, 24, hex('#5a5048'));
          c.rect(19, 21, 21, 23, C.glass);
          pat(c, 24, 18, ['.ff.', 'ffff', '.ff.', 'pppp', 'pppp', '.pp.', '.pp.'], { f: C.flesh, p: hex('#8a5560') });
          c.rect(30, 22, 34, 24, C.white);
          c.row(23, 30, 34, C.ash);
          pat(c, 36, 20, ['.k.', '.k.', 'kkk', 'kkk', 'kkk'], { k: hex('#3f5f48') });
          dots(c, C.paper, [8, 25, 20, 25, 31, 25]);
        } else {
          c.poly([[4, 25], [6, 20], [16, 19], [22, 17], [28, 19], [38, 20], [41, 25]], hex('#5a6a52'));
          c.line(6, 20, 16, 19, hex('#74866a'));
          c.line(16, 19, 22, 17, hex('#74866a'));
          for (const x of [10, 20, 30, 36]) c.line(x, 20, x + 1, 25, hex('#3e4a3a'));
          c.row(23, 5, 40, C.straw);
        }
      },
      sw: 24,
      s(c, u) {
        const b = c.h - 2;
        c.col(3, 4, b, C.iron);
        c.col(20, 4, b, C.iron);
        roof(c, 1, 22);
        c.set(12, 12, C.iron);
        c.set(12, 13, u ? LAMP : hex('#6e6a5a'));
        if (u) dots(c, mix(LAMP, 0.75), [11, 13, 13, 13, 12, 14]);
        c.rect(4, 25, 19, 26, C.woodLight);
        c.rect(5, 27, 18, b - 3, hex('#6a3a40'));
        for (let x = 8; x < 18; x += 5) c.col(x, 28, b - 3, hex('#4a2830'));
        legs(c, [5, 17], b - 2, b, C.woodDark, 2);
        if (u) {
          tins(c, 6, 12, 24, 5, 3, 1);
          pat(c, 14, 20, ['.k.', '.k.', 'kkk', 'kkk', 'kkk'], { k: hex('#3f5f48') });
        } else {
          c.poly([[5, 25], [6, 20], [12, 18], [17, 20], [18, 25]], hex('#5a6a52'));
          c.line(6, 20, 12, 18, hex('#74866a'));
          c.row(23, 6, 17, C.straw);
        }
      },
    });
  }
  T('hot-food-hatch', 'hot food hatch takeaway chip shop serving window wall chips steam night', {
    w: 30, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bricks(c, 1, 1, 28, b, BRICK);
      c.rect(4, 2, 25, 8, DARK);
      txt(c, 6, 3, 'CHIPS', u ? NY : hex('#8a8260'));
      c.rect(4, 10, 25, 25, C.iron);
      if (u) {
        c.rect(5, 11, 24, 24, WARM);
        c.rect(5, 11, 24, 13, C.steel);
        c.rect(8, 12, 13, 13, C.iron);
        c.rect(15, 17, 20, 24, C.white);
        c.rect(16, 14, 19, 17, C.flesh);
        c.row(13, 16, 19, C.white);
        c.row(14, 16, 19, C.white);
        dots(c, DARK, [16, 16, 19, 16]);
        c.rect(6, 21, 11, 24, C.steel);
        smoke(c, 8, 20, 6, C.ash, 2);
        smoke(c, 10, 20, 5, C.white, 4);
        pat(c, 21, 22, ['y.y', 'yyy', 'ppp', '.p.'], { y: hex('#c9a04a'), p: C.paper });
      } else {
        for (let y = 11; y <= 24; y++) c.row(y, 5, 24, y % 2 ? C.steel : mix(C.steel, 0.72));
        c.rect(14, 23, 15, 24, C.brass);
      }
      c.rect(3, 26, 26, 27, C.steel);
      c.row(27, 3, 26, C.iron);
      c.rect(6, 30, 12, 37, C.paper);
      scribble(c, 7, 31, 11, 36, C.slate, 5);
      c.row(30, 6, 12, C.red);
      if (u) pat(c, 16, 23, ['y.y', 'yyy', 'ppp', '.p.'], { y: hex('#c9a04a'), p: C.paper });
      litter(c, 3, 26, b, 6);
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2;
      bricks(c, 1, 1, 5, b, BRICK);
      c.col(5, 1, b, D(BRICK));
      c.rect(6, 2, 6, 8, DARK);
      c.rect(6, 26, 8, 27, C.steel);
      c.col(6, 10, 25, u ? WARM : C.steel);
      if (u) {
        c.set(7, 4, NY);
        c.set(7, 6, NY);
        smoke(c, 7, 22, 8, C.ash, 2);
        c.rect(7, 24, 8, 25, hex('#c9a04a'));
      }
    },
  });
  {
    const DR = hex('#5a4438');
    T('oil-drum-fire-alley', 'oil drum fire barrel brazier burning rubbish hobo alley warm hands', {
      w: 14, h: 22, solid: true, um: [0, 8, 0], same: true,
      f(c, u) {
        const b = c.h - 2;
        c.rect(2, 5, 11, b, DR);
        c.col(2, 5, b, L(DR));
        c.col(3, 5, b, L(DR));
        c.col(10, 5, b, D(DR));
        c.rect(2, 4, 11, 5, D(DR));
        c.row(4, 2, 11, C.iron);
        for (const y of [10, 15]) c.row(y, 2, 11, D(DR));
        c.speckle(2, 6, 11, b, C.rust, 9, 3);
        for (const [x, y] of [[4, 8], [7, 12], [9, 8], [5, 17], [8, 17]]) c.set(x, y, u ? AMBER : DARK);
        c.line(4, 4, 3, 1, hex('#2a2018'));
        c.line(8, 4, 10, 2, hex('#2a2018'));
        c.row(3, 5, 7, hex('#2a2018'));
        if (u) {
          flame(c, 4, 3, 5);
          flame(c, 7, 3, 7);
          flame(c, 10, 3, 4);
          dots(c, C.flameLight, [5, -5, 9, -4, 3, -3, 11, -6, 7, -7]);
          c.set(7, 12, LAMP);
        } else smoke(c, 6, 2, 3, SMOKE, 2);
      },
    });
  }
  T('cardboard-shelter-alley', 'cardboard box shelter homeless rough sleeper blanket eyes in the dark', {
    w: 18, h: 18, solid: true, base: 'side',
    sw: 38,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 31, b, CARD);
      c.row(5, 2, 31, L(CARD));
      c.col(2, 5, b, L(CARD));
      c.rect(1, 3, 33, 4, CARDD);
      c.row(3, 1, 33, CARD);
      c.col(16, 5, b, CARDD);
      c.row(10, 2, 31, blend(CARD, C.bone, 0.3));
      pat(c, 6, 7, ['.k.', 'kkk', '.k.', '.k.'], { k: CARDD });
      pat(c, 10, 7, ['.k.', 'kkk', '.k.', '.k.'], { k: CARDD });
      scribble(c, 19, 12, 28, 14, CARDD, 3);
      c.speckle(2, 11, 31, b, CARDD, 9, 4);
      if (u) {
        c.rect(27, 6, 31, b, hex('#121016'));
        c.poly([[32, 5], [36, 7], [36, b - 2], [32, b]], CARDD);
        c.line(32, 5, 36, 7, CARD);
        eyes(c, 28, 9, 2);
        c.rect(26, b - 2, 34, b, hex('#5c5a48'));
        c.row(b - 2, 27, 33, hex('#77745e'));
        c.rect(29, b - 4, 30, b - 3, C.flesh);
      } else {
        c.col(27, 5, b, CARDD);
        c.rect(32, 5, 32, b, CARDD);
        c.rect(33, b - 1, 35, b, hex('#3a2c22'));
        c.set(33, b - 2, hex('#3a2c22'));
      }
    },
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 15, b, CARD);
      c.row(5, 2, 15, L(CARD));
      c.rect(1, 3, 16, 4, CARDD);
      c.row(3, 1, 16, CARD);
      if (u) {
        c.rect(3, 6, 14, b, hex('#121016'));
        c.rect(1, 6, 2, b, CARDD);
        c.rect(15, 6, 16, b, CARDD);
        eyes(c, 7, 9, 3);
        c.rect(4, b - 2, 13, b, hex('#5c5a48'));
        c.row(b - 2, 5, 12, hex('#77745e'));
        c.rect(6, b - 4, 7, b - 3, C.flesh);
      } else {
        c.col(8, 5, b, CARDD);
        c.row(10, 2, 15, blend(CARD, C.bone, 0.3));
        scribble(c, 3, 12, 7, 14, CARDD, 3);
        c.rect(10, b - 1, 12, b, hex('#3a2c22'));
      }
    },
  });
  {
    const PB = hex('#b9b6a8');
    const pbag = (c, x, b, h) => {
      c.rect(x, b - h + 2, x + 5, b, PB);
      c.col(x, b - h + 2, b, C.white);
      c.col(x + 5, b - h + 2, b, C.ash);
      c.row(b - h + 5, x + 1, x + 4, hex('#a83a30'));
      c.set(x + 1, b - h + 1, PB);
      c.set(x + 4, b - h + 1, PB);
      c.set(x + 2, b - h, PB);
      c.set(x + 3, b - h, PB);
      c.set(x + 3, b - 1, C.ash);
    };
    T('shopping-bags-plastic', 'plastic shopping bags carrier bags groceries dropped tins rolling', {
      w: 17, h: 13, um: [0, 0, 5],
      f(c, u) {
        const b = c.h - 2;
        pbag(c, 2, b, 10);
        if (u) {
          c.rect(8, b - 4, 15, b, PB);
          c.row(b - 4, 9, 14, C.white);
          c.row(b - 2, 9, 14, hex('#a83a30'));
          c.rect(16, b - 3, 16, b, DARK);
          c.rect(17, b - 2, 19, b, X.TINS[1]);
          c.col(17, b - 2, b, L(X.TINS[1]));
          c.rect(20, b - 1, 21, b, hex('#b0703a'));
          c.set(13, b, hex('#b0703a'));
        } else {
          pbag(c, 9, b, 9);
          c.set(11, b - 9, hex('#5a7048'));
          c.set(12, b - 10, hex('#5a7048'));
        }
      },
      sw: 10, sum: [0, 0, 4],
      s(c, u) {
        const b = c.h - 2;
        pbag(c, 2, b, 10);
        if (u) {
          c.rect(9, b - 2, 11, b, X.TINS[1]);
          c.rect(12, b - 1, 13, b, hex('#b0703a'));
        }
      },
    });
  }
  T('chainlink-fence-section', 'chain link fence section wire mesh posts yard hole cut', {
    w: 34, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2,
        S = C.steel;
      for (let y = 4; y <= b - 1; y++) for (let x = 3; x <= 30; x++) if ((x + y) % 6 === 0 || (x - y + 60) % 6 === 0) c.set(x, y, mix(S, 0.8));
      c.row(3, 1, 32, S);
      c.row(b - 1, 3, 30, mix(S, 0.7));
      for (const x of [1, 31]) {
        c.rect(x, 2, x + 1, b, S);
        c.col(x, 2, b, L(S));
        c.row(1, x, x + 1, C.iron);
      }
      if (u) {
        for (let y = 18; y <= b; y++) for (let x = 9; x <= 23; x++) if (((x - 16) / 7.5) ** 2 + ((y - b) / 15) ** 2 < 1) c.clear(x, y);
        dots(c, C.white, [9, 26, 11, 21, 15, 18, 20, 19, 23, 25, 8, 30, 24, 31]);
        c.line(23, 26, 26, 30, mix(S, 0.8));
        c.line(24, 26, 27, 30, mix(S, 0.6));
        c.rect(10, 23, 11, 24, hex('#7a3a34'));
        c.set(10, 25, hex('#7a3a34'));
        dots(c, S, [12, b, 18, b, 21, b]);
      }
    },
    sw: 6,
    s(c, u) {
      const b = c.h - 2,
        S = C.steel;
      c.rect(2, 2, 3, b, S);
      c.col(2, 2, b, L(S));
      c.row(1, 2, 3, C.iron);
      if (u) dots(c, C.white, [4, 20, 4, 24, 4, 28]);
      if (u) c.set(4, 22, hex('#7a3a34'));
    },
  });
};
