/* suburban — the too-neat suburb. */
module.exports = (m) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe, C, P, H, T, A, L } = m;
  const PERM = hex('#a9a3b4'),
    LOAF = hex('#5a3a26');

  /* ---------- heads ---------- */
  H('dad neat side parting blond hair fair smile', 'fair', 'grin', (c, s) => {
    const h = HAIR.blond;
    HAIRS.parted(c, h);
    c.row(1, 5, 8, h);
    P(c, lite(h), [5, 1, 4, 2, 5, 2]);
    P(c, dark(h), [9, 2, 10, 3]);
    c.set(8, 3, s); // the parting, drawn with a ruler
    c.set(8, 2, dark(h));
  });
  H('housewife beehive blond hair red lipstick pale', 'pale', 'calm', (c, s) => {
    const h = HAIR.blond;
    c.row(0, 4, 9, h);
    c.rect(3, 1, 10, 3, h);
    P(c, h, [3, 4, 2, 3, 2, 4, 11, 3]);
    P(c, dark(h), [10, 1, 10, 2, 10, 3, 10, 4, 11, 4, 9, 0, 5, 2, 6, 2, 7, 1, 8, 1, 4, 3]);
    P(c, lite(h), [4, 0, 5, 0, 3, 1, 4, 1]);
    c.row(9, 6, 7, RED);
    c.set(5, 5, dark(s));
    c.set(8, 5, dark(s));
  });
  H('paper boy wine cap freckles tan', 'tan', 'grin', (c, s) => {
    P(c, HAIR.black, [3, 5, 10, 5]);
    m.ballcap(c, CLOTH.wine, WHITE);
    P(c, dark(s), [4, 7, 5, 8, 9, 7]);
  });
  H('postman peaked cap navy red band moustache brown', 'brown', 'calm', (c, s) => {
    P(c, HAIR.black, [3, 4, 3, 5, 10, 4, 10, 5]);
    m.peaked(c, CLOTH.navy, RED, GOLD);
    m.moustache(c, HAIR.black);
  });
  H('neighbour aviator sunglasses moustache brown hair tan', 'tan', 'grin', (c, s) => {
    const h = HAIR.brown;
    HAIRS.cropped(c, h);
    c.row(1, 5, 8, h);
    c.set(5, 1, lite(h));
    m.shades(c, K);
    P(c, GOLD, [3, 6, 6, 6, 7, 6, 10, 6]);
    m.moustache(c, h);
  });
  H('cheerleader high ponytail bow blond hair fair', 'fair', 'grin', (c, s) => {
    const h = HAIR.blond;
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    P(c, h, [3, 4, 4, 4, 10, 0, 11, 0, 11, 1, 12, 1, 12, 2, 12, 3, 11, 2]);
    P(c, dark(h), [10, 4, 12, 4, 12, 5, 11, 3, 13, 3]);
    c.set(5, 2, lite(h));
    P(c, CLOTH.wine, [8, 1, 9, 1, 10, 1, 9, 0]);
    c.set(9, 1, lite(CLOTH.wine));
    P(c, C.rose, [4, 7, 9, 7]);
  });
  H('scout campaign hat brown red hair freckles fair', 'fair', 'calm', (c, s) => {
    const t = hex('#7a6242');
    P(c, HAIR.red, [3, 4, 3, 5, 10, 4, 10, 5]);
    c.row(0, 5, 8, t);
    c.rect(4, 1, 9, 2, t);
    c.row(2, 4, 9, C.brown);
    c.row(3, 1, 12, t);
    P(c, lite(t), [5, 0, 4, 1, 1, 3, 2, 3, 3, 3]);
    P(c, dark(t), [9, 1, 11, 3, 12, 3, 8, 0]);
    c.set(6, 2, GOLD);
    P(c, dark(s), [4, 7, 5, 8, 9, 7, 8, 8]);
  });
  H('woman golf sun visor white brown bob tan', 'tan', 'grin', (c, s) => {
    const h = HAIR.brown;
    c.row(1, 4, 9, h);
    c.row(2, 3, 10, h);
    c.col(2, 3, 8, h);
    c.col(11, 3, 8, dark(h));
    P(c, h, [3, 5, 3, 6]);
    P(c, dark(h), [10, 5, 10, 6]);
    c.set(5, 1, lite(h));
    c.row(3, 3, 10, WHITE);
    c.row(4, 3, 11, dark(WHITE));
    c.set(12, 4, dark(WHITE));
    c.set(3, 3, C.steel);
  });
  H('old neighbour lady lilac perm cat-eye glasses pale', 'pale', 'calm', (c, s) => {
    HAIRS.curls(c, PERM);
    P(c, PERM, [4, 0, 6, 0, 9, 0, 2, 2, 11, 2, 3, 4]);
    P(c, dark(PERM), [5, 2, 8, 1, 10, 3, 10, 4]);
    m.specs(c, CLOTH.wine);
    P(c, CLOTH.wine, [3, 5, 10, 5]);
    P(c, dark(s), [4, 8, 9, 8]);
    c.row(9, 6, 7, C.lip);
  });
  H('boy crew cut red hair freckles sticking-out ears pale', 'pale', 'calm', (c, s) => {
    const h = HAIR.red;
    c.row(2, 4, 9, h);
    c.row(3, 4, 9, h);
    P(c, h, [3, 3, 3, 4]);
    P(c, dark(h), [10, 3, 10, 4, 9, 2]);
    c.set(6, 1, h); // a cowlick
    c.set(7, 1, h);
    c.set(7, 0, h);
    P(c, mix(s, 0.78), [4, 7, 5, 8, 9, 7, 8, 8, 4, 8]);
    P(c, s, [2, 6]); // ears that stick out
    P(c, dark(s), [11, 6]);
  });
  H('smiling neighbour slick black hair staring eyes ashen', 'ashen', 'grin', (c, s) => {
    const h = HAIR.black;
    c.row(1, 5, 9, h);
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    P(c, h, [3, 4, 10, 4]);
    P(c, mix(h, 2.6), [5, 2, 6, 1, 6, 2]);
    P(c, WHITE, [4, 6, 6, 6, 7, 6, 9, 6]); // he never blinks
    P(c, WHITE, [5, 9, 6, 9, 7, 9, 8, 9]);
    c.row(10, 5, 8, K);
    c.set(4, 9, K);
    c.set(9, 9, K);
  });

  /* ---------- torsos ---------- */
  T('polo shirt mint collar tucked belt', (c) => {
    const g = C.mint;
    body(c, g);
    P(c, lite(g), [3, 1, 4, 1, 4, 2, 7, 1, 8, 1, 7, 2]);
    P(c, dark(g), [5, 2, 5, 3, 6, 2, 5, 4]);
    c.set(6, 3, WHITE);
    c.set(8, 4, CLOTH.wine); // the little emblem
    c.row(9, 2, 9, LOAF);
    P(c, GOLD, [5, 9, 6, 9]);
  });
  T('pastel shirt pale blue wine tie pen pocket', (c) => {
    const g = C.sky;
    body(c, g);
    P(c, WHITE, [4, 1, 4, 2, 7, 1, 7, 2]);
    c.col(5, 2, 7, CLOTH.wine);
    c.col(6, 3, 6, dark(CLOTH.wine));
    c.set(6, 2, CLOTH.wine);
    c.row(4, 7, 8, dark(g));
    c.set(8, 3, K);
    c.row(9, 2, 9, C.brown);
    P(c, C.silver, [5, 9, 6, 9]);
  });
  T('barbecue apron navy striped ketchup stains over butter shirt', (c) => {
    const g = C.butter,
      a = CLOTH.navy;
    body(c, g);
    c.rect(3, 3, 8, 9, a);
    c.col(8, 3, 9, dark(a));
    P(c, a, [4, 1, 4, 2, 7, 1, 7, 2]);
    c.col(4, 3, 9, WHITE);
    c.col(7, 3, 9, dark(WHITE));
    c.row(7, 5, 6, lite(a)); // the pocket
    P(c, RED, [5, 5, 6, 6, 5, 6]);
    P(c, BLOOD, [6, 5, 3, 8]);
    c.set(2, 6, dark(g));
  });
  T('cheerleader top wine cream letter', (c) => {
    const g = CLOTH.wine,
      w = CLOTH.cream;
    body(c, g);
    P(c, w, [4, 1, 5, 2, 6, 2, 7, 1]);
    c.row(4, 4, 7, w);
    c.col(5, 5, 7, w);
    c.col(6, 5, 7, dark(w));
    c.row(9, 2, 9, w);
    c.set(9, 9, dark(w));
    c.row(8, 2, 9, dark(g));
  });
  T('scout shirt khaki wine neckerchief badges', (c) => {
    const g = C.khaki,
      n = CLOTH.wine;
    body(c, g);
    c.row(1, 3, 8, n);
    c.row(2, 4, 7, n);
    c.row(3, 5, 6, GOLD);
    P(c, n, [5, 4, 6, 4, 5, 5]);
    P(c, dark(n), [6, 5, 7, 2, 8, 1]);
    c.row(5, 2, 3, dark(g));
    c.row(5, 8, 9, dark(g));
    P(c, CLOTH.forest, [8, 3]);
    P(c, CLOTH.mustard, [3, 3]);
    P(c, RED, [2, 3]);
    c.row(9, 2, 9, C.brown);
    P(c, GOLD, [5, 9, 6, 9]);
  });
  T('postman jacket navy satchel strap letters', (c) => {
    const g = CLOTH.navy;
    body(c, g);
    P(c, RED, [4, 1, 7, 1]);
    c.set(5, 2, WHITE);
    c.set(6, 2, WHITE);
    c.col(5, 3, 9, dark(g));
    P(c, CLOTH.earth, [2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6]);
    c.rect(7, 7, 9, 9, CLOTH.earth);
    P(c, dark(CLOTH.earth), [9, 7, 9, 8, 9, 9, 7, 9, 8, 9]);
    P(c, WHITE, [8, 6, 9, 6]);
    P(c, GOLD, [8, 3]);
  });
  T('housewife dress pink white collar pearls', (c) => {
    const g = C.pink;
    body(c, g);
    P(c, WHITE, [3, 1, 4, 1, 4, 2, 7, 1, 8, 1, 7, 2]);
    P(c, BONE, [4, 3, 5, 4, 6, 4, 7, 3]);
    c.row(7, 2, 9, dark(g));
    c.set(5, 7, WHITE);
    c.set(6, 7, WHITE);
    P(c, dark(g), [3, 8, 3, 9, 6, 8, 6, 9, 8, 9]);
    P(c, lite(g), [2, 3, 2, 4]);
  });
  T('sweater vest butter argyle over white shirt tie', (c) => {
    const g = C.butter;
    body(c, WHITE);
    c.rect(2, 2, 9, 9, g);
    c.col(9, 2, 9, dark(g));
    c.set(2, 2, lite(g));
    P(c, WHITE, [5, 2, 6, 2, 5, 3, 6, 3]);
    P(c, CLOTH.forest, [5, 2, 5, 3]);
    P(c, dark(g), [4, 2, 4, 3, 5, 4, 7, 2, 7, 3, 6, 4]);
    P(c, CLOTH.forest, [3, 6, 4, 5, 4, 7, 5, 6]);
    P(c, CLOTH.wine, [6, 6, 7, 5, 7, 7, 8, 6]);
    c.row(9, 2, 9, dark(g));
  });

  /* ---------- arms ---------- */
  A('polo mint short sleeve fair arm', (c) => {
    m.shortSleeve(c, C.mint, SKINS.fair, 3);
    c.row(3, 1, 3, dark(C.mint));
  });
  A('pastel shirt pale blue sleeve white cuff watch tan hand', (c) => {
    m.sleeve(c, C.sky, SKINS.tan, WHITE);
    c.row(7, 1, 3, GOLD);
    c.set(3, 7, dark(GOLD));
  });
  A('cheerleader bare fair arm pompom wine cream', (c) => {
    const s = SKINS.fair,
      a = CLOTH.wine,
      w = CLOTH.cream;
    c.rect(1, 0, 3, 7, s);
    c.col(3, 0, 7, dark(s));
    c.set(1, 0, lite(s));
    c.rect(0, 7, 4, 11, a);
    P(c, w, [1, 7, 3, 8, 0, 9, 2, 10, 4, 10, 1, 11, 2, 8]);
    P(c, dark(a), [4, 8, 4, 11, 3, 11, 0, 7]);
    c.clear(0, 11);
    c.clear(4, 7);
  });
  A('scout khaki short sleeve badge fair arm', (c) => {
    m.shortSleeve(c, C.khaki, SKINS.fair, 4);
    c.row(4, 1, 3, dark(C.khaki));
    c.set(2, 2, CLOTH.forest);
    c.set(2, 1, CLOTH.mustard);
  });
  A('postman navy sleeve red cuff brown hand letter', (c) => {
    m.sleeve(c, CLOTH.navy, SKINS.brown, RED);
    c.rect(2, 9, 4, 11, WHITE);
    c.set(4, 11, dark(WHITE));
    c.set(3, 10, C.steel);
    c.set(1, 9, SKINS.brown);
    c.set(2, 9, SKINS.brown);
  });

  /* ---------- legs ---------- */
  L('chinos beige crease brown loafers', (c) => {
    m.trousers(c, C.beige);
    c.col(2, 1, 9, lite(C.beige));
    shoe(c, LOAF);
    c.set(3, 10, GOLD);
  });
  L('cheerleader pleated skirt wine cream fair legs white socks sneakers', (c) => {
    const s = SKINS.fair;
    m.bareLeg(c, s, 4);
    c.rect(1, 0, 4, 3, CLOTH.wine);
    c.col(2, 1, 3, CLOTH.cream);
    c.col(4, 0, 3, dark(CLOTH.wine));
    c.set(0, 3, CLOTH.wine);
    c.set(5, 3, dark(CLOTH.wine));
    c.rect(1, 8, 4, 9, WHITE);
    c.set(4, 9, dark(WHITE));
    shoe(c, WHITE);
    c.set(3, 10, CLOTH.wine);
  });
  L('scout shorts khaki fair knees forest knee socks brown shoes', (c) => {
    const s = SKINS.fair;
    m.bareLeg(c, s, 4);
    c.rect(1, 0, 4, 3, C.khaki);
    c.col(4, 0, 3, dark(C.khaki));
    c.row(3, 1, 4, dark(C.khaki));
    c.rect(1, 6, 4, 9, CLOTH.forest);
    c.col(4, 6, 9, dark(CLOTH.forest));
    c.row(6, 1, 4, lite(CLOTH.forest));
    c.set(4, 7, RED);
    shoe(c, C.brown);
  });
  L('postman trousers navy red stripe black shoes', (c) => {
    m.trousers(c, CLOTH.navy);
    c.col(3, 0, 9, RED);
    shoe(c, K);
    c.set(2, 10, C.charcoal);
  });
  L('housewife skirt pink pale nylon legs wine heels', (c) => {
    const s = mix(SKINS.pale, 0.9);
    m.bareLeg(c, s, 6);
    c.clear(1, 7);
    c.clear(1, 8);
    c.clear(1, 9);
    c.rect(1, 0, 4, 5, C.pink);
    c.col(4, 0, 5, dark(C.pink));
    c.col(2, 1, 5, dark(C.pink));
    c.row(5, 1, 4, lite(C.pink));
    c.set(4, 5, C.pink);
    P(c, CLOTH.wine, [2, 10, 3, 10, 4, 10, 2, 11, 4, 11, 5, 11]);
    c.set(3, 10, s);
  });
};
