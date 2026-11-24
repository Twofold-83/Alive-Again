/* Nightmare, part 4: school, the dentist, the playground, the party, the street. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, thin, drip, pool, bars, ring, eyes, planks, shade } = H;
  const { NI, SHEET, SHEETD, PJ, SHADOW, SKIN, SICK, DWATER, WALLP, LINO, SCREEN, CARP } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    STL = hex('#b0b3ba'),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    BR = C.brass,
    EYE = hex('#e8e4d0'),
    GLASSD = hex('#1c2430'),
    GLASSL = hex('#51627a'),
    LAMP = hex('#d8cf8a'),
    PAPER = C.paper,
    PALE = hex('#a8a090'),
    LOCK = hex('#5d6e68'),
    LOCKL = hex('#788a82'),
    LOCKD = hex('#44524e'),
    RUSTY = C.rust;

  /* ---------- lockers ---------- */
  O('nightmare-lockers-school-row', 'row of school lockers dented grey green metal one of them is yours something inside', {
    w: 32,
    h: 40,
    f(c, u) {
      const b = 38;
      c.rect(2, 2, 29, b - 1, LOCK);
      c.row(2, 2, 29, LOCKL);
      c.rect(2, b, 29, b, LOCKD);
      for (let i = 0; i < 4; i++) {
        const x = 2 + i * 7;
        c.col(x, 2, b - 1, LOCKL);
        c.col(x + 6, 2, b - 1, LOCKD);
        if (u && i === 2) {
          c.rect(x + 1, 3, x + 5, b - 1, hex('#15131a'));
          c.row(10, x + 1, x + 5, LOCKD); // a shelf
          for (const xx of [x + 2, x + 3, x + 4]) c.col(xx, 11, 24 + ((xx * 3) % 5), hex('#2a2430')); // hair, hanging down from it
          c.rect(x + 1, b - 2, x + 2, b - 1, hex('#5a2a2e')); // small shoes
          c.rect(x + 4, b - 2, x + 5, b - 1, hex('#5a2a2e'));
          eyes(c, x + 2, 7, EYE, 2);
          continue;
        }
        for (const y of [5, 7, 9]) c.row(y, x + 2, x + 4, LOCKD);
        c.rect(x + 4, 20, x + 4, 22, ST);
        c.set(x + 2, 13, PAPER);
        c.set(x + 3, 13, PAPER);
      }
      dots(c, LOCKD, [5, 28, 6, 29, 5, 30, 25, 16, 26, 17]);
      dots(c, RUSTY, [3, 35, 4, 36, 10, 34, 27, 36, 26, 35]);
      if (u) {
        c.rect(23, 3, 24, b - 1, LOCK); // its door, edge on
        c.col(23, 3, b - 1, LOCKL);
      }
      return () => u && dots(c, hex('#2a2a26'), [17, b + 1 - 1, 19, b, 21, b]);
    },
    sw: 10,
    suw: 16,
    s(c, u) {
      const b = 38;
      c.rect(2, 2, 7, b - 1, LOCK);
      c.row(2, 2, 7, LOCKL);
      c.col(2, 2, b - 1, LOCKL);
      c.rect(2, b, 7, b, LOCKD);
      c.frame(3, 4, 6, b - 3, LOCKD);
      dots(c, RUSTY, [4, 34, 5, 35]);
      if (!u) c.rect(8, 20, 8, 22, ST);
      else {
        c.rect(8, 3, 13, b - 1, LOCK); // a door standing open
        c.col(8, 3, b - 1, LOCKD);
        for (const y of [5, 7, 9]) c.row(y, 10, 12, LOCKD);
        c.set(12, 21, ST);
        dots(c, hex('#2a2430'), [8, 14, 8, 18, 8, 22]);
      }
    },
  });

  /* ---------- the blackboard ---------- */
  O('nightmare-blackboard-lines', 'blackboard on a stand the same line written over and over chalk school punishment lines', {
    w: 36,
    h: 36,
    f(c, u) {
      const b = 34,
        BB = hex('#27332e'),
        CH = hex('#b9bdb0');
      c.line(6, 24, 3, b, W);
      c.line(29, 24, 32, b, W);
      c.rect(2, 2, 33, 24, W);
      c.row(2, 2, 33, WL);
      c.col(2, 2, 24, WL);
      c.rect(4, 4, 31, 22, BB);
      c.rect(3, 25, 32, 25, WL);
      c.rect(8, 24, 10, 24, C.white);
      if (!u) {
        for (let y = 6; y <= 20; y += 2) for (let x = 6; x <= 29; x++) if ((x * 7 + y) % 9 > 1 && x % 6 !== 5) c.set(x, y, (x + y) % 5 ? CH : hex('#8a9086'));
      } else {
        for (let y = 6; y <= 20; y += 2) for (let x = 6; x <= 29; x++) if ((x * 5 + y * 3) % 7 === 0) c.set(x, y, hex('#46524c')); // wiped
        for (let x = 6; x <= 29; x++) c.set(x, 8 + Math.round(Math.sin(x / 4) * 2), hex('#3d4943'));
        // one word left, large
        const R = CH;
        c.col(10, 11, 17, R);
        c.row(11, 10, 13, R);
        c.row(14, 10, 13, R);
        c.col(13, 11, 14, R);
        c.line(12, 15, 14, 17, R); // R
        c.col(16, 11, 17, R);
        c.col(19, 11, 17, R);
        c.row(17, 16, 19, R); // U
        c.col(21, 11, 17, R);
        c.line(21, 11, 25, 17, R);
        c.col(25, 11, 17, R); // N
        dots(c, hex('#8a9086'), [27, 19, 28, 20, 26, 18, 29, 21]);
      }
    },
    sw: 12,
    s(c, u) {
      const b = 34;
      c.line(6, 2, 4, 25, W);
      c.line(7, 2, 5, 25, WD);
      c.line(5, 4, 3, 22, hex('#27332e'));
      c.rect(2, 25, 4, 25, WL);
      c.line(4, 25, 2, b, W);
      c.line(6, 12, 10, b, WD);
      if (u) c.set(3, 24, C.white);
      return () => u && dots(c, hex('#b9bdb0'), [1, b, 3, b]);
    },
  });

  /* ---------- the dentist's chair ---------- */
  O('nightmare-dentist-chair', 'dentist chair reclining teal vinyl with a lamp on an arm and a tray of tools open wide', {
    w: 38,
    h: 38,
    base: 'side',
    f(c, u) {
      const b = 36,
        V = hex('#4a6a66'),
        VL = hex('#65857e');
      // the lamp
      c.col(4, 4, 30, ST);
      c.line(4, 4, 14, 3, ST);
      c.rect(13, 4, 19, 6, hex('#8a8c88'));
      c.row(4, 13, 19, STL);
      c.row(7, 14, 18, u ? hex('#f2ecc0') : hex('#77745a'));
      // the chair
      c.line(9, 12, 16, 22, V);
      for (let i = 0; i < 4; i++) c.line(8 + i, 13, 15 + i, 23, i === 0 ? VL : V);
      c.rect(8, 9, 12, 12, V);
      c.row(9, 8, 12, VL);
      c.rect(16, 22, 27, 25, V);
      c.row(22, 16, 27, VL);
      c.line(27, 23, 32, 29, V);
      c.line(27, 24, 32, 30, V);
      c.line(27, 25, 31, 30, D(V));
      c.rect(31, 29, 34, 30, ST);
      c.rect(19, 26, 23, 32, ST);
      c.col(19, 26, 32, STL);
      c.rect(14, 33, 28, b, hex('#5a5d62'));
      c.row(33, 14, 28, ST);
      c.rect(18, 19, 25, 20, hex('#8a8c88')); // arm rest
      // the tray
      c.col(30, 14, 22, ST);
      c.rect(27, 13, 35, 14, STL);
      dots(c, ST, [28, 12, 30, 12, 31, 12, 33, 12]);
      c.set(34, 12, hex('#77bfc0'));
      if (u) {
        for (const x of [12, 20, 24]) c.rect(x, x === 12 ? 15 : 21, x + 1, x === 12 ? 16 : 22, P.HIDE); // straps, done up
        dots(c, BR, [13, 15, 21, 21, 25, 21]);
        c.rect(28, 11, 29, 12, C.white); // a tooth on the tray
        c.set(28, 13, C.blood);
        c.clear(31, 12);
        c.clear(33, 12);
      }
      return () => {
        if (!u) return;
        for (let y = 8; y <= 13; y++) for (let x = 15 - ((y - 8) >> 1); x <= 17 + ((y - 8) >> 1); x++) if ((x + y) % 2 === 0) c.set(x, y, LAMP);
      };
    },
    sw: 20,
    s(c, u) {
      const b = 36,
        V = hex('#4a6a66'),
        VL = hex('#65857e');
      c.col(2, 4, 30, ST);
      c.rect(2, 3, 8, 4, ST);
      c.rect(6, 5, 12, 6, hex('#8a8c88'));
      c.row(7, 7, 11, u ? hex('#f2ecc0') : hex('#77745a'));
      c.rect(6, 10, 13, 22, V); // the back, coming at you
      c.row(10, 7, 12, VL);
      c.col(6, 11, 22, VL);
      c.rect(7, 8, 12, 10, V);
      c.rect(5, 22, 14, 26, V);
      c.row(22, 5, 14, VL);
      c.rect(6, 27, 13, 30, D(V));
      c.rect(4, 19, 5, 21, hex('#8a8c88'));
      c.rect(14, 19, 15, 21, hex('#8a8c88'));
      c.rect(8, 31, 11, 33, ST);
      c.rect(5, 34, 14, b, hex('#5a5d62'));
      c.row(34, 5, 14, ST);
      c.col(17, 14, 24, ST);
      c.rect(15, 13, 18, 14, STL);
      dots(c, ST, [16, 12, 17, 12]);
      if (u) {
        c.rect(6, 15, 13, 16, P.HIDE);
        c.set(9, 15, BR);
        c.rect(15, 11, 16, 12, C.white);
      }
      return () => {
        if (!u) return;
        for (let y = 8; y <= 12; y++) for (let x = 7; x <= 11; x++) if ((x + y) % 2 === 0) c.set(x, y, LAMP);
      };
    },
  });

  /* ---------- the screen ---------- */
  O('nightmare-screen-shadow-behind', 'hospital screen folding curtain on wheels pale green cloth a shadow moving behind it', {
    w: 30,
    h: 42,
    f(c, u) {
      const b = 40,
        CL = u ? hex('#a9b89c') : hex('#7f9080'),
        CD = u ? hex('#8fa084') : hex('#6a7a6c');
      for (let i = 0; i < 3; i++) {
        const x = 2 + i * 9;
        c.rect(x, 4, x + 7, 34, CL);
        for (let xx = x + 1; xx <= x + 7; xx += 2) c.col(xx, 5, 34, CD);
      }
      if (u) {
        // lit from behind: someone is standing there
        const S = hex('#3d4a3c');
        c.rect(12, 8, 16, 12, S);
        c.rect(10, 14, 18, 34, S);
        c.row(13, 12, 16, S);
        c.col(8, 14, 26, S);
        c.col(20, 14, 22, S);
        c.line(20, 22, 24, 14, S); // one arm raised
        dots(c, S, [23, 12, 24, 12, 25, 12, 23, 11, 25, 11, 24, 10, 7, 27, 8, 28, 9, 27]);
      }
      for (let i = 0; i < 3; i++) {
        const x = 2 + i * 9;
        c.frame(x - 1, 3, x + 8, 35, ST);
        c.col(x - 1, 3, b - 1, STL);
        c.col(x + 8, 3, b - 1, ST);
      }
      for (const x of [1, 10, 19, 28]) c.rect(x - 0, b - 1, x + (x === 28 ? 0 : 1), b, NI);
    },
    sw: 8,
    s(c, u) {
      const b = 40;
      c.rect(3, 3, 4, b - 1, ST);
      c.col(3, 3, b - 1, STL);
      c.col(5, 5, 34, u ? hex('#a9b89c') : hex('#7f9080'));
      c.rect(2, b - 1, 5, b, NI);
      return () => u && dots(c, hex('#3d4a3c'), [6, 12, 6, 13, 6, 22]);
    },
  });

  /* ---------- the swings ---------- */
  O('nightmare-swing-set-moving', 'playground swing set two swings rusty frame one of them swinging by itself', {
    w: 40,
    h: 42,
    f(c, u) {
      const b = 40,
        F = hex('#6a5d58'),
        FL = hex('#877a72');
      c.line(6, 3, 2, b, F);
      c.line(7, 3, 3, b, FL);
      c.line(33, 3, 37, b, F);
      c.line(32, 3, 36, b, D(F));
      c.rect(4, 2, 35, 3, F);
      c.row(2, 4, 35, FL);
      dots(c, RUSTY, [10, 3, 22, 3, 4, 20, 35, 26, 3, 32]);
      const swing = (x, dx) => {
        thin(c, x, 4, x + dx, 28 - Math.abs(dx >> 1), ST);
        thin(c, x + 7, 4, x + 7 + dx, 28 - Math.abs(dx >> 1), ST);
        const y = 29 - Math.abs(dx >> 1);
        c.rect(x + dx - 1, y, x + 8 + dx, y + 1, hex('#3a3440'));
        c.row(y, x + dx - 1, x + 8 + dx, hex('#56505c'));
      };
      swing(9, 0);
      swing(22, u ? 6 : 0);
      if (u) {
        c.rect(23, b - 1, 25, b, hex('#5a2a2e')); // a shoe under it
        c.set(26, b, hex('#5a2a2e'));
      }
      return () => u && dots(c, C.ash, [26, 30, 24, 33, 37, 20]);
    },
    sw: 24,
    s(c, u) {
      const b = 40,
        F = hex('#6a5d58'),
        FL = hex('#877a72');
      c.line(11, 2, 3, b, F);
      c.line(12, 2, 20, b, F);
      c.line(10, 2, 2, b, FL);
      c.line(13, 2, 21, b, D(F));
      c.row(26, 6, 17, F);
      c.rect(10, 2, 13, 3, FL);
      const dx = u ? 6 : 0;
      c.line(11, 4, 11 + dx, 28 - (dx >> 1), ST);
      c.rect(10 + dx, 29 - (dx >> 1), 12 + dx, 30 - (dx >> 1), hex('#3a3440'));
      if (u) c.rect(10, b - 1, 12, b, hex('#5a2a2e'));
    },
  });

  /* ---------- the slide ---------- */
  O('nightmare-slide-into-hole', 'playground slide that ends in a black hole in the ground ladder chute going down into the dark', {
    w: 46,
    h: 36,
    base: 'side',
    f(c, u) {
      const b = 34,
        F = hex('#6a5d58'),
        CH = hex('#8a8c88');
      c.oval(28, b - 5, 43, b, hex('#2a2630'));
      c.oval(30, b - 4, 41, b - 1, NI);
      for (const x of [3, 9]) {
        c.col(x, 4, b, F);
        c.set(x, 3, hex('#877a72'));
      }
      for (let y = 9; y < b; y += 4) c.row(y, 4, 8, D(F));
      c.rect(9, 9, 15, 10, F);
      c.col(15, 4, 9, F);
      c.row(4, 9, 15, F);
      c.col(14, 11, b, D(F));
      // the chute
      c.line(15, 9, 35, b - 3, CH);
      c.line(15, 10, 34, b - 2, CH);
      c.line(15, 11, 33, b - 2, D(CH));
      c.line(15, 7, 36, b - 5, STL);
      dots(c, RUSTY, [20, 15, 26, 21, 30, 25, 4, 20]);
      if (u) {
        c.rect(27, b - 6, 29, b - 5, hex('#5a2a2e')); // one small shoe, at the edge
        c.set(26, b - 5, hex('#5a2a2e'));
        dots(c, NI, [31, b - 7, 32, b - 6, 33, b - 7]); // marks down the last of it
        c.rect(40, b - 5, 41, b - 3, PALE); // and fingers on the rim
        c.set(42, b - 4, PALE);
      }
    },
    sw: 18,
    s(c, u) {
      const b = 34,
        F = hex('#6a5d58'),
        CH = hex('#8a8c88');
      for (const x of [3, 14]) c.col(x, 3, 12, F);
      c.row(3, 3, 14, F);
      c.poly([[6, 8], [11, 8], [14, b - 4], [3, b - 4]], CH);
      c.line(6, 8, 3, b - 4, STL);
      c.line(11, 8, 14, b - 4, D(CH));
      c.line(5, 8, 2, b - 4, F);
      c.line(12, 8, 15, b - 4, F);
      for (let y = 12; y < b - 5; y += 5) c.row(y, 7 - ((y - 8) >> 3), 10 + ((y - 8) >> 3), hex('#9c9e9a'));
      c.oval(2, b - 5, 15, b, hex('#2a2630'));
      c.oval(4, b - 4, 13, b - 1, NI);
      if (u) {
        c.rect(11, b - 7, 13, b - 6, hex('#5a2a2e'));
        c.rect(5, b - 5, 6, b - 3, PALE);
        c.set(7, b - 5, PALE);
      }
    },
  });

  /* ---------- jack in the box ---------- */
  function jack(c, u, side) {
    const b = c.h - 2,
      A = hex('#7a4a44'),
      Bc = hex('#3d5a66');
    c.rect(2, b - 10, 11, b, A);
    for (let x = 2; x <= 11; x++) if ((x >> 1) % 2) c.col(x, b - 10, b, Bc);
    c.row(b - 10, 2, 11, hex('#94625a'));
    c.row(b, 2, 11, D(A));
    if (side) {
      c.rect(6, b - 6, 7, b - 5, BR);
      c.line(7, b - 6, 9, b - 8, ST);
      c.set(10, b - 9, C.red);
    } else {
      c.rect(12, b - 6, 12, b - 5, ST);
      c.rect(13, b - 8, 13, b - 6, ST);
      c.set(13, b - 9, C.red);
      dots(c, BR, [6, b - 6, 7, b - 5, 6, b - 4, 7, b - 6]);
    }
    if (!u) {
      c.rect(1, b - 12, 12, b - 11, D(A));
      c.row(b - 12, 1, 12, A);
      c.rect(6, b - 11, 7, b - 10, BR);
      return;
    }
    c.rect(1, b - 20, 2, b - 11, D(A)); // the lid thrown back
    // far too much spring
    for (let y = b - 11; y >= 9; y--) c.set(6 + Math.round(Math.sin(y * 1.3) * 2), y, y % 2 ? ST : STL);
    for (let y = b - 11; y >= 9; y -= 2) c.set(7 + Math.round(Math.sin(y * 1.3) * 2), y, ST);
    c.rect(4, 4, 9, 9, hex('#d8d2c0'));
    c.row(3, 5, 8, hex('#d8d2c0'));
    dots(c, NI, side ? [8, 5] : [5, 5, 8, 5]);
    c.row(7, side ? 6 : 5, 8, C.red);
    dots(c, C.red, side ? [9, 6] : [4, 6, 9, 6]);
    c.poly([[4, 2], [6, 0 + 1], [9, 2]], Bc);
    c.set(6, 1, C.mustard);
    c.rect(3, 10, 10, 10, C.mustard);
  }
  O('nightmare-jack-in-the-box', 'jack in the box striped toy box with a crank the clown comes up on a spring that is far too long', {
    w: 15,
    h: 16,
    uh: 40,
    f: (c, u) => jack(c, u, false),
    sw: 15,
    suh: 40,
    s: (c, u) => jack(c, u, true),
  });

  /* ---------- the music box ---------- */
  function musicBox(c, u, x1, side) {
    const b = 28,
      m = (2 + x1) >> 1;
    c.rect(2, 16, x1, 17, W);
    c.row(16, 2, x1, WL);
    c.rect(m - 1, 18, m, b - 1, WD);
    c.rect(m - 4, b, m + 3, b, WD);
    c.rect(m - 3, b - 1, m + 2, b - 1, W);
    const BX = hex('#6b2332'),
      BXL = hex('#8a3a48');
    c.rect(m - 4, 11, m + 3, 15, BX);
    c.col(m - 4, 11, 15, BXL);
    dots(c, BR, [m - 1, 13, m, 13]);
    if (side) c.rect(m + 4, 12, m + 5, 13, BR);
    if (!u) {
      c.rect(m - 4, 9, m + 3, 10, BX);
      c.row(9, m - 4, m + 3, BXL);
    } else {
      c.rect(m - 4, 3, m + 3, 9, BX); // the lid up, a mirror in it
      c.rect(m - 3, 4, m + 2, 8, hex('#6f8388'));
      c.set(m - 2, 5, hex('#9ebcc2'));
      c.row(10, m - 3, m + 2, hex('#3a1420'));
      // the dancer turns
      c.set(m, 5, hex('#d8c8b0'));
      c.rect(m - 1, 7, m + 1, 7, C.white);
      c.set(m, 6, C.white);
      c.col(m, 8, 9, hex('#d8c8b0'));
      c.set(m - 1, 6, hex('#d8c8b0'));
      c.set(m + 1, 5, hex('#d8c8b0'));
    }
    return () => u && dots(c, PAPER, [m + 5, 6, m + 6, 3, m - 6, 5, m - 5, 2]);
  }
  O('nightmare-music-box-dancer', 'music box on a small table red box with a tiny dancer that turns tinkling tune', {
    w: 18,
    h: 30,
    f: (c, u) => musicBox(c, u, 15, false),
    sw: 16,
    s: (c, u) => musicBox(c, u, 13, true),
  });

  /* ---------- the birthday ---------- */
  function hat(c, x, y, col) {
    c.set(x + 1, y, C.white);
    c.rect(x + 1, y + 1, x + 1, y + 1, col);
    c.rect(x, y + 2, x + 2, y + 3, col);
    c.set(x, y + 3, L(col));
  }
  function balloon(c, x, y, col, popped) {
    if (popped) {
      c.set(x, y + 5, col);
      c.set(x + 1, y + 6, D(col));
      return;
    }
    c.oval(x - 2, y, x + 2, y + 5, col);
    c.set(x - 1, y + 1, L(col));
    c.set(x, y + 6, D(col));
  }
  O('nightmare-birthday-table-nobody', 'birthday table with a cake and candles party hats and balloons and no guests nobody came', {
    w: 36,
    h: 34,
    f(c, u) {
      const b = 32,
        CL = hex('#b9ae8e');
      balloon(c, 5, 2, hex('#8a4a44'), false);
      thin(c, 5, 9, 4, 19, hex('#8a8474'));
      balloon(c, 30, 4, hex('#4a6a66'), u);
      thin(c, 30, u ? 12 : 11, 31, 19, hex('#8a8474'));
      c.rect(2, 19, 33, 20, CL);
      c.row(19, 2, 33, hex('#d0c6a8'));
      c.rect(2, 21, 33, 25, CL);
      for (let x = 2; x <= 33; x += 4) c.rect(x, 21, x + 1, 25, hex('#a39878'));
      for (let x = 2; x <= 33; x += 2) c.set(x, 26, CL);
      for (const x of [4, 30]) c.rect(x, 26, x + 1, b, WD);
      // the cake
      c.rect(13, 14, 22, 18, hex('#d8d2c0'));
      c.row(14, 13, 22, C.white);
      c.row(16, 13, 22, hex('#a07a78'));
      c.rect(12, 18, 23, 18, C.white);
      for (const x of [14, 16, 18, 20]) {
        c.col(x, 11, 13, hex('#a07a78'));
        if (!u) c.set(x, 10, C.flameLight);
      }
      if (u) {
        c.rect(19, 14, 22, 17, NI); // a slice gone
        c.set(19, 17, hex('#5a3a2e'));
        c.row(18, 26, 28, ST); // the knife
        c.set(25, 18, WD);
      }
      hat(c, 6, 15, C.plum);
      u ? (c.rect(26, b - 1, 29, b, C.mustard), c.set(30, b, C.white)) : hat(c, 27, 15, C.mustard);
      c.row(18, 8, 10, C.white);
      return () => u && dots(c, C.ash, [14, 8, 17, 6, 20, 8, 16, 9]);
    },
    sw: 20,
    s(c, u) {
      const b = 32,
        CL = hex('#b9ae8e');
      balloon(c, 5, 2, hex('#8a4a44'), false);
      thin(c, 5, 9, 4, 19, hex('#8a8474'));
      c.rect(2, 19, 17, 20, CL);
      c.row(19, 2, 17, hex('#d0c6a8'));
      c.rect(2, 21, 17, 25, CL);
      for (let x = 2; x <= 17; x += 4) c.rect(x, 21, x + 1, 25, hex('#a39878'));
      for (let x = 2; x <= 17; x += 2) c.set(x, 26, CL);
      for (const x of [3, 15]) c.rect(x, 26, x + 1, b, WD);
      c.rect(6, 14, 13, 18, hex('#d8d2c0'));
      c.row(14, 6, 13, C.white);
      c.row(16, 6, 13, hex('#a07a78'));
      for (const x of [8, 11]) {
        c.col(x, 11, 13, hex('#a07a78'));
        if (!u) c.set(x, 10, C.flameLight);
      }
      if (u) c.rect(10, 14, 13, 17, NI);
      return () => u && dots(c, C.ash, [8, 8, 11, 7]);
    },
  });

  /* ---------- the balloon ---------- */
  function grateBalloon(c, u, side) {
    const b = 42,
      R = hex('#9a2f2a');
    c.rect(2, b - 2, 11, b, hex('#3a3a45'));
    c.row(b - 2, 2, 11, hex('#5a5a66'));
    for (const x of side ? [4, 6, 8] : [3, 5, 7, 9]) c.set(x, b - 1, NI);
    c.oval(3, 2, 10, 12, R);
    dots(c, hex('#c05a4a'), [5, 4, 4, 5, 5, 5]);
    c.set(7, 13, D(R));
    c.set(6, 13, R);
    thin(c, 6, 14, 6, u ? b - 6 : b - 2, hex('#b9b3a0'));
    if (u) {
      c.rect(5, b - 5, 7, b - 3, PALE); // a hand has come up to hold it
      c.set(8, b - 5, PALE);
      c.set(4, b - 4, PALE);
      c.rect(6, b - 2, 7, b - 2, PALE);
    }
  }
  O('nightmare-balloon-on-grate', 'red balloon tied to a drain grate in the floor floating on its string storm drain', {
    w: 14,
    h: 44,
    solid: false,
    f: (c, u) => grateBalloon(c, u, false),
    sw: 14,
    s: (c, u) => grateBalloon(c, u, true),
  });

  /* ---------- the phone box ---------- */
  O('nightmare-payphone-booth', 'phone booth telephone box in the street glass panels ringing in the night the receiver hanging', {
    w: 22,
    h: 48,
    uw: 28,
    f(c, u) {
      const b = 46,
        F = hex('#5a3230'),
        FL = hex('#7a4844'),
        G = u ? hex('#8f9670') : GLASSD;
      c.rect(2, 4, 19, b, F);
      c.col(2, 4, b, FL);
      c.rect(3, 2, 18, 4, FL);
      c.rect(6, 5, 15, 7, u ? LAMP : hex('#77745a'));
      c.rect(4, 9, 17, b - 3, G);
      for (const y of [18, 28]) c.row(y, 4, 17, F);
      for (const x of [8, 13]) c.col(x, 9, b - 3, F);
      // the telephone inside
      c.rect(9, 20, 12, 27, hex('#221f28'));
      c.set(10, 22, ST);
      c.set(11, 24, ST);
      if (!u) {
        c.rect(14, 20, 14, 26, hex('#221f28'));
        dots(c, GLASSL, [5, 10, 6, 10, 5, 11]);
      } else {
        for (let y = 26; y <= 35; y++) c.set(12 + (y % 2), y, hex('#3a3440'));
        c.rect(12, 36, 13, 41, hex('#221f28')); // off the hook, swinging
        // the door stands open
        c.rect(20, 5, 25, b, F);
        c.col(25, 5, b, hex('#3a2020'));
        c.rect(21, 9, 24, b - 3, hex('#3a4640'));
        for (const y of [18, 28]) c.row(y, 21, 24, F);
      }
      c.rect(2, b - 2, 19, b, F);
    },
    sw: 22,
    s(c, u) {
      const b = 46,
        F = hex('#5a3230'),
        FL = hex('#7a4844'),
        G = u ? hex('#8f9670') : GLASSD;
      c.rect(2, 4, 19, b, F);
      c.col(2, 4, b, FL);
      c.rect(3, 2, 18, 4, FL);
      c.rect(6, 5, 15, 7, u ? LAMP : hex('#77745a'));
      c.rect(4, 9, 17, b - 3, G);
      for (const y of [18, 28]) c.row(y, 4, 17, F);
      for (const x of [8, 13]) c.col(x, 9, b - 3, F);
      c.rect(4, 20, 6, 27, hex('#221f28')); // the telephone on the far wall, side on
      if (u) {
        for (let y = 26; y <= 35; y++) c.set(7 + (y % 2), y, hex('#3a3440'));
        c.rect(7, 36, 8, 41, hex('#221f28'));
      } else dots(c, GLASSL, [5, 10, 6, 10, 5, 11]);
      c.rect(2, b - 2, 19, b, F);
      if (u) c.col(20, 5, b, hex('#3a2020'));
    },
  });

  /* ---------- mannequins ---------- */
  function mann(c, x, b, h, turned, arm) {
    // x is the middle; stands on a round base on row b
    const M = hex('#c2b8a2'),
      ML = hex('#d8d0bc'),
      MD = hex('#9a927e'),
      t = b - h;
    c.rect(x - 3, b - 1, x + 3, b, ID);
    c.col(x, b - 8, b - 2, ST);
    c.rect(x - 2, t, x + 1, t + 4, M);
    c.row(t, x - 1, x, ML);
    c.col(x + 1, t + 1, t + 4, MD);
    if (turned) {
      c.set(x - 1, t + 2, NI);
      c.set(x + 1, t + 2, NI);
    }
    c.col(x, t + 5, t + 5, MD);
    c.rect(x - 3, t + 6, x + 2, t + 14, M);
    c.col(x - 3, t + 6, t + 14, ML);
    c.col(x + 2, t + 7, t + 14, MD);
    c.rect(x - 2, t + 15, x + 1, t + 17, M);
    c.rect(x - 3, t + 18, x - 1, b - 8, M);
    c.rect(x, t + 18, x + 2, b - 8, MD);
    c.col(x - 3, t + 18, b - 8, ML);
    // arms
    c.col(x - 4, t + 7, t + 15, ML);
    if (arm === 'up') {
      c.line(x + 3, t + 7, x + 6, t + 2, M);
      c.set(x + 6, t + 1, MD);
    } else if (arm === 'point') {
      c.row(t + 8, x + 3, x + 7, M);
      c.set(x + 8, t + 8, MD);
    } else c.col(x + 3, t + 7, t + 15, MD);
  }
  O('nightmare-mannequins-row', 'row of shop mannequins three pale dummies on stands featureless faces turning to look', {
    w: 38,
    h: 42,
    f(c, u) {
      const b = 40;
      mann(c, 7, b, 36, u, u ? 'up' : null);
      mann(c, 18, b, 38, u, u ? 'point' : null);
      mann(c, 29, b, 35, u, null);
      if (u) {
        c.set(28, b - 33, NI);
        c.set(30, b - 33, NI);
      }
    },
    sw: 14,
    s(c, u) {
      const b = 40;
      mann(c, 6, b, 36, false, u ? 'point' : null);
      if (u) c.set(7, b - 34, NI);
    },
  });
};
