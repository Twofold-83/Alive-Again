/* The old village: innkeeper, miller, baker, elder, gossip, smith, beggar, town crier, midwife ... */
module.exports = (kit, { P, art, blend, C }) => {
  const { SKINS, HAIR, CLOTH, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, shoe } = kit;
  const heads = [], torsos = [], arms = [], legs = [];
  const H = (name, skin, expr, draw, extra) => heads.push({ name, skin, expr, draw, ...extra });

  /* ---------------- heads ---------------- */
  H('innkeeper red face balding brown hair fair', 'fair', 'grin', (c, s) => {
    const red = blend(s, RED, 0.45);
    art(c, [
      '...h......H...',
      '..hh......HH..',
      '..hh......HH..',
      '..............',
      '...cc.cc.cc...',
      '....c....c....',
      '..............',
      '..............',
      '....ssssSS....',
      '.....sssS.....',
    ], P({ h: HAIR.brown, c: red, s }), 0, 3);
  });
  H('miller white cap flour dusted pale', 'pale', 'calm', (c, s) => {
    art(c, [
      '....+++++=....',
      '...+++++++==..',
      '...++++++++==.',
      '...g......G.=.',
      '...g..+.......',
      '..............',
      '....+.....+...',
      '.........+....',
      '..............',
      '....+.........',
    ], P({ g: blend(HAIR.brown, WHITE, 0.55) }), 0, 1);
  });
  H('baker cap white moustache brown hair tan', 'tan', 'calm', (c, s) => {
    art(c, [
      '....++++++....',
      '...++=++=+=...',
      '....+=++=+....',
      '...+++++++=...',
      '...h......H...',
      '..............',
      '..............',
      '..............',
      '....hhhhhh....',
      '....h....h....',
    ], P({ h: HAIR.brown }), 0, 0);
  });
  H('village elder bald long white beard fair', 'fair', 'calm', (c, s) => {
    art(c, [
      '..w........W..',
      '..w........W..',
      '..w........W..',
      '..ww......WW..',
      '..wwwwwwwwWW..',
      '..www....wWW..',
      '...wwwwwwwW...',
      '...wwwwwwwW...',
      '....wwwwwW....',
    ], P({ w: HAIR.white }), 0, 4);
    c.set(5, 4, dark(s));
    c.set(6, 4, dark(s));
    c.set(8, 4, dark(s));
  });
  H('gossip wimple white woman pale', 'pale', 'grin', (c, s) => {
    art(c, [
      '....++++++....',
      '...++++++++...',
      '..+++++++++=..',
      '..++......+=..',
      '..++......+=..',
      '..++......+=..',
      '..++......+=..',
      '..++......+=..',
      '..++......+=..',
      '..+++....++=..',
      '...++....+=...',
      '....++++==....',
    ], P(), 0, 1);
    c.set(9, 8, dark(dark(s)));
  });
  H('smith leather cap soot stubble tan', 'tan', 'angry', (c, s) => {
    const st = mix(s, 0.6);
    art(c, [
      '....llllll....',
      '...lillllllL..',
      '..ll......LL..',
      '..ll......LL..',
      '..l........L..',
      '..l.o......L..',
      '.........o....',
      '...b......b...',
      '....bbbbbb....',
      '.....bbbb.....',
    ], P({ l: C.leather, i: lite(C.leather), b: st, o: mix(s, 0.45) }), 0, 2);
  });
  H('beggar bandaged eye grey matted hair tan', 'tan', 'weeping', (c, s) => {
    art(c, [
      '...g.g..g.....',
      '..gggggggg.g..',
      '..gggg~~gggG..',
      '..g....~~~.G..',
      '..g.....~~bG..',
      '........~%b...',
      '..g........G..',
      '..............',
      '...t......t...',
      '....t....t....',
      '.....tttt.....',
    ], P({ g: HAIR.grey, b: dark(BONE), t: mix(s, 0.62) }), 0, 1);
  });
  H('town crier tricorn hat black white wig fair', 'fair', 'scared', (c, s) => {
    art(c, [
      '#....####....#',
      '##.########.##',
      '.############.',
      '...********...',
      '..+........=..',
      '.++........==.',
      '..+........=..',
      '.++........==.',
      '..+........=..',
    ], P(), 0, 0);
  });
  H('midwife linen coif black hair woman brown', 'brown', 'calm', (c, s) => {
    art(c, [
      '....cccccc....',
      '...ccccccccC..',
      '..cchhhhhhcC..',
      '..cc......cC..',
      '..c........C..',
      '..c........C..',
      '..c........C..',
      '..............',
      '..............',
      '...c......C...',
      '....c....C....',
      '.....ccCC.....',
    ], P({ c: CLOTH.cream, h: HAIR.black }), 0, 1);
  });
  H('village girl red kerchief blond plait fair', 'fair', 'calm', (c, s) => {
    art(c, [
      '.....kkkk.....',
      '...kkkkkkkk...',
      '..kkkkkkkkkK..',
      '..kbbbb..bbK..',
      '..k........K..',
      '..b........b..',
      '...........bb.',
      '............B.',
      '...........bb.',
      '............B.',
      '...........b!.',
    ], P({ k: hex('#8a3a30'), b: HAIR.blond }), 0, 1);
  });
  H('village lad green felt hat feather straw hair tan', 'tan', 'grin', (c, s) => {
    art(c, [
      '......ff...!..',
      '.....ffff.!...',
      '...ffffffFF...',
      '.ffffffffffF..',
      '...h......H...',
      '...h......H...',
      '..............',
      '....o.........',
      '.........o....',
    ], P({ f: CLOTH.forest, h: C.straw, o: dark(s) }), 0, 0);
  });
  H('old crone shawl grey hair wart woman pale', 'pale', 'hollow', (c, s) => {
    art(c, [
      '....pppppp....',
      '...pppppppp...',
      '..ppppppppppP.',
      '..ppgg...gpPP.',
      '..pp......pP..',
      '..pp......pP..',
      '..pp......pP..',
      '..pp......PP..',
      '..ppp....pPP..',
      '..ppp....ppP..',
      '.pppp....pppP.',
      '.pppppPPppppP.',
    ], P({ p: CLOTH.slate, g: HAIR.grey }), 0, 1);
    c.set(9, 8, dark(dark(s)));
    c.set(7, 8, dark(s));
  });
  H('drunk chaperon hood mustard red nose fair', 'fair', 'calm', (c, s) => {
    art(c, [
      '....mmmmmm....',
      '...mmmmmmmmm..',
      '..mmmmmmmmmmM.',
      '.mmm......mMM.',
      'mmm........mM.',
      'mm.........mM.',
      'mm....nn...mM.',
      'mM..n....n.MM.',
      'mM.........M..',
      'mM............',
      '.m............',
      '.M............',
    ], P({ m: CLOTH.mustard, n: blend(s, RED, 0.55) }), 0, 1);
    c.row(6, 4, 5, dark(s)); // heavy lids
    c.row(6, 8, 9, dark(s));
    c.set(5, 6, K);
    c.set(8, 6, K);
  });

  /* ---------------- torsos ---------------- */
  const tunic = (name, col, skin) =>
    torsos.push({ name, draw(c) {
      art(c, [
        '.itttsstttT.',
        '..ittsstTT..',
        '..ttt##ttT..',
        '..tttttttT..',
        '..tttttttT..',
        '..tttttttT..',
        '..bbb*bbbB..',
        '..tttttttT..',
        '..tTttTttT..',
      ], P({ t: col, i: lite(col), s: skin, b: dark(C.leather) }), 0, 1);
    } });
  tunic('tunic belt earth brown', CLOTH.earth, SKINS.fair);
  tunic('tunic belt forest green', CLOTH.forest, SKINS.tan);
  const bodice = (name, col, skin) =>
    torsos.push({ name, draw(c) {
      art(c, [
        '.ccccsscccC.',
        '..wccssccW..',
        '..wwccccwW..',
        '..www+WwwW..',
        '..wwwW+wwW..',
        '..www+WwwW..',
        '..wwwW+wwW..',
        '..www+WwwW..',
        '..wwwwwwwW..',
      ], P({ c: CLOTH.cream, w: col, s: skin }), 0, 1);
    } });
  bodice('laced bodice wine blouse cream', CLOTH.wine, SKINS.pale);
  bodice('laced bodice teal blouse cream', CLOTH.teal, SKINS.brown);
  torsos.push({ name: 'leather apron smith bare shoulders tan', draw(c) {
    art(c, [
      '.issaSSassS.',
      '..ssaaaasS..',
      '..ssaaaasS..',
      '..saaaaaaS..',
      '..aa#aaaaA..',
      '..aaaaaaaA..',
      '..AAAAAAAA..',
      '..aaaaa#aA..',
      '..aaaaaaaA..',
    ], P({ s: SKINS.tan, i: lite(SKINS.tan), a: C.leather }), 0, 1);
    c.set(4, 2, lite(C.leather));
    c.set(7, 2, lite(C.leather));
  } });
  torsos.push({ name: 'patched cloak grey brown clasp', draw(c) {
    const cl = hex('#5d564a');
    art(c, [
      '.icccc*cccC.',
      '..ccc##ccC..',
      '..ccc#tccC..',
      '..cc#ttcrC..',
      '..mm#ttcrC..',
      '..mm#ttccC..',
      '..cc#ttccC..',
      '..c#tttTcC..',
      '..c#tttTcC..',
    ], P({ c: cl, i: lite(cl), t: CLOTH.earth, m: dark(CLOTH.mustard), r: dark(CLOTH.rust) }), 0, 1);
  } });
  torsos.push({ name: 'baker apron white blue shirt flour', draw(c) {
    const sh = hex('#5a6a80');
    art(c, [
      '.ibb+ss+bbB.',
      '..bb+bb+bB..',
      '..b++++++B..',
      '..b++++++B..',
      '..b++++++B..',
      '..=======B..',
      '..b++==++B..',
      '..b++==++B..',
      '..b++++++B..',
    ], P({ b: sh, i: lite(sh), s: SKINS.tan }), 0, 1);
  } });
  torsos.push({ name: 'innkeeper waistcoat belly apron stained', draw(c) {
    art(c, [
      '.vvccsscccV.',
      '..vvccccvV..',
      '..vvc*ccvV..',
      '..vvccccvV..',
      '.vvvc*ccvvV.',
      '.aaaaaaaaaA.',
      '.aaaaaaa*aA.',
      '.aa%aaaa*aA.',
      '.aaa%aaaaaA.',
    ], P({ v: CLOTH.earth, c: CLOTH.cream, s: SKINS.fair, a: hex('#b0a688') }), 0, 1);
  } });
  torsos.push({ name: 'town crier coat red gold buttons jabot', draw(c) {
    art(c, [
      '.*rrr++rrr*.',
      '..rrr++rrR..',
      '..r*r+=r*R..',
      '..rrrr#rrR..',
      '..r*rr#r*R..',
      '..rrrr#rrR..',
      '..r*rr#r*R..',
      '..rrrr#rrR..',
      '..rrrr#rrR..',
    ], P({ r: C.brick }), 0, 1);
  } });
  torsos.push({ name: 'beggar rags sackcloth rope bare shoulder', draw(c) {
    art(c, [
      '.ikkkkkksS..',
      '..kkkkksS...',
      '..kkskkkK...',
      '..kkkkkkkK..',
      '..kkkkppkK..',
      '..~=~=~=~=..',
      '..kkkkkkkK..',
      '..kskkkkkK..',
      '..k.kk.kk...',
    ], P({ k: C.sack, i: lite(C.sack), s: SKINS.tan, p: dark(CLOTH.rust) }), 0, 1);
  } });

  /* ---------------- arms ---------------- */
  arms.push({ name: 'tunic sleeve earth brown cream cuff fair hand', draw(c) {
    art(c, ['.itT.', '.ttT.', '.ttT.', '.ttT.', '.ttT.', '.ttT.', '.TTT.', '.ccC.', '.ccC.', '.ssS.', '.ssS.'],
      P({ t: CLOTH.earth, i: lite(CLOTH.earth), c: CLOTH.cream, s: SKINS.fair }));
  } });
  arms.push({ name: 'blouse cream puffed sleeve rolled pale arm', draw(c) {
    art(c, ['.ccC.', 'ccccC', 'ccccC', '.ccC.', '.CCC.', '.ssS.', '.ssS.', '.ssS.', '.ssS.', '.ssS.', '.ssS.'],
      P({ c: CLOTH.cream, s: SKINS.pale }));
  } });
  arms.push({ name: 'smith bare arm soot leather wristband tan', draw(c) {
    art(c, ['.issS', '.sssS', '.ssS.', '.sSS.', '.ssS.', '.osS.', '.ssS.', '.lll.', '.lLL.', '.sSS.', '.SoS.'],
      P({ s: SKINS.tan, i: lite(SKINS.tan), o: mix(SKINS.tan, 0.45), l: C.leather }));
  } });
  arms.push({ name: 'patched cloak sleeve grey brown torn fair hand', draw(c) {
    const cl = hex('#5d564a');
    art(c, ['.icC.', '.ccC.', '.ccC.', '.mmC.', '.mmC.', '.ccC.', '.ccC.', '.ccC.', '.c.C.', '.ssS.', '.ssS.'],
      P({ c: cl, i: lite(cl), m: dark(CLOTH.mustard), s: SKINS.fair }));
  } });
  arms.push({ name: 'town crier red sleeve gold cuff lace fair hand', draw(c) {
    art(c, ['.*r*.', '.rrR.', '.rrR.', '.rrR.', '.rrR.', '.rrR.', '.***.', '.***.', '.+=+.', '.ssS.', '.ssS.'],
      P({ r: C.brick, s: SKINS.fair }));
  } });
  arms.push({ name: 'beggar rag sleeve bandaged hand tan', draw(c) {
    art(c, ['.ikK.', '.kkK.', '.kkK.', '.kkK.', '.k.K.', '.ssS.', '.ssS.', '.ssS.', '.~~=.', '.~%=.', '.~~=.'],
      P({ k: C.sack, i: lite(C.sack), s: SKINS.tan }));
  } });

  /* ---------------- legs ---------------- */
  const turn = (c) => { // a soft turn-shoe, the top folded down at the ankle
    art(c, ['.llll.', '.lllL.', '.LLLLL'], P({ l: C.leather }), 0, 9);
  };
  const hose = (name, col) =>
    legs.push({ name, draw(c) {
      c.rect(1, 0, 4, 9, col);
      c.col(4, 0, 9, dark(col));
      c.set(1, 0, lite(col));
      c.set(2, 5, dark(col)); // the knee
      turn(c);
    } });
  hose('hose mustard turn-shoes leather', CLOTH.mustard);
  hose('hose slate grey turn-shoes leather', CLOTH.slate);
  legs.push({ name: 'breeches earth wool stockings wooden clogs', draw(c) {
    art(c, ['.ibbB.', '.bbbB.', '.bbbB.', '.bbbB.', '.BBBB.', '.cccC.', '.cCcC.', '.cccC.', '.cCcC.', '.cccC.', '.wwww.', '.wwwwW', '.WWWWW'].slice(0, 12),
      P({ b: CLOTH.earth, i: lite(CLOTH.earth), c: CLOTH.cream, w: C.wood }));
    c.set(5, 10, C.wood);
  } });
  legs.push({ name: 'long skirt wine clogs woman', draw(c) {
    art(c, ['.wwwwW', '.wwwwW', 'wwwwwW', 'wwWwwW', 'wwWwwW', 'wwWwwW', 'wwWwwW', 'wwWwwW', 'wwWwwW', 'WWWWWW', '..oooo', '..OOOO'],
      P({ w: CLOTH.wine, o: C.wood }));
  } });
  legs.push({ name: 'skirt slate apron cream turn-shoes woman', draw(c) {
    art(c, ['.ccccS', '.ccccS', '.ccccS', 'scccCS', 'scccCS', 'scccCS', 'ssCCsS', 'sssssS', 'SSSSSS', '..kk..', '..ll..', '..LLLL'],
      P({ s: CLOTH.slate, c: hex('#b0a688'), l: C.leather, k: SKINS.pale }));
  } });
  legs.push({ name: 'beggar ragged breeches bare dirty feet tan', draw(c) {
    art(c, ['.ikkK.', '.kkkK.', '.kkkK.', '.kpkK.', '.kkkK.', '.k.kK.', '.ssk..', '.ssS..', '.sdS..', '.ssS..', '.sdss.', '.dssdS'],
      P({ k: C.sack, i: lite(C.sack), p: dark(CLOTH.rust), s: SKINS.tan, d: mix(SKINS.tan, 0.55) }));
  } });

  return { heads, torsos, arms, legs };
};
