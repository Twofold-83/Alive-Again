/* Surreal, part 4: sky where cloth should be, a coffin sitting up, leaves that are birds. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, dayAt, night, day, wheel, flame, clock, drawer, bowler, apple, eye, notes } = H;
  const { CLD, NI, SKY, DAY, DAYl, MOON, MOONd, OUT, PORC, SEA, SEAl, SAND, APPLE, FELT, PLASTER, LOBSTER, GIR, BRICK, PINK } = P;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    MARB = hex('#a9a69e'),
    STONE = hex('#8f897c'),
    LEAF = hex('#4f6b48'),
    WARM = hex('#d9b45a');
  const MARK = hex('#ff00ff');
  const fill = (c, at) => repaint(c, 0, 0, c.w - 1, c.h - 1, MARK, at);

  O('surreal-curtain-of-sky', 'curtain made of sky a single hanging curtain painted with blue sky and clouds standing free surreal', {
    w: 22, h: 44,
    f(c, u) {
      const b = 42;
      if (!u) {
        c.poly([[3, 3], [18, 3], [19, b], [2, b]], MARK);
        fill(c, dayAt(2));
        for (const x of [6, 10, 14]) for (let y = 5; y <= b - 1; y++) if (y % 3) c.set(x + (y > 30 ? 1 : 0), y, hex('#6a8aa0')); // folds
      } else {
        // looped back: it is night inside the folds
        c.poly([[3, 3], [18, 3], [16, 18], [9, 22], [5, 21], [4, 12]], MARK);
        c.poly([[5, 23], [9, 23], [13, b], [3, b]], MARK);
        fill(c, nightAt(3));
        c.rect(4, 21, 10, 22, C.gold);
        c.col(11, 22, 26, C.gold);
        for (let y = 5; y <= 18; y++) if (y % 3) c.set(10, y, hex('#3a456a'));
      }
      c.rect(1, 1, 20, 2, WD);
      c.set(0, 1, C.brass);
      c.set(21, 1, C.brass);
    },
    sw: 10,
    s(c, u) {
      const b = 42;
      c.rect(3, 3, 6, u ? 22 : b, MARK);
      if (u) c.rect(3, 23, 5, b, MARK);
      fill(c, u ? nightAt(3) : dayAt(2));
      if (u) c.rect(2, 21, 7, 22, C.gold);
      c.rect(4, 1, 5, 2, WD);
    },
  });

  O('surreal-sleigh-bell-floating', 'giant sleigh bell floating over the floor iron jingle bell as big as a boulder with a slit surreal', {
    w: 26, h: 36, solid: false,
    f(c, u) {
      const b = 34,
        k = u ? 4 : 0, // it has sunk towards you and rings
        I = hex('#6a6a70');
      c.oval(2, 2 + k, 23, 23 + k, I);
      for (let y = 2 + k; y <= 23 + k; y++) for (let x = 2; x <= 23; x++) if (c.get(x, y) === I) {
        const d = (x - 2) / 22 + (y - 2 - k) / 22;
        if (d > 1.3) c.set(x, y, D(I));
        else if (d < 0.55 && d > 0.4) c.set(x, y, L(I));
      }
      c.rect(4, 15 + k, 21, 16 + k, NI); // the slit, and its two round ends
      c.oval(3, 14 + k, 6, 17 + k, NI);
      c.oval(19, 14 + k, 22, 17 + k, NI);
      c.col(12, 16 + k, 21 + k, NI);
      c.row(b, u ? 5 : 8, u ? 20 : 17, NI); // shadow
      return () => u && (notes(c, 1, 9, MOON), dots(c, MOON, [24, 6, 25, 3, 23, 1]));
    },
    s: 'same',
  });

  O('surreal-candle-like-a-worm', 'candle that crawls a long wax candle curling over the floor like a worm its flame for a head surreal', {
    w: 36, h: 16, base: 'side', solid: false,
    f(c, u) {
      const b = 14,
        WX = hex('#d2c8a4');
      for (let x = 3; x <= 30; x++) {
        const y = b - 1 - Math.round(3 * Math.abs(Math.sin((x - 3) / 4.5)));
        c.col(x, y, y + 1, WX);
        c.set(x, y, C.white);
        if (x % 5 === 0) c.set(x, y + 1, D(WX));
      }
      c.rect(30, 5, 32, b - 3, WX); // the head reared up
      c.col(30, 5, b - 3, C.white);
      c.set(31, 4, NI);
      if (u) {
        c.rect(30, 1, 32, 3, C.flame);
        c.col(31, 0, 3, C.flameLight);
        dots(c, WX, [33, 7, 33, 9, 29, b]); // it drips as it goes
      }
      return () => u && dots(c, MOON, [28, 1, 34, 2, 31, -1, 27, 5, 35, 5]);
    },
    sw: 12,
    s(c, u) {
      const b = 14,
        WX = hex('#d2c8a4');
      c.rect(4, 5, 7, b, WX); // coming at you
      c.col(4, 5, b, C.white);
      c.oval(3, b - 3, 8, b, D(WX));
      c.set(5, 4, NI);
      c.set(6, 4, NI);
      if (u) {
        c.rect(4, 1, 7, 3, C.flame);
        c.rect(5, 0, 6, 3, C.flameLight);
      }
      return () => u && dots(c, MOON, [2, 1, 9, 2, 1, 5, 10, 6]);
    },
  });

  O('surreal-stone-chair-with-tiny-chair', 'giant rough stone chair with a tiny wooden chair standing on its seat legend of the centuries surreal', {
    w: 28, h: 48,
    f(c, u) {
      const b = 46;
      c.rect(4, 2, 23, 30, STONE); // back
      c.rect(2, 26, 25, 31, STONE); // seat
      c.rect(3, 31, 7, b, STONE);
      c.rect(20, 31, 24, b, STONE);
      c.col(4, 2, 30, L(STONE));
      c.row(26, 2, 25, L(STONE));
      c.rect(8, 6, 19, 22, D(STONE));
      c.rect(8, 32, 19, 34, D(STONE));
      const r = rnd(6);
      for (let i = 0; i < 30; i++) {
        const x = 3 + ((r() * 21) | 0),
          y = 3 + ((r() * 42) | 0);
        if (c.get(x, y) === STONE) c.set(x, y, r() < 0.5 ? D(STONE) : L(STONE));
      }
      dots(c, P.GRASS, [5, 40, 22, 38, 6, 44]);
      const little = (x, y) => {
        c.col(x, y - 8, y, WL);
        c.col(x + 4, y - 3, y, WL);
        c.rect(x, y - 4, x + 4, y - 4, WL);
        c.rect(x, y - 8, x + 3, y - 7, WL);
        c.set(x + 3, y - 6, WL);
      };
      if (!u) little(11, 25);
      else {
        // knocked off; it lies between the great legs
        c.rect(10, b - 1, 18, b - 1, WL);
        c.col(14, b - 4, b, WL);
        c.col(18, b - 3, b, WL);
        c.rect(10, b - 2, 11, b, WL);
        dots(c, D(STONE), [12, 26, 13, 26, 14, 26]);
      }
    },
    sw: 22,
    s(c, u) {
      const b = 46;
      c.rect(3, 2, 8, 30, STONE);
      c.rect(3, 26, 19, 31, STONE);
      c.rect(3, 31, 7, b, STONE);
      c.rect(15, 31, 19, b, STONE);
      c.col(3, 2, b, L(STONE));
      c.row(26, 9, 19, L(STONE));
      const r = rnd(8);
      for (let i = 0; i < 22; i++) {
        const x = 3 + ((r() * 16) | 0),
          y = 3 + ((r() * 42) | 0);
        if (c.get(x, y) === STONE) c.set(x, y, r() < 0.5 ? D(STONE) : L(STONE));
      }
      if (!u) {
        c.col(11, 17, 25, WL);
        c.col(15, 22, 25, WL);
        c.row(21, 11, 15, WL);
      } else {
        c.rect(9, b - 1, 14, b - 1, WL);
        c.col(9, b - 4, b, WL);
        c.col(12, b - 3, b, WL);
      }
    },
  });

  O('surreal-coffin-sitting-on-sofa', 'large coffin sitting up on a day bed bent at the hips like a lady reclining chaise longue madame recamier surreal', {
    w: 46, h: 34, base: 'side',
    f(c, u) {
      const b = 32,
        CF = hex('#6f4a34'),
        UP = hex('#5a6a5a');
      // the day bed: scroll end left, long seat, turned legs
      c.rect(4, 20, 42, 23, UP);
      c.row(20, 4, 42, L(UP));
      c.rect(3, 24, 43, 25, WD);
      c.poly([[3, 20], [3, 9], [6, 7], [8, 9], [7, 20]], UP);
      c.oval(2, 6, 7, 10, WD);
      c.set(4, 8, WL);
      for (const x of [5, 40]) {
        c.rect(x, 26, x + 1, b, WD);
        c.set(x, 28, WL);
      }
      c.rect(34, 17, 42, 19, hex('#8a5a5e')); // a bolster
      // the coffin: head part leaning on the scroll, the rest laid along the seat
      c.poly([[7, 6], [11, 3], [16, 5], [18, 19], [10, 19]], CF);
      c.poly([[10, 13], [36, 13], [38, 15], [38, 19], [10, 19]], CF);
      c.line(7, 6, 11, 3, L(CF));
      c.row(13, 17, 36, L(CF));
      c.line(11, 7, 14, 17, D(CF)); // lid seam
      c.row(16, 16, 37, D(CF));
      dots(c, C.brass, [20, 17, 28, 17, 35, 17, 12, 12]);
      c.rect(12, 8, 13, 9, C.brass); // plate
      if (u) {
        // the lid has moved; a fold of white hangs out
        c.row(15, 16, 37, NI);
        c.rect(22, 16, 27, 18, PORC);
        c.rect(24, 19, 27, 26, PORC);
        c.col(27, 19, 26, D(PORC));
        c.rect(28, 12, 33, 12, NI);
      }
      // a lamp stand beside it
      c.col(44, 8, b, C.brass);
      c.rect(43, 6, 45, 8, u ? C.flameLight : hex('#8a7a64'));
      c.rect(42, b, 45, b, C.brass);
    },
    sw: 20,
    s(c, u) {
      const b = 32,
        CF = hex('#6f4a34'),
        UP = hex('#5a6a5a');
      c.rect(3, 20, 16, 23, UP);
      c.row(20, 3, 16, L(UP));
      c.rect(2, 24, 17, 25, WD);
      c.rect(3, 26, 4, b, WD);
      c.rect(15, 26, 16, b, WD);
      // the foot of the coffin towards you, the head sitting up behind
      c.poly([[6, 3], [13, 3], [15, 8], [14, 13], [5, 13], [4, 8]], CF);
      c.line(6, 3, 4, 8, L(CF));
      c.rect(8, 6, 11, 7, C.brass);
      c.rect(5, 13, 14, 19, D(CF));
      c.rect(6, 14, 13, 19, CF);
      c.row(14, 6, 13, L(CF));
      c.set(9, 17, C.brass);
      c.set(10, 17, C.brass);
      if (u) {
        c.row(15, 6, 13, NI);
        c.rect(11, 16, 13, 24, PORC);
        c.col(13, 17, 24, D(PORC));
      }
    },
  });

  O('surreal-window-broken-sky', 'window whose broken panes carry the view with them shards of sky on the floor key to the fields surreal', {
    w: 28, h: 44,
    f(c, u) {
      const b = 42,
        WALL = hex('#8a7a6a');
      c.rect(2, 2, 25, b, WALL);
      c.col(2, 2, b, L(WALL));
      c.rect(2, b - 4, 25, b, D(WALL));
      c.rect(5, 6, 22, 30, PORC); // frame
      c.rect(4, 31, 23, 32, PORC); // sill
      // the view: sky, far hills, a tree
      day(c, 7, 8, 20, 28, 4);
      c.rect(7, 23, 20, 28, hex('#5f7a5a'));
      c.row(23, 7, 20, hex('#7f9a70'));
      c.oval(15, 16, 19, 22, hex('#46604a'));
      c.col(17, 22, 24, hex('#5a4638'));
      c.col(13, 8, 28, PORC);
      c.row(18, 7, 20, PORC);
      // curtains
      c.rect(3, 5, 5, 31, hex('#8a3a3a'));
      c.rect(22, 5, 24, 31, hex('#8a3a3a'));
      c.col(4, 6, 30, hex('#6a2a2e'));
      c.col(23, 6, 30, hex('#6a2a2e'));
      if (u) {
        // a stone came through: behind the glass the view is just the same; the pieces took their sky with them
        c.poly([[9, 12], [13, 9], [18, 13], [16, 21], [10, 22], [7, 17]], hex('#8fb0c4'));
        c.poly([[10, 13], [13, 11], [16, 14], [15, 19], [11, 20], [9, 17]], hex('#a9c4d0'));
        c.line(9, 12, 7, 9, NI);
        c.line(18, 13, 20, 11, NI);
        c.line(10, 22, 8, 26, NI);
        const shard = (pts, s) => {
          const t = part(28, 12, (t) => {
            t.poly(pts, MARK);
            repaint(t, 0, 0, 27, 11, MARK, dayAt(s));
          });
          c.stamp(t, 0, b - 11);
        };
        shard([[6, 11], [8, 3], [11, 11]], 1);
        shard([[13, 11], [16, 5], [19, 8], [18, 11]], 3);
        shard([[20, 11], [22, 6], [24, 11]], 2);
        dots(c, DAYl, [4, b, 12, b, 25, b - 1]);
      }
    },
    sw: 10,
    s(c, u) {
      const b = 42,
        WALL = hex('#8a7a6a');
      c.rect(2, 2, 5, b, WALL);
      c.col(2, 2, b, L(WALL));
      c.rect(2, b - 4, 5, b, D(WALL));
      c.rect(6, 6, 6, 30, PORC);
      c.rect(6, 31, 7, 32, PORC);
      c.col(7, 5, 30, hex('#8a3a3a'));
      if (u) {
        c.poly([[6, b], [7, b - 7], [8, b]], DAY);
        c.set(7, b - 3, C.white);
        dots(c, DAYl, [9, b]);
      }
    },
  });

  O('surreal-fish-with-legs', 'fish with the legs of a person lying on the sand a mermaid the wrong way round collective invention surreal', {
    w: 42, h: 18, base: 'side', uw: 18, uh: 40, udy: 0,
    f(c, u) {
      const FISH = hex('#8a9a9c'),
        SK = hex('#c9a98c');
      if (!u) {
        const b = 16;
        c.rect(1, b - 1, 40, b, SAND);
        dots(c, D(SAND), [5, b, 18, b, 33, b]);
        // head left, tail end is legs
        c.poly([[2, 10], [6, 6], [14, 5], [22, 6], [22, 14], [8, 14], [3, 12]], FISH);
        c.line(6, 6, 14, 5, L(FISH));
        c.oval(5, 7, 8, 10, PORC);
        c.set(6, 9, NI);
        c.row(12, 3, 6, NI);
        c.col(11, 7, 13, D(FISH));
        for (let y = 7; y <= 13; y += 2) for (let x = 13; x <= 20; x += 2) c.set(x + (y % 4 ? 0 : 1), y, D(FISH));
        c.poly([[14, 5], [17, 2], [19, 5]], D(FISH));
        c.rect(22, 7, 31, 13, SK); // hips, thighs
        c.rect(31, 9, 38, 13, SK);
        c.row(10, 23, 37, D(SK));
        c.rect(38, 8, 39, 13, SK); // feet
        c.rect(39, 7, 40, 8, SK);
        c.row(13, 22, 38, D(SK));
        c.row(14, 9, 38, blend(SAND, NI, 0.4));
      } else {
        // it has got up
        const b = 38;
        c.rect(1, b, 16, b, SAND);
        c.poly([[5, 4], [9, 1], [12, 4], [13, 14], [12, 20], [5, 20], [4, 14]], FISH);
        c.col(5, 5, 19, L(FISH));
        c.oval(9, 4, 12, 7, PORC);
        c.set(11, 6, NI);
        c.row(9, 11, 13, NI);
        c.row(11, 5, 12, D(FISH));
        for (let y = 13; y <= 19; y += 2) for (let x = 6; x <= 11; x += 2) c.set(x + (y % 4 ? 0 : 1), y, D(FISH));
        c.poly([[4, 10], [1, 13], [4, 15]], D(FISH)); // a fin, held out for balance
        c.rect(5, 21, 12, 25, SK);
        c.rect(5, 26, 7, b - 1, SK);
        c.rect(10, 26, 12, b - 1, SK);
        c.col(8, 24, 26, D(SK));
        c.rect(5, b - 1, 8, b - 1, SK);
        c.rect(10, b - 1, 14, b - 1, SK);
        c.col(12, 22, b - 2, D(SK));
        dots(c, SEAl, [3, 24, 14, 22, 2, 30]);
      }
    },
    sw: 16, sh: 18, suw: 16, suh: 40, sudy: 0,
    s(c, u) {
      const FISH = hex('#8a9a9c'),
        SK = hex('#c9a98c');
      if (!u) {
        const b = 16;
        c.rect(1, b - 1, 14, b, SAND);
        // head on, lying
        c.oval(3, 4, 12, 14, FISH);
        c.oval(3, 7, 5, 9, PORC);
        c.oval(10, 7, 12, 9, PORC);
        c.set(4, 8, NI);
        c.set(11, 8, NI);
        c.row(12, 6, 9, NI);
        c.row(5, 6, 9, L(FISH));
        c.rect(7, 2, 8, 4, D(FISH));
        c.rect(13, 12, 14, 14, SK); // a foot showing behind
      } else {
        const b = 38;
        c.rect(1, b, 14, b, SAND);
        c.oval(3, 1, 12, 20, FISH);
        c.col(4, 6, 16, L(FISH));
        c.oval(3, 6, 5, 8, PORC);
        c.oval(10, 6, 12, 8, PORC);
        c.set(4, 7, NI);
        c.set(11, 7, NI);
        c.row(11, 6, 9, NI);
        c.rect(1, 12, 2, 15, D(FISH));
        c.rect(13, 12, 14, 15, D(FISH));
        c.rect(4, 21, 11, 25, SK);
        c.rect(4, 26, 6, b - 1, SK);
        c.rect(9, 26, 11, b - 1, SK);
        c.rect(3, b - 1, 6, b - 1, SK);
        c.rect(9, b - 1, 12, b - 1, SK);
        c.col(7, 24, 26, D(SK));
      }
    },
  });

  O('surreal-violin-woman-torso', 'plaster back of a seated woman with the sound holes of a violin statue on a plinth violon surreal', {
    w: 20, h: 44,
    f(c, u) {
      const b = 42;
      c.rect(3, b - 6, 16, b, MARB);
      c.row(b - 6, 3, 16, L(MARB));
      c.row(b, 3, 16, D(MARB));
      // turban, neck, back, hips
      c.oval(6, 1, 13, 8, hex('#b8a47c'));
      c.row(4, 6, 13, hex('#8a5a5e'));
      c.rect(8, 8, 11, 10, PLASTER);
      c.poly([[5, 11], [14, 11], [15, 18], [13, 24], [16, 31], [15, b - 7], [4, b - 7], [3, 31], [6, 24], [4, 18]], PLASTER);
      c.col(5, 12, 22, C.white);
      c.col(9, 12, 34, D(PLASTER)); // spine
      // the f holes
      for (const x of [6, 12]) {
        c.col(x, 23, 29, NI);
        c.set(x + (x < 9 ? 1 : -1), 22, NI);
        c.set(x + (x < 9 ? -1 : 1), 30, NI);
        c.set(x + (x < 9 ? -1 : 1), 26, NI);
      }
      if (u) {
        // strung, and a bow left across her
        c.col(8, 12, 33, PORC);
        c.col(10, 12, 33, PORC);
        c.line(1, 30, 18, 22, WD);
        c.line(1, 31, 18, 23, PORC);
      }
      return () => u && notes(c, 15, 10, MOON);
    },
    sw: 14,
    s(c, u) {
      const b = 42;
      c.rect(2, b - 6, 11, b, MARB);
      c.row(b - 6, 2, 11, L(MARB));
      c.oval(4, 1, 10, 8, hex('#b8a47c'));
      c.row(4, 4, 10, hex('#8a5a5e'));
      c.set(11, 6, PLASTER);
      c.rect(5, 8, 8, 10, PLASTER);
      c.poly([[4, 11], [9, 11], [11, 16], [9, 24], [10, 31], [12, b - 7], [3, b - 7], [3, 24]], PLASTER);
      c.col(4, 12, 30, C.white);
      c.poly([[9, 30], [13, 31], [13, b - 7], [9, b - 7]], PLASTER); // her lap
      if (u) {
        c.col(3, 12, 33, PORC);
        c.line(1, 26, 6, 24, WD);
      }
    },
  });

  O('surreal-plant-with-bird-leaves', 'pot plant whose leaves are small green birds growing on the stems natural graces surreal', {
    w: 24, h: 38, uh: 46,
    f(c, u) {
      const b = 36;
      c.poly([[7, b - 8], [16, b - 8], [15, b], [8, b]], hex('#9c5a48'));
      c.rect(6, b - 9, 17, b - 8, hex('#b06a54'));
      c.col(8, b - 7, b - 1, hex('#b06a54'));
      c.col(11, 10, b - 9, LEAF);
      c.line(11, 22, 6, 14, LEAF);
      c.line(12, 20, 17, 13, LEAF);
      const bird = (x, y, flipd, col = LEAF) => {
        // a leaf with a head and a beak
        const s = flipd ? -1 : 1;
        c.oval(x - 3, y - 2, x + 3, y + 2, col);
        c.set(x - 4 * s, y - 1, col);
        c.set(x + 3 * s, y - 3, col);
        c.set(x + 4 * s, y - 3, col);
        c.set(x + 5 * s, y - 3, hex('#b8963a'));
        c.set(x + 3 * s, y - 3, NI);
        c.row(y, x - 2, x + 2, D(col));
        c.set(x + 4 * s, y - 2, col);
        c.set(x + 3 * s, y - 2, col);
      };
      bird(6, 12, true);
      bird(17, 11, false);
      bird(7, 22, true, hex('#5f7a52'));
      if (!u) bird(12, 6, false, hex('#5f7a52'));
      else c.set(11, 9, hex('#8fa86a')); // the top one has let go of its stalk
      return () => {
        if (!u) return;
        const t = part(14, 9, (t) => {
          t.oval(4, 3, 9, 6, hex('#5f7a52'));
          t.poly([[5, 3], [2, 0], [8, 2]], LEAF); // wings up
          t.set(10, 3, hex('#5f7a52'));
          t.set(11, 3, hex('#5f7a52'));
          t.set(12, 3, hex('#b8963a'));
          t.set(10, 2, NI);
        });
        t.outline();
        c.stamp(t, 9, -9);
        dots(c, LEAF, [10, 3, 14, 5]);
      };
    },
    s: 'same',
  });

  O('surreal-umbrella-with-glass-on-top', 'open umbrella with a full glass of water standing on top of it hegel holiday surreal', {
    w: 28, h: 46,
    f(c, u) {
      const b = 44,
        UM = hex('#3a3440');
      c.col(13, 14, b - 3, WD);
      c.rect(13, b - 2, 16, b - 2, WD); // crook
      c.col(16, b - 4, b - 2, WD);
      c.poly([[13, 9], [14, 9], [26, 20], [1, 20]], UM);
      for (const x of [5, 10, 17, 22]) c.line(13, 9, x, 20, hex('#55515c'));
      for (let x = 1; x <= 26; x += 5) c.set(x + 2, 21, UM);
      c.line(13, 9, 1, 20, hex('#55515c'));
      // the glass
      if (!u) {
        c.rect(11, 2, 16, 8, hex('#9ebcc2'));
        c.rect(12, 4, 15, 7, SEA);
        c.row(4, 12, 15, SEAl);
        c.col(11, 2, 8, C.white);
      } else {
        // it went over: the umbrella is doing what it is for
        c.rect(15, 5, 21, 8, hex('#9ebcc2'));
        c.col(21, 5, 8, C.white);
        c.rect(9, 8, 14, 8, SEA);
        for (const [x, y] of [[8, 12], [5, 16], [3, 19], [11, 13], [10, 18]]) c.set(x, y, SEAl);
      }
      c.row(b, 9, 19, NI);
      return () => u && (dots(c, SEAl, [1, 23, 1, 27, 2, 32, 7, 24, 7, 30]), c.row(b, 1, 7, SEA));
    },
    s: 'same',
  });

  O('surreal-moon-in-front-of-tree', 'dark tree with the crescent moon hanging in front of its leaves not behind sixteenth of september surreal', {
    w: 30, h: 48,
    f(c, u) {
      const b = 46,
        TR = hex('#2f3f38');
      c.rect(13, 28, 16, b, hex('#3a2c26'));
      c.rect(10, b - 1, 19, b, hex('#3a2c26'));
      c.oval(2, 2, 27, 32, TR);
      const r = rnd(12);
      for (let i = 0; i < 60; i++) {
        const x = 2 + ((r() * 26) | 0),
          y = 2 + ((r() * 30) | 0);
        if (c.get(x, y) === TR) c.set(x, y, r() < 0.6 ? D(TR) : L(TR));
      }
      // the moon, on this side of it
      if (!u) {
        c.oval(11, 10, 18, 17, MOON);
        for (let y = 10; y <= 17; y++) for (let x = 11; x <= 18; x++) if (((x - 16.5) / 3.6) ** 2 + ((y - 13.5) / 3.8) ** 2 <= 1) c.set(x, y, TR);
      } else {
        c.oval(10, 9, 19, 18, MOON); // full, as you watch
        dots(c, MOONd, [13, 12, 16, 15, 14, 16]);
        c.set(12, 11, C.white);
      }
      return () => u && dots(c, MOON, [8, 13, 21, 13, 14, 7, 14, 20, 9, 9, 20, 18]);
    },
    s: 'same',
  });

  O('surreal-house-night-under-day', 'house front in the dark with a lit street lamp under a bright day sky empire of light flat surreal', {
    w: 32, h: 48,
    f(c, u) {
      const b = 46,
        HS = hex('#2c2a36');
      day(c, 2, 2, 29, 20, 6);
      // black trees and roof against the day
      c.oval(1, 12, 12, 26, hex('#1e2420'));
      c.oval(20, 9, 30, 24, hex('#1e2420'));
      c.poly([[8, 22], [15, 16], [24, 22]], hex('#201e28'));
      c.rect(8, 22, 24, b, HS);
      c.rect(2, 26, 29, b, hex('#1a1820'));
      c.rect(8, 22, 24, b - 2, HS);
      c.rect(18, 15, 20, 19, hex('#201e28'));
      // windows and door
      for (const [x, y] of [[10, 25], [19, 25]]) {
        c.rect(x, y, x + 3, y + 5, u ? WARM : hex('#1a1820'));
        c.col(x + 2, y, y + 5, HS);
      }
      c.rect(10, 34, 13, 39, u ? hex('#1a1820') : WARM); // one lit, low down
      c.col(12, 34, 39, HS);
      c.rect(19, 35, 22, b - 2, hex('#1a1820'));
      // the street lamp
      c.col(27, 28, b, C.iron);
      c.rect(26, 24, 28, 27, u ? hex('#3a3848') : C.flameLight);
      c.rect(26, 23, 28, 23, C.iron);
      c.rect(2, b - 1, 29, b, hex('#3a3848'));
      if (!u) {
        dots(c, hex('#5a5468'), [24, 30, 25, 33, 23, 36, 29, 31]);
        c.row(b - 1, 22, 29, hex('#6a6478'));
      }
      return () => !u && dots(c, MOON, [24, 25, 30, 25, 27, 21]);
    },
    sw: 12,
    s(c, u) {
      const b = 46;
      c.rect(3, 2, 5, b, hex('#8a8478')); // a flat: a painted board, propped
      c.col(3, 2, 20, DAY);
      c.col(3, 21, b, hex('#2c2a36'));
      c.line(6, 14, 10, b, WD);
      c.rect(2, b - 1, 10, b, WD);
      c.set(2, 25, u ? hex('#3a3848') : C.flameLight);
    },
  });
};
