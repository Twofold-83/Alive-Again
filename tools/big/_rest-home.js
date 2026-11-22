/* The modern home, the attic and the household, as text pictures (see rest.js for the letters). */
module.exports = ({ D: D0, T: T0, vary: vary0, V }) => {
  /* the text of every picture is kept, for the views at the end of this file to build on */
  const ROWS = {};
  const D = (slug, rows, o) => (D0(slug, rows, o), (ROWS[slug] = rows));
  const T = (slug, rows, o) => (T0(slug, rows, o), (ROWS[slug] = rows));
  const vary = (slug, from, o = {}) => {
    vary0(slug, from, o);
    const rows = ROWS[from].map((r) => [...r].map((ch) => (o.swap || {})[ch] || ch));
    for (const [x, y, text] of o.put || []) {
      while (rows.length <= y) rows.push([]);
      for (let i = 0; i < text.length; i++) {
        while (rows[y].length <= x + i) rows[y].push('.');
        if (text[i] !== ' ') rows[y][x + i] = text[i];
      }
    }
    ROWS[slug] = rows.map((r) => r.join(''));
  };
  /* ---------- living room and bedroom ---------- */
  T(
    'rug',
    [
      '.vvvvvvvvvvvvvvvvvvvvvvvvvv.',
      'vVgVVVVVVVVVVVVVVVVVVVVVgVv',
      'vVVVggVVVVVVgggVVVVVVggVVVv',
      'vVgVVVVVVVVVVVVVVVVVVVVVgVv',
      '.vvvvvvvvvvvvvvvvvvvvvvvvvv.',
    ],
    { shade: false },
  );
  T('doormat', ['yYyYyYyYyYyYyY', 'YyyyyyyyyyyyyY', 'yYyYyYyYyYyYyY'], { shade: false });
  T('photo-frame', ['OOOOOOOO', 'OccccccO', 'OcxxcccO', 'OcjjcxcO', 'OcjjcjcO', 'OOOOOOOO']);
  T('houseplant', ['..H.M.H..', '.HMHMHMH.', 'HMHHMHHMH', '.HMHMHMH.', '..HHMHH..', '...HMH...', '..00000..', '..u000u..', '...uuu...']);
  T('vase-flowers', ['.R.7.R.', '.HRH7H.', '..HHH..', '..222..', '.21112.', '.21112.', '..111..']);
  T('cushion', ['.vvvvvv.', 'vVvvvvVv', 'vvvggvvv', 'vVvvvvVv', '.vvvvvv.']);
  T('pillow', ['.wwwwwww.', 'wwwwwwwwW', '.WWWWWWW.']);
  T('fan', [
    '..ttttt..',
    '.tTtItTt.',
    'tTtIiItTt',
    '.tTtItTt.',
    '..ttttt..',
    '....i....',
    '....i....',
    '....i....',
    '....i....',
    '....i....',
    '..iiiii..',
  ]);
  D('bunk-bed', [
    'O..............................O',
    'O..............................O',
    'O.www.......jjjjjjjjjjjjjjjjj..O',
    'OwwwwwjjjjjjjjjjjjjjjjjjjjjjjjjO',
    'OccccccccccccccccccccccccccccccO',
    'OooooooooooooooooooooooooooooooO',
    'O........................O.....O',
    'O........................OOOOOOO',
    'O........................O.....O',
    'O........................OOOOOOO',
    'O........................O.....O',
    'O........................OOOOOOO',
    'O.www.......vvvvvvvvvvvvvvvvv..O',
    'OwwwwwvvvvvvvvvvvvvvvvvvvvvvvvvO',
    'OccccccccccccccccccccccccccccccO',
    'OooooooooooooooooooooooooooooooO',
    'O..............................O',
    'O..............................O',
  ]);
  T('laundry-basket', ['..w.j..v..', '.wwjjjvv..', 'yyyyyyyyyy', 'yYyYyYyYyY', 'YyYyYyYyYy', 'yYyYyYyYyY', '.YyYyYyYy.', '.yyyyyyyy.']);
  /* ---------- kitchen ---------- */
  D('fridge', [
    'PPPPPPPPPPPP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwtwP',
    'PwwwwwwwwtwP',
    'PwwwwwwwwtwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PAAAAAAAAAAP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwtwP',
    'PwwwwwwwwtwP',
    'PwwwwwwwwtwP',
    'PwwwwwwwwtwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PwwwwwwwwwwP',
    'PPPPPPPPPPPP',
    'I..........I',
  ]);
  vary('fridge-old', 'fridge', {
    swap: { w: 'P', P: 'a', t: 'u' },
    put: [
      [2, 20, 'uu'],
      [7, 23, 'u'],
      [3, 12, 'A'],
    ],
  });
  vary('icebox', 'fridge', { swap: { w: 'o', P: 'O', t: 'G', A: 'O' } });
  D('cooker', [
    'IIIIIIIIIIIIII',
    'InnInnIInnInnI',
    'wwwwwwwwwwwwww',
    'wIwIwIwIwwwwww',
    'wwwwwwwwwwwwww',
    'wttttttttttttw',
    'wwwwwwwwwwwwww',
    'wwnnnnnnnnnnww',
    'wwn11111111nww',
    'wwn11111111nww',
    'wwn11111111nww',
    'wwn11111111nww',
    'wwnnnnnnnnnnww',
    'wwwwwwwwwwwwww',
    'wwwwwwwwwwwwww',
    'I............I',
  ]);
  vary('oven-old', 'cooker', {
    swap: { w: 'P', 1: 'n', t: 'u' },
    put: [
      [4, 10, 'ff'],
      [8, 14, 'u'],
    ],
  });
  D('stove-iron', [
    '.....II.......',
    '.....II.......',
    '.....II.......',
    '.....II.......',
    '.....II.......',
    'IIIIIIIIIIIIII',
    'iiiiiiiiiiiiii',
    'iIiiiIIIIIIiIi',
    'iIiiiIffFfIiIi',
    'iIiiiIfFffIiIi',
    'iIiiiIIIIIIiIi',
    'iiiiiiiiiiiiii',
    'iIIIIIIIIIIIIi',
    'iiiiiiiiiiiiii',
    'II..........II',
    'II..........II',
  ]);
  T('microwave', ['PPPPPPPPPPPP', 'PnnnnnnnnPIP', 'Pn111111nPiP', 'Pn111111nPIP', 'PnnnnnnnnPiP', 'PPPPPPPPPPPP']);
  T('toaster', ['..OO.OO..', '.ttttttt.', 'tTtttttIt', 'tTtttttIt', 'ttttttttt', 'I.......I']);
  T('kettle', ['...II...', '..tttt.t', '.tTtttt.', 'ItTttttt', 'I.tttttt', 'I.tttttt', '..IIIIII']);
  vary('kettle-copper', 'kettle', { swap: { t: '0', T: '9', I: 'u' } });
  T('blender', ['.IIII.', '.2222.', '.2772.', '.2772.', '.2222.', '..22..', '.IIII.', '.IRII.', 'IIIIII']);
  D('kitchen-sink', [
    '......tt......',
    '......t.tt....',
    '......t..t....',
    'PPPPPPPPPPPPPP',
    'PnnnnnnnnnnnnP',
    'P.P........P.P',
    'wwwwwwwwwwwwww',
    'wWwwwwwWwwwwwW',
    'wWwwGwwWwwGwwW',
    'wWwwwwwWwwwwwW',
    'wWwwwwwWwwwwwW',
    'wWwwwwwWwwwwwW',
    'wWwwwwwWwwwwwW',
    'wwwwwwwwwwwwww',
    'AAAAAAAAAAAAAA',
  ]);
  vary('sink-stone', 'kitchen-sink', { swap: { P: 'l', w: 's', W: 'd', A: 'd', G: 'i' } });
  vary('sink-dirty', 'kitchen-sink', {
    swap: { w: 'P', W: 'a', P: 'a' },
    put: [
      [4, 4, 'LLL'],
      [3, 8, 'u'],
      [9, 11, 'uu'],
      [6, 3, 'L'],
    ],
  });
  D('kitchen-counter', [
    'qqqqqqqqqqqqqqqqqqqq',
    'pppppppppppppppppppp',
    'ooooooooooOooooooooo',
    'oOOOOOOOOoOoOOOOOOOo',
    'oOoooooooOoOoooooOoo',
    'oOooooooGOoOGooooOoo',
    'oOoooooooOoOoooooOoo',
    'oOoooooooOoOoooooOoo',
    'oOoooooooOoOoooooOoo',
    'oOOOOOOOOoOoOOOOOOOo',
    'oooooooooooooooooooo',
    'OOOOOOOOOOOOOOOOOOOO',
  ]);
  vary('kitchen-counter-drawers', 'kitchen-counter', {
    put: [
      [1, 5, 'OOOOOOOOO'],
      [1, 7, 'OOOOOOOOO'],
      [4, 4, 'GG'],
      [4, 6, 'GG'],
      [4, 8, 'GG'],
      [8, 5, 'O'],
    ],
  });
  D('washing-machine', [
    'PPPPPPPPPPPP',
    'PwIwIwwRwwwP',
    'PwwwwwwwwwwP',
    'Pwwwttttwwwp',
    'Pwwt1111twwP',
    'Pwt112211twP',
    'Pwt121111twP',
    'Pwt111111twP',
    'Pwwt1111twwP',
    'Pwwwttttwwwp',
    'PwwwwwwwwwwP',
    'PPPPPPPPPPPP',
    'I..........I',
  ]);
  T('frying-pan', ['.IIIII.....', 'IiiiiiIOOOO', '.IIIII.....']);
  T('cooking-pot', ['I.tttttt.I', 'IITTttttII', '.tTtttttt.', '.tTtttttt.', '..tttttt..']);
  T('kitchen-knife', ['TTTTTT....', '.ttttTOOOO']);
  T('fork', ['t.t.t', 't.t.t', 'ttttt', '..t..', '..t..', '..t..', '..t..']);
  T('spoon', ['.ttt.', 'tTttt', '.ttt.', '..t..', '..t..', '..t..', '..t..']);
  T('plate', ['.wwwwww.', 'wWWWWWWw', '.wwwwww.']);
  T('bowl', ['wwwwwwww', 'wWWWWWWw', '.wwwwww.', '..wwww..']);
  T('glass', ['2..2', '2332', '2332', '2332', '.22.']);
  T('teacup', ['wwwww.', 'w000ww', 'wwwwww', '.www..', 'WWWWW.']);
  T('teapot', ['...ww....', '.wwwwww..', 'wwWwwwww.', 'wwWwwwwww', '.wWwwww.w', '.wwwwww..', '..WWWW...']);
  T('chopping-board', ['....tttt..', 'qqqqqqqqqq', 'pppppppppO']);
  T('rolling-pin', ['OOqqqqqqOO']);
  T('whisk', ['.ttt.', 't.t.t', 't.t.t', '.ttt.', '..O..', '..O..', '..O..']);
  T('spatula', ['IIII', 'I..I', 'IIII', '.II.', '.O..', '.O..', '.O..']);
  T('oven-glove', ['.RRR..', 'RRRRR.', 'RRRRRR', 'RRRRR.', '.vvv..', '.vvv..']);
  D('bin', ['.IIIIIII.', 'ttttttttt', '.tItItIt.', '.tItItIt.', '.tItItIt.', '.tItItIt.', '.tItItIt.', '.tItItIt.', '.ttttttt.']);
  T('jar', ['.OOO.', '22222', '29992', '29992', '29992', '22222']);
  T('salt-pepper', ['.t..t.', 'ww.nn', 'ww.nn', 'ww.nn', 'WW.II']);
  /* ---------- bathroom ---------- */
  D('bathtub', [
    '..tt..........................',
    '..t...........................',
    '.tt...........................',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wPPPPPPPPPPPPPPPPPPPPPPPPPPPPw',
    '.wwwwwwwwwwwwwwwwwwwwwwwwwwww.',
    '.wwwwwwwwwwwwwwwwwwwwwwwwwwww.',
    '.wwwwwwwwwwwwwwwwwwwwwwwwwwww.',
    '.wwwwwwwwwwwwwwwwwwwwwwwwwwww.',
    '..wwwwwwwwwwwwwwwwwwwwwwwwww..',
    '..PPPPPPPPPPPPPPPPPPPPPPPPPP..',
    '...G....................G.....',
    '..GG....................GG....',
  ]);
  vary('bathtub-clawfoot', 'bathtub', { swap: { w: 'P', P: 'a' } });
  vary('bathtub-filled', 'bathtub', {
    swap: { P: '3' },
    put: [
      [4, 3, '33333333333333333333'],
      [10, 2, '2..2....2'],
    ],
  });
  vary('bathtub-stained', 'bathtub', {
    swap: { w: 'P', P: 'a' },
    put: [
      [6, 5, 'uu'],
      [7, 6, 'u'],
      [7, 7, 'u'],
      [18, 5, 'rrr'],
      [19, 6, 'r'],
      [19, 7, 'r'],
      [19, 8, 'r'],
      [12, 4, 'LL'],
    ],
  });
  vary('water-therapy-tub', 'bathtub', {
    swap: { w: 't', P: 'i', G: 'I' },
    put: [
      [5, 3, 'cccccccccccccccccccccc'],
      [5, 2, 'x..'],
      [1, 3, 'cccc'],
    ],
  });
  D('shower', [
    '..tttttttt..',
    '..t......T..',
    '..t.....TTT.',
    '..t.....2.2.',
    '..t....2.2..',
    '..t.....2.2.',
    '..t....2.2..',
    '..t.....2.2.',
    '..t....2.2..',
    '..t.....2.2.',
    '..t....2.2..',
    '..t.....2.2.',
    '..t....2.2..',
    '..t.....2.2.',
    '..t....2.2..',
    '..t.....2.2.',
    '..t....2.2..',
    'wwwwwwwwwwww',
    'WWWWWWWWWWWW',
  ]);
  D('toilet', [
    'wwwwww...',
    'wwwwww...',
    'wwwwwt...',
    'wwwwww...',
    'wwwwww...',
    '.ww......',
    '.wwwwwwww',
    '.wWWWWWWw',
    '.wwwwwwww',
    '..wwwwww.',
    '...wwww..',
    '...wwww..',
    '..wwwwww.',
  ]);
  vary('toilet-old', 'toilet', { swap: { w: 'P', W: 'a', t: 'G' }, put: [[1, -0, '']] });
  vary('toilet-dirty', 'toilet', {
    swap: { w: 'P', W: 'L' },
    put: [
      [4, 9, 'uu'],
      [5, 10, 'u'],
      [2, 3, 'L'],
    ],
  });
  vary('toilet-broken', 'toilet', {
    swap: { w: 'P', W: 'n' },
    put: [
      [0, 0, '..   .'],
      [0, 1, '.     '],
      [3, 2, 'n'],
      [4, 3, 'nn'],
      [7, 12, '3333'],
    ],
  });
  D('bathroom-sink', [
    '....tt....',
    '....t.....',
    'wwwwwwwwww',
    'wWWWWWWWWw',
    '.wwwwwwww.',
    '..wwwwww..',
    '....ww....',
    '....ww....',
    '....ww....',
    '....ww....',
    '....ww....',
    '....ww....',
    '...wwww...',
  ]);
  vary('washbasin', 'bathroom-sink', { swap: { w: 'P', W: 'a', t: 'G' } });
  vary('washbasin-bloody', 'bathroom-sink', {
    swap: { w: 'P', W: 'r', t: 'G' },
    put: [
      [2, 4, 'r'],
      [2, 5, 'r'],
      [7, 4, 'r'],
      [3, 12, 'rr'],
    ],
  });
  T('toilet-paper', ['.www.', 'wwaww', 'wwaww', '.www.']);
  T('toothbrush', ['ww.......', 'JJJJJJJJJ']);
  T('toothpaste', ['R.wwwwww', 'RwwwJJww', 'R.wwwwww']);
  T('soap', ['.777777.', '77777777', '.777777.']);
  T('towel', ['jjjjjjjj', 'jJJJJJJj', 'jjjjjjjj', 'wwwwwwww', 'jjjjjjjj', 'jjjjjjjj']);
  T('rubber-duck', ['..66...', '.6n66..', '99666..', '.666666', '6666666', '.66666.']);
  T('shampoo', ['.ww.', '.44.', '4444', '4w44', '4w44', '4444', '4444']);
  T('hairdryer', ['IIIIIIII', 'IiiiiiII', 'IIIIIIII', '..II....', '..II....', '..II....']);
  T('comb', ['OOOOOOOOO', 'O.O.O.O.O', 'O.O.O.O.O']);
  T('mirror-cabinet', [
    'PPPPPPPPPPPP',
    'P2221P2221wP',
    'P2211P2211wP',
    'P2111P2111wP',
    'P1111P1111wP',
    'P1111P1111wP',
    'P1111P1111wP',
    'PPPPPPPPPPPP',
  ]);
  T('towel-rail', ['t..........t', 'tttttttttttt', 't.PPPP.cccc.', '..PPPP.cccc.', '..PPPP.cccc.', '..PaaP.cccc.', '..PPPP......']);
  T('bucket-and-mop', [
    '.......O.',
    '.......O.',
    '.......O.',
    '.......O.',
    '.......O.',
    '.......O.',
    't.....tO.',
    'ttttttt O',
    'tTtttttwO',
    'tTtttttww',
    '.tTtttwww',
    '.ttttt.ww',
  ]);
  /* ---------- garden and garage ---------- */
  D('lawnmower', [
    '..........II',
    '.........I..',
    '........I...',
    '.......I....',
    '......I.....',
    '.RRRRRI.....',
    'RRRRRRRR....',
    'RvvvvvvR....',
    'nn....nn....',
    'nn....nn....',
  ]);
  T('watering-can', ['.....ttt..', 't...t...t.', '.t.tttttt.', '..ttTtttt.', '...tTtttt.', '...tTtttt.', '...tttttt.']);
  T('garden-hose', ['.HHHHH.', 'HMHHHMH', 'HH...HH', 'HM...MH', 'HH...HH', 'HMHHHMH', '.HHHHHtt']);
  T('flower-pot', ['.R.', 'RHR', '.H.', '000', '000', '.u.']);
  D('wheelbarrow', [
    'tttttttttttt....',
    '.tTttttttttOOOOO',
    '..tTtttttt......',
    '...tttttt.......',
    '...nn...O.......',
    '..nnnn..O.......',
    '...nn...O.......',
  ]);
  vary('wheelbarrow-old', 'wheelbarrow', {
    swap: { t: 'u', T: '0', n: 'I' },
    put: [
      [4, 0, 'M'],
      [7, 1, 'U'],
    ],
  });
  T('garden-gnome', ['..R..', '.RRR.', '.RRR.', '.xxx.', '.wxw.', '.www.', 'jjwjj', 'jjjjj', '.jjj.', '.O.O.']);
  vary('gnome-old', 'garden-gnome', {
    swap: { R: 'u', j: 'N', x: 'a', w: 'P' },
    put: [
      [1, 7, 'M'],
      [3, 2, 'm'],
    ],
  });
  vary('gnome-broken', 'garden-gnome', {
    swap: { R: 'u', j: 'N', x: 'a', w: 'P' },
    put: [
      [0, 0, '     '],
      [0, 1, '     '],
      [0, 2, '     '],
      [0, 3, '.  a.'],
      [5, 9, '.uu'],
      [6, 8, 'u'],
    ],
  });
  T('bird-house', [
    '...O...',
    '..OOO..',
    '.OOOOO.',
    'OOOOOOO',
    '.ppppp.',
    '.ppnpp.',
    '.ppppp.',
    '.ppppp.',
    '...O...',
    '...O...',
    '...O...',
    '...O...',
    '...O...',
    '...O...',
    '...O...',
    '...O...',
  ]);
  D('barbecue', [
    '..IIIIIIII..',
    '.IIIIIIIIII.',
    'IIfIFIfIFIII',
    '.IIIIIIIIII.',
    '..IIIIIIII..',
    '..I......I..',
    '..I......I..',
    '..I......I..',
    '.I........I.',
    '.I........I.',
  ]);
  T('deck-chair', [
    'q...........',
    'qR..........',
    'q.Rw........',
    '.q.Rw.......',
    '.q..Rw......',
    '..q..Rwq....',
    '..q.qqRwq...',
    '...qqq.Rwq..',
    '..qq....R.q.',
    '.q.......qqq',
    'q..........q',
  ]);
  T('parasol', [
    '......RR......',
    '....RRwwRR....',
    '..RRwwRRwwRR..',
    'RRwwRRwwRRwwRR',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '......tt......',
    '....tttttt....',
  ]);
  T('paddling-pool', [
    'JJJJJJJJJJJJJJJJJJJJJJ',
    'J22222222222222222222J',
    'JJ323332333233323332JJ',
    'jJJJJJJJJJJJJJJJJJJJJj',
    '.jjjjjjjjjjjjjjjjjjjj.',
  ]);
  D('swing-set', [
    'tttttttttttttttttttttt',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..I........I...tt..',
    '.tt..IOOOOOOOOI...tt..',
    '.tt...............tt..',
    '.tt...............tt..',
    '.tt...............tt..',
    'tt.................tt.',
    'tt.................tt.',
  ]);
  D('slide', [
    '.tt.t...............',
    '.tt.tt..............',
    '.ttttRR.............',
    '.tt.t.RRR...........',
    '.tt.t...RRR.........',
    '.ttttt....RRR.......',
    '.tt.t.......RRR.....',
    '.tt.t.........RRR...',
    '.ttttt..........RRR.',
    '.tt.t.............RR',
    '.tt.t...............',
    '.ttttt..............',
    '.tt.t...............',
    '.tt.t...............',
  ]);
  D('dog-house', [
    '......RRRR......',
    '....RRRRRRRR....',
    '..RRRRRRRRRRRR..',
    'RRRRRRRRRRRRRRRR',
    '.pppppppppppppp.',
    '.ppppnnnnnnpppp.',
    '.pppnnnnnnnnppp.',
    '.pppnnnnnnnnppp.',
    '.pppnnnnnnnnppp.',
    '.pppnnnnnnnnppp.',
    '.pppnnnnnnnnppp.',
  ]);
  vary('kennel-old', 'dog-house', {
    swap: { R: 'O', p: 'a' },
    put: [
      [2, 3, 'M'],
      [10, 2, 'm'],
      [12, 7, 'A'],
      [2, 9, 'A'],
      [9, 10, 'tI'],
    ],
  });
  T('hammock', [
    'O......................O',
    'Oc....................cO',
    'O.cc................cc.O',
    'O...cccc........cccc...O',
    'O.......cccccccc.......O',
    'O......................O',
    'O......................O',
    'O......................O',
    'O......................O',
    'O......................O',
    'O......................O',
    'O......................O',
  ]);
  T('washing-line', [
    'O........................O',
    'OttttttttttttttttttttttttO',
    'O.www..jjj..RR.wwww......O',
    'O.www..jjj..RR.wwww......O',
    'O.www..j.j..RR.wwww......O',
    'O.www..j.j.....wwww......O',
    'O..............wwww......O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
    'O........................O',
  ]);
  vary('washing-line-sheets', 'washing-line', {
    swap: { j: 'P', R: 'P', w: 'P', O: 'E' },
    put: [
      [2, 6, 'PPP....PP..PPPP'],
      [2, 7, 'PPP....PP..PPPP'],
      [2, 8, 'P.P....P...PrPP'],
      [15, 9, 'PrrP'],
      [15, 10, 'P.rP'],
      [15, 11, 'P..P'],
    ],
  });
  T('paint-can', ['.ttttt.', 'wwwwwww', 'wRRRRRw', 'wwwwwww', 'wwwwwww']);
  T('tyre', ['..nnnnnn..', '.nnIIIInn.', 'nnI....Inn', 'nnI....Inn', 'nnI....Inn', 'nnI....Inn', '.nnIIIInn.', '..nnnnnn..']);
  T('fuel-can', ['.II..nn.', 'RRRRRRR.', 'RvRRRvR.', 'RRvRvRR.', 'RRRvRRR.', 'RRvRvRR.', 'RvRRRvR.', 'RRRRRRR.']);
  T('cardboard-box', [
    '.qqqqqqqqqq.',
    'qqpqqqqqqpqq',
    'pppppppppppp',
    'pppppOOppppp',
    'pppppppppppp',
    'pppppppppppp',
    'pppppppppppp',
    'pppppppppppp',
  ]);
  T('vacuum-cleaner', ['......II', '......I.', '.....I..', '.....I..', '....I...', '....I...', '.RRRI...', 'RRRRRR..', 'RRvRRR..', 'nnRRnn..']);
  T('iron', ['..IIII..', '.tttttI.', 'tTtttttI', 'tttttttt']);
  T('light-bulb', ['.FFF.', 'FFwFF', 'FFFFF', '.FFF.', '.ttt.', '.ttt.'], { outline: false });
  /* ---------- the attic ---------- */
  T('rocking-chair-doll', [
    '...OO........',
    '...Oo........',
    '...Oo.bb.....',
    '...Oobxxb....',
    '...Oo.xx.....',
    '...Oo7777....',
    '...Oo7777....',
    '...OOOOOOOO..',
    '...Ooooooo...',
    '...O.....O...',
    '...O.....O...',
    'O..O.....O..O',
    '.OOOOOOOOOOO.',
  ]);
  T('rocking-horse-old', [
    '.........OOO..',
    '........OpppO.',
    '.......Oppnpp.',
    '.......OpppOO.',
    '..O..vvvppp...',
    '.OpppvvvppO...',
    '.OppppppppO...',
    '..pppppppp....',
    '..pO....pO....',
    '..pO....pO....',
    'O.pO....pO...O',
    '.OOOOOOOOOOOO.',
  ]);
  D('toy-chest', [
    '.OOOOOOOOOOOOOOOO.',
    'OjjjjjjjjjjjjjjjjO',
    'OjjjjjjjGGjjjjjjjO',
    'OOOOOOOOGGOOOOOOOO',
    'OjjjjjjjjjjjjjjjjO',
    'OjjjjFjjjjjjFjjjjO',
    'OjjjFFFjjjjFFFjjjO',
    'OjjjjFjjjjjjFjjjjO',
    'OjjjjjjjjjjjjjjjjO',
    'OOOOOOOOOOOOOOOOOO',
  ]);
  vary('toy-chest-open', 'toy-chest', {
    put: [
      [0, 0, 'OOOOOOOOOOOOOOOOOO'],
      [0, 1, 'OnnRnnbbnnnn8nnnnO'],
      [0, 2, 'OnRRRnbxbnn888nnnO'],
    ],
  });
  vary('chest-cobwebbed', 'toy-chest', {
    swap: { j: 'o', F: 'o' },
    put: [
      [1, 1, 'W.W'],
      [1, 2, 'WW'],
      [1, 3, 'W'],
      [13, 1, 'W.WW'],
      [15, 2, 'WW'],
      [16, 3, 'W'],
      [2, 4, 'W'],
    ],
  });
  D('dolls-house', [
    '.......RRRR.......',
    '.....RRRRRRRR.....',
    '...RRRRRRRRRRRR...',
    '.RRRRRRRRRRRRRRRR.',
    'RRRRRRRRRRRRRRRRRR',
    '.cccccccccccccccc.',
    '.cc99cc9999cc99cc.',
    '.cc99cc9999cc99cc.',
    '.cccccccccccccccc.',
    '.cOOOOOOOOOOOOOOc.',
    '.cc11cccvvccc11cc.',
    '.cc11cccvvccc11cc.',
    '.cccccccvGccccccc.',
    '.cccccccvvccccccc.',
    'OOOOOOOOOOOOOOOOOO',
  ]);
  T('doll-porcelain', ['.OOOO.', 'OwwwwO', 'OnwwnO', '.wRRw.', '.7777.', 'w7777w', 'w7777w', '.7777.', '777777', '.w..w.', '.n..n.']);
  vary('doll-rag', 'doll-porcelain', {
    swap: { w: 'y', 7: '4', O: 'R', n: 'O' },
    put: [
      [1, 2, 'k'],
      [4, 2, 'k'],
    ],
  });
  vary('doll-broken', 'doll-porcelain', {
    swap: { 7: 'a' },
    put: [
      [1, 2, 'nn'],
      [1, 1, 'n'],
      [0, 5, '.'],
      [0, 6, '.'],
      [1, 9, '.'],
      [1, 10, '.'],
    ],
  });
  vary('doll-headless', 'doll-porcelain', {
    swap: { 7: 'P' },
    put: [
      [0, 0, '      '],
      [0, 1, '      '],
      [0, 2, '      '],
      [0, 3, '..rr..'],
      [8, 9, 'OO'],
      [7, 10, 'wwww'],
    ],
  });
  T('teddy-old', ['oo..oo', 'oooooo', 'onoono', 'ooqqoo', '.oooo.', 'oooooo', 'ooqqoo', 'ooqqoo', '.oooo.', 'oo..oo']);
  vary('teddy-one-eyed', 'teddy-old', {
    swap: { o: 'e', q: 'o' },
    put: [
      [4, 2, 'e'],
      [3, 6, 'w'],
      [5, 5, '.'],
      [5, 6, '.'],
    ],
  });
  T('music-box', ['OOOOOOOO', 'OGooooGO', 'OooggooO', 'OGooooGO', 'OOOOOOOO']);
  vary('music-box-open', 'music-box', { put: [[0, -0, '']], solid: false });
  vary('cursed-music-box', 'music-box', { swap: { o: '5', g: 'r', O: 'n' } });
  T('spinning-top-tin', ['...t...', '...t...', '.RRRRR.', 'RgRgRgR', '.jjjjj.', '..jjj..', '...j...']);
  D('pram-old', [
    '........nnnnnn..',
    '......nnNNNNNn..',
    '.....nNNNNNNNn..',
    'I...nNNNNNNNNn..',
    '.I..nnnnnnnnnn..',
    '..InNNNNNNNNNn..',
    '...nNNNNNNNNNn..',
    '....nnnnnnnnn...',
    '....I.......I...',
    '...ttt.....ttt..',
    '..tI.It...tI.It.',
    '..tI.It...tI.It.',
    '...ttt.....ttt..',
  ]);
  D('furniture-covered', [
    '....wwwwwwwwwwww....',
    '..wwwwwWwwwwwWwwww..',
    '.wwwWwwwwwwwwwwwWww.',
    '.wwwWwwwwWwwwwwwWww.',
    'wwwwWwwwwWwwwwwwwWww',
    'wwwWwwwwwWwwwwWwwWww',
    'wwwWwwwwwWwwwwWwwwWw',
    'wwwWwwwWwwWwwwWwwwWw',
    'wwWwwwwWwwWwwwwWwwWw',
    'wwWwwwwWwwWwwwwWwwww',
    'wwWwwwwWwwwWwwwWwwww',
    'wwwwwwwWwwwWwwwwwwww',
    '.wwwwwwwwwwwwwwwwww.',
  ]);
  D('furniture-covered-figure', [
    '.....wwww.....',
    '....wwwwww....',
    '....wnwwnw....',
    '....wwwwww....',
    '...wwwWwwww...',
    '..wwwwWwwwww..',
    '..wwWwwwwWww..',
    '.wwwWwwwwWwww.',
    '.wwWwwwwwwWww.',
    '.wwWwwwWwwWww.',
    '.wwWwwwWwwWww.',
    'wwwWwwwWwwwWww',
    'wwWwwwwWwwwWww',
    'wwWwwwWwwwwWww',
    'wwWwwwWwwwwwWw',
    'wwWwwwWwwwwwWw',
    'wwwwwwWwwWwwWw',
    'wwwwwwwwwWwwww',
    '.wwwwwwwwwwww.',
  ]);
  T('hat-boxes', [
    '...7777777...',
    '...7W77777...',
    '...7777777...',
    '.44444444444.',
    '.4444W444444.',
    '.44444444444.',
    'ccccccccccccc',
    'cccvvvvvvvccc',
    'ccccccccccccc',
    'ccccccccccccc',
  ]);
  D('suitcases-old', [
    '...oooooooooo...',
    '...oOooGGooOo...',
    '...oooooooooo...',
    '.eeeeeeeeeeeeee.',
    '.eEeeeeGGeeeeEe.',
    '.eEeeeeeeeeeeEe.',
    '.eeeeeeeeeeeeee.',
    '0000000000000000',
    '0u000000GG0000u0',
    '0u000000000000u0',
    '0u000000000000u0',
    '0000000000000000',
  ]);
  T('suitcase-open', [
    'oooooooooooooo',
    'oqqqqqqqqqqqqo',
    'oqqwwwqqjjjqqo',
    'oqqqqqqqqqqqqo',
    'oooooooooooooo',
    'oOwwwwjjjvvvOo',
    'oOwwwwjjjvvvOo',
    'oooooooooooooo',
  ]);
  D('mannequin', [
    '....cccc....',
    '....cccc....',
    '....cccc....',
    '.....cc.....',
    '..cccccccc..',
    '.cccccccccc.',
    '.cc.cccc.cc.',
    '.cc.cccc.cc.',
    '.cc.cccc.cc.',
    '.cc..cc..cc.',
    '.cc.cccc.cc.',
    '.c..cccc..c.',
    '....cccc....',
    '....c..c....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '.....tt.....',
    '...tttttt...',
  ]);
  vary('mannequin-broken', 'mannequin', {
    swap: { c: 'P' },
    put: [
      [0, 5, '.  '],
      [0, 6, '.  '],
      [0, 7, '.  '],
      [0, 8, '.  '],
      [0, 9, '.  '],
      [0, 10, '.  '],
      [0, 11, '. '],
      [5, 1, 'n'],
      [6, 2, 'nn'],
      [0, 28, 'PP'],
      [0, 29, 'PPP'],
    ],
  });
  vary('dress-form', 'mannequin', {
    swap: { c: 'y' },
    put: [
      [0, 0, '            '],
      [0, 1, '            '],
      [0, 2, '            '],
      [0, 3, '.....OO.....'],
      [0, 6, '. '],
      [0, 7, '. '],
      [0, 8, '. '],
      [0, 9, '. '],
      [0, 10, '. '],
      [0, 11, '. '],
      [9, 6, '  '],
      [9, 7, '  '],
      [9, 8, '  '],
      [9, 9, '  '],
      [9, 10, '  '],
      [10, 11, ' '],
    ],
  });
  vary('dress-form-gown', 'dress-form', {
    swap: { y: 'w' },
    put: [
      [3, 14, 'wwwwww'],
      [3, 15, 'wwWwww'],
      [2, 16, 'wwwWwwww'],
      [2, 17, 'wwwWwwww'],
      [2, 18, 'wwWwwWww'],
      [1, 19, 'wwwWwwWwww'],
      [1, 20, 'wwwWwwWwww'],
      [1, 21, 'wwWwwwWwww'],
      [1, 22, 'wwWwwwwWww'],
      [0, 23, 'wwwWwwwwWwww'],
      [0, 24, 'wwwWwwwwWwww'],
      [0, 25, 'wwWwwwwwWwww'],
      [0, 26, 'wwWwwwwwwWww'],
      [0, 27, 'wwWwwwwwwWww'],
      [0, 28, 'wwwwwwwwwwww'],
      [0, 29, 'WWWWWWWWWWWW'],
    ],
  });
  T('birdcage-empty', [
    '....GG....',
    '...GGGG...',
    '..G.G.GG..',
    '.G.G.G.GG.',
    'G.G.G.G.GG',
    'G.G.G.G.GG',
    'G.G.G.G.GG',
    'G.G.G.G.GG',
    'G.GOOOG.GG',
    'G.G.G.G.GG',
    'G.G.G.G.GG',
    'GGGGGGGGGG',
  ]);
  vary('birdcage-bird', 'birdcage-empty', {
    put: [
      [4, 6, '66'],
      [3, 7, '9666'],
    ],
  });
  vary('birdcage-dead', 'birdcage-empty', { swap: { G: 'u' }, put: [[3, 10, '6b66']] });
  D('chairs-stacked', [
    '..O......O..',
    '..OOOOOOOO..',
    '..O......O..',
    '.oOoooooooo.',
    '.o.O....O.o.',
    '.oOOOOOOOOo.',
    '.o.O....O.o.',
    'oooooooooooo',
    'o.o......o.o',
    'oooooooooooo',
    'o.o......o.o',
    'o.o......o.o',
    'o.o......o.o',
    'o.o......o.o',
  ]);
  T('jack-in-box-old', [
    '..R.R..',
    '.RRRRR.',
    '.wnwnw.',
    '.wwRww.',
    '..www..',
    '..tTt..',
    '..TtT..',
    '..tTt..',
    'jjjjjjj',
    'jRjjjRj',
    'jjjFjjj',
    'jRjjjRj',
    'jjjjjjj',
  ]);
  T('toy-blocks', ['....RRRR....', '....RwwR....', '....RwRR....', '....RRRR....', 'jjjj....8888', 'jwwj6666w888', 'jwjj6ww6w8w8', 'jjjj6666888w']);
  T('toy-soldier', ['.nn.', '.nn.', '.xx.', 'RRRR', 'RRRR', 'jjjj', 'j..j', 'n..n']);
  T('toy-train-old', ['.n......RRRR', '.n.IIII.R11R', 'IIIIIIIIRRRR', 'IRIIIIIIRRRR', 'tItItItItItI', '.I...I...I..']);
  T('marionette', [
    'O.....O',
    'OOOOOOO',
    '.t...t.',
    '.t...t.',
    '.txxxt.',
    '.tnxnt.',
    '.txRxt.',
    '.tjjjt.',
    'xjjjjjx',
    '..jjj..',
    '..j.j..',
    '..x.x..',
    '..O.O..',
  ]);
  T('crib-mobile', ['.....t.....', '.ttttttttt.', '.t...t...t.', '.t...t...t.', '.F...t...j.', 'FFF.RRR.jjj', '.F..RRR..j.']);
  T('carpet-rolled', ['vvvvvvvvvvvvvvvvvvvvvvVV.', 'vgvvvgvvvgvvvgvvvgvvvVccV', 'vvvvvvvvvvvvvvvvvvvvvVccV', 'VVVVVVVVVVVVVVVVVVVVVVVV.']);
  T('picture-frames-stack', [
    'GGGGGGGGGG....',
    'GnnnnnnnnGOO..',
    'GnnnnnnnnGcOGG',
    'GnnnnnnnnGcOnG',
    'GnnnnnnnnGcOnG',
    'GnnnnnnnnGcOnG',
    'GnnnnnnnnGcOnG',
    'GnnnnnnnnGcOnG',
    'GnnnnnnnnGcOnG',
    'GGGGGGGGGGOOGG',
  ]);
  D('sewing-machine', [
    '...IIIIIIIII..',
    '..IIgIIIIIIII.',
    '..II.....IIII.',
    '..I......IIII.',
    '..t......IIII.',
    'IIIIIIIIIIIIII',
    'oooooooooooooo',
    '.O..........O.',
    '.O.IIIIII...O.',
    '.O.I.II.I...O.',
    '.O.IIIIII...O.',
    '.O..........O.',
    '.OIIIIIIIIIIO.',
    '.O..........O.',
  ]);
  D('spinning-wheel', [
    '......OOOOOO....',
    '....OO..O...OO..',
    '...O....O.....O.',
    '..O.....O......O',
    '..O.....O......O',
    '..OOOOOOOOOOOOOO',
    'O.O.....O......O',
    'O.O.....O......O',
    'OO.O....O.....O.',
    'O...OO..O...OO..',
    'OOOOOOOOOOOOOOO.',
    'O.O...........O.',
    'O.O...........O.',
  ]);
  T('box-junk', ['..t....O..R.', '.ttw..OO.RR.', 'pppppppppppp', 'pppppOOppppp', 'pppppppppppp', 'pppppppppppp', 'pppppppppppp', 'pppppppppppp']);
  T('gramophone-records', ['nnnnnnnn..', 'nnInnnIn..', 'nnnRRnnn..', 'nnnRRnnnnn', 'nnInnnInIn', 'nnnnnnnnnn']);
  T('christmas-box', ['..g..R..8...', '.ggg.R.888..', 'pppppppppppp', 'ppRRRRRRRRpp', 'pppppppppppp', 'pppppppppppp', 'pppppppppppp']);
  T('moth-coat', [
    '....tt....',
    '...t..t...',
    '..eeeeee..',
    '.eeeeeeee.',
    'eeeEeeEeee',
    'eee.eEe.ee',
    'ee.eeEeeee',
    'eeeeeEee.e',
    'eeEeeEeeee',
    'ee.eeEeeee',
    'eeeeeEe.ee',
    'eeeeeEeeee',
    '.eee.Eeee.',
    '.eeeeEeee.',
  ]);
  D('water-tank', [
    '..tttttttttttt..',
    '.tTTTTTTTTTTTTt.',
    'tttttttttttttttt',
    'tTttttttttttuttt',
    'tTtttttttttuuttt',
    'tTttttttttttuttt',
    'tTttttttttttuttt',
    'tTtttttttttttttt',
    'tTtttttttttttttt',
    'tttttttttttttttt',
    '.I............I.',
    '.I............I.',
  ]);
  T('bat-roost', ['OOOOOOOOOOOOOOOO', '.I..I...I..I..I.', '.n..n...n..n..n.', 'nnn.nn.nnn.nn.nn', 'nRn.nn.nRn.nn.nn', '.n..n...n..n..n.']);
  /* ---------- the household: kitchen, wash house, cellar ---------- */
  T('hanging-pots', ['IIIIIIIIIIIIIIII', '.I....I....I..I.', '.I....I....I..I.', '0000.ttt..000.I.', '0000.ttt..000III', '.00..ttt...0.III']);
  D('jar-shelves', [
    'OOOOOOOOOOOOOO',
    'O.OO.OO..OO..O',
    'O2222229.2222O',
    'O2992L29.2rr2O',
    'OOOOOOOOOOOOOO',
    'O.OO..OO.OO..O',
    'O2222.222222.O',
    'O2LL2.2992y2.O',
    'OOOOOOOOOOOOOO',
    'O.OO.OO.OO...O',
    'O222222222...O',
    'O2rr2992L2...O',
    'OOOOOOOOOOOOOO',
  ]);
  vary('pantry-shelves', 'jar-shelves', { swap: { 2: 'c', 9: 'y', L: 'c', r: 'u' } });
  vary('preserve-shelves', 'jar-shelves', { swap: { 9: 'r', L: 'v', O: 'E' } });
  vary('shelf-junk', 'jar-shelves', { swap: { 2: 'a', 9: 'u', L: 'I', r: 't', y: 'O' } });
  vary('potion-shelf', 'jar-shelves', { swap: { 9: '5', L: '8', r: 'R' } });
  T('meat-hook', ['.I.', '.I.', '.I.', '.t.', 'rrr', 'rRr', 'rRr', 'rxr', 'rRr', 'rrr', '.r.']);
  T('meat-hooks-empty', ['IIIIIIIIIIIIIII', '.I...I...I...I.', '.I...I...I...I.', '.t...t...t...t.', 't....t..t....t.', 'tt..tt..tt..tt.']);
  D('butchers-block', [
    '....TTTTO.....',
    'qqqqqqqqqqqqqq',
    'pprpppppppppRp',
    'pppppppppppppp',
    'oooooooooooooo',
    '.O..........O.',
    '.O..........O.',
    '.O..........O.',
    '.O..........O.',
    '.O..........O.',
    '.O..........O.',
  ]);
  T('knife-block', ['O.O.O.', 'O.O.O.', 'oooooo', 'oooooo', 'oooooo', 'OOOOOO']);
  T('bread-bin', ['.PPPPPPPP.', 'PPPPPPPPPP', 'PaPPPPPPPP', 'PPPPPPPPPP', 'AAAAAAAAAA']);
  T('flour-sack', ['..cc..', '.cccc.', 'cccccc', 'ccaacc', 'cccccc', 'cccccc', 'cccccc']);
  T('bottle-crate', ['H.H.H.H.H.', 'H.H.H.H.H.', 'pppppppppp', 'pOpOpOpOpO', 'pppppppppp', 'pOpOpOpOpO', 'pppppppppp']);
  D('wine-rack', [
    'OOOOOOOOOOOOOO',
    'OHnO.nOHnOHn.O',
    'OOOOOOOOOOOOOO',
    'O.nOHnOHnO.nHO',
    'OOOOOOOOOOOOOO',
    'OHnOHnO.nOHn.O',
    'OOOOOOOOOOOOOO',
    'OHnO.nOHnO.nHO',
    'OOOOOOOOOOOOOO',
    'O.nOHnOHnOHn.O',
    'OOOOOOOOOOOOOO',
  ]);
  D('barrel-wine', [
    '..oooooooo..',
    '.oOooooooOo.',
    'IIIIIIIIIIII',
    'ooOooooooOoo',
    'ooOooooooOoo',
    'ooOoooGoooOo',
    'ooOooGGooOoo',
    'ooOooooooOoo',
    'ooOooooooOoo',
    'IIIIIIIIIIII',
    '.oOooooooOo.',
    '..oooooooo..',
    '.OO......OO.',
  ]);
  vary('barrel-open', 'barrel-wine', {
    swap: { G: 'o' },
    put: [
      [2, 0, 'OOOOOOOO'],
      [3, 1, 'vvvvvv'],
    ],
  });
  vary('barrel-smashed', 'barrel-wine', {
    swap: { G: 'o' },
    put: [
      [0, 0, '            '],
      [0, 1, '            '],
      [0, 2, '  o     o   '],
      [0, 3, '  o   o o   '],
      [0, 4, ' oO o o oO  '],
      [3, 12, 'vvvvvvv'],
      [10, 11, 'vv'],
    ],
  });
  vary('rain-barrel-moss', 'barrel-wine', {
    swap: { G: 'o', o: 'e', O: 'E' },
    put: [
      [2, 0, '33333333'],
      [0, 6, 'M'],
      [1, 7, 'Mm'],
      [9, 10, 'mM'],
      [3, 11, 'm'],
    ],
  });
  D('milk-churn', [
    '..tttt..',
    '.tTtttt.',
    '..tttt..',
    '.tttttt.',
    'tTtttttt',
    'tTtttttt',
    'tTtttttt',
    'tTtttttt',
    'tTtttttt',
    'tTtttttt',
    'tttttttt',
  ]);
  T('coal-scuttle', ['....I...', '.III.I..', 'nInnnII.', 'IIIIIII.', '.IiIIII.', '.IiIII..', '..III...']);
  T('coal-pile', ['.....nI.....', '...nInnIn...', '..InnnInnI..', '.nnInnnnInn.', 'InnnnInnnnIn']);
  T('kitchen-scales', ['GGGGGGGGGG', '.G......G.', '....II....', '...IwwI...', '...IwRI...', '....II....', '..IIIIII..']);
  T('mincer', ['tttt....', 'tTTt....', '.tt.tOOO', 'tttttt..', 'tTtttt..', '.tt.....', '.tt.....', 'tttt....']);
  D('dresser-kitchen', [
    'OOOOOOOOOOOOOOOOOO',
    'OooooooooooooooooO',
    'OowwowwowwowwowwoO',
    'OOOOOOOOOOOOOOOOOO',
    'Oo0ooPoo0oooPoo0oO',
    'OoPooPooPoooPooPoO',
    'OOOOOOOOOOOOOOOOOO',
    'qqqqqqqqqqqqqqqqqq',
    'OoooooooOOoooooooO',
    'OoOOOOOoOOoOOOOOoO',
    'OoOoooGoOOoGoooOoO',
    'OoOoooooOOoooooOoO',
    'OoOoooooOOoooooOoO',
    'OoOOOOOoOOoOOOOOoO',
    'OOOOOOOOOOOOOOOOOO',
  ]);
  D('water-pump', [
    '..IIII....',
    '..IiII....',
    '..IiIIIIII',
    '..IiII...I',
    '..IiIItt..',
    '..IiII.t..',
    '..IiII....',
    '..IiII....',
    '..IiII....',
    '..IiII....',
    '..IiII....',
    '.IIIIII...',
    'ssssssssss',
  ]);
  D('laundry-mangle', [
    '..IIIIIIIIII..',
    '..I........I..',
    'OOqqqqqqqqqqI.',
    '..qqqqqqqqqqII',
    'OOppppppppppI.',
    '..ppppppppppI.',
    '..I........I..',
    '..I........I..',
    '..I........I..',
    '..I........I..',
    '.II........II.',
    '.I..........I.',
  ]);
  D('washing-tub', ['t............t', 'tt2w22w222w2tt', 'tTttttttttttIt', 'tTttttttttttIt', '.tTttttttttIt.', '.tttttttttttt.']);
  T('clothes-horse', [
    'q.q.q.q.q.q.q',
    'qqqqqqqqqqqqq',
    'q.Pq.q.jq.q.q',
    'q.Pq.q.jq.q.q',
    'q.Pq.q.jq.q.q',
    'q.q.q.q.q.q.q',
    'q.q.q.q.q.q.q',
    'q...........q',
    'q...........q',
    'q...........q',
  ]);
  D('boiler', [
    '...tttttttt...',
    '..tTtttttttt..',
    '..tTtttttttt..',
    '..tTttGGGttt..',
    '..tTttGwGttt..',
    '..tTttGGGttt..',
    '..tTtttttttt..',
    '..tTtttttttt..',
    '..tTtttttttt..',
    '..tTtttttttt..',
    '0000ttttttt...',
    '0.tTtttttttt..',
    '0.tTtttttttt..',
    '0.tTtttttttt..',
    '0.tTtIIIIttt..',
    '0.tTtIfFIttt..',
    '0.tTtIIIIttt..',
    '..tttttttttt..',
    '..I........I..',
  ]);
  vary('boiler-gauge', 'boiler', { swap: { t: '0', T: '9' }, put: [[6, 4, 'wRw']] });
  D('furnace', [
    '......IIII......',
    '......IiII......',
    '......IiII......',
    '......IiII......',
    '..IIIIIIIIIIII..',
    '.IiiiiiiiiiiiiI.',
    '.IiIIIIIIIIIIiI.',
    '.IiIIIIIIIIIIiI.',
    '.IiIInnnnnnIIiI.',
    '.IiInfFffFfnIiI.',
    '.IiInFfFFfFnIiI.',
    '.IiInfFfFFfnIiI.',
    '.IiIInnnnnnIIiI.',
    '.IiIIIIIIIIIIiI.',
    '.IiIIItIItIIIiI.',
    '.IIIIIIIIIIIIII.',
    '.II..........II.',
  ]);
  vary('furnace-cold', 'furnace', { swap: { f: 'n', F: 'I' } });
  D('workbench', [
    '....tO.....IIt....',
    'qqqqqqqqqqqqqqqqqq',
    'pppppppppppppppppp',
    '.oOOOOOOOOOOOOOOo.',
    '.o..............o.',
    '.o..............o.',
    '.oooooooooooooooo.',
    '.o..............o.',
    '.o..............o.',
    '.o..............o.',
  ]);
  T('tool-rack', [
    'OOOOOOOOOOOOOOOO',
    '.t..I..tt..O..t.',
    '.t..I..tt..O.ttt',
    '.O.III.O...O..t.',
    '.O..I..O..ttt.O.',
    '.O..I..O..t.t.O.',
    '.......O......O.',
  ]);
  T('pipes-valve', [
    '00000000000000',
    '0............0',
    '0....RRR.....0',
    '0000RRuRR00000',
    '0....RRR.....0',
    '0............0',
    '0.......000000',
    '0.......0.....',
  ]);
  vary('pipes-steam', 'pipes-valve', {
    swap: { 0: 't', u: 'I' },
    put: [
      [9, 4, 'w.w'],
      [10, 5, 'ww'],
      [9, 6, 'w'],
    ],
  });
  T('fuse-box-open', [
    'IIIIIIIIIIII',
    'IttttttttIiI',
    'ItPIPIPItIiI',
    'ItPIPIPItIiI',
    'IttttttttIiI',
    'ItRItFItItiI',
    'IttttttttIiI',
    'IIIIIIIIIIiI',
  ]);
  vary('fuse-board', 'fuse-box-open', {
    swap: { i: 'I' },
    put: [
      [9, 1, 'ttt'],
      [9, 2, 'tPt'],
      [9, 3, 'tPt'],
      [9, 4, 'ttt'],
      [9, 5, 'tIt'],
      [9, 6, 'ttt'],
    ],
  });
  D('generator-old', [
    '....II..........',
    '....II...tttt...',
    '.IIIIIIIItTTtIII',
    'IiiiiiiiItttttiI',
    'IiIIIIiiIIIIIIiI',
    'IiIRIIiiIuuuuIiI',
    'IiIIIIiiIuuuuIiI',
    'IiiiiiiiIIIIIIiI',
    'IIIIIIIIIIIIIIII',
    '.nn..........nn.',
  ]);
  vary('generator-diesel', 'generator-old', { swap: { i: 'L', u: 'n' } });
  D('cage-large', [
    'IIIIIIIIIIIIIIII',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'IIIIIIIIIIIIIIII',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'I.I.I.I.I.I.I.II',
    'IIIIIIIIIIIIIIII',
  ]);
  T(
    'chains-hanging',
    [
      't..I....t',
      'I..t....I',
      't..I....t',
      'I..t....I',
      't..I....t',
      'I..t....I',
      't..I....t',
      'I..t....I',
      't.......t',
      'I.......I',
      't.......t',
      'I........',
      't........',
      'II.......',
    ],
    { outline: false },
  );
  T('drain-cover', ['.IIIIIIII.', 'InInInInII', 'IInInInInI', 'InInInInII', '.IIIIIIII.'], { shade: false });
  D('oil-drum', [
    '.uuuuuuuu.',
    'u00000000u',
    'uuuuuuuuuu',
    'u0u000000u',
    'u0u00nn00u',
    'u0u0nn000u',
    'uuuuuuuuuu',
    'u0u000000u',
    'u0u000000u',
    'u0u0000n0u',
    'uuuuuuuuuu',
    '.uuuuuuuu.',
  ]);
  T('pallet', ['qqqqqqqqqqqqqqqqqq', 'O..O...OO...O..O..', 'pppppppppppppppppp'], { shade: false });
  T('sump-pit', ['.ssssssssssss.', 'sdnnnnnnnnnnds', 'sn33n3333n33ns', 'sdnnnnnnnnnnds', '.ssssssssssss.'], { shade: false });
  views(V, ROWS);
};

/*
 * The other pictures of these things: turned a quarter (`side`), after somebody used them (`used`), and both
 * (`sideUsed`). Side views look to the right: the front of the thing is on the right-hand side of the picture.
 * Things that lie along the floor and are drawn from their long side (base: 'side') get a front view seen a
 * little from above, running away from the viewer.
 */
function views(V, ROWS) {
  const rep = (n, row) => Array(n).fill(row);
  const re = (text, swap) => [...text].map((ch) => swap[ch] || ch).join('');
  /** Rows with texts put on them: [[x, y, 'text'], ...]; a space leaves the pixel as it is, a dot empties it. */
  const patch = (rows, puts) => {
    const out = rows.map((r) => [...r]);
    for (const [x, y, text] of puts) {
      while (out.length <= y) out.push([]);
      for (let i = 0; i < text.length; i++) {
        while (out[y].length <= x + i) out[y].push('.');
        if (text[i] !== ' ') out[y][x + i] = text[i];
      }
    }
    return out.map((r) => r.join(''));
  };
  /** A filled box as puts. */
  const box = (x, y, w, h, ch) => rep(h, 0).map((_, i) => [x, y + i, ch.repeat(w)]);
  /** A column of single letters as puts. */
  const col = (x, y, text) => [...text].map((ch, i) => [x, y + i, ch]);
  const recol = (x, swap) =>
    Array.isArray(x)
      ? x.map((r) => re(r, swap))
      : {
          ...x,
          put: (x.put || []).map(([a, b, t]) => [a, b, re(t, swap)]),
          swap: Object.fromEntries(Object.entries(x.swap || {}).map(([k, v]) => [swap[k] || k, swap[v] || v])),
        };
  /**
   * The same views for a thing and its recoloured variants: fam(views, { slug: swap, slug: [swap, more] }).
   * A view may be a function of the slug; `more` = { side: puts, used: puts, sideUsed: puts } is added on top.
   */
  function fam(v, who) {
    for (const [slug, w] of Object.entries(who)) {
      const [swap, more] = Array.isArray(w) ? w : [w, {}],
        o = {};
      for (const [k, x0] of Object.entries(v)) {
        const x = typeof x0 === 'function' ? x0(slug) : x0;
        if (!x) continue;
        if (typeof x === 'string') o[k] = x;
        else {
          o[k] = recol(x, swap);
          if (more[k]) o[k] = Array.isArray(o[k]) ? patch(o[k], more[k]) : { ...o[k], put: [...o[k].put, ...more[k]] };
        }
      }
      V(slug, o);
    }
  }
  /** The main picture of a thing with n free rows above it (and `left` free columns), and texts put on that. */
  const tall = (slug, n, puts = [], left = 0) =>
    patch(
      [...rep(n, ''), ...ROWS[slug]].map((r) => '.'.repeat(left) + r),
      puts,
    );
  /** Rows turned a quarter clockwise: a thing knocked over, lying with its top to the right. */
  const rot = (rows) => {
    const w = Math.max(...rows.map((r) => r.length)),
      h = rows.length,
      at = (x, y) => rows[y][x] || '.';
    return rep(w, 0).map((_, y) => rep(h, 0).map((_, x) => at(y, h - 1 - x)).join(''));
  };
  const same = { of: 'base' }, // a round thing looks the same from the side
    sameUsed = { of: 'used' };

  /* ---------- kitchen ---------- */
  fam(
    {
      side: [
        'PPPPPPPPPP',
        ...rep(2, 'PwwwwwwwAw'),
        ...rep(3, 'PwwwwwwwAwt'),
        ...rep(2, 'PwwwwwwwAw'),
        'PwwwwwwwAA',
        'PwwwwwwwAw',
        ...rep(4, 'PwwwwwwwAwt'),
        ...rep(11, 'PwwwwwwwAw'),
        'PPPPPPPPPP',
        'I........I',
      ],
      /* the lower door stands open: shelves, food, and the door with its racks swung out to the left */
      used: [
        '....PPPPPPPPPPPP',
        ...rep(2, '....PwwwwwwwwwwP'),
        ...rep(3, '....PwwwwwwwwtwP'),
        ...rep(2, '....PwwwwwwwwwwP'),
        '....PAAAAAAAAAAP',
        '....PccccccccccP',
        'PPPPPcb3cc8ccRcP',
        'PwwwPcb3c88cRRcP',
        'PAAwPAAAAAAAAAAP',
        'P3RwPcccccc6cccP',
        'P3RwPc00cc66cbbP',
        'PAAwPAAAAAAAAAAP',
        'PwwwPc8cccc3c3cP',
        'Pb6wPc88c9c3c3cP',
        'Pb6wPAAAAAAAAAAP',
        'PAAwPccccccccccP',
        'PwwwPcLLcc99cccP',
        'PwwwPcLLLc99c0cP',
        'PwwwPAAAAAAAAAAP',
        'PwwwPwwwwwwwwwwP',
        'PwwwPwwwwwwwwwwP',
        'PwwwPPPPPPPPPPPP',
        'PPPPI..........I',
      ],
      sideUsed: [
        'PPPPPPPPPP',
        ...rep(2, 'PwwwwwwwAw'),
        ...rep(3, 'PwwwwwwwAwt'),
        ...rep(2, 'PwwwwwwwAw'),
        'PwwwwwwwAA',
        'PwwwwwwwPcPPPPPPPP',
        'PwwwwwwwPcPwwwwwwP',
        ...rep(2, 'PwwwwwwwPcPw3wRbwP'),
        'PwwwwwwwPcPAAAAAAP',
        'PwwwwwwwPcPwwwwwwP',
        ...rep(2, 'PwwwwwwwPcPwb6w8wP'),
        'PwwwwwwwPcPAAAAAAP',
        ...rep(6, 'PwwwwwwwPcPwwwwwwP'),
        'PwwwwwwwPcPPPPPPPP',
        'PPPPPPPPPP',
        'I........I',
      ],
    },
    {
      fridge: {},
      'fridge-old': [
        { w: 'P', P: 'a', t: 'u' },
        {
          side: [
            [2, 20, 'uu'],
            [5, 13, 'A'],
            [3, 4, 'u'],
          ],
          sideUsed: [
            [2, 20, 'uu'],
            [5, 13, 'A'],
            [3, 4, 'u'],
          ],
          used: [
            [11, 4, 'u'],
            [7, 6, 'A'],
          ],
        },
      ],
      icebox: { w: 'o', P: 'O', t: 'G', A: 'O' },
    },
  );
  fam(
    {
      side: [
        'IIIIIIIIIII',
        'InnIIIInnII',
        'wwwwwwwwwww',
        'wwwwwwwwwPwI',
        'wwwwwwwwwPw',
        'wwwwwwwwwPwt',
        ...rep(8, 'wwwwwwwwwPw'),
        'wwwwwwwwwww',
        'I.........I',
      ],
      /* the oven door folded down towards the viewer: the racks, a roast, the glow of the element */
      used: {
        put: [
          [0, 5, 'wwwwwwwwwwwwww'],
          [0, 7, 'wwnnnnnnnnnnww'],
          [0, 8, 'wwnIIIIIIIInww'],
          [0, 9, 'wwnnn0000nnnww'],
          [0, 10, 'wwnIIIIIIIInww'],
          [0, 11, 'wwnnfFffFfnnww'],
          [0, 12, 'wwnnnnnnnnnnww'],
          [0, 13, 'WWWWWWWWWWWWWW'],
          [0, 14, 'WWn11111111nWW'],
          [0, 15, 'WWWWWWWWWWWWWW'],
          [0, 16, 'wttttttttttttw'],
        ],
      },
      sideUsed: {
        put: [
          [9, 5, 'ww.'],
          ...box(9, 6, 2, 6, 'n'),
          [9, 11, 'fF'],
          [9, 12, 'nn'],
          [9, 13, 'WWWWWWWWW'],
          [9, 14, 'wwwwwwwww'],
          [17, 15, 't'],
        ],
      },
    },
    { cooker: {}, 'oven-old': { w: 'P', 1: 'n', t: 'u', W: 'a' } },
  );
  V('stove-iron', {
    side: [
      '.II........',
      '.II........',
      '.II........',
      '.II........',
      '.II........',
      'IIIIIIIIIII',
      'iiiiiiiiii',
      'iIIIIIIiIi',
      'iIiiiiIiIif',
      'iIiiiiIiIif',
      'iIIIIIIiIi',
      'iiiiiiiiii',
      'iIIIIIIIIi',
      'iiiiiiiiii',
      'II......II',
      'II......II',
    ],
    /* a pot put on to boil, the fire stoked */
    used: {
      put: [
        [8, 1, '.2.2.'],
        [8, 2, '2.2..'],
        [7, 3, 'ItttttI'],
        [8, 4, 'tTttt'],
        [6, 8, 'FfFF'],
        [6, 9, 'fFFf'],
      ],
    },
    sideUsed: {
      put: [
        [5, 1, '.2.2.'],
        [5, 2, '2.2..'],
        [4, 3, 'ItttttI'],
        [5, 4, 'tTttt'],
        [10, 8, 'F'],
        [10, 9, 'F'],
        [11, 9, 'f'],
      ],
    },
  });
  V('microwave', {
    side: ['PPPPPPPPP', 'PaaaaPPPn', 'PPPPPPPPn', 'PaaaaPPPn', 'PPPPPPPPn', 'PPPPPPPPP'],
    /* switched on: the light inside, a plate turning */
    used: {
      put: [
        [2, 2, 'FFFFFF'],
        [2, 3, 'FwwwwF'],
        [10, 1, '8'],
      ],
    },
    sideUsed: { swap: { n: 'F' } },
  });
  V('washing-machine', {
    side: [
      'PPPPPPPPPPP',
      'PwwwwwwwwPwI',
      'PwwwwwwwwPw',
      'PwwwwwwwwPwt',
      ...rep(4, 'PwwwwwwwwPwtt'),
      'PwwwwwwwwPwt',
      'PwwwwwwwwPw',
      'PwwwwwwwwPw',
      'PPPPPPPPPPP',
      'I.........I',
    ],
    /* the door open, the washing half out */
    used: [
      '...PPPPPPPPPPPP',
      '...PwIwIwwRwwwP',
      '...PwwwwwwwwwwP',
      '.t.PwwwttttwwwP',
      't1tPwwtnnnntwwP',
      't1tPwtnnnnnntwP',
      't2tPwtnnjjnntwP',
      't1tPwtnjjRRntwP',
      't1tPwwtjjRRtwwP',
      '.t.PwwwtjRRwwwP',
      '...PwwwwjwRwwwP',
      '...PPPPPPjPPPPP',
      '...I..........I',
    ],
    sideUsed: [
      'PPPPPPPPPPP',
      'PwwwwwwwwPwI',
      'PwwwwwwwwPw....',
      'PwwwwwwwwPw.tttt.',
      'PwwwwwwwwPnt1111t',
      'PwwwwwwwwPnt1211t',
      'PwwwwwwwwPjj1111t',
      'PwwwwwwwwPjRt11t.',
      'PwwwwwwwwPwjRtt..',
      'PwwwwwwwwPwjR',
      'PwwwwwwwwPw.j',
      'PPPPPPPPPPP',
      'I.........I',
    ],
  });
  fam(
    {
      side: [
        '..ttttt...',
        '..t...t...',
        '..t.......',
        'PPPPPPPPPP',
        'PnnnnnnnnP',
        'P.P....P.P',
        'wwwwwwwwww',
        'wwwwwwwwWw',
        'wwwwwwwwWwG',
        ...rep(4, 'wwwwwwwwWw'),
        'wwwwwwwwww',
        'AAAAAAAAAA',
      ],
      /* the tap runs, the basin fills */
      used: (slug) => ({
        put: [
          [9, 3, '2'],
          [8, 2, '2 '],
          [1, 4, slug === 'sink-dirty' ? '323 L L 2w23' : '3323322w2w33'],
          [10, 2, 'w2'],
          [1, 2, '2w'],
        ],
      }),
      sideUsed: {
        put: [
          [6, 2, '2'],
          [6, 3, '2'],
          [1, 4, '33233233'],
        ],
      },
    },
    {
      'kitchen-sink': {},
      'sink-stone': { P: 'l', w: 's', W: 'd', A: 'd', G: 'i' },
      'sink-dirty': [{ w: 'P', W: 'a', P: 'a' }, { side: [[3, 9, 'u'], [4, 3, 'L']], sideUsed: [[3, 9, 'u'], [4, 3, 'L']] }],
    },
  );
  {
    const side = [
      'qqqqqqqqqqq',
      'ppppppppppp',
      'oooooooooo',
      'oOOOOOOOoo',
      ...rep(5, 'oOooooooOo'),
      'oOOOOOOOoo',
      'oooooooooo',
      'OOOOOOOOOO',
    ];
    /* the right-hand cupboard open: pans and plates, the door swung out */
    const open = [
      [11, 3, 'OOOOOOOO'],
      [11, 4, 'Onntttnn'],
      [11, 5, 'OnnttnwwO'],
      [11, 6, 'OOOOOOOO'],
      [11, 7, 'Onnnnn0n'],
      [11, 8, 'On66nn00'],
      [11, 9, 'OOOOOOOO'],
      [19, 3, 'oOOOO'],
      ...box(19, 4, 1, 6, 'o'),
      ...box(20, 4, 4, 6, 'OppO'.slice(0, 1)),
      ...rep(6, 0).map((_, i) => [20, 4 + i, 'OppO']),
      [20, 10, 'OOOO'],
    ];
    const openSide = [
      [9, 3, 'nOOOOOOOO'],
      ...rep(5, 0).map((_, i) => [9, 4 + i, 'nOoooooOO'.replace(/O$/, 'o')]),
      [16, 6, 'G'],
      [9, 9, 'nOOOOOOOO'],
    ];
    V('kitchen-counter', { side, used: { put: open }, sideUsed: { put: openSide } });
    /* and the top drawer pulled out */
    V('kitchen-counter-drawers', {
      side,
      used: {
        put: [
          ...open,
          [1, 3, 'ntItntItn'],
          [0, 4, 'OOOOOOOOOOO'],
          [0, 5, 'OooooGGooooO'.slice(0, 11)],
          [0, 6, 'OOOOOOOOOOO'],
        ],
      },
      sideUsed: {
        put: [...openSide, [10, 2, 'nnnn'], [10, 3, 'ooooO'], [10, 4, 'ooooOG'], [10, 5, 'OOOOO']],
      },
    });
  }
  V('dresser-kitchen', {
    side: [
      'OOOOOO',
      'Oooooo',
      'Ooooow',
      'OOOOOO',
      'Oooooo',
      'OooooP',
      'OOOOOO',
      'qqqqqqqqqq',
      'Ooooooooo',
      'OoOOOOOoo',
      ...rep(3, 'OoOoooOoo'),
      'OoOOOOOoo',
      'OOOOOOOOO',
    ],
    /* a cupboard open, a plate and a cup taken down */
    used: {
      put: [
        [5, 2, 'oo'],
        [8, 4, 'o'],
        [8, 5, 'o'],
        [10, 9, 'OOOOOOO'],
        [10, 10, 'OnwwwnO'],
        [10, 11, 'OOOOOOO'],
        [10, 12, 'On0n6nO'],
        [10, 13, 'OOOOOOO'],
        [17, 8, 'oOOOO'],
        ...rep(5, 0).map((_, i) => [18, 9 + i, 'OppO']),
        [18, 14, 'OOOO'],
        [18, 15, 'OOOO'],
      ],
    },
    sideUsed: {
      put: [
        [5, 2, 'o'],
        [8, 9, 'nOOOOOOO'],
        ...rep(4, 0).map((_, i) => [8, 10 + i, 'nOooooo']),
        [14, 11, 'G'],
        [8, 13, 'nOOOOOOO'],
      ],
    },
  });
  V('bin', {
    side: same,
    /* the lid off and leaning against it, rubbish to the brim */
    used: [
      '...w.6.......',
      '..wP0w6w.....',
      'ttttttttt....',
      '.tItItIt.....',
      '.tItItIt.....',
      '.tItItIt...I.',
      '.tItItIt..It.',
      '.tItItIt..It.',
      '.ttttttt.It..',
    ],
    sideUsed: sameUsed,
  });

  /* ---------- bathroom ---------- */
  {
    /* the tub seen from its foot end, running away from the viewer: the tap at the far end */
    const front = [
      '......tt......',
      '.....tttt.....',
      '..wwwwttwwww..',
      '.wwAAAAAAAAww.',
      'wAPPPPPPPPPPPw',
      ...rep(13, 'wPPPPPPPPPPPPw'),
      'wPPPPPAAPPPPPw',
      'wPPPPPPPPPPPPw',
      'wwPPPPPPPPPPww',
      'wwwwwwwwwwwwww',
      ...rep(3, '.wwwwwwwwwwww.'),
      '..wwwwwwwwww..',
      '..PPPPPPPPPP..',
      '..G........G..',
      '.GG........GG.',
    ];
    const water = [
      [3, 3, '33333333'],
      ...box(1, 4, 12, 16, '3'),
      [2, 20, '3333333333'],
      [5, 4, '22'],
      [6, 5, '2'],
      [3, 8, '22'],
      [8, 11, '222'],
      [4, 15, '22'],
      [9, 17, '2'],
    ];
    const fill = { put: [[1, 4, '3'.repeat(28)], [4, 3, '3'.repeat(20)], [10, 2, '2..2....2'], [2, 3, '2']] };
    fam(
      { base: 'side', side: front, used: fill, sideUsed: { put: water } },
      {
        bathtub: {},
        'bathtub-clawfoot': { w: 'P', P: 'a' },
        'bathtub-stained': [
          { w: 'P', P: 'a' },
          {
            side: [...col(4, 6, 'uuu'), [5, 6, 'u'], ...col(9, 10, 'rrrr'), [8, 10, 'rr'], [6, 22, 'r'], [6, 23, 'r'], [10, 3, 'L']],
            sideUsed: [[6, 22, 'r'], [6, 23, 'r'], [9, 12, 'r'], [8, 13, 'rr']],
          },
        ],
      },
    );
    /* the full bath, let out again: a wet floor */
    V('bathtub-filled', {
      base: 'side',
      side: patch(front, water),
      used: { swap: { 3: 'P' }, put: [[10, 2, '.........'], [4, 3, 'w'.repeat(20)], [8, 12, '3333333'], [18, 12, '33']] },
      sideUsed: { swap: { 3: 'P', 2: 'P' }, put: [[3, 27, '333333'], [4, 28, '33333']] },
    });
    /* the canvas cover unlaced and thrown back */
    V('water-therapy-tub', {
      base: 'side',
      side: patch(recol(front, { w: 't', P: 'i', G: 'I' }), [
        [2, 2, 'cccccccccc'],
        [1, 3, 'cccccccccccc'],
        ...box(0, 4, 14, 17, 'c'),
        [1, 21, 'cccccccccccc'],
        [5, 3, 'nxxn'],
        [5, 4, 'nxxn'],
        [5, 5, 'nnnn'],
        ...col(3, 8, 'YcYcYcYcYcYc'),
        ...col(10, 8, 'YcYcYcYcYcYc'),
      ]),
      used: { put: [[5, 2, '.'], [1, 3, 'tttt33333333333333ccccccccct'], [22, 2, 'ccccc'], [1, 4, '3'.repeat(20)]] },
      sideUsed: {
        put: [
          [2, 2, 'tttt..tttt'],
          [1, 3, 'ttiiiiiiiitt'],
          ...box(0, 4, 14, 9, 't333333333333t'.slice(0, 1)),
          ...rep(9, 0).map((_, i) => [0, 4 + i, 't333333333333t']),
          [5, 6, '22'],
          [8, 9, '2'],
          [0, 13, 'cccccccccccccc'],
          [0, 14, 'cYccccccccccYc'],
        ],
      },
    });
  }
  V('shower', {
    base: 'side',
    side: [
      '.....tt.....',
      '.....tt.....',
      '....TTTT....',
      '...TTTTTT...',
      ...rep(6, 0).flatMap(() => ['...2.tt2.2..', '....2tt.2...']),
      '...2.tt2.2..',
      'wwwwwwwwwwww',
      'WWWWWWWWWWWW',
    ],
    /* turned off: a last drip, water standing in the tray */
    used: {
      put: [...box(7, 3, 4, 14, '.'), [9, 4, '2'], [9, 9, '2'], [3, 17, '3333333']],
    },
    sideUsed: {
      put: [...rep(13, 0).map((_, i) => [3, 4 + i, '..tt.....'.replace(/^\.\./, '..')]), ...box(3, 4, 2, 13, '.'), ...box(7, 4, 3, 13, '.'), [7, 5, '2'], [4, 10, '2'], [2, 17, '33333333']],
    },
  });
  {
    const lidUp = (water) => ({ put: [...col(6, 2, 'wwww'), [2, 7, water]] });
    const front = ['wwwwwwww', 'wwwwwwww', 'wwwwwwtw', 'wwwwwwww', 'wwwwwwww', '.WWWWWW.', 'WwwwwwwW', 'WwwwwwwW', '.WWWWWW.', '.wwwwww.', '..wwww..', '..wwww..', '.wwwwww.'];
    const frontUp = (water) => ({
      put: [[1, 1, 'WWWWWW'], [1, 2, 'Wwwww'], [1, 3, 'WwwwwW'], [1, 4, 'WwwwwW'], [0, 5, '.wwwwww.'], [0, 6, 'ww' + water.slice(0, 4) + 'ww'], [0, 7, 'w' + water + 'w'], [0, 8, 'ww' + water.slice(2) + 'ww']],
    });
    const water = (slug) => (slug === 'toilet-dirty' ? 'LzLL3L' : '333333');
    fam(
      { base: 'side', side: front, used: (slug) => lidUp(water(slug)), sideUsed: (slug) => frontUp(water(slug)) },
      {
        toilet: {},
        'toilet-old': { w: 'P', W: 'a', t: 'G' },
        'toilet-dirty': [{ w: 'P', W: 'L' }, { side: [[3, 10, 'u'], [3, 11, 'u'], [1, 3, 'L']], sideUsed: [[3, 10, 'u'], [3, 11, 'u'], [1, 3, 'L']] }],
      },
    );
    /* the broken one: flushed, it floods the floor */
    V('toilet-broken', {
      base: 'side',
      side: patch(recol(front, { w: 'P', W: 'n' }), [[0, 0, '..'], [0, 1, '.'], [6, 0, '..'], [3, 2, 'n'], [4, 3, 'nn'], [4, 4, 'n'], [6, 12, '3333']]),
      used: { put: [[2, 7, '333333'], [8, 9, '3'], [8, 10, '3'], [5, 12, '33333333'], [0, 12, '333']] },
      sideUsed: { put: [[1, 6, '333333'], [1, 7, '333333'], [7, 9, '3'], [7, 10, '3'], [7, 11, '3'], [0, 12, '33'], [6, 12, '33333']] },
    });
  }
  fam(
    {
      side: [
        '.ttt....',
        '.t.t....',
        'wwwwwwww',
        'wWWWWWWw',
        'wwwwwww.',
        '.wwwww..',
        ...rep(6, '.ww.....'),
        'wwww....',
      ],
      /* the tap runs, the basin fills */
      used: (slug) => ({ put: [[5, 1, '2'], [1, 3, slug === 'washbasin-bloody' ? 'rr3r2rr3' : '33332333']] }),
      sideUsed: (slug) => ({ put: [[3, 2, '2'], [1, 3, slug === 'washbasin-bloody' ? 'r32rr3' : '332333']] }),
    },
    {
      'bathroom-sink': {},
      washbasin: { w: 'P', W: 'a', t: 'G' },
      'washbasin-bloody': [{ w: 'P', W: 'r', t: 'G' }, { side: [[6, 4, 'r'], [5, 5, 'r'], [2, 12, 'rr']], sideUsed: [[6, 4, 'r'], [5, 5, 'r'], [2, 12, 'rr']] }],
    },
  );
  V('mirror-cabinet', {
    side: ['PPPP', ...rep(6, 'PwP1'), 'PPPP'],
    /* a door open: the shelves, pills and bottles */
    used: {
      put: [
        [6, 1, 'wRw4w'],
        [6, 2, 'wRw4w'],
        [6, 3, 'PPPPP'],
        [6, 4, 'ww6ww'],
        [6, 5, 'w36wR'],
        [6, 6, 'w36wR'],
        [11, 0, 'PPPP'],
        ...rep(6, 0).map((_, i) => [12, 1 + i, i < 2 ? '22P' : '11P']),
        [12, 7, 'PPP'],
      ],
    },
    sideUsed: { put: [[3, 0, 'PPPPPP'], ...rep(6, 0).map((_, i) => [3, 1 + i, i < 2 ? 'P221P' : 'P111P']), [3, 7, 'PPPPPP']] },
  });

  /* ---------- bedroom, nursery, attic ---------- */
  {
    /* from the foot end: the upper bunk seen from above, the lower one in its shadow, the ladder edge-on */
    const front = [
      'O..............O',
      'OOOOOOOOOOOOOOOO',
      'OooooooooooooooO',
      'OccccccccccccccO',
      ...rep(2, 'OccwwwwwwwwwwccO'),
      'OccWWWWWWWWWWccO',
      'OccccccccccccccO',
      'OJJJJJJJJJJJJJJO',
      ...rep(11, 'OjjjjjjjjjjjjjjO'),
      'OccccccccccccccO',
      'OooooooooooooooO',
      ...rep(2, 'OnnnnnnnnnnnnnnOO'),
      ...rep(4, 'OVVVVVVVVVVVVVVOO'),
      ...rep(2, 'OvvvvvvvvvvvvvvOO'),
      'OccccccccccccccOO',
      'OooooooooooooooOO',
      ...rep(2, 'O..............OO'),
    ];
    V('bunk-bed', {
      base: 'side',
      side: front,
      /* both beds slept in: the blankets thrown back to the foot, one hanging over the side */
      used: {
        put: [
          [21, 1, 'jjjjjj'],
          [12, 2, '.......jjjjjjjjjjj'],
          [6, 3, 'ccccccccccccWJjjjjjjjjjjj'],
          [22, 4, 'jjjjjjj'],
          [23, 5, 'jjjjj'],
          [24, 6, ' jj '],
          [22, 11, 'vvvvv'],
          [12, 12, '........vvvvvvvvv'],
          [6, 13, 'ccccccccccccWvvvvvvvvvvvv'],
        ],
      },
      sideUsed: {
        put: [
          ...box(1, 8, 14, 5, 'c'),
          [3, 9, 'WW'],
          [8, 11, 'WWW'],
          [5, 12, 'W'],
          [1, 13, 'JjJJjjJjJJjjJj'],
          [1, 14, 'jJjjJJjJjjJjjJ'],
          ...box(1, 24, 14, 2, 'A'),
          [1, 26, 'vVvvVvVvvVvvVv'],
        ],
      },
    });
  }
  V('pram-old', {
    base: 'side',
    /* from the handle end: looking under the hood */
    side: [
      '..nnnnnn..',
      '.nNNNNNNn.',
      'nNnnnnnnNn',
      'IIIIIIIIII',
      'nNnwwwwnNn',
      'nnnnnnnnnn',
      'nNNNNNNNNn',
      'nNNNNNNNNn',
      '.nnnnnnnn.',
      't.I....I.t',
      'tIIIIIIIIt',
      't........t',
      't........t',
    ],
    /* the hood folded down, the bedding turned back */
    used: {
      put: [
        ...box(4, 0, 12, 3, '.'),
        [4, 3, '.wwwww.nNn'],
        [5, 2, 'wccw...nNn'],
        [12, 1, 'nn'],
      ],
    },
    sideUsed: {
      put: [
        ...box(0, 0, 10, 2, '.'),
        [0, 2, '..wwccww..'],
        [0, 3, 'IIIIIIIIII'],
        [0, 4, 'nNwwwwwwNn'],
      ],
    },
  });
  {
    const side = ['.OOOOOOOO.', 'OjjjjjjjjO', 'OjjjjjjjjOG', 'OOOOOOOOOOG', 'OjjjjjjjjO', 'OjjjjFjjjO', 'OjjjFFFjjO', 'OjjjjFjjjO', 'OjjjjjjjjO', 'OOOOOOOOOO'];
    const lid = ['.OOOOOOOOOOOOOOOO.', 'OJJJJJJJJJJJJJJJJO', 'OJJJJJJJJJJJJJJJJO', 'OJJJJJJJJJJJJJJJJO'];
    const body = ['OOOOOOOOGGOOOOOOOO', 'OjjjjjjjjjjjjjjjjO', 'OjjjjFjjjjjjFjjjjO', 'OjjjFFFjjjjFFFjjjO', 'OjjjjFjjjjjjFjjjjO', 'OjjjjjjjjjjjjjjjjO', 'OOOOOOOOOOOOOOOOOO'];
    const toys = ['OOOOOOOOOOOOOOOOOO', 'OnnRnnbbnnnn8nnnnO', 'OnRRRnbxbnn888nnnO'],
      rags = ['OOOOOOOOOOOOOOOOOO', 'OnnnvvnnnnccnnnnnO', 'OnvvvvvnncccbnnynO'];
    const sideOpen = (a, b) => ['OO', ...rep(3, 'OJ'), 'OOOOOOOOOO', 'O' + a + 'O', 'O' + b + 'O', ...side.slice(3)];
    V('toy-chest', { side, used: [...lid, ...toys, ...body], sideUsed: sideOpen('nRnnb8nn', 'RRRbx88n') });
    /* the open one: the toys put away, the lid shut, one block left out */
    V('toy-chest-open', {
      side: sideOpen('nRnnb8nn', 'RRRbx88n').slice(1),
      used: { put: [[0, 0, '.OOOOOOOOOOOOOOOO.'], [0, 1, 'OjjjjjjjjjjjjjjjjO'], [0, 2, 'OjjjjjjjGGjjjjjjjO'], [19, 7, '8888'], [19, 8, '8w88'], [19, 9, '8888']] },
      sideUsed: [...side, ...[]].map((r, i) => r + (i > 6 ? '.'.repeat(11 - r.length) + ['8888', '8w88', '8888'][i - 7] : '')),
    });
    const web = { o: 'o' };
    V('chest-cobwebbed', {
      side: patch(recol(side, { j: 'o', F: 'o' }), [[1, 1, 'W.W'], [1, 2, 'WW'], [1, 3, 'W'], [7, 1, 'WW'], [8, 2, 'W'], [2, 4, 'W']]),
      used: recol([...lid, ...rags, ...body], { j: 'o', F: 'o', J: 'p', ...web }),
      sideUsed: patch(recol(sideOpen('nvvnncbn', 'vvvvccby'), { j: 'o', F: 'o', J: 'p' }), [[2, 0, 'W'], [2, 1, 'WW'], [2, 2, 'W.W'], [2, 3, 'W']]),
    });
  }
  V('dolls-house', {
    side: [
      '..RRRRRRRR..',
      '.RRRRRRRRRR.',
      '.RRRRRRRRRR.',
      'RRRRRRRRRRRR',
      'RRRRRRRRRRRR',
      '.cccccccccc.',
      '.cc99cc99cc.',
      '.cc99cc99cc.',
      '.cccccccccc.',
      '.cOOOOOOOOc.',
      '.cc11cc11cc.',
      '.cc11cc11cc.',
      '.cccccccccc.',
      '.cccccccccc.',
      'OOOOOOOOOOOO',
    ],
    /* the front swung open: the little rooms */
    used: {
      put: [
        [1, 5, 'cyyyyyyyOJJJJJJJcOccc'],
        [1, 6, 'cywwyyyyOJJJ00JJcOc9c'],
        [1, 7, 'cyjjjyyxOJ0J00JJcOc9c'],
        [1, 8, 'cyjjjyy7OJ0JJJJJcOccc'],
        [1, 9, 'cOOOOOOOOOOOOOOOcOccc'],
        [1, 10, 'cLLLLLLLOvvvvvvvcOc1c'],
        [1, 11, 'cLLooooLOvvvvRRvcOc1c'],
        [1, 12, 'cLLoLLoLOvqqvRRvcOccc'],
        [1, 13, 'cLLoLLoLOvqqvvvvcOccc'],
        [18, 14, 'OOOO'],
        [18, 4, 'cccc'],
      ],
    },
    sideUsed: {
      put: [
        [11, 5, 'Occcccccc'],
        [11, 6, 'Occ99c99c'],
        [11, 7, 'Occ99c99c'],
        [11, 8, 'Occcccccc'],
        [11, 9, 'OOOOOOOOO'],
        [11, 10, 'Oc11cvvcc'],
        [11, 11, 'Oc11cvvcc'],
        [11, 12, 'OccccvGcc'],
        [11, 13, 'Occccvvcc'],
        [12, 14, 'OOOOOOOO'],
        [10, 5, 'n'],
        ...col(10, 6, 'nnnnnnnn'),
      ],
    },
  });
  V('suitcases-old', {
    side: ['..ooooo..', '..oOoOo..', '..ooooo..', '.eeeeeee.', '.eEeeeEe.', '.eEeeeEe.', '.eeeeeee.', '000000000', '0u00000u0', '0u00000u0', '0u00000u0', '000000000'],
    /* the top case opened where it lies */
    used: [
      '...oooooooooo...',
      '...oqqqqqqqqo...',
      '...oqqwwqjjqo...',
      '...oooooooooo...',
      '...owwwjjvvvo...',
      '...oooooooooo...',
      '.eeeeeeeeeeeeee.',
      '.eEeeeeGGeeeeEe.',
      '.eEeeeeeeeeeeEe.',
      '.eeeeeeeeeeeeee.',
      '0000000000000000',
      '0u000000GG0000u0',
      '0u000000000000u0',
      '0u000000000000u0',
      '0000000000000000',
    ],
    sideUsed: ['..oo.....', '..oq.....', '..oq.....', '..ooooo..', '..owjvo..', '..ooooo..', '.eeeeeee.', '.eEeeeEe.', '.eEeeeEe.', '.eeeeeee.', '000000000', '0u00000u0', '0u00000u0', '0u00000u0', '000000000'],
  });
  V('suitcase-open', {
    side: ['oo.....', 'oq.....', 'oq.....', 'oq.....', 'ooooooo', 'oOwjvOo', 'oOwjvOo', 'ooooooo'],
    /* packed, shut and strapped */
    used: ['.....OOOO.....', '.....O..O.....', 'oooooooooooooo', 'oOooooGGooooOo', 'oOooooooooooOo', 'oOooooooooooOo', 'oooooooooooooo'],
    sideUsed: ['...O...', '...O...', 'ooooooo', 'oOoooOo', 'oOoooOo', 'oOoooOo', 'ooooooo'],
  });
  V('sewing-machine', {
    side: [
      '..IIII..',
      '..IgII..',
      '..IIII..',
      '..IIII..',
      '..ItII..',
      'IIIIIIII',
      'oooooooo',
      '.O....O.',
      '.O.II.O.',
      '.O.II.O.',
      '.O.II.O.',
      '.O....O.',
      '.OIIIIO.',
      '.O....O.',
    ],
    /* at work: cloth under the needle, running off the table */
    used: {
      put: [
        [0, 4, 'wwwwwwwww'],
        [0, 5, 'wwWwwwWww'],
        [0, 6, 'wWw'],
        [0, 7, 'www'],
        [0, 8, 'wWw'],
        [0, 9, 'ww'],
        [1, 10, 'w'],
        [3, 2, 'R'],
      ],
    },
    sideUsed: {
      put: [
        [0, 4, 'wwI'],
        [0, 5, 'wwwwwwwww'],
        [6, 6, 'wWw'],
        [6, 7, 'www'],
        [6, 8, 'wWw'],
        [7, 9, 'ww'],
        [7, 10, 'w'],
        [3, 0, 'R'],
      ],
    },
  });
  V('spinning-wheel', {
    /* the wheel edge-on */
    side: [
      '...OO..',
      '...OO..',
      '...OO..',
      '...OO..',
      '...OO..',
      '.OOOOO.',
      'O..OO.O',
      'O..OO.O',
      'O..OO.O',
      'O..OO.O',
      'OOOOOOO',
      'O.....O',
      'O.....O',
    ],
    /* wool on the distaff, a thread running to the wheel */
    used: {
      put: [
        [0, 2, 'ww'],
        [0, 3, 'www'],
        [0, 4, 'www'],
        [0, 5, 'ww'],
        [0, 6, 'O'],
        [0, 7, 'O'],
        [3, 3, 'w'],
        [4, 2, 'w'],
        [5, 1, 'w'],
        [1, 6, 'w'],
        [1, 7, 'w'],
        [1, 8, 'w'],
      ],
    },
    sideUsed: {
      put: [
        [0, 2, 'ww'],
        [0, 3, 'www'],
        [0, 4, 'www'],
        [0, 5, 'ww'],
        [3, 0, 'ww'],
        [3, 1, 'ww'],
        [2, 2, 'w'],
      ],
    },
  });
  {
    /* mannequins in profile, looking right */
    const pole = [...rep(15, '..tt..'), 'tttttt'];
    const man = ['.cccc.', '.ccccc', '.cccc.', '..cc..', '.cccc.', '.ccccc', '.ccccc', '.ccccc', '.cccc.', '.cccc.', '.cccc.', '.ccccc', '.cccc.', '..cc..', ...pole];
    const form = ['......', '......', '......', '..OO..', '.cccc.', '.ccccc', '.ccccc', '.ccccc', '.cccc.', '.cccc.', '.cccc.', '.ccccc', '.cccc.', '..cc..', ...pole];
    /* dressed: a hat and a coat hung on it */
    const coat = [
      [3, 0, 'nnnnnn'],
      [2, 1, 'nnnnnnnn'],
      [1, 4, 'jjjjjjjjjj'],
      ...rep(8, 0).map((_, i) => [1, 5 + i, 'jjjjJjjjjj']),
      [1, 13, 'jjjj.jjjjj'],
      ...rep(4, 0).map((_, i) => [1, 14 + i, 'jjj'.padEnd(6) + 'jjjj'.slice(0, 3)]),
      ...rep(4, 0).map((_, i) => [5, 14 + i, 'tt']),
    ];
    const coatSide = [
      [1, 0, 'nnnn'],
      [0, 1, 'nnnnnnn'],
      [1, 4, 'jjjj'],
      ...rep(8, 0).map((_, i) => [1, 5 + i, 'jjjjj']),
      ...rep(5, 0).map((_, i) => [1, 13 + i, 'jjjjj']),
    ];
    V('mannequin', { side: man, used: { put: coat }, sideUsed: { put: coatSide } });
    V('mannequin-broken', {
      side: patch(recol(man, { c: 'P' }), [[2, 1, 'n'], [3, 2, 'nn'], [0, 28, 'PP']]),
      /* knocked about once more: the head off and on the floor */
      used: { put: [...box(4, 0, 4, 3, '.'), [5, 3, 'nP'], [9, 27, 'PPP'], [8, 28, 'PPnPP'], [8, 29, 'PPPPP']] },
      sideUsed: { put: [...box(0, 0, 6, 3, '.'), [2, 3, 'nP'], [7, 27, 'PPP'], [6, 28, 'PnPPP'], [6, 29, 'PPPPP']] },
    });
    /* work on the form: a half-made jacket pinned on, a tape measure round the neck */
    const pinned = [
      [2, 4, 'jjjjjjjj'],
      ...rep(8, 0).map((_, i) => [2, 5 + i, i % 2 ? 'jjjjwjjj' : 'jjjjJjjj']),
      [5, 3, 'y'],
      [4, 4, 'y  y'],
      [3, 5, 'y'],
      [3, 6, 'y'],
      [8, 5, 'y'],
    ];
    const pinnedSide = [[1, 4, 'jjjj'], ...rep(8, 0).map((_, i) => [1, 5 + i, 'jjjjj']), [2, 3, 'y'], [2, 4, 'y'], [3, 5, 'y'], [3, 6, 'y']];
    V('dress-form', { side: recol(form, { c: 'y' }), used: { put: pinned }, sideUsed: { put: pinnedSide } });
    /* the gown in profile, a short train behind */
    const gownSide = patch(recol(form, { c: 'w' }), [
      [1, 14, 'wwww'],
      [1, 15, 'wWww'],
      [0, 16, 'wwWwww'],
      [0, 17, 'wwWwww'],
      [0, 18, 'wwwWww'],
      [0, 19, 'wwwWwww'].map ? [0, 19, 'wwwWwww'] : 0,
    ].filter(Boolean));
    const gs = [...gownSide];
    const train = ['wwwWwww', 'wwwWwww', 'wwWwwww', 'wwWwwWw', '.wwWwwWw', '.wwWwwWw', 'wwwWwwww', 'wwWwwwww', 'wwWwwwww', 'wwwwwwww', 'WWWWWWWW'];
    const gown = patch(gs.map((r) => '..' + r), train.map((t, i) => [t[0] === '.' ? 0 : 1, 19 + i, t.replace(/^\./, 'w')]));
    V('dress-form-gown', {
      side: gown,
      /* the gown lifted off and left in a heap at its foot */
      used: {
        swap: { w: 'y', W: 'y' },
        put: [...box(0, 14, 12, 12, '.'), ...rep(12, 0).map((_, i) => [5, 14 + i, 'tt']), [0, 26, '..wwwwwwww..'], [0, 27, '.wwWwwwwWww.'], [0, 28, 'wwWwwwWwwwww'], [0, 29, 'WWWWWWWWWWWW'], [3, 13, ' yyyy ']],
      },
      sideUsed: [...recol(form, { c: 'y' }).slice(0, 26).map((r) => '..' + r), '..wwwwww', '.wwWwwww', 'wwwWwwWw', 'WWWWWWWW'],
    });
  }
  {
    /* round cages: the same from every side */
    const door = [
      [6, 5, '...'],
      [6, 6, '...'],
      [6, 7, '...'],
      [10, 5, 'GGG'],
      [10, 6, 'G.G'],
      [10, 7, 'G.G'],
      [10, 8, 'GGG'],
    ];
    /* the empty cage: a bird put in */
    V('birdcage-empty', { side: same, used: { put: [[4, 6, '66'], [3, 7, '9666']] }, sideUsed: sameUsed });
    /* let out: the bird sits on top of its cage */
    V('birdcage-bird', {
      side: same,
      used: ['....66....', '...9666...', '....GG....', '...GGGG...', '..G.G.GG..', '.G.G.G.GG.', ...rep(4, 'G.G.G.G.GG'), 'G.GOOOG.GG', ...rep(2, 'G.G.G.G.GG'), 'GGGGGGGGGG'],
      sideUsed: sameUsed,
    });
    /* a cloth thrown over the cage */
    V('birdcage-dead', {
      side: same,
      used: {
        put: [[3, 1, 'VVVV'], [2, 2, 'VVvVVV'], [1, 3, 'VVvVVVVV'], [0, 4, 'VVvVVVVvVV'], [0, 5, 'VVvVVVVvVV'], [0, 6, 'VvVVVvVVvV'], [0, 7, 'VvVVVvVVvV'], [0, 8, 'V.VVv.VV.V']],
      },
      sideUsed: sameUsed,
    });
  }
  V('rocking-horse-old', {
    base: 'side',
    /* head-on */
    side: ['.O..O.', '.pppp.', '.pnnp.', '.pppp.', '.vppv.', 'OppppO', 'OppppO', '.pppp.', '.pOOp.', '.pOOp.', 'OpOOpO', 'OO..OO'],
    /* set rocking: tipped forward on its runners */
    used: [
      '..........OOO..',
      '.........OpppO.',
      '........Oppnpp.',
      '........OpppOO.',
      '...O..vvvppp...',
      '..OpppvvvppO...',
      '..OppppppppO...',
      '...pppppppp....',
      '..pO.....pO....',
      'O.pO.....pO....',
      '.OpO.....pO....',
      '..OOOOOOOOOOOOO',
    ],
    sideUsed: ['......', '.O..O.', '.pppp.', '.pnnp.', '.pppp.', 'OvppvO', 'OppppO', '.pppp.', '.pOOp.', '.pOOp.', 'OpOOpO', 'OO..OO'],
  });
  V('rocking-chair-doll', {
    base: 'side',
    side: ['.OOOOOOO.', '.OoOoOoO.', '.Oobbbo..'.slice(0, 8) + 'O', '.ObxxxbO.', '.Oonxno..'.slice(0, 7) + 'O.', '.O77777O.', '.O77777O.', 'OOOOOOOOO', '.ooooooo.', '.O.....O.', '.O.....O.', '.O.....O.', 'OO.....OO'],
    /* the doll is gone from the chair, and lies on the floor */
    used: { put: [[6, 2, '..'], [5, 3, '....'], [6, 4, '..'], [5, 5, '....'], [5, 6, '....'], [5, 2, 'o'], [5, 3, 'o'], [5, 4, 'o'], [14, 11, 'bb'], [13, 12, 'bxx7777']] },
    sideUsed: { put: [[2, 2, 'oOoOo'], [2, 3, 'oOoOo'], [2, 4, 'oOoOo'], [2, 5, 'oOoOo'], [2, 6, 'oOoOo'], [10, 11, 'bb'], [10, 12, 'bxx7777']] },
  });
  V('furniture-covered', {
    side: [
      '..wwwwww..',
      '.wwwWwwww.',
      '.wwWwwwWw.',
      '.wwWwwwWw.',
      'wwwWwwwwWw',
      'wwWwwwwwWw',
      'wwWwwWwwWw',
      'wwWwwWwwww',
      'wwWwwWwwww',
      'wwwwwWwwww',
      'wwwwwwWwww',
      'wwwwwwWwww',
      '.wwwwwwww.',
    ],
    /* the dust sheet pulled off: an old sofa, the sheet in a heap beside it */
    used: [
      '..OOOOOOOOOOOOOOOO........',
      '.OvvvvvvvvvvvvvvvvO.......',
      '.OvvVvvvvvvVvvvvvvO.......',
      '.OvvvvvvvvvvvvvvvvO.......',
      'OOvvvvvVvvvvvvvVvvOO......',
      'OvOvvvvvvvvvvvvvvOvO......',
      'OvOOOOOOOOOOOOOOOOvO......',
      'OvOvvvvvvvVvvvvvvOvO......',
      'OvOVVVVVVVVVVVVVVOvO......',
      'OvOOOOOOOOOOOOOOOOvO..ww..',
      'OOooooooooooooooooOO.wwWww',
      '.OooooooooooooooooO.wwWwww',
      '.O................O.wWwwWw',
    ],
    sideUsed: [
      '.OOO...........',
      'OvvO...........',
      'OvvO...........',
      'OvvO...........',
      'OvvOOOOOOO.....',
      'OvvOvvvvvvO....',
      'OvvOOOOOOOO....',
      'OvvvvvvvvvO....',
      'OVVVVVVVVVO....',
      'OOOOOOOOOOO.ww.',
      'ooooooooooo.wWw',
      'oooooooooo.wWww',
      'O........O.wwWw',
    ],
  });
  V('furniture-covered-figure', {
    side: [
      '...wwww..',
      '..wwwwww.',
      '..wwwwnw.',
      '..wwwwww.',
      '..wwWww..',
      '.wwwWwww.',
      '.wwWwwww.',
      '.wwWwwWw.',
      '.wwWwwWw.',
      '.wwWwwWw.',
      '.wWwwwWw.',
      'wwWwwWww.',
      'wwWwwWww.',
      'wwWwwWwww',
      'wwWwwWwww',
      'wwWwwwWww',
      'wwwwwwWww',
      'wwwwwwwww',
      '.wwwwwww.',
    ],
    /* the sheet has dropped to the floor: there was nobody under it */
    used: ['....wwww......', '..wwwWwwww....', '.wwnwwWnwwww..', 'wwwWwwwwWwwww.', 'wWwwwwWwwwwWww', '.wwwwwwwwwwww.'],
    sideUsed: ['...www...', '.wwWwwww.', 'wwwwnwWww', 'wWwwWwwww', '.wwwwwww.'],
  });
  V('water-tank', {
    side: ['..tttttt..', '.tTTTTTTt.', 'tttttttttt', ...rep(6, 'tTtttttttt'), 'tttttttttt', '.I......I.', '.I......I.'],
    /* the tank runs over: water down the side, a pool under it */
    used: { put: [[12, 2, '3'], ...col(12, 3, '3232323'), [13, 5, '3'], [13, 6, '3'], [2, 11, '333333333333'], [3, 2, '3'], ...col(3, 3, '32')] },
    sideUsed: { put: [[7, 2, '3'], ...col(7, 3, '3232323'), [2, 11, '333333'], [3, 2, '3'], [3, 3, '3']] },
  });
  V('chairs-stacked', {
    side: ['.O......', '.O......', '.O......', '.OOOOOO.', 'oO....O.', 'oO....O.', 'oOOOOOO.', 'oooooooo', 'o......o', 'oooooooo', 'o......o', 'o......o', 'o......o', 'o......o'],
    /* one chair lifted down and set beside the others */
    used: [
      '.............O......O',
      '.............OOOOOOOO',
      '.............O......O',
      '.............OOOOOOOO',
      '.o........o..O......O',
      '.oooooooooo..O......O',
      '.o........o..OOOOOOOO',
      'oooooooooooo.OOOOOOOO',
      'o.o......o.o.O......O',
      'oooooooooooo.O......O',
      'o.o......o.o.O......O',
      'o.o......o.o.O......O',
      'o.o......o.o.O......O',
      'o.o......o.o.O......O',
    ],
    sideUsed: [
      '..........O......',
      '..........O......',
      '..........O......',
      '..........O......',
      'o.........O......',
      'o.........O......',
      'o.........OOOOOOO',
      'oooooooo..OOOOOOO',
      'o......o..O.....O',
      'oooooooo..O.....O',
      'o......o..O.....O',
      'o......o..O.....O',
      'o......o..O.....O',
      'o......o..O.....O',
    ],
  });

  /* ---------- cellar, wash house, the household machines ---------- */
  fam(
    {
      /* a round tank: from the side the gauge and the fire door stick out in front, the pipe runs down the middle */
      side: [
        '.tttttttt.',
        ...rep(2, 'tTtttttttt'),
        'tTttttttttG',
        'tTttttttttw',
        'tTttttttttG',
        ...rep(4, 'tTtttttttt'),
        'tTtt00tttt',
        ...rep(3, 'tTtt00tttt'),
        'tTtt00ttttI',
        'tTtt00ttttf',
        'tTtt00ttttI',
        'tttttttttt',
        'I........I',
      ],
      /* fired up: the fire door glowing, the needle in the red, steam at the joint */
      used: {
        put: [
          [6, 4, 'GRG'],
          [5, 14, 'IffI'],
          [5, 15, 'fFFf'],
          [5, 16, 'IffI'],
          [0, 6, 'w'],
          [0, 7, '.w'],
          [0, 8, 'ww'],
          [0, 9, 'w'],
        ],
      },
      sideUsed: {
        put: [
          [10, 4, 'R'],
          [10, 14, 'f'],
          [10, 15, 'Ff'],
          [10, 16, 'f'],
          [4, 7, 'w'],
          [3, 8, 'ww'],
          [4, 9, 'ww'],
        ],
      },
    },
    { boiler: {}, 'boiler-gauge': { t: '0', T: '9' } },
  );
  {
    const side = [
      '....IIII...',
      '....IiII...',
      '....IiII...',
      '....IiII...',
      '.IIIIIIIII.',
      'IiiiiiiiiiI',
      ...rep(2, 'IiIIIIIIIiI'),
      'IiIIIIIIIinI',
      ...rep(3, 'IiIIIIIIIifI'),
      'IiIIIIIIIinI',
      ...rep(2, 'IiIIIIIIIiI'),
      'IIIIIIIIIII',
      'II.......II',
    ];
    const fire = [[4, 8, 'nnnnnn'], [3, 9, 'nfFffFfn'], [3, 10, 'nFfFFfFn'], [3, 11, 'nfFfFFfn'], [4, 12, 'nnnnnn']];
    /* burnt down: embers in the ash */
    V('furnace', {
      side,
      used: { put: [[4, 9, 'nnnnnn'], [4, 10, 'nnnnnn'], [4, 11, 'arafra'], [5, 10, 'r'], [8, 10, 'a']] },
      sideUsed: { put: [...col(10, 9, 'nnr')] },
    });
    /* lit */
    V('furnace-cold', { side: recol(side, { f: 'n' }), used: { put: fire }, sideUsed: { put: [...col(10, 9, 'fFf'), [12, 10, 'f']] } });
  }
  fam(
    {
      side: ['...II....', '...II.tt.', '.IIIIIttI', 'IiiiiiiiI', 'IiIIIIIiI', 'IiIiiiIiI', 'IiIiiiIiI', 'IiiiiiiiI', 'IIIIIIIII', '.nn...nn.'],
      /* started: the lamp green, smoke from the exhaust, the whole thing shaking */
      used: { put: [[3, 5, '8'], [6, 0, 'a.A'], [7, 1, 'a'], [13, 0, 'aaa'], [9, 5, 'FfFf'], [9, 6, 'fFfF']] },
      sideUsed: { put: [[5, 0, 'a.A'], [6, 1, 'a'], [3, 5, 'FfF'], [3, 6, 'fFf']] },
    },
    { 'generator-old': {}, 'generator-diesel': { i: 'L', u: 'n' } },
  );
  V('workbench', {
    side: ['.....tO..', 'qqqqqqqqqq', 'pppppppppp', '.oOOOOOOo.', '.o......o.', '.o......o.', '.oooooooo.', '.o......o.', '.o......o.', '.o......o.'],
    /* work in hand: a plank in the vice, shavings on the floor, a board leaning by */
    used: {
      put: [
        [1, 0, 'qqqqqqq'],
        [5, 9, 'yy.y'],
        [3, 9, 'y'],
        [9, 8, 'yy'],
        [8, 9, 'yyyy'],
        [20, 1, 'q'],
        [20, 2, 'q'],
        [19, 3, 'qp'],
        [19, 4, 'qp'],
        [19, 5, 'qp'],
        [18, 6, 'qp'],
        [18, 7, 'qp'],
        [18, 8, 'qp'],
        [18, 9, 'qp'],
      ],
    },
    sideUsed: { put: [[2, 0, 'qqq'], [3, 9, 'yyy'], [4, 8, 'y'], [11, 1, 'q'], [11, 2, 'q'], ...rep(7, 0).map((_, i) => [10, 3 + i, 'qp'])] },
  });
  {
    /* the cask from its long side: hoops, staves, the tap in front */
    const side = [
      '..oooooooooooo..',
      '.oIooooooooooIo.',
      'OOIOOOOOOOOOOIOO',
      'ooIooooooooooIoo',
      'ooIooooooooooIoo',
      'OOIOOOOOOOOOOIOOG',
      'ooIooooooooooIooGG',
      'ooIooooooooooIoo',
      'OOIOOOOOOOOOOIOO',
      'ooIooooooooooIoo',
      '.oIooooooooooIo.',
      '..oooooooooooo..',
      '.OO..........OO.',
    ];
    /* the tap left running: wine on the floor */
    V('barrel-wine', {
      side,
      used: { put: [...col(5, 7, 'vvvvv'), [2, 12, 'Ovvvvvvv'], [4, 11, ' v ']] },
      sideUsed: { put: [...col(17, 7, 'vvvvv'), [14, 12, 'Ovvvvvv']] },
    });
    /* drunk dry: only a dark stain left */
    V('barrel-open', { side: same, used: { put: [[3, 1, 'nnnnnn'], ...col(4, 3, 'vvvvvv'), [5, 3, 'v'], [5, 4, 'v'], ...col(8, 3, 'vvv'), [3, 12, 'vvvvvvv']] }, sideUsed: sameUsed });
    V('barrel-smashed', { side: same });
    /* water drawn: ripples, and what slopped over the rim */
    V('rain-barrel-moss', {
      side: same,
      used: { put: [[2, 0, '32233223'], ...col(7, 1, '3'), ...col(7, 3, '33'), ...col(8, 5, '333'), [9, 12, '3333'], [5, 12, '333']] },
      sideUsed: sameUsed,
    });
  }
  {
    /* shelves end-on: the side board, the jars showing at the open front */
    const side = ['OOOOO', 'Ooo.O'.slice(0, 4), 'Ooo22', 'Ooo29', 'OOOOO', 'Ooo.', 'Ooo22', 'Ooo2L', 'OOOOO', 'Ooo.', 'Ooo22', 'Ooo2r', 'OOOOO'];
    /* jars taken down: gaps on the shelves, one left standing on the floor */
    const used = {
      put: [
        [9, 1, '....'],
        [9, 2, '....'],
        [9, 3, '....'],
        [1, 5, '....'],
        [1, 6, '....'],
        [1, 7, '....'],
        [5, 9, '..'],
        [4, 10, '...'],
        [4, 11, '...'],
        [15, 10, '.OO.'],
        [15, 11, '2222'],
        [15, 12, '2rr2'],
      ],
    };
    const sideUsed = { put: [[3, 6, '..'], [3, 7, '..'], [6, 10, '.OO.'], [6, 11, '2222'], [6, 12, '2rr2']] };
    fam(
      { side, used, sideUsed },
      {
        'jar-shelves': {},
        'pantry-shelves': { 2: 'c', 9: 'y', L: 'c', r: 'u' },
        'preserve-shelves': { 9: 'r', L: 'v', O: 'E' },
        'shelf-junk': { 2: 'a', 9: 'u', L: 'I', r: 't', y: 'O' },
        'potion-shelf': { 9: '5', L: '8', r: 'R' },
      },
    );
  }
  V('wine-rack', {
    side: ['OOOOOO', 'OooooOn', 'OOOOOO', 'OooooO', 'OOOOOO', 'OooooOn', 'OOOOOO', 'OooooOn', 'OOOOOO', 'OooooO', 'OOOOOO'],
    /* bottles drawn: empty holes, one bottle stood on the floor */
    used: { put: [[1, 1, '..'], [7, 3, '..'], [10, 5, '...'], [4, 9, '..'], [7, 7, '..'], [15, 6, 'n'], [15, 7, 'n'], [15, 8, 'HH'], [15, 9, 'HH'], [15, 10, 'HH'], [18, 9, 'HHHHnn'], [18, 10, 'HHHH']] },
    sideUsed: { put: [[6, 1, '.'], [6, 7, '.'], [8, 6, 'n'], [8, 7, 'n'], [8, 8, 'H'], [8, 9, 'H'], [8, 10, 'H']] },
  });
  V('cage-large', {
    side: ['IIIIIIIIII', ...rep(5, 'I.I.I.I.II'), 'IIIIIIIIII', ...rep(10, 'I.I.I.I.II'), 'IIIIIIIIII'],
    /* the door stands open */
    used: {
      put: [...box(9, 7, 5, 10, '.'), [9, 16, '.....'], [16, 6, 'IIIII'], ...rep(10, 0).map((_, i) => [16, 7 + i, 'I.I.I']), [16, 17, 'IIIII'], [16, 12, 'IItII']],
    },
    sideUsed: {
      put: [[10, 6, 'IIIIIII'], ...rep(10, 0).map((_, i) => [10, 7 + i, '.I.I.II']), [10, 17, 'IIIIIII'], [14, 12, 't'], ...col(9, 7, 'nnnnnnnnnn')],
    },
  });
  V('laundry-mangle', {
    side: ['..III..', '..I.I..', '.OqqqO.', '.OqqqOI', '.OpppOI', '.OpppO.', '..I.I..', '..I.I..', '.I...I.', '.I...I.', 'II...II', 'I.....I'],
    /* a sheet going through the rollers */
    used: { put: [[4, 3, 'wwwwww'], [4, 4, 'wwWwww'], [4, 5, 'wWwwWw'], [4, 6, 'wWwwWw'], [4, 7, 'wwWwww'], [4, 8, 'wwWwWw'], [5, 9, 'wwww'], [6, 10, '3'], [8, 11, '3']] },
    sideUsed: { put: [[5, 3, 'www'], [6, 4, 'ww'], [7, 5, 'ww'], [7, 6, 'wW'], [7, 7, 'ww'], [7, 8, 'Ww'], [7, 9, 'w'], [8, 11, '3'], [0, 3, 'ww'], [0, 4, 'w']] },
  });
  V('water-pump', {
    base: 'side',
    /* from in front: the spout towards the viewer, the handle behind */
    side: ['...IIII...', '...IiII...', '...IiII...', '...IiII...', '...tttt...', '...tnnt...', '...tttt...', ...rep(4, '...IiII...'), '..IIIIII..', 'ssssssssss'],
    /* the handle up, water gushing from the spout */
    used: { put: [[6, 2, 'I...'], [9, 3, '.'], [7, 1, 'II'], [9, 0, 'I'], ...col(7, 6, '232322'), [6, 12, '323'], [6, 11, ' 2 2']] },
    sideUsed: { put: [[4, 5, '22'], ...col(4, 6, '23232'), ...col(5, 6, '32323'), [3, 12, '3233'], [3, 11, '2  2']] },
  });
  V('milk-churn', {
    side: same,
    /* the lid off beside it, milk to the brim */
    used: { put: [[0, 0, '........'], [1, 1, '.twwt.'], [10, 9, 'tttt'], [9, 10, 'tTtttt']] },
    sideUsed: sameUsed,
  });
  V('oil-drum', {
    side: same,
    /* it leaks: a black pool spreading */
    used: { put: [...col(5, 6, 'n.nn'), [5, 10, 'n'], [4, 11, 'nn'], [1, 12, 'nnnnnnnnnnnn']] },
    sideUsed: sameUsed,
  });
  V('washing-tub', {
    side: same,
    /* washing in the suds */
    used: { put: [[3, 0, 'jj'], [2, 1, 'jjjj'], [8, 0, 'RR'], [8, 1, 'RRR'], [6, 1, 'w']] },
    sideUsed: sameUsed,
  });
  V('butchers-block', {
    side: ['...TTO..', 'qqqqqqqq', 'pprppppp', 'pppppppp', 'oooooooo', ...rep(6, '.O....O.')],
    /* at work: a joint on the block, blood down the front */
    used: { put: [[9, 0, 'rRRx'], [3, 0, 'r'], [9, 1, 'rrrr'], ...col(10, 2, 'rrrr'), [11, 2, 'r'], [4, 2, 'r'], [4, 3, 'r'], [9, 10, 'rr'], [8, 11, 'rrrr']] },
    sideUsed: { put: [[1, 0, 'rR'], [0, 1, 'rrr'], ...col(5, 2, 'rrr'), [6, 2, 'r'], [3, 11, 'rrr']] },
  });
  V('clothes-horse', {
    side: ['..q..', '..q..', '.qPq.', '.qPq.', '.qPq.', '.q.q.', '.q.q.', 'q...q', 'q...q', 'q...q'],
    /* hung full */
    used: { put: [[4, 2, 'RR'], [4, 3, 'RR'], [4, 4, 'RR'], [4, 5, 'R'], [9, 2, 'www'], ...rep(4, 0).map((_, i) => [9, 3 + i, 'wWw']), [0, 2, 'w'], [0, 3, 'w'], [0, 4, 'w']] },
    sideUsed: { put: [[2, 2, 'w'], [2, 3, 'W'], [2, 4, 'w'], [2, 5, 'w'], [2, 6, 'R']] },
  });
  V('bottle-crate', {
    side: ['H.H.H.', 'H.H.H.', 'pppppp', 'pOpOpO', 'pppppp', 'pOpOpO', 'pppppp'],
    /* three bottles taken */
    used: { put: [[2, 0, '.'], [2, 1, '.'], [4, 0, '.'], [4, 1, '.'], [8, 0, '.'], [8, 1, '.']] },
    sideUsed: { put: [[2, 0, '.'], [2, 1, '.']] },
  });

  /* ---------- garden and yard ---------- */
  V('barbecue', {
    side: same,
    /* supper on the grill, smoke rising */
    used: tall('barbecue', 3, [[5, 0, 'aa'], [4, 1, 'aAa'], [2, 2, '000.uuu0'], [2, 5, 'FfFfFfFf'], [2, 3, 'tttttttt']]),
    sideUsed: sameUsed,
  });
  V('lawnmower', {
    base: 'side',
    /* from in front: the handle a bow behind the deck */
    side: ['.IIIIII.', ...rep(4, '.I....I.'), 'RRRRRRRR', 'RRRRRRRR', 'RvvvvvvR', 'nn....nn', 'nn....nn'],
    /* running: smoke from the engine, cut grass flying out behind */
    used: tall('lawnmower', 0, [[5, 2, 'aa'], [4, 3, 'aAa'], [5, 4, 'a'], [0, 9, 'MHM'], [0, 8, 'HM'], [1, 7, 'M']], 3),
    sideUsed: { put: [[3, 2, 'aa'], [2, 3, 'aAa'], [3, 4, 'a'], [2, 9, 'MHMH'], [3, 8, 'MH']] },
  });
  {
    /* from the wheel end */
    const front = ['tttttttttt', '.tTtttttt.', '..tttttt..', '..tttttt..', '.O..nn..O.', '.O..nn..O.', '.O..nn..O.'];
    const heap = [[4, 0, 'eeMe'], [2, 1, 'eeEeeeeeE'], [1, 2, 'eEeeeMeeeee']];
    const heapF = [[3, 0, 'eeMe'], [1, 1, 'eEeeeeEe'], [0, 2, 'eeeEeeMeee']];
    /* loaded with earth */
    V('wheelbarrow', { base: 'side', side: front, used: tall('wheelbarrow', 2, heap), sideUsed: patch(['', '', ...front], heapF) });
    V('wheelbarrow-old', {
      base: 'side',
      side: patch(recol(front, { t: 'u', T: '0', n: 'I' }), [[3, 0, 'M'], [6, 1, 'U']]),
      used: tall('wheelbarrow-old', 2, heap),
      sideUsed: patch(['', '', ...recol(front, { t: 'u', T: '0', n: 'I' })], heapF),
    });
  }
  {
    const side = [
      '.RRRRRRRRRRRRR.',
      'RRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRR',
      ...rep(7, '.ppppppppppppp.'),
    ];
    /* the dog is at home, and looks out */
    V('dog-house', {
      side,
      used: { put: [[5, 6, '0nnnn0'], [5, 7, '000000'], [5, 8, '0n00n0'], [5, 9, '00ww00'], [6, 10, 'wnnw']] },
      sideUsed: { put: [[14, 6, '0'], [14, 7, '000'], [14, 8, '0n0ww'], [14, 9, '000wn'], [14, 10, '0ww']] },
    });
    /* something in the dark of the old kennel opens its eyes; the chain has been dragged out */
    V('kennel-old', {
      side: patch(recol(side, { R: 'O', p: 'a' }), [[2, 3, 'M'], [9, 1, 'm'], [5, 8, 'A'], [10, 6, 'A']]),
      used: { put: [[6, 7, 'F..F'], [9, 10, 'tItItItI'], [17, 10, 't']] },
      sideUsed: { put: [[14, 7, 'F'], [14, 10, 'tItIt']] },
    });
  }
  {
    /* the frame from its end: an A, the seat hanging in it */
    const a = rep(24, 0).map((_, y) => {
      const d = Math.round((y * 4) / 23),
        row = [...'.'.repeat(11)];
      row[4 - d] = row[5 - d] = row[5 + d] = row[6 + d] = 't';
      if (y > 0 && y < 18) row[5] = 'I';
      if (y === 18) row[4] = row[5] = row[6] = 'O';
      return row.join('');
    });
    const swung = rep(24, 0).map((_, y) => {
      const d = Math.round((y * 4) / 23),
        row = [...'.'.repeat(16)];
      row[4 - d] = row[5 - d] = row[5 + d] = row[6 + d] = 't';
      if (y > 0 && y < 15) row[5 + Math.round((y * 9) / 14)] = 'I';
      if (y === 15) row[13] = row[14] = row[15] = 'O';
      if (y === 14) row[15] = 'O';
      return row.join('');
    });
    V('swing-set', {
      side: a,
      /* set swinging: the seat high, towards the viewer */
      used: { put: [...box(5, 12, 10, 7, '.'), [4, 12, 'OOOOOOOOOOOO'], [4, 13, 'OOOOOOOOOOOO'], [4, 11, 'I'], [15, 11, 'I'], [4, 10, 'I'], [15, 10, 'I'], ...col(5, 9, '.'), ...col(14, 9, '.'), [4, 9, 'I'], [15, 9, 'I']] },
      sideUsed: swung,
    });
  }
  V('slide', {
    base: 'side',
    /* from the foot of the chute, looking up it */
    side: ['t......t', 'tttttttt', 't.rRRr.t', 'ttrRRrtt', 't.rRRr.t', 't.rRRr.t', 'ttrRRrtt', 't.rRRr.t', 't.rRRr.t', 'trRRRRrt', 'trRRRRrt', 'rRRRRRRr', 'rRRRRRRr', 'rrrrrrrr'],
  });
  V('parasol', {
    side: same,
    /* folded down and tied */
    used: ['......RR......', '......Rw......', '.....RwRw.....', '.....RwRw.....', '.....RwRw.....', '.....RwRw.....', '.....tttt.....', '.....RwRw.....', '.....Rw.w.....', ...rep(8, '......tt......'), '....tttttt....'],
    sideUsed: sameUsed,
  });
  V('deck-chair', {
    base: 'side',
    side: ['qqqqqqqqq', ...rep(6, 'qRwRwRwRq'), 'qqqqqqqqq', ...rep(3, 'q.......q')],
    /* a towel left over the back, a sun hat on the ground */
    used: { put: [[0, 0, 'jj'], [0, 1, 'jJj'], [0, 2, 'j.jJ'], [3, 3, 'jJ'], [4, 4, 'jj'], [0, 3, 'j'], [13, 9, 'yy'], [12, 10, 'yRRy'], [11, 11, 'yyyyyy']] },
    sideUsed: { put: [[1, 0, 'jjjjjjj'], [1, 1, 'jJjjjJj'], [1, 2, 'jjjjjjj'], [1, 3, 'jj.j.jj'], [11, 9, 'yy'], [10, 10, 'yRRy'], [9, 11, 'yyyyyy']] },
  });
  {
    /* along the line: one post, the washing edge-on */
    const side = ['.O.', 'tOt', 'wOw', 'wOR', 'wOR', 'wO.', 'wO.', ...rep(13, '.O.')];
    /* the washing taken in: the bare line, a peg or two, the full basket */
    const basket = (a, b) => [[16, 13, '.' + a + '.' + b + '..'], [15, 14, a + a + b + b + a + a + b], [14, 15, 'yyyyyyyyyy'], [14, 16, 'yYyYyYyYyY'], [14, 17, 'YyYyYyYyYy'], [14, 18, 'yYyYyYyYyY'], [15, 19, 'yyyyyyyy']];
    const bare = [...box(1, 2, 24, 10, '.'), [4, 2, 'q'], [13, 2, 'q'], [17, 2, 'q']];
    V('washing-line', { side, used: { put: [...bare, ...basket('w', 'j')] }, sideUsed: { put: [[0, 2, '. .'], [2, 3, '.'], [2, 4, '.'], ...col(0, 3, '....'), [2, 2, 'q'], [4, 15, 'wjwy'].slice(0, 3), [4, 14, 'wjw'], [4, 15, 'yyyyy'], [4, 16, 'yYyYy'], [4, 17, 'YyYyY'], [4, 18, 'yYyYy'], [4, 19, 'yyyyy']] } });
    V('washing-line-sheets', {
      side: patch(recol(side, { w: 'P', R: 'P', O: 'E' }), [...col(0, 7, 'PPPP'), ...col(2, 5, 'PPrr')]),
      used: { put: [...bare, ...basket('P', 'r')] },
      sideUsed: { put: [...box(0, 2, 1, 9, '.'), ...box(2, 2, 1, 7, '.'), [2, 2, 'q'], [4, 14, 'PrP'], [4, 15, 'yyyyy'], [4, 16, 'yYyYy'], [4, 17, 'YyYyY'], [4, 18, 'yYyYy'], [4, 19, 'yyyyy']] },
    });
  }
  V('hammock', {
    side: ['..O..', '.cOc.', '.cOc.', '.cOc.', '.cOc.', '..O..', ...rep(6, '..O..')],
    /* somebody has been lying in it: it hangs lower, a pillow and a blanket left behind */
    used: { put: [[1, 1, '.'], [2, 2, '..'], [4, 3, '....'], [8, 4, '........'], [16, 3, '....'], [20, 2, '..'], [22, 1, '.'], [1, 2, 'c'], [2, 3, 'c'], [3, 4, 'cc'], [5, 5, 'wwwjjjjjjjjjcc'], [5, 6, 'cccccccccccccc'], [19, 4, 'cc'], [21, 3, 'c'], [22, 2, 'c']] },
    sideUsed: { put: [[1, 5, 'cOc'], [1, 6, 'jOj'], [2, 5, 'O']] },
  });
  V('paddling-pool', {
    side: same,
    /* a duck set afloat, water slopped over the side */
    used: { put: [[10, 0, '66'], [9, 1, '96666'], [3, 3, '3'], [3, 4, '33'], [17, 3, '3'], [4, 5, '333'], [16, 4, '3'], [15, 5, '3333']] },
    sideUsed: sameUsed,
  });
  V('bird-house', {
    side: ['OOOOOO.', 'OOOOOOO', '.OOOOOO', '..OOOOO', '.ppppp.', '.ppppp.', '.pppppO', '.ppppp.', ...rep(8, '...O...')],
    /* a bird has moved in */
    used: tall('bird-house', 2, [[2, 0, '66'], [1, 1, '9666'], [3, 7, '6']]),
    sideUsed: { put: [[5, 4, '66'], [5, 5, '669'], [6, 6, '6']] },
  });
  {
    const side = ['..R.', '.RR.', '.RRR', '.xxx', '.wxxx', '.www', 'jjww', 'jjjj', '.jjj', '.OO.'];
    const old = { R: 'u', j: 'N', x: 'a', w: 'P' };
    /* knocked over */
    V('garden-gnome', { side, used: rot(ROWS['garden-gnome']), sideUsed: rot(side) });
    V('gnome-old', { side: patch(recol(side, old), [[0, 7, 'M']]), used: rot(ROWS['gnome-old']), sideUsed: rot(patch(recol(side, old), [[0, 7, 'M']])) });
  }
  V('watering-can', {
    base: 'side',
    side: ['..ttt..', '.t...t.', '.ttttt.', 'ttTtttt', 'ttTtttt', 'tttIttt', 'ttttttt'],
    /* watering: a spray from the rose */
    used: tall('watering-can', 0, [[2, 2, '2'], [1, 3, '22'], [1, 4, '232'], [0, 5, '2322'], [0, 6, '23232']], 3),
    sideUsed: { put: [[3, 5, '2'], [2, 6, '232'], [1, 7, '23232']] },
  });
  V('garden-hose', {
    side: ['.H.', 'HMH', 'HHH', 'HMH', 'HHH', 'HMH', '.Ht'],
    /* turned on: water running from the nozzle */
    used: { put: [[9, 6, '22'], [11, 5, '2'], [11, 6, '2'], [10, 7, '3333'], [9, 7, '3']] },
    sideUsed: { put: [[3, 6, '2'], [3, 7, '333'], [2, 7, '3']] },
  });

  /* ---------- small things about the house: mostly only what they look like after use ---------- */
  V('rug', {
    side: ['.vvvvvvvvvv.', 'vVgVVVVVVgVv', 'vVVVVggVVVVv', 'vVVgVVVVgVVv', 'vVVgVVVVgVVv', 'vVVVVggVVVVv', 'vVVgVVVVgVVv', 'vVVgVVVVgVVv', 'vVVVVggVVVVv', 'vVgVVVVVVgVv', '.vvvvvvvvvv.'],
    /* a corner turned back */
    used: { put: [[24, 2, 'cc.'], [22, 3, 'ccc..'], [21, 4, 'cc....']] },
    sideUsed: { put: [[10, 8, 'c.'], [8, 9, 'ccc.'], [7, 10, 'cc...']] },
  });
  V('doormat', {
    side: ['yYyYy', 'YyyyY', 'yyyyy', 'YyyyY', 'yyyyy', 'YyyyY', 'yYyYy'],
    /* the corner lifted: the key under it */
    used: { put: [[10, 1, 'YYY.'], [11, 2, 'gGg']] },
    sideUsed: { put: [[2, 5, 'YYY'], [3, 6, 'gG']] },
  });
  V('photo-frame', {
    side: ['OO', 'Oc', 'Oc', 'Oc', 'Oc', 'OO'],
    /* the glass cracked */
    used: { put: [[2, 1, 'n'], [3, 2, 'nn'], [3, 3, 'n'], [4, 4, 'n'], [5, 2, 'n']] },
    sideUsed: { put: [[1, 2, 'n'], [1, 3, 'n'], [2, 5, '.2']] },
  });
  V('houseplant', { side: same, /* knocked over, earth on the floor */ used: patch(rot(ROWS.houseplant), [[1, 7, 'e'], [0, 8, 'eEee']]), sideUsed: sameUsed });
  V('flower-pot', { side: same, used: patch(rot(ROWS['flower-pot']), [[0, 3, 'eEe']]), sideUsed: sameUsed });
  V('vase-flowers', {
    side: same,
    /* cracked: the water runs out, petals fall */
    used: { put: [[2, 4, 'n'], [3, 5, 'n'], [3, 6, 'n'], [0, 0, '.u'], [4, 0, '.u'], [0, 7, 'R.33333'], [5, 6, '13']] },
    sideUsed: sameUsed,
  });
  V('cushion', { side: ['.vv.', 'vVvv', 'vvgv', 'vVvv', '.vv.'], /* sat on */ used: { put: [[2, 0, '....'], [2, 1, 'VVVV'], [3, 2, 'VV']] }, sideUsed: { put: [[1, 0, '..'], [1, 1, 'VV']] } });
  V('pillow', { side: ['.www.', 'wwwwW', '.WWW.'], /* slept on */ used: { put: [[3, 0, '...'], [3, 1, 'WWW']] }, sideUsed: { put: [[2, 0, '.'], [2, 1, 'W']] } });
  V('fan', {
    side: ['..tt.', '.ItTt', 'IIItT', '.ItTt', '..tt.', '..i..', '..i..', '..i..', '..i..', '..i..', '.iii.'],
    /* switched on */
    used: { put: [[1, 1, 'tTTTTTt'], [0, 2, 'tTTTiTTTt'], [1, 3, 'tTTTTTt'], [10, 1, 'ww'], [10, 3, 'ww'], [11, 2, 'ww']] },
    sideUsed: { put: [[6, 1, 'ww'], [6, 3, 'ww'], [7, 2, 'ww']] },
  });
  V('laundry-basket', {
    side: ['.w.j.v.', '.wwjjv.', 'yyyyyyy', 'yYyYyYy', 'YyYyYyY', 'yYyYyYy', '.YyYyY.', '.yyyyy.'],
    /* emptied */
    used: { put: [[0, 0, '..........'], [0, 1, '..........']] },
    sideUsed: { put: [[0, 0, '.......'], [0, 1, '.......']] },
  });
  V('toaster', {
    side: ['..O..', '.ttt.', 'tTtttI', 'tTttt', 'ttttt', 'I...I'],
    /* the toast taken, crumbs left */
    used: { put: [[2, 0, '..'], [5, 0, '..'], [2, 5, 'yy.y']] },
    sideUsed: { put: [[2, 0, '.'], [1, 5, 'yy']] },
  });
  fam(
    {
      base: 'side',
      side: ['..II..', '.tttt.', 'tTtttt', 'tTtItt', 'tTtItt', 'tttttt', '.IIII.'],
      /* on the boil */
      used: (slug) => tall(slug, 3, [[7, 3, 'w'], [6, 2, 'ww'], [6, 1, 'ww'], [7, 0, 'w']]),
      sideUsed: ['..ww..', '..ww..', '...w..', '..II..', '.tttt.', 'tTtttt', 'tTtItt', 'tTtItt', 'tttttt', '.IIII.'],
    },
    { kettle: {}, 'kettle-copper': { t: '0', T: '9', I: 'u' } },
  );
  V('blender', { side: same, /* poured out, the lid off */ used: { put: [[1, 0, '....'], [2, 2, '22'], [2, 3, '27']] }, sideUsed: sameUsed });
  V('frying-pan', {
    base: 'side',
    side: ['.IIIII.', 'IiiOiiI', '.IIIII.'],
    /* an egg in it */
    used: tall('frying-pan', 1, [[2, 0, 'wFFw']]),
    sideUsed: ['..wFFw.', '.IIIII.', 'IiiOiiI', '.IIIII.'],
  });
  V('cooking-pot', { side: same, /* boiling over */ used: tall('cooking-pot', 2, [[4, 0, 'ww'], [3, 1, 'www'], [2, 2, 'wwwwww'], [7, 3, 'w'], [7, 4, 'w']]), sideUsed: sameUsed });
  V('kitchen-knife', { /* used: blood on the blade */ used: { put: [[0, 0, 'rrrTTT'], [1, 1, 'rr']] } });
  V('fork', { used: { put: [[0, 0, '000'], [0, 1, '0u0']] } });
  V('spoon', { used: { put: [[1, 0, '999'], [1, 1, '999']] } });
  V('plate', { /* eaten off: a bone and crumbs */ used: tall('plate', 1, [[2, 0, 'bbby']]) });
  V('bowl', { /* filled */ used: tall('bowl', 1, [[2, 0, '9999'], [1, 1, '999999']]) });
  V('glass', { /* drunk */ used: { put: [[1, 1, '..'], [1, 2, '..']] } });
  V('teacup', { /* drunk: a stain down the side */ used: { put: [[1, 1, 'www'], [3, 2, '0'], [3, 1, '0']] } });
  V('teapot', { base: 'side', side: ['..ww..', 'wwwwww', 'wWwwww', 'wWwwww', 'wWwwww', 'wwwwww', '.WWWW.'], /* hot tea */ used: tall('teapot', 2, [[8, 4, '2'], [7, 3, '22'], [7, 2, '22'], [8, 1, '2']]), sideUsed: ['..22..', '..22..', '..ww..', 'wwwwww', 'wWwwww', 'wWwwww', 'wWwwww', 'wwwwww', '.WWWW.'] });
  V('chopping-board', { /* something chopped */ used: { put: [[0, 0, 'RRR']] } });
  V('rolling-pin', { used: { put: [[3, 0, 'w'], [6, 0, 'w']] } });
  V('whisk', { used: { put: [[1, 0, 'ccc'], [0, 1, 'ccccc'], [1, 2, 'c']] } });
  V('spatula', { used: { put: [[0, 0, '9999'], [1, 1, '99']] } });
  V('jar', {
    side: same,
    /* opened: a spoon in the jam, the lid beside it */
    used: tall('jar', 2, [[3, 0, 't'], [3, 1, 't'], [0, 2, '...t.'], [1, 4, '2t2'], [6, 7, 'OOO']]),
    sideUsed: sameUsed,
  });
  V('salt-pepper', { /* the salt knocked over */ used: tall('salt-pepper', 0, [...box(3, 0, 2, 5, '.'), [1, 3, 'twwW'], [1, 4, 'twwW'], [0, 4, 'w']], 3) });
  V('bin', {
    side: same,
    /* the lid off and leaning against it, rubbish to the brim */
    used: [
      '...w.6.......',
      '..wP0w6w.....',
      'ttttttttt....',
      '.tItItIt.....',
      '.tItItIt.....',
      '.tItItIt...I.',
      '.tItItIt..It.',
      '.tItItIt..It.',
      '.ttttttt.It..',
    ],
    sideUsed: sameUsed,
  });
  V('toilet-paper', { /* a length pulled off */ used: { put: [[5, 1, 'w'], [5, 2, 'w'], [5, 3, 'w'], [5, 4, 'ww'], [6, 5, 'ww']] } });
  V('toothpaste', { /* the cap off, squeezed */ used: { put: [[0, 0, '.'], [0, 2, '.'], [0, 1, 'J'], [6, 0, '..'], [7, 2, '.']] } });
  V('soap', { /* lathered */ used: tall('soap', 2, [[1, 0, '2'], [1, 1, '22'], [4, 1, '22'], [5, 0, '22']]) });
  V('towel', { /* used and dropped */ used: ['...jj....', '.jjjJjj..', 'jjJjjjwjj', 'jjjjJjwwj', 'jJjjjjjjj'] });
  V('shampoo', { used: patch(rot(ROWS.shampoo), [[7, 2, '4'], [7, 3, '444']]) });
  V('hairdryer', { /* switched on */ used: tall('hairdryer', 0, [[0, 0, 'ww'], [1, 1, 'ww'], [0, 2, 'ww'], [4, 1, 'f']], 3) });
  V('towel-rail', {
    side: ['.t.', '.t.', 'PtP', 'PtP', 'PtP', 'PtP', 'P..'],
    /* a towel taken */
    used: { put: box(7, 2, 4, 4, '.') },
    sideUsed: { put: box(2, 2, 1, 4, '.') },
  });
  V('bucket-and-mop', { /* the floor mopped: a wet patch */ used: { put: [[1, 7, '33333'], [0, 12, '.33333333333'], [9, 11, '333']] } });
  V('paint-can', { side: same, /* opened: paint down the side, the lid beside it */ used: { put: [[1, 0, 'RRRRR'], [2, 1, 'R'], [2, 2, 'R'], [5, 1, 'R'], [8, 4, 'ttttt']] }, sideUsed: sameUsed });
  V('tyre', { side: ['.nn.', 'nnIn', 'nInn', 'nnIn', 'nInn', 'nnIn', 'nInn', '.nn.'] });
  V('fuel-can', {
    side: ['.In.', 'RRRR', ...rep(5, 'RvvR'), 'RRRR'],
    /* the cap off, fuel spilt */
    used: { put: [[5, 0, '..'], [7, 1, '9'], [7, 2, '9'], [7, 6, '9'], [6, 7, ' 999'], [7, 3, '9'], [7, 4, '9'], [7, 5, '9']] },
    sideUsed: { put: [[2, 0, '.'], [4, 6, '9'], [4, 7, '999']] },
  });
  {
    const side = ['.qqqqqq.', 'qqpqqpqq', 'pppppppp', 'pppOOppp', ...rep(4, 'pppppppp')];
    /* opened: the flaps up */
    V('cardboard-box', { side, used: tall('cardboard-box', 2, [[0, 0, 'q..........q'], [0, 1, 'qq........qq'], [1, 2, 'qnnnnnnnnq'], [2, 3, 'nwwnjjnR']]), sideUsed: patch(['', '', ...side], [[0, 0, 'q......q'], [0, 1, 'qq....qq'], [1, 2, 'qnnnnq'], [2, 3, 'nwjn']]) });
    /* rummaged through: half of it on the floor */
    V('box-junk', { side: patch(side, [[0, 0, '..t..OR.'], [0, 1, '.tw.OOR.'], [0, 2, 'pppppppp']]), used: { put: [[0, 0, '............'], [0, 1, '.....O......'], [13, 5, 't'], [13, 6, 'tw.RR'], [13, 7, 'ttORRR']] }, sideUsed: { put: [[0, 0, '........'], [0, 1, '....O...'], [9, 6, 'tw'], [9, 7, 'ttR']] } });
    V('christmas-box', { side: patch(side.slice(1), [[0, 0, '.gR.8...'], [0, 1, 'ggR.88..'], [0, 2, 'pppppppp'], [0, 3, 'pRRRRRRp']]), used: { put: [[0, 0, '............'], [0, 1, '........8...'], [13, 4, 'g'], [13, 5, 'ggg.R'], [13, 6, '.g.RRR']] }, sideUsed: { put: [[0, 0, '........'], [0, 1, '.....8..'], [9, 5, 'g'], [9, 6, 'gRR']] } });
  }
  V('vacuum-cleaner', { base: 'side', side: [...rep(6, '..II..'), '.RRRR.', 'RRRRRR', 'RRvvRR', 'nnRRnn'] });
  V('iron', { /* hot: steam */ used: tall('iron', 2, [[0, 2, 'ww'], [0, 1, 'w'], [0, 3, 'w'], [5, 5, 'R']]) });
  V('light-bulb', { side: same, /* out */ used: { swap: { F: 'h', w: 'I' } }, sideUsed: sameUsed });
  {
    /* toys: played with, and left lying */
    const doll = ['OOO.', 'OOww', 'OOwn', '.ww.', '.77.', '.77w', '.77w', '.77.', '7777', '.ww.', '.nn.'];
    const rag = { w: 'y', 7: '4', O: 'R', n: 'O' };
    V('doll-porcelain', { side: doll, used: rot(ROWS['doll-porcelain']), sideUsed: rot(doll) });
    V('doll-rag', { side: patch(recol(doll, rag), [[3, 2, 'k']]), used: rot(ROWS['doll-rag']), sideUsed: rot(patch(recol(doll, rag), [[3, 2, 'k']])) });
    V('doll-broken', { side: patch(recol(doll, { 7: 'a' }), [[2, 1, 'n'], [3, 2, 'n'], [3, 5, '.'], [3, 6, '.']]) });
    const teddy = ['.oo..', 'oooo.', 'oonoq', 'ooooq', '.ooo.', 'ooooo', 'oooqo', 'oooqo', '.ooo.', '.oooo'];
    V('teddy-old', { side: teddy, used: rot(ROWS['teddy-old']), sideUsed: rot(teddy) });
    V('teddy-one-eyed', { side: patch(recol(teddy, { o: 'e', q: 'o' }), [[2, 2, 'e'], [3, 6, 'w']]), used: rot(ROWS['teddy-one-eyed']), sideUsed: rot(patch(recol(teddy, { o: 'e', q: 'o' }), [[2, 2, 'e'], [3, 6, 'w']])) });
    const soldier = ['nn.', 'nn.', 'xx.', 'RRt', 'RRt', 'jj.', 'jj.', 'nn.'];
    V('toy-soldier', { side: soldier, used: rot(ROWS['toy-soldier']), sideUsed: rot(soldier) });
    V('spinning-top-tin', { side: same, /* run down, and fallen over */ used: rot(ROWS['spinning-top-tin']), sideUsed: sameUsed });
    V('toy-blocks', {
      side: ['RRRR', 'RwwR', 'RwRR', 'RRRR', '8888', 'w888', 'w8w8', '888w'],
      /* the tower knocked down */
      used: ['jjjj....8888.RRRR', 'jwwj6666w888.RwwR', 'jwjj6ww6w8w8.RwRR', 'jjjj6666888w.RRRR'],
      sideUsed: ['8888.RRRR', 'w888.RwwR', 'w8w8.RwRR', '888w.RRRR'],
    });
    V('toy-train-old', {
      base: 'side',
      side: ['..nn..', '.IIII.', 'IItTII', 'IIIIII', 'tIRRIt', '.I..I.'],
      /* wound up and running */
      used: tall('toy-train-old', 3, [[1, 2, 'w'], [1, 1, 'ww'], [2, 0, 'ww']]),
      sideUsed: ['...ww.', '..ww..', '..w...', '..nn..', '.IIII.', 'IItTII', 'IIIIII', 'tIRRIt', '.I..I.'],
    });
    V('marionette', {
      side: ['.OOO.', '..t..', '..t..', '..t..', '.xxx.', '.xxn.', '.xxx.', '.jj..', 'xjjj.', '.jj..', '.jj..', '.xx..', '.OO..'],
      /* made to dance: an arm up, a leg kicked out */
      used: { put: [[0, 8, '.'], [0, 6, 'x'], [0, 7, 'j'], [4, 10, '.'], [4, 11, '.'], [4, 12, '.'], [5, 9, 'j'], [5, 10, 'x'], [6, 10, 'O']] },
      sideUsed: { put: [[0, 8, '.'], [4, 7, 'j'], [4, 6, 'x'], [3, 10, 'jx'], [3, 11, '.'], [2, 12, '.O'].slice(0, 2)[0] === '.' ? [3, 12, '.'] : [3, 12, '.']] },
    });
    V('jack-in-box-old', {
      side: ['..RR...', '.RRRR..', '.wwnw..', '.wwwwR.', '..ww...', '..tT...', '..Tt...', '..tT...', 'jjjjjjj', 'jRjjjRj', 'jjjjjjj', 'jRjjjRj', 'jjjjjjj'],
      /* pushed back in and shut */
      used: ['jjjjjjj', 'OOOOOOO', 'jjjjjjj', 'jRjjjRjt', 'jjjFjjjtt', 'jRjjjRj', 'jjjjjjj'],
      sideUsed: ['jjjjjjj', 'OOOOOOO', 'jjjjjjj', 'jRjjjRj', 'jjjtjjj', 'jRjjjRj', 'jjjjjjj'],
    });
    V('crib-mobile', { side: same, /* turning */ used: { swap: { F: 'j', j: 'F' }, put: [[1, 2, '.'], [2, 3, 't'], [9, 2, '.'], [8, 3, 't']] }, sideUsed: sameUsed });
  }
  {
    /* the lid up: a mirror in it, and the dancer turning */
    const open = (slug, sw, d) => tall(slug, 5, recol([[0, 0, 'OOOOOOOO'], [0, 1, 'O222222O'], [0, 2, 'O22' + d[0] + '222O'], [0, 3, 'O2' + d[1] + '22O'], [0, 4, 'OO' + d[2] + 'OOO'], [1, 5, 'nn' + d[3] + 'nnn']], sw).put ? [] : recol({ put: [[0, 0, 'OOOOOOOO'], [0, 1, 'O222222O'], [0, 2, 'O22' + d[0] + '222O'], [0, 3, 'O2' + d[1] + '22O'], [0, 4, 'OO' + d[2] + 'OOO'], [1, 5, 'nn' + d[3] + 'nnn']] }, sw).put);
    const side = ['OOOOO', 'OoooO', 'OoooOt', 'OoooO', 'OOOOO'];
    const sideOpen = (sw, d) => patch(['', '', '', '', '', ...recol(side, sw)], recol({ put: [[0, 0, 'OO'], [0, 1, 'O2'], [0, 2, 'O2' + d[0]], [0, 3, 'O2' + d[1].slice(0, 2)], [0, 4, 'OO' + d[2].slice(0, 1)], [1, 5, 'n' + d[3] + 'n']] }, sw).put);
    const girl = ['w', '777', '7', 'w'],
      bones = ['b', 'bbb', 'b', 'b'];
    V('music-box', { side, used: open('music-box', {}, girl), sideUsed: sideOpen({}, girl) });
    V('music-box-open', { side, used: open('music-box-open', {}, girl), sideUsed: sideOpen({}, girl) });
    V('cursed-music-box', { side: recol(side, { o: '5', g: 'r', O: 'n' }), used: open('cursed-music-box', { O: 'n' }, bones), sideUsed: sideOpen({ o: '5', g: 'r', O: 'n' }, bones) });
  }
  V('hat-boxes', {
    side: same,
    /* the top box opened: the hat, the lid on the floor */
    used: tall('hat-boxes', 3, [[5, 0, 'nnn'], [4, 1, 'nRRRn'], [3, 2, 'nnnnnnn'], [3, 3, '7nnnnn7'], [14, 11, '7777777'], [14, 12, '7W77777']]),
    sideUsed: sameUsed,
  });
  V('carpet-rolled', { base: 'side', side: ['.VV.', 'VccV', 'VccV', '.VV.'] });
  V('picture-frames-stack', {
    side: ['G...', 'GO..', ...rep(8, 'GOG.')],
    /* the front one turned round: a portrait */
    used: { put: [[1, 1, 'eeeeeeee'], [1, 2, 'eeOOOOee'], [1, 3, 'eeOxxOee'], [1, 4, 'eeexxeee'], [1, 5, 'eevvvvee'], [1, 6, 'evvvvvve'], [1, 7, 'evvvvvve'], [1, 8, 'evvvvvve']] },
    sideUsed: { put: [[0, 3, 'e'], [0, 5, 'e']] },
  });
  V('moth-coat', {
    side: ['.t.', '.t.', '.e.', 'eee', ...rep(8, 'eEe'), '.ee', '.ee'],
    /* the coat is gone: the bare hanger, a moth or two */
    used: ['....tt....', '...t..t...', '....tt....', '...tttt...', '.tt....tt.', 'tttttttttt', '..........', '..........', '...yy.....', '....y..y..', '......yy..', '..........', '..........', '....ee....'],
    sideUsed: ['.t.', '.t.', '.t.', '.t.', '.t.', '.t.', '...', '...', '.y.', '.yy', '...', '...', '...', '.e.'],
  });
  V('bat-roost', {
    side: ['OOO', '.I.', '.n.', 'nnn', 'nRn', '.n.'],
    /* disturbed: all but one have flown */
    used: { put: [...box(3, 1, 13, 5, '.'), [5, 2, 'n.n'], [5, 3, 'nnn'], [11, 3, 'n.n'], [11, 4, 'nnn'], [8, 5, 'nnn'], [8, 4, 'n.n'], [14, 1, 'n.'], [13, 2, 'nnn']] },
    sideUsed: { put: [...box(0, 1, 3, 5, '.'), [0, 3, 'n.n'], [0, 4, 'nnn']] },
  });
  /* ---------- kitchen and cellar, the smaller things ---------- */
  V('hanging-pots', { side: ['III', '.I.', '.I.', '000', '000', '.0.'], /* a pan taken down */ used: { put: [...box(5, 3, 3, 3, '.'), [6, 3, 't']] }, sideUsed: { put: [...box(0, 3, 3, 3, '.'), [1, 3, 't']] } });
  V('meat-hook', { side: same, /* the meat taken down */ used: ['.I.', '.I.', '.I.', '.t.', 't..', 'tt.', '...', '.r.', '.r.', '...', '.r.'], sideUsed: sameUsed });
  V('meat-hooks-empty', { side: ['.I', '.I', '.I', '.t', 't.', 'tt'], /* a carcass hung up */ used: { put: [[4, 4, 'rrr'], [4, 5, 'rRr'], [4, 6, 'rRr'], [4, 7, 'rxr'], [4, 8, 'rRr'], [4, 9, 'rrr'], [5, 10, 'r']] }, sideUsed: { put: [[0, 4, 'rr'], [0, 5, 'rR'], [0, 6, 'rR'], [0, 7, 'rx'], [0, 8, 'rR'], [0, 9, 'rr']] } });
  V('knife-block', { side: ['.O..', '.O..', 'oooo', 'oooo', 'oooo', 'OOOO'], /* a knife drawn, and left lying */ used: { put: [[2, 0, '.'], [2, 1, '.'], [7, 5, 'TTTTOO']] }, sideUsed: { put: [[5, 5, 'TTO']] } });
  V('bread-bin', { side: ['.PPPP.', 'PPPPPP', 'PPPPPP', 'PPPPPP', 'AAAAAA'], /* open: the loaf */ used: { put: [[2, 1, 'nnnnnn'], [2, 2, 'n9yy9n'], [2, 3, 'n9999n']] }, sideUsed: { put: [[4, 1, 'nn'], [4, 2, 'y9'], [4, 3, '99']] } });
  V('flour-sack', { side: same, /* opened: flour everywhere */ used: { put: [[1, 0, 'wwww'], [2, 1, 'ww'], [6, 5, 'w'], [6, 6, 'www'], [3, 3, 'w']] }, sideUsed: sameUsed });
  V('coal-pile', { side: ['...n...', '..nIn..', '.InnnI.', '.nnInn.', 'InnnnIn'], /* half of it shovelled away */ used: ['............', '............', '....nIn.....', '..InnnInn...', '.nnInnnnInn.'], sideUsed: ['.......', '.......', '...n...', '..nIn..', '.InnnI.'] });
  V('kitchen-scales', { side: same, /* something weighed: flour in the pan, the needle round */ used: tall('kitchen-scales', 2, [[4, 0, 'ww'], [2, 1, 'wwwwww'], [4, 5, 'Rw'], [4, 6, 'ww']]), sideUsed: sameUsed });
  V('mincer', { /* turned: mince coming out */ used: { put: [[6, 3, 'rR'], [6, 4, 'Rr'], [6, 5, 'rR'], [7, 6, 'r']] } });
  V('tool-rack', { side: ['OO', 'Ot', 'Ot', '.O', '.O', '.O', '.O'], /* tools taken off their hooks */ used: { put: [...box(3, 1, 4, 5, '.'), ...box(10, 1, 3, 5, '.'), [4, 1, 'q'], [11, 1, 'q']] }, sideUsed: { put: [[1, 1, 'q'], [1, 2, '.']] } });
  V('pipes-valve', { side: ['00.', '0..', '0RR', '00R', '0RR', '0..', '00.', '0..'], /* the valve opened: it leaks */ used: { put: [[5, 5, '232'], [6, 6, '23'], [6, 7, '2'], [6, 8, '3']] }, sideUsed: { put: [[1, 5, '23'], [1, 6, '2'], [1, 7, '3']] } });
  V('pipes-steam', { side: ['tt.', 't..', 'tRR', 'ttR', 'tRR', 't.w', 'ttw', 't..'], /* blowing off hard */ used: { put: [[8, 4, 'wwwww'], [8, 5, 'wwwwww'], [9, 6, 'wwww'], [10, 7, 'ww']] }, sideUsed: { put: [[1, 5, 'ww'], [1, 6, 'www'], [2, 7, 'ww']] } });
  {
    /* the switch thrown: sparks */
    const sparks = { put: [[5, 4, 'F'], [4, 5, 'FFF'], [5, 6, 'F'], [2, 5, '8'], [7, 2, 'F'], [7, 3, 'F']] };
    const side = ['IIIi', ...rep(6, 'ItIi'), 'IIIi'];
    V('fuse-box-open', { side, used: sparks, sideUsed: { put: [[3, 4, 'F'], [3, 5, 'FF'], [3, 6, 'F']] } });
    V('fuse-board', { side: recol(side, { i: 'I' }), used: sparks, sideUsed: { put: [[3, 4, 'F'], [3, 5, 'FF'], [3, 6, 'F']] } });
  }
  V('drain-cover', {
    side: same,
    /* the grating lifted and pushed aside: the black hole under it */
    used: patch(['.IIIIIIII.', 'InnnnnnnnI', 'InnnnnnnnI', 'InnnnnnnnI', '.IIIIIIII.'], [[7, 1, ' IIIIIIII '], [7, 2, 'InInInInII'], [7, 3, 'IInInInInI'], [7, 4, 'InInInInII'], [7, 5, ' IIIIIIII ']]),
    sideUsed: sameUsed,
  });
  V('pallet', { side: ['qqqqqqqq', 'O..OO..O', 'pppppppp'] });
  V('sump-pit', { side: same, /* the water has risen */ used: { put: [[1, 1, 'd3333333333d'], [1, 2, '332233332233'], [1, 3, 'd3333223333d'], [14, 2, '3'], [14, 3, '33'], [13, 4, '333']] }, sideUsed: sameUsed });
}
