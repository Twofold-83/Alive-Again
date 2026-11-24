/* The churchyard: those who bury, those who mourn, and those who were buried. */
module.exports = (kit, U) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  const { P, C, sleeve, hand, trouser, glasses } = U;
  const { heads, torsos, arms, legs, H, S, T, A, L } = U.lists();
  const BLACK = hex('#1e1b24'),
    CREPE = hex('#3a3640'),
    SHROUD = hex('#c2bca6'),
    OLDBONE = hex('#a9a48f'),
    EARTH = hex('#4a3a2a'),
    WEED = hex('#3f5a3f'),
    BRIDE = hex('#b9c4cc'),
    STOLE = hex('#5a3a6a'),
    WORM = hex('#b08a84'),
    FLESH = hex('#6a2a2a');

  /* ---------- heads ---------- */
  H('gravedigger flat cap grey stubble dirt brown', 'brown', 'calm', (c, s) => {
    const col = CLOTH.earth,
      g = mix(HAIR.grey, 0.85);
    c.row(1, 5, 9, col);
    c.row(2, 3, 10, col);
    c.row(3, 2, 11, dark(col));
    P(c, dark(col), [
      [11, 4],
      [12, 4],
    ]);
    P(c, lite(col), [
      [5, 1],
      [4, 2],
      [7, 2],
      [9, 2],
    ]);
    P(c, g, [
      [3, 8],
      [3, 9],
      [4, 9],
      [4, 10],
      [5, 10],
      [8, 10],
      [9, 9],
      [5, 11],
      [6, 11],
      [7, 11],
      [8, 11],
      [6, 10],
      [7, 10],
    ]);
    P(c, mix(s, 0.6), [
      [4, 7],
      [9, 5],
    ]);
    c.set(3, 4, g);
  });
  H('mourner black hat veil net over the face pale', 'pale', 'weeping', (c) => {
    const b = BLACK;
    c.row(1, 4, 9, b);
    c.row(2, 3, 10, b);
    c.row(3, 2, 11, b);
    c.set(4, 1, lite(lite(b)));
    c.row(2, 4, 9, CREPE);
    for (let y = 4; y <= 8; y++) for (let x = 3; x <= 10; x++) if ((x + y) % 2 === 0 && !(y === 6 && (x === 4 || x === 6))) c.set(x, y, CREPE);
    P(c, CREPE, [
      [2, 4],
      [2, 6],
      [2, 8],
      [11, 5],
      [11, 7],
      [3, 9],
      [10, 9],
    ]);
    P(c, HAIR.black, [
      [3, 4],
      [10, 4],
    ]);
  });
  H('undertaker top hat crepe band ribbon grey whiskers pale', 'pale', 'hollow', (c, s) => {
    const b = hex('#17151c'),
      h = HAIR.grey;
    c.rect(4, 0, 9, 2, b);
    c.row(3, 2, 11, b);
    c.row(2, 4, 9, CREPE);
    c.set(4, 0, hex('#33303a'));
    P(c, CREPE, [
      [11, 4],
      [11, 5],
      [12, 6],
      [12, 7],
      [11, 8],
      [12, 5],
    ]);
    P(c, h, [
      [3, 6],
      [3, 7],
      [3, 8],
      [10, 6],
    ]);
    P(c, dark(h), [
      [10, 7],
      [10, 8],
    ]);
    P(c, dark(s), [
      [4, 8],
      [9, 8],
      [4, 4],
      [9, 4],
    ]);
  });
  H('priest biretta black glasses white hair collar fair', 'fair', 'calm', (c) => {
    const b = BLACK,
      h = HAIR.white;
    c.row(3, 3, 10, h);
    P(c, h, [
      [3, 4],
      [3, 5],
    ]);
    P(c, dark(h), [
      [10, 4],
      [10, 5],
    ]);
    c.rect(4, 1, 9, 2, b);
    P(c, b, [
      [4, 0],
      [6, 0],
      [7, 0],
      [9, 0],
    ]);
    c.set(4, 1, lite(lite(b)));
    c.set(6, 0, CREPE);
    glasses(c);
    c.row(12, 5, 8, K);
    c.row(12, 6, 7, WHITE);
  });
  H('sexton lantern jaw heavy brow balding black hair tan', 'tan', 'calm', (c, s) => {
    HAIRS.balding(c, HAIR.black);
    c.row(2, 5, 8, s);
    P(c, s, [
      [2, 6],
      [2, 7],
    ]);
    P(c, dark(s), [
      [11, 6],
      [11, 7],
    ]);
    /* the jaw */
    c.row(10, 3, 10, s);
    c.row(11, 3, 10, s);
    c.row(12, 4, 9, dark(s));
    P(c, dark(s), [
      [10, 9],
      [10, 10],
      [10, 11],
    ]);
    c.set(3, 10, lite(s));
    P(c, mix(s, 0.62), [
      [4, 5],
      [5, 5],
      [8, 5],
      [9, 5],
    ]);
    c.row(9, 5, 8, dark(dark(s)));
    c.set(6, 11, dark(s));
    c.set(7, 11, dark(s));
  });
  H('fresh ghoul torn cheek teeth earth patchy brown hair rotten', 'rotten', 'hollow', (c, s) => {
    const h = HAIR.brown;
    P(c, h, [
      [4, 2],
      [5, 2],
      [3, 3],
      [4, 3],
      [9, 3],
      [8, 2],
      [3, 4],
    ]);
    c.row(2, 6, 7, s);
    c.set(9, 2, s);
    P(c, FLESH, [
      [8, 8],
      [9, 8],
      [10, 8],
      [10, 9],
      [8, 10],
    ]);
    P(c, BONE, [
      [8, 9],
      [9, 9],
    ]);
    c.set(9, 10, K);
    c.set(8, 6, WHITE);
    c.set(9, 6, WHITE);
    c.set(8, 5, K);
    c.set(9, 5, K);
    P(c, EARTH, [
      [5, 4],
      [4, 9],
      [6, 3],
      [5, 11],
    ]);
    P(c, WORM, [
      [2, 7],
      [3, 8],
    ]);
  });
  const skull = (c, b) => {
    c.row(1, 5, 8, b);
    c.row(2, 4, 9, b);
    c.rect(3, 3, 10, 7, b);
    c.rect(4, 8, 9, 8, b);
    c.col(10, 3, 7, dark(b));
    c.set(9, 8, dark(b));
    c.set(5, 1, lite(b));
    c.set(4, 2, lite(b));
    c.rect(4, 5, 5, 6, K);
    c.rect(8, 5, 9, 6, K);
    c.set(6, 7, K);
    c.set(7, 8, K);
    c.set(6, 8, K);
  };
  S('skeleton skull jaw hanging open earth worm', (c) => {
    const b = BONE;
    skull(c, b);
    c.row(9, 5, 8, b);
    P(c, K, [
      [6, 9],
      [8, 9],
    ]);
    c.row(10, 5, 8, K);
    c.row(11, 4, 9, b);
    c.row(12, 5, 8, dark(b));
    P(c, K, [
      [5, 11],
      [7, 11],
    ]);
    c.set(9, 11, dark(b));
    c.set(4, 9, K);
    c.set(4, 10, K);
    c.set(9, 9, K);
    c.set(9, 10, K);
    P(c, EARTH, [
      [4, 6],
      [5, 6],
      [3, 3],
      [4, 2],
    ]);
    P(c, WORM, [
      [9, 6],
      [10, 7],
      [11, 7],
    ]);
    P(c, K, [
      [8, 2],
      [8, 3],
      [9, 4],
    ]);
  });
  S('skeleton old skull mossy gold tooth white hair strands', (c) => {
    const b = OLDBONE;
    skull(c, b);
    c.row(9, 4, 9, b);
    c.row(10, 4, 9, b);
    c.row(11, 5, 8, dark(b));
    for (const x of [5, 7, 9]) c.set(x, 9, K);
    for (const x of [4, 6, 8]) c.set(x, 10, K);
    c.set(6, 9, GOLD);
    c.rect(4, 4, 5, 6, K);
    P(c, C.olive, [
      [3, 3],
      [4, 2],
      [4, 3],
      [5, 2],
      [3, 4],
      [6, 1],
      [9, 8],
    ]);
    P(c, lite(C.olive), [
      [5, 1],
      [4, 2],
    ]);
    P(c, HAIR.white, [
      [2, 4],
      [2, 5],
      [2, 6],
      [1, 7],
      [2, 8],
      [11, 4],
      [11, 5],
      [12, 6],
      [11, 7],
    ]);
  });
  S('skeleton skull candle on top wax no jaw', (c) => {
    const b = mix(BONE, 0.9),
      wax = hex('#e8e2c8');
    skull(c, b);
    c.row(9, 5, 8, b);
    P(c, K, [
      [5, 9],
      [7, 9],
    ]);
    c.set(8, 9, dark(b));
    c.rect(6, 10, 7, 12, dark(b));
    c.set(6, 11, K);
    c.set(7, 12, K);
    c.rect(6, 0, 7, 1, wax);
    c.set(6, 0, hex('#e8b04a'));
    c.set(7, 0, C.glow);
    P(c, wax, [
      [5, 1],
      [5, 2],
      [6, 2],
      [7, 2],
      [8, 2],
      [8, 3],
      [4, 3],
      [5, 3],
      [8, 4],
      [3, 4],
    ]);
    c.set(7, 1, dark(wax));
    c.set(9, 5, hex('#c9762a'));
  });
  H('drowned bride torn veil waterweed wet dark hair drowned', 'drowned', 'weeping', (c) => {
    const h = hex('#2a2420'),
      v = BRIDE;
    HAIRS.long(c, h);
    c.row(1, 4, 9, v);
    c.row(2, 3, 10, v);
    c.col(1, 3, 9, v);
    c.col(12, 3, 7, dark(v));
    P(c, v, [
      [2, 3],
      [11, 3],
      [0, 6],
      [1, 11],
    ]);
    P(c, dark(v), [
      [5, 1],
      [8, 2],
      [1, 5],
      [1, 8],
    ]);
    c.clear(1, 7);
    P(c, WEED, [
      [3, 4],
      [3, 5],
      [2, 6],
      [2, 7],
      [10, 3],
      [11, 4],
      [11, 5],
      [6, 2],
    ]);
    P(c, lite(WEED), [
      [3, 4],
      [10, 3],
    ]);
    P(c, C.tear, [
      [2, 12],
      [11, 12],
    ]);
  });
  H('corpse laid out coins on the eyes jaw cloth grey hair ashen', 'ashen', 'calm', (c, s) => {
    const h = HAIR.grey,
      coin = hex('#9a8436');
    c.row(3, 3, 10, h);
    c.row(2, 4, 9, h);
    c.set(10, 3, dark(h));
    c.col(3, 4, 9, WHITE);
    c.col(10, 4, 9, dark(WHITE));
    c.row(10, 4, 9, WHITE);
    c.row(11, 5, 8, dark(WHITE));
    c.set(9, 10, dark(WHITE));
    c.col(6, 1, 3, WHITE);
    c.col(7, 1, 3, dark(WHITE));
    P(c, WHITE, [
      [5, 0],
      [8, 0],
    ]);
    c.rect(4, 5, 5, 6, coin);
    c.rect(8, 5, 9, 6, coin);
    P(c, lite(coin), [
      [4, 5],
      [8, 5],
    ]);
    P(c, dark(coin), [
      [5, 6],
      [9, 6],
    ]);
    c.row(9, 6, 7, dark(dark(s)));
  });

  /* ---------- torsos ---------- */
  T('mourning dress black high collar lace jet buttons', (c) => {
    body(c, BLACK, true);
    c.row(1, 4, 7, BLACK);
    P(c, mix(WHITE, 0.8), [
      [5, 1],
      [6, 1],
    ]);
    for (const [x, y] of [
      [2, 2],
      [4, 2],
      [7, 2],
      [9, 2],
      [3, 3],
      [8, 3],
      [4, 4],
      [7, 4],
    ])
      c.set(x, y, CREPE);
    c.rect(5, 2, 6, 2, hex('#6a6a78'));
    for (const y of [4, 6, 8]) c.set(5, y, hex('#5a5a68'));
    c.row(5, 2, 9, K);
    c.clear(2, 5);
    c.clear(9, 5);
    c.col(3, 6, 9, CREPE);
    c.col(8, 6, 9, CREPE);
    c.col(10, 6, 9, dark(BLACK));
    c.set(1, 1, lite(lite(BLACK)));
  });
  T("undertaker's frock coat black grey waistcoat cravat", (c) => {
    body(c, BLACK, true);
    c.rect(5, 1, 6, 4, hex('#5a5a66'));
    P(c, WHITE, [
      [5, 1],
      [6, 1],
    ]);
    P(c, K, [
      [5, 2],
      [6, 2],
    ]);
    c.set(6, 4, C.steel);
    P(c, lite(lite(BLACK)), [
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [7, 1],
      [7, 2],
      [7, 3],
      [7, 4],
      [5, 5],
      [6, 5],
    ]);
    for (const y of [6, 8]) {
      c.set(4, y, C.iron);
      c.set(7, y, C.iron);
    }
    c.col(10, 6, 9, dark(BLACK));
    c.col(5, 6, 9, K);
    c.set(1, 1, lite(lite(BLACK)));
    c.row(3, 1, 2, CREPE);
  });
  T('shroud winding sheet wrapped earth stains', (c) => {
    const s = SHROUD;
    body(c, s, true);
    c.row(1, 4, 7, dark(s));
    for (const [x, y] of [
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
      [5, 2],
      [6, 3],
      [7, 4],
      [8, 5],
      [9, 6],
      [1, 6],
      [2, 7],
      [3, 8],
      [4, 9],
    ])
      c.set(x, y, dark(s));
    c.col(10, 6, 9, dark(s));
    P(c, EARTH, [
      [2, 8],
      [2, 9],
      [3, 9],
      [8, 2],
      [9, 8],
    ]);
    c.set(6, 5, mix(s, 0.86));
    c.set(1, 1, lite(s));
  });
  T('cassock black buttons purple stole gold crosses', (c) => {
    body(c, BLACK, true);
    P(c, WHITE, [
      [5, 1],
      [6, 1],
    ]);
    for (let y = 2; y <= 9; y += 2) c.set(5, y, hex('#5a5a68'));
    c.col(3, 1, 8, STOLE);
    c.col(8, 1, 8, dark(STOLE));
    P(c, GOLD, [
      [3, 5],
      [8, 5],
    ]);
    P(c, GOLD, [
      [3, 8],
      [8, 8],
    ]);
    c.set(3, 1, lite(STOLE));
    c.col(10, 6, 9, dark(BLACK));
    c.set(1, 1, lite(lite(BLACK)));
  });
  T('gravedigger waistcoat earth dirty shirt red neckerchief mud', (c) => {
    const sh = hex('#b5ad94'),
      w = CLOTH.earth,
      n = hex('#8a3a30');
    body(c, sh);
    c.rect(2, 2, 3, 9, w);
    c.rect(8, 2, 9, 9, w);
    c.col(9, 2, 9, dark(w));
    P(c, w, [
      [1, 1],
      [2, 1],
      [9, 1],
      [10, 1],
    ]);
    c.set(1, 1, lite(w));
    c.row(1, 4, 7, n);
    P(c, n, [
      [5, 2],
      [6, 2],
      [6, 3],
    ]);
    c.set(5, 2, dark(n));
    c.col(5, 4, 8, dark(sh));
    P(c, C.mud, [
      [4, 7],
      [6, 8],
      [7, 5],
      [3, 8],
    ]);
    c.row(9, 2, 9, C.leather);
    c.set(5, 9, C.brass);
  });
  T('skeleton ribcage half in a tattered burial suit', (c) => {
    const b = BONE,
      su = BLACK;
    c.row(1, 1, 5, b);
    c.col(5, 1, 9, b);
    for (const y of [3, 5, 7]) {
      c.row(y, 2, 4, b);
      c.set(2, y + 1, dark(b));
    }
    c.row(9, 3, 5, b);
    c.rect(6, 1, 9, 9, su);
    c.row(1, 6, 10, su);
    c.col(9, 2, 9, dark(su));
    c.clear(6, 4);
    c.clear(6, 7);
    c.clear(7, 9);
    P(c, WHITE, [
      [6, 2],
      [6, 3],
    ]);
    P(c, CLOTH.wine, [
      [6, 5],
      [6, 6],
    ]);
    c.set(8, 5, C.iron);
    c.set(8, 7, C.iron);
    P(c, lite(lite(su)), [
      [7, 1],
      [7, 2],
      [7, 3],
    ]);
    P(c, C.olive, [
      [2, 3],
      [4, 7],
    ]);
    c.set(1, 1, lite(b));
  });
  T('drowned bride wedding dress wet waterweed pearls', (c) => {
    const d = BRIDE,
      s = SKINS.drowned;
    body(c, d, true);
    c.row(1, 4, 7, s);
    c.row(2, 5, 6, s);
    c.clear(2, 5);
    c.clear(9, 5);
    c.row(6, 2, 9, dark(d));
    P(c, lite(d), [
      [3, 2],
      [8, 2],
      [4, 3],
      [7, 3],
      [3, 4],
      [8, 4],
    ]);
    P(c, WHITE, [
      [5, 3],
      [6, 3],
    ]);
    P(c, WEED, [
      [1, 1],
      [2, 2],
      [2, 3],
      [3, 4],
      [3, 5],
      [8, 7],
      [8, 8],
      [9, 9],
    ]);
    c.set(2, 2, lite(WEED));
    c.col(5, 7, 9, mix(d, 0.8));
    c.col(10, 7, 9, dark(d));
    P(c, mix(d, 0.7), [
      [2, 9],
      [3, 9],
      [6, 9],
      [7, 9],
    ]);
    c.set(4, 8, C.tear);
  });
  T('ghoul burial suit burst open rotten chest ribs earth', (c) => {
    const su = hex('#2a2a34'),
      r = SKINS.rotten;
    body(c, su);
    P(c, WHITE, [
      [4, 1],
      [7, 1],
    ]);
    c.rect(4, 2, 7, 7, r);
    P(c, r, [
      [5, 1],
      [6, 1],
      [3, 4],
      [8, 5],
      [5, 8],
    ]);
    c.col(7, 2, 7, dark(r));
    P(c, FLESH, [
      [4, 7],
      [5, 7],
      [6, 7],
    ]);
    c.row(3, 4, 6, BONE);
    c.row(5, 4, 6, BONE);
    c.set(6, 3, dark(BONE));
    c.set(6, 5, dark(BONE));
    P(c, EARTH, [
      [2, 3],
      [3, 8],
      [8, 8],
      [9, 4],
    ]);
    P(c, WORM, [
      [5, 6],
      [6, 6],
    ]);
    P(c, lite(lite(su)), [
      [3, 2],
      [3, 3],
      [8, 2],
      [8, 3],
    ]);
    c.set(8, 6, CLOTH.wine);
  });

  /* ---------- arms ---------- */
  A('mourning black sleeve puffed white cuff black lace glove', (c) => {
    c.rect(0, 0, 4, 1, BLACK);
    c.set(4, 0, dark(BLACK));
    c.set(4, 1, dark(BLACK));
    c.set(0, 0, lite(lite(BLACK)));
    c.rect(1, 2, 3, 6, BLACK);
    c.col(3, 2, 6, dark(BLACK));
    c.row(7, 1, 3, mix(WHITE, 0.85));
    hand(c, SKINS.pale, 8);
    for (let y = 8; y <= 10; y++) for (let x = 1; x <= 3; x++) if ((x + y) % 2) c.set(x, y, K);
  });
  A('frock coat black sleeve mourning band white cuff grey glove', (c) => {
    sleeve(c, BLACK, 7);
    c.set(1, 0, lite(lite(BLACK)));
    c.row(3, 1, 3, CREPE);
    c.row(8, 1, 3, WHITE);
    c.set(3, 8, dark(WHITE));
    hand(c, CLOTH.ash);
    c.set(2, 9, dark(CLOTH.ash));
  });
  A('gravedigger rolled shirt sleeve muddy forearm brown', (c) => {
    const sh = hex('#b5ad94'),
      s = SKINS.brown;
    sleeve(c, sh, 3);
    c.row(3, 0, 4, lite(sh));
    c.set(4, 3, sh);
    hand(c, s, 4);
    P(c, C.mud, [
      [1, 9],
      [2, 10],
      [3, 10],
      [1, 10],
      [2, 7],
    ]);
    c.set(3, 9, dark(C.mud));
  });
  A('bone arm rotting shroud rags', (c) => {
    const b = BONE;
    c.col(2, 0, 4, b);
    c.row(5, 1, 3, b);
    c.col(1, 6, 8, b);
    c.col(3, 6, 8, dark(b));
    c.row(9, 1, 3, b);
    P(c, b, [
      [1, 10],
      [2, 10],
      [3, 10],
      [1, 11],
      [3, 11],
    ]);
    c.set(3, 10, dark(b));
    c.set(3, 5, dark(b));
    c.rect(1, 0, 3, 1, SHROUD);
    P(c, SHROUD, [
      [1, 2],
      [3, 2],
      [1, 3],
    ]);
    c.set(3, 0, dark(SHROUD));
    c.set(3, 1, dark(SHROUD));
    c.set(2, 7, FLESH);
    c.set(3, 3, C.olive);
  });

  /* ---------- legs ---------- */
  L('mourning skirt long black crepe hem', (c) => {
    c.rect(0, 0, 5, 11, BLACK);
    c.col(5, 0, 11, dark(BLACK));
    c.col(2, 1, 7, lite(BLACK));
    for (let y = 8; y <= 10; y++) for (let x = 0; x <= 4; x++) if ((x + y) % 2) c.set(x, y, CREPE);
    c.row(11, 0, 5, K);
    c.set(0, 0, lite(lite(BLACK)));
  });
  L("undertaker's grey striped trousers white spats", (c) => {
    const t = hex('#5a5a66'),
      sp = hex('#b5b2a6');
    trouser(c, t);
    c.col(2, 0, 9, dark(t));
    shoe(c, K);
    c.rect(1, 9, 4, 9, sp);
    c.row(10, 1, 3, sp);
    c.set(4, 9, dark(sp));
    c.set(3, 10, dark(sp));
    c.set(2, 9, K);
  });
  L('earth trousers tied with string muddy boots', (c) => {
    const t = CLOTH.earth;
    trouser(c, t, 6);
    c.col(2, 0, 4, dark(t));
    c.row(5, 1, 4, C.sack);
    c.set(0, 5, t);
    c.rect(1, 7, 4, 9, C.leather);
    c.col(4, 7, 9, dark(C.leather));
    shoe(c, C.leather);
    c.row(11, 1, 5, C.mud);
    P(c, C.mud, [
      [2, 10],
      [4, 10],
      [2, 8],
      [3, 6],
      [1, 9],
    ]);
    c.set(5, 11, dark(C.mud));
  });
  L('bone legs tattered black trousers skeleton feet', (c) => {
    const b = BONE;
    c.rect(1, 0, 4, 2, BLACK);
    c.col(4, 0, 2, dark(BLACK));
    P(c, BLACK, [
      [1, 3],
      [3, 3],
      [4, 3],
    ]);
    c.col(2, 3, 4, b);
    c.col(3, 3, 4, dark(b));
    c.row(5, 1, 4, b);
    c.set(4, 5, dark(b));
    c.col(2, 6, 9, b);
    c.col(4, 6, 9, dark(b));
    c.row(10, 2, 4, b);
    c.row(11, 1, 5, b);
    P(c, K, [
      [2, 11],
      [4, 11],
    ]);
    c.set(3, 10, dark(b));
    c.set(2, 7, C.olive);
  });
  L('shroud wrapped legs bound at the ankle earth', (c) => {
    const s = SHROUD;
    c.rect(1, 0, 4, 9, s);
    c.col(4, 0, 9, dark(s));
    for (const [x, y] of [
      [1, 1],
      [2, 2],
      [3, 3],
      [1, 4],
      [2, 5],
      [3, 6],
      [1, 7],
      [2, 8],
    ])
      c.set(x, y, dark(s));
    c.row(9, 0, 5, C.sack);
    c.set(5, 9, dark(C.sack));
    c.rect(1, 10, 5, 11, s);
    c.clear(5, 10);
    c.row(11, 1, 5, dark(s));
    P(c, EARTH, [
      [2, 10],
      [3, 11],
      [3, 7],
    ]);
    c.set(1, 0, lite(s));
  });
  return { heads, torsos, arms, legs };
};
