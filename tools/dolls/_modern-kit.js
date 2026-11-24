/*
 * The vocabulary of the modern parts (tools/dolls/modern.js): the kit of make-dolls.js plus a few colours of today
 * (denim, hi-vis, pastel), short ways to add a part, and the things many heads share — glasses, headphones,
 * stubble, caps, beanies.
 */
module.exports = (kit, lists) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  let theme = '';
  /** Set many pixels of one colour: P(c, col, [x, y, x, y, ...]). */
  const P = (c, col, pts) => {
    for (let i = 0; i < pts.length; i += 2) c.set(pts[i], pts[i + 1], col);
  };
  const C = {
    denim: hex('#3f5068'),
    faded: hex('#62768c'),
    grey: hex('#77767c'),
    charcoal: hex('#35343c'),
    pj: hex('#8296ab'),
    khaki: hex('#8a7f55'),
    olive: hex('#535a36'),
    beige: hex('#b3a37c'),
    hivis: hex('#b0a43c'),
    orange: hex('#c06a2c'),
    silver: hex('#b4b8b8'),
    steel: hex('#6b7078'),
    pink: hex('#b8949a'),
    mint: hex('#93ad98'),
    sky: hex('#93aabd'),
    butter: hex('#cdbf8c'),
    lilac: hex('#a497b4'),
    leather: hex('#2a242a'),
    towel: hex('#c3cbcc'),
    brown: hex('#3a2c22'),
    tweed: hex('#6f6450'),
    lens: hex('#9fb4bd'),
    glow: hex('#7fd08a'),
    lip: hex('#9a4a4a'),
    rose: hex('#b97c78'),
    rubber: hex('#3f5a4a'),
    smock: hex('#9db3c4'),
  };

  /* ---------- on a face ---------- */
  /** Thin glasses: the frame sits beside the eyes, which stay free for the feelings. */
  const specs = (c, col) => P(c, col, [3, 6, 4, 6, 6, 6, 7, 6, 9, 6, 10, 6]);
  /** Big round glasses: a ring around each eye. */
  const rounds = (c, col) => P(c, col, [4, 5, 5, 5, 6, 5, 4, 6, 6, 6, 4, 7, 5, 7, 6, 7, 7, 5, 8, 5, 9, 5, 7, 6, 9, 6, 7, 7, 8, 7, 9, 7, 3, 6, 10, 6]);
  /** Sunglasses: they hide the eyes. */
  const shades = (c, col = K) => {
    c.row(6, 3, 10, col);
    c.row(7, 4, 5, col);
    c.row(7, 8, 9, col);
    c.set(4, 6, hex('#4a5560'));
    c.set(8, 6, hex('#4a5560'));
  };
  /** A day without shaving. */
  const stubble = (c, s, k = 0.8) => P(c, mix(s, k), [3, 8, 3, 9, 10, 8, 10, 9, 4, 9, 9, 9, 4, 10, 9, 10, 5, 11, 6, 11, 7, 11, 8, 11, 5, 8, 8, 8]);
  const moustache = (c, h) => {
    c.row(8, 5, 8, h);
    c.set(8, 8, dark(h));
  };
  /** A beard along the jaw that leaves the mouth free. */
  const beard = (c, h) => {
    P(c, h, [3, 7, 3, 8, 3, 9, 4, 9, 4, 10, 5, 10, 5, 11, 6, 11, 7, 11, 4, 8]);
    P(c, dark(h), [10, 7, 10, 8, 10, 9, 9, 9, 9, 10, 8, 10, 8, 11, 9, 8]);
  };
  const headphones = (c, col, band = C.charcoal) => {
    c.row(1, 4, 9, band);
    P(c, band, [3, 2, 10, 2, 2, 3, 11, 3, 2, 4, 11, 4]);
    c.rect(1, 5, 2, 7, col);
    c.rect(11, 5, 12, 7, dark(col));
    c.set(1, 5, lite(col));
  };
  /** A baseball cap seen from the front, the peak over the brow. */
  const ballcap = (c, col, badge) => {
    c.row(1, 5, 8, col);
    c.rect(4, 2, 9, 3, col);
    P(c, col, [3, 3, 10, 3]);
    c.set(5, 1, lite(col));
    c.set(10, 3, dark(col));
    c.row(4, 3, 11, dark(col));
    c.set(12, 4, dark(col));
    if (badge) c.set(6, 2, badge), c.set(7, 2, badge);
  };
  const beanie = (c, col, fold = dark(col)) => {
    c.row(0, 5, 8, col);
    c.rect(4, 1, 9, 2, col);
    P(c, col, [3, 2]);
    P(c, dark(col), [10, 2, 9, 1]);
    c.set(5, 0, lite(col));
    c.row(3, 3, 10, fold);
    c.row(4, 3, 10, fold);
    c.set(3, 3, lite(fold));
  };
  /** A peaked uniform cap: wide crown, band with a badge, shiny peak. */
  const peaked = (c, col, band = K, badge = GOLD) => {
    c.row(0, 4, 9, col);
    c.rect(3, 1, 10, 1, col);
    c.set(3, 1, lite(col));
    c.set(10, 1, dark(col));
    c.row(2, 3, 10, band);
    c.set(6, 1, badge);
    c.set(7, 1, badge);
    c.row(3, 3, 11, K);
    c.set(4, 3, C.charcoal);
  };

  const add = (kind, def) => lists[kind].push(Object.assign({ theme }, def));
  return {
    ...kit,
    C,
    P,
    specs,
    rounds,
    shades,
    stubble,
    moustache,
    beard,
    headphones,
    ballcap,
    beanie,
    peaked,
    theme(t) {
      theme = t;
    },
    /** A person: H(name, skin, expr, draw(c, s)). */
    H: (name, skin, expr, draw) => add('heads', { name, skin, expr, draw }),
    /** Anything else for a head: HS(name, draw(c)). */
    HS: (name, draw, opts) => add('heads', { name, special: true, draw, ...opts }),
    T: (name, draw, opts) => add('torsos', { name, draw, ...opts }),
    A: (name, draw, opts) => add('arms', { name, draw, ...opts }),
    L: (name, draw, opts) => add('legs', { name, draw, ...opts }),
    /** A long sleeve with a hand: rows 0..8 cloth, 9..10 skin. */
    sleeve(c, col, hand, cuff) {
      c.rect(1, 0, 3, 8, col);
      c.col(3, 0, 8, dark(col));
      c.set(1, 0, lite(col));
      if (cuff) c.row(8, 1, 3, cuff);
      c.rect(1, 9, 3, 10, hand);
      c.set(3, 10, dark(hand));
    },
    /** A short sleeve down to row `to`, then the bare arm. */
    shortSleeve(c, col, skin, to = 3) {
      c.rect(1, 0, 3, 10, skin);
      c.col(3, 0, 10, dark(skin));
      c.rect(1, 0, 3, to, col);
      c.col(3, 0, to, dark(col));
      c.set(1, 0, lite(col));
    },
    /** Trousers: rows 0..9; the shoe is up to the caller. */
    trousers(c, col) {
      c.rect(1, 0, 4, 9, col);
      c.col(4, 0, 9, dark(col));
      c.set(1, 0, lite(col));
    },
    /** A bare leg from row `from` down to the ankle (under a skirt or shorts). */
    bareLeg(c, skin, from) {
      c.rect(1, from, 4, 9, skin);
      c.col(4, from, 9, dark(skin));
    },
    /** A bare foot. */
    foot(c, skin) {
      c.rect(1, 10, 5, 11, skin);
      c.clear(5, 10);
      c.set(5, 11, dark(skin));
    },
  };
};
