/* Medieval, part 5: war room and tilt-yard, gate and green, small things of the table. Part of tools/big/env2-medieval.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix } = kit;
  const { D, L, dots, board, face, wisp, planksV, planksH, stones, wheel, wheelEdge, chain, rope, candle, post, straps, archPt } = H;
  const add = H.reg('env-medieval', 'Medieval');
  const { OAK, DOAK, PINE, CANVAS, HEMP, RED, BLUE, SOOT, LEATHER, PEWTER, MSTONE, WAT, WAX } = H.MED;
  const IRON = C.iron,
    STEEL = C.steel,
    GOLD = C.gold,
    LIME = hex('#b4ae9c'),
    PASS = hex('#16141a');

  add('medieval-candle-stand-pricket', 'candle stand iron pricket three candles tall floor candlestick hall chapel', {
    w: 12, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 12, 6, b - 2, IRON);
      c.col(5, 12, b - 2, L(IRON));
      c.rect(4, 20, 7, 21, IRON);
      c.line(5, b - 2, 2, b, IRON);
      c.line(6, b - 2, 9, b, D(IRON));
      c.set(5, b, IRON);
      c.row(11, 1, 10, IRON);
      c.row(11, 1, 4, L(IRON));
      for (const x of [2, 9]) c.set(x, 12, D(IRON));
      for (const [x, h] of [[2, 5], [5, 7], [9, 5]]) {
        candle(c, x, 10, u ? h - 2 : h, u, WAX);
        if (x === 5) candle(c, 6, 10, u ? h - 2 : h, false, D(WAX));
        if (u) c.set(x, 12, WAX);
      }
      if (u) {
        c.set(6, 5, D(WAX));
        dots(c, WAX, [3, 13, 6, 13, 8, b]);
      } else c.set(6, 3, D(WAX));
    },
  });
  add('medieval-map-table-campaign', 'map table campaign war council chart parchment markers castle solar', {
    w: 30, h: 19, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [5, 23]) {
        c.line(x, 10, x - 2, b, DOAK);
        c.line(x + 1, 10, x + 3, b, DOAK);
        c.line(x, 10, x - 1, b, OAK);
      }
      c.row(13, 5, 24, D(OAK));
      c.rect(1, 5, 28, 7, OAK); // the board, seen a little from above
      c.row(5, 1, 28, L(OAK));
      board(c, 1, 8, 28, 9, DOAK);
      c.rect(5, 5, 23, 7, C.parchment); // the map
      c.row(5, 5, 23, L(C.parchment));
      dots(c, WAT, [6, 6, 7, 7, 8, 6, 9, 6, 10, 7, 6, 7]);
      dots(c, D(C.parchment), [12, 6, 14, 7, 16, 6, 18, 6, 20, 7, 21, 6]);
      dots(c, hex('#5a6a44'), [13, 7, 17, 7, 19, 6]);
      c.rect(4, 5, 4, 7, D(C.parchment));
      c.rect(24, 5, 24, 7, D(C.parchment));
      c.set(15, 4, RED); // little men of painted wood
      c.set(15, 5, D(RED));
      c.set(19, 5, BLUE);
      c.set(19, 6, D(BLUE));
      c.set(11, 5, RED);
      c.set(11, 6, D(RED));
      c.rect(26, 3, 27, 4, PEWTER);
      candle(c, 26, 2, 2, u, WAX);
      if (u) {
        c.col(17, 1, 5, STEEL); // a dagger through the place that matters
        c.col(17, 1, 2, LEATHER);
        c.row(3, 16, 18, GOLD);
        c.set(19, 6, C.parchment);
        c.set(20, 7, BLUE);
        c.set(21, 7, D(BLUE));
        dots(c, C.wine, [8, 6, 9, 6, 9, 7, 10, 7, 10, 6, 7, 7, 9, 8, 9, 10, 9, 12]);
        c.rect(6, 4, 7, 5, PEWTER);
        c.set(8, 5, PEWTER);
      }
    },
    sw: 18, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, 10, 2, b, OAK);
      c.line(11, 10, 14, b, DOAK);
      c.line(6, 10, 3, b, DOAK);
      c.row(13, 5, 11, D(OAK));
      c.rect(1, 5, 16, 7, OAK);
      c.row(5, 1, 16, L(OAK));
      board(c, 1, 8, 16, 9, DOAK);
      c.rect(3, 5, 14, 7, C.parchment);
      c.row(5, 3, 14, L(C.parchment));
      dots(c, D(C.parchment), [5, 6, 8, 7, 11, 6, 13, 7]);
      dots(c, WAT, [4, 7, 6, 7]);
      c.set(9, 5, RED);
      c.set(9, 6, D(RED));
      c.rect(13, 3, 14, 4, PEWTER);
      candle(c, 13, 2, 2, u, WAX);
      if (u) {
        c.col(7, 1, 5, STEEL);
        c.col(7, 1, 2, LEATHER);
        c.row(3, 6, 8, GOLD);
        dots(c, C.wine, [4, 6, 5, 7, 4, 8, 4, 10]);
      }
    },
  });
  add('medieval-executioner-block-axe', 'executioner block axe headsman beheading basket scaffold blood', {
    w: 26, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(9, 9, 20, b, OAK); // the block
      c.rect(9, 8, 20, 9, PINE);
      c.row(8, 9, 20, L(PINE));
      c.rect(13, 8, 16, 8, DOAK);
      c.rect(13, 9, 16, 9, D(PINE));
      for (const x of [12, 15, 18]) c.col(x, 10, b, D(OAK));
      c.rect(1, b - 5, 7, b, HEMP); // the basket
      c.row(b - 5, 1, 7, D(HEMP));
      for (let x = 2; x <= 6; x += 2) c.col(x, b - 4, b, D(HEMP));
      c.col(1, b - 4, b, L(HEMP));
      if (!u) {
        c.line(23, b, 22, 4, PINE); // the axe, leaning
        c.rect(19, 2, 23, 6, STEEL);
        c.col(19, 2, 6, L(STEEL));
        c.set(19, 1, L(STEEL));
        c.set(19, 7, STEEL);
        c.rect(22, 3, 23, 5, D(STEEL));
        c.rect(2, b - 6, 6, b - 6, C.straw);
      } else {
        c.rect(10, 3, 13, 8, STEEL); // sunk in the wood
        c.col(10, 3, 8, L(STEEL));
        c.set(10, 2, L(STEEL));
        c.line(14, 4, 22, 1, PINE);
        c.line(14, 5, 22, 2, D(PINE));
        dots(c, C.blood, [14, 8, 15, 8, 16, 8, 14, 9, 15, 10, 16, 9, 15, 12, 14, 11, 16, 13, 15, 15, 12, 7, 11, 7]);
        dots(c, D(C.blood), [15, 9, 15, 11]);
        c.rect(2, b - 7, 6, b - 6, CANVAS); // and the basket is not empty
        c.row(b - 8, 3, 5, CANVAS);
        c.row(b - 8, 3, 4, L(CANVAS));
        dots(c, C.blood, [4, b - 6, 5, b - 6, 6, b - 5, 6, b - 3, 8, b, 9, b]);
      }
    },
    sw: 16, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 9, 12, b, OAK);
      c.rect(4, 8, 12, 9, PINE);
      c.row(8, 4, 12, L(PINE));
      for (const x of [7, 10]) c.col(x, 10, b, D(OAK));
      if (!u) {
        c.line(14, b, 13, 4, PINE);
        c.rect(12, 2, 14, 6, STEEL);
        c.col(12, 2, 6, L(STEEL));
      } else {
        c.col(8, 2, 8, STEEL);
        c.col(9, 3, 8, D(STEEL));
        c.rect(8, 0, 9, 1, PINE);
        dots(c, C.blood, [6, 8, 7, 9, 6, 10, 7, 12, 6, 14, 5, b]);
      }
      c.rect(1, b - 4, 4, b, HEMP);
      c.row(b - 4, 1, 4, D(HEMP));
      c.col(1, b - 3, b, L(HEMP));
      if (u) c.rect(2, b - 5, 3, b - 5, CANVAS);
    },
  });
  add('medieval-minstrel-harp-standing', 'harp minstrel bard music strings gilded instrument hall troubadour', {
    w: 14, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 3, b - 1, PINE); // the pillar
      c.col(2, 4, b - 1, L(PINE));
      c.rect(1, 2, 4, 3, GOLD);
      c.set(1, 1, GOLD);
      c.line(4, 3, 8, 5, PINE); // the neck
      c.line(8, 5, 11, 4, PINE);
      c.line(4, 4, 8, 6, D(PINE));
      c.poly([[11, 4], [12, 4], [8, b - 2], [5, b - 2]], OAK); // the sounding box
      c.line(11, 4, 5, b - 2, L(OAK));
      board(c, 1, b - 1, 10, b, DOAK);
      for (let x = 4; x <= 9; x++) {
        const y1 = b - 3 - Math.round(((x - 4) * (b - 8)) / 6.5);
        if (!(u && (x === 6 || x === 7))) c.col(x, 5 + (x > 6 ? 1 : 0), Math.max(7, y1), x % 2 ? C.bone : D(C.bone));
      }
      dots(c, GOLD, [6, b - 6, 9, 12, 10, 8]);
      if (u) {
        c.col(6, 5, 8, C.bone); // two strings gone, curled back
        c.set(5, 9, C.bone);
        c.set(7, 7, C.bone);
        c.set(8, 8, C.bone);
        c.set(7, 12, C.blood);
        c.set(7, 14, C.blood);
        c.set(6, b - 2, C.blood);
      }
    },
    sw: 8, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 4, 4, b - 1, PINE);
      c.col(3, 4, b - 1, L(PINE));
      c.rect(3, 2, 4, 3, GOLD);
      c.set(3, 1, GOLD);
      c.rect(2, 8, 5, b - 2, OAK);
      c.col(2, 8, b - 2, L(OAK));
      c.col(4, 9, b - 3, C.bone);
      board(c, 1, b - 1, 6, b, DOAK);
      if (u) {
        c.set(5, 7, C.bone);
        c.set(6, 6, C.bone);
        c.set(4, 14, C.blood);
      }
    },
  });
  add('medieval-ballista-bolt-thrower', 'large ballista bolt thrower giant crossbow siege engine castle wall scorpion', {
    w: 46, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(20, 14, 14, b - 3, DOAK); // the stand
      c.line(26, 13, 32, b - 3, DOAK);
      post(c, 22, 24, 13, b - 3, OAK);
      board(c, 8, b - 4, 38, b - 3, OAK);
      wheel(c, 12, b - 4, 4, DOAK);
      wheel(c, 34, b - 4, 4, DOAK);
      c.line(3, 13, 40, 9, L(PINE)); // the stock
      c.line(3, 14, 40, 10, PINE);
      c.line(3, 15, 40, 11, D(PINE));
      face(c, 33, 3, 39, 15, OAK); // the frame and its skeins
      c.rect(35, 4, 37, 14, HEMP);
      for (let y = 5; y <= 13; y += 2) c.row(y, 35, 37, D(HEMP));
      c.rect(34, 8, 38, 10, IRON);
      c.rect(2, 11, 6, 16, DOAK); // the winch
      c.set(4, 13, IRON);
      if (!u) {
        c.line(5, 11, 3, 6, IRON);
        c.set(3, 5, PINE);
        c.line(8, 11, 34, 8, C.bone); // the cord, drawn
        c.rect(8, 11, 9, 12, IRON);
        c.line(10, 11, 41, 8, DOAK); // the bolt
        c.rect(41, 7, 44, 8, STEEL);
        c.set(45, 8, L(STEEL));
        c.set(41, 6, STEEL);
        c.set(41, 9, STEEL);
        dots(c, C.white, [11, 10, 12, 10]);
      } else {
        c.line(6, 13, 9, 17, IRON);
        c.set(9, 18, PINE);
        c.rect(31, 8, 32, 10, C.bone); // loosed
        c.rect(8, 12, 9, 13, IRON);
        dots(c, HEMP, [30, 7, 30, 11]);
      }
    },
    sw: 30, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 5, 7, b - 8, b, DOAK);
      wheelEdge(c, 21, 23, b - 8, b, DOAK);
      board(c, 6, b - 4, 22, b - 3, OAK);
      post(c, 13, 15, 14, b - 4, OAK);
      for (const s of [-1, 1]) {
        const x0 = s < 0 ? 9 : 19;
        c.line(x0, 8, x0 + s * 8, u ? 7 : 10, PINE); // the arms
        c.line(x0, 9, x0 + s * 8, u ? 8 : 11, D(PINE));
      }
      face(c, 8, 3, 20, 15, OAK);
      for (const x of [9, 17]) {
        c.rect(x, 4, x + 2, 14, HEMP);
        for (let y = 5; y <= 13; y += 2) c.row(y, x, x + 2, D(HEMP));
      }
      c.rect(12, 7, 16, 12, SOOT);
      if (!u) {
        c.rect(13, 8, 15, 10, STEEL); // the bolt, point on
        c.set(14, 9, L(STEEL));
        c.line(1, 11, 9, 12, C.bone);
        c.line(27, 11, 19, 12, C.bone);
      } else {
        c.row(8, 1, 27, C.bone);
        c.rect(12, 8, 16, 8, C.bone);
      }
    },
  });
  add('medieval-palisade-stake-wall', 'palisade stake wall sharpened logs wooden fence fort stockade defence', {
    w: 32, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2,
        hs = [3, 1, 4, 2, 3, 1, 2, 4];
      for (let i = 0; i < 8; i++) {
        const x = 1 + i * 4 - (i > 3 ? 1 : 0) + (i > 5 ? 1 : 0),
          col = i % 3 === 1 ? DOAK : OAK;
        let y = hs[i] + 1;
        if (u && (i === 3 || i === 4)) y = i === 3 ? b - 6 : b - 3;
        c.rect(x, y + 2, x + 3, b, col);
        c.col(x, y + 2, b, L(col));
        c.col(x + 3, y + 2, b, D(col));
        if (!(u && (i === 3 || i === 4))) {
          c.rect(x + 1, y, x + 2, y + 1, col);
          c.set(x + 1, y, L(col));
          c.set(x, y + 1, L(col));
        } else dots(c, PINE, [x, y + 1, x + 2, y, x + 3, y + 1, x + 1, y + 2]);
        dots(c, D(col), [x + 1, y + 7, x + 2, y + 13, x + 1, b - 3]);
      }
      const rail = (x0, x1) => {
        c.rect(x0, 13, x1, 14, PINE);
        c.row(13, x0, x1, L(PINE));
        for (let x = x0 + 1; x < x1; x += 4) c.col(x, 12, 15, HEMP);
      };
      if (!u) rail(1, 30);
      else {
        rail(1, 12);
        rail(20, 30);
        c.line(11, b, 24, b - 2, OAK); // one lies where it fell
        c.line(11, b - 1, 24, b - 3, L(OAK));
        c.set(25, b - 3, PINE);
        dots(c, PINE, [14, b - 9, 17, b - 6, 13, 16]);
        dots(c, C.blood, [15, b - 5, 16, b - 4]);
      }
      dots(c, C.moss, [2, b, 9, b - 1, 22, b, 28, b - 1]);
    },
    sw: 12, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.line(6, 12, 10, b, DOAK); // the prop behind
      c.line(7, 12, 10, b - 2, D(DOAK));
      c.rect(3, 6, 6, b, OAK);
      c.col(3, 6, b, L(OAK));
      c.col(6, 6, b, D(OAK));
      c.rect(4, 4, 5, 5, OAK);
      c.set(4, 4, L(OAK));
      c.rect(2, 13, 7, 14, PINE);
      c.col(4, 12, 15, HEMP);
      dots(c, D(OAK), [4, 10, 5, 19, 4, 24]);
      if (u) {
        c.line(1, b, 2, b - 6, OAK);
        c.set(1, b - 7, PINE);
        dots(c, PINE, [0, b - 3, 1, 16]);
      }
      c.set(8, b, C.moss);
    },
    su: [2, 0, 0],
  });
  add('medieval-castle-gate-portcullis', 'castle gate portcullis iron grille stone arch gatehouse entrance raised lowered', {
    w: 34, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stones(c, 1, 1, 32, b, MSTONE, 5, 8, 3);
      c.col(1, 1, b, L(MSTONE));
      archPt(c, 6, 7, 27, b, L(MSTONE), 12);
      archPt(c, 8, 9, 25, b, PASS, 11);
      const yb = u ? 20 : b;
      for (let y = 9; y <= yb; y++)
        for (let x = 8; x <= 25; x++) {
          if (c.get(x, y) !== PASS) continue;
          const v = (x - 8) % 4 === 1,
            h = y % 5 === 2 && y < yb - 1;
          if (v || h) c.set(x, y, v && h ? L(IRON) : v ? IRON : D(IRON));
        }
      for (let x = 9; x <= 25; x += 4) {
        c.set(x, yb, L(IRON)); // the spikes
        if (u) c.set(x, yb + 1, IRON);
      }
      if (u) {
        archPt(c, 13, 30, 20, b, hex('#2c2a34'), 6); // the far end of the passage
        c.row(b, 9, 24, hex('#2c2a34'));
        dots(c, hex('#3c3a44'), [11, b - 1, 22, b - 2, 16, b]);
      }
      dots(c, C.moss, [3, b, 4, b - 1, 30, b, 29, 30, 2, 20]);
      c.rect(15, 2, 18, 5, D(MSTONE)); // a worn shield over the arch
      c.set(16, 6, D(MSTONE));
      c.set(17, 6, D(MSTONE));
      c.set(16, 3, RED);
    },
    sw: 12, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 1, 8, b, MSTONE, 5, 5, 3);
      c.col(2, 1, b, L(MSTONE));
      c.col(8, 1, b, D(MSTONE));
      c.rect(9, 9, 9, u ? 20 : b, IRON);
      for (let y = 12; y <= (u ? 20 : b); y += 5) c.set(10, y, D(IRON));
      c.set(9, u ? 21 : b, L(IRON));
      dots(c, C.moss, [3, b, 7, b - 1, 4, 22]);
    },
  });
  add('medieval-pewter-jug-goblets', 'pewter jug goblets wine cups flagon drink table', {
    w: 18, h: 14,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 5, b, PEWTER); // the jug
      c.rect(3, 2, 4, 4, PEWTER);
      c.set(2, 2, PEWTER);
      c.col(2, 5, b, L(PEWTER));
      c.set(3, 2, L(PEWTER));
      c.row(7, 2, 5, D(PEWTER));
      c.row(b, 2, 5, D(PEWTER));
      c.set(6, 5, PEWTER);
      c.set(7, 6, PEWTER);
      c.set(7, 7, PEWTER);
      c.set(6, 8, PEWTER);
      const cup = (x) => {
        c.rect(x, 6, x + 2, 8, PEWTER);
        c.col(x, 6, 8, L(PEWTER));
        c.row(6, x, x + 2, C.wine);
        c.col(x + 1, 9, b - 1, PEWTER);
        c.row(b, x, x + 2, D(PEWTER));
      };
      cup(9);
      if (!u) cup(14);
      else {
        c.rect(13, b - 2, 15, b, PEWTER); // one on its side, the wine run out
        c.col(13, b - 2, b, L(PEWTER));
        c.row(b - 1, 16, 17, PEWTER);
        c.col(18, b - 2, b, D(PEWTER));
        c.row(b, 4, 12, C.wine);
        c.set(8, b - 1, C.wine);
        c.row(6, 9, 11, PEWTER);
        dots(c, L(C.wine), [7, b, 11, b]);
      }
    },
    u: [0, 0, 2],
  });
  add('medieval-crown-on-cushion', 'crown on cushion gold jewels red velvet tassels royal regalia', {
    w: 16, h: 12,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 7, 13, b, RED);
      c.row(6, 3, 12, RED);
      c.row(6, 3, 12, L(RED));
      c.row(b, 2, 13, D(RED));
      c.col(2, 7, b, L(RED));
      dots(c, GOLD, [1, 7, 14, 7, 1, b, 14, b]);
      dots(c, D(GOLD), [1, 8, 14, 8]);
      if (!u) {
        c.rect(4, 3, 11, 5, GOLD);
        c.row(3, 4, 11, L(GOLD));
        c.row(5, 4, 11, D(GOLD));
        dots(c, GOLD, [4, 2, 4, 1, 7, 2, 8, 2, 7, 1, 11, 2, 11, 1]);
        dots(c, RED, [6, 4, 9, 4]);
        c.set(7, 4, BLUE);
        c.set(8, 4, BLUE);
      } else {
        c.rect(5, 6, 10, 6, D(RED)); // only the dent of it
        c.rect(4, 7, 11, 7, D(RED));
        c.set(10, 6, GOLD); // and one pearl
        c.set(9, 7, C.white);
      }
    },
  });
  add('medieval-sword-in-stone', 'sword in the stone boulder legend blade hilt gold rock excalibur', {
    w: 20, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[1, b], [2, 18], [6, 13], [12, 12], [16, 15], [18, 20], [18, b]], MSTONE);
      c.line(2, 18, 6, 13, L(MSTONE));
      c.line(6, 13, 12, 12, L(MSTONE));
      c.line(7, 15, 5, b, D(MSTONE));
      c.line(13, 14, 15, b, D(MSTONE));
      c.line(8, 19, 12, 20, D(MSTONE));
      dots(c, C.moss, [2, b, 3, b, 4, b - 1, 16, b, 17, b - 1, 4, 17, 14, 13]);
      dots(c, L(MSTONE), [9, 15, 10, 17, 4, 20]);
      if (!u) {
        c.rect(9, 6, 10, 12, STEEL);
        c.col(9, 6, 12, L(STEEL));
        c.rect(6, 5, 13, 5, GOLD);
        c.set(6, 6, D(GOLD));
        c.set(13, 6, D(GOLD));
        c.rect(9, 2, 10, 4, LEATHER);
        c.rect(9, 1, 10, 1, GOLD);
      } else {
        c.rect(9, 12, 10, 13, K); // the cleft it left, and letters that were not there before
        c.set(9, 11, C.glow);
        c.set(10, 10, C.glow);
        dots(c, C.glow, [6, 17, 8, 17, 9, 18, 11, 17, 13, 18, 7, 19, 12, 19]);
        dots(c, D(C.glow), [7, 17, 10, 17, 12, 17]);
      }
    },
    sw: 16, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[1, b], [2, 17], [5, 13], [10, 12], [13, 16], [14, b]], MSTONE);
      c.line(2, 17, 5, 13, L(MSTONE));
      c.line(5, 13, 10, 12, L(MSTONE));
      c.line(6, 15, 4, b, D(MSTONE));
      c.line(10, 14, 11, b, D(MSTONE));
      dots(c, C.moss, [2, b, 3, b - 1, 12, b, 9, 13]);
      if (!u) {
        c.col(7, 5, 12, STEEL);
        c.rect(7, 5, 8, 5, GOLD);
        c.set(6, 5, GOLD);
        c.col(7, 2, 4, LEATHER);
        c.set(7, 1, GOLD);
      } else {
        c.set(7, 12, K);
        c.set(7, 11, C.glow);
        dots(c, C.glow, [8, 17, 9, 18, 8, 19]);
      }
    },
  });
  add('medieval-proclamation-board', 'proclamation board notice wanted bill parchment town crier posts roofed', {
    w: 22, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 3, 4, 6, b, OAK);
      post(c, 17, 18, 6, b, OAK);
      c.poly([[1, 6], [10, 2], [11, 2], [20, 6], [20, 7], [1, 7]], DOAK);
      c.line(1, 6, 10, 2, L(DOAK));
      face(c, 2, 8, 19, 21, PINE);
      planksH(c, 2, 9, 19, 21, D(PINE), 4);
      c.rect(12, 10, 17, 15, C.parchment);
      c.row(10, 12, 17, L(C.parchment));
      for (const y of [12, 14]) c.row(y, 13, 16, D(C.parchment));
      c.set(14, 10, IRON);
      if (!u) {
        c.rect(4, 10, 10, 18, C.parchment);
        c.row(10, 4, 10, L(C.parchment));
        for (const y of [12, 14, 16]) c.row(y, 5, 9, D(C.parchment));
        c.rect(8, 17, 9, 18, RED);
        c.set(7, 10, IRON);
      } else {
        c.rect(4, 9, 10, 19, C.paper); // a new bill: a face, and a price
        c.row(9, 4, 10, L(C.paper));
        c.rect(6, 11, 8, 14, SOOT);
        c.set(7, 12, C.paper);
        c.row(15, 5, 9, SOOT);
        c.row(17, 5, 9, D(C.parchment));
        c.row(18, 6, 8, RED);
        c.col(7, 6, 9, STEEL); // pinned with a knife
        c.set(7, 5, LEATHER);
        c.rect(13, b - 1, 16, b, C.parchment); // the old one in the mud
        c.set(15, b - 1, D(C.parchment));
      }
    },
    sw: 10, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 5, 6, b, OAK);
      c.rect(2, 5, 7, 7, DOAK);
      c.row(5, 2, 7, L(DOAK));
      c.rect(6, 8, 6, 21, PINE);
      c.col(7, u ? 9 : 10, u ? 19 : 18, u ? C.paper : C.parchment);
      if (u) {
        c.set(8, 7, STEEL);
        c.set(9, 6, LEATHER);
        c.set(8, b, C.parchment);
      }
    },
  });
  add('medieval-smithy-quench-trough', 'quench trough smithy water tub blacksmith cooling slack tub wooden iron hoops', {
    w: 26, h: 16, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 7, 23, b - 1, PINE);
      planksH(c, 2, 8, 23, b - 1, D(PINE), 3);
      straps(c, 2, 23, [9, b - 3]);
      c.row(6, 2, 23, OAK);
      c.row(6, 3, 22, WAT);
      c.row(6, 5, 9, L(WAT));
      c.rect(3, b, 5, b, DOAK);
      c.rect(20, b, 22, b, DOAK);
      c.col(18, 7, 12, IRON); // tongs hung on the rim
      c.col(19, 7, 11, D(IRON));
      c.set(18, 6, IRON);
      if (u) {
        c.line(9, 6, 5, 0, STEEL); // a blade thrust in to cool
        c.set(5, -1, GOLD);
        c.set(4, -2, LEATHER);
        c.set(6, 0, GOLD);
        c.set(9, 5, C.flame);
        c.set(8, 4, C.flameLight);
        wisp(c, 10, 4, 5, C.white);
        wisp(c, 13, 5, 4);
        wisp(c, 7, 3, 3);
        c.row(6, 8, 12, L(WAT));
        dots(c, WAT, [12, 8, 12, 10, 24, b]);
      }
    },
    u: [0, 4, 0],
    sw: 14, sh: 16,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 7, 11, b - 1, PINE);
      planksH(c, 2, 8, 11, b - 1, D(PINE), 3);
      straps(c, 2, 11, [9, b - 3]);
      c.row(6, 2, 11, OAK);
      c.row(6, 3, 10, WAT);
      c.rect(3, b, 4, b, DOAK);
      c.rect(9, b, 10, b, DOAK);
      if (u) {
        c.col(6, -1, 6, STEEL);
        c.row(-1, 5, 7, GOLD);
        c.set(6, -2, LEATHER);
        c.set(6, 5, C.flame);
        wisp(c, 8, 4, 4, C.white);
        wisp(c, 4, 4, 3);
      }
    },
    su: [0, 4, 0],
  });
  add('medieval-dovecote-on-post', 'dovecote on post pigeon house doves birds manor yard wooden loft', {
    w: 20, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 9, 10, 18, b, OAK);
      board(c, 6, b - 1, 13, b, DOAK);
      c.line(6, 18, 8, 21, DOAK);
      c.line(13, 18, 11, 21, DOAK);
      face(c, 3, 8, 16, 17, LIME);
      c.poly([[1, 8], [9, 2], [10, 2], [18, 8]], DOAK);
      c.line(1, 8, 9, 2, L(DOAK));
      dots(c, OAK, [6, 6, 10, 5, 13, 7, 8, 4]);
      for (const y of [10, 14]) {
        for (const x of [5, 9, 13]) {
          c.rect(x, y, x + 1, y + 1, SOOT);
          c.set(x, y - 1, D(LIME));
        }
        c.row(y + 2, 3, 16, DOAK);
      }
      dots(c, C.white, [4, 16, 12, 13, 7, 20]); // droppings
      const dove = (x, y) => {
        c.rect(x, y, x + 2, y, C.white);
        c.set(x + 2, y - 1, C.white);
        c.set(x + 3, y - 1, C.mustard);
        c.set(x, y, D(C.white));
      };
      if (!u) {
        dove(4, 7);
        dove(11, 11);
        dove(6, 15);
        c.set(13, 10, C.white);
      } else {
        dots(c, C.white, [5, 22, 13, 27, 6, 31, 15, 20, 12, b - 4]); // feathers coming down
        dots(c, D(C.white), [6, 23, 14, 28]);
        c.rect(13, b, 16, b, C.white); // one on the ground
        c.set(16, b - 1, C.white);
        c.set(14, b, C.blood);
        c.set(12, b, C.blood);
        dots(c, C.blood, [9, 11, 10, 13]);
      }
    },
    sw: 16, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      post(c, 7, 8, 18, b, OAK);
      board(c, 4, b - 1, 11, b, DOAK);
      c.line(4, 18, 6, 21, DOAK);
      c.line(11, 18, 9, 21, DOAK);
      face(c, 3, 8, 12, 17, LIME);
      c.rect(2, 3, 13, 8, DOAK);
      c.row(2, 3, 12, DOAK);
      c.row(2, 3, 12, L(DOAK));
      for (const y of [4, 6]) c.row(y, 2, 13, D(DOAK));
      dots(c, OAK, [4, 5, 8, 3, 11, 7, 6, 7]);
      c.row(12, 3, 12, D(LIME));
      c.row(16, 3, 12, D(LIME));
      c.rect(13, 12, 13, 12, DOAK);
      c.rect(13, 16, 13, 16, DOAK);
      if (!u) {
        c.rect(6, 1, 8, 1, C.white);
        c.set(8, 0, C.white);
        c.set(9, 0, C.mustard);
      } else {
        dots(c, C.white, [5, 23, 11, 28, 4, 32, 10, b - 5]);
        c.rect(10, b, 12, b, C.white);
        c.set(11, b, C.blood);
      }
    },
  });
  add('medieval-quern-hand-mill', 'quern hand mill millstone grinding stone flour grain rotary kitchen', {
    w: 18, h: 13, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 8, 15, b, MSTONE);
      c.row(8, 2, 15, D(MSTONE));
      c.rect(3, 4, 14, 7, L(MSTONE));
      c.row(4, 4, 13, C.stoneLight);
      c.row(7, 3, 14, MSTONE);
      c.rect(8, 4, 9, 4, SOOT);
      c.col(2, 9, b, L(MSTONE));
      dots(c, D(MSTONE), [5, 10, 9, 9, 12, 10, 7, 6, 11, 5]);
      const hx = u ? 4 : 12;
      c.rect(hx, 1, hx, 4, PINE);
      c.set(hx, 1, L(PINE));
      if (u) {
        dots(c, C.white, [3, 8, 5, 8, 6, 8, 8, 8, 10, 8, 11, 8, 13, 8, 14, 8, 4, 9, 9, 9]);
        c.rect(15, b - 1, 18, b, C.white);
        c.set(16, b - 2, C.white);
        c.set(19, b, D(C.white));
        dots(c, D(C.white), [17, b, 15, b]);
      } else dots(c, C.straw, [8, 3, 9, 3, 16, b]);
    },
    u: [0, 0, 3],
  });
  add('medieval-lance-rack-tourney', 'lance rack tournament jousting lances striped pennants tilt yard stand', {
    w: 30, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 3, 16, b, OAK);
      post(c, 25, 26, 16, b, OAK);
      board(c, 1, b - 1, 5, b, DOAK);
      board(c, 23, b - 1, 27, b, DOAK);
      const lance = (x, a, bb, y0, flag) => {
        for (let y = y0; y <= b - 2; y++) {
          const col = ((y + x) >> 2) % 2 ? a : bb;
          c.set(x, y, col);
          c.set(x + 1, y, D(col));
        }
        c.rect(x - 1, 30, x + 2, 32, a); // the vamplate
        c.row(30, x, x + 1, L(a));
        c.rect(x - 1, 33, x + 2, 33, D(a));
        if (y0 < 10) {
          c.set(x, y0 - 1, STEEL);
          c.set(x, y0 - 2, L(STEEL));
          if (flag) {
            c.rect(x + 2, y0 + 1, x + 5, y0 + 2, flag);
            c.set(x + 2, y0 + 3, flag);
            c.set(x + 6, y0 + 1, flag);
          }
        } else dots(c, PINE, [x, y0 - 1, x + 1, y0 - 2, x - 1, y0]);
      };
      lance(6, RED, CANVAS, 3, RED);
      if (!u) lance(10, BLUE, GOLD, 3);
      lance(14, CANVAS, RED, 3);
      lance(18, BLUE, CANVAS, u ? 19 : 3, u ? null : BLUE);
      lance(22, GOLD, RED, 3);
      board(c, 2, 18, 26, 19, PINE);
      board(c, 2, 36, 26, 37, PINE);
      if (u) {
        c.rect(10, 18, 11, 18, SOOT);
        c.line(8, b, 16, b - 1, BLUE); // the broken half
        c.line(17, b - 1, 20, b, CANVAS);
        c.set(21, b, STEEL);
        c.rect(12, b - 3, 14, b - 2, BLUE);
      }
    },
    sw: 12, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      post(c, 4, 5, 16, b, OAK);
      board(c, 1, b - 1, 9, b, DOAK);
      c.line(2, b - 2, 3, b - 6, DOAK);
      c.line(8, b - 2, 6, b - 6, DOAK);
      c.rect(3, 18, 7, 19, PINE);
      c.rect(3, 36, 7, 37, PINE);
      for (let y = 3; y <= b - 2; y++) {
        const col = (y >> 2) % 2 ? RED : CANVAS;
        c.set(7, y, col);
        c.set(8, y, D(col));
      }
      c.rect(6, 30, 9, 32, RED);
      c.row(33, 6, 9, D(RED));
      c.set(7, 2, STEEL);
      c.set(7, 1, L(STEEL));
      if (!u) {
        c.rect(9, 4, 10, 5, RED);
        c.set(9, 6, RED);
      } else {
        c.rect(9, 4, 10, 5, RED);
        c.line(1, b, 4, b - 2, BLUE);
      }
    },
  });
  add('medieval-saddle-rack-wooden', 'saddle rack wooden horse stand leather stirrup bridle tack room stable', {
    w: 26, h: 25, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(6, 14, 3, b, DOAK);
      c.line(18, 14, 21, b, DOAK);
      c.line(7, 14, 4, b, OAK);
      c.row(b - 4, 5, 20, D(OAK));
      board(c, 3, 12, 21, 13, OAK);
      c.rect(4, 11, 19, 11, RED); // the saddle cloth
      c.rect(5, 12, 6, 15, RED);
      c.rect(17, 12, 18, 15, RED);
      dots(c, GOLD, [5, 16, 6, 16, 17, 16, 18, 16]);
      if (!u) {
        c.rect(6, 8, 17, 10, LEATHER); // the saddle
        c.rect(5, 6, 6, 9, LEATHER);
        c.rect(16, 5, 18, 8, LEATHER);
        c.row(8, 7, 15, L(LEATHER));
        c.set(5, 6, L(LEATHER));
        c.set(16, 5, L(LEATHER));
        c.rect(8, 11, 14, 17, D(LEATHER));
        c.col(8, 11, 17, LEATHER);
        c.row(17, 9, 13, mix(LEATHER, 0.5));
        c.col(11, 15, 19, LEATHER);
        c.rect(10, 20, 12, 22, IRON);
        c.set(11, 21, K);
        c.col(22, 9, 14, LEATHER); // a bridle on the end
        c.col(23, 10, 15, D(LEATHER));
        c.set(22, 15, IRON);
        c.set(23, 16, IRON);
      } else {
        c.rect(7, 9, 16, 10, RED); // only the cloth, folded
        c.row(9, 7, 16, L(RED));
        c.set(16, 10, GOLD);
        c.set(22, 13, IRON);
        c.rect(22, b - 1, 24, b, LEATHER); // a strap dropped in the hurry
        c.set(25, b, IRON);
        dots(c, C.straw, [9, b, 14, b, 15, b - 1]);
      }
    },
    sw: 14, sh: 25,
    s(c, u) {
      const b = c.h - 2;
      c.line(6, 14, 3, b, OAK);
      c.line(7, 14, 10, b, DOAK);
      c.row(b - 4, 5, 8, D(OAK));
      c.rect(5, 12, 8, 13, OAK);
      c.rect(3, 11, 10, 11, RED);
      c.col(3, 12, 15, RED);
      c.col(10, 12, 15, D(RED));
      c.set(3, 16, GOLD);
      c.set(10, 16, GOLD);
      if (!u) {
        c.rect(4, 6, 9, 10, LEATHER);
        c.row(6, 5, 8, L(LEATHER));
        c.rect(5, 5, 8, 5, LEATHER);
        c.rect(6, 7, 7, 9, D(LEATHER));
        c.col(2, 9, 17, D(LEATHER));
        c.col(11, 9, 17, D(LEATHER));
        c.col(2, 18, 19, LEATHER);
        c.col(11, 18, 19, LEATHER);
        c.rect(1, 20, 2, 22, IRON);
        c.rect(11, 20, 12, 22, IRON);
      } else {
        c.rect(4, 9, 9, 10, RED);
        c.row(9, 4, 9, L(RED));
        dots(c, C.straw, [5, b, 9, b]);
      }
    },
  });
  add('medieval-wheel-chandelier-iron', 'chandelier wheel iron hanging candles chains great hall ceiling light corona', {
    w: 30, h: 22,
    f(c, u) {
      const b = c.h - 2;
      chain(c, 14, 1, 14, 6);
      chain(c, 14, 6, 3, b - 4);
      chain(c, 15, 6, 26, b - 4);
      chain(c, 14, 7, 14, b - 5, D(IRON));
      c.rect(13, 5, 15, 6, IRON);
      c.rect(1, b - 2, 28, b - 1, IRON); // the wheel
      c.row(b - 2, 1, 28, L(IRON));
      c.row(b, 4, 25, D(IRON));
      c.row(b - 4, 6, 23, D(IRON));
      c.set(4, b - 3, D(IRON));
      c.set(25, b - 3, D(IRON));
      for (const x of [2, 8, 14, 20, 26]) {
        c.set(x, b - 3, PEWTER);
        candle(c, x, b - 4, u ? 2 : 3, u, WAX);
        if (u) c.set(x, b - 1, WAX);
      }
      for (const x of [11, 17]) candle(c, x, b - 5, 2, u, D(WAX));
      if (u) dots(c, WAX, [8, b, 20, b + 1, 2, b]);
    },
    u: [0, 0, 0],
  });
  void [K, mix, rope, wheel, planksV, HEMP];
};
