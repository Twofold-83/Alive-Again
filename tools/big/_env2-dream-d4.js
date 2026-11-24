/* Dream world II, part 4: small things grown huge, and things that grow where they should not. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, flip, thin, cloud, star, ring, shadowed, grass, water, repaint, nightAt, night, wheel, flame, clock, eye, notes } = H;
  const { CLD, NI, SKY, MOON, MOONd, OUT, LILAC, ROSE, DBLUE, PORC, GRASS, GRASSd, SEA, SEAl, BRICK } = P;
  const W = C.wood,
    WD = C.woodDark,
    WL = C.woodLight,
    WP = C.woodPale,
    WH = hex('#d9d5c8'),
    WARM = hex('#d9b45a'),
    LEAF = hex('#46604a'),
    GLASS = hex('#8fb0b4'),
    STEM = hex('#5f7048');

  O('dream-thread-spool-giant', 'giant spool of thread wooden cotton reel as big as a stool red thread and a needle dream', {
    w: 22, h: 26, uw: 30,
    f(c, u) {
      const b = 24,
        T = hex('#8f3a3a');
      c.rect(3, 4, 16, 6, WP);
      c.rect(3, b - 2, 16, b, WP);
      c.row(4, 3, 16, L(WP));
      c.row(b, 3, 16, D(WP));
      c.rect(u ? 6 : 5, 7, u ? 13 : 14, b - 3, T);
      for (let y = 8; y <= b - 4; y += 2) c.row(y, u ? 6 : 5, u ? 13 : 14, D(T));
      c.col(u ? 6 : 5, 7, b - 3, L(T));
      if (u) {
        c.rect(5, 7, 5, b - 3, W);
        c.rect(14, 7, 14, b - 3, W);
      }
      // the needle stuck through
      c.line(18, 1, 11, 12, C.steel);
      c.set(18, 1, C.white);
      return () => {
        if (!u) return dots(c, T, [19, 2, 20, 3, 20, 5, 19, 7]);
        // a long thread pulled off and away
        let y = 14;
        for (let x = 15; x <= 28; x++) {
          c.set(x, y, T);
          if (x % 3 === 0 && y < b) y += x < 22 ? 2 : 1;
        }
        c.row(b, 24, 29, T);
      };
    },
    sw: 22, suw: 30,
    s(c, u) {
      const b = 24,
        T = hex('#8f3a3a');
      // end on: the round flange with its hole
      c.oval(2, 5, 17, b, WP);
      ring(c, 2, 5, 17, b, D(WP));
      c.oval(5, 8, 14, b - 3, u ? W : T);
      c.oval(7, 10, 12, b - 5, WP);
      c.oval(8, 12, 11, b - 7, NI);
      c.line(18, 1, 12, 10, C.steel);
      c.set(18, 1, C.white);
      return () => {
        if (!u) return dots(c, T, [19, 2, 20, 4, 19, 6]);
        for (let x = 16; x <= 28; x++) c.set(x, 18 + Math.round((x - 16) / 2.4), T);
        c.row(b, 26, 29, T);
      };
    },
  });

  O('dream-matchbox-bed', 'matchbox bed giant matchbox with its drawer pulled out as a bed pillow and blanket dream', {
    w: 36, h: 18, base: 'side',
    f(c, u) {
      const b = 16,
        BX = hex('#5a6a84'),
        Q = hex('#8a5a5e');
      // the drawer, pulled out
      c.rect(4, 8, 20, b, WP);
      c.row(8, 4, 20, L(WP));
      c.row(b, 4, 20, D(WP));
      c.col(4, 8, b, L(WP));
      c.rect(6, 6, 10, 7, WH); // pillow
      if (!u) {
        c.rect(11, 6, 19, 7, Q);
        c.row(6, 11, 19, L(Q));
      } else {
        c.rect(15, 4, 19, 7, Q); // thrown back
        c.row(4, 15, 18, L(Q));
        c.rect(11, 7, 14, 7, WH);
        c.set(8, 6, D(WH));
      }
      // the sleeve
      c.rect(18, 4, 33, b, BX);
      c.row(4, 18, 33, L(BX));
      c.col(18, 4, b, L(BX));
      c.rect(21, 6, 31, 12, SKY); // the label: a moon
      c.oval(23, 7, 28, 12, MOON);
      c.oval(25, 6, 30, 11, SKY);
      dots(c, MOON, [22, 7, 30, 11]);
      c.rect(18, b - 1, 33, b, hex('#6a4a3a')); // striking strip
      if (u) {
        c.col(2, 7, b, WP); // a match struck and stood up for a night light
        c.rect(2, 5, 2, 6, C.blood);
      }
      return () => u && (flame(c, 2, 4, 3), dots(c, MOON, [0, 2, 4, 1]));
    },
    sw: 18,
    s(c, u) {
      const b = 16,
        BX = hex('#5a6a84');
      c.rect(2, 5, 15, b, BX);
      c.row(5, 2, 15, L(BX));
      c.rect(4, 7, 13, b - 1, WP); // the end of the drawer
      c.row(7, 4, 13, L(WP));
      c.set(8, 11, D(WP));
      c.set(9, 11, D(WP));
      if (u) {
        c.rect(4, 7, 13, 9, WH);
        c.rect(5, 6, 12, 6, WH); // the pillow shows over the end
      }
      if (u) c.col(1, 8, b, WP);
      return () => u && flame(c, 1, 6, 3);
    },
  });

  O('dream-bell-jar-tree', 'bell jar with a little tree under it glass dome on a wooden base weather inside dream', {
    w: 22, h: 34,
    f(c, u) {
      const b = 32;
      c.rect(2, b - 2, 19, b, WD);
      c.row(b - 2, 2, 19, W);
      c.oval(3, 3, 18, 20, GLASS);
      c.rect(3, 11, 18, b - 3, GLASS);
      c.oval(4, 4, 17, 20, blend(GLASS, NI, 0.5));
      c.rect(4, 11, 17, b - 3, blend(GLASS, NI, 0.5));
      c.col(4, 9, b - 5, L(GLASS));
      c.set(5, 6, C.white);
      c.rect(10, 0, 11, 2, GLASS);
      c.oval(9, 0, 12, 2, L(GLASS));
      // the tree
      c.col(10, 16, b - 3, hex('#5a4638'));
      c.col(11, 18, b - 3, hex('#5a4638'));
      c.line(10, 19, 7, 15, hex('#5a4638'));
      c.line(11, 18, 14, 14, hex('#5a4638'));
      if (!u) {
        c.oval(6, 8, 15, 17, LEAF);
        dots(c, L(LEAF), [8, 10, 11, 9, 13, 12, 9, 14]);
        dots(c, C.red, [8, 13, 12, 15, 13, 10]);
      } else {
        // winter came to it: bare twigs, snow
        dots(c, hex('#5a4638'), [6, 14, 7, 12, 14, 13, 15, 11, 10, 14, 10, 12, 12, 16, 9, 10]);
        c.rect(4, b - 5, 17, b - 3, C.white);
        dots(c, C.white, [6, b - 6, 7, b - 6, 12, b - 6, 15, b - 6, 6, 8, 9, 6, 13, 7, 15, 16, 7, 18, 12, 20, 14, 23, 8, 23, 6, 14, 11, 11]);
      }
    },
    s: 'same',
  });

  O('dream-pocket-watch-giant', 'giant pocket watch brass watch standing on its edge as tall as a child lid and chain dream', {
    w: 24, h: 32, uw: 34,
    f(c, u) {
      const b = 30,
        B = C.brass;
      c.rect(10, 1, 13, 3, B); // stem and ring
      ring(c, 9, 0, 14, 4, C.gold);
      c.oval(2, 6, 21, b, B);
      ring(c, 2, 6, 21, b, D(B));
      if (!u) {
        c.oval(4, 8, 19, b - 2, C.gold);
        ring(c, 6, 10, 17, b - 4, D(C.gold));
        ring(c, 9, 13, 14, b - 7, D(C.gold));
        dots(c, L(C.gold), [6, 12, 7, 11, 8, 10]);
      } else {
        clock(c, 11.5, 18, 8, PORC, 3, 11, D(B));
        dots(c, NI, [11, 11, 12, 11, 11, 25, 12, 25, 5, 18, 18, 18]);
        c.set(12, 18, C.blood);
        // the lid stands open to the right
        c.poly([[22, 9], [27, 7], [27, b - 3], [22, b - 4]], C.gold);
        c.col(27, 7, b - 3, D(C.gold));
        c.col(22, 10, b - 5, D(B));
        c.col(24, 11, b - 6, L(C.gold));
      }
      return () => {
        // the chain trails off
        for (let i = 0; i < 6; i++) c.set((u ? 28 : 18) + i, b - (i % 2), i % 2 ? D(B) : C.gold);
        if (u) dots(c, MOON, [1, 5, 0, 8]);
      };
    },
    sw: 10, suw: 16,
    s(c, u) {
      const b = 30,
        B = C.brass;
      c.rect(4, 1, 5, 4, B);
      c.rect(3, 6, 6, b, B);
      c.rect(4, 5, 5, 5, B);
      c.col(3, 8, b - 2, L(B));
      c.col(6, 8, b - 2, D(B));
      if (!u) c.col(7, 9, b - 3, C.gold);
      else {
        c.col(7, 10, b - 4, PORC);
        c.poly([[7, 7], [12, 4], [13, 5], [8, 9]], C.gold); // the lid lifted
        c.line(8, 9, 13, 5, D(C.gold));
      }
      return () => {
        for (let i = 0; i < 4; i++) c.set(8 + i, b - (i % 2), i % 2 ? D(B) : C.gold);
      };
    },
  });

  O('dream-shell-giant', 'giant sea shell conch as big as an armchair you can hear the sea in it pink inside dream', {
    w: 32, h: 24, base: 'side',
    f(c, u) {
      const b = 22,
        SH = hex('#c9b9a0'),
        IN = hex('#b7868a');
      // spire to the left, the mouth opening right
      c.poly([[1, 12], [8, 7], [16, 3], [25, 5], [30, 12], [28, b], [10, b], [4, 17]], SH);
      c.line(1, 12, 8, 7, L(SH));
      for (const [x0, y0, x1, y1] of [[6, 9, 8, 18], [10, 6, 12, b], [15, 4, 16, b]]) c.line(x0, y0, x1, y1, D(SH));
      dots(c, hex('#a07a5a'), [8, 12, 13, 9, 13, 15, 18, 6, 18, 12, 9, 16]);
      dots(c, SH, [9, 5, 14, 2, 20, 2, 26, 4]); // knobs on the shoulder
      c.poly([[19, 8], [27, 9], [28, b - 1], [20, b - 1], [17, 15]], IN);
      c.poly([[21, 11], [26, 12], [26, b - 2], [22, b - 2], [20, 16]], D(IN));
      c.line(19, 8, 17, 15, L(SH));
      if (u) {
        // the sea runs out of it
        c.rect(21, b - 3, 27, b - 1, SEA);
        c.row(b - 3, 21, 27, SEAl);
        c.rect(18, b, 31, b, SEA);
        dots(c, C.white, [22, b - 4, 25, b - 4, 29, b - 1]);
      }
      return () => u && dots(c, SEAl, [30, b - 2, 31, b - 3, 17, b + 1, 23, b + 1, 28, b + 1]);
    },
    sw: 20,
    s(c, u) {
      const b = 22,
        SH = hex('#c9b9a0'),
        IN = hex('#b7868a');
      // the mouth towards you
      c.poly([[9, 3], [14, 5], [18, 12], [16, b], [4, b], [2, 12], [5, 5]], SH);
      c.line(5, 5, 2, 12, L(SH));
      dots(c, SH, [4, 3, 9, 1, 15, 3]);
      c.oval(5, 7, 14, b - 1, IN);
      c.oval(7, 10, 12, b - 2, D(IN));
      dots(c, hex('#a07a5a'), [3, 15, 16, 14, 15, 8]);
      if (u) {
        c.rect(6, b - 4, 13, b - 1, SEA);
        c.row(b - 4, 6, 13, SEAl);
        c.row(b, 3, 17, SEA);
        dots(c, C.white, [8, b - 5, 11, b - 5]);
      }
      return () => u && dots(c, SEAl, [5, b + 1, 10, b + 1, 15, b + 1]);
    },
  });

  O('dream-moth-lamp', 'standard lamp with great moths floor lamp fringed shade pale moths circling the light dream', {
    w: 22, h: 44,
    f(c, u) {
      const b = 42,
        SHD = u ? hex('#d9c07a') : hex('#8a7a64');
      c.rect(10, 14, 11, b - 2, C.brass);
      c.col(10, 14, b - 2, L(C.brass));
      c.rect(6, b - 1, 15, b, C.brass);
      c.rect(8, b - 2, 13, b - 2, C.brass);
      c.poly([[7, 3], [14, 3], [18, 13], [3, 13]], SHD);
      c.line(7, 3, 3, 13, L(SHD));
      c.row(13, 3, 18, D(SHD));
      for (let x = 4; x <= 18; x += 2) c.set(x, 14, D(SHD));
      if (u) c.rect(9, 6, 12, 11, C.flameLight);
      const moth = (x, y, col) => {
        dots(c, col, [x - 2, y - 1, x - 1, y - 1, x - 1, y, x + 1, y - 1, x + 2, y - 1, x + 1, y, x - 2, y - 2, x + 2, y - 2, x - 1, y + 1, x + 1, y + 1]);
        c.set(x, y, NI);
        c.set(x, y - 1, NI);
      };
      if (!u) {
        moth(6, 20, hex('#b9b09a')); // resting on the pole and the shade
        moth(15, 8, hex('#a39a84'));
      }
      return () => {
        if (!u) return;
        moth(3, 5, hex('#b9b09a'));
        moth(19, 9, hex('#a39a84'));
        moth(16, 1, hex('#b9b09a'));
        moth(4, 18, hex('#a39a84'));
        dots(c, MOON, [1, 12, 20, 15, 10, 0]);
      };
    },
    s: 'same',
  });

  function snowman(c, u, side) {
    const b = 28,
      SN = hex('#d6d8d8'),
      m = side ? 8 : 9;
    if (!u) {
      c.oval(m - 6, 16, m + 6, b, SN);
      c.oval(m - 4, 8, m + 4, 17, SN);
      c.oval(m - 3, 2, m + 3, 9, SN);
      dots(c, D(SN), [m + 3, 22, m + 4, 20, m + 2, 13, m + 1, 25]);
      dots(c, NI, side ? [m + 1, 4, m + 3, 12, m + 4, 15] : [m - 1, 4, m + 1, 4, m, 11, m, 14]);
      if (side) c.rect(m + 4, 5, m + 6, 5, C.flame);
      else c.rect(m, 5, m + 1, 6, C.flame);
      c.row(9, m - 3, m + 3, C.wine); // scarf
      c.col(m + (side ? -2 : 2), 9, 13, C.wine);
      c.rect(m - 2, 0, m + 2, 1, P.FELT);
      c.row(2, m - 3, m + 3, P.FELT);
    } else {
      // summer has had half of him
      c.oval(m - 6, 20, m + 6, b, SN);
      c.oval(m - 3, 15, m + 3, 21, SN);
      dots(c, D(SN), [m + 3, 24, m + 1, 26, m + 2, 18]);
      dots(c, NI, side ? [m + 1, 17] : [m - 1, 17, m + 1, 17]);
      if (side) c.rect(m + 3, 19, m + 5, 19, C.flame);
      else c.set(m, 19, C.flame);
      c.row(21, m - 4, m + 3, C.wine);
      c.rect(m - 5, b - 1, m - 2, b, P.FELT); // his hat fell off
      c.row(b, m - 6, m - 1, P.FELT);
    }
    grass(c, 1, side ? 16 : 18, b, side ? 3 : 2);
    c.set(side ? 13 : 16, b - 2, C.red);
    c.set(3, b - 2, MOON);
    return () => u && (c.row(b, m - 3, m + 7, SEAl), dots(c, SEAl, [m + 8, b - 1, m - 7, b - 3]));
  }
  O('dream-snowman-in-summer', 'snowman standing in a summer meadow hat scarf carrot nose slowly melting in the grass dream', {
    w: 20, h: 30,
    f: (c, u) => snowman(c, u, false),
    sw: 18,
    s: (c, u) => snowman(c, u, true),
  });

  O('dream-scarecrow-asleep', 'scarecrow asleep on its pole straw man old coat hat over its face crows field dream', {
    w: 30, h: 46,
    f(c, u) {
      const b = 44,
        COAT = hex('#5a5048'),
        SACK = hex('#b8a47c');
      c.rect(14, 8, 15, b, W);
      c.rect(3, 14, 26, 15, W);
      // coat
      c.rect(9, 13, 20, 30, COAT);
      c.rect(3, 13, 9, 17, COAT);
      c.rect(20, 13, 26, 17, COAT);
      c.col(14, 16, 30, D(COAT));
      dots(c, C.brass, [15, 18, 15, 22, 15, 26]);
      c.row(30, 9, 20, D(COAT));
      dots(c, C.straw, [2, 15, 1, 16, 2, 17, 27, 15, 28, 16, 27, 17, 10, 31, 12, 32, 17, 31, 19, 32, 13, 12, 16, 12]);
      c.rect(8, 20, 10, 21, hex('#7a5a3a')); // a patch
      // head: hanging forward in sleep, or lifted and looking
      const hy = u ? 3 : 6;
      c.oval(11, hy, 18, hy + 8, SACK);
      if (!u) {
        c.rect(9, hy + 1, 20, hy + 2, P.FELT); // hat pulled down
        c.rect(11, hy - 2, 18, hy, P.FELT);
        c.row(hy + 6, 13, 16, D(SACK));
      } else {
        c.rect(9, hy - 1, 20, hy, P.FELT);
        c.rect(11, hy - 3, 18, hy - 2, P.FELT);
        dots(c, NI, [13, hy + 3, 16, hy + 3]);
        for (let x = 12; x <= 17; x++) c.set(x, hy + 6, x % 2 ? NI : D(SACK)); // a stitched smile
      }
      // a crow on its arm; when it wakes the crow is off
      if (!u) {
        c.rect(22, 10, 25, 12, NI);
        c.set(26, 10, C.iron);
        c.set(21, 12, NI);
      }
      grass(c, 8, 21, b, 4);
      return () => {
        if (!u) return dots(c, CLD, [21, 4, 22, 2]);
        dots(c, NI, [24, 3, 25, 2, 26, 3, 27, 2, 28, 3, 2, 6, 3, 5, 4, 6, 5, 5]);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 44,
        COAT = hex('#5a5048'),
        SACK = hex('#b8a47c');
      c.rect(6, 8, 7, b, W);
      c.rect(4, 13, 9, 30, COAT);
      c.col(4, 13, 30, L(COAT));
      c.rect(5, 13, 8, 17, D(COAT)); // the arm end on
      c.set(6, 15, C.straw);
      c.set(7, 15, C.straw);
      dots(c, C.straw, [5, 31, 8, 32]);
      const hy = u ? 3 : 6,
        hx = u ? 0 : 2; // nodding forward
      c.oval(3 + hx, hy, 9 + hx, hy + 8, SACK);
      c.rect(2 + hx, hy + (u ? -1 : 1), 11 + hx, hy + (u ? 0 : 2), P.FELT);
      c.rect(3 + hx, hy - (u ? 3 : 2), 9 + hx, hy - (u ? 2 : 0), P.FELT);
      if (u) c.set(9, hy + 3, NI);
      grass(c, 2, 11, b, 5);
      return () => (u ? dots(c, NI, [10, 9, 11, 8, 12, 9]) : dots(c, CLD, [12, 4, 13, 2]));
    },
  });

  O('dream-dandelion-giant', 'giant dandelion clock seed head taller than a person white fluff blowing away dream', {
    w: 20, h: 48, uw: 28,
    f(c, u) {
      const b = 46;
      c.col(9, 16, b, STEM);
      c.col(10, 20, b, D(STEM));
      c.poly([[9, b], [3, b - 6], [5, b - 2]], LEAF);
      c.poly([[10, b], [16, b - 5], [14, b - 1]], LEAF);
      c.oval(7, 8, 12, 13, hex('#8a7a5a')); // the bare head
      const seed = (a, r, col = WH) => {
        const x = 9.5 + r * Math.sin(a),
          y = 10.5 - r * Math.cos(a);
        c.line(9.5 + 3 * Math.sin(a), 10.5 - 3 * Math.cos(a), x, y, CLD);
        dots(c, col, [x, y, x - 1, y, x + 1, y, x, y - 1]);
      };
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        if (u && Math.sin(a) > -0.2) continue; // the wind took one side
        seed(a, 8);
      }
      if (!u) for (let i = 0; i < 6; i++) seed((i * Math.PI) / 3 + 0.3, 5, C.white);
      grass(c, 2, 17, b, 3);
      return () => {
        if (!u) return;
        const fly = (x, y) => dots(c, WH, [x, y, x - 1, y - 1, x + 1, y - 1, x, y - 1, x, y + 1, x, y + 2]);
        fly(17, 5);
        fly(22, 9);
        fly(25, 3);
        fly(20, 16);
        fly(26, 14);
      };
    },
    s: 'same',
  });

  O('dream-mushroom-lamp', 'mushroom lamp tall pale toadstool that glows like a bedside lamp spots dream', {
    w: 24, h: 32,
    f(c, u) {
      const b = 30,
        CAP = u ? hex('#c9a45a') : hex('#8a5a5e'),
        ST = hex('#cfc8b4');
      c.poly([[9, 14], [14, 14], [15, b], [8, b]], ST);
      c.col(9, 15, b, L(ST));
      c.row(15, 9, 14, D(ST));
      c.rect(8, 19, 15, 19, D(ST)); // the ring
      c.oval(1, 3, 22, 20, CAP);
      c.clearRect(0, 15, 23, 22);
      c.rect(2, 13, 21, 14, u ? C.flameLight : D(CAP));
      for (let x = 3; x <= 20; x += 2) c.set(x, 14, u ? CAP : D(D(CAP))); // gills
      c.poly([[9, 15], [14, 15], [15, b], [8, b]], ST);
      c.col(9, 15, b, L(ST));
      c.rect(8, 19, 15, 19, D(ST));
      dots(c, u ? C.white : PORC, [5, 8, 6, 8, 5, 9, 11, 5, 12, 5, 16, 9, 17, 9, 17, 10, 9, 11, 19, 12, 3, 12]);
      // two small ones at its foot
      c.rect(4, b - 3, 4, b, ST);
      c.rect(2, b - 5, 6, b - 4, CAP);
      c.rect(19, b - 2, 19, b, ST);
      c.rect(18, b - 3, 20, b - 3, CAP);
      grass(c, 1, 22, b, 7);
      return () => u && dots(c, MOON, [0, 9, 23, 7, 4, 17, 19, 17, 6, 21, 17, 22, 11, 0, 2, 22, 21, 20]);
    },
    s: 'same',
  });

  O('dream-bridge-half', 'half a bridge small stone footbridge that stops in mid air over nothing dream', {
    w: 42, h: 28, base: 'side',
    f(c, u) {
      const b = 26,
        S = C.stoneLight,
        end = u ? 38 : 27;
      // the deck rises to the right and stops
      for (let x = 2; x <= end; x++) {
        const y = Math.round(18 - 11 * Math.sin(((x - 2) / 44) * Math.PI));
        c.col(x, y, y + 4, x > 27 ? CLD : S);
        c.set(x, y, x > 27 ? C.white : L(S));
        if (x % 5 === 0 && x <= 27) c.col(x, y + 1, y + 4, C.stone);
        // rail
        if (x % 4 === 0) c.col(x, y - 5, y, x > 27 ? CLD : C.iron);
        c.set(x, y - 5, x > 27 ? CLD : C.iron);
      }
      // the one pier and the arch springing from it
      c.rect(2, 18, 9, b, S);
      for (let y = 19; y <= b; y += 3) c.row(y, 2, 9, C.stone);
      c.poly([[10, 22], [10, 20], [22, 12], [27, 11], [27, 12], [18, 17]], C.stone);
      dots(c, P.GRASS, [3, 21, 6, 24, 8, 19]);
      // crumbs falling from the broken end
      if (!u) dots(c, S, [28, 13, 29, 17, 27, 19]);
      grass(c, 1, 12, b, 6);
      return () => {
        if (!u) return dots(c, C.stone, [30, 21, 28, 24]);
        star(c, 40, 3, MOON, true);
        dots(c, CLD, [39, 12, 40, 14, 36, 14]);
      };
    },
    sw: 18,
    s(c, u) {
      const b = 26,
        S = C.stoneLight;
      // looking along it from the pier end
      c.rect(3, 7, 14, b, S);
      for (let y = 20; y <= b; y += 3) c.row(y, 3, 14, C.stone);
      c.rect(5, 8, 12, 18, u ? CLD : NI); // the way up: into dark, or onto cloud
      c.poly([[5, 18], [12, 18], [10, 11], [7, 11]], u ? C.white : C.stone);
      c.col(3, 1, 12, C.iron);
      c.col(14, 1, 12, C.iron);
      c.row(1, 3, 4, C.iron);
      c.row(1, 13, 14, C.iron);
      c.col(4, 3, 8, C.iron);
      c.col(13, 3, 8, C.iron);
      dots(c, P.GRASS, [4, 21, 13, 23]);
      grass(c, 1, 16, b, 7);
      return () => u && star(c, 9, 5, MOON, true);
    },
  });

  O('dream-anchor-from-sky', 'anchor let down from the sky iron anchor on a long chain caught in the ground ship above dream', {
    w: 22, h: 48,
    f(c, u) {
      const b = 46,
        I = C.iron,
        k = u ? -7 : 0; // weighed
      for (let y = 0; y <= 14 + k; y++) c.set(10 + ((y >> 1) % 2), y, y % 2 ? I : C.steel);
      ring(c, 8, 15 + k, 13, 20 + k, I);
      c.rect(10, 21 + k, 11, 42 + k, I);
      c.col(10, 21 + k, 42 + k, L(I));
      c.rect(5, 24 + k, 16, 25 + k, I); // stock
      c.poly([[2, 34 + k], [4, 34 + k], [10, 42 + k], [11, 42 + k], [17, 34 + k], [19, 34 + k], [14, 44 + k], [7, 44 + k]], I);
      c.poly([[1, 32 + k], [5, 34 + k], [2, 37 + k]], I);
      c.poly([[20, 32 + k], [16, 34 + k], [19, 37 + k]], I);
      dots(c, C.rust, [10, 30 + k, 11, 36 + k, 6, 40 + k, 15, 41 + k]);
      if (!u) {
        grass(c, 1, 20, b, 3);
        c.rect(5, b - 1, 16, b, P.GRASSd); // dug in
      } else {
        grass(c, 1, 20, b, 3);
        c.row(b, 5, 16, C.earth); // the furrow it left
        dots(c, C.earth, [8, b - 1, 13, b - 1]);
      }
      return () => u && dots(c, C.earth, [9, b - 4, 12, b - 5, 7, b - 3]);
    },
    sw: 10,
    s(c, u) {
      const b = 46,
        I = C.iron,
        k = u ? -7 : 0;
      for (let y = 0; y <= 14 + k; y++) c.set(4 + ((y >> 1) % 2), y, y % 2 ? I : C.steel);
      c.rect(4, 15 + k, 5, 20 + k, I);
      c.rect(4, 21 + k, 5, 44 + k, I);
      c.col(4, 21 + k, 44 + k, L(I));
      c.rect(3, 23 + k, 6, 26 + k, I);
      c.rect(3, 32 + k, 6, 37 + k, I); // a fluke, edge on
      dots(c, C.rust, [5, 30 + k, 4, 40 + k]);
      grass(c, 1, 8, b, 4);
      if (u) c.row(b, 3, 6, C.earth);
    },
  });

  O('dream-hedge-keyhole-arch', 'hedge cut with a keyhole clipped green hedge with a keyhole shaped way through light dream', {
    w: 32, h: 44,
    f(c, u) {
      const b = 42,
        HG = hex('#3e5544');
      c.rect(2, 4, 29, b, HG);
      c.oval(2, 1, 29, 12, HG);
      const r = rnd(9);
      for (let y = 2; y <= b; y++) for (let x = 2; x <= 29; x++) if (c.get(x, y) && r() < 0.16) c.set(x, y, r() < 0.5 ? L(HG) : D(HG));
      c.col(2, 6, b, L(HG));
      // the keyhole
      const IN = u ? MOON : NI;
      c.oval(10, 10, 21, 21, IN);
      c.poly([[13, 19], [18, 19], [21, b], [10, b]], IN);
      if (u) {
        c.oval(12, 12, 19, 19, C.white);
        c.poly([[14, 20], [17, 20], [19, b], [12, b]], C.white);
        c.rect(14, 30, 17, b, hex('#8a8468')); // somebody far off in the light
        c.rect(15, 28, 16, 29, hex('#8a8468'));
      }
      dots(c, C.white, [5, 9, 25, 14, 6, 30, 26, 34, 24, 6]); // small flowers
      grass(c, 1, 30, b, 2);
      if (u) c.row(b, 10, 21, MOON);
      return () => u && dots(c, MOON, [8, b + 1, 12, b + 1, 16, b + 1, 20, b + 1, 23, b + 1]);
    },
    sw: 14,
    s(c, u) {
      const b = 42,
        HG = hex('#3e5544');
      c.rect(2, 4, 11, b, HG);
      c.oval(2, 1, 11, 9, HG);
      const r = rnd(11);
      for (let y = 2; y <= b; y++) for (let x = 2; x <= 11; x++) if (c.get(x, y) && r() < 0.16) c.set(x, y, r() < 0.5 ? L(HG) : D(HG));
      c.col(2, 6, b, L(HG));
      dots(c, C.white, [5, 12, 9, 28]);
      grass(c, 1, 12, b, 3);
      return () => u && (c.row(b, 12, 13, MOON), dots(c, MOON, [12, 20, 13, 26, 12, 33, 0, 22, 0, 30]));
    },
  });

  O('dream-paper-lanterns-line', 'line of paper lanterns strung between two poles round lanterns over an empty lawn fete dream', {
    w: 44, h: 36, base: 'side',
    f(c, u) {
      const b = 34,
        cols = [hex('#b08a8f'), hex('#b8a88c'), hex('#8a9aa4'), hex('#b8a88c'), hex('#b08a8f')];
      c.rect(3, 2, 4, b, W);
      c.rect(39, 2, 40, b, W);
      c.col(3, 2, b, WL);
      for (let x = 5; x <= 38; x++) c.set(x, 4 + Math.round(4 * Math.sin(((x - 5) / 33) * Math.PI)), P.FELT);
      cols.forEach((col, i) => {
        const x = 8 + i * 7,
          y = 6 + Math.round(4 * Math.sin(((x - 3) / 33) * Math.PI)),
          lit = u && i !== 3; // one stays dark
        c.oval(x - 2, y, x + 2, y + 6, lit ? blend(col, C.flameLight, 0.55) : col);
        if (lit) c.rect(x, y + 2, x, y + 4, C.white);
        c.row(y, x - 1, x + 1, WD);
        c.row(y + 6, x - 1, x + 1, WD);
        c.set(x, y + 7, C.red);
        c.set(x, y + 8, C.red);
      });
      grass(c, 1, 42, b, 5);
      return () => u && dots(c, MOON, [5, 12, 12, 20, 19, 22, 26, 21, 38, 14, 16, 5, 30, 6]);
    },
    sw: 10,
    s(c, u) {
      const b = 34;
      c.rect(4, 2, 5, b, W);
      c.col(4, 2, b, WL);
      c.oval(2, 9, 7, 16, u ? blend(hex('#b08a8f'), C.flameLight, 0.55) : hex('#b08a8f')); // the lanterns one behind the other
      if (u) c.col(4, 11, 14, C.white);
      c.row(9, 3, 6, WD);
      c.row(16, 3, 6, WD);
      c.col(4, 17, 18, C.red);
      grass(c, 1, 8, b, 6);
      return () => u && dots(c, MOON, [0, 12, 9, 13, 1, 20, 8, 21]);
    },
  });
};
