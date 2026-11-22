/* The yard and the occult, as text pictures (see rest.js for the letters). */
module.exports = ({ D: D0, T: T0, vary: vary0, V }) => {
  /* the rows of every picture drawn here are kept, so that the other views can be made from them */
  const R = {};
  const pat = (rows, { swap = {}, put = [] } = {}) => {
    const out = rows.map((r) => [...r].map((ch) => swap[ch] || ch));
    for (const [x, y, text] of put) {
      while (out.length <= y) out.push([]);
      for (let i = 0; i < text.length; i++) {
        while (out[y].length <= x + i) out[y].push('.');
        if (text[i] !== ' ') out[y][x + i] = text[i];
      }
    }
    return out.map((r) => r.join(''));
  };
  const D = (slug, rows, o) => ((R[slug] = rows), D0(slug, rows, o));
  const T = (slug, rows, o) => ((R[slug] = rows), T0(slug, rows, o));
  const vary = (slug, from, o) => ((R[slug] = pat(R[from], o)), vary0(slug, from, o));
  const sw = (rows, swap) => pat(rows, { swap });
  /* ---------- the yard ---------- */
  D('porch-swing', [
    't....................t',
    't....................t',
    't....................t',
    't....................t',
    't....................t',
    't....................t',
    'toooooooooooooooooooot',
    'to.o.o.o.o.o.o.o.o.o.t',
    'toooooooooooooooooooot',
    'to.o.o.o.o.o.o.o.o.o.t',
    'OOOOOOOOOOOOOOOOOOOOOO',
    'pppppppppppppppppppppp',
  ]);
  D('garden-bench-old', [
    'aaaaaaaaaaaaaaaaaaaaaa',
    'a....................a',
    'aaaaaaaaaaaMaaaaaaaaaa',
    'a....................a',
    'AAAAAAAAAAAAAAAAAAAAAA',
    'aaaaamaaaaaaaaaaaaaaaa',
    'I.I................I.I',
    'I.I................I.I',
    'I.I................I.I',
  ]);
  D('birdbath', [
    '.ssssssssss.',
    'sl33333333ds',
    '.ssssssssd..',
    '....sd......',
    '....sd......',
    '....sd......',
    '....sd......',
    '....sd......',
    '...ssdd.....',
    '..sssddd....',
  ]);
  D('sundial', [
    '......I...',
    '.....II...',
    '....III...',
    'ssssssssss',
    'sllllllllds',
    '..ssssd...',
    '...ssd....',
    '...ssd....',
    '...ssd....',
    '...ssd....',
    '..ssssd...',
    '.ssssssd..',
  ]);
  D(
    'well-cover',
    ['.OOOOOOOOOOOOOO.', 'OpOpOpOpOpOpOpOO', 'OpOpOpOtIpOpOpOO', '.OOOOOOOOOOOOOO.', '.ssdssdssdssdss.', '.dssdssdssdssds.', '.ssdssmssdssdss.'],
    { shade: false },
  );
  D('scarecrow-old', [
    '......yy......',
    '.....yyyy.....',
    '....eeeeee....',
    '...eeeeeeee...',
    '....cccccc....',
    '....cncnnc....',
    '....cccccc....',
    '....cnnnnc....',
    '.....cccc.....',
    'OOOuuuuuuuuOOO',
    'y..uuuuuuuu..y',
    'y..uuuUuuuu..y',
    '...uuuUuuuu...',
    '...uuuUuuuu...',
    '...uuuuuuuu...',
    '...uu.OO.uu...',
    '...yy.OO.yy...',
    '......OO......',
    '......OO......',
    '......OO......',
    '......OO......',
    '......OO......',
    '......OO......',
  ]);
  D('cross-wooden', [
    '...OO...',
    '...oO...',
    '...oO...',
    'ooooOOOO',
    'oOOOOOOO',
    '...oO...',
    '...oO...',
    '...oO...',
    '...oO...',
    '...oO...',
    '...oO...',
    '...oO...',
    '..eoOe..',
  ]);
  T('grave-open', ['.eeeeEeeeeeeeeeEeee.', 'eEnnnnnnnnnnnnnnnnEe', 'ennnnnnnnnnnnnnnnnne', 'eEnnnnnnnnnnnnnnnnEe', '.eeEeeeeeeeeEeeeeee.'], {
    shade: false,
  });
  T('earth-mound', ['......eeeeee......', '...eeeeEeeeeeee...', '..eeEeeeeeeEeeee..', '.eeeeeeEeeeeeeEee.', 'eeEeeeeeeeEeeeeeee']);
  T('shed-tools', [
    'O.....t.....',
    'O.....t..tt.',
    'O.....t..tt.',
    'O.....t...O.',
    'O.....O...O.',
    'O.....O...O.',
    'O.....O...O.',
    'O.....O...O.',
    'O.....O...O.',
    'O.....O...O.',
    'O.....O...O.',
    'O.....O...O.',
    'O....tOt..O.',
    'O....ttt..O.',
    'II...ttt.ttt',
    'II....t..ttt',
  ]);
  D('mailbox-old', [
    '.uuuuuu.',
    'uu0000uR',
    'u000000R',
    'u0nnnn0u',
    'uuuuuuuu',
    '...OO...',
    '...OO...',
    '...OO...',
    '...OO...',
    '...OO...',
    '...OO...',
    '...OO...',
    '...OO...',
    '...OO...',
  ]);
  D('dead-tree-small', [
    'O......O....',
    '.O....O...O.',
    '.O...O...O..',
    '..O..O..O...',
    '...O.OOO....',
    '...OOO......',
    '....OO...O..',
    '....OOOOO...',
    '....OO......',
    '....OE......',
    '....OE......',
    '....OE......',
    '....OE......',
    '....OE......',
    '....OE......',
    '....OE......',
    '...OOEE.....',
    '..OOOEEE....',
  ]);
  D('crow-post', [
    '.nn....',
    'nnnn...',
    '9nnnn..',
    '.nnnnn.',
    '..nnnnn',
    '..O.O..',
    '..OOO..',
    '..OoO..',
    '..OoO..',
    '..OoO..',
    '..OoO..',
    '..OoO..',
    '..OoO..',
    '..OoO..',
    '..OoO..',
    '..OoO..',
    '..OoO..',
  ]);
  T(
    'tyre-swing',
    [
      '...y...',
      '...y...',
      '...y...',
      '...y...',
      '...y...',
      '...y...',
      '...y...',
      '...y...',
      '...y...',
      '...y...',
      '.nnnnn.',
      'nnI.Inn',
      'nI...In',
      'nI...In',
      'nnI.Inn',
      '.nnnnn.',
    ],
    { outline: false },
  );
  D('bicycle-rusty', [
    '......u.......uu....',
    '.....uuu......u.....',
    '......u......u......',
    '...uuuuuuuuuuu......',
    '..uu.u......u.u.....',
    '.nnnn.u....u.nnnn...',
    'nI..In.u..u.nI..In..',
    'n.uu.n..uu..n.uu.n..',
    'nI..In......nI..In..',
    '.nnnn........nnnn...',
  ]);
  D('headstone-leaning', [
    '......ssss..',
    '....sslllss.',
    '...sllssssd.',
    '...slsddsd..',
    '..slssssdd..',
    '..slsddsd...',
    '.slssssdd...',
    '.slssssd....',
    '.sssmssd....',
    'ssmssdd.....',
    'eeeeeeeee...',
  ]);
  D('statue-weeping', [
    '....ssss....',
    '...slsssd...',
    '...slsssd...',
    '..ssssssd...',
    '..sslssdd...',
    '.sslssssd...',
    '.slssssdss..',
    '.slsddssds..',
    '.sssssssd...',
    '..slsssd....',
    '..slsssd....',
    '..slsssd....',
    '..slssmd....',
    '..slsssd....',
    '..slsssd....',
    '..slsssd....',
    '.sslsssdd...',
    '.slssssdd...',
    '.slsssmdd...',
    'sssssssssd..',
    'slllllllld..',
    'sssssssssd..',
    'ssmssssssd..',
  ]);
  T('lantern-porch', ['IIIIIII', '...I...', '..III..', '.IIIII.', '.IFfFI.', '.IfFfI.', '.IFfFI.', '.IIIII.', '..III..'], { outline: false });
  D('bird-table', [
    '..OOOOOOOO..',
    '.OOOOOOOOOO.',
    'OOOOOOOOOOOO',
    '.o........o.',
    '.o........o.',
    'pppppppppppp',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '.....OO.....',
    '....OOOO....',
  ]);
  T('pumpkin-rotten', ['....HH....', '..uu0uu0..', '.u0nu0unu.', 'u0nnu0nnnu', 'u0u0u0nu0u', 'unnnnnnn0u', '.u0nuunu..', '..LuuuuL..']);
  D('garden-roller', [
    '.........II.',
    '........I...',
    '.......I....',
    '......I.....',
    '.....I......',
    '.sssssss....',
    'sllllllsd...',
    'sssssssdd...',
    'sssmsssdd...',
    'sssssssdd...',
    '.sssssdd....',
  ]);
  D('beehive-old', [
    '...PPPPPPPP...',
    '..PPPPPPPPPP..',
    '.aaaaaaaaaaaa.',
    '..PPPPPPPPPP..',
    '..PaPPPPPPPP..',
    '.aaaaaaaaaaaa.',
    '..PPPPPPPPPP..',
    '..PPPPPPPaPP..',
    '.aaaaaaaaaaaa.',
    '..PPPPPPPPPP..',
    '..PPPPnnPPPP..',
    '.OOOOOOOOOOOO.',
    '..O........O..',
  ]);
  /* ---------- the occult ---------- */
  D('altar-stone', [
    '.ssssssssssssssssss.',
    'slllllllllllllllllld',
    'ssssssssssssssssssdd',
    '..sssssssssssssssd..',
    '..slssssdsssssssdd..',
    '..slssssssssdsssdd..',
    '..slsssssssssssdd...',
    '..slssdsssssssssdd..',
    '..slssssssssssssdd..',
    '.ssssssssssssssssdd.',
    'ssssssssssssssssssdd',
  ]);
  vary('altar-cloth', 'altar-stone', {
    put: [
      [0, 0, '.vvvvvvvvvvvvvvvvvv.'],
      [0, 1, 'vvvvvvvvggvvvvvvvvvV'],
      [0, 2, 'vvvvvvvvggvvvvvvvvvV'],
      [0, 3, 'vv.vvvvggggvvvvvv.vV'],
      [3, 4, 'vvvvvggvvvvvv'],
      [4, 5, 'v.vvggvv.v'],
      [8, 6, 'gg'],
    ],
  });
  vary('altar-bone', 'altar-stone', {
    swap: { s: 'b', l: 'c', d: 'B' },
    put: [
      [4, 5, 'n.n'],
      [4, 6, '.n.'],
      [11, 5, 'n.n'],
      [11, 6, '.n.'],
      [8, 7, 'nn'],
    ],
  });
  T('candle-tall-black', ['.F.', 'FfF', '.f.', '.n.', 'nnn', 'nIn', 'nnn', 'nIn', 'nnn', 'nIn', 'nnn', 'nIn', 'nnn', 'nnn'], { outline: false });
  T('candle-melted', ['..F..', '..f..', '..b..', '.bbb.', '.bcb.', 'bbcbb', 'bbbbbb', 'bbbbbbb'], { outline: false });
  D('candelabra-iron', [
    'F...F...F',
    'f...f...f',
    'b...b...b',
    'b...b...b',
    'I...I...I',
    'IIIIIIIII',
    '....I....',
    '....I....',
    '...III...',
    '....I....',
    '....I....',
    '....I....',
    '....I....',
    '....I....',
    '....I....',
    '....I....',
    '....I....',
    '....I....',
    '....I....',
    '...III...',
    '..IIIII..',
  ]);
  T('grimoire-closed', ['vvvvvvvvv', 'vVVVVVVVc', 'vVVgVgVVc', 'vVVVgVVVc', 'vVVgVgVVc', 'vVVVVVVVc', 'vvvvvvvvv']);
  vary('grimoire-chained', 'grimoire-closed', {
    swap: { v: 'n', V: 'I', g: 'r' },
    put: [
      [0, 3, 'tItItItIt'],
      [4, 0, 't'],
      [4, 1, 'I'],
      [4, 2, 't'],
      [4, 4, 'G'],
      [4, 5, 'I'],
      [4, 6, 't'],
    ],
  });
  T(
    'grimoire-floating',
    [
      '...h.....h...',
      '.............',
      'cccccc.cccccc',
      'cnncnncnncnnc',
      'ccccccVcccccc',
      'cnncncVcnnccc',
      'ccccccVcccccc',
      'vvvvvvVvvvvvv',
      '.............',
      '..h...h...h..',
    ],
    { outline: false },
  );
  const rune = (slug, mid) =>
    T(
      slug,
      [
        '....rrrrrrrr....',
        '..rr........rr..',
        '.r............r.',
        mid[0],
        mid[1],
        mid[2],
        '.r............r.',
        '..rr........rr..',
        '....rrrrrrrr....',
      ],
      { shade: false, outline: false },
    );
  rune('rune-floor-eye', ['r....rrrrrr....r', 'r...r..RR..r...r', 'r....rrrrrr....r']);
  rune('rune-floor-triangle', ['r......rr......r', 'r....rr..rr....r', 'r..rrrrrrrrrr..r']);
  rune('rune-floor-spiral', ['r...rrrrrr.....r', 'r..r..rr..r....r', 'r..r...rrrr....r']);
  D('rune-stone', [
    '...ssss...',
    '..sllssd..',
    '.slsssssd.',
    '.slsrsssd.',
    '.slrsrssd.',
    '.slsrsssd.',
    '.slssrssd.',
    '.slsrsrsd.',
    '.slssrssd.',
    '.slsssssd.',
    'sslsssmsdd',
    'ssssssssdd',
  ]);
  T(
    'summoning-circle',
    [
      '.......RRRRRRRRRR.......',
      '....RRR....R.....RRR....',
      '..RR......R.R.......RR..',
      '.R...RRRRRRRRRRRRRR...R.',
      'R......R.R...R.R.......R',
      'R.......RR...RR........R',
      '.R.....R..R.R..R......R.',
      '..RR..R....R....R...RR..',
      '....RRR.........RRRR....',
      '.......RRRRRRRRRR.......',
    ],
    { shade: false, outline: false },
  );
  vary('salt-circle', 'summoning-circle', {
    swap: { R: 'w' },
    put: [
      [5, 3, '              '],
      [7, 4, ' .       . '],
      [8, 5, '         '],
      [7, 6, '        '],
      [6, 7, '           '],
      [10, 1, ' . '],
      [10, 2, '   '],
    ],
  });
  T(
    'black-candle-circle',
    [
      '....f......f....',
      '....n......n....',
      '.f..n......n..f.',
      '.n............n.',
      '.n............n.',
      '................',
      '..f....f....f...',
      '..n....n....n...',
      '..n....n....n...',
    ],
    { outline: false },
  );
  T('chalice', ['GGGGGG', 'GrrrrG', '.GggG.', '..GG..', '..GG..', '..GG..', '.GGGG.']);
  T('chalice-spilled', ['G.....', 'GGG...', 'GrGGGG', 'GrGGGG', 'GGG...', 'Grr...', 'rrrrr.']);
  T('dagger-ritual', ['......T', '.....Tt', '....Tt.', '...Tt..', '.GGG...', '..v....', '.v.....']);
  T('dagger-bone', ['......b', '.....bB', '....bB.', '...bB..', '.OOO...', '..e....', '.e.....']);
  const mask = (slug, rows, o) => T(slug, rows, o);
  mask('mask-ritual', ['.OOOOOO.', 'OooooooO', 'OnnoonnO', 'OoorrooO', 'OorooroO', 'OonnnnoO', '.OooooO.', '..OOOO..']);
  mask('mask-plague', ['.nnnnnn..', 'nIIIIIIn.', 'n1nIIn1n.', 'nIIIIIIn.', '.nIIIInn.', '..nIIIInn', '...nnIIIn', '.....nnnn']);
  mask('mask-porcelain', ['.wwwwww.', 'wwwwwwww', 'wnnwwnnw', 'wwwwwwww', 'w7wwww7w', 'wwwRRwww', '.wwwwww.', '..wwww..']);
  mask('mask-goat', ['b......b', 'bb....bb', '.bnnnnb.', '.nIIIIn.', '.nRIIRn.', '.nIIIIn.', '..nIIn..', '..nIIn..', '...nn...', '...BB...']);
  D('idol-stone', [
    '..ssss..',
    '.slsssd.',
    '.snssnd.',
    '.slsssd.',
    '.ssnnsd.',
    '..sssd..',
    '.slsssd.',
    'sslsssdd',
    'ssnssndd',
    'sslsssdd',
    '.slsssd.',
    'ssssssdd',
  ]);
  vary('idol-gold', 'idol-stone', { swap: { s: 'g', l: 'F', d: 'G', n: 'r' } });
  vary('idol-tentacle', 'idol-stone', {
    swap: { s: '4', l: 'h', d: 'n' },
    put: [
      [1, 4, '4.4.4.'],
      [1, 5, '4.4.4.'],
      [0, 6, '4.4..4.4'],
    ],
  });
  T('effigy-straw', ['..yy..', '.yyyy.', '.ynny.', '..yy..', 'yyRRyy', '.yyyy.', '..yy..', '.yyyy.', '.y..y.', 'yy..yy']);
  vary('effigy-wax', 'effigy-straw', {
    swap: { y: 'c', R: 'c' },
    put: [
      [2, 5, 't'],
      [1, 2, 'c'],
      [4, 2, 'c'],
      [3, 7, 't'],
    ],
  });
  vary('doll-nails', 'effigy-straw', {
    swap: { y: 'a', R: 'r' },
    put: [
      [0, 1, 't'],
      [5, 6, 't'],
      [3, 0, 't'],
      [0, 7, 't'],
    ],
  });
  T('bones-crossed', ['b......b', 'bb....bb', '.bb..bb.', '...bb...', '...bb...', '.bb..bb.', 'bb....bb', 'b......b']);
  T('bones-circle', ['...bbbbbb...', '.bb......bb.', 'b...bwwb...b', 'b...wnnw...b', 'b...bwwb...b', '.bb......bb.', '...bbbbbb...'], {
    shade: false,
  });
  T('crystal-ball-dark', ['..5555..', '.55h555.', '55h5555n', '5555555n', '555555nn', '.5555nn.', '..GGGG..', '.GGGGGG.']);
  T('tarot-death', ['wwwwww', 'wnnnnw', 'wnbbnw', 'wnbbnw', 'wnnbnw', 'wnbbbw', 'wnnnnw', 'wwwwww']);
  vary('tarot-hanged', 'tarot-death', {
    swap: { b: 'R' },
    put: [
      [3, 1, 'O'],
      [3, 2, 'O'],
    ],
  });
  D('cauldron-bubbling', [
    '..8...8.....',
    '.8.8..8.8...',
    'IIIIIIIIIIII',
    '.I88888888I.',
    'IIIIIIIIIIII',
    'IiIIIIIIIIII',
    'IiIIIIIIIIII',
    'IiIIIIIIIIII',
    '.IiIIIIIIII.',
    '..IIIIIIII..',
    '.I..ffFf..I.',
    '.I.fFffFf.I.',
  ]);
  vary('cauldron-bones', 'cauldron-bubbling', {
    put: [
      [0, 0, '...b....b...'],
      [0, 1, '..bb.bb..b..'],
      [2, 3, 'bnbnbbnb'],
      [3, 10, '      '],
      [3, 11, '      '],
    ],
  });
  T('potion-poison', ['.OO.', '.22.', '.22.', '2LL2', '2LL2', '2nL2', '2LL2', '.22.']);
  vary('potion-black', 'potion-poison', { swap: { L: 'n', n: 'w' } });
  T('relic-box', ['GGGGGGGGGG', 'G11111111G', 'G1b1bb1b1G', 'G11111111G', 'GGGGGGGGGG', 'GvvvGGvvvG', 'GGGGGGGGGG']);
  T('relic-hand', ['.b.b.b..', '.b.b.b.b', '.b.b.b.b', '.bbbbbbb', '.bBbbbb.', '..bbbb..', '..bBbb..', '.GGGGGG.', 'GGGGGGGG']);
  T('incense-burner', ['...h....', '....h...', '...h....', '..GGGG..', '.GnGnGG.', '.GGGGGG.', '..GGGG..', '.GGGGGG.']);
  T(
    'censer-hanging',
    ['...t...', '...I...', '...t...', '...I...', '..t.t..', '.I...I.', '.GGGGG.', 'GnGnGnG', 'GGGGGGG', '.GGGGG.', '...h...', '..h....'],
    { outline: false },
  );
  T('charm-bones', ['OOOOOOO', '.e.e.e.', '.b.e.b.', '.b.b.b.', '.b.b.b.', '...b...', '...n...'], { outline: false });
  T('charm-witch-ball', ['..e..', '..e..', '.444.', '44h44', '44444', '.444.'], { outline: false });
  T(
    'dreamcatcher',
    ['..OOOOO..', '.O.w.w.O.', 'O.w.w.w.O', 'Ow.wRw.wO', 'O.w.w.w.O', '.O.w.w.O.', '..OOOOO..', '..e.e.e..', '..b.e.b..', '....b....'],
    { outline: false },
  );
  T('ash-bowl', ['IIIIIIII', 'IaAaaAaI', '.IIIIII.', '..IIII..']);
  T('hex-bag', ['..ee..', '.RRRR.', 'eeeeee', 'eEeeEe', 'eeeeee', '.eeee.']);
  T('scrying-mirror', [
    '..GGGG..',
    '.GnnnnG.',
    'Gnn5nnnG',
    'Gn5nnnnG',
    'GnnnnhnG',
    'GnnnnnnG',
    '.GnnnnG.',
    '..GGGG..',
    '...GG...',
    '...GG...',
    '..GGGG..',
  ]);
  T('pendulum-crystal', ['...t...', '...t...', '...t...', '...t...', '...t...', '..h5h..', '..555..', '..555..', '...5...'], { outline: false });
  T('cursed-painting', [
    'GGGGGGGGGGGG',
    'GnnnnnnnnnnG',
    'GnnnbbbbnnnG',
    'GnnbRbbRbnnG',
    'GnnbbbbbbnnG',
    'GnnnbnnbnnnG',
    'GnnvvvvvvnnG',
    'GnvvvvvvvvnG',
    'GnvvvvvvvvnG',
    'GGGGGGGGGGGG',
    '....r.......',
    '....r.......',
  ]);
  T(
    'ouija-planchette',
    ['qqqqqqqqqqqqqqqq', 'qnqnqnqnqnqnqnqq', 'qqqqqqoooqqqqqqq', 'qnqnqqo1oqqnqnqq', 'qqqqqqqoqqqqqqqq', 'qqqnnqqqqqnnqqqq', 'qqqqqqqqqqqqqqqq'],
    { shade: false },
  );
  T('goat-skull', ['b........b', 'bb......bb', '.bb....bb.', '..bbbbbb..', '..bnbbnb..', '..bbbbbb..', '...bbbb...', '...bnnb...', '....bb....']);
  T('witch-broom', ['....................yyy.', 'OOOOOOOOOOOOOOOOOOOuyyyy', '....................yyy.']);
  T('witch-hat-old', [
    '.....nn.....',
    '....nnn.....',
    '....nnnn....',
    '...nnnnn....',
    '...nnnnnn...',
    '..nvvvvvvn..',
    '..nnnnnnnn..',
    'nnnnnnnnnnnn',
    '.nnnnnnnnnn.',
  ]);
  /* ================= the other pictures of each thing: turned a quarter, used, and both ================= */
  const rep = (n, row) => Array.from({ length: n }, () => row);
  /* ---------- the yard ---------- */
  {
    /* used: a chain has snapped and the seat hangs askew */
    const fallen = Array.from({ length: 15 }, () => Array(22).fill('.'));
    R['porch-swing'].forEach((r, y) =>
      [...r].forEach((ch, x) => {
        if (ch === '.') return;
        if (y < 6) {
          if (x === 0 || y < 4) fallen[y][x] = ch;
          return;
        }
        fallen[y + (x < 7 ? 0 : x < 13 ? 1 : x < 18 ? 2 : 3)][x] = ch;
      }),
    );
    V('porch-swing', {
      side: ['...t', '...t', '...t', '...t', '...t', '...t', '.o.t', '.o.t', '.oooooo', '.o....o', 'OOOOOOO', 'ppppppp'],
      used: fallen.map((r) => r.join('')),
      sideUsed: ['...t', '...t', '...t', '...t', '', '', '', '', '', '.o', '.o', '.oooooo', '.o....o', 'OOOOOOO', 'ppppppp'],
    });
  }
  V('garden-bench-old', {
    side: ['aa', 'a', 'aaaaaaI', 'a.....I', 'AAAAAAA', 'aaaaaaa', 'I.....I', 'I.....I', 'I.....I'],
    used: {
      put: [
        [9, 4, '.....'],
        [9, 5, '.....'],
        [8, 6, 'a'],
        [9, 7, 'a'],
        [14, 6, 'a'],
        [13, 7, 'a'],
        [14, 0, '....'],
        [13, 1, 'a'],
      ],
    },
    sideUsed: {
      put: [
        [0, 0, '..'],
        [2, 5, '....'],
        [2, 6, 'a'],
        [3, 7, 'a'],
      ],
    },
  });
  V('birdbath', {
    used: {
      swap: { 3: 'd' },
      put: [
        [4, 1, 'u'],
        [5, 1, 'm'],
        [8, 1, 'u'],
      ],
    },
  });
  V('sundial', { side: ['....I', '....I', '....I', ...R['sundial'].slice(3)] });
  V('well-cover', {
    used: {
      put: [
        [5, 0, 'nnnn'],
        [4, 1, 'nnnnnn'],
        [4, 2, 'nnnnnn'],
        [5, 3, 'nnnn'],
      ],
    },
  });
  V('scarecrow-old', {
    side: [
      '..yy',
      '.yyyy',
      '.eeee',
      'eeeeee',
      '.cccc',
      '.cccn',
      '.cccc',
      '.ccnn',
      '..cc',
      '.uuOOu',
      '.uuOOu',
      '.uuUu',
      '.uuUu',
      '.uuUu',
      '.uuuu',
      '.uOOu',
      '.yOOy',
      ...rep(6, '..OO'),
    ],
    used: {
      put: [
        [11, 9, '...'],
        [13, 10, '.'],
        [11, 10, 'O'],
        [11, 11, 'O'],
        [11, 12, 'O'],
        [11, 13, 'y'],
      ],
    },
    sideUsed: {
      put: [
        [3, 9, 'u'],
        [3, 10, 'O'],
        [4, 10, 'u'],
        [3, 11, 'O'],
        [3, 12, 'O'],
        [3, 13, 'y'],
      ],
    },
  });
  V('cross-wooden', { side: ['oO', 'oO', 'oO', 'OO', 'OO', ...rep(7, 'oO'), 'eoOe'].map((r, y) => (y < 12 ? '.' + r : r)) });
  V('grave-open', {
    used: {
      put: [
        [4, 1, 'oooooooooooo'],
        [3, 2, 'oOOOOOgOOOOOOo'],
        [4, 3, 'oooooooooooo'],
      ],
    },
  });
  V('earth-mound', {
    used: {
      put: [
        [6, 1, 'nnnnnn'],
        [5, 2, 'nnnnnnnn'],
        [5, 3, 'EnnnnnnE'],
      ],
    },
  });
  V('shed-tools', { used: { put: Array.from({ length: 15 }, (_, i) => [8, i + 1, '....']) } });
  V('mailbox-old', {
    side: ['.uuuuuuuu', 'uu0RR000uu', 'u00R00000u', 'u00R00000n', 'uuuuuuuuuu', ...rep(9, '....OO')],
    used: {
      put: [
        [1, 1, 'unnnnu'],
        [1, 2, 'nnccnn'],
        [1, 3, 'nncwnn'],
        [1, 5, 'u0000u'],
        [1, 6, 'uuuuuu'],
      ],
    },
    sideUsed: {
      put: [
        [3, 1, '00'],
        [3, 2, '0'],
        [3, 3, 'RRR'],
        [9, 2, 'c'],
        [10, 4, 'u'],
        [10, 5, 'u'],
        [10, 6, 'u'],
        [10, 7, 'u'],
      ],
    },
  });
  V('crow-post', {
    used: {
      put: [
        [0, 0, '.......'],
        [0, 1, '.......'],
        [0, 2, '.......'],
        [0, 3, '.......'],
        [0, 4, '....n..'],
      ],
    },
  });
  V('bicycle-rusty', {
    base: 'side',
    side: ['.u......u', '.uuuuuuuu', '....uu', '....uu', '....uu', '....nn', '....nn', '..uunnuu', '....nn', '....nn'],
    used: ['..nnnn...u......nnnn', '.nI..Inuuuuuuuuun..In', '.nI..Inu..uu...un..In', '..nnnn...u..uu..nnnn'],
    sideUsed: ['..nnnnnn', '.nI....Inuu', '.nI....In.u', '..nnnnnn..u'],
  });
  V('statue-weeping', {
    used: {
      put: [
        [5, 2, 'R'],
        [7, 2, 'R'],
      ],
    },
  });
  V('lantern-porch', { used: { swap: { F: 'N', f: 'n' } } });
  V('bird-table', {
    used: {
      put: [
        [5, 3, 'nn'],
        [3, 4, '9nnnn'],
      ],
    },
  });
  V('beehive-old', {
    used: {
      put: [
        [0, 0, '.....PPPPPPPP'],
        [0, 1, '....PPPPPPPPPP'],
        [0, 0, '9'],
        [15, 3, '9'],
        [0, 6, '9'],
        [15, 9, '9'],
        [6, 11, 'O9O'],
      ],
    },
  });
  /* ---------- altars ---------- */
  const altarEnd = [
    '.ssssssss',
    'slllllllld',
    'ssssssssdd',
    '..sssssd',
    '..slssdd',
    '..slsssd',
    '..slssdd',
    '..slsdsd',
    '..slssdd',
    '.sssssssd',
    'ssssssssdd',
  ];
  const blood = [
    [8, 0, 'rrrr'],
    [6, 1, 'rrrrrrr'],
    [8, 2, 'rrr'],
    [9, 3, 'r'],
    [9, 4, 'r'],
    [12, 2, 'r'],
    [12, 3, 'r'],
    [9, 5, 'r'],
  ];
  const bloodEnd = [
    [3, 0, 'rrr'],
    [2, 1, 'rrrrr'],
    [4, 2, 'rr'],
    [4, 3, 'r'],
    [4, 4, 'r'],
    [6, 2, 'r'],
  ];
  V('altar-stone', { side: altarEnd, used: { put: blood }, sideUsed: { put: bloodEnd } });
  V('altar-bone', {
    side: pat(sw(altarEnd, { s: 'b', l: 'c', d: 'B' }), {
      put: [
        [3, 5, 'nbn'],
        [4, 6, 'n'],
      ],
    }),
    used: { put: blood },
    sideUsed: { put: bloodEnd },
  });
  {
    const end = pat(altarEnd, {
      put: [
        [0, 0, '.vvvvvvvv'],
        [0, 1, 'vvvvvvvvvV'],
        [0, 2, 'vvvvvvvvvV'],
        [1, 3, 'vvvvvvvV'],
        [2, 4, 'vvgvvV'],
        [2, 5, 'vgvgvV'],
        [2, 6, 'v v vV'],
      ],
    });
    V('altar-cloth', {
      side: end,
      used: ['..F..............F', '..f..............f', '..b..............b', '..b..............b', ...R['altar-cloth']],
      sideUsed: ['....F', '....f', '....b', '....b', ...end],
    });
  }
  /* ---------- candles: used, they have been put out ---------- */
  V('candle-tall-black', {
    used: {
      put: [
        [0, 0, '.a.'],
        [0, 1, 'a..'],
        [0, 2, '.a.'],
      ],
    },
  });
  V('candle-melted', {
    used: {
      put: [
        [1, 0, 'a.'],
        [2, 1, 'n'],
      ],
    },
  });
  V('candelabra-iron', {
    side: ['..F', '..f', '..b', '..b', '..I', '.III', '..I', '..I', '.III', ...rep(10, '..I'), '.III', 'IIIII'],
    used: {
      put: [
        [0, 0, '.........'],
        [0, 1, 'n...n...n'],
      ],
    },
    sideUsed: {
      put: [
        [2, 0, '.'],
        [2, 1, 'n'],
      ],
    },
  });
  V('black-candle-circle', { used: { swap: { f: 'A' } } });
  /* ---------- books: used, they lie open ---------- */
  V('grimoire-closed', {
    side: ['vvvvvvvvv', 'vcccccccc', 'vvvvvvvvv'],
    used: ['cccccc.cccccc', 'cnncnncnncnnc', 'ccccccVcccccc', 'cnncncVcnnccc', 'ccccccVcccccc', 'vvvvvvVvvvvvv'],
    sideUsed: ['cc.........cc', 'vccc.....cccv', '.vvccc.cccvv', '...vvvVvvv'],
  });
  V('grimoire-chained', {
    side: ['nnnntnnnn', 'ncccIcccc', 'nnnntnnnn'],
    used: ['cccccc.cccccc', 'crrcrrcrrcrrc', 'ccccccIcccccc', 'crrcrcIcrrccc', 'ccccccIcccccc', 'nnnnnnInnnnnn', 'tIt.......tIG'],
    sideUsed: ['cc.........cc', 'nccc.....cccn', '.nnccc.cccnn', 'tIt.nnInn.tIG'],
  });
  V('grimoire-floating', {
    used: ['', '', '', '..vvvvvvvvv', '..vVVVVVVVc', '..vVVgVgVVc', '..vVVVgVVVc', '..vVVgVgVVc', '..vVVVVVVVc', '..vvvvvvvvv'],
  });
  /* ---------- marks on the floor: used, they are smudged and broken ---------- */
  for (const slug of ['rune-floor-eye', 'rune-floor-triangle', 'rune-floor-spiral'])
    V(slug, {
      used: {
        put: [
          [8, 8, 'r.r.'],
          [12, 7, '.r'],
          [14, 6, '.'],
          [15, 5, '.'],
          [15, 4, '.'],
          [13, 6, 'r'],
          [14, 4, 'r'],
          [12, 9, 'r'],
          [15, 7, 'r'],
          [4, 0, '.'],
          [5, 1, 'r'],
        ],
      },
    });
  V('rune-stone', {
    side: ['.ss', '.sld', ...rep(8, 'slsd'), 'slsdd', 'ssssd'],
    used: { swap: { r: 'F' } },
    sideUsed: {
      put: [
        [4, 3, 'F'],
        [4, 5, 'F'],
        [4, 7, 'F'],
      ],
    },
  });
  V('summoning-circle', {
    used: {
      put: [
        [17, 1, '...'],
        [20, 2, '..'],
        [22, 3, '.'],
        [23, 4, '.'],
        [23, 5, '.'],
        [21, 2, 'R'],
        [23, 3, 'R'],
        [10, 4, 'nnn'],
        [9, 5, 'nnnnn'],
        [10, 6, 'nnn'],
      ],
    },
  });
  V('salt-circle', {
    used: {
      put: [
        [8, 9, '.....'],
        [7, 8, '.'],
        [8, 10, 'w.w'],
        [12, 10, 'w'],
        [10, 11, 'w.w'],
      ],
    },
  });
  /* ---------- on the altar ---------- */
  V('chalice', { used: R['chalice-spilled'] });
  V('chalice-spilled', { used: [...sw(R['chalice'], { r: 'n' }), 'rrrrrr'] });
  for (const slug of ['dagger-ritual', 'dagger-bone'])
    V(slug, {
      used: {
        put: [
          [6, 0, 'r'],
          [5, 1, 'rr'],
          [4, 2, 'r'],
          [6, 2, 'r'],
        ],
      },
    });
  /* idols: the profile, and eyes that have begun to glow */
  const idolSide = ['.ssss', 'slsssd', 'slssnd', 'slsssss', 'slssnd', '.sssd', '.slssd', 'slsssd', 'slssnsd', 'slsssd', '.slsd', 'sssssd'];
  const idol = (slug, side, eye) =>
    V(slug, {
      side,
      used: {
        put: [
          [2, 2, eye],
          [5, 2, eye],
          [3, 4, eye + eye],
        ],
      },
      sideUsed: {
        put: [
          [4, 2, eye],
          [4, 4, eye],
        ],
      },
    });
  idol('idol-stone', idolSide, 'R');
  idol('idol-gold', sw(idolSide, { s: 'g', l: 'F', d: 'G', n: 'r' }), '8');
  idol(
    'idol-tentacle',
    pat(sw(idolSide, { s: '4', l: 'h', d: 'n' }), {
      put: [
        [5, 4, '4'],
        [5, 5, '4'],
        [6, 6, '4'],
      ],
    }),
    'F',
  );
  V('effigy-straw', {
    used: {
      swap: { y: 'A', R: 'u' },
      put: [
        [2, 0, 'nn'],
        [0, 4, 'n'],
        [5, 4, 'n'],
        [0, 9, 'u'],
      ],
    },
  });
  V('crystal-ball-dark', {
    used: {
      put: [
        [2, 2, 'hhh'],
        [1, 3, 'hhRhh'],
        [2, 4, 'hhh'],
      ],
    },
  });
  V('tarot-death', { used: [...R['tarot-death']].reverse() });
  V('tarot-hanged', { used: [...R['tarot-hanged']].reverse() });
  /* cauldrons: the fire is out and the brew is still */
  V('cauldron-bubbling', {
    used: {
      put: [
        [0, 0, '............'],
        [0, 1, '............'],
        [4, 10, '....'],
        [3, 11, 'AaAuaA'],
      ],
    },
  });
  V('cauldron-bones', {
    used: {
      put: [
        [0, 0, '............'],
        [0, 1, '............'],
        [2, 3, '88888888'],
        [4, 10, '....'],
        [3, 11, 'AaAuaA'],
      ],
    },
  });
  for (const slug of ['potion-poison', 'potion-black'])
    V(slug, {
      used: {
        put: [
          [1, 0, '..'],
          [1, 3, '11'],
          [1, 4, '11'],
          [2, 5, '1'],
          [5, 7, 'OO'],
        ],
      },
    });
  V('relic-box', {
    side: ['GGGGGG', 'G1111G', 'G1bb1G', 'G1111G', 'GGGGGG', 'GvvvvG', 'GGGGGG'],
    used: {
      put: [
        [1, 1, '12nnnn21'],
        [1, 2, '1nnnnnn1'],
        [1, 3, '11n2nn11'],
      ],
    },
    sideUsed: {
      put: [
        [1, 1, '2nn2'],
        [1, 2, 'nnnn'],
        [1, 3, '1n21'],
      ],
    },
  });
  V('incense-burner', {
    used: {
      put: [
        [3, 0, '.'],
        [4, 1, '.'],
        [3, 2, '.'],
      ],
    },
  });
  V('censer-hanging', {
    used: {
      put: [
        [3, 10, '.'],
        [2, 11, '.'],
      ],
    },
  });
  V('scrying-mirror', {
    side: ['.GG', '.Gn', '.Gn', '.Gn', '.Gn', '.Gn', '.Gn', '.GG', '.GG', '.GG', 'GGGG'],
    used: {
      put: [
        [4, 1, 'w'],
        [3, 2, 'w'],
        [4, 3, 'ww'],
        [6, 2, 'w'],
        [3, 4, 'w'],
        [2, 5, 'w'],
        [5, 4, 'w'],
        [5, 5, 'w'],
      ],
    },
    sideUsed: {
      put: [
        [2, 2, 'w'],
        [2, 4, 'w'],
      ],
    },
  });
  V('cursed-painting', {
    side: [...rep(10, 'GG'), '.r', '.r'],
    used: { put: [...[2, 3, 4, 5, 6, 7, 8].map((y) => [1, y, 'nnnnnnnnnn']), [7, 10, 'r'], [7, 11, 'r'], [4, 12, 'r'], [3, 8, 'r'], [8, 8, 'r']] },
  });
  V('ouija-planchette', {
    used: {
      put: [
        [6, 2, 'qqq'],
        [6, 3, 'nqn'],
        [7, 4, 'q'],
        [2, 4, 'ooo'],
        [2, 5, 'o1o'],
        [3, 6, 'o'],
      ],
    },
  });
  /* masks in profile */
  V('mask-ritual', {
    side: ['.OOO', 'OoooO', 'OonnO', 'OooooO', 'OoroO', 'OonnO', '.OoO', '..O'],
    used: {
      put: [
        [1, 2, 'fF'],
        [5, 2, 'Ff'],
      ],
    },
    sideUsed: { put: [[2, 2, 'fF']] },
  });
  V('mask-plague', {
    side: ['.nnn', 'nIIIn', 'nI1In', 'nIIIIn', 'nIIIIInn', '.nIIIIIIn', '..nnIIIIn', '....nnnn'],
    used: {
      put: [
        [1, 2, 'F'],
        [6, 2, 'F'],
      ],
    },
    sideUsed: { put: [[2, 2, 'F']] },
  });
  V('mask-porcelain', {
    side: ['.www', 'wwwww', 'wwnnw', 'wwwwww', 'ww7ww', 'wwRRw', '.www', '..w'],
    used: {
      put: [
        [3, 0, 'n'],
        [4, 1, 'n'],
        [3, 2, 'n'],
        [4, 3, 'n'],
        [3, 4, 'n'],
        [2, 5, 'n'],
        [2, 6, 'n'],
        [5, 4, 'n'],
      ],
    },
    sideUsed: {
      put: [
        [2, 0, 'n'],
        [3, 1, 'n'],
        [1, 2, 'n'],
        [2, 3, 'n'],
        [1, 4, 'n'],
        [1, 5, 'n'],
      ],
    },
  });
  V('mask-goat', {
    side: ['bb', '.bb', '..bnn', '..nIIn', '..nIRn', '..nIIIn', '...nIIn', '...nIIn', '....nn', '....BB'],
    used: {
      put: [
        [2, 4, 'F'],
        [5, 4, 'F'],
      ],
    },
    sideUsed: { put: [[4, 4, 'F']] },
  });
  V('headstone-leaning', { side: ['.ss', '.sld', '.sld', '.sld', '.sld', '.sld', '.sld', '.sld', '.smd', 'ssdd', 'eeee'] });
  //VIEWS
};
