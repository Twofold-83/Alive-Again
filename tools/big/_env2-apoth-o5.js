/* Old time, fifth part: school, church, the general store, and places of work. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, pane, flame, fire, wisp, shards, bricks, glow, puddle, cartWheel, doorOut, opened, pull, pullS, jar, shelfRow, books, planksV, heap } = H;
  const add = H.reg('env-oldtime', 'Old time');
  const OAK = hex('#6a4a32'),
    WAL = hex('#59402e'),
    PINE = hex('#94714a'),
    MAH = hex('#5a3226'),
    EB = hex('#2b242a'),
    CREAM = hex('#b9ad8a'),
    CHINA = hex('#d6d2c4'),
    TIN = hex('#8a8c90'),
    SLATE = hex('#3a3f48'),
    BR = C.brass,
    GILT = C.gold,
    IRONB = hex('#2a2a30'),
    FIRERED = hex('#8f2a24'),
    FADEBLUE = hex('#4f5f78'),
    OMNI = hex('#2f4a3c'),
    SACK = hex('#9a8a62'),
    LIT = hex('#e0c868');

  /* ---------- school ---------- */
  add('oldtime-school-slate-desk', 'old time school desk double bench slate inkwell iron frame classroom pupils', {
    w: 24, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 20]) {
        c.col(x, b - 12, b, IRONB);
        c.col(x + 1, b - 12, b, IRONB);
        c.set(x, b - 12, C.iron);
      }
      c.row(b - 2, 3, 20, IRONB);
      face(c, 1, b - 12, 22, b - 8, OAK);
      c.col(11, b - 11, b - 8, D(OAK));
      c.row(b - 6, 3, 20, hex('#3a2c26')); // the book shelf under
      c.rect(5, b - 7, 8, b - 7, C.wine);
      if (!u) {
        board(c, 1, b - 14, 22, b - 13, OAK);
        dots(c, IRONB, [6, b - 15, 17, b - 15]); // inkwells
        c.rect(13, b - 15, 15, b - 15, SLATE);
        dots(c, D(OAK), [4, b - 14, 9, b - 13, 19, b - 14]); // names cut in it
      } else {
        board(c, 12, b - 14, 22, b - 13, OAK);
        c.set(17, b - 15, IRONB);
        face(c, 1, b - 20, 11, b - 14, OAK); // one lid up
        c.rect(2, b - 19, 10, b - 15, D(OAK));
        hollow(c, 2, b - 13, 10, b - 13, OAK);
        c.rect(3, b - 14, 7, b - 13, SLATE); // the slate, a catapult, an apple
        dots(c, C.white, [4, b - 14, 6, b - 14]);
        c.set(9, b - 14, hex('#8f3a2c'));
        dots(c, K, [5, b - 17, 6, b - 17, 5, b - 16, 7, b - 18]); // and what is written inside the lid
      }
    },
    u: [0, 4, 0],
    sw: 16, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.line(9, b - 12, 7, b, IRONB);
      c.line(12, b - 12, 13, b, IRONB);
      c.row(b - 2, 2, 13, IRONB);
      c.poly([[7, b - 15], [13, b - 13], [13, b - 9], [7, b - 9]], OAK);
      c.line(7, b - 15, 13, b - 13, L(OAK));
      c.rect(2, b - 8, 6, b - 7, OAK); // the bench fixed behind
      c.row(b - 8, 2, 6, L(OAK));
      c.col(3, b - 6, b - 3, IRONB);
      c.col(2, b - 14, b - 9, OAK);
      c.row(b - 14, 2, 3, L(OAK));
      if (u) {
        c.line(7, b - 16, 9, b - 21, OAK);
        c.line(8, b - 16, 10, b - 21, D(OAK));
        c.set(10, b - 15, SLATE);
      }
    },
    su: [0, 4, 0],
  });

  add('oldtime-schoolmaster-desk-high', 'old time schoolmaster high desk tall sloping teacher cane register stool school', {
    w: 18, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [2, 14], b - 16, b, WAL);
      c.row(b - 4, 4, 13, D(WAL));
      face(c, 2, b - 21, 15, b - 15, WAL);
      panel(c, 4, b - 20, 13, b - 16, WAL);
      c.set(8, b - 18, BR);
      if (!u) {
        face(c, 1, b - 25, 16, b - 22, WAL);
        c.row(b - 26, 2, 15, L(WAL));
        c.rect(5, b - 25, 10, b - 23, C.navy); // the register
        c.row(b - 25, 5, 10, L(C.navy));
        c.row(b - 22, 2, 15, hex('#b08a4a')); // the cane laid along the ledge
        c.set(16, b - 23, hex('#b08a4a'));
        c.rect(13, b - 28, 14, b - 26, BR); // the bell
        c.set(13, b - 29, EB);
      } else {
        face(c, 1, b - 31, 16, b - 26, WAL); // the lid up
        c.rect(2, b - 30, 15, b - 27, D(WAL));
        hollow(c, 2, b - 25, 15, b - 22, WAL);
        c.rect(3, b - 24, 7, b - 22, C.navy);
        c.rect(9, b - 23, 12, b - 22, hex('#8a6a3a')); // confiscated things: a catapult, marbles, a bottle
        dots(c, hex('#6a8ab8'), [13, b - 22, 14, b - 22]);
        c.col(8, b - 25, b - 22, C.glass);
        c.line(17, b - 20, 16, b - 2, hex('#b08a4a')); // the cane is out
        c.set(17, b - 21, hex('#b08a4a'));
        c.set(16, b - 1, C.blood);
      }
    },
    u: [0, 4, 1],
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 10], b - 16, b, WAL);
      c.row(b - 4, 4, 9, D(WAL));
      cabSide(c, 2, b - 21, 11, b - 15, WAL, false);
      c.poly([[2, b - 27], [12, b - 23], [12, b - 22], [2, b - 22]], WAL);
      c.line(2, b - 27, 12, b - 23, L(WAL));
      if (!u) {
        c.line(4, b - 27, 9, b - 25, C.navy);
        c.rect(12, b - 24, 13, b - 24, hex('#b08a4a'));
      } else {
        c.line(2, b - 28, 4, b - 33, WAL);
        c.line(3, b - 28, 5, b - 33, D(WAL));
        c.line(13, b - 20, 12, b - 2, hex('#b08a4a'));
      }
    },
    su: [0, 4, 1],
  });

  add('oldtime-globe-stand-school', 'old time terrestrial globe on a stand brass meridian schoolroom world map study', {
    w: 15, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, b - 8, 7, b - 2, WAL);
      c.col(6, b - 8, b - 2, L(WAL));
      c.rect(3, b - 1, 10, b, WAL);
      c.row(b - 1, 3, 10, L(WAL));
      c.row(b - 9, 4, 9, BR);
      const SEA = hex('#56707a'),
        LAND = hex('#8a8a5a');
      if (!u) {
        c.oval(1, b - 22, 12, b - 10, SEA);
        dots(c, LAND, [3, b - 19, 4, b - 19, 4, b - 18, 5, b - 18, 3, b - 17, 4, b - 16, 4, b - 14, 8, b - 20, 9, b - 19, 9, b - 18, 10, b - 17, 8, b - 16, 9, b - 15, 9, b - 13]);
        dots(c, blend(SEA, C.white, 0.4), [3, b - 20, 2, b - 17]);
        for (let i = 0; i < 16; i++) c.set(6.5 + 7 * Math.cos((i / 15) * Math.PI - 1.2), b - 16 + 7.4 * Math.sin((i / 15) * Math.PI - 1.2), BR);
        c.set(6, b - 23, BR);
      } else {
        for (let i = 0; i < 16; i++) c.set(6.5 + 7 * Math.cos((i / 15) * Math.PI - 1.2), b - 16 + 7.4 * Math.sin((i / 15) * Math.PI - 1.2), BR); // the globe is off its pins
        c.oval(11, b - 11, 22, b, SEA);
        dots(c, LAND, [13, b - 8, 14, b - 8, 14, b - 7, 15, b - 6, 13, b - 5, 18, b - 9, 19, b - 8, 19, b - 6, 18, b - 4, 20, b - 5]);
        dots(c, K, [16, b - 9, 17, b - 8, 16, b - 7, 17, b - 6, 16, b - 5]); // split along a seam
        c.set(15, b - 10, hex('#b9ad8a'));
      }
    },
    u: [0, 0, 10],
  });

  add('oldtime-dunce-stool-cap', 'old time dunce stool and cap corner punishment school paper cone hat', {
    w: 12, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 2, b - 10, 9, b - 9, PINE);
      c.line(3, b - 8, 2, b, PINE);
      c.line(8, b - 8, 9, b, D(PINE));
      c.row(b - 4, 3, 8, D(PINE));
      if (!u) {
        c.poly([[3, b - 11], [8, b - 11], [6, b - 21], [5, b - 21]], CHINA);
        c.line(3, b - 11, 5, b - 21, L(CHINA));
        c.set(5, b - 16, hex('#3a3440'));
        c.set(6, b - 14, hex('#3a3440'));
        c.set(5, b - 13, hex('#3a3440'));
      } else {
        c.poly([[8, b - 2], [9, b], [18, b - 1], [18, b]], CHINA); // knocked off and trodden flat
        c.row(b, 9, 18, D(CHINA));
        c.set(12, b - 1, hex('#3a3440'));
        dots(c, K, [4, b - 11, 5, b - 11, 7, b - 11]); // and the seat scratched
        c.set(13, b, C.earth);
      }
    },
    u: [0, 0, 8],
  });

  /* ---------- church ---------- */
  add('oldtime-church-pew-bench', 'old time church pew bench oak carved ends hymn books kneeler chapel seat', {
    w: 36, h: 23, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, b - 16, 32, b - 8, OAK);
      c.row(b - 17, 3, 32, L(OAK));
      for (let x = 5; x < 31; x += 7) panel(c, x, b - 15, x + 5, b - 10, OAK);
      board(c, 3, b - 8, 32, b - 7, OAK);
      face(c, 3, b - 6, 32, b - 2, D(OAK));
      for (const x of [1, 31]) {
        face(c, x, b - 17, x + 3, b, OAK); // the ends, with their poppy heads
        c.rect(x + 1, b - 19, x + 2, b - 18, OAK);
        c.set(x + 1, b - 20, L(OAK));
        c.set(x + 2, b - 20, OAK);
        dots(c, D(OAK), [x + 1, b - 13, x + 2, b - 12, x + 1, b - 5]);
      }
      c.rect(8, b - 1, 14, b, hex('#6a2a26')); // a kneeler
      c.row(b - 1, 8, 14, hex('#8a3a34'));
      if (!u) {
        c.rect(20, b - 10, 23, b - 9, EB);
        c.set(23, b - 9, C.paper);
      } else {
        c.rect(19, b - 10, 25, b - 9, C.paper); // a hymn book left open
        c.col(22, b - 10, b - 9, D(C.paper));
        dots(c, C.slate, [20, b - 10, 24, b - 10]);
        c.rect(9, b - 11, 12, b - 9, EB); // a bonnet, and gloves
        c.row(b - 9, 8, 13, EB);
        c.set(13, b - 10, hex('#6a5a80'));
        dots(c, C.white, [15, b - 9, 16, b - 9]);
        c.set(27, b - 9, C.blood);
        c.set(27, b - 6, C.blood);
      }
    },
    sw: 13, sh: 23,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 17, 10, b, OAK);
      c.poly([[2, b - 17], [5, b - 17], [5, b - 20], [3, b - 20]], OAK);
      c.set(3, b - 20, L(OAK));
      panel(c, 4, b - 15, 8, b - 10, OAK);
      c.clearRect(6, b - 17, 10, b - 9);
      c.line(5, b - 17, 6, b - 9, OAK);
      c.rect(6, b - 8, 10, b - 7, OAK);
      c.row(b - 8, 6, 10, L(OAK));
      c.set(10, b - 9, OAK);
      panel(c, 4, b - 5, 8, b - 2, OAK);
      if (u) {
        c.rect(7, b - 10, 9, b - 9, C.paper);
        c.set(8, b - 11, EB);
      }
    },
  });

  add('oldtime-church-pulpit', 'old time pulpit oak preacher chapel steps bible sermon church', {
    w: 22, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(8, b - 12, 11, b, OAK);
      c.col(8, b - 12, b, L(OAK));
      c.rect(6, b - 1, 13, b, D(OAK));
      c.poly([[5, b - 13], [14, b - 13], [16, b - 17], [3, b - 17]], OAK);
      face(c, 2, b - 28, 17, b - 17, OAK);
      c.row(b - 29, 1, 18, L(OAK));
      for (const x of [4, 9, 14]) panel(c, x - 1, b - 26, x + 2, b - 19, OAK);
      dots(c, GILT, [5, b - 23, 10, b - 23, 15, b - 23]);
      for (let i = 0; i < 4; i++) {
        c.rect(17 + i, b - 3 - i * 3, 20, b - 1 - i * 3, D(OAK)); // steps round the side
        c.row(b - 3 - i * 3, 17 + i, 20, OAK);
      }
      c.line(18, b - 28, 20, b - 14, OAK);
      c.rect(7, b - 31, 12, b - 30, hex('#6a2a26')); // the cushion
      if (!u) {
        c.rect(7, b - 33, 12, b - 32, EB);
        c.row(b - 33, 7, 12, hex('#4a4a55'));
        c.set(12, b - 32, GILT);
      } else {
        c.rect(5, b - 33, 14, b - 32, C.paper); // the book open at the place
        c.col(9, b - 33, b - 32, D(C.paper));
        dots(c, C.slate, [6, b - 33, 7, b - 32, 11, b - 33, 13, b - 32]);
        c.col(10, b - 31, b - 27, FIRERED);
        c.rect(2, b - 33, 2, b - 30, CHINA); // a candle burning at the corner
        flame(c, 2, b - 34, 2);
        c.set(1, b - 35, C.glow);
      }
    },
    u: [0, 2, 0],
    sw: 20, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(11, b - 12, 14, b, OAK);
      c.col(11, b - 12, b, L(OAK));
      c.poly([[9, b - 13], [16, b - 13], [18, b - 17], [7, b - 17]], OAK);
      face(c, 6, b - 28, 18, b - 17, OAK);
      c.row(b - 29, 5, 18, L(OAK));
      for (const x of [9, 14]) panel(c, x - 1, b - 26, x + 2, b - 19, OAK);
      for (let i = 0; i < 4; i++) {
        c.rect(1 + i * 2, b - 3 - i * 3, 10, b - 1 - i * 3, D(OAK)); // the steps face you
        c.row(b - 3 - i * 3, 1 + i * 2, 10, OAK);
      }
      c.line(1, b - 14, 6, b - 28, OAK);
      c.col(1, b - 13, b - 4, OAK);
      c.rect(14, b - 31, 17, b - 30, hex('#6a2a26'));
      if (!u) c.rect(14, b - 33, 17, b - 32, EB);
      else {
        c.rect(13, b - 33, 18, b - 32, C.paper);
        c.col(17, b - 31, b - 27, FIRERED);
        c.rect(8, b - 33, 8, b - 30, CHINA);
        flame(c, 8, b - 34, 2);
      }
    },
    su: [0, 2, 0],
  });

  /* ---------- the general store ---------- */
  add('oldtime-general-store-counter', 'old time general store counter scales sweet jars coffee mill string paper shop', {
    w: 38, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 15, 36, b - 14, PINE);
      face(c, 2, b - 13, 35, b - 1, OAK);
      planksV(c, 2, b - 12, 35, b - 1, D(OAK), 6);
      c.rect(1, b, 36, b, D(OAK));
      c.rect(12, b - 10, 24, b - 5, FADEBLUE); // an enamel sign nailed on
      for (let x = 14; x < 24; x += 2) c.set(x, b - 8, CREAM);
      c.row(b - 6, 14, 22, CREAM);
      /* sweet jars */
      for (const [x, col] of [[2, hex('#8f3a2c')], [7, hex('#a8904e')], [12, hex('#5a7a4a')]]) {
        if (u && x === 7) continue;
        c.rect(x, b - 22, x + 3, b - 16, hex('#7a9098'));
        c.rect(x + 1, b - 20, x + 2, b - 17, col);
        c.row(b - 23, x, x + 3, TIN);
        c.col(x, b - 22, b - 16, C.glassLight);
      }
      /* the scales */
      c.rect(18, b - 17, 24, b - 16, IRONB);
      c.col(21, b - 22, b - 18, IRONB);
      c.row(u ? b - 22 : b - 22, 17, 25, IRONB);
      c.rect(16, b - 21 + (u ? 1 : 0), 19, b - 21 + (u ? 1 : 0), BR);
      c.rect(23, b - 21 - (u ? 1 : 0), 26, b - 21 - (u ? 1 : 0), BR);
      /* the coffee mill, the string */
      c.rect(29, b - 20, 33, b - 16, FIRERED);
      c.row(b - 21, 30, 32, IRONB);
      cartWheel(c, 34, b - 21, 2, IRONB);
      c.set(31, b - 17, GILT);
      if (u) {
        c.rect(17, b - 23, 18, b - 22, hex('#a8904e')); // weighing out
        c.rect(6, b - 17, 10, b - 16, CREAM); // a paper parcel tied
        c.col(8, b - 17, b - 16, FIRERED);
        c.set(8, b - 18, FIRERED);
        dots(c, hex('#a8904e'), [11, b - 16, 12, b - 15 + 0]);
        dots(c, GILT, [27, b - 16, 28, b - 16]); // pennies
        c.rect(2, b - 16, 4, b - 16, hex('#3a3440'));
      }
    },
    sw: 14, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 15, 12, b - 14, PINE);
      cabSide(c, 2, b - 13, 11, b - 1, OAK);
      c.rect(1, b, 12, b, D(OAK));
      c.rect(3, b - 20, 7, b - 16, FIRERED);
      c.row(b - 21, 4, 6, IRONB);
      cartWheel(c, 5, b - 22, 2, IRONB);
      c.rect(9, b - 22, 10, b - 16, hex('#7a9098'));
      c.row(b - 23, 9, 10, TIN);
      if (u) {
        c.rect(8, b - 17, 11, b - 16, CREAM);
        c.set(9, b - 18, FIRERED);
      }
    },
  });

  add('oldtime-store-shelves-tins', 'old time general store shelves tins bolts of cloth boxes jars dry goods', {
    w: 28, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 3, 24, b, mix(PINE, 0.5));
      face(c, 1, 2, 2, b, PINE);
      face(c, 25, 2, 26, b, PINE);
      board(c, 1, 1, 26, 2, PINE);
      const tin = (x, y, w, h, col) => {
        c.rect(x, y - h + 1, x + w - 1, y, col);
        c.col(x, y - h + 1, y, L(col));
        c.row(y - h + 1, x, x + w - 1, TIN);
        if (h > 3) c.rect(x + 1, y - (h >> 1), x + w - 2, y - (h >> 1), CREAM);
      };
      const cols = [FIRERED, OMNI, hex('#a8904e'), FADEBLUE, hex('#5a4a36')];
      let k = 0;
      for (const y of [9, 17]) {
        c.row(y, 3, 24, L(PINE));
        for (let x = 4; x <= 21; x += 4, k++) if (!(u && (k === 2 || k === 3 || k === 8))) tin(x, y - 1, 3, 4 + (k % 3), cols[k % 5]);
      }
      c.row(25, 3, 24, L(PINE));
      for (let i = 0; i < 5; i++) {
        if (u && i === 1) continue;
        const col = [hex('#6a2a36'), FADEBLUE, hex('#8a7a4a'), OMNI, hex('#5a4a6a')][i]; // bolts of cloth
        c.rect(4 + i * 4, 19, 6 + i * 4, 24, col);
        c.col(4 + i * 4, 19, 24, L(col));
        c.set(5 + i * 4, 19, CREAM);
      }
      c.row(b - 5, 3, 24, L(PINE));
      shelfRow(c, 4, 23, b - 6, 12, 5, u ? [1, 2, 6] : []);
      for (const x of [4, 11, 18]) {
        c.rect(x, b - 3, x + 5, b, SACK); // sacks along the floor
        c.row(b - 4, x + 1, x + 4, L(SACK));
        c.set(x + 2, b - 2, hex('#3a3440'));
      }
      if (u) {
        c.rect(8, 21, 10, 21, hex('#3a2c26'));
        c.poly([[18, b - 3], [23, b - 4], [23, b], [16, b]], CREAM); // flour run out of a slit sack
        c.set(20, b - 2, hex('#3a3440'));
      }
    },
    sw: 11, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 1, 8, 2, PINE);
      cabSide(c, 2, 3, 7, b, PINE);
      dots(c, FIRERED, [8, 7, 8, 8]);
      dots(c, FADEBLUE, [8, 14, 8, 15, 8, 21, 8, 22]);
      c.rect(8, b - 3, 9, b, SACK);
      if (u) {
        c.rect(10, b - 1, 12, b, CREAM);
        c.clear(8, 21);
        c.clear(8, 22);
      }
    },
    su: [0, 0, 3],
  });

  add('oldtime-cracker-barrel', 'old time cracker barrel general store checkers board lid biscuits wooden cask', {
    w: 16, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 13, 12, b, PINE);
      c.rect(2, b - 10, 13, b - 3, PINE);
      c.col(2, b - 10, b - 3, L(PINE));
      c.col(3, b - 13, b, L(PINE));
      for (const x of [6, 9]) c.col(x, b - 13, b, D(PINE));
      for (const y of [b - 11, b - 2]) c.row(y, 2, 13, C.iron);
      dots(c, hex('#3a3440'), [5, b - 7, 6, b - 7, 7, b - 7, 9, b - 7, 10, b - 7, 6, b - 5, 8, b - 5]);
      if (!u) {
        board(c, 1, b - 15, 14, b - 14, PINE);
        for (let x = 4; x <= 11; x++) c.set(x, b - 16, x % 2 ? EB : FIRERED); // the checkers left mid game
        c.rect(3, b - 16, 12, b - 16, hex('#3a2c26'));
        for (let x = 4; x <= 11; x += 2) c.set(x, b - 16, x % 4 ? FIRERED : CHINA);
      } else {
        c.row(b - 14, 4, 11, hex('#c8b078')); // the lid off: crackers, and a hand's worth gone
        dots(c, hex('#a8904e'), [5, b - 14, 8, b - 14, 10, b - 14]);
        c.rect(6, b - 14, 7, b - 14, hex('#3a2c26'));
        c.line(14, b - 12, 17, b, PINE); // the lid stood against it
        c.line(15, b - 12, 18, b, D(PINE));
        dots(c, hex('#c8b078'), [1, b, 0, b]);
        dots(c, FIRERED, [19, b, 16, b]);
      }
    },
    u: [0, 0, 4],
  });

  add('oldtime-flour-sacks-stack', 'old time flour sacks stack grain meal bags store mill hessian', {
    w: 22, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const sack = (x0, y0, x1, y1, tie) => {
        c.oval(x0, y0, x1, y1, SACK);
        c.rect(x0 + 1, y0 + 1, x1 - 1, y1, SACK);
        c.row(y0, x0 + 2, x1 - 2, L(SACK));
        c.row(y1, x0 + 1, x1 - 1, D(SACK));
        if (tie) c.set(x1, y0 + 2, D(SACK));
        dots(c, hex('#3a3440'), [x0 + 3, y0 + 2, x0 + 4, y0 + 2, x0 + 5, y0 + 2]);
      };
      sack(1, b - 5, 10, b, true);
      sack(10, b - 5, 19, b, true);
      sack(5, b - 10, 15, b - 5, true);
      if (!u) sack(8, b - 14, 17, b - 10, true);
      else {
        c.poly([[14, b - 7], [15, b - 7], [18, b], [11, b]], CHINA); // slit: the flour pouring out
        c.set(14, b - 8, K);
        c.set(15, b - 9, K);
        dots(c, CHINA, [19, b, 20, b, 9, b]);
        dots(c, D(CHINA), [14, b - 3, 15, b - 1]);
        dots(c, CHINA, [3, b - 12 + 12, 21, b]);
        c.rect(2, b - 1, 4, b, hex('#5a5a62')); // a rat at the bottom one
        c.set(1, b, hex('#8a6a6a'));
        c.set(5, b - 1, hex('#5a5a62'));
        c.set(4, b - 2, hex('#5a5a62'));
      }
    },
    sw: 13, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      const sack = (x0, y0, x1, y1) => {
        c.oval(x0, y0, x1, y1, SACK);
        c.rect(x0 + 1, y0 + 1, x1 - 1, y1, SACK);
        c.row(y0, x0 + 2, x1 - 2, L(SACK));
        c.row(y1, x0 + 1, x1 - 1, D(SACK));
        c.col(((x0 + x1) >> 1) + 1, y0 + 1, y1 - 1, D(SACK));
      };
      sack(2, b - 5, 10, b);
      sack(2, b - 10, 10, b - 5);
      if (!u) sack(3, b - 14, 9, b - 10);
      else {
        c.poly([[7, b - 7], [8, b - 7], [11, b], [5, b]], CHINA);
        dots(c, CHINA, [12, b, 4, b]);
      }
    },
    su: [0, 0, 1],
  });

  /* ---------- places of work ---------- */
  add('oldtime-telegraph-desk', 'old time telegraph desk morse key sounder battery jars pigeon holes operator railway office', {
    w: 26, h: 29, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 25, 23, b - 15, WAL); // pigeon holes
      c.row(b - 26, 1, 24, L(WAL));
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 2; j++) {
          hollow(c, 4 + i * 5, b - 24 + j * 5, 7 + i * 5, b - 21 + j * 5, WAL);
          if ((i + j) % 2 === 0 && !(u && i === 1)) c.rect(4 + i * 5, b - 22 + j * 5, 6 + i * 5, b - 21 + j * 5, CREAM);
        }
      board(c, 1, b - 14, 24, b - 13, WAL);
      drawer(c, 3, b - 12, 11, b - 10, WAL);
      drawer(c, 14, b - 12, 22, b - 10, WAL);
      legs(c, [2, 21], b - 9, b, WAL);
      c.rect(5, b - 5, 7, b - 1, hex('#5d7f8c')); // battery jars under
      c.rect(9, b - 5, 11, b - 1, hex('#5d7f8c'));
      dots(c, hex('#a35f38'), [6, b - 6, 10, b - 6]);
      c.line(11, b - 6, 13, b - 9, hex('#a35f38'));
      c.rect(5, b - 15, 9, b - 15, EB); // the key
      c.row(b - 16, 6, 9, BR);
      c.set(9, b - 17, EB);
      c.rect(12, b - 17, 15, b - 15, BR); // the sounder
      c.set(13, b - 18, IRONB);
      c.rect(19, b - 18, 20, b - 15, BR); // a lamp
      c.rect(19, b - 20, 20, b - 19, u ? C.flameLight : C.glass);
      if (u) {
        glow(c, 19, b - 21);
        c.rect(15, b - 15, 18, b - 15, CREAM); // the tape run out and a message taken down
        c.line(16, b - 16, 12, b - 10, CREAM);
        c.col(12, b - 9, b - 4, CREAM);
        c.rect(1, b - 16, 4, b - 15, C.paper);
        dots(c, C.slate, [2, b - 16, 3, b - 15]);
        c.set(9, b - 16, C.flameLight);
      }
    },
    sw: 14, sh: 29,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, b - 25, 6, b - 15, WAL, false);
      c.row(b - 26, 1, 7, L(WAL));
      board(c, 1, b - 14, 12, b - 13, WAL);
      c.rect(2, b - 12, 11, b - 10, WAL);
      c.row(b - 10, 2, 11, D(WAL));
      legs(c, [2, 10], b - 9, b, WAL);
      c.rect(5, b - 5, 7, b - 1, hex('#5d7f8c'));
      c.rect(8, b - 16, 11, b - 15, BR);
      c.set(11, b - 17, EB);
      c.rect(8, b - 20, 9, b - 17, u ? C.flameLight : C.glass);
      if (u) {
        glow(c, 8, b - 21);
        c.col(12, b - 13, b - 5, CREAM);
      }
    },
  });

  add('oldtime-printing-press-hand', 'old time hand printing press iron albion lever platen newspaper printer broadsheet', {
    w: 24, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [4, 16]) {
        c.rect(x, b - 28, x + 2, b - 12, IRONB);
        c.col(x, b - 28, b - 12, C.iron);
      }
      c.rect(3, b - 30, 19, b - 28, IRONB);
      c.row(b - 30, 3, 19, C.iron);
      c.rect(9, b - 32, 13, b - 31, BR); // the finial
      c.set(11, b - 33, GILT);
      c.rect(10, b - 27, 12, b - 20, C.steel); // the screw
      for (let y = b - 26; y < b - 20; y += 2) c.row(y, 10, 12, C.iron);
      c.rect(7, b - (u ? 17 : 19), 15, b - (u ? 16 : 18), IRONB); // the platen
      if (u) c.rect(10, b - 19, 12, b - 18, C.steel);
      board(c, 2, b - 14, 20, b - 12, IRONB); // the bed
      c.row(b - 15, 7, 15, u ? C.paper : hex('#4a4a55'));
      legs(c, [3, 17], b - 11, b, OAK, 3);
      c.row(b - 5, 6, 16, D(OAK));
      if (!u) {
        c.line(13, b - 23, 21, b - 26, C.steel); // the bar
        c.rect(21, b - 27, 22, b - 25, PINE);
      } else {
        c.line(13, b - 23, 6, b - 21, C.steel); // pulled over
        c.rect(1, b - 22, 2, b - 20, PINE);
        c.rect(3, b - 21, 5, b - 21, C.steel);
        c.rect(18, b - 10, 23, b - 3, C.paper); // sheets hung to dry on the frame
        c.row(b - 11, 17, 23, IRONB);
        for (let y = b - 9; y < b - 3; y += 2) c.row(y, 19, 22, hex('#3a3440'));
        c.rect(19, b - 9, 22, b - 8, hex('#2a2428'));
        dots(c, hex('#2a2428'), [8, b - 11, 9, b - 10, 10, b]);
      }
    },
    u: [0, 0, 1],
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, b - 28, 8, b - 12, IRONB);
      c.col(5, b - 28, b - 12, C.iron);
      c.rect(4, b - 30, 9, b - 28, IRONB);
      c.rect(6, b - 32, 7, b - 31, BR);
      board(c, 1, b - 14, 12, b - 12, IRONB);
      legs(c, [2, 9], b - 11, b, OAK, 3);
      c.row(b - 15, 3, 10, u ? C.paper : hex('#4a4a55'));
      c.rect(3, b - (u ? 17 : 19), 10, b - (u ? 16 : 18), IRONB);
      c.rect(9, b - 24, 10, b - 22, C.steel);
      c.rect(11, b - 25, 12, b - 22, PINE);
      if (u) {
        c.rect(11, b - 9, 12, b - 3, C.paper);
        c.set(12, b - 7, hex('#3a3440'));
      }
    },
  });

  add('oldtime-blacksmith-forge-bellows', 'old time blacksmith forge brick hearth hood bellows anvil smithy fire iron', {
    w: 34, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[5, b - 18], [21, b - 18], [17, b - 30], [9, b - 30]], IRONB); // the hood
      c.line(5, b - 18, 9, b - 30, C.iron);
      c.rect(10, b - 32, 16, b - 30, IRONB);
      c.rect(6, b - 17, 20, b - 12, hex('#17151c'));
      bricks(c, 3, b - 11, 23, b);
      c.row(b - 12, 2, 24, C.stoneLight);
      c.rect(8, b - 14, 18, b - 12, hex('#2a2428')); // the coals
      dots(c, hex('#4a3a36'), [9, b - 14, 12, b - 13, 15, b - 14, 17, b - 13]);
      c.rect(10, b - 7, 16, b - 2, hex('#17151c')); // the ash hole
      /* the bellows, to the right */
      c.poly([[22, b - 14], [32, b - 20], [32, b - 10]], hex('#5a3a28'));
      c.line(22, b - 14, 32, b - 20, PINE);
      c.line(22, b - 14, 32, b - 10, D(PINE));
      for (let x = 25; x <= 31; x += 2) c.col(x, b - 14 - ((x - 22) >> 1), b - 14 + ((x - 22) * 0.4), hex('#3a2a20'));
      c.col(31, b - 9, b, OAK);
      c.line(32, b - 20, 30, b - 26, OAK); // its pole
      c.row(b - 26, 26, 30, OAK);
      c.col(26, b - 25, b - 22, hex('#3a2a20'));
      /* the anvil, in front on the left */
      if (u) {
        fire(c, 8, 18, b - 12, 5, 6);
        dots(c, C.flame, [7, b - 13, 19, b - 13, 12, b - 4, 14, b - 3]);
        wisp(c, 12, b - 19, 4, C.ash);
        c.row(b - 14, 15, 21, C.flame); // a bar heating
        c.row(b - 14, 15, 17, C.flameLight);
        c.rect(22, b - 14, 23, b - 14, C.iron);
        dots(c, C.flameLight, [5, b - 20, 20, b - 21, 3, b - 15]);
      }
      c.rect(1, b - 3, 5, b, OAK);
      c.rect(0, b - 8, 7, b - 6, IRONB);
      c.row(b - 8, 0, 7, C.steel);
      c.rect(2, b - 5, 4, b - 4, IRONB);
      c.set(8, b - 8, IRONB);
    },
    u: [1, 0, 0], su: [0, 0, 0],
    sw: 18, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, b - 18], [13, b - 18], [11, b - 30], [5, b - 30]], IRONB);
      c.line(2, b - 18, 5, b - 30, C.iron);
      c.rect(5, b - 32, 11, b - 30, IRONB);
      bricks(c, 2, b - 11, 14, b, hex('#7a4636'), 4);
      c.row(b - 12, 1, 15, C.stoneLight);
      c.rect(3, b - 17, 12, b - 13, hex('#17151c'));
      c.oval(4, b - 24, 12, b - 10, hex('#5a3a28')); // the bellows, end on
      c.oval(5, b - 23, 11, b - 11, hex('#3a2a20'));
      c.oval(6, b - 22, 11, b - 12, hex('#5a3a28'));
      c.rect(7, b - 18, 8, b - 17, PINE);
      c.col(8, b - 10, b, OAK);
      if (u) {
        dots(c, C.flame, [3, b - 14, 2, b - 13, 13, b - 14, 14, b - 13, 13, b - 16]);
        dots(c, C.flameLight, [3, b - 15, 13, b - 15, 1, b - 20, 15, b - 21]);
        wisp(c, 14, b - 19, 4, C.ash);
      }
    },
    o: {},
  });

  add('oldtime-signal-lever-frame', 'old time railway signal box lever frame points levers red blue yellow signalman', {
    w: 24, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 5, 22, b, IRONB);
      c.row(b - 5, 1, 22, C.iron);
      for (let x = 3; x <= 20; x += 4) c.rect(x, b - 3, x + 1, b - 2, BR); // number plates
      const cols = [FIRERED, FIRERED, hex('#a8862e'), FADEBLUE, EB];
      for (let i = 0; i < 5; i++) {
        const x = 3 + i * 4,
          col = cols[i];
        if (u && i === 2) {
          c.line(x, b - 6, x + 3, b - 15, col); // pulled over
          c.line(x + 1, b - 6, x + 4, b - 15, D(col));
          c.rect(x + 3, b - 19, x + 4, b - 16, C.steel);
          continue;
        }
        c.rect(x, b - 18, x + 1, b - 6, col);
        c.col(x, b - 18, b - 6, L(col));
        c.rect(x, b - 23, x + 1, b - 19, C.steel);
        c.set(x + 2, b - 20, IRONB); // the catch handle
        c.col(x + 2, b - 19, b - 17, IRONB);
      }
      if (u) {
        c.rect(18, b - 26, 21, b - 24, IRONB); // the block bell has rung
        c.rect(19, b - 27, 20, b - 27, BR);
        dots(c, C.white, [17, b - 27, 22, b - 27, 22, b - 25]);
        c.rect(2, b - 7, 5, b - 6, C.white); // a duster dropped on the frame
      }
    },
    u: [0, 3, 0],
    sw: 14, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, b - 5, 11, b, IRONB, false);
      c.row(b - 5, 2, 11, C.iron);
      if (!u) {
        c.rect(6, b - 18, 7, b - 6, FIRERED);
        c.col(6, b - 18, b - 6, L(FIRERED));
        c.rect(6, b - 23, 7, b - 19, C.steel);
        c.col(8, b - 20, b - 17, IRONB);
      } else {
        c.line(6, b - 6, 10, b - 17, hex('#a8862e'));
        c.line(7, b - 6, 11, b - 17, D(hex('#a8862e')));
        c.rect(10, b - 21, 11, b - 18, C.steel);
        c.rect(4, b - 18, 5, b - 6, FIRERED);
        c.rect(4, b - 23, 5, b - 19, C.steel);
      }
    },
  });

  add('oldtime-iron-safe-combination', 'old time iron safe strongbox bank office heavy door brass handle gilt lettering', {
    w: 18, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, 2, 16, b - 1, hex('#34383c'));
      c.rect(1, b, 16, b, IRONB);
      c.rect(2, b, 4, b, IRONB);
      if (!u) {
        c.frame(3, 4, 14, b - 3, hex('#4a5054'));
        c.frame(4, 5, 13, b - 4, GILT);
        c.oval(7, 9, 10, 12, BR);
        c.set(8, 10, hex('#34383c'));
        c.rect(11, 14, 12, 15, BR);
        c.row(16, 10, 13, BR);
        dots(c, GILT, [6, 7, 7, 7, 9, 7, 10, 7, 11, 7]);
        dots(c, IRONB, [2, 6, 2, b - 5]);
      } else {
        hollow(c, 3, 4, 14, b - 3, hex('#34383c')); // open, and cleaned out
        c.row(11, 4, 14, hex('#4a5054'));
        c.row(17, 4, 14, hex('#4a5054'));
        c.rect(5, 15, 8, 16, C.paper);
        c.set(6, 15, FIRERED);
        c.rect(15, 4, 16, b - 3, hex('#4a5054'));
        dots(c, C.paper, [5, b, 6, b, 9, b - 1 + 1, 12, b]);
        c.set(11, b - 4, GILT); // one coin they missed
      }
    },
    sw: 14, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 1, 2, 11, b - 1, hex('#34383c'));
      c.rect(1, b, 11, b, IRONB);
      if (u) {
        face(c, 12, 4, 17, b - 3, hex('#34383c'));
        c.frame(13, 5, 16, b - 4, GILT);
        c.rect(14, 10, 15, 11, BR);
        dots(c, C.paper, [12, b, 14, b]);
      } else c.set(12, 12, BR);
    },
    su: [0, 0, 6],
  });
};
