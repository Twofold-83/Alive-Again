/* env-apocalypse, part 2: where the survivors camp. Part of tools/big/env2-ruin.js. */
module.exports = (X) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, T, setCat, dots, pat, flip, mir, panel, legs, sideBox, slab, txt, scribble, wheel, rim, ring } = X;
  const { bricks, planks, boards, hazard, rust, soot, tins, tin, bottle, litter, flame, fire, smoke, pool, drum, crate, sandbags, skull, trefoil, gasmask } = X;
  const { tyreFlat, mesh, coil, grass, pane, drip } = X;
  const { TYRE, DARK, CONC, CONCD, GLASSD, LAMP, AMBER, REDL, GREENL, WATER, WATERL, SMOKE, RUST, RUSTD, SOOT, OLIVE, OLIVED, KHAKI, CANVAS, TARP, HAZ, TOXIC, SAND, WARM } = X;
  setCat('env-apocalypse', 'Apocalypse');

  const WEED = hex('#5a6a3a'),
    TICK = hex('#9a927c'),
    BLANKET = hex('#5f6654'),
    PVC = hex('#a9aa9e'),
    CHAIR = hex('#6a3a3e'),
    GENRED = hex('#8a3a2e'),
    BARREL = hex('#3d5a78'),
    LOCK = hex('#5c6456'),
    CHUTE = hex('#b5ab98'),
    CHUTEO = hex('#a05a34'),
    ENAMEL = hex('#c2beb0'),
    LITCAN = hex('#c9a04a');
  const photo = (c, x, y, w = 3, h = 4, face = C.flesh) => {
    c.rect(x, y, x + w - 1, y + h - 1, C.white);
    c.rect(x + 1, y + 1, x + w - 2, y + h - 2, hex('#6a6a70'));
    c.set(x + 1, y + 1, face);
  };
  const candle = (c, x, yb, h, lit) => {
    c.col(x, yb - h + 1, yb, C.bone);
    if (lit) {
      c.set(x, yb - h, C.flameLight);
      c.set(x, yb - h - 1, C.flame);
    } else c.set(x, yb - h, DARK);
  };

  /* ---------- shelter ---------- */
  T('apocalypse-tent-patched', 'survivor tent patched canvas ridge tent camp shelter lantern inside', {
    w: 36, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, b], [17, 3], [18, 3], [33, b]], CANVAS);
      c.line(2, b, 17, 3, L(CANVAS));
      c.line(33, b, 18, 3, D(CANVAS));
      c.poly([[22, 12], [26, 12], [28, 17], [23, 17]], TARP);
      c.poly([[7, 18], [11, 18], [10, 22], [5, 22]], KHAKI);
      dots(c, DARK, [22, 12, 28, 17, 7, 18, 10, 22]);
      c.rect(17, 1, 18, 3, C.wood);
      if (u) {
        c.poly([[11, b], [17, 8], [18, 8], [24, b]], DARK);
        c.poly([[11, b], [17, 8], [14, 10], [9, 20]], D(CANVAS));
        c.poly([[24, b], [18, 8], [21, 10], [26, 20]], mix(CANVAS, 0.6));
        c.rect(15, b - 2, 22, b, BLANKET);
        c.row(b - 2, 15, 22, L(BLANKET));
        c.rect(17, b - 7, 18, b - 4, LITCAN);
        c.set(17, b - 8, C.iron);
        dots(c, mix(WARM, 0.7), [16, b - 6, 19, b - 5, 17, b - 3, 18, b - 9]);
      } else {
        c.col(17, 6, b, D(CANVAS));
        c.col(18, 6, b, mix(CANVAS, 0.5));
        for (const y of [10, 15, 20]) dots(c, C.bone, [17, y]);
      }
      c.line(1, b, 0, b, C.wood);
      dots(c, C.wood, [1, b, 34, b]);
      grass(c, 2, 9, b, 3, WEED, 2);
    },
    sw: 34,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, b], [6, 3], [27, 3], [31, b]], CANVAS);
      c.row(3, 6, 27, L(CANVAS));
      c.line(2, b, 6, 3, L(CANVAS));
      c.row(4, 6, 27, D(CANVAS));
      for (const x of [12, 21]) c.line(x, 5, x - 1, b, mix(CANVAS, 0.88));
      c.rect(14, 9, 19, 14, TARP);
      c.rect(23, 16, 27, 20, KHAKI);
      dots(c, DARK, [14, 9, 19, 14, 23, 16, 27, 20, 19, 9, 14, 14]);
      c.rect(5, 1, 6, 3, C.wood);
      c.rect(27, 1, 28, 3, C.wood);
      c.row(b, 3, 30, D(CANVAS));
      if (u) {
        /* lit from inside: a shape sitting up */
        for (let y = 7; y <= b - 1; y++)
          for (let x = 5; x <= 28; x++) {
            const d = Math.hypot((x - 13) / 10, (y - 17) / 10);
            if (c.get(x, y) && d < 1) c.set(x, y, blend(CANVAS, WARM, d < 0.6 ? 0.6 : 0.3));
          }
        c.rect(11, 15, 14, b - 1, mix(CANVAS, 0.6));
        c.rect(11, 11, 13, 14, mix(CANVAS, 0.6));
        c.row(b - 1, 11, 20, mix(CANVAS, 0.6));
        c.row(b - 2, 15, 19, mix(CANVAS, 0.6));
      }
      dots(c, C.wood, [1, b, 32, b]);
      grass(c, 24, 31, b, 3, WEED, 2);
    },
  });

  T('apocalypse-decon-tent', 'decontamination tent white plastic medical field tent strip curtain biohazard', {
    w: 38, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 8], [18, 3], [19, 3], [35, 8]], PVC);
      c.line(2, 8, 18, 3, L(PVC));
      c.rect(2, 8, 35, b, PVC);
      c.col(2, 8, b, L(PVC));
      c.row(8, 2, 35, D(PVC));
      for (const x of [2, 35]) c.col(x, 8, b, C.steel);
      hazard(c, 2, b - 1, 35, b, HAZ, DARK, 2);
      /* the strip curtain */
      c.rect(12, 11, 25, b, hex('#7f8e88'));
      c.frame(11, 10, 26, b, C.steel);
      for (let x = 13; x <= 25; x += 3) c.col(x, 11, b, hex('#5f6e6a'));
      c.rect(29, 11, 33, 15, C.white);
      trefoil(c, 29, 11, hex('#8a2a26'));
      c.rect(4, 12, 8, 14, hex('#8a2a26'));
      c.rect(5, 11, 7, 15, hex('#8a2a26'));
      c.rect(6, 11, 6, 15, C.white);
      c.rect(4, 13, 8, 13, C.white);
      c.speckle(2, 3, 35, b - 2, mix(PVC, 0.85), 9, 3);
      if (u) {
        c.rect(15, 11, 22, b, DARK);
        c.col(14, 11, b, hex('#9aa8a2'));
        c.col(23, 11, b, hex('#9aa8a2'));
        c.rect(16, 11, 21, 12, hex('#6e7a5a'));
        c.rect(17, b - 6, 20, b - 5, C.steel);
        c.rect(17, b - 8, 20, b - 7, C.white);
        c.col(17, b - 4, b, C.iron);
        c.col(20, b - 4, b, C.iron);
        /* a hand print on the plastic */
        pat(c, 24, 17, ['r.r', 'rrr', 'rrr', '.r.'], C.blood);
        drip(c, 25, 21, 3, C.blood);
      } else {
        /* a shape behind the plastic */
        c.rect(18, 15, 20, 17, hex('#5f6e6a'));
        c.rect(17, 18, 21, 26, hex('#5f6e6a'));
        c.col(19, 11, b, hex('#7f8e88'));
      }
    },
    sw: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 25, 7, PVC);
      c.row(3, 2, 25, L(PVC));
      c.rect(2, 8, 25, b, mix(PVC, 0.92));
      c.row(8, 2, 25, D(PVC));
      for (const x of [2, 13, 25]) c.col(x, 8, b, C.steel);
      hazard(c, 2, b - 1, 25, b, HAZ, DARK, 2);
      c.rect(5, 12, 10, 18, u ? hex('#8f9a70') : hex('#7f8e88'));
      c.frame(4, 11, 11, 19, D(PVC));
      if (u) {
        c.rect(7, 13, 8, 14, DARK);
        c.rect(6, 15, 9, 18, DARK);
      }
      c.speckle(2, 3, 25, b - 2, mix(PVC, 0.85), 9, 3);
      /* the air duct and its blower */
      c.rect(16, 16, 23, 19, hex('#b59a32'));
      for (let x = 17; x <= 23; x += 2) c.col(x, 16, 19, D(HAZ));
      c.rect(17, 20, 24, b, C.iron);
      c.row(20, 17, 24, C.steel);
      c.rect(19, 22, 22, 25, DARK);
      c.set(23, 21, u ? GREENL : hex('#24452e'));
    },
  });

  /* ---------- beds ---------- */
  T('apocalypse-pallet-bed', 'makeshift bed on pallets stained mattress army blanket survivor sleeping place', {
    w: 18, h: 26, solid: true, base: 'side',
    sw: 38, sh: 16,
    s(c, u) {
      const b = c.h - 2;
      /* two pallets */
      for (const x of [1, 19]) {
        c.rect(x, b - 4, x + 17, b - 4, C.woodPale);
        c.rect(x, b, x + 17, b, C.woodLight);
        for (const i of [0, 8, 16]) c.rect(x + i, b - 3, x + i + 1, b - 1, C.wood);
      }
      c.rect(2, b - 8, 35, b - 5, TICK);
      c.row(b - 8, 2, 35, L(TICK));
      for (let x = 4; x < 35; x += 3) c.col(x, b - 7, b - 5, mix(TICK, 0.85));
      /* a folded coat for a pillow */
      c.rect(3, b - 10, 9, b - 8, hex('#4a4a40'));
      c.row(b - 10, 3, 9, hex('#5e5e52'));
      if (u) {
        c.poly([[24, b - 8], [26, b - 12], [33, b - 12], [35, b - 8], [35, b - 5], [24, b - 5]], BLANKET);
        c.line(26, b - 12, 33, b - 12, L(BLANKET));
        c.col(29, b - 11, b - 6, D(BLANKET));
        c.oval(13, b - 8, 19, b - 6, hex('#7a6a50'));
        dots(c, C.blood, [16, b - 7]);
      } else {
        c.rect(11, b - 9, 35, b - 5, BLANKET);
        c.row(b - 9, 11, 35, L(BLANKET));
        c.col(11, b - 9, b - 5, D(BLANKET));
        c.line(18, b - 8, 20, b - 5, D(BLANKET));
        c.row(b - 6, 22, 35, hex('#7d3b32'));
      }
    },
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 3, 16, b - 3, C.woodPale);
      c.rect(1, b, 16, b, C.woodLight);
      for (const i of [1, 8, 15]) c.rect(i, b - 2, i + (i === 8 ? 1 : 0), b - 1, C.wood);
      c.rect(2, 3, 15, b - 4, TICK);
      c.row(3, 2, 15, L(TICK));
      for (let x = 4; x < 15; x += 3) c.col(x, 4, b - 4, mix(TICK, 0.85));
      c.rect(4, 4, 13, 7, hex('#4a4a40'));
      c.row(4, 4, 13, hex('#5e5e52'));
      const y0 = u ? 15 : 9;
      c.rect(2, y0, 15, b - 4, BLANKET);
      c.row(y0, 2, 15, L(BLANKET));
      c.row(b - 6, 2, 15, hex('#7d3b32'));
      c.row(b - 4, 2, 15, D(BLANKET));
      if (u) {
        c.rect(2, y0, 15, y0 + 2, L(BLANKET));
        c.row(y0 + 3, 2, 15, D(BLANKET));
        c.oval(6, 10, 11, 13, hex('#7a6a50'));
        c.set(8, 11, C.blood);
      } else c.line(6, 12, 8, 18, D(BLANKET));
    },
  });

  T('apocalypse-bunk-beds-shelter', 'steel bunk beds bunker shelter army cots two tier olive blankets', {
    w: 18, h: 36, solid: true, base: 'side',
    sw: 38,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [2, 34]) {
        c.rect(x, 2, x + 1, b, C.iron);
        c.col(x, 2, b, C.steel);
      }
      for (const [y, low] of [[10, 0], [24, 1]]) {
        c.rect(3, y + 3, 34, y + 4, C.ironDark);
        c.rect(4, y, 33, y + 2, TICK);
        c.row(y, 4, 33, L(TICK));
        c.rect(5, y - 2, 10, y - 1, C.bone);
        if (u && low) {
          c.poly([[25, y], [27, y - 4], [32, y - 4], [33, y], [33, y + 2], [25, y + 2]], BLANKET);
          c.row(y - 4, 27, 32, L(BLANKET));
          c.row(y + 1, 12, 20, mix(TICK, 0.85));
        } else {
          c.rect(12, y - 1, 33, y + 2, BLANKET);
          c.row(y - 1, 12, 33, L(BLANKET));
          c.row(y + 1, 14, 33, OLIVED);
        }
      }
      c.rect(3, 4, 34, 4, C.iron);
      /* ladder */
      for (const x of [27, 31]) c.col(x, 14, b, C.steel);
      for (let y = 16; y < b; y += 4) c.row(y, 27, 31, C.steel);
      /* kit under the bunk */
      c.rect(6, b - 4, 14, b, OLIVE);
      c.row(b - 4, 6, 14, L(OLIVE));
      c.col(10, b - 3, b, OLIVED);
      if (u) {
        c.rect(16, b - 1, 20, b, hex('#2e2a2a'));
        c.rect(22, b - 1, 25, b, hex('#2e2a2a'));
      } else {
        c.rect(16, b - 3, 18, b, hex('#2e2a2a'));
        c.rect(20, b - 3, 22, b, hex('#2e2a2a'));
        c.row(b, 16, 23, hex('#2e2a2a'));
      }
      rust(c, 2, 2, 35, b, 30, 2);
    },
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 14]) {
        c.rect(x, 2, x + 1, b, C.iron);
        c.col(x, 2, b, C.steel);
      }
      c.row(4, 3, 14, C.iron);
      for (const [y, low] of [[10, 0], [24, 1]]) {
        c.rect(3, y + 3, 14, y + 4, C.ironDark);
        c.rect(4, y, 13, y + 2, TICK);
        if (u && low) {
          c.rect(4, y - 3, 13, y - 1, BLANKET);
          c.row(y - 3, 4, 13, L(BLANKET));
          c.row(y, 4, 13, L(TICK));
        } else {
          c.rect(4, y - 1, 13, y + 2, BLANKET);
          c.row(y - 1, 4, 13, L(BLANKET));
          c.row(y + 1, 4, 13, OLIVED);
        }
        c.row(y + 5, 4, 13, C.iron);
      }
      c.rect(5, b - 4, 12, b, OLIVE);
      c.row(b - 4, 5, 12, L(OLIVE));
      c.rect(8, b - 3, 9, b - 2, OLIVED);
      for (let y = 16; y < 22; y += 3) c.row(y, 4, 13, C.steel);
    },
  });

  /* ---------- the dead and the things they left ---------- */
  T('apocalypse-skeleton-armchair', 'skeleton sitting in an armchair dead survivor bones bottle last seat', {
    w: 22, h: 28, solid: true, um: [0, 0, 6],
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 3, 17, 16, CHAIR);
      c.row(3, 5, 16, L(CHAIR));
      c.clear(4, 3);
      c.clear(17, 3);
      for (let y = 6; y < 15; y += 4) for (let x = 6; x < 17; x += 4) c.set(x + ((y / 4) & 1) * 2, y, D(CHAIR));
      c.rect(1, 13, 4, 23, CHAIR);
      c.rect(17, 13, 20, 23, CHAIR);
      c.row(13, 1, 4, L(CHAIR));
      c.row(13, 17, 20, L(CHAIR));
      c.rect(5, 17, 16, 20, mix(CHAIR, 0.86));
      c.rect(2, 21, 19, 24, mix(CHAIR, 0.8));
      c.rect(3, 25, 4, b, C.woodDark);
      c.rect(17, 25, 18, b, C.woodDark);
      c.speckle(1, 3, 20, 24, hex('#4a2a2e'), 9, 4);
      /* the sitter: ribs, arms, legs */
      const B = C.bone,
        Bd = D(C.bone);
      for (const y of [11, 13, 15]) c.row(y, 8, 13, B);
      c.col(10, 10, 16, Bd);
      c.col(11, 10, 16, B);
      c.row(17, 7, 14, B);
      c.line(7, 11, 3, 14, B);
      c.line(14, 11, 18, 14, B);
      c.rect(2, 12, 3, 12, B);
      c.rect(18, 12, 19, 12, B);
      for (const x of [7, 13]) {
        c.rect(x, 18, x + 1, 19, B);
        c.col(x, 20, b - 1, B);
        c.col(x + 1, 20, b - 1, Bd);
        c.row(b, x - 1, x + 1, B);
      }
      c.rect(16, 10, 17, 12, hex('#3f5f48'));
      c.set(16, 9, hex('#3f5f48'));
      if (u) {
        /* the skull has rolled off */
        skull(c, 21, b - 4);
        dots(c, Bd, [10, 9, 11, 9]);
        c.rect(16, 9, 17, 12, CHAIR);
        c.rect(22, b - 7, 23, b - 6, hex('#3f5f48'));
        c.row(b - 5, 22, 25, hex('#3f5f48'));
      } else {
        skull(c, 8, 5);
        dots(c, Bd, [10, 10, 11, 10]);
      }
    },
    sw: 20,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 6, 23, CHAIR);
      c.col(2, 3, 23, L(CHAIR));
      c.rect(7, 17, 16, 23, mix(CHAIR, 0.86));
      c.rect(6, 13, 16, 16, CHAIR);
      c.row(13, 6, 16, L(CHAIR));
      c.rect(2, 21, 16, 24, mix(CHAIR, 0.8));
      c.rect(3, 25, 4, b, C.woodDark);
      c.rect(14, 25, 15, b, C.woodDark);
      c.speckle(2, 3, 16, 24, hex('#4a2a2e'), 9, 4);
      const B = C.bone,
        Bd = D(C.bone);
      c.col(8, 9, 12, B);
      for (const y of [9, 11]) c.row(y, 8, 11, B);
      c.row(12, 9, 15, Bd);
      c.row(17, 9, 16, B);
      c.col(16, 18, b - 1, B);
      c.row(b, 16, 18, B);
      c.rect(14, 10, 15, 12, hex('#3f5f48'));
      if (u) {
        skull(c, 13, b - 4);
        c.rect(14, 10, 15, 12, CHAIR);
        c.row(13, 6, 16, L(CHAIR));
      } else {
        pat(c, 7, 3, ['.bbb.', 'bbbbb', 'bbkbb', '.bbbd', '..bb.'], { b: B, k: DARK, d: Bd });
      }
    },
  });

  T('apocalypse-shrine-of-photos', 'shrine of photographs missing people wall board notes candles flowers memorial', {
    w: 30, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2,
        PLY = hex('#8a7450');
      c.rect(2, 2, 27, b - 5, PLY);
      c.row(2, 2, 27, L(PLY));
      c.col(2, 2, b - 5, L(PLY));
      c.speckle(2, 2, 27, b - 5, D(PLY), 11, 3);
      for (const x of [4, 24]) c.rect(x, b - 4, x + 1, b, C.wood);
      txt(c, 8, 4, 'LOST', hex('#8a2a26'));
      const r = rnd(7);
      const faces = [C.flesh, hex('#9a7458'), hex('#d8b494'), hex('#7a5a44')];
      for (let j = 0; j < 3; j++)
        for (let i = 0; i < 5; i++) {
          const x = 3 + i * 5 + ((r() * 2) | 0),
            y = 11 + j * 5 + ((r() * 2) | 0);
          if (r() < 0.2) {
            c.rect(x, y, x + 3, y + 3, C.paper);
            scribble(c, x, y + 1, x + 3, y + 3, C.slate, i + j);
          } else photo(c, x, y, 4, 4, faces[(r() * 4) | 0]);
        }
      dots(c, hex('#8a2a26'), [5, 10, 14, 10, 23, 15, 9, 20]);
      c.rect(20, 5, 21, 8, hex('#7a8a9a'));
      /* candles and dead flowers at its foot */
      c.rect(1, b - 1, 28, b, mix(PLY, 0.7));
      for (const [x, h] of [[7, 4], [10, 2], [13, 5], [17, 3], [21, 4]]) candle(c, x, b - 2, h, u);
      dots(c, hex('#6a4a5a'), [3, b - 3, 4, b - 4, 25, b - 3]);
      dots(c, WEED, [3, b - 2, 4, b - 2, 25, b - 2, 26, b - 3]);
      if (u) {
        dots(c, mix(WARM, 0.75), [6, b - 7, 14, b - 8, 18, b - 6, 22, b - 7, 12, b - 6, 9, b - 5]);
        photo(c, 22, 5, 4, 4, C.flesh);
        c.set(23, 4, hex('#8a2a26'));
      }
    },
    sw: 12,
    s(c, u) {
      const b = c.h - 2,
        PLY = hex('#8a7450');
      c.rect(3, 2, 4, b - 5, PLY);
      c.col(3, 2, b - 5, L(PLY));
      c.rect(3, b - 4, 4, b, C.wood);
      c.line(2, 12, 0, b, C.wood);
      for (const y of [11, 16, 21]) c.rect(5, y, 5, y + 3, C.white);
      c.rect(1, b - 1, 10, b, mix(PLY, 0.7));
      candle(c, 7, b - 2, 4, u);
      candle(c, 9, b - 2, 2, u);
      c.set(6, b - 2, WEED);
      if (u) dots(c, mix(WARM, 0.75), [8, b - 8, 6, b - 6]);
    },
  });

  /* ---------- power, water, fire ---------- */
  T('apocalypse-generator-petrol', 'petrol generator portable engine frame power fuel running cable', {
    w: 24, h: 18, solid: true, um: [0, 6, 0], sum: [0, 6, 0],
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 8, 19, b - 2, hex('#5a5d64'));
      for (let y = 9; y < b - 2; y += 2) c.row(y, 10, 18, hex('#3e4048'));
      c.rect(4, 8, 9, b - 2, hex('#6a6d74'));
      c.rect(5, 10, 6, 11, DARK);
      c.rect(8, 10, 8, 11, DARK);
      c.set(6, 13, u ? GREENL : hex('#24452e'));
      c.rect(5, 3, 18, 7, GENRED);
      c.row(3, 6, 17, L(GENRED));
      c.rect(10, 2, 12, 2, C.ironDark);
      rust(c, 5, 3, 18, 7, 12, 4);
      c.frame(2, 2, 21, b - 1, C.ironDark);
      c.col(2, 2, b - 1, C.iron);
      c.row(2, 2, 21, C.iron);
      c.rect(2, b, 4, b, TYRE);
      c.rect(19, b, 21, b, TYRE);
      c.rect(20, 9, 22, 10, C.iron);
      c.set(15, 11, C.bone);
      if (u) {
        smoke(c, 22, 8, 9, SMOKE, 3);
        c.line(5, 12, 1, b, hex('#a05a34'));
        c.row(b, 0, 1, hex('#a05a34'));
        dots(c, C.iron, [0, 5, 23, 5, 0, 12, 23, 13]);
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 8, 9, b - 2, hex('#5a5d64'));
      for (let y = 9; y < b - 2; y += 2) c.row(y, 5, 9, hex('#3e4048'));
      c.rect(4, 3, 9, 7, GENRED);
      c.row(3, 5, 8, L(GENRED));
      c.frame(2, 2, 11, b - 1, C.ironDark);
      c.col(2, 2, b - 1, C.iron);
      c.rect(2, b, 4, b, TYRE);
      c.rect(9, b, 11, b, TYRE);
      c.rect(6, 10, 7, 12, C.iron);
      c.set(7, 11, C.bone);
      if (u) {
        smoke(c, 6, 1, 7, SMOKE, 3);
        dots(c, C.iron, [0, 6, 13, 5, 13, 12]);
        c.row(b, 12, 13, hex('#a05a34'));
      }
    },
  });

  T('apocalypse-water-purifier-rig', 'water purifier filter rig barrel on a stand tube drip into bottle clean water', {
    w: 22, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2,
        TUBE = u ? WATERL : hex('#8a9a98');
      for (const x of [3, 17]) {
        c.rect(x, 14, x + 1, b, C.wood);
        c.col(x, 14, b, C.woodLight);
      }
      c.rect(2, 14, 19, 15, C.woodLight);
      c.rect(3, 25, 18, 25, C.wood);
      c.line(4, 24, 9, 16, C.woodDark);
      drum(c, 5, 13, 12, 11, BARREL);
      c.rect(7, 6, 14, 9, C.bone);
      c.row(7, 8, 12, hex('#3d5a6e'));
      c.rect(9, 1, 12, 2, D(BARREL));
      /* the filter pot and the tube */
      c.rect(8, 18, 13, 22, C.steel);
      c.row(18, 8, 13, L(C.steel));
      c.row(20, 8, 13, C.iron);
      c.col(10, 14, 17, TUBE);
      c.col(11, 23, 26, TUBE);
      c.rect(11, 16, 12, 16, C.brass);
      /* the bottle underneath */
      c.rect(8, b - 6, 14, b, hex('#6f8a80'));
      c.rect(10, b - 8, 12, b - 7, hex('#6f8a80'));
      c.col(8, b - 6, b, hex('#8fa8a0'));
      if (u) {
        c.rect(9, b - 5, 13, b - 1, WATER);
        c.row(b - 5, 9, 13, WATERL);
        c.set(11, b - 7, WATERL);
        c.set(15, b, WATER);
      } else {
        c.rect(9, b - 1, 13, b - 1, hex('#5a6a4a'));
        c.set(11, 22, hex('#5a6a4a'));
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2,
        TUBE = u ? WATERL : hex('#8a9a98');
      for (const x of [2, 10]) c.rect(x, 14, x + 1, b, C.wood);
      c.rect(1, 14, 12, 15, C.woodLight);
      c.row(25, 2, 11, C.wood);
      drum(c, 2, 13, 10, 11, BARREL);
      c.rect(8, 1, 10, 2, D(BARREL));
      c.rect(5, 18, 9, 22, C.steel);
      c.row(18, 5, 9, L(C.steel));
      c.col(7, 14, 17, TUBE);
      c.col(7, 23, 26, TUBE);
      c.rect(4, b - 6, 9, b, hex('#6f8a80'));
      c.rect(6, b - 8, 7, b - 7, hex('#6f8a80'));
      if (u) {
        c.rect(5, b - 5, 8, b - 1, WATER);
        c.row(b - 5, 5, 8, WATERL);
      } else c.row(b - 1, 5, 8, hex('#5a6a4a'));
    },
  });

  T('apocalypse-oil-drum-fire-camp', 'oil drum fire barrel burning scrap wood camp warmth punched holes', {
    w: 16, h: 22, solid: true, um: [0, 8, 0], same: true,
    f(c, u) {
      const b = c.h - 2,
        col = hex('#5a4a44');
      drum(c, 3, b, 10, 15, col, { open: true });
      rust(c, 3, b - 14, 12, b, 10, 3);
      soot(c, 3, b - 14, 12, b - 9, 5, 6);
      for (const [x, y] of [[5, b - 4], [8, b - 5], [10, b - 3], [6, b - 8], [9, b - 9]]) c.set(x, y, u ? C.flame : DARK);
      /* scrap wood sticking out */
      c.line(5, b - 14, 3, b - 18, C.wood);
      c.line(8, b - 14, 10, b - 19, C.woodDark);
      c.line(10, b - 14, 13, b - 16, C.wood);
      dots(c, C.ash, [2, b, 13, b, 14, b]);
      if (u) {
        fire(c, 4, 11, b - 15, 9, 4);
        dots(c, C.flameLight, [3, b - 24, 12, b - 22, 8, b - 27]);
        dots(c, C.flame, [5, b - 12, 9, b - 12]);
        c.row(b - 14, 4, 11, C.flame);
      } else {
        c.row(b - 14, 4, 11, SOOT);
        dots(c, C.ash, [6, b - 14, 9, b - 14]);
      }
    },
  });

  T('apocalypse-cooking-pot-tripod', 'cooking pot hanging from a tripod over a camp fire stew cauldron stones', {
    w: 22, h: 26, solid: true, um: [0, 2, 0], same: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(10, 2, 2, b, C.wood);
      c.line(11, 2, 19, b, C.woodDark);
      c.line(10, 3, 12, b - 6, C.woodDark);
      c.rect(9, 1, 12, 2, hex('#7a6a4a'));
      c.col(10, 4, 11, C.iron);
      /* the pot */
      c.rect(6, 13, 15, 17, C.ironDark);
      c.row(18, 7, 14, C.ironDark);
      c.row(12, 5, 16, C.iron);
      c.col(6, 13, 17, C.iron);
      c.line(6, 12, 10, 10, C.iron);
      c.line(15, 12, 11, 10, C.iron);
      /* stones and wood */
      for (const x of [4, 8, 13, 16]) c.rect(x, b - 1, x + 2, b, x % 3 ? CONCD : CONC);
      c.line(6, b - 2, 15, b - 3, C.woodDark);
      c.line(7, b - 3, 14, b - 2, C.wood);
      if (u) {
        fire(c, 7, 14, b - 2, 4, 3);
        c.row(12, 6, 15, hex('#7a5a34'));
        smoke(c, 9, 11, 8, hex('#9a9a94'), 3);
        smoke(c, 13, 11, 6, hex('#9a9a94'), 7);
      } else dots(c, C.ash, [9, b - 2, 12, b - 2, 10, b - 3]);
    },
  });

  T('apocalypse-rain-catcher-tarp', 'rain catcher tarpaulin on poles funnel into a barrel collecting water', {
    w: 32, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 27]) {
        c.rect(x, 3, x + 1, b, C.wood);
        c.col(x, 3, b, C.woodLight);
      }
      c.poly([[2, 4], [29, 4], [29, 6], [17, 13], [14, 13], [2, 6]], TARP);
      c.row(4, 2, 29, L(TARP));
      c.line(2, 6, 14, 13, D(TARP));
      c.line(29, 6, 17, 13, D(TARP));
      c.line(9, 5, 14, 11, mix(TARP, 0.88));
      dots(c, C.bone, [2, 4, 29, 4]);
      c.rect(15, 14, 16, 16, u ? WATERL : hex('#8a9a98'));
      drum(c, 10, b, 12, 13, BARREL, { open: true });
      c.row(b - 12, 11, 20, u ? WATERL : DARK);
      if (u) {
        c.row(b - 11, 11, 20, WATER);
        drip(c, 9, b - 11, 4, WATERL);
        dots(c, WATERL, [6, 9, 24, 10, 22, b - 14]);
        pool(c, 5, 9, b);
      } else {
        rust(c, 10, b - 12, 21, b, 20, 2);
        c.set(15, b - 12, hex('#5a6a4a'));
      }
      dots(c, WEED, [1, b, 30, b, 24, b]);
    },
    sw: 22,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [3, 17]) {
        c.rect(x, 3, x + 1, b, C.wood);
        c.col(x, 3, b, C.woodLight);
      }
      c.poly([[2, 4], [19, 4], [19, 6], [12, 13], [9, 13], [2, 6]], TARP);
      c.row(4, 2, 19, L(TARP));
      c.line(2, 6, 9, 13, D(TARP));
      c.rect(10, 14, 11, 16, u ? WATERL : hex('#8a9a98'));
      drum(c, 5, b, 12, 13, BARREL, { open: true });
      c.row(b - 12, 6, 15, u ? WATERL : DARK);
      if (u) {
        c.row(b - 11, 6, 15, WATER);
        drip(c, 17, b - 11, 4, WATERL);
      }
    },
  });

  T('apocalypse-bathtub-garden', 'old bathtub planted with vegetables survivor garden seedlings cabbages harvested', {
    w: 18, h: 20, solid: true, base: 'side',
    sw: 36,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 9], [33, 9], [32, b - 3], [29, b - 2], [6, b - 2], [3, b - 3]], ENAMEL);
      c.rect(1, 8, 34, 9, L(ENAMEL));
      c.row(9, 2, 33, D(ENAMEL));
      rust(c, 2, 10, 33, b - 2, 14, 5);
      for (const x of [9, 22]) drip(c, x, 10, 4, RUST);
      for (const x of [6, 28]) c.rect(x, b - 1, x + 1, b, C.iron);
      c.rect(3, 7, 32, 7, C.earth);
      c.row(7, 3, 32, hex('#6a4e3a'));
      if (u) {
        dots(c, D(C.earth), [7, 7, 13, 7, 14, 7, 20, 7, 26, 7]);
        dots(c, WEED, [10, 6, 24, 6, 30, 6]);
        c.col(17, 2, 6, C.woodLight);
        c.rect(23, b - 2, 27, b, CONCD);
      } else {
        /* cabbages, shoots, a staked tomato */
        for (const x of [5, 11]) {
          c.rect(x, 5, x + 3, 6, hex('#6a8a4a'));
          c.row(4, x + 1, x + 2, hex('#86a65a'));
        }
        c.col(17, 2, 6, C.woodLight);
        c.line(18, 6, 19, 3, WEED);
        dots(c, WEED, [16, 4, 19, 5, 18, 2]);
        dots(c, hex('#a8403a'), [19, 4, 16, 5]);
        for (let x = 22; x <= 31; x += 2) c.col(x, 5 - (x % 3 ? 0 : 1), 6, hex('#6a8a4a'));
      }
      /* a watering can */
      c.rect(u ? 1 : 0, b - 3, u ? 1 : 0, b - 3, C.steel);
      dots(c, WEED, [34, b, 1, b]);
    },
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 9], [15, 9], [14, b - 3], [12, b - 2], [5, b - 2], [3, b - 3]], ENAMEL);
      c.rect(1, 8, 16, 9, L(ENAMEL));
      c.row(9, 2, 15, D(ENAMEL));
      rust(c, 2, 10, 15, b - 2, 14, 5);
      drip(c, 8, 10, 4, RUST);
      c.rect(8, 11, 9, 12, C.steel);
      for (const x of [4, 12]) c.rect(x, b - 1, x + 1, b, C.iron);
      c.row(7, 3, 14, hex('#6a4e3a'));
      c.col(9, 2, 6, C.woodLight);
      if (u) dots(c, WEED, [5, 6, 12, 6]);
      else {
        c.rect(4, 5, 7, 6, hex('#6a8a4a'));
        c.row(4, 5, 6, hex('#86a65a'));
        dots(c, WEED, [10, 4, 8, 5, 10, 2]);
        dots(c, hex('#a8403a'), [10, 5, 8, 3]);
        for (const x of [12, 14]) c.col(x, 5, 6, hex('#6a8a4a'));
      }
    },
  });

  /* ---------- stores ---------- */
  T('apocalypse-supply-crates-stack', 'stack of supply crates aid boxes stencilled rations tins opened lid', {
    w: 28, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      crate(c, 1, 13, 13, b, C.woodLight);
      crate(c, 14, 13, 26, b, hex('#7a6a48'));
      txt(c, 3, 17, 'AID', hex('#4a3a2a'));
      trefoil(c, 18, 16, hex('#3a3830'));
      crate(c, 6, u ? 5 : 3, 20, 12, C.woodLight);
      if (u) {
        c.rect(7, 5, 19, 5, DARK);
        tins(c, 8, 18, 5, 4, 6);
        /* the lid leaning, a crowbar */
        c.line(21, 12, 25, 3, C.woodLight);
        c.line(22, 12, 26, 3, C.wood);
        c.line(1, 12, 5, 9, C.ironDark);
        tin(c, 2, 12, hex('#8f3b30'), 3, 2);
      } else {
        c.row(7, 7, 19, hex('#4a3a2a'));
        dots(c, C.ironDark, [7, 4, 19, 4, 7, 11, 19, 11]);
      }
      txt(c, 9, u ? 7 : 6, 'X9', hex('#4a3a2a'));
    },
    sw: 18,
    s(c, u) {
      const b = c.h - 2;
      crate(c, 2, 13, 15, b, mix(C.woodLight, 0.92));
      crate(c, 3, u ? 5 : 3, 14, 12, mix(C.woodLight, 0.92));
      if (u) {
        c.rect(4, 5, 13, 5, DARK);
        tins(c, 5, 12, 5, 4, 6);
        c.line(15, 12, 16, 3, C.woodLight);
      } else dots(c, C.ironDark, [4, 4, 13, 4]);
    },
  });

  T('apocalypse-airdrop-crate-parachute', 'air drop supply crate with parachute relief pallet straps opened', {
    w: 38, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      /* the parachute lying over and beside it */
      c.poly([[14, 6], [22, 3], [30, 7], [35, 14], [36, b], [20, b]], CHUTE);
      for (const [x0, x1] of [[24, 28], [31, 34]]) c.poly([[x0 - 4, 6], [x0, 5], [x1 + 1, b], [x0 + 1, b]], CHUTEO);
      c.line(14, 6, 22, 3, L(CHUTE));
      c.line(22, 12, 30, b, D(CHUTE));
      c.line(27, 9, 34, b - 2, mix(CHUTE, 0.85));
      /* crate on a pallet */
      crate(c, 2, 7, 19, b - 3, hex('#8a7a50'));
      c.rect(1, b - 2, 20, b - 2, C.woodPale);
      c.rect(1, b, 20, b, C.woodLight);
      for (const x of [2, 10, 18]) c.rect(x, b - 1, x + 1, b - 1, C.wood);
      txt(c, 5, 11, 'AID', hex('#3a3830'));
      if (u) {
        c.rect(3, 7, 18, 8, DARK);
        tins(c, 4, 17, 8, 3, 9);
        c.rect(5, 4, 9, 6, C.bone);
        c.row(5, 6, 8, hex('#8a2a26'));
        dots(c, OLIVE, [8, b - 3, 14, b - 3]);
        c.line(21, 9, 24, 4, hex('#8a7a50'));
      } else {
        c.col(7, 7, b - 3, OLIVE);
        c.col(14, 7, b - 3, OLIVE);
        c.line(8, 7, 16, 4, C.bone);
        c.line(14, 7, 18, 4, C.bone);
      }
    },
    sw: 24,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[10, 6], [15, 3], [19, 8], [21, b], [10, b]], CHUTE);
      c.poly([[14, 5], [16, 4], [20, b], [17, b]], CHUTEO);
      crate(c, 2, 7, 14, b - 3, mix(hex('#8a7a50'), 0.92));
      c.rect(1, b - 2, 15, b - 2, C.woodPale);
      c.rect(1, b, 15, b, C.woodLight);
      for (const x of [2, 13]) c.rect(x, b - 1, x + 1, b - 1, C.wood);
      if (u) {
        c.rect(3, 7, 13, 8, DARK);
        tins(c, 4, 12, 8, 3, 9);
      } else {
        c.col(8, 7, b - 3, OLIVE);
        c.line(8, 7, 12, 4, C.bone);
      }
    },
  });

  T('apocalypse-hazmat-barrels', 'hazmat barrels yellow toxic waste drums radioactive leaking green', {
    w: 26, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      drum(c, 13, b - 1, 10, 15, mix(HAZ, 0.85));
      rust(c, 13, b - 15, 22, b - 1, 14, 2);
      trefoil(c, 16, b - 11, DARK);
      drum(c, 2, b, 10, 15, HAZ, { open: u });
      rust(c, 2, b - 14, 11, b, 18, 6);
      trefoil(c, 5, b - 10, DARK);
      if (u) {
        c.row(b - 14, 3, 10, TOXIC);
        dots(c, L(TOXIC), [5, b - 14, 8, b - 14]);
        drip(c, 11, b - 13, 9, TOXIC);
        drip(c, 3, b - 13, 4, TOXIC);
        c.row(b, 9, 20, TOXIC);
        c.row(b, 12, 15, L(TOXIC));
        dots(c, TOXIC, [22, b, 24, b, 6, b - 17, 9, b - 19]);
        /* the lid on the ground */
        c.rect(17, b - 1, 24, b - 1, D(HAZ));
      } else {
        c.rect(1, b - 15, 12, b - 15, D(HAZ));
        c.set(21, b - 5, TOXIC);
        c.set(21, b - 4, TOXIC);
      }
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      drum(c, 2, b, 10, 15, HAZ, { open: u });
      rust(c, 2, b - 14, 11, b, 18, 6);
      trefoil(c, 5, b - 10, DARK);
      if (u) {
        c.row(b - 14, 3, 10, TOXIC);
        drip(c, 11, b - 13, 9, TOXIC);
        c.row(b, 10, 13, TOXIC);
        dots(c, TOXIC, [6, b - 17, 9, b - 19]);
      } else c.rect(1, b - 15, 12, b - 15, D(HAZ));
    },
  });

  T('apocalypse-radio-desk-shortwave', 'radio desk shortwave transmitter headphones antenna battery calling for help', {
    w: 30, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 16, 28, 17, C.woodLight);
      c.row(18, 2, 27, C.woodDark);
      legs(c, [2, 25], 18, b, C.wood);
      /* the set */
      c.rect(4, 6, 19, 15, OLIVE);
      c.row(6, 4, 19, L(OLIVE));
      c.col(4, 6, 15, L(OLIVE));
      c.rect(6, 8, 11, 11, u ? hex('#c9a04a') : hex('#2a2e24'));
      if (u) c.line(8, 11, 10, 8, DARK);
      else c.line(8, 11, 7, 8, hex('#55584f'));
      for (let y = 8; y <= 13; y += 2) c.row(y, 14, 18, OLIVED);
      c.set(7, 13, C.bone);
      c.set(10, 13, C.bone);
      c.set(12, 13, u ? REDL : hex('#5a2622'));
      c.col(17, 1, 5, C.iron);
      if (u) dots(c, AMBER, [15, 1, 19, 1, 14, 3, 20, 3]);
      /* headphones, key, notes */
      if (u) {
        c.rect(21, 14, 23, 15, DARK);
        c.rect(25, 14, 26, 15, DARK);
        c.row(13, 22, 25, C.iron);
        c.rect(21, 9, 26, 12, C.paper);
        scribble(c, 22, 10, 25, 12, C.slate, 2);
      } else {
        c.line(20, 7, 22, 5, C.iron);
        c.rect(21, 6, 22, 8, DARK);
        c.rect(22, 14, 26, 15, C.paper);
        c.row(13, 24, 25, C.brass);
      }
      /* the battery under the desk */
      c.rect(8, b - 5, 16, b, hex('#3a3a44'));
      c.row(b - 5, 8, 16, hex('#55555f'));
      dots(c, hex('#8a2a26'), [10, b - 6]);
      dots(c, C.steel, [14, b - 6]);
      c.line(10, b - 7, 6, 16, hex('#8a2a26'));
      c.line(14, b - 7, 12, 16, DARK);
    },
    sw: 16,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 16, 14, 17, C.woodLight);
      legs(c, [2, 11], 18, b, C.wood);
      sideBox(c, 3, 6, 11, 15, OLIVE);
      c.col(9, 1, 5, C.iron);
      if (u) {
        dots(c, AMBER, [7, 1, 11, 1]);
        c.col(12, 8, 11, hex('#c9a04a'));
        c.rect(12, 14, 13, 15, DARK);
      } else c.rect(12, 6, 13, 8, DARK);
      c.rect(4, b - 5, 10, b, hex('#3a3a44'));
      c.row(b - 5, 4, 10, hex('#55555f'));
      c.line(6, b - 7, 5, 16, hex('#8a2a26'));
    },
  });

  T('apocalypse-scavenger-workbench', 'scavenger workbench door on oil drums tools vice lamp tinkering parts', {
    w: 34, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      drum(c, 3, b, 8, 10, hex('#5a4a44'));
      drum(c, 23, b, 8, 10, hex('#4f5a70'));
      rust(c, 3, b - 9, 30, b, 9, 3);
      c.rect(1, b - 12, 32, b - 10, C.wood);
      c.row(b - 12, 1, 32, C.woodLight);
      panel(c, 5, b - 11, 14, b - 10, C.woodDark);
      /* vice, lamp, bits */
      c.rect(3, b - 16, 6, b - 13, C.iron);
      c.rect(2, b - 17, 7, b - 17, C.steel);
      c.row(b - 15, 7, 9, C.steel);
      c.col(28, b - 20, b - 13, C.ironDark);
      c.line(28, b - 20, 25, b - 21, C.ironDark);
      c.rect(23, b - 21, 25, b - 19, u ? LAMP : C.iron);
      if (u) dots(c, mix(WARM, 0.8), [22, b - 18, 24, b - 17, 26, b - 18, 24, b - 15]);
      c.rect(11, b - 15, 16, b - 13, hex('#3a3a44'));
      dots(c, u ? GREENL : C.bone, [12, b - 14]);
      c.row(b - 16, 12, 15, C.steel);
      tin(c, 19, b - 13, hex('#8f3b30'), 3, 2);
      /* the tool box below */
      c.rect(13, b - 4, 21, b, GENRED);
      c.row(b - 4, 13, 21, L(GENRED));
      if (u) {
        c.rect(13, b - 6, 21, b - 5, DARK);
        dots(c, C.steel, [15, b - 6, 17, b - 7, 19, b - 6]);
        c.rect(17, b - 14, 21, b - 14, C.steel);
        c.rect(15, b - 13, 16, b - 13, hex('#a05a34'));
      } else c.row(b - 5, 16, 18, C.iron);
    },
    sw: 14,
    s(c, u) {
      const b = c.h - 2;
      drum(c, 3, b, 8, 10, hex('#5a4a44'));
      rust(c, 3, b - 9, 10, b, 9, 3);
      c.rect(1, b - 12, 12, b - 10, C.wood);
      c.row(b - 12, 1, 12, C.woodLight);
      c.rect(4, b - 16, 6, b - 13, C.iron);
      c.col(9, b - 20, b - 13, C.ironDark);
      c.rect(8, b - 21, 10, b - 19, u ? LAMP : C.iron);
      if (u) dots(c, mix(WARM, 0.8), [7, b - 18, 11, b - 18, 9, b - 16]);
    },
  });

  T('apocalypse-armoury-locker', 'armoury locker steel gun cabinet rifles ammunition padlocked survivor weapons', {
    w: 22, h: 38, solid: true, um: [5, 0, 5],
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 19, b, LOCK);
      c.row(2, 2, 19, L(LOCK));
      c.col(2, 2, b, L(LOCK));
      c.rect(2, b - 1, 19, b, D(LOCK));
      if (u) {
        c.rect(3, 4, 18, b - 2, DARK);
        c.row(12, 3, 18, C.iron);
        c.row(b - 8, 3, 18, C.iron);
        /* rifles in the rack */
        for (const x of [5, 9, 13]) {
          c.col(x, 14, b - 9, C.ironDark);
          c.col(x + 1, 20, b - 9, C.wood);
          c.set(x, 13, C.iron);
        }
        c.col(17, 14, b - 9, hex('#2a2428'));
        c.rect(4, 8, 9, 11, OLIVE);
        c.row(8, 4, 9, L(OLIVE));
        pat(c, 11, 7, ['.ooooo.', 'ooooooo', 'ooooooo', 'ddddddddd'].map((r) => r.padEnd(9, '.')), { o: OLIVE, d: OLIVED });
        tins(c, 4, 17, b - 2, 4, 3, 0.8, [C.brass, OLIVE, hex('#7a6a48')]);
        for (const [x0, x1] of [[-3, 1], [20, 24]]) {
          c.rect(x0, 3, x1, b - 1, mix(LOCK, 0.82));
          c.frame(x0, 3, x1, b - 1, D(LOCK));
        }
        c.rect(-1, b, 0, b, C.brass);
      } else {
        c.col(10, 3, b - 2, D(LOCK));
        c.col(11, 3, b - 2, L(LOCK));
        for (const x of [4, 13]) for (let y = 5; y <= 9; y += 2) c.row(y, x, x + 4, D(LOCK));
        c.rect(9, 18, 12, 19, C.iron);
        c.rect(10, 20, 11, 22, C.brass);
        rust(c, 2, 2, 19, b, 30, 4);
        trefoil(c, 13, 13, hex('#3a3e34'));
        txt(c, 4, 26, 'ARMS', hex('#2e3228'), { sp: 0 });
        c.line(14, 30, 17, 33, D(LOCK));
      }
    },
    sw: 12, sum: [0, 0, 8],
    s(c, u) {
      const b = c.h - 2;
      sideBox(c, 2, 2, 9, b, LOCK);
      c.rect(2, b - 1, 9, b, D(LOCK));
      rust(c, 2, 2, 9, b, 30, 4);
      if (u) {
        c.rect(10, 3, 17, b - 1, mix(LOCK, 0.82));
        c.frame(10, 3, 17, b - 1, D(LOCK));
        c.col(10, 3, b - 1, DARK);
        for (let y = 5; y <= 9; y += 2) c.row(y, 12, 15, D(LOCK));
      } else c.rect(10, 18, 10, 22, C.brass);
    },
  });
};
