/* The washroom: the cleaner, the attendant, and people caught half-way through washing. */
module.exports = (kit, U) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, RED, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  const { P, C, sleeve, hand, trouser, shin } = U;
  const { heads, torsos, arms, legs, H, S, T, A, L } = U.lists();
  const TERRY = mix(WHITE, 0.95),
    YELLOW = hex('#b59a3c'), // rubber gloves
    ROSE = hex('#b07a78'),
    CAP = hex('#9fb7b9'), // a plastic shower cap
    CHECK = hex('#5f7f95'), // the cleaner's tabard
    JUMPER = hex('#7a6a5a'),
    CREAM = hex('#a9bca0'), // a face pack
    WET = hex('#c4b6a8'); // a wet shirt on skin

  /* ---------- heads ---------- */
  H('cleaner headscarf teal knotted on top brown', 'brown', 'calm', (c) => {
    const sc = CLOTH.teal;
    c.row(1, 4, 9, sc);
    c.row(2, 3, 10, sc);
    c.row(3, 3, 10, sc);
    P(c, sc, [
      [2, 3],
      [2, 4],
      [11, 3],
      [3, 4],
    ]);
    P(c, dark(sc), [
      [11, 4],
      [10, 4],
      [10, 3],
    ]);
    P(c, sc, [
      [5, 0],
      [8, 0],
    ]);
    P(c, dark(sc), [
      [6, 1],
      [7, 1],
    ]);
    P(c, lite(lite(sc)), [
      [4, 2],
      [6, 3],
      [8, 2],
      [9, 3],
    ]);
    c.set(4, 1, lite(sc));
    c.set(2, 7, GOLD);
  });
  H('attendant pillbox hat wine gold thin moustache black hair ashen', 'ashen', 'calm', (c) => {
    const h = HAIR.black,
      hat = CLOTH.wine;
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.set(3, 4, h);
    c.set(10, 4, dark(h));
    c.rect(4, 0, 8, 1, hat);
    c.row(1, 4, 8, GOLD);
    c.set(4, 0, lite(hat));
    c.set(8, 0, dark(hat));
    c.set(8, 1, mix(GOLD, 0.7));
    P(c, K, [
      [3, 5],
      [3, 6],
      [3, 7],
      [3, 8],
      [4, 9],
      [4, 10],
      [5, 11],
    ]);
    c.row(8, 5, 8, h);
  });
  H('towel turban white blue stripe fair', 'fair', 'calm', (c) => {
    const t = TERRY,
      st = CHECK;
    c.row(0, 6, 9, t);
    c.row(1, 4, 10, t);
    c.row(2, 3, 10, t);
    c.row(3, 3, 10, t);
    c.set(2, 3, t);
    c.set(11, 2, dark(t));
    P(c, dark(t), [
      [5, 1],
      [6, 2],
      [7, 3],
      [9, 1],
      [10, 2],
      [10, 3],
    ]);
    P(c, st, [
      [7, 0],
      [8, 1],
      [9, 2],
    ]);
    c.set(6, 0, lite(t));
    c.set(3, 4, HAIR.brown);
    c.set(3, 5, HAIR.brown);
    c.set(4, 8, C.tear);
  });
  H('man shaving foam razor cut brown hair fair', 'fair', 'calm', (c, s) => {
    HAIRS.parted(c, HAIR.brown);
    const f = WHITE;
    P(c, f, [
      [3, 8],
      [4, 8],
      [5, 8],
      [8, 8],
      [3, 9],
      [4, 9],
      [5, 9],
      [8, 9],
    ]);
    c.row(10, 4, 9, f);
    c.row(11, 5, 8, dark(f));
    c.set(9, 10, dark(f));
    P(c, f, [
      [2, 9],
      [3, 10],
    ]);
    /* the stripe the razor has cleared, and where it slipped */
    P(c, s, [
      [9, 8],
      [10, 8],
      [9, 9],
      [10, 9],
    ]);
    c.set(10, 9, dark(s));
    c.set(9, 9, RED);
    c.set(9, 10, mix(RED, 0.8));
  });
  H('plumber beanie pencil behind ear ginger stubble pale', 'pale', 'grin', (c) => {
    const hat = CLOTH.slate,
      h = HAIR.red;
    c.row(1, 5, 8, hat);
    c.row(2, 4, 9, hat);
    c.row(3, 3, 10, lite(hat));
    c.set(5, 1, lite(hat));
    c.set(10, 3, hat);
    P(c, h, [
      [3, 4],
      [3, 5],
      [10, 4],
    ]);
    P(c, mix(h, 1.1), [
      [3, 8],
      [3, 9],
      [4, 10],
      [5, 10],
      [8, 10],
      [5, 11],
      [6, 11],
      [7, 11],
      [8, 11],
      [9, 9],
    ]);
    P(c, CLOTH.mustard, [
      [11, 3],
      [11, 4],
      [11, 5],
    ]);
    c.set(11, 2, RED);
    c.set(11, 6, K);
  });
  H('wet hair plastered dripping black hair drowned', 'drowned', 'hollow', (c) => {
    const h = HAIR.black;
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.col(2, 4, 10, h);
    c.col(3, 4, 8, h);
    c.col(11, 4, 9, h);
    c.col(10, 4, 6, h);
    P(c, h, [
      [4, 4],
      [4, 5],
      [6, 4],
      [9, 4],
      [9, 5],
    ]);
    P(c, lite(lite(h)), [
      [5, 2],
      [2, 6],
      [11, 5],
      [6, 3],
    ]);
    P(c, C.tear, [
      [2, 11],
      [11, 10],
      [6, 5],
      [4, 7],
    ]);
  });
  H('old lady plastic shower cap dotted fair', 'fair', 'calm', (c, s) => {
    const p = CAP;
    c.row(0, 5, 8, p);
    c.row(1, 3, 10, p);
    c.row(2, 2, 11, p);
    c.row(3, 2, 11, p);
    c.row(4, 3, 10, dark(p));
    P(c, p, [
      [2, 4],
      [11, 4],
    ]);
    P(c, WHITE, [
      [4, 1],
      [7, 1],
      [3, 3],
      [6, 3],
      [9, 2],
      [10, 3],
      [5, 2],
    ]);
    P(c, dark(p), [
      [11, 2],
      [11, 3],
      [10, 1],
      [8, 2],
    ]);
    P(c, dark(s), [
      [4, 8],
      [9, 8],
    ]);
    c.set(3, 5, HAIR.grey);
  });
  H('woman curlers face pack green cream brown hair pale', 'pale', 'calm', (c) => {
    const h = HAIR.brown,
      r = ROSE;
    for (let y = 4; y <= 11; y++)
      for (let x = 3; x <= 10; x++) {
        if (!c.get(x, y)) continue;
        const eye = (y === 5 || y === 6) && (x === 4 || x === 5 || x === 8 || x === 9);
        const mouth = (y === 9 || y === 10) && x >= 5 && x <= 8;
        if (!eye && !mouth) c.set(x, y, x === 10 ? dark(CREAM) : CREAM);
      }
    c.set(7, 7, dark(CREAM));
    c.row(3, 3, 10, h);
    c.row(2, 4, 9, h);
    c.rect(3, 1, 5, 2, r);
    c.rect(6, 0, 8, 1, r);
    c.rect(9, 1, 11, 2, r);
    P(c, dark(r), [
      [4, 1],
      [4, 2],
      [7, 0],
      [7, 1],
      [10, 1],
      [10, 2],
      [11, 2],
    ]);
    c.set(3, 1, lite(r));
    c.set(2, 3, r);
    c.set(2, 4, dark(r));
    c.set(11, 4, dark(r));
  });
  H('child brushing teeth toothbrush foam blond pigtails tan', 'tan', 'calm', (c) => {
    HAIRS.pigtails(c, HAIR.blond);
    P(c, RED, [
      [2, 5],
      [11, 5],
    ]);
    P(c, WHITE, [
      [6, 9],
      [7, 9],
      [6, 10],
      [5, 9],
    ]);
    c.row(9, 8, 12, CLOTH.teal);
    c.set(8, 9, WHITE);
    c.set(12, 9, dark(CLOTH.teal));
  });
  S('thing from the drain clump of wet hair one eye', (c) => {
    const h = HAIR.black,
      l = hex('#3a3444'),
      sl = hex('#5a6e3a');
    c.row(2, 5, 9, h);
    c.row(3, 4, 10, h);
    c.rect(3, 4, 10, 9, h);
    c.row(10, 3, 9, h);
    c.set(2, 6, h);
    c.set(2, 7, h);
    c.set(11, 5, h);
    for (const [x, y0, y1] of [
      [3, 11, 12],
      [5, 11, 12],
      [6, 11, 11],
      [8, 11, 12],
      [10, 10, 11],
      [2, 8, 9],
      [11, 6, 8],
    ])
      c.col(x, y0, y1, h);
    P(c, l, [
      [5, 3],
      [4, 4],
      [4, 5],
      [3, 6],
      [8, 3],
      [9, 4],
      [10, 6],
      [4, 9],
      [5, 10],
      [5, 11],
      [9, 9],
      [8, 10],
      [8, 11],
      [7, 8],
    ]);
    c.rect(6, 5, 7, 6, WHITE);
    c.set(7, 6, K);
    c.set(6, 5, hex('#c9a9a0'));
    c.set(5, 6, hex('#5a1f1f'));
    P(c, sl, [
      [3, 8],
      [9, 7],
      [6, 12],
      [10, 12],
    ]);
    P(c, C.tear, [
      [3, 12],
      [8, 12],
    ]);
    c.set(4, 9, K);
    c.set(4, 10, K);
  });

  /* ---------- torsos ---------- */
  const bathrobe = (col, skin, striped) => (c) => {
    body(c, col, true);
    if (striped) for (const x of [2, 4, 7, 9]) c.col(x, 2, 9, dark(col));
    P(c, skin, [
      [5, 1],
      [6, 1],
      [5, 2],
      [6, 2],
      [5, 3],
    ]);
    const cl = striped ? lite(col) : mix(col, 0.86);
    P(c, cl, [
      [4, 1],
      [4, 2],
      [4, 3],
      [5, 4],
      [6, 5],
      [7, 1],
      [7, 2],
      [6, 3],
      [6, 4],
      [3, 1],
      [8, 1],
    ]);
    c.row(6, 1, 10, striped ? dark(dark(col)) : mix(col, 0.72));
    P(c, striped ? lite(col) : col, [
      [5, 6],
      [6, 6],
    ]);
    c.col(4, 7, 8, striped ? dark(dark(col)) : mix(col, 0.72));
    c.col(10, 7, 9, dark(col));
    c.set(8, 8, cl);
    c.set(1, 1, lite(col));
  };
  T('bathrobe white terry belt', bathrobe(TERRY, SKINS.fair));
  T('bathrobe wine striped belt', bathrobe(CLOTH.wine, SKINS.pale, true));
  const towelWrap = (skin, tw, stripe) => (c) => {
    c.row(1, 1, 10, skin);
    c.rect(2, 2, 9, 3, skin);
    c.set(1, 1, lite(skin));
    c.set(9, 2, dark(skin));
    c.set(9, 3, dark(skin));
    P(c, dark(skin), [
      [3, 2],
      [4, 2],
      [7, 2],
      [8, 2],
    ]);
    c.rect(2, 4, 9, 9, tw);
    c.col(9, 4, 9, dark(tw));
    c.row(4, 2, 9, lite(tw));
    P(c, dark(tw), [
      [3, 5],
      [4, 6],
      [4, 7],
      [3, 4],
      [5, 8],
      [5, 9],
    ]);
    c.row(8, 6, 9, stripe);
    c.row(8, 2, 4, stripe);
    P(c, C.tear, [
      [3, 3],
      [8, 1],
    ]);
  };
  T('towel wrap cream bare shoulders fair', towelWrap(SKINS.fair, CLOTH.cream, CHECK));
  T('towel wrap blue grey bare shoulders brown', towelWrap(SKINS.brown, hex('#8a9aa8'), WHITE));
  T("cleaner's tabard blue check pocket duster", (c) => {
    body(c, JUMPER);
    c.rect(2, 1, 9, 9, CHECK);
    for (let y = 2; y <= 9; y++) for (let x = 2; x <= 9; x++) if ((x + y) % 2 === 0) c.set(x, y, lite(CHECK));
    c.col(9, 1, 9, dark(CHECK));
    c.row(1, 4, 7, JUMPER);
    P(c, JUMPER, [
      [5, 2],
      [6, 2],
    ]);
    c.set(4, 1, dark(JUMPER));
    c.rect(4, 6, 7, 8, dark(CHECK));
    c.rect(4, 7, 7, 8, CHECK);
    P(c, YELLOW, [
      [6, 5],
      [7, 5],
      [7, 4],
      [6, 6],
    ]);
    P(c, WHITE, [
      [1, 6],
      [10, 6],
    ]);
  });
  T("attendant's jacket wine gold buttons epaulettes", (c) => {
    const col = CLOTH.wine;
    body(c, col);
    c.row(1, 4, 7, K);
    P(c, GOLD, [
      [5, 1],
      [6, 1],
    ]);
    c.row(1, 1, 2, GOLD);
    c.row(1, 9, 10, mix(GOLD, 0.8));
    for (const y of [3, 5, 7]) {
      c.set(4, y, GOLD);
      c.set(7, y, GOLD);
    }
    c.col(5, 2, 9, dark(col));
    c.row(9, 2, 9, dark(col));
    c.set(2, 4, WHITE);
    c.set(3, 4, WHITE);
    c.set(2, 2, lite(col));
  });
  T('wet white shirt clinging soaked', (c) => {
    const w = mix(WHITE, 0.96);
    body(c, w);
    P(c, SKINS.fair, [
      [5, 1],
      [6, 1],
    ]);
    P(c, dark(w), [
      [4, 1],
      [7, 1],
    ]);
    P(c, WET, [
      [3, 2],
      [4, 2],
      [3, 3],
      [4, 3],
      [5, 3],
      [7, 3],
      [8, 3],
      [7, 4],
      [8, 4],
      [4, 4],
      [3, 6],
      [4, 7],
      [5, 6],
      [7, 7],
      [8, 8],
      [6, 8],
    ]);
    c.col(6, 2, 9, dark(w));
    P(c, C.iron, [
      [6, 4],
      [6, 6],
    ]);
    P(c, C.tear, [
      [2, 5],
      [8, 6],
      [5, 9],
      [3, 9],
    ]);
    P(c, dark(WET), [
      [4, 4],
      [8, 4],
    ]);
  });
  T('white singlet towel over shoulder fair', (c) => {
    const s = SKINS.fair,
      tw = hex('#8a9aa8');
    body(c, s);
    c.rect(3, 2, 8, 9, WHITE);
    c.rect(2, 4, 9, 9, WHITE);
    P(c, WHITE, [
      [3, 1],
      [8, 1],
    ]);
    c.col(9, 4, 9, dark(WHITE));
    c.row(2, 4, 7, s);
    c.row(3, 5, 6, s);
    c.set(5, 3, dark(s));
    c.row(9, 2, 9, CLOTH.slate);
    c.set(5, 9, C.brass);
    c.rect(1, 1, 3, 5, tw);
    c.row(4, 1, 3, WHITE);
    c.row(5, 1, 3, dark(tw));
    c.set(1, 1, lite(tw));
    c.set(3, 2, dark(tw));
    c.set(3, 3, dark(tw));
    c.set(6, 6, mix(WHITE, 0.85));
  });

  /* ---------- arms ---------- */
  const rubberGlove = (sl, skin, g) => (c) => {
    sleeve(c, sl, 2);
    c.row(2, 1, 3, lite(sl));
    hand(c, skin, 3);
    c.rect(1, 5, 3, 10, g);
    c.row(5, 0, 4, lite(g));
    c.set(4, 5, g);
    c.col(3, 6, 10, dark(g));
    c.set(1, 7, lite(g));
    P(c, WHITE, [
      [2, 9],
      [1, 10],
    ]);
  };
  A('rubber gloves yellow rolled sleeve brown arm', rubberGlove(JUMPER, SKINS.brown, YELLOW));
  A('rubber gloves pink rolled sleeve fair arm', rubberGlove(CHECK, SKINS.fair, ROSE));
  A('bathrobe white wide sleeve fair hand', (c) => {
    c.rect(1, 0, 3, 5, TERRY);
    c.rect(0, 6, 4, 8, TERRY);
    c.col(3, 0, 5, dark(TERRY));
    c.col(4, 6, 8, dark(TERRY));
    c.row(8, 0, 4, mix(TERRY, 0.8));
    c.set(1, 0, lite(TERRY));
    c.set(2, 3, mix(TERRY, 0.86));
    hand(c, SKINS.fair);
  });
  A('bare wet arm soap foam dripping fair', (c) => {
    const s = SKINS.fair;
    hand(c, s, 0);
    c.set(1, 0, lite(s));
    P(c, WHITE, [
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 7],
      [2, 8],
      [2, 7],
    ]);
    P(c, C.tear, [
      [2, 1],
      [1, 6],
      [2, 11],
    ]);
  });
  A('attendant wine sleeve gold braid white glove', (c) => {
    sleeve(c, CLOTH.wine, 7);
    c.row(6, 1, 3, GOLD);
    c.set(2, 5, GOLD);
    c.rect(1, 8, 3, 10, WHITE);
    c.col(3, 8, 10, dark(WHITE));
    c.set(2, 8, dark(WHITE));
    c.rect(0, 0, 4, 0, GOLD);
  });

  /* ---------- legs ---------- */
  L('towel hem bare legs flip-flops fair', (c) => {
    const s = SKINS.fair,
      ff = CLOTH.teal;
    shin(c, s, 0);
    c.rect(0, 0, 5, 2, CLOTH.cream);
    c.row(2, 0, 5, CHECK);
    c.col(5, 0, 1, dark(CLOTH.cream));
    c.rect(1, 10, 4, 10, s);
    c.row(11, 1, 5, ff);
    c.set(5, 11, dark(ff));
    c.set(3, 10, ff);
    c.set(2, 5, C.tear);
  });
  L('bathrobe hem white fluffy pink slippers fair', (c) => {
    const s = SKINS.fair;
    c.rect(0, 0, 5, 5, TERRY);
    c.col(5, 0, 5, dark(TERRY));
    c.row(5, 0, 5, mix(TERRY, 0.8));
    c.col(2, 1, 4, mix(TERRY, 0.86));
    shin(c, s, 6);
    shoe(c, ROSE);
    c.row(10, 2, 4, lite(ROSE));
    c.set(4, 10, WHITE);
  });
  L('cleaner tabard hem thick brown stockings flat shoes', (c) => {
    const st = hex('#8a6a50');
    c.rect(0, 0, 5, 3, CHECK);
    for (let y = 0; y <= 2; y++) for (let x = 0; x <= 5; x++) if ((x + y) % 2 === 0) c.set(x, y, lite(CHECK));
    c.row(3, 0, 5, JUMPER);
    c.col(5, 0, 3, dark(CHECK));
    c.rect(2, 4, 3, 9, st);
    c.col(3, 4, 9, dark(st));
    P(c, dark(st), [
      [2, 6],
      [2, 8],
    ]);
    shoe(c, CLOTH.black);
    c.clear(1, 10);
    c.clear(1, 11);
  });
  L('attendant black trousers gold stripe polished shoes', (c) => {
    trouser(c, CLOTH.black);
    c.col(4, 0, 9, mix(GOLD, 0.8));
    c.col(3, 0, 9, dark(CLOTH.black));
    shoe(c, K);
    c.row(10, 1, 4, hex('#2a2830'));
    c.set(3, 10, WHITE);
  });
  return { heads, torsos, arms, legs };
};
