/* The nineteen-twenties, part e: the street outside, the waterfront, and a few things of the house.
 * Part of tools/big/env2-twenties.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, wisp, bottle, planksV, tyre, tyreEnd, lampGlass, beam, type, sheet, deco, crate, rod, doorOut, blood } = H;
  const add = H.reg('env-twenties', "1920's");
  const { CARB, FEND, OAK, OAKD, MAH, WAL, EB, NICK, BR, GILT, GRN, OX, CREAM, TEAL, NAVY, GLASSD, AMBER, LIT, INK, NEWS, ENAMEL } = H.P;
  const DARKIN = hex('#17151c');
  const IRONG = hex('#2f3f38'), // street furniture: dark green cast iron
    HYD = hex('#8a2f28'),
    OLIVE = hex('#3f5238'),
    LEATH = hex('#5a3524'),
    WATER = hex('#7fa8b8'),
    CANE = hex('#a8905a'),
    SLIME = hex('#6f8a5a'),
    FISH = hex('#8f9aa0');

  /* ---------- the news ---------- */
  add('twenties-newspaper-stand-kiosk', 'newspaper stand news kiosk street vendor papers magazines headline bill awning extra', {
    w: 28, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[1, 7], [26, 7], [24, 3], [3, 3]], GRN); // awning
      for (let x = 4; x <= 24; x += 4) c.line(x, 3, x < 14 ? x - 1 : x + 1, 7, CREAM);
      c.row(3, 3, 24, L(GRN));
      for (let x = 1; x <= 26; x++) if (x % 3 !== 2) c.set(x, 8, x % 6 < 3 ? GRN : CREAM);
      for (const x of [2, 24]) {
        c.rect(x, 9, x + 1, b, OAKD);
        c.col(x, 9, b, OAK);
      }
      c.rect(4, 9, 23, 20, u ? hex('#3a3026') : DARKIN);
      if (u) {
        c.rect(13, 9, 14, 11, BR); // a lamp lit under the awning
        c.set(13, 12, C.glow);
        c.set(14, 12, C.glow);
        dots(c, C.glow, [12, 13, 15, 13, 11, 12, 16, 12]);
      }
      c.row(10, 4, 23, C.straw); // magazines pegged on a line
      [OX, NAVY, hex('#a07e2c'), TEAL, hex('#b9a08a')].forEach((col, i) => {
        if (u && i === 2) return;
        const x = 5 + i * 4 - (i > 2 ? 1 : 0) + (i > 1 ? 1 : 0);
        c.rect(x, 11, x + 2, 14, col);
        c.row(11, x, x + 2, L(col));
        c.set(x + 1, 13, CREAM);
      });
      c.rect(5, u ? 19 : 17, 10, 20, NEWS); // the piles on the counter
      c.rect(12, 18, 17, 20, NEWS);
      c.rect(19, 16, 22, 20, NEWS);
      for (const [x0, x1, y] of [[5, 10, 19], [12, 17, 19], [19, 22, 18]]) c.row(y, x0, x1, D(NEWS));
      c.rect(19, 16, 22, 16, C.stone); // a stone to hold them down
      board(c, 1, 21, 26, 22, OAK);
      face(c, 2, 23, 25, b, OAKD);
      planksV(c, 2, 23, 25, b, mix(OAKD, 0.75), 5);
      c.rect(7, 25, 20, 35, CREAM); // the bill
      c.row(25, 7, 20, C.white);
      if (!u) {
        c.rect(9, 27, 18, 28, INK);
        dots(c, CREAM, [11, 27, 11, 28, 14, 28, 16, 27]);
        for (let y = 30; y <= 33; y++) type(c, 9, 18, y, hex('#8d8a84'), 3);
      } else {
        c.rect(9, 27, 18, 29, C.blood); // EXTRA
        dots(c, CREAM, [11, 27, 11, 28, 13, 29, 14, 28, 16, 27, 16, 29]);
        c.rect(9, 31, 18, 32, INK);
        dots(c, CREAM, [12, 31, 15, 32]);
        c.rect(9, 34, 13, 34, hex('#8d8a84'));
      }
    },
    sw: 18, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 3], [11, 3], [16, 7], [2, 7]], GRN);
      c.line(11, 3, 16, 7, L(GRN));
      c.row(3, 2, 11, L(GRN));
      c.line(7, 3, 9, 7, CREAM);
      for (let x = 2; x <= 16; x++) if (x % 3 !== 2) c.set(x, 8, x % 6 < 3 ? GRN : CREAM);
      face(c, 3, 9, 11, b, OAKD);
      planksV(c, 3, 9, 11, b, mix(OAKD, 0.75), 4);
      c.rect(11, 21, 14, 22, OAK);
      c.rect(12, 18, 13, 20, NEWS);
      c.rect(5, 12, 9, 19, CREAM); // an old bill pasted on the side
      for (let y = 14; y <= 18; y += 2) type(c, 6, 8, y, hex('#8d8a84'), 2);
      if (u) {
        dots(c, C.glow, [12, 10, 13, 11, 14, 10, 12, 12]);
        c.rect(6, 13, 8, 13, C.blood);
      }
    },
  });
  add('twenties-newspaper-bundle-tied', 'newspaper bundle tied with string stack of papers morning edition delivery headline', {
    w: 18, h: 11, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 14, b, NEWS);
      for (let y = 4; y <= b; y += 2) c.row(y, 2, 14, D(NEWS));
      c.row(3, 2, 14, C.white);
      c.col(2, 3, b, L(NEWS));
      if (!u) {
        c.col(8, 2, b, C.straw);
        c.row(2, 7, 9, C.straw);
        type(c, 3, 6, 3, INK, 2);
        type(c, 10, 13, 3, INK, 2);
      } else {
        c.poly([[5, 2], [17, 1], [17, 3], [5, 4]], C.white); // the string cut, the top copy pulled half out
        c.line(5, 4, 17, 3, D(NEWS));
        c.rect(8, 2, 14, 2, C.blood);
        dots(c, C.white, [10, 2, 12, 2]);
        c.line(1, b, 4, b - 2, C.straw);
        c.set(0, b, C.straw);
      }
    },
    sw: 14, sh: 11,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 10, b, NEWS);
      for (let y = 4; y <= b; y += 2) c.row(y, 2, 10, D(NEWS));
      c.row(3, 2, 10, C.white);
      c.row(Math.round((3 + b) / 2), 2, 10, u ? D(NEWS) : C.straw);
      if (u) {
        c.poly([[4, 2], [13, 1], [13, 3], [4, 3]], C.white);
        c.set(12, b, C.straw);
        c.set(11, b - 1, C.straw);
      }
    },
  });

  /* ---------- street furniture ---------- */
  add('twenties-street-clock-post', 'street clock on a post cast iron town clock two faces pavement jeweller time', {
    w: 16, h: 62, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(7, 1, 8, 2, IRONG);
      c.oval(2, 3, 13, 14, IRONG); // the head
      c.oval(3, 4, 12, 13, u ? LIT : CREAM);
      for (const [x, y] of [[7, 5], [8, 12], [4, 8], [11, 9], [5, 6], [10, 6], [5, 11], [10, 11]]) c.set(x, y, INK);
      if (!u) {
        c.line(7, 9, 7, 6, K);
        c.line(8, 9, 10, 10, K);
      } else {
        c.line(7, 9, 5, 7, K); // stopped
        c.line(8, 9, 8, 6, K);
        c.line(9, 4, 10, 8, hex('#8d8a84')); // and the glass cracked across
        c.line(10, 8, 12, 9, hex('#8d8a84'));
      }
      c.set(2, 6, L(IRONG));
      c.set(3, 4, L(IRONG));
      c.poly([[5, 15], [10, 15], [9, 18], [6, 18]], IRONG); // scrolls under it
      dots(c, GILT, [4, 15, 11, 15]);
      c.rect(7, 19, 8, b - 9, IRONG);
      c.col(7, 19, b - 9, L(IRONG));
      c.rect(6, 30, 9, 31, IRONG);
      c.set(6, 30, GILT);
      c.rect(5, b - 8, 10, b - 2, IRONG); // fluted base
      c.col(5, b - 8, b - 2, L(IRONG));
      c.col(7, b - 7, b - 3, D(IRONG));
      c.col(9, b - 7, b - 3, D(IRONG));
      c.rect(3, b - 1, 12, b, mix(IRONG, 0.8));
      c.row(b - 1, 3, 12, IRONG);
      if (u) dots(c, C.glow, [0, 8, 15, 8, 1, 3, 14, 3, 1, 14, 14, 14]);
    },
    sw: 10, sh: 62,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 1, 5, 2, IRONG);
      c.rect(3, 3, 6, 14, IRONG); // the drum of the head, a face on either side
      c.col(2, 5, 12, u ? LIT : CREAM);
      c.col(7, 5, 12, u ? LIT : D(CREAM));
      c.col(3, 3, 14, L(IRONG));
      c.rect(4, 15, 5, 18, IRONG);
      c.rect(4, 19, 5, b - 9, IRONG);
      c.col(4, 19, b - 9, L(IRONG));
      c.rect(3, 30, 6, 31, IRONG);
      c.rect(2, b - 8, 7, b - 2, IRONG);
      c.col(2, b - 8, b - 2, L(IRONG));
      c.rect(1, b - 1, 8, b, mix(IRONG, 0.8));
      if (u) dots(c, C.glow, [0, 8, 9, 8, 0, 4, 9, 12]);
    },
  });
  add('twenties-fire-hydrant-iron', 'fire hydrant fireplug cast iron red street water pavement', {
    w: 12, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 2, 6, 2, C.iron);
      c.rect(4, 3, 7, 4, HYD);
      c.row(3, 5, 6, L(HYD));
      c.rect(3, 5, 8, 5, D(HYD));
      c.rect(4, 6, 7, b - 2, HYD);
      c.col(4, 6, b - 2, L(HYD));
      c.col(7, 6, b - 2, D(HYD));
      c.rect(2, 7, 3, 9, HYD); // side outlets
      c.set(2, 8, C.iron);
      c.rect(8, 7, 9, 9, HYD);
      if (!u) c.set(9, 8, C.iron);
      c.rect(5, 8, 6, 9, D(HYD));
      c.set(5, 8, C.iron);
      c.rect(3, b - 1, 8, b, D(HYD));
      c.row(b - 1, 3, 8, HYD);
      if (!u) dots(c, C.iron, [9, 10, 9, 11, 8, 12]); // the chain of the cap
      else {
        c.set(9, 8, DARKIN); // the cap off: water across the pavement
        c.line(10, 8, 14, 9, WATER);
        c.line(14, 9, 17, 12, WATER);
        c.line(11, 9, 14, 10, C.white);
        c.line(15, 11, 17, 14, hex('#9ebcc2'));
        c.rect(12, b, 19, b, WATER);
        c.rect(15, b - 1, 18, b - 1, hex('#9ebcc2'));
        dots(c, C.white, [16, b - 2, 18, b - 2, 13, b - 1]);
        dots(c, C.iron, [9, 10, 9, 12, 9, 14]);
        c.set(9, b, C.iron);
      }
    },
    u: [0, 0, 9],
  });
  add('twenties-street-lamp-electric', 'street lamp electric lamp post cast iron glass lantern pavement night light', {
    w: 12, h: 62, solid: true,
    f(c, u) {
      const b = c.h - 2,
        G = u ? C.glow : hex('#9aa6a0');
      c.rect(5, 1, 6, 1, IRONG);
      c.poly([[3, 3], [8, 3], [7, 2], [4, 2]], IRONG); // cap
      c.poly([[3, 4], [8, 4], [7, 10], [4, 10]], G); // lantern
      c.col(3, 4, 6, u ? C.white : L(G));
      c.set(4, 5, C.white);
      c.col(5, 4, 10, u ? C.flameLight : D(G));
      c.rect(4, 11, 7, 11, IRONG);
      c.rect(2, 13, 9, 13, IRONG); // ladder bar
      c.rect(5, 12, 6, b - 9, IRONG);
      c.col(5, 12, b - 9, L(IRONG));
      c.rect(4, 28, 7, 29, IRONG);
      c.rect(4, b - 8, 7, b - 2, IRONG);
      c.col(4, b - 8, b - 2, L(IRONG));
      c.rect(2, b - 1, 9, b, mix(IRONG, 0.8));
      c.row(b - 1, 3, 8, IRONG);
      if (u) dots(c, C.glow, [1, 6, 10, 6, 1, 2, 10, 2, 0, 9, 11, 9, 2, 11, 9, 11]);
    },
  });
  add('twenties-traffic-signal-semaphore', 'traffic signal semaphore stop go arms lantern street crossing policeman early traffic light', {
    w: 24, h: 52, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const arm = u ? GRN : HYD;
      c.rect(10, 2, 13, 6, EB); // the lantern
      c.rect(11, 3, 12, 5, u ? hex('#7fc08a') : C.red);
      c.set(11, 3, u ? C.white : C.flameLight);
      c.rect(9, 7, 14, 16, IRONG); // the box
      c.col(9, 7, 16, L(IRONG));
      c.col(14, 7, 16, D(IRONG));
      for (const [x0, x1] of [[2, 8], [15, 21]]) {
        c.rect(x0, 9, x1, 13, arm); // the arms
        c.row(9, x0, x1, L(arm));
        c.row(13, x0, x1, D(arm));
        type(c, x0 + 1, x1 - 1, 11, CREAM, u ? 3 : 2);
      }
      c.rect(11, 17, 12, b - 7, IRONG);
      c.col(11, 17, b - 7, L(IRONG));
      c.rect(10, 28, 13, 29, IRONG);
      c.rect(13, 22, 15, 22, NICK); // the crank
      c.set(15, 23, EB);
      c.rect(9, b - 6, 14, b - 2, IRONG);
      c.col(9, b - 6, b - 2, L(IRONG));
      c.rect(7, b - 1, 16, b, mix(IRONG, 0.8));
      if (u) {
        dots(c, hex('#7fc08a'), [8, 3, 15, 3, 9, 1, 14, 1]);
        c.rect(13, 23, 15, 23, NICK);
        c.clearRect(13, 22, 15, 22);
        c.set(15, 24, EB);
      } else dots(c, C.red, [8, 3, 15, 3]);
    },
    sw: 10, sh: 52,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 6, 6, EB);
      c.col(7, 3, 5, u ? hex('#7fc08a') : C.red);
      c.rect(2, 7, 7, 16, IRONG);
      c.col(2, 7, 16, L(IRONG));
      c.col(4, 9, 13, u ? GRN : HYD); // the arms, edge on
      c.col(5, 9, 13, u ? D(GRN) : D(HYD));
      c.rect(4, 17, 5, b - 7, IRONG);
      c.col(4, 17, b - 7, L(IRONG));
      c.rect(3, 28, 6, 29, IRONG);
      c.rect(2, b - 6, 7, b - 2, IRONG);
      c.rect(1, b - 1, 8, b, mix(IRONG, 0.8));
      c.set(7, 22, NICK);
      if (u) c.set(8, 4, hex('#7fc08a'));
    },
  });
  add('twenties-police-call-box-post', 'police call box on post signal box telephone patrolman cast iron navy street lamp', {
    w: 14, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 1, 7, 2, u ? C.glow : hex('#6f7b7a')); // its lamp
      c.poly([[3, 4], [6, 3], [7, 3], [10, 4]], NAVY);
      face(c, 2, 5, 11, 22, NAVY);
      c.rect(6, 23, 7, b - 3, mix(NAVY, 0.8));
      c.col(6, 23, b - 3, NAVY);
      c.rect(4, b - 2, 9, b - 1, NAVY);
      c.rect(3, b, 10, b, mix(NAVY, 0.7));
      if (!u) {
        panel(c, 3, 7, 10, 20, NAVY);
        c.rect(4, 9, 9, 11, CREAM);
        type(c, 5, 8, 10, NAVY, 2);
        c.set(9, 15, BR);
        dots(c, L(NAVY), [5, 17, 7, 17]);
      } else {
        hollow(c, 3, 7, 10, 20, hex('#5a5a60')); // open: the telephone, off its hook
        c.rect(5, 8, 8, 13, EB);
        c.oval(5, 9, 6, 10, NICK);
        c.oval(7, 9, 8, 10, NICK);
        c.set(6, 12, BR);
        c.line(8, 13, 9, 17, EB);
        c.rect(8, 18, 9, 21, EB); // the receiver hanging
        c.set(8, 22, EB);
        face(c, 12, 6, 14, 21, L(NAVY)); // the door
        c.set(13, 14, BR);
        dots(c, C.glow, [4, 1, 9, 1, 5, 0, 8, 0, 3, 2, 10, 2]);
      }
    },
    u: [0, 1, 2],
    sw: 12, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 1, 5, 2, u ? C.glow : hex('#6f7b7a'));
      c.row(3, 3, 6, NAVY);
      c.row(4, 2, 7, NAVY);
      cabSide(c, 2, 5, 7, 22, NAVY);
      c.rect(4, 23, 5, b - 3, mix(NAVY, 0.8));
      c.rect(3, b - 2, 6, b - 1, NAVY);
      c.rect(2, b, 7, b, mix(NAVY, 0.7));
      if (u) {
        c.col(7, 7, 20, DARKIN);
        face(c, 8, 6, 14, 21, L(NAVY));
        panel(c, 9, 8, 13, 19, L(NAVY));
        dots(c, C.glow, [2, 1, 7, 1, 3, 0, 6, 0]);
      } else c.set(8, 15, BR);
    },
    su: [0, 1, 5],
  });
  add('twenties-mail-box-iron', 'mail box letter box post box olive green cast iron pillar street letters us mail', {
    w: 14, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(2, 2, 11, 9, OLIVE);
      c.rect(2, 6, 11, 17, OLIVE);
      c.col(2, 6, 17, L(OLIVE));
      c.set(3, 3, L(OLIVE));
      c.col(11, 6, 17, D(OLIVE));
      c.rect(3, 12, 10, 12, D(OLIVE));
      type(c, 4, 9, 14, CREAM, 2);
      c.rect(8, 15, 10, 16, CREAM); // collection times
      legs(c, [3, 9], 18, b, mix(OLIVE, 0.7));
      c.row(b, 2, 4, mix(OLIVE, 0.7));
      c.row(b, 9, 11, mix(OLIVE, 0.7));
      if (!u) {
        c.rect(3, 6, 10, 9, mix(OLIVE, 1.15)); // the flap
        c.row(9, 3, 10, D(OLIVE));
        c.rect(6, 7, 7, 7, BR);
      } else {
        c.rect(3, 6, 10, 8, DARKIN); // the flap down: a letter that would not go in
        c.rect(3, 9, 10, 11, mix(OLIVE, 1.25));
        c.row(11, 3, 10, OLIVE);
        c.poly([[5, 4], [9, 5], [8, 8], [4, 7]], C.paper);
        c.set(8, 6, C.red);
        c.rect(5, b - 1, 9, b, C.paper); // and others on the ground
        c.line(5, b - 1, 7, b, D(C.paper));
        c.set(9, b - 1, C.red);
      }
    },
    sw: 12, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.oval(2, 2, 9, 9, OLIVE);
      c.rect(2, 6, 9, 17, OLIVE);
      c.col(2, 6, 17, L(OLIVE));
      c.set(3, 3, L(OLIVE));
      c.rect(4, 8, 7, 15, mix(OLIVE, 0.85));
      legs(c, [2, 8], 18, b, mix(OLIVE, 0.7));
      if (!u) c.set(10, 7, BR);
      else {
        c.rect(10, 9, 12, 10, mix(OLIVE, 1.25)); // the flap hanging open
        c.col(9, 6, 8, DARKIN);
        c.rect(9, 5, 12, 6, C.paper);
        c.rect(9, b, 12, b, C.paper);
      }
    },
    su: [0, 0, 2],
  });
  add('twenties-telephone-booth-oak', 'telephone booth phone box oak folding door glass panes public call box drug store lobby', {
    w: 22, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 20, 3, WAL);
      c.rect(2, 4, 19, 8, NAVY); // TELEPHONE
      c.row(4, 2, 19, L(NAVY));
      type(c, 4, 17, 6, CREAM, 3);
      face(c, 2, 9, 19, b, WAL);
      const G = u ? LIT : GLASSD;
      if (!u) {
        for (const x of [4, 12]) {
          c.rect(x, 11, x + 5, 29, G); // the two leaves of the door
          c.row(17, x, x + 5, WAL);
          c.row(23, x, x + 5, WAL);
          for (let i = 0; i < 3; i++) c.set(x + 1 + i, 15 - i, C.glassLight);
          panel(c, x, 32, x + 5, b - 2, WAL);
        }
        c.rect(13, 13, 16, 19, mix(EB, 1.3)); // the instrument, seen through the glass
        c.col(10, 10, b - 1, D(WAL));
        c.col(11, 10, b - 1, L(WAL));
        c.set(9, 27, BR);
      } else {
        c.rect(4, 11, 7, b - 1, mix(WAL, 1.15)); // folded back on itself
        c.col(6, 11, b - 1, D(WAL));
        c.rect(4, 12, 5, 28, G);
        c.rect(8, 10, 17, b - 1, hex('#4a3a2c')); // inside, the light on
        c.row(10, 8, 17, C.glow);
        dots(c, C.glow, [10, 11, 12, 12, 15, 11]);
        c.rect(11, 14, 15, 22, EB); // the wall telephone
        c.oval(11, 15, 12, 16, NICK);
        c.oval(14, 15, 15, 16, NICK);
        c.rect(12, 18, 14, 19, EB);
        c.set(13, 19, BR);
        c.col(13, 20, 21, hex('#4a444c'));
        c.line(11, 20, 9, 26, hex('#6a5a4a')); // the receiver swinging on its cord
        c.line(9, 26, 10, 31, hex('#6a5a4a'));
        c.rect(9, 32, 10, 36, EB);
        c.set(10, 37, EB);
        c.rect(12, 28, 16, 29, OAK); // the little shelf, a directory
        c.rect(12, 27, 15, 27, C.paper);
        c.rect(8, b - 1, 17, b, hex('#3a3026'));
        c.set(15, b - 1, BR); // a nickel dropped
      }
      c.rect(1, b, 20, b, mix(WAL, 0.7));
    },
    sw: 16, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 14, 3, WAL);
      c.rect(2, 4, 13, 8, NAVY);
      c.row(4, 2, 13, L(NAVY));
      face(c, 2, 9, 13, b, WAL);
      c.rect(4, 11, 11, 24, u ? LIT : GLASSD);
      c.row(17, 4, 11, WAL);
      c.col(7, 11, 24, WAL);
      if (!u) for (let i = 0; i < 3; i++) c.set(5 + i, 15 - i, C.glassLight);
      else {
        c.rect(5, 13, 6, 16, EB);
        c.line(8, 18, 9, 23, hex('#6a5a4a'));
        c.set(9, 24, EB);
      }
      panel(c, 4, 27, 11, b - 2, WAL);
      c.rect(1, b, 14, b, mix(WAL, 0.7));
      if (u) c.rect(14, 11, 15, b - 1, mix(WAL, 1.15));
    },
    su: [0, 0, 1],
  });
  add('twenties-candlestick-telephone-table', 'candlestick telephone on small table upright phone receiver hall stand black nickel', {
    w: 16, h: 30, solid: false,
    f(c, u) {
      const b = c.h - 2;
      board(c, 2, 16, 13, 17, WAL);
      c.rect(7, 18, 8, b - 4, WAL);
      c.col(7, 18, b - 4, L(WAL));
      c.rect(6, 21, 9, 22, WAL);
      c.line(7, b - 4, 3, b, WAL);
      c.line(8, b - 4, 12, b, WAL);
      c.rect(7, b - 3, 8, b, WAL);
      c.rect(6, 14, 9, 15, EB); // the telephone
      c.row(14, 6, 9, hex('#4a444c'));
      c.col(7, 8, 13, hex('#4a444c'));
      c.col(8, 8, 13, EB);
      c.set(7, 10, NICK);
      c.oval(6, 3, 9, 6, EB); // mouthpiece
      c.rect(7, 4, 8, 5, hex('#6a6a72'));
      c.set(7, 7, EB);
      c.set(8, 7, EB);
      c.rect(9, 9, 10, 9, NICK); // the hook
      c.rect(3, 14, 4, 15, C.paper); // a pad
      c.set(3, 14, INK);
      if (!u) {
        c.rect(11, 7, 12, 13, EB); // receiver hung up
        c.col(11, 8, 12, hex('#4a444c'));
        c.set(12, 14, hex('#6a5a4a'));
        c.set(11, 15, hex('#6a5a4a'));
      } else {
        c.set(10, 8, NICK); // the hook up: the receiver dangles under the table, a voice still in it
        c.clear(10, 9);
        c.line(10, 15, 13, 18, hex('#6a5a4a'));
        c.line(13, 18, 12, 21, hex('#6a5a4a'));
        c.rect(12, 22, 13, 27, EB);
        c.col(12, 23, 26, hex('#4a444c'));
        dots(c, C.ghost, [14, 26, 15, 28, 14, 29, 15, 24]);
      }
    },
  });
  add('twenties-gas-pump-visible-glass', 'gas pump petrol pump visible glass cylinder gasoline filling station globe red hand pump', {
    w: 16, h: 50, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(4, 1, 11, 8, u ? C.glow : ENAMEL); // the globe
      c.oval(6, 3, 9, 6, HYD);
      c.set(5, 2, C.white);
      c.rect(6, 9, 9, 9, NICK);
      c.rect(4, 10, 11, 10, NICK);
      c.rect(4, 11, 11, 21, hex('#9ebcc2')); // the glass
      c.rect(4, u ? 19 : 13, 11, 21, hex('#b08a3a'));
      c.row(u ? 19 : 13, 4, 11, hex('#d0aa5a'));
      c.col(4, 11, 21, C.white);
      for (let y = 12; y <= 20; y += 2) c.set(10, y, INK);
      c.col(7, 11, 21, NICK);
      c.rect(4, 22, 11, 22, NICK);
      c.rect(5, 23, 10, b - 3, HYD);
      c.col(5, 23, b - 3, L(HYD));
      c.col(10, 23, b - 3, D(HYD));
      c.rect(6, 26, 9, 30, CREAM);
      type(c, 7, 8, 28, HYD, 1);
      c.set(7, 27, HYD);
      c.rect(6, 34, 9, 40, D(HYD));
      c.rect(3, b - 2, 12, b, mix(HYD, 0.6));
      c.row(b - 2, 3, 12, D(HYD));
      c.col(3, 26, 34, NICK); // the pump handle
      c.rect(2, 25, 3, 26, EB);
      c.set(4, 34, NICK);
      c.line(11, 23, 13, 26, EB); // the hose
      if (!u) {
        c.line(13, 26, 13, 36, EB);
        c.line(13, 36, 11, 33, EB);
        c.rect(11, 30, 12, 32, NICK); // nozzle on its hook
      } else {
        c.line(13, 26, 13, b - 3, EB); // down on the ground, still running
        c.line(13, b - 3, 15, b, EB);
        c.rect(16, b, 18, b, NICK);
        c.rect(17, b, 21, b, hex('#b08a3a'));
        dots(c, hex('#d0aa5a'), [19, b, 20, b - 1]);
        dots(c, C.glow, [2, 4, 13, 4, 3, 1, 12, 1]);
      }
    },
    u: [0, 0, 6],
  });
  add('twenties-poster-column', 'poster column advertising pillar playbills notices round kiosk street missing person bill', {
    w: 18, h: 48, solid: true,
    f(c, u) {
      const b = c.h - 2,
        PL = hex('#a59c80');
      c.rect(8, 2, 9, 3, IRONG);
      c.poly([[2, 8], [15, 8], [12, 4], [5, 4]], IRONG); // the little roof
      c.line(5, 4, 2, 8, L(IRONG));
      c.rect(3, 9, 14, b - 3, PL);
      c.rect(3, 12, 8, 21, OX); // bills
      type(c, 4, 7, 14, CREAM, 2);
      c.rect(5, 16, 6, 19, CREAM);
      c.rect(9, 10, 14, 17, hex('#a07e2c'));
      type(c, 10, 13, 12, INK, 2);
      type(c, 10, 13, 14, INK, 3);
      c.rect(9, 19, 14, 28, TEAL);
      c.oval(10, 21, 13, 24, CREAM);
      type(c, 10, 13, 26, CREAM, 2);
      c.rect(3, 23, 8, 33, NEWS);
      for (let y = 25; y <= 31; y += 2) type(c, 4, 7, y, hex('#8d8a84'), 3);
      c.rect(9, 30, 14, 38, hex('#8a4f36'));
      type(c, 10, 13, 32, CREAM, 3);
      c.rect(3, 35, 8, b - 4, NAVY);
      dots(c, CREAM, [5, 37, 6, 38, 5, 39, 4, 41, 6, 41]);
      c.col(3, 9, b - 3, blend(PL, C.white, 0.4)); // the round of it
      for (let y = 9; y <= b - 3; y++) {
        const p = c.get(13, y),
          q = c.get(14, y);
        if (p) c.set(13, y, mix(p, 0.82));
        if (q) c.set(14, y, mix(q, 0.66));
      }
      c.rect(2, b - 2, 15, b, hex('#77747a'));
      c.row(b - 2, 2, 15, hex('#9a979a'));
      if (u) {
        c.rect(5, 17, 12, 29, C.white); // pasted over the rest, still wet: MISSING
        c.rect(6, 18, 11, 19, C.blood);
        dots(c, C.white, [7, 18, 9, 19, 10, 18]);
        c.rect(7, 21, 10, 25, hex('#77747a'));
        c.oval(8, 21, 9, 23, hex('#c9c2aa'));
        c.row(25, 7, 10, INK);
        type(c, 6, 11, 27, INK, 2);
        c.poly([[9, 30], [14, 30], [13, 34], [11, 36]], PL); // an old one torn away
        c.line(11, 36, 12, 39, hex('#8a4f36'));
        c.rect(0, b - 3, 2, b, C.steel); // the paste pail
        c.row(b - 3, 0, 2, C.white);
        c.line(1, b - 4, 2, b - 7, OAK);
      }
    },
    u: [1, 0, 0],
  });

  /* ---------- on the pavement and the quay ---------- */
  add('twenties-park-bench-iron-slats', 'park bench cast iron ends wooden slats green paint street seat tramp newspaper', {
    w: 34, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2,
        SL = hex('#46604a');
      for (const y of [3, 6]) {
        c.rect(3, y, 30, y + 1, SL); // back slats
        c.row(y, 3, 30, L(SL));
      }
      c.rect(3, 10, 30, 11, SL); // seat
      c.row(10, 3, 30, L(SL));
      c.row(12, 3, 30, D(SL));
      dots(c, C.woodPale, [8, 3, 15, 7, 22, 10, 27, 4, 11, 11]); // paint gone
      for (const x of [2, 29]) {
        c.rect(x, 2, x + 2, 12, IRONG); // iron ends
        c.col(x, 2, 12, L(IRONG));
        c.rect(x - 1, 8, x + 3, 8, IRONG); // arms
        c.col(x, 13, b, IRONG);
        c.col(x + 2, 13, b, IRONG);
        c.set(x + 1, 14, IRONG);
        c.row(b, x - 1, x + 3, mix(IRONG, 0.8));
      }
      if (u) {
        c.rect(8, 8, 22, 10, NEWS); // somebody slept here under yesterday's paper
        c.row(8, 8, 22, C.white);
        c.col(15, 8, 10, D(NEWS));
        type(c, 9, 14, 9, INK, 2);
        type(c, 17, 21, 9, hex('#8d8a84'), 3);
        c.poly([[20, 11], [24, 11], [23, 14], [21, 13]], NEWS);
        c.rect(25, 6, 26, 9, hex('#8a6a44')); // a bottle in a paper bag
        c.set(25, 5, GRN);
        c.set(25, 4, GRN);
      }
    },
    sw: 14, sh: 20,
    s(c, u) {
      const b = c.h - 2,
        SL = hex('#46604a');
      c.line(3, 2, 4, 11, IRONG); // the scroll of the iron end
      c.line(4, 2, 5, 11, IRONG);
      c.set(2, 2, IRONG);
      c.rect(4, 10, 11, 11, IRONG);
      c.rect(4, 8, 10, 8, IRONG);
      c.set(11, 9, IRONG);
      c.line(4, 12, 2, b, IRONG);
      c.line(10, 12, 11, b, IRONG);
      c.row(b, 1, 3, mix(IRONG, 0.8));
      c.row(b, 10, 12, mix(IRONG, 0.8));
      c.set(5, 3, SL);
      c.set(5, 6, SL);
      c.row(9, 5, 10, SL);
      if (u) {
        c.rect(5, 9, 11, 9, NEWS);
        c.rect(11, 10, 12, 13, NEWS);
        c.rect(7, 5, 8, 8, hex('#8a6a44'));
        c.set(7, 4, GRN);
      }
    },
  });
  add('twenties-shoe-shine-stand', 'shoe shine stand bootblack raised chair brass footrests polish brushes street station', {
    w: 22, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 2, 16, 9, OX); // the seat back
      c.row(2, 6, 15, L(OX));
      c.frame(4, 2, 17, 10, OAKD);
      c.clear(4, 2);
      c.clear(17, 2);
      for (const x of [2, 17]) {
        c.rect(x, 9, x + 2, 10, OAK); // arms
        c.col(x + 1, 11, 13, OAKD);
      }
      c.rect(4, 11, 17, 13, OX); // seat
      c.row(11, 4, 17, L(OX));
      face(c, 2, 14, 19, b - 1, OAK);
      c.rect(2, b, 19, b, OAKD);
      for (const x of [6, 13]) {
        c.col(x + 1, 16, 19, BR); // the foot rests
        c.rect(x, 15, x + 2, 15, BR);
        c.set(x, 15, L(BR));
      }
      c.row(20, 3, 18, OAKD); // the step
      c.row(21, 3, 18, L(OAK));
      if (!u) drawer(c, 4, 24, 17, 28, OAK);
      else {
        hollow(c, 4, 24, 17, 25, OAK); // the drawer out: tins, brushes
        dots(c, EB, [5, 25, 6, 25, 9, 25, 10, 25]);
        dots(c, hex('#8a4f36'), [13, 25, 14, 25]);
        c.rect(3, 26, 18, 30, L(OAK));
        c.row(30, 3, 18, OAK);
        c.rect(9, 28, 12, 28, BR);
        c.rect(12, 13, 16, 14, C.white); // a rag over the rest
        c.col(16, 15, 18, C.white);
        c.set(15, 16, hex('#4a2e22'));
        c.oval(4, 17, 6, 19, EB); // an open tin on the step
        c.set(5, 18, hex('#4a2e22'));
      }
    },
    sw: 20, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 4, 13, OAKD); // the back
      c.rect(4, 3, 5, 9, OX);
      c.rect(4, 9, 11, 10, OAK);
      c.rect(4, 11, 12, 13, OX);
      c.row(11, 4, 12, L(OX));
      cabSide(c, 2, 14, 16, b - 1, OAK);
      c.rect(2, b, 16, b, OAKD);
      c.rect(13, 20, 17, 21, OAK); // step
      c.col(14, 16, 19, BR);
      c.rect(13, 15, 16, 15, BR);
      if (u) {
        c.rect(17, 26, 20, 30, L(OAK));
        c.row(25, 17, 19, EB);
        c.set(21, 28, BR);
        c.rect(13, 13, 16, 14, C.white);
        c.col(17, 14, 17, C.white);
      } else c.set(17, 26, BR);
    },
    su: [0, 0, 3],
  });
  add('twenties-violin-case-tommy-gun', 'violin case tommy gun hidden submachine gun gangster mob chicago typewriter black case', {
    w: 28, h: 10, solid: false,
    f(c, u) {
      const b = c.h - 2;
      const body = [[2, b], [2, 5], [5, 3], [13, 3], [17, 4], [24, 5], [25, 6], [25, b]];
      c.poly(body, EB);
      c.line(2, 5, 5, 3, hex('#4a444c'));
      c.row(3, 5, 13, hex('#4a444c'));
      c.row(b, 2, 25, mix(EB, 0.8));
      dots(c, BR, [7, 6, 20, 6]);
      if (!u) {
        c.row(5, 3, 24, hex('#3a3238')); // the seam of the lid
        c.rect(12, 6, 15, 6, LEATH); // handle
        c.set(12, 7, LEATH);
        c.set(15, 7, LEATH);
      } else {
        c.poly([[2, 2], [2, -2], [5, -4], [13, -4], [17, -3], [24, -2], [25, -1], [25, 2]], EB); // lid up
        c.poly([[3, 2], [3, -1], [6, -3], [13, -3], [17, -2], [24, -1], [24, 2]], H.P.VELVET);
        c.rect(3, 4, 24, 6, H.P.VELVET);
        c.row(4, 3, 24, mix(H.P.VELVET, 0.7));
        c.rect(4, 4, 8, 5, C.wood); // no violin: the stock, the drum, the barrel
        c.rect(9, 4, 19, 4, C.iron);
        c.row(4, 9, 19, C.steel);
        c.rect(20, 4, 23, 4, C.ironDark);
        c.oval(12, 4, 15, 7, C.iron);
        c.set(13, 5, C.steel);
        c.set(10, 5, C.wood);
        c.set(18, 5, C.wood);
      }
    },
    u: [0, 5, 0],
    sw: 12, sh: 10,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, b], [2, 5], [4, 3], [7, 3], [9, 5], [9, b]], EB);
      c.line(2, 5, 4, 3, hex('#4a444c'));
      c.row(b, 2, 9, mix(EB, 0.8));
      if (!u) {
        c.row(5, 3, 8, hex('#3a3238'));
        c.rect(5, 6, 6, 6, BR);
      } else {
        c.poly([[2, 2], [2, -2], [4, -4], [7, -4], [9, -2], [9, 2]], EB);
        c.poly([[3, 2], [3, -1], [5, -3], [6, -3], [8, -1], [8, 2]], H.P.VELVET);
        c.rect(3, 4, 8, 5, H.P.VELVET);
        c.oval(4, 3, 7, 6, C.iron);
        c.set(5, 4, C.steel);
      }
    },
    su: [0, 5, 0],
  });
  add('twenties-dock-fish-crates', 'dock fish crates harbour catch on ice wharf quay innsmouth fishing boxes smell', {
    w: 28, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2,
        CR = hex('#8a7458');
      const fishRow = (x0, x1, y) => {
        for (let x = x0; x <= x1 - 3; x += 4) {
          c.rect(x, y, x + 2, y, FISH);
          c.set(x + 3, y, D(FISH));
          c.set(x, y, K);
          c.set(x + 1, y - 1, hex('#b9c2c4'));
        }
      };
      crate(c, 2, 9, 25, b, CR);
      type(c, 5, 22, 12, INK, 3);
      c.row(8, 3, 24, hex('#c9d6d8')); // ice
      fishRow(4, 23, 8);
      if (!u) {
        crate(c, 4, 3, 16, 7, mix(CR, 1.1));
        c.row(2, 5, 15, hex('#c9d6d8'));
        fishRow(5, 15, 2);
      } else {
        c.poly([[14, 8], [20, 2], [26, 7], [20, 13]], mix(CR, 1.1)); // the top box tipped off
        c.line(14, 8, 20, 2, L(CR));
        c.line(17, 8, 21, 5, D(CR));
        c.line(19, 10, 23, 7, D(CR));
        for (const [x, y] of [[4, 6], [9, 7], [6, b], [11, b], [0, b], [16, b - 1]]) {
          c.rect(x, y, x + 2, y, FISH); // fish everywhere, and one of them wrong
          c.set(x, y, K);
          c.set(x + 3, y, D(FISH));
        }
        c.rect(21, b - 1, 26, b, SLIME);
        c.rect(22, b - 2, 24, b - 2, hex('#8fa97a'));
        dots(c, C.red, [22, b - 1]);
        dots(c, SLIME, [27, b, 19, b, 18, 14]);
      }
    },
    u: [1, 0, 1],
    sw: 16, sh: 18,
    s(c, u) {
      const b = c.h - 2,
        CR = hex('#8a7458');
      crate(c, 2, 9, 13, b, CR);
      c.row(8, 3, 12, hex('#c9d6d8'));
      dots(c, FISH, [4, 8, 5, 8, 8, 8, 9, 8]);
      if (!u) {
        crate(c, 3, 3, 11, 7, mix(CR, 1.1));
        c.row(2, 4, 10, hex('#c9d6d8'));
        dots(c, FISH, [5, 2, 6, 2, 8, 2]);
      } else {
        c.poly([[8, 8], [13, 3], [17, 7], [12, 12]], mix(CR, 1.1));
        c.line(8, 8, 13, 3, L(CR));
        dots(c, FISH, [3, 7, 4, 7, 15, b, 16, b, 6, 6]);
        c.rect(14, b - 1, 17, b, SLIME);
      }
    },
    su: [0, 0, 4],
  });
  add('twenties-motorcycle-with-sidecar', 'large motorcycle with sidecar motor bike indian red combination despatch rider vehicle 1920s', {
    w: 40, h: 24, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        RED = hex('#7a2a24');
      tyre(c, 6, 18, 4, NICK, C.iron);
      tyre(c, 33, 18, 4, NICK, C.iron);
      c.line(27, 5, 33, 18, NICK); // the fork
      c.line(26, 5, 32, 18, C.iron);
      c.line(23, 7, 26, 3, EB); // handle bars
      c.rect(23, 2, 26, 2, EB);
      c.set(22, 2, LEATH);
      lampGlass(c, 28, 3, 30, 5, u);
      c.line(6, 18, 10, 8, C.iron); // frame
      c.line(10, 8, 24, 9, C.iron);
      c.line(24, 9, 21, 15, C.iron);
      c.rect(13, 5, 22, 8, RED); // the tank
      c.row(5, 14, 21, L(RED));
      c.row(8, 13, 22, D(RED));
      type(c, 15, 20, 7, GILT, 2);
      c.rect(7, 4, 12, 5, LEATH); // saddle
      c.row(4, 8, 12, mix(LEATH, 1.3));
      c.set(9, 6, NICK);
      c.set(10, 7, NICK);
      c.rect(14, 9, 20, 12, C.iron); // the engine's fins
      c.row(9, 14, 20, C.steel);
      c.row(11, 14, 20, C.steel);
      c.line(1, 14, 3, 12, FEND); // mudguards
      c.line(3, 12, 9, 12, FEND);
      c.line(29, 13, 36, 12, FEND);
      c.line(36, 12, 38, 14, FEND);
      c.poly([[12, 13], [27, 13], [32, 16], [29, 20], [13, 20]], OLIVE); // the sidecar, on our side
      c.line(12, 13, 27, 13, L(OLIVE));
      c.line(27, 13, 32, 16, L(OLIVE));
      c.row(18, 13, 30, D(OLIVE));
      c.col(12, 14, 19, L(OLIVE));
      if (!u) {
        c.rect(13, 11, 16, 12, LEATH); // its seat back
        c.row(11, 13, 16, mix(LEATH, 1.3));
      }
      c.line(24, 12, 25, 10, NICK); // little screen
      c.col(26, 10, 12, C.glassLight);
      tyre(c, 20, 19, 3, NICK, C.iron);
      c.line(16, 15, 24, 15, FEND);
      c.set(15, 16, FEND);
      c.set(25, 16, FEND);
      if (u) {
        beam(c, 31, 4, 7);
        crate(c, 13, 8, 21, 12, C.woodPale, INK); // a case of something in the sidecar
        dots(c, AMBER, [14, 7, 16, 7, 18, 7, 20, 7]);
        dots(c, C.parchment, [14, 6, 16, 6, 18, 6, 20, 6]);
      }
    },
    sw: 28, sh: 24,
    s(c, u) {
      const b = c.h - 2,
        RED = hex('#7a2a24');
      // the machine on the right, the sidecar on the left: seen from the front
      tyreEnd(c, 19, 21, 11, b);
      c.col(18, 6, 16, NICK);
      c.col(22, 6, 16, C.iron);
      c.rect(18, 10, 22, 11, FEND); // mudguard
      c.rect(13, 4, 26, 4, EB); // bars
      c.rect(13, 3, 14, 4, EB);
      c.rect(25, 3, 26, 4, EB);
      lampGlass(c, 18, 5, 22, 9, u);
      c.rect(19, 2, 21, 3, RED);
      c.oval(3, 9, 15, 20, OLIVE); // the sidecar's nose
      c.oval(5, 11, 13, 18, mix(OLIVE, 1.15));
      c.set(5, 11, L(OLIVE));
      c.rect(5, 7, 13, 9, C.glassLight); // its screen
      c.frame(4, 6, 14, 10, NICK);
      c.rect(5, 7, 13, 9, hex('#56727a'));
      c.set(6, 8, C.glassLight);
      tyreEnd(c, 1, 2, 13, b);
      c.row(17, 15, 19, C.iron); // the bar that joins them
      c.row(b - 1, 3, 18, FEND);
      if (u) {
        for (const x of [20]) dots(c, C.glow, [x - 4, 7, x + 4, 7, x, 3, x - 3, 4, x + 3, 4, x - 3, 10, x + 3, 10]);
        crate(c, 5, 3, 13, 6, C.woodPale, INK);
        dots(c, AMBER, [6, 2, 8, 2, 10, 2, 12, 2]);
      }
    },
  });

  /* ---------- of the house ---------- */
  add('twenties-icebox-oak', 'icebox oak ice chest refrigerator kitchen nickel latches block of ice milk 1920s', {
    w: 18, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 16, 3, OAK);
      face(c, 2, 4, 15, b - 2, OAK);
      legs(c, [2, 14], b - 1, b, OAKD);
      if (!u) {
        panel(c, 4, 6, 13, 12, OAK); // the ice door
        panel(c, 4, 15, 13, b - 4, OAK);
        for (const y of [9, 20]) {
          c.rect(12, y, 14, y, NICK); // latches
          c.set(3, y - 2, NICK);
          c.set(3, y + 2, NICK);
        }
        c.rect(6, 17, 9, 18, BR); // maker's plate
      } else {
        c.rect(4, 6, 13, 12, hex('#2f3a3e')); // zinc-lined, open
        c.rect(5, 8, 11, 12, hex('#b9d0d4')); // what is left of the block
        c.row(8, 5, 11, C.white);
        c.set(6, 10, C.white);
        dots(c, WATER, [12, 12, 7, 13, 7, 14]);
        c.rect(4, 15, 13, b - 4, hex('#2f3a3e'));
        c.row(21, 4, 13, hex('#77747a'));
        bottle(c, 5, 20, 5, hex('#d6d2c4')); // milk
        c.rect(9, 18, 12, 20, hex('#8a6a44')); // a parcel from the butcher
        c.row(20, 9, 12, C.blood);
        c.rect(6, 24, 11, 26, C.steel); // a covered dish
        c.row(24, 7, 10, L(C.steel));
        dots(c, C.blood, [10, 22, 10, 23, 11, 27]);
        face(c, 16, 5, 20, 13, L(OAK)); // the doors
        face(c, 16, 14, 20, b - 3, L(OAK));
        c.rect(7, b, 12, b, WATER); // the drip pan has run over
        c.set(13, b, hex('#9ebcc2'));
      }
    },
    u: [0, 0, 4],
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 12, 3, OAK);
      cabSide(c, 2, 4, 11, b - 2, OAK);
      legs(c, [2, 10], b - 1, b, OAKD);
      if (!u) dots(c, NICK, [12, 9, 12, 20]);
      else {
        H.doorOut(c, 12, 5, 13, 5, L(OAK));
        H.doorOut(c, 12, 14, b - 3, 5, L(OAK));
        c.col(11, 6, b - 4, hex('#2f3a3e'));
        c.rect(12, b, 15, b, WATER);
      }
    },
    su: [0, 0, 5],
  });
  add('twenties-radiator-cast-iron', 'radiator cast iron steam heating column silver paint valve pipes apartment hotel room', {
    w: 26, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2,
        RA = hex('#9a978c');
      for (let x = 5; x <= 20; x += 3) {
        c.rect(x, 3, x + 1, b - 2, RA); // the columns
        c.col(x, 3, b - 2, L(RA));
        c.set(x, 2, RA);
        c.set(x + 1, 2, D(RA));
        c.set(x + 2, 5, D(RA));
        c.set(x + 2, b - 4, D(RA));
        c.set(x, 9, D(RA)); // the cast pattern
        c.set(x + 1, 10, hex('#b9b6a8'));
      }
      c.rect(5, b - 1, 6, b, D(RA));
      c.rect(20, b - 1, 21, b, D(RA));
      dots(c, C.rust, [9, 13, 15, 6, 18, 14, 12, b - 2]);
      c.rect(2, b - 5, 4, b - 4, BR); // valve
      c.rect(2, b - 7, 3, b - 6, EB);
      c.col(2, b - 3, b, C.iron);
      c.rect(22, 5, 23, 6, BR); // air vent
      c.col(23, 7, b, C.iron);
      if (u) {
        wisp(c, 23, 3, 5, C.ghost); // knocking and spitting
        wisp(c, 21, 1, 3, hex('#c9d6d8'));
        c.rect(19, b, 24, b, C.rust);
        dots(c, WATER, [24, 8, 24, 11, 22, b]);
        c.rect(8, 1, 14, 2, hex('#6a5a4a')); // a pair of gloves put to dry
        c.rect(9, 3, 10, 4, hex('#6a5a4a'));
        c.rect(12, 3, 13, 5, hex('#6a5a4a'));
        c.row(1, 8, 14, hex('#8a7a66'));
      }
    },
    u: [0, 3, 0],
    sw: 10, sh: 20,
    s(c, u) {
      const b = c.h - 2,
        RA = hex('#9a978c');
      c.oval(2, 2, 7, 7, RA);
      c.rect(2, 5, 7, b - 3, RA);
      c.oval(2, b - 6, 7, b - 1, RA);
      c.rect(4, 5, 5, b - 4, D(RA));
      c.col(2, 4, b - 3, L(RA));
      c.rect(3, b, 4, b, D(RA));
      c.set(6, b, D(RA));
      c.set(5, 9, C.rust);
      c.rect(3, 1, 5, 1, BR);
      if (u) {
        wisp(c, 5, 0, 4, C.ghost);
        c.rect(6, b, 9, b, C.rust);
        c.rect(2, 1, 7, 2, hex('#6a5a4a'));
        c.rect(7, 3, 8, 5, hex('#6a5a4a'));
      }
    },
    su: [0, 3, 1],
  });
  add('twenties-theatre-spotlight-stand', 'theatre spotlight on stand stage lamp limelight follow spot music hall cabaret', {
    w: 20, h: 40, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 2, 9, 3, EB); // chimney
      c.rect(3, 4, 13, 13, EB); // the lamp house
      c.row(4, 3, 13, hex('#4a444c'));
      c.col(3, 4, 13, hex('#4a444c'));
      for (let x = 5; x <= 9; x += 2) c.col(x, 6, 8, u ? C.flame : hex('#3a343c'));
      c.rect(14, 5, 15, 12, NICK); // the lens ring
      c.col(16, 6, 11, u ? C.white : C.glassLight);
      c.rect(2, 8, 2, 10, NICK);
      c.line(4, 14, 8, 17, NICK); // yoke
      c.line(12, 14, 9, 17, NICK);
      c.rect(8, 18, 9, b - 4, NICK);
      c.col(8, 18, b - 4, L(NICK));
      c.rect(7, 24, 10, 25, EB);
      c.line(8, b - 4, 3, b, EB);
      c.line(9, b - 4, 14, b, EB);
      c.rect(8, b - 3, 9, b, EB);
      c.line(2, 9, 0, 14, EB); // cable
      c.line(0, 14, 1, b, EB);
      if (u) beam(c, 17, 8, 9, 1, C.white);
    },
    u: [0, 0, 8],
    sw: 16, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.rect(6, 2, 9, 3, EB);
      c.rect(3, 4, 12, 13, EB);
      c.oval(3, 4, 12, 13, NICK);
      c.oval(4, 5, 11, 12, u ? C.white : hex('#56727a'));
      if (!u) {
        c.set(6, 7, C.glassLight);
        c.set(5, 8, C.glassLight);
      } else c.oval(6, 7, 9, 10, C.glow);
      c.col(2, 7, 14, NICK); // yoke arms
      c.col(13, 7, 14, NICK);
      c.row(15, 2, 13, NICK);
      c.rect(7, 16, 8, b - 4, NICK);
      c.col(7, 16, b - 4, L(NICK));
      c.rect(6, 24, 9, 25, EB);
      c.line(7, b - 4, 2, b, EB);
      c.line(8, b - 4, 13, b, EB);
      c.rect(7, b - 3, 8, b, EB);
      if (u) dots(c, C.glow, [1, 3, 14, 3, 0, 9, 15, 9, 1, 14, 14, 14, 7, 1, 8, 1]);
    },
  });
  add('twenties-brass-spittoon', 'brass spittoon cuspidor saloon floor pot tobacco bar hotel lobby', {
    w: 12, h: 10, solid: false,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.rect(1, 2, 10, 2, BR); // flared rim
        c.row(2, 2, 6, L(BR));
        c.rect(4, 3, 7, 4, D(BR));
        c.oval(2, 4, 9, b, BR);
        c.rect(3, b, 8, b, D(BR));
        c.set(3, 5, L(BR));
        c.set(3, 6, L(BR));
      } else {
        c.oval(2, b - 6, 9, b, BR); // kicked over
        c.row(b - 6, 4, 7, L(BR));
        c.col(2, b - 4, b - 2, D(BR));
        c.rect(10, b - 5, 11, b - 1, D(BR));
        c.col(12, b - 7, b, BR);
        c.set(12, b - 7, L(BR));
        c.rect(14, b, 19, b, hex('#4a3a22')); // what was in it
        c.rect(15, b - 1, 17, b - 1, hex('#4a3a22'));
        c.set(16, b - 1, hex('#6a5a34'));
        c.set(20, b, hex('#4a3a22'));
      }
    },
    us: [22, 10],
  });
  add('twenties-wheelchair-wicker', 'wheelchair wicker invalid chair cane bath chair sanatorium old wooden wheels', {
    w: 22, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 2, 15, 15, CANE); // the high cane back
      c.row(2, 7, 14, L(CANE));
      for (let y = 3; y <= 14; y++) for (let x = 7; x <= 14; x++) if ((x + y) % 2) c.set(x, y, D(CANE));
      c.frame(6, 2, 15, 15, hex('#7a6238'));
      c.clear(6, 2);
      c.clear(15, 2);
      for (const x of [4, 16]) {
        c.rect(x, 12, x + 1, 17, hex('#7a6238')); // arms
        c.set(x, 12, CANE);
      }
      c.rect(6, 16, 15, 18, CANE);
      c.row(16, 6, 15, L(CANE));
      c.rect(6, 19, 15, 21, hex('#7a6238'));
      tyreEnd(c, 2, 3, 10, b, hex('#4a4038'));
      tyreEnd(c, 18, 19, 10, b, hex('#4a4038'));
      c.row(20, 4, 17, C.iron); // axle
      c.rect(7, 24, 14, 25, OAK); // foot board
      c.col(8, 22, 23, C.iron);
      c.col(13, 22, 23, C.iron);
      c.rect(10, b - 2, 11, b, hex('#4a4038')); // the small wheel in front
      c.col(10, 26, b - 3, C.iron);
      if (u) {
        c.poly([[6, 15], [15, 15], [16, 22], [13, 26], [7, 22]], H.P.OX); // a rug left in it, still warm
        for (let y = 16; y <= 24; y += 2) for (let x = 7; x <= 15; x += 3) if (c.get(x, y)) c.set(x, y, hex('#a07e2c'));
        c.line(7, 16, 8, 22, D(H.P.OX));
        c.rect(12, b, 15, b, C.paper); // a book fallen open on the floor
        c.set(13, b - 1, C.paper);
        c.set(14, b, INK);
      }
    },
    sw: 24, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[4, 2], [7, 2], [8, 16], [5, 16]], CANE); // the back
      c.col(4, 2, 4, hex('#7a6238'));
      c.line(4, 2, 5, 16, hex('#7a6238'));
      c.line(2, 4, 4, 5, hex('#7a6238')); // push handle
      c.rect(6, 16, 16, 18, CANE);
      c.row(16, 6, 16, L(CANE));
      c.rect(7, 12, 15, 12, hex('#7a6238'));
      c.col(15, 13, 15, hex('#7a6238'));
      c.line(16, 18, 19, 24, C.iron);
      c.rect(17, 24, 21, 25, OAK);
      tyre(c, 9, 20, 7, hex('#8a7a58'), C.iron, hex('#4a4038'));
      c.oval(18, b - 3, 21, b, hex('#4a4038'));
      c.set(19, b - 2, C.iron);
      c.line(17, 19, 19, b - 3, C.iron);
      if (u) {
        c.poly([[6, 14], [15, 15], [17, 19], [15, 22], [8, 18]], H.P.OX);
        dots(c, hex('#a07e2c'), [9, 16, 12, 17, 15, 18, 11, 15]);
        c.rect(19, b, 22, b, C.paper);
      }
    },
  });
};
