/* Attic, part 1: the roof itself, and the big things put away under it. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, drawer, legs, body, sideBody, slab, eyes, arm, paper, glow, bricks, planks, cobweb, drape, candle, pool } = H;
  const att = setting('env-attic', 'Attic');
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    IN = hex('#17151c'),
    SKYN = hex('#2a3348'), // the night through a window
    PLY = hex('#a58a5c'),
    LEAD = hex('#6d7078'),
    KHAKI = hex('#7a7450'),
    ROSE = hex('#8a5560');

  /* ---------- roof truss ---------- */
  kid_truss();
  function kid_truss() {
    att(
      'roof-truss-cobwebs',
      'roof truss beams rafters king post cobwebs timber attic',
      false,
      (c, u) => {
        for (let t = 0; t < 3; t++) {
          c.line(0 + t, 37, 19 + t, 1, t ? W : WL);
          c.line(41 - t, 37, 22 - t, 1, t === 2 ? W : WD);
        }
        c.rect(11, 16, 30, 18, W); // the collar beam
        c.row(16, 11, 30, WL);
        c.row(18, 11, 30, WD);
        c.rect(20, 3, 21, 16, W); // king post
        c.col(20, 3, 16, WL);
        dots(c, C.iron, [13, 17, 28, 17, 20, 15]); // bolts
        if (u) {
          cobweb(c, 12, 19, 1, 1, 3, C.ash, true);
          c.col(25, 19, 21, C.iron); // a lantern hung here, and lit
          c.rect(23, 22, 27, 27, C.flameLight);
          c.frame(23, 22, 27, 27, C.iron);
          c.set(25, 25, C.flame);
          c.row(28, 23, 27, C.iron);
        } else {
          cobweb(c, 12, 19, 1, 1, 7, C.ash, true);
          cobweb(c, 29, 19, -1, 1, 6, C.ash, true);
          c.col(22, 19, 26, C.ash); // a spider on its thread
          c.rect(21, 27, 23, 28, K);
        }
        cobweb(c, 19, 15, -1, -1, 4, C.ash, true);
      },
      (c, u) => {
        c.rect(0, 1, 3, 37, W);
        c.col(0, 1, 37, WL);
        c.col(3, 1, 37, WD);
        c.rect(-3, 16, 6, 18, W); // the collar beam, end on, with its purlin
        c.row(16, -3, 6, WL);
        c.row(18, -3, 6, WD);
        dots(c, WD, [1, 8, 2, 25, 1, 31]);
        if (u) {
          c.col(5, 19, 21, C.iron);
          c.rect(3, 22, 7, 27, C.flameLight);
          c.frame(3, 22, 7, 27, C.iron);
          c.set(5, 25, C.flame);
          c.row(28, 3, 7, C.iron);
        } else {
          cobweb(c, 4, 19, 1, 1, 5, C.ash, true);
          c.col(-2, 19, 24, C.ash);
          c.rect(-3, 25, -1, 26, K);
        }
      },
    );
  }

  /* ---------- skylight ---------- */
  att(
    'skylight-roof-slope',
    'skylight roof window attic sloping roof light panes iron frame',
    true,
    (c, u) => {
      planks(c, 0, 0, 25, 31, WD, 5);
      c.row(0, 0, 25, W);
      c.rect(4, 5, 21, 24, u ? hex('#161c2c') : SKYN);
      if (u) {
        dots(c, C.white, [7, 9, 17, 13, 11, 19, 19, 21]); // open to the night
        c.rect(13, 14, 15, 16, C.bone);
        c.set(15, 14, hex('#161c2c'));
        c.poly([[3, 4], [22, 4], [20, -4], [5, -4]], C.glass); // the sash pushed up
        c.frame(5, -4, 20, -4, C.iron);
        c.line(3, 4, 5, -4, C.iron);
        c.line(22, 4, 20, -4, C.iron);
        c.line(8, -3, 7, 3, C.glassLight);
        c.col(12, 5, 12, C.iron); // the stay
      } else {
        c.col(12, 5, 24, C.iron);
        c.row(14, 4, 21, C.iron);
        c.line(6, 7, 10, 11, C.glass); // a dirty shine
        c.line(15, 17, 18, 20, C.glass);
        dots(c, C.moss, [5, 23, 6, 24, 20, 24]);
      }
      c.frame(3, 4, 22, 25, C.iron);
      c.row(25, 3, 22, C.ironDark);
      c.col(6, 26, 30, hex('#3a3026')); // a stain running down from it
      c.set(7, 27, hex('#3a3026'));
    },
    (c, u) => {
      // the slope from the side: the roof leans away to the left
      c.poly([[0, 31], [13, 0], [17, 0], [4, 31]], WD);
      c.line(0, 31, 13, 0, W);
      c.poly([[5, 24], [12, 6], [14, 6], [7, 24]], C.iron); // the window standing a little proud
      c.line(7, 23, 13, 7, SKYN);
      if (u) {
        c.line(13, 6, 23, 9, C.iron); // pushed open
        c.line(13, 7, 23, 10, C.glass);
        c.line(9, 16, 20, 9, C.ironDark);
      }
    },
  );

  /* ---------- dormer with a window seat ---------- */
  att(
    'dormer-window-seat',
    'dormer window seat alcove cushion attic window panes box seat',
    true,
    (c, u) => {
      c.poly([[0, 37], [0, 8], [4, 0], [25, 0], [29, 8], [29, 37]], hex('#8d8672')); // the alcove's plaster
      c.line(0, 8, 4, 0, L(hex('#8d8672')));
      c.rect(6, 3, 23, 22, SKYN); // the window
      c.frame(6, 3, 23, 22, C.white);
      c.col(14, 3, 22, C.white);
      c.col(15, 3, 22, D(C.white));
      c.row(9, 6, 23, C.white);
      c.row(16, 6, 23, C.white);
      c.set(19, 6, C.bone); // the moon
      c.set(20, 6, C.bone);
      c.rect(5, 23, 24, 23, D(C.white));
      body(c, 1, 27, 28, 37, W); // the seat box
      panel(c, 3, 29, 13, 35, W);
      panel(c, 16, 29, 26, 35, W);
      if (u) {
        c.rect(2, 25, 27, 27, IN); // the lid lifted: something small is kept in there
        c.rect(2, 13, 27, 24, WD); // its underside, stood against the window
        c.frame(2, 13, 27, 24, W);
        c.rect(2, 11, 27, 12, ROSE);
        c.row(11, 2, 27, L(ROSE));
        c.rect(8, 25, 13, 26, C.bone);
        c.set(14, 26, C.bone);
        c.rect(17, 26, 20, 26, hex('#7a3a34'));
      } else {
        c.rect(2, 24, 27, 26, ROSE); // the cushion
        c.row(24, 2, 27, L(ROSE));
        dots(c, D(ROSE), [7, 25, 14, 25, 21, 25]);
      }
    },
    (c, u) => {
      c.rect(0, 0, 3, 37, hex('#8d8672'));
      c.col(0, 0, 37, L(hex('#8d8672')));
      c.col(4, 3, 22, C.white); // the window edge on
      c.col(5, 23, 23, D(C.white));
      sideBody(c, 4, 27, 13, 37, W);
      if (u) {
        c.line(5, 26, 8, 13, W);
        c.line(6, 26, 9, 13, WD);
        c.line(4, 26, 7, 13, ROSE);
        c.row(26, 6, 13, IN);
      } else {
        c.rect(4, 24, 13, 26, ROSE);
        c.row(24, 4, 13, L(ROSE));
      }
    },
  );

  /* ---------- the cistern ---------- */
  function rivets(c, x0, x1, y) {
    for (let x = x0; x <= x1; x += 3) c.set(x, y, D(LEAD));
  }
  att(
    'cistern-attic-open-top',
    'cistern cold water tank attic galvanised riveted pipes ball valve',
    true,
    (c, u) => {
      body(c, 2, 4, 27, 18, LEAD);
      rivets(c, 3, 26, 6);
      rivets(c, 3, 26, 16);
      c.col(14, 5, 17, D(LEAD));
      c.col(15, 5, 17, L(LEAD));
      c.rect(0, 19, 29, 20, W); // bearers
      c.row(19, 0, 29, WL);
      legs(c, [2, 26], 21, 21, WD);
      c.rect(28, 8, 31, 9, C.rust); // the overflow
      c.col(31, 9, 21, C.rust);
      dots(c, hex('#4d6b62'), [6, 12, 6, 13, 7, 14, 21, 10, 21, 11]); // green weeping at the seams
      if (u) {
        c.rect(3, 3, 26, 4, hex('#0f1a22')); // the boards off: black water, and someone's hand on the rim
        c.row(3, 5, 12, C.water);
        c.poly([[-4, 21], [-1, 2], [1, 2], [-1, 21]], W);
        arm(c, 20, 6, 20, 3, C.bone);
        c.col(22, 5, 9, C.water);
        c.col(18, 5, 7, C.water);
      } else {
        c.rect(1, 2, 28, 3, W); // the lid boards
        c.row(2, 1, 28, WL);
        dots(c, WD, [8, 3, 15, 3, 22, 3]);
      }
    },
    (c, u) => {
      body(c, 1, 4, 16, 18, LEAD);
      rivets(c, 2, 15, 6);
      rivets(c, 2, 15, 16);
      c.rect(0, 19, 17, 20, W);
      c.row(19, 0, 17, WL);
      legs(c, [1, 15], 21, 21, WD);
      c.col(8, -4, 3, C.rust); // the rising main
      c.rect(8, -4, 12, -3, C.rust);
      if (u) {
        c.rect(2, 3, 15, 4, hex('#0f1a22'));
        arm(c, 10, 6, 10, 3, C.bone);
        c.col(12, 5, 9, C.water);
      } else {
        c.rect(0, 2, 17, 3, W);
        c.row(2, 0, 17, WL);
      }
    },
  );

  /* ---------- chimney breast ---------- */
  att(
    'chimney-breast-attic',
    'chimney breast brick stack attic flue soot door',
    true,
    (c, u) => {
      bricks(c, 3, 0, 18, 20, hex('#7a4a3a'), 3);
      bricks(c, 0, 21, 21, 47, hex('#7a4a3a'), 5);
      c.row(21, 0, 21, hex('#5a3428'));
      c.col(0, 21, 47, L(hex('#7a4a3a')));
      c.poly([[8, 0], [13, 0], [12, 14], [9, 14]], hex('#3a2a28')); // soot staining
      c.dither(7, 14, 14, 26, hex('#3a2a28'));
      if (u) {
        c.rect(6, 34, 14, 42, IN); // the soot door open: something was pushed up the flue
        c.rect(8, 39, 12, 42, hex('#6a6048'));
        c.row(39, 8, 12, hex('#8a8062'));
        c.set(10, 40, C.blood);
        slab(c, 15, 34, 42, 4, C.iron);
        c.rect(3, 46, 16, 47, hex('#22201f')); // soot on the floor
        c.row(45, 6, 12, hex('#22201f'));
      } else {
        body(c, 6, 34, 14, 42, C.iron);
        c.set(13, 38, C.rust);
        dots(c, C.rust, [7, 35, 7, 41]);
      }
    },
    (c, u) => {
      bricks(c, 2, 0, 9, 20, hex('#7a4a3a'), 4);
      bricks(c, 0, 21, 11, 47, hex('#7a4a3a'), 6);
      c.row(21, 0, 11, hex('#5a3428'));
      c.col(0, 21, 47, L(hex('#7a4a3a')));
      c.col(11, 21, 47, D(hex('#7a4a3a')));
      if (u) {
        slab(c, 12, 34, 42, 8, C.iron);
        c.col(11, 35, 41, IN);
        c.rect(12, 46, 19, 47, hex('#22201f'));
      } else c.col(11, 34, 42, C.iron);
    },
  );

  /* ---------- rolls of insulation ---------- */
  const WOOL = hex('#b59a52'),
    WRAP = hex('#8f8a78');
  function roll(c, x, b) {
    // standing on end, 8 wide, 17 tall
    c.rect(x, b - 15, x + 7, b, WOOL);
    c.oval(x, b - 17, x + 7, b - 13, L(WOOL));
    c.set(x + 3, b - 15, D(WOOL));
    c.set(x + 4, b - 15, D(WOOL));
    c.rect(x, b - 10, x + 7, b - 5, WRAP);
    c.col(x, b - 10, b - 5, L(WRAP));
    c.speckle(x, b - 15, x + 7, b, D(WOOL), 6, x);
  }
  att(
    'insulation-rolls',
    'insulation rolls glass wool loft lagging yellow',
    true,
    (c, u) => {
      roll(c, 0, 19);
      roll(c, 9, 19);
      if (u) {
        c.rect(18, 16, 38, 19, WOOL); // one rolled out, and slept in
        c.row(16, 18, 38, L(WOOL));
        c.speckle(18, 16, 38, 19, D(WOOL), 5, 2);
        c.oval(24, 15, 33, 18, D(WOOL));
        c.rect(26, 16, 31, 17, mix(WOOL, 0.5));
        c.oval(37, 13, 42, 19, WOOL);
        c.set(39, 16, D(WOOL));
      } else {
        c.oval(18, 12, 25, 19, L(WOOL)); // one lying, end on
        c.oval(20, 14, 23, 17, WOOL);
        c.set(21, 15, D(WOOL));
        c.set(22, 16, D(WOOL));
      }
    },
    (c, u) => {
      roll(c, 0, 19);
      if (u) {
        c.rect(9, 16, 20, 19, WOOL);
        c.row(16, 9, 20, L(WOOL));
        c.oval(11, 15, 18, 18, D(WOOL));
      } else {
        c.rect(9, 12, 20, 19, WOOL); // the lying one from the side
        c.row(12, 9, 20, L(WOOL));
        c.rect(12, 12, 16, 19, WRAP);
        c.speckle(9, 12, 20, 19, D(WOOL), 6, 3);
      }
    },
  );

  /* ---------- tea chests ---------- */
  function teaChest(c, x, y, w, open) {
    body(c, x, y, x + w - 1, y + 13, PLY);
    c.frame(x, y, x + w - 1, y + 13, C.steel);
    c.col(x, y, y + 13, L(C.steel));
    dots(c, D(C.steel), [x, y + 4, x, y + 9, x + w - 1, y + 4, x + w - 1, y + 9]);
    if (w > 9) {
      c.rect(x + 3, y + 4, x + 7, y + 4, hex('#4a3a2c')); // a stencil
      c.rect(x + 3, y + 6, x + 9, y + 6, hex('#4a3a2c'));
      c.rect(x + 4, y + 9, x + 6, y + 10, hex('#7a3a34'));
    }
    if (open) {
      c.row(y, x + 1, x + w - 2, IN);
      for (let i = x + 1; i < x + w - 1; i += 2) c.set(i, y - 1 - (i % 3 === 0 ? 1 : 0), C.straw), c.set(i, y, C.straw);
    }
  }
  att(
    'tea-chests-stacked',
    'tea chests stacked plywood boxes packing crates metal edges attic',
    true,
    (c, u) => {
      teaChest(c, 0, 14, 13);
      teaChest(c, 13, 14, 13);
      teaChest(c, 5, 0, 13, u);
      if (u) {
        c.poly([[27, 27], [29, 13], [31, 13], [29, 27]], PLY); // the lid prised off
        c.rect(9, -3, 12, -1, C.white); // a cup in the straw
        c.set(13, -2, C.white);
        c.set(10, -2, hex('#4a6480'));
      }
    },
    (c, u) => {
      teaChest(c, 0, 14, 12);
      teaChest(c, 0, 0, 12, u);
      if (u) {
        c.poly([[13, 27], [15, 13], [17, 13], [15, 27]], PLY);
        c.rect(4, -3, 7, -1, C.white);
      }
    },
  );

  /* ---------- the steamer trunk ---------- */
  const HIDE = hex('#5d4030');
  att(
    'trunk-steamer-labels',
    'steamer trunk wardrobe trunk upright travel labels brass corners',
    true,
    (c, u) => {
      const half = (x0, x1) => {
        body(c, x0, 0, x1, 33, HIDE);
        for (const y of [5, 16, 27]) c.rect(x0, y, x1, y + 1, WL), c.row(y + 1, x0, x1, W);
        for (const [x, y] of [[x0, 0], [x1 - 1, 0], [x0, 32], [x1 - 1, 32]]) c.rect(x, y, x + 1, y + 1, C.brass);
      };
      if (u) {
        half(0, 13); // opened like a book
        half(14, 27);
        c.rect(1, 2, 12, 31, IN);
        c.row(3, 1, 12, C.steel);
        c.rect(2, 4, 4, 18, hex('#3d4a5c')); // what was never unpacked
        c.rect(5, 4, 7, 22, C.wine);
        c.rect(8, 4, 11, 15, C.bone);
        c.rect(3, 27, 9, 30, hex('#3a2c22')); // shoes
        c.rect(15, 2, 26, 31, hex('#40302a'));
        for (let i = 0; i < 4; i++) drawer(c, 16, 3 + i * 7, 25, 8 + i * 7, hex('#7a6248'), C.brass);
      } else {
        half(0, 19);
        c.col(10, 0, 33, D(HIDE));
        c.rect(9, 14, 11, 18, C.brass); // the lock
        c.set(10, 17, K);
        c.rect(2, 8, 7, 12, hex('#9a6a3a')); // labels
        c.rect(3, 9, 6, 10, C.bone);
        c.rect(13, 20, 17, 25, hex('#4a6480'));
        c.rect(14, 22, 16, 23, C.bone);
        c.oval(12, 7, 17, 12, hex('#7a3a34'));
        c.set(14, 9, C.bone);
        c.rect(3, 21, 7, 24, hex('#5f7f56'));
      }
    },
    (c, u) => {
      const one = (x0) => {
        sideBody(c, x0, 0, x0 + 9, 33, HIDE);
        for (const y of [5, 16, 27]) c.rect(x0, y, x0 + 9, y + 1, WL), c.row(y + 1, x0, x0 + 9, W);
        c.rect(x0, 0, x0 + 1, 1, C.brass);
        c.rect(x0 + 8, 32, x0 + 9, 33, C.brass);
      };
      one(0);
      c.rect(4, -2, 6, -1, hex('#3a2c22')); // the handle on top
      if (u) {
        slab(c, 10, 0, 33, 8, hex('#7a6248'));
        c.rect(10, 0, 17, 1, HIDE);
        c.rect(12, 14, 15, 16, C.brass);
      }
    },
  );

  /* ---------- a wardrobe of old uniforms ---------- */
  att(
    'wardrobe-uniforms',
    'wardrobe old uniforms army navy tunic medals moth balls dark wood',
    true,
    (c, u) => {
      body(c, 1, 2, 24, 37, W);
      c.rect(0, 0, 25, 2, W);
      c.row(0, 0, 25, WL);
      c.row(2, 0, 25, WD);
      c.rect(1, 38, 24, 39, WD);
      if (u) {
        c.rect(3, 4, 22, 35, IN);
        c.row(6, 3, 22, C.brass);
        c.rect(4, 8, 9, 24, KHAKI); // a khaki tunic
        c.col(6, 9, 23, D(KHAKI));
        dots(c, C.brass, [7, 11, 7, 14, 7, 17, 7, 20]);
        dots(c, C.red, [5, 12]);
        c.rect(10, 8, 15, 26, C.navy); // navy, with braid
        c.col(13, 9, 25, D(C.navy));
        c.row(23, 10, 15, C.gold);
        c.row(21, 10, 15, C.gold);
        c.rect(17, 7, 19, 7, C.steel); // an empty hanger, still swinging
        c.line(17, 8, 16, 10, C.steel);
        c.line(19, 8, 21, 10, C.steel);
        c.rect(5, 32, 9, 35, hex('#2a2422')); // boots
        c.rect(12, 33, 16, 35, hex('#2a2422'));
        slab(c, -5, 4, 36, 6, W);
        slab(c, 25, 4, 36, 6, W);
      } else {
        panel(c, 3, 5, 12, 35, W);
        panel(c, 14, 5, 23, 35, W);
        c.col(13, 4, 36, WD);
        c.set(12, 20, C.brass);
        c.set(14, 20, C.brass);
        c.rect(13, 24, 14, 30, KHAKI); // a sleeve shut in the door
        c.set(13, 31, C.brass);
        cobweb(c, 2, 3, 1, 1, 4);
      }
    },
    (c, u) => {
      sideBody(c, 1, 2, 10, 37, W);
      c.rect(0, 0, 11, 2, W);
      c.row(0, 0, 11, WL);
      c.row(2, 0, 11, WD);
      c.rect(1, 38, 10, 39, WD);
      panel(c, 3, 6, 8, 34, W);
      if (u) {
        slab(c, 11, 4, 36, 9, W);
        c.col(10, 5, 35, IN);
        c.rect(11, 9, 13, 22, KHAKI);
      } else c.rect(10, 24, 11, 30, KHAKI);
    },
  );

  /* ---------- the wedding dress in its bag ---------- */
  att(
    'wedding-dress-bag',
    'wedding dress hanging garment bag rail old yellowed gown',
    true,
    (c, u) => {
      const BAG = hex('#7d8288'),
        DRESS = hex('#cfc6a4');
      c.rect(0, 0, 17, 0, C.steel); // the rail
      c.col(0, 0, 39, C.steel);
      c.col(17, 0, 39, D(C.steel));
      c.rect(-1, 39, 1, 39, C.ironDark);
      c.rect(16, 39, 18, 39, C.ironDark);
      c.col(9, 1, 2, C.steel);
      if (u) {
        c.poly([[6, 4], [11, 4], [13, 14], [15, 33], [3, 33], [4, 14]], DRESS); // out of its bag
        c.line(6, 4, 4, 14, L(DRESS));
        c.row(13, 5, 12, D(DRESS));
        c.line(7, 15, 6, 32, D(DRESS));
        c.line(11, 15, 12, 32, D(DRESS));
        dots(c, C.white, [4, 33, 6, 33, 8, 33, 10, 33, 12, 33, 14, 33]);
        c.oval(7, 20, 12, 28, hex('#6a3a2c')); // and the stain on it
        c.dither(6, 22, 13, 30, hex('#6a3a2c'));
        c.rect(2, 37, 14, 39, BAG); // the bag in a heap
        c.row(37, 4, 12, L(BAG));
      } else {
        c.poly([[5, 3], [12, 3], [14, 8], [14, 35], [3, 35], [3, 8]], BAG);
        c.line(5, 3, 3, 8, L(BAG));
        c.col(9, 4, 34, D(BAG)); // the zip
        c.poly([[7, 6], [10, 6], [11, 14], [12, 32], [5, 32], [6, 14]], blend(BAG, DRESS, 0.45)); // the dress showing through
        c.col(9, 6, 32, D(BAG));
        c.set(9, 5, C.brass);
      }
    },
    (c, u) => {
      const BAG = hex('#7d8288'),
        DRESS = hex('#cfc6a4');
      c.col(3, 0, 39, C.steel);
      c.rect(1, 39, 6, 39, C.ironDark);
      if (u) {
        c.poly([[2, 4], [5, 4], [7, 14], [9, 33], [1, 33], [1, 14]], DRESS);
        c.row(13, 2, 6, D(DRESS));
        c.oval(4, 20, 8, 28, hex('#6a3a2c'));
        c.rect(5, 37, 11, 39, BAG);
      } else {
        c.poly([[2, 3], [5, 3], [7, 8], [7, 35], [0, 35], [0, 8]], BAG);
        c.col(0, 8, 35, L(BAG));
        c.col(5, 9, 33, blend(BAG, DRESS, 0.45));
      }
    },
  );

  /* ---------- the christening gown in its box ---------- */
  att(
    'christening-gown-box',
    'christening gown box baby robe tissue paper lace keepsake',
    false,
    (c, u) => {
      const BOX = hex('#9a8f78');
      body(c, 0, 3, 19, 8, BOX);
      if (u) {
        c.rect(1, 1, 18, 3, C.white); // tissue, and the tiny gown
        c.poly([[6, 2], [9, -1], [12, 2], [14, 3], [4, 3]], hex('#ddd6bf'));
        dots(c, D(C.white), [3, 2, 16, 2, 8, 2, 11, 2]);
        c.rect(9, -2, 9, -1, hex('#ddd6bf'));
        c.poly([[21, 8], [23, 1], [25, 1], [23, 8]], BOX); // the lid stood beside it
        c.line(23, 1, 21, 8, L(BOX));
      } else {
        body(c, -1, 1, 20, 4, BOX);
        c.col(9, 1, 8, ROSE); // a ribbon round it
        c.col(10, 1, 8, D(ROSE));
        c.rect(8, 0, 11, 0, ROSE);
        c.rect(3, 6, 6, 6, hex('#5a5040')); // a name in pencil
      }
    },
    (c, u) => {
      const BOX = hex('#9a8f78');
      sideBody(c, 0, 3, 11, 8, BOX);
      if (u) {
        c.rect(1, 1, 10, 3, C.white);
        c.poly([[4, 2], [6, -1], [8, 2]], hex('#ddd6bf'));
      } else {
        body(c, -1, 1, 12, 4, BOX);
        c.col(5, 1, 8, ROSE);
        c.rect(4, 0, 6, 0, ROSE);
      }
    },
  );

  /* ---------- portraits turned to the wall ---------- */
  att(
    'portraits-facing-wall',
    'portraits paintings stacked turned to the wall canvas backs frames',
    true,
    (c, u) => {
      const CAN = hex('#8f8468'),
        GILT = C.brass;
      const back = (x0, y0, x1, y1) => {
        c.rect(x0, y0, x1, y1, CAN);
        c.frame(x0, y0, x1, y1, W);
        c.col(x0, y0, y1, WL);
        c.row((y0 + y1) >> 1, x0, x1, W);
        c.col((x0 + x1) >> 1, y0, y1, W);
        c.speckle(x0 + 1, y0 + 1, x1 - 1, y1 - 1, D(CAN), 9, x0);
      };
      back(8, 0, 29, 31);
      back(0, 8, 17, 31);
      if (u) {
        c.rect(12, 12, 29, 31, GILT); // one turned round: her face has been scraped away
        c.frame(12, 12, 29, 31, L(GILT));
        c.rect(14, 14, 27, 29, hex('#2c2a26'));
        c.rect(18, 22, 23, 29, C.wine);
        c.rect(19, 17, 22, 21, C.flesh);
        c.rect(19, 15, 22, 16, hex('#3a2a20'));
        c.line(18, 17, 23, 21, C.bone);
        c.line(23, 17, 18, 21, C.bone);
        c.line(19, 19, 22, 19, C.bone);
      } else {
        back(12, 12, 29, 31);
        c.rect(15, 15, 19, 17, C.paper); // a label
      }
    },
    (c, u) => {
      for (let i = 0; i < 3; i++) {
        c.line(0 + i * 3, 31, 6 + i * 2, [0, 8, 12][i], W);
        c.line(1 + i * 3, 31, 7 + i * 2, [0, 8, 12][i], i === 2 ? (u ? C.brass : hex('#8f8468')) : hex('#8f8468'));
        c.line(2 + i * 3, 31, 8 + i * 2, [0, 8, 12][i], WD);
      }
    },
  );
};
