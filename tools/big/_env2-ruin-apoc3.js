/* env-apocalypse, part 3: the dead town, its signs, machines and watch posts. Part of tools/big/env2-ruin.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring } = X;
  const { bricks, planks, boards, hazard, rust, soot, tins, tin, bottle, litter, flame, fire, smoke, pool, drum, crate, sandbags, skull, trefoil } = X;
  const { tyreFlat, mesh, coil, grass, pane, drip } = X;
  const { TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, WATER, WATERL, SMOKE, RUST, RUSTD, SOOT, OLIVE, OLIVED, KHAKI, CANVAS, TARP, HAZ, SAND, WARM } = X;
  setCat('env-apocalypse', 'Apocalypse');

  const WEED = hex('#5a6a3a'),
    BRICK = hex('#6a4038'),
    PLY = hex('#8a7450'),
    PAINT = hex('#8a2a26'),
    DOORG = hex('#4a5a4e'),
    VEND = hex('#6a2e2a'),
    ENAMEL = hex('#bdb9aa'),
    BOOTH = hex('#5a6068'),
    ATM = hex('#4f5a66'),
    PUMP = hex('#8a3a30'),
    PUMPC = hex('#b0a88e'),
    BSTEEL = hex('#5a6258'),
    TIN = hex('#6f7478'),
    CARDY = hex('#9a7a52');

  /* ---------- signs and lights ---------- */
  T('apocalypse-street-lamp-dead', 'dead street lamp bent lamp post shoes hanging posters flickers no power', {
    w: 20, h: 60, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, b - 4, 11, b, C.ironDark);
      c.row(b - 4, 7, 11, C.iron);
      c.rect(8, 7, 9, b - 5, C.iron);
      c.col(8, 7, b - 5, hex('#62626e'));
      c.line(9, 7, 9, 4, C.iron);
      c.line(9, 4, 14, 3, C.iron);
      c.rect(11, 2, 17, 4, C.ironDark);
      c.row(2, 11, 17, C.iron);
      c.row(5, 12, 16, u ? LAMP : DARK);
      if (u) {
        c.set(14, 5, hex('#f2e2a0'));
        for (let y = 6; y < 16; y += 2) dots(c, mix(WARM, 0.7), [14 - ((y - 4) >> 2), y, 14 + ((y - 4) >> 2), y]);
        dots(c, mix(WARM, 0.7), [14, 8, 14, 12]);
      } else dots(c, C.glassLight, [13, 5]);
      /* a pair of shoes on a wire */
      c.col(12, 5, 9, hex('#55555f'));
      c.rect(11, 10, 12, 11, hex('#3a3a44'));
      c.rect(13, 9, 14, 10, hex('#3a3a44'));
      c.set(13, 8, hex('#55555f'));
      /* notices taped to the pole */
      c.rect(6, 28, 11, 34, C.paper);
      c.rect(7, 29, 10, 31, hex('#6a6a70'));
      c.row(33, 7, 10, C.slate);
      c.rect(7, 38, 11, 42, C.bone);
      c.row(38, 7, 11, PAINT);
      rust(c, 7, 2, 17, b, 14, 3);
      dots(c, WEED, [7, b - 5, 10, b - 6, 10, b - 8, 7, b - 9, 6, b, 12, b]);
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 4, 7, b, C.ironDark);
      c.row(b - 4, 3, 7, C.iron);
      c.rect(4, 5, 5, b - 5, C.iron);
      c.col(4, 5, b - 5, hex('#62626e'));
      c.rect(3, 2, 6, 4, C.ironDark);
      c.row(2, 3, 6, C.iron);
      c.row(5, 3, 6, u ? LAMP : DARK);
      if (u) dots(c, mix(WARM, 0.7), [3, 7, 6, 7, 2, 9, 7, 9, 4, 8, 2, 12, 7, 12]);
      c.col(6, 6, 9, hex('#55555f'));
      c.rect(6, 10, 7, 11, hex('#3a3a44'));
      c.col(6, 28, 34, C.paper);
      c.col(6, 38, 42, C.bone);
      rust(c, 3, 2, 7, b, 14, 3);
      dots(c, WEED, [3, b - 5, 6, b - 6, 2, b]);
    },
  });

  T('apocalypse-warning-sign-skull', 'warning sign on a post skull danger contaminated zone yellow board shot fallen', {
    w: 16, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 4, 8, b, C.iron);
      c.col(7, 4, b, C.steel);
      const board = (x, y) => {
        c.rect(x, y, x + 12, y + 12, HAZ);
        c.frame(x, y, x + 12, y + 12, DARK);
        skull(c, x + 4, y + 2, DARK);
        dots(c, HAZ, [x + 5, y + 4, x + 7, y + 4]);
        c.row(y + 9, x + 3, x + 9, DARK);
        rust(c, x, y, x + 12, y + 12, 16, 3);
      };
      if (u) {
        /* shot from its bolts: the board lies against the post */
        dots(c, C.steel, [7, 6, 8, 12]);
        board(1, b - 13);
        c.clearRect(1, b - 13, 3, b - 12);
        c.clear(1, b - 11);
        dots(c, DARK, [5, b - 10, 10, b - 3, 11, b - 9]);
        dots(c, K, [1, b - 10, 2, b - 11, 3, b - 12, 4, b - 13]);
      } else board(1, 2);
      dots(c, WEED, [6, b, 9, b, 10, b - 1]);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 4, 4, b, C.iron);
      c.col(3, 4, b, C.steel);
      if (u) {
        c.line(5, b - 12, 7, b, HAZ);
        c.line(6, b - 12, 8, b, D(HAZ));
      } else {
        c.rect(5, 2, 5, 14, HAZ);
        c.col(6, 2, 14, D(HAZ));
      }
      dots(c, WEED, [2, b, 5, b]);
    },
  });

  T('apocalypse-message-board-dead-inside', 'painted plywood message board dead inside warning daubed survivors note sorry', {
    w: 30, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [5, 23]) c.rect(x, 20, x + 1, b, C.wood);
      c.rect(2, 2, 27, 22, PLY);
      c.row(2, 2, 27, L(PLY));
      c.col(2, 2, 22, L(PLY));
      c.speckle(2, 2, 27, 22, D(PLY), 12, 3);
      c.line(3, 21, 12, 3, mix(PLY, 0.9));
      txt(c, 7, 4, 'DEAD', PAINT);
      txt(c, 3, 10, 'INSIDE', PAINT);
      drip(c, 8, 9, 2, PAINT);
      drip(c, 20, 15, 3, PAINT);
      dots(c, C.ironDark, [3, 3, 26, 3, 3, 21, 26, 21]);
      if (u) {
        txt(c, 5, 16, 'SORRY', C.bone);
        drip(c, 14, 21, 2, C.bone);
        c.rect(11, b - 3, 14, b, C.steel);
        c.row(b - 3, 11, 14, C.bone);
        c.line(15, b - 4, 18, b - 1, C.wood);
        c.set(15, b - 5, C.bone);
      } else dots(c, WEED, [4, b, 8, b, 22, b]);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 20, 4, b, C.wood);
      c.rect(3, 2, 4, 22, PLY);
      c.col(3, 2, 22, L(PLY));
      c.line(5, 14, 6, b, C.woodDark);
      if (u) {
        c.rect(1, b - 3, 2, b, C.steel);
        c.row(b - 3, 1, 2, C.bone);
      }
    },
  });

  T('apocalypse-road-sign-bent', 'bent road sign evacuation route arrow pole knocked over spray paint', {
    w: 24, h: 40, solid: true, um: [0, 0, 10],
    f(c, u) {
      const b = c.h - 2,
        G = hex('#3f6a52');
      const plate = (x, y) => {
        c.rect(x, y, x + 19, y + 10, G);
        c.frame(x, y, x + 19, y + 10, C.white);
        txt(c, x + 2, y + 3, 'EXIT', C.white);
        c.row(y + 5, x + 17, x + 17, C.white);
        rust(c, x, y, x + 19, y + 10, 20, 5);
        c.line(x + 2, y + 8, x + 16, y + 2, PAINT);
        c.line(x + 3, y + 2, x + 15, y + 8, PAINT);
      };
      if (u) {
        /* flat on the road */
        c.rect(11, b - 2, 12, b, C.iron);
        c.line(12, b - 1, 30, b - 1, C.iron);
        c.rect(14, b - 5, 31, b - 2, G);
        c.frame(14, b - 5, 31, b - 2, C.white);
        c.row(b - 3, 16, 28, PAINT);
        dots(c, TIN, [8, b, 20, b, 27, b]);
      } else {
        c.line(11, b, 12, 14, C.iron);
        c.line(12, b, 13, 14, C.steel);
        plate(2, 3);
        dots(c, WEED, [10, b, 13, b, 14, b - 1]);
      }
    },
    sw: 8, sum: [0, 0, 0],
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(3, b - 2, 4, b, C.iron);
        c.rect(1, b - 1, 6, b - 1, hex('#3f6a52'));
        c.row(b - 2, 1, 6, C.white);
      } else {
        c.rect(3, 14, 4, b, C.iron);
        c.col(3, 14, b, C.steel);
        c.rect(4, 3, 4, 13, hex('#3f6a52'));
        c.col(5, 3, 13, C.white);
        dots(c, WEED, [2, b, 5, b]);
      }
    },
  });

  /* ---------- walls and ways through ---------- */
  T('apocalypse-collapsed-wall-boarded', 'collapsed brick wall ruin rubble boarded window hole rebar bombed house', {
    w: 44, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bricks(c, 2, 2, 34, b, BRICK);
      /* the broken edge steps down to the right */
      for (const [x, y] of [[12, 2], [18, 5], [23, 8], [27, 13], [30, 18], [33, 22]]) c.clearRect(x, 1, 34, y);
      c.speckle(2, 2, 34, b, hex('#8a8474'), 14, 5);
      c.rect(3, 12, 6, 20, hex('#9a9482'));
      c.rect(4, 21, 5, 24, hex('#9a9482'));
      soot(c, 2, 2, 20, 10, 6, 3);
      c.line(20, 5, 23, 1, C.ironDark);
      c.line(25, 8, 29, 6, C.ironDark);
      /* the window */
      c.rect(9, 9, 19, 20, DARK);
      c.frame(8, 8, 20, 21, hex('#8a8474'));
      if (u) {
        dots(c, C.white, [12, 13, 15, 13]);
        boards(c, 9, 9, 19, 10, C.woodLight, 2);
        c.line(8, b - 1, 18, b, C.woodLight);
        c.line(12, b - 3, 20, b - 2, C.wood);
        dots(c, C.ironDark, [9, 15, 19, 16]);
      } else {
        for (const y of [9, 13, 17]) {
          boards(c, 8, y, 20, y + 2, y === 13 ? C.wood : C.woodLight, 3);
          dots(c, C.ironDark, [9, y + 1, 19, y + 1]);
        }
        c.line(8, 20, 20, 9, C.woodPale);
      }
      /* rubble */
      c.poly([[24, b], [28, b - 5], [33, b - 8], [38, b - 4], [42, b]], CONCD);
      for (const [x, y] of [[29, b - 4], [34, b - 6], [36, b - 2], [31, b - 1], [39, b - 1]]) {
        c.rect(x, y, x + 2, y + 1, BRICK);
        c.row(y, x, x + 2, L(BRICK));
      }
      dots(c, CONC, [27, b - 2, 33, b - 3, 40, b, 25, b]);
      grass(c, 2, 20, b, 4, WEED, 2);
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      bricks(c, 3, 2, 7, b, mix(BRICK, 0.9));
      c.col(3, 2, b, BRICK);
      c.clearRect(6, 1, 7, 4);
      c.rect(7, 9, 7, 20, DARK);
      if (u) c.line(8, b - 2, 12, b, C.woodLight);
      else for (const y of [9, 13, 17]) c.rect(8, y, 8, y + 2, C.woodLight);
      c.poly([[8, b], [9, b - 4], [12, b - 3], [14, b]], CONCD);
      c.rect(10, b - 3, 12, b - 2, BRICK);
      dots(c, CONC, [9, b - 1, 13, b]);
    },
  });

  T('apocalypse-concrete-barrier-run', 'concrete road barrier jersey block graffiti run checkpoint cracked blood', {
    w: 12, h: 18, solid: true, base: 'side',
    sw: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 3, 34, b, CONC);
      c.rect(1, 3, 34, 4, L(CONC));
      c.rect(1, b - 3, 34, b, CONCD);
      c.row(b - 4, 1, 34, mix(CONC, 0.9));
      c.speckle(1, 3, 34, b, CONCD, 12, 4);
      c.rect(7, b - 1, 10, b, DARK);
      c.rect(25, b - 1, 28, b, DARK);
      txt(c, 12, 6, 'RUN', PAINT);
      drip(c, 13, 11, 2, PAINT);
      for (const x of [26, 28, 30]) c.col(x, 6, 9, DARK);
      c.line(25, 9, 31, 6, DARK);
      if (u) {
        c.line(4, 3, 8, 9, DARK);
        c.line(8, 9, 6, b - 4, DARK);
        c.poly([[3, 3], [6, 3], [5, 5]], null);
        c.clearRect(3, 3, 5, 3);
        c.line(4, 4, 3, 1, C.ironDark);
        pat(c, 19, 7, ['r.r', 'rrr', 'rrr', '.r.'], C.blood);
        c.line(21, 11, 24, b - 2, C.blood);
        c.row(b, 20, 26, C.blood);
      }
      dots(c, WEED, [0, b, 35, b]);
    },
    f(c, u) {
      const b = c.h - 2;
      c.poly([[4, 3], [7, 3], [8, b - 5], [10, b - 2], [10, b], [1, b], [1, b - 2], [3, b - 5]], CONC);
      c.row(3, 4, 7, L(CONC));
      c.line(4, 3, 3, b - 5, L(CONC));
      c.rect(1, b - 1, 10, b, CONCD);
      c.speckle(1, 3, 10, b, CONCD, 12, 4);
      if (u) {
        c.clear(4, 3);
        c.line(5, 4, 6, 9, DARK);
        c.set(5, 2, C.ironDark);
        c.row(b, 7, 9, C.blood);
      }
    },
  });

  T('apocalypse-tank-trap-hedgehog', 'tank trap czech hedgehog steel girders anti tank obstacle beach rust wire', {
    w: 24, h: 22, solid: true, same: true,
    f(c, u) {
      const b = c.h - 2,
        G = hex('#6a5a52');
      const beam = (x0, y0, x1, y1, col) => {
        for (const [d, k] of [[-1, 1.25], [0, 1], [1, 0.8], [2, 0.6]]) c.line(x0 + d, y0, x1 + d, y1, mix(col, k));
      };
      for (const [d, k] of [[-1, 1.1], [0, 0.85], [1, 0.65]]) c.line(1, 10 + d, 22, 12 + d, mix(G, k));
      beam(3, b, 18, 2, G);
      beam(19, b, 4, 2, G);
      c.rect(9, 9, 13, 12, hex('#3e3430'));
      dots(c, C.steel, [9, 9, 13, 12, 13, 9, 9, 12]);
      rust(c, 1, 2, 22, b, 12, 3);
      grass(c, 1, 22, b, 5, WEED, 2);
      if (u) {
        coil(c, 2, 21, b - 1, 7, hex('#7c8088'));
        c.poly([[17, 4], [22, 5], [21, 10], [19, 8], [17, 9]], hex('#7a3a34'));
        c.line(17, 4, 22, 5, hex('#9a4a44'));
      }
    },
  });

  T('apocalypse-shelter-hatch', 'fallout shelter hatch in the ground steel lid concrete collar ladder down bunker', {
    w: 30, h: 12, solid: true, um: [0, 14, 0], sum: [0, 14, 0],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 6, 27, b, CONC);
      c.row(6, 2, 27, L(CONC));
      c.speckle(2, 6, 27, b, CONCD, 9, 4);
      hazard(c, 2, b - 1, 27, b, HAZ, DARK, 2);
      if (u) {
        c.rect(5, 5, 24, 6, DARK);
        c.rect(5, -11, 24, 4, mix(BSTEEL, 0.8));
        c.frame(5, -11, 24, 4, D(BSTEEL));
        c.rect(8, -8, 21, 1, mix(BSTEEL, 0.65));
        ring(c, 14.5, -3.5, 2.5, C.iron);
        for (const x of [10, 18]) c.col(x, 0, 5, C.steel);
        c.row(3, 10, 18, C.steel);
        c.row(5, 11, 17, hex('#6e5a2e'));
        c.row(6, 6, 23, DARK);
      } else {
        c.rect(5, 3, 24, 6, BSTEEL);
        c.row(3, 6, 23, L(BSTEEL));
        c.clear(5, 3);
        c.clear(24, 3);
        c.row(2, 12, 17, C.iron);
        c.row(1, 13, 16, C.steel);
        dots(c, D(BSTEEL), [7, 5, 12, 5, 17, 5, 22, 5]);
        rust(c, 5, 3, 24, 6, 9, 2);
      }
      grass(c, 0, 4, b, 3, WEED, 2);
      grass(c, 25, 29, b, 4, WEED, 2);
    },
    sw: 24,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 6, 21, b, mix(CONC, 0.92));
      c.row(6, 2, 21, L(CONC));
      c.speckle(2, 6, 21, b, CONCD, 9, 4);
      hazard(c, 2, b - 1, 21, b, HAZ, DARK, 2);
      if (u) {
        c.rect(5, 5, 18, 6, DARK);
        c.rect(4, -11, 5, 5, BSTEEL);
        c.col(4, -11, 5, L(BSTEEL));
        c.col(6, -6, -2, C.iron);
        for (const x of [9, 12]) c.col(x, 0, 5, C.steel);
        c.row(5, 10, 16, hex('#6e5a2e'));
      } else {
        c.rect(4, 3, 19, 6, BSTEEL);
        c.row(3, 5, 18, L(BSTEEL));
        c.clear(4, 3);
        c.clear(19, 3);
        c.row(2, 9, 14, C.iron);
        c.row(1, 10, 13, C.steel);
        rust(c, 4, 3, 19, 6, 9, 2);
      }
      grass(c, 0, 3, b, 3, WEED, 2);
    },
  });

  T('apocalypse-door-boarded-up', 'boarded up house door planks nailed across marked with a cross sealed quarantine', {
    w: 22, h: 40, solid: true, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 20, b, C.woodDark);
      c.row(1, 1, 20, C.wood);
      c.col(1, 1, b, C.wood);
      c.rect(3, 3, 18, b, u ? DARK : DOORG);
      if (u) {
        /* ajar: the door stands a hand wide, something has come out or gone in */
        c.rect(3, 3, 13, b, mix(DOORG, 0.8));
        c.col(13, 3, b, D(DOORG));
        panel(c, 5, 6, 11, 16, mix(DOORG, 0.65));
        panel(c, 5, 20, 11, 33, mix(DOORG, 0.65));
        c.rect(1, 9, 5, 11, C.woodLight);
        c.rect(17, 22, 20, 24, C.woodLight);
        c.line(16, b, 25, b - 1, C.woodLight);
        c.line(18, b - 3, 26, b, C.wood);
        dots(c, C.ironDark, [2, 10, 19, 23, 20, b, 24, b - 2]);
        pat(c, 14, 18, ['r.r', 'rrr', 'rrr', '.r.'], C.blood);
        c.row(b, 14, 17, C.blood);
      } else {
        panel(c, 5, 6, 16, 16, D(DOORG));
        panel(c, 5, 20, 16, 33, D(DOORG));
        c.set(16, 19, C.brass);
        c.line(6, 4, 16, 17, PAINT);
        c.line(16, 4, 6, 17, PAINT);
        c.line(7, 4, 17, 17, PAINT);
        for (const [y, col] of [[9, C.woodLight], [22, C.woodLight], [29, C.wood]]) {
          c.rect(1, y, 20, y + 2, col);
          c.row(y, 1, 20, L(col));
          c.row(y + 2, 1, 20, D(col));
          dots(c, C.ironDark, [2, y + 1, 19, y + 1]);
        }
        c.line(1, 26, 20, 19, C.woodPale);
        c.line(1, 27, 20, 20, C.wood);
      }
    },
    sw: 8, sum: [0, 0, 8],
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 1, 5, b, C.woodDark);
      if (u) {
        c.rect(6, 3, 12, b, mix(DOORG, 0.8));
        c.col(12, 3, b, D(DOORG));
        panel(c, 7, 6, 11, 16, mix(DOORG, 0.65));
        panel(c, 7, 20, 11, 33, mix(DOORG, 0.65));
        c.line(7, b, 13, b - 1, C.woodLight);
      } else for (const y of [9, 22, 29]) c.rect(6, y, 6, y + 2, C.woodLight);
    },
  });

  /* ---------- machines of the dead town ---------- */
  T('apocalypse-vending-machine-looted', 'vending machine drinks snacks dusty glass smashed looted empty', {
    w: 20, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 17, b, VEND);
      c.row(2, 2, 17, L(VEND));
      c.col(2, 2, b, L(VEND));
      c.rect(2, b - 1, 17, b, DARK);
      c.rect(4, 4, 13, 25, u ? DARK : hex('#3a4a4e'));
      for (const y of [9, 14, 19, 24]) c.row(y, 4, 13, C.iron);
      if (u) {
        tins(c, 5, 8, 23, 3, 5, 0.5);
        for (const [x, y] of [[4, 4], [5, 5], [13, 4], [12, 6], [4, 25], [6, 24], [13, 22], [4, 12]]) c.set(x, y, C.glassLight);
        dots(c, C.glassLight, [5, b, 8, b, 12, b]);
        tin(c, 14, b, hex('#3d5a6e'), 2, 3);
      } else {
        tins(c, 5, 12, 8, 3, 2, 0.5);
        tins(c, 5, 12, 13, 3, 3, 0.7);
        tins(c, 5, 12, 18, 3, 4, 0.4);
        tins(c, 5, 12, 23, 3, 5, 0.8);
        c.line(5, 10, 10, 5, mix(C.glass, 0.8));
        c.speckle(4, 4, 13, 25, hex('#5a6a6a'), 8, 6);
      }
      c.rect(15, 6, 16, 9, hex('#2a2e30'));
      c.rect(15, 11, 16, 12, C.steel);
      c.set(15, 14, hex('#5a2622'));
      c.rect(4, 28, 15, 32, DARK);
      c.row(28, 4, 15, C.iron);
      if (u) c.line(4, 32, 15, 30, C.iron);
      rust(c, 2, 26, 17, b, 12, 4);
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 2, 11, b, VEND);
      c.rect(2, b - 1, 11, b, DARK);
      c.rect(4, 8, 9, 14, mix(VEND, 1.2));
      c.rect(5, 10, 8, 12, C.bone);
      rust(c, 2, 20, 11, b, 12, 4);
      if (u) {
        dots(c, C.glassLight, [12, b, 12, 20, 12, 12]);
        c.set(12, b - 1, hex('#3d5a6e'));
      }
    },
  });

  T('apocalypse-fridge-taped-shut', 'old fridge taped shut do not open rusted refrigerator rot inside flies', {
    w: 18, h: 36, solid: true, um: [0, 3, 9],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 15, b - 1, ENAMEL);
      c.row(2, 3, 14, ENAMEL);
      c.row(2, 3, 14, L(ENAMEL));
      c.col(2, 3, b - 1, L(ENAMEL));
      c.rect(3, b, 4, b, DARK);
      c.rect(13, b, 14, b, DARK);
      if (u) {
        c.rect(3, 4, 14, b - 2, hex('#2a2e2a'));
        for (const y of [11, 19, 27]) c.row(y, 3, 14, hex('#6f7478'));
        for (const [x, y, w] of [[4, 9, 3], [9, 17, 4], [5, 25, 5], [11, 9, 2], [4, 17, 2]]) {
          c.rect(x, y, x + w - 1, y + 1, C.rot);
          c.set(x, y, hex('#5a6e48'));
        }
        c.rect(6, 29, 11, b - 2, hex('#4a3e2a'));
        drip(c, 8, b - 1, 1, hex('#5a6e48'));
        c.row(b, 6, 12, hex('#5a6e48'));
        /* the door swung wide */
        c.rect(16, 3, 22, b - 1, mix(ENAMEL, 0.8));
        c.frame(16, 3, 22, b - 1, D(ENAMEL));
        for (const y of [12, 22]) c.row(y, 17, 21, hex('#8a8a80'));
        dots(c, DARK, [6, 0, 10, -1, 13, 1, 19, 0, 17, -2]);
      } else {
        c.row(12, 2, 15, D(ENAMEL));
        c.rect(13, 6, 13, 10, C.steel);
        c.rect(13, 15, 13, 21, C.steel);
        rust(c, 2, 14, 15, b - 1, 10, 3);
        for (const x of [5, 10]) drip(c, x, 13, 5, RUST);
        /* tape and a warning */
        for (const y of [7, 24]) {
          c.rect(2, y, 15, y + 1, hex('#8a8a80'));
          c.row(y, 2, 15, hex('#a0a094'));
        }
        c.rect(5, 16, 11, 21, C.paper);
        txt(c, 6, 16, 'NO', PAINT, { sp: 0 });
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 3, 11, b - 1, ENAMEL);
      c.row(2, 3, 10, L(ENAMEL));
      c.rect(3, b, 4, b, DARK);
      c.rect(9, b, 10, b, DARK);
      rust(c, 2, 14, 11, b - 1, 10, 3);
      if (u) {
        c.col(11, 4, b - 2, hex('#2a2e2a'));
        c.rect(12, 3, 12, b - 1, mix(ENAMEL, 0.8));
        dots(c, DARK, [8, 0, 12, 1]);
        c.row(b, 11, 13, hex('#5a6e48'));
      } else for (const y of [7, 24]) c.rect(2, y, 11, y + 1, hex('#8a8a80'));
    },
  });

  {
    const booth = (c, u, side) => {
      const b = c.h - 2;
      c.rect(2, 2, 15, 6, BOOTH);
      c.row(2, 3, 14, L(BOOTH));
      c.rect(3, 3, 14, 5, u ? WARM : hex('#3a3e44'));
      if (!side) txt(c, 4, 3, 'TEL', u ? DARK : hex('#6a6e74'), { sp: 0 });
      c.rect(2, 7, 15, b, hex('#2a343a'));
      for (const x of [2, 15]) c.col(x, 7, b, BOOTH);
      for (const y of [7, 17, 27, b]) c.row(y, 2, 15, BOOTH);
      c.col(2, 2, b, L(BOOTH));
      c.rect(2, b - 5, 15, b, D(BOOTH));
      /* the telephone */
      if (side) {
        c.rect(11, 12, 14, 20, hex('#1e2226'));
        c.col(10, 13, 17, u ? hex('#2a343a') : hex('#3a3e44'));
      } else {
        c.rect(6, 11, 11, 21, hex('#1e2226'));
        c.rect(7, 12, 10, 14, hex('#4a5a4e'));
        dots(c, C.steel, [7, 16, 9, 16, 7, 18, 9, 18]);
        if (!u) c.rect(12, 12, 12, 17, hex('#3a3e44'));
      }
      if (u) {
        const x = side ? 9 : 12;
        c.col(x, 14, 25, hex('#3a3e44'));
        c.rect(x - 1, 26, x, 30, hex('#55585e'));
        c.set(x, 24, hex('#3a3e44'));
      }
      /* broken panes */
      for (const [x, y] of side ? [[4, 19], [6, 22], [5, 9]] : [[4, 29], [13, 24], [4, 9]]) {
        c.rect(x, y, x + 1, y + 2, DARK);
        c.set(x + 1, y - 1, C.glassLight);
        c.set(x - 1 < 3 ? x + 2 : x - 1, y + 2, C.glassLight);
      }
      c.line(4, 15, 6, 10, mix(C.glass, 0.7));
      rust(c, 2, b - 5, 15, b, 9, 2);
      dots(c, C.glassLight, [1, b, 5, b, 16, b]);
      dots(c, WEED, [0, b, 17, b]);
    };
    T('apocalypse-phone-box-dead-line', 'wrecked telephone box phone booth broken glass handset hanging dead line rings', {
      w: 18, h: 42, solid: true,
      f: (c, u) => booth(c, u, false),
      sw: 18,
      s: (c, u) => booth(c, u, true),
    });
  }

  T('apocalypse-cash-machine-smashed', 'cash machine atm smashed open worthless bank notes money spilling', {
    w: 18, h: 34, solid: true, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 15, b, ATM);
      c.row(2, 2, 15, L(ATM));
      c.col(2, 2, b, L(ATM));
      c.rect(2, 2, 15, 8, D(ATM));
      txt(c, 2, 3, 'CASH', hex('#8f9aa6'), { sp: 0 });
      c.rect(4, 10, 13, 16, hex('#1c2226'));
      c.line(5, 15, 9, 11, hex('#39454a'));
      for (const [x, y] of [[13, 10], [8, 16], [4, 13]]) c.line(10, 13, x, y, hex('#4a5a5e'));
      c.rect(2, b - 1, 15, b, D(ATM));
      const NOTE = hex('#8a9a78');
      if (u) {
        c.rect(4, 18, 13, 27, DARK);
        c.rect(5, 22, 12, 23, C.iron);
        c.rect(6, 24, 11, 26, NOTE);
        c.poly([[14, 18], [18, 20], [18, 29], [14, 27]], mix(ATM, 0.8));
        c.line(14, 18, 18, 20, ATM);
        for (const [x, y] of [[5, b], [9, b - 1], [16, b], [19, b - 1], [12, b], [20, b]]) {
          c.rect(x, y, x + 2, y, NOTE);
          c.set(x + 1, y, L(NOTE));
        }
        dots(c, NOTE, [8, 28, 11, 29, 7, 30]);
      } else {
        for (let y = 19; y <= 23; y += 2) for (let x = 5; x <= 9; x += 2) c.set(x, y, C.steel);
        c.rect(11, 19, 13, 19, DARK);
        c.set(13, 20, hex('#24452e'));
        c.rect(4, 26, 13, 27, DARK);
        c.row(26, 4, 13, C.iron);
        c.line(3, 24, 6, 28, C.ironDark);
        c.line(12, 28, 14, 24, C.ironDark);
        rust(c, 2, 17, 15, b, 16, 4);
      }
    },
    sw: 12, sum: [0, 0, 4],
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 2, 9, b, ATM);
      c.rect(2, 2, 9, 8, D(ATM));
      c.rect(2, b - 1, 9, b, D(ATM));
      c.col(10, 10, 16, hex('#1c2226'));
      if (u) {
        c.poly([[10, 18], [13, 19], [13, 28], [10, 27]], mix(ATM, 0.8));
        for (const x of [10, 13]) c.rect(x, b, x + 1, b, hex('#8a9a78'));
      } else c.rect(10, 26, 10, 27, C.iron);
    },
  });

  T('apocalypse-fuel-pump-dry', 'dead fuel pump petrol station no fuel sign hose nozzle dry rusted', {
    w: 18, h: 38, solid: true, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 2, 16, b, CONC);
      c.row(b - 2, 1, 16, L(CONC));
      c.rect(3, 8, 13, b - 3, PUMP);
      c.col(3, 8, b - 3, L(PUMP));
      c.rect(3, 8, 13, 9, PUMPC);
      c.rect(3, 22, 13, 23, PUMPC);
      c.oval(5, 1, 11, 7, PUMPC);
      c.rect(7, 3, 9, 5, PUMP);
      c.rect(5, 11, 11, 16, C.bone);
      c.frame(4, 10, 12, 17, C.iron);
      txt(c, 6, 11, '00', DARK, { sp: 0 });
      rust(c, 3, 8, 13, b - 3, 9, 4);
      c.rect(4, 25, 12, 31, CARDY);
      txt(c, 5, 26, 'NO', PAINT, { sp: 0 });
      /* hose and nozzle */
      c.col(14, 12, 13, C.iron);
      if (u) {
        c.line(14, 13, 16, 30, DARK);
        c.line(16, 30, 20, b - 1, DARK);
        c.rect(20, b - 1, 23, b - 1, C.steel);
        c.set(23, b, hex('#3a3a2a'));
        c.row(b, 20, 22, hex('#3a3a2a'));
      } else {
        c.line(14, 13, 16, 24, DARK);
        c.line(16, 24, 14, 20, DARK);
        c.rect(14, 16, 15, 19, C.steel);
        c.set(15, 15, C.steel);
      }
      dots(c, WEED, [0, b, 17, b]);
    },
    sw: 12, sum: [0, 0, 4],
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 2, 10, b, CONC);
      sideBox(c, 3, 8, 8, b - 3, PUMP);
      c.rect(3, 8, 8, 9, PUMPC);
      c.rect(3, 22, 8, 23, PUMPC);
      c.rect(5, 1, 6, 7, PUMPC);
      rust(c, 3, 8, 8, b - 3, 9, 4);
      if (u) {
        c.line(9, 13, 11, b - 1, DARK);
        c.rect(11, b - 1, 13, b - 1, C.steel);
      } else {
        c.rect(9, 15, 10, 19, C.steel);
        c.col(9, 12, 24, DARK);
      }
    },
  });

  /* ---------- watch posts ---------- */
  T('apocalypse-watchtower-scaffold', 'watchtower lookout post scaffold poles sandbags tin roof ladder searchlight guard', {
    w: 30, h: 62, solid: true, um: [8, 0, 0],
    f(c, u) {
      const b = c.h - 2,
        P = hex('#6f7478');
      for (const x of [4, 24]) {
        c.rect(x, 6, x + 1, b, P);
        c.col(x, 6, b, L(P));
      }
      for (const [y0, y1] of [[26, 42], [42, b - 1]]) {
        c.line(5, y0, 24, y1, D(P));
        c.line(24, y0, 5, y1, D(P));
        c.row(y1, 4, 25, P);
      }
      /* ladder */
      for (const x of [12, 17]) c.col(x, 25, b, C.woodLight);
      for (let y = 28; y < b; y += 4) c.row(y, 12, 17, C.wood);
      /* platform, walls, roof */
      c.rect(1, 23, 28, 25, C.wood);
      c.row(23, 1, 28, C.woodLight);
      c.rect(2, 15, 14, 22, TIN);
      for (let x = 3; x <= 14; x += 2) c.col(x, 15, 22, D(TIN));
      rust(c, 2, 15, 14, 22, 8, 3);
      sandbags(c, 15, 27, 20, 0);
      sandbags(c, 16, 27, 17, 3);
      c.poly([[1, 6], [3, 3], [26, 3], [28, 6]], TARP);
      c.row(3, 3, 26, L(TARP));
      c.row(6, 1, 28, D(TARP));
      c.rect(8, 9, 11, 12, C.ironDark);
      c.rect(7, 9, 7, 12, u ? LAMP : GLASSD);
      c.col(9, 13, 14, C.iron);
      c.rect(20, 11, 23, 13, OLIVE);
      c.row(14, 19, 24, OLIVED);
      if (u) {
        for (let i = 1; i <= 7; i++) dots(c, mix(WARM, 0.8), [7 - i, 10 - (i >> 1), 7 - i, 11 + (i >> 1)]);
        dots(c, mix(WARM, 0.8), [3, 10, 1, 11, -2, 10, -4, 11]);
        c.rect(20, 14, 23, 16, hex('#3a3a44'));
      }
      grass(c, 2, 27, b, 4, WEED, 2);
    },
    sw: 22, sum: [0, 0, 0],
    s(c, u) {
      const b = c.h - 2,
        P = hex('#6f7478');
      for (const x of [3, 17]) {
        c.rect(x, 6, x + 1, b, P);
        c.col(x, 6, b, L(P));
      }
      for (const [y0, y1] of [[26, 42], [42, b - 1]]) {
        c.line(4, y0, 17, y1, D(P));
        c.row(y1, 3, 18, P);
      }
      c.col(19, 25, b, C.woodLight);
      for (let y = 28; y < b; y += 4) c.set(20, y, C.wood);
      c.rect(1, 23, 20, 25, C.wood);
      c.row(23, 1, 20, C.woodLight);
      sandbags(c, 2, 19, 20, 0);
      sandbags(c, 3, 19, 17, 3);
      c.poly([[1, 6], [3, 3], [18, 3], [20, 6]], TARP);
      c.row(3, 3, 18, L(TARP));
      c.row(6, 1, 20, D(TARP));
      c.oval(7, 8, 13, 14, C.ironDark);
      c.oval(8, 9, 12, 13, u ? LAMP : GLASSD);
      if (u) {
        c.rect(9, 10, 11, 12, hex('#f2e2a0'));
        dots(c, mix(WARM, 0.8), [6, 7, 14, 7, 5, 11, 15, 11, 6, 15, 14, 15]);
      } else c.set(9, 10, C.glassLight);
      c.col(10, 15, 16, C.iron);
      grass(c, 2, 19, b, 4, WEED, 2);
    },
  });

  T('apocalypse-searchlight-tripod', 'searchlight on a tripod big lamp battery night watch beam', {
    w: 22, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(10, 15, 3, b, C.iron);
      c.line(11, 15, 18, b, C.ironDark);
      c.col(10, 15, b - 2, C.ironDark);
      c.rect(9, 14, 12, 16, C.iron);
      c.oval(4, 1, 17, 14, C.ironDark);
      c.oval(5, 2, 16, 13, C.iron);
      c.oval(6, 3, 15, 12, u ? LAMP : GLASSD);
      if (u) {
        c.oval(8, 5, 13, 10, hex('#f2e2a0'));
        dots(c, mix(WARM, 0.8), [2, 1, 19, 1, 1, 7, 20, 8, 3, 14, 18, 14, 10, 0]);
      } else {
        c.line(8, 8, 11, 5, mix(C.glass, 0.9));
        c.rect(10, 7, 11, 8, hex('#55606a'));
      }
      c.rect(14, b - 4, 20, b, hex('#3a3a44'));
      c.row(b - 4, 14, 20, hex('#55555f'));
      dots(c, PAINT, [16, b - 5]);
      c.line(16, b - 6, 12, 15, DARK);
    },
    sw: 18, sum: [0, 0, 10],
    s(c, u) {
      const b = c.h - 2;
      c.line(8, 15, 3, b, C.iron);
      c.line(9, 15, 14, b, C.ironDark);
      c.col(8, 15, b - 2, C.ironDark);
      c.rect(7, 14, 10, 16, C.iron);
      c.rect(4, 2, 13, 13, C.ironDark);
      c.col(4, 3, 12, C.iron);
      c.rect(3, 5, 3, 10, C.iron);
      c.row(2, 5, 13, C.iron);
      c.col(14, 2, 13, u ? LAMP : GLASSD);
      c.col(13, 1, 14, C.iron);
      if (u) for (let i = 1; i <= 11; i++) dots(c, mix(WARM, i < 5 ? 0.95 : 0.75), [14 + i, 7 - ((i * 2) / 3 | 0), 14 + i, 8 + ((i * 2) / 3 | 0), 14 + i, i % 2 ? 7 : 8]);
      c.rect(2, b - 4, 6, b, hex('#3a3a44'));
      c.row(b - 4, 2, 6, hex('#55555f'));
    },
  });

  T('apocalypse-siren-pole', 'air raid siren on a pole warning horn alarm crank box sounding', {
    w: 18, h: 58, solid: true,
    f(c, u) {
      const b = c.h - 2,
        S = hex('#8a7a3a');
      c.rect(8, 9, 9, b, C.wood);
      c.col(8, 9, b, C.woodLight);
      c.rect(7, 4, 10, 9, S);
      c.col(7, 4, 9, L(S));
      c.poly([[6, 5], [2, 2], [2, 11], [6, 8]], S);
      c.poly([[11, 5], [15, 2], [15, 11], [11, 8]], D(S));
      c.col(2, 2, 11, DARK);
      c.col(15, 2, 11, DARK);
      c.rect(8, 2, 9, 3, C.iron);
      rust(c, 2, 2, 15, 11, 9, 3);
      /* the crank box */
      c.rect(6, 30, 11, 38, hex('#5a6258'));
      c.row(30, 6, 11, hex('#737c70'));
      c.set(8, 33, u ? REDL : hex('#5a2622'));
      c.line(11, 35, 13, u ? 33 : 37, C.iron);
      c.set(13, u ? 32 : 38, DARK);
      c.line(9, 10, 9, 29, DARK);
      if (u) {
        for (const [x, s] of [[0, -1], [17, 1]]) dots(c, C.bone, [x, 4, x, 6, x, 8, x - s * 0, 10]);
        dots(c, C.bone, [0, 2, 17, 2, 0, 12, 17, 12]);
      }
      dots(c, WEED, [7, b, 10, b, 11, b]);
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2,
        S = hex('#8a7a3a');
      c.rect(6, 9, 7, b, C.wood);
      c.col(6, 9, b, C.woodLight);
      c.oval(2, 2, 11, 11, S);
      c.oval(3, 3, 10, 10, D(S));
      c.oval(4, 4, 9, 9, DARK);
      c.rect(6, 6, 7, 7, C.iron);
      rust(c, 2, 2, 11, 11, 9, 3);
      sideBox(c, 4, 30, 8, 38, hex('#5a6258'));
      c.rect(9, 34, 10, 35, C.iron);
      if (u) {
        dots(c, C.bone, [0, 3, 13, 3, 0, 10, 13, 10, 6, 0, 7, 0]);
        c.set(9, 31, REDL);
      }
      dots(c, WEED, [5, b, 8, b]);
    },
  });

  T('apocalypse-checkpoint-boom', 'checkpoint boom barrier red white pole stop sign road block raised', {
    w: 46, h: 26, solid: true, um: [0, 22, 0], sum: [0, 22, 0],
    f(c, u) {
      const b = c.h - 2,
        R = hex('#9a3a30');
      drum(c, 2, b, 8, 14, hex('#5a5d64'));
      c.row(b - 13, 3, 8, CONC);
      c.rect(40, 12, 41, b, C.iron);
      c.rect(39, 10, 42, 11, C.iron);
      c.rect(38, b, 43, b, CONCD);
      sandbags(c, 10, 20, b - 2, 0);
      const stripe = (i) => (((i / 4) | 0) % 2 ? C.white : R);
      if (u) {
        for (let i = 0; i <= 38; i++) {
          const x = 5 + Math.round(i * 0.5),
            y = 9 - Math.round(i * 0.78);
          c.set(x, y, stripe(i));
          c.set(x + 1, y, mix(stripe(i), 0.8));
        }
        c.rect(1, 9, 4, 12, C.ironDark);
        c.col(14, -3, 1, C.iron);
        c.rect(10, 2, 18, 8, C.white);
        txt(c, 11, 3, 'GO', hex('#3f6a52'));
      } else {
        for (let x = 4; x <= 43; x++) {
          c.set(x, 8, stripe(x));
          c.set(x, 9, mix(stripe(x), 0.8));
        }
        c.rect(0, 7, 3, 10, C.ironDark);
        c.rect(15, 10, 31, 17, C.white);
        c.frame(15, 10, 31, 17, R);
        txt(c, 16, 12, 'STOP', R);
        dots(c, C.iron, [17, 10, 29, 10]);
      }
      c.rect(4, 6, 6, 11, C.iron);
      dots(c, WEED, [1, b, 30, b, 44, b]);
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2,
        R = hex('#9a3a30');
      drum(c, 2, b, 8, 14, hex('#5a5d64'));
      c.row(b - 13, 3, 8, CONC);
      c.rect(5, 6, 6, 11, C.iron);
      if (u) {
        for (let y = -21; y <= 9; y++) {
          c.set(5, y, ((y + 40) >> 2) % 2 ? C.white : R);
          c.set(6, y, mix(((y + 40) >> 2) % 2 ? C.white : R, 0.8));
        }
      } else {
        c.rect(5, 8, 6, 9, R);
        c.rect(7, 10, 7, 17, C.white);
        c.col(8, 10, 17, R);
      }
    },
  });

  T('apocalypse-grave-mound-cross', 'fresh grave mound plank cross roadside burial helmet dog tags dug up', {
    w: 16, h: 22, solid: true, base: 'side',
    sw: 32,
    s(c, u) {
      const b = c.h - 2,
        E = hex('#5e4636');
      c.rect(5, 2, 6, b - 2, C.woodLight);
      c.col(6, 2, b - 2, C.wood);
      c.rect(2, 6, 9, 7, C.woodLight);
      c.row(7, 2, 9, C.wood);
      dots(c, TIN, [5, 6, 6, 7, 4, 7, 7, 6]);
      c.line(7, 8, 8, 11, C.steel);
      c.set(8, 12, C.steel);
      if (u) {
        /* dug open and empty */
        c.poly([[10, b], [11, b - 2], [25, b - 2], [26, b]], DARK);
        c.poly([[24, b], [27, b - 5], [30, b - 2], [31, b]], E);
        c.poly([[1, b], [3, b - 3], [8, b - 3], [10, b]], E);
        c.speckle(1, b - 5, 31, b, D(E), 5, 3);
        c.line(22, b - 2, 26, b - 13, C.woodLight);
        c.rect(20, b - 4, 22, b - 1, C.steel);
        c.row(b - 1, 12, 20, hex('#2a2428'));
      } else {
        c.poly([[3, b], [5, b - 4], [10, b - 6], [22, b - 6], [27, b - 4], [30, b]], E);
        c.line(5, b - 4, 10, b - 6, L(E));
        c.row(b - 6, 10, 22, L(E));
        c.speckle(3, b - 6, 30, b, D(E), 5, 3);
        for (const x of [4, 9, 15, 21, 27]) c.rect(x, b, x + 1, b, CONC);
        dots(c, hex('#6a4a5a'), [14, b - 7, 16, b - 8]);
        dots(c, WEED, [14, b - 6, 15, b - 7, 16, b - 7]);
      }
      dots(c, WEED, [0, b, 1, b, 31, b]);
    },
    f(c, u) {
      const b = c.h - 2,
        E = hex('#5e4636');
      c.rect(7, 2, 8, b - 2, C.woodLight);
      c.col(8, 2, b - 2, C.wood);
      c.rect(4, 6, 11, 7, C.woodLight);
      c.row(7, 4, 11, C.wood);
      dots(c, TIN, [7, 6, 8, 7]);
      c.line(9, 8, 10, 11, C.steel);
      if (u) {
        c.rect(3, b - 2, 12, b, DARK);
        c.poly([[1, b], [2, b - 3], [4, b - 2], [4, b]], E);
        c.poly([[11, b], [12, b - 4], [14, b - 2], [14, b]], E);
        c.line(12, b - 3, 13, b - 12, C.woodLight);
      } else {
        c.poly([[2, b], [3, b - 4], [6, b - 6], [9, b - 6], [12, b - 4], [13, b]], E);
        c.row(b - 6, 6, 9, L(E));
        c.speckle(2, b - 6, 13, b, D(E), 5, 3);
        for (const x of [2, 7, 12]) c.rect(x, b, x + 1, b, CONC);
        dots(c, hex('#6a4a5a'), [5, b - 6]);
      }
    },
  });
};
