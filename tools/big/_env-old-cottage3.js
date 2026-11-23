/* Cottage, third part: the door and the yard, meat and sacks, the privy. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, legs, hollow, wisp, cloth, planksV, planksH, stones, heap, wheel } = H;
  const add = H.reg('env-cottage', 'Cottage');
  const PINE = hex('#94714a'),
    OAK = hex('#5c4432'),
    GREYW = hex('#7a6e60'),
    WHITEW = hex('#b4ae9c'),
    SOOT = hex('#221d22'),
    TIN = hex('#858a92'),
    MADDER = hex('#7a3a30'),
    CHINA = hex('#d6d2c4'),
    STRAW = C.straw,
    SACK = hex('#9a8a62'),
    DOORG = hex('#4a5a44'),
    LOG = hex('#b89a6a'),
    BARK = hex('#5a4634');
  const planks = (c, x0, y0, x1, y1, col, step = 4) => {
    face(c, x0, y0, x1, y1, col);
    planksV(c, x0, y0 + 1, x1, y1, D(col), step);
  };

  add('half-door-cottage', 'half door stable door cottage door green planks latch dutch door', {
    w: 20, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 18, b, OAK); // frame
      c.row(2, 1, 18, L(OAK));
      c.col(1, 2, b, L(OAK));
      if (!u) {
        planks(c, 3, 4, 16, 18, DOORG, 4);
        c.row(7, 3, 12, C.iron); // strap hinges
        c.row(15, 3, 12, C.iron);
      } else {
        c.rect(3, 4, 16, 18, SOOT); // the top half open: the dark inside, a glint of something
        c.col(3, 4, 18, DOORG);
        c.col(4, 4, 18, D(DOORG));
        dots(c, hex('#3a3238'), [8, 8, 12, 12, 9, 15]);
        c.rect(11, 9, 12, 9, C.glow);
        c.set(14, 9, C.glow);
      }
      c.row(19, 3, 16, SOOT);
      planks(c, 3, 20, 16, b, DOORG, 4);
      c.row(23, 3, 12, C.iron);
      c.row(b - 4, 3, 12, C.iron);
      c.rect(14, 21, 15, 22, C.iron); // latch
      dots(c, PINE, [6, b - 1, 10, b, 13, b - 2, 5, 27]); // paint gone at the foot
      c.row(b, 3, 16, D(DOORG));
    },
    sw: 7, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 4, b, OAK);
      c.row(2, 1, 4, L(OAK));
      c.col(1, 2, b, L(OAK));
      c.col(4, 20, b, DOORG);
      if (!u) c.col(4, 4, 18, DOORG);
      else {
        c.col(4, 4, 18, SOOT);
        planks(c, 5, 4, 17, 18, DOORG, 4); // the top half, standing out
        c.row(7, 5, 13, C.iron);
        c.row(15, 5, 13, C.iron);
        c.row(18, 5, 17, D(DOORG));
      }
    },
    su: [0, 0, 12],
  });
  add('privy-outhouse', 'privy outhouse earth closet toilet shed garden door moon', {
    w: 20, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      planks(c, 2, 5, 17, b, GREYW, 4);
      c.poly([[1, 5], [1, 3], [18, 1], [18, 5]], hex('#3a3438')); // roof
      c.line(1, 3, 18, 1, hex('#5a5258'));
      if (!u) {
        c.frame(4, 8, 15, b, D(GREYW)); // the door
        c.row(12, 5, 14, D(GREYW));
        c.row(b - 6, 5, 14, D(GREYW));
        c.line(5, b - 7, 14, 13, D(GREYW));
        c.rect(9, 9, 10, 10, SOOT); // a crescent cut in it
        c.set(10, 9, GREYW);
        c.rect(13, 22, 14, 23, C.iron);
      } else {
        c.rect(4, 8, 15, b, SOOT);
        c.rect(16, 8, 17, b, L(GREYW)); // the door, edge on
        c.col(17, 8, b, GREYW);
        board(c, 4, 24, 15, 25, PINE); // the seat
        c.rect(8, 24, 11, 24, SOOT);
        planks(c, 4, 26, 15, b, PINE, 4);
        c.rect(12, 14, 14, 17, C.paper); // squares of newspaper on a nail
        c.row(15, 12, 14, C.slate);
        c.set(13, 13, C.iron);
        dots(c, K, [6, 12, 9, 17, 7, 20]); // flies
        c.set(5, 22, C.glow); // a candle end
        c.set(5, 23, CHINA);
      }
      dots(c, C.moss, [2, b, 3, b - 1, 17, b, 2, b - 5]);
    },
    sw: 20, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      planks(c, 2, 5, 15, b, GREYW, 4);
      c.poly([[1, 6], [1, 2], [16, 4], [16, 6]], hex('#3a3438'));
      c.line(1, 2, 16, 4, hex('#5a5258'));
      c.rect(7, 12, 9, 13, SOOT); // a vent
      dots(c, C.moss, [2, b, 3, b - 1, 12, b]);
      if (u) {
        face(c, 16, 8, 27, b, GREYW); // the door open
        planksV(c, 16, 9, 27, b, D(GREYW), 4);
        c.row(12, 17, 26, D(GREYW));
        c.row(b - 6, 17, 26, D(GREYW));
        c.rect(21, 9, 22, 10, SOOT);
        c.set(25, 22, C.iron);
      } else c.col(15, 8, b, D(GREYW));
    },
    su: [0, 0, 10],
  });

  /* ---------- beds and brooms ---------- */
  add('straw-pallet-bed', 'straw pallet bed mattress floor sackcloth blanket poor bed', {
    w: 36, h: 11, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b - 3, 34, b, SACK);
      c.row(b - 3, 2, 33, L(SACK));
      c.row(b, 1, 34, D(SACK));
      dots(c, D(SACK), [8, b - 1, 16, b - 2, 25, b - 1, 30, b - 2]);
      dots(c, STRAW, [1, b - 1, 0, b, 34, b - 2, 35, b, 12, b]);
      c.rect(2, b - 6, 8, b - 4, hex('#b0a890')); // bolster
      c.row(b - 6, 3, 7, L(hex('#b0a890')));
      const bl = hex('#5f5a58');
      if (!u) {
        c.rect(10, b - 5, 33, b - 3, bl);
        c.row(b - 5, 10, 33, L(bl));
        c.row(b - 3, 10, 33, MADDER);
      } else {
        c.poly([[20, b - 3], [23, b - 8], [30, b - 8], [34, b - 5], [34, b - 2], [20, b - 2]], bl); // thrown back in a heap
        c.line(20, b - 3, 23, b - 8, L(bl));
        c.row(b - 8, 23, 30, L(bl));
        c.line(26, b - 7, 24, b - 3, D(bl));
        c.row(b - 4, 28, 34, MADDER);
        c.rect(5, b - 5, 6, b - 5, D(hex('#b0a890'))); // where a head lay
        dots(c, STRAW, [11, b - 4, 14, b - 3, 17, b - 4]);
      }
    },
    sw: 18, sh: 18,
    s(c, u) {
      const b = c.h - 2,
        bl = hex('#5f5a58');
      c.rect(1, 3, 16, b - 3, SACK);
      c.row(3, 2, 15, D(SACK));
      c.rect(1, b - 2, 16, b, D(SACK));
      c.row(b - 2, 1, 16, SACK);
      c.rect(3, 2, 14, 5, hex('#b0a890'));
      c.row(2, 4, 13, L(hex('#b0a890')));
      c.row(5, 3, 14, D(hex('#b0a890')));
      dots(c, STRAW, [0, b, 17, b - 1, 1, b - 1]);
      if (!u) {
        c.rect(1, 7, 16, b - 3, bl);
        c.row(7, 1, 16, L(bl));
        c.row(b - 3, 1, 16, MADDER);
      } else {
        c.poly([[1, b - 3], [16, b - 3], [16, 10], [9, 9], [1, 12]], bl);
        c.line(1, 12, 9, 9, L(bl));
        c.line(9, 9, 16, 10, L(bl));
        c.row(b - 4, 1, 16, MADDER);
        c.rect(7, 4, 9, 4, D(hex('#b0a890')));
        dots(c, STRAW, [4, 7, 8, 8, 12, 7]);
      }
    },
  });
  const besom = (c, u) => {
    const b = c.h - 2,
      tw = hex('#6a5236');
    if (!u) {
      c.line(3, 1, 5, b - 10, PINE);
      c.line(4, 1, 6, b - 10, D(PINE));
      c.poly([[4, b - 10], [7, b - 10], [8, b], [2, b]], tw);
      c.row(b - 9, 4, 7, STRAW);
      for (let x = 3; x <= 7; x += 2) c.col(x, b - 6, b, D(tw));
      dots(c, tw, [1, b, 9, b - 1]);
    } else {
      c.rect(9, b - 1, 28, b, PINE); // down on the floor
      c.row(b - 1, 9, 28, L(PINE));
      c.poly([[9, b - 2], [9, b], [1, b], [1, b - 4]], tw);
      c.col(8, b - 2, b, STRAW);
      for (let y = b - 3; y <= b; y += 2) c.row(y, 1, 6, D(tw));
      dots(c, C.ash, [12, b - 2, 15, b - 3, 14, b - 2, 17, b - 2]); // what it was sweeping
    }
  };
  add('besom-broom-twigs', 'besom broom birch twigs witch broom sweeping brush', {
    w: 10, h: 30,
    f: besom,
    us: [30, 8],
  });

  /* ---------- meat ---------- */
  add('bacon-flitch-hooks', 'bacon flitch ham hooks beam hanging meat sausages cured', {
    w: 26, h: 22,
    f(c, u) {
      const rind = hex('#7a4a30'),
        fat = hex('#d0b8a0'),
        meat = hex('#9a4a44');
      board(c, 1, 1, 24, 3, OAK);
      dots(c, D(OAK), [6, 2, 14, 2, 21, 2]);
      for (const x of [6, 15, 21]) c.col(x, 4, 5, C.iron);
      c.rect(3, 6, 10, 19, rind); // the flitch
      c.col(3, 6, 19, L(rind));
      c.row(19, 4, 9, D(rind));
      c.clear(3, 19);
      c.clear(10, 19);
      if (!u) {
        c.oval(12, 6, 18, 15, rind); // a ham
        c.rect(14, 5, 16, 6, fat);
        c.set(13, 8, L(rind));
      } else {
        c.rect(5, 13, 10, 19, fat); // cut into: fat and lean
        c.rect(6, 14, 10, 15, meat);
        c.rect(7, 17, 10, 18, meat);
        c.line(4, 12, 10, 12, D(rind));
        c.col(16, 2, 6, C.steel); // the ham gone, the knife left in the beam
        c.rect(16, 0, 16, 1, PINE);
        c.set(15, 6, C.iron);
        dots(c, hex('#b08a70'), [8, 20, 9, 21]);
      }
      for (let y = 6; y <= 16; y += 3) {
        c.rect(20, y, 22, y + 1, hex('#5a2a28')); // sausages
        c.set(20, y, hex('#7a3a34'));
      }
    },
    sw: 8, sh: 22,
    s(c, u) {
      const rind = hex('#7a4a30');
      c.rect(1, 1, 6, 3, OAK);
      c.row(1, 1, 6, L(OAK));
      c.oval(2, 2, 3, 3, hex('#3a2c24'));
      c.col(4, 4, 5, C.iron);
      c.rect(3, 6, 5, u ? 12 : 19, rind);
      c.col(3, 6, u ? 12 : 19, L(rind));
      if (u) {
        c.row(13, 3, 5, hex('#d0b8a0'));
        c.set(4, 13, hex('#9a4a44'));
        c.rect(5, 14, 5, 19, rind);
      }
    },
  });
  const rabbit = (c, x, y0, skinned) => {
    const f = skinned ? hex('#8a3a38') : hex('#7a6a58'),
      bl = skinned ? hex('#a85a50') : hex('#c8c0a8');
    c.col(x + 1, y0, y0 + 2, f); // hind legs up
    c.col(x + 2, y0 + 1, y0 + 2, f);
    c.rect(x, y0 + 3, x + 3, y0 + 10, f);
    c.col(x, y0 + 3, y0 + 10, L(f));
    c.col(x + 2, y0 + 4, y0 + 9, bl);
    c.rect(x + 1, y0 + 11, x + 2, y0 + 13, f); // head
    c.set(x + 1, y0 + 12, K);
    c.col(x, y0 + 13, y0 + 15, skinned ? f : D(f)); // ears hanging
    c.col(x + 3, y0 + 13, y0 + 15, skinned ? f : D(f));
    c.set(x + 3, y0 + 5, skinned ? f : C.white); // scut
  };
  add('game-hanging-rabbits', 'rabbits hanging game dead hares poacher larder skinned', {
    w: 14, h: 24,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, 1, 12, 2, OAK);
      dots(c, C.iron, [4, 3, 9, 3]);
      rabbit(c, 2, 3, false);
      rabbit(c, 8, 4, u);
      if (u) {
        c.set(9, b - 1, C.blood);
        c.col(10, 20, 21, C.blood);
        c.rect(8, b, 11, b, C.blood);
        c.rect(1, b - 1, 5, b, hex('#7a6a58')); // the skin on the floor
        c.set(2, b - 1, hex('#c8c0a8'));
      }
    },
    sw: 8, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 2, 2, OAK);
      c.set(3, 2, C.iron);
      rabbit(c, 3, 3, u);
      if (u) {
        c.col(5, 20, 21, C.blood);
        c.rect(3, b, 6, b, C.blood);
      }
    },
  });

  /* ---------- sacks and the cart ---------- */
  const spud = (c, x, y, sprout) => {
    c.rect(x, y, x + 1, y, hex('#7a6040'));
    c.set(x, y, hex('#9a7a50'));
    if (sprout) c.set(x + 1, y - 1, hex('#c8b8c0'));
  };
  add('potato-sacks', 'potato sacks hessian sack potatoes store spuds', {
    w: 24, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[3, 4], [10, 4], [12, b], [2, b]], SACK); // one standing, tied
      c.line(3, 4, 2, b, L(SACK));
      c.rect(5, 1, 8, 3, SACK);
      c.row(3, 5, 8, hex('#5a4a34'));
      dots(c, D(SACK), [5, 7, 8, 9, 6, 12, 9, 13, 4, 10]);
      c.poly([[11, 8], [20, 7], [22, b], [10, b]], D(SACK)); // one slumped against it
      c.poly([[12, 9], [19, 8], [21, b], [11, b]], SACK);
      dots(c, D(SACK), [14, 11, 17, 12, 15, 14]);
      if (u) {
        c.line(15, 10, 19, b - 1, SOOT); // slit open
        c.line(16, 10, 20, b - 1, hex('#5a4a34'));
        spud(c, 17, 12);
        spud(c, 18, b - 2, true);
        spud(c, 20, b);
        spud(c, 22, b - 1, true);
        spud(c, 15, b);
        spud(c, 12, b, true);
      }
    },
    sw: 13, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[3, 4], [9, 4], [10, b], [2, b]], SACK);
      c.line(3, 4, 2, b, L(SACK));
      c.rect(5, 1, 7, 3, SACK);
      c.row(3, 5, 7, hex('#5a4a34'));
      dots(c, D(SACK), [5, 7, 7, 10, 4, 12]);
      c.rect(6, b - 3, 10, b, D(SACK));
      if (u) {
        spud(c, 8, b - 2);
        spud(c, 10, b, true);
        spud(c, 11, b - 1);
      }
    },
    su: [0, 0, 1],
  });
  add('handcart-two-wheel', 'handcart cart barrow two wheels wooden shafts sacks market', {
    w: 36, h: 20, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      planks(c, 3, 8, 24, 11, GREYW, 5); // the box
      c.row(12, 3, 24, OAK);
      c.line(24, 11, 34, b - 3, OAK); // shafts down to the ground
      c.line(24, 12, 34, b - 2, D(OAK));
      c.col(27, 14, b, OAK); // prop
      wheel(c, 12, b - 5, 5, OAK, C.iron);
      if (!u) {
        c.poly([[5, 7], [6, 2], [11, 2], [12, 7]], SACK); // sacks and a crate
        c.line(5, 7, 6, 2, L(SACK));
        c.row(3, 7, 10, hex('#5a4a34'));
        c.poly([[11, 7], [13, 4], [18, 4], [19, 7]], D(SACK));
        face(c, 19, 3, 23, 7, PINE);
        c.row(5, 19, 23, D(PINE));
      } else {
        c.row(7, 4, 23, mix(GREYW, 0.5)); // empty: a few turnips, and a dark stain on the boards
        dots(c, C.blood, [9, 8, 10, 9, 14, 8, 15, 10]);
        c.rect(29, b - 1, 30, b, hex('#b0a080'));
        c.set(29, b - 2, hex('#5a7a4a'));
        c.rect(2, b - 1, 3, b, hex('#b0a080'));
        c.set(3, b - 2, hex('#5a7a4a'));
      }
    },
    sw: 20, sh: 20,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [1, 16]) {
        c.rect(x, b - 10, x + 1, b, OAK); // wheels, edge on
        c.col(x, b - 10, b, L(OAK));
      }
      planks(c, 3, 8, 15, 11, GREYW, 4);
      c.row(12, 3, 15, OAK);
      c.col(5, 12, b - 2, OAK); // the shafts, coming at us
      c.col(13, 12, b - 2, OAK);
      c.set(5, b - 1, D(OAK));
      c.set(13, b - 1, D(OAK));
      if (!u) {
        c.poly([[4, 7], [5, 2], [9, 2], [10, 7]], SACK);
        c.row(3, 6, 8, hex('#5a4a34'));
        face(c, 10, 3, 14, 7, PINE);
        c.row(5, 10, 14, D(PINE));
      } else {
        c.row(7, 4, 14, mix(GREYW, 0.5));
        dots(c, C.blood, [8, 9, 9, 10]);
        c.rect(8, b - 1, 9, b, hex('#b0a080'));
        c.set(8, b - 2, hex('#5a7a4a'));
      }
    },
  });
  add('pig-trough-wood', 'pig trough wooden feeding trough swill sty', {
    w: 28, h: 10, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        sw = hex('#8a7a4a');
      c.poly([[1, 2], [26, 2], [24, b - 1], [3, b - 1]], GREYW);
      c.row(2, 1, 26, L(GREYW));
      c.row(5, 2, 25, D(GREYW));
      c.row(3, 2, 25, u ? sw : SOOT);
      c.rect(4, b, 6, b, OAK);
      c.rect(21, b, 23, b, OAK);
      dots(c, D(GREYW), [8, 4, 15, 6, 20, 4]);
      if (u) {
        dots(c, hex('#b0a070'), [5, 3, 11, 3, 18, 3, 22, 3]);
        dots(c, sw, [9, 4, 9, 6, 16, 4, 27, b, 26, b - 1, 14, 1]);
        c.set(13, 3, hex('#c8c0a8'));
      } else dots(c, sw, [7, 3, 19, 3]);
    },
    sw: 12, sh: 10,
    s(c, u) {
      const b = c.h - 2,
        sw = hex('#8a7a4a');
      c.poly([[1, 2], [10, 2], [7, b - 1], [4, b - 1]], GREYW); // the end board, a V
      c.row(2, 1, 10, L(GREYW));
      c.row(3, 3, 8, u ? sw : SOOT);
      c.rect(2, b, 9, b, OAK);
      c.line(3, 4, 5, b - 2, D(GREYW));
      if (u) dots(c, sw, [9, 5, 10, b]);
    },
  });
  add('saw-horse-log', 'saw horse sawbuck log bow saw sawing firewood trestle', {
    w: 28, h: 17, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (const x of [5, 19]) {
        c.line(x, 4, x + 4, b, OAK); // the crosses
        c.line(x + 4, 4, x, b, D(OAK));
      }
      c.row(b - 4, 6, 21, D(OAK));
      if (!u) {
        c.rect(1, 6, 26, 9, BARK);
        c.row(6, 1, 26, L(BARK));
        c.col(26, 6, 9, LOG);
        dots(c, D(BARK), [6, 8, 13, 7, 20, 8]);
        c.line(10, 5, 11, 1, C.rust); // the bow saw left in the cut
        c.row(1, 11, 17, C.rust);
        c.line(18, 5, 17, 1, C.rust);
        c.row(6, 10, 18, C.steel);
        c.col(14, 6, 7, SOOT);
      } else {
        c.rect(1, 6, 13, 9, BARK); // sawn through: one length on the ground
        c.row(6, 1, 13, L(BARK));
        c.col(13, 6, 9, LOG);
        c.rect(14, b - 3, 26, b, BARK);
        c.row(b - 3, 14, 26, L(BARK));
        c.col(14, b - 3, b, LOG);
        c.col(26, b - 3, b, LOG);
        heap(c, 10, 15, b, 2, LOG, 3); // sawdust
        c.line(20, 3, 26, 1, C.rust); // the saw hung on the horse
        c.line(21, 6, 27, 4, C.steel);
        c.col(20, 3, 6, C.rust);
        c.col(27, 1, 4, C.rust);
      }
    },
    sw: 14, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      c.line(3, 3, 10, b, OAK);
      c.line(10, 3, 3, b, D(OAK));
      c.line(4, 3, 11, b, OAK);
      if (!u) {
        c.oval(4, 4, 9, 9, BARK);
        c.oval(5, 5, 8, 8, LOG);
        c.set(6, 6, hex('#8a6a44'));
        c.rect(6, 1, 7, 3, C.rust);
      } else {
        c.oval(4, 4, 9, 9, BARK);
        c.oval(5, 5, 8, 8, LOG);
        c.set(7, 7, hex('#8a6a44'));
        c.oval(8, b - 4, 12, b, BARK);
        c.oval(9, b - 3, 11, b - 1, LOG);
        dots(c, LOG, [5, b, 6, b, 7, b - 1]);
      }
    },
  });

  /* ---------- small things ---------- */
  add('family-bible-clasps', 'family bible book brass clasps black leather names births deaths', {
    w: 16, h: 11,
    f(c, u) {
      const b = c.h - 2,
        lea = hex('#231f24');
      c.rect(1, b, 14, b, hex('#6a5a48')); // a cloth under it
      if (!u) {
        c.rect(2, b - 5, 13, b - 1, lea);
        c.row(b - 5, 2, 13, hex('#3f3a42'));
        c.rect(3, b - 2, 13, b - 2, C.paper);
        c.rect(13, b - 4, 13, b - 1, C.brass); // clasps
        dots(c, C.brass, [2, b - 5, 2, b - 1, 7, b - 4, 8, b - 4, 7, b - 3]);
      } else {
        c.rect(1, b - 2, 14, b - 1, lea); // open at the page of names
        c.poly([[1, b - 3], [7, b - 4], [8, b - 4], [14, b - 3], [14, b - 2], [1, b - 2]], C.paper);
        c.col(7, b - 4, b - 2, D(C.paper));
        c.row(b - 5, 2, 6, C.paper);
        c.row(b - 5, 9, 13, C.paper);
        dots(c, C.slate, [2, b - 4, 4, b - 4, 3, b - 3, 5, b - 3, 10, b - 4, 12, b - 3]);
        c.rect(10, b - 3, 12, b - 3, C.blood); // one name struck out in red
        c.col(8, b - 2, b, C.wine); // ribbon
      }
    },
    sw: 12, sh: 11,
    s(c, u) {
      const b = c.h - 2,
        lea = hex('#231f24');
      c.rect(1, b, 10, b, hex('#6a5a48'));
      if (!u) {
        c.rect(2, b - 5, 9, b - 1, lea);
        c.row(b - 5, 2, 9, hex('#3f3a42'));
        c.rect(3, b - 4, 8, b - 2, C.paper); // the fore-edge
        c.row(b - 3, 3, 8, D(C.paper));
        c.rect(4, b - 5, 4, b - 1, C.brass);
        c.rect(7, b - 5, 7, b - 1, C.brass);
      } else {
        c.rect(2, b - 2, 9, b - 1, lea);
        c.rect(2, b - 4, 9, b - 3, C.paper);
        c.row(b - 5, 3, 8, C.paper);
        c.row(b - 3, 2, 9, D(C.paper));
        c.col(5, b - 2, b, C.wine);
      }
    },
  });
  add('clock-wag-at-the-wall', 'wall clock wag at the wall pendulum weights painted dial cottage clock', {
    w: 12, h: 32,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 9, 10, C.bone); // painted dial with an arch
      c.rect(3, 1, 8, 2, C.bone);
      c.frame(2, 3, 9, 10, PINE);
      c.row(1, 3, 8, PINE);
      dots(c, MADDER, [3, 4, 8, 4, 3, 9, 8, 9, 5, 2]);
      dots(c, hex('#4a6a4a'), [6, 2, 4, 4]);
      c.oval(4, 5, 7, 8, CHINA);
      c.set(5, 6, K);
      c.set(u ? 6 : 5, u ? 6 : 7, K);
      c.rect(3, 11, 8, 11, OAK);
      const wy = u ? 15 : b - 4; // the weights: wound up, or run right down
      c.col(4, 12, wy, C.iron);
      c.col(8, 12, wy - (u ? -3 : 6), C.iron);
      c.rect(3, wy + 1, 4, wy + 4, C.ironDark);
      c.rect(7, wy - (u ? -4 : 5), 8, wy - (u ? -7 : 2), C.ironDark);
      if (!u) {
        c.col(6, 12, 22, C.brass); // pendulum hanging dead
        c.oval(5, 23, 7, 25, C.brass);
      } else {
        c.line(6, 12, 9, 22, C.brass); // going again
        c.oval(8, 22, 10, 24, C.brass);
        dots(c, C.white, [5, 24, 3, 23]);
      }
    },
    sw: 7, sh: 32,
    s(c, u) {
      const b = c.h - 2,
        wy = u ? 15 : b - 4;
      c.rect(1, 1, 4, 11, PINE);
      c.col(1, 1, 11, L(PINE));
      c.col(5, 3, 10, C.bone);
      c.col(3, 12, wy, C.iron);
      c.rect(2, wy + 1, 4, wy + 4, C.ironDark);
      c.col(4, 12, 22, C.brass);
      c.rect(4, 23, 4, 25, C.brass);
      if (u) c.set(5, 24, C.white);
    },
  });
  add('clogs-by-the-door', 'clogs wooden shoes pair boots mud door', {
    w: 14, h: 8,
    f(c, u) {
      const b = c.h - 2,
        w = hex('#8a6a44'),
        clog = (x) => {
          c.rect(x, b - 2, x + 4, b, w);
          c.rect(x, b - 4, x + 2, b - 3, hex('#3a2c24'));
          c.row(b - 4, x, x + 2, hex('#5a4634'));
          c.set(x + 5, b - 1, w);
          c.set(x + 5, b, D(w));
          c.row(b - 2, x + 2, x + 4, L(w));
        };
      clog(1);
      if (!u) clog(7);
      else {
        c.rect(7, b - 1, 12, b, w); // one kicked over, mud and worse on it
        c.row(b - 1, 7, 12, L(w));
        c.rect(7, b - 1, 8, b, hex('#3a2c24'));
        dots(c, C.earth, [2, b, 4, b - 1, 10, b]);
        dots(c, C.blood, [11, b - 1, 5, b - 1]);
      }
    },
  });
};
