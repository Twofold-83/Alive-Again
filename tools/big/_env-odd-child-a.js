/* Child's room, part 1: beds, cot, and the big toys. */
module.exports = (H) => {
  const { C, K, hex, mix, blend, D, L, rnd, setting, dots, panel, drawer, legs, body, sideBody, slab, books, shelves, eyes, arm, wheel, paper, glow, figure } = H;
  const { bedSide, pillowSide, duvetSide, bedFront, pillowFront, duvetFront, table } = H;
  const kid = setting('env-childroom', "Child's room");
  const PINE = hex('#b08e5e'),
    RED = hex('#a04a3c'),
    BLUE = hex('#4a6480'),
    YEL = hex('#b89a4a'),
    GRN = hex('#5f7f56'),
    PINK = hex('#a8697a'),
    SKY = hex('#7f9aa8'),
    PAINT = hex('#d2cdbd'), // white-painted wood
    IN = hex('#1a1820'), // the dark inside of things
    NAVY = C.navy;

  /* ---------- the bed with the rocket duvet ---------- */
  const rocketsH = (c) => (x0, y0, x1) => {
    for (let x = x0 + 2; x < x1 - 4; x += 8) {
      c.row(y0 + 1, x, x + 2, C.bone);
      c.set(x + 3, y0 + 1, RED);
      c.set(x - 1, y0 + 1, C.flame);
      c.set(x + 5, y0, YEL);
      c.set(x + 1, y0 + 2, YEL);
    }
  };
  const rocketsV = (c) => (x0, y0, x1, y1) => {
    for (let y = y0 + 1, i = 0; y < y1 - 4; y += 6, i++) {
      const x = x0 + (i % 2 ? 10 : 3);
      c.col(x, y + 1, y + 3, C.bone);
      c.set(x, y, RED);
      c.set(x - 1, y + 3, RED);
      c.set(x + 1, y + 3, RED);
      c.set(x, y + 4, C.flame);
      c.set(x0 + (i % 2 ? 3 : 11), y + 2, YEL);
      c.set(x0 + (i % 2 ? 6 : 7), y + 5, YEL);
    }
  };
  kid(
    'bed-rocket-duvet',
    'child bed rocket duvet space stars navy blue pine single',
    true,
    (c, u) => {
      const g = bedSide(c, 0, 35, 19, { frame: PINE });
      pillowSide(c, g);
      duvetSide(c, g, NAVY, u, rocketsH(c));
      if (u) dots(c, C.earth, [12, g.my, 14, g.my + 1, 16, g.my]); // muddy marks where it lay
    },
    (c, u) => {
      const g = bedFront(c, 0, 17, 0, 33, { frame: PINE });
      pillowFront(c, g);
      duvetFront(c, g, NAVY, u, rocketsV(c));
      if (u) dots(c, C.earth, [3, g.sy + 9, 4, g.sy + 11, 6, g.sy + 8]);
      g.foot();
    },
    { base: 'side' },
  );

  /* ---------- the bed with a tent over its head ---------- */
  const TENT = hex('#9a4f40'),
    TENT2 = hex('#c4b592');
  kid(
    'bed-tent-canopy',
    'child bed tent canopy den striped red hideout single',
    true,
    (c, u) => {
      const g = bedSide(c, 0, 37, 19, { frame: PAINT, head: 12, foot: 9 });
      pillowSide(c, g);
      duvetSide(c, g, GRN, false);
      // the tent: over the head half of the bed
      c.poly([[-1, g.my - 1], [-1, -4], [9, -11], [19, -4], [19, g.my - 1]], TENT);
      for (let x = 1; x < 19; x += 4) for (let y = -11; y < g.my; y++) if (c.get(x, y) === TENT) c.set(x, y, TENT2), c.get(x + 1, y) === TENT && c.set(x + 1, y, TENT2);
      c.line(-1, -4, 9, -11, L(TENT));
      c.line(9, -11, 19, -4, D(TENT));
      c.row(-3, -1, 19, D(TENT));
      c.set(9, -12, C.gold); // the pennant
      c.set(10, -13, RED);
      c.set(9, -13, C.gold);
      if (u) {
        // the side rolled up: dark inside, and somebody is in there
        c.rect(3, 0, 15, g.my - 2, IN);
        c.row(-1, 3, 15, TENT2);
        c.row(0, 3, 15, D(TENT2));
        eyes(c, 8, 4, 3);
      } else {
        c.rect(6, 1, 12, 5, D(TENT)); // a little window flap, shut
        c.row(1, 6, 12, TENT2);
      }
    },
    (c, u) => {
      const g = bedFront(c, 0, 17, 0, 33, { frame: PAINT, head: 12, foot: 9 });
      pillowFront(c, g);
      duvetFront(c, g, GRN, false);
      // the tent seen through its mouth
      const ty = g.sy + 9;
      c.poly([[-1, ty], [-1, -3], [8, -10], [9, -10], [18, -3], [18, ty]], TENT);
      for (let x = 1; x < 18; x += 4) for (let y = -10; y <= ty; y++) if (c.get(x, y) === TENT) c.set(x, y, TENT2), c.get(x + 1, y) === TENT && c.set(x + 1, y, TENT2);
      c.line(-1, -3, 8, -10, L(TENT));
      c.set(8, -11, C.gold);
      c.set(9, -12, RED);
      c.set(8, -12, C.gold);
      if (u) {
        c.poly([[3, ty], [3, 0], [8, -5], [9, -5], [14, 0], [14, ty]], IN);
        c.rect(5, ty - 2, 12, ty, D(C.white)); // the pillow, far in
        eyes(c, 7, 2, 3);
        c.line(3, 0, 1, ty, D(TENT)); // the flaps tied back
        c.line(14, 0, 16, ty, D(TENT));
      } else {
        c.line(8, -5, 8, ty, D(TENT)); // the flaps shut
        c.line(9, -5, 9, ty, mix(TENT, 0.5));
        dots(c, C.gold, [8, 1, 8, 5]);
      }
      g.foot();
    },
    { base: 'side' },
  );

  /* ---------- the cot with a mobile ---------- */
  function mobile(c, x, y, swing) {
    // x, y: the tip of the arm; three things on threads
    const things = [
      [-4, 3, YEL],
      [0, 5, SKY],
      [4, 3, PINK],
    ];
    c.row(y, x - 4, x + 4, C.ironDark);
    for (const [dx, n, col] of things) {
      const sx = swing ? (dx <= 0 ? 1 : 2) : 0;
      c.line(x + dx, y + 1, x + dx + sx, y + n, C.ash);
      c.rect(x + dx + sx - 1, y + n + 1, x + dx + sx, y + n + 2, col);
      c.set(x + dx + sx, y + n + 1, L(col));
    }
  }
  kid(
    'cot-mobile',
    'cot crib baby bed bars white mobile hanging stars nursery',
    true,
    (c, u) => {
      const b = 21,
        drop = u ? 6 : 0;
      c.rect(2, 12, 29, 14, C.cream); // mattress
      c.row(12, 2, 29, L(C.cream));
      c.rect(11, 11, 27, 12, u ? C.cream : SKY); // blanket
      if (!u) c.row(11, 11, 27, L(SKY));
      c.rect(3, 10, 8, 11, C.white); // pillow
      // the near rail and its bars (dropped when used)
      for (let x = 4; x < 29; x += 3) c.col(x, 3 + drop, 15, PAINT);
      c.row(3 + drop, 2, 29, L(PAINT));
      c.row(4 + drop, 2, 29, PAINT);
      c.rect(2, 15, 29, 16, PAINT);
      c.row(16, 2, 29, D(PAINT));
      c.rect(0, 1, 1, b, PAINT); // head post
      c.col(0, 1, b, L(PAINT));
      c.rect(30, 1, 31, b, PAINT);
      if (u) {
        c.rect(22, 9, 28, 14, SKY); // the blanket dragged over the rail
        c.rect(24, 15, 28, 19, SKY);
        c.col(26, 10, 19, D(SKY));
        c.row(9, 22, 28, L(SKY));
        dots(c, D(C.cream), [13, 12, 14, 12, 16, 13]);
      }
      c.col(1, -11, 0, C.ironDark); // the mobile's arm
      c.line(1, -11, 4, -13, C.ironDark);
      c.row(-13, 4, 10, C.ironDark);
      mobile(c, 10, -12, u);
    },
    (c, u) => {
      const b = 21;
      c.rect(0, 1, 17, 16, PAINT); // the end board
      c.row(1, 0, 17, L(PAINT));
      c.col(0, 1, b, L(PAINT));
      panel(c, 3, 4, 14, 13, PAINT);
      dots(c, D(PAINT), [8, 7, 9, 7, 7, 8, 10, 8, 8, 9, 9, 9]); // a cut-out heart
      c.rect(0, 17, 1, b, PAINT);
      c.rect(16, 17, 17, b, PAINT);
      c.col(8, -12, 0, C.ironDark);
      mobile(c, 8, -12, u);
      if (u) {
        c.rect(10, 0, 15, 8, SKY); // the blanket hanging over the end
        c.row(0, 10, 15, L(SKY));
        c.col(12, 2, 8, D(SKY));
        c.clear(10, 8);
        c.clear(13, 8);
      }
    },
    { base: 'side' },
  );

  /* ---------- changing table ---------- */
  kid(
    'changing-table',
    'changing table baby nappies mat shelves white nursery',
    true,
    (c, u) => {
      body(c, 0, 4, 23, 19, PAINT);
      c.rect(0, 1, 23, 3, PAINT); // the raised rim
      c.row(1, 0, 23, L(PAINT));
      c.rect(2, 0, 21, 2, SKY); // the mat
      c.row(0, 2, 21, L(SKY));
      c.rect(2, 11, 21, 17, mix(PAINT, 0.45)); // open shelf
      c.rect(3, 13, 8, 17, C.white); // nappies
      c.row(15, 3, 8, D(C.white));
      c.rect(10, 12, 15, 17, C.straw); // a basket
      c.dither(10, 13, 15, 17, D(C.straw));
      c.rect(17, 14, 19, 17, PINK); // a bottle of lotion
      c.set(18, 13, C.white);
      if (u) {
        c.rect(1, 6, 22, 11, IN); // the drawer pulled out
        drawer(c, 0, 8, 23, 12, PAINT, PINK);
        c.rect(3, 6, 9, 7, C.white);
        c.rect(12, 6, 18, 7, SKY);
        c.rect(8, -2, 13, -1, C.white); // a nappy left on the mat
        c.set(10, -1, D(C.white));
        c.rect(17, -3, 18, -1, PINK); // powder, tipped
        dots(c, C.white, [15, -1, 16, -1, 14, -1]);
      } else drawer(c, 1, 5, 22, 9, PAINT, PINK);
      legs(c, [0, 22], 20, 21, D(PAINT));
    },
    (c, u) => {
      sideBody(c, 0, 4, 10, 19, PAINT);
      c.rect(0, 1, 10, 3, PAINT);
      c.row(1, 0, 10, L(PAINT));
      c.row(0, 1, 9, SKY);
      if (u) {
        slab(c, 11, 5, 9, 5, PAINT); // the drawer
        c.row(5, 11, 14, C.white);
        c.rect(4, -2, 7, -1, C.white);
        c.rect(8, -3, 9, -1, PINK);
      }
      legs(c, [0, 9], 20, 21, D(PAINT));
    },
  );

  /* ---------- the shelf of cubes with toys ---------- */
  function toy(c, i, x, b) {
    // a toy standing on b in a cube whose left edge is x (6 wide)
    if (i === 0) c.oval(x + 1, b - 3, x + 4, b, RED), c.set(x + 2, b - 2, L(RED));
    else if (i === 1) c.rect(x, b - 2, x + 2, b, YEL), c.rect(x + 3, b - 2, x + 5, b, BLUE), c.rect(x + 1, b - 5, x + 3, b - 3, GRN);
    else if (i === 2) c.rect(x + 1, b - 4, x + 4, b, C.steel), c.set(x + 2, b - 3, RED), c.set(x + 3, b - 3, RED), c.row(b - 5, x + 2, x + 3, C.steel);
    else if (i === 3) c.rect(x, b - 3, x + 5, b, PINK), c.row(b - 3, x, x + 5, L(PINK)), c.set(x + 2, b - 1, D(PINK)), c.set(x + 3, b - 1, D(PINK));
    else if (i === 4) books(c, x, x + 5, b, 5, 7 + x);
    else if (i === 5) c.rect(x, b - 1, x + 4, b, BLUE), c.rect(x + 1, b - 2, x + 3, b - 2, BLUE), c.set(x + 1, b, K), c.set(x + 4, b, K);
    else if (i === 6) c.rect(x, b - 3, x + 5, b, GRN), c.row(b - 3, x, x + 5, L(GRN)), c.set(x + 2, b - 1, D(GRN)), c.set(x + 3, b - 1, D(GRN));
    else if (i === 7) c.rect(x + 1, b - 3, x + 4, b, C.straw), c.row(b - 4, x, x + 5, D(C.straw)), c.line(x + 1, b - 5, x + 4, b - 5, RED);
  }
  kid(
    'toy-shelf-cubes',
    'toy shelf cubes storage white boxes toys ball blocks robot',
    true,
    (c, u) => {
      shelves(c, 0, 0, 7, 23, PAINT, 3, (i, x0, t, x1, b) => (!u || i !== 1) && toy(c, [0, 3, 4][i], x0, b));
      shelves(c, 8, 0, 15, 23, PAINT, 3, (i, x0, t, x1, b) => (!u || i !== 2) && toy(c, [1, 2, 6][i], x0, b));
      shelves(c, 16, 0, 23, 23, PAINT, 3, (i, x0, t, x1, b) => (!u || i > 1) && toy(c, [7, 5, 4][i], x0, b));
      c.col(8, 0, 23, PAINT);
      c.col(16, 0, 23, PAINT);
      if (u) {
        // toys pulled out onto the floor
        c.rect(25, 20, 30, 23, PINK);
        c.row(20, 25, 30, L(PINK));
        c.line(26, 21, 29, 19, D(PINK));
        c.rect(-6, 22, -2, 23, BLUE);
        c.row(21, -5, -3, BLUE);
        c.set(-5, 23, K);
        c.set(-2, 23, K);
        c.rect(31, 22, 33, 23, C.steel);
        c.set(32, 22, RED);
      }
    },
    (c, u) => {
      sideBody(c, 0, 0, 8, 23, PAINT);
      c.row(8, 1, 7, D(PAINT));
      c.row(16, 1, 7, D(PAINT));
      if (u) {
        c.rect(11, 20, 16, 23, PINK);
        c.row(20, 11, 16, L(PINK));
        c.rect(18, 22, 20, 23, C.steel);
        c.set(19, 22, RED);
      }
    },
  );

  /* ---------- picture books, face out ---------- */
  const COVERS = [RED, SKY, YEL, GRN, PINK, BLUE, C.plum, hex('#b87a3a')];
  kid(
    'bookcase-picture-books',
    'picture books display bookcase low child story books rack',
    true,
    (c, u) => {
      body(c, 0, 0, 23, 19, PINE);
      for (let r = 0; r < 3; r++) {
        const y = 1 + r * 6;
        c.rect(1, y, 22, y + 5, mix(PINE, 0.5));
        for (let i = 0; i < 4; i++) {
          if (u && r === 1 && i === 2) continue; // one book is gone
          const col = COVERS[(r * 3 + i * 5) % COVERS.length],
            x = 2 + i * 5;
          c.rect(x, y, x + 3, y + 4, col);
          c.col(x, y, y + 4, L(col));
          c.rect(x + 1, y + 1, x + 2, y + 2, r === 2 && i === 1 ? K : C.bone); // a picture on the cover
        }
        c.row(y + 5, 1, 22, PINE);
      }
      if (u) {
        c.rect(26, 18, 34, 19, C.paper); // the book lies open on the floor
        c.col(30, 17, 19, D(C.paper));
        c.row(17, 26, 34, C.plum);
        c.rect(27, 18, 28, 18, K);
        c.set(32, 18, RED);
      }
    },
    (c, u) => {
      c.poly([[0, 19], [0, 0], [2, 0], [8, 19]], PINE);
      c.col(0, 0, 19, L(PINE));
      c.line(2, 0, 8, 19, D(PINE));
      for (let r = 0; r < 3; r++) c.row(6 + r * 6, 1, 3 + r * 2, D(PINE));
      if (u) {
        c.rect(11, 18, 18, 19, C.paper);
        c.col(14, 17, 19, D(C.paper));
        c.row(17, 11, 18, C.plum);
      }
    },
  );

  /* ---------- bean bag ---------- */
  kid(
    'bean-bag-red',
    'bean bag seat red sack cushion floor',
    false,
    (c, u) => {
      const col = RED;
      c.oval(0, 4, 19, 15, col);
      c.oval(3, 0, 16, 10, col);
      c.rect(1, 11, 18, 14, col);
      c.row(14, 2, 17, D(col));
      c.line(4, 2, 2, 9, L(col));
      c.line(10, 1, 10, 13, D(col)); // seams
      c.line(15, 3, 17, 10, D(col));
      c.rect(9, -1, 10, 0, D(col)); // the tied top
      if (u) {
        // someone who is not there is sitting in it
        c.clearRect(3, -1, 16, 3);
        c.oval(4, 3, 15, 8, D(col));
        c.oval(5, 4, 14, 8, mix(col, 0.5));
        c.row(3, 5, 14, L(col));
        c.col(8, 9, 13, mix(col, 0.5)); // two grooves where legs would be
        c.col(11, 9, 13, mix(col, 0.5));
      }
    },
    (c, u) => {
      const col = RED;
      c.oval(0, 5, 17, 15, col);
      c.oval(0, 0, 11, 11, col);
      c.rect(1, 11, 16, 14, col);
      c.row(14, 2, 15, D(col));
      c.line(2, 2, 1, 9, L(col));
      c.line(7, 1, 9, 13, D(col));
      c.rect(5, -1, 6, 0, D(col));
      if (u) {
        c.clearRect(4, -1, 17, 3);
        c.poly([[6, 4], [14, 7], [14, 9], [6, 8]], mix(col, 0.5));
        c.line(5, 3, 15, 7, L(col));
        c.col(15, 8, 12, mix(col, 0.5));
      }
    },
  );

  /* ---------- play kitchen ---------- */
  kid(
    'play-kitchen',
    'play kitchen toy cooker oven sink wooden pretend',
    true,
    (c, u) => {
      body(c, 0, 10, 21, 25, PAINT);
      c.rect(0, 0, 21, 9, mix(PAINT, 0.9)); // back board
      c.row(0, 0, 21, L(PAINT));
      c.rect(1, 3, 20, 3, PINE); // a little shelf
      c.rect(3, 1, 4, 2, RED); // cups on it
      c.rect(7, 1, 8, 2, YEL);
      c.rect(15, 5, 18, 8, C.white); // a clock that has stopped
      dots(c, K, [16, 6, 17, 7]);
      c.row(10, 0, 21, PINE); // worktop
      c.row(9, 2, 5, IN); // hob rings
      c.row(9, 8, 11, IN);
      c.rect(14, 9, 19, 9, C.steel); // sink
      c.col(17, 6, 8, C.steel);
      c.set(18, 6, C.steel);
      dots(c, RED, [3, 12, 6, 12, 9, 12]); // knobs
      if (u) {
        c.rect(2, 14, 12, 23, IN); // the oven open, and it is hot
        c.rect(3, 19, 11, 22, hex('#7a2a1c'));
        c.row(22, 3, 11, C.flame);
        dots(c, C.flameLight, [5, 22, 9, 22]);
        c.row(18, 3, 11, C.iron);
        c.rect(1, 23, 13, 25, SKY); // the door let down
        c.row(23, 1, 13, L(SKY));
        c.row(24, 4, 10, C.glassLight);
      } else {
        body(c, 2, 14, 12, 23, SKY);
        c.rect(4, 16, 10, 20, IN);
        c.set(5, 17, C.glass);
        c.row(15, 5, 9, C.steel);
      }
      panel(c, 14, 14, 19, 23, PAINT);
      c.set(15, 18, RED);
    },
    (c, u) => {
      sideBody(c, 0, 10, 9, 25, PAINT);
      c.rect(0, 0, 1, 9, mix(PAINT, 0.9));
      c.col(0, 0, 25, L(PAINT));
      c.row(3, 2, 3, PINE);
      c.row(10, 0, 9, PINE);
      c.col(7, 6, 9, C.steel);
      c.set(8, 6, C.steel);
      if (u) {
        c.rect(10, 24, 18, 25, SKY); // the door lying open
        c.row(24, 10, 18, L(SKY));
        c.col(9, 14, 23, hex('#7a2a1c'));
        dots(c, C.flame, [10, 22, 11, 23, 10, 20]);
      }
    },
  );

  /* ---------- toy garage ---------- */
  const car = (c, x, b, col, flip) => {
    c.rect(x, b - 1, x + 4, b, col);
    c.rect(x + 1, b - 2, x + 3, b - 2, flip ? K : L(col));
    if (flip) c.rect(x, b - 3, x + 4, b - 2, col), c.set(x + 1, b - 4, K), c.set(x + 3, b - 4, K);
    else c.set(x + 1, b, K), c.set(x + 3, b, K);
  };
  kid(
    'toy-garage',
    'toy garage car park ramp cars lift plastic levels',
    true,
    (c, u) => {
      const G = C.stoneLight;
      c.rect(0, 0, 5, 19, RED); // the lift tower
      c.col(0, 0, 19, L(RED));
      c.rect(1, 2, 4, 5, YEL);
      c.rect(2, 3, 3, 4, K);
      c.rect(2, 8, 3, 18, D(RED));
      for (const y of [6, 12, 18]) {
        c.rect(6, y, 22, y + 1, G);
        c.row(y, 6, 22, L(G));
      }
      c.col(21, 0, 19, G); // pillar
      c.row(0, 6, 22, BLUE); // roof rail
      c.poly([[22, 6], [22, 7], [31, 19], [33, 19]], YEL); // the ramp
      c.line(22, 6, 33, 19, D(YEL));
      if (u) {
        car(c, 30, 19, RED, true); // all the cars in a heap at the bottom
        car(c, 34, 19, BLUE);
        car(c, 32, 15, YEL, true);
        c.set(37, 17, K);
      } else {
        car(c, 8, 5, RED);
        car(c, 15, 5, YEL);
        car(c, 10, 11, BLUE);
        car(c, 14, 17, GRN);
      }
    },
    (c, u) => {
      const G = C.stoneLight;
      c.rect(0, 0, 4, 19, RED);
      c.col(0, 0, 19, L(RED));
      for (const y of [6, 12, 18]) {
        c.rect(5, y, 12, y + 1, G);
        c.row(y, 5, 12, L(G));
      }
      c.col(12, 0, 19, G);
      c.row(0, 5, 12, BLUE);
      if (u) {
        car(c, 14, 19, RED, true);
        car(c, 16, 15, YEL, true);
      } else {
        c.rect(7, 4, 9, 5, RED);
        c.rect(8, 10, 10, 11, BLUE);
      }
    },
  );

  /* ---------- train table ---------- */
  kid(
    'train-table',
    'train table wooden railway track tunnel toy trains play table',
    true,
    (c, u) => {
      table(c, 0, 35, 9, 15, PINE);
      c.rect(1, 8, 34, 8, GRN); // the board
      c.row(7, 3, 32, C.ironDark); // track
      for (let x = 4; x < 32; x += 3) c.set(x, 7, PINE);
      c.oval(20, 1, 31, 12, GRN); // the hill with its tunnel
      c.clearRect(20, 9, 31, 12);
      table(c, 0, 35, 9, 15, PINE);
      c.rect(1, 8, 34, 8, GRN);
      c.rect(24, 4, 27, 7, IN);
      c.row(2, 23, 27, L(GRN));
      c.col(6, 3, 6, C.wood); // a tree
      c.oval(4, 0, 8, 4, C.leaf);
      if (u) {
        // off the rails and off the table
        c.rect(-6, 13, -2, 15, RED);
        c.rect(-6, 12, -5, 12, K);
        c.set(-1, 15, K);
        c.poly([[10, 7], [13, 4], [15, 6], [12, 7]], BLUE);
        c.rect(16, 5, 19, 7, YEL);
        c.set(18, 4, YEL);
        dots(c, K, [0, 10, -1, 11]);
      } else {
        c.rect(9, 5, 12, 6, RED); // engine and wagons
        c.set(12, 4, K);
        c.rect(9, 4, 10, 4, RED);
        c.rect(14, 5, 16, 6, BLUE);
        c.rect(18, 5, 20, 6, YEL);
      }
    },
    (c, u) => {
      table(c, 0, 17, 9, 15, PINE);
      c.rect(1, 8, 16, 8, GRN);
      c.oval(2, 1, 12, 12, GRN);
      c.clearRect(2, 9, 12, 12);
      table(c, 0, 17, 9, 15, PINE);
      c.rect(1, 8, 16, 8, GRN);
      c.row(2, 5, 9, L(GRN));
      c.col(14, 3, 7, C.wood);
      c.oval(12, 0, 16, 4, C.leaf);
      if (u) {
        c.rect(20, 13, 24, 15, RED);
        c.rect(23, 12, 24, 12, K);
        c.set(19, 15, K);
      } else c.rect(14, 6, 16, 7, RED);
    },
  );

  /* ---------- the easel ---------- */
  kid(
    'easel-child-drawing',
    'easel child drawing paper paint pots picture family house sun',
    true,
    (c, u) => {
      c.line(1, 2, 0, 27, PINE);
      c.line(14, 2, 15, 27, PINE);
      c.rect(1, 0, 14, 1, PINE);
      paper(c, 1, 2, 14, 16);
      c.rect(10, 3, 12, 5, u ? K : YEL); // the sun
      c.rect(3, 9, 7, 13, RED); // the house
      c.poly([[2, 9], [5, 6], [8, 9]], C.wood);
      c.set(5, 12, K);
      c.col(10, 10, 13, BLUE); // a child
      c.set(10, 9, C.flesh);
      c.row(14, 2, 13, GRN);
      if (u) {
        c.col(13, 5, 13, K); // and now someone tall beside it
        c.set(13, 4, K);
        c.set(12, 7, K);
        c.set(14, 7, K);
        dots(c, K, [11, 4, 9, 4, 12, 6]);
        c.col(13, 17, 20, K); // black paint running
      }
      c.rect(0, 17, 15, 18, PINE); // tray
      c.row(17, 0, 15, L(PINE));
      c.rect(2, 15, 3, 16, RED); // pots
      c.rect(5, 15, 6, 16, BLUE);
      c.rect(8, 15, 9, 16, u ? K : YEL);
    },
    (c, u) => {
      c.line(5, 0, 0, 27, PINE);
      c.line(6, 0, 11, 27, PINE);
      c.line(7, 0, 12, 27, D(PINE));
      c.line(7, 2, 10, 16, C.paper);
      c.rect(10, 17, 14, 18, PINE);
      c.rect(12, 15, 13, 16, RED);
      c.row(20, 3, 9, D(PINE)); // the chain between the legs
      if (u) {
        c.line(11, 19, 12, 24, K);
        c.rect(13, 26, 17, 27, K); // a pot knocked over, black paint on the floor
        c.rect(18, 25, 19, 27, YEL);
      }
    },
  );

  /* ---------- the little school desk ---------- */
  kid(
    'school-desk-child',
    'school desk child old lift lid bench seat inkwell wooden',
    true,
    (c, u) => {
      const W = C.wood,
        I = C.iron;
      c.rect(0, 2, 1, 10, W); // the seat back
      c.col(0, 2, 10, L(W));
      c.rect(0, 10, 8, 11, W); // the seat
      c.row(10, 0, 8, L(W));
      c.line(2, 12, 1, 17, I);
      c.line(7, 12, 11, 17, I);
      c.row(17, 0, 20, I); // the runner along the floor
      c.rect(11, 6, 20, 10, W); // the box
      c.col(20, 6, 10, D(W));
      c.line(15, 11, 16, 16, I);
      if (u) {
        c.rect(11, 5, 20, 6, IN); // the lid up: something scratched inside it
        c.line(11, 5, 14, -3, W);
        c.line(12, 5, 15, -3, D(W));
        dots(c, C.paper, [13, 6, 16, 6, 17, 5]);
        c.set(18, 5, RED);
      } else {
        c.line(10, 3, 20, 5, W);
        c.line(10, 4, 20, 6, L(W));
        c.line(10, 5, 20, 6, W);
        c.set(19, 4, IN); // the inkwell
      }
    },
    (c, u) => {
      const W = C.wood,
        I = C.iron;
      c.rect(1, 2, 14, 4, W); // the seat back, behind
      c.row(2, 1, 14, L(W));
      c.rect(0, 6, 15, 11, W); // the box from the front
      c.row(6, 0, 15, D(W));
      panel(c, 2, 8, 13, 10, W);
      c.col(1, 12, 17, I);
      c.col(14, 12, 17, I);
      c.row(17, 0, 3, I);
      c.row(17, 12, 15, I);
      if (u) {
        c.rect(0, -4, 15, 5, D(W)); // the lid stands up: its underside
        c.row(-4, 0, 15, W);
        c.col(0, -4, 5, W);
        dots(c, C.paper, [3, -1, 4, 0, 5, -1, 6, 0, 9, -2, 10, -1, 11, -2, 12, -1, 4, 2, 5, 3, 6, 2, 9, 2, 10, 3]); // scratched letters
        c.row(6, 1, 14, IN);
      } else {
        c.rect(0, 4, 15, 5, W); // the sloping lid
        c.row(4, 0, 15, L(W));
        c.set(13, 4, IN);
        c.row(5, 3, 8, D(W)); // the pen groove
      }
    },
    { base: 'side' },
  );
};
