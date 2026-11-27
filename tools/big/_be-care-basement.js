/* Below the house: 31 creatures of the basement. See be-care.js for how mk() works. */
module.exports = (kit, H, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { P, vd, at, flip, pts, both, curve, disc, tube, worm, limb, hand, fingers, spiderLegs, eye, orb, teeth, maw, face, skull, fig, vol, blob, ragged, fade, shadow, drip, tint, seam, ribs, rat, motes } = H;
  const { PALE, DEAD, SICK, RAW, GUM, EYE, YEL, RED, HAIR, TOOTH, WEB, DUST, SOOT, FUR, BRICK, PORC } = P;
  const STEEL = C.steel,
    IRON = C.iron,
    EN = P.ENAMEL,
    SHEET = hex('#d8d6cc'),
    WOOD = C.woodLight,
    LEAD = hex('#6f7c78'),
    GALV = hex('#7d858a'),
    INKW = hex('#1c2a30'),
    INKL = hex('#2f4650'),
    DARKNESS = hex('#15131a'),
    PICKLE = hex('#9aa37a');
  const armL = (c, p, col, hnd, dir = 'd', w = 2, len = 2) => {
    limb(c, p, col, w);
    const e = p[p.length - 1];
    hand(c, e[0], e[1], dir, hnd, len);
  };

  /* ---------- the large ones: tall ---------- */
  mk('furnace-mouth', 'furnace mouth creature iron stove door jaws fire teeth duct arms flue large tall heating monster', [28, 46], (c, r) => {
    const yf = 44,
      FI = hex('#4a4650'),
      FD = dark(FI);
    const duct = (p) => worm(c, p, 1.8, 1.6, GALV);
    if (r) {
      duct([[5, 16], [-2, 12], [-5, 4]]);
      duct([[22, 16], [29, 13], [32, 5]]);
      hand(c, -5, 2, 'u', STEEL, 2);
      hand(c, 32, 3, 'u', STEEL, 2);
      motes(c, 8, -9, 19, -2, 8, hex('#3d3844'), 2);
    } else {
      duct([[5, 16], [0, 22], [1, 34]]);
      duct([[22, 16], [27, 22], [26, 34]]);
      c.rect(0, 35, 2, 36, IRON);
      c.rect(25, 35, 27, 36, IRON);
    }
    c.rect(12, 0, 15, 9, GALV); // the flue
    c.col(15, 0, 9, dark(GALV));
    c.oval(3, 7, 24, 20, FI);
    c.rect(3, 14, 24, 42, FI);
    c.rect(4, 43, 7, yf, FD);
    c.rect(20, 43, 23, yf, FD);
    c.col(3, 14, 42, lite(FI));
    c.row(20, 3, 24, FD);
    c.row(36, 3, 24, FD);
    for (let x = 5; x <= 23; x += 3) pts(c, [[x, 21], [x, 37]], lite(FI));
    c.rect(10, 38, 17, 40, FD);
    c.row(38, 10, 17, K);
    if (r) {
      c.rect(7, 22, 20, 34, K); // the door is a mouth
      c.rect(9, 27, 18, 33, C.flame);
      c.oval(10, 29, 17, 33, C.flameLight);
      c.rect(9, 27, 18, 27, C.blood);
      for (let x = 8; x <= 19; x += 3) {
        c.col(x, 23, 25, STEEL);
        c.col(x + 1, 32, 34, STEEL);
      }
      c.rect(21, 22, 23, 34, FD);
      for (const x of [8, 17]) {
        c.rect(x, 15, x + 2, 17, K);
        c.set(x + 1, 16, C.flameLight);
      }
    } else {
      c.rect(8, 23, 19, 33, FD);
      c.frame(8, 23, 19, 33, K);
      for (const y of [26, 28, 30]) c.row(y, 10, 17, C.flame);
      c.rect(20, 27, 21, 29, STEEL);
      c.rect(8, 16, 10, 17, K);
      c.rect(17, 16, 19, 17, K);
    }
  });

  mk('pale-one', 'the pale one who never saw the sun blind white thin long limbs ribs eyeless large tall cellar dweller monster', [18, 48], (c, r) => {
    const W = hex('#dcd9cf'),
      x = r ? 5 : 1;
    fig(c, x, 0, {
      tl: 15, ll: 20, skin: W, top: W, legs: W, shoe: false, hand: W, face: 'none', arms: r ? 'up' : 'down', al: r ? 4 : 10,
      body(g, yT, yL, yF) {
        for (const y of [yT + 3, yT + 5, yT + 7]) g.row(y, 6, 9, dark(W));
        g.col(8, yT + 9, yL - 1, dark(W));
        g.rect(4, yL - 1, 11, yL + 3, C.ash);
        g.row(yL + 4, 5, 9, dark(C.ash));
        g.row(yF, 2, 13, W); // long feet
        pts(g, [[5, yL + 10], [10, yL + 10]], dark(W)); // knees
      },
    });
    pts(c, [[x + 3, 6], [x + 3, 7], [x + 12, 6], [x + 12, 7]], dark(W)); // ears
    pts(c, [[x + 7, 7], [x + 9, 7]], vd(W));
    if (r) {
      c.rect(x + 7, 3, x + 8, 11, K); // the head opens from crown to chin
      c.rect(x + 6, 5, x + 9, 9, K);
      for (let y = 3; y <= 11; y += 2) pts(c, [[x + 6, y], [x + 9, y + 1]], TOOTH);
      c.col(x + 7, 12, 13, GUM);
    } else c.row(9, x + 6, x + 9, vd(W));
  });

  mk('chain-hanger', 'chain hanger thing hanging upside down from the ceiling pipe by chains long arms to the floor rags hair large tall monster', [16, 48], (c, r) => {
    const RG = hex('#3a3540');
    c.rect(0, 1, 15, 2, LEAD);
    c.row(1, 0, 15, lite(LEAD));
    for (let y = 3; y <= 6; y++) pts(c, [[y % 2 ? 5 : 6, y], [y % 2 ? 10 : 9, y]], STEEL);
    c.rect(5, 7, 6, 9, PALE); // feet, at the top
    c.rect(9, 7, 10, 9, PALE);
    c.rect(5, 10, 10, 17, RG);
    c.col(7, 10, 16, vd(RG));
    c.rect(4, 17, 11, 26, RG);
    c.col(4, 17, 26, lite(RG));
    c.rect(4, 27, 11, 33, PALE); // the head, the wrong way up
    c.row(34, 5, 10, PALE);
    c.col(11, 28, 32, dark(PALE));
    for (let x = 4; x <= 11; x++) c.col(x, 34 + (x === 4 || x === 11 ? -2 : 1), 37 + ((x * 7) % 4), HAIR);
    if (r) {
      pts(c, [[5, 31], [6, 31], [9, 31], [10, 31]], YEL);
      maw(c, 5, 27, 10, 29, {});
      armL(c, [[4, 18], [-3, 24], [-6, 34]], PALE, PALE, 'd', 2, 3);
      armL(c, [[11, 18], [18, 24], [21, 34]], dark(PALE), PALE, 'd', 2, 3);
    } else {
      pts(c, [[6, 31], [9, 31]], K);
      c.row(28, 7, 8, vd(PALE));
      for (const x of [2, 12]) {
        c.rect(x, 18, x + 1, 40, x < 8 ? PALE : dark(PALE));
        hand(c, x, 41, 'd', PALE, 3);
      }
    }
    shadow(c, 3, 12, 47);
  });

  mk('jar-shelf-family', 'shelf of preserving jars pickled family eyes nose teeth fingers in jars one face large tall monster', [24, 44], (c, r) => {
    const yf = 42,
      W = C.wood;
    c.rect(1, 1, 2, yf, W);
    c.rect(21, 1, 22, yf, dark(W));
    for (const y of [13, 27, 40]) {
      c.rect(1, y, 22, y + 1, W);
      c.row(y, 1, 22, lite(W));
    }
    const jar = (x, yb, w, h, lid = true) => {
      c.rect(x, yb - h + 1, x + w - 1, yb, C.glassLight);
      c.rect(x + 1, yb - h + 3, x + w - 2, yb - 1, PICKLE);
      c.col(x, yb - h + 1, yb, lite(C.glassLight));
      if (lid) c.row(yb - h, x, x + w - 1, C.brass);
    };
    for (const x of [4, 14]) {
      jar(x, 12, 6, 10, !r);
      if (r) orb(c, x + 2, 7, 2, K, EYE);
      else {
        c.oval(x + 1, 5, x + 4, 9, PALE);
        c.row(7, x + 1, x + 4, vd(PALE));
      }
    }
    jar(9, 26, 6, 9);
    c.rect(11, 20, 12, 24, RAW); // a nose
    pts(c, [[10, 24], [13, 24]], RAW);
    for (const x of [3, 17]) {
      jar(x, 26, 4, 7, !r);
      if (r) fingers(c, x, x + 3, 21, 4, PALE, -1);
      else pts(c, [[x + 1, 23], [x + 2, 22], [x + 1, 25], [x + 2, 24]], PALE);
    }
    jar(5, 39, 14, 9);
    if (r) {
      c.rect(6, 33, 17, 38, K);
      teeth(c, 6, 17, 33, TOOTH, 1);
      teeth(c, 6, 17, 38, TOOTH, 1);
      c.rect(9, 36, 14, 37, GUM);
    } else {
      c.rect(6, 34, 17, 34, GUM);
      teeth(c, 6, 17, 35, TOOTH, 1);
      teeth(c, 6, 17, 36, dark(TOOTH), 1);
      c.rect(6, 37, 17, 37, GUM);
    }
  });

  mk('stair-dweller', 'the stair dweller under the cellar stairs only fingers and eyes between the treads arms reaching large tall monster', [30, 44], (c, r) => {
    const yf = 42,
      W = C.wood;
    c.rect(3, 3, 26, yf, DARKNESS);
    c.rect(1, 2, 2, yf, dark(W));
    c.rect(27, 2, 28, yf, vd(W));
    const eyes = r ? [[8, 9], [19, 10], [6, 15], [18, 21], [12, 27], [6, 33], [21, 33], [22, 4]] : [[8, 9], [18, 21], [6, 33]];
    for (const [x, y] of eyes) pts(c, [[x, y], [x + 3, y]], YEL);
    if (r) maw(c, 8, 38, 21, 41, { long: true });
    for (let y = 6; y <= 36; y += 6) {
      c.rect(3, y, 26, y + 1, W);
      c.row(y, 3, 26, lite(W));
      pts(c, [[7 + y, y + 1], [20 - (y >> 1), y + 1]], dark(W));
    }
    fingers(c, 15, 19, 13, 2, PALE, -1);
    fingers(c, 5, 9, 31, 2, PALE, -1);
    fingers(c, 19, 23, 25, 2, PALE, -1);
    if (r) {
      armL(c, [[8, 16], [2, 21], [-4, 26]], PALE, PALE, 'l', 2, 3);
      armL(c, [[20, 28], [27, 32], [33, 38]], dark(PALE), PALE, 'r', 2, 3);
      armL(c, [[14, 10], [18, 3], [22, -3]], PALE, PALE, 'u', 2, 3);
    }
  });

  /* ---------- the large ones: long ---------- */
  mk('boiler-beast', 'boiler beast riveted iron boiler on pipe legs gauge eyes firebox mouth steam large long machine monster', [46, 32], (c, r) => {
    const yf = 30,
      B = hex('#5a5560');
    worm(c, [[4, 14], [0, 12], [-3, 16]], 1.2, 0.8, LEAD, { hi: false }); // a pipe for a tail
    for (const x of [9, 16, 29, 36]) {
      if (r && x > 20) limb(c, [[x, 21], [x + 4, 25], [x + 2, yf]], LEAD, 2);
      else c.rect(x, 22, x + 2, yf - 1, LEAD);
      c.rect(x - 1 + (r && x > 20 ? 2 : 0), yf, x + 3 + (r && x > 20 ? 2 : 0), yf, IRON);
    }
    c.rect(14, 0, 17, 7, B);
    c.rect(13, 0, 18, 1, dark(B));
    c.col(27, 3, 6, IRON);
    c.row(3, 25, 29, C.rust);
    c.oval(2, 7, 10, 22, B);
    c.rect(6, 7, 38, 22, B);
    c.row(7, 6, 38, lite(B));
    c.row(22, 6, 38, dark(B));
    for (const x of [12, 20, 28]) c.col(x, 7, 22, dark(B));
    for (let x = 8; x <= 32; x += 4) pts(c, [[x + 2, 9], [x + 2, 20]], lite(B));
    c.oval(34, 6, 43, 23, lite(B)); // its face
    for (const x of [37, 41]) {
      disc(c, x, 10, 1.6, EN);
      c.set(x, 10, r ? RED : K);
    }
    if (r) {
      c.oval(34, 13, 44, 23, K);
      c.oval(36, 16, 42, 21, C.flame);
      c.rect(38, 18, 40, 20, C.flameLight);
      teeth(c, 35, 43, 14, STEEL, 2);
      teeth(c, 36, 42, 22, STEEL, 2);
      motes(c, 11, -8, 21, -1, 9, SHEET, 6);
      pts(c, [[45, 8], [47, 6], [46, 11]], SHEET);
    } else {
      c.rect(36, 15, 42, 20, vd(B));
      c.frame(36, 15, 42, 20, K);
      c.row(17, 38, 41, C.flame);
      pts(c, [[15, -2], [16, -4]], SHEET);
    }
  });

  mk('root-thing', 'root thing roots through the cellar wall like fingers knot eye mouth bricks tree large long monster', [48, 26], (c, r) => {
    const yf = 24,
      RT = hex('#6a503a');
    c.rect(0, 0, 7, yf, BRICK);
    for (let y = 3; y <= yf; y += 4) c.row(y, 0, 7, dark(BRICK));
    for (let y = 0; y <= yf; y += 4) c.col((y % 8) + 1, y, y + 2, dark(BRICK));
    c.oval(2, 6, 9, 18, K);
    const roots = r
      ? [[[5, 10], [14, 4], [24, 2], [34, -4], [40, 1]], [[5, 13], [14, 14], [24, 10], [34, 8], [43, 12]], [[5, 12], [12, 18], [22, yf - 1], [32, yf - 2], [40, yf - 7]], [[5, 11], [10, 3], [17, -3], [22, -1]]]
      : [[[5, 10], [14, 8], [24, 14], [34, yf - 1], [44, yf - 1]], [[5, 13], [12, 17], [20, yf - 1], [30, yf - 1]], [[5, 12], [16, 12], [27, 19], [38, 21], [46, 18]], [[5, 11], [10, 4], [16, 3]]];
    roots.forEach((p, i) => {
      worm(c, p, i === 3 ? 1.6 : 2.6, 0.6, i % 2 ? dark(RT) : RT);
      const e = p[p.length - 1];
      pts(c, [[e[0] + 1, e[1] - 1], [e[0] + 2, e[1] + 1], [e[0] + 2, e[1] - 2]], RT); // rootlets
    });
    for (const [x, y] of [[20, 10], [30, 17], [12, 6]]) c.line(x, y, x + 2, y - 3, dark(RT));
    disc(c, 13, 10, 3.4, dark(RT)); // the knot
    disc(c, 13, 10, 2.2, RT);
    if (r) {
      orb(c, 13, 10, 1.6, K, YEL);
      for (let x = 24; x <= 34; x += 2) {
        c.set(x, 10 - Math.round((x - 24) * 0.2), K); // a root splits open
        c.set(x + 1, 10 - Math.round((x - 24) * 0.2), TOOTH);
      }
    } else c.row(10, 11, 15, K);
  });

  mk('sump-thing', 'sump thing rising from the sump pit black water slick back row of eyes wide mouth arms large long monster', [46, 22], (c, r) => {
    const yf = 20,
      SK = hex('#2c3a36');
    c.oval(1, yf - 5, 44, yf, IRON);
    c.oval(3, yf - 4, 42, yf - 1, INKW);
    c.rect(38, 2, 39, yf - 3, LEAD);
    c.row(2, 39, 44, LEAD);
    if (r) {
      worm(c, [[11, 6], [3, 8], [1, yf - 6]], 2.2, 1.4, SK);
      worm(c, [[33, 6], [41, 9], [43, yf - 6]], 2.2, 1.4, SK);
      hand(c, 1, yf - 5, 'd', lite(SK), 2);
      hand(c, 43, yf - 5, 'd', lite(SK), 2);
      c.oval(10, -6, 34, yf + 4, SK);
      vol(c, 9, -7, 35, yf - 3, 1.5, 0.8);
      for (const x of [14, 19, 24, 29]) pts(c, [[x, 0 - (x % 2)], [x + 1, 0 - (x % 2)]], YEL);
      maw(c, 14, 4, 30, 9, { long: true, round: true });
      for (const [x, y, n] of [[12, 8, 5], [22, 11, 4], [32, 7, 6], [17, -4, 3]]) drip(c, x, y, n, INKL);
    } else {
      c.oval(12, yf - 9, 32, yf + 2, SK);
      c.row(yf - 9, 17, 27, lite(SK));
      pts(c, [[16, yf - 6], [20, yf - 7], [24, yf - 7], [28, yf - 6]], YEL);
    }
    c.row(yf - 3, 6, 39, INKW);
    c.row(yf - 2, 5, 40, INKW);
    c.row(yf - 1, 8, 37, INKW);
    pts(c, [[9, yf - 3], [14, yf - 2], [30, yf - 2], [35, yf - 3]], INKL);
    c.clearRect(-2, yf + 1, 48, yf + 6);
  });

  mk('rat-mass', 'rat mass rat king heap of rats tails knotted red eyes rising with a face swarm large long vermin monster', [44, 22], (c, r) => {
    const yf = 20,
      cols = [FUR, hex('#4a454c'), hex('#6a6266'), hex('#3d3940')],
      D = hex('#322e37');
    if (r) c.oval(7, -9, 36, yf + 12, D);
    c.oval(3, 5, 40, yf + 10, D);
    c.clearRect(-4, yf + 1, 48, yf + 14);
    const where = [[2, yf, 0], [13, yf, 1], [24, yf, 0], [33, yf, 1], [6, yf - 5, 1], [17, yf - 5, 0], [28, yf - 5, 0], [11, yf - 10, 0], [22, yf - 10, 1]];
    if (r) where.push([9, yf - 15, 1], [25, yf - 15, 0], [12, yf - 21, 0], [22, yf - 21, 1], [17, yf - 25, 0]);
    else where.push([16, yf - 14, 0]);
    where.forEach(([x, y, f], i) => rat(c, f ? x + 8 : x, y, !!f, cols[i % 4]));
    for (const [x, y] of [[1, yf - 6], [41, yf - 4], [38, yf - 9], [4, yf - 11]]) worm(c, [[x, y], [x + (x < 20 ? -2 : 2), y - 2], [x + (x < 20 ? -1 : 3), y - 5]], 0.6, 0.6, RAW, { hi: false });
    if (r) {
      c.oval(14, yf - 13, 29, yf - 7, K); // together they have a mouth
      teeth(c, 15, 28, yf - 12, TOOTH, 2);
      teeth(c, 16, 27, yf - 8, TOOTH, 2);
      for (const x of [14, 26]) {
        c.rect(x, yf - 19, x + 2, yf - 17, K);
        c.set(x + 1, yf - 18, YEL);
      }
    }
  });

  mk('cable-centipede', 'cable centipede electric flex porcelain insulators copper wire legs plug head sparks large long vermin monster', [46, 14], (c, r) => {
    const yf = 12,
      CB = hex('#2c2b33'),
      CU = hex('#b3692c'),
      p = curve(r ? [[3, 8], [12, 6], [22, 9], [30, 5], [34, -2], [39, -6]] : [[3, 8], [12, 6], [22, 9], [32, 6], [41, 8]], 8);
    for (const [x, y] of [[0, 6], [-1, 9], [0, 11]]) c.line(3, 8, x, y, CU); // frayed
    p.forEach(([x, y], i) => {
      if (i % 4 !== 2) return;
      if (y > 3) limb(c, [[x, y + 2], [x - 1, y + 3], [x + 1, yf]], CU, 1);
      else limb(c, [[x + 1, y], [x + 4, y - 1], [x + 5, y + 2]], CU, 1);
    });
    tube(c, p, 1.2, 1.2, CB, { hi: false });
    p.forEach(([x, y], i) => {
      if (i % 4 !== 2) return;
      disc(c, x, y, 1.8, PORC);
      c.set(x + 1, y + 1, dark(PORC));
    });
    const hx = Math.round(p[p.length - 1][0]),
      hy = Math.round(p[p.length - 1][1]);
    c.rect(hx, hy - 2, hx + 4, hy + 2, C.woodDark);
    c.row(hy - 2, hx, hx + 4, C.wood);
    c.row(hy - 1, hx + 5, hx + 7, C.brass);
    c.row(hy + 1, hx + 5, hx + 7, C.brass);
    if (r) {
      pts(c, [[hx + 1, hy - 1], [hx + 3, hy - 1]], YEL);
      limb(c, [[hx + 8, hy], [hx + 10, hy - 2], [hx + 11, hy + 1], [hx + 13, hy - 1]], C.flameLight, 1);
      pts(c, [[hx + 9, hy + 3], [hx + 10, hy - 4], [hx + 12, hy + 3]], C.flameLight);
    } else c.set(hx + 2, hy - 1, YEL);
  });

  /* ---------- person-sized ---------- */
  mk('coal-dust-man', 'coal dust man figure of soot black crumbling ember mouth white eyes shovel coal cellar monster', [18, 34], (c, r) => {
    const S2 = hex('#3d3844');
    if (!r) {
      c.col(15, 9, 30, WOOD);
      c.rect(14, 29, 16, 32, IRON);
    }
    fig(c, 1, 1, { skin: SOOT, top: SOOT, legs: SOOT, shoe: SOOT, hand: SOOT, face: 'none', arms: r ? { l: 'reach', r: 'out' } : 'down' });
    c.speckle(-6, 0, 22, 33, S2, 4, 3);
    for (const [x, y] of [[4, 14], [13, 20], [5, 28], [12, 31], [5, 5]]) c.clear(x, y); // he crumbles
    motes(c, r ? -7 : -1, r ? -3 : 2, r ? 24 : 18, 32, r ? 26 : 9, SOOT, 8);
    if (r) {
      pts(c, [[6, 7], [10, 7]], C.flameLight);
      c.rect(7, 9, 10, 11, C.flame);
      c.row(10, 8, 9, C.flameLight);
      pts(c, [[8, 16], [9, 18], [8, 20]], C.flame);
    } else pts(c, [[6, 7], [10, 7]], EYE);
  });

  mk('cobweb-bride', 'cobweb bride veil and gown of spider web jilted dead bouquet many eyes fangs spiders ghost monster', [20, 36], (c, r) => {
    const W = WEB,
      WD = dark(W);
    c.line(5, 16, 0, 9, W); // threads
    c.line(14, 16, 19, 7, W);
    c.col(1, 9, 16, WD);
    c.col(18, 7, 13, WD);
    fig(c, 2, 2, { skin: DEAD, top: W, robe: W, hand: DEAD, face: 'hollow', arms: r ? 'up' : 'hold' });
    c.poly([[6, 25], [13, 25], [18, 34], [1, 34]], W);
    for (const x of [4, 8, 11, 15]) c.line(9, 24, x, 34, WD);
    c.row(30, 4, 15, WD);
    ragged(c, 1, 18, 34, 2, 7);
    if (r) {
      c.rect(7, 6, 12, 9, DEAD);
      pts(c, [[7, 7], [9, 7], [12, 7], [8, 9], [10, 9], [11, 8]], YEL); // too many eyes
      c.rect(8, 11, 11, 13, K);
      pts(c, [[8, 12], [11, 12]], TOOTH);
      for (const s of [0, 1]) for (const y of [16, 20, 24]) c.line(s ? 18 : 1, 4, s ? 13 : 6, y, W);
      c.oval(6, 1, 13, 4, W);
    } else {
      c.oval(5, 2, 14, 8, W); // the veil
      c.dither(6, 5, 13, 14, W);
      c.col(5, 5, 16, W);
      c.col(14, 5, 16, WD);
      pts(c, [[8, 19], [10, 18], [11, 20], [9, 21]], C.wine); // what is left of the flowers
      pts(c, [[9, 19], [10, 20]], C.leaf);
    }
    for (const [x, y] of [[4, 28], [15, 21]]) {
      c.set(x, y, K);
      pts(c, [[x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]], K);
    }
  });

  mk('bricked-up', 'the bricked up one walled in figure coming out of the brick wall face arms mortar immured monster', [22, 30], (c, r) => {
    const yf = 28,
      M = hex('#8d8a84');
    c.rect(1, 1, 20, yf, M);
    for (let j = 0; j < 7; j++)
      for (let x = 1 - (j % 2) * 3; x <= 20; x += 6) {
        c.rect(Math.max(1, x), 1 + j * 4, Math.min(20, x + 4), 3 + j * 4, BRICK);
        c.row(1 + j * 4, Math.max(1, x), Math.min(20, x + 4), lite(BRICK));
      }
    c.clearRect(1, 1, 3, 3);
    c.clearRect(17, 1, 20, 3);
    if (r) {
      c.rect(5, 4, 16, 24, K);
      c.rect(6, 14, 15, 24, hex('#4a4650'));
      face(c, 7, 5, DEAD, 'jaws', YEL);
      armL(c, [[6, 15], [0, 17], [-5, 13]], DEAD, DEAD, 'u', 2, 2);
      armL(c, [[15, 15], [21, 19], [25, 24]], dark(DEAD), DEAD, 'd', 2, 2);
      c.rect(-6, yf - 2, -2, yf, BRICK);
      c.rect(22, yf - 1, 26, yf, BRICK);
      pts(c, [[-3, yf - 4], [20, yf - 3]], M);
    } else {
      face(c, 7, 6, C.stoneLight, 'hollow');
      c.row(8, 7, 14, M);
      c.row(12, 7, 14, M);
      c.rect(14, 18, 18, 19, DEAD); // a hand got out
      pts(c, [[19, 17], [19, 19], [19, 21], [18, 20]], DEAD);
    }
  });

  mk('tallow-man', 'tallow man candle man melting wax figure wick flame on his head running face drips monster', [16, 32], (c, r) => {
    const T = hex('#d6cda4'),
      TD = dark(T),
      yf = 30;
    if (r) {
      limb(c, [[3, 13], [-2, 9], [-4, 3]], T, 2);
      limb(c, [[12, 13], [17, 10], [19, 4]], T, 2);
      for (const [x, y, n] of [[-2, 10, 5], [-4, 4, 4], [17, 11, 6], [19, 5, 3]]) drip(c, x, y, n, T);
    } else {
      c.rect(2, 12, 3, 20, T);
      c.rect(12, 12, 13, 23, T);
      pts(c, [[2, 21], [3, 22], [13, 24], [12, 25]], T);
    }
    c.poly([[5, 10], [10, 10], [12, yf - 3], [14, yf], [1, yf], [3, yf - 3]], T);
    c.rect(3, 11, 12, 14, T);
    c.oval(4, 3, 11, 11, T);
    c.row(yf, 0, 15, T);
    for (const [x, a, b] of [[5, 14, 22], [8, 16, 27], [10, 12, 19], [4, 24, 28], [11, 22, 29]]) c.col(x, a, b, TD);
    vol(c, -5, 3, 20, yf, 1.1, 0.8);
    c.col(7, 1, 2, K);
    if (r) {
      c.poly([[6, 0], [9, 0], [8, -6], [7, -3]], C.flame);
      c.rect(7, -2, 8, 0, C.flameLight);
      c.rect(5, 6, 6, 9, K);
      c.rect(9, 6, 10, 10, K);
      c.rect(7, 10, 8, 16, K);
      c.set(7, 16, C.blood);
    } else {
      c.set(7, 0, C.flame);
      c.set(7, -1, C.flameLight);
      pts(c, [[6, 6], [9, 6], [9, 7]], K);
      c.row(9, 7, 8, vd(T));
      c.set(9, 10, vd(T));
    }
  });

  mk('mangle-beast', 'mangle beast wringer laundry rollers for jaws cast iron crank cloth tongue teeth washday machine monster', [26, 30], (c, r) => {
    const yf = 26,
      FI = hex('#3f4a46'),
      RO = C.woodPale;
    c.rect(2, 2, 4, yf, FI);
    c.rect(17, 2, 19, yf, dark(FI));
    c.row(yf, 0, 6, FI);
    c.row(yf, 15, 21, FI);
    c.rect(2, 1, 19, 3, FI);
    c.row(1, 2, 19, lite(FI));
    c.col(10, -2, 0, STEEL);
    c.row(-2, 8, 13, STEEL);
    c.rect(1, 17, 20, 18, WOOD);
    disc(c, 21, 10, 3.6, FI);
    disc(c, 21, 10, 2.2, dark(FI));
    if (r) {
      c.rect(5, 8, 16, 12, K);
      c.rect(5, 4, 16, 7, RO);
      c.rect(5, 13, 16, 16, dark(RO));
      teeth(c, 5, 16, 8, TOOTH, 2);
      teeth(c, 5, 16, 12, TOOTH, 2);
      c.poly([[8, 11], [13, 11], [14, 20], [12, 25], [9, 22]], RAW); // the cloth is a tongue
      c.col(11, 12, 22, dark(RAW));
      for (const x of [6, 14]) {
        c.rect(x, 1, x + 1, 2, K);
        c.set(x, 2, YEL);
      }
      armL(c, [[22, 9], [26, 4], [29, 9]], FI, STEEL, 'd', 2, 2);
    } else {
      c.rect(5, 6, 16, 9, RO);
      c.rect(5, 10, 16, 13, dark(RO));
      c.row(6, 5, 16, lite(RO));
      c.rect(9, 10, 12, 20, SHEET);
      c.col(11, 11, 20, dark(SHEET));
      c.rect(23, 6, 24, 7, WOOD);
      c.line(21, 10, 23, 7, STEEL);
    }
  });

  mk('freezer-thing', 'chest freezer thing frozen figure sitting up frost blue fingers lid ice breath cold monster', [28, 20], (c, r) => {
    const yf = 18,
      IC = hex('#a9cdd6'),
      BL = hex('#7f9fb4');
    if (r) {
      c.rect(1, -11, 26, 6, dark(EN)); // the lid stands open
      c.frame(1, -11, 26, 6, EN);
      c.rect(9, -2, 18, 6, BL);
      face(c, 10, -10, IC, 'hollow');
      pts(c, [[10, -11], [12, -12], [14, -11], [16, -12], [17, -11]], IC);
      pts(c, [[12, -7], [16, -7]], SHEET);
      armL(c, [[18, 0], [23, -3], [26, -8]], BL, IC, 'u', 2, 2);
    }
    c.rect(1, 7, 26, yf, EN);
    c.row(7, 1, 26, lite(EN));
    c.row(yf, 1, 26, dark(EN));
    c.speckle(1, 13, 26, yf, C.rust, 9, 2);
    for (const x of [20, 22, 24]) c.col(x, 14, 16, IRON);
    if (r) {
      armL(c, [[9, 1], [5, 4], [4, 8]], BL, IC, 'd', 2, 2);
      motes(c, 0, -14, 27, -1, 8, IC, 9);
    } else {
      c.rect(0, 3, 27, 5, EN);
      c.row(3, 0, 27, lite(EN));
      c.row(6, 3, 24, K);
      pts(c, [[10, 6], [14, 6]], IC);
      fingers(c, 17, 21, 6, 3, BL, 1);
      pts(c, [[8, 1], [12, 0], [15, 1], [11, -2]], IC); // its breath
    }
  });

  mk('crawlspace-crawler', 'crawlspace crawler flat pale thing squeezing out of the low hatch elbows up head twisted round monster', [26, 14], (c, r) => {
    const yf = 12;
    c.rect(-1, 1, 6, yf, C.stoneDark);
    c.rect(0, 3, 5, yf, K);
    limb(c, [[10, yf - 3], [9, yf - 9], [12, yf]], dark(PALE), 2);
    c.row(yf, 11, 15, PALE);
    c.rect(3, yf - 3, 17, yf - 1, PALE);
    c.row(yf - 3, 4, 16, lite(PALE));
    for (let x = 5; x <= 15; x += 2) c.set(x, yf - 4, dark(PALE)); // its spine
    if (r) {
      worm(c, [[16, yf - 3], [18, yf - 7], [20, yf - 8]], 1.3, 1.3, PALE);
      face(c, 17, yf - 17, PALE, 'jaws', YEL);
      for (const x of [17, 19, 22, 24]) c.col(x, yf - 20, yf - 17, HAIR);
      armL(c, [[15, yf - 3], [22, yf - 4], [28, yf - 7]], PALE, PALE, 'r', 2, 2);
    } else {
      limb(c, [[15, yf - 3], [16, yf - 10], [20, yf]], PALE, 2);
      c.row(yf, 19, 23, PALE);
      c.rect(18, yf - 6, 24, yf - 1, PALE);
      c.rect(18, yf - 7, 24, yf - 6, HAIR);
      pts(c, [[20, yf - 4], [23, yf - 4]], K);
      c.row(yf - 2, 21, 22, vd(PALE));
    }
  });

  mk('chained-hound', 'chained hound starved eyeless dog ribs opening like jaws chain cellar guard dog beast monster', [30, 20], (c, r) => {
    const yf = 18,
      D = hex('#4a4248'),
      hy = r ? -3 : 0;
    c.rect(0, yf - 2, 1, yf, IRON);
    for (let i = 0; i <= 7; i++) c.set(2 + i * 2, yf - 1 - Math.round(i * i * 0.17), STEEL);
    limb(c, [[6, 8], [2, 10], [3, 14]], D, 1);
    for (const [x, k] of [[7, -1], [9, 1], [17, -1], [19, 1]]) {
      limb(c, [[x, 11], [x + k, 14], [x, yf]], k > 0 ? D : dark(D), 1 + (k > 0));
      c.set(x + 1, yf, D);
    }
    c.rect(6, 7, 19, 11, D);
    c.row(6, 8, 17, D);
    c.clearRect(10, 11, 15, 11);
    c.poly([[17, 6], [22, 3 + hy], [23, 7 + hy], [19, 11]], D);
    c.rect(21, 2 + hy, 26, 6 + hy, D);
    c.rect(25, 4 + hy, 29, 6 + hy, D);
    pts(c, [[21, 1 + hy], [23, 1 + hy]], D);
    c.rect(23, 3 + hy, 24, 4 + hy, K); // no eye in it
    c.row(6, 9, 16, lite(D));
    if (r) {
      c.rect(25, 9 + hy, 29, 10 + hy, D);
      c.rect(25, 7 + hy, 29, 8 + hy, K);
      teeth(c, 25, 29, 7 + hy, TOOTH, 2);
      teeth(c, 26, 29, 8 + hy, TOOTH, 2);
      c.rect(9, 8, 16, 14, K); // the ribs open too
      for (const x of [9, 11, 13, 15]) {
        c.col(x, 8, 9, C.bone);
        c.col(x + 1, 13, 15, C.bone);
      }
      c.set(12, 11, RED);
    } else {
      for (const x of [10, 12, 14]) c.col(x, 8, 10, lite(D));
      teeth(c, 26, 29, 7, TOOTH, 2);
    }
  });

  mk('drain-arm', 'drain arm long grey arm rising from the floor drain eye in the palm more arms grate monster', [14, 24], (c, r) => {
    const yf = 22,
      A = hex('#9aa29a');
    c.oval(1, yf - 3, 12, yf, IRON);
    c.oval(3, yf - 2, 10, yf - 1, K);
    if (r) {
      armL(c, [[5, yf - 2], [0, 14], [-3, 9]], dark(A), A, 'u', 1, 2);
      armL(c, [[9, yf - 2], [14, 13], [17, 10]], dark(A), A, 'u', 1, 2);
    }
    worm(c, [[7, yf - 2], [5, 12], [8, 6]], 1.4, 1.3, A);
    disc(c, 8, 4, 2.6, A);
    for (const [x, d] of [[5, -1], [7, 0], [9, 0], [11, 1]]) c.line(x, 2, x + (r ? d * 2 : d), r ? -4 : -2, A);
    c.line(11, 5, r ? 14 : 12, r ? 3 : 4, A);
    if (r) orb(c, 8, 4, 1.4, K, YEL);
    else c.row(4, 7, 9, K);
  });

  mk('bulb-angler', 'light bulb angler dark thing dangling a bare bulb as a lure huge mouth teeth in the dark cellar monster', [20, 32], (c, r) => {
    const yf = 30,
      D = hex('#2a2630'),
      DL = hex('#4a4452');
    blob(c, 9, 22, 8.5, 8, D, 3, 0.1);
    c.rect(2, 24, 16, yf, D);
    c.clearRect(-3, yf + 1, 22, yf + 4);
    vol(c, 0, 13, 18, yf, 1.5, 0.8);
    worm(c, [[9, 15], [8, 8], [12, 3], [16, 5], [16, 9]], 0.7, 0.7, DL, { hi: false });
    c.rect(15, 9, 17, 9, C.brass);
    c.oval(14, 10, 18, 15, r ? C.flameLight : C.glow);
    c.set(16, 12, C.flame);
    c.set(15, 11, SHEET);
    if (r) {
      c.oval(2, 18, 16, 28, K);
      c.oval(5, 23, 13, 27, GUM);
      for (let x = 3; x <= 15; x += 2) {
        c.col(x, 19 + (x < 5 || x > 13 ? 1 : 0), 21, TOOTH);
        c.col(x + 1, 25, 27 - (x < 4 || x > 12 ? 1 : 0), TOOTH);
      }
      pts(c, [[5, 15], [12, 15]], YEL);
      pts(c, [[12, 9], [19, 8], [20, 13], [13, 16]], C.glow);
    } else {
      teeth(c, 3, 15, 22, TOOTH, 2);
      pts(c, [[5, 18], [12, 18]], hex('#8d8a84'));
    }
  });

  mk('tank-drowned', 'the drowned one in the water tank wet hair over the rim hands rising woman galvanised butt ghost monster', [22, 30], (c, r) => {
    const yf = 28,
      G = GALV;
    if (r) {
      c.rect(5, 8, 16, 11, hex('#4a4458'));
      c.oval(6, 0, 15, 10, HAIR);
      c.rect(9, 3, 12, 9, PALE);
      c.set(10, 5, YEL);
      c.rect(10, 7, 11, 8, K);
      for (const x of [6, 8, 13, 15]) c.col(x, 6, 13 + (x % 3), HAIR);
    }
    c.rect(3, 12, 18, yf, G);
    for (let x = 5; x <= 17; x += 3) c.col(x, 13, yf, dark(G));
    c.col(3, 12, yf, lite(G));
    c.row(16, 3, 18, vd(G));
    c.row(25, 3, 18, vd(G));
    c.rect(2, 11, 19, 12, lite(G));
    if (r) {
      armL(c, [[5, 9], [0, 14], [1, 24]], PALE, PALE, 'd', 2, 3);
      armL(c, [[16, 9], [22, 12], [25, 18]], dark(PALE), PALE, 'd', 2, 3);
      for (const [x, y, n] of [[7, 14, 4], [12, 13, 6], [15, 15, 3]]) drip(c, x, y, n, INKL);
    } else {
      for (let x = 7; x <= 14; x++) c.col(x, 10, 13 + ((x * 5) % 6), HAIR);
      c.row(10, 8, 13, HAIR);
      fingers(c, 3, 5, 11, 3, PALE, 1);
      fingers(c, 16, 18, 11, 3, PALE, 1);
    }
  });

  mk('boiler-suit-empty', 'empty boiler suit hanging on a nail overalls nobody inside fingers from the collar and cuffs monster', [16, 36], (c, r) => {
    const N = hex('#465a70');
    fig(c, 0, r ? 3 : 1, {
      top: N, legs: N, shoe: false, head: false, hand: DARKNESS, arms: r ? { l: 'reach', r: 'up' } : 'down',
      body(g, yT, yL, yF) {
        g.rect(6, yT - 1, 9, yT, DARKNESS);
        pts(g, [[5, yT - 1], [10, yT - 1]], lite(N));
        pts(g, [[8, yT + 3], [8, yT + 6], [8, yT + 9]], C.brass);
        g.rect(9, yT + 2, 10, yT + 3, dark(N));
        pts(g, [[5, yL + 3], [10, yL + 5], [6, yT + 7]], vd(N)); // oil
        g.row(yF, 4, 6, DARKNESS);
        g.row(yF, 8, 11, DARKNESS);
      },
    });
    if (r) {
      for (const [x, h] of [[5, 3], [7, 6], [9, 7], [11, 4]]) c.col(x, 14 - h - 1, 14, PALE); // fingers where the head should be
      fingers(c, 5, 9, 33, 4, PALE, 1);
      pts(c, [[-7, 21], [-7, 23], [-7, 25], [15, 2], [17, 2], [19, 3]], PALE);
    } else {
      c.col(8, 4, 11, STEEL); // the nail it hangs from
      c.row(4, 7, 9, IRON);
      pts(c, [[7, 12], [8, 12]], YEL);
      shadow(c, 3, 12, 35);
    }
  });

  /* ---------- vermin and small things ---------- */
  mk('jar-head-hopper', 'jar preserved head that hops pickled head in a jar hopping eyes open bubbles small thing', [12, 16], (c, r) => {
    const yf = 14,
      y = r ? -5 : 0;
    c.rect(2, 3 + y, 9, yf + y, C.glassLight);
    c.rect(3, 5 + y, 8, yf - 1 + y, PICKLE);
    c.rect(3, 6 + y, 8, yf - 1 + y, PALE);
    c.col(2, 3 + y, yf + y, lite(C.glassLight));
    pts(c, [[3, 6 + y], [5, 5 + y], [8, 6 + y]], HAIR);
    if (r) {
      c.poly([[1, 1 + y], [9, -1 + y], [9, y], [2, 2 + y]], C.brass);
      pts(c, [[4, 8 + y], [7, 8 + y]], EYE);
      c.rect(5, 10 + y, 6, 12 + y, K);
      pts(c, [[7, 4 + y], [5, 3 + y]], SHEET);
      shadow(c, 2, 9, yf);
    } else {
      c.rect(2, 1, 9, 2, C.brass);
      c.row(8, 4, 4, K);
      c.row(8, 7, 7, K);
      c.row(11, 5, 6, vd(PALE));
    }
  });

  mk('hand-spider', 'spider with a human hand for a body hand spider eight legs fingers eye in the palm small vermin', [18, 12], (c, r) => {
    const yf = 10,
      up = r ? 4 : 0;
    spiderLegs(c, 8, 6 - up, { n: 4, col: hex('#3a3034'), yf, kh: 4, reach: 3, step: 1.6, body: 2 });
    if (r) {
      c.rect(5, -3, 10, 3, PALE);
      for (const [x, h] of [[5, 3], [7, 4], [9, 4], [11, 2]]) c.col(x, -3 - h, -3, PALE);
      c.col(4, -1, 1, PALE);
      orb(c, 8, 0, 1.4, K, YEL);
      c.rect(6, 4, 9, 5, dark(PALE));
    } else {
      c.rect(6, 2, 9, 3, dark(PALE)); // the wrist
      c.row(1, 6, 9, RAW);
      c.rect(5, 4, 10, 7, PALE);
      for (const x of [5, 7, 9]) c.col(x, 8, 9, PALE);
      c.set(4, 6, PALE);
      c.row(4, 5, 10, lite(PALE));
    }
  });

  mk('fuse-sprite', 'fuse box sprite little spark imp ceramic fuse body wire limbs electric crackle small thing', [10, 14], (c, r) => {
    const yf = 12,
      SPK = C.flameLight,
      CU = hex('#b3692c');
    limb(c, [[4, 10], [3, yf]], CU, 1);
    limb(c, [[6, 10], [7, yf]], CU, 1);
    limb(c, [[3, 6], [1, r ? 2 : 8]], CU, 1);
    limb(c, [[7, 6], [9, r ? 3 : 8]], CU, 1);
    c.rect(4, 4, 6, 9, PORC);
    c.row(4, 4, 6, C.brass);
    c.row(9, 4, 6, C.brass);
    c.set(5, 6, K);
    pts(c, [[5, 0], [5, 1], [4, 1], [6, 1], [5, 2]], SPK);
    if (r) {
      pts(c, [[5, -2], [3, -1], [7, -1], [2, 1], [8, 1], [5, -3]], SPK);
      c.set(5, 1, SHEET);
      limb(c, [[1, 2], [-1, 0], [0, -2], [-2, -3]], C.flame, 1);
      limb(c, [[9, 3], [11, 1], [10, -1], [12, -2]], C.flame, 1);
    }
  });

  mk('slug-face', 'slug with a human face pale fat slug teeth eye stalks slime trail small vermin', [22, 10], (c, r) => {
    const S = hex('#b9ad94'),
      yf = 8,
      p = curve(r ? [[3, yf - 1], [10, yf - 2], [15, yf - 5], [17, yf - 10]] : [[3, yf - 1], [10, yf - 3], [17, yf - 2]], 8),
      hx = Math.round(p[p.length - 1][0]),
      hy = Math.round(p[p.length - 1][1]);
    c.row(yf, -2, 5, P.SLIME);
    tube(c, p, 1.2, 2.7, S);
    c.clearRect(-3, yf + 1, 24, yf + 4);
    c.line(hx, hy - 3, hx - 1, hy - 6, S);
    c.line(hx + 2, hy - 3, hx + 3, hy - 6, S);
    pts(c, [[hx - 1, hy - 7], [hx + 3, hy - 7]], K);
    pts(c, [[hx, hy - 1], [hx + 2, hy - 1]], K);
    if (r) maw(c, hx - 1, hy + 1, hx + 2, hy + 3, { step: 1 });
    else teeth(c, hx - 1, hx + 2, hy + 1, TOOTH, 1);
    pts(c, [[7, yf - 3], [11, yf - 4]], dark(S));
  });

  mk('cave-cricket', 'cave cricket camel cricket humped long hind legs feelers jumping mandibles cellar insect small vermin', [18, 12], (c, r) => {
    const B = hex('#8a6a48'),
      yf = 10,
      y = r ? -5 : 0;
    if (r) {
      limb(c, [[5, 6 + y], [-1, 6 + y], [-5, yf]], dark(B), 2);
      shadow(c, 4, 12, yf);
    } else limb(c, [[5, 6], [1, 0], [0, yf]], dark(B), 2);
    limb(c, [[9, 8 + y], [10, yf + (r ? -3 : 0)]], dark(B), 1);
    limb(c, [[11, 8 + y], [13, yf + (r ? -4 : 0)]], dark(B), 1);
    c.oval(4, 3 + y, 10, 8 + y, B);
    for (const x of [6, 8]) c.col(x, 4 + y, 7 + y, dark(B));
    c.rect(10, 5 + y, 12, 8 + y, B);
    c.line(12, 5 + y, 17, y, dark(B));
    c.line(12, 5 + y, 18, 3 + y, dark(B));
    c.set(11, 6 + y, r ? RED : K);
    if (r) pts(c, [[13, 8 + y], [13, 9 + y], [12, 9 + y]], TOOTH);
  });

  mk('coal-crawlers', 'coal crawlers lumps of coal with legs ember eyes glowing cracks swarm small vermin', [18, 10], (c, r) => {
    [[1, 7], [7, 8], [13, 7], [4, 3], [10, 3]].forEach(([x, y], i) => {
      c.rect(x, y - 2, x + 3, y, SOOT);
      c.clear(x + (i % 2 ? 0 : 3), y - 2);
      c.set(x + 1, y - 2, hex('#4a4452'));
      pts(c, [[x, y + 1], [x + 3, y + 1]], K);
      c.set(x + 2, y - 1, C.flame);
      if (r) {
        c.set(x + 1, y - 1, C.flameLight);
        c.set(x + 1, y, C.flame);
        c.set(x + 3, y - 1, C.flame);
      }
    });
    if (r) pts(c, [[3, 0], [9, -1], [15, 2]], C.flame);
  });

  mk('eye-mushrooms', 'eye mushrooms pale toadstools whose caps are eyes cluster fungus watching small thing', [14, 12], (c, r) => {
    const yf = 10,
      ST = hex('#cfc8b0'),
      CAP = hex('#b9ad94');
    c.row(yf, 0, 13, C.earth);
    [[3, 5], [7, 3], [11, 6]].forEach(([x, h]) => {
      const t = yf - h - (r ? 3 : 0);
      c.col(x, t, yf - 1, ST);
      if (r) {
        orb(c, x, t - 1, 1.6, K, EYE);
        c.row(t - 3, x - 1, x + 1, CAP);
      } else {
        c.oval(x - 2, t - 3, x + 2, t, CAP);
        c.row(t, x - 1, x + 1, dark(CAP));
        c.set(x - 1, t - 2, lite(CAP));
      }
    });
  });

  mk('cellar-toad', 'cellar toad pale warty toad with human teeth grin tongue that is a hand small vermin', [18, 12], (c, r) => {
    const T = hex('#a9a68c'),
      yf = 10;
    c.oval(2, 3, 15, yf, T);
    c.rect(1, yf - 2, 4, yf, T);
    c.rect(13, yf - 2, 16, yf, T);
    c.rect(4, 1, 6, 3, T);
    c.rect(11, 1, 13, 3, T);
    vol(c, 0, 0, 17, yf, 1.12, 0.8);
    pts(c, [[5, 2], [12, 2]], r ? YEL : K);
    pts(c, [[3, 6], [8, 4], [14, 7], [10, 9]], dark(T));
    if (r) {
      c.oval(3, 4, 14, 9, K);
      teeth(c, 4, 13, 5, TOOTH, 1);
      teeth(c, 5, 12, 9, TOOTH, 1);
      worm(c, [[9, 7], [14, 8], [19, 5]], 1, 1, RAW, { hi: false });
      hand(c, 20, 5, 'r', PALE, 1);
    } else {
      c.row(6, 4, 13, K);
      teeth(c, 5, 12, 7, TOOTH, 1);
      c.row(8, 5, 12, K);
    }
  });

  mk('fly-swarm', 'fly swarm bluebottles swarming in the shape of a skull face buzzing cloud small vermin', [14, 16], (c, r) => {
    const base = ['..#####..', '.#######.', '#########', '#..###..#', '#..###..#', '####.####', '.#######.', '.#.#.#.#.', '..#####..'],
      wide = ['...#####...', '.#########.', '###########', '##..###..##', '#...###...#', '##..###..##', '#####.#####', '.#########.', '.#.#.#.#.#.', '...........', '...........', '.#.#.#.#.#.', '.#########.', '...#####...'],
      rr = rnd(6),
      F = hex('#23202a');
    (r ? wide : base).forEach((row, j) => [...row].forEach((ch, i) => ch === '#' && rr() > 0.12 && c.set(i + (r ? 1 : 2), j + (r ? -5 : 1), (i + j) % 3 ? F : hex('#2f3a4a'))));
    motes(c, r ? -3 : 0, r ? -8 : -1, r ? 15 : 13, 11, r ? 16 : 9, F, 3);
    if (r) pts(c, [[4, -1], [8, -1]], RED);
    shadow(c, 3, 10, 13);
    return false;
  });
};
