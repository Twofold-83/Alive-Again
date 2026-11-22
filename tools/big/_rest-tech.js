/* Mad science and old machines, as text pictures (see rest.js for the letters). */
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
  /* ---------- things in jars ---------- */
  const jar = (slug, inside) =>
    T(slug, ['.IIIIII.', '22222222', '2LLLLLL2', ...inside.map((r) => '2' + r + '2'), '2LLLLLL2', '22222222', 'IIIIIIII']);
  jar('jar-brain-wired', ['L7777L', '777777', '7x77x7', 'L7777L', 'LtLLtL']);
  jar('jar-head', ['LxxxxL', 'xxxxxx', 'xnxxnx', 'xxxxxx', 'LxnnxL']);
  jar('jar-heart', ['LLLLLL', 'LrrLrL', 'rrRrrr', 'LrrrrL', 'LLrrLL']);
  jar('jar-snake', ['LLHHLL', 'LHLLHL', 'LLHHLL', 'LHLLLL', 'LLHHHL']);
  jar('jar-foetus-twin', ['LxxLLL', 'xxxxxL', 'xnxxxx', 'LxxxnL', 'LLxxxL']);
  jar('jar-teeth', ['LLLLLL', 'LLLLLL', 'LwLLwL', 'wLwwLw', 'wwLwww']);
  jar('jar-eyes-many', ['LwLLwL', 'wnLwnw', 'LLwLLL', 'LwnwLw', 'wLLLwn']);
  jar('leech-jar', ['333333', '3n3333', '33n3n3', '3n33n3', 'nn3nnn']);
  T('scalpel-set', ['vvvvvvvvvvvv', 'vT.T.T.T.T.v', 'vt.t.t.t.t.v', 'vt.t.t.t.t.v', 'vI.I.I.I.I.v', 'vvvvvvvvvvvv'], { shade: false });
  T('forceps', ['t.....t', '.t...t.', '..t.t..', '...t...', '..t.t..', '.t...t.', '.t...t.', 'tt...tt']);
  T('trepan-drill', ['..OOOO..', '...tt...', 't..tt...', 'tttttttt', '...tt..t', '...tt...', '...TT...', '...TT...', '....T...']);
  T('lobotomy-pick', ['OOOOtttttttttT']);
  D('machine-dials', [
    'IIIIIIIIIIIIIIII',
    'IiiiiiiiiiiiiiiI',
    'IiwwwiiwwwiiRi8I',
    'IiwRwiiwnwiiiiiI',
    'IiwwwiiwwwiiFi8I',
    'IiiiiiiiiiiiiiiI',
    'IinnnnnnnnnniiiI',
    'IinInInInIniItiI',
    'IinnnnnnnnnniItI',
    'IiiiiiiiiiiiiiiI',
    'IiIIIIIIIIIIIIiI',
    'IiiiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiiiI',
    'IIIIIIIIIIIIIIII',
    'II............II',
  ]);
  vary('machine-shock', 'machine-dials', {
    swap: { i: 'N' },
    put: [
      [16, 6, 'RR'],
      [17, 7, 'R'],
      [17, 8, 'R'],
      [17, 9, 'R'],
      [17, 10, 'tt'],
      [16, 11, 'tt'],
    ],
  });
  vary('switchboard', 'machine-dials', {
    swap: { i: 'o', w: 'n', R: 'G', 8: 'G', F: 'G' },
    put: [
      [2, 10, 'O.O.O.O.O.O'],
      [2, 11, 'R.O.R.O.O.R'],
      [2, 12, 'R...R.....R'],
    ],
  });
  vary('computer-mainframe', 'machine-dials', {
    swap: { i: 'P', w: 'n' },
    put: [
      [2, 2, 'nIIn'],
      [2, 3, 'nIIn'],
      [2, 4, 'nnnn'],
      [7, 2, 'nIIn'],
      [7, 3, 'nIIn'],
      [7, 4, 'nnnn'],
      [2, 10, 'R8R8R8R8RF'],
      [2, 12, '8RF8R8FR8R'],
    ],
  });
  vary('tape-reels', 'machine-dials', {
    swap: { i: 'P' },
    put: [
      [2, 2, 'nnnnnnnnnnn'],
      [2, 3, 'nIwIn.nIwIn'],
      [2, 4, 'nnnnnnnnnnn'],
      [3, 5, 'oooooooooo'],
    ],
  });
  D('tesla-coil', [
    '...2tt2...',
    '..tTtttt..',
    '.tTtttttt.',
    '.tttttttt.',
    '..tttttt..',
    '....00....',
    '...0000...',
    '....00....',
    '...0000...',
    '....00....',
    '...0000...',
    '....00....',
    '...0000...',
    '....00....',
    '...0000...',
    '....00....',
    '..IIIIII..',
    '.IIIIIIII.',
    'IIIIIIIIII',
  ]);
  D('jacobs-ladder', [
    't......t',
    't.2..2.t',
    '.t.22.t.',
    '.t....t.',
    '.t.2..t.',
    '..t22t..',
    '..t..t..',
    '..t22t..',
    '..t..t..',
    '...tt...',
    '..IIII..',
    '.IIRIII.',
    'IIIIIIII',
  ]);
  T('electrode-helmet', ['.t..tt..t.', '.I.tTTt.I.', '.ItTttttI.', '.tTtttttt.', 'ttTttttttt', 'tt......tt', 'RR......RR']);
  T('straitjacket-hook', [
    '....tt....',
    '....t.....',
    '..cccccc..',
    '.cccccccc.',
    'cccOccOccc',
    'cccccccccc',
    'cOcccccOcc',
    'cccOccOccc',
    'cccccccccc',
    '.ccOccOcc.',
    '.cccccccc.',
    'cc......cc',
    'cO......Oc',
  ]);
  D('bed-wheeled', [
    'tt............................',
    'tt.www........................',
    'ttwwwwcccccccccccccccccccccctt',
    'ttccccccccccccccccccccccccccct',
    'tttttttttttttttttttttttttttttt',
    '.t..........................t.',
    '.t..........................t.',
    '.t..........................t.',
    '.t..........................t.',
    'nnn........................nnn',
    '.n..........................n.',
  ]);
  vary('autopsy-table', 'bed-wheeled', {
    swap: { w: 't', c: 'T', n: 'I' },
    put: [
      [0, 0, '  '],
      [0, 1, '  ...'],
      [12, 5, 'r'],
      [12, 6, 'r'],
      [11, 10, 'rrr'],
    ],
  });
  T('drip-stand-blood', [
    '.ttttt.',
    '.t...t.',
    '.r...t.',
    'rrr..t.',
    'rRr..t.',
    'rrr..t.',
    '.r...t.',
    '.r...t.',
    '.r...t.',
    '..r..t.',
    '..r..t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '.....t.',
    '..ttttt',
    '..n...n',
  ]);
  T(
    'xray-board',
    [
      'IIIIIIIIIIIIII',
      'IhhhhhhIhhhhhI',
      'IhnhhnhIhnnnhI',
      'IhnnnnhIhhnhhI',
      'IhhnnhhIhnnnhI',
      'IhnnnnhIhhnhhI',
      'IhnhhnhIhnnnhI',
      'IhhhhhhIhhhhhI',
      'IIIIIIIIIIIIII',
    ],
    { shade: false },
  );
  T('xray-skull', ['IIIIIIII', 'InhhhhnI', 'InhnnhnI', 'InhhhhnI', 'InnhhnnI', 'InhnhnnI', 'IIIIIIII'], { shade: false });
  D('file-cabinets-wall', [
    'NNNNNNNNNNNNNNNNNNNNNN',
    'NaaaaaaNaaaaaaNaaaaaaN',
    'NaaGGaaNaaGGaaNaaGGaaN',
    'NNNNNNNNNNNNNNNNNNNNNN',
    'NaaaaaaNaaaaaaNaaaaaaN',
    'NaaGGaaNaaGGaaNaacGaaN',
    'NNNNNNNNNNNNNNNNNNNNNN',
    'NaaaaaaNaaaaaaNaaaaaaN',
    'NaaGGaaNaaGGaaNaaGGaaN',
    'NNNNNNNNNNNNNNNNNNNNNN',
    'NaaaaaaNaaaaaaNaaaaaaN',
    'NaaGGaaNaaGGaaNaaGGaaN',
    'NNNNNNNNNNNNNNNNNNNNNN',
    'NaaaaaaNaaaaaaNaaaaaaN',
    'NaaGGaaNaaGGaaNaaGGaaN',
    'NNNNNNNNNNNNNNNNNNNNNN',
  ]);
  vary('specimen-drawer', 'file-cabinets-wall', {
    swap: { a: 'o', N: 'O' },
    put: [
      [8, 7, 'nnnnnn'],
      [8, 8, 'nb2rbn'],
      [6, 9, 'OOOOOOOOOO'],
      [6, 10, 'OooooGoooO'],
    ],
  });
  T('patient-file', ['.yyyy....', 'yyyyyyyyy', 'ycccccccy', 'ycnnnnccy', 'ycccccRcy', 'ycnnncccy', 'yyyyyyyyy'], { shade: false });
  D('cage-animal', ['IIIIIIIIIIII', 'I.I.I.I.I.II', 'I.I.I.I.I.II', 'I.InnnI.I.II', 'I.nRnnn.I.II', 'InnnnnnnI.II', 'IIIIIIIIIIII']);
  D('cage-stack', [
    'IIIIIIIIIIII',
    'I.I.I.I.I.II',
    'I.I.wwI.I.II',
    'I.IwRwwwI.II',
    'IIIIIIIIIIII',
    'I.I.I.I.I.II',
    'I.I.I.I.I.II',
    'I.I.I.I.I.II',
    'IIIIIIIIIIII',
    'I.I.I.I.I.II',
    'I.nnI.I.I.II',
    'InnRnnI.I.II',
    'IIIIIIIIIIII',
  ]);
  D('vat-green', [
    '.IIIIIIIIIIII.',
    'I888888888888I',
    'I8L88L8888L88I',
    'tLLLLLLLLLLLLt',
    'tLLLLLLLLLLLLt',
    'tLL2LLLLLLLLLt',
    'tLL2LLLLLLLLLt',
    'tLLLLLLLLLLLLt',
    'tLLLLLLLLLLLLt',
    'tLLLLLLLLLLLLt',
    'tLLLLLLLLLLLLt',
    'tLLLLLLLLLLLLt',
    'IIIIIIIIIIIIII',
    'II..........II',
  ]);
  vary('vat-body', 'vat-green', {
    put: [
      [5, 4, 'xxxx'],
      [5, 5, 'xnnx'],
      [5, 6, 'xxxx'],
      [4, 7, 'xxxxxx'],
      [4, 8, 'xxxxxx'],
      [4, 9, 'x.xx.x'],
      [5, 10, 'xxxx'],
      [5, 11, 'x..x'],
    ],
  });
  T('microscope-brass', [
    '..GG...',
    '..GG...',
    '..GG...',
    '...GG..',
    '...GG..',
    'G..GGG.',
    'G...GG.',
    'G..ttt.',
    'G......',
    'GG.....',
    '.GGGGGG',
    'GGGGGGG',
  ]);
  T('bunsen-flask', [
    '...22...',
    '...22...',
    '...22...',
    '..2222..',
    '.288882.',
    '28888882',
    '28888882',
    '.222222.',
    '...ff...',
    '..IfFI..',
    '...II...',
    '.IIIIII.',
  ]);
  T('test-tubes-old', ['2.2.2.2.2', '2.2.2.2.2', '8.2.R.2.L', '8.9.R.2.L', 'ooooooooo', '8.9.R.3.L', 'ooooooooo', 'o.......o']);
  T('retort-still', [
    '..22........',
    '.2222222....',
    '2288822222..',
    '2888882..22.',
    '2888882...2.',
    '.28882...222',
    '..222....2L2',
    '..fFf....222',
    '.IIIII......',
  ]);
  D('terminal-green', [
    'PPPPPPPPPPPP',
    'PnnnnnnnnnnP',
    'Pn88n888nnnP',
    'Pnnnnnnnnnnp',
    'Pn888n88nnnP',
    'Pn8nnnnnnnnP',
    'PnnnnnnnnnnP',
    'PPPPPPPPPPPP',
    '..PPPPPPPP..',
    'PPPPPPPPPPPP',
    'PnPnPnPnPnPP',
    'PPPPPPPPPPPP',
  ]);
  vary('computer-beige', 'terminal-green', { swap: { 8: 'h' } });
  vary('monitor-text', 'terminal-green', {
    swap: { 8: '9' },
    put: [
      [0, 9, '            '],
      [0, 10, '            '],
      [0, 11, '            '],
      [1, 8, 'PPPPPPPPPP'],
    ],
  });
  vary('monitor-static', 'monitor-text', {
    put: [
      [1, 1, 'nhnhhnhnnh'],
      [1, 2, 'hnhnnhnhhn'],
      [1, 3, 'nhhnhnhnhn'],
      [1, 4, 'hnnhnhhnnh'],
      [1, 5, 'nhnhhnnhnh'],
      [1, 6, 'hnhnnhnhhn'],
    ],
  });
  vary('monitor-face', 'monitor-text', {
    put: [
      [1, 1, 'nnnnnnnnnn'],
      [1, 2, 'nn88nn88nn'],
      [1, 3, 'nn88nn88nn'],
      [1, 4, 'nnnnnnnnnn'],
      [1, 5, 'n8nnnnnn8n'],
      [1, 6, 'nn888888nn'],
    ],
  });
  vary('monitor-smashed', 'monitor-text', {
    put: [
      [1, 1, 'nnnn2nnnnn'],
      [1, 2, 'nn2n2nn2nn'],
      [1, 3, 'nnn222n2nn'],
      [1, 4, 'n2222k222n'],
      [1, 5, 'nnn2k2nnnn'],
      [1, 6, 'nn2nn2n2nn'],
    ],
  });
  vary('oscilloscope', 'monitor-text', {
    swap: { P: 'N', 9: 'n', p: 'N' },
    put: [
      [1, 3, 'n8nnn8nnn8'],
      [1, 4, '8n8n8n8n8n'],
      [1, 5, 'nnn8nnn8nn'],
      [1, 8, 'NRNNGNNGNN'],
    ],
  });
  vary('tv-test-card', 'monitor-text', {
    swap: { P: 'o', p: 'O' },
    put: [
      [1, 1, 'ww669988RR'],
      [1, 2, 'ww669988RR'],
      [1, 3, 'ww669988RR'],
      [1, 4, 'ww669988RR'],
      [1, 5, 'nnwwnnwwnn'],
      [1, 6, 'jj55nnwwnn'],
      [0, 9, '.O........O.'],
      [2, -0, ''],
    ],
  });
  vary('tv-eye', 'tv-test-card', {
    put: [
      [1, 1, 'nnnnnnnnnn'],
      [1, 2, 'nnnwwwwnnn'],
      [1, 3, 'nnwwRRwwnn'],
      [1, 4, 'nnwwRnwwnn'],
      [1, 5, 'nnnwwwwnnn'],
      [1, 6, 'nnnnnnnnnn'],
    ],
  });
  T('floppy-disk', ['jjjjjjj.', 'jtttnjjj', 'jtttnjjj', 'jjjjjjjj', 'jwwwwwwj', 'jwnnnnwj', 'jwwwwwwj']);
  vary('floppy-black', 'floppy-disk', { swap: { j: 'n', w: 'r' } });
  T('joystick', ['..RR..', '..RR..', '..II..', '..II..', '..II..', 'nnnnnn', 'nRnnnn', 'IIIIII']);
  T('cassette-deck', ['IIIIIIIIIIIIII', 'InnnnnnnnnnnnI', 'InwIwnnnwIwnnI', 'InnnnnnnnnnnnI', 'ItItItItItIRII', 'IIIIIIIIIIIIII']);
  vary('radio-shortwave', 'cassette-deck', {
    swap: { I: 'o', n: 'y', w: 'O' },
    put: [
      [1, 1, 'ccccccRccccc'],
      [12, -0, ''],
      [11, 0, 'ot'],
      [12, -0, ''],
    ],
  });
  vary('radio-broken', 'radio-shortwave', {
    put: [
      [2, 2, 'nn.n'],
      [3, 3, 'n.'],
      [7, 1, 'nn'],
      [15, 4, 'tI'],
      [16, 5, 'tt'],
    ],
  });
  vary('geiger-counter', 'cassette-deck', {
    swap: { I: '6', n: 'n' },
    put: [
      [1, 1, 'nnwwwwwwnnnn'],
      [1, 2, 'nnwwRwwwnnnn'],
      [1, 3, 'nnwwwwwwnnnn'],
      [4, -0, ''],
    ],
  });
  D('reel-player', [
    'IIIIIIIIIIIIII',
    'InnnnIIIInnnnI',
    'InwwnIIIInwwnI',
    'InwwnIIIInwwnI',
    'InnnnIIIInnnnI',
    'IIIooooooooIII',
    'IIIIIIIIIIIIII',
    'ItIItIItIIRIGI',
    'IIIIIIIIIIIIII',
  ]);
  T('telephone-wall', [
    'oooooooo',
    'onnnnnno',
    'on.GG.no',
    'oooooooo',
    'ooIIIIoo',
    'oIonnoIo',
    'oIonnoIo',
    'ooIIIIoo',
    'oooooooo',
    'nn....oo',
    'nn......',
    'nn......',
  ]);
  vary('telephone-off-hook', 'telephone-wall', {
    put: [
      [0, 9, '  '],
      [0, 10, '  '],
      [0, 11, '  '],
      [3, 12, 'I'],
      [3, 13, 'I'],
      [4, 14, 'I'],
      [3, 15, 'I'],
      [2, 16, 'nn'],
      [2, 17, 'nn'],
      [2, 18, 'nn'],
      [2, 19, 'nn'],
    ],
  });
  D('phone-booth', [
    '.RRRRRRRRRRRRRR.',
    'RRwwwwwwwwwwwwRR',
    'RRRRRRRRRRRRRRRR',
    'RR1112R1112R11RR',
    'RR1122R1122R12RR',
    'RRRRRRRRRRRRRRRR',
    'RR1112R1nn2R11RR',
    'RR1122RnnnnR12RR',
    'RRRRRRRRRRRRRRRR',
    'RR1112R1112R11RR',
    'RR1122R1122R12RR',
    'RRRRRRRRRRRRRRRR',
    'RR1112R1112R11RR',
    'RR1122R1122R12RR',
    'RRRRRRRRRRRRRRRR',
    'RR1112R1112R11RR',
    'RR1122R1122R12RR',
    'RRRRRRRRRRRRRRRR',
    'RR1112R1112R11RR',
    'RR1122R1122R12RR',
    'RRRRRRRRRRRRRRRR',
    'RR1112R1112R11RR',
    'RR1122R1122R12RR',
    'RRRRRRRRRRRRRRRR',
    'RRvvvvRvvvvRvvRR',
    'RRvvvvRvvvvRvvRR',
    'RRvvvvRvvvvRvvRR',
    'RRvvvvRvvvvRvvRR',
    'RRvvvvRvvvvRvvRR',
    'RRRRRRRRRRRRRRRR',
    'RRRRRRRRRRRRRRRR',
    'RRRRRRRRRRRRRRRR',
    'RRRRRRRRRRRRRRRR',
    'RRRRRRRRRRRRRRRR',
    'vvvvvvvvvvvvvvvv',
    'IIIIIIIIIIIIIIII',
  ]);
  D('projector-film', [
    '..nnnn...nnnn...',
    '.nIIIIn.nIIIIn..',
    '.nIwwIn.nIwwIn..',
    '.nIIIIn.nIIIIn..',
    '..nnnn...nnnn...',
    '.IIIIIIIIIIIItt.',
    '.IiiiiiiiiiiItTF',
    '.IiiiiIIiiiiItt.',
    '.IIIIIIIIIIIII..',
    '....I.....I.....',
    '...I.......I....',
    '..I.........I...',
    '..I.........I...',
    '.I...........I..',
  ]);
  T('projector-slide', ['IIIIIIIIIItt.', 'IiiiiiiiiItTF', 'IiiwwwwiiItt.', 'IIIIIIIIII...', '.I......I....']);
  T('camera-bellows', [
    '..nnnnnn....',
    '.nOOOOOOn...',
    'nOOnInInIttt',
    'nOOnInInIt2t',
    'nOOnInInIttt',
    '.nOOOOOOn...',
    '..nnnnnn....',
    '...I....I...',
    '..I......I..',
    '..I......I..',
    '.I........I.',
    '.I........I.',
  ]);
  T('camera-flash', ['.....tttt', 'nn...tFFt', 'nnnnntFFt', 'nItInnttt', 'nt2tnn.I.', 'nItInn.I.', 'nnnnnn...']);
  T('clockwork', [
    '..GG...G.G..',
    '.GGGG.GGGGG.',
    'GGnnGGGGnGG.',
    'GGnnGGGGGGG.',
    '.GGGG.G.G.GG',
    '..GGtttGGGGG',
    '....t..GnnGG',
    '..GGGG.GGGGG',
    '..GnnG..GGG.',
    '..GGGG......',
  ]);
  T(
    'gear-big',
    ['..I.II.I..', '.IIIIIIII.', 'IIIiiiiIII', '.IiinniiI.', 'IIinnnniII', 'IIinnnniII', '.IiinniiI.', 'IIIiiiiIII', '.IIIIIIII.', '..I.II.I..'],
    { shade: false },
  );
  T('gears-small', ['.G.G....', 'GGGGG.t.', '.GnG.ttt', 'GGGGGtnt', '.G.G.ttt', '......t.'], { shade: false });
  T('lever-wall', ['IIIIII', 'InnnnI', 'InRRnI', 'InRRnI', 'InttnI', 'InttnI', 'InnnnI', 'InnnnI', 'IIIIII']);
  T('lever-floor', ['....RR', '....RR', '...tt.', '...tt.', '..tt..', '..tt..', '.tt...', 'IIIIII', 'IIIIII']);
  T('lamp-oil', ['..22..', '..22..', '.2222.', '.2FF2.', '.2Ff2.', '.2222.', '.GGGG.', 'GGGGGG', '.GGGG.']);
  T('lamp-bare-bulb', ['..n..', '..n..', '..n..', '..n..', '..n..', '..n..', '..t..', '.FFF.', 'FFwFF', 'FFFFF', '.FFF.'], { outline: false });
  const lamp = ['..IIIIII..', '.IIIIIIII.', '..I2222I..', '..I2FF2I..', '..I2Ff2I..', '..I2222I..', '..IIIIII..', '...IIII...', '....II....'];
  const post = (n) => Array.from({ length: n }, () => '....II....');
  D('street-lamp-gas', [...lamp, ...post(30), '...IIII...', '..IIIIII..', '..IIIIII..']);
  D('street-lamp-broken', [
    '..IIIIII..',
    '.IIIIIIII.',
    '..I2..2I..',
    '..I....I..',
    '..I.n..I..',
    '..I2...I..',
    '..IIIIII..',
    '...IIII...',
    '....II....',
    ...post(30),
    '...IIII...',
    '..IIIIII..',
    '..IIIIII..',
  ]);
  D('lighthouse-lamp', [
    '...tttttt...',
    '..tTTTTTTt..',
    '.tttttttttt.',
    '.t2222222It.',
    '.t2FFFF22It.',
    '.t2FwwF22It.',
    '.t2FwwF22It.',
    '.t2FFFF22It.',
    '.t2222222It.',
    '.tttttttttt.',
    '..IIIIIIII..',
    '..IIIIIIII..',
    '.IIIIIIIIII.',
  ]);
  T('signal-lamp', ['..IIII..', '.IIIIIII', 'IIFFFI.I', 'IIFwFI.I', 'IIFFFI.I', '.IIIIIII', '..IIII..', '...II...', '..IIII..']);
  D('signal-semaphore', [
    '...RRRRRRRww',
    '...RRRRRRRww',
    '..II........',
    '..II........',
    '..IR........',
    '..II........',
    '..I8........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '..II........',
    '.IIII.......',
    'IIIIII......',
  ]);
  D('searchlight', [
    '....IIIIII..',
    '...IIFFFFII.',
    '..IIFFwwFFI.',
    '..IIFFwwFFI.',
    '...IIFFFFII.',
    '....IIIIII..',
    '.....II.....',
    '....IIII....',
    '...I....I...',
    '...I....I...',
    '..I......I..',
    '..I......I..',
    '.I........I.',
  ]);
  T('phonograph-cylinder', [
    'G.........',
    'GGG.......',
    'GGGGG.....',
    'GGGGGGt...',
    'GGGGG.t...',
    'GGG...t...',
    'G..nnnnnn.',
    '..oooooooo',
    '..oOOOOOOo',
    '..oooooooo',
  ]);
  T('telegraph-key', ['....nn....', '.GGGGGGGG.', '.G......G.', 'oooooooooo', 'oOOOOOOOOo']);
  T('typewriter-jammed', [
    '..cccccccc..',
    '.cccnnccccc.',
    'IIIIIIIIIIII',
    'ItItttItItII',
    'IIIItItIIIII',
    'InInInInInIn',
    'IInInInInInI',
    'IIIIIIIIIIII',
  ]);
  T('adding-machine', ['......cc..', '.....ccc..', 'IIIIIIIIII', 'InwnwnwnII', 'IIIIIIIIItt', 'InInInInIt.', 'IInInInIIt.', 'IIIIIIIIII']);
  T(
    'wall-clock-stopped',
    ['..OOOOOO..', '.OwwwwwwO.', 'OwwwnwwwwO', 'OwwwnwwwwO', 'OwwwnnnwwO', 'OwwwwwwwwO', 'OwwwwwwwwO', '.OwwwwwwO.', '..OOOOOO..'],
    { shade: false },
  );
  T('metronome', ['...oo...', '...oG...', '..oGoo..', '..ooGo..', '..oGoo..', '.ooGooo.', '.oooGoo.', '.oooooo.', 'oooooooo', 'OOOOOOOO']);
  D('vending-old', [
    'IIIIIIIIIIIIII',
    'IRRRRRRRRRRRRI',
    'IRwwwwwwwwwwRI',
    'IRRRRRRRRRRRRI',
    'I1111111111IiI',
    'I1R18191R11ItI',
    'I1111111111IiI',
    'I191R1811L1InI',
    'I1111111111IiI',
    'I181L191R11IiI',
    'I1111111111IiI',
    'I1R1919181LIiI',
    'I1111111111IiI',
    'IIIIIIIIIIIIiI',
    'IiiiiiiiiiiIiI',
    'IinnnnnnnniIiI',
    'IinnnnnnnniIiI',
    'IiiiiiiiiiiIiI',
    'IIIIIIIIIIIIII',
    'IIIIIIIIIIIIII',
    'IIIIIIIIIIIIII',
    'IIIIIIIIIIIIII',
    'IIIIIIIIIIIIII',
    'IIIIIIIIIIIIII',
    'IIIIIIIIIIIIII',
    'II..........II',
  ]);
  D('jukebox-dead', [
    '....oooooooo....',
    '..oooOOOOOOooo..',
    '.ooOOnnnnnnOOoo.',
    '.oOnnnnnnnnnnOo.',
    'ooOnnIIIIIInnOoo',
    'ooOnnIwwwwInnOoo',
    'ooOnnIIIIIInnOoo',
    'ooOnnnnnnnnnnOoo',
    'ooOOOOOOOOOOOOoo',
    'oonInInInInInIoo',
    'ooOOOOOOOOOOOOoo',
    'ooOyOyOyOyOyOyoo',
    'ooOOyOyOyOyOyOoo',
    'ooOyOyOyOyOyOyoo',
    'ooOOyOyOyOyOyOoo',
    'ooOyOyOyOyOyOyoo',
    'ooOOOOOOOOOOOOoo',
    'oooooooooooooooo',
    'oooooooooooooooo',
    'OOOOOOOOOOOOOOOO',
    'OO............OO',
  ]);
  D('centrifuge', [
    '...tttttt...',
    '..tTTTTTTt..',
    '.tttttttttt.',
    'PPPPPPPPPPPP',
    'PPPPPPPPPPPP',
    'PPnnPPPRP8PP',
    'PPPPPPPPPPPP',
    'PPPPPPPPPPPP',
    'AAAAAAAAAAAA',
    'I..........I',
  ]);
  D(
    'skeleton-teaching',
    [
      '...tttttt..',
      '...t.bbbb..',
      '...t.bnbnb.',
      '...t.bbbb..',
      '...t..bnb..',
      '...t...b...',
      '...t.bbbbb.',
      '...tb.bbb.b',
      '...tb.b.b.b',
      '...tb.bbb.b',
      '...tb..b..b',
      '...tb.bbb.b',
      '...t..bbb..',
      '...t..b.b..',
      '...t..b.b..',
      '...t..b.b..',
      '...t..b.b..',
      '...t..b.b..',
      '...t..b.b..',
      '...t..b.b..',
      '...t.bb.bb.',
      '...t.......',
      '.ttttttt...',
    ],
    { outline: false },
  );
  T(
    'anatomy-chart',
    [
      'OOOOOOOOOO',
      'cccccccccc',
      'cccxxxxccc',
      'cccxrrxccc',
      'ccccxxcccc',
      'ccxrxxrxcc',
      'cxcrxxrcxc',
      'cxcxrrxcxc',
      'cccxxxxccc',
      'cccxccxccc',
      'cccrccrccc',
      'cccxccxccc',
      'cccccccccc',
      'OOOOOOOOOO',
    ],
    { shade: false },
  );
  T('gas-mask', ['.nnnnnn.', 'nIIIIIIn', 'n11II11n', 'n11II11n', 'nIIIIIIn', '.nIIIIn.', '.nItIIn.', '..tttt..', '..tIIt..', '..tttt..']);
  D('restraint-chair', [
    '..OOOOOOOO..',
    '..OooooooO..',
    '..OoyyyyoO..',
    '..OooooooO..',
    '..OooooooO..',
    '..OoyyyyoO..',
    '..OooooooO..',
    '..OooooooO..',
    'OOOooooooOOO',
    'OyOooooooOyO',
    'OOOOOOOOOOOO',
    '.OOooooooOO.',
    '.O.O....O.O.',
    '.O.O....O.O.',
    '.O.OyyyyO.O.',
    '.O.O....O.O.',
    '.O.O....O.O.',
    '.O.O....O.O.',
    'OO.O....O.OO',
  ]);
  D('isolation-box', [
    'IIIIIIIIIIIIII',
    'IiiiiiiiiiiiiI',
    'IiiiiIIIIiiiiI',
    'IiiiiInnIiiiiI',
    'IiiiiIIIIiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiitiI',
    'IiiiiiiiiittiI',
    'IiiiiiiiiiitiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiiiiiiiiiI',
    'IiiiiIIIIiiiiI',
    'IiiiiInnIiiiiI',
    'IiiiiIIIIiiiiI',
    'IiiiiiiiiiiiiI',
    'IIIIIIIIIIIIII',
  ]);
  D('medicine-cart', [
    '..2.L.w.R.....',
    'tttttttttttttt',
    't............t',
    't.ww.22.nn...t',
    'tttttttttttttt',
    't............t',
    't............t',
    't.wwwwww.....t',
    'tttttttttttttt',
    't............t',
    'nn..........nn',
  ]);
  T('bell-nurse', ['..t..', '.GGG.', 'GGGGG', 'GGGGG', 'nnnnn']);
  D('bedside-screen', [
    'tttttttttttttttttttttt',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctccrccct',
    'tcccccctcccccctcrrccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tcccccctcccccctcccccct',
    'tttttttttttttttttttttt',
    't......t......t......t',
    'n......n......n......n',
  ]);
  D('iron-lung', [
    '....tttttttttttttttttttttt....',
    '...tTTTTTTTTTTTTTTTTTTTTTTt...',
    'xx.tttttttttttttttttttttttt...',
    'xxxtt11tttt11tttt11tttt11tt...',
    'xx.tt11tttt11tttt11tttt11tt.GG',
    '...tttttttttttttttttttttttttGG',
    '...tttttttttttttttttttttttt...',
    '....tttttttttttttttttttttt....',
    '....I....................I....',
    '....I....................I....',
    '....I....................I....',
    '....I....................I....',
    '...nnn..................nnn...',
  ]);
  /* ================= the other pictures of each thing: turned a quarter, used, and both ================= */
  //VIEWS
};
