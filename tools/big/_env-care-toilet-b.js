/* Toilets and bathrooms, second half: what hangs on the walls, the cleaner's things and the bathroom at home. See env-care.js. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, T, add) => {
  const { D, L, dots, panel, caster, puddle, cabS, doorOpenF, doorOpenS, folds } = T;
  const { SHEET, FOLD, STEEL, STL, STD, ID, BLK, YEL, BLOOD, IN, PAPER, WAT, WATD, PORC, PORD, TILE, GRIME } = T;
  const ENAMEL = hex('#cfd0c2'),
    WOODP = hex('#7a5a40'),
    WICK = hex('#a8904e'),
    REDM = hex('#8c3a34'),
    TOWEL = hex('#8a9aa0'),
    PINKT = hex('#b08a90'),
    MIRROR = hex('#6f8a90'),
    COPPER = hex('#9a6a44'),
    GALV = hex('#8a9096');

  /* ---------- on the walls ---------- */
  {
    const front = (c, u) => {
      c.rect(1, 1, 8, 9, ENAMEL);
      c.row(1, 1, 8, L(ENAMEL));
      c.col(1, 1, 9, L(ENAMEL));
      c.row(9, 1, 8, D(ENAMEL));
      c.oval(3, 3, 6, 6, STL); // the big button
      c.set(4, 4, L(STL));
      c.rect(3, 10, 6, 10, STD); // nozzle
      c.set(8, 2, u ? C.red : hex('#5a2a2a'));
      if (u) for (let y = 11; y < 17; y++) for (let x = 2; x <= 7; x++) if ((x + y * 2) % 4 === 0) c.set(x, y, hex('#c4ccc4')); // roaring away at nobody
    };
    const side = (c, u) => {
      c.rect(1, 1, 5, 9, ENAMEL);
      c.row(1, 1, 5, L(ENAMEL));
      c.col(5, 2, 9, D(ENAMEL));
      c.set(6, 4, STL);
      c.rect(3, 10, 5, 10, STD);
      if (u) for (let y = 11; y < 17; y++) for (let x = 2; x <= 6; x++) if ((x + y * 2) % 4 === 0) c.set(x, y, hex('#c4ccc4'));
    };
    add('wc-hand-dryer', 'hand dryer hot air wall blower white enamel public toilet', false, { m: [10, 19, front], s: [8, 19, side] });
  }
  {
    const front = (c, u) => {
      c.rect(1, 1, 8, 11, STEEL);
      c.row(1, 1, 8, STL);
      c.col(1, 1, 11, STL);
      c.row(11, 1, 8, STD);
      c.rect(3, 3, 6, 5, hex('#55606a')); // window: how many are left
      c.rect(3, u ? 5 : 3, 6, 5, SHEET);
      c.rect(2, 12, 7, 12, IN);
      if (u) {
        c.rect(3, 12, 6, 22, SHEET); // somebody pulled, and went on pulling
        for (let y = 15; y < 22; y += 3) c.row(y, 3, 6, FOLD);
        c.rect(2, 23, 8, 24, SHEET);
        c.row(24, 2, 8, FOLD);
        c.set(5, 19, BLOOD);
        c.set(4, 20, BLOOD);
      } else c.rect(3, 12, 6, 13, SHEET);
    };
    const side = (c, u) => {
      c.rect(1, 1, 5, 11, STEEL);
      c.row(1, 1, 5, STL);
      c.col(5, 2, 11, STD);
      if (u) {
        c.col(4, 12, 22, SHEET);
        c.rect(3, 23, 6, 24, SHEET);
      } else c.rect(4, 12, 4, 13, SHEET);
    };
    add('wc-towel-dispenser', 'paper towel dispenser steel wall box hand towels washroom', false, { m: [10, 26, front], s: [8, 26, side] });
  }
  {
    const front = (c, u) => {
      c.rect(1, 1, 10, 7, ENAMEL);
      c.row(1, 1, 10, L(ENAMEL));
      c.col(1, 1, 7, L(ENAMEL));
      c.row(7, 1, 10, D(ENAMEL));
      c.rect(3, 3, 8, 4, hex('#3a4a6a')); // maker's plate
      const y1 = u ? 20 : 13;
      c.rect(2, 8, 9, y1, SHEET); // the loop of towel
      c.col(2, 8, y1, L(SHEET));
      folds(c, 4, 8, 9, y1, FOLD, 3);
      c.row(y1, 2, 9, FOLD);
      c.col(5, 8, y1, hex('#5a7a9a')); // its blue stripe
      if (u) {
        c.rect(3, 13, 8, 17, hex('#8a8a7a')); // dragged down, grey with use
        dots(c, BLOOD, [4, 14, 5, 15, 6, 14, 7, 16, 4, 16]); // and somebody's hand
      } else dots(c, GRIME, [3, 11, 7, 12]);
    };
    const side = (c, u) => {
      c.rect(1, 1, 5, 7, ENAMEL);
      c.row(1, 1, 5, L(ENAMEL));
      c.col(5, 2, 7, D(ENAMEL));
      const y1 = u ? 20 : 13;
      c.col(3, 8, y1, SHEET);
      c.col(5, 8, y1, FOLD);
      c.set(4, y1, FOLD);
      if (u) c.set(5, 15, BLOOD);
    };
    add('wc-roller-towel', 'roller towel cabinet cloth loop wall washroom', false, { m: [12, 22, front], s: [7, 22, side] });
  }
  {
    const front = (c, u) => {
      c.rect(1, 1, 24, 13, MIRROR);
      c.frame(1, 1, 24, 13, STD);
      c.row(1, 1, 24, STL);
      for (let i = 0; i < 4; i++) c.line(3 + i * 6, 3, 5 + i * 6, 5, C.glassLight);
      c.speckle(2, 9, 23, 12, hex('#4f5f66'), 5, 4); // the silvering gone along the bottom
      c.line(14, 2, 17, 7, BLK); // one crack already
      c.line(17, 7, 16, 12, BLK);
      c.rect(1, 14, 24, 14, STL); // shelf
      if (u) {
        c.poly([[13, 3], [19, 4], [20, 9], [16, 11], [12, 8]], IN); // a fist has been through it
        for (const [x, y] of [[7, 2], [22, 2], [23, 11], [9, 12], [4, 9]]) c.line(16, 7, x, y, BLK);
        dots(c, C.glassLight, [11, 6, 21, 6, 15, 12, 18, 2]);
        dots(c, BLOOD, [14, 8, 15, 9, 18, 10, 16, 13]);
        dots(c, C.glassLight, [10, 14, 13, 14, 17, 14, 20, 14]); // splinters on the shelf
        c.col(17, 15, 16, BLOOD);
      }
    };
    const side = (c, u) => {
      c.rect(1, 1, 2, 13, STD);
      c.col(2, 1, 13, u ? IN : MIRROR);
      c.rect(1, 14, 3, 14, STL);
      if (u) {
        dots(c, C.glassLight, [3, 5, 4, 14, 3, 9]);
        c.set(3, 15, BLOOD);
      }
    };
    add('wc-mirror-cracked', 'long washroom mirror cracked glass over the basins smashed', false, { m: [26, 18, front], s: [6, 18, side] });
  }
  {
    const col = hex('#8a8f8c');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 1, 11, b - 3, col);
      c.row(1, 1, 11, L(col));
      c.col(1, 1, b - 3, L(col));
      c.row(b - 3, 1, 11, D(col));
      for (const x of [2, 7]) {
        c.rect(x, 3, x + 3, 9, x < 5 ? hex('#8c3a34') : hex('#3a4a6a')); // two columns: two kinds of trouble
        c.rect(x + 1, 4, x + 2, 5, SHEET);
        c.row(7, x + 1, x + 2, hex('#c9b98a'));
        c.rect(x + 1, 11, x + 2, 11, BLK); // coin slot
        c.set(x + 3, 12, STL);
        if (u && x === 7) continue;
        c.rect(x, 14, x + 3, 16, D(col)); // drawer
        c.row(15, x + 1, x + 2, STL);
      }
      if (u) {
        c.rect(7, 14, 10, 15, IN);
        c.rect(6, 16, 11, 18, L(col)); // one drawer wrenched out and hanging
        c.row(18, 6, 11, D(col));
        c.rect(8, 19, 9, 19, SHEET);
        c.line(3, 4, 5, 8, BLK); // and the front kicked
        c.rect(8, b, 10, b, hex('#3a4a6a')); // a packet on the floor
        dots(c, STL, [4, b, 12, b]);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 1, 5, b - 3, col);
      c.row(1, 1, 5, L(col));
      c.col(5, 2, b - 3, D(col));
      if (u) {
        c.rect(6, 16, 8, 18, L(col));
        c.rect(7, b, 9, b, hex('#3a4a6a'));
      } else dots(c, STL, [6, 12, 6, 15]);
    };
    add('wc-vending-wall', 'toilet vending machine wall condoms tampons coin drawers steel', false, { m: [13, 24, front], mu: [15, 24], s: [8, 24, side], su: [11, 24] });
  }
  {
    const front = (c, u) => {
      c.rect(1, 1, 6, 5, STEEL);
      c.row(1, 1, 6, STL);
      c.rect(2, 6, 5, 6, STD);
      c.rect(2, 7, 5, u ? 20 : 9, SHEET); // the roll's tail
      if (u) {
        for (let y = 10; y < 20; y += 3) c.row(y, 2, 5, FOLD);
        c.rect(1, 21, 7, 22, SHEET); // all of it, in a heap
        c.row(22, 1, 7, FOLD);
        c.set(3, 20, SHEET);
      } else c.row(9, 2, 5, FOLD);
    };
    const side = (c, u) => {
      c.rect(1, 1, 4, 5, STEEL);
      c.row(1, 1, 4, STL);
      c.oval(1, 2, 4, 5, SHEET);
      c.set(2, 3, PAPER);
      c.col(4, 6, u ? 20 : 9, SHEET);
      if (u) c.rect(2, 21, 6, 22, SHEET);
    };
    add('wc-toilet-roll-holder', 'toilet roll holder paper on the wall loo roll', false, { m: [9, 24, front], s: [8, 24, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 18, 2, STD); // the wall rail
      c.col(4, 2, b, COPPER);
      c.col(5, 2, b, D(COPPER));
      c.col(14, 6, b, STEEL);
      c.row(12, 5, 14, COPPER);
      c.row(13, 5, 14, D(COPPER));
      c.rect(8, 10, 11, 15, hex('#7a3a34')); // the stopcock's wheel
      c.rect(9, 11, 10, 14, hex('#5a2a2a'));
      c.row(9, 7, 12, hex('#7a3a34'));
      c.rect(13, 4, 16, 7, SHEET); // gauge
      c.set(u ? 15 : 14, 5, C.red);
      c.set(14, 6, BLK);
      for (const y of [7, 20]) c.rect(3, y, 6, y, C.brass); // joints
      dots(c, hex('#5f8a6a'), [4, 9, 5, 22, 4, 16]);
      if (u) {
        for (const [x, y] of [[7, 19], [8, 18], [9, 17], [10, 17], [11, 18], [12, 20], [8, 20], [9, 21], [10, 23], [7, 22], [11, 21], [13, 23]]) c.set(x, y, (x + y) % 2 ? WAT : L(WAT)); // the joint gives
        c.rect(6, 20, 6, 20, WAT);
        puddle(c, 4, 16, b, WATD);
      } else c.set(5, 21, WAT); // a bead of water that never falls
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 1, b, STD);
      c.col(3, 2, b, COPPER);
      c.set(2, 7, C.brass);
      c.set(2, 20, C.brass);
      c.rect(4, 10, 5, 15, hex('#7a3a34'));
      if (u) {
        for (const [x, y] of [[4, 19], [5, 18], [6, 18], [7, 19], [8, 21], [6, 21], [9, 23]]) c.set(x, y, (x + y) % 2 ? WAT : L(WAT));
        puddle(c, 2, 9, b, WATD);
      }
    };
    add('wc-pipes-stopcock', 'wall pipes stopcock valve wheel gauge copper plumbing leak', false, { m: [20, 30, front], s: [7, 30, side], su: [12, 30] });
  }

  /* ---------- bins and signs ---------- */
  {
    const bin = (side) => (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 8, 7, b, hex('#8f9a94'));
      c.col(1, b - 8, b, L(hex('#8f9a94')));
      c.row(b, 1, 7, D(hex('#8f9a94')));
      if (!side) {
        c.rect(3, b - 5, 5, b - 3, SHEET);
        c.set(4, b - 4, REDM);
      } else c.rect(8, b, 9, b, STD);
      if (u) {
        c.line(1, b - 9, side ? 1 : 2, b - 13, hex('#6a7570'));
        c.rect(2, b - 10, 6, b - 9, SHEET); // more than it was meant to hold
        c.set(4, b - 11, SHEET);
        c.set(3, b - 9, BLOOD);
        c.set(7, b - 9, SHEET);
      } else {
        c.rect(1, b - 10, 7, b - 9, hex('#6a7570'));
        c.row(b - 10, 1, 7, hex('#8a9590'));
      }
    };
    add('wc-sanitary-bin', 'sanitary bin small grey pedal bin ladies cubicle', false, { m: [9, 16, bin(false)], s: [11, 16, bin(true)] });
  }
  {
    const col = hex('#5a6a60');
    const bin = (side) => (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 12, 9, b, col);
      c.col(1, b - 12, b, L(col));
      c.row(b, 1, 9, D(D(col)));
      c.poly([[1, b - 13], [2, b - 16], [8, b - 16], [9, b - 13]], D(col));
      c.rect(side ? 2 : 3, b - 15, side ? 3 : 7, b - 14, u ? IN : mix(col, 1.15)); // the flap
      c.rect(3, b - 8, 7, b - 6, SHEET);
      c.row(b - 7, 4, 6, col);
      if (u) {
        c.rect(3, b - 17, 7, b - 15, SHEET); // crammed, the flap wedged open
        c.rect(4, b - 18, 6, b - 18, FOLD);
        c.rect(10, b - 1, 13, b, SHEET); // and round its feet
        c.set(11, b - 2, FOLD);
        c.rect(14, b, 15, b, PAPER);
        c.set(12, b, hex('#7a6a4a'));
      }
    };
    add('wc-bin-swing-lid', 'swing lid bin paper towels washroom rubbish bin green', false, { m: [11, 20, bin(false)], mu: [17, 21], s: [11, 20, bin(true)], su: [17, 21] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 2, 16, b - 1, YEL); // flat on its face in what it warned of
        c.row(b - 2, 1, 16, L(YEL));
        c.rect(6, b - 2, 7, b - 2, BLK);
        puddle(c, 1, 18, b, WATD);
        return;
      }
      c.poly([[3, 1], [6, 1], [8, b], [1, b]], YEL);
      c.line(3, 1, 1, b, L(YEL));
      c.rect(3, 1, 6, 1, D(YEL));
      c.rect(4, 4, 5, 7, BLK); // !
      c.rect(4, 9, 5, 9, BLK);
      c.rect(3, b - 4, 6, b - 3, BLK); // a little man falling over
      c.clear(4, b);
      c.clear(5, b);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 2, 9, b - 1, YEL);
        c.row(b - 2, 1, 9, L(YEL));
        puddle(c, 1, 10, b, WATD);
        return;
      }
      c.line(4, 1, 1, b, YEL);
      c.line(5, 1, 8, b, D(YEL));
      c.line(4, 2, 2, b, YEL);
      c.rect(4, 1, 5, 1, D(YEL));
      c.row(b - 5, 3, 6, STD);
    };
    add('wc-wet-floor-sign', 'wet floor sign yellow caution a-board cleaning in progress', false, { m: [10, 16, front], mu: [20, 5], s: [10, 16, side], su: [12, 5] });
  }
  {
    const brush = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 5, 5, b, PORC);
      c.col(1, b - 5, b, L(PORC));
      c.row(b, 1, 5, PORD);
      c.row(b - 5, 1, 5, PORD);
      if (u) {
        c.rect(2, b - 5, 4, b - 5, IN);
        c.rect(7, b - 1, 15, b - 1, ENAMEL); // lying where it was dropped
        c.rect(15, b - 3, 17, b, hex('#8a8a7a'));
        dots(c, hex('#6a5a34'), [16, b - 2, 17, b, 15, b]);
        c.row(b, 12, 18, hex('#5a5a3c'));
      } else {
        c.col(3, b - 13, b - 6, ENAMEL);
        c.rect(2, b - 14, 4, b - 14, ENAMEL);
      }
    };
    add('wc-toilet-brush-holder', 'toilet brush in holder lavatory brush white', false, { m: [7, 17, brush], mu: [20, 17], s: [7, 17, brush], su: [20, 17] });
  }
  /** A galvanised bucket standing on b, 8 wide from x. */
  function bucket(c, x, b, col = GALV, fill) {
    c.poly([[x, b - 7], [x + 7, b - 7], [x + 6, b], [x + 1, b]], col);
    c.line(x, b - 7, x + 1, b, L(col));
    c.row(b - 7, x, x + 7, L(col));
    c.row(b - 4, x + 1, x + 6, D(col));
    c.row(b, x + 1, x + 6, D(col));
    if (fill) c.rect(x + 1, b - 7, x + 6, b - 7, fill);
  }
  {
    const pb = (side) => (c, u) => {
      const b = c.h - 2;
      bucket(c, 1, b, GALV, u ? hex('#5a5a3c') : null);
      if (!side) {
        c.line(1, b - 8, 4, b - 10, STD); // the handle up
        c.line(5, b - 10, 8, b - 8, STD);
      } else c.set(8, b - 6, STD);
      if (u) {
        c.rect(11, b - 3, 14, b, REDM); // the plunger out, standing in its own wet
        c.rect(10, b, 15, b, D(REDM));
        c.col(12, b - 14, b - 4, WOODP);
        c.col(13, b - 14, b - 4, D(WOODP));
        puddle(c, 8, 17, b, hex('#5a5a3c'));
        c.rect(11, b - 3, 14, b - 1, REDM);
      } else {
        c.col(4, b - 18, b - 8, WOODP);
        c.col(5, b - 18, b - 8, D(WOODP));
        c.rect(3, b - 8, 6, b - 7, REDM);
      }
    };
    add('wc-plunger-bucket', 'plunger standing in a tin bucket red rubber blocked drain', false, { m: [10, 21, pb(false)], mu: [19, 21], s: [10, 21, pb(true)], su: [19, 21] });
  }
  {
    const tin = (side) => (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.poly([[1, b - 6], [8, b - 7], [8, b], [1, b - 1]], GALV); // kicked over
        c.line(1, b - 6, 8, b - 7, L(GALV));
        c.col(5, b - 6, b - 1, D(GALV));
        c.col(8, b - 7, b, D(GALV));
        c.rect(9, b - 4, 9, b - 1, hex('#3a3a44'));
        c.rect(9, b, 18, b, hex('#6a6a5a')); // grey water going across the floor
        c.rect(10, b - 1, 14, b - 1, hex('#6a6a5a'));
        c.set(12, b - 1, hex('#8a8a7a'));
        c.rect(15, b - 1, 17, b, FOLD); // and the floor cloth
        return;
      }
      bucket(c, 1, b, GALV, hex('#6a6a5a'));
      if (side) c.set(8, b - 6, STD);
      else {
        c.line(1, b - 8, 3, b - 9, STD);
        c.line(6, b - 9, 8, b - 8, STD);
      }
      c.rect(side ? 5 : 6, b - 8, side ? 7 : 8, b - 7, FOLD); // a floor cloth over the rim
      c.col(side ? 7 : 8, b - 6, b - 4, FOLD);
    };
    add('wc-bucket-tin', 'tin bucket galvanised floor cloth grey water cleaners pail', false, { m: [10, 12, tin(false)], mu: [20, 10], s: [10, 12, tin(true)], su: [20, 10] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 10, 12, b - 2, YEL);
      c.col(1, b - 10, b - 2, L(YEL));
      c.row(b - 2, 1, 12, D(YEL));
      caster(c, 1, b);
      caster(c, 11, b);
      c.rect(7, b - 15, 12, b - 11, D(YEL)); // the wringer
      c.rect(8, b - 14, 11, b - 12, hex('#6a5a2a'));
      c.line(12, b - 15, 14, b - 21, STD); // its lever
      c.rect(14, b - 22, 15, b - 21, BLK);
      c.rect(3, b - 7, 6, b - 5, BLK); // CAUTION
      c.row(b - 6, 4, 5, YEL);
      c.rect(2, b - 10, 6, b - 10, u ? hex('#7a4a44') : hex('#6a7a7a'));
      if (u) {
        c.line(9, b - 16, 20, b - 1, WOODP); // the mop thrown down
        c.rect(19, b - 1, 24, b, FOLD);
        dots(c, hex('#7a4a44'), [20, b - 1, 22, b, 24, b - 1]); // what it has been mopping
        c.row(b, 16, 25, hex('#7a4a44'));
      } else {
        c.col(4, 2, b - 11, WOODP);
        c.col(5, 2, b - 11, D(WOODP));
        c.rect(3, b - 13, 6, b - 11, FOLD);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 10, 10, b - 2, YEL);
      c.col(1, b - 10, b - 2, L(YEL));
      c.row(b - 2, 1, 10, D(YEL));
      caster(c, 1, b);
      caster(c, 9, b);
      c.rect(2, b - 15, 9, b - 11, D(YEL));
      c.line(9, b - 15, 11, b - 21, STD);
      c.rect(11, b - 22, 12, b - 21, BLK);
      if (u) {
        c.rect(12, b - 1, 17, b, FOLD);
        c.row(b, 11, 18, hex('#7a4a44'));
        c.line(12, b - 2, 17, b - 6, WOODP);
      } else {
        c.col(5, 2, b - 16, WOODP);
        c.rect(4, b - 17, 6, b - 16, FOLD);
      }
    };
    add('wc-mop-wringer-bucket', 'mop bucket yellow wringer on wheels caution cleaner', false, { m: [17, 32, front], mu: [27, 32], s: [14, 32, side], su: [20, 32] });
  }
  {
    const roll = (c, x, y) => {
      c.rect(x, y, x + 2, y + 2, SHEET);
      c.col(x, y, y + 2, L(SHEET));
      c.set(x + 1, y + 1, hex('#8a7a5a'));
      c.row(y + 2, x, x + 2, FOLD);
    };
    const stack = (w) => (c, u) => {
      const b = c.h - 2,
        n = w > 10 ? 3 : 2;
      for (let i = 0; i < n; i++) roll(c, 1 + i * 4, b - 2);
      if (u) {
        roll(c, 3, b - 5);
        c.rect(w, b, w + 7, b, SHEET); // one has run away across the floor
        c.rect(w + 7, b - 2, w + 9, b, SHEET);
        c.set(w + 8, b - 1, hex('#8a7a5a'));
        dots(c, FOLD, [w + 2, b, w + 5, b]);
      } else {
        for (let i = 0; i < n - 1; i++) roll(c, 3 + i * 4, b - 5);
        if (n > 2) roll(c, 5, b - 8);
      }
    };
    add('wc-toilet-rolls-stack', 'stack of toilet rolls spare loo paper pyramid', false, { m: [13, 12, stack(13)], mu: [24, 12], s: [9, 12, stack(9)], su: [20, 12] });
  }

  /* ---------- the bathroom at home ---------- */
  {
    const col = hex('#b9b29a');
    const front = (c, u) => {
      const b = c.h - 2,
        ox = c.w - 16;
      c.rect(ox + 1, 1, ox + 14, b, col);
      c.col(ox + 1, 1, b, L(col));
      c.row(1, ox + 1, ox + 14, L(col));
      if (u) {
        c.rect(ox + 2, 3, ox + 13, b - 1, IN);
        for (const y of [9, 16, 23]) {
          for (let x = ox + 2; x < ox + 14; x += 2) c.set(x, y, WOODP); // slatted shelves
          c.rect(ox + 3, y - 3, ox + 8, y - 1, y === 16 ? PINKT : SHEET); // towels, folded
          c.row(y - 2, ox + 3, ox + 8, y === 16 ? D(PINKT) : FOLD);
          c.rect(ox + 10, y - 2, ox + 12, y - 1, TOWEL);
        }
        c.rect(ox + 4, 26, ox + 11, b - 1, hex('#8a4a44')); // the tank at the bottom
        c.col(ox + 4, 26, b - 1, hex('#a85a54'));
        c.row(31, ox + 4, ox + 11, hex('#6a3a34'));
        dots(c, hex('#5a5560'), [ox + 12, 28, ox + 12, 30, ox + 3, 33]);
        c.rect(ox + 10, 13, ox + 12, 15, hex('#3a3a44')); // and something that is not a towel
        dots(c, hex('#c9c6a0'), [ox + 10, 14, ox + 12, 14]);
        doorOpenF(c, ox + 1, 3, b - 2, 5, col);
      } else {
        c.frame(ox + 2, 3, ox + 13, b - 1, D(col));
        for (let y = 5; y < 20; y += 2) c.row(y, ox + 4, ox + 11, D(col)); // louvres
        panel(c, ox + 4, 23, ox + 11, b - 3, col);
        c.set(ox + 12, 21, C.brass);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 1, 8, b, col);
      if (u) {
        doorOpenS(c, 9, 3, 17, b - 1, col);
        for (let y = 5; y < 20; y += 2) c.row(y, 11, 15, D(col));
      } else c.set(9, 21, C.brass);
    };
    add('bath-airing-cupboard', 'airing cupboard louvre door towels linen hot tank bathroom', true, { m: [16, 40, front], mu: [21, 40], s: [11, 40, side], su: [19, 40] });
  }
  {
    const basket = (side) => (c, u) => {
      const b = c.h - 2;
      c.poly([[2, b - 13], [10, b - 13], [9, b], [3, b]], WICK);
      for (let y = b - 12; y < b; y += 2) for (let x = 2 + (y % 4 ? 1 : 0); x < 10; x += 2) if (c.get(x, y)) c.set(x, y, D(WICK));
      c.line(2, b - 13, 3, b, L(WICK));
      c.row(b, 3, 9, D(WICK));
      if (u) {
        c.rect(2, b - 14, 10, b - 14, IN);
        c.rect(3, b - 16, 6, b - 14, hex('#565663')); // clothes dragged out over the rim
        c.rect(7, b - 15, 11, b - 14, SHEET);
        c.rect(10, b - 13, 11, b - 7, SHEET);
        dots(c, BLOOD, [10, b - 11, 11, b - 10, 10, b - 9]);
        if (!side) {
          c.oval(12, b - 2, 18, b, WICK); // the lid on the floor
          c.row(b - 2, 14, 16, L(WICK));
        } else c.rect(12, b - 1, 16, b, WICK);
      } else {
        c.rect(1, b - 15, 11, b - 14, WICK);
        c.row(b - 15, 1, 11, L(WICK));
        c.row(b - 14, 1, 11, D(WICK));
        c.rect(5, b - 16, 7, b - 16, D(WICK));
        c.set(side ? 11 : 9, b - 13, SHEET); // a cuff caught under the lid
      }
    };
    add('bath-laundry-basket-wicker', 'wicker laundry basket tall with lid dirty washing linen bin', false, { m: [13, 19, basket(false)], mu: [20, 19], s: [13, 19, basket(true)], su: [18, 19] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [2, 17]) {
        c.col(x, 2, b, STL);
        c.col(x + 1, 2, b, STD);
      }
      for (let y = 3; y < b - 2; y += 4) {
        c.row(y, 2, 18, STL);
        c.row(y + 1, 3, 17, STD);
      }
      c.rect(1, b - 2, 2, b - 1, C.brass); // valve
      if (u) {
        c.rect(6, b - 2, 16, b, PINKT); // the towel slid off in a heap
        c.row(b - 3, 8, 13, PINKT);
        dots(c, D(PINKT), [8, b - 1, 11, b - 2, 14, b]);
        dots(c, C.rust, [5, 7, 12, 11, 9, 15]);
      } else {
        c.rect(4, 3, 15, 15, PINKT);
        c.row(3, 4, 15, L(PINKT));
        folds(c, 6, 5, 15, 15, D(PINKT), 4);
        c.row(13, 4, 15, D(PINKT)); // its border
        c.rect(4, 16, 15, 16, D(PINKT));
        for (let x = 4; x < 16; x += 2) c.set(x, 17, PINKT); // fringe
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(2, 2, b, STL);
      c.col(3, 2, b, STD);
      for (let y = 3; y < b - 2; y += 4) c.set(1, y, STD);
      if (u) c.rect(4, b - 2, 8, b, PINKT);
      else {
        c.rect(1, 3, 4, 15, PINKT);
        c.col(4, 4, 16, D(PINKT));
        c.row(3, 1, 4, L(PINKT));
      }
    };
    add('bath-towel-radiator', 'heated towel rail ladder radiator chrome pink towel bathroom', false, { m: [21, 26, front], s: [6, 26, side], su: [10, 26] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 2, 11, b, hex('#8a9a9a'));
      c.row(b - 2, 1, 11, hex('#aab8b8'));
      c.row(b, 1, 11, hex('#5a6a6a'));
      c.rect(4, b - 3, 8, b - 3, SHEET); // the dial's hood
      c.rect(5, b - 2, 7, b - 2, SHEET);
      c.set(u ? 7 : 6, b - 2, C.red);
      if (u) {
        dots(c, WATD, [2, b - 3, 3, b - 3, 9, b - 3, 10, b - 3]); // two wet footprints
        dots(c, WATD, [13, b, 14, b, 16, b, 17, b]);
      } else c.rect(2, b - 1, 10, b - 1, hex('#6a7a7a')); // ribbed rubber
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 2, 9, b, hex('#8a9a9a'));
      c.row(b - 2, 1, 9, hex('#aab8b8'));
      c.row(b, 1, 9, hex('#5a6a6a'));
      c.rect(7, b - 3, 9, b - 3, SHEET);
      if (u) {
        dots(c, WATD, [2, b - 3, 3, b - 3, 4, b - 3]);
        dots(c, WATD, [11, b, 12, b]);
      } else c.rect(2, b - 1, 6, b - 1, hex('#6a7a7a'));
    };
    add('bath-scales-floor', 'bathroom scales floor weighing scale dial', false, { m: [13, 6, front], mu: [19, 6], s: [11, 6, side], su: [14, 6] });
  }
  {
    const WASH = [SHEET, hex('#565663'), PINKT, SHEET, TOWEL];
    const front = (c, u) => {
      const b = c.h - 2;
      for (const x of [2, 21]) c.col(x, 2, b, WOODP);
      for (const y of [3, 10, 17]) c.row(y, 2, 21, hex('#9a7a5a'));
      c.row(b - 1, 2, 21, D(WOODP));
      if (u) {
        c.rect(15, 4, 17, 8, WASH[0]); // one sock
        c.set(17, 9, WASH[0]);
        c.rect(5, b - 1, 12, b, WASH[1]); // the rest pulled down
        c.rect(8, b - 2, 14, b - 2, WASH[2]);
        dots(c, D(WASH[1]), [7, b, 10, b - 1]);
      } else {
        c.rect(4, 4, 9, 9, WASH[0]); // a vest
        c.clearRect(6, 4, 7, 4);
        c.rect(12, 4, 19, 8, WASH[1]);
        c.col(15, 5, 8, D(WASH[1]));
        c.rect(3, 11, 6, 15, WASH[2]);
        c.rect(8, 11, 10, 18, WASH[3]); // stockings
        c.rect(12, 11, 14, 19, WASH[3]);
        c.set(10, 19, WASH[3]);
        c.rect(16, 11, 20, 14, WASH[4]);
        c.rect(5, 18, 18, 21, SHEET); // a sheet over the bottom rail
        folds(c, 7, 18, 18, 21, FOLD, 4);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.line(6, 2, 2, b, WOODP);
      c.line(6, 2, 10, b, WOODP);
      c.row(b - 6, 4, 8, D(WOODP));
      dots(c, hex('#9a7a5a'), [5, 3, 7, 3, 4, 10, 8, 10, 3, 17, 9, 17]);
      if (u) c.rect(5, b - 1, 12, b, WASH[1]);
      else {
        c.col(5, 4, 9, WASH[0]);
        c.col(8, 4, 8, WASH[1]);
        c.col(3, 11, 16, WASH[2]);
        c.col(9, 11, 19, WASH[3]);
        c.col(2, 18, 21, SHEET);
        c.col(10, 18, 21, SHEET);
      }
    };
    add('bath-clothes-horse', 'clothes horse wooden airer washing drying stockings vest bathroom', false, { m: [24, 26, front], s: [13, 26, side], su: [14, 26] });
  }
  {
    const stool = (side) => (c, u) => {
      const b = c.h - 2,
        w = side ? 8 : 9;
      c.rect(1, b - 8, w, b - 7, hex('#a07a4e')); // cork top
      c.row(b - 8, 1, w, hex('#b99466'));
      c.rect(1, b - 6, w, b - 6, ENAMEL);
      c.col(2, b - 5, b, ENAMEL);
      c.col(w - 1, b - 5, b, D(ENAMEL));
      c.row(b - 3, 3, w - 2, D(ENAMEL));
      if (u) {
        c.rect(w + 1, b - 1, w + 6, b, TOWEL); // the towel dropped, wet
        c.row(b - 2, w + 2, w + 4, TOWEL);
        dots(c, D(TOWEL), [w + 3, b - 1, w + 5, b]);
        dots(c, WATD, [3, b - 9, 6, b - 9]);
        c.rect(2, b - 9, 3, b - 9, C.gold); // a ring left on the cork
      } else {
        c.rect(2, b - 11, w - 1, b - 9, TOWEL); // towel and clean clothes, folded ready
        c.row(b - 10, 2, w - 1, D(TOWEL));
        c.rect(2, b - 13, w - 2, b - 12, SHEET);
        c.row(b - 12, 2, w - 2, FOLD);
      }
    };
    add('bath-stool-cork', 'bathroom stool cork top white folded towel clothes', false, { m: [11, 16, stool(false)], mu: [18, 16], s: [10, 16, stool(true)], su: [17, 16] });
  }
  {
    const MARB = hex('#c4c2b8'),
      WO = hex('#5a3f30');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 12, 17, b - 1, WO);
      c.col(2, b - 12, b - 1, L(WO));
      c.frame(4, b - 10, 15, b - 3, D(WO));
      c.col(9, b - 10, b - 3, D(WO));
      dots(c, C.brass, [8, b - 6, 11, b - 6]);
      c.rect(2, b, 3, b, D(WO));
      c.rect(16, b, 17, b, D(WO));
      c.rect(1, b - 14, 18, b - 13, MARB);
      c.row(b - 14, 1, 18, L(MARB));
      dots(c, hex('#9a988e'), [4, b - 13, 9, b - 14, 14, b - 13]);
      c.rect(2, b - 20, 17, b - 15, TILE); // tiled splashback
      c.row(b - 20, 2, 17, L(TILE));
      for (let x = 6; x < 17; x += 4) c.col(x, b - 19, b - 15, D(TILE));
      c.rect(8, b - 16, 16, b - 15, PORC); // the bowl
      c.row(b - 16, 8, 16, L(PORC));
      c.rect(9, b - 15, 15, b - 15, PORD);
      if (u) {
        c.rect(9, b - 16, 15, b - 16, hex('#a97a74')); // pink water left in it
        c.rect(3, b - 16, 7, b - 15, PORC); // the jug on its side
        c.set(8, b - 15, PORC);
        c.rect(16, b - 15, 18, b - 9, hex('#b9aaa0')); // a flannel wrung out and hung over the edge
        dots(c, BLOOD, [17, b - 12, 16, b - 10]);
      } else {
        c.rect(3, b - 19, 6, b - 15, PORC); // the jug
        c.col(3, b - 19, b - 15, L(PORC));
        c.set(2, b - 19, PORC);
        c.col(7, b - 18, b - 16, PORD);
        c.rect(4, b - 17, 5, b - 17, hex('#5a7a9a')); // a blue band
        c.rect(13, b - 17, 14, b - 17, hex('#b99a9a')); // soap
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 12, 10, b - 1, WO);
      c.rect(2, b, 3, b, D(WO));
      c.rect(9, b, 10, b, D(WO));
      c.rect(1, b - 14, 11, b - 13, MARB);
      c.row(b - 14, 1, 11, L(MARB));
      c.rect(1, b - 20, 2, b - 15, TILE);
      c.rect(4, b - 16, 10, b - 15, PORC);
      c.row(b - 16, 4, 10, u ? hex('#a97a74') : L(PORC));
      if (u) {
        c.col(11, b - 15, b - 9, hex('#b9aaa0'));
        c.set(11, b - 11, BLOOD);
      } else {
        c.rect(5, b - 19, 8, b - 16, PORC);
        c.set(9, b - 18, PORD);
      }
    };
    add('bath-washstand-jug', 'washstand marble top jug and bowl tiled back old bedroom bathroom', true, { m: [20, 23, front], s: [13, 23, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(8, b - 17, 14, b - 12, WOODP); // the attendant's chair, behind
      c.col(8, b - 17, b, D(WOODP));
      c.col(14, b - 17, b, D(WOODP));
      for (const x of [10, 12]) c.col(x, b - 16, b - 12, D(WOODP));
      c.rect(1, b - 11, 20, b - 10, SHEET); // a cloth on a card table
      c.row(b - 11, 1, 20, L(SHEET));
      c.rect(2, b - 9, 19, b - 7, SHEET);
      for (let x = 3; x < 19; x += 2) c.clear(x, b - 7);
      c.col(3, b - 9, b, ID);
      c.col(18, b - 9, b, ID);
      c.rect(14, b - 14, 18, b - 12, TOWEL); // hand towels
      c.row(b - 13, 14, 18, D(TOWEL));
      c.rect(11, b - 13, 12, b - 12, hex('#5a8a9a')); // scent
      c.set(11, b - 14, C.gold);
      if (u) {
        c.rect(4, b - 12, 8, b - 12, D(PORC)); // the saucer upside down, not a coin left
        c.row(b - 13, 5, 7, PORC);
        dots(c, C.gold, [22, b]);
        c.rect(1, b - 13, 3, b - 12, PAPER); // BACK IN 5 MINS
        c.set(2, b - 13, STD);
      } else {
        c.rect(3, b - 12, 9, b - 12, PORC); // a saucer of pennies
        dots(c, hex('#9a6a44'), [4, b - 13, 6, b - 13, 7, b - 13]);
        c.set(5, b - 13, C.gold);
        c.set(8, b - 13, STL);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 17, 2, b, WOODP);
      c.rect(1, b - 8, 6, b - 7, WOODP);
      c.col(6, b - 6, b, D(WOODP));
      c.rect(4, b - 11, 13, b - 10, SHEET);
      c.row(b - 11, 4, 13, L(SHEET));
      c.rect(5, b - 9, 12, b - 7, SHEET);
      c.col(6, b - 6, b, ID);
      c.col(11, b - 9, b, ID);
      c.rect(6, b - 14, 8, b - 12, TOWEL);
      if (u) c.rect(10, b - 12, 12, b - 12, D(PORC));
      else {
        c.rect(10, b - 12, 13, b - 12, PORC);
        c.set(11, b - 13, C.gold);
      }
    };
    add('wc-attendant-table', 'lavatory attendant table saucer of coins hand towels chair tips', true, { m: [22, 20, front], mu: [24, 20], s: [15, 20, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 1, 14, b - 1, C.glassLight); // a glass shelf on brackets
      c.set(2, b, STD);
      c.set(13, b, STD);
      if (u) {
        c.rect(2, b - 3, 5, b - 2, PORC); // the mug over, one brush on the floor somewhere
        c.set(6, b - 2, hex('#5a8a9a'));
        c.rect(10, b - 5, 11, b - 2, hex('#7a5a34'));
        c.set(10, b - 6, BLK);
        dots(c, SHEET, [7, b - 2, 8, b - 2, 12, b - 2]); // pills
        c.rect(13, b - 3, 14, b - 2, hex('#b9aaa0'));
      } else {
        c.rect(2, b - 5, 4, b - 2, PORC); // tooth mug: two brushes
        c.col(2, b - 5, b - 2, L(PORC));
        c.line(3, b - 6, 2, b - 8, hex('#5a8a9a'));
        c.line(4, b - 6, 5, b - 8, REDM);
        c.rect(6, b - 4, 7, b - 2, hex('#8a9a6a')); // bottles
        c.set(6, b - 5, SHEET);
        c.rect(9, b - 6, 10, b - 2, hex('#7a5a34'));
        c.set(9, b - 7, BLK);
        c.rect(12, b - 3, 13, b - 2, SHEET); // shaving soap, a razor across it
        c.row(b - 4, 11, 14, STL);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 1, 5, b - 1, C.glassLight);
      c.line(1, b, 3, b, STD);
      if (u) c.rect(2, b - 3, 4, b - 2, PORC);
      else {
        c.rect(2, b - 5, 4, b - 2, PORC);
        c.col(3, b - 8, b - 6, hex('#5a8a9a'));
      }
    };
    add('bath-shelf-toiletries', 'bathroom glass shelf tooth mug brushes bottles razor', false, { m: [16, 11, front], s: [7, 11, side] });
  }
};
