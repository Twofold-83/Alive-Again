/* The school, second half: the canteen, the science room, the art room, the yard and the small things. See env-care.js. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, T, add) => {
  const { D, L, dots, panel, caster, wleg, screen, puddle, cabS, doorOpenS } = T;
  const { SHEET, FOLD, STEEL, STL, STD, BLK, IN, PAPER, CORK, WAT, PORC, PORD } = T;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    TEAK = hex('#7a4f34'),
    FORM = hex('#8a9a8a'),
    CREAMP = hex('#b9ab8a'),
    LEATH = hex('#6a4a38'),
    REDM = hex('#8c3a34'),
    BLUEM = hex('#3a4a6a'),
    GREENM = hex('#5a6a4a'),
    YELM = hex('#b59a3c'),
    ROOM = hex('#23222b');

  /* ---------- doors (the toilets use these too) ---------- */
  /** A door in its frame from the front (20 x 40): o.col, o.glass, o.sign(c), o.room(c) what shows when it is open. */
  function doorF(c, u, o = {}) {
    const b = c.h - 2,
      col = o.col || hex('#5a6a70'),
      fr = o.frame || hex('#c9c6b4');
    c.rect(1, 1, 18, b, fr);
    c.col(1, 1, b, L(fr));
    c.row(1, 1, 18, L(fr));
    c.rect(3, 3, 16, b, ROOM);
    if (u) {
      if (o.room) o.room(c, b);
      c.rect(3, 3, 6, b, D(col)); // the leaf swung in, seen nearly edge on
      c.col(6, 3, b, col);
      c.col(3, 3, b, D(D(col)));
      if (o.glass) c.rect(4, 7, 5, 16, hex('#55707a'));
      c.set(5, 22, STL);
      return;
    }
    c.rect(3, 3, 16, b, col);
    c.col(3, 3, b, L(col));
    c.col(16, 3, b, D(col));
    if (o.glass) {
      c.rect(5, 6, 14, 17, hex('#6f8a90')); // wired glass
      c.frame(5, 6, 14, 17, D(col));
      for (let y = 8; y < 17; y += 3) c.row(y, 6, 13, hex('#5d7880'));
      for (let x = 8; x < 14; x += 3) c.col(x, 7, 16, hex('#5d7880'));
      dots(c, C.glassLight, [6, 7, 7, 8]);
    } else panel(c, 5, 6, 14, 17, col);
    panel(c, 5, 25, 14, b - 3, col);
    c.rect(14, 21, 15, 22, C.brass);
    c.rect(4, b - 1, 15, b, mix(col, 0.8)); // kicked and scuffed along the bottom
    if (o.sign) o.sign(c, b);
  }
  /** The same door from the side: the frame post; open, the leaf stands into the room, to the left. */
  function doorS(c, u, o = {}) {
    const b = c.h - 2,
      col = o.col || hex('#5a6a70'),
      fr = o.frame || hex('#c9c6b4'),
      ox = c.w - 6;
    if (u) {
      doorOpenS(c, 1, 3, ox, b, col);
      if (o.glass) c.rect(3, 6, ox - 2, 17, hex('#6f8a90'));
      c.rect(2, 21, 3, 22, C.brass);
    }
    c.rect(ox + 1, 1, ox + 4, b, fr);
    c.col(ox + 1, 1, b, L(fr));
    c.col(ox + 4, 1, b, D(fr));
    if (!u) {
      c.col(ox + 3, 3, b, col);
      c.set(ox + 4, 21, C.brass);
    }
  }
  T.doorF = doorF;
  T.doorS = doorS;
  add('school-classroom-door', 'classroom door wired glass panel blue grey school corridor', true, {
    m: [
      20, 40,
      (c, u) =>
        doorF(c, u, {
          glass: true,
          sign: (c) => {
            c.rect(8, 20, 11, 22, SHEET);
            c.row(21, 9, 10, STD);
          },
          room: (c, b) => {
            c.poly([[7, b], [9, b - 6], [16, b - 6], [16, b]], hex('#3a3640')); // the floor inside
            c.rect(11, b - 14, 15, b - 12, hex('#4a4652')); // desks in the dark
            c.col(11, b - 11, b - 7, hex('#34313c'));
            c.col(15, b - 11, b - 7, hex('#34313c'));
            c.rect(9, 8, 15, 14, hex('#2f4a3c')); // the blackboard, something written on it
            dots(c, hex('#8a9088'), [10, 10, 11, 10, 13, 10, 10, 12, 12, 12, 13, 12, 14, 12]);
          },
        }),
    ],
    s: [6, 40, (c, u) => doorS(c, u, { glass: true })],
    su: [18, 40],
  });

  /* ---------- the canteen ---------- */
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 14, 38, b, CREAMP);
      c.col(1, b - 14, b, L(CREAMP));
      c.row(b, 1, 38, D(D(CREAMP)));
      for (const x of [3, 15, 27]) panel(c, x, b - 9, x + 9, b - 2, CREAMP);
      c.rect(1, b - 16, 38, b - 15, STEEL);
      c.row(b - 16, 1, 38, STL);
      c.rect(1, b - 12, 38, b - 12, STL); // the tray rail
      c.row(b - 11, 1, 38, STD);
      for (const x of [4, 35]) c.col(x, b - 24, b - 17, STEEL); // the glass shelf
      c.rect(2, b - 25, 37, b - 24, hex('#7f9aa0'));
      c.row(b - 25, 2, 37, C.glassLight);
      const FOOD = [hex('#b59a3c'), hex('#6a4a34'), hex('#5a7a4a')];
      for (let i = 0; i < 3; i++) {
        const x = 7 + i * 8;
        if (u) {
          c.rect(x, b - 17, x + 5, b - 17, FOOD[i]); // lids off: custard, stew, peas
          c.set(x + 2, b - 17, L(FOOD[i]));
          dots(c, hex('#a9b0b2'), [x + 1, b - 19, x + 2, b - 21, x + 4, b - 20, x + 3, b - 22]);
        } else {
          c.rect(x, b - 18, x + 5, b - 17, STL);
          c.row(b - 19, x + 1, x + 4, STL);
          c.set(x + 2, b - 20, BLK);
        }
      }
      c.rect(32, b - 21, 36, b - 17, SHEET); // plates
      for (let y = b - 20; y < b - 16; y += 2) c.row(y, 32, 36, FOLD);
      if (u) {
        c.rect(4, b - 18, 5, b - 17, STL); // a lid set down, a ladle left standing
        c.line(11, b - 18, 13, b - 23, STD);
        dots(c, FOOD[1], [20, b - 15, 21, b - 14, 21, b - 13]); // slopped down the front
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 14, 11, b, CREAMP);
      c.rect(1, b - 16, 12, b - 15, STEEL);
      c.row(b - 16, 1, 12, STL);
      c.rect(12, b - 12, 14, b - 12, STL);
      c.set(14, b - 11, STD);
      c.col(6, b - 24, b - 17, STEEL);
      c.rect(3, b - 25, 10, b - 24, hex('#7f9aa0'));
      if (u) {
        c.rect(4, b - 17, 9, b - 17, hex('#6a4a34'));
        dots(c, hex('#a9b0b2'), [5, b - 19, 7, b - 21, 8, b - 20]);
      } else {
        c.rect(4, b - 18, 9, b - 17, STL);
        c.row(b - 19, 5, 8, STL);
      }
    };
    add('school-canteen-counter', 'canteen serving counter dinner hatch hot pans tray rail school dinners', true, { m: [40, 28, front], s: [16, 28, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(3, b - 14, 8, b, PORC);
      c.col(3, b - 14, b, L(PORC));
      c.col(8, b - 14, b, PORD);
      c.rect(2, b, 9, b, PORD);
      c.rect(1, b - 18, 10, b - 15, PORC); // the bowl
      c.row(b - 18, 1, 10, L(PORC));
      c.rect(2, b - 14, 9, b - 14, PORD);
      c.rect(3, b - 18, 8, b - 18, u ? WAT : PORD);
      c.rect(8, b - 20, 9, b - 19, STL); // the spout
      c.set(10, b - 17, STD); // push button
      dots(c, T.GRIME, [5, b - 8, 6, b - 4, 4, b - 2]);
      if (u) {
        dots(c, WAT, [7, b - 21, 6, b - 22, 5, b - 22, 4, b - 21, 3, b - 20, 3, b - 19]);
        c.set(5, b - 23, L(WAT));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 14, 6, b, PORC);
      c.col(2, b - 14, b, L(PORC));
      c.rect(1, b, 7, b, PORD);
      c.rect(1, b - 18, 8, b - 15, PORC);
      c.row(b - 18, 1, 8, L(PORC));
      c.rect(2, b - 14, 7, b - 14, PORD);
      c.rect(4, b - 20, 5, b - 19, STL);
      c.set(9, b - 17, STD);
      if (u) {
        c.col(5, b - 23, b - 21, WAT); // straight up, towards us
        c.set(5, b - 24, L(WAT));
        dots(c, WAT, [4, b - 21, 6, b - 21, 3, b - 19, 7, b - 19]);
      }
    };
    add('school-drinking-fountain', 'drinking fountain porcelain pedestal playground corridor water', true, { m: [12, 27, front], s: [11, 27, side] });
  }
  {
    const bin = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 6, 11, b, hex('#2e2e33')); // on its side
        for (let x = 1; x <= 11; x += 2) c.col(x, b - 6, b, STEEL);
        c.row(b - 6, 1, 11, STL);
        c.row(b, 1, 11, STD);
        c.col(11, b - 6, b, STL);
        c.rect(13, b - 2, 15, b, SHEET); // the rubbish out across the floor
        c.set(14, b - 3, FOLD);
        c.rect(17, b - 1, 18, b, PAPER);
        c.rect(20, b, 22, b, hex('#8c3a34'));
        c.set(16, b, FOLD);
        return;
      }
      c.poly([[1, b - 10], [9, b - 10], [8, b], [2, b]], hex('#2e2e33'));
      for (let x = 1; x <= 9; x += 2) c.line(x, b - 10, x < 5 ? x + 1 : x > 5 ? x - 1 : x, b, STEEL);
      c.row(b - 10, 1, 9, STL);
      c.row(b - 5, 2, 8, STD);
      c.row(b, 2, 8, STD);
      c.rect(3, b - 12, 5, b - 11, SHEET); // screwed-up paper
      c.rect(6, b - 11, 7, b - 11, PAPER);
      c.set(4, b - 13, FOLD);
    };
    add('school-bin-wire', 'wire waste paper bin classroom rubbish screwed up paper', false, { m: [11, 16, bin], mu: [24, 9] });
  }
  {
    const PINS = [SHEET, hex('#c9b98a'), hex('#b9a0a0'), SHEET, hex('#a9b9a0')];
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [3, 26]) c.rect(x, 20, x + 1, b, W);
      c.rect(2, b, 5, b, WD);
      c.rect(25, b, 28, b, WD);
      c.rect(1, 2, 28, 20, CORK);
      c.speckle(2, 3, 27, 19, D(CORK), 6, 3);
      c.frame(1, 2, 28, 20, W);
      c.row(2, 1, 28, WL);
      if (u) {
        dots(c, SHEET, [4, 4, 5, 4, 4, 5, 20, 5, 21, 5, 24, 12, 25, 12, 25, 13, 6, 16, 7, 17]); // torn corners still pinned
        dots(c, REDM, [4, 4, 20, 5, 24, 12, 6, 16]);
        c.rect(11, 6, 18, 17, SHEET); // MISSING
        c.rect(12, 7, 17, 8, REDM);
        c.rect(13, 10, 16, 13, hex('#7a7468'));
        c.rect(14, 11, 15, 12, hex('#c79f7c'));
        c.row(15, 12, 17, STD);
        c.rect(6, b, 12, b, SHEET); // the rest on the floor
        c.rect(15, b - 1, 19, b, PAPER);
        c.set(8, b - 1, SHEET);
      } else {
        const r = rnd(5);
        let i = 0;
        for (const [x, y, w, h] of [[3, 4, 6, 7], [10, 4, 5, 5], [16, 4, 10, 8], [3, 13, 8, 6], [12, 11, 4, 8], [18, 14, 8, 5]]) {
          const col = PINS[i++ % PINS.length];
          c.rect(x, y, x + w - 1, y + h - 1, col);
          for (let yy = y + 2; yy < y + h - 1; yy += 2) c.row(yy, x + 1, x + w - 2 - ((r() * 2) | 0), D(col));
          c.set(x + (w >> 1), y, i % 2 ? REDM : BLUEM);
        }
        for (let x = 18; x < 25; x += 2) c.col(x, 6, 10, STD); // the timetable
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(2, 20, 3, b, W);
      c.rect(1, b, 4, b, WD);
      c.rect(2, 2, 3, 20, W);
      c.col(4, 3, 19, CORK);
      if (u) {
        c.rect(5, b, 7, b, SHEET);
        c.set(5, 8, SHEET);
      } else dots(c, SHEET, [5, 5, 5, 6, 5, 9, 5, 14, 5, 15]);
    };
    add('school-notice-board', 'notice board cork pinboard on legs notices timetable corridor', true, { m: [30, 32, front], s: [9, 32, side] });
  }

  /* ---------- science ---------- */
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 14, 34, b, TEAK);
      c.col(1, b - 14, b, L(TEAK));
      c.rect(1, b - 16, 34, b - 15, L(TEAK));
      c.row(b - 16, 1, 34, L(L(TEAK)));
      for (const x of [3, 13, 24]) {
        c.frame(x, b - 12, x + 8, b - 2, D(TEAK));
        c.set(x + 7, b - 7, C.brass);
      }
      c.rect(1, b, 34, b, D(D(TEAK)));
      c.rect(14, b - 16, 21, b - 16, PORC); // the sink, let in
      c.rect(15, b - 16, 20, b - 16, PORD);
      c.col(22, b - 21, b - 17, STL); // swan-neck tap
      c.row(b - 22, 20, 22, STL);
      c.set(19, b - 21, STL);
      c.rect(26, b - 18, 27, b - 17, hex('#9a7a34')); // gas tap
      c.set(27, b - 19, REDM);
      c.line(27, b - 17, 30, b - 17, hex('#8a5a4a')); // rubber tube
      c.rect(30, b - 17, 32, b - 17, STD); // the burner
      c.col(31, b - 20, b - 18, STL);
      // tripod and flask
      c.row(b - 22, 29, 33, STD);
      c.col(29, b - 21, b - 17, STD);
      c.col(33, b - 21, b - 17, STD);
      c.rect(30, b - 25, 32, b - 23, C.glassLight);
      c.rect(30, b - 24, 32, b - 23, u ? hex('#8fae5a') : hex('#5f7f5a'));
      c.col(31, b - 28, b - 26, C.glassLight);
      for (let i = 0; i < 4; i++) {
        c.col(4 + i * 2, b - 20, b - 17, C.glassLight); // test tubes in a rack
        c.set(4 + i * 2, b - 17, [REDM, BLUEM, YELM, GREENM][i]);
      }
      c.row(b - 18, 3, 11, WL);
      if (u) {
        c.set(31, b - 21, hex('#5f8ac0')); // lit
        c.set(31, b - 22, hex('#8fb3d9'));
        dots(c, hex('#8fae5a'), [31, b - 29, 30, b - 30, 32, b - 31, 31, b - 32, 33, b - 25, 33, b - 24, 34, b - 23]); // boiling over
        dots(c, hex('#a9b0b2'), [29, b - 31, 33, b - 33, 30, b - 33]);
        c.col(34, b - 22, b - 17, hex('#8fae5a'));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 14, 11, b, TEAK);
      c.rect(1, b - 16, 12, b - 15, L(TEAK));
      c.row(b - 16, 1, 12, L(L(TEAK)));
      c.col(4, b - 21, b - 17, STL);
      c.row(b - 22, 4, 6, STL);
      c.rect(8, b - 17, 10, b - 17, STD);
      c.col(9, b - 20, b - 18, STL);
      c.row(b - 22, 7, 11, STD);
      c.col(7, b - 21, b - 17, STD);
      c.col(11, b - 21, b - 17, STD);
      c.rect(8, b - 25, 10, b - 23, C.glassLight);
      c.rect(8, b - 24, 10, b - 23, u ? hex('#8fae5a') : hex('#5f7f5a'));
      c.col(9, b - 28, b - 26, C.glassLight);
      if (u) {
        c.set(9, b - 21, hex('#5f8ac0'));
        c.set(9, b - 22, hex('#8fb3d9'));
        dots(c, hex('#8fae5a'), [9, b - 29, 8, b - 30, 10, b - 31, 9, b - 32, 11, b - 24, 12, b - 23]);
        dots(c, hex('#a9b0b2'), [7, b - 31, 11, b - 33]);
      }
    };
    add('school-science-bench', 'science bench teak sink gas tap bunsen burner flask test tubes laboratory', true, { m: [36, 36, front], s: [14, 36, side] });
  }
  {
    const BONE = C.bone;
    const front = (c, u) => {
      const b = c.h - 2;
      c.col(6, 1, 4, STEEL); // the hook it hangs from
      c.col(11, 2, b - 2, STEEL);
      c.row(1, 6, 11, STEEL);
      c.row(b - 1, 3, 11, STD);
      caster(c, 2, b);
      caster(c, 10, b);
      const hx = u ? 4 : 5;
      c.rect(hx, 4, hx + 3, 7, BONE); // skull
      c.row(4, hx + 1, hx + 2, L(BONE));
      dots(c, BLK, [hx, 6, hx + 2, 6]);
      c.rect(hx + 1, u ? 9 : 8, hx + 2, u ? 9 : 8, D(BONE)); // the jaw: dropped
      c.col(6, 9, 20, D(BONE)); // spine
      for (let y = 11; y < 17; y += 2) c.row(y, 4, 8, BONE); // ribs
      c.row(10, 3, 9, BONE); // shoulders
      c.rect(4, 19, 8, 20, BONE); // pelvis
      c.set(6, 20, BLK);
      c.col(3, 11, 20, BONE); // arms
      if (u) {
        c.rect(1, b - 1, 5, b - 1, BONE); // one arm on the floor
        dots(c, BONE, [0 + 1, b, 6, b]);
      } else {
        c.col(9, 11, 20, BONE);
        c.set(9, 21, D(BONE));
      }
      c.set(3, 21, D(BONE));
      c.col(4, 21, b - 3, BONE); // legs
      c.col(8, 21, b - 3, BONE);
      dots(c, D(BONE), [4, 27, 8, 27]);
      c.rect(3, b - 2, 4, b - 2, BONE);
      c.rect(8, b - 2, 9, b - 2, BONE);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(2, 2, b - 2, STEEL);
      c.row(1, 2, 5, STEEL);
      c.col(5, 1, 3, STEEL);
      c.row(b - 1, 1, 8, STD);
      caster(c, 1, b);
      caster(c, 7, b);
      c.rect(4, 4, 7, 7, BONE);
      c.set(7, 6, BLK);
      c.rect(6, u ? 9 : 8, 7, u ? 9 : 8, D(BONE));
      c.col(5, 9, 20, D(BONE));
      for (let y = 11; y < 17; y += 2) c.row(y, 5, 8, BONE);
      c.rect(5, 19, 7, 20, BONE);
      if (!u) c.col(6, 11, 20, BONE);
      else c.rect(5, b - 1, 9, b - 1, BONE);
      c.col(6, 21, b - 3, BONE);
      c.set(6, 27, D(BONE));
      c.rect(6, b - 2, 8, b - 2, BONE);
    };
    add('school-skeleton-wheeled', 'skeleton model on wheeled stand biology room anatomy bones', true, { m: [14, 38, front], s: [11, 38, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 22, 20, b, TEAK);
      c.col(1, 22, b, L(TEAK));
      c.frame(3, 24, 10, b - 2, D(TEAK));
      c.frame(11, 24, 18, b - 2, D(TEAK));
      c.row(b, 1, 20, D(D(TEAK)));
      c.rect(1, 5, 20, 21, hex('#c9c6b4')); // the chamber
      c.col(1, 5, 21, SHEET);
      c.rect(3, 7, 18, 20, hex('#3f4a48'));
      c.rect(8, 1, 13, 4, STD); // flue
      c.col(8, 1, 4, STL);
      c.row(20, 3, 18, hex('#8a8a7a'));
      c.col(10, 13, 19, STD); // a retort stand
      c.row(19, 8, 12, STD);
      c.rect(11, 15, 13, 17, C.glassLight);
      c.rect(11, 16, 13, 17, u ? hex('#b5a03c') : hex('#7a6a3c'));
      c.rect(15, 17, 16, 19, hex('#7a5a34'));
      if (u) {
        c.rect(3, 7, 18, 9, hex('#7f9aa0')); // the sash pushed right up
        c.row(9, 3, 18, SHEET);
        const r = rnd(9);
        for (let y = 2; y < 20; y++) for (let x = 2; x < 20; x++) if (r() < (y < 11 ? 0.2 : 0.38) && Math.abs(x - 11) < 3 + (20 - y) / 2) c.set(x, y, y < 9 ? hex('#a3a05a') : hex('#c2b85a')); // yellow fumes rolling out
      } else {
        c.rect(3, 7, 18, 20, hex('#5d7880'));
        c.rect(10, 13, 10, 19, hex('#4a5a5c'));
        c.rect(11, 15, 13, 17, hex('#8fa9ad'));
        c.rect(11, 16, 13, 17, hex('#6f6f4c'));
        c.row(13, 3, 18, SHEET); // the sash bar
        dots(c, C.glassLight, [4, 8, 5, 9, 6, 10, 14, 15, 15, 16]);
      }
      c.rect(9, 21, 12, 21, STD);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 22, 10, b, TEAK);
      cabS(c, 1, 5, 10, 21, hex('#c9c6b4'), { frame: false });
      c.rect(3, 7, 8, 20, hex('#5d7880'));
      c.col(3, 7, 20, C.glassLight);
      c.rect(4, 1, 7, 4, STD);
      c.col(11, 7, u ? 9 : 20, hex('#7f9aa0'));
      if (u) dots(c, hex('#c2b85a'), [11, 12, 12, 11, 12, 14, 13, 10, 11, 16, 13, 13, 12, 8, 14, 7, 13, 5, 12, 18]);
    };
    add('school-fume-cupboard', 'fume cupboard chemistry glass sash flue science room', true, { m: [22, 38, front], s: [13, 38, side], su: [16, 38] });
  }

  /* ---------- lessons ---------- */
  {
    const SEA = hex('#8fa3a0'),
      LANDS = [hex('#b08a7a'), hex('#b5a36a'), hex('#8a9a6a'), hex('#b08a7a')];
    const front = (c, u) => {
      const b = c.h - 2;
      c.col(13, 2, b - 2, W); // the stand
      c.line(13, b - 6, 8, b, WD);
      c.line(13, b - 6, 18, b, WD);
      c.rect(1, 2, 26, 3, WD); // roller
      c.row(2, 1, 26, W);
      if (u) {
        c.rect(2, 4, 25, 5, PAPER); // shot back up the roller
        c.row(5, 2, 25, D(PAPER));
        c.col(20, 6, 14, hex('#b39a5a')); // the cord still swinging
        c.set(21, 15, WD);
        c.rect(3, b, 9, b, SEA); // a strip torn off, on the floor
        c.rect(5, b - 1, 8, b - 1, LANDS[0]);
      } else {
        c.rect(2, 4, 25, 24, SEA);
        c.frame(2, 4, 25, 24, PAPER);
        c.poly([[4, 7], [9, 6], [11, 10], [8, 15], [5, 13]], LANDS[0]);
        c.poly([[13, 6], [22, 7], [23, 12], [17, 13], [14, 10]], LANDS[1]);
        c.poly([[15, 15], [19, 15], [18, 21], [16, 20]], LANDS[2]);
        c.rect(21, 17, 23, 19, LANDS[3]);
        c.rect(6, 17, 8, 21, LANDS[2]);
        dots(c, hex('#6a5a4a'), [7, 9, 17, 9, 20, 10, 17, 17]);
        c.line(3, 14, 6, 5, FOLD); // a crease
        c.rect(1, 25, 26, 25, WD);
        c.col(20, 26, 28, hex('#b39a5a'));
        c.set(20, 29, WD);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(4, 2, b - 2, W);
      c.line(4, b - 6, 1, b, WD);
      c.line(4, b - 6, 7, b, WD);
      c.rect(4, 2, 6, 3, WD);
      if (u) c.rect(5, 4, 6, 5, PAPER);
      else {
        c.col(5, 4, 24, PAPER);
        c.set(5, 25, WD);
      }
    };
    add('school-map-stand', 'wall map on roller stand world map geography faded pull down', true, { m: [28, 38, front], s: [9, 38, side] });
  }
  {
    const BEADS = [REDM, BLUEM, YELM, GREENM, SHEET];
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 2, b, W);
      c.rect(17, 2, 18, b, W);
      c.rect(1, 2, 18, 3, WL);
      c.rect(1, b - 3, 18, b - 2, W);
      c.rect(1, b, 4, b, WD);
      c.rect(15, b, 18, b, WD);
      for (let i = 0; i < 5; i++) {
        const y = 6 + i * 4;
        if (u && i === 3) {
          c.row(y, 3, 7, STD); // one wire snapped: its beads on the floor
          c.line(7, y, 9, y + 3, STD);
          continue;
        }
        c.row(y, 3, 16, STD);
        const n = 5,
          left = u ? [1, 4, 0, 0, 2][i] : 5;
        for (let k = 0; k < n; k++) {
          const x = k < left ? 3 + k * 2 : 16 - (n - 1 - k) * 2;
          c.rect(x, y - 1, x, y + 1, BEADS[i]);
          c.set(x, y - 1, L(BEADS[i]));
        }
      }
      if (u) dots(c, BEADS[3], [5, b, 8, b, 9, b - 1, 12, b, 20, b]);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(3, 2, 4, b, W);
      c.col(3, 2, b, WL);
      c.rect(1, b, 6, b, WD);
      for (let i = 0; i < 5; i++) if (!(u && i === 3)) c.rect(5, 5 + i * 4, 5, 7 + i * 4, BEADS[i]);
      if (u) dots(c, BEADS[3], [7, b, 8, b - 1]);
    };
    add('school-abacus-frame', 'abacus counting frame beads infants classroom wooden', true, { m: [20, 28, front], mu: [23, 28], s: [8, 28, side], su: [11, 28] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.line(4, 2, 1, b, W);
      c.line(11, 2, 14, b, W);
      c.rect(4, 1, 11, 2, WL);
      c.rect(2, 5, 13, 19, SHEET);
      c.row(20, 1, 14, W); // ledge
      c.rect(3, 19, 4, 20, REDM); // paint pots
      c.rect(6, 19, 7, 20, BLUEM);
      c.rect(9, 19, 10, 20, YELM);
      c.col(12, 16, 20, WD); // a brush
      c.set(12, 15, BLK);
      if (u) {
        c.rect(2, 5, 13, 7, hex('#7f8fa0'));
        c.rect(2, 16, 13, 19, hex('#6a7a4a'));
        c.rect(5, 8, 10, 17, hex('#23222b')); // somebody has painted over it
        c.rect(4, 10, 11, 14, hex('#23222b'));
        c.rect(6, 6, 9, 8, hex('#23222b'));
        dots(c, C.red, [7, 7, 9, 7]);
        c.col(4, 15, 18, hex('#23222b')); // running
        c.col(11, 15, 17, hex('#23222b'));
        c.col(8, 18, 19, hex('#23222b'));
        dots(c, hex('#23222b'), [5, 21, 8, 22, 5, b]);
      } else {
        c.rect(2, 5, 13, 7, hex('#7f8fa0')); // sky, sun, a house, grass
        c.rect(10, 6, 11, 7, YELM);
        c.rect(2, 16, 13, 19, hex('#6a7a4a'));
        c.rect(4, 12, 8, 16, REDM);
        c.line(3, 12, 6, 9, WD);
        c.line(6, 9, 9, 12, WD);
        c.rect(6, 14, 6, 16, WD);
        c.col(11, 12, 16, BLK); // mummy
        c.set(11, 11, hex('#c79f7c'));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.line(6, 2, 10, b, W);
      c.line(5, 2, 1, b, WD);
      c.line(7, 5, 9, 19, SHEET);
      c.rect(9, 20, 11, 20, W);
      c.set(11, 19, REDM);
      c.row(b - 8, 3, 8, WD);
      if (u) dots(c, hex('#23222b'), [10, 21, 11, 23, 11, b]);
    };
    add('school-easel-painting', 'painting easel childs picture paint pots art room infant', true, { m: [16, 30, front], s: [13, 30, side] });
  }
  {
    const bell = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 2, 3, b - 1, WD); // on its side, still rocking
        c.poly([[4, b - 3], [8, b - 5], [8, b], [4, b]], C.brass);
        c.line(4, b - 3, 8, b - 5, C.gold);
        c.col(8, b - 5, b, D(C.brass));
        c.set(9, b - 1, BLK);
        return;
      }
      c.rect(3, 1, 4, 4, WD);
      c.col(3, 1, 4, W);
      c.poly([[3, 5], [4, 5], [6, 9], [1, 9]], C.brass);
      c.line(3, 5, 1, 9, C.gold);
      c.row(9, 1, 6, D(C.brass));
      c.set(4, 10, BLK);
    };
    add('school-handbell', 'school hand bell brass wooden handle playtime bell', false, { m: [8, 12, bell], mu: [11, 8] });
  }
  {
    const stool = (side) => (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 13, 8, b - 12, W);
      c.row(b - 13, 2, 8, WL);
      c.line(3, b - 11, side ? 3 : 1, b, WD);
      c.line(7, b - 11, side ? 8 : 9, b, WD);
      if (!side) c.col(5, b - 11, b, D(WD));
      c.row(b - 5, 3, 7, WD);
      if (u) {
        c.poly([[10, b], [16, b - 2], [16, b]], SHEET); // the cap, trodden flat on the floor
        c.row(b, 10, 16, FOLD);
        c.set(14, b - 1, REDM);
      } else {
        c.poly([[5, b - 21], [3, b - 14], [7, b - 14]], SHEET); // the dunce's cap
        c.col(5, b - 21, b - 14, L(SHEET));
        c.line(6, b - 19, 7, b - 14, FOLD);
        c.rect(5, b - 17, 5, b - 15, REDM); // D
        c.set(6, b - 16, REDM);
      }
    };
    add('school-dunce-stool', 'dunce stool tall wooden stool paper cap corner punishment', false, { m: [11, 24, stool(false)], mu: [18, 24], s: [11, 24, stool(true)], su: [18, 24] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 24, b, W);
      c.col(1, 2, b, WL);
      c.row(2, 1, 24, WL);
      const r = rnd(11);
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
          const x = 2 + j * 6,
            y = 3 + i * 4;
          c.rect(x, y, x + 4, y + 2, mix(W, 0.38));
          const k = r();
          if (u && (i + j) % 2 === 0) continue;
          if (k < 0.75) c.rect(x, y + 2, x + 3 + (k < 0.3 ? 1 : 0), y + 2, k < 0.4 ? PAPER : SHEET);
          if (k < 0.35) c.rect(x, y + 1, x + 2, y + 1, [REDM, BLUEM, PAPER][(k * 9) | 0]);
        }
      if (u) {
        c.rect(14, 12, 15, 13, C.brass); // something left right at the back of one
        c.rect(5, b, 11, b, SHEET);
        c.rect(7, b - 1, 12, b - 1, PAPER);
        c.rect(15, b, 19, b, SHEET);
        c.set(9, b - 2, SHEET);
      }
      c.rect(1, 19, 24, 19, WL);
      c.frame(3, 21, 12, b - 2, WD);
      c.frame(13, 21, 22, b - 2, WD);
      dots(c, C.brass, [11, 25, 14, 25]);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 7, b, W);
      c.row(19, 1, 7, WD);
      if (u) {
        c.rect(8, b, 11, b, SHEET);
        c.set(8, 9, SHEET);
      } else dots(c, SHEET, [8, 5, 8, 13]);
    };
    add('school-pigeonholes', 'pigeonholes staff room post registers papers wooden cupboard', true, { m: [26, 30, front], s: [10, 30, side], su: [13, 30] });
  }
  {
    const side = (c, u) => {
      const b = c.h - 2,
        red = hex('#7a3a34');
      c.rect(8, b - 5, 19, b - 2, red); // the motor housing
      c.row(b - 5, 9, 18, L(red));
      c.rect(11, b - 7, 16, b - 6, STD);
      c.rect(7, b - 1, 20, b, hex('#4a4038')); // the brush
      dots(c, hex('#6a5a4a'), [8, b, 11, b, 14, b, 17, b, 20, b]);
      if (u) {
        c.col(13, 3, b - 8, STEEL); // stood upright, the flex run out across the floor
        c.rect(11, 2, 15, 2, BLK);
        c.set(13, 6, C.red);
        c.line(13, 10, 5, b - 1, BLK);
        c.row(b, 1, 5, BLK);
        dots(c, hex('#8a8a7a'), [22, b, 24, b, 21, b - 1]);
      } else {
        c.line(13, b - 8, 4, 4, STEEL);
        c.line(2, 5, 6, 2, BLK); // the handles
        c.set(6, 7, BLK); // the flex wound on its hooks
        c.rect(7, 9, 8, 13, BLK);
        c.set(9, 14, BLK);
      }
    };
    const front = (c, u) => {
      const b = c.h - 2,
        red = hex('#7a3a34');
      c.rect(2, b - 5, 11, b - 2, red);
      c.row(b - 5, 3, 10, L(red));
      c.rect(1, b - 1, 12, b, hex('#4a4038'));
      dots(c, hex('#6a5a4a'), [2, b, 5, b, 8, b, 11, b]);
      c.col(6, u ? 3 : 6, b - 6, STEEL);
      c.col(7, u ? 3 : 6, b - 6, STD);
      c.rect(2, u ? 2 : 5, 11, u ? 2 : 5, BLK);
      if (u) {
        c.set(7, 6, C.red);
        c.line(6, 10, 2, b - 6, BLK);
        c.col(1, b - 5, b - 2, BLK);
      } else c.rect(5, 9, 8, 13, BLK);
    };
    add('school-floor-polisher', 'floor polisher caretakers buffing machine electric corridor', true, { base: 'side', m: [22, 28, side], mu: [26, 28], s: [14, 28, front] });
  }

  /* ---------- the yard ---------- */
  {
    const paint = hex('#5a7060');
    const front = (c, u) => {
      const b = c.h - 2;
      c.line(4, 2, 1, b, paint);
      c.line(5, 2, 3, b, D(paint));
      c.line(23, 2, 26, b, paint);
      c.line(22, 2, 24, b, D(paint));
      c.rect(3, 1, 24, 2, paint);
      c.row(1, 3, 24, L(paint));
      dots(c, C.rust, [8, 2, 15, 1, 20, 2, 2, 20, 25, 24]);
      if (u) {
        c.line(11, 3, 17, 24, STD); // left swinging
        c.line(17, 3, 23, 22, STD);
        c.line(16, 25, 23, 23, WL);
        c.line(16, 26, 23, 24, W);
      } else {
        c.col(11, 3, 25, STD);
        c.col(17, 3, 25, STD);
        c.rect(10, 26, 18, 27, WL);
        c.row(27, 10, 18, W);
      }
      c.rect(11, b, 17, b, hex('#4a3a2c')); // the worn patch under it
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.line(9, 2, 2, b, paint);
      c.line(10, 2, 17, b, paint);
      c.rect(9, 1, 10, 2, L(paint));
      c.row(18, 6, 13, D(paint));
      if (u) {
        c.line(10, 3, 17, 22, STD);
        c.rect(16, 23, 19, 24, WL);
        c.row(24, 16, 19, W);
      } else {
        c.col(10, 3, 25, STD);
        c.rect(8, 26, 12, 27, WL);
        c.row(27, 8, 12, W);
      }
    };
    add('school-playground-swing', 'playground swing steel frame chains wooden seat school yard', true, { m: [28, 36, front], s: [21, 36, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 9, 16, b, WP); // a tea chest
      c.col(1, b - 9, b, L(WP));
      c.frame(1, b - 9, 16, b, STD);
      c.rect(4, b - 6, 13, b - 3, SHEET);
      c.row(b - 5, 5, 12, STD); // LOST PROPERTY
      c.row(b - 4, 6, 10, STD);
      if (u) {
        c.rect(2, b - 10, 15, b - 10, IN);
        c.rect(10, b - 12, 16, b - 6, BLUEM); // a jumper dragged half out
        c.col(12, b - 11, b - 6, D(BLUEM));
        c.rect(17, b - 2, 20, b, BLUEM);
        c.rect(3, b - 11, 5, b - 10, hex('#8a6a4a')); // the bear's ear
        c.rect(19, b - 1, 22, b, BLK); // a plimsoll, kicked clear
        c.set(20, b - 2, SHEET);
      } else {
        c.rect(2, b - 12, 15, b - 10, BLUEM);
        c.rect(3, b - 13, 8, b - 12, REDM); // a scarf
        for (let x = 4; x < 8; x += 2) c.col(x, b - 13, b - 12, YELM);
        c.rect(8, b - 12, 9, b - 7, REDM);
        c.set(9, b - 9, YELM);
        c.rect(11, b - 13, 14, b - 12, BLK); // a plimsoll
        c.row(b - 13, 11, 13, SHEET);
        c.rect(4, b - 15, 6, b - 14, hex('#8a6a4a')); // a bear
        dots(c, hex('#8a6a4a'), [3, b - 16, 7, b - 16]);
        c.set(5, b - 14, BLK);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 9, 11, b, WP);
      c.col(1, b - 9, b, L(WP));
      c.frame(1, b - 9, 11, b, STD);
      if (u) {
        c.rect(2, b - 10, 10, b - 10, IN);
        c.rect(8, b - 12, 12, b - 6, BLUEM);
        c.rect(12, b - 2, 14, b, BLUEM);
      } else {
        c.rect(2, b - 12, 10, b - 10, BLUEM);
        c.rect(3, b - 13, 7, b - 12, REDM);
        c.rect(5, b - 15, 7, b - 14, hex('#8a6a4a'));
      }
    };
    add('school-lost-property-box', 'lost property box tea chest scarf plimsoll teddy bear jumper', true, { m: [18, 19, front], mu: [24, 19], s: [13, 19, side], su: [16, 19] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 17, 11, b, W);
      c.col(2, b - 17, b, WL);
      c.rect(1, b, 12, b, WD);
      c.rect(1, b - 19, 12, b - 18, WL); // the sloping top, seen from the hall
      c.row(b - 19, 1, 12, L(WL));
      c.rect(5, b - 13, 8, b - 9, C.gold); // the school crest
      c.rect(6, b - 12, 7, b - 10, REDM);
      c.set(5, b - 9, W);
      c.set(8, b - 9, W);
      c.col(u ? 9 : 7, b - 24, b - 20, STD); // microphone
      c.rect(u ? 9 : 6, b - 26, u ? 10 : 7, b - 25, BLK);
      if (u) {
        c.line(9, b - 24, 11, b - 27, STD); // bent over
        c.rect(11, b - 28, 12, b - 27, BLK);
        c.clearRect(9, b - 26, 10, b - 25);
        c.rect(13, b, 18, b, SHEET); // the speech, all over the floor
        c.rect(14, b - 1, 17, b - 1, SHEET);
        c.set(15, b - 2, FOLD);
        c.rect(12, b - 8, 13, b - 5, SHEET);
      } else c.rect(2, b - 20, 5, b - 20, SHEET);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 16, 8, b, W);
      c.rect(1, b, 9, b, WD);
      c.line(1, b - 17, 9, b - 20, WL); // the slope
      c.line(1, b - 18, 9, b - 21, L(WL));
      c.rect(1, b - 17, 2, b - 17, WL);
      c.col(8, b - 25, b - 21, STD);
      if (u) {
        c.line(8, b - 25, 10, b - 27, STD);
        c.rect(10, b - 28, 11, b - 27, BLK);
        c.rect(10, b, 14, b, SHEET);
        c.set(11, b - 1, SHEET);
      } else {
        c.rect(7, b - 27, 8, b - 26, BLK);
        c.line(2, b - 19, 6, b - 21, SHEET);
      }
    };
    add('school-lectern', 'lectern assembly hall reading desk school crest microphone headmaster', true, { m: [14, 31, front], mu: [20, 31], s: [12, 31, side], su: [16, 31] });
  }
  {
    const beige = hex('#b9b29a');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 13, 16, b - 12, FORM);
      c.row(b - 13, 1, 16, L(FORM));
      wleg(c, 1, b - 11, b);
      wleg(c, 15, b - 11, b);
      c.row(b - 5, 2, 15, STD);
      c.rect(4, b - 8, 11, b - 6, hex('#34343c')); // the cassette recorder
      c.rect(5, b - 7, 7, b - 7, STD);
      c.set(10, b - 7, u ? C.red : BLK);
      c.rect(2, b - 16, 15, b - 14, beige); // the computer
      c.row(b - 16, 2, 15, L(beige));
      for (let x = 3; x < 13; x += 2) c.set(x, b - 15, BLK);
      c.rect(13, b - 15, 14, b - 15, REDM);
      c.rect(3, b - 27, 14, b - 17, beige); // the monitor
      c.row(b - 27, 3, 14, L(beige));
      c.col(3, b - 27, b - 17, L(beige));
      screen(c, 4, b - 26, 13, b - 19, u ? 'text' : 'off');
      if (u) c.rect(5, b - 20, 6, b - 20, T.TR); // the cursor, waiting
      c.set(13, b - 18, u ? T.TR : BLK);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 13, 12, b - 12, FORM);
      c.row(b - 13, 1, 12, L(FORM));
      wleg(c, 1, b - 11, b);
      wleg(c, 11, b - 11, b);
      c.row(b - 5, 2, 11, STD);
      c.rect(4, b - 8, 9, b - 6, hex('#34343c'));
      c.rect(4, b - 16, 12, b - 14, beige);
      c.row(b - 16, 4, 12, L(beige));
      cabS(c, 3, b - 27, 10, b - 17, beige, { frame: false });
      c.poly([[1, b - 24], [3, b - 26], [3, b - 18], [1, b - 20]], D(beige));
      c.col(11, b - 26, b - 19, u ? T.TR : T.SCR);
      if (u) c.col(12, b - 25, b - 21, hex('#3f6a4c'));
    };
    add('school-computer-trolley', 'school computer on trolley beige micro monitor cassette recorder', true, { m: [18, 30, front], s: [15, 30, side] });
  }

  /* ---------- small things ---------- */
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 6, 10, b, LEATH);
      c.col(1, b - 6, b, L(LEATH));
      c.row(b, 1, 10, D(LEATH));
      c.line(2, b - 7, 5, b - 10, D(LEATH)); // strap
      c.line(6, b - 10, 9, b - 7, D(LEATH));
      if (u) {
        c.rect(1, b - 7, 10, b - 7, IN); // open
        c.rect(1, b - 2, 10, b, D(LEATH)); // the flap hanging down the front
        c.rect(2, b - 9, 4, b - 7, REDM); // books coming out
        c.rect(5, b - 10, 6, b - 7, BLUEM);
        c.line(8, b - 12, 9, b - 7, hex('#b39a5a')); // a ruler
        c.rect(12, b, 16, b, SHEET);
        c.rect(12, b - 1, 14, b - 1, SHEET);
        c.set(16, b - 1, hex('#8f3a34'));
      } else {
        c.rect(1, b - 6, 10, b - 3, mix(LEATH, 1.1)); // the flap
        c.row(b - 3, 1, 10, D(LEATH));
        for (const x of [3, 8]) {
          c.col(x, b - 3, b - 1, D(LEATH));
          c.set(x, b - 2, C.brass);
        }
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 6, 4, b, LEATH);
      c.col(1, b - 6, b, L(LEATH));
      c.col(4, b - 6, b, D(LEATH));
      c.col(2, b - 10, b - 7, D(LEATH));
      if (u) {
        c.rect(1, b - 7, 4, b - 7, IN);
        c.rect(2, b - 9, 3, b - 8, REDM);
        c.col(5, b - 3, b, D(LEATH));
        c.rect(6, b, 8, b, SHEET);
      } else c.set(5, b - 2, C.brass);
    };
    add('school-satchel', 'school satchel leather bag brown buckles strap books', false, { m: [12, 15, front], mu: [18, 15], s: [7, 15, side], su: [10, 15] });
  }
  {
    const TIN = hex('#6a3a3a');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 4, 9, b, TIN);
      c.col(1, b - 4, b, L(TIN));
      c.row(b - 2, 1, 9, BLUEM);
      for (let x = 2; x < 9; x += 3) c.col(x, b - 4, b, D(TIN));
      c.row(b, 1, 9, D(TIN));
      if (u) {
        c.rect(1, b - 10, 9, b - 6, D(TIN)); // lid up
        c.frame(1, b - 10, 9, b - 6, TIN);
        c.rect(1, b - 5, 9, b - 5, IN);
        c.rect(2, b - 5, 5, b - 5, SHEET); // half a sandwich
        c.rect(2, b - 6, 4, b - 6, hex('#b39a6a'));
        c.set(7, b - 5, hex('#8f3a34'));
        dots(c, hex('#b39a6a'), [11, b, 13, b]); // crumbs
      } else {
        c.rect(1, b - 5, 9, b - 5, L(TIN));
        c.rect(4, b - 7, 6, b - 7, STD); // handle
        dots(c, STD, [4, b - 6, 6, b - 6]);
        c.set(5, b - 3, C.brass);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 4, 6, b, TIN);
      c.col(1, b - 4, b, L(TIN));
      c.row(b - 2, 1, 6, BLUEM);
      c.row(b, 1, 6, D(TIN));
      if (u) {
        c.line(1, b - 6, 1, b - 10, TIN); // the lid, edge on
        c.rect(1, b - 5, 6, b - 5, IN);
        c.rect(3, b - 6, 5, b - 5, SHEET);
      } else {
        c.rect(1, b - 5, 6, b - 5, L(TIN));
        c.set(3, b - 6, STD);
      }
    };
    add('school-lunch-tin', 'lunch box tin tartan sandwich packed lunch dinner tin', false, { m: [11, 13, front], mu: [15, 13], s: [8, 13, side] });
  }
  {
    const COVERS = [REDM, BLUEM, GREENM, hex('#6a5a4a'), BLUEM];
    const pile = (w) => (c, u) => {
      const b = c.h - 2;
      for (let i = 0; i < 5; i++) {
        c.rect(1 + (i % 2), b - i, w - 2 - ((i + 1) % 2), b - i, COVERS[i]);
        c.set(w - 2 - ((i + 1) % 2), b - i, SHEET);
      }
      if (u) {
        c.rect(1, b - 6, w - 1, b - 5, SHEET); // the top one open: more red ink than blue
        c.set(w >> 1, b - 6, STD);
        c.set(w >> 1, b - 5, STD);
        dots(c, C.red, [2, b - 6, 3, b - 5, w - 3, b - 6, w - 4, b - 5, w - 2, b - 5]);
        dots(c, BLUEM, [4, b - 6, w - 5, b - 6]);
        c.line(w, b - 3, w + 3, b, C.red); // the marking pen
      } else {
        c.rect(1, b - 5, w - 3, b - 5, COVERS[2]);
        c.rect(3, b - 5, 5, b - 5, SHEET); // name label
      }
    };
    add('school-exercise-books-pile', 'pile of exercise books marking red ink homework', false, { m: [11, 9, pile(11)], mu: [16, 10], s: [9, 9, pile(9)], su: [14, 10] });
  }
  {
    const col = hex('#b3ad94');
    const front = (c, u) => {
      const b = c.h - 2;
      for (let x = 2; x < 21; x += 3) {
        c.rect(x, b - 12, x + 1, b - 2, col);
        c.col(x, b - 12, b - 2, L(col));
        c.set(x + 2, b - 11, D(col));
        c.set(x + 2, b - 3, D(col));
      }
      c.rect(2, b - 13, 21, b - 13, L(col));
      c.col(2, b - 1, b, D(col)); // feet
      c.col(20, b - 1, b, D(col));
      c.row(b - 1, 22, 23, hex('#84482a')); // pipe and valve
      c.rect(23, b - 4, 24, b - 2, hex('#9a7a34'));
      c.col(24, b - 1, b, hex('#84482a'));
      if (u) {
        c.rect(15, b, 18, b, hex('#6b2332')); // one mitten on the floor
        c.col(23, b - 1, b, T.RUSTW); // the valve weeping rust
        puddle(c, 20, 26, b, T.RUSTW);
        dots(c, T.RUSTW, [21, b - 6, 21, b - 4]);
      } else {
        c.rect(3, b - 15, 6, b - 13, hex('#6b2332')); // wet mittens and a scarf, drying
        c.set(6, b - 16, hex('#6b2332'));
        c.rect(8, b - 15, 11, b - 13, hex('#6b2332'));
        c.set(8, b - 16, hex('#6b2332'));
        c.rect(13, b - 14, 20, b - 13, YELM);
        c.rect(19, b - 13, 20, b - 8, YELM);
        for (let x = 14; x < 20; x += 2) c.set(x, b - 14, BLUEM);
        c.set(19, b - 9, BLUEM);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 12, 5, b - 2, col);
      c.col(2, b - 12, b - 2, L(col));
      c.col(5, b - 12, b - 2, D(col));
      c.row(b - 13, 2, 5, L(col));
      c.col(3, b - 1, b, D(col));
      if (u) {
        c.rect(6, b, 8, b, hex('#6b2332'));
        c.set(1, b, T.RUSTW);
      } else {
        c.rect(2, b - 15, 5, b - 13, hex('#6b2332'));
        c.rect(5, b - 13, 6, b - 9, YELM);
      }
    };
    add('school-radiator-mittens', 'school radiator cast iron wet mittens scarf drying cloakroom', true, { m: [26, 19, front], mu: [28, 19], s: [8, 19, side], su: [10, 19] });
  }
  {
    const crate = (w) => (c, u) => {
      const b = c.h - 2,
        x1 = w - 2;
      for (let x = 2; x < x1; x += 2) {
        const empty = u && (x % 4 === 0 || x > x1 - 4);
        c.col(x, b - 8, b - 2, empty ? C.glassLight : SHEET); // third-pint bottles
        c.set(x, b - 9, empty ? C.glassLight : STL);
        if (empty) c.set(x, b - 3, SHEET);
      }
      c.rect(1, b - 5, x1, b, hex('#5a6a7a'));
      c.col(1, b - 5, b, L(hex('#5a6a7a')));
      c.row(b - 5, 1, x1, L(hex('#5a6a7a')));
      c.row(b - 2, 2, x1 - 1, D(hex('#5a6a7a')));
      for (let x = 3; x < x1; x += 3) c.col(x, b - 4, b - 1, D(hex('#5a6a7a')));
      if (u) {
        c.rect(x1 + 2, b - 1, x1 + 5, b, C.glassLight); // one knocked over
        c.set(x1 + 6, b, STL);
        c.rect(x1 + 4, b, x1 + 8, b, hex('#d8d4c4'));
        c.line(6, b - 9, 7, b - 12, hex('#a85a5a')); // a straw
      }
    };
    add('school-milk-crate', 'school milk crate third pint bottles break time straws', false, { m: [15, 13, crate(15)], mu: [23, 15], s: [11, 13, crate(11)], su: [19, 15] });
  }
};
