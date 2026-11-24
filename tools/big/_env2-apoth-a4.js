/* Apothecary, fourth part: small things of the trade. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, legs, hollow, flame, wisp, bottle, shards, glow, puddle, books } = H;
  const add = H.reg('env-apothecary', 'Apothecary');
  const MAH = hex('#5a3226'),
    OAK = hex('#6a4a32'),
    PINE = hex('#94714a'),
    EB = hex('#2b242a'),
    BR = C.brass,
    GILT = C.gold,
    CHINA = hex('#d6d2c4'),
    DELFT = hex('#44506e'),
    PEWTER = hex('#8a8c90'),
    RED = hex('#8a2f2c'),
    GREEN = hex('#3e6a4c'),
    BLUE = hex('#3d5a80'),
    AMBER = hex('#a8762c'),
    COBALT = hex('#2f3f6e'),
    LEATHER = hex('#4a2e28'),
    DRIED = hex('#7a6a45'),
    BONE = C.bone;

  add('apoth-pestle-mortar-brass', 'apothecary pestle and mortar brass grinding bowl small powder', {
    w: 10, h: 11,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 5, 7, b - 1, BR);
      c.row(b - 6, 1, 8, L(BR));
      c.col(2, b - 5, b - 1, L(BR));
      c.row(b, 3, 6, D(BR));
      c.row(b - 3, 2, 7, D(BR));
      if (!u) {
        c.line(5, b - 6, 7, b - 9, BR);
        c.set(8, b - 9, L(BR));
      } else {
        c.row(b, 1, 8, D(BR)); // the pestle laid down, the powder heaped
        c.clearRect(0, b, 9, b);
        c.row(b, 3, 6, D(BR));
        dots(c, CHINA, [3, b - 7, 4, b - 7, 5, b - 7, 6, b - 7, 4, b - 8, 5, b - 8]);
        c.rect(9, b, 13, b, BR);
        c.set(14, b, L(BR));
        dots(c, CHINA, [8, b - 6 + 6, 0, b]);
      }
    },
    u: [1, 0, 5],
  });

  add('apoth-mortar-stone-block', 'apothecary great stone mortar on a wooden block long pestle pounding drugs', {
    w: 14, h: 26, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, b - 8, 10, b, OAK); // the block, a sawn trunk
      for (const x of [5, 8]) c.col(x, b - 7, b, D(OAK));
      c.row(b - 4, 3, 10, C.iron);
      c.rect(2, b - 15, 11, b - 9, C.stone);
      c.row(b - 16, 1, 12, C.stoneLight);
      c.col(2, b - 15, b - 9, C.stoneLight);
      c.row(b - 9, 3, 10, C.stoneDark);
      c.speckle(2, b - 15, 11, b - 9, C.stoneDark, 7, 3);
      if (!u) {
        c.line(7, b - 17, 10, b - 23, PINE);
        c.set(10, b - 24, D(PINE));
        c.set(11, b - 23, D(PINE));
      } else {
        c.col(6, b - 23, b - 17, PINE); // the pestle standing in it, the work half done
        c.col(7, b - 23, b - 17, D(PINE));
        c.rect(5, b - 24, 8, b - 24, D(PINE));
        dots(c, DRIED, [3, b - 17, 4, b - 17, 9, b - 17, 10, b - 17, 12, b - 9, 1, b - 10, 11, b, 1, b]);
        dots(c, BONE, [8, b - 17, 12, b]); // not all of it was root
      }
    },
  });

  add('apoth-bleeding-bowl-stool', 'apothecary bleeding bowl pewter on a stool lancet bloodletting barber surgeon', {
    w: 14, h: 15,
    f(c, u) {
      const b = c.h - 2;
      board(c, 2, b - 7, 11, b - 6, OAK);
      c.line(3, b - 5, 2, b, OAK);
      c.line(10, b - 5, 11, b, D(OAK));
      c.row(b - 3, 4, 9, D(OAK));
      c.rect(3, b - 10, 9, b - 8, PEWTER);
      c.row(b - 10, 2, 10, L(PEWTER));
      c.set(3, b - 8, null);
      c.set(9, b - 8, null);
      c.rect(11, b - 10, 12, b - 10, PEWTER); // its ear
      if (!u) {
        c.row(b - 8, 10, 11, C.steel); // the lancet
        c.set(12, b - 8, EB);
      } else {
        c.row(b - 10, 3, 9, C.blood);
        dots(c, hex('#b3342c'), [4, b - 10, 7, b - 10]);
        c.col(4, b - 9, b - 8, C.blood);
        c.col(6, b - 5, b - 3, C.blood);
        puddle(c, 4, 8, b, C.blood);
        c.rect(10, b - 8, 12, b - 8, CHINA); // a rag
        c.set(11, b - 8, C.blood);
      }
    },
    sw: 12, sh: 15,
    s(c, u) {
      const b = c.h - 2;
      board(c, 2, b - 7, 9, b - 6, OAK);
      c.line(3, b - 5, 2, b, OAK);
      c.line(8, b - 5, 9, b, D(OAK));
      c.row(b - 3, 4, 7, D(OAK));
      c.rect(3, b - 10, 8, b - 8, PEWTER);
      c.row(b - 10, 2, 9, L(PEWTER));
      c.set(3, b - 8, null);
      c.set(8, b - 8, null);
      if (u) {
        c.row(b - 10, 3, 8, C.blood);
        c.col(7, b - 9, b - 8, C.blood);
        c.col(8, b - 5, b - 3, C.blood);
        puddle(c, 6, 9, b, C.blood);
      }
    },
  });

  add('apoth-laudanum-bottles', 'apothecary laudanum bottles three labelled poison blue ribbed tincture opium small', {
    w: 13, h: 12,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 6, 3, b, AMBER);
      c.col(1, b - 6, b, L(AMBER));
      c.rect(2, b - 8, 2, b - 7, AMBER);
      c.set(2, b - 9, C.parchment);
      c.rect(1, b - 4, 3, b - 2, C.paper);
      c.set(2, b - 3, RED);
      c.rect(5, b - 5, 7, b, COBALT);
      c.col(5, b - 5, b, L(COBALT));
      c.col(7, b - 5, b, D(COBALT));
      c.rect(6, b - 7, 6, b - 6, COBALT);
      c.set(6, b - 8, C.parchment);
      c.set(6, b - 3, BONE);
      if (!u) {
        c.rect(9, b - 4, 10, b, GREEN);
        c.set(9, b - 5, GREEN);
        c.set(9, b - 6, C.parchment);
        c.set(9, b - 4, L(GREEN));
        c.set(10, b - 2, C.paper);
      } else {
        c.rect(9, b - 1, 13, b, mix(GREEN, 1.2)); // emptied and dropped
        c.set(14, b - 1 + 0, GREEN);
        c.set(11, b - 1, C.paper);
        c.set(8, b - 9, C.parchment);
        c.clear(2, b - 9); // the cork out of the laudanum
        c.clear(8, b - 9);
        c.set(4, b, C.parchment);
        c.rect(1, b - 6, 3, b - 5, mix(AMBER, 0.55));
      }
    },
    u: [0, 0, 3],
  });

  add('apoth-pill-boxes-stack', 'apothecary pill boxes stack round chip boxes labelled pills powders small', {
    w: 11, h: 10,
    f(c, u) {
      const b = c.h - 2;
      const BOX = hex('#b0a37e');
      c.rect(1, b - 2, 8, b, BOX);
      c.row(b - 2, 1, 8, L(BOX));
      c.rect(3, b - 1, 6, b - 1, RED);
      c.rect(2, b - 5, 7, b - 3, BOX);
      c.row(b - 5, 2, 7, L(BOX));
      c.rect(4, b - 4, 5, b - 4, DELFT);
      if (!u) {
        c.rect(3, b - 7, 6, b - 6, BOX);
        c.row(b - 7, 3, 6, L(BOX));
      } else {
        c.rect(3, b - 6, 6, b - 6, BOX); // the top one open
        c.row(b - 7, 3, 6, hex('#3a3024'));
        dots(c, CHINA, [4, b - 7, 5, b - 7, 9, b, 10, b - 1 + 1, 0, b]);
        c.rect(8, b - 4, 9, b - 3, BOX); // its lid
        c.clear(0, b);
      }
    },
    u: [0, 0, 1],
  });

  add('apoth-retort-spirit-lamp', 'apothecary glass retort on a tripod spirit lamp distilling flask chemistry small', {
    w: 16, h: 16,
    f(c, u) {
      const b = c.h - 2;
      c.row(b - 6, 2, 9, C.iron); // the tripod
      c.line(2, b - 5, 1, b, C.iron);
      c.line(9, b - 5, 10, b, C.ironDark);
      c.oval(2, b - 13, 9, b - 7, C.glass); // the retort
      c.set(4, b - 11, C.glassLight);
      c.line(8, b - 13, 13, b - 9, C.glass);
      c.line(9, b - 13, 14, b - 9, C.glassLight);
      c.rect(4, b - 9, 7, b - 8, u ? RED : hex('#7a3a30'));
      c.rect(4, b - 2, 7, b, BR); // the lamp
      c.set(5, b - 3, EB);
      c.rect(12, b - 4, 14, b, C.glass); // the receiver
      c.set(12, b - 4, C.glassLight);
      if (u) {
        flame(c, 5, b - 4, 3);
        c.rect(3, b - 10, 8, b - 8, RED);
        dots(c, hex('#c05a4a'), [4, b - 11, 6, b - 12, 7, b - 10]);
        c.set(14, b - 7, RED);
        c.rect(12, b - 1, 14, b, RED);
        wisp(c, 13, b - 6, 2, C.ghost);
      }
    },
  });

  add('apoth-surgeon-saw-case', 'apothecary surgeon instrument case amputation saw knives velvet lined box', {
    w: 18, h: 9,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 4, 16, b, MAH);
      dots(c, BR, [1, b, 16, b, 1, b - 4, 16, b - 4]);
      if (!u) {
        c.rect(8, b - 3, 9, b - 2, BR);
        c.row(b - 5, 2, 15, L(MAH));
      } else {
        face(c, 1, b - 12, 16, b - 5, MAH); // open: the saw in its velvet
        c.rect(2, b - 11, 15, b - 6, C.wine);
        c.row(b - 9, 4, 12, C.steel);
        for (let x = 4; x <= 12; x += 2) c.set(x, b - 8, C.steel);
        c.rect(13, b - 10, 14, b - 8, EB);
        c.row(b - 6, 3, 9, C.steel);
        c.set(10, b - 6, EB);
        dots(c, C.blood, [5, b - 9, 6, b - 9, 6, b - 8, 7, b - 9]);
        c.row(b - 4, 2, 15, mix(C.wine, 0.6));
        c.rect(5, b - 4, 9, b - 4, C.wine); // one bed in the tray is empty
        c.set(3, b - 4, C.steel);
        c.set(12, b - 4, C.steel);
      }
    },
    sw: 10, sh: 9,
    s(c, u) {
      const b = c.h - 2;
      face(c, 1, b - 4, 8, b, MAH);
      dots(c, BR, [1, b, 8, b]);
      if (!u) c.row(b - 5, 2, 7, L(MAH));
      else {
        c.rect(1, b - 12, 2, b - 5, MAH);
        c.col(1, b - 12, b - 5, L(MAH));
        c.col(3, b - 11, b - 6, C.wine);
        c.row(b - 4, 3, 7, mix(C.wine, 0.6));
        c.set(3, b - 9, C.steel);
      }
    },
    u: [0, 8, 0], su: [0, 8, 0],
  });

  add('apoth-doctor-bag-leather', 'apothecary doctor bag leather gladstone physician black case instruments', {
    w: 15, h: 12,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 6, 12, b, LEATHER);
      c.col(1, b - 6, b, L(LEATHER));
      c.row(b, 1, 12, D(LEATHER));
      if (!u) {
        c.poly([[2, b - 7], [11, b - 7], [10, b - 9], [3, b - 9]], LEATHER);
        c.row(b - 9, 3, 10, L(LEATHER));
        c.row(b - 7, 1, 12, BR);
        c.rect(5, b - 11, 8, b - 10, EB);
        c.clear(6, b - 10);
        c.clear(7, b - 10);
        c.rect(6, b - 6, 7, b - 5, BR);
      } else {
        c.row(b - 7, 1, 12, BR); // gaping
        c.rect(2, b - 8, 11, b - 7, hex('#1c1618'));
        c.row(b - 9, 1, 12, BR);
        c.col(4, b - 12, b - 8, C.steel); // what sticks out of it
        c.col(7, b - 11, b - 8, C.glass);
        c.set(7, b - 12, C.parchment);
        c.line(9, b - 8, 11, b - 12, hex('#7a3a30'));
        c.set(4, b - 13, C.steel);
        c.rect(13, b, 15, b, CHINA); // a roll of bandage on the floor
        c.rect(13, b - 1, 14, b - 1, CHINA);
        c.set(14, b - 1, C.blood);
      }
    },
    sw: 9, sh: 12,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 6, 6, b, LEATHER);
      c.col(1, b - 6, b, L(LEATHER));
      c.row(b, 1, 6, D(LEATHER));
      if (!u) {
        c.poly([[2, b - 7], [5, b - 7], [4, b - 9], [3, b - 9]], LEATHER);
        c.row(b - 7, 1, 6, BR);
        c.rect(3, b - 11, 4, b - 10, EB);
      } else {
        c.row(b - 7, 0, 7, BR);
        c.rect(1, b - 8, 6, b - 8, hex('#1c1618'));
        c.row(b - 9, 0, 7, BR);
        c.col(3, b - 12, b - 9, C.steel);
        c.col(5, b - 11, b - 9, C.glass);
      }
    },
    u: [0, 3, 3], su: [1, 3, 1],
  });

  add('apoth-skull-on-books', 'apothecary skull on a pile of books memento mori candle study human bone', {
    w: 12, h: 15,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 2, 10, b, C.wine);
      c.row(b - 2, 1, 10, L(C.wine));
      c.col(10, b - 1, b, C.paper);
      c.rect(2, b - 5, 9, b - 3, C.forest);
      c.row(b - 5, 2, 9, L(C.forest));
      c.col(2, b - 4, b - 3, C.paper);
      c.set(6, b - 4, GILT);
      c.oval(3, b - 11, 8, b - 6, BONE);
      c.rect(4, b - 6, 7, b - 6, D(BONE));
      dots(c, K, [4, b - 8, 7, b - 8, 5, b - 7 + 1, 6, b - 6]);
      c.set(3, b - 10, L(BONE));
      if (u) {
        c.rect(5, b - 14, 6, b - 12, CHINA); // a candle stuck on its crown, lit
        flame(c, 5, b - 15, 2);
        dots(c, CHINA, [4, b - 11, 7, b - 10, 7, b - 11]);
        dots(c, C.flameLight, [4, b - 8, 7, b - 8]); // and the eyes have caught the light
      }
    },
    sw: 12, sh: 15,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 2, 9, b, C.wine);
      c.row(b - 2, 2, 9, L(C.wine));
      c.rect(2, b - 1, 9, b - 1, C.paper);
      c.rect(3, b - 5, 8, b - 3, C.forest);
      c.row(b - 5, 3, 8, L(C.forest));
      c.rect(3, b - 4, 8, b - 4, C.paper);
      c.oval(2, b - 11, 8, b - 6, BONE);
      c.rect(6, b - 6, 8, b - 6, D(BONE));
      c.set(2, b - 6, null);
      c.set(7, b - 8, K);
      c.set(8, b - 7, K);
      if (u) {
        c.rect(5, b - 14, 6, b - 12, CHINA);
        flame(c, 5, b - 15, 2);
        c.set(7, b - 8, C.flameLight);
      }
    },
    u: [0, 3, 0], su: [0, 3, 0],
  });

  add('apoth-horn-lantern', 'apothecary horn lantern tin candle lantern night visit handle small', {
    w: 8, h: 13,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 7, 6, b - 1, hex('#5a5a62'));
      c.rect(2, b - 6, 5, b - 2, u ? C.flameLight : hex('#9a8a5a'));
      c.col(1, b - 7, b - 1, PEWTER);
      if (u) {
        c.rect(3, b - 5, 4, b - 3, C.white);
        dots(c, C.glow, [0, b - 4, 7, b - 4]);
      } else c.col(3, b - 4, b - 2, hex('#b0a37e'));
      c.row(b, 1, 6, hex('#3a3a42'));
      c.poly([[1, b - 8], [6, b - 8], [4, b - 10], [3, b - 10]], hex('#5a5a62'));
      c.set(3, b - 10, PEWTER);
      c.rect(3, b - 11, 4, b - 11, C.iron);
    },
  });

  add('apoth-recipe-scroll-inkwell', 'apothecary recipe scroll parchment inkwell quill formula receipt writing small', {
    w: 14, h: 10,
    f(c, u) {
      const b = c.h - 2;
      c.rect(10, b - 2, 12, b, EB); // inkwell
      c.row(b - 3, 11, 11, EB);
      c.line(11, b - 4, 12, b - 8, C.white);
      if (!u) {
        c.rect(1, b - 2, 8, b, C.parchment);
        c.row(b - 2, 1, 8, L(C.parchment));
        c.col(1, b - 2, b, D(C.parchment));
        c.set(1, b - 1, mix(C.parchment, 0.5));
        c.col(5, b - 2, b, RED); // its ribbon
      } else {
        c.rect(1, b - 6, 8, b, C.parchment); // unrolled against the well
        c.row(b, 1, 8, D(C.parchment));
        c.row(b - 7, 1, 8, D(C.parchment));
        for (let y = b - 5; y < b; y += 2) c.row(y, 2, y === b - 3 ? 5 : 7, C.slate);
        dots(c, RED, [6, b - 1, 7, b - 1]);
        dots(c, K, [9, b, 8, b - 1 + 1]); // ink run across the corner
        c.set(8, b - 1, K);
      }
    },
    u: [0, 0, 0],
  });
};
