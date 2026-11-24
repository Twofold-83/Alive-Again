/* The nineteen-twenties, part d: the barber's and the drug store, the asylum, and what the expedition brought
 * back. Part of tools/big/env2-twenties.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, flame, wisp, bottle, type, sheet, deco, crate, rod, shards, blood, stones } = H;
  const add = H.reg('env-twenties', "1920's");
  const { OAK, OAKD, MAH, WAL, EB, BAKE, NICK, BR, GILT, GRN, OX, CREAM, TEAL, NAVY, GLASSD, MARB, VERD, AMBER, LIT, INK, VELVET, ENAMEL } = H.P;
  const DARKIN = hex('#17151c');
  const LEATH = hex('#5a3524'),
    PALE = hex('#a8b09a'), // dead skin
    SLIME = hex('#6f8a5a'),
    TENT = hex('#77557c'),
    GHOSTF = hex('#8fd0a0'),
    ASYL = hex('#5c6a5e');

  /* ---------- the barber and the drug store ---------- */
  add('twenties-barber-chair-porcelain', 'barber chair porcelain nickel oxblood leather footrest headrest shave barbershop', {
    w: 22, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(8, 2, 13, 4, OX); // headrest
      c.row(2, 9, 12, L(OX));
      c.rect(10, 5, 11, 5, NICK);
      c.rect(6, 6, 15, 15, OX); // the back
      c.frame(5, 5, 16, 16, NICK);
      c.clear(5, 5);
      c.clear(16, 5);
      c.col(6, 6, 15, L(OX));
      dots(c, D(OX), [9, 9, 12, 9, 9, 12, 12, 12]);
      for (const x of [3, 16]) {
        c.rect(x, 13, x + 2, 20, ENAMEL); // porcelain arms
        c.row(13, x, x + 2, C.white);
        c.row(12, x, x + 2, OX);
      }
      c.rect(6, 16, 15, 19, OX); // seat
      c.row(16, 6, 15, L(OX));
      c.rect(5, 20, 16, 22, ENAMEL);
      c.row(22, 5, 16, D(ENAMEL));
      c.rect(9, 23, 12, 28, ENAMEL); // pedestal
      c.col(9, 23, 28, C.white);
      c.col(12, 23, 28, D(ENAMEL));
      c.rect(5, 25, 16, 26, NICK); // footrest
      c.row(25, 5, 16, L(NICK));
      for (let x = 6; x <= 15; x += 2) c.set(x, 26, D(NICK));
      c.oval(4, 29, 17, b, ENAMEL);
      c.row(b, 6, 15, NICK);
      c.row(29, 7, 14, C.white);
      c.col(19, 15, 22, NICK); // the lever
      c.rect(19, 13, 20, 14, EB);
      c.set(18, 22, NICK);
      if (u) {
        c.poly([[6, 6], [15, 6], [16, 18], [5, 18]], C.white); // the sheet left over it, and not only soap on it
        c.line(8, 7, 7, 17, D(C.white));
        c.line(13, 7, 14, 17, D(C.white));
        blood(c, [10, 8, 11, 8, 10, 9, 11, 10, 10, 11, 12, 12, 11, 13, 10, 15]);
        c.rect(1, 12, 4, 12, NICK); // the razor open on the arm
        c.set(0, 12, EB);
        c.set(4, 12, C.blood);
        blood(c, [3, 21, 3, 24, 4, b]);
      }
    },
    sw: 24, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[3, 3], [6, 2], [7, 5], [4, 5]], OX); // headrest
      c.poly([[4, 6], [7, 6], [10, 17], [7, 17]], OX); // the back, leaning
      c.line(4, 6, 7, 17, NICK);
      c.line(7, 6, 10, 17, D(OX));
      c.rect(7, 16, 17, 19, OX);
      c.row(16, 8, 17, L(OX));
      c.rect(7, 12, 15, 14, ENAMEL); // arm
      c.row(12, 7, 15, C.white);
      c.row(11, 8, 14, OX);
      c.col(14, 15, 16, NICK);
      c.rect(6, 20, 17, 22, ENAMEL);
      c.row(22, 6, 17, D(ENAMEL));
      c.rect(10, 23, 13, 28, ENAMEL);
      c.col(10, 23, 28, C.white);
      c.line(17, 21, 20, 26, NICK); // the footrest out in front
      c.rect(19, 26, 22, 26, NICK);
      c.rect(21, 23, 22, 25, NICK);
      c.oval(5, 29, 18, b, ENAMEL);
      c.row(b, 7, 16, NICK);
      c.row(29, 8, 15, C.white);
      c.line(5, 20, 3, 14, NICK); // lever
      c.rect(2, 12, 3, 13, EB);
      if (u) {
        c.poly([[4, 6], [8, 6], [11, 16], [16, 16], [17, 20], [8, 19]], C.white);
        c.line(8, 6, 11, 16, D(C.white));
        blood(c, [7, 9, 8, 11, 9, 14, 12, 17]);
        c.rect(9, 11, 12, 11, NICK);
        c.set(13, 11, C.blood);
        blood(c, [15, 24, 16, b]);
      }
    },
  });
  add('twenties-barber-pole-glass', 'barber pole striped red white blue glass cylinder barbershop sign street lamp turning', {
    w: 10, h: 38, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.oval(2, 1, 7, 5, u ? C.glow : hex('#b9b6a4')); // the globe on top
      c.set(3, 2, C.white);
      c.rect(2, 6, 7, 7, NICK);
      for (let y = 8; y <= 23; y++)
        for (let x = 3; x <= 6; x++) {
          const k = (((x + y + (u ? 2 : 0)) % 6) + 6) % 6;
          const col = k < 2 ? C.red : k < 4 ? C.white : hex('#3f5f8a');
          c.set(x, y, u ? L(col) : mix(col, 0.86));
        }
      c.col(3, 8, 23, u ? C.white : hex('#c9c2aa'));
      c.rect(2, 24, 7, 25, NICK);
      c.row(24, 2, 7, L(NICK));
      c.rect(4, 26, 5, b - 2, EB); // the post
      c.col(4, 26, b - 2, hex('#4a444c'));
      c.rect(2, b - 1, 7, b, EB);
      if (u) dots(c, C.glow, [0, 3, 9, 3, 1, 0, 8, 0, 1, 12, 8, 18]);
    },
  });
  add('twenties-soda-fountain-counter', 'soda fountain counter drug store marble nickel taps syrup pumps ice cream sundae glasses', {
    w: 40, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 16, 38, 17, MARB);
      c.speckle(1, 16, 38, 17, hex('#8d8a84'), 5, 2);
      face(c, 2, 18, 37, b - 2, ENAMEL);
      for (let x = 4; x <= 30; x += 9) {
        c.frame(x, 20, x + 6, b - 4, D(ENAMEL));
        c.row(b - 4, x, x + 6, C.white);
      }
      c.row(19, 2, 37, TEAL);
      c.row(b - 3, 2, 37, NICK);
      c.rect(2, b - 1, 37, b, EB);
      c.rect(14, 8, 24, 15, NICK); // the draught arms
      c.row(8, 14, 24, L(NICK));
      c.col(14, 8, 15, L(NICK));
      c.col(24, 8, 15, D(NICK));
      for (const x of [16, 19, 22]) {
        c.col(x, 4, 7, EB);
        c.set(x, 4, x === 19 ? C.red : CREAM);
        c.set(x, 11, D(NICK));
        c.set(x, 12, D(NICK));
      }
      c.rect(16, 13, 22, 13, D(NICK));
      const jars = [OX, AMBER, hex('#4a2e22')];
      jars.forEach((col, i) => {
        const x = 3 + i * 3;
        c.rect(x, 10, x + 1, 15, hex('#9ebcc2')); // syrup jars
        c.rect(x, 12, x + 1, 15, col);
        c.row(9, x, x + 1, NICK);
        c.set(x, 8, NICK);
      });
      for (let i = 0; i < 3; i++) {
        c.rect(27 + i * 2, 12, 27 + i * 2, 15, C.glassLight); // glasses upside down
        c.set(27 + i * 2, 12, C.white);
      }
      c.rect(34, 9, 36, 15, hex('#9ebcc2')); // straws
      dots(c, C.red, [34, 8, 36, 7]);
      dots(c, C.white, [35, 7, 34, 7, 36, 8]);
      c.row(15, 34, 36, NICK);
      if (u) {
        c.rect(10, 11, 12, 15, hex('#c9a7a0')); // a strawberry soda drawn and left
        c.row(10, 10, 12, C.white);
        c.row(11, 10, 12, C.white);
        c.line(12, 9, 13, 6, C.red);
        c.set(19, 14, hex('#9ebcc2')); // the tap still dripping
        c.set(19, 15, hex('#9ebcc2'));
        c.rect(30, 14, 33, 15, C.glassLight); // a sundae
        c.rect(30, 12, 33, 13, C.white);
        c.set(31, 11, C.red);
        c.set(32, 12, hex('#4a2e22'));
        c.rect(25, 15, 26, 15, NICK);
      }
    },
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 16, 12, 17, MARB);
      face(c, 2, 18, 11, b - 2, ENAMEL);
      c.frame(4, 20, 9, b - 4, D(ENAMEL));
      c.row(19, 2, 11, TEAL);
      c.row(b - 3, 2, 11, NICK);
      c.rect(2, b - 1, 11, b, EB);
      c.rect(4, 8, 8, 15, NICK);
      c.col(4, 8, 15, L(NICK));
      c.col(6, 4, 7, EB);
      c.set(6, 4, CREAM);
      c.rect(9, 10, 10, 11, D(NICK)); // the spout towards the customer
      c.set(10, 12, D(NICK));
      c.rect(2, 12, 3, 15, OX);
      c.row(11, 2, 3, hex('#9ebcc2'));
      if (u) {
        c.rect(10, 12, 11, 15, hex('#c9a7a0'));
        c.row(11, 10, 11, C.white);
        c.set(12, 9, C.red);
      }
    },
  });

  /* ---------- the asylum ---------- */
  const strap = (c, x0, x1, y, open) => {
    c.row(y, x0, x1, LEATH);
    c.set((x0 + x1) >> 1, y, open ? LEATH : NICK);
  };
  add('twenties-asylum-restraint-chair', 'asylum restraint chair tranquilizer chair oak leather straps buckles madhouse sanatorium', {
    w: 18, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 4, 2, 13, 20, OAK); // the tall back
      c.rect(5, 3, 12, 8, DARKIN); // the box that shuts about the head
      c.frame(5, 3, 12, 8, OAKD);
      panel(c, 5, 10, 12, 19, OAK);
      for (const x of [2, 13]) {
        c.rect(x, 16, x + 2, 18, OAK); // arms
        c.row(16, x, x + 2, L(OAK));
        c.rect(x, 19, x + 1, b, OAKD);
      }
      face(c, 3, 21, 14, 24, OAK);
      c.rect(4, 25, 13, b - 1, mix(OAK, 0.7));
      legs(c, [3, 13], 25, b, OAKD);
      c.rect(1, b, 3, b, C.iron); // bolted to the floor
      c.rect(14, b, 16, b, C.iron);
      if (!u) {
        strap(c, 5, 12, 6, false);
        strap(c, 4, 13, 13, false);
        strap(c, 2, 4, 17, false);
        strap(c, 13, 15, 17, false);
        strap(c, 3, 5, b - 3, false);
        strap(c, 12, 14, b - 3, false);
      } else {
        c.line(5, 6, 3, 10, LEATH); // every strap undone, one torn through
        c.set(3, 11, NICK);
        c.line(13, 13, 15, 15, LEATH);
        c.line(4, 13, 6, 13, LEATH);
        c.line(2, 18, 1, 22, LEATH);
        c.set(1, 23, NICK);
        c.line(15, 18, 16, 21, LEATH);
        c.line(3, b - 3, 2, b - 1, LEATH);
        dots(c, K, [7, 14, 8, 15, 9, 14, 10, 16, 14, 16]); // scratches in the oak
        blood(c, [13, 17, 14, 19, 8, 22, 9, 22, 7, b]);
      }
    },
    sw: 16, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 4, 24, OAK);
      c.col(2, 2, 24, L(OAK));
      c.rect(5, 3, 8, 8, OAKD); // the head box in profile
      c.row(3, 5, 8, OAK);
      c.rect(5, 16, 12, 18, OAK);
      c.row(16, 5, 12, L(OAK));
      c.col(11, 19, 20, OAKD);
      face(c, 3, 21, 12, 24, OAK);
      c.rect(4, 25, 11, b - 1, mix(OAK, 0.7));
      legs(c, [2, 11], 25, b, OAKD);
      c.rect(12, b, 14, b, C.iron);
      if (!u) {
        c.col(8, 15, 19, LEATH);
        c.set(8, 17, NICK);
        c.col(11, b - 5, b - 2, LEATH);
        c.set(12, b - 3, NICK);
        c.row(13, 3, 5, LEATH);
      } else {
        c.line(8, 18, 9, 23, LEATH);
        c.set(9, 24, NICK);
        c.line(12, b - 4, 14, b - 1, LEATH);
        c.line(5, 13, 7, 14, LEATH);
        blood(c, [10, 17, 11, 20, 13, b]);
      }
    },
  });
  add('twenties-asylum-cell-door-steel', 'asylum cell door steel riveted observation hatch padded cell sanatorium prison bolts', {
    w: 22, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 20, b, hex('#77747a')); // stone jamb
      c.col(1, 1, b, hex('#9a979a'));
      c.row(1, 1, 20, hex('#9a979a'));
      face(c, 3, 3, 18, b, ASYL);
      for (let y = 5; y <= b - 2; y += 6) dots(c, D(ASYL), [4, y, 17, y]);
      c.row(15, 4, 17, D(ASYL));
      c.row(29, 4, 17, D(ASYL));
      c.rect(8, 4, 13, 5, CREAM); // number
      dots(c, INK, [9, 4, 10, 5, 12, 4]);
      c.rect(6, 8, 15, 12, DARKIN); // the hatch
      c.frame(6, 8, 15, 12, D(ASYL));
      if (!u) {
        c.rect(7, 9, 14, 11, mix(ASYL, 0.8)); // shut
        c.set(13, 10, NICK);
      } else {
        dots(c, C.bone, [9, 10, 12, 10]); // slid back: somebody is looking out
        dots(c, PALE, [7, 12, 8, 12, 13, 12, 14, 12]);
        dots(c, K, [6, 17, 7, 19, 8, 21, 10, 18, 11, 20, 12, 22]); // marks at the height of a hand
      }
      c.rect(7, 24, 14, 25, DARKIN); // food slot
      c.rect(14, 18, 18, 20, C.iron); // bolt
      c.row(18, 14, 18, C.steel);
      c.rect(16, 21, 17, 22, C.ironDark);
      c.rect(14, 32, 18, 33, C.iron);
      c.rect(3, 8, 4, 10, C.ironDark); // hinges
      c.rect(3, 30, 4, 32, C.ironDark);
      if (u) {
        c.rect(8, 26, 13, 26, hex('#8d8a84')); // the tin plate pushed back out
        blood(c, [9, b, 10, b]);
      }
    },
    sw: 10, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 1, 7, b, hex('#77747a'));
      c.col(2, 1, b, hex('#9a979a'));
      c.rect(4, 3, 5, b, ASYL);
      c.rect(6, 18, 7, 20, C.iron);
      c.rect(6, 32, 7, 33, C.iron);
      c.set(6, 10, D(ASYL));
      if (u) {
        dots(c, PALE, [7, 11, 8, 11, 8, 12]); // fingers through the hatch
        c.rect(7, 25, 9, 25, hex('#8d8a84'));
      }
    },
  });
  add('twenties-electro-shock-machine', 'electro shock machine electrotherapy cabinet dials electrodes asylum treatment apparatus wires', {
    w: 20, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, 9, 16, b - 2, WAL);
      c.rect(4, 10, 15, 18, EB); // the panel
      for (const x of [5, 11]) {
        c.oval(x, 11, x + 3, 14, u ? C.glow : CREAM); // meters
        c.line(x + 1, 13, u ? x + 3 : x, 11, C.red);
        c.set(x + 1, 13, EB);
      }
      dots(c, NICK, [6, 16, 9, 16, 12, 16]);
      c.set(14, 16, u ? C.red : C.blood);
      c.rect(8, 17, 10, 17, BR);
      panel(c, 5, 20, 14, b - 4, WAL);
      c.set(13, 23, BR);
      for (const x of [3, 14]) {
        c.rect(x, b - 1, x + 2, b, EB); // castors
        c.set(x + 1, b, NICK);
      }
      c.col(5, 3, 8, NICK); // a hook for the head piece
      c.row(3, 5, 8, NICK);
      c.oval(7, 4, 13, 8, LEATH); // the head band and its two plates
      c.oval(8, 5, 12, 8, null);
      for (let y = 5; y <= 8; y++) for (let x = 8; x <= 12; x++) if (((x - 10) / 2.6) ** 2 + ((y - 7) / 2.4) ** 2 <= 1) c.clear(x, y);
      c.rect(6, 6, 7, 8, NICK);
      c.rect(13, 6, 14, 8, NICK);
      c.line(14, 8, 17, 12, C.red); // leads
      c.line(17, 12, 16, 15, C.red);
      c.line(6, 8, 2, 12, EB);
      c.line(2, 12, 3, 15, EB);
      if (u) {
        dots(c, C.white, [9, 6, 11, 7, 10, 5]); // it arcs between the plates
        dots(c, C.glow, [8, 7, 12, 6, 10, 8, 9, 4, 15, 4, 4, 5]);
        dots(c, C.glow, [18, 13, 1, 13]);
        wisp(c, 15, 3, 3);
      }
    },
    sw: 14, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, 9, 10, b - 2, WAL);
      c.poly([[10, 10], [12, 12], [12, 18], [10, 18]], EB); // the panel sloping towards the doctor
      dots(c, u ? C.glow : CREAM, [11, 12, 11, 14]);
      c.set(12, 16, u ? C.red : C.blood);
      c.rect(2, b - 1, 4, b, EB);
      c.rect(8, b - 1, 10, b, EB);
      c.col(5, 3, 8, NICK);
      c.rect(6, 5, 7, 8, NICK);
      c.row(4, 5, 7, LEATH);
      c.line(7, 8, 11, 9, C.red);
      if (u) {
        dots(c, C.white, [8, 6, 9, 5]);
        dots(c, C.glow, [8, 4, 9, 7, 4, 2]);
      }
    },
  });
  add('twenties-morgue-trolley-sheeted', 'morgue trolley mortuary table porcelain slab body under sheet toe tag coroner autopsy', {
    w: 40, h: 22, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 10, 37, 11, ENAMEL); // the slab
      c.row(10, 2, 37, C.white);
      c.rect(3, 12, 36, 12, NICK);
      for (const x of [5, 33]) {
        c.col(x, 13, b - 2, NICK);
        c.col(x + 1, 13, b - 2, D(NICK));
        c.oval(x - 1, b - 2, x + 2, b, EB);
        c.set(x, b - 1, NICK);
      }
      c.row(16, 6, 33, NICK);
      c.rect(14, 17, 20, 17, D(NICK)); // a tray of instruments under it
      dots(c, C.steel, [15, 16, 17, 16, 19, 16]);
      if (!u) {
        c.poly([[4, 9], [5, 6], [8, 5], [11, 7], [16, 5], [24, 6], [30, 7], [33, 4], [35, 5], [36, 9]], C.white); // somebody under the sheet
        c.line(5, 6, 8, 5, hex('#f0ece0'));
        c.line(11, 7, 16, 5, hex('#f0ece0'));
        c.line(12, 7, 13, 9, D(C.white));
        c.line(22, 6, 23, 9, D(C.white));
        c.line(31, 6, 30, 9, D(C.white));
        c.poly([[3, 10], [5, 9], [9, 10], [8, 13], [4, 13]], C.white); // the sheet hanging at the head
        c.line(6, 10, 6, 12, D(C.white));
        c.col(36, 6, 9, C.straw); // the tag on a toe
        c.rect(36, 10, 38, 12, CREAM);
      } else {
        c.oval(4, 5, 9, 9, PALE); // the sheet turned down to the waist
        c.rect(5, 4, 9, 5, hex('#3a3028'));
        c.set(4, 6, hex('#3a3028'));
        c.set(6, 7, K);
        c.rect(9, 7, 19, 9, PALE);
        c.row(7, 10, 19, L(PALE));
        c.line(11, 7, 14, 9, C.blood); // the Y of the knife
        c.line(15, 8, 19, 8, C.blood);
        c.poly([[19, 9], [20, 5], [26, 6], [30, 7], [33, 4], [35, 5], [36, 9]], C.white);
        c.line(20, 5, 26, 6, hex('#f0ece0'));
        c.line(22, 6, 21, 9, D(C.white));
        c.line(31, 6, 30, 9, D(C.white));
        c.col(36, 6, 9, C.straw);
        c.rect(36, 10, 38, 12, CREAM);
        c.rect(9, 9, 12, 9, PALE);
        c.col(12, 10, 14, PALE); // one arm has slipped off the slab
        c.set(12, 15, hex('#8d957f'));
      }
    },
    sw: 18, sh: 22,
    s(c, u) {
      const b = c.h - 2; // from the feet
      c.rect(2, 10, 15, 11, ENAMEL);
      c.row(10, 2, 15, C.white);
      c.rect(3, 12, 14, 12, NICK);
      for (const x of [3, 13]) {
        c.col(x, 13, b - 2, NICK);
        c.oval(x - 1, b - 2, x + 1, b, EB);
      }
      c.row(16, 4, 12, NICK);
      c.poly([[4, 9], [5, 5], [7, 4], [10, 4], [12, 5], [13, 9]], C.white);
      c.line(5, 5, 7, 4, hex('#f0ece0'));
      c.col(8, 5, 9, D(C.white));
      if (!u) {
        c.rect(6, 3, 7, 4, C.white); // the feet lift the sheet
        c.rect(10, 3, 11, 4, C.white);
      } else {
        c.rect(6, 3, 7, 6, PALE); // the feet bare
        c.rect(10, 3, 11, 6, PALE);
        c.rect(5, 1, 12, 2, PALE); // and the head raised beyond them
        c.row(1, 6, 11, hex('#3a3028'));
        dots(c, K, [7, 2, 10, 2]);
      }
      c.col(11, 6, 9, C.straw);
      c.rect(11, 10, 13, 12, CREAM);
    },
  });

  /* ---------- what the expedition brought back ---------- */
  add('twenties-seance-table-planchette', 'seance table planchette spirit board ouija candles medium round table cloth spiritualist', {
    w: 30, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2,
        CL = hex('#3a2a44');
      c.oval(2, 7, 27, 11, CL); // the cloth over a round table
      c.row(7, 6, 23, L(CL));
      c.poly([[2, 9], [27, 9], [26, 16], [3, 16]], CL);
      c.line(7, 11, 6, 16, D(CL));
      c.line(15, 11, 15, 16, D(CL));
      c.line(22, 11, 23, 16, D(CL));
      for (let x = 3; x <= 26; x += 2) c.set(x, 17, GILT); // fringe
      c.rect(13, 17, 16, b - 1, WAL); // pedestal
      c.col(13, 17, b - 1, L(WAL));
      c.rect(9, b, 20, b, WAL);
      c.rect(9, 7, 20, 8, hex('#b5a47c')); // the board
      type(c, 10, 19, 7, INK, 2);
      type(c, 11, 18, 8, INK, 3);
      const px = u ? 17 : 11;
      c.rect(px, 5, px + 2, 6, OAK); // the planchette
      c.set(px + 1, 6, K);
      for (const x of [5, 24]) {
        c.col(x, 4, 7, C.bone);
        c.set(x, 8, BR);
        if (!u) flame(c, x, 3);
        else {
          c.set(x, 3, GHOSTF); // the flames have gone green and stand too still
          c.set(x, 2, GHOSTF);
          c.set(x, 1, hex('#c9f0c0'));
          c.set(x, 0, GHOSTF);
        }
      }
      if (u) {
        dots(c, C.ghost, [18, 3, 19, 1, 17, -1, 18, -3, 16, -4, 15, -2]); // something answering
        dots(c, hex('#c9d6d8'), [18, 0, 17, -3]);
        c.rect(3, 6, 4, 7, C.glassLight); // a glass thrown over
        c.set(2, 8, C.glassLight);
      }
    },
    u: [0, 5, 0],
  });
  add('twenties-occult-tome-lectern', 'occult tome on lectern necronomicon forbidden book grimoire reading stand library black leather', {
    w: 16, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 11], [13, 11], [12, 13], [3, 13]], OAK); // the desk of the lectern, sloping to us
      c.row(13, 2, 13, OAKD);
      c.rect(6, 14, 9, b - 3, OAKD);
      c.col(6, 14, b - 3, OAK);
      c.rect(5, 19, 10, 20, OAK);
      c.rect(4, b - 2, 11, b - 1, OAK);
      c.rect(2, b, 13, b, OAKD);
      if (!u) {
        c.rect(3, 4, 12, 10, hex('#2c2228')); // shut and clasped
        c.col(3, 4, 10, hex('#4a3a40'));
        c.row(4, 3, 12, hex('#4a3a40'));
        c.frame(4, 5, 11, 9, mix(BR, 0.7));
        c.set(7, 7, C.blood);
        c.set(8, 7, C.blood);
        c.rect(12, 6, 13, 8, BR);
        c.row(10, 3, 12, C.parchment);
      } else {
        c.rect(1, 5, 14, 10, C.parchment); // open
        c.row(10, 1, 14, D(C.parchment));
        c.col(7, 5, 10, D(C.parchment));
        c.col(8, 5, 10, L(C.parchment));
        for (let y = 6; y <= 9; y++) type(c, 2, 6, y, INK, 3);
        c.oval(10, 6, 13, 9, C.blood); // a sign drawn in something brown
        c.set(11, 7, C.parchment);
        c.set(12, 8, C.parchment);
        c.rect(1, 4, 14, 4, hex('#2c2228'));
        dots(c, GHOSTF, [4, 2, 11, 1, 7, 0, 9, 3, 2, 0, 13, 3]); // and a light that is not the lamp's
        c.line(8, 11, 8, 15, C.wine); // the ribbon
      }
    },
    u: [0, 1, 0],
    sw: 14, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 9], [3, 8], [11, 12], [11, 13], [2, 13]], OAK);
      c.line(3, 8, 11, 12, L(OAK));
      c.rect(5, 14, 8, b - 3, OAKD);
      c.col(5, 14, b - 3, OAK);
      c.rect(4, 19, 9, 20, OAK);
      c.rect(3, b - 2, 10, b - 1, OAK);
      c.rect(1, b, 12, b, OAKD);
      if (!u) {
        c.poly([[3, 6], [4, 5], [11, 9], [11, 11], [3, 7]], hex('#2c2228'));
        c.line(4, 5, 11, 9, hex('#4a3a40'));
        c.line(4, 7, 10, 10, C.parchment);
        c.set(11, 10, BR);
      } else {
        c.line(1, 5, 12, 10, C.parchment);
        c.line(1, 6, 12, 11, D(C.parchment));
        c.line(2, 4, 6, 5, C.parchment); // a leaf lifting by itself
        c.set(12, 12, C.wine);
        c.set(12, 13, C.wine);
        dots(c, GHOSTF, [5, 2, 8, 1, 10, 4, 3, 1]);
      }
    },
    su: [0, 1, 0],
  });
  add('twenties-idol-tentacled-plinth', 'idol statue tentacled god cthulhu green soapstone on plinth cult object museum horror', {
    w: 18, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stones(c, 4, 21, 13, b - 1, hex('#77747a'), 5, 5, 3);
      c.rect(3, 20, 14, 20, hex('#9a979a'));
      c.rect(3, b, 14, b, hex('#4f4d56'));
      c.rect(6, 23, 11, 25, CREAM); // a label
      type(c, 7, 10, 24, INK, 2);
      c.poly([[2, 8], [4, 6], [5, 13], [3, 15]], D(VERD)); // folded wings
      c.poly([[15, 8], [13, 6], [12, 13], [14, 15]], mix(VERD, 0.55));
      c.oval(4, 10, 13, 19, VERD); // squatting body
      c.rect(4, 16, 13, 19, VERD);
      c.oval(5, 2, 12, 9, VERD); // the head
      c.col(5, 4, 7, L(VERD));
      c.set(6, 3, L(VERD));
      c.col(4, 12, 18, L(VERD));
      for (const x of [6, 8, 9, 11]) c.col(x, 8, x === 8 || x === 9 ? 14 : 12, D(VERD)); // the beard of feelers
      c.col(7, 8, 13, VERD);
      c.col(10, 8, 12, VERD);
      c.rect(4, 17, 6, 19, D(VERD)); // claws on its knees
      c.rect(11, 17, 13, 19, D(VERD));
      dots(c, L(VERD), [4, 17, 11, 17]);
      dots(c, u ? C.red : K, [7, 5, 10, 5]);
      if (u) {
        dots(c, C.flameLight, [7, 4, 10, 4]); // it has been fed
        blood(c, [8, 15, 9, 16, 8, 19, 9, 20, 7, 20, 10, 21, 8, 22, 12, 22, 5, 26, 12, 27, 6, b]);
        c.rect(6, 19, 11, 19, C.blood);
      }
    },
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 3, 21, 10, b - 1, hex('#77747a'), 5, 5, 5);
      c.rect(2, 20, 11, 20, hex('#9a979a'));
      c.rect(2, b, 11, b, hex('#4f4d56'));
      c.poly([[2, 6], [4, 5], [5, 14], [3, 16]], D(VERD)); // wing, behind
      c.oval(3, 10, 10, 19, VERD);
      c.rect(3, 16, 11, 19, VERD);
      c.oval(4, 2, 10, 9, VERD);
      c.set(5, 3, L(VERD));
      c.col(3, 12, 18, L(VERD));
      c.col(10, 7, 13, D(VERD)); // the feelers hang forward
      c.col(11, 8, 12, D(VERD));
      c.col(9, 8, 11, VERD);
      c.rect(9, 17, 11, 19, D(VERD));
      c.set(9, 5, u ? C.red : K);
      if (u) blood(c, [11, 14, 11, 20, 12, 21, 12, 24, 11, 27, 12, b]);
    },
  });
  add('twenties-expedition-crate-specimen', 'expedition crate specimen box university antarctic shipping case stencilled fragile thing inside', {
    w: 28, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2,
        CR = hex('#96764e');
      crate(c, 2, 6, 25, b, CR);
      c.rect(2, 6, 3, b, D(CR));
      c.rect(24, 6, 25, b, D(CR));
      type(c, 6, 21, 10, INK, 3);
      type(c, 8, 19, 12, INK, 2);
      c.rect(15, 15, 22, 17, hex('#b5a47c'));
      type(c, 16, 21, 16, C.blood, 2);
      dots(c, C.iron, [3, 7, 24, 7, 3, b - 1, 24, b - 1]);
      if (!u) {
        c.rect(1, 4, 26, 5, CR); // nailed down
        c.row(4, 1, 26, L(CR));
        dots(c, C.iron, [4, 5, 13, 5, 22, 5]);
        c.line(5, 15, 9, 15, C.straw); // rope handle
        c.set(4, 14, C.straw);
        c.set(10, 14, C.straw);
      } else {
        c.poly([[0, 3], [20, -1], [21, 0], [1, 5]], CR); // the lid forced up from inside
        c.line(0, 3, 20, -1, L(CR));
        c.rect(4, 5, 24, 6, DARKIN);
        dots(c, C.straw, [5, 5, 9, 4, 14, 5, 23, 5, 25, 8, 26, 12]);
        c.line(18, 5, 21, 3, TENT); // what was packed in ice is not dead
        c.line(21, 3, 25, 5, TENT);
        c.line(25, 5, 26, 10, TENT);
        c.line(26, 10, 24, 14, TENT);
        c.line(22, 4, 24, 5, mix(TENT, 1.3));
        dots(c, hex('#b98a9a'), [26, 7, 25, 12]);
        dots(c, SLIME, [24, 15, 24, 17, 25, b, 26, b, 23, b]);
        c.line(5, 15, 9, 15, C.straw);
      }
    },
    u: [0, 2, 0],
    sw: 18, sh: 22,
    s(c, u) {
      const b = c.h - 2,
        CR = hex('#96764e');
      crate(c, 2, 6, 15, b, CR);
      c.rect(2, 6, 3, b, D(CR));
      c.rect(14, 6, 15, b, D(CR));
      c.line(6, 13, 11, 13, C.straw);
      c.set(5, 12, C.straw);
      c.set(12, 12, C.straw);
      if (!u) {
        c.rect(1, 4, 16, 5, CR);
        c.row(4, 1, 16, L(CR));
        dots(c, C.iron, [4, 5, 13, 5]);
      } else {
        c.poly([[0, 1], [14, 3], [14, 5], [0, 3]], CR);
        c.line(0, 1, 14, 3, L(CR));
        c.rect(4, 5, 14, 6, DARKIN);
        c.line(11, 5, 14, 4, TENT);
        c.line(14, 4, 16, 7, TENT);
        c.line(16, 7, 16, 13, TENT);
        c.set(17, 14, TENT);
        dots(c, hex('#b98a9a'), [16, 9, 16, 12]);
        dots(c, SLIME, [16, 16, 17, b, 16, b]);
      }
    },
    su: [0, 2, 2],
  });
  add('twenties-globe-on-stand', 'globe on stand terrestrial world map brass meridian library study expedition geography', {
    w: 16, h: 34, solid: false,
    f(c, u) {
      const b = c.h - 2,
        SEA = hex('#4a6a72'),
        LAND = hex('#8a8458');
      c.oval(2, 2, 13, 13, SEA);
      for (let y = 3; y <= 6; y++) c.set(y < 5 ? 5 : 4, y, L(SEA));
      const land = u ? [[5, 3, 8, 5], [4, 6, 6, 8], [9, 8, 12, 10], [10, 4, 11, 5]] : [[4, 4, 6, 7], [5, 8, 6, 10], [8, 3, 11, 6], [10, 7, 11, 9]];
      for (const [x0, y0, x1, y1] of land) c.rect(x0, y0, x1, y1, LAND);
      c.oval(2, 2, 13, 13, null);
      for (let y = 2; y <= 13; y++) for (let x = 2; x <= 13; x++) if (((x - 7.5) / 6) ** 2 + ((y - 7.5) / 6) ** 2 > 1) c.clear(x, y);
      c.rect(6, 11, 9, 12, hex('#c9c2aa')); // the white south
      for (let a = -80; a <= 100; a += 6) c.set(Math.round(7.5 + 7 * Math.cos((a * Math.PI) / 180)), Math.round(7.5 + 7 * Math.sin((a * Math.PI) / 180)), BR); // meridian
      c.rect(7, 15, 8, 15, BR);
      c.rect(7, 16, 8, b - 4, WAL);
      c.col(7, 16, b - 4, L(WAL));
      c.rect(6, 20, 9, 21, WAL);
      c.line(7, b - 4, 3, b, WAL);
      c.line(8, b - 4, 12, b, WAL);
      c.rect(7, b - 3, 8, b, WAL);
      if (u) {
        c.set(8, 11, C.red); // a pin, far south, where nobody has gone
        c.set(8, 10, NICK);
        c.line(9, 9, 11, 7, C.red);
        dots(c, C.red, [7, 12, 9, 12]);
      }
    },
  });
  add('twenties-telescope-brass-tripod', 'telescope brass refractor on wooden tripod astronomy observatory professor stars', {
    w: 30, h: 36, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      const [x0, y0, x1, y1] = u ? [8, 20, 22, 2] : [3, 16, 26, 6];
      for (let k = -1; k <= 1; k++) c.line(x0, y0 + k, x1, y1 + k, k < 0 ? L(BR) : k > 0 ? D(BR) : BR);
      c.line(x0 - 2, y0 + (u ? 3 : 1), x0, y0, EB); // eye piece
      c.set(x0 - 2, y0 + (u ? 4 : 2), NICK);
      c.rect(x1, y1 - 2, x1 + 1, y1 + 1, NICK); // the object glass and its cap
      c.set(x1 + 1, y1 - 1, u ? C.glassLight : EB);
      c.set(Math.round((x0 + x1) / 2) + 2, Math.round((y0 + y1) / 2) - 3, BR); // finder
      c.set(Math.round((x0 + x1) / 2) + 3, Math.round((y0 + y1) / 2) - 4, BR);
      c.rect(14, 12, 16, 14, EB); // the head of the tripod
      c.line(14, 15, 6, b, OAK);
      c.line(15, 15, 15, b, OAKD);
      c.line(16, 15, 24, b, OAK);
      c.line(13, 15, 5, b, L(OAK));
      c.row(26, 9, 21, BR);
      if (u) {
        sheet(c, 21, b - 1, 27, b, C.paper, NAVY); // a chart of what he saw, dropped
        dots(c, C.white, [26, -1, 28, 2]);
      }
    },
    u: [0, 2, 0],
    sw: 16, sh: 36,
    s(c, u) {
      const b = c.h - 2,
        y = u ? 5 : 9;
      c.oval(5, y - 3, 10, y + 2, BR); // the tube towards us
      c.oval(6, y - 2, 9, y + 1, u ? hex('#56727a') : EB);
      if (u) c.set(7, y - 1, C.glassLight);
      c.rect(7, y + 3, 8, 12, BR);
      c.rect(6, 12, 9, 14, EB);
      c.line(6, 15, 2, b, OAK);
      c.line(7, 15, 7, b, OAKD);
      c.line(9, 15, 13, b, OAK);
      c.row(26, 4, 11, BR);
      if (u) sheet(c, 9, b - 1, 14, b, C.paper, NAVY);
    },
  });
  add('twenties-press-camera-flash-tripod', 'press camera on tripod plate camera bellows flash powder pan photographer reporter magnesium', {
    w: 20, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[3, 9], [5, 6], [13, 6], [15, 9], [15, 14], [3, 14]], EB); // the cloth over it
      face(c, 4, 8, 14, 17, MAH);
      c.frame(5, 9, 13, 16, BR);
      c.oval(7, 10, 11, 14, NICK); // lens
      c.oval(8, 11, 10, 13, GLASSD);
      c.set(8, 11, C.glassLight);
      c.rect(8, 18, 10, 19, EB);
      c.line(8, 20, 3, b, OAK);
      c.line(9, 20, 9, b, OAKD);
      c.line(10, 20, 15, b, OAK);
      c.row(27, 6, 13, BR);
      c.col(17, 4, 18, NICK); // the flash pan held up beside it
      c.rect(15, 3, 18, 3, NICK);
      c.rect(16, 19, 18, 20, EB);
      c.line(16, 20, 14, 17, EB);
      if (u) {
        c.oval(13, -4, 20, 2, C.white); // the powder goes up
        c.oval(15, -3, 18, 0, C.glow);
        dots(c, C.glow, [12, -5, 21, -5, 11, -1, 22, 0, 16, -6, 12, 3, 21, 3]);
        dots(c, C.ash, [15, -7, 18, -8, 17, -10]);
        c.set(9, 12, C.white);
      } else dots(c, hex('#8d8a84'), [16, 2, 17, 2]);
    },
    u: [0, 10, 3],
    sw: 24, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 16], [3, 7], [6, 6], [9, 8], [8, 16]], EB); // the cloth hanging behind
      c.line(3, 7, 2, 16, hex('#4a444c'));
      face(c, 6, 8, 10, 17, MAH);
      for (let x = 11; x <= 15; x++) c.col(x, x % 2 ? 9 : 10, x % 2 ? 16 : 15, x % 2 ? hex('#4a444c') : EB); // bellows
      c.rect(16, 9, 17, 16, MAH);
      c.rect(18, 11, 19, 14, NICK);
      c.col(20, 12, 13, u ? C.white : GLASSD);
      c.rect(6, 18, 17, 18, OAKD); // bed
      c.rect(10, 19, 12, 19, EB);
      c.line(10, 20, 5, b, OAK);
      c.line(11, 20, 11, b, OAKD);
      c.line(12, 20, 17, b, OAK);
      c.row(27, 8, 14, BR);
      c.col(13, 3, 8, NICK);
      c.rect(11, 2, 15, 2, NICK);
      if (u) {
        c.oval(9, -5, 17, 1, C.white);
        c.oval(11, -4, 15, -1, C.glow);
        dots(c, C.glow, [8, -6, 18, -6, 7, -2, 19, -1, 13, -7, 8, 2, 18, 2]);
        dots(c, C.ash, [12, -8, 15, -9, 14, -11]);
      } else dots(c, hex('#8d8a84'), [12, 1, 14, 1]);
    },
    su: [0, 12, 0],
  });
};
