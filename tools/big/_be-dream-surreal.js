/* The surreal: the painters' impossible beings, made hideous. Drawn for be-dream.js (see _be-dream-kit.js). */
module.exports = (kit, H, mk) => {
  const { C, K, hex, mix, blend, dark, lite, rnd } = kit;
  const { man, face, FACES, vd, NIGHT, EYE, GUM, TOOTH } = H;
  const ELE = hex('#8a8478'),
    GIR = hex('#b28d50'),
    SPOT = hex('#7a5230'),
    EGG = hex('#d2c7ac'),
    SOFT = hex('#c9a888'),
    LIPR = hex('#9c3a3e'),
    LOB = hex('#a8503a'),
    RED = hex('#c23a2e'),
    PALE = hex('#d6c2a6'),
    SUIT = hex('#2e2c3a'),
    BAKE = hex('#25232c'),
    OCHRE = hex('#b08a4e'),
    SKY = hex('#7f9cb0'),
    BOIL = hex('#5e6a5a'),
    TIG = hex('#c08a3a'),
    FISH = hex('#8e9aa0');

  /* ---------- the tall ones ---------- */
  mk('spider-elephant', 'elephant on spider legs tall thin stilts obelisk on its back long trunk', 32, 48, (g, r) => {
    const legs = r
      ? [[10, 14, 3, 26, 2, 45], [13, 15, 10, 30, 11, 45], [19, 15, 22, 30, 20, 45], [22, 14, 30, 22, 35, 32]]
      : [[10, 14, 4, 28, 6, 45], [13, 15, 11, 30, 12, 45], [19, 15, 21, 30, 19, 45], [22, 14, 27, 28, 25, 45]];
    legs.forEach(([a, b, kx, ky, fx, fy], i) => {
      g.jleg(a, b, kx, ky, fx, fy, i % 3 ? dark(ELE) : ELE, 2);
      g.rect(kx - 1, ky - 1, kx + 1, ky + 1, ELE); // knuckles
      g.jleg(kx, ky, (kx + fx) / 2 + (i < 2 ? 1 : -1), (ky + fy) / 2, fx, fy, dark(ELE), 1);
    });
    g.path([[7, 9], [5, 11], [5, 15]], dark(ELE)); // tail
    g.oval(7, 5, 24, 15, ELE);
    g.oval(21, 5, 29, 13, ELE);
    if (!r) g.tube([[27, 11], [28, 20], [27, 30], [28, 39]], 1.6, 0.9, ELE);
    else g.tube([[27, 11], [31, 15], [35, 10], [33, 3]], 1.6, 1.2, ELE);
    g.rect(11, 4, 18, 7, C.wine); // a saddle cloth
    g.poly([[13, 4], [14, 1], [15, 1], [16, 4]], C.stoneLight); // and the obelisk
    g.bevel();
    g.oval(r ? 16 : 18, r ? 4 : 5, 23, 13, dark(ELE)); // ear
    g.col(r ? 16 : 18, 7, 11, ELE);
    g.row(8, 11, 18, C.gold);
    g.path([[25, 12], [26, 14], [28, 15]], C.bone); // tusk
    g.set(26, 8, r ? RED : K);
    if (r) {
      g.pts([[10, 9], [13, 11], [16, 8]], EYE); // it has more eyes than it showed
      g.rect(32, 1, 34, 2, GUM);
      g.pts([[32, 0], [34, 0], [33, 3]], TOOTH); // a mouth in the end of the trunk
    }
  }, { w: 40, h: 50, dx: 1 });

  mk('burning-giraffe', 'giraffe on fire burning tall flames along its neck spotted animal', 28, 48, (g, r) => {
    const CH = blend(GIR, K, 0.55);
    for (const [x, f] of [[5, 0], [8, 1], [14, 0], [17, 1]]) {
      g.rect(x, 30, x + 1, 44, f ? GIR : dark(GIR));
      g.rect(x, 45, x + 1, 46, vd(GIR));
      g.set(x, 38, dark(GIR));
    }
    g.path([[3, 26], [1, 30], [2, 35]], dark(GIR));
    g.set(2, 36, K);
    g.oval(3, 24, 19, 32, GIR);
    const p = g.tube([[16, 27], [19, 17], [22, 8]], 2.6, 1.8, GIR);
    g.oval(20, 3, 26, 8, GIR);
    g.rect(24, 5, 26, 8, GIR);
    g.col(21, 1, 2, GIR);
    g.col(23, 1, 2, GIR);
    g.bevel();
    g.over(3, 9, 22, 32, SPOT, (x, y) => (x * 3 + y * 5) % 8 < 2 && (x + y) % 3 !== 0);
    if (r) {
      g.over(3, 22, 22, 46, CH, (x, y) => y > 27 || (x + y) % 2 === 0); // charring
      for (const x of [7, 10, 13]) g.col(x, 25, 30, C.bone); // ribs
      g.rect(24, 9, 26, 9, GIR); // the jaw drops
      g.row(8, 24, 26, K);
      g.pts([[24, 8], [26, 8]], TOOTH);
    }
    g.set(24, 5, r ? RED : K);
    g.set(26, 6, vd(GIR));
    const n = r ? 9 : 4;
    for (let i = 3; i < p.length - 2; i += r ? 3 : 5) g.flame(p[i][0] - 3, p[i][1], n + (i % 3), r ? 4 : 2, i); // the mane burns
    for (const x of r ? [5, 9, 13] : [7, 12]) g.flame(x, 23, n + (x % 3), r ? 5 : 3, x);
    if (r) g.flame(22, 2, 7, 4, 3);
  }, { w: 32, h: 56, dx: 3 });

  mk('drafting-mannequin', 'mannequin built of set squares and rulers egg head no face on a plinth tall', 20, 46, (g, r) => {
    const WD = C.woodPale;
    g.box(3, 42, 16, 44, C.stone);
    g.rect(6, 28, 8, 41, WD);
    g.rect(11, 28, 13, 41, C.wood);
    g.rect(5, 40, 8, 41, WD);
    g.rect(11, 40, 15, 41, C.wood);
    g.poly([[5, 24], [14, 24], [12, 29], [7, 29]], OCHRE);
    g.poly([[4, 12], [15, 12], [13, 24], [6, 24]], WD);
    g.rect(9, 10, 10, 12, C.wood);
    g.oval(6, 1, 13, 10, EGG);
    g.disc(4, 13, 1.5, C.wood);
    g.disc(15, 13, 1.5, C.wood);
    if (!r) g.limb([[3, 14], [2, 22], [3, 30]], 2, WD);
    else {
      g.limb([[3, 14], [-1, 20], [-1, 10]], 2, WD);
      g.limb([[15, 13], [22, 6], [25, 22]], 2, C.steel); // a pair of compasses for an arm
      g.col(26, 23, 26, C.steel);
    }
    g.bevel();
    g.rect(5, 34, 9, 35, C.wood); // knee joints
    g.rect(10, 34, 14, 35, C.woodDark);
    g.poly([[6, 14], [12, 14], [6, 22]], C.mustard); // a set square on the chest
    g.poly([[7, 15], [9, 15], [7, 18]], r ? K : WD);
    g.line(13, 14, 9, 23, C.woodDark);
    g.pts([[12, 16], [11, 18], [10, 20]], C.cream);
    g.row(24, 6, 13, C.woodDark);
    if (!r) {
      g.col(10, 2, 9, dark(EGG)); // the seams of the head
      g.path([[7, 4], [9, 5], [12, 4]], dark(EGG));
    } else {
      g.rect(9, 1, 10, 9, K); // it comes apart down the seam
      g.rect(8, 4, 11, 6, K);
      g.eye(10, 5, 1, RED);
      g.set(7, 17, RED);
    }
  }, { w: 30, dx: 2 });

  mk('giantess', 'giantess in a vast white cape tiny moon head wheat hair holding an egg tall', 30, 48, (g, r) => {
    const CL = hex('#cfc6b0'),
      RD = hex('#8a3b32'),
      HG = hex('#c0a04a'),
      MOON = hex('#e0d8c0');
    g.rect(11, 45, 12, 46, SUIT);
    g.rect(17, 45, 18, 46, SUIT);
    g.poly([[12, 10], [17, 10], [27, 45], [2, 45]], CL);
    if (!r) g.oval(8, 2, 21, 9, HG);
    else {
      g.oval(3, 0, 26, 10, HG); // the hair stands out like a field
      for (const x of [2, 6, 23, 27]) g.line(x, 6, x + (x < 15 ? -3 : 3), 1, HG);
    }
    g.bevel();
    g.poly([[13, 14], [16, 14], [r ? 23 : 19, 45], [r ? 6 : 10, 45]], r ? NIGHT : RD);
    g.line(10, 16, 5, 44, dark(CL));
    g.line(19, 16, 24, 44, dark(CL));
    g.line(8, 28, 6, 44, dark(CL));
    g.disc(14.5, 6, 2.5, MOON);
    g.pts([[13, 6], [16, 6]], r ? RED : K);
    g.row(8, 14, 15, vd(MOON));
    for (const x of [9, 11, 18, 20]) g.col(x, 3, 5 + (x % 3), dark(HG));
    if (!r) {
      g.rect(14, 17, 15, 19, C.white); // the egg
      g.pts([[13, 19], [16, 19]], PALE);
      g.pts([[5, 40], [6, 39], [7, 40]], C.white); // a goose at her hem
      g.set(8, 40, C.flame);
    } else {
      for (const [x, y] of [[12, 24], [15, 28], [11, 33], [17, 36], [13, 40], [19, 42], [9, 42]]) {
        g.set(x, y, EYE); // what the cape was full of
        g.set(x + 2, y, EYE);
      }
      g.limb([[14, 18], [16, 22], [21, 24]], 1, C.bone);
      g.hand(22, 24, 'r', C.bone, 1);
      g.after(() => {
        for (const [x, y] of [[-2, 30], [28, 20], [28, 36], [-3, 14]]) {
          g.pts([[x, y], [x + 1, y - 1], [x + 2, y], [x + 3, y - 1], [x + 4, y]], C.white); // the geese
          g.set(x + 2, y + 1, C.flame);
        }
      });
    }
  }, { w: 40, h: 50, dx: 5 });

  /* ---------- the long ones ---------- */
  mk('clock-snail', 'melting clock snail soft watch for a shell slug eye stalks time', 44, 24, (g, r) => {
    const SL = hex('#a89268'),
      WF = hex('#d8d2ba');
    g.oval(2, 17, 40, 21, SL);
    g.tube([[34, 19], [38, 16], [39, 11]], 2.4, 2, SL);
    g.col(38, r ? 2 : 5, 9, SL);
    g.col(41, r ? 3 : 6, 9, SL);
    g.poly([[7, 9], [13, 17], [11, 21], [5, 21], [4, 13]], C.brass); // where it has run down the side
    g.disc(16, 10, 8, C.brass);
    g.bevel();
    g.poly([[8, 11], [12, 17], [10, 20], [6, 20], [6, 14]], WF);
    g.disc(16, 10, 6.6, WF);
    for (let i = 0; i < 12; i++) g.set(16 + Math.round(Math.sin((i * Math.PI) / 6) * 6), 10 - Math.round(Math.cos((i * Math.PI) / 6) * 6), K);
    g.row(21, 4, 39, dark(SL));
    g.pts([[20, 19], [26, 19], [31, 18]], dark(SL));
    if (!r) {
      g.line(16, 10, 16, 5, K);
      g.line(16, 10, 20, 12, K);
      g.pts([[7, 16], [9, 18]], K);
      g.pts([[38, 4], [41, 5]], K);
      g.set(40, 12, vd(SL));
    } else {
      g.jaws((v) => v.poly([[10, 10], [16, 7], [22, 10], [16, 14]], 1), { len: 2 });
      g.pts([[13, 5], [19, 5]], RED);
      g.eye(38, 1, 1, RED);
      g.eye(41, 2, 1, RED);
      g.row(13, 39, 41, K);
      g.after(() => g.pts([[1, 22], [0, 21], [-2, 22]], lite(SL)));
    }
  }, { w: 46, h: 27, dx: 1 });

  const crutch = (g, x, y0, y1, lean = 0) => {
    g.line(x, y0 + 1, x + lean, y1, C.wood);
    g.pts([[x - 1, y0], [x + 1, y0]], C.woodLight);
    g.set(x + lean, y1, C.woodDark);
  };
  mk('soft-face-crutches', 'soft melting face asleep propped on crutches huge drooping head no body', 48, 26, (g, r) => {
    const top = (x) => 4 + Math.round(((x - 26) / 20) ** 2 * 5),
      bot = (x) => 17 - Math.round(((x - 28) / 18) ** 2 * 3) + (x % 9 < 3 ? 1 : 0);
    for (const [x, l] of [[6, 0], [13, 0], [21, 0], [29, 0], [37, 0], [43, 0]]) crutch(g, x, (x < 8 ? 14 : bot(x)) + 1, 24, r ? (x % 2 ? 2 : -2) : l);
    g.tube([[2, r ? 6 : 13], [6, 12], [10, 11]], 1, 2.5, SOFT, SOFT); // it thins away to nothing
    for (let x = 9; x <= 45; x++) g.col(x, top(x), bot(x), SOFT);
    g.poly([[36, 7], [41, 9], [42, 14], [37, 15]], SOFT); // the nose, sagging
    g.bevel();
    for (let x = 12; x <= 44; x += 2) g.set(x, bot(x), dark(SOFT));
    g.path([[14, 7], [20, 6], [26, 7]], dark(SOFT)); // a brow
    g.path([[40, 10], [41, 13], [39, 14]], dark(SOFT));
    if (!r) {
      g.path([[24, 10], [27, 11], [31, 11], [34, 10]], vd(SOFT)); // shut, with long lashes
      for (const x of [25, 27, 29, 31, 33]) g.set(x, 12, vd(SOFT));
      g.path([[30, 15], [34, 16], [38, 16]], LIPR);
      g.set(13, 12, dark(SOFT));
    } else {
      g.eye(29, 10, 3, hex('#7a8a5a'), [1, 0]);
      g.jaws((v) => v.poly([[22, 14], [38, 14], [38, 18], [30, 19], [22, 17]], 1), { len: 2 });
      g.row(13, 22, 38, LIPR);
    }
  }, { h: 27 });

  mk('biting-lips', 'lips sofa that bites huge red mouth couch teeth tongue furniture', 46, 24, (g, r) => {
    for (const x of [6, 22, 38]) g.rect(x, 20, x + 2, 22, C.woodDark);
    const up = g.at(0, r ? -11 : 0);
    if (r) {
      g.rect(5, 1, 41, 15, GUM); // the gullet
      g.rect(7, 3, 39, 14, K);
    }
    g.oval(3, 11, 43, 20, LIPR);
    up.poly([[3, 12], [4, 8], [10, 4], [18, 3], [23, 6], [28, 3], [36, 4], [42, 8], [43, 12]], LIPR);
    g.bevel();
    up.path([[8, 6], [16, 5], [21, 7]], lite(LIPR));
    g.path([[10, 17], [22, 19], [34, 18]], dark(LIPR));
    if (!r) {
      g.row(12, 4, 42, vd(LIPR));
      g.pts([[3, 11], [43, 11]], vd(LIPR));
      g.pts([[12, 13], [20, 13], [28, 13], [36, 13]], TOOTH); // just showing
    } else {
      for (let x = 7; x <= 39; x += 4) {
        g.rect(x, 2, x + 2, 5, C.white); // big square teeth
        g.rect(x, 10, x + 2, 12, C.white);
        g.set(x + 2, 5, dark(C.white));
      }
      g.tube([[22, 11], [28, 15], [36, 19], [44, 19]], 3, 2, hex('#b0606a')); // the tongue rolls out
    }
  }, { h: 35, w: 50 });

  mk('boiler-elephant', 'boiler elephant iron tank body on two legs hose trunk horned skull head machine beast', 44, 32, (g, r) => {
    g.rect(8, 24, 13, 30, dark(BOIL));
    g.rect(21, 24, 26, 30, dark(BOIL));
    g.rect(7, 29, 14, 30, BOIL);
    g.rect(20, 29, 27, 30, BOIL);
    g.oval(3, 6, 31, 27, BOIL);
    g.rect(12, 3, 18, 7, BOIL); // a turret
    g.rect(13, 1, 17, 2, dark(BOIL));
    const pts = r ? [[26, 9], [33, 2], [40, -4], [44, 2]] : [[26, 9], [33, 4], [38, 8], [38, 15]];
    const p = g.tube(pts, 2.6, 2, BOIL);
    const [hx, hy] = r ? [41, 3] : [34, 16];
    g.rect(hx, hy, hx + 6, hy + (r ? 4 : 6), C.bone); // the head on the end of it
    g.pts([[hx - 1, hy - 1], [hx - 2, hy - 2], [hx + 7, hy - 1], [hx + 8, hy - 2]], C.bone); // horns
    g.bevel();
    for (let i = 3; i < p.length - 1; i += 3) g.col(Math.round(p[i][0]), Math.round(p[i][1]) - 2, Math.round(p[i][1]) + 2, dark(BOIL)); // rings
    for (const x of [10, 24]) for (let y = 9; y <= 24; y += 3) g.set(x + Math.round(Math.abs(y - 16) * -0.2), y, lite(BOIL)); // rivets
    g.path([[6, 12], [5, 17], [7, 22]], dark(BOIL));
    g.rect(hx + 1, hy + 1, hx + 2, hy + 2, K);
    g.rect(hx + 4, hy + 1, hx + 5, hy + 2, K);
    if (!r) {
      g.row(hy + 5, hx + 1, hx + 5, dark(C.bone));
      g.disc(17, 16, 4, dark(BOIL)); // the fire door, shut
      g.set(20, 16, C.brass);
      g.pts([[15, 14], [15, 18]], lite(BOIL));
    } else {
      g.pts([[hx + 1, hy + 2], [hx + 5, hy + 2]], RED);
      g.rect(hx, hy + 5, hx + 6, hy + 8, GUM);
      g.fangs(hx, hx + 6, hy + 5, 2, 1, TOOTH);
      g.row(hy + 9, hx + 1, hx + 5, C.bone);
      g.disc(17, 16, 5, K); // the door open, and an eye of fire
      g.disc(17, 16, 3.5, C.flame);
      g.disc(17, 16, 2, C.flameLight);
      g.col(17, 14, 18, K);
      g.after(() => g.pts([[14, -1], [16, -3], [13, -4]], C.ghost)); // steam
    }
  }, { w: 52, h: 40 });

  mk('tiger-fish', 'fish with a tiger leaping out of its mouth scaled striped claws', 48, 24, (g, r) => {
    const FO = hex('#a8683a');
    g.poly([[9, 12], [1, 4], [3, 12], [1, 21]], dark(FO));
    g.poly([[14, 6], [20, 1], [27, 5]], dark(FO));
    g.poly([[16, 19], [19, 22], [23, 19]], dark(FO));
    g.oval(7, 4, 36, 20, FO);
    if (r) {
      g.rect(36, 8, 48, 15, TIG); // the tiger, half out
      g.oval(46, 4, 56, 15, TIG);
      g.pts([[47, 3], [48, 3], [54, 3], [55, 3]], TIG);
      g.limb([[42, 14], [50, 17], [58, 15]], 3, TIG);
      g.limb([[40, 15], [47, 19], [54, 19]], 3, dark(TIG));
    }
    g.bevel();
    g.over(9, 6, 28, 19, dark(FO), (x, y) => (x + (y >> 1) * 2) % 4 === 0 && y % 2 === 0); // scales
    g.line(28, 6, 26, 18, vd(FO)); // gill
    g.eye(30, 8, r ? 2 : 1, K);
    if (!r) {
      g.oval(32, 9, 37, 17, K);
      g.rect(33, 12, 38, 15, TIG); // a striped nose in its throat
      g.pts([[34, 11], [36, 11]], hex('#d9c04a'));
      g.pts([[38, 13], [38, 14]], C.white);
      g.col(35, 12, 13, K);
      g.set(37, 15, K);
    } else {
      g.oval(32, 6, 38, 18, K);
      g.rect(35, 8, 46, 15, TIG);
      for (const x of [37, 40, 43]) {
        g.col(x, 8, 10, K);
        g.col(x + 1, 13, 15, K);
      }
      g.rect(49, 10, 54, 15, C.white); // muzzle
      g.rect(50, 11, 53, 14, GUM);
      g.pts([[50, 11], [53, 11], [50, 14], [53, 14]], C.white);
      g.pts([[48, 7], [54, 7]], hex('#d9c04a'));
      g.pts([[47, 5], [50, 4], [53, 5], [46, 9], [56, 9]], K);
      for (const [x, y] of [[59, 15], [55, 19]]) g.pts([[x + 1, y], [x + 1, y + 2], [x + 2, y + 1]], C.white); // claws
      g.pts([[45, 16], [49, 17], [44, 18], [50, 20]], K);
    }
  }, { w: 64, h: 26 });

  /* ---------- people who are furniture, and furniture who are people ---------- */
  mk('cabinet-man', 'man who is a cabinet of drawers in his chest suit drawer open hand inside', 16, 33, (g, r) => {
    man(g, { skin: PALE, face: r ? 'dead' : 'shut', hair: ['thin', C.slate], top: C.wood, sleeve: SUIT, legs: SUIT, hy: r ? -1 : 0 });
    g.rect(5, 13, 10, 21, C.wood);
    for (const y of [13, 16, 19]) {
      const o = r ? (y === 16 ? 5 : -5) : y === 16 ? 2 : 0;
      if (o) g.rect(5 + Math.min(o, 0), y, 10 + Math.max(o, 0), y + 2, K); // the dark behind a drawer
      g.box(5 + o, y, 10 + o, y + 2, C.woodLight);
      g.set(7 + o, y + 1, C.brass);
      g.set(8 + o, y + 1, C.brass);
    }
    if (!r) g.pts([[12, 19], [12, 20]], PALE); // fingers over the edge of the middle one
    else {
      g.hand(16, 17, 'r', PALE, 2);
      g.pts([[1, 14], [3, 14]], EYE); // and in the others
      g.pts([[2, 20], [0, 20], [4, 20]], TOOTH);
      g.rect(7, 9, 8, 11, K);
    }
  }, { w: 30, dx: 7 });

  mk('cage-torso', 'figure whose torso is a birdcage with something inside cloak hat no head', 18, 34, (g, r) => {
    const f = g.at(1, 1);
    f.rect(4, 22, 11, 31, SUIT); // legs
    f.col(7, 23, 31, K);
    f.rect(3, 30, 6, 31, NIGHT);
    f.rect(9, 30, 12, 31, NIGHT);
    if (!r) f.poly([[2, 8], [13, 8], [15, 24], [0, 24]], C.wine); // the cloak behind
    else f.poly([[2, 8], [13, 8], [20, 22], [16, 26], [-1, 26], [-5, 22]], C.wine);
    f.rect(3, 8, 12, 21, NIGHT); // inside the cage
    f.rect(4, 6, 11, 7, NIGHT);
    f.rect(4, 2, 11, 4, SUIT); // the hat sits on nothing
    f.row(5, 2, 13, SUIT);
    f.row(1, 5, 10, SUIT);
    g.bevel();
    f.row(4, 4, 11, C.slate);
    f.oval(5, 12, 10, 18, r ? hex('#3a3442') : C.white); // the thing in it
    f.set(r ? 7 : 9, 14, r ? RED : K);
    if (!r) f.set(11, 15, C.flame);
    else {
      f.set(9, 14, RED);
      f.limb([[9, 16], [15, 15], [19, 11]], 1, hex('#3a3442'));
      f.hand(20, 10, 'r', hex('#3a3442'), 2);
      f.rect(11, 12, 12, 18, K); // the little door is open
    }
    for (const x of [3, 5, 7, 9, 12]) if (!(r && x > 9)) f.col(x, 7, 21, C.brass); // bars
    f.row(6, 4, 11, C.brass);
    f.row(8, 3, 12, lite(C.brass));
    f.row(21, 3, 12, dark(C.brass));
    f.row(14, 3, r ? 10 : 12, dark(C.brass));
  }, { w: 34, dx: 6 });

  mk('herring-man', 'fish with human legs standing upright scaled body bare legs gasping', 16, 31, (g, r) => {
    g.hleg(4, 17, 28, PALE, -1, PALE);
    g.hleg(9, 17, 28, PALE, 1, PALE);
    g.poly([[5, 1], [10, 1], [13, 8], [12, 18], [3, 18], [2, 8]], FISH);
    g.poly([[2, 9], [1, 13], [3, 14]], dark(FISH)); // fins for arms
    g.poly([[13, 9], [14, 13], [12, 14]], dark(FISH));
    g.bevel();
    g.over(3, 6, 12, 17, dark(FISH), (x, y) => (x + y) % 3 === 0 && y % 2 === 0);
    g.rect(3, 17, 12, 18, PALE);
    g.row(16, 3, 12, dark(FISH));
    g.eye(4, 5, 1, K);
    g.eye(11, 5, 1, K);
    if (!r) {
      g.rect(6, 1, 9, 2, K); // gasping at the ceiling
      g.row(8, 5, 10, vd(FISH));
    } else {
      g.jaws((v) => v.rect(5, 1, 10, 9, 1), { len: 1 });
      g.limb([[7, 5], [7, -1], [9, -5]], 2, PALE); // an arm comes up out of it
      g.hand(9, -6, 'u', PALE, 1);
      g.pts([[4, 5], [11, 5]], RED);
    }
  }, { h: 42 });

  mk('bird-superior', 'bird headed man in a dark suit great beak painter demon', 18, 35, (g, r) => {
    const f = g.at(0, 2);
    const FE = hex('#5a6a78');
    if (r) {
      for (const v of [f, f.flip(15)]) {
        v.poly([[4, 13], [-7, 4], [-9, 12], [-6, 22], [4, 20]], FE);
        for (const y of [8, 12, 16]) v.line(-7, y, 2, y + 4, dark(FE));
      }
    }
    man(f, { head: false, top: SUIT, legs: SUIT, shirt: C.cream, tie: C.wine, hand: PALE, arms: r ? 'hip' : 'down' });
    f.oval(4, 2, 11, 11, FE);
    f.pts([[5, 1], [7, 0], [9, 1]], FE); // a crest
    if (!r) f.poly([[9, 6], [15, 9], [9, 10]], C.straw);
    else {
      f.poly([[9, 4], [16, 2], [10, 7]], C.straw);
      f.poly([[9, 9], [15, 13], [9, 11]], C.straw);
    }
    g.bevel();
    f.eye(7, 5, 1, r ? RED : K, [1, 0]);
    if (!r) f.row(8, 10, 14, dark(C.straw));
    else {
      f.rect(10, 7, 12, 9, GUM);
      f.pts([[11, 8], [13, 8], [14, 9]], hex('#b0606a')); // a human tongue
    }
  }, { w: 38, dx: 10 });

  mk('wheel-woman', 'woman on a single wheel instead of legs cloak pale face rolling', 16, 32, (g, r) => {
    const CLK = hex('#6a5a3e');
    g.disc(8, 24, 6, C.woodDark);
    g.disc(8, 24, 4.4, null);
    for (let y = 20; y <= 28; y++) for (let x = 4; x <= 12; x++) if ((x - 8) ** 2 + (y - 24) ** 2 <= 19.5) g.clear(x, y);
    for (const [a, b] of [[8, 19], [8, 29], [3, 24], [13, 24], [4, 20], [12, 28], [12, 20], [4, 28]]) g.line(8, 24, a, b, C.wood);
    if (!r) g.poly([[4, 10], [11, 10], [13, 22], [2, 22]], CLK);
    else g.poly([[4, 10], [11, 10], [19, 18], [15, 22], [0, 22], [-4, 18]], CLK);
    g.rect(5, 2, 10, 9, PALE);
    g.row(1, 5, 10, C.rust); // hair drawn up
    g.rect(4, 2, 4, 6, C.rust);
    g.rect(11, 2, 11, 6, dark(C.rust));
    if (r) {
      g.limb([[4, 12], [-2, 9], [-5, 3]], 1, PALE);
      g.limb([[11, 12], [17, 9], [20, 3]], 1, PALE);
    }
    g.bevel();
    g.col(7, 11, 21, dark(CLK));
    g.col(5, 14, 21, dark(CLK));
    g.rect(7, 23, 9, 25, C.brass); // the hub
    if (!r) {
      g.pts([[6, 5], [9, 5]], K);
      g.row(7, 7, 8, vd(PALE));
    } else {
      g.pts([[6, 5], [9, 5]], RED);
      g.rect(7, 7, 8, 8, K);
      g.rect(7, 23, 9, 25, EYE); // and the hub looks at you
      g.set(8, 24, K);
      g.hand(-5, 2, 'u', PALE, 1);
      g.hand(20, 2, 'u', PALE, 1);
    }
  }, { w: 32, h: 36, dx: 8 });

  mk('ball-joint-doll', 'ball jointed doll with legs at both ends and no head two pairs of legs', 18, 32, (g0, r) => {
    const D = hex('#d0b8a0'),
      g = g0.at(0, 1);
    const legPair = (v, up) => {
      // v: a view where the legs hang down from y 0
      for (const [x, d] of [[5, -1], [10, 1]]) {
        const s = up ? d * 3 : 0;
        v.thick(x, 0, x + s, 6, 3, D);
        v.disc(x + s + 1, 7, 1.6, dark(D)); // knee ball
        v.thick(x + s, 8, x + s + (up ? d : 0), 12, 2, D);
        v.rect(x + s + (up ? d : 0) - 1, 11, x + s + (up ? d : 0) + 2, 12, C.white); // sock
        v.rect(x + s + (up ? d : 0) - (d < 0 ? 2 : 0), 13, x + s + (up ? d : 0) + (d > 0 ? 3 : 1), 14, SUIT); // shoe
      }
    };
    legPair(g.at(0, 15), false);
    const upv = { set: (x, y, c) => g.set(x, 14 - y, c), get: (x, y) => g.get(x, 14 - y), clear: (x, y) => g.clear(x, 14 - y) };
    legPair(H.view(upv.set, upv.get, upv.clear), r);
    g.disc(8.5, 14.5, 4.5, D); // the belly they all turn in
    g0.bevel();
    g.path([[5, 13], [8, 12], [12, 13]], dark(D));
    if (!r) g.set(8, 15, vd(D));
    else {
      g.disc(8.5, 14.5, 2.5, EYE);
      g.rect(8, 14, 9, 15, hex('#5a7a8a'));
      g.set(9, 15, K);
    }
  }, { w: 26, dx: 4 });

  mk('tree-man', 'tree man broken eggshell body on tree trunk legs standing in boats face looking back', 30, 32, (g, r) => {
    const BK = hex('#8a7a66'),
      SH = hex('#d8d0bc');
    for (const x of [3, 18]) {
      g.poly([[x, 28], [x + 9, 28], [x + 7, 30], [x + 2, 30]], C.woodDark); // boats for shoes
      g.row(28, x, x + 9, C.wood);
    }
    g.limb([[9, 16], [6, 22], [6, 27]], 3, BK);
    g.limb([[18, 16], [22, 22], [21, 27]], 3, BK);
    g.oval(5, 6, 23, 18, SH);
    g.rect(12, 4, 22, 5, C.stoneDark); // the disc on his head
    g.rect(22, 6, 27, 12, PALE); // and the face, turned back to look
    g.row(13, 23, 26, PALE);
    if (r) {
      g.path([[8, 21], [3, 18], [1, 13]], BK); // branches
      g.path([[22, 20], [27, 19], [29, 15]], BK);
      g.path([[3, 18], [0, 19]], BK);
    }
    g.bevel();
    g.oval(7, 9, 15, 16, K); // the shell is broken open behind
    g.pts([[7, 9], [10, 8], [13, 9], [15, 11], [8, 16], [12, 17]], SH);
    g.path([[16, 8], [19, 12], [18, 16]], dark(SH));
    g.pts([[7, 22], [22, 23], [6, 25]], vd(BK));
    g.rect(15, 2, 18, 3, hex('#b08a86')); // bagpipe
    if (!r) {
      g.pts([[9, 12], [12, 13]], C.flame); // little lights inside
      g.pts([[24, 8], [26, 8]], K);
      g.row(11, 24, 26, vd(PALE));
      g.col(22, 7, 11, dark(PALE));
    } else {
      g.oval(8, 10, 14, 15, C.blood);
      g.pts([[10, 12], [12, 12]], C.flameLight);
      g.hand(8, 9, 'u', PALE, 1); // someone climbing out
      g.rect(23, 7, 24, 8, C.white);
      g.rect(26, 7, 27, 8, C.white);
      g.pts([[24, 8], [27, 8]], K);
      g.rect(24, 10, 26, 12, K);
    }
  }, { w: 34, dx: 2 });

  mk('knife-ears', 'two huge ears with a knife blade between them creeping arrow through', 26, 18, (g, r) => {
    const EA = hex('#c0977e');
    const blade = r ? [[12, 6], [24, -2], [25, 0], [15, 9]] : [[12, 8], [23, 6], [24, 8], [14, 11]];
    g.poly(blade, C.steel);
    g.oval(10, 3, 19, 15, dark(EA)); // the far ear
    g.oval(2, 2, 13, 16, EA);
    g.rect(5, 14, 9, 16, EA); // lobe, which it walks on
    g.rect(13, 14, 16, 16, dark(EA));
    g.bevel();
    g.path([[5, 5], [8, 4], [11, 6], [11, 10], [8, 12]], dark(EA));
    g.path([[14, 6], [17, 7], [17, 11]], vd(EA));
    g.rect(7, 8, 8, 10, r ? EYE : vd(EA)); // the ear hole
    if (r) g.set(8, 9, RED);
    g.line(2, 9, 22, 12, C.woodDark); // the arrow through both
    g.pts([[1, 8], [1, 10]], C.bone);
    g.line(blade[0][0], blade[0][1], blade[1][0], blade[1][1], lite(C.steel));
    if (r) g.pts([[3, 16], [10, 16], [12, 16], [17, 16]], EA);
  }, { h: 22, w: 28 });

  mk('sunflower-creeper', 'giant torn sunflower creeping on its stems teeth in its face plant', 20, 24, (g, r) => {
    const PT = hex('#c0a23c'),
      ST = C.leafLight;
    g.tube(r ? [[9, 12], [7, 17], [9, 21]] : [[11, 10], [8, 16], [9, 21]], 1.4, 1.2, ST);
    g.path([[9, 21], [5, 20], [2, 22]], ST); // runners it pulls itself along by
    g.path([[9, 21], [13, 19], [17, 22]], ST);
    g.path([[8, 16], [4, 15], [3, 17]], C.leaf);
    const cx = r ? 10 : 12,
      cy = r ? 7 : 7;
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6,
        len = r ? 7 : i > 2 && i < 8 ? 6 : 4.5;
      g.thick(cx, cy, cx + Math.round(Math.cos(a) * len), cy + Math.round(Math.sin(a) * len * 0.9), 2, i % 2 ? PT : dark(PT));
    }
    g.disc(cx, cy, 3.4, C.woodDark);
    g.bevel();
    if (!r) {
      g.speckle(cx - 3, cy - 3, cx + 3, cy + 3, K, 3, 2);
      g.row(cy + 1, cx - 2, cx + 2, K);
      g.pts([[cx - 1, cy + 1], [cx + 1, cy + 1]], TOOTH);
    } else {
      g.disc(cx, cy, 3, K);
      g.pts([[cx - 2, cy - 2], [cx, cy - 3], [cx + 2, cy - 2], [cx - 3, cy], [cx + 3, cy], [cx - 2, cy + 2], [cx, cy + 3], [cx + 2, cy + 2]], TOOTH);
      g.set(cx, cy, RED);
      g.hand(2, 20, 'l', ST, 1);
      g.hand(17, 20, 'r', ST, 1);
    }
  }, { w: 24, h: 26, dx: 2 });

  mk('wrapped-lovers', 'two lovers with heads wrapped in white cloth joined at the face fused pair', 24, 34, (g, r) => {
    const CLTH = hex('#cfcabb');
    const a = g.at(0, 1),
      b = g.at(8, 1);
    man(a, { head: false, top: SUIT, legs: SUIT, shirt: C.cream, tie: C.black, hand: PALE, arms: { l: r ? 'reach' : 'down', r: 'none' } });
    man(b, { head: false, top: C.wine, robe: C.wine, hand: PALE, arms: { l: 'none', r: r ? 'reach' : 'down' } });
    for (const v of [a, b]) {
      v.rect(4, 3, 11, 10, CLTH);
      v.row(2, 5, 10, CLTH);
      v.row(11, 5, 10, CLTH);
    }
    g.rect(11, 5, 13, 10, CLTH); // the cloth runs from one to the other
    g.bevel();
    for (const v of [a, b]) {
      v.path([[4, 5], [7, 7], [11, 5]], dark(CLTH));
      v.path([[5, 10], [8, 8], [10, 10]], dark(CLTH));
      if (r) {
        v.rect(6, 7, 9, 10, vd(CLTH)); // mouths open under it
        v.rect(7, 8, 8, 9, K);
        v.pts([[5, 5], [10, 5]], vd(CLTH));
      }
    }
    g.row(13, 12, 12, CLTH);
    g.pts([[11, 12], [12, 12]], dark(CLTH));
    if (!r) g.rect(11, 22, 12, 23, PALE); // holding hands
  }, { w: 38, dx: 7 });

  mk('funnel-head', 'squat thing with a funnel for a hat jug belly beak face on skates', 16, 24, (g, r) => {
    const JG = hex('#8a6a4a');
    g.col(5, 18, 21, C.ironDark);
    g.col(10, 18, 21, C.ironDark);
    g.row(22, 2, 7, C.steel); // skates
    g.row(22, 8, 13, C.steel);
    g.oval(2, 9, 13, 19, JG);
    g.rect(13, 12, 14, 13, C.brass); // a tap in its side
    g.set(14, 14, C.brass);
    g.poly([[3, 6], [12, 6], [9, 2], [6, 2]], C.steel); // the funnel
    g.rect(7, 1, 8, 2, C.steel);
    g.rect(4, 6, 11, 10, hex('#9a9a7e')); // the face under it
    if (!r) g.poly([[9, 8], [14, 9], [9, 10]], C.straw);
    else {
      g.poly([[9, 7], [15, 5], [9, 9]], C.straw);
      g.poly([[9, 10], [14, 12], [9, 11]], C.straw);
    }
    g.bevel();
    g.row(6, 3, 12, dark(C.steel));
    g.path([[4, 13], [6, 16], [10, 17]], dark(JG));
    g.eye(6, 8, 0, r ? RED : K);
    g.set(8, 8, r ? RED : K);
    if (!r) g.rect(1, 12, 2, 16, JG);
    else {
      g.path([[2, 12], [0, 9], [-2, 8]], JG);
      g.col(-3, 3, 9, C.steel); // and it has a knife
      g.rect(10, 9, 12, 10, K);
      g.after(() => g.pts([[15, 15], [15, 17], [14, 19]], C.wine)); // the tap drips
    }
  }, { w: 22, dx: 5 });

  mk('roller-beast', 'curl up beast that rolls armoured segments six human feet beak stalk eyes', 24, 14, (g, r) => {
    const AR = hex('#7a7462');
    if (!r) {
      for (const x of [4, 8, 12]) {
        g.col(x, 9, 11, PALE); // little human feet
        g.row(12, x, x + 2, PALE);
      }
      for (let i = 0; i < 6; i++) g.oval(1 + i * 3, 3 + (i > 3 ? 1 : 0), 5 + i * 3, 9, i % 2 ? AR : dark(AR));
      g.poly([[18, 5], [22, 7], [18, 9]], C.bone); // beak
      g.col(17, 1, 4, AR);
      g.col(19, 1, 4, AR);
      g.bevel();
      g.pts([[17, 1], [19, 1]], EYE);
      g.pts([[17, 2], [19, 2]], K);
    } else {
      const cy = 2;
      g.disc(10, cy, 7, AR); // rolled into a wheel
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        g.thick(10 + Math.round(Math.cos(a) * 7), cy + Math.round(Math.sin(a) * 7), 10 + Math.round(Math.cos(a) * 9), cy + Math.round(Math.sin(a) * 9), 2, PALE); // feet outwards
      }
      g.bevel();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + 0.4;
        g.line(10 + Math.round(Math.cos(a) * 3), cy + Math.round(Math.sin(a) * 3), 10 + Math.round(Math.cos(a) * 7), cy + Math.round(Math.sin(a) * 7), dark(AR));
      }
      g.disc(10, cy, 2.5, K);
      g.eye(10, cy, 1, RED);
      g.pts([[8, cy - 2], [12, cy - 2], [8, cy + 2], [12, cy + 2]], C.bone);
    }
  }, { w: 24, h: 24, dx: 2 });

  mk('receiver-lobster', 'lobster with a telephone body receiver on its back claws cord tail ringing', 24, 18, (g, r) => {
    for (const x of [6, 9, 12, 15]) g.line(x, 13, x - 1 + (x > 10 ? 2 : 0), 16, LOB);
    g.path([[3, 12], [1, 13], [2, 15], [1, 16]], BAKE); // the cord
    g.rect(4, 9, 17, 13, BAKE);
    g.rect(5, 7, 16, 9, BAKE);
    const hy = r ? -4 : 0;
    g.rect(3, 4 + hy, 18, 5 + hy, BAKE); // the receiver
    g.rect(2, 4 + hy, 5, 7 + hy, BAKE);
    g.rect(16, 4 + hy, 19, 7 + hy, BAKE);
    for (const [x, y, up] of r ? [[17, 9, 1], [17, 12, 1]] : [[17, 10, 0], [17, 12, 0]]) {
      const cy = up ? y - 6 : y;
      g.limb([[x, y], [x + 2, cy]], 2, LOB);
      g.oval(x + 1, cy - 2, x + 5, cy + 1, LOB); // claws
      if (up) g.clearRect(x + 4, cy - 1, x + 5, cy - 1);
    }
    g.bevel();
    g.disc(10.5, 10.5, 2.2, r ? EYE : C.stoneLight); // the dial
    g.set(10, 10, r ? RED : K);
    g.pts([[9, 9], [12, 9], [9, 12], [12, 12]], BAKE);
    g.row(5 + hy, 6, 15, lite(BAKE));
    g.line(18, 8, 22, 4, LOB); // feelers
    g.line(17, 8, 20, 3, LOB);
    if (r) {
      g.rect(6, 4, 15, 6, K); // off the hook
      g.teeth(6, 15, 4, C.white, 2);
      g.teeth(7, 15, 6, C.white, 2);
      g.pts([[3, 2 + hy + 4], [17, 2 + hy + 4]], K);
    }
  }, { h: 24, w: 26 });

  /* ---------- small ---------- */
  mk('winged-eye', 'eye on a stalk with wings flying eyeball trailing its nerve watching', 18, 24, (g, r) => {
    const WG = hex('#6a5a66');
    g.path([[9, 11], [8, 15], [10, 18], [9, 21]], hex('#a0626a')); // the nerve it trails
    for (const v of [g, g.flip(17)]) {
      if (!r) v.poly([[5, 6], [2, 3], [1, 7], [2, 10], [5, 9]], WG);
      else {
        v.poly([[5, 6], [-3, -2], [-5, 4], [-3, 10], [5, 9]], WG);
        v.line(4, 7, -3, 0, vd(WG));
        v.line(4, 8, -4, 5, vd(WG));
      }
    }
    g.disc(8.5, 7, 4.5, EYE);
    g.bevel();
    g.disc(8.5, 7, 2.5, r ? RED : hex('#6a8a6a'));
    if (!r) g.rect(8, 6, 9, 8, K);
    else {
      g.col(8, 5, 9, K); // a slit
      g.pts([[5, 3], [7, 2], [10, 2], [12, 3], [5, 11], [7, 12], [10, 12], [12, 11]], TOOTH); // the lids have teeth
    }
    g.pts([[5, 5], [12, 10], [6, 10]], hex('#b0626a')); // veins
    g.set(7, 5, C.white);
    g.shadow(5, 12, 22);
  }, { w: 30, h: 27, dx: 6 });

  mk('walking-hand', 'hand that walks on its fingers with a mouth in its back severed', 14, 12, (g, r) => {
    const HD = hex('#c9a688');
    const yb = r ? 2 : 4;
    for (const [x, k] of [[2, 0], [5, 1], [8, 0], [11, 1]]) {
      g.line(x + 1, yb + 3, x, 7 + k, HD); // fingers as legs
      g.col(x, 7 + k, 10, k ? dark(HD) : HD);
      g.set(x, 10, C.bone);
    }
    g.rect(3, yb, 10, yb + 4, HD);
    g.rect(5, yb - 3, 8, yb, HD); // the wrist
    g.path([[10, yb + 2], [12, yb + 1], [12, yb + 3]], HD); // thumb
    g.bevel();
    g.row(yb - 3, 5, 8, C.blood);
    if (!r) {
      g.row(yb + 2, 4, 9, vd(HD));
      g.pts([[5, yb + 3], [8, yb + 3]], TOOTH);
    } else {
      g.rect(4, yb + 1, 9, yb + 4, GUM);
      g.teeth(4, 9, yb + 1, C.white, 2);
      g.teeth(5, 9, yb + 4, C.white, 2);
      g.rect(6, yb + 5, 7, yb + 7, hex('#b0606a')); // tongue
    }
  }, { h: 14 });

  mk('bowler-swarm', 'swarm of bowler hats flying like bats nobody under them teeth', 22, 24, (g, r) => {
    const hats = r ? [[2, 3], [12, 2], [7, 8], [14, 9], [2, 13], [10, 15]] : [[3, 2], [12, 4], [6, 10], [14, 12]];
    hats.forEach(([x, y], i) => {
      g.rect(x + 1, y, x + 4, y + 2, SUIT);
      g.row(y - 1, x + 2, x + 3, SUIT);
      g.row(y + 3, x - 1, x + 6, SUIT);
      g.row(y + 2, x + 1, x + 4, C.slate);
      g.set(x + 1, y, lite(SUIT));
      if (r) {
        g.rect(x, y + 4, x + 5, y + 5, GUM);
        g.teeth(x, x + 5, y + 4, C.white, 2);
        g.pts([[x + 1, y + 5], [x + 4, y + 5]], C.white);
      } else if (i % 2) g.pts([[x + 1, y + 4], [x + 4, y + 4]], EYE);
    });
    g.shadow(5, 16, 22);
  });

  mk('head-on-feet', 'head with feet and no body hooded bearded gryllus small running', 10, 13, (g, r) => {
    g.rect(2, 10, 3, 11, C.earth);
    g.rect(6, 10, 7, 11, C.earth);
    g.row(11, 1, 3, C.earth);
    g.row(11, 6, 8, C.earth);
    g.rect(2, 3, 7, 9, PALE);
    g.poly([[1, 4], [4, 1], [5, 1], [8, 4]], C.wine); // hood
    g.col(1, 4, 7, C.wine);
    g.col(8, 4, 7, C.wine);
    g.bevel();
    g.rect(3, 8, 6, 9, C.ash); // beard
    g.pts([[3, 5], [6, 5]], r ? RED : K);
    if (!r) g.row(7, 4, 5, vd(PALE));
    else {
      g.rect(3, 6, 6, 9, K);
      g.pts([[3, 6], [5, 6], [4, 9], [6, 9]], C.white);
      g.set(4, 7, PALE); // another face, further in
      g.set(5, 7, PALE);
    }
  });

  mk('fur-cup-beast', 'fur covered teacup with teeth saucer spoon tongue small', 14, 11, (g0, r) => {
    const FR = hex('#8a6e4a'),
      g = r ? g0.at(0, -2) : g0;
    g.oval(1, 7, 11, 9, FR); // saucer
    g.rect(3, 3, 9, 7, FR);
    g.rect(10, 4, 11, 6, FR); // handle
    if (r) {
      g.col(3, 9, 10, PALE);
      g.col(8, 9, 10, PALE);
    }
    g0.bevel();
    g.speckle(1, 3, 11, 9, dark(FR), 3, 4);
    g.speckle(1, 3, 11, 9, lite(FR), 5, 9);
    g.row(3, 3, 9, K);
    if (!r) g.line(7, 3, 11, 1, C.steel); // spoon
    else {
      g.rect(3, 2, 9, 3, GUM);
      g.teeth(3, 9, 2, C.white, 2);
      g.teeth(4, 9, 4, C.white, 2);
      g.line(6, 3, 12, 5, hex('#b0606a'));
      g.pts([[4, 6], [7, 6]], EYE);
    }
  }, { h: 14 });

  mk('egg-crawler', 'fried egg that crawls its yolk an eye small flat', 14, 8, (g, r) => {
    const W = hex('#d9d6c8');
    if (!r) {
      g.oval(1, 3, 12, 6, W);
      g.rect(3, 2, 6, 3, W);
      g.bevel();
      g.disc(7, 4, 1.6, hex('#c9a030'));
      g.set(7, 4, K);
      g.pts([[2, 5], [11, 4]], dark(W));
    } else {
      g.oval(1, 4, 12, 6, W);
      g.poly([[4, 5], [5, -3], [10, -3], [11, 5]], W); // it stands up
      g.bevel();
      g.disc(7.5, -0.5, 2, hex('#c9a030'));
      g.rect(7, -1, 8, 0, RED);
      g.set(8, 0, K);
      g.row(3, 6, 9, K);
      g.pts([[6, 3], [8, 3]], C.white);
    }
  }, { h: 13 });

  mk('watch-crab', 'melted pocket watch scuttling on crab legs pincers like clock hands', 14, 10, (g, r) => {
    for (const x of [3, 6, 9]) {
      g.line(x, 6, x - 2, 8, C.ironDark);
      g.line(x + 1, 6, x + 3, 8, C.ironDark);
    }
    g.oval(2, 2, 11, 6, C.brass);
    g.rect(9, 5, 11, 7, C.brass); // sagging
    for (const v of [g, g.flip(13)]) {
      if (!r) v.line(2, 3, 1, 1, C.ironDark);
      else {
        v.line(2, 3, 1, -2, C.ironDark);
        v.pts([[0, -3], [2, -3]], C.steel);
      }
    }
    g.bevel();
    g.oval(3, 3, 10, 5, hex('#d8d2ba'));
    g.rect(9, 6, 10, 6, hex('#d8d2ba'));
    if (!r) {
      g.row(4, 6, 8, K);
      g.set(6, 3, K);
    } else {
      g.row(4, 4, 9, K);
      g.pts([[5, 4], [7, 4], [9, 4]], RED);
    }
  }, { h: 14, w: 16, dx: 1 });

  mk('nose-walker', 'a nose walking about on two legs in boots large nostrils small', 10, 15, (g, r) => {
    const N = hex('#c79f7c');
    g.col(3, 10, 12, SUIT);
    g.col(6, 10, 12, SUIT);
    g.row(13, 2, 3, NIGHT);
    g.row(13, 6, 7, NIGHT);
    g.poly([[4, 1], [5, 1], [8, 8], [8, 10], [1, 10], [1, 8]], N);
    g.bevel();
    g.col(5, 2, 7, lite(N));
    if (!r) g.pts([[3, 9], [6, 9]], vd(N));
    else {
      g.rect(2, 8, 3, 9, K); // the nostrils see
      g.rect(6, 8, 7, 9, K);
      g.pts([[3, 9], [6, 9]], RED);
      g.row(10, 2, 7, K);
      g.pts([[3, 10], [5, 10]], C.white);
      g.pts([[0, 6], [9, 6]], N);
    }
  }, { w: 12, dx: 1 });

  mk('moustache-moth', 'waxed moustache flapping like a moth small flying lips', 14, 10, (g, r) => {
    const M = hex('#2a2228');
    for (const v of [g, g.flip(13)]) {
      if (!r) v.path([[6, 4], [3, 5], [2, 4], [1, 2]], M);
      else v.path([[6, 4], [3, 3], [1, 0], [0, -3]], M);
      v.row(4, 2, 5, M);
      v.row(r ? 3 : 5, 3, 5, M);
    }
    g.rect(5, 5, 8, 6, LIPR);
    if (r) {
      g.rect(5, 5, 8, 7, GUM);
      g.pts([[5, 5], [7, 5], [6, 7], [8, 7]], C.white);
      g.row(8, 5, 8, LIPR);
      g.row(4, 5, 8, LIPR);
    }
    g.after(() => g.row(9, 4, 9, NIGHT));
  }, { h: 14, w: 16, dx: 1 });
};
