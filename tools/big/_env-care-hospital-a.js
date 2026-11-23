/* The hospital, first half: beds, what stands round them, trolleys and machines. See env-care.js. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, T, add) => {
  const { D, L, dots, caster, wleg, screen, bottle, jars, stream, puddle, cabS, doorOpenF, doorOpenS, wheel, splat, folds } = T;
  const { SHEET, FOLD, STEEL, STL, STD, IRON, ID, BLK, HG, LAM, VINYL, TEALV, RUB, SCR, TR, WAT, WATD, BLOOD, IN, BLANK, PORC, PORD, PAPER } = T;
  const ENAMEL = hex('#cfd0c2'),
    TICK = hex('#bdb49a'),
    STAIN = hex('#8a7a55'),
    REDC = hex('#8c3a34'),
    O2 = hex('#26262e');

  /* ---------- beds ---------- */
  /** A ward bed from its long side (38 x 22), the head to the left.
   *  cover: 'made' | 'back' | 'bare' | 'stain'; rails: 'up' | 'down' | none; raised: the backrest is up. */
  function bedSide(c, o = {}) {
    const b = c.h - 2,
      bd = o.board || LAM,
      bl = o.blanket || BLANK,
      my = b - 9;
    c.row(b - 6, 3, 34, STEEL); // the deck
    c.row(b - 5, 3, 34, STD);
    c.line(9, b - 4, 15, b - 2, ID);
    c.line(28, b - 4, 22, b - 2, ID);
    c.row(b - 2, 5, 32, ID);
    wleg(c, 3, b - 4, b);
    wleg(c, 33, b - 4, b);
    c.rect(1, b - 17, 2, b - 5, bd); // head board, edge on
    c.col(1, b - 17, b - 5, L(bd));
    c.rect(35, b - 13, 36, b - 5, bd); // foot board
    c.col(35, b - 13, b - 5, L(bd));
    c.set(36, b - 10, PAPER); // the chart hanging on it
    c.set(36, b - 9, PAPER);
    const tick = o.cover === 'bare' || o.cover === 'stain' ? TICK : SHEET;
    c.rect(3, my, 34, my + 2, tick);
    c.row(my, 3, 34, L(tick));
    c.row(my + 2, 3, 34, D(tick));
    if (tick === TICK) for (let x = 5; x < 34; x += 3) c.set(x, my + 1, hex('#7f8a96'));
    let px = 4,
      py = my - 1;
    if (o.raised) {
      c.poly([[3, my], [3, my - 7], [5, my - 8], [14, my]], tick);
      c.line(5, my - 8, 14, my, D(tick));
      c.col(3, my - 7, my, L(tick));
      px = 4;
      py = my - 5;
    }
    if (o.cover === 'made') {
      c.rect(px, py - 1, px + 5, py, SHEET);
      c.row(py, px, px + 5, FOLD);
      c.rect(12, my - 1, 34, my + 1, bl);
      c.row(my - 1, 12, 34, L(bl));
      c.rect(11, my - 1, 13, my + 1, SHEET);
      c.col(34, my - 1, my + 3, D(bl));
      c.row(my + 2, 14, 34, D(bl));
    } else if (o.cover === 'back') {
      c.rect(px, py - 1, px + 5, py, SHEET);
      c.row(py, px, px + 5, FOLD);
      dots(c, FOLD, [px + 2, py - 1, px + 3, py - 1, 12, my + 1, 14, my, 17, my + 1, 20, my, 15, my + 1]);
      c.poly([[22, my - 1], [24, my - 4], [30, my - 4], [34, my - 1], [34, my + 2], [22, my + 2]], bl);
      c.line(22, my - 1, 24, my - 4, L(bl));
      c.row(my - 4, 24, 30, L(bl));
      c.line(26, my - 2, 25, my + 2, D(bl));
      c.line(31, my - 2, 32, my + 2, D(bl));
      c.rect(23, my + 3, 27, my + 5, D(bl)); // trailing to the floor
      c.set(24, my + 6, D(bl));
    } else if (o.cover === 'bare') {
      c.rect(26, my - 3, 33, my - 1, SHEET); // folded linen at the foot
      c.row(my - 2, 26, 33, FOLD);
      c.row(my - 4, 27, 32, bl);
      c.row(my - 5, 27, 32, L(bl));
    } else if (o.cover === 'stain') {
      c.row(my, 10, 22, STAIN);
      c.row(my + 1, 12, 20, STAIN);
      c.row(my, 14, 18, D(STAIN));
    }
    if (o.rails === 'up') {
      c.row(my - 4, 9, 29, STEEL);
      c.row(my - 4, 9, 29, STL);
      c.row(my - 1, 9, 29, STEEL);
      for (const x of [9, 14, 19, 24, 29]) c.col(x, my - 4, my + 2, STEEL);
    } else if (o.rails === 'down') {
      c.row(my + 4, 9, 29, STEEL);
      c.row(my + 7, 9, 29, STD);
      for (const x of [9, 14, 19, 24, 29]) c.col(x, my + 4, my + 7, STEEL);
    }
  }
  /** The same bed from the foot end and a little from above (20 x 36). */
  function bedFront(c, o = {}) {
    const b = c.h - 2,
      x0 = 1,
      x1 = c.w - 2,
      bd = o.board || LAM,
      bl = o.blanket || BLANK,
      ht = 2,
      sy = 11,
      ey = b - 10,
      tick = o.cover === 'bare' || o.cover === 'stain' ? TICK : SHEET;
    c.rect(x0, ht, x1, sy, bd);
    c.row(ht, x0, x1, L(bd));
    c.col(x0, ht, sy, STEEL);
    c.col(x1, ht, sy, STEEL);
    c.row(ht + 2, x0 + 2, x1 - 2, D(bd));
    c.rect(x0 + 1, sy, x1 - 1, ey, tick);
    c.row(sy, x0 + 1, x1 - 1, D(tick));
    if (tick === TICK) for (let x = x0 + 3; x < x1 - 1; x += 3) c.col(x, sy + 1, ey, hex('#a9a694'));
    c.rect(x0 + 1, ey + 1, x1 - 1, ey + 2, D(tick));
    let py = sy + 1;
    if (o.raised) {
      c.rect(x0 + 1, sy - 5, x1 - 1, sy, tick); // the backrest standing up
      c.row(sy - 5, x0 + 1, x1 - 1, L(tick));
      c.row(sy, x0 + 1, x1 - 1, D(tick));
      py = sy - 4;
    }
    if (o.cover === 'made' || o.cover === 'back') {
      c.rect(x0 + 3, py, x1 - 3, py + 3, SHEET);
      c.row(py + 3, x0 + 3, x1 - 3, FOLD);
      if (o.cover === 'back') dots(c, FOLD, [x0 + 6, py + 1, x0 + 7, py + 1, x0 + 8, py + 2]);
    }
    if (o.cover === 'made') {
      c.rect(x0 + 1, sy + 7, x1 - 1, ey + 2, bl);
      c.row(sy + 7, x0 + 1, x1 - 1, L(bl));
      c.rect(x0 + 1, sy + 5, x1 - 1, sy + 6, SHEET);
      c.row(sy + 6, x0 + 1, x1 - 1, FOLD);
      c.rect(x0 + 1, ey + 1, x1 - 1, ey + 2, D(bl));
    } else if (o.cover === 'back') {
      dots(c, FOLD, [x0 + 3, sy + 7, x0 + 5, sy + 9, x0 + 9, sy + 6, x0 + 12, sy + 8, x0 + 7, sy + 11, x0 + 4, sy + 12]);
      c.poly([[x0 + 1, ey - 5], [x1 - 1, ey - 2], [x1 - 1, ey + 2], [x0 + 1, ey + 2]], bl); // pushed down to the foot
      c.line(x0 + 1, ey - 5, x1 - 1, ey - 2, L(bl));
      c.line(x0 + 5, ey - 3, x0 + 6, ey + 1, D(bl));
      c.line(x0 + 11, ey - 2, x0 + 10, ey + 1, D(bl));
    } else if (o.cover === 'bare') {
      c.rect(x0 + 4, ey - 5, x1 - 4, ey - 1, SHEET);
      c.row(ey - 3, x0 + 4, x1 - 4, FOLD);
      c.row(ey - 1, x0 + 4, x1 - 4, FOLD);
      c.rect(x0 + 5, ey - 7, x1 - 5, ey - 6, bl);
    } else if (o.cover === 'stain') {
      c.oval(x0 + 5, sy + 4, x1 - 5, ey - 3, STAIN);
      c.oval(x0 + 7, sy + 6, x1 - 7, ey - 6, D(STAIN));
      dots(c, STAIN, [x0 + 4, sy + 9, x1 - 4, sy + 7, x0 + 6, ey - 2]);
    }
    if (o.rails === 'up') {
      c.col(x0, sy + 1, ey - 1, STL);
      c.col(x1, sy + 1, ey - 1, STEEL);
      for (let y = sy + 3; y < ey - 1; y += 3) dots(c, STD, [x0, y, x1, y]);
    }
    const fb = b - 9;
    c.rect(x0, fb, x1, b - 4, bd); // the foot board
    c.row(fb, x0, x1, L(bd));
    c.col(x0, fb, b - 4, STEEL);
    c.col(x1, fb, b - 4, STEEL);
    c.row(b - 4, x0 + 1, x1 - 1, D(bd));
    c.rect(x0 + 6, fb + 1, x0 + 11, fb + 4, PAPER); // the chart
    c.row(fb + 2, x0 + 7, x0 + 10, D(PAPER));
    c.row(fb + 4, x0 + 7, x0 + 9, D(PAPER));
    c.row(fb + 1, x0 + 7, x0 + 10, STEEL);
    if (o.rails === 'down') {
      c.col(x0, b - 3, b - 2, STEEL);
    }
    c.row(b - 3, x0 + 2, x1 - 2, ID);
    wleg(c, x0, b - 3, b);
    wleg(c, x1 - 1, b - 3, b);
    c.col(x1, b - 3, b - 2, STEEL);
  }
  const bed = (slug, name, a, u2) =>
    add(slug, name, true, {
      base: 'side',
      m: [38, 22, (c, u) => bedSide(c, u ? u2 : a)],
      s: [20, 36, (c, u) => bedFront(c, u ? u2 : a)],
    });
  bed('hospital-bed-rails', 'hospital bed with side rails white sheets blue blanket ward', { cover: 'made', rails: 'up' }, { cover: 'back', rails: 'down' });
  bed('hospital-bed-raised', 'hospital bed backrest raised propped up pillow green blanket', { cover: 'made', raised: true, blanket: HG }, { cover: 'back', raised: true, blanket: HG, rails: 'up' });
  bed('hospital-bed-stripped', 'hospital bed stripped bare mattress folded linen empty', { cover: 'bare', board: hex('#8f9a94') }, { cover: 'stain', board: hex('#8f9a94') });

  /* a child's cot with high barred sides */
  add('hospital-cot-barred', 'hospital cot child crib high bars white iron childrens ward', true, {
    base: 'side',
    m: [
      28, 26,
      (c, u) => {
        const b = c.h - 2,
          top = u ? b - 10 : b - 21;
        c.rect(1, b - 22, 2, b - 2, ENAMEL); // end frames
        c.rect(25, b - 22, 26, b - 2, ENAMEL);
        c.col(1, b - 22, b - 2, L(ENAMEL));
        caster(c, 1, b);
        caster(c, 25, b);
        c.rect(3, b - 10, 24, b - 8, SHEET); // mattress
        c.row(b - 8, 3, 24, FOLD);
        c.row(b - 7, 3, 24, STD);
        c.rect(4, b - 12, 8, b - 11, SHEET); // little pillow
        c.rect(11, b - 11, 24, b - 9, u ? SHEET : hex('#a8697a'));
        if (u) {
          c.poly([[17, b - 11], [19, b - 13], [24, b - 12], [24, b - 9], [17, b - 9]], hex('#a8697a')); // blanket kicked off
          dots(c, FOLD, [12, b - 10, 14, b - 11, 15, b - 10]);
        } else c.row(b - 11, 11, 24, L(hex('#a8697a')));
        c.row(top, 3, 24, ENAMEL); // the near side: up, or let down
        c.row(top + (u ? 7 : 14), 3, 24, D(ENAMEL));
        for (let x = 4; x < 24; x += 4) c.col(x, top, top + (u ? 7 : 14), ENAMEL);
      },
    ],
    s: [
      18, 26,
      (c, u) => {
        const b = c.h - 2;
        c.col(1, b - 22, b - 2, ENAMEL);
        c.col(16, b - 22, b - 2, ENAMEL);
        c.row(b - 22, 1, 16, L(ENAMEL));
        caster(c, 1, b);
        caster(c, 15, b);
        if (u) {
          c.rect(2, b - 21, 15, b - 12, hex('#2b2a33')); // looking in over the dropped side
          c.rect(2, b - 12, 15, b - 9, SHEET);
          c.rect(4, b - 15, 13, b - 13, SHEET);
          c.row(b - 13, 4, 13, FOLD);
          c.rect(2, b - 11, 9, b - 9, hex('#a8697a'));
          c.row(b - 8, 2, 15, STD);
        } else {
          c.rect(2, b - 21, 15, b - 8, hex('#2b2a33'));
          c.rect(2, b - 12, 15, b - 9, hex('#a8697a'));
        }
        const top = u ? b - 9 : b - 21;
        for (let x = 4; x < 15; x += 4) c.col(x, top, b - 7, ENAMEL);
        c.row(top, 2, 15, ENAMEL);
        c.row(b - 7, 2, 15, D(ENAMEL));
      },
    ],
  });

  /* ---------- by the bed ---------- */
  add('hospital-bedside-cabinet', 'hospital bedside cabinet locker beige water jug glass drawer', true, {
    m: [
      13, 22,
      (c, u) => {
        const b = c.h - 2,
          ox = c.w - 13;
        c.rect(ox + 1, b - 14, ox + 11, b - 1, LAM);
        c.col(ox + 1, b - 14, b - 1, L(LAM));
        c.rect(ox + 1, b - 15, ox + 11, b - 15, L(LAM));
        c.rect(ox + 2, b - 13, ox + 10, b - 10, u ? L(LAM) : LAM); // drawer
        c.row(b - 9, ox + 2, ox + 10, D(LAM));
        c.row(b - 13, ox + 2, ox + 10, D(LAM));
        c.rect(ox + 5, b - 12, ox + 7, b - 12, STEEL);
        if (u) {
          c.rect(ox + 2, b - 8, ox + 10, b - 2, IN);
          c.row(b - 5, ox + 2, ox + 10, D(LAM));
          dots(c, hex('#7a5a34'), [ox + 4, b - 6, ox + 4, b - 7]);
          c.rect(ox + 6, b - 6, ox + 8, b - 6, SHEET);
          c.rect(ox + 3, b - 3, ox + 5, b - 2, hex('#6a4a5a')); // slippers
          c.rect(ox + 7, b - 3, ox + 9, b - 2, hex('#6a4a5a'));
          doorOpenF(c, ox + 1, b - 8, b - 3, 4, LAM);
        } else {
          c.rect(ox + 2, b - 8, ox + 10, b - 2, LAM);
          c.frame(ox + 2, b - 8, ox + 10, b - 2, D(LAM));
          c.set(ox + 9, b - 5, STEEL);
        }
        caster(c, ox + 1, b);
        caster(c, ox + 10, b);
        c.rect(ox + 2, b - 19, ox + 5, b - 16, C.glassLight); // the jug
        c.rect(ox + 2, b - 17, ox + 5, b - 16, u ? C.glassLight : WAT);
        c.set(ox + 1, b - 19, C.glassLight);
        c.col(ox + 6, b - 18, b - 17, C.glass);
        c.rect(ox + 8, b - 17, ox + 9, b - 16, u ? WAT : C.glassLight); // the glass
      },
    ],
    mu: [17, 22],
    s: [
      12, 22,
      (c, u) => {
        const b = c.h - 2;
        cabS(c, 1, b - 14, 9, b - 1, LAM);
        c.row(b - 15, 1, 10, L(LAM));
        caster(c, 1, b);
        caster(c, 8, b);
        c.rect(3, b - 19, 5, b - 16, C.glassLight);
        c.rect(3, b - 17, 5, b - 16, u ? C.glassLight : WAT);
        c.rect(7, b - 17, 8, b - 16, u ? WAT : C.glassLight);
        if (u) {
          doorOpenS(c, 10, b - 8, 16, b - 2, LAM);
          c.rect(10, b - 13, 11, b - 10, L(LAM)); // the drawer a little out
        } else c.set(10, b - 12, STEEL);
      },
    ],
    su: [18, 22],
  });
  add('hospital-overbed-table', 'hospital overbed table on wheels meal tray plate cover cup', true, {
    m: [
      22, 23,
      (c, u) => {
        const b = c.h - 2;
        c.rect(1, b - 15, 20, b - 14, LAM);
        c.row(b - 15, 1, 20, L(LAM));
        c.rect(3, b - 13, 4, b - 3, STEEL);
        c.col(3, b - 13, b - 3, STL);
        c.row(b - 2, 2, 18, STD);
        caster(c, 2, b);
        caster(c, 17, b);
        c.rect(6, b - 16, 18, b - 16, STEEL); // tray
        if (u) {
          c.rect(8, b - 17, 12, b - 17, SHEET); // plate, half eaten
          dots(c, hex('#7a6a3c'), [9, b - 18, 10, b - 18]);
          c.set(11, b - 18, hex('#5f7a4a'));
          c.rect(1, b - 17, 4, b - 16, STL); // the cover, put aside
          c.row(b - 18, 2, 3, STL);
          c.rect(15, b - 17, 17, b - 17, SHEET); // cup knocked over
          dots(c, hex('#6a4a34'), [18, b - 16, 19, b - 16, 20, b - 15, 20, b - 14, 20, b - 13]);
        } else {
          c.rect(8, b - 18, 12, b - 17, STL); // plate under its cover
          c.row(b - 19, 9, 11, STL);
          c.set(10, b - 20, STD);
          c.rect(15, b - 18, 16, b - 17, SHEET);
          c.set(17, b - 18, SHEET);
        }
      },
    ],
    s: [
      13, 23,
      (c, u) => {
        const b = c.h - 2;
        c.rect(1, b - 15, 11, b - 14, LAM);
        c.row(b - 15, 1, 11, L(LAM));
        c.rect(5, b - 13, 6, b - 3, STEEL);
        c.row(b - 2, 2, 10, STD);
        caster(c, 2, b);
        caster(c, 9, b);
        c.row(b - 16, 2, 10, STEEL);
        if (u) {
          c.rect(4, b - 17, 8, b - 17, SHEET);
          dots(c, hex('#7a6a3c'), [5, b - 18, 6, b - 18]);
          dots(c, hex('#6a4a34'), [10, b - 16, 11, b - 16, 11, b - 13]);
        } else {
          c.rect(4, b - 18, 8, b - 17, STL);
          c.row(b - 19, 5, 7, STL);
          c.set(6, b - 20, STD);
        }
      },
    ],
  });
  {
    // a drip stand with a bag of saline
    const stand = (side) => (c, u) => {
      const b = c.h - 2,
        m = side ? 5 : 7;
      c.col(m, 3, b - 2, STEEL);
      c.row(b - 2, m - 3, m + 3, STD);
      caster(c, m - 4, b);
      caster(c, m + 3, b);
      if (side) c.rect(m - 1, 2, m + 2, 2, STEEL);
      else {
        c.row(2, m - 4, m + 4, STEEL);
        dots(c, STEEL, [m - 4, 3, m + 4, 3]);
      }
      const x = side ? m + 1 : m - 5; // the bag, four wide from x
      if (u) {
        c.rect(x, 4, x + 2, 11, hex('#b9c4bc')); // run dry and gone flat
        c.col(x + 1, 5, 11, hex('#7f8d88'));
        c.set(x, 11, hex('#7f8d88'));
        c.col(x + 2, 12, b - 10, C.glassLight);
        c.line(x + 2, b - 10, x + 4, b - 3, C.glassLight); // the line pulled out, hanging loose
        c.set(x + 4, b - 2, STL);
        puddle(c, x + 3, x + 8, b, WATD);
        dots(c, BLOOD, [x + 5, b - 1]);
      } else {
        c.rect(x, 4, x + 3, 12, hex('#c4d2cc'));
        c.rect(x, 7, x + 3, 12, WAT);
        c.row(7, x, x + 3, L(WAT));
        c.col(x, 4, 12, L(hex('#c4d2cc')));
        c.rect(x + 1, 9, x + 2, 10, SHEET); // label
        c.col(x + 2, 13, 15, C.glassLight);
        c.rect(x + 2, 16, x + 2, 17, SHEET); // drip chamber
        c.col(x + 2, 18, 23, C.glassLight);
        c.line(x + 2, 23, m, 26, C.glassLight); // wound round the pole
        c.set(m - 1, 27, C.glassLight);
      }
    };
    add('hospital-drip-stand-saline', 'drip stand saline bag iv pole infusion on wheels clear', false, { m: [15, 38, stand(false)], s: [11, 38, stand(true)], su: [16, 38] });
  }
  {
    // a folding wheelchair, seen from the side and from the front
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(6, b - 20, 7, b - 9, STEEL); // back post
      c.row(b - 20, 3, 6, STEEL);
      c.rect(2, b - 20, 3, b - 20, BLK);
      c.rect(8, b - 18, 8, b - 11, TEALV);
      c.rect(7, b - 10, 17, b - 9, TEALV); // seat
      c.row(b - 10, 8, 17, L(TEALV));
      c.row(b - 14, 8, 15, BLK); // armrest
      c.col(15, b - 13, b - 9, STEEL);
      c.col(17, b - 8, b - 3, STEEL);
      c.line(8, b - 8, 16, b - 3, STD);
      c.row(b - 3, 16, 20, STEEL); // footrest
      c.row(b - 2, 19, 20, BLK);
      c.col(18, b - 2, b - 2, STEEL);
      c.rect(17, b - 1, 18, b, RUB);
      wheel(c, 8, b - 6, 6);
      if (u) {
        c.rect(8, b - 13, 16, b - 11, BLANK); // a blanket left on it
        c.row(b - 13, 9, 16, L(BLANK));
        c.rect(15, b - 11, 18, b - 5, BLANK);
        c.col(16, b - 10, b - 5, D(BLANK));
        c.rect(17, b - 4, 19, b - 4, D(BLANK));
      }
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 12, 2, b, RUB); // the big wheels, edge on
      c.rect(15, b - 12, 16, b, RUB);
      c.col(1, b - 11, b - 1, hex('#3a3942'));
      c.col(3, b - 21, b - 3, STEEL);
      c.col(14, b - 21, b - 3, STEEL);
      dots(c, BLK, [3, b - 21, 14, b - 21]);
      c.rect(4, b - 19, 13, b - 12, TEALV); // back
      c.row(b - 19, 4, 13, L(TEALV));
      c.col(8, b - 18, b - 12, D(TEALV));
      c.rect(4, b - 11, 13, b - 9, TEALV);
      c.row(b - 11, 4, 13, L(TEALV));
      c.row(b - 9, 4, 13, D(TEALV));
      c.rect(3, b - 14, 4, b - 14, BLK);
      c.rect(13, b - 14, 14, b - 14, BLK);
      c.line(4, b - 8, 13, b - 4, STD); // the folding cross
      c.line(13, b - 8, 4, b - 4, STD);
      c.rect(4, b - 3, 7, b - 3, STEEL); // footplates
      c.rect(10, b - 3, 13, b - 3, STEEL);
      c.rect(4, b - 1, 5, b, RUB);
      c.rect(12, b - 1, 13, b, RUB);
      if (u) {
        c.rect(4, b - 13, 13, b - 9, BLANK);
        c.row(b - 13, 4, 13, L(BLANK));
        c.rect(6, b - 8, 12, b - 3, BLANK);
        c.col(8, b - 8, b - 3, D(BLANK));
        c.col(11, b - 7, b - 3, D(BLANK));
        c.rect(7, b - 2, 10, b - 2, D(BLANK));
      }
    };
    add('hospital-wheelchair-folding', 'wheelchair folding steel teal vinyl seat hospital porter chair', true, { base: 'side', m: [23, 24, side], s: [18, 24, front] });
  }
  {
    // a commode: a chair with a pan under the seat
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [2, 12]) {
        c.col(x, b - 19, b - 1, STEEL);
        c.set(x, b, RUB);
      }
      c.rect(3, b - 19, 11, b - 13, VINYL); // back pad
      c.row(b - 19, 3, 11, L(VINYL));
      c.rect(1, b - 12, 3, b - 12, BLK); // arms
      c.rect(11, b - 12, 13, b - 12, BLK);
      c.rect(4, b - 7, 10, b - 4, PORC); // the pan
      c.row(b - 4, 5, 9, PORD);
      c.clear(4, b - 4);
      c.row(b - 3, 3, 11, STD);
      if (u) {
        c.rect(3, b - 17, 11, b - 10, L(LAM)); // the lid lifted against the back
        c.frame(3, b - 17, 11, b - 10, LAM);
        c.rect(3, b - 9, 11, b - 8, PORC);
        c.rect(5, b - 9, 9, b - 9, IN);
      } else {
        c.rect(3, b - 9, 11, b - 8, VINYL);
        c.row(b - 9, 3, 11, L(VINYL));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(2, b - 19, b - 1, STEEL);
      c.col(11, b - 12, b - 1, STEEL);
      dots(c, RUB, [2, b, 11, b]);
      c.rect(3, b - 19, 4, b - 13, VINYL);
      c.row(b - 12, 2, 11, BLK);
      c.rect(4, b - 7, 10, b - 4, PORC);
      c.row(b - 4, 5, 9, PORD);
      c.row(b - 3, 3, 10, STD);
      if (u) {
        c.rect(4, b - 17, 5, b - 10, L(LAM));
        c.rect(3, b - 9, 11, b - 8, PORC);
        c.row(b - 9, 5, 9, IN);
      } else {
        c.rect(3, b - 9, 11, b - 8, VINYL);
        c.row(b - 9, 3, 11, L(VINYL));
      }
    };
    add('hospital-commode-chair', 'commode chair toilet chair maroon padded seat pan ward', true, { m: [15, 22, front], s: [14, 22, side] });
  }

  /* ---------- trolleys ---------- */
  {
    const trolley = (w) => (c, u) => {
      const b = c.h - 2,
        x1 = w - 2;
      c.rect(1, b - 13, x1, b - 12, STEEL); // top
      c.row(b - 13, 1, x1, STL);
      c.rect(2, b - 5, x1 - 1, b - 4, STEEL);
      c.row(b - 4, 2, x1 - 1, STD);
      wleg(c, 1, b - 11, b);
      wleg(c, x1 - 1, b - 11, b);
      c.col(x1, b - 11, b - 2, STD);
      c.row(b - 14, 1, 1, STEEL); // rail
      c.row(b - 14, x1, x1, STEEL);
      // on the top
      c.rect(3, b - 15, 7, b - 14, u ? hex('#a9b0b2') : STL); // kidney dish
      if (u) c.rect(4, b - 15, 6, b - 15, BLOOD);
      if (w > 14) {
        if (u) {
          dots(c, STL, [10, b - 14, 11, b - 14, 13, b - 14, 15, b - 14, 16, b - 14, 12, b - 15]); // instruments left anyhow
          dots(c, BLOOD, [12, b - 14, 14, b - 14, 9, b - 14]);
        } else {
          c.rect(9, b - 14, 15, b - 14, hex('#6f8a80')); // a green cloth, instruments in a row
          dots(c, STL, [9, b - 15, 11, b - 15, 13, b - 15, 15, b - 15]);
        }
        bottle(c, x1 - 1, b - 14, 3, hex('#7a5a34'));
      } else if (u) dots(c, BLOOD, [9, b - 14, 10, b - 14]);
      else bottle(c, x1 - 2, b - 14, 3, hex('#7a5a34'));
      // underneath
      c.rect(3, b - 8, 8, b - 6, SHEET);
      c.row(b - 7, 3, 8, FOLD);
      if (u) {
        c.rect(3, b - 8, 8, b - 6, SHEET);
        splat(c, 5, b - 8);
        c.rect(7, b - 6, 9, b - 3, SHEET); // a swab cloth dragged off the shelf
        c.set(8, b - 4, BLOOD);
      }
      if (w > 14) c.rect(11, b - 9, 15, b - 6, hex('#8f9a94'));
      if (w > 14) c.row(b - 9, 11, 15, STL);
    };
    add('hospital-instrument-trolley', 'instrument trolley steel dressing trolley kidney dish scalpels swabs', true, { m: [20, 20, trolley(20)], s: [13, 20, trolley(13)] });
  }
  {
    const CANVAS = hex('#b3ad94');
    const bag = (w) => (c, u) => {
      const b = c.h - 2,
        x1 = w - 2;
      c.poly([[2, b - 16], [x1 - 1, b - 16], [x1 - 2, b - 3], [3, b - 3]], CANVAS);
      folds(c, 4, b - 15, x1 - 3, b - 4, D(CANVAS), 4);
      c.col(2, b - 16, b - 10, L(CANVAS));
      c.row(b - 17, 1, x1, STEEL);
      c.row(b - 17, 1, x1 - 2, STL);
      wleg(c, 1, b - 16, b);
      wleg(c, x1 - 1, b - 16, b);
      c.row(b - 2, 2, x1 - 1, STD);
      if (u) {
        c.rect(3, b - 20, x1 - 2, b - 18, SHEET); // stuffed full
        c.row(b - 21, 5, x1 - 4, SHEET);
        dots(c, FOLD, [5, b - 19, 8, b - 20, x1 - 4, b - 19]);
        c.rect(x1 - 5, b - 17, x1 - 2, b - 9, SHEET); // a sheet hanging out, stained
        c.col(x1 - 4, b - 16, b - 9, FOLD);
        splat(c, x1 - 5, b - 13);
        c.set(x1 - 3, b - 8, SHEET);
      } else {
        c.rect(2, b - 18, x1 - 1, b - 18, hex('#8f9a94')); // the lid
        c.set((w >> 1) - 1, b - 19, STD);
        c.rect(5, b - 12, 8, b - 9, SHEET); // a label
        c.row(b - 11, 6, 7, REDC);
      }
    };
    add('hospital-linen-trolley', 'linen trolley laundry bag cart canvas dirty sheets hospital', true, { m: [17, 24, bag(17)], s: [14, 24, bag(14)] });
  }
  {
    const col = hex('#9a9f9c');
    const front = (c, u) => {
      const b = c.h - 2,
        ox = c.w - 22;
      c.rect(ox + 1, b - 19, ox + 20, b - 2, col);
      c.row(b - 19, ox + 1, ox + 20, L(col));
      c.col(ox + 1, b - 19, b - 2, L(col));
      c.row(b - 2, ox + 1, ox + 20, D(col));
      caster(c, ox + 2, b);
      caster(c, ox + 18, b);
      c.rect(ox + 3, b - 21, ox + 18, b - 20, STD); // rail on top
      c.clearRect(ox + 4, b - 21, ox + 17, b - 21);
      for (let x = ox + 13; x < ox + 19; x += 2) c.set(x, b - 17, D(col)); // vents
      c.rect(ox + 11, b - 15, ox + 19, b - 4, col);
      c.frame(ox + 11, b - 15, ox + 19, b - 4, D(col));
      c.col(ox + 12, b - 11, b - 8, STL);
      if (u) {
        c.rect(ox + 2, b - 15, ox + 10, b - 4, IN);
        for (let y = b - 13; y < b - 4; y += 3) {
          c.row(y, ox + 2, ox + 10, STD); // trays on their runners
          c.rect(ox + 3, y - 1, ox + 6, y - 1, SHEET);
          c.set(ox + 8, y - 1, y % 2 ? hex('#7a6a3c') : STL);
        }
        dots(c, hex('#6a8a5a'), [ox + 4, b - 11, ox + 5, b - 5]);
        doorOpenF(c, ox + 1, b - 15, b - 5, 5, col);
        c.set(ox + 6, b - 20, SHEET);
      } else {
        c.rect(ox + 2, b - 15, ox + 10, b - 4, col);
        c.frame(ox + 2, b - 15, ox + 10, b - 4, D(col));
        c.col(ox + 9, b - 11, b - 8, STL);
      }
      c.set(ox + 3, b - 17, u ? hex('#c9a23a') : REDC); // the heater lamp
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 3, b - 19, 12, b - 2, col);
      c.col(1, b - 16, b - 13, STD); // push handle
      c.row(b - 16, 1, 2, STD);
      c.row(b - 13, 1, 2, STD);
      caster(c, 3, b);
      caster(c, 11, b);
      c.row(b - 20, 4, 11, STD);
      for (let y = b - 16; y < b - 12; y += 2) c.row(y, 6, 9, D(col));
      if (u) doorOpenS(c, 13, b - 15, 20, b - 4, col);
    };
    add('hospital-meal-trolley', 'meal trolley heated food cart steel doors trays dinner ward', true, { m: [22, 24, front], mu: [27, 24], s: [14, 24, side], su: [22, 24] });
  }

  /* ---------- machines ---------- */
  {
    const box = hex('#b7b29c');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 12, 12, box);
      c.row(2, 1, 12, L(box));
      c.col(1, 2, 12, L(box));
      c.row(12, 1, 12, D(box));
      screen(c, 2, 3, 9, 9, u ? 'flat' : 'off');
      dots(c, BLK, [11, 4, 11, 6]);
      c.set(11, 8, u ? C.red : hex('#5a2a2a'));
      c.row(11, 2, 6, D(box));
      c.set(8, 11, STD);
      c.set(10, 11, STD);
      c.rect(2, 13, 11, 13, STD); // shelf
      c.rect(6, 14, 7, b - 2, STEEL);
      c.row(b - 2, 3, 10, STD);
      caster(c, 2, b);
      caster(c, 10, b);
      c.line(3, 13, 2, 18, BLK); // leads
      c.col(2, 18, 22, BLK);
      if (u) {
        c.line(9, 13, 11, 19, BLK); // pulled off, hanging to the floor
        c.col(11, 19, b - 3, BLK);
        dots(c, SHEET, [11, b - 2, 12, b - 2]);
      } else {
        c.line(2, 22, 5, 20, BLK);
        dots(c, SHEET, [5, 19, 4, 22]);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, 2, 9, 12, box, { frame: false });
      for (let y = 4; y < 10; y += 2) c.row(y, 3, 5, D(box));
      c.col(9, 3, 9, u ? TR : SCR); // the screen, edge on
      if (u) c.col(10, 4, 8, hex('#3f6a4c'));
      c.rect(2, 13, 9, 13, STD);
      c.rect(5, 14, 6, b - 2, STEEL);
      c.row(b - 2, 2, 9, STD);
      caster(c, 1, b);
      caster(c, 8, b);
      c.col(2, 14, 20, BLK);
      if (u) {
        c.col(8, 14, b - 3, BLK);
        dots(c, SHEET, [9, b - 2, 10, b - 2]);
      } else dots(c, SHEET, [3, 20, 3, 21]);
    };
    add('hospital-heart-monitor', 'heart monitor cardiac screen on stand ecg flatline beep leads', true, { m: [14, 32, front], s: [12, 32, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 16, 16, b - 2, REDC);
      c.col(1, b - 16, b - 2, L(REDC));
      c.row(b - 17, 1, 16, hex('#c9c6b4'));
      caster(c, 2, b);
      caster(c, 14, b);
      for (let i = 0; i < 4; i++) {
        const y = b - 15 + i * 3 + (i > 1 ? 1 : 0);
        c.row(y + 2 + (i > 1 ? 1 : 0), 2, 15, D(REDC));
        c.rect(7, y + 1, 10, y + 1, STL);
      }
      c.rect(3, b - 24, 14, b - 18, O2); // the machine
      c.row(b - 24, 3, 14, hex('#4a4a55'));
      screen(c, 4, b - 23, 8, b - 20, u ? 'trace' : 'off');
      dots(c, u ? C.red : hex('#5a2a2a'), [10, b - 23]);
      dots(c, hex('#c9a23a'), [12, b - 23]);
      if (u) {
        c.rect(2, b - 15, 15, b - 13, hex('#a8554c')); // top drawer pulled
        c.row(b - 12, 2, 15, IN);
        c.rect(7, b - 14, 10, b - 14, STL);
        dots(c, SHEET, [4, b - 16, 5, b - 16, 12, b - 16]);
        c.line(13, b - 19, 16, b - 12, BLK); // one paddle hanging by its curly lead
        dots(c, BLK, [17, b - 11, 16, b - 10, 17, b - 9, 16, b - 8]);
        c.rect(16, b - 7, 17, b - 5, hex('#55555f'));
        c.row(b - 4, 15, 18, STL);
        c.rect(10, b - 21, 11, b - 19, hex('#55555f'));
      } else {
        c.rect(10, b - 21, 11, b - 19, hex('#55555f')); // paddles in their holders
        c.rect(13, b - 21, 14, b - 19, hex('#55555f'));
        dots(c, STL, [10, b - 19, 11, b - 19, 13, b - 19, 14, b - 19]);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 16, 10, b - 2, REDC);
      c.row(b - 17, 2, 11, hex('#c9c6b4'));
      c.col(1, b - 15, b - 12, STD);
      caster(c, 2, b);
      caster(c, 9, b);
      c.rect(3, b - 24, 9, b - 18, O2);
      c.row(b - 24, 3, 9, hex('#4a4a55'));
      c.col(9, b - 23, b - 20, u ? TR : SCR);
      if (u) {
        c.rect(11, b - 15, 14, b - 13, hex('#a8554c'));
        c.set(15, b - 14, STL);
        c.line(9, b - 19, 12, b - 11, BLK);
        dots(c, BLK, [13, b - 10, 12, b - 9, 13, b - 8]);
        c.rect(12, b - 7, 13, b - 5, hex('#55555f'));
        c.row(b - 4, 11, 14, STL);
      } else {
        dots(c, STL, [11, b - 14, 11, b - 11, 11, b - 7, 11, b - 4]);
        c.rect(7, b - 21, 8, b - 19, hex('#55555f'));
      }
    };
    add('hospital-defibrillator-cart', 'defibrillator crash cart red drawers paddles resuscitation shock', true, { m: [18, 28, front], mu: [20, 28], s: [13, 28, side], su: [17, 28] });
  }
  /** An oxygen cylinder standing on yb: black with a white shoulder. */
  function cylinder(c, x, yb, h, body = O2, top = SHEET) {
    c.rect(x, yb - h + 3, x + 3, yb, body);
    c.col(x, yb - h + 4, yb, L(L(body)));
    c.rect(x, yb - h + 3, x + 3, yb - h + 5, top);
    c.rect(x + 1, yb - h + 2, x + 2, yb - h + 2, top);
    c.rect(x + 1, yb - h, x + 2, yb - h + 1, hex('#9a7a34')); // valve
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.col(3, b - 27, b - 18, STEEL); // the trolley's handle behind it
      c.col(8, b - 27, b - 18, STEEL);
      c.row(b - 27, 3, 8, STL);
      c.row(b - 2, 2, 9, STD);
      cylinder(c, 4, b - 3, 22);
      c.row(b - 12, 3, 8, STD); // strap
      c.rect(1, b - 2, 2, b, RUB);
      c.rect(9, b - 2, 10, b, RUB);
      c.rect(6, b - 26, 8, b - 24, hex('#c9c6b4')); // gauge
      c.set(7, b - 25, u ? C.red : BLK);
      if (u) {
        c.line(8, b - 23, 11, b - 16, hex('#5f8a6a')); // the tube run out, the mask on the floor
        c.col(11, b - 16, b - 3, hex('#5f8a6a'));
        c.rect(11, b - 2, 13, b - 1, hex('#8fb39a'));
        c.set(12, b, hex('#8fb39a'));
      } else {
        c.line(8, b - 23, 10, b - 19, hex('#5f8a6a'));
        c.rect(9, b - 19, 10, b - 16, hex('#8fb39a')); // mask hung on the frame
        c.set(10, b - 15, hex('#5f8a6a'));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.line(2, b - 27, 4, b - 22, STEEL); // handle, leaning back
      c.col(4, b - 22, b - 3, STEEL);
      c.row(b - 2, 4, 11, STD);
      cylinder(c, 6, b - 3, 22);
      c.row(b - 12, 4, 10, STD);
      wheel(c, 4, b - 2, 2);
      c.rect(8, b - 26, 10, b - 24, hex('#c9c6b4'));
      c.set(9, b - 25, u ? C.red : BLK);
      if (u) {
        c.line(10, b - 23, 12, b - 16, hex('#5f8a6a'));
        c.col(12, b - 16, b - 3, hex('#5f8a6a'));
        c.rect(12, b - 2, 14, b - 1, hex('#8fb39a'));
        c.set(13, b, hex('#8fb39a'));
      } else {
        c.line(10, b - 23, 11, b - 19, hex('#5f8a6a'));
        c.rect(11, b - 19, 11, b - 16, hex('#8fb39a'));
      }
    };
    add('hospital-oxygen-bottle-trolley', 'oxygen bottle cylinder on trolley black white mask gauge gas', true, { m: [12, 30, front], mu: [15, 30], s: [13, 30, side], su: [16, 30] });
  }
  {
    const BLUE = hex('#3a4a6a');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 24, 22, b - 23, STD); // wall rail
      c.rect(1, b - 1, 22, b, STD); // floor plate
      c.col(1, b - 24, b, STEEL);
      c.col(22, b - 24, b, STEEL);
      cylinder(c, 3, b - 2, 22);
      if (u) {
        c.rect(8, b - 14, 12, b - 2, hex('#2b2a33')); // the gap
        c.rect(8, b - 2, 12, b - 2, STD);
      } else cylinder(c, 9, b - 2, 22);
      cylinder(c, 15, b - 2, 22, BLUE, BLUE);
      c.row(b - 14, 2, u ? 7 : 21, hex('#9a9a8a')); // the chain
      for (let x = 3; x < (u ? 7 : 21); x += 2) c.set(x, b - 14, STD);
      if (u) {
        c.col(8, b - 14, b - 6, hex('#9a9a8a')); // undone, hanging
        dots(c, STD, [8, b - 12, 8, b - 9]);
        c.row(b - 14, 14, 21, hex('#9a9a8a'));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(1, b - 24, b, STEEL);
      c.row(b - 24, 1, 3, STD);
      c.rect(1, b - 1, 9, b, STD);
      cylinder(c, 3, b - 2, 22, u ? BLUE : O2, u ? BLUE : SHEET);
      c.row(b - 14, 2, 8, hex('#9a9a8a'));
      c.col(8, b - 14, u ? b - 6 : b - 14, hex('#9a9a8a'));
    };
    add('hospital-oxygen-rack', 'oxygen cylinders rack three gas bottles chained nitrous store', true, { m: [24, 28, front], s: [11, 28, side] });
  }

  /* ---------- cupboards ---------- */
  {
    const front = (c, u) => {
      const b = c.h - 2,
        ox = c.w - 22;
      c.rect(ox + 1, 2, ox + 20, b - 3, ENAMEL);
      c.row(2, ox + 1, ox + 20, L(ENAMEL));
      c.col(ox + 1, 2, b - 3, L(ENAMEL));
      c.row(1, ox + 2, ox + 19, D(ENAMEL));
      for (const x of [ox + 1, ox + 19]) c.rect(x, b - 2, x + 1, b, D(ENAMEL));
      c.rect(ox + 2, 4, ox + 19, 20, hex('#39424a')); // behind the glass
      for (const y of [9, 14, 19]) c.row(y, ox + 2, ox + 19, hex('#9a9f9c'));
      jars(c, ox + 3, ox + 18, 8, 11, u ? 0.35 : 0.95);
      jars(c, ox + 3, ox + 18, 13, 12, u ? 0.5 : 0.9);
      jars(c, ox + 3, ox + 18, 18, 13, u ? 0.6 : 0.9);
      if (u) {
        c.rect(ox + 5, 13, ox + 7, 13, hex('#7a5a34')); // one on its side
        doorOpenF(c, ox + 1, 4, 19, 5, hex('#8fa9ad'));
        c.col(ox + 10, 4, 20, C.glassLight);
        dots(c, C.glassLight, [ox + 14, 6, ox + 15, 7, ox + 18, 15, ox + 17, 16]);
      } else {
        c.col(ox + 10, 4, 20, ENAMEL);
        c.col(ox + 11, 4, 20, D(ENAMEL));
        dots(c, C.glassLight, [ox + 4, 5, ox + 5, 6, ox + 13, 5, ox + 14, 6, ox + 8, 16, ox + 17, 15, ox + 18, 16]);
        dots(c, STD, [ox + 9, 12, ox + 12, 12]);
      }
      c.row(21, ox + 1, ox + 20, D(ENAMEL));
      c.frame(ox + 3, 23, ox + 10, b - 5, D(ENAMEL)); // the doors below
      c.frame(ox + 11, 23, ox + 18, b - 5, D(ENAMEL));
      dots(c, STD, [ox + 9, 28, ox + 12, 28]);
      c.rect(ox + 13, 25, ox + 16, 28, SHEET); // a label with a cross
      c.col(ox + 14, 25, 28, REDC);
      c.row(26, ox + 13, ox + 16, REDC);
      c.col(ox + 15, 25, 28, REDC);
      c.row(27, ox + 13, ox + 16, REDC);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 9, b - 3, ENAMEL, { frame: false });
      c.rect(1, b - 2, 2, b, D(ENAMEL));
      c.rect(8, b - 2, 9, b, D(ENAMEL));
      c.rect(3, 4, 7, 20, hex('#55707a')); // glass in the side
      c.col(3, 4, 20, C.glassLight);
      for (const y of [9, 14, 19]) c.row(y, 3, 7, hex('#9a9f9c'));
      dots(c, hex('#7a5a34'), [5, 8, 6, 13, 5, 18]);
      c.frame(3, 23, 7, b - 5, D(ENAMEL));
      c.row(21, 1, 9, D(ENAMEL));
      if (u) {
        c.rect(10, 4, 18, 20, hex('#8fa9ad'));
        c.frame(10, 4, 18, 20, ENAMEL);
        dots(c, C.glassLight, [12, 6, 13, 7, 15, 12, 16, 13]);
      } else c.set(10, 12, STD);
    };
    add('hospital-medicine-cabinet-glass', 'medicine cabinet glass doors white enamel bottles dispensary pharmacy', true, { m: [22, 38, front], mu: [27, 38], s: [12, 38, side], su: [20, 38] });
  }
  {
    const col = hex('#6f7f78');
    const front = (c, u) => {
      const b = c.h - 2,
        ox = u ? 4 : 0;
      c.rect(ox + 1, b - 20, ox + 15, b - 5, col);
      c.row(b - 20, ox + 1, ox + 15, L(col));
      c.col(ox + 1, b - 20, b - 5, L(col));
      c.row(b - 5, ox + 1, ox + 15, D(col));
      for (const x of [ox + 2, ox + 14]) c.col(x, b - 4, b, STD);
      c.row(b - 2, ox + 3, ox + 13, D(STD));
      c.set(ox + 13, b - 19, u ? C.red : hex('#5a2a2a')); // the lamp over it: lit while it stands open
      if (u) {
        c.rect(ox + 2, b - 18, ox + 14, b - 6, IN);
        c.row(b - 14, ox + 2, ox + 14, D(col));
        c.row(b - 10, ox + 2, ox + 14, D(col));
        c.rect(ox + 4, b - 12, ox + 6, b - 11, SHEET); // one box left
        c.set(ox + 5, b - 12, REDC);
        bottle(c, ox + 11, b - 15, 2, hex('#7a5a34'));
        c.rect(ox + 8, b - 7, ox + 9, b - 7, hex('#7a5a34')); // one on its side
        doorOpenF(c, ox + 1, b - 18, b - 7, 4, col);
        doorOpenF(c, ox + 15, b - 18, b - 7, 4, col, 1);
        dots(c, hex('#9a7a34'), [ox + 16, b - 12, ox + 16, b - 11, ox + 17, b - 10]); // the padlock hanging open
      } else {
        c.frame(ox + 2, b - 18, ox + 8, b - 7, D(col));
        c.frame(ox + 8, b - 18, ox + 14, b - 7, D(col));
        c.rect(ox + 7, b - 13, ox + 9, b - 11, hex('#9a7a34')); // padlock
        c.set(ox + 8, b - 14, STL);
        c.set(ox + 8, b - 12, BLK);
        c.rect(ox + 3, b - 17, ox + 6, b - 16, SHEET);
        c.row(b - 16, ox + 4, ox + 5, REDC);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, b - 20, 8, b - 5, col);
      c.col(2, b - 4, b, STD);
      c.col(7, b - 4, b, STD);
      if (u) {
        doorOpenS(c, 9, b - 18, 15, b - 7, col);
        dots(c, hex('#9a7a34'), [15, b - 12, 15, b - 11]);
      } else c.rect(9, b - 13, 9, b - 11, hex('#9a7a34'));
    };
    add('hospital-drugs-cupboard', 'drugs cupboard locked steel controlled poisons padlock green grey', true, { m: [17, 23, front], mu: [25, 23], s: [11, 23, side], su: [17, 23] });
  }

  /* ---------- water ---------- */
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 20, 26, b - 13, T.TILE); // splashback
      for (let x = 5; x < 26; x += 5) c.col(x, b - 20, b - 13, D(T.TILE));
      c.row(b - 17, 1, 26, D(T.TILE));
      c.rect(1, b - 12, 26, b - 7, STEEL); // the trough
      c.row(b - 12, 1, 26, STL);
      c.row(b - 7, 2, 25, STD);
      c.rect(3, b - 11, 24, b - 11, u ? WAT : STD);
      for (const x of [3, 23]) c.rect(x, b - 6, x + 1, b, STD);
      c.col(13, b - 6, b - 2, IRON); // waste pipe
      c.row(b - 2, 13, 16, IRON);
      for (const x of [8, 19]) {
        c.col(x, b - 17, b - 15, STL); // long elbow taps
        c.row(b - 17, x - 2, x, STL);
        c.set(x - 2, b - 16, STL);
        c.row(b - 18, x, x + 2, STD);
      }
      c.rect(13, b - 14, 14, b - 13, hex('#b98a6a')); // soap
      if (u) {
        stream(c, 6, b - 15, b - 12);
        c.rect(3, b - 11, 24, b - 11, WAT);
        dots(c, L(WAT), [5, b - 11, 7, b - 11, 12, b - 11]);
        c.col(25, b - 6, b - 1, WAT); // running over one end
        puddle(c, 22, 27, b, WATD);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 20, 2, b - 7, T.TILE);
      c.rect(3, b - 12, 10, b - 7, STEEL);
      c.row(b - 12, 3, 10, STL);
      c.row(b - 7, 3, 9, STD);
      c.rect(8, b - 6, 9, b, STD);
      c.col(4, b - 6, b - 2, IRON);
      c.row(b - 17, 3, 7, STL);
      c.set(7, b - 16, STL);
      c.set(3, b - 18, STD);
      if (u) {
        stream(c, 7, b - 15, b - 12);
        c.col(11, b - 11, b - 1, WAT);
        puddle(c, 9, 13, b, WATD);
      }
    };
    add('hospital-scrub-sink', 'scrub sink steel trough elbow taps surgeons wash tiled splashback', true, { m: [28, 24, front], mu: [29, 24], s: [12, 24, side], su: [15, 24] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 21, 12, b - 13, T.TILE);
      c.col(6, b - 21, b - 13, D(T.TILE));
      c.row(b - 17, 1, 12, D(T.TILE));
      c.rect(9, b - 20, 11, b - 16, hex('#c9c6b4')); // soap dispenser
      c.rect(9, b - 18, 11, b - 17, hex('#a8697a'));
      c.set(10, b - 15, STD);
      c.rect(1, b - 12, 12, b - 10, PORC);
      c.row(b - 12, 1, 12, L(PORC));
      c.rect(2, b - 9, 11, b - 8, PORC);
      c.rect(3, b - 7, 10, b - 7, PORD);
      c.row(b - 9, 2, 11, PORD);
      c.rect(6, b - 6, 7, b - 3, STEEL); // trap
      c.row(b - 3, 6, 9, STEEL);
      c.col(9, b - 3, b, STEEL);
      c.col(6, b - 15, b - 13, STL); // tap
      c.row(b - 15, 5, 7, STL);
      dots(c, STD, [4, b - 13, 8, b - 13]);
      c.rect(3, b - 11, 10, b - 11, PORD);
      if (u) {
        stream(c, 6, b - 13, b - 11, hex('#a98f8a'));
        c.rect(3, b - 11, 10, b - 11, hex('#a97a74')); // the water runs pink
        c.set(11, b - 19, BLOOD);
        dots(c, BLOOD, [2, b - 12, 9, b - 14]);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 21, 2, b - 8, T.TILE);
      c.rect(3, b - 19, 4, b - 16, hex('#c9c6b4'));
      c.rect(3, b - 12, 9, b - 10, PORC);
      c.row(b - 12, 3, 9, L(PORC));
      c.rect(3, b - 9, 8, b - 8, PORC);
      c.row(b - 7, 3, 6, PORD);
      c.rect(3, b - 6, 4, b, STEEL);
      c.row(b - 15, 3, 6, STL);
      c.set(6, b - 14, STL);
      c.set(3, b - 14, STL);
      c.set(3, b - 13, STL);
      if (u) {
        stream(c, 6, b - 13, b - 12, hex('#a98f8a'));
        c.set(9, b - 12, BLOOD);
        c.set(9, b - 10, hex('#a97a74'));
      }
    };
    add('hospital-handwash-basin', 'hand wash basin sink porcelain tap soap dispenser tiles ward', true, { m: [14, 24, front], s: [11, 24, side] });
  }
  {
    // an examination couch with a roll of paper
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 10, 35, b - 8, BLK); // pad
      c.poly([[2, b - 10], [2, b - 13], [4, b - 14], [11, b - 10]], BLK);
      c.row(b - 7, 3, 34, STEEL);
      for (const x of [4, 32]) c.rect(x, b - 6, x + 1, b, STEEL);
      c.row(b - 3, 5, 32, STD);
      c.rect(1, b - 9, 2, b - 7, SHEET); // the paper roll at the head
      c.set(1, b - 8, STD);
      if (u) {
        c.line(3, b - 14, 10, b - 11, SHEET);
        c.row(b - 11, 10, 17, SHEET);
        dots(c, FOLD, [12, b - 11, 15, b - 11]);
        c.row(b - 12, 15, 18, SHEET); // rucked up and torn off
        c.set(17, b - 13, SHEET);
        c.rect(25, b - 2, 30, b - 1, SHEET); // the rest on the floor
        c.row(b, 24, 31, FOLD);
        c.set(27, b - 3, SHEET);
        dots(c, hex('#5a5560'), [20, b - 10, 22, b - 10, 23, b - 10]);
      } else {
        c.line(3, b - 14, 10, b - 11, SHEET);
        c.row(b - 11, 10, 35, SHEET);
        c.col(35, b - 11, b - 8, SHEET);
        c.set(4, b - 15, SHEET);
      }
      c.rect(28, b - 2, u ? 23 : 33, b, hex('#8f9a94')); // step
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 6, 14, b - 8, BLK);
      c.rect(1, 2, 14, 6, hex('#34313c')); // the raised head
      c.row(2, 1, 14, hex('#4a4652'));
      c.rect(1, b - 7, 14, b - 6, hex('#34313c'));
      c.row(b - 5, 1, 14, STEEL);
      for (const x of [1, 13]) c.rect(x, b - 4, x + 1, b, STEEL);
      c.row(b - 2, 3, 12, STD);
      if (u) {
        c.rect(4, 2, 11, 12, SHEET);
        dots(c, FOLD, [5, 5, 8, 8, 6, 10, 9, 4]);
        c.poly([[4, 13], [11, 13], [9, 16], [7, 14], [5, 16]], SHEET); // torn across
        dots(c, hex('#5a5560'), [6, 20, 9, 22, 7, 24]);
      } else {
        c.rect(4, 2, 11, b - 6, SHEET);
        c.col(4, 3, b - 6, FOLD);
        c.row(6, 4, 11, FOLD);
      }
    };
    add('hospital-examination-couch', 'examination couch black vinyl paper roll doctors table clinic', true, { base: 'side', m: [38, 18, side], s: [16, 28, front] });
  }
  {
    const col = hex('#8a9690');
    const front = (c, u) => {
      const b = c.h - 2;
      cylinder(c, 1, b - 3, 20, hex('#3a4a6a'), hex('#3a4a6a')); // the bottles on the back
      cylinder(c, 15, b - 3, 20);
      c.rect(4, b - 14, 15, b - 3, col);
      c.col(4, b - 14, b - 3, L(col));
      c.row(b - 14, 4, 15, L(col));
      c.frame(5, b - 9, 14, b - 5, D(col)); // drawer
      c.rect(8, b - 7, 11, b - 7, STL);
      caster(c, 4, b);
      caster(c, 14, b);
      c.rect(5, b - 26, 14, b - 15, hex('#c9c6b4')); // the flow meters
      c.row(b - 26, 5, 14, L(hex('#c9c6b4')));
      for (let i = 0; i < 3; i++) {
        const x = 7 + i * 3;
        c.col(x, b - 24, b - 18, C.glass);
        c.set(x, u ? b - 22 + i : b - 18, u ? [C.red, hex('#c9a23a'), TR][i] : STD);
        c.set(x, b - 16, BLK);
      }
      c.col(9, b - 30, b - 27, STEEL); // gallows for the bag
      c.row(b - 30, 9, 16, STEEL);
      if (u) {
        c.rect(15, b - 29, 18, b - 23, hex('#2f2c34')); // the bag blown up
        c.col(15, b - 28, b - 24, hex('#4a4652'));
        c.col(17, b - 22, b - 12, hex('#3f3c46')); // the hose down, the mask swinging low
        dots(c, hex('#5a5560'), [17, b - 20, 17, b - 17, 17, b - 14]);
        c.rect(16, b - 11, 18, b - 9, hex('#6f8a80'));
      } else {
        c.rect(16, b - 29, 17, b - 24, hex('#2f2c34')); // limp
        c.col(3, b - 22, b - 15, hex('#3f3c46'));
        dots(c, hex('#5a5560'), [3, b - 20, 3, b - 17]);
        c.rect(2, b - 25, 4, b - 23, hex('#6f8a80')); // mask on its hook
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cylinder(c, 1, b - 3, 20);
      cabS(c, 5, b - 14, 11, b - 3, col);
      caster(c, 5, b);
      caster(c, 10, b);
      c.rect(6, b - 26, 10, b - 15, hex('#c9c6b4'));
      c.col(10, b - 24, b - 18, C.glass);
      c.set(10, u ? b - 21 : b - 18, u ? C.red : STD);
      c.col(8, b - 30, b - 27, STEEL);
      c.row(b - 30, 8, 12, STEEL);
      if (u) {
        c.rect(11, b - 29, 14, b - 23, hex('#2f2c34'));
        c.col(13, b - 22, b - 12, hex('#3f3c46'));
        c.rect(12, b - 11, 14, b - 9, hex('#6f8a80'));
      } else {
        c.rect(12, b - 29, 13, b - 24, hex('#2f2c34'));
        c.set(12, b - 9, STL);
      }
    };
    add('hospital-anaesthetic-machine', 'anaesthetic machine gas trolley flow meters rubber bag mask cylinders theatre', true, { m: [20, 33, front], s: [16, 33, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2,
        lit = u ? C.glow : hex('#6a6f6c');
      c.oval(1, 2, 20, 9, STEEL); // the dish
      c.oval(2, 2, 19, 7, STL);
      c.oval(3, 5, 18, 9, STD);
      for (const [x, y] of [[5, 7], [9, 8], [13, 8], [16, 7], [11, 6], [7, 6]]) c.rect(x, y, x + 1, y, lit);
      c.col(11, 1, 1, STEEL);
      c.line(11, 1, 18, 1, STEEL);
      c.rect(18, 1, 19, b - 3, STEEL); // column
      c.col(18, 2, b - 3, STL);
      c.rect(13, b - 2, 20, b - 1, hex('#55555f')); // heavy foot
      c.row(b - 2, 13, 20, hex('#6a6a75'));
      caster(c, 12, b);
      caster(c, 19, b);
      c.set(19, 20, u ? C.red : BLK); // switch
      if (u) for (let y = 10; y < 16; y++) for (let x = 4 + (y - 10); x <= 17 - (y - 10); x++) if ((x + y) % 3 === 0) c.set(x, y, hex('#b8b47a'));
    };
    const side = (c, u) => {
      const b = c.h - 2,
        lit = u ? C.glow : hex('#6a6f6c');
      c.poly([[5, 2], [12, 5], [10, 10], [3, 7]], STEEL); // dish, edge on and tipped
      c.line(5, 2, 12, 5, STL);
      c.line(3, 8, 9, 11, lit);
      c.line(4, 8, 9, 10, lit);
      c.line(8, 3, 4, 1, STEEL);
      c.rect(2, 1, 3, b - 3, STEEL);
      c.col(2, 2, b - 3, STL);
      c.rect(1, b - 2, 9, b - 1, hex('#55555f'));
      caster(c, 1, b);
      caster(c, 8, b);
      if (u) for (let y = 12; y < 18; y++) for (let x = 3 + (y - 12); x <= 9; x++) if ((x + y) % 3 === 0) c.set(x - 2 + (y - 12), y, hex('#b8b47a'));
    };
    add('hospital-theatre-lamp', 'operating theatre lamp surgical light on wheeled stand round dish', true, { m: [23, 38, front], s: [15, 38, side] });
  }
  {
    const base = hex('#8f9a94');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 12, 21, b - 3, base);
      c.col(2, b - 12, b - 3, L(base));
      c.row(b - 12, 2, 21, L(base));
      c.frame(4, b - 10, 12, b - 5, D(base));
      screen(c, 15, b - 10, 19, b - 8, u ? 'text' : 'off', hex('#c9a23a'));
      dots(c, BLK, [15, b - 6, 17, b - 6, 19, b - 6]);
      caster(c, 3, b);
      caster(c, 19, b);
      c.rect(1, b - 22, 22, b - 13, u ? hex('#b9c6a8') : hex('#7f9aa0')); // the hood
      c.frame(1, b - 22, 22, b - 13, C.glassLight);
      c.row(b - 13, 1, 22, STEEL);
      c.rect(3, b - 15, 20, b - 14, SHEET); // mattress
      c.row(b - 14, 3, 20, FOLD);
      for (const x of [6, 15]) {
        c.oval(x, b - 20, x + 3, b - 17, u && x === 6 ? IN : hex('#5d7f8c')); // hand ports
        c.set(x + 1, b - 20, C.glassLight);
      }
      if (u) {
        c.rect(9, b - 16, 14, b - 15, hex('#a8697a')); // a little blanket, thrown open
        c.set(15, b - 16, hex('#a8697a'));
        dots(c, L(hex('#b9c6a8')), [3, b - 21, 4, b - 21, 11, b - 21]);
        c.rect(5, b - 18, 5, b - 17, C.glassLight); // the port's flap, open
      } else dots(c, C.glassLight, [3, b - 20, 4, b - 21]);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 12, 11, b - 3, base);
      caster(c, 2, b);
      caster(c, 10, b);
      c.rect(1, b - 22, 12, b - 13, u ? hex('#b9c6a8') : hex('#7f9aa0'));
      c.frame(1, b - 22, 12, b - 13, C.glassLight);
      c.row(b - 13, 1, 12, STEEL);
      c.rect(3, b - 15, 10, b - 14, SHEET);
      if (u) {
        c.rect(5, b - 16, 8, b - 15, hex('#a8697a'));
        c.rect(13, b - 20, 13, b - 17, C.glassLight);
      } else dots(c, C.glassLight, [3, b - 20, 4, b - 21]);
    };
    add('hospital-incubator', 'incubator baby premature clear hood hand ports neonatal empty', true, { m: [24, 26, front], s: [15, 26, side] });
  }
};
