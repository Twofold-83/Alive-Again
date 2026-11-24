/* WEIRD: the uncanny. 15 heads, 11 torsos, 7 arms, 7 legs. */
module.exports = (kit, tools) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  const { pal, art, repaint, px } = tools;
  const { person, special, torso, arm, leg } = tools.theme('weird');

  const DUMMY = hex('#c9b79a'),
    SACK = hex('#9c8a62'),
    PORC = hex('#e2dccd'),
    BRASS = hex('#9a7a34'),
    CANVAS = hex('#8a8468'),
    MOULD = hex('#5f7f4c'),
    RING = hex('#8a2a2a'),
    TENT = hex('#5a7a6a'),
    SUCK = hex('#b9a8a0'),
    THREAD = hex('#33261e'),
    VEIL = hex('#2a2630'),
    COATG = hex('#6a6460'),
    NAVY = hex('#2c3654');

  /* ---------------- heads ---------------- */
  special('mannequin head blank shop dummy', (c) =>
    art(c, pal({ m: DUMMY, j: lite(DUMMY) }), [
      '..............',
      '.....mmmm.....',
      '....mjjmmm....',
      '...mjmmmmmm...',
      '...mmmmmmmk...',
      '...mMMmmMMm...',
      '...mmmmmmmm...',
      '...mmmmMmmm...',
      '...mmmmmmmm...',
      '...mmmMMmmm...',
      '....mmmmmM....',
      '.....kkkk.....',
      '.....mmmM.....',
    ]),
  );
  person('masked child white mask tan black fringe', 'tan', 'calm', (c, s) => {
    repaint(c, s, PORC, 3, 3, 10, 8);
    HAIRS.fringe(c, HAIR.black);
    px(c, K, [[2, 6], [11, 6]]);
    px(c, dark(PORC), [[3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [10, 8]]);
  });
  const twin = (flip) => (c, s) => {
    const m = (pts) => pts.map(([x, y]) => [flip ? 13 - x : x, y]);
    const h = HAIR.brown;
    for (let x = 4; x <= 9; x++) c.set(x, 2, h);
    for (let x = 3; x <= 10; x++) c.set(x, 3, h);
    px(c, h, m([[3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [3, 5], [3, 6], [10, 4]]));
    px(c, lite(h), m([[8, 2]]));
    px(c, s, m([[8, 3]]));
    px(c, RED, m([[4, 4]]));
    px(c, dark(dark(s)), m([[9, 7]]));
    px(c, WHITE, [[3, 11], [4, 11], [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [9, 11], [10, 11]]);
  };
  person('twin parting on the left fair brown hair', 'fair', 'calm', twin(false));
  person('twin parting on the right mirrored fair brown hair', 'fair', 'calm', twin(true));
  special('sack head stitched cross eyes rope', (c) =>
    art(c, pal({ s: SACK, j: lite(SACK), d: hex('#5a4c34'), e: hex('#6a5a3c') }), [
      '..............',
      '.....ssss.....',
      '...ssssssss...',
      '..sjssssddss..',
      '..ssssssddSs..',
      '..sskssssksS..',
      '..skkksskkkS..',
      '..sskssssksS..',
      '..ssssssssSS..',
      '..ssskdkdssS..',
      '..sssssssSSS..',
      '..eEeeEeeEee..',
      '...sSssSsSs...',
    ]),
  );
  person('antlered girl antlers tan long brown hair', 'tan', 'calm', (c) => {
    HAIRS.long(c, HAIR.brown);
    art(c, pal({ a: hex('#a8987a') }), ['a.a........a.a', '.aa........AA.', '..a........A..']);
  });
  person('head on backwards hair where the face is pale brown hair', 'pale', 'calm', (c, s) => {
    const h = HAIR.brown;
    c.row(2, 4, 9, h);
    c.rect(3, 3, 10, 9, h);
    px(c, h, [[4, 10], [5, 10], [7, 10], [8, 10]]);
    px(c, lite(h), [[4, 3], [5, 4], [4, 5], [8, 3]]);
    px(c, dark(h), [[6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [8, 6], [8, 7], [8, 8], [4, 7], [4, 8]]);
    px(c, dark(h), [[10, 5], [10, 6], [10, 7], [10, 8]]);
    px(c, s, [[2, 6], [2, 7]]);
    px(c, dark(s), [[11, 6], [11, 7]]);
  });
  special('porcelain mask cracked black veil', (c) =>
    art(c, pal({ h: VEIL, j: hex('#443e4e'), p: PORC, i: lite(PORC), o: hex('#c49a94') }), [
      '..............',
      '....hhhhhh....',
      '...hjhhhhhh...',
      '..hhpppkpphh..',
      '..hpippkppph..',
      '..hpppppkpph..',
      '..hpkkppkkph..',
      '..hpppppppkh..',
      '..hpoppppPph..',
      '..hppprrpPph..',
      '..hhpppppPhh..',
      '...hhppPPhh...',
      '....hhhhHH....',
    ]),
  );
  person('long neck brass neck rings ashen black bun', 'ashen', 'calm', (c) => {
    HAIRS.bun(c, HAIR.black);
    art(c, pal({ b: BRASS, i: lite(BRASS) }), ['....ibbbbB....', '....bBBBBB....', '....ibbbbB....'], 0, 10);
    px(c, GOLD, [[2, 7], [2, 8]]);
    px(c, dark(GOLD), [[11, 7], [11, 8]]);
  });
  special('paper bag head eye holes crayon mouth', (c) =>
    art(c, pal({ p: hex('#b39a68'), j: hex('#cdb584'), g: hex('#8f7a50') }), [
      '..............',
      '...pppppppp...',
      '..pjjppppppp..',
      '..ppppPppppp..',
      '..ppppppPppP..',
      '..ppkkppkkpP..',
      '..ppwkppwkpP..',
      '..pPppppppPP..',
      '..pppppppggP..',
      '..ppprrrrgpP..',
      '..pPprpppppP..',
      '..ppppPppppP..',
      '..p.pp.pp.pP..',
    ]),
  );
  person('sailor tentacle beard captain cap drowned grey hair', 'drowned', 'calm', (c) =>
    art(c, pal({ b: NAVY, t: TENT, o: SUCK, g: HAIR.grey }), [
      '....wwwwww....',
      '...wwwwwwwW...',
      '...bbbyybbb...',
      '..kkkkkkkkkk..',
      '...g......G...',
      '...g......G...',
      '..............',
      '..............',
      '...t......t...',
      '...tttttttT...',
      '...totttotT...',
      '..tt.tt.tt.T..',
      '..t..ot..t.T..',
    ]),
  );
  special('diving helmet brass porthole', (c) =>
    art(c, pal({ y: BRASS, i: lite(BRASS), g: hex('#24323a'), l: hex('#8fa6a0'), v: hex('#5f8f7a') }), [
      '.....yyyy.....',
      '...yyyyyyyy...',
      '..yiiyyyyyyy..',
      '..yiyYYYYyyy..',
      '.yyYggggggYyy.',
      '.YyYglggggYyY.',
      '.YyYglggggYyY.',
      '.yyYggggggYyy.',
      '.yyyYggggYyvy.',
      '..yyyYYYYyyy..',
      '..yyyyyyyyyy..',
      '.yykyykyykyyy.',
      '.YYYYYYYYYYYY.',
    ]),
  );
  person('ringmaster mouldy top hat red moustache rotten', 'rotten', 'grin', (c) => {
    HATS.tophat(c, RING);
    c.row(2, 4, 9, GOLD);
    px(c, MOULD, [[5, 0], [8, 1], [3, 3], [4, 3], [9, 0], [10, 9], [3, 5]]);
    px(c, lite(MOULD), [[5, 1], [10, 8]]);
    px(c, K, [[5, 8], [6, 8], [7, 8], [8, 8], [3, 7], [10, 7]]);
  });
  person('woman too many eyes six eyes pale black bun', 'pale', 'calm', (c, s) => {
    HAIRS.bun(c, HAIR.black);
    px(c, K, [[5, 4], [8, 4], [5, 8], [8, 8]]);
    px(c, WHITE, [[4, 4], [9, 4], [4, 8], [9, 8]]);
  });
  person('patchwork face stitched skins tan black hair', 'tan', 'calm', (c, s) => {
    HAIRS.cropped(c, HAIR.black);
    c.rect(7, 2, 10, 3, HAIR.blond);
    c.clear(10, 2);
    repaint(c, s, SKINS.pale, 3, 4, 6, 7);
    repaint(c, s, SKINS.brown, 7, 8, 10, 11);
    px(c, THREAD, [[6, 4], [6, 6], [7, 5], [8, 8], [10, 8], [3, 8], [5, 8], [7, 10]]);
  });

  /* ---------------- torsos ---------------- */
  torso('coat buttoned wrong grey crooked', (c) =>
    art(c, pal({ c: COATG, j: lite(COATG) }), [
      '............',
      '.jccccjcccc.',
      '..cccCkccc..',
      '..ccyCcccc..',
      '..cccCkccc..',
      '..ccyCcccc..',
      '..cccCkccc..',
      '..ccyCcccc..',
      '..cccCcccc..',
      '..ccyC......',
      '............',
    ]),
  );
  torso('patchwork body stitched skins', (c) =>
    art(c, pal({ p: SKINS.pale, t: SKINS.tan, a: SKINS.ashen, g: SKINS.rotten, b: SKINS.brown, x: THREAD }), [
      '............',
      '.pppptttaaa.',
      '..ppxttxaa..',
      '..pppttxaa..',
      '..xpxxxgga..',
      '..bbbgggxx..',
      '..bbxgggpp..',
      '..bbbxgxpp..',
      '..txxttxpp..',
      '..ttttttxp..',
      '............',
    ]),
  );
  torso('diving suit canvas brass collar lead weight', (c) =>
    art(c, pal({ y: BRASS, i: lite(BRASS), c: CANVAS, g: hex('#5a5b63'), e: hex('#3a2c22') }), [
      '............',
      '.iyyyyyyyyy.',
      '..yykyykyy..',
      '..cyyyyyyc..',
      '..ceggggec..',
      '..cegGGgec..',
      '..ccggggcc..',
      '..cCccccCc..',
      '..eeeeyeee..',
      '..cccCcccc..',
      '............',
    ]),
  );
  torso('ringmaster coat red gold braid mouldy', (c) =>
    art(c, pal({ r: RING, j: lite(RING), g: MOULD, i: lite(MOULD) }), [
      '............',
      '.yyrrwwrryy.',
      '..jrrwWrgr..',
      '..ryYYYYyr..',
      '..rrrrrrrr..',
      '..ryYYYYyr..',
      '..grrrrrrr..',
      '..giYYYYyr..',
      '..rgrrrrgr..',
      '..rrrrrgir..',
      '............',
    ]),
  );
  const bathing = (col, skin) => (c) =>
    art(c, pal({ b: col, s: skin, c: hex('#d2ccbb') }), [
      '............',
      '.ssbssssbss.',
      '..sbssssbs..',
      '..bbbSSbbb..',
      '..cccccccc..',
      '..bbbbbbbb..',
      '..cccccccc..',
      '..bbbbbbbb..',
      '..cccccccc..',
      '..bbbbbbbb..',
      '............',
    ]);
  torso('striped bathing suit navy white fair', bathing(NAVY, SKINS.fair));
  torso('mannequin torso shop dummy jointed', (c) =>
    art(c, pal({ m: DUMMY, j: lite(DUMMY), d: hex('#5a4c3c') }), [
      '............',
      '.dmmmmmmmmd.',
      '..mjmmmmmm..',
      '..mmmmmmmm..',
      '..mMMmmMMm..',
      '..mmmmmmmm..',
      '..dddddddd..',
      '..mmmmmmmm..',
      '..mmmmkmkm..',
      '..mmmmmmmm..',
      '............',
    ]),
  );
  torso('drowned sailor jumper navy white collar seaweed barnacles', (c) =>
    art(c, pal({ b: NAVY, j: lite(NAVY), g: MOULD, c: SUCK }), [
      '............',
      '.jbbwwwwbbb.',
      '..bwwbbwwb..',
      '..bbwkkwbb..',
      '..bbbkkbbb..',
      '..gbbbbbbb..',
      '..ggbbbbcb..',
      '..bgbbbbbb..',
      '..bgbbcbbb..',
      '..bbbgbbbb..',
      '............',
    ]),
  );
  torso('cardigan with a hole through the chest mustard', (c) =>
    art(c, pal({ c: hex('#8a6e34'), j: hex('#a88a48') }), [
      '............',
      '.jccccccccc.',
      '..jcccccCc..',
      '..cc....Cc..',
      '..cc....cc..',
      '..cc....Cc..',
      '..cc....cc..',
      '..ccccyCcc..',
      '..cCcCyCcC..',
      '..cCcCcCcC..',
      '............',
    ]),
  );
  torso('sackcloth smock rope noose patch', (c) =>
    art(c, pal({ s: SACK, j: lite(SACK), e: hex('#5a4a30'), d: hex('#7a6a48') }), [
      '............',
      '.jsseeeesss.',
      '..ssseesss..',
      '..ssssesss..',
      '..sddsesSs..',
      '..sddseSss..',
      '..ssss.sss..',
      '..sSssssss..',
      '..sssssSds..',
      '..s.ss.ss.s.',
      '............',
    ]),
  );
  torso('high collar black dress lace cameo brooch', (c) =>
    art(c, pal({ d: VEIL, j: hex('#443e4e'), o: hex('#b08a8a') }), [
      '............',
      '.jddwwwwddd.',
      '..ddwWWwdd..',
      '..dddoodDd..',
      '..dddowdDd..',
      '..ddddjdDd..',
      '..dDddjddd..',
      '.dddddjdddd.',
      '.ddDddjdDdd.',
      '.ddDdddddDd.',
      '............',
    ]),
  );
  torso('striped bathing suit wine cream tan', bathing(CLOTH.wine, SKINS.tan));

  /* ---------------- arms ---------------- */
  arm('arm with extra elbows crooked grey sleeve pale hand', (c) =>
    art(c, pal({ c: COATG, j: lite(COATG), s: SKINS.pale }), ['.jcc.', '.ccc.', 'ccC..', 'ccc..', '.ccC.', '..ccc', '..cCc', '.ccC.', 'ccc..', 'sss..', 'sss..', '.....']),
  );
  arm('tentacle arm green suckers', (c) =>
    art(c, pal({ t: TENT, j: lite(TENT), o: SUCK }), ['.jtt.', '.tto.', '.ttt.', '.tto.', '.ttt.', '.tto.', '.tt..', '.tto.', '..tt.', '..tto', '.t.tt', '.ttt.']),
  );
  arm('diving suit sleeve canvas brass cuff heavy glove', (c) =>
    art(c, pal({ c: CANVAS, j: lite(CANVAS), y: BRASS, i: lite(BRASS), u: hex('#5a3a2c') }), ['.jcc.', '.ccc.', '.cCc.', '.ccc.', '.ccc.', '.cCc.', '.ccc.', 'iyyyy', 'yyyyy', 'uuuuu', 'uuUuu', '.u.uu']),
  );
  arm('ringmaster sleeve red gold cuff mouldy white glove', (c) =>
    art(c, pal({ r: RING, j: lite(RING), g: MOULD }), ['yyyyy', 'y.y.y', '.rrr.', '.rgr.', '.ggr.', '.rrr.', '.yYy.', '.yYy.', '.rrr.', '.www.', '.wgW.', '.....']),
  );
  arm('patchwork arm stitched skins', (c) =>
    art(c, pal({ p: SKINS.pale, t: SKINS.tan, a: SKINS.ashen, g: SKINS.rotten, b: SKINS.brown, x: THREAD }), ['.ppp.', '.ppp.', '.xpx.', '.ggg.', '.ggg.', '.gxx.', '.xbb.', '.bbb.', '.xxx.', '.ttt.', '.ttt.', '.....']),
  );
  arm('mannequin arm jointed shop dummy', (c) =>
    art(c, pal({ m: DUMMY, j: lite(DUMMY), d: hex('#5a4c3c') }), ['.ddd.', '.jmm.', '.mmm.', '.mmm.', '.mmm.', '.dmd.', '.mmm.', '.mmm.', '.ddd.', '.mmm.', '.mMm.', '.....']),
  );
  arm('coat sleeve far too long grey hides the hand', (c) =>
    art(c, pal({ c: COATG, j: lite(COATG) }), ['.jcc.', '.ccc.', '.cCc.', '.ccc.', '.ccc.', '.cCc.', '.ccc.', '.ccc.', '.cCc.', '.ccy.', '.ccc.', '.c.cc']),
  );

  /* ---------------- legs ---------------- */
  leg('legs in callipers leg braces steel pale heavy boot', (c) =>
    art(c, pal({ g: CLOTH.slate, s: SKINS.pale, i: hex('#8d8a90'), e: hex('#5a4030'), u: hex('#241f22') }), [
      '.gggg.',
      '.gggg.',
      '.gGgg.',
      '.issi.',
      '.eeee.',
      '.issi.',
      '.issi.',
      '.eeee.',
      '.issi.',
      '.uuuu.',
      '.uuuu.',
      '.UUUUU',
    ]),
  );
  leg('backwards feet grey trousers shoes pointing the wrong way', (c) =>
    art(c, pal({ c: COATG, j: lite(COATG), u: hex('#5a4030'), i: hex('#7a5a44') }), [
      '.jccc.',
      '.cccc.',
      '.ccCc.',
      '.cccc.',
      '.ccCc.',
      '.cccc.',
      '.ccCc.',
      '.cccc.',
      '.cccc.',
      '.cccc.',
      '.iuuu.',
      'UUUUU.',
    ]),
  );
  leg('diving suit legs canvas lead boots brass toe', (c) =>
    art(c, pal({ c: CANVAS, j: lite(CANVAS), y: BRASS, i: lite(BRASS), g: hex('#5a5b63'), e: hex('#3a2c22') }), [
      '.jccc.',
      '.cccc.',
      '.ccCc.',
      '.cCCc.',
      '.cccc.',
      '.ccCc.',
      '.cccc.',
      '.eeee.',
      'gggggg',
      'geggeg',
      'ggggyy',
      'GGGGyY',
    ]),
  );
  leg('ringmaster white breeches black riding boots mouldy', (c) =>
    art(c, pal({ a: hex('#cfcabb'), u: hex('#241f22'), i: hex('#4a4448'), g: MOULD, e: hex('#5a4030') }), [
      '.aaaa.',
      '.agaa.',
      '.ggAa.',
      '.aaaa.',
      '.eeee.',
      '.iuuu.',
      '.iuuu.',
      '.uugu.',
      '.uggu.',
      '.uuuu.',
      '.uuuu.',
      '.UUUUU',
    ]),
  );
  leg('patchwork legs stitched skins', (c) =>
    art(c, pal({ p: SKINS.pale, t: SKINS.tan, a: SKINS.ashen, g: SKINS.rotten, b: SKINS.brown, x: THREAD, w: hex('#d2ccbb') }), [
      '.wwww.',
      '.wwww.',
      '.tttt.',
      '.ttxx.',
      '.xxaa.',
      '.aaaa.',
      '.aaxa.',
      '.xxxb.',
      '.ggxb.',
      '.gggx.',
      '.pppp.',
      '.ppppp',
    ]),
  );
  leg('mannequin legs jointed knee shop dummy', (c) =>
    art(c, pal({ m: DUMMY, j: lite(DUMMY), d: hex('#5a4c3c') }), [
      '.dddd.',
      '.jmmm.',
      '.mmmm.',
      '.mmmm.',
      '.dmmd.',
      '.dmmd.',
      '.mmmm.',
      '.mmmm.',
      '.mmmm.',
      '.dddd.',
      '.mmmm.',
      '.mmmmM',
    ]),
  );
  leg('striped bathing shorts navy white bare legs fair', (c) =>
    art(c, pal({ b: NAVY, c: hex('#d2ccbb'), s: SKINS.fair }), [
      '.cccc.',
      '.bbbb.',
      '.cccc.',
      '.bbbb.',
      '.ssss.',
      '.ssss.',
      '.ssSs.',
      '.ssss.',
      '.ssss.',
      '.ssss.',
      '.ssss.',
      '.sssss',
    ]),
  );
};
