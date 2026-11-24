/* env-apocalypse, part 4: what people carry, hoard and leave behind. Part of tools/big/env2-ruin.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring } = X;
  const { bricks, planks, boards, hazard, rust, soot, tins, tin, bottle, litter, flame, fire, smoke, pool, drum, crate, sandbags, skull, trefoil, gasmask } = X;
  const { tyreFlat, mesh, coil, grass, pane, screen, drip } = X;
  const { TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, WATER, WATERL, SMOKE, RUST, RUSTD, SOOT, OLIVE, OLIVED, KHAKI, CANVAS, TARP, HAZ, SAND, WARM, TINS } = X;
  setCat('env-apocalypse', 'Apocalypse');

  const WEED = hex('#5a6a3a'),
    PAINT = hex('#8a2a26'),
    JRED = hex('#8a3a2e'),
    BAGK = hex('#2a2c32'),
    BAGL = hex('#484c56'),
    WIRE = hex('#7c8088'),
    PRAM = hex('#3a4458'),
    COAT = hex('#5a5648'),
    MANQ = hex('#c9b8a0');

  T('apocalypse-gas-masks-rack', 'gas masks hanging on hooks respirators filters rack by the door one missing', {
    w: 26, h: 22, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 24, 4, C.wood);
      c.row(2, 1, 24, C.woodLight);
      dots(c, C.ironDark, [2, 3, 23, 3]);
      for (const [x, i] of [[2, 0], [10, 1], [18, 2]]) {
        c.rect(x + 3, 5, x + 3, 6, C.iron);
        if (u && i === 1) {
          c.set(x + 2, 7, C.iron);
          continue;
        }
        c.col(x + 3, 6, 8, hex('#55584f'));
        gasmask(c, x, 8, i === 2 ? hex('#4a4038') : hex('#3a3d38'));
        c.rect(x + 2, 16, x + 4, 18, i ? hex('#6a6d5a') : hex('#55584f'));
        c.row(18, x + 2, x + 4, DARK);
      }
      if (u) {
        c.rect(11, b - 1, 13, b, hex('#6a6d5a'));
        c.row(b, 11, 13, DARK);
      }
    },
    sw: 8,
    s(c, u) {
      c.rect(2, 2, 3, 4, C.wood);
      c.col(2, 2, 4, C.woodLight);
      c.row(5, 4, 5, C.iron);
      if (!u) {
        c.rect(4, 8, 5, 15, hex('#3a3d38'));
        c.rect(6, 12, 6, 14, hex('#55584f'));
        c.set(5, 10, C.glassLight);
        c.rect(4, 16, 6, 18, hex('#6a6d5a'));
        c.col(4, 6, 7, hex('#55584f'));
      } else c.set(6, 6, C.iron);
    },
  });

  {
    const can = (c, x, yb, col) => {
      c.rect(x, yb - 8, x + 5, yb, col);
      c.col(x, yb - 8, yb, L(col));
      c.row(yb, x, x + 5, D(col));
      c.line(x + 1, yb - 6, x + 4, yb - 1, D(col));
      c.line(x + 4, yb - 6, x + 1, yb - 1, D(col));
      c.rect(x + 1, yb - 10, x + 4, yb - 9, D(col));
      c.rect(x + 4, yb - 11, x + 5, yb - 10, C.iron);
      c.clear(x + 2, yb - 9);
      c.clear(x + 3, yb - 9);
    };
    T('apocalypse-jerrycans-fuel', 'jerry cans petrol fuel canisters olive red hoard spilled', {
      w: 22, h: 16, solid: false,
      f(c, u) {
        const b = c.h - 2;
        can(c, 2, b, OLIVE);
        can(c, 9, b, JRED);
        if (u) {
          /* one on its side, the last of it running out */
          c.rect(15, b - 5, 20, b, OLIVE);
          c.row(b - 5, 15, 20, L(OLIVE));
          c.rect(13, b - 4, 14, b - 1, OLIVED);
          c.set(12, b - 1, C.iron);
          c.row(b, 7, 13, hex('#3a3a2a'));
          c.row(b, 9, 11, hex('#5a5a40'));
        } else can(c, 15, b, OLIVE);
        rust(c, 2, 3, 20, b, 14, 2);
      },
      sw: 10,
      s(c, u) {
        const b = c.h - 2;
        c.rect(3, b - 8, 6, b, mix(OLIVE, 0.9));
        c.col(3, b - 8, b, OLIVE);
        c.rect(4, b - 10, 5, b - 9, OLIVED);
        c.set(5, b - 11, C.iron);
        if (u) c.row(b, 6, 9, hex('#3a3a2a'));
      },
    });
  }

  T('apocalypse-canned-food-hoard', 'canned food tins hoard pyramid of cans rations beans opened empty spoon', {
    w: 20, h: 14, solid: false,
    f(c, u) {
      const b = c.h - 2;
      const cols = [TINS[0], TINS[1], TINS[2], TINS[3], TINS[5], TINS[6]];
      for (let i = 0; i < 5; i++) tin(c, 1 + i * 4 - (i > 3 ? 1 : 0), b, cols[i], 4, 3);
      if (u) {
        tin(c, 3, b - 4, cols[5], 4, 3);
        /* opened: a lid bent up, a spoon in it */
        c.rect(9, b - 4, 11, b - 4, DARK);
        c.line(11, b - 5, 13, b - 7, C.steel);
        c.line(9, b - 5, 8, b - 9, C.steel);
        c.rect(15, b - 1, 18, b, cols[1]);
        c.col(18, b - 1, b, DARK);
        c.set(14, b, hex('#a0623a'));
        c.set(13, b, hex('#a0623a'));
      } else {
        for (let i = 0; i < 3; i++) tin(c, 3 + i * 4, b - 4, cols[(i + 3) % 6], 4, 3);
        tin(c, 7, b - 8, cols[2], 4, 3);
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      for (let i = 0; i < 2; i++) tin(c, 2 + i * 4, b, TINS[i * 3], 4, 3);
      if (u) {
        tin(c, 2, b - 4, TINS[6], 4, 3);
        c.line(4, b - 9, 3, b - 12, C.steel);
        c.set(10, b, hex('#a0623a'));
      } else {
        tin(c, 4, b - 4, TINS[5], 4, 3);
        tin(c, 4, b - 8, TINS[2], 4, 3);
      }
    },
  });

  T('apocalypse-backpack-bedroll', 'survivor backpack rucksack with bedroll canteen bug out bag rifled open', {
    w: 18, h: 20, solid: false, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 6, 13, b, OLIVE);
      c.col(3, 6, b, L(OLIVE));
      c.row(b, 3, 13, OLIVED);
      c.rect(5, b - 6, 11, b - 1, OLIVED);
      c.row(b - 6, 5, 11, mix(OLIVE, 0.85));
      c.set(8, b - 4, C.brass);
      for (const x of [5, 11]) c.col(x, 7, b - 7, KHAKI);
      /* bedroll */
      c.rect(2, 2, 14, 5, hex('#6a5a4a'));
      c.row(2, 3, 13, hex('#85735e'));
      for (const x of [5, 11]) c.col(x, 2, 5, KHAKI);
      c.oval(2, 2, 4, 5, hex('#85735e'));
      c.set(3, 3, hex('#6a5a4a'));
      /* canteen */
      c.rect(14, b - 6, 16, b - 2, hex('#55584f'));
      c.set(15, b - 7, C.steel);
      if (u) {
        c.rect(4, 6, 12, 8, DARK);
        c.poly([[3, 6], [8, 3], [13, 6]], mix(OLIVE, 0.8));
        c.clearRect(2, 1, 14, 2);
        c.rect(14, b - 6, 16, b - 2, OLIVE);
        c.rect(16, b - 2, 22, b, hex('#6a5a4a'));
        c.oval(20, b - 3, 23, b, hex('#85735e'));
        tin(c, 15, b, TINS[0], 3, 2);
        c.rect(18, b - 4, 20, b - 3, C.paper);
        c.row(6, 6, 10, C.paper);
      }
    },
    sw: 12, sum: [0, 0, 4],
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 6, 8, b, mix(OLIVE, 0.9));
      c.col(3, 6, b, OLIVE);
      c.rect(9, b - 6, 10, b - 1, OLIVED);
      c.line(2, 8, 2, b - 4, KHAKI);
      if (u) {
        c.rect(4, 6, 7, 7, DARK);
        c.rect(10, b - 2, 14, b, hex('#6a5a4a'));
      } else {
        c.oval(3, 2, 8, 5, hex('#85735e'));
        c.set(5, 3, hex('#6a5a4a'));
        c.set(6, 4, hex('#6a5a4a'));
      }
    },
  });

  T('apocalypse-radio-wind-up', 'wind up radio hand crank emergency broadcast receiver aerial voices', {
    w: 18, h: 16, solid: false,
    f(c, u) {
      const b = c.h - 2,
        R = hex('#7a4a34');
      c.rect(2, 6, 14, b, R);
      c.row(6, 2, 14, L(R));
      c.col(2, 6, b, L(R));
      c.rect(3, 8, 8, b - 1, hex('#3a3430'));
      for (let y = 8; y < b; y += 2) c.row(y, 3, 8, hex('#55504a'));
      c.rect(10, 8, 13, 9, u ? hex('#c9a04a') : C.bone);
      c.set(u ? 12 : 11, 8, PAINT);
      c.rect(10, b - 2, 11, b - 1, C.bone);
      c.set(13, b - 2, u ? GREENL : DARK);
      c.line(13, 6, 15, 1, C.steel);
      c.rect(15, 9, 16, 10, C.iron);
      c.set(16, u ? 8 : 11, DARK);
      if (u) dots(c, AMBER, [13, 0, 17, 0, 12, 2, 17, 3]);
    },
    sw: 8,
    s(c, u) {
      const b = c.h - 2,
        R = hex('#7a4a34');
      sideBox(c, 2, 6, 5, b, R);
      c.col(4, 1, 5, C.steel);
      c.rect(6, 9, 6, 10, C.iron);
      if (u) dots(c, AMBER, [2, 0, 6, 0]);
    },
  });

  T('apocalypse-geiger-counter', 'geiger counter radiation meter yellow box probe clicking needle in the red', {
    w: 18, h: 13, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 12, b, HAZ);
      c.row(4, 2, 12, L(HAZ));
      c.col(2, 4, b, L(HAZ));
      c.rect(4, 2, 10, 3, C.ironDark);
      c.clear(5, 3);
      c.rect(6, 3, 8, 3, null);
      c.rect(3, 6, 8, 9, C.bone);
      c.set(8, 6, PAINT);
      c.set(7, 6, PAINT);
      if (u) c.line(5, 9, 8, 7, DARK);
      else c.line(5, 9, 4, 7, DARK);
      c.set(10, 6, u ? REDL : hex('#5a2622'));
      c.set(10, 9, DARK);
      /* the probe on its cable */
      c.line(12, 8, 14, 6, DARK);
      c.rect(14, b - 1, 16, b, C.steel);
      c.col(15, 6, b - 2, DARK);
      if (u) dots(c, C.bone, [14, 2, 16, 3, 17, 5]);
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 4, 6, b, HAZ);
      c.rect(3, 2, 5, 3, C.ironDark);
      c.clear(4, 3);
      c.rect(7, b - 1, 8, b, C.steel);
      if (u) dots(c, C.bone, [7, 3, 8, 5, 3, 0]);
    },
  });

  T('apocalypse-first-aid-case', 'first aid case medical kit green box white cross bandages opened bloody gauze', {
    w: 18, h: 12, solid: false, um: [0, 6, 0], sum: [0, 6, 0],
    f(c, u) {
      const b = c.h - 2,
        G = hex('#4a6a50');
      c.rect(2, 4, 15, b, G);
      c.col(2, 4, b, L(G));
      c.row(b, 2, 15, D(G));
      if (u) {
        c.rect(2, -3, 15, 3, mix(G, 0.75));
        c.frame(2, -3, 15, 3, D(G));
        c.rect(3, 4, 14, 5, DARK);
        c.rect(4, 3, 7, 5, C.white);
        c.rect(9, 4, 11, 5, hex('#7a5a34'));
        c.rect(12, 3, 13, 5, C.bone);
        c.rect(5, 0, 12, 1, hex('#8a8a80'));
        /* used dressings on the floor */
        c.rect(0, b, 3, b, C.white);
        dots(c, C.blood, [1, b, 2, b, 16, b]);
        c.set(17, b, C.white);
      } else {
        c.row(4, 2, 15, L(G));
        c.row(6, 2, 15, D(G));
        c.rect(7, 2, 10, 3, C.iron);
        c.clear(8, 3);
        c.clear(9, 3);
        c.rect(8, 7, 9, b - 1, C.white);
        c.rect(6, 8, 11, b - 2, C.white);
        dots(c, C.steel, [4, 6, 13, 6]);
      }
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2,
        G = hex('#4a6a50');
      sideBox(c, 2, 4, 7, b, G);
      if (u) {
        c.rect(2, -3, 3, 3, mix(G, 0.75));
        c.rect(3, 3, 6, 4, C.white);
        dots(c, C.blood, [8, b]);
      } else {
        c.row(6, 2, 7, D(G));
        c.rect(4, 2, 5, 3, C.iron);
      }
    },
  });

  T('apocalypse-ammo-box', 'ammunition box olive steel tin bullets cartridges brass rounds open', {
    w: 16, h: 12, solid: false, um: [0, 4, 0], sum: [0, 4, 0],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 13, b, OLIVE);
      c.col(2, 4, b, L(OLIVE));
      c.row(b, 2, 13, OLIVED);
      txt(c, 4, 6, '762', hex('#b5a060'), { sp: 0 });
      if (u) {
        c.rect(2, -2, 13, 2, OLIVED);
        c.row(-2, 2, 13, OLIVE);
        c.rect(3, 3, 12, 4, DARK);
        for (let x = 3; x <= 12; x += 2) c.col(x, 2, 4, C.brass);
        dots(c, C.brass, [0, b, 15, b, 14, b]);
      } else {
        c.rect(1, 2, 14, 3, OLIVED);
        c.row(2, 1, 14, OLIVE);
        c.rect(6, 1, 9, 1, C.iron);
        c.set(14, 5, C.iron);
      }
      rust(c, 2, 4, 13, b, 20, 3);
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 4, 7, b, OLIVE);
      if (u) {
        c.rect(2, -2, 3, 3, OLIVED);
        c.col(5, 2, 3, C.brass);
        c.set(8, b, C.brass);
      } else {
        c.rect(1, 2, 8, 3, OLIVED);
        c.rect(4, 1, 5, 1, C.iron);
      }
    },
  });

  T('apocalypse-water-bottles-crate', 'crate of water bottles drinking water plastic bottles stockpile half gone', {
    w: 20, h: 16, solid: false,
    f(c, u) {
      const b = c.h - 2,
        P = hex('#3d5a6e');
      const bot = (x, full) => {
        c.rect(x, b - 10, x + 2, b - 3, full ? hex('#7fa0a8') : hex('#93a8a8'));
        if (full) c.rect(x, b - 8, x + 2, b - 3, WATER);
        c.col(x, b - 10, b - 3, WATERL);
        c.set(x + 1, b - 11, hex('#3d5a8a'));
        c.row(b - 6, x, x + 2, C.white);
      };
      for (let i = 0; i < 4; i++) if (!u || i === 0 || i === 3) bot(3 + i * 4, !u || i === 0);
      c.rect(1, b - 5, 18, b, P);
      c.row(b - 5, 1, 18, L(P));
      for (let x = 3; x <= 16; x += 3) c.rect(x, b - 3, x + 1, b - 1, D(P));
      c.col(1, b - 5, b, L(P));
      if (u) {
        c.rect(7, b - 5, 13, b - 5, DARK);
      }
    },
    sw: 12, sum: [0, 0, 6],
    s(c, u) {
      const b = c.h - 2,
        P = hex('#3d5a6e');
      for (const x of [3, 7]) {
        if (u && x === 7) continue;
        c.rect(x, b - 10, x + 2, b - 3, WATER);
        c.col(x, b - 10, b - 3, WATERL);
        c.set(x + 1, b - 11, hex('#3d5a8a'));
      }
      sideBox(c, 2, b - 5, 10, b, P);
      if (u) {
        /* an empty rolled away */
        c.rect(12, b - 2, 16, b, hex('#93a8a8'));
        c.row(b - 2, 12, 16, WATERL);
        c.set(17, b - 1, hex('#3d5a8a'));
      }
    },
  });

  T('apocalypse-storm-lantern', 'storm lantern hurricane lamp paraffin light camp lit', {
    w: 10, h: 16, solid: false, same: true,
    f(c, u) {
      const b = c.h - 2,
        M = hex('#4f6a78');
      c.rect(2, b - 3, 7, b, M);
      c.row(b - 3, 2, 7, L(M));
      c.rect(3, 6, 6, b - 4, u ? LAMP : hex('#6f8a8c'));
      if (u) {
        c.rect(4, 8, 5, b - 5, hex('#f2e2a0'));
        c.set(4, 7, C.flame);
      } else {
        c.set(4, b - 5, DARK);
        c.col(3, 6, b - 4, C.glassLight);
      }
      c.rect(3, 4, 6, 5, M);
      c.rect(4, 3, 5, 3, D(M));
      c.col(1, 4, b - 3, C.iron);
      c.col(8, 4, b - 3, C.iron);
      c.row(1, 3, 6, C.iron);
      dots(c, C.iron, [2, 2, 7, 2, 1, 3, 8, 3]);
      if (u) dots(c, mix(WARM, 0.8), [0, 7, 9, 9, 0, 10]);
    },
  });

  T('apocalypse-rifle-helmet-marker', 'battlefield cross rifle stuck in the ground with helmet and boots fallen soldier marker', {
    w: 16, h: 30, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.col(7, 8, b, C.ironDark);
      c.rect(7, 4, 8, 14, C.wood);
      c.col(7, 4, 14, C.woodLight);
      c.rect(6, 15, 9, 17, C.ironDark);
      c.set(9, 18, C.iron);
      /* boots */
      for (const x of [2, 10]) {
        c.rect(x, b - 4, x + 2, b, hex('#2e2a2a'));
        c.rect(x, b - 1, x + 3, b, hex('#2e2a2a'));
        c.row(b - 4, x, x + 2, hex('#4a4444'));
      }
      c.line(8, 9, 10, 13, C.steel);
      c.set(10, 14, C.steel);
      if (u) {
        pat(c, 4, b - 5, ['..lll....', '.looooo..', 'looooooo.', 'ooooooooo'], { o: OLIVE, l: L(OLIVE) });
        c.clearRect(10, b - 5, 13, b - 5);
        c.row(b, 3, 12, OLIVED);
      } else pat(c, 3, 1, ['..lll....', '.looooo..', 'looooooo.', 'ooooooooo', 'ddddddddd'], { o: OLIVE, l: L(OLIVE), d: OLIVED });
      dots(c, WEED, [0, b, 6, b, 14, b]);
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2;
      c.col(4, 8, b, C.ironDark);
      c.rect(3, 4, 5, 14, C.wood);
      c.col(3, 4, 14, C.woodLight);
      c.rect(4, 15, 6, 17, C.ironDark);
      c.rect(5, b - 4, 7, b, hex('#2e2a2a'));
      c.rect(5, b - 1, 8, b, hex('#2e2a2a'));
      if (u) c.rect(0, b - 2, 3, b, OLIVE);
      else pat(c, 0, 1, ['..lll....', '.looooo..', 'looooooo.', 'ooooooooo', 'ddddddddd'], { o: OLIVE, l: L(OLIVE), d: OLIVED });
    },
  });

  T('apocalypse-trolley-overturned-loot', 'overturned shopping trolley cart spilled looted goods tins supermarket', {
    w: 18, h: 20, solid: true, base: 'side',
    sw: 28,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        /* righted and loaded */
        c.poly([[4, 6], [21, 6], [19, 14], [6, 14]], hex('#2a2c32'));
        mesh(c, 4, 6, 21, 14, WIRE);
        c.row(6, 3, 22, WIRE);
        c.row(14, 6, 19, WIRE);
        c.line(4, 6, 6, 14, WIRE);
        c.line(21, 6, 19, 14, WIRE);
        c.line(21, 6, 25, 3, WIRE);
        c.rect(24, 2, 26, 3, PAINT);
        c.line(6, 15, 8, b - 2, WIRE);
        c.line(19, 15, 17, b - 2, WIRE);
        c.row(b - 2, 8, 17, WIRE);
        for (const x of [8, 17]) c.rect(x, b - 1, x + 1, b, TYRE);
        tins(c, 6, 19, 5, 4, 3);
        c.rect(10, 0, 14, 2, hex('#7a6a48'));
        bottle(c, 17, 2, 5, hex('#3f5f48'));
      } else {
        c.poly([[3, b - 12], [12, b - 10], [12, b], [3, b]], hex('#2a2c32'));
        mesh(c, 3, b - 12, 12, b, WIRE);
        c.line(3, b - 12, 12, b - 10, WIRE);
        c.col(3, b - 12, b, WIRE);
        c.col(12, b - 10, b, WIRE);
        c.row(b, 3, 12, WIRE);
        c.line(3, b - 12, 0, b - 15, WIRE);
        c.rect(0, b - 16, 1, b - 14, PAINT);
        c.line(13, b - 9, 17, b - 8, WIRE);
        c.line(13, b - 1, 17, b - 2, WIRE);
        c.col(17, b - 8, b - 2, WIRE);
        for (const y of [b - 9, b - 2]) c.rect(18, y, 19, y + 1, TYRE);
        /* the spill */
        tin(c, 14, b, TINS[0], 2, 3);
        tin(c, 20, b, TINS[1], 3, 2);
        tin(c, 24, b, TINS[3], 2, 3);
        c.rect(6, b - 3, 9, b - 1, hex('#7a6a48'));
        dots(c, C.paper, [22, b - 3, 26, b - 2]);
      }
    },
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(3, 6, 14, 14, hex('#2a2c32'));
        mesh(c, 3, 6, 14, 14, WIRE);
        c.frame(3, 6, 14, 14, WIRE);
        c.row(3, 3, 14, PAINT);
        c.col(3, 3, 5, WIRE);
        c.col(14, 3, 5, WIRE);
        c.col(5, 15, b - 2, WIRE);
        c.col(12, 15, b - 2, WIRE);
        for (const x of [4, 12]) c.rect(x, b - 1, x + 1, b, TYRE);
        tins(c, 4, 13, 5, 4, 3);
      } else {
        c.rect(2, b - 11, 11, b, hex('#2a2c32'));
        mesh(c, 2, b - 11, 11, b, WIRE);
        c.frame(2, b - 11, 11, b, WIRE);
        c.rect(1, b - 15, 2, b - 12, PAINT);
        c.row(b - 8, 12, 14, WIRE);
        c.rect(14, b - 9, 15, b - 7, TYRE);
        tin(c, 13, b, TINS[0], 3, 2);
        c.rect(5, b - 3, 8, b - 1, hex('#7a6a48'));
      }
    },
  });

  T('apocalypse-newspaper-rack-last-edition', 'newspaper rack last edition headline the end wire stand papers blown about', {
    w: 18, h: 26, solid: false, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 14]) c.rect(x, 3, x + 1, b, C.iron);
      c.rect(2, 2, 15, 6, PAINT);
      c.row(2, 2, 15, hex('#a8403a'));
      txt(c, 3, 2, 'NEWS', C.bone, { sp: 0 });
      c.rect(3, 8, 14, b - 3, hex('#2a2c32'));
      for (const y of [16, b - 3]) c.row(y, 2, 15, WIRE);
      const sheet = (x, y, w, h, head) => {
        c.rect(x, y, x + w - 1, y + h - 1, C.paper);
        if (head) txt(c, x + 1, y + 1, 'END', DARK, { sp: 0 });
        scribble(c, x + 1, y + (head ? 7 : 1), x + w - 2, y + h - 1, C.slate, 3);
      };
      if (u) {
        c.rect(4, 13, 13, 15, C.paper);
        c.row(13, 4, 13, C.parchment);
        sheet(15, b - 5, 9, 6, false);
        c.poly([[1, b], [5, b - 3], [9, b - 1], [8, b]], C.paper);
        c.line(5, b - 3, 8, b, C.parchment);
      } else {
        sheet(4, 8, 10, 8, true);
        sheet(4, 17, 10, 4, false);
      }
      rust(c, 2, 3, 15, b, 12, 5);
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2;
      c.line(3, 3, 2, b, C.iron);
      c.line(8, 8, 9, b, C.iron);
      c.rect(3, 2, 4, 6, PAINT);
      c.line(4, 8, 8, 16, hex('#2a2c32'));
      c.row(16, 3, 9, WIRE);
      c.row(b - 3, 2, 9, WIRE);
      if (u) c.rect(8, b, 10, b, C.paper);
      else {
        c.line(5, 8, 8, 15, C.paper);
        c.rect(5, 17, 8, 20, C.paper);
      }
    },
  });

  {
    const dummy = (c, u, side) => {
      const b = c.h - 2,
        m = side ? 4 : 7;
      c.rect(m - 2, b, m + 2, b, C.iron);
      c.col(m, 22, b, C.steel);
      /* a greatcoat on a shop dummy */
      c.rect(m - 3, 8, m + 3, 26, COAT);
      c.col(m - 3, 8, 26, L(COAT));
      c.rect(m - 4, 9, m - 4, 18, COAT);
      c.rect(m + 4, 9, m + 4, 18, D(COAT));
      c.col(m, 10, 26, D(COAT));
      dots(c, C.brass, [m + 1, 12, m + 1, 16, m + 1, 20]);
      c.rect(m - 4, 19, m - 4, 20, MANQ);
      c.rect(m - 1, 7, m + 1, 7, MANQ);
      /* the broom handle "rifle" */
      c.line(m + 4, 20, m + 5, 4, C.woodLight);
      c.set(m + 4, 19, MANQ);
      if (u) {
        c.rect(m - 1, 6, m + 1, 6, D(MANQ));
        c.oval(m - 5, b - 4, m - 1, b, MANQ);
        c.set(m - 4, b - 2, DARK);
        pat(c, m + 1, b - 3, ['.ooooo.', 'ooooooo', 'ddddddd'], { o: OLIVE, d: OLIVED });
      } else {
        c.rect(m - 2, 2, m + 2, 6, MANQ);
        c.col(m + 2, 2, 6, D(MANQ));
        if (!side) dots(c, DARK, [m - 1, 4, m + 1, 4]);
        else c.set(m + 2, 4, DARK);
        pat(c, m - 4, 0, ['..lll....', '.looooo..', 'looooooo.', 'ddddddddd'], { o: OLIVE, l: L(OLIVE), d: OLIVED });
      }
    };
    T('apocalypse-mannequin-sentry', 'shop mannequin dressed as a sentry decoy guard greatcoat helmet broom rifle head knocked off', {
      w: 16, h: 36, solid: true,
      f: (c, u) => dummy(c, u, false),
      sw: 12,
      s: (c, u) => dummy(c, u, true),
    });
  }

  T('apocalypse-pram-abandoned', 'abandoned pram baby carriage old perambulator rusted hood doll tipped over', {
    w: 16, h: 24, solid: true, base: 'side', um: [0, 0, 0],
    sw: 26,
    s(c, u) {
      const b = c.h - 2;
      if (u) {
        /* on its side */
        c.poly([[3, b - 12], [16, b - 12], [18, b - 2], [5, b - 1]], PRAM);
        c.line(3, b - 12, 16, b - 12, L(PRAM));
        c.poly([[14, b - 13], [21, b - 10], [18, b - 2], [16, b - 6]], D(PRAM));
        ring(c, 5, b - 14, 3, C.steel, C.iron);
        ring(c, 14, b - 15, 3, C.steel, C.iron);
        c.line(4, b - 2, 0, b, C.steel);
        rust(c, 3, b - 12, 18, b - 1, 18, 2);
        c.rect(21, b - 2, 23, b, C.flesh);
        c.rect(23, b - 1, 24, b, C.bone);
        c.set(21, b - 2, hex('#5a4030'));
        c.row(b, 19, 21, hex('#8a8a9a'));
      } else {
        c.poly([[5, 9], [20, 9], [19, 16], [7, 16]], PRAM);
        c.row(9, 5, 20, L(PRAM));
        c.row(12, 6, 19, hex('#55607a'));
        c.poly([[5, 9], [5, 3], [9, 2], [14, 4], [14, 9]], D(PRAM));
        c.line(5, 3, 9, 2, PRAM);
        for (const x of [8, 11]) c.line(x, 3, 13, 8, hex('#2e3648'));
        c.line(20, 9, 24, 4, C.steel);
        c.rect(23, 3, 24, 4, C.bone);
        c.line(8, 17, 17, 19, C.iron);
        c.line(17, 17, 8, 19, C.iron);
        ring(c, 7, b - 3, 3, C.steel, C.iron);
        ring(c, 18, b - 3, 3, C.steel, C.iron);
        rust(c, 5, 2, 20, 16, 18, 2);
        c.rect(15, 7, 17, 8, hex('#8a8a9a'));
      }
    },
    f(c, u) {
      const b = c.h - 2;
      if (u) {
        c.rect(2, b - 11, 12, b - 1, PRAM);
        c.row(b - 11, 2, 12, L(PRAM));
        c.rect(4, b - 9, 10, b - 3, D(PRAM));
        c.row(b - 13, 3, 6, C.steel);
        c.row(b - 14, 9, 12, C.steel);
        rust(c, 2, b - 11, 12, b - 1, 18, 2);
        c.rect(12, b - 1, 14, b, C.flesh);
      } else {
        c.rect(3, 9, 12, 16, PRAM);
        c.row(9, 3, 12, L(PRAM));
        c.row(12, 3, 12, hex('#55607a'));
        c.poly([[3, 9], [3, 4], [5, 2], [10, 2], [12, 4], [12, 9]], D(PRAM));
        c.rect(5, 5, 10, 8, hex('#1e2230'));
        c.row(2, 5, 10, PRAM);
        c.rect(6, 7, 8, 8, hex('#8a8a9a'));
        for (const x of [2, 12]) c.rect(x, b - 6, x + 1, b, C.iron);
        c.row(18, 3, 12, C.iron);
        rust(c, 3, 2, 12, 16, 18, 2);
      }
    },
  });

  {
    const tv = (c, x, y, w, h, on, seed) => {
      const P = [hex('#5a4a3a'), hex('#4a4a50'), hex('#3a3430')][seed % 3];
      c.rect(x, y, x + w - 1, y + h - 1, P);
      c.row(y, x, x + w - 1, L(P));
      c.col(x, y, y + h - 1, L(P));
      screen(c, x + 1, y + 1, x + w - 4, y + h - 2, on, 'static', seed);
      dots(c, C.steel, [x + w - 2, y + 2, x + w - 2, y + 4]);
    };
    T('apocalypse-tv-pile-dead', 'pile of dead televisions heap of tv sets broken screens one comes on static', {
      w: 28, h: 26, solid: true,
      f(c, u) {
        const b = c.h - 2;
        tv(c, 1, b - 8, 12, 9, false, 0);
        tv(c, 13, b - 9, 13, 10, false, 1);
        tv(c, 4, b - 16, 11, 8, u, 2);
        tv(c, 15, b - 15, 9, 6, false, 3);
        tv(c, 9, b - 22, 9, 6, false, 4);
        c.line(17, b - 6, 20, b - 3, hex('#4a5a5e'));
        c.line(21, b - 7, 18, b - 2, hex('#4a5a5e'));
        c.rect(3, b - 5, 6, b - 3, DARK);
        c.line(12, b - 23, 9, b - 25, C.steel);
        c.line(14, b - 23, 17, b - 25, C.steel);
        dots(c, C.glassLight, [0, b, 12, b, 26, b]);
        if (u) dots(c, hex('#9fb0ac'), [3, b - 13, 3, b - 11, 2, b - 15]);
      },
      sw: 14,
      s(c, u) {
        const b = c.h - 2;
        sideBox(c, 2, b - 8, 11, b, hex('#5a4a3a'));
        sideBox(c, 3, b - 16, 10, b - 9, hex('#3a3430'));
        sideBox(c, 4, b - 22, 9, b - 17, hex('#4a4a50'));
        c.line(6, b - 23, 5, b - 25, C.steel);
        c.rect(5, b - 6, 9, b - 3, D(hex('#5a4a3a')));
        if (u) {
          c.col(11, b - 15, b - 10, hex('#9fb0ac'));
          dots(c, hex('#9fb0ac'), [12, b - 13, 12, b - 11]);
        }
      },
    });
  }

  T('apocalypse-solar-panel-rig', 'solar panel on a scrap frame battery charging cable survivor power dusty', {
    w: 30, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2,
        P = u ? hex('#34486e') : hex('#4a4f5e');
      c.rect(2, 3, 23, 15, P);
      for (const x of [9, 16]) c.col(x, 3, 15, C.steel);
      for (const y of [7, 11]) c.row(y, 2, 23, C.steel);
      c.frame(1, 2, 24, 16, C.steel);
      if (u) {
        c.line(4, 9, 8, 4, hex('#5a78a8'));
        c.line(11, 14, 15, 9, hex('#5a78a8'));
      } else c.speckle(2, 3, 23, 15, hex('#7a7868'), 4, 3);
      c.line(4, 17, 2, b, C.wood);
      c.line(21, 17, 23, b, C.woodDark);
      c.row(19, 4, 21, C.wood);
      c.rect(22, b - 5, 28, b, hex('#3a3a44'));
      c.row(b - 5, 22, 28, hex('#55555f'));
      c.set(24, b - 6, PAINT);
      c.set(26, b - 3, u ? GREENL : hex('#24452e'));
      c.line(24, b - 7, 22, 16, DARK);
      if (u) c.rect(8, b - 1, 11, b, hex('#8a8a80'));
      dots(c, WEED, [0, b, 12, b, 14, b]);
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      c.line(3, 16, 11, 2, C.steel);
      c.line(4, 16, 12, 2, u ? hex('#34486e') : hex('#4a4f5e'));
      c.line(11, 3, 12, b, C.wood);
      c.line(3, 17, 3, b, C.woodDark);
      c.rect(6, b - 5, 11, b, hex('#3a3a44'));
      c.row(b - 5, 6, 11, hex('#55555f'));
      c.set(9, b - 3, u ? GREENL : hex('#24452e'));
    },
  });

  {
    const bag = (c, x0, x1, yb, open) => {
      c.rect(x0, yb - 5, x1, yb, BAGK);
      c.clear(x0, yb - 5);
      c.clear(x1, yb - 5);
      c.row(yb - 5, x0 + 1, x1 - 1, BAGL);
      c.oval(x0 + 1, yb - 7, x0 + 5, yb - 3, BAGK);
      c.row(yb - 7, x0 + 2, x0 + 4, BAGL);
      c.row(yb - 3, x0 + 6, x1 - 1, open ? DARK : hex('#6f7478'));
    };
    T('apocalypse-body-bags-row', 'row of body bags black bags laid out the dead tagged one unzipped and empty', {
      w: 18, h: 13, solid: true, base: 'side',
      sw: 38,
      s(c, u) {
        const b = c.h - 2;
        bag(c, 1, 17, b, false);
        if (u) {
          c.rect(19, b - 1, 36, b, BAGK);
          c.row(b - 2, 20, 35, BAGL);
          c.rect(22, b - 1, 33, b - 1, DARK);
          c.poly([[20, b - 2], [24, b - 6], [29, b - 4], [27, b - 2]], BAGL);
          dots(c, C.blood, [30, b, 34, b - 1]);
        } else bag(c, 19, 36, b, false);
        c.rect(14, b - 2, 16, b - 1, C.paper);
        c.rect(u ? 34 : 33, b - 2, u ? 35 : 35, b - 1, C.paper);
      },
      f(c, u) {
        const b = c.h - 2;
        for (const x of [1, 9]) {
          const flat = u && x === 9;
          c.rect(x, flat ? b - 1 : b - 6, x + 6, b, BAGK);
          if (!flat) {
            c.clear(x, b - 6);
            c.clear(x + 6, b - 6);
            c.row(b - 6, x + 1, x + 5, BAGL);
            c.col(x + 3, b - 5, b, hex('#6f7478'));
            c.rect(x + 4, b - 2, x + 5, b - 1, C.paper);
          } else {
            c.row(b - 2, x + 1, x + 5, BAGL);
            c.row(b - 1, x + 2, x + 4, DARK);
            c.set(x + 6, b, C.blood);
          }
        }
      },
    });
  }

  T('apocalypse-traffic-cones-tape', 'traffic cones with hazard tape cordon closed off area knocked over', {
    w: 30, h: 17, solid: false,
    f(c, u) {
      const b = c.h - 2,
        O = hex('#b05a2e');
      const cone = (x) => {
        c.poly([[x + 2, 2], [x + 3, 2], [x + 5, b - 1], [x, b - 1]], O);
        c.line(x + 2, 2, x, b - 1, L(O));
        c.row(6, x + 1, x + 4, C.white);
        c.row(10, x + 1, x + 4, C.white);
        c.rect(x - 1, b, x + 6, b, D(O));
      };
      cone(2);
      if (u) {
        /* the far cone kicked over, the tape trailing */
        c.poly([[20, b - 3], [20, b - 2], [27, b], [27, b - 5]], O);
        c.col(23, b - 4, b - 1, C.white);
        c.col(28, b - 6, b, D(O));
        for (let x = 5; x <= 16; x++) c.set(x, Math.min(b, 4 + Math.round((x - 5) * 1.0)), x % 4 < 2 ? HAZ : DARK);
        c.row(b, 14, 19, HAZ);
        dots(c, DARK, [15, b, 18, b]);
      } else {
        cone(22);
        for (let x = 5; x <= 24; x++) {
          const y = 4 + Math.round(2 * Math.sin(((x - 5) / 19) * Math.PI));
          c.set(x, y, x % 4 < 2 ? HAZ : DARK);
          c.set(x, y + 1, x % 4 < 2 ? D(HAZ) : DARK);
        }
      }
    },
    sw: 10,
    s(c, u) {
      const b = c.h - 2,
        O = hex('#b05a2e');
      c.poly([[4, 2], [5, 2], [7, b - 1], [2, b - 1]], O);
      c.line(4, 2, 2, b - 1, L(O));
      c.row(6, 3, 6, C.white);
      c.row(10, 3, 6, C.white);
      c.rect(1, b, 8, b, D(O));
      if (u) c.row(b, 6, 9, HAZ);
      else c.rect(4, 4, 5, 5, HAZ);
    },
  });
};
