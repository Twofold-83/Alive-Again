/*
 * Room tile sets for more settings of a story: thirteen further places, written like env-tiles.js. Each has a dark
 * surround (`-top`), a plain back wall, five wall tiles with one feature each, a plain floor and four floor
 * variants. Every tile is 16 x 16, fills its square, has no outline and no automatic shading, and repeats
 * without a seam next to itself and next to the plain tile of its set.
 *
 *   node tools/make-big.js --only=env2-tiles --out=<dir>
 */
module.exports = ({ C, K, hex, mix, blend, dark, lite, rnd, canvas, rows }) => {
  const out = {};
  const tile = (slug, kind, name, draw) =>
    (out[slug] = { cat: 'env-tiles', catLabel: 'Rooms: settings', group: 'tile', kind, name, w: 16, h: 16, shade: false, outline: false, draw });

  /* ---------- helpers (the same as in env-tiles.js) ---------- */
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
  /** Blend a colour into what is drawn in a box: a glow, a shadow, a stain. */
  const tint = (c, x0, y0, x1, y1, col, t) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (c.get(x, y)) c.set(x, y, blend(c.get(x, y), col, t));
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

  /* ================= 1. apocalypse: what is left afterwards ================= */
  {
    const p = pal({
      k: '#0c0c0d',
      d: '#1b1b1c',
      c: '#55544e', // concrete
      C: '#646359',
      v: '#47463f',
      u: '#33322e',
      w: '#7c7665', // old plaster
      W: '#8f8975',
      r: '#74401f', // rust
      R: '#96592e',
      b: '#4b3a2a', // boards
      B: '#614a31',
      n: '#2d2219',
      x: '#7d2a22', // spray paint
      X: '#98382b',
      s: '#161514', // soot
      S: '#292725',
      a: '#5f5d58', // ash
      A: '#7b7973',
      g: '#3d4a50', // the day outside
      i: '#85888f',
    });
    const fl = hex('#3a3937'),
      flL = hex('#454442'),
      flD = hex('#2f2e2c');
    const wall = (c) => {
      fill(c, p.c);
      c.row(15, 0, 15, p.v);
      dots(c, p.u, [[3, 3], [11, 3]]);
      dots(c, p.v, [[3, 4], [3, 5], [11, 4], [9, 10], [10, 11], [6, 12], [7, 12], [14, 7]]);
      dots(c, p.C, [[5, 7], [6, 7], [13, 1], [1, 10], [2, 10], [8, 2]]);
    };
    const floor = (c) => {
      fill(c, fl);
      dots(c, flL, [[2, 2], [3, 2], [9, 4], [13, 9], [14, 9], [5, 11], [10, 14], [1, 7]]);
      dots(c, flD, [[6, 3], [12, 2], [3, 8], [8, 9], [9, 9], [12, 13], [2, 13]]);
      dots(c, p.c, [[11, 6], [4, 14]]);
      dots(c, p.a, [[7, 6], [14, 12]]);
    };
    set('apocalypse', 'apocalypse ruin wasteland after the end', {
      top: (c) => {
        fill(c, hex('#121211'));
        dots(c, hex('#191918'), [[2, 4], [3, 4], [4, 5], [10, 11], [11, 11], [12, 10], [7, 14]]);
        dots(c, hex('#20201e'), [[13, 3], [5, 9]]);
      },
      wallWords: 'grey concrete cracked',
      wall,
      details: [
        [
          'window',
          'boarded window boards nailed shut planks',
          (c) => {
            c.rect(2, 1, 13, 12, p.u);
            c.rect(3, 2, 12, 11, p.k);
            dots(c, p.g, [[5, 2], [6, 2], [9, 6], [10, 6], [4, 7], [8, 9], [11, 9]]);
            c.row(3, 1, 14, p.B);
            c.row(4, 1, 14, p.b);
            for (let x = 1; x <= 14; x++) {
              const y = 9 - Math.round(((x - 1) * 3) / 13);
              c.set(x, y - 1, p.B);
              c.set(x, y, p.b);
            }
            c.row(10, 2, 15, p.B);
            c.row(11, 2, 15, p.b);
            dots(c, p.n, [[6, 4], [10, 11], [7, 7], [12, 3]]);
            dots(c, p.i, [[2, 3], [13, 3], [2, 8], [13, 5], [3, 10], [14, 10]]);
            c.row(13, 1, 14, p.C);
            c.row(14, 2, 13, p.v);
          },
        ],
        [
          'rebar',
          'hole broken concrete rebar rusty iron bars',
          (c) => {
            art(c, 0, 1, [
              '.....CCCC.......',
              '...CCuuuuCC.....',
              '..CuukkkkuuCCC..',
              '..vukkkkkkkuuC..',
              '.vukkkkkkkkkkuC.',
              '.vukkkkkkkkkkuv.',
              '..vukkkkkkkkuuv.',
              '..vuukkkkkkkuv..',
              '...vuukkkkkuuv..',
              '....vvuukkuuv...',
              '......vvuuvv....',
              '........vv......',
            ], p);
            for (let y = 2; y <= 11; y++)
              for (const x of [5, 9]) {
                const q = c.get(x, y);
                if (q === p.k || q === p.u) c.set(x, y, y % 4 === 1 ? p.R : p.r);
              }
            for (let x = 2; x <= 13; x++) {
              const q = c.get(x, 6);
              if (q === p.k || q === p.u) c.set(x, 6, x % 5 === 2 ? p.R : p.r);
            }
            art(c, 11, 8, ['r', 'rR', '.r', '.r'], p);
            dots(c, p.v, [[4, 14], [5, 14], [10, 14]]);
            dots(c, p.C, [[4, 13], [11, 14]]);
          },
        ],
        [
          'crack',
          'crack split wall damage',
          (c) => {
            art(c, 3, 1, [
              '..k.......',
              '..k.......',
              '...k......',
              '...kk.....',
              '....kk....',
              '....kkuu..',
              '....kk..uu',
              '....k.....',
              '...kk.....',
              '..uk......',
              'uu..k.....',
              '....kk....',
              '.....k....',
              '.....kk...',
            ], p);
            dots(c, p.C, [[6, 1], [6, 2], [7, 3], [9, 5], [9, 9], [10, 13], [11, 14]]);
            dots(c, p.u, [[7, 6], [6, 8]]);
          },
        ],
        [
          'warning',
          'spray paint warning red triangle danger sign keep out',
          (c) => {
            art(c, 0, 1, [
              '.......xX.......',
              '......xXXx......',
              '......X..X......',
              '.....xX..Xx.....',
              '.....X.XX.X.....',
              '....xX.XX.Xx....',
              '....X..XX..X....',
              '...xX..XX..Xx...',
              '...X...xx...X...',
              '..xX........Xx..',
              '..X....XX....X..',
              '.xXXXXXXXXXXXXx.',
              '..x..x.....x....',
              '..x........x....',
              '...........x....',
            ], p);
            dots(c, p.c, [[9, 4], [4, 7], [12, 9], [6, 12]]);
          },
        ],
        [
          'scorch',
          'scorched plaster soot burn mark fire damage',
          (c) => {
            art(c, 0, 0, [
              '................',
              '......S.........',
              '.....SsS...S....',
              '....SssS..S.....',
              '....SsssS.S.....',
              '...SssssSS......',
              '..wSsssssSww....',
              '.wwSsssssSSwww..',
              '.wWwSsssssSwWw..',
              '.wWWSsssssSWWww.',
              '.wWWwSssssSWWWw.',
              '.wwWWSsssSwWWww.',
              '..wWWwSssSWWww..',
              '..wwWWSsSwWww...',
              '...wwwwSwwww....',
              '................',
            ], p);
            dots(c, p.u, [[1, 6], [14, 8], [2, 14], [12, 14], [13, 13]]);
            dots(c, p.c, [[11, 9], [3, 11]]);
          },
        ],
      ],
      floorWords: 'ash dust grey rubble',
      floor,
      variants: [
        [
          'rubble',
          'rubble broken concrete chunks stones',
          (c) => {
            art(c, 2, 2, ['.CCC.', 'CcccC', 'cccvv', '.vvu.'], p);
            art(c, 8, 7, ['..CC..', '.CccC.', 'Cccccv', 'ccvvvu', '.uuu..'], p);
            art(c, 3, 10, ['Cc.', 'cvu'], p);
            dots(c, p.c, [[12, 3], [13, 4], [6, 14]]);
            dots(c, p.r, [[9, 5], [10, 5], [11, 4]]);
            dots(c, flD, [[7, 5], [14, 12], [5, 12]]);
          },
        ],
        [
          'crack',
          'crack fissure split ground',
          (c) => {
            art(c, 1, 4, [
              '.kk...........',
              '...kk.........',
              '.....kkk...k..',
              '......kkkkk...',
              '.....k...kkk..',
              '....k.......k.',
              '...k..........',
            ], p);
            dots(c, flL, [[2, 3], [3, 3], [6, 5], [7, 5], [11, 8], [12, 8]]);
          },
        ],
        [
          'ash',
          'ash drift heap pale grey dust',
          (c) => {
            art(c, 1, 4, [
              '.....aaaa.....',
              '...aaAAAAaa...',
              '..aAAAAAAAAa..',
              '.aaAAaAAAAAaa.',
              'aaaaAAAaAaaaaa',
              '.aaaaaaaaaaaa.',
              '...aa.aaaa....',
            ], p);
            dots(c, p.s, [[6, 6], [10, 8], [4, 9]]);
            dots(c, p.a, [[2, 12], [12, 3], [13, 12]]);
          },
        ],
        [
          'fire',
          'dead camp fire burnt ring charred wood stones',
          (c) => {
            art(c, 2, 3, [
              '...cCc.vCc..',
              '.Cc.ssss.cC.',
              '.v.ssSsss.v.',
              'Cc.sSnssSs.c',
              'cv.snsaSns.C',
              '.c.ssSnsss.v',
              '.Cv.ssss.Cc.',
              '..cC.vv.cv..',
            ], p);
            dots(c, p.x, [[7, 7]]);
            dots(c, p.a, [[8, 5], [5, 8]]);
          },
        ],
      ],
    });
  }

  /* ================= 2. village ================= */
  {
    const p = pal({
      k: '#0e0c0a',
      t: '#3a2a20', // timber
      T: '#4b372a',
      n: '#291d17',
      w: '#8b8776', // whitewash
      W: '#99957f',
      v: '#7b7768',
      q: '#676358',
      g: '#35424f', // dusk in the glass
      G: '#4f5f70',
      s: '#3d5046', // shutters
      S: '#4c6254',
      p: '#aaa188', // paper
      P: '#8d866f',
      i: '#27272d', // iron
      I: '#44444e',
      y: '#66532f', // wattle
      Y: '#806a3c',
      e: '#3c2c20',
      h: '#8e8a6e', // a candle
    });
    const st = hex('#55504a'),
      stD = hex('#4e4a45'),
      stL = hex('#5c5750'),
      hi = hex('#66615a'),
      jo = hex('#3a3633'),
      ea = hex('#523f2f'),
      eaL = hex('#5e4a37'),
      eaD = hex('#443326');
    const wall = (c) => {
      fill(c, p.w);
      c.col(2, 2, 15, p.v);
      c.row(2, 2, 15, p.v);
      dots(c, p.W, [[6, 5], [7, 5], [12, 9], [13, 9], [8, 13], [5, 10]]);
      dots(c, p.v, [[10, 6], [4, 12], [14, 13], [9, 15], [10, 15], [5, 15]]);
      c.col(0, 0, 15, p.T);
      c.col(1, 0, 15, p.t);
      c.row(0, 0, 15, p.T);
      c.row(1, 1, 15, p.t);
      dots(c, p.n, [[0, 6], [0, 7], [1, 12], [6, 0], [7, 0], [12, 1]]);
    };
    /* cobbles: four courses of stones with rounded shoulders */
    const cobbles = (c) => {
      const joints = [[5, 11], [2, 8, 13], [4, 10, 15], [1, 7, 12]];
      each(c, (x, y) => {
        const row = y >> 2,
          j = joints[row];
        if (y % 4 === 3 || j.includes(x)) return jo;
        if (y % 4 === 0 && (j.includes((x + 1) % 16) || j.includes((x + 15) % 16))) return jo;
        const n = j.filter((v) => v < x).length,
          k = (n * 3 + row * 5) % 4;
        return k === 0 ? stD : k === 2 ? stL : st;
      });
      dots(c, hi, [[1, 1], [7, 1], [13, 1], [4, 5], [10, 5], [0, 9], [6, 9], [12, 9], [3, 13], [9, 13], [14, 13]]);
    };
    const earth = (c) => {
      fill(c, ea);
      dots(c, eaL, [[2, 3], [3, 3], [4, 3], [10, 6], [11, 6], [6, 11], [7, 11], [13, 13], [14, 13], [1, 9]]);
      dots(c, eaD, [[7, 2], [8, 2], [12, 4], [3, 7], [4, 7], [9, 9], [1, 14], [2, 14], [12, 10]]);
      dots(c, st, [[13, 2], [5, 13]]);
    };
    set('village', 'village cottage street old country', {
      topWords: 'dark thatch roof eaves surround',
      top: (c) => {
        fill(c, hex('#15120e'));
        dots(c, hex('#1e1a13'), [[2, 2], [2, 3], [2, 4], [7, 9], [7, 10], [7, 11], [12, 4], [12, 5], [12, 6], [5, 13], [5, 14]]);
        dots(c, hex('#262015'), [[9, 2], [14, 12]]);
      },
      wallWords: 'whitewashed plaster timber frame half timbered',
      wall,
      details: [
        [
          'window',
          'small window shutters shuttered green dusk',
          (c) => {
            art(c, 2, 4, [
              'sssTTTTTTTsss',
              'SSSTgGTggTSSS',
              'sssTggTggTsss',
              'SSSTggTggTSSS',
              'sssTTTTTTTsss',
              'SSSTggTggTSSS',
              'sssTggTgGTsss',
              'SSSTggTggTSSS',
              'sssTTTTTTTsss',
              '.ttttttttttt.',
            ], p);
            dots(c, p.i, [[3, 5], [3, 11], [13, 5], [13, 11]]);
            c.row(14, 4, 13, p.v);
          },
        ],
        [
          'notice',
          'notice paper nailed up poster proclamation',
          (c) => {
            art(c, 5, 4, [
              'ppppppp.',
              'pppipppp',
              'pPPPPPpp',
              'pppppppp',
              'pPPPPPPp',
              'pPPPPpPp',
              'pPPPPPPp',
              'pppppppp',
              'pPPPpppp',
              '.ppppPP.',
            ], p);
            c.col(13, 5, 13, p.v);
            c.row(14, 6, 12, p.v);
            dots(c, p.q, [[12, 13], [11, 13]]);
          },
        ],
        [
          'brace',
          'timber brace diagonal beam cross',
          (c) => {
            for (let i = 0; i <= 13; i++) {
              c.set(2 + i, 15 - i, p.T);
              c.set(2 + i, 16 - i, p.t);
              c.set(3 + i, 16 - i, p.t);
              if (i > 0) c.set(3 + i, 17 - i, p.v);
            }
            dots(c, p.n, [[6, 12], [11, 7]]);
          },
        ],
        [
          'daub',
          'plaster fallen wattle and daub showing damage',
          (c) => {
            art(c, 3, 3, [
              '....qqqq....',
              '..qqYyYyqq..',
              '.qyYyYyYyYq.',
              '.qYeYeYeYeYq',
              'qyYyYyYyYyYq',
              'qYeYeYeYeYq.',
              '.qYyYyYyYyq.',
              '.qeYeYeYeq..',
              '..qyYyYyq...',
              '...qqqqq....',
            ], p);
            dots(c, p.W, [[6, 2], [7, 2], [4, 3]]);
            dots(c, p.q, [[5, 14], [8, 14], [9, 15], [12, 14]]);
          },
        ],
        [
          'lantern',
          'lantern iron bracket unlit hanging',
          (c) => {
            art(c, 2, 3, [
              'iiiiiiiii...',
              'ii.....i....',
              'i.....iii...',
              '.....iIIIi..',
              '.....igGgi..',
              '.....iggGi..',
              '.....ighgi..',
              '.....ighgi..',
              '.....iIIIi..',
              '......iii...',
            ], p);
            c.col(11, 7, 12, p.v);
          },
        ],
      ],
      floorWords: 'cobbles cobblestones street',
      floor: cobbles,
      variants: [
        ['earth', 'packed earth dirt path brown', earth, true],
        [
          'weeds',
          'weeds grass moss between cobbles',
          (c) => {
            const m = hex('#44512f'),
              M = hex('#58663a');
            dots(c, m, [[5, 1], [5, 2], [4, 3], [5, 3], [6, 3], [8, 7], [9, 7], [10, 8], [10, 9], [10, 11], [9, 11], [11, 11], [2, 7], [13, 5]]);
            dots(c, M, [[5, 0], [4, 2], [6, 2], [10, 7], [11, 10], [9, 10], [2, 6]]);
          },
        ],
        [
          'puddle',
          'puddle rain water',
          (c) => {
            const e = hex('#2d3a44'),
              h = hex('#566572');
            art(c, 2, 4, ['...eeeee....', '.eeeeeeeee..', 'eeehheeeeeee', 'eeeeeeeeheee', '.eeeeeeeeee.', '..eeee.eee..'], { e, h });
            dots(c, jo, [[4, 4], [13, 6], [2, 8], [8, 9]]);
          },
        ],
        [
          'flagstone',
          'flagstone doorstep slab big stone',
          (c) => {
            c.rect(1, 2, 14, 13, stL);
            c.frame(1, 2, 14, 13, jo);
            c.row(3, 2, 13, hi);
            c.col(2, 3, 12, hi);
            dots(c, jo, [[1, 2], [14, 2], [1, 13], [14, 13]]);
            dots(c, st, [[1, 2], [14, 13]]);
            dots(c, st, [[6, 6], [7, 6], [10, 10], [4, 10], [5, 10], [11, 5]]);
            dots(c, jo, [[12, 12], [13, 11]]);
          },
        ],
      ],
    });
  }

  /* ================= 3. rural: a barn and the fields ================= */
  {
    const p = pal({
      k: '#0d0a09',
      d: '#17110f',
      r: '#57312b', // barn red
      R: '#653a32',
      q: '#4a2925',
      u: '#26161a',
      g: '#5a544c', // bare grey wood
      G: '#6c665b',
      j: '#454039',
      h: '#94804a', // hay
      H: '#ab9658',
      y: '#74633a',
      i: '#3a3a43', // iron
      I: '#5d5e69',
      l: '#48301f', // leather
      L: '#604030',
      b: '#8a6f33',
      w: '#735638', // handles
      W: '#886846',
      o: '#b0a68c', // rope
      O: '#8c8268',
      s: '#59656c', // outside
      f: '#676040',
    });
    const di = hex('#48382b'),
      diL = hex('#544232'),
      diD = hex('#3b2d23');
    const wall = (c) => {
      each(c, (x) => (x % 4 === 3 ? p.u : (x >> 2) === 2 ? p.q : x % 4 === 0 ? p.R : p.r));
      dots(c, p.u, [[1, 3], [5, 3], [9, 3], [13, 3], [1, 12], [5, 12], [9, 12], [13, 12]]);
      dots(c, p.g, [[2, 8], [2, 9], [12, 6], [6, 14]]);
      dots(c, p.q, [[5, 7], [5, 8], [14, 10], [0, 14]]);
    };
    const floor = (c) => {
      fill(c, di);
      dots(c, diL, [[9, 2], [10, 2], [3, 6], [13, 8], [14, 8], [6, 13]]);
      dots(c, diD, [[5, 3], [6, 3], [11, 6], [2, 10], [3, 10], [9, 12], [14, 14]]);
      dots(c, p.y, [[2, 2], [3, 2], [4, 3], [12, 5], [13, 5], [6, 9], [7, 8], [8, 8], [1, 13], [2, 13], [11, 12], [12, 11]]);
      dots(c, hex('#857443'), [[3, 2], [7, 8], [12, 11]]);
    };
    set('rural', 'rural farm barn country', {
      topWords: 'dark rafters barn roof surround',
      top: (c) => {
        fill(c, hex('#14100d'));
        c.row(11, 0, 15, hex('#1c1611'));
        c.row(12, 0, 15, hex('#100c0a'));
        dots(c, hex('#1c1611'), [[3, 3], [4, 3], [12, 6]]);
      },
      wallWords: 'barn planks red boards wood',
      wall,
      details: [
        [
          'half-door',
          'stable half door open top dark stall',
          (c) => {
            c.rect(1, 0, 14, 15, p.j);
            c.rect(2, 1, 13, 7, p.k);
            c.row(1, 2, 13, p.d);
            dots(c, p.d, [[3, 6], [4, 6], [5, 7], [10, 5], [11, 6], [12, 6], [12, 7], [7, 7]]);
            dots(c, p.y, [[4, 7], [9, 7], [10, 7]]);
            for (let x = 2; x <= 13; x++) for (let y = 8; y <= 15; y++) c.set(x, y, x % 3 === 1 ? p.j : x % 3 === 2 ? p.G : p.g);
            c.row(8, 2, 13, p.G);
            c.row(9, 2, 13, p.j);
            c.row(15, 2, 13, p.j);
            for (let i = 0; i <= 11; i++) {
              c.set(2 + i, 10 + Math.round((i * 4) / 11), p.G);
              c.set(2 + i, 11 + Math.round((i * 4) / 11), p.j);
            }
            art(c, 10, 9, ['iI', 'i.'], p);
            dots(c, p.i, [[2, 10], [2, 14]]);
          },
        ],
        [
          'tools',
          'hung tools pitchfork sickle rope pegs',
          (c) => {
            art(c, 0, 1, [
              '.wwwwwwwwwwwwww.',
              '..I....W....W...',
              '.I.I.I.i.II.OO..',
              '.I.I.I.W.I.IO.O.',
              '.I.I.I.W...IO.O.',
              '.IIIII.W...IO.O.',
              '...w...W..II.OO.',
              '...W...w..I..oO.',
              '...W.....w...oO.',
              '...W.....w..o.o.',
              '...W.........oo.',
              '...W............',
              '...w............',
            ], p);
          },
        ],
        [
          'harness',
          'horse collar harness leather hanging bridle',
          (c) => {
            art(c, 0, 1, [
              '.......ii.......',
              '.....bLLLLb.....',
              '....LLllllLL....',
              '...bLl....lLb...',
              '...Ll..rr..lL...',
              '...Ll......lL...',
              '...Ll......lL...',
              '...LLl....lLL...',
              '....Ll....lL....',
              '....bLl..lLb....',
              '.....LLllLL.....',
              '......LLLL......',
              '.......l..l.....',
              '......l....l....',
            ], p);
            for (let y = 5; y <= 10; y++) for (let x = 5; x <= 10; x++) if (c.get(x, y) !== p.L && c.get(x, y) !== p.l) c.set(x, y, blend(c.get(x, y), p.k, 0.3));
          },
        ],
        [
          'hayrack',
          'hay rack manger fodder slats',
          (c) => {
            art(c, 0, 2, [
              '..H..h.H..h.H...',
              '.hHhHhHhHHhHhHh.',
              'WhHhhHhHhHhhHhHW',
              'wWhHhHhhHhHhHhWw',
              '.wWhhHhHhhHhHWw.',
              '.wWHhHhHhHhhhWw.',
              '..wWhHhhHhHhWw..',
              '..wWHhHhHhhHWw..',
              '...wWWWWWWWWw...',
              '...wwwwwwwwww...',
            ], p);
            for (const x of [3, 6, 9, 12]) for (let y = 5; y <= 9; y++) if (c.get(x, y) === p.h || c.get(x, y) === p.H) c.set(x + (x > 7 ? -((y - 4) >> 2) : (y - 4) >> 2), y, p.w);
            dots(c, p.h, [[5, 13], [10, 14], [8, 13]]);
          },
        ],
        [
          'window',
          'small barn window cobweb dusty panes',
          (c) => {
            art(c, 3, 3, [
              'GGGGGGGGGG',
              'GoOssGsssg',
              'GOosSGssSg',
              'GosssGsssg',
              'GssssGsssg',
              'GGGGGGGGGg',
              'GsssSGsssg',
              'GssSsGsssg',
              'GssssGssfg',
              'GffffGfffg',
              'jggggggggj',
            ], p);
            dots(c, p.j, [[2, 14], [13, 14]]);
          },
        ],
      ],
      floorWords: 'dirt hay strewn straw earth',
      floor,
      variants: [
        [
          'ploughed',
          'ploughed earth furrows field',
          (c) =>
            each(c, (x, y) => {
              const v = (y + Math.round(Math.sin((x / 16) * Math.PI * 2) * 1.2) + 16) % 4,
                clod = (x * 5 + y * 3) % 11 === 0;
              return v === 0 ? (clod ? hex('#614c38') : hex('#574332')) : v === 3 ? hex('#392c22') : clod ? hex('#42332a') : hex('#4a3a2c');
            }),
          true,
        ],
        [
          'grass',
          'dry grass field yellow withered',
          (c) => {
            fill(c, hex('#5c5736'));
            const a = hex('#746c43'),
              b = hex('#49472e'),
              t = hex('#8a7f4e');
            dots(c, a, [[2, 2], [2, 3], [3, 1], [8, 4], [8, 5], [9, 3], [13, 7], [13, 8], [12, 6], [5, 9], [5, 10], [6, 8], [10, 12], [10, 13], [11, 11], [1, 13], [1, 14], [14, 1], [14, 2]]);
            dots(c, b, [[3, 3], [9, 5], [14, 8], [6, 10], [11, 13], [2, 14], [15, 2], [7, 14], [4, 6], [12, 10]]);
            dots(c, t, [[3, 0], [9, 2], [12, 5], [6, 7], [11, 10]]);
          },
          true,
        ],
        [
          'hay',
          'heap of hay straw pile',
          (c) => {
            art(c, 1, 3, [
              '....hH..h.....',
              '..hHhHhHhHh...',
              '.hHyHhHhyHhH..',
              '.HhHhHyHhHhHh.',
              'hHhyHhHhHhyHhH',
              'yhHhHhyHhHhHhy',
              '.yhyHhHhHyhHy.',
              '..yyhyyhyyhy..',
            ], p);
            dots(c, p.h, [[1, 12], [13, 2], [14, 12]]);
          },
        ],
        [
          'hoofprints',
          'hoof prints tracks mud horse',
          (c) => {
            const u = { u: diD, U: hex('#30241c') };
            art(c, 2, 2, ['.UU.', 'U..U', 'U..U', 'u..u'], u);
            art(c, 9, 6, ['.UU.', 'U..U', 'U..U', 'u..u'], u);
            art(c, 3, 10, ['.UU.', 'U..U', 'U..U', 'u..u'], u);
            dots(c, diL, [[3, 1], [4, 1], [10, 5], [11, 5], [4, 9], [5, 9]]);
          },
        ],
      ],
    });
  }

  /* ================= 4. suburban: a semi-detached house ================= */
  {
    const p = pal({
      k: '#141214',
      a: '#917f77', // wallpaper
      A: '#9b8a80',
      z: '#83726d',
      d: '#aca796', // dado rail
      D: '#827d6f',
      m: '#99937d', // the wall under it
      M: '#a39d86',
      n: '#8a846f',
      w: '#b1ac9c', // white gloss
      W: '#c2bdac',
      e: '#8a867a',
      c: '#a3a5a0', // net curtain
      C: '#b7b9b3',
      g: '#606d76', // a grey day
      G: '#74818a',
      f: '#553c2d', // a frame
      F: '#6f503a',
      s: '#877559', // an old photograph
      S: '#9a8868',
      o: '#b39b82',
      j: '#2e2723',
      r: '#a5a193', // radiator
      R: '#bab6a5',
      q: '#6b685e',
      b: '#5b4838', // ducks
      B: '#735c46',
      h: '#3c5548',
      y: '#9c6a3c',
    });
    const ca = hex('#58483e'),
      caL = hex('#625146'),
      caD = hex('#4e3f37');
    const wall = (c) => {
      each(c, (x, y) => (y < 10 ? (x % 4 === 1 ? p.A : p.a) : y === 10 ? p.d : y === 11 ? p.D : p.m));
      dots(c, p.z, [[3, 2], [11, 2], [7, 6], [15, 6]]);
      dots(c, p.A, [[3, 1], [11, 1], [7, 5], [15, 5], [3, 3], [11, 3], [7, 7], [15, 7]]);
      dots(c, p.M, [[2, 13], [7, 12], [12, 14], [5, 15], [14, 12]]);
      dots(c, p.n, [[4, 14], [10, 13], [15, 15], [0, 12], [8, 15]]);
    };
    const floor = (c) => {
      fill(c, ca);
      for (const [x, y] of [[3, 3], [11, 11]]) {
        dots(c, caL, [[x, y - 2], [x - 1, y - 1], [x + 1, y - 1], [x - 2, y], [x + 2, y], [x - 1, y + 1], [x + 1, y + 1], [x, y + 2]]);
        dots(c, caD, [[x, y]]);
      }
      for (const [x, y] of [[11, 3], [3, 11]]) dots(c, caD, [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]]);
    };
    const lino = (c) => {
      each(c, (x, y) => (((x >> 2) + (y >> 2)) % 2 ? hex('#6c6a5c') : hex('#58605a')));
      dots(c, hex('#757365'), [[5, 1], [13, 2], [2, 6], [9, 9], [14, 13], [6, 14]]);
      dots(c, hex('#4f5751'), [[1, 2], [10, 1], [6, 5], [13, 10], [2, 13], [9, 14]]);
    };
    set('suburban', 'suburban house home semi detached family', {
      top: (c) => {
        fill(c, hex('#161417'));
        c.row(14, 0, 15, hex('#1e1c1f'));
        c.row(15, 0, 15, hex('#252326'));
        dots(c, hex('#1b191c'), [[4, 4], [11, 8], [7, 11]]);
      },
      wallWords: 'pastel pink wallpaper stripes dado rail',
      wall,
      details: [
        [
          'window',
          'window net curtain lace white frame grey day',
          (c) => {
            art(c, 2, 0, [
              'WWWWWWWWWWWW',
              'WCcCcwwCcCcW',
              'WcCcCwwcCcCW',
              'WCcCcwwCcCcW',
              'WcCcCwwcCcCW',
              'WCcCcwwCcCcW',
              'WcCcCwwcCcCW',
              'WCgCgwwCgCgW',
              'WgGgggwgggGW',
              'eWWWWWWWWWWWWe',
            ], p);
            c.row(8, 2, 13, p.w);
            c.row(9, 1, 14, p.W);
            art(c, 2, 7, ['WCgCgwwCgCgW'], p);
            c.row(10, 1, 14, p.D);
          },
        ],
        [
          'photo',
          'family photo framed photograph picture',
          (c) => {
            art(c, 4, 1, [
              '...zz...',
              'FFFFFFFF',
              'FsSSSSsf',
              'FSoSoSSf',
              'FSjSjSsf',
              'FjjjjoSf',
              'FjjjjjSf',
              'Fjjjjjjf',
              'Ffffffff',
            ], p);
            c.col(12, 3, 10, p.z);
          },
        ],
        [
          'switch',
          'light switch plate grubby',
          (c) => {
            art(c, 6, 3, ['WWWW', 'WwwW', 'WeWW', 'WwwW', 'weee'], p);
            dots(c, p.z, [[5, 5], [5, 6], [10, 5], [10, 6], [7, 8], [8, 8], [9, 9]]);
          },
        ],
        [
          'radiator',
          'radiator heating white panel pipe',
          (c) => {
            for (let x = 2; x <= 13; x++)
              for (let y = 4; y <= 13; y++) c.set(x, y, x % 3 === 1 ? p.q : y === 4 ? p.R : x % 3 === 2 ? p.R : p.r);
            c.row(4, 2, 13, p.R);
            c.row(13, 2, 13, p.e);
            dots(c, p.a, [[2, 4], [13, 4]]);
            art(c, 13, 11, ['.qq', '.eq', '..e', '..e', '..e'], p);
            c.col(3, 14, 15, p.e);
            c.row(3, 3, 12, p.z);
          },
        ],
        [
          'ducks',
          'three flying ducks ornament plaster',
          (c) => {
            const duck = (x, y) => {
              art(c, x, y, ['..BB..', 'wbbBhy', '..b...'], p);
              c.set(x + 3, y + 3, p.z);
            };
            duck(1, 6);
            duck(5, 3);
            duck(9, 0);
          },
        ],
      ],
      floorWords: 'fitted carpet brown pattern',
      floor,
      variants: [
        ['lino', 'lino linoleum kitchen chequered vinyl', lino, true],
        [
          'stain',
          'stain on the carpet dark spill',
          (c) => {
            const s = hex('#3d312c'),
              S = hex('#473932');
            art(c, 2, 3, ['....SSSS....', '..SSssssSS..', '.SssssssssS.', '.SssssssssSS', 'SSsssssssssS', '.SSssssssSS.', '...SSsssS...', '.....SSS....'], { s, S });
            dots(c, S, [[13, 12], [14, 12], [3, 12]]);
          },
        ],
        [
          'mat',
          'door mat coir bristle rug',
          (c) => {
            const m = hex('#75643f'),
              M = hex('#857349'),
              e = hex('#4a3d2b');
            c.rect(1, 4, 14, 12, m);
            c.frame(1, 4, 14, 12, e);
            for (let y = 5; y <= 11; y++) for (let x = 2; x <= 13; x++) if ((x + y * 2) % 4 === 0) c.set(x, y, M);
            c.frame(3, 6, 12, 10, hex('#5d4f35'));
          },
        ],
        [
          'worn',
          'worn threadbare path carpet',
          (c) => {
            const t = hex('#6a5b4f'),
              T = hex('#746559');
            art(c, 1, 2, [
              '.....tttt.....',
              '...tttTtttt...',
              '..ttTtTtTttt..',
              '.tttTtTtTtTtt.',
              '.ttTtTtTtTttt.',
              'tttTtTtTtTtTtt',
              '.ttTtTtTtTttt.',
              '.tttTtTtTtTtt.',
              '..ttTtTtTttt..',
              '...tttTtttt...',
              '.....tttt.....',
            ], { t, T });
          },
        ],
      ],
    });
  }

  /* ================= 5. hell ================= */
  {
    const p = pal({
      k: '#090506',
      r: '#3a1a1b', // rock
      R: '#492421',
      q: '#2b1216',
      u: '#1a0a0d',
      g: '#6e2616', // fire, from deep to hot
      e: '#a8401a',
      E: '#cf6e28',
      y: '#e0a244',
      b: '#9d947b', // bone
      B: '#b8af94',
      n: '#716a58',
      i: '#262125', // iron
      I: '#463c42',
    });
    const fl = hex('#2f2325'),
      flL = hex('#3a2c2c'),
      flD = hex('#261b1e'),
      jo = hex('#140c0e');
    const wall = (c) => {
      fill(c, p.r);
      dots(c, p.R, [[2, 2], [3, 2], [4, 3], [9, 6], [10, 6], [11, 7], [13, 12], [14, 12], [5, 13], [6, 13], [15, 1], [0, 1]]);
      dots(c, p.q, [[6, 4], [7, 4], [7, 5], [12, 2], [13, 2], [1, 8], [2, 8], [2, 9], [10, 13], [11, 13], [11, 14], [15, 7], [0, 7], [8, 10], [5, 0]]);
      dots(c, p.u, [[7, 6], [13, 3], [3, 10], [11, 15]]);
      dots(c, p.g, [[4, 6], [5, 6], [5, 7], [12, 9], [13, 10]]);
      dots(c, p.e, [[6, 7]]);
    };
    const floor = (c) => {
      fill(c, fl);
      c.row(7, 0, 15, jo);
      c.row(15, 0, 15, jo);
      c.col(5, 0, 6, jo);
      c.col(13, 0, 6, jo);
      c.col(9, 8, 14, jo);
      c.col(1, 8, 14, jo);
      dots(c, flL, [[7, 1], [8, 1], [2, 3], [11, 10], [12, 10], [4, 12], [15, 3]]);
      dots(c, flD, [[9, 4], [10, 4], [3, 5], [5, 9], [6, 9], [13, 13], [0, 11], [14, 1]]);
    };
    set('hell', 'hell inferno underworld fire', {
      topWords: 'black red dark rock surround',
      top: (c) => {
        fill(c, hex('#120809'));
        dots(c, hex('#1b0c0d'), [[3, 3], [4, 3], [4, 4], [10, 9], [11, 9], [12, 10], [7, 13]]);
        dots(c, hex('#3a130e'), [[13, 4]]);
      },
      wallWords: 'red black rock veins of fire',
      wall,
      details: [
        [
          'grate',
          'barred grate glowing bars furnace opening fire',
          (c) => {
            tint(c, 0, 0, 15, 15, p.e, 0.12);
            tint(c, 1, 1, 14, 15, p.e, 0.12);
            c.oval(3, 1, 11, 9, p.u);
            c.rect(3, 5, 11, 14, p.u);
            c.oval(4, 2, 10, 9, p.g);
            c.rect(4, 6, 10, 13, p.g);
            for (let y = 8; y <= 13; y++) for (let x = 4; x <= 10; x++) c.set(x, y, y > 11 ? p.E : y > 9 ? p.e : (x + y) % 2 ? p.e : p.g);
            dots(c, p.y, [[6, 13], [7, 13], [8, 12], [9, 13], [5, 12]]);
            for (const x of [5, 7, 9]) c.col(x, 2, 13, p.i);
            dots(c, p.u, [[5, 2], [9, 2]]);
            c.row(7, 4, 10, p.i);
            dots(c, p.I, [[5, 7], [7, 7], [9, 7]]);
            c.row(14, 2, 12, p.q);
          },
        ],
        [
          'bones',
          'bones skull set in the wall bone studded',
          (c) => {
            art(c, 4, 1, ['.bBBBb.', 'bBBBBBb', 'BkkBkkB', 'BkkBkkb', 'bBBkBBn', '.bBBBn.', '.BnBnB.'], p);
            art(c, 1, 10, ['B.......B....', 'bBBBBBBBn....', 'B.......B....'], p);
            art(c, 9, 12, ['b.....b', 'nBBBBBn', 'b.....b'], p);
            art(c, 12, 2, ['.bb', 'bBn', 'bBn', '.b.', '.b.', '.B.', '.b.', 'bBn', '.b.'], p);
            art(c, 0, 3, ['.b.', 'bnb', '.b.'], p);
            dots(c, p.q, [[4, 8], [10, 8], [3, 13], [15, 11]]);
          },
        ],
        [
          'vein',
          'vein of fire glowing crack lava seam',
          (c) => {
            const path = [[9, 1], [9, 2], [8, 3], [8, 4], [7, 5], [7, 6], [6, 7], [7, 8], [7, 9], [8, 10], [8, 11], [7, 12], [6, 13], [6, 14]];
            const side = [[10, 4], [11, 5], [12, 5], [13, 6], [5, 9], [4, 10], [3, 10], [9, 12], [10, 13]];
            for (const [x, y] of [...path, ...side]) tint(c, x - 2, y - 1, x + 2, y + 1, p.e, 0.14);
            for (const [x, y] of path) {
              c.set(x - 1, y, p.g);
              c.set(x + 1, y, p.g);
            }
            dots(c, p.e, side);
            dots(c, p.E, path);
            dots(c, p.y, [[7, 5], [7, 6], [6, 7], [7, 8], [8, 10]]);
            dots(c, p.g, [[14, 6], [2, 11]]);
          },
        ],
        [
          'face',
          'face in the rock screaming damned soul relief',
          (c) =>
            art(c, 1, 1, [
              '....RRRRRR....',
              '...RRrrrrRR...',
              '..RRrrrrrrRR..',
              '..RquuRRuuqR..',
              '..RrueRRuerq..',
              '..RrrrRqrrrq..',
              '..RRrrRqrrRq..',
              '...RruuuuRq...',
              '...RrukkurR...',
              '...Rrukkurq...',
              '...RrruurRq...',
              '....RRrrqq....',
              '.....qqqq.....',
            ], p),
        ],
        [
          'chains',
          'chains manacles shackles iron hanging',
          (c) => {
            art(c, 0, 0, [
              '...II.......II..',
              '..IiiI.....IiiI.',
              '...Ii.......Ii..',
              '...I.........I..',
              '...i.........i..',
              '...I.........I..',
              '...i.........i..',
              '...I.........I..',
              '...i.........i..',
              '..III.......III.',
              '.I...I.....I...I',
              '.I...i.....I...i',
              '.i...i.....i...i',
              '..iii.......iii.',
            ], p);
            dots(c, p.u, [[4, 1], [13, 1]]);
          },
        ],
      ],
      floorWords: 'scorched flagstones black stone',
      floor,
      variants: [
        [
          'lava',
          'lava crack glowing fissure fire',
          (c) => {
            const path = [[1, 5], [2, 5], [3, 6], [4, 6], [5, 7], [6, 8], [7, 8], [8, 9], [9, 9], [10, 8], [11, 8], [12, 9], [13, 10], [14, 10]];
            for (const [x, y] of path) tint(c, x - 1, y - 2, x + 1, y + 2, p.e, 0.16);
            for (const [x, y] of path) {
              c.set(x, y - 1, p.g);
              c.set(x, y + 1, p.g);
            }
            dots(c, p.E, path);
            dots(c, p.y, [[5, 7], [6, 8], [7, 8], [8, 9], [11, 8]]);
            dots(c, p.e, [[6, 6], [6, 5], [7, 4], [10, 11], [10, 12]]);
          },
        ],
        [
          'bones',
          'strewn bones skull remains',
          (c) => {
            art(c, 2, 2, ['.bBb.', 'bBBBb', 'BkBkB', '.BBB.', '.nBn.'], p);
            art(c, 8, 5, ['b.....', 'nBb...', '..bBb.', '....bn', '.....b'], p);
            art(c, 3, 10, ['.bbbbb.', 'b.....b', '.bbbbb.', 'b.....b'], p);
            dots(c, p.n, [[12, 12], [13, 12], [12, 3]]);
          },
        ],
        [
          'sigil',
          'sigil circle scratched sign ritual mark glowing',
          (c) => {
            each(c, (x, y) => {
              const r = Math.hypot(x - 7.5, y - 7.5);
              return r > 5.4 && r < 6.5 ? p.g : null;
            });
            for (let i = 0; i <= 8; i++) {
              c.set(3 + i, 5, p.g);
              c.set(3 + Math.round(i / 2), 5 + i, p.g);
              c.set(12 - Math.round(i / 2), 5 + i, p.g);
            }
            dots(c, p.e, [[7, 13], [8, 13], [3, 5], [12, 5], [7, 5], [8, 5]]);
          },
        ],
        [
          'coals',
          'bed of coals embers glowing',
          (c) => {
            art(c, 2, 3, [
              '...uuuuuu...',
              '.uuugeuuguu.',
              'uugeuuEguueu',
              'uuuEyguueEuu',
              'ugeuuugEyguu',
              'uuuegEuuueuu',
              '.uEyuuegEuu.',
              '..uuuguuuu..',
            ], p);
            tint(c, 1, 2, 14, 11, p.e, 0.1);
          },
        ],
      ],
    });
  }

  /* ================= 6. medieval: a castle ================= */
  {
    const p = pal({
      k: '#0c0b0d',
      s: '#5f5e65', // castle stone
      S: '#6d6c72',
      t: '#525158',
      m: '#34333a',
      u: '#232228',
      g: '#465166', // sky in the slit
      G: '#63708a',
      i: '#28282e', // iron
      I: '#484853',
      w: '#57402f', // wood
      W: '#6e523a',
      c: '#1f1a17', // charred
      y: '#75653f',
      r: '#592430', // cloth
      R: '#71323a',
      o: '#8a7236',
      O: '#a48a48',
      n: '#28304c',
      N: '#364060',
      l: '#a0977c',
      e: '#7b7e86', // steel
      E: '#989ba2',
      h: '#414e2e', // moss
      H: '#55633a',
    });
    const fs = hex('#4c4741'),
      fsL = hex('#56514a'),
      fsD = hex('#44403b'),
      fj = hex('#2b2826'),
      ok = hex('#4c3a2a'),
      okL = hex('#58442f'),
      okD = hex('#3f3024'),
      og = hex('#291f19');
    const wall = (c) => {
      const courses = [[0, 4, [6, 15]], [5, 9, [3, 11]], [10, 15, [1, 9]]];
      each(c, (x, y) => {
        const ci = courses.findIndex((k) => y <= k[1]),
          [y0, y1, js] = courses[ci];
        if (y === y1 || js.includes(x)) return p.m;
        const n = js.filter((v) => v < x).length % js.length,
          k = (n + ci * 2) % 3;
        if (y === y0) return k === 1 ? p.s : p.S;
        return k === 0 ? p.s : k === 1 ? p.t : p.s;
      });
      dots(c, p.t, [[2, 2], [3, 2], [9, 3], [13, 7], [14, 7], [5, 12], [6, 13], [12, 13]]);
      dots(c, p.S, [[10, 1], [11, 2], [6, 6], [7, 7], [3, 12], [12, 11]]);
      dots(c, p.m, [[13, 2], [8, 8], [4, 14]]);
    };
    const floor = (c) => {
      fill(c, fs);
      c.row(15, 0, 15, fj);
      c.row(6, 0, 15, fj);
      c.col(9, 0, 5, fj);
      c.col(15, 0, 5, fj);
      c.col(4, 7, 14, fj);
      c.col(12, 7, 14, fj);
      c.row(10, 5, 11, fj);
      c.rect(10, 0, 14, 5, fsD);
      c.rect(5, 7, 11, 9, fsL);
      dots(c, fsL, [[2, 1], [3, 1], [1, 9], [14, 12], [7, 13]]);
      dots(c, fsD, [[5, 3], [6, 3], [7, 4], [0, 12], [1, 12], [8, 8], [9, 12], [13, 9]]);
      dots(c, fs, [[11, 2], [12, 3], [6, 8]]);
    };
    const boards = (c) => {
      fill(c, ok);
      c.row(4, 0, 15, og);
      c.row(10, 0, 15, og);
      c.row(15, 0, 15, og);
      c.col(6, 0, 3, og);
      c.col(12, 11, 14, og);
      c.col(2, 5, 9, og);
      c.row(0, 0, 15, okL);
      c.row(5, 0, 15, okL);
      c.row(11, 0, 15, okL);
      dots(c, og, [[6, 0], [2, 5], [12, 11]]);
      dots(c, okD, [[2, 2], [3, 2], [4, 2], [10, 2], [11, 2], [6, 7], [7, 7], [8, 8], [9, 8], [13, 7], [3, 13], [4, 13], [5, 13], [9, 12], [14, 13]]);
      dots(c, og, [[5, 1], [7, 2], [1, 7], [3, 8], [11, 13], [13, 12]]);
    };
    set('medieval', 'medieval castle keep old stone', {
      top: (c) => {
        fill(c, hex('#131215'));
        dots(c, hex('#1a191d'), [[2, 3], [3, 3], [4, 3], [10, 8], [11, 8], [6, 12], [7, 12], [13, 13]]);
        dots(c, hex('#0e0d10'), [[8, 2], [3, 9], [13, 5]]);
      },
      wallWords: 'rough grey stone blocks castle',
      wall,
      details: [
        [
          'arrow-slit',
          'arrow slit loophole narrow window embrasure',
          (c) => {
            art(c, 4, 1, [
              '..mmmm..',
              '.mtuutm.',
              '.mtuGtm.',
              '.mtuGtm.',
              '.mtuGtm.',
              'mtuuGGtm',
              'mtuGGgtm',
              'mtuugGtm',
              '.mtugtm.',
              '.mtugtm.',
              '.mtugtm.',
              '.mtugtm.',
              'mttuuttm',
              'mtttSttm',
              'mmmmmmmm',
            ], p);
          },
        ],
        [
          'torch',
          'wall torch bracket unlit iron sconce',
          (c) => {
            tint(c, 5, 0, 10, 3, p.k, 0.25);
            tint(c, 6, 0, 9, 2, p.k, 0.25);
            art(c, 4, 3, [
              '...ccc..',
              '..cycc..',
              '...cyc..',
              '..IiiiI.',
              '...iWi..',
              '....W...',
              '.ii.W...',
              '.iiIWI..',
              '.i..W...',
              '....w...',
              '....w...',
            ], p);
            c.col(9, 7, 13, p.t);
          },
        ],
        [
          'tapestry',
          'tapestry hanging cloth woven red gold',
          (c) => {
            art(c, 1, 1, [
              'iIIIIIIIIIIIIi',
              '..oOoOoOoOoO..',
              '..orRrrrrRro..',
              '..OrnnnnnnrO..',
              '..ornNOONnro..',
              '..OrnOllOnrO..',
              '..ornNOONnro..',
              '..OrnnOOnnrO..',
              '..ornnOnnnro..',
              '..OrnnnnnnrO..',
              '..orRrrrrRro..',
              '..oOoOoOoOoO..',
              '..o.o.o.o.o...',
            ], p);
            c.col(13, 3, 12, p.t);
          },
        ],
        [
          'shield',
          'shield crossed swords arms heraldry',
          (c) => {
            for (let i = 0; i <= 11; i++) {
              c.set(2 + i, 2 + i, i < 2 ? p.w : p.e);
              c.set(13 - i, 2 + i, i < 2 ? p.w : p.E);
            }
            dots(c, p.o, [[3, 5], [5, 3], [12, 5], [10, 3]]);
            art(c, 4, 4, [
              'OOOOOOOO',
              'OrrRnnNO',
              'OrrRnnNO',
              'OrrRnnNO',
              'OnnNrrRO',
              '.OnNrRO.',
              '.OnNrRO.',
              '..OOOO..',
              '...OO...',
            ], p);
          },
        ],
        [
          'moss',
          'moss damp green stain wet stone',
          (c) => {
            tint(c, 6, 0, 9, 15, p.u, 0.22);
            tint(c, 5, 6, 10, 15, p.u, 0.15);
            dots(c, p.h, [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [7, 4], [8, 4], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [5, 9], [9, 10], [9, 11], [9, 12], [8, 15], [9, 15], [10, 15], [11, 15], [7, 15], [3, 5], [3, 6]]);
            dots(c, p.H, [[1, 3], [2, 3], [7, 8], [8, 8], [9, 14], [10, 14], [4, 5], [8, 10]]);
            dots(c, p.h, [[2, 5], [6, 10], [10, 13]]);
          },
        ],
      ],
      floorWords: 'flagstones stone slabs',
      floor,
      variants: [
        [
          'rushes',
          'rushes strewn reeds green straw',
          (c) => {
            const a = hex('#66673a'),
              b = hex('#7a7845'),
              d = hex('#51542e');
            const stroke = (x, y, dx, dy, n, col) => {
              for (let i = 0; i < n; i++) c.set((x + Math.round(i * dx)) & 15, (y + Math.round(i * dy)) & 15, col);
            };
            stroke(1, 3, 1, 0.34, 7, a);
            stroke(6, 1, 1, -0.2, 6, d);
            stroke(9, 6, 1, 0.5, 6, b);
            stroke(2, 9, 1, -0.4, 6, d);
            stroke(4, 12, 1, 0.25, 8, a);
            stroke(10, 13, 1, -0.5, 5, b);
            stroke(12, 2, 0.4, 1, 5, a);
            stroke(0, 6, 1, 0.2, 4, b);
          },
        ],
        ['boards', 'oak boards planks wooden dark', boards, true],
        [
          'trapdoor',
          'trapdoor hatch iron ring oak',
          (c) => {
            boards(c);
            c.frame(1, 1, 14, 14, og);
            c.row(2, 2, 13, okL);
            c.col(2, 2, 13, okL);
            art(c, 2, 3, ['iI', 'ii'], p);
            art(c, 2, 11, ['iI', 'ii'], p);
            art(c, 9, 6, ['.II.', 'I..i', 'I..i', '.ii.'], p);
            dots(c, p.i, [[10, 5], [11, 5]]);
          },
          true,
        ],
        [
          'cracked',
          'cracked flagstone broken slab',
          (c) => {
            art(c, 1, 0, [
              '....j.......',
              '....j.......',
              '.....j......',
              '.....jj.....',
              '......j.....',
              '......j.....',
            ], { j: fj });
            art(c, 5, 10, ['......j', '....jj.', '..jj...', 'jj.....', 'j......'], { j: fj });
            dots(c, fsL, [[6, 0], [6, 1], [7, 2], [8, 4]]);
            dots(c, fj, [[13, 8], [14, 8], [13, 9]]);
          },
        ],
      ],
    });
  }

  return out;
};
