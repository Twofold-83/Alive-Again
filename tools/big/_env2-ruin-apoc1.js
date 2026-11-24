/* env-apocalypse, part 1: the wrecks (large) and the lines people held. Part of tools/big/env2-ruin.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring } = X;
  const { bricks, planks, boards, hazard, rust, soot, tins, tin, litter, flame, fire, smoke, pool, drum, crate, sandbags, skull, trefoil, tyreFlat, tyreUp } = X;
  const { mesh, coil, grass, pane, drip, carSide, carFront, tyreEnd } = X;
  const { TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, WATER, SMOKE, SMOKED, RUST, RUSTD, RUSTL, SOOT, OLIVE, OLIVED, KHAKI, CANVAS, HAZ, SAND, WARM } = X;
  setCat('env-apocalypse', 'Apocalypse');

  const WEED = hex('#5a6a3a'),
    BURNT = hex('#4a3a36'),
    BUSRED = hex('#7d3b32'),
    BUSCREAM = hex('#a89f84'),
    AMBW = hex('#b3b0a2'),
    AMBSTRIPE = hex('#9a4a34'),
    BLUED = hex('#3a4a66'),
    BLUEL = hex('#7aa0d8'),
    CVAN = hex('#aaa590'),
    CVSTRIPE = hex('#5f7a72'),
    GASRED = hex('#8a3a2e'),
    BSTEEL = hex('#5a6258');

  /* ---------- wrecks: the large things ---------- */
  T('apocalypse-car-wreck-skeleton', 'large burnt out car wreck with a skeleton at the wheel rusted shell on rims weeds', {
    w: 26, h: 22, solid: true, base: 'side', um: [0, 3, 6], sum: [0, 3, 0],
    sw: 48,
    s(c, u) {
      const g = carSide(c, { col: BURNT, noGlass: true, noTyres: true, dead: true, trim: C.ironDark, door: u, bonnet: u, seat: SOOT });
      rust(c, 2, g.ry, 45, g.by, 8, 3);
      soot(c, 2, g.ry, 45, g.by, 12, 8);
      grass(c, 2, 46, g.b, 4, WEED, 3);
      if (u) {
        /* the driver has slid out of the open door */
        pat(c, g.mid + 3, g.by - 5, ['.bb.', 'bbbb', 'kbkb', '.bb.'], { b: C.bone, k: DARK });
        c.line(g.mid + 5, g.by - 1, g.mid + 7, g.b, C.bone);
        c.row(g.b, g.mid + 7, g.mid + 9, C.bone);
        dots(c, C.bone, [g.mid + 3, g.by - 7, g.mid + 4, g.by - 8, g.mid + 5, g.by - 9]);
      } else {
        pat(c, g.mid + 3, g.ry + 2, ['.bb.', 'bbbb', 'kbkb', '.bb.'], { b: C.bone, k: DARK });
        c.row(g.wy - 1, g.mid + 3, g.mid + 6, D(C.bone));
        c.line(g.mid + 7, g.wy - 1, g.c1 - 5, g.wy - 2, C.bone);
      }
    },
    f(c, u) {
      const g = carFront(c, { col: BURNT, noGlass: true, noTyres: true, dead: true, trim: C.ironDark, noPlate: true, door: u, bonnet: u });
      rust(c, 2, g.ry, 23, g.by, 8, 3);
      soot(c, 2, g.ry, 23, g.by, 12, 8);
      grass(c, 1, 24, g.b, 4, WEED, 3);
      if (u) {
        pat(c, 25, g.by - 4, ['.bb.', 'bbbb', 'kbkb', '.bb.'], { b: C.bone, k: DARK });
        c.row(g.b, 25, 29, C.bone);
      } else {
        pat(c, 14, g.ry + 2, ['.bb.', 'bbbb', 'kbkb', '.bb.'], { b: C.bone, k: DARK });
        c.row(g.wy - 1, 12, 19, D(C.bone));
      }
    },
  });

  T('apocalypse-bus-wreck-front', 'large wrecked bus front half torn in two city bus shell someone lives inside', {
    w: 28, h: 32, solid: true, base: 'side', um: [0, 6, 0], sum: [0, 6, 0],
    sw: 48,
    s(c, u) {
      const b = c.h - 2,
        win = u ? WARM : GLASSD;
      c.rect(5, 3, 45, 26, BUSRED);
      c.rect(5, 3, 45, 5, BUSCREAM);
      c.row(3, 5, 44, L(BUSCREAM));
      c.clear(45, 3);
      c.rect(5, 16, 45, 17, BUSCREAM);
      c.row(26, 5, 45, D(BUSRED));
      rust(c, 5, 6, 45, 26, 14, 7);
      /* the torn end */
      c.rect(3, 6, 8, 26, DARK);
      for (let y = 3; y <= 26; y++) {
        const j = [2, 0, 1, 3, 1, 0, 2, 4, 2, 1][y % 10];
        c.clearRect(3, y, 2 + j, y);
        c.set(3 + j, y, RUST);
        c.set(9, y, y % 3 ? D(BUSRED) : RUST);
      }
      c.rect(5, 19, 8, 20, C.iron);
      c.col(8, 14, 20, C.iron);
      dots(c, hex('#6a2a26'), [5, 9, 6, 10, 6, 11, 4, 12, 7, 8, 7, 9]);
      /* windows */
      for (const x of [11, 19, 27]) {
        c.rect(x, 8, x + 5, 14, win);
        if (!u) c.line(x + 1, 12, x + 3, 9, mix(C.glass, 0.9));
      }
      if (!u) {
        c.rect(19, 8, 24, 14, DARK);
        dots(c, C.glassLight, [19, 8, 20, 9, 24, 14, 23, 13, 24, 8]);
      } else {
        c.col(19, 8, 14, hex('#6a4a5a'));
        c.col(20, 8, 13, hex('#6a4a5a'));
        c.rect(12, 12, 14, 14, hex('#6e5a2e'));
      }
      c.poly([[41, 8], [44, 8], [45, 12], [45, 14], [41, 14]], u ? WARM : GLASSD);
      /* the door */
      c.rect(34, 7, 39, 25, u ? hex('#6e5a2e') : D(BUSRED));
      if (u) {
        c.rect(34, 7, 39, 12, WARM);
        c.rect(34, 23, 39, 25, DARK);
        c.row(22, 34, 39, C.iron);
        c.col(39, 7, 25, C.iron);
        c.col(34, 7, 25, C.iron);
      } else {
        c.rect(35, 8, 36, 15, GLASSD);
        c.rect(38, 8, 39, 15, GLASSD);
        c.col(37, 7, 25, DARK);
      }
      txt(c, 11, 19, 'GONE', BUSCREAM);
      drip(c, 12, 24, 2, BUSCREAM);
      drip(c, 21, 24, 1, BUSCREAM);
      /* wheel, bumper, lamp */
      c.oval(22, 20, 32, 30, DARK);
      wheel(c, 27, b - 4, 4, C.iron);
      c.rect(44, 24, 46, 26, C.iron);
      c.rect(45, 20, 45, 21, u ? C.glassLight : C.black);
      /* rubble under the torn end */
      c.poly([[2, b], [5, 27], [11, 27], [14, b]], CONCD);
      c.rect(6, 26, 10, 27, CONC);
      dots(c, CONC, [4, b - 1, 12, b - 1, 8, b]);
      grass(c, 14, 20, b, 3, WEED, 3);
      grass(c, 33, 46, b, 6, WEED, 2);
      if (u) {
        c.rect(15, 1, 17, 2, C.ironDark);
        smoke(c, 16, 0, 6, SMOKE, 4);
      }
    },
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 25, 26, BUSRED);
      c.rect(2, 3, 25, 5, BUSCREAM);
      c.row(3, 3, 24, L(BUSCREAM));
      c.clear(2, 3);
      c.clear(25, 3);
      rust(c, 2, 6, 25, 24, 14, 7);
      c.rect(5, 4, 22, 10, DARK);
      txt(c, 7, 5, 'LAST', hex('#8a6a2a'));
      c.rect(4, 12, 23, 19, u ? WARM : GLASSD);
      c.rect(13, 12, 14, 19, BUSRED);
      if (u) {
        c.rect(15, 12, 23, 19, hex('#6a4a5a'));
        c.col(18, 12, 19, D(hex('#6a4a5a')));
        c.rect(7, 15, 10, 19, hex('#6e5a2e'));
        c.rect(8, 13, 9, 14, hex('#6e5a2e'));
      } else {
        c.line(6, 17, 10, 13, mix(C.glass, 0.9));
        for (const [x, y] of [[15, 12], [23, 14], [20, 19], [16, 18]]) c.line(19, 15, x, y, C.glassLight);
        c.rect(18, 14, 20, 16, DARK);
      }
      c.rect(2, 20, 25, 21, BUSCREAM);
      c.rect(10, 22, 17, 24, DARK);
      for (let x = 11; x < 17; x += 2) c.col(x, 22, 24, C.iron);
      for (const x of [4, 21]) c.rect(x, 22, x + 2, 23, C.black);
      c.set(4, 22, C.glassLight);
      c.rect(2, 25, 25, 26, C.iron);
      c.row(25, 2, 25, C.steel);
      c.col(1, 13, 15, C.ironDark);
      c.col(26, 13, 15, C.ironDark);
      tyreEnd(c, 3, 27, b, 5);
      tyreEnd(c, 20, 27, b, 5);
      c.row(27, 8, 19, DARK);
      grass(c, 8, 19, b, 5, WEED, 2);
      if (u) {
        c.rect(8, 1, 10, 2, C.ironDark);
        smoke(c, 9, 0, 6, SMOKE, 4);
      }
    },
  });

  T('apocalypse-military-truck-canvas', 'large military truck army lorry olive canvas back abandoned convoy supplies', {
    w: 28, h: 30, solid: true, base: 'side', um: [0, 5, 0], sum: [0, 0, 3],
    sw: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 21, 45, 22, C.ironDark);
      /* the bed and its canvas */
      c.poly([[2, 14], [2, 7], [5, 4], [25, 4], [28, 7], [28, 14]], CANVAS);
      c.row(4, 5, 25, L(CANVAS));
      c.line(2, 7, 5, 4, L(CANVAS));
      for (const x of [9, 15, 21]) c.col(x, 5, 14, D(CANVAS));
      for (let x = 3; x < 28; x += 3) c.set(x, 14, D(CANVAS));
      c.speckle(2, 4, 28, 14, mix(CANVAS, 0.85), 7, 2);
      boards(c, 2, 15, 28, 20, OLIVE, 3);
      for (const x of [2, 10, 19, 28]) c.col(x, 15, 20, OLIVED);
      if (u) {
        c.rect(4, 8, 26, 14, DARK);
        c.rect(3, 6, 27, 7, D(CANVAS));
        c.row(6, 3, 27, CANVAS);
        for (const x of [9, 15, 21]) c.col(x, 8, 14, C.iron);
        crate(c, 5, 10, 11, 14, C.woodLight);
        crate(c, 12, 11, 17, 14, C.wood);
        crate(c, 6, 8, 10, 9, C.wood, { slats: false });
        drum(c, 22, 14, 4, 6, hex('#7a3a30'));
      }
      /* cab and bonnet */
      c.rect(31, 9, 40, 20, OLIVE);
      c.row(9, 31, 40, L(OLIVE));
      c.col(31, 9, 20, L(OLIVE));
      pane(c, 34, 11, 39, 15, false);
      c.col(33, 11, 20, OLIVED);
      c.col(40, 10, 20, OLIVED);
      pat(c, 35, 17, ['.w.', 'www', 'w.w'], blend(OLIVE, C.white, 0.6));
      c.rect(41, 14, 46, 20, OLIVE);
      c.row(14, 41, 46, L(OLIVE));
      c.col(46, 15, 20, DARK);
      c.set(46, 16, u ? LAMP : C.glassLight);
      if (u) dots(c, LAMP, [47, 16, 48, 16, 49, 17]);
      c.rect(29, 14, 30, 20, OLIVED);
      c.row(13, 29, 30, C.ironDark);
      c.rect(44, 21, 46, 23, C.ironDark);
      rust(c, 2, 9, 46, 20, 22, 5);
      for (const x of [9, 19, 38]) {
        c.oval(x - 5, b - 9, x + 5, b, DARK);
        wheel(c, x, b - 4, 4, OLIVED);
      }
      c.row(18, 3, 14, OLIVED);
      grass(c, 23, 33, b, 5, WEED, 2);
    },
    f(c, u) {
      const b = c.h - 2;
      c.poly([[4, 10], [4, 7], [7, 4], [20, 4], [23, 7], [23, 10]], CANVAS);
      c.row(4, 7, 20, L(CANVAS));
      c.col(13, 5, 9, D(CANVAS));
      c.rect(5, 9, 22, 16, OLIVE);
      c.row(9, 5, 22, L(OLIVE));
      pane(c, 7, 11, 12, 15, false);
      pane(c, 15, 11, 20, 15, false);
      c.rect(4, 16, 23, 22, OLIVE);
      c.row(16, 4, 23, L(OLIVE));
      c.rect(10, 17, 17, 21, DARK);
      for (let x = 11; x <= 16; x += 2) c.col(x, 17, 21, OLIVED);
      for (const x of [5, 20]) {
        c.rect(x, 18, x + 2, 20, u ? LAMP : C.glassLight);
        if (!u) c.set(x + 2, 20, C.glass);
        else c.set(x + 1, 19, hex('#f2e2a0'));
      }
      c.rect(2, 17, 3, 20, OLIVED);
      c.rect(24, 17, 25, 20, OLIVED);
      c.rect(2, 22, 25, 23, C.ironDark);
      c.row(22, 2, 25, C.iron);
      dots(c, C.steel, [8, 23, 19, 23]);
      c.col(3, 11, 13, C.ironDark);
      c.col(24, 11, 13, C.ironDark);
      rust(c, 4, 9, 23, 21, 22, 5);
      tyreEnd(c, 2, 24, b, 5);
      tyreEnd(c, 21, 24, b, 5);
      c.row(25, 7, 20, DARK);
      c.rect(12, 24, 15, 26, C.ironDark);
      if (u) {
        smoke(c, 22, 8, 7, SMOKE, 3);
        dots(c, LAMP, [4, 21, 8, 21, 19, 21, 23, 21]);
      }
    },
  });

  T('apocalypse-tank-abandoned', 'large abandoned army tank armour turret gun tracks overgrown moss hatch', {
    w: 30, h: 24, solid: true, base: 'side',
    sw: 48,
    s(c, u) {
      const b = c.h - 2;
      /* tracks */
      c.poly([[5, 15], [40, 15], [43, 18], [41, b], [6, b], [3, 18]], C.ironDark);
      c.row(15, 5, 40, C.iron);
      for (let x = 6; x <= 41; x += 2) c.set(x, b, DARK);
      for (const x of [9, 16, 23, 30, 37]) {
        c.oval(x - 2, 17, x + 2, 21, C.iron);
        c.set(x, 19, DARK);
      }
      /* hull */
      c.poly([[4, 14], [5, 11], [39, 11], [44, 14]], OLIVE);
      c.row(11, 5, 39, L(OLIVE));
      c.row(14, 4, 44, OLIVED);
      c.rect(6, 12, 12, 13, OLIVED);
      c.col(26, 12, 13, OLIVED);
      /* turret and gun */
      c.poly([[14, 10], [16, 5], [29, 5], [32, 10]], OLIVE);
      c.row(5, 16, 29, L(OLIVE));
      c.line(14, 10, 16, 5, L(OLIVE));
      c.rect(32, 7, 46, 8, OLIVED);
      c.row(7, 32, 46, OLIVE);
      c.rect(45, 6, 46, 9, OLIVED);
      c.rect(30, 6, 32, 9, OLIVED);
      c.rect(18, 7, 21, 8, u ? WARM : DARK);
      pat(c, 24, 7, ['.w.', 'www', 'w.w'], blend(OLIVE, C.white, 0.5));
      rust(c, 4, 5, 46, 14, 14, 6);
      c.speckle(4, 5, 46, 14, C.moss, 9, 9);
      dots(c, WEED, [36, 9, 37, 10, 40, 9, 40, 10, 41, 11, 12, 10, 11, 9]);
      grass(c, 2, 46, b, 8, WEED, 3);
      if (u) {
        c.rect(19, 1, 20, 4, OLIVED);
        c.col(19, 1, 4, OLIVE);
        c.rect(21, 4, 25, 4, DARK);
        c.row(3, 21, 25, WARM);
        dots(c, mix(WARM, 0.8), [22, 2, 24, 2, 23, 1]);
      } else {
        c.rect(19, 4, 25, 4, OLIVED);
        c.row(3, 20, 24, OLIVE);
      }
    },
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 22]) {
        c.rect(x, 13, x + 5, b, C.ironDark);
        for (let y = 14; y <= b; y += 2) c.row(y, x, x + 5, DARK);
        c.col(x, 13, b, C.iron);
      }
      c.rect(8, 12, 21, 19, OLIVE);
      c.rect(8, 17, 21, 19, OLIVED);
      c.row(12, 8, 21, L(OLIVE));
      c.rect(2, 11, 8, 12, OLIVE);
      c.rect(21, 11, 27, 12, OLIVE);
      c.row(11, 2, 27, L(OLIVE));
      c.poly([[9, 10], [10, 5], [19, 5], [20, 10]], OLIVE);
      c.row(5, 10, 19, L(OLIVE));
      c.rect(13, 6, 16, 9, OLIVED);
      c.rect(14, 7, 15, 8, DARK);
      c.row(6, 13, 16, OLIVE);
      c.rect(10, 14, 12, 14, u ? WARM : DARK);
      c.set(19, 14, C.glassLight);
      rust(c, 2, 5, 27, 19, 14, 6);
      c.speckle(2, 5, 27, 19, C.moss, 9, 9);
      grass(c, 1, 28, b, 8, WEED, 3);
      if (u) {
        c.rect(10, 1, 13, 3, OLIVED);
        c.row(1, 10, 13, OLIVE);
        c.row(4, 10, 14, WARM);
        dots(c, mix(WARM, 0.8), [15, 3, 16, 2]);
      } else {
        c.row(4, 10, 14, OLIVED);
      }
    },
  });

  T('apocalypse-ambulance-quarantine', 'large abandoned ambulance sealed with tape quarantine van back doors stretcher', {
    w: 28, h: 30, solid: true, base: 'side', um: [5, 0, 5], sum: [4, 0, 0],
    sw: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 30, 21, AMBW);
      c.row(4, 2, 30, L(AMBW));
      c.col(2, 4, 21, L(AMBW));
      c.rect(2, 13, 30, 15, AMBSTRIPE);
      c.rect(14, 6, 15, 11, hex('#8a3a34'));
      c.rect(12, 8, 17, 9, hex('#8a3a34'));
      hazard(c, 2, 17, 30, 18, HAZ, DARK, 2);
      trefoil(c, 23, 6, hex('#3a3830'));
      c.col(30, 5, 21, D(AMBW));
      /* the cab */
      c.poly([[31, 9], [38, 9], [41, 14], [46, 15], [46, 21], [31, 21]], AMBW);
      c.row(9, 31, 38, L(AMBW));
      c.poly([[33, 10], [37, 10], [40, 14], [33, 14]], GLASSD);
      c.line(34, 13, 36, 11, mix(C.glass, 0.9));
      c.rect(31, 16, 46, 17, AMBSTRIPE);
      c.col(33, 15, 20, D(AMBW));
      c.col(40, 15, 20, D(AMBW));
      c.rect(45, 18, 46, 19, C.glassLight);
      c.rect(33, 7, 35, 8, u ? BLUEL : BLUED);
      if (u) dots(c, BLUEL, [32, 6, 36, 6, 34, 5]);
      c.rect(2, 21, 46, 22, D(AMBW));
      c.rect(44, 21, 46, 22, C.steel);
      rust(c, 2, 4, 46, 21, 18, 4);
      dots(c, DARK, [8, 7, 20, 11, 26, 19, 6, 19]);
      for (const x of [10, 38]) {
        c.oval(x - 5, b - 9, x + 5, b, DARK);
        wheel(c, x, b - 4, 4, C.steel);
      }
      c.row(23, 16, 32, DARK);
      if (u) {
        /* a back door stands open; the stretcher has been pulled half out */
        c.rect(-3, 5, -1, 21, mix(AMBW, 0.86));
        c.col(-3, 5, 21, AMBW);
        c.rect(-3, 7, -2, 11, GLASSD);
        c.col(1, 5, 21, DARK);
        c.row(18, -2, 1, C.steel);
        c.row(17, -2, 1, C.white);
        c.col(-2, 19, b - 1, C.steel);
        c.set(-2, b, TYRE);
      }
    },
    f(c, u) {
      /* seen from behind */
      const b = c.h - 2;
      c.rect(2, 4, 25, 21, AMBW);
      c.row(4, 2, 25, L(AMBW));
      c.rect(12, 2, 15, 3, u ? BLUEL : BLUED);
      for (const x of [2, 24]) c.rect(x, 18, x + 1, 20, hex('#7a2a26'));
      c.rect(2, 22, 25, 23, C.iron);
      c.row(22, 2, 25, C.steel);
      tyreEnd(c, 3, 24, b, 5);
      tyreEnd(c, 20, 24, b, 5);
      c.row(24, 8, 19, DARK);
      if (u) {
        c.rect(4, 6, 23, 21, DARK);
        c.row(6, 8, 19, hex('#6e5a2e'));
        c.rect(8, 15, 19, 16, C.steel);
        c.rect(8, 13, 19, 14, C.white);
        c.poly([[9, 13], [11, 11], [17, 11], [19, 13]], hex('#2e3138'));
        c.row(11, 12, 16, hex('#484c56'));
        c.col(9, 17, 21, C.iron);
        c.col(18, 17, 21, C.iron);
        for (const [x0, x1] of [[-4, 1], [26, 31]]) {
          c.rect(x0, 5, x1, 21, mix(AMBW, 0.86));
          c.frame(x0, 5, x1, 21, D(AMBW));
          c.rect(x0 + 1, 7, x1 - 1, 11, GLASSD);
          c.rect(x0, 13, x1, 15, AMBSTRIPE);
        }
        dots(c, C.blood, [13, 22, 14, 23, 14, 22]);
        drip(c, 13, 24, 2, C.blood);
        dots(c, HAZ, [3, 26, 4, 27, 6, 28, 22, 28, 24, 27]);
      } else {
        c.rect(2, 13, 25, 15, AMBSTRIPE);
        c.col(13, 5, 21, D(AMBW));
        c.col(14, 5, 21, DARK);
        pane(c, 5, 7, 11, 11, false);
        pane(c, 16, 7, 22, 11, false);
        c.line(3, 12, 24, 20, HAZ);
        c.line(24, 12, 3, 20, HAZ);
        for (let i = 0; i < 22; i += 3) {
          c.set(3 + i, Math.round(12 + (i * 8) / 21), DARK);
          c.set(24 - i, Math.round(12 + (i * 8) / 21), DARK);
        }
        dots(c, C.steel, [12, 16, 16, 16]);
      }
      rust(c, 2, 4, 25, 21, 18, 4);
    },
  });

  T('apocalypse-caravan-holdout', 'large caravan boarded up survivor holdout trailer on blocks stovepipe', {
    w: 26, h: 30, solid: true, base: 'side', um: [0, 5, 0], sum: [0, 5, 0],
    sw: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 6, 41, 21, CVAN);
      c.rect(4, 4, 39, 5, CVAN);
      c.row(5, 3, 40, CVAN);
      c.row(4, 4, 39, L(CVAN));
      c.col(2, 6, 21, L(CVAN));
      c.rect(2, 13, 41, 15, CVSTRIPE);
      c.row(21, 2, 41, D(CVAN));
      c.speckle(3, 4, 40, 6, C.moss, 4, 2);
      /* back window with curtains */
      c.rect(5, 7, 14, 12, u ? WARM : GLASSD);
      c.frame(5, 7, 14, 12, D(CVAN));
      c.rect(6, 8, 7, 11, hex('#7a5a5a'));
      c.rect(12, 8, 13, 11, hex('#7a5a5a'));
      if (!u) c.set(9, 9, mix(C.glass, 0.9));
      /* the door */
      c.rect(27, 7, 34, 21, u ? DARK : mix(CVAN, 0.9));
      c.frame(27, 7, 34, 21, D(CVAN));
      if (u) {
        c.rect(28, 8, 33, 12, hex('#6e5a2e'));
        c.rect(28, 17, 30, 20, hex('#4a3a34'));
        c.rect(35, 7, 36, 21, L(CVAN));
        c.col(36, 7, 21, D(CVAN));
      } else {
        c.rect(29, 9, 32, 12, GLASSD);
        c.set(33, 15, C.steel);
        boards(c, 28, 16, 33, 18, C.woodLight, 3);
        dots(c, C.ironDark, [28, 17, 33, 17]);
      }
      /* front window boarded */
      c.rect(36, 7, 39, 12, u ? WARM : GLASSD);
      c.rect(36, 7, 39, 8, C.wood);
      c.rect(36, 10, 39, 11, C.woodLight);
      for (const x of [8, 20, 37]) drip(c, x, 16, 3, mix(CVAN, 0.78));
      rust(c, 2, 16, 41, 21, 14, 6);
      /* stovepipe */
      c.rect(10, 1, 11, 3, C.ironDark);
      c.row(1, 9, 12, C.iron);
      if (u) smoke(c, 11, 0, 6, SMOKE, 5);
      /* wheel, hitch, legs */
      c.oval(14, b - 9, 24, b, DARK);
      wheel(c, 19, b - 4, 4, C.steel);
      c.row(22, 3, 41, C.ironDark);
      c.line(41, 21, 46, 23, C.iron);
      c.col(45, 23, b - 2, C.iron);
      c.rect(44, b - 1, 46, b, TYRE);
      c.rect(42, 15, 45, 20, GASRED);
      c.col(42, 15, 20, L(GASRED));
      c.rect(43, 13, 44, 14, C.iron);
      for (const x of [4, 38]) {
        c.col(x, 23, b - 2, C.iron);
        c.rect(x - 2, b - 1, x + 2, b, CONC);
      }
      crate(c, 28, 25, 33, b, C.wood, { slats: false });
      grass(c, 6, 14, b, 3, WEED, 3);
    },
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 6, 22, 21, CVAN);
      c.rect(5, 4, 20, 5, CVAN);
      c.row(5, 4, 21, CVAN);
      c.row(4, 5, 20, L(CVAN));
      c.col(3, 6, 21, L(CVAN));
      c.rect(3, 13, 22, 15, CVSTRIPE);
      c.speckle(4, 4, 21, 6, C.moss, 4, 2);
      c.rect(6, 7, 19, 12, u ? WARM : GLASSD);
      for (const y of [7, 10]) {
        c.rect(5, y, 20, y + 1, y === 7 ? C.wood : C.woodLight);
        c.row(y + 1, 5, 20, D(C.wood));
        dots(c, C.ironDark, [6, y, 19, y]);
      }
      c.line(7, 12, 18, 7, C.woodLight);
      rust(c, 3, 16, 22, 21, 14, 6);
      c.row(21, 3, 22, D(CVAN));
      c.rect(11, 16, 14, 23, GASRED);
      c.col(11, 16, 23, L(GASRED));
      c.rect(12, 14, 13, 15, C.iron);
      c.line(6, 22, 11, 25, C.iron);
      c.line(19, 22, 14, 25, C.iron);
      c.rect(12, 24, 13, b - 2, C.iron);
      c.rect(11, b - 1, 14, b, TYRE);
      c.rect(3, 22, 5, b, TYRE);
      c.rect(20, 22, 22, b, TYRE);
      c.rect(16, 1, 17, 3, C.ironDark);
      c.row(1, 15, 18, C.iron);
      if (u) smoke(c, 17, 0, 6, SMOKE, 5);
      grass(c, 6, 10, b, 3, WEED, 2);
    },
  });

  /* ---------- lines that were held ---------- */
  T('apocalypse-barricade-scrap-wall', 'barricade wall of scrap doors corrugated iron tyres stakes road block breached', {
    w: 44, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2,
        TIN = hex('#6f7478');
      /* an old door on its side */
      c.rect(2, 11, 19, 22, C.wood);
      panel(c, 4, 13, 10, 20, C.woodDark);
      panel(c, 12, 13, 17, 20, C.woodDark);
      c.row(11, 2, 19, C.woodLight);
      c.set(18, 12, C.brass);
      /* corrugated sheet */
      c.rect(19, 7, 33, 22, TIN);
      for (let x = 20; x <= 33; x += 2) c.col(x, 7, 22, D(TIN));
      c.row(7, 19, 33, L(TIN));
      rust(c, 19, 7, 33, 22, 7, 2);
      /* a bonnet and planks */
      c.rect(33, 12, 41, 22, hex('#4f5a70'));
      c.row(12, 33, 41, hex('#6a7690'));
      rust(c, 33, 12, 41, 22, 6, 9);
      c.line(3, 9, 30, 17, C.woodLight);
      c.line(3, 10, 30, 18, C.wood);
      c.line(24, 20, 41, 9, C.woodLight);
      c.line(24, 21, 41, 10, C.wood);
      /* stakes and wire along the top */
      for (const [x, y] of [[5, 10], [11, 10], [36, 11], [40, 11]]) {
        c.col(x, y - 6, y, C.woodLight);
        c.set(x + 1, y - 1, C.wood);
        c.set(x + 1, y, C.wood);
      }
      for (let x = 20; x <= 32; x += 3) {
        c.set(x, 6, C.steel);
        c.set(x + 1, 5, C.steel);
      }
      tyreFlat(c, 3, b - 3, 12);
      tyreFlat(c, 29, b - 3, 12);
      c.rect(15, b - 2, 28, b, CONCD);
      c.row(b - 2, 15, 28, CONC);
      txt(c, 21, 10, 'NO', C.bone);
      if (u) {
        /* breached: the sheet torn open and bent outward */
        c.poly([[21, 9], [31, 8], [32, 22], [20, 22]], DARK);
        c.poly([[19, 8], [22, 9], [20, 16], [18, 19]], L(TIN));
        c.poly([[31, 8], [34, 11], [33, 20], [32, 15]], D(TIN));
        c.rect(15, b - 2, 28, b, CONCD);
        c.line(22, 17, 27, 20, C.woodLight);
        dots(c, C.blood, [23, 23, 24, 23, 26, 24, 28, 23, 19, 12, 19, 13]);
        dots(c, hex('#6f7478'), [24, b, 27, b - 1]);
        c.clearRect(20, 4, 33, 6);
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2,
        TIN = hex('#6f7478');
      sideBox(c, 6, 7, 9, 22, TIN);
      rust(c, 6, 7, 9, 22, 7, 2);
      c.col(7, 4, 10, C.woodLight);
      c.col(8, 5, 10, C.wood);
      c.line(10, 12, 14, b, C.wood);
      c.line(9, 12, 13, b, C.woodLight);
      tyreFlat(c, 2, b - 3, 9);
      c.rect(10, b - 1, 13, b, CONCD);
      dots(c, C.steel, [6, 6, 9, 5]);
      if (u) {
        c.poly([[2, 9], [5, 8], [6, 14], [4, 18]], L(TIN));
        c.rect(6, 10, 9, 21, DARK);
        dots(c, C.blood, [3, b, 5, b - 4, 4, b - 4]);
      }
    },
  });

  T('apocalypse-sandbag-nest', 'sandbag emplacement gun nest firing position wall of sandbags helmet rifle', {
    w: 38, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      sandbags(c, 1, 36, b - 2, 0);
      sandbags(c, 2, 35, b - 5, 3);
      sandbags(c, 3, 34, b - 8, 1);
      sandbags(c, 4, 15, b - 11, 4);
      sandbags(c, 22, 33, b - 11, 2);
      c.rect(16, b - 10, 21, b - 9, DARK);
      c.speckle(1, 4, 36, b, D(SAND), 14, 3);
      dots(c, WEED, [1, b, 5, b, 30, b, 36, b]);
      if (u) {
        /* a rifle laid in the slot, a burst bag */
        c.rect(12, b - 11, 27, b - 11, C.ironDark);
        c.rect(10, b - 12, 15, b - 11, C.wood);
        c.set(27, b - 12, C.ironDark);
        c.rect(18, b - 13, 19, b - 12, C.ironDark);
        c.poly([[25, b - 4], [29, b - 4], [31, b], [23, b]], L(SAND));
        c.rect(26, b - 5, 28, b - 5, DARK);
        dots(c, C.brass, [6, b, 8, b, 9, b - 1]);
      } else {
        /* a helmet left on top */
        pat(c, 24, b - 16, ['..lll..', '.looooo.', 'looooooo', 'ooooooooo', 'ddddddddd'].map((r) => r.padStart(9, '.')), { o: OLIVE, l: L(OLIVE), d: OLIVED });
      }
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      sandbags(c, 1, 14, b - 2, 0);
      sandbags(c, 2, 13, b - 5, 3);
      sandbags(c, 3, 11, b - 8, 1);
      sandbags(c, 4, 10, b - 11, 4);
      c.speckle(1, 4, 14, b, D(SAND), 14, 3);
      if (u) {
        c.rect(3, b - 12, 14, b - 12, C.ironDark);
        c.rect(2, b - 13, 5, b - 12, C.wood);
        c.poly([[10, b - 4], [13, b - 4], [15, b], [9, b]], L(SAND));
      } else {
        pat(c, 3, b - 16, ['..lll..', '.looooo.', 'looooooo', 'ooooooooo', 'ddddddddd'].map((r) => r.padStart(9, '.')), { o: OLIVE, l: L(OLIVE), d: OLIVED });
      }
    },
  });

  T('apocalypse-razor-wire-line', 'razor wire barbed wire fence line on iron stakes barrier rags cut through', {
    w: 42, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2,
        W = hex('#7c8088');
      if (u) {
        coil(c, 3, 13, b, 8, W);
        coil(c, 30, 39, b, 8, W);
        c.line(14, b - 3, 18, b, W);
        c.line(29, b - 4, 25, b, W);
        dots(c, W, [19, b, 21, b, 24, b - 1]);
        dots(c, C.blood, [20, b, 22, b, 23, b]);
        /* bolt cutters dropped */
        c.line(15, b - 1, 19, b - 1, hex('#8a3a2e'));
        c.set(20, b - 1, C.steel);
      } else {
        coil(c, 3, 39, b, 8, W);
        coil(c, 7, 36, b - 6, 7, W);
      }
      for (const x of [3, 21, 38]) {
        if (u && x === 21) {
          c.line(21, b, 26, b - 3, C.ironDark);
          continue;
        }
        c.col(x, 2, b, C.ironDark);
        c.col(x + 1, 3, b, C.iron);
        c.set(x, 1, C.iron);
      }
      c.row(4, 4, u ? 12 : 38, W);
      if (u) c.row(4, 32, 38, W);
      for (let x = 7; x < 38; x += 5) if (!u || x < 12 || x > 31) dots(c, L(W), [x, 3, x, 5]);
      /* a rag and a tag */
      c.rect(9, 5, 10, 8, hex('#7a3a34'));
      c.set(10, 9, hex('#7a3a34'));
      c.rect(30, 5, 34, 8, C.bone);
      trefoil(c, 30, 5, hex('#3a3830'));
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2,
        W = hex('#7c8088');
      c.col(5, 2, b, C.ironDark);
      c.col(6, 3, b, C.iron);
      c.set(5, 1, C.iron);
      ring(c, 5.5, b - 3.5, 3.5, W);
      if (!u) ring(c, 5.5, b - 9, 3, W);
      dots(c, L(W), [2, b - 5, 9, b - 2, 4, 4, 7, 4]);
      c.row(4, 3, 8, W);
      c.rect(7, 5, 8, 8, C.bone);
      if (u) {
        c.line(2, b - 8, 0, b - 6, W);
        dots(c, C.blood, [8, b, 10, b]);
        c.row(b, 1, 3, hex('#8a3a2e'));
      }
    },
  });

  T('apocalypse-bunker-blast-door', 'bunker blast door steel wheel lock concrete frame shelter entrance stairs down', {
    w: 24, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 22, b, CONC);
      c.row(1, 1, 22, L(CONC));
      c.col(1, 1, b, L(CONC));
      c.speckle(1, 1, 22, b, CONCD, 9, 4);
      hazard(c, 4, 2, 19, 4, HAZ, DARK, 3);
      c.rect(4, 6, 19, b, DARK);
      if (u) {
        /* stairs going down into a red light */
        for (let i = 0; i < 6; i++) {
          c.rect(9 + i, b - 3 - i * 4, 19, b - i * 4, i % 2 ? hex('#2a2428') : hex('#3a3034'));
          c.row(b - 3 - i * 4, 9 + i, 19, hex('#5a3a38'));
        }
        c.rect(15, 8, 17, 9, REDL);
        dots(c, hex('#7a2a26'), [14, 9, 18, 9, 16, 10, 16, 7]);
        /* the door swung out to the left */
        c.rect(2, 5, 7, b, L(BSTEEL));
        c.col(7, 5, b, BSTEEL);
        c.col(8, 6, b, D(BSTEEL));
        c.col(2, 5, b, hex('#8a9488'));
        dots(c, D(BSTEEL), [4, 8, 4, 20, 4, 32, 6, 14, 6, 26]);
      } else {
        c.rect(4, 6, 19, b, BSTEEL);
        c.row(6, 4, 19, L(BSTEEL));
        c.col(4, 6, b, L(BSTEEL));
        c.col(19, 6, b, D(BSTEEL));
        c.frame(6, 9, 17, b - 3, D(BSTEEL));
        for (const y of [8, 20, 32]) c.rect(3, y, 5, y + 2, C.ironDark);
        for (let y = 11; y < b - 3; y += 6) dots(c, D(BSTEEL), [8, y, 15, y]);
        ring(c, 12, 21, 3.5, C.iron);
        c.line(9, 21, 15, 21, C.steel);
        c.line(12, 18, 12, 24, C.steel);
        c.set(12, 21, DARK);
        trefoil(c, 10, 11, hex('#b59a32'));
        rust(c, 4, 26, 19, b, 9, 5);
        c.rect(15, 28, 17, 29, hex('#5a2622'));
      }
      dots(c, WEED, [1, b, 2, b, 2, b - 1, 22, b]);
    },
    sw: 10, sum: [0, 0, 12],
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 1, 1, 6, b, CONC);
      c.speckle(1, 1, 6, b, CONCD, 9, 4);
      hazard(c, 6, 2, 6, 4, HAZ, DARK, 3);
      if (u) {
        /* the door stands out at a right angle: its inner face */
        c.rect(7, 6, 18, b, mix(BSTEEL, 0.9));
        c.row(6, 7, 18, L(BSTEEL));
        c.col(18, 6, b, D(BSTEEL));
        c.frame(9, 9, 16, b - 3, D(BSTEEL));
        ring(c, 12.5, 21, 2.5, C.iron);
        c.set(12, 21, C.steel);
        c.set(13, 21, C.steel);
        for (const y of [8, 20, 32]) c.rect(6, y, 7, y + 2, C.ironDark);
        c.col(6, 6, b, hex('#5a2622'));
      } else {
        c.rect(7, 6, 8, b, BSTEEL);
        c.col(8, 6, b, D(BSTEEL));
        c.rect(9, 20, 9, 22, C.iron);
        for (const y of [8, 20, 32]) c.set(7, y + 1, C.ironDark);
      }
    },
  });

  T('apocalypse-quarantine-gate', 'quarantine zone gate chain link fence gate padlock keep out sign razor wire', {
    w: 46, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2,
        ST = hex('#7c8088');
      const leaf = (x0, x1) => {
        mesh(c, x0, 9, x1, b - 1, mix(ST, 0.8));
        c.frame(x0, 8, x1, b - 1, ST);
        c.row((8 + b) >> 1, x0, x1, ST);
      };
      for (const x of [2, 41]) {
        c.rect(x, 4, x + 2, b, C.iron);
        c.col(x, 4, b, C.steel);
        c.row(3, x, x + 2, C.ironDark);
      }
      coil(c, 4, 41, 7, 6, ST);
      if (u) {
        /* the left leaf swung towards us: seen nearly edge-on */
        mesh(c, 5, 9, 9, b, mix(ST, 0.8));
        c.frame(5, 8, 9, b, ST);
        c.col(9, 8, b, L(ST));
        c.col(10, 9, b, D(ST));
        c.line(11, 24, 13, 30, C.ironDark);
        dots(c, C.ironDark, [14, b, 16, b, 17, b - 1]);
      } else {
        leaf(5, 22);
        c.rect(21, 21, 25, 22, C.ironDark);
        c.rect(22, 23, 24, 25, C.brass);
        c.set(23, 24, DARK);
      }
      leaf(23, 40);
      c.rect(24, 12, 40, 26, C.white);
      c.rect(24, 12, 40, 13, hex('#8a2a26'));
      txt(c, 25, 15, 'KEEP', hex('#8a2a26'));
      txt(c, 27, 21, 'OUT', DARK);
      dots(c, WEED, [1, b, 5, b, 30, b, 44, b, 43, b - 1]);
    },
    sw: 8, sum: [0, 0, 16],
    s(c, u) {
      const b = c.h - 2,
        ST = hex('#7c8088');
      c.rect(2, 4, 4, b, C.iron);
      c.col(2, 4, b, C.steel);
      c.row(3, 2, 4, C.ironDark);
      ring(c, 3.5, 5.5, 2.5, ST);
      if (u) {
        mesh(c, 5, 9, 21, b - 1, mix(ST, 0.8));
        c.frame(5, 8, 21, b - 1, ST);
        c.row((8 + b) >> 1, 5, 21, ST);
        c.line(21, 22, 22, 27, C.ironDark);
      } else {
        c.col(5, 8, b - 1, ST);
        c.col(6, 12, 26, C.white);
      }
    },
  });
};
