/* Hell, part 5: torches, the spit, the ice, thorns and trees of the pit, racks, cages, heaps, the winch, the drum. */
module.exports = (H, O) => {
  const { C, K, hex, mix, blend, rnd, canvas, P, D, L, dots, part, turn, chain, chainH, thin, rusty, drip, pool, bars, ring, flame, fire, sparks, skull, skullS, bone, rock, spike, wheel, eyes, planks } = H;
  const { OBS, OBL, BAS, BASL, BRIM, BRIML, EMBER, LAVA, LAVAL, SULF, SULFL, CHAR, BONE, BONED, BL, BD, NI, SOUL, SOULD, HIDE, DEMON } = P;
  const IR = C.iron,
    ID = C.ironDark,
    ST = C.steel,
    WD = hex('#3c2a24'),
    WL = hex('#5a4034'),
    BR = hex('#8a7436'),
    ICE = hex('#8fb0b8'),
    ICEL = hex('#c2d8d8'),
    ICED = hex('#5f8590'),
    MEAT = hex('#8e3b38'),
    MEATL = hex('#b3625a');

  /* ---------- skull torch ---------- */
  O('hell-torch-skull-pole', 'skull torch on a pole burning skull lamp standing torch way light of hell', {
    w: 13,
    h: 36,
    f(c, u) {
      const b = 34;
      c.rect(6, 14, 7, b, WL);
      c.col(7, 14, b, WD);
      rock(c, 2, b - 3, 10, b, BAS, 2);
      dots(c, HIDE, [6, 17, 7, 18, 6, 19]);
      if (u) {
        flame(c, 6, 8, 7, 2, 1);
        flame(c, 8, 8, 5, 1, 4);
      }
      skull(c, 3, 7, true, BONE, u ? LAVA : NI);
      if (u) dots(c, LAVAL, [4, 9, 7, 9]);
      return () => u && sparks(c, [3, 2, 10, 4, 9, 1]);
    },
    sw: 13,
    s(c, u) {
      const b = 34;
      c.rect(5, 14, 6, b, WL);
      c.col(6, 14, b, WD);
      rock(c, 1, b - 3, 9, b, BAS, 2);
      if (u) {
        flame(c, 5, 8, 7, 2, 1);
        flame(c, 7, 8, 5, 1, 4);
      }
      c.rect(3, 8, 8, 12, BONE);
      c.row(7, 4, 7, L(BONE));
      c.rect(5, 13, 8, 13, BONE);
      c.rect(9, 10, 9, 12, BONE);
      c.rect(7, 9, 8, 10, u ? LAVA : NI);
      c.set(9, 12, BONED);
      c.set(3, 11, BONED);
      return () => u && sparks(c, [2, 3, 9, 2]);
    },
  });

  /* ---------- the roasting spit ---------- */
  O('hell-fire-pit-spit', 'roasting spit over a fire pit iron spit with crank ring of stones cooking fire meat', {
    w: 38,
    h: 26,
    f(c, u) {
      const b = 24;
      for (const x of [5, 31]) {
        c.rect(x, 7, x + 1, b, IR);
        c.col(x, 7, b, L(IR));
        dots(c, IR, [x - 1, 6, x + 2, 6, x - 1, 5, x + 2, 5]);
      }
      c.row(8, 2, 35, ST);
      c.col(35, 8, 12, ST);
      c.set(34, 12, BONE);
      c.set(2, 8, ID);
      if (u) {
        c.oval(12, 4, 25, 12, MEAT);
        c.row(5, 15, 22, MEATL);
        dots(c, hex('#5a2422'), [15, 10, 19, 11, 22, 9, 14, 8]);
        c.rect(25, 7, 28, 9, BONE);
        dots(c, BONE, [29, 6, 29, 10]);
      }
      // the pit
      c.rect(9, b - 1, 28, b, CHAR);
      fire(c, 10, 27, b - 1, u ? 9 : 4, 3);
      for (let x = 8; x <= 28; x += 4) {
        c.rect(x, b - 1, x + 2, b, BAS);
        c.row(b - 1, x, x + 1, BASL);
      }
      return () => u && (sparks(c, [10, 12, 27, 14, 19, 1]), drip(c, 18, 13, 1, hex('#c9b79a')));
    },
    sw: 16,
    s(c, u) {
      const b = 24;
      if (u) {
        c.oval(4, 4, 11, 12, MEAT);
        c.row(5, 6, 9, MEATL);
        dots(c, hex('#5a2422'), [6, 10, 9, 8]);
      }
      c.rect(7, 7, 8, b, IR);
      c.col(7, 7, b, L(IR));
      dots(c, IR, [6, 6, 9, 6, 6, 5, 9, 5]);
      c.rect(7, 8, 8, 9, ST);
      c.line(8, 8, 11, 11, ST); // the crank
      c.set(12, 12, BONE);
      c.rect(2, b - 1, 13, b, CHAR);
      fire(c, 3, 12, b - 1, u ? 9 : 4, 3);
      for (let x = 2; x <= 12; x += 4) {
        c.rect(x, b - 1, x + 2, b, BAS);
        c.row(b - 1, x, x + 1, BASL);
      }
      return () => u && sparks(c, [3, 13, 13, 15]);
    },
  });

  /* ---------- the frozen sinner ---------- */
  function iceBlock(c, u, x1, side) {
    const b = 34,
      m = (2 + x1) >> 1;
    c.poly([[3, 4], [x1 - 2, 2], [x1, 8], [x1, b], [2, b], [2, 9]], ICE);
    c.line(3, 4, 2, 9, ICEL);
    c.col(2, 9, b, ICEL);
    c.line(3, 4, x1 - 2, 2, ICEL);
    c.line(4, 6, 6, 14, ICEL);
    c.line(x1 - 3, 20, x1 - 2, 30, ICED);
    if (!u) {
      // someone is in there
      const S = hex('#4f6a74');
      c.rect(m - 1, 8, m + 2, 11, S);
      c.rect(m - 2, 13, m + 3, 24, S);
      c.row(12, m - 1, m + 2, S);
      c.rect(m - 2, 25, m, 31, S);
      c.rect(m + 2, 25, m + 3, 31, S);
      if (!side) {
        c.col(m - 4, 10, 16, S);
        c.col(m + 5, 13, 19, S);
        dots(c, NI, [m, 9, m + 2, 9]);
      } else c.set(m + 2, 9, NI);
      c.set(m, 11, NI);
    } else {
      c.rect(m - 2, 7, m + 3, 32, hex('#27363e'));
      c.rect(m - 3, 13, m + 4, 26, hex('#27363e'));
      for (let y = 7; y <= 32; y += 3) c.set(m - 3 + (y % 2), y, ICEL);
      for (let y = 8; y <= 32; y += 4) c.set(m + 4 - (y % 2), y, ICED);
      c.line(m + 4, 4, x1 - 1, 12, ICED);
      c.rect(m - 1, b - 1, m + 2, b, hex('#27363e'));
    }
    dots(c, ICEL, [4, 20, 5, 21, x1 - 4, 5]);
    return () => u && dots(c, ICEL, [1, b, x1 + 1, b - 1, m - 4, b, m + 5, b]);
  }
  O('hell-ice-block-sinner', 'block of ice with a sinner frozen inside frozen lake of the ninth circle traitor in ice', {
    w: 20,
    h: 36,
    f: (c, u) => iceBlock(c, u, 17, false),
    sw: 16,
    s: (c, u) => iceBlock(c, u, 13, true),
  });

  /* ---------- stalagmites ---------- */
  function stalag(c, u, list) {
    const b = 30;
    for (const [x, h, w, lean] of list) spike(c, x, b, h, w, BRIM, lean || 0);
    for (const [x, h] of list) dots(c, BRIML, [x - 1, b - (h >> 1), x - 1, b - 3]);
    const [tx, th, , tl] = list[0],
      tipX = Math.round(tx + (tl || 0)),
      tipY = b - th + 1;
    if (u) {
      skull(c, tipX - 2, tipY + 3);
      c.set(tipX, tipY, BL);
      c.set(tipX, tipY + 1, BL);
      c.set(tipX, tipY + 2, BD);
    }
    return () => u && (drip(c, tipX, tipY + 8, 4), drip(c, tipX - 1, tipY + 9, 2));
  }
  O('hell-stalagmites-red', 'red stalagmites cluster of sharp rock spikes cave floor brimstone needles', {
    w: 28,
    h: 32,
    f: (c, u) => stalag(c, u, [[11, 28, 7, 1], [5, 14, 6, -1], [19, 20, 6, 1], [24, 10, 5, 1], [15, 9, 5, 0]]),
    sw: 18,
    s: (c, u) => stalag(c, u, [[8, 28, 7, 1], [4, 12, 5, -1], [13, 17, 6, 1]]),
  });

  /* ---------- thorn bush ---------- */
  function thorns(c, u, x1, seed) {
    const b = 20,
      r = rnd(seed),
      T = hex('#241c20'),
      TL = hex('#4a3a3e'),
      m = (2 + x1) >> 1,
      n = Math.round((x1 - 2) / 2.6);
    for (let i = 0; i < n; i++) {
      const ex = 2 + Math.round((i * (x1 - 2)) / (n - 1)),
        d = Math.abs(ex - m) / (m - 2),
        ey = 2 + Math.round(d * d * 9 + r() * 4),
        x0 = m + Math.round((ex - m) * 0.25),
        mx = Math.round(x0 + (ex - x0) * 0.6),
        my = Math.round(ey + (b - ey) * (0.25 + r() * 0.2));
      const col = i % 3 === 1 ? TL : T;
      c.line(x0, b, mx, my, col);
      c.line(x0 + 1, b, mx + 1, my, T);
      c.line(mx, my, ex, ey, col);
      // thorns
      c.set(mx + (ex < m ? 1 : -1), my - 2, T);
      c.set(mx + (ex < m ? -1 : 2), my + 1, TL);
      c.set(ex + (ex < m ? 1 : -1), ey - 1, T);
      c.set(Math.round((mx + ex) / 2), Math.round((my + ey) / 2) - 2, T);
      if (i % 2) c.set(ex, ey + 1, BL), c.set(Math.round((mx + ex) / 2) + 1, Math.round((my + ey) / 2) + 1, C.red);
    }
    c.row(b, m - 4, m + 5, T);
    if (u) {
      c.rect(m + 1, 7, m + 4, 10, hex('#8a8474')); // a scrap of a shirt
      c.rect(m + 2, 11, m + 3, 12, hex('#8a8474'));
      c.col(m + 4, 8, 10, hex('#6c6658'));
      dots(c, BL, [m, 9, m + 1, 11, m + 2, 8]);
    }
    return () => u && (drip(c, m + 2, 13, 3), c.set(m + 1, b, BL));
  }
  O('hell-thorn-bush-blood', 'thorn bush black briar with blood red drops thicket of thorns brambles', {
    w: 28,
    h: 22,
    f: (c, u) => thorns(c, u, 25, 5),
    sw: 20,
    s: (c, u) => thorns(c, u, 17, 9),
  });

  /* ---------- the tree of the hanged ---------- */
  function hangTree(c, u, limbs, tx, nooses, side) {
    const b = 46,
      T = hex('#3d3034'),
      TL = hex('#5a484a');
    for (const l of limbs)
      for (let i = 0; i + 1 < l.length; i++) {
        c.line(l[i][0], l[i][1], l[i + 1][0], l[i + 1][1], T);
        if (i === 0) c.line(l[i][0], l[i][1] + 1, l[i + 1][0], l[i + 1][1] + 1, T);
      }
    c.rect(tx, 14, tx + 5, b, T);
    c.col(tx, 14, b, TL);
    c.col(tx + 5, 14, b, D(T));
    c.rect(tx - 2, b - 2, tx + 7, b, T);
    c.rect(tx - 1, b - 5, tx + 6, b - 3, T);
    dots(c, TL, [tx - 2, b - 2, tx + 2, 30, tx + 1, 38, tx + 3, 18]);
    // a face in the bark
    if (side) {
      c.set(tx + 4, 24, u ? EMBER : NI);
      c.rect(tx + 4, 28, tx + 5, 29 + (u ? 2 : 0), NI);
    } else {
      c.set(tx + 1, 24, u ? EMBER : NI);
      c.set(tx + 4, 24, u ? EMBER : NI);
      c.rect(tx + 2, 28, tx + 3, 29 + (u ? 2 : 0), NI);
      dots(c, D(T), [tx + 1, 23, tx + 4, 23]);
    }
    nooses.forEach(([x, y, n], i) => {
      const cut = u && i === 0;
      thin(c, x, y, x, y + (cut ? 3 : n), HIDE);
      if (!cut) {
        c.frame(x - 1, y + n + 1, x + 1, y + n + 4, HIDE);
        c.set(x, y + n + 1, D(HIDE));
      }
    });
    return () => {
      if (!u) return;
      drip(c, side ? tx + 4 : tx + 1, 25, 3);
      if (!side) drip(c, tx + 4, 25, 2);
      drip(c, tx + (side ? 5 : 3), 32, 4, BD);
    };
  }
  O('hell-tree-of-hanged', 'tree of the hanged gnarled dead tree with a face in the bark and nooses wood of suicides', {
    w: 34,
    h: 48,
    f: (c, u) => hangTree(c, u, [[[15, 16], [8, 10], [2, 9]], [[18, 15], [25, 8], [31, 7]], [[16, 14], [14, 5], [10, 2]], [[18, 14], [21, 4]], [[18, 22], [26, 17], [30, 18]]], 14, [[5, 10, 9], [28, 9, 13], [29, 19, 6]], false),
    sw: 24,
    s: (c, u) => hangTree(c, u, [[[10, 16], [5, 9], [2, 8]], [[13, 15], [18, 7], [21, 6]], [[11, 14], [12, 4]]], 9, [[4, 9, 9], [19, 8, 13]], true),
  });

  /* ---------- pitchfork rack ---------- */
  function fork(c, x, y0, y1, three) {
    c.col(x, y0 + 4, y1, WL);
    c.row(y0 + 4, x - 2, x + 2, IR);
    c.col(x - 2, y0, y0 + 3, ST);
    c.col(x + 2, y0, y0 + 3, ST);
    if (three) c.col(x, y0 - 1, y0 + 3, ST);
    c.set(x - 2, y0, L(ST));
  }
  O('hell-pitchfork-rack', 'rack of pitchforks tridents devils forks weapon stand iron prongs', {
    w: 24,
    h: 42,
    f(c, u) {
      const b = 40;
      for (const x of [2, 20]) {
        c.rect(x, 14, x + 1, b, WD);
        c.col(x, 14, b, WL);
        c.rect(x - 1, b - 1, x + 2, b, WD);
      }
      fork(c, 6, 3, b - 3, true);
      if (!u) fork(c, 11, 5, b - 3, false);
      fork(c, 16, 2, b - 3, true);
      c.rect(2, 18, 21, 19, WD);
      c.row(18, 2, 21, WL);
      c.rect(2, b - 5, 21, b - 3, WD);
      c.row(b - 5, 2, 21, WL);
      dots(c, NI, [6, b - 4, 11, b - 4, 16, b - 4]);
      if (u) dots(c, NI, [10, 18, 11, 18, 12, 18]);
      return () => u && dots(c, BD, [16, 3, 16, 6]);
    },
    sw: 10,
    s(c, u) {
      const b = 40;
      c.rect(3, 14, 6, b, WD);
      c.col(3, 14, b, WL);
      c.rect(2, b - 1, 7, b, WD);
      c.rect(7, 18, 8, 19, WD);
      c.rect(7, b - 5, 8, b - 3, WD);
      c.col(8, 6, b - 3, WL);
      c.rect(8, 2, 8, 6, ST);
      c.set(8, 1, L(ST));
      return () => u && dots(c, BD, [8, 3]);
    },
  });

  /* ---------- the imp cage ---------- */
  function impCage(c, u, side) {
    const b = 26;
    c.rect(6, 17, 7, b, IR);
    c.rect(3, b - 1, 10, b, ID);
    c.row(b - 1, 4, 9, IR);
    c.rect(2, 5, 11, 15, NI);
    if (!u) {
      // the imp: small, red, awake
      c.rect(5, 10, 8, 14, hex('#8a3430'));
      c.rect(4, 7, 9, 9, hex('#b04a3c'));
      dots(c, hex('#b04a3c'), [4, 6, 9, 6, 3, 11, 10, 11]);
      side ? c.set(8, 8, LAVAL) : eyes(c, 5, 8, LAVAL, 3);
      c.set(9, 13, hex('#8a3430'));
      c.set(10, 12, hex('#8a3430'));
    } else dots(c, BD, [5, 14, 7, 14, 8, 13]);
    for (const x of [2, 5, 8, 11]) {
      if (u && !side && (x === 5 || x === 8)) continue;
      c.col(x, 5, 15, IR);
    }
    c.row(4, 3, 10, IR);
    c.row(3, 5, 8, IR);
    c.rect(6, 1, 7, 2, ST);
    c.rect(1, 15, 12, 16, IR);
    c.row(15, 1, 12, L(IR));
    c.col(2, 5, 15, L(IR));
    if (!u) c.set(side ? 11 : 9, 10, BR);
    else if (side) {
      c.frame(12, 6, 17, 14, IR);
      c.col(14, 6, 14, IR);
      c.col(16, 6, 14, ID);
    } else {
      c.frame(4, 6, 9, 14, ST);
    }
  }
  O('hell-imp-cage-small', 'small cage on a stand with a red imp inside little devil familiar birdcage', {
    w: 14,
    h: 28,
    f: (c, u) => impCage(c, u, false),
    sw: 14,
    suw: 20,
    s: (c, u) => impCage(c, u, true),
  });

  /* ---------- skull pile ---------- */
  function skullPile(c, u, list) {
    const e = u ? EMBER : NI;
    list.forEach(([x, y, big, sideways], i) => {
      if (sideways) skullS(c, x, y, i % 2 === 0, i % 3 ? BONE : BONED, e);
      else skull(c, x, y, big, i % 3 ? BONE : BONED, e);
    });
  }
  O('hell-skull-pile', 'pile of skulls heap of bones and skulls ossuary mound of the dead', {
    w: 28,
    h: 18,
    f(c, u) {
      c.rect(4, 12, 23, 16, D(BONED));
      c.rect(8, 7, 19, 12, D(BONED));
      skullPile(c, u, [[11, 2, false], [7, 6, false], [14, 5, true], [3, 11, false, true], [9, 11, false], [15, 11, false], [21, 11, false, true], [20, 7, false, true]]);
      bone(c, 2, 16, 8, 16);
      bone(c, 19, 16, 25, 15);
      return () => u && sparks(c, [5, 4, 22, 3, 13, 0 + 1], EMBER);
    },
    sw: 20,
    s(c, u) {
      c.rect(4, 12, 15, 16, D(BONED));
      c.rect(6, 7, 13, 12, D(BONED));
      skullPile(c, u, [[8, 2, false, true], [5, 6, false], [10, 6, false, true], [2, 11, false, true], [7, 11, false], [13, 11, false, true]]);
      bone(c, 2, 16, 7, 16);
      return () => u && sparks(c, [4, 4, 15, 3], EMBER);
    },
  });

  /* ---------- the giant ribcage ---------- */
  O('hell-ribcage-giant', 'giant ribcage of a dead beast huge rib bones arching from the ground spine carcass', {
    w: 44,
    h: 30,
    base: 'side',
    f(c, u) {
      const b = 28;
      if (u) {
        // someone has hung a lantern inside, and made a fire
        thin(c, 22, 6, 22, 12, ST);
        c.frame(21, 13, 23, 17, IR);
        c.rect(22, 14, 22, 16, C.flameLight);
      }
      c.rect(3, 4, 40, 6, BONED); // the spine
      c.row(4, 3, 40, BONE);
      for (let x = 5; x <= 39; x += 3) c.set(x, 3, BONE);
      for (let i = 0; i < 7; i++) {
        const x = 6 + i * 5,
          len = b - (i === 0 || i === 6 ? 5 : i === 1 || i === 5 ? 2 : 0);
        c.col(x, 7, len - 3, BONE);
        c.col(x + 1, 7, len - 4, BONED);
        c.set(x + 1, len - 2, BONE);
        c.set(x + 2, len - 1, BONE);
        c.set(x + 2, len, BONED);
      }
      skull(c, 36, 7, true);
      dots(c, BONED, [2, 5, 1, 6, 1, 7]);
      if (u) {
        c.rect(17, b - 1, 25, b, CHAR);
        fire(c, 17, 25, b - 1, 8, 2);
      }
      return () => u && sparks(c, [18, 19, 20, 17]);
    },
    sw: 26,
    s(c, u) {
      const b = 28;
      if (u) {
        thin(c, 12, 6, 12, 12, ST);
        c.frame(11, 13, 13, 17, IR);
        c.rect(12, 14, 12, 16, C.flameLight);
        c.rect(8, b - 1, 17, b, CHAR);
        fire(c, 8, 17, b - 1, 8, 2);
      }
      // the ribs make an arch
      for (const k of [1, -1]) {
        const X = (x) => (k > 0 ? x : 25 - x);
        dots(c, BONE, [X(10), 5, X(8), 6, X(9), 5, X(6), 7, X(7), 6, X(5), 8, X(4), 9, X(4), 10, X(3), 11]);
        c.col(X(3), 12, b - 4, BONE);
        c.col(X(4), 11, b - 5, BONED);
        dots(c, BONE, [X(4), b - 3, X(4), b - 2, X(5), b - 1, X(5), b]);
      }
      c.rect(11, 3, 14, 6, BONED);
      c.row(3, 11, 14, BONE);
      dots(c, BONE, [12, 2, 13, 2]);
      return () => u && sparks(c, [10, 20, 14, 18]);
    },
  });

  /* ---------- the winch ---------- */
  O('hell-winch-chain-pit', 'winch over a hatch in the floor windlass with chain and hook crank drum lowering into the pit', {
    w: 30,
    h: 30,
    f(c, u) {
      const b = 28;
      for (const x of [4, 23]) {
        c.rect(x, 6, x + 2, b, WD);
        c.col(x, 6, b, WL);
        c.rect(x - 2, b - 1, x + 4, b, WD);
      }
      c.rect(7, 7, 22, 12, WL);
      c.row(7, 7, 22, hex('#765848'));
      c.row(12, 7, 22, WD);
      for (let x = 9; x <= 21; x += 2) c.col(x, 8, 11, u ? ST : x > 11 && x < 19 ? ST : WL);
      c.rect(26, 9, 27, 10, IR);
      u ? c.col(28, 3, 10, IR) : c.col(28, 9, 16, IR);
      c.set(28, u ? 2 : 17, BONE);
      // the hatch below
      c.rect(8, b - 1, 21, b, NI);
      c.frame(7, b - 2, 22, b, IR);
      c.row(b - 1, 9, 20, u ? BD : NI);
      chain(c, 14, 13, u ? 16 : b - 2, ST);
      if (u) {
        // up comes a cage with something in it
        c.rect(11, 17, 18, 25, NI);
        skull(c, 12, 20);
        bars(c, 11, 18, 17, 25, IR, 2);
        c.row(17, 11, 18, IR);
        c.row(25, 10, 19, IR);
      }
      rusty(c, 7, 7, 22, 12, 4, 9);
      return () => u && dots(c, BD, [13, b, 16, b]);
    },
    sw: 18,
    s(c, u) {
      const b = 28;
      c.rect(7, 6, 10, b, WD);
      c.col(7, 6, b, WL);
      c.rect(3, b - 1, 14, b, WD);
      c.line(6, 20, 3, b - 2, WD);
      c.line(11, 20, 14, b - 2, WD);
      ring(c, 5, 5, 12, 12, IR);
      c.set(8, 9, ST);
      c.set(9, 9, ST);
      u ? c.line(9, 9, 13, 5, IR) : c.line(9, 9, 13, 13, IR);
      c.set(14, u ? 4 : 14, BONE);
      if (u) {
        c.rect(11, 17, 15, 25, NI);
        bars(c, 11, 15, 17, 25, IR, 2);
        c.row(17, 11, 15, IR);
        c.row(25, 10, 16, IR);
        dots(c, BONE, [12, 21, 14, 22]);
        thin(c, 13, 13, 13, 16, ST);
      } else thin(c, 13, 15, 13, b - 2, ST);
    },
  });

  /* ---------- the war drum ---------- */
  O('hell-war-drum-hide', 'war drum of stretched hide on a frame bone beaters drum of the damned', {
    w: 24,
    h: 26,
    f(c, u) {
      const b = 24;
      c.line(4, 10, 2, b, WD);
      c.line(19, 10, 21, b, WD);
      c.rect(3, 6, 20, 19, DEMON);
      c.col(3, 6, 19, hex('#8a3a34'));
      c.rect(2, 4, 21, 6, HIDE);
      c.row(4, 3, 20, L(HIDE));
      c.rect(2, 19, 21, 20, HIDE);
      for (let x = 4; x <= 19; x += 4) {
        c.line(x, 7, x + 2, 18, BONED);
        c.line(x + 2, 7, x, 18, D(DEMON));
      }
      dots(c, BR, [3, 5, 8, 5, 13, 5, 18, 5]);
      if (u) {
        c.row(4, 9, 15, NI); // the skin has split
        c.row(5, 10, 13, NI);
        dots(c, L(HIDE), [8, 3, 16, 3]);
        bone(c, 14, 2, 20, 1);
      } else {
        bone(c, 6, 2, 12, 3);
        bone(c, 12, 2, 18, 3);
      }
    },
    sw: 20,
    s(c, u) {
      const b = 24;
      c.line(4, 10, 2, b, WD);
      c.line(15, 10, 17, b, WD);
      c.rect(3, 6, 16, 19, DEMON);
      c.col(3, 6, 19, hex('#8a3a34'));
      c.rect(2, 4, 17, 6, HIDE);
      c.row(4, 3, 16, L(HIDE));
      c.rect(2, 19, 17, 20, HIDE);
      for (let x = 4; x <= 15; x += 4) {
        c.line(x, 7, x + 2, 18, BONED);
        c.line(x + 2, 7, x, 18, D(DEMON));
      }
      skull(c, 7, 10);
      if (u) {
        c.row(4, 7, 12, NI);
        bone(c, 11, 2, 16, 1);
      } else bone(c, 6, 2, 13, 3);
    },
  });
};
