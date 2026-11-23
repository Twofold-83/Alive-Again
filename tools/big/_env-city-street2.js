/* env-street, second half: signs, shop fronts, street furniture. Part of tools/big/env-city.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, txt, scribble, wheel, ring } = X;
  const { bricks, planks, hazard, tins, litter, flame, smoke, pool } = X;
  const { TYRE, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, BLUEL, CARD, CARDD, BAG, DIRTW, WATER, WATERL, SMOKE, POLE, DARK } = X;
  setCat('env-street', 'Street');

  const SIGNG = hex('#2f4a3c'),
    FADEDRED = hex('#7a3a34'),
    BLUEB = hex('#3a4a66'),
    TEALB = hex('#2f4f52'),
    BARK = hex('#4a3b30'),
    GRITY = hex('#a08a3a');
  const missing = (c, x, y) => {
    c.rect(x, y, x + 4, y + 6, C.white);
    c.row(y, x, x + 4, C.blood);
    c.rect(x + 1, y + 2, x + 3, y + 4, C.flesh);
    c.row(y + 2, x + 1, x + 3, C.woodDark);
    c.row(y + 6, x + 1, x + 3, C.slate);
  };

  /* ---------- signs ---------- */
  {
    const blade = (c, y, text) => {
      c.rect(1, y, 24, y + 6, SIGNG);
      c.frame(1, y, 24, y + 6, hex('#6f8a72'));
      txt(c, 3, y + 1, text, C.bone);
    };
    const edge = (c, y) => {
      c.rect(11, y, 14, y + 6, D(SIGNG));
      c.col(11, y, y + 6, C.bone);
      c.col(14, y, y + 6, C.bone);
    };
    const signs = (flat, text) => (c, u) => {
      const b = c.h - 2;
      c.rect(12, 4, 13, b, POLE);
      c.col(12, 4, b, L(POLE));
      c.rect(11, b - 1, 14, b, D(POLE));
      c.rect(12, 2, 13, 3, C.steel);
      if (flat === 0) {
        edge(c, 13);
        if (u) {
          c.poly([[11, 6], [16, 5], [23, 25], [18, 27]], SIGNG);
          c.line(11, 6, 18, 27, C.bone);
          c.line(16, 5, 23, 25, C.bone);
          c.line(18, 27, 23, 25, C.bone);
          dots(c, C.bone, [14, 9, 15, 11, 16, 14, 17, 17, 18, 19, 19, 22, 16, 10, 18, 16]);
          c.set(13, 6, C.steel);
        } else blade(c, 5, text);
      } else {
        blade(c, 13, text);
        if (u) {
          c.rect(13, 5, 14, 27, D(SIGNG));
          c.col(13, 5, 27, hex('#6f8a72'));
          c.set(13, 6, C.steel);
        } else edge(c, 5);
      }
    };
    T('street-name-signs', 'street name sign post corner blades elm street avenue crossroads', {
      w: 26, h: 42, solid: true,
      f: signs(0, 'ELM ST'),
      sw: 26,
      s: signs(1, '13 AVE'),
    });
  }
  T('billboard-roadside-smile', 'billboard hoarding advertisement poster smile teeth roadside lamps torn', {
    w: 54, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2,
        BG = hex('#4f6e70');
      for (const x of [9, 42]) {
        c.rect(x, 30, x + 2, b, C.iron);
        c.col(x, 30, b, L(C.iron));
      }
      c.line(11, 32, 42, b - 2, C.ironDark);
      c.line(42, 32, 11, b - 2, C.ironDark);
      c.rect(1, 1, 52, 29, C.ironDark);
      c.rect(3, 3, 50, 27, BG);
      txt(c, 8, 5, 'SMILE', C.bone, { k: 2 });
      c.rect(13, 18, 40, 24, hex('#7a2a2c'));
      c.rect(14, 19, 39, 23, C.white);
      for (let x = 17; x < 39; x += 4) c.col(x, 19, 23, C.ash);
      c.row(21, 14, 39, hex('#5a2022'));
      c.speckle(3, 3, 50, 27, D(BG), 30, 3);
      for (const x of [4, 30, 47]) c.col(x, 3, 27, mix(BG, 0.85));
      c.rect(1, 30, 52, 31, C.iron);
      for (const x of [12, 26, 40]) {
        c.rect(x, 31, x + 1, 32, DARK);
        c.set(x, 30, u ? LAMP : C.steel);
        c.set(x + 1, 30, u ? LAMP : C.steel);
        if (u) dots(c, mix(LAMP, 0.8), [x - 1, 28, x + 2, 28, x, 28, x + 1, 28, x, 27, x + 1, 27]);
      }
      if (u) {
        c.poly([[19, 3], [33, 3], [30, 12], [34, 20], [28, 27], [18, 27], [22, 17], [17, 9]], hex('#2a2430'));
        c.oval(20, 10, 31, 18, C.bone);
        c.oval(23, 11, 28, 17, hex('#6a2a2a'));
        c.oval(24, 12, 27, 16, DARK);
        c.set(25, 13, C.white);
        c.line(19, 9, 25, 7, DARK);
        c.line(25, 7, 32, 10, DARK);
        dots(c, C.paper, [18, 28, 20, 29, 29, 28, 33, 21, 34, 22]);
        c.poly([[28, 27], [34, 20], [35, 26]], C.paper);
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 1, 6, 29, C.ironDark);
      c.col(4, 1, 29, C.iron);
      c.col(7, 3, 27, hex('#4f6e70'));
      c.rect(4, 30, 6, b, C.iron);
      c.line(4, 12, 1, b, C.ironDark);
      c.row(30, 4, 9, C.iron);
      c.rect(9, 30, 10, 31, DARK);
      c.set(10, 29, u ? LAMP : C.steel);
      if (u) dots(c, mix(LAMP, 0.8), [9, 28, 8, 27, 8, 25]);
      if (u) c.rect(8, 20, 9, 22, C.paper);
    },
  });
  {
    const AW = hex('#4f6b50');
    const FRUIT = { apple: hex('#8f3b30'), orange: hex('#b0703a'), cabbage: hex('#5a7048'), lemon: hex('#b0a050'), spud: hex('#7a6248'), plum: hex('#5a3a5e') };
    const crate = (c, x0, y0, x1, y1, kind) => {
      c.rect(x0, y0 + 2, x1, y1, C.woodPale);
      for (let y = y0 + 4; y <= y1; y += 2) c.row(y, x0, x1, C.wood);
      c.col(x0, y0 + 2, y1, C.wood);
      c.col(x1, y0 + 2, y1, C.wood);
      if (kind) {
        const f = FRUIT[kind];
        c.rect(x0 + 1, y0, x1 - 1, y0 + 2, f);
        c.row(y0 - 1, x0 + 2, x1 - 2, f);
        for (let x = x0 + 1; x < x1; x += 2) c.set(x, y0 + (x % 4 ? 0 : 1), L(f));
        for (let x = x0 + 2; x < x1; x += 3) c.set(x, y0 + 2, D(f));
      } else c.rect(x0 + 1, y0 + 2, x1 - 1, y0 + 3, hex('#2a2018'));
    };
    T('greengrocer-awning-crates', 'shop awning striped fruit crates greengrocer vegetables stall apples', {
      w: 46, h: 40, solid: true,
      f(c, u) {
        const b = c.h - 2;
        for (let x = 1; x <= 44; x++) {
          const col = Math.floor((x - 1) / 4) % 2 ? C.bone : AW;
          c.col(x, 2, 8, col);
          c.set(x, 2, L(col));
          if ((x - 1) % 4 !== 3) c.set(x, 9, D(col));
          if ((x - 1) % 4 === 1) c.set(x, 10, D(col));
        }
        c.row(1, 1, 44, C.ironDark);
        c.col(2, 10, b, C.iron);
        c.col(43, 10, b, C.iron);
        const back = ['cabbage', 'lemon', 'plum'],
          front = ['apple', 'orange', 'spud'];
        for (let i = 0; i < 3; i++) crate(c, 5 + i * 12, 17, 15 + i * 12, 24, u && i === 1 ? null : back[i]);
        c.rect(4, 25, 41, 26, C.woodDark);
        legs(c, [5, 39], 27, b, C.woodDark, 2);
        for (let i = 0; i < 3; i++) if (!(u && i === 0)) crate(c, 4 + i * 13, 27, 15 + i * 13, b, front[i]);
        c.rect(20, 13, 25, 16, C.paper);
        c.row(14, 21, 24, C.slate);
        c.set(22, 17, C.woodDark);
        if (u) {
          c.poly([[3, b - 6], [10, b - 9], [14, b - 2], [8, b]], C.woodPale);
          c.line(3, b - 6, 8, b, C.wood);
          c.line(6, b - 7, 11, b - 1, C.wood);
          c.line(10, b - 9, 14, b - 2, C.wood);
          dots(c, FRUIT.apple, [12, b, 15, b, 16, b - 1, 19, b, 23, b, 1, b, 17, b]);
          dots(c, L(FRUIT.apple), [15, b - 1, 22, b]);
          c.set(20, b, C.bone);
        }
      },
      sw: 24, sum: [0, 0, 5],
      s(c, u) {
        const b = c.h - 2;
        c.poly([[1, 2], [21, 7], [21, 9], [1, 5]], AW);
        c.line(1, 2, 21, 7, L(AW));
        c.rect(20, 8, 21, 10, C.bone);
        c.col(1, 1, 8, C.ironDark);
        c.line(2, 8, 12, 6, C.iron);
        c.col(20, 11, b, C.iron);
        crate(c, 3, 17, 10, 24, 'cabbage');
        c.rect(2, 25, 11, 26, C.woodDark);
        legs(c, [3, 9], 27, b, C.woodDark, 2);
        if (u) {
          c.poly([[13, b - 5], [18, b - 8], [22, b - 2], [17, b]], C.woodPale);
          c.line(13, b - 5, 17, b, C.wood);
          c.line(18, b - 8, 22, b - 2, C.wood);
          dots(c, FRUIT.apple, [21, b, 23, b, 24, b - 1, 26, b, 12, b]);
        } else crate(c, 11, 27, 18, b, 'apple');
      },
    });
  }
  T('cafe-table-two-chairs', 'pavement cafe table two chairs bistro coffee cup ashtray cigarette', {
    w: 32, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2,
        I = hex('#2c2f36'),
        seat = C.woodLight;
      const chairL = (x) => {
        c.rect(x, 4, x + 1, b, I);
        c.set(x + 1, 3, I);
        c.col(x, 4, b, C.iron);
        c.rect(x, 12, x + 6, 13, seat);
        c.row(13, x, x + 6, D(seat));
        c.col(x + 6, 14, b, I);
      };
      c.rect(10, 8, 21, 9, C.stoneLight);
      c.row(9, 10, 21, C.stone);
      c.set(10, 8, C.white);
      c.rect(15, 10, 16, b - 1, I);
      c.row(b, 12, 19, I);
      c.row(b - 1, 14, 17, I);
      chairL(2);
      if (u) {
        c.rect(25, b - 1, 30, b, I);
        c.rect(25, b - 7, 26, b - 2, seat);
        c.col(26, b - 7, b - 2, D(seat));
        c.row(b - 7, 20, 24, I);
        c.row(b, 21, 24, I);
        c.rect(12, 7, 14, 7, C.white);
        c.set(11, 7, C.white);
        c.col(10, 9, 13, hex('#5a3a28'));
        dots(c, hex('#5a3a28'), [11, 8, 10, 15, 9, b, 10, b]);
      } else {
        c.rect(28, 4, 29, b, I);
        c.set(28, 3, I);
        c.rect(23, 12, 29, 13, seat);
        c.row(13, 23, 29, D(seat));
        c.col(23, 14, b, I);
        c.rect(12, 6, 13, 7, C.white);
        c.set(14, 6, C.white);
      }
      c.rect(18, 7, 20, 7, C.steel);
      if (!u) {
        c.set(20, 6, C.bone);
        smoke(c, 21, 5, 4, C.ash, 2);
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2,
        I = hex('#2c2f36');
      c.rect(1, 8, 12, 9, C.stoneLight);
      c.row(9, 1, 12, C.stone);
      c.rect(6, 10, 7, b - 1, I);
      c.row(b, 4, 9, I);
      if (u) {
        c.rect(3, b - 6, 10, b - 3, C.woodLight);
        c.frame(3, b - 6, 10, b - 3, I);
        c.rect(3, b - 1, 10, b, I);
        c.row(b, 4, 9, C.ironDark);
        dots(c, I, [3, b - 7, 10, b - 7, 3, b - 8, 10, b - 8]);
        c.rect(4, 7, 6, 7, C.white);
        c.col(3, 9, 12, hex('#5a3a28'));
      } else {
        c.rect(6, 6, 7, 7, C.white);
        c.frame(3, 3, 10, 12, I);
        c.col(5, 4, 11, I);
        c.col(8, 4, 11, I);
        c.rect(3, 12, 10, 13, C.woodLight);
        c.row(13, 3, 10, D(C.woodLight));
        c.col(3, 14, b, I);
        c.col(10, 14, b, I);
      }
    },
  });
  {
    const tree = (c, u) => {
      const b = c.h - 2;
      c.rect(4, b - 1, 21, b, C.ironDark);
      for (let x = 5; x < 21; x += 2) c.set(x, b - 1, C.iron);
      c.rect(11, 22, 13, b - 2, BARK);
      c.col(11, 22, b - 2, L(BARK));
      dots(c, D(BARK), [12, 27, 13, 33, 12, 40]);
      const br = [[12, 23, 6, 12], [6, 12, 3, 3], [12, 21, 19, 10], [19, 10, 22, 2], [12, 24, 12, 7], [12, 7, 10, 1], [6, 12, 1, 9], [19, 10, 24, 11], [9, 17, 8, 5], [16, 14, 17, 4], [4, 6, 1, 4], [21, 5, 24, 4], [12, 12, 15, 5]];
      for (const [x0, y0, x1, y1] of br) c.line(x0, y0, x1, y1, BARK);
      c.line(13, 22, 13, 9, D(BARK));
      dots(c, C.rust, [2, 5, 9, 4, 18, 6, 23, 8, 14, 3, 6, 9]);
      for (const x of [8, 10, 14, 16]) c.col(x, 31, b - 2, C.iron);
      c.row(31, 8, 16, C.iron);
      c.row(39, 8, 16, C.iron);
      if (u) {
        missing(c, 10, 23);
        pat(c, 18, 7, ['.ww.', 'wwww', '.www', '..w.', '..w.'], { w: C.ghost });
        dots(c, C.rust, [5, b - 2, 18, b - 2]);
      }
    };
    T('street-tree-grate', 'bare street tree iron grate guard dead branches missing poster', {
      w: 26, h: 50, solid: true,
      f: tree,
      sw: 26,
      s: flip(26, 50, tree),
    });
  }
  T('flower-tub-concrete', 'concrete flower tub planter street dead plants flowers cigarette ends', {
    w: 20, h: 16, solid: true,
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(3, 6, 16, 7, C.earth);
        dots(c, D(C.earth), [5, 6, 9, 6, 13, 6]);
        dots(c, C.leaf, [7, 5, 12, 5]);
        c.line(15, 6, 18, 10, C.leaf);
        c.set(18, 11, hex('#9a5a66'));
        c.set(17, 12, C.leafLight);
      } else {
        c.oval(3, 3, 9, 8, C.leaf);
        c.oval(8, 2, 16, 8, C.moss);
        dots(c, C.leafLight, [5, 4, 11, 3, 14, 5, 7, 6]);
        dots(c, hex('#9a5a66'), [4, 3, 10, 2, 15, 4]);
        dots(c, C.mustard, [7, 3, 13, 3]);
        dots(c, C.rust, [6, 5, 12, 6]);
      }
      c.poly([[2, 8], [17, 8], [16, b], [3, b]], CONC);
      c.rect(1, 7, 18, 8, L(CONC));
      c.row(8, 1, 18, CONC);
      c.line(2, 9, 3, b, L(CONC));
      c.speckle(2, 9, 17, b, CONCD, 6, 2);
      c.row(b, 3, 16, CONCD);
      dots(c, C.bone, [u ? 6 : 19, b, u ? 12 : 19, b]);
      if (u) dots(c, hex('#9a5a66'), [1, b, 18, b]);
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(3, 6, 10, 7, C.earth);
        c.set(6, 5, C.leaf);
        c.line(10, 6, 12, 10, C.leaf);
        c.set(12, 11, hex('#9a5a66'));
      } else {
        c.oval(2, 2, 11, 8, C.moss);
        c.oval(2, 4, 6, 8, C.leaf);
        dots(c, C.leafLight, [5, 4, 9, 5]);
        dots(c, hex('#9a5a66'), [4, 3, 9, 3]);
        dots(c, C.mustard, [7, 2]);
      }
      c.poly([[2, 8], [11, 8], [10, b], [3, b]], CONC);
      c.rect(1, 7, 12, 8, L(CONC));
      c.row(8, 1, 12, CONC);
      c.speckle(2, 9, 11, b, CONCD, 6, 2);
      c.row(b, 3, 10, CONCD);
    },
  });
  {
    const boll = (c, x, b) => {
      const col = hex('#2c2f36');
      c.rect(x, 5, x + 3, b, col);
      c.col(x, 5, b, C.iron);
      c.rect(x, 2, x + 3, 3, col);
      c.row(1, x + 1, x + 2, col);
      c.row(4, x + 1, x + 2, col);
      c.set(x, 2, C.iron);
      c.row(7, x, x + 3, C.brass);
      c.rect(x - 1, b - 1, x + 4, b, D(col));
    };
    T('bollards-chain-pair', 'bollards with chain cast iron posts barrier pavement', {
      w: 28, h: 19, solid: true,
      f(c, u) {
        const b = c.h - 2;
        boll(c, 2, b);
        boll(c, 22, b);
        if (u) {
          for (let y = 8; y < b; y++) c.set(6, y, y % 2 ? C.steel : C.iron);
          for (let x = 7; x < 17; x++) c.set(x, b - (x % 5 === 0 ? 1 : 0), x % 2 ? C.steel : C.iron);
          c.set(21, 8, C.steel);
        } else for (let x = 6; x <= 21; x++) c.set(x, 8 + Math.round(4 * Math.sin(((x - 6) / 15) * Math.PI)), x % 2 ? C.steel : C.iron);
      },
      sw: 9,
      s(c, u) {
        const b = c.h - 2;
        boll(c, 2, b);
        c.set(6, 8, C.steel);
        if (u) for (let y = 9; y < b; y++) c.set(6, y, y % 2 ? C.steel : C.iron);
        if (u) c.set(7, b, C.steel);
      },
    });
  }
  {
    const NIGHTW = hex('#22303c');
    const pud = (w) => (c, u) => {
      c.oval(1, 1, w - 2, 5, NIGHTW);
      c.row(5, 5, w - 6, WATER);
      c.set(2, 3, WATER);
      const m = w >> 1;
      if (u) {
        c.oval(m - 6, 1, m + 5, 5, mix(WATER, 0.8));
        c.oval(m - 4, 2, m + 3, 4, NIGHTW);
        c.row(3, m - 2, m + 1, WATERL);
        dots(c, WATERL, [m - 7, 3, m + 6, 3, m - 3, -1, m + 2, -2, m, 0, m + 4, 0]);
        dots(c, mix(AMBER, 0.8), [m - 5, 2, m - 5, 4]);
      } else {
        c.col(m - 5, 2, 4, mix(AMBER, 0.8));
        c.set(m - 5, 3, LAMP);
        c.set(m - 4, 4, mix(AMBER, 0.6));
        c.set(m + 3, 2, C.bone);
        c.row(4, m + 1, m + 4, mix(NIGHTW, 1.3));
      }
    };
    T('puddle-street-reflection', 'puddle rain water reflection street lamp ripples splash', {
      w: 24, h: 7, um: [0, 3, 0], sum: [0, 3, 0], shade: false,
      f: pud(24),
      sw: 16,
      s: pud(16),
    });
  }
  {
    const UC = hex('#5f6860');
    T('utility-cabinet-street', 'street electrical cabinet junction box telephone grey doors wires sparks', {
      w: 18, h: 22, solid: true, um: [0, 0, 5], sum: [0, 0, 6],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 2, 16, b - 2, UC);
        c.row(2, 1, 16, L(UC));
        c.col(1, 2, b - 2, L(UC));
        c.rect(1, b - 1, 16, b, CONCD);
        c.col(8, 3, b - 2, D(UC));
        for (const x of [3, 11]) for (const y of [4, 6]) c.row(y, x, x + 3, D(UC));
        c.set(7, 11, C.steel);
        pat(c, 11, 9, ['.y.', 'yky', 'yyy'], { y: C.mustard, k: DARK });
        c.rect(3, 9, 6, 13, C.paper);
        c.set(6, 13, UC);
        c.set(5, 13, UC);
        scribble(c, 3, 10, 5, 12, C.slate, 2);
        scribble(c, 2, 15, 7, 17, C.plum, 4);
        if (u) {
          c.rect(9, 3, 15, b - 3, DARK);
          const wires = [hex('#8f3b30'), hex('#3d5a8e'), hex('#a08a3a'), hex('#5a7048'), C.bone];
          wires.forEach((wc, i) => c.col(10 + i, 4, 11 + (i % 2), wc));
          c.rect(10, 13, 14, 14, C.steel);
          dots(c, DARK, [11, 13, 13, 13]);
          c.set(12, 8, C.white);
          dots(c, LAMP, [11, 7, 13, 9, 13, 7, 11, 9, 12, 6]);
          c.rect(17, 2, 20, b - 2, D(UC));
          c.col(17, 2, b - 2, UC);
          c.col(20, 2, b - 2, mix(UC, 0.5));
        }
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 2, 8, b - 2, UC);
        c.rect(1, b - 1, 8, b, CONCD);
        for (const y of [4, 6]) c.row(y, 3, 6, D(UC));
        if (u) {
          c.rect(9, 2, 14, b - 2, L(UC));
          c.frame(9, 2, 14, b - 2, UC);
          c.set(13, 11, C.steel);
          c.col(8, 3, b - 3, DARK);
          dots(c, LAMP, [8, 8, 8, 6]);
        }
      },
    });
  }
  T('newspaper-box-coin', 'newspaper vending box coin operated news rack blue street', {
    w: 13, h: 22, solid: true, sum: [0, 0, 4],
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 11, 15, BLUEB);
      c.row(2, 1, 11, L(BLUEB));
      c.col(1, 2, 15, L(BLUEB));
      c.rect(5, 16, 7, b - 1, C.iron);
      c.row(b, 3, 9, C.ironDark);
      c.rect(9, 12, 10, 13, C.steel);
      c.set(10, 12, DARK);
      if (u) {
        c.rect(3, 4, 9, 10, DARK);
        c.row(10, 4, 7, C.paper);
        c.rect(2, 11, 10, 15, L(BLUEB));
        c.rect(3, 12, 9, 14, mix(C.glass, 0.8));
        c.line(4, 14, 6, 12, C.glassLight);
        c.row(11, 2, 10, C.steel);
      } else {
        c.rect(3, 4, 9, 10, C.paper);
        c.frame(2, 3, 10, 11, D(BLUEB));
        c.rect(3, 5, 9, 6, C.black);
        scribble(c, 4, 8, 8, 10, C.slate, 3);
        c.row(13, 3, 6, C.steel);
      }
    },
    sw: 11,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 2, 8, 15, BLUEB);
      c.rect(4, 16, 6, b - 1, C.iron);
      c.row(b, 2, 8, C.ironDark);
      if (u) {
        c.poly([[9, 11], [13, 13], [13, 14], [9, 12]], L(BLUEB));
        c.col(8, 4, 10, DARK);
      } else c.set(9, 8, C.steel);
    },
  });
  T('roadworks-sign-digging', 'road works sign men at work triangle warning digging sandbag', {
    w: 18, h: 20,
    f(c, u) {
      const b = c.h - 2,
        R = hex('#a83a30');
      if (u) {
        c.rect(1, b - 2, 16, b - 1, C.iron);
        c.poly([[4, b - 5], [13, b - 5], [16, b - 2], [1, b - 2]], R);
        c.poly([[6, b - 4], [11, b - 4], [12, b - 3], [5, b - 3]], C.white);
        c.row(b - 3, 8, 9, DARK);
        c.row(b, 2, 15, C.ironDark);
        c.oval(11, b - 3, 17, b, hex('#8a7a58'));
        return;
      }
      c.line(4, 9, 2, b, C.iron);
      c.line(13, 9, 15, b, C.iron);
      c.row(b - 3, 3, 14, C.ironDark);
      c.poly([[8, 1], [9, 1], [16, 12], [1, 12]], R);
      c.poly([[8, 4], [9, 4], [13, 10], [4, 10]], C.white);
      pat(c, 6, 6, ['..k..', '.kk..', 'k.kk.', '...kk'], { k: DARK });
      c.oval(5, b - 2, 12, b, hex('#8a7a58'));
      c.row(b - 2, 7, 10, hex('#a3936c'));
    },
    sw: 11,
    s(c, u) {
      const b = c.h - 2,
        R = hex('#a83a30');
      if (u) {
        c.rect(1, b - 2, 9, b - 1, C.iron);
        c.row(b - 3, 2, 8, R);
        c.row(b, 2, 8, C.ironDark);
        return;
      }
      c.line(5, 1, 2, b, R);
      c.line(6, 1, 3, b - 6, C.white);
      c.line(6, 2, 8, b, C.iron);
      c.row(b - 3, 3, 7, C.ironDark);
      c.oval(3, b - 2, 9, b, hex('#8a7a58'));
    },
  });
  T('drinking-fountain-iron', 'drinking fountain cast iron green street water tap bowl', {
    w: 12, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2,
        G = SIGNG;
      c.rect(2, b - 2, 9, b, D(G));
      c.rect(4, 11, 7, b - 3, G);
      c.col(4, 11, b - 3, L(G));
      c.col(6, 12, b - 4, D(G));
      c.row(10, 3, 8, D(G));
      c.rect(1, 7, 10, 9, G);
      c.row(7, 1, 10, L(G));
      c.rect(4, 2, 7, 6, G);
      c.row(1, 5, 6, G);
      c.col(4, 2, 6, L(G));
      c.set(5, 4, C.brass);
      c.set(6, 4, C.brass);
      c.set(6, 5, C.brass);
      c.speckle(1, 2, 10, b, C.rust, 12, 3);
      if (u) {
        c.set(6, 6, WATERL);
        c.row(7, 2, 9, WATER);
        c.set(5, 7, WATERL);
        c.col(1, 10, 15, WATER);
        c.set(1, 12, WATERL);
        c.row(b, 0, 3, WATER);
      }
    },
    sw: 13,
    s(c, u) {
      const b = c.h - 2,
        G = SIGNG;
      c.rect(2, b - 2, 9, b, D(G));
      c.rect(4, 11, 7, b - 3, mix(G, 0.9));
      c.col(4, 11, b - 3, L(G));
      c.row(10, 3, 8, D(G));
      c.rect(2, 7, 11, 9, G);
      c.row(7, 2, 11, L(G));
      c.rect(3, 2, 5, 6, G);
      c.row(1, 3, 4, G);
      c.row(4, 6, 8, C.brass);
      c.set(8, 5, C.brass);
      c.speckle(1, 2, 10, b, C.rust, 12, 3);
      if (u) {
        c.set(8, 6, WATERL);
        c.row(7, 4, 10, WATER);
        c.col(11, 10, 15, WATER);
        c.row(b, 10, 12, WATER);
      }
    },
  });
  {
    const PD = hex('#3d4654');
    T('pay-display-machine', 'parking ticket machine pay and display coins screen street', {
      w: 12, h: 30, solid: true, sum: [0, 0, 1],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 3, 10, b - 1, PD);
        c.row(2, 2, 9, PD);
        c.col(1, 3, b - 1, L(PD));
        c.row(3, 1, 10, L(PD));
        c.rect(1, b - 1, 10, b, CONCD);
        c.rect(3, 5, 8, 11, hex('#34507a'));
        txt(c, 5, 6, 'P', C.bone);
        c.rect(3, 13, 8, 15, u ? hex('#7fae7a') : DARK);
        if (u) c.row(14, 4, 6, hex('#2c4a30'));
        c.col(8, 17, 18, C.steel);
        c.rect(3, 17, 4, 18, u ? GREENL : hex('#2c4a30'));
        c.rect(3, 20, 8, 21, DARK);
        if (u) c.rect(4, 21, 6, 23, C.white);
        scribble(c, 3, 24, 8, 25, D(PD), 3);
      },
      sw: 8,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 3, 6, b - 1, PD);
        c.row(2, 2, 5, PD);
        c.rect(1, b - 1, 6, b, CONCD);
        if (u) {
          c.col(6, 13, 15, hex('#7fae7a'));
          c.rect(7, 21, 7, 22, C.white);
        }
      },
    });
  }
  {
    const POSTERS = [[2, 8, 6, 9, hex('#8a5a4a')], [9, 7, 6, 7, hex('#4f6470')], [3, 29, 6, 8, hex('#7a7040')], [10, 27, 5, 10, hex('#5a4a5e')], [10, 15, 5, 11, hex('#8a8a70')]];
    const column = (side) => (c, u) => {
      const b = c.h - 2;
      c.rect(2, 6, 15, b - 2, C.parchment);
      POSTERS.forEach(([x, y, w, h, col], i) => {
        const xx = side ? 17 - x - w : x;
        c.rect(xx, y, xx + w - 1, y + h - 1, col);
        c.rect(xx, y, xx + w - 1, y + 1, i % 2 ? C.bone : DARK);
        scribble(c, xx + 1, y + 3, xx + w - 2, y + h - 2, i % 2 ? DARK : C.bone, i + 2);
      });
      const px = side ? 9 : 3;
      c.rect(px, 18, px + 5, 27, C.white);
      if (u) {
        c.poly([[px, 18], [px + 5, 18], [px + 5, 24], [px + 2, 27], [px, 26]], hex('#2a2430'));
        c.row(21, px + 1, px + 4, C.bone);
        c.row(22, px, px + 5, C.bone);
        c.row(23, px + 1, px + 4, C.bone);
        c.rect(px + 2, 21, px + 3, 23, hex('#6a2a2a'));
        c.set(px + 2, 22, DARK);
        c.poly([[px + 3, 27], [px + 5, 25], [px + 5, 29]], C.white);
        dots(c, C.white, [px + 1, b, px + 4, b - 1]);
      } else {
        c.row(18, px, px + 5, C.blood);
        c.rect(px + 1, 20, px + 4, 23, C.flesh);
        c.row(20, px + 1, px + 4, C.woodDark);
        dots(c, DARK, [px + 2, 22, px + 4, 22]);
        c.row(25, px + 1, px + 4, C.slate);
      }
      for (let y = 6; y <= b - 2; y++) {
        for (const x of [14, 15]) c.set(x, y, mix(c.get(x, y), x === 15 ? 0.6 : 0.8));
        c.set(2, y, mix(c.get(2, y), 1.15));
      }
      c.rect(1, 4, 16, 5, SIGNG);
      c.row(4, 1, 16, L(SIGNG));
      c.row(3, 2, 15, SIGNG);
      c.row(2, 4, 13, SIGNG);
      c.row(1, 7, 10, D(SIGNG));
      c.rect(1, b - 1, 16, b, CONCD);
    };
    T('advert-column-posters', 'advertising column poster pillar round playbills missing poster torn eye', {
      w: 18, h: 42, solid: true,
      f: column(false),
      sw: 18,
      s: column(true),
    });
  }
  T('bike-rack-hoops', 'bicycle rack steel hoops stands locked wheel stolen bike', {
    w: 30, h: 14, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (let i = 0; i < 4; i++) {
        const x = 2 + i * 7;
        c.col(x, 3, b, C.steel);
        c.col(x + 4, 3, b, mix(C.steel, 0.8));
        c.row(2, x + 1, x + 3, L(C.steel));
      }
      if (u) {
        dots(c, DARK, [11, b, 12, b, 14, b, 15, b - 1]);
        c.set(13, b, C.brass);
      } else {
        ring(c, 12, b - 4, 4, TYRE, C.steel);
        c.rect(13, b - 9, 15, b - 6, DARK);
        c.set(14, b - 7, C.brass);
        c.line(12, b - 4, 10, b - 9, hex('#3f5f5c'));
      }
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 4, b, C.steel);
      c.col(3, 2, b, L(C.steel));
      if (u) dots(c, DARK, [5, b, 6, b]);
      else {
        c.col(5, b - 8, b, TYRE);
        c.set(5, b - 9, hex('#3f5f5c'));
        c.set(6, b - 7, DARK);
      }
    },
  });
  T('pavement-sign-chalkboard', 'pavement sign a-board chalkboard cafe sandwich board tea run', {
    w: 17, h: 19,
    f(c, u) {
      const b = c.h - 2,
        BB = hex('#23262a');
      c.rect(1, 1, 15, 14, C.wood);
      c.row(1, 1, 15, L(C.wood));
      c.rect(2, 2, 14, 13, BB);
      legs(c, [1, 14], 15, b, C.woodDark, 2);
      if (u) {
        c.dither(3, 9, 13, 12, hex('#3a3d40'));
        txt(c, 3, 3, 'RUN', C.bone);
        dots(c, C.bone, [3, 8, 3, 9, 8, 8, 13, 8, 13, 9, 13, 10]);
      } else {
        txt(c, 3, 3, 'TEA', C.bone);
        c.row(10, 4, 8, C.ash);
        c.row(12, 4, 6, C.ash);
        txt(c, 11, 9, '2', hex('#b0a050'));
      }
    },
    sw: 11,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, 1, 2, b, C.wood);
      c.line(4, 1, 1, b, C.woodLight);
      c.line(6, 1, 9, b, C.woodDark);
      c.row(11, 4, 7, C.iron);
      c.set(5, 1, C.iron);
    },
  });
  T('street-clock-post', 'street clock on a post public clock cast iron stopped cracked', {
    w: 14, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2,
        G = SIGNG;
      c.rect(6, 13, 7, b - 5, G);
      c.col(6, 13, b - 5, L(G));
      c.rect(5, b - 5, 8, b - 4, G);
      c.rect(4, b - 3, 9, b, D(G));
      c.row(b - 3, 4, 9, G);
      c.row(16, 5, 8, G);
      dots(c, G, [4, 13, 9, 13, 3, 12, 10, 12]);
      c.oval(1, 1, 12, 12, G);
      c.oval(2, 2, 11, 11, C.bone);
      dots(c, DARK, [6, 2, 7, 2, 6, 11, 7, 11, 2, 6, 2, 7, 11, 6, 11, 7]);
      if (u) {
        c.line(6, 6, 6, 9, DARK);
        c.line(7, 6, 7, 10, DARK);
        c.line(3, 4, 6, 5, C.slate);
        c.line(6, 5, 8, 8, C.slate);
        c.line(8, 8, 10, 8, C.slate);
        c.line(8, 4, 9, 2, C.slate);
        dots(c, C.glassLight, [5, b - 1, 9, b]);
      } else {
        c.line(6, 6, 4, 5, DARK);
        c.line(7, 6, 9, 3, DARK);
      }
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2,
        G = SIGNG;
      c.rect(3, 13, 4, b - 5, G);
      c.col(3, 13, b - 5, L(G));
      c.rect(2, b - 5, 5, b - 4, G);
      c.rect(1, b - 3, 6, b, D(G));
      c.row(b - 3, 1, 6, G);
      c.row(16, 2, 5, G);
      c.rect(2, 1, 5, 12, G);
      c.col(2, 1, 12, L(G));
      c.col(1, 3, 10, C.bone);
      c.col(6, 3, 10, C.bone);
      if (u) c.set(6, 6, C.slate);
      if (u) c.set(6, b, C.glassLight);
    },
  });
  T('grit-bin-yellow', 'grit bin yellow salt box roadside winter lid', {
    w: 22, h: 15, solid: true, um: [0, 6, 0], sum: [0, 6, 0],
    f(c, u) {
      const b = c.h - 2,
        Y = GRITY,
        SALT = hex('#c9c2b0');
      c.rect(1, 6, 20, b, Y);
      c.col(1, 6, b, L(Y));
      txt(c, 4, 7, 'GRIT', hex('#3a3222'));
      c.row(b, 1, 20, D(Y));
      c.speckle(1, 6, 20, b, D(Y), 12, 3);
      if (u) {
        c.rect(1, -5, 20, 1, D(Y));
        c.row(-5, 1, 20, Y);
        c.rect(2, 2, 19, 5, SALT);
        c.row(2, 2, 19, D(Y));
        dots(c, C.ash, [4, 4, 9, 5, 15, 4, 12, 3]);
        c.rect(13, 3, 15, 4, hex('#8f3b30'));
        c.set(16, 3, hex('#8f3b30'));
        dots(c, C.blood, [6, 4, 7, 5, 8, 4]);
      } else {
        c.poly([[1, 5], [3, 2], [18, 2], [20, 5]], L(Y));
        c.row(2, 3, 18, mix(Y, 1.35));
        c.row(5, 1, 20, D(Y));
        c.rect(9, 4, 12, 4, D(Y));
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2,
        Y = GRITY;
      sideBox(c, 1, 6, 12, b, Y);
      if (u) {
        c.rect(1, -5, 2, 5, D(Y));
        c.col(1, -5, 5, Y);
        c.rect(3, 3, 11, 5, hex('#c9c2b0'));
        c.set(8, 3, hex('#8f3b30'));
      } else {
        c.poly([[1, 5], [2, 2], [12, 3], [13, 5]], L(Y));
        c.row(5, 1, 13, D(Y));
      }
    },
  });
  {
    const rags = (c, x, y) => {
      c.col(x, y, y + 6, hex('#7a4a5a'));
      c.col(x + 1, y, y + 4, hex('#8a6470'));
      c.set(x, y + 7, C.flesh);
    };
    const bagS = (c, x0, y0, x1, y1) => {
      c.oval(x0, y0, x1, y1 + 2, BAG);
      c.clearRect(x0, y1 + 1, x1, y1 + 2);
      c.set((x0 + x1) >> 1, y0 - 1, BAG);
      c.set(x0 + 2, y0 + 1, hex('#4a4852'));
    };
    T('clothes-bank-steel', 'clothes bank donation bin steel rags charity chute bags', {
      w: 22, h: 34, solid: true, sum: [0, 0, 4],
      f(c, u) {
        const b = c.h - 2;
        c.rect(1, 3, 20, b, TEALB);
        c.row(2, 2, 19, TEALB);
        c.row(3, 1, 20, L(TEALB));
        c.col(1, 3, b, L(TEALB));
        c.rect(3, 16, 18, 22, C.bone);
        txt(c, 4, 17, 'RAGS', TEALB);
        c.speckle(1, 3, 20, b, C.rust, 14, 2);
        if (u) {
          c.rect(4, 6, 17, 13, DARK);
          c.rect(4, 11, 17, 14, L(TEALB));
          c.row(14, 4, 17, C.steel);
          rags(c, 9, 9);
          c.rect(11, 9, 13, 11, hex('#5a6a4a'));
          c.rect(12, b - 2, 20, b, hex('#7a4a5a'));
          c.row(b - 2, 14, 18, hex('#4f6470'));
          c.rect(8, b - 1, 12, b, hex('#8a8a70'));
          c.set(7, b, C.woodDark);
        } else {
          c.rect(4, 6, 17, 13, D(TEALB));
          c.row(6, 4, 17, mix(TEALB, 0.5));
          c.row(12, 6, 15, C.steel);
          bagS(c, 13, b - 6, 20, b);
          pat(c, 8, b - 1, ['kk..', 'kkkk'], { k: C.woodDark });
        }
      },
      sw: 16,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 1, 3, 12, b, TEALB);
        c.row(2, 2, 11, TEALB);
        c.speckle(1, 3, 12, b, C.rust, 14, 2);
        if (u) {
          c.poly([[13, 6], [17, 10], [17, 12], [13, 14]], L(TEALB));
          c.col(12, 6, 13, DARK);
          rags(c, 15, 12);
          c.rect(13, b - 1, 17, b, hex('#7a4a5a'));
        } else {
          c.rect(13, 6, 13, 13, TEALB);
          c.set(14, 12, C.steel);
          bagS(c, 9, b - 5, 14, b);
        }
      },
    });
  }
  {
    const jar = (c, x, b, u) => {
      c.rect(x, b - 2, x + 1, b, u ? hex('#b05a3a') : hex('#7a2a26'));
      c.set(x, b - 2, u ? LAMP : hex('#5a2020'));
      if (u) c.set(x, b - 3, LAMP);
    };
    T('roadside-memorial-railing', 'roadside memorial flowers tied to railing candles photo teddy bear tribute', {
      w: 24, h: 22, solid: true,
      f(c, u) {
        const b = c.h - 2,
          I = hex('#2c2f36');
        for (let x = 2; x <= 22; x += 4) {
          c.col(x, 2, b, I);
          c.set(x, 1, C.iron);
        }
        c.row(4, 1, 22, I);
        c.row(b - 2, 1, 22, I);
        c.poly([[4, 7], [9, 7], [7, 13], [6, 13]], C.ghost);
        c.line(4, 7, 6, 13, C.white);
        dots(c, hex('#9a5a66'), [4, 6, 6, 5, 8, 6, 5, 7]);
        dots(c, C.mustard, [7, 6, 5, 5]);
        dots(c, C.bone, [9, 6, 6, 7, 8, 7]);
        c.poly([[15, 9], [20, 9], [18, 15], [17, 15]], blend(C.ghost, C.stone, 0.4));
        dots(c, C.rust, [15, 8, 17, 7, 19, 8, 18, 9, 16, 9]);
        dots(c, C.woodDark, [20, 8, 16, 8]);
        c.rect(10, 8, 13, 12, C.brass);
        c.rect(11, 9, 12, 11, C.flesh);
        c.row(9, 11, 12, C.woodDark);
        pat(c, 1, b - 5, ['b..b', 'bbbb', 'bkkb', '.bb.', 'bbbb', 'b..b'], { b: hex('#8a6a48'), k: DARK });
        for (const x of [8, 12, 16]) jar(c, x, b, u);
        c.set(20, b, C.white);
        c.set(21, b, hex('#9a5a66'));
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2,
          I = hex('#2c2f36');
        c.rect(3, 2, 4, b, I);
        c.set(3, 1, C.iron);
        c.poly([[5, 7], [7, 7], [6, 13], [5, 13]], C.ghost);
        dots(c, hex('#9a5a66'), [5, 6, 7, 6]);
        dots(c, C.mustard, [6, 5]);
        c.rect(5, 15, 6, 17, C.brass);
        jar(c, 6, b, u);
        c.rect(1, b - 3, 2, b, hex('#8a6a48'));
      },
    });
  }
  {
    const TB = hex('#3a5a8a');
    const tapeCol = (i) => (Math.floor(i / 3) % 2 ? C.white : TB);
    const stand = (c, x, b) => {
      c.rect(x, 3, x + 1, b - 1, C.iron);
      c.col(x, 3, b - 1, L(C.iron));
      c.rect(x - 2, b - 1, x + 3, b, C.ironDark);
      c.row(2, x, x + 1, hex('#a83a30'));
    };
    T('police-tape-cordon', 'police tape cordon crime scene do not cross blue white posts', {
      w: 38, h: 18, solid: true,
      f(c, u) {
        const b = c.h - 2;
        stand(c, 3, b);
        stand(c, 33, b);
        if (u) {
          for (let i = 0; i <= 10; i++) {
            const x = 5 + Math.round(i * 0.7),
              y = 5 + i;
            c.set(x, y, tapeCol(i));
            c.set(x + 1, y, tapeCol(i));
          }
          for (let x = 12; x <= 24; x++) c.set(x, b - (x % 7 === 0 ? 1 : 0), tapeCol(x));
          for (let i = 0; i < 5; i++) c.set(32 - i, 5 + i, tapeCol(i));
          c.set(28, 8, TB);
        } else
          for (let x = 5; x <= 32; x++) {
            const y = 5 + Math.round(2 * Math.sin(((x - 5) / 27) * Math.PI));
            c.set(x, y, tapeCol(x));
            c.set(x, y + 1, tapeCol(x));
          }
      },
      sw: 7,
      s(c, u) {
        const b = c.h - 2;
        stand(c, 3, b);
        if (u) c.col(5, 5, b - 1, TB);
        if (u) dots(c, C.white, [5, 7, 5, 10, 5, 13]);
        if (!u) c.rect(2, 5, 5, 6, TB);
        if (!u) c.set(5, 5, C.white);
      },
    });
  }
  {
    const MOP = hex('#7a3a34');
    T('moped-delivery-box', 'moped scooter delivery box pizza courier parked', {
      w: 10, h: 22, solid: true, base: 'side', sum: [0, 3, 0], um: [0, 3, 0],
      sw: 28,
      s(c, u) {
        const b = c.h - 2;
        wheel(c, 5, b - 3, 3, C.iron);
        wheel(c, 22, b - 3, 3, C.iron);
        c.poly([[2, b - 9], [12, b - 9], [13, b - 5], [8, b - 4], [3, b - 5]], MOP);
        c.row(b - 9, 2, 12, L(MOP));
        c.rect(9, b - 4, 18, b - 3, MOP);
        c.row(b - 3, 9, 18, D(MOP));
        c.line(18, b - 4, 20, 7, MOP);
        c.line(19, b - 4, 21, 7, D(MOP));
        c.line(21, 10, 22, b - 5, C.steel);
        c.row(6, 18, 21, C.black);
        c.set(18, 5, C.steel);
        c.rect(21, 8, 22, 9, u ? LAMP : C.glassLight);
        if (u) dots(c, LAMP, [24, 8, 26, 7, 26, 9]);
        c.rect(4, b - 11, 12, b - 10, C.black);
        c.rect(1, 3, 9, b - 12, DIRTW);
        c.col(1, 3, b - 12, L(DIRTW));
        c.row(b - 12, 1, 9, D(DIRTW));
        c.rect(1, 5, 9, 5, FADEDRED);
        c.set(1, b - 6, hex('#7a2a26'));
        if (u) {
          c.row(3, 1, 9, DARK);
          c.line(1, 2, 8, -1, DIRTW);
          c.line(1, 1, 7, -2, L(DIRTW));
          c.rect(3, 3, 7, 3, CARD);
        } else c.row(3, 1, 9, L(DIRTW));
      },
      f(c, u) {
        const b = c.h - 2;
        c.rect(4, b - 6, 5, b, TYRE);
        c.rect(2, 9, 7, b - 5, MOP);
        c.col(2, 9, b - 5, L(MOP));
        c.rect(3, 7, 6, 8, MOP);
        c.rect(4, 7, 5, 8, u ? LAMP : C.glassLight);
        if (u) dots(c, LAMP, [2, 7, 7, 7]);
        c.row(6, 1, 8, C.black);
        c.set(1, 5, C.steel);
        c.set(8, 5, C.steel);
        c.rect(2, 2, 7, 5, DIRTW);
        c.row(4, 2, 7, FADEDRED);
        if (u) {
          c.rect(2, -1, 7, 1, L(DIRTW));
          c.row(2, 2, 7, CARD);
        }
      },
    });
  }
};
