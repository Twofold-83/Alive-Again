/*
 * People: heroes, townsfolk, modern people and the adventure cast, drawn as whole fixed figures in the look of the
 * paper dolls (tools/make-dolls.js). A figure is put together the way the game puts a doll together — a leg
 * sprite twice, a torso, an arm sprite twice, a head, each with its own dark outline — so a ready-made person
 * and a doll standing next to each other are the same kind of creature: 16 x 33 for an adult, 12 x 24 for a child.
 * What a person carries or wears beyond that (a staff, a cape, a tall hat) is drawn around the figure and the
 * canvas grows by the same amount on both sides, so the body stays in the middle and the feet on the bottom row.
 */
module.exports = (kit) => {
  const { C, K, hex, mix, blend, dark, lite, canvas } = kit;
  const WHITE = C.white,
    BONE = C.bone,
    BLOOD = C.blood,
    RED = C.red,
    GOLD = C.gold;
  /* the doll colours */
  const SKINS = { pale: '#d6c2a6', fair: '#c79f7c', tan: '#a57a52', brown: '#6d4c36', ashen: '#9aa29a', rotten: '#7c9668', drowned: '#8fa6bb' };
  const HAIR = { black: '#1b1722', brown: '#4b3122', red: '#853822', blond: '#bfa04e', grey: '#86837f', white: '#d3d0c6', ginger: '#a3552a' };
  const CLOTH = {
    wine: '#6b2332',
    navy: '#28304e',
    forest: '#2e4835',
    mustard: '#a07e2c',
    slate: '#565663',
    earth: '#584031',
    plum: '#48305a',
    teal: '#2e5658',
    cream: '#c8bea3',
    black: '#1e1b24',
    rust: '#84482a',
    ash: '#8d8a84',
    /* a few more, as muted as the rest */
    white: '#e4dfd0',
    red: '#a3302a',
    pink: '#a8697a',
    orange: '#b0642a',
    sky: '#5a7a96',
    blue: '#3a4f7e',
    green: '#4f6b3c',
    yellow: '#c2a83a',
    khaki: '#8a7d54',
    leather: '#6b4630',
    purple: '#5e3d78',
    denim: '#3f5270',
    steel: '#8b8e98',
    silver: '#a9acb4',
    iron: '#4a4a55',
    gold: '#b8963a',
    scrubs: '#4f8a84',
    bone: '#d8d0b4',
    straw: '#a8904e',
    lime: '#7f9a4a',
    grey: '#6f6d72',
    brown: '#584031',
    charcoal: '#33323a',
  };
  for (const o of [SKINS, HAIR, CLOTH]) for (const k of Object.keys(o)) o[k] = hex(o[k]);
  const cl = (n) => (Array.isArray(n) ? n : CLOTH[n] || C[n] || (n && n[0] === '#' ? hex(n) : null) || CLOTH.slate);
  const hc = (n) => (Array.isArray(n) ? n : HAIR[n] || cl(n));
  const sk = (n) => (Array.isArray(n) ? n : SKINS[n] || cl(n));
  const sp = (s) => (Array.isArray(s) ? s : String(s).split(' '));
  const STEEL = CLOTH.steel,
    WOOD = C.wood,
    WOODD = C.woodDark,
    TEAR = hex('#6f8fae'),
    BELT = hex('#9c8a62'),
    BOOT = hex('#3a2c22');

  /* a canvas seen through an offset: draw in doll coordinates wherever the doll stands */
  function view(base, dx, dy) {
    const v = canvas(1, 1);
    v.set = (x, y, col) => base.set(Math.round(x) + dx, Math.round(y) + dy, col);
    v.get = (x, y) => base.get(x + dx, y + dy);
    v.clear = (x, y) => base.clear(x + dx, y + dy);
    return v;
  }
  const done = (c, shade) => {
    if (shade) c.shade();
    c.outline();
    return c;
  };

  /* the builds: face, torso, arm and leg sizes */
  const ADULT = { FW: 8, FH: 9, TW: 8, TH: 8, AW: 3, AL: 11, LW: 4, LL: 10 };
  const GEO = {
    adult: ADULT,
    teen: { ...ADULT, TH: 7, AL: 10, LL: 9 },
    old: { ...ADULT, LL: 9 },
    short: { ...ADULT, TH: 7, AL: 9, LL: 5 },
    kid: { FW: 6, FH: 7, TW: 6, TH: 5, AW: 2, AL: 7, LW: 3, LL: 6 },
  };

  /* =====================================================================================
   * HEADS.  f = { L, R, T, B, M, E, e0, e1 }: the face box, its middle column, the eye row and the eye columns.
   * On the doll L = 3, R = 10, T = 3, B = 11, M = 6, E = 6.
   * ===================================================================================== */
  function face(c, f, skin) {
    const { L, R, T, B, M } = f;
    c.row(T, L + 1, R - 1, skin);
    c.rect(L, T + 1, R, B - 2, skin);
    c.row(B - 1, L + 1, R - 1, skin);
    c.row(B, L + 2, R - 2, skin);
    c.col(R, T + 2, B - 3, dark(skin));
    c.set(R - 1, B - 1, dark(skin));
    if (!f.kid) c.set(M + 1, f.E + 1, dark(skin));
    c.set(L, T + 1, lite(skin));
    c.set(L + 1, T, lite(skin));
  }
  const EXPR = {
    calm(c, f, s) {
      c.set(f.e0, f.E, K);
      c.set(f.e1, f.E, K);
      if (f.mouth) c.row(f.B - 2, f.M, f.M + 1, dark(dark(s)));
    },
    smile(c, f, s) {
      c.set(f.e0, f.E, K);
      c.set(f.e1, f.E, K);
      if (f.mouth) {
        c.row(f.B - 2, f.M, f.M + 1, dark(dark(s)));
        if (!f.kid) {
          c.set(f.M - 1, f.B - 3, dark(s));
          c.set(f.M + 2, f.B - 3, dark(s));
        }
      }
    },
    scared(c, f) {
      c.set(f.e0, f.E - 1, WHITE);
      c.set(f.e1, f.E - 1, WHITE);
      c.set(f.e0, f.E, K);
      c.set(f.e1, f.E, K);
      if (f.mouth) c.rect(f.M, f.B - 2, f.M + 1, f.B - 1, K);
    },
    angry(c, f) {
      c.set(f.e0 - 1, f.E - 1, K);
      c.set(f.e0, f.E - 1, K);
      c.set(f.e1, f.E - 1, K);
      c.set(f.e1 + 1, f.E - 1, K);
      c.set(f.e0, f.E, RED);
      c.set(f.e1, f.E, RED);
      if (f.mouth) c.row(f.B - 2, f.M - 1, f.M + 2, K);
    },
    stern(c, f, s) {
      c.row(f.E - 1, f.e0 - 1, f.e0, dark(dark(s)));
      c.row(f.E - 1, f.e1, f.e1 + 1, dark(dark(s)));
      c.set(f.e0, f.E, K);
      c.set(f.e1, f.E, K);
      if (f.mouth) c.row(f.B - 2, f.M, f.M + 1, dark(dark(s)));
    },
    hollow(c, f, s) {
      c.rect(f.e0 - 1, f.E - 1, f.e0, f.E, K);
      c.rect(f.e1, f.E - 1, f.e1 + 1, f.E, K);
      if (f.mouth) c.row(f.B - 2, f.M, f.M + 1, dark(dark(s)));
    },
    grin(c, f) {
      c.set(f.e0, f.E, K);
      c.set(f.e1, f.E, K);
      if (f.mouth) {
        c.set(f.M - 2, f.B - 3, K);
        c.set(f.M + 3, f.B - 3, K);
        c.row(f.B - 2, f.M - 1, f.M + 2, K);
        c.set(f.M, f.B - 2, WHITE);
        c.set(f.M + 1, f.B - 2, WHITE);
      }
    },
    weeping(c, f) {
      c.set(f.e0, f.E, K);
      c.set(f.e1, f.E, K);
      c.col(f.e0, f.E + 1, f.E + 2, TEAR);
      c.col(f.e1, f.E + 1, f.E + 3, TEAR);
      if (f.mouth) c.row(f.B - 2, f.M, f.M + 1, K);
    },
    old(c, f, s) {
      c.set(f.e0, f.E, K);
      c.set(f.e1, f.E, K);
      c.set(f.e0 - 1, f.E + 1, dark(s));
      c.set(f.e1 + 1, f.E + 1, dark(s));
      c.row(f.T + 1, f.M, f.M + 1, dark(s));
      if (f.mouth) c.row(f.B - 2, f.M, f.M + 1, dark(dark(s)));
    },
    none() {},
  };
  const HAIRS = {
    bald() {},
    cropped(c, { L, R, T }, h) {
      c.row(T - 1, L + 1, R - 1, h);
      c.row(T, L, R, h);
      c.set(L, T + 1, h);
      c.set(R, T + 1, dark(h));
    },
    parted(c, { L, R, T, M }, h) {
      c.row(T - 1, L + 1, R - 1, h);
      c.row(T, L, R, h);
      c.row(T + 1, L, M + 1, h);
      c.set(L, T + 2, h);
      c.set(R, T + 1, dark(h));
      c.set(M + 2, T - 1, lite(h));
    },
    long(c, { L, R, T, B }, h) {
      c.row(T - 2, L + 1, R - 1, h);
      c.row(T - 1, L, R, h);
      c.row(T, L - 1, R + 1, h);
      c.col(L - 1, T + 1, B, h);
      c.col(R + 1, T + 1, B, dark(h));
      c.col(L, T + 1, T + 3, h);
      c.set(R, T + 1, dark(h));
    },
    /* long hair that falls on to the shoulders */
    flowing(c, f, h) {
      HAIRS.long(c, f, h);
      c.col(f.L - 1, f.B, f.B + 3, h);
      c.col(f.L, f.B, f.B + 2, h);
      c.col(f.R + 1, f.B, f.B + 3, dark(h));
      c.col(f.R, f.B, f.B + 2, dark(h));
    },
    bob(c, { L, R, T }, h) {
      c.row(T - 1, L + 1, R - 1, h);
      c.row(T, L, R, h);
      c.col(L - 1, T + 1, T + 5, h);
      c.col(R + 1, T + 1, T + 5, dark(h));
      c.row(T + 1, L, R - 1, h);
    },
    ponytail(c, { L, R, T }, h) {
      c.row(T - 1, L + 1, R - 1, h);
      c.row(T, L, R, h);
      c.set(L, T + 1, h);
      c.set(R + 1, T + 1, h);
      c.set(R + 2, T + 2, h);
      c.col(R + 2, T + 3, T + 5, dark(h));
    },
    mohawk(c, { T, M }, h) {
      c.col(M, T - 4, T, h);
      c.col(M + 1, T - 4, T, dark(h));
      c.set(M, T - 4, lite(h));
      c.set(M - 1, T - 2, h);
      c.set(M + 2, T - 1, dark(h));
    },
    curls(c, { L, R, T }, h) {
      c.row(T - 2, L + 1, R - 1, h);
      c.row(T - 1, L, R, h);
      c.row(T, L - 1, R + 1, h);
      c.set(L - 1, T + 1, h);
      c.set(R + 1, T + 1, dark(h));
      c.set(L, T - 2, h);
      c.set(R, T - 2, h);
      c.set(L + 2, T - 3, h);
      c.set(R - 2, T - 3, h);
      c.set(L - 1, T + 2, h);
      c.set(R + 1, T + 2, dark(h));
    },
    /* a full head of curls down to the jaw */
    curly(c, f, h) {
      HAIRS.curls(c, f, h);
      const { L, R, T } = f;
      c.col(L - 1, T + 1, T + 6, h);
      c.col(R + 1, T + 1, T + 6, dark(h));
      c.set(L - 2, T + 2, h);
      c.set(L - 2, T + 4, h);
      c.set(R + 2, T + 3, dark(h));
      c.set(R + 2, T + 5, dark(h));
      c.set(L, T + 1, h);
    },
    afro(c, { L, R, T }, h) {
      c.row(T - 4, L + 1, R - 1, h);
      c.rect(L - 1, T - 3, R + 1, T - 2, h);
      c.rect(L - 2, T - 2, R + 2, T, h);
      c.rect(L - 2, T + 1, L - 1, T + 3, h);
      c.rect(R + 1, T + 1, R + 2, T + 3, dark(h));
      c.set(L, T + 1, h);
      c.set(R, T + 1, h);
      c.set(L, T - 3, lite(h));
      c.col(R + 2, T - 2, T, dark(h));
    },
    bun(c, { L, R, T, M }, h) {
      c.rect(M, T - 3, M + 1, T - 2, h);
      c.row(T - 1, L + 1, R - 1, h);
      c.row(T, L, R, h);
      c.set(L, T + 1, h);
      c.set(R, T + 1, dark(h));
    },
    wild(c, { L, R, T, M }, h) {
      c.row(T, L, R, h);
      c.row(T - 1, L, R, h);
      for (let x = L; x < R; x += 2) c.set(x, T - 2, h);
      for (const x of [L - 1, M, R]) c.set(x, T - 3, h);
      c.set(L - 1, T, h);
      c.set(R + 1, T, dark(h));
      c.set(L - 1, T + 2, h);
      c.set(R + 1, T + 2, dark(h));
    },
    pigtails(c, { L, R, T }, h) {
      c.row(T - 1, L + 1, R - 1, h);
      c.row(T, L, R, h);
      c.set(L - 1, T + 2, h);
      c.col(L - 2, T + 3, T + 5, h);
      c.set(R + 1, T + 2, h);
      c.col(R + 2, T + 3, T + 5, dark(h));
    },
    curtain(c, { L, R, T, B }, h) {
      c.row(T - 2, L + 1, R - 1, h);
      c.row(T - 1, L, R, h);
      c.rect(L - 1, T, R + 1, T + 2, h);
      c.col(L - 1, T + 3, B, h);
      c.col(L, T + 3, T + 6, h);
      c.col(L + 1, T + 3, T + 4, h);
      c.col(R + 1, T + 3, B, dark(h));
      c.col(R, T + 3, T + 6, dark(h));
    },
    balding(c, { L, R, T }, h) {
      c.set(L, T + 1, h);
      c.set(L, T + 2, h);
      c.set(R, T + 1, dark(h));
      c.set(R, T + 2, dark(h));
      c.set(L + 1, T, h);
      c.set(R - 1, T, dark(h));
    },
    fringe(c, { L, R, T }, h) {
      c.row(T - 1, L + 1, R - 1, h);
      c.row(T, L, R, h);
      c.row(T + 1, L, R, h);
      c.set(L, T + 2, h);
      c.set(R, T + 2, dark(h));
    },
    quiff(c, { L, R, T, M }, h) {
      c.row(T - 2, M, R - 1, h);
      c.row(T - 1, L + 1, R, h);
      c.row(T, L, R, h);
      c.set(L, T + 1, h);
      c.set(R, T + 1, dark(h));
      c.set(M + 1, T - 2, lite(h));
    },
    /* only the sides show (under a hat or helmet) */
    sides(c, { L, R, T }, h) {
      c.col(L, T + 1, T + 2, h);
      c.col(R, T + 1, T + 2, dark(h));
    },
    longsides(c, { L, R, T, B }, h) {
      c.col(L - 1, T + 1, B + 1, h);
      c.col(R + 1, T + 1, B + 1, dark(h));
      c.col(L, T + 1, T + 2, h);
      c.set(R, T + 1, dark(h));
    },
  };
  const BEARDS = {
    full(c, { L, R, T, B, M }, h) {
      c.col(L, T + 4, B - 2, h);
      c.col(R, T + 4, B - 2, dark(h));
      c.row(B - 3, M - 1, M + 2, h);
      c.row(B - 2, L, R, h);
      c.row(B - 1, L + 1, R - 1, h);
      c.row(B, L + 2, R - 2, h);
      c.set(R, B - 2, dark(h));
      c.set(R - 1, B - 1, dark(h));
    },
    long(c, f, h) {
      BEARDS.full(c, f, h);
      const { L, R, B, M } = f;
      c.row(B, L + 1, R - 1, h);
      c.rect(L + 2, B + 1, R - 2, B + 2, h);
      c.row(B + 3, M - 1, M + 2, h);
      c.row(B + 4, M, M + 1, h);
      c.col(R - 2, B + 1, B + 2, dark(h));
      c.set(M + 2, B + 3, dark(h));
    },
    huge(c, f, h) {
      BEARDS.long(c, f, h);
      const { L, R, B, M } = f;
      c.rect(L + 1, B + 1, R - 1, B + 3, h);
      c.row(B + 4, L + 2, R - 2, h);
      c.row(B + 5, M - 1, M + 2, h);
      c.col(R - 1, B + 1, B + 3, dark(h));
      c.col(M, B + 2, B + 4, dark(h));
    },
    goatee(c, { B, M }, h) {
      c.row(B - 3, M - 1, M + 2, h);
      c.rect(M, B - 1, M + 1, B + 1, h);
      c.set(M + 1, B + 1, dark(h));
    },
    stubble(c, { L, R, B }, h) {
      for (let x = L + 1; x < R; x += 2) c.set(x, B - 1, h);
      for (let x = L + 2; x < R - 1; x += 2) c.set(x, B, h);
      c.set(L, B - 3, h);
      c.set(R, B - 3, h);
    },
    tache(c, { B, M }, h) {
      c.row(B - 3, M - 1, M + 2, h);
      c.set(M - 2, B - 2, h);
      c.set(M + 3, B - 2, dark(h));
    },
  };
  /* drawn before the face: what goes round behind the head */
  const UNDER = {
    bubble(c, { L, R, T, B }, col) {
      c.oval(L - 3, T - 4, R + 3, B + 2, col);
      c.oval(L - 2, T - 3, R + 2, B + 1, hex('#22323a'));
      c.set(L - 1, T - 1, C.glassLight);
      c.set(L, T - 2, C.glassLight);
      c.set(L + 1, T - 2, C.glassLight);
    },
    veil(c, { L, R, T, B }) {
      c.row(T - 2, L + 1, R - 1, WHITE);
      c.row(T - 1, L - 1, R + 1, WHITE);
      c.rect(L - 2, T, R + 2, B + 5, WHITE);
      c.col(R + 2, T, B + 5, dark(WHITE));
      c.col(L - 1, T + 2, B + 5, dark(WHITE));
      c.col(R + 1, T + 2, B + 5, dark(WHITE));
    },
    nemes(c, { L, R, T, B }, col, col2) {
      c.rect(L - 2, T, R + 2, B + 3, col);
      for (let y = T + 1; y <= B + 3; y += 2) c.row(y, L - 2, R + 2, col2);
    },
    cowl(c, { L, R, T, B }, col) {
      c.rect(L - 1, T, R + 1, B + 1, dark(col));
    },
    wig(c, { L, R, T, B }, col) {
      c.rect(L - 2, T, R + 2, B + 3, col);
      for (let y = T + 2; y <= B + 3; y += 2) {
        c.row(y, L - 2, L - 1, dark(col));
        c.row(y, R + 1, R + 2, dark(col));
      }
    },
  };
  const NOMOUTH = new Set(['ninja', 'greathelm', 'sheet']);
  const HATS = {
    hood(c, { L, R, T, B }, col) {
      c.row(T - 2, L + 1, R - 1, col);
      c.row(T - 1, L, R, col);
      c.rect(L - 1, T, R + 1, T + 1, col);
      c.col(L - 1, T + 2, B, col);
      c.col(L, T + 2, B, col);
      c.col(R + 1, T + 2, B, dark(col));
      c.col(R, T + 2, B, dark(col));
      c.row(B + 1, L + 1, R - 1, dark(col));
      c.row(T + 1, L + 1, R - 1, dark(col));
    },
    tophat(c, { L, R, T }, col, band) {
      c.rect(L + 1, T - 4, R - 1, T - 1, col);
      c.row(T - 1, L + 1, R - 1, band ? cl(band) : lite(col));
      c.row(T, L - 1, R + 1, col);
      c.col(R - 1, T - 4, T - 2, dark(col));
    },
    cap(c, { L, R, T, M }, col, badge) {
      c.row(T - 2, L + 1, R - 1, col);
      c.row(T - 1, L, R, col);
      c.row(T, L, R, col);
      c.row(T + 1, R - 2, R + 2, dark(col));
      if (badge) c.set(M, T - 1, cl(badge));
    },
    /* a uniform cap seen from the front: flat crown, dark peak, badge */
    peaked(c, { L, R, T, M }, col, band) {
      c.row(T - 3, L, R, col);
      c.row(T - 2, L - 1, R + 1, col);
      c.row(T - 1, L, R, band ? cl(band) : dark(col));
      c.row(T, L, R, K);
      c.set(L + 1, T, hex('#33323a'));
      c.set(M, T - 2, GOLD);
      c.set(M + 1, T - 2, GOLD);
      c.set(L - 1, T - 2, lite(col));
    },
    bonnet(c, { L, R, T, B, M }, col) {
      c.row(T - 2, L + 1, R - 1, col);
      c.row(T - 1, L, R, col);
      c.row(T, L - 1, R + 1, col);
      c.col(L - 1, T + 1, T + 5, col);
      c.col(R + 1, T + 1, T + 5, dark(col));
      c.set(M, B + 1, col);
      c.set(M + 1, B + 1, col);
    },
    nurse(c, { L, R, T, M }) {
      c.rect(L + 1, T - 2, R - 1, T, WHITE);
      c.set(M, T - 1, RED);
      c.set(M + 1, T - 1, RED);
      c.set(M, T - 2, RED);
      c.set(M + 1, T, RED);
      c.row(T, L, R, WHITE);
    },
    bowler(c, { L, R, T }, col) {
      c.row(T - 3, L + 2, R - 2, col);
      c.rect(L + 1, T - 2, R - 1, T - 1, col);
      c.row(T, L - 1, R + 1, col);
      c.set(R - 1, T - 2, dark(col));
      c.set(L + 2, T - 2, lite(col));
    },
    bandana(c, { L, R, T }, col) {
      c.row(T - 1, L + 1, R - 1, col);
      c.row(T, L, R, col);
      c.row(T + 1, L, R, dark(col));
      c.set(R + 1, T + 1, col);
      c.set(R + 2, T + 2, col);
      c.set(R + 2, T + 3, dark(col));
    },
    headband(c, { L, R, T }, col) {
      c.row(T + 1, L, R, col);
      c.set(R + 1, T + 1, col);
      c.set(R + 2, T + 2, col);
      c.set(R + 1, T + 3, dark(col));
    },
    crown(c, { L, R, T, M }, col, gem) {
      const g = col || GOLD;
      c.row(T, L, R, g);
      c.row(T - 1, L, R, g);
      for (const x of [L, M - 1 + ((R - L) % 2 ? 0 : 0), M + 2, R]) c.set(x, T - 2, g);
      c.set(M, T - 2, g);
      c.set(M + 1, T - 2, g);
      c.set(M, T - 3, g);
      c.set(M + 1, T - 3, lite(g));
      c.set(L, T - 3, g);
      c.set(R, T - 3, g);
      c.row(T, L, R, dark(g));
      c.set(M, T - 1, gem ? cl(gem) : RED);
      c.set(L + 1, T - 1, lite(g));
    },
    tiara(c, { L, R, T, M }, col, gem) {
      const g = col || GOLD;
      c.row(T, L + 1, R - 1, g);
      c.set(M, T - 1, g);
      c.set(M + 1, T - 1, g);
      c.set(M, T - 2, gem ? cl(gem) : RED);
    },
    /* an open helmet: the face shows */
    helm(c, { L, R, T, B, M }, col) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T - 1, col);
      c.rect(L - 1, T - 1, R + 1, T, col);
      c.col(L - 1, T + 1, B - 2, col);
      c.col(R + 1, T + 1, B - 2, dark(col));
      c.col(L, T + 1, B - 3, col);
      c.col(R, T + 1, B - 3, dark(col));
      c.row(T, L - 1, R + 1, dark(col));
      c.set(L + 1, T - 2, lite(col));
      c.set(L + 2, T - 3, lite(col));
      c.col(M, T - 3, T, lite(col));
    },
    /* a closed helmet with an eye slit */
    greathelm(c, { L, R, T, B, M, E }, col) {
      c.row(T - 2, L, R, col);
      c.rect(L - 1, T - 1, R + 1, B - 1, col);
      c.row(B, L, R, dark(col));
      c.row(E, L, R, K);
      c.col(M, T - 1, B - 1, dark(col));
      c.set(M, E, K);
      c.col(L - 1, T - 1, B - 2, lite(col));
      c.col(R + 1, T - 1, B - 1, dark(col));
      for (const y of [E + 2, E + 4]) {
        c.set(M + 2, y, K);
        c.set(M - 2, y, K);
      }
    },
    horned(c, { L, R, T, M }, col) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T, col);
      c.row(T, L, R, dark(col));
      c.set(L + 1, T - 2, lite(col));
      c.col(M, T - 3, T + 2, dark(col));
      for (const [s, x] of [
        [-1, L - 1],
        [1, R + 1],
      ]) {
        c.set(x, T - 1, BONE);
        c.set(x, T - 2, BONE);
        c.set(x + s, T - 2, BONE);
        c.set(x + s, T - 3, BONE);
        c.set(x + s, T - 4, s > 0 ? dark(BONE) : BONE);
      }
    },
    winged(c, { L, R, T, M }, col) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T, col);
      c.row(T, L, R, dark(col));
      c.set(L + 1, T - 2, lite(col));
      for (const [s, x] of [
        [-1, L - 1],
        [1, R + 1],
      ]) {
        c.col(x, T - 4, T - 1, WHITE);
        c.col(x + s, T - 5, T - 3, WHITE);
        c.set(x + s, T - 2, dark(WHITE));
        c.set(x + 2 * s, T - 5, WHITE);
      }
      c.set(M, T - 1, GOLD);
    },
    kettle(c, { L, R, T }, col) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T - 1, col);
      c.row(T, L - 2, R + 2, col);
      c.set(L + 1, T - 2, lite(col));
      c.row(T - 1, L, R, dark(col));
    },
    plume(c, { T, M, R }, col) {
      const p = col;
      c.col(M, T - 5, T - 4, p);
      c.row(T - 6, M, M + 2, p);
      c.row(T - 5, M + 1, M + 3, p);
      c.set(M + 3, T - 4, dark(p));
      c.set(M + 4, T - 4, dark(p));
      c.set(M + 4, T - 3, dark(p));
      c.set(M, T - 6, lite(p));
      void R;
    },
    wizard(c, { L, R, T, M }, col, band) {
      c.row(T, L - 2, R + 2, col);
      c.row(T - 1, L, R, band ? cl(band) : dark(col));
      c.row(T - 2, L, R, col);
      c.row(T - 3, L + 1, R - 1, col);
      c.row(T - 4, L + 1, R - 2, col);
      c.row(T - 5, L + 2, R - 2, col);
      c.row(T - 6, M, M + 2, col);
      c.row(T - 7, M + 1, M + 2, col);
      c.set(M + 3, T - 7, dark(col));
      c.set(L + 2, T - 3, lite(col));
      c.set(M, T - 5, lite(col));
    },
    witch(c, f, col, band) {
      HATS.wizard(c, f, col, band || 'plum');
      c.row(f.T, f.L - 3, f.R + 3, col);
      c.set(f.M, f.T - 1, GOLD);
      c.set(f.M + 1, f.T - 1, GOLD);
    },
    straw(c, { L, R, T }, col, band) {
      const s = col || CLOTH.straw;
      c.row(T - 3, L + 2, R - 2, s);
      c.rect(L + 1, T - 2, R - 1, T - 1, s);
      c.row(T - 1, L + 1, R - 1, band ? cl(band) : dark(s));
      c.row(T, L - 3, R + 3, s);
      c.set(L - 3, T, lite(s));
      c.set(L + 2, T - 2, lite(s));
      for (let x = L - 2; x <= R + 2; x += 3) c.set(x, T, dark(s));
    },
    sunhat(c, { L, R, T }, col, band) {
      const s = col || CLOTH.straw;
      c.row(T - 3, L + 1, R - 1, s);
      c.rect(L, T - 2, R, T - 1, s);
      c.row(T - 1, L, R, band ? cl(band) : CLOTH.wine);
      c.row(T, L - 4, R + 4, s);
      c.row(T + 1, L - 4, L - 2, dark(s));
      c.row(T + 1, R + 2, R + 4, dark(s));
      c.set(L + 1, T - 2, lite(s));
    },
    chef(c, { L, R, T }) {
      c.row(T - 7, L + 1, R - 1, WHITE);
      c.rect(L - 1, T - 6, R + 1, T - 4, WHITE);
      c.rect(L, T - 3, R, T, WHITE);
      c.row(T - 3, L, R, dark(WHITE));
      c.col(L + 2, T - 6, T - 4, dark(WHITE));
      c.col(R - 2, T - 6, T - 4, dark(WHITE));
      c.row(T, L, R, dark(WHITE));
    },
    /* the tall domed police helmet */
    custodian(c, { L, R, T, M }, col) {
      c.row(T - 5, M, M + 1, hex('#a9acb4'));
      c.row(T - 4, L + 2, R - 2, col);
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T - 1, col);
      c.row(T, L - 1, R + 1, col);
      c.row(T, L, R, dark(col));
      c.rect(M, T - 2, M + 1, T - 1, hex('#a9acb4'));
      c.set(L + 1, T - 2, lite(col));
    },
    hardhat(c, { L, R, T, M }, col) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T - 1, col);
      c.row(T, L - 1, R + 1, col);
      c.row(T, L - 1, R + 1, dark(col));
      c.col(M, T - 3, T - 1, lite(col));
      c.col(M + 1, T - 3, T - 1, lite(col));
      c.set(L + 1, T - 2, lite(col));
    },
    firehelm(c, { L, R, T, M }, col) {
      c.row(T - 4, M, M + 1, col);
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T - 1, col);
      c.row(T, L - 2, R + 2, col);
      c.row(T, L - 2, R + 2, dark(col));
      c.col(M, T - 4, T - 3, lite(col));
      c.rect(M, T - 2, M + 1, T - 1, GOLD);
      c.set(L + 1, T - 2, lite(col));
    },
    minerhelm(c, f, col) {
      HATS.hardhat(c, f, col);
      c.rect(f.M, f.T - 2, f.M + 1, f.T - 1, C.flameLight);
      c.set(f.M, f.T - 2, WHITE);
    },
    armyhelm(c, { L, R, T }, col) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L - 1, T - 2, R + 1, T, col);
      c.row(T, L - 1, R + 1, dark(col));
      c.set(L, T - 2, lite(col));
      c.set(L + 2, T - 1, dark(col));
      c.set(R - 2, T - 2, dark(col));
      c.set(L, T + 1, dark(col));
      c.set(R, T + 1, dark(col));
    },
    bikehelm(c, { L, R, T, B }, col) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L - 1, T - 2, R + 1, T - 1, col);
      c.row(T, L, R, col);
      for (let x = L + 1; x < R; x += 2) c.set(x, T - 2, K);
      c.set(L, T - 2, lite(col));
      c.set(L, B - 2, K);
      c.set(R, B - 2, K);
    },
    beanie(c, { L, R, T, M }, col, pom) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T, col);
      c.row(T, L, R, dark(col));
      c.set(L + 1, T - 2, lite(col));
      if (pom) {
        c.rect(M, T - 5, M + 1, T - 4, cl(pom));
        c.set(M + 1, T - 4, dark(cl(pom)));
      }
    },
    turban(c, { L, R, T, M }, col) {
      c.row(T - 4, L + 1, R - 1, col);
      c.rect(L - 1, T - 3, R + 1, T - 1, col);
      c.row(T, L, R, col);
      c.line(L, T, M + 1, T - 4, dark(col));
      c.line(M + 1, T, R, T - 3, dark(col));
      c.set(L, T - 3, lite(col));
      c.col(R + 1, T - 3, T - 1, dark(col));
    },
    hijab(c, { L, R, T, B, M }, col) {
      c.row(T - 2, L + 1, R - 1, col);
      c.row(T - 1, L, R, col);
      c.rect(L - 1, T, R + 1, T + 1, col);
      c.row(T + 1, L + 1, R - 1, null);
      c.col(L - 1, T + 2, B + 1, col);
      c.col(L, T + 2, B, col);
      c.col(R + 1, T + 2, B + 1, dark(col));
      c.col(R, T + 2, B, dark(col));
      c.row(B, L + 1, R - 1, col);
      c.row(B + 1, L, R, col);
      c.row(B + 2, L - 1, R + 1, col);
      c.row(B + 3, L, R, dark(col));
      c.set(M + 1, B + 1, dark(col));
      c.set(L, T - 1, lite(col));
    },
    beret(c, { L, R, T, M }, col) {
      c.set(M + 1, T - 3, col);
      c.row(T - 2, L, R + 1, col);
      c.row(T - 1, L - 1, R + 2, col);
      c.row(T, L, R, dark(col));
      c.set(L, T - 2, lite(col));
    },
    cowboy(c, { L, R, T, M }, col, band) {
      c.row(T - 4, L + 1, M - 1, col);
      c.row(T - 4, M + 2, R - 1, col);
      c.rect(L + 1, T - 3, R - 1, T - 1, col);
      c.row(T - 1, L + 1, R - 1, band ? cl(band) : dark(col));
      c.row(T, L - 3, R + 3, col);
      c.set(L - 4, T - 1, col);
      c.set(R + 4, T - 1, dark(col));
      c.set(L + 2, T - 3, lite(col));
      c.row(T, M - 1, R + 3, dark(col));
    },
    tricorn(c, { L, R, T, M }, col, trim) {
      const t = trim ? cl(trim) : GOLD;
      c.row(T - 4, L + 2, R - 2, col);
      c.row(T - 3, L, R, col);
      c.row(T - 2, L - 2, R + 2, col);
      c.row(T - 1, L - 3, R + 3, col);
      c.row(T, L - 1, R + 1, col);
      c.set(L - 4, T - 2, col);
      c.set(R + 4, T - 2, dark(col));
      c.row(T, L - 1, R + 1, t);
      c.set(L - 2, T - 1, t);
      c.set(L - 3, T - 1, t);
      c.set(R + 2, T - 1, t);
      c.set(R + 3, T - 1, t);
      c.set(M, T - 3, WHITE);
      c.set(M + 1, T - 3, WHITE);
      c.set(M, T - 2, WHITE);
      c.set(M + 1, T - 2, dark(WHITE));
    },
    sailor(c, { L, R, T }, col, band) {
      c.row(T - 3, L + 1, R - 1, WHITE);
      c.rect(L - 1, T - 2, R + 1, T - 1, WHITE);
      c.row(T, L, R, band ? cl(band) : CLOTH.navy);
      c.set(L, T - 2, lite(WHITE));
      void col;
    },
    flatcap(c, { L, R, T }, col) {
      c.row(T - 2, L + 1, R - 1, col);
      c.row(T - 1, L, R + 1, col);
      c.row(T, L, R + 2, dark(col));
      c.set(L + 1, T - 2, lite(col));
    },
    fedora(c, { L, R, T, M }, col, band) {
      c.row(T - 4, L + 1, M - 1, col);
      c.row(T - 4, M + 1, R - 1, col);
      c.rect(L + 1, T - 3, R - 1, T - 1, col);
      c.row(T - 1, L + 1, R - 1, band ? cl(band) : K);
      c.row(T, L - 2, R + 2, col);
      c.row(T, M, R + 2, dark(col));
      c.set(L + 2, T - 3, lite(col));
    },
    pith(c, { L, R, T, M }, col) {
      c.row(T - 5, M, M + 1, dark(col));
      c.row(T - 4, L + 2, R - 2, col);
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L, T - 2, R, T - 1, col);
      c.row(T - 1, L, R, dark(col));
      c.row(T, L - 2, R + 2, col);
      c.set(L + 1, T - 3, lite(col));
    },
    santa(c, { L, R, T, M }, col) {
      c.row(T - 5, M + 1, R, col);
      c.row(T - 4, M - 1, R + 1, col);
      c.row(T - 3, L + 1, R + 2, col);
      c.row(T - 2, L, R, col);
      c.rect(L - 1, T - 1, R + 1, T, WHITE);
      c.row(T, L - 1, R + 1, dark(WHITE));
      c.rect(R + 2, T - 2, R + 3, T - 1, WHITE);
      c.set(R + 3, T - 1, dark(WHITE));
      c.set(L + 1, T - 3, lite(col));
    },
    /* a pointed cap that flops over, with a bell or a bobble */
    elfcap(c, { L, R, T, M }, col, pom) {
      c.row(T - 5, M + 2, R + 1, col);
      c.row(T - 4, M, R, col);
      c.row(T - 3, L + 1, R - 1, col);
      c.row(T - 2, L, R, col);
      c.row(T - 1, L, R, col);
      c.row(T, L, R, pom ? cl(pom) : dark(col));
      c.set(R + 2, T - 4, pom ? cl(pom) : GOLD);
      c.set(L + 1, T - 2, lite(col));
    },
    party(c, { L, R, T, M }, col, col2) {
      const b = col2 ? cl(col2) : CLOTH.mustard;
      c.row(T, L + 1, R - 1, col);
      c.row(T - 1, L + 1, R - 1, b);
      c.row(T - 2, L + 2, R - 2, col);
      c.row(T - 3, L + 2, R - 2, b);
      c.row(T - 4, M, M + 1, col);
      c.row(T - 5, M, M + 1, b);
      c.set(M, T - 6, WHITE);
      c.set(M + 1, T - 6, dark(WHITE));
    },
    mortar(c, { L, R, T, M }, col) {
      c.row(T - 3, L - 1, R + 1, col);
      c.row(T - 2, L - 2, R + 2, col);
      c.row(T - 2, L - 2, M, lite(col));
      c.rect(L + 1, T - 1, R - 1, T, col);
      c.row(T, L, R, dark(col));
      c.col(R + 2, T - 1, T + 2, GOLD);
      c.set(M, T - 3, GOLD);
    },
    judgewig(c, { L, R, T, B }, col) {
      const w = col || HAIR.white;
      c.row(T - 2, L + 1, R - 1, w);
      c.row(T - 1, L, R, w);
      c.row(T, L - 1, R + 1, w);
      c.rect(L - 2, T + 1, L - 1, B + 3, w);
      c.rect(R + 1, T + 1, R + 2, B + 3, w);
      c.set(L, T + 1, w);
      c.set(R, T + 1, w);
      for (let y = T + 2; y <= B + 3; y += 2) {
        c.row(y, L - 2, L - 1, dark(w));
        c.row(y, R + 1, R + 2, dark(w));
      }
      c.row(T - 1, L + 2, R - 2, dark(w));
    },
    veil(c, { L, R, T, M }) {
      c.row(T - 1, L, R, WHITE);
      c.row(T, L, R, WHITE);
      c.set(M, T - 2, WHITE);
      c.set(M + 1, T - 2, WHITE);
      c.set(M, T - 1, GOLD);
      c.set(M + 1, T - 1, GOLD);
    },
    nemes(c, { L, R, T, M }, col, col2) {
      c.row(T - 3, L + 1, R - 1, col);
      c.rect(L - 1, T - 2, R + 1, T, col);
      c.row(T - 1, L - 1, R + 1, col2);
      c.row(T, L, R, GOLD);
      c.col(M, T - 4, T - 1, GOLD);
      c.set(M + 1, T - 4, GOLD);
      c.set(M + 1, T - 3, RED);
    },
    jester(c, { L, R, T, M }, a, b) {
      b = b ? cl(b) : CLOTH.forest;
      c.rect(L, T - 1, M, T, a);
      c.rect(M + 1, T - 1, R, T, b);
      c.set(L - 1, T - 2, a);
      c.set(L - 2, T - 3, a);
      c.set(L - 1, T - 1, a);
      c.set(R + 1, T - 2, b);
      c.set(R + 2, T - 3, b);
      c.set(R + 1, T - 1, b);
      c.set(L - 2, T - 2, GOLD);
      c.set(R + 2, T - 2, GOLD);
      c.set(M, T - 2, a);
      c.set(M + 1, T - 2, b);
      c.set(M, T - 3, GOLD);
    },
    ninja(c, { L, R, T, B, E }, col, skin) {
      c.row(T - 1, L + 1, R - 1, col);
      c.row(T, L, R, col);
      c.rect(L - 1, T + 1, R + 1, B - 2, col);
      c.row(B - 1, L, R, col);
      c.row(B, L + 1, R - 1, col);
      c.col(R + 1, T + 1, B - 2, dark(col));
      c.row(E, L + 1, R - 1, skin);
      c.row(E - 1, L + 1, R - 1, dark(col));
      c.set(R + 2, T + 2, col);
      c.set(R + 2, T + 3, dark(col));
      c.set(L, T, lite(col));
    },
    feather(c, { L, R, T }, col, fcol) {
      c.row(T - 2, L + 1, R - 1, col);
      c.row(T - 1, L, R + 1, col);
      c.row(T, L - 1, R + 2, dark(col));
      const fc = fcol ? cl(fcol) : RED;
      c.set(R - 1, T - 3, fc);
      c.set(R, T - 4, fc);
      c.set(R + 1, T - 5, fc);
      c.set(R, T - 3, dark(fc));
      c.set(L + 1, T - 2, lite(col));
    },
    swimcap(c, { L, R, T }, col) {
      c.row(T - 1, L + 1, R - 1, col);
      c.rect(L, T, R, T + 1, col);
      c.set(L + 1, T, lite(col));
      c.row(T + 1, L, R, dark(col));
    },
    phones(c, { L, R, T, E }, col) {
      c.row(T - 2, L + 1, R - 1, col);
      c.set(L, T - 1, col);
      c.set(R, T - 1, col);
      c.col(L - 1, T, E + 1, col);
      c.col(R + 1, T, E + 1, col);
      c.rect(L - 1, E - 1, L - 1, E + 1, K);
      c.rect(R + 1, E - 1, R + 1, E + 1, K);
      c.set(L - 2, E, col);
      c.set(R + 2, E, dark(col));
    },
    clownwig(c, { L, R, T }, col) {
      c.rect(L - 2, T - 1, L, T + 3, col);
      c.rect(R, T - 1, R + 2, T + 3, col);
      c.set(L - 3, T + 1, col);
      c.set(R + 3, T + 1, dark(col));
      c.set(L - 1, T - 2, col);
      c.set(R + 1, T - 2, col);
      c.col(R + 2, T - 1, T + 3, dark(col));
      c.set(L - 1, T + 4, col);
      c.set(R + 1, T + 4, dark(col));
      c.set(L, T + 2, null);
    },
  };
  const WEAR = {
    glasses(c, f, col) {
      const g = col ? cl(col) : hex('#33323a');
      c.set(f.e0 - 1, f.E, g);
      c.set(f.e0 + 1, f.E, g);
      c.set(f.e1 - 1, f.E, g);
      c.set(f.e1 + 1, f.E, g);
      c.set(f.L, f.E, g);
      c.set(f.e0, f.E, C.glassLight);
      c.set(f.e1, f.E, C.glassLight);
      c.set(f.e0, f.E - 1, g);
      c.set(f.e1, f.E - 1, g);
      c.set(f.e0, f.E + 1, g);
      c.set(f.e1, f.E + 1, g);
    },
    specs(c, f, col) {
      const g = col ? cl(col) : hex('#b9bcc4');
      c.set(f.e0 - 1, f.E, g);
      c.set(f.e0 + 1, f.E, g);
      c.set(f.e1 - 1, f.E, g);
      c.set(f.e1 + 1, f.E, g);
      c.set(f.L, f.E, g);
      c.set(f.R, f.E, dark(g));
    },
    shades(c, f) {
      c.row(f.E, f.L, f.R, K);
      c.row(f.E + 1, f.e0 - 1, f.e0, K);
      c.row(f.E + 1, f.e1, f.e1 + 1, K);
      c.set(f.e0 - 1, f.E, hex('#4a4a55'));
      c.set(f.e1, f.E, hex('#4a4a55'));
    },
    goggles(c, f, col) {
      const g = col ? cl(col) : CLOTH.leather;
      c.row(f.E, f.L, f.R, g);
      c.rect(f.e0 - 1, f.E - 1, f.e0, f.E, C.glass);
      c.rect(f.e1, f.E - 1, f.e1 + 1, f.E, C.glass);
      c.set(f.e0 - 1, f.E - 1, C.glassLight);
      c.set(f.e1, f.E - 1, C.glassLight);
    },
    patch(c, f) {
      c.set(f.e1, f.E, K);
      c.rect(f.e1 - 1, f.E - 1, f.e1 + 1, f.E, K);
      c.line(f.L, f.E - 2, f.e1 - 1, f.E - 1, K);
      c.set(f.R, f.E - 1, K);
    },
    domino(c, f, col) {
      const m = col ? cl(col) : K;
      c.row(f.E, f.L, f.R, m);
      c.row(f.E - 1, f.L + 1, f.R - 1, m);
      c.set(f.e0, f.E, WHITE);
      c.set(f.e1, f.E, WHITE);
    },
    /* a cloth over the lower face */
    scarfmask(c, f, col) {
      const m = col ? cl(col) : CLOTH.wine;
      c.rect(f.L, f.E + 1, f.R, f.B - 2, m);
      c.row(f.B - 1, f.L + 1, f.R - 1, m);
      c.row(f.B, f.L + 2, f.R - 2, dark(m));
      c.col(f.R, f.E + 1, f.B - 2, dark(m));
      c.set(f.M, f.E + 2, dark(m));
    },
    surgical(c, f, col) {
      const m = col ? cl(col) : hex('#9ebcc2');
      c.rect(f.L + 1, f.E + 1, f.R - 1, f.B - 1, m);
      c.row(f.E + 3, f.L + 1, f.R - 1, dark(m));
      c.set(f.L, f.E + 1, WHITE);
      c.set(f.R, f.E + 1, WHITE);
    },
    elfears(c, f, col) {
      c.set(f.L - 1, f.E, col);
      c.set(f.L - 1, f.E - 1, col);
      c.set(f.L - 2, f.E - 2, col);
      c.set(f.R + 1, f.E, dark(col));
      c.set(f.R + 1, f.E - 1, dark(col));
      c.set(f.R + 2, f.E - 2, dark(col));
    },
    rednose(c, f) {
      c.rect(f.M, f.E + 1, f.M + 1, f.E + 2, RED);
      c.set(f.M, f.E + 1, lite(RED));
    },
    blush(c, f) {
      c.set(f.L + 1, f.E + 2, hex('#b87a6a'));
      c.set(f.R - 1, f.E + 2, hex('#b87a6a'));
    },
    scar(c, f, col) {
      c.line(f.e1 - 1, f.E - 2, f.e1 + 1, f.E + 2, dark(col));
    },
    fangs(c, f) {
      c.set(f.M, f.B - 1, WHITE);
      c.set(f.M + 1, f.B - 1, WHITE);
    },
    earring(c, f) {
      c.set(f.L - 1, f.E + 2, GOLD);
    },
    lipstick(c, f) {
      c.row(f.B - 2, f.M, f.M + 1, hex('#8a2a34'));
    },
  };

  function makeHead(g, o) {
    const PX = 7,
      PT = 11;
    const c = canvas(g.FW + PX * 2, g.FH + PT + 9);
    const kid = g.FW < 8;
    const L = PX,
      R = PX + g.FW - 1,
      T = PT,
      B = PT + g.FH - 1,
      M = L + g.FW / 2 - 1,
      E = T + (kid ? 2 : 3);
    const f = { L, R, T, B, M, E, e0: kid ? L + 1 : L + 2, e1: kid ? R - 1 : R - 2, kid, mouth: true };
    const skin = sk(o.skin || 'fair');
    f.skin = skin;
    const hat = o.hat ? sp(o.hat) : null;
    const under = o.under ? sp(o.under) : null;
    if (under) UNDER[under[0]](c, f, cl(under[1]), under[2] && cl(under[2]));
    if (o.headBack) o.headBack(c, f);
    face(c, f, skin);
    const hair = o.hair ? sp(o.hair) : hat ? null : ['cropped', 'brown'];
    if (hair && hair[0] !== 'bald') {
      if (!HAIRS[hair[0]]) throw new Error('no hair style ' + hair[0]);
      HAIRS[hair[0]](c, f, hc(hair[1] || 'brown'));
    }
    if (o.beard) {
      const b = sp(o.beard);
      BEARDS[b[0]](c, f, hc(b[1] || (hair && hair[1]) || 'brown'));
    }
    if (hat) {
      if (!HATS[hat[0]]) throw new Error('no hat ' + hat[0]);
      if (hat[0] === 'ninja') HATS.ninja(c, f, cl(hat[1]), skin);
      else HATS[hat[0]](c, f, hat[1] ? cl(hat[1]) : null, hat[2]);
      if (NOMOUTH.has(hat[0])) f.mouth = false;
      if (hat[0] === 'greathelm') o = { ...o, expr: 'none' };
    }
    if (o.hat2) {
      const h2 = sp(o.hat2);
      HATS[h2[0]](c, f, h2[1] ? cl(h2[1]) : null, h2[2]);
    }
    if (o.mouth === false) f.mouth = false;
    const wear = o.wear ? sp(o.wear) : [];
    if (wear.some((w) => w.startsWith('scarfmask') || w.startsWith('surgical'))) f.mouth = false;
    EXPR[o.expr || 'calm'](c, f, skin);
    for (const w of wear) {
      const [n, a] = w.split(':');
      if (!WEAR[n]) throw new Error('no wear ' + n);
      WEAR[n](c, f, n === 'elfears' || n === 'scar' ? skin : a);
    }
    if (o.face) o.face(c, f);
    done(c, true);
    return { c, PX, PT };
  }

  /* =====================================================================================
   * TORSOS.  s = { x0, x1, yb, cx, a, b }: body columns x0..x1 (shoulders one wider), rows 1..yb, the two middle
   * columns cx and cx + 1, and the columns a..b that show between the arms. On the doll: 2, 9, 9, 5, 3, 8.
   * ===================================================================================== */
  function body(c, s, col) {
    c.row(1, 1, s.x1 + 1, col);
    c.rect(s.x0, 2, s.x1, s.yb, col);
    c.set(1, 1, lite(col));
    c.set(2, 2, lite(col));
    c.col(s.x1, 2, s.yb, dark(col));
    c.col(s.b, 2, s.yb, dark(col));
    c.set(s.a, 2, lite(col));
  }
  const neck = (c, s, skin) => {
    c.set(s.cx, 1, skin);
    c.set(s.cx + 1, 1, skin);
  };
  const TORSOS = {
    shirt(c, s, col, _c2, skin) {
      body(c, s, col);
      neck(c, s, skin);
      c.set(s.cx, 2, dark(col));
      c.set(s.cx + 1, 2, dark(col));
    },
    /* a shirt with a collar and buttons */
    blouse(c, s, col, c2, skin) {
      body(c, s, col);
      neck(c, s, skin);
      c.set(s.cx - 1, 2, lite(col));
      c.set(s.cx + 2, 2, lite(col));
      c.col(s.cx + 1, 3, s.yb, dark(col));
      if (c2) c.col(s.cx, 2, s.yb - 3, c2);
    },
    tee(c, s, col, c2, skin) {
      body(c, s, col);
      neck(c, s, skin);
      c.set(s.cx, 2, skin);
      c.set(s.cx + 1, 2, dark(skin));
      if (c2) c.rect(s.cx - 1, 4, s.cx + 2, 6, c2);
    },
    suit(c, s, col, tie) {
      body(c, s, col);
      c.rect(s.cx, 1, s.cx + 1, s.yb - 3, WHITE);
      c.col(s.cx, 2, s.yb - 4, tie || BLOOD);
      c.set(s.cx - 1, 2, dark(col));
      c.set(s.cx + 2, 2, dark(col));
      c.set(s.cx - 1, 3, dark(col));
      c.set(s.cx + 2, 3, dark(col));
      c.set(s.cx, s.yb - 1, GOLD);
    },
    /* a suit with a bow tie */
    tux(c, s, col, tie) {
      body(c, s, col);
      c.rect(s.cx, 1, s.cx + 1, s.yb - 3, WHITE);
      c.row(2, s.cx, s.cx + 1, tie || K);
      c.set(s.cx - 1, 3, dark(col));
      c.set(s.cx + 2, 3, dark(col));
      c.set(s.cx, 4, dark(WHITE));
      c.set(s.cx, 6 > s.yb - 3 ? s.yb - 3 : 6, dark(WHITE));
    },
    dress(c, s, col, c2, skin) {
      body(c, s, col);
      neck(c, s, skin);
      c.row(2, s.cx, s.cx + 1, skin);
      c.row(s.yb - 3, s.a, s.b, c2 || dark(col));
    },
    coat(c, s, col, btn) {
      body(c, s, col);
      c.col(s.cx, 1, s.yb, dark(col));
      for (let y = 3; y < s.yb; y += 2) c.set(s.cx + 1, y, btn || GOLD);
      c.set(s.cx - 1, 1, lite(col));
      c.set(s.cx + 2, 1, lite(col));
    },
    /* a long open coat with lapels over a shirt and tie */
    trench(c, s, col, c2) {
      body(c, s, col);
      c.rect(s.cx, 1, s.cx + 1, 3, c2 || WHITE);
      c.set(s.cx - 1, 2, lite(col));
      c.set(s.cx + 2, 2, lite(col));
      c.set(s.cx - 1, 3, lite(col));
      c.col(s.cx, 4, s.yb, dark(col));
      c.row(s.yb - 2, s.a, s.b, dark(col));
      c.set(s.cx + 1, s.yb - 2, GOLD);
      c.set(s.cx + 2, 5, dark(col));
    },
    stripes(c, s, col, c2) {
      body(c, s, col);
      for (let y = 2; y <= s.yb; y += 2) c.row(y, s.x0, s.x1, c2 || WHITE);
      c.col(s.x1, 2, s.yb, dark(col));
    },
    /* stripes down, for a referee */
    pinstripe(c, s, col, c2) {
      body(c, s, col);
      for (let x = s.a; x <= s.b; x += 2) c.col(x, 2, s.yb, c2 || K);
    },
    apron(c, s, col, c2, skin) {
      body(c, s, col);
      neck(c, s, skin);
      const a = c2 || WHITE;
      c.rect(s.a, 3, s.b, s.yb, a);
      c.set(s.a, 2, a);
      c.set(s.b, 2, a);
      c.col(s.b, 3, s.yb, dark(a));
      c.row(s.yb - 2, s.a, s.b, dark(a));
    },
    robe(c, s, col, c2) {
      body(c, s, col);
      const b = c2 || BELT;
      c.col(s.cx, 1, s.yb - 4, dark(col));
      c.row(s.yb - 3, s.x0, s.x1, b);
      c.col(s.cx + 1, s.yb - 2, s.yb, b);
      c.set(s.cx + 1, 1, dark(col));
    },
    overalls(c, s, col, c2, skin) {
      body(c, s, c2 || CLOTH.ash);
      c.rect(s.a, 4, s.b, s.yb, col);
      c.col(s.a, 1, 3, col);
      c.col(s.b, 1, 3, col);
      c.set(s.a, 4, GOLD);
      c.set(s.b, 4, GOLD);
      c.col(s.b, 5, s.yb, dark(col));
      c.rect(s.cx, 6, s.cx + 1, 7, dark(col));
      neck(c, s, skin);
    },
    rags(c, s, col, _c2, skin) {
      body(c, s, col);
      c.clear(s.a + 1, s.yb);
      c.clear(s.b - 1, s.yb);
      c.clear(s.b, s.yb);
      c.set(s.a + 1, 4, skin);
      c.set(s.cx, 5, skin);
      c.set(s.b - 1, 7, skin);
      c.set(s.a, 7, dark(col));
      c.set(s.cx + 1, 3, dark(col));
      neck(c, s, skin);
    },
    uniform(c, s, col, belt) {
      body(c, s, col);
      c.row(s.yb - 3, s.x0, s.x1, belt || K);
      c.set(s.cx, s.yb - 3, GOLD);
      c.set(s.a, 3, GOLD);
      c.col(s.cx, 1, s.yb - 4, dark(col));
      for (let y = 3; y < s.yb - 3; y += 2) c.set(s.cx + 1, y, GOLD);
      c.row(1, 1, 2, GOLD);
      c.row(1, s.x1, s.x1 + 1, GOLD);
    },
    vest(c, s, col) {
      body(c, s, WHITE);
      c.rect(s.x0, 2, s.cx - 1, s.yb, col);
      c.rect(s.cx + 2, 2, s.x1, s.yb, dark(col));
      c.row(1, 1, s.cx - 2, col);
      c.row(1, s.cx + 3, s.x1 + 1, col);
      c.col(s.cx, 2, s.yb - 1, hex('#a8a08a'));
    },
    waistcoat(c, s, col, c2) {
      body(c, s, c2 || WHITE);
      c.rect(s.a, 3, s.b, s.yb, col);
      c.rect(s.cx, 3, s.cx + 1, 4, c2 || WHITE);
      c.col(s.b, 3, s.yb, dark(col));
      for (let y = 5; y <= s.yb; y += 2) c.set(s.cx + 1, y, GOLD);
      c.col(s.cx, 5, s.yb, dark(col));
    },
    jumper(c, s, col, c2) {
      body(c, s, col);
      c.set(s.cx - 1, 1, WHITE);
      c.set(s.cx + 2, 1, WHITE);
      c.set(s.cx, 2, WHITE);
      c.set(s.cx + 1, 2, WHITE);
      c.row(s.yb, s.x0, s.x1, dark(col));
      c.row(s.yb - 1, s.x0, s.x1, dark(col));
      for (let x = s.a; x <= s.b; x += 2) c.set(x, 5, c2 || lite(col));
    },
    cassock(c, s, col) {
      body(c, s, col);
      c.set(s.cx, 1, WHITE);
      c.set(s.cx + 1, 1, WHITE);
      c.col(s.cx + 1, 3, s.yb, dark(col));
    },
    /* plate armour; c2 is a tabard or emblem colour down the front */
    plate(c, s, col, c2) {
      body(c, s, col);
      c.row(1, 1, s.x1 + 1, lite(col));
      c.row(2, s.a, s.b, lite(col));
      c.set(s.b, 2, col);
      c.row(s.yb - 3, s.a, s.b, dark(col));
      c.row(s.yb - 1, s.a, s.b, dark(col));
      c.col(s.cx + 1, 3, s.yb - 4, dark(col));
      c.set(s.a + 1, 3, WHITE);
      if (c2) {
        c.rect(s.cx - 1, 3, s.cx + 2, s.yb, c2);
        c.col(s.cx + 2, 3, s.yb, dark(c2));
        c.row(s.yb - 3, s.cx - 1, s.cx + 2, dark(c2));
      }
    },
    /* mail or scale: a speckled metal shirt with a belt */
    mail(c, s, col, belt) {
      body(c, s, col);
      for (let y = 2; y <= s.yb; y++) for (let x = s.a + (y % 2); x <= s.b; x += 2) c.set(x, y, dark(col));
      c.row(s.yb - 2, s.x0, s.x1, belt || CLOTH.leather);
      c.set(s.cx, s.yb - 2, GOLD);
    },
    tunic(c, s, col, belt, skin) {
      body(c, s, col);
      neck(c, s, skin);
      c.set(s.cx, 2, skin);
      c.set(s.cx + 1, 2, dark(skin));
      c.row(s.yb - 2, s.x0, s.x1, belt || CLOTH.leather);
      c.set(s.cx, s.yb - 2, GOLD);
      c.col(s.cx + 1, 3, s.yb - 3, dark(col));
    },
    /* leather: a jerkin laced down the front, with a belt and a strap */
    jerkin(c, s, col, c2, skin) {
      body(c, s, col);
      neck(c, s, skin);
      for (let y = 2; y < s.yb - 2; y += 2) c.set(s.cx, y, c2 || BELT);
      c.col(s.cx + 1, 2, s.yb - 3, dark(col));
      c.row(s.yb - 2, s.x0, s.x1, dark(dark(col)));
      c.set(s.cx + 1, s.yb - 2, GOLD);
      c.line(s.a, 2, s.b, s.yb - 3, dark(col));
    },
    bare(c, s, _col, _c2, skin) {
      body(c, s, skin);
      c.row(4, s.a, s.cx - 1, dark(skin));
      c.row(4, s.cx + 2, s.b - 1, dark(skin));
      c.set(s.cx, s.yb - 2, dark(skin));
      c.col(s.cx, 2, 3, dark(skin));
    },
    hoodie(c, s, col, c2) {
      body(c, s, col);
      c.row(1, s.cx - 1, s.cx + 2, dark(col));
      c.set(s.cx, 2, dark(col));
      c.set(s.cx + 1, 2, dark(col));
      c.set(s.cx, 3, WHITE);
      c.set(s.cx + 1, 4, WHITE);
      c.rect(s.a + 1, s.yb - 2, s.b - 1, s.yb - 1, dark(col));
      c.row(s.yb, s.x0, s.x1, dark(col));
      if (c2) c.rect(s.cx, 5, s.cx + 1, 5, c2);
    },
    labcoat(c, s, col, c2) {
      body(c, s, WHITE);
      c.rect(s.cx, 1, s.cx + 1, 3, col);
      if (c2) c.col(s.cx, 2, 3, c2);
      c.set(s.cx - 1, 2, dark(WHITE));
      c.set(s.cx + 2, 2, dark(WHITE));
      c.col(s.cx, 4, s.yb, dark(WHITE));
      c.row(s.yb - 2, s.cx + 2, s.b - 1, dark(WHITE));
      c.set(s.a, 4, hex('#3a4f7e'));
    },
    jacket(c, s, col, c2) {
      body(c, s, col);
      c.rect(s.cx, 1, s.cx + 1, s.yb, c2 || WHITE);
      c.col(s.cx + 1, 2, s.yb, dark(c2 || WHITE));
      c.set(s.cx - 1, 2, lite(col));
      c.set(s.cx + 2, 2, lite(col));
      c.row(s.yb, s.a, s.cx - 1, dark(col));
    },
    hivis(c, s, col, c2) {
      body(c, s, c2 || CLOTH.slate);
      const y = col || CLOTH.yellow;
      c.rect(s.a, 2, s.b, s.yb, y);
      c.col(s.cx, 2, s.yb, dark(y));
      c.row(s.yb - 3, s.a, s.b, hex('#cfd0d0'));
      c.row(4, s.a, s.b, hex('#cfd0d0'));
      c.col(s.b, 2, s.yb, dark(y));
    },
    tank(c, s, col, c2, skin) {
      body(c, s, skin);
      c.rect(s.a, 3, s.b, s.yb, col);
      c.set(s.a, 2, col);
      c.set(s.b, 2, col);
      c.set(s.a, 1, col);
      c.set(s.b, 1, col);
      c.col(s.b, 3, s.yb, dark(col));
      if (c2) c.rect(s.cx, 5, s.cx + 1, 6, c2);
    },
    /* a wrapped jacket with a belt: karate, kimono */
    gi(c, s, col, belt, skin) {
      body(c, s, col);
      neck(c, s, skin);
      c.set(s.cx, 2, skin);
      c.line(s.cx + 2, 1, s.a + 1, s.yb - 3, dark(col));
      c.line(s.cx - 1, 1, s.cx, 2, dark(col));
      c.row(s.yb - 2, s.x0, s.x1, belt || K);
      c.col(s.cx - 1, s.yb - 1, s.yb, belt || K);
    },
    /* a bodice laced at the front, bare shoulders */
    bodice(c, s, col, c2, skin) {
      body(c, s, col);
      c.row(1, 1, s.x1 + 1, skin);
      c.row(2, s.a, s.b, skin);
      c.set(s.a, 2, col);
      c.set(s.b, 2, col);
      for (let y = 4; y <= s.yb; y += 2) c.set(s.cx, y, c2 || GOLD);
      c.col(s.cx + 1, 3, s.yb, dark(col));
    },
    /* a space suit: bulky, with a chest pack */
    spacesuit(c, s, col, c2) {
      body(c, s, col);
      c.row(1, 1, s.x1 + 1, dark(col));
      c.rect(s.cx - 1, 3, s.cx + 2, 6, dark(col));
      c.set(s.cx - 1, 4, c2 || RED);
      c.set(s.cx, 4, hex('#5a7a96'));
      c.set(s.cx + 1, 5, GOLD);
      c.row(s.yb - 1, s.a, s.b, dark(col));
    },
    robot(c, s, col, c2) {
      body(c, s, col);
      c.frame(s.a, 3, s.b, s.yb - 2, dark(col));
      c.rect(s.cx, 4, s.cx + 1, 5, c2 || C.glassLight);
      c.set(s.a + 1, s.yb - 3, RED);
      c.row(s.yb, s.a, s.b, dark(col));
    },
  };
  /* which sleeves a top comes with, when none are named */
  const TOPARM = {
    tee: 'short',
    dress: 'short',
    stripes: 'striped',
    vest: 'sleeve white',
    waistcoat: 'sleeve white',
    bare: 'bare',
    tank: 'bare',
    bodice: 'bare',
    plate: 'plate',
    mail: 'plate',
    robe: 'robe',
    labcoat: 'sleeve white',
    hivis: 'sleeve',
    overalls: 'sleeve ash',
    apron: 'sleeve',
    uniform: 'cuffed',
    spacesuit: 'glove',
    robot: 'robot',
  };

  /* =====================================================================================
   * ARMS (hang down, shoulder at the top) and LEGS (hip at the top, foot pointing right)
   * ===================================================================================== */
  const ARMS = {
    sleeve(c, a, col, _c2, skin) {
      c.rect(1, 0, a.w, a.hy - 1, col);
      c.rect(1, a.hy, a.w, a.end, skin);
      c.col(a.w, 0, a.hy - 1, dark(col));
    },
    short(c, a, col, _c2, skin) {
      c.rect(1, 0, a.w, 3, col);
      c.rect(1, 4, a.w, a.end, skin);
      c.col(a.w, 4, a.end, dark(skin));
      c.set(a.w, 3, dark(col));
    },
    bare(c, a, _col, _c2, skin) {
      c.rect(1, 0, a.w, a.end, skin);
      c.col(a.w, 0, a.end, dark(skin));
      c.set(1, 0, lite(skin));
    },
    /* bare, with a band at the wrist */
    bracer(c, a, col, _c2, skin) {
      ARMS.bare(c, a, col, null, skin);
      c.rect(1, a.hy - 3, a.w, a.hy - 1, col);
      c.row(a.hy - 3, 1, a.w, dark(col));
    },
    glove(c, a, col, c2) {
      const gl = c2 || K;
      c.rect(1, 0, a.w, a.hy - 2, col);
      c.rect(1, a.hy - 1, a.w, a.end, gl);
      c.row(a.hy - 1, 1, a.w, lite(lite(gl)));
      c.col(a.w, 0, a.hy - 2, dark(col));
    },
    striped(c, a, col, c2, skin) {
      c.rect(1, 0, a.w, a.hy - 1, col);
      for (let y = 1; y < a.hy; y += 2) c.row(y, 1, a.w, c2 || WHITE);
      c.rect(1, a.hy, a.w, a.end, skin);
    },
    puffed(c, a, col, _c2, skin) {
      c.rect(0, 0, a.w + 1, 2, col);
      c.rect(1, 3, a.w, a.hy - 1, col);
      c.rect(1, a.hy, a.w, a.end, skin);
      c.col(a.w + 1, 0, 2, dark(col));
    },
    cuffed(c, a, col, c2, skin) {
      c.rect(1, 0, a.w, a.hy - 2, col);
      c.row(a.hy - 1, 1, a.w, c2 || WHITE);
      c.rect(1, a.hy, a.w, a.end, skin);
      c.col(a.w, 0, a.hy - 2, dark(col));
      if (!c2) c.set(2, a.hy - 1, GOLD);
    },
    robe(c, a, col, _c2, skin) {
      c.rect(1, 0, a.w, a.hy - 4, col);
      c.rect(0, a.hy - 3, a.w + 1, a.hy - 1, col);
      c.rect(1, a.hy, a.w, a.end, skin);
      c.col(a.w + 1, a.hy - 3, a.hy - 1, dark(col));
      c.col(a.w, 0, a.hy - 4, dark(col));
    },
    plate(c, a, col) {
      const m = col || STEEL;
      c.rect(1, 0, a.w, a.end, m);
      c.rect(0, 0, a.w + 1, 1, lite(m));
      c.set(a.w + 1, 1, m);
      c.row(a.hy - 5, 1, a.w, dark(m));
      c.row(a.hy - 1, 1, a.w, dark(m));
      c.col(a.w, 2, a.end, dark(m));
      c.rect(1, a.hy, a.w, a.end, dark(m));
      c.set(1, a.hy, m);
    },
    robot(c, a, col, c2) {
      const m = col || STEEL;
      c.rect(1, 0, a.w, a.end, m);
      c.row(a.hy - 5, 1, a.w, K);
      c.col(a.w, 0, a.end, dark(m));
      c.rect(1, a.hy, a.w, a.end, c2 || dark(m));
    },
    hook(c, a, col) {
      c.rect(1, 0, a.w, a.hy - 2, col);
      c.row(a.hy - 1, 1, a.w, CLOTH.earth);
      c.set(2, a.hy, CLOTH.ash);
      c.set(2, a.hy + 1, CLOTH.ash);
      c.set(3, a.hy + 2, CLOTH.ash);
      c.set(4, a.hy + 1, CLOTH.ash);
      c.col(a.w, 0, a.hy - 2, dark(col));
    },
    fur(c, a, col, _c2, skin) {
      ARMS.bare(c, a, col, null, skin);
      c.rect(0, 0, a.w + 1, 1, col);
      c.set(1, 2, col);
      c.set(a.w, 2, dark(col));
    },
  };
  const shoe = (c, l, col) => {
    c.rect(1, l.fy, l.w + 1, l.fy + 1, col);
    c.row(l.fy + 1, 1, l.w + 1, dark(col));
    c.clear(l.w + 1, l.fy);
  };
  const LEGS = {
    trousers(c, l, col, c2) {
      c.rect(1, 0, l.w, l.fy - 1, col);
      c.col(l.w, 0, l.fy - 1, dark(col));
      shoe(c, l, c2 || K);
    },
    shorts(c, l, col, c2, skin) {
      c.rect(1, 0, l.w, 3, col);
      c.rect(1, 4, l.w, l.fy - 1, skin);
      c.col(l.w, 4, l.fy - 1, dark(skin));
      c.set(l.w, 3, dark(col));
      shoe(c, l, c2 || CLOTH.earth);
    },
    /* shorts and long socks */
    socks(c, l, col, c2, skin) {
      LEGS.shorts(c, l, col, K, skin);
      c.rect(1, l.fy - 4, l.w, l.fy - 1, c2 || WHITE);
      c.col(l.w, l.fy - 4, l.fy - 1, dark(c2 || WHITE));
    },
    bare(c, l, _col, _c2, skin) {
      c.rect(1, 0, l.w, l.fy - 1, skin);
      c.col(l.w, 0, l.fy - 1, dark(skin));
      c.rect(1, l.fy, l.w + 1, l.fy + 1, skin);
      c.clear(l.w + 1, l.fy);
      c.set(l.w + 1, l.fy + 1, dark(skin));
    },
    /* bare legs in shoes: under a skirt */
    shoes(c, l, col, _c2, skin) {
      c.rect(1, 0, l.w, l.fy - 1, skin);
      c.col(l.w, 0, l.fy - 1, dark(skin));
      shoe(c, l, col || K);
    },
    boots(c, l, col, c2) {
      const b = c2 || BOOT;
      c.rect(1, 0, l.w, l.fy - 5, col);
      c.rect(1, l.fy - 4, l.w, l.fy - 1, b);
      shoe(c, l, b);
      c.row(l.fy - 4, 1, l.w, lite(lite(b)));
      c.col(l.w, 0, l.fy - 5, dark(col));
    },
    stockings(c, l, col, c2) {
      c.rect(1, 0, l.w, l.fy - 1, col);
      for (let y = 1; y < l.fy; y += 2) c.row(y, 1, l.w, c2 || WHITE);
      shoe(c, l, K);
    },
    ragged(c, l, col, _c2, skin) {
      c.rect(1, 0, l.w, l.fy - 4, col);
      c.set(1, l.fy - 3, col);
      c.set(3, l.fy - 3, col);
      c.rect(1, l.fy - 2, l.w, l.fy - 1, skin);
      c.set(2, l.fy - 3, skin);
      c.set(l.w, l.fy - 3, skin);
      c.rect(1, l.fy, l.w + 1, l.fy + 1, skin);
      c.clear(l.w + 1, l.fy);
    },
    wellies(c, l, col, c2) {
      c.rect(1, 0, l.w, 3, c2 || CLOTH.slate);
      c.rect(1, 4, l.w, l.fy - 1, col);
      shoe(c, l, col);
      c.row(4, 1, l.w, lite(col));
      c.col(l.w, 5, l.fy - 1, dark(col));
    },
    pegleg(c, l, col) {
      c.rect(1, 0, l.w, 4, col);
      c.col(2, 5, l.fy + 1, CLOTH.earth);
      c.col(3, 5, l.fy + 1, BOOT);
      c.row(5, 1, l.w, hex('#6b6b70'));
    },
    plate(c, l, col) {
      const m = col || STEEL;
      c.rect(1, 0, l.w, l.fy - 1, m);
      c.col(l.w, 0, l.fy - 1, dark(m));
      c.row(4, 1, l.w, lite(m));
      c.row(5, 1, l.w, dark(m));
      c.col(1, 6, l.fy - 1, lite(m));
      shoe(c, l, dark(m));
    },
    robot(c, l, col) {
      const m = col || STEEL;
      c.rect(1, 0, l.w, l.fy - 1, m);
      c.col(l.w, 0, l.fy - 1, dark(m));
      c.row(4, 1, l.w, K);
      shoe(c, l, dark(m));
    },
    fur(c, l, col, _c2, skin) {
      LEGS.bare(c, l, col, null, skin);
      c.rect(1, 0, l.w, 2, col);
      c.set(1, 3, col);
      c.set(3, 3, col);
    },
    pyjamas(c, l, col) {
      c.rect(1, 0, l.w, l.fy - 1, WHITE);
      for (let x = 2; x <= l.w; x += 2) c.col(x, 0, l.fy - 1, col);
      c.rect(1, l.fy, l.w + 1, l.fy + 1, CLOTH.ash);
      c.clear(l.w + 1, l.fy);
    },
  };

  /* a skirt, gown or the lower half of a robe: one piece over both legs */
  function makeSkirt(g, W, col, len, fl, o) {
    const xl = g.AW,
      xr = W - 1 - g.AW,
      off = fl + 2,
      c = canvas(W + 2 * fl + 4, len + 1);
    for (let y = 0; y < len; y++) {
      const e = len > 1 ? Math.round((fl * y) / (len - 1)) : 0;
      c.row(y, off + xl - e, off + xr + e, col);
      c.set(off + xr + e, y, dark(col));
      if (y > 1) {
        c.set(off + xl + 2 - (e >> 1), y, dark(col));
        c.set(off + xr - 2 + (e >> 1), y, dark(col));
      }
    }
    if (o.split) c.col(off + (W >> 1) - 1, 2, len - 1, dark(col));
    if (o.trim) {
      const e = fl;
      c.row(len - 1, off + xl - e, off + xr + e, o.trim);
    } else c.row(len - 1, off + xl - fl, off + xr + fl, dark(col));
    if (o.apron) {
      c.rect(off + xl + 2, 0, off + xr - 2, Math.max(2, len - 4), o.apron);
      c.col(off + xr - 2, 0, Math.max(2, len - 4), dark(o.apron));
    }
    if (o.band) for (let y = 3; y < len - 1; y += 3) c.row(y, off + xl - fl, off + xr + fl, o.band);
    if (o.tutu) {
      for (let x = off + xl - fl; x <= off + xr + fl; x += 2) c.set(x, len - 1, null);
    }
    done(c, false);
    return { c, off };
  }

  /* =====================================================================================
   * The figure.  P(opts) puts the parts together on a big sheet, lets `back` and `extra` draw around them in
   * doll coordinates (0,0 is the top left of the plain figure), outlines what was added and cuts the sheet to size.
   * ===================================================================================== */
  const OX = 40,
    OY = 44,
    SW = 96,
    SH = 96;
  function figure(o) {
    const g = GEO[o.g || 'adult'],
      W = g.TW + 2 * g.AW + 2,
      torsoY = g.FH + 2,
      legY = torsoY + g.TH + 2,
      H = legY + g.LL + 2,
      kid = g.FW < 8;
    const S = canvas(SW, SH),
      s = view(S, OX, OY + (33 - H) * 0);
    const skin = sk(o.skin || 'fair');
    const m = {
      g,
      W,
      H,
      kid,
      skin,
      torsoY,
      legY,
      armY: torsoY + 1,
      HY: torsoY + 1 + g.AL - (kid ? 1 : 2), // the top row of the hands
      RX: W - 1, // the column just outside the right arm
      LX: 0,
      FY: H - 1, // the floor row
      cx: (W >> 1) - 1,
      faceL: (W - g.FW) / 2,
      a: g.AW + 2, // the torso columns that show
      b: W - 3 - g.AW,
    };
    if (o.back) o.back(s, m);
    if (o.cape) {
      const cp = cl(o.cape),
        y1 = o.capeLen ? m.armY + o.capeLen : H - 4;
      for (let y = m.armY; y <= y1; y++) {
        const e = y > m.HY ? 1 : 0;
        s.row(y, 1 - e, W - 2 + e, cp);
        s.set(W - 2 + e, y, dark(cp));
        s.set(m.cx, y, dark(cp));
      }
      s.row(y1, 0, W - 1, dark(cp));
    }
    /* legs */
    if (o.legs !== 'none') {
      const mk = (spec) => {
        const [st, a, b] = sp(spec),
          c = canvas(g.LW + 2, g.LL + 2);
        if (!LEGS[st]) throw new Error('no legs ' + st);
        LEGS[st](c, { w: g.LW, fy: g.LL }, a ? cl(a) : CLOTH.slate, b ? cl(b) : o.shoes ? cl(o.shoes) : null, skin);
        return done(c, false);
      };
      const base = o.legs || 'trousers slate';
      s.stamp(mk(o.legL || base), g.AW, legY, true);
      s.stamp(mk(o.legR || base), g.AW + g.LW, legY);
    }
    if (o.skirt) {
      const [c0, len0, fl0] = sp(o.skirt),
        full = g.LL + 2,
        len = len0 === 'long' || !len0 ? full : len0 === 'ankle' ? full - 2 : len0 === 'knee' ? Math.ceil(full / 2) + 1 : len0 === 'short' ? Math.ceil(full / 2) - 1 : +len0;
      const k = makeSkirt(g, W, cl(c0), len, +(fl0 || 0), {
        trim: o.trim && cl(o.trim),
        apron: o.apron && cl(o.apron),
        band: o.band && cl(o.band),
        split: o.split,
        tutu: o.tutu,
      });
      s.stamp(k.c, -k.off, legY);
    }
    if (o.mid) o.mid(s, m);
    /* torso */
    const [tst, tc, tc2] = sp(o.top || 'shirt navy');
    if (!TORSOS[tst]) throw new Error('no top ' + tst);
    const T = canvas(g.TW + 4, g.TH + 3),
      ts = { x0: 2, x1: g.TW + 1, yb: g.TH + 1, cx: 1 + g.TW / 2, a: 3, b: g.TW };
    TORSOS[tst](T, ts, cl(tc || 'navy'), tc2 ? cl(tc2) : null, skin);
    if (o.torso) o.torso(T, ts);
    done(T, false);
    s.stamp(T, g.AW - 1, torsoY);
    /* arms */
    const armSpec = o.arms || (TOPARM[tst] ? TOPARM[tst] + (TOPARM[tst].includes(' ') ? '' : ' ' + (tc || 'navy')) : 'sleeve ' + (tc || 'navy'));
    const mkArm = (spec) => {
      const [st, a, b] = sp(spec),
        c = canvas(g.AW + 3, g.AL + 3),
        v = view(c, 0, 0);
      if (!ARMS[st]) throw new Error('no arms ' + st);
      ARMS[st](v, { w: g.AW, hy: g.AL - (kid ? 1 : 2), end: g.AL - 1 }, a ? cl(a) : cl(tc || 'navy'), b ? cl(b) : null, skin);
      /* cut to the doll's arm canvas: one column of outline each side */
      const d = canvas(g.AW + 2, g.AL + 3);
      d.stamp(c, 0, 0);
      return done(d, false);
    };
    const raise = o.raise || '';
    const putArm = (spec, left) => {
      const a = mkArm(spec),
        up = raise === 'both' || raise === (left ? 'L' : 'R');
      const x = left ? 0 : W - (g.AW + 2);
      if (!up) return left ? s.stamp(a, x, m.armY) : s.stamp(a, x, m.armY, true);
      /* raised: the same arm, turned upside down and set one column out so the head keeps its outline */
      const f = canvas(a.w, g.AL + 1);
      for (let y = 0; y <= g.AL; y++) for (let i = 0; i < a.w; i++) if (a.get(i, g.AL - y)) f.set(i, y, a.get(i, g.AL - y));
      for (let i = 0; i < a.w; i++) if (f.get(i, 1) && !f.get(i, 0)) f.set(i, 0, K);
      s.stamp(f, x + (left ? -1 : 1), m.armY - g.AL + 1, !left);
    };
    putArm(o.armL || armSpec, true);
    putArm(o.armR || armSpec, false);
    if (o.over) o.over(s, m);
    /* head */
    if (o.head !== 'none') {
      const h = makeHead(g, o);
      s.stamp(h.c, m.faceL - h.PX, 3 - h.PT);
    }
    if (o.extra) o.extra(s, m);
    /* outline what was drawn around the parts */
    const isK = (p) => p && p[0] === K[0] && p[1] === K[1] && p[2] === K[2];
    const add = [];
    for (let y = 1; y < SH - 1; y++)
      for (let x = 1; x < SW - 1; x++) {
        if (S.get(x, y)) continue;
        for (const [i, j] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const p = S.get(x + i, y + j);
          if (p && !isK(p)) {
            add.push([x, y]);
            break;
          }
        }
      }
    for (const [x, y] of add) S.px[y * SW + x] = K;
    /* cut to size: the feet on the bottom row, the body in the middle */
    let x0 = SW,
      x1 = 0,
      y0 = SH,
      y1 = 0;
    for (let y = 0; y < SH; y++)
      for (let x = 0; x < SW; x++)
        if (S.get(x, y)) {
          x0 = Math.min(x0, x);
          x1 = Math.max(x1, x);
          y0 = Math.min(y0, y);
          y1 = Math.max(y1, y);
        }
    const pad = Math.max(0, OX - x0, x1 - (OX + W - 1)),
      top = Math.max(0, OY - y0),
      bottom = Math.max(OY + H - 1, o.below ? y1 : 0);
    const w = Math.min(64, W + 2 * pad),
      h = Math.min(64, bottom - (OY - top) + 1),
      sx = OX - pad + ((W + 2 * pad - w) >> 1),
      sy = bottom - h + 1;
    return {
      w,
      h,
      draw(c) {
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (S.get(sx + x, sy + y)) c.set(x, y, S.get(sx + x, sy + y));
        return false;
      },
    };
  }

  const out = {};
  const P = (slug, o) => {
    if (out[slug]) throw new Error(slug + ' twice');
    try {
      out[slug] = figure(o);
    } catch (e) {
      throw new Error(slug + ': ' + e.message);
    }
  };

  /* =====================================================================================
   * Things people hold and wear.  All in doll coordinates; m.RX / m.LX are the columns just outside the right and
   * left arm, m.HY the top row of the hands, m.FY the floor.
   * ===================================================================================== */
  const I = {
    pole(s, x, y0, y1, col = WOOD) {
      s.col(x, y0, y1, col);
    },
    staff(s, m, x, y0, col = WOOD, orb) {
      s.col(x, y0, m.FY, col);
      if (orb) {
        const o = cl(orb);
        s.rect(x - 1, y0 - 3, x + 1, y0 - 1, o);
        s.set(x - 1, y0 - 3, lite(o));
        s.set(x + 1, y0 - 1, dark(o));
      }
    },
    spear(s, m, x, y0) {
      s.col(x, y0 + 3, m.FY, WOOD);
      s.col(x, y0, y0 + 2, STEEL);
      s.set(x, y0, lite(STEEL));
      s.set(x - 1, y0 + 2, STEEL);
      s.set(x + 1, y0 + 2, dark(STEEL));
    },
    /* a sword held upright in the fist: the blade rises from the hand */
    sword(s, m, x, len = 11, col = STEEL) {
      const y = m.HY;
      s.col(x, y - len, y - 1, col);
      s.set(x, y - len, lite(col));
      s.col(x + 1, y - len + 1, y - 1, dark(col));
      s.row(y, x - 1, x + 2, GOLD);
      s.col(x, y + 1, y + 2, CLOTH.leather);
      s.set(x, y + 3, GOLD);
    },
    /* a sword hanging at the hip, point down */
    scabbard(s, m, x, col = CLOTH.leather) {
      s.row(m.HY - 3, x - 1, x + 1, GOLD);
      s.col(x, m.HY - 5, m.HY - 4, CLOTH.leather);
      s.col(x, m.HY - 2, m.HY + 7, col);
      s.set(x, m.HY + 8, GOLD);
    },
    dagger(s, m, x) {
      const y = m.HY;
      s.col(x, y - 4, y - 1, STEEL);
      s.set(x, y - 4, lite(STEEL));
      s.row(y, x - 1, x + 1, CLOTH.leather);
      s.set(x, y + 1, CLOTH.leather);
    },
    axe(s, m, x, y0, big) {
      s.col(x, y0, m.FY, WOOD);
      const d = x > m.cx ? 1 : -1;
      s.rect(x + d, y0 + 1, x + 2 * d, y0 + 4, STEEL);
      s.set(x + 3 * d, y0, STEEL);
      s.col(x + 3 * d, y0 + 1, y0 + 4, lite(STEEL));
      s.set(x + 3 * d, y0 + 5, STEEL);
      if (big) {
        s.rect(x - 2 * d, y0 + 1, x - d, y0 + 4, STEEL);
        s.col(x - 3 * d, y0, y0 + 5, lite(STEEL));
      }
    },
    hammer(s, m, x, y0, col = STEEL) {
      s.col(x, y0, m.FY, WOOD);
      s.rect(x - 2, y0, x + 2, y0 + 3, col);
      s.row(y0, x - 2, x + 2, lite(col));
      s.col(x + 2, y0, y0 + 3, dark(col));
    },
    /* a small hammer or tool held in the hand, head up */
    tool(s, m, x, kind) {
      const y = m.HY;
      s.col(x, y - 4, y + 1, WOOD);
      if (kind === 'hammer') {
        s.rect(x - 1, y - 6, x + 1, y - 5, C.iron);
        s.row(y - 6, x - 1, x + 1, STEEL);
      } else if (kind === 'wrench') {
        s.col(x, y - 6, y + 1, STEEL);
        s.set(x - 1, y - 7, STEEL);
        s.set(x + 1, y - 7, STEEL);
        s.set(x - 1, y - 6, STEEL);
        s.set(x + 1, y - 6, dark(STEEL));
      } else if (kind === 'brush') {
        s.rect(x - 1, y - 7, x + 1, y - 5, CLOTH.cream);
        s.row(y - 7, x - 1, x + 1, cl('sky'));
      } else if (kind === 'scissors') {
        s.col(x, y - 5, y - 1, STEEL);
        s.col(x + 1, y - 6, y - 3, lite(STEEL));
        s.set(x, y, K);
        s.set(x + 1, y, K);
      } else if (kind === 'wand') {
        s.col(x, y - 6, y + 1, K);
        s.set(x, y - 6, WHITE);
        s.set(x, y - 7, WHITE);
      } else if (kind === 'mic') {
        s.col(x, y - 3, y + 1, K);
        s.rect(x - 1, y - 6, x + 1, y - 4, hex('#6f6d72'));
        s.set(x - 1, y - 6, hex('#a9acb4'));
      } else if (kind === 'spoon') {
        s.col(x, y - 5, y + 1, WOOD);
        s.rect(x - 1, y - 7, x + 1, y - 6, C.woodLight);
      } else if (kind === 'torch') {
        s.col(x, y - 3, y + 1, WOOD);
        s.rect(x - 1, y - 7, x + 1, y - 4, C.flame);
        s.set(x, y - 8, C.flame);
        s.set(x, y - 9, C.flameLight);
        s.rect(x, y - 6, x, y - 4, C.flameLight);
        s.set(x - 1, y - 4, RED);
        s.set(x + 1, y - 4, RED);
      }
    },
    pick(s, m, x, y0) {
      s.col(x, y0, m.FY, WOOD);
      s.row(y0 + 1, x - 3, x + 3, C.iron);
      s.set(x - 4, y0 + 2, C.iron);
      s.set(x + 4, y0 + 2, C.ironDark);
      s.set(x - 4, y0 + 3, STEEL);
      s.set(x + 4, y0 + 3, STEEL);
    },
    fork(s, m, x, y0) {
      s.col(x, y0 + 3, m.FY, WOOD);
      s.row(y0 + 3, x - 2, x + 2, C.iron);
      s.col(x - 2, y0, y0 + 2, C.iron);
      s.col(x, y0, y0 + 2, C.iron);
      s.col(x + 2, y0, y0 + 2, C.ironDark);
    },
    broom(s, m, x, y0, up) {
      if (up) {
        s.col(x, y0 + 5, m.FY, WOOD);
        s.rect(x - 1, y0, x + 1, y0 + 4, CLOTH.straw);
        s.col(x + 1, y0, y0 + 4, dark(CLOTH.straw));
        s.row(y0 + 4, x - 1, x + 1, CLOTH.wine);
        s.set(x - 2, y0, CLOTH.straw);
        s.set(x + 2, y0 + 1, dark(CLOTH.straw));
      } else {
        s.col(x, y0, m.FY - 5, WOOD);
        s.rect(x - 2, m.FY - 4, x + 2, m.FY, CLOTH.straw);
        s.col(x + 2, m.FY - 4, m.FY, dark(CLOTH.straw));
        s.col(x, m.FY - 3, m.FY, dark(CLOTH.straw));
        s.row(m.FY - 5, x - 1, x + 1, CLOTH.wine);
      }
    },
    shovel(s, m, x, y0) {
      s.col(x, y0, m.FY - 5, WOOD);
      s.row(y0, x - 1, x + 1, WOOD);
      s.rect(x - 1, m.FY - 4, x + 1, m.FY - 1, C.iron);
      s.set(x, m.FY, C.iron);
      s.col(x - 1, m.FY - 4, m.FY - 1, STEEL);
    },
    crook(s, m, x, y0) {
      s.col(x, y0 + 1, m.FY, WOOD);
      const d = x > m.cx ? 1 : -1;
      s.set(x + d, y0, WOOD);
      s.set(x + 2 * d, y0, WOOD);
      s.set(x + 3 * d, y0 + 1, WOOD);
      s.set(x + 3 * d, y0 + 2, C.woodDark);
      s.set(x, y0, WOOD);
    },
    cane(s, m, x) {
      const d = x > m.cx ? -1 : 1;
      s.col(x, m.HY - 1, m.FY, WOODD);
      s.set(x + d, m.HY - 1, WOODD);
      s.set(x, m.FY, K);
    },
    /* a round shield on the left arm */
    shield(s, m, col, boss = GOLD, kite) {
      const x0 = -1,
        y0 = m.HY - 8;
      if (kite) {
        s.rect(x0, y0, x0 + 6, y0 + 6, col);
        s.row(y0 + 7, x0 + 1, x0 + 5, col);
        s.row(y0 + 8, x0 + 2, x0 + 4, col);
        s.set(x0 + 3, y0 + 9, col);
        s.col(x0 + 6, y0, y0 + 6, dark(col));
        s.row(y0, x0, x0 + 6, lite(col));
        s.col(x0 + 3, y0 + 1, y0 + 8, boss);
        s.row(y0 + 3, x0 + 1, x0 + 5, boss);
      } else {
        s.oval(x0, y0, x0 + 6, y0 + 7, col);
        s.set(x0 + 1, y0 + 1, lite(col));
        s.set(x0 + 2, y0, lite(col));
        s.col(x0 + 6, y0 + 2, y0 + 5, dark(col));
        s.rect(x0 + 3, y0 + 3, x0 + 4, y0 + 4, boss);
        s.set(x0 + 4, y0 + 4, dark(boss));
      }
    },
    bow(s, m, x, col = WOOD) {
      const y = m.HY - 9;
      s.col(x - 1, y + 2, y + 15, col);
      s.set(x, y + 1, col);
      s.set(x, y + 16, col);
      s.set(x + 1, y, col);
      s.set(x + 1, y + 17, col);
      s.col(x + 1, y + 1, y + 16, hex('#b9b4a0'));
    },
    quiver(s, m) {
      s.rect(m.W - 4, 9, m.W - 3, 12, CLOTH.leather);
      s.set(m.W - 4, 7, RED);
      s.set(m.W - 3, 6, WHITE);
      s.set(m.W - 4, 8, WOOD);
      s.set(m.W - 3, 7, WOOD);
      s.set(m.W - 3, 8, WOOD);
    },
    /* something carried in the hand, below the fist */
    bag(s, m, x, col, w = 5, h = 5) {
      const y = m.HY + 2;
      s.set(x + (w >> 1), y, dark(col));
      s.rect(x, y + 1, x + w - 1, y + h, col);
      s.row(y + 1, x, x + w - 1, lite(col));
      s.col(x + w - 1, y + 1, y + h, dark(col));
    },
    briefcase(s, m, x, col = CLOTH.leather) {
      const y = m.HY + 2;
      s.row(y, x + 1, x + 3, K);
      s.rect(x, y + 1, x + 4, y + 4, col);
      s.row(y + 1, x, x + 4, lite(col));
      s.set(x + 2, y + 2, GOLD);
      s.col(x + 4, y + 1, y + 4, dark(col));
    },
    lantern(s, m, x) {
      const y = m.HY + 2;
      s.set(x + 1, y, C.iron);
      s.row(y + 1, x, x + 2, C.iron);
      s.rect(x, y + 2, x + 2, y + 4, C.flameLight);
      s.set(x + 1, y + 3, C.flame);
      s.col(x + 2, y + 2, y + 4, C.flame);
      s.row(y + 5, x, x + 2, C.ironDark);
    },
    bucket(s, m, x, col = STEEL) {
      const y = m.HY + 2;
      s.set(x + 2, y, C.iron);
      s.set(x + 1, y + 1, C.iron);
      s.set(x + 3, y + 1, C.iron);
      s.rect(x, y + 2, x + 4, y + 5, col);
      s.row(y + 2, x, x + 4, lite(col));
      s.col(x + 4, y + 2, y + 5, dark(col));
      s.row(y + 5, x + 1, x + 3, dark(col));
      s.set(x, y + 5, null);
    },
    /* a sack over the shoulder */
    sack(s, m, col, left) {
      const x = left ? -3 : m.W - 3;
      s.oval(x, m.armY - 1, x + 5, m.armY + 7, col);
      s.set(x + 1, m.armY, lite(col));
      s.col(x + 5, m.armY + 2, m.armY + 5, dark(col));
      s.set(left ? x + 5 : x, m.armY - 2, dark(col));
    },
    /* a rucksack: seen at both shoulders and behind the hips */
    pack(s, m, col) {
      s.rect(2, m.armY - 2, m.W - 3, m.armY + 9, col);
      s.rect(0, m.armY + 6, m.W - 1, m.armY + 9, col);
      s.col(m.W - 1, m.armY + 6, m.armY + 9, dark(col));
      s.row(m.armY - 2, 2, m.W - 3, lite(col));
    },
    straps(c, ts, col) {
      c.col(ts.a, 1, ts.yb, col);
      c.col(ts.b, 1, ts.yb, dark(col));
    },
    book(s, m, x, col = CLOTH.wine) {
      const y = m.HY - 2;
      s.rect(x, y, x + 3, y + 4, col);
      s.col(x, y, y + 4, dark(col));
      s.col(x + 3, y + 1, y + 3, C.paper);
      s.set(x + 1, y + 1, GOLD);
    },
    clipboard(s, m, x) {
      const y = m.HY - 3;
      s.rect(x, y, x + 3, y + 5, C.woodLight);
      s.rect(x, y + 1, x + 3, y + 5, C.paper);
      s.row(y + 2, x + 1, x + 2, dark(C.paper));
      s.row(y + 4, x + 1, x + 2, dark(C.paper));
      s.set(x + 1, y, STEEL);
      s.set(x + 2, y, STEEL);
    },
    mug(s, m, x, col = C.woodLight) {
      const y = m.HY - 2;
      s.rect(x, y, x + 2, y + 3, col);
      s.row(y - 1, x, x + 2, WHITE);
      s.col(x + 2, y, y + 3, dark(col));
      s.set(x + 3, y + 1, dark(col));
    },
    /* a tray held up on a raised hand */
    tray(s, m, x, y, what) {
      s.row(y, x - 3, x + 3, hex('#a9acb4'));
      s.set(x + 3, y, hex('#6f6d72'));
      if (what === 'glass') {
        s.rect(x - 2, y - 3, x - 1, y - 1, C.glassLight);
        s.set(x - 1, y - 1, C.glass);
        s.rect(x + 1, y - 2, x + 2, y - 1, CLOTH.wine);
      } else if (what === 'dome') {
        s.rect(x - 2, y - 2, x + 2, y - 1, hex('#a9acb4'));
        s.row(y - 3, x - 1, x + 1, hex('#cfd0d0'));
        s.set(x, y - 4, GOLD);
        s.col(x + 2, y - 2, y - 1, hex('#6f6d72'));
      } else {
        s.rect(x - 2, y - 2, x - 1, y - 1, WHITE);
        s.rect(x + 1, y - 3, x + 2, y - 1, C.woodLight);
        s.row(y - 3, x + 1, x + 2, WHITE);
      }
    },
    balloon(s, m, x, col) {
      const y = m.armY - m.g.AL - 10;
      s.oval(x - 2, y, x + 2, y + 5, col);
      s.set(x - 1, y + 1, lite(col));
      s.col(x + 2, y + 2, y + 3, dark(col));
      s.set(x, y + 6, dark(col));
      s.col(x, y + 7, m.armY - m.g.AL + 1, hex('#b9b4a0'));
    },
    flower(s, x, y, col, stem = 3) {
      s.col(x, y + 1, y + stem, C.leafLight);
      s.set(x, y, C.flameLight);
      s.set(x - 1, y, col);
      s.set(x + 1, y, dark(col));
      s.set(x, y - 1, col);
      s.set(x, y + 1, col);
    },
    bouquet(s, m, x, y, col) {
      s.rect(x, y, x + 3, y + 1, col);
      s.set(x, y, lite(col));
      s.set(x + 2, y, WHITE);
      s.set(x + 1, y + 1, C.flameLight);
      s.set(x + 3, y + 1, dark(col));
      s.row(y + 2, x + 1, x + 2, C.leafLight);
      s.set(x + 1, y + 3, C.leaf);
      s.set(x - 1, y + 1, C.leafLight);
    },
    ball(s, x, y, col, r = 4, col2) {
      s.oval(x, y, x + r - 1, y + r - 1, col);
      s.set(x + 1, y, lite(col));
      s.set(x + r - 1, y + r - 2, dark(col));
      if (col2) {
        s.set(x + 1, y + 1, col2);
        s.set(x + 2, y + 2, col2);
      }
    },
    camera(s, x, y) {
      s.rect(x, y, x + 3, y + 2, hex('#33323a'));
      s.set(x + 1, y - 1, hex('#33323a'));
      s.rect(x + 1, y, x + 2, y + 1, C.glass);
      s.set(x + 1, y, C.glassLight);
      s.set(x + 3, y, GOLD);
    },
    scarf(s, m, col, tail = true) {
      s.row(m.armY, m.a - 1, m.b + 1, col);
      s.row(m.armY + 1, m.a, m.b, dark(col));
      if (tail) {
        s.col(m.a + 1, m.armY + 1, m.armY + 5, col);
        s.set(m.a + 1, m.armY + 5, dark(col));
      }
    },
    tie(s, m, col) {
      s.col(m.cx, m.armY + 1, m.armY + 5, col);
    },
    belt(s, m, col = CLOTH.leather, buckle = GOLD) {
      s.row(m.legY - 1, m.a, m.b, col);
      s.set(m.cx, m.legY - 1, buckle);
    },
    stetho(s, m) {
      s.set(m.a, m.armY, hex('#33323a'));
      s.set(m.b, m.armY, hex('#33323a'));
      s.col(m.a, m.armY + 1, m.armY + 3, hex('#33323a'));
      s.col(m.b, m.armY + 1, m.armY + 2, hex('#33323a'));
      s.set(m.a + 1, m.armY + 4, hex('#33323a'));
      s.set(m.a + 2, m.armY + 4, STEEL);
      s.set(m.a + 2, m.armY + 5, STEEL);
    },
    badge(s, m, col = GOLD) {
      s.set(m.a, m.armY + 2, col);
    },
    medal(s, m, col = GOLD) {
      s.set(m.b - 1, m.armY + 2, RED);
      s.set(m.b - 1, m.armY + 3, col);
    },
    wings(s, m, col, big) {
      const y = m.armY - 2;
      for (const d of [-1, 1]) {
        const x = d < 0 ? 0 : m.W - 1;
        s.rect(x, y + 2, x + 2 * d, y + 9, col);
        s.rect(x + 2 * d, y, x + 3 * d, y + 6, col);
        s.col(x + 4 * d, y - 1, y + 4, col);
        if (big) {
          s.col(x + 5 * d, y - 3, y + 2, col);
          s.col(x + 6 * d, y - 4, y, col);
        }
        for (let yy = y + 1; yy <= y + 8; yy += 2) s.set(x + 2 * d, yy, dark(col));
        s.col(x + 3 * d, y + 3, y + 6, dark(col));
      }
    },
  };
  void blend;
  void mix;
  void BONE;

  /* the people themselves live in three helper files (a leading underscore keeps make-big from loading them as modules) */
  const api = { P, I, cl, hc, sk, C, K, hex, dark, lite, WHITE, BONE, BLOOD, RED, GOLD, STEEL, WOOD, WOODD, CLOTH, HAIR, SKINS };
  for (const f of ['_folk-heroes.js', '_folk-people.js', '_folk-cast.js']) {
    const file = require('path').join(__dirname, f);
    if (require('fs').existsSync(file)) require(file)(api);
  }
  return out;
};
