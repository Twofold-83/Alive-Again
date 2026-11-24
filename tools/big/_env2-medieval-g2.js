/* Gothic, part 2: statues and iron, tomb and crypt. Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix } = kit;
  const { D, L, dots, board, face, wisp, stones, chain, rope, candle, archPt, skull } = H;
  const add = H.reg('env-gothic', 'Gothic');
  const { SOOT, WAX, EBONY, BLACKW, GSTONE, GDARK, PALL, WAT, SHROUD, DEADF, HEMP } = H.MED;
  const IRON = C.iron,
    BRASS = C.brass,
    GOLD = C.gold,
    MARBLE = hex('#a4a2a0'),
    RUBY = hex('#7a2c34'),
    SAPPH = hex('#34446a'),
    HGLASS = hex('#3a4a54'),
    COFFIN = hex('#4a3226'),
    VOID = hex('#141218'),
    BOOK = hex('#4a2626');

  add('gothic-angel-statue-weeping', 'angel statue weeping stone marble wings graveyard monument covering face mourning', {
    w: 20, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 2, 16, b, GSTONE);
      c.rect(5, b - 7, 14, b - 3, GSTONE);
      c.row(b - 7, 5, 14, L(GSTONE));
      c.row(b - 2, 3, 16, L(GSTONE));
      c.row(b - 5, 7, 12, D(GSTONE));
      for (const s of [0, 1]) {
        const m = (x) => (s ? 19 - x : x);
        c.poly([[m(5), 10], [m(3), 4], [m(1), 9], [m(1), 22], [m(3), 29], [m(5), 26]], s ? GSTONE : MARBLE); // wings
        c.line(m(3), 5, m(2), 26, s ? D(GSTONE) : GSTONE);
        c.line(m(4), 9, m(4), 26, s ? D(GSTONE) : GSTONE);
      }
      c.poly([[7, 12], [12, 12], [14, b - 8], [5, b - 8]], MARBLE); // the robe
      c.line(7, 12, 5, b - 8, L(MARBLE));
      for (const x of [8, 11]) c.line(x, 18, x - (x < 10 ? 1 : -1), b - 8, GSTONE);
      c.col(10, 20, b - 9, D(GSTONE));
      c.rect(6, 11, 13, 13, MARBLE); // shoulders
      c.rect(8, 5, 11, 10, MARBLE); // head
      c.row(4, 8, 11, GSTONE); // hair
      c.set(7, 5, GSTONE);
      c.set(12, 5, GSTONE);
      c.col(7, 6, 10, GSTONE);
      c.col(12, 6, 10, GSTONE);
      if (!u) {
        c.rect(7, 7, 12, 9, L(MARBLE)); // the hands over the face
        c.row(9, 7, 12, GSTONE);
        c.col(9, 7, 8, GSTONE);
        c.line(6, 13, 7, 10, MARBLE);
        c.line(13, 13, 12, 10, MARBLE);
      } else {
        c.set(9, 7, K); // it has looked up
        c.set(11, 7, K);
        c.set(10, 9, GDARK);
        c.col(9, 8, 13, C.blood);
        c.col(11, 8, 11, C.blood);
        c.set(11, 13, C.blood);
        c.set(9, 16, C.blood);
        c.col(6, 14, 20, MARBLE); // the arms hang
        c.col(13, 14, 20, MARBLE);
        c.set(6, 21, L(MARBLE));
        c.set(13, 21, GSTONE);
      }
      dots(c, C.moss, [4, b - 2, 5, b - 1, 14, b - 6, 2, 20, 6, 30]);
      dots(c, D(GSTONE), [9, 25, 12, 30, 7, 34]);
    },
    sw: 16, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 2, 13, b, GSTONE);
      c.rect(4, b - 7, 11, b - 3, GSTONE);
      c.row(b - 7, 4, 11, L(GSTONE));
      c.row(b - 2, 2, 13, L(GSTONE));
      c.poly([[5, 10], [3, 4], [1, 10], [1, 24], [3, 31], [5, 28]], MARBLE);
      c.line(3, 5, 2, 28, GSTONE);
      c.line(4, 9, 4, 28, GSTONE);
      c.poly([[5, 12], [9, 12], [11, b - 8], [4, b - 8]], MARBLE);
      c.line(9, 12, 11, b - 8, GSTONE);
      c.line(7, 18, 7, b - 8, GSTONE);
      c.rect(6, 5, 9, 10, MARBLE);
      c.row(4, 6, 9, GSTONE);
      c.col(6, 5, 10, GSTONE);
      c.rect(6, 11, 9, 12, MARBLE);
      if (!u) {
        c.rect(9, 7, 11, 9, L(MARBLE));
        c.line(8, 13, 10, 10, MARBLE);
        c.set(11, 10, GSTONE);
      } else {
        c.set(9, 7, K);
        c.set(10, 8, MARBLE);
        c.col(9, 8, 12, C.blood);
        c.col(8, 14, 20, L(MARBLE));
        c.set(8, 21, GSTONE);
      }
      dots(c, C.moss, [3, b - 2, 10, b - 6, 2, 18]);
    },
  });
  add('gothic-iron-candelabrum-standing', 'candelabrum iron standing five candles wrought tall church crypt light', {
    w: 20, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(9, 12, 10, b - 2, IRON);
      c.col(9, 12, b - 2, L(IRON));
      c.rect(8, 22, 11, 23, IRON);
      c.line(9, b - 2, 5, b, IRON);
      c.line(10, b - 2, 14, b, D(IRON));
      c.set(4, b, IRON);
      c.set(15, b, IRON);
      c.line(5, b - 1, 7, b - 4, D(IRON));
      c.line(14, b - 1, 12, b - 4, D(IRON));
      const arm = (x, y) => {
        const s = x < 9 ? 1 : -1;
        c.line(x, y + 2, x, y + 5, IRON);
        c.line(x, y + 5, 9 + (s < 0 ? 1 : 0), 14, IRON);
        c.rect(x - 1, y + 1, x + 1, y + 1, IRON);
        c.set(x - 1, y + 1, L(IRON));
        candle(c, x, y, u ? 3 : 5, u, WAX);
        if (u) {
          c.set(x + (s > 0 ? -1 : 1), y + 2, WAX);
          c.set(x + (s > 0 ? -1 : 1), y + 3, D(WAX));
        }
      };
      arm(2, 10);
      arm(17, 10);
      arm(6, 8);
      arm(13, 8);
      c.rect(8, 7, 11, 7, IRON);
      candle(c, 9, 6, u ? 4 : 6, u, WAX);
      candle(c, 10, 6, u ? 4 : 6, false, D(WAX));
      if (u) dots(c, WAX, [8, 9, 11, b, 7, b - 1]);
    },
  });
  add('gothic-lectern-chained-book', 'lectern chained book reading desk bible church library chain dark oak', {
    w: 18, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 15, 10, b - 3, BLACKW);
      c.col(7, 15, b - 3, L(BLACKW));
      c.rect(6, 20, 11, 21, EBONY);
      c.rect(4, b - 2, 13, b, EBONY);
      c.row(b - 2, 4, 13, L(BLACKW));
      face(c, 2, 6, 15, 13, BLACKW); // the desk
      c.rect(2, 14, 15, 14, EBONY);
      c.rect(11, 17, 12, 18, IRON); // the staple on the stem
      if (!u) {
        c.rect(5, 7, 12, 12, BOOK);
        c.row(7, 5, 12, L(BOOK));
        dots(c, BRASS, [5, 7, 12, 7, 5, 12, 12, 12, 8, 10, 9, 10]);
        c.rect(13, 9, 13, 10, BRASS);
        chain(c, 13, 12, 15, 17);
        chain(c, 15, 17, 12, 18);
      } else {
        c.rect(3, 6, 14, 12, C.paper); // open, a leaf torn out, the chain filed through
        c.col(8, 6, 12, D(C.paper));
        c.col(9, 6, 12, L(C.paper));
        for (const y of [8, 10]) {
          c.row(y, 4, 7, D(C.parchment));
          c.row(y, 10, 13, D(C.parchment));
        }
        c.rect(4, 7, 5, 8, RUBY);
        c.row(13, 3, 14, BOOK);
        c.rect(10, 6, 13, 7, D(C.paper));
        dots(c, K, [11, 6, 13, 7]);
        chain(c, 12, 19, 13, 23);
        c.rect(13, b - 1, 16, b, C.paper);
        c.set(14, b, D(C.parchment));
        c.set(16, b - 1, D(C.paper));
      }
    },
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 15, 8, b - 3, BLACKW);
      c.col(5, 15, b - 3, L(BLACKW));
      c.rect(4, 20, 9, 21, EBONY);
      c.rect(2, b - 2, 11, b, EBONY);
      c.row(b - 2, 2, 11, L(BLACKW));
      c.poly([[2, 13], [11, 7], [11, 10], [5, 15], [2, 15]], BLACKW);
      c.line(2, 13, 11, 7, L(BLACKW));
      c.set(1, 12, EBONY);
      c.rect(9, 17, 9, 18, IRON);
      if (!u) {
        c.line(3, 11, 10, 6, BOOK);
        c.line(3, 10, 10, 5, L(BOOK));
        chain(c, 3, 13, 2, 17);
        chain(c, 2, 17, 4, 18);
      } else {
        c.line(2, 11, 11, 5, C.paper);
        c.line(3, 12, 11, 6, BOOK);
        c.set(6, 7, C.paper);
        chain(c, 9, 19, 10, 23);
        c.rect(11, b, 13, b, C.paper);
      }
    },
    su: [0, 0, 1],
  });
  add('gothic-bell-rope-sally', 'bell rope sally church tower ringing pull striped wool bell ringer', {
    w: 12, h: 52,
    f(c, u) {
      const b = c.h - 2,
        y0 = u ? 27 : 17;
      rope(c, 5, 0, 5, y0 - 1);
      rope(c, 6, 0, 6, y0 - 1, D(HEMP));
      for (let y = y0; y <= y0 + 11; y++) {
        const col = [RUBY, C.white, SAPPH][((y - y0) >> 1) % 3];
        c.rect(4, y, 7, y, col);
        c.set(4, y, L(col));
        c.set(7, y, D(col));
      }
      c.rect(5, y0 - 1, 6, y0 - 1, RUBY);
      rope(c, 5, y0 + 12, 5, b - 3);
      rope(c, 6, y0 + 12, 6, b - 3, D(HEMP));
      c.oval(2, b - 3, 9, b, HEMP); // the tail coiled on the floor
      c.row(b - 2, 4, 7, D(HEMP));
      c.set(3, b - 2, L(HEMP));
      if (u) {
        c.oval(1, b - 5, 10, b, HEMP);
        c.row(b - 3, 3, 8, D(HEMP));
        c.row(b - 1, 4, 7, D(HEMP));
        c.set(2, b - 3, L(HEMP));
        dots(c, C.ash, [2, 4, 9, 9, 3, 15, 10, 20, 8, 2]); // dust shaken down
      }
    },
  });
  add('gothic-font-spired-cover', 'font baptismal stone spired wooden cover gothic steeple lid pulley church', {
    w: 20, h: 52, solid: true,
    f(c, u) {
      const b = c.h - 2,
        up = u ? 10 : 0;
      c.rect(3, 32, 16, 38, GSTONE); // the bowl
      c.row(39, 5, 14, GSTONE);
      c.row(32, 3, 16, L(GSTONE));
      c.col(3, 32, 38, L(GSTONE));
      for (let x = 5; x <= 14; x += 3) archPt(c, x, 34, x + 1, 38, GDARK, 2);
      c.rect(7, 40, 12, b - 5, GSTONE);
      c.col(7, 40, b - 5, L(GSTONE));
      c.col(12, 40, b - 5, D(GSTONE));
      c.rect(5, b - 4, 14, b - 3, GSTONE);
      c.rect(3, b - 2, 16, b, GSTONE);
      c.row(b - 2, 3, 16, L(GSTONE));
      dots(c, C.moss, [4, b, 15, b - 1, 5, 39]);
      rope(c, 10, -up, 10, 8 - up);
      const y = (v) => v - up;
      c.rect(3, y(30), 16, y(31), BLACKW); // the cover: a little steeple
      c.row(y(30), 3, 16, L(BLACKW));
      for (let t = 0; t < 18; t++) {
        const hw = Math.round(6 - t / 3);
        c.row(y(29 - t), 10 - hw, 9 + hw, t % 6 === 5 ? EBONY : BLACKW);
        if (t % 6 < 4) for (let x = 10 - hw + 1; x < 9 + hw; x += 2) c.set(x, y(29 - t), VOID);
        c.set(10 - hw, y(29 - t), L(BLACKW));
      }
      c.rect(9, y(9), 10, y(11), BLACKW);
      c.set(9, y(8), BRASS);
      c.set(10, y(8), BRASS);
      if (u) {
        c.rect(4, 31, 15, 31, WAT);
        c.row(31, 6, 9, L(WAT));
        c.set(12, 31, MARBLE); // something pale just under the water
        c.set(13, 31, MARBLE);
        dots(c, WAT, [9, 28, 10, 25, 9, 23]);
      }
    },
    u: [0, 10, 0],
  });
  add('gothic-tomb-effigy-knight', 'tomb effigy knight stone chest lying figure praying hands crusader church monument', {
    w: 44, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 11, 41, b - 2, GSTONE);
      c.row(11, 2, 41, L(GSTONE));
      c.rect(1, b - 1, 42, b, GSTONE);
      c.row(b - 1, 1, 42, L(GSTONE));
      c.rect(1, 10, 42, 10, MARBLE);
      for (const x of [6, 19, 32]) {
        c.rect(x, 13, x + 5, 16, D(GSTONE)); // shields
        c.rect(x + 1, 17, x + 4, 17, D(GSTONE));
        c.set(x + 2, 14, GDARK);
        c.set(x + 3, 15, GDARK);
      }
      c.rect(3, 8, 9, 9, MARBLE); // the pillow
      c.row(8, 3, 9, L(MARBLE));
      c.rect(37, 6, 40, 9, GSTONE); // the hound at his feet
      c.set(40, 5, GSTONE);
      c.set(41, 7, GSTONE);
      c.set(39, 7, K);
      if (!u) {
        c.rect(5, 4, 9, 7, MARBLE); // head, in mail
        c.row(4, 6, 9, L(MARBLE));
        c.set(8, 6, GDARK);
        c.rect(10, 6, 34, 9, MARBLE);
        c.row(5, 11, 20, MARBLE);
        c.row(5, 11, 20, L(MARBLE));
        c.row(6, 21, 33, L(MARBLE));
        c.rect(14, 3, 15, 5, MARBLE); // hands together
        c.set(14, 3, L(MARBLE));
        c.rect(34, 4, 36, 9, MARBLE); // feet
        c.row(9, 10, 33, GSTONE);
        c.line(17, 8, 31, 8, GDARK); // the sword at his side
        c.rect(16, 7, 16, 9, GDARK);
        dots(c, GSTONE, [22, 7, 27, 7, 12, 7]);
      } else {
        c.rect(10, 9, 34, 9, D(GSTONE)); // he has got up
        dots(c, GDARK, [12, 9, 20, 9, 28, 9]);
        c.rect(5, 8, 7, 8, GSTONE);
        c.poly([[16, 13], [24, 12], [26, 18], [18, b - 2], [14, 17]], VOID);
        dots(c, K, [19, 15, 22, 16]);
        dots(c, GSTONE, [13, b, 15, b, 16, b - 1, 22, b, 27, b, 25, b - 1, 29, b]);
        c.rect(19, b - 1, 21, b, MARBLE);
        dots(c, MARBLE, [44, b, 46, b]);
      }
      dots(c, C.moss, [3, b, 40, b - 1, 30, 12]);
    },
    u: [0, 0, 4],
    sw: 18, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 11, 14, b - 2, GSTONE);
      c.row(11, 3, 14, L(GSTONE));
      c.col(3, 11, b - 2, L(GSTONE));
      c.rect(2, b - 1, 15, b, GSTONE);
      c.row(b - 1, 2, 15, L(GSTONE));
      c.rect(2, 10, 15, 10, MARBLE);
      c.rect(6, 13, 11, 16, D(GSTONE));
      c.rect(7, 17, 10, 17, D(GSTONE));
      c.set(8, 14, GDARK);
      c.rect(4, 7, 13, 9, GSTONE); // the hound, end on
      c.rect(7, 5, 10, 7, GSTONE);
      c.set(7, 4, GSTONE);
      c.set(10, 4, GSTONE);
      dots(c, K, [8, 6, 10, 6]);
      if (!u) {
        c.rect(5, 3, 7, 6, MARBLE); // the soles of his feet behind it
        c.rect(10, 3, 12, 6, MARBLE);
        c.set(5, 3, L(MARBLE));
        c.rect(8, 1, 9, 3, L(MARBLE));
      } else {
        dots(c, GSTONE, [16, b, 17, b - 1]);
        c.set(13, 14, VOID);
        c.set(14, 15, VOID);
      }
    },
    su: [0, 0, 2],
  });
  add('gothic-crypt-gate-iron', 'crypt gate iron bars stone arch padlock chain vault entrance skull keystone', {
    w: 26, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      archPt(c, 1, 1, 24, b, GSTONE, 12);
      for (let y = 1; y < 14; y++) for (let x = 1; x <= 12; x++) if (c.get(x, y) && !c.get(x - 1, y)) c.set(x, y, L(GSTONE));
      c.col(1, 13, b, L(GSTONE));
      for (let y = 16; y < b; y += 6) {
        c.row(y, 1, 4, D(GSTONE));
        c.row(y + 3, 21, 24, D(GSTONE));
      }
      archPt(c, 5, 8, 20, b, VOID, 9);
      skull(c, 10, 2);
      const bars = (x0, x1) => {
        for (let y = 9; y <= b; y++)
          for (let x = x0; x <= x1; x++) {
            if (c.get(x, y) !== VOID) continue;
            const v = (x - 5) % 3 === 1,
              h = y === 20 || y === b - 4;
            if (v || h) c.set(x, y, v ? (x < 12 ? L(IRON) : IRON) : D(IRON));
          }
      };
      if (!u) {
        bars(5, 20);
        chain(c, 10, 26, 15, 27, BRASS);
        c.rect(12, 28, 13, 30, BRASS); // padlock
        c.set(12, 29, K);
      } else {
        bars(14, 20);
        c.col(5, 12, b, IRON); // one leaf swung in
        c.col(6, 14, b, D(IRON));
        for (let i = 0; i < 4; i++) c.row(b - i * 2, 7 + i, 13, mix(GSTONE, 0.5 - i * 0.08)); // steps going down
        c.set(9, 27, C.glow); // and a light, far below
        c.set(10, 28, D(C.glow));
        chain(c, 14, 26, 14, 30, BRASS);
        c.rect(8, b - 1, 9, b, BRASS);
      }
      dots(c, C.moss, [2, b, 3, b - 1, 23, b, 22, 20, 2, 30]);
    },
    sw: 10, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 1, 6, b, GSTONE, 6, 5, 4);
      c.col(2, 1, b, L(GSTONE));
      c.col(6, 1, b, D(GSTONE));
      if (!u) {
        c.col(7, 9, b, IRON);
        c.set(7, 28, BRASS);
      } else {
        for (let x = 7; x <= 13; x += 2) c.col(x, 10 + ((x - 7) >> 1), b, x === 7 ? L(IRON) : IRON);
        c.row(20, 7, 13, D(IRON));
        c.row(b - 4, 7, 13, D(IRON));
        c.set(9, b, BRASS);
      }
      dots(c, C.moss, [3, b, 5, b - 1]);
    },
    su: [0, 0, 5],
  });
  add('gothic-ossuary-shelf-skulls', 'ossuary shelf skulls bones charnel house niche catacomb stone memento mori', {
    w: 32, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, 1, 30, b, GSTONE);
      c.rect(1, b - 4, 30, b, GSTONE);
      c.row(b - 4, 1, 30, L(GSTONE));
      dots(c, GDARK, [8, b - 2, 10, b - 2, 12, b - 2, 15, b - 2, 17, b - 2, 20, b - 2, 22, b - 2]);
      for (let r = 0; r < 3; r++) {
        const y = 3 + r * 10;
        c.rect(3, y, 28, y + 8, VOID);
        c.row(y + 8, 3, 28, C.bone); // long bones stacked under them
        c.row(y + 7, 3, 28, D(C.bone));
        for (let x = 4; x <= 28; x += 3) c.set(x, y + 7, C.bone);
        for (let i = 0; i < 4; i++) {
          if (u && r === 1 && i === 2) continue;
          skull(c, 4 + i * 6 + (r % 2), y + 2, i % 2 ? D(C.bone) : C.bone);
        }
      }
      c.rect(26, b - 6, 27, b - 5, WAX);
      if (u) {
        c.set(26, b - 7, C.flame); // someone lit the stub, and took one away
        c.set(26, b - 8, C.flameLight);
        dots(c, C.bone, [17, 20, 20, 20]);
        dots(c, C.glow, [11, 6, 13, 6]);
        dots(c, C.ash, [16, b - 5, 19, b - 5]);
      } else c.set(26, b - 7, K);
    },
    sw: 12, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 1, 8, b, GSTONE);
      c.rect(2, b - 4, 9, b, GSTONE);
      c.row(b - 4, 2, 9, L(GSTONE));
      for (let r = 0; r < 3; r++) {
        const y = 3 + r * 10;
        c.row(y + 4, 4, 7, D(GSTONE));
        if (u && r === 1) continue;
        c.rect(9, y + 3, 9, y + 5, C.bone);
        c.set(9, y + 4, K);
      }
      if (u) {
        c.set(9, b - 6, C.flame);
        c.set(9, b - 5, WAX);
      }
    },
  });
  add('gothic-bat-hung-arch', 'arch ruined stone bats hanging roost abbey cloister pointed gateway', {
    w: 34, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2,
        M = hex('#010203');
      archPt(c, 1, 1, 32, b, GSTONE, 16);
      archPt(c, 7, 8, 26, b, M, 13);
      for (let y = 1; y <= b; y++)
        for (let x = 1; x <= 32; x++) {
          const p = c.get(x, y);
          if (p === M) c.clear(x, y);
          else if (p && (!c.get(x - 1, y) || c.get(x - 1, y) === M) && x < 17) c.set(x, y, L(GSTONE));
        }
      for (let y = 18; y < b; y += 6) {
        c.row(y, 2, 6, D(GSTONE));
        c.row(y + 3, 27, 31, D(GSTONE));
      }
      c.clearRect(20, 1, 24, 4); // a bite out of the crown
      c.clear(19, 3);
      c.clear(25, 5);
      dots(c, D(GSTONE), [12, 5, 9, 9, 22, 7, 28, 14, 4, 15]);
      dots(c, C.leaf, [2, 12, 3, 14, 2, 17, 4, 19, 3, 22, 2, 26, 5, 10, 6, 8]);
      dots(c, C.leafLight, [3, 13, 2, 20, 4, 24]);
      const hang = (x, y) => {
        c.rect(x, y, x + 1, y + 3, PALL);
        c.set(x, y + 4, PALL);
        c.set(x + 1, y + 4, GDARK);
        c.set(x, y + 1, GDARK);
      };
      const fly = (x, y) => {
        c.rect(x + 2, y + 1, x + 3, y + 2, PALL);
        c.line(x, y, x + 1, y + 1, PALL);
        c.line(x + 5, y, x + 4, y + 1, PALL);
        c.set(x, y + 1, GDARK);
        c.set(x + 5, y + 1, GDARK);
      };
      if (!u) {
        hang(10, 12);
        hang(13, 9);
        hang(16, 8);
        hang(19, 10);
        hang(22, 13);
      } else {
        fly(9, 14);
        fly(18, 11);
        fly(14, 21);
        fly(20, 27);
        dots(c, C.white, [12, b, 18, b, 21, b]);
      }
      dots(c, C.moss, [2, b, 30, b, 29, b - 1]);
    },
    sw: 10, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 3, 6, b, GSTONE, 6, 5, 2);
      c.rect(3, 1, 5, 2, GSTONE);
      c.col(2, 3, b, L(GSTONE));
      dots(c, C.leaf, [2, 12, 3, 15, 2, 19, 3, 23]);
      if (!u) {
        c.rect(7, 12, 8, 15, PALL);
        c.set(7, 16, PALL);
        c.set(7, 13, GDARK);
      } else {
        c.rect(10, 15, 11, 16, PALL);
        c.line(8, 14, 9, 15, PALL);
        c.line(13, 14, 12, 15, PALL);
        c.set(8, b, C.white);
      }
      dots(c, C.moss, [3, b, 6, b - 1]);
    },
    su: [0, 0, 5],
  });
  add('gothic-coach-lamp-black-post', 'coach lamp black post lantern gas street light churchyard gate iron', {
    w: 12, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 13, 6, b, EBONY);
      c.col(5, 13, b, GDARK);
      c.rect(4, b - 3, 7, b, EBONY);
      c.rect(3, b, 8, b, GDARK);
      c.rect(4, 24, 7, 25, EBONY);
      c.row(15, 2, 9, EBONY); // the ladder bar
      c.set(2, 15, GDARK);
      c.rect(3, 5, 8, 11, EBONY);
      c.rect(4, 12, 7, 12, EBONY);
      c.rect(4, 6, 7, 10, u ? C.glow : HGLASS);
      c.col(5, 6, 10, u ? C.flameLight : mix(HGLASS, 0.8));
      if (u) {
        c.set(5, 8, C.flame);
        c.set(6, 9, C.flame);
        dots(c, C.bone, [1, 7, 10, 4, 9, 10]); // moths
      } else c.set(4, 7, L(HGLASS));
      c.rect(2, 4, 9, 4, EBONY);
      c.rect(4, 2, 7, 3, EBONY);
      c.row(2, 4, 7, GDARK);
      c.set(5, 1, GDARK);
    },
  });
  add('gothic-coffin-on-trestles', 'coffin on trestles casket wake lying in state lid brass handles funeral', {
    w: 40, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [8, 30]) {
        c.line(x, 13, x - 3, b, EBONY);
        c.line(x + 1, 13, x + 4, b, EBONY);
        c.line(x, 13, x - 2, b, BLACKW);
        c.row(b - 3, x - 2, x + 3, EBONY);
      }
      c.rect(2, 8, 37, 12, COFFIN);
      c.row(12, 2, 37, D(COFFIN));
      c.col(2, 8, 12, L(COFFIN));
      for (const x of [8, 19, 30]) {
        c.rect(x, 10, x + 2, 10, BRASS); // handles
        c.set(x, 11, D(BRASS));
        c.set(x + 2, 11, D(BRASS));
      }
      if (!u) {
        c.rect(2, 6, 37, 7, COFFIN);
        c.row(5, 4, 35, COFFIN);
        c.row(5, 4, 35, L(COFFIN));
        c.row(7, 2, 37, D(COFFIN));
        c.rect(17, 6, 22, 6, BRASS);
      } else {
        c.row(7, 3, 36, SHROUD); // the lining, and the lid lifted from inside
        c.row(7, 3, 12, L(SHROUD));
        c.line(2, 6, 37, 1, COFFIN);
        c.line(2, 5, 37, 0, L(COFFIN));
        c.line(4, 6, 37, 2, D(COFFIN));
        c.rect(26, 5, 28, 7, DEADF); // fingers on the rim
        c.col(27, 7, 8, DEADF);
        c.set(26, 8, DEADF);
        c.set(28, 8, D(DEADF));
        dots(c, VOID, [15, 6, 18, 6, 21, 5, 24, 5, 30, 4, 33, 4]);
      }
    },
    u: [0, 3, 0],
    sw: 16, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, 13, 2, b, BLACKW);
      c.line(10, 13, 13, b, EBONY);
      c.row(b - 3, 4, 11, EBONY);
      c.row(13, 3, 12, EBONY);
      c.poly([[5, 5], [10, 5], [12, 8], [11, 12], [4, 12], [3, 8]], COFFIN);
      c.line(5, 5, 3, 8, L(COFFIN));
      c.row(12, 4, 11, D(COFFIN));
      c.rect(7, 8, 8, 10, BRASS);
      c.rect(6, 9, 9, 9, BRASS);
      if (u) {
        c.row(7, 4, 11, VOID);
        c.line(3, 5, 12, 2, COFFIN);
        c.line(3, 4, 12, 1, L(COFFIN));
        c.rect(9, 5, 10, 7, DEADF);
        c.set(10, 8, DEADF);
      }
    },
    su: [0, 3, 0],
  });
  add('gothic-wrought-iron-fence', 'fence wrought iron railings spear tops graveyard churchyard stone kerb black', {
    w: 34, h: 30, solid: true,
    o: { outline: false, shade: false },
    f(c, u) {
      const b = c.h - 2,
        BAR = hex('#17151c');
      c.rect(0, b - 3, 33, b + 1, K);
      c.rect(1, b - 2, 32, b, GSTONE);
      c.row(b - 2, 1, 32, L(GSTONE));
      c.col(32, b - 2, b, D(GSTONE));
      dots(c, C.moss, [4, b, 5, b - 1, 20, b, 28, b - 2]);
      for (const x of [1, 31]) {
        c.rect(x - 1, 1, x + 2, b - 3, K); // the posts
        c.rect(x, 5, x + 1, b - 3, EBONY);
        c.col(x, 5, b - 3, GDARK);
        c.rect(x, 2, x + 1, 3, EBONY);
        c.set(x, 2, GDARK);
        c.set(x, 4, EBONY);
      }
      c.row(10, 3, 30, BAR);
      c.row(11, 3, 30, K);
      c.row(b - 6, 3, 30, BAR);
      c.row(b - 5, 3, 30, K);
      for (let x = 4; x <= 28; x += 3) {
        const bent = u && (x === 13 || x === 16);
        c.set(x, 3, K);
        c.set(x, 4, GDARK); // spear heads
        c.set(x, 5, BAR);
        c.set(x - 1, 6, K);
        c.set(x + 1, 6, K);
        if (!bent) c.col(x, 6, b - 4, x % 2 ? BAR : EBONY);
        else {
          const s = x === 13 ? -1 : 1;
          c.col(x, 6, 10, BAR); // forced apart
          c.line(x, 11, x + s, 15, BAR);
          c.line(x + s, 15, x, b - 6, BAR);
          c.col(x, b - 6, b - 4, BAR);
        }
      }
      if (u) {
        c.rect(14, 13, 15, 15, SHROUD); // a rag of white caught on the iron
        c.set(15, 16, SHROUD);
        c.set(14, 17, D(SHROUD));
        c.set(15, 12, D(SHROUD));
        dots(c, C.blood, [16, 4, 16, 6, 16, 8, 15, b - 2]);
      }
    },
    sw: 8, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(0, b - 3, 7, b + 1, K);
      c.rect(1, b - 2, 6, b, GSTONE);
      c.row(b - 2, 1, 6, L(GSTONE));
      c.rect(2, 1, 5, b - 3, K);
      c.rect(1, 9, 6, 11, K);
      c.rect(1, b - 7, 6, b - 5, K);
      c.rect(3, 5, 4, b - 3, EBONY);
      c.col(3, 5, b - 3, GDARK);
      c.rect(3, 2, 4, 3, EBONY);
      c.set(3, 2, GDARK);
      c.set(3, 4, EBONY);
      c.rect(2, 10, 5, 10, EBONY);
      c.rect(2, b - 6, 5, b - 6, EBONY);
      if (u) {
        c.rect(5, 13, 6, 15, SHROUD);
        c.set(6, 16, D(SHROUD));
        c.set(5, b - 2, C.blood);
      }
    },
  });
  add('gothic-raven-perch-cross', 'raven perch iron grave cross crow black bird graveyard marker omen', {
    w: 16, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, b - 3, 11, b, GSTONE);
      c.row(b - 3, 4, 11, L(GSTONE));
      c.rect(7, 8, 8, b - 4, IRON);
      c.col(7, 8, b - 4, L(IRON));
      c.rect(2, 13, 13, 14, IRON);
      c.row(13, 2, 13, L(IRON));
      dots(c, IRON, [1, 12, 1, 15, 14, 12, 14, 15, 6, 7, 9, 7]);
      c.line(5, 16, 7, 19, D(IRON)); // scrolls
      c.line(10, 16, 8, 19, D(IRON));
      c.rect(6, 22, 9, 24, GDARK);
      c.set(7, 23, C.bone);
      dots(c, C.rust, [8, 17, 7, 26, 12, 14]);
      if (!u) {
        c.rect(5, 3, 9, 7, PALL); // the raven
        c.rect(8, 1, 10, 3, PALL);
        c.set(11, 2, GDARK);
        c.set(12, 3, GDARK);
        c.set(9, 2, C.white);
        c.line(5, 4, 3, 8, PALL);
        c.set(6, 4, GDARK);
        c.set(7, 5, GDARK);
        c.set(4, 8, PALL);
      } else {
        c.set(11, 12, GOLD); // what it left on the arm
        c.set(12, 12, L(GOLD));
        c.line(3, 18, 5, 21, PALL); // one feather coming down
        c.set(4, 19, GDARK);
        dots(c, C.white, [8, 10, 7, 12, 6, b - 3]);
      }
      dots(c, C.moss, [5, b, 10, b - 2]);
    },
    sw: 12, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 3, 9, b, GSTONE);
      c.row(b - 3, 2, 9, L(GSTONE));
      c.rect(5, 8, 6, b - 4, IRON);
      c.col(5, 8, b - 4, L(IRON));
      c.rect(4, 13, 7, 14, IRON);
      c.set(5, 7, IRON);
      if (!u) {
        c.rect(3, 3, 7, 7, PALL);
        c.rect(6, 1, 8, 3, PALL);
        c.set(9, 2, GDARK);
        c.set(10, 3, GDARK);
        c.set(7, 2, C.white);
        c.line(3, 4, 1, 8, PALL);
        c.set(4, 4, GDARK);
      } else {
        c.set(7, 12, GOLD);
        c.line(8, 18, 9, 21, PALL);
        dots(c, C.white, [6, 10, 4, b - 3]);
      }
    },
  });
  add('gothic-monk-cell-bed', 'monk cell bed plank cot abbey dormitory thin blanket wooden pillow scourge penance', {
    w: 38, h: 18, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 32]) {
        c.rect(x, 11, x + 1, b, EBONY);
        c.col(x, 11, b, BLACKW);
      }
      c.row(b - 2, 5, 31, EBONY);
      board(c, 1, 9, 35, 10, BLACKW);
      c.rect(2, 7, 34, 8, SHROUD); // a thin pallet
      c.row(7, 2, 34, L(SHROUD));
      dots(c, D(SHROUD), [8, 8, 15, 8, 22, 8, 29, 8]);
      c.rect(3, 5, 8, 6, hex('#6a5038')); // a block of wood for the head
      c.row(5, 3, 8, L(hex('#6a5038')));
      c.col(1, 3, 9, BLACKW);
      c.rect(0, 0, 0, 0, null);
      if (!u) {
        c.rect(26, 4, 33, 6, GDARK); // the blanket, folded square
        c.row(4, 26, 33, L(GDARK));
        c.row(6, 26, 33, D(GDARK));
        c.col(35, 6, 12, hex('#6e4a30')); // the scourge on its nail
        c.set(34, 13, hex('#6e4a30'));
        c.set(36, 13, hex('#6e4a30'));
        c.set(35, 14, hex('#6e4a30'));
      } else {
        c.rect(18, 6, 34, 7, GDARK);
        c.rect(27, 3, 33, 5, GDARK);
        c.row(3, 28, 32, L(GDARK));
        c.line(19, 6, 26, 4, GDARK);
        c.line(28, 4, 30, 7, D(GDARK));
        c.line(9, 6, 15, 6, hex('#6e4a30')); // used, and left on the bed
        dots(c, hex('#6e4a30'), [16, 5, 17, 6, 16, 7]);
        dots(c, C.blood, [10, 7, 12, 8, 14, 7, 16, 8, 13, 10, 12, b]);
      }
    },
    sw: 18, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 15, b - 4, BLACKW);
      c.col(2, 3, b - 4, L(BLACKW));
      c.rect(3, 4, 14, b - 5, SHROUD);
      c.row(4, 3, 14, L(SHROUD));
      dots(c, D(SHROUD), [5, 9, 11, 12, 7, 15, 12, 7]);
      c.rect(5, 5, 12, 7, hex('#6a5038'));
      c.row(5, 5, 12, L(hex('#6a5038')));
      if (!u) {
        c.rect(4, 17, 13, b - 5, GDARK);
        c.row(17, 4, 13, L(GDARK));
        c.row(19, 4, 13, D(GDARK));
      } else {
        c.rect(3, 13, 14, b - 5, GDARK);
        c.poly([[3, 13], [10, 10], [14, 13]], GDARK);
        c.line(3, 13, 10, 10, L(GDARK));
        c.line(8, 14, 10, b - 5, D(GDARK));
        c.line(5, 9, 9, 8, hex('#6e4a30'));
        dots(c, C.blood, [6, 10, 8, 11, 11, 9]);
      }
      c.rect(2, b - 3, 15, b - 2, BLACKW);
      c.rect(3, b - 1, 4, b, EBONY);
      c.rect(13, b - 1, 14, b, EBONY);
    },
  });
  void [K, SOOT, wisp, GOLD, WAT];
};
