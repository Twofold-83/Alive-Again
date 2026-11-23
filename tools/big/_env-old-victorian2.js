/* Victorian, second part: cabinets, the nursery corner, the fire, trophies and toys of science. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, tleg, cabSide, hollow, pane, flame, fire, wisp, bottle, cloth, shards, doorOut, opened } = H;
  const add = H.reg('env-victorian', 'Victorian');
  const MAH = hex('#5e2f24'),
    WAL = hex('#59402e'),
    EB = hex('#2b242a'),
    VELVET = hex('#5a2436'),
    GILT = C.gold,
    BR = C.brass,
    MARB = hex('#b4aea0'),
    CHINA = hex('#d6d2c4'),
    LACE = C.white,
    ROSE = hex('#8a5560'),
    SILK = hex('#4d6a66'),
    GLOW = C.glow,
    MIRROR = hex('#6f8d95');

  add('drinks-cabinet-mahogany', 'drinks cabinet mahogany bottles decanter spirits liquor cupboard glass doors', {
    w: 22, h: 34, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 3, 19, b - 1, MAH);
      c.row(2, 1, 20, L(MAH));
      c.rect(1, b - 1, 20, b, D(MAH));
      c.row(b - 1, 1, 20, MAH);
      const shelf = (y) => c.row(y, 4, 17, L(MAH));
      hollow(c, 4, 5, 17, 16, MAH);
      shelf(10);
      shelf(16);
      const bs = [[5, 9, 5, hex('#7a5a2a')], [8, 9, 4, C.forest], [11, 9, 5, C.wine], [15, 9, 4, hex('#8a8f8a')], [5, 15, 4, C.forest], [9, 15, 5, hex('#7a5a2a')], [13, 15, 4, C.wine], [16, 15, 5, hex('#7a5a2a')]];
      bs.forEach(([x, y, h, col], i) => {
        if (!(u && (i === 2 || i === 5))) bottle(c, x, y, h, col, 2);
      });
      if (!u) {
        for (const x0 of [4, 11]) {
          c.frame(x0, 5, x0 + 6, 16, MAH); // the glass doors
          c.line(x0 + 1, 9, x0 + 3, 6, C.glassLight);
          c.line(x0 + 3, 14, x0 + 5, 11, MIRROR);
          c.set(x0 + 1, 13, MIRROR);
        }
        c.set(10, 11, BR);
        c.set(11, 11, BR);
      } else {
        c.col(3, 5, 16, L(MAH)); // the doors stand open
        c.col(18, 5, 16, L(MAH));
        c.rect(11, 14, 12, 15, C.glassLight); // a glass poured
        c.row(15, 11, 12, C.wine);
        c.set(13, 15, C.wine);
      }
      drawer(c, 4, 18, 10, 20, MAH);
      drawer(c, 11, 18, 17, 20, MAH);
      panel(c, 4, 22, 10, b - 3, MAH);
      panel(c, 11, 22, 17, b - 3, MAH);
      c.set(9, 26, BR);
      c.set(12, 26, BR);
    },
    sw: 11, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, 3, 8, b - 1, MAH);
      c.row(17, 3, 7, D(MAH));
      c.row(2, 1, 9, L(MAH));
      c.rect(1, b - 1, 9, b, D(MAH));
      if (u) {
        doorOut(c, 9, 5, 16, 7, MAH, MIRROR);
        c.set(9, 13, C.wine);
      }
    },
    su: [0, 0, 7],
  });
  add('curiosity-cabinet', 'cabinet of curiosities specimens skull jars shells fossils collection glass case', {
    w: 24, h: 42, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, 4, 21, b - 1, EB);
      c.rect(1, 2, 22, 3, EB);
      c.row(2, 1, 22, hex('#4a3e44'));
      c.row(3, 2, 21, GILT);
      c.rect(1, b - 1, 22, b, D(EB));
      hollow(c, 4, 6, 19, 29, hex('#6a5a48'));
      for (const y of [11, 17, 23, 29]) c.row(y, 4, 19, hex('#4a3e44'));
      const jar = (x, y, col) => {
        c.rect(x, y - 3, x + 2, y, hex('#7f9a8a'));
        c.rect(x, y - 2, x + 2, y, col);
        c.row(y - 4, x, x + 2, C.parchment);
      };
      c.rect(5, 8, 8, 10, C.bone); // a skull
      c.rect(5, 7, 7, 7, C.bone);
      c.set(6, 9, K);
      c.set(8, 9, K);
      jar(11, 10, C.rot);
      if (!u) jar(15, 10, hex('#8a6a5a'));
      c.rect(5, 15, 7, 16, hex('#b79a8a')); // shells
      c.set(6, 14, hex('#b79a8a'));
      c.set(9, 16, C.paper);
      c.rect(12, 14, 18, 14, hex('#4f5a3a')); // a small crocodile
      c.rect(13, 15, 17, 16, hex('#4f5a3a'));
      c.set(19, 15, hex('#4f5a3a'));
      c.set(14, 15, C.bone);
      c.set(16, 15, C.bone);
      for (const [x, col] of [[5, C.mustard], [9, hex('#5a7a9a')], [13, C.rust], [17, C.white]]) {
        c.set(x, 20, col); // butterflies on pins
        c.set(x + 2, 20, col);
        c.set(x, 22, col);
        c.set(x + 2, 22, col);
        c.col(x + 1, 20, 22, K);
      }
      c.oval(5, 25, 9, 28, C.stone); // an ammonite
      c.set(7, 26, C.stoneDark);
      c.set(7, 27, C.stoneLight);
      jar(12, 28, hex('#9a8a4a'));
      c.rect(16, 26, 18, 28, C.bone); // a hand of bones
      c.col(17, 26, 28, hex('#6a5a48'));
      if (!u) {
        for (const x0 of [4, 12]) {
          c.frame(x0, 6, x0 + 7, 29, EB);
          c.line(x0 + 1, 10, x0 + 4, 7, C.glassLight);
          c.line(x0 + 3, 21, x0 + 6, 18, MIRROR);
          c.line(x0 + 1, 27, x0 + 2, 26, MIRROR);
        }
        c.set(11, 18, GILT);
        c.set(12, 18, GILT);
      } else {
        c.col(3, 6, 29, hex('#4a3e44'));
        c.col(20, 6, 29, hex('#4a3e44'));
        c.rect(15, 9, 17, 10, hex('#7f9a8a')); // a jar knocked over, what was in it gone
        c.set(18, 10, C.parchment);
        c.set(14, 10, hex('#8a6a5a'));
        c.col(14, 12, 13, hex('#8a6a5a')); // and dripping down the shelves
        c.set(14, 18, hex('#8a6a5a'));
        c.set(14, 24, hex('#8a6a5a'));
      }
      drawer(c, 4, 31, 11, 34, EB, GILT);
      drawer(c, 12, 31, 19, 34, EB, GILT);
      drawer(c, 4, 35, 19, b - 2, EB, GILT);
      c.row(31, 4, 19, hex('#4a3e44'));
    },
    sw: 12, sh: 42,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 4, 9, b - 1, EB);
      c.rect(1, 2, 10, 3, EB);
      c.row(2, 1, 10, hex('#4a3e44'));
      c.row(3, 2, 9, GILT);
      c.rect(1, b - 1, 10, b, D(EB));
      pane(c, 4, 6, 7, 29, blend(MIRROR, EB, 0.45));
      for (const y of [11, 17, 23]) c.row(y, 4, 7, hex('#4a3e44'));
      dots(c, C.bone, [5, 9, 6, 10, 5, 27]);
      dots(c, C.rot, [6, 15, 5, 21]);
      panel(c, 4, 32, 7, b - 3, EB);
      if (u) {
        face(c, 10, 6, 17, 29, EB);
        pane(c, 11, 7, 16, 28, blend(MIRROR, EB, 0.3));
        c.set(16, 18, GILT);
        c.set(9, 13, hex('#8a6a5a'));
        c.set(9, 19, hex('#8a6a5a'));
      }
    },
    su: [0, 0, 8],
  });

  /* ---------- nursery and dressing ---------- */
  add('canopy-cot-lace', 'canopy cot lace bassinet baby crib cradle drapes nursery', {
    w: 26, h: 38, solid: true, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        wick = hex('#a08a5c');
      c.col(3, 3, b - 4, BR); // the pole at the head
      c.line(3, 3, 8, 2, BR);
      c.set(9, 3, GILT);
      c.rect(3, 22, 23, 28, wick); // wicker basket
      c.row(22, 3, 23, L(wick));
      for (let x = 4; x < 23; x += 2) for (let y = 24; y < 28; y += 2) c.set(x + (y % 4 ? 0 : 1), y, D(wick));
      c.row(28, 4, 22, D(wick));
      c.line(5, 29, 3, b - 1, MAH); // crossed legs
      c.line(21, 29, 23, b - 1, MAH);
      c.line(6, 29, 20, b - 2, D(MAH));
      c.line(20, 29, 6, b - 2, D(MAH));
      c.set(3, b, EB);
      c.set(23, b, EB);
      c.rect(u ? 15 : 9, 20, 22, 21, ROSE); // blanket
      c.row(20, u ? 15 : 9, 22, L(ROSE));
      c.rect(5, 20, 8, 21, LACE); // pillow
      if (!u) {
        cloth(c, [[9, 3], [14, 8], [17, 21], [16, 27], [2, 27], [2, 6]], LACE, [[8, 6, 11, 26], [5, 6, 5, 26], [11, 7, 15, 24]]);
        dots(c, D(LACE), [3, 27, 6, 27, 9, 27, 13, 27, 3, 12, 7, 16, 13, 18]);
        c.set(9, 3, GILT);
      } else {
        cloth(c, [[9, 3], [10, 7], [6, 18], [7, 27], [2, 27], [2, 6]], LACE, [[5, 6, 4, 26]]); // drapes pulled aside
        dots(c, D(LACE), [3, 27, 6, 27, 3, 12]);
        c.rect(9, 20, 14, 21, C.cream); // the empty sheet
        c.set(11, 21, D(C.cream));
        c.poly([[17, 21], [23, 21], [24, 31], [19, 30]], ROSE); // blanket hanging over the side
        c.line(20, 22, 21, 30, D(ROSE));
        c.set(9, 3, GILT);
      }
    },
    sw: 18, sh: 38,
    s(c, u) {
      const b = c.h - 2,
        wick = hex('#a08a5c');
      c.col(8, 2, 6, BR);
      c.set(8, 1, GILT);
      c.rect(3, 22, 14, 28, wick);
      c.row(22, 3, 14, L(wick));
      for (let x = 4; x < 14; x += 2) for (let y = 24; y < 28; y += 2) c.set(x + (y % 4 ? 0 : 1), y, D(wick));
      c.row(28, 4, 13, D(wick));
      c.line(4, 29, 3, b, MAH);
      c.line(13, 29, 14, b, MAH);
      c.row(b - 3, 4, 13, D(MAH));
      if (!u) {
        cloth(c, [[8, 2], [14, 8], [16, 27], [1, 27], [3, 8]], LACE, [[8, 4, 8, 26], [5, 8, 4, 26], [12, 8, 13, 26]]);
        dots(c, D(LACE), [2, 27, 5, 27, 8, 27, 11, 27, 14, 27, 6, 14, 10, 18]);
      } else {
        cloth(c, [[8, 2], [5, 9], [4, 20], [5, 27], [1, 27], [3, 8]], LACE, [[4, 8, 3, 26]]);
        cloth(c, [[8, 2], [12, 9], [13, 20], [12, 27], [16, 27], [14, 8]], LACE, [[13, 8, 14, 26]]);
        c.rect(6, 12, 11, 21, hex('#8f8672'));
        c.rect(6, 19, 11, 21, C.cream);
        c.rect(7, 18, 10, 19, LACE);
        c.poly([[8, 22], [14, 22], [15, 30], [10, 29]], ROSE);
        c.line(11, 23, 12, 29, D(ROSE));
      }
    },
  });
  add('washstand-jug-bowl', 'washstand marble top jug bowl ewer basin tiles towel wash bedroom', {
    w: 22, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2,
        tile = hex('#5a8088');
      face(c, 2, 5, 17, 12, MAH); // tiled splashback
      for (let x = 3; x < 17; x += 4) for (let y = 6; y < 12; y += 3) {
        c.rect(x, y, x + 2, y + 1, (x + y) % 2 ? tile : CHINA);
      }
      board(c, 1, 13, 18, 14, MARB);
      face(c, 2, 15, 17, b - 3, MAH);
      drawer(c, 4, 16, 15, 18, MAH);
      panel(c, 4, 20, 9, b - 4, MAH);
      panel(c, 10, 20, 15, b - 4, MAH);
      legs(c, [2, 16], b - 2, b, MAH);
      c.col(19, 9, 14, BR); // towel rail at the side
      c.row(9, 18, 20, BR);
      const tw = u ? hex('#b9a9a0') : LACE;
      c.rect(19, 10, 20, u ? 17 : 20, tw);
      c.col(20, 10, u ? 17 : 20, D(tw));
      c.rect(4, 11, 13, 12, CHINA); // the bowl
      c.row(10, 3, 14, L(CHINA));
      c.row(11, 4, 13, hex('#5a6f9a'));
      if (!u) {
        c.rect(7, 5, 10, 9, CHINA); // the jug standing in it
        c.rect(8, 3, 9, 4, CHINA);
        c.set(7, 3, CHINA);
        c.row(7, 7, 10, hex('#5a6f9a'));
        c.set(11, 5, D(CHINA));
        c.set(12, 6, D(CHINA));
        c.set(11, 7, D(CHINA));
        c.col(7, 5, 9, L(CHINA));
      } else {
        c.row(10, 4, 13, hex('#8f6a6a')); // pink water
        c.set(6, 10, hex('#b08a8a'));
        c.rect(15, 8, 17, 12, CHINA); // jug set down beside it
        c.rect(16, 6, 16, 7, CHINA);
        c.set(15, 6, CHINA);
        c.row(10, 15, 17, hex('#5a6f9a'));
        dots(c, C.blood, [19, 13, 20, 15, 19, 16]);
        c.set(20, 18, C.blood);
        dots(c, hex('#8f6a6a'), [10, 13, 11, 15]);
      }
    },
    sw: 12, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 5, 3, 12, MAH);
      c.col(2, 5, 12, L(MAH));
      board(c, 1, 13, 10, 14, MARB);
      cabSide(c, 2, 15, 9, b - 3, MAH);
      legs(c, [2, 8], b - 2, b, MAH);
      c.rect(4, 11, 8, 12, CHINA);
      c.row(10, 4, 9, L(CHINA));
      c.row(11, 5, 8, hex('#5a6f9a'));
      if (!u) {
        c.rect(5, 5, 7, 9, CHINA);
        c.rect(6, 3, 6, 4, CHINA);
        c.row(7, 5, 7, hex('#5a6f9a'));
        c.col(5, 5, 9, L(CHINA));
      } else {
        c.row(10, 5, 8, hex('#8f6a6a'));
        dots(c, hex('#8f6a6a'), [9, 13, 10, 16]);
        c.set(10, 19, hex('#8f6a6a'));
      }
    },
  });
  add('dressing-screen-gown', 'dressing screen silk embroidered three panel nightgown clothes changing', {
    w: 30, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (let i = 0; i < 3; i++) {
        const x = 2 + i * 9,
          y = i === 1 ? 2 : 3;
        c.rect(x, y, x + 8, b, EB);
        c.col(x, y, b, hex('#4a3e44'));
        c.rect(x + 1, y + 1, x + 7, b - 3, SILK);
        c.col(x + 1, y + 1, b - 3, L(SILK));
        c.rect(x + 1, b - 9, x + 7, b - 9, EB);
        c.line(x + 2, 22, x + 6, 10, hex('#3a4f3a')); // a spray of leaves and a bird
        c.set(x + 5, 12, C.mustard);
        c.set(x + 3, 18, ROSE);
        c.set(x + 6, 15, ROSE);
        c.set(x + 2, 14, hex('#3a4f3a'));
        c.set(x + 4, b - 6, GILT);
        c.clear(x, b);
        c.clear(x + 8, b);
        c.rect(x + 1, b, x + 7, b, null);
        for (let k = x + 2; k < x + 7; k++) c.clear(k, b);
      }
      if (!u) {
        cloth(c, [[11, 1], [20, 1], [22, 16], [18, 22], [13, 22], [10, 15]], LACE, [[13, 3, 12, 20], [18, 3, 19, 20], [15, 8, 15, 21]]); // a nightgown thrown over
        c.row(1, 12, 19, L(LACE));
        dots(c, D(LACE), [11, 16, 14, 22, 17, 22, 21, 15]);
        c.rect(23, 2, 25, 12, hex('#3d3028')); // a stocking
        c.set(24, 13, hex('#3d3028'));
      } else {
        c.line(13, 8, 17, 20, K); // the silk slashed
        c.line(14, 8, 18, 20, mix(SILK, 0.4));
        c.set(16, 13, C.bone);
        c.rect(22, b - 1, 26, b, LACE); // the gown in a heap on the floor
        c.rect(23, b - 2, 25, b - 2, LACE);
        c.set(24, b - 1, D(LACE));
        c.set(27, b, hex('#3d3028'));
      }
    },
    sw: 10, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 3, b, EB); // three leaves, edge on, standing in a zigzag
      c.col(2, 3, b, hex('#4a3e44'));
      c.line(4, 3, 6, 3, EB);
      c.poly([[4, 3], [7, 2], [7, b - 1], [4, b]], SILK);
      c.line(4, 3, 7, 2, EB);
      c.col(7, 2, b - 1, EB);
      c.col(4, 3, b, hex('#4a3e44'));
      c.line(4, b, 7, b - 1, EB);
      c.set(5, 14, ROSE);
      c.set(6, 20, hex('#3a4f3a'));
      if (!u) {
        cloth(c, [[3, 1], [8, 1], [8, 20], [5, 22], [2, 16]], LACE, [[5, 3, 5, 20]]);
        c.row(1, 3, 8, L(LACE));
      } else {
        c.line(5, 8, 6, 20, K);
        c.rect(5, b - 1, 8, b, LACE);
        c.set(6, b - 2, LACE);
      }
    },
  });
  add('work-table-sewing-bag', 'sewing table work table silk bag needlework threads scissors workbox', {
    w: 18, h: 21, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, u ? 8 : 7, 16, 8, WAL);
      face(c, 2, 9, 15, 12, WAL);
      drawer(c, 4, 10, 13, 12, WAL);
      c.poly([[5, 13], [12, 13], [11, 17], [6, 17]], VELVET); // the pleated bag
      c.col(7, 13, 17, D(VELVET));
      c.col(10, 13, 17, D(VELVET));
      c.set(8, 18, GILT);
      c.set(9, 18, GILT);
      for (const x of [2, 15]) tleg(c, x, 13, b, WAL);
      c.row(b - 2, 3, 14, D(WAL));
      if (u) {
        hollow(c, 2, 5, 15, 7, WAL); // lid up: little compartments
        c.rect(1, 1, 16, 4, WAL);
        c.row(1, 1, 16, L(WAL));
        c.rect(3, 2, 14, 3, VELVET);
        dots(c, C.red, [4, 6, 5, 6]);
        dots(c, C.mustard, [7, 6, 8, 6]);
        dots(c, hex('#5a7a9a'), [10, 6, 11, 6]);
        dots(c, C.white, [13, 6, 14, 7]);
        c.line(5, 7, 3, 12, C.red); // a thread trailing out
        c.line(3, 12, 1, 16, C.red);
        dots(c, C.steel, [12, 3, 13, 2, 11, 2]);
      } else {
        c.rect(6, 5, 8, 6, ROSE); // pincushion
        dots(c, C.steel, [6, 4, 8, 4]);
      }
    },
    sw: 13, sh: 21,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, u ? 8 : 7, 11, 8, WAL);
      face(c, 2, 9, 10, 12, WAL);
      c.poly([[4, 13], [8, 13], [8, 17], [4, 17]], VELVET);
      c.col(6, 13, 17, D(VELVET));
      c.set(6, 18, GILT);
      for (const x of [2, 10]) tleg(c, x, 13, b, WAL);
      c.row(b - 2, 3, 9, D(WAL));
      if (u) {
        c.rect(2, 1, 3, 7, WAL); // the lid, edge on
        c.col(2, 1, 7, L(WAL));
        c.col(4, 2, 6, VELVET);
        dots(c, C.red, [7, 7, 9, 7]);
        c.line(10, 8, 11, 14, C.red);
      } else {
        c.rect(5, 5, 7, 6, ROSE);
        c.set(6, 4, C.steel);
      }
    },
  });

  /* ---------- bells ---------- */
  add('bell-pull-tapestry', 'bell pull tapestry sash servants bell rope tassel wall', {
    w: 9, h: 34,
    f(c, u) {
      const b = c.h - 2,
        o = u ? 4 : 0;
      c.oval(2, 1, 6, 5, BR);
      c.set(4, 3, GILT);
      c.set(3, 2, L(BR));
      if (u) c.col(4, 5, 8, C.iron); // the wire drawn out of the wall
      for (let y = 5 + o; y <= b - 9 + o; y++) {
        c.row(y, 3, 5, VELVET);
        c.set(3, y, L(VELVET));
        if ((y - o) % 4 === 1) c.set(4, y, GILT);
        if ((y - o) % 4 === 3) c.set(4, y, hex('#3a4f3a'));
      }
      c.rect(2, b - 8 + o, 6, b - 7 + o, GILT);
      for (let x = 2; x <= 6; x++) c.col(x, b - 6 + o, b - 4 + o - (x % 2), x % 2 ? C.mustard : GILT);
    },
    u: [0, 0, 0],
    sw: 6, sh: 34,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 1, 2, 5, BR);
      c.col(1, 1, 5, L(BR));
      c.set(3, 3, GILT);
      if (!u) {
        c.col(3, 5, b - 9, VELVET);
        c.rect(3, b - 8, 3, b - 7, GILT);
        c.col(3, b - 6, b - 4, C.mustard);
        c.set(4, b - 6, GILT);
      } else {
        c.line(3, 5, 7, b - 5, VELVET); // drawn out into the room
        c.set(7, b - 4, GILT);
        c.col(7, b - 3, b - 1, C.mustard);
        c.set(8, b - 3, GILT);
        c.set(3, 4, C.iron);
      }
    },
    su: [0, 0, 4],
  });
  const bell = (c, x, y, tilt) => {
    c.set(x, y, C.iron); // spring
    c.set(x + (tilt ? 1 : 0), y + 1, C.iron);
    const bx = x + (tilt ? 1 : 0);
    c.rect(bx - 1, y + 2, bx + 1, y + 4, BR);
    c.set(bx - 1, y + 2, L(BR));
    c.row(y + 5, bx - 2 + (tilt ? 1 : 0), bx + 2 + (tilt ? 1 : 0), D(BR));
    c.set(bx + (tilt ? 2 : 0), y + 6, C.ironDark);
  };
  add('servant-bell-board', 'servants bell board bells springs call board kitchen downstairs', {
    w: 30, h: 17,
    f(c, u) {
      face(c, 1, 1, 28, 14, WAL);
      c.rect(1, 1, 28, 2, D(WAL));
      c.row(1, 1, 28, WAL);
      for (let i = 0; i < 5; i++) {
        const x = 4 + i * 5;
        bell(c, x, 3, u && i === 3);
        c.rect(x - 1, 11, x + 1, 12, C.paper); // the room's name
        c.set(x, 12, C.slate);
      }
      if (u) {
        dots(c, C.white, [17, 6, 23, 5, 23, 8]); // one is ringing
        c.rect(18, 11, 20, 12, C.red);
      }
    },
    sw: 7, sh: 17,
    s(c, u) {
      c.rect(1, 1, 2, 14, WAL);
      c.col(1, 1, 14, L(WAL));
      c.set(3, 3, C.iron);
      c.rect(3, 5, 4, 7, BR);
      c.row(8, 3, 5, D(BR));
      c.set(3, 11, C.paper);
      if (u) {
        c.clearRect(3, 5, 5, 8);
        c.rect(4, 5, 5, 7, BR);
        c.row(8, 4, 6, D(BR));
        c.set(3, 4, C.iron);
        c.set(6, 4, C.white);
        c.set(3, 11, C.red);
      }
    },
    su: [0, 0, 1],
  });

  /* ---------- the fire ---------- */
  add('fireplace-coal-fender', 'coal fire fireplace marble mantelpiece cast iron grate brass fender hearth', {
    w: 34, h: 31, solid: true,
    f(c, u) {
      const b = c.h - 2,
        ir = C.ironDark;
      board(c, 1, 2, 32, 4, MARB); // mantel shelf
      c.rect(2, 5, 31, b, MARB);
      c.col(2, 5, b, L(MARB));
      c.rect(8, 8, 25, b, ir); // the iron insert
      c.row(7, 3, 30, D(MARB));
      dots(c, D(MARB), [4, 10, 5, 12, 4, 20, 6, 24, 28, 9, 29, 14, 27, 22, 29, 27]); // veins
      c.line(3, 15, 6, 18, D(MARB));
      c.line(27, 16, 30, 19, D(MARB));
      for (let y = 9; y < b - 4; y += 3) {
        c.rect(9, y, 10, y + 1, hex('#3f6a6a')); // tiles down the cheeks
        c.rect(23, y, 24, y + 1, hex('#3f6a6a'));
        c.set(9, y, hex('#7a9a8a'));
        c.set(23, y, hex('#7a9a8a'));
      }
      c.rect(12, 12, 21, b - 3, C.night); // the opening, arched
      c.rect(13, 10, 20, 11, C.night);
      c.row(9, 14, 19, C.iron);
      c.rect(12, b - 9, 21, b - 8, C.iron); // grate bars
      for (let x = 12; x <= 21; x += 2) c.col(x, b - 8, b - 4, C.iron);
      c.rect(13, b - 11, 20, b - 10, C.black); // coals
      dots(c, C.slate, [14, b - 11, 17, b - 10, 19, b - 11]);
      if (u) {
        fire(c, 13, 20, b - 10, 8, 5);
        dots(c, C.red, [13, b - 9, 15, b - 7, 17, b - 9, 19, b - 7, 20, b - 9, 14, b - 5, 18, b - 5]);
        c.row(b - 3, 11, 22, hex('#6a3a2a'));
        dots(c, hex('#6a3a2a'), [11, 14, 22, 15, 11, 19, 22, 20]);
      } else dots(c, C.ash, [14, b - 5, 16, b - 4, 19, b - 5, 17, b - 6]);
      c.rect(5, b - 3, 28, b - 3, BR); // fender
      c.rect(5, b, 28, b, D(BR));
      for (let x = 5; x <= 28; x++) if (x % 2) c.col(x, b - 2, b - 1, BR);
      c.rect(4, b - 4, 5, b, BR);
      c.rect(28, b - 4, 29, b, BR);
      c.set(4, b - 5, GILT);
      c.set(29, b - 5, GILT);
    },
    sw: 13, sh: 31,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 2, 9, 4, MARB);
      c.rect(2, 5, 7, b, MARB);
      c.col(2, 5, b, L(MARB));
      c.row(7, 2, 7, D(MARB));
      c.line(3, 14, 6, 18, D(MARB));
      dots(c, D(MARB), [4, 10, 5, 24, 3, 27]);
      c.col(7, 8, b, D(MARB));
      c.rect(8, b - 3, 11, b - 3, BR); // the fender comes out into the room
      c.rect(8, b, 11, b, D(BR));
      c.col(9, b - 2, b - 1, BR);
      c.rect(11, b - 4, 11, b, BR);
      c.set(11, b - 5, GILT);
      if (u) {
        dots(c, C.flame, [8, b - 9, 8, b - 12, 9, b - 5]);
        dots(c, C.flameLight, [8, b - 10, 8, b - 7]);
        c.col(7, b - 14, b - 4, hex('#a37a5a'));
        wisp(c, 8, b - 14, 3, C.red);
      }
    },
  });
  add('fire-screen-needlework', 'fire screen needlework tapestry roses embroidered panel hearth', {
    w: 18, h: 25, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 2, 15, 17, WAL);
      c.row(2, 2, 15, L(WAL));
      c.col(2, 2, 17, L(WAL));
      c.rect(7, 1, 10, 1, WAL);
      c.rect(4, 4, 13, 15, hex('#2f3a34'));
      for (const [x, y] of [[6, 7], [10, 6], [8, 11], [11, 12], [5, 12]]) {
        c.rect(x, y, x + 1, y + 1, ROSE); // roses
        c.set(x, y, hex('#b07a80'));
        c.set(x + 2, y + 2, hex('#4a6a3c'));
      }
      c.col(4, 18, b - 1, WAL);
      c.col(13, 18, b - 1, WAL);
      c.row(b, 2, 6, D(WAL));
      c.row(b, 11, 15, D(WAL));
      c.row(19, 5, 12, D(WAL));
      if (u) {
        c.oval(6, 8, 12, 15, C.night); // a hole burnt through
        c.oval(7, 9, 11, 14, null);
        for (let y = 9; y <= 14; y++) for (let x = 7; x <= 11; x++) if (((x - 9) / 2.6) ** 2 + ((y - 11.5) / 3.1) ** 2 <= 1) c.clear(x, y);
        dots(c, C.rust, [6, 9, 12, 10, 5, 13, 12, 14]);
        dots(c, C.black, [8, 6, 5, 10, 13, 12, 10, 16, 7, 16]);
        dots(c, C.ash, [8, b, 9, b - 1, 10, b]);
      }
    },
    sw: 9, sh: 25,
    s(c, u) {
      const b = c.h - 2;
      c.rect(4, 1, 5, b - 1, WAL);
      c.col(4, 1, b - 1, L(WAL));
      c.row(b, 1, 8, D(WAL));
      c.set(2, b - 1, WAL);
      c.set(7, b - 1, WAL);
      c.set(3, b - 2, WAL);
      c.set(6, b - 2, WAL);
      if (u) {
        c.clearRect(4, 9, 5, 14);
        c.set(4, 8, C.black);
        c.set(5, 15, C.black);
        dots(c, C.ash, [6, b - 1, 7, b - 2]);
      }
    },
  });

  /* ---------- trophies ---------- */
  add('stag-head-mounted', 'stag head mounted trophy antlers deer taxidermy wall hunting', {
    w: 24, h: 26,
    f(c, u) {
      const fur = hex('#6e5038'),
        ant = hex('#b5a98a');
      c.poly([[8, 13], [15, 13], [16, 20], [12, 24], [11, 24], [7, 20]], WAL); // the shield
      c.line(8, 13, 7, 20, L(WAL));
      for (const s of [1, -1]) {
        const m = s > 0 ? 9 : 14;
        c.line(m, 9, m - s * 4, 5, ant); // antlers
        c.line(m - s * 4, 5, m - s * 6, 1, ant);
        c.line(m - s * 3, 6, m - s * 2, 2, ant);
        c.line(m - s * 5, 4, m - s * 8, 4, ant);
        c.set(m - s * 8, 3, ant);
        c.line(m - s * 2, 8, m - s * 6, 9, ant);
      }
      c.rect(9, 9, 14, 16, fur); // head, looking at us
      c.rect(10, 16, 13, 20, fur);
      c.col(9, 9, 16, L(fur));
      c.rect(10, 18, 13, 20, D(fur));
      c.rect(11, 20, 12, 21, C.black); // nose
      c.set(6, 10, fur); // ears
      c.rect(7, 10, 8, 11, fur);
      c.rect(15, 10, 16, 11, fur);
      c.set(17, 10, D(fur));
      c.set(10, 12, u ? C.red : K);
      c.set(13, 12, u ? C.red : K);
      if (u) {
        c.set(10, 11, hex('#e07060')); // the eyes are alight, the nose bleeds
        c.set(13, 11, hex('#e07060'));
        c.col(11, 22, 24, C.blood);
        c.set(12, 22, C.blood);
      } else c.set(10, 11, C.white);
    },
    sw: 16, sh: 26,
    s(c, u) {
      const fur = hex('#6e5038'),
        ant = hex('#b5a98a');
      c.rect(1, 12, 2, 24, WAL);
      c.col(1, 12, 24, L(WAL));
      c.poly([[3, 12], [9, 9], [12, 11], [12, 16], [7, 22], [3, 22]], fur); // neck and head
      c.poly([[9, 13], [14, 15], [14, 18], [10, 18]], fur); // muzzle
      c.rect(13, 15, 14, 16, C.black);
      c.line(3, 13, 8, 10, L(fur));
      c.line(4, 21, 9, 18, D(fur));
      c.set(7, 9, fur); // ear
      c.set(6, 8, fur);
      c.line(9, 9, 8, 4, ant);
      c.line(8, 4, 11, 1, ant);
      c.line(8, 5, 5, 2, ant);
      c.line(9, 7, 12, 6, ant);
      c.set(13, 5, ant);
      c.set(10, 12, u ? C.red : K);
      if (u) {
        c.set(11, 12, hex('#e07060'));
        c.col(14, 17, 21, C.blood);
        c.set(14, 23, C.blood);
      }
    },
  });
  add('owl-stuffed-perch', 'stuffed owl taxidermy bird perch glass eyes ornament', {
    w: 14, h: 22,
    f(c, u) {
      const b = c.h - 2,
        f1 = hex('#7a6248'),
        f2 = hex('#a08a64');
      c.rect(3, b - 1, 10, b, EB);
      c.row(b - 1, 3, 10, hex('#4a3e44'));
      c.col(6, 14, b - 2, WAL);
      c.col(7, 14, b - 2, D(WAL));
      c.row(14, 2, 11, WAL);
      c.oval(3, 3, 10, 14, f1);
      c.rect(4, 2, 9, 6, f1);
      c.set(3, 1, f1); // ear tufts
      c.set(10, 1, f1);
      c.set(4, 2, f1);
      if (!u) {
        c.oval(5, 8, 8, 13, f2); // breast
        dots(c, f1, [6, 9, 7, 11, 6, 12]);
        c.rect(4, 3, 6, 5, f2); // face discs
        c.rect(7, 3, 9, 5, f2);
        c.set(5, 4, C.mustard);
        c.set(8, 4, C.mustard);
        c.set(6, 6, C.black);
        c.set(7, 6, C.black);
      } else {
        dots(c, D(f1), [5, 4, 8, 4, 6, 7, 7, 9, 5, 10, 8, 11, 6, 12, 5, 6, 8, 7]); // it has turned its head right round
        c.col(6, 3, 5, D(f1));
        dots(c, f2, [1, b, 12, b - 1]);
      }
      dots(c, C.mustard, [5, 14, 8, 14]);
    },
    sw: 14, sh: 22,
    s(c, u) {
      const b = c.h - 2,
        f1 = hex('#7a6248'),
        f2 = hex('#a08a64'),
        fl = u ? -1 : 1,
        X = (x) => (u ? 13 - x : x);
      c.rect(3, b - 1, 10, b, EB);
      c.row(b - 1, 3, 10, hex('#4a3e44'));
      c.col(6, 14, b - 2, WAL);
      c.col(7, 14, b - 2, D(WAL));
      c.oval(3, 5, 9, 14, f1); // body, facing right
      c.line(3, 9, 2, 16, f1); // tail
      c.line(4, 9, 3, 15, D(f1));
      c.rect(8, 8, 9, 12, f2);
      c.rect(5, 14, 8, 14, WAL);
      c.set(8, 14, C.mustard);
      for (let y = 2; y <= 6; y++) for (let x = 5; x <= 9; x++) c.set(X(x) - (u ? 1 : 0), y, f1); // the head, which way it looks
      c.set(X(5) - (u ? 1 : 0), 1, f1);
      c.rect(u ? 4 : 8, 3, u ? 5 : 9, 5, f2);
      c.set(u ? 4 : 9, 4, C.mustard);
      c.set(u ? 3 : 10, 5, C.black);
      void fl;
      if (u) dots(c, f2, [11, b, 1, b - 1]);
    },
  });

  /* ---------- toys of science ---------- */
  add('magic-lantern-brass', 'magic lantern projector slides brass lens tin lamp picture show', {
    w: 20, h: 20, base: 'side',
    f(c, u) {
      const b = c.h - 2,
        tin = hex('#2f2c34');
      board(c, 1, b - 1, 14, b, WAL);
      face(c, 2, 8, 10, b - 2, tin);
      c.rect(4, 4, 7, 7, tin); // chimney with its cowl
      c.rect(3, 2, 8, 3, tin);
      c.row(2, 3, 8, hex('#4a4650'));
      c.set(9, 4, tin);
      dots(c, u ? C.flame : K, [4, 10, 6, 10, 8, 10]); // vents
      c.rect(11, 9, 12, b - 3, WAL); // slide carrier
      c.rect(11, 8, 12, 8, C.glassLight);
      c.rect(13, 10, 17, b - 4, BR); // the lens tube
      c.row(10, 13, 17, L(BR));
      c.col(15, 10, b - 4, D(BR));
      c.col(18, 9, b - 3, GILT);
      if (u) {
        c.col(18, 10, b - 4, C.white);
        for (let x = 19; x <= 27; x++) {
          const sp = Math.round((x - 18) * 0.7);
          for (let y = 12 - sp; y <= 12 + sp; y++) if ((x + y) % 2 === 0) c.set(x, y, GLOW); // the beam
        }
        wisp(c, 6, 0, 2, C.ash);
        c.set(4, 9, C.flameLight);
      }
    },
    u: [0, 2, 9],
    o: { },
    sw: 14, sh: 20,
    s(c, u) {
      const b = c.h - 2,
        tin = hex('#2f2c34');
      board(c, 1, b - 1, 12, b, WAL);
      face(c, 2, 8, 11, b - 2, tin);
      c.rect(5, 4, 8, 7, tin);
      c.rect(4, 2, 9, 3, tin);
      c.row(2, 4, 9, hex('#4a4650'));
      c.oval(4, 9, 9, 15, BR); // the lens, looking at us
      c.oval(5, 10, 8, 14, u ? C.white : hex('#3f5258'));
      if (u) {
        c.set(6, 11, GLOW);
        c.set(7, 13, GLOW);
        dots(c, GLOW, [3, 8, 10, 8, 3, 16, 10, 16, 2, 12, 11, 12]);
        wisp(c, 7, 0, 2, C.ash);
      } else c.set(6, 11, C.glassLight);
    },
    su: [0, 2, 0],
  });
  add('zoetrope-drum', 'zoetrope drum wheel of life moving pictures toy slits spinning', {
    w: 16, h: 18,
    f(c, u) {
      const b = c.h - 2,
        tin = hex('#2f2c34');
      c.rect(5, b, 10, b, D(WAL));
      c.rect(6, b - 1, 9, b - 1, WAL);
      c.col(7, b - 5, b - 2, WAL);
      c.col(8, b - 5, b - 2, D(WAL));
      c.set(6, b - 4, WAL);
      c.rect(1, 2, 14, b - 6, tin); // the drum
      c.row(2, 1, 14, hex('#4a4650'));
      c.row(1, 2, 13, hex('#4a4650'));
      c.rect(1, b - 9, 14, b - 7, C.paper); // the strip of pictures
      if (!u) {
        for (let x = 2; x <= 13; x += 2) c.col(x, 3, 6, K); // slits
        for (let x = 2; x <= 13; x += 3) {
          c.set(x, b - 8, K); // a running man, step by step
          c.set(x + (x % 2), b - 9, K);
        }
      } else {
        c.rect(1, 3, 14, 6, hex('#4a4650')); // spinning: all a blur
        c.dither(1, 3, 14, 6, tin);
        c.row(b - 8, 1, 14, C.slate);
        dots(c, C.white, [0, 4, 15, 5, 0, b - 8, 15, b - 9]);
        c.row(1, 2, 13, C.ash);
      }
    },
  });

  /* ---------- small furniture ---------- */
  add('whatnot-shelf-ornaments', 'whatnot etagere shelf stand ornaments china dog vase tiers knick knacks', {
    w: 18, h: 38, solid: true,
    f(c, u) {
      const b = c.h - 2;
      for (const x of [2, 15]) {
        c.col(x, 3, b, WAL);
        c.set(x, 2, L(WAL));
        for (let y = 6; y < b; y += 8) c.set(x, y, L(WAL));
      }
      for (const y of [8, 16, 24, 32]) board(c, 1, y, 16, y + 1, WAL);
      c.rect(4, 4, 6, 7, hex('#4f6a8a')); // a vase
      c.set(5, 3, hex('#4f6a8a'));
      c.set(5, 2, ROSE);
      c.rect(10, 5, 13, 7, C.wood); // a frame
      c.rect(11, 6, 12, 6, C.bone);
      if (!u) {
        c.rect(5, 12, 8, 15, CHINA); // a china dog
        c.rect(4, 11, 6, 12, CHINA);
        c.set(4, 11, K);
        c.set(8, 14, C.rust);
      }
      c.rect(11, 13, 13, 15, C.brass); // a little clock
      c.set(12, 14, C.white);
      c.rect(4, 21, 9, 23, C.navy); // books lying
      c.row(22, 4, 9, C.paper);
      c.rect(5, 19, 9, 20, C.wine);
      c.oval(11, 20, 14, 23, hex('#b79a8a')); // a shell
      c.rect(4, 28, 7, 31, hex('#7f9a8a')); // a jar
      c.row(27, 4, 7, C.parchment);
      c.rect(10, 29, 13, 31, hex('#3d3028'));
      if (u) {
        dots(c, CHINA, [3, b, 5, b - 1, 7, b, 8, b - 1, 10, b, 6, b]); // the dog in pieces on the floor
        c.rect(5, b - 1, 6, b, CHINA);
        c.set(5, b - 1, K);
        c.set(9, b, C.rust);
      }
    },
    sw: 10, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      for (const x of [2, 7]) {
        c.col(x, 3, b, WAL);
        c.set(x, 2, L(WAL));
      }
      for (const y of [8, 16, 24, 32]) board(c, 1, y, 8, y + 1, WAL);
      c.rect(4, 4, 5, 7, hex('#4f6a8a'));
      c.set(4, 2, ROSE);
      c.set(4, 3, hex('#4f6a8a'));
      if (!u) {
        c.rect(4, 12, 6, 15, CHINA);
        c.set(6, 11, CHINA);
        c.set(6, 12, K);
      }
      c.rect(3, 21, 6, 23, C.navy);
      c.rect(3, 19, 5, 20, C.wine);
      c.rect(4, 28, 6, 31, hex('#7f9a8a'));
      c.row(27, 4, 6, C.parchment);
      if (u) {
        dots(c, CHINA, [8, b, 10, b, 11, b - 1, 12, b]);
        c.set(9, b, C.rust);
      }
    },
    su: [0, 0, 4],
  });
  add('barometer-banjo', 'barometer banjo wall weather glass dial thermometer walnut', {
    w: 11, h: 28,
    f(c, u) {
      c.rect(4, 2, 6, 14, WAL); // the neck
      c.col(4, 2, 14, L(WAL));
      c.rect(3, 1, 7, 1, WAL);
      c.set(5, 0, BR);
      c.col(5, 4, 11, C.bone); // thermometer
      c.col(5, 8, 11, C.red);
      c.oval(1, 14, 9, 23, WAL);
      c.oval(2, 15, 8, 22, BR);
      c.oval(3, 16, 7, 21, C.bone);
      c.rect(4, 24, 6, 25, WAL);
      c.set(5, 26, WAL);
      if (!u) c.line(5, 18, 7, 17, K);
      else {
        c.line(5, 19, 3, 20, K); // the needle dropped to storm, the glass split
        c.line(4, 16, 7, 21, C.slate);
        c.set(5, 25, C.steel);
        c.set(5, 27, C.steel);
        c.col(5, 4, 11, C.bone);
        c.set(5, 11, C.red);
      }
      c.set(5, 19, C.black);
    },
    u: [0, 0, 0],
    sw: 6, sh: 28,
    s(c, u) {
      c.rect(1, 1, 2, 25, WAL);
      c.col(1, 1, 25, L(WAL));
      c.rect(3, 15, 3, 22, BR);
      c.set(2, 26, WAL);
      c.set(2, 0, BR);
      if (u) {
        c.set(3, 25, C.steel);
        c.set(3, 27, C.steel);
      }
    },
  });
  add('mantel-clock-slate', 'mantel clock black slate marble gilt columns dial pendulum key', {
    w: 16, h: 16,
    f(c, u) {
      const b = c.h - 2,
        sl = hex('#2a2830');
      c.rect(1, b - 1, 14, b, sl);
      c.row(b - 1, 1, 14, hex('#4a4650'));
      c.rect(2, 4, 13, b - 2, sl);
      c.col(2, 4, b - 2, hex('#4a4650'));
      c.poly([[2, 4], [7, 1], [8, 1], [13, 4]], sl); // pediment
      c.line(2, 4, 7, 1, hex('#4a4650'));
      c.col(3, 5, b - 2, GILT); // columns
      c.col(12, 5, b - 2, D(GILT));
      c.oval(5, 5, 10, 10, GILT);
      c.oval(6, 6, 9, 9, u ? hex('#3f3a34') : C.bone);
      if (!u) {
        c.set(7, 7, K);
        c.set(8, 8, K);
        c.set(8, 7, K);
      } else {
        dots(c, BR, [7, 7, 8, 8, 7, 8]); // the works laid bare, the glass swung open
        c.set(8, 7, C.steel);
        c.oval(13, 5, 17, 10, GILT);
        c.oval(14, 6, 16, 9, C.glassLight);
        c.set(15, 8, C.glass);
        c.rect(5, b - 3, 6, b - 3, BR); // the key left on the plinth
        c.set(7, b - 3, GILT);
      }
      c.row(b - 3, 5, 10, hex('#4a4650'));
      if (u) c.rect(5, b - 3, 6, b - 3, BR), c.set(7, b - 3, GILT);
    },
    u: [0, 0, 3],
    sw: 9, sh: 16,
    s(c, u) {
      const b = c.h - 2,
        sl = hex('#2a2830');
      c.rect(1, b - 1, 7, b, sl);
      c.row(b - 1, 1, 7, hex('#4a4650'));
      c.rect(2, 3, 6, b - 2, sl);
      c.col(2, 3, b - 2, hex('#4a4650'));
      c.row(3, 2, 6, hex('#4a4650'));
      c.col(6, 5, b - 2, GILT);
      c.rect(7, 6, 7, 9, GILT);
      if (u) {
        c.rect(7, 6, 7, 9, hex('#3f3a34'));
        c.rect(8, 5, 11, 5, GILT); // the glass standing out
        c.rect(8, 10, 11, 10, D(GILT));
        c.rect(8, 6, 11, 9, C.glassLight);
        c.col(11, 5, 10, GILT);
      }
    },
    su: [0, 0, 4],
  });
};
