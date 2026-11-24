/* DREAM: gentle dream people. 15 heads, 11 torsos, 6 arms, 6 legs. */
module.exports = (kit, tools) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, RED, GOLD, hex, mix, dark, lite, body } = kit;
  const { pal, art, px } = tools;
  const { person, special, torso, arm, leg } = tools.theme('dream');

  const NIGHT = hex('#2b3358'),
    LAV = hex('#8f86a8'),
    MOON = hex('#d6cf9f'),
    CLOUD = hex('#d5d8dc'),
    CSHADE = hex('#a3afc0'),
    SKYB = hex('#6f8fae'),
    FEATHER = hex('#cbc6b6'),
    OWL = hex('#6a5038'),
    SACK = hex('#9c8a62'),
    STAR = hex('#c9b060'),
    TEALC = hex('#2f4e52'),
    DUSK = [hex('#4d3660'), hex('#7c4560'), hex('#a8603e'), hex('#c2a05a')]; // a sky at sunset, from the top down

  /* ---------------- heads ---------------- */
  special('moon face full moon sleepy pale yellow', (c) =>
    art(c, pal({ m: MOON, j: lite(MOON), c: hex('#b3ab7c'), e: hex('#6e6848') }), [
      '..............',
      '.....mmmm.....',
      '...mjjmmmmm...',
      '..mjmmmmcmmm..',
      '..mmmmmmmmmM..',
      '.mmmmmmmmmmMM.',
      '.mmmeemmeemMM.',
      '.mcmmmmmmmmMM.',
      '.mmmemmmmemMM.',
      '..mmmeeeemMM..',
      '..mmmmmmcMMM..',
      '...mmmmMMMM...',
      '.....MMMM.....',
    ]),
  );
  const nightcap = (cap) => (c, s) => {
    art(c, pal({ c: cap, p: CLOUD }), [
      '....cccc......',
      '...cwcwccc....',
      '...cwcwcwccc..',
      '...wwwwwwwWcc.',
      '...........wc.',
      '...........cC.',
      '...........pp.',
      '...........pP.',
    ]);
    px(c, STAR, [[3, 8], [4, 7], [9, 7]]);
  };
  person('sleeper nightcap blue star freckles fair', 'fair', 'calm', nightcap(hex('#3a4a78')));
  person('girl cloud hair white pale', 'pale', 'calm', (c) =>
    art(c, pal({ w: CLOUD, W: CSHADE, b: SKYB }), [
      '...ww..www....',
      '..wwwwwwwwww..',
      '.wwwwwwwwwwww.',
      '.wwwwwwwwwwwW.',
      'wwww......wwWW',
      'www........wWW',
      '.ww........wW.',
      'www........wWW',
      '.Ww........WW.',
      '..W........W..',
      '.b............',
      '............b.',
      '..............',
    ]),
  );
  person('boy paper boat hat white tan black hair', 'tan', 'grin', (c) => {
    art(c, pal({ h: HAIR.black }), ['......ww......', '.....wwWw.....', '.wwwwwwWwwwww.', '..wWWWWWWWWW..', '...h......H...', '...h......H...']);
  });
  special('owl mask brown feathers round eyes beak', (c) =>
    art(c, pal({ o: OWL, t: hex('#b39a70'), e: STAR, b: hex('#a8683e') }), [
      '..o........o..',
      '..oo......oo..',
      '..oooooooooo..',
      '..otttoottto..',
      '..oeeetteeeo..',
      '..oekettekeo..',
      '..oeeebbeeeo..',
      '..otttbBttto..',
      '..ootttttToo..',
      '...ootttToo...',
      '...oOoOoOoo...',
      '....oooooo....',
      '..............',
    ]),
  );
  person('sandman sack hood white beard sand tan', 'tan', 'calm', (c) =>
    art(c, pal({ h: SACK, e: hex('#6a5a3c'), y: STAR }), [
      '..h........h..',
      '..hhhhhhhhhh..',
      '..hhyHhhhhhh..',
      '..hhhHhhhyhH..',
      '..hh......hH..',
      '..h........H..',
      '..h........H..',
      '.yh........H..',
      '..h........H..',
      '..hh......hH..',
      '..hhw....whH..',
      '...ewwwwwwWe..',
      '....ewwwwWe...',
    ]),
  );
  special('faceless friend blank head smile only', (c) =>
    art(c, pal({ f: hex('#cfc6cf'), j: hex('#e4dde2'), e: hex('#4a4352') }), [
      '..............',
      '.....ffff.....',
      '...fjjfffff...',
      '..fjffffffff..',
      '..ffffffffff..',
      '..ffffffffff..',
      '..ffffffffff..',
      '..ffffffffff..',
      '..ffeffffeff..',
      '..fffeeeefff..',
      '...ffffffFF...',
      '....ffffFF....',
      '..............',
    ]),
  );
  person('dreamer eyes closed floating hair pale brown hair', 'pale', 'calm', (c, s) => {
    art(c, pal({ h: HAIR.brown }), [
      '.h..h.h..h.h..',
      '.hh.hhhh.hhh..',
      '..hhhhhhhhhh..',
      'h.hhhhhhhhhh.h',
      'hhhh......hhhh',
      '.hh........hH.',
      '..h........H..',
      '..h........H..',
    ]);
    c.rect(4, 5, 5, 6, s);
    c.rect(8, 5, 9, 6, s);
    const lash = dark(dark(s));
    px(c, lash, [[4, 6], [5, 6], [8, 6], [9, 6], [4, 7], [9, 7]]);
  });
  person('lamplighter flat cap lamp moustache scarf fair grey hair', 'fair', 'calm', (c) =>
    art(c, pal({ c: TEALC, j: lite(TEALC), f: hex('#dba83e'), e: hex('#c8642a'), g: HAIR.grey, m: CLOTH.mustard }), [
      '......f.......',
      '....ccecccc...',
      '...cjccccccc..',
      '..CCCCCCCCCCC.',
      '..............',
      '...g......G...',
      '...g......G...',
      '..............',
      '....gggggG....',
      '..............',
      '..............',
      '...mmmmmmmm...',
      '....mMmmMm....',
    ]),
  );
  person('old woman hair curlers pink pale grey hair', 'pale', 'calm', (c) =>
    art(c, pal({ p: hex('#b08a8a'), g: HAIR.grey }), [
      '......pp......',
      '...pp.pP.pp...',
      '...pPggggpP...',
      '..gggggggggG..',
      '.pp........pp.',
      '.pP........pP.',
      '..g........G..',
    ]),
  );
  person('child sleep mask pushed up brown black curls', 'brown', 'calm', (c) => {
    HAIRS.curls(c, HAIR.black);
    art(c, pal({ m: hex('#5d4470') }), ['..mmmmmmmmmm..', '..MmwwmmwwmM..'], 0, 2);
  });
  person('girl night sky hair stars moon brown long hair', 'brown', 'calm', (c) => {
    HAIRS.long(c, NIGHT);
    px(c, STAR, [[4, 1], [9, 2], [2, 6], [11, 8], [2, 9], [11, 4]]);
    px(c, MOON, [[7, 1], [6, 2], [7, 3]]);
  });
  person('boy saucepan helmet fair blond hair', 'fair', 'calm', (c) =>
    art(c, pal({ p: hex('#7c7e86'), j: hex('#a2a4aa'), h: HAIR.blond }), [
      '....pppppp....',
      '...pjjppppp...',
      '...pjppppppP..',
      '..PPPPPPPPPPkk',
      '...hh.h...H...',
      '...h......H...',
    ]),
  );
  person('sleeper nightcap plum star freckles brown', 'brown', 'calm', nightcap(hex('#5d4470')));
  person('girl paper crown yellow tan brown pigtails', 'tan', 'grin', (c) => {
    HAIRS.pigtails(c, HAIR.brown);
    art(c, pal({ p: hex('#cdbf7a'), b: SKYB }), ['...p..pp..p...', '...pp.pp.pp...', '...pppppppP...', '...prppbpprP..'], 0, 0);
    c.clear(11, 3);
  });

  /* ---------------- torsos ---------------- */
  const gown = (col, star) => (c) =>
    art(c, pal({ g: col, j: lite(col), s: star }), [
      '............',
      '.jggwwwwggg.',
      '..jgwWWwgg..',
      '..gsgwwggg..',
      '..ggggsgGg..',
      '..gGgggggg..',
      '.gggsgGggsg.',
      '.ggGggggggg.',
      '.sgggggsGgg.',
      '.gggGsgggGg.',
      '............',
    ]);
  torso('nightgown lavender gold stars', gown(LAV, STAR));
  torso('nightgown night blue silver stars', gown(NIGHT, CLOUD));
  const pyjama = (col) => (c) => {
    body(c, hex('#d2ccbb'));
    for (const x of [2, 4, 7, 9]) c.col(x, 2, 9, col);
    c.set(1, 1, col);
    c.set(3, 1, col);
    c.set(8, 1, col);
    c.set(10, 1, col);
    c.col(9, 2, 9, dark(col));
    px(c, col, [[4, 1], [7, 1], [5, 2], [6, 2]]);
    px(c, dark(col), [[5, 4], [5, 6], [5, 8]]);
    c.row(5, 7, 8, dark(col));
  };
  torso('pyjamas striped blue buttons', pyjama(hex('#51688c')));
  torso('pyjamas striped wine buttons', pyjama(CLOTH.wine));
  torso('coat of sky sunset cloud star', (c) => {
    body(c, DUSK[0]);
    c.rect(2, 3, 9, 4, DUSK[1]);
    c.rect(2, 5, 9, 6, DUSK[2]);
    c.rect(2, 7, 9, 9, DUSK[3]);
    c.col(5, 2, 9, dark(DUSK[1]));
    px(c, lite(DUSK[0]), [[1, 1], [4, 1], [7, 1]]);
    px(c, CLOUD, [[6, 4], [7, 4], [8, 4], [7, 3]]);
    px(c, CSHADE, [[8, 5], [7, 5]]);
    px(c, STAR, [[3, 2], [8, 1]]);
    px(c, hex('#d8c27a'), [[3, 8], [4, 8], [3, 7]]);
  });
  torso('cardigan of feathers white lavender shirt', (c) =>
    art(c, pal({ f: FEATHER, j: lite(FEATHER), l: LAV }), [
      '............',
      '.jfffllffff.',
      '..FfFllFfF..',
      '..ffflLfff..',
      '..fFfllfFf..',
      '..ffflLfff..',
      '..FfFllFfF..',
      '..ffflLfff..',
      '..fFfllfFf..',
      '..f.FllF.f..',
      '............',
    ]),
  );
  torso('owl feather cloak brown speckled breast', (c) =>
    art(c, pal({ o: OWL, j: lite(OWL), t: hex('#b39a70') }), [
      '............',
      '.joottttooo.',
      '..oottttoo..',
      '..ootOOtoo..',
      '..oottttoo..',
      '..ooOttOoo..',
      '.oootttOooo.',
      '.oOotOttoOo.',
      '.ooOttttOoo.',
      '.oO.oOOo.Oo.',
      '............',
    ]),
  );
  torso('sandman sackcloth tunic rope sand pouch', (c) =>
    art(c, pal({ h: SACK, j: lite(SACK), e: hex('#6a5a3c'), p: hex('#4a3a2c'), s: STAR }), [
      '............',
      '.jhhhhhhhhh.',
      '..jhhHHhhh..',
      '..hhhhHhhh..',
      '..hhhhhhkh..',
      '..hHhhhkhk..',
      '..eeeeeeee..',
      '..hpphhhEh..',
      '..hpPshhhh..',
      '..hhhshHhh..',
      '............',
    ]),
  );
  torso('lamplighter coat dark teal brass buttons mustard scarf', (c) =>
    art(c, pal({ c: TEALC, j: lite(TEALC), m: CLOTH.mustard, e: hex('#2a2422') }), [
      '............',
      '.jccmmmmccc.',
      '..jccmMccc..',
      '..cyccmcyc..',
      '..ccccmMcc..',
      '..cyccCcyc..',
      '..ccccCccc..',
      '..eeeeyeee..',
      '..ccccCccc..',
      '..ccccCccc..',
      '............',
    ]),
  );
  torso('quilt blanket wrapped patchwork squares', (c) =>
    art(c, pal({ a: CLOTH.wine, b: hex('#51688c'), m: CLOTH.mustard, f: CLOTH.forest, c: CLOTH.cream, l: LAV }), [
      '............',
      'aabbccmmffl.',
      'aabbccmmffll',
      '.mmffaallbb.',
      '.mmffaallbb.',
      '.ccllbbmmaa.',
      '.ccllbbmmaa.',
      '.ffaammccll.',
      '.ffaammccll.',
      '.bbmmllffcc.',
      '............',
    ]),
  );
  torso('knitted jumper slate blue crescent moon', (c) =>
    art(c, pal({ b: hex('#4a5878'), j: hex('#6676a0'), m: MOON }), [
      '............',
      '.jbbbBBbbbb.',
      '..jbbbbbbb..',
      '..bbbmmbbb..',
      '..bbmmbbbb..',
      '..bbmmbbmb..',
      '..bbmmbbbb..',
      '..bbbmmbbb..',
      '..BbBbBbBb..',
      '..BbBbBbBb..',
      '............',
    ]),
  );

  /* ---------------- arms ---------------- */
  arm('sleeve ending in a bird white blue bird hand', (c) =>
    art(c, pal({ a: hex('#cfcabb'), b: SKYB, j: lite(SKYB) }), ['.aaa.', '.aaa.', '.aAa.', '.aaa.', '.aaa.', '.aAa.', 'aaaaa', '.bbb.', 'bjBb.', 'ybkb.', '.bbb.', '..b..']),
  );
  arm('nightgown sleeve lavender star frill pale hand', (c) =>
    art(c, pal({ g: LAV, j: lite(LAV), s: SKINS.pale, t: STAR }), ['jgggg', 'ggggg', '.ggg.', '.gtg.', '.ggg.', '.gGg.', '.ggg.', '.tgg.', 'wwwww', '.sss.', '.sss.', '.....']),
  );
  arm('pyjama sleeve striped blue fair hand', (c) =>
    art(c, pal({ p: hex('#51688c'), c: hex('#d2ccbb'), s: SKINS.fair }), ['.pcp.', '.pcp.', '.pcp.', '.pcp.', '.pcp.', '.pcp.', '.pcp.', '.pcp.', '.ppp.', '.sss.', '.sss.', '.....']),
  );
  arm('feather sleeve white pale hand', (c) =>
    art(c, pal({ f: FEATHER, j: lite(FEATHER), s: SKINS.pale }), ['.jff.', '.FfF.', 'ffff.', '.fFf.', '.ffff', '.FfF.', 'ffff.', '.fFf.', '.f.F.', '.sss.', '.sss.', '.....']),
  );
  arm('sky sleeve sunset tan hand', (c) => {
    c.rect(1, 0, 3, 1, DUSK[0]);
    c.rect(1, 2, 3, 3, DUSK[1]);
    c.rect(1, 4, 3, 5, DUSK[2]);
    c.rect(1, 6, 3, 8, DUSK[3]);
    c.set(1, 0, lite(DUSK[0]));
    px(c, CLOUD, [[1, 3], [2, 3]]);
    px(c, STAR, [[2, 1]]);
    c.rect(1, 9, 3, 10, SKINS.tan);
  });
  arm('sackcloth sleeve sand trickling from hand tan', (c) =>
    art(c, pal({ h: SACK, j: lite(SACK), e: hex('#6a5a3c'), s: SKINS.tan, t: STAR }), ['.jhh.', '.hhh.', '.hHh.', '.hhh.', '.hhh.', '.hHh.', '.eee.', '.sss.', '.sss.', '.sss.', '.sts.', '.t.t.']),
  );

  /* ---------------- legs ---------------- */
  leg('pyjama trousers striped blue fluffy slippers', (c) =>
    art(c, pal({ p: hex('#51688c'), c: hex('#d2ccbb'), f: FEATHER, q: CLOTH.rust }), [
      '.pcpc.',
      '.pcpc.',
      '.pcpc.',
      '.pcpc.',
      '.pcpc.',
      '.pcpc.',
      '.pcpc.',
      '.pcpc.',
      '.pcpc.',
      '.ffff.',
      'ffffqq',
      'fFFFFq',
    ]),
  );
  leg('cloud trousers white puffs bare feet pale', (c) =>
    art(c, pal({ w: CLOUD, W: CSHADE, s: SKINS.pale }), [
      '.wwww.',
      'wwwwww',
      'wwwwWw',
      '.wwWW.',
      'wwwww.',
      'wwwwww',
      'wwwWWw',
      '.wWWW.',
      '..ss..',
      '..ss..',
      '.sss..',
      '.sssss',
    ]),
  );
  leg('nightgown hem lavender stars bare toes pale', (c) =>
    art(c, pal({ g: LAV, j: lite(LAV), t: STAR, s: SKINS.pale }), [
      'gjgggg',
      'ggggGg',
      'gtgGgg',
      'gggGgg',
      'gggGtg',
      'ggGggg',
      'ggGggg',
      'tgGggg',
      'ggggtg',
      'wwwwww',
      '..sss.',
      '..ssss',
    ]),
  );
  leg('sky trousers sunset soft shoes', (c) => {
    c.rect(1, 0, 4, 2, DUSK[0]);
    c.rect(1, 3, 4, 5, DUSK[1]);
    c.rect(1, 6, 4, 7, DUSK[2]);
    c.rect(1, 8, 4, 9, DUSK[3]);
    c.set(1, 0, lite(DUSK[0]));
    px(c, CLOUD, [[2, 4], [3, 4], [3, 3]]);
    px(c, STAR, [[2, 1], [4, 2]]);
    c.rect(1, 10, 4, 11, DUSK[0]);
    c.set(5, 11, DUSK[0]);
    c.row(11, 1, 4, dark(DUSK[0]));
  });
  leg('owl legs brown feathers talons', (c) =>
    art(c, pal({ o: OWL, j: lite(OWL), t: hex('#b39a70'), e: STAR }), [
      '.joto.',
      'ootOoo',
      'oOtooo',
      'ootOo.',
      '.oOto.',
      '.ooo..',
      '..eE..',
      '..eE..',
      '..eE..',
      '..eE..',
      '.eeeEe',
      '.k.k.k',
    ]),
  );
  leg('nightshirt hem white striped bed socks wine', (c) =>
    art(c, pal({ a: hex('#cfcabb'), q: CLOTH.wine, c: CLOTH.cream, s: SKINS.fair }), [
      'aaaaaa',
      'aaaAaa',
      'aaaAaa',
      'aaAaaa',
      '.ssss.',
      '.ssss.',
      '.qqqq.',
      '.cccc.',
      '.qqqq.',
      '.cccc.',
      '.qqqq.',
      '.ccccq',
    ]),
  );
};
