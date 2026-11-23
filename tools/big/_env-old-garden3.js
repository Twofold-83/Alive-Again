/* Garden, third part: tea on the lawn, birds and rabbits, borders, heaps and holes. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, legs, hollow, wisp, pot, bush, hedge, stones, bricks, planksV, heap, shards, fire } = H;
  const add = H.reg('env-garden', 'Garden');
  const GREYW = hex('#7a6e60'),
    WHITEP = hex('#b0ac9c'),
    OAK = hex('#5c4432'),
    TEAK = hex('#8a6a48'),
    TERRA = hex('#8a4f36'),
    BRICK = hex('#7a4636'),
    SOIL = hex('#3f2e26'),
    TIN = hex('#858a92'),
    SOOT = hex('#1c1a1e'),
    STONE = hex('#8a8a84'),
    CANE = hex('#a8946a'),
    CHINA = hex('#d6d2c4'),
    SAND = hex('#b8a878'),
    ROSE = hex('#a8566a'),
    TWIG = hex('#5a4634'),
    YEL = hex('#c8a030');
  const vine = (c, x0, y0, x1, y1, seed, col = C.leaf, hi = C.leafLight) => {
    const r = rnd(seed),
      n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n),
        y = Math.round(y0 + ((y1 - y0) * i) / n);
      c.set(x, y, col);
      if (r() < 0.6) c.set(x + (r() < 0.5 ? 1 : -1), y, r() < 0.5 ? hi : col);
      if (r() < 0.4) c.set(x, y + (r() < 0.5 ? 1 : -1), hi);
    }
  };
  const moss = (c, pts) => dots(c, C.moss, pts);

  /* ---------- tea on the lawn ---------- */
  add('garden-table-wrought', 'garden table wrought iron white round tea table lawn', {
    w: 22, h: 19, solid: true,
    f(c, u) {
      const b = c.h - 2,
        tea = hex('#6a3f22');
      c.rect(1, 7, 20, 8, WHITEP);
      c.row(7, 1, 20, L(WHITEP));
      for (let x = 2; x < 20; x += 2) c.set(x, 8, D(WHITEP)); // pierced edge
      c.rect(10, 9, 11, b - 3, WHITEP);
      c.line(10, b - 4, 5, b, WHITEP);
      c.line(11, b - 4, 16, b, D(WHITEP));
      c.set(4, b - 1, WHITEP); // curled feet
      c.set(17, b - 1, D(WHITEP));
      dots(c, C.rust, [10, 12, 6, b - 1, 3, 7, 18, 8]);
      c.rect(4, 4, 7, 6, CHINA); // teapot
      c.row(3, 5, 6, CHINA);
      c.set(3, 5, CHINA);
      c.set(8, 5, D(CHINA));
      c.row(5, 4, 7, hex('#4f6a9a'));
      c.row(6, 13, 18, CHINA); // a plate of cake
      c.rect(14, 4, 17, 5, hex('#c9b6a0'));
      c.row(4, 14, 17, ROSE);
      if (!u) {
        c.rect(10, 5, 11, 6, CHINA);
        c.row(5, 10, 11, tea);
      } else {
        c.rect(9, 6, 11, 6, CHINA); // the cup over, the tea running off the edge
        c.set(12, 6, tea);
        c.col(12, 9, 12, tea);
        c.set(12, 14, tea);
        c.clearRect(16, 4, 17, 5); // the cake bitten, wasps at it
        dots(c, K, [15, 3, 18, 2, 13, 2, 19, 5]);
        dots(c, YEL, [14, 3, 17, 2, 13, 3, 19, 4]);
      }
    },
  });
  add('garden-chair-wrought', 'garden chair wrought iron white scroll back lawn seat', {
    w: 13, h: 24, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.line(3, 13, 2, 2, WHITEP); // back, with a curl at the top
        c.set(3, 1, WHITEP);
        c.set(4, 2, WHITEP);
        c.set(3, 6, D(WHITEP));
        c.set(3, 9, D(WHITEP));
        c.rect(3, 13, 10, 14, WHITEP);
        c.row(13, 3, 10, L(WHITEP));
        c.col(3, 15, b, WHITEP);
        c.col(10, 15, b, D(WHITEP));
        c.set(11, b, D(WHITEP));
        c.set(2, b, WHITEP);
        c.line(4, 15, 9, 18, D(WHITEP));
        dots(c, C.rust, [3, b - 2, 10, 16, 2, 5]);
      } else {
        c.line(11, b - 1, 22, b, WHITEP); // over on its back
        c.set(23, b - 1, WHITEP);
        c.rect(9, b - 9, 10, b, WHITEP);
        c.col(9, b - 9, b, L(WHITEP));
        c.row(b - 9, 2, 9, WHITEP);
        c.row(b - 2, 2, 8, D(WHITEP));
        c.set(1, b - 10, WHITEP);
        c.set(1, b - 3, D(WHITEP));
        dots(c, C.rust, [5, b - 9, 14, b - 1]);
      }
    },
    us: [26, 14],
    sw: 13, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        c.frame(2, 2, 10, 13, WHITEP);
        c.clear(2, 2);
        c.clear(10, 2);
        c.line(4, 12, 6, 5, WHITEP); // a heart of scrolls
        c.line(8, 12, 6, 5, D(WHITEP));
        c.set(5, 4, WHITEP);
        c.set(7, 4, WHITEP);
        c.rect(2, 13, 10, 14, WHITEP);
        c.row(13, 2, 10, L(WHITEP));
        c.col(2, 15, b, WHITEP);
        c.col(10, 15, b, D(WHITEP));
        c.row(18, 3, 9, D(WHITEP));
        dots(c, C.rust, [2, b - 2, 9, 3]);
      } else {
        c.frame(2, 2, 10, 11, WHITEP); // seen from underneath, legs towards us
        c.row(6, 3, 9, D(WHITEP));
        c.rect(2, 9, 3, 12, WHITEP);
        c.rect(9, 9, 10, 12, WHITEP);
        c.rect(3, 3, 9, 5, D(WHITEP));
        dots(c, C.rust, [4, 4, 8, 11]);
      }
    },
    sus: [13, 14],
  });

  /* ---------- birds and rabbits ---------- */
  const dove = (c, x, y, right = true) => {
    const s = right ? 1 : -1;
    c.rect(Math.min(x, x + 2 * s), y, Math.max(x, x + 2 * s), y + 1, C.white);
    c.set(x + 3 * s, y - 1, C.white);
    c.set(x + 4 * s, y - 1, C.mustard);
    c.set(x - s, y, hex('#b0b0b0'));
  };
  add('dovecote-post', 'dovecote pigeon house post doves birds white garden', {
    w: 20, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2,
        slate = hex('#4a4a58');
      c.rect(9, 20, 10, b, GREYW);
      c.col(9, 20, b, L(GREYW));
      c.line(8, 22, 5, 19, GREYW); // brackets
      c.line(11, 22, 14, 19, D(GREYW));
      moss(c, [9, b, 10, b - 1, 9, b - 6]);
      face(c, 3, 9, 16, 18, WHITEP);
      c.rect(2, 19, 17, 19, GREYW);
      c.poly([[1, 9], [9, 2], [10, 2], [18, 9]], slate);
      c.line(1, 9, 9, 2, hex('#6a6a78'));
      c.rect(9, 1, 10, 1, GREYW);
      for (const x of [5, 9, 13]) {
        c.rect(x, 12, x + 1, 15, SOOT); // pop holes
        c.row(16, x - 1, x + 2, GREYW);
      }
      dots(c, C.moss, [4, 8, 15, 8, 3, 18]);
      dots(c, hex('#c8c8c0'), [7, 17, 12, 11]); // droppings
      if (!u) {
        dove(c, 4, 15);
        dove(c, 12, 0, false);
      } else {
        dots(c, C.blood, [13, 16, 14, 17, 13, 18]); // the doves gone: feathers, and a smear at one hole
        dots(c, C.white, [4, 24, 14, 28, 6, 33, 12, 38, 3, b, 7, b - 1, 14, b, 16, b - 2, 6, 14]);
        dots(c, hex('#b0b0b0'), [5, 24, 13, 38, 15, b]);
      }
    },
    u: [0, 2, 0],
    sw: 16, sh: 46,
    s(c, u) {
      const b = c.h - 2,
        slate = hex('#4a4a58');
      c.rect(7, 20, 8, b, GREYW);
      c.col(7, 20, b, L(GREYW));
      moss(c, [7, b, 8, b - 1]);
      face(c, 3, 9, 12, 18, WHITEP);
      c.rect(2, 19, 13, 19, GREYW);
      c.poly([[1, 9], [7, 2], [8, 2], [14, 9]], slate);
      c.line(1, 9, 7, 2, hex('#6a6a78'));
      c.rect(7, 1, 8, 1, GREYW);
      for (const x of [5, 9]) {
        c.rect(x, 12, x + 1, 15, SOOT);
        c.row(16, x - 1, x + 2, GREYW);
      }
      if (!u) dove(c, 9, 15);
      else {
        dots(c, C.blood, [9, 16, 10, 17]);
        dots(c, C.white, [4, 24, 11, 30, 5, 36, 3, b, 11, b, 12, b - 2]);
      }
    },
  });
  add('rabbit-hutch', 'rabbit hutch cage wire mesh wooden pet rabbit straw', {
    w: 30, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.poly([[1, 5], [1, 3], [28, 1], [28, 5]], hex('#3a3438'));
      c.line(1, 3, 28, 1, hex('#5a5258'));
      face(c, 2, 6, 27, 17, GREYW);
      legs(c, [3, 25], 18, b, OAK);
      c.rect(4, 8, 18, 15, hex('#2e2a26')); // the run, behind wire
      c.rect(4, 14, 18, 15, C.straw);
      dots(c, D(C.straw), [6, 15, 11, 14, 16, 15]);
      planksV(c, 20, 7, 27, 17, D(GREYW), 4); // the sleeping box
      c.set(21, 12, C.iron);
      if (!u) {
        c.rect(8, 11, 13, 14, C.white); // a white rabbit
        c.rect(12, 9, 13, 11, C.white);
        c.set(14, 12, C.white);
        c.set(13, 12, hex('#c05a5a'));
        c.set(7, 13, hex('#c8c8c0'));
        for (let y = 8; y <= 15; y++) for (let x = 4; x <= 18; x++) if ((x + y) % 3 === 0) c.set(x, y, hex('#6a6f68')); // wire
        c.frame(3, 7, 19, 16, GREYW);
        c.rect(16, 9, 17, 12, hex('#7fa39c')); // water bottle
      } else {
        c.frame(3, 7, 19, 16, GREYW);
        c.rect(3, 7, 4, 16, L(GREYW)); // the wire door hanging open, the wire torn
        for (let y = 8; y <= 12; y++) for (let x = 14; x <= 18; x++) if ((x + y) % 3 === 0) c.set(x, y, hex('#6a6f68'));
        dots(c, C.straw, [8, 17, 10, 19, 12, b, 9, b, 15, b - 1]);
        dots(c, C.white, [6, 13, 13, b, 11, 16]); // fur
        c.set(7, 14, C.blood);
        c.set(12, 15, C.blood);
      }
    },
    sw: 15, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      c.poly([[1, 6], [1, 2], [13, 4], [13, 6]], hex('#3a3438'));
      c.line(1, 2, 13, 4, hex('#5a5258'));
      face(c, 2, 7, 12, 17, GREYW);
      planksV(c, 2, 8, 12, 17, D(GREYW), 4);
      legs(c, [3, 10], 18, b, OAK);
      c.col(12, 8, 16, u ? hex('#2e2a26') : hex('#6a6f68'));
      if (u) {
        dots(c, C.straw, [13, 17, 14, b, 15, b - 1]);
        c.set(13, b, C.white);
        for (let y = 8; y <= 15; y++) for (let x = 13; x <= 18; x++) if ((x + y) % 3 === 0) c.set(x, y, hex('#6a6f68'));
        c.frame(13, 7, 19, 16, GREYW);
      }
    },
    su: [0, 0, 6],
  });

  /* ---------- borders ---------- */
  add('flower-border-brick', 'flower border bed delphiniums poppies daisies brick edge herbaceous', {
    w: 38, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      hedge(c, 1, 8, 36, b - 3, 5, hex('#3a5a3c'), hex('#5a7a48'));
      c.rect(1, b - 2, 36, b - 2, SOIL);
      bricks(c, 1, b - 1, 36, b, BRICK, 3);
      const fl = (x, y, col, n) => {
        for (let i = 0; i < n; i++) c.set(x + (i % 2), y + i, col);
        c.col(x, y + n, 9, hex('#4a6a44'));
      };
      const flat = u ? [14, 24] : [99, 99];
      for (let x = 2; x < 36; x += 3) {
        if (x >= flat[0] && x <= flat[1]) continue;
        const k = (x * 7) % 5;
        if (k === 0) fl(x, 2, hex('#4f5f9a'), 5); // delphinium
        else if (k === 1) c.rect(x, 6, x + 1, 7, C.red), c.set(x, 7, SOOT); // poppy
        else if (k === 2) fl(x, 4, hex('#8a5a9a'), 4); // foxglove
        else if (k === 3) dots(c, C.white, [x, 7, x + 1, 6, x + 2, 8]), c.set(x + 1, 7, YEL);
        else c.rect(x, 5, x + 1, 6, hex('#c88a3a'));
      }
      if (u) {
        c.rect(14, 8, 26, b - 3, hex('#33402c')); // somebody has gone straight through it
        c.line(15, 9, 19, b - 3, hex('#5a7a48'));
        c.line(25, 9, 21, b - 3, hex('#5a7a48'));
        c.line(18, 10, 23, 12, hex('#4a6a44'));
        dots(c, C.red, [16, 12, 22, b - 3, 20, b]);
        dots(c, hex('#4f5f9a'), [17, b - 3, 24, 12, 23, b]);
        dots(c, C.white, [19, 11, 18, b]);
        c.rect(19, b - 2, 21, b - 2, SOOT); // a boot print in the earth
      }
    },
    sw: 16, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      hedge(c, 2, 8, 13, b - 3, 6, hex('#3a5a3c'), hex('#5a7a48'));
      c.rect(1, b - 2, 14, b - 2, SOIL);
      bricks(c, 1, b - 1, 14, b, BRICK, 4);
      if (!u) {
        for (let i = 0; i < 5; i++) c.set(4 + (i % 2), 2 + i, hex('#4f5f9a'));
        c.col(4, 7, 9, hex('#4a6a44'));
        c.rect(8, 6, 9, 7, C.red);
        dots(c, C.white, [11, 7, 12, 6]);
        c.set(12, 7, YEL);
      } else {
        c.rect(4, 8, 11, b - 3, hex('#33402c'));
        c.line(5, 9, 9, b - 3, hex('#5a7a48'));
        dots(c, C.red, [7, 11, 10, b]);
        dots(c, hex('#4f5f9a'), [6, b - 3, 12, b]);
      }
    },
  });
  const sunfl = (c, x, top, b, cut, side) => {
    c.col(x, top + 3, b, hex('#5a7a44'));
    c.col(x + 1, top + 6, b, hex('#4a6a3c'));
    c.rect(x - 3, top + 12, x - 1, top + 13, C.leaf); // leaves
    c.rect(x + 2, top + 18, x + 4, top + 19, C.leafLight);
    c.rect(x - 2, top + 24, x - 1, top + 25, C.leafLight);
    if (cut) {
      c.set(x, top + 3, hex('#d0c0a0'));
      return;
    }
    if (side) {
      c.rect(x + 1, top, x + 2, top + 6, YEL); // the head, edge on, looking right
      c.col(x + 3, top + 1, top + 5, hex('#4a3420'));
      c.col(x, top + 1, top + 5, hex('#5a7a44'));
      return;
    }
    c.oval(x - 3, top, x + 4, top + 7, YEL);
    c.oval(x - 1, top + 2, x + 2, top + 5, hex('#4a3420'));
    c.set(x, top + 3, hex('#6a4a2a'));
    dots(c, hex('#e0c050'), [x - 3, top + 3, x + 1, top, x + 4, top + 4]);
  };
  add('sunflowers-row', 'sunflowers tall row flowers heads seeds garden yellow', {
    w: 26, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      sunfl(c, 5, 5, b, u);
      sunfl(c, 13, 1, b, u);
      sunfl(c, 20, 8, b, false);
      c.col(16, 12, b, CANE); // a stake
      if (u) {
        c.oval(1, b - 4, 8, b, YEL); // two heads cut and left face down... one face up
        c.oval(3, b - 3, 6, b - 1, hex('#4a3420'));
        dots(c, YEL, [10, b, 12, b - 1, 14, b, 17, b, 9, b - 1]);
        c.oval(18, 8 + 2, 23, 8 + 6, hex('#2a1e16')); // and the last one has no seeds: only a dark hole looking down
      }
    },
    sw: 10, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      sunfl(c, 4, 1, b, u, true);
      if (u) {
        c.rect(5, b - 1, 9, b, YEL);
        c.row(b, 6, 8, hex('#4a3420'));
      }
    },
  });
  add('espalier-fruit-wall', 'espalier apple pear tree trained wall brick fruit orchard', {
    w: 38, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bricks(c, 1, 4, 36, b, BRICK, 9);
      c.rect(1, 2, 36, 3, STONE);
      c.row(2, 1, 36, L(STONE));
      c.rect(18, 8, 19, b, TWIG); // the trunk
      c.col(18, 8, b, L(TWIG));
      for (const y of [9, 17, 25]) {
        c.row(y, 3, 34, hex('#6a6f68')); // wires
        c.row(y + 1, 4, 33, TWIG);
        for (let x = 4; x <= 33; x += 2) {
          const k = (x * 5 + y) % 7;
          if (k < 5) c.set(x, y - 1 + (k % 2) * 3, k % 3 ? C.leaf : C.leafLight);
          if (k < 3) c.set(x + 1, y - (k % 2), C.leaf);
        }
      }
      const fruit = [6, 12, 12, 11, 24, 12, 30, 11, 8, 20, 15, 19, 23, 20, 29, 19, 6, 28, 13, 27, 25, 28, 31, 27];
      if (!u) for (let i = 0; i < fruit.length; i += 2) {
        c.rect(fruit[i], fruit[i + 1], fruit[i] + 1, fruit[i + 1] + 1, i % 3 ? hex('#a8a040') : hex('#a85a3a'));
        c.set(fruit[i], fruit[i + 1], hex('#c8c060'));
      } else {
        c.poly([[7, b - 4], [16, b - 4], [14, b], [9, b]], hex('#8a7448')); // picked: a basket of them at the foot
        c.row(b - 4, 7, 16, hex('#a89058'));
        for (let x = 8; x <= 14; x += 2) c.rect(x, b - 6, x + 1, b - 5, x % 4 ? hex('#a8a040') : hex('#a85a3a'));
        c.rect(26, b - 1, 27, b, hex('#6a4a2a')); // and the windfalls rotting, wasps on them
        c.rect(30, b - 1, 31, b, hex('#7a5a2a'));
        dots(c, K, [28, b - 2, 31, b - 3, 25, b - 3]);
        dots(c, YEL, [29, b - 2, 32, b - 3]);
      }
      moss(c, [2, b, 3, b - 1, 34, b, 5, 3, 30, 2]);
    },
    sw: 9, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      bricks(c, 2, 4, 5, b, BRICK, 6);
      c.rect(1, 2, 6, 3, STONE);
      c.row(2, 1, 6, L(STONE));
      for (const y of [9, 17, 25]) {
        c.rect(6, y, 7, y + 1, TWIG);
        dots(c, C.leaf, [6, y - 1, 7, y + 2]);
        c.set(8, y, C.leafLight);
        if (!u) c.set(7, y + 2, hex('#a8a040'));
      }
      c.col(6, 26, b, TWIG);
      if (u) {
        c.rect(6, b - 3, 8, b, hex('#8a7448'));
        c.row(b - 4, 6, 8, hex('#a8a040'));
      }
    },
  });

  /* ---------- heaps ---------- */
  const leafHeap = (c, x0, x1, yb, h, seed) => {
    heap(c, x0, x1, yb, h, hex('#7a5a34'), seed);
    c.speckle(x0, yb - h - 1, x1, yb, hex('#a8702c'), 4, seed + 1);
    c.speckle(x0, yb - h - 1, x1, yb, hex('#b89a3a'), 7, seed + 2);
    c.speckle(x0, yb - h - 1, x1, yb, hex('#5a3a24'), 6, seed + 3);
  };
  add('leaf-pile-rake', 'leaf pile autumn leaves heap rake garden raked', {
    w: 30, h: 18, solid: true,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        leafHeap(c, 2, 22, b, 9, 4);
        c.line(26, 1, 20, b - 3, CANE); // the rake stood in it
        for (let x = 17; x <= 23; x += 2) c.col(x, b - 3, b - 1, C.iron);
        c.row(b - 4, 17, 23, C.iron);
        dots(c, hex('#a8702c'), [25, b, 27, b - 1, 0, b]);
      } else {
        leafHeap(c, 1, 28, b, 3, 6); // kicked flat: what was under it
        c.rect(11, b - 3, 15, b - 1, hex('#8a2a2a')); // a child's red shoe
        c.rect(11, b - 4, 12, b - 3, hex('#8a2a2a'));
        c.row(b, 11, 16, hex('#3a2a26'));
        c.set(13, b - 3, C.white);
        c.rect(18, b - 6, 29, b - 5, CANE); // the rake thrown down
        c.row(b - 6, 18, 29, L(CANE));
      }
    },
    sw: 18, sh: 18,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        leafHeap(c, 2, 15, b, 9, 5);
        c.line(10, 1, 9, b - 4, CANE);
        c.row(b - 4, 7, 11, C.iron);
      } else {
        leafHeap(c, 1, 16, b, 3, 7);
        c.rect(7, b - 3, 10, b - 1, hex('#8a2a2a'));
        c.row(b, 7, 10, hex('#3a2a26'));
      }
    },
  });
  add('bonfire-heap-garden', 'bonfire heap garden rubbish branches burning fire autumn', {
    w: 28, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      heap(c, 3, 24, b, 10, hex('#4a3c2c'), 3);
      for (const [x0, y0, x1, y1] of [[4, b, 14, 9], [24, b, 12, 10], [8, b, 20, 12], [2, b - 2, 18, 14], [20, b, 10, 14], [15, b, 16, 7]]) c.line(x0, y0, x1, y1, TWIG);
      c.line(6, b - 1, 12, 12, hex('#7a6650'));
      c.rect(17, 13, 22, 14, GREYW); // a plank, a chair leg
      c.line(21, b - 2, 25, 10, TEAK);
      dots(c, C.leaf, [7, 14, 10, 11, 19, 16, 13, b - 3, 22, b - 4]);
      dots(c, hex('#7a5a34'), [5, b - 3, 16, 10, 23, b - 1, 11, b - 6]);
      if (u) {
        fire(c, 7, 20, b - 3, 12, 6);
        fire(c, 4, 10, b, 5, 7);
        fire(c, 17, 23, b, 6, 8);
        c.line(4, b, 14, 9, SOOT);
        c.line(24, b, 12, 10, SOOT);
        c.line(21, b - 2, 25, 10, hex('#3a2a20'));
        dots(c, C.flameLight, [3, 6, 22, 4, 12, 2, 25, 8]);
        wisp(c, 13, 5, 5, C.ash);
        wisp(c, 17, 3, 6, hex('#6a6a6a'));
      }
    },
    u: [0, 4, 0],
  });
  add('flowerpots-stack', 'flowerpots stack terracotta pots clay crocks garden', {
    w: 18, h: 15,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        pot(c, 2, 7, b - 4, b);
        for (const y of [b - 6, b - 8, b - 10]) {
          c.rect(2, y, 7, y + 1, TERRA); // rims of the pots nested in it
          c.row(y, 2, 7, L(TERRA));
        }
        pot(c, 9, 13, b - 3, b);
        c.rect(9, b - 5, 13, b - 4, TERRA);
        c.row(b - 5, 9, 13, L(TERRA));
        c.rect(14, b - 1, 16, b, TERRA); // one on its side
        c.set(14, b - 1, SOOT);
        moss(c, [3, b, 10, b - 1]);
      } else {
        pot(c, 9, 13, b - 3, b);
        c.rect(1, b - 2, 7, b, TERRA); // over, and smashed
        c.row(b - 2, 1, 7, L(TERRA));
        c.col(1, b - 2, b, SOOT);
        shards(c, 2, 16, b, TERRA, 4);
        c.poly([[13, b - 5], [16, b - 4], [16, b - 2], [14, b - 2]], TERRA);
        dots(c, K, [5, b - 3, 8, b - 1, 11, b - 5, 15, b - 6]); // earwigs
        dots(c, hex('#3f2e26'), [8, b, 3, b - 3]);
      }
    },
  });
  add('trug-basket-roses', 'trug basket garden basket secateurs gloves cut roses flowers', {
    w: 18, h: 12,
    f(c, u) {
      const b = c.h - 2,
        w = hex('#a08a5c');
      c.poly([[1, b - 3], [16, b - 3], [13, b], [4, b]], w);
      c.row(b - 3, 1, 16, L(w));
      c.line(5, b - 2, 6, b, D(w));
      c.line(12, b - 2, 11, b, D(w));
      for (let a = 0; a <= 10; a++) {
        const t = (Math.PI * a) / 10; // the handle
        c.set(Math.round(8.5 - 6 * Math.cos(t)), Math.round(b - 3 - 6 * Math.sin(t)), D(w));
      }
      if (!u) {
        c.rect(3, b - 5, 6, b - 4, hex('#8a7a4a')); // gloves
        c.set(7, b - 4, hex('#8a7a4a'));
        c.line(10, b - 4, 14, b - 5, C.steel); // secateurs
        c.set(10, b - 5, C.red);
      } else {
        c.rect(2, b - 5, 15, b - 4, C.leaf); // full of cut roses
        dots(c, C.leafLight, [4, b - 5, 9, b - 4, 13, b - 5]);
        for (const x of [3, 6, 10, 13]) {
          c.rect(x, b - 7, x + 1, b - 6, x % 2 ? ROSE : C.wine);
          c.set(x, b - 7, hex('#c88a98'));
        }
        dots(c, ROSE, [0, b, 16, b - 1, 17, b]);
        c.set(15, b - 4, C.blood); // and a thorn has drawn blood
        c.set(16, b - 2, C.blood);
      }
    },
    sw: 12, sh: 12,
    s(c, u) {
      const b = c.h - 2,
        w = hex('#a08a5c');
      c.poly([[2, b - 3], [9, b - 3], [8, b], [3, b]], w);
      c.row(b - 3, 2, 9, L(w));
      c.rect(5, b - 9, 6, b - 4, D(w)); // handle, end on
      if (!u) c.rect(3, b - 5, 4, b - 4, hex('#8a7a4a')), c.set(8, b - 4, C.steel);
      else {
        c.rect(2, b - 5, 9, b - 4, C.leaf);
        c.rect(3, b - 7, 4, b - 6, ROSE);
        c.rect(7, b - 7, 8, b - 6, C.wine);
        c.set(10, b, ROSE);
      }
    },
  });

  /* ---------- holes ---------- */
  add('ice-house-door-mound', 'ice house mound door grass covered cellar stone arch garden', {
    w: 40, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      bush(c, 1, 3, 38, b + 22, 4, hex('#3a5a3c'), hex('#5a7a48'));
      c.clearRect(0, b + 1, 39, b + 30);
      dots(c, C.leafLight, [6, 8, 12, 4, 20, 2, 28, 4, 33, 9]);
      stones(c, 12, 10, 27, b, STONE, 4, 6, 3);
      c.rect(13, 8, 26, 9, STONE);
      c.rect(15, 7, 24, 7, STONE);
      c.row(7, 15, 24, L(STONE));
      const dr = u ? SOOT : hex('#4a3c30');
      c.rect(16, 13, 23, b, dr);
      c.rect(17, 11, 22, 12, dr);
      if (!u) {
        planksV(c, 16, 12, 23, b, hex('#33281f'), 3);
        dots(c, C.iron, [17, 15, 22, 15, 17, b - 2, 22, b - 2]);
        c.line(16, 19, 23, 21, C.iron); // chained
        c.rect(19, 20, 20, 21, C.brass);
      } else {
        c.rect(16, 13, 17, b, hex('#4a3c30')); // open: and the cold coming out along the ground
        c.line(18, 19, 19, 23, C.iron);
        dots(c, C.ghost, [14, b, 16, b - 1, 19, b, 22, b - 1, 25, b, 28, b - 1, 30, b, 33, b, 11, b, 20, b - 3, 24, b - 2, 8, b]);
        dots(c, C.white, [18, b, 23, b, 27, b]);
        dots(c, hex('#3a3440'), [20, 16, 21, 20]);
      }
      moss(c, [13, 12, 26, 14, 12, b, 27, b - 1, 20, 8]);
    },
    sw: 24, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      bush(c, -18, 3, 19, b + 22, 5, hex('#3a5a3c'), hex('#5a7a48'));
      c.clearRect(0, b + 1, 23, b + 30);
      c.clearRect(0, 0, 0, b);
      stones(c, 16, 9, 20, b, STONE, 4, 6, 4);
      c.row(8, 15, 21, L(STONE));
      c.rect(15, 8, 21, 8, STONE);
      moss(c, [16, 12, 19, b]);
      if (u) {
        c.col(20, 12, b, SOOT);
        c.rect(21, 12, 27, b, hex('#4a3c30'));
        planksV(c, 21, 12, 27, b, hex('#33281f'), 3);
        dots(c, C.ghost, [22, b, 25, b - 1, 28, b, 30, b]);
      }
    },
    su: [0, 0, 8],
  });
  add('sandpit-wood', 'sandpit sandbox wooden sand bucket spade castle children garden', {
    w: 34, h: 13,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 4, 31, b - 2, SAND);
      dots(c, D(SAND), [6, b - 3, 14, b - 2, 22, b - 3, 28, b - 2]);
      board(c, 1, b - 1, 32, b, GREYW);
      c.rect(1, b - 4, 2, b, GREYW);
      c.rect(31, b - 4, 32, b, GREYW);
      moss(c, [3, b, 20, b]);
      if (!u) {
        c.rect(8, b - 8, 13, b - 5, SAND); // a castle
        c.row(b - 8, 8, 13, L(SAND));
        dots(c, L(SAND), [8, b - 9, 10, b - 9, 12, b - 9]);
        c.set(10, b - 6, D(SAND));
        c.col(11, b - 12, b - 10, CANE); // a paper flag
        c.rect(12, b - 12, 13, b - 11, C.red);
        c.poly([[21, b - 8], [26, b - 8], [25, b - 4], [22, b - 4]], hex('#5a7a9a')); // tin bucket
        c.row(b - 8, 21, 26, hex('#7a9aba'));
        c.line(28, b - 4, 30, b - 9, C.red); // spade
      } else {
        c.rect(7, b - 5, 14, b - 5, D(SAND)); // stamped flat
        c.set(12, b - 5, C.red);
        c.rect(17, b - 4, 22, b - 3, hex('#6a5a3a')); // a hole dug: a doll's arm coming up out of it
        c.col(19, b - 7, b - 4, C.flesh);
        c.set(18, b - 8, C.flesh);
        c.set(20, b - 8, C.flesh);
        heap(c, 23, 27, b - 4, 2, SAND, 3);
        c.rect(26, b - 6, 30, b - 4, hex('#5a7a9a')); // bucket over
        c.col(26, b - 6, b - 4, SOOT);
      }
    },
    sw: 18, sh: 13,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 4, 15, b - 2, SAND);
      board(c, 1, b - 1, 16, b, GREYW);
      c.rect(1, b - 4, 2, b, GREYW);
      c.rect(15, b - 4, 16, b, GREYW);
      if (!u) {
        c.rect(5, b - 8, 9, b - 5, SAND);
        c.row(b - 8, 5, 9, L(SAND));
        dots(c, L(SAND), [5, b - 9, 7, b - 9, 9, b - 9]);
        c.col(7, b - 12, b - 10, CANE);
        c.rect(8, b - 12, 9, b - 11, C.red);
        c.rect(11, b - 7, 13, b - 4, hex('#5a7a9a'));
      } else {
        c.rect(6, b - 4, 10, b - 3, hex('#6a5a3a'));
        c.col(8, b - 7, b - 4, C.flesh);
        c.set(7, b - 8, C.flesh);
        c.set(9, b - 8, C.flesh);
        c.rect(11, b - 6, 14, b - 4, hex('#5a7a9a'));
      }
    },
  });
  add('seesaw-plank', 'seesaw teeter totter plank children playground garden', {
    w: 40, h: 16, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        s = u ? -1 : 1,
        yl = b - 6 + s * 5,
        yr = b - 6 - s * 5;
      c.poly([[17, b], [19, b - 5], [20, b - 5], [22, b]], OAK); // the trestle
      c.line(17, b, 19, b - 5, L(OAK));
      c.line(2, yl, 37, yr, hex('#6a3a30'));
      c.line(2, yl - 1, 37, yr - 1, hex('#8a4a3c'));
      c.col(6, yl - 4 - s, yl - 1 - s, C.iron); // handles
      c.col(33, yr - 4 + s, yr - 1 + s, C.iron);
      dots(c, GREYW, [10, Math.round(yl - 1 - s * 1.2), 28, Math.round(yr - 1 + s * 1.3)]); // paint gone
      c.rect(19, b - 6, 20, b - 6, C.iron);
      if (u) dots(c, C.white, [3, yl - 4, 1, yl - 6, 36, yr + 2]); // just come down this side
    },
    sw: 10, sh: 16,
    s(c, u) {
      const b = c.h - 2,
        y = u ? 2 : b - 2;
      c.poly([[2, b], [4, b - 5], [5, b - 5], [7, b]], OAK);
      c.rect(2, y, 7, y + 1, hex('#6a3a30')); // the end of the plank nearest us: down, or up in the air
      c.row(y, 2, 7, hex('#8a4a3c'));
      c.rect(4, y - (u ? -2 : 4), 5, y - (u ? -4 : 1), C.iron);
      if (u) c.col(4, 4, b - 6, hex('#5a3028')), c.col(5, 4, b - 6, hex('#4a2620'));
    },
  });
  add('fairy-ring-toadstools', 'fairy ring toadstools mushrooms circle grass fungi glowing', {
    w: 30, h: 10,
    f(c, u) {
      const b = c.h - 2,
        cap = u ? hex('#8fd0a0') : hex('#8a3a30'),
        st = u ? hex('#c8e8c8') : CHINA;
      const ts = (x, y, big) => {
        c.set(x, y, st);
        c.row(y - 1, x - 1, x + 1, cap);
        if (big) {
          c.set(x, y - 2, cap);
          c.set(x - 1, y - 1, u ? C.white : C.white);
          c.set(x, y + 1, st);
        }
      };
      for (const [x, y] of [[6, 3], [11, 2], [18, 2], [23, 3]]) ts(x, y, false); // the far side of the ring
      for (const [x, y] of [[2, 5], [27, 5], [5, b - 1], [11, b - 1], [18, b - 1], [24, b - 1]]) ts(x, y, true);
      dots(c, C.leafLight, [8, 5, 14, 6, 21, 5, 15, 4, 3, b, 13, b, 21, b, 28, b]);
      dots(c, C.leaf, [9, b, 16, b, 26, b, 0, b]);
      if (u) dots(c, hex('#c8e8c8'), [14, 0, 9, 1, 20, 0, 15, 3, 4, 1, 25, 1]); // alight, and motes rising inside it
    },
  });
};
