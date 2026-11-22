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
  const rep = (n, row) => Array.from({ length: n }, () => row);
  /* ---------- machine cabinets: a plain side with vents, the lamps and switches of the face sticking out in front ---------- */
  const cabSide = (b) =>
    sw(
      [
        'IIIIIIII',
        'IiiiiiiI',
        'IinnnniIR',
        'IiiiiiiI',
        'IinnnniIF',
        'IiiiiiiI',
        'IinnnniI',
        'IiiiiiiIt',
        'IiiiiiiI',
        'IiiiiiiI',
        'IIIIIIII',
        'IiiiiiiI',
        'IiiiiiiI',
        'IIIIIIII',
        'II....II',
      ],
      { i: b },
    );
  const lampsOn = (b) => [
    [3, 7, 'F'],
    [5, 7, '8'],
    [7, 7, 'F'],
    [9, 7, '8'],
    [12, 7, b + 'It'],
    [12, 8, 'It' + b],
  ];
  const valvesGlow = [
    [2, 2, 'uffu'],
    [2, 4, 'uffu'],
    [2, 6, 'uffu'],
    [8, 6, '8'],
    [8, 7, '.'],
    [8, 8, 't'],
  ];
  V('machine-dials', { side: cabSide('i'), used: { put: [...lampsOn('i'), [4, 2, 'R'], [7, 2, 'n']] }, sideUsed: { put: valvesGlow } });
  V('machine-shock', {
    side: pat(cabSide('N'), {
      put: [
        [3, 8, 'RR'],
        [4, 9, 'R'],
        [4, 10, 'R'],
        [4, 11, 'tt'],
        [3, 12, 'tt'],
      ],
    }),
    used: { put: [...lampsOn('N'), [4, 2, 'R'], [7, 2, 'n'], [19, 10, '2'], [18, 11, '2'], [15, 12, '2'], [19, 12, '2']] },
    sideUsed: { put: [...valvesGlow, [6, 11, '2'], [5, 12, '2'], [2, 13, '2']] },
  });
  V('switchboard', {
    side: pat(sw(cabSide('o'), { R: 'G', F: 'G' }), {
      put: [
        [8, 9, 'OOO'],
        [8, 10, 'R'],
        [8, 11, 'R'],
        [10, 10, 'R'],
      ],
    }),
    used: {
      put: [
        [2, 11, 'O.R.O.R.R.O'],
        [2, 12, '..R...R.R..'],
        [12, 2, 'F'],
        [14, 4, 'F'],
        [3, 3, 'F'],
      ],
    },
    sideUsed: {
      put: [
        [8, 2, 'F'],
        [8, 10, '.'],
        [8, 11, '.'],
        [9, 10, 'R'],
        [9, 11, 'R'],
      ],
    },
  });
  V('computer-mainframe', {
    side: pat(cabSide('P'), {
      put: [
        [2, 11, 'R8RF'],
        [2, 12, '8RF8'],
      ],
    }),
    used: {
      put: [
        [2, 10, 'nnnnnnnnnn'],
        [2, 12, 'Rnnnnnnnnn'],
        [12, 2, 'n'],
        [14, 2, 'n'],
        [12, 4, 'n'],
        [14, 4, 'n'],
      ],
    },
    sideUsed: {
      put: [
        [2, 11, 'nnnn'],
        [2, 12, 'Rnnn'],
        [8, 2, 'n'],
        [8, 4, 'n'],
      ],
    },
  });
  V('tape-reels', {
    side: cabSide('P'),
    used: { put: [...lampsOn('P'), [2, 3, 'nwIwn nwIwn'], [3, 5, 'oooo']] },
    sideUsed: {
      put: [
        [8, 6, '8'],
        [8, 7, '.'],
        [8, 8, 't'],
        [8, 4, '8'],
      ],
    },
  });
  /* ---------- beds on wheels, seen from the foot end and a little from above ---------- */
  const wardBed = pat(
    [
      '.tttttttttttt.',
      '.t..........t.',
      '.tttttttttttt.',
      '.tcwwwwwwwwct.',
      '.tcwwwwwwwwct.',
      '.tcWWWWWWWWct.',
      '.tcccccccccct.',
      '.twwwwwwwwwwt.',
      ...rep(12, '.tcccccccccct.'),
      '.tttttttttttt.',
      '.t..........t.',
      '.tttttttttttt.',
      ...rep(4, '.t..........t.'),
      'nnn........nnn',
      '.n..........n.',
    ],
    {},
  );
  V('bed-wheeled', {
    base: 'side',
    side: wardBed,
    used: {
      put: [
        [6, 2, 'WWWWWWWWWWWWWW'],
        [6, 3, 'aWWWWWWWWWWWWW'],
        [20, 0, '.cccc'],
        [19, 1, 'cccwccc'],
        [20, 2, 'cccccccc'],
      ],
    },
    sideUsed: {
      put: [
        [2, 6, 'WWWWWWWWWW'],
        [2, 7, 'WWWWWWWWWW'],
        ...[8, 9, 10, 11, 12, 13].map((y) => [2, y, 'WWWWWWWWWW']),
        [2, 14, 'WcWWWccWWW'],
        [2, 15, 'ccwccccccW'],
        [2, 16, 'cwwccwcccc'],
        [2, 17, 'ccccwwcwcc'],
      ],
    },
  });
  V('autopsy-table', {
    base: 'side',
    side: [
      '.tttttttttttt.',
      '.tTTTTTTTTTTt.',
      ...rep(15, '.tTTTTTtTTTTt.'),
      '.tTTTTTnTTTTt.',
      '.tTTTTTTTTTTt.',
      '.tttttttttttt.',
      '.tttttttttttt.',
      '.tttttttttttt.',
      '.t.....r....t.',
      '.t.....r....t.',
      '.t..........t.',
      '.t..........t.',
      'III........III',
      '.I....rrr...I.',
    ],
    used: {
      put: [
        [5, 0, 'www...............ww'],
        [4, 1, 'wwwwwwwwwwwwwwwwwwwwww'],
        [4, 2, 'wWwwwwwwwwwwWwwwwwwwWw'],
      ],
    },
    sideUsed: {
      put: [
        [5, 2, 'wwww'],
        [5, 3, 'wwww'],
        [4, 4, 'wwwwww'],
        ...[5, 6, 7, 8, 9, 10, 11, 12, 13].map((y) => [3, y, y === 9 ? 'wwwWWwww' : 'wwwwwwww']),
        [4, 14, 'wwwwww'],
        [4, 15, 'wwwwww'],
        [4, 16, 'wWwwWw'],
      ],
    },
  });
  /* ---------- drawers ---------- */
  const drawersSide = (edge, face, seam) => [
    edge.repeat(9),
    ...Array.from(
      { length: 14 },
      (_, i) =>
        edge + (i === 1 || i === 12 ? face + seam.repeat(5) + face : face + seam + face.repeat(3) + seam + face) + edge + (i % 3 === 1 ? 'G' : ''),
    ),
    edge.repeat(9),
  ];
  V('file-cabinets-wall', {
    side: pat(drawersSide('N', 'a', 'A'), {
      put: [
        [1, 1, 'aaaaaaa'],
        [1, 14, 'aaaaaaa'],
      ],
    }),
    used: {
      put: [
        [8, 4, 'cycccy'],
        [8, 5, 'ccyccc'],
        [7, 6, 'NaaaaaaN'],
        [7, 7, 'NaaGGaaN'],
        [7, 8, 'NNNNNNNN'],
        [7, 9, 'nnnnnnnn'],
      ],
    },
    sideUsed: {
      put: [
        [9, 3, 'ycycy'],
        [9, 4, 'aaaaaN'],
        [9, 5, 'aaaaaNG'],
        [9, 6, 'NNNNNN'],
      ],
    },
  });
  V('specimen-drawer', {
    side: pat(drawersSide('O', 'o', 'O'), {
      put: [
        [1, 1, 'ooooooo'],
        [1, 14, 'ooooooo'],
        [9, 7, 'b.r.b'],
        [9, 8, 'oooooO'],
        [9, 9, 'oooooOG'],
        [9, 10, 'OOOOOO'],
      ],
    }),
    used: {
      put: [
        [1, 1, 'nnnnnn'],
        [1, 2, 'nwnb2n'],
        [0, 3, 'OOOOOOOOO'],
        [0, 4, 'OoooGoooO'],
        [0, 5, 'OOOOOOOOO'],
      ],
    },
    sideUsed: {
      put: [
        [9, 1, 'w.b.2'],
        [9, 2, 'oooooO'],
        [9, 3, 'oooooOG'],
        [9, 4, 'OOOOOO'],
      ],
    },
  });
  /* ---------- cages ---------- */
  V('cage-animal', {
    side: ['IIIIIII', 'I.I.I.I', 'I.I.I.I', 'I.I.I.I', 'I.nRn.I', 'InnnnnI', 'IIIIIII'],
    used: {
      put: [
        [1, 1, '.I.I.Innnn'],
        [1, 2, '.I.I.Innnn'],
        [1, 3, '.I.I.Innnn'],
        [1, 4, '.I.I.Innnn'],
        [1, 5, '.I.I.Innnn'],
        [12, 0, 'iiii'],
        [12, 1, '.i.i'],
        [12, 2, '.i.i'],
        [12, 3, '.i.i'],
        [12, 4, '.i.i'],
        [12, 5, '.i.i'],
        [12, 6, 'iiii'],
      ],
    },
    sideUsed: {
      put: [
        [1, 4, '.I.I.'],
        [1, 5, '.I.I.'],
        [7, 0, 'iiiii'],
        [7, 1, '.i.ii'],
        [7, 2, '.i.ii'],
        [7, 3, '.i.ii'],
        [7, 4, '.i.ii'],
        [7, 5, '.i.ii'],
        [7, 6, 'iiiii'],
      ],
    },
  });
  V('cage-stack', {
    side: [
      'IIIIIII',
      'I.I.I.I',
      'I.Iww.I',
      'I.wRwwI',
      'IIIIIII',
      'I.I.I.I',
      'I.I.I.I',
      'I.I.I.I',
      'IIIIIII',
      'I.I.I.I',
      'I.nnI.I',
      'InnRnnI',
      'IIIIIII',
    ],
    used: {
      put: [
        [1, 1, '.I.I.Innnn'],
        [1, 2, '.I.I.Innnn'],
        [1, 3, '.I.I.Innnn'],
        [12, 0, 'iiii'],
        [12, 1, '.i.i'],
        [12, 2, '.i.i'],
        [12, 3, '.i.i'],
        [12, 4, 'iiii'],
      ],
    },
    sideUsed: {
      put: [
        [1, 2, '.I.I.'],
        [1, 3, '.I.I.'],
        [7, 0, 'iiiii'],
        [7, 1, '.i.ii'],
        [7, 2, '.i.ii'],
        [7, 3, '.i.ii'],
        [7, 4, 'iiiii'],
      ],
    },
  });
  /* ---------- vats: the side has the ladder; used, the tank has been drained ---------- */
  const ladder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((y) => [9, y, y % 2 ? 'ItI' : 'I I']);
  const drained = (keep) => [
    [1, 1, '11111111' + keep + '1'],
    [1, 2, '12111111' + keep + '1'],
    ...[3, 4, 5, 6, 7].map((y) => [1, y, '11111111' + keep + '1']),
    [1, 8, '8L88L888' + keep + '8'],
  ];
  V('vat-green', {
    side: { put: [...ladder, [3, 5, 'L'], [3, 6, 'L'], [2, 5, '2'], [2, 6, '2']] },
    used: { put: drained('111') },
    sideUsed: { put: drained('   ') },
  });
  const noBody = [4, 5, 6, 7, 8, 9, 10, 11].map((y) => [4, y, 'LLLLLL']);
  V('vat-body', {
    side: {
      put: [
        ...noBody,
        ...ladder,
        [5, 4, 'xxx'],
        [5, 5, 'xxn'],
        [5, 6, 'xxx'],
        [5, 7, 'xx'],
        [5, 8, 'xxx'],
        [5, 9, 'xx'],
        [5, 10, 'xx'],
        [5, 11, 'xx'],
        [3, 5, 'L'],
        [3, 6, 'L'],
        [2, 5, '2'],
        [2, 6, '2'],
      ],
    },
    used: {
      put: [
        ...noBody,
        ...drained('111'),
        [1, 8, '111111111111'],
        [1, 9, '111111111111'],
        [1, 10, '8L88L8888L88'],
        [6, 3, 'w'],
        [7, 4, 'w'],
        [6, 5, 'w'],
        [5, 6, 'w'],
        [6, 7, 'ww'],
        [8, 8, 'w'],
      ],
    },
    sideUsed: {
      put: [
        ...noBody,
        ...drained('   '),
        [1, 8, '11111111 '],
        [12, 8, '1'],
        [1, 9, '11111111'],
        [12, 9, '1'],
        [1, 10, '8L88L888'],
        [12, 10, '8'],
        [5, 3, 'w'],
        [6, 4, 'w'],
        [5, 5, 'w'],
        [4, 6, 'w'],
        [5, 7, 'ww'],
      ],
    },
  });
  /* ---------- screens: the tube seen from the side, the glass at the right; used, most are switched off ---------- */
  const crtSide = (b, v, glow, tv) =>
    pat(
      [
        '..bbbbbbbbb',
        '.bbbbbbbbvb',
        'bbvvvvbbbvb' + glow[0],
        'bbbbbbbbbvb' + glow[1],
        'bbvvvvbbbvb' + glow[2],
        'bbbbbbbbbvb' + glow[3],
        '.bbbbbbbbvb',
        '..bbbbbbbbb',
        '....bbbbb',
        ...(tv ? ['..v......v', '.bbbbbbbbbb', '.bbbbbbbbbb'] : ['.bbbbbbbbbb', '.bbbbbbbbbbnnn', '.bbbbbbbbbbbbbb']),
      ].map((r) => r.replace(/b/g, 'Q').replace(/v/g, 'Z')),
      { swap: { Q: b, Z: v } },
    );
  const dark = [1, 2, 3, 4, 5, 6].map((y) => [1, y, y === 2 ? 'nNNnnnnnnn' : y === 3 ? 'nNnnnnnnnn' : 'nnnnnnnnnn']);
  const screen = (slug, b, v, glow, glowUsed, used, tv) =>
    V(slug, { side: crtSide(b, v, glow, tv), used: { put: used }, sideUsed: crtSide(b, v, glowUsed, tv) });
  screen('terminal-green', 'P', 'A', '8888', 'nnnn', dark);
  screen('computer-beige', 'P', 'A', 'hhhh', 'nnnn', dark);
  screen('monitor-text', 'P', 'A', '9999', 'nnnn', dark);
  screen('monitor-static', 'P', 'A', 'hnhn', 'nnnn', dark);
  screen('monitor-face', 'P', 'A', '8n88', '8888', [
    [1, 1, 'nnnnnnnnnn'],
    [1, 2, 'n888nn888n'],
    [1, 3, 'n8n8nn8n8n'],
    [1, 4, 'n888nn888n'],
    [1, 5, 'nnn8888nnn'],
    [1, 6, 'nnn8nn8nnn'],
  ]);
  screen('monitor-smashed', 'P', 'A', 'n2nn', 'nFfn', [
    [6, 4, 'F'],
    [5, 5, 'F'],
    [7, 3, 'f'],
    [4, 6, 'f'],
    [6, 2, 'F'],
    [3, 4, 'f'],
  ]);
  screen('oscilloscope', 'N', 'n', 'n88n', 'nn8n', [
    [1, 3, 'nnnnnnnnnn'],
    [1, 4, '8888888888'],
    [1, 5, 'nnnnnnnnnn'],
  ]);
  screen('tv-test-card', 'o', 'O', 'w9Rj', 'nnnn', dark, true);
  screen(
    'tv-eye',
    'o',
    'O',
    'wRwn',
    'nwwn',
    [
      [1, 1, 'nnnnnnnnnn'],
      [1, 2, 'nnnnnnnnnn'],
      [1, 3, 'nwnnnnnnwn'],
      [1, 4, 'nnwwwwwwnn'],
      [1, 5, 'nnnwnwnwnn'],
      [1, 6, 'nnnnnnnnnn'],
    ],
    true,
  );
  /* ---------- telephones ---------- */
  const phoneSide = ['Ooo', 'Ooonn', 'OooGn', 'Ooo', 'OooI', 'OooII', 'OooII', 'OooI', 'Ooo', '.Onn', '..nn', '..nn'];
  const phoneSideOff = pat(phoneSide, {
    put: [
      [1, 9, 'O..'],
      [2, 10, '..'],
      [2, 11, '..'],
      [3, 9, 'I'],
      [4, 10, 'I'],
      [4, 11, 'I'],
      [4, 12, 'I'],
      [5, 13, 'I'],
      [4, 14, 'I'],
      [4, 15, 'I'],
      [3, 16, 'nn'],
      [3, 17, 'nn'],
      [3, 18, 'nn'],
      [3, 19, 'nn'],
    ],
  });
  V('telephone-wall', { side: phoneSide, used: R['telephone-off-hook'], sideUsed: phoneSideOff });
  V('telephone-off-hook', { side: phoneSideOff, used: R['telephone-wall'], sideUsed: phoneSide });
  {
    const booth = R['phone-booth'];
    const side = pat(booth, {
      put: [
        [7, 6, '1112'],
        [7, 7, '1122'],
        [2, 6, '1nn2'],
        [2, 7, 'nnnn'],
      ],
    });
    const inside = (y) =>
      ({
        6: 'nnnnIIIIIInn',
        7: 'nNnnIwwwwInn',
        8: 'nNnnIIGGIInn',
        9: 'nNnnIGnnGInn',
        10: 'nNnnIIGGIInn',
        11: 'nNnnIIIIIInn',
        12: 'nnInnnnnnnnn',
        13: 'nnnIIInnnnnn',
        15: 'nNNNNNNNNNNn',
        16: 'nnnnnnnnnnNn',
        33: 'VVVVVVVVVVVV',
      })[y] || 'nnnnnnnnnnnn';
    const leaf = (r, y) => (y < 2 || y > 33 ? '' : r[2] === '1' ? 'R' + r[4] + 'R' : r[2] === 'v' ? 'RvR' : 'RRR');
    V('phone-booth', {
      side,
      used: booth.map((r, y) => (y < 3 || y > 33 ? r : 'RR' + inside(y) + 'RR') + leaf(r, y)),
      sideUsed: side.map((r, y) => (y < 2 || y > 33 ? r : r + booth[y].slice(2, 14) + 'R')),
    });
  }
  /* ---------- vending machine and jukebox ---------- */
  V('vending-old', {
    side: [
      'IIIIIIII',
      ...rep(3, 'IiiiiiRI'),
      'Iiiiii1I',
      'Iiiiii1It',
      'Iiiiii1I',
      'Iiiiii1In',
      ...rep(5, 'Iiiiii1I'),
      'IIIIIIII',
      ...rep(4, 'IiiiiiiI'),
      'IIIIIIII',
      'IIIIIIII',
      'IInnnnII',
      'IIIIIIII',
      'IInnnnII',
      'IIIIIIII',
      'IIIIIIII',
      'II....II',
    ],
    used: {
      swap: { 1: '2' },
      put: [
        [2, 5, '2'],
        [4, 15, 'RR'],
        [4, 16, 'RR'],
        [12, 5, 'n'],
        [12, 6, 't'],
        [2, 2, 'FFFFFFFFFF'],
      ],
    },
    sideUsed: {
      swap: { 1: '2' },
      put: [
        [8, 5, '.'],
        [8, 6, 't'],
        [6, 2, 'F'],
      ],
    },
  });
  V('jukebox-dead', {
    side: [
      '....ooooo',
      '..oooooon',
      '.ooooooon',
      '.oOOOOoon',
      'ooOoooOon',
      'ooOoooOon',
      'ooOoooOon',
      'ooOoooOon',
      'ooOoooOoO',
      'ooOoooOoI',
      'ooOoooOoO',
      'ooOoooOoy',
      'ooOoooOoy',
      'ooOoooOoy',
      'ooOoooOoy',
      'ooOoooOoy',
      'ooOOOOOoO',
      'ooooooooo',
      'ooooooooo',
      'OOOOOOOOO',
      'OO.....OO',
    ],
    used: {
      swap: { n: '9', y: 'F', w: 'c' },
      put: [
        [5, 3, 'FFFFFF'],
        [5, 7, 'FFFFFF'],
      ],
    },
    sideUsed: { swap: { n: '9', y: 'F' } },
  });
  /* ---------- the asylum ---------- */
  V('restraint-chair', {
    side: [
      'OO',
      'Oo',
      'Ooy',
      'Oo',
      'Oo',
      'Ooy',
      'Oo',
      'Oo',
      'OoOOOOOOO',
      'Oo.....yO',
      'OOOOOOOOO',
      'OOooooooO',
      'O......O',
      'O......O',
      'O......Oy',
      'O......O',
      'O......O',
      'O......O',
      'OO.....OO',
    ],
    used: {
      put: [
        [1, 2, 'yOooooooOy'],
        [1, 3, 'y'],
        [10, 3, 'y'],
        [1, 5, 'yOooooooOy'],
        [1, 6, 'y'],
        [10, 6, 'y'],
        [1, 9, 'o'],
        [10, 9, 'o'],
        [0, 11, 'y'],
        [11, 11, 'y'],
        [0, 12, 'y'],
        [11, 12, 'y'],
        [4, 14, '....'],
        [4, 15, 'y'],
        [4, 16, 'y'],
        [7, 15, 'y'],
      ],
    },
    sideUsed: {
      put: [
        [2, 2, 'yy'],
        [3, 3, 'y'],
        [3, 4, 'y'],
        [2, 5, 'yy'],
        [3, 6, 'y'],
        [7, 9, '.'],
        [9, 9, 'y'],
        [9, 10, 'y'],
        [9, 11, 'y'],
        [8, 14, '.'],
        [8, 15, 'y'],
        [8, 16, 'y'],
        [8, 17, 'y'],
      ],
    },
  });
  {
    const box = R['isolation-box'];
    const side = pat(['IIIIIIIIII', ...rep(28, 'IiiiiiiiiI'), 'IIIIIIIIII'], {
      put: [
        [2, 2, 'I'],
        [7, 2, 'I'],
        [2, 27, 'I'],
        [7, 27, 'I'],
        [3, 5, 'nnnn'],
        [3, 7, 'nnnn'],
        [10, 8, 't'],
        [10, 9, 't'],
        [10, 10, 't'],
      ],
    });
    const cell = (y) =>
      ({
        3: 'nnNnNnNnnnnn',
        4: 'nnNnNnNnNnnn',
        5: 'nnNnNnnnNnnn',
        6: 'nnnnNnnnNnnn',
        11: 'nyynnnnnnyyn',
        12: 'nynnnnnnnnyn',
        18: 'nNNNNNNNNNNn',
        19: 'nNNNNNNNNNNn',
        20: 'nNnnnnnnnnNn',
        21: 'nNnnnnnnnnNn',
        22: 'nNnyynnyynNn',
        23: 'nNnnnnnnnnNn',
        24: 'nNnnnnnnnnNn',
        25: 'nNnnnnnnnnNn',
        26: 'nNnnnnnnnnNn',
        27: 'nNnnnnnnnnNn',
      })[y] || 'nnnnnnnnnnnn';
    V('isolation-box', {
      side,
      used: box.map(
        (r, y) =>
          (y === 0 || y === 29 ? 'III' : y > 1 && y < 5 ? 'InI' : y > 7 && y < 11 ? 'tiI' : 'IiI') + (y === 0 || y === 29 ? r : 'I' + cell(y) + 'I'),
      ),
      sideUsed: side.map((r, y) => r.slice(0, 10) + box[y].slice(1)),
    });
  }
  V('medicine-cart', {
    base: 'side',
    side: ['.2.L.R', 'tttttttt', 't......t', 't.ww2..t', 'tttttttt', 't......t', 't......t', 't.www..t', 'tttttttt', 't......t', 'nn....nn'],
    used: {
      put: [
        [0, 0, '.....RR...2...'],
        [2, 3, '..  .  n2'],
        [1, 7, ' ww.....22'],
        [4, 10, 'w.L'],
      ],
    },
    sideUsed: {
      put: [
        [0, 0, '...RR.'],
        [2, 3, '...2'],
        [2, 7, 'w..2'],
        [3, 10, 'w'],
      ],
    },
  });
  V('bedside-screen', {
    side: ['ttttt', ...rep(27, 'tccct'), 'ttttt', 't...t', 'n...n'],
    used: [
      'tttttttttttt',
      ...Array.from({ length: 27 }, (_, i) => (i === 7 ? 'tccrccctctct' : i === 8 ? 'tcrrccctctct' : 'tcccccctctct')),
      'tttttttttttt',
      't......t.t.t',
      'n......n.n.n',
    ],
    sideUsed: ['ttttttt', ...rep(27, 'tctctct'), 'ttttttt', 't.t.t.t', 'n.n.n.n'],
  });
  V('iron-lung', {
    base: 'side',
    side: [
      '...tttttt',
      '..tTTTTTTt',
      '.tTtIIIItTt',
      '.ttIxxxxItt',
      '.ttIxxxxItt',
      '.ttIXxxXItt.GG',
      '..ttIIIItt..GG',
      '...tttttt',
      '..I......I',
      '..I......I',
      '..I......I',
      '..I......I',
      '.nnn....nnn',
    ],
    used: {
      put: [
        [0, 2, '...'],
        [0, 3, '..n'],
        [0, 4, '...'],
      ],
    },
    sideUsed: {
      put: [
        [4, 3, 'nnnn'],
        [4, 4, 'nnnn'],
        [4, 5, 'nnnn'],
      ],
    },
  });
  /* ---------- sparks and glass ---------- */
  V('tesla-coil', {
    used: {
      put: [
        [0, 2, '2'],
        [0, 1, '2'],
        [1, 0, '2'],
        [8, 1, '2'],
        [9, 0, '2'],
        [9, 3, '22'],
        [10, 4, '2'],
        [10, 5, '2'],
        [9, 6, '2'],
        [8, 7, '2'],
        [0, 5, '2'],
        [1, 6, '2'],
        [1, 7, '2'],
        [0, 8, '2'],
      ],
    },
  });
  V('jacobs-ladder', {
    side: ['..t', '..t2', '..t', '..t', '.2t', '..t', '..t', '..t2', '..t', '..t', '.III', '.IRI', 'IIIII'],
    used: {
      put: [
        [2, 1, '.'],
        [5, 1, '.'],
        [3, 2, '..'],
        [3, 4, '.'],
        [3, 5, '..'],
        [3, 7, '..'],
        [3, 11, 'n'],
      ],
    },
    sideUsed: {
      put: [
        [3, 1, '.'],
        [1, 4, '.'],
        [3, 7, '.'],
        [2, 11, 'n'],
      ],
    },
  });
  V('drip-stand-blood', {
    used: {
      swap: { r: '2', R: '1' },
      put: [
        [0, 5, 'rrr'],
        [1, 6, 'r'],
      ],
    },
  });
  V('xray-board', { side: ['III', ...rep(7, 'IIh'), 'III'], used: { swap: { h: 'N' } }, sideUsed: { swap: { h: 'N' } } });
  V('test-tubes-old', {
    side: ['.2', '.2', '.8', '.8', 'ooo', '.8', 'ooo', 'o.o'],
    used: {
      put: [
        [4, 0, '.'],
        [4, 1, '.'],
        [4, 2, '.'],
        [4, 3, '.'],
        [4, 5, '.'],
        [0, 2, '2'],
        [0, 3, '2'],
        [0, 5, '2'],
        [8, 2, '2'],
      ],
    },
    sideUsed: { swap: { 8: '2' } },
  });
  V('bunsen-flask', {
    used: {
      put: [
        [2, 4, '1111'],
        [1, 5, '111111'],
        [1, 6, '188881'],
        [3, 8, '..'],
        [3, 9, 'II'],
      ],
    },
  });
  /* ---------- sound ---------- */
  V('cassette-deck', {
    side: ['IIIIII', 'IiiiiI', 'IiiiiI', 'IiiiiI', 'IiiiiIt', 'IIIIII'],
    used: [
      '...nnnnnnnn',
      '...ncccccwn',
      ...pat(R['cassette-deck'], {
        put: [
          [2, 2, 'NNNNNNNNNN'],
          [1, 1, 'nNNNNNNNNNNn'],
          [11, 4, '8'],
          [3, 4, 'n'],
        ],
      }),
    ],
    sideUsed: ['..nn', '..nn', 'IIIIII', 'IiiiiI', 'IiiiiI', 'IiiiiI', 'IiiiiI', 'IIIIII'],
  });
  V('radio-shortwave', {
    side: ['.....t', 'ooooooo', 'oOOOOOoc', 'oOoooOo', 'oOoooOo', 'oOOOOOot', 'ooooooo'],
    used: {
      put: [
        [1, 1, 'FFFRFFFFFFFF'],
        [11, 4, '8'],
      ],
    },
    sideUsed: {
      put: [
        [7, 2, 'F'],
        [7, 3, 'f'],
      ],
    },
  });
  V('geiger-counter', {
    side: ['666666', '6mmmm6w', '6mmmm6w', '6mmmm6', '6mmmm6t', '666666'],
    used: {
      put: [
        [5, 2, 'ww'],
        [7, 2, 'R'],
        [8, 1, 'R'],
        [11, 4, 'F'],
        [1, 4, 'n'],
      ],
    },
    sideUsed: {
      put: [
        [6, 4, 'F'],
        [6, 1, 'R'],
      ],
    },
  });
  V('reel-player', {
    side: ['IIIIIII', 'IiiiiiIn', 'IiiiiiIn', 'IiiiiiIn', 'IiiiiiIn', 'IiiiiiI', 'IiiiiiI', 'IiiiiiIt', 'IIIIIII'],
    used: {
      put: [
        [2, 2, 'wn'],
        [2, 3, 'nw'],
        [10, 2, 'nw'],
        [10, 3, 'wn'],
        [3, 5, 'oooooooo'],
        [4, 4, 'o'],
        [9, 4, 'o'],
        [10, 7, 'F'],
        [1, 7, 'n'],
      ],
    },
    sideUsed: {
      put: [
        [7, 7, 'F'],
        [7, 2, 'w'],
        [7, 4, 'w'],
      ],
    },
  });
  /* ---------- light ---------- */
  V('projector-film', {
    base: 'side',
    side: [
      '....nn',
      '...nIIn',
      '...nIIn',
      '...nIIn',
      '....nn',
      '.IIttttII',
      '.IItFFtII',
      '.IIttttII',
      '.IIIIIIII',
      '...I..I',
      '..I....I',
      '..I....I',
      '.I......I',
      '.I......I',
    ],
    used: {
      put: [
        [15, 6, 't'],
        [0, 3, 'n'],
        [0, 4, 'n'],
        [0, 5, 'n'],
        [0, 6, 'n'],
        [0, 7, 'n'],
        [0, 8, 'nn'],
        [1, 9, 'n'],
        [1, 10, 'nn'],
        [3, 2, 'II'],
      ],
    },
    sideUsed: {
      put: [
        [4, 6, 'nn'],
        [2, 3, 'n'],
        [2, 4, 'n'],
        [0, 5, 'n'],
        [0, 6, 'n'],
        [0, 7, 'n'],
        [0, 8, 'n'],
        [0, 9, 'nn'],
        [1, 10, 'n'],
        [1, 4, 'n'],
      ],
    },
  });
  V('lever-wall', {
    side: ['II', 'In..RR', 'In..RR', 'In.tt', 'Intt', 'In', 'In', 'In', 'II'],
    used: {
      put: [
        [1, 2, 'nnnn'],
        [1, 3, 'nnnn'],
        [1, 6, 'nRRn'],
        [1, 7, 'nRRn'],
      ],
    },
    sideUsed: ['II', 'In', 'In', 'In', 'Intt', 'In.tt', 'In..RR', 'In..RR', 'II'],
  });
  V('lever-floor', {
    base: 'side',
    side: ['.RR', '.RR', '.tt', '.tt', '.tt', '.tt', '.tt', 'IIII', 'IIII'],
    used: ['RR', 'RR', '.tt', '.tt', '..tt', '..tt', '...tt', 'IIIIII', 'IIIIII'],
    sideUsed: ['', '', '', '.RR', '.RR', '.tt', '.tt', 'IIII', 'IIII'],
  });
  V('lamp-oil', {
    used: {
      put: [
        [2, 3, '11'],
        [2, 4, '1n'],
      ],
    },
  });
  V('lamp-bare-bulb', { used: { swap: { F: '1', w: '2' } } });
  V('street-lamp-gas', {
    used: {
      put: [
        [3, 2, '1111'],
        [3, 3, '1111'],
        [3, 4, '11n1'],
        [3, 5, '1111'],
      ],
    },
  });
  V('street-lamp-broken', {
    used: {
      put: [
        [4, 3, 'F'],
        [4, 4, 'f'],
        [5, 3, 'f'],
      ],
    },
  });
  V('lighthouse-lamp', { used: { swap: { F: '1', w: '2' } } });
  V('signal-lamp', { used: { swap: { F: '8', w: 'M' } } });
  V('signal-semaphore', {
    side: pat(R['signal-semaphore'], {
      put: [
        [3, 0, 'RR.......'],
        [3, 1, 'RR.......'],
      ],
    }).map((r) => r.slice(0, 6)),
    used: {
      put: [
        [3, 0, '.........'],
        [3, 1, '.........'],
        [3, 0, 'R'],
        [3, 1, 'RRR'],
        [4, 2, 'RRR'],
        [5, 3, 'RRR'],
        [6, 4, 'RRR'],
        [7, 5, 'RRw'],
        [8, 6, 'ww'],
        [3, 4, 'I'],
        [3, 6, 'M'],
      ],
    },
    sideUsed: {
      put: [
        [3, 0, 'RR'],
        [4, 2, 'RR'],
        [4, 3, 'RR'],
        [4, 4, 'RR'],
        [4, 5, 'ww'],
        [3, 4, 'I'],
        [3, 6, 'M'],
      ],
    },
  });
  V('searchlight', {
    side: [
      '..IIIIII',
      '.IIIIIIIF',
      'IIIIIIIIF',
      'IIIIIIIIF',
      '.IIIIIIIF',
      '..IIIIII',
      '....II',
      '...IIII',
      '..I....I',
      '..I....I',
      '.I......I',
      '.I......I',
      'I........I',
    ],
    used: { swap: { F: 'N', w: '1' } },
    sideUsed: { swap: { F: 'N' } },
  });
  /* ---------- on the desk and on the wall ---------- */
  V('typewriter-jammed', {
    side: ['.cc', '.ccII', '.IIIII', 'IIIIItI', 'IIIIIItI', 'IIIIIIInI', 'IIIIIIIInI', 'IIIIIIIIII'],
    used: {
      put: [
        [2, 0, '........'],
        [1, 1, '..........'],
      ],
    },
    sideUsed: {
      put: [
        [1, 0, '..'],
        [1, 1, '..'],
      ],
    },
  });
  V('wall-clock-stopped', {
    side: ['.O', 'OOw', 'OOw', 'OOw', 'OOw', 'OOw', 'OOw', 'OOw', '.O'],
    used: {
      put: [
        [4, 2, 'w'],
        [4, 3, 'w'],
        [5, 4, 'ww'],
        [5, 3, 'n'],
        [6, 2, 'n'],
        [4, 5, 'n'],
        [4, 6, 'n'],
      ],
    },
  });
  V('metronome', {
    side: ['..oo', '..oo', '.oooo', '.oooo', '.oooo', '.oooo', 'oooooo', 'oooooo', 'oooooo', 'OOOOOO'],
    used: {
      put: [
        [4, 1, 'o'],
        [3, 2, 'o'],
        [4, 3, 'o'],
        [3, 5, 'o'],
        [4, 6, 'G'],
        [4, 5, 'G'],
        [3, 4, 'G'],
        [3, 3, 'G'],
        [2, 2, 'G'],
        [1, 1, 'GG'],
        [1, 0, 'G'],
      ],
    },
  });
  V('centrifuge', {
    used: {
      put: [
        [0, 0, 'tT..........'],
        [0, 1, 'tT...2.R.2..'],
        [0, 2, 'tTnnn2nRn2nn'],
        [7, 5, '8'],
        [9, 5, 'M'],
      ],
    },
  });
  V('skeleton-teaching', {
    side: [
      '...ttttt',
      '...t.bbb',
      '...t.bbn',
      '...t.bbb',
      '...t..bb',
      '...t..b',
      '...t.bbb',
      '...t.bbb',
      '...t.b.b',
      '...t.bbb',
      '...t..b',
      '...t.bbb',
      '...t..bb',
      ...rep(7, '...t..b'),
      '...t..bb',
      '...t',
      '.ttttt',
    ],
    used: {
      put: [
        [10, 7, '.'],
        [10, 8, '.'],
        [10, 9, '.'],
        [10, 10, '.'],
        [10, 11, '.'],
        [10, 5, 'b'],
        [11, 4, 'b'],
        [11, 3, 'b'],
        [11, 2, 'b'],
        [11, 1, 'b'],
        [10, 1, 'b'],
      ],
    },
    sideUsed: {
      put: [
        [8, 5, 'b'],
        [9, 4, 'b'],
        [9, 3, 'b'],
        [9, 2, 'b'],
        [9, 1, 'b'],
      ],
    },
  });
  /* ---------- small things of the laboratory ---------- */
  for (const slug of ['jar-brain-wired', 'jar-head', 'jar-heart', 'jar-snake', 'jar-foetus-twin', 'jar-teeth', 'jar-eyes-many', 'leech-jar']) {
    /* opened: the lid lies beside it and the fluid stands lower */
    const rows = R[slug].map((r, y) => (y === 0 ? '........' : y === 2 || y === 3 ? r[0] + r.slice(1, 7).replace(/[L3]/g, '1') + r[7] : r));
    V(slug, {
      used: pat(rows, {
        put: [
          [9, 9, '.IIII.'],
          [9, 10, 'IIIIII'],
        ],
      }),
    });
  }
  V('scalpel-set', {
    used: {
      put: [
        [3, 1, '.'],
        [3, 2, '.'],
        [3, 3, '.'],
        [3, 4, '.'],
      ],
    },
  });
  V('electrode-helmet', {
    used: {
      put: [
        [0, 6, 'FF'],
        [8, 6, 'FF'],
        [2, 0, '2'],
        [3, 1, '2'],
        [7, 0, '2'],
        [6, 1, ' '],
        [0, 0, '2'],
        [9, 0, '2'],
      ],
    },
  });
  V('straitjacket-hook', {
    side: ['.tt', '.t', '.cc', 'cccc', 'cOcc', 'cccc', 'cccc', 'cOcc', 'cccc', 'cccc', 'cccc', '.cc', '.cO'],
    used: R['straitjacket-hook'].map((r, y) => (y < 2 ? r : '')),
    sideUsed: ['.tt', '.t', '', '', '', '', '', '', '', '', '', '', ''],
  });
  V('patient-file', {
    used: [
      'yyyyyyyyyyyyyyyy',
      'yYYYYYYycccccccy',
      'yYwwwYYycnnnnccy',
      'yYwxwYYycccccccy',
      'yYwwwYYycnnncRcy',
      'yYYYYYYycnnnnccy',
      'yyyyyyyyyyyyyyyy',
    ],
  });
  V('microscope-brass', {
    base: 'side',
    side: ['..GGG', '..GGG', '..GGG', '..GGG', '..GGG', '.GGGGG', '..GGG', '.ttttt', '...G', '..GGG', '.GGGGG', 'GGGGGGG'],
    used: { put: [[2, 7, '2tRt2']] },
    sideUsed: { put: [[0, 7, '2ttRtt2']] },
  });
  V('retort-still', {
    used: {
      put: [
        [2, 7, '...'],
        [2, 2, '111'],
        [1, 3, '11111'],
        [10, 5, '8'],
      ],
    },
  });
  V('joystick', {
    used: {
      put: [
        [2, 0, '..RR'],
        [2, 1, '..RR'],
        [2, 2, '.II'],
        [1, 6, 'r'],
      ],
    },
  });
  V('projector-slide', {
    base: 'side',
    side: ['IIIIIIII', 'IitTTtiI', 'IitFFtiI', 'IIIIIIII', '.I....I'],
    used: {
      put: [
        [12, 1, 't'],
        [3, 2, 'nnnn'],
      ],
    },
    sideUsed: { put: [[3, 2, 'nn']] },
  });
  V('camera-bellows', {
    base: 'side',
    side: ['.nnnnnn', 'nOOOOOOn', 'nOOttOOn', 'nOt22tOn', 'nOOttOOn', 'nOOOOOOn', '.nnnnnn', '..I..I', '.I....I', '.I....I', 'I......I', 'I......I'],
    used: {
      put: [
        [0, 0, 'nnnn'],
        [0, 1, 'nn'],
        [0, 5, 'nn'],
        [0, 6, 'nnn'],
        [0, 7, 'nnn'],
        [0, 8, 'nn'],
        [0, 9, 'nn'],
      ],
    },
    sideUsed: {
      put: [
        [0, 0, 'nnnnnnnn'],
        [0, 1, 'nn    nn'],
        [0, 6, 'nn    nn'],
        [0, 7, 'nn    nn'],
        [0, 8, 'n      n'],
      ],
    },
  });
  V('camera-flash', {
    used: {
      swap: { F: 'a' },
      put: [
        [6, 0, 'A'],
        [7, 0, ' '],
      ],
    },
  });
  V('telegraph-key', {
    used: {
      put: [
        [4, 0, '..'],
        [4, 1, 'nn'],
      ],
    },
  });
  V('adding-machine', {
    used: {
      put: [
        [2, 0, 'cccc'],
        [1, 1, 'cncnc'],
        [0, 1, 'c'],
      ],
    },
  });
  V('xray-skull', { used: { swap: { h: 'N' } } });
  V('phonograph-cylinder', { base: 'side', side: ['.GGGG', 'GGnnGG', 'GnnnnG', 'GnnnnG', 'GGnnGG', '.GGGG', '.nnnn', 'oooooo', 'oOOOOo', 'oooooo'] });
  /* ---------- the last of the instruments and parts ---------- */
  V('forceps', { used: ['..r.r', '..t.t', '..t.t', '...t', '..t.t', '.t...t', '.t...t', 'tt...tt'] });
  V('trepan-drill', {
    used: {
      put: [
        [0, 2, '.'],
        [7, 2, 't'],
        [7, 4, '.'],
        [0, 4, 't'],
        [3, 6, 'rr'],
        [3, 7, 'rr'],
        [4, 8, 'r'],
      ],
    },
  });
  V('lobotomy-pick', {
    used: {
      put: [
        [10, 0, 'rrrr'],
        [12, 1, 'r'],
      ],
    },
  });
  V('floppy-disk', {
    used: {
      put: [
        [1, 1, 'nnnt'],
        [1, 2, 'nnnt'],
        [2, 5, 'nRRn'],
      ],
    },
  });
  V('floppy-black', {
    used: {
      put: [
        [1, 1, 'IIIt'],
        [1, 2, 'IIIt'],
        [2, 5, 'wwww'],
      ],
    },
  });
  V('radio-broken', {
    side: ['.....t', 'ooooooo', 'oOOOOOon', 'oOoooOo', 'oOoooOot', 'oOOOOOo.t', 'ooooooo.tt'],
    used: {
      put: [
        [2, 2, 'fF'],
        [3, 3, 'F'],
        [7, 1, 'Ff'],
        [14, 3, 'F'],
      ],
    },
    sideUsed: {
      put: [
        [7, 2, 'F'],
        [7, 3, 'f'],
      ],
    },
  });
  V('clockwork', {
    used: {
      put: [
        [12, 4, 't'],
        [13, 3, 't'],
        [12, 2, 't'],
        [13, 1, 't'],
        [12, 0, 't'],
        [2, 2, 'GG'],
        [8, 2, 'G'],
      ],
    },
  });
  V('gear-big', { side: ['.I', 'III', 'IiI', 'III', 'IiI', 'IiI', 'III', 'IiI', 'III', '.I'] });
  V('anatomy-chart', {
    side: ['OO', ...rep(12, 'c'), 'OO'],
    used: [...R['anatomy-chart'].slice(0, 3), 'OOOOOOOOOO', ...rep(10, '')],
    sideUsed: ['OO', 'c', 'c', 'OO', ...rep(10, '')],
  });
  V('gas-mask', {
    side: ['.nnnn', 'nIIIIn', 'nIII1n', 'nIII1n', 'nIIIIn', '.nIIIn', '.nIIItt', '..nItIIt', '...ntIIt', '....ttt'],
    used: { swap: { 1: 'h' } },
    sideUsed: { swap: { 1: 'h' } },
  });
  V('bell-nurse', {
    used: {
      put: [
        [2, 0, '.'],
        [0, 0, 'w'],
        [4, 0, 'w'],
        [6, 1, 'w'],
      ],
    },
  });
  //VIEWS
};
