/* Creatures of horror: the classic horrors made worse. fn(g, r): r = 1 is the creature roused. */
module.exports = ({ mk, C, K, hex, mix, blend, dark, lite, rnd, P, vd, curve }) => {
  const B = C.bone,
    PALE = P.pale,
    HAIR = hex('#221e24');

  /* ================= large and tall ================= */
  mk('butcher-hooks', 'meat hook butcher who is part of his hooks large tall apron chains hooks for hands slaughterman', (g, r) => {
    const Fl = hex('#b0907e'),
      Ap = hex('#b8b0a0'),
      St = hex('#5a2e2a'),
      Ir = C.iron,
      Sl = C.steel;
    const hook = (v, x, y, d = 1) => {
      v.col(x, y, y + 3, Sl);
      v.pts([[x + d, y + 4], [x + 2 * d, y + 4], [x + 3 * d, y + 3], [x + 3 * d, y + 2]], Sl);
    };
    g.col(7, 0, 15, Ir); // the frame grown out of his back
    g.col(24, 0, 15, Ir);
    g.rect(4, 0, 27, 1, Ir);
    g.chain(5, 2, 5, 5);
    hook(g, 5, 6, -1);
    g.chain(26, 2, 26, 4);
    hook(g, 26, 5, 1);
    g.chain(10, 2, 10, 3);
    hook(g, 10, 4, -1);
    g.ball(25, 10, 30, 16, hex('#8a8474')); // something wrapped hangs from one
    g.row(13, 26, 29, dark(hex('#8a8474')));
    g.rect(10, 37, 14, 46, hex('#3a3632'));
    g.rect(17, 37, 21, 46, hex('#3a3632'));
    g.rect(9, 45, 14, 46, P.night);
    g.rect(17, 45, 22, 46, P.night);
    g.ball(6, 13, 25, 39, Fl);
    g.poly([[10, 17], [21, 17], [23, 41], [8, 41]], Ap); // apron
    g.line(10, 17, 12, 13, Ap);
    g.line(21, 17, 19, 13, Ap);
    g.row(33, 12, 19, dark(Ap));
    g.speckle(8, 25, 23, 41, St, 7, 3);
    g.pts([[14, 27], [15, 28], [13, 31], [17, 36], [11, 38], [18, 22]], St);
    g.rect(13, 12, 18, 13, dark(Fl));
    g.face(12, 4, 7, 8, Fl, r ? { eyes: 'hollow', eye: P.eye, mouth: 'open' } : { eyes: 'dot', mouth: 'sewn' });
    g.both(31, (v) => {
      if (!r) {
        v.limb([[7, 17], [5, 24], [5, 30]], 4, Fl); // the hands are hooks, and the chains run up into the shoulders
        v.rect(4, 31, 7, 32, hex('#4a3a30'));
        hook(v, 5, 33, 1);
        v.chain(4, 30, 7, 15, Sl, Ir);
      } else {
        v.limb([[7, 17], [3, 12], [3, 6]], 4, Fl);
        v.rect(2, 3, 5, 4, hex('#4a3a30'));
        v.col(3, -2, 2, Sl);
        v.pts([[4, -3], [5, -3], [6, -2], [6, -1]], Sl);
        v.chain(4, 6, 8, 15, Sl, Ir);
      }
    });
  });

  mk('slasher-mask', 'slasher whose mask is the only face large tall killer white mask long knife coat void head', (g, r) => {
    const Co = hex('#2e3a3c'),
      Mk = hex('#d8d4c8'),
      Gv = hex('#1a1a1e');
    const a = g.man(10, 46, { top: Co, legs: hex('#232a2c'), tl: 14, ll: 16, head: false, armL: 'down', armR: r ? null : 'down', hand: Gv });
    g.rect(7, a.yL, 14, a.yL + 7, Co); // a long coat
    g.col(10, a.yL, a.yL + 7, vd(Co));
    g.pts([[8, a.yT], [13, a.yT]], lite(Co));
    g.ball(6, a.yH - 1, 15, a.yH + 9, hex('#121016')); // the head: nothing
    if (!r) {
      g.face(7, a.yH, 8, 9, Mk, { eyes: 'hollow', mouth: 'line', nose: false });
      g.col(17, a.yL, a.yL + 9, C.steel); // the knife
      g.col(16, a.yL, a.yL + 7, lite(C.steel));
    } else {
      g.face(3, a.yH + 4, 8, 9, Mk, { eyes: 'hollow', mouth: 'line', nose: false }); // the mask slips: there is no one behind it
      g.limb([[15, a.yT + 2], [18, a.yT - 3], [18, a.yT - 8]], 3, Co);
      g.rect(18, a.yT - 11, 20, a.yT - 9, Gv);
      g.col(19, a.yT - 22, a.yT - 12, C.steel);
      g.col(20, a.yT - 20, a.yT - 12, lite(C.steel));
    }
  });

  mk('chain-strangler', 'hanging chain strangler large tall hangs from chains long chain arms nooses pale body broken neck', (g, r) => {
    const Gn = hex('#9a968c'),
      S = PALE;
    g.chain(4, -6, 8, 11); // it hangs by hooks through the shoulders
    g.chain(17, -6, 13, 11);
    g.rect(8, 11, 13, 24, Gn);
    g.poly([[8, 24], [13, 24], [15, 36], [6, 36]], Gn);
    g.ragged(6, 15, 36, 3, 4);
    g.col(10, 14, 33, dark(Gn));
    g.rect(8, 34, 9, 42, S); // toes down, off the floor
    g.rect(12, 34, 13, 42, S);
    g.pts([[8, 43], [8, 44], [12, 43], [12, 44]], S);
    g.rect(10, 9, 11, 11, S);
    const loop = (v, x, y, d) => v.pts([[x, y], [x - 1, y + d], [x - 1, y + 2 * d], [x, y + 3 * d], [x + 1, y + 3 * d], [x + 2, y + 2 * d], [x + 2, y + d], [x + 1, y]], C.steel);
    if (!r) {
      g.face(9, 1, 7, 8, S, { eyes: 'shut', mouth: 'line' }); // the head lolls
      g.row(0, 10, 14, HAIR);
      g.col(16, 1, 9, HAIR);
      g.pts([[15, 1], [9, 1]], HAIR);
      g.both(21, (v) => {
        v.chain(7, 12, 5, 26);
        v.chain(5, 26, 5, 40);
        loop(v, 5, 41, 1);
      });
    } else {
      g.face(7, 0, 7, 8, S, { eyes: 'hollow', eye: P.eye, mouth: 'scream' });
      g.row(-1, 8, 12, HAIR);
      g.col(6, 0, 8, HAIR);
      g.col(14, 0, 9, HAIR);
      g.both(21, (v) => {
        v.chain(7, 12, 1, 18);
        v.chain(1, 18, -4, 12);
        loop(v, -5, 11, -1);
      });
    }
    g.chain(9, 11, 12, 11);
    g.ink();
    g.shadow(10, 47, 5);
    return false;
  });

  mk('wall-of-faces', 'wall of faces walking large tall slab of faces many legs flesh wall mouths eyes', (g, r) => {
    const t = [hex('#b89a8a'), hex('#c8ac98'), hex('#a88878'), hex('#d0bca8')];
    for (const x of [5, 9, 13, 17, 21, 25]) {
      g.rect(x, 39, x + 1, 44, t[(x >> 2) % 4]);
      g.row(45, x - (x % 8 === 5 ? 1 : 0), x + 1 + (x % 8 === 5 ? 0 : 1), dark(t[2]));
    }
    if (r)
      g.both(31, (v) => {
        v.limb([[4, 10], [0, 12], [-2, 8]], 2, t[0]);
        v.hand(-2, 6, 0, -1, t[0], 3, 2);
        v.limb([[4, 24], [0, 27], [-1, 32]], 2, t[2]);
        v.hand(-1, 34, 0, 1, t[2], 3, 2);
      });
    g.rect(4, 2, 27, 39, vd(t[2]));
    for (const [x, y] of [[4, 2], [27, 2]]) g.clear(x, y);
    for (let j = 0; j < 4; j++)
      for (let i = 0; i < 3; i++) {
        const x = 5 + i * 8 - (j % 2),
          y = 3 + j * 9 + (i % 2),
          k = (i + j * 2) % 4;
        g.face(x, y, 7, 8, t[k], r ? { eyes: (i + j) % 3 ? 'hollow' : 'wide', mouth: (i + j) % 2 ? 'scream' : 'open' } : { eyes: 'shut', mouth: (i + j) % 2 ? 'line' : 'none' });
      }
  });

  /* ================= large and long ================= */
  mk('crawling-torso', 'crawling torso large long half a body dragging itself by the arms spine tail hair crawler', (g, r) => {
    const Sh = hex('#a8a498'),
      S = PALE,
      Sm = hex('#3a2c2c');
    g.row(12, 0, 18, Sm); // the trail
    if (!r) {
      for (let i = 0; i < 8; i++) g.rect(1 + i * 2, 10, 1 + i * 2, 11, i % 2 ? B : dark(B)); // its spine drags behind
      g.rect(16, 6, 28, 11, Sh);
      g.row(5, 18, 27, Sh);
      g.pts([[16, 6], [16, 8], [17, 5]], Sm);
      g.col(20, 7, 10, dark(Sh));
      g.col(23, 7, 10, dark(Sh));
      g.limb([[19, 7], [21, 2]], 2, S); // an elbow up
      g.limb([[21, 2], [24, 9]], 2, S);
      g.ball(29, 5, 35, 11, S);
      g.rect(29, 4, 35, 7, HAIR);
      g.col(35, 5, 11, HAIR);
      g.col(33, 8, 11, HAIR);
      g.limb([[27, 10], [36, 11], [41, 11]], 2, S);
      g.pts([[43, 12], [44, 11], [43, 10]], S);
    } else {
      const sp = curve([[16, 7], [9, 3], [4, -4], [7, -11], [13, -12]], 5); // up on its arms, the spine arched over like a sting
      sp.forEach(([x, y], i) => {
        if (i % 2 === 0) g.rect(x, y, x + 1, y + 1, i % 4 ? dark(B) : B);
      });
      g.pts([[15, -12], [16, -11], [17, -10]], B);
      g.poly([[15, 9], [17, 4], [29, -1], [31, 5]], Sh);
      g.pts([[15, 10], [16, 11], [18, 10]], Sh);
      g.line(21, 4, 23, 8, dark(Sh));
      g.line(25, 2, 27, 6, dark(Sh));
      g.limb([[22, 5], [21, 9], [22, 10]], 2, dark(S));
      g.row(12, 21, 25, dark(S));
      g.limb([[28, 2], [30, 7], [29, 10]], 2, S);
      g.row(12, 28, 32, S);
      g.ball(29, -9, 36, 0, S);
      g.rect(29, -10, 36, -8, HAIR);
      g.col(29, -8, 2, HAIR);
      g.col(36, -8, -2, HAIR);
      g.pts([[31, -5], [34, -5]], K);
      g.rect(31, -3, 34, -1, P.maw);
      g.pts([[31, -3], [33, -3], [32, -1], [34, -1]], C.white);
    }
  });

  mk('limb-worm', 'basement worm of limbs large long worm made of arms and legs many hands crawling flesh centipede cellar', (g, r) => {
    const F = hex('#b89a8a'),
      F2 = hex('#a08474'),
      D = dark(F),
      n = r ? 28 : 38;
    for (let x = 8; x <= n; x += 5) g.limb([[x + 2, 15], [x + 3, 19], [x + 2, 21]], 2, D); // far limbs
    if (!r) for (const x of [10, 22, 32]) g.limb([[x, 8], [x + 2, 3], [x + 5, 9]], 2, F2); // knees on its back
    else
      for (const [x, y] of [[10, 7], [19, 6], [27, 7]]) {
        g.limb([[x, y + 2], [x - 1, y - 4], [x + 1, y - 9]], 2, F2);
        g.hand(x + 1, y - 11, 0, -1, F2, 3, 2);
      }
    g.worm(r ? [[4, 14], [16, 11], [28, 13], [36, 6], [40, -2]] : [[4, 14], [16, 10], [30, 13], [41, 11]], 4.5, 5, F);
    for (let x = 9; x <= n - 1; x += 6) for (let y = 3; y <= 19; y++) if (g.get(x, y)) g.set(x, y, D); // where one body ends and the next begins
    for (let x = 6; x <= n + 2; x += 5) {
      g.limb([[x, 15], [x - 1, 19], [x, 20]], 2, F); // arms for legs, the hands on the floor
      g.row(22, x - 1, x + 2, lite(F));
    }
    g.worm([[1, 15], [-2, 17], [-3, 21]], 1.2, 0.8, F2); // a leg trails
    g.row(22, -5, -3, F2);
    if (!r) {
      g.ball(38, 5, 46, 17, F); // the front end: fingers folded shut
      for (const y of [8, 11, 14]) g.row(y, 41, 46, D);
      g.pts([[40, 8], [40, 11], [40, 14]], lite(F));
    } else {
      for (const [dx, dy] of [[-5, -5], [5, -6], [7, 2], [-3, 6]]) {
        g.limb([[41 + dx * 0.4, -3 + dy * 0.4], [41 + dx, -3 + dy]], 2, F2);
        g.hand(41 + dx + Math.sign(dx), -3 + dy + Math.sign(dy), Math.sign(dx) * 0.7, Math.sign(dy) * 0.7, F2, 3, 2);
      }
      g.oval(36, -8, 46, 2, F);
      g.oval(38, -6, 44, 0, P.maw);
      g.pts([[38, -3], [40, -6], [42, -6], [44, -3], [40, 0], [42, 0]], PALE);
    }
  });

  mk('organ-pile', 'organ pile that breathes large long heap of organs lungs heart intestines breathing mass', (g, r) => {
    const Lu = hex('#b88a8a'),
      Gu = hex('#a87a70'),
      Li = hex('#6a3a34'),
      He = hex('#8a2f34'),
      Tr = hex('#c8b8a0'),
      ty = r ? -9 : 3;
    g.worm([[5, 20], [12, 17], [20, 20], [28, 17], [36, 20], [41, 18]], 2, 2, dark(Gu));
    if (r) {
      g.worm([[40, 22], [45, 14], [43, 6]], 1.8, 0.8, Gu); // loops rise like feelers
      g.worm([[4, 22], [-1, 15], [2, 8]], 1.8, 0.8, Gu);
      g.rect(22, ty - 2, 27, ty, Tr);
      g.rect(23, ty - 2, 26, ty - 1, P.maw);
      g.pts([[23, ty - 2], [25, ty - 2], [24, ty - 1], [26, ty - 1]], C.white);
    }
    g.rect(23, ty, 26, 12, Tr); // the windpipe
    for (let y = ty + 1; y < 12; y += 2) g.row(y, 23, 26, dark(Tr));
    g.ball(3, 13, 15, 21, Li);
    if (!r) {
      g.ball(14, 9, 24, 21, Lu);
      g.ball(25, 9, 35, 21, Lu);
    } else {
      g.ball(10, -1, 24, 21, Lu); // the lungs fill
      g.ball(25, -1, 39, 21, Lu);
    }
    const oy = r ? -5 : 0;
    g.path([[19, 12 + oy], [18, 15 + oy], [16, 17]], dark(Lu));
    g.path([[18, 15 + oy], [20, 18]], dark(Lu));
    g.path([[30, 12 + oy], [31, 15 + oy], [33, 17]], dark(Lu));
    g.path([[31, 15 + oy], [29, 18]], dark(Lu));
    g.ball(22, 15, 27, 21, He);
    g.set(23, 16, lite(He));
    g.pts([[24, 14], [25, 13]], He);
    g.worm([[1, 24], [7, 21], [13, 25], [19, 22], [25, 25], [31, 22], [37, 25], [43, 23]], 2.2, 2.2, Gu);
    if (!r) {
      g.row(22, 6, 8, dark(Gu));
      g.row(23, 30, 32, dark(Gu));
    } else {
      for (const [x, y] of [[7, 22], [31, 23]]) {
        g.oval(x - 2, y - 2, x + 1, y + 1, P.eye);
        g.rect(x - 1, y - 1, x, y, K);
      }
    }
  });

  mk('wheelchair-spider', 'wheelchair spider large long old woman in a wheelchair lifted on long arms like spider legs invalid chair', (g, r) => {
    const Ir = C.iron,
      S = PALE,
      Cd = hex('#5a4a5a'),
      Bl = hex('#6a5a48'),
      cy = r ? -8 : 0;
    if (r) {
      const arm = (pts) => {
        g.limb(pts, 2, S);
        const [x, y] = pts[pts.length - 1];
        g.row(y + 1, x - 1, x + 2, S);
      };
      arm([[12, 10 + cy], [3, -3 + cy], [-4, 12], [-5, 24]]); // six long arms from behind the chair
      arm([[12, 12 + cy], [5, 5 + cy], [1, 16], [2, 24]]);
      arm([[18, 10 + cy], [28, -4 + cy], [35, 12], [36, 24]]);
      arm([[18, 12 + cy], [26, 4 + cy], [31, 16], [30, 24]]);
      g.limb([[13, 14 + cy], [8, 16 + cy], [8, 24]], 2, dark(S));
      g.limb([[19, 16 + cy], [23, 19 + cy], [23, 24]], 2, dark(S));
    }
    g.col(10, 6 + cy, 20 + cy, Ir); // the chair
    g.row(6 + cy, 8, 10, Ir);
    g.row(19 + cy, 10, 25, Ir);
    g.line(25, 19 + cy, 28, 24 + cy, Ir);
    g.row(24 + cy, 27, 30, Ir);
    g.col(27, 21 + cy, 23 + cy, Ir);
    g.rect(26, 24 + cy, 27, 25 + cy, Ir);
    g.rect(12, 8 + cy, 18, 18 + cy, Cd); // the one who sits in it
    g.col(12, 9 + cy, 17 + cy, lite(Cd));
    g.ball(12, 1 + cy, 19, 8 + cy, S);
    g.rect(12, 0 + cy, 18, 2 + cy, C.white);
    g.rect(10, 2 + cy, 12, 4 + cy, C.white);
    g.rect(14, 16 + cy, 25, 19 + cy, Bl); // a rug over the knees
    g.rect(22, 19 + cy, 26, 23 + cy, Bl);
    g.dither(14, 16 + cy, 26, 23 + cy, dark(Bl));
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * 6.283;
      g.set(14 + Math.cos(a) * 6, 19 + cy + Math.sin(a) * 6, Ir); // the wheel
    }
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * 3.1416 + 0.4;
      g.line(14 - Math.cos(a) * 5, 19 + cy - Math.sin(a) * 5, 14 + Math.cos(a) * 5, 19 + cy + Math.sin(a) * 5, C.steel);
    }
    g.set(14, 19 + cy, Ir);
    if (!r) {
      g.set(17, 5, K);
      g.row(7, 17, 18, vd(S));
      g.rect(19, 14, 21, 15, S);
    } else {
      g.rect(16, 4 + cy, 17, 4 + cy, C.white);
      g.set(17, 4 + cy, K);
      g.rect(17, 6 + cy, 19, 7 + cy, P.maw);
      g.pts([[22, 24 + cy], [24, 24 + cy], [26, 24 + cy], [23, 25 + cy], [25, 25 + cy]], S); // and under the rug there are only more hands
    }
  });

  /* ================= dog- to person-sized ================= */
  mk('flayed-one', 'the flayed one skinless figure muscle lidless eyes carries its own skin horror', (g, r) => {
    const M = hex('#a86a66'),
      T = hex('#d0a8a0'),
      Sk = hex('#d6c2a6');
    const a = g.man(8, 34, { skin: M, top: M, legs: hex('#96605e'), shoe: false, armR: r ? null : 'down', face: { eyes: 'wide', mouth: 'grin' } });
    g.pts([[6, a.yT + 2], [6, a.yT + 4], [9, a.yT + 3], [9, a.yT + 5], [7, a.yT + 7], [8, a.yT + 8]], T); // sinews
    g.col(5, a.yL + 2, a.yL + 6, T);
    g.col(10, a.yL + 3, a.yL + 7, T);
    g.rect(5, 33, 7, 34, M);
    g.rect(9, 33, 12, 34, M);
    if (!r) {
      g.rect(3, a.yT + 1, 5, a.yT + 6, M);
      g.rect(1, a.yT + 6, 6, a.yL + 5, Sk); // its skin over one arm, like a coat
      g.ragged(1, 6, a.yL + 5, 3, 2);
      g.pts([[2, a.yT + 9], [4, a.yT + 9]], K);
      g.row(a.yT + 11, 2, 4, vd(Sk));
      g.col(6, a.yT + 6, a.yL + 2, dark(Sk));
    } else {
      g.both(17, (v) => v.limb([[3, a.yT + 2], [1, a.yT - 3], [1, a.yH - 4]], 2, M));
      g.rect(2, a.yH - 10, 15, a.yH - 3, Sk); // it holds the skin up
      g.rect(-1, a.yH - 9, 1, a.yH + 2, Sk);
      g.rect(16, a.yH - 9, 18, a.yH + 1, Sk);
      g.pts([[-1, a.yH + 3], [1, a.yH + 3], [16, a.yH + 2], [18, a.yH + 2]], Sk);
      g.pts([[6, a.yH - 7], [7, a.yH - 7], [10, a.yH - 7], [11, a.yH - 7]], K);
      g.rect(8, a.yH - 5, 9, a.yH - 4, K);
    }
  });

  mk('stitched-twins', 'stitched together twins two children sewn into one three legs seam conjoined', (g, r) => {
    const S = PALE,
      A = hex('#4a5a70'),
      Bc = hex('#6b3a48'),
      Hr = hex('#3a2c24'),
      Th = hex('#1e1b24');
    for (const x of [4, 10, 16]) {
      g.rect(x, 26, x + 2, 32, S);
      g.rect(x, 32, x + 2, 33, P.night);
    }
    g.poly([[3, 15], [10, 15], [10, 27], [2, 27]], A);
    g.poly([[11, 15], [18, 15], [19, 27], [11, 27]], Bc);
    g.row(15, 4, 8, C.white);
    g.row(15, 13, 17, C.white);
    if (!r) {
      g.col(10, 15, 27, Th); // the seam
      for (let y = 16; y <= 26; y += 2) g.pts([[9, y], [11, y]], Th);
      g.rect(1, 16, 2, 19, A);
      g.rect(1, 20, 2, 24, S);
      g.rect(19, 16, 20, 19, Bc);
      g.rect(19, 20, 20, 24, S);
    } else {
      g.rect(9, 16, 12, 26, P.maw); // it opens
      for (let y = 16; y <= 25; y += 2) {
        g.set(9, y, C.white);
        g.set(12, y + 1, C.white);
      }
      g.both(21, (v) => {
        v.limb([[2, 17], [-1, 19], [-3, 15]], 2, S);
        v.hand(-3, 13, 0, -1, S, 3, 2);
      });
    }
    g.rect(5, 14, 6, 14, dark(S));
    g.rect(14, 14, 15, 14, dark(S));
    g.face(2, 5, 8, 9, S, r ? { eyes: 'wide', mouth: 'grin' } : { eyes: 'shut', mouth: 'line' });
    g.face(11, 5, 8, 9, S, r ? { eyes: 'wide', mouth: 'sewn' } : { eyes: 'shut', mouth: 'sewn' });
    g.row(4, 3, 8, Hr);
    g.row(5, 3, 9, Hr);
    g.rect(1, 5, 2, 11, Hr);
    g.row(4, 12, 17, Hr);
    g.row(5, 11, 17, Hr);
    g.rect(19, 5, 20, 11, Hr);
  });

  mk('bathtub-thing', 'bathtub thing something in the bath wet hair arms over the rim tub drowned woman', (g, r) => {
    const En = hex('#c8c6b8'),
      S = hex('#b8c0b8'),
      Hr = hex('#1c2022'),
      Br = C.brass;
    if (r) {
      g.rect(7, 4, 18, 9, S);
      g.ball(9, -4, 16, 5, S);
      g.rect(8, -5, 17, -2, Hr);
      g.rect(8, -2, 10, 8, Hr);
      g.rect(15, -2, 17, 9, Hr);
      g.col(12, -2, 3, Hr);
      g.set(13, 1, P.eye);
      g.rect(12, 3, 14, 4, K);
    }
    g.rect(2, 10, 29, 17, En);
    g.row(18, 4, 27, En);
    g.clear(2, 17);
    g.clear(29, 17);
    g.row(8, 1, 30, lite(En));
    g.row(9, 1, 30, En);
    g.row(17, 3, 28, dark(En));
    g.col(7, 10, 14, C.rust);
    g.col(22, 10, 12, C.rust);
    g.pts([[8, 11], [21, 10], [13, 16]], C.rust);
    g.rect(4, 19, 5, 20, Br);
    g.rect(26, 19, 27, 20, Br);
    g.pts([[3, 20], [28, 20]], Br);
    g.col(27, 4, 7, Br);
    g.row(4, 25, 27, Br);
    g.set(25, 5, Br);
    if (!r) {
      for (const x of [6, 7, 8, 9, 10]) g.col(x, 7, 10 + ((x * 3) % 4), Hr); // hair over the rim
      g.rect(15, 7, 18, 8, S);
      g.pts([[15, 9], [17, 9], [18, 9]], S);
    } else {
      for (const x of [8, 9, 15, 16, 17]) g.col(x, 8, 11 + ((x * 3) % 4), Hr);
      g.limb([[7, 7], [5, 12], [5, 18]], 2, S); // the arms come over and down to the floor
      g.pts([[4, 20], [5, 20], [6, 20], [7, 20]], S);
      g.limb([[18, 7], [21, 12], [21, 18]], 2, S);
      g.pts([[20, 20], [21, 20], [22, 20], [23, 20]], S);
      g.ink();
      g.pts([[12, 12], [12, 14], [24, 13], [2, 19], [14, 20]], C.glassLight);
      return false;
    }
  });

  mk('hound-hands', 'hound with a childs hands grey dog human hands for paws wrong animal horror', (g, r) => {
    const F = hex('#8a8680'),
      D = dark(F),
      S = C.flesh;
    const hand = (x, y) => {
      g.rect(x, y, x + 2, y, S);
      g.pts([[x - 1, y + 1], [x + 1, y + 1], [x + 3, y + 1]], S);
    };
    if (!r) {
      g.rect(8, 10, 8, 15, D);
      g.rect(18, 10, 18, 15, D);
      g.pts([[7, 16], [9, 16], [17, 16], [19, 16]], dark(S));
      g.line(4, 6, 1, 9, F);
      g.ball(4, 4, 20, 11, F);
      g.rect(5, 10, 6, 14, F);
      g.rect(16, 10, 17, 14, F);
      hand(5, 15);
      hand(16, 15);
      g.doghead(19, 2, F, { len: 4 });
    } else {
      g.line(5, 7, 1, 9, F);
      g.limb([[9, 8], [10, 12], [9, 14]], 2, D);
      g.limb([[6, 8], [4, 12], [6, 14]], 2, F);
      hand(5, 15);
      hand(9, 15);
      g.tube([[7, 8], [12, 2], [16, -4]], 4, 3.4, F); // up on its hind legs, the hands held out
      g.limb([[14, 1], [19, 5], [23, 5]], 2, D);
      g.rect(24, 4, 25, 6, S);
      g.pts([[26, 3], [26, 5], [26, 7]], S);
      g.limb([[15, -2], [20, 1], [24, 0]], 2, F);
      g.rect(25, -1, 26, 1, S);
      g.pts([[27, -2], [27, 0], [27, 2]], S);
      g.doghead(16, -11, F, { len: 4, open: 2, eye: P.eye });
    }
  });

  mk('eyeless-nurse', 'the eyeless nurse no eyes smooth face eyes in her palms old uniform hospital horror', (g, r) => {
    const U = hex('#c2beb0'),
      S = PALE,
      Hr = hex('#3a2c24');
    const a = g.man(8, 35, { skin: S, top: U, robe: U, tl: 10, ll: 11, arms: r ? null : 'down', face: { eyes: 'none', mouth: r ? 'scream' : 'grin' } });
    g.rect(6, a.yT + 3, 11, a.yL + 6, C.white);
    g.pts([[7, a.yL + 1], [9, a.yL + 3], [8, a.yT + 6], [10, a.yL + 5]], hex('#6a4a44'));
    g.set(10, a.yT + 1, C.brass);
    g.row(a.yH + 3, 6, 7, dark(S)); // where the eyes were
    g.row(a.yH + 3, 10, 11, dark(S));
    g.row(a.yH - 1, 6, 11, Hr);
    g.pts([[5, a.yH], [12, a.yH], [5, a.yH + 1], [12, a.yH + 1]], Hr);
    g.rect(6, a.yH - 3, 11, a.yH - 2, C.white);
    g.row(a.yH - 2, 6, 11, hex('#4a5a70'));
    if (r)
      g.both(17, (v) => {
        v.limb([[3, a.yT + 2], [0, a.yT + 4], [-2, a.yT]], 2, U);
        v.rect(-4, a.yT - 5, -1, a.yT - 2, S); // she has them in her palms
        v.rect(-3, a.yT - 4, -2, a.yT - 3, C.white);
        v.set(-2, a.yT - 3, K);
        v.pts([[-4, a.yT - 6], [-2, a.yT - 6], [-1, a.yT - 6]], S);
      });
  });

  mk('doll-mother', 'doll mother life size porcelain doll woman cracked face hollow head ringlets wind up key', (g, r) => {
    const Pc = hex('#e0dcd0'),
      Dr = hex('#6a4a5a'),
      Hr = hex('#8a6a3a');
    g.rect(13, 18, 15, 19, C.brass); // the key in her back
    g.rect(15, 16, 16, 21, C.brass);
    g.set(15, 18, K);
    const a = g.man(8, 34, { skin: Pc, top: Dr, robe: Dr, face: { eyes: 'dot', mouth: 'none', nose: false } });
    g.row(a.yT, 5, 12, C.white);
    g.row(34, 4, 13, C.white);
    g.pts([[8, a.yT + 2], [8, a.yT + 4], [8, a.yT + 6]], C.white);
    g.pts([[5, a.yH + 5], [12, a.yH + 5]], hex('#c89a94'));
    g.rect(8, a.yH + 6, 9, a.yH + 6, hex('#9a4a48'));
    g.row(a.yH - 1, 6, 11, Hr);
    g.row(a.yH, 5, 12, Hr);
    g.rect(3, a.yH, 4, a.yH + 9, Hr);
    g.rect(13, a.yH, 14, a.yH + 9, Hr);
    g.pts([[3, a.yH + 10], [14, a.yH + 10]], Hr);
    g.pts([[3, a.yH + 2], [4, a.yH + 5], [3, a.yH + 8], [14, a.yH + 2], [13, a.yH + 5], [14, a.yH + 8]], dark(Hr));
    g.both(17, (v) => {
      v.rect(2, a.yT + 1, 3, a.yT + 5, Dr);
      if (!r) {
        v.rect(1, a.yT + 6, 2, a.yL - 1, Pc);
        v.row(a.yT + 6, 1, 2, dark(Pc));
      } else {
        v.limb([[1, a.yT + 5], [-1, a.yT]], 2, Pc);
        v.row(a.yT + 5, 0, 2, dark(Pc));
        v.pts([[-2, a.yT - 1], [0, a.yT - 2], [-1, a.yT - 2]], Pc);
      }
    });
    if (!r) g.path([[9, a.yH + 1], [8, a.yH + 2], [10, a.yH + 4]], hex('#6a665e'));
    else {
      g.rect(8, a.yH + 1, 11, a.yH + 6, K); // half the face has fallen away
      g.pts([[7, a.yH + 2], [7, a.yH + 5], [12, a.yH + 3]], K);
      g.set(10, a.yH + 3, P.red);
      g.path([[9, a.yH + 5], [6, a.yH + 7], [5, a.yH + 10]], K); // and something looks out
      g.path([[10, a.yH + 6], [11, a.yH + 9]], K);
    }
  });

  mk('jack-in-box', 'jack in the box toy box crank spring neck pale head grin long arms springs out', (g, r) => {
    const Bx = hex('#6a3a40'),
      Bx2 = hex('#3a4a66'),
      S = PALE;
    if (r) {
      g.rect(-1, -6, 0, 4, dark(Bx)); // the lid is thrown back
      for (let y = 3; y >= -18; y--) g.row(y, 6 + (y % 4 === 0 ? 0 : (y % 4 + 4) % 4 === 2 ? 3 : 1), 8 + (y % 4 === 0 ? 0 : (y % 4 + 4) % 4 === 2 ? 3 : 2), (y + 40) % 2 ? C.steel : C.iron); // the spring
      g.rect(4, -21, 13, -19, C.cream);
      g.pts([[4, -18], [6, -18], [8, -18], [10, -18], [12, -18]], C.cream);
      g.limb([[5, -20], [0, -15], [-3, -8]], 2, Bx2);
      g.hand(-3, -6, 0, 1, S, 3, 3);
      g.limb([[12, -20], [17, -22], [20, -28]], 2, Bx2);
      g.hand(20, -30, 0, -1, S, 3, 3);
      g.face(5, -30, 8, 9, S, { eyes: 'wide', mouth: 'grin' });
      g.pts([[4, -31], [5, -32], [12, -31], [13, -32], [8, -31]], hex('#6a3a2a'));
    }
    g.rect(2, 5, 15, 16, Bx);
    g.col(2, 5, 16, lite(Bx));
    g.rect(5, 8, 12, 13, Bx2);
    g.pts([[8, 9], [9, 9], [7, 10], [8, 10], [9, 10], [10, 10], [8, 11], [9, 11], [7, 12], [10, 12]], C.gold);
    g.row(10, 16, 18, C.steel);
    g.col(18, 8, 10, C.steel);
    g.set(18, 7, C.woodDark);
    if (!r) {
      g.rect(1, 3, 16, 4, dark(Bx));
      g.row(5, 3, 14, K);
      g.pts([[5, 5], [6, 5], [7, 5], [11, 5]], S); // fingers under the lid
    } else g.row(5, 3, 14, K);
  });

  mk('pig-head-man', 'pig head man in overalls pigs head sewn on sledgehammer human teeth farm horror', (g, r) => {
    const Pg = hex('#c89a94'),
      Ov = hex('#4a5560'),
      Sh = hex('#8a8474'),
      Hd = hex('#b89a84');
    const a = g.man(9, 36, { skin: Pg, top: Sh, legs: Ov, tl: 11, ll: 11, head: false, armL: 'down', armR: r ? null : 'down', hand: Hd });
    g.rect(6, a.yT + 4, 13, a.yL - 1, Sh);
    g.rect(7, a.yT + 3, 12, a.yL - 1, Ov);
    g.col(7, a.yT, a.yT + 2, Ov);
    g.col(12, a.yT, a.yT + 2, Ov);
    g.pts([[7, a.yT + 3], [12, a.yT + 3]], C.brass);
    g.ball(5, a.yH - 1, 14, a.yH + 9, Pg); // a pig's head
    g.pts([[5, a.yH - 1], [4, a.yH - 2], [4, a.yH - 1], [14, a.yH - 1], [15, a.yH - 2], [15, a.yH - 1]], dark(Pg));
    g.rect(7, a.yH + 4, 12, a.yH + 6, lite(Pg));
    g.pts([[8, a.yH + 5], [11, a.yH + 5]], K);
    g.pts([[7, a.yH + 2], [12, a.yH + 2]], r ? P.yel : K);
    for (let x = 6; x <= 13; x += 2) g.set(x, a.yH + 9, K); // sewn on
    if (!r) {
      g.row(a.yH + 7, 8, 11, dark(Pg));
      g.col(17, a.yL - 1, 33, C.woodDark);
      g.rect(15, 34, 20, 36, C.iron);
      g.row(34, 15, 20, C.steel);
    } else {
      g.maw(7, a.yH + 7, 12, a.yH + 9, { t: C.white });
      g.limb([[14, a.yT + 2], [17, a.yT - 2], [17, a.yT - 6]], 3, Sh);
      g.rect(17, a.yT - 8, 19, a.yT - 7, Hd);
      g.col(18, a.yH - 12, a.yT - 9, C.woodDark);
      g.rect(15, a.yH - 16, 21, a.yH - 13, C.iron);
      g.row(a.yH - 16, 15, 21, C.steel);
    }
  });

  mk('spider-walk-girl', 'spider walk girl bent over backwards crab walking head upside down nightgown possessed', (g, r) => {
    const S = PALE,
      Gw = hex('#b8b4a8'),
      up = r ? 5 : 0;
    g.limb([[9, 8 - up], [8, 13]], 2, dark(S));
    g.limb([[17, 8 - up], [18, 13]], 2, dark(S));
    g.limb([[6, 7 - up], [4, 11 - up * 0.5], [3, 13]], 2, S);
    g.row(15, 1, 4, S);
    g.limb([[19, 7 - up], [21, 11 - up * 0.5], [22, 13]], 2, S);
    g.row(15, 21, 25, S);
    g.rect(5, 4 - up, 20, 8 - up, Gw); // belly up
    g.row(3 - up, 8, 17, Gw);
    g.strands(6, 13, 9 - up, 3, Gw, 3);
    if (!r) {
      g.ball(19, 5, 25, 12, S); // the head hangs upside down
      g.rect(19, 11, 25, 12, HAIR);
      g.strands(19, 25, 13, 3, HAIR, 5);
      g.pts([[21, 9], [24, 9]], K);
      g.row(7, 22, 23, vd(S));
    } else {
      g.rect(21, -5, 22, -1, S); // then it turns the right way up
      g.pts([[21, -3], [22, -2]], dark(S));
      g.face(18, -13, 7, 8, S, { eyes: 'wide', mouth: 'scream' });
      g.row(-14, 19, 23, HAIR);
      g.rect(17, -13, 17, -4, HAIR);
      g.rect(25, -13, 25, -3, HAIR);
      g.row(-13, 18, 24, HAIR);
    }
  });

  mk('tooth-child', 'tooth child small child in pyjamas whose face is all teeth no eyes teddy bear', (g, r) => {
    const S = PALE,
      Pj = hex('#5a6a80'),
      Hr = hex('#5a4630'),
      Bear = hex('#8a6a48');
    const a = g.man(6, 25, { skin: S, top: Pj, legs: Pj, shoe: false, tl: 7, ll: 7, face: { eyes: 'none', mouth: 'none', nose: false } });
    for (const y of [a.yT + 2, a.yT + 4, a.yT + 6]) g.row(y, 4, 9, lite(Pj));
    for (const y of [a.yL + 2, a.yL + 4]) g.row(y, 3, 10, lite(Pj));
    g.rect(3, 24, 5, 25, S);
    g.rect(7, 24, 10, 25, S);
    g.row(a.yH - 1, 4, 9, Hr);
    g.row(a.yH, 3, 10, Hr);
    g.pts([[3, a.yH + 1], [10, a.yH + 1]], Hr);
    if (!r) {
      g.both(13, (v) => {
        v.rect(1, a.yT, 2, a.yT + 3, Pj); // hands over its face
        v.limb([[2, a.yT], [3, a.yH + 6]], 2, Pj);
        v.rect(3, a.yH + 2, 5, a.yH + 5, S);
        v.col(4, a.yH + 2, a.yH + 4, dark(S));
      });
      g.rect(12, 21, 15, 25, Bear);
      g.rect(12, 18, 15, 20, Bear);
      g.pts([[12, 17], [15, 17]], Bear);
      g.pts([[13, 19], [15, 19]], K);
    } else {
      g.rect(4, a.yH + 2, 9, a.yH + 7, P.maw);
      for (let y = a.yH + 2; y <= a.yH + 7; y += 2) g.teeth(y, 4, 9, C.white, (y >> 1) % 2);
      g.both(13, (v) => {
        v.limb([[2, a.yT + 1], [0, a.yT + 4], [-1, a.yT + 7]], 2, Pj);
        v.pts([[-1, a.yT + 9], [0, a.yT + 9], [-2, a.yT + 10], [0, a.yT + 10]], S);
      });
      g.rect(13, 23, 18, 25, Bear);
      g.rect(18, 22, 20, 25, Bear);
      g.set(19, 23, K);
    }
  });

  mk('wide-smile-man', 'smiling man smile too wide suit hat teeth polite stranger grin horror', (g, r) => {
    const Su = hex('#3a3a44'),
      S = PALE,
      Ht = hex('#2a2830');
    const a = g.man(8, 35, { skin: S, top: Su, legs: Su, tl: 10, ll: 11, armL: 'down', armR: r ? null : 'down', face: { eyes: 'dot', mouth: 'none' } });
    g.rect(7, a.yT, 9, a.yT + 3, C.white);
    g.col(8, a.yT + 1, a.yT + 5, C.wine);
    if (!r) {
      g.row(a.yH + 6, 5, 12, K);
      g.pts([[4, a.yH + 5], [13, a.yH + 5]], K);
      g.teeth(a.yH + 6, 6, 11, C.white);
      g.rect(5, a.yH - 3, 12, a.yH - 1, Ht);
      g.row(a.yH, 3, 14, Ht);
      g.row(a.yH - 1, 5, 12, C.wine);
    } else {
      g.row(a.yH, 6, 11, hex('#3a3028'));
      g.rect(4, a.yH + 4, 13, a.yH + 7, P.maw); // from ear to ear and beyond
      g.teeth(a.yH + 4, 4, 13, C.white);
      g.teeth(a.yH + 7, 4, 13, C.white, 1);
      g.pts([[3, a.yH + 3], [14, a.yH + 3]], K);
      g.limb([[13, a.yT + 2], [16, a.yT - 1], [16, a.yH - 1]], 2, Su); // he raises his hat
      g.rect(16, a.yH - 3, 17, a.yH - 2, S);
      g.rect(14, a.yH - 8, 20, a.yH - 6, Ht);
      g.row(a.yH - 5, 12, 22, Ht);
      g.row(a.yH - 6, 14, 20, C.wine);
    }
  });

  mk('tv-crawler', 'thing crawling out of a television old tv set hair arms screen ghost girl', (g, r) => {
    const Bx = hex('#5a4a3a'),
      S = hex('#b8c0b8'),
      Hr = hex('#1c2022');
    g.rect(1, 3, 17, 15, Bx);
    g.row(3, 1, 17, lite(Bx));
    g.rect(2, 16, 3, 17, dark(Bx));
    g.rect(15, 16, 16, 17, dark(Bx));
    g.rect(3, 5, 13, 13, hex('#6a7a78'));
    g.dither(3, 5, 13, 13, hex('#2a3030'));
    g.pts([[15, 6], [15, 9]], C.brass);
    g.col(15, 11, 13, K);
    g.line(6, 2, 3, -2, C.steel);
    g.line(10, 2, 13, -2, C.steel);
    if (!r) {
      g.rect(6, 9, 10, 13, Hr); // the top of a head, two hands on the frame
      g.rect(3, 12, 5, 13, S);
      g.rect(11, 12, 13, 13, S);
      g.pts([[3, 14], [5, 14], [11, 14], [13, 14]], S);
    } else {
      g.rect(4, 9, 12, 13, hex('#b8b4a8'));
      g.limb([[5, 13], [2, 16]], 2, S);
      g.ball(5, 8, 11, 15, S); // it is half out
      g.rect(5, 7, 11, 10, Hr);
      g.rect(5, 10, 7, 17, Hr);
      g.col(9, 10, 16, Hr);
      g.col(11, 10, 15, Hr);
      g.set(8, 12, P.eye);
      g.limb([[11, 13], [18, 15], [24, 16]], 2, S);
      g.pts([[26, 16], [27, 15], [27, 17]], S);
    }
  });

  mk('inverted-priest', 'priest with his head on upside down black cassock collar book floating possessed', (g, r) => {
    const Ck = hex('#24222c'),
      S = PALE,
      Hr = hex('#6a6460'),
      fl = r ? 4 : 0;
    const a = g.man(8, 35 - fl, { skin: S, top: Ck, robe: Ck, tl: 11, ll: 12, arms: r ? null : 'down', head: false, hand: S });
    g.rect(7, a.yT, 9, a.yT, C.white);
    g.col(8, a.yT + 2, a.yL + 8, hex('#3e3a48'));
    const hy = a.yH;
    g.rect(5, hy, 12, hy + 8, S); // the head, chin up
    for (const [x, y] of [[5, hy], [12, hy], [6, hy], [11, hy], [5, hy + 1], [12, hy + 1], [5, hy + 8], [12, hy + 8]]) g.clear(x, y);
    g.col(12, hy + 2, hy + 7, dark(S));
    g.row(hy + 8, 6, 11, Hr);
    g.row(hy + 7, 5, 12, Hr);
    g.set(8, hy + 4, dark(S));
    if (!r) {
      g.pts([[7, hy + 5], [10, hy + 5]], K);
      g.row(hy + 2, 8, 9, vd(S));
      g.rect(1, a.yT + 6, 4, a.yT + 10, C.wine); // his book
      g.col(2, a.yT + 7, a.yT + 9, C.gold);
      g.row(a.yT + 9, 1, 3, C.gold);
    } else {
      g.pts([[7, hy + 5], [10, hy + 5]], C.white);
      g.rect(8, hy + 1, 9, hy + 3, K);
      g.both(17, (v) => {
        v.rect(-3, a.yT + 1, 4, a.yT + 3, Ck); // arms out, and his feet leave the floor
        v.rect(-5, a.yT + 1, -4, a.yT + 3, S);
      });
      g.pts([[6, 36 - fl], [10, 36 - fl]], S);
      g.rect(13, 34, 17, 35, C.wine);
      g.row(34, 14, 16, C.gold);
      g.ink();
      g.shadow(8, 37, 5);
      return false;
    }
  });

  mk('wolf-inside', 'werewolf turning wolf coming out of a mans mouth skin splitting man with a wolf inside', (g, r) => {
    const S = PALE,
      Sh = hex('#8a8474'),
      Tr = hex('#4a4038'),
      F = hex('#4a443e');
    if (!r) {
      const a = g.man(8, 34, { skin: S, top: Sh, legs: Tr, tl: 9, ll: 10, hy: 2, face: { eyes: 'shut', mouth: 'open' } }); // doubled over, holding himself
      g.row(a.yH - 1, 6, 11, hex('#3a3028'));
      g.row(a.yH, 5, 12, hex('#3a3028'));
      g.pts([[4, a.yH + 1], [3, a.yH], [13, a.yH + 1], [14, a.yH]], F); // the ears are wrong already
      g.rect(3, a.yT + 1, 5, a.yT + 5, Sh);
      g.rect(4, a.yT + 5, 11, a.yT + 6, Sh);
      g.rect(11, a.yT + 1, 13, a.yT + 5, Sh);
      g.rect(11, a.yT + 6, 14, a.yT + 8, F); // and one hand
      g.pts([[11, a.yT + 9], [13, a.yT + 9], [15, a.yT + 8]], B);
      g.pts([[6, a.yT + 2], [9, a.yT + 3], [7, a.yT + 7]], F);
    } else {
      const a = g.man(8, 34, { skin: S, top: Sh, legs: Tr, tl: 9, ll: 10, head: false });
      g.rect(2, a.yH + 4, 4, a.yH + 10, S); // his face, in two halves
      g.rect(12, a.yH + 4, 14, a.yH + 10, S);
      g.pts([[3, a.yH + 6], [13, a.yH + 6]], K);
      g.pts([[2, a.yH + 11], [14, a.yH + 11], [3, a.yH + 3], [13, a.yH + 3]], S);
      g.tube([[8, a.yT + 1], [8, a.yH + 3]], 3, 2.8, F); // the wolf comes out through the mouth
      g.ball(5, a.yH - 6, 11, a.yH + 3, F);
      g.pts([[5, a.yH - 7], [5, a.yH - 8], [6, a.yH - 7], [11, a.yH - 7], [11, a.yH - 8], [10, a.yH - 7]], F);
      g.rect(7, a.yH - 2, 9, a.yH + 1, lite(F));
      g.row(a.yH - 2, 7, 9, K);
      g.pts([[6, a.yH - 4], [10, a.yH - 4]], P.yel);
      g.rect(7, a.yH + 1, 9, a.yH + 2, P.maw);
      g.pts([[7, a.yH + 1], [9, a.yH + 1]], C.white);
      g.both(17, (v) => {
        v.limb([[5, a.yT + 2], [1, a.yT + 5], [0, a.yT + 10]], 2, F); // forelegs through the shirt
        v.hand(0, a.yT + 12, 0, 1, B, 3, 2);
      });
      g.pts([[6, a.yT + 4], [10, a.yT + 5], [8, a.yT + 7]], F);
    }
  });

  mk('long-neck-woman', 'long neck woman neck stretches head looks down nightdress black hair horror', (g, r) => {
    const S = PALE,
      Dr = hex('#b0a8a0');
    const a = g.man(8, 34, { skin: S, top: Dr, robe: Dr, arms: 'down', sleeve: Dr, head: false });
    const head = (x, y, o) => {
      g.rect(x - 1, y, x, y + 10, HAIR);
      g.rect(x + 7, y, x + 8, y + 10, HAIR);
      g.face(x, y, 8, 9, S, o);
      g.row(y - 1, x + 1, x + 6, HAIR);
      g.row(y, x, x + 7, HAIR);
    };
    if (!r) {
      g.rect(8, a.yT - 1, 9, a.yT, dark(S));
      head(5, a.yH, { eyes: 'shut', mouth: 'line' });
    } else {
      g.worm([[8.5, a.yT], [5, a.yT - 8], [10, a.yT - 16], [14, a.yT - 22]], 1.3, 1.3, S);
      head(11, a.yT - 32, { eyes: 'wide', mouth: 'grin' });
    }
  });

  /* ================= vermin and small things ================= */
  mk('hand-eye', 'crawling hand with an eye severed hand walks on its fingers small vermin', (g, r) => {
    const S = C.flesh;
    if (!r) {
      g.rect(2, 3, 7, 7, S);
      g.rect(0, 4, 1, 6, dark(S));
      g.row(3, 8, 11, S);
      g.row(5, 8, 12, S);
      g.row(7, 8, 11, S);
      g.pts([[4, 2], [5, 1], [6, 1]], S);
      g.row(5, 4, 5, dark(S));
    } else {
      for (const [x, tx] of [[3, 1], [5, 4], [7, 8], [8, 11]]) g.path([[x, 4], [tx, 6], [tx, 8]], S); // up on its fingertips
      g.path([[3, 2], [0, 3], [-1, 8]], S);
      g.rect(3, 0, 8, 4, S);
      g.rect(4, -3, 7, -1, dark(S));
      g.rect(5, -4, 6, -4, B);
      g.rect(5, 1, 6, 2, C.white);
      g.set(6, 2, K);
    }
  });

  mk('head-walking', 'head walking on its hair severed head upside down braids for legs small crawler', (g, r) => {
    const S = PALE,
      Hr = hex('#3a2c24');
    if (!r) {
      g.rect(1, 2, 2, 10, Hr);
      g.rect(11, 2, 12, 10, Hr);
      g.face(3, 2, 8, 9, S, { eyes: 'shut', mouth: 'line' });
      g.row(1, 4, 9, Hr);
      g.row(2, 3, 10, Hr);
      g.row(10, 0, 13, Hr);
    } else {
      for (const [x, tx] of [[4, 0], [6, 4], [8, 9], [10, 13]]) g.path([[x, 6], [tx, 8], [tx, 10]], Hr); // it gets up on its plaits, wrong way up
      g.rect(3, -3, 10, 5, S);
      for (const [x, y] of [[3, -3], [10, -3], [4, -3], [9, -3], [3, -2], [10, -2]]) g.clear(x, y);
      g.rect(3, 5, 10, 6, Hr);
      g.pts([[2, 4], [11, 4]], Hr);
      g.rect(6, -4, 7, -4, dark(S));
      g.pts([[4, 2], [5, 2], [8, 2], [9, 2]], C.white);
      g.pts([[5, 2], [9, 2]], K);
      g.rect(5, -2, 8, -1, P.maw);
      g.teeth(-1, 5, 8, C.white);
    }
  });

  mk('teeth-walking', 'walking teeth set of dentures gums on little feet chattering small vermin', (g, r) => {
    const Gm = P.raw,
      o = r ? 3 : 0;
    g.rect(0, 2 - o, 0, 6, C.steel); // the hinge
    if (r) {
      g.rect(2, 2 - o, 8, 5, P.maw);
      g.row(4, 3, 7, P.rawD);
      g.set(3, 1, P.eye);
    }
    g.rect(1, 1 - o, 9, 2 - o, Gm);
    for (let x = 1; x <= 9; x++) g.set(x, 3 - o, x % 3 === 0 ? dark(C.white) : C.white);
    for (let x = 1; x <= 9; x++) g.set(x, 5, x % 3 === 1 ? dark(C.white) : C.white);
    g.rect(1, 6, 9, 7, Gm);
    g.col(3, 8, 8, Gm);
    g.col(7, 8, 8, Gm);
    g.row(9, 2, 3, Gm);
    g.row(9, 7, 8, Gm);
  });

  mk('baby-wrong', 'crawling baby with the head turned right round grin too many teeth small horror infant', (g, r) => {
    const S = hex('#d8bca8');
    g.ball(2, 4, 9, 9, S);
    g.rect(1, 5, 4, 9, C.white);
    g.rect(1, 9, 3, 10, S);
    g.rect(8, 8, 9, 10, S);
    g.set(10, 10, S);
    g.ball(8, 0, 14, 7, S);
    g.set(11, -1, hex('#8a6a3a'));
    if (!r) {
      g.set(12, 3, K);
      g.set(13, 5, dark(S));
    } else {
      g.pts([[10, 4], [13, 4]], K); // the face is the wrong way up
      g.rect(10, 1, 13, 2, P.maw);
      g.teeth(1, 10, 13, C.white);
      g.teeth(2, 10, 13, C.white, 1);
      g.rect(5, 9, 6, 10, S);
      g.set(7, 10, S);
    }
  });

  mk('eye-cluster', 'cluster of eyes on stalks bunch of eyeballs nerves growing from the floor small', (g, r) => {
    const Nv = hex('#a8707a');
    g.oval(2, 11, 9, 13, dark(Nv));
    const eyes = [[3, 7], [7, 5], [5, 2], [10, 9], [1, 3]];
    const at = ([x, y]) => [x + (r ? Math.round((x - 5) * 0.5) : 0), y - (r ? Math.round((12 - y) * 0.45) : 0)];
    for (const e of eyes) {
      const [x, y] = at(e);
      g.line(5, 11, x, y + 1, Nv);
    }
    eyes.forEach((e, i) => {
      const [x, y] = at(e);
      g.oval(x - 1, y - 1, x + 1, y + 1, r ? P.eye : Nv);
      if (!r) g.row(y, x - 1, x + 1, dark(Nv));
      else g.set(x + [0, 1, -1, 0, 1][i], y + [0, 0, 0, 1, 0][i], K);
    });
  });

  mk('rat-stitched', 'stitched rats two rats sewn together a head at each end vermin small', (g, r) => {
    const Rt = hex('#57525a'),
      Rt2 = hex('#6a5a50'),
      Pk = P.raw,
      up = r ? 3 : 0;
    g.pts([[5, 8], [7, 8], [10, 8], [12, 8]], Pk);
    g.ball(3, 3, 9, 7, Rt);
    g.ball(8, 3, 14, 7, Rt2);
    g.col(8, 3, 7, K);
    g.pts([[7, 4], [9, 4], [7, 6], [9, 6]], C.cream);
    const head = (v, col) => {
      if (r) v.tube([[13, 5], [15, 3]], 1.6, 1.4, col);
      v.poly([[13, 3 - up], [16, 4 - up], [18, 6 - up], [13, 7 - up]], col);
      v.pts([[13, 2 - up], [14, 2 - up]], Pk);
      v.set(15, 4 - up, P.red);
      v.set(18, 6 - up, Pk);
      if (r) {
        v.row(7 - up, 15, 17, P.maw);
        v.row(8 - up, 14, 16, col);
        v.set(17, 7 - up, C.white);
      }
    };
    head(g, Rt2);
    head(g.flip(17), Rt);
  });

  mk('heart-crawler', 'heart that walks on its arteries crawling heart organ small vermin', (g, r) => {
    const He = hex('#8a2f34'),
      D = dark(He),
      up = r ? 3 : 0;
    if (r) for (const [x, tx] of [[3, 0], [5, 4], [7, 8], [8, 11]]) g.path([[x, 8 - up], [tx, 8], [tx, 10]], D);
    else g.pts([[3, 10], [8, 10]], D);
    g.ball(2, 2 - up, 9, 9 - up, He);
    g.oval(2, 1 - up, 5, 4 - up, He);
    g.oval(6, 1 - up, 9, 4 - up, He);
    g.rect(4, -1 - up, 5, 0 - up, hex('#5a4a6a'));
    g.col(7, -2 - up, 0 - up, P.raw);
    g.set(3, 3 - up, lite(He));
    if (!r) g.path([[4, 4], [5, 6], [4, 8]], D);
    else g.maw(3, 5 - up, 8, 7 - up);
  });

  mk('tongue-slug', 'tongue slug crawling tongue with teeth small vermin wet', (g, r) => {
    const Tg = P.raw;
    if (!r) {
      g.worm([[2, 4], [7, 3], [12, 4]], 1.8, 1.4, Tg);
      g.line(4, 3, 11, 3, dark(Tg));
    } else {
      g.worm([[2, 4], [7, 4], [10, 1], [10, -4]], 1.8, 1.2, Tg); // the tip rears and splits
      g.pts([[9, -6], [11, -6], [8, -7], [12, -7]], Tg);
      g.set(10, -5, C.white);
      g.line(4, 3, 8, 3, dark(Tg));
    }
    g.pts([[0, 3], [0, 5], [1, 2]], C.white); // teeth at the root
    g.ink();
    g.row(6, -4, -1, hex('#c8b8b0'));
    return false;
  });
};
