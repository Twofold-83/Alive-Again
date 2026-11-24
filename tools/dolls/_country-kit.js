/*
 * Helpers of the "country" doll parts: sprites written as small pictures of characters.
 *   art(c, rows, map, x0, y0)   every character of every row is one pixel: '.' leaves what is there, '_' rubs it out,
 *                               any other character is looked up in map
 *   P({ a: colour, ... })       a map: each lower-case letter is its colour, its capital the dark of it; and always
 *                               '#' black  '+' white  '=' grey-white  '*' gold  '!' red  '%' blood  '~' bone
 */
module.exports = (kit) => {
  const { K, WHITE, BONE, BLOOD, RED, GOLD, dark, hex } = kit;
  const BASE = { '#': K, '+': WHITE, '=': dark(WHITE), '*': GOLD, '!': RED, '%': BLOOD, '~': BONE };
  const P = (o = {}) => {
    const m = { ...BASE };
    for (const [k, v] of Object.entries(o)) {
      m[k] = v;
      if (/[a-z]/.test(k) && !(k.toUpperCase() in o)) m[k.toUpperCase()] = dark(v);
    }
    return m;
  };
  const art = (c, rows, map, x0 = 0, y0 = 0) =>
    rows.forEach((r, j) => {
      for (let i = 0; i < r.length; i++) {
        const ch = r[i];
        if (ch === '.' || ch === ' ') continue;
        if (ch === '_') {
          c.clear(x0 + i, y0 + j);
          continue;
        }
        if (!map[ch]) throw new Error(`art: no colour for "${ch}" in "${r}"`);
        c.set(x0 + i, y0 + j, map[ch]);
      }
    });
  /** a colour between two */
  const blend = (a, b, k = 0.5) => a.map((v, i) => Math.round(v * (1 - k) + b[i] * k));
  const C = {
    leather: hex('#6a4a30'),
    hide: hex('#8a6a44'),
    sack: hex('#8a7a5a'),
    straw: hex('#b59a52'),
    steel: hex('#8b929c'),
    iron: hex('#5c6068'),
    mud: hex('#4a3a28'),
    wood: hex('#a8854a'),
    stone: hex('#7d8078'),
    moss: hex('#4f6a3a'),
    denim: hex('#3e5370'),
    olive: hex('#4a5032'),
    fur: hex('#6b4f36'),
    peat: hex('#4a3524'),
    oil: hex('#a48a36'),
    soot: hex('#2a262a'),
    purple: hex('#553064'),
    orc: hex('#5f7a44'),
    goblin: hex('#8a9a4a'),
    brick: hex('#8f2f2a'),
  };
  return { P, art, blend, C };
};
