/* Gothic, part 5: doors and stairs, the monks' side of the abbey, more of the churchyard.
 * Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix } = kit;
  const { D, L, dots, board, face, stones, wisp, chain, candle, archPt, heap, rope } = H;
  const add = H.reg('env-gothic', 'Gothic');
  const { WAX, EBONY, BLACKW, GSTONE, GDARK, PALL, WAT, SHROUD, HEMP, DEADF } = H.MED;
  const IRON = C.iron,
    BRASS = C.brass,
    GOLD = C.gold,
    RUBY = hex('#7a2c34'),
    COFFIN = hex('#4a3226'),
    VOID = hex('#141218'),
    BOOK = hex('#4a2626'),
    MARBLE = hex('#a4a2a0'),
    BARK = hex('#4a3a34'),
    BOWL = hex('#6a5038'),
    HABIT = hex('#3a3030'),
    BRONZE = hex('#6a5a3a'),
    VERD = hex('#4a6a5a');

  add('gothic-vestry-door-pointed', 'vestry door pointed arch oak iron hinges church sacristy stone doorway', {
    w: 22, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      archPt(c, 1, 1, 20, b, GSTONE, 11);
      for (let y = 1; y < 13; y++) for (let x = 1; x <= 10; x++) if (c.get(x, y) && !c.get(x - 1, y)) c.set(x, y, L(GSTONE));
      c.col(1, 12, b, L(GSTONE));
      for (let y = 15; y < b; y += 6) {
        c.row(y, 1, 3, D(GSTONE));
        c.row(y + 3, 18, 20, D(GSTONE));
      }
      archPt(c, 4, 5, 17, b, u ? VOID : BLACKW, 9);
      if (!u) {
        for (let x = 6; x <= 16; x += 3) for (let y = 6; y <= b; y++) if (c.get(x, y) === BLACKW) c.set(x, y, EBONY);
        for (const y of [14, 32]) {
          c.row(y, 4, 13, IRON); // the hinges, with their curls
          c.set(13, y - 1, IRON);
          c.set(13, y + 1, IRON);
          c.set(9, y - 1, IRON);
          c.set(9, y + 1, IRON);
          c.set(5, y, L(IRON));
        }
        c.rect(14, 23, 15, 25, IRON);
        c.set(14, 24, K);
      } else {
        c.col(4, 8, b, BLACKW); // open: the leaf edge on, and a stair turning up into the dark
        c.col(5, 10, b, EBONY);
        for (let i = 0; i < 5; i++) c.row(b - i * 3, 7 + i, 16, mix(GSTONE, 0.55 - i * 0.07));
        for (let i = 0; i < 5; i++) c.row(b - i * 3 - 1, 7 + i, 16, mix(GSTONE, 0.4 - i * 0.05));
        c.set(12, 17, C.glow);
        c.set(13, 18, D(C.glow));
        dots(c, WAT, [8, b, 11, b - 3]);
      }
      dots(c, C.moss, [2, b, 19, b - 1]);
    },
    sw: 8, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 1, 5, b, GSTONE, 6, 5, 4);
      c.col(2, 1, b, L(GSTONE));
      if (!u) c.col(6, 6, b, BLACKW);
      else {
        face(c, 6, 6, 12, b, BLACKW);
        for (const x of [8, 10]) c.col(x, 7, b, EBONY);
        for (const y of [14, 32]) c.row(y, 6, 10, IRON);
        c.set(11, 24, IRON);
      }
    },
    su: [0, 0, 6],
  });
  add('gothic-crypt-stair-slab', 'crypt stair slab floor trapdoor stone ring vault entrance steps down tomb', {
    w: 26, h: 14, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 9, 24, b, GSTONE); // the kerb round the opening
      c.row(b - 9, 1, 24, L(GSTONE));
      c.col(1, b - 9, b, L(GSTONE));
      c.row(b, 1, 24, D(GSTONE));
      if (!u) {
        c.rect(3, b - 7, 22, b - 2, MARBLE); // the slab in place
        c.row(b - 7, 3, 22, L(MARBLE));
        c.row(b - 2, 3, 22, GSTONE);
        c.rect(12, b - 6, 13, b - 3, GSTONE);
        c.rect(10, b - 5, 15, b - 5, GSTONE);
        c.rect(18, b - 5, 20, b - 4, IRON);
        c.set(19, b - 4, MARBLE);
        dots(c, C.moss, [4, b - 2, 5, b - 3, 21, b - 6]);
      } else {
        c.rect(3, b - 7, 22, b - 2, VOID);
        for (let i = 0; i < 3; i++) {
          c.row(b - 2 - i * 2, 5 + i * 2, 20 - i * 2, mix(GSTONE, 0.6 - i * 0.14)); // steps down
        }
        c.set(12, b - 6, D(C.glow));
        c.rect(3, 1, 22, b - 10, MARBLE); // the slab stood against the wall
        c.row(1, 3, 22, L(MARBLE));
        c.col(3, 1, b - 10, L(MARBLE));
        c.col(22, 1, b - 10, GSTONE);
        c.rect(12, 3, 13, b - 12, GSTONE);
        c.rect(9, 6, 16, 6, GSTONE);
        c.rect(18, 4, 20, 5, IRON);
        dots(c, C.moss, [4, b - 11, 5, b - 12]);
        dots(c, GSTONE, [2, b - 10, 23, b - 10]);
      }
    },
    us: [26, 26],
    sw: 14, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 9, 12, b, GSTONE);
      c.row(b - 9, 1, 12, L(GSTONE));
      c.col(1, b - 9, b, L(GSTONE));
      c.row(b, 1, 12, D(GSTONE));
      if (!u) {
        c.rect(3, b - 7, 10, b - 2, MARBLE);
        c.row(b - 7, 3, 10, L(MARBLE));
        c.rect(6, b - 5, 7, b - 4, IRON);
      } else {
        c.rect(3, b - 7, 10, b - 2, VOID);
        c.row(b - 2, 4, 9, mix(GSTONE, 0.6));
        c.row(b - 4, 6, 9, mix(GSTONE, 0.45));
        c.line(2, b - 10, 5, 1, MARBLE);
        c.line(3, b - 10, 6, 1, L(MARBLE));
        c.line(4, b - 10, 7, 1, GSTONE);
      }
    },
    sus: [14, 26],
  });
  add('gothic-refectory-table-monks', 'refectory table monks long dining bowls bread jug abbey frater plain oak', {
    w: 44, h: 19, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [5, 21, 37]) {
        c.rect(x, 10, x + 1, b, EBONY);
        c.col(x, 10, b, BLACKW);
      }
      c.row(b - 3, 7, 36, EBONY);
      c.rect(1, 6, 42, 8, BARK);
      c.row(6, 1, 42, L(BARK));
      board(c, 1, 9, 42, 9, EBONY);
      for (let i = 0; i < 5; i++) {
        const x = 4 + i * 8;
        if (u && i === 3) {
          c.rect(x, 5, x + 3, 6, BOWL); // turned over
          c.row(5, x + 1, x + 2, L(BOWL));
          dots(c, hex('#8a8a54'), [x + 4, 7, x + 5, 7, x + 5, 8, x + 5, 10, x + 5, 12]);
          continue;
        }
        c.rect(x, 5, x + 3, 6, BOWL);
        c.row(4, x, x + 3, u ? hex('#8a8a54') : VOID);
        c.set(x, 4, L(BOWL));
        c.set(x + 3, 4, BOWL);
        c.set(x + 5, 6, hex('#8a6a44')); // spoon
        c.set(x + 5, 7, hex('#8a6a44'));
      }
      c.rect(40, 2, 41, 6, BOWL); // the jug
      c.set(39, 3, BOWL);
      c.set(40, 2, L(BOWL));
      if (!u) {
        c.oval(17, 4, 21, 6, hex('#8a6a44')); // one loaf between them all
        c.row(4, 18, 20, L(hex('#8a6a44')));
      } else {
        dots(c, hex('#8a6a44'), [17, 6, 19, 6, 20, 5, 22, 7]);
        c.set(25, 5, BRASS);
        candle(c, 25, 4, 2, true, WAX);
        dots(c, C.blood, [9, 7, 10, 7]);
      }
    },
    sw: 16, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      face(c, 4, 10, 11, b, BLACKW);
      c.clearRect(6, b - 1, 9, b);
      c.rect(1, 6, 14, 8, BARK);
      c.row(6, 1, 14, L(BARK));
      board(c, 1, 9, 14, 9, EBONY);
      c.rect(3, 5, 6, 6, BOWL);
      c.row(4, 3, 6, u ? hex('#8a8a54') : VOID);
      c.rect(11, 2, 12, 6, BOWL);
      c.set(10, 3, BOWL);
      if (u) {
        c.set(8, 5, BRASS);
        candle(c, 8, 4, 2, true, WAX);
        dots(c, hex('#8a8a54'), [3, 7, 2, 8, 2, 10]);
      }
    },
  });
  add('gothic-credence-table-cruets', 'credence table cruets wine water small altar side table cloth bell lavabo', {
    w: 16, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 11]) {
        c.rect(x, 14, x + 1, b, BLACKW);
        c.col(x, 14, b, L(BLACKW));
      }
      c.row(b - 3, 5, 10, EBONY);
      c.rect(1, 10, 14, 12, C.white); // the cloth
      c.row(10, 1, 14, L(C.white));
      for (let x = 1; x <= 14; x += 2) c.set(x, 13, D(C.white));
      c.row(12, 1, 14, D(C.white));
      const cruet = (x, col) => {
        c.rect(x, 6, x + 2, 9, col);
        c.set(x + 1, 5, C.glassLight);
        c.set(x + 1, 4, BRASS);
        c.set(x, 6, C.glassLight);
        c.row(6, x + 1, x + 2, C.glass);
      };
      cruet(2, WAT);
      c.rect(11, 7, 13, 9, BRASS); // the bell
      c.set(12, 6, BRASS);
      c.set(12, 5, D(BRASS));
      c.set(11, 7, L(BRASS));
      if (!u) cruet(6, RUBY);
      else {
        c.rect(6, 8, 9, 9, C.glass); // the wine cruet over, and empty
        c.set(10, 9, BRASS);
        c.set(6, 8, C.glassLight);
        dots(c, RUBY, [5, 10, 6, 10, 7, 10, 8, 11, 7, 11, 7, 12, 7, 13, 7, 15, 7, 17]);
        dots(c, D(RUBY), [6, 11, 8, 10]);
      }
    },
    sw: 12, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [3, 7]) {
        c.rect(x, 14, x + 1, b, BLACKW);
        c.col(x, 14, b, L(BLACKW));
      }
      c.rect(1, 10, 10, 12, C.white);
      c.row(10, 1, 10, L(C.white));
      for (let x = 1; x <= 10; x += 2) c.set(x, 13, D(C.white));
      c.rect(3, 7, 5, 9, BRASS);
      c.set(4, 6, BRASS);
      c.set(4, 5, D(BRASS));
      if (!u) {
        c.rect(7, 6, 8, 9, RUBY);
        c.set(7, 5, C.glassLight);
      } else {
        c.rect(7, 8, 9, 9, C.glass);
        dots(c, RUBY, [8, 10, 9, 11, 9, 12, 9, 14]);
      }
    },
  });
  add('gothic-paschal-candle-tall', 'paschal candle tall great candle brass stand easter church cross wax', {
    w: 12, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2,
        t = u ? 12 : 6;
      c.rect(5, 32, 6, b - 3, BRASS);
      c.col(5, 32, b - 3, L(BRASS));
      c.rect(4, 37, 7, 38, BRASS);
      c.rect(3, b - 2, 8, b - 1, BRASS);
      c.rect(2, b, 9, b, D(BRASS));
      c.rect(2, 30, 9, 31, BRASS); // the pan
      c.row(30, 2, 9, L(BRASS));
      c.rect(4, t, 7, 29, WAX);
      c.col(4, t, 29, L(WAX));
      c.col(7, t, 29, D(WAX));
      c.rect(5, 16, 6, 23, RUBY); // the cross and its grains
      c.rect(4, 18, 7, 19, RUBY);
      dots(c, GOLD, [5, 15, 5, 24, 6, 24, 6, 15]);
      if (u) {
        c.set(5, t - 1, K);
        c.set(5, t - 2, C.flame);
        c.set(6, t - 2, C.flame);
        c.set(5, t - 3, C.flameLight);
        c.set(5, t - 4, C.flameLight);
        c.set(6, t - 5, C.flame);
        dots(c, WAX, [3, t + 1, 3, t + 2, 8, t + 1, 8, t + 3, 8, t + 4, 3, 28, 3, 29, 8, 29, 9, 29]);
        dots(c, L(WAX), [3, t + 3]);
      } else c.set(5, t - 1, K);
    },
  });
  add('gothic-sanctuary-lamp-hanging', 'sanctuary lamp hanging red glass brass chains eternal flame altar light', {
    w: 12, h: 30,
    f(c, u) {
      c.rect(5, 0, 6, 2, BRASS);
      chain(c, 5, 3, 2, 14, BRASS);
      chain(c, 6, 3, 9, 14, BRASS);
      chain(c, 5, 3, 5, 12, D(BRASS));
      c.rect(1, 15, 10, 16, BRASS); // the ring
      c.row(15, 1, 10, L(BRASS));
      c.rect(3, 12, 8, 16, u ? hex('#4a1a20') : hex('#b3342c')); // the glass
      c.rect(3, 12, 8, 12, u ? RUBY : hex('#d9583a'));
      if (!u) {
        c.set(5, 13, C.flameLight);
        c.set(6, 14, C.flame);
        c.set(5, 11, C.flame);
        dots(c, hex('#b3342c'), [1, 12, 10, 11, 0, 18, 11, 17]);
      } else {
        wisp(c, 5, 10, 6); // gone out
        c.set(5, 11, K);
      }
      c.poly([[2, 17], [9, 17], [6, 22], [5, 22]], BRASS);
      c.line(2, 17, 5, 22, L(BRASS));
      c.rect(5, 23, 6, 24, D(BRASS));
      c.rect(5, 25, 6, 27, RUBY);
      c.set(5, 28, RUBY);
    },
  });
  add('gothic-coffin-upright-leaning', 'coffin upright leaning undertaker standing casket lid open lining empty', {
    w: 18, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2,
        shape = [[5, 2], [12, 2], [16, 11], [13, b], [4, b], [1, 11]];
      c.poly(shape, COFFIN);
      c.line(5, 2, 1, 11, L(COFFIN));
      c.line(1, 11, 4, b, L(COFFIN));
      if (!u) {
        c.poly([[6, 4], [11, 4], [14, 11], [12, b - 2], [5, b - 2], [3, 11]], mix(COFFIN, 1.15));
        c.poly([[6, 5], [11, 5], [13, 11], [11, b - 3], [6, b - 3], [4, 11]], COFFIN);
        c.rect(8, 9, 9, 17, BRASS);
        c.rect(6, 11, 11, 12, BRASS);
        c.rect(7, 24, 10, 26, BRASS);
        c.row(25, 8, 9, D(BRASS));
        dots(c, BRASS, [2, 14, 15, 14, 3, 28, 14, 28]);
      } else {
        c.poly([[6, 4], [11, 4], [14, 11], [12, b - 2], [5, b - 2], [3, 11]], SHROUD); // the lining, and the shape that lay in it
        c.poly([[7, 8], [10, 8], [12, 13], [10, b - 5], [7, b - 5], [5, 13]], D(SHROUD));
        c.oval(7, 5, 10, 8, D(SHROUD));
        dots(c, mix(SHROUD, 0.55), [8, 14, 9, 20, 8, 27]);
        c.poly([[21, 5], [24, 5], [25, 12], [24, b], [20, b], [19, 12]], mix(COFFIN, 0.8)); // the lid stood beside it
        c.line(21, 5, 19, 12, COFFIN);
        c.line(19, 12, 20, b, COFFIN);
        for (const [x, y] of [[21, 14], [22, 15], [22, 17], [23, 19], [21, 20], [22, 22], [23, 24], [21, 25]]) c.set(x, y, SHROUD); // scratched from inside
        dots(c, C.earth, [9, b, 14, b, 16, b]);
      }
    },
    u: [0, 0, 9],
    sw: 12, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 2], [5, 2], [9, b], [5, b]], COFFIN);
      c.line(2, 2, 5, b, L(COFFIN));
      c.line(5, 2, 9, b, D(COFFIN));
      c.set(6, 14, BRASS);
      c.set(8, 28, BRASS);
      if (!u) c.line(4, 2, 8, b, mix(COFFIN, 1.15));
      else {
        c.line(5, 3, 8, b - 1, SHROUD);
        c.poly([[10, 6], [11, 6], [14, b], [12, b]], mix(COFFIN, 0.8));
        c.line(10, 6, 12, b, COFFIN);
      }
    },
    su: [0, 0, 4],
  });
  add('gothic-wayside-shrine-crucifix', 'wayside shrine crucifix roofed wooden cross roadside calvary offerings flowers', {
    w: 18, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      heap(c, 4, 13, b, 3, GSTONE, 3);
      c.rect(8, 4, 9, b - 2, BARK);
      c.col(8, 4, b - 2, L(BARK));
      c.rect(3, 9, 14, 10, BARK);
      c.row(9, 3, 14, L(BARK));
      c.line(1, 8, 8, 1, BLACKW); // the little roof
      c.line(16, 8, 9, 1, EBONY);
      c.line(2, 8, 8, 2, EBONY);
      c.line(15, 8, 9, 2, BLACKW);
      c.rect(8, 7, 9, 8, DEADF); // the figure
      c.rect(5, 9, 12, 9, DEADF);
      c.rect(8, 10, 9, 16, DEADF);
      c.set(8, 17, DEADF);
      c.rect(8, 13, 9, 14, SHROUD);
      c.set(9, 11, D(DEADF));
      c.set(8, 6, BARK);
      dots(c, C.moss, [9, 22, 8, 30, 3, 9, 5, b]);
      c.rect(11, b - 3, 12, b - 2, WAX);
      if (!u) {
        c.set(11, b - 4, K);
        dots(c, hex('#5a4a30'), [5, b - 3, 6, b - 4, 4, b - 4]); // dead flowers
      } else {
        c.set(11, b - 4, C.flame);
        c.set(11, b - 5, C.flameLight);
        dots(c, C.white, [4, b - 4, 6, b - 5, 5, b - 3]);
        c.set(5, b - 4, C.leaf);
        c.rect(7, 24, 10, 24, RUBY); // a red rag tied round the post
        c.line(10, 25, 11, 29, RUBY);
        c.set(7, 25, D(RUBY));
        dots(c, C.blood, [8, 12, 9, 15, 9, 18, 8, 20]);
      }
    },
    sw: 12, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      heap(c, 2, 9, b, 3, GSTONE, 5);
      c.rect(5, 4, 6, b - 2, BARK);
      c.col(5, 4, b - 2, L(BARK));
      c.rect(5, 9, 6, 10, EBONY);
      c.line(2, 6, 9, 1, BLACKW);
      c.line(2, 7, 9, 2, EBONY);
      c.col(7, 7, 17, DEADF);
      c.set(8, 7, DEADF);
      c.rect(7, 13, 7, 14, SHROUD);
      c.set(8, b - 2, WAX);
      if (u) {
        c.set(8, b - 3, C.flame);
        c.rect(5, 24, 6, 24, RUBY);
        c.line(7, 25, 8, 29, RUBY);
        c.set(7, 19, C.blood);
      }
    },
  });
  add('gothic-saint-statue-niche', 'saint statue niche stone canopy church figure halo headless iconoclasm', {
    w: 18, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      archPt(c, 1, 1, 16, b, GSTONE, 9);
      for (let y = 1; y < 11; y++) for (let x = 1; x <= 8; x++) if (c.get(x, y) && !c.get(x - 1, y)) c.set(x, y, L(GSTONE));
      c.col(1, 10, b, L(GSTONE));
      archPt(c, 4, 5, 13, b - 6, VOID, 6);
      c.rect(2, b - 5, 15, b - 4, L(GSTONE));
      c.rect(6, b - 8, 11, b - 6, GSTONE);
      c.row(b - 8, 6, 11, L(GSTONE));
      c.poly([[7, 14], [10, 14], [12, b - 9], [5, b - 9]], MARBLE); // the robe
      c.line(7, 14, 5, b - 9, L(MARBLE));
      c.line(9, 18, 10, b - 9, GSTONE);
      c.line(8, 20, 7, b - 9, GSTONE);
      c.rect(6, 13, 11, 15, MARBLE);
      c.rect(8, 17, 9, 19, L(MARBLE)); // hands
      c.oval(6, 7, 11, 12, BRASS); // the halo
      if (!u) {
        c.rect(7, 9, 10, 13, MARBLE);
        c.row(9, 7, 10, GSTONE);
        dots(c, GDARK, [8, 11, 10, 11]);
      } else {
        c.oval(7, 8, 10, 11, VOID);
        c.rect(8, 12, 9, 13, GSTONE); // struck off at the neck
        c.rect(3, b - 3, 6, b, MARBLE); // the head lies below
        c.row(b - 3, 3, 6, GSTONE);
        dots(c, GDARK, [4, b - 1, 6, b - 1]);
        dots(c, MARBLE, [9, b, 12, b - 1]);
        c.rect(13, b - 7, 13, b - 6, WAX);
        c.set(13, b - 8, C.flame);
      }
      dots(c, C.moss, [2, b, 15, b - 1, 3, 20]);
    },
    sw: 12, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 3, 7, b, GSTONE, 6, 5, 3);
      c.rect(3, 1, 6, 2, GSTONE);
      c.col(2, 3, b, L(GSTONE));
      c.rect(8, b - 5, 9, b - 4, L(GSTONE));
      c.rect(8, 14, 9, b - 6, MARBLE);
      c.set(10, 18, L(MARBLE));
      if (!u) {
        c.rect(8, 9, 9, 13, MARBLE);
        c.set(8, 8, BRASS);
        c.set(9, 11, GDARK);
      } else {
        c.set(8, 13, GSTONE);
        c.rect(9, b - 2, 11, b, MARBLE);
        c.set(10, b - 1, GDARK);
      }
    },
    su: [0, 0, 1],
  });
  add('gothic-broken-column-ivy', 'broken column ivy stone pillar ruin fluted drum abbey grave monument', {
    w: 16, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const drum = (x0, y0, x1, y1) => {
        c.rect(x0, y0, x1, y1, GSTONE);
        for (let x = x0 + 1; x < x1; x += 2) c.col(x, y0, y1, x < (x0 + x1) / 2 ? L(GSTONE) : D(GSTONE));
        c.row(y1, x0, x1, GDARK);
      };
      c.rect(2, b - 2, 13, b, GSTONE);
      c.row(b - 2, 2, 13, L(GSTONE));
      c.rect(3, b - 4, 12, b - 3, GSTONE);
      if (!u) {
        drum(4, 22, 11, b - 5);
        drum(4, 13, 11, 21);
        drum(4, 6, 11, 12);
        c.clear(4, 6);
        c.clear(5, 6);
        c.clear(4, 7);
        c.clear(10, 6);
        c.clear(11, 6);
        c.clear(11, 7);
        c.clear(11, 8);
        c.set(7, 5, GSTONE);
        c.set(8, 5, L(GSTONE));
        for (const [x, y] of [[4, 27], [5, 25], [6, 23], [8, 21], [10, 19], [11, 17], [10, 15], [8, 13], [6, 11], [5, 9], [3, 28], [11, 20], [3, b - 3]]) {
          c.set(x, y, C.leaf);
          c.set(x + 1, y, C.leafLight);
        }
      } else {
        drum(4, 22, 11, b - 5); // thrown down: the drums lie where they rolled
        c.clear(4, 22);
        c.clear(11, 22);
        c.clear(10, 22);
        c.oval(15, b - 7, 22, b, GSTONE);
        c.oval(17, b - 5, 20, b - 2, GDARK);
        c.set(16, b - 5, L(GSTONE));
        c.rect(23, b - 5, 31, b, GSTONE);
        for (let y = b - 4; y < b; y += 2) c.row(y, 23, 31, D(GSTONE));
        c.row(b - 5, 23, 31, L(GSTONE));
        c.col(31, b - 5, b, GDARK);
        dots(c, C.leaf, [5, 25, 6, 23, 3, b - 3, 14, b, 24, b - 6]);
        dots(c, GSTONE, [13, b - 1, 33, b]);
      }
      dots(c, C.moss, [3, b, 12, b - 1]);
    },
    u: [0, 0, 18],
  });
  add('gothic-great-bell-on-frame', 'large great bell bronze timber frame belfry church tolling clapper headstock', {
    w: 42, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const [x0, x1] of [[2, 8], [39, 33]]) {
        c.line(x0, b, x1, 6, BARK); // the trestles
        c.line(x0 + (x0 < 20 ? 1 : -1), b, x1 + (x0 < 20 ? 1 : -1), 6, x0 < 20 ? L(BARK) : D(BARK));
        c.line(x0 + (x0 < 20 ? 2 : -2), b, x1 + (x0 < 20 ? 2 : -2), 6, BARK);
      }
      c.row(b - 6, 5, 36, D(BARK));
      c.rect(5, 3, 36, 6, BARK); // the headstock
      c.row(3, 5, 36, L(BARK));
      c.row(6, 5, 36, D(BARK));
      for (const x of [16, 25]) c.rect(x, 3, x, 8, IRON);
      const a = u ? -0.42 : 0,
        R = (x, y) => [Math.round(20.5 + x * Math.cos(a) - y * Math.sin(a)), Math.round(8 + x * Math.sin(a) + y * Math.cos(a))],
        ln = (p, q, col) => c.line(p[0], p[1], q[0], q[1], col);
      c.poly([R(-2.5, 0), R(2.5, 0), R(5.5, 5), R(7.5, 14), R(10.5, 20), R(-10.5, 20), R(-7.5, 14), R(-5.5, 5)], BRONZE);
      ln(R(-2.5, 0), R(-5.5, 5), L(BRONZE));
      ln(R(-5.5, 5), R(-7.5, 14), L(BRONZE));
      ln(R(-7.5, 14), R(-10.5, 20), L(BRONZE));
      ln(R(-9.5, 20), R(10, 20), D(BRONZE));
      ln(R(-9, 18), R(9, 18), L(BRONZE));
      ln(R(-5, 8), R(5, 8), D(BRONZE));
      for (const [x, y] of [[0, 4], [1, 7], [-1, 11], [3, 13], [-4, 15], [4, 6], [1, 16]]) {
        const q = R(x, y);
        c.set(q[0], q[1], VERD);
      }
      if (!u) {
        c.rect(20, 29, 21, 31, IRON); // the clapper
        rope(c, 36, 7, 37, 24);
      } else {
        const k = R(7, 22);
        c.rect(k[0], k[1], k[0] + 1, k[1] + 2, IRON); // swung, and the clapper thrown against the lip
        ln(R(1, 6), R(3, 12), K); // cracked
        ln(R(3, 12), R(2, 17), K);
        rope(c, 36, 7, 35, 14);
        rope(c, 35, 14, 37, b - 3);
        dots(c, C.ash, [12, 12, 9, 18, 13, 24, 10, 28]);
      }
    },
    sw: 24, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.line(2, b, 10, 6, L(BARK));
      c.line(3, b, 11, 6, BARK);
      c.line(21, b, 13, 6, D(BARK));
      c.line(20, b, 12, 6, BARK);
      c.rect(9, 3, 14, 6, BARK);
      c.row(3, 9, 14, L(BARK));
      c.rect(11, 4, 12, 5, IRON);
      if (!u) {
        c.poly([[10, 8], [13, 8], [15, 13], [16, 22], [19, 28], [4, 28], [7, 22], [8, 13]], BRONZE);
        c.line(10, 8, 7, 22, L(BRONZE));
        c.line(7, 22, 4, 28, L(BRONZE));
        c.rect(4, 27, 19, 28, D(BRONZE));
        c.row(26, 5, 18, L(BRONZE));
        dots(c, VERD, [11, 12, 12, 17, 10, 22, 14, 24]);
        c.rect(11, 29, 12, 31, IRON);
      } else {
        c.poly([[10, 8], [13, 8], [16, 13], [18, 18], [5, 18], [7, 13]], BRONZE); // swung towards us: the mouth
        c.line(10, 8, 5, 18, L(BRONZE));
        c.oval(3, 16, 20, 29, BRONZE);
        c.oval(5, 18, 18, 27, VOID);
        c.oval(3, 16, 20, 20, L(BRONZE));
        c.oval(5, 18, 18, 22, VOID);
        c.rect(11, 20, 12, 25, IRON);
        c.rect(10, 26, 13, 27, IRON);
        dots(c, VERD, [11, 12, 13, 15]);
      }
      c.row(b - 6, 5, 18, D(BARK));
    },
  });
  add('gothic-monk-habit-on-peg', 'monk habit robe on peg hooded cowl brown rope girdle sandals abbey cell', {
    w: 14, h: 34,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 12, 3, BLACKW);
      for (const x of [3, 7, 11]) c.set(x, 4, EBONY);
      if (!u) {
        c.poly([[5, 5], [8, 5], [11, 12], [11, 27], [2, 27], [2, 12]], HABIT);
        c.line(5, 5, 2, 12, L(HABIT));
        c.col(2, 12, 27, L(HABIT));
        c.oval(4, 5, 9, 11, mix(HABIT, 0.7)); // the hood, empty
        c.oval(5, 6, 8, 10, K);
        for (const x of [5, 8]) c.line(x, 13, x - (x < 7 ? 1 : -1), 27, mix(HABIT, 0.75));
        for (let x = 2; x <= 11; x += 3) c.set(x, 28, HABIT);
        rope(c, 3, 17, 10, 17);
        rope(c, 9, 18, 9, 24);
        c.set(9, 21, D(HEMP));
        c.rect(3, b, 5, b, BOWL); // sandals under it
        c.rect(8, b, 10, b, BOWL);
        c.set(4, b - 1, BOWL);
        c.set(9, b - 1, BOWL);
      } else {
        rope(c, 7, 5, 7, 14); // only the girdle left on its peg
        rope(c, 8, 6, 8, 11);
        c.set(7, 9, D(HEMP));
        c.set(7, 13, D(HEMP));
        c.rect(8, b, 10, b, BOWL);
        c.set(9, b - 1, BOWL);
        dots(c, WAT, [3, b, 5, b - 1, 4, b]);
      }
    },
    sw: 8, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 2, 3, BLACKW);
      c.set(3, 4, EBONY);
      if (!u) {
        c.rect(3, 5, 5, 27, HABIT);
        c.col(3, 5, 27, L(HABIT));
        c.rect(4, 6, 5, 10, mix(HABIT, 0.7));
        c.set(3, 17, HEMP);
        c.col(6, 17, 24, HEMP);
        c.rect(3, b, 5, b, BOWL);
      } else {
        c.col(4, 5, 14, HEMP);
        c.rect(3, b, 5, b, BOWL);
      }
    },
  });
  add('gothic-cloister-stone-bench', 'cloister bench stone seat slab worn abbey garth mossy breviary', {
    w: 34, h: 15, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [4, 24]) {
        c.rect(x, 8, x + 4, b, GSTONE);
        c.col(x, 8, b, L(GSTONE));
        c.rect(x + 1, 10, x + 3, b - 2, GDARK);
        c.set(x + 2, 9, GDARK);
      }
      c.rect(1, 5, 31, 7, MARBLE);
      c.row(5, 1, 31, L(MARBLE));
      c.row(7, 1, 31, GSTONE);
      dots(c, GSTONE, [9, 6, 17, 6, 26, 6]);
      dots(c, C.moss, [2, 7, 3, 6, 29, 7, 5, b, 27, b, 14, 7]);
      if (!u) dots(c, hex('#5a4a30'), [12, 4, 20, 4, 13, b, 18, b]); // dead leaves
      else {
        c.rect(11, 3, 17, 4, C.paper); // a breviary left open, and beads
        c.col(14, 3, 4, D(C.paper));
        c.row(5, 11, 17, BOOK);
        c.set(12, 3, RUBY);
        for (const [x, y] of [[19, 4], [21, 4], [22, 5], [22, 7], [23, 9], [23, 11]]) c.set(x, y, GDARK);
        c.set(23, 12, BRASS);
        dots(c, WAT, [9, b, 11, b, 10, b - 1]);
      }
    },
    sw: 12, sh: 15,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 8, 8, b, GSTONE);
      c.col(3, 8, b, L(GSTONE));
      archPt(c, 4, 9, 7, b - 1, GDARK, 3);
      c.rect(1, 5, 10, 7, MARBLE);
      c.row(5, 1, 10, L(MARBLE));
      c.row(7, 1, 10, GSTONE);
      dots(c, C.moss, [2, 7, 9, 6, 4, b]);
      if (u) {
        c.rect(4, 3, 7, 4, C.paper);
        c.set(9, 8, GDARK);
        c.set(9, 10, BRASS);
      }
    },
  });
  add('gothic-mortsafe-iron-cage', 'mortsafe iron cage grave guard bars padlock body snatchers churchyard tomb', {
    w: 42, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 2, 40, b, GSTONE);
      c.row(b - 2, 1, 40, L(GSTONE));
      c.rect(3, 4, 38, b - 3, VOID);
      heap(c, 6, 35, b - 3, u ? 4 : 6, C.earth, 5);
      const open = (x) => u && x >= 17 && x <= 25;
      for (let x = 3; x <= 38; x++) {
        if (open(x)) continue;
        if ((x - 3) % 3 === 0) c.col(x, 4, b - 3, x < 20 ? L(IRON) : IRON);
      }
      for (let x = 3; x <= 38; x++) if (!open(x)) c.set(x, 4, IRON);
      c.row(11, 3, 16, D(IRON));
      c.row(11, 26, 38, D(IRON));
      if (!u) {
        c.row(11, 17, 25, D(IRON));
        c.rect(19, 9, 21, 12, BRASS);
        c.set(20, 11, K);
      } else {
        c.line(16, 4, 14, 0, IRON); // burst upwards from below
        c.line(26, 4, 29, 0, IRON);
        c.line(18, 6, 17, 1, L(IRON));
        c.line(24, 6, 25, 1, IRON);
        c.rect(17, 7, 25, b - 3, VOID);
        heap(c, 13, 29, b, 4, C.earth, 9);
        c.rect(31, b - 1, 32, b, BRASS);
        dots(c, SHROUD, [20, b - 4, 21, b - 5, 23, b - 3]);
        dots(c, C.earth, [10, b, 33, b]);
      }
      dots(c, C.moss, [2, b, 39, b - 1]);
    },
    u: [0, 4, 0],
    sw: 18, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 2, 16, b, GSTONE);
      c.row(b - 2, 1, 16, L(GSTONE));
      H.archRd(c, 3, 4, 14, b - 3, VOID);
      heap(c, 5, 12, b - 3, 5, C.earth, 5);
      for (let y = 4; y <= b - 3; y++) for (let x = 3; x <= 14; x++) if (c.get(x, y) && (!c.get(x, y - 1) || !c.get(x - 1, y) || !c.get(x + 1, y) || (x - 3) % 3 === 2)) c.set(x, y, x < 8 ? L(IRON) : IRON);
      c.row(11, 4, 13, D(IRON));
      if (!u) {
        c.rect(8, 9, 9, 12, BRASS);
        c.set(8, 11, K);
      } else {
        c.line(8, 4, 7, 0, IRON);
        c.line(11, 4, 12, 0, IRON);
        heap(c, 4, 13, b, 3, C.earth, 7);
        c.set(9, b - 3, SHROUD);
      }
    },
    su: [0, 4, 0],
  });
  void [K, face, PALL, GOLD];
};
