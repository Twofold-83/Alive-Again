/* Toilets and bathrooms, first half: cubicles, pans, urinals, basins, baths, showers and the doors. See env-care.js. */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd }, T, add) => {
  const { D, L, dots, panel, caster, stream, puddle, cabS, doorOpenF, doorOpenS, folds, doorF, doorS } = T;
  const { SHEET, FOLD, STEEL, STL, STD, IRON, ID, BLK, YEL, IN, PAPER, WAT, WATD, PORC, PORD, TILE, GRIME, RUSTW } = T;
  const FORM = hex('#7f8f8a'), // cubicle partitions
    DOORC = hex('#3f6a6a'),
    SHADE = hex('#7f877c'), // tiles in shadow
    AVO = hex('#8a9a6a'),
    PINKB = hex('#b99a9a'),
    COPPER = hex('#9a6a44'),
    MURK = hex('#5a6a5c'),
    WOODP = hex('#7a5a40'),
    FILTH = hex('#6a5a34');

  /* ---------- the pan itself ---------- */
  /** A toilet from the front, 8 wide from x, standing on b. o.col, o.lid: 'down' | 'up' | none, o.fill: colour in the bowl. */
  function toiletF(c, x, b, o = {}) {
    const col = o.col || PORC,
      sh = o.col ? D(col) : PORD;
    if (!o.noCistern) {
      c.rect(x, b - 17, x + 7, b - 11, col);
      c.row(b - 17, x, x + 7, L(col));
      c.col(x, b - 17, b - 11, L(col));
      c.row(b - 11, x, x + 7, sh);
      c.set(x + 6, b - 15, STL); // handle
    }
    c.rect(x + 1, b - 9, x + 6, b - 6, col); // bowl
    c.rect(x, b - 9, x + 7, b - 8, col);
    c.row(b - 9, x, x + 7, L(col));
    c.rect(x + 2, b - 5, x + 5, b, col);
    c.col(x + 5, b - 5, b, sh);
    c.row(b - 6, x + 1, x + 6, sh);
    c.rect(x + 1, b, x + 6, b, sh);
    if (o.lid === 'down') {
      c.rect(x, b - 10, x + 7, b - 9, o.lidCol || col);
      c.row(b - 10, x, x + 7, L(o.lidCol || col));
    } else {
      c.rect(x + 2, b - 9, x + 5, b - 9, o.fill || hex('#4f5f66')); // looking into it
      if (o.lid === 'up') {
        c.rect(x, b - 16, x + 7, b - 10, o.lidCol || col);
        c.frame(x, b - 16, x + 7, b - 10, sh);
        c.row(b - 16, x, x + 7, L(o.lidCol || col));
      }
    }
  }
  /** The same from the side, facing right: 11 wide from x. */
  function toiletS(c, x, b, o = {}) {
    const col = o.col || PORC,
      sh = o.col ? D(col) : PORD;
    if (!o.noCistern) {
      c.rect(x, b - 17, x + 3, b - 9, col);
      c.row(b - 17, x, x + 3, L(col));
      c.col(x, b - 17, b - 9, L(col));
      c.set(x + 4, b - 15, STL);
    }
    c.poly([[x + 3, b - 9], [x + 10, b - 9], [x + 9, b - 6], [x + 7, b - 4], [x + 4, b - 4]], col);
    c.row(b - 9, x + 3, x + 10, L(col));
    c.rect(x + 4, b - 3, x + 7, b, col);
    c.col(x + 7, b - 3, b, sh);
    c.line(x + 9, b - 6, x + 7, b - 4, sh);
    c.rect(x + 3, b, x + 8, b, sh);
    if (o.lid === 'down') {
      c.rect(x + 3, b - 10, x + 10, b - 10, o.lidCol || col);
    } else if (o.lid === 'up') {
      c.rect(x + 3, b - 17, x + 4, b - 10, o.lidCol || col);
      c.col(x + 4, b - 16, b - 10, sh);
    }
  }

  /* ---------- cubicles ---------- */
  /** A cubicle from the front (20 x 40): o.ind 'vacant' | 'engaged', o.shoes, o.sign, o.inside(c, b), o.flood. */
  function cubF(c, u, o = {}) {
    const b = c.h - 2,
      dc = o.door || DOORC;
    for (const x of [1, 17]) {
      c.rect(x, 3, x + 1, b, FORM);
      c.col(x, 3, b, L(FORM));
    }
    c.rect(1, 3, 18, 4, FORM);
    c.row(3, 1, 18, L(FORM));
    if (u) {
      c.rect(3, 5, 16, b, SHADE); // the back wall
      for (let y = 9; y < b - 4; y += 5) c.row(y, 3, 16, D(SHADE));
      for (let x = 7; x < 16; x += 5) c.col(x, 5, b - 5, D(SHADE));
      c.rect(3, b - 4, 16, b, hex('#4a4a50')); // floor
      if (o.inside) o.inside(c, b);
      c.rect(3, 5, 5, b - 5, D(dc)); // the door, swung in
      c.col(5, 5, b - 5, dc);
      c.set(4, 20, STL);
    } else {
      c.rect(3, 5, 16, b - 5, dc);
      c.col(3, 5, b - 5, L(dc));
      c.row(5, 3, 16, L(dc));
      c.row(b - 5, 3, 16, D(dc));
      c.col(16, 5, b - 5, D(dc));
      c.rect(12, 19, 14, 21, STL); // the bolt's little window
      c.set(13, 20, o.ind === 'engaged' ? C.red : hex('#6a8a5a'));
      c.rect(13, 23, 13, 24, STD);
      dots(c, D(dc), [5, 9, 6, 10, 7, 9, 9, 12, 6, 28, 7, 29, 8, 28, 10, 30]); // scratched names
      if (o.sign) o.sign(c, b);
      if (o.shoes) {
        c.rect(6, b - 1, 8, b, BLK);
        c.rect(11, b - 1, 13, b, BLK);
        c.col(7, b - 3, b - 2, hex('#3a3a44'));
        c.col(12, b - 3, b - 2, hex('#3a3a44'));
      }
    }
    if (o.flood && (u || o.flood === 'always')) {
      c.row(b, 1, 18, WATD);
      c.row(b, 4, 14, L(WATD));
    }
  }
  function cubS(c, u, o = {}) {
    const b = c.h - 2,
      dc = o.door || DOORC;
    c.rect(1, 3, 20, 4, FORM);
    c.row(3, 1, 20, L(FORM));
    c.rect(1, 5, 1, b, D(FORM));
    c.rect(19, 5, 20, b, FORM);
    c.rect(2, 5, 18, b - 5, FORM); // the partition
    c.col(2, 5, b - 5, L(FORM));
    c.row(b - 5, 2, 18, D(FORM));
    c.rect(5, 10, 6, 11, STD); // coat hook bolts showing through
    c.rect(7, b - 4, 10, b, PORD); // the foot of the pan, seen under the partition
    c.row(b, 6, 11, PORD);
    if (o.shoes) c.rect(12, b - 1, 15, b, BLK);
    if (u) {
      doorOpenS(c, 21, 5, 31, b - 5, dc);
      c.rect(22, 19, 23, 21, STL);
    } else c.col(21, 6, b - 6, D(dc));
    if (o.flood && (u || o.flood === 'always')) c.row(b, 1, c.w - 2, WATD);
  }
  const cubicle = (slug, name, o) => add(slug, name, true, { m: [20, 40, (c, u) => cubF(c, u, o)], s: [23, 40, (c, u) => cubS(c, u, o)], su: [33, 40] });
  cubicle('wc-cubicle-vacant', 'toilet cubicle stall door vacant public lavatory green door', {
    ind: 'vacant',
    inside: (c, b) => {
      toiletF(c, 7, b, {});
      c.rect(14, b - 12, 15, b - 10, SHEET); // paper
    },
  });
  cubicle('wc-cubicle-engaged', 'toilet cubicle engaged locked somebody inside shoes under the door', {
    ind: 'engaged',
    shoes: true,
    door: hex('#4a5a6a'),
    inside: (c, b) => {
      toiletF(c, 7, b, { lid: 'down' });
      c.rect(6, b - 1, 8, b, BLK); // nobody: only the shoes
      c.rect(11, b - 1, 13, b, BLK);
      dots(c, hex('#5a5560'), [5, 12, 5, 14, 6, 16, 14, 11, 15, 13]); // and marks on the tiles
    },
  });
  cubicle('wc-cubicle-out-of-order', 'toilet cubicle out of order sign blocked flooded public lavatory', {
    ind: 'vacant',
    door: hex('#6a5a4a'),
    flood: true,
    sign: (c) => {
      c.rect(6, 13, 12, 17, SHEET);
      c.row(14, 7, 11, hex('#8c3a34'));
      c.row(16, 7, 10, STD);
      dots(c, hex('#b59a3c'), [6, 13, 12, 13]); // tape
    },
    inside: (c, b) => {
      toiletF(c, 7, b, { fill: FILTH });
      c.rect(8, b - 10, 13, b - 10, FILTH); // brimming over
      c.col(8, b - 8, b - 1, FILTH);
      c.col(13, b - 8, b - 3, FILTH);
      dots(c, FILTH, [6, 14, 5, 17, 15, 12]);
      c.rect(3, b - 1, 16, b, hex('#4f5a44'));
    },
  });

  /* ---------- pans on their own ---------- */
  {
    // a high cistern with its chain
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(2, 2, 11, 8, hex('#5a5a5f')); // cast iron cistern
      c.row(2, 2, 11, hex('#77777c'));
      c.col(2, 2, 8, hex('#77777c'));
      c.rect(4, 4, 9, 6, hex('#4a4a50'));
      dots(c, C.rust, [3, 7, 10, 5, 8, 8]);
      c.rect(1, 9, 3, 9, ID); // brackets
      c.rect(10, 9, 12, 9, ID);
      c.col(6, 9, b - 11, COPPER); // the down pipe
      c.col(7, 9, b - 11, D(COPPER));
      c.row(1, 9, 13, ID); // the lever
      const cy = u ? 20 : 15;
      c.col(13, 2, cy, hex('#9a9a8a'));
      for (let y = 3; y < cy; y += 2) c.set(13, y, STD);
      c.rect(13, cy + 1, 13, cy + 3, WOODP); // the handle
      toiletF(c, 3, b, { noCistern: true, lid: 'none', fill: u ? L(WAT) : hex('#4f5f66') });
      c.rect(3, b - 10, 10, b - 10, WOODP); // wooden seat
      c.rect(5, b - 9, 8, b - 9, u ? L(WAT) : hex('#4f5f66'));
      if (u) {
        dots(c, WAT, [6, b - 19, 7, b - 20, 6, b - 22]);
        dots(c, L(WAT), [2, b - 11, 11, b - 11, 4, b - 12, 9, b - 12]); // it comes down with a roar
        c.set(3, 9, WAT); // and the old thing weeps
        c.set(3, 11, WAT);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 6, 8, hex('#5a5a5f'));
      c.row(2, 1, 6, hex('#77777c'));
      c.col(1, 2, 8, hex('#77777c'));
      c.set(1, 9, ID);
      c.line(2, 9, 4, 11, ID);
      c.col(2, 9, b - 10, COPPER);
      c.row(1, 4, 10, ID);
      const cy = u ? 20 : 15;
      c.col(10, 2, cy, hex('#9a9a8a'));
      for (let y = 3; y < cy; y += 2) c.set(10, y, STD);
      c.rect(10, cy + 1, 10, cy + 3, WOODP);
      toiletS(c, 0, b, { noCistern: true });
      c.rect(3, b - 10, 10, b - 10, WOODP);
      c.rect(2, b - 9, 3, b - 7, PORC);
      if (u) dots(c, L(WAT), [5, b - 11, 8, b - 11, 6, b - 12]);
    };
    add('wc-cistern-high-chain', 'old toilet high cistern pull chain iron tank copper pipe wooden seat', true, { m: [15, 42, front], s: [13, 42, side] });
  }
  add('wc-toilet-avocado-lidded', 'toilet avocado green lid down seventies bathroom suite', true, {
    m: [10, 20, (c, u) => {
      toiletF(c, 1, c.h - 2, { col: AVO, lid: u ? 'up' : 'down', lidCol: u ? AVO : hex('#b98a9a'), fill: hex('#4f6a70') });
      if (!u) c.dither(1, c.h - 12, 8, c.h - 12, hex('#c9a0ae')); // a fluffy pink cover
    }],
    s: [13, 20, (c, u) => toiletS(c, 1, c.h - 2, { col: AVO, lid: u ? 'up' : 'down', lidCol: u ? AVO : hex('#b98a9a') })],
  });
  {
    const front = (c, u) => {
      const b = c.h - 2;
      toiletF(c, 1, b, { lid: 'none', fill: u ? FILTH : hex('#5a5a3c') });
      dots(c, GRIME, [3, b - 13, 6, b - 14, 4, b - 4, 5, b - 2, 2, b - 8]);
      dots(c, FILTH, [7, b - 8, 3, b - 7]);
      c.rect(2, b - 16, 4, b - 15, hex('#7a7a6a')); // the cistern lid broken, askew
      if (u) {
        c.rect(2, b - 10, 7, b - 10, FILTH); // up and over
        c.col(1, b - 8, b - 1, FILTH);
        c.col(8, b - 8, b - 4, FILTH);
        c.col(4, b - 20, b - 11, WOODP); // the plunger left standing in it
        c.rect(3, b - 11, 5, b - 10, hex('#8c3a34'));
        puddle(c, 1, 12, b, hex('#5a5a3c'));
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      toiletS(c, 1, b, {});
      dots(c, GRIME, [3, b - 13, 2, b - 11, 7, b - 6, 6, b - 2]);
      c.row(b - 9, 5, 10, u ? FILTH : hex('#5a5a3c'));
      if (u) {
        c.col(11, b - 8, b - 1, FILTH);
        c.col(8, b - 20, b - 11, WOODP);
        c.rect(7, b - 11, 9, b - 10, hex('#8c3a34'));
        puddle(c, 8, 15, b, hex('#5a5a3c'));
      }
    };
    add('wc-toilet-blocked-filthy', 'filthy toilet no seat blocked overflowing public lavatory stained', true, { m: [10, 23, front], mu: [14, 23], s: [13, 23, side], su: [17, 23] });
  }
  {
    const BLUE = hex('#4a6a8a');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 3, 16, b, BLUE);
      c.col(1, 3, b, L(BLUE));
      c.poly([[1, 3], [3, 1], [14, 1], [16, 3]], hex('#c9c6b4')); // translucent roof
      c.row(b, 1, 16, D(D(BLUE)));
      for (let y = 5; y < 9; y += 2) c.row(y, 6, 11, D(BLUE)); // vent
      if (u) {
        c.rect(3, 5, 14, b - 1, hex('#2b3340'));
        c.rect(5, b - 10, 12, b - 2, hex('#55606a')); // the tank and its seat
        c.rect(6, b - 11, 11, b - 10, SHEET);
        c.rect(7, b - 11, 10, b - 11, IN);
        c.rect(12, b - 18, 13, b - 16, SHEET); // paper
        dots(c, FILTH, [6, b - 5, 9, b - 3, 4, b - 1]);
        doorOpenF(c, 14, 5, b - 2, 4, hex('#c9c6b4'), 1);
        dots(c, BLK, [8, 14, 9, 13, 10, 14, 9, 15]); // flies
      } else {
        c.rect(3, 5, 14, b - 1, hex('#c9c6b4')); // the door
        c.col(3, 5, b - 1, L(hex('#c9c6b4')));
        c.col(14, 5, b - 1, hex('#a9a797'));
        c.rect(11, 19, 13, 21, BLK); // latch
        c.set(12, 20, hex('#6a8a5a'));
        c.rect(6, 10, 11, 13, BLUE); // the hire firm's plate
        c.row(12, 7, 10, SHEET);
        dots(c, GRIME, [5, 30, 6, 32, 12, 28, 4, 34]);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 1, 3, 14, b, BLUE, { frame: false });
      c.poly([[1, 3], [3, 1], [12, 1], [14, 3]], hex('#c9c6b4'));
      for (const x of [5, 10]) c.col(x, 4, b - 1, D(BLUE)); // moulded ribs
      c.rect(3, 6, 4, 8, D(BLUE));
      c.col(1, 10, 20, hex('#55606a')); // vent pipe
      if (u) doorOpenS(c, 15, 5, 25, b - 1, hex('#c9c6b4'));
      else c.col(15, 5, b - 1, hex('#c9c6b4'));
    };
    add('wc-portable-chemical', 'portable chemical toilet plastic cabin blue building site festival', true, { m: [18, 40, front], mu: [20, 40], s: [17, 40, side], su: [27, 40] });
  }
  {
    const PL = hex('#6a5a48');
    const plank = (c, x0, y0, x1, y1) => {
      c.rect(x0, y0, x1, y1, PL);
      for (let x = x0 + 3; x < x1; x += 4) c.col(x, y0, y1, D(PL));
      c.col(x0, y0, y1, L(PL));
      c.speckle(x0, y0, x1, y1, mix(PL, 0.85), 9, x0);
    };
    const front = (c, u) => {
      const b = c.h - 2;
      plank(c, 2, 5, 19, b);
      c.poly([[1, 6], [11, 1], [20, 6]], hex('#4a4038')); // tarred roof
      c.line(1, 6, 11, 1, hex('#6a5a50'));
      if (u) {
        c.rect(5, 8, 16, b, hex('#2a2420'));
        c.rect(5, b - 10, 16, b, WOODP); // the bench
        c.row(b - 10, 5, 16, L(WOODP));
        c.oval(8, b - 12, 13, b - 10, IN); // and the hole
        c.rect(14, b - 17, 15, b - 15, PAPER); // squares of newspaper on a nail
        c.set(15, b - 18, STD);
        dots(c, hex('#8a8a7a'), [6, 10, 7, 11, 6, 12]); // web
        doorOpenF(c, 5, 8, b - 1, 4, PL);
      } else {
        plank(c, 5, 8, 16, b);
        c.frame(5, 8, 16, b, D(PL));
        c.rect(9, 11, 12, 13, IN); // the crescent cut in the door
        c.rect(11, 11, 12, 12, PL);
        c.rect(14, 22, 15, 23, ID); // latch
        c.line(5, 16, 16, 27, D(PL)); // the brace
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      plank(c, 2, 5, 15, b);
      c.poly([[1, 5], [16, 2], [17, 3], [1, 6]], hex('#4a4038'));
      c.rect(6, 9, 8, 10, IN); // a knot hole to look out of
      if (u) {
        doorOpenS(c, 16, 8, 26, b - 1, PL);
        c.line(17, 12, 25, 24, D(PL));
      } else c.col(16, 8, b, D(PL));
    };
    add('wc-outhouse-privy', 'outhouse privy wooden outdoor toilet shed crescent moon door earth closet', true, { m: [22, 40, front], s: [19, 40, side], su: [29, 40] });
  }

  /* ---------- urinals ---------- */
  /** A stall urinal: a tall porcelain slab with a channel, 9 wide from x. */
  function stall(c, x, b, o = {}) {
    c.rect(x, b - 22, x + 8, b, PORC);
    c.col(x, b - 22, b, L(PORC));
    c.row(b - 22, x, x + 8, L(PORC));
    c.rect(x + 2, b - 20, x + 6, b - 1, PORD);
    c.rect(x + 3, b - 19, x + 5, b - 2, D(PORD));
    c.col(x + 8, b - 21, b, PORD);
    c.set(x + 4, b - 21, STL); // spreader
    c.set(x + 4, b - 1, BLK); // drain
    if (o.stain) dots(c, hex('#a59a5a'), [x + 3, b - 8, x + 4, b - 5, x + 5, b - 9, x + 4, b - 3, x + 3, b - 3]);
    if (o.crack) {
      c.line(x + 1, b - 16, x + 4, b - 11, BLK);
      c.line(x + 4, b - 11, x + 3, b - 6, BLK);
    }
    if (o.flow) {
      c.col(x + 3, b - 20, b - 2, WAT);
      c.col(x + 5, b - 20, b - 2, WAT);
      c.col(x + 4, b - 19, b - 2, L(WAT));
    }
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(12, 2, 21, 7, PORC); // one cistern for all three
      c.row(2, 12, 21, L(PORC));
      c.row(7, 12, 21, PORD);
      c.col(17, 8, 11, COPPER);
      c.row(11, 6, 28, COPPER);
      for (const x of [6, 17, 28]) c.col(x, 11, b - 23, D(COPPER));
      stall(c, 2, b, { stain: true, flow: u });
      stall(c, 13, b, { flow: u });
      stall(c, 24, b, { stain: true, crack: true });
      for (const x of [11, 22]) c.col(x, b - 24, b - 3, hex('#a9a797'));
      c.rect(26, b - 12, 29, b - 12, hex('#b59a3c')); // tape across the cracked one
      if (u) {
        puddle(c, 22, 33, b, hex('#8a8a4a')); // out through the crack
        c.col(26, b - 6, b - 1, hex('#8a8a4a'));
        c.set(20, 6, WAT);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 5, 7, PORC);
      c.row(2, 1, 5, L(PORC));
      c.col(2, 8, b - 23, COPPER);
      c.rect(1, b - 22, 3, b, PORC);
      c.col(1, b - 22, b, L(PORC));
      c.poly([[4, b - 22], [8, b - 20], [8, b - 3], [6, b], [4, b]], PORC);
      c.col(8, b - 20, b - 3, PORD);
      c.rect(4, b - 19, 5, b - 2, PORD);
      if (u) {
        c.col(5, b - 19, b - 2, WAT);
        puddle(c, 6, 13, b, hex('#8a8a4a'));
      }
    };
    add('wc-urinals-row', 'row of three urinals porcelain stalls copper pipe gents public', true, { m: [35, 38, front], s: [10, 38, side], su: [15, 38] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.col(6, 2, 8, STL); // flush pipe and button
      c.rect(5, 1, 7, 2, STD);
      c.set(6, 1, u ? C.red : STL);
      c.poly([[2, 9], [10, 9], [11, 13], [10, 21], [7, 24], [5, 24], [2, 21], [1, 13]], PORC);
      c.line(2, 9, 1, 13, L(PORC));
      c.col(1, 13, 20, L(PORC));
      c.poly([[4, 11], [8, 11], [9, 14], [8, 20], [6, 22], [4, 20], [3, 14]], PORD);
      c.poly([[5, 13], [7, 13], [7, 19], [6, 20], [5, 19]], D(PORD));
      c.rect(5, 22, 7, 22, PORC); // the lip
      c.col(6, 25, b - 1, STEEL); // trap to the floor
      c.row(b, 5, 7, STD);
      c.rect(5, 20, 7, 21, hex('#b5a03c')); // a yellow cake of something
      if (u) {
        c.col(5, 12, 20, WAT);
        c.col(7, 12, 20, WAT);
        c.col(6, 11, 19, L(WAT));
        dots(c, WAT, [4, 13, 8, 13]);
      } else c.set(6, 15, hex('#a59a5a'));
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.col(1, 2, 9, STL);
      c.rect(1, 1, 2, 2, STD);
      c.poly([[1, 9], [5, 9], [8, 13], [8, 19], [5, 24], [1, 24]], PORC);
      c.line(5, 9, 8, 13, L(PORC));
      c.col(8, 13, 19, PORD);
      c.line(8, 19, 5, 24, PORD);
      c.rect(6, 21, 9, 22, PORC);
      c.col(2, 25, b - 1, STEEL);
      c.row(b, 1, 3, STD);
      if (u) {
        c.col(7, 14, 20, WAT);
        c.set(9, 21, WAT);
      }
    };
    add('wc-urinal-bowl-wall', 'single urinal bowl on the wall porcelain flush pipe gents', true, { m: [13, 36, front], s: [11, 36, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 34, b - 9, hex('#8a8f8c')); // the steel back
      c.row(2, 1, 34, STL);
      c.speckle(2, 3, 33, b - 10, hex('#7a7a6a'), 7, 2);
      for (const x of [12, 23]) c.col(x, 2, b - 9, STD);
      c.row(4, 3, 32, STD); // the sparge pipe
      for (let x = 5; x < 32; x += 4) c.set(x, 5, STD);
      c.rect(1, b - 8, 34, b - 5, STEEL); // the trough
      c.row(b - 8, 1, 34, STL);
      c.row(b - 5, 2, 33, STD);
      c.rect(3, b - 7, 32, b - 7, u ? WAT : hex('#6a6a4a'));
      for (const x of [4, 30]) c.rect(x, b - 4, x + 1, b, STD);
      c.col(17, b - 4, b - 1, IRON);
      dots(c, hex('#b5a03c'), [8, b - 7, 20, b - 7, 27, b - 7]);
      dots(c, C.rust, [3, b - 10, 16, b - 11, 30, b - 10, 22, 8]);
      if (u) {
        for (let x = 5; x < 32; x += 4) {
          c.col(x, 6, b - 9, WAT);
          c.set(x, 9, L(WAT));
          c.set(x, 15, L(WAT));
        }
        dots(c, L(WAT), [6, b - 7, 14, b - 7, 22, b - 7]);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 2, b - 5, hex('#8a8f8c'));
      c.col(1, 2, b - 5, STL);
      c.set(3, 4, STD);
      c.rect(3, b - 8, 9, b - 5, STEEL);
      c.row(b - 8, 3, 9, STL);
      c.row(b - 5, 3, 8, STD);
      c.rect(7, b - 4, 8, b, STD);
      c.col(3, b - 4, b - 1, IRON);
      if (u) {
        c.col(3, 5, b - 9, WAT);
        c.set(3, 10, L(WAT));
      }
    };
    add('wc-urinal-trough-steel', 'urinal trough stainless steel wall sparge pipe football ground gents', true, { m: [36, 28, front], s: [11, 28, side] });
  }

  /* ---------- basins ---------- */
  /** A wall basin from the front, 10 wide from x, its rim at y. */
  function basinF(c, x, y, o = {}) {
    c.rect(x, y, x + 9, y + 2, PORC);
    c.row(y, x, x + 9, L(PORC));
    c.rect(x + 1, y + 3, x + 8, y + 4, PORC);
    c.row(y + 4, x + 2, x + 7, PORD);
    c.rect(x + 2, y + 1, x + 7, y + 1, o.fill || PORD);
    c.col(x + 2, y - 2, y - 1, STL); // two taps
    c.col(x + 7, y - 2, y - 1, STL);
    dots(c, STD, [x + 1, y - 2, x + 8, y - 2]);
    c.col(x + 4, y + 5, y + 8, STEEL); // waste
    c.col(x + 5, y + 5, y + 8, STD);
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.row(b - 7, 2, 35, STD); // the shared waste pipe
      c.col(35, b - 7, b, STD);
      basinF(c, 1, b - 16, {});
      basinF(c, 13, b - 16, { fill: u ? WAT : PORD });
      basinF(c, 25, b - 16, { fill: hex('#8a8a6a') });
      dots(c, GRIME, [27, b - 14, 30, b - 13, 3, b - 13]);
      c.rect(11, b - 17, 12, b - 16, hex('#b99a9a')); // a sliver of soap
      c.set(26, b - 19, STD); // one tap head missing
      c.clear(27, b - 18);
      if (u) {
        stream(c, 20, b - 17, b - 15);
        c.rect(13, b - 16, 22, b - 16, WAT); // brimming
        c.col(13, b - 15, b - 1, WAT);
        c.col(22, b - 15, b - 9, WAT);
        puddle(c, 9, 20, b, WATD);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 16, 8, b - 14, PORC);
      c.row(b - 16, 1, 8, L(PORC));
      c.poly([[1, b - 13], [7, b - 13], [5, b - 11], [1, b - 11]], PORC);
      c.row(b - 11, 1, 5, PORD);
      c.col(2, b - 10, b - 7, STEEL);
      c.col(1, b - 7, b, STD);
      c.rect(2, b - 19, 3, b - 17, STL);
      c.set(4, b - 19, STL);
      if (u) {
        c.set(4, b - 18, WAT);
        c.set(4, b - 17, WAT);
        c.col(9, b - 15, b - 1, WAT);
        puddle(c, 6, 12, b, WATD);
      }
    };
    add('wc-basins-row', 'row of three wash basins taps public toilet washroom school', true, { m: [37, 22, front], s: [10, 22, side], su: [14, 22] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 15, 12, b - 13, PORC);
      c.row(b - 15, 1, 12, L(PORC));
      c.rect(2, b - 12, 11, b - 10, PORC);
      c.row(b - 10, 3, 10, PORD);
      c.rect(5, b - 9, 8, b, PORC); // pedestal
      c.col(8, b - 9, b, PORD);
      c.rect(4, b, 9, b, PORD);
      c.rect(3, b - 14, 10, b - 14, u ? RUSTW : PORD);
      c.col(6, b - 18, b - 16, STL);
      c.row(b - 18, 6, 8, STL);
      dots(c, STD, [3, b - 16, 10, b - 16]);
      dots(c, C.rust, [5, b - 12, 5, b - 11, 6, b - 10, 4, b - 13]); // the tap has dripped for years
      c.line(9, b - 13, 11, b - 11, BLK); // a crack
      if (u) {
        stream(c, 8, b - 17, b - 15, RUSTW);
        dots(c, D(RUSTW), [4, b - 14, 7, b - 14]);
        c.col(10, b - 10, b - 6, RUSTW); // through the crack
        c.set(10, b - 4, RUSTW);
        puddle(c, 8, 13, b, RUSTW);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 15, 9, b - 13, PORC);
      c.row(b - 15, 1, 9, L(PORC));
      c.poly([[1, b - 12], [8, b - 12], [6, b - 10], [1, b - 10]], PORC);
      c.rect(2, b - 9, 5, b, PORC);
      c.col(5, b - 9, b, PORD);
      c.rect(1, b, 6, b, PORD);
      c.col(2, b - 18, b - 16, STL);
      c.row(b - 18, 2, 4, STL);
      dots(c, C.rust, [7, b - 12, 6, b - 11]);
      if (u) {
        stream(c, 4, b - 17, b - 16, RUSTW);
        c.col(8, b - 11, b - 6, RUSTW);
        puddle(c, 6, 11, b, RUSTW);
      }
    };
    add('wc-basin-pedestal-rusty', 'pedestal wash basin cracked rusty tap brown water bathroom', true, { m: [15, 21, front], s: [13, 21, side] });
  }

  /* ---------- baths and showers ---------- */
  {
    const CURT = hex('#b9b49a');
    // a bath with a shower curtain round it, from its long side
    const side = (c, u) => {
      const b = c.h - 2;
      c.row(2, 1, 36, STL); // rail
      c.col(1, 2, 4, STD);
      c.col(36, 2, 4, STD);
      c.col(4, 5, 12, STL); // riser and rose
      c.rect(4, 5, 8, 5, STL);
      c.rect(7, 6, 9, 7, STD);
      c.rect(2, b - 11, 35, b - 1, PORC); // the bath
      c.row(b - 11, 1, 36, L(PORC));
      c.rect(1, b - 11, 36, b - 10, PORC);
      c.row(b - 1, 3, 34, PORD);
      c.clear(2, b - 1);
      c.clear(35, b - 1);
      c.rect(5, b, 6, b, PORD);
      c.rect(31, b, 32, b, PORD);
      c.rect(3, b - 14, 5, b - 12, STL); // taps
      if (u) {
        c.rect(26, 3, 35, b - 4, CURT); // pulled right back
        folds(c, 27, 4, 35, b - 4, D(CURT), 2);
        for (let x = 26; x <= 35; x += 2) c.set(x, 2, STD);
        c.rect(3, b - 10, 25, b - 10, MURK); // the bath full, and not clean
        dots(c, L(MURK), [6, b - 10, 12, b - 10, 19, b - 10]);
        c.rect(12, b - 11, 16, b - 11, hex('#3a3a34')); // something just under the surface
        dots(c, WAT, [8, 9, 8, 12, 8, 16]); // the rose still dripping
        c.col(20, b - 9, b - 2, hex('#7a8a7a'));
      } else {
        c.rect(2, 3, 35, b - 4, CURT);
        folds(c, 3, 4, 35, b - 4, D(CURT), 3);
        folds(c, 5, 4, 34, b - 8, L(CURT), 6);
        for (let x = 2; x <= 35; x += 3) c.set(x, 2, STD);
        for (let x = 2; x <= 35; x += 3) c.clear(x, b - 4);
        dots(c, GRIME, [6, b - 6, 12, b - 5, 13, b - 6, 20, b - 5, 27, b - 6, 30, b - 5]); // mildew along the hem
        c.rect(15, 14, 18, 22, mix(CURT, 0.78)); // a shadow on it, about the height of a head
        c.rect(14, 23, 19, b - 5, mix(CURT, 0.82));
      }
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.row(2, 1, 16, STL);
      c.col(1, 2, 4, STD);
      c.rect(2, b - 11, 15, b - 1, PORC);
      c.rect(1, b - 11, 16, b - 10, PORC);
      c.row(b - 11, 1, 16, L(PORC));
      c.row(b - 1, 3, 14, PORD);
      c.rect(3, b, 4, b, PORD);
      c.rect(13, b, 14, b, PORD);
      if (u) {
        c.rect(2, 5, 15, b - 12, SHADE); // the tiled wall behind
        for (let y = 9; y < b - 12; y += 5) c.row(y, 2, 15, D(SHADE));
        c.col(8, 5, 14, STL);
        c.rect(7, 5, 10, 6, STD);
        dots(c, WAT, [9, 9, 9, 13, 9, 18]);
        c.rect(2, 3, 5, b - 4, CURT);
        folds(c, 3, 4, 5, b - 4, D(CURT), 2);
        c.rect(3, b - 10, 14, b - 10, MURK);
        c.rect(7, b - 11, 10, b - 11, hex('#3a3a34'));
      } else {
        c.rect(2, 3, 15, b - 4, CURT);
        folds(c, 3, 4, 15, b - 4, D(CURT), 3);
        for (let x = 2; x <= 15; x += 3) c.set(x, 2, STD);
        for (let x = 2; x <= 15; x += 3) c.clear(x, b - 4);
        dots(c, GRIME, [5, b - 6, 9, b - 5, 13, b - 6]);
        c.rect(7, 14, 10, 22, mix(CURT, 0.78));
        c.rect(6, 23, 11, b - 5, mix(CURT, 0.82));
      }
    };
    add('bath-shower-curtain-drawn', 'bath with shower curtain drawn rail shadow behind it bathroom', true, { base: 'side', m: [38, 40, side], s: [18, 40, front] });
  }
  {
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 10, 34, b, AVO);
      c.col(1, b - 10, b, L(AVO));
      c.rect(1, b - 12, 34, b - 11, L(AVO));
      c.row(b - 12, 1, 34, L(L(AVO)));
      for (const x of [3, 14, 25]) panel(c, x, b - 8, x + 7, b - 2, AVO);
      c.row(b, 1, 34, D(D(AVO)));
      c.rect(3, b - 15, 4, b - 13, C.gold); // taps
      c.rect(7, b - 15, 8, b - 13, C.gold);
      c.rect(5, b - 14, 6, b - 14, D(C.gold));
      c.rect(28, b - 14, 31, b - 13, PINKB); // soap on a flannel
      if (u) {
        c.rect(3, b - 12, 32, b - 12, MURK); // run to the brim
        dots(c, L(MURK), [9, b - 12, 16, b - 12, 24, b - 12]);
        stream(c, 5, b - 13, b - 13);
        c.col(20, b - 11, b - 1, hex('#7a8a7a')); // and over
        c.col(27, b - 11, b - 5, hex('#7a8a7a'));
        puddle(c, 16, 30, b, WATD);
        c.clearRect(28, b - 14, 31, b - 13);
        c.rect(22, b - 13, 24, b - 13, PINKB); // the flannel floating
      }
    };
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 10, 15, b, AVO);
      c.col(1, b - 10, b, L(AVO));
      c.rect(1, b - 12, 15, b - 11, L(AVO));
      c.row(b - 12, 1, 15, L(L(AVO)));
      panel(c, 3, b - 8, 13, b - 2, AVO);
      c.row(b, 1, 15, D(D(AVO)));
      c.rect(5, b - 15, 6, b - 13, C.gold);
      c.rect(10, b - 15, 11, b - 13, C.gold);
      c.rect(7, b - 14, 9, b - 14, D(C.gold));
      if (u) {
        c.rect(3, b - 12, 13, b - 12, MURK);
        c.set(8, b - 13, WAT);
        c.col(4, b - 11, b - 1, hex('#7a8a7a'));
        c.col(11, b - 11, b - 6, hex('#7a8a7a'));
        puddle(c, 1, 12, b, WATD);
      }
    };
    add('bath-panelled-avocado', 'bath panelled avocado green gold taps seventies bathroom suite', true, { base: 'side', m: [36, 18, side], s: [17, 18, front] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 7, 10, b - 5, PINKB);
      c.row(b - 7, 1, 10, L(PINKB));
      c.rect(2, b - 4, 9, b - 3, PINKB);
      c.rect(3, b - 2, 8, b, PINKB);
      c.col(8, b - 2, b, D(PINKB));
      c.row(b - 3, 2, 9, D(PINKB));
      c.rect(3, b - 7, 8, b - 7, u ? WAT : D(PINKB));
      c.rect(3, b - 9, 4, b - 8, C.gold);
      c.rect(7, b - 9, 8, b - 8, C.gold);
      if (u) {
        c.col(5, b - 12, b - 8, WAT); // the jet
        c.col(6, b - 13, b - 8, L(WAT));
        dots(c, WAT, [4, b - 13, 7, b - 14, 3, b - 11, 8, b - 12, 2, b - 9, 9, b - 10]);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.poly([[1, b - 7], [11, b - 7], [10, b - 4], [8, b - 3], [3, b - 3], [1, b - 4]], PINKB);
      c.row(b - 7, 1, 11, L(PINKB));
      c.rect(3, b - 2, 8, b, PINKB);
      c.col(8, b - 2, b, D(PINKB));
      c.rect(2, b - 9, 3, b - 8, C.gold);
      if (u) {
        c.col(6, b - 12, b - 8, WAT);
        c.col(7, b - 13, b - 8, L(WAT));
        dots(c, WAT, [5, b - 13, 8, b - 14, 4, b - 11, 9, b - 11, 10, b - 9]);
      }
    };
    add('bath-bidet-pink', 'bidet pink porcelain gold taps bathroom suite', true, { m: [12, 17, front], s: [13, 17, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 28, b - 1, TILE);
      for (let y = 6; y < b - 1; y += 5) c.row(y, 1, 28, D(TILE));
      for (let x = 5; x < 28; x += 5) c.col(x, 2, b - 1, D(TILE));
      c.speckle(1, 20, 28, b - 1, GRIME, 14, 3);
      c.rect(14, 2, 15, b, SHEET); // the dividing slab
      c.col(15, 2, b, FOLD);
      c.rect(1, b, 28, b, hex('#5a5a55'));
      for (const x of [7, 22]) {
        c.col(x, 4, 22, STL); // riser
        c.rect(x - 1, 4, x + 1, 4, STL);
        c.rect(x - 2, 5, x + 2, 6, STD); // rose
        c.rect(x - 1, 22, x + 1, 23, STD); // valve
        c.set(x, 22, hex('#8c3a34'));
      }
      dots(c, C.rust, [7, 12, 22, 9, 22, 15]);
      c.rect(9, 26, 11, 27, PINKB); // soap in a tile recess
      dots(c, hex('#3a3a34'), [3, b - 2, 4, b - 3, 26, b - 2, 27, b - 4, 25, b - 1]); // black in the corners
      if (u) {
        for (let y = 7; y < b; y++) for (let x = 3; x <= 11; x++) if ((x * 3 + y) % 5 === 0 && Math.abs(x - 7) <= 1 + (y - 7) / 6) c.set(x, y, y % 3 ? WAT : L(WAT)); // the far one running, nobody under it
        dots(c, hex('#c4ccc4'), [3, 12, 12, 10, 2, 18, 12, 20, 4, 8, 10, 15]);
        c.row(b, 2, 13, WATD);
        c.rect(17, b - 1, 21, b, FOLD); // a towel dropped by the other
        c.set(19, b - 2, SHEET);
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 2, 2, b - 1, TILE);
      c.rect(3, 2, 10, b, SHEET); // the slab, face on
      c.col(3, 2, b, L(SHEET));
      c.col(10, 2, b, FOLD);
      c.row(b, 3, 10, FOLD);
      dots(c, GRIME, [5, b - 3, 6, b - 2, 8, b - 4, 4, b - 1]);
      c.rect(1, b, 2, b, hex('#5a5a55'));
      if (u) {
        dots(c, hex('#c4ccc4'), [11, 8, 12, 12, 11, 16, 12, 20]);
        c.row(b, 11, 12, WATD);
      }
    };
    add('wc-showers-row-tiled', 'communal showers two shower heads tiled wall changing room baths', true, { m: [30, 40, front], s: [14, 40, side] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(2, 4, 9, 18, COPPER);
      c.col(2, 4, 18, L(COPPER));
      c.col(9, 4, 18, D(COPPER));
      c.rect(3, 3, 8, 3, L(COPPER));
      c.rect(5, 1, 6, 2, D(COPPER)); // flue
      for (const y of [7, 15]) c.row(y, 2, 9, D(COPPER));
      c.rect(4, 10, 7, 12, IN); // the pilot window
      c.set(5, 12, u ? hex('#5f8ac0') : hex('#3a3a44'));
      if (u) {
        c.rect(4, 11, 7, 12, hex('#5f8ac0')); // lit, with a thump
        dots(c, hex('#8fb3d9'), [5, 10, 6, 11]);
        c.set(4, 10, C.flame);
      }
      dots(c, hex('#5f8a6a'), [3, 16, 8, 6, 3, 8]); // verdigris
      c.col(4, 19, 22, STL); // pipes
      c.col(7, 19, 21, STL);
      c.row(22, 4, 10, STL); // the spout, swung over the bath
      c.set(10, 23, STL);
      c.rect(6, 20, 8, 20, C.brass);
      if (u) {
        stream(c, 10, 24, b, WAT);
        dots(c, hex('#c4ccc4'), [11, 26, 9, 28, 11, 31]);
      } else c.set(10, 25, WAT);
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, 6, 1, 16, STD); // wall plate
      c.rect(2, 4, 8, 18, COPPER);
      c.col(2, 4, 18, L(COPPER));
      c.col(8, 4, 18, D(COPPER));
      c.rect(4, 1, 5, 3, D(COPPER));
      for (const y of [7, 15]) c.row(y, 2, 8, D(COPPER));
      c.col(8, 10, 12, u ? hex('#5f8ac0') : IN);
      c.col(4, 19, 22, STL);
      c.row(22, 4, 9, STL);
      c.set(9, 23, STL);
      if (u) stream(c, 9, 24, b, WAT);
    };
    add('bath-geyser-copper', 'gas geyser copper water heater over the bath pilot light old bathroom', true, { m: [13, 36, front], s: [12, 36, side] });
  }
  {
    const JACK = hex('#8a4a44');
    const tank = (side) => (c, u) => {
      const b = c.h - 2;
      c.rect(2, 6, 11, b - 3, JACK);
      c.col(2, 6, b - 3, L(JACK));
      c.col(3, 6, b - 3, L(JACK));
      c.rect(3, 4, 10, 5, JACK);
      c.rect(4, 3, 9, 3, L(JACK));
      for (let y = 10; y < b - 3; y += 6) c.row(y, 2, 11, D(JACK)); // straps round the lagging
      c.set(side ? 6 : 9, 13, BLK); // buckles
      c.set(side ? 6 : 9, 25, BLK);
      c.rect(3, b - 2, 4, b, STD);
      c.rect(9, b - 2, 10, b, STD);
      c.col(6, 1, 2, COPPER);
      if (side) c.row(1, 1, 6, COPPER);
      else c.row(1, 6, 12, COPPER);
      c.rect(side ? 11 : 12, b - 9, side ? 12 : 13, b - 8, C.brass); // drain cock
      if (!side) {
        c.rect(5, 16, 8, 20, SHEET); // somebody's instructions
        c.row(18, 6, 7, STD);
      }
      if (u) {
        c.line(4, 22, 6, 27, mix(JACK, 0.55)); // split
        c.col(6, 27, b - 4, RUSTW);
        dots(c, RUSTW, [5, 24, 7, 30]);
        puddle(c, 3, 13, b, RUSTW);
      }
    };
    add('bath-hot-water-tank', 'hot water tank cylinder red lagging jacket airing cupboard copper pipes', true, { m: [15, 36, tank(false)], s: [15, 36, tank(true)] });
  }

  /* ---------- the way in ---------- */
  {
    const man = (c) => {
      c.rect(7, 8, 12, 15, SHEET);
      c.set(9, 9, BLK);
      c.set(10, 9, BLK);
      c.rect(9, 10, 10, 12, BLK);
      dots(c, BLK, [8, 11, 11, 11, 9, 13, 10, 13, 9, 14, 10, 14]);
    };
    const woman = (c) => {
      c.rect(7, 8, 12, 15, SHEET);
      c.set(9, 9, BLK);
      c.set(10, 9, BLK);
      c.rect(9, 10, 10, 11, BLK);
      c.rect(8, 12, 11, 13, BLK);
      dots(c, BLK, [9, 14, 10, 14]);
    };
    const room = (c, b) => {
      c.rect(7, 3, 16, b - 6, SHADE); // tiles, a basin, the light flickering
      for (let y = 8; y < b - 6; y += 5) c.row(y, 7, 16, D(SHADE));
      c.poly([[7, b], [9, b - 6], [16, b - 6], [16, b]], hex('#4a4a50'));
      c.rect(10, b - 16, 15, b - 14, PORC);
      c.rect(12, b - 13, 13, b - 7, PORD);
      c.rect(10, 5, 15, 5, hex('#b8b47a'));
      c.rect(10, b - 24, 15, b - 19, hex('#6f8a90')); // mirror
    };
    add('wc-door-gents', 'gents toilet door mens lavatory sign public convenience', true, {
      m: [20, 40, (c, u) => doorF(c, u, { col: hex('#4a5a6a'), sign: man, room })],
      s: [6, 40, (c, u) => doorS(c, u, { col: hex('#4a5a6a') })],
      su: [18, 40],
    });
    add('wc-door-ladies', 'ladies toilet door womens lavatory sign public convenience', true, {
      m: [
        20, 40,
        (c, u) =>
          doorF(c, u, {
            col: hex('#6a4a5a'),
            sign: woman,
            room: (c, b) => {
              room(c, b);
              dots(c, C.blood, [11, b - 2, 12, b - 3, 13, b - 2, 10, b - 1]);
            },
          }),
      ],
      s: [6, 40, (c, u) => doorS(c, u, { col: hex('#6a4a5a') })],
      su: [18, 40],
    });
  }
  {
    const col = hex('#6a6f6c');
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 18, 6, b, col);
      c.col(1, b - 18, b, L(col));
      c.row(b - 18, 1, 6, L(col));
      c.row(b, 1, 6, D(D(col)));
      c.rect(2, b - 16, 5, b - 14, SHEET); // 2d
      c.row(b - 15, 3, 4, BLK);
      c.rect(3, b - 12, 4, b - 12, BLK); // the slot
      c.set(5, b - 12, u ? hex('#6a8a5a') : C.red);
      c.rect(14, b - 18, 15, b, col); // the far post
      c.col(14, b - 18, b, L(col));
      if (u) {
        c.line(7, b - 11, 12, b - 5, STL); // the arms turned: one down, pushed through
        c.line(7, b - 10, 11, b - 5, STD);
        c.row(b - 14, 7, 9, STL);
      } else {
        c.rect(7, b - 11, 13, b - 10, STL); // the arm across
        c.row(b - 10, 7, 13, STD);
        c.line(7, b - 12, 10, b - 16, STD);
      }
      c.rect(6, b - 12, 7, b - 9, STD); // hub
    };
    const side = (c, u) => {
      const b = c.h - 2;
      cabS(c, 2, b - 18, 9, b, col);
      c.rect(9, b - 12, 10, b - 9, STD);
      if (u) c.rect(11, b - 8, 12, b - 5, STL);
      else {
        c.rect(11, b - 11, 12, b - 10, STL); // the arm, end on
        c.line(11, b - 13, 13, b - 16, STD);
      }
      c.set(4, b - 15, SHEET);
    };
    add('wc-turnstile-penny', 'toilet turnstile coin slot penny pay to enter public convenience', true, { m: [17, 22, front], s: [15, 22, side] });
  }
  {
    const beige = hex('#b9b29a');
    const front = (c, u) => {
      const b = c.h - 2;
      if (u) {
        c.rect(1, b - 13, 20, b - 12, D(beige)); // the wall plate
        c.rect(1, b - 3, 20, b - 1, beige); // let down flat
        c.row(b - 3, 1, 20, L(beige));
        c.rect(2, b - 4, 19, b - 4, hex('#7f9aa0')); // its pad
        c.rect(8, b - 5, 12, b - 4, STD); // the strap, undone
        c.line(1, b - 12, 1, b - 4, STD);
        c.line(20, b - 12, 20, b - 4, STD);
        c.rect(14, b - 6, 16, b - 5, hex('#a8697a')); // one small sock
        c.rect(3, b, 18, b, D(beige));
      } else {
        c.rect(1, b - 13, 20, b, beige);
        c.row(b - 13, 1, 20, L(beige));
        c.col(1, b - 13, b, L(beige));
        c.row(b, 1, 20, D(beige));
        c.rect(8, b - 10, 13, b - 4, hex('#7f9aa0')); // the picture of a baby
        c.rect(10, b - 9, 11, b - 8, SHEET);
        c.rect(9, b - 7, 12, b - 6, SHEET);
        c.rect(9, b - 2, 12, b - 2, STD); // handle
      }
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 13, 2, b, D(beige));
      if (u) {
        c.rect(3, b - 3, 13, b - 1, beige);
        c.row(b - 3, 3, 13, L(beige));
        c.rect(3, b - 4, 12, b - 4, hex('#7f9aa0'));
        c.line(3, b - 12, 12, b - 4, STD);
        c.rect(7, b - 6, 9, b - 5, hex('#a8697a'));
      } else {
        c.rect(3, b - 13, 4, b, beige);
        c.col(4, b - 13, b, D(beige));
      }
    };
    add('wc-baby-changing-table', 'baby changing table fold down wall unit public toilet', false, { m: [22, 16, front], s: [6, 16, side], su: [15, 16] });
  }
  {
    const front = (c, u) => {
      const b = c.h - 2;
      c.rect(1, b - 12, 22, b - 3, hex('#5d6660')); // the cart
      c.col(1, b - 12, b - 3, L(hex('#5d6660')));
      c.row(b - 12, 1, 22, STL);
      caster(c, 2, b);
      caster(c, 20, b);
      c.row(b - 2, 2, 21, STD);
      c.rect(2, b - 20, 9, b - 4, hex('#3f3f48')); // the rubbish sack
      c.col(2, b - 19, b - 4, hex('#55555f'));
      c.rect(3, b - 21, 8, b - 21, hex('#55555f'));
      if (u) {
        c.rect(2, b - 24, 9, b - 21, hex('#3f3f48')); // full to bursting
        c.rect(3, b - 25, 8, b - 25, hex('#55555f'));
        dots(c, SHEET, [4, b - 26, 6, b - 26, 9, b - 22]);
      }
      c.rect(11, b - 16, 18, b - 9, YEL); // the bucket
      c.col(11, b - 16, b - 9, L(YEL));
      c.row(b - 9, 11, 18, D(YEL));
      c.rect(12, b - 16, 17, b - 16, u ? hex('#7a4a44') : hex('#6a7a7a'));
      c.rect(20, b - 16, 21, b - 13, hex('#5a8a9a')); // bottles
      c.set(20, b - 17, SHEET);
      c.rect(19, b - 15, 19, b - 13, hex('#a8697a'));
      c.col(23, 2, b - 4, WOODP); // broom
      c.rect(22, b - 5, 24, b - 3, hex('#8a7a4a'));
      if (!u) {
        c.col(15, 3, b - 17, WOODP); // the mop standing in the bucket
        c.rect(14, b - 19, 16, b - 17, FOLD);
      } else dots(c, hex('#7a4a44'), [13, b - 8, 14, b - 6, 13, b - 4, 12, b, 15, b]); // red water slopped down the side
    };
    const side = (c, u) => {
      const b = c.h - 2;
      c.rect(2, b - 12, 11, b - 3, hex('#5d6660'));
      c.col(2, b - 12, b - 3, L(hex('#5d6660')));
      c.row(b - 12, 2, 11, STL);
      c.rect(1, b - 15, 1, b - 11, STD); // push bar
      caster(c, 2, b);
      caster(c, 10, b);
      c.rect(3, b - 16, 10, b - 9, YEL);
      c.col(3, b - 16, b - 9, L(YEL));
      c.rect(4, b - 16, 9, b - 16, u ? hex('#7a4a44') : hex('#6a7a7a'));
      c.col(12, 2, b - 4, WOODP);
      c.rect(11, b - 5, 13, b - 3, hex('#8a7a4a'));
      if (!u) {
        c.col(6, 3, b - 17, WOODP);
        c.rect(5, b - 19, 7, b - 17, FOLD);
      } else dots(c, hex('#7a4a44'), [5, b - 8, 6, b - 5, 7, b]);
    };
    add('wc-cleaners-cart', 'cleaners cart janitor trolley mop bucket rubbish sack broom bottles', true, { m: [26, 30, front], s: [15, 30, side] });
  }
};
