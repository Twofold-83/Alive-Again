/* The wild places: hermit, hunter, woodsman, wild child, bog body, stag-skull mask, drowned fisherman, charcoal burner. */
module.exports = (kit, { P, art, blend, C }) => {
  const { SKINS, HAIR, CLOTH, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite } = kit;
  const heads = [], torsos = [], arms = [], legs = [];
  const H = (name, skin, expr, draw, extra) => heads.push({ name, skin, expr, draw, ...extra });
  const S = (name, draw, extra) => heads.push({ name, special: true, draw, ...extra });
  const FUR = C.fur, HIDE = C.hide, OIL = C.oil, PEAT = hex('#5a4028'), WEED = hex('#3a5a3a'), MUD = hex('#4f3e2a'), RUBBER = hex('#3a4a3c');

  /* ---------------- heads ---------------- */
  H('hermit tangled grey beard wild hair twigs tan', 'tan', 'calm', (c, s) => {
    art(c, [
      '...g..g.g..g..',
      '..tggggggggg..',
      '.ggGggggGgtgG.',
      '.ggg......ggG.',
      '.gg........gG.',
      '.gg........GG.',
      '.g..........G.',
      '.gg........GG.',
      '.gggggggggGGG.',
      '.gGgg....ggGG.',
      '.ggggGgggggGG.',
      '..gtggggGggG..',
      '..gGgg.ggmgG..',
    ], P({ g: HAIR.grey, t: hex('#4a3524'), m: C.moss }), 0, 0);
  });
  H('hunter grey fur cap striped tail stubble fair', 'fair', 'calm', (c, s) => {
    art(c, [
      '....ffffff....',
      '...fifffiffF..',
      '..ffffffffffF.',
      '..fifffffiffF.',
      '..ff......fFt.',
      '..f........FT.',
      '............t.',
      '............T.',
      '............t.',
      '...b......b...',
      '....bb..bb....',
    ], P({ f: hex('#6e665a'), i: hex('#8a8272'), t: hex('#8a8272'), T: hex('#3a2c22'), b: mix(s, 0.66) }), 0, 0);
    c.set(7, 7, blend(s, RED, 0.5));
  });
  H('woodsman checked cap thick brown beard fair', 'fair', 'calm', (c, s) => {
    art(c, [
      '....rkrkrk....',
      '...rkrkrkrkR..',
      '..kkkkkkkkkkk.',
      '..h........H..',
      '..h........H..',
      '..h........H..',
      '..hh......HH..',
      '..hhhhhhhhHH..',
      '..hhh....hHH..',
      '..hhhhhhhhHH..',
      '...hhhhhhHH...',
    ], P({ r: C.brick, k: hex('#3a2228'), h: HAIR.brown }), 0, 1);
  });
  const wildchild = (name, skin, hair) =>
    H(name, skin, 'scared', (c, s) => {
      art(c, [
        '..h.m..h..m...',
        '.hhhhmhhhhhh..',
        '.hhmhhhhhmhhH.',
        '.hhhh.hh.hhhH.',
        '.hh.h....h.hH.',
        '.hh........HH.',
        '.h..........H.',
        '.hh.d......H..',
        '..h......d.H..',
        '.hh........HH.',
        '.h..........H.',
      ], P({ h: hair, m: C.moss, d: mix(s, 0.6) }), 0, 0);
    });
  wildchild('wild child matted brown hair leaves dirt tan', 'tan', HAIR.brown);
  wildchild('wild child matted red hair leaves dirt pale', 'pale', HAIR.red);
  const bog = (name, p, hair, moss) =>
    S(name, (c) => {
      art(c, [
        '.....rrr......',
        '....pppppp....',
        '...pipppppp...',
        '..ppppppppP...',
        '..pp##pp##pP..',
        '..ppippppiPP..',
        '..pPppPPppP...',
        '...ppppppPP...',
        '...pp###ppP...',
        '....pp#ppP....',
        '...~=~=~=~=...',
        '.....pp~P.....',
      ], P({ p, i: lite(lite(p)), r: hair || p }), 0, 1);
      if (moss) for (const [x, y] of [[3, 4], [4, 3], [9, 8], [8, 2]]) c.set(x, y, C.moss);
    });
  bog('bog body leathery brown noose red hair', PEAT, hex('#7a3a1e'), false);
  bog('bog body dark mossy noose bald', hex('#3f3a2a'), null, true);
  S('stag skull mask antlers fur hood', (c) => {
    const b = BONE;
    art(c, [
      'b.b........b.b',
      'bbb........bbB',
      '.bb........bB.',
      '..bb.ffff.bB..',
      '..ffbbbbbbff..',
      '..fb##bb##bF..',
      '..fb##bb##bF..',
      '..ffbbbbbBfF..',
      '..ffbbbbbBfF..',
      '...fbb##bBF...',
      '...fbbbbbBF...',
      '....f#bb#F....',
      '.....bbbB.....',
    ], P({ b, f: hex('#3a2c22') }), 0, 0);
  });
  H('drowned fisherman souwester seaweed grey beard drowned', 'drowned', 'hollow', (c, s) => {
    art(c, [
      '.....oooo.....',
      '....oioooo....',
      '...ooooooooO..',
      '.oooooooooooO.',
      '.O.w......w.O.',
      '...w......w...',
      '..........w...',
      '...w..........',
      '...g......g...',
      '...g......g...',
      '....g....g.d..',
      '.....gggg..d..',
    ], P({ o: OIL, i: lite(OIL), w: WEED, g: HAIR.grey, d: hex('#6f8fae') }), 0, 0);
  });
  H('charcoal burner soot black face cloth cap neckerchief fair', 'fair', 'calm', (c, s) => {
    const o = mix(s, 0.38);
    art(c, [
      '....cccccc....',
      '...cicccccc...',
      '..CCCCCCCCCC..',
      '...oo.oo.oo...',
      '...o......o...',
      '...o......o...',
      '...oo.o..oo...',
      '...ooo..ooo...',
      '...oo....oo...',
      '....oooooo....',
      '.....oooo.....',
      '....rrrrrR....',
    ], P({ c: hex('#4a4640'), i: hex('#66625a'), o, r: hex('#7a2a2a') }), 0, 1);
  });
  H('herb woman grey hair feather bones headband brown', 'brown', 'calm', (c, s) => {
    art(c, [
      '.........+....',
      '....gggg.+=...',
      '...ggggggg=...',
      '..ggmmmmmmgG..',
      '..gg......gG..',
      '..g........G..',
      '..g........G..',
      '..~........G..',
      '..g........~..',
      '..g........G..',
      '..gg......GG..',
      '..g~......G...',
    ], P({ g: HAIR.grey, m: C.moss }), 0, 0);
  });
  H('trapper fur hood parka cold red nose woman pale', 'pale', 'calm', (c, s) => {
    const f = hex('#b0a48a');
    art(c, [
      '.....hhhh.....',
      '...hhffffhh...',
      '..hfffiffffh..',
      '.hff......ffH.',
      '.hf........fH.',
      '.hf........FH.',
      '.hf........fH.',
      '.hf...n....FH.',
      '.hf.n....n.fH.',
      '.hff......fFH.',
      '.hhff....fFHH.',
      '..hhffffFFHH..',
      '...hhhhhhHH...',
    ], P({ h: HIDE, f, i: lite(f), n: blend(s, RED, 0.45) }), 0, 0);
  });

  /* ---------------- torsos ---------------- */
  torsos.push({ name: 'fur cloak brown bone clasp tunic', draw(c) {
    art(c, [
      'ffiffffffiff',
      '.fffi~~fffF.',
      '.ffifffffiF.',
      '..fttttttF..',
      '..ftttttfF..',
      '..ttttttTT..',
      '..bbbb~bbB..',
      '..tttttttT..',
      '..tttttttT..',
    ], P({ f: FUR, i: lite(lite(FUR)), t: CLOTH.earth, b: mix(C.leather, 0.6) }), 0, 1);
  } });
  torsos.push({ name: 'oilskin coat ochre toggles wet', draw(c) {
    art(c, [
      '.iooOooOooO.',
      '..oooOOooO..',
      '..oo#~OooO..',
      '..iooOoooO..',
      '..oo#~OooO..',
      '..oooOoooO..',
      '..io#~OooO..',
      '..oooOoooO..',
      '..OOOOOOOO..',
    ], P({ o: OIL, i: lite(OIL) }), 0, 1);
  } });
  torsos.push({ name: 'patched leather jerkin laced grey shirt', draw(c) {
    const sh = hex('#7a766a');
    art(c, [
      '.sjjjkkjjjs.',
      '..jjjssjjJ..',
      '..jjj#sjjJ..',
      '..jppj#jjJ..',
      '..jppjjjjJ..',
      '..jjj#jqqJ..',
      '..jjjj#qqJ..',
      '..bbbbbbbB..',
      '..jjjjjjjJ..',
    ], P({ j: HIDE, s: sh, k: SKINS.fair, p: C.leather, q: hex('#9a8a5a'), b: mix(C.leather, 0.6) }), 0, 1);
  } });
  torsos.push({ name: 'sackcloth sack stencil stripe rope', draw(c) {
    const k = hex('#94845f');
    art(c, [
      '.ikkk##kkkK.',
      '..kkkkkkkK..',
      '..kx.xkxxK..',
      '..kkkkkkkK..',
      '..krrrrrrK..',
      '..~=~=~=~=..',
      '..kkkkkkkK..',
      '..kKkkkKkK..',
      '..k.k.kk.k..',
    ], P({ k, i: lite(k), x: hex('#4a4a52'), r: hex('#8a5a48') }), 0, 1);
    c.set(4, 3, k);
  } });
  torsos.push({ name: 'woodsman plaid shirt dark red braces', draw(c) {
    const r = hex('#7a2a2a');
    for (let y = 1; y <= 9; y++)
      for (let x = y === 1 ? 1 : 2; x <= (y === 1 ? 10 : 9); x++) {
        const a = x % 4 < 2, b = y % 4 < 2;
        c.set(x, y, a && b ? mix(r, 0.4) : a || b ? mix(r, 0.72) : r);
      }
    art(c, ['...l.ss.l...', '...l.S..l...', '...l....l...', '...l....l...', '...l....l...', '...l....l...', '...*....*...'], P({ l: C.leather, s: SKINS.fair }), 0, 1);
    c.col(9, 2, 9, mix(r, 0.45));
  } });
  torsos.push({ name: 'bog body leathery chest ribs rope peat', draw(c) {
    art(c, [
      '.ippp~pppP..',
      '..ppp=pppP..',
      '..pLpL~pLP..',
      '..pppp=ppP..',
      '..pLpLpLpP..',
      '..ppppppP...',
      '..pmpppPP...',
      '..pppmppP...',
      '..pp.ppp....',
    ], P({ p: PEAT, i: lite(PEAT), L: lite(lite(PEAT)), m: C.moss }), 0, 1);
  } });
  torsos.push({ name: 'wild child bare chest leaves bone necklace hide tan', draw(c) {
    const s = SKINS.tan;
    art(c, [
      '.mnsmssmsnm.',
      '..msssssmS..',
      '..s~s~~s~S..',
      '..sss~sssS..',
      '..sdsssssS..',
      '..ssssdssS..',
      '..sssssssS..',
      '..hhhhhhhH..',
      '..hh.hhh.H..',
    ], P({ s, m: C.moss, n: lite(C.moss), d: mix(s, 0.6), h: HIDE }), 0, 1);
  } });
  torsos.push({ name: 'charcoal burner sooty smock leather apron neckerchief', draw(c) {
    const g = hex('#5e584e'), a = hex('#3a3028');
    art(c, [
      '.igggrrgggG.',
      '..gggrrggG..',
      '..goaaaagG..',
      '..gaaaaaaG..',
      '..gaaoaaaG..',
      '..gaaaaaoG..',
      '..oaaaaaaG..',
      '..gaoaaaaG..',
      '..gaaaaaaG..',
    ], P({ g, i: lite(g), a, o: C.soot, r: hex('#7a2a2a') }), 0, 1);
    c.set(3, 4, lite(a));
  } });
  torsos.push({ name: 'drowned fisherman navy jumper torn seaweed net', draw(c) {
    const n = hex('#2a3448');
    art(c, [
      '.innnnnnnnN.',
      '..nwnnn=n=..',
      '..nwwn=n=N..',
      '..nnwnn=n=..',
      '..nnnn=n=N..',
      '..nnwnn=n=..',
      '..nwnnnnnN..',
      '..NnNnNnNN..',
      '..n.nNn.nN..',
    ], P({ n, i: lite(lite(n)), w: WEED, '=': hex('#6a7078') }), 0, 1);
  } });

  /* ---------------- arms ---------------- */
  arms.push({ name: 'fur sleeve brown hide mitten', draw(c) {
    art(c, ['fiffF', '.fifF', '.ffF.', '.ifF.', '.ffF.', '.fiF.', '.ffF.', '.~~=.', '.hhH.', '.hhhH', '.hHH.'], P({ f: FUR, i: lite(lite(FUR)), h: HIDE }));
  } });
  arms.push({ name: 'oilskin ochre sleeve cuff strap wet fair hand', draw(c) {
    art(c, ['.ioO.', '.ooO.', '.ooO.', '.ioO.', '.ooO.', '.ooO.', '.ooO.', '.#o#.', '.OOO.', '.ssS.', '.ssS.'], P({ o: OIL, i: lite(OIL), s: SKINS.fair }));
  } });
  arms.push({ name: 'grey shirt patched sleeve fingerless glove', draw(c) {
    const sh = hex('#7a766a');
    art(c, ['.igG.', '.ggG.', '.ggG.', '.ppG.', '.ppG.', '.ggG.', '.ggG.', '.g.G.', '.wwW.', '.wwW.', '.sSs.'], P({ g: sh, i: lite(sh), p: hex('#9a8a5a'), w: hex('#4a4640'), s: SKINS.fair }));
  } });
  arms.push({ name: 'bare muddy arm scratch tan', draw(c) {
    const s = SKINS.tan;
    art(c, ['.issS', '.sssS', '.ssS.', '.s%S.', '.%sS.', '.smS.', '.msS.', '.mmS.', '.mmM.', '.mmM.', '.mMm.'], P({ s, i: lite(s), m: MUD }));
  } });
  arms.push({ name: 'bog body leathery thin arm rope', draw(c) {
    art(c, ['.ipP.', '.ppP.', '..pP.', '..pP.', '..pP.', '.ppP.', '..pP.', '.~=~.', '..pP.', '.ppP.', '.p.P.'], P({ p: PEAT, i: lite(lite(PEAT)) }));
  } });

  /* ---------------- legs ---------------- */
  legs.push({ name: 'leg wraps cross gartered earth trousers hide shoes', draw(c) {
    art(c, ['.ittT.', '.tttT.', '.tttT.', '.tttT.', '.c#cC.', '.#c#C.', '.c#cC.', '.#c#C.', '.c#cC.', '.hhhH.', '.hhhhh', '.HHHHH'], P({ t: CLOTH.earth, i: lite(CLOTH.earth), c: CLOTH.cream, '#': hex('#4a3524'), h: HIDE }));
  } });
  legs.push({ name: 'ragged breeches bare muddy feet tan', draw(c) {
    const s = SKINS.tan;
    art(c, ['.ikkK.', '.kkkK.', '.kkkK.', '.kkkK.', '.k.kK.', '.sssS.', '.sssS.', '.smsS.', '.mssM.', '.mmsM.', '.mmmmm', '.MmMmM'], P({ k: C.sack, i: lite(C.sack), s, m: MUD }));
  } });
  legs.push({ name: 'fishing waders rubber green wet', draw(c) {
    art(c, ['.#rr#.', '.rrrR.', '.irrR.', '.irrR.', '.rrrR.', '.rrrR.', '.RRRR.', '.rrrR.', '.irrR.', '.rrrR.', '.rrrrr', '.#####'], P({ r: RUBBER, i: lite(lite(RUBBER)) }));
    c.rect(1, 9, 4, 9, hex('#6f8fae')); // the water line
  } });
  legs.push({ name: 'fur leggings hide boots laced hunter', draw(c) {
    art(c, ['.fiffF', '.ffifF', '.fffF.', '.iffF.', '.ffiF.', '.fffF.', '.hhhH.', '.h~hH.', '.hhhH.', '.h~hH.', '.hhhhh', '.HHHHH'], P({ f: FUR, i: lite(lite(FUR)), h: HIDE }));
  } });
  legs.push({ name: 'bog body leathery thin legs peat bare feet', draw(c) {
    art(c, ['.ippP.', '.pppP.', '..pP..', '..pP..', '.ppP..', '..pP..', '..pm..', '..pP..', '..pP..', '..mP..', '.pppp.', '.PpPpP'], P({ p: PEAT, i: lite(lite(PEAT)), m: C.moss }));
  } });

  return { heads, torsos, arms, legs };
};
