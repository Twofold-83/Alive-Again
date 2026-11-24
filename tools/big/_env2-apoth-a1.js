/* Apothecary, first part: the fittings of the old chemist's shop. Part of tools/big/env2-apoth.js. */
module.exports = (kit, H) => {
  const { C, K, hex, mix, blend, rnd } = kit;
  const { D, L, dots, board, face, panel, drawer, legs, cabSide, hollow, pane, flame, fire, wisp, bottle, shards, doorOut, opened, bricks, jar, shelfRow, carboy, drawerGrid, glow, puddle, pull, pullS } = H;
  const add = H.reg('env-apothecary', 'Apothecary');
  const MAH = hex('#5a3226'),
    OAK = hex('#6a4a32'),
    EB = hex('#2b242a'),
    BR = C.brass,
    GILT = C.gold,
    MARB = hex('#b4aea0'),
    CHINA = hex('#d6d2c4'),
    DELFT = hex('#44506e'),
    COPPER = hex('#a35f38'),
    RED = hex('#8a2f2c'),
    GREEN = hex('#3e6a4c'),
    BLUE = hex('#3d5a80'),
    AMBER = hex('#a8762c'),
    POISON = hex('#4d6a3a'),
    COBALT = hex('#2f3f6e'),
    SHOPGREEN = hex('#2f4a3c'),
    BONE = C.bone,
    WINE = C.wine,
    FLUID = hex('#9a9460'),
    PALE = hex('#c9b99a'),
    SAGE = hex('#7a8a5a'),
    DRIED = hex('#7a6a45'),
    LAV = hex('#6a5a80'),
    TANSY = hex('#a8904e');

  /* ---------- the counter and the walls ---------- */
  add('apoth-counter-brass-scale', 'apothecary shop counter mahogany marble top brass scale balance weights chemist', {
    w: 32, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 16, 30, b - 15, MARB);
      face(c, 2, b - 14, 29, b - 1, MAH);
      c.rect(1, b, 30, b, D(MAH));
      drawer(c, 4, b - 13, 14, b - 10, MAH);
      if (!u) drawer(c, 17, b - 13, 27, b - 10, MAH);
      panel(c, 4, b - 8, 14, b - 2, MAH);
      panel(c, 17, b - 8, 27, b - 2, MAH);
      if (u) pull(c, 17, b - 13, 27, b - 10, MAH, C.paper);
      /* the scale */
      c.rect(13, b - 17, 17, b - 17, EB);
      c.col(15, b - 24, b - 18, BR);
      c.set(15, b - 25, GILT);
      const pan = (x, y) => {
        c.col(x, y - 3, y - 1, D(BR));
        c.row(y, x - 2, x + 2, BR);
        c.row(y + 1, x - 1, x + 1, D(BR));
      };
      if (!u) {
        c.row(b - 24, 9, 21, BR);
        pan(9, b - 20);
        pan(21, b - 20);
      } else {
        c.line(9, b - 22, 21, b - 26, BR);
        pan(9, b - 18);
        pan(21, b - 22);
        c.row(b - 19, 8, 10, CHINA); // powder on the low pan
        c.set(9, b - 20, CHINA);
        dots(c, CHINA, [5, b - 17, 6, b - 17, 12, b - 17]); // and spilt on the marble
      }
      jar(c, 3, b - 17, 3, 6, CHINA, DELFT, DELFT);
      c.rect(25, b - 18, 27, b - 17, BR); // weights
      c.set(26, b - 19, BR);
      c.set(28, b - 17, D(BR));
    },
    sw: 14, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 16, 12, b - 15, MARB);
      cabSide(c, 2, b - 14, 11, b - 1, MAH);
      c.rect(1, b, 12, b, D(MAH));
      c.rect(5, b - 17, 8, b - 17, EB);
      c.col(6, b - 24, b - 18, BR);
      c.set(6, b - 25, GILT);
      c.rect(6, b - 24, 7, b - 24, BR);
      if (!u) {
        c.col(7, b - 23, b - 21, D(BR));
        c.row(b - 20, 5, 9, BR);
        c.row(b - 19, 6, 8, D(BR));
      } else {
        c.row(b - 22, 5, 8, D(BR)); // the far pan up
        c.row(b - 18, 5, 9, BR); // the near pan down, with its powder
        c.row(b - 19, 6, 8, CHINA);
        c.col(7, b - 25, b - 23, BR);
      }
      c.rect(10, b - 18, 11, b - 17, BR);
      if (u) pullS(c, 12, b - 13, b - 10, 3, MAH, C.paper);
    },
    su: [0, 0, 4],
  });

  add('apoth-drawer-wall-labelled', 'apothecary wall of labelled drawers drug run chemist cabinet mahogany', {
    w: 28, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(2, 3, 25, b - 13, mix(MAH, 0.5));
      board(c, 1, 1, 26, 2, MAH);
      drawerGrid(c, 3, 4, 25, b - 13, 4, 5, MAH, (i, j) => u && ((i === 1 && j === 1) || (i === 3 && j === 2) || (i === 0 && j === 3)));
      board(c, 1, b - 12, 26, b - 11, MAH);
      face(c, 2, b - 10, 25, b, MAH);
      panel(c, 4, b - 8, 12, b - 2, MAH);
      panel(c, 15, b - 8, 23, b - 2, MAH);
      dots(c, BR, [11, b - 5, 16, b - 5]);
      if (u) {
        c.rect(8, b - 14, 13, b - 13, MAH); // a drawer taken out and left on the ledge
        c.row(b - 15, 9, 12, C.paper);
        c.set(10, b - 13, BR);
        dots(c, DRIED, [16, b - 13, 18, b - 13, 19, b - 13]); // dried roots beside it
      }
    },
    sw: 11, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 1, 9, 2, MAH);
      cabSide(c, 2, 3, 8, b - 13, MAH);
      board(c, 1, b - 12, 9, b - 11, MAH);
      cabSide(c, 2, b - 10, 9, b, MAH);
      if (u) {
        pullS(c, 9, 9, 11, 3, MAH);
        pullS(c, 9, 14, 16, 3, MAH);
        pullS(c, 9, 18, 20, 2, MAH);
        c.rect(6, b - 14, 9, b - 13, MAH);
        c.row(b - 15, 7, 9, C.paper);
      }
    },
    su: [0, 0, 4],
  });

  add('apoth-jar-shelves-tall', 'apothecary jar shelves tall drug jars bottles china delft shelf chemist', {
    w: 26, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 3, 22, b - 12, mix(MAH, 0.42));
      face(c, 1, 3, 2, b - 12, MAH);
      face(c, 23, 3, 24, b - 12, MAH);
      board(c, 1, 1, 24, 2, MAH);
      c.row(2, 2, 23, GILT);
      for (let i = 0; i < 4; i++) {
        const x = 4 + i * 5;
        if (u && i === 2) continue; // one of the great china jars is gone
        jar(c, x, 9, 4, 6, CHINA, DELFT, null);
        c.row(6, x, x + 3, DELFT);
        c.row(7, x + 1, x + 2, GILT);
      }
      for (const [y, seed, gone] of [[10, 3, [2, 5]], [17, 8, [0]], [24, 5, [3, 4]]]) {
        c.row(y, 3, 22, L(MAH));
        if (y < 24) shelfRow(c, 4, 21, y + 6, seed, 5, u ? gone : []);
      }
      board(c, 1, b - 11, 24, b - 10, MAH);
      face(c, 2, b - 9, 23, b, MAH);
      panel(c, 4, b - 7, 11, b - 2, MAH);
      panel(c, 14, b - 7, 21, b - 2, MAH);
      dots(c, BR, [10, b - 4, 15, b - 4]);
      if (u) {
        shards(c, 8, 17, b, CHINA, 4); // smashed on the floor
        dots(c, DELFT, [10, b, 14, b - 1]);
        dots(c, DRIED, [12, b, 13, b, 15, b]);
      }
    },
    sw: 10, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, 1, 8, 2, MAH);
      c.row(2, 2, 7, GILT);
      cabSide(c, 2, 3, 7, b - 12, MAH);
      dots(c, CHINA, [8, 7, 8, 8]); // what stands at the front edge of the shelves
      dots(c, AMBER, [8, 14, 8, 15]);
      if (!u) dots(c, BLUE, [8, 21, 8, 22, 8, 20]);
      dots(c, GREEN, [8, 28 - 12 + 12 - 6, 8, 23]);
      board(c, 1, b - 11, 8, b - 10, MAH);
      cabSide(c, 2, b - 9, 8, b, MAH);
      if (u) {
        shards(c, 9, 12, b, CHINA, 4);
        dots(c, DELFT, [10, b, 11, b - 1, 9, b]);
      }
    },
    su: [0, 0, 4],
  });

  add('apoth-carboy-stand-coloured', 'apothecary carboys show globes coloured water red green blue window stand chemist', {
    w: 30, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 5, 27, b, MAH);
      c.row(b - 3, 4, 25, GILT);
      c.rect(1, b, 28, b, D(MAH));
      board(c, 1, b - 7, 28, b - 6, MAH);
      carboy(c, 6, b - 8, 3, 12, RED);
      carboy(c, 24, b - 8, 3, 12, BLUE);
      if (!u) carboy(c, 15, b - 8, 4, 16, GREEN);
      else {
        c.rect(12, b - 10, 18, b - 8, GREEN); // what is left of the middle globe
        c.clearRect(13, b - 10, 13, b - 10);
        c.clearRect(16, b - 10, 17, b - 10);
        c.set(12, b - 11, L(GREEN));
        c.set(18, b - 11, GREEN);
        c.set(15, b - 11, L(GREEN));
        c.row(b - 8, 12, 18, D(GREEN));
        c.row(b - 6, 9, 21, mix(GREEN, 0.8)); // the water over the board and down the front
        c.col(11, b - 5, b - 2, mix(GREEN, 0.8));
        c.col(16, b - 5, b, mix(GREEN, 0.8));
        c.col(19, b - 5, b - 3, mix(GREEN, 0.8));
        shards(c, 8, 22, b - 8, C.glassLight, 7);
      }
    },
    sw: 13, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, b - 5, 10, b, MAH, false);
      c.row(b - 3, 4, 8, GILT);
      c.rect(1, b, 11, b, D(MAH));
      board(c, 1, b - 7, 11, b - 6, MAH);
      if (!u) {
        c.rect(5, b - 23, 7, b - 19, GREEN); // the tall middle globe behind
        c.rect(5, b - 24, 7, b - 23, C.glassLight);
        c.set(6, b - 25 + 1, C.glassLight);
      }
      carboy(c, 6, b - 8, 3, 12, BLUE);
      if (u) {
        c.row(b - 6, 3, 9, mix(GREEN, 0.8));
        c.col(4, b - 5, b - 1, mix(GREEN, 0.8));
        c.col(8, b - 5, b - 3, mix(GREEN, 0.8));
        dots(c, C.glassLight, [2, b - 8, 10, b - 8]);
      }
    },
  });

  add('apoth-poison-cabinet-locked', 'apothecary poison cabinet locked black ebony skull crossbones padlock cupboard', {
    w: 18, h: 32, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [3, 13], b - 9, b, EB);
      c.row(b - 4, 4, 13, D(EB));
      board(c, 1, 2, 16, 3, EB);
      face(c, 2, 4, 15, b - 10, EB);
      c.row(b - 10, 1, 16, L(EB));
      if (!u) {
        panel(c, 3, 5, 8, b - 12, EB);
        panel(c, 9, 5, 14, b - 12, EB);
        c.rect(7, 7, 10, 9, BONE); // the death's head
        dots(c, K, [8, 8, 10, 8]);
        dots(c, BONE, [6, 11, 11, 11, 8, 10, 9, 10, 6, 10, 11, 10]);
        c.row(10, 7, 10, BONE);
        dots(c, K, [8, 10]);
        c.rect(8, 15, 9, 17, BR); // padlock
        c.set(8, 14, C.steel);
        c.set(9, 14, C.steel);
        c.set(8, 16, K);
      } else {
        opened(c, 3, 5, 14, b - 12, EB);
        c.row(12, 4, 13, mix(EB, 1.6));
        for (let i = 0; i < 4; i++) if (i !== 2) bottle(c, 4 + i * 3, 11, 6, i % 2 ? COBALT : POISON, 2);
        for (let i = 0; i < 4; i++) bottle(c, 4 + i * 3, b - 13, 5, i % 2 ? POISON : COBALT, 2);
        dots(c, BONE, [5, 10, 11, b - 14]);
        c.rect(1, 15, 1, 17, BR); // the padlock hanging open on the door's edge
        c.set(1, 14, C.steel);
      }
    },
    sw: 10, sh: 32,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [2, 7], b - 9, b, EB, 1);
      c.row(b - 4, 3, 6, D(EB));
      board(c, 1, 2, 8, 3, EB);
      cabSide(c, 2, 4, 7, b - 10, EB);
      c.row(b - 10, 1, 8, L(EB));
      if (u) {
        doorOut(c, 8, 5, b - 12, 6, EB);
        c.rect(12, 15, 13, 16, BR);
      }
    },
    su: [0, 0, 6],
  });

  /* ---------- fire and glass ---------- */
  add('apoth-still-copper-coils', 'apothecary still copper alembic worm tub coils distilling firebox spirit', {
    w: 25, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.oval(1, b - 18, 11, b - 5, COPPER); // the pot
      for (let i = 0; i < 5; i++) c.set(3 + (i >> 1), b - 9 - i, L(COPPER));
      c.row(b - 12, 2, 10, D(COPPER));
      dots(c, D(COPPER), [3, b - 12, 6, b - 12, 9, b - 12]);
      c.oval(4, b - 22, 8, b - 17, COPPER); // the helm
      c.set(5, b - 21, L(COPPER));
      c.line(7, b - 22, 9, b - 24, COPPER); // the swan neck
      c.row(b - 24, 9, 17, L(COPPER));
      c.line(17, b - 24, 19, b - 18, COPPER);
      bricks(c, 1, b - 7, 11, b);
      c.row(b - 7, 1, 11, C.stoneLight);
      c.rect(4, b - 5, 8, b - 1, C.ironDark);
      c.set(8, b - 3, BR);
      legs(c, [15, 22], b - 4, b, OAK, 1);
      face(c, 15, b - 17, 22, b - 5, OAK); // the worm tub
      for (const x of [17, 20]) c.col(x, b - 16, b - 5, D(OAK));
      c.row(b - 14, 15, 22, C.iron);
      c.row(b - 8, 15, 22, C.iron);
      c.row(b - 17, 15, 22, C.water);
      dots(c, COPPER, [18, b - 18, 19, b - 18]);
      c.rect(13, b - 6, 14, b - 6, COPPER); // the spout and the flask under it
      c.rect(12, b - 3, 13, b, C.glass);
      c.set(12, b - 4, C.glassLight);
      if (u) {
        hollow(c, 4, b - 5, 8, b - 1, C.rust);
        fire(c, 5, 7, b - 1, 4, 3);
        dots(c, C.flame, [3, b, 9, b]);
        wisp(c, 6, b - 24, 4, C.ghost);
        wisp(c, 20, b - 19, 3, C.ghost);
        c.set(13, b - 5, AMBER);
        c.rect(12, b - 2, 13, b, AMBER);
      }
    },
    sw: 14, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.oval(3, b - 22, 9, b - 14, COPPER); // the helm and the neck behind the tub
      c.set(4, b - 20, L(COPPER));
      c.col(6, b - 24, b - 22, L(COPPER));
      c.rect(6, b - 24, 7, b - 23, COPPER);
      c.rect(2, b - 6, 4, b, hex('#7a4636')); // the firebox's corner
      c.col(2, b - 6, b, hex('#8f5a48'));
      legs(c, [3, 10], b - 4, b, OAK, 1);
      face(c, 3, b - 17, 10, b - 5, OAK);
      for (const x of [5, 8]) c.col(x, b - 16, b - 5, D(OAK));
      c.row(b - 14, 3, 10, C.iron);
      c.row(b - 8, 3, 10, C.iron);
      c.row(b - 17, 3, 10, C.water);
      dots(c, COPPER, [6, b - 18, 7, b - 18]);
      c.set(11, b - 6, COPPER);
      c.rect(11, b - 3, 12, b, C.glass);
      c.set(11, b - 4, C.glassLight);
      if (u) {
        dots(c, C.flame, [5, b, 6, b - 1, 7, b, 8, b]);
        dots(c, C.flameLight, [6, b, 7, b - 1]);
        wisp(c, 5, b - 25, 3, C.ghost);
        wisp(c, 8, b - 19, 3, C.ghost);
        c.rect(11, b - 2, 12, b, AMBER);
      }
    },
    u: [0, 3, 0], su: [0, 3, 0],
  });

  add('apoth-crucible-furnace', 'apothecary crucible furnace brick assay oven iron door flue melting alchemy', {
    w: 18, h: 30, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(12, 2, 14, b - 15, C.ironDark); // the flue
      c.col(12, 2, b - 15, C.iron);
      c.row(8, 12, 14, C.iron);
      bricks(c, 2, b - 13, 15, b);
      board(c, 1, b - 15, 16, b - 14, C.iron);
      c.rect(5, b - 9, 10, b - 2, C.ironDark); // the door
      c.row(b - 10, 6, 9, C.ironDark);
      c.col(5, b - 9, b - 2, C.iron);
      dots(c, C.steel, [10, b - 7, 10, b - 4]);
      c.set(7, b - 5, BR);
      const CLAY = hex('#6a5a50');
      c.rect(4, b - 19, 8, b - 16, CLAY); // the crucible
      c.row(b - 20, 3, 9, L(CLAY));
      c.set(4, b - 16, null);
      c.line(9, b - 21, 11, b - 16, C.iron); // tongs
      if (u) {
        hollow(c, 5, b - 9, 9, b - 2, C.rust);
        c.row(b - 10, 6, 9, mix(C.rust, 0.3));
        fire(c, 5, 9, b - 2, 6, 5);
        c.col(10, b - 9, b - 2, C.iron);
        c.row(b - 20, 4, 8, C.flameLight);
        c.row(b - 19, 4, 8, C.flame);
        wisp(c, 13, 1, 4, C.ash);
        dots(c, C.flame, [4, b, 11, b]);
      }
    },
    sw: 14, sh: 30,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 5, b - 15, C.ironDark);
      c.col(3, 2, b - 15, C.iron);
      c.row(8, 3, 5, C.iron);
      bricks(c, 2, b - 13, 11, b, hex('#7a4636'), 4);
      board(c, 1, b - 15, 12, b - 14, C.iron);
      const CLAY = hex('#6a5a50');
      c.rect(7, b - 19, 10, b - 16, CLAY);
      c.row(b - 20, 6, 11, L(CLAY));
      if (!u) c.col(12, b - 9, b - 2, C.ironDark);
      else {
        face(c, 12, b - 9, 15, b - 2, C.ironDark);
        dots(c, C.flame, [12, b - 5, 12, b - 3, 13, b]);
        c.set(12, b - 4, C.flameLight);
        c.row(b - 20, 7, 10, C.flameLight);
        c.row(b - 19, 7, 10, C.flame);
        wisp(c, 4, 1, 4, C.ash);
      }
    },
    u: [0, 3, 0], su: [0, 3, 4],
  });

  add('apoth-specimen-jars-shelf', 'apothecary specimen jars pickled hand snake foetus preserved bench shelf curiosities', {
    w: 26, h: 25, solid: true,
    f(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 8, 24, b - 7, OAK);
      legs(c, [2, 22], b - 6, b, OAK);
      board(c, 3, b - 2, 22, b - 2, D(OAK));
      c.rect(5, b - 5, 9, b - 3, DRIED); // a box of labels below
      c.row(b - 5, 5, 9, C.paper);
      c.rect(13, b - 6, 19, b - 3, WINE); // ledgers
      c.col(15, b - 6, b - 3, D(WINE));
      c.col(17, b - 6, b - 3, GILT);
      const big = (x0, x1, h, fl) => {
        c.rect(x0, b - 8 - h + 2, x1, b - 9, fl);
        c.col(x0, b - 8 - h + 2, b - 9, blend(fl, C.white, 0.4));
        c.col(x1, b - 8 - h + 2, b - 9, D(fl));
        c.row(b - 8 - h + 1, x0, x1, EB);
        c.row(b - 8 - h, x0 + 1, x1 - 1, EB);
        c.row(b - 9, x0 + 1, x1 - 1, C.paper);
      };
      big(2, 7, 11, FLUID);
      dots(c, PALE, [4, b - 13, 5, b - 13, 4, b - 12, 5, b - 12, 4, b - 14, 5, b - 15, 3, b - 14, 6, b - 15, 4, b - 16, 4, b - 11, 5, b - 11]); // a hand
      big(10, 15, 13, u ? hex('#7f8f8c') : FLUID);
      if (!u) dots(c, C.moss, [12, b - 18, 13, b - 17, 12, b - 16, 11, b - 15, 12, b - 14, 13, b - 13, 13, b - 12, 12, b - 11, 11, b - 12]); // a snake
      else {
        dots(c, K, [12, b - 17, 13, b - 16, 12, b - 15, 13, b - 14, 14, b - 13, 13, b - 12]); // the crack
        c.row(b - 8, 9, 17, FLUID);
        c.col(12, b - 7, b - 4, FLUID);
        c.col(16, b - 7, b - 6, FLUID);
        dots(c, C.moss, [4, b, 5, b - 1, 6, b, 7, b, 8, b - 1, 9, b]); // and the snake is on the floor
        c.set(10, b - 1, C.blood);
      }
      big(18, 23, 10, FLUID);
      dots(c, PALE, [20, b - 14, 21, b - 14, 20, b - 13, 21, b - 13, 22, b - 13, 20, b - 12, 21, b - 12, 21, b - 11, 20, b - 11]); // something curled up
      c.set(21, b - 14, K);
    },
    sw: 11, sh: 25,
    s(c, u) {
      const b = c.h - 2;
      board(c, 1, b - 8, 9, b - 7, OAK);
      legs(c, [2, 7], b - 6, b, OAK);
      c.row(b - 2, 3, 7, D(OAK));
      c.rect(3, b - 20, 7, b - 17, u ? hex('#7f8f8c') : FLUID); // the tall one behind
      c.row(b - 21, 3, 7, EB);
      c.row(b - 22, 4, 6, EB);
      c.rect(3, b - 16, 8, b - 9, FLUID);
      c.col(3, b - 16, b - 9, blend(FLUID, C.white, 0.4));
      c.col(8, b - 16, b - 9, D(FLUID));
      c.row(b - 17, 3, 8, EB);
      c.row(b - 9, 4, 7, C.paper);
      dots(c, PALE, [5, b - 14, 6, b - 14, 5, b - 13, 6, b - 13, 5, b - 12, 6, b - 12, 6, b - 11, 5, b - 11]);
      c.set(6, b - 14, K);
      if (u) {
        c.row(b - 8, 2, 6, FLUID);
        c.col(4, b - 7, b - 4, FLUID);
        dots(c, C.moss, [8, b, 9, b - 1, 9, b]);
      }
    },
  });

  add('apoth-herb-drying-rack', 'apothecary herb drying rack bundles hanging sage lavender dried plants wooden frame', {
    w: 28, h: 36, solid: true,
    f(c, u) {
      const b = c.h - 2;
      legs(c, [2, 24], 2, b, OAK);
      c.rect(1, b, 4, b, D(OAK));
      c.rect(23, b, 26, b, D(OAK));
      const cols = [SAGE, DRIED, LAV, TANSY, C.moss];
      let k = 0;
      for (const y of [2, 12, 22]) {
        board(c, 2, y, 25, y + 1, OAK);
        for (let x = 5; x <= 21; x += 4, k++) {
          if (u && ![1, 7, 8, 13].includes(k)) {
            if (k % 3 === 0) c.col(x + 1, y + 2, y + 3, C.straw); // a string left dangling
            continue;
          }
          const col = cols[(k * 3 + (y >> 1)) % 5];
          c.col(x + 1, y + 2, y + 3, C.straw);
          c.rect(x, y + 4, x + 2, y + 8, col);
          c.col(x, y + 4, y + 8, L(col));
          c.set(x + 2, y + 6, D(col));
          c.set(x + 1, y + 9, col === LAV ? hex('#8a78a8') : D(col));
          c.set(x, y + 9, col);
        }
      }
      if (u) dots(c, DRIED, [7, b, 9, b, 12, b - 1, 15, b, 18, b, 20, b - 1]); // crumbled leaves
      if (u) dots(c, SAGE, [8, b, 13, b, 19, b]);
    },
    sw: 9, sh: 36,
    s(c, u) {
      const b = c.h - 2;
      legs(c, [3], 2, b, OAK, 3);
      c.rect(1, b, 7, b, D(OAK));
      let k = 0;
      for (const y of [2, 12, 22]) {
        c.rect(3, y, 5, y + 1, L(OAK));
        k++;
        if (u && k !== 2) continue;
        const col = [SAGE, LAV, TANSY][k - 1];
        c.rect(3, y + 4, 5, y + 8, col);
        c.col(3, y + 4, y + 8, L(col));
        c.set(2, y + 6, col);
        c.set(6, y + 7, D(col));
        c.set(4, y + 9, D(col));
        c.col(4, y + 2, y + 3, C.straw);
      }
      if (u) dots(c, DRIED, [2, b - 1, 6, b - 1]);
    },
  });

  /* ---------- the doctor's corner ---------- */
  add('apoth-skeleton-on-stand', 'apothecary skeleton on a stand hanging bones anatomy study iron hook', {
    w: 14, h: 39,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 1, 10, b, EB);
      c.row(b - 1, 3, 10, L(EB));
      c.col(7, 1, 3, C.iron);
      c.col(6, 9, 22, C.iron); // the rod behind the spine
      if (!u) {
        c.oval(4, 3, 9, 8, BONE);
        dots(c, K, [5, 5, 8, 5, 6, 7, 7, 7]);
        c.row(8, 5, 8, BONE);
        c.row(9, 6, 7, D(BONE));
      } else {
        c.set(7, 4, C.iron); // the hook bare
        c.set(6, 5, C.iron);
        c.oval(8, b - 6, 12, b - 2, BONE); // the skull at its own feet
        dots(c, K, [9, b - 4, 11, b - 4]);
        c.row(b - 2, 9, 11, D(BONE));
      }
      c.rect(6, 9, 7, 9, D(BONE));
      c.row(10, 3, 10, BONE);
      for (const y of [12, 14, 16]) {
        c.row(y, 4, 9, BONE);
        c.set(4, y - 1, BONE);
        c.set(9, y - 1, BONE);
      }
      c.col(6, 11, 18, BONE);
      c.col(7, 11, 18, D(BONE));
      c.rect(4, 19, 9, 20, BONE);
      dots(c, K, [5, 20, 8, 20]);
      c.row(21, 5, 8, BONE);
      c.col(2, 11, 21, BONE);
      c.set(2, 16, D(BONE));
      dots(c, BONE, [1, 22, 2, 22, 2, 23]);
      if (!u) {
        c.col(11, 11, 21, BONE);
        c.set(11, 16, D(BONE));
        dots(c, BONE, [11, 22, 12, 22, 11, 23]);
      } else c.col(11, 11, 15, BONE); // the forearm dropped off
      for (const x of [5, 8]) {
        c.col(x, 22, b - 3, BONE);
        c.set(x, 28, D(BONE));
        c.set(x, 27, L(BONE));
      }
      c.row(b - 2, 4, 5, BONE);
      c.row(b - 2, 8, 9, BONE);
      if (u) c.row(b, 0, 2, BONE);
    },
    sw: 11, sh: 39,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 1, 9, b, EB);
      c.row(b - 1, 2, 9, L(EB));
      c.col(2, 1, b - 2, C.iron);
      c.row(1, 2, 6, C.iron);
      c.col(6, 1, 2, C.iron);
      if (!u) {
        c.oval(4, 3, 9, 8, BONE);
        c.set(8, 5, K);
        c.set(4, 8, null);
        c.row(8, 6, 8, BONE);
        c.set(8, 7, K);
      } else {
        c.set(6, 3, C.iron);
        c.oval(6, b - 6, 10, b - 2, BONE);
        c.set(9, b - 4, K);
      }
      c.col(5, 9, 20, BONE);
      c.set(5, 9, D(BONE));
      for (const y of [11, 13, 15]) c.row(y, 5, 8, BONE);
      dots(c, BONE, [8, 12, 8, 14]);
      c.rect(4, 19, 7, 21, BONE);
      c.set(6, 20, K);
      c.col(7, 10, u ? 15 : 21, D(BONE));
      if (!u) dots(c, BONE, [8, 22, 7, 22]);
      c.col(6, 22, b - 3, BONE);
      c.set(6, 28, D(BONE));
      c.row(b - 2, 6, 8, BONE);
    },
  });

  add('apoth-anatomy-chart-stand', 'apothecary anatomical chart stand flayed man muscles skeleton diagram poster medical', {
    w: 18, h: 38,
    f(c, u) {
      const b = c.h - 2;
      const MUS = hex('#8a3f36');
      c.col(8, 1, b, EB);
      c.col(9, 1, b, D(EB));
      c.rect(5, b, 12, b, EB);
      c.rect(6, b - 1, 11, b - 1, EB);
      c.row(3, 2, 15, OAK);
      c.rect(3, 4, 14, 27, u ? C.night : C.paper);
      c.row(28, 2, 15, OAK);
      const fig = u ? BONE : MUS;
      c.oval(7, 6, 10, 9, fig);
      c.rect(6, 11, 11, 17, fig);
      c.rect(7, 10, 10, 10, fig);
      c.col(4, 11, 18, fig);
      c.col(13, 11, 18, fig);
      c.row(11, 5, 12, fig);
      c.rect(7, 18, 8, 25, fig);
      c.rect(9, 18, 10, 25, fig);
      dots(c, fig, [6, 26, 7, 26, 10, 26, 11, 26]);
      if (!u) {
        dots(c, D(MUS), [8, 13, 9, 13, 8, 15, 9, 15, 7, 21, 10, 21, 4, 14, 13, 14]);
        dots(c, C.paper, [8, 8, 9, 8]);
        dots(c, hex('#b8756a'), [7, 12, 10, 12, 7, 19, 9, 19]);
        dots(c, C.slate, [4, 6, 5, 6, 12, 22, 13, 22, 13, 24]); // the lettering
      } else {
        dots(c, C.night, [7, 7, 10, 7, 8, 9, 9, 9, 7, 12, 10, 12, 7, 14, 10, 14, 7, 16, 10, 16, 8, 11, 9, 11, 8, 19, 9, 19]);
        c.col(8, 20, 25, C.night);
        c.col(9, 18, 25, BONE);
        c.col(8, 18, 25, C.night);
        c.col(7, 19, 25, BONE);
        c.col(10, 19, 25, BONE);
        c.rect(3, 1, 14, 2, C.paper); // the first sheet thrown over the top
        c.set(3, 2, D(C.paper));
      }
    },
    sw: 8, sh: 38,
    s(c, u) {
      const b = c.h - 2;
      c.col(3, 1, b, EB);
      c.col(4, 1, b, D(EB));
      c.rect(1, b, 6, b, EB);
      c.rect(2, b - 1, 5, b - 1, EB);
      c.rect(4, 3, 5, 3, OAK);
      c.col(5, 4, 27, u ? C.night : C.paper);
      c.rect(4, 28, 5, 28, OAK);
      if (u) {
        c.row(2, 2, 5, C.paper);
        c.col(2, 3, 20, C.paper); // the first sheet hanging down the back
        c.col(1, 12, 20, D(C.paper));
        c.set(5, 12, BONE);
        c.set(5, 20, BONE);
      } else dots(c, hex('#8a3f36'), [5, 9, 5, 13, 5, 20]);
    },
  });

  add('apoth-prescription-lectern', 'apothecary prescription book lectern ledger recipes reading stand formulary', {
    w: 14, h: 28, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, b - 1, 10, b, MAH);
      c.row(b - 1, 3, 10, L(MAH));
      c.rect(6, b - 14, 7, b - 2, MAH);
      c.col(6, b - 14, b - 2, L(MAH));
      dots(c, MAH, [5, b - 8, 8, b - 8, 5, b - 2, 8, b - 2]);
      face(c, 2, b - 22, 11, b - 16, MAH);
      c.row(b - 15, 1, 12, L(MAH));
      if (!u) {
        c.rect(3, b - 21, 10, b - 17, WINE);
        c.row(b - 21, 3, 10, L(WINE));
        c.frame(4, b - 20, 9, b - 18, GILT);
        c.col(10, b - 21, b - 17, C.paper);
        c.set(10, b - 19, BR);
      } else {
        c.rect(1, b - 22, 12, b - 17, C.paper);
        c.col(6, b - 22, b - 17, D(C.paper));
        c.col(7, b - 22, b - 17, C.white);
        for (let y = b - 21; y < b - 17; y += 2) {
          c.row(y, 2, 5, C.slate);
          c.row(y, 8, 11, C.slate);
        }
        c.set(10, b - 19, C.blood);
        c.col(7, b - 16, b - 12, C.blood); // the ribbon
        c.line(11, b - 23, 12, b - 26, C.white); // the quill left on it
        c.set(12, b - 27, C.white);
      }
    },
    sw: 13, sh: 28,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 1, 9, b, MAH);
      c.row(b - 1, 2, 9, L(MAH));
      c.rect(5, b - 14, 6, b - 2, MAH);
      c.col(5, b - 14, b - 2, L(MAH));
      dots(c, MAH, [4, b - 2, 7, b - 2]);
      for (let i = 0; i < 9; i++) {
        const y = b - 21 + Math.round(i * 0.75);
        c.col(2 + i, y, y + 2, MAH);
        c.set(2 + i, y, L(MAH));
        if (i > 0 && i < 8) {
          c.set(2 + i, y - 1, u ? C.paper : WINE);
          if (!u) c.set(2 + i, y - 2, L(WINE));
        }
      }
      c.col(11, b - 15, b - 13, L(MAH));
      c.set(10, b - 13, MAH);
      if (u) {
        c.col(5, b - 23, b - 21, C.paper); // a leaf standing up
        c.set(6, b - 24, C.paper);
        c.col(9, b - 15, b - 11, C.blood);
        c.line(3, b - 23, 2, b - 26, C.white);
      }
    },
    u: [0, 2, 0], su: [0, 2, 0],
  });

  add('apoth-medicine-chest-brass', 'apothecary medicine chest travelling box brass corners bottles physician case', {
    w: 22, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 10, 19, b, MAH);
      dots(c, BR, [2, b, 19, b, 2, b - 10, 19, b - 10, 3, b, 18, b, 2, b - 1, 19, b - 1]);
      c.rect(10, b - 9, 11, b - 7, BR);
      c.set(10, b - 8, K);
      dots(c, C.iron, [1, b - 6, 20, b - 6, 1, b - 5, 20, b - 5]);
      c.row(b - 5, 4, 17, D(MAH));
      if (!u) {
        face(c, 2, b - 13, 19, b - 11, MAH);
        c.row(b - 14, 3, 18, L(MAH));
        dots(c, BR, [2, b - 13, 19, b - 13, 3, b - 14, 18, b - 14]);
      } else {
        face(c, 2, b - 21, 19, b - 13, MAH); // the lid up: green baize inside
        c.rect(4, b - 19, 17, b - 14, SHOPGREEN);
        dots(c, C.steel, [6, b - 17, 7, b - 16, 8, b - 17, 12, b - 17, 13, b - 16, 14, b - 17]); // lancets in their loops
        dots(c, BR, [2, b - 21, 19, b - 21]);
        hollow(c, 3, b - 12, 18, b - 11, MAH);
        for (let i = 0; i < 5; i++) if (i !== 3) bottle(c, 4 + i * 3, b - 10, 4, [AMBER, BLUE, GREEN, RED, C.glass][i], 2);
        dots(c, C.paper, [5, b - 10, 8, b - 10, 11, b - 10, 17, b - 10]);
      }
    },
    sw: 14, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      cabSide(c, 2, b - 10, 11, b, MAH, false);
      dots(c, BR, [2, b, 11, b, 2, b - 10, 11, b - 10]);
      c.rect(5, b - 6, 8, b - 6, C.iron);
      dots(c, C.iron, [5, b - 5, 8, b - 5]);
      if (!u) {
        face(c, 2, b - 13, 11, b - 11, MAH);
        c.row(b - 14, 3, 10, L(MAH));
        dots(c, BR, [2, b - 13, 11, b - 13]);
      } else {
        c.rect(2, b - 21, 3, b - 11, MAH);
        c.col(2, b - 21, b - 11, L(MAH));
        c.col(4, b - 20, b - 12, SHOPGREEN);
        hollow(c, 5, b - 11, 10, b - 11, MAH);
        bottle(c, 6, b - 11, 4, AMBER, 2);
        bottle(c, 9, b - 11, 4, BLUE, 2);
      }
    },
    u: [0, 8, 0], su: [0, 8, 0],
  });

  add('apoth-tincture-rack-tiered', 'apothecary tincture rack tiered bottles small vials stand three steps drops', {
    w: 20, h: 16,
    f(c, u) {
      const b = c.h - 2;
      const cols = [AMBER, BLUE, GREEN, RED, hex('#6a5a36'), C.glass];
      let k = 0;
      for (let t = 2; t >= 0; t--) {
        const y = b - t * 4,
          x0 = 1 + t,
          x1 = 18 - t;
        c.row(y, x0, x1, t ? OAK : D(OAK));
        c.set(x0, y, L(OAK));
        for (let x = x0 + 1; x + 1 < x1; x += 3, k++) {
          if (u && [1, 2, 6, 9, 10, 13].includes(k)) continue;
          const col = cols[(k * 5 + t) % 6];
          c.rect(x, y - 2, x + 1, y - 1, col);
          c.set(x, y - 2, L(col));
          c.set(x, y - 3, C.parchment);
        }
      }
      if (u) {
        c.rect(7, b - 1, 10, b - 1, AMBER); // one on its side, running out
        c.set(11, b - 1, C.parchment);
        c.row(b, 3, 8, mix(AMBER, 0.7));
      }
    },
    sw: 11, sh: 16,
    s(c, u) {
      const b = c.h - 2;
      c.rect(2, b - 8, 3, b, OAK);
      c.rect(4, b - 4, 6, b, OAK);
      c.rect(7, b, 9, b, D(OAK));
      c.col(2, b - 8, b, L(OAK));
      c.row(b - 4, 4, 6, L(OAK));
      const one = (x, y, col) => {
        c.rect(x, y - 2, x + 1, y - 1, col);
        c.set(x, y - 2, L(col));
        c.set(x, y - 3, C.parchment);
      };
      one(2, b - 8, GREEN);
      if (!u) one(5, b - 4, BLUE);
      if (!u) one(8, b, AMBER);
      else {
        c.row(b - 1, 7, 9, AMBER);
        c.row(b, 7, 9, mix(AMBER, 0.7));
      }
    },
  });

  add('apoth-cash-register-brass', 'apothecary cash register brass till ornate keys drawer money shop', {
    w: 15, h: 17, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 4, 12, b, MAH);
      if (!u) drawer(c, 3, b - 3, 11, b - 1, MAH);
      face(c, 3, b - 10, 11, b - 5, BR);
      dots(c, CHINA, [4, b - 6, 6, b - 6, 8, b - 6, 10, b - 6, 5, b - 8, 7, b - 8, 9, b - 8]);
      dots(c, D(BR), [4, b - 9, 10, b - 9]);
      face(c, 4, b - 13, 10, b - 11, BR);
      c.rect(5, b - 12, 9, b - 12, EB);
      c.row(b - 14, 5, 9, GILT);
      c.col(13, b - 9, b - 7, C.iron); // the crank
      c.set(13, b - 10, EB);
      if (u) {
        pull(c, 3, b - 3, 11, b - 2, MAH, GILT);
        dots(c, CHINA, [6, b - 12, 8, b - 12]);
        c.rect(6, b - 17, 8, b - 15, CHINA); // the sale flag is up
        c.set(7, b - 16, RED);
      }
    },
    sw: 13, sh: 17,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, b - 4, 9, b, MAH);
      c.poly([[2, b - 10], [5, b - 10], [9, b - 6], [9, b - 5], [2, b - 5]], BR);
      c.col(2, b - 10, b - 5, L(BR));
      dots(c, CHINA, [6, b - 9, 8, b - 7]);
      c.rect(2, b - 13, 5, b - 11, BR);
      c.row(b - 14, 2, 5, GILT);
      c.col(5, b - 13, b - 11, D(BR));
      c.oval(4, b - 9, 6, b - 7, C.iron); // the crank wheel on this side
      c.set(5, b - 8, EB);
      if (u) {
        pullS(c, 10, b - 3, b - 1, 3, MAH, GILT);
        c.rect(3, b - 17, 4, b - 15, CHINA);
        c.set(3, b - 16, RED);
      }
    },
    u: [0, 3, 0], su: [0, 3, 4],
  });

  /* ---------- the way in ---------- */
  add('apoth-shop-door-bell', 'apothecary shop door bell glazed gilt lettering chemist entrance spring bell', {
    w: 20, h: 40, solid: true,
    f(c, u) {
      const b = c.h - 2;
      face(c, 1, 3, 18, b, MAH);
      c.row(2, 1, 18, L(MAH));
      if (!u) {
        face(c, 3, 6, 16, b, SHOPGREEN);
        pane(c, 5, 8, 14, 22, C.glass);
        dots(c, GILT, [6, 11, 7, 11, 8, 11, 10, 11, 11, 11, 12, 11, 13, 11, 7, 14, 8, 14, 9, 14, 11, 14, 12, 14]);
        c.row(17, 7, 12, GILT);
        panel(c, 5, 26, 14, b - 3, SHOPGREEN);
        c.rect(14, 23, 15, 24, BR);
        c.row(b, 3, 16, BR);
        c.row(5, 11, 14, C.iron); // the bell on its spring
        c.rect(14, 6, 16, 8, BR);
        c.set(15, 9, D(BR));
        c.set(14, 6, L(BR));
      } else {
        c.rect(3, 6, 16, b, C.night);
        c.rect(3, 6, 4, b, SHOPGREEN); // the door edge on, swung in
        c.col(3, 6, b, L(SHOPGREEN));
        c.set(5, 23, BR);
        dots(c, hex('#2b2630'), [8, 14, 9, 14, 12, 14, 13, 14, 8, 22, 9, 22, 10, 22, 13, 22]); // shelves in the dark
        dots(c, hex('#3a3440'), [8, 13, 12, 12, 13, 13, 9, 21, 13, 21]);
        c.row(b, 5, 16, mix(MAH, 0.5));
        c.line(11, 5, 13, 6, C.iron);
        c.rect(12, 7, 14, 9, BR); // the bell swinging
        c.set(12, 10, D(BR));
        dots(c, C.white, [10, 8, 16, 7, 16, 10]);
      }
    },
    sw: 8, sh: 40,
    s(c, u) {
      const b = c.h - 2;
      face(c, 2, 3, 4, b, MAH);
      c.row(2, 2, 4, L(MAH));
      c.set(5, 5, C.iron);
      if (!u) {
        c.rect(5, 6, 6, 8, BR);
        c.set(5, 6, L(BR));
        c.set(5, 23, BR);
      } else {
        face(c, 5, 6, 18, b, SHOPGREEN); // the door standing open
        pane(c, 7, 8, 16, 22, C.glass);
        dots(c, GILT, [8, 11, 9, 11, 10, 11, 12, 11, 13, 11, 14, 11, 9, 14, 10, 14, 11, 14, 13, 14]);
        panel(c, 7, 26, 16, b - 3, SHOPGREEN);
        c.rect(16, 23, 17, 24, BR);
        c.rect(6, 4, 7, 5, BR);
        dots(c, C.white, [9, 4, 5, 3]);
      }
    },
    sus: [20, 40],
  });

  add('apoth-ladder-rail-rolling', 'apothecary rolling ladder on a brass rail library steps shelves shop', {
    w: 14, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.row(2, 1, 12, BR);
      c.row(3, 1, 12, D(BR));
      for (const x of [3, 10]) {
        c.col(x, 1, 4, C.iron);
        c.col(x, 5, b - 1, OAK);
        c.set(x, b, C.ironDark);
      }
      c.col(3, 5, b - 1, L(OAK));
      for (let y = 8, k = 0; y < b - 2; y += 5, k++) {
        if (u && k === 4) {
          c.line(4, y, 5, y + 2, OAK); // a rung gone through
          c.line(9, y, 8, y + 1, OAK);
          continue;
        }
        c.row(y, 4, 9, OAK);
        c.row(y + 1, 4, 9, D(OAK));
      }
      if (u) {
        shards(c, 3, 11, b, CHINA, 6);
        dots(c, AMBER, [5, b, 6, b, 8, b]);
      }
    },
    sw: 13, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      c.rect(1, 2, 2, 3, BR);
      c.set(1, 2, L(BR));
      c.row(1, 2, 4, C.iron);
      c.col(4, 1, 4, C.iron);
      c.line(4, 5, 10, b - 1, OAK);
      c.rect(10, b, 11, b, C.ironDark);
      for (let y = 8, k = 0; y < b - 2; y += 5, k++) {
        const x = Math.round(4 + ((y - 5) * 6) / (b - 6));
        if (u && k === 4) {
          c.set(x - 1, y + 1, OAK);
          continue;
        }
        c.set(x + 1, y, D(OAK));
        c.set(x + 2, y, D(OAK));
      }
      if (u) {
        shards(c, 5, 9, b, CHINA, 6);
        dots(c, AMBER, [6, b, 8, b]);
      }
    },
  });

  add('apoth-sign-hanging-mortar', 'apothecary sign hanging mortar and pestle painted board iron bracket post shop sign', {
    w: 20, h: 44, solid: true,
    f(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 4, b, C.ironDark);
      c.col(3, 2, b, C.iron);
      c.rect(2, b - 1, 5, b, C.ironDark);
      c.set(3, 1, C.iron);
      c.row(4, 5, 17, C.iron);
      c.line(5, 10, 10, 5, C.ironDark);
      c.set(17, 5, C.iron);
      const boardAt = (pts, ox, oy) => {
        c.poly(pts, SHOPGREEN);
        // the mortar and pestle in gold
        c.rect(ox + 3, oy + 7, ox + 8, oy + 8, GILT);
        c.rect(ox + 4, oy + 9, ox + 7, oy + 10, GILT);
        c.row(oy + 11, ox + 3, ox + 8, D(GILT));
        c.line(ox + 8, oy + 3, ox + 6, oy + 6, GILT);
        c.set(ox + 9, oy + 2, GILT);
      };
      if (!u) {
        c.col(8, 5, 6, C.iron);
        c.col(15, 5, 6, C.iron);
        boardAt([[6, 7], [17, 7], [17, 21], [6, 21]], 6, 7);
        c.frame(6, 7, 17, 21, GILT);
        dots(c, GILT, [8, 19, 9, 19, 10, 19, 12, 19, 13, 19, 15, 19]);
      } else {
        c.col(8, 5, 6, C.iron);
        c.col(15, 5, 7, C.iron); // the broken chain
        boardAt([[8, 7], [19, 11], [14, 25], [3, 21]], 5, 9);
        c.line(8, 7, 19, 11, GILT);
        c.line(19, 11, 14, 25, GILT);
        c.line(14, 25, 3, 21, GILT);
        c.line(3, 21, 8, 7, GILT);
      }
    },
    sw: 8, sh: 44,
    s(c, u) {
      const b = c.h - 2;
      c.rect(3, 2, 4, b, C.ironDark);
      c.col(3, 2, b, C.iron);
      c.rect(2, b - 1, 5, b, C.ironDark);
      c.set(3, 1, C.iron);
      c.rect(2, 4, 5, 4, C.iron);
      c.col(4, 5, 6, C.iron);
      if (!u) {
        c.rect(3, 7, 4, 21, SHOPGREEN);
        c.col(3, 7, 21, L(SHOPGREEN));
        c.row(7, 3, 4, GILT);
        c.row(21, 3, 4, GILT);
      } else {
        c.line(4, 7, 5, 27, SHOPGREEN);
        c.line(3, 7, 4, 27, L(SHOPGREEN));
        c.set(4, 7, GILT);
        c.set(5, 27, GILT);
      }
    },
    u: [0, 0, 2],
  });
};
