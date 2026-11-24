/* Old time (the 1800s), first part: the large things on wheels, and the street. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, legs, cabSide, hollow, pane, flame, fire, wisp, bottle, shards, bricks, stones, glow, puddle, cartWheel, wheelEdge, planksV, heap } = H;
  const add = H.reg('env-oldtime', 'Old time');
  const OAK = hex('#6a4a32'),
    PINE = hex('#94714a'),
    COACHRED = hex('#6a2a26'),
    COACHBLACK = hex('#24222a'),
    WHEELY = hex('#a8862e'),
    OMNI = hex('#2f4a3c'),
    CREAM = hex('#b9ad8a'),
    CANVAS = hex('#a39878'),
    LEATHER = hex('#4a2e28'),
    ENG = hex('#2f4f3a'),
    ENGRED = hex('#7a2a26'),
    FIRERED = hex('#8f2a24'),
    FADEBLUE = hex('#4f5f78'),
    BR = C.brass,
    GILT = C.gold,
    IRONB = hex('#2a2a30'),
    SACK = hex('#9a8a62'),
    LIT = hex('#e0c868');
  const lamp = (c, x, y, on) => {
    c.rect(x, y, x + 1, y + 2, on ? C.flameLight : C.glass);
    c.row(y - 1, x, x + 1, BR);
    c.row(y + 3, x, x + 1, IRONB);
    if (on) glow(c, x, y - 2);
  };
  const trunk = (c, x0, y0, x1, y1, col = LEATHER) => {
    c.rect(x0, y0, x1, y1, col);
    c.row(y0, x0, x1, L(col));
    c.col(x0 + 1, y0, y1, BR);
    c.col(x1 - 1, y0, y1, BR);
  };

  /* ---------- large ---------- */
  add('oldtime-stagecoach', 'old time large stagecoach mail coach horse drawn carriage red black yellow wheels luggage', {
    w: 48, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.row(3, 14, 37, IRONB); // the roof rail and what is strapped on
      for (const x of [14, 22, 30, 37]) c.col(x, 3, 4, IRONB);
      if (!u) trunk(c, 16, 1, 23, 4);
      c.rect(26, 2, 30, 4, hex('#5a5236'));
      c.row(2, 26, 30, hex('#7a6a45'));
      c.rect(11, 5, 39, 6, COACHBLACK);
      c.row(5, 12, 38, L(COACHBLACK));
      c.poly([[13, 7], [37, 7], [38, 16], [35, b - 8], [15, b - 8], [12, 16]], COACHRED);
      c.rect(13, 7, 37, 14, COACHBLACK);
      c.row(15, 12, 38, GILT);
      c.line(12, 16, 15, b - 8, L(COACHRED));
      for (const [x0, x1] of [[15, 19], [30, 34]]) pane(c, x0, 9, x1, 13, C.glass);
      if (!u) {
        pane(c, 22, 9, 27, 13, C.glass);
        c.col(21, 8, b - 9, D(COACHRED));
        c.col(28, 8, b - 9, D(COACHRED));
        c.set(27, 17, BR);
        dots(c, GILT, [23, 18, 24, 18, 25, 18, 24, 19]);
      } else {
        c.rect(21, 8, 28, b - 9, hex('#1c1618')); // the door standing open
        c.rect(22, 16, 27, 18, C.wine);
        c.row(16, 22, 27, L(C.wine));
        c.rect(22, 10, 27, 12, mix(C.wine, 0.7));
        c.col(20, 8, b - 9, L(COACHRED));
        c.rect(23, b - 8, 26, b - 7, IRONB); // the step let down
        c.rect(23, b - 4, 26, b - 3, IRONB);
        trunk(c, 21, b - 3 + 1 - 3, 29, b); // a trunk off the roof, burst
        c.poly([[21, b - 6], [29, b - 8], [29, b - 6]], L(LEATHER));
        dots(c, C.white, [23, b - 6, 25, b - 6, 26, b - 7, 30, b, 31, b]);
        c.set(27, b - 6, C.wine);
      }
      c.rect(39, 13, 43, b - 9, LEATHER); // the boot
      c.row(13, 39, 43, L(LEATHER));
      c.col(41, 14, b - 9, BR);
      c.rect(6, 9, 11, 11, COACHBLACK); // the box seat
      c.row(9, 6, 11, L(COACHBLACK));
      c.rect(7, 12, 11, 17, COACHBLACK);
      c.rect(3, 15, 9, 15, OAK);
      c.line(3, 15, 2, 12, IRONB);
      lamp(c, 11, 9, u);
      c.row(b - 8, 9, 41, IRONB);
      c.line(15, b - 8, 12, b - 6, IRONB);
      c.line(35, b - 8, 36, b - 9, IRONB);
      c.line(7, b - 7, 1, b - 3, OAK);
      cartWheel(c, 12, b - 5, 5, WHEELY);
      cartWheel(c, 36, b - 7, 7, WHEELY);
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 3, b - 10, b, WHEELY, 2);
      wheelEdge(c, 23, b - 10, b, WHEELY, 2);
      c.row(b - 5, 5, 22, IRONB);
      c.row(3, 7, 20, IRONB);
      c.col(7, 3, 4, IRONB);
      c.col(20, 3, 4, IRONB);
      if (!u) trunk(c, 9, 1, 16, 4);
      c.rect(5, 5, 22, 6, COACHBLACK);
      c.row(5, 6, 21, L(COACHBLACK));
      c.rect(6, 7, 21, 14, COACHBLACK);
      c.poly([[6, 15], [21, 15], [20, b - 8], [7, b - 8]], COACHRED);
      c.row(15, 6, 21, GILT);
      pane(c, 8, 8, 11, 10, C.glass);
      pane(c, 16, 8, 19, 10, C.glass);
      c.rect(5, 11, 22, 13, COACHBLACK); // the box seat across the front
      c.row(11, 5, 22, L(COACHBLACK));
      c.rect(6, 17, 21, 18, OAK);
      c.row(17, 6, 21, L(OAK));
      lamp(c, 3, 9, u);
      lamp(c, 23, 9, u);
      c.rect(13, b - 8, 14, b, OAK); // the pole
      c.row(b - 6, 8, 19, OAK);
      c.row(b - 8, 6, 21, IRONB);
      if (u) {
        face(c, 23, 13, 25, b - 9, COACHRED); // the door swung out
        c.rect(24, 9, 25, 12, C.glass);
        c.rect(23, 8, 25, 8, COACHBLACK);
        trunk(c, 17, b - 4, 24, b);
        dots(c, C.white, [19, b - 5, 21, b - 5, 25, b]);
      }
    },
    su: [0, 0, 1],
    base: 'side',
  });

  add('oldtime-omnibus-horse-drawn', 'old time large horse drawn omnibus bus knifeboard top deck stairs passengers street green', {
    w: 48, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.row(3, 6, 39, IRONB); // the top deck rail
      for (let x = 6; x <= 39; x += 3) c.col(x, 3, 6, IRONB);
      c.rect(10, 4, 34, 5, CREAM); // the advertisement along it
      for (let x = 12; x < 34; x += 2) if (x % 8 !== 0) c.set(x, 5, x < 22 ? FIRERED : hex('#3a3440'));
      c.rect(3, 7, 41, 8, OMNI);
      c.row(7, 3, 41, L(OMNI));
      face(c, 4, 9, 40, b - 8, OMNI);
      for (let i = 0; i < 6; i++) {
        const x = 6 + i * 6;
        c.rect(x, 10, x + 3, 14, u ? LIT : C.glass);
        if (!u) c.set(x + 1, 13, C.glassLight);
        else if (i === 1 || i === 3 || i === 4) {
          c.rect(x + 1, 12, x + 2, 14, hex('#3a3024')); // heads against the lamplight
          c.set(x + (i === 3 ? 1 : 2), 11, hex('#3a3024'));
        }
      }
      c.rect(4, 16, 40, 18, CREAM);
      for (let x = 7; x < 38; x += 2) if (x % 10 !== 5) c.set(x, 17, FIRERED);
      c.row(b - 9, 4, 40, GILT);
      c.rect(2, 5, 5, 6, COACHBLACK); // the driver up in front
      c.rect(1, 9, 3, 9, OAK);
      c.col(2, 7, 8, IRONB);
      lamp(c, 2, 11, u);
      c.rect(41, b - 9, 46, b - 8, OAK); // the platform and the stair
      for (let i = 0; i < 6; i++) c.rect(41 + (i > 2 ? i - 1 : i), b - 11 - i * 2, 43 + (i > 2 ? i - 1 : i), b - 11 - i * 2, IRONB);
      c.line(46, b - 9, 46, 6, IRONB);
      c.line(46, 6, 40, 3, IRONB);
      c.row(b - 7, 6, 44, IRONB);
      c.line(4, b - 8, 1, b - 4, OAK);
      cartWheel(c, 10, b - 4, 4, WHEELY);
      cartWheel(c, 35, b - 6, 6, WHEELY);
      if (u) dots(c, C.glow, [5, 15, 11, 15, 17, 15, 23, 15, 29, 15, 35, 15]);
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, b - 12, b, WHEELY, 2);
      wheelEdge(c, 24, b - 12, b, WHEELY, 2);
      c.row(b - 6, 4, 23, IRONB);
      c.row(3, 4, 23, IRONB);
      for (const x of [4, 10, 17, 23]) c.col(x, 3, 6, IRONB);
      c.rect(6, 4, 21, 5, CREAM);
      for (let x = 8; x < 21; x += 2) c.set(x, 5, FIRERED);
      c.rect(4, 7, 23, 8, OMNI);
      c.row(7, 4, 23, L(OMNI));
      face(c, 5, 9, 22, b - 9, OMNI);
      c.rect(9, 10, 15, b - 10, u ? LIT : hex('#1c2226')); // the way in at the back
      c.rect(6, 10, 7, 14, u ? LIT : C.glass);
      if (u) {
        c.rect(11, 14, 13, b - 10, hex('#3a3024')); // the conductor, or somebody
        c.rect(11, 11, 13, 13, hex('#3a3024'));
        dots(c, C.glow, [8, b - 9, 12, b - 7, 16, b - 9]);
      } else dots(c, hex('#2f3a40'), [11, 16, 13, 16, 12, 12]);
      for (let i = 0; i < 6; i++) c.rect(16 + (i >> 1), b - 11 - i * 2, 21, b - 11 - i * 2, IRONB); // the stair winding up
      c.col(22, 6, b - 10, IRONB);
      c.rect(4, b - 8, 23, b - 7, OAK);
      c.row(b - 8, 4, 23, L(OAK));
      c.rect(6, b - 12, 7, b - 10, u ? FIRERED : hex('#5a2420'));
      c.set(6, b - 13, IRONB);
    },
    base: 'side',
  });

  add('oldtime-traction-engine-steam', 'old time large steam traction engine road locomotive boiler chimney flywheel canopy threshing', {
    w: 48, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(12, 2, 46, 3, ENG); // the canopy
      c.row(2, 12, 46, L(ENG));
      for (const x of [14, 30, 45]) c.col(x, 4, 13, IRONB);
      c.rect(5, 5, 7, 14, IRONB); // the chimney
      c.col(5, 5, 14, C.iron);
      c.rect(4, 3, 8, 4, BR);
      c.rect(3, 14, 9, 22, IRONB); // smokebox
      c.col(3, 15, 21, C.iron);
      c.rect(10, 14, 30, 21, ENG); // the boiler
      c.row(14, 10, 30, L(ENG));
      c.row(21, 10, 30, D(ENG));
      for (const x of [15, 22]) c.col(x, 14, 21, BR);
      c.rect(14, 22, 28, 23, IRONB);
      c.rect(11, 11, 16, 13, IRONB); // cylinder, rod, flywheel
      c.row(11, 11, 16, BR);
      c.row(12, 17, 23, C.steel);
      face(c, 30, 12, 42, 23, ENG); // the cab
      panel(c, 32, 14, 38, 19, ENG);
      c.rect(34, 16, 36, 17, BR);
      c.rect(41, 14, 45, 23, IRONB); // the bunker
      c.row(13, 41, 45, hex('#17151c'));
      dots(c, C.iron, [42, 13, 44, 13]);
      c.line(10, 23, 9, b - 8, C.iron);
      lamp(c, 1, 16, u);
      cartWheel(c, 26, 12, 4, ENGRED, BR);
      cartWheel(c, 9, b - 5, 5, ENGRED);
      cartWheel(c, 36, b - 9, 9, ENGRED);
      if (u) {
        c.oval(4, -2, 9, 1, C.ash); // getting up steam
        c.oval(7, -6, 14, -2, hex('#a5a29c'));
        c.oval(12, -7, 17, -4, C.ash);
        c.set(6, 2, C.ash);
        wisp(c, 12, 10, 3, C.ghost);
        dots(c, C.flame, [30, 24, 31, 25, 32, 24, 29, b - 1, 30, b]);
        dots(c, C.flameLight, [31, 24, 30, 25]);
        dots(c, C.ash, [43, b, 45, b - 1 + 1]);
      }
    },
    sw: 28, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 25, 3, ENG);
      c.row(2, 2, 25, L(ENG));
      for (const x of [3, 24]) c.col(x, 4, 16, IRONB);
      c.rect(12, 5, 15, 12, IRONB);
      c.col(12, 5, 12, C.iron);
      c.rect(11, 3, 16, 4, BR);
      wheelEdge(c, 1, b - 18, b, ENGRED, 3); // the driving wheels behind, the steering wheels in front
      wheelEdge(c, 24, b - 18, b, ENGRED, 3);
      c.rect(4, 16, 23, 22, ENG);
      c.row(16, 4, 23, L(ENG));
      c.oval(8, 12, 19, 23, IRONB); // the smokebox door
      c.oval(9, 13, 18, 22, C.iron);
      c.oval(10, 14, 18, 22, IRONB);
      c.rect(13, 17, 14, 18, BR);
      c.col(9, 16, 19, BR);
      c.row(b - 6, 7, 20, IRONB);
      c.rect(12, 24, 15, b - 7, IRONB);
      wheelEdge(c, 6, b - 10, b, ENGRED, 2);
      wheelEdge(c, 20, b - 10, b, ENGRED, 2);
      lamp(c, 5, 12, u);
      lamp(c, 21, 12, u);
      if (u) {
        c.oval(11, -2, 16, 1, C.ash);
        c.oval(13, -6, 20, -2, hex('#a5a29c'));
        c.set(13, 2, C.ash);
        dots(c, C.flame, [10, b, 13, b - 1, 14, b, 17, b]);
        c.set(13, b, C.flameLight);
      }
    },
    u: [0, 7, 0], su: [0, 7, 0],
    base: 'side',
  });

  add('oldtime-delivery-wagon-covered', 'old time large covered delivery wagon canvas tilt carrier cart horse drawn goods van', {
    w: 48, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[8, b - 16], [8, 8], [12, 4], [41, 4], [45, 8], [45, b - 16]], CANVAS);
      c.line(8, 8, 12, 4, L(CANVAS));
      c.row(4, 12, 41, L(CANVAS));
      for (const x of [15, 23, 31, 39]) c.col(x, 5, b - 16, D(CANVAS));
      if (u) {
        c.rect(16, 9, 38, b - 16, hex('#2a2420')); // the side rolled up: what it carries
        c.rect(15, 7, 39, 8, L(CANVAS));
        c.row(9, 15, 39, D(CANVAS));
        c.rect(17, b - 21, 23, b - 16, PINE);
        c.row(b - 21, 17, 23, L(PINE));
        c.col(20, b - 20, b - 16, D(PINE));
        c.rect(18, b - 25, 22, b - 22, OAK);
        c.oval(25, b - 21, 30, b - 16, SACK);
        c.oval(29, b - 20, 34, b - 16, D(SACK));
        c.oval(26, b - 25, 32, b - 21, SACK);
        c.set(28, b - 24, L(SACK));
        c.rect(35, b - 23, 37, b - 16, hex('#5a5a62')); // a churn
        c.row(b - 24, 35, 37, C.steel);
      }
      face(c, 8, b - 15, 45, b - 11, FADEBLUE);
      for (let x = 12; x < 44; x += 2) if (x % 8 !== 4) c.set(x, b - 13, CREAM);
      board(c, 6, b - 10, 46, b - 9, OAK);
      c.rect(3, b - 17, 8, b - 16, COACHBLACK); // the seat
      c.col(7, b - 15, b - 11, OAK);
      c.rect(1, b - 11, 6, b - 11, OAK);
      c.line(4, b - 9, 1, b - 3, OAK);
      c.col(9, 9, 10, IRONB);
      lamp(c, 9, 12, u);
      c.row(b - 8, 9, 42, IRONB);
      cartWheel(c, 12, b - 5, 5, OAK);
      cartWheel(c, 36, b - 6, 6, OAK);
    },
    sw: 28, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, b - 12, b, OAK, 2);
      wheelEdge(c, 24, b - 12, b, OAK, 2);
      c.row(b - 6, 4, 23, IRONB);
      c.poly([[5, b - 16], [5, 8], [9, 3], [18, 3], [22, 8], [22, b - 16]], CANVAS);
      c.line(5, 8, 9, 3, L(CANVAS));
      c.row(3, 9, 18, L(CANVAS));
      c.poly([[7, b - 16], [7, 9], [10, 6], [17, 6], [20, 9], [20, b - 16]], hex('#1c1618'));
      if (!u) {
        c.poly([[7, 9], [10, 6], [12, 6], [9, b - 16], [7, b - 16]], D(CANVAS)); // the flaps hanging
        c.poly([[20, 9], [17, 6], [15, 6], [18, b - 16], [20, b - 16]], D(CANVAS));
        face(c, 5, b - 15, 22, b - 10, FADEBLUE);
        for (let x = 8; x < 21; x += 2) c.set(x, b - 13, CREAM);
        dots(c, IRONB, [6, b - 14, 21, b - 14]);
      } else {
        c.rect(8, b - 21, 13, b - 16, PINE); // the tailboard down: crates and sacks
        c.row(b - 21, 8, 13, L(PINE));
        c.col(11, b - 20, b - 16, D(PINE));
        c.oval(13, b - 21, 19, b - 16, SACK);
        c.oval(10, b - 25, 16, b - 21, D(SACK));
        c.set(15, b - 20, L(SACK));
        face(c, 5, b - 9, 22, b - 5, FADEBLUE);
        c.row(b - 7, 7, 20, D(FADEBLUE));
        c.col(5, b - 14, b - 10, IRONB); // its chains
        c.col(22, b - 14, b - 10, IRONB);
        dots(c, C.glow, [9, 10, 17, 9]);
      }
      board(c, 4, b - 10 + (u ? 0 : 0), 23, b - 10, OAK);
      lamp(c, 2, 12, u);
    },
    base: 'side',
  });

  add('oldtime-fire-engine-steam-pump', 'old time large steam fire engine horse drawn pumper brass boiler red wheels hose brigade', {
    w: 48, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(34, 2, 35, 6, IRONB); // funnel
      c.row(1, 33, 36, BR);
      c.rect(31, 8, 38, b - 18, BR); // the boiler, polished
      c.col(31, 8, b - 18, L(BR));
      c.col(38, 8, b - 18, D(BR));
      c.row(7, 32, 37, L(BR));
      for (const y of [11, 16]) c.row(y, 31, 38, D(BR));
      c.rect(30, b - 17, 39, b - 11, IRONB);
      c.row(b - 17, 30, 39, C.iron);
      c.rect(33, b - 15, 36, b - 12, u ? C.flame : hex('#17151c'));
      if (u) dots(c, C.flameLight, [34, b - 13, 35, b - 14, 34, b - 12]);
      c.oval(24, 8, 28, 12, hex('#a35f38')); // the air vessel
      c.set(25, 9, hex('#c88a5a'));
      c.col(26, 13, 15, hex('#a35f38'));
      c.rect(22, 16, 29, b - 11, C.steel); // the pump
      c.row(16, 22, 29, L(C.steel));
      c.col(25, 17, b - 11, C.iron);
      dots(c, BR, [23, 18, 27, 18, 23, b - 12, 27, b - 12]);
      c.oval(14, b - 18, 20, b - 11, hex('#8a7a4a')); // the hose coiled
      c.oval(15, b - 17, 19, b - 12, hex('#5a5236'));
      c.oval(16, b - 16, 18, b - 13, hex('#8a7a4a'));
      face(c, 5, b - 16, 12, b - 11, FIRERED); // the driving box
      c.row(b - 14, 6, 11, GILT);
      c.rect(5, b - 18, 12, b - 17, COACHBLACK);
      c.rect(2, b - 11, 6, b - 11, OAK);
      lamp(c, 3, b - 19, u);
      c.col(13, b - 22, b - 17, IRONB); // the bell
      c.rect(12, b - 24, 14, b - 22, BR);
      c.set(13, b - 25, BR);
      c.rect(4, b - 10, 44, b - 9, FIRERED);
      c.row(b - 10, 4, 44, L(FIRERED));
      c.line(4, b - 9, 1, b - 3, OAK);
      cartWheel(c, 11, b - 5, 5, FIRERED);
      cartWheel(c, 35, b - 7, 7, FIRERED);
      if (u) {
        c.oval(32, -3, 37, 0, C.ash);
        c.oval(35, -6, 42, -2, hex('#a5a29c'));
        wisp(c, 26, 7, 3, C.ghost);
        c.clearRect(14, b - 18, 20, b - 11); // the hose run out along the ground
        c.rect(14, b - 12, 20, b - 11, hex('#8a7a4a'));
        c.line(18, b - 11, 20, b, hex('#8a7a4a'));
        c.row(b, 20, 27, hex('#8a7a4a'));
        c.row(b, 44, 47, hex('#8a7a4a'));
        c.set(47, b - 1, BR);
        dots(c, hex('#6f8f98'), [22, b - 1, 45, b - 1]);
      }
    },
    sw: 28, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      wheelEdge(c, 2, b - 14, b, FIRERED, 2);
      wheelEdge(c, 24, b - 14, b, FIRERED, 2);
      c.row(b - 7, 4, 23, IRONB);
      c.rect(13, 2, 14, 6, IRONB);
      c.row(1, 12, 15, BR);
      c.rect(9, 8, 18, b - 18, BR);
      c.col(9, 8, b - 18, L(BR));
      c.col(18, 8, b - 18, D(BR));
      c.row(7, 10, 17, L(BR));
      for (const y of [11, 16]) c.row(y, 9, 18, D(BR));
      c.rect(8, b - 17, 19, b - 11, IRONB);
      c.row(b - 17, 8, 19, C.iron);
      c.rect(11, b - 15, 16, b - 12, u ? C.flame : hex('#17151c')); // the fire door is at the back
      c.frame(11, b - 15, 16, b - 12, C.iron);
      if (u) dots(c, C.flameLight, [13, b - 13, 14, b - 14, 12, b - 13]);
      c.rect(9, 13, 10, 14, CREAM); // gauges
      c.rect(17, 13, 18, 14, CREAM);
      c.rect(4, b - 10, 23, b - 9, FIRERED);
      c.row(b - 10, 4, 23, L(FIRERED));
      c.rect(8, b - 8, 19, b - 7, OAK); // the stoker's step
      lamp(c, 5, b - 16, u);
      lamp(c, 21, b - 16, u);
      if (u) {
        c.oval(11, -3, 16, 0, C.ash);
        c.oval(13, -6, 20, -2, hex('#a5a29c'));
        dots(c, C.flame, [12, b - 6, 15, b - 6]);
        c.row(b, 6, 20, hex('#8a7a4a'));
        c.set(21, b - 1, hex('#8a7a4a'));
      }
    },
    u: [0, 7, 0], su: [0, 7, 0],
    base: 'side',
  });

  /* ---------- the street ---------- */
  add('oldtime-gas-street-lamp', 'old time gas street lamp post cast iron lantern lamplighter victorian light', {
    w: 12, h: 50, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, b - 3, 7, b, IRONB);
      c.rect(3, b, 8, b, IRONB);
      c.rect(5, 12, 6, b - 4, IRONB);
      c.col(5, 12, b - 4, C.iron);
      dots(c, C.iron, [4, b - 10, 7, b - 10, 4, 20, 7, 20]);
      c.row(13, 2, 9, IRONB); // the ladder bar
      c.poly([[3, 4], [8, 4], [7, 11], [4, 11]], u ? LIT : hex('#5a6a6a'));
      c.line(3, 4, 4, 11, IRONB);
      c.line(8, 4, 7, 11, IRONB);
      c.col(5, 4, 11, u ? C.white : IRONB);
      c.row(11, 4, 7, IRONB);
      c.poly([[2, 3], [9, 3], [6, 1], [5, 1]], IRONB);
      c.set(5, 0, IRONB);
      if (u) {
        c.set(6, 7, C.flameLight);
        dots(c, C.glow, [1, 6, 10, 6, 2, 9, 9, 9, 1, 2 + 9, 10, 11]);
      }
    },
    sw: 10, sh: 50,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 3, 6, b, IRONB);
      c.rect(2, b, 7, b, IRONB);
      c.rect(4, 12, 5, b - 4, IRONB);
      c.col(4, 12, b - 4, C.iron);
      dots(c, C.iron, [3, b - 10, 6, b - 10, 3, 20, 6, 20]);
      c.rect(4, 13, 5, 13, C.iron);
      c.poly([[2, 4], [7, 4], [6, 11], [3, 11]], u ? LIT : hex('#5a6a6a'));
      c.line(2, 4, 3, 11, IRONB);
      c.line(7, 4, 6, 11, IRONB);
      c.row(11, 3, 6, IRONB);
      c.poly([[1, 3], [8, 3], [5, 1], [4, 1]], IRONB);
      c.set(4, 0, IRONB);
      if (u) {
        c.set(4, 7, C.flameLight);
        dots(c, C.glow, [0, 6, 9, 6, 1, 9, 8, 9]);
      }
    },
  });

  add('oldtime-hitching-rail', 'old time hitching rail post horses tie up wooden rail iron rings saddle', {
    w: 30, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 24]) {
        c.rect(x, b - 12, x + 2, b, OAK);
        c.col(x, b - 12, b, L(OAK));
        c.row(b - 13, x, x + 2, L(OAK));
        c.set(x + 1, b - 8, C.iron);
        c.set(x + 1, b - 7, C.steel);
      }
      board(c, 1, b - 11, 28, b - 10, OAK);
      if (u) {
        c.poly([[11, b - 12], [18, b - 12], [20, b - 8], [9, b - 8]], LEATHER); // a saddle slung over it
        c.row(b - 13, 12, 17, L(LEATHER));
        c.rect(12, b - 14, 13, b - 13, LEATHER);
        c.col(14, b - 7, b - 3, hex('#6a4a32'));
        c.rect(13, b - 2, 15, b - 1, C.steel);
        c.set(14, b - 2, null);
        c.line(22, b - 10, 21, b - 2, hex('#3a2a22')); // reins, hanging
        c.line(23, b - 10, 23, b - 4, hex('#3a2a22'));
        dots(c, C.blood, [16, b - 11, 17, b - 10]);
      }
    },
    sw: 8, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 12, 4, b, OAK);
      c.col(2, b - 12, b, L(OAK));
      c.row(b - 13, 2, 4, L(OAK));
      c.rect(2, b - 11, 5, b - 10, D(OAK));
      c.set(5, b - 8, C.steel);
      if (u) {
        c.rect(1, b - 13, 6, b - 9, LEATHER);
        c.row(b - 13, 2, 5, L(LEATHER));
        c.col(6, b - 8, b - 3, hex('#6a4a32'));
        c.set(6, b - 2, C.steel);
      }
    },
    su: [0, 0, 1],
  });

  add('oldtime-water-pump-trough', 'old time village water pump cast iron handle stone trough street pump horses drinking', {
    w: 26, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 8, 8, b, IRONB);
      c.col(4, 8, b, C.iron);
      c.rect(3, b - 1, 9, b, IRONB);
      c.rect(5, 5, 7, 7, IRONB);
      c.set(6, 4, C.iron);
      c.row(12, 4, 8, C.iron);
      c.rect(9, 14, 12, 15, IRONB); // the spout
      c.set(12, 16, IRONB);
      if (!u) {
        c.line(3, 9, 1, 20, C.iron); // the handle hanging
        c.set(1, 21, C.iron);
      } else {
        c.line(3, 8, 0, 3, C.iron); // pumped
        c.set(0, 2, C.iron);
        c.col(12, 17, b - 9, C.glassLight);
        c.col(13, 18, b - 9, hex('#6f8f98'));
      }
      stones(c, 10, b - 8, 24, b, C.stone, 4, 6, 2);
      c.row(b - 8, 10, 24, u ? hex('#6f8f98') : C.stoneDark);
      if (u) {
        dots(c, C.glassLight, [11, b - 8, 14, b - 8, 12, b - 9, 14, b - 9]);
        c.col(24, b - 7, b - 3, hex('#6f8f98')); // running over
        puddle(c, 22, 25, b, hex('#56707a'));
      } else dots(c, C.moss, [11, b - 2, 12, b - 1, 22, b - 3, 23, b]);
    },
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, b - 8, 11, b, C.stone, 4, 6, 5);
      c.row(b - 8, 2, 11, u ? hex('#6f8f98') : C.stoneDark);
      c.rect(4, 8, 8, b - 9, IRONB); // the pump stands behind its trough
      c.col(4, 8, b - 9, C.iron);
      c.rect(5, 5, 7, 7, IRONB);
      c.set(6, 4, C.iron);
      c.row(12, 4, 8, C.iron);
      c.rect(5, 14, 7, 16, IRONB);
      c.set(6, 16, hex('#17151c'));
      if (!u) c.col(9, 9, 20, C.iron);
      else {
        c.col(9, 3, 8, C.iron);
        c.col(6, 17, b - 9, C.glassLight);
        c.col(11, b - 7, b - 3, hex('#6f8f98'));
        puddle(c, 9, 13, b, hex('#56707a'));
        c.set(5, b - 9, C.glassLight);
      }
    },
    u: [1, 0, 0],
  });

  add('oldtime-pillar-letter-box', 'old time pillar box letter box post box red cast iron mail victorian', {
    w: 12, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 9, b - 3, FIRERED);
      c.col(2, 5, b - 3, L(FIRERED));
      c.col(3, 5, b - 3, mix(FIRERED, 1.1));
      c.rect(1, b - 2, 10, b, IRONB);
      c.rect(1, 3, 10, 4, FIRERED);
      c.row(3, 1, 10, L(FIRERED));
      c.row(2, 3, 8, FIRERED);
      c.row(1, 5, 6, D(FIRERED));
      c.rect(4, 7, 7, 7, K); // the slot
      c.rect(4, 9, 7, 11, CREAM);
      dots(c, hex('#3a3440'), [5, 10, 6, 10]);
      if (!u) {
        c.frame(3, 13, 8, b - 5, D(FIRERED));
        c.set(7, 18, BR);
        dots(c, GILT, [5, 15, 6, 15, 5, 16, 6, 16]);
      } else {
        hollow(c, 3, 13, 8, b - 5, FIRERED); // its door open: the letters are out
        c.col(9, 13, b - 5, L(FIRERED));
        c.rect(10, 13, 11, b - 5, FIRERED);
        c.rect(4, b - 8, 7, b - 6, CREAM);
        c.set(5, b - 7, FIRERED);
        c.rect(3, b - 1, 6, b, CREAM);
        c.rect(7, b, 9, b, C.paper);
        dots(c, hex('#3a3440'), [4, b - 1, 5, b]);
        c.set(8, b, FIRERED);
      }
    },
    sw: 12, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 9, b - 3, FIRERED);
      c.col(2, 5, b - 3, L(FIRERED));
      c.col(3, 5, b - 3, mix(FIRERED, 1.1));
      c.rect(1, b - 2, 10, b, IRONB);
      c.rect(1, 3, 10, 4, FIRERED);
      c.row(3, 1, 10, L(FIRERED));
      c.row(2, 3, 8, FIRERED);
      c.row(1, 5, 6, D(FIRERED));
      c.row(7, 8, 9, K);
      c.row(13, 2, 9, D(FIRERED));
      if (u) {
        face(c, 10, 13, 13, b - 5, FIRERED);
        c.set(12, 18, BR);
        c.rect(10, b, 13, b, CREAM);
        c.set(11, b - 1, CREAM);
      }
    },
    u: [0, 0, 2], su: [0, 0, 4],
  });

  add('oldtime-notice-board-wanted', 'old time notice board wanted poster reward bills town board posts handbills', {
    w: 22, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 18]) {
        c.rect(x, 3, x + 1, b, OAK);
        c.col(x, 3, b, L(OAK));
      }
      c.poly([[1, 3], [20, 3], [17, 1], [4, 1]], OAK);
      c.row(1, 4, 17, L(OAK));
      face(c, 3, 4, 18, 19, PINE);
      planksV(c, 3, 5, 18, 19, D(PINE), 5);
      if (!u) {
        c.rect(5, 5, 11, 15, CREAM); // WANTED
        for (let x = 6; x <= 10; x += 2) c.set(x, 6, hex('#2a2428'));
        c.rect(6, 8, 10, 12, hex('#8a7a5a'));
        c.rect(7, 9, 9, 10, hex('#3a3024'));
        c.row(11, 7, 9, hex('#3a3024'));
        c.row(14, 6, 10, hex('#2a2428'));
      } else {
        c.poly([[5, 5], [8, 5], [5, 9]], CREAM); // torn down: a corner left under its nail
        c.set(5, 5, IRONB);
        c.poly([[9, b - 1], [14, b - 2], [15, b], [9, b]], CREAM);
        c.set(11, b - 1, hex('#3a3024'));
        dots(c, D(PINE), [8, 8, 10, 12, 7, 13]);
      }
      c.rect(13, 6, 16, 10, C.paper);
      dots(c, C.slate, [14, 7, 15, 7, 14, 9]);
      c.rect(13, 12, 17, 17, hex('#a89868'));
      dots(c, FIRERED, [14, 13, 15, 13, 16, 13]);
      dots(c, C.slate, [14, 15, 16, 15]);
      dots(c, IRONB, [13, 6, 13, 12]);
    },
    sw: 8, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 4, b, OAK);
      c.col(2, 3, b, L(OAK));
      c.rect(1, 1, 5, 2, OAK);
      c.row(1, 1, 5, L(OAK));
      c.col(5, 4, 19, PINE);
      if (!u) c.col(6, 5, 15, CREAM);
      else {
        c.set(6, 5, CREAM);
        c.rect(6, b, 8, b, CREAM);
      }
    },
    su: [0, 0, 2],
  });
};
