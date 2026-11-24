/* Old time, fourth part: the home — bedroom, nursery and hall. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, tleg, cabSide, hollow, pane, flame, wisp, shards, glow, puddle, cartWheel, wheelEdge, doorOut, opened, wicker } = H;
  const add = H.reg('env-oldtime', 'Old time');
  const OAK = hex('#6a4a32'),
    WAL = hex('#59402e'),
    PINE = hex('#94714a'),
    MAH = hex('#5a3226'),
    EB = hex('#2b242a'),
    CREAM = hex('#b9ad8a'),
    CHINA = hex('#d6d2c4'),
    TIN = hex('#8a8c90'),
    BR = C.brass,
    GILT = C.gold,
    IRONB = hex('#2a2a30'),
    QUILT = hex('#5a4a6a'),
    MADDER = hex('#7a3a30'),
    NAVY = hex('#2f3a55'),
    CREPE = hex('#1c1a20'),
    LIT = hex('#e0c868');

  add('oldtime-brass-bed-double', 'old time brass bed double bedstead knobs rails quilt feather mattress bedroom', {
    w: 40, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const [x, top] of [[2, b - 22], [36, b - 15]]) {
        c.rect(x, top, x + 1, b, BR);
        c.col(x, top, b, L(BR));
        c.rect(x - 1, top - 2, x + 2, top - 1, GILT);
        c.set(x - 1, top - 2, L(GILT));
      }
      c.rect(4, b - 7, 35, b - 6, IRONB);
      c.rect(4, b - 10, 35, b - 8, CREAM); // the mattress
      for (let x = 6; x < 35; x += 3) c.set(x, b - 9, D(CREAM));
      if (!u) {
        c.rect(4, b - 13, 11, b - 11, C.white);
        c.row(b - 13, 5, 10, L(C.white));
        c.rect(12, b - 13, 35, b - 8, QUILT);
        c.row(b - 13, 12, 35, L(QUILT));
        for (let x = 15; x < 35; x += 4) for (let y = b - 12; y < b - 8; y += 2) c.set(x + (y % 4 ? 2 : 0), y, MADDER);
        c.rect(12, b - 7, 35, b - 5, QUILT);
        for (let x = 13; x < 35; x += 2) c.set(x, b - 5, CREAM);
      } else {
        c.rect(5, b - 13, 12, b - 11, C.white);
        c.set(8, b - 12, D(C.white));
        c.row(b - 11, 13, 24, C.white); // thrown back: the sheet, and the hollow where somebody lay
        dots(c, D(C.white), [15, b - 11, 16, b - 11, 17, b - 11, 21, b - 11]);
        c.poly([[24, b - 16], [31, b - 17], [35, b - 13], [35, b - 5], [23, b - 5]], QUILT);
        c.line(24, b - 16, 31, b - 17, L(QUILT));
        c.line(27, b - 14, 29, b - 7, D(QUILT));
        dots(c, MADDER, [26, b - 12, 31, b - 13, 33, b - 9, 25, b - 8]);
        c.poly([[31, b - 4], [35, b - 4], [37, b], [32, b]], QUILT);
      }
      c.rect(8, b - 2, 12, b, CHINA); // the pot
      c.row(b - 2, 7, 13, CHINA);
    },
    sw: 26, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [2, 22]) {
        c.rect(x, 3, x + 1, b - 8, BR);
        c.col(x, 3, b - 8, L(BR));
        c.rect(x - 1, 1, x + 2, 2, GILT);
      }
      c.row(4, 4, 21, BR);
      c.row(9, 4, 21, D(BR));
      for (let x = 6; x <= 19; x += 4) c.col(x, 5, 8, BR);
      c.rect(3, 10, 22, b - 11, u ? C.white : QUILT);
      if (!u) {
        c.rect(4, 10, 11, 13, C.white);
        c.rect(14, 10, 21, 13, C.white);
        c.row(14, 3, 22, L(QUILT));
        for (let y = 16; y < b - 11; y += 2) for (let x = 5 + (y % 4 ? 2 : 0); x < 22; x += 4) c.set(x, y, MADDER);
      } else {
        c.rect(5, 10, 12, 13, C.white);
        c.rect(14, 10, 21, 13, C.white);
        c.row(14, 4, 21, D(C.white));
        dots(c, D(C.white), [7, 16, 8, 17, 9, 16, 8, 19, 15, 17]);
        c.poly([[3, b - 17], [22, b - 16], [22, b - 11], [3, b - 11]], QUILT);
        c.line(3, b - 17, 22, b - 16, L(QUILT));
        dots(c, MADDER, [7, b - 14, 13, b - 13, 18, b - 14]);
      }
      c.rect(3, b - 10, 22, b - 9, D(QUILT)); // the foot rail in front
      for (const x of [2, 22]) {
        c.rect(x, b - 15, x + 1, b, BR);
        c.col(x, b - 15, b, L(BR));
        c.rect(x - 1, b - 17, x + 2, b - 16, GILT);
      }
      c.row(b - 14, 4, 21, BR);
      c.row(b - 8, 4, 21, D(BR));
      for (let x = 6; x <= 19; x += 4) c.col(x, b - 13, b - 9, BR);
      c.rect(11, b - 1, 15, b, CHINA);
    },
    base: 'side',
  });

  add('oldtime-cradle-wooden-rocker', 'old time cradle wooden rockers hood baby crib nursery rocking', {
    w: 24, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [5, 18]) {
        c.rect(x - 2, b, x + 2, b, OAK); // rockers, end on
        c.set(x - 3, b - 1, OAK);
        c.set(x + 3, b - 1, OAK);
      }
      c.poly([[3, b - 9], [21, b - 9], [20, b - 2], [4, b - 2]], OAK);
      c.line(3, b - 9, 4, b - 2, L(OAK));
      c.row(b - 2, 4, 20, D(OAK));
      for (let x = 8; x < 20; x += 4) c.col(x, b - 8, b - 3, D(OAK));
      c.poly([[2, b - 9], [3, b - 15], [9, b - 16], [10, b - 9]], OAK); // the hood
      c.line(3, b - 15, 9, b - 16, L(OAK));
      c.set(6, b - 12, D(OAK)); // a heart cut in it
      c.set(5, b - 13, D(OAK));
      c.set(7, b - 13, D(OAK));
      if (!u) {
        c.rect(11, b - 11, 20, b - 10, NAVY);
        c.row(b - 11, 11, 20, L(NAVY));
        c.rect(10, b - 10, 11, b - 10, C.white);
      } else {
        c.row(b - 10, 11, 20, C.white); // empty: the cover dragged over the side
        c.set(14, b - 10, D(C.white));
        c.poly([[17, b - 11], [22, b - 10], [23, b], [19, b - 1]], NAVY);
        c.line(17, b - 11, 22, b - 10, L(NAVY));
        c.line(20, b - 8, 21, b - 2, D(NAVY));
      }
    },
    u: [0, 0, 1],
    sw: 14, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[1, b - 1], [3, b], [10, b], [12, b - 1], [12, b], [1, b]], OAK);
      c.row(b, 2, 11, OAK);
      c.set(1, b - 1, OAK);
      c.set(12, b - 1, OAK);
      c.poly([[2, b - 9], [11, b - 9], [10, b - 1], [3, b - 1]], OAK);
      c.line(2, b - 9, 3, b - 1, L(OAK));
      c.poly([[2, b - 9], [3, b - 15], [10, b - 15], [11, b - 9]], OAK);
      c.row(b - 15, 3, 10, L(OAK));
      c.rect(4, b - 13, 9, b - 10, hex('#2a2024')); // looking in under the hood
      if (!u) {
        c.rect(5, b - 11, 8, b - 10, C.white);
        c.rect(4, b - 9, 9, b - 8, NAVY);
      } else {
        c.row(b - 10, 5, 8, D(C.white));
        c.rect(9, b - 9, 12, b - 3, NAVY);
        c.col(9, b - 9, b - 3, L(NAVY));
      }
      c.set(6, b - 5, D(OAK));
      c.set(7, b - 5, D(OAK));
    },
    su: [0, 0, 1],
    base: 'side',
  });

  add('oldtime-rocking-chair-shawl', 'old time rocking chair spindle back wooden rocker shawl grandmother parlour', {
    w: 16, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 11]) {
        c.rect(x, b - 24, x + 1, b - 1, WAL);
        c.col(x, b - 24, b - 1, L(WAL));
        c.rect(x - 1, b, x + 2, b, D(WAL));
      }
      c.rect(3, b - 25, 12, b - 23, WAL);
      c.row(b - 25, 3, 12, L(WAL));
      for (let x = 5; x <= 9; x += 2) c.col(x, b - 22, b - 13, WAL);
      c.row(b - 16, 5, 10, D(WAL));
      board(c, 2, b - 12, 13, b - 10, WAL);
      c.row(b - 5, 5, 10, D(WAL));
      for (const x of [1, 13]) {
        c.rect(x, b - 17, x + 1, b - 16, WAL); // arms
        c.col(x + (x < 5 ? 0 : 1), b - 15, b - 13, WAL);
      }
      if (u) {
        c.poly([[4, b - 24], [12, b - 25], [14, b - 14], [10, b - 11], [5, b - 15]], MADDER); // her shawl, and the knitting
        c.line(4, b - 24, 12, b - 25, L(MADDER));
        for (let y = b - 22; y < b - 12; y += 3) c.row(y, 6, 12, D(MADDER));
        dots(c, CREAM, [13, b - 13, 14, b - 12, 11, b - 10]);
        c.rect(4, b - 14, 8, b - 13, hex('#6a7a5a'));
        c.line(3, b - 16, 8, b - 12, C.steel);
        c.line(5, b - 12, 4, b, hex('#6a7a5a')); // wool run down to the floor
        c.oval(4, b - 2, 7, b, hex('#6a7a5a'));
      }
    },
    sw: 20, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      for (let x = 1; x <= 18; x++) c.set(x, b - Math.round(((x - 9.5) / 9) ** 2 * 3), D(WAL)); // the rocker
      c.line(4, b - 25, 6, b - 1, WAL);
      c.line(3, b - 25, 5, b - 11, L(WAL));
      c.rect(6, b - 12, 15, b - 10, WAL);
      c.row(b - 12, 6, 15, L(WAL));
      c.col(14, b - 9, b - 1, WAL);
      c.row(b - 17, 6, 14, WAL);
      c.col(14, b - 16, b - 13, WAL);
      c.row(b - 5, 7, 13, D(WAL));
      if (u) {
        c.poly([[2, b - 25], [5, b - 25], [8, b - 13], [5, b - 12]], MADDER);
        for (let y = b - 22; y < b - 12; y += 3) c.set(5, y, D(MADDER));
        c.rect(9, b - 14, 13, b - 13, hex('#6a7a5a'));
        c.line(8, b - 16, 13, b - 12, C.steel);
        c.line(15, b - 10, 16, b - 3, hex('#6a7a5a'));
        c.oval(15, b - 3, 18, b - 1, hex('#6a7a5a'));
      }
    },
  });

  add('oldtime-coat-stand-top-hat', 'old time hall coat stand hat stand top hat overcoat umbrella bentwood', {
    w: 14, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.col(6, 3, b - 3, WAL);
      c.col(7, 3, b - 3, D(WAL));
      c.set(6, 2, L(WAL));
      c.line(6, b - 4, 2, b, WAL);
      c.line(7, b - 4, 11, b, D(WAL));
      c.row(b - 8, 4, 9, BR); // the umbrella ring
      for (const [x, y] of [[3, 6], [10, 6], [2, 10], [11, 10]]) {
        c.line(6, y + 2, x, y, WAL);
        c.set(x, y - 1, WAL);
      }
      c.col(9, b - 20, b - 1, EB); // the umbrella
      c.col(10, b - 16, b - 6, EB);
      c.set(9, b - 21, PINE);
      c.set(10, b - 22, PINE);
      if (!u) {
        c.rect(1, 2, 5, 5, EB); // the top hat
        c.row(6, 0, 6, EB);
        c.row(5, 1, 5, hex('#5a5a62'));
        c.col(1, 2, 4, hex('#3a3440'));
        c.poly([[1, 11], [5, 10], [6, 13], [6, 27], [1, 28]], hex('#3a3632')); // an overcoat
        c.col(1, 11, 28, hex('#4a4640'));
        c.col(4, 13, 27, hex('#2a2826'));
        dots(c, BR, [5, 15, 5, 19]);
      } else {
        c.line(1, 11, 5, 12, hex('#3a3632')); // gone out: only a scarf left
        c.col(11, 10, 18, MADDER);
        c.col(12, 11, 16, D(MADDER));
        dots(c, CREAM, [11, 19, 12, 17]);
        puddle(c, 8, 11, b, hex('#56707a')); // and the umbrella has dripped
      }
    },
    u: [1, 0, 0], o: {},
  });

  add('oldtime-oil-lamp-table', 'old time oil lamp on a round table fringed cloth glass chimney parlour light', {
    w: 16, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.col(7, b - 8, b - 1, WAL);
      c.col(8, b - 8, b - 1, D(WAL));
      c.line(7, b - 2, 4, b, WAL);
      c.line(8, b - 2, 11, b, D(WAL));
      c.rect(2, b - 13, 13, b - 9, MADDER); // the cloth
      c.row(b - 13, 1, 14, L(MADDER));
      for (let x = 2; x <= 13; x += 2) c.set(x, b - 8, GILT);
      c.col(5, b - 12, b - 9, D(MADDER));
      c.col(10, b - 12, b - 9, D(MADDER));
      c.rect(6, b - 15, 9, b - 14, BR); // the lamp
      c.oval(5, b - 19, 10, b - 15, BR);
      c.set(6, b - 18, L(BR));
      c.rect(7, b - 21, 8, b - 20, D(BR));
      c.oval(4, b - 25, 11, b - 20, u ? LIT : hex('#b0b8a8')); // the shade
      c.rect(7, b - 26, 8, b - 26, u ? C.white : C.glassLight);
      c.row(b - 20, 5, 10, u ? C.flameLight : hex('#8a9488'));
      if (u) {
        c.rect(7, b - 23, 8, b - 22, C.white);
        dots(c, C.glow, [3, b - 26, 12, b - 26, 2, b - 22, 13, b - 22, 7, b - 27, 3, b - 14, 12, b - 14]);
      }
      c.rect(11, b - 15, 13, b - 14, C.wine); // a book
      c.set(13, b - 14, C.paper);
    },
  });

  add('oldtime-ice-box-oak', 'old time ice box oak refrigerator zinc lined block of ice larder brass latch', {
    w: 16, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 14, 3, OAK);
      face(c, 2, 4, 13, b - 2, OAK);
      legs(c, [2, 12], b - 1, b, D(OAK));
      if (!u) {
        panel(c, 3, 5, 12, 11, OAK);
        panel(c, 3, 13, 12, b - 3, OAK);
        c.rect(11, 8, 12, 9, BR);
        c.rect(11, 18, 12, 19, BR);
        dots(c, BR, [3, 6, 3, 10, 3, 14, 3, b - 4]);
      } else {
        c.rect(3, 5, 12, 11, TIN); // the ice
        c.rect(4, 6, 11, 11, hex('#b8ccd0'));
        c.row(6, 4, 11, C.white);
        dots(c, C.white, [5, 8, 8, 10, 10, 7]);
        c.rect(3, 13, 12, b - 3, mix(TIN, 0.6));
        c.row(19, 3, 12, TIN);
        c.rect(4, 15, 6, 18, CHINA); // a jug of milk, butter, a hare
        c.set(7, 16, CHINA);
        c.rect(9, 17, 11, 18, hex('#d8c888'));
        c.poly([[5, 21], [11, 21], [10, 24], [6, 24]], hex('#7a5a45'));
        c.set(11, 20, hex('#7a5a45'));
        c.set(8, 25, C.blood);
        c.col(13, 4, b - 2, L(OAK));
        c.set(8, b, hex('#6f8f98')); // meltwater
        c.row(b, 5, 9, hex('#6f8f98'));
      }
    },
    sw: 11, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 9, 3, OAK);
      cabSide(c, 2, 4, 8, b - 2, OAK);
      legs(c, [2, 7], b - 1, b, D(OAK));
      if (u) {
        doorOut(c, 9, 5, 11, 6, OAK);
        doorOut(c, 9, 13, b - 3, 6, OAK);
        c.row(b, 9, 12, hex('#6f8f98'));
      }
    },
    su: [0, 0, 6],
  });

  add('oldtime-mourning-portrait-easel', 'old time mourning portrait on an easel black crepe draped painting dead relative parlour', {
    w: 18, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(8, 2, 3, b, OAK);
      c.line(9, 2, 14, b, D(OAK));
      c.row(b - 10, 4, 13, OAK);
      c.rect(3, 6, 14, b - 11, GILT); // the frame
      c.rect(4, 7, 13, b - 12, hex('#3a342c'));
      c.frame(3, 6, 14, b - 11, GILT);
      dots(c, L(GILT), [3, 6, 14, 6]);
      c.oval(7, 9, 10, 13, hex('#b8a88a')); // the face
      c.rect(6, 15, 11, b - 12, hex('#1e1c22'));
      c.rect(8, 14, 9, 14, hex('#b8a88a'));
      c.set(8, 15, C.white);
      c.set(9, 15, C.white);
      if (!u) {
        dots(c, hex('#3a3024'), [7, 11, 10, 11]);
        c.poly([[2, 5], [15, 5], [16, 14], [13, 10], [9, 8], [5, 10], [2, 16]], CREPE); // the crepe
        c.line(2, 5, 15, 5, hex('#3a3640'));
        c.col(2, 6, 18, CREPE);
        c.col(15, 6, 16, CREPE);
        c.set(8, 4, CREPE);
        c.set(9, 4, CREPE);
      } else {
        c.rect(7, 10, 10, 12, hex('#17151c')); // the crepe is off, and the eyes have been scratched out
        dots(c, hex('#e4dfd0'), [6, 9, 11, 13, 6, 12, 11, 10]);
        c.set(8, 13, C.blood);
        c.poly([[11, b - 3], [17, b - 4], [18, b], [10, b]], CREPE);
        c.line(11, b - 3, 17, b - 4, hex('#3a3640'));
      }
    },
    u: [0, 0, 2],
    sw: 12, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.line(6, 2, 9, b, OAK);
      c.line(5, 2, 2, b, D(OAK));
      c.row(b - 10, 7, 9, OAK);
      c.line(7, 6, 9, b - 11, GILT);
      c.line(8, 6, 10, b - 11, D(GILT));
      if (!u) {
        c.line(8, 5, 10, 16, CREPE);
        c.line(7, 5, 6, 12, CREPE);
        c.row(5, 6, 9, hex('#3a3640'));
      } else {
        c.rect(9, b - 2, 12, b, CREPE);
        c.row(b - 3, 10, 11, hex('#3a3640'));
      }
    },
    su: [0, 0, 2],
  });

  add('oldtime-magic-lantern-stand', 'old time magic lantern projector on a stand slides brass lens phantasmagoria show', {
    w: 22, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.line(9, b - 10, 5, b, WAL);
      c.line(10, b - 10, 14, b, D(WAL));
      c.col(9, b - 10, b - 3, WAL);
      board(c, 4, b - 12, 15, b - 11, WAL);
      face(c, 5, b - 20, 12, b - 13, hex('#3a2a26')); // the japanned body
      c.rect(7, b - 23, 9, b - 21, IRONB); // its chimney
      c.row(b - 24, 6, 10, IRONB);
      c.rect(13, b - 18, 15, b - 15, BR); // the lens tube
      c.rect(16, b - 19, 17, b - 14, BR);
      c.col(16, b - 19, b - 14, L(BR));
      c.col(18, b - 18, b - 15, u ? C.white : C.glass);
      c.rect(11, b - 21, 12, b - 13, WAL); // the slide carrier
      c.rect(11, b - 22, 12, b - 22, CHINA);
      dots(c, BR, [6, b - 14, 6, b - 19]);
      if (u) {
        for (let i = 0; i < 5; i++) {
          c.col(19 + i, b - 17 - i, b - 16 + i, i % 2 ? hex('#d8d0a0') : LIT); // the beam
        }
        dots(c, hex('#3a3024'), [22, b - 18, 23, b - 17, 23, b - 19, 22, b - 15]); // a figure thrown in the light
        c.set(8, b - 16, C.flame);
        wisp(c, 8, b - 25, 3, C.ash);
        c.rect(13, b - 13, 16, b - 13, CHINA); // more slides out on the board
      }
    },
    u: [0, 3, 3],
    sw: 14, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.line(6, b - 10, 2, b, WAL);
      c.line(7, b - 10, 11, b, D(WAL));
      c.col(6, b - 10, b - 2, WAL);
      board(c, 2, b - 12, 11, b - 11, WAL);
      face(c, 3, b - 20, 10, b - 13, hex('#3a2a26'));
      c.rect(5, b - 23, 7, b - 21, IRONB);
      c.row(b - 24, 4, 8, IRONB);
      c.oval(4, b - 19, 9, b - 14, BR); // the lens looking at you
      c.oval(5, b - 18, 8, b - 15, u ? C.white : C.glass);
      if (u) {
        dots(c, LIT, [3, b - 21, 10, b - 21, 2, b - 17, 11, b - 17, 3, b - 12, 10, b - 12]);
        c.set(6, b - 17, LIT);
        wisp(c, 6, b - 25, 3, C.ash);
      } else c.set(6, b - 17, C.glassLight);
    },
    su: [0, 3, 0],
    base: 'side',
  });

  add('oldtime-phonograph-horn-table', 'old time phonograph wax cylinder brass horn on a small table talking machine', {
    w: 20, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [3, 13], b - 10, b, WAL);
      board(c, 2, b - 12, 15, b - 11, WAL);
      c.row(b - 4, 4, 13, D(WAL));
      face(c, 4, b - 16, 13, b - 13, OAK); // the works in their box
      c.rect(5, b - 18, 10, b - 17, hex('#3a2a26')); // the cylinder
      c.row(b - 18, 5, 10, hex('#5a4a44'));
      c.rect(11, b - 19, 12, b - 17, C.steel);
      c.set(14, b - 15, IRONB); // the crank
      c.set(15, b - 15 + (u ? 1 : -1), PINE);
      c.poly([[11, b - 20], [12, b - 20], [18, b - 27], [18, b - 17], [14, b - 19]], BR); // the horn
      c.line(12, b - 20, 18, b - 27, L(BR));
      c.col(18, b - 27, b - 17, D(BR));
      c.set(17, b - 22, hex('#3a2a1a'));
      if (u) {
        dots(c, hex('#e4dfd0'), [20, b - 26, 21, b - 23, 20, b - 20, 22, b - 25, 22, b - 21]); // a voice coming out of it
        dots(c, C.ghost, [21, b - 27, 23, b - 23, 21, b - 18]);
        c.rect(6, b - 13, 8, b - 13, CHINA); // the cylinder's box open on the table
        c.rect(2, b - 14, 3, b - 13, CREAM);
      }
    },
    u: [0, 0, 4],
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 10], b - 10, b, WAL);
      board(c, 1, b - 12, 12, b - 11, WAL);
      c.row(b - 4, 3, 10, D(WAL));
      face(c, 3, b - 16, 10, b - 13, OAK);
      c.oval(2, b - 27, 11, b - 18, BR); // the horn's mouth
      c.oval(3, b - 26, 10, b - 19, D(BR));
      c.oval(5, b - 24, 8, b - 21, hex('#3a2a1a'));
      c.set(3, b - 24, L(BR));
      if (u) {
        dots(c, hex('#e4dfd0'), [6, b - 23, 7, b - 22]);
        dots(c, C.ghost, [1, b - 28, 12, b - 28, 0, b - 22, 13, b - 22]);
        c.rect(2, b - 14, 3, b - 13, CREAM);
      }
    },
    su: [1, 1, 1],
    base: 'side',
  });

  add('oldtime-perambulator-baby-carriage', 'old time perambulator pram baby carriage hood big wheels nursemaid black', {
    w: 26, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[5, b - 16], [21, b - 16], [19, b - 9], [8, b - 9]], NAVY); // the body
      c.row(b - 16, 5, 21, L(NAVY));
      c.line(5, b - 16, 8, b - 9, L(NAVY));
      c.row(b - 13, 7, 20, GILT);
      c.line(21, b - 16, 24, b - 21, IRONB); // the handle
      c.rect(23, b - 22, 25, b - 22, PINE);
      c.line(9, b - 8, 7, b - 5, IRONB); // springs
      c.line(18, b - 8, 19, b - 6, IRONB);
      c.row(b - 8, 8, 19, IRONB);
      cartWheel(c, 7, b - 4, 4, IRONB, C.steel);
      cartWheel(c, 19, b - 5, 5, IRONB, C.steel);
      if (!u) {
        c.poly([[4, b - 16], [5, b - 23], [10, b - 25], [14, b - 23], [14, b - 16]], EB); // the hood up
        c.line(5, b - 23, 10, b - 25, hex('#4a4a55'));
        c.line(10, b - 24, 12, b - 16, hex('#17151c'));
        c.line(7, b - 23, 9, b - 16, hex('#17151c'));
        c.rect(15, b - 18, 20, b - 17, C.white);
      } else {
        c.rect(3, b - 18, 6, b - 16, EB); // hood folded down: nothing in it but the blanket, hanging out
        c.row(b - 19, 3, 6, hex('#4a4a55'));
        c.row(b - 17, 7, 20, hex('#2a2024'));
        c.poly([[13, b - 17], [18, b - 18], [20, b - 8], [15, b - 7]], C.white);
        c.line(13, b - 17, 18, b - 18, L(C.white));
        c.line(16, b - 15, 17, b - 8, D(C.white));
        c.set(17, b - 12, hex('#6a8ab8'));
        c.rect(22, b - 1, 24, b, hex('#b9ad8a')); // a rattle on the ground
        c.set(25, b, hex('#b9ad8a'));
      }
    },
    sw: 16, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 1, b - 10, b, IRONB, 2);
      wheelEdge(c, 13, b - 10, b, IRONB, 2);
      c.row(b - 5, 3, 12, IRONB);
      c.poly([[3, b - 16], [12, b - 16], [11, b - 9], [4, b - 9]], NAVY);
      c.row(b - 16, 3, 12, L(NAVY));
      c.row(b - 13, 4, 11, GILT);
      c.rect(2, b - 22, 2, b - 17, IRONB); // the handle, coming at you
      c.rect(13, b - 22, 13, b - 17, IRONB);
      c.rect(2, b - 22, 13, b - 22, PINE);
      if (!u) {
        c.poly([[3, b - 17], [4, b - 24], [11, b - 24], [12, b - 17]], EB);
        c.row(b - 24, 4, 11, hex('#4a4a55'));
        c.rect(5, b - 21, 10, b - 17, hex('#17151c'));
        c.rect(6, b - 18, 9, b - 17, C.white);
      } else {
        c.row(b - 17, 4, 11, hex('#2a2024'));
        c.rect(3, b - 18, 12, b - 18, EB);
        c.poly([[6, b - 17], [10, b - 17], [11, b - 7], [7, b - 8]], C.white);
        c.col(8, b - 16, b - 9, D(C.white));
      }
    },
    base: 'side',
  });

  add('oldtime-rocking-horse-dapple', 'old time rocking horse dapple grey wooden toy nursery bow rockers horsehair mane', {
    w: 28, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const GREY = hex('#a8a498'),
        SAD = hex('#7a2a26');
      for (let x = 1; x <= 26; x++) {
        const y = b - Math.round(((x - 13.5) / 13) ** 2 * 3);
        c.set(x, y, hex('#3f5a44'));
        if (x > 2 && x < 25) c.set(x, y - 1 + 1, hex('#3f5a44'));
      }
      c.line(8, b - 9, 5, b - 2, GREY); // legs flung out
      c.line(9, b - 9, 6, b - 2, D(GREY));
      c.line(18, b - 9, 22, b - 2, GREY);
      c.line(19, b - 9, 23, b - 2, D(GREY));
      c.oval(6, b - 15, 21, b - 8, GREY); // the barrel
      c.row(b - 15, 9, 18, L(GREY));
      c.poly([[17, b - 14], [20, b - 21], [23, b - 21], [22, b - 12]], GREY); // neck and head
      c.rect(21, b - 22, 25, b - 19, GREY);
      c.rect(24, b - 19, 25, b - 18, GREY);
      c.set(21, b - 23, GREY);
      c.set(23, b - 21, K);
      c.set(25, b - 19, hex('#6a2a26'));
      c.line(18, b - 15, 20, b - 22, hex('#4a4640')); // mane
      c.line(6, b - 13, 3, b - 8, hex('#4a4640')); // tail
      c.line(5, b - 13, 2, b - 9, hex('#5a564e'));
      dots(c, hex('#8a867a'), [9, b - 12, 12, b - 10, 16, b - 12, 14, b - 14, 19, b - 16]);
      c.line(22, b - 18, 17, b - 14, SAD); // rein
      if (!u) {
        c.rect(11, b - 16, 15, b - 15, SAD);
        c.row(b - 16, 11, 15, L(SAD));
        c.col(13, b - 14, b - 9, hex('#4a2e28'));
        c.set(13, b - 8, BR);
      } else {
        c.poly([[11, b - 13], [15, b - 13], [15, b - 8], [11, b - 9]], SAD); // the saddle slipped round, the belly split
        c.rect(9, b - 8, 12, b - 7, hex('#3a3024'));
        dots(c, C.straw, [9, b - 7, 10, b - 6, 11, b - 6, 10, b - 4, 12, b - 3, 11, b - 1, 9, b - 2]);
        c.set(23, b - 21, hex('#8f1d1d'));
      }
    },
    sw: 12, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      const GREY = hex('#a8a498');
      for (const x of [2, 8]) {
        c.rect(x, b - 1, x + 1, b, hex('#3f5a44'));
        c.col(x, b - 7, b - 2, GREY);
      }
      c.row(b - 1, 2, 9, hex('#3f5a44'));
      c.oval(2, b - 15, 9, b - 7, GREY);
      c.rect(4, b - 22, 7, b - 15, GREY);
      c.col(4, b - 22, b - 15, L(GREY));
      dots(c, GREY, [4, b - 23, 7, b - 23]);
      dots(c, u ? hex('#8f1d1d') : K, [4, b - 20, 7, b - 20]);
      c.rect(5, b - 17, 6, b - 16, hex('#8a867a'));
      c.col(5, b - 22, b - 21, hex('#4a4640'));
      dots(c, hex('#6a2a26'), [5, b - 16, 6, b - 16]);
      dots(c, hex('#7a2a26'), [3, b - 18, 8, b - 18, 2, b - 15, 9, b - 15]);
      if (u) {
        c.rect(5, b - 8, 6, b - 7, hex('#3a3024'));
        dots(c, C.straw, [5, b - 6, 6, b - 5, 5, b - 3, 6, b - 2]);
      }
    },
    base: 'side',
  });
};
