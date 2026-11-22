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
  //VIEWS
};
