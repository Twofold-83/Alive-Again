/* Gothic, part 3: chancel and sacristy, charnel and churchyard. Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix } = kit;
  const { D, L, dots, board, face, panel, hollow, stones, chain, candle, archPt, skull, straps, heap } = H;
  const add = H.reg('env-gothic', 'Gothic');
  const { SOOT, WAX, EBONY, BLACKW, GSTONE, GDARK, PURPLE, PALL, WAT, SHROUD } = H.MED;
  const IRON = C.iron,
    BRASS = C.brass,
    GOLD = C.gold,
    RUBY = hex('#7a2c34'),
    SAPPH = hex('#34446a'),
    GLGREEN = hex('#3c5a40'),
    COFFIN = hex('#4a3226'),
    VOID = hex('#141218'),
    BOOK = hex('#4a2626'),
    GILT = hex('#a88a3c'),
    PILE = hex('#7c745c');

  add('gothic-prie-dieu-kneeler', 'prie dieu kneeler prayer desk kneeling stool cushion book devotion chapel', {
    w: 18, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(11, 6, 13, b, BLACKW);
      c.col(11, 6, b, L(BLACKW));
      c.poly([[8, 5], [15, 3], [15, 5], [8, 7]], BLACKW);
      c.line(8, 5, 15, 3, L(BLACKW));
      c.rect(2, b - 3, 12, b - 2, BLACKW); // the kneeling board
      c.row(b - 3, 2, 12, L(BLACKW));
      c.rect(2, b - 1, 3, b, EBONY);
      c.rect(10, b - 1, 14, b, EBONY);
      c.rect(3, b - 5, 9, b - 4, RUBY);
      c.row(b - 5, 3, 9, L(RUBY));
      if (!u) {
        c.line(9, 4, 14, 2, BOOK);
        c.line(9, 3, 14, 1, L(BOOK));
      } else {
        c.line(8, 4, 15, 2, C.paper);
        c.line(9, 5, 15, 3, BOOK);
        c.set(11, 2, C.paper);
        c.rect(5, b - 5, 7, b - 5, D(RUBY)); // the dint of knees
        for (const [x, y] of [[8, 6], [8, 8], [9, 10], [9, 12], [8, 14]]) c.set(x, y, GDARK); // a rosary left hanging
        c.set(8, 15, BRASS);
        c.set(8, 16, BRASS);
        c.set(7, 16, BRASS);
        c.set(9, 16, BRASS);
        dots(c, WAT, [5, b - 3, 4, b]);
      }
    },
    sw: 16, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      face(c, 3, 6, 12, b - 2, BLACKW);
      archPt(c, 5, 9, 10, b - 6, EBONY, 4);
      c.rect(2, 3, 13, 5, BLACKW);
      c.row(3, 2, 13, L(BLACKW));
      c.rect(2, b - 3, 13, b - 2, BLACKW);
      c.row(b - 3, 2, 13, L(BLACKW));
      c.rect(2, b - 1, 3, b, EBONY);
      c.rect(12, b - 1, 13, b, EBONY);
      c.rect(4, b - 5, 11, b - 4, RUBY);
      c.row(b - 5, 4, 11, L(RUBY));
      if (!u) {
        c.rect(5, 1, 10, 2, BOOK);
        c.row(1, 5, 10, L(BOOK));
      } else {
        c.rect(4, 1, 11, 2, C.paper);
        c.col(7, 1, 2, D(C.paper));
        c.rect(6, b - 5, 9, b - 5, D(RUBY));
        for (const [x, y] of [[12, 6], [12, 8], [13, 10], [12, 12]]) c.set(x, y, GDARK);
        c.set(12, 13, BRASS);
        c.set(12, 14, BRASS);
      }
    },
  });
  add('gothic-holy-water-stoup', 'holy water stoup wall basin stone shell font church door blessing', {
    w: 14, h: 22,
    f(c, u) {
      c.rect(3, 1, 10, 8, GSTONE); // the back
      c.row(1, 4, 9, L(GSTONE));
      c.rect(6, 2, 7, 7, GDARK);
      c.rect(5, 4, 8, 4, GDARK);
      c.rect(1, 9, 12, 12, GSTONE); // the bowl
      c.row(9, 1, 12, L(GSTONE));
      c.row(13, 2, 11, GSTONE);
      c.row(14, 3, 10, GSTONE);
      for (let x = 2; x <= 11; x += 2) c.col(x, 10, 12, D(GSTONE));
      c.rect(5, 15, 8, 17, GSTONE);
      c.rect(6, 18, 7, 19, D(GSTONE));
      c.row(9, 2, 11, u ? C.blood : WAT);
      c.set(4, 9, u ? hex('#b3342c') : L(WAT));
      if (u) {
        dots(c, C.blood, [3, 10, 3, 12, 4, 14, 9, 11, 9, 13, 8, 16, 7, 20]);
        c.set(7, 19, C.blood);
      } else c.set(11, 13, C.moss);
    },
    sw: 10, sh: 22,
    s(c, u) {
      c.rect(1, 1, 2, 19, GSTONE);
      c.col(1, 1, 19, L(GSTONE));
      c.rect(3, 9, 8, 12, GSTONE);
      c.row(9, 3, 8, L(GSTONE));
      c.row(13, 3, 7, GSTONE);
      c.row(14, 3, 6, GSTONE);
      c.rect(3, 15, 4, 17, GSTONE);
      c.col(6, 10, 12, D(GSTONE));
      c.row(9, 4, 7, u ? C.blood : WAT);
      if (u) dots(c, C.blood, [8, 10, 8, 12, 7, 14, 5, 18]);
    },
  });
  add('gothic-votive-candle-rack', 'votive candle rack iron stand prayer candles tiers offering church shrine', {
    w: 26, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(4, 19, 2, b, IRON);
      c.line(21, 19, 23, b, D(IRON));
      c.rect(3, 22, 22, 22, D(IRON));
      for (let r = 0; r < 3; r++) {
        const y = 10 + r * 4;
        c.rect(2, y, 23, y, IRON);
        c.row(y + 1, 2, 23, D(IRON));
        for (let x = 3 + (r % 2); x <= 22; x += 3) {
          const lit = u ? (x + r) % 5 !== 0 : (x + r * 2) % 9 === 0;
          const h = 2 + ((x * 7 + r * 3) % 3) - (u ? 1 : 0);
          candle(c, x, y - 1, Math.max(1, h), lit, r === 1 ? D(WAX) : WAX);
        }
      }
      c.rect(1, 9, 1, 19, IRON);
      c.rect(24, 9, 24, 19, D(IRON));
      c.rect(9, 20, 16, 25, EBONY); // the box for pennies
      c.row(20, 9, 16, GDARK);
      c.rect(11, 21, 14, 21, K);
      c.set(12, 23, BRASS);
      if (u) dots(c, WAX, [5, 20, 19, 21, 7, b, 18, b]);
    },
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.line(3, 19, 2, b, IRON);
      c.line(10, 19, 11, b, D(IRON));
      for (let r = 0; r < 3; r++) {
        const y = 10 + r * 4,
          x0 = 8 - r * 3;
        c.rect(x0, y, x0 + 3, y, IRON);
        c.col(x0 + 3, y, 19, D(IRON));
        candle(c, x0 + 1, y - 1, u ? 1 : 2, u || r === 1, WAX);
      }
      c.col(2, 18, 19, IRON);
      c.rect(1, 20, 5, 25, EBONY);
      c.row(20, 1, 5, GDARK);
      if (u) c.set(4, b, WAX);
    },
  });
  add('gothic-processional-cross-stand', 'processional cross tall staff brass stand church funeral crucifix veiled', {
    w: 14, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 13, 7, b - 3, BLACKW);
      c.col(6, 13, b - 3, L(BLACKW));
      for (const y of [16, 26, 36]) c.rect(6, y, 7, y, BRASS);
      c.rect(3, b - 2, 10, b, EBONY);
      c.row(b - 2, 4, 9, GDARK);
      c.rect(5, b - 4, 8, b - 3, EBONY);
      c.rect(6, 1, 7, 12, BRASS); // the cross
      c.rect(2, 5, 11, 6, BRASS);
      c.col(6, 1, 12, L(BRASS));
      c.row(5, 2, 11, L(BRASS));
      dots(c, BRASS, [5, 1, 8, 1, 1, 4, 1, 7, 12, 4, 12, 7]);
      c.rect(6, 5, 7, 6, RUBY);
      c.rect(5, 12, 8, 12, D(BRASS));
      if (u) {
        c.poly([[1, 4], [12, 4], [12, 14], [10, 20], [8, 15], [5, 22], [3, 16], [1, 18]], PALL); // veiled in black
        c.line(1, 4, 1, 18, GDARK);
        c.line(4, 6, 4, 18, hex('#33303c'));
        c.line(9, 6, 9, 16, hex('#33303c'));
        c.row(4, 1, 12, GDARK);
        c.rect(6, 1, 7, 3, BRASS);
      }
    },
    sw: 10, sh: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 13, 5, b - 3, BLACKW);
      c.col(4, 13, b - 3, L(BLACKW));
      for (const y of [16, 26, 36]) c.rect(4, y, 5, y, BRASS);
      c.rect(1, b - 2, 8, b, EBONY);
      c.row(b - 2, 2, 7, GDARK);
      c.rect(3, b - 4, 6, b - 3, EBONY);
      c.rect(4, 1, 5, 12, BRASS);
      c.col(4, 1, 12, L(BRASS));
      c.rect(3, 5, 6, 6, BRASS);
      c.set(6, 5, RUBY);
      if (u) {
        c.poly([[3, 4], [6, 4], [7, 14], [6, 20], [4, 16], [2, 18]], PALL);
        c.line(3, 4, 2, 18, GDARK);
        c.rect(4, 1, 5, 3, BRASS);
      }
    },
  });
  add('gothic-triptych-altarpiece', 'triptych altarpiece painted panels gold saints folding wings retable church art', {
    w: 34, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, b - 3, 27, b, EBONY); // the predella
      c.row(b - 3, 6, 27, GDARK);
      dots(c, GILT, [9, b - 1, 13, b - 1, 17, b - 1, 21, b - 1, 25, b - 1]);
      const saint = (x, y, robe) => {
        c.rect(x, y + 3, x + 2, y + 10, robe);
        c.set(x + 1, y + 1, C.flesh);
        c.set(x + 1, y + 2, C.flesh);
        c.set(x, y + 1, GOLD);
        c.set(x + 2, y + 1, GOLD);
        c.set(x + 1, y, GOLD);
        c.col(x, y + 3, y + 10, L(robe));
      };
      if (!u) {
        archPt(c, 8, 2, 25, b - 4, BLACKW, 8); // shut: grey saints on the backs of the wings
        c.col(16, 4, b - 4, EBONY);
        c.col(17, 4, b - 4, K);
        saint(11, 10, GSTONE);
        saint(20, 10, GSTONE);
        dots(c, IRON, [9, 12, 9, 20, 24, 12, 24, 20]);
        c.set(15, 16, BRASS);
        c.set(18, 16, BRASS);
        for (let y = 2; y < 10; y++) for (let x = 8; x <= 16; x++) if (c.get(x, y) && !c.get(x - 1, y)) c.set(x, y, L(BLACKW));
      } else {
        archPt(c, 8, 2, 25, b - 4, EBONY, 8);
        archPt(c, 10, 4, 23, b - 5, GILT, 7);
        c.rect(16, 8, 17, b - 6, BLACKW); // the rood
        c.rect(13, 11, 20, 12, BLACKW);
        c.rect(16, 11, 17, 16, C.flesh);
        c.rect(14, 11, 19, 11, C.flesh);
        c.set(16, 10, C.flesh);
        c.set(17, 14, C.blood);
        saint(11, 13, SAPPH);
        saint(20, 13, RUBY);
        dots(c, L(GILT), [12, 8, 21, 9, 14, 6]);
        for (const x0 of [1, 26]) {
          c.rect(x0, 5, x0 + 6, b - 4, EBONY); // the wings spread
          c.rect(x0 + 1, 6, x0 + 5, b - 5, GILT);
          saint(x0 + 2, 10, x0 < 9 ? GLGREEN : PURPLE);
          c.set(x0 + 3, 8, L(GILT));
        }
        c.row(4, 2, 6, EBONY);
        c.row(4, 27, 31, EBONY);
        dots(c, C.blood, [17, 17, 17, 19, 16, 21]);
      }
    },
    sw: 10, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 3, 7, b, EBONY);
      c.row(b - 3, 2, 7, GDARK);
      c.rect(3, 3, 5, b - 4, BLACKW);
      c.col(3, 3, b - 4, L(BLACKW));
      c.set(4, 2, BLACKW);
      if (!u) c.col(6, 4, b - 4, EBONY);
      else {
        c.poly([[6, 5], [8, 6], [8, b - 5], [6, b - 4]], EBONY);
        c.col(7, 7, b - 6, GILT);
      }
    },
  });
  add('gothic-rood-screen-door', 'rood screen chancel screen carved oak tracery doors church partition cross', {
    w: 36, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 6, 34, 8, BLACKW); // the beam
      c.row(6, 1, 34, L(BLACKW));
      for (let x = 2; x <= 33; x += 2) c.set(x, 5, BLACKW);
      c.rect(17, 0, 18, 5, BLACKW); // the rood on top
      c.rect(15, 2, 20, 2, BLACKW);
      for (const x of [1, 10, 24, 33]) {
        c.rect(x, 9, x + 1, b, BLACKW);
        c.col(x, 9, b, L(BLACKW));
      }
      const light = (x0, x1) => {
        for (let x = x0; x <= x1; x++) {
          const t = Math.abs(x - (x0 + x1) / 2);
          c.col(x, 9, 9 + Math.round(t * 0.9), BLACKW); // cusped heads
        }
        c.set((x0 + x1) >> 1, 12, BLACKW);
        c.col((x0 + x1) >> 1, 13, 29, EBONY);
      };
      light(3, 9);
      light(26, 32);
      for (const x0 of [3, 26]) {
        face(c, x0, 30, x0 + 6, b, BLACKW); // the dado, with what is left of its painted saints
        c.rect(x0 + 1, 32, x0 + 2, b - 2, RUBY);
        c.rect(x0 + 4, 32, x0 + 5, b - 2, GLGREEN);
        dots(c, C.flesh, [x0 + 1, 32, x0 + 4, 32]);
        dots(c, BLACKW, [x0 + 2, 36, x0 + 4, 39, x0 + 1, 41]);
      }
      light(12, 23);
      c.clear(17, 12);
      if (!u) {
        face(c, 12, 30, 23, b, BLACKW); // the doors
        c.rect(12, 17, 23, 29, null);
        c.col(17, 13, b, EBONY);
        c.col(18, 13, b, K);
        for (const x of [14, 21]) c.col(x, 14, 29, EBONY);
        c.row(30, 12, 23, L(BLACKW));
        panel(c, 13, 33, 16, b - 2, BLACKW);
        panel(c, 19, 33, 22, b - 2, BLACKW);
        c.set(16, 31, IRON);
        c.set(19, 31, IRON);
      } else {
        for (let y = 13; y <= 29; y++) c.clear(17, y);
        c.col(12, 14, b, EBONY); // both leaves thrown back
        c.col(23, 14, b, EBONY);
        c.set(13, 31, IRON);
        dots(c, C.ash, [15, b, 19, b, 17, b - 1]);
      }
    },
    sw: 8, sh: 48,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 6, 4, b, BLACKW);
      c.col(3, 6, b, L(BLACKW));
      c.rect(2, 6, 5, 8, BLACKW);
      c.row(6, 2, 5, L(BLACKW));
      c.rect(3, 0, 4, 5, BLACKW);
      c.rect(2, 30, 5, 30, EBONY);
      if (u) {
        c.rect(5, 14, 10, 29, null);
        for (const x of [6, 8, 10]) c.col(x, 14, 29, EBONY);
        face(c, 5, 30, 10, b, BLACKW);
        c.row(14, 5, 10, BLACKW);
      }
    },
    su: [0, 0, 5],
  });
  add('gothic-choir-stall-misericord', 'choir stall misericord carved seat canopy monk canon quire dark oak tip up', {
    w: 24, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, 8, 20, b, BLACKW);
      c.poly([[2, 8], [11, 2], [12, 2], [21, 8]], BLACKW);
      c.line(2, 8, 11, 2, L(BLACKW));
      c.set(11, 1, BRASS);
      c.set(12, 1, BRASS);
      archPt(c, 6, 10, 17, 22, EBONY, 6);
      dots(c, BLACKW, [9, 15, 11, 13, 13, 15, 11, 17, 14, 18, 8, 19]);
      for (const x of [1, 20]) {
        c.rect(x, 18, x + 2, b, BLACKW); // elbows
        c.rect(x, 16, x + 2, 17, EBONY);
        c.set(x + 1, 15, L(BLACKW));
        c.col(x, 18, b, L(BLACKW));
      }
      if (!u) {
        c.rect(4, 24, 19, 26, hex('#4a3a34'));
        c.row(24, 4, 19, L(hex('#4a3a34')));
        c.rect(4, 27, 19, b - 2, EBONY);
        panel(c, 6, 29, 17, b - 3, BLACKW);
      } else {
        c.rect(4, 14, 19, 26, hex('#4a3a34')); // tipped up: the little ledge and what is carved under it
        c.row(14, 4, 19, EBONY);
        c.rect(8, 16, 15, 17, BLACKW);
        c.row(16, 8, 15, L(BLACKW));
        c.oval(9, 18, 14, 24, BLACKW);
        dots(c, K, [10, 20, 13, 20]);
        c.rect(11, 22, 12, 22, K);
        dots(c, L(BLACKW), [9, 18, 14, 18, 8, 19, 15, 19]);
        c.rect(4, 27, 19, b - 2, VOID);
        dots(c, GDARK, [7, b - 3, 14, b - 4]);
      }
      board(c, 1, b - 1, 22, b, EBONY);
    },
    sw: 16, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 5, b, BLACKW);
      c.col(2, 3, b, L(BLACKW));
      c.poly([[2, 3], [12, 3], [12, 5], [6, 8], [2, 8]], BLACKW);
      c.row(3, 2, 12, L(BLACKW));
      c.set(12, 6, BRASS);
      c.poly([[6, 18], [12, 16], [13, 18], [13, b], [6, b]], BLACKW);
      c.line(6, 18, 12, 16, L(BLACKW));
      c.set(12, 15, EBONY);
      panel(c, 7, 28, 11, b - 3, BLACKW);
      if (!u) c.row(24, 6, 13, L(hex('#4a3a34')));
      else {
        c.rect(6, 14, 7, 24, hex('#4a3a34'));
        c.set(8, 16, BLACKW);
      }
      board(c, 1, b - 1, 14, b, EBONY);
    },
  });
  add('gothic-bishop-throne-cathedra', 'bishop throne cathedra canopy spire purple seat cathedral mitre crozier', {
    w: 22, h: 50, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (let y = 2; y <= 13; y++) {
        const hw = Math.round((y - 2) * 0.55);
        c.row(y, 10 - hw, 11 + hw, y % 4 === 1 ? EBONY : BLACKW); // the spire
        c.set(10 - hw, y, L(BLACKW));
        if (y % 4 === 3) {
          c.set(9 - hw, y, BLACKW);
          c.set(12 + hw, y, BLACKW);
        }
      }
      c.rect(10, 0, 11, 1, BRASS);
      c.rect(3, 14, 18, 15, EBONY);
      face(c, 4, 16, 17, 33, BLACKW);
      c.col(3, 14, b - 2, BLACKW);
      c.col(18, 14, b - 2, EBONY);
      archPt(c, 6, 18, 15, 32, PURPLE, 5);
      c.rect(10, 22, 11, 28, GOLD);
      c.rect(8, 24, 13, 25, GOLD);
      for (const x of [1, 18]) {
        c.rect(x, 28, x + 2, 29, BLACKW);
        c.row(28, x, x + 2, L(BLACKW));
        c.rect(x + (x < 9 ? 0 : 1), 30, x + (x < 9 ? 1 : 2), 35, EBONY);
        c.set(x + (x < 9 ? 0 : 2), 27, BRASS);
      }
      c.rect(4, 33, 17, 35, PURPLE); // cushion
      c.row(33, 4, 17, L(PURPLE));
      c.row(35, 4, 17, D(PURPLE));
      face(c, 3, 36, 18, b - 2, BLACKW);
      for (const x0 of [5, 12]) archPt(c, x0, 38, x0 + 4, b - 3, EBONY, 3);
      board(c, 1, b - 1, 20, b, EBONY);
      if (u) {
        c.poly([[8, 32], [10, 27], [11, 27], [13, 32]], C.white); // the mitre left on the seat
        c.col(10, 28, 32, GOLD);
        c.row(32, 8, 13, GOLD);
        c.set(13, 33, C.white);
        c.set(14, 34, GOLD);
        c.line(19, b - 2, 17, 12, GILT); // and the crozier against the arm
        c.set(18, 11, GILT);
        c.set(19, 11, GILT);
        c.set(20, 12, GILT);
        c.set(20, 13, GILT);
        c.set(19, 14, GILT);
        dots(c, C.blood, [6, 34, 7, 35, 6, 37, 6, 40]);
      }
    },
    sw: 16, sh: 50,
    s(c, u) {
      const b = c.h - 2;
      for (let y = 2; y <= 13; y++) {
        const hw = Math.round((y - 2) * 0.5);
        c.row(y, 6 - hw, 7 + hw, y % 4 === 1 ? EBONY : BLACKW);
        c.set(6 - hw, y, L(BLACKW));
      }
      c.rect(6, 0, 7, 1, BRASS);
      c.rect(1, 14, 12, 15, EBONY);
      c.rect(2, 16, 4, b - 2, BLACKW);
      c.col(2, 16, b - 2, L(BLACKW));
      c.col(5, 18, 32, PURPLE);
      c.rect(5, 28, 12, 29, BLACKW);
      c.row(28, 5, 12, L(BLACKW));
      c.set(12, 27, BRASS);
      c.rect(10, 30, 11, 35, EBONY);
      c.rect(5, 33, 12, 35, PURPLE);
      c.row(33, 5, 12, L(PURPLE));
      face(c, 2, 36, 12, b - 2, BLACKW);
      archPt(c, 5, 38, 9, b - 3, EBONY, 3);
      board(c, 1, b - 1, 14, b, EBONY);
      if (u) {
        c.poly([[7, 32], [8, 27], [9, 27], [10, 32]], C.white);
        c.row(32, 7, 10, GOLD);
        c.line(13, b - 2, 12, 12, GILT);
        c.set(13, 11, GILT);
        c.set(14, 12, GILT);
        c.set(13, 13, GILT);
      }
    },
  });
  add('gothic-offertory-box-iron', 'offertory box alms poor box iron bound oak coins church post padlock', {
    w: 14, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 16, 8, b - 2, BLACKW);
      c.col(5, 16, b - 2, L(BLACKW));
      c.rect(3, b - 1, 10, b, EBONY);
      face(c, 2, 8, 11, 15, BLACKW);
      straps(c, 2, 11, [10, 14]);
      c.col(4, 8, 15, IRON);
      c.col(9, 8, 15, IRON);
      if (!u) {
        c.rect(2, 6, 11, 7, BLACKW);
        c.row(6, 2, 11, L(BLACKW));
        c.rect(5, 6, 8, 6, K);
        c.rect(6, 11, 7, 13, BRASS);
        c.set(6, 12, K);
      } else {
        c.poly([[2, 6], [11, 2], [11, 3], [2, 7]], BLACKW); // prised up
        c.line(2, 6, 11, 2, L(BLACKW));
        c.rect(3, 7, 10, 7, VOID);
        c.rect(6, 12, 7, 12, IRON);
        c.rect(10, 16, 11, 18, BRASS); // the lock hangs by its hasp
        dots(c, GOLD, [1, b, 11, b - 2, 12, b, 9, b - 2, 2, b - 2]);
        c.set(12, b, L(GOLD));
        c.line(11, b, 13, b - 6, IRON); // and the bar that did it
        c.set(13, b - 7, IRON);
      }
    },
    sw: 12, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 16, 7, b - 2, BLACKW);
      c.col(4, 16, b - 2, L(BLACKW));
      c.rect(2, b - 1, 9, b, EBONY);
      face(c, 2, 8, 9, 15, BLACKW);
      straps(c, 2, 9, [10, 14]);
      if (!u) {
        c.rect(2, 6, 9, 7, BLACKW);
        c.row(6, 2, 9, L(BLACKW));
        c.set(9, 12, BRASS);
      } else {
        c.poly([[2, 3], [9, 6], [9, 7], [2, 4]], BLACKW);
        c.rect(3, 7, 8, 7, VOID);
        dots(c, GOLD, [10, b, 9, b - 2, 1, b - 2]);
      }
    },
  });
  add('gothic-hymn-board-wall', 'hymn board wall numbers church psalm cards wooden frame service', {
    w: 16, h: 22,
    f(c, u) {
      c.poly([[2, 5], [7, 1], [8, 1], [13, 5]], BLACKW);
      c.line(2, 5, 7, 1, L(BLACKW));
      face(c, 2, 5, 13, 19, BLACKW);
      c.rect(3, 6, 12, 18, EBONY);
      c.set(7, 3, BRASS);
      c.set(8, 3, BRASS);
      for (let r = 0; r < 4; r++) {
        const y = 7 + r * 3;
        c.row(y + 2, 3, 12, BLACKW);
        if (u && r > 0 && r < 3) continue;
        for (let i = 0; i < 3; i++) {
          if (u && r === 3 && i < 2) continue;
          const x = 4 + i * 3;
          c.rect(x, y, x + 1, y + 1, u && r === 0 ? RUBY : C.white);
          c.set(x + (i % 2), y + ((i + r) % 2), u && r === 0 ? C.white : K);
        }
      }
      if (u) {
        c.rect(5, 15, 6, 17, C.white); // one card hangs by a corner
        c.set(4, 18, C.white);
        c.set(5, 16, K);
        c.rect(9, 19, 10, 20, C.white);
      }
    },
    sw: 6, sh: 22,
    s(c, u) {
      c.rect(2, 2, 3, 19, BLACKW);
      c.col(2, 2, 19, L(BLACKW));
      c.set(2, 1, BLACKW);
      if (u) c.set(4, 18, C.white);
    },
  });
  add('gothic-sacristy-vestment-press', 'vestment press sacristy cupboard robes chasuble wardrobe church dark oak doors', {
    w: 28, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 5, 25, b, BLACKW);
      c.rect(1, 3, 26, 5, EBONY);
      c.row(3, 1, 26, L(BLACKW));
      for (let x = 2; x <= 25; x += 3) c.rect(x, 1, x + 1, 2, BLACKW);
      face(c, 3, b - 8, 24, b - 5, BLACKW); // two drawers
      face(c, 3, b - 4, 24, b - 1, BLACKW);
      dots(c, IRON, [8, b - 6, 19, b - 6, 8, b - 2, 19, b - 2]);
      if (!u) {
        for (const x0 of [3, 14]) {
          face(c, x0, 7, x0 + 10, b - 10, BLACKW);
          archPt(c, x0 + 2, 10, x0 + 8, b - 13, EBONY, 5);
          for (const y of [11, 26]) c.row(y, x0 + (x0 < 9 ? 0 : 6), x0 + (x0 < 9 ? 4 : 10), IRON);
        }
        c.col(13, 7, b - 10, K);
        c.set(12, 20, BRASS);
        c.set(15, 20, BRASS);
      } else {
        hollow(c, 4, 7, 23, b - 10, BLACKW);
        c.col(3, 7, b - 10, L(BLACKW));
        c.col(24, 7, b - 10, L(BLACKW));
        c.row(8, 4, 23, IRON); // the rail
        c.poly([[5, 9], [10, 9], [11, 26], [4, 26]], PURPLE); // a chasuble
        c.col(7, 9, 26, GOLD);
        c.col(8, 9, 26, D(GOLD));
        c.line(5, 9, 4, 26, L(PURPLE));
        c.rect(12, 9, 16, 29, C.white); // an alb
        c.col(12, 9, 29, L(C.white));
        c.col(14, 12, 29, D(C.white));
        for (let x = 12; x <= 16; x += 2) c.set(x, 30, D(C.white));
        c.poly([[18, 9], [22, 9], [23, 24], [17, 24]], RUBY); // a cope
        c.line(18, 9, 17, 24, L(RUBY));
        c.col(20, 9, 24, GILT);
        c.rect(5, b - 8, 22, b - 7, SHROUD); // the top drawer out, linen in it
        c.row(b - 8, 5, 22, L(SHROUD));
        dots(c, D(SHROUD), [9, b - 7, 15, b - 7, 20, b - 7]);
        dots(c, C.blood, [13, 14, 14, 15, 13, 16, 14, 18]);
      }
    },
    sw: 14, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 5, 10, b, BLACKW);
      c.rect(1, 3, 11, 5, EBONY);
      c.row(3, 1, 11, L(BLACKW));
      for (let x = 2; x <= 10; x += 3) c.rect(x, 1, x + 1, 2, BLACKW);
      panel(c, 4, 8, 8, b - 11, BLACKW);
      panel(c, 4, b - 8, 8, b - 2, BLACKW);
      if (u) {
        H.doorOut(c, 11, 7, b - 10, 6, BLACKW);
        c.rect(11, b - 8, 13, b - 6, BLACKW);
        c.row(b - 8, 11, 13, SHROUD);
      }
    },
    su: [0, 0, 6],
  });
  add('gothic-charnel-bone-pile', 'bone pile charnel heap skulls skeleton remains crypt catacomb bones', {
    w: 28, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      heap(c, 2, 25, b, 11, PILE, 6);
      for (const [x0, y0, x1, y1] of [[4, b - 1, 11, b - 4], [9, b, 17, b - 2], [16, b - 3, 23, b], [7, b - 5, 13, b - 6], [15, b - 7, 21, b - 5]]) {
        c.line(x0, y0, x1, y1, C.bone);
        c.set(x0, y0 - 1, C.bone);
        c.set(x1, y1 + 1, C.bone);
      }
      dots(c, VOID, [6, b - 2, 12, b - 3, 14, b - 1, 20, b - 2, 10, b - 7, 18, b - 4, 23, b - 1]);
      skull(c, 5, b - 8);
      skull(c, 17, b - 6);
      skull(c, 11, b - 11);
      if (u) {
        candle(c, 13, b - 12, 3, true, WAX); // someone has been here
        c.set(12, b - 11, WAX);
        dots(c, C.glow, [12, b - 9, 14, b - 9]);
        c.rect(22, b - 4, 26, b - 3, GDARK); // a spade left in it
        c.line(24, b - 5, 27, b - 13, hex('#6a5038'));
      }
    },
    u: [0, 4, 2],
    sw: 18, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      heap(c, 2, 15, b, 11, PILE, 9);
      for (const [x0, y0, x1, y1] of [[3, b, 9, b - 3], [8, b - 1, 14, b], [5, b - 5, 11, b - 6]]) {
        c.line(x0, y0, x1, y1, C.bone);
        c.set(x0, y0 - 1, C.bone);
      }
      dots(c, VOID, [5, b - 2, 11, b - 3, 13, b - 1]);
      skull(c, 9, b - 6);
      skull(c, 5, b - 11);
      if (u) {
        candle(c, 7, b - 12, 3, true, WAX);
        dots(c, C.glow, [6, b - 9, 8, b - 9]);
      }
    },
    su: [0, 4, 0],
  });
  add('gothic-crypt-niche-coffin', 'crypt niche coffin wall vault loculus burial shelf catacomb stone cobweb', {
    w: 30, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stones(c, 1, 1, 28, b, GSTONE, 5, 8, 4);
      c.col(1, 1, b, L(GSTONE));
      c.rect(4, 6, 25, 19, VOID);
      c.row(20, 3, 26, L(GSTONE));
      c.rect(11, 22, 18, 24, BRASS); // the plate
      c.row(23, 12, 17, D(BRASS));
      c.rect(5, 12, 24, 18, COFFIN);
      c.row(18, 5, 24, D(COFFIN));
      c.col(5, 12, 18, L(COFFIN));
      for (const x of [8, 14, 20]) {
        c.rect(x, 15, x + 1, 15, BRASS);
      }
      dots(c, VOID, [11, 17, 12, 17, 22, 16]); // rot
      if (!u) {
        c.rect(5, 10, 24, 11, COFFIN);
        c.row(10, 5, 24, L(COFFIN));
        c.line(4, 6, 9, 9, C.ash); // cobweb
        c.line(4, 9, 7, 6, C.ash);
        c.line(4, 7, 6, 6, C.ash);
      } else {
        c.row(11, 6, 23, SHROUD); // the lid is off
        skull(c, 6, 7);
        for (const x of [12, 14, 16]) c.col(x, 9, 10, C.bone);
        c.row(10, 12, 17, C.bone);
        c.line(18, 10, 22, 9, C.bone);
        c.set(4, 6, C.ash);
        c.line(22, b, 31, 14, COFFIN); // it leans against the wall below
        c.line(23, b, 32, 14, D(COFFIN));
        c.line(21, b, 30, 14, L(COFFIN));
        dots(c, GSTONE, [18, b, 20, b - 1]);
      }
      dots(c, C.moss, [2, b, 27, b - 1, 3, 22]);
    },
    u: [0, 0, 4],
    sw: 12, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 1, 9, b, GSTONE, 5, 5, 4);
      c.col(2, 1, b, L(GSTONE));
      c.col(9, 6, 19, VOID);
      if (u) {
        c.rect(10, 12, 13, 18, COFFIN);
        c.row(12, 10, 13, SHROUD);
        c.set(12, 15, BRASS);
        c.line(11, b, 13, 20, COFFIN);
      }
      dots(c, C.moss, [3, b, 8, b - 1]);
    },
    su: [0, 0, 4],
  });
  add('gothic-headstone-cross-ringed', 'headstone ringed cross celtic grave marker churchyard stone leaning mossy', {
    w: 18, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 3, 14, b, GSTONE);
      c.row(b - 3, 3, 14, L(GSTONE));
      dots(c, C.moss, [4, b, 5, b - 1, 12, b - 2, 13, b]);
      const head = (ox, oy) => {
        c.oval(ox + 3, oy + 2, ox + 12, oy + 11, GSTONE);
        c.oval(ox + 5, oy + 4, ox + 10, oy + 9, GDARK);
        c.rect(ox + 7, oy, ox + 8, oy + 13, GSTONE);
        c.rect(ox + 2, oy + 6, ox + 13, oy + 7, GSTONE);
        c.col(ox + 7, oy, oy + 13, L(GSTONE));
        c.row(oy + 6, ox + 2, ox + 13, L(GSTONE));
        c.rect(ox + 7, oy + 6, ox + 8, oy + 7, D(GSTONE));
      };
      if (!u) {
        head(1, 2);
        c.rect(7, 15, 10, b - 4, GSTONE);
        c.col(7, 15, b - 4, L(GSTONE));
        c.col(10, 15, b - 4, D(GSTONE));
        dots(c, D(GSTONE), [8, 18, 9, 18, 8, 20, 9, 22, 8, 22]);
        dots(c, C.moss, [5, 9, 6, 6, 13, 10, 8, 16]);
      } else {
        c.rect(7, b - 9, 10, b - 4, GSTONE); // snapped off; the head lies in the grass
        c.col(7, b - 9, b - 4, L(GSTONE));
        c.set(7, b - 10, GSTONE);
        c.set(9, b - 10, GSTONE);
        c.oval(15, b - 7, 24, b, GSTONE);
        c.oval(17, b - 5, 22, b - 2, GDARK);
        c.rect(14, b - 4, 25, b - 3, GSTONE);
        c.rect(19, b - 8, 20, b, GSTONE);
        c.row(b - 4, 14, 25, L(GSTONE));
        dots(c, C.moss, [16, b, 23, b - 6]);
        dots(c, hex('#584031'), [2, b, 1, b - 1, 5, b - 4, 12, b - 4]);
      }
    },
    u: [0, 0, 9],
    sw: 10, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 3, 7, b, GSTONE);
      c.row(b - 3, 2, 7, L(GSTONE));
      if (!u) {
        c.rect(4, 2, 5, b - 4, GSTONE);
        c.col(4, 2, b - 4, L(GSTONE));
        c.rect(3, 6, 6, 11, GSTONE);
        c.col(3, 6, 11, L(GSTONE));
        dots(c, C.moss, [5, 9, 4, 17]);
      } else {
        c.rect(4, b - 9, 5, b - 4, GSTONE);
        c.set(4, b - 10, GSTONE);
        c.rect(8, b - 2, 14, b, GSTONE);
        c.row(b - 2, 8, 14, L(GSTONE));
        c.rect(10, b - 3, 12, b - 3, GSTONE);
      }
      dots(c, C.moss, [3, b, 6, b - 1]);
    },
    su: [0, 0, 6],
  });
  void [K, SOOT, chain, PALL, WAT];
};
