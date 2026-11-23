/* Horror, part 1: hooks, cages, the rusty ward. */
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
    FAT = hex('#c9b79a'),
    NI = C.night,
    SACK = hex('#8f8168'),
    TILE = hex('#73857a'),
    ENAM = hex('#c9c4b2'),
    LEATHER = hex('#5e3a28'),
    CANV = hex('#59614f');

  /* ---------- chains and hooks ---------- */
  O('chains-hooks-hanging', 'chains hanging with meat hooks rusty iron ceiling rail butcher slaughterhouse', {
    w: 24,
    h: 46,
    solid: false,
    f(c, u) {
      c.rect(1, 1, 22, 2, RU);
      c.row(1, 1, 22, RL);
      dots(c, ID, [3, 2, 10, 2, 17, 2, 21, 2]);
      const hs = [[5, 27], [12, 34], [19, 21]];
      for (const [x, y] of hs) {
        chain(c, x, 3, y, IR);
        hook(c, x, y + 1, ST);
        if (u) {
          c.set(x + 1, y + 4, BL);
          c.set(x, y + 5, BL);
          c.set(x - 1, y + 4, BL);
        }
      }
      rusty(c, 1, 3, 22, 34, 2, 6);
      if (u) {
        c.rect(10, 38, 13, 41, MEAT); // a scrap left on the long hook
        c.rect(11, 42, 12, 43, MEAT);
        c.col(10, 38, 40, MEATL);
        c.set(12, 39, FAT);
        c.set(13, 37, ST);
      }
      return () => {
        if (!u) return;
        drip(c, 12, 44, 1);
        c.set(5, 34, BL);
        c.set(19, 28, BL);
        c.set(19, 30, BD);
      };
    },
    sw: 9,
    s(c, u) {
      c.rect(2, 1, 6, 2, RU);
      c.row(1, 2, 6, RL);
      chain(c, 4, 3, 34, IR);
      for (const y of [21, 27, 34]) {
        hook(c, 4, y + 1, ST);
        if (u) {
          c.set(5, y + 4, BL);
          c.set(4, y + 5, BL);
        }
      }
      rusty(c, 1, 3, 8, 34, 2, 6);
      if (u) {
        c.rect(3, 38, 5, 41, MEAT);
        c.rect(4, 42, 4, 43, MEAT);
        c.col(3, 38, 40, MEATL);
      }
      return () => u && drip(c, 4, 44, 1);
    },
  });

  function carcass(c, x, y, h, w = 6) {
    const x0 = x - (w >> 1),
      x1 = x0 + w - 1;
    c.rect(x - 1, y, x, y + 2, FAT);
    c.rect(x0 + 1, y + 3, x1 - 1, y + 4, MEAT);
    c.rect(x0, y + 5, x1, y + h - 5, MEAT);
    c.rect(x0 + 1, y + h - 4, x1 - 1, y + h - 2, MEAT);
    c.rect(x - 1, y + h - 1, x, y + h - 1, BL);
    c.col(x0, y + 5, y + h - 5, MEATL);
    c.set(x0 + 1, y + 3, MEATL);
    for (let yy = y + 6; yy < y + h - 6; yy += 2) c.row(yy, x0 + 1, x1 - 1, FAT);
    if (w > 4) c.col(x, y + 5, y + h - 3, BD);
    c.col(x1, y + 6, y + h - 5, D(MEAT));
  }
  O('hook-rack-meat', 'butcher hook rack with hanging meat carcasses iron rail sides of flesh slaughterhouse', {
    w: 40,
    h: 40,
    f(c, u) {
      const b = 38;
      for (const x of [2, 36]) {
        c.rect(x, 3, x + 1, b, IR);
        c.col(x, 3, b, L(IR));
        c.rect(x - 1, b - 1, x + 2, b, ID);
      }
      c.rect(1, 3, 38, 4, IR);
      c.row(3, 1, 38, L(IR));
      rusty(c, 1, 3, 38, b, 3, 4);
      [9, 17, 25, 32].forEach((x, i) => {
        const gone = i === 2 || (u && i === 1);
        c.set(x, 5, ID);
        hook(c, x, 6, ST);
        if (!gone) carcass(c, x, 9, [21, 24, 0, 19][i], i === 3 ? 5 : 6);
      });
      if (u) dots(c, BL, [18, 9, 17, 10, 17, 8]);
      return () => {
        dots(c, BL, [9, b, 32, b - 1]);
        dots(c, BD, [10, b, 31, b]);
        if (u) {
          pool(c, 12, 22, b);
          drip(c, 17, 11, 3);
          c.set(17, 20, BL);
          c.set(17, 27, BL);
        }
      };
    },
    sw: 14,
    s(c, u) {
      const b = 38;
      c.rect(6, 3, 7, b, IR);
      c.col(6, 3, b, L(IR));
      c.rect(2, b - 1, 11, b, ID);
      c.row(b - 1, 2, 11, IR);
      c.rect(5, 3, 8, 4, IR);
      rusty(c, 1, 3, 12, b, 3, 4);
      hook(c, 7, 6, ST);
      carcass(c, 7, 9, 21, 4);
      if (u) {
        hook(c, 10, 6, ST);
        c.set(10, 11, BL);
        c.set(9, 5, ID);
      }
      return () => {
        c.set(7, b, BL);
        if (u) {
          pool(c, 3, 11, b);
          drip(c, 10, 12, 2);
        }
      };
    },
  });

  /* ---------- cages ---------- */
  function cageBox(c, x0, y0, x1, y1, inside, step = 3) {
    c.rect(x0, y0, x1, y1, NI);
    if (inside) inside();
    bars(c, x0, x1, y0, y1, IR, step);
    c.col(x0, y0, y1, L(IR));
    c.rect(x0, y0, x1, y0 + 1, RU);
    c.row(y0, x0, x1, RL);
    c.rect(x0, y1 - 1, x1, y1, RU);
    c.row(y1 - 1, x0, x1, RL);
    c.row((y0 + y1) >> 1, x0, x1, ID);
    rusty(c, x0, y0 + 2, x1, y1 - 2, x0 + y1, 7);
  }
  O('cage-hanging-box-rusted', 'steel cage hanging on a chain rusty box prisoner huddled inside trapdoor', {
    w: 22,
    h: 50,
    f(c, u) {
      chain(c, 10, 1, 10, IR);
      cageBox(c, 3, 11, 18, 38, () => {
        if (u) return;
        c.rect(6, 27, 15, 36, D(SACK));
        c.oval(7, 21, 13, 27, PALE);
        dots(c, NI, [9, 24, 11, 24]);
        c.row(29, 7, 14, SACK);
      });
      if (!u) {
        c.col(8, 33, 42, PALE); // an arm hanging out
        c.col(7, 33, 36, D(SACK));
        c.set(7, 43, PALE);
        c.set(8, 43, D(PALE));
      } else {
        c.rect(3, 37, 18, 38, NI); // the floor hatch hangs open
        bars(c, 3, 18, 37, 38, IR);
        c.rect(3, 39, 4, 47, RU);
        c.col(3, 39, 47, RL);
        c.set(4, 43, ID);
        dots(c, BL, [9, 30, 12, 26, 13, 33]);
      }
      return () => {
        if (u) {
          drip(c, 11, 39, 2);
          c.set(14, 39, BL);
          pool(c, 8, 16, 48);
        } else c.set(8, 45, BL);
      };
    },
    sw: 16,
    s(c, u) {
      chain(c, 7, 1, 10, IR);
      cageBox(c, 3, 11, 12, 38, () => {
        if (u) return;
        c.rect(5, 27, 10, 36, D(SACK));
        c.oval(5, 21, 10, 27, PALE);
        c.set(9, 24, NI);
      });
      if (!u) {
        c.col(11, 33, 42, PALE);
        c.set(11, 43, D(PALE));
      } else {
        c.rect(3, 37, 12, 38, NI);
        bars(c, 3, 12, 37, 38, IR);
        c.rect(3, 39, 12, 46, RU);
        c.frame(3, 39, 12, 46, RD);
        c.row(39, 3, 12, RL);
        dots(c, ID, [5, 41, 10, 41, 5, 44, 10, 44]);
        dots(c, BL, [7, 30, 9, 26]);
      }
      return () => {
        if (u) pool(c, 3, 11, 48);
        else c.set(11, 45, BL);
      };
    },
  });
  O('cage-floor-creature', 'low iron cage on the floor with something inside eyes creature kennel crate padlock', {
    w: 30,
    h: 22,
    uw: 37,
    f(c, u) {
      const b = 20;
      cageBox(c, 1, 3, 28, b, () => {
        if (u) return dots(c, BD, [9, 17, 10, 18, 14, 18, 18, 17]);
        c.oval(5, 10, 20, 19, mix(PALE, 0.5)); // something hunched, and it is awake
        c.oval(14, 6, 23, 14, mix(PALE, 0.75));
        c.row(19, 5, 22, mix(PALE, 0.35));
        c.rect(17, 10, 18, 10, C.glow);
        c.rect(20, 10, 21, 10, C.glow);
        c.rect(17, 12, 21, 12, NI);
        dots(c, mix(PALE, 0.35), [8, 13, 11, 12, 13, 14, 9, 16]);
        c.rect(23, 16, 24, 18, mix(PALE, 0.75)); // a hand on the floor of the cage
      });
      if (u) {
        c.frame(29, 4, 34, b, IR); // the end door swung out
        c.col(31, 4, b, IR);
        c.col(33, 4, b, D(IR));
        c.row(12, 29, 34, ID);
        rusty(c, 29, 4, 34, b, 9, 6);
      } else {
        c.rect(26, 10, 27, 12, C.brass);
        c.set(26, 9, ST);
        c.set(27, 9, ST);
      }
      return () => {
        if (!u) return;
        dots(c, BL, [30, b, 32, b]);
      };
    },
    sw: 18,
    suw: 26,
    s(c, u) {
      const b = 20;
      cageBox(c, 1, 3, 16, b, () => {
        if (!u) dots(c, C.glow, [6, 10, 9, 10]);
      });
      if (!u) {
        c.frame(2, 5, 15, b - 2, ST);
        c.rect(13, 11, 14, 13, C.brass);
        c.row(10, 13, 14, ST);
      } else {
        c.rect(3, 6, 14, b - 2, NI);
        c.frame(2, 5, 15, b - 2, ID);
        dots(c, BD, [5, b - 2, 8, b - 2, 9, b - 3]);
        c.frame(17, 5, 23, b - 1, ST); // the door, open to the right
        c.col(19, 5, b - 1, IR);
        c.col(21, 5, b - 1, IR);
        c.row(12, 17, 23, ID);
      }
      return () => {
        if (u) dots(c, BL, [10, b, 13, b, 14, b - 1 + 1]);
      };
    },
  });

  /* ---------- the rusty ward ---------- */
  O('bed-frame-rusty-straps', 'rusty iron bed frame with leather straps bare springs no mattress restraint asylum', {
    w: 40,
    h: 22,
    base: 'side',
    f(c, u) {
      const b = 20;
      c.rect(1, 2, 2, b, IR);
      c.col(1, 2, b, L(IR));
      c.rect(37, 8, 38, b, IR);
      c.col(37, 8, b, L(IR));
      c.rect(3, 12, 36, 13, IR);
      c.row(12, 3, 36, L(IR));
      for (let x = 4; x <= 35; x++) c.set(x, 14 + (x % 2), ID);
      c.row(16, 4, 35, ID);
      c.rect(5, 16, 6, b, ID);
      c.rect(32, 16, 33, b, ID);
      rusty(c, 1, 2, 38, b, 5, 3);
      for (const x of [8, 18, 28]) {
        if (!u) {
          c.col(x, 9, 13, LEATHER);
          c.col(x + 4, 9, 13, LEATHER);
          c.row(8, x + 1, x + 3, LEATHER);
          c.set(x + 2, 8, C.brass);
          c.set(x, 9, L(LEATHER));
        } else {
          c.col(x, 12, 17, LEATHER);
          c.set(x, 18, C.brass);
          c.row(11, x + 1, x + 5, LEATHER);
          c.set(x + 6, 10, LEATHER);
        }
      }
      if (u) dots(c, BL, [13, 12, 14, 12, 15, 12, 22, 12, 23, 13, 14, 13]);
      return () => u && (drip(c, 14, 15, 2), drip(c, 23, 15, 1), pool(c, 11, 18, b));
    },
    sw: 20,
    sh: 34,
    s(c, u) {
      const b = 32;
      // head rail
      c.col(1, 2, 24, IR);
      c.col(18, 2, 24, IR);
      c.row(3, 1, 18, IR);
      c.row(8, 1, 18, ID);
      for (let x = 4; x <= 16; x += 3) c.col(x, 4, 12, ID);
      // the wire mesh
      c.rect(2, 12, 17, 24, NI);
      for (let y = 12; y <= 24; y++) for (let x = 2; x <= 17; x++) if ((x + y) % 3 === 0 || (x - y + 30) % 3 === 0) c.set(x, y, (x + y) % 2 ? RD : ID);
      c.col(1, 12, 24, L(IR));
      // foot rail
      c.col(1, 22, b, IR);
      c.col(18, 22, b, IR);
      c.row(23, 1, 18, IR);
      c.row(b - 4, 1, 18, IR);
      for (let x = 4; x <= 16; x += 3) c.col(x, 24, b - 5, ID);
      rusty(c, 1, 2, 18, b, 6, 4);
      for (const y of [14, 17, 20]) {
        if (!u) {
          c.row(y, 2, 17, LEATHER);
          c.row(y - 1, 7, 12, LEATHER);
          c.row(y, 7, 12, D(LEATHER));
          c.set(9, y - 1, C.brass);
          c.set(10, y - 1, C.brass);
        } else {
          c.row(y, 2, 6, LEATHER);
          c.row(y, 13, 17, LEATHER);
          c.set(7, y - 1, LEATHER);
          c.set(12, y + 1, C.brass);
        }
      }
      if (u) {
        c.oval(7, 15, 12, 20, BD);
        dots(c, BL, [8, 16, 10, 18, 9, 19, 11, 17]);
      }
    },
  });

  O('surgical-chair-rusty', 'surgical chair rusty cracked green leather straps examination dentist torture pedestal', {
    w: 30,
    h: 33,
    base: 'side',
    f(c, u) {
      const b = 31;
      c.rect(9, b - 1, 22, b, ID);
      c.row(b - 1, 9, 22, IR);
      c.rect(14, b - 9, 16, b - 2, IR);
      c.col(14, b - 9, b - 2, L(IR));
      c.row(b - 4, 17, 20, IR);
      c.rect(8, b - 12, 21, b - 10, TILE);
      c.row(b - 12, 8, 21, L(TILE));
      c.row(b - 10, 8, 21, ID);
      c.poly([[8, b - 12], [11, b - 12], [6, b - 27], [3, b - 27]], TILE);
      c.line(3, b - 27, 8, b - 12, L(TILE));
      c.rect(2, b - 30, 6, b - 28, D(TILE));
      c.row(b - 30, 2, 6, TILE);
      for (let i = 0; i < 3; i++) c.line(21, b - 12 + i, 27, b - 5 + i, i === 2 ? D(TILE) : TILE);
      c.rect(26, b - 3, 28, b - 2, IR);
      c.rect(9, b - 17, 18, b - 16, IR);
      c.row(b - 17, 9, 18, L(IR));
      c.col(17, b - 15, b - 13, IR);
      c.speckle(3, b - 27, 27, b - 3, D(TILE), 7, 3);
      rusty(c, 9, b - 17, 22, b, 4, 4);
      if (!u) {
        c.rect(12, b - 18, 13, b - 15, LEATHER);
        c.set(12, b - 18, C.brass);
        c.line(5, b - 22, 9, b - 21, LEATHER);
        c.set(7, b - 22, C.brass);
        c.rect(24, b - 9, 25, b - 6, LEATHER);
      } else {
        c.col(12, b - 15, b - 9, LEATHER);
        c.set(12, b - 8, C.brass);
        c.col(4, b - 22, b - 14, LEATHER);
        c.set(4, b - 13, C.brass);
        c.rect(12, b - 12, 18, b - 12, BL);
        c.row(b - 11, 14, 17, BD);
        dots(c, BL, [7, b - 19, 8, b - 16, 23, b - 9, 9, b - 14]);
      }
      return () => u && (drip(c, 19, b - 9, 3), pool(c, 17, 24, b), c.set(26, b, BL));
    },
    sw: 18,
    s(c, u) {
      const b = 31;
      c.rect(3, b - 1, 14, b, ID);
      c.row(b - 1, 3, 14, IR);
      c.rect(8, b - 8, 9, b - 2, IR);
      c.rect(5, b - 9, 12, b - 3, TILE);
      c.col(5, b - 9, b - 3, L(TILE));
      c.col(8, b - 9, b - 3, D(TILE));
      c.col(9, b - 9, b - 3, D(TILE));
      c.rect(4, b - 3, 7, b - 2, IR);
      c.rect(10, b - 3, 13, b - 2, IR);
      c.rect(4, b - 12, 13, b - 10, TILE);
      c.row(b - 12, 4, 13, L(TILE));
      c.row(b - 10, 4, 13, D(TILE));
      c.rect(5, b - 27, 12, b - 13, TILE);
      c.col(5, b - 27, b - 13, L(TILE));
      c.rect(6, b - 30, 11, b - 28, D(TILE));
      c.row(b - 30, 6, 11, TILE);
      for (const x of [1, 14]) {
        c.rect(x, b - 17, x + 2, b - 16, IR);
        c.row(b - 17, x, x + 2, L(IR));
        c.col(x + 1, b - 15, b - 11, IR);
      }
      c.speckle(4, b - 27, 13, b - 3, D(TILE), 7, 3);
      rusty(c, 1, b - 17, 16, b, 4, 4);
      if (!u) {
        c.row(b - 21, 5, 12, LEATHER);
        c.rect(8, b - 21, 9, b - 21, C.brass);
        c.row(b - 18, 1, 3, LEATHER);
        c.row(b - 18, 14, 16, LEATHER);
        c.row(b - 6, 5, 12, LEATHER);
      } else {
        c.col(5, b - 21, b - 15, LEATHER);
        c.col(12, b - 21, b - 14, LEATHER);
        c.set(12, b - 13, C.brass);
        c.col(1, b - 17, b - 11, LEATHER);
        c.rect(6, b - 12, 11, b - 12, BL);
        c.rect(7, b - 11, 10, b - 11, BD);
        dots(c, BL, [7, b - 18, 9, b - 16, 10, b - 20, 8, b - 14]);
      }
      return () => u && (drip(c, 8, b - 9, 4), pool(c, 5, 12, b));
    },
  });

  O('tool-table-rusty', 'steel table of rusty tools saw hammer pliers bloody rag instrument trolley torture', {
    w: 30,
    h: 20,
    f(c, u) {
      const b = 18,
        WD = C.wood;
      c.rect(1, 7, 28, 8, ST);
      c.row(7, 1, 28, L(ST));
      c.col(2, 9, b - 1, IR);
      c.col(27, 9, b - 1, IR);
      c.rect(1, b, 3, b, ID);
      c.rect(26, b, 28, b, ID);
      c.row(14, 3, 26, IR);
      c.rect(12, 11, 18, 13, ST); // a dish below
      c.row(11, 12, 18, L(ST));
      c.set(14, 10, RU);
      c.set(16, 10, BD);
      if (!u) {
        c.rect(3, 5, 10, 6, ST); // the saw
        for (let x = 3; x <= 10; x += 2) c.set(x, 6, ID);
        c.rect(11, 4, 13, 6, WD);
        c.set(12, 5, D(WD));
      }
      c.row(6, 15, 19, WD); // hammer
      c.rect(20, 4, 21, 6, IR);
      c.rect(23, 3, 25, 6, C.glass); // a jar of things
      c.col(23, 3, 6, C.glassLight);
      c.col(23, 1, 2, ST);
      c.col(25, 1, 2, RU);
      c.set(24, 2, IR);
      rusty(c, 1, 1, 28, b, 8, 4);
      c.rect(5, 8, 9, 12, D(ENAM)); // a rag over the edge
      c.row(8, 5, 9, ENAM);
      dots(c, BL, [6, 10, 7, 11, 8, 9]);
      c.clear(5, 12);
      if (u) {
        c.row(7, 3, 13, BL);
        dots(c, BD, [4, 6, 8, 6, 11, 6]);
        c.rect(6, 9, 8, 11, BL);
      }
      return () => u && (drip(c, 11, 9, 4), drip(c, 14, 9, 1), pool(c, 8, 15, b));
    },
    sw: 14,
    s(c, u) {
      const b = 18,
        WD = C.wood;
      c.rect(1, 7, 12, 8, ST);
      c.row(7, 1, 12, L(ST));
      c.col(2, 9, b - 1, IR);
      c.col(11, 9, b - 1, IR);
      c.rect(1, b, 3, b, ID);
      c.rect(10, b, 12, b, ID);
      c.row(14, 3, 10, IR);
      c.rect(4, 11, 9, 13, ST);
      c.row(11, 4, 9, L(ST));
      if (!u) {
        c.rect(8, 4, 10, 6, WD);
        c.set(9, 5, D(WD));
      }
      c.rect(2, 4, 3, 6, IR);
      c.rect(4, 3, 6, 6, C.glass);
      c.col(4, 3, 6, C.glassLight);
      c.col(4, 1, 2, ST);
      c.col(6, 1, 2, RU);
      rusty(c, 1, 1, 12, b, 8, 4);
      c.rect(8, 8, 11, 12, D(ENAM));
      c.row(8, 8, 11, ENAM);
      dots(c, BL, [9, 10, 10, 11]);
      if (u) {
        c.row(7, 6, 11, BL);
        c.rect(9, 9, 10, 11, BL);
      }
      return () => u && (drip(c, 7, 9, 4), pool(c, 4, 10, b));
    },
  });

  /* ---------- the wheelchair ---------- */
  const wcSide = (blood) =>
    part(22, 25, (t) => {
      const b = 24;
      t.rect(4, b - 23, 5, b - 12, CANV); // back
      t.col(4, b - 23, b - 12, L(CANV));
      t.row(b - 23, 1, 4, IR); // handle
      t.set(1, b - 22, ID);
      t.rect(5, b - 12, 17, b - 11, D(CANV)); // seat
      t.row(b - 12, 5, 17, CANV);
      t.row(b - 16, 6, 14, IR); // arm
      t.col(14, b - 15, b - 13, IR);
      t.col(17, b - 10, b - 3, IR);
      t.row(b - 2, 17, 20, IR);
      t.set(20, b - 3, ID);
      t.rect(14, b - 3, 16, b, ID); // castor
      t.set(15, b - 1, ST);
      ring(t, 0, b - 13, 13, b, ID); // the big wheel
      ring(t, 1, b - 12, 12, b - 1, IR);
      t.line(7, b - 11, 6, b - 2, ST);
      t.line(2, b - 6, 11, b - 7, ST);
      t.line(3, b - 10, 10, b - 3, ST);
      t.line(10, b - 10, 3, b - 3, ST);
      t.rect(6, b - 7, 7, b - 6, RU);
      rusty(t, 0, 0, 21, b, 3, 5);
      if (blood) {
        t.row(b - 12, 8, 13, BL);
        t.set(5, b - 16, BL);
      }
    });
  const wcFront = (blood) =>
    part(20, 26, (t) => {
      const b = 25;
      t.rect(1, b - 13, 2, b, ID);
      t.col(1, b - 12, b - 1, IR);
      t.rect(17, b - 13, 18, b, ID);
      t.col(17, b - 12, b - 1, IR);
      t.rect(4, b - 23, 15, b - 12, CANV);
      t.row(b - 23, 4, 15, L(CANV));
      t.col(4, b - 23, b - 12, L(CANV));
      t.row(b - 18, 5, 14, D(CANV));
      t.rect(3, b - 25, 4, b - 22, IR);
      t.rect(15, b - 25, 16, b - 22, IR);
      t.rect(4, b - 12, 15, b - 10, D(CANV));
      t.row(b - 12, 4, 15, CANV);
      t.rect(3, b - 16, 4, b - 11, IR);
      t.rect(15, b - 16, 16, b - 11, IR);
      t.col(5, b - 9, b - 3, IR);
      t.col(14, b - 9, b - 3, IR);
      t.line(6, b - 9, 13, b - 5, ID);
      t.line(13, b - 9, 6, b - 5, ID);
      t.row(b - 2, 4, 8, IR);
      t.row(b - 2, 11, 15, IR);
      t.rect(5, b - 1, 6, b, ID);
      t.rect(13, b - 1, 14, b, ID);
      rusty(t, 0, 0, 19, b, 3, 5);
      if (blood) {
        t.row(b - 12, 7, 12, BL);
        t.set(9, b - 11, BD);
        t.set(8, b - 15, BL);
      }
    });
  O('wheelchair-overturned', 'wheelchair overturned tipped on its back rusty wheels spinning hospital asylum', {
    w: 27,
    h: 24,
    base: 'side',
    uw: 24,
    uh: 27,
    f(c, u) {
      if (u) c.stamp(wcSide(true), 1, 1);
      else c.stamp(turn(wcSide(false)), 1, 1);
    },
    sw: 22,
    sh: 20,
    suw: 22,
    suh: 28,
    s(c, u) {
      if (u) return void c.stamp(wcFront(true), 1, 1);
      const b = 18;
      c.rect(2, b - 13, 3, b, ID);
      c.col(2, b - 12, b - 1, IR);
      c.rect(18, b - 13, 19, b, ID);
      c.col(18, b - 12, b - 1, IR);
      c.rect(5, b - 12, 16, b - 2, D(CANV)); // the underside of the seat
      c.row(b - 12, 5, 16, CANV);
      c.line(6, b - 11, 15, b - 3, IR);
      c.line(15, b - 11, 6, b - 3, IR);
      c.rect(5, b - 1, 16, b, CANV);
      c.rect(4, b - 12, 4, b, IR);
      c.rect(17, b - 12, 17, b, IR);
      c.col(6, b - 15, b - 13, IR); // foot plates in the air
      c.col(15, b - 15, b - 13, IR);
      c.row(b - 16, 5, 9, IR);
      c.row(b - 16, 12, 16, IR);
      c.rect(10, b - 14, 11, b - 13, ID);
      rusty(c, 1, 1, 20, b, 3, 5);
    },
  });

  /* ---------- the bath ---------- */
  O('bathtub-blood', 'bathtub full of blood clawfoot bath rusty enamel red water hand', {
    w: 38,
    h: 22,
    base: 'side',
    f(c, u) {
      const b = 20;
      c.poly([[2, 8], [35, 8], [32, 17], [5, 17]], ENAM);
      c.rect(1, 6, 36, 7, ENAM);
      c.row(6, 1, 36, L(ENAM));
      c.row(6, 3, 34, BL);
      c.row(16, 6, 31, D(ENAM));
      c.row(17, 5, 32, D(ENAM));
      c.line(2, 8, 5, 17, L(ENAM));
      c.rect(6, 18, 8, b, IR);
      c.rect(29, 18, 31, b, IR);
      c.set(6, 18, C.brass);
      c.set(29, 18, C.brass);
      c.col(3, 2, 5, ST);
      c.row(2, 3, 6, ST);
      c.set(6, 3, ST);
      c.set(2, 3, C.brass);
      c.speckle(3, 8, 34, 16, RU, 12, 5);
      c.col(4, 8, 13, RU);
      for (const [x, n] of u ? [[10, 7], [14, 9], [20, 5], [23, 8], [27, 9], [31, 4]] : [[10, 5], [20, 3], [27, 7]]) c.col(x, 7, 7 + n, x % 2 ? BL : BD);
      if (u) {
        c.rect(17, 3, 18, 6, PALE); // an arm comes up
        c.rect(16, 2, 19, 3, PALE);
        dots(c, PALE, [16, 1, 18, 1, 19, 1, 15, 2]);
        dots(c, BL, [17, 5, 18, 4, 17, 6, 18, 6]);
        c.row(7, 3, 34, BL);
      }
      return () => {
        c.set(6, 5, BL);
        if (u) {
          pool(c, 10, 28, b);
          c.set(33, b, BL);
        }
      };
    },
    sw: 20,
    s(c, u) {
      const b = 20;
      c.poly([[2, 7], [17, 7], [15, 17], [4, 17]], ENAM);
      c.oval(1, 4, 18, 8, ENAM);
      c.oval(3, 5, 16, 7, BL);
      c.row(5, 6, 13, BD);
      c.row(4, 4, 15, L(ENAM));
      c.row(16, 5, 14, D(ENAM));
      c.row(17, 4, 15, D(ENAM));
      c.line(2, 8, 4, 17, L(ENAM));
      c.rect(4, 18, 6, b, IR);
      c.rect(13, 18, 15, b, IR);
      c.set(4, 18, C.brass);
      c.set(13, 18, C.brass);
      c.col(9, 1, 4, ST);
      c.row(1, 8, 11, ST);
      c.set(7, 2, C.brass);
      c.set(12, 2, C.brass);
      c.speckle(3, 9, 16, 16, RU, 10, 5);
      for (const [x, n] of u ? [[5, 7], [8, 9], [11, 5], [14, 8]] : [[6, 4], [12, 6]]) c.col(x, 8, 8 + n, x % 2 ? BL : BD);
      if (u) {
        c.rect(11, 2, 12, 6, PALE);
        c.rect(10, 1, 13, 2, PALE);
        dots(c, PALE, [14, 2]);
        dots(c, BL, [11, 5, 12, 4, 11, 6, 12, 6]);
        c.row(8, 3, 16, BL);
      }
      return () => u && pool(c, 4, 15, b);
    },
  });

  /* ---------- barbed wire ---------- */
  const wireCol = (i) => (i % 2 ? ST : blend(IR, RU, 0.5));
  O('barbed-wire-coil', 'coil of barbed wire razor wire concertina rusty fence', {
    w: 28,
    h: 16,
    shade: false,
    outline: false,
    f(c, u) {
      const t = part(27, 15, (t) => {
        for (let i = 0; i < 5; i++) {
          ring(t, 1 + i * 4, 1, 9 + i * 4, 13, wireCol(i));
          dots(t, L(ST), [1 + i * 4, 5, 5 + i * 4, 0, 9 + i * 4, 9, 4 + i * 4, 14, 2 + i * 4, 11]);
        }
        dots(t, RU, [3, 2, 12, 12, 20, 2, 24, 11]);
        if (u) dots(t, BL, [9, 5, 13, 0, 13, 9, 8, 14, 12, 1, 10, 11]);
      });
      shadowed(c, t, 0, 0);
      if (u) {
        c.rect(12, 4, 14, 7, D(ENAM)); // a scrap of cloth caught
        c.rect(12, 4, 13, 5, ENAM);
        c.set(14, 8, D(ENAM));
        c.set(13, 6, BL);
        c.set(13, 15, BL);
        c.set(11, 15, BD);
      }
    },
    sw: 17,
    s(c, u) {
      const t = part(16, 15, (t) => {
        ring(t, 2, 1, 14, 13, IR);
        ring(t, 1, 1, 13, 13, ST);
        dots(t, L(ST), [1, 5, 7, 0, 13, 9, 6, 14, 3, 11, 12, 3]);
        dots(t, RU, [3, 2, 11, 12]);
        if (u) dots(t, BL, [13, 5, 12, 9, 7, 1, 13, 7]);
      });
      shadowed(c, t, 0, 0);
      if (u) {
        c.rect(11, 5, 13, 8, D(ENAM));
        c.rect(11, 5, 12, 6, ENAM);
        c.set(12, 7, BL);
        c.set(12, 15, BL);
      }
    },
  });
};
