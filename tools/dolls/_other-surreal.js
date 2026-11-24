/* SURREAL: painters' impossible people. 16 heads, 12 torsos, 6 arms, 6 legs. */
module.exports = (kit, tools) => {
  const { SKINS, HAIR, CLOTH, HAIRS, HATS, K, WHITE, BONE, RED, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  const { pal, art, px } = tools;
  const { person, special, torso, arm, leg } = tools.theme('surreal');

  const SKY = hex('#7096b4'),
    CLOUD = hex('#dfe2e0'),
    APPLE = hex('#6f8f3e'),
    COAT = hex('#2a2630'),
    COATL = hex('#454050'),
    WOOD = hex('#7a5a3c'),
    SCALE = hex('#3f6e72'),
    BELLY = hex('#a9b8a4'),
    CLOTHW = hex('#cfcabb'),
    ROSE = hex('#8a2a34'),
    LOB = hex('#a8412f'),
    BRICK = hex('#8a4a38'),
    EMBER = hex('#c8642a'),
    FLAME = hex('#dba83e'),
    CRUST = hex('#b0844a');

  /* ---------------- heads ---------------- */
  special('bowler hat man green apple face', (c) =>
    art(c, pal({ b: COAT, j: COATL, s: SKINS.pale, a: APPLE, i: lite(APPLE), l: hex('#3d5a2a'), e: WOOD }), [
      '.....bbbb.....',
      '....bjbbbb....',
      '....bjbbbB....',
      '..bbbbbbbbBB..',
      '...sssellss...',
      '...saaaaaaS...',
      '...aiaaaaaA...',
      '...aiaaaaaA...',
      '...aaaaaaAA...',
      '...saaaaAAS...',
      '....ssssSS....',
      '.....ssSS.....',
      '..............',
    ]),
  );
  special('birdcage head gold wire red bird', (c) =>
    art(c, pal({ d: hex('#24222b'), r: hex('#a33a30'), e: WOOD, o: EMBER }), [
      '......yy......',
      '....yyyyyy....',
      '...ydyddydy...',
      '..yddyddyddy..',
      '..yddyddyddy..',
      '..yddydryddy..',
      '..yddyrroddy..',
      '..yddrRdyddy..',
      '..yeeeeeeeey..',
      '..yddyddyddy..',
      '..yyyyyyyyyy..',
      '...YYYYYYYY...',
      '..............',
    ]),
  );
  special('head wrapped in white cloth lovers veil', (c) =>
    art(c, pal({ c: CLOTHW, j: lite(CLOTHW) }), [
      '..............',
      '.....cccc.....',
      '...cjjccccc...',
      '..cjccccccCc..',
      '..cccccccCcc..',
      '..ccccccCcccc.',
      '..cCCccCCcccCc',
      '..cccccccccCC.',
      '..ccccCccccc..',
      '..ccCccccCcc..',
      '...ccCCCCcc...',
      '....cccccc....',
      '.....cCCc.....',
    ]),
  );
  special('giant eye for a head eyeball blue iris', (c) =>
    art(c, pal({ i: hex('#4d7a8a'), g: hex('#8fb4be'), v: hex('#b86a5e') }), [
      '..............',
      '.....wwww.....',
      '...wwwwwwww...',
      '..wwwwwwwwww..',
      '..wvwiiiiwww..',
      '.wwvigiiiiwwW.',
      '.wwwigkkiiwwW.',
      '.wwwiikkiiwWW.',
      '.wwwiiiiiivWW.',
      '..wwwiiiiwvW..',
      '..wwwwwwwWWW..',
      '...wwwwWWWW...',
      '.....WWWW.....',
    ]),
  );
  person('woman drawer in forehead pale red hair', 'pale', 'calm', (c) =>
    art(c, pal({ h: HAIR.red, d: WOOD, i: lite(WOOD) }), [
      '..............',
      '....hhhhhh....',
      '...hhhhhhhh...',
      '..hhiiiiiihh..',
      '..hhDdyydDhH..',
      '..h........H..',
      '..h........H..',
      '..h........H..',
      '..h........H..',
      '..h........H..',
      '..hh......hH..',
      '..hh......hH..',
      '..............',
    ]),
  );
  person('moustache far too long curling fair black hair', 'fair', 'scared', (c) => {
    HAIRS.parted(c, HAIR.black);
    art(c, pal({ m: hex('#1b1722') }), ['.m..........m.', 'm............m', 'm............m', '.mmmmm..mmmmm.'], 0, 5);
  });
  special('fish head silver teal big eye', (c) =>
    art(c, pal({ s: SCALE, g: dark(SCALE), b: BELLY, f: hex('#5a8a8a') }), [
      '.....ff.......',
      '....ffff......',
      '....ssssss....',
      '...ssssssss...',
      '..ssgsswwwss..',
      '..sgssswkwsss.',
      '..sgssswwwsss.',
      '..ssgssssskkk.',
      '..bbbsssssss..',
      '...bbbbbbbb...',
      '....bbbbbb....',
      '.....fbbB.....',
      '..............',
    ]),
  );
  special('cloud head white cloud with eyes', (c) =>
    art(c, pal({ w: CLOUD, W: hex('#a3afc0'), b: SKY }), [
      '..............',
      '....ww..ww....',
      '...wwwwwwww...',
      '..wwwwwwwwww..',
      '.wwwwwwwwwwww.',
      'wwwwwwwwwwwwwW',
      'wwwwwkwwkwwwWW',
      'wwwwwwwwwwwwWW',
      '.wwwwwwwwwwWW.',
      '..WwwwwwwwWW..',
      '...WWWWWWWW...',
      '......bb......',
      '..............',
    ]),
  );
  special('keyhole face wooden door brass keyhole sky', (c) =>
    art(c, pal({ d: hex('#4a3626'), j: hex('#6a503a'), s: SKY }), [
      '..............',
      '..............',
      '....dddddd....',
      '...djyyyydd...',
      '...dysswsyD...',
      '...dyswwsyD...',
      '...dyssssyD...',
      '...djyssydD...',
      '...ddyssydD...',
      '...ddyssydD...',
      '....dyyyyD....',
      '.....ddDD.....',
      '..............',
    ]),
  );
  special('clock face melting brass clock', (c) =>
    art(c, pal({ c: hex('#d6cfb4') }), [
      '..............',
      '.....yyyy.....',
      '...yyckccyy...',
      '..yccccccccy..',
      '..yccckccccY..',
      '..yccckccccY..',
      '..ykcckkkkcY..',
      '..yccccccccY..',
      '..yccccccccY..',
      '...yccccccY...',
      '....yyyyycY...',
      '.........cY...',
      '.........Y....',
    ]),
  );
  person('bowler hat white dove over the face tan', 'tan', 'calm', (c) => {
    art(c, pal({ b: COAT, j: COATL }), [
      '....bbbbbb....',
      '....bjbbbB....',
      '..bbbbbbbbBB..',
      '......ww......',
      'ww...wwkwy..ww',
      '.wwwwwwwwwwww.',
      '..wWwwwwwwWw..',
      '....wwwwww....',
      '.....WwwW.....',
    ]);
  });
  person('woman rose for hair red petals brown', 'brown', 'calm', (c) =>
    art(c, pal({ r: ROSE, i: hex('#ab4450'), g: hex('#3d5a2a') }), [
      '....rrrrr.....',
      '...rRiirRr....',
      '..rirRrRirr...',
      '..rRrriirRrr..',
      '..rr......rRg.',
      '..r........rgg',
      '..r........R.g',
    ]),
  );
  person('woman lobster hat red pale black hair', 'pale', 'calm', (c) =>
    art(c, pal({ l: LOB, h: HAIR.black }), [
      '...l......l...',
      '....llllll....',
      '..lllLlLlLll..',
      '.ll.hhhhhh.ll.',
      '.lL.h....h.lL.',
      'l.l........l.l',
      'l.L........l.L',
    ]),
  );
  person('man half face cut away sky brown', 'brown', 'calm', (c) => {
    HAIRS.cropped(c, HAIR.black);
    for (let y = 0; y < 13; y++) for (let x = 7; x < 14; x++) if (c.get(x, y)) c.set(x, y, SKY);
    px(c, CLOUD, [[8, 5], [9, 5], [8, 6], [9, 6], [10, 6], [7, 9], [8, 9]]);
    px(c, lite(SKY), [[7, 2], [7, 3]]);
  });
  person('candle head melting wax flame ashen bald', 'ashen', 'calm', (c) =>
    art(c, pal({ a: BONE, f: FLAME, e: EMBER }), [
      '......f.......',
      '......e.......',
      '....aakaaa....',
      '...aaaaaaaa...',
      '...aa.aa.aA...',
      '...a.....aA...',
      '...a......A...',
      '..........A...',
    ]),
  );
  person('bowler hat pipe smoker moustache fair brown hair', 'fair', 'calm', (c) => {
    HATS.bowler(c, COAT);
    c.set(5, 1, COATL);
    art(c, pal({ m: HAIR.brown, p: hex('#5a3e2a'), g: hex('#a9a6a0') }), ['............g.', '...........g..', '............g.', '..............', '....mmmmm..pp.', '........pppPp.', '...........PP.'], 0, 4);
  });

  /* ---------------- torsos ---------------- */
  torso('suit of sky blue with clouds', (c) =>
    art(c, pal({ s: SKY, j: lite(SKY), c: CLOUD }), [
      '............',
      '.jsssSSssss.',
      '..jsSssSss..',
      '..sccsSsss..',
      '..ccccssss..',
      '..ssssSscc..',
      '..ssssSccc..',
      '..sccsSsss..',
      '..ccccSsss..',
      '..ssssSsss..',
      '............',
    ]),
  );
  torso('torso with drawers wooden chest open drawer', (c) =>
    art(c, pal({ s: SKINS.pale, d: WOOD, i: lite(WOOD), u: hex('#241c18') }), [
      '............',
      '.sssssssssS.',
      '..iiiiiiii..',
      '..ddyddydd..',
      '..DDDDDDDD..',
      '.iiiiiiiiu..',
      '.ddyddyddu..',
      '.DDDDDDDDwu.',
      '..iiiiiiiw..',
      '..ddyddydd..',
      '............',
    ]),
  );
  const chess = (a, b) => (c) => {
    for (let y = 1; y <= 9; y++) for (let x = y < 6 ? (y === 1 ? 1 : 2) : 1; x <= (y < 6 ? (y === 1 ? 10 : 9) : 10); x++) c.set(x, y, ((x >> 1) + ((y + 1) >> 1)) % 2 ? a : b);
    c.row(1, 4, 7, CLOUD);
    c.row(5, 2, 9, dark(a));
  };
  torso('chessboard dress black white checks', chess(COAT, CLOUD));
  torso('ribcage birdcage red bird inside ribs', (c) =>
    art(c, pal({ d: hex('#24222b'), r: hex('#a33a30') }), [
      '............',
      '.nnnnnnnnnN.',
      '..nnnnnnnN..',
      '..nddddddN..',
      '..nnndrnnN..',
      '..nddrrydN..',
      '..nnnrrnnN..',
      '..nddRdddN..',
      '..yyyyyyyY..',
      '..NnnddnnN..',
      '............',
    ]),
  );
  torso('bowler man black overcoat white collar red tie', (c) =>
    art(c, pal({ c: COAT, j: COATL }), [
      '............',
      '.jccCwwCccc.',
      '..jCwrwCcc..',
      '..cjCrCjcc..',
      '..ccCrCccc..',
      '..ccjCjccc..',
      '..cccCyccc..',
      '..cccCcccc..',
      '..cccCyccc..',
      '..cccCcccc..',
      '............',
    ]),
  );
  torso('picture frame torso gold frame seascape painting', (c) =>
    art(c, pal({ c: COAT, j: COATL, s: SKY, a: hex('#2f5658') }), [
      '............',
      '.jccccccccc.',
      '..yyyyyyyY..',
      '..ysswwssY..',
      '..yssswssY..',
      '..ysskwssY..',
      '..yaakkkaY..',
      '..yaAaaAaY..',
      '..yYYYYYYY..',
      '..cccccccc..',
      '............',
    ]),
  );
  torso('piano keys dress black white keyboard', (c) =>
    art(c, pal({ u: hex('#1c1a22'), g: hex('#a9a6a0') }), [
      '............',
      '.uuuuuuuuuu.',
      '..wuwuwgwu..',
      '..wuwuwgwu..',
      '..wuwuwgwu..',
      '..wuwuwgwu..',
      '..wgwgwgwg..',
      '..wgwgwgwg..',
      '..wgwgwgwg..',
      '..wgwgwgwg..',
      '............',
    ]),
  );
  torso('harlequin diamonds rust cream ruff', (c) => {
    const a = CLOTH.rust,
      b = CLOTH.cream;
    body(c, a);
    for (let y = 1; y <= 9; y++) for (let x = 1; x <= 10; x++) if (c.get(x, y)) c.set(x, y, (Math.floor((x + y) / 3) + Math.floor((x - y + 21) / 3)) % 2 ? a : b);
    c.row(1, 3, 8, WHITE);
    px(c, dark(WHITE), [[4, 1], [6, 1], [8, 1]]);
    px(c, COAT, [[5, 4], [5, 7]]);
  });
  torso('fish scale torso teal silver belly', (c) =>
    art(c, pal({ s: SCALE, j: lite(SCALE), b: BELLY }), [
      '............',
      '.jsssbbssss.',
      '..SsSbbSsS..',
      '..sssbBsss..',
      '..sSsbbsSs..',
      '..sssbBsss..',
      '..SsSbbSsS..',
      '..sssbBsss..',
      '..sSsbbsSs..',
      '..sssbBsss..',
      '............',
    ]),
  );
  torso('torso wrapped in white cloth drapery', (c) =>
    art(c, pal({ c: CLOTHW, j: lite(CLOTHW) }), [
      '............',
      '.jccccccccc.',
      '..jccccCcc..',
      '..ccccCccc..',
      '..cccCcccC..',
      '..ccCcccCc..',
      '.ccCcccCccc.',
      '.cCcccCcccc.',
      '.ccccCccCcc.',
      '.ccc.ccc.cc.',
      '............',
    ]),
  );
  torso('brick wall torso green door lit window', (c) =>
    art(c, pal({ b: BRICK, m: hex('#b7a48c'), d: CLOTH.forest, l: hex('#c9b060') }), [
      '............',
      '.bbbmbbbmbb.',
      '..mmmmmmmm..',
      '..bmbbmllb..',
      '..mmmmmllm..',
      '..bdddbbmb..',
      '..mdddmmmm..',
      '..bdydbmbb..',
      '..mdddmmmm..',
      '..bdddbbmb..',
      '............',
    ]),
  );
  torso('chessboard dress wine cream checks', chess(CLOTH.wine, CLOTH.cream));

  /* ---------------- arms ---------------- */
  arm('arm that is a loaf of bread baguette', (c) =>
    art(c, pal({ c: CRUST, l: hex('#d8be8a') }), ['.ccc.', '.clc.', '.lcc.', '.ccc.', '.ccl.', '.clc.', '.lcc.', '.ccc.', '.ccl.', '.clc.', '.CcC.', '.....']),
  );
  arm('arm that is a gold key', (c) => art(c, pal({ i: lite(GOLD) }), ['.iyy.', 'iy.yy', 'yy.yY', '.yyY.', '..y..', '..y..', '..y..', '..y..', '..yyy', '..y.Y', '..yyy', '.....']));
  arm('arm that is a flame fire', (c) =>
    art(c, pal({ f: EMBER, e: FLAME, i: hex('#ead9a0') }), ['.fff.', 'ffeff', 'feief', 'feief', 'ffeef', '.feff', '.feef', '.ffef', '..fef', '.fef.', '..ff.', '..f..']),
  );
  arm('sky sleeve cloud pale hand', (c) =>
    art(c, pal({ s: SKY, j: lite(SKY), c: CLOUD, h: SKINS.pale }), ['.jss.', '.sss.', '.scs.', '.ccc.', '.sss.', '.sSs.', '.ssc.', '.scc.', '.sss.', '.hhh.', '.hhh.', '.....']),
  );
  arm('black sleeve white cuff green apple for a hand', (c) =>
    art(c, pal({ c: COAT, j: COATL, a: APPLE, i: lite(APPLE), e: WOOD }), ['.jcc.', '.ccc.', '.cCc.', '.ccc.', '.ccc.', '.cCc.', '.ccc.', '.www.', '..e..', '.aaa.', '.iaA.', '.aaA.']),
  );
  arm('chessboard sleeve black white glove', (c) =>
    art(c, pal({ u: COAT, c: CLOUD }), ['.uuc.', '.uuc.', '.ccu.', '.ccu.', '.uuc.', '.uuc.', '.ccu.', '.ccu.', '.uuu.', '.www.', '.wwW.', '.....']),
  );

  /* ---------------- legs ---------------- */
  leg('table leg turned wood', (c) =>
    art(c, pal({ d: WOOD, i: lite(WOOD) }), ['.iddd.', '.dddd.', '..dD..', '.iddd.', '.dddD.', '..dD..', '..dD..', '..dD..', '.iddd.', '..dD..', '..dD..', '.yyyY.']),
  );
  leg('stilts grey trousers shoe on a pole', (c) =>
    art(c, pal({ g: CLOTH.slate, u: hex('#1c1a22'), e: WOOD }), ['.gggg.', '.gggg.', '.gGgg.', '.gggg.', '.uuuu.', '.uuuuu', '.eE...', '.eE...', '.eE...', '.eE...', '.eE...', '.uu...']),
  );
  leg('fish for a leg mermaid tail wrong way round', (c) =>
    art(c, pal({ s: SCALE, j: lite(SCALE), b: BELLY, f: hex('#5a8a8a') }), [
      'ff..ff',
      '.ffff.',
      '..ss..',
      '..sS..',
      '.sssS.',
      '.sSss.',
      'ssssSs',
      'sSsssb',
      'ssssbb',
      'swksbf',
      '.sssk.',
      '..bb..',
    ]),
  );
  leg('sky trousers clouds black shoes', (c) => {
    art(c, pal({ s: SKY, j: lite(SKY), c: CLOUD }), ['.jsss.', '.ssss.', '.sccs.', '.cccc.', '.ssss.', '.sssS.', '.sscc.', '.sccc.', '.ssss.', '.ssss.']);
    shoe(c, COAT);
  });
  leg('black suit trousers white spats polished shoes', (c) => {
    art(c, pal({ c: COAT, j: COATL }), ['.jccc.', '.cccc.', '.ccCc.', '.cccc.', '.ccCc.', '.cccc.', '.ccCc.', '.cccc.', '.wwww.', '.wkww.']);
    shoe(c, hex('#1c1a22'));
    c.set(2, 10, WHITE);
    c.set(4, 10, COATL);
  });
  leg('chessboard skirt black white pale legs black shoes', (c) => {
    for (let y = 0; y <= 5; y++) for (let x = 0; x <= 5; x++) c.set(x, y, ((x >> 1) + (y >> 1)) % 2 ? COAT : CLOUD);
    c.rect(2, 6, 3, 9, SKINS.pale);
    c.col(3, 6, 9, dark(SKINS.pale));
    shoe(c, COAT);
    c.clear(1, 10);
  });
};
