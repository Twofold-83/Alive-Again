/* The attic: forgotten things under dust sheets, and the people who were put away with them. */
module.exports = (kit, U) => {
  const { SKINS, HAIR, CLOTH, K, WHITE, BONE, RED, GOLD, hex, mix, dark, lite, face, body, shoe } = kit;
  const { P, C, sleeve, hand, trouser, shin, foot } = U;
  const { heads, torsos, arms, legs, H, S, T, A, L } = U.lists();
  const LINEN = mix(WHITE, 0.94),
    WEB = hex('#cfd0c8'),
    CLOTHHEAD = hex('#b5a583'), // the stuffed cloth of a dummy
    SHEET = hex('#b9b29a'),
    FADED = hex('#7a3a34'), // a red coat after sixty years in a trunk
    HOLE = hex('#2a2026'),
    GREYLACE = hex('#b0ada1'),
    BEAR = hex('#8a6a44'),
    PORC = C.porcelain,
    ROSE = hex('#c98a8a');

  /* ---------- heads ---------- */
  H('old woman mob cap frill white hair dusty fair', 'fair', 'calm', (c, s) => {
    const h = HAIR.white,
      rib = hex('#6a7a8a');
    c.row(0, 5, 8, LINEN);
    c.row(1, 3, 10, LINEN);
    c.row(2, 2, 11, LINEN);
    c.row(3, 3, 10, rib);
    P(c, LINEN, [[2, 3], [11, 3], [2, 4], [11, 4], [1, 3], [12, 3]]);
    P(c, dark(LINEN), [[5, 1], [8, 2], [10, 1], [3, 2], [12, 3], [11, 4]]);
    P(c, h, [[3, 4], [3, 5], [10, 4]]);
    c.set(10, 5, dark(h));
    P(c, dark(s), [[4, 8], [9, 8], [5, 4], [8, 4]]);
    c.set(6, 0, C.dust);
  });
  H('child night cap blue pompom brown hair fair', 'fair', 'scared', (c) => {
    const cap = hex('#8a9aa8'),
      h = HAIR.brown;
    c.row(3, 3, 10, WHITE);
    c.row(2, 4, 10, cap);
    c.row(1, 6, 11, cap);
    c.row(0, 9, 12, cap);
    c.col(12, 1, 3, cap);
    c.set(12, 2, dark(cap));
    c.rect(12, 4, 13, 5, CLOTH.wine);
    P(c, dark(cap), [[5, 2], [8, 1], [8, 2], [11, 0], [11, 1]]);
    c.set(4, 2, lite(cap));
    P(c, h, [[3, 4], [4, 4], [10, 4]]);
  });
  S('mannequin head moth-eaten cloth stuffing', (c) => {
    const m = CLOTHHEAD;
    c.row(1, 5, 8, m);
    c.row(2, 4, 9, m);
    c.rect(3, 3, 10, 8, m);
    c.row(9, 4, 9, m);
    c.row(10, 5, 8, m);
    c.rect(6, 11, 7, 12, C.wood);
    c.set(7, 11, dark(C.wood));
    c.set(7, 12, dark(C.wood));
    c.col(10, 3, 8, dark(m));
    c.set(9, 9, dark(m));
    c.set(4, 2, lite(m));
    c.set(3, 3, lite(m));
    c.col(6, 1, 10, mix(m, 0.86));
    P(c, mix(m, 0.8), [[4, 6], [5, 6], [8, 6], [9, 6]]);
    P(c, HOLE, [[8, 3], [8, 4], [9, 4], [4, 8], [4, 9]]);
    P(c, WHITE, [[9, 3], [3, 8]]);
  });
  S('porcelain doll head cracked bald one eye missing', (c) => {
    face(c, PORC);
    c.row(2, 5, 8, PORC);
    c.set(5, 2, lite(PORC));
    /* the piece that broke out, and the crack that runs from it */
    P(c, HOLE, [[3, 4], [4, 3], [4, 4], [5, 3], [3, 5]]);
    P(c, K, [[5, 4], [6, 5], [6, 6], [6, 7], [5, 8]]);
    c.rect(8, 5, 9, 6, K);
    c.set(4, 6, hex('#4d7a8a'));
    c.set(5, 6, K);
    c.set(4, 5, K);
    c.set(5, 5, K);
    P(c, ROSE, [[4, 8], [9, 8]]);
    c.row(9, 6, 7, RED);
    P(c, HAIR.blond, [[10, 2], [11, 3], [11, 4], [11, 5], [9, 2], [10, 3]]);
    c.set(11, 6, dark(HAIR.blond));
  });
  H('cobwebbed man grey hair webs spider ashen', 'ashen', 'hollow', (c) => {
    const h = HAIR.grey;
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.set(3, 4, h);
    c.set(10, 4, dark(h));
    P(c, WEB, [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [3, 1], [1, 3], [5, 2], [2, 5], [4, 2], [2, 4]]);
    P(c, WEB, [[10, 8], [9, 9], [8, 10], [10, 10]]);
    /* the spider that made them */
    P(c, K, [[8, 2], [7, 1], [9, 1], [7, 3], [9, 3]]);
    c.set(8, 2, hex('#3a2c22'));
  });
  S('someone under a dust sheet eye holes yellowed', (c) => {
    const w = SHEET;
    c.row(1, 5, 8, w);
    c.row(2, 4, 9, w);
    c.rect(3, 3, 10, 12, w);
    c.col(2, 5, 12, w);
    c.col(11, 5, 12, dark(w));
    c.col(10, 3, 4, dark(w));
    c.set(5, 1, lite(w));
    c.set(4, 2, lite(w));
    c.col(4, 9, 12, dark(w));
    c.col(8, 10, 12, dark(w));
    c.rect(4, 5, 5, 6, K);
    c.set(5, 6, WHITE);
    c.rect(8, 6, 9, 7, K);
    c.set(8, 6, WHITE);
    c.rect(6, 9, 7, 10, mix(w, 0.86));
    P(c, K, [[5, 9], [8, 10]]);
    c.clear(3, 12);
    c.clear(6, 12);
    c.clear(9, 12);
    c.clear(2, 11);
    c.clear(2, 12);
  });
  H('girl ringlets big bow black hair old-fashioned ashen', 'ashen', 'hollow', (c) => {
    const h = HAIR.black,
      b = CLOTH.wine;
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.set(3, 4, h);
    c.set(10, 4, h);
    for (let y = 4; y <= 10; y++) {
      c.set(2, y, h);
      c.set(11, y, h);
      if (y % 2) {
        c.set(1, y, h);
        c.set(12, y, dark(h));
      }
    }
    c.set(2, 4, lite(lite(h)));
    c.set(2, 8, lite(lite(h)));
    c.rect(3, 0, 5, 1, b);
    c.rect(8, 0, 10, 1, b);
    c.rect(6, 1, 7, 1, dark(b));
    c.set(3, 0, lite(b));
    c.set(10, 1, dark(b));
    c.set(5, 1, dark(b));
  });
  H('old soldier forage cap moth-eaten white moustache brown', 'brown', 'calm', (c) => {
    const h = HAIR.white;
    c.rect(4, 1, 9, 2, FADED);
    c.set(4, 1, lite(FADED));
    c.col(9, 1, 2, dark(FADED));
    c.row(3, 3, 10, mix(GOLD, 0.8));
    c.set(10, 3, mix(GOLD, 0.55));
    P(c, HOLE, [[6, 1], [8, 2]]);
    P(c, h, [[3, 4], [3, 5], [10, 4]]);
    c.set(10, 5, dark(h));
    c.row(8, 4, 9, h);
    P(c, h, [[3, 9], [4, 9], [9, 9], [10, 9], [3, 10]]);
    c.set(10, 10, dark(h));
  });
  H('jilted bride grey veil withered flowers white hair pale', 'pale', 'weeping', (c) => {
    const v = GREYLACE,
      h = HAIR.white;
    c.row(1, 4, 9, v);
    c.row(2, 3, 10, v);
    c.row(3, 2, 11, h);
    c.col(2, 4, 12, v);
    c.col(1, 6, 12, v);
    c.col(11, 4, 12, dark(v));
    c.col(12, 6, 12, dark(v));
    P(c, dark(v), [[1, 8], [2, 10], [1, 11], [5, 1], [8, 2]]);
    c.clear(1, 12);
    c.clear(12, 10);
    c.clear(12, 12);
    P(c, hex('#84482a'), [[4, 3], [8, 3]]);
    P(c, hex('#7a6a4a'), [[6, 3], [10, 3]]);
    P(c, C.olive, [[5, 3], [9, 3], [3, 3]]);
    c.set(3, 4, h);
    c.set(10, 4, dark(h));
  });
  S('teddy bear head old worn one eye missing', (c) => {
    const f = BEAR;
    c.rect(2, 1, 3, 2, f);
    c.rect(10, 1, 11, 2, f);
    c.set(3, 2, dark(f));
    c.set(10, 2, dark(f));
    c.row(2, 4, 9, f);
    c.rect(3, 3, 10, 9, f);
    c.row(10, 4, 9, f);
    c.row(11, 5, 8, dark(f));
    c.col(10, 3, 9, dark(f));
    c.set(4, 2, lite(f));
    c.set(3, 3, lite(f));
    c.set(2, 1, lite(f));
    c.rect(5, 7, 8, 8, hex('#c2b08a'));
    c.rect(6, 7, 7, 7, K);
    c.row(9, 6, 7, K);
    c.rect(4, 5, 5, 6, K);
    c.set(4, 5, hex('#5a5a66'));
    P(c, dark(dark(f)), [[8, 5], [9, 6], [9, 5], [8, 6]]);
    c.set(9, 7, WHITE);
    P(c, WHITE, [[11, 1], [12, 0]]);
    c.rect(3, 8, 4, 9, hex('#6a7a8a'));
    c.set(8, 3, dark(f));
    c.set(6, 4, dark(f));
  });
  H('old man smoking cap tassel side whiskers white tan', 'tan', 'angry', (c) => {
    const cap = CLOTH.plum,
      h = HAIR.white;
    c.rect(4, 1, 9, 2, cap);
    c.row(3, 3, 10, dark(cap));
    c.set(4, 1, lite(cap));
    P(c, GOLD, [[5, 3], [7, 3], [9, 3], [10, 1], [11, 2], [11, 3]]);
    c.set(11, 4, mix(GOLD, 0.7));
    P(c, h, [[2, 5], [2, 6], [2, 7], [3, 6], [3, 7], [3, 8], [2, 8], [3, 9], [4, 10]]);
    P(c, h, [[11, 6], [11, 7], [10, 6], [10, 7], [10, 8], [11, 8], [10, 9], [9, 10]]);
    P(c, dark(h), [[11, 8], [10, 9], [11, 7]]);
  });

  /* ---------- torsos ---------- */
  T('nightshirt white long frill collar buttons', (c) => {
    body(c, LINEN, true);
    c.row(1, 4, 7, WHITE);
    P(c, dark(LINEN), [[4, 2], [7, 2], [5, 1]]);
    c.col(5, 2, 6, dark(LINEN));
    P(c, mix(BONE, 0.75), [[6, 3], [6, 5]]);
    c.col(3, 6, 9, dark(LINEN));
    c.col(8, 5, 9, dark(LINEN));
    c.col(10, 6, 9, dark(LINEN));
    c.set(4, 8, C.dust);
  });
  T('uniform red coat moth-eaten gold braid', (c) => {
    const g = mix(GOLD, 0.85);
    body(c, FADED);
    c.row(1, 4, 7, CLOTH.navy);
    P(c, g, [[5, 1], [6, 1]]);
    c.row(1, 1, 2, g);
    c.row(1, 9, 10, g);
    for (const y of [3, 5, 7]) {
      c.row(y, 4, 7, g);
      c.set(5, y, lite(g));
    }
    c.row(9, 2, 9, dark(FADED));
    P(c, HOLE, [[3, 4], [8, 6], [3, 8], [8, 2], [6, 7]]);
    c.set(2, 6, C.dust);
  });
  T('wedding dress gone grey lace withered corsage', (c) => {
    const g = GREYLACE,
      s = SKINS.pale;
    body(c, g, true);
    c.row(1, 4, 7, s);
    c.row(2, 5, 6, s);
    c.clear(2, 5);
    c.clear(9, 5);
    c.row(6, 2, 9, dark(g));
    for (const [x, y] of [[3, 2], [8, 2], [4, 3], [7, 3], [3, 4], [5, 4], [8, 4], [6, 5], [4, 5]]) c.set(x, y, lite(g));
    P(c, hex('#84482a'), [[3, 3]]);
    P(c, C.olive, [[2, 3], [3, 4]]);
    c.col(4, 7, 9, dark(g));
    c.col(7, 7, 9, dark(g));
    c.col(10, 7, 9, dark(g));
    P(c, mix(g, 0.8), [[2, 8], [6, 9], [8, 8]]);
    c.set(1, 1, lite(g));
  });
  T('child nightgown cream smocked ribbon bow', (c) => {
    const col = CLOTH.cream,
      rb = hex('#6a7a8a');
    body(c, col, true);
    for (let x = 3; x <= 8; x++) c.set(x, 2 + (x % 2), dark(col));
    c.row(1, 4, 7, rb);
    c.rect(5, 1, 6, 1, dark(rb));
    P(c, rb, [[5, 2], [6, 2], [4, 3], [7, 3]]);
    c.row(9, 1, 10, lite(col));
    c.col(5, 5, 8, dark(col));
    c.col(10, 6, 8, dark(col));
    c.set(3, 7, C.dust);
  });
  T('black dress crochet shawl cameo brooch old lady', (c) => {
    const sh = hex('#6e6072');
    body(c, CLOTH.black);
    c.row(1, 1, 10, sh);
    c.row(2, 1, 10, sh);
    c.row(3, 2, 9, sh);
    c.row(4, 3, 8, sh);
    c.row(5, 4, 7, sh);
    c.row(6, 5, 6, sh);
    for (const [x, y] of [[2, 2], [4, 2], [7, 2], [9, 2], [3, 3], [8, 3], [4, 4], [7, 4], [5, 5]]) c.set(x, y, dark(sh));
    c.rect(5, 2, 6, 3, hex('#84482a'));
    c.set(5, 2, CLOTH.cream);
    c.set(6, 3, CLOTH.cream);
    P(c, sh, [[2, 4], [3, 5], [9, 4], [8, 5], [5, 7], [6, 7]]);
    c.set(1, 1, lite(sh));
    c.col(5, 8, 9, lite(CLOTH.black));
  });
  T("dressmaker's dummy cloth seams pins", (c) => {
    const m = CLOTHHEAD;
    body(c, m);
    c.clear(2, 5);
    c.clear(9, 5);
    c.clear(2, 6);
    c.clear(9, 6);
    c.clear(1, 1);
    c.clear(10, 1);
    c.col(5, 1, 8, mix(m, 0.8));
    c.col(9, 2, 4, dark(m));
    c.col(8, 5, 6, dark(m));
    c.col(9, 7, 8, dark(m));
    c.row(9, 2, 9, C.wood);
    c.set(9, 9, dark(C.wood));
    P(c, RED, [[7, 2], [3, 4]]);
    P(c, C.steel, [[7, 3], [3, 5]]);
    P(c, HOLE, [[7, 6], [7, 7]]);
    c.set(8, 7, WHITE);
  });
  T('sailor suit child navy collar red knot dusty', (c) => {
    const w = CLOTH.cream,
      n = CLOTH.navy;
    body(c, w);
    P(c, n, [[1, 1], [2, 1], [3, 1], [4, 1], [2, 2], [3, 2], [4, 2], [3, 3], [4, 3], [5, 3], [4, 4], [5, 4]]);
    P(c, n, [[10, 1], [9, 1], [8, 1], [7, 1], [9, 2], [8, 2], [7, 2], [8, 3], [7, 3], [6, 3], [7, 4], [6, 4]]);
    P(c, WHITE, [[2, 2], [3, 3], [4, 4], [9, 2], [8, 3], [7, 4]]);
    P(c, SKINS.fair, [[5, 1], [6, 1]]);
    P(c, WHITE, [[5, 2], [6, 2]]);
    c.rect(5, 5, 6, 6, FADED);
    c.set(5, 7, dark(FADED));
    c.row(9, 2, 9, dark(w));
    P(c, C.dust, [[3, 7], [8, 6]]);
  });
  T('dust sheet draped body yellowed folds', (c) => {
    const w = SHEET;
    c.rect(1, 1, 10, 9, w);
    c.row(10, 1, 10, w);
    c.set(1, 1, lite(w));
    c.col(10, 1, 10, dark(w));
    c.col(3, 4, 10, dark(w));
    c.col(7, 3, 10, dark(w));
    c.col(5, 7, 10, mix(w, 0.86));
    c.rect(8, 5, 9, 6, mix(w, 0.86));
    c.set(8, 7, K);
    c.clear(2, 10);
    c.clear(6, 10);
    c.clear(9, 10);
  });

  /* ---------- arms ---------- */
  A('nightshirt white sleeve frilled cuff fair hand', (c) => {
    sleeve(c, LINEN, 7);
    c.row(8, 0, 4, WHITE);
    c.set(4, 8, dark(WHITE));
    c.set(2, 8, dark(LINEN));
    c.set(2, 4, dark(LINEN));
    hand(c, SKINS.fair);
  });
  A('uniform red sleeve gold cuff moth-eaten brown hand', (c) => {
    sleeve(c, FADED, 8);
    c.rect(1, 6, 3, 8, CLOTH.navy);
    c.row(6, 1, 3, mix(GOLD, 0.85));
    c.set(2, 7, mix(GOLD, 0.85));
    c.rect(0, 0, 4, 0, mix(GOLD, 0.85));
    c.set(2, 3, HOLE);
    c.set(1, 4, HOLE);
    hand(c, SKINS.brown);
  });
  A('wedding grey lace sleeve puffed pale hand', (c) => {
    const g = GREYLACE,
      s = SKINS.pale;
    c.rect(0, 0, 4, 2, g);
    c.col(4, 0, 2, dark(g));
    c.set(0, 0, lite(g));
    c.rect(1, 3, 3, 8, s);
    for (let y = 3; y <= 7; y++) for (let x = 1; x <= 3; x++) if ((x + y) % 2) c.set(x, y, g);
    c.row(8, 1, 3, dark(g));
    c.set(0, 8, g);
    hand(c, s);
  });
  A('doll arm jointed porcelain', (c) => {
    const p = PORC;
    c.rect(1, 0, 3, 4, p);
    c.rect(1, 6, 3, 10, p);
    c.col(3, 0, 4, dark(p));
    c.col(3, 6, 10, dark(p));
    c.set(2, 5, mix(p, 0.6));
    c.set(1, 0, lite(p));
    c.row(8, 1, 3, mix(p, 0.6));
    c.set(2, 8, p);
    c.set(1, 2, K);
    c.set(2, 3, K);
  });

  /* ---------- legs ---------- */
  L('nightshirt hem white bare feet fair', (c) => {
    const s = SKINS.fair;
    c.rect(0, 0, 5, 6, LINEN);
    c.col(5, 0, 6, dark(LINEN));
    c.col(2, 2, 6, dark(LINEN));
    c.row(6, 0, 5, WHITE);
    c.set(5, 6, dark(WHITE));
    shin(c, s, 7);
    foot(c, s);
  });
  L('uniform navy trousers red stripe dusty boots', (c) => {
    trouser(c, CLOTH.navy);
    c.col(4, 0, 9, FADED);
    c.set(2, 5, HOLE);
    shoe(c, CLOTH.black);
    c.row(9, 1, 4, CLOTH.black);
    P(c, C.dust, [[2, 10], [4, 10]]);
  });
  L('wedding skirt long grey lace hem', (c) => {
    const g = GREYLACE;
    c.rect(0, 0, 5, 11, g);
    c.col(5, 0, 11, dark(g));
    c.col(2, 1, 9, dark(g));
    for (let x = 0; x <= 5; x++) c.set(x, 10 + (x % 2), lite(g));
    c.row(9, 0, 5, mix(g, 0.86));
    P(c, mix(g, 0.7), [[3, 6], [4, 7], [1, 4]]);
  });
  L('doll leg jointed porcelain white sock black shoe bloomers', (c) => {
    const p = PORC;
    c.rect(0, 0, 5, 2, WHITE);
    c.row(2, 0, 5, dark(WHITE));
    c.col(5, 0, 1, dark(WHITE));
    c.rect(2, 3, 3, 7, p);
    c.col(3, 3, 7, dark(p));
    c.row(5, 2, 3, K);
    c.rect(2, 8, 3, 9, WHITE);
    shoe(c, K);
    c.clear(1, 10);
    c.clear(1, 11);
    c.row(10, 2, 4, hex('#2a2830'));
    c.set(3, 10, WHITE);
  });
  L('long black skirt button boots old lady dusty', (c) => {
    const b = CLOTH.black;
    c.rect(0, 0, 5, 8, b);
    c.col(5, 0, 8, dark(b));
    c.col(2, 2, 8, lite(b));
    c.row(8, 0, 5, lite(lite(b)));
    P(c, C.dust, [[1, 7], [4, 8]]);
    c.rect(2, 9, 3, 9, C.leather);
    shoe(c, C.leather);
    c.clear(1, 10);
    c.clear(1, 11);
    P(c, BONE, [[2, 9], [2, 10]]);
  });
  return { heads, torsos, arms, legs };
};
