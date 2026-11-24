/*
 * Small drawing helpers for tools/dolls/other.js and its theme files (_other-<theme>.js).
 *
 *   art(c, palette, rows)   a sprite written out as rows of letters, one letter per pixel:
 *                           '.' leaves the pixel as it is, '_' rubs it out, any other letter is a colour of the palette
 *   pal({ a: colour, … })   a palette: every small letter given, its CAPITAL as the darker tone of it, and the
 *                           fixed colours k black, w white, n bone, r red, R blood, y gold (W, N, Y their dark tones)
 *   repaint(c, s, to, …)    recolours the bare skin of a face (and only the skin: eyes, brows and mouth stay), so a
 *                           painted, masked or flayed face still shows its feelings
 */
module.exports = (kit, lists) => {
  const { K, WHITE, BONE, BLOOD, RED, GOLD, dark, lite, hex } = kit;
  const FIXED = { k: K, w: WHITE, W: dark(WHITE), n: BONE, N: dark(BONE), r: RED, R: BLOOD, y: GOLD, Y: dark(GOLD) };
  const col = (v) => (typeof v === 'string' ? hex(v) : v);
  const pal = (map = {}) => {
    const p = { ...FIXED };
    for (const ch of Object.keys(map)) {
      p[ch] = col(map[ch]);
      const up = ch.toUpperCase();
      if (up !== ch && !(up in map)) p[up] = dark(p[ch]);
    }
    return p;
  };
  const art = (c, p, rows, ox = 0, oy = 0) => {
    if (!ox && !oy && (rows.length > c.h || rows.some((r) => r.length !== c.w))) throw new Error(`art: rows must be ${c.w} wide, at most ${c.h} high:\n` + rows.join('\n'));
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) {
        const ch = r[x];
        if (ch === '.') continue;
        if (ch === '_') c.clear(x + ox, y + oy);
        else if (!p[ch]) throw new Error(`art: no colour '${ch}' in\n` + rows.join('\n'));
        else c.set(x + ox, y + oy, p[ch]);
      }
    });
  };
  const same = (a, b) => !!a && !!b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  /** Recolour bare skin (its three tones) inside a box; `to` is a colour or (x, y) => colour. */
  const repaint = (c, s, to, x0 = 0, y0 = 0, x1 = c.w - 1, y1 = c.h - 1) => {
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const p = c.get(x, y),
          t = typeof to === 'function' ? to(x, y) : to;
        if (!t) continue;
        if (same(p, s)) c.set(x, y, t);
        else if (same(p, dark(s))) c.set(x, y, dark(t));
        else if (same(p, lite(s))) c.set(x, y, lite(t));
      }
  };
  const px = (c, colour, pts) => pts.forEach(([x, y]) => c.set(x, y, colour));
  /** The four ways of adding a part, all with the theme filled in. Torsos, arms and legs are shaded unless told not to. */
  const theme = (id) => ({
    person: (name, skin, expr, draw, o = {}) => lists.heads.push({ name, theme: id, skin, expr, draw, ...o }),
    special: (name, draw, o = {}) => lists.heads.push({ name, theme: id, special: true, draw, ...o }),
    torso: (name, draw, o = {}) => lists.torsos.push({ name, theme: id, shade: true, draw, ...o }),
    arm: (name, draw, o = {}) => lists.arms.push({ name, theme: id, shade: true, draw, ...o }),
    leg: (name, draw, o = {}) => lists.legs.push({ name, theme: id, shade: true, draw, ...o }),
  });
  return { pal, art, same, repaint, px, theme };
};
