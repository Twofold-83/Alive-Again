/* Village, part 2: the chapel and the churchyard gate, doors and windows, the green and its market.
 * Part of tools/big/env2-country.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { P, D, L, dots, board, face, panel, post, legs, planksV, planksH, boards, boardsH, hollow, pane, flame, fire, wisp, bush, stones, bricks } = H;
  const { wheel, wheelEdge, barrel, sack, crate, churn, thatch, hay, heap, blood, puddle, drip, shards, grass, crow, tankard, loaf, fish, rope, chain, lantern, shape } = H;
  const add = H.reg('env-village', 'Village');
  const { OAK, GREYW, PALEW, TAR, THATCH, HAY, BRICK, LIME, STONE, SOIL, SOOT, TIN, ZINC, WAT, MILK, ROPE, CANVAS, SACK, MEAT, LAMP } = P;
  const DK = hex('#4f3a2c'), // dark church oak
    BRONZE = hex('#8a7038'),
    TEAL = hex('#56676a'), // faded paint
    TILE = hex('#6a4a40'),
    WICK = hex('#8a6a3a'),
    BARK = hex('#4a3a30');
  const candle = (c, x, yb, lit, h = 3) => {
    c.col(x, yb - h + 1, yb, C.bone);
    if (lit) flame(c, x, yb - h);
  };

  /* ---------- the chapel ---------- */
  add('village-chapel-bell-frame', 'chapel bell in a timber frame bronze bell rope bellcote churchyard toll', {
    w: 26, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 3, 4, b, OAK, 3);
      post(c, 20, 4, b, OAK, 3);
      c.line(6, 12, 9, 6, D(OAK));
      c.line(19, 12, 16, 6, D(OAK));
      board(c, 1, 4, 24, 5, OAK);
      c.poly([[0, 3], [3, 1], [22, 1], [25, 3]], TAR);
      c.row(1, 3, 22, hex('#5a5258'));
      board(c, 1, b - 1, 24, b, OAK);
      c.rect(9, 6, 16, 7, DK); // the yoke
      const sk = u ? -0.45 : 0;
      for (let y = 8; y <= 18; y++) {
        const o = Math.round((y - 8) * sk),
          hw = y < 10 ? 2 : y < 16 ? 3 : y < 18 ? 4 : 5;
        c.row(y, 12 - hw + 1 + o, 12 + hw + o, y === 18 ? D(BRONZE) : BRONZE);
        c.set(12 - hw + 1 + o, y, L(BRONZE));
        c.set(12 + hw + o, y, D(BRONZE));
      }
      c.row(11, u ? 9 : 10, u ? 14 : 15, D(BRONZE));
      if (!u) {
        c.rect(12, 19, 13, 20, C.iron);
        rope(c, 18, 7, 18, 28);
        c.set(17, 29, ROPE);
        c.set(18, 30, ROPE);
        c.set(19, 29, ROPE);
      } else {
        c.rect(12, 19, 13, 20, C.iron); // the clapper flung out
        c.set(14, 20, C.iron);
        rope(c, 18, 7, 17, 22);
        rope(c, 17, 22, 19, 32);
        dots(c, C.bone, [3 + 0, 14, 2, 16, 23, 10, 24, 13]);
      }
      grass(c, [2, 12, 23], b);
    },
    sw: 14, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      post(c, 5, 4, b, OAK, 4);
      c.rect(2, 4, 11, 5, OAK);
      c.poly([[1, 3], [4, 1], [9, 1], [12, 3]], TAR);
      c.row(1, 4, 9, hex('#5a5258'));
      c.rect(2, b - 1, 11, b, OAK);
      c.row(b - 1, 2, 11, L(OAK));
      c.rect(6, 6, 7, 7, DK);
      const dy = u ? 1 : 0;
      for (let y = 8; y <= 18; y++) {
        const hw = y < 10 ? 2 : y < 16 ? 3 : y < 18 ? 4 : 5;
        c.row(y + dy, 7 - hw, 6 + hw, y === 18 ? D(BRONZE) : BRONZE);
        c.set(7 - hw, y + dy, L(BRONZE));
        c.set(6 + hw, y + dy, D(BRONZE));
      }
      c.row(11 + dy, 4, 9, D(BRONZE));
      if (u) {
        c.rect(3, 19, 10, 19, SOOT); // swinging towards us: we look up into it
        c.rect(6, 19, 7, 20, C.iron);
        rope(c, 11, 7, 12, 30);
      } else {
        c.rect(6, 19, 7, 20, C.iron);
        rope(c, 11, 7, 11, 28);
        c.set(12, 29, ROPE);
      }
    },
  });

  add('village-chapel-pew', 'chapel pew church bench oak carved ends hymn book kneeler', {
    w: 34, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      boards(c, 3, 4, 30, 12, DK, 5);
      c.row(4, 3, 30, L(DK));
      c.rect(4, 15, 29, b, mix(DK, 0.55));
      board(c, 3, 13, 30, 14, OAK);
      c.rect(6, b - 2, 27, b - 1, hex('#5a2c34')); // the kneeler
      c.row(b - 2, 6, 27, hex('#74404a'));
      for (const x of [1, 30]) {
        c.rect(x, 3, x + 2, b, OAK);
        c.col(x, 3, b, L(OAK));
        c.rect(x, 1, x + 2, 2, OAK);
        c.set(x + 1, 1, L(OAK));
        c.set(x, 1, null);
        c.set(x + 2, 1, null);
      }
      if (!u) {
        c.rect(8, 11, 12, 12, hex('#5a2c2c')); // a hymn book
        c.row(11, 8, 12, hex('#74403c'));
      } else {
        c.rect(7, 11, 14, 12, C.paper); // left open
        c.col(10, 11, 12, D(C.paper));
        c.set(11, 11, C.blood);
        dots(c, C.bone, [18, 6, 18, 7, 18, 8, 20, 6, 20, 7, 20, 8, 22, 6, 22, 7, 22, 8, 24, 6, 24, 7, 24, 8, 17, 9, 25, 5]); // tally marks scratched in the back
        c.line(17, 9, 25, 5, C.bone);
        c.rect(21, 12, 24, 12, hex('#3a3a44')); // a glove
        c.set(25, 13, hex('#3a3a44'));
      }
    },
    sw: 13, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[6, 3], [9, 3], [10, 12], [10, b], [2, b], [2, 13], [6, 12]], OAK);
      c.rect(6, 1, 9, 2, OAK);
      c.set(6, 1, null);
      c.set(9, 1, null);
      c.col(6, 2, 12, L(OAK));
      c.col(2, 13, b, L(OAK));
      c.row(13, 2, 6, L(OAK));
      c.col(10, 12, b, D(OAK));
      panel(c, 4, 15, 8, b - 2, OAK);
      c.set(7, 6, D(OAK));
      c.set(8, 7, D(OAK));
      c.set(7, 8, D(OAK));
      if (u) {
        c.rect(1, 11, 3, 12, C.paper);
        c.set(2, 11, C.blood);
      } else c.rect(2, 11, 3, 12, hex('#5a2c2c'));
    },
  });

  add('village-chapel-font', 'chapel font stone baptismal font wooden lid holy water church', {
    w: 18, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, b - 1, 13, b, STONE);
      c.row(b - 1, 4, 13, L(STONE));
      c.rect(6, 15, 11, b - 2, STONE);
      c.col(6, 15, b - 2, L(STONE));
      c.col(11, 15, b - 2, D(STONE));
      c.row(15, 5, 12, D(STONE));
      c.poly([[2, 6], [15, 6], [15, 11], [12, 14], [5, 14], [2, 11]], STONE);
      c.row(6, 2, 15, L(STONE));
      c.col(2, 6, 11, L(STONE));
      c.col(15, 7, 11, D(STONE));
      for (const x of [5, 9, 13]) dots(c, D(STONE), [x - 1, 9, x, 8, x, 10, x + 1 > 14 ? 14 : x + 1, 9]);
      dots(c, C.moss, [5, b, 12, b - 1, 3, 11]);
      if (!u) {
        board(c, 2, 4, 15, 5, OAK);
        c.rect(8, 2, 9, 3, OAK);
        c.set(8, 2, C.brass);
      } else {
        c.row(5, 3, 14, hex('#3a2630')); // the lid is off and the water has turned
        c.set(6, 5, hex('#6a2c38'));
        c.set(11, 5, hex('#6a2c38'));
        c.row(4, 2, 15, L(STONE));
        blood(c, [4, 7, 4, 8, 4, 10]);
        c.line(13, b, 16, b - 9, OAK); // the lid leaning on the stem
        c.line(14, b, 17, b - 9, D(OAK));
        c.set(15, b - 5, C.brass);
      }
    },
    u: [0, 0, 2],
  });

  add('village-chapel-lectern', 'chapel lectern reading desk bible book stand church oak', {
    w: 16, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 1, 12, b, DK);
      c.row(b - 1, 3, 12, L(DK));
      c.rect(7, 11, 8, b - 2, DK);
      c.col(7, 11, b - 2, L(DK));
      c.rect(6, 16, 9, 17, DK);
      c.rect(5, b - 3, 10, b - 2, DK);
      face(c, 2, 4, 13, 9, OAK);
      c.rect(1, 10, 14, 10, L(OAK));
      c.row(11, 5, 10, D(OAK));
      if (!u) {
        c.rect(4, 5, 11, 9, hex('#4a2028'));
        c.row(5, 4, 11, hex('#6a3038'));
        c.col(11, 5, 9, C.paper);
        dots(c, C.gold, [7, 7, 8, 7, 7, 6, 8, 6, 7, 8]);
      } else {
        c.rect(3, 5, 12, 9, C.paper); // open, and a page torn out
        c.col(7, 5, 9, D(C.paper));
        for (let y = 6; y < 9; y++) c.row(y, 4, 6, y % 2 ? C.paper : hex('#8a8068'));
        c.rect(9, 5, 12, 9, hex('#9a927a'));
        c.line(9, 5, 12, 8, C.paper);
        c.col(8, 9, 13, C.wine); // the ribbon
        c.rect(11, b - 1, 14, b, C.paper);
        c.set(12, b, hex('#8a8068'));
      }
    },
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 1, 11, b, DK);
      c.row(b - 1, 2, 11, L(DK));
      c.rect(6, 11, 7, b - 2, DK);
      c.col(6, 11, b - 2, L(DK));
      c.rect(5, 16, 8, 17, DK);
      c.rect(4, b - 3, 9, b - 2, DK);
      for (let i = 0; i < 3; i++) c.line(2, 9 + i, 11, 4 + i, i ? OAK : L(OAK)); // the desk sloping to the reader
      c.rect(1, 10, 2, 11, OAK);
      if (!u) {
        c.line(3, 7, 10, 3, hex('#4a2028'));
        c.line(3, 8, 10, 4, hex('#6a3038'));
      } else {
        c.line(3, 7, 10, 3, C.paper);
        c.line(3, 8, 10, 4, D(C.paper));
        c.set(6, 4, C.paper);
        c.set(7, 3, C.paper);
        c.col(3, 9, 12, C.wine);
        c.rect(9, b - 1, 12, b, C.paper);
      }
    },
  });

  add('village-chapel-altar-table', 'chapel altar table communion table white cloth candlesticks wooden cross', {
    w: 34, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      boards(c, 3, 16, 30, b, DK, 7);
      for (const x of [6, 13, 20]) {
        c.rect(x + 1, 18, x + 5, b - 1, mix(DK, 0.6));
        c.set(x + 1, 18, DK);
        c.set(x + 5, 18, DK);
      }
      c.rect(1, 9, 32, 15, C.white);
      c.row(9, 1, 32, L(C.white));
      c.row(15, 1, 32, D(C.white));
      for (let x = 2; x < 32; x += 3) c.set(x, 16, D(C.white));
      c.col(1, 10, 15, D(C.white));
      c.rect(16, 11, 17, 14, C.wine);
      c.row(12, 15, 18, C.wine);
      for (const x of [6, 27]) {
        c.rect(x - 1, 8, x + 1, 8, C.brass);
        c.col(x, 6, 7, C.brass);
        candle(c, x, 5, u, 3);
      }
      if (!u) {
        c.rect(16, 1, 17, 8, OAK);
        c.row(3, 14, 19, OAK);
        c.col(16, 1, 8, L(OAK));
        c.rect(15, 8, 18, 8, DK);
      } else {
        c.rect(12, 7, 21, 8, OAK); // the cross lies on its face
        c.row(7, 12, 21, L(OAK));
        c.rect(18, 6, 19, 8, OAK);
        c.rect(22, 10, 26, 13, hex('#6a2c2c')); // and the cloth is stained
        c.rect(23, 14, 24, 15, hex('#6a2c2c'));
        c.set(21, 11, hex('#6a2c2c'));
        blood(c, [24, 11, 23, 12, 24, 17, 24, 19]);
      }
    },
    sw: 16, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      boards(c, 3, 16, 12, b, DK, 5);
      c.rect(1, 9, 14, 15, C.white);
      c.row(9, 1, 14, L(C.white));
      c.row(15, 1, 14, D(C.white));
      for (let x = 2; x < 14; x += 3) c.set(x, 16, D(C.white));
      c.col(5, 11, 15, D(C.white));
      c.col(10, 11, 15, D(C.white));
      c.rect(6, 8, 8, 8, C.brass);
      c.col(7, 6, 7, C.brass);
      candle(c, 7, 5, u, 3);
      if (!u) {
        c.rect(10, 1, 11, 8, OAK);
        c.col(10, 1, 8, L(OAK));
      } else {
        c.rect(9, 7, 12, 8, OAK);
        c.rect(8, 11, 11, 14, hex('#6a2c2c'));
        blood(c, [9, 16, 9, 18]);
      }
    },
  });

  add('village-chapel-door-arched', 'chapel door arched church door oak iron hinges stone arch ring handle', {
    w: 24, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(1, 1, 22, 24, STONE);
      c.rect(1, 12, 22, b, STONE);
      c.col(1, 12, b, L(STONE));
      for (const y of [14, 20, 26, 32]) {
        c.row(y, 1, 3, D(STONE));
        c.row(y + 3, 20, 22, D(STONE));
      }
      dots(c, D(STONE), [6, 4, 11, 2, 12, 3, 17, 4, 4, 8, 19, 8]);
      dots(c, C.moss, [2, b, 3, b - 1, 21, b, 2, 22, 20, 5]);
      c.oval(4, 4, 19, 22, u ? SOOT : DK);
      c.rect(4, 13, 19, b - 1, u ? SOOT : DK);
      c.rect(1, b, 22, b, L(STONE));
      if (!u) {
        for (let x = 7; x < 19; x += 4) c.col(x, 5, b - 1, D(DK));
        c.col(4, 13, b - 1, L(DK));
        for (const y of [12, 28]) {
          c.row(y, 4, 15, C.ironDark);
          c.set(16, y - 1, C.ironDark);
          c.set(16, y + 1, C.ironDark);
        }
        c.rect(16, 20, 17, 22, C.iron);
        c.set(16, 21, DK);
      } else {
        c.rect(4, 8, 6, b - 1, DK); // the door standing in
        c.col(6, 8, b - 1, D(DK));
        c.col(4, 8, b - 1, L(DK));
        dots(c, C.flame, [11, 24, 14, 24]); // two candles far inside
        dots(c, C.flameLight, [11, 23, 14, 23]);
        dots(c, hex('#3a342e'), [11, 25, 14, 25, 10, 30, 11, 30, 14, 30, 15, 30, 12, 31, 13, 31]);
        c.rect(8, b - 1, 19, b - 1, hex('#2e2a2e'));
      }
    },
    sw: 8, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 6, b, STONE);
      c.col(1, 1, b, L(STONE));
      c.row(1, 1, 6, L(STONE));
      for (let y = 6; y < b; y += 6) c.row(y, 1, 6, D(STONE));
      c.col(4, 2, b, D(STONE));
      dots(c, C.moss, [2, b, 5, b - 1, 5, 4]);
      if (!u) {
        c.col(6, 5, b - 1, DK);
        c.set(7, 21, C.iron);
      } else {
        face(c, 7, 6, 16, b - 1, DK); // the leaf swung out
        for (const y of [12, 28]) c.row(y, 7, 14, C.ironDark);
        c.col(11, 7, b - 1, D(DK));
        c.rect(14, 20, 15, 22, C.iron);
      }
    },
    su: [0, 0, 10],
  });

  add('village-poor-box', 'poor box alms box on a post church offertory padlock coins', {
    w: 12, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 4, 11, b, DK, 3);
      c.rect(3, b, 7, b, DK);
      face(c, 2, 3, 9, 10, OAK);
      c.col(4, 3, 10, C.iron);
      c.col(7, 3, 10, C.iron);
      c.row(2, 2, 9, L(OAK));
      c.rect(5, 2, 6, 2, SOOT);
      if (!u) {
        c.rect(5, 6, 6, 8, C.brass);
        c.set(5, 7, K);
      } else {
        c.rect(3, 5, 8, 9, SOOT); // broken open
        c.set(3, 5, OAK);
        c.set(8, 9, OAK);
        c.line(8, 4, 10, 6, PALEW);
        c.rect(9, 10, 10, 12, C.brass);
        dots(c, C.brass, [8, b, 2, b]);
        dots(c, PALEW, [1, b, 9, b, 10, b - 1]);
      }
    },
    sw: 10, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      post(c, 3, 11, b, DK, 3);
      face(c, 2, 3, 7, 10, OAK);
      c.row(6, 2, 7, C.iron);
      if (!u) c.row(2, 2, 7, L(OAK));
      else {
        c.line(7, 2, 3, 0, OAK); // the lid wrenched up
        c.row(3, 2, 7, SOOT);
        dots(c, C.brass, [1, b, 7, b]);
      }
      c.set(1, 7, C.brass);
    },
    su: [0, 1, 0],
  });

  add('village-lych-gate', 'lych gate roofed churchyard gateway timber tiles coffin gate lantern', {
    w: 44, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[1, 16], [6, 4], [37, 4], [42, 16]], TILE);
      for (let y = 6; y < 16; y += 3) c.row(y, 1, 42, D(TILE));
      for (let y = 4; y < 16; y++) for (let x = 2 + (Math.floor(y / 3) % 2) * 2; x < 42; x += 4) if (c.get(x, y) === TILE && y % 3 !== 0) c.set(x, y, mix(TILE, 0.82));
      c.row(3, 6, 37, D(TILE));
      c.line(1, 16, 6, 4, L(TILE));
      dots(c, C.moss, [8, 9, 9, 10, 20, 13, 31, 7, 35, 12, 14, 5]);
      board(c, 2, 17, 41, 19, OAK);
      dots(c, D(OAK), [12, 18, 14, 18, 16, 18, 19, 18, 21, 18, 24, 18, 26, 18, 29, 18, 31, 18]);
      for (const x of [4, 37]) {
        post(c, x, 20, 33, OAK, 3);
        stones(c, x - 3, 34, x + 5, b, STONE, 4, 5, x);
        c.row(34, x - 3, x + 5, L(STONE));
      }
      c.line(7, 27, 13, 20, D(OAK));
      c.line(36, 27, 30, 20, D(OAK));
      c.col(21, 20, 21, C.iron);
      lantern(c, 19, 22, u);
      const leaf = (x0, x1) => {
        c.frame(x0, 30, x1, b - 1, GREYW);
        c.row(30, x0, x1, L(GREYW));
        for (let x = x0 + 2; x < x1; x += 2) c.col(x, 31, b - 2, D(GREYW));
        c.line(x0 + 1, b - 2, x1 - 1, 31, GREYW);
      };
      if (!u) {
        leaf(10, 21);
        leaf(22, 33);
        c.rect(21, 34, 22, 35, C.iron);
      } else {
        for (const x of [10, 31]) {
          c.rect(x, 30, x + 2, b - 1, GREYW); // the gates standing open
          c.col(x, 30, b - 1, L(GREYW));
          c.col(x + 2, 30, b - 1, D(GREYW));
        }
        dots(c, hex('#8a7a40'), [18, 30, 24, 30, 17, 32, 25, 32]);
      }
      dots(c, C.moss, [2, b, 8, b - 1, 36, b, 41, b - 2]);
    },
    sw: 24, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[1, 16], [11, 3], [12, 3], [22, 16]], OAK);
      c.poly([[5, 16], [11, 8], [12, 8], [18, 16]], D(OAK));
      for (let i = 0; i < 2; i++) {
        c.line(1 - 0, 16 - i, 11, 3 - i + 1, i ? L(TILE) : TILE);
        c.line(22, 16 - i, 12, 3 - i + 1, i ? TILE : D(TILE));
      }
      c.col(11, 9, 15, OAK);
      c.col(12, 9, 15, OAK);
      board(c, 2, 17, 21, 19, OAK);
      post(c, 10, 20, 33, OAK, 4);
      c.line(9, 26, 4, 20, D(OAK));
      c.line(14, 26, 19, 20, D(OAK));
      stones(c, 4, 34, 19, b, STONE, 4, 5, 3);
      c.row(34, 4, 19, L(STONE));
      dots(c, C.moss, [5, b, 12, b - 1, 18, b, 6, 13]);
      if (u) {
        c.frame(14, 30, 22, b - 1, GREYW); // a gate leaf swung towards us
        for (let x = 16; x < 22; x += 2) c.col(x, 31, b - 2, D(GREYW));
        c.row(30, 14, 22, L(GREYW));
        dots(c, LAMP, [8, 24, 8, 25]);
      } else c.col(9, 30, 33, GREYW);
    },
  });

  /* ---------- doors, windows, lamps ---------- */
  add('village-cottage-door', 'cottage door plank door faded paint latch horseshoe stone step village house', {
    w: 22, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 20, b - 1, OAK);
      c.row(2, 1, 20, L(OAK));
      c.col(1, 2, b - 1, L(OAK));
      c.rect(0 + 1, b, 20, b, STONE);
      dots(c, C.iron, [9, 3, 12, 3, 9, 4, 12, 4, 10, 5, 11, 5]); // a horseshoe over the door
      if (!u) {
        boards(c, 3, 6, 18, b - 1, TEAL, 4);
        for (const y of [10, 24, b - 5]) {
          c.row(y, 3, 18, D(TEAL));
          c.row(y + 1, 3, 18, mix(TEAL, 0.85));
        }
        c.rect(15, 20, 16, 21, C.iron);
        c.row(22, 13, 16, C.ironDark);
        dots(c, hex('#8a8f86'), [5, 14, 9, 30, 13, 17, 16, 32, 7, 27]); // flaking
      } else {
        hollow(c, 3, 6, 18, b - 1);
        boards(c, 12, 6, 18, b - 1, TEAL, 3); // ajar
        c.col(12, 6, b - 1, L(TEAL));
        c.col(11, 6, b - 1, mix(TEAL, 0.5));
        for (const y of [10, 24, b - 5]) c.row(y, 12, 18, D(TEAL));
        c.rect(10, 18, 11, 19, C.flesh); // fingers round the edge
        c.set(10, 21, C.flesh);
        c.set(11, 21, C.flesh);
        dots(c, hex('#8a7a40'), [4, b - 1, 5, b - 1, 6, b - 1, 7, b - 2, 4, b - 2]);
      }
    },
    sw: 8, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 5, b - 1, OAK);
      c.col(2, 2, b - 1, L(OAK));
      c.row(2, 2, 5, L(OAK));
      c.rect(1, b, 6, b, STONE);
      if (!u) c.col(1, 6, b - 1, TEAL);
      else {
        c.rect(0, 6, -5, 6, TEAL);
        boards(c, -5, 6, 1, b - 1, TEAL, 3);
        for (const y of [10, 24, b - 5]) c.row(y, -5, 1, D(TEAL));
        c.set(-4, 21, C.iron);
      }
    },
    su: [6, 0, 0],
  });

  add('village-window-shutters', 'cottage window shutters small panes sill flowerpot village house lamp', {
    w: 26, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 2, 18, 19, OAK);
      c.row(2, 7, 18, L(OAK));
      for (const [x, y] of [[8, 3], [13, 3], [8, 11], [13, 11]]) pane(c, x, y, x + 4, y + 7, u);
      c.col(12, 3, 18, OAK);
      c.row(10, 8, 17, OAK);
      for (const x of [1, 19]) {
        boards(c, x, 2, x + 5, 19, TEAL, 3);
        c.row(5, x, x + 5, D(TEAL));
        c.row(16, x, x + 5, D(TEAL));
        c.line(x, 15, x + 5, 6, D(TEAL));
      }
      c.rect(5, 20, 20, 21, STONE);
      c.row(20, 5, 20, L(STONE));
      c.rect(14, 17, 16, 19, hex('#8a4f36')); // a pot on the sill, the plant dead
      c.line(15, 16, 16, 13, hex('#6a5a3a'));
      c.set(14, 14, hex('#6a5a3a'));
      if (u) {
        shape(c, 8, 9, 18, hex('#3a3024')); // somebody at the window
        c.rect(13, 12, 13, 18, hex('#3a3024'));
        c.col(12, 3, 18, OAK);
        c.row(10, 8, 17, OAK);
      } else dots(c, C.ash, [8, 3, 9, 3, 8, 4]);
      dots(c, C.moss, [6, 21, 19, 21]);
      c.rect(8, 22, 9, b, D(STONE));
      c.rect(16, 22, 17, b, D(STONE));
    },
    sw: 7, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 3, 19, OAK);
      c.col(2, 2, 19, L(OAK));
      c.col(4, 2, 19, TEAL);
      c.rect(1, 20, 5, 21, STONE);
      c.row(20, 1, 5, L(STONE));
      c.rect(2, 22, 3, b, D(STONE));
      c.rect(1, 17, 2, 19, hex('#8a4f36'));
      c.set(1, 15, hex('#6a5a3a'));
      c.set(1, 16, hex('#6a5a3a'));
      if (u) dots(c, LAMP, [1, 5, 1, 8, 1, 12]);
    },
  });

  add('village-lantern-post', 'lantern post wooden lamp post village street light oil lamp', {
    w: 13, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 5, 9, b, OAK, 3);
      c.rect(4, b - 3, 8, b, OAK);
      c.col(4, b - 3, b, L(OAK));
      c.row(13, 2, 10, C.iron); // the lamplighter's bar
      c.rect(4, 8, 8, 8, C.iron);
      lantern(c, 4, 1, u);
      c.set(6, 0 + 1, C.iron);
      if (u) dots(c, C.bone, [2, 3, 10, 5, 11, 2, 1, 7]); // moths
      grass(c, [2, 10], b);
    },
  });

  /* ---------- the green ---------- */
  add('village-milk-churns', 'milk churns on a stand tin cans dairy collection village', {
    w: 26, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [3, 21], 16, b, GREYW);
      c.line(5, b, 20, 17, D(GREYW));
      board(c, 1, 14, 24, 15, GREYW);
      churn(c, 3, 13, 6, 12);
      c.rect(18, 9, 21, 13, TIN); // a can
      c.row(9, 18, 21, L(TIN));
      c.set(22, 10, TIN);
      c.set(22, 11, TIN);
      if (!u) churn(c, 10, 13, 6, 12);
      else {
        c.rect(8, b - 5, 19, b, TIN); // one churn down
        c.col(8, b - 5, b, L(TIN));
        c.rect(20, b - 4, 22, b - 1, TIN);
        c.col(23, b - 5, b, D(TIN));
        c.row(b - 5, 8, 19, L(TIN));
        c.row(b, 8, 19, D(TIN));
        c.row(b, 1, 7, MILK); // and the milk in the dust
        c.row(b - 1, 4, 7, MILK);
        c.row(b, 22, 24, MILK);
        dots(c, MILK, [11, 15, 11, 16, 12, 14]);
      }
    },
    sw: 14, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 10], 16, b, GREYW);
      board(c, 1, 14, 12, 15, GREYW);
      churn(c, 4, 13, 6, 12);
      if (u) {
        c.oval(3, b - 6, 9, b, TIN); // the fallen one, mouth to us
        c.oval(4, b - 5, 8, b - 1, SOOT);
        c.row(b - 1, 5, 7, MILK);
        c.row(b, 4, 12, MILK);
      }
    },
  });

  const skep = (c, x, yb, w = 8, h = 9) => {
    c.oval(x, yb - h + 1, x + w - 1, yb + h - 2, THATCH);
    for (let y = yb + 1; y <= yb + h; y++) c.clearRect(x, y, x + w - 1, y);
    for (let y = yb - h + 3; y <= yb; y += 2) for (let i = x; i < x + w; i++) if (c.get(i, y) === THATCH) c.set(i, y, D(THATCH));
    c.set(x + 1, yb - h + 3, L(THATCH));
    c.set(x + 2, yb - h + 2, L(THATCH));
    c.rect(x + (w >> 1) - 1, yb, x + (w >> 1), yb, SOOT);
  };
  const bees = (c, x0, y0, x1, y1, n, seed) => {
    const r = rnd(seed);
    for (let i = 0; i < n; i++) c.set(x0 + Math.floor(r() * (x1 - x0 + 1)), y0 + Math.floor(r() * (y1 - y0 + 1)), r() < 0.5 ? C.mustard : SOOT);
  };
  add('village-beehive-skeps', 'beehives straw skeps on a bench bee hives honey bees village garden', {
    w: 30, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [3, 25], 16, b, GREYW);
      board(c, 1, 14, 28, 15, GREYW);
      skep(c, 2, 13);
      skep(c, 11, 13);
      if (!u) {
        skep(c, 20, 13);
        bees(c, 9, 4, 20, 12, 3, 4);
      } else {
        c.oval(14, b - 7, 22, b, THATCH); // one knocked off the bench
        c.oval(18, b - 6, 22, b - 1, SOOT);
        for (let x = 15; x < 18; x += 2) c.col(x, b - 5, b - 1, D(THATCH));
        dots(c, hex('#b08a30'), [20, b - 2, 21, b - 3, 23, b, 24, b]); // comb and honey
        bees(c, 6, -4, 28, 12, 26, 7);
        bees(c, 18, 8, 28, b - 2, 9, 9);
      }
    },
    u: [0, 5, 0],
    sw: 14, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 10], 16, b, GREYW);
      board(c, 1, 14, 12, 15, GREYW);
      skep(c, 3, 13);
      if (!u) bees(c, 2, 5, 11, 12, 2, 3);
      else {
        c.oval(4, b - 6, 10, b, THATCH);
        for (let y = b - 4; y < b; y += 2) c.row(y, 5, 9, D(THATCH));
        dots(c, hex('#b08a30'), [11, b, 3, b]);
        bees(c, 1, -4, 12, 12, 16, 5);
      }
    },
    su: [0, 5, 0],
  });

  const tree = (c, u, seed, nx) => {
    const b = c.h - 2;
    c.poly([[17, 24], [23, 24], [23, b - 4], [26, b], [14, b], [17, b - 4]], BARK);
    c.col(17, 24, b - 4, L(BARK));
    c.col(20, 26, b, D(BARK));
    c.col(22, 25, b - 2, D(BARK));
    c.line(17, 30, 10, 24, BARK);
    c.line(23, 30, 31, 23, BARK);
    c.line(23, 31, 31, 24, D(BARK));
    bush(c, 2, 8, 20, 27, seed);
    bush(c, 18, 9, 37, 28, seed + 1);
    bush(c, 8, 1, 31, 20, seed + 2);
    dots(c, hex('#7a5a34'), [6, 20, 12, 9, 22, 5, 30, 14, 33, 22, 15, 24]); // leaves turning
    for (let x = 9; x <= 31; x += 3) c.col(x, 45, b, D(GREYW));
    board(c, 8, 43, 32, 44, GREYW);
    c.rect(14, 45, 26, b - 3, mix(BARK, 0.7));
    c.rect(16, b - 2, 24, b, BARK);
    dots(c, hex('#7a5a34'), [4, b, 11, b, 29, b, 35, b, 20, 42, 12, 42]);
    if (u) {
      rope(c, nx, 26, nx, 34); // a rope over the bough, with a loop tied in it
      c.set(nx - 1, 35, ROPE);
      c.set(nx + 1, 35, ROPE);
      c.set(nx - 1, 36, ROPE);
      c.set(nx + 1, 36, ROPE);
      c.set(nx, 37, ROPE);
      c.rect(nx - 3, b - 4, nx + 2, b - 3, OAK); // and a stool kicked over
      c.line(nx - 3, b - 2, nx - 4, b, OAK);
      c.col(nx + 2, b - 2, b, D(OAK));
      c.rect(10, 41, 13, 42, hex('#2c2a30')); // a hat left on the bench
      c.row(42, 9, 14, hex('#2c2a30'));
    }
  };
  add('village-bench-under-tree', 'bench under a tree old lime tree round seat village green', {
    w: 40, h: 56, solid: true,
    f: (c, u) => tree(c, u, 3, 31),
    sw: 40, sh: 56,
    s: (c, u) => tree(c, u, 11, 28),
  });

  add('village-grave-stranger', 'grave of a stranger fresh mound earth wooden cross no name wilted flowers', {
    w: 34, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        heap(c, 7, 31, b, 5, SOIL, 3);
        post(c, 4, 3, b, GREYW);
        c.rect(1, 6, 8, 7, GREYW);
        c.row(6, 1, 8, L(GREYW));
        dots(c, hex('#8a6a7a'), [13, b - 5, 15, b - 6, 17, b - 5]); // flowers gone over
        dots(c, hex('#5a6a44'), [12, b - 4, 14, b - 5, 16, b - 4, 18, b - 4]);
        dots(c, STONE, [8, b, 12, b, 20, b, 27, b, 31, b]);
      } else {
        c.line(4, b, 1, 4, GREYW); // dug up again; the cross knocked askew
        c.line(5, b, 2, 4, D(GREYW));
        c.line(0, 9, 6, 6, GREYW);
        c.rect(8, b - 1, 22, b, SOOT);
        c.row(b - 2, 8, 22, mix(SOIL, 0.6));
        heap(c, 22, 32, b, 7, SOIL, 5);
        c.rect(12, b - 1, 18, b - 1, hex('#5c4a38')); // a corner of the box
        c.line(19, b - 2, 24, 3, OAK); // the spade
        c.rect(18, b - 2, 20, b, C.iron);
        dots(c, SOIL, [6, b, 7, b - 1, 33, b]);
      }
      grass(c, [2, 32], b);
    },
    sw: 18, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        heap(c, 3, 14, b, 5, SOIL, 4);
        post(c, 8, 3, b - 3, GREYW);
        c.rect(4, 6, 13, 7, GREYW);
        c.row(6, 4, 13, L(GREYW));
        dots(c, hex('#8a6a7a'), [6, b - 4, 11, b - 4]);
        dots(c, STONE, [2, b, 15, b]);
      } else {
        c.line(8, b - 2, 6, 3, GREYW);
        c.line(9, b - 2, 7, 3, D(GREYW));
        c.line(3, 8, 11, 5, GREYW);
        c.oval(3, b - 3, 14, b, SOOT);
        c.row(b - 3, 5, 12, mix(SOIL, 0.6));
        heap(c, 13, 16, b, 5, SOIL, 6);
        heap(c, 1, 3, b, 3, SOIL, 7);
        c.row(b - 1, 7, 10, hex('#5c4a38'));
      }
    },
  });

  add('village-market-cross', 'market cross stone cross on steps village green old weathered', {
    w: 26, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stones(c, 1, b - 3, 24, b, STONE, 4, 6, 2);
      stones(c, 4, b - 7, 21, b - 4, STONE, 4, 6, 3);
      stones(c, 7, b - 11, 18, b - 8, STONE, 4, 6, 4);
      c.rect(11, 10, 14, b - 12, STONE);
      c.col(11, 10, b - 12, L(STONE));
      c.col(14, 10, b - 12, D(STONE));
      c.rect(10, 11, 15, 12, STONE);
      c.rect(10, b - 14, 15, b - 12, STONE);
      c.rect(11, 2, 14, 9, STONE);
      c.rect(7, 4, 18, 7, STONE);
      c.row(4, 7, 18, L(STONE));
      c.col(11, 2, 4, L(STONE));
      c.row(7, 7, 18, D(STONE));
      c.set(18, 4, null); // a piece broken off
      c.set(18, 5, null);
      dots(c, D(STONE), [12, 16, 13, 20, 12, 25, 13, 5, 12, 6]);
      dots(c, C.moss, [2, b, 9, b - 4, 20, b - 3, 12, 30, 11, 22, 8, 7, 16, b - 9]);
      if (u) {
        c.line(11, 17, 14, 20, C.blood); // a sign daubed on the shaft
        c.line(14, 17, 11, 20, C.blood);
        c.row(22, 11, 14, C.blood);
        for (const [x, y] of [[6, b - 8], [9, b - 12], [19, b - 8]]) {
          c.col(x, y - 2, y, C.bone);
          flame(c, x, y - 3);
        }
        c.rect(13, b - 13, 17, b - 12, hex('#18161c')); // a dead crow laid on the step
        c.set(18, b - 13, hex('#55525c'));
        c.set(12, b - 12, hex('#18161c'));
        blood(c, [15, b - 11, 15, b - 10]);
      }
    },
    sw: 26, sh: 48,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 1, b - 3, 24, b, STONE, 4, 6, 5);
      stones(c, 4, b - 7, 21, b - 4, STONE, 4, 6, 6);
      stones(c, 7, b - 11, 18, b - 8, STONE, 4, 6, 7);
      c.rect(11, 2, 14, b - 12, STONE);
      c.col(11, 2, b - 12, L(STONE));
      c.col(14, 2, b - 12, D(STONE));
      c.rect(10, 11, 15, 12, STONE);
      c.rect(10, b - 14, 15, b - 12, STONE);
      c.rect(10, 4, 15, 7, STONE); // the arms, end on
      c.row(4, 10, 15, L(STONE));
      c.row(7, 10, 15, D(STONE));
      dots(c, D(STONE), [12, 16, 13, 20, 12, 25]);
      dots(c, C.moss, [3, b, 10, b - 4, 21, b - 3, 12, 31, 16, b - 9]);
      if (u) {
        blood(c, [11, 18, 11, 19, 11, 22]);
        for (const [x, y] of [[8, b - 12], [20, b - 8]]) {
          c.col(x, y - 2, y, C.bone);
          flame(c, x, y - 3);
        }
        c.rect(15, b - 13, 17, b - 12, hex('#18161c'));
      }
    },
  });

  add('village-fish-stall', 'fish stall fishmonger slab herring roofed stand scales bucket market', {
    w: 32, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2,
        SLAB = hex('#6f7a7c');
      post(c, 2, 6, b, GREYW);
      post(c, 28, 6, b, GREYW);
      c.poly([[0, 7], [3, 2], [28, 2], [31, 7]], TAR);
      c.row(2, 3, 28, hex('#5a5258'));
      for (let x = 6; x < 30; x += 5) c.line(x, 3, x - 1, 7, hex('#2c262a'));
      c.col(24, 8, 10, C.iron); // the scales
      c.row(11, 21, 27, C.brass);
      c.col(21, 12, 13, C.iron);
      c.col(27, 12, 13, C.iron);
      c.row(14, 20, 22, C.brass);
      c.row(14, 26, 28, C.brass);
      c.rect(3, 17, 28, 21, SLAB); // the slab tilted to the buyer
      c.row(17, 3, 28, L(SLAB));
      c.row(21, 3, 28, D(SLAB));
      boards(c, 4, 22, 27, b, GREYW, 5);
      c.rect(10, b - 5, 15, b, ZINC); // a pail
      c.row(b - 5, 10, 15, L(ZINC));
      if (!u) {
        fish(c, 5, 19, 8);
        fish(c, 14, 19, 8);
        fish(c, 9, 20, 7, hex('#7c8890'));
        fish(c, 20, 20, 7);
        dots(c, hex('#4a6a44'), [4, 18, 13, 18, 23, 18, 27, 19]);
      } else {
        c.rect(5, 19, 6, 20, hex('#8f9aa0')); // heads and bones, and the flies
        c.set(5, 19, K);
        c.row(19, 8, 12, C.bone);
        dots(c, C.bone, [8, 18, 10, 18, 12, 18, 8, 20, 10, 20, 12, 20]);
        c.rect(19, 19, 20, 20, hex('#8f9aa0'));
        c.set(19, 19, K);
        blood(c, [15, 19, 16, 20, 22, 19, 23, 20, 17, 22, 17, 24, 24, 18]);
        dots(c, SOOT, [9, 14, 14, 15, 18, 13, 7, 12, 12, 11, 23, 16]);
        c.row(b - 6, 11, 14, C.blood);
      }
    },
    sw: 18, sh: 34,
    s(c, u) {
      const b = c.h - 2,
        SLAB = hex('#6f7a7c');
      post(c, 13, 3, b, GREYW);
      post(c, 3, 8, 17, GREYW);
      for (let i = 0; i < 2; i++) c.line(1, 8 + i, 16, 2 + i, i ? hex('#2c262a') : TAR);
      for (let i = 0; i < 3; i++) c.line(2, 21 - i, 14, 17 - i, i === 2 ? L(SLAB) : SLAB);
      c.poly([[4, 22], [14, 19], [14, b], [4, b]], GREYW);
      c.col(4, 22, b, L(GREYW));
      c.col(9, 21, b, D(GREYW));
      c.rect(1, b - 5, 3, b, ZINC);
      c.set(1, b - 5, L(ZINC));
      c.col(9, 6, 9, C.iron);
      c.row(10, 8, 10, C.brass);
      if (!u) {
        c.line(4, 18, 8, 17, hex('#8f9aa0'));
        c.line(9, 16, 12, 15, hex('#7c8890'));
      } else {
        c.set(4, 18, hex('#8f9aa0'));
        dots(c, C.bone, [7, 17, 9, 16]);
        blood(c, [5, 19, 3, 21, 3, 23, 11, 16]);
        dots(c, SOOT, [6, 13, 10, 12, 4, 14]);
      }
    },
  });

  add('village-butchers-rail', 'butchers rail hooks hanging meat carcass ham fowl sausages village shambles', {
    w: 30, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, OAK, 3);
      post(c, 25, 2, b, OAK, 3);
      board(c, 1, 3, 28, 4, OAK);
      c.row(6, 5, 24, C.iron);
      for (const x of [8, 14, 19, 23]) {
        c.col(x, 7, 8, C.iron);
        c.set(x - 1, 9, C.steel);
      }
      // two fowl
      for (const x of [18, 22]) {
        c.rect(x, 10, x + 1, 15, hex('#6a5a4a'));
        c.set(x, 16, hex('#8a3a2c'));
        c.set(x + 1, 10, hex('#a8904e'));
        c.set(x, 12, hex('#84705c'));
      }
      c.rect(12, 9, 15, 15, hex('#7a4038')); // a ham
      c.rect(13, 16, 14, 17, C.bone);
      c.set(12, 9, null);
      c.col(12, 10, 15, hex('#94564a'));
      if (!u) {
        c.rect(6, 9, 10, 27, MEAT); // half a pig
        c.col(6, 9, 27, L(MEAT));
        for (let y = 12; y < 22; y += 2) c.row(y, 7, 9, C.bone);
        c.rect(7, 28, 9, 30, MEAT);
        c.set(8, 31, C.bone);
        c.col(10, 9, 27, D(MEAT));
      } else {
        blood(c, [7, 10, 7, 12, 7, 15, 8, 19, 7, 23, 7, 27]); // the hook is empty and still dripping
        c.row(b, 4, 12, C.blood);
        c.row(b - 1, 6, 9, C.blood);
        dots(c, C.blood, [14, b, 16, b, 18, b - 0, 21, b]); // and a trail going off
      }
      c.rect(11, b - 4, 15, b, ZINC);
      c.row(b - 4, 11, 15, u ? C.blood : L(ZINC));
    },
    sw: 10, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      post(c, 3, 2, b, OAK, 4);
      c.rect(2, 3, 7, 4, OAK);
      c.row(3, 2, 7, L(OAK));
      c.col(1, 6, 8, C.iron);
      if (!u) {
        c.rect(1, 9, 2, 27, MEAT);
        c.col(1, 9, 27, L(MEAT));
        c.set(1, 28, MEAT);
      } else {
        blood(c, [1, 10, 1, 14, 1, 20, 1, 26]);
        c.row(b, 0, 2, C.blood);
      }
      c.rect(7, 10, 8, 15, hex('#6a5a4a'));
      c.set(7, 16, hex('#8a3a2c'));
    },
  });

  add('village-washing-trough', 'washing trough stone wash place laundry washboard linen soap village', {
    w: 34, h: 18, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      stones(c, 2, 8, 31, b, STONE, 4, 7, 3);
      c.rect(1, 6, 32, 7, L(STONE));
      c.row(7, 1, 32, STONE);
      c.row(6, 3, 30, u ? hex('#5e3a40') : hex('#3c5560'));
      if (!u) dots(c, hex('#6f8f98'), [6, 6, 14, 6, 22, 6]);
      else dots(c, C.white, [5, 6, 6, 6, 9, 6, 15, 6, 16, 6, 21, 6, 27, 6]); // suds
      c.rect(4, 2, 9, 8, ZINC); // the washboard
      for (let y = 3; y < 8; y += 2) c.row(y, 5, 8, L(ZINC));
      c.frame(4, 2, 9, 8, PALEW);
      c.rect(11, 5, 13, 6, hex('#b0a070')); // soap
      if (!u) {
        c.rect(22, 3, 30, 6, C.white); // linen heaped on the rim
        c.row(3, 23, 29, L(C.white));
        c.rect(27, 7, 30, 11, C.white);
        c.col(28, 7, 11, D(C.white));
        c.row(6, 22, 26, D(C.white));
      } else {
        c.rect(20, 5, 30, 6, hex('#8a3a3a')); // something being washed that will not come clean
        c.rect(26, 7, 30, 12, hex('#8a3a3a'));
        c.col(28, 7, 12, hex('#6a2828'));
        c.row(5, 20, 30, hex('#a85050'));
        drip(c, 27, 13, b - 1, C.blood);
        drip(c, 30, 13, b - 2, C.blood);
        c.row(b, 25, 32, hex('#5e3a40'));
      }
      dots(c, C.moss, [3, b, 4, b - 1, 16, b, 30, b - 1, 12, 10]);
    },
    sw: 16, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 8, 13, b, STONE, 4, 7, 4);
      c.rect(1, 6, 14, 7, L(STONE));
      c.row(7, 1, 14, STONE);
      c.row(6, 3, 12, u ? hex('#5e3a40') : hex('#3c5560'));
      if (!u) {
        c.rect(5, 3, 12, 6, C.white);
        c.row(3, 6, 11, L(C.white));
        c.rect(9, 7, 12, 11, C.white);
        c.col(10, 7, 11, D(C.white));
      } else {
        c.rect(5, 5, 12, 6, hex('#8a3a3a'));
        c.row(5, 5, 12, hex('#a85050'));
        c.rect(8, 7, 12, 12, hex('#8a3a3a'));
        c.col(10, 7, 12, hex('#6a2828'));
        drip(c, 9, 13, b - 1, C.blood);
        c.row(b, 7, 14, hex('#5e3a40'));
      }
      dots(c, C.moss, [3, b, 12, b]);
    },
  });

  add('village-washing-line', 'washing line posts clothes line sheet shirt stockings pegs laundry basket', {
    w: 42, h: 34, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 3, b, GREYW);
      post(c, 38, 3, b, GREYW);
      c.row(4, 1, 4, GREYW);
      c.row(4, 37, 40, GREYW);
      c.line(3, 5, 20, 7, ROPE);
      c.line(20, 7, 38, 5, ROPE);
      c.rect(7, 7, 19, 23, C.white); // a sheet
      c.col(7, 7, 23, L(C.white));
      for (const x of [10, 14, 17]) c.col(x, 9, 23, D(C.white));
      c.row(23, 7, 19, D(C.white));
      dots(c, OAK, [8, 6, 13, 6, 18, 6, 23, 6, 28, 6, 32, 5, 35, 5]);
      c.rect(31, 6, 32, 15, hex('#4a4a50')); // stockings
      c.rect(34, 6, 35, 14, hex('#4a4a50'));
      c.set(33, 15, hex('#4a4a50'));
      c.set(36, 14, hex('#4a4a50'));
      c.rect(3, b - 3, 10, b, hex('#8a6a3a')); // the basket
      c.row(b - 3, 3, 10, L(hex('#8a6a3a')));
      for (let x = 4; x < 10; x += 2) c.set(x, b - 1, D(hex('#8a6a3a')));
      if (!u) {
        c.rect(22, 7, 28, 16, hex('#6a7480')); // a shirt
        c.rect(20, 8, 21, 12, hex('#6a7480'));
        c.rect(29, 8, 30, 12, hex('#6a7480'));
        c.col(25, 7, 10, D(hex('#6a7480')));
        c.row(b - 4, 4, 9, C.white);
      } else {
        c.rect(11, 12, 14, 16, hex('#5a2c2c')); // a hand has been wiped on the sheet
        dots(c, hex('#5a2c2c'), [11, 10, 11, 11, 12, 10, 13, 9, 13, 10, 14, 11, 15, 13, 12, 17, 13, 18, 13, 20]);
        c.rect(21, b - 2, 29, b, hex('#6a7480')); // the shirt in the mud
        c.row(b - 3, 23, 27, hex('#6a7480'));
        c.row(b, 21, 29, D(hex('#6a7480')));
        dots(c, OAK, [24, 8, 31, b]);
      }
    },
    sw: 9, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      post(c, 3, 3, b, GREYW, 3);
      c.rect(2, 4, 6, 4, GREYW);
      c.set(4, 5, ROPE);
      c.rect(4, 7, 5, 23, C.white);
      c.col(4, 7, 23, L(C.white));
      c.rect(1, b - 3, 4, b, hex('#8a6a3a'));
      if (u) {
        c.rect(4, 11, 4, 16, hex('#5a2c2c'));
        c.rect(5, b - 1, 7, b, hex('#6a7480'));
      } else c.rect(6, 7, 6, 16, hex('#6a7480'));
    },
  });

  add('village-fingerpost', 'fingerpost signpost crossroads wooden arms directions village road', {
    w: 28, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 13, 4, b, LIME, 3);
      c.rect(13, 30, 15, b, hex('#2c2a30'));
      c.rect(13, 2, 15, 3, hex('#2c2a30'));
      c.set(14, 1, hex('#2c2a30'));
      const arm = (x0, x1, y, left) => {
        c.rect(x0, y, x1, y + 3, LIME);
        c.row(y, x0, x1, L(LIME));
        c.row(y + 3, x0, x1, D(LIME));
        const e = left ? x0 : x1;
        c.set(e, y, null);
        c.set(e, y + 3, null);
        for (let x = x0 + 2; x < x1 - 1; x += 2) if ((x * 7) % 5) c.set(x, y + 1 + (x % 2), SOOT);
      };
      arm(16, 26, 12, false);
      c.rect(12, 18, 16, 21, LIME); // the arm that points at us
      c.frame(12, 18, 16, 21, D(LIME));
      if (!u) arm(2, 12, 6, true);
      else {
        c.rect(10, 7, 13, 18, LIME); // one arm hanging by a nail
        c.col(10, 7, 18, L(LIME));
        c.col(13, 7, 18, D(LIME));
        c.set(10, 18, null);
        c.set(13, 18, null);
        for (let y = 9; y < 17; y += 2) c.set(11 + (y % 3 ? 0 : 1), y, SOOT);
        c.set(12, 7, C.iron);
        c.line(18, 12, 24, 15, C.blood); // and the other struck out
        c.line(24, 12, 18, 15, C.blood);
      }
      grass(c, [11, 18], b);
    },
    sw: 22, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      post(c, 9, 4, b, LIME, 3);
      c.rect(9, 30, 11, b, hex('#2c2a30'));
      c.rect(9, 2, 11, 3, hex('#2c2a30'));
      c.set(10, 1, hex('#2c2a30'));
      c.rect(8, 12, 12, 15, LIME);
      c.frame(8, 12, 12, 15, D(LIME));
      c.rect(1, 18, 9, 21, LIME);
      c.row(18, 1, 9, L(LIME));
      c.row(21, 1, 9, D(LIME));
      c.set(1, 18, null);
      c.set(1, 21, null);
      dots(c, SOOT, [3, 19, 5, 20, 7, 19]);
      if (!u) {
        c.rect(8, 6, 12, 9, LIME);
        c.frame(8, 6, 12, 9, D(LIME));
      } else {
        c.rect(9, 7, 11, 18, L(LIME));
        c.col(11, 7, 18, D(LIME));
        c.set(10, 7, C.iron);
        blood(c, [9, 13, 11, 14]);
      }
      grass(c, [7, 14], b);
    },
  });

  add('village-pillory', 'pillory whipping post head and hands board punishment village square', {
    w: 24, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2,
        up = u ? 4 : 0;
      post(c, 10, 6, b - 3, OAK, 4);
      board(c, 4, b - 3, 19, b - 2, GREYW);
      c.rect(6, b - 1, 7, b, D(GREYW));
      c.rect(16, b - 1, 17, b, D(GREYW));
      c.line(9, b - 4, 6, b - 3, D(OAK));
      c.line(14, b - 4, 17, b - 3, D(OAK));
      face(c, 2, 10, 21, 14, GREYW);
      face(c, 2, 5 - up, 21, 9 - up, GREYW);
      const holes = [[5, 1], [11, 2], [17, 1]];
      for (const [x, r] of holes) {
        if (u) {
          c.clearRect(x, 10, x + r, 10 + (r > 1 ? 1 : 0));
          c.clearRect(x, 9 - up - (r > 1 ? 1 : 0), x + r, 9 - up);
        } else c.rect(x, 9 - (r > 1 ? 1 : 0), x + r, 10 + (r > 1 ? 1 : 0), SOOT);
      }
      c.rect(1, 6 - up, 1, 13, C.iron);
      if (u) c.clearRect(1, 10 - up, 1, 9);
      if (!u) c.rect(21, 8, 22, 11, C.brass);
      else {
        c.rect(22, 11, 23, 13, C.brass);
        blood(c, [11, 11, 12, 12, 11, 13, 12, 15, 12, 18, 5, 11, 18, 11]);
        c.line(4, 15, 3, 22, ROPE);
        c.set(4, 23, ROPE);
      }
      c.row(4 - up, 2, 21, L(GREYW));
      grass(c, [3, 20], b);
    },
    u: [0, 3, 0],
    sw: 12, sh: 42,
    s(c, u) {
      const b = c.h - 2,
        up = u ? 4 : 0;
      post(c, 4, 6, b - 3, OAK, 4);
      board(c, 1, b - 3, 10, b - 2, GREYW);
      c.rect(2, b - 1, 3, b, D(GREYW));
      c.rect(8, b - 1, 9, b, D(GREYW));
      c.rect(3, 10, 8, 14, GREYW);
      c.rect(3, 5 - up, 8, 9 - up, GREYW);
      c.col(3, 5 - up, 9 - up, L(GREYW));
      c.col(3, 10, 14, L(GREYW));
      c.row(4 - up, 3, 8, L(GREYW));
      c.row(14, 3, 8, D(GREYW));
      if (!u) c.rect(5, 8, 6, 11, C.brass);
      else {
        c.rect(5, 12, 6, 14, C.brass);
        blood(c, [4, 11, 4, 15, 4, 18]);
      }
    },
    su: [0, 3, 0],
  });
};
