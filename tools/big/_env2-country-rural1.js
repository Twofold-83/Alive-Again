/* Rural, part 1: the large machines and beasts of the farm, and the yard: scarecrow, bales, coop, tank, wind
 * pump, barn door, fences and gates. Part of tools/big/env2-country.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { P, D, L, dots, board, face, panel, post, legs, planksV, planksH, boards, boardsH, hollow, pane, flame, fire, wisp, bush, stones, bricks } = H;
  const { wheel, wheelEdge, tyre, tyreEdge, barrel, sack, crate, thatch, hay, heap, blood, puddle, drip, shards, grass, crow, rope, chain, lantern, shape } = H;
  const add = H.reg('env-rural', 'Rural');
  const { OAK, GREYW, PALEW, TAR, HAY, BRICK, LIME, STONE, SOIL, MUD, SOOT, TIN, ZINC, WAT, MILK, ROPE, CANVAS, SACK, TYRE, FRED, FGREEN, FBLUE, LAMP } = P;
  const OX = hex('#7a5a40'),
    GRAIN = hex('#b09648'),
    COAT = hex('#4a4038'),
    HEN = hex('#8a5a34'),
    GLASSD = hex('#3f5a58');
  /** Corrugated iron: a face with ribs. */
  const corr = (c, x0, y0, x1, y1, col = ZINC, vertical = true) => {
    c.rect(x0, y0, x1, y1, col);
    if (vertical) for (let x = x0; x <= x1; x += 2) c.col(x, y0, y1, x % 4 ? D(col) : L(col));
    else for (let y = y0; y <= y1; y += 2) c.row(y, x0, x1, (y - y0) % 4 ? D(col) : L(col));
  };
  const rust = (c, x0, y0, x1, y1, seed = 1, n = 9) => {
    c.speckle(x0, y0, x1, y1, C.rust, n, seed);
  };
  const bale = (c, x0, y0, x1, y1, seed = 1) => {
    hay(c, x0, y0 + 1, x1, y1, seed, HAY);
    c.row(y0, x0, x1, L(HAY));
    c.row(y1, x0, x1, D(HAY));
    c.col(x1, y0, y1, D(HAY));
    if (x1 - x0 > 8) {
      c.col(x0 + 3, y0, y1, hex('#5f6a8a'));
      c.col(x1 - 3, y0, y1, hex('#5f6a8a'));
    }
  };

  /* ---------- large things ---------- */
  add('rural-tractor-old-large', 'large old tractor red rusty farm tractor big rear wheel exhaust seat', {
    w: 46, h: 32, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      for (let a = 195; a <= 345; a += 3) {
        const x = 33 + Math.cos((a * Math.PI) / 180) * 12,
          y = 20 + Math.sin((a * Math.PI) / 180) * 12;
        c.set(x, y, FRED); // the mudguard
        c.set(x, y + 1, D(FRED));
      }
      c.rect(5, 12, 25, 18, FRED); // bonnet
      c.row(12, 5, 25, L(FRED));
      c.row(18, 5, 25, D(FRED));
      c.rect(4, 13, 5, 18, C.ironDark); // grille
      c.set(4, 14, C.steel);
      c.set(4, 16, C.steel);
      rust(c, 6, 13, 24, 17, 3, 8);
      c.rect(8, 19, 23, 23, C.ironDark); // the engine
      c.row(19, 8, 23, C.iron);
      dots(c, C.steel, [11, 21, 15, 20, 19, 22]);
      dots(c, C.rust, [13, 22, 21, 20]);
      c.rect(13, 5, 14, 11, C.iron); // the stack
      c.row(4, 12, 15, C.ironDark);
      c.rect(22, 9, 23, 11, FRED); // dash
      c.line(24, 10, 27, 7, C.iron); // the wheel
      c.rect(26, 6, 29, 6, C.ironDark);
      c.rect(31, 9, 36, 10, C.iron); // the seat on its spring
      c.rect(36, 6, 37, 9, C.iron);
      c.col(33, 11, 13, C.ironDark);
      c.rect(23, 19, 27, 22, D(FRED));
      c.col(8, 19, 23, C.iron); // front axle
      tyre(c, 8, b - 5, 5, FRED);
      tyre(c, 33, b - 10, 10, FRED);
      c.rect(44, 22, 45, 23, C.iron);
      c.rect(2, 11, 3, 13, u ? LAMP : hex('#6a7a78')); // the lamp
      c.set(4, 12, C.iron);
      if (u) {
        dots(c, LAMP, [1, 12, 0, 11, 0, 13]);
        wisp(c, 13, 3, 4, hex('#5a5258'));
        dots(c, hex('#5a5258'), [15, -1, 16, -2, 12, 1]);
        dots(c, hex('#77736a'), [16, 0, 17, -3]);
        blood(c, [32, 8, 33, 8, 34, 9]); // nobody in the seat
      }
    },
    u: [1, 4, 0],
    sw: 28, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      c.rect(11, 5, 16, 8, C.ironDark); // seat and wheel behind
      c.row(6, 10, 17, C.iron);
      c.rect(1, 8, 6, 9, FRED);
      c.rect(21, 8, 26, 9, FRED);
      c.row(8, 1, 6, L(FRED));
      c.row(8, 21, 26, L(FRED));
      tyreEdge(c, 1, 10, 5, b);
      tyreEdge(c, 22, 10, 26, b);
      c.rect(9, 10, 18, 23, FRED);
      c.row(10, 9, 18, L(FRED));
      c.col(9, 10, 23, L(FRED));
      c.rect(10, 12, 17, 22, C.ironDark);
      for (let y = 13; y < 22; y += 2) c.row(y, 11, 16, C.iron);
      c.col(13, 12, 22, FRED);
      rust(c, 9, 10, 18, 23, 4, 10);
      c.row(b - 5, 6, 21, C.iron);
      tyreEdge(c, 6, b - 9, 8, b);
      tyreEdge(c, 19, b - 9, 21, b);
      c.rect(18, 3, 19, 9, C.iron);
      c.row(2, 17, 20, C.ironDark);
      for (const x of [7, 19]) {
        c.rect(x, 12, x + 1, 13, u ? LAMP : hex('#6a7a78'));
        if (u) dots(c, LAMP, [x - 1, 12, x + 2, 13, x, 14, x + 1, 11]);
      }
      if (u) {
        wisp(c, 18, 1, 4, hex('#5a5258'));
        dots(c, hex('#77736a'), [20, -2, 21, -3]);
      }
    },
    su: [0, 4, 0],
  });

  const oxSide = (c, b, down) => {
    const o = down ? 9 : 0; // sunk to the ground
    c.rect(7, 9 + o, 26, 18 + (down ? 1 : 0) + o, OX);
    c.row(9 + o, 9, 25, L(OX));
    c.rect(8, 8 + o, 12, 8 + o, OX); // the withers
    c.row(18 + o + (down ? 1 : 0), 8, 25, D(OX));
    dots(c, hex('#d0c8b0'), [14, 12 + o, 15, 13 + o, 16, 12 + o, 21, 15 + o, 22, 14 + o]); // pied
    c.col(27, 10 + o, 17 + o, D(OX)); // tail
    c.set(27, 18 + o, SOOT);
    if (!down) {
      c.rect(1, 10, 6, 15, OX);
      c.rect(0, 13, 1, 15, hex('#b09a80'));
      c.set(4, 12, SOOT);
      c.set(3, 8, C.bone);
      c.set(2, 7, C.bone);
      c.set(4, 9, C.bone);
      c.set(6, 9, D(OX));
      for (const x of [8, 23]) {
        c.rect(x, 19, x + 1, b, OX);
        c.rect(x + 3, 19, x + 4, b, D(OX));
        c.set(x, b, SOOT);
        c.set(x + 3, b, SOOT);
      }
    } else {
      c.rect(0, b - 5, 6, b, OX); // the head on the earth
      c.rect(0, b - 2, 1, b, hex('#b09a80'));
      c.set(3, b - 4, SOOT);
      c.set(4, b - 7, C.bone);
      c.set(3, b - 8, C.bone);
      c.set(5, b - 6, C.bone);
      c.rect(9, b, 14, b, D(OX));
      c.rect(20, b, 26, b, D(OX));
      c.set(15, b, SOOT);
      c.set(27, b, SOOT);
    }
  };
  add('rural-ox-plough-large', 'large ox and plough plough ox yoke furrow ploughing field beast of burden', {
    w: 48, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      oxSide(c, b, u);
      const o = u ? 9 : 0;
      c.rect(6, 7 + o, 7, 17 + o, OAK); // the yoke
      c.col(6, 7 + o, 17 + o, L(OAK));
      chain(c, 8, 14 + o, 31, u ? 21 : 18);
      c.line(30, 18, 44, 16, OAK); // the beam
      c.line(30, 19, 44, 17, D(OAK));
      c.line(40, 17, 46, 6, OAK); // the stilts
      c.line(42, 17, 47, 9, D(OAK));
      c.poly([[33, 20], [39, 20], [37, 25], [32, b]], C.iron); // the share
      c.line(33, 20, 32, b, C.steel);
      c.col(35, 15, 19, C.ironDark);
      wheel(c, 30, b - 2, 2, OAK, C.iron);
      heap(c, 36, 46, b, 3, SOIL, 4);
      dots(c, MUD, [29, b, 33, b, 47, b]);
      if (u) {
        crow(c, 14, 17, false);
        crow(c, 22, 17, true);
        blood(c, [2, b, 3, b]);
        dots(c, C.bone, [34, b - 1]);
      }
    },
    sw: 24, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.line(4, 12, 3, 2, OAK); // the stilts behind
      c.line(19, 12, 20, 2, D(OAK));
      if (!u) {
        c.oval(5, 5, 18, 20, OX);
        c.rect(7, 20, 9, b, OX);
        c.rect(14, 20, 16, b, D(OX));
        c.set(7, b, SOOT);
        c.set(8, b, SOOT);
        c.set(15, b, SOOT);
        c.set(14, b, SOOT);
        c.rect(3, 6, 20, 7, OAK);
        c.row(6, 3, 20, L(OAK));
        c.rect(8, 8, 15, 16, OX);
        c.col(8, 8, 16, L(OX));
        c.rect(9, 14, 14, 17, hex('#b09a80'));
        dots(c, SOOT, [10, 16, 13, 16, 9, 11, 14, 11]);
        dots(c, C.bone, [5, 7, 6, 8, 7, 9, 18, 7, 17, 8, 16, 9]);
        dots(c, hex('#d0c8b0'), [11, 9, 12, 9, 11, 10, 12, 11]);
      } else {
        c.oval(3, b - 12, 20, b + 4, OX);
        c.clearRect(0, b + 1, 23, b + 5);
        c.row(b, 4, 19, D(OX));
        c.line(3, b - 9, 20, b - 12, OAK); // the yoke slipped
        c.line(3, b - 8, 20, b - 11, D(OAK));
        c.rect(8, b - 8, 15, b - 1, OX);
        c.col(8, b - 8, b - 1, L(OX));
        c.rect(9, b - 3, 14, b, hex('#b09a80'));
        dots(c, SOOT, [10, b - 1, 13, b - 1, 9, b - 6, 10, b - 6, 13, b - 6, 14, b - 6]);
        dots(c, C.bone, [5, b - 10, 6, b - 9, 7, b - 8, 18, b - 10, 17, b - 9, 16, b - 8]);
        crow(c, 13, b - 12, false);
        blood(c, [11, b, 12, b]);
      }
    },
  });

  add('rural-hay-baler-large', 'large hay baler baling machine red farm machinery pickup reel bale chute twine', {
    w: 48, h: 28, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(0, 18, 8, 15, C.iron); // drawbar
      c.line(0, 19, 8, 16, C.ironDark);
      c.rect(34, 9, 43, 16, D(FRED)); // the chamber
      c.row(9, 34, 43, FRED);
      c.rect(11, 6, 34, 18, FRED);
      c.row(6, 11, 34, L(FRED));
      c.col(11, 6, 18, L(FRED));
      c.row(18, 11, 34, D(FRED));
      c.col(22, 7, 17, D(FRED));
      rust(c, 12, 7, 42, 17, 5, 8);
      c.rect(25, 8, 31, 11, LIME); // a maker's plate, unreadable
      dots(c, D(LIME), [26, 9, 28, 10, 30, 9]);
      c.line(14, 5, 30, 2, C.iron); // the needles
      c.line(30, 2, 36, 8, C.iron);
      c.oval(13, 7, 21, 15, C.ironDark); // flywheel
      c.oval(14, 8, 20, 14, C.iron);
      c.line(14, 11, 20, 11, C.ironDark);
      c.line(17, 8, 17, 14, C.ironDark);
      c.set(17, 11, C.steel);
      c.oval(3, 14, 13, 23, C.ironDark); // the pickup
      for (let a = 0; a < 10; a++) c.set(8 + Math.cos(a * 0.63) * 4.6, 18.5 + Math.sin(a * 0.63) * 4.6, u ? C.blood : C.steel);
      c.set(8, 18, C.iron);
      tyre(c, 26, b - 5, 5, FRED);
      c.rect(34, 17, 35, b, C.ironDark); // a stand under the chute
      if (!u) {
        bale(c, 38, 8, 46, 15, 3);
        dots(c, HAY, [4, 13, 6, 12, 2, b, 9, b]);
      } else {
        bale(c, 37, b - 7, 46, b, 4); // one bale out, and the pickup has taken something that was not hay
        c.rect(40, 10, 43, 15, SOOT);
        blood(c, [5, 16, 8, 15, 11, 17, 6, 21, 10, 21, 4, b, 6, b, 7, b - 1, 9, b]);
        c.rect(1, b - 1, 4, b, hex('#3a2c24')); // a boot
        c.rect(1, b - 3, 2, b - 2, hex('#3a2c24'));
        dots(c, hex('#4a5a7a'), [9, 14, 10, 13, 12, 13]); // a rag of blue cloth in the tines
      }
    },
    sw: 28, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(6, 4, 21, 15, FRED);
      c.row(4, 6, 21, L(FRED));
      c.col(6, 4, 15, L(FRED));
      rust(c, 7, 5, 20, 14, 6, 8);
      c.rect(12, 1, 13, 3, C.iron);
      c.rect(16, 6, 20, 12, D(FRED)); // the mouth of the chamber
      c.rect(17, 7, 19, 11, u ? SOOT : HAY);
      c.rect(8, 7, 10, 13, C.ironDark); // flywheel edge on
      c.col(8, 7, 13, C.iron);
      tyreEdge(c, 2, b - 10, 4, b);
      tyreEdge(c, 23, b - 10, 25, b);
      c.rect(3, 15, 24, 22, C.ironDark); // the pickup across the front
      for (let y = 16; y < 22; y += 2) for (let x = 4 + (y % 4 ? 1 : 0); x < 24; x += 2) c.set(x, y, u && x > 8 && x < 17 ? C.blood : C.steel);
      c.rect(12, 20, 15, 24, C.iron); // the drawbar, coming at us
      c.rect(13, 21, 14, 23, C.ironDark);
      if (!u) dots(c, HAY, [6, 23, 9, b, 18, b, 21, 23]);
      else {
        blood(c, [9, 23, 11, b, 14, b, 16, 23, 12, b]);
        c.rect(18, b - 1, 21, b, hex('#3a2c24'));
        c.rect(20, b - 3, 21, b - 2, hex('#3a2c24'));
        dots(c, hex('#4a5a7a'), [10, 15, 11, 14]);
      }
    },
  });

  add('rural-pickup-truck-rusty-large', 'large rusty pickup truck old farm truck blue ute cab bed headlights', {
    w: 48, h: 26, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.poly([[15, 12], [18, 4], [28, 4], [29, 12]], FBLUE); // the cab
      c.row(4, 18, 28, L(FBLUE));
      c.poly([[18, 10], [20, 6], [27, 6], [27, 10]], u ? SOOT : GLASSD);
      if (!u) c.line(20, 9, 22, 7, hex('#7fa39c'));
      c.rect(2, 12, 46, 19, FBLUE);
      c.row(12, 2, 15, L(FBLUE));
      c.poly([[2, 12], [4, 10], [15, 10], [15, 12]], FBLUE);
      c.row(10, 4, 15, L(FBLUE));
      c.rect(30, 9, 46, 11, FBLUE); // the bed
      c.row(9, 30, 46, L(FBLUE));
      c.row(14, 30, 46, D(FBLUE));
      c.row(19, 2, 46, D(FBLUE));
      c.col(46, 9, 19, D(FBLUE));
      rust(c, 2, 11, 46, 19, 7, 6);
      dots(c, C.rust, [5, 18, 6, 18, 14, 17, 31, 18, 32, 17, 44, 18, 45, 17, 29, 13]);
      c.rect(1, 18, 3, 19, C.steel); // bumper
      c.rect(2, 13, 3, 15, u ? LAMP : hex('#8a9a98'));
      c.set(47 - 1, 13, hex('#7a2c2c'));
      if (!u) {
        c.col(17, 11, 18, D(FBLUE)); // the door
        c.col(28, 11, 18, D(FBLUE));
        c.rect(25, 13, 26, 13, C.steel);
      } else {
        c.rect(18, 11, 27, 18, SOOT); // the door stands open on an empty cab
        c.rect(18, 15, 27, 18, hex('#4a3a30'));
        c.row(15, 18, 27, hex('#5c4a3c'));
        c.line(21, 12, 22, 14, C.iron);
        c.rect(15, 5, 17, 18, L(FBLUE));
        c.col(17, 5, 18, D(FBLUE));
        dots(c, LAMP, [1, 14, 0, 13, 0, 15, -1, 14, -2, 13, -2, 15]);
      }
      c.oval(4, b - 9, 15, b + 3, SOOT); // arches
      c.oval(31, b - 9, 42, b + 3, SOOT);
      tyre(c, 9, b - 4, 4, ZINC);
      tyre(c, 36, b - 4, 4, ZINC);
      c.clearRect(0, b + 1, 47, b + 3);
      c.line(40, 8, 44, 2, OAK); // a fork handle in the bed
      c.rect(32, 6, 38, 8, HAY);
      c.row(6, 33, 37, L(HAY));
    },
    u: [3, 0, 0],
    sw: 28, sh: 26,
    s(c, u) {
      const b = c.h - 2;
      c.rect(6, 2, 21, 10, FBLUE);
      c.row(2, 7, 20, L(FBLUE));
      c.set(6, 2, null);
      c.set(21, 2, null);
      c.rect(8, 4, 19, 9, GLASSD);
      c.col(13, 4, 9, FBLUE);
      c.line(9, 8, 11, 6, hex('#7fa39c'));
      if (u) c.rect(14, 5, 19, 9, SOOT);
      c.rect(3, 10, 24, 19, FBLUE);
      c.row(10, 3, 24, L(FBLUE));
      c.col(3, 10, 19, L(FBLUE));
      c.rect(9, 12, 18, 17, C.ironDark);
      for (let y = 13; y < 17; y += 2) c.row(y, 10, 17, C.steel);
      rust(c, 3, 10, 24, 19, 5, 6);
      dots(c, C.rust, [4, 18, 5, 19, 22, 18, 23, 17, 20, 11]);
      for (const x of [4, 21]) {
        c.rect(x, 12, x + 2, 14, u ? LAMP : hex('#8a9a98'));
        c.set(x, 12, u ? C.glow : C.steel);
        if (u) dots(c, LAMP, [x + 1, 11, x + 1, 15, x - 1, 13, x + 3, 13]);
      }
      c.rect(2, 19, 25, 20, C.steel);
      c.row(20, 2, 25, D(C.steel));
      c.rect(11, 18, 16, 19, LIME);
      tyreEdge(c, 3, b - 3, 7, b);
      tyreEdge(c, 20, b - 3, 24, b);
      if (u) {
        c.rect(25, 5, 28, 18, FBLUE); // the driver's door open
        c.col(25, 5, 18, L(FBLUE));
        c.rect(26, 6, 27, 9, GLASSD);
        c.col(28, 5, 18, D(FBLUE));
      }
    },
    su: [0, 0, 3],
  });

  add('rural-livestock-trailer-large', 'large livestock trailer cattle trailer slatted sides ramp animal transport farm', {
    w: 46, h: 30, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      boardsH(c, 8, 5, 43, 20, GREYW, 3);
      for (const y of [8, 11]) c.row(y, 9, 42, SOOT); // the open slats
      c.rect(7, 3, 44, 4, ZINC);
      c.row(3, 7, 44, L(ZINC));
      for (const x of [8, 20, 32, 43]) c.col(x, 5, 20, C.iron);
      c.rect(8, 21, 43, 22, C.ironDark);
      c.line(8, 21, 1, 22, C.iron); // drawbar
      c.col(3, 23, b, C.iron);
      c.row(b, 2, 4, C.ironDark);
      c.rect(20, 21, 37, 22, D(GREYW)); // mudguard
      tyre(c, 24, b - 4, 4, ZINC);
      tyre(c, 33, b - 4, 4, ZINC);
      dots(c, hex('#6a5a3a'), [12, 19, 18, 17, 27, 18, 38, 19, 14, 14]); // muck
      dots(c, HAY, [10, 21, 15, 22, 40, 21]);
      if (u) {
        dots(c, C.glow, [14, 8, 16, 8, 26, 11, 28, 11, 37, 8, 39, 8]); // eyes at the slats
        c.line(44, 20, 51, b, GREYW); // the ramp is down
        c.line(44, 21, 50, b, D(GREYW));
        c.col(44, 5, 20, SOOT);
        dots(c, HAY, [46, b, 49, b - 1, 52, b]);
        blood(c, [22, 12, 22, 14, 23, 16, 22, 19]);
      } else c.rect(43, 12, 44, 13, C.steel);
    },
    u: [0, 0, 8],
    sw: 26, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 23, 4, ZINC);
      c.row(3, 2, 23, L(ZINC));
      c.rect(3, 5, 22, 20, C.iron);
      c.rect(3, 21, 22, 22, C.ironDark);
      tyreEdge(c, 3, b - 7, 6, b);
      tyreEdge(c, 19, b - 7, 22, b);
      dots(c, hex('#7a2c2c'), [4, 21, 21, 21]);
      if (!u) {
        boardsH(c, 4, 6, 21, 20, GREYW, 3);
        c.rect(5, 8, 20, 8, SOOT);
        c.line(5, 19, 20, 10, D(GREYW));
        c.rect(12, 13, 13, 15, C.steel);
        dots(c, hex('#6a5a3a'), [7, 18, 16, 17]);
      } else {
        hollow(c, 4, 6, 21, 20);
        dots(c, C.glow, [8, 11, 10, 11, 15, 13, 17, 13, 12, 9, 13, 9]);
        dots(c, HAY, [6, 20, 11, 20, 18, 20]);
        c.poly([[3, 21], [22, 21], [25, b], [0, b]], GREYW); // the ramp, coming down to us
        for (let y = 23; y < b; y += 2) c.row(y, 2 - Math.round((y - 21) / 3) + 1, 23 + Math.round((y - 21) / 3) - 1, D(GREYW));
        c.row(21, 3, 22, L(GREYW));
        blood(c, [11, 22, 12, 24, 12, 26]);
      }
    },
  });

  /* ---------- the fields ---------- */
  add('rural-scarecrow-crossed', 'scarecrow on a cross pole sack head old coat hat straw field', {
    w: 24, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(11, 10, 12, b, OAK);
      c.col(11, 28, b, L(OAK));
      c.rect(u ? 8 : 2, 14, 21, 15, OAK);
      c.rect(7, 12, 16, 27, COAT); // the coat
      c.col(7, 12, 27, L(COAT));
      c.col(16, 12, 27, D(COAT));
      c.col(11, 14, 27, D(COAT));
      dots(c, C.brass, [12, 17, 12, 21]);
      for (const x of [7, 9, 10, 13, 15, 16]) c.set(x, 28 + (x % 2), COAT);
      dots(c, HAY, [8, 29, 12, 29, 14, 28, 10, 11, 13, 11, 9, 12]);
      c.rect(17, 13, 21, 16, COAT);
      c.row(13, 17, 21, L(COAT));
      dots(c, HAY, [22, 14, 22, 15, 22, 16]);
      if (!u) {
        c.rect(2, 13, 6, 16, COAT);
        c.row(13, 2, 6, L(COAT));
        dots(c, HAY, [1, 14, 1, 15, 1, 13]);
      } else {
        c.rect(4, 14, 7, 25, COAT); // one arm has come down, and it is pointing
        c.col(4, 14, 25, L(COAT));
        dots(c, HAY, [4, 26, 5, 27, 6, 26, 5, 26]);
      }
      c.rect(9, 4, 14, 10, SACK); // the head
      c.col(9, 4, 10, L(SACK));
      c.col(14, 4, 10, D(SACK));
      c.row(10, 10, 13, ROPE);
      if (!u) {
        dots(c, SOOT, [10, 6, 13, 6]);
        c.row(8, 10, 13, SOOT);
        dots(c, SACK, [11, 8]);
        c.rect(6, 3, 17, 3, hex('#2c2a30')); // the hat
        c.rect(9, 1, 14, 2, hex('#2c2a30'));
        c.row(1, 9, 14, hex('#44424c'));
      } else {
        dots(c, C.red, [10, 6, 13, 6]); // the hat is off and it is looking
        c.rect(10, 8, 13, 9, SOOT);
        dots(c, C.bone, [10, 8, 12, 8]);
        dots(c, HAY, [9, 3, 11, 2, 12, 3, 14, 3]);
        c.rect(15, b - 1, 20, b, hex('#2c2a30'));
        c.rect(16, b - 2, 19, b - 2, hex('#2c2a30'));
      }
      grass(c, [9, 15], b);
    },
    sw: 12, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      c.rect(5, 10, 6, b, OAK);
      c.col(5, 28, b, L(OAK));
      c.rect(3, 12, 8, 27, COAT);
      c.col(3, 12, 27, L(COAT));
      c.col(8, 12, 27, D(COAT));
      for (const x of [3, 5, 6, 8]) c.set(x, 28 + (x % 2), COAT);
      dots(c, HAY, [4, 29, 7, 28, 4, 11]);
      c.rect(3, 4, 8, 10, SACK);
      c.col(3, 4, 10, L(SACK));
      c.col(8, 4, 10, D(SACK));
      c.row(10, 4, 7, ROPE);
      if (!u) {
        c.rect(4, 13, 7, 16, D(COAT)); // the arm, end on
        dots(c, HAY, [5, 14, 6, 15]);
        c.set(4, 6, SOOT);
        c.row(8, 3, 4, SOOT);
        c.rect(1, 3, 10, 3, hex('#2c2a30'));
        c.rect(3, 1, 8, 2, hex('#2c2a30'));
      } else {
        c.rect(1, 14, 4, 25, COAT);
        c.col(1, 14, 25, L(COAT));
        dots(c, HAY, [1, 26, 2, 27, 3, 26]);
        c.set(4, 6, C.red);
        c.rect(3, 8, 4, 9, SOOT);
        dots(c, HAY, [4, 3, 6, 2, 7, 3]);
        c.rect(7, b - 1, 10, b, hex('#2c2a30'));
      }
      grass(c, [8], b);
    },
  });

  add('rural-hay-bales-stack', 'stack of hay bales square bales straw twine barn field', {
    w: 34, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bale(c, 1, b - 6, 10, b, 1);
      bale(c, 12, b - 6, 21, b, 2);
      bale(c, 23, b - 6, 32, b, 3);
      if (!u) bale(c, 6, b - 14, 15, b - 8, 4);
      else {
        hollow(c, 6, b - 14, 15, b - 8); // one pulled out: there is a hollow behind, and it is lived in
        dots(c, C.glow, [9, b - 11, 12, b - 11]);
        c.rect(8, b - 8, 12, b - 8, hex('#5a5048'));
        dots(c, C.bone, [14, b - 8, 7, b - 9]);
      }
      bale(c, 17, b - 14, 26, b - 8, 5);
      bale(c, 12, b - 22, 21, b - 16, 6);
      c.row(b - 7, 1, 32, D(HAY));
      c.row(b - 15, 6, 26, D(HAY));
      dots(c, HAY, [3, b - 8, 28, b - 8, 10, b - 16, 23, b - 16, 0 + 2, b]);
      if (u) {
        hay(c, 1, b - 3, 9, b, 9, HAY);
        dots(c, HAY, [10, b, 11, b - 1, 3, b - 4, 6, b - 5]);
      }
    },
    sw: 20, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      bale(c, 2, b - 6, 9, b, 7);
      bale(c, 10, b - 6, 17, b, 8);
      bale(c, 2, b - 14, 9, b - 8, 9);
      bale(c, 10, b - 14, 17, b - 8, 10);
      bale(c, 6, b - 22, 13, b - 16, 11);
      c.row(b - 7, 2, 17, D(HAY));
      c.row(b - 15, 2, 17, D(HAY));
      if (u) {
        c.rect(2, b - 14, 3, b - 8, SOOT);
        hay(c, 1, b - 2, 6, b, 4, HAY);
        dots(c, HAY, [0, b, 7, b]);
      }
    },
  });

  add('rural-round-bale', 'round bale big hay bale rolled straw net wrap field', {
    w: 26, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(2, 2, 23, b + 1, HAY);
      c.clearRect(0, b + 1, 25, b + 2);
      for (const k of [3, 6, 9]) {
        for (let a = 0; a < 40; a++) {
          const x = 12.5 + Math.cos(a * 0.157) * (10.5 - k),
            y = 11.5 + Math.sin(a * 0.157) * (10 - k);
          if (a % 5) c.set(x, y, D(HAY));
        }
      }
      c.speckle(3, 3, 22, b, L(HAY), 6, 3);
      c.row(b, 6, 19, D(HAY));
      if (u) {
        c.oval(8, 7, 17, 16, SOOT); // burrowed into
        c.oval(9, 9, 16, 16, hex('#2a2422'));
        dots(c, HAY, [8, 17, 10, 18, 15, 17, 6, b, 4, b, 20, b, 12, b - 1]);
        c.rect(11, 13, 14, 14, hex('#6a5a58')); // rags, and a shoe
        c.rect(14, 15, 16, 16, hex('#3a2c24'));
      }
      grass(c, [1, 23], b);
    },
    sw: 20, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      hay(c, 2, 2, 17, b, 5, HAY);
      c.set(2, 2, null);
      c.set(17, 2, null);
      c.set(2, 3, HAY);
      for (let y = 5; y < b; y += 4) c.row(y, 2, 17, D(HAY));
      for (let x = 4; x < 17; x += 4) for (let y = 3; y < b; y += 2) c.set(x + (y % 4 ? 0 : 1), y, hex('#8f9a8a')); // the net
      c.col(17, 3, b, D(HAY));
      if (u) {
        c.rect(1, 7, 2, 15, SOOT);
        hay(c, 0, b - 2, 4, b, 3, HAY);
      }
      grass(c, [1, 18], b);
    },
    su: [1, 0, 0],
  });

  add('rural-feed-trough-zinc', 'feed trough galvanised cattle trough sheep feeder mash farm', {
    w: 36, h: 14, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.line(7, 9, 5, b, C.iron);
      c.line(8, 9, 10, b, C.ironDark);
      c.line(27, 9, 25, b, C.iron);
      c.line(28, 9, 30, b, C.ironDark);
      c.poly([[1, 4], [34, 4], [32, 9], [3, 9]], ZINC);
      c.row(4, 1, 34, L(ZINC));
      c.row(9, 3, 32, D(ZINC));
      c.line(1, 4, 3, 9, L(ZINC));
      dots(c, C.rust, [8, 7, 9, 8, 20, 6, 28, 8]);
      if (!u) c.row(3, 2, 33, SOOT);
      else {
        hay(c, 3, 2, 32, 3, 4, hex('#9a8450')); // filled, steaming
        c.row(1, 8, 26, hex('#9a8450'));
        wisp(c, 10, 0, 3, C.ghost);
        wisp(c, 22, 0, 4, C.ghost);
        dots(c, hex('#9a8450'), [2, b, 12, b, 33, b, 20, 10, 20, 11]);
      }
    },
    u: [0, 4, 0],
    sw: 14, sh: 14,
    s(c, u) {
      const b = c.h - 2;
      c.line(5, 9, 3, b, C.iron);
      c.line(8, 9, 10, b, C.ironDark);
      c.poly([[1, 4], [12, 4], [9, 9], [4, 9]], ZINC);
      c.row(4, 1, 12, L(ZINC));
      c.line(1, 4, 4, 9, L(ZINC));
      c.row(9, 4, 9, D(ZINC));
      if (!u) c.row(3, 2, 11, SOOT);
      else {
        hay(c, 2, 2, 11, 3, 5, hex('#9a8450'));
        wisp(c, 6, 0, 3, C.ghost);
        dots(c, hex('#9a8450'), [2, b, 11, b]);
      }
    },
    su: [0, 4, 0],
  });

  const hen = (c, x, yb, flip) => {
    const s = flip ? -1 : 1;
    c.rect(x, yb - 3, x + 3 * s, yb - 1, HEN);
    c.set(x + 4 * s, yb - 4, HEN);
    c.set(x + 4 * s, yb - 5, C.red);
    c.set(x + 5 * s, yb - 4, C.mustard);
    c.set(x - s, yb - 4, D(HEN));
    c.set(x + 1 * s, yb, C.mustard);
    c.set(x + 2 * s, yb - 2, L(HEN));
  };
  add('rural-chicken-coop', 'chicken coop hen house on legs ramp pop hole wire tin roof hens', {
    w: 34, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [5, 27], 23, b, GREYW);
      boards(c, 4, 9, 29, 22, GREYW, 4);
      corr(c, 2, 6, 31, 8, ZINC);
      c.row(6, 2, 31, L(ZINC));
      dots(c, C.rust, [6, 7, 14, 8, 25, 7]);
      c.rect(17, 11, 26, 17, OAK); // the wired window
      c.rect(18, 12, 25, 16, SOOT);
      for (let y = 12; y <= 16; y++) for (let x = 18 + (y % 2); x <= 25; x += 2) c.set(x, y, hex('#5a5a5a'));
      c.rect(7, 14, 13, 22, OAK);
      c.line(8, 23, 2, b, PALEW); // the ramp
      c.line(9, 23, 3, b, D(PALEW));
      dots(c, OAK, [6, 25, 4, 27]);
      if (!u) {
        c.rect(8, 15, 12, 22, PALEW); // the pop hole shut for the night
        c.row(15, 8, 12, L(PALEW));
        c.rect(10, 13, 10, 14, C.iron);
        hen(c, 19, b, false);
        hen(c, 30, b, true);
      } else {
        c.rect(8, 15, 12, 22, SOOT);
        c.rect(8, 10, 12, 13, PALEW); // slid up, and the fox has been
        dots(c, C.white, [5, 24, 9, 26, 14, b, 17, b - 1, 20, b, 24, b - 2, 27, b, 11, 20, 15, 24]);
        dots(c, HEN, [13, b, 22, b, 18, b - 1]);
        blood(c, [7, 24, 6, 26, 10, b, 11, b, 16, b]);
        c.rect(22, 13, 23, 14, HEN); // one left, on the perch, looking out
        c.set(24, 13, C.mustard);
      }
      grass(c, [1, 24, 32], b);
    },
    sw: 22, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [3, 17], 23, b, GREYW);
      boards(c, 2, 9, 19, 22, GREYW, 4);
      corr(c, 1, 6, 20, 8, ZINC);
      c.row(6, 1, 20, L(ZINC));
      c.rect(6, 12, 15, 21, D(GREYW)); // the egg door
      c.frame(6, 12, 15, 21, OAK);
      c.rect(14, 16, 15, 17, C.iron);
      c.rect(0, 23, 1, b, D(PALEW)); // ramp end
      if (!u) hen(c, 13, b, true);
      else {
        c.rect(7, 13, 14, 20, SOOT);
        c.rect(7, 19, 14, 20, HAY);
        dots(c, C.bone, [9, 18, 12, 18]);
        dots(c, C.white, [4, b, 9, b - 1, 14, b, 11, 25]);
        blood(c, [8, b, 13, b - 1]);
      }
      grass(c, [20], b);
    },
  });

  const tank = (c, u, side) => {
    const b = c.h - 2;
    legs(c, [4, 22], 22, b, GREYW);
    c.line(6, 23, 21, b - 1, D(GREYW));
    c.line(21, 23, 6, b - 1, D(GREYW));
    board(c, 2, 20, 25, 21, GREYW);
    corr(c, 3, 5, 24, 19, ZINC, false);
    c.col(3, 5, 19, L(ZINC));
    c.col(24, 5, 19, D(ZINC));
    c.poly([[3, 4], [13, 1], [14, 1], [24, 4]], ZINC);
    c.line(3, 4, 13, 1, L(ZINC));
    dots(c, C.rust, [8, 9, 8, 10, 9, 12, 18, 7, 18, 8, 17, 14, 22, 16, 6, 17]);
    if (side) {
      for (const x of [16, 20]) c.col(x, 3, b, C.iron); // the ladder
      for (let y = 5; y < b; y += 3) c.row(y, 17, 19, C.ironDark);
    } else {
      c.rect(13, 22, 14, b - 8, C.iron); // the pipe and its tap
      c.rect(12, b - 9, 15, b - 8, C.brass);
      c.set(11, b - 9, C.brass);
    }
    const x = side ? 8 : 13;
    if (!side || u) {
      c.rect(x - 2, b - 4, x + 3, b, ZINC); // a bucket under it
      c.row(b - 4, x - 2, x + 3, L(ZINC));
    }
    if (u) {
      if (!side) c.rect(13, b - 7, 14, b - 5, WAT);
      c.row(b - 4, x - 1, x + 2, WAT);
      c.col(x - 3, b - 3, b, WAT); // running over
      c.col(x + 4, b - 2, b, WAT);
      c.row(b, x - 6, x + 7, WAT);
      c.set(x - 5, b, L(WAT));
      if (side) drip(c, 9, 20, b - 5, WAT);
      dots(c, hex('#5e3a40'), side ? [6, 12, 6, 14, 7, 17] : [9, 12, 9, 14, 10, 17, 9, 19]); // and what leaks from the seam is not clear
    }
    grass(c, [1, 25], b);
  };
  add('rural-water-tank-stand', 'water tank on a stand corrugated iron rain tank galvanised tap farm', {
    w: 28, h: 40, solid: true,
    f: (c, u) => tank(c, u, false),
    sw: 28, sh: 40,
    s: (c, u) => tank(c, u, true),
  });

  const tower = (c, x0, x1, yt, b) => {
    const m = (x0 + x1) / 2;
    c.line(x0, b, m - 1, yt, ZINC);
    c.line(x1, b, m + 1, yt, D(ZINC));
    for (let y = b - 4, k = 0; y > yt + 4; y -= 9, k++) {
      const t = (b - y) / (b - yt),
        a = Math.round(x0 + (m - 1 - x0) * t),
        e = Math.round(x1 + (m + 1 - x1) * t),
        t2 = (b - y + 9) / (b - yt),
        a2 = Math.round(x0 + (m - 1 - x0) * t2),
        e2 = Math.round(x1 + (m + 1 - x1) * t2);
      c.row(y, a, e, D(ZINC));
      if (y - 9 > yt) {
        c.line(a, y, e2, y - 9, hex('#5a626a'));
        c.line(e, y, a2, y - 9, hex('#5a626a'));
      }
    }
  };
  add('rural-windmill-pump', 'windmill pump wind pump lattice tower fan blades water bore farm', {
    w: 28, h: 62, solid: true,
    f(c, u) {
      const b = c.h - 2;
      tower(c, 5, 22, 20, b);
      c.col(13, 20, b - 5, C.iron); // the rod
      c.rect(11, b - 5, 16, b, C.ironDark);
      c.row(b - 5, 11, 16, C.iron);
      c.rect(17, b - 3, 19, b - 3, C.iron);
      if (!u) {
        for (let a = 0; a < 12; a++) {
          const dx = Math.cos((a * Math.PI) / 6),
            dy = Math.sin((a * Math.PI) / 6);
          c.line(13.5 + dx * 3, 12 + dy * 3, 13.5 + dx * 10, 12 + dy * 10, a % 2 ? ZINC : L(ZINC));
          c.set(13.5 + dx * 10 - dy, 12 + dy * 10 + dx, D(ZINC));
        }
        dots(c, C.rust, [8, 7, 19, 16, 13, 3]);
      } else {
        for (let y = 1; y <= 23; y++)
          for (let x = 2; x <= 25; x++) {
            const d = Math.hypot(x - 13.5, y - 12);
            if (d <= 10.6 && d > 2.5 && (x + y) % 2 === 0) c.set(x, y, d > 9 ? D(ZINC) : (x * 3 + y) % 5 ? ZINC : L(ZINC)); // turning
          }
        c.col(19, b - 2, b - 1, WAT);
        c.row(b, 17, 25, WAT);
        c.set(18, b - 3, WAT);
        c.set(21, b - 1, L(WAT));
      }
      c.rect(12, 11, 15, 13, C.iron);
      c.set(13, 12, C.steel);
      grass(c, [3, 9, 24], b);
    },
    sw: 24, sh: 62,
    s(c, u) {
      const b = c.h - 2;
      tower(c, 3, 16, 20, b);
      c.col(9, 20, b - 5, C.iron);
      c.rect(7, b - 5, 12, b, C.ironDark);
      c.row(b - 5, 7, 12, C.iron);
      c.rect(6, 2, 7, 22, ZINC); // the fan, edge on
      c.col(6, 2, 22, L(ZINC));
      if (u) for (let y = 2; y <= 22; y += 2) c.set(5, y, D(ZINC));
      c.rect(8, 11, 11, 13, C.iron);
      c.line(12, 12, 17, u ? 10 : 12, C.iron); // the tail
      const t = u ? -2 : 0;
      c.poly([[16, 8 + t], [22, 9 + t], [22, 15 + t], [16, 16 + t]], ZINC);
      c.line(16, 8 + t, 22, 9 + t, L(ZINC));
      c.rect(19, 10 + t, 21, 14 + t, FRED);
      dots(c, C.rust, [17, 14 + t, 18, 10 + t]);
      if (u) {
        c.col(4, b - 2, b - 1, WAT);
        c.row(b, 0 + 1, 6, WAT);
      }
      grass(c, [2, 17], b);
    },
  });

  add('rural-barn-door-sliding', 'barn door sliding door red boards white cross brace rail farm building', {
    w: 40, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2,
        o = u ? 15 : 0;
      boards(c, 1, 5, 38, b, mix(FRED, 0.72), 4); // the wall
      if (u) {
        hollow(c, 3, 6, 17, b);
        hay(c, 3, b - 2, 17, b, 4, mix(HAY, 0.6));
        chain(c, 8, 6, 8, 17); // a hook and chain in the dark
        dots(c, C.steel, [7, 18, 8, 19, 9, 18]);
        dots(c, C.glow, [12, 24, 14, 24]);
        dots(c, mix(HAY, 0.8), [18, b, 20, b - 1, 2, b]);
      }
      boards(c, 3 + o, 6, 23 + o, b, FRED, 4);
      c.frame(3 + o, 6, 23 + o, b, LIME);
      c.row(24, 3 + o, 23 + o, LIME);
      c.line(4 + o, 23, 22 + o, 7, LIME);
      c.line(4 + o, b - 1, 22 + o, 25, LIME);
      c.rect(21 + o - (u ? 17 : 0), 26, 22 + o - (u ? 17 : 0), 30, C.iron);
      c.rect(1, 3, 38, 4, C.ironDark); // the rail
      c.row(3, 1, 38, C.iron);
      for (const x of [6 + o, 20 + o]) c.rect(x, 4, x + 1, 6, C.steel);
      rust(c, 4 + o, 7, 22 + o, b, 3, 14);
      dots(c, C.moss, [2, b, 30, b, 37, b - 1]);
    },
    sw: 9, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      boards(c, 4, 2, 7, b, mix(FRED, 0.72), 4);
      c.col(4, 2, b, L(mix(FRED, 0.72)));
      c.rect(1, 3, 3, 4, C.ironDark);
      c.row(3, 1, 3, C.iron);
      c.rect(2, 5, 3, b, FRED);
      c.col(2, 5, b, L(FRED));
      c.set(1, 28, C.iron);
      if (u) {
        c.rect(2, 5, 3, b, SOOT);
        c.col(3, 5, b, D(FRED));
        dots(c, mix(HAY, 0.8), [1, b, 0, b, 2, b]);
        c.set(2, 24, C.glow);
      }
      dots(c, C.moss, [6, b]);
    },
  });

  add('rural-fence-barbed-rails', 'farm fence post and rail barbed wire field boundary paddock', {
    w: 36, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 17, 32]) post(c, x, 2, b, GREYW);
      c.row(4, 1, 34, C.iron); // the wire
      for (let x = 6; x < 34; x += 5) {
        c.set(x, 3, C.steel);
        c.set(x, 5, C.steel);
      }
      board(c, 1, 7, 34, 8, GREYW);
      if (!u) board(c, 1, 12, 34, 13, GREYW);
      else {
        c.line(1, 12, 9, 13, GREYW); // the lower rail broken outwards
        c.line(10, 14, 12, b, GREYW);
        c.line(34, 12, 24, 13, GREYW);
        c.line(23, 14, 22, b, D(GREYW));
        dots(c, PALEW, [10, 13, 23, 13]);
        c.rect(10, 4, 12, 5, hex('#b0a890')); // wool on the wire, and worse
        c.set(11, 6, hex('#b0a890'));
        blood(c, [14, 4, 15, 5, 15, 7, 15, 8, 16, b]);
      }
      grass(c, [5, 14, 21, 29], b);
    },
    sw: 6, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, GREYW);
      c.set(1, 4, C.steel);
      c.rect(2, 7, 3, 8, L(GREYW));
      c.rect(2, 12, 3, 13, L(GREYW));
      if (u) {
        c.rect(2, 12, 3, 13, PALEW);
        c.set(1, 5, hex('#b0a890'));
        blood(c, [1, 7, 1, b]);
      }
      grass(c, [4], b);
    },
  });

  const gateBars = (c, x0, x1, y0, y1) => {
    for (let y = y0; y <= y1; y += 3) {
      c.row(y, x0, x1, GREYW);
      c.set(x0, y, L(GREYW));
    }
    c.col(x0, y0, y1, GREYW);
    c.col(x1, y0, y1, D(GREYW));
    c.line(x0, y1, x1, y0, D(GREYW));
  };
  add('rural-field-gate-five-bar', 'five bar gate field gate wooden farm gate posts chain latch', {
    w: 40, h: 22, solid: true,
    f(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, OAK, 3);
      post(c, 35, 5, b, OAK, 3);
      if (!u) {
        gateBars(c, 5, 34, 6, 18);
        c.col(20, 6, 18, GREYW);
        chain(c, 33, 8, 36, 8);
      } else {
        gateBars(c, 5, 11, 6, 18); // swung wide, towards us
        c.col(12, 5, 19, L(GREYW));
        chain(c, 35, 8, 35, 13);
        dots(c, MUD, [16, b, 20, b, 24, b - 1, 28, b, 31, b]); // and the herd gone through
        dots(c, SOIL, [18, b, 26, b, 22, b - 1]);
      }
      grass(c, [1, 38], b);
    },
    sw: 6, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      post(c, 2, 2, b, OAK, 3);
      if (!u) {
        c.col(1, 6, 18, GREYW);
        c.set(1, 6, L(GREYW));
      } else {
        gateBars(c, 5, 34, 6, 18);
        c.col(20, 6, 18, GREYW);
        dots(c, MUD, [8, b, 14, b, 22, b]);
      }
      grass(c, [0], b);
    },
    su: [0, 0, 30],
  });

  add('rural-cattle-grid', 'cattle grid steel bars in the road stock grid farm lane', {
    w: 36, h: 11, solid: false, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, 2, 31, b, SOOT);
      for (let y = 2; y <= b; y += 2) {
        c.row(y, 4, 31, y === 2 ? C.steel : C.iron);
        c.set(4, y, C.steel);
      }
      for (const x of [1, 32]) {
        c.rect(x, 1, x + 2, b, STONE);
        c.row(1, x, x + 2, L(STONE));
      }
      dots(c, C.rust, [9, 4, 20, 6, 27, 2]);
      if (u) {
        c.rect(14, 4, 20, 4, SOOT); // one bar bent down, and something caught
        c.line(14, 5, 17, 6, C.iron);
        c.line(18, 6, 20, 5, C.iron);
        c.rect(16, 0, 17, 4, C.bone);
        c.set(15, 0, C.bone);
        c.set(18, 0, C.bone);
        blood(c, [16, 5, 17, 5, 15, 3, 18, 7]);
        dots(c, hex('#5a4a3a'), [16, 2]);
      }
      dots(c, C.moss, [1, b, 34, b]);
    },
    u: [0, 1, 0],
    sw: 18, sh: 11,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 16, b, SOOT);
      for (let x = 2; x <= 15; x += 2) c.col(x, 2, b, x % 4 ? C.iron : C.steel);
      c.row(1, 1, 16, L(STONE));
      c.row(b, 1, 16, STONE);
      if (u) {
        c.rect(8, 0, 9, 5, C.bone);
        c.set(7, 0, C.bone);
        c.set(10, 0, C.bone);
        blood(c, [8, 6, 9, 6, 7, 4]);
      }
    },
    su: [0, 1, 0],
  });
};
