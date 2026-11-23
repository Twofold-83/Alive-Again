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
      c: '#42403e', // cement
      C: '#4b4845',
      e: '#353332',
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
        if (y % 2) c.set(11, y, hex('#513b30'));
        if (y % 4 === 1) c.set(12, y, hex('#513b30'));
      }
      dots(c, p.e, [[4, 9], [6, 3], [5, 2]]);
      dots(c, p.j, [[2, 12], [14, 4]]);
    };
    const floor = (c) =>
      each(c, (x, y) => {
        if (x % 4 >= 2 && y % 4 >= 2) return p.k;
        const h = (x >> 2) * 3 + (y >> 2) * 5;
        return y % 4 === 0 ? (h % 4 === 0 ? hex('#5e3828') : hex('#54342a')) : h % 3 === 0 ? hex('#3f2a24') : p.u;
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
              for (let y = 0; y <= y1; y++) {
                if (y % 3 === 2) c.set(x, y, p.j);
                else {
                  c.set(x, y, p.S);
                  c.set(x + 1, y, p.j);
                  c.set(x - 1, y, p.i);
                }
              }
            };
            chain(3, 10);
            chain(8, 13);
            chain(12, 6);
            art(c, 1, 11, ['jSSSj', 'S.e.S', 'S.e.S', 'jSSSj'], p);
            art(c, 7, 13, ['jSj', 'S.j', '.Sj'], p);
            dots(c, p.r, [[3, 4], [8, 7], [12, 3]]);
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
              '.jSsssssssssssj.',
              '.jSssussssssuij.',
              '.jSsuussssuuuij.',
              '.jSsxbbsssuubij.',
              '.jiixbbiiiibbij.',
              '.jjjxbbjjjjbbjj.',
            ], p),
        ],
        [
          'wire',
          'barbed wire coils',
          (c) => {
            for (let x = 0; x < 16; x++) {
              const a = Math.round(Math.sin((x / 16) * Math.PI * 2) * 1.5);
              c.set(x, 4 + a, p.S);
              c.set(x, 5 + a, p.j);
              c.set(x, 11 - a, p.S);
              c.set(x, 12 - a, p.j);
            }
            for (const [x, y] of [[1, 4], [5, 5], [9, 3], [13, 3], [3, 10], [7, 11], [11, 12], [15, 11]]) {
              c.set(x, y - 1, p.S);
              c.set(x + 1, y + 1, p.S);
            }
            dots(c, p.b, [[5, 7], [5, 8], [7, 13], [7, 14]]);
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
              return r < 8 && a < 0.7 ? hex('#4a4d54') : r < 8.6 ? hex('#1a181c') : null;
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

  /* ================= 8. weird ================= */
  {
    const p = pal({
      a: '#5a5739', // the wallpaper
      A: '#737048',
      z: '#434129',
      L: '#817e58', // where it bulges
      D: '#39372a',
      w: '#aaa48a', // the white of an eye
      k: '#0f0d0c',
      i: '#6b3a2c',
      d: '#4c2b27', // a door
      E: '#5e3a32',
      b: '#8f7636',
      y: '#b8a468',
      r: '#2a281c', // roots
      R: '#403d28',
      g: '#4a5234',
      q: '#8c6a6a',
      f: '#3a2a22',
      F: '#5a4234',
      t: '#b5ae96', // teeth
      T: '#8f886f',
      v: '#4a4468', // a vein
      m: '#7a3c40', // lips
      M: '#8f4c4c',
    });
    const fl = hex('#73504d'),
      fL = hex('#86635d'),
      fD = hex('#5b3e40'),
      fK = hex('#402a2e');
    const lid = (c, x, y) => {
      art(c, x, y, ['A.....A', '.AAAAA.', '..z.z..'], p);
    };
    const eye = (c, x, y, look = 0) => {
      art(c, x, y - 1, ['.zzzzz.', 'zwwwwwz', '.zzzzz.'], p);
      c.set(x + 3 + look, y, p.k);
      c.set(x + 2 + look, y, p.i);
    };
    const wall = (c) => {
      fill(c, p.a);
      lid(c, 0, 2);
      lid(c, 8, 10);
      dots(c, p.z, [[11, 3], [3, 11]]);
      dots(c, p.A, [[11, 2], [11, 4], [10, 3], [12, 3], [3, 10], [3, 12], [2, 11], [4, 11]]);
    };
    const floor = (c) =>
      each(c, (x, y) => {
        const v = (y + Math.round(Math.sin((x / 16) * Math.PI * 2) * 1.5) + 16) % 4;
        return v === 0 ? fL : v === 3 ? fD : fl;
      });
    set('weird', 'weird strange wrong uncanny', {
      top: (c) => {
        fill(c, hex('#141210'));
        speck(c, hex('#1b1814'), 7, 9);
        dots(c, hex('#221d16'), [[5, 12], [13, 5]]);
      },
      wallWords: 'wallpaper that watches closed eyes pattern',
      wall,
      details: [
        [
          'eyes',
          'eyes open watching wallpaper',
          (c) => {
            eye(c, 0, 3, 1);
            c.rect(8, 10, 14, 12, p.a);
            c.rect(10, 2, 12, 4, p.a);
            art(c, 4, 6, ['..zzzzzz..', '.zwwiiwwz.', 'zwwwikkiwwz', '.zwwiiwwz.', '..zzzzzz..'], p);
            eye(c, 1, 13, 1);
          },
        ],
        [
          'small-door',
          'door too small tiny light under',
          (c) =>
            art(c, 0, 6, [
              '......ffff......',
              '.....fdEEdf.....',
              '....fdEddEdf....',
              '....fdEddEdf....',
              '....fddddddf....',
              '....fdEddbdf....',
              '....fdEddEdf....',
              '....fdEEEEdf....',
              '....fddddddf....',
              '....fyyyyyyf....',
            ], p),
        ],
        [
          'hands',
          'hands pressing through wall bulge',
          (c) => {
            c.rect(0, 1, 15, 14, p.a);
            art(c, 1, 2, ['.L.L.L..', '.L.L.L.L', '.L.L.L.L', '.LLLLLLL', 'LLLLLLLD', 'L.LLLLLD', '..LLLLD.', '..LDDD..'], p);
            art(c, 8, 6, ['..L.L.L.', 'L.L.L.L.', 'L.L.L.L.', 'LLLLLLL.', 'LLLLLLLL', 'DLLLLL.D', '.DLLLL..', '..DDDL..'], p);
            dots(c, p.D, [[3, 3], [5, 3], [3, 4], [5, 4], [7, 4], [11, 7], [13, 7], [11, 8], [13, 8], [9, 8]]);
          },
        ],
        [
          'clock',
          'clock without hands face',
          (c) => {
            c.rect(2, 2, 13, 13, p.a);
            c.oval(2, 1, 13, 12, p.f);
            c.oval(3, 2, 12, 11, p.w);
            dots(c, p.f, [[7, 3], [8, 3], [11, 6], [11, 7], [7, 10], [8, 10], [4, 6], [4, 7]]);
            dots(c, p.T, [[10, 4], [5, 4], [10, 9], [5, 9]]);
            art(c, 7, 6, ['Tk', 'kT'], p);
            art(c, 6, 13, ['fFFf', '.bb.', '.bb.'], p);
          },
        ],
        [
          'roots',
          'growth roots tendrils',
          (c) => {
            art(c, 0, 0, [
              'rRr..r......rR..',
              '.rRr.r.....rR...',
              '..rRrr.....r....',
              '...rRr....rr....',
              '...rRrr...r.....',
              '..rr.rRr..r.....',
              '..r...rRrrr.....',
              '.rr....rR.......',
              '.r.....rRr......',
              'qr......rRr.....',
              '........r.rr....',
              '.......rr..r....',
              '.......r...rq...',
              '......rr........',
              '......r.........',
              '.....gr.........',
            ], p);
            dots(c, p.g, [[4, 5], [9, 5], [12, 11], [0, 8]]);
          },
        ],
      ],
      floorWords: 'flesh ridges organic',
      floor,
      variants: [
        [
          'eye',
          'eye open in the floor',
          (c) => {
            art(c, 2, 5, ['...KKKKKK...', '.KKwwiiwwKK.', 'KwwwikkiwwwK', '.KKwwiiwwKK.', '...KKKKKK...'], { ...p, K: fK });
            art(c, 4, 4, ['LLLLLLLL'], { L: fL });
          },
        ],
        [
          'teeth',
          'teeth ring maw',
          (c) => {
            c.oval(3, 3, 12, 12, fK);
            c.oval(5, 5, 10, 10, p.k);
            dots(c, p.t, [[7, 4], [8, 4], [5, 5], [10, 5], [4, 7], [4, 8], [11, 7], [11, 8], [5, 10], [10, 10], [7, 11], [8, 11]]);
            dots(c, p.T, [[6, 4], [9, 4], [4, 6], [11, 6], [4, 9], [11, 9], [6, 11], [9, 11]]);
          },
        ],
        [
          'vein',
          'vein blue branching',
          (c) => {
            art(c, 1, 2, [
              '..vv..........',
              '....vv........',
              '......v.......',
              '......vv......',
              '.......v...vv.',
              '.......vv.v...',
              '........vv....',
              '.......v......',
              '......vv......',
              '....vv........',
              '...v..........',
              '..v...........',
            ], p);
            dots(c, hex('#5c5478'), [[7, 5], [9, 8], [6, 11]]);
          },
        ],
        [
          'mouth',
          'mouth lips',
          (c) =>
            art(c, 2, 5, [
              '..mMMm..mMMm',
              '.mMMMMmmMMMMm',
              'mmkkkkkkkkkkm',
              '.mMMMMMMMMMMm',
              '..mmMMMMMMmm',
              '....mmmmmm',
            ], p),
        ],
      ],
    });
  }

  /* ================= 9. apartment: the stairwell and corridor of a block of flats ================= */
  {
    const p = pal({
      k: '#0e0e11',
      u: '#676654', // paint above the dado
      U: '#727160',
      l: '#3d4f47', // and below
      L: '#47584f',
      n: '#2b3833',
      d: '#4d3a2c', // a flat's door
      D: '#5c4635',
      e: '#3a2b22',
      s: '#62676d', // steel
      S: '#7b8086',
      j: '#3c4046',
      b: '#93793a',
      w: '#b3ae98', // paper
      W: '#c9c5b0',
      r: '#84302c',
      c: '#77593a', // cork
      g: '#232c36', // the yard at night
      G: '#35434f',
      y: '#a9965a',
      t: '#c8cdb8', // a strip light
      T: '#e0e2cf',
      i: '#8f8c7a', // a radiator
      I: '#a8a592',
      h: '#6d6a5c',
      m: '#4f3d2b', // a doormat
      M: '#63503a',
    });
    const lino = hex('#596058'),
      linoL = hex('#687066'),
      linoD = hex('#4b5149'),
      linoY = hex('#737160');
    const wall = (c) => {
      c.rect(0, 0, 15, 8, p.u);
      c.row(9, 0, 15, p.n);
      c.rect(0, 10, 15, 15, p.l);
      dots(c, p.U, [[3, 2], [4, 2], [11, 6], [8, 4]]);
      dots(c, hex('#5c5b4a'), [[13, 1], [6, 7], [1, 5]]);
      dots(c, p.L, [[5, 12], [12, 14], [13, 14]]);
      dots(c, p.n, [[9, 12], [2, 14]]);
    };
    const floor = (c) => {
      fill(c, lino);
      speck(c, linoL, 14, 4);
      speck(c, linoD, 14, 8);
      speck(c, linoY, 6, 13);
    };
    set('apartment', 'apartment block of flats stairwell corridor', {
      top: (c) => {
        fill(c, hex('#16161a'));
        speck(c, hex('#1c1c21'), 7, 6);
        dots(c, hex('#111114'), [[4, 4], [11, 12]]);
      },
      wallWords: 'two tone painted concrete dado',
      wall,
      details: [
        [
          'door',
          'flat door number peephole letter slot',
          (c) =>
            art(c, 0, 0, [
              '..eeeeeeeeeeee..',
              '..eDDDDDDDDDDe..',
              '..eDddddddddde..',
              '..eDddwwwdddde..',
              '..eDddwkwdddde..',
              '..eDddddddddde..',
              '..eDdddkddddde..',
              '..eDddddddddde..',
              '..eDdddddddbde..',
              '..eDdddddddbde..',
              '..eDdbbbbbddde..',
              '..eDdbkkkbddde..',
              '..eDddddddddde..',
              '..eDddddddddde..',
              '..eDddddddddde..',
              '..emmmmmmmmmme..',
            ], p),
        ],
        [
          'letterboxes',
          'letter boxes mail post',
          (c) => {
            c.rect(1, 2, 14, 12, p.j);
            for (let j = 0; j < 2; j++)
              for (let i = 0; i < 3; i++) {
                const x = 2 + i * 4,
                  y = 3 + j * 5;
                c.rect(x, y, x + 3, y + 3, p.s);
                c.row(y, x, x + 3, p.S);
                c.row(y + 1, x, x + 2, p.k);
                c.set(x + 3, y + 3, p.j);
                c.set(x + 1, y + 3, p.w);
              }
            c.rect(10, 8, 13, 11, p.k);
            art(c, 6, 3, ['WW', 'ww'], p);
            art(c, 11, 10, ['w', 'W'], p);
            c.set(2, 6, p.r);
          },
        ],
        [
          'lift',
          'lift elevator doors button',
          (c) =>
            art(c, 0, 0, [
              '.jjjjjjjjjjjjj..',
              '.jkkkkrkkkkkkj..',
              '.jjjjjjjjjjjjj..',
              '.jSssssjSssssj..',
              '.jSssssjSssssj..',
              '.jSssssjSssssj..',
              '.jSssssjSssssj.j',
              '.jSssssjSssssjjy',
              '.jSssssjSssssj.j',
              '.jSssssjSssssj..',
              '.jSssssjSssssj..',
              '.jSssssjSssssj..',
              '.jSssssjSssssj..',
              '.jSssssjSssssj..',
              '.jSssssjSssssj..',
              '.jSsssjjjssssj..',
            ], p),
        ],
        [
          'light',
          'strip light fluorescent tube',
          (c) => {
            for (let y = 3; y <= 8; y++) for (let x = 0; x < 16; x++) if (y < 9) c.set(x, y, blend(c.get(x, y), p.t, y === 3 || y === 8 ? 0.1 : 0.22));
            art(c, 1, 5, ['jssssssssssssj', 'jTTTTTTtTTTTTj'], p);
            dots(c, p.h, [[5, 6], [6, 6]]);
          },
        ],
        [
          'noticeboard',
          'notice board pinned papers',
          (c) =>
            art(c, 0, 1, [
              '.eeeeeeeeeeeeee.',
              '.ecccccccccccce.',
              '.ecwwwcWWWcwwce.',
              '.ecwrwcWWWcwwce.',
              '.ecwwwcWkWccwce.',
              '.ecwwwcWWWcccce.',
              '.ecccccccccrrce.',
              '.ecWWWWccccrrce.',
              '.ecWkkWcwwcccce.',
              '.ecccccccwcccce.',
              '.eeeeeeeeeeeeee.',
            ], p),
        ],
        [
          'radiator',
          'radiator heating pipes',
          (c) => {
            for (let x = 2; x <= 13; x++) c.col(x, 8, 13, x % 2 ? p.h : p.i);
            c.row(7, 2, 13, p.I);
            c.row(14, 2, 13, p.j);
            c.row(10, 2, 13, p.I);
            art(c, 14, 6, ['h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h'], p);
            c.set(14, 8, p.r);
            art(c, 1, 12, ['h', 'h', 'h', 'h'], p);
            dots(c, hex('#5c4a30'), [[4, 9], [4, 10], [9, 12]]);
          },
        ],
        [
          'window',
          'window to the yard night lit window',
          (c) =>
            art(c, 0, 1, [
              '..jjjjjjjjjjjj..',
              '..jgggggjggggj..',
              '..jggGggjggggj..',
              '..jgGGGgjgyggj..',
              '..jgGGGgjggggj..',
              '..jgGgGgjggggj..',
              '..jjjjjjjjjjjj..',
              '..jGGGGGjgGGgj..',
              '..jGyGGGjgGGgj..',
              '..jGGGGGjgGGgj..',
              '..jjjjjjjjjjjj..',
              '.hhhhhhhhhhhhhh.',
            ], p),
        ],
      ],
      floorWords: 'speckled linoleum lino',
      floor,
      variants: [
        [
          'worn',
          'worn patch path',
          (c) => {
            const w = hex('#646a5f');
            c.oval(2, 3, 13, 12, w);
            c.rect(0, 6, 15, 9, w);
            speck(c, linoL, 8, 5, 2, 4, 13, 11);
            speck(c, lino, 9, 7, 1, 3, 14, 12);
            dots(c, linoY, [[6, 7], [10, 6], [4, 9]]);
          },
        ],
        [
          'stain',
          'stain dark spill',
          (c) => {
            const d = hex('#3f423c');
            c.oval(3, 4, 11, 11, d);
            c.rect(6, 3, 9, 12, d);
            c.oval(9, 8, 13, 12, d);
            dots(c, hex('#33352f'), [[6, 6], [7, 7], [8, 6], [7, 9], [11, 10]]);
            dots(c, d, [[13, 5], [2, 12], [14, 13]]);
          },
        ],
        [
          'doormat',
          'doormat mat bristle',
          (c) => {
            c.rect(1, 4, 14, 12, p.m);
            c.frame(1, 4, 14, 12, p.e);
            for (let y = 5; y <= 11; y++) for (let x = 2; x <= 13; x++) if ((x + y * 2) % 3 === 0) c.set(x, y, p.M);
            c.row(13, 2, 14, linoD);
          },
        ],
        [
          'cracked',
          'cracked torn lino lifted corner',
          (c) => {
            dots(c, hex('#33362f'), [[2, 3], [3, 4], [4, 4], [5, 5], [6, 6], [6, 7], [7, 8], [8, 8], [9, 9], [10, 9], [11, 10], [6, 8], [5, 9], [5, 10]]);
            art(c, 11, 10, ['kkkk.', 'kkkkk', 'Lkkkk', 'LLkkk', 'LLLkk'], { k: hex('#2f2c2a'), L: linoL });
          },
        ],
      ],
    });
  }

  /* ================= 10. modern: a home of the 1980s and 90s ================= */
  {
    const p = pal({
      k: '#101014',
      a: '#6f6d5c', // woodchip paper, painted
      A: '#7a7866',
      z: '#646252',
      w: '#b0ad9c', // white plastic, gloss paint
      W: '#c4c1b0',
      v: '#8d8a7a',
      g: '#202834', // night outside
      G: '#323e4c',
      s: '#a5a290', // blind slats
      S: '#87846f',
      x: '#3a3a3c',
      f: '#4d4a44',
      F: '#5f5c55',
      r: '#7a3430', // book spines
      n: '#2f4a5a',
      o: '#8a6a2e',
      e: '#3f5a3e',
      t: '#6a4e36', // shelf wood
      T: '#7e6044',
      i: '#565a60',
      y: '#a9965a',
    });
    const cp = hex('#74624e'),
      cpL = hex('#7f6d57'),
      cpD = hex('#685741');
    const wall = (c) => {
      fill(c, p.a);
      speck(c, p.A, 18, 5);
      speck(c, p.z, 12, 10);
    };
    const floor = (c) => each(c, (x, y) => ((x * 3 + y * 5) % 7 === 0 ? cpL : (x * 5 + y * 3) % 11 === 0 ? cpD : cp));
    set('modern', 'modern home eighties nineties', {
      top: (c) => {
        fill(c, hex('#17161a'));
        speck(c, hex('#1d1c21'), 7, 3);
        dots(c, hex('#121115'), [[6, 3], [10, 12]]);
      },
      wallWords: 'painted woodchip wallpaper',
      wall,
      details: [
        [
          'window-blinds',
          'picture window venetian blinds gap',
          (c) => {
            art(c, 0, 1, [
              'ffffffffffffffff',
              'fssssssssssssssf',
              'fxxxxxxxxxxxxxxf',
              'fssssssssssssssf',
              'fxxxxxxxxxxxxxxf',
              'fsssssSggSsssssf',
              'fxxxxxggggxxxxxf',
              'fssssssSSssssssf',
              'fxxxxxxxxxxxxxxf',
              'fssssssssssssssf',
              'ffffffffffffffff',
              'vwwwwwwwwwwwwwwv',
            ], p);
            c.col(13, 2, 13, p.v);
          },
        ],
        [
          'door',
          'door flush white lever handle',
          (c) =>
            art(c, 0, 0, [
              '..FFFFFFFFFFFF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwiiivF..',
              '..FWwwwwwwwivF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwwwwvF..',
              '..FWwwwwwwwwvF..',
              '..FWwwvvwwwwvF..',
              '..FWwvvvvwwwvF..',
              '..FvvvvvvvvvvF..',
            ], p),
        ],
        [
          'radiator',
          'radiator under window',
          (c) => {
            art(c, 0, 0, [
              '..ffffffffffff..',
              '..fgggggfggggf..',
              '..fggGggfggggf..',
              '..fgGGggfggggf..',
              '..fgGggggggggf'.slice(0, 14) + '..',
              '..fgggggfggggf..',
              '..ffffffffffff..',
              '.vwwwwwwwwwwwwv.',
            ], p);
            c.col(8, 1, 5, p.f);
            for (let x = 2; x <= 13; x++) c.col(x, 9, 14, x % 3 === 1 ? p.v : p.w);
            c.row(9, 2, 13, p.W);
            c.row(14, 2, 13, p.v);
            art(c, 14, 10, ['i', 'i', 'i', 'i', 'i', 'i'], p);
            c.set(14, 9, p.k);
          },
        ],
        [
          'shelf',
          'shelf books tapes plant',
          (c) =>
            art(c, 0, 2, [
              '..............e.',
              '.r.....o....e.e.',
              '.rn.e..or....e..',
              '.rnoer.orn..eee.',
              '.rnoer.orn..TTT.',
              '.rnoernorn..TTT.',
              'TTTTTTTTTTTTTTTT',
              'tttttttttttttttt',
              '..i..........i..',
              '..i..........i..',
            ], p),
        ],
        [
          'clock',
          'wall clock plastic hands',
          (c) => {
            c.oval(3, 2, 12, 11, p.f);
            c.oval(4, 3, 11, 10, p.w);
            dots(c, p.f, [[7, 4], [10, 7], [7, 9], [5, 6]]);
            c.line(7, 6, 7, 4, p.k);
            c.line(8, 7, 10, 8, p.k);
            c.set(8, 8, p.r);
            c.set(8, 9, p.r);
            c.set(5, 4, p.W);
          },
        ],
        [
          'switch',
          'light switch socket cable',
          (c) => {
            art(c, 6, 3, ['wwww', 'wWvw', 'wWvw', 'wwww'], p);
            c.row(7, 6, 9, p.v);
            art(c, 5, 11, ['wwwwww', 'wkwwkw', 'wwwwww'], p);
            c.row(14, 5, 10, p.v);
            art(c, 10, 12, ['kk..', '.kk.', '..kk', '...k'], p);
            dots(c, p.z, [[4, 5], [4, 6], [11, 4]]);
          },
        ],
      ],
      floorWords: 'wall to wall carpet fitted',
      floor,
      variants: [
        [
          'parquet',
          'parquet wood blocks',
          (c) =>
            each(c, (x, y) => {
              const q = ((x >> 3) + (y >> 3)) % 2,
                a = (q ? x : y) % 8,
                b = (q ? y : x) % 8;
              return a % 4 === 3 || b === 7 ? hex('#5a442e') : ((a >> 2) + q + (y >> 3)) % 2 ? hex('#806548') : hex('#775c41');
            }),
          true,
        ],
        [
          'lino',
          'kitchen lino vinyl squares',
          (c) => {
            each(c, (x, y) => {
              const u = x % 8,
                w = y % 8;
              if (u === 7 || w === 7) return hex('#5d5a4c');
              return (u === 3 || u === 4) && (w === 3 || w === 4) ? hex('#6a4a38') : ((x >> 3) + (y >> 3)) % 2 ? hex('#7a7562') : hex('#70705e');
            });
            dots(c, hex('#5d5a4c'), [[2, 5], [10, 12]]);
          },
          true,
        ],
        [
          'rug',
          'rug edge fringe',
          (c) => {
            c.rect(0, 6, 15, 15, hex('#4f3a48'));
            c.row(6, 0, 15, hex('#8a7a58'));
            c.row(8, 0, 15, hex('#6a4e5c'));
            for (let x = 0; x < 16; x += 2) {
              c.set(x, 5, hex('#a39a7c'));
              c.set(x, 4, hex('#8a7a58'));
            }
            for (let x = 1; x < 16; x += 4) art(c, x, 11, ['.q.', 'qQq', '.q.'], { q: hex('#6a4e5c'), Q: hex('#8a7a58') });
          },
        ],
      ],
    });
  }

  /* ================= 11. victorian ================= */
  {
    const p = pal({
      k: '#0d0a0b',
      g: '#2d4034', // wallpaper
      G: '#3a5341',
      h: '#22322a',
      w: '#4a2f22', // wainscot
      W: '#5e3e2a',
      v: '#35211a',
      o: '#8f7636', // gilt
      O: '#b09448',
      r: '#5a1f28', // drapes
      R: '#72303a',
      q: '#3f141c',
      n: '#1a2130', // night in the glass
      N: '#2a3446',
      f: '#9c8a74', // a face
      F: '#b5a48a',
      y: '#b8a860', // gaslight
      Y: '#d8cc8a',
      m: '#6a676a', // marble
      M: '#858288',
      i: '#2a2a30',
      e: '#a8502a',
      E: '#d08a3a',
      c: '#43555b', // old mirror glass
      C: '#62777c',
      d: '#3a251e',
      D: '#4c3226',
    });
    const pa = hex('#55392a'),
      pb = hex('#614231'),
      pl = hex('#3d291f');
    const wall = (c) => {
      c.rect(0, 0, 15, 9, p.g);
      for (const [x, y] of [[2, 2], [10, 2], [6, 6], [14, 6]]) {
        dots(c, p.G, [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]]);
        c.set(x, y, p.h);
      }
      dots(c, p.h, [[6, 1], [14, 1], [2, 7], [10, 7]]);
      c.row(10, 0, 15, p.W);
      c.row(11, 0, 15, p.v);
      c.rect(0, 12, 15, 15, p.w);
      c.col(7, 12, 15, p.v);
      c.col(15, 12, 15, p.v);
      c.col(0, 12, 14, p.W);
      c.col(8, 12, 14, p.W);
      c.row(15, 0, 15, p.v);
    };
    const floor = (c) =>
      each(c, (x, y) => {
        const z = y % 8 < 4 ? y % 8 : 7 - (y % 8),
          s = (x + z) % 4;
        return s === 0 ? pl : s === 1 ? pb : pa;
      });
    const glow = (c, x0, y0, x1, y1, col, t) => {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (c.get(x, y)) c.set(x, y, blend(c.get(x, y), col, t));
    };
    set('victorian', 'victorian house old parlour', {
      top: (c) => {
        fill(c, hex('#150f0e'));
        speck(c, hex('#1c1513'), 7, 7);
        dots(c, hex('#100b0a'), [[4, 10], [12, 4]]);
      },
      wallWords: 'dark green patterned wallpaper wood wainscot',
      wall,
      details: [
        [
          'window',
          'sash window drapes curtains night',
          (c) =>
            art(c, 0, 0, [
              '.oOoOoOoOoOoOoO.',
              '.RrrRrrRrrRrrRr.',
              '.RrnnnnnnnnnnrR.',
              '.RrnnnNnnnnnnrR.',
              '.RrrnnNNnnnnrrR.',
              '.RrrnnnnnnnnrrR.',
              '.qRrDDDDDDDDrRq.',
              '.qRrnnnnnnnnrRq.',
              '..Rrnnnnnnnnrq..',
              '..oOrnnnnnnrOo..',
              '..Rrnnnnnnnnrq..',
              '.RrrnnnnnnnnrrR.',
              '.RrrDDDDDDDDrrR.',
              '.RrR........RrR.',
              '.RrR........RrR.',
              '.qrq........qrq.',
            ], p),
        ],
        [
          'portrait',
          'portrait oval gilt frame faceless',
          (c) =>
            art(c, 0, 0, [
              '.......ii.......',
              '....oOOOOOOo....',
              '...oOkkkkkkOo...',
              '..oOkkkffkkkOo..',
              '..OkkkfFFfkkkO..',
              '..OkkkfFFfkkkO..',
              '..OkkkkffkkkkO..',
              '..OkkqqffqqkkO..',
              '..oOqqqqqqqqOo..',
              '...oOqqqqqqOo...',
              '....oOOOOOOo....',
            ], p),
        ],
        [
          'lamp',
          'gas lamp glowing wall bracket',
          (c) => {
            glow(c, 3, 0, 12, 8, p.y, 0.14);
            glow(c, 5, 1, 10, 7, p.y, 0.16);
            art(c, 5, 2, [
              '..yy..',
              '.yYYy.',
              '.yYYy.',
              '.yYYy.',
              '..yy..',
              '.oOOo.',
              '..oo..',
              '..o...',
              '..oo..',
              '...oo.',
              '..oOo.',
              '..oOo.',
            ], p);
          },
        ],
        [
          'fireplace',
          'fireplace marble grate coals',
          (c) =>
            art(c, 0, 3, [
              'MMMMMMMMMMMMMMMM',
              '.mmmmmmmmmmmmmm.',
              '..MmmmmmmmmmmM..',
              '..MmoooooooomM..',
              '..MmokkkkkkomM..',
              '..MmokkkkkkomM..',
              '..MmokkkkkkomM..',
              '..MmokkkkkkomM..',
              '..MmokiiiikomM..',
              '..MmokieEikomM..',
              '..MmoiEeEeiomM..',
              '..MmoiiiiiiomM..',
              '.mmmmmmmmmmmmmm.',
            ], p),
        ],
        [
          'door',
          'door fanlight panelled',
          (c) =>
            art(c, 0, 0, [
              '.....vvvvvv.....',
              '....vyyvvyyv....',
              '...vyyyvvyyyv...',
              '...vvvvvvvvvv...',
              '...vDDDDDDDDv...',
              '...vDddDDddDv...',
              '...vDddDDddDv...',
              '...vDddDDddDv...',
              '...vDDDDDDDDv...',
              '...vDDDDDDDov...',
              '...vDddDDddDv...',
              '...vDddDDddDv...',
              '...vDddDDddDv...',
              '...vDddDDddDv...',
              '...vDDDDDDDDv...',
              '...vvvvvvvvvv...',
            ], p),
        ],
        [
          'mirror',
          'mirror gilt frame reflection figure',
          (c) =>
            art(c, 0, 0, [
              '.......ii.......',
              '....oOOOOOOo....',
              '...oOccccCcOo...',
              '..oOccccCcccOo..',
              '..OccckkccCccO..',
              '..OcckkkkccccO..',
              '..OcckkkkccccO..',
              '..OccckkcccccO..',
              '..oOkkkkkkccOo..',
              '...oOkkkkkcOo...',
              '....oOOOOOOo....',
            ], p),
        ],
      ],
      floorWords: 'dark parquet herringbone',
      floor,
      variants: [
        [
          'runner',
          'carpet runner red',
          (c) => {
            c.rect(0, 2, 15, 13, p.r);
            c.row(2, 0, 15, p.q);
            c.row(13, 0, 15, p.q);
            c.row(4, 0, 15, p.o);
            c.row(11, 0, 15, p.o);
            for (let x = 1; x < 16; x += 4) art(c, x, 6, ['.R.', 'RoR', 'RoR', '.R.'], p);
            speck(c, p.q, 6, 4, 0, 5, 15, 10);
          },
        ],
        [
          'worn',
          'worn scuffed pale',
          (c) =>
            each(c, (x, y) => {
              const d = ((x - 7.5) / 7) ** 2 + ((y - 8) / 5) ** 2 + ((x * 5 + y * 3) % 7) * 0.05;
              const q = c.get(x, y);
              return d < 1 ? (q === pl ? hex('#584032') : hex('#6d4e3a')) : null;
            }),
        ],
        [
          'inlay',
          'tile inlay encaustic star pattern',
          (c) => {
            c.rect(1, 1, 14, 14, hex('#3a3330'));
            each(c, (x, y) => {
              if (x < 2 || y < 2 || x > 13 || y > 13) return null;
              const u = Math.abs(x - 7.5),
                w = Math.abs(y - 7.5),
                d = u + w;
              return d < 2.5 ? hex('#7a3a2a') : d < 4.5 ? hex('#8a7848') : d < 6.5 ? hex('#3a3330') : Math.max(u, w) > 5 && d > 9.5 ? hex('#7a3a2a') : hex('#8a7848');
            });
          },
        ],
      ],
    });
  }

  return out;
};
