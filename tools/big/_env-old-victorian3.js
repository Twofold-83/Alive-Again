/* Victorian, third part: presses and cases, the invalid's corner, pictures and curtains, silver and small things. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, tleg, cabSide, hollow, pane, flame, fire, wisp, bottle, cloth, shards, doorOut, wheel } = H;
  const add = H.reg('env-victorian', 'Victorian');
  const MAH = hex('#5e2f24'),
    WAL = hex('#59402e'),
    EB = hex('#2b242a'),
    VELVET = hex('#5a2436'),
    GILT = C.gold,
    BR = C.brass,
    MARB = hex('#b4aea0'),
    SILVER = hex('#a3a6ad'),
    CHINA = hex('#d6d2c4'),
    LACE = C.white,
    COPPER = hex('#9a5a36'),
    WICK = hex('#a08a5c'),
    MIRROR = hex('#6f8d95'),
    TEA = hex('#6a3f22');

  /* ---------- presses and cases ---------- */
  add('linen-press-mahogany', 'linen press mahogany cupboard sheets linen drawers tall wardrobe', {
    w: 26, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 4, 23, b - 2, MAH);
      c.rect(1, 2, 24, 3, MAH);
      c.row(2, 1, 24, L(MAH));
      c.row(3, 1, 24, D(MAH));
      if (!u) {
        panel(c, 4, 6, 12, 23, MAH);
        panel(c, 13, 6, 21, 23, MAH);
        c.col(12, 5, 24, D(MAH));
        c.set(11, 15, BR);
        c.set(14, 15, BR);
      } else {
        hollow(c, 4, 5, 21, 24, MAH); // the doors open: sliding trays of linen
        c.col(3, 5, 24, L(MAH));
        c.col(22, 5, 24, L(MAH));
        for (let y = 9; y <= 24; y += 5) {
          c.row(y, 4, 21, L(MAH));
          c.rect(5, y - 3, 20, y - 1, LACE);
          c.row(y - 2, 5, 20, D(LACE));
          c.col(12, y - 3, y - 1, D(LACE));
        }
        c.rect(5, 16, 11, 18, hex('#3a2a26')); // one pile taken
        c.poly([[14, 19], [20, 19], [21, 30], [16, 29]], LACE); // a sheet dragged half out
        c.line(17, 20, 18, 29, D(LACE));
        dots(c, C.blood, [19, 27, 20, 28, 18, 28]);
      }
      c.row(25, 2, 23, D(MAH));
      drawer(c, 4, 27, 12, 30, MAH);
      drawer(c, 13, 27, 21, 30, MAH);
      drawer(c, 4, 32, 21, 36, MAH);
      c.rect(2, b - 1, 4, b, D(MAH)); // bracket feet
      c.rect(21, b - 1, 23, b, D(MAH));
      if (u) {
        c.poly([[14, 19], [20, 19], [21, 30], [16, 29]], LACE);
        c.line(17, 20, 18, 29, D(LACE));
        dots(c, C.blood, [19, 27, 20, 28, 18, 28]);
      }
    },
    sw: 13, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, 4, 10, 24, MAH);
      cabSide(c, 2, 25, 10, b - 2, MAH);
      c.rect(1, 2, 11, 3, MAH);
      c.row(2, 1, 11, L(MAH));
      c.row(3, 1, 11, D(MAH));
      c.rect(2, b - 1, 4, b, D(MAH));
      c.rect(8, b - 1, 10, b, D(MAH));
      if (u) {
        doorOut(c, 11, 5, 24, 9, MAH);
        c.poly([[11, 19], [13, 19], [14, 30], [11, 29]], LACE);
        c.set(12, 28, C.blood);
      }
    },
    su: [0, 0, 9],
  });
  add('gun-cabinet-glass', 'gun cabinet glass shotguns rifles cartridges hunting case walnut', {
    w: 18, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2,
        baize = hex('#2f4a3a');
      face(c, 2, 3, 15, b - 1, WAL);
      c.row(2, 1, 16, L(WAL));
      c.rect(1, b - 1, 16, b, D(WAL));
      c.rect(4, 5, 13, 27, baize);
      c.row(5, 4, 13, D(baize));
      const gun = (x) => {
        c.col(x, 7, 20, C.steel);
        c.col(x + 1, 7, 18, C.iron);
        c.rect(x, 19, x + 1, 26, C.wood);
        c.set(x, 21, C.woodLight);
        c.set(x + 1, 18, K);
      };
      gun(5);
      if (!u) gun(8);
      gun(11);
      c.row(12, 4, 13, WAL); // the rack
      c.row(27, 4, 13, L(WAL));
      if (!u) {
        c.frame(4, 5, 13, 27, WAL);
        c.line(5, 10, 7, 7, C.glassLight);
        c.line(10, 24, 12, 21, MIRROR);
        c.set(13, 16, BR);
        panel(c, 4, 30, 13, b - 3, WAL);
        c.set(12, 33, BR);
      } else {
        c.col(14, 5, 27, L(WAL)); // door open, a gun gone
        hollow(c, 4, 30, 13, b - 3, WAL);
        c.col(14, 30, b - 3, L(WAL));
        c.rect(5, b - 6, 9, b - 4, hex('#7a4a3a')); // the cartridge box torn open
        c.row(b - 6, 5, 9, C.parchment);
        dots(c, C.red, [11, b - 4, 12, b - 4, 10, b, 12, b, 7, b]);
        dots(c, BR, [11, b - 3, 9, b]);
      }
    },
    sw: 10, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, 3, 7, 28, WAL);
      cabSide(c, 2, 29, 7, b - 1, WAL);
      c.row(2, 1, 8, L(WAL));
      c.rect(1, b - 1, 8, b, D(WAL));
      if (u) {
        doorOut(c, 8, 5, 27, 8, WAL, MIRROR);
        doorOut(c, 8, 30, b - 3, 8, WAL);
        dots(c, C.red, [10, b, 13, b]);
      }
    },
    su: [0, 0, 8],
  });
  add('aquarium-iron-stand', 'aquarium fish tank cast iron stand goldfish water plants victorian', {
    w: 24, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2,
        ir = hex('#2f3a34'),
        wat = hex('#3f6a6a');
      c.rect(1, 3, 22, 18, ir);
      c.row(3, 1, 22, L(ir));
      c.rect(3, 5, 20, 16, hex('#27323a')); // empty glass
      c.rect(3, u ? 13 : 6, 20, 16, wat);
      c.row(u ? 13 : 6, 3, 20, L(wat));
      c.rect(3, 15, 20, 16, hex('#8a7a5a')); // gravel
      dots(c, C.bone, [5, 15, 9, 16, 14, 15, 18, 16]);
      for (const [x, h] of [[5, 7], [7, 5], [16, 8], [18, 4]]) {
        const top = u ? 15 - Math.min(h, 3) : 15 - h;
        c.line(x, 14, x + (x % 2 ? 1 : -1), top, hex('#4a7a3c'));
      }
      if (!u) {
        c.rect(9, 9, 11, 10, C.flame); // goldfish
        c.set(12, 9, C.flameLight);
        c.set(8, 10, hex('#a05a20'));
        c.rect(13, 12, 15, 12, C.flame);
        c.set(12, 12, hex('#a05a20'));
        c.line(4, 12, 6, 7, blend(wat, C.glassLight, 0.5));
      } else {
        c.line(11, 5, 13, 9, C.glassLight); // cracked, and run nearly dry
        c.line(13, 9, 11, 13, C.glassLight);
        c.line(13, 9, 16, 11, C.glassLight);
        c.rect(9, 14, 11, 14, C.flame); // a fish on the gravel
        c.set(8, 14, hex('#a05a20'));
        c.col(12, 17, 22, wat);
        c.set(12, 24, wat);
        c.rect(8, b, 17, b, wat);
        c.set(10, b, L(wat));
      }
      c.col(12, 4, 17, ir);
      c.rect(2, 19, 21, 20, ir);
      c.row(19, 2, 21, L(ir));
      for (const x of [3, 19]) {
        c.rect(x, 21, x + 1, b, ir);
        c.set(x - 1, b, ir);
        c.set(x + 2, b, ir);
        c.set(x + (x < 10 ? 2 : -1), 22, ir); // brackets
        c.set(x + (x < 10 ? 3 : -2), 21, ir);
      }
      c.row(b - 4, 5, 18, D(ir));
    },
    sw: 14, sh: 32,
    s(c, u) {
      const b = c.h - 2,
        ir = hex('#2f3a34'),
        wat = hex('#3f6a6a');
      c.rect(1, 3, 12, 18, ir);
      c.row(3, 1, 12, L(ir));
      c.rect(3, 5, 10, 16, hex('#27323a'));
      c.rect(3, u ? 13 : 6, 10, 16, wat);
      c.row(u ? 13 : 6, 3, 10, L(wat));
      c.rect(3, 15, 10, 16, hex('#8a7a5a'));
      c.line(5, 14, 4, u ? 12 : 8, hex('#4a7a3c'));
      c.line(8, 14, 9, u ? 12 : 10, hex('#4a7a3c'));
      if (!u) {
        c.rect(6, 10, 7, 11, C.flame); // a fish coming at us
        c.set(6, 10, C.flameLight);
      } else {
        c.rect(6, 14, 8, 14, C.flame);
        c.col(11, 17, 22, wat);
        c.rect(9, b, 13, b, wat);
      }
      c.rect(2, 19, 11, 20, ir);
      c.row(19, 2, 11, L(ir));
      for (const x of [3, 9]) {
        c.rect(x, 21, x + 1, b, ir);
        c.set(x - 1, b, ir);
        c.set(x + 2, b, ir);
      }
      c.row(b - 4, 5, 8, D(ir));
    },
    su: [0, 0, 1],
  });
  add('wardian-case-ferns', 'wardian case fern case terrarium glass plants stand conservatory', {
    w: 22, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2,
        ir = hex('#3a3f34'),
        g = hex('#3f6a3c'),
        air = hex('#2c3a34');
      c.poly([[2, 9], [7, 3], [14, 3], [19, 9], [19, 20], [2, 20]], air);
      for (const [x, y, d] of [[6, 19, -1], [9, 19, 1], [12, 19, -1], [15, 19, 1], [10, 19, 0]]) {
        c.line(x, y, x + d * 2, y - 7, g); // ferns
        c.line(x, y - 2, x - 2, y - 5, C.leafLight);
        c.line(x, y - 3, x + 2, y - 6, C.leafLight);
      }
      c.rect(3, 19, 18, 20, C.earth);
      c.line(2, 9, 7, 3, ir); // the iron frame
      c.line(19, 9, 14, 3, ir);
      c.row(3, 7, 14, L(ir));
      c.row(9, 2, 19, ir);
      c.col(2, 9, 20, L(ir));
      c.col(19, 9, 20, ir);
      c.col(8, 9, 20, ir);
      c.col(13, 9, 20, ir);
      c.rect(10, 1, 11, 2, ir); // finial
      c.line(4, 13, 6, 11, C.glassLight);
      c.line(15, 17, 17, 15, MIRROR);
      board(c, 1, 21, 20, 22, WAL);
      for (const x of [3, 18]) tleg(c, x, 23, b, WAL);
      c.row(b - 3, 4, 17, D(WAL));
      if (u) {
        const v = hex('#6a7a3a'); // it has grown out through a broken pane
        c.rect(14, 11, 18, 16, air);
        dots(c, C.glassLight, [14, 11, 18, 16, 15, 17]);
        c.line(15, 13, 20, 14, v);
        c.line(20, 14, 21, 24, v);
        c.line(21, 24, 19, b - 2, v);
        c.line(16, 15, 17, 26, v);
        c.line(17, 26, 14, b, v);
        dots(c, C.leafLight, [20, 17, 22, 20, 18, 22, 16, 28, 20, 28]);
        dots(c, hex('#b7a0a8'), [21, 22, 15, b - 1]); // pale flowers
        dots(c, C.glassLight, [12, b, 9, b]);
      }
    },
    u: [0, 0, 2],
    sw: 14, sh: 34,
    s(c, u) {
      const b = c.h - 2,
        ir = hex('#3a3f34'),
        g = hex('#3f6a3c'),
        air = hex('#2c3a34');
      c.poly([[2, 9], [6, 3], [7, 3], [11, 9], [11, 20], [2, 20]], air);
      c.line(5, 19, 4, 12, g);
      c.line(8, 19, 9, 13, g);
      c.line(6, 19, 7, 10, C.leafLight);
      c.rect(3, 19, 10, 20, C.earth);
      c.line(2, 9, 6, 3, ir);
      c.line(11, 9, 7, 3, ir);
      c.row(9, 2, 11, ir);
      c.col(2, 9, 20, L(ir));
      c.col(11, 9, 20, ir);
      c.rect(6, 1, 7, 2, ir);
      c.line(4, 14, 5, 12, C.glassLight);
      board(c, 1, 21, 12, 22, WAL);
      for (const x of [3, 10]) tleg(c, x, 23, b, WAL);
      c.row(b - 3, 4, 9, D(WAL));
      if (u) {
        const v = hex('#6a7a3a');
        c.line(11, 13, 13, 15, v);
        c.line(13, 15, 14, 25, v);
        c.line(14, 25, 12, b, v);
        dots(c, C.leafLight, [14, 18, 12, 22, 15, 27]);
        c.set(13, b - 1, hex('#b7a0a8'));
      }
    },
    su: [0, 0, 3],
  });

  /* ---------- the invalid's corner ---------- */
  add('bath-chair-wicker', 'bath chair wicker invalid chair wheelchair old three wheels rug', {
    w: 28, h: 31, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        rug = hex('#4a5a4a');
      c.poly([[3, 4], [7, 3], [8, 18], [4, 18]], WICK); // the high back
      c.line(3, 4, 4, 18, L(WICK));
      for (let y = 5; y < 18; y += 2) c.set(6, y, D(WICK));
      c.poly([[5, 4], [11, 5], [12, 9], [8, 10]], WICK); // hood
      c.line(5, 4, 11, 5, L(WICK));
      c.rect(4, 17, 17, 21, WICK); // seat and body
      c.row(17, 8, 17, L(WICK));
      for (let x = 5; x < 17; x += 2) c.set(x, 19 + (x % 4 ? 0 : 1), D(WICK));
      c.rect(8, 13, 15, 14, WICK); // arm
      c.col(15, 14, 17, D(WICK));
      c.line(17, 21, 23, 24, C.iron); // the frame down to the front wheel
      c.rect(16, 22, 20, 23, WAL); // footboard
      wheel(c, 9, b - 5, 5, C.iron);
      wheel(c, 23, b - 2, 2, C.iron);
      c.line(23, b - 4, 19, 10, BR); // the tiller
      c.line(19, 10, 16, 10, BR);
      c.set(15, 10, WAL);
      if (!u) {
        c.poly([[9, 15], [17, 15], [20, 22], [16, 23], [9, 18]], rug); // a rug over the knees of nobody
        c.line(9, 15, 17, 15, L(rug));
        for (let x = 10; x < 19; x += 3) c.line(x, 16, x + 2, 22, C.wine);
        c.row(18, 10, 18, C.mustard);
      } else {
        c.rect(9, 15, 15, 16, mix(WICK, 0.6)); // the seat bare and dented, the rug on the ground
        c.rect(15, b - 1, 26, b, rug);
        c.row(b - 2, 17, 23, rug);
        c.row(b - 2, 18, 22, L(rug));
        for (let x = 16; x < 26; x += 3) c.set(x, b - 1, C.wine);
        c.row(b, 15, 26, D(rug));
        wheel(c, 23, b - 2, 2, C.iron);
      }
    },
    sw: 18, sh: 31,
    s(c, u) {
      const b = c.h - 2,
        rug = hex('#4a5a4a');
      c.rect(3, 4, 14, 18, WICK); // the back, from the front
      c.row(3, 4, 13, L(WICK));
      for (let y = 5; y < 17; y += 2) for (let x = 4 + (y % 4 ? 1 : 0); x < 14; x += 2) c.set(x, y, D(WICK));
      c.rect(4, 5, 13, 8, mix(WICK, 0.55)); // under the hood
      c.rect(2, 12, 3, 20, WICK); // arms
      c.rect(14, 12, 15, 20, WICK);
      c.rect(4, 17, 13, 21, WICK);
      c.row(17, 4, 13, L(WICK));
      for (const x of [1, 15]) {
        c.rect(x, b - 10, x + 1, b, C.iron); // the big wheels, edge on
        c.col(x, b - 10, b, L(C.iron));
      }
      c.rect(5, 22, 12, 23, WAL);
      c.col(8, 12, b - 3, BR); // tiller
      c.row(11, 6, 10, WAL);
      c.rect(8, b - 3, 9, b, C.iron);
      if (!u) {
        c.rect(4, 15, 13, 22, rug);
        c.row(15, 4, 13, L(rug));
        for (let x = 5; x < 13; x += 3) c.col(x, 16, 22, C.wine);
        c.row(18, 4, 13, C.mustard);
        c.col(8, 12, 15, BR);
      } else {
        c.rect(5, 15, 12, 16, mix(WICK, 0.6));
        c.rect(3, b - 1, 14, b, rug);
        c.row(b - 2, 5, 11, L(rug));
        for (let x = 4; x < 14; x += 3) c.set(x, b - 1, C.wine);
      }
    },
  });
  add('commode-chair-night', 'commode chair night stool close stool chamber pot bedroom', {
    w: 16, h: 24, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 3, 2, 12, 11, MAH); // back
      panel(c, 5, 4, 10, 9, MAH);
      for (const x of [1, 12]) {
        c.rect(x, 9, x + 2, b, MAH); // arms down to the feet
        c.row(9, x, x + 2, L(MAH));
      }
      c.col(1, 9, b, L(MAH));
      face(c, 3, 13, 12, b - 1, MAH); // the box
      panel(c, 5, 15, 10, b - 3, MAH);
      if (!u) {
        c.rect(3, 11, 12, 12, VELVET); // padded lid
        c.row(11, 3, 12, L(VELVET));
      } else {
        c.rect(4, 3, 11, 10, D(MAH)); // the lid up against the back
        c.rect(5, 4, 10, 9, hex('#8a7a6a'));
        c.rect(3, 11, 12, 12, hex('#3a2a26'));
        c.rect(5, 11, 10, 11, CHINA); // the pan
        c.row(12, 6, 9, hex('#6a6a4a'));
        c.set(4, 11, L(CHINA));
        wisp(c, 12, 9, 3, C.rot);
      }
    },
    sw: 15, sh: 24,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 3, b, MAH); // back post
      c.col(2, 2, b, L(MAH));
      cabSide(c, 3, 13, 11, b - 1, MAH);
      c.rect(3, 9, 11, 10, MAH); // arm
      c.row(9, 3, 11, L(MAH));
      c.rect(10, 11, 11, b, MAH);
      if (!u) {
        c.rect(3, 11, 11, 12, VELVET);
        c.row(11, 3, 11, L(VELVET));
      } else {
        c.line(4, 3, 5, 8, D(MAH)); // lid thrown back
        c.line(5, 3, 6, 8, hex('#8a7a6a'));
        c.rect(4, 11, 10, 12, hex('#3a2a26'));
        c.row(11, 5, 9, CHINA);
        wisp(c, 8, 8, 3, C.rot);
      }
    },
  });
  add('geyser-copper-bath', 'geyser copper water heater bath gas boiler pipes hot water bathroom', {
    w: 16, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, 1, 8, 3, C.iron); // flue
      c.poly([[4, 6], [6, 4], [9, 4], [11, 6]], COPPER);
      c.rect(3, 6, 12, 23, COPPER);
      c.col(3, 6, 23, L(COPPER));
      c.col(5, 6, 23, L(L(COPPER)));
      c.col(11, 6, 23, D(COPPER));
      for (const y of [8, 15, 22]) {
        c.row(y, 3, 12, BR);
        dots(c, D(BR), [4, y, 7, y, 10, y]);
      }
      c.rect(6, 17, 9, 19, BR); // maker's plate
      c.rect(4, 24, 11, 27, C.ironDark); // the burner
      for (let x = 5; x <= 10; x += 2) c.col(x, 24, 26, u ? C.flame : K);
      c.rect(3, 28, 12, 28, C.iron);
      c.col(7, 29, b, C.iron); // gas pipe
      c.set(8, 31, BR);
      c.set(9, 31, BR);
      c.row(25, 12, 14, BR); // the spout
      c.set(14, 26, BR);
      c.rect(1, 12, 2, 13, C.iron); // bracket to the wall
      if (u) {
        dots(c, C.flameLight, [5, 25, 7, 25, 9, 25]);
        dots(c, hex('#5a7a9a'), [5, 26, 7, 26, 9, 26]);
        c.col(14, 27, b, hex('#7fa3ad')); // hot water
        dots(c, C.white, [14, 29, 14, b - 2]);
        c.row(b, 12, 15, hex('#7fa3ad'));
        wisp(c, 12, b - 3, 4, C.ghost);
        wisp(c, 7, 0, 2, C.ash);
      }
    },
    u: [0, 2, 0],
    sw: 14, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 1, 6, 3, C.iron);
      c.poly([[3, 6], [4, 4], [7, 4], [8, 6]], COPPER);
      c.rect(2, 6, 9, 23, COPPER);
      c.col(2, 6, 23, L(COPPER));
      c.col(4, 6, 23, L(L(COPPER)));
      c.col(8, 6, 23, D(COPPER));
      for (const y of [8, 15, 22]) c.row(y, 2, 9, BR);
      c.rect(3, 24, 8, 27, C.ironDark);
      for (let x = 4; x <= 7; x += 2) c.col(x, 24, 26, u ? C.flame : K);
      c.rect(2, 28, 9, 28, C.iron);
      c.col(4, 29, b, C.iron);
      c.row(25, 9, 12, BR); // the spout swung out over the bath
      c.set(12, 26, BR);
      c.set(10, 24, BR);
      if (u) {
        dots(c, C.flameLight, [4, 25, 6, 25]);
        c.col(12, 27, b, hex('#7fa3ad'));
        dots(c, C.white, [12, 29, 12, b - 2]);
        c.row(b, 10, 13, hex('#7fa3ad'));
        wisp(c, 10, b - 3, 4, C.ghost);
        wisp(c, 5, 0, 2, C.ash);
      }
    },
    su: [0, 2, 0],
  });

  /* ---------- pictures, curtains, statuary ---------- */
  add('portrait-ancestor-gilt', 'portrait ancestor oil painting gilt frame stern man picture wall safe', {
    w: 20, h: 26,
    f(c, u) {
      if (!u) {
        c.rect(1, 1, 18, 23, GILT);
        c.row(1, 1, 18, L(GILT));
        c.col(1, 1, 23, L(GILT));
        dots(c, D(GILT), [2, 2, 17, 2, 2, 22, 17, 22, 9, 2, 10, 22, 2, 12, 17, 12]);
        c.rect(3, 3, 16, 21, hex('#2a2620'));
        c.poly([[5, 21], [6, 15], [13, 15], [14, 21]], hex('#1e1b24')); // black coat
        c.rect(8, 14, 11, 15, C.white); // collar
        c.rect(7, 7, 12, 13, hex('#b08f70')); // a long pale face
        c.rect(7, 5, 12, 7, hex('#6a6258')); // grey hair
        c.col(6, 6, 11, hex('#6a6258')); // whiskers
        c.col(13, 6, 11, hex('#6a6258'));
        c.set(8, 9, K);
        c.set(11, 9, K);
        c.row(12, 9, 10, hex('#7a4a3a'));
        c.col(12, 8, 13, hex('#8a6a50'));
        c.set(10, 18, GILT); // watch chain
        c.set(11, 19, GILT);
      } else {
        c.rect(1, 1, 3, 23, GILT); // swung aside on a hinge: the safe behind
        c.col(1, 1, 23, L(GILT));
        c.col(3, 1, 23, D(GILT));
        c.rect(4, 3, 18, 21, hex('#3a342e'));
        c.rect(6, 6, 17, 19, C.iron);
        c.row(6, 6, 17, C.steel);
        c.col(6, 6, 19, C.steel);
        c.frame(8, 8, 15, 17, C.ironDark);
        c.oval(10, 10, 13, 13, BR);
        c.set(11, 11, K);
        c.rect(14, 14, 14, 15, BR);
        dots(c, C.ironDark, [7, 7, 16, 7, 7, 18, 16, 18]);
      }
    },
    sw: 6, sh: 26,
    s(c, u) {
      c.rect(1, 1, 3, 23, GILT);
      c.col(1, 1, 23, D(WAL));
      c.col(3, 1, 23, L(GILT));
      if (u) {
        c.clearRect(2, 1, 3, 23);
        c.rect(2, 6, 3, 19, C.iron); // the safe door in the wall
        c.col(3, 6, 19, C.steel);
        c.rect(4, 1, 19, 23, hex('#8a7a5a')); // the back of the canvas, standing out into the room
        c.frame(4, 1, 19, 23, WAL);
        c.row(12, 5, 18, WAL);
        c.col(11, 2, 22, WAL);
        c.col(19, 1, 23, GILT);
        dots(c, C.parchment, [7, 5, 8, 5, 9, 5]);
        c.set(4, 4, BR);
        c.set(4, 20, BR);
      }
    },
    su: [0, 0, 15],
  });
  add('curtains-velvet-pelmet', 'curtains velvet drapes pelmet window heavy red tassels night', {
    w: 30, h: 46, solid: true,
    f(c, u) {
      const b = c.h - 2,
        v = VELVET;
      if (u) {
        c.rect(3, 7, 26, b - 6, C.night); // drawn back: the window, and the dark outside
        c.rect(4, 8, 25, b - 7, hex('#1c2238'));
        c.col(14, 7, b - 6, CHINA);
        c.col(15, 7, b - 6, D(CHINA));
        c.row(21, 4, 25, CHINA);
        c.rect(3, b - 6, 26, b - 5, CHINA); // sill
        dots(c, C.ghost, [19, 12, 20, 12, 19, 13, 8, 27]);
        c.oval(18, 10, 21, 14, C.bone); // a moon
        c.set(21, 11, hex('#1c2238'));
        for (const s of [0, 1]) {
          const X = (x) => (s ? 29 - x : x);
          c.poly([[X(2), 6], [X(9), 6], [X(8), 20], [X(5), 26], [X(7), 32], [X(8), b], [X(2), b]], v);
          c.line(X(4), 8, X(4), b - 1, D(v));
          c.line(X(7), 8, X(6), 24, D(v));
          c.row(26, Math.min(X(3), X(6)), Math.max(X(3), X(6)), GILT); // tie-back
          c.set(X(6), 27, C.mustard);
          c.set(X(6), 28, C.mustard);
          if (!s) c.col(2, 7, b, L(v));
        }
      } else {
        c.rect(2, 6, 27, b, v);
        c.col(2, 7, b, L(v));
        for (let x = 5; x < 27; x += 3) c.col(x, 7 + (x % 2), b - (x % 4), D(v));
        c.col(14, 7, b, mix(v, 0.45));
        dots(c, L(v), [8, 12, 11, 20, 17, 15, 20, 28, 23, 10, 9, 34, 18, 38]);
        c.row(b, 2, 27, D(v));
      }
      c.rect(1, 1, 28, 5, v); // the pelmet
      c.row(1, 1, 28, L(v));
      c.row(2, 1, 28, GILT);
      for (let x = 1; x <= 28; x++) c.set(x, 6, x % 2 ? C.mustard : GILT);
      for (let x = 3; x <= 28; x += 5) c.set(x, 7, C.mustard);
      c.row(5, 1, 28, D(v));
    },
    sw: 8, sh: 46,
    s(c, u) {
      const b = c.h - 2,
        v = VELVET;
      c.col(1, 6, b, CHINA); // the window frame behind
      if (!u) {
        c.rect(2, 6, 4, b, v);
        c.col(2, 7, b, L(v));
        c.col(4, 7, b, D(v));
      } else {
        c.poly([[2, 6], [5, 6], [5, 20], [4, 26], [5, 32], [5, b], [2, b]], v);
        c.col(2, 7, b, L(v));
        c.col(4, 8, 24, D(v));
        c.row(26, 2, 4, GILT);
        c.set(5, 27, C.mustard);
        c.col(1, 7, b - 6, hex('#1c2238'));
      }
      c.rect(1, 1, 6, 5, v);
      c.row(1, 1, 6, L(v));
      c.row(2, 1, 6, GILT);
      for (let x = 1; x <= 6; x++) c.set(x, 6, x % 2 ? C.mustard : GILT);
    },
  });
  add('bust-marble-pedestal', 'bust marble head statue pedestal column sculpture hall', {
    w: 14, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2,
        ped = hex('#5f6a64');
      c.rect(2, b - 1, 11, b, ped); // pedestal
      c.row(b - 1, 2, 11, L(ped));
      c.rect(4, 19, 9, b - 2, ped);
      c.col(4, 19, b - 2, L(ped));
      c.col(9, 19, b - 2, D(ped));
      dots(c, D(ped), [6, 22, 7, 27, 5, 31, 7, 34]);
      c.rect(3, 17, 10, 18, ped);
      c.row(17, 3, 10, L(ped));
      c.poly([[2, 16], [3, 12], [10, 12], [11, 16]], MARB); // shoulders
      c.line(2, 16, 3, 12, L(MARB));
      c.line(5, 13, 7, 16, D(MARB)); // drapery
      c.line(9, 13, 7, 16, D(MARB));
      c.rect(6, 10, 7, 11, MARB); // neck
      if (!u) {
        c.rect(4, 3, 9, 9, MARB);
        c.rect(5, 2, 8, 2, MARB);
        c.col(4, 3, 9, L(MARB));
        c.row(3, 4, 9, D(MARB)); // hair
        c.set(4, 4, D(MARB));
        c.set(9, 4, D(MARB));
        c.set(5, 6, D(MARB)); // blank eyes
        c.set(8, 6, D(MARB));
        c.col(7, 6, 7, D(MARB));
        c.row(8, 6, 7, D(MARB));
        c.clear(4, 9);
        c.clear(9, 9);
      } else {
        c.row(10, 6, 7, D(MARB)); // the head struck off
        c.set(6, 9, MARB);
        c.oval(0, b - 6, 5, b, MARB);
        c.row(b - 5, 1, 4, D(MARB));
        c.set(2, b - 3, D(MARB));
        c.set(4, b - 3, D(MARB));
        c.set(5, b - 2, K);
        dots(c, MARB, [7, b, 12, b, 13, b - 1]);
      }
    },
    u: [1, 0, 1],
    sw: 14, sh: 40,
    s(c, u) {
      const b = c.h - 2,
        ped = hex('#5f6a64');
      c.rect(2, b - 1, 11, b, ped);
      c.row(b - 1, 2, 11, L(ped));
      c.rect(4, 19, 9, b - 2, ped);
      c.col(4, 19, b - 2, L(ped));
      c.col(9, 19, b - 2, D(ped));
      dots(c, D(ped), [6, 23, 7, 29, 5, 33]);
      c.rect(3, 17, 10, 18, ped);
      c.row(17, 3, 10, L(ped));
      c.poly([[3, 16], [4, 12], [9, 12], [10, 16]], MARB);
      c.line(3, 16, 4, 12, L(MARB));
      c.line(6, 13, 8, 16, D(MARB));
      c.rect(6, 10, 7, 11, MARB);
      if (!u) {
        c.rect(4, 3, 9, 9, MARB); // in profile, looking right
        c.rect(5, 2, 8, 2, MARB);
        c.rect(4, 3, 6, 6, D(MARB)); // hair behind
        c.row(3, 4, 9, D(MARB));
        c.set(10, 6, MARB); // nose
        c.set(8, 5, D(MARB));
        c.set(9, 8, D(MARB));
        c.clear(4, 9);
        c.clear(9, 9);
        c.clear(4, 8);
      } else {
        c.row(10, 6, 7, D(MARB));
        c.oval(11, b - 6, 16, b, MARB);
        c.row(b - 5, 12, 15, D(MARB));
        c.set(14, b - 3, D(MARB));
        c.set(11, b - 2, K);
        dots(c, MARB, [18, b, 9, b]);
      }
    },
    su: [0, 0, 5],
  });
  add('palm-brass-tub', 'palm potted palm brass tub parlour palm kentia plant fronds', {
    w: 24, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2,
        g = u ? hex('#6d6436') : C.leaf,
        gl = u ? hex('#8a7a40') : C.leafLight;
      c.rect(8, b - 8, 15, b - 1, BR); // tub
      c.row(b - 8, 7, 16, L(BR));
      c.col(8, b - 7, b - 1, L(BR));
      c.row(b - 5, 8, 15, D(BR));
      c.set(7, b - 5, BR);
      c.set(16, b - 5, D(BR));
      c.rect(9, b, 14, b, D(BR));
      c.col(11, 14, b - 9, hex('#5c4a34'));
      c.col(12, 16, b - 9, hex('#4a3c2c'));
      const frond = (x1, y1, col) => {
        c.line(11, 14, x1, y1, col);
        const n = Math.max(Math.abs(x1 - 11), Math.abs(y1 - 14));
        for (let i = 2; i < n; i += 2) {
          const x = Math.round(11 + ((x1 - 11) * i) / n),
            y = Math.round(14 + ((y1 - 14) * i) / n);
          c.set(x + (x1 > 11 ? -1 : 1), y + 1, col);
          c.set(x, y + 2, col);
          c.set(x + (x1 > 11 ? 1 : -1), y - 1, col);
        }
      };
      if (!u) {
        frond(2, 6, g);
        frond(5, 2, gl);
        frond(11, 1, g);
        frond(17, 2, gl);
        frond(21, 7, g);
        frond(1, 13, gl);
        frond(22, 14, gl);
      } else {
        frond(3, 22, g); // all brown and hanging
        frond(1, 16, gl);
        frond(20, 23, g);
        frond(22, 17, gl);
        frond(9, 5, g);
        frond(15, 7, gl);
        dots(c, g, [3, b, 4, b, 18, b, 20, b - 1, 5, b - 1, 21, b]);
      }
    },
  });

  /* ---------- silver and small things ---------- */
  add('tea-urn-silver', 'tea urn silver samovar tap hot water urn sideboard', {
    w: 16, h: 22,
    f(c, u) {
      const b = c.h - 2;
      c.rect(4, b - 1, 11, b, SILVER); // square foot
      c.row(b - 1, 4, 11, L(SILVER));
      c.rect(6, b - 4, 9, b - 2, D(SILVER));
      c.oval(3, 6, 12, b - 4, SILVER);
      c.col(5, 8, b - 7, L(SILVER));
      c.col(6, 7, b - 6, L(L(SILVER)));
      c.row(6, 5, 10, D(SILVER));
      c.rect(6, 4, 9, 5, SILVER); // lid
      c.rect(7, 2, 8, 3, EB);
      for (const x of [1, 13]) {
        c.col(x, 9, 12, SILVER); // handles
        c.set(x + (x < 5 ? 1 : -1), 8, SILVER);
        c.set(x + (x < 5 ? 1 : -1), 13, SILVER);
      }
      c.rect(7, b - 6, 8, b - 5, BR); // the tap
      c.set(7, b - 7, C.bone);
      c.set(8, b - 7, C.bone);
      if (u) {
        c.col(7, b - 4, b - 2, TEA);
        c.rect(6, b - 1, 9, b, CHINA); // a cup under it, running over
        c.row(b - 1, 6, 9, TEA);
        c.set(10, b - 1, D(CHINA));
        c.set(5, b, TEA);
        wisp(c, 9, b - 3, 3, C.ghost);
        wisp(c, 7, 1, 2, C.ghost);
      }
    },
    u: [0, 1, 0],
    sw: 14, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 1, 9, b, SILVER);
      c.row(b - 1, 3, 9, L(SILVER));
      c.rect(5, b - 4, 7, b - 2, D(SILVER));
      c.oval(2, 6, 10, b - 4, SILVER);
      c.col(4, 8, b - 7, L(SILVER));
      c.row(6, 4, 8, D(SILVER));
      c.rect(5, 4, 7, 5, SILVER);
      c.rect(6, 2, 6, 3, EB);
      c.oval(5, 9, 7, 12, D(SILVER)); // a handle, end on
      c.set(6, 10, SILVER);
      c.row(b - 6, 10, 11, BR); // the tap sticking out
      c.set(11, b - 7, C.bone);
      c.set(12, b - 5, BR);
      if (u) {
        c.col(12, b - 4, b - 2, TEA);
        c.rect(11, b - 1, 13, b, CHINA);
        c.row(b - 1, 11, 13, TEA);
        c.set(10, b, TEA);
        wisp(c, 13, b - 3, 3, C.ghost);
        wisp(c, 6, 1, 2, C.ghost);
      }
    },
    su: [0, 1, 1],
  });
  add('soup-tureen-silver', 'soup tureen silver dish lid ladle dinner table serving', {
    w: 18, h: 13,
    f(c, u) {
      const b = c.h - 2;
      c.rect(6, b, 11, b, D(SILVER));
      c.rect(7, b - 1, 10, b - 1, SILVER);
      c.oval(2, b - 7, 15, b - 1, SILVER);
      c.clearRect(2, b - 7, 15, b - 6);
      c.row(b - 5, 2, 15, L(SILVER));
      c.row(b - 3, 4, 8, L(L(SILVER)));
      c.set(1, b - 4, SILVER); // handles
      c.set(16, b - 4, D(SILVER));
      if (!u) {
        c.poly([[3, b - 6], [5, b - 8], [12, b - 8], [14, b - 6]], SILVER); // lid
        c.row(b - 8, 5, 12, L(SILVER));
        c.rect(8, b - 10, 9, b - 9, SILVER);
        c.row(b - 6, 2, 15, D(SILVER));
      } else {
        c.row(b - 6, 3, 14, hex('#8a4a2a')); // soup, and the ladle in it
        c.row(b - 6, 5, 8, hex('#a8623a'));
        c.line(11, b - 6, 14, b - 10, SILVER);
        c.set(15, b - 10, SILVER);
        wisp(c, 6, b - 7, 3, C.ghost);
        dots(c, hex('#8a4a2a'), [4, b - 2, 3, b]);
      }
    },
    sw: 12, sh: 13,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, b, 7, b, D(SILVER));
      c.rect(5, b - 1, 6, b - 1, SILVER);
      c.oval(2, b - 7, 9, b - 1, SILVER);
      c.clearRect(2, b - 7, 9, b - 6);
      c.row(b - 5, 2, 9, L(SILVER));
      c.oval(4, b - 4, 7, b - 2, D(SILVER)); // handle, end on
      c.set(5, b - 3, SILVER);
      c.set(6, b - 3, SILVER);
      if (!u) {
        c.poly([[3, b - 6], [4, b - 8], [7, b - 8], [8, b - 6]], SILVER);
        c.row(b - 8, 4, 7, L(SILVER));
        c.rect(5, b - 10, 6, b - 9, SILVER);
        c.row(b - 6, 2, 9, D(SILVER));
      } else {
        c.row(b - 6, 3, 8, hex('#8a4a2a'));
        c.line(6, b - 6, 8, b - 10, SILVER);
        wisp(c, 4, b - 7, 3, C.ghost);
      }
    },
  });
  add('tantalus-decanters', 'tantalus decanters cut glass whisky brandy port lock stand spirits', {
    w: 18, h: 15,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 1, 16, b, MAH);
      c.col(1, 3, b - 2, MAH);
      c.col(16, 3, b - 2, D(MAH));
      const dec = (x, col, lvl) => {
        c.rect(x, b - 7, x + 3, b - 2, C.glassLight);
        c.rect(x, b - 2 - lvl, x + 3, b - 2, col);
        c.col(x, b - 7, b - 2, C.white);
        c.rect(x + 1, b - 9, x + 2, b - 8, C.glassLight);
        c.rect(x + 1, b - 10, x + 2, b - 10, C.glass);
      };
      dec(3, hex('#9a6a2a'), u ? 1 : 4);
      if (!u) dec(7, C.wine, 4);
      dec(11, hex('#7a4a22'), 3);
      if (!u) {
        c.row(2, 1, 16, BR); // the bar locked down over the stoppers
        c.rect(8, 1, 9, 1, BR);
        c.set(15, 3, GILT);
      } else {
        c.line(1, 2, 12, 0, BR); // the bar swung up
        c.set(1, 3, BR);
        c.rect(7, b - 3, 8, b - 2, C.glassLight); // a glass, where the port stood
        c.row(b - 2, 7, 8, C.wine);
        dots(c, C.wine, [10, b - 1, 9, b - 2]);
      }
    },
    u: [0, 2, 0],
    sw: 9, sh: 15,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 1, 7, b, MAH);
      c.col(4, 3, b - 2, MAH);
      c.rect(2, b - 7, 6, b - 2, C.glassLight);
      c.rect(2, b - 2 - (u ? 1 : 4), 6, b - 2, hex('#9a6a2a'));
      c.col(2, b - 7, b - 2, C.white);
      c.rect(3, b - 10, 5, b - 8, C.glassLight);
      c.col(4, 3, b - 11, MAH);
      if (!u) c.rect(3, 2, 5, 2, BR);
      else {
        c.rect(4, 0, 4, 2, BR);
        c.set(7, b - 2, C.wine);
      }
    },
    su: [0, 2, 0],
  });
  add('writing-slope-box', 'writing slope box lap desk letters ink pen portable desk brass bound', {
    w: 18, h: 11,
    f(c, u) {
      const b = c.h - 2;
      if (!u) {
        face(c, 1, 3, 16, b, MAH);
        c.row(6, 1, 16, D(MAH));
        dots(c, BR, [1, 3, 16, 3, 1, b, 16, b, 2, 3, 15, 3]);
        c.rect(8, 6, 9, 7, BR); // lock plate
        c.set(8, 7, K);
      } else {
        c.poly([[1, b - 3], [16, 2], [16, b], [1, b]], MAH); // opened out into a slope
        c.poly([[2, b - 4], [15, 2], [15, 4], [2, b - 2]], hex('#33503f'));
        c.line(1, b - 3, 16, 1, L(MAH));
        c.poly([[5, b - 5], [10, 2], [12, 3], [7, b - 4]], C.paper); // a letter begun
        c.line(7, b - 6, 10, 4, C.slate);
        c.rect(14, 0, 15, 1, EB); // inkwell
        c.set(14, 0, C.navy);
        c.line(11, 1, 13, -1, C.bone); // pen
        dots(c, BR, [1, b, 16, b]);
        c.set(4, b - 4, C.navy); // a blot
      }
    },
    u: [0, 2, 0],
    sw: 12, sh: 11,
    s(c, u) {
      const b = c.h - 2;
      if (!u) {
        face(c, 1, 3, 10, b, MAH);
        c.row(6, 1, 10, D(MAH));
        dots(c, BR, [1, 3, 10, 3, 1, b, 10, b]);
      } else {
        face(c, 1, 2, 10, b, MAH);
        c.rect(2, 3, 9, b - 2, hex('#33503f'));
        c.rect(3, 4, 7, b - 3, C.paper);
        c.row(5, 4, 6, C.slate);
        c.rect(8, 0, 9, 1, EB);
        c.set(8, 0, C.navy);
        dots(c, BR, [1, b, 10, b]);
      }
    },
    su: [0, 2, 0],
  });
  add('chamber-candlestick-brass', 'chamber candlestick brass candle holder bedtime candle snuffer', {
    w: 11, h: 12,
    f(c, u) {
      const b = c.h - 2;
      c.rect(1, b, 8, b, D(BR));
      c.rect(1, b - 1, 8, b - 1, BR);
      c.set(1, b - 1, L(BR));
      c.rect(8, b - 3, 9, b - 2, BR); // ring handle
      c.set(9, b - 1, D(BR));
      c.rect(4, b - 3, 5, b - 2, BR);
      c.rect(4, 4, 5, b - 4, C.bone);
      c.col(4, 4, b - 4, C.white);
      c.set(6, 5, C.bone); // a run of wax
      c.set(6, 6, C.bone);
      if (u) {
        c.set(4, 3, C.flame);
        c.set(5, 3, C.flameLight);
        c.set(4, 2, C.flameLight);
        c.set(4, 1, C.flame);
      } else c.set(4, 3, K);
    },
  });
  add('speaking-tube-brass', 'speaking tube brass mouthpiece whistle voice pipe servants wall', {
    w: 11, h: 22,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 1, 8, 9, WAL); // back plate
      c.row(1, 2, 8, L(WAL));
      c.oval(3, 2, 7, 7, BR);
      c.oval(4, 3, 6, 6, u ? K : C.bone); // the whistle plug in the mouth
      if (!u) c.set(5, 4, EB);
      c.col(5, 8, b, BR); // the pipe going down into the house
      c.col(6, 10, b, D(BR));
      c.set(4, 14, BR);
      c.set(7, 14, D(BR));
      if (u) {
        c.line(7, 7, 9, 12, C.iron); // plug hanging on its chain
        c.rect(8, 13, 9, 14, C.bone);
        dots(c, C.ghost, [1, 3, 0, 5, 9, 2]);
      } else c.line(7, 6, 8, 8, C.iron), c.set(7, 9, C.iron);
    },
    sw: 9, sh: 22,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 2, 9, WAL);
      c.col(1, 1, 9, L(WAL));
      c.rect(3, 3, 4, 6, BR);
      c.poly([[5, 3], [6, 2], [6, 7], [5, 6]], BR); // the mouthpiece, flaring
      c.col(3, 7, b, BR);
      c.set(4, 14, D(BR));
      if (!u) c.col(7, 3, 6, C.bone);
      else {
        c.line(5, 7, 6, 12, C.iron);
        c.rect(6, 13, 7, 14, C.bone);
        dots(c, C.ghost, [8, 3, 9, 5, 8, 6]);
      }
    },
    su: [0, 0, 2],
  });
};
