/* Creatures of the wild places: forest, marsh and moor. fn(g, r): r = 1 is the creature roused. */
module.exports = ({ mk, C, K, hex, mix, blend, dark, lite, rnd, P, vd }) => {
  const B = C.bone;
  const DEER = ['.bb.bb.', 'bbbbbbb', 'bKKbKKb', 'bKKbKKb', '.bbbbb.', '.bbbbb.', '..bbb..', '..bDb..'];

  /* ================= large and tall ================= */
  mk('wendigo', 'wendigo large tall antlered starved giant deer skull monster claws ribs forest spirit grey', 30, 48, (g, r) => {
    const S = hex('#8f928a'),
      D = dark(S),
      m = { b: B, K, D: vd(B) };
    g.both(29, (v) => {
      v.limb([[12, 35], [10, 40], [12, 44], [11, 45]], 2, S); // legs bent the wrong way
      v.row(46, 9, 12, vd(S));
      if (!r) {
        v.limb([[8, 22], [6, 31], [7, 39]], 2, S);
        v.hand(7, 41, 0, 1, B, 3, 3);
      } else {
        v.limb([[8, 22], [3, 26], [1, 17]], 2, S);
        v.hand(1, 16, 0, -1, B, 3, 4);
      }
    });
    g.rect(11, 33, 18, 35, S); // pelvis
    g.pts([[14, 35], [15, 35], [12, 33], [17, 33]], vd(S));
    g.rect(14, 29, 15, 32, S); // nothing but spine
    g.pts([[14, 30], [15, 31]], D);
    g.rect(10, 21, 19, 27, S); // ribcage
    g.row(28, 12, 17, S);
    g.rect(7, 20, 22, 21, S); // shoulders
    for (const y of [23, 25, 27]) {
      g.row(y, 11, 13, D);
      g.row(y, 16, 18, D);
    }
    g.col(14, 22, 28, lite(S));
    g.pts([[7, 19], [9, 19], [20, 19], [22, 19], [8, 22], [21, 22]], D); // a ruff of hair
    g.rect(14, 17, 15, 19, D); // neck
    g.pat(11, 9, DEER, m);
    if (r) g.rect(13, 17, 15, 19, P.maw);
    g.pat(13, 17 + (r ? 3 : 0), ['bbb', 'b.b'], m);
    g.antler(12, 9, -1, 8, B, 3);
    g.antler(17, 9, 1, 8, B, 3);
    if (r) g.pts([[13, 12], [16, 12]], P.eye);
  }, { w: 34, dx: 2 });

  mk('tree-person', 'tree that is a person large tall dead tree man bark face branches arms roots monster', 30, 48, (g, r) => {
    const Bk = P.bark,
      D = P.barkD,
      L = lite(Bk);
    g.limb([[11, 43], [7, 45], [3, 45]], 2, Bk); // roots
    g.limb([[19, 43], [23, 45], [26, 45]], 2, Bk);
    g.poly([[11, 46], [12, 32], [11, 17], [19, 17], [18, 32], [20, 46]], Bk); // the trunk
    g.rect(12, 11, 18, 17, Bk);
    g.pts([[12, 10], [13, 9], [13, 10], [16, 10], [17, 10], [17, 9], [17, 8], [18, 10]], Bk); // broken off at the top
    g.col(15, 37, 46, D); // two legs grown together
    g.col(16, 40, 46, D);
    g.lit(11, 12, 20, 46, 1.25);
    g.col(17, 31, 42, D);
    g.col(13, 30, 36, D);
    g.pts([[14, 13], [16, 14], [13, 15]], D);
    if (!r) {
      g.limb([[11, 19], [6, 13], [4, 5]], 2, Bk); // arms held up like boughs
      g.line(4, 5, 2, 1, Bk);
      g.line(5, 5, 6, 1, Bk);
      g.line(6, 11, 2, 9, Bk);
      g.limb([[19, 19], [24, 14], [25, 6]], 2, Bk);
      g.line(25, 6, 24, 2, Bk);
      g.line(26, 6, 28, 2, Bk);
      g.line(24, 12, 28, 10, Bk);
      g.row(21, 13, 14, D); // a sleeping face
      g.row(21, 16, 17, D);
      g.col(15, 22, 24, L);
      g.row(26, 14, 16, D);
    } else {
      g.limb([[11, 19], [5, 17], [2, 25]], 2, Bk); // the boughs come down
      g.hand(2, 27, 0, 1, Bk, 3, 5);
      g.limb([[19, 19], [25, 17], [27, 25]], 2, Bk);
      g.hand(28, 27, 0, 1, Bk, 3, 5);
      g.rect(13, 20, 14, 21, K);
      g.rect(16, 20, 17, 21, K);
      g.pts([[14, 21], [17, 21]], P.eye);
      g.maw(13, 24, 17, 30, { t: C.woodPale });
      g.pts([[12, 23], [18, 23], [12, 31], [18, 31]], D);
    }
  }, { w: 34, dx: 2 });

  mk('bear-manskin', 'bear walking upright wearing a mans skin large tall skin suit split fur claws monster forest', 28, 46, (g, r) => {
    const S = hex('#c2a084'),
      F = hex('#4a3a2c'),
      FL = hex('#6a5640');
    g.both(27, (v) => {
      v.rect(6, 34, 12, 44, F); // legs: the skin ends at the knee
      v.rect(6, 34, 12, 38, S);
      v.pts([[7, 39], [9, 39], [10, 40], [12, 39]], S);
      v.rect(4, 42, 12, 44, F);
      v.pts([[4, 44], [6, 44], [8, 44]], B);
    });
    g.ball(5, 13, 22, 36, S);
    g.both(27, (v) => {
      if (!r) {
        v.limb([[5, 17], [3, 24], [3, 30]], 4, S);
        v.rect(2, 31, 5, 34, F); // the paws do not fit
        v.pts([[2, 35], [4, 35], [5, 36]], B);
      } else {
        v.limb([[5, 17], [2, 12], [3, 7]], 4, S);
        v.rect(1, 3, 5, 6, F);
        v.pts([[1, 2], [3, 1], [5, 2]], B);
      }
    });
    g.col(13, 17, 33, F); // the seam down the belly has split
    g.col(14, 19, 34, F);
    g.rect(13, 23, 14, 31, FL);
    g.pts([[12, 26], [12, 28], [15, 27], [15, 29], [12, 30]], F);
    g.pts([[12, 19], [15, 20], [12, 22], [15, 23], [12, 33], [15, 32]], vd(S));
    if (!r) {
      g.ball(9, 3, 18, 14, S); // a man's face, sagging
      g.rect(10, 3, 17, 4, hex('#3a3028'));
      g.row(2, 11, 16, hex('#3a3028'));
      g.row(8, 10, 11, K);
      g.row(8, 15, 16, K);
      g.pts([[10, 9], [16, 9]], K);
      g.rect(12, 9, 15, 11, lite(S)); // something pushes from behind it
      g.row(12, 12, 15, K);
      g.pts([[13, 12], [14, 12]], F);
      g.pts([[11, 13], [16, 13]], vd(S));
    } else {
      g.rect(6, 6, 7, 16, S); // the face hangs in two flaps
      g.rect(20, 6, 21, 15, S);
      g.pts([[7, 9], [20, 9]], K);
      g.pts([[6, 17], [21, 16], [7, 17]], S);
      g.ball(8, 1, 19, 13, F);
      g.rect(8, 1, 9, 2, F);
      g.rect(18, 1, 19, 2, F);
      g.ball(11, 6, 16, 9, FL);
      g.row(6, 13, 14, K);
      g.maw(11, 9, 16, 13, { tongue: P.rawD });
      g.pts([[10, 5], [17, 5]], P.yel);
    }
  });

  mk('leshy', 'leshy large tall forest spirit moss giant wooden mask branch horns monster green', 28, 48, (g, r) => {
    const M = C.moss,
      W = C.woodPale,
      Bk = P.bark;
    g.poly([[7, 46], [4, 40], [7, 28], [9, 16], [18, 16], [20, 28], [23, 40], [20, 46]], M);
    g.speckle(4, 16, 23, 46, C.leafLight, 4, 3);
    g.speckle(4, 16, 23, 46, C.leaf, 5, 8);
    for (const y of [25, 33, 41]) g.strands(6, 21, y, 4, dark(M), y, 2);
    g.ragged(4, 23, 46, 3, 5);
    g.antler(10, 10, -1, 8, Bk, 2);
    g.antler(17, 10, 1, 8, Bk, 2);
    g.ball(9, 8, 18, 22, W); // a mask of pale wood
    g.col(13, 9, 11, dark(W));
    g.pts([[11, 19], [15, 20], [16, 10]], dark(W));
    g.rect(11, 13, 12, 14, K);
    g.rect(15, 13, 16, 14, K);
    if (r) {
      g.col(13, 15, 16, K);
      g.maw(11, 17, 16, 21, { t: W });
      g.pts([[12, 14], [16, 14]], P.glowG);
    }
    g.both(27, (v) => {
      if (!r) {
        v.limb([[7, 24], [4, 34], [4, 43]], 2, Bk);
        v.hand(4, 45, 0, 1, Bk, 3, 1);
      } else {
        v.limb([[7, 24], [2, 20], [1, 10]], 2, Bk);
        v.hand(1, 9, 0, -1, Bk, 3, 5);
      }
    });
  }, { w: 32, dx: 2 });

  /* ================= large and long ================= */
  mk('root-wolf', 'wolf made of roots large long root wolf wooden beast twisted forest monster', 46, 26, (g, r) => {
    const Bk = P.bark,
      D = P.barkD,
      L = hex('#7a6248');
    g.worm([[14, 13], [13, 18], [15, 23]], 1.4, 0.9, D, vd(D)); // far legs
    g.worm([[33, 12], [35, 18], [35, 23]], 1.4, 0.9, D, vd(D));
    g.worm([[9, 9], [4, 11], [2, 18]], 1.6, 0.6, Bk); // tail
    g.worm([[10, 9], [20, 7], [31, 9]], 3, 3, Bk); // the body: a bundle of roots
    g.worm([[9, 13], [20, 13], [31, 12]], 2.2, 2.2, L, Bk);
    g.worm([[11, 16], [20, 17], [29, 15]], 1.4, 1.4, Bk, D);
    g.worm([[11, 12], [8, 17], [11, 21], [10, 23]], 1.6, 1, Bk);
    g.worm([[30, 12], [32, 18], [31, 23]], 1.6, 1, Bk);
    for (const x of [10, 15, 31, 35]) g.pts([[x - 2, 24], [x - 1, 24], [x, 24], [x + 1, 24], [x + 2, 24]], x === 15 || x === 35 ? D : Bk);
    g.worm([[10, 11], [20, 10], [31, 10]], 0.5, 0.5, D, D); // the strands show
    g.worm([[12, 7], [20, 5], [29, 7]], 0.5, 0.5, L, L);
    for (const [x, y] of [[15, 15], [16, 15], [23, 15], [24, 15], [25, 15]]) g.clear(x, y); // and you can see through it
    g.line(18, 18, 17, 21, D);
    g.line(24, 17, 25, 20, D);
    g.line(13, 17, 13, 19, D);
    g.pts([[9, 18], [7, 15], [33, 16], [31, 20]], L);
    for (const x of [14, 18, 22, 26]) g.line(x, 6, x - 1, r ? 1 : 4, D); // twigs along the back
    if (!r) {
      g.worm([[30, 9], [35, 9], [38, 11]], 3, 2.4, Bk);
      g.poly([[36, 8], [40, 8], [44, 12], [44, 13], [37, 14]], Bk);
      g.line(37, 8, 36, 4, Bk);
      g.line(39, 8, 40, 5, Bk);
      g.set(40, 10, K);
      g.row(13, 40, 44, D);
      g.pts([[41, 14], [43, 14]], C.woodPale);
    } else {
      g.worm([[30, 9], [35, 6], [38, 5]], 3, 2.4, Bk);
      g.poly([[36, 8], [43, 12], [42, 13], [36, 11]], Bk); // lower jaw
      g.poly([[38, 6], [44, 6], [42, 11], [38, 8]], P.maw);
      g.poly([[36, 1], [40, 1], [45, 4], [45, 5], [37, 7]], Bk); // upper jaw
      g.pts([[39, 7], [41, 7], [43, 6], [39, 9], [41, 10]], C.woodPale);
      g.line(37, 1, 35, -2, Bk);
      g.line(39, 1, 40, -2, Bk);
      g.rect(39, 3, 40, 3, K);
      g.set(40, 3, P.yel);
    }
  }, { h: 30 });

  mk('kelpie', 'kelpie drowned horse large long water horse weed mane dripping wet monster marsh', 48, 32, (g, r) => {
    const H = hex('#4c5a58'),
      D = dark(H),
      Wd = hex('#3e5a34'),
      WdL = hex('#5c7a44');
    g.rect(14, 19, 15, 30, D); // far legs
    g.rect(31, 19, 32, 30, D);
    g.worm([[8, 12], [4, 16], [4, 28]], 1.8, 0.6, Wd); // a tail of weed
    g.ball(7, 9, 33, 21, H);
    for (const x of [16, 19, 22, 25]) g.line(x, 12, x - 1, 18, D); // ribs
    g.pts([[10, 11], [11, 10], [12, 10]], lite(H));
    for (const x of [10, 28]) {
      g.rect(x, 19, x + 1, 30, H);
      g.rect(x - 1, 24, x + 2, 25, H);
      g.row(30, x - 1, x + 2, vd(H));
    }
    const mane = (x0, x1, yf) => {
      for (let x = x0; x <= x1; x++) if (x % 3 !== 1) g.col(x, yf(x), yf(x) + 3 + ((x * 7) % 5), x % 2 ? Wd : WdL);
    };
    if (!r) {
      g.worm([[30, 12], [36, 11], [40, 15]], 3.2, 2.4, H);
      g.worm([[40, 15], [42, 19], [44, 23]], 2.4, 1.6, H);
      g.set(41, 15, P.eye);
      g.set(44, 23, K);
      g.row(25, 42, 45, D);
      mane(28, 39, (x) => 8 + Math.round(Math.max(0, x - 34) * 0.6));
    } else {
      g.worm([[30, 12], [34, 5], [39, 0]], 3.2, 2.4, H); // the head comes up and the jaw opens to the throat
      g.worm([[38, 2], [41, 6], [42, 10]], 1.4, 1, H);
      g.poly([[39, 1], [45, 3], [43, 8], [40, 4]], P.maw);
      g.worm([[39, -1], [45, 1]], 2.2, 1.6, H);
      g.pts([[41, 3], [43, 3], [45, 3], [41, 5], [42, 7], [43, 9]], C.white);
      g.rect(40, -2, 41, -2, K);
      g.set(41, -2, P.eye);
      mane(27, 36, (x) => 9 - Math.round((x - 27) * 0.9));
    }
    g.ink();
    for (const [x, y] of [[13, 23], [21, 23], [22, 25], [5, 30], [r ? 36 : 43, r ? 14 : 27]]) g.set(x, y, C.glassLight); // it drips
    return false;
  }, { h: 38 });

  mk('leech-carpet', 'leech carpet large long mat of leeches black slick swarm marsh crawling monster', 48, 14, (g, r) => {
    const L = hex('#2e2a2c'),
      Hi = hex('#6a6068'),
      U = hex('#8a6a62');
    const rise = (x) => (r && x > 20 ? Math.round(Math.pow((x - 20) / 25, 1.4) * 20) : 0),
      top = (x) => 12 - (3 + Math.round(1.4 * Math.sin(x * 0.5) + 1.1 * Math.sin(x * 0.19 + 1))) - rise(x);
    for (let x = 2; x <= 45; x++) {
      const t = top(x),
        b = rise(x) > 3 ? t + 7 : 12;
      g.col(x, t, Math.min(12, b), L);
      if (rise(x) > 3) g.col(x, t + 3, Math.min(12, b), U); // the underside
      if (x % 4 === 1) g.set(x, t, Hi);
      if (x % 4 === 3 && !rise(x)) g.col(x, t + 1, 12, vd(L));
      if (x % 5 === 2) g.set(x, t + 1, Hi);
    }
    if (r) {
      for (const x of [30, 35, 40, 44]) {
        const y = top(x) + 4;
        g.rect(x - 1, y, x, y + 1, P.maw); // sucker mouths
        g.pts([[x - 2, y], [x + 1, y + 1], [x - 1, y - 1], [x, y + 2]], B);
      }
      g.worm([[44, top(44)], [46, top(44) - 3]], 1, 0.6, L);
      g.worm([[40, top(40)], [41, top(40) - 4]], 1, 0.6, L);
    }
    g.worm([[2, 12], [1, 10]], 0.8, 0.6, L);
    g.worm([[10, top(10)], [11, top(10) - 2]], 0.8, 0.6, L);
    g.worm([[24, top(24)], [23, top(24) - 2]], 0.8, 0.6, L);
  }, { h: 32 });

  mk('log-crawler', 'log crawler large long rotten log many legs fallen tree hollow mouth teeth monster forest centipede', 48, 18, (g, r) => {
    const Bk = P.bark,
      D = P.barkD,
      y0 = r ? 1 : 7;
    if (r)
      for (let x = 7; x <= 36; x += 4) {
        g.path([[x + 1, y0 + 8], [x + 3, y0 + 11], [x + 2, 16]], dark(B));
        g.path([[x, y0 + 8], [x - 2, y0 + 11], [x - 1, 16]], B);
      }
    else for (let x = 7; x <= 36; x += 4) g.pts([[x, 16], [x - 1, 16]], B);
    g.rect(4, y0, 40, y0 + 8, Bk);
    g.clear(4, y0);
    g.clear(4, y0 + 8);
    g.row(y0, 5, 38, lite(Bk));
    for (let x = 6; x < 36; x += 7) {
      g.row(y0 + 3, x, x + 4, D);
      g.row(y0 + 6, x + 3, x + 6, D);
    }
    g.speckle(4, y0, 36, y0 + 1, C.moss, 2, 4);
    g.limb([[24, y0], [26, y0 - 3]], 2, Bk); // a stub of branch
    g.row(y0 - 2, 11, 14, hex('#a07e5a')); // fungus
    g.col(12, y0 - 1, y0 - 1, C.cream);
    g.row(y0 - 1, 17, 19, hex('#a07e5a'));
    g.oval(37, y0 - 1, 45, y0 + 9, C.woodPale); // the hollow end
    g.oval(39, y0 + 1, 44, y0 + 7, P.night);
    if (!r) g.pts([[41, y0 + 4], [43, y0 + 4]], dark(P.yel));
    else {
      g.pts([[40, y0 + 2], [42, y0 + 1], [44, y0 + 3], [40, y0 + 6], [42, y0 + 7], [44, y0 + 5]], B);
      g.pts([[41, y0 + 3], [43, y0 + 3]], P.yel);
      g.worm([[42, y0 + 5], [44, y0 + 9], [46, y0 + 11]], 1.2, 0.7, P.rawD);
    }
  }, { h: 24 });

  /* ================= dog- to person-sized ================= */
  mk('bog-body', 'bog body that rises peat corpse leather brown mud pool marsh dead man noose', 22, 16, (g, r) => {
    const S = hex('#7a5434'),
      M = hex('#2e2620'),
      ML = hex('#4a3c2c'),
      Hr = hex('#7a3a20');
    g.oval(1, 10, 20, 14, M);
    if (!r) {
      g.face(8, 4, 7, 8, S, { eyes: 'hollow', mouth: 'none' }); // up to the nose in it
      g.row(4, 9, 13, Hr);
      g.pts([[8, 5], [14, 5]], Hr);
      g.rect(5, 10, 17, 11, M);
      g.rect(3, 12, 18, 13, M);
      g.rect(16, 8, 18, 9, S); // one hand on the rim
      g.pts([[16, 10], [18, 10]], S);
    } else {
      const a = g.man(10, 13, { skin: S, top: S, legs: dark(S), shoe: false, tl: 10, ll: 9, face: { eyes: 'hollow', mouth: 'open' } });
      for (const y of [a.yT + 2, a.yT + 4, a.yT + 6]) g.row(y, 9, 12, dark(S));
      g.row(a.yH, 8, 12, Hr);
      g.pts([[7, a.yH + 1], [13, a.yH + 1]], Hr);
      g.row(a.yT, 8, 13, C.straw); // the rope it was put down with
      g.col(12, a.yT + 1, a.yT + 5, C.straw);
      g.both(21, (v) => {
        v.rect(5, a.yT + 1, 6, a.yT + 13, S); // arms down to the knees
        v.set(5, a.yT + 7, dark(S));
        v.rect(4, a.yT + 14, 6, a.yT + 15, S);
        v.pts([[4, a.yT + 16], [6, a.yT + 16], [5, a.yT + 17]], S);
      });
      g.pts([[13, a.yH + 6], [14, a.yH + 7]], S); // the jaw has slipped
      g.clear(7, a.yH + 6);
      g.rect(4, 12, 17, 13, M);
      g.row(14, 5, 16, M);
    }
    g.row(11, 4, 7, ML);
    g.row(13, 12, 16, ML);
  }, { h: 38 });

  mk('deer-face', 'deer with a human face roe deer pale face wrong animal forest stares', 26, 28, (g, r) => {
    const F = hex('#8a6a48'),
      D = dark(F),
      W = hex('#cfc4a8'),
      up = r ? 6 : 0,
      fy = 3 - up;
    g.line(8, 18, 9, 26, D); // far legs
    g.line(15, 18, 14, 26, D);
    g.ball(3, 11, 19, 19, F);
    g.row(19, 7, 15, W);
    g.col(6, 18, 26, F);
    g.col(17, 18, 26, F);
    g.pts([[6, 26], [17, 26], [9, 26], [14, 26]], vd(F));
    g.pts([[2, 12], [2, 13], [3, 11]], W);
    g.pts([[7, 13], [10, 12], [13, 13]], lite(F));
    g.worm([[17, 15], [19, 11 - up * 0.5], [19, 9 - up]], 2.2, 1.8, F);
    g.pts([[15, fy + 2], [14, fy + 1], [23, fy + 2], [24, fy + 1]], F); // ears
    g.pts([[17, fy - 1], [17, fy - 2], [21, fy - 1], [21, fy - 2]], B);
    g.face(16, fy, 7, 8, P.pale, r ? { eyes: 'wide', mouth: 'scream' } : { eyes: 'shut', mouth: 'line' });
  }, { h: 34 });

  mk('stag-hunter', 'stag skull hunter antlers bone mask spear pelts huntsman forest spirit', 24, 44, (g, r) => {
    const Ct = hex('#3a4434'),
      m = { b: B, K, D: vd(B) };
    const a = g.man(10, 42, { top: Ct, legs: hex('#2e2a26'), tl: 11, ll: 11, head: false, armR: 'down', armL: r ? null : 'down', hand: B });
    g.rect(7, a.yL, 14, a.yL + 6, Ct); // a long coat
    g.col(10, a.yL, a.yL + 6, vd(Ct));
    g.pts([[7, a.yL + 7], [9, a.yL + 7], [12, a.yL + 7], [14, a.yL + 7]], Ct);
    g.rect(6, a.yT, 15, a.yT + 1, P.fur);
    g.row(a.yL - 1, 8, 13, C.woodDark);
    g.rect(12, a.yL, 13, a.yL + 4, P.grey); // a hare at the belt
    g.pts([[12, a.yL + 5], [13, a.yL + 6]], P.grey);
    g.col(17, 16, 42, C.woodDark); // spear
    g.pts([[17, 12], [16, 13], [17, 13], [18, 13], [16, 14], [17, 14], [18, 14], [17, 15]], C.steel);
    g.pat(7, a.yT - 9, DEER, m);
    if (r) g.rect(9, a.yT - 1, 11, a.yT, P.maw);
    g.pat(9, a.yT - 1 + (r ? 2 : 0), ['bbb', 'b.b'], m);
    g.antler(8, a.yT - 9, -1, 8, B, 3);
    g.antler(13, a.yT - 9, 1, 8, B, 3);
    if (r) {
      g.pts([[9, a.yT - 6], [12, a.yT - 6]], P.red);
      g.limb([[5, a.yT + 2], [1, a.yT + 3], [-2, a.yT - 2]], 2, Ct); // it points
      g.hand(-2, a.yT - 4, 0, -1, B, 3, 3);
      g.rect(9, a.yT + 4, 12, a.yL - 3, K); // and the coat is full of small skulls
      g.pts([[9, a.yT + 5], [11, a.yT + 5], [10, a.yT + 8], [12, a.yT + 8]], P.eye);
    }
  }, { w: 28, dx: 4 });

  mk('moth-owl', 'moth winged owl thing moth owl eye spots feathers night bird monster forest', 18, 24, (g, r) => {
    const M = hex('#7a6a52'),
      D = dark(M),
      Wg = hex('#a08e6c');
    g.both(17, (v) => {
      if (!r) {
        v.poly([[4, 8], [2, 12], [3, 20], [6, 21]], D);
        v.set(3, 15, P.yel);
      } else {
        v.poly([[5, 8], [-9, 2], [-11, 6], [-8, 14], [-2, 17], [5, 16]], Wg); // the wings: two great eyes
        v.line(5, 9, -9, 3, D);
        v.pts([[-10, 9], [-7, 14], [-4, 16], [-1, 17]], D);
        v.oval(-8, 5, -1, 12, K);
        v.oval(-7, 6, -2, 11, P.yel);
        v.rect(-5, 8, -4, 9, K);
      }
      v.line(6, 4, 3, 1, D); // feathered feelers
      v.pts([[5, 1], [3, 3], [2, 2]], D);
    });
    g.ball(5, 5, 12, 20, M);
    g.oval(5, 4, 12, 10, Wg);
    g.speckle(5, 11, 12, 20, D, 4, 2);
    g.pts([[6, 21], [7, 21], [10, 21], [11, 21]], C.mustard);
    if (!r) {
      g.row(7, 6, 7, K);
      g.row(7, 10, 11, K);
      g.pts([[8, 9], [9, 9], [8, 10]], vd(M));
    } else {
      g.rect(6, 6, 7, 7, K);
      g.rect(10, 6, 11, 7, K);
      g.pts([[7, 7], [11, 7]], P.yel);
      g.maw(7, 9, 10, 13);
    }
  }, { w: 42, h: 26, dx: 12 });

  mk('crow-mother', 'crow mother woman made of crows black feathers beaks eyes cloak bird monster moor', 22, 38, (g, r) => {
    const N = hex('#1f1c26'),
      Wn = hex('#3a3644'),
      Bk = hex('#7a7268');
    const crow = (v, x, y, d) => {
      v.rect(x, y, x + 2, y + 2, N);
      v.pts([[x + 1, y + 1]], P.eye);
      v.pts([[x + (d > 0 ? 3 : -1), y + 1], [x + (d > 0 ? 4 : -2), y + (r ? 0 : 1)]], Bk);
      if (r) v.set(x + (d > 0 ? 4 : -2), y + 2, Bk);
    };
    if (r)
      g.both(21, (v) => {
        v.poly([[6, 14], [-8, 6], [-9, 12], [-6, 22], [2, 27], [6, 25]], N);
        for (const [x, y] of [[-9, 13], [-7, 22], [-4, 25], [-1, 27]]) v.col(x, y, y + 2, N);
        v.line(5, 15, -7, 8, Wn);
        v.line(4, 19, -6, 15, Wn);
      });
    g.poly([[6, 36], [5, 26], [7, 13], [14, 13], [16, 26], [15, 36]], N);
    g.ragged(5, 16, 36, 3, 7);
    for (let y = 16; y < 35; y += 4)
      for (let x = 6 + ((y >> 2) % 2) * 2; x < 15; x += 4) if (g.get(x, y) && g.get(x + 2, y)) g.pts([[x, y], [x + 1, y + 1], [x + 2, y]], Wn);
    g.ball(7, 3, 14, 13, N);
    g.pts([[10, 9], [11, 9], [10, 10], [11, 10], [10, 11], [10, 12], [10, 13]], Bk); // one long beak
    g.pts([[8, 7], [13, 7]], P.eye);
    crow(g, 15, 15, 1);
    if (r) {
      crow(g, 3, 20, -1);
      crow(g, 15, 27, 1);
      crow(g, 4, 30, -1);
      g.pts([[9, 17], [12, 21], [8, 25], [11, 29], [13, 33]], P.eye);
      g.rect(10, 11, 11, 13, P.maw);
      g.pts([[9, 11], [9, 12], [9, 13], [12, 11], [12, 12], [12, 13]], Bk);
    }
  }, { w: 42, h: 40, dx: 10 });

  mk('hare', 'hare standing upright too tall long legs human hands split mouth wrong animal moor', 16, 34, (g, r) => {
    const F = hex('#8a7458'),
      D = dark(F),
      W = hex('#cfc4a8'),
      S = C.flesh;
    if (!r) {
      g.rect(5, 1, 6, 9, F);
      g.rect(9, 1, 10, 9, F);
      g.col(6, 3, 8, P.rawD);
      g.col(9, 3, 8, P.rawD);
    } else {
      g.limb([[5, 8], [2, 2]], 2, F);
      g.limb([[9, 8], [12, 2]], 2, F);
    }
    g.rect(4, 22, 5, 31, F); // shins far too long
    g.rect(10, 22, 11, 31, F);
    g.row(32, 2, 5, F);
    g.row(32, 10, 13, F);
    g.ball(4, 15, 11, 24, F);
    g.rect(7, 17, 8, 21, W);
    g.ball(4, 8, 11, 15, F);
    g.pts([[5, 11], [10, 11]], r ? P.red : K);
    g.pts([[7, 13], [8, 13]], P.rawD);
    if (!r) {
      g.pts([[7, 14], [8, 14]], D);
      g.pts([[7, 15], [8, 15]], C.white);
      g.col(3, 16, 24, F); // thin arms, a man's hands
      g.col(12, 16, 24, F);
      g.rect(2, 25, 3, 26, S);
      g.rect(12, 25, 13, 26, S);
      g.pts([[2, 27], [4, 27], [11, 27], [13, 27]], S);
    } else {
      g.rect(7, 14, 8, 23, P.maw); // the lip splits down to the belly
      g.pts([[6, 14], [6, 16], [6, 18], [6, 20], [6, 22], [9, 15], [9, 17], [9, 19], [9, 21], [9, 23]], C.white);
      g.line(3, 16, 1, 10, F);
      g.line(12, 16, 14, 10, F);
      g.rect(1, 8, 2, 9, S);
      g.rect(13, 8, 14, 9, S);
      g.pts([[1, 7], [3, 7], [12, 7], [14, 7]], S);
    }
  });

  mk('fox-split', 'fox with a second mouth in its side split flank teeth wrong animal forest red', 28, 16, (g, r) => {
    const O = hex('#a05a2c'),
      D = dark(O),
      W = hex('#d0c6b0'),
      Bl = hex('#2a2224');
    g.rect(10, 10, 10, 14, vd(O)); // far legs
    g.rect(19, 10, 19, 14, vd(O));
    g.tube([[7, 8], [2, 10]], 1.8, 1.8, O);
    g.oval(1, 9, 3, 11, W);
    g.ball(6, 4, 20, 11, O);
    g.row(11, 10, 16, W);
    g.rect(7, 10, 8, 14, Bl);
    g.rect(17, 10, 18, 14, Bl);
    g.poly([[19, 3], [22, 3], [26, 7], [22, 9], [19, 8]], O); // head
    g.pts([[23, 8], [24, 8], [22, 8]], W);
    g.pts([[19, 2], [19, 1], [22, 2], [22, 1]], Bl);
    g.set(26, 7, K);
    if (!r) {
      g.set(22, 5, K);
      g.line(9, 6, 16, 8, D); // a seam along the flank
      g.pts([[10, 5], [12, 8], [14, 6], [16, 9]], vd(O));
    } else {
      g.set(22, 5, P.yel);
      g.maw(9, 5, 16, 9, { tongue: P.rawD });
      g.pts([[8, 7], [17, 7]], D);
      g.line(22, 10, 25, 11, O); // the jaw hangs
      g.pts([[23, 9], [25, 10]], C.white);
    }
  });

  mk('mushroom-walker', 'mushroom walker corpse overgrown with fungus toadstool head spores dead man forest', 18, 36, (g, r) => {
    const S = hex('#8c8a70'),
      Cp = hex('#a07e5a'),
      St = hex('#d2c8ac');
    const a = g.man(8, 34, { skin: S, top: C.earth, legs: hex('#3c3830'), shoe: false, head: false, armL: r ? null : 'down' });
    g.rect(6, 9, 11, 15, St); // the head: a stalk with a face, under a great cap
    g.col(11, 9, 15, dark(St));
    g.pts([[7, 11], [10, 11]], r ? P.glowG : K);
    if (r) g.rect(8, 13, 9, 14, K);
    else g.row(13, 8, 9, vd(St));
    g.row(3, 6, 11, Cp);
    g.row(4, 4, 13, Cp);
    g.rect(2, 5, 15, 7, Cp);
    g.row(8, 3, 14, dark(Cp));
    g.pts([[5, 5], [9, 4], [12, 6], [7, 6]], St);
    g.row(3, 6, 8, lite(Cp));
    g.row(a.yT + 3, 3, 6, St); // brackets
    g.row(a.yT + 4, 4, 6, dark(St));
    g.row(a.yT + 7, 10, 14, St);
    g.row(a.yT + 8, 10, 13, dark(St));
    g.ball(12, a.yT + 1, 15, a.yT + 5, Cp); // where an arm was
    g.col(13, a.yT + 6, a.yT + 7, St);
    g.pts([[5, a.yL + 4], [10, a.yL + 6], [6, a.yL + 7]], St);
    if (r) {
      g.rect(1, a.yT + 1, 3, a.yT + 5, S);
      g.rect(1, a.yT + 6, 3, a.yT + 8, lite(S));
      g.pts([[1, a.yT + 9], [3, a.yT + 9]], lite(S));
      g.ink();
      for (const [x, y] of [[4, 0], [8, -2], [12, 0], [6, -3], [10, 1], [14, 2], [2, 2], [9, -4]]) g.set(x, y, hex('#d8d49a')); // spores
      return false;
    }
  }, { h: 40 });

  mk('stump-thing', 'stump thing tree stump with root legs hollow eyes mouth in the bark forest monster', 24, 20, (g, r) => {
    const Bk = P.bark,
      D = P.barkD,
      y0 = r ? -1 : 5;
    g.both(22, (v) => {
      if (!r) v.limb([[6, 16], [2, 17]], 2, Bk);
      else {
        v.limb([[8, y0 + 12], [6, y0 + 16], [6, 17]], 2, D);
        v.limb([[7, y0 + 11], [3, y0 + 14], [2, 17]], 2, Bk);
        v.limb([[6, y0 + 5], [2, y0 + 3], [1, y0 - 1]], 2, Bk);
        v.hand(1, y0 - 2, 0, -1, Bk, 3, 2);
      }
    });
    g.rect(6, y0 + 2, 16, y0 + 12, Bk);
    if (!r) g.rect(5, y0 + 11, 17, y0 + 13, Bk);
    g.oval(6, y0, 16, y0 + 4, C.woodPale);
    g.oval(9, y0 + 1, 13, y0 + 3, dark(C.woodPale));
    g.set(11, y0 + 2, C.woodDark);
    g.col(8, y0 + 5, y0 + 11, D);
    g.col(14, y0 + 6, y0 + 12, D);
    g.col(6, y0 + 4, y0 + 12, lite(Bk));
    if (!r) {
      g.oval(9, y0 + 6, 13, y0 + 9, P.night);
      g.pts([[10, y0 + 7], [12, y0 + 7]], dark(P.yel));
    } else {
      g.maw(7, y0 + 8, 15, y0 + 11, { t: C.woodPale });
      g.rect(8, y0 + 5, 9, y0 + 6, K);
      g.rect(13, y0 + 5, 14, y0 + 6, K);
      g.pts([[9, y0 + 6], [14, y0 + 6]], P.yel);
    }
  }, { h: 26 });

  mk('heron', 'heron with human legs long neck beak teeth wrong bird marsh grey wader', 18, 40, (g, r) => {
    const G = hex('#7f8a90'),
      D = dark(G),
      S = hex('#c9b49a'),
      Bk = hex('#c8b070');
    g.rect(6, 23, 7, 37, S); // a man's legs
    g.row(30, 6, 7, dark(S));
    g.row(38, 5, 9, S);
    if (!r) g.limb([[9, 23], [11, 27], [9, 30]], 2, S);
    else {
      g.rect(10, 23, 11, 37, S);
      g.row(30, 10, 11, dark(S));
      g.row(38, 10, 14, S);
      g.poly([[4, 16], [-2, 10], [-1, 17], [1, 21]], D);
      g.pts([[-2, 9], [-1, 8], [0, 9]], S); // fingers at the wing tip
    }
    g.ball(3, 14, 13, 23, G);
    g.poly([[4, 17], [12, 16], [13, 21], [6, 22]], D);
    g.pts([[2, 20], [1, 21], [2, 22]], D);
    if (!r) {
      g.worm([[11, 16], [14, 12], [10, 8], [12, 4]], 1.4, 1.2, G);
      g.ball(10, 1, 14, 5, G);
      g.line(14, 4, 16, 10, Bk);
      g.line(13, 5, 15, 10, dark(Bk));
      g.set(12, 3, P.yel);
      g.line(10, 2, 6, 4, D);
    } else {
      g.worm([[11, 16], [13, 6], [12, -3]], 1.4, 1.2, G);
      g.ball(10, -7, 14, -3, G);
      g.line(14, -6, 19, -7, Bk);
      g.line(14, -4, 19, -2, Bk);
      g.pts([[15, -5], [17, -5], [16, -4], [18, -3], [18, -6]], C.white);
      g.set(12, -5, P.red);
      g.line(10, -6, 6, -5, D);
    }
  }, { w: 24, h: 49, dx: 3 });

  mk('sheep-six-legs', 'sheep with six legs skull face wool eye moor wrong animal ram', 26, 20, (g, r) => {
    const Wl = hex('#b0a890'),
      D = dark(Wl),
      Fc = hex('#2e2a2c');
    for (const x of [6, 10, 14, 18]) g.col(x, 13, 18, vd(Fc));
    for (const x of [4, 7, 9, 12, 15, 17]) g.col(x, 13, 18, Fc);
    g.ball(3, 5, 19, 14, Wl);
    g.oval(4, 4, 8, 7, Wl);
    g.oval(9, 3, 14, 7, Wl);
    g.oval(14, 4, 18, 7, Wl);
    g.speckle(3, 4, 19, 14, D, 5, 3);
    g.pts([[6, 9], [12, 11], [16, 8]], C.earth); // burrs
    if (!r) {
      g.poly([[18, 6], [22, 6], [24, 10], [24, 12], [21, 13], [18, 11]], Fc); // a black face
      g.pts([[18, 5], [17, 6], [16, 6]], Fc);
      g.set(22, 8, P.eye);
      g.row(9, 9, 11, D);
    } else {
      const Hn = hex('#6a6050');
      g.rect(18, 3, 23, 8, B); // the face turns to us: a skull, the jaw opening sideways
      g.rect(19, 9, 22, 12, B);
      g.rect(18, 5, 19, 6, K);
      g.rect(22, 5, 23, 6, K);
      g.pts([[19, 6], [23, 6]], P.red);
      g.rect(20, 11, 21, 14, P.maw);
      g.pts([[19, 13], [19, 14], [22, 13], [22, 14]], B);
      g.pts([[17, 2], [16, 3], [15, 4], [15, 5], [16, 6], [17, 6], [24, 2], [25, 3], [26, 4], [26, 5], [25, 6], [24, 6]], Hn);
      g.oval(8, 7, 13, 12, K); // and an eye opens in the wool
      g.oval(9, 8, 12, 11, P.eye);
      g.rect(10, 9, 11, 10, K);
    }
  });

  mk('thorn-child', 'thorn child bramble child made of briars vines thorns small figure forest', 16, 26, (g, r) => {
    const V = hex('#4a4a2e'),
      D = dark(V),
      T = hex('#8a8050');
    g.ball(4, 2, 11, 9, V);
    g.rect(5, 10, 10, 17, V);
    g.rect(5, 18, 6, 24, V);
    g.rect(9, 18, 10, 24, V);
    g.both(15, (v) => {
      if (!r) {
        v.col(3, 10, 18, V);
        v.pts([[2, 13], [2, 17]], T);
      } else {
        v.worm([[4, 11], [-1, 9], [-4, 14], [-3, 21]], 1, 0.6, V);
        v.pts([[-1, 7], [-5, 12], [-5, 17], [-2, 18]], T);
      }
      v.pts([[3, 3], [3, 7], [4, 14], [4, 21], [5, 1]], T);
    });
    g.speckle(4, 2, 11, 24, D, 3, 4);
    g.pts([[7, 12], [8, 15], [6, 20]], T);
    if (!r) g.pts([[6, 5], [9, 5]], C.blood);
    else {
      g.pts([[6, 4], [9, 4]], C.red);
      g.rect(6, 6, 9, 8, P.maw); // the head opens like a bud
      g.pts([[6, 6], [8, 6], [7, 8], [9, 8]], T);
    }
  }, { w: 26, dx: 5 });

  mk('drowned-maid', 'drowned maid rusalka wet woman long black hair over face teeth marsh ghost pale', 18, 36, (g, r) => {
    const S = P.drown,
      Dr = hex('#aab4ac'),
      H = hex('#1c2224');
    const a = g.man(8, 34, { skin: S, top: Dr, robe: Dr, arms: r ? null : 'down', sleeve: S, face: { eyes: 'none', mouth: 'none', nose: false } });
    g.dither(4, 30, 13, 34, dark(Dr));
    g.row(a.yH - 1, 6, 11, H);
    g.rect(5, a.yH, 12, a.yH + 1, H);
    if (!r) {
      g.rect(5, a.yH + 2, 12, a.yT + 7, H); // the hair hangs over the face
      g.ragged(5, 12, a.yT + 7, 3, 4);
      g.col(8, a.yH + 2, a.yT + 5, hex('#2c3436'));
    } else {
      g.rect(4, a.yH + 2, 6, a.yT + 7, H);
      g.rect(11, a.yH + 2, 13, a.yT + 7, H);
      g.maw(7, a.yH + 4, 10, a.yH + 7, { t: C.white }); // and behind it is only a mouth
      g.both(17, (v) => {
        v.rect(3, a.yT + 1, 5, a.yT + 4, S);
        v.rect(3, a.yT + 5, 5, a.yT + 7, lite(S));
        v.pts([[3, a.yT + 8], [5, a.yT + 8], [3, a.yT + 9], [5, a.yT + 9], [5, a.yT + 10]], lite(S));
      });
    }
    g.pts([[5, a.yH + 5], [12, a.yT + 2], [6, a.yT + 5]], C.moss);
  });

  mk('stone-walker', 'standing stone that walks menhir spiral eye stone giant moor monster grey', 20, 36, (g, r) => {
    const St = C.stone,
      D = C.stoneDark,
      yb = r ? 29 : 34;
    if (r) {
      g.rect(5, 29, 8, 34, St);
      g.rect(11, 29, 14, 34, St);
      g.row(34, 4, 8, D);
      g.row(34, 11, 15, D);
      g.both(19, (v) => {
        v.limb([[4, 15], [0, 19], [-1, 27]], 3, St); // slabs for arms
        v.row(29, -2, 1, D);
      });
    }
    g.poly([[5, yb], [4, 20], [6, 6], [9, 2], [12, 3], [14, 10], [15, yb]], St);
    g.lit(4, 2, 15, yb);
    g.speckle(4, 2, 15, yb, C.stoneLight, 7, 2);
    g.speckle(4, 20, 15, yb, C.moss, 6, 5);
    g.pts([[7, 22], [12, 26], [8, 30]], C.mustard); // lichen
    g.oval(7, 9, 12, 14, D); // the carved ring
    g.oval(8, 10, 11, 13, r ? K : St);
    if (!r) {
      g.set(9, 11, D);
      g.line(5, 17, 5, 30, D); // seams, where it is folded
      g.line(14, 15, 14, 30, D);
      g.row(29, 6, 13, D);
    } else g.rect(9, 11, 10, 12, P.yel);
  }, { w: 26, dx: 3 });

  mk('boar-eyes', 'boar with many eyes wild pig tusks bristles eyes along its side wrong animal forest', 30, 20, (g, r) => {
    const Bo = hex('#4a3e38'),
      D = dark(Bo),
      Sn = hex('#8a6a66');
    g.rect(8, 14, 9, 18, D);
    g.rect(19, 14, 20, 18, D);
    g.line(3, 9, 1, 11, Bo);
    for (let x = 5; x <= 21; x += 2) g.col(x, r ? 2 : 4, 5, x % 4 === 1 ? Bo : D); // bristles
    g.ball(3, 5, 23, 15, Bo);
    g.rect(5, 14, 7, 18, Bo);
    g.rect(17, 14, 19, 18, Bo);
    g.row(18, 5, 7, vd(Bo));
    g.row(18, 17, 19, vd(Bo));
    g.poly([[20, 6], [25, 8], [28, 12], [28, 14], [21, 15]], Bo);
    g.rect(28, 12, 28, 14, Sn);
    g.pts([[21, 5], [22, 4], [22, 5]], Bo);
    g.pts([[25, 13], [25, 12], [26, 11]], C.white);
    g.set(24, 10, r ? P.yel : K);
    for (const [x, y] of [[6, 8], [10, 7], [14, 8], [8, 11], [12, 11], [17, 10]]) {
      if (!r) g.row(y, x, x + 1, D);
      else {
        g.rect(x - 1, y - 1, x + 1, y, K);
        g.set(x, y - 1, P.yel);
        g.set(x - 1, y, P.yel);
      }
    }
    if (r) {
      g.rect(24, 14, 27, 15, P.maw);
      g.pts([[24, 14], [26, 14]], C.white);
    }
  });

  /* ================= vermin and small things ================= */
  mk('marsh-light', 'marsh light with a jaw will o the wisp ghost light floating flame teeth marsh green', 12, 22, (g, r) => {
    const Gl = hex('#8fc8b0'),
      Li = hex('#d8f0d8'),
      Dk = hex('#2c5a54');
    g.flame(5.5, 10, r ? 9 : 7, Gl, Gl, r ? 1 : -1);
    g.oval(2, 7, 9, 14, Gl);
    g.oval(4, 8, 7, 11, Li);
    if (!r) g.pts([[4, 10], [7, 10]], Dk);
    else {
      g.pts([[4, 8], [7, 8]], K);
      g.maw(3, 10, 8, 13, { t: C.white, in: hex('#12242a') });
      g.line(2, 15, 1, 17, Li); // little hands
      g.line(9, 15, 10, 17, Li);
    }
    g.ink(Dk);
    g.shadow(5, 20, 3);
    return false;
  });

  mk('toad-eyes', 'toad covered in eyes warty marsh toad many eyes small vermin', 16, 11, (g, r) => {
    const Td = hex('#5a6238'),
      Bl = hex('#b0aa7a');
    g.oval(1, 5, 5, 9, Td);
    g.ball(3, 3, 13, 9, Td);
    g.oval(9, 2, 14, 7, Td);
    g.oval(10, 6, 14, 9, Td);
    g.row(9, 5, 11, Bl);
    g.rect(11, 2, 12, 3, K);
    g.set(12, 3, P.yel);
    for (const [x, y] of [[4, 4], [6, 3], [8, 5], [5, 7], [8, 7]]) g.set(x, y, r ? P.eye : lite(Td));
    if (r) {
      for (const [x, y] of [[4, 5], [6, 4], [8, 6], [5, 8], [8, 8]]) g.set(x, y, K);
      g.maw(10, 6, 14, 8, { t: Bl });
    } else g.row(7, 11, 14, dark(Td));
  });

  mk('tick-swollen', 'swollen tick bloated blood sac face inside small vermin forest', 16, 13, (g, r) => {
    const Sa = hex('#8a8f96'),
      Hd = hex('#3a2a24');
    g.both(15, (v) => {
      v.path([[5, 8], [2, r ? 6 : 8], [1, 11]], Hd);
      v.path([[5, 9], [3, 9], [r ? 2 : 3, 11]], Hd);
      v.path([[6, 9], [5, 10], [5, 11]], Hd);
    });
    g.ball(3, 1, 12, 10, Sa);
    g.pts([[5, 3], [6, 2]], lite(Sa));
    g.rect(6, 9, 9, 11, Hd);
    if (r) {
      g.rect(5, 3, 6, 4, vd(Sa)); // a face presses against the skin from inside
      g.rect(9, 3, 10, 4, vd(Sa));
      g.rect(7, 6, 8, 8, vd(Sa));
      g.pts([[4, 2], [11, 2], [7, 5], [8, 5], [6, 7], [9, 7]], lite(Sa));
    }
  });

  mk('adder-knot', 'knot of adders snakes tangled many heads vipers moor small vermin', (g, r) => {
    const A = hex('#8a8258'),
      Z = hex('#2e2a22');
    g.tube([[2, 9], [15, 9]], 1.7, 1.7, A, vd(A)); // a heap of coils
    g.tube([[4, 6], [13, 6]], 1.7, 1.7, lite(A), dark(A));
    g.tube([[6, 3], [11, 3]], 1.7, 1.7, A, vd(A));
    for (const [x0, x1, y] of [[2, 15, 9], [4, 13, 6], [6, 11, 3]]) for (let x = x0; x <= x1; x += 2) g.set(x, y - ((x >> 1) % 2), Z); // the zigzag
    const head = (x, y, open) => {
      g.rect(x, y, x + 3, y + 1, A);
      g.set(x + 4, y + 1, A);
      g.set(x + 2, y, K);
      if (open) {
        g.rect(x + 2, y + 2, x + 4, y + 2, P.maw);
        g.row(y + 3, x + 1, x + 3, A);
        g.pts([[x + 4, y + 2]], C.white);
        g.set(x + 2, y, P.yel);
      }
    };
    if (!r) {
      head(12, 9, 0);
      g.pts([[17, 10], [18, 9]], C.blood);
    } else {
      g.worm([[5, 3], [2, -2], [4, -6]], 1.2, 1, A);
      g.worm([[9, 2], [11, -3], [9, -8]], 1.2, 1, lite(A), A);
      g.worm([[12, 5], [16, 1], [15, -3]], 1.2, 1, A);
      head(4, -8, 1);
      head(9, -10, 1);
      head(15, -5, 1);
    }
  });

  mk('antler-crawler', 'crawling deer skull on bone legs antlers small vermin forest skull spider', (g, r) => {
    const y0 = r ? 1 : 6,
      m = { b: B, K: r ? P.maw : K, D: vd(B) };
    if (r)
      for (const x of [6, 9, 12]) {
        g.path([[x + 1, y0 + 5], [x + 3, y0 + 8], [x + 3, 12]], dark(B));
        g.path([[x, y0 + 5], [x - 2, y0 + 8], [x - 1, 12]], B);
      }
    else g.pts([[5, 12], [8, 12], [11, 12], [13, 12]], dark(B));
    g.pat(3, y0, ['...bbbbb....', '.bbbbbbbbb..', 'bbbKKbbbbbbb', 'bbbKKbbbbbbb', '.bbbbbbbbbD.', '..bbbb.D.D.D'], m);
    if (r) {
      g.set(7, y0 + 3, P.yel);
      g.pat(9, y0 + 7, ['bbbbb', '.D.D.'], m); // the jaw drops
    }
    g.antler(6, y0, -1, 6, B, 2);
    g.antler(9, y0, 1, 6, B, 2);
  });

  mk('root-hand', 'root hand reaching out of the ground grasping roots fingers soil small forest', 14, 14, (g, r) => {
    const Bk = P.bark,
      D = P.barkD;
    if (!r) {
      g.ball(4, 4, 9, 10, Bk);
      g.col(6, 5, 7, D);
      g.col(8, 5, 7, D);
      g.row(8, 5, 8, D);
    } else {
      g.rect(5, 3, 8, 10, Bk);
      g.rect(4, -1, 9, 3, Bk);
      for (const [x, tx] of [[4, 2], [6, 5], [8, 8], [9, 11]]) g.line(x, -1, tx, -5, Bk);
      g.line(4, 2, 1, 0, Bk); // thumb
      g.pts([[5, 0], [7, 1], [6, 6], [7, 8]], D);
    }
    g.oval(2, 9, 11, 12, C.earth);
    g.pts([[4, 10], [8, 11], [10, 10]], dark(C.earth));
  }, { h: 20 });

  mk('moth-face', 'moth swarm that makes a face cloud of moths floating skull forest night small', 20, 20, (g, r) => {
    const M1 = hex('#9a8a6a'),
      M2 = hex('#6a5a46');
    const moth = (x, y, c) => g.pts([[x, y], [x + 2, y], [x + 1, y + 1]], c);
    if (!r) {
      [[1, 4], [7, 1], [14, 3], [4, 9], [10, 7], [16, 10], [1, 14], [9, 13]].forEach(([x, y], i) => {
        g.pts([[x, y], [x + 2, y], [x, y + 1], [x + 1, y + 1], [x + 2, y + 1]], i % 2 ? M1 : M2);
        g.set(x + 1, y + 2, dark(M2));
      });
    } else {
      g.oval(3, 2, 16, 14, M2);
      g.rect(6, 12, 13, 16, M2);
      for (let y = 2; y <= 16; y += 2) for (let x = 3 + (y % 4 ? 0 : 1); x <= 15; x += 3) if (g.get(x, y) && g.get(x + 2, y)) moth(x, y, M1);
      g.clearRect(5, 6, 8, 9);
      g.clearRect(11, 6, 14, 9);
      g.clearRect(9, 11, 10, 12);
      for (const x of [7, 9, 11, 13]) g.clearRect(x, 14, x, 16);
      moth(1, 4, M1);
      moth(16, 10, M1);
      moth(2, 13, M2);
    }
    g.ink(hex('#2a2420'));
    g.shadow(9, 18, 4);
    return false;
  });

  mk('fungus-head', 'fungus head rotten human head growing mushrooms crawling on threads small forest', 16, 13, (g, r) => {
    const S = hex('#9a9478'),
      Cp = hex('#a07e5a'),
      St = hex('#d2c8ac'),
      y0 = r ? 0 : 3;
    if (r) for (const [x, tx] of [[5, 2], [7, 6], [9, 10], [11, 14]]) g.line(x, y0 + 8, tx, 11, St);
    g.face(4, y0 + 1, 8, 8, S, r ? { eyes: 'wide', mouth: 'open' } : { eyes: 'shut', mouth: 'line' });
    g.col(6, y0 - 1, y0, St);
    g.row(y0 - 2, 5, 7, Cp);
    g.col(10, y0, y0, St);
    g.row(y0 - 1, 9, 12, Cp);
    g.pts([[3, y0 + 4], [2, y0 + 3], [1, y0 + 3]], Cp);
    g.pts([[12, y0 + 6], [13, y0 + 5]], Cp);
  }, { h: 16 });
};
