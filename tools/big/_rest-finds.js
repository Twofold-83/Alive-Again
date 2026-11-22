/* Small finds and clues, as text pictures (see rest.js for the letters). Small, but a touch bigger than life. */
module.exports = ({ T: T0, vary: vary0, V }) => {
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
  const T = (slug, rows, o) => ((R[slug] = rows), T0(slug, rows, o));
  const vary = (slug, from, o) => ((R[slug] = pat(R[from], o)), vary0(slug, from, o));
  T('key-skeleton', ['.tt......', 't..tttttt', 't..t..t.t', '.tt......']);
  vary('key-brass-ornate', 'key-skeleton', { swap: { t: 'G' }, put: [[1, 1, 'g']] });
  vary('key-rusty', 'key-skeleton', { swap: { t: 'u' }, put: [[5, 1, '0']] });
  vary('key-bone', 'key-skeleton', { swap: { t: 'b' } });
  T('key-tiny', ['GG...', 'G.GGG', 'GG..G']);
  T('key-ring', ['.ttt..', 't...t.', 't...tG', '.tttGG', '..G.G.', '..G...', '..GG..']);
  T('padlock-heavy', ['.tttt.', 't....t', 'IIIIII', 'IInnII', 'IIInII', 'IIIIII']);
  vary('padlock-open', 'padlock-heavy', {
    put: [
      [0, 0, '.tttt.'],
      [0, 1, '.....t'],
      [5, 0, 't'],
    ],
  });
  vary('lock-combination', 'padlock-heavy', {
    swap: { I: 'G', n: 'w' },
    put: [
      [1, 3, 'wnwn'],
      [1, 4, 'GGGG'],
    ],
  });
  T('torn-page', ['cccccc.', 'cnnncc.', 'cccccc', 'cnncnc', 'ccccc.', 'c.cc..'], { shade: false });
  vary('burnt-letter', 'torn-page', {
    put: [
      [4, 4, 'nu'],
      [3, 5, 'nnu'],
      [5, 3, 'n'],
      [0, 5, 'n'],
    ],
  });
  T('note-crumpled', ['.ccc..', 'ccacc.', 'cacccc', 'ccccac', '.caccc', '..ccc.']);
  T('envelope-sealed', ['cccccccc', 'cacccac', 'ccaRaccc', 'cccRcccc', 'cccccccc'], { shade: false });
  vary('telegram', 'envelope-sealed', {
    swap: { c: 'y', a: 'y', R: 'n' },
    put: [
      [1, 1, 'nnnnn'],
      [1, 3, 'nn.nnn'],
    ],
  });
  T('diary-bloodstained', ['vvvvvvv', 'vVVVVVc', 'vVrVVVc', 'vrrrVVc', 'vVrVGVc', 'vvvvvvv']);
  T('photo-torn', ['wwwwww.', 'wnnnnw.', 'wnxxnww', 'wnxxnnw', 'wnnnn.w', 'wwww...'], { shade: false });
  vary('photo-scratched', 'photo-torn', {
    put: [
      [0, 0, 'wwwwwww'],
      [0, 4, 'wnnnnnw'],
      [0, 5, 'wwwwwww'],
      [2, 2, 'ww'],
      [3, 3, 'w'],
      [6, 1, 'w'],
    ],
  });
  vary('photo-negative', 'photo-scratched', { swap: { w: 'n', n: 'h', x: 'n' } });
  T('map-fragment', ['yyyyyy.', 'yeyyyyy', 'yyeeyRy', 'yyyyey.', 'y.yyy..'], { shade: false });
  T('blueprint', ['jjjjjjjjj', 'jwwwwjjwj', 'jwjjwjjwj', 'jwwwwwwwj', 'jjjjjjjjj'], { shade: false });
  T('ticket-train', ['ccccccc', 'cnnncRc', 'ccccccc'], { shade: false });
  vary('ticket-carnival', 'ticket-train', { swap: { c: 'R', n: 'w', R: 'g' } });
  T('coin-old', ['.GG.', 'GgGG', 'GGgG', '.GG.']);
  T('coins-eyes', ['.GG..GG.', 'GgGGGgGG', 'GGgGGGgG', '.GG..GG.']);
  T('ring-signet', ['.rr.', 'GGGG', 'G..G', 'G..G', '.GG.']);
  T('ring-finger', ['.GG...', 'GxxGxx', 'GxxGxr', '.GG...']);
  T('locket-closed', ['.t.t.', 't...t', '.t.t.', '.GGG.', 'GGgGG', 'GGGGG', '.GGG.']);
  vary('locket-open', 'locket-closed', {
    put: [
      [1, 4, 'xnx'],
      [1, 5, 'xxx'],
      [5, 3, 'GG'],
      [5, 4, 'GGG'],
      [5, 5, 'GG'],
    ],
  });
  T('pocket-watch', ['..G..', '.GGG.', 'GwwwG', 'GwnwG', 'GwnnG', '.GGG.']);
  T('matchbox', ['jjjjjj', 'jwwRwj', 'OOOOOO']);
  T('match-lit', ['.F.', 'Ff.', '.R.', '.q.', '.q.', '.q.'], { outline: false });
  T('lantern-dim', ['.III.', '..I..', '.III.', 'I2f2I', 'I2f2I', 'IIIII']);
  T('torch-electric', ['FttIIIIII', 'FttIRIIII', 'FttIIIIII']);
  T('bottle-laudanum', ['.OO.', '.00.', '0000', '0cc0', '0cc0', '0000']);
  T('bottle-message-dark', ['OHHHHHHH.', 'OHHccHHHH', 'OHHHHHHH.']);
  T('pills-spilled', ['.00....', '0000.w.', '0cc0w.w', '0000...', '..w.w..']);
  T(
    'syringe-used',
    ['t.tt22r2ttT', '.....t.....'].map((r) => r),
    { outline: false },
  );
  T('razor-open', ['....TTTTT', 'OOOOtttt.', 'OOOO.....']);
  T('rope-coil', ['.yyyy.', 'yYyyYy', 'yy..yy', 'yYyyYy', '.yyyyy', '.....y']);
  T('shovel-dirty', ['OOOOOOOOOOttt', '..........tet', '..........ttt']);
  T('cassette-tape', ['nnnnnnnn', 'ncccccn', 'nwIcIwnn', 'nnnnnnnn']);
  T('film-reel', ['.IIII.', 'InIInI', 'IIttII', 'IIttII', 'InIInI', '.IIII.']);
  T('music-box-key', ['G.G', 'GGG', '.G.', '.G.', '.G.']);
  T('toy-soldier-broken', ['.nn....', '.xx....', 'RRRR...', 'RRR..jj', '.....n.']);
  T('dolls-head', ['.OOOO.', 'OwwwwO', 'OnwwnO', '.wRRw.', '..ww..']);
  T('dolls-eye', ['.ww.', 'w1nw', 'w11w', '.ww.']);
  T('teeth-pulled', ['w.w..w', 'w.ww.w', 'r..r..']);
  T('tooth-gold', ['GgG', 'GGG', 'G.G']);
  T('cloth-bloody', ['.wwwww.', 'wwrrwww', 'wrrrrww', 'wwrrwww', '.ww.ww.']);
  T('bone-finger', ['b.....b', 'bbbbbbb', 'b.....b']);
  T('bone-jaw', ['b.....b', 'bw.w.wb', 'bbbbbbb', '.bbbbb.']);
  T('feather-black', ['....nn', '...nnn', '..nnn.', '.nnn..', 'nn....', 'I.....']);
  vary('feathers-white', 'feather-black', {
    swap: { n: 'w', I: 'a' },
    put: [
      [5, 3, 'ww'],
      [4, 4, 'ww'],
      [3, 5, 'w'],
    ],
  });
  T('jar-fireflies', ['.OOO.', '22222', '2F2.2', '2.2F2', '22F22', '22222']);
  vary('jar-buttons', 'jar-fireflies', {
    put: [
      [1, 2, 'RwjG'],
      [1, 3, 'wGRj'],
      [1, 4, 'jRGw'],
    ].map(([x, y, t]) => [x, y, t.slice(0, 3)]),
  });
  T('hair-lock', ['..R..', '.ooo.', 'oo.oo', '.oo.o', '..oo.', '.oo..']);
  T('candle-stub', ['.F.', '.f.', 'bbb', 'bbb', 'bbbb'], { outline: false });
  T('whistle-dog', ['tttttt.', 'tTttttI', '..t....']);
  T('chess-piece', ['.nn.', 'nnnn', '.nn.', '.nn.', '.nn.', 'nnnn', 'nnnn']);
  T('card-ace-spades', ['wwwww', 'wnwww', 'wwnww', 'wnnnw', 'wwnww', 'wwwnw', 'wwwww'], { shade: false });
  T('dice-bone', ['bbbb.bbbb', 'bnbb.bbnb', 'bbbb.bnbb', 'bbnb.nbbb', 'bbbb.bbbb']);
  T('thimble-needle', ['.tt....', 'tTtt..t', 'tttt.t.', 'tttt...']);
  T('spectacles-broken', ['.GG...GG.', 'G22GGG..G', 'G22G.G.2G', '.GG...GG.']);
  T('glove-single', ['n.n.n.', 'n.n.nn', 'nnnnnn', 'nnnnnn', '.nnnn.', '.nIIn.']);
  T('shoe-child', ['OO....', 'OOO...', 'OOOOOO', 'nnnnnn']);
  T('ribbon-hair', ['7...7', '77.77', '.777.', '77.77', '7...7']);
  T('nail-coffin', ['ttt', '.t.', '.t.', '.t.', '.I.']);
  T('bell-small', ['..G..', '.GGG.', '.GgG.', 'GGGGG', '..n..']);
  T('hourglass-sand', ['OOOOO', '.2y2.', '..y..', '.2.2.', '.2y2.', 'OOOOO']);
  T('compass-broken', ['.GGGG.', 'GwwnwG', 'GwRwwG', 'GnwwwG', '.GGGG.']);
  /* ================= the other pictures of each thing: turned a quarter, used, and both ================= */
  /* small things mostly only change when used */
  V('key-rusty', {
    used: {
      put: [
        [4, 1, '.'],
        [5, 1, 'u'],
        [6, 2, '.'],
        [8, 2, '.'],
        [7, 2, 'u'],
      ],
    },
  });
  V('padlock-heavy', { side: ['.t', '.t', 'III', 'III', 'III', 'III'], used: R['padlock-open'], sideUsed: ['.t', '', 'III', 'III', 'III', 'III'] });
  V('padlock-open', { side: ['.t', '', 'III', 'III', 'III', 'III'], used: R['padlock-heavy'], sideUsed: ['.t', '.t', 'III', 'III', 'III', 'III'] });
  V('lock-combination', {
    used: {
      put: [
        [0, 0, '.ttttt'],
        [0, 1, '.....t'],
      ],
    },
  });
  V('note-crumpled', { used: ['cccccc', 'cnnncc', 'cccacc', 'cnncnc', 'cacccc', 'ccnncc', 'cccccc'] });
  V('envelope-sealed', { used: ['.wwwwww', '.wnnnnw', 'cwnnwnwc', 'cacccacc', 'ccarrccc', 'cccccccc', 'cccccccc'] });
  V('diary-bloodstained', {
    side: ['vvvvvvv', 'vcccccc', 'vvvvvvv'],
    used: ['ccccc.ccccc', 'cnnnc.cnrrc', 'cnncc.crrnc', 'cnnnc.cncrc', 'ccccc.ccccc', 'vvvvvVvvvvv'],
    sideUsed: ['cc.......cc', 'vccc...cccv', '.vvvcVcvvv'],
  });
  V('ticket-train', { used: { put: [[4, 1, '.']] } });
  V('ticket-carnival', { used: R['ticket-carnival'].map((r) => r.slice(0, 4)) });
  V('locket-closed', { used: R['locket-open'] });
  V('locket-open', { used: R['locket-closed'] });
  V('matchbox', { side: ['jjj', 'jwj', 'OOO'], used: ['jjjjjjqqq', 'jwwRwjRRq', 'OOOOOOqqq'], sideUsed: ['jjj', 'jRj', 'OOO'] });
  V('match-lit', {
    used: {
      put: [
        [0, 0, '.a.'],
        [0, 1, '...'],
        [1, 2, 'n'],
        [1, 3, 'n'],
      ],
    },
  });
  V('lantern-dim', {
    used: {
      put: [
        [1, 3, 'FFF'],
        [1, 4, 'FwF'],
      ],
    },
  });
  V('torch-electric', { used: { swap: { F: '1', R: 'n' } } });
  V('bottle-laudanum', {
    used: {
      put: [
        [1, 0, '..'],
        [5, 5, 'OO'],
      ],
    },
  });
  V('bottle-message-dark', { used: ['O..HHHHHHH', '.nnHHccHHHH', 'nnnHHHHHHH'] });
  V('razor-open', { used: ['', 'OOOOT', 'OOOO'] });
  V('cassette-tape', {
    used: {
      put: [
        [1, 4, 'n.nn.n'],
        [2, 5, 'n..n'],
        [4, 6, 'nn'],
      ],
    },
  });
  V('jar-fireflies', {
    used: {
      put: [
        [0, 0, '.....'],
        [1, 2, '2'],
        [3, 3, '2'],
        [2, 4, '2'],
        [6, 0, 'F'],
        [7, 2, 'F'],
      ],
    },
  });
  V('candle-stub', {
    used: {
      put: [
        [1, 0, 'a'],
        [1, 1, 'n'],
      ],
    },
  });
  V('chess-piece', { used: ['', '', '', '.n...nn', 'nnnnnnn', 'nnnnnnn', '.n...nn'] });
  V('card-ace-spades', { side: [...Array(7)].map(() => 'w'), used: ['wwwww', 'wRwRw', 'wwRww', 'wRwRw', 'wwRww', 'wRwRw', 'wwwww'] });
  V('dice-bone', { used: ['bbbb.bbbb', 'bbbb.bbbb', 'bnbb.bbnb', 'bbbb.bbbb', 'bbbb.bbbb'] });
  V('bell-small', {
    used: {
      put: [
        [2, 4, '.'],
        [3, 4, 'n'],
        [0, 0, 'w'],
        [4, 0, 'w'],
      ],
    },
  });
  V('hourglass-sand', {
    used: {
      put: [
        [2, 1, '1'],
        [2, 2, '2'],
        [2, 3, 'y'],
        [1, 4, 'yyy'],
      ],
    },
  });
  //VIEWS
};
