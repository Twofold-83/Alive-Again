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
              'WcgcgwwcgcgW',
              'WgGggwwgggGW',
              'WggggwwgGggW',
            ], p);
            c.row(9, 1, 14, p.W);
            c.row(10, 1, 14, p.D);
            c.col(14, 1, 8, p.z);
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
      jo = hex('#1c1214');
    const wall = (c) => {
      fill(c, p.r);
      dots(c, p.R, [[2, 2], [3, 2], [4, 3], [9, 6], [10, 6], [11, 7], [13, 12], [14, 12], [5, 13], [6, 13], [15, 1], [0, 1]]);
      dots(c, p.q, [[6, 4], [7, 4], [7, 5], [12, 2], [13, 2], [1, 8], [2, 8], [2, 9], [10, 13], [11, 13], [11, 14], [15, 7], [0, 7], [8, 10], [5, 0]]);
      dots(c, p.u, [[7, 6], [13, 3], [3, 10], [11, 15]]);
      dots(c, p.g, [[4, 6], [5, 7], [6, 7]]);
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
      m: '#3b3a41',
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
      dots(c, p.t, [[2, 2], [3, 2], [13, 7], [14, 7], [5, 13], [6, 13]]);
      dots(c, p.S, [[10, 2], [11, 2], [6, 7], [12, 12]]);
      dots(c, p.m, [[13, 3], [4, 14]]);
    };
    const floor = (c) => {
      fill(c, fs);
      c.row(15, 0, 15, fj);
      c.row(5, 0, 15, fj);
      c.col(11, 0, 4, fj);
      c.col(4, 6, 14, fj);
      c.col(12, 6, 14, fj);
      c.row(0, 0, 10, fsL);
      c.row(6, 5, 11, fsL);
      dots(c, fsL, [[2, 2], [14, 9], [1, 12]]);
      dots(c, fsD, [[5, 3], [6, 3], [13, 2], [0, 12], [1, 13], [8, 9], [9, 12], [10, 12], [14, 13]]);
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
            art(c, 3, 0, [
              '...mmmm...',
              '..mtuutm..',
              '..mtuGum..',
              '..mtGGum..',
              '..mtGGum..',
              '.mtuGGuum.',
              '.mtGGGGum.',
              '.mtuGguum.',
              '..mtGgum..',
              '..mtggum..',
              '..mtggum..',
              '..mtggum..',
              '..mtgguum.',
              '.mttuuutm.',
              '.mtSSSStm.',
              '.mmmmmmmm.',
            ], p);
          },
        ],
        [
          'torch',
          'wall torch bracket unlit iron sconce',
          (c) => {
            tint(c, 5, 0, 10, 2, p.k, 0.3);
            tint(c, 6, 0, 9, 1, p.k, 0.3);
            art(c, 4, 2, [
              '..cccc..',
              '.cycycc.',
              '.ccyccc.',
              '..cccc..',
              '.IiiiiI.',
              '..iWwi..',
              '...Ww...',
              'II.Ww...',
              'iiIWwI..',
              'ii.Ww...',
              '...Ww...',
              '...Ww...',
              '...ww...',
            ], p);
            c.col(9, 8, 14, p.t);
            c.col(10, 4, 5, p.t);
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
            art(c, 5, 6, ['...j...', '...j...', '..j....', '..jj...', '...j...', '....j..', '....jj.', '.....j.', '.....j.'], { j: fj });
            dots(c, fsL, [[9, 6], [9, 7], [8, 8], [10, 11]]);
            art(c, 0, 0, ['jj.', 'j..'], { j: fj });
            dots(c, fj, [[14, 3], [15, 3], [15, 4]]);
          },
        ],
      ],
    });
  }

  /* ================= 7. dreamscape: a room made of sky ================= */
  {
    const p = pal({
      k: '#32335a',
      A: '#9c9ec2', // the sky of the wall, from pale to deep
      a: '#8b8db5',
      b: '#7d80a9',
      L: '#adaecd',
      f: '#544e72', // a frame
      F: '#6c668e',
      n: '#1b1d3c', // night
      N: '#272a52',
      s: '#c9c8b0',
      S: '#7c7ea6',
      W: '#c4c4d8', // a chalk line
      y: '#b39a62',
      m: '#c6bca6', // a pale sun
      M: '#d6cdb6',
      o: '#b39a96',
      w: '#b3a88e', // a ladder
      v: '#877d70',
      c: '#a9abca', // cloud
      C: '#bcbdd6',
    });
    const fl = hex('#6c6f98'),
      flL = hex('#787ba3'),
      flH = hex('#8587ae'),
      flD = hex('#62658c');
    const level = [0, 0, 1, 2, 2, 3, 4, 4, 4, 4, 3, 2, 2, 1, 0, 0];
    const wall = (c) =>
      each(c, (x, y) => {
        const l = level[y],
          odd = (x + y) % 2;
        return l === 0 ? p.A : l === 1 ? (odd ? p.A : p.a) : l === 2 ? p.a : l === 3 ? (odd ? p.a : p.b) : p.b;
      });
    const floor = (c) => {
      fill(c, fl);
      const puff = (x, y) => {
        const P = { h: flL, H: flH, s: flD };
        ['..hhh...', '.hHHHhh.', 'hHHHHHHh', '.ssssss.'].forEach((l, j) => {
          for (let i = 0; i < l.length; i++) if (P[l[i]]) c.set((x + i) & 15, (y + j) & 15, P[l[i]]);
        });
      };
      puff(1, 1);
      puff(9, 6);
      puff(3, 11);
      dots(c, flL, [[12, 1], [13, 1], [1, 7], [2, 7], [13, 13], [14, 13]]);
    };
    set('dreamscape', 'dreamscape dream sky pale', {
      topWords: 'deep violet dusk surround edge of the dream',
      top: (c) => {
        fill(c, hex('#1c1b31'));
        dots(c, hex('#24233d'), [[2, 5], [3, 5], [4, 5], [9, 11], [10, 11], [11, 11], [12, 2], [13, 2]]);
        dots(c, hex('#3a3a5c'), [[7, 8]]);
      },
      wallWords: 'pale blue violet sky fading',
      wall,
      details: [
        [
          'window',
          'window onto stars night sky frame',
          (c) => {
            art(c, 3, 2, [
              'FFFFFFFFFF',
              'FnnnnFnnnf',
              'FnsnnFnNnf',
              'FnnnNFnnsf',
              'FnNnnFnnnf',
              'FFFFFFFFFf',
              'FnnnSFnsnf',
              'FnNnnFnnnf',
              'FnnsnFnNnf',
              'FnnnnFnnSf',
              'Ffffffffff',
            ], p);
            c.row(13, 2, 13, p.F);
            c.row(14, 3, 12, p.b);
          },
        ],
        [
          'door',
          'door shaped outline drawn chalk line doorway',
          (c) => {
            tint(c, 5, 2, 10, 15, p.L, 0.3);
            c.col(4, 1, 15, p.W);
            c.col(11, 1, 15, p.W);
            c.row(1, 4, 11, p.W);
            dots(c, p.y, [[9, 9]]);
            dots(c, p.a, [[4, 6], [11, 11], [7, 1]]);
          },
        ],
        [
          'sun',
          'pale sun low disc haze',
          (c) => {
            tint(c, 2, 1, 13, 12, p.M, 0.14);
            c.oval(4, 2, 11, 9, p.m);
            art(c, 4, 2, ['..MMMM..', '.MMMMMM.', 'MMMMMMmm', 'MMMMMmmm', 'MMMMmmmm'], p);
            c.oval(4, 2, 11, 9, null);
            dots(c, p.o, [[10, 8], [9, 9], [8, 9], [11, 6], [11, 7]]);
            c.row(7, 6, 13, p.A);
            c.row(11, 2, 9, p.A);
          },
        ],
        [
          'birds',
          'birds flock flying far away',
          (c) => {
            const bird = (x, y) => art(c, x, y, ['k.k', '.k.'], p);
            bird(2, 9);
            bird(5, 6);
            bird(9, 4);
            bird(12, 7);
            bird(7, 11);
            dots(c, p.k, [[13, 2], [14, 2]]);
          },
        ],
        [
          'ladder',
          'ladder up into a cloud floating',
          (c) => {
            for (let y = 3; y <= 13; y++) {
              c.set(5, y, p.w);
              c.set(10, y, p.v);
              if (y % 3 === 2) c.row(y, 6, 9, p.w);
            }
            art(c, 1, 0, [
              '....cCCCc.....',
              '..cCCCCCCCcc..',
              '.cCCCCCCCCCCc.',
              'cccccccccccccc',
              '..bbbbbbbbbb..',
            ], p);
            dots(c, p.b, [[5, 14], [10, 14]]);
          },
        ],
      ],
      floorWords: 'cloud soft blue violet',
      floor,
      variants: [
        [
          'chequer',
          'chequer checkerboard drifting wavy squares',
          (c) =>
            each(c, (x, y) => {
              const xx = x + Math.round(Math.sin((y / 16) * Math.PI * 2) * 1.6) + 16,
                yy = y + Math.round(Math.sin((x / 16) * Math.PI * 2) * 1.6) + 16;
              return ((xx >> 3) + (yy >> 3)) % 2 ? hex('#5d5f88') : hex('#7b7da5');
            }),
          true,
        ],
        [
          'pool',
          'pool of night moon reflection water',
          (c) => {
            c.oval(1, 3, 14, 12, flD);
            c.oval(2, 4, 13, 11, p.n);
            art(c, 6, 5, ['.ss.', 's...', 's...', '.ss.'], p);
            dots(c, p.S, [[4, 7], [11, 6], [10, 9]]);
            dots(c, p.N, [[5, 10], [6, 10], [7, 10], [9, 5], [10, 5]]);
          },
        ],
        [
          'feathers',
          'feathers white fallen',
          (c) => {
            const q = { w: hex('#b6b6ca'), W: hex('#9799ba'), d: flD };
            art(c, 2, 2, ['..ww.', '.wwW.', 'wwW..', 'dW...', 'd....'], q);
            art(c, 9, 7, ['ww...', 'WwwW.', '.WwwW', '...dd'], q);
            art(c, 4, 11, ['.ww', 'wW.', 'd..'], q);
          },
        ],
        [
          'steps',
          'steps going down stairs opening descent',
          (c) => {
            c.rect(3, 2, 12, 13, p.n);
            const st = [hex('#9d9fc0'), hex('#8082a8'), hex('#62648c'), hex('#474a74'), hex('#30325a')];
            st.forEach((col, i) => {
              c.rect(4 + (i > 2 ? 1 : 0), 3 + i * 2, 11 - (i > 2 ? 1 : 0), 4 + i * 2, col);
              c.row(4 + i * 2, 4 + (i > 2 ? 1 : 0), 11 - (i > 2 ? 1 : 0), mix(col, 0.8));
            });
            c.row(2, 3, 12, flH);
            c.col(3, 3, 13, flD);
            c.col(12, 3, 13, flD);
          },
        ],
      ],
    });
  }

  /* ================= 8. surreal ================= */
  {
    const p = pal({
      k: '#100e12',
      t: '#7b5843', // terracotta plaster
      T: '#886450',
      d: '#694937',
      u: '#4f372c',
      w: '#b1aa92', // the white of an eye
      W: '#c5bea5',
      i: '#56788a', // sky
      I: '#7f9eaa',
      c: '#b9bfb8',
      n: '#1b1d3c', // night
      s: '#c9c8b0',
      b: '#8a7236', // brass
      B: '#a68c48',
      f: '#aaa084', // a clock face
      F: '#beb498',
      g: '#737076', // stone steps
      G: '#96939a',
      h: '#555560',
      a: '#2c5052', // a green evening
      A: '#3d6462',
      y: '#b39a5e',
      Y: '#cdb878',
    });
    const sa = hex('#76674b'),
      saL = hex('#827357'),
      saD = hex('#695b42'),
      sh = hex('#4d4232');
    const wall = (c) => {
      fill(c, p.t);
      c.row(15, 0, 15, p.d);
      dots(c, p.T, [[2, 3], [3, 3], [4, 4], [10, 7], [11, 7], [13, 11], [6, 12], [7, 12]]);
      dots(c, p.d, [[8, 2], [9, 2], [1, 9], [12, 4], [4, 13], [14, 13]]);
    };
    const floor = (c) => {
      fill(c, sa);
      for (let x = 0; x < 16; x++) {
        const w = Math.round(Math.sin((x / 16) * Math.PI * 2) * 1.3);
        if (x % 8 < 6) c.set(x, 3 + w, saL);
        if ((x + 3) % 8 < 5) c.set(x, 4 + w, saD);
        if ((x + 4) % 8 < 6) c.set(x, 11 - w, saL);
        if ((x + 7) % 8 < 5) c.set(x, 12 - w, saD);
      }
      dots(c, saD, [[6, 7], [13, 8], [2, 15]]);
      dots(c, saL, [[10, 0], [3, 8]]);
    };
    set('surreal', 'surreal strange painting impossible', {
      top: (c) => {
        fill(c, hex('#161217'));
        dots(c, hex('#1e181e'), [[3, 3], [4, 4], [5, 5], [10, 9], [11, 10], [12, 11]]);
        dots(c, hex('#2a2024'), [[13, 3]]);
      },
      wallWords: 'terracotta plaster orange brown',
      wall,
      details: [
        [
          'eye',
          'eye with sky in it watching tear',
          (c) => {
            art(c, 1, 2, [
              '..u..u..u..u..',
              '...u.u..u.u...',
              '....uuuuuu....',
              '..uuwWWWWwuu..',
              '.uwWWiIIiWWwu.',
              'uwWWiIkkciWWwu',
              'uwwWiikkiiWwwu',
              '.uwwwiiiiwwwu.',
              '..uuwwwwwwuu..',
              '....uuuuuu....',
              '.......I......',
              '......II......',
              '......Ic......',
            ], p);
            dots(c, p.d, [[2, 13], [13, 13]]);
          },
        ],
        [
          'keyhole',
          'keyhole giant stars through it opening',
          (c) => {
            c.oval(4, 1, 11, 8, p.u);
            c.poly([[6, 7], [9, 7], [11, 14], [4, 14]], p.u);
            c.oval(5, 2, 10, 7, p.n);
            c.poly([[7, 7], [8, 7], [10, 13], [5, 13]], p.n);
            dots(c, p.s, [[7, 3], [9, 5], [6, 11], [8, 9]]);
            dots(c, hex('#7c7ea6'), [[6, 5], [8, 12], [7, 8], [9, 12]]);
            dots(c, p.T, [[3, 3], [3, 4], [3, 5], [4, 2], [3, 13], [4, 10], [4, 11]]);
            c.row(15, 5, 10, p.y);
          },
        ],
        [
          'clock',
          'melting clock soft watch drooping over a ledge',
          (c) =>
            art(c, 0, 1, [
              '....bbbbbb......',
              '..bbFFFFFFbb....',
              '.bFFFkFFFFFFb...',
              '.bFFFFkFFFkFb...',
              '.bFFFFFkkkFFFb..',
              'TTTTTTTTbFFFFb..',
              'ddddddddubFFfb..',
              'uuuuuuuu.bFffb..',
              '.........bFffb..',
              '..........bFfb..',
              '..........bffb..',
              '..........bfb...',
              '...........bb...',
              '...........b....',
            ], p),
        ],
        [
          'stairs',
          'stairs wrong perspective impossible upside down',
          (c) => {
            for (let k = 0; k < 4; k++) {
              c.rect(1 + k * 3, 14 - k * 2, 13, 15 - k * 2, p.g);
              c.row(14 - k * 2, 1 + k * 3, 3 + k * 3, p.G);
              c.set(1 + k * 3, 15 - k * 2, p.h);
              c.rect(2, k * 2, 14 - k * 3, 1 + k * 2, p.h);
              c.row(1 + k * 2, 12 - k * 3, 14 - k * 3, p.G);
            }
            c.col(13, 8, 15, p.h);
            c.col(2, 0, 7, p.g);
            c.rect(11, 9, 12, 12, p.k);
            dots(c, p.y, [[12, 11]]);
            c.rect(3, 3, 4, 6, p.k);
          },
        ],
        [
          'arch',
          'arch opening green evening long shadow tower',
          (c) => {
            c.oval(3, 1, 12, 10, p.u);
            c.rect(3, 6, 12, 15, p.u);
            c.oval(4, 2, 11, 10, p.a);
            c.rect(4, 6, 11, 15, p.a);
            c.rect(4, 10, 11, 10, p.A);
            c.rect(4, 11, 11, 12, p.y);
            c.row(11, 4, 11, p.A);
            c.rect(4, 13, 11, 15, sa);
            dots(c, p.Y, [[5, 12], [6, 12]]);
            c.rect(9, 7, 9, 12, p.k);
            dots(c, p.k, [[9, 6], [10, 8]]);
            for (let i = 0; i < 5; i++) c.set(9 - i, 13 + Math.round(i / 2), sh);
            c.col(3, 3, 15, p.T);
            dots(c, p.T, [[4, 2], [5, 1]]);
          },
        ],
      ],
      floorWords: 'sand ripples desert',
      floor,
      variants: [
        [
          'keys',
          'piano keys keyboard black white',
          (c) => {
            each(c, (x, y) => (y === 15 || x % 4 === 3 ? hex('#4c4a42') : x % 4 === 0 ? hex('#96927f') : hex('#89857a')));
            for (const x of [3, 7, 15]) for (let y = 0; y <= 8; y++) for (let i = -1; i <= 1; i++) c.set((x + i + 16) % 16, y, i === -1 && y < 8 ? hex('#34313a') : hex('#1e1b24'));
          },
          true,
        ],
        [
          'sky',
          'sky floor blue clouds',
          (c) => {
            fill(c, hex('#506a78'));
            dots(c, hex('#587382'), [[2, 2], [3, 2], [12, 13], [13, 13], [6, 14]]);
            art(c, 1, 4, ['.....ccc......', '...ccCCCcc....', '.ccCCCCCCCccc.', 'cccccccccccccc', '..dddddddddd..'], { c: hex('#7d9399'), C: hex('#93a6aa'), d: hex('#465f6c') });
            art(c, 9, 11, ['.cc..', 'ccccc', '.ddd.'], { c: hex('#7d9399'), d: hex('#465f6c') });
          },
          true,
        ],
        [
          'shadow',
          'long shadow of someone who is not there',
          (c) => {
            art(c, 2, 0, [
              '.........ss.',
              '........ssss',
              '.........ss.',
              '.......ssss.',
              '......sssss.',
              '......sssss.',
              '.....ssss.s.',
              '.....ssss...',
              '....ssss....',
              '....ss.ss...',
              '...ss..ss...',
              '...ss...ss..',
              '..ss....ss..',
              '..ss.....ss.',
              '.ss......ss.',
              '.ss.......ss',
            ], { s: sh });
          },
        ],
        [
          'footprints',
          'bare footprints that stop',
          (c) => {
            const q = { s: hex('#5f523c'), S: hex('#54472f') };
            art(c, 3, 9, ['s.s.', '.SS.', '.SS.', '.SS.', '..S.'], q);
            art(c, 8, 4, ['.s.s', '.SS.', '.SS.', '.SS.', '.S..'], q);
            dots(c, q.s, [[5, 9], [8, 4]]);
          },
        ],
      ],
    });
  }

  /* ================= 9. nightmare ================= */
  {
    const p = pal({
      k: '#060506',
      m: '#3b2530', // dark flesh
      M: '#48303a',
      q: '#2d1b25',
      v: '#2b2440',
      w: '#766f5b', // what is left of the wallpaper
      W: '#87806a',
      z: '#5c5749',
      b: '#a39a86', // nails, teeth
      B: '#b8af98',
      n: '#7a7263',
      x: '#671a1d', // old blood
      X: '#84292a',
      g: '#673340', // gums
      G: '#7d4450',
      e: '#a6a08e',
      i: '#6a2a22',
    });
    const bo = hex('#1e1c23'),
      boL = hex('#2b2a34'),
      wet = hex('#3d3e4e'),
      gap = hex('#0e0d11');
    const wall = (c) => {
      each(c, (x, y) => {
        const xx = (x + Math.round(Math.sin((y / 16) * Math.PI * 2) * 1.1) + 16) % 16;
        return xx === 2 || xx === 7 || xx === 12 ? p.M : xx === 4 || xx === 10 || xx === 15 ? p.q : p.m;
      });
      dots(c, p.v, [[5, 3], [5, 4], [6, 5], [13, 10], [13, 11]]);
      dots(c, p.m, [[2, 6], [7, 13], [12, 2], [12, 3]]);
    };
    const floor = (c) => {
      fill(c, bo);
      c.row(7, 0, 15, gap);
      c.row(15, 0, 15, gap);
      c.col(10, 0, 6, gap);
      c.col(4, 8, 14, gap);
      dots(c, boL, [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [12, 4], [13, 4], [14, 4], [6, 10], [7, 10], [8, 10], [9, 10], [12, 12], [13, 12], [0, 13], [1, 13]]);
      dots(c, wet, [[3, 1], [13, 4], [8, 10]]);
    };
    set('nightmare', 'nightmare bad dream horror dark', {
      top: (c) => {
        fill(c, hex('#0c090b'));
        dots(c, hex('#140e12'), [[3, 2], [3, 3], [3, 4], [9, 8], [9, 9], [9, 10], [13, 13], [13, 14]]);
        dots(c, hex('#1d1319'), [[6, 12]]);
      },
      wallWords: 'dark flesh sinew purple',
      wall,
      details: [
        [
          'peeling',
          'wallpaper peeling torn old paper over flesh',
          (c) =>
            art(c, 0, 0, [
              '.wwWwwwWwwwWww..',
              '.wzWwwzWwwzWww..',
              '.wwWwwwWwwwWwww.',
              '.wwWwwwW..wWwww.',
              '..wWwww....Wwww.',
              '.wwWww......www.',
              '.wzWw.......zww.',
              '.wwWw........ww.',
              '.wwWBB.......ww.',
              '..wWBBB......w..',
              '.wwWwBBB....ww..',
              '.wzWwwBBn...zw..',
              '.wwWwwwnn..www..',
              '..wWwww...wWww..',
              '.wwW.ww..wwWw...',
              '..w...w...wW....',
            ], p),
        ],
        [
          'scratches',
          'scratches claw marks gouged',
          (c) => {
            for (let s = 0; s < 4; s++)
              for (let i = 0; i < 11 - s; i++) {
                const x = 13 - s * 3 - Math.round(i * 0.45) + (s === 0 ? 1 : 0),
                  y = 2 + s + i;
                c.set(x, y, i < 2 || i > 8 - s ? p.x : p.k);
                c.set(x + 1, y, p.X);
              }
            dots(c, p.x, [[2, 15], [6, 15], [9, 14]]);
          },
        ],
        [
          'handprint',
          'hand print pale ash smeared',
          (c) => {
            art(c, 3, 1, [
              '...b.b.b..',
              '...b.b.b.b',
              '...b.b.b.b',
              '.b.bnbnb.b',
              '.bnbbbbbnb',
              '..bbbbbbbb',
              '...bbnbbb.',
              '...nbbbbn.',
              '....nbbn..',
              '....n..n..',
              '....n..n..',
              '.......n..',
            ], p);
            dots(c, p.n, [[7, 14], [10, 14]]);
          },
        ],
        [
          'teeth',
          'teeth mouth in the wall gums',
          (c) =>
            art(c, 0, 3, [
              '....gggggggg....',
              '..ggGGGGGGGGgg..',
              '.gGBbBbBbBbBbGg.',
              '.gkBkBkBkBkBkkg.',
              'gkkkkkkkkkkkkkkg',
              '.gkbkbkbkbkbkkg.',
              '.gGbBbBbBbBbBGg.',
              '..ggGGGGGGGGgg..',
              '....gggggggg....',
            ], p),
        ],
        [
          'hole',
          'hole in the wall eye looking through dark opening',
          (c) => {
            art(c, 1, 1, [
              '.....MMM......',
              '...MMkkkMM.M..',
              '..MkkkkkkkMkM.',
              '.Mkkkkkkkkkkq.',
              '.Mkkkkkkkkkkq.',
              'MkkkkeeeekkkkM',
              'MkkkeeikeekkkM',
              '.MkkkeeeekkkM.',
              '.Mkkkkkkkkkkq.',
              '..qkkkkkkkkq..',
              '..qkkkkkkqq...',
              '...qqkkkq.....',
              '.....qqq......',
            ], p);
            dots(c, p.q, [[4, 14], [9, 14], [10, 15]]);
          },
        ],
      ],
      floorWords: 'wet black boards narrow planks',
      floor,
      variants: [
        [
          'hair',
          'hair long black wet clump strands',
          (c) => {
            const h = { h: hex('#4a4046'), H: hex('#62565c'), k: p.k };
            art(c, 0, 1, [
              '................',
              '...hhh..........',
              '..hHhhhh........',
              '.hhHhhHhhh......',
              '.hHhhHhhHhhh....',
              '..hhHhhhhHhhhh..',
              '..h.hhHhhhhHhhh.',
              '.h..h.hhHhh.hhHh',
              '.h.h...h.hhh..hh',
              'h..h..h....hh...',
              '..h...h......h..',
              '......h.........',
            ], h);
          },
        ],
        [
          'eyes',
          'eyes in the dark between the boards watching',
          (c) => {
            c.rect(1, 5, 14, 9, p.k);
            c.row(5, 1, 3, gap);
            c.row(9, 11, 14, gap);
            dots(c, bo, [[1, 5], [14, 9], [14, 5]]);
            art(c, 3, 6, ['e.e', 'k.k'], p);
            art(c, 9, 7, ['e.e'], p);
            dots(c, p.i, [[12, 6]]);
          },
        ],
        [
          'drag',
          'drag marks blood smear streaks',
          (c) => {
            art(c, 0, 4, [
              '..xx............',
              '.xXXxxx.....xx..',
              '..xxXXXxxxxxXXx.',
              '....xxxXXXXxxx..',
              '.xx.....xxx.....',
              '..xXxx..........',
              '...xxXXxxx..xx..',
              '......xxxXXxx...',
            ], p);
            for (const y of [7, 11]) for (let x = 0; x < 16; x++) if (c.get(x, y) === p.x || c.get(x, y) === p.X) c.set(x, y, hex('#3a0f12'));
          },
        ],
        [
          'pool',
          'black water pool pale face under it',
          (c) => {
            c.oval(1, 3, 14, 12, boL);
            c.oval(2, 4, 13, 11, p.k);
            art(c, 5, 5, ['.nnnn.', 'nknnkn', 'nnnnnn', '.nkkn.', '..nn..'], { n: hex('#5a5652'), k: p.k });
            dots(c, wet, [[3, 6], [4, 5], [11, 10], [12, 9]]);
          },
        ],
      ],
    });
  }

  /* ================= 10. gothic: a dark church, a crypt ================= */
  {
    const p = pal({
      k: '#08080b',
      s: '#3a3a48', // dressed stone
      S: '#474757',
      t: '#30303c',
      m: '#22222b',
      u: '#16161c',
      c: '#56566a', // carved, catching the light
      C: '#6b6b80',
      r: '#5a2030', // old glass
      b: '#26406a',
      g: '#2c4e3c',
      y: '#8a7034',
      l: '#0f0f13',
      p: '#878490', // pale marble
      P: '#9d9aa6',
      q: '#615f6b',
      i: '#2a2a31',
      I: '#494953',
    });
    const dk = hex('#25252d'),
      dkL = hex('#2e2e38'),
      pl = hex('#52505b'),
      plD = hex('#474550'),
      sl = hex('#484852'),
      slL = hex('#54545f'),
      slD = hex('#3a3a44'),
      jo = hex('#1b1b21');
    const wall = (c) => {
      fill(c, p.s);
      c.row(7, 0, 15, p.m);
      c.row(15, 0, 15, p.m);
      c.col(7, 0, 6, p.m);
      c.col(15, 8, 14, p.m);
      c.row(0, 0, 6, p.S);
      c.row(0, 8, 15, p.S);
      c.row(8, 0, 14, p.S);
      dots(c, p.t, [[3, 3], [4, 3], [11, 4], [12, 5], [5, 11], [6, 12], [12, 12], [1, 13]]);
      dots(c, p.S, [[10, 2], [2, 10]]);
    };
    const floor = (c) => {
      each(c, (x, y) => ((((x + y) >> 3) + ((x - y + 16) >> 3)) % 2 ? dk : pl));
      const q = (x, y, a, b) => c.set(x, y, c.get(x, y) === dk ? a : b);
      for (const [x, y] of [[2, 7], [3, 8], [12, 3], [13, 3], [8, 13], [9, 14], [5, 1]]) q(x, y, dkL, plD);
    };
    const slab = (c) => {
      fill(c, sl);
      c.frame(0, 0, 15, 15, jo);
      c.row(1, 1, 14, slL);
      c.col(1, 1, 14, slL);
      c.frame(2, 2, 13, 13, slD);
      dots(c, slL, [[5, 12], [6, 12], [10, 4]]);
    };
    set('gothic', 'gothic church crypt cathedral dark', {
      topWords: 'dark vault shadow surround',
      top: (c) => {
        fill(c, hex('#0e0e13'));
        dots(c, hex('#15151b'), [[2, 4], [3, 3], [4, 2], [11, 12], [12, 11], [13, 10], [8, 8]]);
        dots(c, hex('#1c1c24'), [[5, 13]]);
      },
      wallWords: 'dark carved stone ashlar blocks',
      wall,
      details: [
        [
          'arcade',
          'blind arcade pointed arches arcading columns',
          (c) => {
            for (const ox of [0, 8]) {
              for (let y = 2; y <= 13; y++) {
                const w = y < 6 ? y - 2 : 3;
                for (let x = ox + 4 - w; x <= ox + 4 + w; x++) c.set(x, y, x === ox + 4 - w || y === 2 ? p.u : p.t);
                if (y < 6) {
                  c.set(ox + 3 - w, y, p.C);
                  c.set(ox + 5 + w, y, p.c);
                }
              }
              c.set(ox + 4, 1, p.C);
              c.col(ox, 6, 13, p.c);
              c.set(ox, 6, p.C);
              c.set(ox, 13, p.C);
            }
            c.row(14, 0, 15, p.S);
            dots(c, p.u, [[4, 2], [12, 2]]);
          },
        ],
        [
          'lancet',
          'stained glass lancet window pointed dim coloured',
          (c) => {
            const cols = [p.r, p.b, p.y, p.g];
            for (let y = 1; y <= 13; y++) {
              const w = y < 4 ? y : 4;
              for (let x = 8 - w; x <= 7 + w; x++) {
                const edge = x === 8 - w || x === 7 + w || y === 1;
                c.set(x, y, edge ? (x < 8 ? p.C : p.m) : y % 3 === 1 || x === 7 ? p.l : cols[(((x - 4) >> 1) + Math.floor(y / 3) * 3) % 4]);
              }
            }
            dots(c, p.C, [[7, 0], [8, 0]]);
            dots(c, p.y, [[8, 3]]);
            dots(c, hex('#3a5a8a'), [[5, 6], [9, 9]]);
            dots(c, hex('#7a3040'), [[9, 5], [5, 11]]);
            c.row(14, 3, 12, p.C);
            c.row(15, 4, 11, p.m);
          },
        ],
        [
          'gargoyle',
          'gargoyle corbel carved stone head grotesque',
          (c) =>
            art(c, 2, 1, [
              'C.........C.',
              'CC.......Cc.',
              'cCCCCCCCCCc.',
              'CCuCCCCuCct.',
              'CcyuCccuycu.',
              '.CccCccccu..',
              '.CcuuuuuCt..',
              '.CuPkkPutu..',
              '..cuuuuuu...',
              '..CcccctU...',
              '...Cccct....',
              '....Cct.....',
              '.....tu.....',
            ], { ...p, U: p.u }),
        ],
        [
          'plaque',
          'memorial tablet plaque marble inscription skull',
          (c) => {
            art(c, 3, 2, [
              '....pp....',
              '..pPPPPp..',
              'pPPPPPPPPq',
              'pPPqPPqPPq',
              'pPPPqqPPPq',
              'pPqqqqqqPq',
              'pPPPPPPPPq',
              'pPqqqqqPPq',
              'pPPPPPPPPq',
              'pPqqqqqqPq',
              'pPPqqqPPPq',
              'qqqqqqqqqq',
            ], p);
            c.col(13, 5, 14, p.t);
            c.row(14, 4, 12, p.t);
          },
        ],
        [
          'niche',
          'niche statue hooded saint figure',
          (c) => {
            for (let y = 1; y <= 13; y++) {
              const w = y < 4 ? y : 4;
              for (let x = 8 - w; x <= 7 + w; x++) c.set(x, y, x === 8 - w || y === 1 ? p.k : p.u);
              c.set(7 - w, y, p.C);
              c.set(8 + w, y, p.t);
            }
            art(c, 5, 3, [
              '..cC..',
              '.cCCc.',
              '.cuuc.',
              '.cCCc.',
              'cCCCCc',
              'cCccCc',
              'cCCCCc',
              'cCcCCc',
              'cCcCCc',
              'cccccc',
            ], p);
            c.row(13, 4, 11, p.c);
            c.row(14, 3, 12, p.C);
          },
        ],
      ],
      floorWords: 'black and white marble diamonds chequer',
      floor,
      variants: [
        [
          'tomb',
          'tomb slab worn ledger stone cross grave',
          (c) => {
            slab(c);
            c.col(7, 4, 11, slD);
            c.col(8, 4, 11, jo);
            c.row(6, 5, 10, slD);
            c.row(7, 5, 10, jo);
            dots(c, sl, [[8, 9], [8, 10], [9, 7]]);
            dots(c, slD, [[4, 12], [5, 12], [10, 12], [11, 12]]);
          },
          true,
        ],
        [
          'skull',
          'tomb slab deaths head skull and crossbones',
          (c) => {
            slab(c);
            art(c, 4, 3, ['..jjjj..', '.jddddj.', '.jjdjjd.', '.jddddj.', '..jdjd..', 'j..jj..j', '.jj..jj.', '..jjjj..', '.jj..jj.', 'j......j'], { j: jo, d: slD });
          },
          true,
        ],
        [
          'crack',
          'cracked marble broken',
          (c) => {
            art(c, 2, 1, [
              '......j.....',
              '.....j......',
              '.....jj.....',
              '......j.....',
              '.....j......',
              '....jj......',
              '...j.jjj....',
              '..j.....jj..',
              '.j........j.',
              '..........j.',
              '...........j',
            ], { j: jo });
            dots(c, plD, [[9, 2], [8, 6], [6, 9]]);
          },
        ],
        [
          'grate',
          'crypt grating iron grille vent',
          (c) => {
            c.rect(2, 2, 13, 13, p.k);
            c.frame(2, 2, 13, 13, p.i);
            c.row(2, 2, 13, p.I);
            for (const v of [5, 8, 11]) {
              c.col(v, 3, 12, p.i);
              c.row(v, 3, 12, p.i);
            }
            dots(c, p.I, [[5, 5], [8, 5], [11, 5], [5, 8], [8, 8], [11, 8], [5, 11], [8, 11], [11, 11]]);
          },
        ],
      ],
    });
  }

  /* ================= 11. apothecary ================= */
  {
    const p = pal({
      k: '#0c0a09',
      d: '#2a211c', // the back of the shelves
      D: '#33281f',
      w: '#5b432e', // shelf wood
      W: '#74573a',
      v: '#1c1512',
      c: '#989079', // glazed jars
      C: '#aea58c',
      n: '#726b5b',
      l: '#b8af95', // labels
      i: '#3a342c',
      b: '#46587a',
      g: '#3d5846', // green glass
      G: '#5a7a62',
      a: '#74501f', // amber glass
      A: '#96692f',
      u: '#32466a', // blue glass
      U: '#4e668c',
      o: '#886a46', // cork
      y: '#8a7236', // brass
      Y: '#ab9048',
      h: '#49583a', // herbs
      H: '#62724a',
      q: '#584a68',
      Q: '#6e5e80',
      r: '#775638',
      t: '#8a7a56',
    });
    const ta = hex('#4f3b32'),
      tb = hex('#48352e'),
      tj = hex('#30231f'),
      tL = hex('#594339'),
      sb = hex('#63533d'),
      sbL = hex('#6f5e46'),
      sbG = hex('#40342a'),
      dust = hex('#8c7c58');
    const wall = (c) => {
      each(c, (x, y) => (y === 12 ? p.W : y === 13 ? p.w : y === 14 || y === 0 ? p.v : x % 8 === 7 ? p.v : p.d));
      dots(c, p.D, [[2, 3], [2, 4], [2, 5], [11, 7], [11, 8], [5, 9], [13, 2]]);
      dots(c, p.v, [[4, 13], [12, 13]]);
      c.row(1, 0, 15, hex('#231b17'));
      dots(c, p.v, [[7, 1], [15, 1]]);
    };
    const floor = (c) => {
      each(c, (x, y) => (x % 8 === 7 || y % 8 === 7 ? tj : ((x >> 3) + (y >> 3)) % 2 ? ta : tb));
      dots(c, tL, [[1, 0], [2, 0], [9, 8], [10, 8], [12, 2], [3, 11]]);
      dots(c, tj, [[5, 4], [13, 12], [8, 3]]);
      dots(c, tb, [[3, 3], [12, 11]]);
    };
    const boards = (c) => {
      fill(c, sb);
      c.row(7, 0, 15, sbG);
      c.row(15, 0, 15, sbG);
      c.col(9, 0, 6, sbG);
      c.col(3, 8, 14, sbG);
      c.row(0, 0, 8, sbL);
      c.row(8, 4, 15, sbL);
      dots(c, sbG, [[2, 3], [3, 3], [12, 4], [13, 4], [7, 11], [8, 11], [13, 12]]);
      dots(c, dust, [[5, 2], [6, 2], [6, 3], [14, 5], [10, 13], [11, 13], [11, 12], [1, 12], [12, 6]]);
    };
    set('apothecary', 'apothecary pharmacy chemist old shop', {
      top: (c) => {
        fill(c, hex('#15100e'));
        c.row(13, 0, 15, hex('#1d1612'));
        c.row(14, 0, 15, hex('#231a15'));
        dots(c, hex('#1b1411'), [[3, 4], [4, 4], [11, 8], [12, 8]]);
      },
      wallWords: 'empty shelf dark wood shelves',
      wall,
      details: [
        [
          'jars',
          'shelf of jars ceramic pots labels',
          (c) => {
            art(c, 1, 5, ['.CC.', 'CCCn', 'cCCn', 'clln', 'clin', 'cCCn', 'cccn'], p);
            art(c, 6, 3, ['.CC.', 'CCCn', 'cbbn', 'cCCn', 'clln', 'cill', 'clln', 'cbbn', 'cccn'], p);
            art(c, 11, 5, ['.CC.', 'CCCn', 'cCCn', 'clln', 'cliln', 'cCCn', 'cccn'], p);
            dots(c, p.n, [[15, 9]]);
            dots(c, p.d, [[15, 9]]);
          },
        ],
        [
          'bottles',
          'shelf of bottles glass green amber blue phials',
          (c) => {
            art(c, 1, 3, ['.o.', '.g.', '.g.', 'gGg', 'gGg', 'gGg', 'glg', 'glg', 'ggg'], p);
            art(c, 5, 6, ['.o..', '.a..', 'aAAa', 'alla', 'alla', 'aaaa'], p);
            art(c, 10, 4, ['.o.', '.u.', '.u.', 'uUu', 'uUUu', 'uUuu', 'uuuu', '.uu.'], p);
            art(c, 14, 8, ['o', 'G', 'g', 'g'], p);
          },
        ],
        [
          'drawers',
          'drawers with labels small drawer chest brass knobs',
          (c) => {
            for (const oy of [0, 8])
              for (const ox of [0, 8]) {
                c.rect(ox, oy, ox + 7, oy + 7, p.w);
                c.row(oy, ox, ox + 6, p.W);
                c.col(ox + 7, oy, oy + 7, p.v);
                c.row(oy + 7, ox, ox + 7, p.v);
                c.rect(ox + 1, oy + 2, ox + 5, oy + 3, p.l);
                c.row(oy + 3, ox + 2, ox + 4, p.n);
                c.set(ox + 3, oy + 5, p.Y);
                c.set(ox + 4, oy + 5, p.y);
              }
          },
          true,
        ],
        [
          'herbs',
          'hanging herbs dried bunches lavender',
          (c) =>
            art(c, 0, 1, [
              '.tttttttttttttt.',
              '..t...t...t..t..',
              '..t...t...r..t..',
              '.hHh..q..rrr.H..',
              'hHhHh.Qq.rrr.hH.',
              'hHhHh.qQ.r.rhHh.',
              '.hHh..Qq.rr.hHh.',
              '.hHh..q...r..hH.',
              '..h...Q...r..h..',
              '..h...........h.',
            ], p),
        ],
        [
          'scale',
          'niche with a balance scale brass arched recess',
          (c) => {
            c.oval(2, 1, 13, 10, p.v);
            c.rect(2, 6, 13, 11, p.v);
            c.oval(3, 2, 12, 10, p.k);
            c.rect(3, 6, 12, 11, p.k);
            art(c, 3, 3, [
              '....YY....',
              'yyyyYYyyyy',
              'y...Yy...y',
              'y...Yy...y',
              'y...Yy...y',
              'YYY.Yy.YYY',
              '.y..Yy..y.',
              '...yYYy...',
              '..yYYYYy..',
            ], p);
          },
        ],
      ],
      floorWords: 'worn quarry tiles red brown',
      floor,
      variants: [
        ['boards', 'sawdust boards planks wooden pale', boards, true],
        [
          'worn',
          'worn tiles hollow path pale',
          (c) => {
            each(c, (x, y) => {
              const r = Math.hypot((x - 7.5) / 7, (y - 7.5) / 5.5);
              return r < 1 ? blend(c.get(x, y), hex('#7d6a58'), r < 0.6 ? 0.3 : (x + y) % 2 ? 0.22 : 0.1) : null;
            });
          },
        ],
        [
          'spill',
          'spilled tincture broken bottle glass stain',
          (c) => {
            const s = hex('#2e3528'),
              S = hex('#3d4634');
            art(c, 2, 4, ['....ssss....', '..ssSSSsss..', '.sSSSSSSSss.', 'ssSSSsSSSSss', '.sssSSSSsss.', '...sssss.s..', '..........s.'], { s, S });
            art(c, 5, 6, ['G.g', '.gG'], p);
            dots(c, p.G, [[10, 5], [3, 10]]);
            dots(c, p.o, [[12, 11]]);
          },
        ],
        [
          'cracked',
          'cracked tile broken corner missing',
          (c) => {
            art(c, 9, 0, ['..j...', '..j...', '.j....', '.jj...', '...j..', '...jj.', '.....j'], { j: tj });
            c.rect(0, 12, 2, 14, tj);
            dots(c, tj, [[3, 14], [0, 11]]);
            dots(c, tL, [[12, 0], [12, 1], [11, 3]]);
          },
        ],
      ],
    });
  }

  /* ================= 12. oldtime: a house of the 1800s ================= */
  {
    const p = pal({
      k: '#0e0b0a',
      a: '#837354', // printed wallpaper
      A: '#8e7d5d',
      z: '#5a5460',
      x: '#784840',
      e: '#5b6342',
      R: '#523a2b', // the rail
      r: '#30221c', // dark wainscot
      V: '#3c2b23',
      u: '#1f1512',
      y: '#8a7236', // brass
      Y: '#ab9048',
      g: '#66767a', // a glass globe
      G: '#84949a',
      o: '#6a5628', // a gilt frame
      O: '#8f7636',
      c: '#b0a68c', // card, linen
      l: '#a0977b',
      f: '#46322a', // dark frames
      F: '#5c4334',
      n: '#2c3748', // dusk
      N: '#47566a',
      b: '#3d4d6c',
      s: '#8a3a32',
      w: '#b4ac94', // a candle
    });
    const bo = hex('#4a392d'),
      boL = hex('#544236'),
      boD = hex('#3f3026'),
      gap = hex('#291e19');
    const sprig = (c, x, y) => {
      dots(c, p.x, [[x, y]]);
      dots(c, p.e, [[x - 1, y + 1], [x + 1, y + 1]]);
      dots(c, p.z, [[x, y + 1], [x, y + 2]]);
    };
    const wall = (c) => {
      each(c, (x, y) => (y < 10 ? (x % 8 < 2 ? p.A : p.a) : y === 10 ? p.R : y === 11 ? p.u : x % 4 === 3 ? p.u : x % 4 === 0 ? p.V : p.r));
      sprig(c, 4, 1);
      sprig(c, 12, 5);
      dots(c, p.z, [[4, 7], [12, 1]]);
      c.row(15, 0, 15, p.u);
    };
    const floor = (c) => {
      fill(c, bo);
      c.row(7, 0, 15, gap);
      c.row(15, 0, 15, gap);
      c.col(5, 0, 6, gap);
      c.row(0, 6, 15, boL);
      c.row(8, 0, 15, boL);
      dots(c, boD, [[8, 3], [9, 3], [10, 3], [11, 3], [1, 4], [2, 4], [3, 11], [4, 11], [5, 11], [6, 11], [9, 13], [10, 13], [14, 11]]);
    };
    set('oldtime', 'old time 1800s nineteenth century house', {
      top: (c) => {
        fill(c, hex('#14100f'));
        dots(c, hex('#1b1614'), [[2, 6], [3, 6], [4, 6], [10, 3], [11, 3], [8, 12], [9, 12], [10, 12]]);
        dots(c, hex('#0f0c0b'), [[13, 9], [5, 10]]);
      },
      wallWords: 'printed wallpaper buff sprigs dark wainscot boards',
      wall,
      details: [
        [
          'window',
          'sash window blind half down dusk',
          (c) => {
            art(c, 2, 0, [
              'FFFFFFFFFFFF',
              'FnnnnFFnnnnf',
              'FnNnnFFnnnnf',
              'FnnnnFFnnNnf',
              'FnnnnFFnnnnf',
              'FFFFFFFFFFFf',
              'FnnnnFFnnnnf',
              'FnnNnFFnNnnf',
              'FnnnnFFnnnnf',
              'Ffffffffffff',
            ], p);
            dots(c, p.y, [[7, 5], [8, 5]]);
            c.row(10, 1, 14, p.F);
          },
        ],
        [
          'gaslamp',
          'gas lamp bracket unlit glass globe brass',
          (c) =>
            art(c, 3, 0, [
              '.....GGG..',
              '....GGggG.',
              '....GgggG.',
              '....Ggggg.',
              '.....ggg..',
              '....YYyyy.',
              '......y...',
              '.yY...y...',
              'yYYyyyy...',
              'yYy..y....',
              '.yy.......',
            ], p),
        ],
        [
          'silhouette',
          'silhouette portrait framed oval profile black',
          (c) => {
            art(c, 4, 0, [
              '...zz...',
              '..OOOO..',
              '.OccccO.',
              'OcckkccO',
              'OckkkkcO',
              'OkkkkccO',
              'OcckkccO',
              'OckkkkcO',
              '.okkkko.',
              '..oooo..',
            ], p);
          },
        ],
        [
          'sampler',
          'sampler needlework embroidery framed cross stitch',
          (c) =>
            art(c, 2, 0, [
              '............',
              'FFFFFFFFFFFF',
              'FllllllllllF',
              'FlslslslsllF',
              'FllllllllllF',
              'FlblblblbllF',
              'FllllsslellF',
              'FlellssssleF',
              'FleeeeeeeeeF',
              'ffffffffffff',
            ], p),
        ],
        [
          'shelf',
          'shelf mantel clock candlestick unlit candle',
          (c) => {
            art(c, 1, 1, [
              '...ff.......k.',
              '..fFFf......w.',
              '.fFccFf.....w.',
              '.fckccf.....w.',
              '.fcckcf.....w.',
              '.fFccFf....yYy',
              '.ffffff.....y.',
              'FFFFFFFFFFFFFF',
              'ffffffffffffff',
            ], p);
            dots(c, p.z, [[2, 10], [13, 10]]);
          },
        ],
      ],
      floorWords: 'wide boards dark old planks',
      floor,
      variants: [
        [
          'rug',
          'rag rug braided oval',
          (c) => {
            const ring = [hex('#5a292d'), hex('#3b4852'), hex('#6c6346'), hex('#2c2420'), hex('#5a292d'), hex('#6c6346')];
            each(c, (x, y) => {
              const r = Math.hypot((x - 7.5) / 7.2, (y - 7.5) / 5.6);
              return r <= 1 ? ring[Math.min(5, Math.floor((1 - r) * 6.5))] : null;
            });
            dots(c, hex('#2c2420'), [[4, 5], [10, 11], [12, 6]]);
          },
        ],
        [
          'floorcloth',
          'painted floorcloth oilcloth diamonds',
          (c) => {
            each(c, (x, y) => {
              const d = Math.abs((x % 8) - 3.5) + Math.abs((y % 8) - 3.5);
              return d < 2 ? hex('#3a3a30') : d < 3.5 ? hex('#5a5238') : hex('#4a4634');
            });
            dots(c, hex('#3f3b2c'), [[0, 5], [9, 0], [14, 9], [6, 14]]);
            dots(c, hex('#665d40'), [[5, 2], [12, 10]]);
          },
          true,
        ],
        [
          'worn',
          'worn boards pale path scuffed',
          (c) => {
            each(c, (x, y) => {
              const r = Math.hypot((x - 7.5) / 7, (y - 7.5) / 6);
              return r < 1 && c.get(x, y) !== gap ? blend(c.get(x, y), hex('#7a6a58'), r < 0.55 ? 0.28 : (x + y) % 2 ? 0.2 : 0.08) : null;
            });
          },
        ],
        [
          'patch',
          'tin patch nailed over a hole mended',
          (c) => {
            c.rect(4, 3, 11, 10, hex('#5a5c60'));
            c.row(3, 4, 11, hex('#6c6e72'));
            c.col(4, 3, 10, hex('#6c6e72'));
            c.row(10, 4, 11, hex('#3e3f44'));
            c.col(11, 3, 10, hex('#3e3f44'));
            dots(c, p.k, [[5, 4], [10, 4], [5, 9], [10, 9], [7, 4], [8, 9]]);
            dots(c, hex('#6a4a34'), [[9, 7], [10, 7], [10, 8]]);
          },
        ],
      ],
    });
  }

  /* ================= 13. twenties: the 1920s ================= */
  {
    const p = pal({
      k: '#0b0b0d',
      n: '#27272f', // the wallpaper's ground
      N: '#31313b',
      o: '#7c6838', // gold lines
      O: '#a48c50',
      j: '#2d564b', // jade
      J: '#3e7060',
      c: '#a0977c', // cream
      C: '#b6ad92',
      g: '#85816f', // frosted glass
      G: '#9a9683',
      q: '#6a6657',
      m: '#566068', // mirror glass
      M: '#74808a',
      d: '#202c42', // night in a window
      D: '#33455f',
      r: '#823830',
    });
    const pa = hex('#574432'),
      pb = hex('#5f4a36'),
      pj = hex('#48382a'),
      pL = hex('#6a543c');
    const fan = ['...ooo..', '..o...o.', '.o.....o', 'o.......', 'oo.....o', '..o...o.', '...o.o..', '....o...'];
    const wall = (c) => {
      fill(c, p.n);
      each(c, (x, y) => (fan[y % 8][x % 8] === 'o' ? hex('#4b4434') : null));
      dots(c, hex('#2c4a42'), [[4, 2], [12, 2], [0, 6], [8, 6], [4, 10], [12, 10], [0, 14], [8, 14]]);
    };
    const floor = (c) => {
      each(c, (x, y) => {
        const h = ((x >> 3) + (y >> 3)) % 2 === 0,
          v = h ? y % 8 : x % 8,
          w = h ? x % 8 : y % 8;
        if (v % 4 === 3 || w === 7) return pj;
        return h ? pb : pa;
      });
      dots(c, pL, [[1, 0], [2, 0], [3, 0], [9, 8], [10, 8], [11, 8]]);
      dots(c, pj, [[4, 1], [12, 13], [10, 2], [2, 10]]);
    };
    set('twenties', 'twenties 1920s art deco jazz age', {
      top: (c) => {
        fill(c, hex('#101013'));
        dots(c, hex('#17171b'), [[3, 3], [4, 3], [5, 3], [10, 9], [11, 9], [12, 9]]);
        c.row(15, 0, 15, hex('#1c1b1c'));
      },
      wallWords: 'art deco wallpaper fans black gold',
      wall,
      details: [
        [
          'window',
          'deco window stepped sunburst bars night',
          (c) => {
            art(c, 3, 1, [
              '...OOOO...',
              '..OoddoO..',
              '.OoddddoO.',
              '.OddDdddO.',
              '.OddddddO.',
              '.OooooooO.',
              '.OddddddO.',
              '.OdddddDO.',
              '.OddddddO.',
              '.OooooooO.',
              '.OddddddO.',
              '.OddddddO.',
              'OOOOOOOOOO',
              '.kkkkkkkk.',
            ], p);
          },
        ],
        [
          'frieze',
          'geometric frieze border band zigzag stepped',
          (c) => {
            c.rect(0, 1, 15, 7, p.k);
            c.row(1, 0, 15, p.O);
            c.row(7, 0, 15, p.o);
            ['jjj..jjj', 'jj.cc.jj', 'j.cccc.j', '.cccccc.'].forEach((l, j) => {
              for (let x = 0; x < 16; x++) if (p[l[x % 8]]) c.set(x, 2 + j, l[x % 8] === 'j' ? (j === 0 ? p.J : p.j) : j === 3 ? p.c : p.C);
            });
            c.row(8, 0, 15, p.k);
          },
        ],
        [
          'sconce',
          'wall sconce fan glass shade unlit lamp',
          (c) =>
            art(c, 3, 2, [
              'G.G.G.G.G.',
              'GqGqGqGqGg',
              'GqGgGqGgGq',
              '.GqGgGqGg.',
              '.GgGqGgGq.',
              '..GqGgGq..',
              '..gGgGgq..',
              '...oOOo...',
              '...oOOo...',
              '..oOOOOo..',
              '...oOOo...',
              '....oo....',
            ], p),
        ],
        [
          'poster',
          'framed poster deco sunburst travel',
          (c) => {
            art(c, 3, 1, [
              'kkkkkkkkkk',
              'kjcjjcjjck',
              'kjjcjcjcjk',
              'kcjjcccjjk',
              'kjccOOOcck',
              'kjjOOOOOjk',
              'kcOOOOOOOk',
              'krrrrrrrrk',
              'kcccccccck',
              'kcqqqcqqck',
              'kcccccccck',
              'kcqqqqqcck',
              'kkkkkkkkkk',
            ], p);
            c.col(13, 2, 14, p.k);
            c.row(14, 4, 13, p.k);
          },
        ],
        [
          'mirror',
          'sunburst mirror round gold rays',
          (c) => {
            for (let a = 0; a < 16; a++) {
              const t = (a / 16) * Math.PI * 2,
                len = a % 2 ? 5 : 7;
              for (let r = 3; r <= len; r += 0.5) c.set(Math.round(7.5 + Math.cos(t) * r), Math.round(7.5 + Math.sin(t) * r), a % 2 ? p.o : p.O);
            }
            c.oval(4, 4, 11, 11, p.O);
            c.oval(5, 5, 10, 10, p.m);
            dots(c, p.M, [[6, 6], [7, 6], [6, 7]]);
            dots(c, p.k, [[9, 9]]);
          },
        ],
      ],
      floorWords: 'parquet basket weave wood blocks',
      floor,
      variants: [
        [
          'chequer',
          'chequer black cream green tiles checkerboard',
          (c) => {
            each(c, (x, y) => {
              const d = Math.abs(((x + 4) % 8) - 3.5) + Math.abs(((y + 4) % 8) - 3.5);
              if (d < 2) return hex('#2d564b');
              return ((x >> 3) + (y >> 3)) % 2 ? hex('#1d1d23') : hex('#8a836c');
            });
            dots(c, hex('#7d7762'), [[2, 2], [3, 2], [12, 11], [10, 13]]);
            dots(c, hex('#26262d'), [[11, 3], [3, 12]]);
          },
          true,
        ],
        [
          'inlay',
          'inlaid star compass marquetry',
          (c) => {
            c.oval(1, 1, 14, 14, pj);
            c.oval(2, 2, 13, 13, pa);
            const li = hex('#86704a'),
              dk = hex('#33261c');
            for (let i = 0; i <= 5; i++) {
              const w = Math.round((5 - i) / 2.6);
              for (let k = -w; k <= w; k++) {
                c.set(7 + (k <= 0 ? k : 0), 2 + i, k < 0 ? li : dk);
                c.set(8 + (k >= 0 ? k : 0), 2 + i, dk);
                c.set(7 + (k <= 0 ? k : 0), 13 - i, li);
                c.set(8 + (k >= 0 ? k : 0), 13 - i, k > 0 ? dk : li);
                c.set(2 + i, 7 + (k <= 0 ? k : 0), li);
                c.set(2 + i, 8 + (k >= 0 ? k : 0), dk);
                c.set(13 - i, 7 + (k <= 0 ? k : 0), li);
                c.set(13 - i, 8 + (k >= 0 ? k : 0), dk);
              }
            }
            c.rect(7, 7, 8, 8, hex('#a08a58'));
          },
        ],
        [
          'rug',
          'deco rug geometric jade cream',
          (c) => {
            c.rect(1, 2, 14, 13, p.j);
            c.frame(1, 2, 14, 13, p.k);
            c.frame(2, 3, 13, 12, hex('#8a836c'));
            art(c, 4, 5, ['k..oo..k', 'kk.oo.kk', '.kkookk.', '.kkookk.', 'kk.oo.kk', 'k..oo..k'], p);
            dots(c, hex('#8a836c'), [[1, 2], [14, 2], [1, 13], [14, 13]]);
            for (let x = 2; x <= 13; x += 2) {
              c.set(x, 1, hex('#8a836c'));
              c.set(x, 14, hex('#8a836c'));
            }
          },
        ],
        [
          'pearls',
          'broken string of pearls beads scattered',
          (c) => {
            const pe = hex('#b0aa98'),
              sh = hex('#7d7868');
            const list = [[2, 4], [4, 3], [6, 3], [8, 4], [10, 6], [11, 8], [10, 10], [8, 11], [13, 12], [4, 12], [14, 5]];
            for (const [x, y] of list) {
              c.set(x, y, pe);
              c.set(x, y + 1, sh);
            }
            dots(c, pj, [[3, 4], [5, 3], [7, 4], [9, 5], [11, 7], [11, 9], [9, 11]]);
          },
        ],
      ],
    });
  }

  return out;
};
