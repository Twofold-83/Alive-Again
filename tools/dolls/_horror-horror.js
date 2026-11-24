/* The classic horrors: masks, sacks, butchers, the asylum, and the girl from the well. */
module.exports = (kit, U) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, BLOOD, RED, hex, mix, dark, lite, face, body, shoe } = kit;
  const { P, C, sleeve, hand, trouser, shin, foot } = U;
  const { heads, torsos, arms, legs, H, S, T, A, L } = U.lists();
  const CANVAS = hex('#cfc5a8'), // a straitjacket
    STRAP = hex('#584031'),
    MASK = hex('#d6d0bc'),
    SACK = hex('#8f7d58'),
    ROPE = hex('#5a4630'),
    HIDE = hex('#2a2228'), // black leather
    SHIRT = hex('#bdb8a8'),
    SLASH = hex('#3a4634'), // the work jacket of the man with the hook
    WETDRESS = hex('#c9c8c0'),
    SCAR = hex('#8a4a44'),
    BILE = hex('#7a8a3a');

  /* ---------- heads ---------- */
  S('hockey mask killer white red marks', (c) => {
    const h = hex('#2a2018'),
      m = MASK;
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    c.col(2, 3, 8, h);
    c.col(11, 3, 8, h);
    c.rect(3, 3, 10, 4, h);
    c.set(2, 9, h);
    c.row(3, 4, 9, m);
    c.rect(3, 4, 10, 9, m);
    c.row(10, 4, 9, m);
    c.row(11, 5, 8, dark(m));
    c.col(10, 4, 9, dark(m));
    c.set(4, 3, lite(m));
    c.rect(4, 5, 5, 6, K);
    c.rect(8, 5, 9, 6, K);
    P(c, RED, [[5, 3], [8, 3], [6, 4], [7, 4], [3, 8], [4, 9], [10, 8], [9, 9]]);
    P(c, mix(m, 0.55), [[6, 7], [7, 7], [5, 8], [8, 8], [6, 10], [7, 10], [5, 10], [8, 10]]);
    c.set(9, 4, BLOOD);
    c.set(9, 5, BLOOD);
  });
  S('sack head rope stitched eye bloody', (c) => {
    const s = SACK;
    P(c, s, [[3, 1], [4, 1], [9, 1], [10, 1], [3, 0], [10, 0]]);
    c.row(2, 3, 10, s);
    c.rect(3, 3, 10, 10, s);
    c.col(2, 5, 9, s);
    c.col(11, 5, 9, dark(s));
    c.col(10, 3, 10, dark(s));
    c.set(3, 0, lite(s));
    c.set(3, 2, lite(s));
    c.row(11, 3, 10, ROPE);
    P(c, lite(ROPE), [[4, 11], [6, 11], [8, 11]]);
    c.row(12, 4, 9, dark(s));
    c.set(10, 12, ROPE);
    P(c, K, [[4, 5], [5, 6], [4, 6]]);
    c.set(5, 5, dark(s));
    c.rect(8, 5, 9, 6, K);
    c.set(8, 6, WHITE);
    for (let x = 5; x <= 8; x++) c.set(x, 9, x % 2 ? K : dark(s));
    P(c, K, [[5, 8], [7, 10]]);
    P(c, BLOOD, [[3, 8], [3, 9], [3, 10], [4, 10], [2, 9], [4, 9]]);
    P(c, dark(s), [[6, 3], [7, 4], [5, 7], [9, 8]]);
  });
  H('butcher hairnet fat face blood spatter black hair fair', 'fair', 'grin', (c, s) => {
    const h = HAIR.black,
      net = hex('#6a6a7a');
    P(c, s, [[2, 7], [2, 8], [2, 9], [11, 7], [3, 10], [10, 10]]);
    P(c, dark(s), [[11, 8], [11, 9], [4, 11], [9, 11]]);
    c.row(12, 5, 8, dark(s));
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    c.row(3, 3, 10, h);
    P(c, net, [[4, 1], [6, 1], [8, 1], [3, 2], [5, 2], [7, 2], [9, 2], [4, 3], [6, 3], [8, 3], [10, 3]]);
    c.row(4, 3, 10, net);
    P(c, RED, [[4, 7], [9, 5]]);
    P(c, BLOOD, [[3, 6], [10, 6], [8, 4]]);
  });
  H('scarred face blind eye cropped black hair brown', 'brown', 'angry', (c, s) => {
    HAIRS.cropped(c, HAIR.black);
    const sc = mix(s, 1.5);
    P(c, sc, [[9, 4], [9, 5], [8, 7], [8, 8], [3, 8], [4, 8], [5, 8]]);
    c.set(8, 6, WHITE);
    c.set(9, 6, sc);
    c.set(8, 5, sc);
    P(c, dark(s), [[10, 4], [4, 7]]);
    void SCAR;
  });
  H('stitched face patchwork two skins black hair ashen', 'ashen', 'hollow', (c, s) => {
    const o = SKINS.rotten,
      h = HAIR.black;
    for (let y = 3; y <= 11; y++)
      for (let x = 7; x <= 10; x++) {
        const p = c.get(x, y);
        if (p && p !== K) c.set(x, y, x === 10 || (x === 9 && y === 10) ? dark(o) : o);
      }
    c.rect(3, 3, 5, 4, SKINS.fair);
    c.clear(3, 3);
    c.row(2, 4, 6, h);
    c.row(3, 3, 4, h);
    P(c, h, [[8, 2], [9, 3], [10, 3], [3, 4]]);
    c.col(6, 3, 11, hex('#5a2a2a'));
    P(c, K, [[5, 4], [7, 4], [5, 8], [7, 8], [5, 11], [7, 11], [5, 6], [7, 6]]);
    P(c, K, [[3, 5], [4, 5]]);
    c.rect(4, 6, 4, 6, K);
    c.set(7, 7, dark(o));
    c.row(9, 7, 8, dark(dark(o)));
  });
  H('eyeless face smooth skin long white hair pale', 'pale', 'scared', (c, s) => {
    HAIRS.long(c, HAIR.white);
    c.rect(4, 4, 9, 6, s);
    const d = mix(s, 0.8);
    c.rect(4, 5, 5, 6, d);
    c.rect(8, 5, 9, 6, d);
    P(c, mix(s, 0.66), [[4, 6], [5, 6], [8, 6], [9, 6]]);
    P(c, SCAR, [[5, 7], [8, 7]]);
    c.set(5, 8, BLOOD);
  });
  H('long wet black hair over the face one eye drowned', 'drowned', 'calm', (c, s) => {
    const h = HAIR.black,
      l = hex('#34303e');
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    for (let y = 3; y <= 12; y++)
      for (let x = 2; x <= 11; x++) {
        if ((x === 7 || x === 8) && y >= 5 && y <= 9) continue;
        c.set(x, y, h);
      }
    for (const [x, y0, y1] of [[4, 2, 9], [3, 5, 12], [10, 3, 11], [6, 3, 10], [9, 6, 12]]) c.col(x, y0, y1, l);
    for (const [x, y] of [[2, 12], [4, 12], [5, 11], [5, 12], [7, 12], [8, 11], [8, 12], [11, 11], [11, 12], [10, 12], [2, 3]]) c.clear(x, y);
    c.set(7, 6, WHITE);
    c.set(8, 6, K);
    c.set(7, 5, dark(s));
    c.set(8, 5, dark(s));
    c.set(7, 7, s);
    c.row(9, 7, 8, dark(dark(s)));
    c.set(3, 12, C.tear);
    c.set(9, 12, C.tear);
  });
  S('clown gone wrong smeared grin bald green tufts', (c) => {
    const w = hex('#cfcabb'),
      g = hex('#4a5e3a');
    face(c, w);
    c.row(2, 5, 8, w);
    c.rect(1, 3, 2, 6, g);
    c.rect(11, 3, 12, 6, dark(g));
    P(c, g, [[2, 2], [0, 4], [1, 7], [3, 3]]);
    P(c, dark(g), [[11, 2], [13, 5], [12, 7], [10, 3]]);
    P(c, K, [[5, 5], [4, 6], [5, 6], [5, 7], [8, 5], [8, 6], [9, 6], [8, 7]]);
    P(c, RED, [[5, 6], [8, 6]]);
    c.rect(6, 7, 7, 7, RED);
    c.row(9, 4, 9, K);
    c.row(10, 5, 8, BONE);
    P(c, K, [[6, 10]]);
    P(c, BLOOD, [[3, 8], [10, 8], [3, 9], [10, 9], [4, 10], [9, 10], [4, 11], [2, 7]]);
    P(c, mix(w, 0.75), [[4, 4], [8, 3], [9, 4]]);
  });
  S('leather mask zip mouth black hood buckle', (c) => {
    const m = HIDE,
      l = hex('#4c424c');
    c.row(1, 5, 8, m);
    c.row(2, 4, 9, m);
    c.rect(3, 3, 10, 10, m);
    c.row(11, 4, 9, STRAP);
    c.row(12, 5, 8, m);
    P(c, l, [[5, 1], [4, 2], [3, 3], [3, 4], [4, 3], [5, 2]]);
    P(c, l, [[6, 3], [6, 5], [9, 8], [3, 8]]);
    c.set(4, 6, WHITE);
    c.set(5, 6, K);
    c.set(8, 6, K);
    c.set(9, 6, WHITE);
    P(c, l, [[4, 5], [5, 5], [8, 5], [9, 5], [4, 7], [5, 7], [8, 7], [9, 7]]);
    for (let x = 5; x <= 9; x++) c.set(x, 9, x % 2 ? C.steel : hex('#5a6064'));
    c.set(10, 9, C.brass);
    c.set(10, 10, C.brass);
    c.set(6, 11, C.brass);
    c.set(7, 11, K);
    c.set(4, 9, K);
    c.set(4, 10, K);
  });
  H('cannibal bloody mouth chin wild brown hair pale', 'pale', 'grin', (c) => {
    HAIRS.wild(c, HAIR.brown);
    P(c, BLOOD, [[3, 9], [4, 9], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [9, 9], [10, 9], [5, 11], [6, 11], [7, 11], [8, 11], [6, 12], [5, 8], [8, 8]]);
    P(c, RED, [[5, 10], [7, 11], [8, 10]]);
    c.set(3, 7, BLOOD);
  });
  H('possessed girl white eyes cuts bile long black hair rotten', 'rotten', 'angry', (c) => {
    HAIRS.long(c, HAIR.black);
    P(c, WHITE, [[4, 6], [5, 6], [8, 6], [9, 6]]);
    P(c, BLOOD, [[4, 8], [5, 8], [9, 4], [9, 7], [9, 8]]);
    P(c, BILE, [[6, 10], [7, 10], [6, 11], [6, 12]]);
    c.set(7, 11, dark(BILE));
    c.set(3, 7, HAIR.black);
    c.set(3, 8, HAIR.black);
  });

  /* ---------- torsos ---------- */
  T("butcher's apron bloody striped shirt", (c) => {
    const a = C.dirtyWhite;
    body(c, WHITE);
    for (const x of [2, 4, 7, 9]) c.col(x, 2, 9, CLOTH.navy);
    P(c, CLOTH.navy, [[1, 1], [3, 1], [8, 1], [10, 1]]);
    P(c, SKINS.fair, [[5, 1], [6, 1]]);
    c.rect(3, 3, 8, 9, a);
    P(c, a, [[3, 1], [3, 2], [8, 1], [8, 2]]);
    c.col(8, 3, 9, dark(a));
    c.rect(3, 7, 8, 9, BLOOD);
    P(c, BLOOD, [[3, 6], [4, 6], [5, 6], [7, 6], [4, 5], [7, 5], [5, 4], [8, 4], [6, 3]]);
    P(c, RED, [[4, 7], [5, 8], [7, 7], [6, 9], [4, 6]]);
    P(c, dark(BLOOD), [[8, 7], [8, 8], [8, 9], [3, 9]]);
  });
  T('straitjacket buckled front straps', (c) => {
    body(c, CANVAS);
    c.row(1, 4, 7, dark(CANVAS));
    P(c, STRAP, [[5, 1], [6, 1]]);
    for (const y of [3, 5, 7]) {
      c.row(y, 3, 8, STRAP);
      c.set(6, y, C.brass);
      c.set(8, y, dark(STRAP));
    }
    c.col(2, 3, 9, mix(CANVAS, 0.86));
    c.rect(5, 8, 6, 9, STRAP);
    c.set(6, 9, dark(STRAP));
    c.row(9, 2, 4, dark(CANVAS));
    c.row(9, 7, 9, dark(CANVAS));
  });
  T('straitjacket torn loose straps dirty bloody', (c) => {
    const d = hex('#b3a785');
    body(c, d);
    P(c, SKINS.ashen, [[5, 1], [6, 1], [5, 2]]);
    P(c, BLOOD, [[4, 1], [4, 2], [3, 2], [6, 2]]);
    for (const [x, y] of [[2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]) c.set(x, y, STRAP);
    c.set(4, 5, C.brass);
    c.row(4, 6, 9, STRAP);
    c.col(8, 5, 7, STRAP);
    c.set(8, 8, C.brass);
    P(c, SKINS.ashen, [[7, 2], [8, 2]]);
    P(c, dark(d), [[2, 8], [3, 8], [2, 6], [9, 2]]);
    c.clear(2, 9);
    c.clear(5, 9);
    c.clear(9, 9);
  });
  T('torn shirt claw marks blood fair', (c) => {
    const s = SKINS.fair;
    body(c, SHIRT);
    P(c, s, [[5, 1], [6, 1], [5, 2]]);
    P(c, dark(SHIRT), [[4, 1], [7, 1], [6, 2]]);
    P(c, s, [[4, 2], [4, 3], [5, 3]]);
    for (const x of [3, 5, 7]) {
      P(c, BLOOD, [[x, 4], [x, 5], [x + 1, 6], [x + 1, 7]]);
      c.set(x, 3, dark(SHIRT));
      c.set(x + 1, 5, s);
    }
    P(c, RED, [[5, 5], [8, 6]]);
    P(c, BLOOD, [[6, 8], [4, 8]]);
    c.clear(3, 9);
    c.clear(6, 9);
    c.clear(8, 9);
    c.clear(9, 8);
    c.set(2, 8, dark(SHIRT));
  });
  T('clown suit ruined motley ruff pompoms stained', (c) => {
    const a = mix(CLOTH.mustard, 0.8),
      b = mix(CLOTH.teal, 0.9),
      pom = CLOTH.wine;
    body(c, a);
    c.rect(6, 2, 9, 9, b);
    c.row(1, 6, 10, b);
    c.col(9, 2, 9, dark(b));
    c.row(1, 2, 9, WHITE);
    for (const x of [2, 4, 6, 8]) c.set(x, 2, WHITE);
    for (const x of [3, 5, 7, 9]) c.set(x, 1, dark(WHITE));
    c.rect(5, 4, 6, 5, pom);
    c.set(6, 5, dark(pom));
    c.set(5, 4, lite(pom));
    c.set(5, 7, K);
    c.set(6, 8, hex('#3a2c22'));
    P(c, dark(a), [[3, 6], [2, 7], [3, 7], [4, 8]]);
    P(c, BLOOD, [[7, 7], [8, 8], [8, 7]]);
  });
  T('leather apron chain meat hooks', (c) => {
    const le = hex('#4a3628');
    body(c, CLOTH.slate);
    P(c, SKINS.tan, [[5, 1], [6, 1]]);
    c.rect(3, 2, 8, 9, le);
    P(c, le, [[4, 1], [7, 1]]);
    c.col(8, 2, 9, dark(le));
    c.set(3, 2, lite(le));
    for (let x = 2; x <= 9; x++) c.set(x, 4, x % 2 ? C.iron : C.steel);
    for (const x of [3, 6]) {
      c.col(x, 5, 6, C.steel);
      c.set(x, 7, C.steel);
      c.set(x + 1, 8, C.steel);
      c.set(x + 2, 7, C.steel);
    }
    P(c, RED, [[5, 7], [8, 7]]);
    P(c, BLOOD, [[5, 8], [8, 8], [4, 9]]);
  });
  T('wet white dress stained hair over shoulders', (c) => {
    const d = WETDRESS,
      h = HAIR.black;
    body(c, d, true);
    P(c, SKINS.drowned, [[5, 1], [6, 1]]);
    P(c, dark(d), [[4, 1], [7, 1], [5, 2], [6, 2]]);
    c.col(3, 4, 9, mix(d, 0.84));
    c.col(6, 5, 9, mix(d, 0.84));
    c.col(8, 3, 8, mix(d, 0.84));
    c.col(10, 6, 9, dark(d));
    P(c, h, [[2, 1], [2, 2], [3, 2], [3, 3], [2, 3], [9, 1], [9, 2], [8, 2], [9, 3], [9, 4], [2, 4]]);
    P(c, C.mud, [[2, 9], [3, 9], [7, 9], [8, 8]]);
    P(c, C.tear, [[5, 6], [4, 4]]);
  });
  T('work jacket dark green bloody handprint', (c) => {
    body(c, SLASH);
    P(c, CLOTH.ash, [[5, 1], [6, 1]]);
    P(c, lite(SLASH), [[4, 1], [7, 1], [4, 2], [7, 2]]);
    c.col(5, 2, 9, dark(SLASH));
    P(c, C.iron, [[5, 2]]);
    c.row(8, 2, 9, dark(SLASH));
    P(c, WHITE, [[2, 3], [3, 3]]);
    c.rect(6, 5, 8, 6, BLOOD);
    P(c, BLOOD, [[6, 3], [6, 4], [8, 3], [8, 4], [7, 4], [9, 5], [7, 7], [7, 8]]);
    c.set(7, 5, RED);
    c.set(3, 6, dark(SLASH));
  });

  /* ---------- arms ---------- */
  A('chained wrist shackle broken chain torn sleeve ashen', (c) => {
    const s = SKINS.ashen;
    hand(c, s, 0);
    c.rect(1, 0, 3, 2, SHIRT);
    c.set(3, 0, dark(SHIRT));
    c.set(3, 1, dark(SHIRT));
    P(c, SHIRT, [[1, 3], [3, 3]]);
    c.rect(0, 6, 4, 7, C.iron);
    c.row(6, 0, 4, lite(C.iron));
    c.set(2, 7, K);
    c.set(4, 7, dark(C.iron));
    P(c, C.steel, [[4, 8], [4, 10]]);
    P(c, C.iron, [[4, 9], [4, 11]]);
    c.set(2, 8, SCAR);
  });
  A('hook hand meat hook bloody dark green sleeve', (c) => {
    sleeve(c, SLASH, 6);
    c.rect(1, 7, 3, 8, STRAP);
    c.row(7, 0, 4, STRAP);
    c.set(4, 7, dark(STRAP));
    c.set(2, 8, C.brass);
    P(c, C.steel, [[2, 9], [2, 10], [2, 11], [3, 11], [4, 11], [4, 10]]);
    c.set(4, 9, RED);
    c.set(3, 11, dark(C.steel));
    c.set(4, 11, BLOOD);
  });
  A('straitjacket long closed sleeve dangling strap', (c) => {
    c.rect(1, 0, 3, 10, CANVAS);
    c.col(3, 0, 10, dark(CANVAS));
    c.set(1, 0, lite(CANVAS));
    c.row(4, 1, 3, STRAP);
    c.set(2, 4, C.brass);
    c.row(10, 1, 3, dark(CANVAS));
    c.set(2, 10, STRAP);
    c.set(2, 11, STRAP);
    c.set(3, 11, C.brass);
    c.set(2, 7, mix(CANVAS, 0.86));
  });
  A('torn sleeve scratched arm bloody hand fair', (c) => {
    const s = SKINS.fair;
    hand(c, s, 0);
    c.rect(1, 0, 3, 2, SHIRT);
    c.set(3, 0, dark(SHIRT));
    c.set(3, 1, dark(SHIRT));
    c.set(3, 2, dark(SHIRT));
    P(c, SHIRT, [[1, 3], [3, 4], [3, 3]]);
    P(c, BLOOD, [[1, 5], [2, 6], [3, 7], [2, 4], [3, 5]]);
    c.rect(1, 9, 3, 10, BLOOD);
    c.set(2, 9, RED);
    c.set(1, 9, s);
    c.set(2, 11, BLOOD);
  });
  A("butcher's arm rolled striped sleeve blood to the elbow fair", (c) => {
    const s = SKINS.fair;
    hand(c, s, 0);
    c.rect(1, 0, 3, 2, WHITE);
    c.col(2, 0, 2, CLOTH.navy);
    c.row(3, 0, 4, WHITE);
    c.set(4, 3, dark(WHITE));
    c.rect(1, 6, 3, 10, BLOOD);
    c.col(3, 6, 10, dark(BLOOD));
    P(c, RED, [[1, 7], [2, 9], [1, 10]]);
    P(c, BLOOD, [[2, 5], [1, 11], [3, 11]]);
  });

  /* ---------- legs ---------- */
  L("butcher's apron hem dark trousers white wellingtons bloody", (c) => {
    const a = C.dirtyWhite;
    trouser(c, CLOTH.black, 6);
    c.rect(1, 0, 4, 3, a);
    c.col(4, 0, 3, dark(a));
    c.rect(1, 0, 3, 1, BLOOD);
    P(c, BLOOD, [[2, 2], [2, 3], [1, 2]]);
    c.set(2, 1, RED);
    c.rect(1, 6, 4, 9, WHITE);
    c.row(6, 1, 4, lite(WHITE));
    c.col(4, 7, 9, dark(WHITE));
    shoe(c, WHITE);
    P(c, BLOOD, [[2, 8], [3, 10], [4, 10], [2, 11], [3, 11]]);
    c.set(2, 9, RED);
  });
  L('asylum canvas trousers ankle shackle bare feet ashen', (c) => {
    const s = SKINS.ashen;
    trouser(c, CANVAS, 6);
    P(c, CANVAS, [[1, 7], [3, 7]]);
    c.col(2, 1, 5, mix(CANVAS, 0.86));
    shin(c, s, 8);
    c.set(2, 7, s);
    c.set(4, 7, dark(s));
    c.row(8, 0, 5, C.iron);
    c.row(8, 1, 2, lite(C.iron));
    c.set(5, 9, C.steel);
    foot(c, s);
  });
  L('torn trousers scratched legs bloody bare feet fair', (c) => {
    const s = SKINS.fair,
      t = CLOTH.slate;
    trouser(c, t, 4);
    P(c, t, [[1, 5], [2, 5], [4, 5], [1, 6]]);
    shin(c, s, 5);
    P(c, t, [[1, 5], [2, 5], [4, 5], [1, 6]]);
    c.set(4, 5, dark(t));
    c.set(2, 2, s);
    c.set(3, 3, s);
    P(c, BLOOD, [[2, 7], [3, 8], [3, 3]]);
    foot(c, s);
    P(c, BLOOD, [[3, 10], [4, 10], [4, 11], [5, 11], [2, 11]]);
    c.set(3, 11, RED);
  });
  L('wet white dress hem dripping bare feet drowned', (c) => {
    const d = WETDRESS,
      s = SKINS.drowned;
    c.rect(0, 0, 5, 7, d);
    c.col(5, 0, 7, dark(d));
    c.col(2, 1, 7, mix(d, 0.84));
    c.col(4, 3, 6, mix(d, 0.84));
    P(c, C.mud, [[0, 7], [1, 7], [3, 7], [4, 6]]);
    c.clear(2, 7);
    c.clear(5, 7);
    c.rect(2, 8, 3, 9, s);
    c.set(3, 8, dark(s));
    c.set(3, 9, dark(s));
    foot(c, s);
    c.clear(1, 10);
    c.clear(1, 11);
    c.set(5, 9, C.tear);
    c.set(1, 9, C.tear);
  });
  return { heads, torsos, arms, legs };
};
