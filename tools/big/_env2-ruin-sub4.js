/* env-suburban, part 4: indoors — kitchen, lounge, bedroom, garage. Part of tools/big/env2-ruin.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring } = X;
  const { bricks, planks, boards, rust, tins, tin, bottle, litter, flame, smoke, pool, crate, mesh, grass, pane, screen, drip } = X;
  const { TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, CARD, WATER, WATERL, SMOKE, VINYL, WARM } = X;
  setCat('env-suburban', 'Suburban');

  const RED = hex('#a8403a'),
    YEL = hex('#b8a03a'),
    PINK = hex('#b87a84'),
    MINT = hex('#8fa898'),
    TOP = hex('#c9c2aa'),
    AVO = hex('#7a8450'),
    APPL = hex('#c2beb0'),
    TEAK = hex('#8a5a38'),
    CORD = hex('#7a5a40'),
    FLORAL = hex('#a9a88a'),
    ROSE = hex('#a8606a'),
    PEACH = hex('#c0987a'),
    QUILT = hex('#c2b8a0'),
    PLAID = hex('#7a5a4a'),
    TANK = hex('#3f6a6e');
  const handle = (c, x, y, v) => (v ? c.col(x, y, y + 2, C.steel) : c.row(y, x, x + 2, C.steel));

  /* ---------- kitchen ---------- */
  T('suburban-kitchen-island', 'kitchen island counter cupboards knife block fruit bowl chopping board a knife is missing', {
    w: 38, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 8, 35, b - 2, MINT);
      c.rect(2, b - 1, 35, b, hex('#3a3830'));
      for (const x of [2, 13, 24]) {
        c.frame(x + 1, 13, x + 9, b - 3, D(MINT));
        handle(c, x + 4, 14, false);
      }
      /* drawers */
      for (const x of [3, 14, 25]) {
        const out = u && x === 14;
        c.rect(x, 9 + (out ? 0 : 0), x + 8, 11, out ? L(MINT) : mix(MINT, 0.94));
        c.frame(x, 9, x + 8, 11, D(MINT));
        handle(c, x + 3, 10, false);
        if (out) {
          c.rect(x - 1, 9, x + 9, 12, L(MINT));
          c.frame(x - 1, 9, x + 9, 12, D(MINT));
          c.row(9, x, x + 8, DARK);
          dots(c, C.steel, [x + 2, 9, x + 5, 9, x + 7, 9]);
          handle(c, x + 3, 11, false);
        }
      }
      c.rect(1, 6, 36, 7, TOP);
      c.row(6, 1, 36, L(TOP));
      c.row(7, 1, 36, D(TOP));
      /* knife block */
      c.poly([[4, 5], [9, 5], [9, 1], [6, 0]], TEAK);
      for (let i = 0; i < 3; i++) if (!(u && i === 1)) c.line(5 + i * 2 - 1, -1 + (i ? 0 : 1), 5 + i * 2 - 2, -3 + (i ? 0 : 1), DARK);
      if (u) c.set(7, 0, DARK);
      /* fruit bowl */
      c.poly([[13, 3], [21, 3], [19, 5], [15, 5]], hex('#6f8a9a'));
      dots(c, RED, [15, 2, 16, 1]);
      dots(c, YEL, [17, 2, 19, 2, 18, 1]);
      dots(c, hex('#6a8a4a'), [14, 2, 20, 2]);
      /* board */
      c.rect(25, 5, 34, 5, C.woodPale);
      if (u) {
        c.rect(27, 4, 29, 4, hex('#8a2a2a'));
        dots(c, hex('#8a2a2a'), [31, 4, 33, 5, 30, 5]);
        drip(c, 33, 6, 5, hex('#8a2a2a'));
        c.set(33, b, hex('#8a2a2a'));
      } else {
        c.rect(27, 3, 30, 4, hex('#8a5a3a'));
        c.row(3, 27, 30, hex('#b08a5a'));
      }
    },
    sw: 16, sm: [0, 4, 0], sum: [0, 4, 0], m: [0, 4, 0], um: [0, 4, 0],
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 8, 13, b - 2, MINT);
      c.rect(2, b - 1, 13, b, hex('#3a3830'));
      c.frame(4, 10, 11, b - 4, D(MINT));
      c.rect(1, 6, 14, 7, TOP);
      c.row(6, 1, 14, L(TOP));
      c.poly([[5, 5], [9, 5], [9, 1], [7, 0]], TEAK);
      c.line(6, -1, 5, -3, DARK);
      if (!u) c.line(8, -1, 7, -3, DARK);
      else {
        c.rect(14, 9, 15, 12, L(MINT));
        drip(c, 12, 6, 5, hex('#8a2a2a'));
      }
    },
  });

  T('suburban-fridge-magnets', 'fridge freezer with magnets children drawing shopping list kitchen door open light on', {
    w: 20, h: 38, solid: true, um: [0, 0, 9],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 17, b, APPL);
      c.row(2, 2, 17, L(APPL));
      c.col(2, 2, b, L(APPL));
      c.rect(2, b, 17, b, hex('#3a3830'));
      c.row(12, 2, 17, D(APPL));
      c.col(15, 5, 10, C.steel);
      /* the freezer door: magnets, a list */
      dots(c, RED, [5, 5]);
      dots(c, YEL, [9, 4]);
      dots(c, hex('#3d5a8a'), [12, 8]);
      c.rect(6, 6, 9, 10, C.paper);
      scribble(c, 7, 7, 8, 10, C.slate, 2);
      if (u) {
        c.rect(3, 14, 16, b - 1, hex('#d8d4b8'));
        for (const y of [20, 26, 32]) c.row(y, 3, 16, hex('#8fa0a0'));
        c.rect(4, 15, 6, 19, C.white);
        c.set(5, 14, hex('#3d5a8a'));
        bottle(c, 8, 19, 5, hex('#3f5f48'));
        c.rect(11, 17, 15, 19, hex('#b9b6a8'));
        tins(c, 4, 15, 25, 4, 4, 0.8);
        /* a covered plate; one small cake with a candle */
        c.rect(5, 30, 10, 31, C.white);
        c.rect(6, 28, 9, 29, PINK);
        c.col(7, 26, 27, C.bone);
        c.set(7, 25, C.flameLight);
        c.rect(4, 33, 15, b - 1, hex('#b8ccd0'));
        c.rect(5, 34, 9, b - 2, hex('#6a8a4a'));
        /* the door */
        c.rect(18, 13, 24, b - 1, mix(APPL, 0.82));
        c.frame(18, 13, 24, b - 1, D(APPL));
        for (const y of [19, 27]) c.row(y, 19, 23, hex('#8a8a80'));
        bottle(c, 20, 26, 5, hex('#6a4a2c'));
        c.rect(22, 16, 23, 18, C.white);
        c.row(b, 18, 26, mix(WARM, 0.6));
      } else {
        c.col(15, 15, 22, C.steel);
        /* a child's drawing: the family, and one more */
        c.rect(5, 16, 13, 25, C.white);
        for (const [x, h, col] of [[6, 5, hex('#3d5a8a')], [8, 5, RED], [10, 3, YEL], [12, 6, DARK]]) {
          c.col(x, 23 - h + 1, 23, col);
          c.set(x, 23 - h, C.flesh);
        }
        c.set(12, 17, DARK);
        c.row(24, 6, 12, hex('#6a8a4a'));
        dots(c, RED, [5, 16]);
        dots(c, hex('#6a8a4a'), [13, 16]);
        c.rect(6, 29, 10, 32, C.paper);
        c.row(30, 7, 9, C.slate);
        dots(c, YEL, [8, 28]);
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 2, 11, b - 1, APPL);
      c.rect(2, b, 11, b, hex('#3a3830'));
      c.row(12, 2, 11, D(APPL));
      if (u) {
        c.col(11, 14, b - 1, hex('#d8d4b8'));
        c.rect(12, 13, 12, b - 1, mix(APPL, 0.82));
        c.row(b, 12, 13, mix(WARM, 0.6));
      } else c.rect(12, 15, 12, 22, C.steel);
    },
  });

  T('suburban-oven-range', 'cooker oven range hob saucepan sunday roast oven door open something burning', {
    w: 22, h: 30, solid: true, um: [0, 6, 0], sum: [0, 6, 6],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 8, 19, b, APPL);
      c.col(2, 8, b, L(APPL));
      c.rect(2, b, 19, b, hex('#3a3830'));
      /* splash back with a clock */
      c.rect(2, 2, 19, 6, mix(APPL, 0.92));
      c.row(2, 2, 19, L(APPL));
      c.rect(9, 3, 12, 5, hex('#2a2e30'));
      c.set(10, 4, GREENL);
      c.rect(1, 7, 20, 8, hex('#3a3a40'));
      c.row(7, 1, 20, hex('#55555f'));
      /* knobs */
      for (let x = 4; x <= 16; x += 4) c.rect(x, 10, x + 1, 11, x === 8 && u ? RED : DARK);
      /* pan */
      c.rect(4, 4, 9, 6, C.steel);
      c.row(4, 4, 9, L(C.steel));
      c.row(5, 10, 12, DARK);
      if (u) {
        dots(c, C.flame, [4, 7, 6, 7, 8, 7]);
        smoke(c, 6, 3, 8, hex('#9a9a94'), 3);
        /* the door let down */
        c.rect(4, 14, 17, b - 6, hex('#3a2a24'));
        c.row(18, 4, 17, C.iron);
        c.rect(6, 19, 15, 22, hex('#2a1a14'));
        c.row(19, 7, 14, hex('#4a2a1a'));
        dots(c, C.flame, [5, 23, 16, 23, 9, 23, 12, 23]);
        c.rect(3, b - 5, 18, b - 1, mix(APPL, 0.85));
        c.frame(3, b - 5, 18, b - 1, D(APPL));
        c.rect(6, b - 4, 15, b - 2, hex('#2a2e30'));
        smoke(c, 14, 13, 9, hex('#5a5a5e'), 6);
      } else {
        c.rect(4, 14, 17, b - 2, mix(APPL, 0.94));
        c.frame(4, 14, 17, b - 2, D(APPL));
        c.rect(6, 17, 15, 23, hex('#2a2e30'));
        c.line(7, 22, 10, 18, hex('#3e464a'));
        c.rect(6, 15, 15, 15, C.steel);
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 8, 13, b - 1, APPL);
      c.rect(2, b, 13, b, hex('#3a3830'));
      c.rect(2, 2, 3, 7, mix(APPL, 0.92));
      c.rect(1, 7, 14, 8, hex('#3a3a40'));
      c.rect(6, 4, 10, 6, C.steel);
      c.row(5, 11, 13, DARK);
      if (u) {
        smoke(c, 8, 3, 8, hex('#9a9a94'), 3);
        c.rect(14, b - 6, 19, b - 5, mix(APPL, 0.85));
        c.row(b - 4, 14, 19, D(APPL));
        c.col(13, 14, b - 7, hex('#3a2a24'));
        dots(c, C.flame, [14, 22, 14, 19]);
        smoke(c, 15, 13, 7, hex('#5a5a5e'), 6);
      } else c.rect(14, 15, 14, 16, C.steel);
    },
  });

  T('suburban-washing-machine', 'washing machine front loader laundry utility room spinning the water has gone red', {
    w: 20, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 17, b, APPL);
      c.row(2, 2, 17, L(APPL));
      c.col(2, 2, b, L(APPL));
      c.rect(2, b, 17, b, hex('#3a3830'));
      c.row(6, 2, 17, D(APPL));
      c.rect(4, 3, 8, 5, mix(APPL, 0.9));
      c.rect(14, 3, 15, 4, DARK);
      c.set(11, 4, u ? REDL : hex('#5a2622'));
      c.oval(4, 8, 15, 19, C.steel);
      c.oval(5, 9, 14, 18, hex('#2a2e30'));
      if (u) {
        c.oval(6, 10, 13, 17, hex('#7a2a2e'));
        c.line(7, 13, 10, 11, PINK);
        c.line(9, 16, 12, 13, hex('#5a1a20'));
        dots(c, C.white, [7, 15, 11, 12, 12, 16]);
        drip(c, 9, 19, 2, hex('#7a2a2e'));
        c.row(b, 6, 13, hex('#7a2a2e'));
        dots(c, hex('#8a8a80'), [0, 8, 19, 12, 0, 16]);
      } else {
        c.oval(6, 10, 13, 17, hex('#3a4a52'));
        c.line(7, 13, 9, 11, hex('#5d7f8c'));
        c.rect(8, 14, 11, 16, C.white);
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 2, 13, b - 1, APPL);
      c.rect(2, b, 13, b, hex('#3a3830'));
      c.row(6, 2, 13, D(APPL));
      c.rect(14, 10, 14, 17, C.steel);
      c.line(2, 16, 0, 20, hex('#6f7478'));
      if (u) {
        c.row(b, 12, 15, hex('#7a2a2e'));
        dots(c, hex('#8a8a80'), [15, 6, 0, 10]);
      }
    },
  });

  T('suburban-dining-table-laid', 'dining table laid for dinner gingham cloth chairs plates roast family meal abandoned', {
    w: 40, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const chair = (x, back) => {
        c.rect(back, 3, back + 1, b, TEAK);
        c.rect(x, 12, x + 5, 13, TEAK);
        c.col(back === x ? x + 5 : x, 14, b, D(TEAK));
        for (const y of [5, 8]) c.rect(back, y, back + 1, y, L(TEAK));
      };
      chair(1, 1);
      if (u) {
        /* the far chair thrown over */
        c.rect(31, b - 1, 39, b, TEAK);
        c.col(33, b - 6, b - 2, TEAK);
        c.col(38, b - 6, b - 2, D(TEAK));
      } else chair(33, 37);
      legs(c, [8, 30], 12, b, TEAK);
      c.rect(6, 9, 33, 14, C.white);
      for (let x = 6; x <= 33; x++) for (let y = 9; y <= 14; y++) if (((x >> 1) + (y >> 1)) % 2) c.set(x, y, hex('#b8a0a0'));
      c.row(9, 6, 33, C.white);
      for (let x = 6; x <= 33; x += 3) c.set(x, 15, C.white);
      /* plates, glasses, the roast */
      for (const x of [9, 26]) {
        c.rect(x, 8, x + 4, 8, C.white);
        c.set(x + 5, 6, hex('#9ebcc2'));
        c.set(x + 5, 7, hex('#9ebcc2'));
      }
      c.rect(16, 7, 23, 8, C.steel);
      c.col(19, 2, 5, C.bone);
      if (u) {
        c.rect(17, 5, 20, 6, hex('#7a4a2a'));
        dots(c, C.bone, [21, 6, 22, 5]);
        c.rect(10, 7, 12, 7, hex('#7a4a2a'));
        c.rect(31, 7, 32, 8, hex('#9ebcc2'));
        drip(c, 33, 9, 6, hex('#7a2a3a'));
        c.row(8, 29, 33, hex('#7a2a3a'));
        dots(c, DARK, [18, 2, 22, 3, 14, 4]);
        c.rect(22, b, 25, b, C.white);
        c.set(19, 1, DARK);
      } else {
        c.oval(16, 4, 23, 7, hex('#8a5a34'));
        c.row(4, 18, 21, hex('#a8754a'));
        c.set(19, 1, C.flameLight);
        dots(c, hex('#6a8a4a'), [10, 7, 12, 7, 27, 7, 29, 7]);
      }
    },
    sw: 22,
    s(c, u) {
      const b = c.h - 2;
      /* the end of the table, a chair drawn up to it */
      legs(c, [4, 16], 12, b, TEAK);
      c.rect(2, 9, 19, 14, C.white);
      for (let x = 2; x <= 19; x++) for (let y = 9; y <= 14; y++) if (((x >> 1) + (y >> 1)) % 2) c.set(x, y, hex('#b8a0a0'));
      c.row(9, 2, 19, C.white);
      if (u) {
        c.rect(7, b - 1, 15, b, TEAK);
        c.col(8, b - 6, b - 2, TEAK);
        c.col(14, b - 6, b - 2, D(TEAK));
        c.rect(5, 7, 8, 8, C.white);
        drip(c, 17, 9, 6, hex('#7a2a3a'));
      } else {
        c.rect(7, 3, 14, 12, TEAK);
        c.rect(8, 5, 13, 10, D(TEAK));
        for (const x of [9, 12]) c.col(x, 5, 10, TEAK);
        c.rect(7, 15, 8, b, D(TEAK));
        c.rect(13, 15, 14, b, D(TEAK));
        c.oval(8, 5, 13, 8, hex('#8a5a34'));
        c.rect(2, 9, 19, 14, C.white);
        for (let x = 2; x <= 19; x++) for (let y = 9; y <= 14; y++) if (((x >> 1) + (y >> 1)) % 2) c.set(x, y, hex('#b8a0a0'));
        c.rect(7, 3, 14, 6, TEAK);
        c.row(3, 7, 14, L(TEAK));
        c.oval(8, 6, 13, 8, hex('#8a5a34'));
      }
    },
  });

  T('suburban-high-chair', 'baby high chair tray bowl spoon bib feeding kitchen bowl thrown food everywhere', {
    w: 16, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(4, 14, 2, b, VINYL);
      c.line(11, 14, 13, b, D(VINYL));
      c.row(b - 4, 3, 12, VINYL);
      c.rect(4, 2, 11, 12, hex('#b0a070'));
      c.row(2, 4, 11, hex('#c9ba8a'));
      for (let y = 4; y < 12; y += 3) for (let x = 5; x < 11; x += 3) c.set(x + ((y / 3) & 1), y, hex('#8a7a50'));
      c.rect(2, 12, 13, 13, VINYL);
      c.row(12, 2, 13, L(VINYL));
      c.rect(4, 14, 11, 15, D(VINYL));
      if (u) {
        dots(c, hex('#b08a4a'), [3, 11, 9, 11, 12, 11, 6, 6, 9, 4, 7, 9]);
        drip(c, 12, 14, 3, hex('#b08a4a'));
        c.rect(1, b - 1, 4, b, hex('#6f8a9a'));
        c.row(b, 5, 8, hex('#b08a4a'));
        c.rect(10, b, 13, b, C.steel);
      } else {
        c.rect(5, 10, 9, 11, hex('#6f8a9a'));
        c.row(10, 6, 8, hex('#b08a4a'));
        c.line(10, 11, 12, 9, C.steel);
        c.rect(6, 5, 9, 7, C.white);
        c.set(7, 6, hex('#3d5a8a'));
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      c.line(4, 14, 2, b, VINYL);
      c.line(8, 14, 11, b, D(VINYL));
      c.row(b - 4, 3, 10, VINYL);
      c.rect(3, 2, 4, 13, hex('#b0a070'));
      c.rect(3, 13, 9, 14, D(VINYL));
      c.rect(6, 11, 12, 12, VINYL);
      if (u) {
        drip(c, 12, 13, 3, hex('#b08a4a'));
        c.rect(10, b, 13, b, hex('#6f8a9a'));
      } else c.rect(8, 9, 11, 10, hex('#6f8a9a'));
    },
  });

  /* ---------- lounge ---------- */
  T('suburban-recliner-armchair', 'recliner armchair brown corduroy la-z-boy footrest up newspaper someone was just here', {
    w: 22, h: 26, solid: true, sum: [0, 0, 8],
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 2, 17, 15, CORD);
      c.row(2, 5, 16, L(CORD));
      c.clear(4, 2);
      c.clear(17, 2);
      for (let x = 6; x < 17; x += 2) c.col(x, 4, 14, mix(CORD, 0.88));
      c.rect(1, 11, 4, b - 2, CORD);
      c.rect(17, 11, 20, b - 2, CORD);
      c.row(11, 1, 4, L(CORD));
      c.row(11, 17, 20, L(CORD));
      c.rect(5, 15, 16, 18, mix(CORD, 0.9));
      c.rect(2, 19, 19, b - 1, mix(CORD, 0.8));
      c.rect(2, b, 4, b, DARK);
      c.rect(17, b, 19, b, DARK);
      c.rect(20, 14, 20, 17, C.woodDark);
      if (u) {
        /* footrest up towards us, the dent of someone, a paper */
        c.rect(4, 17, 17, 22, CORD);
        c.row(17, 4, 17, L(CORD));
        for (let x = 6; x < 17; x += 2) c.col(x, 18, 22, mix(CORD, 0.88));
        c.row(23, 5, 16, DARK);
        c.oval(8, 6, 13, 11, mix(CORD, 0.75));
        c.rect(7, 13, 14, 16, C.paper);
        scribble(c, 8, 14, 13, 16, C.slate, 4);
        c.set(20, 13, C.woodDark);
      } else {
        c.rect(6, 4, 15, 7, C.bone);
        for (let x = 7; x < 15; x += 2) c.set(x, 7, mix(C.bone, 0.8));
      }
    },
    sw: 22,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        c.poly([[1, 8], [5, 6], [10, 16], [6, 18]], CORD);
        c.line(1, 8, 5, 6, L(CORD));
        c.rect(6, 15, 18, 19, mix(CORD, 0.9));
        c.rect(5, 12, 16, 15, CORD);
        c.row(12, 5, 16, L(CORD));
        c.rect(5, 19, 17, b - 1, mix(CORD, 0.8));
        c.rect(19, 15, 27, 17, CORD);
        c.row(15, 19, 27, L(CORD));
        c.line(18, 19, 22, 18, C.iron);
        c.rect(11, 13, 16, 14, C.paper);
      } else {
        c.rect(3, 2, 7, 18, CORD);
        c.col(3, 2, 18, L(CORD));
        c.rect(8, 15, 18, 19, mix(CORD, 0.9));
        c.rect(6, 11, 17, 14, CORD);
        c.row(11, 6, 17, L(CORD));
        c.rect(4, 19, 18, b - 1, mix(CORD, 0.8));
        c.rect(3, 3, 4, 6, C.bone);
        c.col(18, 14, 18, C.woodDark);
        c.set(19, 13, C.woodDark);
      }
      c.rect(5, b, 7, b, DARK);
      c.rect(15, b, 17, b, DARK);
    },
  });

  T('suburban-television-console', 'television set wooden console tv aerial family photo living room emergency broadcast', {
    w: 30, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 8, 27, b - 4, TEAK);
      c.row(8, 2, 27, L(TEAK));
      c.col(2, 8, b - 4, L(TEAK));
      c.row(b - 4, 2, 27, D(TEAK));
      legs(c, [4, 24], b - 3, b, C.woodDark);
      c.rect(4, 10, 19, b - 6, hex('#2a2a30'));
      if (u) {
        screen(c, 5, 11, 18, b - 7, true, 'bars');
        c.rect(5, b - 10, 18, b - 9, DARK);
        dots(c, C.white, [6, b - 10, 8, b - 10, 9, b - 9, 11, b - 10, 13, b - 9, 15, b - 10, 17, b - 10]);
        c.rect(9, 13, 14, 17, DARK);
        c.rect(11, 14, 12, 16, C.white);
        dots(c, hex('#9fb0ac'), [3, b, 8, b, 14, b, 20, b]);
      } else {
        screen(c, 5, 11, 18, b - 7, false);
        c.line(7, 16, 10, 12, hex('#39454a'));
      }
      /* speaker cloth and knobs */
      c.rect(21, 10, 25, 17, hex('#6a5a3a'));
      for (let y = 11; y <= 17; y += 2) c.row(y, 21, 25, hex('#85734c'));
      c.rect(21, 19, 22, 20, C.brass);
      c.rect(24, 19, 25, 20, C.brass);
      c.set(23, b - 6, u ? REDL : DARK);
      /* aerial and a photograph */
      c.line(10, 7, 6, 1, C.steel);
      c.line(11, 7, 15, 1, C.steel);
      c.rect(9, 6, 12, 7, DARK);
      c.rect(19, 3, 24, 7, C.brass);
      c.rect(20, 4, 23, 6, hex('#8a8a80'));
      dots(c, C.flesh, [21, 5, 22, 5]);
      c.rect(2, 7, 27, 7, C.white);
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 8, 11, b - 4, TEAK);
      legs(c, [3, 9], b - 3, b, C.woodDark, 1);
      c.rect(2, 7, 11, 7, C.white);
      c.col(6, 1, 6, C.steel);
      c.rect(8, 3, 9, 7, C.brass);
      c.col(12, 11, b - 7, u ? hex('#9fb0ac') : hex('#2a2a30'));
      if (u) dots(c, hex('#9fb0ac'), [13, 13, 13, 17, 13, b]);
      for (let y = 11; y < b - 6; y += 2) c.row(y, 4, 7, D(TEAK));
    },
  });

  T('suburban-sofa-plastic-cover', 'sofa settee floral under a clear plastic cover front room kept for best torn open stain', {
    w: 42, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 3, 37, 14, FLORAL);
      c.row(3, 5, 36, L(FLORAL));
      c.clear(4, 3);
      c.clear(37, 3);
      c.rect(1, 9, 5, b - 2, FLORAL);
      c.rect(36, 9, 40, b - 2, FLORAL);
      c.row(9, 1, 5, L(FLORAL));
      c.row(9, 36, 40, L(FLORAL));
      c.rect(6, 14, 35, 17, mix(FLORAL, 0.92));
      c.rect(2, 18, 39, b - 1, mix(FLORAL, 0.84));
      for (const x of [16, 26]) c.col(x, 4, 17, D(FLORAL));
      const r = rnd(8);
      for (let i = 0; i < 26; i++) {
        const x = 3 + ((r() * 36) | 0),
          y = 4 + ((r() * 15) | 0);
        if (c.get(x, y)) {
          c.set(x, y, ROSE);
          c.set(x + 1, y + 1, hex('#6a8a6a'));
        }
      }
      c.rect(3, b, 5, b, C.woodDark);
      c.rect(36, b, 38, b, C.woodDark);
      /* the plastic */
      const sh = (x0, y0, x1, y1) => c.line(x0, y0, x1, y1, hex('#d8dcd4'));
      if (u) {
        sh(7, 12, 11, 5);
        c.poly([[19, 6], [25, 7], [27, 15], [22, 17], [18, 13]], hex('#5a3a3a'));
        c.poly([[20, 8], [24, 9], [25, 14], [22, 15]], hex('#3e2a2c'));
        c.line(17, 5, 19, 10, hex('#d8dcd4'));
        c.line(26, 5, 28, 11, hex('#d8dcd4'));
        dots(c, hex('#d8dcd4'), [16, 12, 29, 14, 22, 4]);
        c.rect(28, 15, 33, 16, mix(FLORAL, 0.75));
        drip(c, 23, 18, 4, hex('#5a3a3a'));
      } else {
        sh(7, 12, 11, 5);
        sh(19, 13, 23, 6);
        sh(30, 11, 33, 5);
        sh(3, 16, 4, 12);
        c.row(18, 6, 35, hex('#d8dcd4'));
        for (const x of [9, 21, 31]) {
          c.rect(x, 4, x + 3, 5, C.bone);
          c.set(x + 1, 6, C.bone);
        }
      }
    },
    sw: 18,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 6, 18, FLORAL);
      c.col(2, 3, 18, L(FLORAL));
      c.rect(4, 9, 15, 17, FLORAL);
      c.row(9, 4, 15, L(FLORAL));
      c.rect(3, 18, 15, b - 1, mix(FLORAL, 0.84));
      c.oval(11, 9, 15, 13, L(FLORAL));
      dots(c, ROSE, [5, 12, 9, 15, 13, 11, 7, 20, 12, 19, 4, 6]);
      c.rect(3, b, 5, b, C.woodDark);
      c.rect(13, b, 15, b, C.woodDark);
      if (u) {
        dots(c, hex('#d8dcd4'), [8, 8, 7, 6]);
        c.line(7, 4, 9, 8, hex('#5a3a3a'));
      } else {
        c.line(6, 15, 9, 10, hex('#d8dcd4'));
        c.rect(3, 3, 5, 4, C.bone);
      }
    },
  });

  T('suburban-coffee-table-magazines', 'coffee table teak magazines ashtray plastic fruit coasters mug knocked over', {
    w: 30, h: 15, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 6, 28, 7, TEAK);
      c.row(6, 1, 28, L(TEAK));
      legs(c, [3, 25], 8, b, D(TEAK));
      c.rect(4, 10, 25, 10, TEAK);
      c.rect(7, 9, 14, 9, C.paper);
      /* magazines fanned exactly */
      for (const [x, col] of [[3, hex('#6a8aa8')], [6, RED], [9, YEL]]) {
        if (u && x === 9) continue;
        c.rect(x, 5, x + 6, 5, col);
        c.row(4, x + 1, x + 5, C.white);
      }
      c.rect(22, 4, 26, 5, hex('#6f8a80'));
      dots(c, RED, [23, 3]);
      dots(c, YEL, [25, 3]);
      if (u) {
        c.rect(15, 4, 18, 5, C.white);
        c.set(14, 5, C.white);
        c.row(5, 10, 13, hex('#5a3a24'));
        drip(c, 11, 6, 4, hex('#5a3a24'));
        c.row(b, 9, 13, hex('#5a3a24'));
        c.poly([[16, b], [18, b - 3], [24, b - 2], [23, b]], YEL);
        c.line(18, b - 3, 22, b - 1, C.white);
      } else {
        c.rect(16, 3, 18, 5, C.white);
        c.set(19, 4, C.white);
        c.row(3, 16, 18, hex('#5a3a24'));
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 6, 14, 7, TEAK);
      c.row(6, 1, 14, L(TEAK));
      legs(c, [2, 12], 8, b, D(TEAK));
      c.row(10, 3, 12, TEAK);
      c.rect(3, 5, 8, 5, RED);
      c.rect(10, 4, 12, 5, hex('#6f8a80'));
      if (u) {
        drip(c, 6, 6, 4, hex('#5a3a24'));
        c.rect(9, b, 13, b, YEL);
      } else c.rect(5, 3, 7, 4, C.white);
    },
  });

  /* ---------- bedroom, hall, garage ---------- */
  T('suburban-master-bed-floral', 'double bed master bedroom floral quilt padded headboard one side slept in', {
    w: 32, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 29, 12, PEACH);
      c.row(2, 3, 28, L(PEACH));
      c.clear(2, 2);
      c.clear(29, 2);
      for (const [x, y] of [[8, 5], [16, 5], [24, 5], [12, 9], [20, 9]]) c.set(x, y, D(PEACH));
      c.rect(2, 12, 29, b - 3, C.white);
      for (const x of [4, 17]) {
        c.rect(x, 10, x + 10, 14, C.white);
        c.row(10, x, x + 10, L(C.white));
        c.row(14, x, x + 10, mix(C.white, 0.82));
      }
      const quilt = (x0, x1, y0) => {
        c.rect(x0, y0, x1, b - 3, QUILT);
        c.row(y0, x0, x1, L(QUILT));
        for (let y = y0 + 2; y < b - 3; y += 4) for (let x = x0 + 1 + ((y >> 2) % 2) * 2; x < x1; x += 4) {
          c.set(x, y, ROSE);
          c.set(x + 1, y + 1, hex('#6a8a6a'));
        }
      };
      if (u) {
        quilt(16, 29, 16);
        quilt(2, 15, 24);
        c.poly([[2, 24], [15, 24], [15, 21], [9, 20]], mix(QUILT, 0.82));
        c.line(4, 17, 9, 19, mix(C.white, 0.82));
        c.line(11, 16, 13, 20, mix(C.white, 0.82));
        c.oval(6, 11, 12, 14, mix(C.white, 0.86));
        c.col(15, 16, b - 3, D(QUILT));
      } else quilt(2, 29, 16);
      c.rect(2, b - 2, 29, b, hex('#a89880'));
      for (let x = 3; x < 29; x += 3) c.col(x, b - 2, b, hex('#8a7a66'));
    },
    sw: 40, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 3, b, PEACH);
      c.col(1, 2, b, L(PEACH));
      c.rect(4, b - 8, 37, b - 3, C.white);
      c.rect(5, b - 11, 12, b - 8, C.white);
      c.row(b - 11, 5, 12, L(C.white));
      c.row(b - 8, 5, 12, mix(C.white, 0.82));
      const y0 = b - 10;
      if (u) {
        c.poly([[27, b - 8], [29, y0 - 4], [36, y0 - 4], [38, b - 8], [38, b - 3], [27, b - 3]], QUILT);
        c.row(y0 - 4, 29, 36, L(QUILT));
        dots(c, ROSE, [30, y0 - 2, 34, y0, 36, y0 - 2, 31, y0 + 3]);
        c.line(15, b - 8, 19, b - 7, mix(C.white, 0.82));
        c.line(21, b - 8, 24, b - 6, mix(C.white, 0.82));
        c.row(b - 9, 14, 26, mix(C.white, 0.94));
      } else {
        c.rect(13, y0, 38, b - 3, QUILT);
        c.row(y0, 13, 38, L(QUILT));
        c.col(38, y0, b - 3, D(QUILT));
        for (let x = 15; x < 37; x += 4) {
          c.set(x, y0 + 2 + (x % 8 ? 0 : 2), ROSE);
          c.set(x + 1, y0 + 3 + (x % 8 ? 0 : 2), hex('#6a8a6a'));
        }
      }
      c.rect(4, b - 2, 38, b, hex('#a89880'));
      for (let x = 5; x < 38; x += 3) c.col(x, b - 2, b, hex('#8a7a66'));
    },
  });

  T('suburban-telephone-table', 'telephone table hall rotary phone avocado green phone book receiver off the hook dangling', {
    w: 18, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 12, 16, 13, TEAK);
      c.row(12, 1, 16, L(TEAK));
      legs(c, [2, 14], 14, b, D(TEAK));
      c.rect(3, 14, 14, 17, TEAK);
      c.frame(3, 14, 14, 17, D(TEAK));
      c.set(8, 16, C.brass);
      c.rect(3, 22, 14, 22, TEAK);
      c.rect(5, 19, 12, 21, YEL);
      c.row(19, 5, 12, L(YEL));
      /* the telephone */
      c.poly([[4, 11], [5, 7], [12, 7], [13, 11]], AVO);
      c.row(7, 5, 12, L(AVO));
      c.oval(6, 8, 11, 11, C.bone);
      c.rect(8, 9, 9, 10, AVO);
      if (u) {
        c.rect(6, 5, 7, 6, DARK);
        c.rect(10, 5, 11, 6, DARK);
        for (let y = 8; y <= 20; y++) c.set(15 + (y % 2), y, AVO);
        c.rect(15, 21, 17, 22, AVO);
        c.rect(15, 23, 16, b - 2, D(AVO));
        c.rect(15, b - 1, 17, b, AVO);
        dots(c, hex('#8a8a80'), [17, 18, 14, b - 3]);
      } else {
        c.rect(3, 4, 14, 5, AVO);
        c.rect(3, 5, 5, 7, AVO);
        c.rect(12, 5, 14, 7, D(AVO));
        c.row(4, 4, 13, L(AVO));
      }
      c.rect(1, 9, 3, 11, C.paper);
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 12, 12, 13, TEAK);
      c.row(12, 1, 12, L(TEAK));
      legs(c, [2, 10], 14, b, D(TEAK));
      sideBox(c, 3, 14, 10, 17, TEAK);
      c.row(22, 3, 10, TEAK);
      c.rect(4, 19, 9, 21, YEL);
      c.poly([[3, 11], [5, 7], [9, 7], [10, 11]], AVO);
      if (u) {
        for (let y = 8; y <= 20; y++) c.set(11 + (y % 2), y, AVO);
        c.rect(11, 21, 12, b - 1, AVO);
      } else {
        c.rect(5, 4, 8, 5, AVO);
        c.rect(6, 6, 7, 6, D(AVO));
      }
    },
  });

  T('suburban-vacuum-cleaner-upright', 'upright vacuum cleaner hoover cloth bag hall carpet bag burst dust and hair', {
    w: 14, h: 32, solid: false, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 2, 7, 12, C.steel);
      c.rect(5, 1, 8, 2, DARK);
      c.rect(2, b - 4, 11, b, hex('#7a8a9a'));
      c.row(b - 4, 2, 11, hex('#93a3b3'));
      c.rect(4, b - 3, 9, b - 2, u ? LAMP : C.bone);
      c.rect(1, b, 2, b, TYRE);
      c.rect(11, b, 12, b, TYRE);
      if (u) {
        /* the bag split down the seam */
        c.poly([[4, 9], [9, 9], [10, b - 8], [8, b - 5], [5, b - 5], [3, b - 8]], PLAID);
        c.poly([[6, 12], [8, 12], [9, b - 7], [6, b - 6]], DARK);
        c.poly([[10, b], [12, b - 4], [16, b - 3], [18, b]], hex('#7a766e'));
        dots(c, hex('#4a4640'), [12, b - 1, 14, b - 2, 16, b - 1, 13, b - 3]);
        dots(c, hex('#8a867e'), [11, b - 8, 13, b - 10, 15, b - 7, 12, b - 13, 16, b - 11]);
        c.line(13, b - 3, 17, b - 5, hex('#3a2a20'));
      } else {
        c.oval(3, 8, 10, b - 5, PLAID);
        c.col(4, 11, b - 8, L(PLAID));
        for (let y = 11; y < b - 6; y += 3) c.row(y, 4, 9, D(PLAID));
        c.col(7, 9, b - 6, D(PLAID));
        c.rect(5, 14, 8, 16, C.bone);
      }
      c.line(8, 4, 11, 8, DARK);
    },
    sw: 14, sum: [0, 0, 4],
    s(c, u) {
      const b = c.h - 2;
      c.line(4, 2, 7, 13, C.steel);
      c.rect(3, 1, 5, 2, DARK);
      c.rect(3, b - 4, 12, b, hex('#7a8a9a'));
      c.row(b - 4, 3, 11, hex('#93a3b3'));
      c.clear(12, b - 4);
      c.set(12, b - 2, u ? LAMP : C.bone);
      c.rect(3, b - 1, 5, b, TYRE);
      if (u) {
        c.poly([[5, 10], [8, 9], [10, b - 8], [8, b - 5], [6, b - 5]], PLAID);
        c.col(8, 12, b - 7, DARK);
        dots(c, hex('#8a867e'), [11, b - 9, 13, b - 12, 12, b - 6, 14, b - 8]);
        c.row(b, 13, 16, hex('#7a766e'));
      } else {
        c.oval(5, 8, 10, b - 5, PLAID);
        for (let y = 11; y < b - 6; y += 3) c.row(y, 6, 9, D(PLAID));
      }
    },
  });

  T('suburban-ironing-board', 'ironing board iron shirt laundry basket iron left face down scorching smoke', {
    w: 12, h: 28, solid: true, base: 'side', um: [0, 0, 0],
    sw: 36,
    s(c, u) {
      const b = c.h - 2,
        CV = hex('#7a9aa8');
      c.rect(3, 11, 31, 12, CV);
      c.row(11, 3, 31, L(CV));
      c.clear(31, 11);
      c.row(13, 4, 30, C.steel);
      for (let x = 5; x < 31; x += 4) c.set(x, 12, C.white);
      c.line(8, 14, 24, b, C.steel);
      c.line(24, 14, 8, b, C.iron);
      c.row(b, 6, 10, C.iron);
      c.row(b, 22, 26, C.iron);
      /* a shirt half done */
      c.rect(12, 10, 26, 10, C.white);
      c.poly([[20, 11], [27, 11], [26, 19], [22, 20]], C.white);
      c.line(22, 12, 23, 18, mix(C.white, 0.82));
      if (u) {
        c.rect(13, 8, 18, 9, hex('#5a5d64'));
        c.rect(14, 6, 17, 7, DARK);
        c.rect(12, 10, 19, 10, hex('#5a3a24'));
        c.row(10, 14, 17, DARK);
        smoke(c, 13, 7, 8, hex('#7a7a7e'), 3);
        smoke(c, 18, 7, 6, hex('#5a5a5e'), 6);
        dots(c, C.flame, [12, 9, 19, 9]);
      } else {
        c.poly([[3, 10], [4, 5], [7, 4], [8, 10]], hex('#5a5d64'));
        c.col(3, 5, 10, C.steel);
        c.rect(5, 2, 7, 3, DARK);
        c.set(8, 3, DARK);
      }
      /* basket */
      c.poly([[28, b - 6], [35, b - 6], [34, b], [29, b]], C.bone);
      for (let x = 29; x <= 34; x += 2) c.col(x, b - 5, b - 1, mix(C.bone, 0.8));
      c.rect(29, b - 8, 34, b - 7, hex('#b87a84'));
      c.rect(31, b - 9, 33, b - 9, hex('#6a8aa8'));
    },
    f(c, u) {
      const b = c.h - 2,
        CV = hex('#7a9aa8');
      c.rect(2, 11, 9, 12, CV);
      c.row(11, 2, 9, L(CV));
      c.row(13, 3, 8, C.steel);
      c.line(4, 14, 3, b, C.steel);
      c.line(7, 14, 8, b, C.iron);
      c.row(b, 2, 9, C.iron);
      c.rect(3, 13, 8, 19, C.white);
      c.col(5, 14, 19, mix(C.white, 0.82));
      if (u) {
        c.rect(4, 8, 7, 9, hex('#5a5d64'));
        c.rect(5, 6, 6, 7, DARK);
        c.row(10, 3, 8, hex('#5a3a24'));
        smoke(c, 5, 5, 6, hex('#7a7a7e'), 3);
      } else {
        c.poly([[4, 10], [5, 5], [6, 5], [7, 10]], hex('#5a5d64'));
        c.rect(5, 3, 6, 4, DARK);
      }
    },
  });

  T('suburban-aquarium-stand', 'aquarium fish tank on a stand goldfish plants bubbling filter fish floating belly up', {
    w: 28, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2,
        W = u ? hex('#55705a') : TANK;
      c.rect(2, 20, 25, b, TEAK);
      c.row(20, 2, 25, L(TEAK));
      c.col(13, 22, b - 1, D(TEAK));
      c.frame(3, 22, 12, b - 1, D(TEAK));
      c.frame(14, 22, 24, b - 1, D(TEAK));
      dots(c, C.brass, [11, 26, 15, 26]);
      c.rect(2, 3, 25, 5, hex('#2a2c32'));
      c.row(5, 3, 24, u ? LAMP : hex('#55555f'));
      c.rect(3, 6, 24, 19, W);
      c.row(6, 3, 24, L(W));
      c.rect(3, 17, 24, 19, hex('#8a7a5a'));
      dots(c, hex('#a8987a'), [5, 17, 9, 18, 14, 17, 19, 18, 23, 17]);
      for (const [x, h] of [[5, 7], [7, 5], [20, 8], [22, 4]]) c.line(x, 16, x + (h % 2 ? 1 : -1), 16 - h, hex('#4f8a4a'));
      c.rect(12, 13, 16, 16, hex('#8a8a90'));
      c.rect(13, 14, 14, 16, DARK);
      dots(c, hex('#8a8a90'), [12, 12, 14, 12, 16, 12]);
      const fish = (x, y, up) => {
        c.rect(x, y, x + 2, y, up ? hex('#c9b8a0') : hex('#c8742a'));
        c.set(x - 1, y - (up ? 0 : 1), up ? hex('#c9b8a0') : hex('#c8742a'));
        c.set(x - 1, y + (up ? 0 : 1), up ? hex('#a8987a') : hex('#c8742a'));
      };
      if (u) {
        fish(6, 7, true);
        fish(14, 7, true);
        fish(20, 8, true);
        c.speckle(3, 8, 24, 16, hex('#6a8a5a'), 7, 3);
      } else {
        fish(8, 10, false);
        fish(17, 9, false);
        fish(20, 13, false);
        dots(c, WATERL, [11, 8, 10, 10, 11, 12, 4, 7]);
        c.line(4, 15, 6, 8, mix(C.glass, 1.1));
      }
      c.frame(2, 5, 25, 20, hex('#2a2c32'));
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2,
        W = u ? hex('#55705a') : TANK;
      sideBox(c, 2, 20, 11, b, TEAK);
      c.rect(2, 3, 11, 5, hex('#2a2c32'));
      c.rect(3, 6, 10, 19, W);
      c.row(6, 3, 10, L(W));
      c.rect(3, 17, 10, 19, hex('#8a7a5a'));
      c.line(5, 16, 6, 10, hex('#4f8a4a'));
      c.frame(2, 5, 11, 20, hex('#2a2c32'));
      if (u) {
        c.rect(6, 7, 8, 7, hex('#c9b8a0'));
        c.row(5, 3, 10, LAMP);
      } else {
        c.rect(6, 11, 8, 11, hex('#c8742a'));
        dots(c, WATERL, [4, 8, 4, 12]);
      }
    },
  });

  T('suburban-chest-freezer-garage', 'chest freezer in the garage white lid frost frozen food something long wrapped in plastic', {
    w: 34, h: 22, solid: true, m: [0, 2, 0], sm: [0, 2, 0], um: [0, 12, 0], sum: [0, 12, 0],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 31, b - 1, APPL);
      c.col(2, 5, b - 1, L(APPL));
      c.rect(3, b, 5, b, DARK);
      c.rect(28, b, 30, b, DARK);
      c.rect(24, b - 5, 29, b - 2, mix(APPL, 0.85));
      for (let y = b - 5; y < b - 1; y += 2) c.row(y, 24, 29, D(APPL));
      c.set(5, 8, u ? GREENL : hex('#3f6a52'));
      rust(c, 2, b - 6, 31, b - 1, 14, 4);
      if (u) {
        c.rect(2, -9, 31, 2, mix(APPL, 0.85));
        c.frame(2, -9, 31, 2, D(APPL));
        c.rect(4, -7, 29, 0, hex('#d0d8d8'));
        c.rect(3, 3, 30, 5, hex('#c9d6d8'));
        c.row(5, 3, 30, hex('#9ab0b4'));
        /* peas, a box, and the long shape */
        c.rect(4, 2, 8, 4, hex('#6a8a4a'));
        c.rect(26, 1, 29, 4, hex('#a8403a'));
        c.rect(10, 2, 24, 4, hex('#22242a'));
        c.row(2, 11, 23, hex('#3e424c'));
        for (const x of [13, 18, 22]) c.col(x, 2, 4, hex('#8a8a80'));
        dots(c, C.white, [6, 0, 14, -1, 20, 0, 27, -2, 9, -3, 24, -4]);
        drip(c, 12, 6, 3, WATERL);
      } else {
        c.rect(1, 2, 32, 4, C.white);
        c.row(4, 1, 32, mix(C.white, 0.8));
        c.row(2, 1, 32, L(C.white));
        c.rect(14, 5, 19, 5, C.steel);
        /* a padlock on a thing that never had one */
        c.rect(16, 6, 17, 7, C.brass);
        c.rect(5, 0, 12, 1, CARD);
        c.row(0, 5, 12, L(CARD));
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 5, 13, b - 1, APPL);
      c.rect(3, b, 4, b, DARK);
      c.rect(11, b, 12, b, DARK);
      rust(c, 2, b - 6, 13, b - 1, 14, 4);
      c.line(2, 12, 0, 16, hex('#3a3a44'));
      if (u) {
        c.rect(2, -9, 3, 4, mix(APPL, 0.85));
        c.col(2, -9, 4, APPL);
        c.rect(4, 3, 12, 5, hex('#c9d6d8'));
        c.rect(6, 2, 10, 4, hex('#22242a'));
        dots(c, C.white, [7, 0, 10, -2, 5, -1]);
      } else {
        c.rect(1, 2, 14, 4, C.white);
        c.row(4, 1, 14, mix(C.white, 0.8));
        c.rect(14, 6, 14, 7, C.brass);
        c.rect(4, 0, 9, 1, CARD);
      }
    },
  });
};
