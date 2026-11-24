/* The nineteen-twenties, part c: the museum and the professor's study, the detective's office, the bootleggers'
 * cellar, the bank and the hotel. Part of tools/big/env2-twenties.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, pane, flame, fire, wisp, bottle, bricks, type, sheet, deco, crate, rod, doorOut, shards, blood } = H;
  const add = H.reg('env-twenties', "1920's");
  const { OAK, OAKD, MAH, WAL, EB, NICK, BR, GILT, GRN, OX, CREAM, NAVY, GLASSD, MARB, VERD, AMBER, LIT, INK, NEWS, VELVET } = H.P;
  const DARKIN = hex('#17151c');
  const CASEG = hex('#4f6a70'),
    TERRA = hex('#8a4f36'),
    OCHRE = hex('#a8873a'),
    CORK = hex('#9a7a4e'),
    COPPER = hex('#a8623a'),
    STEELD = hex('#5a5e68'),
    STEELV = hex('#878c96'),
    BRONZE = hex('#6a5a34');

  /* ---------- the museum ---------- */
  const smallIdol = (c, x, yb) => {
    c.rect(x, yb - 4, x + 3, yb, VERD);
    c.rect(x + 1, yb - 6, x + 2, yb - 5, VERD);
    c.col(x, yb - 4, yb, L(VERD));
    c.set(x + 1, yb - 3, D(VERD));
    c.set(x + 2, yb - 3, D(VERD));
    c.set(x + 1, yb - 5, K);
  };
  add('twenties-museum-display-case', 'museum display case glass vitrine exhibit antiquities idol pottery dagger mahogany showcase', {
    w: 28, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 25, 21, MAH);
      c.rect(3, 4, 24, 20, u ? hex('#2c3338') : CASEG);
      c.row(3, 2, 25, L(MAH));
      c.rect(3, 19, 24, 20, VELVET); // the floor of the case
      c.rect(5, 14, 8, 18, TERRA); // a pot
      c.row(13, 6, 7, TERRA);
      c.row(15, 5, 8, hex('#b98a5a'));
      c.col(5, 14, 18, L(TERRA));
      if (!u) smallIdol(c, 12, 18);
      else {
        c.rect(12, 18, 15, 18, mix(VELVET, 0.6)); // where the idol stood
      }
      c.line(18, 17, 22, 15, NICK); // a dagger on a stand
      c.set(18, 18, BR);
      c.set(17, 17, BR);
      for (const x of [5, 12, 19]) c.rect(x, 20, x + 2, 20, CREAM); // labels
      if (!u) {
        for (let i = 0; i < 6; i++) c.set(5 + i, 11 - i, C.glassLight);
        for (let i = 0; i < 4; i++) c.set(17 + i, 9 - i, C.glassLight);
        c.col(14, 4, 20, blend(CASEG, MAH, 0.5));
      } else {
        for (let i = 0; i < 3; i++) c.set(4 + i, 8 - i, C.glassLight); // what glass is left in the frame
        c.poly([[19, 4], [24, 4], [24, 12], [21, 9]], CASEG);
        c.line(19, 4, 21, 9, C.glassLight);
        c.line(21, 9, 24, 12, C.glassLight);
        c.poly([[3, 20], [3, 13], [6, 17]], CASEG);
        c.line(3, 13, 6, 17, C.glassLight);
        shards(c, 4, 24, b, C.glassLight, 4);
        shards(c, 8, 18, 21, C.glassLight, 9);
      }
      board(c, 1, 22, 26, 23, MAH);
      face(c, 2, 24, 25, b - 1, MAH);
      panel(c, 4, 25, 12, b - 2, MAH);
      panel(c, 15, 25, 23, b - 2, MAH);
      c.rect(2, b, 25, b, mix(MAH, 0.7));
      if (u) shards(c, 4, 24, b, C.glassLight, 4);
    },
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 11, 21, MAH);
      c.rect(3, 4, 10, 20, u ? hex('#2c3338') : CASEG);
      c.row(3, 2, 11, L(MAH));
      c.rect(3, 19, 10, 20, VELVET);
      if (!u) {
        smallIdol(c, 5, 18);
        for (let i = 0; i < 5; i++) c.set(4 + i, 11 - i, C.glassLight);
      } else {
        c.poly([[3, 4], [7, 4], [3, 10]], CASEG);
        c.line(7, 4, 3, 10, C.glassLight);
        shards(c, 3, 10, 21, C.glassLight, 9);
      }
      board(c, 1, 22, 12, 23, MAH);
      cabSide(c, 2, 24, 11, b - 1, MAH);
      c.rect(2, b, 11, b, mix(MAH, 0.7));
      if (u) shards(c, 3, 13, b, C.glassLight, 4);
    },
    su: [0, 0, 2],
  });
  const mummyPaint = (c, x0, y0) => {
    // painted bands of a mummy case whose head is at x0..x0+7, y0
    for (let y = y0 + 1; y <= y0 + 9; y++) {
      c.set(x0 - 1, y, y % 2 ? NAVY : OCHRE);
      c.set(x0 + 8, y, y % 2 ? NAVY : OCHRE);
      c.set(x0, y, y % 2 ? NAVY : L(OCHRE));
      c.set(x0 + 7, y, y % 2 ? NAVY : OCHRE);
    }
    c.rect(x0 + 1, y0 + 2, x0 + 6, y0 + 7, hex('#c9a45a')); // the face
    dots(c, K, [x0 + 2, y0 + 4, x0 + 5, y0 + 4]);
    dots(c, NAVY, [x0 + 1, y0 + 4, x0 + 6, y0 + 4]);
    c.row(y0 + 6, x0 + 3, x0 + 4, TERRA);
    c.col(x0 + 3, y0 + 8, y0 + 10, NAVY); // the beard
    c.col(x0 + 4, y0 + 8, y0 + 10, NAVY);
  };
  add('twenties-mummy-case-upright', 'mummy case sarcophagus egyptian coffin painted gold standing museum expedition pharaoh', {
    w: 18, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      const shape = [[6, 2], [11, 2], [14, 5], [15, 13], [13, b - 2], [4, b - 2], [2, 13], [3, 5]];
      c.rect(3, b - 1, 14, b, hex('#77747a')); // a stone foot
      c.row(b - 1, 3, 14, hex('#9a979a'));
      if (!u) {
        c.poly(shape, OCHRE);
        c.line(3, 5, 2, 13, L(OCHRE));
        c.line(2, 13, 4, b - 2, L(OCHRE));
        mummyPaint(c, 5, 2);
        c.rect(4, 14, 13, 15, NAVY); // collar
        c.row(16, 4, 13, TERRA);
        c.line(5, 19, 12, 22, hex('#c9a45a')); // crossed arms
        c.line(12, 19, 5, 22, hex('#c9a45a'));
        for (let y = 25; y <= b - 4; y += 4) {
          c.row(y, 4, 13, NAVY);
          for (let x = 5; x <= 12; x += 2) c.set(x, y + 2, y % 8 === 1 ? TERRA : INK);
        }
        c.col(13, 14, b - 3, D(OCHRE));
      } else {
        c.poly(shape, mix(OCHRE, 0.75)); // the lid is off: the case is empty
        c.poly([[6, 4], [11, 4], [12, 6], [13, 13], [11, b - 4], [6, b - 4], [4, 13], [5, 6]], DARKIN);
        c.line(4, 13, 6, b - 4, hex('#2c2630'));
        c.line(7, 12, 5, 24, C.bone); // wrappings left behind, trailing out over the edge
        c.line(5, 24, 3, 33, C.bone);
        c.line(3, 33, 1, b, C.bone);
        c.line(9, 20, 10, 30, D(C.bone));
        c.set(10, 31, C.bone);
        dots(c, C.bone, [0, b, 2, b, 7, b, 8, b]);
        c.poly([[16, 8], [19, 5], [21, 8], [22, 16], [21, b], [17, b], [16, 16]], OCHRE); // the lid leaning beside it
        c.line(16, 8, 16, 16, L(OCHRE));
        for (let y = 7; y <= 15; y += 2) c.row(y, 17, 21, NAVY);
        for (let y = 20; y <= b - 3; y += 4) c.row(y, 17, 20, NAVY);
        c.col(21, 16, b, D(OCHRE));
      }
    },
    u: [0, 0, 6],
    sw: 12, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 1, 9, b, hex('#77747a'));
      c.row(b - 1, 2, 9, hex('#9a979a'));
      c.poly([[2, 3], [5, 2], [5, b - 2], [2, b - 2]], mix(OCHRE, 0.75)); // the trough
      c.col(2, 3, b - 2, OCHRE);
      if (!u) {
        c.poly([[5, 2], [8, 3], [9, 7], [8, 12], [9, 16], [8, b - 2], [5, b - 2]], OCHRE); // the lid: face, chest, feet
        c.col(5, 3, b - 2, D(OCHRE));
        for (let y = 3; y <= 11; y += 2) c.row(y, 6, 7, NAVY);
        c.set(9, 8, hex('#c9a45a'));
        c.rect(6, 14, 8, 15, NAVY);
        for (let y = 25; y <= b - 4; y += 4) c.row(y, 6, 8, NAVY);
        c.rect(8, b - 4, 10, b - 2, OCHRE); // the toes
      } else {
        c.col(5, 3, b - 2, DARKIN);
        c.line(5, 12, 7, 24, C.bone);
        c.line(7, 24, 8, b, C.bone);
        dots(c, C.bone, [9, b, 11, b]);
        c.poly([[12, 6], [15, 4], [16, 8], [16, b], [13, b]], OCHRE);
        for (let y = 7; y <= 15; y += 2) c.row(y, 13, 15, NAVY);
        for (let y = 20; y <= b - 3; y += 4) c.row(y, 13, 15, NAVY);
      }
    },
    su: [0, 0, 6],
  });

  /* ---------- the library and the study ---------- */
  add('twenties-library-card-catalogue', 'library card catalogue index cabinet oak small drawers brass pulls archive university', {
    w: 26, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 24, 3, OAK);
      face(c, 2, 4, 23, 24, OAK);
      for (let j = 0; j < 5; j++)
        for (let i = 0; i < 4; i++) {
          const x = 3 + i * 5 + (i > 1 ? 1 : 0),
            y = 5 + j * 4;
          if (u && i === 2 && j === 1) {
            hollow(c, x, y, x + 3, y + 2, OAK); // one drawer taken right out
            continue;
          }
          const out = u && i === 1 && j === 3;
          c.rect(x, y, x + 3, y + 2, out ? L(OAK) : mix(OAK, 1.08));
          c.row(y + 2, x, x + 3, D(OAK));
          c.rect(x + 1, y, x + 2, y, CREAM);
          c.set(x + 1, y + 1, BR);
          c.set(x + 2, y + 1, BR);
          if (out) {
            c.row(y - 1, x, x + 3, CREAM); // the cards showing
            c.set(x + 2, y - 1, D(CREAM));
            c.rect(x, y + 3, x + 3, y + 3, L(OAK));
          }
        }
      board(c, 1, 25, 24, 26, OAK);
      c.rect(3, 27, 22, 28, OAKD);
      legs(c, [3, 21], 29, b, OAKD);
      c.row(b - 2, 5, 20, OAKD);
      if (u) {
        c.rect(14, 0, 19, 1, L(OAK)); // the drawer on top, cards pulled up
        c.rect(15, -1, 18, -1, CREAM);
        c.rect(16, -3, 17, -2, CREAM);
        c.set(19, 1, BR);
        sheet(c, 4, 0, 9, 1, C.paper);
      } else {
        c.rect(4, 1, 8, 1, C.paper);
      }
    },
    u: [0, 3, 0],
    sw: 14, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 12, 3, OAK);
      cabSide(c, 2, 4, 11, 24, OAK);
      board(c, 1, 25, 12, 26, OAK);
      c.rect(3, 27, 10, 28, OAKD);
      legs(c, [3, 9], 29, b, OAKD);
      for (let j = 0; j < 5; j++) c.set(12, 6 + j * 4, BR);
      if (u) {
        c.rect(12, 17, 17, 19, L(OAK));
        c.row(16, 12, 16, CREAM);
        c.row(19, 12, 17, OAK);
        c.set(18, 18, BR);
        c.rect(5, 0, 9, 1, L(OAK));
        c.rect(6, -2, 8, -1, CREAM);
      }
    },
    su: [0, 3, 6],
  });
  add('twenties-professor-rolltop-desk', 'professor roll top desk oak tambour pigeonholes study papers university antiquarian bureau', {
    w: 34, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 30, 3, OAK);
      c.row(2, 4, 29, L(OAK));
      face(c, 2, 4, 31, 14, OAK);
      if (!u) {
        for (let y = 5; y <= 13; y++) c.row(y, 4, 29, y % 2 ? mix(OAK, 0.82) : mix(OAK, 1.1)); // the tambour, shut
        c.rect(15, 12, 18, 13, BR);
        c.set(16, 13, K);
      } else {
        for (let y = 5; y <= 6; y++) c.row(y, 4, 29, y % 2 ? mix(OAK, 0.82) : mix(OAK, 1.1)); // rolled up
        hollow(c, 4, 7, 29, 14, OAK);
        for (let x = 4; x <= 29; x += 5) c.col(x, 7, 11, OAK); // pigeonholes
        c.row(11, 4, 29, OAK);
        dots(c, CREAM, [6, 9, 7, 9, 6, 10, 11, 10, 12, 10, 12, 9, 21, 10, 22, 10, 26, 9, 27, 10, 27, 9]);
        dots(c, C.wine, [16, 10, 17, 10]);
        c.rect(15, 8, 17, 9, C.bone); // a small skull kept among the letters
        dots(c, K, [15, 9, 17, 9]);
        sheet(c, 7, 13, 16, 14, C.paper);
        c.rect(19, 13, 25, 14, OX); // a book of rubbings
        c.row(13, 19, 25, C.parchment);
        c.set(27, 13, BR); // candle
        c.set(27, 12, C.bone);
        flame(c, 27, 11);
      }
      board(c, 1, 15, 32, 16, OAK);
      for (const x of [2, 22]) {
        face(c, x, 17, x + 9, b - 1, OAK);
        drawer(c, x + 1, 18, x + 8, 20, OAK);
        drawer(c, x + 1, 22, x + 8, b - 2, OAK);
        c.rect(x, b, x + 9, b, OAKD);
      }
      c.rect(12, 17, 21, 19, OAK);
      c.row(19, 12, 21, D(OAK));
      c.set(16, 18, BR);
      c.set(17, 18, BR);
    },
    sw: 18, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 4], [3, 2], [8, 2], [12, 6], [14, 11], [14, 14], [2, 14]], OAK); // the quarter-round end
      c.line(8, 2, 12, 6, L(OAK));
      c.line(12, 6, 14, 11, D(OAK));
      c.col(2, 4, 14, L(OAK));
      c.poly([[4, 5], [8, 4], [11, 8], [12, 12], [4, 12]], mix(OAK, 0.85));
      board(c, 1, 15, 16, 16, OAK);
      cabSide(c, 2, 17, 14, b - 1, OAK);
      c.rect(2, b, 14, b, OAKD);
      dots(c, BR, [15, 19, 15, 24]);
      if (u) {
        c.line(9, 3, 14, 10, DARKIN); // open: the dark of it, a sheet hanging over the edge
        c.line(10, 3, 14, 9, DARKIN);
        c.rect(13, 13, 16, 14, C.paper);
        c.col(17, 14, 17, C.paper);
        c.set(15, 12, BR);
        c.set(15, 11, C.bone);
        flame(c, 15, 10);
      }
    },
    su: [0, 0, 1],
  });
  add('twenties-detective-pin-board', 'detective pin board evidence board cork photographs map red string clues investigation case', {
    w: 32, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [5, 25], 26, b, OAKD);
      c.row(32, 7, 24, OAKD);
      face(c, 2, 2, 29, 27, OAK);
      c.rect(3, 3, 28, 26, CORK);
      c.speckle(3, 3, 28, 26, D(CORK), 6, 4);
      c.speckle(3, 3, 28, 26, L(CORK), 9, 8);
      c.rect(4, 4, 13, 12, hex('#b9b08a')); // a map of the county
      c.line(5, 9, 9, 6, hex('#6f8a90'));
      c.line(9, 6, 12, 8, hex('#6f8a90'));
      dots(c, INK, [6, 6, 10, 10, 11, 5, 7, 11]);
      const photo = (x, y) => {
        c.rect(x, y, x + 4, y + 5, C.white);
        c.rect(x + 1, y + 1, x + 3, y + 3, hex('#77747a'));
        c.set(x + 2, y + 2, INK);
        c.set(x + 2, y - 1, C.red); // its pin
      };
      photo(17, 5);
      photo(23, 12);
      photo(5, 16);
      c.rect(12, 15, 19, 22, NEWS); // a cutting
      c.row(16, 13, 18, INK);
      for (let y = 18; y <= 21; y++) type(c, 13, 18, y, hex('#8d8a84'), 3);
      c.rect(23, 4, 27, 8, C.paper);
      dots(c, INK, [24, 5, 25, 6, 26, 5, 24, 7]);
      c.set(8, 3, C.red);
      if (u) {
        c.line(19, 4, 25, 11, C.red); // the threads go up: it all leads to one place
        c.line(25, 11, 15, 14, C.red);
        c.line(15, 14, 7, 15, C.red);
        c.line(7, 15, 9, 7, C.red);
        c.line(9, 7, 19, 4, C.red);
        c.oval(7, 5, 11, 9, C.red);
        c.oval(8, 6, 10, 8, hex('#b9b08a'));
        c.set(9, 7, C.red);
        c.line(24, 13, 26, 16, C.red); // one face crossed out
        c.line(26, 13, 24, 16, C.red);
        c.rect(21, 22, 26, 25, C.paper);
        dots(c, C.red, [22, 23, 24, 24, 25, 23]);
      }
    },
    sw: 14, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.line(7, 4, 3, b, OAKD); // back leg
      c.line(8, 2, 10, b, OAKD); // front leg
      c.line(9, 2, 11, b, OAK);
      c.line(5, 30, 10, 30, OAKD);
      c.line(9, 2, 11, 27, OAK); // the board, edge on, leaning
      c.line(10, 2, 12, 27, CORK);
      c.line(8, 2, 10, 27, L(OAK));
      dots(c, C.white, [11, 6, 12, 14, 12, 18]);
      if (u) {
        dots(c, C.red, [11, 5, 12, 9, 12, 13, 13, 17]);
        c.rect(12, b, 15, b, C.paper); // a sheet has dropped
        c.set(13, b - 1, C.paper);
      }
    },
    su: [0, 0, 3],
  });
  add('twenties-office-safe-iron', 'office safe iron strongbox combination dial green enamel gold lining money documents', {
    w: 20, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2,
        SG = hex('#34463e');
      face(c, 2, 2, 17, b - 1, SG);
      c.rect(2, b, 4, b, EB);
      c.rect(15, b, 17, b, EB);
      if (!u) {
        c.frame(4, 4, 15, b - 3, GILT);
        c.rect(5, 5, 14, b - 4, mix(SG, 0.9));
        c.oval(8, 8, 11, 11, NICK); // dial
        c.set(9, 9, K);
        c.rect(8, 14, 12, 14, BR); // handle
        c.set(10, 15, BR);
        type(c, 7, 12, 18, GILT, 2);
        dots(c, EB, [15, 7, 15, 17]);
      } else {
        hollow(c, 4, 4, 15, b - 3, hex('#5a5a60')); // open: ledgers, a bundle of notes, an envelope
        c.row(11, 4, 15, STEELD);
        c.rect(5, 7, 7, 10, OX);
        c.rect(8, 6, 9, 10, NAVY);
        c.col(8, 6, 10, L(NAVY));
        c.rect(11, 9, 14, 10, hex('#8a9a72'));
        c.row(9, 11, 14, hex('#6a7a5a'));
        c.rect(5, 15, 11, 18, C.paper);
        c.line(5, 15, 8, 17, D(C.paper));
        c.line(11, 15, 8, 17, D(C.paper));
        c.set(8, 17, C.red);
        c.rect(13, 16, 14, 18, GILT);
        face(c, 18, 3, 22, b - 2, mix(SG, 1.15)); // the door, swung out
        c.col(18, 3, b - 2, STEELD);
        c.set(21, 10, NICK);
      }
    },
    u: [0, 0, 5],
    sw: 16, sh: 26,
    s(c, u) {
      const b = c.h - 2,
        SG = hex('#34463e');
      cabSide(c, 2, 2, 12, b - 1, SG);
      c.rect(2, b, 4, b, EB);
      c.rect(10, b, 12, b, EB);
      if (!u) {
        c.col(13, 4, b - 3, mix(SG, 0.8));
        c.set(14, 9, NICK);
        c.set(14, 14, BR);
      } else {
        c.col(12, 4, b - 3, DARKIN);
        face(c, 13, 3, 22, b - 2, mix(SG, 1.15));
        c.frame(15, 5, 20, b - 4, STEELD);
        c.rect(17, 9, 18, 12, STEELV);
      }
    },
    su: [0, 0, 9],
  });

  /* ---------- the bootleggers ---------- */
  add('twenties-bootleg-crates-stack', 'bootleg crates stack smuggled whisky liquor boxes straw contraband prohibition cellar', {
    w: 28, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      crate(c, 2, 13, 13, b, C.woodPale, INK);
      crate(c, 14, 13, 25, b, hex('#9a7a52'));
      type(c, 16, 23, 17, C.blood, 2);
      crate(c, 7, 4, 20, 12, hex('#a07e54'), INK);
      if (!u) {
        c.row(3, 7, 20, L(hex('#a07e54')));
        dots(c, C.straw, [6, 12, 21, 11, 13, 13]);
      } else {
        c.rect(8, 4, 19, 5, DARKIN); // prised open
        for (let x = 9; x <= 18; x += 2) {
          c.col(x, 2, 5, x % 4 === 1 ? AMBER : GRN);
          c.set(x, 1, C.parchment);
        }
        dots(c, C.straw, [8, 3, 12, 4, 16, 3, 19, 4, 6, 6, 21, 7, 22, 12, 5, 12]);
        c.poly([[21, 12], [26, 3], [27, 4], [23, 12]], hex('#a07e54')); // the lid stood against it
        c.line(21, 12, 26, 3, L(hex('#a07e54')));
        c.line(3, 10, 7, 12, C.iron); // the crowbar
        c.set(2, 9, C.iron);
      }
    },
    u: [0, 2, 1],
    sw: 18, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      crate(c, 2, 13, 15, b, C.woodPale);
      crate(c, 3, 4, 14, 12, hex('#a07e54'));
      if (!u) c.row(3, 3, 14, L(hex('#a07e54')));
      else {
        c.rect(4, 4, 13, 5, DARKIN);
        for (let x = 5; x <= 12; x += 2) {
          c.col(x, 2, 5, x % 4 === 1 ? AMBER : GRN);
          c.set(x, 1, C.parchment);
        }
        dots(c, C.straw, [4, 3, 8, 4, 13, 3, 15, 8, 16, 12]);
      }
    },
    su: [0, 2, 0],
  });
  add('twenties-whisky-still-copper', 'whisky still copper pot moonshine distillery brick furnace worm barrel jug bootleg', {
    w: 34, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bricks(c, 2, 24, 17, b, hex('#7a4636'), 3);
      c.row(24, 2, 17, hex('#8f5a48'));
      c.rect(7, 28, 12, 33, C.ironDark); // fire door
      c.frame(7, 28, 12, 33, C.iron);
      if (u) {
        c.rect(8, 29, 11, 32, C.flame);
        c.rect(9, 30, 10, 32, C.flameLight);
        dots(c, C.red, [8, 29, 11, 30]);
      } else dots(c, C.iron, [9, 30, 10, 31]);
      c.oval(3, 9, 16, 25, COPPER); // the pot
      c.rect(4, 22, 15, 24, COPPER);
      for (let y = 11; y <= 20; y++) c.set(y < 14 ? 5 : 4, y, L(COPPER));
      c.set(6, 10, L(COPPER));
      c.row(17, 4, 15, D(COPPER));
      dots(c, D(COPPER), [6, 18, 9, 18, 12, 18, 14, 18]); // rivets
      c.rect(8, 5, 11, 9, COPPER); // the head
      c.col(8, 5, 9, L(COPPER));
      c.rect(9, 3, 23, 4, COPPER); // the arm over to the worm
      c.row(3, 9, 23, L(COPPER));
      c.rect(22, 5, 23, 13, COPPER);
      c.col(22, 5, 13, L(COPPER));
      c.rect(19, 14, 28, 30, C.woodLight); // the worm tub
      for (let x = 21; x <= 27; x += 2) c.col(x, 14, 30, D(C.woodLight));
      c.col(19, 14, 30, L(C.woodLight));
      c.row(16, 19, 28, C.iron);
      c.row(27, 19, 28, C.iron);
      c.row(14, 19, 28, hex('#34566b')); // water in it
      c.rect(20, 31, 21, b, C.woodDark);
      c.rect(26, 31, 27, b, C.woodDark);
      c.rect(29, 26, 30, 26, COPPER); // the spout
      c.rect(27, 30, 31, b, hex('#b5a47c')); // the jug under it
      c.rect(28, 28, 30, 29, hex('#b5a47c'));
      c.rect(27, 30, 31, 31, hex('#7a5a36'));
      c.col(27, 30, b, L(hex('#b5a47c')));
      if (u) {
        c.set(30, 27, AMBER);
        c.set(29, 28, AMBER);
        wisp(c, 9, 1, 4);
        wisp(c, 13, 7, 3);
        dots(c, C.flameLight, [9, 34, 10, 35]);
        c.rect(27, b, 31, b, AMBER);
        c.rect(24, b, 26, b, D(AMBER));
      }
    },
    u: [0, 2, 0],
    sw: 20, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      bricks(c, 2, 24, 15, b, hex('#7a4636'), 5);
      c.row(24, 2, 15, hex('#8f5a48'));
      c.oval(2, 9, 15, 25, COPPER);
      c.rect(3, 22, 14, 24, COPPER);
      for (let y = 11; y <= 20; y++) c.set(y < 14 ? 4 : 3, y, L(COPPER));
      c.row(17, 3, 14, D(COPPER));
      dots(c, D(COPPER), [5, 18, 8, 18, 11, 18]);
      c.rect(7, 5, 10, 9, COPPER);
      c.col(7, 5, 9, L(COPPER));
      c.rect(8, 3, 9, 4, COPPER); // the arm goes away from us
      c.rect(16, 26, 17, b, C.ironDark); // the door's edge and its glow
      if (u) {
        c.col(16, 28, 33, C.flame);
        dots(c, C.flameLight, [17, 30, 17, 32, 18, b]);
        wisp(c, 8, 1, 4);
      }
    },
    su: [0, 2, 0],
  });

  /* ---------- the bank and the hotel ---------- */
  add('twenties-bank-vault-door', 'bank vault door round steel strongroom wheel handle combination lock safe deposit heist', {
    w: 38, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 2, 35, b, STEELD);
      for (let x = 4; x <= 33; x += 5) dots(c, mix(STEELD, 0.7), [x, 4, x, b - 2]);
      c.oval(5, 6, 32, 37, mix(STEELD, 0.7)); // the ring of the frame
      if (!u) {
        c.oval(6, 7, 31, 36, STEELV);
        c.oval(9, 10, 28, 33, mix(STEELV, 0.9));
        for (let y = 9; y <= 20; y++) for (let x = 7; x <= 14; x++) if (c.get(x, y) && ((x - 18.5) / 12.5) ** 2 + ((y - 21.5) / 14.5) ** 2 > 0.82) c.set(x, y, L(STEELV));
        for (let a = 0; a < 360; a += 30) c.set(Math.round(18.5 + 11 * Math.cos((a * Math.PI) / 180)), Math.round(21.5 + 13 * Math.sin((a * Math.PI) / 180)), STEELD);
        c.rect(2, 13, 6, 17, EB); // hinges
        c.rect(2, 26, 6, 30, EB);
        c.row(13, 2, 6, STEELD);
        c.row(26, 2, 6, STEELD);
        c.oval(13, 16, 24, 27, BR); // the wheel
        c.oval(15, 18, 22, 25, mix(STEELV, 0.9));
        c.line(14, 21, 23, 21, BR);
        c.line(18, 17, 18, 26, BR);
        c.line(15, 18, 22, 25, D(BR));
        c.line(22, 18, 15, 25, D(BR));
        c.oval(17, 20, 20, 23, NICK);
        c.oval(25, 12, 28, 15, NICK); // the dial
        c.set(26, 13, K);
        c.rect(29, 20, 31, 23, EB); // bolt housing
      } else {
        c.oval(6, 7, 31, 36, hex('#2a2a32')); // open: the strongroom
        c.oval(8, 9, 29, 34, DARKIN);
        for (let y = 12; y <= 30; y += 4)
          for (let x = 11; x <= 25; x += 4) {
            if (c.get(x, y) !== DARKIN) continue;
            c.rect(x, y, x + 2, y + 2, y === 20 && x === 19 ? DARKIN : STEELD); // deposit boxes, one of them out
            c.set(x + 1, y + 1, y === 20 && x === 19 ? DARKIN : BR);
          }
        c.rect(14, 32, 22, 33, hex('#3a3a44'));
        c.rect(15, 30, 18, 31, STEELV); // the box on the floor, its papers
        c.rect(19, 31, 21, 31, C.paper);
        c.rect(-6, 6, 3, 37, STEELV); // the door standing wide, its face turned away
        c.oval(-7, 6, 4, 37, STEELV);
        c.oval(-5, 9, 2, 34, mix(STEELV, 0.8));
        c.col(-6, 12, 31, L(STEELV));
        for (const y of [10, 16, 22, 28, 33]) c.rect(4, y, 5, y + 1, NICK); // its bolts
        c.rect(-2, 19, 0, 24, BR);
        c.rect(2, 13, 6, 17, EB);
        c.rect(2, 26, 6, 30, EB);
      }
    },
    u: [8, 0, 0],
    sw: 14, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 2, 6, b, STEELD);
      if (!u) {
        c.rect(7, 7, 10, 36, STEELV); // the slab of the door
        c.col(7, 7, 36, L(STEELV));
        c.col(10, 7, 36, D(STEELV));
        c.rect(11, 19, 12, 24, BR);
        c.set(11, 13, NICK);
      } else {
        c.col(6, 7, 36, DARKIN);
        c.oval(8, 6, 21, 37, STEELV); // the door swung out towards us
        c.oval(10, 9, 19, 34, mix(STEELV, 0.9));
        c.col(8, 14, 29, L(STEELV));
        c.oval(11, 17, 18, 26, BR);
        c.oval(13, 19, 16, 24, mix(STEELV, 0.9));
        c.line(12, 21, 17, 21, BR);
        c.col(14, 18, 25, BR);
        c.rect(7, 13, 8, 17, EB);
        c.rect(7, 26, 8, 30, EB);
      }
    },
    su: [0, 0, 9],
  });
  add('twenties-revolving-door-brass', 'revolving door hotel entrance bank lobby brass glass wings turning department store', {
    w: 32, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2,
        G = hex('#56727a');
      deco(c, 6, 25, 3, BRONZE, 2);
      c.rect(1, 4, 30, 8, BRONZE);
      c.row(4, 1, 30, L(BRONZE));
      c.row(8, 1, 30, BR);
      type(c, 9, 22, 6, GILT, 3);
      c.rect(2, 9, 29, b, DARKIN);
      for (const x of [2, 28]) {
        c.rect(x, 9, x + 1, b, BRONZE); // the posts of the drum
        c.col(x, 9, b, L(BRONZE));
      }
      c.rect(4, 10, 8, b - 1, G); // the curved glass either side
      c.rect(23, 10, 27, b - 1, mix(G, 0.8));
      c.col(4, 10, b - 1, C.glassLight);
      c.col(27, 10, b - 1, mix(G, 0.6));
      c.row(b, 2, 29, hex('#3a3a44'));
      const wing = (x0, x1, col) => {
        c.rect(x0, 10, x1, b - 1, col);
        c.frame(x0, 10, x1, b - 1, BR);
        c.rect(x0 + 1, 24, x1 - 1, 24, BR); // push bar
        c.rect(x0 + 1, b - 5, x1 - 1, b - 2, BRONZE); // kick plate
      };
      if (!u) {
        wing(10, 21, G);
        for (let i = 0; i < 6; i++) c.set(12 + i, 20 - i, C.glassLight);
        c.rect(15, 9, 16, b, BR); // the wing that stands towards us, edge on
        c.col(15, 9, b, L(BR));
      } else {
        wing(9, 14, mix(G, 1.1)); // turned an eighth: still swinging, nobody in it
        wing(17, 22, mix(G, 0.8));
        c.rect(15, 9, 16, b, BR);
        c.col(15, 9, b, L(BR));
        for (let i = 0; i < 3; i++) c.set(10 + i, 18 - i, C.glassLight);
        dots(c, C.blood, [18, 20, 19, 20, 20, 21, 18, 21, 19, 22, 19, 23, 20, 25]); // a hand's print on the glass
        c.rect(8, b - 1, 12, b - 1, hex('#5b5a60')); // and a hat on the floor
        c.rect(9, b - 2, 11, b - 2, hex('#5b5a60'));
      }
    },
  });
  add('twenties-hotel-reception-desk-bell', 'hotel reception desk front desk counter bell register ledger lobby walnut marble top key', {
    w: 44, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 8, 42, 9, MARB);
      c.speckle(1, 8, 42, 9, hex('#8d8a84'), 5, 3);
      face(c, 2, 10, 41, b - 2, WAL);
      for (const x of [4, 30]) panel(c, x, 12, x + 9, b - 4, WAL);
      panel(c, 16, 12, 27, b - 4, WAL);
      c.poly([[21, 13], [25, 16], [21, 19], [18, 16]], BR); // a brass lozenge
      c.poly([[21, 14], [23, 16], [21, 18], [20, 16]], WAL);
      c.rect(2, b - 1, 41, b, EB);
      c.row(b - 2, 2, 41, BR);
      c.rect(19, 6, 22, 7, NICK); // the bell
      c.row(5, 20, 21, NICK);
      c.set(20, 4, EB);
      c.row(7, 18, 23, EB);
      c.rect(5, 6, 8, 7, BR); // lamp
      c.col(6, 4, 5, BR);
      c.rect(4, 2, 9, 3, u ? hex('#5f9a6a') : GRN);
      c.row(2, 5, 8, u ? hex('#8fc08a') : L(GRN));
      c.rect(35, 5, 40, 7, CREAM); // the card: RECEPTION
      type(c, 36, 39, 6, INK, 2);
      c.col(32, 4, 7, EB); // pen in its stand
      c.rect(31, 7, 33, 7, EB);
      if (!u) {
        c.rect(25, 6, 30, 7, OX); // the register, shut
        c.row(6, 25, 30, L(OX));
      } else {
        sheet(c, 24, 6, 31, 7, C.paper); // open at the last name
        c.set(27, 6, D(C.paper));
        c.set(28, 6, D(C.paper));
        c.line(29, 5, 31, 3, EB); // the pen left across it
        c.clearRect(32, 4, 32, 6);
        dots(c, C.ghost, [17, 3, 24, 3, 18, 1, 23, 1, 20, 2]); // the bell still singing
        c.rect(12, 7, 13, 7, BR); // a key on its fob
        c.rect(14, 6, 16, 7, OX);
        dots(c, C.glow, [5, 4, 8, 4, 4, 5, 9, 5]);
      }
    },
    sw: 16, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 8, 14, 9, MARB);
      cabSide(c, 2, 10, 12, b - 2, WAL);
      c.rect(2, b - 1, 12, b, EB);
      c.row(b - 2, 2, 12, BR);
      c.rect(9, 6, 11, 7, NICK);
      c.set(10, 5, NICK);
      c.set(10, 4, EB);
      c.rect(3, 6, 5, 7, BR);
      c.col(4, 4, 5, BR);
      c.rect(2, 2, 6, 3, u ? hex('#5f9a6a') : GRN);
      if (u) {
        dots(c, C.glow, [3, 4, 5, 4]);
        dots(c, C.ghost, [8, 3, 12, 3, 10, 2]);
        c.rect(6, 7, 8, 7, C.paper);
      } else c.rect(6, 7, 8, 7, OX);
    },
  });
  add('twenties-hotel-key-rack-pigeonholes', 'hotel key rack pigeonholes letters room keys numbered hooks reception lobby mail', {
    w: 28, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      deco(c, 6, 21, 3, WAL, 2);
      face(c, 2, 4, 25, b, WAL);
      for (let j = 0; j < 4; j++)
        for (let i = 0; i < 5; i++) {
          const x = 4 + i * 4 + (i > 2 ? 1 : 0),
            y = 6 + j * 6,
            taken = u && i === 3 && j === 1,
            n = (i * 3 + j * 5) % 4;
          hollow(c, x, y, x + 2, y + 3, WAL);
          if (n === 0 && !taken) c.rect(x, y + 2, x + 2, y + 3, CREAM); // letters waiting
          if (n === 2) c.set(x + 1, y + 3, CREAM);
          if (u && i === 1 && j === 2) c.rect(x, y + 1, x + 2, y + 3, hex('#b9a25a')); // a telegram that was not there before
          c.set(x + 1, y + 4, BR); // the hook under it
          if (!taken && n !== 1) {
            c.set(x + 1, y + 5, NICK);
            c.set(x + 1, y + 6 > b ? b : y + 5, NICK);
          }
        }
      c.rect(2, b - 1, 25, b, mix(WAL, 0.7));
    },
    sw: 8, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 4, 3, WAL);
      cabSide(c, 2, 4, 5, b, WAL, false);
      for (let j = 0; j < 4; j++) {
        c.set(6, 10 + j * 6, BR);
        if (!(u && j === 1)) c.set(6, 11 + j * 6, NICK);
      }
      c.rect(2, b - 1, 5, b, mix(WAL, 0.7));
    },
  });
  add('twenties-lift-cage-door', 'lift cage door elevator scissor gate brass lattice floor indicator dial hotel shaft', {
    w: 26, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(7, 1, 18, 12, BRONZE); // the indicator
      c.oval(8, 2, 17, 11, CREAM);
      c.rect(7, 7, 18, 12, BRONZE);
      dots(c, INK, [9, 5, 11, 3, 14, 3, 16, 5]);
      c.line(12, 6, u ? 15 : 10, u ? 4 : 4, C.red);
      c.set(12, 6, EB);
      face(c, 2, 8, 23, b, BRONZE);
      c.row(8, 2, 23, L(BRONZE));
      c.rect(4, 11, 21, b, DARKIN);
      c.row(10, 3, 22, BR);
      if (!u) {
        for (let y = 11; y <= b; y++) for (let x = 4; x <= 21; x++) if ((x + y) % 6 === 0 || (x - y + 60) % 6 === 0) c.set(x, y, BR); // the gate
        for (let x = 4; x <= 21; x += 3) for (let y = 11; y <= b; y += 3) if ((x + y) % 6 === 0 && (x - y + 60) % 6 === 0) c.set(x, y, L(BR));
        c.rect(19, 26, 20, 28, EB); // handle
        c.row(b, 4, 21, hex('#3a3a44'));
      } else {
        for (let x = 4; x <= 8; x++) for (let y = 11; y <= b; y++) c.set(x, y, x % 2 ? D(BR) : (y % 3 ? BR : L(BR))); // folded back
        c.col(9, 11, b, EB);
        c.col(14, 11, b, STEELD); // no car behind it: the cables, the dark going down
        c.col(17, 11, b, STEELD);
        dots(c, STEELV, [14, 14, 17, 20, 14, 27, 17, 33, 14, 39]);
        c.rect(10, b - 2, 21, b, hex('#22222a'));
        c.row(b - 3, 10, 21, hex('#3a3a44'));
        dots(c, hex('#5a4a30'), [12, b - 1, 19, b - 1]);
      }
    },
    sw: 10, sh: 46,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 5, 8, BRONZE);
      c.set(6, 5, CREAM);
      face(c, 2, 8, 6, b, BRONZE);
      if (!u) {
        for (let y = 11; y <= b; y++) c.set(7, y, y % 3 ? BR : L(BR));
        c.set(8, 27, EB);
      } else {
        c.col(7, 11, b, DARKIN);
        for (let y = 11; y <= b; y++) c.set(3, y, y % 3 ? BR : L(BR));
        c.col(4, 11, b, D(BR));
      }
    },
  });
};
