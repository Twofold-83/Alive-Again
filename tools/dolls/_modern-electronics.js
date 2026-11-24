/* electronics — the lab and the server room. */
module.exports = (m) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe, C, P, H, HS, T, A, L } = m;
  const COAT = hex('#d0d0c6'),
    PLATE = hex('#c3c8c6'),
    SUIT = hex('#d3d6d2'),
    OIL = hex('#17151b'),
    BLACK = hex('#24212a'),
    CYAN = hex('#7fc4d0'),
    NITRILE = hex('#5f86a8'),
    JUMP = hex('#5f6873'),
    DIM = mix(C.glow, 0.8);

  /** The face of a machine that was made to look kind. */
  const android = (c) => {
    c.row(1, 4, 9, C.steel);
    c.row(2, 3, 10, C.steel);
    c.set(4, 1, lite(C.steel));
    c.set(5, 1, lite(C.steel));
    c.rect(3, 3, 10, 9, PLATE);
    c.row(10, 4, 9, PLATE);
    c.row(11, 5, 8, C.steel);
    c.col(3, 3, 9, C.steel);
    c.col(10, 3, 9, dark(C.steel));
    P(c, lite(PLATE), [4, 3, 5, 3, 4, 4]);
    P(c, dark(PLATE), [9, 4, 9, 5, 9, 7, 9, 8, 9, 9, 8, 10, 9, 10, 4, 8, 6, 7]);
    P(c, CYAN, [4, 6, 5, 6, 8, 6, 9, 6]);
    P(c, OIL, [4, 5, 5, 5, 8, 5, 9, 5]);
    c.row(9, 6, 7, dark(dark(PLATE)));
    P(c, C.steel, [2, 6, 11, 6, 6, 12, 7, 12]);
    c.set(2, 5, C.steel);
    c.set(11, 5, dark(C.steel));
    P(c, K, [6, 11]);
  };
  const goggleStrap = (c) => {
    c.row(6, 2, 11, C.charcoal);
    c.rect(4, 5, 5, 7, C.lens);
    c.rect(8, 5, 9, 7, C.lens);
    P(c, C.charcoal, [3, 5, 3, 7, 6, 5, 7, 5, 6, 7, 7, 7, 10, 5, 10, 7]);
    P(c, lite(C.lens), [4, 5, 8, 5]);
    P(c, K, [5, 6, 8, 6]);
  };

  /* ---------- heads ---------- */
  H('scientist goggles on forehead wild white hair pale old', 'pale', 'calm', (c, s) => {
    const h = HAIR.white;
    HAIRS.wild(c, h);
    P(c, h, [4, 0, 8, 1, 1, 4, 2, 4, 2, 6, 12, 4, 1, 2, 12, 2]);
    P(c, dark(h), [11, 4, 11, 6, 9, 0]);
    c.rect(3, 3, 10, 4, C.charcoal);
    c.rect(4, 3, 5, 4, C.lens);
    c.rect(8, 3, 9, 4, C.lens);
    P(c, lite(C.lens), [4, 3, 8, 3]);
    m.moustache(c, h);
  });
  H('scientist woman safety goggles black bun brown', 'brown', 'calm', (c, s) => {
    HAIRS.bun(c, HAIR.black);
    c.set(6, 0, mix(HAIR.black, 2.4));
    goggleStrap(c);
  });
  H('engineer headset microphone short black hair tan', 'tan', 'calm', (c, s) => {
    const h = HAIR.black;
    HAIRS.cropped(c, h);
    P(c, h, [3, 5, 10, 5]);
    c.row(1, 4, 9, C.steel);
    P(c, C.steel, [3, 2, 2, 3, 2, 4, 10, 2, 11, 3]);
    c.rect(1, 5, 2, 7, C.charcoal);
    c.set(1, 5, lite(C.charcoal));
    c.set(1, 6, RED);
    P(c, C.charcoal, [2, 8, 3, 9, 4, 10]);
    c.set(4, 10, K);
  });
  H('hacker black hood glowing green glasses pale', 'pale', 'calm', (c, s) => {
    HATS.hood(c, BLACK);
    P(c, lite(BLACK), [4, 1, 3, 2]);
    c.row(3, 4, 9, HAIR.black);
    P(c, HAIR.black, [4, 4, 5, 4]);
    P(c, C.glow, [4, 6, 5, 6, 8, 6, 9, 6]);
    P(c, lite(C.glow), [4, 6, 8, 6]);
    P(c, K, [6, 6, 7, 6, 4, 5, 5, 5, 8, 5, 9, 5]);
    P(c, mix(s, 0.8), [4, 7, 5, 7, 8, 7, 9, 7]);
    P(c, mix(C.glow, 0.6), [4, 8, 9, 8]); // the light of the screen
  });
  HS('android white faceplate cyan eyes robot', (c) => {
    android(c);
    P(c, dark(PLATE), [5, 4, 7, 4, 8, 4]); // a serial number
  });
  HS('android broken faceplate red eye wires robot', (c) => {
    android(c);
    c.rect(7, 3, 9, 6, OIL);
    P(c, OIL, [6, 3, 7, 7, 10, 4, 10, 5, 6, 5]);
    P(c, RED, [8, 6]);
    P(c, hex('#5a1818'), [9, 6, 8, 5]);
    P(c, GOLD, [7, 4, 8, 3]);
    P(c, C.steel, [9, 4, 9, 3, 7, 5]);
    P(c, RED, [10, 2, 11, 1]);
    P(c, dark(PLATE), [5, 7, 6, 8, 4, 9]); // the crack runs on
  });
  HS('clean-room suit white hood goggles face mask', (c) => {
    c.row(1, 4, 9, SUIT);
    c.row(2, 3, 10, SUIT);
    c.rect(2, 3, 11, 10, SUIT);
    c.row(11, 3, 10, SUIT);
    c.row(12, 4, 9, dark(SUIT));
    c.col(11, 3, 10, dark(SUIT));
    P(c, dark(SUIT), [10, 11, 10, 2, 6, 1, 6, 2, 6, 3]);
    P(c, lite(SUIT), [4, 1, 3, 2, 2, 3]);
    c.rect(3, 4, 10, 7, C.steel);
    c.rect(4, 5, 9, 6, C.lens);
    P(c, lite(C.lens), [4, 5, 5, 5]);
    P(c, dark(C.lens), [9, 6]);
    P(c, K, [5, 6, 8, 6]);
    P(c, dark(C.steel), [10, 4, 10, 5, 10, 6, 10, 7]);
    c.rect(4, 8, 9, 10, C.smock);
    c.row(9, 4, 9, dark(C.smock));
    P(c, dark(C.smock), [9, 8, 9, 10]);
  });
  H('vr visor headset brown hair fair', 'fair', 'calm', (c, s) => {
    HAIRS.parted(c, HAIR.brown);
    c.col(6, 1, 3, C.charcoal);
    c.col(7, 1, 3, K);
    c.rect(2, 4, 11, 7, C.charcoal);
    c.rect(3, 5, 10, 6, K);
    c.row(4, 2, 11, lite(C.charcoal));
    P(c, K, [11, 5, 11, 6, 11, 7]);
    P(c, CYAN, [4, 6, 5, 6, 6, 6]);
    P(c, mix(CYAN, 0.6), [7, 6, 8, 6, 4, 5]);
    c.set(10, 4, RED);
  });
  H('technician bald thick round glasses grey tufts pen behind ear fair', 'fair', 'calm', (c, s) => {
    const h = HAIR.grey;
    HAIRS.balding(c, h);
    P(c, h, [2, 5, 3, 6, 2, 6]);
    P(c, dark(h), [11, 5, 11, 6, 10, 6]);
    P(c, lite(s), [5, 3, 6, 3]);
    m.rounds(c, C.steel);
    P(c, C.lens, [4, 6, 6, 6, 7, 6, 9, 6]);
    P(c, RED, [11, 3, 11, 4]);
    c.set(11, 2, K);
  });
  H('lab assistant bouffant cap blue surgical mask tan', 'tan', 'calm', (c, s) => {
    const g = C.smock;
    c.row(0, 5, 8, g);
    c.row(1, 3, 10, g);
    c.rect(2, 2, 11, 3, g);
    P(c, g, [2, 4, 11, 4]);
    c.row(4, 3, 10, dark(g));
    P(c, dark(g), [11, 2, 11, 3, 11, 4, 10, 1, 6, 1, 8, 2, 4, 2]);
    P(c, lite(g), [4, 1, 5, 0, 3, 2]);
    c.rect(4, 8, 9, 10, WHITE);
    c.row(11, 5, 8, WHITE);
    P(c, WHITE, [3, 8, 10, 8]);
    c.row(9, 4, 9, dark(WHITE));
    P(c, dark(WHITE), [9, 10, 8, 11, 10, 8]);
  });
  H('test subject shaved head electrodes wires ashen', 'ashen', 'hollow', (c, s) => {
    const st = mix(s, 0.82);
    c.row(2, 4, 9, st);
    c.row(3, 3, 10, st);
    P(c, st, [3, 4, 10, 4]);
    P(c, C.silver, [4, 2, 7, 2, 9, 3]);
    P(c, RED, [4, 1, 3, 0]);
    P(c, NITRILE, [9, 2, 10, 1, 11, 0]);
    P(c, GOLD, [7, 1, 7, 0]);
    P(c, dark(s), [4, 8, 9, 8]);
    c.set(6, 4, hex('#7a3a3a')); // where the last one was
  });

  /* ---------- torsos ---------- */
  const labcoat = (c) => {
    const g = COAT;
    body(c, g);
    c.rect(5, 1, 6, 4, CLOTH.teal);
    P(c, dark(CLOTH.teal), [6, 1, 6, 2, 6, 3, 6, 4]);
    P(c, dark(g), [4, 2, 4, 3, 5, 4, 7, 2, 7, 3]);
    c.set(5, 4, g);
    c.col(5, 5, 9, dark(g));
    P(c, C.steel, [6, 6, 6, 8]);
    c.row(4, 7, 8, dark(g));
  };
  T('lab coat white pens id badge', (c) => {
    labcoat(c);
    P(c, RED, [7, 3]);
    P(c, CLOTH.navy, [8, 3]);
    c.rect(3, 5, 3, 6, WHITE);
    c.set(3, 5, C.sky);
    c.set(3, 4, C.steel);
  });
  T('lab coat white scorched acid burns', (c) => {
    labcoat(c);
    P(c, OIL, [3, 6, 3, 7, 4, 7, 2, 8, 3, 8]);
    P(c, C.brown, [2, 7, 4, 6, 4, 8, 3, 5, 2, 6]);
    P(c, DIM, [7, 6, 7, 7, 8, 8, 8, 5]);
    P(c, mix(C.glow, 0.55), [8, 6, 7, 8]);
    c.clear(2, 9);
    c.clear(3, 9);
  });
  T('anti-static smock pale blue esd warning patch', (c) => {
    const g = C.smock;
    body(c, g);
    c.row(1, 4, 7, lite(g));
    P(c, dark(g), [5, 2, 6, 2]);
    for (const x of [3, 7]) c.col(x, 2, 9, mix(g, 0.9));
    c.col(5, 3, 9, dark(g));
    P(c, K, [5, 4, 5, 6, 5, 8]);
    c.rect(7, 3, 8, 4, C.hivis);
    c.set(8, 4, K);
    c.set(7, 3, lite(C.hivis));
    P(c, K, [3, 8]);
    P(c, C.steel, [3, 9, 2, 9]);
  });
  T('jumpsuit grey zip orange shoulder flashes name tape', (c) => {
    const g = JUMP;
    body(c, g);
    c.row(1, 1, 2, C.orange);
    c.row(1, 9, 10, dark(C.orange));
    P(c, lite(g), [4, 1, 4, 2, 7, 1, 7, 2]);
    c.col(5, 2, 9, C.silver);
    c.set(5, 2, K);
    c.row(4, 2, 3, dark(g));
    c.row(4, 7, 9, dark(g));
    P(c, WHITE, [7, 3, 8, 3]);
    c.row(8, 2, 9, dark(g));
    c.set(5, 8, C.steel);
    c.set(6, 8, C.steel);
  });
  T('clean-room suit white zip blue trim', (c) => {
    const g = SUIT;
    body(c, g);
    c.row(1, 3, 8, dark(g));
    c.col(6, 2, 9, C.steel);
    c.set(6, 2, K);
    P(c, C.smock, [1, 1, 2, 1, 9, 1, 10, 1]);
    c.row(6, 2, 9, mix(g, 0.86));
    P(c, dark(g), [3, 6, 5, 6, 8, 6]);
    c.row(9, 2, 9, C.smock);
    c.set(9, 9, dark(C.smock));
    P(c, lite(g), [2, 2, 2, 3, 3, 2]);
    P(c, C.smock, [3, 4]);
  });
  T('hacker hoodie black green prompt', (c) => {
    const g = BLACK;
    body(c, g);
    c.row(1, 3, 8, K);
    P(c, K, [4, 2, 7, 2]);
    P(c, C.grey, [5, 3, 6, 3, 6, 4]);
    P(c, DIM, [3, 5, 4, 6, 3, 7, 6, 7, 7, 7]);
    c.row(9, 2, 9, K);
    P(c, lite(lite(g)), [2, 2, 2, 3]);
  });
  T('android chest plate cyan core exposed cables robot', (c) => {
    const g = PLATE;
    body(c, g);
    P(c, C.steel, [1, 1, 10, 1, 5, 1, 6, 1]);
    c.rect(4, 3, 7, 5, OIL);
    P(c, CYAN, [5, 4, 6, 4]);
    P(c, mix(CYAN, 0.6), [5, 3, 6, 5, 5, 5, 6, 3]);
    c.row(6, 2, 9, dark(g));
    c.rect(3, 8, 8, 9, C.steel);
    P(c, OIL, [4, 8, 6, 8, 7, 9, 3, 9]);
    P(c, RED, [5, 9]);
    P(c, GOLD, [5, 8]);
    P(c, dark(g), [2, 7, 9, 7, 3, 7, 8, 7]);
    P(c, lite(g), [2, 2, 3, 2, 2, 3]);
  });
  T('engineer shirt slate lanyard pass pocket protector', (c) => {
    const g = CLOTH.slate;
    body(c, g);
    P(c, lite(g), [4, 1, 4, 2, 7, 1, 7, 2]);
    P(c, RED, [4, 3, 5, 4, 7, 3, 6, 4]);
    c.rect(5, 5, 6, 6, WHITE);
    c.set(5, 5, C.sky);
    c.set(6, 6, dark(WHITE));
    c.rect(8, 3, 8, 4, WHITE);
    P(c, K, [8, 2]);
    P(c, RED, [9, 2]);
    c.row(9, 2, 9, K);
    P(c, C.silver, [5, 9]);
    c.rect(2, 8, 3, 9, C.hivis); // a tester on the belt
    c.set(2, 8, K);
  });

  /* ---------- arms ---------- */
  A('lab coat white sleeve blue nitrile glove', (c) => {
    m.sleeve(c, COAT, NITRILE);
    c.row(8, 1, 3, NITRILE);
    c.set(3, 8, dark(NITRILE));
    c.set(3, 9, dark(NITRILE));
    c.row(7, 1, 3, dark(COAT));
    c.set(1, 9, lite(NITRILE));
  });
  A('anti-static smock sleeve wrist strap coiled cable pale hand', (c) => {
    m.sleeve(c, C.smock, SKINS.pale);
    c.row(7, 1, 3, lite(C.smock));
    c.row(8, 1, 3, K);
    c.set(2, 8, C.silver);
    P(c, C.hivis, [4, 8, 4, 10, 4, 11]);
    P(c, dark(C.hivis), [4, 9]);
  }, { outline: true });
  A('android arm plates steel joints robot hand', (c) => {
    c.rect(1, 0, 3, 3, PLATE);
    c.col(3, 0, 3, dark(PLATE));
    c.set(1, 0, lite(PLATE));
    c.rect(2, 4, 2, 4, C.steel);
    c.set(1, 4, OIL);
    c.set(3, 4, OIL);
    c.rect(1, 5, 3, 8, PLATE);
    c.col(3, 5, 8, dark(PLATE));
    c.set(2, 6, CYAN);
    c.row(8, 1, 3, C.steel);
    P(c, C.steel, [1, 9, 2, 9, 3, 9, 1, 10, 3, 10]);
    P(c, dark(C.steel), [3, 9, 3, 10, 3, 8]);
    c.set(2, 10, OIL);
  });
  A('jumpsuit grey sleeve orange flash green rubber glove', (c) => {
    m.sleeve(c, JUMP, C.rubber);
    c.row(1, 1, 3, C.orange);
    c.set(3, 1, dark(C.orange));
    c.rect(1, 6, 3, 8, C.rubber);
    c.col(3, 6, 10, dark(C.rubber));
    c.row(6, 0, 4, lite(C.rubber));
  });

  /* ---------- legs ---------- */
  L('jumpsuit grey legs green rubber boots', (c) => {
    m.trousers(c, JUMP);
    c.rect(2, 2, 3, 3, dark(JUMP));
    c.rect(1, 6, 4, 9, C.rubber);
    c.col(4, 6, 9, dark(C.rubber));
    c.row(6, 0, 4, lite(C.rubber));
    c.set(5, 6, C.rubber);
    shoe(c, C.rubber);
    c.set(2, 8, lite(C.rubber));
  });
  L('lab coat hem white charcoal trousers black shoes', (c) => {
    m.trousers(c, C.charcoal);
    c.rect(1, 0, 4, 3, COAT);
    c.col(4, 0, 3, dark(COAT));
    c.row(3, 1, 4, dark(COAT));
    c.set(1, 2, C.steel);
    shoe(c, K);
    c.set(2, 10, C.charcoal);
  });
  L('clean-room suit white legs blue overshoes', (c) => {
    m.trousers(c, SUIT);
    c.col(2, 1, 7, lite(SUIT));
    c.row(8, 1, 4, dark(SUIT));
    c.row(9, 1, 4, C.smock);
    shoe(c, C.smock);
    c.set(4, 9, dark(C.smock));
    c.set(2, 10, lite(C.smock));
  });
  L('android legs plates steel knee joint robot feet', (c) => {
    c.rect(1, 0, 4, 3, PLATE);
    c.col(4, 0, 3, dark(PLATE));
    c.rect(2, 4, 3, 5, C.steel);
    P(c, OIL, [1, 4, 4, 4, 1, 5, 4, 5]);
    c.set(3, 5, dark(C.steel));
    c.rect(1, 6, 4, 9, PLATE);
    c.col(4, 6, 9, dark(PLATE));
    c.set(1, 6, lite(PLATE));
    c.set(2, 7, CYAN);
    c.row(9, 1, 4, C.steel);
    shoe(c, C.steel);
    c.set(1, 10, lite(C.steel));
  });
};
