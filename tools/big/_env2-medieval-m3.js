/* Medieval, part 3: workshop, bedchamber and dungeon. Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix } = kit;
  const { D, L, dots, board, face, panel, hollow, fire, wisp, planksV, planksH, stones, wheel, wheelEdge, chain, rope, candle, post, straps, bottle } = H;
  const add = H.reg('env-medieval', 'Medieval');
  const { OAK, DOAK, PINE, CANVAS, HEMP, HIDE, RED, BLUE, GREEN, SOOT, LEATHER, PEWTER, MSTONE, WAT } = H.MED;
  const IRON = C.iron,
    STEEL = C.steel,
    GOLD = C.gold,
    FALC = hex('#6a543a'),
    SHEET = hex('#c4bca4');

  add('medieval-loom-warp-weighted', 'loom upright warp weighted weaving cloth stones wool weaver frame', {
    w: 28, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2,
        yc = u ? 19 : 10;
      post(c, 2, 3, 2, b, OAK);
      post(c, 23, 24, 2, b, OAK);
      board(c, 1, 3, 25, 5, PINE); // the cloth beam
      c.set(1, 4, DOAK);
      c.set(25, 4, DOAK);
      for (let x = 5; x <= 21; x++) c.col(x, 6, 28, x % 2 ? CANVAS : D(CANVAS));
      c.rect(5, 6, 21, yc, GREEN); // what is woven
      for (let y = 8; y <= yc; y += 4) c.row(y, 5, 21, C.mustard);
      c.row(yc, 5, 21, L(GREEN));
      c.col(5, 6, yc, L(GREEN));
      board(c, 2, yc + 6, 24, yc + 7, PINE); // the heddle rod
      c.rect(8, yc + 2, 13, yc + 2, DOAK); // shuttle
      c.set(14, yc + 2, C.mustard);
      for (let x = 5; x <= 21; x += 4) {
        c.rect(x, 29, x + 1, 31, MSTONE); // loom weights
        c.set(x, 29, L(MSTONE));
      }
      c.row(b - 2, 4, 22, DOAK);
      if (u) {
        c.rect(8, b - 1, 12, b, GREEN); // a ball of wool rolled away
        c.set(9, b - 1, L(GREEN));
        c.row(b, 13, 17, GREEN);
      }
    },
    sw: 12, sh: 38,
    s(c, u) {
      const b = c.h - 2,
        yc = u ? 19 : 10;
      c.line(3, b, 6, 2, OAK);
      c.line(4, b, 7, 2, DOAK);
      c.line(9, b, 7, 14, DOAK);
      c.rect(6, 3, 8, 5, PINE);
      c.col(8, 6, 28, CANVAS);
      c.col(8, 6, yc, GREEN);
      c.rect(7, yc + 6, 10, yc + 7, PINE);
      c.rect(8, 29, 9, 31, MSTONE);
      c.row(b, 2, 10, DOAK);
      if (u) c.set(1, b, GREEN);
    },
  });
  add('medieval-apothecary-cart', 'large apothecary cart pedlar medicine bottles drawers herbs quack two wheels', {
    w: 42, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      face(c, 5, 8, 30, 20, OAK);
      c.rect(3, 5, 32, 7, DOAK); // the roof board
      c.row(5, 3, 32, L(DOAK));
      c.row(4, 6, 29, DOAK);
      if (!u) {
        face(c, 6, 9, 17, 19, PINE); // shutters
        face(c, 18, 9, 29, 19, PINE);
        planksV(c, 6, 10, 29, 19, D(PINE), 4);
        for (const y of [11, 17]) {
          c.row(y, 6, 10, IRON);
          c.row(y, 25, 29, IRON);
        }
        c.rect(16, 13, 19, 15, IRON);
        c.set(17, 14, GOLD);
        c.oval(11, 12, 14, 15, GREEN); // a painted serpent
        c.set(12, 13, PINE);
        c.set(13, 14, PINE);
      } else {
        hollow(c, 6, 9, 29, 14, OAK);
        c.row(14, 6, 29, PINE);
        const cols = [C.glass, C.wine, C.moss, C.mustard, C.glassLight, C.plum, C.glass, C.rot];
        cols.forEach((col, i) => bottle(c, 7 + i * 3, 13, i % 3 === 1 ? 5 : 4, col, 2));
        for (let i = 0; i < 4; i++) {
          face(c, 6 + i * 6, 15, 11 + i * 6, 19, PINE); // little drawers
          c.set(8 + i * 6, 17, IRON);
          c.set(9 + i * 6, 17, IRON);
        }
        c.rect(12, 20, 18, 22, PINE); // one pulled out
        c.row(20, 12, 18, SOOT);
        c.set(15, 21, IRON);
        dots(c, C.leafLight, [13, 20, 16, 20]);
        c.rect(1, 9, 4, 19, PINE); // the shutters folded back
        c.col(1, 9, 19, L(PINE));
        c.rect(31, 9, 33, 19, D(PINE));
      }
      c.col(34, 8, 9, HEMP); // herbs hung to dry
      c.rect(33, 10, 35, 13, C.moss);
      dots(c, C.leafLight, [33, 11, 35, 12, 34, 14]);
      c.rect(6, 21, 29, 22, DOAK);
      c.line(30, 21, 40, b, OAK);
      c.line(30, 22, 39, b, DOAK);
      c.col(27, 23, b, DOAK);
      wheel(c, 13, b - 5, 5, PINE);
    },
    sw: 24, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, 4, b - 10, b, PINE);
      wheelEdge(c, 19, 21, b - 10, b, PINE);
      c.row(b - 5, 5, 18, DOAK);
      face(c, 5, 8, 18, 20, OAK);
      panel(c, 7, 10, 16, 18, OAK);
      c.poly([[3, 7], [11, 3], [12, 3], [20, 7]], DOAK);
      c.line(3, 7, 11, 3, L(DOAK));
      c.rect(6, 21, 17, 22, DOAK);
      c.col(11, 8, 9, HEMP);
      c.rect(10, 10, 12, 13, C.moss);
      dots(c, C.leafLight, [10, 11, 12, 12, 11, 14]);
      if (u) {
        c.rect(1, 9, 4, 19, PINE);
        c.col(1, 9, 19, L(PINE));
        planksV(c, 1, 9, 4, 19, D(PINE), 3);
        c.rect(1, 20, 4, 22, PINE);
        c.row(20, 1, 4, SOOT);
        bottle(c, 2, 8, 4, C.wine, 2);
      } else c.col(5, 9, 19, PINE);
    },
  });
  add('medieval-falcon-perch', 'falcon perch hawk hooded bird of prey falconry mews block leash', {
    w: 14, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 12, 7, b - 1, OAK);
      c.col(6, 12, b - 1, L(OAK));
      board(c, 3, b - 1, 10, b, DOAK);
      c.rect(2, 11, 11, 12, LEATHER); // the padded bar
      c.row(11, 2, 11, L(LEATHER));
      c.set(1, 11, DOAK);
      c.set(12, 11, DOAK);
      if (!u) {
        c.rect(4, 5, 9, 10, FALC); // the falcon, hooded
        c.rect(5, 4, 8, 4, FALC);
        c.rect(5, 6, 8, 10, C.bone);
        dots(c, FALC, [5, 7, 7, 7, 6, 8, 8, 8, 5, 9, 7, 9, 6, 10, 8, 10]);
        c.col(4, 5, 10, L(FALC));
        c.rect(5, 1, 8, 4, RED);
        c.row(1, 5, 8, L(RED));
        c.set(6, 0, GOLD);
        c.set(7, 0, GOLD);
        c.rect(6, 4, 7, 4, C.mustard);
        c.set(6, 5, C.mustard);
        dots(c, C.mustard, [5, 11, 8, 11]);
        c.line(8, 12, 9, 17, LEATHER); // jesses
        c.set(9, 18, IRON);
      } else {
        c.col(4, 12, 16, RED); // the hood left hanging, the leash bitten through
        c.rect(3, 15, 5, 17, RED);
        c.set(4, 18, GOLD);
        c.col(9, 13, 15, LEATHER);
        dots(c, C.white, [7, 13, 6, 16, 8, b]);
        c.line(10, b - 4, 12, b - 1, FALC); // a feather
        c.set(11, b - 3, C.bone);
        dots(c, C.blood, [3, 11, 4, 11]);
      }
    },
    sw: 12, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 12, 6, b - 1, OAK);
      c.col(5, 12, b - 1, L(OAK));
      board(c, 2, b - 1, 9, b, DOAK);
      c.rect(4, 11, 7, 12, LEATHER);
      c.row(11, 4, 7, L(LEATHER));
      if (!u) {
        c.poly([[4, 5], [8, 5], [9, 9], [5, 10], [3, 15], [2, 14]], FALC);
        c.line(4, 5, 2, 14, L(FALC));
        c.rect(7, 6, 9, 9, C.bone);
        dots(c, FALC, [8, 7, 7, 8, 9, 9]);
        c.rect(5, 1, 8, 4, RED);
        c.row(1, 5, 8, L(RED));
        c.set(9, 4, C.mustard);
        c.set(9, 5, C.mustard);
        c.set(6, 0, GOLD);
        c.set(7, 11, C.mustard);
        c.line(6, 12, 7, 17, LEATHER);
      } else {
        c.col(7, 12, 16, RED);
        c.rect(7, 15, 8, 17, RED);
        c.col(4, 13, 15, LEATHER);
        dots(c, C.white, [5, 14, 6, b]);
        c.line(8, b - 4, 10, b - 1, FALC);
      }
    },
  });
  add('medieval-straw-bed-pallet', 'straw bed pallet poor wooden box frame rough blanket sack pillow servant', {
    w: 36, h: 14, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 33, 7, C.straw);
      dots(c, D(C.straw), [5, 6, 9, 5, 14, 6, 19, 5, 24, 6, 29, 5, 32, 6]);
      dots(c, L(C.straw), [7, 5, 12, 5, 22, 5, 27, 5]);
      board(c, 1, 7, 34, b - 1, OAK);
      planksV(c, 1, 8, 34, b - 1, D(OAK), 9);
      c.rect(2, b, 4, b, DOAK);
      c.rect(31, b, 33, b, DOAK);
      c.col(1, 4, 7, OAK);
      c.col(34, 5, 7, OAK);
      c.rect(3, 3, 9, 5, CANVAS); // a sack for a pillow
      c.row(3, 4, 8, L(CANVAS));
      c.set(9, 4, D(CANVAS));
      if (!u) {
        c.rect(11, 4, 33, 6, HIDE);
        c.row(4, 11, 33, L(HIDE));
        dots(c, D(HIDE), [14, 5, 19, 6, 25, 5, 30, 6]);
        c.row(6, 11, 33, D(HIDE));
      } else {
        c.rect(26, 2, 33, 6, HIDE); // the blanket kicked to the foot
        c.row(1, 28, 32, HIDE);
        c.row(1, 28, 32, L(HIDE));
        c.line(27, 3, 29, 6, D(HIDE));
        c.line(31, 2, 32, 6, D(HIDE));
        c.rect(5, 4, 7, 4, D(CANVAS));
        dots(c, C.straw, [12, 4, 16, 4, 21, 4, 36, b, 38, b - 1, 35, b - 2, 37, b]);
        c.rect(13, 5, 20, 5, D(C.straw)); // the hollow a body left
      }
    },
    u: [0, 0, 4],
    sw: 18, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 3, 16, b - 4, OAK);
      c.col(1, 3, b - 4, L(OAK));
      c.rect(3, 4, 14, b - 5, C.straw);
      dots(c, D(C.straw), [4, 6, 7, 10, 11, 8, 13, 13, 5, 15, 9, 17, 12, 5]);
      c.rect(5, 4, 12, 7, CANVAS);
      c.row(4, 6, 11, L(CANVAS));
      c.row(7, 5, 12, D(CANVAS));
      if (!u) {
        c.rect(4, 9, 13, b - 5, HIDE);
        c.rect(4, 9, 13, 10, L(HIDE));
        c.row(11, 4, 13, D(HIDE));
        c.col(4, 12, b - 5, L(HIDE));
        c.col(13, 12, b - 5, D(HIDE));
        dots(c, D(HIDE), [6, 13, 9, 15, 11, 13, 7, 18, 11, 18]);
      } else {
        c.rect(7, 5, 10, 6, D(CANVAS));
        c.rect(6, 9, 11, 14, D(C.straw));
        c.rect(3, 16, 14, b - 5, HIDE);
        c.row(15, 5, 12, HIDE);
        c.row(15, 5, 12, L(HIDE));
        c.line(6, 16, 8, b - 5, D(HIDE));
        c.line(11, 16, 12, b - 5, D(HIDE));
        dots(c, C.straw, [2, b, 0, b - 1]);
      }
      board(c, 1, b - 4, 16, b - 1, OAK);
      c.rect(2, b, 3, b, DOAK);
      c.rect(14, b, 15, b, DOAK);
    },
  });
  add('medieval-chapel-font-lidded', 'chapel font stone baptism holy water basin wooden lid octagonal', {
    w: 18, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 6, 15, 12, MSTONE); // the bowl
      c.row(13, 4, 13, MSTONE);
      c.row(6, 2, 15, L(MSTONE));
      c.col(2, 6, 12, L(MSTONE));
      for (let x = 4; x <= 13; x += 3) {
        c.col(x, 9, 12, D(MSTONE)); // blind arches
        c.set(x, 8, D(MSTONE));
      }
      c.rect(6, 14, 11, 19, MSTONE);
      c.col(6, 14, 19, L(MSTONE));
      c.col(11, 14, 19, D(MSTONE));
      c.rect(4, 20, 13, 21, MSTONE);
      c.rect(2, 22, 15, b, MSTONE);
      c.row(22, 2, 15, L(MSTONE));
      c.row(20, 4, 13, L(MSTONE));
      dots(c, C.moss, [3, b, 4, b, 13, 23, 5, 13]);
      if (!u) {
        c.rect(2, 4, 15, 5, DOAK); // the lid, locked against witches
        c.row(4, 2, 15, OAK);
        c.rect(8, 2, 9, 3, IRON);
        c.set(8, 3, K);
        c.rect(14, 5, 15, 7, IRON);
      } else {
        c.rect(3, 5, 14, 5, WAT);
        c.row(5, 5, 9, L(WAT));
        c.set(12, 5, D(WAT));
        c.rect(16, 13, 18, b, DOAK); // the lid leant against the foot
        c.col(16, 13, b, OAK);
        c.set(19, 17, IRON);
        dots(c, WAT, [7, 9, 7, 11, 8, 14]);
      }
    },
    u: [0, 0, 3],
  });
  add('medieval-jousting-quintain', 'jousting dummy quintain tilting post shield sandbag tournament practice lance', {
    w: 30, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 13, 15, 8, b - 1, OAK);
      board(c, 8, b - 1, 20, b, DOAK);
      c.line(10, b - 2, 12, b - 6, DOAK);
      c.line(18, b - 2, 16, b - 6, DOAK);
      board(c, 3, 6, 26, 7, PINE); // the swinging arm
      c.rect(13, 4, 15, 5, IRON);
      c.set(14, 3, IRON);
      c.rect(2, 8, 9, 16, RED); // the shield
      c.rect(6, 8, 9, 12, CANVAS);
      c.rect(2, 13, 5, 16, CANVAS);
      c.poly([[2, 17], [9, 17], [6, 20], [5, 20]], RED);
      c.rect(2, 17, 5, 17, CANVAS);
      c.set(4, 18, CANVAS);
      c.col(2, 8, 16, L(RED));
      if (!u) {
        rope(c, 23, 8, 23, 12);
        c.rect(21, 13, 25, 19, HEMP); // the sandbag
        c.row(12, 22, 24, D(HEMP));
        c.col(21, 13, 19, L(HEMP));
        dots(c, D(HEMP), [23, 15, 24, 18, 22, 17]);
      } else {
        c.line(4, 9, 7, 13, K); // split by a lance; the bag swinging back
        c.line(7, 13, 6, 18, K);
        c.clear(9, 8);
        c.clear(9, 9);
        c.clear(8, 8);
        c.line(7, 12, 11, 10, PINE);
        c.set(12, 10, L(PINE));
        rope(c, 24, 8, 27, 12);
        c.poly([[25, 13], [29, 12], [31, 18], [27, 20]], HEMP);
        c.line(25, 13, 27, 20, L(HEMP));
        dots(c, D(HEMP), [28, 15, 29, 17]);
        dots(c, C.straw, [28, 21, 28, 24, 29, 27, 28, b - 2, 27, b, 29, b, 30, b]);
        dots(c, RED, [3, b, 6, b - 1]);
      }
    },
    u: [0, 0, 3],
    sw: 14, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      post(c, 6, 8, 8, b - 1, OAK);
      board(c, 2, b - 1, 11, b, DOAK);
      c.line(3, b - 2, 5, b - 6, DOAK);
      c.line(10, b - 2, 9, b - 6, DOAK);
      c.rect(5, 6, 9, 7, PINE);
      c.rect(6, 4, 8, 5, IRON);
      c.set(7, 3, IRON);
      if (!u) {
        rope(c, 7, 8, 7, 12);
        c.rect(5, 13, 9, 19, HEMP);
        c.row(12, 6, 8, D(HEMP));
        c.col(5, 13, 19, L(HEMP));
        dots(c, D(HEMP), [7, 15, 8, 18, 6, 17]);
      } else {
        rope(c, 7, 8, 9, 12);
        c.poly([[7, 13], [11, 12], [12, 18], [9, 20]], HEMP);
        c.line(7, 13, 9, 20, L(HEMP));
        dots(c, C.straw, [10, 21, 10, 25, 11, b - 2, 10, b, 12, b]);
        c.set(3, b, RED);
      }
    },
  });
  add('medieval-anvil-on-stump', 'anvil on stump blacksmith smithy forge iron hammer horseshoe', {
    w: 20, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 11, 14, b, OAK); // the stump
      c.row(10, 6, 13, PINE);
      c.row(11, 5, 14, L(OAK));
      for (const x of [7, 10, 12]) c.col(x, 12, b, D(OAK));
      c.row(14, 5, 14, IRON);
      c.rect(4, 4, 16, 5, IRON); // the anvil
      c.row(4, 3, 16, L(IRON));
      c.rect(1, 5, 3, 5, IRON);
      c.set(2, 6, IRON);
      c.rect(5, 6, 15, 6, D(IRON));
      c.rect(8, 7, 12, 8, IRON);
      c.rect(6, 9, 14, 9, IRON);
      c.col(8, 7, 8, L(IRON));
      if (!u) {
        c.line(16, b, 18, 9, PINE); // the hammer leant against it
        c.rect(16, 8, 18, 9, D(STEEL));
      } else {
        c.rect(12, 2, 15, 3, D(STEEL)); // the hammer laid down, a shoe glowing
        c.row(3, 16, 18, PINE);
        c.row(3, 6, 10, C.flame);
        c.set(6, 2, C.flame);
        c.set(10, 2, C.flame);
        dots(c, C.flameLight, [7, 3, 9, 3, 8, 3]);
        dots(c, C.flameLight, [4, 1, 8, 0, 11, 1, 2, 2]);
        dots(c, C.flame, [5, 0, 13, 0]);
      }
    },
    u: [0, 2, 0],
    sw: 14, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 11, 11, b, OAK);
      c.row(10, 3, 10, PINE);
      c.row(11, 2, 11, L(OAK));
      for (const x of [4, 7, 9]) c.col(x, 12, b, D(OAK));
      c.row(14, 2, 11, IRON);
      c.rect(4, 4, 9, 5, IRON);
      c.row(4, 4, 9, L(IRON));
      c.rect(5, 6, 8, 8, IRON);
      c.col(5, 6, 8, L(IRON));
      c.rect(3, 9, 10, 9, IRON);
      if (!u) {
        c.line(11, b, 12, 9, PINE);
        c.rect(11, 8, 12, 9, D(STEEL));
      } else {
        c.rect(7, 2, 8, 3, D(STEEL));
        c.row(3, 4, 6, C.flame);
        c.set(5, 3, C.flameLight);
        dots(c, C.flameLight, [3, 1, 6, 0, 9, 1]);
      }
    },
    su: [0, 2, 0],
  });
  add('medieval-forge-bellows-great', 'forge great bellows blacksmith hearth coals fire smithy leather lever', {
    w: 36, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        t = u ? 14 : 10;
      stones(c, 20, 14, 33, b, MSTONE, 4, 6, 3); // the hearth
      c.rect(19, 12, 34, 13, L(MSTONE));
      c.row(13, 19, 34, MSTONE);
      c.rect(21, 11, 32, 11, SOOT);
      dots(c, hex('#3a3236'), [23, 11, 27, 11, 30, 11]);
      c.rect(24, 20, 29, b, SOOT); // the ash hole
      c.row(20, 25, 28, K);
      if (u) {
        fire(c, 22, 31, 11, 7, 4);
        dots(c, C.flameLight, [25, 2, 29, 1, 22, 3]);
        dots(c, C.flame, [27, 0, 31, 3]);
        dots(c, C.flame, [25, b, 27, b - 1, 28, b]);
      } else dots(c, C.ash, [25, b, 27, b, 28, b - 1]);
      post(c, 9, 10, 2, b, OAK);
      board(c, 6, b - 1, 13, b, DOAK);
      c.rect(3, 19, 16, 20, PINE); // the bellows: two boards and the leather between
      c.row(19, 3, 16, L(PINE));
      c.rect(3, t, 15, t + 1, PINE);
      c.row(t, 3, 15, L(PINE));
      for (let y = t + 2; y <= 18; y++) {
        c.row(y, 4, 15, y % 2 ? LEATHER : D(LEATHER));
        c.set(4, y, L(LEATHER));
      }
      c.rect(17, 18, 21, 18, IRON); // the pipe into the coals
      c.set(21, 17, IRON);
      c.col(4, 21, b, DOAK);
      c.col(15, 21, b, DOAK);
      if (!u) {
        c.line(2, 5, 16, 2, OAK); // the lever, up
        c.line(2, 6, 16, 3, DOAK);
        chain(c, 13, 4, 13, t - 1);
        rope(c, 2, 7, 2, 14);
      } else {
        c.line(2, 9, 16, 5, OAK); // hauled down
        c.line(2, 10, 16, 6, DOAK);
        chain(c, 13, 7, 13, t - 1);
        rope(c, 2, 11, 1, 20);
      }
      c.set(2, u ? 21 : 15, PINE);
    },
    sw: 18, sh: 30,
    s(c, u) {
      const b = c.h - 2,
        t = u ? 14 : 10;
      stones(c, 2, 14, 15, b, MSTONE, 4, 6, 5);
      c.rect(1, 12, 16, 13, L(MSTONE));
      c.row(13, 1, 16, MSTONE);
      c.rect(3, 11, 14, 11, SOOT);
      if (u) {
        fire(c, 4, 13, 11, 7, 6);
        dots(c, C.flameLight, [6, 2, 11, 1]);
        dots(c, C.flame, [9, 0, 13, 3]);
      }
      post(c, 8, 9, 2, t, OAK);
      c.rect(8, u ? 6 : 3, 9, u ? 8 : 5, DOAK);
      c.rect(4, 19, 13, 20, PINE);
      c.row(19, 4, 13, L(PINE));
      c.rect(4, t, 13, t + 1, PINE);
      c.row(t, 4, 13, L(PINE));
      for (let y = t + 2; y <= 18; y++) {
        c.row(y, 5, 12, y % 2 ? LEATHER : D(LEATHER));
        c.set(5, y, L(LEATHER));
      }
      c.col(5, 21, b, DOAK);
      c.col(12, 21, b, DOAK);
      rope(c, 7, u ? 9 : 6, 7, u ? 21 : 14);
      c.set(7, u ? 22 : 15, PINE);
    },
  });
  /** The lord's bed, side on (the head to the left). */
  add('medieval-four-poster-bed-lord', 'four poster bed lord lady canopy curtains red tester oak state bed chamber', {
    w: 40, h: 40, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      face(c, 4, 12, 6, 27, DOAK); // headboard
      post(c, 2, 3, 2, b, OAK);
      post(c, 36, 37, 2, b, OAK);
      c.rect(1, 2, 38, 5, OAK); // the tester
      c.row(2, 1, 38, L(OAK));
      c.row(5, 1, 38, DOAK);
      for (let x = 2; x <= 37; x++) {
        c.col(x, 6, 7, RED);
        if (x % 4 < 2) c.set(x, 8, RED);
        if (x % 4 === 0) c.set(x, 7, GOLD);
      }
      for (const [x0, x1] of [[4, 7], [32, 35]]) {
        c.rect(x0, 8, x1, 27, RED); // curtains tied back
        c.col(x0, 8, 27, L(RED));
        c.col(x0 + 2, 9, 27, D(RED));
        c.row(18, x0, x1, GOLD);
      }
      c.rect(7, 23, 33, 27, SHEET); // the bedding
      c.rect(8, 20, 14, 23, C.white); // pillow
      c.row(23, 8, 14, D(C.white));
      c.set(14, 21, D(C.white));
      face(c, 3, 28, 36, 31, OAK);
      c.row(31, 3, 36, DOAK);
      dots(c, DOAK, [10, 29, 16, 30, 22, 29, 28, 30]);
      if (!u) {
        c.rect(16, 22, 35, 27, BLUE); // the coverlet
        c.row(22, 16, 35, L(BLUE));
        c.col(16, 22, 27, D(BLUE));
        c.row(26, 17, 35, GOLD);
        dots(c, D(BLUE), [20, 24, 26, 25, 31, 24]);
      } else {
        c.rect(27, 19, 35, 27, BLUE); // thrown back in a heap
        c.row(18, 29, 34, BLUE);
        c.row(18, 29, 34, L(BLUE));
        c.line(28, 20, 30, 27, D(BLUE));
        c.line(32, 19, 34, 27, D(BLUE));
        c.set(29, 26, GOLD);
        c.set(33, 26, GOLD);
        c.rect(10, 21, 12, 22, D(C.white));
        c.row(24, 15, 25, D(SHEET));
        dots(c, D(SHEET), [17, 26, 22, 25, 20, 23]);
        dots(c, C.blood, [16, 24, 17, 24, 17, 25, 18, 24]);
        c.line(13, 17, 12, 20, STEEL); // a dagger in the pillow
        c.set(13, 16, GOLD);
        c.set(13, 15, DOAK);
      }
    },
    sw: 26, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 6, 21, 27, mix(DOAK, 0.6));
      face(c, 6, 11, 19, 21, DOAK); // the headboard at the back
      panel(c, 8, 13, 17, 19, DOAK);
      c.set(12, 16, GOLD);
      c.set(13, 16, GOLD);
      post(c, 2, 3, 2, b, OAK);
      post(c, 22, 23, 2, b, OAK);
      c.rect(1, 2, 24, 5, OAK);
      c.row(2, 1, 24, L(OAK));
      c.row(5, 1, 24, DOAK);
      for (let x = 2; x <= 23; x++) {
        c.col(x, 6, 7, RED);
        if (x % 4 < 2) c.set(x, 8, RED);
        if (x % 4 === 0) c.set(x, 7, GOLD);
      }
      for (const x0 of [4, 19]) {
        c.rect(x0, 8, x0 + 2, 28, RED);
        c.col(x0, 8, 28, L(RED));
        c.col(x0 + 2, 9, 28, D(RED));
        c.row(18, x0, x0 + 2, GOLD);
      }
      c.rect(7, 20, 12, 23, C.white);
      c.rect(13, 20, 18, 23, C.white);
      c.row(23, 7, 18, D(C.white));
      c.col(12, 20, 23, D(C.white));
      c.rect(7, 24, 18, 30, SHEET);
      if (!u) {
        c.rect(7, 24, 18, 30, BLUE);
        c.row(24, 7, 18, L(BLUE));
        c.row(29, 7, 18, GOLD);
        dots(c, D(BLUE), [9, 26, 13, 27, 16, 26]);
      } else {
        c.rect(7, 28, 18, 30, BLUE);
        c.row(27, 9, 16, BLUE);
        c.row(27, 9, 16, L(BLUE));
        c.line(10, 28, 11, 30, D(BLUE));
        c.line(15, 28, 16, 30, D(BLUE));
        dots(c, D(SHEET), [9, 25, 14, 26]);
        dots(c, C.blood, [11, 25, 12, 25, 12, 26]);
        c.col(9, 18, 20, STEEL);
        c.set(9, 17, GOLD);
        c.set(9, 16, DOAK);
      }
      face(c, 4, 31, 21, 34, OAK);
      c.row(34, 4, 21, DOAK);
      dots(c, DOAK, [8, 32, 12, 33, 16, 32]);
    },
  });
  add('medieval-garderobe-privy-seat', 'garderobe privy latrine stone seat hole castle toilet wooden lid arrow slit', {
    w: 20, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stones(c, 2, 2, 17, 13, MSTONE, 4, 6, 2);
      c.rect(9, 4, 10, 10, SOOT); // a slit for light
      c.set(9, 6, C.glassLight);
      stones(c, 2, 16, 17, b, MSTONE, 4, 6, 6);
      c.col(2, 2, b, L(MSTONE));
      board(c, 1, 14, 18, 15, PINE);
      c.rect(14, 10, 16, 13, C.moss); // a bunch of moss, for after
      dots(c, C.leafLight, [14, 11, 16, 12]);
      if (!u) {
        c.rect(6, 13, 13, 14, DOAK);
        c.row(13, 6, 13, OAK);
        c.set(9, 12, IRON);
        c.set(10, 12, IRON);
      } else {
        c.rect(6, 14, 13, 14, SOOT);
        c.rect(7, 15, 12, 15, K);
        face(c, 4, 4, 7, 12, DOAK); // the lid stood against the wall
        c.col(4, 4, 12, OAK);
        dots(c, K, [11, 9, 13, 7, 12, 11]);
        dots(c, hex('#5a5030'), [9, 18, 10, 20, 9, 23]);
      }
    },
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 2, 5, b, MSTONE, 4, 5, 2);
      stones(c, 6, 16, 10, b, MSTONE, 4, 5, 6);
      c.col(2, 2, b, L(MSTONE));
      board(c, 6, 14, 11, 15, PINE);
      if (!u) {
        c.rect(7, 13, 10, 13, DOAK);
        c.set(8, 12, IRON);
      } else {
        c.rect(6, 4, 6, 13, DOAK);
        c.set(7, 13, DOAK);
        dots(c, K, [9, 9, 10, 11]);
      }
      c.rect(6, 10, 6, 12, u ? DOAK : C.moss);
    },
  });
  add('medieval-dungeon-rack', 'rack torture dungeon stretching frame rollers ropes interrogation wooden', {
    w: 44, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [6, 36]) {
        c.rect(x, 12, x + 1, b, DOAK);
        c.col(x, 12, b, OAK);
      }
      c.row(b - 2, 8, 35, D(OAK));
      board(c, 4, 9, 39, 11, OAK);
      planksV(c, 4, 10, 39, 11, D(OAK), 8);
      for (const x of [2, 37]) {
        c.oval(x, 5, x + 4, 9, PINE); // rollers
        c.set(x + 2, 7, IRON);
        c.set(x + 1, 6, L(PINE));
      }
      c.line(39, 7, u ? 42 : 40, u ? 5 : 1, DOAK); // the lever
      c.line(40, 7, u ? 42 : 41, u ? 6 : 1, OAK);
      if (!u) {
        rope(c, 6, 8, 12, 8); // slack
        rope(c, 13, 8, 15, 8);
        c.rect(15, 7, 16, 8, IRON);
        rope(c, 37, 8, 30, 8);
        c.rect(27, 7, 29, 8, IRON);
      } else {
        rope(c, 6, 7, 17, 7); // taut, and the board wet
        c.rect(18, 6, 19, 7, IRON);
        c.rect(24, 6, 25, 7, IRON);
        rope(c, 26, 7, 37, 7);
        dots(c, C.blood, [18, 9, 19, 9, 20, 9, 24, 9, 25, 9, 21, 10, 22, 9, 22, 11, 22, 13, 25, 10]);
        dots(c, C.blood, [22, b, 23, b, 21, b]);
        c.rect(20, 8, 23, 8, CANVAS); // a rag of shirt
        c.set(21, 7, CANVAS);
      }
    },
    sw: 18, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [3, 13]) {
        c.rect(x, 12, x + 1, b, DOAK);
        c.col(x, 12, b, OAK);
      }
      c.row(b - 2, 5, 12, D(OAK));
      board(c, 2, 9, 15, 11, OAK);
      c.rect(2, 5, 15, 8, PINE);
      c.row(5, 2, 15, L(PINE));
      c.row(8, 2, 15, D(PINE));
      for (const x of [5, 8, 11]) c.col(x, 5, 8, HEMP);
      c.set(1, 6, IRON);
      c.set(16, 6, IRON);
      if (!u) {
        c.line(14, 5, 14, 1, DOAK);
        c.set(13, 1, OAK);
      } else {
        c.line(14, 5, 17, 3, DOAK);
        dots(c, C.blood, [8, 9, 9, 10, 9, 12, 8, 11, 9, b]);
      }
    },
    su: [0, 0, 1],
  });
  add('medieval-gibbet-cage-post', 'gibbet cage hanging iron cage post skeleton crossroads prisoner crow cage', {
    w: 20, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 3, 2, b, OAK);
      board(c, 1, b - 1, 6, b, DOAK);
      board(c, 2, 2, 14, 3, OAK);
      c.line(4, 10, 9, 4, DOAK);
      chain(c, 11, 4, 11, 8);
      const cage = (open) => {
        for (const y of [9, 15, 23, 31]) c.row(y, 7, 15, IRON);
        for (const x of [7, 11, 15]) c.col(x, 9, 31, x === 7 ? L(IRON) : IRON);
        c.row(8, 9, 13, IRON);
        c.set(11, 32, IRON);
        if (open) {
          c.clearRect(12, 16, 14, 30);
          c.col(15, 16, 30, null);
          for (let y = 16; y <= 30; y++) c.clear(15, y);
          c.rect(16, 15, 17, 31, IRON); // the front swung open
          c.col(16, 15, 31, L(IRON));
        }
      };
      if (!u) {
        H.skull(c, 9, 11); // who was left in it
        c.rect(10, 16, 13, 16, C.bone);
        for (const y of [18, 20, 22]) c.row(y, 9, 13, C.bone);
        c.col(11, 16, 24, D(C.bone));
        c.col(9, 24, 30, C.bone);
        c.col(13, 24, 29, C.bone);
        c.set(13, 30, D(C.bone));
        c.set(8, 19, C.bone);
        c.set(14, 19, C.bone);
        dots(c, HIDE, [9, 25, 10, 24, 12, 17]);
      }
      cage(u);
      if (u) {
        dots(c, C.bone, [9, b, 10, b, 12, b, 13, b - 1, 14, b, 10, b - 1]);
        H.skull(c, 13, b - 5);
        c.set(8, 30, HIDE);
        c.set(9, 30, HIDE);
      }
    },
    sw: 14, sh: 48,
    s(c, u) {
      const b = c.h - 2;
      post(c, 6, 7, 5, b, OAK);
      board(c, 3, b - 1, 10, b, DOAK);
      c.rect(5, 2, 8, 4, OAK);
      c.row(2, 5, 8, L(OAK));
      chain(c, 7, 5, 7, 8);
      if (!u) {
        H.skull(c, 4, 11);
        for (const y of [18, 20, 22]) c.row(y, 5, 8, C.bone);
        c.col(6, 16, 24, D(C.bone));
        c.col(5, 24, 30, C.bone);
        c.col(8, 24, 29, C.bone);
      }
      for (const y of [9, 15, 23, 31]) c.row(y, 2, 11, IRON);
      for (const x of [2, 11]) c.col(x, 9, 31, x === 2 ? L(IRON) : IRON);
      if (!u) c.col(7, 24, 31, IRON);
      c.row(8, 4, 9, IRON);
      if (u) {
        c.rect(12, 15, 12, 31, IRON);
        c.set(13, 23, IRON);
        dots(c, C.bone, [3, b, 9, b, 11, b, 10, b - 1]);
        H.skull(c, 1, b - 5);
      }
    },
    su: [0, 0, 1],
  });
  void [K, hollow, wisp, planksH, straps, candle, PEWTER, WAT, face];
};
