/* Horror, part 4: doors, the butcher's corner, the wet rooms, the workshop. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, D, L, dots, part, turn, chain, thin, hook, rusty, drip, pool, bars, ring, shadowed } = H;
  const RU = C.rust,
    RD = D(C.rust),
    RL = hex('#a3602f'),
    IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    BL = C.blood,
    BD = hex('#5c1418'),
    PALE = hex('#b8a894'),
    MEAT = hex('#8e3b38'),
    MEATL = hex('#b3625a'),
    NI = C.night,
    CE = hex('#6f6c68'),
    CL = hex('#8b8882'),
    CD = D(CE),
    FM = hex('#9a7566'),
    ENAM = hex('#c9c4b2'),
    TILE = hex('#73857a'),
    CHAR = hex('#2a2224'),
    W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    BN = C.bone;

  /* ---------- doors ---------- */
  const DOORC = blend(C.iron, C.rust, 0.35);
  function lockedFace(c, x0, y0, x1, y1, open) {
    c.rect(x0, y0, x1, y1, DOORC);
    c.col(x0, y0, y1, L(DOORC));
    c.row(y0, x0, x1, L(DOORC));
    for (const y of [y0 + 2, y1 - 2]) for (let x = x0 + 2; x <= x1 - 2; x += 4) c.set(x, y, ID);
    c.rect(x0 + 4, y0 + 4, x1 - 4, y0 + 7, NI); // the hatch
    bars(c, x0 + 5, x1 - 5, y0 + 4, y0 + 7, ST, 2);
    const m = x1 - 3;
    for (const [y, kind] of [[y0 + 11, 0], [y0 + 15, 1], [y0 + 19, 0], [y0 + 23, 2], [y0 + 28, 1]]) {
      if (kind === 0) {
        c.row(y, m - 6, m + 1, ST); // a bolt
        c.set(open ? m - 6 : m + 1, y - 1, ST);
        if (open) c.row(y, m - 1, m + 1, DOORC);
      } else if (kind === 1) {
        c.rect(m - 1, y - 1, m + 1, y, ID); // hasp and padlock
        c.rect(m - 1, y + 1, m + 1, y + 2, C.brass);
        if (open) c.set(m - 1, y + 1, DOORC), c.set(m + 1, y + 3, C.brass);
      } else {
        for (let x = x0 + 1; x <= x1 - 1; x++) c.set(x, y + (open ? Math.min(6, (x - x0)) : x % 2), x % 2 ? ST : ID); // a chain
        c.rect(m - 3, y + (open ? 5 : 0), m - 2, y + (open ? 6 : 1), C.brass);
      }
    }
    rusty(c, x0, y0, x1, y1, 5, 4);
  }
  O('door-many-locks', 'heavy steel door with many locks bolts padlocks chain barred hatch cell', {
    w: 20,
    h: 42,
    uw: 30,
    f(c, u) {
      const b = 40;
      c.rect(1, 1, 18, b, IR);
      c.col(1, 1, b, L(IR));
      c.row(1, 1, 18, L(IR));
      if (!u) return void lockedFace(c, 3, 3, 16, b, false);
      c.rect(3, 3, 16, b, NI);
      c.rect(3, b - 2, 16, b, hex('#2a1418'));
      dots(c, C.red, [8, 20, 11, 20]); // something looks back
      c.poly([[17, 3], [26, 1], [26, c.h - 1], [17, b]], DOORC); // the door, swung out
      c.line(17, 3, 26, 1, L(DOORC));
      c.col(17, 3, b, L(DOORC));
      c.col(26, 1, c.h - 1, D(DOORC));
      for (const y of [13, 21, 29]) c.rect(18, y, 20, y + 1, ST);
      c.rect(18, 17, 19, 18, C.brass);
      for (let y = 24; y <= 30; y++) c.set(19, y, y % 2 ? ST : ID);
      c.rect(19, 31, 20, 32, C.brass);
      rusty(c, 17, 1, 26, b, 5, 4);
      return () => dots(c, BL, [10, b + 1, 13, b + 1]);
    },
    sw: 9,
    suw: 21,
    s(c, u) {
      const b = 40;
      c.rect(1, 1, 5, b, IR);
      c.col(1, 1, b, L(IR));
      if (!u) {
        c.rect(6, 3, 6, b, DOORC);
        for (const y of [14, 18, 22, 26, 31]) c.set(7, y, y % 4 ? C.brass : ST);
        return;
      }
      c.col(5, 3, b, NI);
      lockedFace(c, 6, 3, 19, b, true);
    },
  });

  function fleshSlab(c, x0, y0, x1, y1, seed) {
    const r = rnd(seed);
    c.rect(x0, y0, x1, y1, FM);
    for (let i = 0; i < 9; i++) {
      const x = x0 + ((r() * (x1 - x0 - 3)) | 0),
        y = y0 + ((r() * (y1 - y0 - 5)) | 0);
      c.oval(x, y, x + 3, y + 5, i % 2 ? L(FM) : blend(FM, PALE, 0.5));
      c.set(x + 3, y + 4, D(FM));
    }
    for (let i = 0; i < 5; i++) {
      let x = x0 + 1 + ((r() * (x1 - x0 - 2)) | 0),
        y = y0 + ((r() * (y1 - y0 - 10)) | 0);
      for (let k = 0; k < 9; k++) {
        c.set(x, y + k, BD); // a vein
        if (r() < 0.4) x += r() < 0.5 ? -1 : 1;
        x = Math.max(x0 + 1, Math.min(x1 - 1, x));
      }
    }
    c.col(x0, y0, y1, L(FM));
  }
  O('door-flesh', 'door of flesh living meat door veins wound eye teeth organic', {
    w: 20,
    h: 42,
    f(c, u) {
      const b = 40;
      c.rect(1, 1, 18, b, CE);
      c.col(1, 1, b, CL);
      c.row(1, 1, 18, CL);
      c.speckle(1, 1, 18, b, CD, 14, 3);
      fleshSlab(c, 3, 3, 16, b, 7);
      if (!u) {
        c.col(9, 8, 32, BD); // the seam
        c.col(10, 10, 30, mix(FM, 0.55));
        dots(c, D(FM), [8, 12, 11, 16, 8, 22, 11, 27]);
        c.rect(14, 21, 15, 22, BN); // a knob of bone
        c.set(15, 23, D(BN));
      } else {
        c.poly([[9, 6], [10, 6], [13, 14], [14, 22], [12, 32], [10, 36], [9, 36], [6, 30], [5, 20], [7, 12]], NI);
        for (let y = 9; y <= 33; y += 3) {
          const a = y < 14 ? 8 - ((y - 6) >> 2) : y > 30 ? 7 + ((y - 30) >> 1) : 6;
          const e = y < 14 ? 11 + ((y - 6) >> 2) : y > 30 ? 12 - ((y - 30) >> 1) : 13;
          c.set(a, y, BN);
          c.set(e, y + 1, BN);
        }
        c.oval(7, 17, 12, 23, C.bone); // the eye inside
        c.oval(8, 18, 11, 22, hex('#7a8a4a'));
        c.rect(9, 19, 10, 21, NI);
        c.set(9, 19, C.white);
        dots(c, BL, [6, 25, 13, 27, 8, 31]);
        c.rect(14, 21, 15, 22, BN);
      }
      return () => u && (drip(c, 9, 37, 2), drip(c, 11, 36, 4), pool(c, 6, 14, b + 1));
    },
    sw: 10,
    suw: 14,
    s(c, u) {
      const b = 40;
      c.rect(1, 1, 4, b, CE);
      c.col(1, 1, b, CL);
      fleshSlab(c, 5, 3, 7, b, 7);
      c.col(8, 10, 30, FM);
      c.col(8, 16, 24, L(FM));
      c.rect(8, 21, 9, 22, BN);
      if (u) {
        c.col(8, 8, 34, NI);
        dots(c, BN, [9, 10, 9, 14, 9, 28, 9, 32]);
        c.line(8, 20, 12, 26, MEAT); // a tongue feels its way out
        c.line(8, 21, 12, 27, MEATL);
        c.set(12, 28, MEAT);
      }
      return () => u && (drip(c, 9, 35, 3), pool(c, 5, 12, b + 1));
    },
  });

  /* ---------- the mirror ---------- */
  const GLS = blend(C.glass, C.stoneDark, 0.5);
  O('mirror-smeared', 'smeared mirror in a rusty frame grimy glass bloody streaks tall standing', {
    w: 16,
    h: 36,
    f(c, u) {
      const b = 34;
      c.rect(1, 2, 14, b - 2, IR);
      c.col(1, 2, b - 2, L(IR));
      c.rect(1, b - 1, 3, b, ID);
      c.rect(12, b - 1, 14, b, ID);
      c.rect(3, 4, 12, b - 4, GLS);
      c.line(4, 9, 8, 5, L(GLS));
      c.speckle(3, 4, 12, b - 4, D(GLS), 6, 4);
      for (const [x, y, n] of [[5, 10, 12], [7, 9, 16], [9, 11, 9], [10, 20, 8]]) c.col(x, y, y + n, BD);
      c.rect(5, 8, 9, 10, BD);
      dots(c, BL, [6, 9, 8, 9, 5, 14, 7, 18]);
      rusty(c, 1, 2, 14, b, 4, 3);
      if (u) {
        c.oval(4, 13, 11, 24, C.glassLight); // wiped clean, and someone is in it
        c.oval(5, 15, 10, 23, PALE);
        c.rect(6, 18, 6, 19, NI);
        c.rect(9, 18, 9, 19, NI);
        c.row(22, 7, 8, NI);
        c.row(14, 5, 10, hex('#3a3030'));
        c.col(5, 15, 18, hex('#3a3030'));
        c.col(10, 15, 18, hex('#3a3030'));
      }
    },
    sw: 10,
    suw: 14,
    s(c, u) {
      const b = 34;
      c.rect(3, 2, 5, b - 2, IR);
      c.col(3, 2, b - 2, L(IR));
      c.col(6, 4, b - 4, GLS);
      c.rect(1, b - 1, 7, b, ID);
      c.line(1, b - 2, 3, b - 8, ID);
      rusty(c, 1, 2, 7, b, 4, 3);
      c.set(6, 12, BD);
      c.set(6, 20, BD);
      if (u) {
        c.rect(7, 18, 10, 19, PALE); // a hand comes through
        c.rect(10, 17, 11, 20, PALE);
        dots(c, PALE, [12, 16, 12, 18, 12, 20]);
        c.col(6, 15, 22, C.glassLight);
      }
    },
  });

  /* ---------- the butcher's corner ---------- */
  const ZINC = hex('#7c8087');
  function bucket(c, x0, y0, x1, b) {
    c.poly([[x0, y0], [x1, y0], [x1 - 1, b], [x0 + 1, b]], ZINC);
    c.row(y0, x0, x1, L(ZINC));
    c.col(x0 + 1, y0 + 1, b - 1, L(ZINC));
    c.row(y0 + 3, x0 + 1, x1 - 1, D(ZINC));
    c.row(b - 2, x0 + 1, x1 - 1, D(ZINC));
  }
  O('bucket-something', 'bucket of something offal slops blood guts zinc pail flies', {
    w: 14,
    h: 16,
    uw: 20,
    uh: 13,
    solid: false,
    f(c, u) {
      if (!u) {
        const b = 14;
        ring(c, 2, 2, 11, 10, IR); // the handle
        bucket(c, 2, 6, 11, b);
        c.rect(3, 5, 10, 6, BD);
        dots(c, MEAT, [4, 5, 5, 4, 6, 5, 8, 4, 9, 5]);
        dots(c, MEATL, [5, 5, 8, 5]);
        c.col(7, 2, 5, BN); // a bone stands in it
        c.set(6, 2, BN);
        c.set(8, 2, D(BN));
        rusty(c, 2, 6, 11, b, 3, 3);
        c.col(4, 7, 10, BD);
        return () => dots(c, NI, [1, 2, 12, 4, 10, 0]);
      }
      // kicked over
      const b = 11,
        t = part(10, 9, (t) => {
          bucket(t, 0, 0, 9, 8);
          rusty(t, 0, 0, 9, 8, 3, 3);
        });
      c.stamp(turn(t), 1, 2);
      c.oval(1, 3, 3, 10, NI);
      c.rect(2, 6, 3, 10, BD);
      return () => {
        c.row(b, 0, 13, BL);
        c.row(b + 1, 2, 17, BL);
        c.row(b, 3, 9, BD);
        dots(c, MEAT, [1, b, 5, b + 1, 9, b, 12, b + 1]);
        dots(c, MEATL, [3, b + 1, 10, b + 1]);
        c.rect(13, b - 1, 17, b - 1, BN);
        c.set(18, b - 2, BN);
        c.set(18, b, D(BN));
      };
    },
    sw: 14,
    suw: 16,
    suh: 16,
    s(c, u) {
      const b = 14;
      if (!u) {
        c.col(6, 1, 5, IR);
        c.col(7, 1, 5, ID);
        bucket(c, 2, 6, 11, b);
        c.rect(3, 5, 10, 6, BD);
        dots(c, MEAT, [4, 5, 6, 4, 9, 5]);
        c.col(9, 2, 5, BN);
        c.set(10, 2, D(BN));
        rusty(c, 2, 6, 11, b, 3, 3);
        return () => dots(c, NI, [1, 3, 12, 1]);
      }
      c.oval(3, 3, 12, 12, ZINC); // lying mouth toward us
      ring(c, 3, 3, 12, 12, L(ZINC));
      c.oval(5, 5, 10, 10, NI);
      c.rect(5, 9, 10, 11, BD);
      return () => {
        c.row(13, 2, 13, BL);
        c.row(14, 1, 14, BL);
        c.row(15, 4, 11, BD);
        dots(c, MEAT, [5, 13, 9, 14, 7, 15]);
        c.row(14, 10, 13, BN);
      };
    },
  });

  const SAWC = hex('#8a4a2a');
  O('chainsaw-rusty', 'rusty chainsaw petrol saw blade teeth bloody tool weapon', {
    w: 32,
    h: 15,
    base: 'side',
    solid: false,
    f(c, u) {
      const b = 13;
      c.rect(2, 6, 12, b, SAWC);
      c.row(6, 2, 12, L(SAWC));
      c.rect(3, 9, 7, b - 1, ID);
      c.rect(9, 8, 11, 10, NI);
      c.rect(1, 3, 2, 9, ID); // rear handle
      c.rect(1, 3, 9, 4, ID); // top handle
      c.col(9, 4, 6, ID);
      c.set(5, 8, ST);
      c.rect(13, 8, 28, 11, ST); // the bar
      c.row(8, 13, 28, L(ST));
      c.rect(29, 9, 29, 10, ST);
      c.row(9, 15, 26, D(ST));
      for (let x = 13; x <= 29; x += 2) {
        c.set(x, 7, ID);
        c.set(x + 1, 12, ID);
      }
      c.set(30, 9, ID);
      c.set(30, 10, ID);
      rusty(c, 2, 6, 28, b, 2, 3);
      if (u) {
        c.row(10, 16, 28, BL);
        c.row(11, 14, 27, BL);
        dots(c, BL, [20, 8, 24, 9, 27, 8, 12, 9]);
        dots(c, BD, [18, 9, 22, 10]);
      }
      return () => u && (drip(c, 22, 13, 0), dots(c, BL, [26, b + 1, 18, b + 1]), dots(c, C.ash, [0, 1, 1, 0, 3, 0]));
    },
    sw: 12,
    s(c, u) {
      const b = 13;
      c.rect(2, 6, 9, b, SAWC);
      c.row(6, 2, 9, L(SAWC));
      c.rect(2, 3, 9, 4, ID);
      c.col(2, 4, 6, ID);
      c.col(9, 4, 6, ID);
      c.rect(5, 7, 6, 12, ST); // the bar, tip on
      c.col(5, 7, 12, L(ST));
      c.set(5, 6, ID);
      c.set(6, 13, ID);
      c.rect(3, 9, 3, 11, NI);
      rusty(c, 2, 6, 9, b, 2, 3);
      if (u) {
        c.rect(5, 9, 6, 12, BL);
        c.set(4, 10, BL);
        c.set(7, 8, BL);
      }
      return () => u && (dots(c, BL, [6, b + 1, 8, b + 1]), dots(c, C.ash, [1, 1, 0, 0]));
    },
  });

  O('cleaver-block', 'butcher block with a cleaver stuck in it chopping block wooden bloody meat', {
    w: 18,
    h: 24,
    f(c, u) {
      const b = 22;
      c.rect(2, 11, 15, 16, WL);
      c.row(11, 2, 15, C.woodPale);
      c.row(16, 2, 15, W);
      for (let x = 4; x <= 14; x += 3) c.col(x, 12, 15, W);
      c.rect(3, 17, 4, b, W);
      c.rect(13, 17, 14, b, W);
      c.row(19, 5, 12, WD);
      c.row(11, 5, 12, BD);
      c.col(7, 12, 14, BD);
      if (!u) {
        c.rect(8, 5, 12, 10, ST); // the cleaver
        c.col(8, 5, 10, L(ST));
        c.row(10, 8, 12, L(ST));
        c.set(11, 6, NI);
        c.line(7, 5, 3, 2, WD);
        c.line(7, 4, 4, 2, W);
      } else {
        c.row(11, 8, 12, NI); // the cut it left
        c.rect(4, 8, 8, 10, MEAT);
        c.row(8, 5, 7, MEATL);
        c.set(8, 9, C.bone);
        c.rect(11, 10, 13, 10, PALE); // a finger
        c.set(11, 10, BL);
        c.row(11, 3, 14, BL);
        c.col(10, 12, 16, BL);
        c.col(5, 12, 14, BL);
      }
      return () => u && (drip(c, 10, 17, 3), pool(c, 6, 14, b));
    },
    sw: 14,
    s(c, u) {
      const b = 22;
      c.rect(2, 11, 11, 16, WL);
      c.row(11, 2, 11, C.woodPale);
      c.row(16, 2, 11, W);
      for (let x = 4; x <= 10; x += 3) c.col(x, 12, 15, W);
      c.rect(3, 17, 4, b, W);
      c.rect(9, 17, 10, b, W);
      c.row(19, 5, 8, WD);
      c.row(11, 4, 9, BD);
      if (!u) {
        c.col(7, 5, 10, ST); // the cleaver, edge on
        c.col(6, 5, 10, L(ST));
        c.rect(6, 2, 7, 4, WD);
        c.set(6, 2, W);
      } else {
        c.rect(5, 8, 8, 10, MEAT);
        c.row(8, 6, 7, MEATL);
        c.row(11, 3, 10, BL);
        c.col(8, 12, 16, BL);
      }
      return () => u && (drip(c, 8, 17, 3), pool(c, 4, 11, b));
    },
  });

  O('slab-autopsy-cement', 'cement slab table with a drain gutter autopsy mortuary butcher concrete', {
    w: 42,
    h: 20,
    base: 'side',
    f(c, u) {
      const b = 18;
      c.rect(1, 7, 39, 10, CE);
      c.row(7, 1, 39, CL);
      c.row(10, 1, 39, CD);
      c.rect(3, 5, 8, 6, CE); // head block
      c.row(5, 3, 8, CL);
      for (const x of [5, 30]) {
        c.rect(x, 11, x + 5, b, CE);
        c.col(x, 11, b, CL);
        c.col(x + 5, 11, b, CD);
      }
      c.col(20, 11, b - 2, IR); // drain pipe
      c.rect(19, b - 1, 21, b, ID);
      c.speckle(1, 5, 39, b, CD, 14, 6);
      dots(c, BD, [14, 8, 15, 8, 22, 9, 27, 8]);
      if (u) {
        c.row(8, 9, 33, BL);
        c.row(7, 12, 28, BL);
        dots(c, BD, [16, 8, 24, 8]);
        c.col(12, 9, 13, BL);
        c.col(26, 9, 11, BL);
        c.rect(33, 5, 39, 7, C.white); // a sheet thrown off
        c.rect(36, 8, 39, 13, D(C.white));
        c.row(5, 34, 38, L(C.white));
        dots(c, BL, [35, 6, 37, 9]);
      }
      return () => u && (drip(c, 20, b - 1, 0), pool(c, 16, 25, b + 1), drip(c, 12, 14, 1));
    },
    sw: 22,
    sh: 30,
    s(c, u) {
      const b = 28;
      c.rect(6, 3, 15, 5, CE); // head block, far
      c.row(3, 6, 15, CL);
      c.rect(1, 6, 20, 19, CL);
      c.frame(1, 6, 20, 19, CE);
      c.rect(3, 8, 18, 17, CE);
      c.col(10, 8, 17, CD); // the gutter
      c.col(11, 8, 17, CD);
      c.rect(10, 16, 11, 17, NI);
      c.rect(1, 20, 20, 22, CE);
      c.row(22, 1, 20, CD);
      c.rect(5, 23, 16, b, CE);
      c.col(5, 23, b, CL);
      c.col(16, 23, b, CD);
      c.speckle(1, 3, 20, b, CD, 14, 6);
      dots(c, BD, [7, 11, 14, 13]);
      if (u) {
        c.col(10, 8, 17, BL);
        c.col(11, 9, 17, BL);
        c.oval(5, 9, 9, 13, BD);
        c.oval(12, 11, 16, 15, BL);
        c.rect(15, 18, 20, 24, D(C.white));
        c.row(18, 15, 20, C.white);
      }
      return () => u && drip(c, 3, 23, 2);
    },
  });

  O('freezer-chest-remains', 'rusty chest freezer deep freeze white enamel padlock frost something inside', {
    w: 34,
    h: 20,
    uh: 30,
    f(c, u) {
      const b = c.h - 2,
        t = b - 14;
      c.rect(1, t + 3, 32, b - 1, ENAM);
      c.col(1, t + 3, b - 1, L(ENAM));
      c.row(b - 1, 1, 32, D(ENAM));
      c.rect(2, b, 4, b, ID);
      c.rect(29, b, 31, b, ID);
      for (let y = b - 5; y <= b - 3; y += 2) c.row(y, 24, 30, D(ENAM));
      for (const x of [6, 13, 21, 27]) c.col(x, t + 4, t + 6 + (x % 4) * 2, RU);
      if (!u) {
        c.rect(1, t, 32, t + 2, ENAM); // the lid
        c.row(t, 1, 32, L(ENAM));
        c.row(t + 2, 1, 32, D(ENAM));
        c.rect(14, t + 2, 19, t + 3, ST);
        c.rect(16, t + 3, 17, t + 5, C.brass);
        c.set(3, t + 4, D(ENAM));
      } else {
        c.rect(1, t - 11, 32, t - 1, D(ENAM)); // the lid stands up
        c.frame(1, t - 11, 32, t - 1, ENAM);
        c.speckle(2, t - 10, 31, t - 2, C.white, 6, 2);
        c.rect(2, t, 31, t + 2, hex('#39404a'));
        c.rect(4, t, 12, t + 1, C.ghost); // frosted parcels
        c.rect(15, t, 20, t + 1, PALE);
        c.rect(23, t, 29, t + 1, C.ghost);
        c.rect(16, t - 2, 18, t - 1, PALE); // a foot stands out of the ice
        dots(c, PALE, [16, t - 3, 18, t - 3]);
        dots(c, C.white, [6, t, 10, t + 1, 24, t, 27, t + 1, 19, t]);
        c.rect(15, t + 3, 18, t + 3, ST);
      }
      rusty(c, 1, t, 32, b, 3, 4);
      return () => u && dots(c, C.ghost, [3, t - 2, 8, t - 3, 13, t - 2, 22, t - 3, 28, t - 2, 0, t + 5, 33, t + 6, 0, b - 2]);
    },
    sw: 16,
    suh: 30,
    s(c, u) {
      const b = c.h - 2,
        t = b - 14;
      c.rect(1, t + 3, 14, b - 1, ENAM);
      c.col(1, t + 3, b - 1, L(ENAM));
      c.row(b - 1, 1, 14, D(ENAM));
      c.rect(2, b, 3, b, ID);
      c.rect(12, b, 13, b, ID);
      for (let y = b - 5; y <= b - 3; y += 2) c.row(y, 4, 11, D(ENAM));
      c.col(5, t + 4, t + 9, RU);
      if (!u) {
        c.rect(1, t, 14, t + 2, ENAM);
        c.row(t, 1, 14, L(ENAM));
        c.row(t + 2, 1, 14, D(ENAM));
        c.rect(14, t + 2, 14, t + 5, C.brass);
      } else {
        c.rect(1, t - 11, 2, t - 1, ENAM); // the lid, edge on, at the back
        c.col(2, t - 11, t - 1, D(ENAM));
        c.rect(2, t, 13, t + 2, hex('#39404a'));
        c.rect(4, t, 11, t + 1, C.ghost);
        c.rect(8, t - 2, 9, t - 1, PALE);
        c.set(10, t - 2, PALE);
      }
      rusty(c, 1, t, 14, b, 3, 4);
      return () => u && dots(c, C.ghost, [5, t - 3, 11, t - 2, 15, t + 5, 13, t - 4]);
    },
  });

  const drum = (alt) => (c, u) => {
    const b = c.h - 2,
      t = b - 19;
    c.rect(2, t, 13, b, blend(IR, RU, 0.45));
    c.col(2, t, b, RL);
    c.col(3, t, b, RU);
    c.col(13, t, b, ID);
    for (const y of [t, t + 6, t + 13, b]) c.row(y, 2, 13, ID);
    c.row(t, 3, 12, NI);
    const holes = alt ? [5, t + 9, 9, t + 10, 7, t + 16, 11, t + 15] : [4, t + 10, 8, t + 9, 11, t + 10, 6, t + 16, 10, t + 16];
    dots(c, u ? C.flame : NI, holes);
    rusty(c, 2, t, 13, b, alt ? 5 : 3, 3);
    // what was put in to burn
    c.line(alt ? 9 : 5, t - 1, alt ? 11 : 3, t - 5, CHAR);
    c.set(alt ? 12 : 2, t - 6, BN);
    c.col(alt ? 5 : 9, t - 4, t - 1, CHAR);
    dots(c, alt ? CHAR : BN, [alt ? 4 : 8, t - 5, alt ? 6 : 10, t - 5, alt ? 5 : 9, t - 6]);
    if (u) {
      c.poly([[4, t - 1], [5, t - 6], [7, t - 3], [8, t - 9], [10, t - 4], [11, t - 7], [12, t - 1]], C.flame);
      c.poly([[6, t - 1], [8, t - 5], [10, t - 1]], C.flameLight);
      c.set(8, t - 1, C.glow);
      c.col(alt ? 5 : 9, t - 4, t - 1, CHAR);
    } else dots(c, C.ash, [5, t, 8, t, 11, t]);
    return () => {
      if (u) dots(c, C.flameLight, [3, t - 9, 12, t - 10, 6, t - 11, 14, t - 5, 1, t - 4]);
      else dots(c, C.ash, [1, b + 1, 14, b + 1]);
    };
  };
  O('drum-burning-remains', 'oil drum with burnt remains fire barrel bones charred burning brazier', {
    w: 16,
    h: 28,
    uh: 34,
    f: drum(false),
    sw: 16,
    suh: 34,
    s: drum(true),
  });

  O('shackle-block-cement', 'cement block with a chain and shackle iron ring cuff leg iron boot left behind', {
    w: 26,
    h: 16,
    f(c, u) {
      const b = 14;
      c.rect(1, 5, 12, b, CE);
      c.row(5, 1, 12, CL);
      c.col(1, 5, b, CL);
      c.col(12, 6, b, CD);
      c.speckle(1, 5, 12, b, CD, 12, 3);
      ring(c, 5, 1, 9, 5, IR);
      for (let x = 9; x <= 17; x++) c.set(x, x < 13 ? 3 + ((x - 9) >> 1) : Math.min(b, 5 + (x - 12) * 2), x % 2 ? IR : ST);
      for (let x = 17; x <= 19; x++) c.set(x, b, x % 2 ? IR : ST);
      if (!u) {
        c.rect(20, b - 6, 23, b - 1, hex('#3b2a22')); // a boot, still in the cuff
        c.rect(20, b - 1, 24, b, hex('#3b2a22'));
        c.row(b, 20, 24, NI);
        c.row(b - 6, 20, 23, BD);
        c.set(21, b - 7, BN);
        c.row(b - 4, 19, 24, IR);
        c.set(19, b - 3, ST);
      } else {
        c.rect(19, b - 1, 20, b, IR); // the cuff lies open
        c.rect(22, b - 2, 23, b - 1, IR);
        c.set(21, b, ST);
        c.set(24, b, IR);
      }
      rusty(c, 5, 1, 24, b, 2, 2);
      return () => u && (dots(c, BL, [22, b + 1, 24, b + 1, 16, b + 1]), dots(c, BD, [18, b + 1]));
    },
    sw: 14,
    s(c, u) {
      const b = 14;
      c.rect(1, 5, 9, b, CE);
      c.row(5, 1, 9, CL);
      c.col(1, 5, b, CL);
      c.col(9, 6, b, CD);
      c.speckle(1, 5, 9, b, CD, 12, 3);
      c.rect(4, 1, 5, 4, IR);
      for (let y = 4; y <= b - 1; y++) c.set(10, y, y % 2 ? IR : ST);
      if (!u) {
        c.rect(8, b - 6, 11, b - 1, hex('#3b2a22'));
        c.rect(8, b - 1, 12, b, hex('#3b2a22'));
        c.row(b - 6, 8, 11, BD);
        c.row(b - 4, 7, 12, IR);
      } else {
        c.rect(10, b - 1, 11, b, IR);
        c.set(12, b, ST);
      }
      return () => u && dots(c, BL, [11, b + 1, 12, b + 1]);
    },
  });

  O('bear-trap-rusty', 'rusty bear trap steel jaws teeth spring man trap chain', {
    w: 22,
    h: 11,
    uh: 15,
    solid: false,
    f(c, u) {
      const b = c.h - 2;
      for (let x = 17; x <= 20; x++) c.set(x, b, x % 2 ? IR : ST);
      if (!u) {
        ring(c, 2, b - 5, 15, b, IR);
        c.rect(7, b - 3, 10, b - 2, RU); // the plate
        c.row(b - 3, 7, 10, RL);
        for (let x = 3; x <= 14; x += 2) c.set(x, b - 6 - (x > 5 && x < 12 ? 1 : 0), ST), c.set(x, b - 5 - (x > 5 && x < 12 ? 1 : 0), ST);
        for (let x = 4; x <= 13; x += 3) c.set(x, b - 1, ST);
        c.rect(1, b - 1, 2, b, ID);
        c.rect(15, b - 1, 16, b, ID);
      } else {
        c.rect(1, b - 1, 16, b, ID); // sprung
        c.row(b - 1, 1, 16, IR);
        c.poly([[4, b - 2], [13, b - 2], [11, b - 10], [6, b - 10]], IR);
        c.rect(7, b - 8, 10, b - 3, NI);
        for (let y = b - 9; y <= b - 3; y += 2) {
          c.set(6, y, ST);
          c.set(8, y, ST);
          c.set(9, y + 1, ST);
          c.set(11, y + 1, ST);
        }
        c.rect(7, b - 12, 10, b - 7, hex('#3b2a22')); // a boot top caught in it
        c.row(b - 12, 7, 10, BD);
        dots(c, BL, [6, b - 5, 11, b - 4, 8, b - 6, 9, b - 3]);
      }
      rusty(c, 1, 1, 16, b, 2, 2);
      return () => u && (dots(c, BL, [5, b + 1, 9, b + 1, 12, b + 1, 13, b + 1]), dots(c, BD, [7, b + 1]));
    },
    sw: 14,
    suh: 15,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        ring(c, 2, b - 5, 11, b, IR);
        c.rect(5, b - 3, 8, b - 2, RU);
        for (let x = 3; x <= 10; x += 2) c.set(x, b - 6, ST), c.set(x, b - 5, ST);
        c.set(5, b - 1, ST);
        c.set(8, b - 1, ST);
      } else {
        c.rect(1, b - 1, 12, b, ID);
        c.rect(5, b - 10, 8, b - 2, IR);
        c.col(6, b - 9, b - 3, ST);
        c.col(7, b - 9, b - 3, NI);
        for (let y = b - 9; y <= b - 3; y += 2) c.set(8, y, ST), c.set(5, y + 1, ST);
        c.rect(5, b - 12, 9, b - 8, hex('#3b2a22'));
        c.row(b - 12, 5, 9, BD);
        dots(c, BL, [6, b - 5, 8, b - 4]);
      }
      rusty(c, 1, 1, 12, b, 2, 2);
      return () => u && dots(c, BL, [4, b + 1, 9, b + 1]);
    },
  });

  /* ---------- the wet rooms ---------- */
  function tiles(c, x0, y0, x1, y1, seed) {
    const r = rnd(seed);
    c.rect(x0, y0, x1, y1, TILE);
    for (let y = y0; y <= y1; y += 4) c.row(y, x0, x1, D(TILE));
    for (let x = x0; x <= x1; x += 4) c.col(x, y0, y1, D(TILE));
    for (let y = y0 + 1; y < y1; y += 4)
      for (let x = x0 + 1; x < x1; x += 4) {
        const k = r();
        if (k < 0.14) c.rect(x, y, Math.min(x1, x + 2), Math.min(y1, y + 2), CE); // a tile gone
        else if (k < 0.3) c.set(x, y, L(TILE));
        else if (k < 0.4) c.rect(x, y + 1, Math.min(x1, x + 2), Math.min(y1, y + 2), mix(TILE, 0.7)); // mould
      }
  }
  O('shower-stall-rusty', 'rusty shower tiled wall shower head pipe mould torn curtain bloody water', {
    w: 20,
    h: 44,
    f(c, u) {
      const b = 42;
      tiles(c, 2, 2, 17, b - 3, 4);
      c.rect(1, b - 2, 18, b, CE);
      c.row(b - 2, 1, 18, CL);
      c.rect(8, b - 2, 10, b - 2, NI);
      c.col(15, 6, b - 12, IR); // the pipe
      c.row(5, 10, 15, IR);
      c.rect(8, 6, 12, 7, ST); // the head
      c.row(8, 9, 11, ID);
      c.rect(14, b - 14, 16, b - 13, ST);
      c.set(13, b - 14, RU);
      c.set(17, b - 14, RU);
      c.row(3, 1, 18, ID); // curtain rail and what is left of the curtain
      c.poly([[2, 4], [7, 4], [6, 20], [7, 30], [4, 26], [2, 33]], blend(ENAM, TILE, 0.3));
      c.col(4, 5, 24, D(ENAM));
      c.col(2, 4, 32, ENAM);
      dots(c, BD, [5, 14, 5, 15, 6, 13, 3, 16, 4, 17, 5, 18]);
      rusty(c, 8, 5, 16, b - 12, 3, 2);
      c.col(15, b - 11, b - 6, RU);
      if (u) c.row(b - 2, 2, 17, BL), c.row(b - 3, 3, 16, BD);
      return () => {
        if (!u) return void c.set(10, 11, C.water);
        for (const x of [8, 10, 12]) for (let y = 9 + (x % 3); y <= b - 4; y += 3) c.col(x + ((y >> 2) % 2 ? 0 : (x < 10 ? -1 : 1) * ((y / 14) | 0)), y, y + 1, y % 2 ? BL : hex('#8a5a48'));
        dots(c, C.ghost, [5, 36, 14, 34, 16, 38, 3, 39]);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 42;
      c.rect(1, 2, 3, b - 3, CE); // the wall, edge on
      c.col(3, 2, b - 3, TILE);
      c.rect(1, b - 2, 12, b, CE);
      c.row(b - 2, 1, 12, CL);
      c.col(4, 6, b - 12, IR);
      c.row(5, 4, 9, IR);
      c.rect(8, 6, 10, 7, ST);
      c.row(8, 8, 10, ID);
      c.rect(4, b - 14, 6, b - 13, ST);
      c.row(3, 1, 12, ID);
      c.poly([[10, 4], [12, 4], [12, 30], [11, 24], [10, 28]], blend(ENAM, TILE, 0.3));
      c.col(11, 5, 22, D(ENAM));
      dots(c, BD, [11, 14, 12, 15, 11, 16]);
      rusty(c, 4, 5, 10, b - 12, 3, 2);
      if (u) c.row(b - 2, 2, 11, BL);
      return () => {
        if (!u) return void c.set(9, 11, C.water);
        for (const x of [8, 9, 10]) for (let y = 9 + (x % 3); y <= b - 4; y += 3) c.col(x - (y > 26 ? 1 : 0), y, y + 1, y % 2 ? BL : hex('#8a5a48'));
      };
    },
  });

  O('sink-rusty-blood', 'rusty wall sink basin cracked enamel taps pipe blood running tap', {
    w: 18,
    h: 28,
    f(c, u) {
      const b = 26;
      c.rect(2, 4, 15, 9, ENAM); // splash back
      c.row(4, 2, 15, L(ENAM));
      c.poly([[1, 10], [16, 10], [14, 16], [3, 16]], ENAM);
      c.row(10, 1, 16, L(ENAM));
      c.row(16, 3, 14, D(ENAM));
      c.rect(3, 11, 14, 11, u ? BL : hex('#4a4640'));
      for (const x of [5, 12]) {
        c.col(x, 6, 9, ST);
        c.row(6, x - 1, x + 1, ST);
        c.set(x, 5, C.brass);
      }
      c.set(u ? 11 : 6, 8, ST);
      c.col(8, 17, 20, IR); // the trap
      c.col(9, 17, 22, IR);
      c.rect(9, 22, 12, 23, IR);
      c.col(12, 20, 22, IR);
      c.col(13, 19, b, IR);
      c.line(4, 5, 7, 8, D(ENAM)); // a crack
      c.col(11, 12, 15, RU);
      c.col(6, 12, 14, BD);
      rusty(c, 1, 4, 16, b, 5, 4);
      if (u) {
        c.col(11, 9, 10, BL);
        c.col(4, 12, 16, BL);
        c.col(9, 12, 16, BL);
        c.col(14, 12, 14, BL);
      }
      return () => {
        if (!u) return void c.set(6, 10, hex('#8a5a48'));
        drip(c, 4, 17, 3);
        drip(c, 10, 17, 1);
        pool(c, 2, 11, b);
      };
    },
    sw: 12,
    s(c, u) {
      const b = 26;
      c.rect(1, 4, 2, 16, ENAM);
      c.poly([[3, 10], [10, 10], [9, 16], [3, 16]], ENAM);
      c.row(10, 3, 10, L(ENAM));
      c.row(16, 3, 9, D(ENAM));
      c.col(4, 6, 9, ST);
      c.row(6, 4, 6, ST);
      c.set(6, 7, ST);
      c.set(4, 5, C.brass);
      c.col(3, 17, b, IR);
      c.rect(3, 20, 6, 21, IR);
      c.col(6, 17, 20, IR);
      c.col(8, 12, 14, RU);
      rusty(c, 1, 4, 10, b, 5, 4);
      if (u) {
        c.col(6, 8, 9, BL);
        c.col(10, 11, 16, BL);
        c.row(10, 4, 9, BL);
      }
      return () => {
        if (!u) return void c.set(6, 9, hex('#8a5a48'));
        drip(c, 9, 17, 3);
        pool(c, 5, 11, b);
      };
    },
  });

  /* ---------- the lift ---------- */
  O('lift-cage-door', 'old lift with a scissor gate elevator cage door shaft dark rusty iron', {
    w: 24,
    h: 44,
    f(c, u) {
      const b = 42;
      c.rect(1, 1, 22, b, IR);
      c.col(1, 1, b, L(IR));
      c.row(1, 1, 22, L(IR));
      c.rect(8, 2, 15, 5, hex('#3a342c')); // the floor dial
      ring(c, 9, 3, 14, 8, C.brass);
      c.rect(8, 6, 15, 8, IR);
      c.line(11, 5, u ? 9 : 13, 3, u ? C.red : C.bone);
      c.rect(3, 8, 20, b, NI);
      c.col(11, 8, b, hex('#2a2a33')); // cables in the shaft
      c.col(14, 8, b, hex('#2a2a33'));
      const G = C.brass,
        gate = (x0, x1) => {
          for (let x = x0; x <= x1; x += x1 - x0 > 8 ? 4 : 2) c.col(x, 9, b - 1, D(G));
          for (let y = 9; y < b - 1; y++)
            for (let x = x0; x <= x1; x++) {
              const p = x1 - x0 > 8 ? 4 : 2;
              if ((x - x0 + y) % (p * 2) === 0 || (x - x0 - y + 400) % (p * 2) === 0) c.set(x, y, G);
            }
        };
      if (!u) {
        gate(3, 20);
        c.rect(19, 24, 20, 26, ST);
      } else {
        gate(3, 7);
        c.rect(3, b - 1, 20, b, hex('#2a1418'));
        c.col(17, 8, 20, C.straw); // a rope end, swinging
        c.set(16, 21, C.straw);
        c.set(18, 21, D(C.straw));
      }
      c.rect(21, 22, 22, 25, ID);
      c.set(21, 23, u ? C.red : C.bone);
      rusty(c, 1, 1, 22, b, 4, 5);
      return () => u && dots(c, BL, [12, b + 1, 15, b + 1]);
    },
    sw: 10,
    s(c, u) {
      const b = 42;
      c.rect(2, 1, 6, b, IR);
      c.col(2, 1, b, L(IR));
      c.row(1, 2, 6, L(IR));
      c.col(7, 9, b - 1, u ? NI : C.brass);
      if (!u) for (let y = 10; y < b; y += 4) c.set(7, y, D(C.brass));
      c.rect(7, 22, 8, 25, ID);
      c.set(8, 23, u ? C.red : C.bone);
      c.rect(7, 3, 7, 7, hex('#3a342c'));
      c.set(7, 5, u ? C.red : C.bone);
      rusty(c, 2, 1, 6, b, 4, 5);
      return () => u && dots(c, BL, [7, b + 1, 8, b + 1]);
    },
  });

  /* ---------- the workshop ---------- */
  O('saw-bench-circular', 'circular saw bench table saw blade teeth sawmill workshop rusty', {
    w: 36,
    h: 26,
    base: 'side',
    f(c, u) {
      const b = 24;
      c.oval(12, 3, 24, 15, ST); // the blade
      if (u) ring(c, 12, 3, 24, 15, C.ash), c.dither(13, 4, 23, 12, L(ST));
      else for (let a = 0; a < 16; a++) c.set(18 + Math.round(6.4 * Math.cos((a * Math.PI) / 8)), 9 + Math.round(6.4 * Math.sin((a * Math.PI) / 8)), ID);
      c.rect(17, 8, 19, 10, ID);
      c.rect(2, 12, 33, 14, IR);
      c.row(12, 2, 33, L(IR));
      c.rect(4, 15, 5, b, IR);
      c.rect(30, 15, 31, b, IR);
      c.row(21, 6, 29, ID);
      c.rect(14, 16, 22, 20, ID); // motor
      c.row(16, 14, 22, IR);
      c.set(20, 18, u ? C.red : BD);
      c.rect(26, 9, 33, 11, W); // a plank on the bench
      c.row(9, 26, 33, WL);
      rusty(c, 2, 3, 33, b, 3, 4);
      if (u) {
        c.rect(26, 9, 27, 11, null);
        c.clearRect(25, 9, 26, 11);
        c.rect(5, 10, 11, 11, PALE); // not a plank
        c.rect(3, 10, 4, 11, PALE);
        c.set(2, 10, PALE);
        c.rect(11, 10, 11, 11, BL);
        c.row(12, 8, 22, BL);
        dots(c, BL, [15, 6, 20, 5, 22, 8, 14, 9, 18, 4]);
      }
      return () => u && (drip(c, 12, 15, 3), drip(c, 18, 15, 1), pool(c, 9, 20, b), dots(c, BL, [10, 5, 26, 4, 8, 7]));
    },
    sw: 16,
    s(c, u) {
      const b = 24;
      c.col(8, 3, 11, ST); // the blade, edge on
      c.set(8, 2, ID);
      c.rect(1, 12, 14, 14, IR);
      c.row(12, 1, 14, L(IR));
      c.rect(2, 15, 3, b, IR);
      c.rect(12, 15, 13, b, IR);
      c.row(21, 4, 11, ID);
      c.rect(5, 16, 11, 20, ID);
      c.row(16, 5, 11, IR);
      c.rect(10, 9, 13, 11, u ? PALE : W);
      c.row(9, 10, 13, u ? L(PALE) : WL);
      rusty(c, 1, 3, 14, b, 3, 4);
      if (u) {
        c.col(8, 5, 11, BL);
        c.row(12, 5, 11, BL);
        c.set(10, 10, BL);
      }
      return () => u && (drip(c, 7, 15, 3), pool(c, 3, 11, b), dots(c, BL, [6, 4, 10, 6]));
    },
  });

  function crate(c, x0, y0, x1, y1) {
    c.rect(x0, y0, x1, y1, W);
    for (let y = y0 + 4; y < y1; y += 5) c.row(y, x0, x1, WD);
    c.col(x0, y0, y1, WL);
    c.row(y0, x0, x1, WL);
    c.rect(x0, y0, x0 + 1, y1, WD);
    c.rect(x1 - 1, y0, x1, y1, WD);
    c.col(x0, y0, y1, W);
    for (let y = y0 + 2; y < y1; y += 5) {
      c.set(x0 + 1, y, ST);
      c.set(x1 - 1, y, ST);
    }
  }
  O('crate-nailed-scratching', 'nailed crate with something scratching inside wooden box fingers through the gap', {
    w: 24,
    h: 22,
    uw: 32,
    f(c, u) {
      const b = 20;
      crate(c, 1, u ? 5 : 3, 22, b);
      c.rect(9, 10, 14, 11, C.paper);
      dots(c, NI, [10, 10, 12, 11, 13, 10]);
      if (!u) {
        c.rect(1, 3, 22, 5, WL); // the lid
        c.row(5, 1, 22, WD);
        dots(c, ST, [3, 4, 8, 4, 15, 4, 20, 4]);
        c.row(13, 5, 9, NI); // a gap, and fingers in it
        dots(c, PALE, [6, 13, 7, 13, 8, 13]);
        dots(c, WL, [16, 15, 17, 16, 18, 17, 17, 14, 18, 15, 19, 16]);
      } else {
        c.rect(3, 5, 20, 6, NI);
        dots(c, C.straw, [4, 5, 7, 4, 11, 5, 15, 4, 19, 5]);
        c.poly([[23, b], [26, b], [30, 4], [27, 4]], WL); // the lid leans beside it
        c.line(23, b, 27, 4, C.woodPale);
        dots(c, ST, [26, 14, 28, 8]);
        c.line(5, 6, 3, 2, IR); // a crowbar left in
        c.set(4, 1, IR);
        dots(c, BD, [8, 8, 9, 9, 16, 7]);
      }
      return () => u && dots(c, BL, [24, b + 1, 21, b + 1]);
    },
    sw: 18,
    s(c, u) {
      const b = 20;
      crate(c, 1, u ? 5 : 3, 16, b);
      if (!u) {
        c.rect(1, 3, 16, 5, WL);
        c.row(5, 1, 16, WD);
        dots(c, ST, [3, 4, 9, 4, 14, 4]);
        c.rect(7, 12, 8, 13, NI);
        c.set(7, 12, C.glow); // an eye at the knot hole
      } else {
        c.rect(3, 5, 14, 6, NI);
        dots(c, C.straw, [4, 5, 8, 4, 12, 5]);
        c.line(2, 4, 15, 1, WL); // the lid, askew on top
        c.line(2, 5, 15, 2, W);
        c.rect(7, 12, 8, 13, NI);
      }
    },
  });
};
