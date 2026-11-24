/* Dream world II, part 5: moons in a barrow, a suitcase of cloud, a boot to live in. */
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
    LEATH = hex('#7a5a3a');
  const crescent = (c, x, y, col = MOON) => {
    // 7 x 7, horns to the right
    c.oval(x, y, x + 6, y + 6, col);
    for (let j = 0; j <= 6; j++) for (let i = 0; i <= 6; i++) if (((i - 4.6) / 3) ** 2 + ((j - 3) / 3) ** 2 <= 1) c.clear(x + i, y + j);
  };

  O('dream-moondial', 'moondial stone sundial that tells the time by moonlight pedestal brass gnomon garden dream', {
    w: 20, h: 26,
    f(c, u) {
      const b = 24,
        S = C.stoneLight;
      c.rect(7, 10, 12, b - 3, S);
      c.col(7, 10, b - 3, L(S));
      c.col(10, 11, b - 4, C.stone);
      c.rect(5, b - 2, 14, b, S);
      c.row(b, 5, 14, C.stone);
      c.rect(2, 7, 17, 9, S);
      c.row(7, 2, 17, u ? MOON : L(S));
      c.row(9, 3, 16, C.stone);
      c.poly([[9, 6], [9, 2], [13, 6]], C.brass); // gnomon
      dots(c, P.GRASS, [8, 15, 11, 19]);
      if (u) c.row(7, 4, 8, SKY); // it throws a shadow at night
      grass(c, 2, 17, b, 3);
      return () => u && (dots(c, MOON, [14, 1, 16, 3, 17, 0, 12, 0, 1, 5]), c.row(6, 5, 7, SKY));
    },
    sw: 20,
    s(c, u) {
      const b = 24,
        S = C.stoneLight;
      c.rect(7, 10, 12, b - 3, S);
      c.col(7, 10, b - 3, L(S));
      c.col(10, 11, b - 4, C.stone);
      c.rect(5, b - 2, 14, b, S);
      c.row(b, 5, 14, C.stone);
      c.rect(2, 7, 17, 9, S);
      c.row(7, 2, 17, u ? MOON : L(S));
      c.row(9, 3, 16, C.stone);
      c.rect(9, 2, 10, 6, C.brass); // the gnomon, edge on
      dots(c, P.GRASS, [9, 14, 11, 20]);
      if (u) c.row(7, 9, 10, SKY);
      grass(c, 2, 17, b, 4);
      return () => u && dots(c, MOON, [14, 1, 16, 3, 5, 0, 3, 3]);
    },
  });

  O('dream-sandcastle-tide', 'sandcastle large sand castle with towers and a paper flag the tide coming for it beach dream', {
    w: 34, h: 24, base: 'side',
    f(c, u) {
      const b = 22,
        S = P.SAND,
        cut = u ? 19 : 99; // the sea has taken the right half
      const tower = (x0, x1, y) => {
        if (x0 >= cut) return;
        c.rect(x0, y, x1, b, S);
        for (let x = x0; x <= x1; x += 2) c.set(x, y - 1, S);
        c.col(x0, y, b, L(S));
        c.set((x0 + x1) >> 1, y + 3, D(S));
      };
      c.rect(6, 14, Math.min(27, cut), b, S);
      tower(3, 8, 9);
      tower(25, 30, 10);
      tower(13, 20, 5);
      c.rect(15, 16, 18, b, D(S)); // the gate
      c.row(15, 16, 17, D(S));
      for (let x = 7; x <= Math.min(26, cut); x += 2) c.set(x, 13, S);
      c.col(16, 0, 4, WD);
      c.rect(17, 0, 19, 1, C.red);
      dots(c, D(S), [5, 16, 10, 18, 22, 17, 28, 15, 11, 20]);
      c.rect(1, b, 32, b, S);
      if (u) {
        for (let y = 5; y <= b; y++) for (let x = 19; x <= 33; x++) if (c.get(x, y) && x - 19 > (b - y) * 0.9) c.clear(x, y);
        c.poly([[20, b - 2], [27, b - 1], [32, b], [20, b]], blend(S, SEA, 0.4)); // slumped, wet
        c.rect(18, b - 1, 32, b, SEA);
        c.row(b - 1, 22, 32, SEAl);
        dots(c, C.white, [19, b - 2, 21, b - 2, 24, b - 2]);
        c.clear(17, 0);
        c.clear(18, 0);
        c.clear(19, 0);
        c.clear(17, 1);
        c.clear(18, 1);
        c.clear(19, 1);
        c.rect(28, b - 2, 30, b - 2, C.red); // the flag, floating off
      }
    },
    sw: 22,
    s(c, u) {
      const b = 22,
        S = P.SAND;
      c.rect(4, 14, 17, b, S);
      for (const [x0, x1, y] of [[2, 6, 10], [15, 19, 10], [7, 14, 5]]) {
        c.rect(x0, y, x1, b, S);
        for (let x = x0; x <= x1; x += 2) c.set(x, y - 1, S);
        c.col(x0, y, b, L(S));
      }
      c.col(10, 0, 4, WD);
      if (!u) c.rect(11, 0, 13, 1, C.red);
      dots(c, D(S), [4, 16, 12, 9, 17, 14, 9, 18]);
      c.row(b, 1, 20, S);
      if (u) {
        for (let y = b - 5; y <= b; y++) for (let x = 1; x <= 20; x++) if (c.get(x, y)) c.set(x, y, y >= b - 1 ? SEA : blend(S, SEA, 0.4));
        c.row(b - 1, 1, 20, SEAl);
        dots(c, C.white, [3, b - 2, 9, b - 2, 16, b - 2]);
      }
    },
  });

  O('dream-suitcase-of-cloud', 'suitcase full of cloud old leather suitcase opened and a cloud rises out of it luggage dream', {
    w: 26, h: 18, uh: 34,
    f(c, u) {
      const b = 16;
      c.box(2, 6, 23, b, LEATH);
      c.row(10, 2, 23, D(LEATH));
      for (const x of [2, 20]) c.rect(x, 6, x + 3, 8, WD);
      for (const x of [2, 20]) c.rect(x, b - 2, x + 3, b, WD);
      dots(c, C.brass, [7, 11, 18, 11]);
      c.rect(10, 9, 15, 9, WD);
      dots(c, PORC, [5, 13, 6, 13, 5, 14, 17, 13]); // labels
      if (!u) {
        c.rect(10, 3, 15, 4, WD);
        c.set(10, 5, WD);
        c.set(15, 5, WD);
        dots(c, CLD, [1, 9, 24, 8]);
      } else {
        // the lid stands open behind; the cloud is out
        c.rect(2, -5, 23, 5, D(LEATH));
        c.frame(2, -5, 23, 5, WD);
        c.rect(4, -3, 21, 5, hex('#8a7a6a'));
        c.rect(3, 6, 22, 7, CLD);
      }
      return () => {
        if (!u) return;
        const t = part(22, 13, (t) => cloud(t, 1, 1, 20, 11, CLD, 4));
        t.outline();
        c.stamp(t, 2, -17);
        dots(c, CLD, [8, -3, 9, -2, 14, -3, 15, -1, 11, 0, 12, 2, 16, 3, 7, 4]);
      };
    },
    sw: 12, suh: 34,
    s(c, u) {
      const b = 16;
      c.box(2, 6, 9, b, LEATH);
      c.row(10, 2, 9, D(LEATH));
      c.rect(2, 6, 9, 7, WD);
      c.rect(2, b - 1, 9, b, WD);
      c.rect(5, 9, 6, 12, WD); // the handle on its end
      if (u) {
        c.rect(2, -5, 4, 5, D(LEATH));
        c.col(2, -5, 5, WD);
        c.rect(5, 5, 8, 6, CLD);
      }
      return () => {
        if (!u) return;
        const t = part(11, 13, (t) => cloud(t, 1, 1, 9, 11, CLD, 6));
        t.outline();
        c.stamp(t, 1, -17);
        dots(c, CLD, [6, -3, 7, -1, 5, 1, 7, 3]);
      };
    },
  });

  O('dream-nest-giant-egg', 'giant nest with one great egg twigs woven nest on the ground pale speckled egg dream', {
    w: 32, h: 26,
    f(c, u) {
      const b = 24,
        TW = hex('#6a543e'),
        EG = hex('#c9cbbf');
      c.oval(9, 2, 22, 20, EG);
      dots(c, hex('#8f927f'), [13, 6, 17, 9, 12, 12, 19, 14, 15, 15, 16, 5]);
      c.col(10, 8, 14, L(EG));
      if (u) {
        // cracked, and light inside
        const pts = [15, 3, 14, 5, 16, 7, 14, 9, 17, 11, 15, 13, 13, 11, 18, 8];
        dots(c, C.flameLight, pts);
        dots(c, NI, [15, 4, 15, 6, 15, 8, 16, 10, 14, 10, 16, 12]);
        c.rect(15, 8, 16, 9, C.white);
      }
      c.poly([[1, 15], [30, 15], [27, b], [4, b]], TW);
      const r = rnd(5);
      for (let i = 0; i < 34; i++) {
        const x = 2 + ((r() * 26) | 0),
          y = 15 + ((r() * 9) | 0),
          dx = r() < 0.5 ? 3 : -3;
        c.line(x, y, x + dx, y + 1, r() < 0.5 ? L(TW) : D(TW));
      }
      c.clearRect(0, b + 1, 31, b + 1);
      dots(c, TW, [0, 14, 31, 14, 3, 13, 28, 13, 6, 14, 25, 14]);
      dots(c, WH, [8, 17, 22, 19]); // a feather or two
      return () => u && dots(c, MOON, [15, 0, 12, 1, 19, 1, 8, 6, 23, 7]);
    },
    s: 'same',
  });

  O('dream-birdhouse-tower', 'tower of bird houses many little bird boxes stacked on one tall pole holes lit dream', {
    w: 18, h: 50,
    f(c, u) {
      const b = 48,
        cols = [hex('#8a9aa4'), hex('#b08a8f'), hex('#b8a88c'), hex('#7f9078')];
      c.rect(8, 30, 9, b, W);
      c.col(8, 30, b, WL);
      cols.forEach((col, i) => {
        const y = 4 + i * 7,
          x0 = 3 + (i % 2);
        c.rect(x0, y + 2, x0 + 9, y + 7, col);
        c.col(x0, y + 2, y + 7, L(col));
        c.poly([[x0 + 4, y - 1], [x0 + 5, y - 1], [x0 + 11, y + 2], [x0 - 2, y + 2]], WD);
        c.rect(x0 + 4, y + 3, x0 + 5, y + 4, u && i !== 1 ? WARM : NI);
        c.rect(x0 + 4, y + 6, x0 + 5, y + 6, WD);
      });
      c.rect(3, 32, 14, 33, WD);
      grass(c, 3, 14, b, 3);
      return () => {
        if (!u) return dots(c, NI, [15, 3, 16, 2, 17, 3]); // a bird leaving
        dots(c, WARM, [1, 9, 16, 22, 2, 30]);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 48,
        cols = [hex('#8a9aa4'), hex('#b08a8f'), hex('#b8a88c'), hex('#7f9078')];
      c.rect(6, 30, 7, b, W);
      c.col(6, 30, b, WL);
      cols.forEach((col, i) => {
        const y = 4 + i * 7;
        c.rect(3, y + 2, 10, y + 7, col);
        c.col(3, y + 2, y + 7, L(col));
        c.rect(2, y, 11, y + 1, WD); // roof slope
        c.row(y, 2, 11, W);
        if (u && i !== 1) c.set(11, y + 4, WARM);
      });
      c.rect(3, 32, 10, 33, WD);
      grass(c, 2, 11, b, 4);
      return () => u && dots(c, WARM, [12, 8, 12, 22, 12, 29]);
    },
  });

  O('dream-wheelbarrow-of-moons', 'wheelbarrow full of moons wooden barrow loaded with pale crescent moons gardener dream', {
    w: 36, h: 24, base: 'side',
    f(c, u) {
      const b = 22;
      // the load
      const col = u ? blend(MOON, C.white, 0.5) : MOON;
      crescent(c, 9, 3, col);
      crescent(c, 15, 1, col);
      crescent(c, 20, 4, col);
      if (!u) crescent(c, 13, 6, MOONd);
      c.poly([[6, 9], [28, 9], [25, 17], [11, 17]], W);
      c.row(9, 6, 28, WL);
      c.line(6, 9, 11, 17, WL);
      for (let x = 12; x <= 24; x += 4) c.col(x, 10, 16, WD);
      c.line(24, 14, 34, 10, W); // handles
      c.line(25, 15, 34, 11, WD);
      c.rect(22, 18, 23, b, WD); // leg
      wheel(c, 8, 18, 4, WD, C.iron, WL);
      if (u) {
        // one has rolled out and lies shining in the grass
        crescent(c, 28, 15, blend(MOON, C.white, 0.5));
      }
      grass(c, 1, 34, b, 4);
      return () => u && dots(c, MOON, [27, 13, 35, 14, 31, 12, 12, 0, 24, 1, 18, 9]);
    },
    sw: 20,
    s(c, u) {
      const b = 22;
      const col = u ? blend(MOON, C.white, 0.5) : MOON;
      crescent(c, 4, 3, col);
      crescent(c, 10, 2, col);
      if (!u) crescent(c, 7, 5, MOONd);
      c.poly([[2, 9], [17, 9], [15, 17], [4, 17]], W);
      c.row(9, 2, 17, WL);
      for (let x = 6; x <= 14; x += 4) c.col(x, 10, 16, WD);
      c.rect(9, 15, 11, b, WD); // the wheel, edge on
      c.col(9, 15, b, C.iron);
      c.rect(4, 18, 4, b, WD);
      c.rect(15, 18, 15, b, WD);
      if (u) c.rect(13, b - 3, 17, b - 2, blend(MOON, C.white, 0.5));
      grass(c, 1, 18, b, 5);
      return () => u && dots(c, MOON, [12, b - 6, 18, b - 5, 8, 0]);
    },
  });

  O('dream-hammock-on-stars', 'hammock slung between two stars striped canvas hammock hanging in the air blanket dream', {
    w: 44, h: 28, base: 'side',
    f(c, u) {
      const b = 26,
        HM = hex('#b9b09a'),
        sag = u ? 4 : 0;
      for (let x = 6; x <= 37; x++) {
        const t = (x - 6) / 31,
          y = 8 + Math.round((9 + sag) * Math.sin(t * Math.PI));
        c.col(x, y, y + (x > 9 && x < 34 ? 3 : 1), x % 4 < 2 ? HM : hex('#8a5a5e'));
        c.set(x, y, L(HM));
      }
      c.line(3, 4, 6, 8, WP);
      c.line(40, 4, 37, 8, WP);
      // fringe
      for (let x = 10; x <= 34; x += 3) c.set(x, 12 + Math.round((9 + sag) * Math.sin(((x - 6) / 31) * Math.PI)), HM);
      if (!u) {
        c.rect(26, 13, 31, 15, LILAC); // a folded blanket
        c.row(13, 26, 31, L(LILAC));
      } else {
        c.poly([[14, 16], [30, 16], [32, 20], [12, 20]], LILAC); // someone is under it
        c.row(16, 15, 29, L(LILAC));
        c.oval(11, 14, 15, 18, WH); // pillow
      }
      c.row(b, 14, 30, NI);
      return () => {
        star(c, 3, 3, MOON, true);
        star(c, 40, 3, MOON, true);
        if (u) dots(c, MOON, [1, 0, 6, 1, 38, 0, 43, 5, 0, 6, 18, 12, 24, 11]);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 26,
        HM = hex('#b9b09a'),
        sag = u ? 4 : 0;
      c.line(6, 3, 6, 8, WP);
      c.poly([[6, 8], [7, 8], [10, 16 + sag], [9, 20 + sag], [4, 20 + sag], [3, 16 + sag]], HM);
      c.col(6, 9, 20 + sag, hex('#8a5a5e'));
      c.col(4, 15 + sag, 19 + sag, L(HM));
      if (u) {
        c.rect(4, 16, 9, 19, LILAC);
        c.row(16, 4, 9, L(LILAC));
      }
      c.row(b, 4, 9, NI);
      return () => {
        star(c, 6, 2, MOON, true);
        if (u) dots(c, MOON, [2, 0, 11, 1, 1, 7, 12, 8]);
      };
    },
  });

  O('dream-typewriter-endless-page', 'typewriter with an endless page old black typewriter on a small table the paper goes up and up dream', {
    w: 24, h: 36, uh: 46,
    f(c, u) {
      const b = 34,
        F = P.FELT;
      // table
      c.rect(2, 21, 21, 22, W);
      c.row(21, 2, 21, WL);
      c.col(4, 23, b, WD);
      c.col(19, 23, b, WD);
      // the machine
      c.rect(5, 15, 18, 20, F);
      c.rect(6, 13, 17, 14, F);
      c.row(15, 5, 18, L(L(F)));
      for (let x = 6; x <= 17; x += 2) c.set(x, 18, PORC);
      for (let x = 7; x <= 17; x += 2) c.set(x, 19, PORC);
      c.rect(3, 11, 20, 12, C.iron); // the roller
      c.set(2, 11, C.steel);
      c.set(21, 11, C.steel);
      // the page
      const top = u ? -9 : 3;
      c.rect(7, top, 16, 11, C.paper);
      c.col(7, top, 11, C.white);
      for (let y = top + 2; y <= 9; y += 2) c.row(y, 9, 14 - ((y * 3) % 3), hex('#8d8672'));
      if (u) {
        c.poly([[7, -9], [16, -9], [19, -12], [10, -12]], D(C.paper)); // curling over at the top
        // and what came off lies in a heap
        c.rect(12, b - 2, 20, b, C.paper);
        c.rect(14, b - 4, 21, b - 3, C.white);
        dots(c, hex('#8d8672'), [14, b - 1, 16, b - 1, 18, b - 1, 16, b - 3, 18, b - 3]);
      }
      return () => u && dots(c, MOON, [4, 14, 19, 14]);
    },
    sw: 18, suh: 46,
    s(c, u) {
      const b = 34,
        F = P.FELT;
      c.rect(2, 21, 15, 22, W);
      c.row(21, 2, 15, WL);
      c.col(4, 23, b, WD);
      c.col(13, 23, b, WD);
      c.poly([[4, 20], [4, 17], [9, 13], [13, 13], [13, 20]], F); // keys slope down to the left
      c.line(4, 17, 9, 13, PORC);
      c.rect(10, 11, 13, 12, C.iron);
      c.set(14, 11, C.steel);
      const top = u ? -9 : 3;
      c.rect(11, top, 12, 11, C.paper);
      c.col(11, top, 11, C.white);
      if (u) {
        c.line(12, -9, 15, -12, D(C.paper));
        c.rect(14, b - 2, 16, b, C.paper);
        c.rect(13, b - 3, 15, b - 3, C.white);
      }
    },
  });

  O('dream-seesaw-moon', 'seesaw with the moon sitting on one end playground plank on a trestle the other seat empty dream', {
    w: 44, h: 26, base: 'side',
    f(c, u) {
      const b = 24,
        dy = u ? -1 : 1; // which end is down: the moon's (left), or the other once someone sits
      c.poly([[20, b], [22, 13], [23, 13], [25, b]], C.iron);
      c.rect(18, b, 27, b, C.iron);
      const y0 = 14 + dy * 6,
        y1 = 14 - dy * 6;
      for (let x = 3; x <= 40; x++) {
        const y = Math.round(y0 + ((y1 - y0) * (x - 3)) / 37);
        c.col(x, y, y + 1, x < 6 || x > 37 ? C.red : WP);
        c.set(x, y, x < 6 || x > 37 ? C.red : L(WP));
      }
      // handles
      c.col(8, y0 - 3 + Math.round((y1 - y0) * 0.13), y0 + Math.round((y1 - y0) * 0.13), C.iron);
      c.col(35, y1 - 3 - Math.round((y1 - y0) * 0.13), y1 - Math.round((y1 - y0) * 0.13), C.iron);
      // the moon on the left seat
      c.oval(1, y0 - 9, 9, y0 - 1, MOON);
      c.set(3, y0 - 7, C.white);
      dots(c, MOONd, [5, y0 - 4, 6, y0 - 6, 3, y0 - 3]);
      c.row(y0 - 5, 3, 4, NI);
      c.set(6, y0 - 5, NI);
      if (u) c.rect(36, y1 - 2, 40, y1 - 1, LILAC); // somebody's cardigan left on the low seat
      grass(c, 1, 42, b, 4);
      return () => dots(c, MOON, u ? [0, 1, 10, 2, 5, 0, 11, 9] : [11, 12]);
    },
    sw: 14,
    s(c, u) {
      const b = 24,
        y0 = u ? 8 : 20;
      c.rect(5, 13, 8, b, C.iron);
      c.rect(3, b, 10, b, C.iron);
      c.rect(2, y0, 11, y0 + 1, C.red); // the near seat: the moon's
      c.col(4, y0 - 3, y0, C.iron);
      c.col(9, y0 - 3, y0, C.iron);
      c.oval(2, y0 - 9, 10, y0 - 1, MOON);
      c.set(4, y0 - 7, C.white);
      c.row(y0 - 5, 4, 5, NI);
      c.row(y0 - 5, 7, 8, NI);
      grass(c, 1, 12, b, 5);
      return () => u && dots(c, MOON, [1, 0, 12, 2, 0, 6]);
    },
  });

  O('dream-telescope-to-one-star', 'brass telescope on a tripod pointed at a single star astronomer observatory dream', {
    w: 28, h: 38,
    f(c, u) {
      const b = 36,
        B = C.brass;
      c.line(13, 18, 6, b, WD);
      c.line(14, 18, 14, b, W);
      c.line(15, 18, 22, b, WD);
      c.rect(12, 16, 16, 18, C.iron);
      // the tube rising to the right
      for (let i = 0; i <= 20; i++) {
        const x = 4 + i,
          y = 20 - Math.round(i * 0.75),
          r = i < 5 ? 1 : i < 14 ? 2 : 3;
        c.col(x, y - r, y + r - 1, i % 7 === 4 ? D(B) : B);
        c.set(x, y - r, L(B));
      }
      c.rect(2, 19, 3, 21, C.iron); // eyepiece
      c.col(25, 2, 7, u ? C.glassLight : C.glass);
      return () => {
        star(c, 26, 1, u ? C.white : MOONd, u);
        if (u) dots(c, MOON, [23, 0, 27, 4, 24, 3, 1, 17, 0, 20]);
      };
    },
    sw: 16,
    s(c, u) {
      const b = 36,
        B = C.brass;
      c.line(7, 18, 2, b, WD);
      c.line(8, 18, 13, b, WD);
      c.col(7, 18, b - 2, W);
      c.rect(5, 16, 10, 18, C.iron);
      // the tube pointing away and up: its small end towards you
      c.oval(4, 4, 11, 11, B);
      c.oval(5, 7, 10, 13, B);
      c.oval(6, 11, 9, 15, D(B));
      c.rect(7, 13, 8, 15, C.iron);
      ring(c, 4, 4, 11, 11, D(B));
      c.rect(6, 5, 9, 6, u ? C.glassLight : C.glass);
      return () => {
        star(c, 8, 1, u ? C.white : MOONd, u);
        if (u) dots(c, MOON, [4, 0, 12, 2]);
      };
    },
  });

  O('dream-coat-stand-of-clouds', 'coat stand hung with clouds wooden hat stand small clouds on its hooks like coats one raining dream', {
    w: 24, h: 44,
    f(c, u) {
      const b = 42;
      c.rect(11, 3, 12, b - 2, W);
      c.col(11, 3, b - 2, WL);
      c.oval(10, 1, 13, 4, WL);
      c.line(11, b - 5, 6, b, WD);
      c.line(12, b - 5, 17, b, WD);
      c.rect(10, b - 1, 13, b, WD);
      c.line(10, 8, 5, 5, W);
      c.line(13, 8, 18, 5, W);
      c.line(10, 12, 6, 10, W);
      cloud(c, 1, 6, 9, 14, CLD, 3);
      cloud(c, 14, 6, 22, 13, u ? blend(CLD, DBLUE, 0.45) : CLD, 5);
      cloud(c, 3, 13, 10, 19, blend(CLD, C.ash, 0.4), 7);
      return () => {
        if (!u) return;
        for (const [x, y] of [[15, 15], [17, 17], [19, 15], [21, 18], [16, 21], [18, 24], [20, 22], [15, 27], [19, 29], [17, 32], [21, 27], [16, 36], [20, 35]]) c.set(x, y, SEAl);
        c.row(b, 15, 21, SEA);
      };
    },
    s: 'same',
  });

  O('dream-boot-house', 'boot house old leather boot as big as a shed with a door window and chimney someone lives in it dream', {
    w: 30, h: 34,
    f(c, u) {
      const b = 32,
        BT = hex('#6a4a3a');
      c.rect(4, 4, 16, 24, BT); // the leg
      c.rect(3, 3, 17, 5, D(BT));
      c.poly([[4, 18], [16, 18], [24, 21], [27, 25], [27, b - 2], [4, b - 2]], BT); // the foot
      c.col(4, 5, b - 2, L(BT));
      c.rect(3, b - 1, 28, b, P.FELT); // sole
      c.rect(3, b - 3, 8, b, P.FELT); // heel
      dots(c, PORC, [15, 8, 15, 11, 15, 14, 15, 17]); // lace holes
      for (const y of [8, 11, 14]) c.line(12, y + 1, 15, y, PORC);
      c.oval(20, 23, 26, 28, L(BT)); // the toe cap
      // door, window, chimney
      c.rect(6, 20, 10, b - 3, hex('#4f6658'));
      c.set(9, 25, C.brass);
      c.rect(7, 9, 11, 13, u ? WARM : NI);
      c.frame(7, 9, 11, 13, WD);
      c.col(9, 10, 12, WD);
      c.rect(10, 0, 12, 2, BRICK);
      if (u) c.rect(15, 22, 18, 25, WARM), c.frame(15, 22, 18, 25, WD);
      else c.rect(15, 22, 18, 25, NI), c.frame(15, 22, 18, 25, WD);
      return () => u && (dots(c, C.ash, [12, -1, 13, -1]), dots(c, WARM, [5, b + 1, 8, b + 1, 11, b + 1]));
    },
    sw: 18,
    s(c, u) {
      const b = 32,
        BT = hex('#6a4a3a');
      // from the toe end
      c.rect(4, 4, 13, 24, BT);
      c.rect(3, 3, 14, 5, D(BT));
      c.oval(2, 18, 15, b - 1, BT);
      c.oval(4, 20, 13, b - 3, L(BT));
      c.col(4, 5, 20, L(BT));
      c.rect(2, b - 1, 15, b, P.FELT);
      dots(c, PORC, [7, 8, 10, 8, 7, 11, 10, 11, 7, 14, 10, 14]);
      for (const y of [8, 11, 14]) c.row(y + 1, 8, 9, PORC);
      c.rect(8, 0, 10, 2, BRICK);
      c.rect(7, 22, 10, 25, u ? WARM : NI);
      c.frame(7, 22, 10, 25, WD);
      return () => u && dots(c, C.ash, [10, -1, 11, -1]);
    },
  });

  O('dream-teapot-giant-steaming', 'giant teapot porcelain teapot as big as a bath blue pattern steam from the spout dream', {
    w: 36, h: 28, uh: 34,
    f(c, u) {
      const b = 26;
      c.oval(7, 6, 26, b, PORC);
      c.rect(10, b - 1, 23, b, D(PORC));
      c.poly([[26, 13], [31, 8], [33, 9], [28, 18], [25, 18]], PORC); // spout
      c.set(32, 8, D(PORC));
      ring(c, 1, 10, 9, 21, PORC); // handle
      ring(c, 2, 11, 8, 20, PORC);
      c.rect(11, 5, 22, 6, DBLUE);
      c.oval(12, 2, 21, 6, PORC);
      c.rect(15, 0, 17, 2, DBLUE);
      for (let x = 9; x <= 24; x += 3) dots(c, DBLUE, [x, 14, x + 1, 13, x + 1, 15, x + 2, 14]);
      c.row(19, 8, 25, DBLUE);
      c.col(9, 10, 20, C.white);
      if (u) {
        // tipped a little, and it pours
        c.col(33, 10, b, hex('#7a5230'));
        c.col(34, 12, b - 1, hex('#7a5230'));
        c.row(b, 30, 35, hex('#7a5230'));
      }
      return () => {
        if (!u) return dots(c, CLD, [33, 6, 34, 4, 33, 2]);
        const t = part(12, 8, (t) => cloud(t, 1, 1, 10, 6, CLD, 3));
        t.outline();
        c.stamp(t, 12, -8);
        dots(c, CLD, [16, 0, 17, -1]);
      };
    },
    sw: 24, suh: 34,
    s(c, u) {
      const b = 26;
      c.oval(2, 6, 21, b, PORC);
      c.rect(5, b - 1, 18, b, D(PORC));
      c.rect(6, 5, 17, 6, DBLUE);
      c.oval(7, 2, 16, 6, PORC);
      c.rect(10, 0, 12, 2, DBLUE);
      // the spout pointing at you
      c.oval(9, 10, 14, 17, PORC);
      ring(c, 9, 10, 14, 17, D(PORC));
      c.oval(11, 12, 12, 14, u ? hex('#7a5230') : NI);
      for (const x of [4, 17]) dots(c, DBLUE, [x, 14, x + 1, 13, x + 1, 15, x + 2, 14]);
      c.row(19, 3, 20, DBLUE);
      c.col(4, 10, 20, C.white);
      if (u) {
        c.rect(11, 15, 12, b, hex('#7a5230'));
        c.row(b, 8, 15, hex('#7a5230'));
      }
      return () => {
        if (!u) return dots(c, CLD, [12, 8, 13, 6]);
        const t = part(12, 8, (t) => cloud(t, 1, 1, 10, 6, CLD, 3));
        t.outline();
        c.stamp(t, 6, -8);
      };
    },
  });

  O('dream-cloud-on-a-lead', 'small cloud on a lead tied to a peg in the lawn like a pet waiting it rains when stroked dream', {
    w: 24, h: 38,
    f(c, u) {
      const b = 36;
      cloud(c, 2, 2, 21, 12, u ? blend(CLD, DBLUE, 0.4) : CLD, 6);
      c.rect(8, 9, 9, 9, hex('#8f3a3a')); // a collar
      c.rect(4, b - 4, 5, b, W); // the peg
      c.set(4, b - 5, WL);
      grass(c, 1, 22, b, 3);
      return () => {
        // the lead
        for (let i = 0; i <= 20; i++) c.set(Math.round(9 - i * 0.2), 13 + i, i % 2 ? hex('#8f3a3a') : D(hex('#8f3a3a')));
        if (!u) return;
        for (const [x, y] of [[12, 14], [15, 16], [18, 14], [13, 19], [17, 21], [20, 18], [14, 24], [19, 26], [16, 29], [12, 30], [20, 31]]) c.set(x, y, SEAl);
        c.row(b, 11, 21, SEA);
      };
    },
    sw: 14,
    s(c, u) {
      const b = 36;
      cloud(c, 2, 2, 11, 12, u ? blend(CLD, DBLUE, 0.4) : CLD, 9);
      c.rect(6, b - 4, 7, b, W);
      c.set(6, b - 5, WL);
      grass(c, 1, 12, b, 4);
      return () => {
        for (let i = 0; i <= 20; i++) c.set(6, 13 + i, i % 2 ? hex('#8f3a3a') : D(hex('#8f3a3a')));
        if (!u) return;
        for (const [x, y] of [[4, 14], [9, 16], [3, 19], [10, 21], [8, 25], [4, 26], [9, 30]]) c.set(x, y, SEAl);
        c.row(b, 3, 11, SEA);
      };
    },
  });
};
