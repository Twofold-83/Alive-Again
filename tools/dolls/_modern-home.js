/* modernhome — a family at home today. */
module.exports = (m) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, RED, GOLD, hex, mix, dark, lite, body, shoe, C, P, H, T, A, L } = m;
  const TARTAN = hex('#6e3540');

  /* ---------- heads ---------- */
  H('mum messy bun brown hair fair tired', 'fair', 'calm', (c, s) => {
    const h = HAIR.brown;
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.row(4, 3, 5, h);
    P(c, h, [3, 5, 2, 4, 2, 5, 2, 6, 2, 7]);
    P(c, dark(h), [10, 4, 11, 4, 11, 5]);
    c.rect(8, 0, 10, 1, h); // the bun, slipping to one side
    c.set(10, 1, dark(h));
    c.set(8, 0, lite(h));
    P(c, dark(s), [4, 7, 5, 7, 8, 7, 9, 7]); // she has not slept
  });
  H('dad glasses stubble short black hair tan', 'tan', 'calm', (c, s) => {
    HAIRS.cropped(c, HAIR.black);
    P(c, HAIR.black, [3, 5, 10, 5]);
    c.set(5, 2, lite(HAIR.black));
    m.stubble(c, s);
    m.specs(c, C.steel);
  });
  H('teenager headphones black fringe hair pale', 'pale', 'calm', (c, s) => {
    const h = HAIR.black;
    HAIRS.fringe(c, h);
    P(c, h, [3, 5, 4, 5, 5, 5, 3, 6]);
    m.headphones(c, CLOTH.wine);
    c.set(4, 9, dark(s)); // a spot
  });
  H('child bowl cut blond hair fair rosy cheeks', 'fair', 'grin', (c, s) => {
    const h = HAIR.blond;
    c.row(1, 4, 9, h);
    c.rect(3, 2, 10, 4, h);
    P(c, h, [2, 3, 2, 4, 2, 5, 3, 5]);
    P(c, dark(h), [11, 3, 11, 4, 11, 5, 10, 5, 10, 4]);
    c.set(5, 1, lite(h));
    c.set(6, 1, lite(h));
    P(c, C.rose, [4, 7, 9, 7]);
  });
  H('grandmother white bun gold glasses pale old', 'pale', 'calm', (c, s) => {
    const h = HAIR.white;
    HAIRS.bun(c, h);
    P(c, h, [3, 5, 2, 4, 2, 5]);
    P(c, dark(h), [11, 4, 11, 5, 10, 5, 7, 0, 7, 1]);
    m.specs(c, GOLD);
    P(c, dark(s), [4, 8, 9, 8, 5, 4, 8, 4]); // lines
    c.set(11, 7, GOLD);
  });
  H('grandfather bald white moustache tufts brown old', 'brown', 'calm', (c, s) => {
    const h = HAIR.white;
    P(c, h, [2, 5, 2, 6, 3, 5, 3, 6, 3, 4]);
    P(c, dark(h), [11, 5, 11, 6, 10, 5, 10, 6, 10, 4]);
    c.set(5, 3, lite(s));
    c.set(6, 3, lite(s));
    c.row(8, 4, 9, h);
    P(c, h, [4, 9]);
    P(c, dark(h), [9, 9, 9, 8]);
    P(c, dark(s), [5, 4, 6, 4, 7, 4]); // a furrowed brow
  });
  H('girl afro puffs black hair brown child hair clip', 'brown', 'grin', (c, s) => {
    const h = HAIR.black;
    c.row(2, 4, 9, h);
    c.row(3, 3, 10, h);
    c.rect(1, 1, 3, 3, h);
    c.rect(10, 1, 12, 3, h);
    P(c, h, [2, 0, 11, 0, 2, 4, 11, 4, 0, 2, 13, 2]);
    P(c, lite(lite(h)), [2, 1, 11, 1]);
    c.set(4, 3, C.hivis);
    c.set(9, 3, C.hivis);
  });
  H('man sleep mask on forehead messy brown hair ashen bags tired', 'ashen', 'calm', (c, s) => {
    const h = HAIR.brown;
    HAIRS.wild(c, h);
    c.set(4, 0, h);
    c.set(8, 1, h);
    c.rect(3, 3, 10, 4, CLOTH.navy);
    c.row(3, 3, 10, lite(CLOTH.navy));
    P(c, CLOTH.navy, [2, 4, 11, 4]);
    P(c, dark(s), [4, 7, 5, 7, 8, 7, 9, 7]);
    m.stubble(c, s, 0.85);
  });
  H('mum headwrap mustard gold earrings brown', 'brown', 'calm', (c, s) => {
    const w = CLOTH.mustard;
    c.row(0, 5, 9, w);
    c.rect(3, 1, 10, 3, w);
    P(c, w, [3, 4, 2, 2, 2, 3]);
    P(c, dark(w), [10, 4, 11, 2, 11, 3, 10, 1, 10, 2, 10, 3]);
    c.row(2, 4, 8, dark(w)); // one fold across
    c.set(9, 1, dark(w));
    P(c, lite(w), [4, 1, 5, 0, 5, 1]);
    P(c, w, [10, 0, 11, 0, 11, 1]); // the knot
    P(c, GOLD, [2, 8, 11, 8]);
    c.row(9, 6, 7, C.lip);
  });
  H('teenager grey hood up black fringe over one eye tan', 'tan', 'calm', (c, s) => {
    HATS.hood(c, C.grey);
    c.row(1, 4, 9, lite(C.grey));
    const h = HAIR.black;
    c.rect(4, 3, 9, 4, h);
    P(c, h, [4, 5, 5, 5, 6, 5, 4, 6, 5, 6, 4, 7]);
    c.set(9, 4, dark(h));
  });
  H('toddler baby dummy pacifier one curl fair', 'fair', 'calm', (c, s) => {
    const h = HAIR.blond;
    P(c, h, [6, 2, 7, 2, 7, 1, 8, 1, 6, 3]);
    P(c, C.rose, [4, 8, 9, 8]);
    c.rect(5, 9, 8, 10, C.sky);
    c.rect(6, 9, 7, 10, WHITE);
    c.set(7, 10, dark(WHITE));
    c.set(5, 5, WHITE);
    c.set(8, 5, WHITE);
  });

  /* ---------- torsos ---------- */
  T('dressing gown wine belt', (c) => {
    const g = CLOTH.wine;
    body(c, g);
    c.rect(5, 1, 6, 3, CLOTH.cream);
    P(c, lite(g), [4, 1, 4, 2, 4, 3, 5, 4, 5, 5]);
    P(c, lite(g), [7, 1, 7, 2, 7, 3, 6, 4]);
    c.col(6, 5, 6, dark(g));
    c.row(7, 2, 9, C.rose);
    c.set(9, 7, dark(C.rose));
    P(c, C.rose, [4, 8, 4, 9]);
    c.set(5, 7, lite(C.rose));
    c.set(8, 5, dark(g)); // a pocket
    c.set(7, 5, dark(g));
  });
  T('hoodie grey kangaroo pocket drawstrings', (c) => {
    const g = C.grey;
    body(c, g);
    c.row(1, 3, 8, dark(g));
    P(c, dark(g), [4, 2, 7, 2]);
    P(c, WHITE, [5, 3, 5, 4, 6, 3, 6, 4, 6, 5]);
    c.row(6, 3, 8, dark(g));
    P(c, dark(g), [3, 7, 8, 7]);
    c.row(9, 2, 9, dark(g));
  });
  T('t-shirt teal faded print', (c) => {
    const g = CLOTH.teal;
    body(c, g);
    c.row(1, 4, 7, dark(g));
    P(c, dark(g), [5, 2, 6, 2]);
    const f = mix(C.butter, 0.85);
    c.rect(4, 4, 7, 7, f);
    P(c, g, [4, 4, 7, 4, 4, 7, 7, 7]);
    P(c, dark(g), [5, 5, 6, 5, 5, 6]);
  });
  T('pyjama top striped pale blue buttons', (c) => {
    const g = C.pj;
    body(c, g);
    for (const x of [3, 8]) c.col(x, 2, 9, dark(g));
    c.col(2, 3, 9, lite(g));
    c.col(5, 2, 9, WHITE);
    P(c, dark(g), [5, 3, 5, 5, 5, 7]);
    P(c, WHITE, [4, 1, 4, 2, 7, 1, 7, 2, 6, 3]);
    c.row(5, 7, 8, WHITE); // the breast pocket
  });
  T('kitchen apron cream over forest jumper stained', (c) => {
    const g = CLOTH.forest,
      a = CLOTH.cream;
    body(c, g);
    c.rect(4, 3, 7, 5, a);
    c.rect(2, 6, 9, 9, a);
    P(c, a, [4, 1, 4, 2, 7, 1, 7, 2]);
    c.col(9, 6, 9, dark(a));
    c.row(6, 2, 9, dark(a));
    c.rect(4, 7, 7, 8, mix(a, 0.9)); // the pocket
    c.row(7, 4, 7, dark(a));
    P(c, CLOTH.rust, [6, 4, 3, 8, 7, 9, 6, 5]);
  });
  T('cardigan mustard buttoned over cream shirt', (c) => {
    const g = CLOTH.mustard;
    body(c, g);
    c.rect(5, 1, 6, 4, CLOTH.cream);
    P(c, dark(CLOTH.cream), [5, 2, 6, 2]);
    P(c, lite(g), [4, 1, 4, 2, 4, 3, 7, 1, 7, 2, 7, 3]);
    c.col(5, 5, 9, dark(g));
    P(c, C.brown, [6, 5, 6, 7, 6, 9]);
    c.row(9, 2, 4, dark(g));
    c.row(9, 7, 9, dark(g));
    P(c, dark(g), [3, 6, 8, 6]); // pockets
  });
  T('flannel shirt rust check open collar', (c) => {
    const g = CLOTH.rust;
    body(c, g);
    for (let y = 2; y <= 9; y++)
      for (let x = 2; x <= 9; x++) {
        const a = x % 3 === 0,
          b = y % 3 === 1;
        if (a && b) c.set(x, y, C.charcoal);
        else if (a || b) c.set(x, y, dark(g));
      }
    c.rect(5, 1, 6, 2, WHITE);
    P(c, lite(g), [4, 1, 4, 2, 7, 1, 7, 2]);
    c.set(1, 1, lite(g));
  });
  T('knitted jumper navy zigzag child', (c) => {
    const g = CLOTH.navy;
    body(c, g);
    for (let x = 2; x <= 9; x++) {
      c.set(x, 4 + (x % 2), CLOTH.cream);
      c.set(x, 6 + (x % 2), CLOTH.wine);
    }
    c.row(1, 4, 7, lite(g));
    c.row(9, 2, 9, dark(g));
    c.set(9, 4, dark(CLOTH.cream));
  });

  /* ---------- arms ---------- */
  A('dressing gown wine sleeve wide cuff fair hand', (c) => {
    m.sleeve(c, CLOTH.wine, SKINS.fair);
    c.rect(0, 6, 4, 8, CLOTH.wine);
    c.row(8, 0, 4, C.rose);
    c.set(4, 7, dark(CLOTH.wine));
    c.set(4, 6, dark(CLOTH.wine));
  });
  A('hoodie grey sleeve tan hand', (c) => {
    m.sleeve(c, C.grey, SKINS.tan, dark(C.grey));
    c.row(7, 1, 3, dark(C.grey));
    c.set(2, 3, dark(C.grey));
  });
  A('t-shirt teal short sleeve bare brown arm watch', (c) => {
    m.shortSleeve(c, CLOTH.teal, SKINS.brown, 2);
    c.row(8, 1, 3, K);
    c.set(2, 8, C.silver);
  });
  A('pyjama striped pale blue sleeve pale hand', (c) => {
    m.sleeve(c, C.pj, SKINS.pale, WHITE);
    c.col(2, 0, 7, dark(C.pj));
  });
  A('cardigan mustard sleeve cream cuff elbow patch pale hand', (c) => {
    m.sleeve(c, CLOTH.mustard, SKINS.pale, CLOTH.cream);
    c.row(7, 1, 3, dark(CLOTH.mustard));
    P(c, CLOTH.earth, [3, 4, 3, 5, 2, 4]);
  });

  /* ---------- legs ---------- */
  L('dressing gown wine hem bare fair shins tartan slippers', (c) => {
    const g = CLOTH.wine;
    m.bareLeg(c, SKINS.fair, 6);
    c.rect(1, 0, 4, 6, g);
    c.col(4, 0, 6, dark(g));
    c.row(6, 1, 4, C.rose);
    c.clear(1, 7);
    c.clear(1, 8);
    c.clear(1, 9);
    shoe(c, TARTAN);
    P(c, CLOTH.cream, [3, 10, 4, 10]);
  });
  L('jeans blue slippers grey', (c) => {
    m.trousers(c, C.denim);
    c.col(2, 1, 8, lite(C.denim));
    c.set(3, 0, dark(C.denim));
    c.row(9, 1, 4, C.faded); // turned up
    shoe(c, C.grey);
    c.set(4, 10, lite(C.grey));
  });
  L('pyjama trousers striped pale blue bare feet pale', (c) => {
    m.trousers(c, C.pj);
    c.col(2, 0, 9, dark(C.pj));
    c.row(0, 1, 4, WHITE);
    m.foot(c, SKINS.pale);
  });
  L('jogging bottoms grey white socks', (c) => {
    m.trousers(c, C.grey);
    c.row(9, 1, 4, dark(C.grey));
    c.set(2, 1, WHITE); // the cord
    c.set(1, 4, lite(C.grey)); // a baggy knee
    c.set(1, 5, lite(C.grey));
    shoe(c, WHITE);
    c.set(1, 10, dark(WHITE));
  });
  L('child shorts navy fair knees plaster striped socks', (c) => {
    m.bareLeg(c, SKINS.fair, 4);
    c.rect(1, 0, 4, 3, CLOTH.navy);
    c.col(4, 0, 3, dark(CLOTH.navy));
    c.set(2, 5, CLOTH.cream); // a plaster on the knee
    c.set(3, 5, CLOTH.cream);
    c.rect(1, 8, 4, 9, WHITE);
    c.row(8, 1, 4, CLOTH.wine);
    shoe(c, WHITE);
    c.row(10, 1, 4, CLOTH.wine);
  });
};
