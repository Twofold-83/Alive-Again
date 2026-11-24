/* HELL: the underworld. 15 heads, 11 torsos, 7 arms, 7 legs. */
module.exports = (kit, tools) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body } = kit;
  const { pal, art, repaint, px } = tools;
  const { person, special, torso, arm, leg } = tools.theme('hell');

  const DEMON = hex('#9a2f26'),
    COAL = hex('#3d2e40'), // the charcoal-plum of imps and burnt demons
    EMBER = hex('#c8642a'),
    FLAME = hex('#dba83e'),
    HORN = hex('#4a3a3a'),
    IRON = hex('#5a5b63'),
    CHAR = hex('#2c2529'),
    CULT = hex('#7c1f22'),
    SHROUD = hex('#2b2732'),
    HIDE = hex('#46362a'),
    RAG = hex('#6c6258');

  /* ---------------- heads ---------------- */
  special('horned demon red fangs', (c) =>
    art(c, pal({ d: DEMON, h: HORN, e: FLAME }), [
      '.n..........n.',
      '.hh........hh.',
      '..hh.dddd.hh..',
      '...hddddddh...',
      '...dddddddd...',
      'd..dddkkddd..d',
      '.ddddeddeddDD.',
      '...dddDdddd...',
      '...dddddddd...',
      '...ddkkkkdd...',
      '....dwddwd....',
      '.....dDDd.....',
      '......DD......',
    ]),
  );
  special('imp little devil charcoal big ears grin', (c) =>
    art(c, pal({ p: lite(COAL), h: HORN, e: FLAME }), [
      '..............',
      '....n....n....',
      '....hpppph....',
      '...pppppppp...',
      'pp.pppppppp.pp',
      '.pppeeppeeppP.',
      '..ppekppkepP..',
      '...pppPpppp...',
      '...pkppppkp...',
      '...ppwwwwpp...',
      '....pkkkkp....',
      '.....pppp.....',
      '..............',
    ]),
  );
  person('damned soul bald hollow eyes smoking iron collar ashen', 'ashen', 'hollow', (c, s) => {
    px(c, BLOOD, [[5, 3], [7, 3], [6, 4]]);
    px(c, dark(s), [[4, 8], [9, 8], [4, 7], [9, 7]]);
    px(c, CHAR, [[3, 4], [4, 3], [10, 8]]);
    art(c, pal({ i: IRON, j: lite(IRON) }), ['...ijiiiiI....', '....iiiiII....'], 0, 11);
    c.set(10, 12, IRON);
    c.set(11, 12, dark(IRON));
  });
  person('fallen angel broken halo blood tear pale long blond hair', 'pale', 'calm', (c) => {
    HAIRS.long(c, HAIR.white);
    px(c, GOLD, [[3, 0], [4, 0], [5, 0], [8, 0], [9, 0], [11, 1]]);
    px(c, dark(GOLD), [[9, 0]]);
    px(c, BLOOD, [[5, 7], [5, 8]]);
    px(c, CHAR, [[2, 11], [11, 11], [2, 10]]);
  });
  special('ferryman black hood skull face', (c) =>
    art(c, pal({ c: SHROUD, j: hex('#423c4c') }), [
      '.....cccc.....',
      '...cjjccccc...',
      '..cjcccccccc..',
      '..ccnnnnnncc..',
      '..cnnnnnnnnc..',
      '..cnkknnkknc..',
      '..cnkknnkkNc..',
      '..cnnnkknnNC..',
      '..ccnnnnnnCC..',
      '..ccnknknNcC..',
      '..cccnnnNccC..',
      '..cccccccccC..',
      '...ccccccCC...',
    ]),
  );
  person('flayed face skinless raw red muscle teeth fair', 'fair', 'hollow', (c, s) => {
    const m = hex('#9c3a34');
    repaint(c, s, m);
    px(c, s, [[4, 3], [5, 3], [3, 4]]);
    px(c, HAIR.brown, [[4, 2], [5, 2], [3, 3]]);
    px(c, dark(m), [[3, 6], [10, 6], [4, 10], [6, 4], [8, 3]]);
    px(c, lite(m), [[4, 8], [9, 4]]);
    px(c, WHITE, [[3, 9], [4, 9], [9, 9], [10, 9]]);
    px(c, dark(WHITE), [[10, 9]]);
  });
  special('crowned prince of hell horns goatee gold crown', (c) =>
    art(c, pal({ d: hex('#7a3040'), h: HORN, e: FLAME, u: hex('#1c1820') }), [
      '....y.yy.y....',
      'n...yyyyyy...n',
      'hh..yryyrY..hh',
      '.hh.uuuuuu.hh.',
      '..hhduuuudhh..',
      '...dddddddd...',
      '...ddeddedd...',
      '...dddDdddd...',
      '...dddddddd...',
      '...dduuuudd...',
      '....dduudd....',
      '.....duud.....',
      '......uu......',
    ]),
  );
  person('cultist red hood shadowed face gold sign tan', 'tan', 'calm', (c, s) => {
    repaint(c, s, mix(s, 0.72), 3, 3, 10, 5);
    art(c, pal({ c: CULT, j: hex('#a0312e') }), [
      '.......cc.....',
      '....ccccccc...',
      '...cjccyyccc..',
      '..cjccccccccc.',
      '..ccc....cccC.',
      '..cc......cCC.',
      '..cc......cC..',
      '..cc......cC..',
      '..cc......cC..',
      '..cc......cC..',
      '..ccc....ccC..',
      '...cc....cC...',
      '....cc..cC....',
    ]);
  });
  special('tormentor iron mask rivets eye slits grille', (c) =>
    art(c, pal({ i: IRON, j: lite(IRON), u: CLOTH.rust, e: hex('#3a2c22') }), [
      '..............',
      '....iiiiii....',
      '...ijjiiiii...',
      '..eiiiiiiiie..',
      '..ejiiiiiije..',
      '...iiiiiiii...',
      '...ikriirki...',
      '...iuiIiiii...',
      '...iiiiiiii...',
      '...iikikiki...',
      '...jikikikj...',
      '....iiiiII....',
      '..............',
    ]),
  );
  special('goat head black horns beard slit eyes', (c) =>
    art(c, pal({ g: hex('#3b363d'), l: hex('#6c666c'), h: hex('#8a7f68'), e: hex('#b8963a') }), [
      '..h........h..',
      '.hh........hh.',
      '.hH..gggg..hH.',
      '..hhgggggghH..',
      'gg.gggggggg.gg',
      '.gggggggggggG.',
      '...gekggkeg...',
      '...gggggggg...',
      '....gggggg....',
      '....gllllg....',
      '....glkklg....',
      '.....lwwl.....',
      '......wW......',
    ]),
  );
  person('horned woman little red horns pale long black hair choker', 'pale', 'grin', (c) => {
    HAIRS.long(c, HAIR.black);
    px(c, HAIR.black, [[6, 3], [7, 3], [6, 4]]);
    px(c, DEMON, [[2, 2], [2, 1], [1, 0], [11, 2]]);
    px(c, dark(DEMON), [[11, 1], [12, 0]]);
    c.row(11, 5, 8, CULT);
    c.set(6, 11, GOLD);
  });
  person('sinner hair on fire burning brown', 'brown', 'weeping', (c, s) => {
    art(c, pal({ f: EMBER, e: FLAME }), ['...f...f..f...', '..ff.f.ff.ff..', '..feffefeeff..', '..feefeefeef..', '..f........F..'], 0, 0);
    px(c, CHAR, [[4, 4], [9, 4]]);
  });
  person('sewn mouth sinner stitched lips rotten grey hair', 'rotten', 'hollow', (c, s) => {
    HAIRS.balding(c, HAIR.grey);
    c.col(2, 4, 9, HAIR.grey);
    c.col(11, 4, 9, dark(HAIR.grey));
    px(c, HAIR.grey, [[3, 3], [10, 3]]);
    c.row(9, 4, 9, dark(dark(s)));
    px(c, BONE, [[4, 8], [6, 8], [8, 8], [5, 10], [7, 10], [9, 10]]);
    px(c, K, [[4, 9], [6, 9], [8, 9]]);
  });
  special('fly head lord of flies red eyes', (c) =>
    art(c, pal({ b: hex('#2f2a31'), j: hex('#48414b'), e: hex('#8e2a24'), q: hex('#c46a4a'), p: hex('#5e4c40') }), [
      '..............',
      '....k....k....',
      '.....kbbk.....',
      '..eebjbbbbee..',
      '.eEeEbbbbeEeE.',
      '.EqEebbbbEqEe.',
      '.eEeEbjbbeEeE.',
      '.EeEebbbbEeEe.',
      '..eEbbbbbbEe..',
      '...bbbppbbb...',
      '....bbppbb....',
      '......pp......',
      '.....pPPp.....',
    ]),
  );
  person('dead passenger coins on eyes jaw cloth drowned black hair', 'drowned', 'calm', (c) => {
    HAIRS.parted(c, HAIR.black);
    c.rect(4, 5, 5, 6, GOLD);
    c.rect(8, 5, 9, 6, GOLD);
    px(c, lite(GOLD), [[4, 5], [8, 5]]);
    px(c, dark(GOLD), [[5, 6], [9, 6]]);
    px(c, BONE, [[3, 7], [3, 8], [3, 9], [4, 10], [5, 11], [6, 11], [7, 11], [3, 6]]);
    px(c, dark(BONE), [[8, 11], [9, 10], [10, 9], [10, 8], [10, 7], [10, 6]]);
  });

  /* ---------------- torsos ---------------- */
  const chest = (col, mark) => (c) =>
    art(c, pal({ d: col, j: lite(col), b: mark, f: hex('#2a2228') }), [
      '............',
      '.jddddddddd.',
      '..jddddddd..',
      '..dDDddDDd..',
      '..ddbddddd..',
      '..dbbbdDdd..',
      '..ddbddddd..',
      '..ddbDDddd..',
      '..dddddDdd..',
      '..fFffFffF..',
      '............',
    ]);
  torso('bare red demon chest branded', chest(DEMON, hex('#4a1414')));
  torso('bare charcoal demon chest glowing brand', chest(lite(COAL), EMBER));
  torso('chains across bare chest ashen', (c) => {
    const s = SKINS.ashen;
    body(c, s);
    c.row(4, 3, 4, dark(s));
    c.row(4, 7, 8, dark(s));
    for (let i = 0; i < 8; i++) {
      c.set(2 + i, 2 + i, i % 2 ? lite(IRON) : IRON);
      c.set(9 - i, 2 + i, i % 2 ? IRON : dark(IRON));
    }
    c.set(1, 1, IRON);
    c.set(10, 1, IRON);
    c.rect(5, 5, 6, 6, hex('#2a2a30'));
    c.set(5, 5, lite(IRON));
    c.row(9, 2, 9, RAG);
    c.set(4, 9, dark(RAG));
  });
  torso('charred robe black burnt embers', (c) =>
    art(c, pal({ c: CHAR, j: hex('#463c40'), e: EMBER, f: FLAME }), [
      '............',
      '.jccccccccc.',
      '..jcccCccc..',
      '..ccccCccc..',
      '..cecccccc..',
      '..ckecCccc..',
      '.cccccCcccc.',
      '.ccccCCcecc.',
      '.cecccCckec.',
      '.c.cec.cc.c.',
      '............',
    ]),
  );
  torso('bone armour ribs skull belt', (c) =>
    art(c, pal({ l: HIDE, j: lite(HIDE) }), [
      '............',
      '.nnjllllnnN.',
      '..NlnnnnlN..',
      '..nnnllnnn..',
      '..llllllll..',
      '..nnnllnnn..',
      '..llllllll..',
      '..lnnllnnl..',
      '..llnnnnll..',
      '..llknnkll..',
      '............',
    ]),
  );
  torso('cultist red robe black sign rope belt', (c) =>
    art(c, pal({ c: CULT, j: hex('#a0312e') }), [
      '............',
      '.jCCCCCCCCc.',
      '..cCCCCCCc..',
      '..ckkkkkkc..',
      '..cckyykcc..',
      '..ccckkccc..',
      '.cccccccccc.',
      '.YYYYyYYYYY.',
      '.ccccyyCccc.',
      '.cccccyCccc.',
      '............',
    ]),
  );
  torso('flame licked rags burning grey', (c) =>
    art(c, pal({ g: RAG, s: SKINS.ashen, f: EMBER, e: FLAME }), [
      '............',
      '.gggggggggg.',
      '..gggGgggg..',
      '..gsggggGg..',
      '..ggggGggg..',
      '..gGggggsg..',
      '..ggkgggkg..',
      '..gfkgfgkf..',
      '..ffgfefgf..',
      '..feffeefe..',
      '............',
    ]),
  );
  torso('ferryman black cloak bone clasp coin purse', (c) =>
    art(c, pal({ c: SHROUD, j: hex('#423c4c') }), [
      '............',
      '.jccccccccc.',
      '.ccjcnnccCc.',
      '.cccjccCccc.',
      '.cccjccCccc.',
      '.ccccjcCccc.',
      '.ccccjcCccc.',
      '.ccccjcCycc.',
      '.cccccjCyYc.',
      '.c.cc.cCc.c.',
      '............',
    ]),
  );
  torso('prince doublet black gold red sash', (c) => {
    const d = hex('#27222d');
    body(c, d);
    c.set(1, 1, GOLD);
    c.set(2, 1, GOLD);
    c.set(9, 1, GOLD);
    c.set(10, 1, dark(GOLD));
    c.row(1, 4, 7, hex('#3d3746'));
    for (let i = 0; i < 7; i++) {
      c.set(8 - i, 2 + i, RED);
      c.set(9 - i, 2 + i, BLOOD);
    }
    px(c, GOLD, [[3, 3], [3, 5], [7, 6], [7, 8]]);
    c.row(9, 2, 9, dark(GOLD));
    c.set(5, 9, GOLD);
  });
  torso('tormentor leather harness iron ring bloody apron tan', (c) => {
    const s = SKINS.tan,
      l = hex('#3a2c22');
    body(c, s);
    c.row(4, 3, 4, dark(s));
    c.row(4, 7, 8, dark(s));
    for (let i = 0; i < 4; i++) {
      c.set(2 + i, 1 + i, l);
      c.set(9 - i, 1 + i, l);
    }
    c.rect(5, 4, 6, 5, IRON);
    c.set(5, 4, lite(IRON));
    c.rect(2, 6, 9, 9, hex('#54402e'));
    c.row(6, 2, 9, l);
    px(c, lite(IRON), [[3, 6], [6, 6], [8, 6]]);
    px(c, BLOOD, [[4, 8], [5, 8], [5, 9], [7, 7], [8, 9]]);
  });
  torso('fallen angel torn white robe bloody shoulders', (c) =>
    art(c, pal({ a: hex('#cfcabb'), y: dark(GOLD), u: CHAR }), [
      '............',
      '.RRaaaaaaRR.',
      '..RaaAaaaR..',
      '..aRaAaaRa..',
      '..aaaAaaaa..',
      '..aaaaAaaa..',
      '.yyyyyyyyyy.',
      '.aaaAaaayaa.',
      '.aAaaaaAaua.',
      '.aua.aaua.a.',
      '............',
    ]),
  );

  /* ---------------- arms ---------------- */
  const claw = (col) => (c) =>
    art(c, pal({ d: col, j: lite(col), h: hex('#8a7f68') }), ['.jdd.', '.ddd.', '.dDd.', '.ddd.', 'nddd.', '.dDd.', '.ddd.', '.ddd.', 'ddddd', 'd.d.d', 'h.h.h', 'h.h.h']);
  arm('clawed demon arm red', claw(DEMON));
  arm('clawed demon arm charcoal', claw(lite(COAL)));
  arm('bone armour arm bone gauntlet', (c) =>
    art(c, pal({ l: HIDE }), ['nnnn.', 'nNnn.', '.lll.', '.lll.', '.lLl.', '.nnn.', '.nNn.', '.nnn.', '.lll.', '.nnn.', '.nkn.', '.....']),
  );
  arm('charred robe sleeve burnt black hand', (c) =>
    art(c, pal({ c: CHAR, j: hex('#463c40'), e: EMBER, u: hex('#4a3630') }), ['.jcc.', '.ccc.', '.cCc.', '.ccc.', '.ccc.', 'ccccc', 'ccCcc', 'cecCc', 'c.c.c', '.uuu.', '.ueu.', '.....']),
  );
  arm('cultist red wide sleeve gold trim tan hand', (c) =>
    art(c, pal({ c: CULT, j: hex('#a0312e'), s: SKINS.tan }), ['.jcc.', '.ccc.', '.cCc.', '.ccc.', 'ccccc', 'ccCcc', 'ccCcc', 'YyYYY', '.kkk.', '.sss.', '.sss.', '.....']),
  );
  arm('burning arm on fire rags ashen', (c) =>
    art(c, pal({ g: RAG, s: SKINS.ashen, f: EMBER, e: FLAME }), ['.ggg.', '.ggg.', '.gGg.', '.g.g.', '.sss.', '.sss.', '.sks.', 'fsssf', 'fefef', 'efeff', '.fef.', '..f..']),
  );
  arm('branded arm iron manacle chain ashen', (c) =>
    art(c, pal({ a: SKINS.ashen, i: IRON, j: lite(IRON) }), ['.aaa.', '.aaa.', '.aRa.', '.RRR.', '.aRa.', '.aaa.', '.aaa.', 'ijiii', 'iIiIi', '.aaai', '.aaaI', '....i']),
  );

  /* ---------------- legs ---------------- */
  const hoof = (fur) => (c) =>
    art(c, pal({ f: fur, j: lite(fur), h: hex('#2e282c'), i: hex('#5a5258') }), [
      '.jfff.',
      '.fFff.',
      'fffFf.',
      '.ffff.',
      '.fFfFf',
      '.ffff.',
      '..ffF.',
      '..ff..',
      '..ff..',
      '..fF..',
      '.hihh.',
      '.hh.hh',
    ]);
  leg('goat legs hooves red brown fur', hoof(hex('#6e2c24')));
  leg('goat legs hooves black fur', hoof(hex('#353037')));
  leg('charred robe hem burnt tattered', (c) =>
    art(c, pal({ c: CHAR, j: hex('#463c40'), e: EMBER, u: hex('#4a3630') }), [
      'cjcccc',
      'ccCccc',
      'ccCccc',
      'ccCccc',
      'cccCcc',
      'cccCcc',
      'cecCcc',
      'cccCcc',
      'ccCcec',
      'cc.Ccc',
      'c..c.c',
      '..uuu.',
    ]),
  );
  leg('cultist red robe long gold hem sandal tan', (c) =>
    art(c, pal({ c: CULT, j: hex('#a0312e'), s: SKINS.tan }), [
      'cjcccc',
      'ccCccc',
      'ccCccc',
      'cccCcc',
      'cccCcc',
      'cccCcc',
      'ccCccc',
      'ccCccc',
      'YyYYyY',
      'cccccc',
      '..sks.',
      '..ssss',
    ]),
  );
  leg('flame licked ragged trousers burning feet ashen', (c) =>
    art(c, pal({ g: RAG, s: SKINS.ashen, f: EMBER, e: FLAME }), [
      '.gggg.',
      '.gggg.',
      '.gGgg.',
      '.gggg.',
      '.gg.g.',
      '.sgss.',
      '.ssss.',
      '.sssf.',
      '.fsfe.',
      '.efsff',
      'ffefef',
      'fefeff',
    ]),
  );
  leg('bone greaves shin bones leather', (c) =>
    art(c, pal({ l: HIDE, j: lite(HIDE) }), [
      '.jlll.',
      '.llll.',
      '.lLll.',
      '.nnnn.',
      '.nNNn.',
      '.lnnl.',
      '.lnnl.',
      '.lnnl.',
      '.lnNl.',
      '.llll.',
      '.lllnn',
      '.LLLnN',
    ]),
  );
  leg('shackled bare legs loincloth iron fetters ashen', (c) =>
    art(c, pal({ g: RAG, a: SKINS.ashen, i: IRON, j: lite(IRON) }), [
      '.gggg.',
      '.gGgg.',
      '.g.gg.',
      '.aaaa.',
      '.aaaa.',
      '.aaAa.',
      '.aaaa.',
      'ijiiii',
      'IiIiIi',
      'iaaaa.',
      'Iaaaa.',
      'iaaaaa',
    ]),
  );
};
