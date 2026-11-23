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
      w: '#807e77', // road paint
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

  /* ================= 2. alley: an urban back alley ================= */
  {
    const p = pal({
      k: '#0c0b10',
      d: '#18171d',
      i: '#444650', // iron
      I: '#5e626d',
      j: '#26282f',
      r: '#6e3a26', // rust
      w: '#85826f', // pale paint
      R: '#7a2c2c', // red paint
      n: '#b4527c', // neon
      N: '#d98aa8',
      m: '#5a3044', // a dead tube
      g: '#3a4446', // a steel door
      G: '#465254',
      u: '#2a3233',
      o: '#8a7a45', // lamp light
      y: '#b9a560',
      b: '#232d36', // dark glass
      B: '#34444f',
      p: '#9a9684', // paper
      q: '#6f6c60',
      c: '#5c2f2f', // a can
      s: '#35343a',
      e: '#2c3440', // water
      h: '#5d6a78',
    });
    const brick = hex('#3e3437'),
      brick2 = hex('#372e32'),
      mortar = hex('#221e24'),
      con = hex('#4a494e'),
      conL = hex('#545358'),
      conD = hex('#403f45'),
      crack = hex('#313036');
    const wall = (c) => {
      bricks(c, brick, brick2, mortar, 7);
      dots(c, mortar, [[1, 5], [2, 5], [10, 13], [12, 1]]);
      dots(c, hex('#2f272b'), [[5, 9], [6, 10], [13, 6]]);
    };
    const floor = (c) => {
      fill(c, con);
      speck(c, conL, 8, 3);
      speck(c, conD, 8, 9);
      dots(c, crack, [[4, 3], [5, 3], [6, 4], [6, 5], [7, 5], [5, 2], [11, 11], [12, 11], [12, 12]]);
    };
    set('alley', 'back alley urban', {
      top: (c) => {
        fill(c, hex('#121116'));
        speck(c, hex('#18171d'), 7, 2);
        dots(c, hex('#1e1c23'), [[4, 11], [12, 3]]);
      },
      wallWords: 'sooty brick',
      wall,
      details: [
        [
          'graffiti',
          'graffiti spray paint eye drips',
          (c) =>
            art(c, 0, 2, [
              '................',
              '.....wwwwww.....',
              '...ww......ww...',
              '..w....RR....w..',
              '.w....RRRR....w.',
              '..w....RR....w..',
              '...ww......ww...',
              '.....wwwwww.....',
              '......w...w.....',
              '......w...w.....',
              '..........w.....',
              '.R.R............',
              '..R.............',
              '.R.R............',
            ], p),
        ],
        [
          'pipe',
          'drain pipe downpipe rust',
          (c) => {
            art(c, 4, 1, ['IiiiiiJ', '.Iiiij.', '..Iij..'], { ...p, J: p.j });
            for (let y = 4; y < 16; y++) art(c, 6, y, ['Iij'], p);
            art(c, 5, 6, ['jIiij'], p);
            art(c, 5, 12, ['jIiij'], p);
            dots(c, p.r, [[7, 8], [7, 9], [8, 13], [6, 14]]);
            dots(c, p.d, [[9, 15], [10, 15], [5, 15]]);
          },
        ],
        [
          'door',
          'back door steel lamp',
          (c) =>
            art(c, 0, 0, [
              '......yyyy......',
              '......oyyo......',
              '..jjjjjjjjjjjj..',
              '..jgGGGGGGGGgj..',
              '..jgGggggggGgj..',
              '..jgGgwwwwgGgj..',
              '..jgGggggggGgj..',
              '..jgGGGGGGGGgj..',
              '..jgggggggggIj..',
              '..jgggggggggIj..',
              '..jgGGGGGGGGgj..',
              '..jgGggggggGgj..',
              '..jgGGGGGGGGgj..',
              '..juuuuuuuuuuj..',
              '..juuuuuuuuuuj..',
              '..jssssssssssj..',
            ], p),
        ],
        [
          'window-bars',
          'barred window bars dark',
          (c) =>
            art(c, 0, 2, [
              '..ssssssssssss..',
              '..sbIbbIbbIbbs..',
              '..sbIbbIBbIbbs..',
              '..sbIbBIBbIbbs..',
              '..sbIbbIbbIbbs..',
              '..sbIbbIbbIbbs..',
              '..sbIbbIbbIbbs..',
              '..sbIbbIbbIbbs..',
              '..ssssssssssss..',
              '.qqqqqqqqqqqqqq.',
            ], p),
        ],
        [
          'ladder',
          'fire escape ladder iron',
          (c) => {
            art(c, 2, 0, ['jjjjjjjjjjjj', 'IiIiIiIiIiIi', 'j..........j'], p);
            for (let y = 2; y < 13; y++) {
              c.set(5, y, p.I);
              c.set(10, y, p.i);
              if (y % 3 === 1) c.row(y, 6, 9, p.i);
            }
            c.set(5, 13, p.j);
            c.set(10, 13, p.j);
          },
        ],
        [
          'neon',
          'neon sign glow bar flicker',
          (c) => {
            const glow = (x0, y0, x1, y1) => {
              for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (c.get(x, y)) c.set(x, y, blend(c.get(x, y), p.n, 0.22));
            };
            glow(1, 3, 14, 11);
            glow(0, 5, 15, 9);
            art(c, 2, 5, ['nn..mmm.nn.', 'n.n.m.m.n.n', 'nn..mmm.nn.', 'n.n.m.m.n.n', 'nn..m.m.n.n'], p);
            dots(c, p.N, [[2, 5], [10, 5], [2, 7], [10, 7]]);
            dots(c, p.j, [[1, 4], [13, 4], [7, 3], [7, 4]]);
          },
        ],
      ],
      floorWords: 'cracked concrete',
      floor,
      variants: [
        [
          'puddle',
          'puddle water',
          (c) => {
            art(c, 2, 5, ['...eeeeee...', '.eeeeeeeeee.', 'eeehheeeeeee', 'eeeeeeeeehee', '.eeeeeeeeee.', '..eeeeeee...'], p);
            dots(c, crack, [[4, 5], [3, 6], [13, 9], [10, 10], [2, 7]]);
          },
        ],
        [
          'litter',
          'litter rubbish paper can',
          (c) => {
            art(c, 2, 3, ['.pp.', 'pqpp', '.ppq'], p);
            art(c, 9, 9, ['ccw', 'cRc'], p);
            dots(c, p.p, [[12, 4], [13, 4], [5, 12]]);
            dots(c, p.q, [[6, 12], [11, 14]]);
          },
        ],
        [
          'grate',
          'grate drain iron',
          (c) => {
            c.rect(3, 3, 12, 12, p.i);
            c.frame(3, 3, 12, 12, p.j);
            for (let x = 5; x <= 10; x += 2) c.col(x, 5, 10, p.k);
            c.row(3, 3, 12, p.I);
          },
        ],
        [
          'cobbles',
          'cobbles cobblestones',
          (c) =>
            each(c, (x, y) => {
              const row = y >> 2,
                xx = (x + (row % 2) * 2) % 4,
                st = ((x + (row % 2) * 2) >> 2) % 4;
              if (xx === 3 || y % 4 === 3) return hex('#2c2b31');
              const k = (st * 5 + row * 3) % 4;
              return xx === 0 && y % 4 === 0 ? conL : k === 0 ? conD : k === 3 ? hex('#454449') : con;
            }),
          true,
        ],
      ],
    });
  }

  /* ================= 3. electronics: a machine hall ================= */
  {
    const p = pal({
      k: '#0d0e12',
      d: '#1c1f24',
      m: '#3a4347', // panel
      M: '#465054',
      n: '#2b3236',
      s: '#555a62', // steel
      S: '#6d727a',
      r: '#7a2a27', // lamps
      R: '#c0503a',
      a: '#a8822e',
      g: '#3d6e3c',
      G: '#7fb86a',
      e: '#14261d', // a screen
      f: '#a39e86', // a dial face
      F: '#bdb8a0',
      t: '#5a3d2a', // tape
      y: '#9c872f', // warning paint
      Y: '#b8a23c',
      b: '#3c5068', // cables
      c: '#6b2c2c',
      o: '#8a6c2e',
    });
    const bar = hex('#444950'),
      barL = hex('#565b64'),
      hole = hex('#21242a');
    const wall = (c) => {
      fill(c, p.m);
      c.row(0, 0, 15, p.M);
      c.col(0, 0, 15, p.M);
      c.row(15, 0, 15, p.n);
      c.col(15, 0, 15, p.n);
      dots(c, p.n, [[2, 2], [13, 2], [2, 13], [13, 13]]);
      dots(c, p.M, [[6, 9], [7, 9], [10, 5]]);
    };
    const floor = (c) => each(c, (x, y) => (x % 4 === 0 && y % 4 === 0 ? barL : x % 4 === 0 || y % 4 === 0 ? bar : hole));
    const plate = (c) => {
      fill(c, bar);
      c.row(0, 0, 15, barL);
      c.col(0, 0, 15, barL);
      c.row(15, 0, 15, hex('#32363d'));
      c.col(15, 0, 15, hex('#32363d'));
      dots(c, p.S, [[2, 2], [13, 2], [2, 13], [13, 13]]);
      dots(c, hex('#32363d'), [[3, 3], [14, 3], [3, 14], [14, 14]]);
    };
    set('electronics', 'machine hall electronics computer', {
      top: (c) => {
        fill(c, hex('#14161b'));
        c.row(15, 0, 15, hex('#101116'));
        dots(c, hex('#1b1e24'), [[3, 4], [4, 4], [11, 10], [12, 10], [8, 7]]);
      },
      wallWords: 'metal panel machinery',
      wall,
      details: [
        [
          'lights',
          'blinking lights panel lamps switches',
          (c) => {
            c.rect(2, 2, 13, 8, p.k);
            const cols = [p.R, p.a, p.d, p.g, p.r, p.d, p.G, p.a, p.d, p.r, p.d, p.g, p.R, p.d, p.a];
            for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) c.set(3 + i * 2 + (i > 2 ? 1 : 0), 3 + j * 2, cols[(j * 5 + i * 3) % cols.length]);
            c.rect(2, 10, 13, 13, p.n);
            for (let x = 3; x <= 12; x += 3) art(c, x, 11, ['S', 's'], p);
            c.set(12, 11, p.s);
            c.set(12, 12, p.S);
          },
        ],
        [
          'dials',
          'big dials gauges meters needle',
          (c) => {
            for (const x of [1, 8]) {
              c.oval(x, 2, x + 6, 8, p.k);
              c.oval(x + 1, 3, x + 5, 7, p.f);
              c.set(x + 3, 5, p.k);
            }
            c.line(4, 5, 2, 4, p.k);
            c.line(11, 5, 13, 6, p.k);
            dots(c, p.R, [[13, 4], [12, 3]]);
            dots(c, p.F, [[3, 3], [10, 3]]);
            art(c, 2, 10, ['nnnnn..nnnnn', 'nfffn..nfffn', 'nnnnn..nnnnn'], p);
            c.set(8, 11, p.a);
          },
        ],
        [
          'reels',
          'tape reels computer mainframe',
          (c) => {
            c.rect(1, 1, 14, 14, p.d);
            c.frame(1, 1, 14, 14, p.n);
            for (const x of [2, 9]) {
              art(c, x, 2, ['.SSS.', 'SsSsS', 'SSkSS', 'SsSsS', '.SSS.'], p);
            }
            c.line(2, 6, 6, 10, p.t);
            c.line(13, 6, 9, 10, p.t);
            c.rect(6, 10, 9, 11, p.s);
            c.row(10, 6, 9, p.S);
            c.rect(3, 13, 12, 13, p.n);
            dots(c, p.R, [[3, 12]]);
            dots(c, p.g, [[12, 12]]);
          },
        ],
        [
          'cables',
          'cable bundle wires hanging',
          (c) => {
            c.rect(2, 1, 13, 2, p.s);
            c.row(1, 2, 13, p.S);
            const cs = [p.k, p.c, p.o, p.k, p.b];
            for (let y = 3; y < 16; y++)
              cs.forEach((col, i) => {
                const x = 4 + i * 2 + (Math.sin(y / 2.4 + i * 0.5) > 0.3 ? 1 : 0);
                c.set(x, y, col);
              });
            c.rect(3, 9, 13, 9, p.s);
            c.set(3, 9, p.S);
          },
        ],
        [
          'fan',
          'vent fan ventilator blades',
          (c) => {
            c.rect(2, 2, 13, 13, p.n);
            c.frame(2, 2, 13, 13, p.s);
            art(c, 3, 3, [
              '..kkkkkk..',
              '.kkSSkkkk.',
              'kkkSSSkkkk',
              'kkkkSSkSSk',
              'kSSkksSSSk',
              'kSSSskkSSk',
              'kSSkSSkkkk',
              'kkkkSSSkkk',
              '.kkkkSSkk.',
              '..kkkkkk..',
            ], p);
            dots(c, p.S, [[2, 2], [13, 2], [2, 13], [13, 13]]);
          },
        ],
        [
          'monitor',
          'monitor screen green terminal',
          (c) =>
            art(c, 0, 1, [
              '................',
              '..nnnnnnnnnnnn..',
              '..nkeeeeeeeekn..',
              '..neGGGegGGeen..',
              '..neeeeeeeeeen..',
              '..negGGGGegeen..',
              '..neeeeeeeeeen..',
              '..neGGegeeeeen..',
              '..neeeeeeeeeen..',
              '..nkeGeeeeeekn..',
              '..nnnnnnnnnnnn..',
              '..sSsssssssRss..',
              '..nnnnnnnnnnnn..',
            ], p),
        ],
        [
          'arm',
          'robot arm housing machine claw',
          (c) =>
            art(c, 0, 1, [
              '.nnnnnnnnnnnnnn.',
              '.nddddddddddddn.',
              '.ndddSyyyyySddn.',
              '.nddyySyyyyyddn.',
              '.nddyydddddykdn.',
              '.nddyyddddkkkkn.',
              '.nddyydddddkdkn.',
              '.nddyyddddddddn.',
              '.nddSyddddddddn.',
              '.nddyyddddddddn.',
              '.ndssssddddddrn.',
              '.ndssssdddddddn.',
              '.nykykykykykykn.',
              '.nnnnnnnnnnnnnn.',
            ], p),
        ],
      ],
      floorWords: 'steel grating grid',
      floor,
      variants: [
        ['plate', 'solid steel plate rivets', plate, true],
        [
          'trench',
          'cable trench wires',
          (c) => {
            c.rect(0, 4, 15, 11, p.k);
            c.row(4, 0, 15, barL);
            c.row(11, 0, 15, bar);
            for (let x = 0; x < 16; x++) {
              c.set(x, 6 + (x % 8 < 4 ? 0 : 1), p.c);
              c.set(x, 8, p.o);
              c.set(x, 9 + ((x + 4) % 16 < 8 ? 0 : 1), p.b);
            }
          },
        ],
        [
          'hazard',
          'hazard stripes warning yellow black',
          (c) => {
            plate(c);
            for (let y = 4; y <= 11; y++) for (let x = 1; x <= 14; x++) c.set(x, y, (x + y) % 6 < 3 ? p.y : p.d);
          },
          true,
        ],
        [
          'light',
          'warning light lamp in floor red',
          (c) => {
            plate(c);
            c.oval(5, 5, 10, 10, p.k);
            c.oval(6, 6, 9, 9, p.r);
            c.rect(7, 7, 8, 8, hex('#a0453a'));
            c.set(7, 7, p.R);
          },
          true,
        ],
      ],
    });
  }

  /* ================= 4. toilet: a public toilet ================= */
  {
    const p = pal({
      k: '#0e0f12',
      d: '#1d2023',
      w: '#b4b3a2', // china
      W: '#cfcdbb',
      v: '#8c8b7c',
      i: '#7b808a', // chrome
      I: '#9a9fa8',
      j: '#4e525b',
      g: '#4b6470', // mirror glass
      G: '#6f8d96',
      c: '#485661', // cubicle paint
      C: '#566673',
      u: '#35414a',
      r: '#8f2d2a',
      y: '#8a7a3e', // a stain
      p: '#221c1c',
      m: '#22252b', // marker pen
    });
    const tl = hex('#7c897f'),
      tlL = hex('#8a978c'),
      grout = hex('#5c6862'),
      band = hex('#34504e'),
      bandG = hex('#263b3a'),
      ca = hex('#5b4742'),
      cb = hex('#655a4f'),
      cg = hex('#463b3a'),
      cement = hex('#3a3837');
    const wall = (c) => {
      each(c, (x, y) => {
        const b = y >= 8 && y <= 11;
        if (x % 4 === 3 || y % 4 === 3) return b ? bandG : grout;
        return b ? band : tl;
      });
      dots(c, tlL, [[0, 0], [8, 4], [12, 12], [4, 12], [5, 1], [13, 5]]);
      dots(c, grout, [[9, 1], [2, 13]]);
    };
    const floor = (c) => {
      each(c, (x, y) => (x % 4 === 3 || y % 4 === 3 ? cg : ((x >> 2) + (y >> 2)) % 2 ? ca : cb));
      dots(c, hex('#6c6155'), [[4, 0], [12, 8]]);
      dots(c, hex('#54413c'), [[1, 1], [9, 9]]);
    };
    set('toilet', 'public toilet lavatory', {
      top: (c) => {
        fill(c, hex('#15171a'));
        speck(c, hex('#1b1e21'), 7, 4);
        dots(c, hex('#101114'), [[5, 5], [12, 12]]);
      },
      wallWords: 'glazed tiles dark band',
      wall,
      details: [
        [
          'cubicle',
          'cubicle door stall shoes feet',
          (c) => {
            art(c, 0, 0, [
              '.jjjjjjjjjjjjjj.',
              '.jCCCCCCCCCCCCj.',
              '.jCccccccccccuj.',
              '.jCccccccccccuj.',
              '.jCccccccccccuj.',
              '.jCccccccccccuj.',
              '.jCccccccccccuj.',
              '.jCcccccccwrcuj.',
              '.jCcccccccwwcuj.',
              '.jCccccccccccuj.',
              '.jCccccccccccuj.',
              '.jCccccccccccuj.',
              '.jCuuuuuuuuuuuj.',
              '.jkkkkkkkkkkkkj.',
              '.jkkkppkkppkkkj.',
              '.jkkpppkkpppkkj.',
            ], p);
            dots(c, p.m, [[5, 5], [6, 4], [7, 5]]);
          },
        ],
        [
          'urinal',
          'urinal china stain',
          (c) => {
            art(c, 4, 0, [
              '...ii...',
              '...ii...',
              '..iIIi..',
              '.wwWWww.',
              'wWvvvvWw',
              'wWvkkvWv',
              'wWvkkvWv',
              'wWvkkvWv',
              'wWvkkvWv',
              'wWvvvvWv',
              '.wWWWWv.',
              '..wwvv..',
              '...ii...',
              '...ii...',
            ], p);
            dots(c, p.y, [[7, 9], [8, 10], [7, 14], [6, 15], [7, 15]]);
          },
        ],
        [
          'basin',
          'basin sink mirror tap',
          (c) => {
            art(c, 3, 0, [
              'jjjjjjjjjj',
              'jgggggGggj',
              'jggggGgggj',
              'jgggGggggj',
              'jgggggkggj',
              'jggggkgggj',
              'jgggkggggj',
              'jjjjjjjjjj',
              '....Ii....',
              '...iIi....',
              'wWWWWWWWWw',
              'wvkkkkkkvw',
              '.wvvvvvvw.',
              '..wwwwww..',
              '....ij....',
              '....ij....',
            ], p);
          },
        ],
        [
          'dryer',
          'hand dryer machine sign',
          (c) => {
            art(c, 4, 3, ['.wwwwww.', 'wWWWWWWv', 'wWWWWWWv', 'wWWiIWWv', 'wWWWWWWv', 'wvvvvvvv', '..jkkj..', '..jjjj..'], p);
            art(c, 5, 12, ['wwwwww', 'wmmrmw', 'wwwwww'], p);
          },
        ],
        [
          'graffiti',
          'graffiti scrawl tally marks marker',
          (c) => {
            art(c, 1, 1, ['m.m.m.m..m', 'm.m.m.mmm.', 'm.m.mmm.m.', 'mmm.m.m.m.', 'm.m.m.m.m.'], p);
            art(c, 9, 4, ['...r.r', '..rrrrr', '...rrr', '....r'], p);
            art(c, 2, 12, ['mm..m.mm', 'm.m.m.m.', 'mm..m.mm'], p);
          },
        ],
        [
          'cistern',
          'pipe cistern chain flush',
          (c) => {
            art(c, 3, 1, [
              'wwwwwwwwww.',
              'wWWWWWWWWv.',
              'wWWWWWWWWvj',
              'wWWWWWWWWv.j',
              'wvvvvvvvvv.j',
              '....Ii.....j',
              '....Ii.....j',
              '....Ii.....j',
              '....Ii....jjj',
              '....Ii.....j',
              '....Ii.',
              '...jIij',
              '....Ii.',
              '....Ii.',
              '....Ii.',
            ], p);
            dots(c, p.y, [[5, 5], [4, 4]]);
            dots(c, hex('#6a5a3a'), [[9, 7], [9, 8], [9, 10]]);
          },
        ],
      ],
      floorWords: 'small square clinker tiles two tone',
      floor,
      variants: [
        [
          'cracked',
          'cracked tiles broken',
          (c) => {
            dots(c, hex('#2e2625'), [[2, 1], [2, 2], [4, 4], [5, 5], [6, 6], [8, 8], [9, 9], [10, 10], [12, 12], [13, 13], [13, 14]]);
            c.rect(8, 4, 10, 6, cement);
            c.set(8, 4, cb);
          },
        ],
        [
          'wet',
          'wet floor water sheen',
          (c) => {
            const wet = (x0, y0, x1, y1) => {
              for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, blend(c.get(x, y), hex('#2a3a48'), 0.45));
            };
            wet(3, 4, 12, 11);
            wet(1, 6, 14, 9);
            wet(5, 3, 9, 12);
            dots(c, hex('#7f909c'), [[5, 6], [6, 6], [10, 9]]);
          },
        ],
        [
          'drain',
          'drain floor gully',
          (c) => {
            c.rect(4, 4, 10, 10, p.j);
            c.frame(4, 4, 10, 10, cg);
            for (let y = 5; y <= 9; y += 2) c.row(y, 5, 9, p.k);
            c.set(7, 7, p.j);
            dots(c, p.y, [[11, 9], [11, 10], [9, 11]]);
          },
        ],
        [
          'missing',
          'missing tiles cement bare',
          (c) => {
            c.rect(4, 4, 10, 6, cement);
            c.rect(0, 8, 6, 10, cement);
            c.rect(12, 12, 14, 14, cement);
            dots(c, hex('#454241'), [[5, 5], [9, 4], [2, 9], [5, 10], [13, 13]]);
            dots(c, cb, [[10, 6], [0, 8]]);
          },
        ],
      ],
    });
  }

  /* ================= 5. cottage ================= */
  {
    const p = pal({
      k: '#0f0c0b',
      d: '#241a16',
      w: '#5b4230', // wall wood
      W: '#6b503a',
      v: '#49352a',
      u: '#30221d',
      L: '#8a6a48', // pale new wood
      l: '#74583c',
      s: '#565455', // stone
      S: '#6b6869',
      t: '#454347',
      g: '#34455a', // dusk in a window
      G: '#4d6076',
      r: '#6e3030', // curtain
      R: '#8a4a3e',
      c: '#a69c80',
      h: '#4b5a3a', // herbs
      H: '#64744a',
      q: '#5a4560',
      j: '#7a5236', // clay
      J: '#6b8478', // glass jar
      i: '#2a2a32', // iron
      e: '#b8642a', // embers
      E: '#d9a04a',
      b: '#353944', // a coat
      B: '#454a57',
      y: '#9c8648', // straw, twine
    });
    const board = hex('#6a4c36'),
      boardL = hex('#765740'),
      boardD = hex('#5c412f'),
      gap = hex('#3f2c22');
    const wall = (c) => {
      each(c, (x) => (x === 4 || x === 10 || x === 15 ? p.u : x < 4 ? p.w : x < 10 ? p.v : p.w));
      c.col(0, 0, 15, p.W);
      c.col(11, 0, 15, p.W);
      dots(c, p.u, [[2, 3], [7, 11], [13, 7]]);
      dots(c, p.W, [[6, 2], [6, 3], [8, 8], [13, 12], [2, 10]]);
      dots(c, p.v, [[2, 6], [12, 2], [13, 3]]);
    };
    const floor = (c) => {
      fill(c, board);
      c.row(7, 0, 15, gap);
      c.row(15, 0, 15, gap);
      c.col(11, 0, 6, gap);
      c.row(0, 0, 10, boardL);
      c.row(8, 0, 15, boardL);
      dots(c, boardD, [[2, 3], [3, 3], [4, 3], [7, 5], [8, 5], [13, 2], [14, 2], [7, 11], [8, 11], [9, 11], [12, 13], [13, 13], [1, 12], [2, 12]]);
      dots(c, boardL, [[5, 2], [6, 2], [10, 12], [1, 10]]);
    };
    set('cottage', 'cottage cabin country', {
      top: (c) => {
        fill(c, hex('#17120f'));
        dots(c, hex('#1f1814'), [[2, 3], [3, 3], [4, 3], [10, 8], [11, 8], [12, 8], [6, 13], [7, 13]]);
        dots(c, hex('#120e0c'), [[8, 2], [3, 10], [13, 13]]);
      },
      wallWords: 'wooden planks boards',
      wall,
      details: [
        [
          'window',
          'small window curtain dusk',
          (c) =>
            art(c, 0, 2, [
              '..LLLLLLLLLLLL..',
              '..LrRrggggrRrL..',
              '..LrRrggGgrRrL..',
              '..LrRgggLgGrRL..',
              '..LrrgggLggrrL..',
              '..LRrLLLLLLrRL..',
              '..LrrgggLggrrL..',
              '..LrRgGgLggRrL..',
              '..LrRrggLgrRrL..',
              '..LLLLLLLLLLLL..',
              '.llllllllllllll.',
            ], p),
        ],
        [
          'shelf',
          'shelf jars pots preserves',
          (c) =>
            art(c, 0, 2, [
              '................',
              '......ii........',
              '..jj..JJ...cc...',
              '.jjjj.JJ..JJJJ..',
              '.jjjj.Jq..JhhJ..',
              '.jjjj.Jq..JhhJ..',
              '.jjjj.JJ..JJJJ..',
              'LLLLLLLLLLLLLLLL',
              'llllllllllllllll',
              '.ul..........ul.',
              '.u............u.',
            ], p),
        ],
        [
          'herbs',
          'hanging herbs dried bunches garlic',
          (c) =>
            art(c, 0, 1, [
              'yyyyyyyyyyyyyyyy',
              '..y....y...y....',
              '..y....y...y....',
              '.hHh..qhq..c....',
              '.hHh..hqh.ccc...',
              'hHhHh.qhq..c....',
              'hHhHh.hqh.ccc...',
              '.hHh..qhq.ccc...',
              '.hhh...h...c....',
              '..h....h..ccc...',
              '..........ccc...',
            ], p),
        ],
        [
          'hooks',
          'hooks pegs coat hat hanging',
          (c) =>
            art(c, 0, 2, [
              '.llllllllllllll.',
              '.LiLLLLiLLLLiLL.',
              '..i....i....i...',
              '......bbb..yyy..',
              '.....bbBbb.yyyy.',
              '....bbBBBbbyyyyy',
              '....bbBBBbb.....',
              '....bbBBBbb.....',
              '....bbBBBbb.....',
              '....bbBBBbb.....',
              '.....bBBBb......',
              '.....bBBBb......',
              '.....bbbbb......',
            ], p),
        ],
        [
          'door',
          'plank door latch hinges',
          (c) =>
            art(c, 0, 0, [
              '................',
              '..uuuuuuuuuuuu..',
              '..uLlLlLlLlLlu..',
              '..iiiLlLlLlLlu..',
              '..uLlLlLlLlLlu..',
              '..uLLLLLLLLLlu..',
              '..uLlLLlLlLlLu..',
              '..uLlLlLLlLlLu..',
              '..uLlLlLlLLiiu..',
              '..uLlLlLlLlLiu..',
              '..uLlLlLlLlLLu..',
              '..uLLLLLLLLLlu..',
              '..iiiLlLlLlLlu..',
              '..uLlLlLlLlLlu..',
              '..uLlLlLlLlLlu..',
              '..uvvvvvvvvvvu..',
            ], p),
        ],
        [
          'hearth',
          'stone hearth fireplace embers',
          (c) =>
            art(c, 0, 1, [
              '.tttttttttttttt.',
              'LLLLLLLLLLLLLLLL',
              'llllllllllllllll',
              '.sSstsSSstsSsSt.',
              '.SsttttttttttSs.',
              '.sStkkkkkkkktst.',
              '.tsSkkkkkkkktSs.',
              '.sSskkkkkkkksSt.',
              '.SstkkkkkkkktsS.',
              '.tsSkkkkkkkkSst.',
              '.sSskkkiikkktSs.',
              '.SstkiikeikktsS.',
              '.tsSkeEeEeikSst.',
              '.sSsiiiiiiiisSt.',
              '.tttttttttttttt.',
            ], p),
        ],
      ],
      floorWords: 'wide wooden boards',
      floor,
      variants: [
        [
          'knot',
          'knot in the wood',
          (c) => {
            art(c, 5, 2, ['.dd.', 'duud', '.dd.'], { d: boardD, u: gap });
            dots(c, boardD, [[3, 3], [4, 3], [9, 3], [10, 3], [6, 1], [7, 5]]);
            art(c, 10, 11, ['dd', 'ud'], { d: boardD, u: gap });
          },
        ],
        [
          'gap',
          'gap between boards dark hole',
          (c) => {
            c.rect(2, 6, 12, 8, p.k);
            c.row(6, 2, 4, gap);
            c.row(8, 9, 12, gap);
            c.row(8, 2, 3, gap);
            dots(c, hex('#6f6a50'), [[7, 7]]);
            dots(c, boardL, [[5, 5], [6, 5], [10, 9]]);
          },
        ],
        [
          'rug',
          'rag rug piece striped',
          (c) => {
            const st = [p.r, hex('#6f6648'), hex('#3d4a55'), p.R, hex('#4b5a3a'), hex('#6f6648')];
            for (let y = 1; y <= 14; y++) for (let x = 2; x <= 13; x++) c.set(x, y, st[((y - 1) >> 1) % st.length]);
            for (let y = 1; y <= 14; y += 2) {
              c.set(1, y, p.c);
              c.set(14, y + 1, p.c);
            }
            speck(c, hex('#2c2420'), 8, 6, 2, 1, 13, 14);
          },
        ],
        [
          'hearthstone',
          'hearth stone flagstone slab',
          (c) => {
            fill(c, p.s);
            c.frame(0, 0, 15, 15, p.t);
            c.row(1, 1, 14, p.S);
            c.col(1, 1, 14, p.S);
            speck(c, p.t, 7, 8, 2, 2, 13, 13);
            speck(c, p.S, 5, 12, 2, 2, 13, 13);
            dots(c, p.d, [[10, 12], [11, 12], [11, 13]]);
          },
          true,
        ],
      ],
    });
  }

  /* ================= 6. horror: rust and old cement ================= */
  {
    const p = pal({
      k: '#0b090b',
      d: '#1a1416',
      c: '#4b4845', // cement
      C: '#56524e',
      e: '#3c3938',
      r: '#6a3d28', // rust
      R: '#84502e',
      u: '#4a2c22',
      i: '#3e3d42', // iron
      I: '#5c5b60',
      j: '#28272c',
      b: '#5e1516', // blood
      B: '#7d1c1c',
      x: '#3f1114',
      f: '#8c6a5c', // something alive
      F: '#a58372',
      s: '#5c6066', // steel
      S: '#74787e',
      w: '#b8b29a',
      g: '#4f6068', // frosted glass
    });
    const wall = (c) => {
      fill(c, p.c);
      speck(c, p.C, 9, 2);
      speck(c, p.e, 9, 6);
      for (let y = 0; y < 16; y++) {
        if (y % 5 !== 2) c.set(5, y, p.e);
        if (y % 2) c.set(11, y, hex('#5a4132'));
        if (y % 4 === 1) c.set(12, y, hex('#5a4132'));
      }
      dots(c, p.e, [[4, 9], [6, 3], [5, 2]]);
      dots(c, p.j, [[2, 12], [14, 4]]);
    };
    const floor = (c) =>
      each(c, (x, y) => {
        if (x % 4 >= 2 && y % 4 >= 2) return p.k;
        const h = (x >> 2) * 3 + (y >> 2) * 5;
        return y % 4 === 0 ? (h % 4 === 0 ? p.R : p.r) : x % 4 === 0 && y % 4 < 2 ? p.r : h % 3 === 0 ? hex('#3f2a24') : p.u;
      });
    const plate = (c) => {
      fill(c, p.u);
      speck(c, p.r, 22, 3);
      speck(c, hex('#3a2520'), 12, 8);
      c.row(0, 0, 15, p.r);
      c.col(0, 0, 15, p.r);
      c.row(15, 0, 15, hex('#2e1e1b'));
      c.col(15, 0, 15, hex('#2e1e1b'));
      for (const [x, y] of [[2, 2], [12, 2], [2, 12], [12, 12]]) art(c, x, y, ['Ri', 'ij'], p);
    };
    set('horror', 'horror rust cement industrial otherworld', {
      top: (c) => {
        fill(c, hex('#131012'));
        speck(c, hex('#1b1517'), 8, 5);
        dots(c, hex('#24171a'), [[3, 6], [12, 13]]);
      },
      wallWords: 'stained concrete',
      wall,
      details: [
        [
          'chains',
          'hanging chains shackle',
          (c) => {
            const chain = (x, y1) => {
              for (let y = 0; y <= y1; y++) c.set(x + (y % 4 === 3 ? 0 : y % 2), y, y % 2 ? p.I : p.i);
              for (let y = 0; y <= y1; y += 2) c.set(x + 1 - (y % 4 === 2 ? 0 : 1) + 0, y, p.j);
            };
            chain(3, 10);
            chain(8, 13);
            chain(12, 6);
            art(c, 2, 11, ['iIi', 'i.i', 'iii'], p);
            art(c, 7, 13, ['.I.', 'i.i', '.ii'], p);
            dots(c, p.r, [[3, 4], [9, 7], [12, 3]]);
          },
        ],
        [
          'hooks',
          'rusty meat hooks rail',
          (c) => {
            c.row(1, 0, 15, p.i);
            c.row(2, 0, 15, p.j);
            for (const x of [2, 7, 12]) art(c, x, 3, ['.R.', '.r.', '.r.', '.r.', '.R.', 'r.r', 'r..', '.r.'], p);
            art(c, 6, 9, ['bBb', 'bBb', 'xbx', '.b.', '.b.', '...', '.b.'], p);
            dots(c, p.b, [[7, 15]]);
          },
        ],
        [
          'cage',
          'cage bars something behind eye',
          (c) => {
            c.rect(1, 1, 14, 14, p.k);
            c.frame(1, 1, 14, 14, p.j);
            c.oval(4, 5, 12, 14, hex('#5f463e'));
            c.oval(5, 6, 10, 12, p.f);
            art(c, 7, 8, ['wk'], p);
            for (const x of [3, 6, 9, 12]) {
              c.col(x, 2, 13, p.r);
              c.set(x, 4, p.R);
              c.set(x, 9, p.u);
            }
            art(c, 8, 11, ['FrF'], p);
            c.row(1, 1, 14, p.i);
            c.row(14, 1, 14, p.i);
          },
        ],
        [
          'valve',
          'valve wheel pipes rust',
          (c) => {
            for (let x = 0; x < 16; x++) art(c, x, 3, ['I', 'i', 'j'], p);
            for (let y = 6; y < 16; y++) art(c, 10, y, ['Iij'], p);
            art(c, 9, 2, ['jIiij', 'jIiij', 'jiiij', 'jjjjj'], p);
            art(c, 2, 6, ['.BBBB.', 'B.bb.B', 'BbkkbB', 'BbkkbB', 'B.bb.B', '.BBBB.'], p);
            c.col(4, 5, 5, p.i);
            dots(c, p.r, [[11, 9], [11, 10], [6, 4], [13, 3], [10, 13]]);
            dots(c, hex('#5a4132'), [[10, 15], [3, 13], [3, 14]]);
          },
        ],
        [
          'handprints',
          'bloody handprints smear',
          (c) => {
            art(c, 2, 2, ['.b.b.b.', '.b.b.b.b', '.b.b.b.b', 'bbbbbbbb', 'b.bbbbb.', '..bbbbb.', '...xbx..', '...x.x..', '...x....', '...x....'], p);
            art(c, 9, 7, ['.b.b.b', 'bb.b.b', 'bbbbbb', '.bbbb.', '.bbbb.', '..xb..', '..x...', '..x...', '..x...'], p);
          },
        ],
        [
          'locker',
          'meat locker door cold store lever',
          (c) =>
            art(c, 0, 0, [
              '.jjjjjjjjjjjjjj.',
              '.jSSSSSSSSSSSsj.',
              '.jSssssssssssij.',
              '.jSsjjjjjssssij.',
              '.jSsjgggjssssij.',
              '.jSsjgggjssssij.',
              '.jSsjjjjjssssij.',
              '.jSssssssssIIij.',
              '.jSsssssssIjjij.',
              '.jSsssssssIjsij.',
              '.jSsssrsssssssj.',
              '.jSssrrsssssrij.',
              '.jSsrrrssssrrij.',
              '.jSsxbbsssrrbij.',
              '.jiixbbiiiibbij.',
              '.jjjxbbjjjjbbjj.',
            ], p),
        ],
        [
          'wire',
          'barbed wire coils',
          (c) => {
            for (let x = 0; x < 16; x++) {
              c.set(x, 4 + Math.round(Math.sin((x / 16) * Math.PI * 2) * 2), p.S);
              c.set(x, 6 - Math.round(Math.sin((x / 16) * Math.PI * 2) * 2), p.s);
              c.set(x, 11 + Math.round(Math.sin((x / 16) * Math.PI * 2 + 1.6) * 2), p.s);
            }
            for (const [x, y] of [[2, 6], [6, 5], [10, 2], [13, 3], [3, 12], [8, 9], [12, 10]]) art(c, x - 1, y - 1, ['S.S', '.S.', 'S.S'], p);
            dots(c, p.b, [[6, 7], [6, 8], [8, 11]]);
          },
        ],
      ],
      floorWords: 'rusty steel grating void',
      floor,
      variants: [
        [
          'bloody',
          'bloody grate blood',
          (c) => {
            each(c, (x, y) => {
              const q = c.get(x, y);
              const d = ((x - 7.5) / 6.5) ** 2 + ((y - 8) / 5) ** 2 + ((x * 7 + y * 3) % 5) * 0.06;
              return q !== p.k && d < 1 ? (d < 0.4 ? p.B : p.b) : null;
            });
            dots(c, p.x, [[2, 6], [3, 10], [12, 5], [13, 11], [7, 7], [10, 9]]);
          },
        ],
        ['plate', 'rusty plate bolts', plate, true],
        [
          'fan',
          'fan below the grate turning',
          (c) =>
            each(c, (x, y) => {
              if (c.get(x, y) !== p.k) return null;
              const dx = x - 7.5,
                dy = y - 7.5,
                r = Math.hypot(dx, dy),
                a = (Math.atan2(dy, dx) + Math.PI * 2 + r * 0.12) % (Math.PI / 2);
              if (r < 1.6) return p.I;
              return r < 8 && a < 0.62 ? hex('#34363b') : r < 8.6 ? hex('#141215') : null;
            }),
        ],
        [
          'hole',
          'hole broken grate void',
          (c) => {
            c.oval(3, 3, 12, 12, p.k);
            c.rect(5, 2, 9, 13, p.k);
            c.rect(2, 6, 13, 9, p.k);
            dots(c, p.R, [[4, 3], [12, 4], [3, 12], [11, 12]]);
            dots(c, p.r, [[5, 4], [6, 5], [11, 5], [4, 11], [10, 11], [10, 10]]);
          },
        ],
      ],
    });
  }

  /* ================= 7. dream ================= */
  {
    const p = pal({
      n: '#22244a', // the night sky
      N: '#2c2f5c',
      k: '#0e0e1c',
      s: '#c9c8b0', // stars
      S: '#7c7ea6',
      m: '#c8c6b0', // the moon
      M: '#dcdac4',
      o: '#9d9c98',
      c: '#4b4e7e', // clouds
      C: '#6a6d9c',
      D: '#8a8cb6',
      f: '#5a4a44', // a wooden frame
      F: '#7c6a5a',
      y: '#b89e62', // light from somewhere else
      Y: '#d6c286',
      d: '#4c3f52', // a door
      e: '#3a3040',
      w: '#7f81a6', // pale stone
      W: '#9d9fc0',
      v: '#5b5d86',
      b: '#8a6c2e',
    });
    const fa = hex('#62648c'),
      fb = hex('#6e7099');
    const wall = (c) => {
      fill(c, p.n);
      dots(c, p.N, [[2, 3], [3, 3], [9, 12], [10, 12], [13, 6]]);
      dots(c, p.S, [[4, 10], [12, 2], [7, 6]]);
      dots(c, p.s, [[10, 4], [1, 14]]);
    };
    const floor = (c) => {
      each(c, (x, y) => (((x >> 3) + (y >> 3)) % 2 ? fa : fb));
      dots(c, fb, [[8, 3], [7, 12], [3, 8], [12, 7]]);
      dots(c, fa, [[7, 4], [8, 11], [4, 7], [11, 8]]);
    };
    set('dream', 'dream dreamland sleep surreal', {
      topWords: 'dark void surround edge of the dream',
      top: (c) => {
        fill(c, hex('#10101f'));
        dots(c, hex('#171730'), [[3, 4], [4, 4], [11, 11], [12, 11], [8, 14]]);
        dots(c, hex('#34365a'), [[13, 3]]);
      },
      wallWords: 'night sky stars',
      wall,
      details: [
        [
          'moon',
          'big moon full craters',
          (c) => {
            c.oval(1, 1, 14, 14, p.N);
            c.oval(3, 3, 12, 12, p.m);
            art(c, 3, 3, ['....MMM...', '..MMMMMm..', '.MMoMMmmm.', '.MMMMmmom.', 'MMMMmmmmmm', 'MMmmmoommm', 'MmmmmoOmmm', '.mommmmmo.', '.mmmmmmoo.', '..mmmooo..'], { ...p, O: p.o });
            c.oval(3, 3, 12, 12, null);
            dots(c, p.o, [[11, 9], [11, 10], [10, 11], [9, 12], [8, 12]]);
          },
        ],
        [
          'clouds',
          'clouds drifting',
          (c) => {
            art(c, 0, 2, [
              '......CCC.......',
              '....CCDDDCC.....',
              '..CCDDDDDDCCC...',
              '.cCCCCCCCCCCCc..',
              '..cccccccccc....',
              '................',
              '..........CC....',
              '........CCDDCC..',
              '.CC...CCDDDDDDC.',
              'CDDC.cCCCCCCCCCc',
              'cccc..ccccccccc.',
            ], p);
          },
        ],
        [
          'window',
          'floating window lit curtain',
          (c) =>
            art(c, 0, 2, [
              '...FFFFFFFFFF...',
              '...FyyyyFyyyF...',
              '...FyYyyFyyyF...',
              '...FyyyyFyyyF...',
              '...FFFFFFFFFF...',
              '...FyyyyFyyyF...',
              '...FyyyyFykyF...',
              '...FyyyyFkkkF...',
              '...FFFFFFFFFF...',
              '..ffffffffffff..',
              '................',
              '.....S....S.....',
              '.......S........',
            ], p),
        ],
        [
          'door',
          'door in the sky ajar light',
          (c) =>
            art(c, 0, 1, [
              '....ffffffff....',
              '....fddddyYf....',
              '....fdeedyYf....',
              '....fdeedyYf....',
              '....fddddyYf....',
              '....fdddbyYf....',
              '....fddddyYf....',
              '....fdeedyYf....',
              '....fdeedyYf....',
              '....fddddyYf....',
              '....fddddyYf....',
              '...vwwwwwwwwv...',
              '....vvvyyvvv....',
              '.........y......',
              '..........y.....',
            ], p),
        ],
        [
          'stairs',
          'staircase fragment floating steps',
          (c) =>
            art(c, 0, 2, [
              '............WWW.',
              '............wwv.',
              '.........WWWwv..',
              '.........wwwv...',
              '......WWWwwv....',
              '......wwwwv.....',
              '...WWWwwwv......',
              '...wwwwwv.......',
              '.WWwwwwv........',
              '.wwwwvv.........',
              '..vvv...........',
              '...v...v........',
              '........v.......',
            ], p),
        ],
      ],
      floorWords: 'soft checkerboard pale blue violet',
      floor,
      variants: [
        [
          'cloud',
          'cloud patch mist',
          (c) => {
            art(c, 1, 4, ['....DDDD......', '..DDWWWWDD....', '.DWWWWWWWWDDD.', 'DDDDDDDDDDDDDD', '.CCCCCCCCCCCC.'], { D: hex('#8587b0'), W: hex('#9a9cc0'), C: hex('#787aa4') });
          },
        ],
        [
          'stars',
          'stars showing through hole sky',
          (c) => {
            c.oval(2, 3, 13, 12, hex('#565880'));
            c.oval(3, 4, 12, 11, p.n);
            c.rect(5, 3, 9, 12, p.n);
            dots(c, p.s, [[6, 6], [10, 9]]);
            dots(c, p.S, [[8, 4], [4, 8], [9, 6], [7, 10], [11, 7]]);
          },
        ],
        [
          'ripple',
          'ripple rings water',
          (c) =>
            each(c, (x, y) => {
              const r = Math.hypot((x - 7.5) * 1, (y - 7.5) * 1.5);
              return (r > 2.2 && r < 3.2) || (r > 6 && r < 7) ? hex('#8284ac') : r < 1 ? hex('#565880') : null;
            }),
        ],
      ],
    });
  }

  return out;
};
