/* Cottage: a poor country cottage. Part of tools/big/env-old.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, flame, fire, wisp, cloth, shards, doorOut, planksV, planksH, stones, bricks, heap } = H;
  const add = H.reg('env-cottage', 'Cottage');
  const PINE = hex('#94714a'),
    OAK = hex('#5c4432'),
    WHITEW = hex('#b4ae9c'),
    SOOT = hex('#221d22'),
    TIN = hex('#858a92'),
    EARTHEN = hex('#8a4f36'),
    MADDER = hex('#7a3a30'),
    BLUE = hex('#4f5f78'),
    TICK = hex('#b5a47c'),
    CHINA = hex('#d6d2c4'),
    LOAF = hex('#a0703c'),
    TURF = hex('#3a2c24');
  /** A face of upright planks. */
  const planks = (c, x0, y0, x1, y1, col, step = 4) => {
    face(c, x0, y0, x1, y1, col);
    planksV(c, x0, y0 + 1, x1, y1, D(col), step);
  };

  /* ---------- beds and seats ---------- */
  add('box-bed-cupboard', 'box bed cupboard bed closet bed sliding doors wooden alcove sleep', {
    w: 38, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      planks(c, 1, 3, 36, b, OAK, 5);
      c.rect(1, 2, 36, 3, OAK);
      c.row(2, 1, 36, L(OAK));
      c.row(4, 1, 36, D(OAK));
      c.rect(1, 24, 36, 25, OAK); // the bed rail
      c.row(24, 1, 36, L(OAK));
      drawer(c, 4, 27, 17, b - 2, OAK, C.iron);
      drawer(c, 20, 27, 33, b - 2, OAK, C.iron);
      if (!u) {
        for (const x0 of [4, 19]) {
          planks(c, x0, 6, x0 + 14, 22, PINE, 4); // sliding doors
          c.row(6, x0, x0 + 14, D(PINE));
          c.set(x0 + 7, 10, SOOT); // a heart cut in each
          c.set(x0 + 6, 9, SOOT);
          c.set(x0 + 8, 9, SOOT);
          c.set(x0 + (x0 < 10 ? 12 : 2), 15, SOOT); // finger hole
        }
        c.col(18, 6, 22, SOOT);
      } else {
        hollow(c, 4, 6, 18, 22, OAK); // one door slid behind the other
        planks(c, 19, 6, 33, 22, PINE, 4);
        c.row(6, 19, 33, D(PINE));
        dots(c, SOOT, [26, 10, 25, 9, 27, 9, 21, 15]);
        c.col(19, 6, 22, L(PINE));
        c.rect(4, 20, 18, 22, TICK); // straw mattress
        dots(c, C.straw, [6, 22, 10, 21, 15, 22]);
        c.rect(5, 17, 10, 19, CHINA); // bolster
        c.row(19, 5, 10, D(CHINA));
        c.rect(7, 18, 8, 18, D(CHINA)); // the dent of a head
        c.poly([[12, 20], [14, 15], [18, 14], [18, 23], [16, 30], [12, 29]], MADDER); // blanket thrown back and trailing out
        c.line(14, 15, 13, 28, D(MADDER));
        c.line(12, 20, 14, 15, L(MADDER));
        c.row(26, 13, 16, TICK);
      }
    },
    sw: 20, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      planks(c, 2, 3, 16, b, OAK, 5);
      c.rect(1, 2, 17, 3, OAK);
      c.row(2, 1, 17, L(OAK));
      c.row(4, 2, 16, D(OAK));
      c.row(24, 2, 16, D(OAK));
      c.col(16, 5, b, D(OAK));
      if (u) {
        c.poly([[17, 20], [18, 21], [19, 30], [17, 29]], MADDER); // the blanket hanging out of the front
        c.set(18, 26, TICK);
      }
    },
    su: [0, 0, 2],
  });
  add('settle-high-back', 'settle bench high back wooden seat box fireside oak', {
    w: 30, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      planks(c, 3, 3, 26, 19, OAK, 4);
      c.row(3, 3, 26, L(OAK));
      for (const x of [1, 26]) {
        c.rect(x, 6, x + 2, b, OAK); // the cheeks
        c.set(x + 1, 5, OAK);
        c.row(15, x, x + 2, L(OAK));
      }
      c.col(1, 6, b, L(OAK));
      face(c, 3, 22, 26, b - 1, OAK); // the box under the seat
      panel(c, 5, 24, 13, b - 3, OAK);
      panel(c, 16, 24, 24, b - 3, OAK);
      if (!u) {
        board(c, 3, 20, 26, 21, PINE);
        c.rect(5, 18, 11, 19, BLUE); // a folded cloth to sit on
        c.row(18, 5, 11, L(BLUE));
      } else {
        c.rect(4, 9, 25, 19, PINE); // the seat lifted: a chest
        c.row(9, 4, 25, L(PINE));
        c.row(19, 4, 25, D(PINE));
        planksH(c, 4, 9, 25, 19, D(PINE), 5);
        hollow(c, 4, 20, 25, 21, OAK);
        c.rect(6, 20, 13, 21, BLUE);
        c.row(20, 6, 13, L(BLUE));
        c.rect(17, 20, 20, 21, C.parchment);
        c.set(22, 21, C.brass);
      }
    },
    sw: 14, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 3], [5, 3], [6, 12], [11, 15], [12, 19], [12, b], [2, b]], OAK);
      c.col(2, 3, b, L(OAK));
      c.line(5, 4, 6, 12, D(OAK));
      c.line(6, 12, 11, 15, L(OAK));
      c.row(21, 3, 11, D(OAK));
      c.col(12, 19, b, D(OAK));
      c.row(b, 2, 12, D(OAK));
      if (u) {
        c.line(6, 19, 5, 9, PINE);
        c.line(7, 19, 6, 9, D(PINE));
      } else c.row(20, 6, 12, PINE);
    },
  });
  add('chair-ladderback-rush', 'ladderback chair rush seat wooden country kitchen chair', {
    w: 12, h: 23, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 3, b, PINE); // back post
      c.col(2, 2, b, L(PINE));
      c.set(2, 1, PINE);
      c.rect(8, 12, 9, b, PINE); // front leg
      c.row(b - 3, 4, 7, D(PINE));
      c.row(b - 6, 4, 7, D(PINE));
      dots(c, D(PINE), [4, 4, 4, 7, 4, 10]); // slats, edge on
      if (!u) {
        c.rect(2, 12, 10, 13, C.straw);
        c.row(12, 2, 10, L(C.straw));
        dots(c, D(C.straw), [4, 13, 6, 13, 8, 13]);
      } else {
        c.rect(2, 12, 10, 12, PINE); // the rush seat fallen through
        c.rect(4, 13, 7, 13, SOOT);
        c.line(5, 13, 4, 17, C.straw);
        c.line(7, 13, 8, 16, C.straw);
        c.set(6, 15, D(C.straw));
        dots(c, C.straw, [5, b, 7, b - 1]);
      }
    },
    sw: 12, sh: 23,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [1, 9]) {
        c.rect(x, 2, x + 1, b, PINE);
        c.col(x, 2, b, L(PINE));
        c.set(x, 1, PINE);
      }
      for (const y of [3, 6, 9]) {
        c.rect(3, y, 8, y + 1, PINE);
        c.row(y, 3, 8, L(PINE));
      }
      c.row(b - 3, 3, 8, D(PINE));
      if (!u) {
        c.rect(1, 12, 10, 13, C.straw);
        c.row(12, 1, 10, L(C.straw));
        for (let x = 2; x < 10; x += 2) c.set(x, 13, D(C.straw));
      } else {
        c.rect(1, 12, 10, 13, C.straw);
        c.rect(3, 12, 8, 13, SOOT);
        c.line(4, 13, 3, 17, C.straw);
        c.line(7, 13, 8, 17, C.straw);
        c.col(5, 13, 15, D(C.straw));
        dots(c, C.straw, [4, b, 6, b - 1, 7, b]);
      }
    },
  });
  add('stool-three-legged', 'stool three legged milking stool creepie wooden seat', {
    w: 13, h: 11,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        board(c, 1, 2, 11, 3, PINE);
        c.line(3, 4, 1, b, OAK);
        c.line(6, 4, 6, b, D(OAK));
        c.line(9, 4, 11, b, OAK);
      } else {
        c.rect(1, 1, 2, b, PINE); // kicked over
        c.col(1, 1, b, L(PINE));
        c.line(3, 2, 10, 1, OAK);
        c.line(3, 5, 11, 5, D(OAK));
        c.line(3, 8, 10, b, OAK);
      }
    },
  });
  add('cradle-hooded-rockers', 'cradle hooded wooden rockers baby rocking cradle cot', {
    w: 26, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.poly([[3, 8], [3, 4], [5, 2], [9, 2], [10, 4], [10, 8]], OAK); // hood
      c.line(3, 4, 5, 2, L(OAK));
      c.row(2, 5, 9, L(OAK));
      planks(c, 3, 9, 22, 14, OAK, 5);
      c.row(9, 10, 22, L(OAK));
      c.set(23, 8, OAK); // knob at the foot
      c.rect(4, 15, 6, b, OAK); // rockers, end on
      c.rect(19, 15, 21, b, OAK);
      c.row(b, 3, 7, D(OAK));
      c.row(b, 18, 22, D(OAK));
      if (!u) {
        c.rect(11, 7, 21, 8, BLUE);
        c.row(7, 11, 21, L(BLUE));
        c.rect(10, 8, 10, 8, CHINA);
      } else {
        c.rect(11, 8, 15, 8, TICK); // empty
        c.poly([[15, 8], [21, 7], [23, 15], [18, 16]], BLUE); // the blanket over the side
        c.line(15, 8, 21, 7, L(BLUE));
        c.line(19, 9, 20, 15, D(BLUE));
      }
    },
    sw: 16, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[3, 14], [3, 4], [5, 2], [10, 2], [12, 4], [12, 14]], OAK); // the hood end
      c.line(3, 4, 5, 2, L(OAK));
      c.row(2, 5, 10, L(OAK));
      c.col(3, 4, 14, L(OAK));
      c.col(7, 3, 14, D(OAK));
      c.set(7, 6, SOOT);
      c.row(b, 4, 11, OAK); // the rocker, a shallow curve
      c.rect(2, b - 1, 4, b - 1, OAK);
      c.rect(11, b - 1, 13, b - 1, OAK);
      c.set(1, b - 2, OAK);
      c.set(14, b - 2, OAK);
      c.col(5, 15, b - 1, D(OAK));
      c.col(10, 15, b - 1, D(OAK));
      if (u) {
        c.poly([[12, 7], [14, 8], [14, 15], [12, 14]], BLUE);
        c.col(13, 9, 14, D(BLUE));
      }
    },
  });

  /* ---------- table ---------- */
  const loaf = (c, x, yb, cut) => {
    c.rect(x, yb - 2, x + (cut ? 3 : 6), yb, LOAF);
    c.row(yb - 3, x + 1, x + (cut ? 3 : 5), LOAF);
    c.row(yb - 3, x + 1, x + (cut ? 2 : 4), L(LOAF));
    if (cut) {
      c.col(x + 3, yb - 3, yb, C.bone);
      c.rect(x + 5, yb, x + 7, yb, C.bone); // slices
      c.row(yb - 1, x + 6, x + 7, LOAF);
    }
  };
  add('table-rough-plank', 'table rough plank trestle kitchen table bread loaf bowl knife', {
    w: 32, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 7, 30, 8, PINE);
      dots(c, D(PINE), [8, 7, 16, 7, 23, 7]);
      for (const x of [4, 22]) {
        c.line(x, 9, x + 5, b, OAK); // crossed trestles
        c.line(x + 5, 9, x, b, D(OAK));
        c.line(x + 1, 9, x + 6, b, OAK);
      }
      c.row(11, 6, 26, D(OAK));
      loaf(c, 4, 6, u);
      c.rect(15, 5, 19, 6, OAK); // bowl
      c.row(4, 14, 20, L(OAK));
      if (!u) {
        c.row(6, 11, 14, C.steel); // knife
        c.set(10, 6, OAK);
        c.row(3, 15, 19, hex('#b0a070')); // porridge
        c.line(19, 3, 21, 1, PINE); // spoon
        c.rect(24, 4, 26, 6, EARTHEN); // mug
        c.row(4, 24, 26, L(EARTHEN));
        c.set(27, 5, EARTHEN);
      } else {
        c.col(12, 3, 6, C.steel); // the knife stood in the board
        c.rect(12, 1, 12, 2, OAK);
        dots(c, C.bone, [10, 6, 14, 6, 3, 6]);
        c.rect(24, 5, 27, 6, EARTHEN); // the mug on its side
        c.set(27, 5, SOOT);
        c.row(6, 28, 29, hex('#6a5a3a'));
        c.col(30, 8, 12, hex('#6a5a3a')); // ale running off the edge
        c.set(30, 14, hex('#6a5a3a'));
        c.line(19, 4, 22, 5, PINE);
      }
    },
    sw: 17, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 7, 15, 8, PINE);
      c.line(5, 9, 3, b, OAK);
      c.line(11, 9, 13, b, OAK);
      c.line(6, 9, 4, b, D(OAK));
      c.line(10, 9, 12, b, D(OAK));
      c.row(12, 5, 11, D(OAK));
      c.rect(3, 4, 6, 6, LOAF);
      c.row(3, 4, 5, L(LOAF));
      if (u) c.rect(3, 4, 6, 6, C.bone), c.frame(3, 4, 6, 6, LOAF);
      c.rect(9, 5, 12, 6, OAK);
      c.row(4, 8, 13, L(OAK));
      if (!u) c.row(3, 9, 12, hex('#b0a070'));
      else {
        c.col(7, 3, 6, C.steel);
        c.rect(7, 1, 7, 2, OAK);
        c.col(14, 9, 12, hex('#6a5a3a'));
      }
    },
  });

  /* ---------- fire and food ---------- */
  add('hearth-open-pot-hook', 'hearth open fire chimney cooking pot hook crane inglenook fireplace cottage', {
    w: 36, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stones(c, 1, 2, 34, b, WHITEW, 5, 8, 3);
      c.rect(2, 9, 33, 11, OAK); // the beam
      c.row(9, 2, 33, L(OAK));
      dots(c, D(OAK), [8, 10, 17, 10, 26, 10]);
      c.rect(5, 12, 30, b, SOOT);
      dots(c, hex('#342c30'), [8, 15, 14, 18, 22, 14, 27, 20, 10, 24, 25, 26, 18, 22]);
      c.rect(10, 6, 12, 8, EARTHEN); // things on the beam
      c.rect(15, 5, 15, 8, C.bone);
      c.rect(22, 7, 26, 8, hex('#3a3a44'));
      c.rect(6, 13, 6, b - 6, C.iron); // the crane
      c.row(15, 6, 20, C.iron);
      c.line(7, 20, 12, 16, C.iron);
      c.col(19, 16, 19, C.ironDark); // chain
      c.rect(15, 21, 23, 26, hex('#2c2a32')); // the pot
      c.row(20, 16, 22, C.iron);
      c.row(21, 15, 23, hex('#4a4852'));
      c.col(15, 22, 25, hex('#4a4852'));
      c.clear(15, 26);
      c.clear(23, 26);
      c.set(15, 27, hex('#2c2a32'));
      c.set(23, 27, hex('#2c2a32'));
      c.line(15, 21, 19, 19, C.iron); // bail
      c.line(23, 21, 19, 19, C.iron);
      c.rect(11, b - 1, 27, b, hex('#4a3c30')); // logs on the hearthstone
      c.row(b - 1, 11, 27, hex('#6a5640'));
      dots(c, C.ash, [9, b, 13, b - 2, 26, b - 2, 29, b, 20, b - 2]);
      if (u) {
        fire(c, 12, 26, b - 1, 6, 9);
        c.rect(15, 26, 23, 26, hex('#2c2a32'));
        dots(c, C.red, [12, b, 17, b, 22, b, 26, b]);
        dots(c, hex('#5a3028'), [7, 22, 28, 24, 9, 28, 28, 17, 8, 17]);
        wisp(c, 17, 19, 4, C.ghost);
        wisp(c, 21, 20, 5, C.ghost);
      }
    },
    sw: 15, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      stones(c, 2, 2, 11, b, WHITEW, 5, 8, 4);
      c.rect(2, 9, 12, 11, OAK);
      c.row(9, 2, 12, L(OAK));
      c.col(11, 12, b, D(WHITEW));
      dots(c, hex('#6a6460'), [10, 13, 9, 15, 10, 17, 10, 21]); // soot at the mouth
      if (u) {
        c.col(11, b - 12, b, hex('#a3704a'));
        dots(c, C.flame, [12, b - 3, 12, b - 6, 13, b - 1]);
        dots(c, C.flameLight, [12, b - 4, 12, b - 1]);
        wisp(c, 12, b - 9, 4, C.ghost);
      }
    },
  });
  add('bread-oven-brick', 'bread oven brick dome bake oven baking loaves peel', {
    w: 28, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      stones(c, 2, 16, 22, b, WHITEW, 4, 7, 2);
      c.rect(8, b - 6, 16, b, SOOT); // wood store
      c.rect(9, b - 7, 15, b - 7, SOOT);
      c.rect(10, b - 2, 14, b, hex('#6a5640'));
      dots(c, hex('#b89a6a'), [11, b - 1, 13, b - 1, 12, b - 3]);
      c.oval(2, 2, 22, 28, hex('#7a4636'));
      c.clearRect(2, 16, 22, 28);
      stones(c, 2, 16, 22, b, WHITEW, 4, 7, 2);
      c.rect(8, b - 6, 16, b, SOOT);
      c.rect(9, b - 7, 15, b - 7, SOOT);
      c.rect(10, b - 2, 14, b, hex('#6a5640'));
      dots(c, hex('#b89a6a'), [11, b - 1, 13, b - 1, 12, b - 3]);
      for (let y = 4; y < 16; y += 3) for (let x = 3 + (y % 2) * 2; x < 22; x += 5) if (c.get(x, y)) c.set(x, y, mix(hex('#7a4636'), 0.6));
      c.speckle(2, 2, 22, 15, L(hex('#7a4636')), 8, 3);
      board(c, 1, 15, 23, 16, hex('#8a8478'));
      if (!u) {
        c.rect(8, 9, 16, 14, C.ironDark); // the door
        c.rect(9, 8, 15, 8, C.ironDark);
        c.row(9, 8, 16, C.iron);
        c.col(8, 9, 14, C.iron);
        c.rect(11, 11, 13, 11, C.steel);
        dots(c, hex('#3a2a26'), [9, 6, 12, 5, 15, 6]); // soot over it
      } else {
        c.rect(8, 9, 16, 14, hex('#6a2a1a'));
        c.rect(9, 8, 15, 8, hex('#6a2a1a'));
        c.row(14, 8, 16, C.flame);
        dots(c, C.flameLight, [9, 14, 12, 14, 15, 14]);
        dots(c, C.red, [8, 12, 16, 11, 12, 9]);
        c.rect(9, 12, 11, 13, LOAF); // loaves
        c.row(11, 9, 11, L(LOAF));
        c.rect(13, 12, 15, 13, LOAF);
        c.row(11, 13, 15, L(LOAF));
        c.rect(6, 8, 7, 14, C.iron); // the door open
        c.col(6, 8, 14, C.steel);
      }
      c.col(25, 3, b, PINE); // the peel leaning by it
      c.rect(24, 1, 26, 5, PINE);
      c.col(24, 1, 5, L(PINE));
    },
    sw: 20, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.oval(2, 2, 17, 28, hex('#7a4636'));
      c.clearRect(2, 16, 17, 28);
      stones(c, 2, 16, 16, b, WHITEW, 4, 7, 5);
      for (let y = 4; y < 16; y += 3) for (let x = 3 + (y % 2) * 2; x < 17; x += 5) if (c.get(x, y)) c.set(x, y, mix(hex('#7a4636'), 0.6));
      c.speckle(2, 2, 17, 15, L(hex('#7a4636')), 8, 6);
      board(c, 1, 15, 17, 16, hex('#8a8478'));
      if (!u) c.rect(16, 8, 17, 14, C.ironDark);
      else {
        c.rect(16, 8, 17, 14, C.flame);
        dots(c, C.flameLight, [17, 10, 17, 13]);
        c.rect(18, 8, 23, 14, C.ironDark); // the door swung out
        c.row(8, 18, 23, C.iron);
        c.col(18, 8, 14, C.iron);
        c.set(22, 11, C.steel);
        wisp(c, 18, 6, 3, C.ash);
      }
    },
    su: [0, 0, 5],
  });
  add('butter-churn-plunger', 'butter churn plunger dash churn wooden dairy tub', {
    w: 14, h: 27, solid: true,
    f(c, u) {
      const b = c.h - 2,
        but = hex('#d0bc74');
      c.poly([[4, 11], [9, 11], [11, b], [2, b]], PINE);
      c.line(4, 11, 2, b, L(PINE));
      c.col(6, 12, b, D(PINE));
      c.col(8, 12, b, D(PINE));
      for (const y of [13, 19, b - 1]) {
        const dx = Math.round((y - 11) / 8);
        c.row(y, 4 - dx, 9 + dx, C.iron);
        c.set(4 - dx, y, C.steel);
      }
      if (!u) {
        board(c, 3, 9, 10, 10, OAK); // lid
        c.rect(6, 1, 7, 8, PINE); // the dash handle
        c.col(6, 1, 8, L(PINE));
        c.rect(5, 8, 8, 8, OAK);
      } else {
        c.row(10, 4, 9, but); // lid off: butter come
        c.row(9, 5, 8, but);
        c.set(6, 8, L(but));
        c.set(7, 9, C.white);
        c.line(8, 9, 12, 2, PINE); // the dash leaning in it
        c.set(12, 1, PINE);
        board(c, 0, b - 1, 5, b, OAK); // lid on the floor
        dots(c, C.white, [5, 15, 9, 17, 12, b, 10, 21]); // buttermilk splashed
      }
    },
    u: [1, 0, 1],
  });
  add('flour-bin-sloped', 'flour bin meal chest sloped lid kitchen flour scoop', {
    w: 18, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      planks(c, 2, 8, 15, b, PINE, 5);
      c.rect(2, b - 1, 15, b, D(PINE));
      c.rect(6, 11, 11, 13, C.paper); // label
      c.row(12, 7, 10, C.slate);
      if (!u) {
        c.rect(1, 4, 16, 7, PINE); // the lid, sloping to the front
        c.row(4, 1, 16, L(PINE));
        c.row(7, 1, 16, D(PINE));
        c.set(8, 6, C.iron);
        c.set(9, 6, C.iron);
      } else {
        c.rect(1, 0, 16, 3, L(PINE)); // lid thrown back
        c.row(0, 1, 16, PINE);
        c.row(3, 1, 16, D(PINE));
        c.rect(2, 4, 15, 7, C.white); // flour
        c.row(7, 2, 15, D(C.white));
        c.row(4, 2, 15, hex('#6a5236'));
        dots(c, D(C.white), [5, 6, 9, 5, 12, 6]);
        c.line(11, 5, 14, 2, TIN); // scoop
        dots(c, C.white, [4, 9, 5, 12, 3, 15, 2, b, 0, b, 5, b, 9, 15, 16, b]); // and all down the front
      }
    },
    u: [1, 1, 1],
    sw: 14, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 4], [11, 8], [11, b], [2, b]], PINE);
      c.col(2, 4, b, L(PINE));
      c.col(6, 7, b, D(PINE));
      c.rect(2, b - 1, 11, b, D(PINE));
      if (!u) {
        c.line(1, 2, 12, 7, PINE);
        c.line(1, 3, 12, 8, D(PINE));
        c.line(1, 2, 12, 7, L(PINE));
        c.line(2, 4, 11, 8, PINE);
      } else {
        c.line(2, 3, 4, -3, PINE);
        c.line(3, 3, 5, -3, L(PINE));
        c.line(3, 4, 11, 7, C.white);
        c.line(4, 4, 10, 6, C.white);
        dots(c, C.white, [12, 10, 13, 14, 12, b, 14, b]);
        c.line(8, 5, 10, 2, TIN);
      }
    },
    su: [0, 4, 2],
  });
  add('meat-safe-mesh', 'meat safe larder cupboard mesh zinc gauze food ham legs', {
    w: 16, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2,
        z = hex('#7f8478');
      face(c, 2, 3, 13, 18, PINE);
      c.row(2, 1, 14, L(PINE));
      legs(c, [2, 12], 19, b, PINE);
      c.row(b - 3, 4, 11, D(PINE));
      if (!u) {
        c.rect(4, 5, 11, 16, z);
        for (let y = 5; y <= 16; y++) for (let x = 4; x <= 11; x++) if ((x + y) % 2) c.set(x, y, D(z));
        c.rect(6, 9, 9, 13, mix(z, 0.6)); // the shape of a ham behind the gauze
        c.set(12, 11, C.iron);
      } else {
        hollow(c, 4, 5, 11, 16, PINE);
        c.col(3, 5, 16, L(PINE)); // door open
        c.row(11, 4, 11, L(PINE));
        c.oval(5, 6, 9, 10, hex('#9a5a4a')); // a ham on the hook
        c.set(9, 6, C.bone);
        c.set(6, 7, hex('#b87a6a'));
        c.rect(5, 14, 7, 16, hex('#c9b060')); // cheese
        c.set(5, 14, hex('#6a5236'));
        c.rect(9, 15, 11, 16, CHINA);
        dots(c, K, [10, 8, 11, 12, 1, 7, 14, 9, 10, 13]); // flies
      }
    },
    sw: 12, sh: 26,
    s(c, u) {
      const b = c.h - 2,
        z = hex('#7f8478');
      face(c, 2, 3, 9, 18, PINE);
      c.row(2, 1, 10, L(PINE));
      legs(c, [2, 8], 19, b, PINE);
      c.row(b - 3, 4, 7, D(PINE));
      c.rect(4, 5, 7, 16, z);
      for (let y = 5; y <= 16; y++) for (let x = 4; x <= 7; x++) if ((x + y) % 2) c.set(x, y, D(z));
      if (u) {
        face(c, 10, 4, 17, 17, PINE);
        c.rect(11, 5, 16, 16, z);
        for (let y = 5; y <= 16; y++) for (let x = 11; x <= 16; x++) if ((x + y) % 2) c.set(x, y, D(z));
        dots(c, K, [9, 1, 13, 2]);
      }
    },
    su: [0, 0, 8],
  });
  add('dresser-plates-pine', 'dresser welsh dresser plates pine kitchen crockery rack cups jugs', {
    w: 30, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2,
        bl = hex('#4f6a9a');
      face(c, 2, 4, 27, 21, mix(PINE, 0.7)); // the rack
      c.rect(1, 2, 28, 3, PINE);
      c.row(2, 1, 28, L(PINE));
      c.col(2, 4, 21, PINE);
      c.col(27, 4, 21, D(PINE));
      planksV(c, 3, 4, 26, 21, mix(PINE, 0.6), 4);
      for (const y of [10, 16]) board(c, 3, y, 26, y, PINE);
      const plate = (x, y) => {
        c.oval(x, y - 4, x + 3, y - 1, CHINA);
        c.set(x + 1, y - 3, bl);
        c.set(x + 2, y - 2, bl);
        c.set(x, y - 2, L(CHINA));
      };
      for (let i = 0; i < 5; i++) {
        plate(4 + i * 5 - (i > 2 ? 1 : 0), 10);
        if (!u || i === 0 || i === 3) plate(4 + i * 5 - (i > 2 ? 1 : 0), 16);
      }
      for (const x of [5, 10, 15, 20]) {
        c.rect(x, 18, x + 1, 19, x % 2 ? CHINA : EARTHEN); // cups on hooks
        c.set(x + 2, 18, D(CHINA));
        c.set(x, 17, C.iron);
      }
      c.rect(23, 17, 25, 20, EARTHEN); // a jug
      c.set(22, 17, EARTHEN);
      c.row(17, 23, 25, L(EARTHEN));
      board(c, 1, 22, 28, 23, PINE);
      face(c, 2, 24, 27, b - 1, PINE);
      drawer(c, 4, 25, 10, 28, PINE, C.iron);
      if (!u) drawer(c, 12, 25, 18, 28, PINE, C.iron);
      drawer(c, 20, 25, 26, 28, PINE, C.iron);
      panel(c, 4, 30, 14, b - 2, PINE);
      panel(c, 16, 30, 26, b - 2, PINE);
      c.set(13, 33, C.iron);
      c.set(17, 33, C.iron);
      c.rect(2, b, 3, b, D(PINE));
      c.rect(26, b, 27, b, D(PINE));
      if (u) {
        hollow(c, 12, 25, 18, 27, PINE); // a drawer dragged out, plates smashed
        c.rect(12, 28, 18, 31, L(PINE));
        c.row(28, 12, 18, C.steel);
        c.row(31, 12, 18, D(PINE));
        c.set(15, 30, C.iron);
        shards(c, 5, 24, b, CHINA, 7);
        dots(c, bl, [8, b, 15, b - 1, 21, b]);
        c.oval(9, b - 2, 12, b, CHINA);
        c.set(10, b - 1, bl);
        c.clear(12, b - 2);
        c.clear(12, b - 1);
      }
    },
    sw: 13, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[2, 4], [7, 4], [7, 9], [6, 11], [7, 13], [7, 21], [2, 21]], PINE); // the shaped end of the rack
      c.col(2, 4, 21, L(PINE));
      c.rect(1, 2, 8, 3, PINE);
      c.row(2, 1, 8, L(PINE));
      c.row(10, 3, 6, D(PINE));
      c.row(16, 3, 7, D(PINE));
      board(c, 1, 22, 11, 23, PINE);
      cabSide(c, 2, 24, 10, b - 1, PINE);
      c.rect(2, b, 3, b, D(PINE));
      c.rect(9, b, 10, b, D(PINE));
      c.rect(8, 6, 8, 9, CHINA); // plates, edge on
      if (!u) c.rect(8, 12, 8, 15, CHINA);
      else {
        c.rect(11, 26, 13, 29, L(PINE));
        c.row(25, 11, 13, C.steel);
        c.set(14, 27, C.iron);
        shards(c, 11, 15, b, CHINA, 4);
      }
    },
    su: [0, 0, 4],
  });

  /* ---------- water and washing ---------- */
  add('tin-bath-fireside', 'tin bath zinc bathtub fireside bath night tub hot water', {
    w: 34, h: 14, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        wat = hex('#6f8f98');
      c.poly([[1, 3], [32, 3], [29, b], [4, b]], TIN);
      c.row(3, 1, 32, L(TIN));
      c.row(2, 2, 31, D(TIN)); // the far rim
      c.row(3, 3, 30, u ? wat : mix(TIN, 0.5));
      if (u) dots(c, C.white, [6, 3, 14, 3, 22, 3]);
      c.row(4, 1, 32, L(TIN));
      c.line(2, 5, 5, b, L(TIN));
      for (let x = 9; x < 28; x += 6) c.col(x, 5, b - 1, D(TIN));
      c.row(b, 4, 29, D(TIN));
      c.rect(2, 6, 2, 8, C.iron); // handles
      c.rect(31, 6, 31, 8, C.iron);
      dots(c, C.rust, [12, 9, 13, 10, 25, 8]);
      if (u) {
        wisp(c, 8, 1, 3, C.ghost);
        wisp(c, 18, 1, 4, C.ghost);
        wisp(c, 26, 1, 3, C.ghost);
        c.poly([[22, 2], [27, 2], [28, 9], [23, 9]], CHINA); // a towel over the rim
        c.line(24, 3, 25, 8, D(CHINA));
        c.rect(1, b, 3, b, wat); // a puddle
      }
    },
    u: [0, 3, 0],
    sw: 18, sh: 14,
    s(c, u) {
      const b = c.h - 2,
        wat = hex('#6f8f98');
      c.poly([[1, 3], [16, 3], [14, b], [3, b]], TIN);
      c.row(2, 2, 15, D(TIN));
      c.row(3, 3, 14, u ? wat : mix(TIN, 0.5));
      c.row(4, 1, 16, L(TIN));
      c.line(2, 5, 3, b, L(TIN));
      c.row(b, 3, 14, D(TIN));
      c.rect(7, 6, 10, 6, C.iron); // the handle on the end
      c.set(7, 7, C.iron);
      c.set(10, 7, C.iron);
      if (u) {
        wisp(c, 5, 1, 3, C.ghost);
        wisp(c, 11, 1, 4, C.ghost);
        c.rect(11, 2, 14, 8, CHINA);
        c.col(13, 3, 8, D(CHINA));
      }
    },
    su: [0, 3, 0],
  });
  add('water-butt-tap-pail', 'water butt rain barrel tap pail bucket downpipe', {
    w: 20, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2,
        wat = hex('#6f8f98');
      c.rect(13, 1, 14, 8, TIN); // downpipe
      c.col(13, 1, 8, L(TIN));
      c.poly([[4, 8], [15, 8], [17, 16], [15, b - 3], [4, b - 3], [2, 16]], OAK);
      c.row(8, 4, 15, u ? wat : SOOT);
      c.row(9, 4, 15, L(OAK));
      for (const x of [6, 9, 12]) c.col(x, 10, b - 3, D(OAK));
      for (const y of [11, 17, b - 6]) {
        const dx = y === 17 ? 2 : 1;
        c.row(y, 4 - dx, 15 + dx, C.iron);
      }
      dots(c, C.moss, [4, b - 4, 5, b - 5, 14, b - 4, 3, b - 8]);
      c.rect(2, b - 2, 6, b, C.stone); // on blocks
      c.rect(13, b - 2, 17, b, C.stoneDark);
      c.row(b - 2, 2, 6, C.stoneLight);
      c.rect(9, b - 9, 10, b - 8, C.brass); // tap
      c.set(10, b - 10, C.brass);
      c.poly([[7, b - 5], [13, b - 5], [12, b], [8, b]], TIN); // pail
      c.row(b - 5, 7, 13, L(TIN));
      c.line(7, b - 5, 8, b, L(TIN));
      if (u) {
        c.col(10, b - 7, b - 6, wat);
        c.row(b - 5, 8, 12, wat);
        c.set(10, b - 5, C.white);
        c.col(13, b - 4, b, wat); // running over
        c.rect(12, b, 18, b, wat);
        dots(c, C.white, [15, b, 10, b - 7]);
      }
    },
    sw: 20, sh: 30,
    s(c, u) {
      const b = c.h - 2,
        wat = hex('#6f8f98');
      c.rect(2, 1, 3, 8, TIN);
      c.poly([[3, 8], [12, 8], [14, 16], [12, b - 3], [3, b - 3], [1, 16]], OAK);
      c.row(8, 3, 12, u ? wat : SOOT);
      c.row(9, 3, 12, L(OAK));
      for (const x of [5, 9]) c.col(x, 10, b - 3, D(OAK));
      for (const y of [11, 17, b - 6]) {
        const dx = y === 17 ? 2 : 1;
        c.row(y, 3 - dx, 12 + dx, C.iron);
      }
      c.rect(2, b - 2, 13, b, C.stone);
      c.row(b - 2, 2, 13, C.stoneLight);
      c.row(b - 9, 14, 15, C.brass); // the tap, pointing right
      c.set(15, b - 8, C.brass);
      c.set(14, b - 10, C.brass);
      c.poly([[12, b - 5], [18, b - 5], [17, b], [13, b]], TIN);
      c.row(b - 5, 12, 18, L(TIN));
      if (u) {
        c.col(15, b - 7, b - 6, wat);
        c.row(b - 5, 13, 17, wat);
        c.col(18, b - 4, b, wat);
        c.set(15, b - 5, C.white);
      }
    },
  });

  /* ---------- floor and fuel ---------- */
  add('rag-rug-oval', 'rag rug oval braided mat floor rug hearth rug trapdoor ring', {
    w: 32, h: 7, o: { shade: false },
    f(c, u) {
      c.oval(1, 1, 30, 5, MADDER);
      c.oval(3, 2, 28, 4, BLUE);
      c.row(3, 6, 25, TICK);
      c.row(3, 10, 21, MADDER);
      dots(c, D(MADDER), [4, 1, 9, 1, 15, 1, 21, 1, 26, 1, 6, 5, 12, 5, 19, 5, 25, 5]);
      dots(c, L(BLUE), [8, 2, 16, 2, 23, 2, 11, 4, 20, 4]);
      if (u) {
        c.clearRect(22, 0, 31, 6); // one end turned back: an iron ring in the boards
        c.poly([[17, 1], [22, 1], [22, 5], [19, 5]], hex('#8a7a5a'));
        c.line(17, 1, 19, 5, D(hex('#8a7a5a')));
        c.rect(24, 4, 30, 4, hex('#3a2c24'));
        c.col(24, 2, 4, hex('#3a2c24'));
        c.rect(26, 2, 28, 3, C.iron);
        c.set(27, 3, hex('#3a2c24'));
      }
    },
    sw: 18, sh: 7,
    s(c, u) {
      c.oval(1, 1, 16, 5, MADDER);
      c.oval(3, 2, 14, 4, BLUE);
      c.row(3, 5, 12, TICK);
      c.row(3, 7, 10, MADDER);
      dots(c, D(MADDER), [4, 1, 9, 1, 13, 1, 6, 5, 11, 5]);
      if (u) {
        c.clearRect(1, 4, 16, 6);
        c.rect(3, 3, 14, 4, hex('#8a7a5a')); // the near edge folded back
        c.row(4, 3, 14, D(hex('#8a7a5a')));
        c.rect(7, 5, 9, 5, C.iron);
      }
    },
  });
  add('peat-stack-slane', 'peat stack turf pile fuel bog slane spade creel', {
    w: 30, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2,
        top = u ? 9 : 3;
      for (let y = b, k = 0; y >= top; y -= 2, k++) {
        const x0 = 1 + Math.min(k, 4) + (u && k > 2 ? 5 : 0),
          x1 = 21 - Math.min(k, 3);
        for (let x = x0 + (k % 2); x < x1; x += 4) {
          c.rect(x, y - 1, Math.min(x + 2, x1), y, TURF);
          c.row(y - 1, x, Math.min(x + 2, x1), hex('#5a4634'));
          c.set(x + 3, y, hex('#2a201c'));
          c.set(x + 3, y - 1, hex('#2a201c'));
        }
      }
      c.line(26, 2, 24, b - 4, PINE); // the slane
      c.rect(22, b - 4, 24, b, C.iron);
      c.col(22, b - 4, b, C.steel);
      c.row(1, 25, 28, PINE);
      c.set(25, b - 3, C.iron);
      if (u) {
        const wk = hex('#8a7448'); // a creel filled from it
        c.poly([[8, b - 7], [16, b - 7], [15, b], [9, b]], wk);
        for (let x = 9; x < 16; x += 2) c.col(x, b - 6, b, D(wk));
        c.row(b - 7, 8, 16, L(wk));
        c.rect(9, b - 9, 15, b - 8, TURF);
        c.row(b - 9, 10, 14, hex('#5a4634'));
        dots(c, TURF, [18, b, 19, b, 5, b - 1]);
      }
    },
    sw: 16, sh: 19,
    s(c, u) {
      const b = c.h - 2,
        top = u ? 9 : 3;
      for (let y = b, k = 0; y >= top; y -= 2, k++) {
        const x0 = 2 + Math.min(k, 3),
          x1 = 12 - Math.min(k, 3);
        c.rect(x0, y - 1, x1, y, TURF);
        c.row(y - 1, x0, x1, hex('#5a4634'));
        for (let x = x0 + 2 + (k % 2); x < x1; x += 3) c.col(x, y - 1, y, hex('#2a201c'));
      }
      c.line(13, 2, 12, b - 4, PINE);
      c.rect(12, b - 4, 13, b, C.iron);
      c.row(1, 12, 14, PINE);
      if (u) dots(c, TURF, [1, b, 14, b]);
    },
  });
  const logEnd = (c, x, y, r = 2) => {
    c.oval(x - r, y - r, x + r, y + r, hex('#5a4634'));
    c.oval(x - r + 1, y - r + 1, x + r - 1, y + r - 1, hex('#b89a6a'));
    c.set(x, y, hex('#8a6a44'));
  };
  add('wood-pile-chopping-block', 'wood pile logs firewood chopping block axe stack', {
    w: 32, h: 20, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - (r > 1 ? 1 : 0); i++) logEnd(c, 3 + i * 5 + (r % 2) * 2 + (r > 1 ? 1 : 0), b - 2 - r * 4, 2);
      logEnd(c, 9, b - 14, 2);
      const blk = hex('#6a5640');
      c.rect(22, b - 6, 29, b, blk); // the block
      c.row(b - 7, 23, 28, hex('#b89a6a'));
      c.col(22, b - 6, b, L(blk));
      dots(c, D(blk), [25, b - 3, 27, b - 1, 24, b - 5]);
      if (!u) {
        c.line(26, b - 8, 30, 3, PINE); // the axe stuck in it
        c.rect(24, b - 10, 26, b - 8, C.iron);
        c.row(b - 8, 23, 26, C.steel);
      } else {
        c.row(b - 7, 24, 27, C.blood); // the axe gone; something was killed here
        c.col(25, b - 6, b - 3, C.blood);
        c.set(28, b - 5, C.blood);
        dots(c, C.white, [20, b, 30, b - 1, 21, b - 2]); // feathers
        c.rect(17, b - 1, 20, b, hex('#b89a6a')); // split billets
        c.row(b, 17, 20, hex('#8a6a44'));
        c.set(26, b - 8, hex('#3a2c24'));
      }
    },
    sw: 16, sh: 20,
    s(c, u) {
      const b = c.h - 2,
        bark = hex('#5a4634');
      for (let r = 0; r < 4; r++) {
        const y = b - r * 4 - (r === 3 ? 0 : 0),
          x1 = 12 - (r > 2 ? 3 : 0);
        c.rect(2 + (r > 2 ? 2 : 0), y - 3, x1, y, bark);
        c.row(y - 3, 2 + (r > 2 ? 2 : 0), x1, L(bark));
        c.row(y, 2 + (r > 2 ? 2 : 0), x1, D(bark));
        c.set(x1, y - 2, hex('#b89a6a'));
        c.set(x1, y - 1, hex('#b89a6a'));
      }
      if (!u) {
        c.line(8, 5, 10, 1, PINE); // the axe behind, over the top
        c.set(11, 1, PINE);
      } else {
        dots(c, C.white, [14, b, 1, b]);
        c.set(13, b, C.blood);
      }
    },
  });
};
