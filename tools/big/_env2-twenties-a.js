/* The nineteen-twenties, part a: the large things (motor car, truck, police wagon, tram, bar, boat) and the
 * speakeasy around the bar. Part of tools/big/env2-twenties.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, pane, wisp, bottle, tyre, tyreEnd, lampGlass, beam, type, crate, doorOut } = H;
  const add = H.reg('env-twenties', "1920's");
  /* the colours of the setting, shared by all parts */
  const P = (H.P = {
    CARB: hex('#2f3140'), // a motor car's black enamel, lifted enough to read
    FEND: hex('#1f1d27'),
    RUBBER: hex('#2a2830'),
    OAK: hex('#7a5a36'),
    OAKD: hex('#5c4128'),
    MAH: hex('#5e2f24'),
    WAL: hex('#59402e'),
    EB: hex('#2b242a'),
    BAKE: hex('#3d2b27'),
    NICK: hex('#a3a6ad'),
    BR: C.brass,
    GILT: C.gold,
    GRN: hex('#33503f'),
    OX: hex('#6e2622'),
    CREAM: hex('#cfc6a8'),
    TEAL: hex('#2f5a5a'),
    NAVY: hex('#262c44'),
    GLASSD: hex('#3f5a62'),
    MARB: hex('#b4aea0'),
    VERD: hex('#5f8a78'),
    AMBER: hex('#a8642a'),
    FELT: hex('#2f5e45'),
    TARP: hex('#857d62'),
    LIT: hex('#d2c070'), // a lit window
    INK: hex('#3a3640'),
    NEWS: hex('#bdb49a'),
    VELVET: hex('#5a2436'),
    ENAMEL: hex('#d6d2c4'),
  });
  const { CARB, FEND, OAK, OAKD, MAH, WAL, EB, NICK, BR, GRN, OX, CREAM, NAVY, GLASSD, AMBER, TARP, LIT, INK } = P;
  const DARKIN = hex('#17151c');

  /** A mudguard: an arc over a wheel from angle a0 to a1 (degrees, 0 = towards the right, 90 = up). */
  function fender(c, cx, cy, r, a0, a1, col) {
    for (let a = a0; a <= a1; a += 3) {
      const x = Math.round(cx + r * Math.cos((a * Math.PI) / 180)),
        y = Math.round(cy - r * Math.sin((a * Math.PI) / 180));
      c.set(x, y, col);
      c.set(x, y - 1, a > 60 && a < 120 ? L(L(col)) : col);
    }
  }

  /* ---------- the motor car ---------- */
  add('twenties-motor-car-tin-lizzie', 'large motor car tin lizzie model t black automobile flivver old ford vehicle 1920s', {
    w: 46, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 11, 4, 20, P.RUBBER); // the spare wheel on the back
      c.col(2, 12, 19, L(P.RUBBER));
      c.set(3, 15, BR);
      c.rect(5, 2, 31, 3, FEND); // the roof
      c.row(2, 6, 30, hex('#3e3c48'));
      c.set(32, 3, FEND);
      c.rect(6, 4, 11, 11, CARB); // rear quarter
      c.col(6, 4, 11, L(CARB));
      c.rect(8, 6, 9, 9, GLASSD); // its small oval window
      c.rect(12, 4, 29, 11, GLASSD); // the windows
      c.rect(14, 9, 18, 11, mix(OX, 0.8)); // the seats behind them
      c.rect(23, 9, 26, 11, mix(OX, 0.8));
      c.line(27, 7, 28, 10, K); // steering wheel
      c.set(27, 6, K);
      for (let i = 0; i < 4; i++) c.set(13 + i, 9 - i, C.glassLight);
      for (let i = 0; i < 3; i++) c.set(22 + i, 7 - i, C.glassLight);
      c.col(12, 4, 11, CARB);
      c.rect(20, 4, 21, 11, CARB);
      c.col(29, 4, 11, CARB); // windscreen post
      c.col(30, 5, 11, C.glassLight);
      c.rect(6, 12, 30, 19, CARB); // the body
      c.row(12, 6, 30, L(CARB));
      c.col(6, 12, 18, L(CARB));
      c.clear(6, 19);
      for (const x of [13, 21, 28]) c.col(x, 13, 19, D(CARB));
      c.set(19, 14, NICK);
      c.set(26, 14, NICK);
      c.rect(31, 11, 39, 18, CARB); // the bonnet
      c.row(11, 31, 39, L(CARB));
      for (let x = 33; x <= 37; x += 2) c.col(x, 13, 16, D(CARB));
      c.rect(40, 9, 41, 19, BR); // the radiator shell
      c.col(40, 9, 19, L(BR));
      c.set(40, 8, BR);
      c.rect(8, 20, 40, 20, FEND); // chassis
      c.rect(16, 21, 30, 22, FEND); // running board
      c.row(21, 16, 30, hex('#3e3c48'));
      tyre(c, 10, 23, 5);
      tyre(c, 36, 23, 5);
      fender(c, 10, 23, 7, 15, 165, FEND);
      fender(c, 36, 23, 7, 20, 160, FEND);
      c.set(42, 15, FEND); // lamp bracket
      lampGlass(c, 42, 12, 44, 14, u);
      if (u) {
        beam(c, 45, 13, 6); // lamps on, the bonnet folded up: something is wrong with the engine
        c.rect(31, 11, 39, 17, DARKIN);
        c.rect(33, 13, 38, 16, C.iron);
        c.row(13, 33, 38, C.steel);
        dots(c, BR, [34, 15, 37, 14]);
        c.col(35, 11, 12, C.rust);
        c.poly([[31, 10], [39, 10], [38, 7], [32, 7]], CARB);
        c.row(7, 32, 38, L(CARB));
        c.row(10, 31, 39, D(CARB));
        wisp(c, 40, 6, 5);
      }
    },
    u: [0, 0, 6],
    sw: 28, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 2, 22, 3, FEND); // roof
      c.row(2, 6, 21, hex('#3e3c48'));
      c.rect(6, 4, 21, 11, CARB); // windscreen frame
      c.rect(7, 5, 20, 10, GLASSD);
      c.row(8, 7, 20, CARB);
      for (let i = 0; i < 3; i++) c.set(8 + i, 7 - i, C.glassLight);
      c.oval(15, 6, 19, 10, K); // the steering wheel behind the glass
      c.rect(16, 7, 18, 9, GLASSD);
      c.rect(5, 12, 22, 19, CARB); // the scuttle and body
      c.row(12, 5, 22, L(CARB));
      c.col(5, 12, 19, L(CARB));
      c.rect(9, 9, 18, 20, BR); // radiator
      c.col(9, 9, 20, L(BR));
      c.rect(11, 11, 16, 19, hex('#2a2622'));
      for (let y = 11; y <= 19; y++) for (let x = 11; x <= 16; x++) if ((x + y) % 2) c.set(x, y, hex('#3d3830'));
      c.rect(13, 7, 14, 8, BR); // cap
      c.row(17, 3, 24, FEND); // lamp bar
      lampGlass(c, 4, 12, 8, 16, u);
      lampGlass(c, 19, 12, 23, 16, u);
      c.poly([[1, 18], [5, 17], [8, 21], [6, 21]], FEND); // mudguards
      c.poly([[26, 18], [22, 17], [19, 21], [21, 21]], FEND);
      c.row(17, 1, 5, hex('#3e3c48'));
      tyreEnd(c, 2, 4, 19, b);
      tyreEnd(c, 23, 25, 19, b);
      c.row(23, 5, 22, FEND); // axle
      c.row(24, 8, 19, C.ironDark);
      c.rect(11, 21, 16, 22, CREAM); // number plate
      dots(c, INK, [12, 21, 13, 22, 15, 21]);
      dots(c, NICK, [13, 25, 14, 25, 14, 26, 15, 26]); // starting handle
      if (u) {
        c.poly([[9, 10], [4, 4], [2, 6], [8, 12]], CARB); // the bonnet panel standing up on its hinge
        c.line(9, 10, 4, 4, L(CARB));
        wisp(c, 13, 5, 5);
        for (const x of [6, 21]) dots(c, C.glow, [x - 3, 14, x + 3, 14, x, 11, x, 17]);
      }
    },
  });

  /* ---------- the delivery truck ---------- */
  const TRK = hex('#5c3a2c');
  const cratesLoad = (c, x0, x1, yb) => {
    for (let x = x0; x + 6 <= x1 + 1; x += 7) {
      crate(c, x, yb - 5, x + 6, yb, C.woodPale, INK);
      for (let i = 1; i < 6; i += 2) {
        c.set(x + i, yb - 6, i % 4 === 1 ? AMBER : GRN);
        c.set(x + i, yb - 7, C.parchment);
      }
    }
  };
  add('twenties-delivery-truck-tarpaulin', 'large delivery truck lorry stake bed tarpaulin load bootleg liquor crates motor vehicle 1920s', {
    w: 48, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.poly([[3, 10], [4, 6], [9, 4], [15, 5], [20, 3], [26, 4], [29, 7], [29, 10]], TARP); // the load under its sheet
        c.line(4, 6, 9, 4, L(TARP));
        c.line(15, 5, 20, 3, L(TARP));
        c.line(20, 3, 26, 4, L(TARP));
        c.line(11, 5, 13, 10, D(TARP));
        c.line(22, 4, 21, 10, D(TARP));
        c.line(27, 5, 28, 10, D(TARP));
        c.rect(3, 11, 29, 17, TARP);
        c.line(7, 5, 6, 12, C.straw); // ropes
        c.line(18, 4, 18, 12, C.straw);
      } else {
        c.rect(3, 11, 29, 17, DARKIN); // the sheet pulled forward: crates of bottles
        cratesLoad(c, 3, 17, 10);
        crate(c, 4, 11, 10, 17, C.woodPale, INK);
        crate(c, 11, 11, 17, 17, C.woodPale);
        c.poly([[19, 10], [20, 5], [24, 3], [28, 5], [29, 10]], TARP);
        c.line(20, 5, 24, 3, L(TARP));
        c.line(22, 5, 21, 10, D(TARP));
        c.line(26, 5, 27, 10, D(TARP));
        c.rect(18, 11, 29, 17, TARP);
        c.col(18, 9, 17, D(TARP));
      }
      for (const y of [11, 14, 17]) {
        c.rect(2, y, 29, y + 1, C.woodLight); // stake sides
        c.row(y, 2, 29, L(C.woodLight));
      }
      for (const x of [2, 11, 20, 29]) c.col(x, 9, 19, C.wood);
      c.rect(2, 19, 29, 19, C.woodDark);
      c.rect(30, 4, 39, 5, FEND); // the cab
      c.row(4, 31, 38, hex('#3e3c48'));
      c.rect(31, 6, 37, 19, TRK);
      c.col(31, 6, 19, L(TRK));
      c.rect(33, 7, 36, 12, DARKIN);
      c.line(35, 9, 36, 12, C.iron); // steering wheel
      c.col(37, 6, 12, TRK);
      c.col(34, 13, 19, D(TRK));
      c.set(35, 14, NICK);
      type(c, 32, 36, 16, CREAM, 2);
      c.rect(38, 12, 42, 18, TRK); // bonnet
      c.row(12, 38, 42, L(TRK));
      c.col(39, 14, 16, D(TRK));
      c.col(41, 14, 16, D(TRK));
      c.rect(43, 10, 44, 19, BR);
      c.col(43, 10, 19, L(BR));
      c.set(43, 9, BR);
      c.rect(4, 20, 44, 20, FEND);
      c.rect(29, 21, 34, 21, FEND);
      tyre(c, 10, 24, 4, hex('#8a6a4a'), C.iron);
      tyre(c, 39, 24, 4, hex('#8a6a4a'), C.iron);
      fender(c, 39, 24, 6, 20, 150, FEND);
      lampGlass(c, 45, 13, 46, 15, false);
      c.set(45, 14, u ? C.glow : hex('#6f7b7a'));
      void b;
    },
    sw: 28, sh: 30,
    s(c, u) {
      const b = c.h - 2; // seen from behind
      c.rect(8, 4, 19, 8, FEND); // the cab roof beyond the load
      if (!u) {
        c.poly([[4, 10], [5, 6], [9, 3], [18, 3], [22, 6], [23, 10]], TARP);
        c.line(5, 6, 9, 3, L(TARP));
        c.row(3, 9, 18, L(TARP));
        c.line(11, 4, 10, 10, D(TARP));
        c.line(17, 4, 19, 10, D(TARP));
        c.line(14, 3, 14, 11, C.straw);
      } else {
        c.rect(4, 5, 23, 10, DARKIN);
        c.poly([[5, 8], [8, 3], [19, 3], [22, 8]], TARP); // the sheet thrown up onto the cab
        c.row(3, 8, 19, L(TARP));
        c.line(12, 4, 11, 8, D(TARP));
        crate(c, 5, 9, 13, 18, C.woodPale, INK);
        crate(c, 14, 9, 22, 18, C.woodPale);
        for (const x of [6, 8, 10, 12, 15, 17, 19, 21]) {
          c.set(x, 8, x % 4 === 0 ? GRN : AMBER);
          c.set(x, 7, C.parchment);
        }
      }
      for (const x of [3, 24]) c.col(x, 8, 19, C.wood); // corner stakes
      if (!u) {
        for (const y of [11, 14, 17]) {
          c.rect(4, y, 23, y + 1, C.woodLight); // tailgate
          c.row(y, 4, 23, L(C.woodLight));
        }
        c.rect(4, 13, 23, 13, TARP);
        c.rect(4, 16, 23, 16, TARP);
        c.col(13, 11, 18, C.wood);
        dots(c, C.iron, [4, 12, 23, 12]);
      }
      c.rect(3, 19, 24, 20, C.woodDark);
      c.row(19, 3, 24, C.wood);
      tyreEnd(c, 2, 5, 19, b);
      tyreEnd(c, 22, 25, 19, b);
      c.row(23, 6, 21, FEND);
      c.oval(11, 21, 16, 26, C.iron); // differential
      c.set(13, 23, C.steel);
      c.rect(7, 21, 9, 22, CREAM);
      c.set(8, 21, INK);
      c.set(20, 21, u ? C.red : C.blood); // tail lamp
      if (u) {
        for (const y of [21, 24]) {
          c.rect(4, y, 23, y + 1, C.woodLight); // the tailgate hanging down
          c.row(y, 4, 23, L(C.woodLight));
        }
        c.rect(4, 23, 23, 23, D(C.wood));
        c.rect(4, 26, 23, 26, D(C.wood));
        c.col(13, 21, 26, C.wood);
        c.line(3, 12, 3, 20, C.iron);
        c.line(24, 12, 24, 20, C.iron);
      }
    },
  });

  /* ---------- the police wagon ---------- */
  add('twenties-police-wagon-black-maria', 'large police wagon paddy wagon black maria patrol van prison motor vehicle navy 1920s', {
    w: 48, h: 30, solid: true, base: 'side',
    f(c, u) {
      c.rect(2, 3, 38, 4, FEND); // roof
      c.row(3, 3, 37, hex('#3e3c48'));
      c.rect(31, 1, 33, 2, u ? C.red : C.blood); // the lamp on the roof
      if (u) dots(c, C.flameLight, [32, 1, 30, 1, 34, 1]);
      c.rect(3, 5, 28, 19, NAVY); // the box
      c.row(5, 3, 28, L(NAVY));
      c.col(3, 5, 19, L(NAVY));
      c.col(28, 5, 19, D(NAVY));
      for (const x of [7, 18]) {
        c.rect(x, 7, x + 5, 11, DARKIN); // barred windows
        for (let i = 1; i < 6; i += 2) c.col(x + i, 7, 11, C.steel);
        c.row(12, x, x + 5, L(NAVY));
      }
      c.rect(5, 14, 26, 16, CREAM); // POLICE
      type(c, 9, 22, 15, NAVY, 3);
      c.col(4, 8, 17, D(NAVY));
      c.set(5, 12, NICK);
      c.rect(1, 20, 4, 21, C.iron); // the step at the back
      c.rect(29, 14, 36, 19, NAVY); // the open cab
      c.row(14, 29, 36, L(NAVY));
      c.rect(30, 10, 33, 13, OX); // seat back
      c.col(30, 10, 13, L(OX));
      c.line(35, 9, 36, 13, K);
      c.col(37, 5, 13, FEND); // roof post
      c.oval(35, 6, 37, 8, BR); // the gong
      c.set(36, 7, L(BR));
      c.rect(37, 12, 42, 18, NAVY); // bonnet
      c.row(12, 37, 42, L(NAVY));
      c.col(39, 14, 16, D(NAVY));
      c.col(41, 14, 16, D(NAVY));
      c.rect(43, 10, 44, 19, NICK);
      c.col(43, 10, 19, L(NICK));
      c.set(43, 9, NICK);
      c.rect(5, 20, 44, 20, FEND);
      c.rect(28, 21, 34, 21, FEND);
      tyre(c, 11, 24, 4, CREAM, C.iron);
      tyre(c, 38, 24, 4, CREAM, C.iron);
      fender(c, 11, 24, 6, 20, 160, FEND);
      fender(c, 38, 24, 6, 20, 150, FEND);
      lampGlass(c, 45, 13, 46, 15, false);
      c.set(45, 14, u ? C.glow : hex('#6f7b7a'));
      if (u) {
        beam(c, 47, 14, 5);
        c.rect(3, 6, 4, 19, DARKIN); // the back door stands open
        face(c, -3, 6, 1, 19, L(NAVY));
        c.rect(-2, 8, 0, 11, DARKIN);
        c.col(-1, 8, 11, C.steel);
        c.set(-2, 14, NICK);
        c.rect(-3, 20, 2, 21, C.iron);
        c.rect(-2, 22, 1, 23, C.ironDark);
      }
    },
    u: [4, 0, 5],
    sw: 26, sh: 30,
    s(c, u) {
      const b = c.h - 2; // from behind
      c.rect(2, 3, 23, 4, FEND);
      c.row(3, 3, 22, hex('#3e3c48'));
      c.rect(12, 1, 13, 2, u ? C.red : C.blood);
      if (u) dots(c, C.flameLight, [10, 1, 15, 1]);
      c.rect(3, 5, 22, 19, NAVY);
      c.row(5, 3, 22, L(NAVY));
      c.col(3, 5, 19, L(NAVY));
      c.col(12, 6, 19, D(NAVY)); // the two doors
      c.col(13, 6, 19, L(NAVY));
      for (const x of [5, 15]) {
        c.rect(x, 7, x + 5, 11, DARKIN);
        for (let i = 1; i < 6; i += 2) c.col(x + i, 7, 11, C.steel);
        c.row(12, x, x + 5, L(NAVY));
      }
      c.rect(5, 14, 20, 15, CREAM);
      type(c, 7, 18, 14, NAVY, 3);
      dots(c, NICK, [11, 13, 14, 13]);
      c.rect(5, 21, 20, 22, C.iron); // step
      c.row(21, 5, 20, C.steel);
      tyreEnd(c, 2, 4, 19, b);
      tyreEnd(c, 21, 23, 19, b);
      c.row(24, 5, 20, FEND);
      c.set(6, 20, u ? C.red : C.blood);
      if (u) {
        hollow(c, 14, 6, 21, 19, hex('#5a5a60')); // one door open: a bench, a chain
        c.rect(14, 14, 21, 15, C.wood);
        c.row(14, 14, 21, C.woodLight);
        c.line(18, 7, 18, 11, C.steel);
        c.set(17, 12, C.steel);
        c.set(19, 12, C.steel);
        face(c, 23, 6, 26, 19, L(NAVY)); // the door leaf, edge towards us
        c.rect(24, 8, 25, 11, DARKIN);
        c.set(25, 14, NICK);
      }
    },
    su: [0, 0, 4],
  });

  /* ---------- the tram ---------- */
  const TRAMR = hex('#6a2a26');
  add('twenties-streetcar-trolley', 'large streetcar tram trolley car electric railway oxblood cream public transport 1920s', {
    w: 48, h: 32, solid: true, base: 'side',
    f(c, u) {
      const G = u ? LIT : GLASSD;
      c.line(18, 2, 30, 1, C.iron); // trolley pole
      c.set(31, 1, C.steel);
      c.rect(9, 2, 38, 3, C.slate); // clerestory
      c.row(2, 9, 38, L(C.slate));
      for (let x = 11; x <= 36; x += 3) c.set(x, 3, u ? LIT : DARKIN);
      c.rect(3, 4, 44, 5, C.stoneDark); // the roof
      c.row(4, 4, 43, C.stone);
      c.set(2, 5, C.stoneDark);
      c.set(45, 5, C.stoneDark);
      c.rect(7, 6, 40, 14, CREAM); // the saloon
      for (let x = 9; x <= 33; x += 6) {
        c.rect(x, 7, x + 4, 12, G);
        c.set(x, 7, CREAM);
        c.set(x + 4, 7, CREAM);
        if (!u) for (let i = 0; i < 3; i++) c.set(x + 1 + i, 11 - i, C.glassLight);
      }
      if (u) {
        for (const x of [16, 22, 34]) {
          c.rect(x, 10, x + 2, 12, INK); // the heads of those who ride at this hour
          c.set(x + 1, 9, INK);
        }
        c.row(9, 33, 37, INK);
      }
      c.row(14, 7, 40, D(CREAM));
      c.rect(7, 15, 40, 22, TRAMR);
      c.row(15, 7, 40, L(TRAMR));
      c.row(19, 8, 39, P.GILT);
      c.row(22, 7, 40, D(TRAMR));
      dots(c, P.GILT, [22, 17, 24, 17, 25, 17]);
      for (const x of [2, 41]) {
        c.rect(x, 15, x + 4, 22, TRAMR); // the dash of each platform
        c.row(15, x, x + 4, L(TRAMR));
        c.row(22, x, x + 4, D(TRAMR));
      }
      c.col(2, 6, 14, FEND);
      c.col(45, 6, 14, FEND);
      c.col(4, 11, 14, BR); // the controller
      c.set(4, 10, K);
      c.col(43, 11, 14, BR);
      c.set(43, 10, K);
      c.rect(3, 23, 6, 24, C.iron); // steps
      c.rect(41, 23, 44, 24, C.iron);
      c.rect(9, 23, 38, 24, FEND);
      c.rect(11, 25, 36, 26, C.ironDark); // the truck
      for (const cx of [15, 32]) {
        c.oval(cx - 3, 24, cx + 3, 30, C.iron);
        c.oval(cx - 2, 25, cx + 2, 29, C.ironDark);
        c.set(cx, 27, C.steel);
        c.set(cx - 2, 25, C.steel);
      }
      c.rect(20, 27, 27, 28, C.iron);
      c.line(41, 26, 45, 28, C.iron); // lifeguards
      c.line(6, 26, 2, 28, C.iron);
      lampGlass(c, 45, 17, 46, 19, false);
      c.col(46, 17, 19, u ? C.glow : hex('#6f7b7a'));
      if (u) beam(c, 47, 18, 5);
    },
    u: [0, 0, 5],
    sw: 26, sh: 32,
    s(c, u) {
      const b = c.h - 2,
        G = u ? LIT : GLASSD;
      c.col(12, 1, 2, C.iron);
      c.rect(8, 2, 17, 3, C.slate);
      c.row(2, 8, 17, L(C.slate));
      c.rect(3, 4, 22, 5, C.stoneDark);
      c.row(4, 4, 21, C.stone);
      c.rect(4, 6, 21, 14, CREAM);
      c.rect(9, 6, 16, 7, INK); // destination board
      type(c, 10, 15, 6, u ? LIT : CREAM, 2);
      for (const [x0, x1] of [[5, 8], [10, 15], [17, 20]]) {
        c.rect(x0, 9, x1, 13, G);
        if (!u) c.set(x0 + 1, 12, C.glassLight), c.set(x0 + 2, 11, C.glassLight);
      }
      if (u) {
        c.rect(12, 11, 14, 13, INK); // the motorman
        c.set(13, 10, INK);
      }
      c.rect(3, 15, 22, 23, TRAMR);
      c.row(15, 3, 22, L(TRAMR));
      c.col(3, 15, 23, L(TRAMR));
      c.row(23, 3, 22, D(TRAMR));
      lampGlass(c, 10, 16, 15, 21, u);
      if (u) dots(c, C.glow, [8, 18, 17, 18, 12, 14, 13, 22, 9, 16, 16, 16, 9, 21, 16, 21]);
      dots(c, P.GILT, [5, 18, 6, 18, 19, 18, 20, 18]);
      c.rect(2, 24, 23, 25, C.iron); // bumper
      c.row(24, 2, 23, C.steel);
      c.rect(11, 25, 14, 26, C.ironDark);
      for (let x = 4; x <= 21; x += 2) c.col(x, 26, 28, C.iron); // lifeguard
      c.row(28, 4, 21, C.iron);
      c.rect(5, 29, 7, b, C.ironDark);
      c.rect(18, 29, 20, b, C.ironDark);
    },
  });

  /* ---------- the speakeasy ---------- */
  const glass = (c, x, yb, full) => {
    c.rect(x, yb - 2, x + 1, yb, full ? AMBER : C.glassLight);
    if (full) c.row(yb - 3, x, x + 1, C.white);
    else c.set(x + 1, yb - 2, C.glass);
  };
  add('twenties-speakeasy-bar-counter', 'large speakeasy bar counter mahogany brass foot rail beer taps saloon pub hidden liquor 1920s', {
    w: 48, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 7, 46, 8, mix(MAH, 0.8)); // the top
      c.row(7, 1, 46, L(MAH));
      c.row(9, 2, 45, BR);
      face(c, 2, 10, 45, 21, MAH);
      for (let x = 4; x <= 38; x += 8) panel(c, x, 12, x + 5, 19, MAH);
      c.col(44, 10, 21, D(MAH));
      c.row(22, 1, 46, BR); // foot rail
      c.row(21, 2, 45, mix(MAH, 0.5));
      for (const x of [6, 22, 38]) c.set(x, 23, D(BR));
      c.rect(3, 23, 44, b, EB);
      c.row(22, 1, 46, L(BR));
      for (const x of [20, 23, 26]) {
        c.col(x, 2, 5, EB); // the pumps
        c.set(x, 2, C.bone);
        c.set(x, 6, BR);
        c.set(x + 1, 6, BR);
      }
      glass(c, 7, 6, u);
      glass(c, 11, 6, false);
      bottle(c, 34, 6, 6, GRN);
      bottle(c, 38, 6, 5, AMBER);
      c.rect(41, 5, 44, 6, C.white); // a folded cloth
      c.row(6, 41, 44, D(C.white));
      if (u) {
        hollow(c, 12, 12, 17, 19, MAH); // a panel slid aside: the real stock
        c.row(16, 12, 17, mix(MAH, 0.6));
        for (let x = 12; x <= 17; x += 2) {
          c.col(x, 13, 15, x % 4 ? GRN : AMBER);
          c.set(x, 12, C.parchment);
          c.col(x, 17, 19, x % 4 ? AMBER : hex('#7a8a90'));
        }
        c.rect(4, 12, 9, 19, D(MAH));
        c.col(9, 12, 19, L(MAH));
        c.rect(13, 5, 15, 6, C.glassLight); // a glass knocked over
        c.row(6, 16, 19, AMBER);
        c.col(17, 9, 12, AMBER);
        glass(c, 30, 6, true);
      }
    },
    sw: 14, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 7, 12, 8, mix(MAH, 0.8));
      c.row(7, 1, 12, L(MAH));
      cabSide(c, 2, 9, 10, 21, MAH);
      c.col(10, 9, 21, mix(MAH, 0.8));
      c.rect(11, 22, 12, 22, BR); // the rail on its bracket
      c.set(11, 23, D(BR));
      c.rect(2, 22, 10, b, EB);
      c.col(5, 2, 5, EB);
      c.set(5, 2, C.bone);
      c.rect(5, 6, 6, 6, BR);
      glass(c, 9, 6, u);
      bottle(c, 2, 6, 6, GRN);
      if (u) {
        doorOut(c, 11, 12, 19, 4, MAH);
        c.row(6, 7, 8, AMBER);
        c.col(11, 8, 10, AMBER);
      }
    },
    su: [0, 0, 3],
  });
  add('twenties-back-bar-mirror-shelves', 'back bar shelves mirror bottles liquor saloon speakeasy mahogany glasses cabinet', {
    w: 34, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      H.deco(c, 6, 27, 3, MAH, 2);
      face(c, 2, 4, 31, 24, MAH);
      pane(c, 5, 6, 28, 13, hex('#6f8a90')); // the mirror
      c.frame(4, 5, 29, 14, BR);
      for (const y of [18, 23]) board(c, 3, y, 30, y + 1, mix(MAH, 0.8));
      hollow(c, 4, 15, 29, 17, MAH);
      hollow(c, 4, 20, 29, 22, MAH);
      const r = rnd(7);
      const cols = [GRN, AMBER, hex('#7a8a90'), OX, C.bone, AMBER];
      for (let x = 5; x <= 28; x += 2) {
        const gone = u && x > 9 && x < 25;
        if (!gone || x === 17) c.col(x, 15, 17, cols[(r() * 6) | 0]);
        if (!gone) c.set(x, 15, C.parchment);
        if (!(u && x > 13 && x < 27)) c.col(x, 21, 22, cols[(r() * 6) | 0]);
      }
      board(c, 1, 25, 32, 26, mix(MAH, 0.8));
      face(c, 2, 27, 31, b, MAH);
      for (let x = 4; x <= 24; x += 10) panel(c, x, 29, x + 7, b - 2, MAH);
      for (let x = 4; x <= 24; x += 10) c.set(x + 6, 33, BR);
      for (let x = 6; x <= 12; x += 3) glass(c, x, 24, false);
      if (u) {
        c.line(12, 7, 19, 12, C.white); // a bullet in the mirror
        c.line(16, 6, 15, 13, C.white);
        c.line(11, 11, 21, 8, C.white);
        c.set(16, 9, K);
        c.set(15, 10, K);
        c.rect(19, 23, 21, 24, hex('#7a8a90')); // a bottle on its side
        c.set(22, 24, C.parchment);
        H.shards(c, 22, 29, 24, C.glassLight, 5);
      }
    },
    sw: 12, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 6, 3, MAH);
      cabSide(c, 2, 4, 6, 24, MAH);
      board(c, 1, 25, 10, 26, mix(MAH, 0.8));
      cabSide(c, 2, 27, 9, b, MAH);
      c.rect(7, 18, 8, 19, mix(MAH, 0.8)); // shelves, edge on
      c.rect(7, 23, 8, 24, mix(MAH, 0.8));
      c.col(7, 15, 17, u ? mix(MAH, 0.36) : GRN);
      c.set(7, 15, u ? mix(MAH, 0.36) : C.parchment);
      c.col(7, 21, 22, AMBER);
      c.col(7, 5, 14, hex('#6f8a90'));
      glass(c, 8, 24, false);
      if (u) {
        c.rect(7, 24, 9, 24, hex('#7a8a90'));
        c.set(7, 8, C.white);
        c.set(7, 10, C.white);
      }
    },
  });

  /* ---------- the rum-runner ---------- */
  const HULL = hex('#6a5038');
  add('twenties-rum-runner-motor-boat', 'large rum runner motor boat launch beached on chocks smuggler bootleg cargo tarpaulin wooden hull', {
    w: 48, h: 24, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.poly([[2, 11], [41, 11], [46, 8], [43, 15], [39, 19], [7, 19], [3, 16]], HULL);
      c.poly([[3, 16], [43, 16], [39, 19], [7, 19]], OX); // below the water line
      c.row(11, 2, 41, L(HULL));
      c.line(41, 11, 46, 8, L(HULL));
      c.row(13, 3, 43, D(HULL));
      c.row(16, 3, 42, mix(OX, 0.7));
      c.row(20, 8, 38, C.woodDark); // keel
      type(c, 36, 41, 13, CREAM, 2);
      c.rect(1, 15, 2, 19, BR); // rudder and screw
      c.set(2, 20, BR);
      c.rect(26, 5, 33, 10, HULL); // the wheelhouse
      c.row(5, 25, 34, L(HULL));
      c.rect(28, 6, 32, 8, GLASSD);
      c.set(29, 7, C.glassLight);
      c.rect(35, 9, 40, 10, mix(HULL, 0.8)); // engine hatch
      c.col(24, 3, 10, C.wood); // the lantern post
      c.rect(23, 2, 25, 4, u ? C.glow : hex('#6f7b7a'));
      c.set(24, 1, C.iron);
      if (u) dots(c, C.glow, [21, 3, 27, 3, 24, 6, 22, 1, 26, 1]);
      if (!u) {
        c.poly([[4, 10], [5, 7], [10, 5], [16, 6], [21, 7], [22, 10]], TARP);
        c.line(5, 7, 10, 5, L(TARP));
        c.line(10, 5, 16, 6, L(TARP));
        c.line(12, 6, 13, 10, D(TARP));
        c.line(18, 7, 19, 10, D(TARP));
        c.line(8, 6, 7, 11, C.straw);
      } else {
        cratesLoad(c, 5, 18, 10);
        c.poly([[19, 10], [20, 8], [22, 8], [22, 10]], TARP);
        c.poly([[1, 12], [3, 9], [5, 10], [4, 14], [2, 16]], TARP); // the sheet hanging over the stern
        c.line(3, 10, 2, 15, D(TARP));
      }
      for (const x of [10, 33]) {
        c.rect(x, 20, x + 3, b, C.wood); // chocks
        c.row(20, x, x + 3, C.woodLight);
      }
      c.line(6, 19, 4, b, C.wood);
      c.line(40, 18, 43, b, C.wood);
    },
    sw: 22, sh: 24,
    s(c, u) {
      const b = c.h - 2; // bow on
      c.poly([[2, 11], [19, 11], [18, 15], [13, 20], [8, 20], [3, 15]], HULL);
      c.poly([[3, 16], [18, 16], [13, 20], [8, 20]], OX);
      c.row(11, 2, 19, L(HULL));
      c.row(13, 3, 18, D(HULL));
      c.col(10, 8, 20, L(HULL)); // the stem
      c.col(11, 8, 20, D(HULL));
      c.rect(6, 5, 15, 10, HULL);
      c.row(5, 5, 16, L(HULL));
      c.rect(7, 6, 9, 8, GLASSD);
      c.rect(12, 6, 14, 8, GLASSD);
      c.set(8, 7, C.glassLight);
      c.col(4, 3, 10, C.wood);
      c.rect(3, 2, 5, 4, u ? C.glow : hex('#6f7b7a'));
      c.set(4, 1, C.iron);
      if (u) {
        dots(c, C.glow, [1, 3, 7, 3, 2, 1, 6, 1]);
        crate(c, 15, 7, 19, 10, C.woodPale, INK); // crates show beyond the wheelhouse
        dots(c, AMBER, [16, 6, 18, 6]);
        dots(c, C.parchment, [16, 5, 18, 5]);
      } else {
        c.poly([[16, 10], [16, 7], [19, 8], [19, 10]], TARP);
        c.row(7, 16, 18, L(TARP));
      }
      for (const x of [3, 15]) {
        c.rect(x, 18, x + 3, b, C.wood); // chocks either side of the keel
        c.row(18, x, x + 3, C.woodLight);
        c.col(x + 3, 19, b, C.woodDark);
      }
    },
  });
};
