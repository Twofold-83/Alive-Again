/* Apothecary, second part: the herb-woman's back room and the doctor's corner. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, tleg, cabSide, hollow, pane, flame, fire, wisp, bottle, shards, stones, jar, glow, puddle, pull, pullS, books, wicker, cartWheel, wheelEdge } = H;
  const add = H.reg('env-apothecary', 'Apothecary');
  const MAH = hex('#5a3226'),
    OAK = hex('#6a4a32'),
    PINE = hex('#94714a'),
    EB = hex('#2b242a'),
    BR = C.brass,
    GILT = C.gold,
    MARB = hex('#b4aea0'),
    CHINA = hex('#d6d2c4'),
    DELFT = hex('#44506e'),
    RED = hex('#8a2f2c'),
    GREEN = hex('#3e6a4c'),
    BLUE = hex('#3d5a80'),
    AMBER = hex('#a8762c'),
    POISON = hex('#4d6a3a'),
    LEATHER = hex('#4a2e28'),
    LINEN = hex('#b9ad8a'),
    WINE = C.wine,
    PALE = hex('#c9b99a'),
    WAX = hex('#c9a585'),
    SAGE = hex('#7a8a5a'),
    DRIED = hex('#7a6a45'),
    LAV = hex('#6a5a80'),
    MADDER = hex('#7a3a30'),
    STONE = C.stone,
    SOOT = hex('#221d22'),
    STONEW = hex('#b0a37e');

  /* ---------- the herb-woman's back room ---------- */
  add('apoth-cauldron-hearth', 'apothecary herb woman hearth cauldron fireplace stone iron pot brewing witch kitchen', {
    w: 28, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stones(c, 1, 7, 26, b, STONE, 4, 6, 3);
      c.rect(6, 14, 21, b, SOOT);
      c.row(13, 8, 19, SOOT);
      c.row(12, 10, 17, SOOT);
      board(c, 1, 4, 26, 6, OAK);
      for (const [x, col] of [[3, SAGE], [23, LAV]]) {
        c.set(x, 7, C.straw);
        c.rect(x - 1, 8, x + 1, 11, col);
        c.col(x - 1, 8, 11, L(col));
      }
      c.rect(8, 3, 10, 3, CHINA); // a jar and a candle on the beam
      c.rect(8, 2, 10, 2, DELFT);
      c.col(18, 2, 3, CHINA);
      c.row(16, 6, 21, C.iron);
      c.col(13, 17, 19, C.iron);
      c.rect(8, b - 1, 19, b, hex('#3a2a22'));
      dots(c, C.ash, [9, b, 13, b - 1, 17, b]);
      c.oval(8, 19, 19, b - 3, C.ironDark);
      c.row(20, 7, 20, C.iron);
      c.rect(8, 21, 8, 24, C.iron);
      dots(c, C.ironDark, [9, b - 2, 18, b - 2]);
      if (u) {
        c.set(18, 1, C.flameLight);
        fire(c, 7, 20, b, 5, 4);
        c.row(21, 9, 18, hex('#6f9a4a')); // it is on the boil
        dots(c, hex('#a9c96a'), [10, 21, 13, 20, 16, 21, 12, 19]);
        wisp(c, 11, 18, 5, hex('#8fae7a'));
        wisp(c, 15, 17, 4, hex('#8fae7a'));
        dots(c, C.flame, [6, b - 6, 21, b - 5]);
      }
    },
    sw: 13, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 7, 9, b, STONE, 4, 6, 5);
      board(c, 1, 4, 10, 6, OAK);
      c.rect(7, 3, 8, 3, CHINA);
      c.rect(7, 2, 8, 2, DELFT);
      c.rect(10, b - 1, 11, b, C.stoneDark); // the hearth stone
      c.set(9, 8, C.straw);
      c.rect(9, 9, 10, 11, SAGE);
      if (u) {
        c.col(10, 20, b - 2, C.flame);
        dots(c, C.flameLight, [10, 24, 10, b - 3, 11, b - 2]);
        wisp(c, 10, 18, 5, hex('#8fae7a'));
      }
    },
  });

  add('apoth-herb-table-chopping', 'apothecary herb table chopping board knife mortar bundles roots work bench', {
    w: 30, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 10, 28, b - 9, OAK);
      c.row(b - 8, 3, 26, D(OAK));
      legs(c, [3, 25], b - 8, b, OAK);
      c.row(b - 3, 5, 24, D(OAK));
      c.rect(11, b - 14, 15, b - 11, STONE); // mortar
      c.row(b - 14, 10, 16, C.stoneLight);
      c.line(14, b - 15, 16, b - 17, PINE);
      c.row(b - 11, 18, 26, PINE); // the board
      if (!u) {
        c.rect(3, b - 12, 7, b - 11, SAGE);
        c.row(b - 12, 3, 7, L(SAGE));
        dots(c, C.straw, [8, b - 11, 9, b - 11]);
        c.rect(2, b - 13, 5, b - 13, LAV);
        c.row(b - 12, 19, 22, C.steel);
        c.rect(23, b - 12, 25, b - 12, EB);
        dots(c, DRIED, [19, b - 13, 20, b - 13]);
      } else {
        dots(c, C.straw, [3, b - 11, 5, b - 11, 8, b - 11]);
        dots(c, SAGE, [19, b - 12, 20, b - 12, 21, b - 12, 20, b - 13, 23, b - 12, 25, b - 12, 4, b - 11]);
        dots(c, LAV, [22, b - 12, 24, b - 12]);
        c.col(22, b - 15, b - 13, C.steel); // the knife stuck in the board
        c.rect(22, b - 17, 22, b - 16, EB);
        dots(c, C.blood, [18, b - 11, 19, b - 11, 18, b - 9, 18, b - 8, 17, b - 5]);
      }
    },
    sw: 14, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 10, 12, b - 9, OAK);
      c.row(b - 8, 3, 10, D(OAK));
      legs(c, [2, 10], b - 8, b, OAK, 1);
      c.row(b - 3, 3, 9, D(OAK));
      c.rect(3, b - 14, 6, b - 11, STONE);
      c.row(b - 14, 2, 7, C.stoneLight);
      c.line(5, b - 15, 6, b - 17, PINE);
      c.row(b - 11, 8, 11, PINE);
      if (!u) {
        c.row(b - 12, 9, 10, C.steel);
        c.set(11, b - 12, EB);
      } else {
        dots(c, SAGE, [8, b - 12, 11, b - 12]);
        c.col(10, b - 15, b - 13, C.steel);
        c.rect(10, b - 17, 10, b - 16, EB);
        dots(c, C.blood, [12, b - 9, 12, b - 8]);
      }
    },
  });

  add('apoth-herb-woman-cot', 'apothecary herb woman cot bed narrow back room straw mattress blanket wooden', {
    w: 38, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 15, 3, b, OAK);
      face(c, 34, b - 10, 35, b, OAK);
      board(c, 4, b - 6, 33, b - 5, OAK);
      legs(c, [4, 32], b - 4, b, D(OAK));
      c.rect(4, b - 8, 33, b - 7, LINEN); // straw tick
      for (let x = 5; x < 33; x += 3) c.set(x, b - 7, DRIED);
      c.rect(8, b - 2, 12, b, CHINA); // the pot under the bed
      c.row(b - 2, 7, 13, CHINA);
      c.set(13, b - 1, D(CHINA));
      if (!u) {
        c.rect(4, b - 10, 10, b - 9, C.white);
        c.row(b - 10, 5, 9, L(C.white));
        c.rect(11, b - 10, 33, b - 6, MADDER);
        c.row(b - 10, 11, 33, L(MADDER));
        for (let x = 13; x < 33; x += 5) c.col(x, b - 9, b - 6, D(MADDER));
        c.row(b - 8, 11, 33, hex('#8f6a3a'));
      } else {
        c.rect(5, b - 10, 11, b - 9, C.white);
        c.set(8, b - 9, D(C.white));
        c.row(b - 9, 12, 24, C.white); // the sheet, and the dent in it
        dots(c, D(C.white), [14, b - 9, 18, b - 9, 21, b - 9]);
        c.poly([[24, b - 13], [30, b - 14], [33, b - 11], [33, b - 6], [23, b - 6]], MADDER); // the blanket in a heap at the foot
        c.line(24, b - 13, 30, b - 14, L(MADDER));
        c.line(26, b - 11, 28, b - 7, D(MADDER));
        c.row(b - 8, 25, 33, hex('#8f6a3a'));
        c.poly([[30, b - 5], [35, b - 5], [36, b - 1], [31, b]], MADDER);
      }
    },
    sw: 18, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 1, 15, 6, OAK); // the head board, far end
      c.row(1, 2, 15, L(OAK));
      c.rect(3, 6, 14, b - 9, u ? C.white : MADDER);
      if (!u) {
        c.rect(4, 6, 13, 9, C.white);
        c.row(10, 3, 14, L(MADDER));
        for (let y = 13; y < b - 9; y += 5) c.row(y, 3, 14, D(MADDER));
        c.row(b - 12, 3, 14, hex('#8f6a3a'));
      } else {
        c.rect(5, 6, 14, 9, C.white);
        c.row(10, 4, 13, D(C.white));
        dots(c, D(C.white), [7, 13, 9, 16, 6, 18]);
        c.poly([[3, b - 16], [14, b - 15], [14, b - 9], [3, b - 9]], MADDER);
        c.line(3, b - 16, 14, b - 15, L(MADDER));
        c.line(8, b - 14, 10, b - 10, D(MADDER));
        c.row(b - 11, 3, 14, hex('#8f6a3a'));
      }
      face(c, 2, b - 9, 15, b - 3, OAK); // the foot board
      c.col(8, b - 8, b - 3, D(OAK));
      legs(c, [2, 14], b - 2, b, D(OAK));
      c.rect(6, b - 1, 10, b, CHINA);
    },
    base: 'side',
  });

  add('apoth-folding-screen-linen', 'apothecary folding screen linen three panels privacy examination room divider shadow', {
    w: 26, h: 35, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (let i = 0; i < 3; i++) {
        const x = 1 + i * 8,
          y = i === 1 ? 3 : 2,
          yb = i === 1 ? b : b - 1;
        c.rect(x, y, x + 7, yb, MAH);
        c.col(x, y, yb, L(MAH));
        c.rect(x + 1, y + 1, x + 6, yb - 4, i === 1 ? mix(LINEN, 0.92) : LINEN);
        c.row(y + 12, x + 1, x + 6, MAH);
        c.clearRect(x + 1, yb - 2, x + 6, yb);
        c.rect(x + 1, yb - 3, x + 6, yb - 3, D(MAH));
      }
      dots(c, D(LINEN), [4, 9, 20, 22, 12, 8]);
      if (u) {
        const SH = mix(LINEN, 0.62); // a lamp lit behind: somebody is standing there
        c.oval(11, 6, 14, 10, SH);
        c.rect(10, 12, 15, 14, SH);
        c.rect(12, 11, 13, 11, SH);
        c.rect(10, 16, 15, b - 4, SH);
        c.col(9, 17, 24, SH);
        dots(c, blend(LINEN, C.glow, 0.6), [3, 5, 4, 5, 5, 6, 3, 6, 19, 5, 20, 5, 21, 6, 20, 6, 4, 17, 20, 18, 5, 18]);
        dots(c, C.blood, [19, 24, 20, 24, 21, 25, 20, 26, 19, 26, 20, 27]); // and a hand has been wiped on the cloth
      }
    },
    sw: 9, sh: 35,
    s(c, u) {
      const b = c.h - 2;
      for (const [x, y, yb, col] of [[1, 2, b - 1, LINEN], [4, 3, b, mix(LINEN, 0.92)]]) {
        c.rect(x, y, x + 3, yb, MAH);
        c.col(x, y, yb, L(MAH));
        c.rect(x + 1, y + 1, x + 2, yb - 4, col);
        c.row(y + 12, x + 1, x + 2, MAH);
        c.clearRect(x + 1, yb - 2, x + 2, yb);
      }
      if (u) {
        c.rect(5, 8, 6, b - 5, mix(LINEN, 0.62));
        dots(c, C.blood, [2, 24, 2, 26, 3, 25]);
        dots(c, blend(LINEN, C.glow, 0.6), [2, 5, 3, 6]);
      }
    },
  });

  add('apoth-root-baskets', 'apothecary baskets of roots poppy heads wicker ginger mandrake dried harvest', {
    w: 22, h: 14,
    f(c, u) {
      const b = c.h - 2;
      const POPPY = hex('#8a9278');
      wicker(c, 2, b - 6, 8, b);
      c.row(b - 7, 1, 9, hex('#a8844c'));
      dots(c, DRIED, [2, b - 8, 3, b - 9, 4, b - 8, 5, b - 9, 6, b - 8, 7, b - 8, 4, b - 10, 8, b - 8]);
      dots(c, L(DRIED), [3, b - 8, 5, b - 8, 5, b - 10]);
      if (!u) {
        wicker(c, 13, b - 6, 19, b);
        c.row(b - 7, 12, 20, hex('#a8844c'));
        for (const [x, y] of [[13, b - 9], [16, b - 10], [18, b - 9]]) {
          c.rect(x, y, x + 1, y + 1, POPPY);
          c.set(x, y - 1, D(POPPY));
          c.set(x, y, L(POPPY));
        }
      } else {
        wicker(c, 14, b - 6, 20, b); // on its side
        c.oval(11, b - 7, 15, b, hex('#3a2a1a'));
        c.col(13, b - 7, b, hex('#a8844c'));
        c.oval(12, b - 6, 14, b - 1, hex('#3a2a1a'));
        for (const [x, y] of [[9, b - 1], [5, b - 1 + 0], [12, b - 2]]) {
          c.rect(x, y, x + 1, y + 1, POPPY);
          c.set(x - 1, y + (x === 5 ? 0 : 1), D(POPPY));
          c.set(x, y, L(POPPY));
        }
        c.clearRect(4, b - 1, 6, b); // (not in front of the other basket)
        wicker(c, 2, b - 6, 8, b);
      }
    },
    sw: 11, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      const POPPY = hex('#8a9278');
      if (!u) {
        wicker(c, 2, b - 6, 8, b);
        c.row(b - 7, 1, 9, hex('#a8844c'));
        for (const [x, y] of [[2, b - 9], [5, b - 10], [7, b - 9]]) {
          c.rect(x, y, x + 1, y + 1, POPPY);
          c.set(x, y - 1, D(POPPY));
          c.set(x, y, L(POPPY));
        }
      } else {
        c.oval(1, b - 8, 9, b, hex('#a8844c')); // tipped towards us: its mouth
        c.oval(2, b - 7, 8, b - 1, hex('#3a2a1a'));
        c.rect(4, b - 3, 5, b - 2, POPPY);
        c.rect(8, b - 1, 9, b, POPPY);
        c.set(8, b - 1, L(POPPY));
        c.set(10, b, D(POPPY));
      }
    },
    su: [0, 0, 2],
  });

  add('apoth-bottle-crate-straw', 'apothecary crate of bottles packed in straw wooden box delivery green glass', {
    w: 18, h: 14, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 8, 16, b, PINE);
      c.row(b - 5, 1, 16, D(PINE));
      c.row(b - 2, 1, 16, D(PINE));
      c.col(3, b - 8, b, D(PINE));
      c.col(14, b - 8, b, D(PINE));
      dots(c, C.slate, [6, b - 4, 7, b - 4, 8, b - 4, 10, b - 4, 11, b - 4, 7, b - 6, 9, b - 6]);
      if (!u) {
        board(c, 1, b - 10, 16, b - 9, PINE);
        dots(c, C.iron, [2, b - 10, 15, b - 10, 8, b - 10]);
      } else {
        c.row(b - 9, 2, 15, C.straw);
        dots(c, L(C.straw), [3, b - 10, 6, b - 10, 9, b - 11, 13, b - 10, 15, b - 10]);
        for (const x of [4, 7, 11]) {
          c.col(x, b - 12, b - 10, C.leaf);
          c.set(x, b - 13, C.parchment);
        }
        c.line(17, b - 9, 20, b, PINE); // the lid leaning against it
        c.line(18, b - 9, 21, b, D(PINE));
      }
    },
    sw: 12, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 8, 10, b, PINE);
      c.row(b - 5, 1, 10, D(PINE));
      c.row(b - 2, 1, 10, D(PINE));
      if (!u) {
        board(c, 1, b - 10, 10, b - 9, PINE);
        c.set(5, b - 10, C.iron);
      } else {
        c.row(b - 9, 2, 9, C.straw);
        dots(c, L(C.straw), [3, b - 10, 8, b - 10]);
        for (const x of [4, 7]) {
          c.col(x, b - 12, b - 10, C.leaf);
          c.set(x, b - 13, C.parchment);
        }
        face(c, 0, b - 7, 0, b, PINE);
      }
    },
    u: [0, 3, 5], su: [1, 3, 0],
  });

  add('apoth-castor-oil-barrel', 'apothecary barrel castor oil cask on a cradle brass tap dripping keg', {
    w: 16, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 3, 12, b, D(OAK));
      c.clearRect(6, b - 1, 9, b);
      c.oval(2, b - 16, 13, b - 4, OAK);
      c.oval(3, b - 15, 12, b - 5, L(OAK));
      c.oval(4, b - 14, 11, b - 6, OAK);
      for (const x of [6, 9]) c.col(x, b - 14, b - 6, D(OAK));
      c.rect(6, b - 13, 9, b - 11, C.paper);
      c.row(b - 12, 7, 8, C.slate);
      c.rect(7, b - 8, 8, b - 7, BR);
      c.set(7, b - 9, D(BR));
      if (u) {
        c.col(7, b - 6, b - 1, AMBER);
        puddle(c, 4, 11, b, AMBER);
        c.set(8, b - 1, L(AMBER));
      }
    },
    sw: 21, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [4, 14], b - 3, b, D(OAK));
      c.rect(2, b - 15, 17, b - 5, OAK);
      c.row(b - 16, 4, 15, OAK);
      c.row(b - 4, 4, 15, D(OAK));
      c.row(b - 16, 4, 15, L(OAK));
      for (const y of [b - 12, b - 8]) c.row(y, 2, 17, D(OAK));
      for (const x of [3, 7, 12, 16]) c.col(x, b - 16, b - 4, C.iron);
      c.rect(18, b - 8, 19, b - 7, BR);
      c.set(19, b - 9, D(BR));
      if (u) {
        c.col(19, b - 6, b - 1, AMBER);
        puddle(c, 17, 21, b, AMBER);
      }
    },
    su: [0, 0, 2],
  });

  add('apoth-water-filter-stoneware', 'apothecary stoneware water filter crock on a stand brass tap drinking water', {
    w: 12, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [2, 8], b - 8, b, OAK);
      board(c, 1, b - 10, 10, b - 9, OAK);
      c.row(b - 4, 3, 8, D(OAK));
      c.rect(3, b - 21, 8, b - 11, STONEW);
      c.col(3, b - 21, b - 11, L(STONEW));
      c.row(b - 22, 4, 7, D(STONEW));
      c.rect(5, b - 23, 6, b - 23, D(STONEW));
      c.row(b - 19, 3, 8, DELFT);
      c.row(b - 13, 3, 8, DELFT);
      dots(c, DELFT, [4, b - 17, 5, b - 16, 6, b - 17, 7, b - 16]);
      c.rect(5, b - 12, 6, b - 11, BR);
      if (u) {
        c.col(6, b - 10, b - 1, C.glassLight);
        dots(c, hex('#6f8f98'), [6, b - 8, 6, b - 4]);
        puddle(c, 3, 9, b, hex('#6f8f98'));
      } else {
        c.rect(4, b - 3, 6, b - 1, hex('#8a8c90')); // a pewter mug waiting under it
        c.set(7, b - 2, hex('#8a8c90'));
      }
    },
    sw: 13, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 8], b - 8, b, OAK);
      board(c, 1, b - 10, 10, b - 9, OAK);
      c.row(b - 4, 3, 8, D(OAK));
      c.rect(3, b - 21, 8, b - 11, STONEW);
      c.col(3, b - 21, b - 11, L(STONEW));
      c.row(b - 22, 4, 7, D(STONEW));
      c.rect(5, b - 23, 6, b - 23, D(STONEW));
      c.row(b - 19, 3, 8, DELFT);
      c.row(b - 13, 3, 8, DELFT);
      c.rect(9, b - 12, 10, b - 12, BR);
      c.set(10, b - 13, D(BR));
      if (u) {
        c.col(10, b - 11, b - 1, C.glassLight);
        dots(c, hex('#6f8f98'), [10, b - 8, 10, b - 4]);
        puddle(c, 8, 11, b, hex('#6f8f98'));
      }
    },
  });

  /* ---------- machines of the trade ---------- */
  add('apoth-drug-mill-crank', 'apothecary drug mill iron grinder crank flywheel hopper powder drawer', {
    w: 18, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, b - 8, 13, b, OAK);
      if (!u) drawer(c, 5, b - 6, 11, b - 2, OAK);
      else pull(c, 5, b - 6, 11, b - 4, OAK, CHINA);
      c.poly([[4, b - 19], [12, b - 19], [10, b - 14], [6, b - 14]], C.iron);
      c.row(b - 19, 4, 12, C.steel);
      c.rect(6, b - 13, 10, b - 9, C.ironDark);
      c.col(6, b - 13, b - 9, C.iron);
      c.rect(14, b - 20, 15, b - 6, C.ironDark); // the flywheel, edge on
      c.col(14, b - 19, b - 7, C.iron);
      c.row(b - 13, 11, 13, C.iron);
      if (!u) c.rect(16, b - 18, 16, b - 17, PINE);
      else {
        c.rect(16, b - 9, 16, b - 8, PINE);
        dots(c, DRIED, [6, b - 20, 8, b - 20, 9, b - 21, 10, b - 20]);
        dots(c, CHINA, [3, b, 4, b]);
      }
    },
    sw: 18, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      face(c, 4, b - 8, 13, b, OAK);
      c.poly([[5, b - 19], [12, b - 19], [10, b - 14], [7, b - 14]], C.iron);
      c.row(b - 19, 5, 12, C.steel);
      c.rect(7, b - 13, 10, b - 9, C.ironDark);
      cartWheel(c, 9, b - 13, 7, C.iron, C.ironDark);
      if (!u) c.rect(8, b - 19, 9, b - 18, PINE);
      else {
        c.rect(14, b - 12, 15, b - 11, PINE);
        pullS(c, 14, b - 6, b - 3, 2, OAK, CHINA);
        dots(c, DRIED, [7, b - 20, 9, b - 21, 10, b - 20]);
      }
    },
    u: [0, 2, 0], su: [0, 2, 3],
  });

  add('apoth-pill-machine-table', 'apothecary pill machine roller board brass grooves pill tile table making pills', {
    w: 22, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 11, 20, b - 10, MAH);
      legs(c, [2, 18], b - 9, b, MAH);
      drawer(c, 6, b - 9, 15, b - 7, MAH);
      c.rect(2, b - 13, 11, b - 12, MAH); // the board with its brass grooves
      for (let x = 3; x <= 10; x++) c.set(x, b - 13, x % 2 ? BR : D(BR));
      c.rect(14, b - 12, 19, b - 12, CHINA); // the pill tile
      dots(c, DELFT, [15, b - 12, 17, b - 12]);
      if (!u) {
        c.rect(3, b - 15, 10, b - 14, OAK); // the roller laid on
        c.row(b - 14, 4, 9, BR);
        dots(c, OAK, [2, b - 15, 11, b - 15]);
        c.rect(13, b - 14, 14, b - 13, DRIED); // the pill mass
      } else {
        c.line(1, b - 14, 8, b - 17, OAK); // the roller put by
        c.line(2, b - 13, 9, b - 16, BR);
        for (let x = 14; x <= 19; x++) c.set(x, b - 13, x % 2 ? DRIED : null);
        dots(c, DRIED, [4, b - 14, 6, b - 14, 8, b - 14, 10, b - 14, 12, b - 12, 13, b - 12]);
        dots(c, DRIED, [9, b, 14, b, 16, b - 1 + 1]); // and some on the floor
      }
    },
    sw: 13, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 11, 11, b - 10, MAH);
      legs(c, [2, 9], b - 9, b, MAH);
      c.row(b - 9, 4, 8, D(MAH));
      c.rect(3, b - 13, 9, b - 12, MAH);
      c.row(b - 13, 4, 8, BR);
      if (!u) {
        c.rect(5, b - 15, 7, b - 14, OAK);
        c.set(6, b - 14, BR);
      } else {
        c.line(3, b - 14, 4, b - 17, OAK);
        dots(c, DRIED, [6, b - 14, 8, b - 14, 10, b - 12, 5, b, 8, b]);
      }
    },
    u: [0, 1, 0], su: [0, 1, 0],
  });

  const percolator = (rodX) => (c, u) => {
    const b = c.h - 2;
    c.col(rodX, 2, b - 1, C.iron);
    c.rect(2, b, 9, b, C.ironDark);
    c.row(5, Math.min(rodX, 4), Math.max(rodX, 8), C.iron);
    c.poly([[4, 6], [9, 6], [7, 15], [6, 15]], C.glass);
    c.col(4, 6, 8, C.glassLight);
    c.row(6, 4, 9, C.glassLight);
    c.rect(5, 7, 8, 9, hex('#5a4630')); // the drug packed in it
    c.row(10, 6, 7, hex('#5a4630'));
    c.rect(6, 16, 7, 17, C.glass);
    c.rect(6, b - 10, 7, b - 8, C.glass);
    c.oval(4, b - 8, 9, b - 1, C.glass);
    c.set(5, b - 6, C.glassLight);
    if (u) {
      c.rect(6, 11, 7, 14, AMBER);
      c.set(6, b - 12, AMBER); // a drop falling
      c.rect(5, b - 4, 8, b - 2, AMBER);
      c.row(b - 1, 6, 7, D(AMBER));
      c.row(b - 5, 5, 8, L(AMBER));
      c.row(7, 5, 8, hex('#3a2a1a'));
    }
  };
  add('apoth-percolator-stand', 'apothecary percolator glass funnel flask iron retort stand tincture dripping', {
    w: 12, h: 30,
    f: percolator(3),
    sw: 12, sh: 30,
    s: percolator(6),
  });

  add('apoth-leech-jar-pedestal', 'apothecary leech jar china urn on a marble pedestal blue gilt leeches lid', {
    w: 10, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 11, 6, b - 1, MARB);
      c.col(3, b - 11, b - 1, L(MARB));
      c.col(6, b - 11, b - 1, D(MARB));
      c.row(b - 12, 2, 7, MARB);
      c.row(b, 2, 7, D(MARB));
      c.oval(1, b - 22, 8, b - 13, CHINA);
      c.row(b - 13, 3, 6, D(CHINA));
      c.row(b - 19, 1, 8, DELFT);
      c.row(b - 16, 1, 8, DELFT);
      dots(c, GILT, [2, b - 18, 3, b - 17, 4, b - 18, 5, b - 17, 6, b - 18, 7, b - 17]);
      if (!u) {
        c.rect(3, b - 24, 6, b - 23, CHINA);
        c.row(b - 25, 4, 5, DELFT);
        dots(c, K, [4, b - 23]);
      } else {
        c.row(b - 22, 3, 6, K); // open
        c.rect(6, b - 1, 9, b, CHINA); // the lid by the foot
        c.row(b - 2, 7, 8, DELFT);
        const LEECH = hex('#2a2620');
        dots(c, LEECH, [2, b - 21, 2, b - 20, 5, b - 23, 6, b - 22, 7, b - 15, 7, b - 14, 4, b - 12, 4, b - 11, 4, b - 10, 5, b - 6, 5, b - 5, 3, b - 3, 2, b]);
        dots(c, hex('#5a3a30'), [2, b - 19, 7, b - 13, 4, b - 9, 5, b - 4]);
      }
    },
  });

  /* ---------- the doctor's corner ---------- */
  add('apoth-examination-couch', 'apothecary examination couch leather surgery table doctor patient straps bloodletting', {
    w: 38, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [4, 32]) tleg(c, x, b - 5, b, MAH);
      board(c, 2, b - 7, 35, b - 6, MAH);
      c.rect(2, b - 10, 35, b - 8, LEATHER);
      c.row(b - 10, 10, 35, L(LEATHER));
      for (let x = 13; x < 35; x += 4) c.set(x, b - 9, D(LEATHER));
      c.poly([[2, b - 10], [11, b - 10], [9, b - 16], [3, b - 17]], LEATHER); // the raised head
      c.line(3, b - 17, 9, b - 16, L(LEATHER));
      dots(c, BR, [3, b - 8, 6, b - 8, 9, b - 8]);
      if (!u) {
        c.rect(4, b - 15, 8, b - 13, C.white);
        c.row(b - 15, 4, 8, L(C.white));
      } else {
        c.poly([[10, b - 11], [30, b - 11], [31, b - 5], [12, b - 6]], C.white); // a sheet, and what has soaked through it
        c.row(b - 11, 10, 30, L(C.white));
        dots(c, D(C.white), [14, b - 8, 22, b - 7, 27, b - 9]);
        c.rect(17, b - 10, 21, b - 8, C.blood);
        dots(c, C.blood, [16, b - 9, 22, b - 9, 19, b - 7, 19, b - 6, 20, b - 3, 19, b]);
        c.rect(4, b - 15, 8, b - 13, C.white);
        c.set(6, b - 14, C.blood);
        c.col(33, b - 7, b - 3, hex('#6a4a32')); // a strap undone
        c.set(33, b - 2, BR);
      }
    },
    sw: 18, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 14, 9, LEATHER); // the raised head at the far end
      c.row(2, 3, 14, L(LEATHER));
      c.row(9, 3, 14, D(LEATHER));
      c.rect(5, 3, 12, 6, C.white);
      c.rect(2, 10, 15, b - 9, LEATHER);
      c.col(2, 10, b - 9, L(LEATHER));
      for (let y = 12; y < b - 9; y += 4) dots(c, D(LEATHER), [5, y, 9, y + 2, 12, y]);
      c.rect(2, b - 8, 15, b - 7, D(LEATHER));
      board(c, 2, b - 6, 15, b - 5, MAH);
      for (const x of [3, 14]) tleg(c, x, b - 4, b, MAH);
      if (u) {
        c.rect(3, 12, 14, b - 8, C.white);
        c.row(12, 3, 14, L(C.white));
        dots(c, D(C.white), [5, 15, 11, 17, 6, 20]);
        c.rect(7, 14, 10, 18, C.blood);
        dots(c, C.blood, [6, 16, 11, 15, 9, 19, 8, 21, 8, b - 3, 9, b]);
        c.set(8, 4, C.blood);
        c.col(1, b - 8, b - 4, hex('#6a4a32'));
        c.set(1, b - 3, BR);
      }
    },
    base: 'side',
  });

  add('apoth-dentist-chair-old', 'apothecary dentist chair old velvet iron pedestal headrest tooth pulling barber surgeon', {
    w: 16, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, b - 1, 11, b, C.ironDark);
      c.row(b - 1, 4, 11, C.iron);
      c.rect(7, b - 6, 8, b - 2, C.iron);
      c.row(b - 4, 3, 12, C.ironDark); // foot rest
      face(c, 4, b - 21, 11, b - 11, MAH);
      c.rect(5, b - 20, 10, b - 12, WINE);
      dots(c, D(WINE), [6, b - 18, 9, b - 18, 6, b - 15, 9, b - 15]);
      c.rect(7, b - 23, 8, b - 22, C.iron);
      c.rect(5, b - 26, 10, b - 24, LEATHER);
      c.row(b - 26, 5, 10, L(LEATHER));
      c.rect(3, b - 10, 12, b - 7, WINE);
      c.row(b - 10, 3, 12, L(WINE));
      c.row(b - 7, 3, 12, D(MAH));
      for (const x of [2, 12]) {
        c.rect(x, b - 14, x + 1, b - 13, MAH);
        c.col(x + (x < 8 ? 0 : 1), b - 12, b - 8, MAH);
      }
      if (u) {
        dots(c, C.blood, [7, b - 25, 8, b - 24, 8, b - 19, 7, b - 17, 8, b - 16, 6, b - 9, 7, b - 9, 9, b - 8, 9, b - 3, 10, b]);
        c.set(5, b - 9, C.white); // a tooth
        c.rect(12, b - 15, 13, b - 15, C.steel); // the forceps left on the arm
        c.set(14, b - 16, C.steel);
        c.col(1, b - 12, b - 9, hex('#6a4a32')); // a wrist strap
        c.set(1, b - 8, BR);
      }
    },
    sw: 19, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, b - 1, 13, b, C.ironDark);
      c.row(b - 1, 5, 13, C.iron);
      c.rect(8, b - 6, 9, b - 2, C.iron);
      c.rect(5, b - 10, 13, b - 8, WINE);
      c.row(b - 10, 5, 13, L(WINE));
      c.row(b - 7, 5, 13, D(MAH));
      c.poly([[5, b - 11], [7, b - 11], [5, b - 21], [3, b - 21]], WINE); // the back, leaning
      c.line(3, b - 21, 5, b - 11, MAH);
      c.set(3, b - 22, C.iron);
      c.rect(2, b - 26, 4, b - 23, LEATHER);
      c.col(2, b - 26, b - 23, L(LEATHER));
      c.row(b - 14, 6, 12, MAH);
      c.col(12, b - 13, b - 11, MAH);
      c.line(13, b - 7, 16, b - 3, C.iron);
      c.row(b - 3, 15, 17, C.ironDark);
      if (u) {
        dots(c, C.blood, [4, b - 24, 5, b - 18, 6, b - 15, 9, b - 11, 11, b - 9, 14, b - 5, 15, b]);
        c.set(8, b - 11, C.white);
        c.rect(9, b - 15, 11, b - 15, C.steel);
        c.col(7, b - 13, b - 11, hex('#6a4a32'));
      }
    },
  });

  add('apoth-stool-high-chemist', 'apothecary high stool chemist round seat wooden three legs counter stool', {
    w: 10, h: 18,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.rect(1, b - 14, 8, b - 13, MAH);
        c.row(b - 14, 1, 8, L(MAH));
        c.line(2, b - 12, 1, b, MAH);
        c.line(7, b - 12, 8, b, D(MAH));
        c.col(4, b - 12, b - 1, D(MAH));
        c.row(b - 5, 2, 7, MAH);
      } else {
        const m = c.h - 2; // on its side
        c.rect(1, m - 7, 2, m, MAH);
        c.col(1, m - 7, m, L(MAH));
        c.line(3, m - 6, 15, m - 8, MAH);
        c.line(3, m - 1, 15, m, D(MAH));
        c.row(m - 4, 3, 14, D(MAH));
        c.col(10, m - 7, m - 1, MAH);
      }
    },
    us: [18, 11],
    sw: 10, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.rect(1, b - 14, 8, b - 13, MAH);
        c.row(b - 14, 1, 8, L(MAH));
        c.line(2, b - 12, 1, b, MAH);
        c.line(7, b - 12, 8, b, D(MAH));
        c.col(5, b - 12, b - 1, D(MAH));
        c.row(b - 5, 2, 7, MAH);
      } else {
        c.oval(1, 1, 8, 8, MAH); // fallen towards us: the round seat, the legs behind
        c.oval(2, 2, 7, 7, L(MAH));
        c.oval(3, 3, 7, 7, MAH);
        dots(c, D(MAH), [1, 0, 8, 0, 4, 9]);
      }
    },
    sus: [10, 11],
  });

  add('apoth-display-case-glass', 'apothecary glass display case counter false teeth glass eyes spectacles trusses shop', {
    w: 28, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 9, 25, b, MAH);
      panel(c, 4, b - 7, 12, b - 2, MAH);
      panel(c, 15, b - 7, 23, b - 2, MAH);
      c.rect(1, b - 10, 26, b - 10, L(MAH));
      c.rect(2, b - 20, 25, b - 11, hex('#39474c'));
      c.frame(2, b - 20, 25, b - 11, BR);
      c.col(13, b - 20, b - 11, BR);
      c.row(b - 15, 3, 24, C.glassLight);
      /* upper shelf: spectacles, glass eyes; lower: false teeth, forceps, soap */
      dots(c, C.steel, [4, b - 17, 5, b - 16, 6, b - 17, 7, b - 17, 8, b - 16, 9, b - 17]);
      if (!u) {
        dots(c, CHINA, [16, b - 16, 19, b - 16, 22, b - 16]);
        dots(c, BLUE, [16, b - 17, 22, b - 17]);
        dots(c, K, [19, b - 17]);
        c.rect(16, b - 13, 20, b - 12, CHINA);
        c.row(b - 13, 16, 20, hex('#a86a6a'));
      }
      c.rect(4, b - 13, 6, b - 12, hex('#b8a878'));
      c.rect(8, b - 13, 10, b - 12, hex('#9a8a9a'));
      dots(c, C.steel, [22, b - 12, 23, b - 13]);
      for (let i = 0; i < 4; i++) c.set(4 + i, b - 12 - i - 5 + 4, null);
      if (u) {
        c.poly([[15, b - 18], [20, b - 19], [23, b - 15], [21, b - 12], [16, b - 13], [14, b - 16]], hex('#1c2226')); // the pane put in
        dots(c, C.glassLight, [14, b - 18, 21, b - 20 + 1, 23, b - 13, 15, b - 12]);
        c.set(18, b - 12, CHINA);
        shards(c, 12, 24, b, C.glassLight, 9);
        c.set(17, b, CHINA);
      }
    },
    sw: 12, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, b - 9, 9, b, MAH);
      c.rect(1, b - 10, 10, b - 10, L(MAH));
      c.rect(2, b - 20, 9, b - 11, hex('#39474c'));
      c.frame(2, b - 20, 9, b - 11, BR);
      c.row(b - 15, 3, 8, C.glassLight);
      c.rect(4, b - 13, 6, b - 12, hex('#9a8a9a'));
      dots(c, C.steel, [5, b - 17, 6, b - 16, 7, b - 17]);
      if (u) {
        shards(c, 10, 13, b, C.glassLight, 9);
        dots(c, C.glassLight, [10, b - 14, 11, b]);
        c.col(9, b - 18, b - 13, hex('#1c2226'));
      }
    },
    su: [0, 0, 4],
  });

  add('apoth-person-scale-dial', 'apothecary weighing scale person dial platform iron column penny weight machine', {
    w: 14, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 2, 11, b, C.ironDark);
      c.row(b - 2, 2, 11, C.steel);
      c.rect(6, 9, 7, b - 3, C.ironDark);
      c.col(6, 9, b - 3, C.iron);
      dots(c, BR, [6, 14, 7, 14, 6, 22, 7, 22]);
      c.oval(2, 1, 11, 9, BR);
      c.oval(3, 2, 10, 8, CHINA);
      dots(c, C.slate, [4, 4, 6, 3, 8, 3, 9, 5]);
      c.set(6, 6, K);
      if (!u) c.line(6, 6, 4, 4, K);
      else {
        c.line(6, 6, 9, 5, RED); // the needle hard over
        dots(c, C.blood, [4, b - 2, 5, b - 2, 4, b - 3, 8, b - 2, 9, b - 2, 9, b - 3]); // and two wet prints on the plate
        c.rect(9, 11, 10, 13, C.paper); // a ticket in the slot
      }
      c.rect(8, 11, 8, 12, BR);
    },
    sw: 12, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 2, 10, b, C.ironDark);
      c.row(b - 2, 1, 10, C.steel);
      c.rect(2, 9, 3, b - 3, C.ironDark);
      c.col(2, 9, b - 3, C.iron);
      dots(c, BR, [2, 14, 3, 14, 2, 22, 3, 22]);
      c.rect(1, 1, 4, 9, BR);
      c.col(1, 1, 9, L(BR));
      c.col(5, 2, 8, CHINA);
      if (u) {
        dots(c, C.blood, [5, b - 2, 6, b - 2, 7, b - 2, 6, b - 3]);
        c.rect(4, 11, 5, 12, C.paper);
        c.set(5, 5, RED);
      }
    },
  });

  add('apoth-bookcase-pharmacopoeia', 'apothecary bookcase pharmacopoeia herbals old books formulary shelves library', {
    w: 24, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 3, 20, b - 2, mix(OAK, 0.42));
      face(c, 1, 3, 2, b, OAK);
      face(c, 21, 3, 22, b, OAK);
      board(c, 1, 1, 22, 2, OAK);
      c.rect(1, b - 1, 22, b, OAK);
      c.row(b - 1, 1, 22, L(OAK));
      let k = 0;
      for (const y of [10, 18, 26, b - 2]) {
        c.row(y, 3, 20, L(OAK));
        books(c, 3, 20, y - 1, 3 + k, 6, (i) => u && ((k === 1 && i > 4 && i < 9) || (k === 2 && i === 2)));
        k++;
      }
      if (u) {
        c.poly([[11, 17], [14, 17], [16, 13], [14, 12]], C.wine); // one fallen across the gap
        c.rect(7, b - 1, 14, b, C.paper); // and one lying open on the floor
        c.col(10, b - 1, b, D(C.paper));
        c.row(b, 7, 14, C.navy);
        dots(c, C.slate, [8, b - 1, 12, b - 1]);
      }
    },
    sw: 10, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 1, 8, 2, OAK);
      cabSide(c, 2, 3, 7, b - 2, OAK);
      c.rect(1, b - 1, 8, b, OAK);
      c.row(b - 1, 1, 8, L(OAK));
      if (u) {
        c.rect(9, b - 1, 12, b - 1, C.paper);
        c.row(b, 9, 12, C.navy);
        c.set(10, b - 2, C.paper);
      }
    },
    su: [0, 0, 4],
  });

  add('apoth-wheelchair-wicker', 'apothecary bath chair wicker wheelchair invalid carriage three wheels old', {
    w: 25, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[5, b - 22], [8, b - 22], [9, b - 9], [6, b - 9]], hex('#8a6a3a'));
      wicker(c, 6, b - 13, 17, b - 9);
      c.poly([[5, b - 22], [8, b - 22], [9, b - 13], [6, b - 13]], hex('#8a6a3a'));
      for (let y = b - 21; y < b - 13; y += 2) c.set(6 + ((y - b + 21) >> 3), y, D(hex('#8a6a3a')));
      c.line(5, b - 22, 6, b - 13, hex('#a8844c'));
      c.row(b - 16, 8, 15, hex('#a8844c')); // arm
      c.col(15, b - 15, b - 14, hex('#8a6a3a'));
      c.rect(2, b - 21, 4, b - 21, EB); // the push handle
      c.line(17, b - 9, 21, b - 5, C.iron);
      c.rect(19, b - 5, 22, b - 5, OAK);
      c.col(20, b - 4, b - 3, C.iron);
      c.line(19, b - 12, 22, b - 20, C.iron); // the tiller
      c.set(22, b - 21, EB);
      cartWheel(c, 9, b - 7, 7, C.ironDark, C.iron);
      cartWheel(c, 20, b - 2, 2, C.ironDark);
      if (u) {
        const PLAID = hex('#5a5236');
        c.poly([[9, b - 15], [16, b - 15], [18, b - 6], [12, b - 5], [9, b - 9]], PLAID); // the rug left in it, sliding out
        c.row(b - 15, 9, 16, L(PLAID));
        for (let y = b - 13; y < b - 5; y += 3) c.row(y, 10, 16, MADDER);
        c.col(13, b - 14, b - 6, D(PLAID));
      }
    },
    sw: 20, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 1, b - 14, b, C.ironDark, 2);
      wheelEdge(c, 16, b - 14, b, C.ironDark, 2);
      wicker(c, 4, b - 22, 14, b - 11);
      c.row(b - 22, 5, 13, hex('#a8844c'));
      c.clear(4, b - 22);
      c.clear(14, b - 22);
      wicker(c, 3, b - 16, 4, b - 9);
      wicker(c, 14, b - 16, 15, b - 9);
      c.row(b - 16, 3, 4, hex('#a8844c'));
      c.row(b - 16, 14, 15, hex('#a8844c'));
      c.rect(5, b - 11, 13, b - 9, hex('#6a5a36')); // the cushion
      c.row(b - 11, 5, 13, hex('#8a784a'));
      c.rect(5, b - 8, 13, b - 7, D(hex('#8a6a3a')));
      c.rect(6, b - 5, 12, b - 5, OAK);
      c.col(9, b - 21, b - 13, C.iron); // the tiller comes up in front
      c.set(9, b - 22, EB);
      c.rect(9, b - 4, 9, b - 1, C.iron);
      c.rect(8, b - 3, 10, b, C.ironDark);
      c.row(b - 7, 3, 15, C.iron);
      if (u) {
        const PLAID = hex('#5a5236');
        c.poly([[5, b - 14], [13, b - 14], [14, b - 4], [7, b - 5]], PLAID);
        c.row(b - 14, 5, 13, L(PLAID));
        for (let y = b - 12; y < b - 4; y += 3) c.row(y, 6, 13, MADDER);
        c.col(10, b - 13, b - 5, D(PLAID));
      }
    },
    base: 'side',
  });

  add('apoth-crutch-rack', 'apothecary rack of crutches wooden leg peg leg walking sticks surgical appliances', {
    w: 15, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 5, 13, 6, MAH);
      face(c, 1, b - 3, 13, b, MAH);
      c.col(1, 7, b - 4, D(MAH));
      c.col(13, 7, b - 4, D(MAH));
      const crutch = (x) => {
        c.col(x, 4, b - 4, PINE);
        c.row(3, x - 1, x + 1, LEATHER);
        c.set(x + 1, 14, D(PINE));
        c.set(x, 4, L(PINE));
      };
      crutch(4);
      if (!u) crutch(7);
      c.rect(10, 18, 11, 22, LEATHER); // a wooden leg
      c.row(18, 9, 12, L(LEATHER));
      dots(c, BR, [10, 20, 11, 21]);
      c.col(10, 23, b - 4, PINE);
      c.col(11, 23, 26, PINE);
      if (u) {
        c.row(b + 1 - 1, 2, 12, PINE); // the other crutch thrown down
        c.rect(13, b - 1, 13, b, LEATHER);
      }
    },
    sw: 8, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 4, 6, MAH);
      c.set(2, 5, L(MAH));
      face(c, 2, b - 3, 5, b, MAH);
      c.col(2, 7, b - 4, D(MAH));
      c.col(4, 4, b - 4, PINE);
      c.rect(3, 3, 5, 3, LEATHER);
      c.set(5, 14, D(PINE));
      if (u) {
        c.rect(6, b - 1, 7, b, LEATHER);
        c.set(6, b - 2, LEATHER);
        c.row(b, 8, 9, PINE);
      }
    },
    su: [0, 0, 3],
  });

  add('apoth-phrenology-head-stand', 'apothecary phrenology head china bust on a stand skull map faculties cracked', {
    w: 10, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 11, 6, b - 1, MAH);
      c.col(3, b - 11, b - 1, L(MAH));
      c.rect(2, b, 7, b, D(MAH));
      c.row(b - 12, 2, 7, L(MAH));
      c.oval(2, b - 22, 7, b - 15, CHINA);
      c.rect(3, b - 15, 6, b - 13, CHINA);
      c.row(b - 13, 2, 7, D(CHINA));
      dots(c, DELFT, [2, b - 19, 3, b - 19, 4, b - 20, 5, b - 19, 6, b - 19, 7, b - 19, 4, b - 21, 4, b - 22, 6, b - 21]);
      dots(c, K, [3, b - 17, 6, b - 17]);
      c.set(4, b - 15, D(CHINA));
      if (u) {
        c.clearRect(5, b - 23, 7, b - 20); // a piece knocked out of the crown
        dots(c, K, [5, b - 19, 4, b - 18, 5, b - 17, 5, b - 16]);
        dots(c, hex('#3a3440'), [5, b - 20, 6, b - 20]);
        shards(c, 5, 9, b, CHINA, 3);
        c.set(8, b, DELFT);
      }
    },
    sw: 11, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 11, 6, b - 1, MAH);
      c.col(3, b - 11, b - 1, L(MAH));
      c.rect(2, b, 7, b, D(MAH));
      c.row(b - 12, 2, 7, L(MAH));
      c.oval(2, b - 22, 8, b - 15, CHINA);
      c.rect(4, b - 15, 6, b - 13, CHINA);
      c.set(9, b - 17, CHINA); // the nose
      c.set(8, b - 15, CHINA);
      c.row(b - 13, 2, 7, D(CHINA));
      dots(c, DELFT, [3, b - 19, 4, b - 20, 5, b - 19, 6, b - 20, 5, b - 21, 3, b - 21]);
      c.set(7, b - 18, K);
      if (u) {
        c.clearRect(2, b - 23, 4, b - 20);
        dots(c, K, [4, b - 19, 5, b - 18, 4, b - 17]);
        dots(c, hex('#3a3440'), [4, b - 20]);
        shards(c, 7, 9, b, CHINA, 3);
      }
    },
  });

  add('apoth-wax-torso-anatomical', 'apothecary wax anatomical torso model organs removable venus medical teaching figure', {
    w: 14, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 8, 11, b, EB);
      c.row(b - 9, 1, 12, L(EB));
      c.rect(5, b - 5, 8, b - 4, C.paper);
      c.oval(5, b - 27, 8, b - 22, WAX);
      dots(c, K, [5, b - 25, 8, b - 25]);
      c.rect(6, b - 22, 7, b - 21, D(WAX));
      c.rect(2, b - 20, 11, b - 18, WAX);
      c.rect(3, b - 18, 10, b - 10, WAX);
      c.col(3, b - 18, b - 10, L(WAX));
      c.row(b - 20, 3, 10, L(WAX));
      dots(c, D(WAX), [2, b - 18, 11, b - 18]);
      if (!u) {
        c.rect(5, b - 18, 8, b - 16, hex('#a86a6a')); // lungs, heart, liver, the rest
        c.set(7, b - 17, RED);
        c.rect(5, b - 15, 8, b - 14, hex('#6a2f2a'));
        c.rect(5, b - 13, 8, b - 11, hex('#b8876a'));
        dots(c, hex('#8a5a4a'), [6, b - 12, 8, b - 13, 5, b - 11]);
      } else {
        hollow(c, 5, b - 18, 8, b - 11, hex('#6a2f2a'));
        c.rect(1, b - 11, 3, b - 10, hex('#a86a6a')); // laid out on the plinth
        c.set(2, b - 11, RED);
        c.rect(10, b - 11, 12, b - 10, hex('#6a2f2a'));
        dots(c, hex('#b8876a'), [5, b, 6, b, 7, b - 1, 8, b, 9, b]); // and on the floor
        c.set(4, b, C.blood);
      }
    },
    sw: 11, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, b - 8, 8, b, EB, false);
      c.row(b - 9, 1, 9, L(EB));
      c.oval(3, b - 27, 7, b - 22, WAX);
      c.set(7, b - 25, K);
      c.set(8, b - 24, WAX);
      c.rect(4, b - 22, 5, b - 21, D(WAX));
      c.rect(3, b - 20, 7, b - 10, WAX);
      c.col(3, b - 20, b - 10, L(WAX));
      c.set(8, b - 17, WAX);
      if (!u) {
        c.col(7, b - 18, b - 16, hex('#a86a6a'));
        c.col(7, b - 15, b - 14, hex('#6a2f2a'));
        c.col(7, b - 13, b - 11, hex('#b8876a'));
        c.col(8, b - 14, b - 12, hex('#b8876a'));
      } else {
        c.col(7, b - 18, b - 11, mix(hex('#6a2f2a'), 0.4));
        c.rect(8, b - 11, 9, b - 10, hex('#6a2f2a'));
        dots(c, hex('#b8876a'), [9, b, 10, b]);
      }
    },
    su: [0, 0, 2],
  });
};
