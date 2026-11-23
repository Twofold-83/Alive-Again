/*
 * Room tile sets for the settings of a story: thirteen places, each with a dark surround (`-top`), a plain back
 * wall, a handful of wall tiles with one feature each, a plain floor and a few floor variants. Every tile is
 * 16 x 16, fills its square, has no outline and no automatic shading, and repeats without a seam.
 *
 *   node tools/make-big.js --only=env-tiles --out=<dir>
 */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd, canvas, rows }) => {
  const out = {};
  const tile = (slug, kind, name, draw) =>
    (out[slug] = { cat: 'env-tiles', catLabel: 'Rooms: settings', group: 'tile', kind, name, w: 16, h: 16, shade: false, outline: false, draw });

  /* ---------- helpers ---------- */
  /** A palette of one-letter colours for art(). */
  const pal = (o) => {
    const p = {};
    for (const [k, v] of Object.entries(o)) p[k] = typeof v === 'string' ? hex(v) : v;
    return p;
  };
  const fill = (c, col) => c.rect(0, 0, 15, 15, col);
  /** Every pixel: f(x, y) gives its colour (or nothing, to leave it). */
  const each = (c, f) => {
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const v = f(x, y);
        if (v) c.set(x, y, v);
      }
  };
  /** n pixels of a colour, scattered the same way every time. */
  const speck = (c, col, n, seed, x0 = 0, y0 = 0, x1 = 15, y1 = 15) => {
    const r = rnd(seed);
    for (let i = 0; i < n; i++) c.set(x0 + Math.floor(r() * (x1 - x0 + 1)), y0 + Math.floor(r() * (y1 - y0 + 1)), col);
  };
  /** Single pixels, wrapped round the tile's edges. */
  const dots = (c, col, list) => {
    for (const [x, y] of list) c.set(x & 15, y & 15, col);
  };
  /** Text art: one letter is one pixel of the palette p, anything else leaves what is there. */
  const art = (c, x, y, lines, p) => {
    lines.forEach((l, j) => {
      for (let i = 0; i < l.length; i++) if (p[l[i]]) c.set(x + i, y + j, p[l[i]]);
    });
  };
  /** Brickwork: courses of four rows, bricks eight wide, every other course shifted by half a brick. */
  const bricks = (c, b, b2, m, seed = 1) => {
    const r = rnd(seed);
    fill(c, m);
    for (let cy = 0; cy < 4; cy++)
      for (let bx = 0; bx < 2; bx++) {
        const col = r() < 0.34 ? b2 : b,
          x0 = (cy % 2 ? 4 : 0) + bx * 8;
        for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) c.set((x0 + i) % 16, cy * 4 + j, col);
      }
  };
  /**
   * One set: { top(c), wall(c), details: [[slug part, words, draw(c)]], floor(c), variants: [[part, words, draw(c)]] }.
   * A detail is drawn on the plain wall, a variant on the plain floor (unless it says `fresh`, then on nothing).
   */
  const set = (id, words, o) => {
    tile(`${id}-top`, 'wall', `${words} ${o.topWords || 'wall top dark ceiling edge surround'}`, o.top);
    tile(`${id}-wall`, 'wall', `${words} wall plain ${o.wallWords || ''}`.trim(), o.wall);
    for (const [n, w, f, fresh] of o.details)
      tile(`${id}-wall-${n}`, 'wall', `${words} wall ${w}`, (c) => {
        if (!fresh) o.wall(c);
        f(c);
      });
    tile(`${id}-floor`, 'floor', `${words} floor ${o.floorWords || ''}`.trim(), o.floor);
    for (const [n, w, f, fresh] of o.variants)
      tile(`${id}-floor-${n}`, 'floor', `${words} floor ${w}`, (c) => {
        if (!fresh) o.floor(c);
        f(c);
      });
  };

  /* ================= 1. street: a street at night ================= */
  {
    const p = pal({
      k: '#0d0c12', // the dark behind things
      d: '#1b1a23',
      f: '#26242d', // frames
      y: '#a58c4b', // a lit pane
      Y: '#c4ab63',
      o: '#77653a', // lit, but dim
      g: '#5d5e69', // stone
      G: '#74757f',
      s: '#3f404b',
      b: '#8a6f33', // brass
      t: '#27403f', // a painted door
      T: '#31514e',
      u: '#1c2f30',
      c: '#4b2f38', // a curtain
      r: '#6d2a2a',
      w: '#8e8c84', // road paint
      e: '#8b8a6a', // two eyes
    });
    const brick = hex('#4e3437'),
      brick2 = hex('#452e33'),
      mortar = hex('#2b2329'),
      slab = hex('#50515d'),
      joint = hex('#3b3b46'),
      slabL = hex('#5b5c68'),
      slabD = hex('#484955'),
      tar = hex('#2f3039'),
      tarL = hex('#393a44'),
      tarD = hex('#27282f');
    const wall = (c) => {
      bricks(c, brick, brick2, mortar, 3);
      dots(c, mortar, [[2, 1], [13, 9]]);
      dots(c, hex('#58393a'), [[9, 5], [5, 13]]);
    };
    const floor = (c) => {
      fill(c, slab);
      c.row(7, 0, 15, joint);
      c.row(15, 0, 15, joint);
      c.col(15, 0, 6, joint);
      c.col(7, 8, 14, joint);
      dots(c, slabL, [[3, 2], [10, 4], [12, 11], [2, 12], [5, 9]]);
      dots(c, slabD, [[6, 5], [13, 1], [9, 13], [1, 10], [11, 3]]);
    };
    const asphalt = (c) => {
      fill(c, tar);
      speck(c, tarL, 9, 5);
      speck(c, tarD, 9, 11);
    };
    set('street', 'street night town', {
      topWords: 'night sky roof line dark roofs surround',
      top: (c) => {
        fill(c, hex('#14141c'));
        each(c, (x, y) => (y % 4 === 3 && (x + (y >> 2) * 5) % 8 < 6 ? hex('#191922') : null));
        dots(c, hex('#20202b'), [[3, 1], [11, 9]]);
      },
      wallWords: 'brick house front',
      wall,
      details: [
        [
          'shop-window',
          'shop window lit display',
          (c) =>
            art(c, 0, 1, [
              '.ffffffffffffff.',
              '.fyyyyyyfyyyyyf.',
              '.fyYYyyyfyyyYyf.',
              '.fyYyyyyfyyyyyf.',
              '.fyyyyyyfyyyyyf.',
              '.fyyyykyfykkyyf.',
              '.fyookkyfykkyyf.',
              '.fyookkyfkkkkyf.',
              '.foooooofooooof.',
              '.ffffffffffffff.',
              'gggggggggggggggg',
              '.ssssssssssssss.',
            ], p),
        ],
        [
          'shop-door',
          'shop door glass lit',
          (c) =>
            art(c, 0, 0, [
              '................',
              '..ffffffffffff..',
              '..foooooooooof..',
              '..ffffffffffff..',
              '..fddddddddddf..',
              '..fddyyyyyyddf..',
              '..fddyYyyyyddf..',
              '..fddyyyyyyddf..',
              '..fddyykkyyddf..',
              '..fddykkkkyddf..',
              '..fddddddddbdf..',
              '..fddddddddddf..',
              '..fddffffffddf..',
              '..fddffffffddf..',
              '..fddddddddddf..',
              '.gggggggggggggg.',
            ], p),
        ],
        [
          'shutter',
          'shop shutter down closed roller',
          (c) => {
            art(c, 0, 1, ['.ffffffffffffff.', '.fGGGGGGGGGGGGf.'], p);
            for (let y = 3; y < 16; y++) {
              c.set(1, y, p.f);
              c.set(14, y, p.f);
              c.row(y, 2, 13, y % 2 ? p.s : p.g);
            }
            art(c, 4, 7, ['r..r', 'r.r.', 'rr..', 'r.r.', 'r..r'], p);
            art(c, 9, 8, ['rr.', 'r.r', 'r.r', 'rr.'], p);
            art(c, 7, 13, ['bb', 'kk'], p);
          },
        ],
        [
          'alley',
          'alley mouth dark gap passage eyes',
          (c) => {
            c.rect(3, 1, 12, 15, p.k);
            c.row(1, 2, 13, p.s);
            c.col(3, 2, 15, p.d);
            c.rect(7, 4, 8, 15, hex('#12111a'));
            c.set(6, 9, p.e);
            c.set(9, 9, p.e);
            c.row(15, 4, 12, hex('#17161f'));
          },
        ],
        [
          'house-door',
          'house door steps fanlight',
          (c) =>
            art(c, 0, 0, [
              '................',
              '.....oooooo.....',
              '....fooffoof....',
              '...ffffffffff...',
              '...ftTTttTTtf...',
              '...ftTTttTTtf...',
              '...ftTTttTTtf...',
              '...fttttttttf...',
              '...ftttttttbf...',
              '...ftTTttTTtf...',
              '...ftTTttTTtf...',
              '...ftTTttTTtf...',
              '...fuuuuuuuuf...',
              '..GGGGGGGGGGGG..',
              '.gGGGGGGGGGGGGg.',
              '.gggggggggggggg.',
            ], p),
        ],
        [
          'window-figure',
          'window lit figure watching silhouette',
          (c) =>
            art(c, 0, 1, [
              '...ffffffffff...',
              '...fcoooooocf...',
              '...fcookkoocf...',
              '...fcokkkkocf...',
              '...fcokkkkocf...',
              '...fccokkoccf...',
              '...fcckkkkccf...',
              '...fckkkkkkcf...',
              '...fckkkkkkcf...',
              '...ffffffffff...',
              '..gggggggggggg..',
            ], p),
        ],
      ],
      floorWords: 'pavement slabs',
      floor,
      variants: [
        ['asphalt', 'road asphalt tarmac', asphalt, true],
        [
          'line',
          'road white line marking',
          (c) => {
            asphalt(c);
            c.rect(1, 7, 14, 8, p.w);
            dots(c, tar, [[3, 7], [9, 8], [12, 7], [6, 8]]);
            dots(c, hex('#77756e'), [[5, 7], [10, 7], [2, 8], [13, 8]]);
          },
          true,
        ],
        [
          'kerb',
          'kerb gutter drain',
          (c) => {
            c.rect(0, 7, 15, 8, p.G);
            c.row(8, 0, 15, p.g);
            dots(c, joint, [[5, 7], [5, 8], [13, 7], [13, 8]]);
            c.rect(0, 9, 15, 15, tar);
            c.row(9, 0, 15, tarD);
            speck(c, tarL, 5, 4, 0, 10, 15, 15);
            c.rect(4, 11, 11, 14, p.s);
            for (let x = 5; x < 11; x += 2) c.col(x, 11, 14, p.k);
          },
        ],
        [
          'wet',
          'wet slab rain reflection',
          (c) => {
            each(c, (x, y) => {
              const q = c.get(x, y);
              return q === joint ? hex('#30323f') : hex('#414556');
            });
            art(c, 2, 3, ['hhhh', '.hh'], { h: hex('#5a6177') });
            art(c, 9, 10, ['.hhh', 'hhhhh'], { h: hex('#5a6177') });
            art(c, 4, 11, ['a', 'a', 'a'], { a: hex('#7a6c48') });
            dots(c, hex('#6d748a'), [[12, 4], [6, 13]]);
          },
        ],
      ],
    });
  }

  return out;
};
