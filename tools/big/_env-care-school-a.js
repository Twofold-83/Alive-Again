/* The school, first half: the classroom, the corridor, the hall and the gym. See env-care.js. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, T, add) => {
  const { D, L, dots, panel, caster, wleg, screen, bottle, jars, stream, puddle, cabS, doorOpenF, doorOpenS, wheel, sheet, splat, folds, books, turned } = T;
  const { SHEET, FOLD, STEEL, STL, STD, IRON, ID, BLK, RUB, YEL, BLOOD, IN, PAPER, CORK, BOARD, CHALK, LOCK, PLASTIC } = T;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    FORM = hex('#8a9a8a'), // grey-green formica
    OAK = hex('#8c6a40'),
    INK = hex('#28304e'),
    GYMW = hex('#b39a6a'),
    LEATH = hex('#6a4a38'),
    COATS = [C.navy, hex('#6b2332'), hex('#a07e2c'), hex('#4a5e36'), hex('#565663')];

  /* ---------- chairs ---------- */
  /** A moulded plastic chair from the front (10 wide from x) and from the side. */
  function pchairF(c, x, b, col = PLASTIC) {
    c.rect(x + 1, b - 15, x + 8, b - 10, col);
    c.row(b - 15, x + 2, x + 7, L(col));
    c.clear(x + 1, b - 15);
    c.clear(x + 8, b - 15);
    c.rect(x + 4, b - 13, x + 5, b - 12, D(col));
    c.rect(x + 1, b - 8, x + 8, b - 7, col);
    c.row(b - 8, x + 1, x + 8, L(col));
    c.row(b - 7, x + 1, x + 8, D(col));
    c.col(x + 1, b - 6, b, STEEL);
    c.col(x + 8, b - 6, b, STEEL);
    c.rect(x + 3, b - 9, x + 3, b - 9, STD);
    c.rect(x + 6, b - 9, x + 6, b - 9, STD);
  }
  function pchairS(c, x, b, col = PLASTIC) {
    c.line(x + 1, b - 15, x + 2, b - 9, col);
    c.line(x + 2, b - 15, x + 3, b - 9, D(col));
    c.rect(x + 2, b - 8, x + 8, b - 7, col);
    c.row(b - 8, x + 2, x + 8, L(col));
    c.line(x + 3, b - 6, x + 1, b, STEEL);
    c.line(x + 7, b - 6, x + 9, b, STEEL);
  }
  /** The same chair lying on its back on the floor, seen from the side: the legs in the air. */
  function pchairDown(c, x, b, col = PLASTIC) {
    c.rect(x, b - 1, x + 6, b, col);
    c.row(b - 1, x, x + 6, L(col));
    c.rect(x + 7, b - 7, x + 8, b, col);
    c.col(x + 7, b - 7, b, L(col));
    c.row(b - 6, x + 9, x + 14, STEEL);
    c.row(b - 1, x + 9, x + 14, STEEL);
  }
  add('school-table-two-seat', 'school table for two formica double desk plastic chairs classroom', true, {
    m: [
      30, 19,
      (c, u) => {
        const b = c.h - 2;
        c.rect(1, b - 12, 28, b - 11, FORM);
        c.row(b - 12, 1, 28, L(FORM));
        c.row(b - 10, 2, 27, WP);
        c.col(2, b - 9, b, STEEL);
        c.col(27, b - 9, b, STEEL);
        c.rect(4, b - 9, 25, b - 8, D(STD)); // book trays under the top
        c.rect(6, b - 9, 10, b - 9, hex('#6b2332'));
        pchairF(c, 3, b);
        if (u) {
          pchairDown(c, 14, b, hex('#8f6a44')); // the other one kicked over
          c.rect(16, b - 13, 22, b - 13, SHEET); // an exercise book left open
          c.set(19, b - 13, STD);
          c.set(24, b - 13, INK);
          c.rect(24, b - 12, 25, b - 12, INK); // and the ink
        } else pchairF(c, 17, b, hex('#8f6a44'));
      },
    ],
    s: [
      18, 19,
      (c, u) => {
        const b = c.h - 2;
        c.rect(1, b - 12, 11, b - 11, FORM);
        c.row(b - 12, 1, 11, L(FORM));
        c.row(b - 10, 2, 10, WP);
        c.col(2, b - 9, b, STEEL);
        c.col(10, b - 9, b, STEEL);
        c.rect(3, b - 9, 9, b - 8, D(STD));
        if (u) {
          c.rect(5, b - 13, 9, b - 13, SHEET);
          c.rect(11, b - 1, 16, b, hex('#8f6a44')); // on its back
          c.rect(15, b - 7, 16, b - 2, hex('#8f6a44'));
          c.row(b - 6, 9, 14, STEEL);
        } else {
          const t = T.canvas(12, c.h);
          pchairS(t, 0, b);
          c.stamp(t, 6, 0, true);
        }
      },
    ],
  });
  {
    // the old desk: iron frame, lift-up lid, the seat fixed to it
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 15, 3, b - 8, W); // seat back
      c.col(2, b - 15, b - 8, L(W));
      c.rect(2, b - 8, 9, b - 7, W);
      c.row(b - 8, 2, 9, L(W));
      c.line(4, b - 6, 3, b, IRON); // iron legs
      c.line(7, b - 6, 9, b, IRON);
      c.row(b, 2, 20, ID); // the runner joining seat and desk
      c.rect(12, b - 11, 20, b - 8, W); // the box
      c.row(b - 8, 12, 20, D(W));
      c.line(15, b - 7, 14, b, IRON);
      c.line(18, b - 7, 19, b, IRON);
      c.row(b - 4, 14, 19, ID);
      if (u) {
        c.rect(12, b - 11, 20, b - 11, IN);
        c.line(20, b - 13, 14, b - 19, WL); // the lid up
        c.line(20, b - 12, 13, b - 19, W);
        c.rect(13, b - 12, 16, b - 12, hex('#6b2332')); // books
        c.rect(15, b - 13, 18, b - 13, C.navy);
      } else {
        c.line(11, b - 11, 20, b - 13, WL);
        c.line(11, b - 12, 19, b - 14, L(WL));
        c.rect(19, b - 14, 20, b - 14, WL);
        c.set(20, b - 15, BLK); // inkwell
      }
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 15, 13, b - 14, W); // the seat back, behind
      c.rect(1, b - 13, 14, b - 7, W);
      c.col(1, b - 13, b - 7, L(W));
      c.row(b - 13, 1, 14, WL);
      c.row(b - 7, 1, 14, D(W));
      dots(c, D(W), [4, b - 10, 5, b - 9, 6, b - 10, 9, b - 11, 10, b - 10, 10, b - 9, 11, b - 11]); // carved by many hands
      for (const x of [2, 13]) {
        c.col(x, b - 6, b, IRON);
        c.set(x + (x < 8 ? 1 : -1), b - 3, IRON);
      }
      c.row(b - 3, 3, 12, ID);
      c.row(b, 1, 14, ID);
      if (u) {
        c.rect(1, b - 20, 14, b - 14, WL); // the lid, standing up
        c.row(b - 20, 1, 14, L(WL));
        c.col(14, b - 20, b - 14, W);
        dots(c, W, [3, b - 18, 4, b - 17, 5, b - 18, 8, b - 16, 11, b - 18, 10, b - 17]);
      } else {
        c.rect(12, b - 14, 12, b - 14, BLK);
        c.rect(4, b - 14, 8, b - 14, WL); // pen groove
      }
    };
    add('school-desk-iron-lid', 'old school desk iron frame lift lid inkwell attached seat carved', true, { base: 'side', m: [23, 22, side], s: [16, 23, front] });
  }
  {
    const col = WL;
    const side = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 1, 13, b, col); // on its back
        c.row(b - 1, 1, 13, L(col));
        c.rect(8, b - 7, 9, b - 2, col);
        c.rect(14, b - 7, 15, b, col);
        c.row(b - 6, 9, 14, D(col));
        c.col(11, b - 5, b - 2, D(col));
        return;
      }
      c.rect(2, b - 14, 3, b, col);
      c.col(2, b - 14, b, L(col));
      c.set(4, b - 13, D(col));
      c.set(4, b - 11, D(col));
      c.rect(2, b - 7, 9, b - 6, col);
      c.row(b - 7, 2, 9, L(col));
      c.rect(8, b - 5, 9, b, col);
      c.row(b - 2, 4, 7, D(col));
    };
    const front = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 1, 9, b, col); // fallen away from us: the underside of the seat
        c.rect(1, b - 8, 9, b - 2, D(col));
        c.frame(1, b - 8, 9, b - 2, col);
        dots(c, L(col), [1, b - 8, 9, b - 8, 1, b - 2, 9, b - 2]);
        return;
      }
      c.col(1, b - 14, b, col);
      c.col(9, b - 14, b, col);
      c.rect(1, b - 14, 9, b - 13, col);
      c.row(b - 14, 1, 9, L(col));
      c.row(b - 10, 2, 8, D(col));
      c.rect(1, b - 7, 9, b - 6, col);
      c.row(b - 7, 1, 9, L(col));
      c.row(b - 2, 2, 8, D(col));
    };
    add('school-chair-wooden-small', 'small wooden school chair pupil child size classroom', false, { base: 'side', m: [12, 17, side], mu: [17, 10], s: [11, 17, front], su: [11, 11] });
  }
  {
    const cols = [PLASTIC, hex('#8f6a44'), PLASTIC, hex('#5a6a6a'), PLASTIC];
    const front = (c, u) => {
      const b = c.h - 2,
        n = u ? 3 : 5;
      c.col(2, b - 6 - 3 * (n - 1), b, STEEL);
      c.col(9, b - 6 - 3 * (n - 1), b, STEEL);
      for (let i = 0; i < n; i++) {
        const y = b - 7 - 3 * i;
        c.rect(2, y - 1, 9, y, cols[i]);
        c.row(y - 1, 2, 9, L(cols[i]));
        c.row(y, 2, 9, D(cols[i]));
      }
      const t = b - 7 - 3 * (n - 1);
      c.rect(2, t - 8, 9, t - 3, cols[n - 1]);
      c.row(t - 8, 3, 8, L(cols[n - 1]));
      c.clear(2, t - 8);
      c.clear(9, t - 8);
      c.rect(5, t - 6, 6, t - 5, D(cols[n - 1]));
      if (u) pchairF(c, 12, b, cols[3]); // one taken down and set beside the rest
    };
    const side = (c, u) => {
      const b = c.h - 2,
        n = u ? 3 : 5;
      for (let i = 0; i < n; i++) {
        const y = b - 3 * i,
          x = Math.min(i, 3);
        c.line(x + 1, y - 15, x + 2, y - 9, cols[i]);
        c.rect(x + 2, y - 8, x + 8, y - 7, cols[i]);
        c.row(y - 8, x + 2, x + 8, L(cols[i]));
        c.line(x + 3, y - 6, x + 1, y, STEEL);
        c.line(x + 7, y - 6, x + 9, y, STEEL);
      }
      if (u) pchairS(c, 13, b, cols[3]);
    };
    add('school-chairs-plastic-stack', 'stack of plastic school chairs orange stacked hall', true, { m: [12, 32, front], mu: [24, 32], s: [14, 32, side], su: [25, 32] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 13, 30, b - 12, W);
      c.row(b - 13, 1, 30, WL);
      for (const [x0, x1] of [[2, 11], [20, 29]]) {
        c.rect(x0, b - 11, x1, b - 1, W);
        c.col(x0, b - 11, b - 1, WL);
        c.row(b - 1, x0, x1, WD);
        c.rect(x0, b, x0 + 1, b, WD);
        c.rect(x1 - 1, b, x1, b, WD);
      }
      c.rect(12, b - 11, 19, b - 5, D(W)); // the panel across the knee hole
      c.row(b - 5, 12, 19, WD);
      for (let i = 0; i < 3; i++) {
        const y = b - 10 + i * 3;
        if (u && i === 0) continue;
        c.frame(3, y, 10, y + 2, WD);
        c.rect(6, y + 1, 7, y + 1, C.brass);
      }
      c.frame(21, b - 10, 28, b - 2, WD);
      c.set(22, b - 6, C.brass);
      if (u) {
        c.rect(2, b - 11, 11, b - 7, WL); // the top drawer pulled right out
        c.row(b - 11, 2, 11, IN);
        c.row(b - 7, 2, 11, WD);
        c.rect(6, b - 9, 7, b - 9, C.brass);
        dots(c, hex('#8a5a4a'), [4, b - 12, 9, b - 12]); // confiscated things
        c.set(6, b - 12, STL);
        c.line(2, b - 14, 26, b - 15, hex('#b39a5a')); // the cane, laid ready
        c.rect(27, b - 15, 28, b - 14, SHEET); // the apple, bitten to the core
        c.set(27, b - 16, WD);
      } else {
        c.rect(26, b - 16, 28, b - 14, hex('#8f3a34')); // an apple
        c.set(27, b - 17, WD);
        c.set(26, b - 16, hex('#b3564c'));
      }
      for (let i = 0; i < 4; i++) c.rect(4, b - 14 - i, 10, b - 14 - i, [hex('#6b2332'), C.navy, hex('#6b2332'), hex('#4a5e36')][i]); // books to mark
      c.rect(15, b - 15, 16, b - 14, BLK); // ink stand
      c.line(17, b - 15, 19, b - 18, SHEET);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 13, 14, b - 12, W);
      c.row(b - 13, 1, 14, WL);
      cabS(c, 2, b - 11, 13, b - 1, W);
      c.rect(2, b, 3, b, WD);
      c.rect(12, b, 13, b, WD);
      c.rect(4, b - 17, 9, b - 14, hex('#6b2332'));
      c.row(b - 16, 4, 9, C.navy);
      if (u) {
        c.rect(14, b - 11, 18, b - 7, WL);
        c.row(b - 11, 14, 18, IN);
        c.set(19, b - 9, C.brass);
        c.rect(11, b - 15, 12, b - 14, SHEET);
        c.set(2, b - 14, hex('#b39a5a'));
      } else {
        c.rect(11, b - 16, 13, b - 14, hex('#8f3a34'));
        dots(c, C.brass, [14, b - 9, 14, b - 6, 14, b - 3]);
      }
    };
    add('school-teachers-desk', 'teachers desk wooden pedestal drawers apple exercise books cane', true, { m: [32, 21, front], s: [17, 21, side], su: [21, 21] });
  }
  {
    const CARD = hex('#4a5e36');
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 18, 3, b, W);
      c.col(2, b - 18, b, WL);
      c.rect(1, b - 19, 4, b - 19, WL);
      c.rect(4, b - 16, 4, b - 11, WD);
      c.rect(2, b - 9, 10, b - 8, W);
      c.rect(3, b - 10, 9, b - 10, hex('#6b2332')); // cushion
      c.rect(9, b - 7, 10, b, W);
      c.row(b - 13, 3, 10, W); // arm
      c.col(10, b - 12, b - 10, W);
      c.row(b - 3, 4, 8, WD);
      if (u) {
        c.rect(1, b - 18, 5, b - 9, CARD); // a cardigan over the back
        c.col(1, b - 18, b - 9, L(CARD));
        c.col(4, b - 16, b - 9, D(CARD));
        c.rect(1, b - 8, 2, b - 5, CARD);
        dots(c, C.brass, [5, b - 15, 5, b - 12]);
      }
    };
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [1, 11]) c.col(x, b - 18, b, W);
      c.rect(1, b - 19, 11, b - 17, W);
      c.row(b - 19, 1, 11, WL);
      for (const x of [4, 6, 8]) c.col(x, b - 16, b - 11, WD);
      c.rect(1, b - 13, 2, b - 13, WL);
      c.rect(10, b - 13, 11, b - 13, WL);
      c.rect(1, b - 9, 11, b - 8, W);
      c.rect(2, b - 10, 10, b - 10, hex('#6b2332'));
      c.row(b - 3, 2, 10, WD);
      if (u) {
        c.rect(1, b - 19, 11, b - 12, CARD);
        c.row(b - 19, 1, 11, L(CARD));
        c.col(6, b - 18, b - 12, D(CARD));
        dots(c, C.brass, [7, b - 17, 7, b - 14]);
        c.rect(1, b - 11, 2, b - 5, CARD); // one sleeve trailing
        c.rect(10, b - 11, 11, b - 8, CARD);
      }
    };
    add('school-teachers-chair', 'teachers chair wooden armchair cushion staff room', true, { base: 'side', m: [12, 22, side], s: [13, 22, front] });
  }

  /* ---------- blackboards ---------- */
  /** Lines of chalk writing in a box. */
  function writing(c, x0, y0, x1, y1, seed = 3) {
    const r = rnd(seed);
    for (let y = y0; y <= y1; y += 2) {
      let x = x0;
      const end = x1 - ((r() * 5) | 0);
      while (x < end) {
        const w = 1 + ((r() * 3) | 0);
        c.row(y, x, Math.min(end, x + w - 1), CHALK);
        x += w + 1;
      }
    }
  }
  function hangman(c, x, y) {
    c.col(x, y, y + 10, CHALK);
    c.row(y, x, x + 5, CHALK);
    c.row(y + 10, x - 1, x + 3, CHALK);
    c.col(x + 5, y, y + 2, CHALK);
    c.rect(x + 4, y + 3, x + 6, y + 4, CHALK);
    c.col(x + 5, y + 5, y + 7, CHALK);
    dots(c, CHALK, [x + 4, y + 6, x + 6, y + 6, x + 4, y + 8, x + 6, y + 8, x + 4, y + 9, x + 6, y + 9]);
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.line(5, 2, 2, b, W); // easel legs
      c.line(18, 2, 21, b, W);
      c.rect(1, 5, 22, 22, BOARD);
      c.frame(1, 5, 22, 22, WL);
      c.row(23, 1, 22, W);
      dots(c, SHEET, [4, 22, 5, 22, 9, 22]);
      c.rect(16, 21, 19, 22, hex('#55555f')); // duster
      if (u) {
        c.dither(4, 8, 19, 19, blend(BOARD, CHALK, 0.35)); // wiped with a sleeve
        hangman(c, 5, 8);
        c.row(19, 12, 13, CHALK); // _ _ _ _
        c.row(19, 15, 16, CHALK);
        c.row(19, 18, 19, CHALK);
        dots(c, CHALK, [12, 17, 13, 16, 13, 18, 16, 16, 15, 17, 16, 18]);
      } else {
        writing(c, 3, 8, 19, 12, 5);
        c.row(14, 3, 20, blend(BOARD, CHALK, 0.4));
        writing(c, 3, 16, 14, 20, 9);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.line(7, 2, 11, b, W);
      c.line(6, 2, 2, b, WD);
      c.line(8, 5, 10, 22, WL); // the board, edge on, leaning back
      c.line(9, 5, 11, 22, u ? blend(BOARD, CHALK, 0.3) : BOARD);
      c.rect(10, 23, 12, 23, W);
      c.set(12, 22, hex('#55555f'));
      c.row(b - 8, 4, 9, WD);
    };
    add('school-blackboard-easel', 'blackboard on easel stand chalk sums duster classroom', true, { m: [24, 38, front], s: [14, 38, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [2, 35]) {
        c.col(x, 2, b - 2, STEEL);
        c.row(b - 1, x - 1, x + 1, STD);
        caster(c, x - 1, b);
      }
      c.row(b - 3, 3, 34, STD);
      c.rect(3, 3, 34, 22, BOARD);
      c.frame(3, 3, 34, 22, hex('#b9ab8a'));
      dots(c, STL, [2, 12, 35, 12]); // the pivots
      c.rect(8, 23, 29, 23, hex('#b9ab8a'));
      dots(c, SHEET, [10, 22, 11, 22, 20, 22]);
      if (u) {
        // the other face: a drawing nobody owned up to
        c.rect(6, 15, 11, 19, CHALK); // a house
        c.rect(7, 16, 10, 19, BOARD);
        c.line(5, 15, 8, 12, CHALK);
        c.line(9, 12, 12, 15, CHALK);
        c.col(8, 17, 19, CHALK);
        c.col(20, 7, 19, CHALK); // the tall one
        c.rect(19, 5, 21, 6, CHALK);
        c.line(20, 9, 16, 15, CHALK);
        c.line(20, 9, 24, 15, CHALK);
        c.line(20, 17, 18, 20, CHALK);
        c.line(20, 17, 22, 20, CHALK);
        for (const x of [27, 30]) {
          c.col(x, 16, 18, CHALK); // the little ones
          c.set(x, 15, CHALK);
          dots(c, CHALK, [x - 1, 17, x + 1, 17, x - 1, 19, x + 1, 19]);
        }
        dots(c, hex('#a8554c'), [19, 5, 21, 5]);
        c.row(20, 5, 32, blend(BOARD, CHALK, 0.4));
      } else {
        c.row(6, 12, 25, CHALK);
        c.row(7, 12, 25, blend(BOARD, CHALK, 0.4));
        writing(c, 6, 9, 31, 19, 4);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(5, 2, b - 2, STEEL);
      c.row(b - 1, 2, 8, STD);
      caster(c, 1, b);
      caster(c, 8, b);
      if (u) {
        c.line(2, 4, 8, 21, hex('#b9ab8a')); // caught half way round
        c.line(3, 4, 9, 21, BOARD);
      } else {
        c.rect(4, 3, 6, 22, hex('#b9ab8a'));
        c.col(6, 4, 21, BOARD);
        c.set(7, 22, hex('#b9ab8a'));
      }
      c.set(5, 12, STL);
    };
    add('school-blackboard-rolling', 'revolving blackboard on wheeled frame large chalk writing lesson', true, { m: [38, 36, front], s: [11, 36, side] });
  }

  /* ---------- the corridor ---------- */
  /** One locker, 10 wide from x. */
  function locker(c, x, y0, b, col, o = {}) {
    c.rect(x, y0, x + 9, b - 1, col);
    c.col(x, y0, b - 1, L(col));
    c.row(y0, x, x + 9, L(col));
    c.col(x + 9, y0, b - 1, D(col));
    c.rect(x, b, x + 1, b, D(col));
    c.rect(x + 8, b, x + 9, b, D(col));
    if (o.open) {
      c.rect(x + 1, y0 + 2, x + 8, b - 2, IN);
      c.row(y0 + 7, x + 1, x + 8, D(col)); // the shelf
      return;
    }
    c.frame(x + 1, y0 + 2, x + 8, b - 2, D(col));
    for (let i = 0; i < 3; i++) c.row(y0 + 4 + i * 2, x + 3, x + 6, D(D(col))); // vents
    c.rect(x + 3, y0 + 11, x + 5, y0 + 12, o.plate || SHEET);
    c.rect(x + 7, y0 + 16, x + 7, y0 + 18, STL);
  }
  {
    const front = (c, u) => {
      const b = c.h - 2,
        ox = c.w - 32;
      locker(c, ox + 1, 2, b, LOCK);
      locker(c, ox + 11, 2, b, hex('#6a7a72'), { open: u });
      locker(c, ox + 21, 2, b, LOCK);
      dots(c, D(LOCK), [ox + 24, 24, ox + 25, 25, ox + 26, 24, ox + 27, 26]); // scratched
      c.rect(ox + 27, 18, ox + 28, 20, C.brass); // a padlock on the last
      if (u) {
        const x = ox + 11;
        c.rect(x + 2, 5, x + 4, 8, hex('#6b2332')); // books on the shelf
        c.rect(x + 5, 6, x + 6, 8, C.navy);
        c.rect(x + 3, 11, x + 7, 24, hex('#565663')); // a blazer on its hook
        c.col(x + 3, 12, 24, L(hex('#565663')));
        c.set(x + 5, 10, STL);
        c.col(x + 5, 13, 22, hex('#3a3a44'));
        c.rect(x + 2, b - 5, x + 6, b - 2, hex('#7a5a34')); // gym shoes bag
        c.set(x + 4, b - 6, hex('#7a5a34'));
        const [xa, xb] = doorOpenF(c, x, 4, b - 3, 4, hex('#6a7a72'));
        c.rect(xa + 1, 9, xb - 1, 13, PAPER); // a picture stuck inside the door
        c.set(xa + 1, 11, hex('#8c3a34'));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 7, b - 1, LOCK);
      c.rect(1, b, 2, b, D(LOCK));
      c.rect(6, b, 7, b, D(LOCK));
      if (u) {
        doorOpenS(c, 8, 4, 16, b - 2, hex('#6a7a72'));
        c.rect(10, 9, 13, 13, PAPER);
        c.set(11, 11, hex('#8c3a34'));
      } else c.rect(8, 18, 8, 20, STL);
    };
    add('school-lockers-row', 'school lockers row of three steel blue grey corridor', true, { m: [32, 38, front], mu: [32, 38], s: [10, 38, side], su: [18, 38] });
  }
  {
    const col = hex('#7a6a5a');
    const front = (c, u) => {
      const b = c.h - 2,
        ox = c.w - 12;
      locker(c, ox + 1, 2, b, col, { open: u, plate: hex('#8c3a34') });
      if (u) {
        dots(c, hex('#5a5560'), [ox + 3, 12, ox + 4, 14, ox + 3, 16, ox + 5, 13, ox + 6, 15, ox + 7, 12, ox + 7, 17, ox + 5, 18]); // scratched from the inside
        dots(c, hex('#5a5560'), [ox + 3, 22, ox + 4, 24, ox + 6, 23, ox + 7, 25]);
        c.rect(ox + 3, b - 3, ox + 5, b - 2, SHEET); // one small shoe
        c.set(ox + 5, b - 4, SHEET);
        doorOpenF(c, ox + 1, 4, b - 3, 4, col);
      } else {
        c.line(ox + 3, 22, ox + 6, 26, D(D(col))); // kicked in
        c.line(ox + 4, 22, ox + 7, 26, L(col));
        c.line(ox + 6, 28, ox + 4, 31, D(D(col)));
        c.rect(ox + 7, 17, ox + 9, 19, C.brass);
        c.set(ox + 8, 16, STL);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 7, b - 1, col);
      c.rect(1, b, 2, b, D(col));
      c.rect(6, b, 7, b, D(col));
      c.line(3, 20, 5, 24, D(D(col)));
      if (u) doorOpenS(c, 8, 4, 16, b - 2, col);
      else c.rect(8, 17, 8, 19, C.brass);
    };
    add('school-locker-dented', 'single school locker dented kicked padlocked brown old', true, { m: [12, 38, front], mu: [16, 38], s: [10, 38, side], su: [18, 38] });
  }
  {
    const coat = (c, x, y, h, col, w = 5) => {
      c.rect(x, y, x + w - 1, y + h, col);
      c.col(x, y + 1, y + h, L(col));
      c.col(x + (w >> 1), y + 2, y + h, D(col));
      c.clear(x, y);
      c.clear(x + w - 1, y);
      c.clear(x + 1, y + h);
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 3, 32, 5, W);
      c.row(3, 1, 32, WL);
      for (let x = 4; x < 32; x += 5) c.set(x, 6, STL);
      c.rect(1, b - 8, 32, b - 7, W); // the bench
      c.row(b - 8, 1, 32, WL);
      for (const x of [3, 16, 29]) c.rect(x, b - 6, x + 1, b, WD);
      c.row(b - 3, 4, 29, WD);
      if (u) {
        coat(c, 12, 7, 9, hex('#b59a3c'), 5); // one small raincoat nobody came for
        c.rect(13, 6, 15, 6, hex('#b59a3c'));
        c.rect(22, b - 1, 24, b, BLK); // one shoe
        c.set(24, b - 2, BLK);
      } else {
        coat(c, 2, 7, 13, COATS[0]);
        coat(c, 7, 7, 10, COATS[1]);
        coat(c, 12, 7, 9, hex('#b59a3c'), 5);
        coat(c, 17, 7, 12, COATS[4]);
        coat(c, 27, 7, 11, COATS[3]);
        c.col(24, 7, 10, LEATH); // a satchel by its strap
        c.rect(22, 11, 25, 15, LEATH);
        c.row(11, 22, 25, L(LEATH));
        for (const x of [5, 10, 19, 24]) {
          c.rect(x, b - 1, x + 1, b, BLK); // shoes under the bench
          c.rect(x + 3, b - 1, x + 4, b, BLK);
        }
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 3, 2, 5, W);
      c.set(3, 6, STL);
      c.rect(1, b - 8, 8, b - 7, W);
      c.row(b - 8, 1, 8, WL);
      c.rect(2, b - 6, 3, b, WD);
      c.rect(6, b - 6, 7, b, WD);
      if (u) {
        c.rect(2, 7, 4, 16, hex('#b59a3c'));
        c.col(4, 8, 16, D(hex('#b59a3c')));
        c.rect(8, b - 1, 10, b, BLK);
      } else {
        c.rect(2, 7, 5, 20, COATS[3]);
        c.col(5, 8, 20, D(COATS[3]));
        c.col(2, 8, 20, L(COATS[3]));
        c.rect(5, b - 1, 7, b, BLK);
      }
    };
    add('school-coat-hooks-bench', 'cloakroom coat hooks row bench coats shoes satchel pegs', true, { m: [34, 32, front], s: [12, 32, side] });
  }
  {
    const shelfF = (w, h, n, seed) => (c, u) => {
      const b = c.h - 2,
        x1 = w - 2,
        col = OAK;
      c.rect(1, 2, x1, b, col);
      c.col(1, 2, b, L(col));
      c.row(2, 1, x1, L(col));
      const sh = Math.floor((b - 3) / n);
      for (let i = 0; i < n; i++) {
        const y0 = 3 + i * sh,
          yb = y0 + sh - 2;
        c.rect(2, y0, x1 - 1, yb, mix(col, 0.4));
        const gone = u && (i === 1 || (n > 3 && i === 3));
        if (gone) {
          books(c, 2, 2 + ((x1 - 3) >> 2), yb, sh - 2, seed + i);
          c.rect(x1 - 8, yb, x1 - 3, yb, C.wine); // fallen flat
          c.rect(x1 - 7, yb - 1, x1 - 2, yb - 1, C.navy);
          c.line(5 + ((x1 - 3) >> 2), yb - sh + 3, 3 + ((x1 - 3) >> 2), yb, C.mustard); // one leaning
        } else books(c, 2, x1 - 1, yb, sh - 2, seed + i, 0.93);
      }
      if (u) {
        c.rect(5, b, 11, b, SHEET); // one open on the floor
        c.rect(5, b - 1, 7, b - 1, SHEET);
        c.rect(9, b - 1, 11, b - 1, SHEET);
        c.set(8, b, C.wine);
        c.rect(x1 - 6, b, x1 - 2, b, C.forest);
      }
    };
    const shelfS = (n) => (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 7, b, OAK);
      if (u) {
        c.rect(8, b, 12, b, SHEET);
        c.rect(8, b - 1, 9, b - 1, SHEET);
        c.set(10, b, C.wine);
      }
    };
    add('school-bookshelf-low', 'low bookcase reading books classroom library corner oak', true, { m: [26, 19, shelfF(26, 19, 2, 21)], s: [9, 19, shelfS(2)], su: [14, 19] });
    add('school-library-shelves-tall', 'tall library bookshelves school library oak rows of books', true, { m: [22, 38, shelfF(22, 38, 5, 40)], s: [9, 38, shelfS(5)], su: [14, 38] });
  }
  {
    const globe = (turn) => (c, u) => {
      const b = c.h - 2,
        sea = hex('#3f6070'),
        land = hex('#7a8a4a');
      c.line(7, b - 9, 3, b, WD); // tripod
      c.line(7, b - 9, 11, b, WD);
      c.col(7, b - 9, b - 2, W);
      c.oval(2, b - 22, 12, b - 11, sea);
      c.oval(3, b - 22, 9, b - 16, L(sea));
      c.oval(4, b - 21, 11, b - 12, sea);
      const k = turn !== u; // the other face of the world
      if (k) {
        c.rect(4, b - 20, 7, b - 18, land);
        c.rect(5, b - 17, 6, b - 14, land);
        c.rect(9, b - 19, 10, b - 16, land);
        c.set(8, b - 21, land);
      } else {
        c.rect(6, b - 21, 10, b - 19, land);
        c.rect(8, b - 18, 10, b - 16, land);
        c.rect(3, b - 17, 4, b - 15, land);
        c.rect(6, b - 14, 8, b - 13, land);
      }
      c.line(1, b - 19, 6, b - 23, C.brass); // meridian
      c.line(1, b - 19, 2, b - 12, C.brass);
      c.line(2, b - 12, 7, b - 10, C.brass);
      c.set(7, b - 23, C.brass);
      if (u) {
        c.line(8, b - 20, 9, b - 17, IN); // split open along a sea
        c.line(9, b - 17, 8, b - 14, IN);
        c.set(10, b - 17, IN);
      }
    };
    add('school-globe-floor', 'floor globe on wooden tripod world map geography room', true, { m: [15, 26, globe(false)], s: [15, 26, globe(true)] });
  }
  {
    const body = hex('#9a9f9c');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 12, 14, b - 11, STEEL); // trolley
      c.row(b - 12, 1, 14, STL);
      wleg(c, 1, b - 10, b);
      wleg(c, 13, b - 10, b);
      c.row(b - 4, 2, 13, STD);
      c.rect(4, b - 6, 9, b - 5, hex('#b39a6a')); // box of slides
      c.rect(2, b - 18, 13, b - 13, body);
      c.col(2, b - 18, b - 13, L(body));
      c.rect(3, b - 19, 12, b - 19, u ? C.glow : hex('#aab8b4')); // the glass
      for (let x = 4; x < 12; x += 2) c.set(x, b - 15, D(body));
      c.set(12, b - 16, u ? C.red : BLK);
      c.col(13, b - 28, b - 19, STD); // the arm
      c.rect(8, b - 29, 13, b - 27, hex('#55555f')); // head
      c.rect(8, b - 26, 10, b - 26, u ? C.glow : hex('#7f9aa0'));
      if (u) for (let y = b - 25; y < b - 19; y++) for (let x = 4; x < 12; x++) if ((x + y) % 2 === 0 && Math.abs(x - 8) <= (y - b + 27)) c.set(x, y, hex('#b8b47a'));
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 12, 12, b - 11, STEEL);
      c.row(b - 12, 1, 12, STL);
      wleg(c, 1, b - 10, b);
      wleg(c, 11, b - 10, b);
      c.row(b - 4, 2, 11, STD);
      c.rect(2, b - 18, 11, b - 13, body);
      c.col(2, b - 18, b - 13, L(body));
      c.rect(3, b - 19, 10, b - 19, u ? C.glow : hex('#aab8b4'));
      c.col(2, b - 28, b - 19, STD);
      c.rect(2, b - 29, 8, b - 27, hex('#55555f'));
      c.col(9, b - 29, b - 27, u ? C.glow : hex('#7f9aa0'));
      if (u) {
        for (let x = 10; x < 17; x++) for (let y = b - 31; y < b - 24; y++) if ((x + y) % 2 === 0 && Math.abs(y - b + 28) <= (x - 9) / 2) c.set(x, y, hex('#b8b47a'));
        for (let y = b - 25; y < b - 19; y++) if (y % 2) c.set(6, y, hex('#b8b47a'));
      }
    };
    add('school-overhead-projector', 'overhead projector on trolley transparency lamp classroom', true, { m: [16, 31, front], s: [18, 34, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [3, 15]) c.col(x, 15, b - 2, STEEL);
      c.row(b - 2, 2, 16, STD);
      caster(c, 2, b);
      caster(c, 15, b);
      c.rect(2, 14, 16, 15, STEEL);
      c.rect(2, 22, 16, 22, STD); // shelf for the video
      c.rect(4, 18, 14, 21, hex('#34343c'));
      c.row(19, 5, 10, BLK);
      c.set(12, 19, u ? TRG : hex('#3a4a3c'));
      c.rect(1, 2, 17, 13, W); // the set
      c.row(2, 1, 17, WL);
      c.col(1, 2, 13, WL);
      screen(c, 2, 3, 12, 12, u ? 'static' : 'off');
      c.rect(14, 4, 15, 5, BLK);
      c.rect(14, 7, 15, 8, BLK);
      for (let y = 10; y < 13; y++) c.row(y, 14, 16, y % 2 ? WD : W);
      if (u) c.set(14, 4, C.red);
    };
    const TRG = T.TR;
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(3, 15, b - 2, STEEL);
      c.col(10, 15, b - 2, STEEL);
      c.row(b - 2, 2, 11, STD);
      caster(c, 2, b);
      caster(c, 10, b);
      c.rect(2, 14, 12, 15, STEEL);
      c.rect(2, 22, 12, 22, STD);
      c.rect(4, 18, 11, 21, hex('#34343c'));
      cabS(c, 3, 2, 12, 13, W, { frame: false });
      c.poly([[1, 5], [3, 3], [3, 12], [1, 11]], WD); // the tube's back
      for (let y = 4; y < 9; y += 2) c.row(y, 5, 9, WD);
      c.col(13, 3, 12, u ? hex('#c8ccc2') : T.SCR);
      if (u) dots(c, hex('#8a8f8c'), [14, 5, 14, 8, 14, 10]);
    };
    add('school-tv-trolley', 'television on tall trolley video recorder schools programme', true, { m: [19, 34, front], s: [16, 34, side] });
  }

  /* ---------- the hall and the gym ---------- */
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 3, 26, b - 2, OAK);
      c.col(1, 3, b - 2, L(OAK));
      c.rect(1, 2, 26, 2, L(OAK));
      c.rect(3, 5, 24, 10, D(OAK)); // the top panel
      c.rect(9, 6, 18, 10, u ? SHEET : hex('#28304e')); // hymn book on the desk
      if (u) {
        c.col(13, 6, 10, STD);
        for (let y = 7; y < 10; y += 2) {
          c.row(y, 10, 12, STD);
          c.row(y, 15, 17, STD);
        }
      } else c.row(8, 11, 16, C.gold);
      c.rect(1, 11, 26, 13, OAK); // key bed
      c.row(11, 1, 26, L(OAK));
      if (u) {
        c.rect(3, 12, 24, 13, SHEET);
        for (let x = 4; x < 24; x += 2) c.set(x, 12, BLK);
        c.row(13, 3, 24, FOLD);
        c.set(15, 13, hex('#8c3a34')); // one key stained
        c.rect(3, 11, 24, 11, D(OAK));
      } else c.rect(3, 12, 24, 12, D(OAK));
      c.rect(2, 14, 3, b - 2, D(OAK)); // legs
      c.rect(24, 14, 25, b - 2, D(OAK));
      panel(c, 5, 15, 22, b - 4, OAK);
      dots(c, C.brass, [12, b - 2, 15, b - 2]);
      c.rect(1, b - 1, 26, b, D(OAK));
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 8, b, OAK);
      c.rect(9, 11, 12, 13, OAK);
      c.row(11, 9, 12, u ? SHEET : L(OAK));
      if (u) c.row(10, 9, 9, D(OAK));
      c.rect(10, 14, 11, b, D(OAK));
      c.col(9, 5, 10, D(OAK));
      c.rect(9, 6, 9, 10, u ? SHEET : hex('#28304e'));
      c.set(12, b, C.brass);
    };
    add('school-piano-hall', 'school hall piano upright pale oak hymn book assembly', true, { m: [28, 25, front], s: [14, 25, side] });
  }
  {
    // the vaulting box: sections of pale wood, a leather top
    const side = (c, u) => {
      const b = c.h - 2,
        n = u ? 3 : 4;
      for (let i = 0; i < 4; i++) {
        if (i >= n) break;
        const y1 = b - i * 5,
          y0 = y1 - 4,
          x0 = 1 + i,
          x1 = 28 - i;
        c.rect(x0, y0, x1, y1, GYMW);
        c.row(y0, x0, x1, L(GYMW));
        c.row(y1, x0, x1, D(GYMW));
        c.rect(x0 + 5, y0 + 2, x0 + 7, y0 + 2, WD); // hand holds
        c.rect(x1 - 7, y0 + 2, x1 - 5, y0 + 2, WD);
      }
      const top = (ox, yb, w0) => {
        c.rect(ox, yb - 2, ox + w0, yb, LEATH);
        c.row(yb - 2, ox + 1, ox + w0 - 1, L(LEATH));
        c.row(yb, ox, ox + w0, D(LEATH));
      };
      if (u) {
        c.rect(4, b - 15, 25, b - 15, IN); // hollow
        c.rect(31, b - 4, 52, b, GYMW); // the top section lifted off and set down
        c.row(b - 4, 31, 52, L(GYMW));
        c.rect(36, b - 2, 38, b - 2, WD);
        c.rect(45, b - 2, 47, b - 2, WD);
        top(31, b - 5, 21);
        dots(c, hex('#8f1d1d'), [40, b - 7, 41, b - 7]);
      } else top(4, b - 20, 21);
    };
    const front = (c, u) => {
      const b = c.h - 2,
        n = u ? 3 : 4;
      for (let i = 0; i < n; i++) {
        const y1 = b - i * 5,
          y0 = y1 - 4;
        c.rect(1 + i, y0, 14 - i, y1, GYMW);
        c.row(y0, 1 + i, 14 - i, L(GYMW));
        c.row(y1, 1 + i, 14 - i, D(GYMW));
        c.rect(6, y0 + 2, 9, y0 + 2, WD);
      }
      if (u) c.rect(5, b - 15, 10, b - 15, IN);
      else {
        c.rect(4, b - 22, 11, b - 20, LEATH);
        c.row(b - 22, 5, 10, L(LEATH));
      }
    };
    add('school-gym-vaulting-box', 'vaulting box gym horse wooden sections leather top pe', true, { base: 'side', m: [30, 25, side], mu: [55, 25], s: [16, 25, front] });
  }
  {
    const MATS = [hex('#4a6a7a'), hex('#55705a'), hex('#4a6a7a'), hex('#7a5a4a')];
    const pile = (w) => (c, u) => {
      const b = c.h - 2,
        n = u ? 3 : 4;
      for (let i = 0; i < n; i++) {
        const y = b - i * 2;
        c.rect(1 + (i % 2), y - 1, w - 2 - (i % 2), y, MATS[i]);
        c.row(y - 1, 1 + (i % 2), w - 2 - (i % 2), L(MATS[i]));
        c.set(3 + i, y, BLK);
      }
      if (u) {
        c.line(w - 6, b - 5, w + 2, b - 1, MATS[3]); // the top one dragged half off
        c.line(w - 6, b - 4, w + 1, b, D(MATS[3]));
        c.rect(w + 1, b, w + 8, b, MATS[3]);
        c.rect(w + 2, b - 1, w + 8, b - 1, L(MATS[3]));
        c.rect(w - 12, b - 6, w - 6, b - 5, MATS[3]);
      }
    };
    add('school-gym-mats-pile', 'pile of gym mats stacked blue green pe hall crash mats', true, { m: [30, 11, pile(30)], mu: [40, 11], s: [20, 11, pile(20)], su: [30, 11] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 24, b, hex('#2e2a2c'));
      for (const x of [1, 12, 24]) {
        c.col(x, 1, b, W);
        if (x > 1) c.col(x - 1, 1, b, WL);
      }
      c.col(2, 1, b, WD);
      for (let y = 3; y < b - 1; y += 3) {
        c.row(y, 2, 23, GYMW);
        c.set(2, y, L(GYMW));
        c.set(13, y, L(GYMW));
      }
      for (const x of [1, 12, 24]) c.col(x, 1, b, W);
      if (u) {
        c.row(15, 13, 23, hex('#2e2a2c')); // a rung snapped
        c.line(13, 15, 16, 17, GYMW);
        c.set(23, 15, GYMW);
        c.col(7, 2, 5, hex('#b39a5a')); // the rope cut short, the rest on the floor
        dots(c, hex('#8a7a4a'), [7, 6, 6, 7]);
        c.rect(4, b - 1, 12, b, hex('#b39a5a'));
        c.row(b - 2, 6, 10, hex('#b39a5a'));
        dots(c, hex('#8a7a4a'), [5, b, 8, b - 1, 11, b, 7, b - 2]);
      } else {
        c.col(7, 2, b - 6, hex('#b39a5a')); // climbing rope
        for (let y = 4; y < b - 6; y += 3) c.set(7, y, hex('#8a7a4a'));
        c.rect(6, b - 5, 8, b - 4, hex('#8a7a4a')); // its knot
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 1, 3, b, W);
      c.col(1, 1, b, WL);
      for (let y = 3; y < b - 1; y += 3) c.set(4, y, GYMW);
      if (u) c.rect(5, b - 1, 8, b, hex('#b39a5a'));
      else {
        c.col(6, 2, b - 6, hex('#b39a5a'));
        c.set(6, b - 5, hex('#8a7a4a'));
      }
    };
    add('school-gym-wall-bars', 'gym wall bars climbing rope wooden rungs pe hall', true, { m: [26, 40, front], s: [10, 40, side] });
  }
  {
    const side = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 1, 34, b, GYMW); // upside down
        c.row(b, 1, 34, D(GYMW));
        for (const x of [4, 29]) {
          c.rect(x, b - 5, x + 1, b - 2, W);
          c.rect(x - 1, b - 6, x + 2, b - 6, WD);
        }
        c.rect(5, b - 4, 30, b - 3, WL); // the balance rail on top
        c.row(b - 4, 5, 30, L(WL));
        c.set(1, b - 2, STL);
        return;
      }
      c.rect(1, b - 5, 34, b - 4, GYMW);
      c.row(b - 5, 1, 34, L(GYMW));
      for (const x of [4, 29]) {
        c.rect(x, b - 3, x + 1, b - 1, W);
        c.rect(x - 1, b, x + 2, b, WD);
      }
      c.rect(6, b - 2, 28, b - 2, WL);
      c.set(1, b - 3, STL); // hook
    };
    const front = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 1, 7, b, GYMW);
        c.rect(3, b - 5, 5, b - 2, W);
        c.rect(1, b - 6, 7, b - 6, WD);
        c.rect(3, b - 4, 5, b - 3, WL);
        return;
      }
      c.rect(1, b - 5, 7, b - 4, GYMW);
      c.row(b - 5, 1, 7, L(GYMW));
      c.rect(3, b - 3, 5, b - 1, W);
      c.rect(1, b, 7, b, WD);
      c.rect(3, b - 2, 5, b - 2, WL);
    };
    add('school-gym-bench', 'long gym bench low wooden pe hall balance beam', true, { base: 'side', m: [36, 8, side], mu: [36, 9], s: [9, 8, front], su: [9, 9] });
  }
  {
    const BALLS = [hex('#8a5a34'), hex('#b06a34'), hex('#c9c6b4'), hex('#8a5a34'), hex('#5a6a4a')];
    const cage = (w) => (c, u) => {
      const b = c.h - 2,
        x1 = w - 2;
      c.rect(1, b - 16, x1, b - 3, hex('#2e2e33'));
      if (u) {
        c.rect(4, b - 4, 8, b - 3, hex('#8a5a34')); // one left, gone flat
        c.row(b - 4, 5, 7, hex('#6a4a2c'));
      } else {
        const r = rnd(w);
        for (let row = 0; row < 3; row++)
          for (let x = 2 + (row % 2) * 2; x < x1 - 3; x += 5) {
            const col = BALLS[(r() * BALLS.length) | 0],
              y = b - 4 - row * 4;
            c.oval(x, y - 3, x + 3, y, col);
            c.set(x + 1, y - 3, L(col));
            c.set(x + 2, y - 1, D(col));
          }
      }
      for (let x = 1; x <= x1; x += 3) c.col(x, b - 16, b - 3, STEEL); // the wire
      c.col(x1, b - 16, b - 3, STEEL);
      c.row(b - 16, 1, x1, STL);
      c.row(b - 10, 1, x1, STD);
      c.row(b - 3, 1, x1, STD);
      wleg(c, 1, b - 2, b);
      wleg(c, x1 - 1, b - 2, b);
      if (u) {
        c.oval(x1 + 2, b - 3, x1 + 5, b, BALLS[1]); // and one rolled away
        c.set(x1 + 3, b - 3, L(BALLS[1]));
        c.row(b - 1, x1 + 2, x1 + 5, D(BALLS[1]));
      }
    };
    add('school-ball-cage', 'ball cage wire trolley footballs basketballs pe store', true, { m: [18, 20, cage(18)], mu: [24, 20], s: [15, 20, cage(15)], su: [21, 20] });
  }
  {
    const col = hex('#4f3528');
    const cup = (c, x, yb, h, g = C.gold) => {
      c.rect(x, yb - h + 1, x + 2, yb - 2, g);
      c.set(x + 1, yb - 1, g);
      c.rect(x, yb, x + 2, yb, D(g));
      c.col(x, yb - h + 1, yb - 2, L(g));
      dots(c, g, [x - 1, yb - h + 2, x + 3, yb - h + 2]);
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 24, b, col);
      c.col(1, 2, b, L(col));
      c.rect(1, 1, 24, 1, L(col));
      c.rect(3, 4, 22, 24, hex('#3a4248'));
      for (const y of [10, 17]) c.row(y, 3, 22, C.glassLight);
      if (!u) cup(c, 11, 9, 5);
      cup(c, 5, 9, 4, STL);
      cup(c, 18, 9, 4);
      c.rect(4, 12, 8, 16, W); // shields
      c.rect(5, 13, 7, 14, STL);
      c.rect(17, 12, 21, 16, W);
      c.rect(18, 13, 20, 14, C.gold);
      cup(c, 12, 16, 4);
      c.rect(5, 19, 13, 24, SHEET); // the team photograph
      c.rect(6, 20, 12, 23, hex('#7a7468'));
      for (let x = 7; x < 12; x += 2) c.set(x, 21, hex('#c9c0a8'));
      cup(c, 17, 24, 5, STL);
      c.col(12, 4, 24, col);
      if (u) {
        c.poly([[14, 5], [21, 4], [22, 9], [19, 12], [14, 9]], IN); // the glass put through
        dots(c, C.glassLight, [13, 4, 15, 10, 20, 12, 22, 10, 18, 3 + 1, 16, 12, 21, 14]);
        c.line(14, 9, 13, 14, C.glassLight);
        c.line(19, 12, 20, 16, C.glassLight);
        dots(c, C.glassLight, [8, b + 0, 10, b, 13, b, 15, b, 17, b, 11, b - 1 + 1]);
        dots(c, hex('#8f1d1d'), [16, 9, 17, 10]);
      } else dots(c, C.glassLight, [4, 5, 5, 6, 14, 5, 15, 6, 16, 7]);
      c.frame(3, 26, 12, b - 2, D(col));
      c.frame(13, 26, 22, b - 2, D(col));
      dots(c, C.brass, [11, 30, 14, 30]);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 8, b, col, { frame: false });
      c.rect(3, 4, 6, 24, hex('#3a4248'));
      c.col(3, 4, 24, C.glassLight);
      for (const y of [10, 17]) c.row(y, 3, 6, C.glassLight);
      c.rect(4, 7, 5, 9, C.gold);
      c.frame(3, 26, 6, b - 2, D(col));
      if (u) dots(c, C.glassLight, [9, 6, 9, 11, 10, b, 12, b, 9, b]);
    };
    add('school-trophy-cabinet', 'trophy cabinet glass case cups shields team photograph school hall', true, { m: [26, 38, front], s: [10, 38, side], su: [14, 38] });
  }
  {
    const STOOLS = [PLASTIC, hex('#5a6a6a'), PLASTIC, hex('#5a6a6a')];
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 11, 38, b - 10, FORM);
      c.row(b - 11, 1, 38, L(FORM));
      c.row(b - 9, 2, 37, STD);
      for (const x of [3, 20, 36]) c.col(x, b - 8, b, STEEL);
      c.row(b - 2, 3, 36, STD);
      for (let i = 0; i < 4; i++) {
        const x = 5 + i * 9;
        c.rect(x, b - 7, x + 5, b - 6, STOOLS[i]);
        c.row(b - 7, x, x + 5, L(STOOLS[i]));
        c.col(x + 2, b - 5, b - 3, STEEL);
      }
      if (u) {
        for (const x of [5, 23]) {
          c.rect(x, b - 12, x + 7, b - 12, hex('#8a6a4a')); // trays left where they were
          c.rect(x + 1, b - 13, x + 3, b - 13, SHEET);
          c.set(x + 2, b - 14, hex('#7a6a3c'));
          c.rect(x + 5, b - 14, x + 6, b - 13, hex('#5a7a8a'));
        }
        c.rect(14, b - 12, 17, b - 12, SHEET); // a beaker over, the milk running off the edge
        c.rect(17, b - 12, 21, b - 12, hex('#d8d4c4'));
        c.col(21, b - 11, b - 8, hex('#d8d4c4'));
        c.rect(20, b, 23, b, hex('#d8d4c4'));
      }
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(3, b - 11, 14, b - 10, FORM);
      c.row(b - 11, 3, 14, L(FORM));
      c.col(8, b - 9, b, STEEL);
      c.col(9, b - 9, b, STD);
      c.row(b - 2, 2, 15, STD);
      for (const x of [1, 12]) {
        c.rect(x, b - 7, x + 4, b - 6, x < 5 ? PLASTIC : hex('#5a6a6a'));
        c.col(x + 2, b - 5, b - 3, STEEL);
      }
      if (u) {
        c.rect(4, b - 12, 11, b - 12, hex('#8a6a4a'));
        c.rect(5, b - 13, 7, b - 13, SHEET);
        c.rect(9, b - 14, 10, b - 13, hex('#5a7a8a'));
        c.col(14, b - 11, b - 8, hex('#d8d4c4'));
      }
    };
    add('school-canteen-table', 'canteen dinner table folding with fixed stools dining hall', true, { base: 'side', m: [40, 17, side], s: [18, 17, front] });
  }
};
