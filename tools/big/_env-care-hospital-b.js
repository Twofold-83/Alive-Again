/* The hospital, second half: the hall, the offices, the stores and the way down to the mortuary. See env-care.js. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, T, add) => {
  const { D, L, dots, panel, caster, wleg, screen, bottle, jars, stream, puddle, cabS, doorOpenF, doorOpenS, wheel, sheet, splat, folds } = T;
  const { SHEET, FOLD, STEEL, STL, STD, IRON, ID, BLK, HG, MINT, LAM, VINYL, TEALV, RUB, YEL, ORANGE, SCR, TR, WAT, WATD, BLOOD, IN, BLANK, PORC, PORD, PAPER } = T;
  const ENAMEL = hex('#cfd0c2'),
    REDC = hex('#8c3a34'),
    GLASSD = hex('#55707a'),
    BUFF = hex('#b39a6a'),
    WARM = hex('#c9b06a'),
    COAT = hex('#3a3a44');

  /* ---------- the hall ---------- */
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 16, 42, b, HG); // the counter
      c.col(1, b - 16, b, L(HG));
      c.row(b, 1, 42, D(D(HG)));
      for (const x of [3, 16, 29]) panel(c, x, b - 13, x + 11, b - 3, HG);
      c.rect(1, b - 18, 42, b - 17, LAM);
      c.row(b - 18, 1, 42, L(LAM));
      c.rect(3, 2, 40, b - 19, u ? hex('#4f5f58') : GLASSD); // the glass screen
      c.frame(3, 2, 40, b - 19, ENAMEL);
      c.col(15, 2, b - 19, ENAMEL);
      c.col(28, 2, b - 19, ENAMEL);
      dots(c, C.glassLight, [5, 4, 6, 5, 7, 6, 31, 4, 32, 5, 36, 7, 37, 8]);
      c.rect(17, 3, 26, 5, SHEET); // RECEPTION
      c.row(4, 18, 25, D(HG));
      if (u) {
        c.rect(16, b - 23, 27, b - 20, IN); // the hatch open
        c.rect(19, b - 23, 20, b - 21, WARM); // a lamp burning inside
        c.rect(18, b - 24, 21, b - 24, hex('#6a8a5a'));
        dots(c, hex('#8a7a4a'), [17, b - 22, 22, b - 22, 23, b - 21, 18, b - 20]);
        c.rect(9, b - 19, 13, b - 19, SHEET); // the book open on the counter
        c.set(11, b - 19, STD);
        c.rect(31, b - 20, 33, b - 19, BLK); // receiver off the hook
        c.line(34, b - 19, 36, b - 17, BLK);
        c.col(36, b - 17, b - 12, BLK);
        c.rect(35, b - 11, 37, b - 10, BLK);
      } else {
        c.rect(16, b - 23, 27, b - 20, hex('#b3ad94')); // the blind down
        c.row(b - 22, 16, 27, D(hex('#b3ad94')));
        c.row(b - 20, 16, 27, D(hex('#b3ad94')));
        c.rect(19, b - 22, 24, b - 21, REDC); // CLOSED
        c.row(b - 21, 20, 23, SHEET);
        c.rect(9, b - 19, 12, b - 19, hex('#5a3a34'));
        c.rect(31, b - 20, 34, b - 19, BLK); // telephone
      }
      c.rect(5, b - 20, 6, b - 19, C.brass); // bell
      c.set(5, b - 21, C.brass);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 16, 11, b, HG);
      c.rect(1, b - 18, 13, b - 17, LAM);
      c.row(b - 18, 1, 13, L(LAM));
      c.rect(9, 2, 10, b - 19, ENAMEL);
      c.col(11, 3, b - 19, u ? hex('#4f5f58') : GLASSD);
      if (u) {
        c.rect(11, b - 23, 11, b - 20, WARM);
        c.rect(12, b - 20, 13, b - 19, BLK);
        c.col(13, b - 18, b - 12, BLK);
      } else c.rect(11, b - 23, 11, b - 20, hex('#b3ad94'));
      c.set(12, b - 19, u ? SHEET : hex('#5a3a34'));
    };
    add('hospital-reception-desk', 'reception desk counter glass screen hatch enquiries admissions green', true, { m: [44, 32, front], s: [15, 32, side] });
  }
  {
    const seat = (c, x, b, col) => {
      c.rect(x, b - 15, x + 7, b - 9, col);
      c.row(b - 15, x + 1, x + 6, L(col));
      c.clear(x, b - 15);
      c.clear(x + 7, b - 15);
      c.rect(x + 3, b - 13, x + 4, b - 12, D(col)); // the hand hole
      c.rect(x, b - 8, x + 7, b - 7, col);
      c.row(b - 8, x, x + 7, L(col));
      c.row(b - 7, x, x + 7, D(col));
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.row(b - 6, 2, 29, STD);
      for (const x of [3, 27]) {
        c.col(x, b - 5, b - 1, STEEL);
        c.row(b, x - 1, x + 1, STD);
      }
      seat(c, 2, b, ORANGE);
      seat(c, 12, b, ORANGE);
      seat(c, 22, b, hex('#8f6a44'));
      c.set(24, b - 11, D(hex('#8f6a44'))); // one cracked
      c.line(25, b - 14, 27, b - 10, D(hex('#8f6a44')));
      if (u) {
        c.rect(12, b - 16, 19, b - 11, COAT); // a coat left over the back
        c.row(b - 16, 13, 18, L(COAT));
        c.rect(12, b - 10, 14, b - 5, COAT);
        c.col(13, b - 10, b - 5, D(COAT));
        c.rect(3, b - 9, 8, b - 9, PAPER); // a paper on a seat
        c.row(b - 9, 4, 6, D(PAPER));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2,
        col = ORANGE;
      c.line(2, b - 15, 3, b - 9, col);
      c.line(3, b - 15, 4, b - 9, D(col));
      c.rect(3, b - 8, 10, b - 7, col);
      c.row(b - 8, 3, 10, L(col));
      c.rect(6, b - 6, 7, b - 1, STEEL);
      c.row(b, 3, 10, STD);
      if (u) {
        c.rect(1, b - 16, 3, b - 11, COAT);
        c.rect(1, b - 10, 2, b - 5, COAT);
        c.row(b - 16, 1, 4, L(COAT));
        c.rect(5, b - 9, 9, b - 9, PAPER);
      }
    };
    add('hospital-waiting-chairs', 'waiting room chairs row of three plastic seats orange bench hall', true, { m: [32, 18, front], s: [13, 18, side] });
  }
  {
    const MAGS = [hex('#8c3a34'), hex('#3a4a6a'), hex('#a07e2c'), hex('#5a6a4a')];
    const tbl = (w) => (c, u) => {
      const b = c.h - 2,
        x1 = w - 2;
      c.rect(1, b - 6, x1, b - 5, LAM);
      c.row(b - 6, 1, x1, L(LAM));
      c.rect(2, b - 4, 2, b, STD);
      c.rect(x1 - 1, b - 4, x1 - 1, b, STD);
      c.row(b - 2, 3, x1 - 2, D(LAM)); // shelf
      c.rect(4, b - 3, 8, b - 3, MAGS[1]);
      if (u) {
        c.rect(3, b - 7, 6, b - 7, MAGS[2]);
        c.rect(x1 - 7, b - 7, x1 - 2, b - 7, SHEET); // one left open
        c.set(x1 - 4, b - 7, STD);
        dots(c, MAGS[0], [x1 - 6, b - 8, x1 - 3, b - 8]);
        c.rect(x1 - 1, b, x1 + 3, b, MAGS[0]); // one on the floor
        c.set(x1 + 1, b - 1, PAPER);
      } else {
        for (let i = 0; i < 4; i++) c.rect(3 + (i % 2), b - 7 - i, 8 + (i % 2), b - 7 - i, MAGS[i]);
        c.rect(x1 - 5, b - 7, x1 - 2, b - 7, MAGS[3]);
      }
    };
    add('hospital-magazine-table', 'waiting room low table magazines pile old comics coffee table', true, { m: [20, 13, tbl(18)], s: [15, 13, tbl(12)] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [2, 27]) {
        c.col(x, 2, b - 1, STEEL);
        c.row(b, x - 1, x + 1, STD);
      }
      c.row(2, 2, 27, STL);
      c.row(3, 3, 26, STD);
      const x1 = u ? 9 : 26;
      c.rect(3, 4, x1, b - 4, MINT);
      folds(c, 4, 5, x1, b - 4, D(MINT), u ? 2 : 3);
      folds(c, 5, 5, x1, b - 6, L(MINT), 6);
      for (let x = 3; x <= x1; x += 3) c.clear(x, b - 4);
      for (let x = 4; x <= x1; x += u ? 2 : 3) c.set(x, 3, STL);
      if (!u) splat(c, 17, b - 9, hex('#7a6a5a')); // an old stain low down
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(3, 2, b - 1, STEEL);
      c.row(b, 1, 5, STD);
      c.rect(2, 4, 4, b - 4, MINT);
      c.col(4, 4, b - 4, D(MINT));
      if (u) {
        c.rect(1, 4, 5, b - 4, MINT);
        c.col(3, 5, b - 4, D(MINT));
        c.col(5, 4, b - 4, D(MINT));
        c.col(1, 4, b - 4, L(MINT));
      }
    };
    add('hospital-curtain-rail', 'bed curtain on rail frame pale green privacy screen drawn ward', true, { m: [30, 38, front], s: [7, 38, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2,
        lit = hex('#c9d6c4');
      c.rect(1, 2, 18, 16, hex('#5d6660'));
      c.row(2, 1, 18, L(hex('#5d6660')));
      c.col(1, 2, 16, L(hex('#5d6660')));
      c.rect(2, 4, 17, 14, u ? lit : hex('#8f968c'));
      c.row(3, 2, 17, STD); // clips
      c.rect(3, 4, 9, 13, u ? hex('#2a3a44') : hex('#3a3f44')); // a film of a chest
      if (u) {
        c.col(6, 5, 12, hex('#a9c0c0'));
        for (let y = 6; y < 12; y += 2) c.row(y, 4, 8, hex('#7f9aa0'));
        c.rect(5, 9, 6, 10, hex('#c9d6c4')); // something that should not be there
      } else c.col(6, 6, 11, hex('#55606a'));
      c.set(17, 15, u ? C.red : BLK);
      c.rect(9, 17, 10, b - 2, STEEL);
      c.rect(5, b - 1, 14, b, STD);
      c.row(b - 1, 5, 14, STEEL);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, 2, 6, 16, hex('#5d6660'), { frame: false });
      c.col(6, 4, 14, u ? hex('#c9d6c4') : hex('#8f968c'));
      if (u) c.col(7, 5, 13, hex('#8f9a8c'));
      c.rect(3, 17, 4, b - 2, STEEL);
      c.rect(1, b - 1, 8, b, STD);
    };
    add('hospital-lightbox-stand', 'x-ray light box viewer on stand film chest radiograph', true, { m: [20, 34, front], s: [10, 34, side] });
  }
  {
    const scales = (side) => (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 2, 10, b, hex('#55555f')); // the platform
      c.row(b - 2, 1, 10, RUB);
      c.rect(side ? 2 : 5, b - 24, side ? 3 : 6, b - 3, ENAMEL);
      c.col(side ? 2 : 5, b - 24, b - 3, L(ENAMEL));
      const x = side ? 2 : 1;
      if (u) {
        c.line(x, b - 27, x + 9, b - 24, STEEL); // the beam tipped right up
        c.set(x + 5, b - 26, BLK);
        c.set(x + 8, b - 24, BLK);
      } else {
        c.row(b - 25, x, x + 9, STEEL);
        c.set(x + 2, b - 26, BLK);
        c.set(x + 6, b - 26, BLK);
      }
      c.row(b - 23, x + 1, x + 8, STD);
      const rx = side ? 4 : 7; // the height rod
      c.col(rx, u ? 2 : b - 29, b - 24, STL);
      c.row(u ? 2 : b - 29, rx, rx + 3, STL);
    };
    add('hospital-scales-column', 'weighing scales upright column sliding weights height measure clinic', true, { m: [13, 36, scales(false)], s: [13, 36, scales(true)] });
  }
  {
    const tbl = (w) => (c, u) => {
      const b = c.h - 2,
        x1 = w - 2;
      c.rect(1, b - 12, x1, b - 11, ENAMEL);
      c.row(b - 12, 1, x1, L(ENAMEL));
      c.col(2, b - 10, b, D(ENAMEL));
      c.col(x1 - 1, b - 10, b, D(ENAMEL));
      c.row(b - 4, 3, x1 - 2, D(ENAMEL));
      c.rect(3, b - 15, x1 - 2, b - 13, hex('#8f9a94')); // scale body
      c.row(b - 15, 3, x1 - 2, L(hex('#8f9a94')));
      c.rect((w >> 1) - 2, b - 15, (w >> 1) + 1, b - 14, SHEET); // dial
      c.set((w >> 1) + (u ? 0 : -1), b - 15, REDC);
      c.rect(2, b - 17, x1 - 1, b - 16, STL); // the scoop
      c.set(2, b - 18, STL);
      c.set(x1 - 1, b - 18, STL);
      c.row(b - 16, 3, x1 - 2, STD);
      if (u) {
        c.rect(4, b - 18, x1 - 3, b - 17, hex('#a8697a')); // a shawl, still in the tray
        c.row(b - 19, 5, x1 - 5, hex('#a8697a'));
        c.rect(x1 - 3, b - 17, x1 - 1, b - 13, hex('#a8697a'));
        c.col(x1 - 2, b - 16, b - 13, D(hex('#a8697a')));
      }
    };
    add('hospital-baby-scales', 'baby scales weighing tray on white table nursery clinic', true, { m: [20, 22, tbl(20)], s: [13, 22, tbl(13)] });
  }

  /* ---------- stores ---------- */
  {
    const pan = (c, x, y) => {
      c.rect(x, y - 1, x + 5, y, STL);
      c.row(y, x, x + 5, STD);
      c.row(y - 2, x + 1, x + 4, STEEL);
      c.set(x + 6, y - 1, STL);
    };
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [1, 16]) c.col(x, 2, b, STEEL);
      for (const y of [9, 17, 25]) c.row(y, 1, 16, STD);
      c.row(2, 1, 16, STEEL);
      pan(c, 3, 8);
      pan(c, 3, 5);
      pan(c, 10, 8);
      pan(c, 3, 16);
      if (!u) pan(c, 10, 16);
      for (const x of [3, 7, 11]) {
        if (u && x === 7) continue;
        c.rect(x, 20, x + 1, 24, C.glassLight); // bottles
        c.set(x + 1, 19, C.glassLight);
        c.set(x, 22, C.glass);
      }
      if (u) {
        pan(c, 9, b); // one on the floor, one bottle rolled away
        c.rect(3, b - 1, 7, b, C.glassLight);
        puddle(c, 6, 13, b, hex('#8a8a4a'));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      for (const x of [1, 8]) c.col(x, 2, b, STEEL);
      for (const y of [9, 17, 25]) c.row(y, 1, 8, STD);
      c.row(2, 1, 8, STEEL);
      c.rect(3, 4, 6, 8, STL);
      c.col(6, 4, 8, STD);
      c.row(6, 3, 6, STD);
      c.rect(3, 15, 6, 16, STL);
      c.rect(4, 20, 5, 24, C.glassLight);
      if (u) {
        c.rect(9, b - 1, 12, b, STL);
        c.row(b, 9, 12, STD);
      }
    };
    add('hospital-bedpan-rack', 'bedpan rack steel pans urine bottles sluice room shelf', true, { m: [18, 30, front], s: [14, 30, side] });
  }
  {
    const WOODC = hex('#8c6240');
    const crutch = (c, x, y0, y1) => {
      c.col(x, y0 + 1, y1, WOODC);
      c.col(x + 2, y0 + 1, y0 + 12, WOODC);
      c.line(x + 2, y0 + 12, x + 1, y0 + 16, WOODC);
      c.rect(x - 1, y0, x + 3, y0, hex('#5a3a34')); // the padded top
      c.set(x + 1, y0 + 7, D(WOODC));
    };
    const front = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.line(2, b - 1, 22, b - 1, WOODC); // one down on the floor
        c.line(4, b, 14, b, WOODC);
        c.rect(1, b - 2, 1, b, hex('#5a3a34'));
      } else crutch(c, 3, 2, b - 3);
      crutch(c, u ? 7 : 8, u ? 4 : 3, b - 3);
      c.col(u ? 4 : 13, 8, b - 3, hex('#4a2f22')); // a walking stick
      c.row(7, u ? 4 : 12, u ? 6 : 14, hex('#4a2f22'));
      c.rect(2, b - 10, 14, b, hex('#5d6660')); // the bin
      c.col(2, b - 10, b, L(hex('#5d6660')));
      c.row(b - 10, 2, 14, STL);
      c.row(b - 5, 2, 14, D(hex('#5d6660')));
      c.row(b, 2, 14, D(hex('#5d6660')));
    };
    const side = (c, u) => {
      const b = c.h - 2;
      if (!u) {
        c.col(4, 3, b - 3, WOODC);
        c.rect(3, 2, 5, 2, hex('#5a3a34'));
      } else {
        c.line(2, b, 14, b, WOODC);
        c.rect(1, b - 1, 1, b, hex('#5a3a34'));
      }
      c.col(6, 4, b - 3, WOODC);
      c.rect(5, 3, 7, 3, hex('#5a3a34'));
      c.col(u ? 3 : 8, 8, b - 3, hex('#4a2f22'));
      c.row(7, u ? 3 : 8, u ? 4 : 9, hex('#4a2f22'));
      cabS(c, 2, b - 10, 9, b, hex('#5d6660'), { frame: false });
      c.row(b - 10, 2, 9, STL);
    };
    add('hospital-crutch-stand', 'crutches walking sticks in a stand bin wooden orthopaedic', true, { m: [17, 32, front], mu: [25, 32], s: [12, 32, side], su: [17, 32] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.row(b - 8, 2, 16, STEEL); // lying on its side
        c.row(b - 1, 2, 16, STEEL);
        c.col(2, b - 8, b - 1, STL);
        c.col(8, b - 8, b - 1, STD);
        dots(c, RUB, [17, b - 8, 17, b - 1]);
        c.rect(2, b - 9, 4, b - 9, BLK);
        c.row(b - 4, 9, 16, STD);
        return;
      }
      for (const x of [2, 12]) {
        c.col(x, b - 15, b - 1, STEEL);
        c.set(x, b, RUB);
        c.rect(x - 1, b - 16, x + 1, b - 16, BLK); // grips
      }
      c.row(b - 14, 3, 11, STL);
      c.row(b - 8, 3, 11, STD);
      c.col(4, b - 13, b - 1, STD);
      c.col(10, b - 13, b - 1, STD);
      dots(c, RUB, [4, b, 10, b]);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(2, b - 1, 12, b, STEEL); // seen from above its fallen legs
        c.row(b - 1, 2, 12, STL);
        c.rect(1, b - 2, 2, b, BLK);
        c.line(12, b - 1, 16, b - 6, STD);
        c.set(16, b - 7, RUB);
        return;
      }
      c.line(3, b - 15, 2, b - 1, STEEL);
      c.line(8, b - 15, 11, b - 1, STEEL);
      c.row(b - 15, 3, 8, STL);
      c.rect(2, b - 16, 9, b - 16, BLK);
      c.row(b - 8, 3, 9, STD);
      dots(c, RUB, [2, b, 11, b]);
    };
    add('hospital-walking-frame', 'walking frame zimmer aluminium frame old patient aid', false, { m: [15, 19, front], mu: [20, 12], s: [14, 19, side], su: [19, 11] });
  }
  {
    const TABS = [REDC, hex('#3a4a6a'), hex('#a07e2c'), hex('#5a6a4a'), hex('#6a4a5a')];
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 13, 20, b - 3, hex('#8f9a94'));
      c.col(1, b - 13, b - 3, L(hex('#8f9a94')));
      c.row(b - 3, 1, 20, D(hex('#8f9a94')));
      c.frame(3, b - 11, 18, b - 5, D(hex('#8f9a94')));
      c.rect(8, b - 9, 13, b - 8, SHEET);
      c.row(b - 8, 9, 12, STD);
      caster(c, 2, b);
      caster(c, 18, b);
      for (let x = 2; x < 20; x++) {
        if (u && x > 7 && x < 13) continue;
        c.col(x, b - 17, b - 14, x % 3 ? BUFF : D(BUFF)); // the folders standing in it
        if (x % 2) c.set(x, b - 18, TABS[x % 5]);
      }
      if (u) {
        c.rect(8, b - 14, 12, b - 14, IN);
        c.rect(12, b - 19, 19, b - 18, BUFF); // one lying open across the rest
        c.rect(13, b - 20, 18, b - 20, SHEET);
        c.set(15, b - 20, REDC);
        c.rect(5, b - 1, 9, b, SHEET); // loose sheets on the floor
        c.row(b, 6, 8, FOLD);
        c.rect(12, b, 15, b, BUFF);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 13, 10, b - 3, hex('#8f9a94'));
      caster(c, 2, b);
      caster(c, 9, b);
      c.rect(3, b - 17, 9, b - 14, BUFF);
      c.row(b - 18, 3, 9, TABS[0]);
      c.col(1, b - 16, b - 12, STD);
      if (u) {
        c.rect(3, b - 19, 10, b - 19, SHEET);
        c.rect(11, b, 14, b, SHEET);
      }
    };
    add('hospital-notes-trolley', 'patient notes trolley case files folders records cart ward round', true, { m: [22, 22, front], s: [16, 22, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2,
        r = rnd(7);
      c.rect(1, 2, 22, b, hex('#3a3f44'));
      c.col(1, 2, b, STEEL);
      c.col(22, 2, b, STEEL);
      c.row(2, 1, 22, STL);
      for (let i = 0; i < 5; i++) {
        const yb = 8 + i * 7;
        c.row(yb + 1, 1, 22, STEEL);
        for (let x = 2; x < 22; x++) {
          const k = r();
          if (u && i === 2 && x > 6 && x < 18) continue;
          if (k < 0.08) continue;
          const h = 4 + (k < 0.5 ? 1 : 0);
          c.col(x, yb - h + 1, yb, k < 0.3 ? D(BUFF) : BUFF);
          if (k > 0.6) c.set(x, yb - h + 2, [REDC, hex('#3a4a6a'), hex('#5a6a4a'), hex('#a07e2c')][(k * 40) | 0 % 4]);
        }
      }
      if (u) {
        c.rect(7, 21, 9, 22, BUFF); // what is left has fallen flat
        c.poly([[5, b], [8, b - 3], [17, b - 4], [21, b]], BUFF); // the heap on the floor
        c.row(b - 2, 9, 16, SHEET);
        c.row(b - 4, 11, 15, SHEET);
        dots(c, REDC, [10, b - 1, 18, b - 1]);
        dots(c, D(BUFF), [8, b - 1, 13, b - 3, 16, b - 1, 12, b]);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 8, b, hex('#3a3f44'));
      c.col(1, 2, b, STEEL);
      c.col(8, 2, b, STEEL);
      c.row(2, 1, 8, STL);
      for (let i = 0; i < 5; i++) {
        c.row(9 + i * 7, 1, 8, STEEL);
        if (!(u && i === 2)) c.rect(3, 5 + i * 7, 7, 8 + i * 7, BUFF);
      }
      c.line(1, 3, 8, 15, STD); // a brace
      if (u) {
        c.poly([[9, b], [9, b - 3], [12, b - 3], [14, b]], BUFF);
        c.row(b - 2, 10, 12, SHEET);
      }
    };
    add('hospital-records-shelf', 'medical records shelves racking case files folders archive', true, { m: [24, 38, front], s: [10, 38, side], su: [16, 38] });
  }
  {
    const body = hex('#6a5a4a'),
      face = hex('#b9ab8a');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 16, b - 1, body);
      c.col(1, 2, b - 1, L(body));
      c.row(2, 1, 16, L(body));
      c.rect(1, b, 16, b, D(body));
      c.rect(2, 4, 11, 14, u ? hex('#d9c98a') : face); // the lit sign: a cup
      c.rect(5, 8, 8, 12, u ? hex('#8c5a34') : hex('#8a7a5c'));
      c.set(9, 9, u ? hex('#8c5a34') : hex('#8a7a5c'));
      c.set(9, 10, u ? hex('#8c5a34') : hex('#8a7a5c'));
      dots(c, u ? SHEET : hex('#a39a7c'), [6, 6, 7, 5, 6, 4]);
      for (let y = 4; y < 15; y += 2) {
        c.rect(13, y, 14, y, STD); // buttons
        c.set(15, y, u && y === 8 ? C.red : hex('#4a3a34'));
      }
      c.rect(13, 17, 15, 18, BLK); // coins
      c.set(14, 17, STL);
      c.rect(3, 18, 10, 26, IN); // the hatch
      c.frame(3, 18, 10, 26, STD);
      c.row(26, 3, 10, STEEL);
      if (u) {
        c.rect(6, 23, 8, 25, SHEET); // a cup, steaming
        c.row(23, 6, 8, hex('#6a4a34'));
        dots(c, hex('#7a7f84'), [7, 21, 6, 20, 7, 19]);
      }
      c.rect(3, 29, 14, 31, D(body));
      c.set(13, 21, hex('#9a7a34'));
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 9, b - 1, body);
      c.row(b, 1, 9, D(body));
      for (let y = 6; y < 12; y += 2) c.row(y, 4, 7, D(body));
      c.col(10, 4, 14, u ? hex('#d9c98a') : face);
      c.col(10, 18, 26, STD);
      if (u) c.set(11, 24, SHEET);
    };
    add('hospital-vending-drinks', 'hot drinks vending machine coffee tea brown waiting room', true, { m: [18, 36, front], s: [13, 36, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 1, 28, b, hex('#8f9a94')); // the surround
      c.col(1, 1, b, L(hex('#8f9a94')));
      c.row(1, 1, 28, L(hex('#8f9a94')));
      c.rect(9, 3, 18, 5, BLK); // the floor indicator
      if (u) {
        c.rect(13, 3, 14, 5, hex('#d98b2b'));
        c.set(11, 4, hex('#d98b2b'));
        c.rect(4, 7, 23, b, hex('#2e2e33')); // the car
        c.rect(6, 9, 21, b - 4, hex('#4a463c'));
        c.rect(6, 9, 21, 10, hex('#b8b47a')); // its light
        c.row(b - 14, 6, 21, STD); // handrail
        c.poly([[4, b], [6, b - 3], [21, b - 3], [23, b]], hex('#5a5a55'));
        c.col(4, 7, b, STEEL); // the leaves, drawn back
        c.col(23, 7, b, STEEL);
        dots(c, BLOOD, [12, b - 2, 13, b - 2, 15, b - 1]);
      } else {
        c.rect(4, 7, 23, b, STEEL);
        c.col(4, 7, b, STL);
        c.col(13, 7, b, STD);
        c.col(14, 7, b, STL);
        c.col(23, 7, b, STD);
        c.rect(6, 10, 11, b - 3, mix(STEEL, 0.93));
        c.rect(16, 10, 21, b - 3, mix(STEEL, 0.93));
        c.row(b, 4, 23, STD);
        c.set(12, 4, hex('#5a3a2a'));
      }
      c.rect(25, 20, 27, 24, BLK); // call buttons
      c.set(26, 21, u ? hex('#d98b2b') : STD);
      c.set(26, 23, STD);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 1, 5, b, hex('#8f9a94'));
      c.col(1, 1, b, L(hex('#8f9a94')));
      c.col(5, 1, b, D(hex('#8f9a94')));
      c.row(1, 1, 5, L(hex('#8f9a94')));
      c.rect(6, 20, 6, 24, BLK);
      if (u) {
        c.col(6, 7, 19, hex('#b8b47a'));
        c.col(6, 25, b, hex('#8a865a'));
        c.set(6, 21, hex('#d98b2b'));
        c.rect(7, b, 9, b, hex('#8a865a')); // light on the floor
      }
    };
    add('hospital-lift-doors', 'lift doors elevator steel hospital corridor call button', true, { m: [30, 40, front], s: [8, 40, side], su: [11, 40] });
  }
  {
    const col = hex('#9a9f9c');
    const front = (c, u) => {
      const b = c.h - 2,
        ox = c.w - 30;
      c.rect(ox + 1, 2, ox + 28, b, col);
      c.col(ox + 1, 2, b, L(col));
      c.row(2, ox + 1, ox + 28, L(col));
      c.row(b, ox + 1, ox + 28, D(col));
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 2; j++) {
          const x = ox + 3 + j * 13,
            y = 4 + i * 11;
          if (u && i === 1 && j === 0) {
            c.rect(x, y, x + 11, y + 9, IN);
            c.rect(x + 1, y + 7, x + 10, y + 9, STEEL); // the tray run out towards us
            c.row(y + 9, x + 1, x + 10, STD);
            c.rect(x + 2, y + 3, x + 9, y + 7, SHEET); // someone under a sheet, feet first
            c.rect(x + 3, y + 2, x + 4, y + 2, SHEET);
            c.rect(x + 7, y + 2, x + 8, y + 2, SHEET);
            c.row(y + 7, x + 2, x + 9, FOLD);
            c.col(x + 5, y + 4, y + 6, FOLD);
            c.rect(x + 8, y + 5, x + 9, y + 6, BUFF); // the tag
            doorOpenF(c, x, y, y + 8, 3, col);
            continue;
          }
          c.rect(x, y, x + 11, y + 9, mix(col, 0.92));
          c.frame(x, y, x + 11, y + 9, D(col));
          c.row(y, x, x + 11, L(col));
          c.rect(x + 9, y + 3, x + 10, y + 6, STL); // latch
          c.set(x + 10, y + 6, STD);
          c.rect(x + 2, y + 2, x + 5, y + 3, SHEET); // label
          if ((i + j) % 2) c.row(y + 3, x + 2, x + 4, STD);
        }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 26, b, col);
      for (const y of [14, 25]) c.row(y, 2, 25, D(col));
      for (const y of [8, 19, 30]) c.rect(27, y, 27, y + 2, STL);
      c.rect(4, 5, 9, 7, hex('#55555f')); // the motor's grille
      c.row(6, 4, 9, BLK);
      if (u) {
        c.rect(27, 22, 54, 23, STEEL); // the tray, right out
        c.row(23, 27, 54, STD);
        c.col(52, 24, b - 1, STD); // its prop leg
        c.set(52, b, RUB);
        c.poly([[29, 21], [30, 18], [33, 17], [36, 19], [48, 19], [50, 16], [52, 17], [53, 21]], SHEET);
        c.line(30, 18, 33, 17, L(SHEET));
        c.row(21, 30, 52, FOLD);
        dots(c, FOLD, [38, 20, 43, 20, 47, 20]);
        c.rect(53, 19, 54, 20, BUFF);
        c.rect(27, 15, 28, 24, D(col)); // the door, standing open edge on
      }
    };
    add('hospital-mortuary-drawers', 'mortuary drawers body fridge cold store morgue steel doors', true, { m: [30, 38, front], mu: [33, 38], s: [29, 38, side], su: [57, 38] });
  }
  {
    const POLE = hex('#8c6240'),
      CANV = hex('#7f8468');
    const main = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 3, 40, b - 3, POLE); // laid open on the floor
        c.rect(5, b - 2, 36, b - 1, CANV);
        c.row(b - 2, 5, 36, L(CANV));
        c.rect(1, b, 40, b, D(POLE));
        dots(c, BLK, [1, b - 3, 40, b - 3]);
        c.rect(16, b - 2, 22, b - 2, hex('#5a4a3c')); // a dark patch in the middle
        c.rect(18, b - 1, 21, b - 1, hex('#5a4a3c'));
        c.col(11, b - 2, b - 1, D(CANV));
        c.col(29, b - 2, b - 1, D(CANV));
        return;
      }
      c.col(2, 2, b, POLE); // furled and stood against the wall
      c.col(7, 3, b, POLE);
      dots(c, BLK, [2, 2, 7, 3, 2, b, 7, b]);
      c.rect(3, 6, 6, b - 5, CANV);
      c.col(3, 6, b - 5, L(CANV));
      c.col(5, 7, b - 5, D(CANV));
      for (const y of [11, 20, 29]) c.row(y, 2, 7, hex('#5a3a34')); // straps
    };
    const side = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 3, 2, b - 3, POLE); // from its end
        c.rect(11, b - 3, 12, b - 3, POLE);
        c.rect(2, b - 2, 11, b - 1, CANV);
        c.row(b - 2, 2, 11, L(CANV));
        c.rect(5, b - 2, 8, b - 2, hex('#5a4a3c'));
        return;
      }
      c.line(5, 2, 2, b, POLE);
      dots(c, BLK, [5, 2, 2, b]);
      c.line(5, 6, 3, b - 5, CANV);
      c.line(6, 6, 4, b - 5, D(CANV));
    };
    add('hospital-stretcher-canvas', 'stretcher canvas poles rolled leaning carrying litter ambulance', false, { m: [10, 38, main], mu: [42, 6], s: [8, 38, side], su: [14, 6] });
  }
  {
    const col = hex('#8fa594');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 1, 32, b, hex('#c9c6b4')); // frame
      c.rect(3, 3, 30, b, IN);
      const leaf = (x0, x1) => {
        c.rect(x0, 3, x1, b, col);
        c.col(x0, 3, b, L(col));
        c.col(x1, 3, b, D(col));
        const m = (x0 + x1) >> 1;
        c.oval(m - 3, 8, m + 3, 14, GLASSD); // porthole
        c.set(m - 1, 9, C.glassLight);
        c.set(m - 2, 10, C.glassLight);
        c.rect(x0 + 1, b - 6, x1 - 1, b, STEEL); // kick plate
        c.row(b - 6, x0 + 1, x1 - 1, STL);
      };
      leaf(3, 16);
      c.rect(14, 18, 15, 22, STL); // push plates
      if (u) {
        c.rect(17, 3, 30, b, hex('#23222b')); // the far leaf pushed in: the dark ward beyond
        c.rect(26, 3, 30, b, D(col));
        c.col(26, 3, b, col);
        c.rect(27, 8, 29, 14, GLASSD);
        c.rect(27, b - 6, 30, b, STD);
        c.poly([[17, b], [20, b - 5], [25, b - 5], [25, b]], hex('#34323c'));
        dots(c, hex('#5a5a66'), [19, 10, 21, 16, 23, 12]);
        c.row(b, 17, 21, BLOOD); // dragged through
        dots(c, BLOOD, [22, b - 1, 24, b - 2]);
      } else {
        leaf(17, 30);
        c.rect(18, 18, 19, 22, STL);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 1, 4, b, hex('#c9c6b4'));
      c.col(1, 1, b, L(hex('#c9c6b4')));
      c.col(4, 1, b, D(hex('#c9c6b4')));
      if (u) {
        c.rect(1, 3, 1, b, col); // the leaf standing into the ward, to the left
        doorOpenS(c, 5, 3, 5, b, col);
      }
    };
    add('hospital-swing-doors', 'ward double doors swing doors portholes pale green kick plates', true, { m: [34, 40, front], s: [6, 40, (c, u) => side(c, false)], su: [18, 40], });
  }
  {
    const col = hex('#6f7f78');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 13, 28, b - 12, LAM);
      c.row(b - 13, 1, 28, L(LAM));
      c.rect(2, b - 11, 3, b, col);
      c.rect(18, b - 11, 27, b, col);
      c.col(18, b - 11, b, L(col));
      for (const y of [b - 10, b - 6]) {
        c.frame(19, y, 26, y + 3, D(col));
        c.rect(22, y + 1, 23, y + 1, STL);
      }
      c.rect(4, b - 11, 17, b - 9, D(col)); // modesty panel
      c.rect(9, b - 14, 15, b - 14, SHEET); // the ledger
      c.set(12, b - 14, STD);
      c.rect(20, b - 15, 23, b - 14, BLK); // telephone
      c.row(b - 16, 20, 23, BLK);
      c.rect(5, b - 14, 6, b - 14, STD); // the lamp
      c.line(5, b - 15, 4, b - 19, STD);
      c.line(4, b - 19, 7, b - 21, STD);
      c.rect(7, b - 22, 10, b - 21, hex('#55705a'));
      c.row(b - 20, 7, 10, u ? C.glow : hex('#3a4a3c'));
      if (u) {
        for (let y = b - 19; y <= b - 15; y++) for (let x = 7 - (y - b + 19) / 2; x <= 11 + (y - b + 19); x++) if ((x + y) % 2 === 0) c.set(x, y, hex('#b8b47a'));
        c.rect(9, b - 14, 15, b - 14, hex('#d9d3a8'));
        c.clearRect(20, b - 16, 23, b - 16);
        c.line(24, b - 14, 27, b - 11, BLK); // the receiver hanging over the edge
        c.col(28, b - 11, b - 6, BLK);
        c.rect(27, b - 5, 29, b - 4, BLK);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 13, 13, b - 12, LAM);
      c.row(b - 13, 1, 13, L(LAM));
      cabS(c, 2, b - 11, 12, b, col);
      c.rect(8, b - 15, 10, b - 14, BLK);
      c.col(4, b - 19, b - 14, STD);
      c.rect(4, b - 21, 8, b - 20, hex('#55705a'));
      c.row(b - 19, 5, 8, u ? C.glow : hex('#3a4a3c'));
      if (u) {
        dots(c, hex('#b8b47a'), [5, b - 18, 7, b - 18, 6, b - 17, 8, b - 17, 5, b - 16, 7, b - 16, 9, b - 16, 6, b - 15, 8, b - 15]);
        c.col(13, b - 11, b - 6, BLK);
        c.rect(13, b - 5, 14, b - 4, BLK);
      }
    };
    add('hospital-nurse-desk', 'nurses station desk night lamp telephone ledger duty sister', true, { m: [31, 25, front], s: [16, 25, side] });
  }
  {
    const hood = hex('#8a8f8c');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(5, 14, 6, b - 1, STEEL);
      c.rect(2, b, 9, b, STD);
      c.rect(1, 2, 10, 14, hood);
      c.row(2, 2, 9, L(hood));
      c.clear(1, 2);
      c.clear(10, 2);
      c.rect(2, 4, 9, 14, hex('#2e2e33')); // inside the hood
      c.rect(3, 5, 8, 12, BLK); // the telephone
      c.rect(5, 6, 7, 7, STL); // dial
      c.set(6, 6, BLK);
      c.rect(6, 10, 7, 10, STD);
      if (u) {
        c.col(4, 12, 24, hex('#55555f')); // the receiver swinging on its cord
        c.rect(3, 25, 5, 29, BLK);
        c.set(4, 27, hex('#3a3a44'));
      } else c.rect(3, 6, 3, 11, hex('#3a3a44'));
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(3, 14, 4, b - 1, STEEL);
      c.rect(1, b, 7, b, STD);
      c.poly([[1, 2], [6, 2], [9, 5], [9, 14], [1, 14]], hood);
      c.line(6, 2, 9, 5, L(hood));
      c.col(1, 2, 14, L(hood));
      c.rect(6, 6, 9, 13, hex('#2e2e33'));
      c.rect(6, 6, 7, 12, BLK);
      if (u) {
        c.col(8, 12, 24, hex('#55555f'));
        c.rect(8, 25, 9, 29, BLK);
      }
    };
    add('hospital-payphone-hood', 'pay phone telephone on post with hood corridor call box', true, { m: [12, 34, front], s: [11, 34, side] });
  }

  /* ---------- small things ---------- */
  {
    const bin = (w) => (c, u) => {
      const b = c.h - 2,
        x1 = w - 2;
      c.rect(1, b - 7, x1, b, YEL);
      c.col(1, b - 7, b, L(YEL));
      c.rect(2, b - 5, x1 - 1, b - 3, SHEET); // label
      c.row(b - 4, 3, x1 - 2, REDC);
      if (u) {
        c.rect(1, b - 8, x1, b - 8, D(YEL));
        c.line(x1, b - 9, x1 + 2, b - 12, REDC); // the lid thrown back
        c.line(3, b - 9, 2, b - 12, STL); // needles
        c.line(5, b - 9, 6, b - 11, STL);
        dots(c, C.glassLight, [3, b - 9, 5, b - 9]);
        c.rect(x1 + 1, b, x1 + 3, b, C.glassLight); // one on the floor
        c.set(x1 + 4, b, STL);
      } else {
        c.rect(1, b - 9, x1, b - 8, REDC);
        c.row(b - 9, 1, x1, L(REDC));
        c.rect((w >> 1) - 1, b - 10, w >> 1, b - 10, D(REDC));
      }
    };
    add('hospital-sharps-bin', 'sharps bin yellow needles box red lid syringes disposal', false, { m: [9, 14, bin(9)], mu: [14, 14], s: [8, 14, bin(8)], su: [13, 14] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 11, 9, b - 1, ENAMEL);
      c.col(1, b - 11, b - 1, L(ENAMEL));
      c.row(b - 1, 1, 9, D(ENAMEL));
      c.rect(2, b, 8, b, BLK);
      c.rect(4, b - 1, 6, b - 1, STD); // pedal
      c.row(b - 11, 1, 9, YEL); // the bag's rim
      if (u) {
        c.rect(1, b - 18, 9, b - 13, D(ENAMEL)); // lid up
        c.frame(1, b - 18, 9, b - 13, ENAMEL);
        c.rect(2, b - 13, 8, b - 12, SHEET); // dressings
        splat(c, 4, b - 13);
        c.set(9, b - 10, SHEET);
        c.col(9, b - 9, b - 7, SHEET);
        c.set(9, b - 8, BLOOD);
      } else {
        c.rect(1, b - 13, 9, b - 12, ENAMEL);
        c.row(b - 13, 1, 9, L(ENAMEL));
        c.rect(4, b - 14, 6, b - 14, STD);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 11, 9, b - 1, ENAMEL);
      c.col(1, b - 11, b - 1, L(ENAMEL));
      c.rect(2, b, 8, b, BLK);
      c.rect(10, b, 11, b, STD);
      c.row(b - 11, 1, 9, YEL);
      if (u) {
        c.line(1, b - 12, 0 + 2, b - 19, ENAMEL);
        c.line(2, b - 12, 3, b - 19, D(ENAMEL));
        c.rect(3, b - 13, 8, b - 12, SHEET);
        c.set(6, b - 13, BLOOD);
        c.col(10, b - 10, b - 7, SHEET);
      } else {
        c.rect(1, b - 13, 9, b - 12, ENAMEL);
        c.row(b - 13, 1, 9, L(ENAMEL));
      }
    };
    add('hospital-waste-bin-pedal', 'pedal bin clinical waste white enamel yellow bag dressings', false, { m: [11, 21, front], s: [13, 21, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2,
        ox = c.w - 16;
      c.rect(ox + 1, 2, ox + 14, b - 1, ENAMEL);
      c.col(ox + 1, 2, b - 1, L(ENAMEL));
      c.row(2, ox + 1, ox + 14, L(ENAMEL));
      c.rect(ox + 2, b, ox + 13, b, BLK);
      c.rect(ox + 3, 3, ox + 5, 5, SHEET); // thermometer dial
      c.set(ox + 4, 4, u ? C.red : BLK);
      c.rect(ox + 9, 4, ox + 12, 4, REDC);
      c.rect(ox + 2, 7, ox + 13, b - 5, u ? hex('#3f4a44') : hex('#2f3a3c'));
      for (let i = 0; i < 3; i++) {
        const yb = 13 + i * 6;
        c.row(yb + 1, ox + 2, ox + 13, STD);
        for (let x = ox + 3; x < ox + 13; x += 3) {
          if (u && (i + x) % 3 !== 0) continue;
          c.rect(x, yb - 3, x + 1, yb, hex('#6a1a1e')); // bags of blood
          c.set(x, yb - 4, SHEET);
          c.set(x, yb - 2, BLOOD);
        }
      }
      if (u) {
        c.rect(ox + 2, 7, ox + 13, 7, hex('#b8b47a'));
        doorOpenF(c, ox + 1, 7, b - 6, 5, hex('#8fa9ad'));
        c.rect(ox + 6, b, ox + 9, b, hex('#6a1a1e')); // one dropped and burst
        c.rect(ox + 4, b + 1, ox + 11, b + 1, BLOOD);
      } else {
        c.frame(ox + 2, 7, ox + 13, b - 5, D(ENAMEL));
        dots(c, C.glassLight, [ox + 4, 9, ox + 5, 10, ox + 11, 21, ox + 12, 22]);
        c.col(ox + 13, 14, 18, STL);
      }
      c.rect(ox + 3, b - 3, ox + 12, b - 3, D(ENAMEL)); // vent
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 2, 10, b - 1, ENAMEL);
      c.rect(2, b, 9, b, BLK);
      if (u) {
        c.rect(11, 7, 17, b - 5, hex('#8fa9ad'));
        c.frame(11, 7, 17, b - 5, ENAMEL);
        c.rect(11, b, 14, b, BLOOD);
      } else c.col(11, 14, 18, STL);
    };
    add('hospital-blood-fridge', 'blood bank fridge refrigerator glass door bags transfusion white', true, { m: [16, 30, front], mu: [21, 31], s: [13, 30, side], su: [19, 30], });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [3, 16]) c.rect(x, b - 8, x + 1, b, STD);
      c.row(b - 4, 4, 16, D(STD));
      c.oval(2, b - 22, 18, b - 7, STEEL); // the drum, end on
      c.oval(3, b - 22, 17, b - 9, STL);
      c.oval(4, b - 20, 16, b - 9, STEEL);
      if (u) {
        c.oval(5, b - 19, 15, b - 10, IN); // open: the dark inside
        c.row(b - 12, 7, 13, STD);
        c.rect(8, b - 14, 12, b - 13, STL); // a tray of instruments
        dots(c, hex('#a9b0b2'), [6, b - 24, 8, b - 26, 11, b - 25, 13, b - 27, 9, b - 28]); // steam
        c.rect(18, b - 21, 20, b - 8, STD); // the door swung aside
        c.col(18, b - 21, b - 8, STL);
      } else {
        c.oval(6, b - 18, 14, b - 11, STD);
        c.oval(7, b - 17, 13, b - 12, STEEL);
        c.line(7, b - 17, 13, b - 12, STL); // the wheel that screws it shut
        c.line(13, b - 17, 7, b - 12, STL);
        c.rect(10, b - 15, 10, b - 14, BLK);
      }
      c.rect(9, b - 25, 11, b - 23, SHEET); // gauge
      c.set(10, b - 24, u ? C.red : BLK);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      for (const x of [4, 15]) c.rect(x, b - 8, x + 1, b, STD);
      c.rect(2, b - 21, 18, b - 8, STEEL);
      c.row(b - 21, 3, 17, STL);
      c.row(b - 20, 2, 18, STL);
      c.row(b - 8, 3, 17, STD);
      c.row(b - 9, 2, 18, STD);
      for (const x of [6, 12]) c.col(x, b - 21, b - 8, STD); // bands
      c.col(2, b - 19, b - 10, STD);
      c.rect(8, b - 24, 10, b - 22, SHEET);
      c.set(9, b - 23, u ? C.red : BLK);
      c.line(1, b - 14, 1, b - 3, hex('#84482a')); // steam pipe
      if (u) {
        c.rect(19, b - 20, 19, b - 9, IN);
        c.rect(20, b - 21, 26, b - 21, STD); // door, open towards us
        c.col(20, b - 21, b - 8, STD);
        dots(c, hex('#a9b0b2'), [20, b - 23, 21, b - 25, 19, b - 26, 22, b - 27]);
      } else {
        c.col(19, b - 19, b - 10, STD);
        c.rect(20, b - 15, 20, b - 14, STL);
      }
    };
    add('hospital-autoclave', 'autoclave steriliser steam drum steel pressure instruments', true, { m: [22, 30, front], s: [28, 30, side] });
  }
  {
    const cooler = (side) => (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 18, 8, b - 1, ENAMEL);
      c.col(1, b - 18, b - 1, L(ENAMEL));
      c.row(b - 18, 1, 8, L(ENAMEL));
      c.rect(1, b, 8, b, BLK);
      c.rect(2, b - 28, 7, b - 19, C.glassLight); // the bottle
      c.clear(2, b - 28);
      c.clear(7, b - 28);
      c.rect(2, u ? b - 21 : b - 26, 7, b - 19, WAT);
      c.row(u ? b - 21 : b - 26, 2, 7, L(WAT));
      c.col(2, b - 27, b - 20, L(C.glassLight));
      if (u) dots(c, L(WAT), [4, b - 23, 5, b - 25, 4, b - 27]); // a bubble going up
      if (side) {
        c.rect(9, b - 14, 9, b - 13, hex('#3a4a6a'));
        c.rect(9, b - 9, 10, b - 9, STD);
        if (u) c.rect(9, b - 11, 10, b - 10, SHEET);
      } else {
        c.rect(3, b - 14, 3, b - 13, hex('#3a4a6a')); // taps
        c.rect(6, b - 14, 6, b - 13, REDC);
        c.rect(2, b - 10, 7, b - 9, IN);
        c.row(b - 8, 2, 7, STD);
        if (u) c.rect(3, b - 10, 4, b - 9, SHEET); // a paper cup left under the tap
        c.rect(3, b - 5, 6, b - 3, D(ENAMEL));
      }
      if (u) puddle(c, side ? 8 : 5, side ? 12 : 10, b, WATD);
    };
    add('hospital-water-cooler', 'water cooler bottle dispenser paper cup waiting room', true, { m: [12, 31, cooler(false)], s: [14, 31, cooler(true)] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 1, 5, b, STD); // knocked flat
        c.rect(6, b - 1, 17, b, STEEL);
        c.rect(18, b - 4, 27, b, SHEET);
        c.row(b - 4, 18, 27, L(SHEET));
        c.col(21, b - 3, b - 1, REDC);
        c.col(24, b - 3, b - 1, STD);
        return;
      }
      c.rect(1, 2, 10, 11, SHEET);
      c.frame(1, 2, 10, 11, STD);
      c.rect(3, 4, 8, 5, REDC); // WARD CLOSED
      c.row(7, 3, 8, STD);
      c.row(9, 3, 6, STD);
      c.rect(5, 12, 6, b - 2, STEEL);
      c.rect(2, b - 1, 9, b, STD);
      c.row(b - 1, 2, 9, STEEL);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 4, 8, b, STD);
        c.row(b - 4, 1, 8, STEEL);
        c.rect(3, b - 2, 6, b - 1, STEEL);
        return;
      }
      c.rect(3, 2, 4, 11, SHEET);
      c.col(4, 2, 11, STD);
      c.rect(3, 12, 4, b - 2, STEEL);
      c.rect(1, b - 1, 6, b, STD);
    };
    add('hospital-ward-sign-stand', 'ward closed sign on stand notice silence visitors pedestal', false, { m: [12, 28, front], mu: [29, 7], s: [8, 28, side], su: [10, 7] });
  }
  {
    const vase = (side) => (c, u) => {
      const b = c.h - 2,
        m = side ? 3 : 4,
        stem = hex('#5a6a3c'),
        dead = hex('#7a5a3c');
      c.rect(m - 1, b - 5, m + 1, b, C.glass);
      c.col(m - 1, b - 5, b, C.glassLight);
      c.rect(m - 1, b - 2, m + 1, b, hex('#6a7a5a')); // green water
      if (u) {
        c.col(m, b - 9, b - 6, dead); // nothing but stalks
        c.line(m - 1, b - 6, m - 2, b - 8, dead);
        c.line(m + 1, b - 6, m + 3, b - 7, dead);
        dots(c, hex('#8a5a4a'), [m + 3, b, m - 2, b, m + 4, b - 1 + 1, m + 2, b]); // petals on the table
        if (!side) c.rect(7, b, 10, b, SHEET); // the card face down
      } else {
        c.col(m, b - 10, b - 6, stem);
        c.line(m - 1, b - 6, m - 2, b - 10, stem);
        c.line(m + 1, b - 6, m + 3, b - 8, stem);
        c.rect(m - 1, b - 12, m, b - 11, hex('#a8697a'));
        c.rect(m - 3, b - 11, m - 2, b - 10, hex('#b8a05a'));
        c.rect(m + 3, b - 8, m + 4, b - 7, hex('#8a5a4a')); // one already hanging its head
        c.set(m + 4, b - 6, hex('#8a5a4a'));
        if (!side) {
          c.rect(7, b - 4, 10, b, SHEET); // get well soon
          c.set(8, b - 2, REDC);
          c.set(9, b - 3, REDC);
        } else c.col(7, b - 4, b, SHEET);
      }
    };
    add('hospital-flowers-wilted', 'flowers in a vase wilted get well card bedside visitors', false, { m: [12, 15, vase(false)], s: [9, 15, vase(true)] });
  }
};
