/*
 * The eerie rooms of the house and what is found in them: hospital, basement, attic, toilet (the washroom),
 * horror (the classic ones), nightmare (not-quite-people) and graveyard. 76 heads, 56 torsos, 33 arms, 33 legs.
 *
 * Each setting is drawn in its own file, tools/dolls/_horror-<theme>.js, which gets the kit of make-dolls.js and
 * the small tools below and returns { heads, torsos, arms, legs } without a theme: the theme is added here.
 * Parts are numbered by their place in the lists, so the order of THEMES never changes and a new part goes at
 * the end of its list in the LAST theme file (or in a new file appended to THEMES).
 */
const THEMES = ['hospital', 'basement', 'attic', 'toilet', 'horror', 'nightmare', 'graveyard'];

module.exports = (kit) => {
  const { hex, dark, lite } = kit;
  /** A few colours the settings share. */
  const C = {
    scrub: hex('#5d8a76'), // surgical green
    scrubBlue: hex('#5b7896'),
    gown: hex('#a8b9b6'), // the thin hospital gown
    steel: hex('#8d9aa0'),
    iron: hex('#6b6b70'),
    soot: hex('#2b2724'),
    rubber: hex('#35423a'), // dark green rubber
    olive: hex('#5a5e3a'),
    brass: hex('#a8873a'),
    wood: hex('#584031'),
    leather: hex('#3a2c22'),
    sack: hex('#9c8a62'),
    tear: hex('#6f8fae'),
    glass: hex('#8fa6a0'),
    mud: hex('#5a4a34'),
    dust: hex('#a8a294'),
    porcelain: hex('#e2dccd'),
    glow: hex('#d9c56a'),
    grey: hex('#7d8482'), // the grey skin of things in dreams
    dirtyWhite: hex('#c9c2ad'),
  };
  const U = {
    C,
    /** Set a list of pixels [[x, y], ...] in one colour. */
    P(c, col, pts) {
      for (const [x, y] of pts) c.set(x, y, col);
    },
    /** A sleeve from the shoulder down to row `to`. */
    sleeve(c, col, to = 8) {
      c.rect(1, 0, 3, to, col);
      c.col(3, 0, to, dark(col));
      c.set(1, 0, lite(col));
    },
    /** The arm below a sleeve, or a hand: skin from row `from` to the fingertips. */
    hand(c, skin, from = 9) {
      c.rect(1, from, 3, 10, skin);
      c.col(3, from, 10, dark(skin));
    },
    /** A trouser leg down to row `to`. */
    trouser(c, col, to = 9) {
      c.rect(1, 0, 4, to, col);
      c.col(4, 0, to, dark(col));
      c.set(1, 0, lite(col));
    },
    /** A bare leg from row `from` to the ankle. */
    shin(c, skin, from = 0) {
      c.rect(1, from, 4, 9, skin);
      c.col(4, from, 9, dark(skin));
    },
    /** A bare foot. */
    foot(c, skin) {
      c.rect(1, 10, 5, 11, skin);
      c.clear(5, 10);
      c.set(5, 11, dark(skin));
      c.set(4, 11, dark(skin));
    },
    /** Spectacles on an ordinary face: the eyes stay where they are. */
    glasses(c, col = kit.K) {
      for (const x of [3, 6, 7, 10]) c.set(x, 6, col);
      c.set(4, 6, C.glass);
      c.set(9, 6, C.glass);
    },
    /** Stubble or a shadow on the jaw. */
    stubble(c, s, k = 0.8) {
      const st = kit.mix(s, k);
      U.P(c, st, [
        [3, 8],
        [3, 9],
        [4, 9],
        [4, 10],
        [5, 10],
        [6, 10],
        [7, 10],
        [8, 10],
        [9, 9],
        [5, 11],
        [6, 11],
        [7, 11],
        [8, 11],
      ]);
    },
    /** The lists of one setting and the short ways of adding to them. */
    lists() {
      const heads = [],
        torsos = [],
        arms = [],
        legs = [];
      return {
        heads,
        torsos,
        arms,
        legs,
        /** a person: the face in that skin with that expression, then draw(c, s) on top */
        H: (name, skin, expr, draw, more) => heads.push({ name, skin, expr, draw, ...more }),
        /** any other head: draw(c) draws all of it */
        S: (name, draw, more) => heads.push({ name, special: true, draw, ...more }),
        T: (name, draw, more) => torsos.push({ name, draw, ...more }),
        A: (name, draw, more) => arms.push({ name, draw, ...more }),
        L: (name, draw, more) => legs.push({ name, draw, ...more }),
      };
    },
  };
  const out = { heads: [], torsos: [], arms: [], legs: [] };
  for (const theme of THEMES) {
    const part = require(`./_horror-${theme}.js`)(kit, U);
    for (const k of Object.keys(out)) for (const p of part[k]) out[k].push({ ...p, theme });
  }
  return out;
};
