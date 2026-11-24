/* The nineteen-twenties, part b: music and the speakeasy floor, the picture house, the office and the hall.
 * Part of tools/big/env2-twenties.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, tleg, cabSide, hollow, pane, wisp, bottle, lampGlass, beam, notes, type, sheet, deco, rod, doorOut, opened, shards } = H;
  const add = H.reg('env-twenties', "1920's");
  const { OAK, OAKD, MAH, WAL, EB, BAKE, NICK, BR, GILT, GRN, OX, CREAM, TEAL, GLASSD, AMBER, FELT, LIT, INK, NEWS, VELVET } = H.P;
  const DARKIN = hex('#17151c');
  const VARN = hex('#8a4a26'),
    LEATH = hex('#5a3524'),
    TRENCH = hex('#8a7a58'),
    FELTHAT = hex('#5b5a60');

  /* ---------- music ---------- */
  add('twenties-gramophone-horn-cabinet', 'gramophone phonograph brass horn on record cabinet oak wind up records music victrola', {
    w: 20, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(5, 2, 17, 12, BR); // the horn, its mouth towards us
      c.oval(7, 4, 15, 10, mix(BR, 0.62));
      c.oval(9, 5, 13, 9, mix(BR, 0.36));
      for (const [x, y] of [[11, 2], [6, 5], [16, 5], [6, 9], [16, 9], [11, 12]]) c.set(x, y, L(BR)); // petals
      c.rect(4, 13, 15, 16, WAL); // the motor box
      c.row(13, 4, 15, L(WAL));
      c.row(12, 5, 9, EB); // the record under the horn
      dots(c, BR, [16, 14, 17, 14, 17, 13]); // crank
      c.set(17, 12, EB);
      board(c, 2, 17, 17, 18, OAK);
      face(c, 3, 19, 16, 29, OAK);
      legs(c, [3, 15], 30, b, OAKD);
      if (!u) {
        panel(c, 5, 21, 14, 27, OAK);
        c.set(13, 24, BR);
      } else {
        hollow(c, 5, 21, 14, 27, OAK); // the door open: the records in their sleeves
        for (let x = 6; x <= 11; x++) c.col(x, 22, 27, x % 3 === 0 ? EB : x % 3 === 1 ? NEWS : D(NEWS));
        c.rect(12, 25, 13, 27, EB);
        c.col(14, 21, 27, L(OAK));
        notes(c, 13, 0);
        notes(c, 3, 3, C.ghost);
      }
    },
    u: [0, 7, 0],
    sw: 16, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[5, 9], [6, 7], [13, 2], [13, 12], [6, 10]], BR); // the horn in profile, mouth to the right
      c.line(6, 7, 13, 2, L(BR));
      c.col(13, 3, 11, mix(BR, 0.62));
      c.line(7, 9, 12, 10, D(BR));
      c.line(5, 10, 4, 12, BR);
      c.rect(3, 13, 10, 16, WAL);
      c.row(13, 3, 10, L(WAL));
      c.row(12, 6, 10, EB);
      board(c, 1, 17, 12, 18, OAK);
      cabSide(c, 2, 19, 11, 29, OAK);
      legs(c, [2, 10], 30, b, OAKD);
      if (u) {
        doorOut(c, 12, 21, 27, 3, OAK);
        notes(c, 9, 0);
      }
    },
    su: [0, 7, 2],
  });
  add('twenties-wireless-set-cone-speaker', 'wireless set radio receiver valve dials cone loudspeaker on table walnut broadcast 1920s', {
    w: 22, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(6, 2, 15, 11, hex('#8c7c5a')); // the paper cone of the loud speaker
      c.oval(7, 3, 14, 10, hex('#a3936a'));
      c.oval(9, 5, 12, 8, hex('#8c7c5a'));
      c.set(10, 6, BR);
      c.set(11, 7, BR);
      c.rect(9, 12, 12, 13, EB);
      face(c, 3, 14, 18, 22, WAL); // the set
      c.rect(4, 16, 17, 21, EB);
      for (const x of [5, 10, 15]) {
        c.oval(x - 1, 17, x + 1, 19, u ? C.glow : CREAM); // dials
        c.set(x, 18, EB);
      }
      dots(c, u ? C.flame : BR, [7, 16, 13, 16]);
      dots(c, BR, [8, 21, 13, 21]);
      board(c, 1, 23, 20, 24, OAK); // the table
      c.rect(3, 25, 18, 26, OAKD);
      legs(c, [3, 17], 27, b, OAKD);
      c.row(30, 5, 16, OAKD);
      if (u) {
        for (const [x, y] of [[3, 3], [2, 6], [3, 9], [18, 3], [19, 6], [18, 9]]) c.set(x, y, C.ghost); // a voice out of the ether
        dots(c, C.ghost, [1, 4, 1, 8, 20, 4, 20, 8]);
      }
    },
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[6, 6], [9, 2], [10, 2], [10, 11], [9, 11]], hex('#8c7c5a')); // the cone edge on
      c.col(10, 2, 11, hex('#a3936a'));
      c.rect(5, 5, 6, 8, EB);
      c.rect(6, 12, 8, 13, EB);
      cabSide(c, 3, 14, 10, 22, WAL);
      c.col(11, 16, 21, EB);
      dots(c, u ? C.glow : CREAM, [12, 17, 12, 20]);
      board(c, 1, 23, 12, 24, OAK);
      c.rect(3, 25, 10, 26, OAKD);
      legs(c, [3, 9], 27, b, OAKD);
      c.row(30, 5, 8, OAKD);
      if (u) dots(c, C.ghost, [12, 3, 13, 6, 12, 9, 13, 2, 13, 10]);
    },
  });
  add('twenties-player-piano-pianola', 'player piano pianola upright self playing paper roll walnut keys music saloon honky tonk', {
    w: 32, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 30, 3, WAL);
      face(c, 2, 4, 29, 12, WAL);
      panel(c, 4, 5, 10, 11, WAL);
      panel(c, 21, 5, 27, 11, WAL);
      dots(c, BR, [7, 8, 24, 8]); // candle sconces
      dots(c, C.bone, [7, 7, 24, 7]);
      if (!u) {
        c.rect(12, 5, 19, 11, mix(WAL, 0.8)); // the little doors of the roll
        c.col(15, 5, 11, D(WAL));
        c.col(16, 5, 11, L(WAL));
        dots(c, BR, [14, 8, 17, 8]);
      } else {
        hollow(c, 12, 5, 19, 11, WAL); // open: the roll turns by itself
        c.rect(13, 6, 18, 7, CREAM);
        c.rect(13, 8, 18, 9, NEWS);
        dots(c, INK, [14, 8, 16, 9, 17, 8, 15, 9]);
        c.rect(13, 10, 18, 10, BR);
        c.col(11, 5, 11, L(WAL));
        c.col(20, 5, 11, L(WAL));
      }
      board(c, 1, 13, 30, 13, mix(WAL, 0.8));
      c.row(14, 2, 29, C.white); // the keys
      c.row(15, 2, 29, D(C.bone));
      for (let x = 3; x <= 28; x++) if (x % 7 !== 0 && x % 7 !== 3 && x % 2) c.set(x, 14, K);
      if (u) for (const x of [6, 13, 14, 20, 25]) c.set(x, 14, hex('#8d8a84')), c.set(x, 15, C.white); // keys going down, no hands
      c.rect(1, 16, 30, 16, WAL);
      face(c, 2, 17, 29, b - 1, WAL);
      panel(c, 5, 18, 26, b - 4, WAL);
      for (const x of [2, 28]) {
        c.rect(x, 14, x + 1, b, mix(WAL, 0.8)); // cheeks and legs
        c.col(x, 14, b, WAL);
      }
      c.rect(1, b, 30, b, mix(WAL, 0.7));
      dots(c, BR, [13, b - 1, 15, b - 1, 17, b - 1]);
      if (u) {
        notes(c, 23, 0);
        notes(c, 6, 1, C.ghost);
      }
    },
    u: [0, 6, 0],
    sw: 16, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 9, 3, WAL);
      cabSide(c, 2, 4, 8, 12, WAL);
      c.rect(2, 13, 13, 15, WAL); // key shelf
      c.row(13, 2, 13, L(WAL));
      c.row(14, 9, 13, u ? D(C.bone) : C.white);
      c.set(13, 15, D(WAL));
      cabSide(c, 2, 16, 9, b, WAL);
      c.rect(11, 16, 12, b, mix(WAL, 0.8)); // leg
      c.set(11, 16, L(WAL));
      c.rect(2, b, 13, b, mix(WAL, 0.7));
      c.set(10, b - 1, BR);
      if (u) {
        c.rect(9, 6, 10, 10, mix(WAL, 0.8));
        c.col(11, 5, 11, L(WAL));
        notes(c, 9, 0);
      }
    },
    su: [0, 6, 0],
  });
  add('twenties-double-bass-on-stand', 'double bass upright bass string bass jazz band instrument varnished wood contrabass', {
    w: 16, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 2, 8, 4, VARN); // scroll and pegs
      c.set(5, 3, VARN);
      dots(c, EB, [5, 5, 9, 5, 5, 7, 9, 7]);
      c.rect(6, 5, 8, 17, EB); // finger board
      c.col(6, 5, 17, L(EB));
      c.oval(3, 14, 11, 23, VARN); // the body
      c.oval(1, 22, 13, 38, VARN);
      c.rect(4, 20, 10, 25, VARN);
      c.col(3, 17, 21, L(VARN));
      c.col(1, 26, 33, L(VARN));
      c.set(2, 24, L(VARN));
      for (let y = 23; y <= 30; y++) c.set(11 + (y > 27 ? 1 : 0), y, D(VARN));
      c.set(3, 22, D(VARN)); // the waist
      c.set(11, 22, D(VARN));
      c.col(4, 23, 28, EB); // f holes
      c.col(10, 23, 28, EB);
      c.set(5, 23, EB);
      c.set(9, 28, EB);
      c.rect(5, 29, 9, 29, hex('#c9b68a')); // bridge
      c.poly([[6, 31], [8, 31], [8, 36], [6, 36]], EB); // tail piece
      c.col(7, 5, 30, u ? VARN : C.bone); // strings
      if (!u) c.col(8, 18, 30, hex('#a8a08a'));
      c.col(7, b - 1, b, NICK); // the spike
      c.rect(2, b, 4, b, EB); // stand feet
      c.rect(10, b, 12, b, EB);
      if (u) {
        c.line(7, 12, 11, 9, C.bone); // strings snapped and curled
        c.set(12, 10, C.bone);
        c.line(8, 22, 12, 19, C.bone);
        c.line(4, 31, 3, 35, K); // a crack down the belly
        c.set(4, 36, K);
      }
    },
    sw: 12, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 5, 4, VARN);
      c.set(2, 3, VARN);
      dots(c, EB, [6, 5, 6, 7]);
      c.line(4, 5, 5, 17, VARN); // the neck leans back
      c.line(5, 5, 6, 20, EB);
      c.rect(3, 14, 6, 38, VARN);
      c.col(3, 14, 38, L(VARN));
      c.col(6, 20, 38, D(VARN));
      c.rect(2, 22, 2, 36, VARN);
      c.set(7, 29, hex('#c9b68a')); // bridge
      c.set(8, 29, hex('#c9b68a'));
      c.line(6, 6, 8, 28, u ? null : C.bone);
      c.line(7, 31, 7, 36, EB);
      c.col(5, b - 1, b, NICK);
      c.rect(2, b, 3, b, EB);
      c.rect(7, b, 9, b, EB);
      if (u) {
        c.line(6, 12, 9, 9, C.bone);
        c.set(10, 10, C.bone);
        c.line(8, 24, 10, 21, C.bone);
      }
    },
  });
  add('twenties-jazz-drum-kit', 'jazz drum kit trap set bass drum snare cymbal temple blocks band percussion red sparkle', {
    w: 30, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.col(25, 6, 16, NICK); // cymbal stand
      c.poly([[20, 6], [28, 4], [28, 5], [20, 7]], BR);
      c.row(5, 22, 27, L(BR));
      c.oval(6, 9, 23, 26, OX); // the bass drum
      c.oval(8, 11, 21, 24, CREAM);
      c.oval(7, 10, 22, 25, null);
      for (let a = 0; a < 360; a += 45) c.set(Math.round(14.5 + 8.4 * Math.cos((a * Math.PI) / 180)), Math.round(17.5 + 8.4 * Math.sin((a * Math.PI) / 180)), NICK);
      c.oval(8, 11, 21, 24, CREAM);
      for (let y = 12; y <= 23; y++) if (c.get(20, y) === CREAM) c.set(20, y, D(CREAM));
      if (!u) {
        c.oval(11, 14, 17, 20, hex('#a09674')); // a moon painted on the head
        c.oval(13, 14, 19, 20, CREAM);
        type(c, 11, 18, 22, INK, 2);
      } else {
        c.poly([[11, 14], [15, 13], [18, 16], [17, 21], [12, 21], [10, 18]], DARKIN); // the head put through
        dots(c, CREAM, [11, 14, 18, 16, 12, 21]);
        dots(c, INK, [9, 15, 19, 19, 14, 23]);
      }
      c.rect(11, 6, 14, 8, C.woodLight); // wood block and cow bell on the hoop
      c.row(7, 11, 14, D(C.woodLight));
      c.rect(16, 6, 18, 8, BR);
      c.rect(1, 14, 7, 16, NICK); // snare on its stand
      c.row(13, 1, 7, CREAM);
      c.col(4, 14, 16, D(NICK));
      c.line(4, 17, 1, b, NICK);
      c.line(4, 17, 6, b - 2, NICK);
      c.line(7, 24, 4, b, NICK); // spurs
      c.line(22, 24, 25, b, NICK);
      c.line(25, 16, 28, b, NICK);
      c.line(25, 16, 23, b - 4, NICK);
      if (!u) c.line(2, 12, 6, 11, C.woodPale); // sticks across the snare
      else {
        c.line(8, b, 14, b, C.woodPale); // a stick on the floor
        c.set(15, b, C.bone);
      }
    },
    sw: 20, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.col(8, 6, 12, NICK);
      c.row(5, 4, 13, BR);
      c.row(4, 6, 11, L(BR));
      c.rect(6, 9, 12, 26, OX); // the shell, edge on
      c.col(6, 10, 25, NICK);
      c.col(12, 10, 25, u ? DARKIN : CREAM);
      c.col(7, 10, 25, L(OX));
      dots(c, NICK, [9, 11, 9, 17, 9, 24]);
      c.col(9, 12, 16, D(OX));
      c.col(9, 18, 23, D(OX));
      c.rect(8, 6, 10, 8, C.woodLight);
      c.rect(13, b - 1, 17, b, C.iron); // the pedal
      c.line(14, b - 2, 13, 19, NICK);
      c.set(13, 18, hex('#c9c2aa'));
      c.set(13, 17, hex('#c9c2aa'));
      c.rect(1, 14, 4, 16, NICK);
      c.row(13, 1, 4, CREAM);
      c.line(3, 17, 1, b, NICK);
      c.line(3, 17, 5, b, NICK);
      c.line(6, 26, 4, b, NICK);
      if (u) {
        dots(c, CREAM, [13, 12, 13, 22]);
        c.row(b, 7, 11, C.woodPale);
      }
    },
  });
  add('twenties-microphone-ring-stand', 'microphone on a stand carbon ring spring mount radio broadcast singer crooner nickel', {
    w: 12, h: 34, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.oval(2, 2, 9, 10, NICK); // the ring
      c.oval(3, 3, 8, 9, null);
      for (let y = 3; y <= 9; y++) for (let x = 3; x <= 8; x++) if (((x - 5.5) / 3) ** 2 + ((y - 6) / 3.5) ** 2 <= 1) c.clear(x, y);
      c.rect(4, 4, 7, 8, EB); // the capsule on its springs
      dots(c, hex('#6a6a72'), [5, 5, 6, 6, 5, 7, 6, 4]);
      dots(c, NICK, [3, 4, 8, 4, 3, 8, 8, 8]);
      c.rect(5, 11, 6, 12, EB);
      rod(c, 5, 13, b - 3, NICK);
      c.col(6, 13, b - 3, D(NICK));
      c.rect(4, 18, 7, 18, BR); // clamp
      c.oval(2, b - 2, 9, b, EB);
      c.row(b - 2, 3, 8, hex('#4a444c'));
      c.set(4, 20, u ? C.red : C.blood); // the little lamp
      if (u) {
        dots(c, C.flameLight, [3, 20]);
        dots(c, C.ghost, [0, 4, 0, 8, 11, 4, 11, 8, 1, 6, 10, 6, 1, 1, 10, 1]);
      }
    },
    sw: 10, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.col(4, 2, 10, NICK); // the ring edge on
      c.col(5, 2, 10, D(NICK));
      c.rect(3, 4, 6, 8, EB);
      c.set(7, 6, hex('#6a6a72'));
      c.rect(4, 11, 5, 12, EB);
      rod(c, 4, 13, b - 3, NICK);
      c.col(5, 13, b - 3, D(NICK));
      c.rect(3, 18, 6, 18, BR);
      c.oval(1, b - 2, 8, b, EB);
      c.row(b - 2, 2, 7, hex('#4a444c'));
      c.set(6, 20, u ? C.red : C.blood);
      if (u) dots(c, C.ghost, [8, 4, 9, 6, 8, 8, 9, 2, 9, 10]);
    },
  });

  /* ---------- the gaming room ---------- */
  add('twenties-roulette-table', 'roulette table casino gambling wheel green felt chips mahogany speakeasy gaming', {
    w: 42, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 7, 39, 8, FELT); // the cloth
      c.row(7, 2, 39, L(FELT));
      for (let x = 17; x <= 36; x += 2) c.set(x, 8, x % 4 === 1 ? C.red : EB); // the layout
      c.row(7, 16, 37, hex('#8fa98a'));
      c.oval(3, 3, 14, 9, MAH); // the wheel
      c.oval(4, 4, 13, 8, EB);
      c.row(6, 5, 12, C.red);
      dots(c, EB, [6, 6, 8, 6, 10, 6, 12, 6]);
      c.oval(7, 4, 10, 7, BR);
      c.col(8, 1, 4, NICK); // spindle
      c.row(2, 7, 10, NICK);
      board(c, 1, 9, 40, 10, MAH);
      face(c, 3, 11, 38, 13, mix(MAH, 0.85));
      for (const x of [4, 34]) {
        c.rect(x, 14, x + 3, b, MAH); // heavy legs
        c.col(x, 14, b, L(MAH));
        c.rect(x - 1, 16, x + 4, 16, MAH);
        c.rect(x - 1, b, x + 4, b, mix(MAH, 0.7));
      }
      if (!u) {
        for (const [x, col] of [[20, C.red], [23, CREAM], [26, hex('#3f5f7a')]]) {
          c.rect(x, 4, x + 1, 6, col); // the house's chips, stacked
          c.row(5, x, x + 1, D(col));
        }
      } else {
        dots(c, C.red, [18, 6, 19, 6, 22, 5, 27, 6, 31, 6, 32, 6]); // the chips swept across the cloth
        dots(c, CREAM, [21, 6, 24, 6, 25, 6, 29, 6, 33, 5]);
        dots(c, hex('#3f5f7a'), [23, 6, 28, 6, 30, 5]);
        c.rect(34, 5, 37, 6, hex('#6a7a5a')); // banknotes
        c.row(5, 34, 37, hex('#8a9a72'));
        c.set(9, 5, C.white); // the ball has stopped
        dots(c, C.red, [19, b, 22, b]);
        c.set(25, b, CREAM);
      }
    },
    sw: 24, sh: 20,
    s(c, u) {
      const b = c.h - 2; // from the wheel end
      c.rect(2, 7, 21, 8, FELT);
      c.row(7, 2, 21, L(FELT));
      c.oval(5, 3, 18, 9, MAH);
      c.oval(6, 4, 17, 8, EB);
      c.row(6, 7, 16, C.red);
      dots(c, EB, [8, 6, 10, 6, 12, 6, 14, 6, 16, 6]);
      c.oval(9, 4, 14, 7, BR);
      c.col(11, 1, 4, NICK);
      c.row(2, 10, 13, NICK);
      board(c, 1, 9, 22, 10, MAH);
      face(c, 3, 11, 20, 13, mix(MAH, 0.85));
      for (const x of [3, 17]) {
        c.rect(x, 14, x + 3, b, MAH);
        c.col(x, 14, b, L(MAH));
        c.rect(x - 1, 16, x + 4, 16, MAH);
        c.rect(x - 1, b, x + 4, b, mix(MAH, 0.7));
      }
      if (u) {
        c.set(13, 5, C.white);
        dots(c, C.red, [3, 6, 20, 6, 8, b]);
        dots(c, CREAM, [4, 6, 19, 6, 12, b]);
      } else dots(c, C.red, [20, 6, 20, 5]);
    },
  });
  add('twenties-slot-machine-one-armed-bandit', 'slot machine one armed bandit fruit machine gambling coins lever cast iron on stand', {
    w: 16, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 4, 11, 19, OX); // the machine
      c.row(3, 4, 10, OX);
      c.row(3, 5, 9, L(OX));
      c.col(3, 5, 19, L(OX));
      c.frame(4, 7, 10, 11, NICK);
      c.rect(5, 8, 9, 10, CREAM); // the reels
      c.col(6, 8, 10, D(CREAM));
      c.col(8, 8, 10, D(CREAM));
      if (!u) dots(c, C.red, [5, 9]), dots(c, GRN, [7, 9]), dots(c, GILT, [9, 9]);
      else dots(c, GILT, [5, 9, 7, 9, 9, 9]); // three bells
      c.set(7, 5, EB); // coin slot
      c.rect(5, 13, 9, 14, BR);
      type(c, 5, 9, 13, D(BR), 2);
      c.rect(4, 16, 10, 18, DARKIN); // the cup
      c.row(18, 4, 10, NICK);
      c.col(12, u ? 12 : 6, u ? 15 : 12, NICK); // the arm
      c.rect(12, u ? 15 : 5, 13, u ? 16 : 6, EB);
      c.set(11, 12, NICK);
      c.rect(2, 20, 12, 21, OAK); // its stand
      c.row(20, 2, 12, L(OAK));
      face(c, 4, 22, 10, b - 1, OAK);
      panel(c, 5, 23, 9, b - 3, OAK);
      c.rect(3, b, 11, b, OAKD);
      if (u) {
        dots(c, GILT, [5, 17, 6, 17, 8, 17, 7, 16, 9, 17, 13, b, 14, b, 12, b - 1]); // it pays out
        dots(c, L(GILT), [6, 16, 13, b - 1]);
      }
    },
    sw: 14, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 4, 9, 19, OX);
      c.row(3, 4, 8, L(OX));
      c.col(3, 5, 19, L(OX));
      c.col(9, 7, 11, NICK);
      c.rect(9, 16, 10, 18, NICK);
      c.set(6, 12, NICK); // the arm's pivot
      if (!u) {
        c.line(6, 12, 6, 6, NICK);
        c.rect(6, 4, 7, 5, EB);
      } else {
        c.line(6, 12, 11, 13, NICK);
        c.rect(11, 13, 12, 14, EB);
      }
      c.rect(2, 20, 10, 21, OAK);
      c.row(20, 2, 10, L(OAK));
      cabSide(c, 3, 22, 9, b - 1, OAK);
      c.rect(2, b, 10, b, OAKD);
      if (u) dots(c, GILT, [10, 17, 11, b, 12, b, 11, b - 1]);
    },
  });
  add('twenties-cash-register-brass', 'cash register brass till shop money drawer keys ornate national no sale', {
    w: 16, h: 18, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 2, 11, 5, BR); // the indicator on top
      c.rect(5, 3, 10, 4, GLASSD);
      dots(c, CREAM, u ? [6, 3, 6, 4, 8, 3, 9, 4] : [7, 4]);
      c.row(2, 5, 10, L(BR));
      c.poly([[3, 6], [12, 6], [13, 12], [2, 12]], BR); // the body with its rows of keys
      c.row(6, 3, 12, L(BR));
      for (let y = 7; y <= 11; y += 2) for (let x = 4; x <= 11; x += 2) c.set(x, y, y === 9 ? EB : CREAM);
      c.col(2, 9, 12, L(BR));
      dots(c, NICK, [13, 8, 14, 8, 14, 7]); // crank
      c.set(14, 6, EB);
      c.rect(1, 13, 14, b, MAH); // the drawer
      c.row(13, 1, 14, L(MAH));
      if (!u) {
        c.rect(6, 14, 9, 14, BR);
      } else {
        c.rect(2, 14, 13, 14, DARKIN); // drawer out: the notes and the silver
        dots(c, hex('#8a9a72'), [3, 14, 4, 14, 6, 14, 7, 14]);
        dots(c, NICK, [10, 14, 12, 14]);
        c.rect(1, 15, 14, b, L(MAH));
        c.row(b, 1, 14, MAH);
        c.rect(6, 16, 9, 16, BR);
      }
    },
    sw: 14, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 7, 5, BR);
      c.row(2, 4, 6, L(BR));
      c.col(8, 3, 4, GLASSD);
      c.poly([[2, 6], [8, 6], [11, 12], [2, 12]], BR);
      c.row(6, 2, 8, L(BR));
      c.line(9, 7, 11, 11, CREAM); // the keys' edge
      c.line(9, 8, 10, 10, EB);
      c.col(2, 6, 12, L(BR));
      c.rect(1, 13, 11, b, MAH);
      c.row(13, 1, 11, L(MAH));
      c.set(11, 14, BR);
      if (u) {
        c.rect(12, 14, 15, b, L(MAH)); // the drawer out
        c.row(13, 12, 15, DARKIN);
        dots(c, hex('#8a9a72'), [12, 13, 14, 13]);
        c.set(15, 14, BR);
        c.set(8, 2, CREAM);
      }
    },
    su: [0, 0, 3],
  });
  add('twenties-cocktail-cabinet-walnut', 'cocktail cabinet drinks cabinet art deco walnut sunburst doors mirror shaker bar home', {
    w: 26, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      deco(c, 5, 20, 3, WAL, 2);
      face(c, 2, 4, 23, 24, WAL);
      c.row(4, 2, 23, L(WAL));
      if (!u) {
        for (const [x0, x1, cx] of [[4, 12, 12], [13, 21, 13]]) {
          c.rect(x0, 6, x1, 22, mix(WAL, 1.12)); // the doors, a sunburst in lighter veneer
          for (const [dx, dy] of [[-8, -8], [-8, 0], [-8, 8], [-4, -8], [-4, 8], [0, -8], [0, 8]]) c.line(cx, 14, cx + (cx === 12 ? dx : -dx), 14 + dy, hex('#7d5e3e'));
        }
        c.col(12, 6, 22, D(WAL));
        c.col(13, 6, 22, L(WAL));
        c.oval(11, 12, 14, 16, BR);
        c.col(12, 13, 15, D(BR));
      } else {
        c.rect(4, 6, 21, 22, hex('#8fa9ae')); // open: a mirror back, lit
        c.row(6, 4, 21, C.glow);
        for (let i = 0; i < 5; i++) c.set(6 + i, 12 - i, C.white);
        c.rect(4, 14, 21, 15, hex('#b9c6c4')); // glass shelf
        c.rect(6, 9, 8, 13, NICK); // the shaker
        c.rect(7, 7, 7, 8, NICK);
        c.col(6, 9, 13, L(NICK));
        bottle(c, 11, 13, 6, GRN);
        bottle(c, 14, 13, 5, AMBER);
        bottle(c, 17, 13, 6, OX);
        for (const x of [6, 9, 12]) {
          c.rect(x, 20, x + 1, 22, C.glassLight);
          c.set(x, 21, C.white);
        }
        c.rect(16, 19, 19, 22, hex('#c9c2aa')); // a soda syphon
        c.rect(17, 17, 18, 18, NICK);
        c.set(19, 17, NICK);
        c.col(3, 6, 22, L(WAL));
        c.col(22, 6, 22, L(WAL));
      }
      board(c, 1, 25, 24, 26, mix(WAL, 0.85));
      for (const x of [3, 20]) {
        c.rect(x, 27, x + 2, b, EB);
        c.col(x, 27, b, hex('#4a444c'));
      }
      c.row(28, 6, 19, EB);
    },
    sw: 12, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 7, 3, WAL);
      cabSide(c, 2, 4, 9, 24, WAL);
      board(c, 1, 25, 10, 26, mix(WAL, 0.85));
      c.rect(3, 27, 4, b, EB);
      c.rect(7, 27, 8, b, EB);
      if (u) {
        doorOut(c, 10, 6, 22, 5, mix(WAL, 1.12));
        c.col(9, 6, 22, C.glow);
      } else c.set(9, 14, BR);
    },
    su: [0, 0, 5],
  });
  add('twenties-club-armchair-leather', 'club armchair brown leather art deco easy chair smoking room lounge seat', {
    w: 22, h: 21, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(5, 3, 16, 12, LEATH); // the back
      c.row(2, 6, 15, L(LEATH));
      c.col(5, 3, 12, D(LEATH));
      c.col(16, 3, 12, D(LEATH));
      for (const x of [1, 16]) {
        c.rect(x, 7, x + 4, b - 1, LEATH); // fat round arms
        c.row(6, x + 1, x + 3, L(LEATH));
        c.row(7, x, x + 4, L(LEATH));
        c.col(x + 4, 9, b - 1, D(LEATH));
        c.rect(x + 1, 9, x + 3, 10, D(LEATH));
      }
      c.col(1, 8, b - 1, L(LEATH));
      c.rect(6, 12, 15, 15, LEATH); // the cushion
      c.row(12, 6, 15, L(LEATH));
      c.row(15, 6, 15, D(LEATH));
      c.rect(6, 16, 15, b - 1, mix(LEATH, 0.8));
      dots(c, BR, [6, b - 1, 9, b - 1, 12, b - 1, 15, b - 1]);
      legs(c, [2, 18], b, b, EB);
      if (u) {
        c.rect(7, 11, 13, 13, NEWS); // the evening paper left on the seat, a hat on the arm
        c.row(11, 7, 13, L(NEWS));
        type(c, 8, 12, 12, INK, 2);
        c.rect(16, 5, 20, 6, FELTHAT);
        c.rect(17, 3, 19, 4, FELTHAT);
        c.row(5, 17, 19, EB);
        c.row(3, 17, 19, L(FELTHAT));
      }
    },
    sw: 19, sh: 21,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 3], [6, 2], [7, 12], [3, 12]], LEATH);
      c.col(2, 3, 12, L(LEATH));
      c.rect(2, 7, 14, b - 1, LEATH);
      c.oval(2, 6, 15, 11, LEATH); // the arm's roll
      c.row(6, 4, 13, L(LEATH));
      c.oval(11, 7, 14, 10, D(LEATH));
      c.set(12, 8, LEATH);
      c.col(2, 8, b - 1, L(LEATH));
      c.rect(15, 12, 16, 15, LEATH); // cushion front
      c.set(15, 12, L(LEATH));
      c.rect(14, 16, 15, b - 1, mix(LEATH, 0.8));
      dots(c, BR, [4, b - 1, 8, b - 1, 12, b - 1]);
      legs(c, [3, 13], b, b, EB);
      if (u) {
        c.rect(13, 11, 16, 11, NEWS);
        c.rect(7, 4, 12, 5, FELTHAT);
        c.rect(8, 2, 11, 3, FELTHAT);
        c.row(4, 8, 11, EB);
        c.row(2, 8, 11, L(FELTHAT));
      }
    },
  });
  add('twenties-bar-stool-leather', 'bar stool round seat oxblood leather nickel pedestal foot ring saloon diner', {
    w: 12, h: 20, solid: false,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.rect(2, 2, 9, 4, OX);
        c.row(2, 3, 8, L(OX));
        c.row(5, 2, 9, NICK);
        rod(c, 5, 6, b - 2, NICK);
        c.col(6, 6, b - 2, D(NICK));
        c.rect(3, 12, 8, 12, NICK); // foot ring
        c.set(2, 13, NICK);
        c.set(9, 13, NICK);
        c.rect(3, b - 1, 8, b - 1, NICK);
        c.rect(2, b, 9, b, D(NICK));
      } else {
        const y = c.h - 2; // knocked over
        c.rect(1, y - 7, 3, y, OX);
        c.col(1, y - 6, y - 1, L(OX));
        c.col(4, y - 7, y, NICK);
        c.rect(5, y - 4, 15, y - 3, NICK);
        c.row(y - 4, 5, 15, L(NICK));
        c.col(10, y - 6, y - 1, NICK);
        c.col(16, y - 6, y, NICK);
        c.col(17, y - 7, y, D(NICK));
      }
    },
    us: [20, 11],
  });

  /* ---------- the picture house ---------- */
  add('twenties-cinema-projector', 'cinema projector film reels movie picture house lantern lens cast iron pedestal silent film', {
    w: 28, h: 38, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      const reel = (cx, cy, r) => {
        c.oval(cx - r, cy - r, cx + r, cy + r, C.iron);
        c.oval(cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1, hex('#3a3028')); // the film wound on it
        c.oval(cx - 1, cy - 1, cx + 1, cy + 1, C.steel);
        c.set(cx - r + 1, cy - r + 2, C.steel);
        c.line(cx - r + 1, cy, cx + r - 1, cy, C.ironDark);
        c.line(cx, cy - r + 1, cx, cy + r - 1, C.ironDark);
        c.set(cx, cy, C.steel);
      };
      c.rect(4, 6, 5, 9, C.ironDark); // the lamp house and its chimney
      c.row(5, 3, 6, C.iron);
      c.rect(2, 10, 9, 22, C.iron);
      c.col(2, 10, 22, L(C.iron));
      c.row(10, 2, 9, L(C.iron));
      for (let y = 13; y <= 19; y += 2) c.row(y, 4, 7, u ? C.flame : C.ironDark); // vents
      c.rect(10, 12, 19, 22, C.ironDark); // the head
      c.row(12, 10, 19, C.iron);
      c.rect(12, 15, 16, 19, hex('#22222a'));
      c.set(14, 17, BR);
      c.rect(20, 15, 23, 18, BR); // lens
      c.col(20, 15, 18, L(BR));
      c.col(24, 15, 18, u ? C.glow : C.glassLight);
      reel(14, 6, 5);
      reel(19, 26, 4);
      c.line(18, 9, 18, 12, hex('#3a3028')); // the film between them
      c.line(17, 22, 17, 23, hex('#3a3028'));
      c.rect(8, 23, 12, b - 2, C.iron); // the pedestal
      c.col(8, 23, b - 2, L(C.iron));
      c.rect(5, b - 1, 15, b, C.ironDark);
      c.row(b - 1, 6, 14, C.iron);
      dots(c, NICK, [10, 25, 13, 14]);
      c.line(21, 20, 23, 22, NICK); // crank
      c.set(24, 22, EB);
      if (u) {
        beam(c, 25, 16, 8, 1, C.white);
        wisp(c, 4, 4, 3);
      }
    },
    u: [0, 0, 7],
    sw: 16, sh: 38,
    s(c, u) {
      const b = c.h - 2; // the lens towards us
      c.rect(6, 1, 9, 11, C.iron); // upper reel edge on
      c.col(6, 2, 10, L(C.iron));
      c.col(8, 2, 10, hex('#3a3028'));
      c.rect(3, 12, 12, 22, C.ironDark);
      c.row(12, 3, 12, C.iron);
      c.col(3, 12, 22, C.iron);
      c.oval(5, 14, 10, 19, BR);
      c.oval(6, 15, 9, 18, u ? C.white : C.glassLight);
      if (!u) c.set(8, 17, C.glass);
      c.rect(10, 22, 12, 30, C.iron); // lower reel
      c.col(11, 23, 29, hex('#3a3028'));
      c.rect(5, 23, 9, b - 2, C.iron);
      c.col(5, 23, b - 2, L(C.iron));
      c.rect(2, b - 1, 12, b, C.ironDark);
      c.row(b - 1, 3, 11, C.iron);
      c.rect(13, 20, 14, 21, NICK);
      if (u) dots(c, C.glow, [4, 13, 11, 13, 4, 20, 11, 20, 7, 12, 8, 21, 2, 16, 13, 17]);
    },
  });
  add('twenties-cinema-ticket-booth', 'cinema ticket booth box office kiosk picture house theatre art deco teal brass window', {
    w: 26, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      deco(c, 5, 20, 4, TEAL, 3);
      for (let x = 7; x <= 18; x += 2) c.set(x, 3, u && x % 4 === 3 ? C.glow : u ? C.flame : hex('#8a8068')); // bulbs
      c.rect(2, 5, 23, 9, OX); // the sign
      c.row(5, 2, 23, L(OX));
      type(c, 5, 20, 7, GILT, 3);
      face(c, 2, 10, 23, 26, TEAL);
      c.rect(4, 11, 21, 24, u ? LIT : GLASSD);
      c.frame(4, 11, 21, 24, BR);
      if (!u) {
        c.rect(5, 12, 20, 21, hex('#a59c80')); // the blind is down
        c.row(21, 5, 20, D(hex('#a59c80')));
        type(c, 8, 17, 16, INK, 2);
        c.set(12, 22, BR);
        c.set(13, 23, BR);
      } else {
        c.rect(5, 12, 20, 12, hex('#a59c80')); // up: the light on, somebody waiting behind the glass
        c.rect(10, 16, 15, 23, INK);
        c.oval(10, 12, 15, 17, INK);
        dots(c, LIT, [11, 14, 14, 14]);
        c.oval(11, 19, 14, 22, BR); // the speaking grille
        c.set(12, 20, INK);
        c.set(13, 21, INK);
      }
      board(c, 1, 27, 24, 28, mix(MAH, 0.9)); // the sill
      if (u) c.rect(10, 26, 14, 26, hex('#b98a8a')); // a strip of tickets
      face(c, 2, 29, 23, b - 1, TEAL);
      for (let i = 0; i < 4; i++) {
        c.line(12 - i * 3, 31 + i * 3, 12, 31 + i * 3 + 3 > b - 3 ? b - 3 : 34 + i * 3, i % 2 ? BR : D(TEAL)); // chevrons
        c.line(13 + i * 3, 31 + i * 3, 13, 31 + i * 3 + 3 > b - 3 ? b - 3 : 34 + i * 3, i % 2 ? BR : D(TEAL));
      }
      c.col(4, 30, b - 2, BR);
      c.col(21, 30, b - 2, BR);
      c.rect(1, b, 24, b, EB);
    },
    sw: 16, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 2, 11, 4, TEAL);
      c.row(2, 5, 10, L(TEAL));
      c.rect(2, 5, 13, 9, OX);
      c.row(5, 2, 13, L(OX));
      face(c, 2, 10, 13, b - 1, TEAL);
      face(c, 4, 12, 11, b - 1, mix(TEAL, 0.85)); // the door in its side
      c.rect(6, 14, 9, 20, u ? LIT : GLASSD);
      c.frame(5, 13, 10, 21, BR);
      if (u) c.rect(7, 17, 8, 20, INK);
      panel(c, 5, 24, 10, b - 4, mix(TEAL, 0.85));
      c.set(10, 23, BR);
      c.rect(14, 27, 14, 28, mix(MAH, 0.9));
      c.rect(1, b, 14, b, EB);
    },
  });

  /* ---------- the office and the hall ---------- */
  add('twenties-typewriter-desk-oak', 'typewriter desk oak office reporter secretary underwood bankers lamp green shade papers', {
    w: 32, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 11, 30, 12, OAK);
      face(c, 19, 13, 29, b - 1, OAK); // pedestal of drawers
      drawer(c, 20, 14, 28, 16, OAK);
      if (!u) drawer(c, 20, 18, 28, b - 2, OAK);
      else {
        hollow(c, 20, 18, 28, 19, OAK); // the deep drawer open: the bottle that helps with deadlines
        bottle(c, 23, 20, 5, AMBER);
        c.rect(19, 20, 29, b, L(OAK));
        c.row(b, 19, 29, OAK);
        c.set(24, b - 1, BR);
      }
      c.rect(3, 13, 18, 15, OAK);
      c.row(15, 3, 18, D(OAK));
      c.set(10, 14, BR);
      legs(c, [2, 17], 16, b, OAKD);
      c.rect(19, b, 29, b, OAKD);
      c.rect(7, 6, 17, 10, EB); // the typewriter
      c.row(6, 8, 16, hex('#4a444c'));
      for (let x = 8; x <= 16; x += 2) c.set(x, 9, CREAM);
      for (let x = 9; x <= 15; x += 2) c.set(x, 10, CREAM);
      c.rect(6, 5, 18, 5, EB);
      dots(c, NICK, [5, 5, 19, 5]);
      c.set(4, 4, NICK);
      sheet(c, 9, u ? 0 : 2, 15, 4, C.paper, u ? INK : C.paper);
      if (!u) c.row(3, 10, 13, INK);
      c.rect(23, 9, 27, 10, BR); // the lamp
      c.col(25, 6, 8, BR);
      c.rect(22, 4, 28, 5, u ? hex('#5f9a6a') : GRN);
      c.row(4, 23, 27, u ? hex('#8fc08a') : L(GRN));
      if (u) {
        dots(c, C.glow, [23, 6, 27, 6, 22, 7, 28, 7, 24, 7, 26, 8]);
        c.oval(11, b - 1, 14, b, C.paper); // a spoiled sheet on the floor
        c.set(12, b, D(C.paper));
      }
      c.rect(2, 9, 5, 10, C.paper); // copy
      c.row(10, 2, 5, D(C.paper));
    },
    u: [0, 1, 0],
    sw: 18, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 11, 16, 12, OAK);
      cabSide(c, 3, 13, 14, b - 1, OAK);
      c.rect(3, b, 14, b, OAKD);
      c.poly([[6, 6], [10, 6], [13, 9], [13, 10], [6, 10]], EB); // the machine, keys towards the right
      c.row(6, 6, 10, hex('#4a444c'));
      dots(c, CREAM, [11, 8, 12, 9]);
      c.rect(5, 5, 8, 5, EB);
      c.line(7, 4, 6, u ? 0 : 2, C.paper);
      c.line(8, 4, 7, u ? 0 : 2, D(C.paper));
      c.rect(2, 9, 4, 10, BR);
      c.col(3, 6, 8, BR);
      c.rect(1, 4, 5, 5, u ? hex('#5f9a6a') : GRN);
      c.row(4, 2, 4, u ? hex('#8fc08a') : L(GRN));
      if (u) {
        dots(c, C.glow, [2, 6, 4, 6, 1, 7, 5, 7]);
        c.rect(15, 18, 18, b, L(OAK)); // the drawer out
        c.row(17, 15, 18, mix(OAK, 0.36));
        c.set(16, 16, AMBER);
        c.set(16, 15, C.parchment);
        c.set(18, 20, BR);
      } else c.set(14, 15, BR), c.set(14, 19, BR);
    },
    su: [0, 1, 3],
  });
  add('twenties-filing-cabinet-oak', 'filing cabinet oak four drawers office records files brass label holders archive', {
    w: 14, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 12, 2, L(OAK));
      face(c, 2, 3, 11, b - 1, OAK);
      for (let i = 0; i < 4; i++) {
        const y = 4 + i * 6.5;
        const y0 = Math.round(y);
        if (u && i === 1) {
          hollow(c, 3, y0, 10, y0 + 1, OAK); // pulled out: the folders, one of them missing
          dots(c, hex('#b9a66a'), [3, y0 + 1, 4, y0 + 1, 5, y0, 6, y0 + 1, 9, y0 + 1, 10, y0]);
          c.rect(2, y0 + 2, 11, y0 + 6, L(OAK));
          c.row(y0 + 6, 2, 11, OAK);
          c.rect(5, y0 + 3, 8, y0 + 3, CREAM);
          c.rect(6, y0 + 5, 7, y0 + 5, BR);
          continue;
        }
        c.rect(3, y0, 10, y0 + 4, OAK);
        c.row(y0, 3, 10, L(OAK));
        c.row(y0 + 4, 3, 10, D(OAK));
        c.rect(5, y0 + 1, 8, y0 + 1, CREAM); // label
        c.rect(6, y0 + 3, 7, y0 + 3, BR);
      }
      c.rect(2, b, 11, b, OAKD);
      if (u) {
        sheet(c, 4, 0, 9, 1, C.paper); // a folder left on top
        c.row(2, 3, 10, hex('#b9a66a'));
      }
    },
    u: [0, 2, 0],
    sw: 14, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 12, 2, L(OAK));
      cabSide(c, 2, 3, 11, b - 1, OAK);
      c.rect(2, b, 11, b, OAKD);
      for (let i = 0; i < 4; i++) {
        const y0 = Math.round(4 + i * 6.5);
        if (u && i === 1) {
          c.rect(12, y0, 18, y0 + 4, L(OAK));
          c.row(y0 + 4, 12, 18, OAK);
          c.col(18, y0, y0 + 4, OAK);
          c.row(y0 - 1, 12, 17, hex('#b9a66a'));
          dots(c, mix(OAK, 0.36), [13, y0 - 1, 15, y0 - 1]);
          c.set(19, y0 + 2, BR);
        } else c.set(12, y0 + 3, BR);
      }
      if (u) c.row(2, 3, 9, hex('#b9a66a'));
    },
    su: [0, 0, 7],
  });
  add('twenties-hat-stand-fedoras', 'hat stand coat rack bentwood fedora hats trench coat umbrella hall detective', {
    w: 18, h: 42, solid: false,
    f(c, u) {
      const b = c.h - 2;
      c.rect(8, 5, 9, b - 2, WAL); // the pole
      c.col(8, 5, b - 2, L(WAL));
      c.line(8, b - 3, 3, b, WAL); // feet
      c.line(9, b - 3, 14, b, WAL);
      c.rect(8, b - 1, 9, b, WAL);
      c.frame(5, b - 9, 12, b - 8, BR); // umbrella ring
      c.line(11, b - 14, 11, b - 1, EB); // the umbrella
      c.set(11, b - 15, WAL);
      c.set(12, b - 16, WAL);
      c.line(7, 12, 3, 10, WAL); // hooks
      c.line(10, 12, 14, 10, WAL);
      c.line(7, 16, 4, 15, WAL);
      c.line(10, 16, 13, 15, WAL);
      c.set(3, 9, WAL);
      c.set(14, 9, WAL);
      c.rect(1, 9, 6, 9, hex('#4a3a2c')); // a brown hat on the left hook
      c.rect(2, 7, 5, 8, hex('#5e4a36'));
      c.row(7, 2, 5, hex('#7a624a'));
      c.row(8, 2, 5, EB);
      if (!u) {
        c.rect(4, 4, 13, 4, FELTHAT); // the grey fedora on top
        c.rect(6, 1, 11, 3, FELTHAT);
        c.row(1, 7, 10, L(FELTHAT));
        c.set(8, 1, D(FELTHAT));
        c.row(3, 6, 11, EB);
        c.poly([[11, 10], [15, 10], [16, 28], [10, 28]], TRENCH); // the trench coat
        c.line(11, 10, 10, 28, L(TRENCH));
        c.col(13, 12, 28, D(TRENCH));
        c.row(18, 10, 16, D(TRENCH));
        c.set(14, 18, BR);
        c.poly([[15, 11], [16, 12], [16, 22], [15, 22]], D(TRENCH));
      } else {
        c.rect(7, 3, 10, 4, WAL); // coat and hat gone: whoever it was has left
        c.set(8, 2, WAL);
        c.set(9, 2, L(WAL));
        c.rect(1, b - 1, 5, b, FELTHAT); // no: the grey hat lies by the feet
        c.rect(2, b - 3, 4, b - 2, FELTHAT);
        c.row(b - 1, 2, 4, EB);
      }
    },
  });
  add('twenties-steamer-trunk-labels', 'steamer trunk travel luggage cabin trunk hotel labels brass corners wooden slats voyage', {
    w: 30, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2,
        CAN = hex('#3f4a40');
      if (u) {
        c.rect(2, -6, 27, 4, mix(CAN, 0.9)); // the lid thrown back
        c.rect(3, -5, 26, 3, hex('#9a8f72')); // its paper lining
        for (let x = 5; x <= 25; x += 3) c.col(x, -5, 3, hex('#857a5e'));
        c.rect(2, -6, 27, -6, L(CAN));
        dots(c, BR, [2, -6, 27, -6]);
        c.rect(3, 5, 26, 7, DARKIN);
        c.rect(4, 4, 12, 6, C.white); // shirts, and something wrapped in oilcloth
        c.row(6, 4, 12, D(C.white));
        c.rect(14, 3, 20, 6, hex('#4a5a50'));
        c.row(3, 15, 19, hex('#6a7a6a'));
        c.line(15, 4, 19, 5, C.straw);
        c.rect(22, 5, 25, 6, H.P.VELVET);
      } else {
        c.rect(3, 3, 26, 4, CAN);
        c.row(3, 4, 25, L(CAN));
      }
      face(c, 2, 5, 27, b, CAN);
      c.row(8, 2, 27, D(CAN)); // where the lid meets
      if (u) c.rect(2, 5, 27, 7, DARKIN), c.rect(4, 5, 12, 6, C.white), c.rect(14, 5, 20, 6, hex('#4a5a50')), c.rect(22, 6, 25, 7, H.P.VELVET), c.row(8, 2, 27, L(CAN));
      for (const x of [8, 21]) {
        c.rect(x, u ? 8 : 3, x + 1, b, OAK); // slats
        c.col(x, u ? 8 : 3, b, L(OAK));
      }
      c.rect(2, b - 1, 27, b, OAKD);
      for (const [x, y] of [[2, 5], [27, 5], [2, b], [27, b]]) c.set(x, y, BR);
      if (!u) dots(c, BR, [2, 3, 27, 3]);
      c.rect(14, 8, 15, 10, BR); // lock
      c.set(14, 9, K);
      dots(c, BR, [5, 9, 24, 9]);
      c.rect(11, 12, 15, 14, CREAM); // labels
      c.row(13, 12, 14, C.red);
      c.oval(17, 11, 20, 14, hex('#b9a25a'));
      c.set(18, 12, INK);
      c.rect(23, 12, 25, 15, hex('#6f8a90'));
      c.rect(4, 12, 6, 13, CREAM);
    },
    u: [0, 7, 0],
    sw: 18, sh: 20,
    s(c, u) {
      const b = c.h - 2,
        CAN = hex('#3f4a40');
      if (u) {
        c.rect(1, -6, 3, 5, mix(CAN, 0.9)); // the lid standing up behind
        c.col(3, -5, 4, hex('#9a8f72'));
        c.set(1, -6, BR);
        c.rect(4, 4, 13, 4, C.white);
        c.rect(8, 3, 11, 3, hex('#4a5a50'));
      } else {
        c.rect(3, 3, 14, 4, CAN);
        c.row(3, 4, 13, L(CAN));
      }
      face(c, 2, 5, 15, b, CAN);
      c.row(8, 2, 15, u ? L(CAN) : D(CAN));
      if (u) c.rect(2, 5, 15, 7, DARKIN), c.rect(4, 5, 13, 6, C.white), c.rect(8, 5, 11, 5, hex('#4a5a50'));
      c.rect(2, b - 1, 15, b, OAKD);
      c.rect(6, 11, 11, 12, LEATH); // the handle
      c.row(10, 7, 10, LEATH);
      dots(c, BR, [5, 11, 12, 11]);
      for (const [x, y] of [[2, 5], [15, 5], [2, b], [15, b]]) c.set(x, y, BR);
    },
    su: [0, 7, 0],
  });
  add('twenties-art-deco-floor-lamp', 'art deco floor lamp torchiere uplighter frosted glass shade chrome stepped base standard lamp', {
    w: 14, h: 40, solid: false,
    f(c, u) {
      const b = c.h - 2,
        G = u ? C.glow : hex('#b9b6a4');
      c.poly([[2, 3], [11, 3], [9, 8], [4, 8]], G); // the glass bowl
      c.row(3, 2, 11, u ? C.white : L(G));
      c.line(4, 4, 5, 7, u ? C.flameLight : D(G));
      c.line(9, 4, 8, 7, u ? C.flameLight : D(G));
      c.set(6, 5, u ? C.white : G);
      c.rect(5, 9, 8, 9, NICK);
      c.rect(6, 10, 7, b - 5, NICK); // stem
      c.col(6, 10, b - 5, L(NICK));
      c.rect(5, 19, 8, 20, EB); // bakelite collar
      c.rect(5, b - 4, 8, b - 4, EB);
      c.rect(4, b - 3, 9, b - 2, NICK); // stepped foot
      c.rect(2, b - 1, 11, b, EB);
      c.row(b - 1, 3, 10, hex('#4a444c'));
      c.row(b - 3, 4, 9, L(NICK));
      if (u) dots(c, C.glow, [1, 1, 12, 1, 4, 1, 9, 1, 6, 0, 0, 3, 13, 3, 7, 1]);
    },
  });
};
