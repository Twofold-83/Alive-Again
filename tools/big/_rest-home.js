/* The modern home, the attic and the household, as text pictures (see rest.js for the letters). */
module.exports = ({ D, T, vary }) => {
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
};
