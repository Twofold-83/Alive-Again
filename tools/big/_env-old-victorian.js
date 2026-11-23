/* Victorian: a grand, decaying town house. Part of tools/big/env-old.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, tleg, cabSide, hollow, pane, flame, fire, wisp, pot, bottle, cloth, shards } = H;
  const add = H.reg('env-victorian', 'Victorian');
  const MAH = hex('#5e2f24'),
    WAL = hex('#59402e'),
    EB = hex('#2b242a'),
    OX = hex('#6e2622'),
    GREEN = hex('#33503f'),
    VELVET = hex('#5a2436'),
    GILT = C.gold,
    BR = C.brass,
    MARB = hex('#b4aea0'),
    SILVER = hex('#a3a6ad'),
    CHINA = hex('#d6d2c4'),
    LACE = C.white,
    TEA = hex('#6a3f22'),
    ROSE = hex('#8a5560'),
    GLOW = C.glow;

  /* ---------- seats ---------- */
  add('chesterfield-sofa-oxblood', 'chesterfield sofa oxblood red leather buttoned couch settee', {
    w: 40, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2, w = c.w;
      c.rect(5, 3, w - 6, 10, OX); // buttoned back
      c.row(2, 6, w - 7, L(OX));
      for (let y = 4; y < 10; y += 2) for (let x = 7 + (y % 4 ? 2 : 0); x < w - 7; x += 4) c.set(x, y, D(OX));
      c.rect(6, 10, w - 7, 13, OX); // seat cushions
      c.row(10, 6, w - 7, L(OX));
      c.col(15, 10, 13, D(OX));
      c.col(24, 10, 13, D(OX));
      c.rect(5, 14, w - 6, 15, D(OX)); // rail
      c.row(14, 5, w - 6, mix(OX, 0.5));
      for (let x = 7; x < w - 6; x += 3) c.set(x, 15, BR); // studs
      for (const x of [1, w - 6]) {
        c.rect(x, 3, x + 4, 15, OX); // rolled arms
        c.row(2, x + 1, x + 3, L(OX));
        c.row(3, x, x + 4, L(OX));
        c.rect(x + 1, 4, x + 3, 6, D(OX));
        c.set(x + 2, 5, OX);
        c.col(x + 4, 7, 15, D(OX));
        c.set(x + 2, 9, BR);
        c.set(x + 2, 12, BR);
      }
      c.col(1, 4, 15, L(OX));
      legs(c, [2, w - 4], 16, b, EB);
      if (u) {
        hollow(c, 16, 10, 23, 13, hex('#b9ad8a')); // a seat cushion pulled off: the webbing shows
        dots(c, C.parchment, [18, 12, 21, 11]);
        c.set(20, 12, GILT);
        c.poly([[14, 13], [24, 12], [25, b], [15, b]], OX); // the cushion on the floor against the rail
        c.line(14, 13, 24, 12, L(OX));
        c.col(25, 13, b, D(OX));
        c.set(19, 15, D(OX));
      }
    },
    sw: 17, sh: 19,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 13, 15, OX);
      c.row(2, 3, 12, L(OX));
      c.col(2, 3, 15, L(OX));
      c.rect(2, 3, 13, 7, OX); // the arm roll, its scroll at the front
      c.row(8, 3, 13, D(OX));
      c.oval(9, 2, 14, 8, OX);
      c.oval(10, 3, 13, 7, D(OX));
      c.rect(11, 4, 12, 5, OX);
      c.set(11, 5, BR);
      for (let x = 4; x < 9; x += 3) c.set(x, 5, D(OX));
      for (let x = 4; x < 13; x += 3) c.set(x, 11, BR);
      c.rect(14, 10, 14, 13, u ? hex('#4a4334') : OX); // the cushion's edge
      c.rect(3, 14, 13, 15, D(OX));
      legs(c, [2, 12], 16, b, EB);
      if (u) {
        c.poly([[15, 14], [18, 9], [20, 10], [17, b]], OX); // the cushion on end before the sofa
        c.line(15, 14, 18, 9, L(OX));
        c.rect(15, b - 1, 17, b, OX);
        c.line(20, 10, 18, b, D(OX));
      }
    },
    su: [0, 0, 5],
  });
  add('wing-chair-green', 'wing chair bottle green velvet high back armchair antimacassar', {
    w: 18, h: 27, solid: true,
    f(c, u) {
      const b = c.h - 2, w = c.w;
      c.rect(4, 3, w - 5, 15, GREEN); // back
      c.row(2, 5, w - 6, L(GREEN));
      for (let y = 8; y < 15; y += 3) for (let x = 6 + (y % 2) * 2; x < w - 5; x += 4) c.set(x, y, D(GREEN));
      for (const x of [2, w - 5]) {
        c.rect(x, 4, x + 2, 14, GREEN); // wings
        c.set(x + 1, 3, GREEN);
      }
      c.col(2, 4, 14, L(GREEN));
      c.col(4, 5, 14, D(GREEN));
      c.col(w - 5, 5, 14, D(GREEN));
      c.rect(5, 15, w - 6, 18, GREEN); // seat
      c.row(15, 5, w - 6, L(GREEN));
      for (const x of [1, w - 5]) {
        c.rect(x, 13, x + 3, b - 2, GREEN); // arms
        c.row(13, x, x + 3, L(GREEN));
        c.row(15, x, x + 3, D(GREEN));
      }
      c.col(1, 14, b - 2, L(GREEN));
      c.rect(5, 19, w - 6, b - 2, D(GREEN));
      for (let x = 5; x < w - 5; x += 2) c.set(x, b - 2, C.mustard); // fringe
      legs(c, [2, w - 4], b - 1, b, MAH);
      if (!u) {
        c.rect(6, 3, w - 7, 6, LACE); // antimacassar
        dots(c, D(LACE), [7, 6, 9, 6, 11, 6, 8, 4, 10, 5]);
      } else {
        c.poly([[9, 3], [w - 5, 3], [w - 4, 9], [10, 6]], LACE); // slipped
        dots(c, D(LACE), [11, 5, 13, 6, 13, 4]);
        c.rect(w - 6, 11, w - 2, 12, C.paper); // an open book left on the arm
        c.row(13, w - 6, w - 2, C.wine);
        c.set(w - 4, 11, D(C.paper));
        c.rect(7, 16, 10, 17, mix(GREEN, 0.55)); // the dent in the seat
      }
    },
    sw: 17, sh: 27,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 3], [5, 2], [6, 16], [3, 16]], GREEN); // the back, leaning
      c.col(2, 3, 16, L(GREEN));
      c.poly([[5, 4], [9, 5], [10, 9], [8, 13], [5, 13]], GREEN); // wing
      c.line(9, 5, 10, 9, D(GREEN));
      c.line(10, 9, 8, 13, D(GREEN));
      c.rect(3, 13, 13, 15, GREEN); // arm
      c.row(13, 4, 13, L(GREEN));
      c.row(15, 3, 12, D(GREEN));
      c.set(13, 14, D(GREEN));
      c.rect(3, 16, 13, b - 2, GREEN);
      c.col(3, 16, b - 2, L(GREEN));
      c.rect(13, 16, 14, 18, GREEN); // seat front
      c.row(16, 13, 14, L(GREEN));
      for (let x = 3; x < 14; x += 2) c.set(x, b - 2, C.mustard);
      legs(c, [3, 12], b - 1, b, MAH);
      if (!u) {
        c.rect(2, 2, 5, 5, LACE);
        dots(c, D(LACE), [3, 4, 5, 5]);
      } else {
        c.poly([[1, 4], [4, 2], [5, 3], [3, 9], [1, 9]], LACE); // slipping down the back
        c.set(2, 7, D(LACE));
        c.rect(7, 11, 12, 12, C.paper);
        c.row(12, 7, 12, C.wine);
        c.set(9, 11, D(C.paper));
      }
    },
  });

  /* ---------- music ---------- */
  add('harmonium-reed-organ', 'harmonium reed organ pump organ parlour keyboard pedals music', {
    w: 28, h: 31, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 3, 25, 11, MAH); // the top with its fretwork
      c.rect(1, 2, 26, 2, L(MAH));
      c.rect(5, 5, 22, 9, VELVET);
      for (let x = 5; x <= 22; x++) for (let y = 5; y <= 9; y++) if ((x + y) % 3 === 0 || (x - y + 30) % 5 === 0) c.set(x, y, D(MAH));
      c.set(3, 7, BR);
      c.set(24, 7, BR);
      board(c, 1, 12, 26, 13, MAH); // key shelf
      face(c, 2, 14, 25, b, MAH);
      panel(c, 4, 16, 11, b - 6, MAH);
      panel(c, 16, 16, 23, b - 6, MAH);
      c.set(13, 18, BR); // knee swells
      c.set(14, 18, BR);
      hollow(c, 6, b - 4, 21, b, MAH);
      for (const x of [8, 15]) {
        c.rect(x, b - 3, x + 4, b, hex('#6b5a3c')); // carpet treadles
        c.row(b - 3, x, x + 4, hex('#8a7448'));
        c.set(x + 2, b - 1, C.wine);
      }
      if (u) {
        c.rect(3, 10, 24, 11, EB); // the fall is up: stops and keys
        for (let x = 4; x <= 23; x += 2) c.set(x, 10, C.bone);
        c.row(12, 2, 25, C.white);
        for (let x = 3; x <= 24; x += 2) c.set(x, 12, x % 6 === 1 ? C.white : K);
        c.row(13, 2, 25, D(C.bone));
        c.rect(9, 4, 18, 9, C.paper); // music
        c.col(13, 4, 9, D(C.paper));
        for (let y = 5; y < 9; y += 2) {
          c.row(y, 10, 12, C.slate);
          c.row(y, 15, 17, C.slate);
        }
        c.rect(15, b - 2, 19, b, hex('#6b5a3c')); // a treadle down
        c.clearRect(15, b - 3, 19, b - 3);
        c.row(b - 3, 15, 19, mix(MAH, 0.36));
      }
    },
    sw: 14, sh: 31,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, 3, 8, 11, MAH);
      c.rect(1, 2, 9, 2, L(MAH));
      board(c, 2, 12, 11, 13, MAH);
      cabSide(c, 2, 14, 9, b, MAH);
      c.rect(10, b - 1, 12, b, hex('#6b5a3c')); // treadle
      c.set(10, b - 2, hex('#8a7448'));
      c.set(11, b - 1, hex('#8a7448'));
      if (u) {
        c.row(12, 9, 11, C.white);
        c.set(9, 11, EB);
        c.set(9, 10, C.bone);
        c.line(9, 9, 10, 4, C.paper); // the music, edge on
        c.line(10, 9, 11, 4, D(C.paper));
      }
    },
  });
  add('harp-gilt', 'harp gilt gold concert harp strings music instrument', {
    w: 20, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(14, 4, 15, b - 3, GILT); // the pillar
      c.col(14, 4, b - 3, L(GILT));
      c.rect(13, 2, 16, 4, GILT); // its crown
      c.set(14, 1, GILT);
      c.set(15, 1, D(GILT));
      c.set(12, 3, GILT);
      c.set(17, 3, D(GILT));
      c.line(13, 5, 9, 6, GILT); // the neck, a slow curve
      c.line(9, 6, 5, 4, GILT);
      c.line(5, 4, 2, 6, GILT);
      c.line(13, 6, 9, 7, D(GILT));
      c.line(9, 7, 5, 5, D(GILT));
      c.set(2, 7, GILT);
      c.poly([[2, 7], [4, 7], [12, b - 4], [9, b - 4]], WAL); // sound box
      c.line(2, 8, 9, b - 4, L(WAL));
      c.line(4, 8, 12, b - 5, D(WAL));
      const top = [6, 7, 8, 7];
      for (let i = 0; i < 4; i++) {
        const x = 6 + i * 2,
          yb = 10 + Math.round(((x - 3) * (b - 14)) / 8);
        if (u && (i === 1 || i === 2)) continue;
        c.col(x, top[i], yb, i === 2 ? hex('#a05a4a') : hex('#b8b09a')); // strings
      }
      c.rect(8, b - 3, 17, b - 1, GILT); // the base
      c.row(b - 3, 8, 17, L(GILT));
      c.rect(7, b, 9, b, D(GILT));
      c.rect(16, b, 18, b, D(GILT));
      dots(c, D(GILT), [14, 10, 15, 16, 14, 22, 15, 28]);
      if (u) {
        c.line(8, 8, 7, 13, hex('#b8b09a')); // two strings broken and curled
        c.set(8, 14, hex('#b8b09a'));
        c.line(10, 9, 12, 14, hex('#a05a4a'));
        c.set(11, 15, hex('#a05a4a'));
        c.line(9, b - 8, 10, b - 12, hex('#b8b09a'));
      }
    },
    sw: 10, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 4, 5, b - 3, GILT);
      c.col(4, 4, b - 3, L(GILT));
      c.rect(3, 2, 6, 4, GILT);
      c.set(4, 1, GILT);
      c.set(5, 1, D(GILT));
      c.poly([[3, 8], [6, 8], [7, b - 4], [2, b - 4]], WAL); // the sound box, end on
      c.col(4, 9, b - 5, u ? WAL : C.bone);
      c.col(5, 9, b - 5, D(WAL));
      c.col(2, b - 12, b - 4, L(WAL));
      dots(c, mix(WAL, 0.4), [4, 14, 5, 20, 4, 26]);
      c.rect(2, b - 3, 7, b - 1, GILT);
      c.row(b - 3, 2, 7, L(GILT));
      c.rect(1, b, 2, b, D(GILT));
      c.rect(7, b, 8, b, D(GILT));
      if (u) {
        c.line(6, 7, 8, 12, C.bone);
        c.set(8, 13, C.bone);
        c.line(3, 7, 1, 11, C.red);
      }
    },
  });
  add('music-stand-brass', 'music stand brass sheet music score tripod', {
    w: 12, h: 29,
    f(c, u) {
      const b = c.h - 2;
      c.col(5, 10, b - 2, BR);
      c.col(6, 10, b - 2, D(BR));
      c.line(5, b - 3, 2, b, BR);
      c.line(6, b - 3, 9, b, D(BR));
      c.set(5, b, D(BR));
      c.set(5, 16, GILT);
      c.frame(1, 2, 10, 9, BR); // the lyre desk
      c.row(10, 1, 10, D(BR));
      c.line(3, 3, 5, 8, BR);
      c.line(8, 3, 6, 8, BR);
      if (!u) {
        c.rect(2, 3, 9, 9, C.paper);
        c.col(5, 3, 9, D(C.paper));
        for (let y = 4; y < 9; y += 2) {
          c.row(y, 3, 4, C.slate);
          c.row(y, 7, 8, C.slate);
        }
      } else {
        c.poly([[6, 4], [9, 3], [10, 8], [7, 9]], C.paper); // one sheet left, askew
        c.row(6, 8, 9, C.slate);
        c.rect(1, b - 1, 5, b, C.paper); // the rest on the floor
        c.row(b, 1, 5, D(C.paper));
        c.set(3, b - 1, C.slate);
        c.poly([[7, b - 2], [10, b - 3], [10, b], [8, b]], C.paper);
        c.set(9, b - 1, C.slate);
      }
    },
    sw: 9, sh: 29,
    s(c, u) {
      const b = c.h - 2;
      c.col(3, 9, b - 2, BR);
      c.line(3, b - 3, 1, b, BR);
      c.line(3, b - 3, 6, b, D(BR));
      c.set(3, 16, GILT);
      c.line(2, 2, 4, 9, BR); // the desk, leaning back
      c.row(10, 3, 6, D(BR));
      c.set(6, 9, BR);
      if (!u) c.line(3, 2, 5, 9, C.paper);
      else {
        c.line(4, 5, 5, 9, C.paper);
        c.rect(4, b, 7, b, C.paper);
        c.set(5, b - 1, C.paper);
      }
    },
  });

  /* ---------- desk, mirrors, hall ---------- */
  add('writing-desk-pigeonholes', 'writing desk pigeonholes letters bonheur du jour secretary mahogany', {
    w: 28, h: 29, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 3, 25, 11, MAH); // the gallery of pigeonholes
      c.row(2, 1, 26, L(MAH));
      for (let i = 0; i < 4; i++) {
        const x = 4 + i * 5 + (i > 1 ? 3 : 0);
        hollow(c, x, 4, x + 3, 6, MAH);
        hollow(c, x, 8, x + 3, 10, MAH);
      }
      drawer(c, 13, 4, 15, 6, MAH);
      drawer(c, 13, 8, 15, 10, MAH);
      if (!u) dots(c, C.paper, [4, 6, 5, 6, 5, 5, 10, 10, 11, 10, 17, 6, 18, 6, 18, 5, 22, 10, 23, 9, 23, 10, 4, 10]);
      else dots(c, C.paper, [10, 10, 23, 10]);
      board(c, 1, 12, 26, 13, MAH); // the top, with its leather
      c.row(12, 5, 22, GREEN);
      face(c, 2, 14, 25, 17, MAH);
      drawer(c, 4, 15, 12, 17, MAH);
      if (!u) drawer(c, 15, 15, 23, 17, MAH);
      for (const x of [3, 24]) tleg(c, x, 18, b, MAH);
      c.row(b - 3, 4, 23, D(MAH)); // stretcher
      if (u) {
        hollow(c, 15, 15, 23, 16, MAH); // a drawer pulled out, letters all over the top
        c.rect(15, 17, 23, 20, L(MAH));
        c.row(17, 15, 23, C.paper);
        c.row(20, 15, 23, D(MAH));
        c.set(19, 19, BR);
        c.rect(6, 10, 10, 11, C.paper);
        c.set(8, 10, C.blood); // a seal
        c.poly([[13, 11], [18, 10], [19, 11]], C.parchment);
        c.rect(20, 11, 23, 11, C.paper);
        c.rect(2, b - 1, 5, b, C.paper); // and one on the floor
        c.set(3, b - 1, D(C.paper));
      }
    },
    sw: 14, sh: 29,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, 3, 7, 11, MAH);
      c.row(2, 1, 8, L(MAH));
      board(c, 1, 12, 11, 13, MAH);
      face(c, 2, 14, 10, 17, MAH);
      for (const x of [3, 9]) tleg(c, x, 18, b, MAH);
      c.row(b - 3, 4, 8, D(MAH));
      if (u) {
        c.rect(11, 15, 13, 17, L(MAH)); // the drawer out
        c.row(14, 11, 13, C.paper);
        c.set(14, 16, BR);
        c.rect(8, 11, 10, 11, C.paper);
        c.rect(11, b, 13, b, C.paper);
      }
    },
    su: [0, 0, 3],
  });
  add('pier-mirror-gilt', 'pier mirror tall gilt gold frame looking glass console marble', {
    w: 16, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 13, b - 7, GILT);
      c.col(2, 4, b - 7, L(GILT));
      c.row(4, 2, 13, L(GILT));
      c.rect(5, 2, 10, 3, GILT); // the crest
      c.rect(7, 1, 8, 1, L(GILT));
      dots(c, D(GILT), [6, 3, 9, 3, 3, 6, 12, 6, 3, b - 9, 12, b - 9]);
      pane(c, 4, 6, 11, b - 9, hex('#6f8d95'));
      c.line(5, 14, 8, 8, C.glassLight);
      c.line(6, 22, 10, 13, blend(hex('#6f8d95'), C.glassLight, 0.5));
      board(c, 1, b - 6, 14, b - 5, MARB); // the console under it
      face(c, 2, b - 4, 13, b - 1, MAH);
      c.set(7, b - 3, BR);
      c.set(8, b - 3, BR);
      c.rect(2, b, 3, b, MAH);
      c.rect(12, b, 13, b, MAH);
      if (u) {
        const k = C.night; // cracked from one blow
        c.line(7, 17, 4, 9, k);
        c.line(7, 17, 11, 10, k);
        c.line(7, 17, 11, 23, k);
        c.line(7, 17, 4, 26, k);
        c.line(7, 17, 4, 17, k);
        c.poly([[7, 17], [9, 20], [6, 22]], k);
        dots(c, C.white, [6, 15, 8, 15, 9, 18, 5, 19]);
        dots(c, C.glassLight, [5, b - 7, 9, b - 7, 11, b - 7]);
      }
    },
    sw: 8, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 3, b - 7, GILT);
      c.col(2, 4, b - 7, D(WAL)); // the back board
      c.set(3, 3, GILT);
      c.set(3, 2, L(GILT));
      board(c, 1, b - 6, 6, b - 5, MARB);
      cabSide(c, 2, b - 4, 5, b - 1, MAH, false);
      c.set(2, b, MAH);
      c.set(5, b, MAH);
      if (u) dots(c, C.glassLight, [4, b - 7, 5, b - 7, 6, b, 7, b]);
    },
    su: [0, 0, 1],
  });
  add('hall-stand-mirror', 'hall stand hallstand coat hooks mirror umbrella hat bowler entrance', {
    w: 22, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, 4, 18, b - 11, WAL);
      c.rect(6, 2, 15, 3, WAL); // crest
      c.rect(9, 1, 12, 1, L(WAL));
      c.row(2, 6, 15, L(WAL));
      c.oval(7, 7, 14, 18, D(WAL));
      c.oval(8, 8, 13, 17, hex('#6f8d95'));
      c.line(9, 13, 11, 9, C.glassLight);
      dots(c, BR, [4, 8, 5, 8, 16, 8, 17, 8, 4, 14, 5, 14, 16, 14, 17, 14]); // hooks
      board(c, 2, b - 10, 19, b - 9, MARB);
      face(c, 3, b - 8, 18, b - 5, WAL);
      if (!u) drawer(c, 7, b - 8, 14, b - 5, WAL);
      c.rect(3, b - 4, 4, b, WAL); // legs and the drip tray
      c.rect(17, b - 4, 18, b, WAL);
      c.col(3, b - 4, b, L(WAL));
      c.rect(8, b - 4, 13, b - 2, D(WAL));
      c.row(b - 5, 5, 16, BR); // umbrella rail
      c.rect(4, b - 1, 17, b, C.ironDark);
      c.row(b - 1, 4, 17, C.iron);
      if (!u) {
        c.rect(2, 6, 7, 7, C.black); // bowler on a hook
        c.rect(3, 4, 6, 5, C.black);
        c.row(4, 4, 5, hex('#3a3440'));
        const coat = hex('#4a4038');
        c.poly([[14, 9], [19, 10], [20, 30], [13, 30]], coat); // overcoat
        c.line(16, 10, 16, 29, D(coat));
        c.col(13, 12, 30, L(coat));
        c.set(17, 16, K);
        c.set(17, 20, K);
        c.col(6, 16, b - 1, C.black); // umbrella in the rail
        c.rect(5, 20, 7, b - 4, C.black);
        c.set(6, 15, WAL);
        c.set(7, 14, WAL);
        c.set(8, 15, WAL);
      } else {
        hollow(c, 7, b - 8, 14, b - 6, WAL); // the drawer open, a glove hanging out
        c.rect(7, b - 5, 14, b - 3, L(WAL));
        c.row(b - 3, 7, 14, D(WAL));
        c.set(10, b - 4, BR);
        c.rect(12, b - 6, 13, b - 4, hex('#3d3028'));
        c.set(13, b - 3, hex('#3d3028'));
      }
    },
    sw: 10, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 4, 3, b, WAL);
      c.col(2, 4, b, L(WAL));
      c.set(3, 3, WAL);
      c.set(3, 2, L(WAL));
      dots(c, BR, [4, 8, 4, 14]);
      board(c, 2, b - 10, 8, b - 9, MARB);
      cabSide(c, 2, b - 8, 7, b - 5, WAL, false);
      c.rect(6, b - 4, 7, b, WAL);
      c.rect(2, b - 1, 7, b, C.ironDark);
      c.row(b - 1, 2, 7, C.iron);
      c.set(8, b - 5, BR);
      if (!u) {
        c.rect(4, 6, 7, 7, C.black);
        c.rect(4, 4, 6, 5, C.black);
        const coat = hex('#4a4038');
        c.poly([[4, 9], [7, 10], [8, 30], [4, 30]], coat);
        c.col(4, 10, 30, L(coat));
        c.col(6, 14, 29, D(coat));
        c.col(6, b - 8, b - 1, C.black);
      } else {
        c.rect(8, b - 7, 9, b - 5, L(WAL)); // the drawer out
        c.row(b - 8, 8, 9, hex('#3d3028'));
        c.set(10, b - 6, BR);
      }
    },
    su: [0, 0, 2],
  });

  /* ---------- plants and ornaments ---------- */
  const aspLeaf = (c, x0, y0, x1, y1, col) => {
    c.line(x0, y0, x1, y1, col);
    c.line(x0 + (x1 > x0 ? 1 : -1), y0, x1, y1 + 1, col);
  };
  add('aspidistra-on-stand', 'aspidistra plant jardiniere stand pot leaves cast iron plant parlour', {
    w: 18, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2,
        g = u ? hex('#6d6436') : C.leaf,
        gl = u ? hex('#8a7a40') : C.leafLight,
        jar = hex('#2e4a55');
      board(c, 5, 20, 12, 20, MAH); // the stand
      c.rect(8, 21, 9, b - 3, MAH);
      c.col(8, 21, b - 3, L(MAH));
      c.set(7, 25, MAH);
      c.set(10, 25, D(MAH));
      c.line(8, b - 3, 5, b, MAH);
      c.line(9, b - 3, 12, b, D(MAH));
      c.col(8, b - 2, b, D(MAH));
      c.rect(5, 14, 12, 19, jar); // the jardiniere
      c.row(13, 4, 13, L(jar));
      c.col(5, 14, 19, L(jar));
      c.row(16, 5, 12, GILT);
      c.clear(5, 19);
      c.clear(12, 19);
      if (!u) {
        aspLeaf(c, 8, 12, 2, 4, g);
        aspLeaf(c, 8, 12, 5, 1, gl);
        aspLeaf(c, 9, 12, 10, 1, g);
        aspLeaf(c, 9, 12, 14, 3, gl);
        aspLeaf(c, 9, 12, 16, 8, g);
        aspLeaf(c, 8, 12, 1, 9, gl);
        c.line(9, 12, 8, 4, g);
      } else {
        aspLeaf(c, 8, 12, 2, 9, g); // gone yellow and hanging
        c.line(2, 9, 1, 16, g);
        aspLeaf(c, 9, 12, 15, 8, gl);
        c.line(15, 8, 16, 17, gl);
        aspLeaf(c, 9, 12, 11, 4, g);
        c.line(11, 4, 13, 6, g);
        c.line(8, 12, 6, 5, gl);
        c.line(6, 5, 4, 7, gl);
        c.line(8, 15, 10, 19, K); // the pot cracked
        c.rect(2, b, 4, b, g);
        c.rect(13, b - 1, 15, b, gl);
      }
    },
  });
  add('glass-dome-stuffed-bird', 'glass dome stuffed bird taxidermy bell jar robin branch ornament', {
    w: 14, h: 22,
    f(c, u) {
      const b = c.h - 2,
        gl = hex('#8fa9ad');
      board(c, 1, b - 2, 12, b, EB);
      c.row(b - 2, 1, 12, hex('#4a3e44'));
      if (!u) {
        c.rect(2, 3, 11, b - 3, hex('#3f5258')); // the air under the glass
        c.rect(3, 2, 10, 2, hex('#3f5258'));
      }
      c.line(4, b - 3, 6, 10, hex('#5c4a34')); // the branch
      c.line(6, 12, 9, 9, hex('#5c4a34'));
      c.set(4, 13, C.moss);
      c.set(9, b - 3, C.moss);
      c.set(8, b - 3, C.moss);
      if (!u) {
        c.rect(6, 6, 9, 8, hex('#5a4a3a')); // the bird in profile
        c.rect(7, 7, 9, 8, C.red);
        c.rect(8, 4, 10, 5, hex('#5a4a3a'));
        c.set(11, 5, C.mustard);
        c.set(9, 4, K);
        c.line(5, 7, 3, 9, hex('#4a3c30'));
        c.set(8, 9, C.mustard);
        for (let y = 3; y <= b - 3; y++) {
          c.set(2, y, gl); // the dome
          c.set(11, y, D(gl));
        }
        c.row(1, 4, 9, gl);
        c.set(3, 2, gl);
        c.set(10, 2, D(gl));
        c.col(4, 4, 9, C.glassLight);
        c.set(5, 3, C.glassLight);
      } else {
        c.set(2, b - 3, gl); // the dome smashed, the bird gone
        c.set(2, b - 4, gl);
        c.set(3, b - 5, gl);
        c.set(11, b - 3, D(gl));
        c.set(11, b - 4, D(gl));
        c.set(11, b - 5, gl);
        c.set(10, b - 6, gl);
        dots(c, C.glassLight, [4, b - 3, 7, b - 3, 0, b, 13, b, 10, b - 3]);
        dots(c, hex('#5a4a3a'), [7, 9, 9, 8]); // a feather or two
        c.set(8, 11, C.red);
      }
    },
    sw: 14, sh: 22,
    s(c, u) {
      const b = c.h - 2,
        gl = hex('#8fa9ad');
      board(c, 1, b - 2, 12, b, EB);
      c.row(b - 2, 1, 12, hex('#4a3e44'));
      if (!u) {
        c.rect(2, 3, 11, b - 3, hex('#3f5258'));
        c.rect(3, 2, 10, 2, hex('#3f5258'));
      }
      c.col(6, 10, b - 3, hex('#5c4a34'));
      c.line(6, 12, 8, 10, hex('#5c4a34'));
      c.set(5, b - 3, C.moss);
      if (!u) {
        c.rect(5, 6, 8, 8, C.red); // the bird, facing us
        c.col(5, 6, 8, hex('#5a4a3a'));
        c.col(8, 6, 8, hex('#5a4a3a'));
        c.rect(6, 4, 7, 5, hex('#5a4a3a'));
        c.set(6, 4, K);
        c.set(7, 4, K);
        c.set(6, 5, C.mustard);
        c.set(6, 9, C.mustard);
        for (let y = 3; y <= b - 3; y++) {
          c.set(2, y, gl);
          c.set(11, y, D(gl));
        }
        c.row(1, 4, 9, gl);
        c.set(3, 2, gl);
        c.set(10, 2, D(gl));
        c.col(4, 4, 9, C.glassLight);
      } else {
        c.set(2, b - 3, gl);
        c.set(2, b - 4, gl);
        c.set(3, b - 5, gl);
        c.set(11, b - 3, D(gl));
        c.set(11, b - 4, gl);
        dots(c, C.glassLight, [4, b - 3, 8, b - 3, 0, b, 13, b]);
        c.set(7, 9, hex('#5a4a3a'));
        c.set(6, 11, C.red);
      }
    },
  });

  /* ---------- light ---------- */
  add('oil-lamp-brass-globe', 'oil lamp brass paraffin lamp glass globe chimney table lamp light', {
    w: 11, h: 18,
    f(c, u) {
      const b = c.h - 2,
        milk = u ? GLOW : hex('#a9b4ae');
      c.rect(3, b, 7, b, D(BR));
      c.rect(4, b - 1, 6, b - 1, BR);
      c.oval(2, b - 6, 8, b - 2, BR); // the font
      c.row(b - 5, 4, 5, L(BR));
      c.set(3, b - 4, L(BR));
      c.rect(4, b - 8, 6, b - 7, D(BR)); // burner
      c.set(8, b - 7, BR); // wick wheel
      c.oval(1, b - 14, 9, b - 8, milk);
      c.rect(4, b - 15, 6, b - 15, D(milk));
      c.rect(4, 1, 6, b - 13, u ? C.flameLight : C.glassLight); // chimney
      c.col(6, 1, b - 13, u ? C.flame : C.glass);
      if (u) {
        c.rect(4, b - 12, 6, b - 10, C.flameLight);
        c.set(5, b - 10, C.flame);
        c.set(5, b - 13, C.white);
        c.set(2, b - 11, C.white);
      } else c.set(3, b - 12, C.white);
    },
  });
  add('gas-wall-lamp', 'gas lamp wall bracket gaslight etched glass shade brass sconce', {
    w: 12, h: 16,
    f(c, u) {
      const sh = u ? GLOW : hex('#a9b4ae');
      c.oval(4, 9, 7, 13, BR); // the rose on the wall
      c.set(5, 10, L(BR));
      c.col(5, 14, 14, D(BR));
      c.rect(5, 7, 6, 8, BR);
      c.row(11, 3, 8, D(BR)); // the tap
      c.poly([[1, 2], [10, 2], [8, 6], [3, 6]], sh); // shade, open upwards
      c.row(2, 1, 10, u ? C.white : L(sh));
      dots(c, D(sh), [3, 4, 5, 4, 7, 4, 4, 5, 6, 5]);
      if (u) {
        c.rect(5, 1, 6, 2, C.flameLight);
        c.set(5, 0, C.flame);
        c.set(6, 1, C.flame);
        dots(c, C.white, [4, 3, 6, 3]);
      }
    },
    sw: 12, sh: 16,
    s(c, u) {
      const sh = u ? GLOW : hex('#a9b4ae');
      c.rect(1, 8, 2, 13, BR); // the rose, edge on
      c.col(1, 8, 13, L(BR));
      c.row(11, 3, 7, BR); // the arm
      c.row(12, 3, 6, D(BR));
      c.col(7, 7, 11, BR);
      c.set(5, 13, D(BR));
      c.set(5, 10, BR); // tap
      c.poly([[3, 2], [11, 2], [9, 6], [5, 6]], sh);
      c.row(2, 3, 11, u ? C.white : L(sh));
      dots(c, D(sh), [5, 4, 7, 4, 9, 4, 6, 5, 8, 5]);
      if (u) {
        c.rect(7, 1, 7, 2, C.flameLight);
        c.set(7, 0, C.flame);
        dots(c, C.white, [6, 3, 8, 3]);
      }
    },
  });

  /* ---------- tea ---------- */
  const teapot = (c, x, yb, col) => {
    c.rect(x + 1, yb - 3, x + 4, yb, col);
    c.row(yb - 4, x + 2, x + 3, col);
    c.set(x + 2, yb - 5, D(col));
    c.set(x, yb - 2, col); // spout
    c.set(x - 1, yb - 3, col);
    c.set(x + 5, yb - 3, D(col)); // handle
    c.set(x + 6, yb - 2, D(col));
    c.set(x + 5, yb - 1, D(col));
    c.col(x + 1, yb - 3, yb, L(col));
  };
  const cup = (c, x, yb, full) => {
    c.rect(x, yb - 1, x + 2, yb, CHINA);
    c.row(yb - 1, x, x + 2, full ? TEA : L(CHINA));
    c.set(x + 3, yb - 1, D(CHINA));
    c.row(yb + 1, x - 1, x + 3, D(CHINA));
  };
  add('tea-trolley-brass', 'tea trolley brass cart teapot cups afternoon tea serving wheels', {
    w: 26, h: 23, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [3, 21]) {
        c.col(x, 6, b - 2, BR);
        c.set(x, 5, GILT);
      }
      c.line(21, 6, 24, 4, BR); // handle
      c.set(24, 3, GILT);
      board(c, 2, 10, 22, 11, MAH);
      board(c, 2, 16, 22, 17, MAH);
      c.row(9, 3, 21, BR); // gallery rail
      H.wheel(c, 5, b - 2, 2, BR);
      H.wheel(c, 19, b - 2, 2, BR);
      teapot(c, 6, 9, SILVER);
      c.rect(13, 8, 14, 9, SILVER); // sugar
      c.set(13, 7, D(SILVER));
      cup(c, 16, 8, u);
      c.rect(5, 15, 11, 15, CHINA); // a cake on the lower shelf
      c.rect(6, 12, 10, 14, hex('#8a5a3a'));
      c.row(12, 6, 10, hex('#c9b6a0'));
      c.rect(14, 14, 19, 15, CHINA);
      c.row(13, 15, 18, CHINA);
      if (u) {
        c.clearRect(9, 12, 10, 14); // a slice gone
        c.set(9, 14, hex('#c9b6a0'));
        c.set(12, 15, hex('#8a5a3a'));
        wisp(c, 17, 6, 3, C.ghost);
        c.row(9, 10, 12, TEA); // spilt
        c.set(11, 12, TEA);
        c.set(11, 14, TEA);
        c.set(4, 9, CHINA);
      } else cup(c, 2, 8, false);
    },
    sw: 14, sh: 23,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [2, 11]) {
        c.col(x, 6, b - 2, BR);
        c.set(x, 5, GILT);
      }
      c.row(4, 2, 11, BR); // handle bar
      c.set(2, 4, GILT);
      c.set(11, 4, GILT);
      board(c, 1, 10, 12, 11, MAH);
      board(c, 1, 16, 12, 17, MAH);
      c.row(9, 2, 11, BR);
      c.rect(2, b - 3, 3, b, BR);
      c.rect(10, b - 3, 11, b, BR);
      c.rect(5, 6, 8, 9, SILVER); // the pot, end on
      c.row(5, 6, 7, SILVER);
      c.set(6, 4, D(SILVER));
      c.col(5, 6, 9, L(SILVER));
      c.rect(4, 15, 9, 15, CHINA);
      c.rect(5, 12, 8, 14, hex('#8a5a3a'));
      c.row(12, 5, 8, hex('#c9b6a0'));
      if (u) {
        c.clearRect(7, 12, 8, 14);
        c.set(7, 14, hex('#c9b6a0'));
        wisp(c, 10, 6, 3, C.ghost);
        c.set(10, 9, CHINA);
        c.set(4, 12, TEA);
        c.set(4, 14, TEA);
      }
    },
  });
  add('cake-stand-three-tier', 'cake stand three tier china cakes scones afternoon tea plates', {
    w: 14, h: 20,
    f(c, u) {
      const b = c.h - 2;
      c.col(6, 3, b - 1, BR);
      c.col(7, 3, b - 1, D(BR));
      c.frame(5, 1, 8, 3, BR); // ring handle
      c.clear(6, 2);
      c.clear(7, 2);
      const tiers = [[4, 9, 7], [3, 10, 12], [1, 12, b - 1]];
      for (const [x0, x1, y] of tiers) {
        c.row(y, x0, x1, CHINA);
        c.row(y + 1, x0 + 1, x1 - 1, D(CHINA));
        c.set(x0, y, L(CHINA));
      }
      c.rect(5, b, 8, b, D(CHINA));
      const cakes = u
        ? [[10, 11, hex('#8a5a3a')]]
        : [[4, 6, ROSE], [8, 6, hex('#c9b6a0')], [3, 11, hex('#8a5a3a')], [8, 11, ROSE], [10, 11, hex('#c9b6a0')], [2, b - 2, hex('#c9b6a0')], [4, b - 2, ROSE], [8, b - 2, hex('#8a5a3a')], [11, b - 2, hex('#c9b6a0')]];
      for (const [x, y, col] of cakes) {
        c.rect(x, y - 1, x + 1, y, col);
        c.set(x, y - 1, L(col));
      }
      if (!u) c.set(4, 4, C.red), c.set(11, b - 4, C.red);
      else dots(c, hex('#c9b6a0'), [4, 6, 3, 11, 8, b - 2, 2, b - 2, 5, b - 2, 9, 6, 0, b, 12, b]), c.set(4, b - 2, ROSE);
    },
  });
};
