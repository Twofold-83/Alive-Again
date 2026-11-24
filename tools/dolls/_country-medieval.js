/* Castle and town of the middle ages: king and queen, knights, squire, monk, jester, executioner, minstrel, nun. */
module.exports = (kit, { P, art, blend, C }) => {
  const { SKINS, HAIR, CLOTH, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, shoe } = kit;
  const heads = [], torsos = [], arms = [], legs = [];
  const H = (name, skin, expr, draw, extra) => heads.push({ name, skin, expr, draw, ...extra });
  const S = (name, draw, extra) => heads.push({ name, special: true, draw, ...extra });
  const STEEL = C.steel, IRON = C.iron, PURPLE = C.purple, HABIT = hex('#5e4632'), NIGHT = hex('#2a2630');
  /** chain mail: a dither of two greys */
  const mail = (c, x0, y0, x1, y1) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) c.set(x, y, (x + y) % 2 ? IRON : STEEL);
  };

  /* ---------------- heads ---------------- */
  const king = (name, skin, expr, hair, jewel) =>
    H(name, skin, expr, (c, s) => {
      art(c, [
        '...*..**..*...',
        '...*i******...',
        '...*j*jj*j*G..',
        '...hhhhhhhhH..',
        '..hh......HH..',
        '..h........H..',
        '..h........H..',
        '..hh......HH..',
        '..hhhhhhhhHH..',
        '..hhh....hHH..',
        '...hhhhhhhH...',
        '....hhhhhH....',
        '.....hhHH.....',
      ], P({ h: hair, i: lite(GOLD), j: jewel, G: dark(GOLD) }), 0, 0);
    });
  king('king crown gold brown beard fair', 'fair', 'calm', HAIR.brown, RED);
  king('old king crown white beard pale', 'pale', 'hollow', HAIR.white, hex('#3f6a6e'));
  H('queen hennin wine veil blond hair woman pale', 'pale', 'calm', (c, s) => {
    art(c, [
      '......ww..v...',
      '.....wwwW.vv..',
      '....wwwwwW.v..',
      '...********.v.',
      '..b........bv.',
      '..b.........v.',
      '............v.',
      '............V.',
      '............v.',
      '............V.',
    ], P({ w: CLOTH.wine, b: HAIR.blond, v: hex('#b9b4a6') }), 0, 0);
    c.set(4, 3, lite(GOLD));
  });
  H('lady horned headdress teal gold veil woman brown', 'brown', 'calm', (c, s) => {
    art(c, [
      '..tt......tt..',
      '.tttt....tttT.',
      '.t*ttt..ttt*T.',
      '..tt*tttt*tT..',
      '..+t......T=..',
      '..+........=..',
      '..+........=..',
      '..+........=..',
      '..+........=..',
    ], P({ t: CLOTH.teal }), 0, 0);
  });
  const greathelm = (name, col, cross, plume) =>
    S(name, (c) => {
      art(c, [
        '....aaaaaa....',
        '...iaaaaaaA...',
        '...aaaxxaaA...',
        '...aaaxxaaA...',
        '...a##xx##A...',
        '...xxxxxxxX...',
        '...aaaxxaaA...',
        '...a#axxa#A...',
        '...aa#xx#aA...',
        '...a#axxa#A...',
        '...aaaxxaaA...',
        '...AAAAAAAA...',
      ], P({ a: col, i: lite(col), x: cross }), 0, 1);
      if (plume) art(c, ['.....pp.......', '....ppPp......'], P({ p: plume }), 0, 0);
    });
  greathelm('knight great helm steel brass cross', STEEL, hex('#a8853a'), null);
  greathelm('black knight great helm iron red plume', hex('#3c3e46'), hex('#6b6f78'), C.brick);
  H('knight helmet visor up mail coif moustache tan', 'tan', 'calm', (c, s) => {
    art(c, [
      '.....aaaa.....',
      '...iaaaaaaA...',
      '..a#a#aa#a#A..',
      '..aaaaaaaaaA..',
      '..aa......aA..',
      '..aa......aA..',
      '..m........M..',
      '..m........M..',
      '..mm.hhhh.mM..',
      '..mm......mM..',
      '..mmm....mmM..',
      '...mmm..mmM...',
      '....mmmmmM....',
    ], P({ a: STEEL, i: lite(STEEL), m: IRON, h: HAIR.black }), 0, 0);
    for (const [x, y] of [[3, 7], [2, 8], [3, 9], [2, 10], [3, 11], [10, 9], [5, 11], [6, 12], [8, 12], [9, 11], [4, 12]]) c.set(x, y, STEEL);
  });
  H('squire bowl cut blond hair young fair', 'fair', 'calm', (c, s) => {
    art(c, [
      '....bbbbbb....',
      '...bbibbbbb...',
      '..bbbbbbbbbB..',
      '..bbbbbbbbbB..',
      '..bb......bB..',
      '..b........B..',
    ], P({ b: HAIR.blond, i: lite(HAIR.blond) }), 0, 1);
    c.set(4, 8, blend(s, RED, 0.3));
    c.set(9, 8, blend(s, RED, 0.3));
  });
  H('monk tonsure brown hair cowl tan', 'tan', 'calm', (c, s) => {
    art(c, [
      '....sissss....',
      '..hh......HH..',
      '..hh......HH..',
      '..hh......HH..',
      '..h........H..',
      '..............',
      '..............',
      '..............',
      '..............',
      '.cc........CC.',
      '.cccc....cCCC.',
    ], P({ h: HAIR.brown, s, i: lite(s), c: HABIT }), 0, 2);
  });
  H('jester belled cap wine mustard grin pale', 'pale', 'grin', (c, s) => {
    art(c, [
      '.*..........*.',
      '.ww..wwmm..mm.',
      '..wwwwwmmmmm..',
      '..wwwwwmmmmmM.',
      '..w........M..',
      '..*........*..',
      '..............',
      '....r....r....',
      '..............',
      '..............',
      '..............',
      '..............',
      '...+=+=+=+=...',
    ], P({ w: CLOTH.wine, m: CLOTH.mustard, r: blend(s, RED, 0.6) }), 0, 0);
  });
  S('executioner hood black eye holes', (c) => {
    const sk = SKINS.fair;
    art(c, [
      '......kk......',
      '.....kikk.....',
      '....kkkkkk....',
      '...kikkkkkk...',
      '...kkkkkkkK...',
      '...kssKKsskK..',
      '...ks#kk#skK..',
      '...kkkkkkkK...',
      '...kkkkkkkK...',
      '...kkkKkkkK...',
      '..kkkkkkkkkK..',
      '.kkkkkKkkkkkK.',
      '.kkkKkkkkKkkK.',
    ], P({ k: NIGHT, i: lite(lite(NIGHT)), s: sk }), 0, 0);
  });
  H('minstrel teal beret feather long brown hair goatee fair', 'fair', 'grin', (c, s) => {
    art(c, [
      '..........+...',
      '...tttttt.+=..',
      '..tittttttt+..',
      '.tttttttttTT..',
      '..h.......hH..',
      '..h........H..',
      '..h........H..',
      '..h........H..',
      '..h........H..',
      '..hh......HH..',
      '..hh......HH..',
      '......hh......',
    ], P({ t: CLOTH.teal, i: lite(CLOTH.teal), h: HAIR.brown }), 0, 0);
  });
  H('nun black veil white wimple woman pale', 'pale', 'calm', (c, s) => {
    art(c, [
      '....kkkkkk....',
      '...kikkkkkk...',
      '..kk++++++kK..',
      '..k+......+K..',
      '..k+......+K..',
      '..k+......+K..',
      '..k+......+K..',
      '..k+......+K..',
      '..k+......=K..',
      '..k++....+=K..',
      '.kkk++..+=kKK.',
      '.kkkk+++=kkKK.',
    ], P({ k: NIGHT, i: lite(lite(NIGHT)) }), 0, 1);
  });

  /* ---------------- torsos ---------------- */
  torsos.push({ name: 'surcoat white red cross chain mail crusader', draw(c) {
    mail(c, 1, 1, 10, 1);
    art(c, [
      '..++....+=..',
      '..+++!!++=..',
      '..+++!!++=..',
      '..+!!!!!!=..',
      '..+++!!++=..',
      '..+++!!++=..',
      '..bbbb*bbB..',
      '..+++!!++=..',
      '..+++!!++=..',
    ], P({ b: dark(C.leather), '!': C.brick }), 0, 1);
  } });
  torsos.push({ name: 'surcoat halved navy mustard tower heraldic chain mail', draw(c) {
    mail(c, 1, 1, 10, 1);
    art(c, [
      '..nn....yY..',
      '..nnnnyyyY..',
      '..n+n+y+yY..',
      '..n+++++yY..',
      '..n++#++yY..',
      '..n++#++yY..',
      '..bbbb*bbB..',
      '..nnnnyyyY..',
      '..nnnnyyyY..',
    ], P({ n: CLOTH.navy, y: CLOTH.mustard, b: dark(C.leather) }), 0, 1);
    c.set(2, 2, lite(CLOTH.navy));
  } });
  torsos.push({ name: 'chain mail hauberk belt', draw(c) {
    mail(c, 1, 1, 10, 1);
    mail(c, 2, 2, 9, 9);
    c.col(9, 2, 9, dark(IRON));
    art(c, ['..bbbb*bbB..', '..b.........', '..b.........'], P({ b: C.leather }), 0, 7);
    c.rect(5, 1, 6, 1, dark(IRON));
    c.clear(3, 9);
    c.clear(6, 9);
    c.clear(9, 9);
  } });
  torsos.push({ name: 'plate breastplate steel armour', draw(c) {
    art(c, [
      '.iaaAaaAaaA.',
      '..iaa==aaA..',
      '..aaa=aaaA..',
      '..aaa=aaaA..',
      '..aaa=aaAA..',
      '..AaaaaaAA..',
      '..dddddddd..',
      '..a=a=a=aA..',
      '..aaaaaaaA..',
    ], P({ a: STEEL, i: lite(STEEL), d: mix(IRON, 0.7) }), 0, 1);
    c.set(2, 4, GOLD); // rivets
    c.set(8, 4, GOLD);
  } });
  torsos.push({ name: 'monk habit brown cowl rope belt', draw(c) {
    art(c, [
      '.ihhhsshhhH.',
      '..hHhssHhH..',
      '..hhHHHHhH..',
      '..hhhhhhhH..',
      '..hhhhhhhH..',
      '..~~~~~~~=..',
      '..hhh~hhhH..',
      '..hhh=hhhH..',
      '..hhh~hhhH..',
    ], P({ h: HABIT, i: lite(HABIT), s: SKINS.tan }), 0, 1);
  } });
  torsos.push({ name: 'nun habit black white collar rosary cross', draw(c) {
    art(c, [
      '.ik++++++kK.',
      '..k++++=+K..',
      '..kk+++=kK..',
      '..kkk*kkkK..',
      '..kk***kkK..',
      '..kkk*kkkK..',
      '..kkk*kkkK..',
      '..kkkkkkkK..',
      '..kkkkkkkK..',
    ], P({ k: NIGHT, i: lite(lite(NIGHT)), '*': C.wood }), 0, 1);
  } });
  torsos.push({ name: 'jester motley wine mustard ruff bells', draw(c) {
    art(c, [
      '.w+=+=+=+=m.',
      '..wwwwmmmM..',
      '..wmwwmwmM..',
      '..wwwwmmmM..',
      '..wwmwmmwM..',
      '..wwwwmmmM..',
      '..wmwwmwmM..',
      '..wwwwmmmM..',
      '..wwwwmmmM..',
      '..*.*..*.*..',
    ], P({ w: CLOTH.wine, m: CLOTH.mustard }), 0, 1);
  } });
  torsos.push({ name: 'king robe purple ermine collar gold chain', draw(c) {
    art(c, [
      '.+#++ss++#=.',
      '..++#++#+=..',
      '..p++++++P..',
      '..pp*++*pP..',
      '..ppp**ppP..',
      '..ppp!*ppP..',
      '..ppp**ppP..',
      '..ppp**ppP..',
      '..ppp**ppP..',
    ], P({ p: PURPLE, s: SKINS.fair }), 0, 1);
    c.set(2, 3, lite(PURPLE));
  } });
  torsos.push({ name: 'queen gown wine gold trim square neck necklace', draw(c) {
    art(c, [
      '.iwssssssww.',
      '..wss*sssW..',
      '..w******W..',
      '..wwwccwwW..',
      '..wwwccwwW..',
      '..ww*cc*wW..',
      '..wwwccwwW..',
      '..wwccccwW..',
      '..wwccccwW..',
    ], P({ w: CLOTH.wine, i: lite(CLOTH.wine), c: CLOTH.cream, s: SKINS.pale }), 0, 1);
    c.set(5, 3, hex('#3f6a6e'));
  } });
  torsos.push({ name: 'executioner black leather jerkin studs blood belt', draw(c) {
    art(c, [
      '.ikkksskkkK.',
      '..kkkssskK..',
      '..k=kkkk=K..',
      '..kkkk%kkK..',
      '..k=k%%k=K..',
      '..kkkk%kkK..',
      '..llll*llL..',
      '..llll*llL..',
      '..kk%kkkkK..',
    ], P({ k: NIGHT, i: lite(lite(NIGHT)), l: C.leather, s: SKINS.fair }), 0, 1);
  } });

  /* ---------------- arms ---------------- */
  arms.push({ name: 'plate arm steel gauntlet armour', draw(c) {
    art(c, ['iaaaA', 'aaaaA', '.aaA.', '.a=A.', '.aaA.', 'iaaaA', '.aaA.', '.ddd.', 'iaaaA', '.aaA.', '.aAA.', '.dAd.'].slice(0, 11), P({ a: STEEL, i: lite(STEEL), d: mix(IRON, 0.7) }));
  } });
  arms.push({ name: 'chain mail sleeve leather glove', draw(c) {
    mail(c, 1, 0, 3, 6);
    c.col(3, 0, 6, dark(IRON));
    art(c, ['lllll', '.llL.', '.llL.', '.lLL.'], P({ l: C.leather }), 0, 7);
  } });
  arms.push({ name: 'monk habit brown wide sleeve tan hand', draw(c) {
    art(c, ['.ihH.', '.hhH.', '.hhH.', '.hhH.', '.hhH.', 'hhhhH', 'hhhhH', 'hhHhH', 'HHHHH', '.ssS.', '.ssS.'], P({ h: HABIT, i: lite(HABIT), s: SKINS.tan }));
  } });
  arms.push({ name: 'jester motley striped sleeve wine mustard bell pale hand', draw(c) {
    art(c, ['.wwW.', '.wwW.', '.mmM.', '.mmM.', '.wwW.', '.wwW.', '.mmM.', '.mmM.', 'w.w.w', '*ssS*', '.ssS.'], P({ w: CLOTH.wine, m: CLOTH.mustard, s: SKINS.pale }));
  } });
  arms.push({ name: 'royal purple sleeve ermine cuff gold ring fair hand', draw(c) {
    art(c, ['.ipP.', '.***.', '.ppP.', '.ppP.', '.ppP.', '.ppP.', '.ppP.', '+#++=', '++#+=', '.ssS.', '.*sS.'], P({ p: PURPLE, i: lite(PURPLE), s: SKINS.fair }));
  } });
  arms.push({ name: 'black habit wide sleeve white cuff pale hand', draw(c) {
    art(c, ['.ikK.', '.kkK.', '.kkK.', '.kkK.', '.kkK.', '.kkK.', 'kkkkK', 'kkkkK', '.++=.', '.ssS.', '.ssS.'], P({ k: NIGHT, i: lite(lite(NIGHT)), s: SKINS.pale }));
  } });

  /* ---------------- legs ---------------- */
  legs.push({ name: 'plate greaves steel knee sabaton armour', draw(c) {
    art(c, ['.iaaA.', '.aaaA.', '.aaaA.', '.dddd.', 'iaaaaA', '.aaaA.', '.a=aA.', '.a=aA.', '.aaaA.', '.dddd.', '.aa=aa', '.AAAAA'], P({ a: STEEL, i: lite(STEEL), d: mix(IRON, 0.7) }));
  } });
  legs.push({ name: 'surcoat skirt white chain mail legs iron shoes', draw(c) {
    mail(c, 1, 4, 4, 9);
    c.col(4, 4, 9, dark(IRON));
    art(c, ['.++++=', '.++++=', '+++++=', '+!!!!!', '+.+.+.'], P({ '!': C.brick }), 0, 0);
    mail(c, 1, 4, 4, 4);
    art(c, ['+.+.+.'], P(), 0, 4);
    art(c, ['.iiii.', '.IIIII'], P({ i: IRON }), 0, 10);
  } });
  const poulaine = (c, col, tip) => art(c, ['.....t', '.lll.l', '.LLLLL'], P({ l: col, t: tip || col }), 0, 9);
  legs.push({ name: 'hose wine pointed shoes poulaines', draw(c) {
    c.rect(1, 0, 4, 9, CLOTH.wine);
    c.col(4, 0, 9, dark(CLOTH.wine));
    c.set(1, 0, lite(CLOTH.wine));
    c.row(9, 1, 4, dark(CLOTH.wine));
    poulaine(c, C.leather);
  } });
  legs.push({ name: 'jester motley hose wine mustard diamonds bell shoes', draw(c) {
    art(c, ['.mmwW.', '.mmwW.', '.mwwW.', '.mmwW.', '.mmmW.', '.mmwW.', '.mwwW.', '.mmwW.', '.mmmW.', '.mmwW.'], P({ w: CLOTH.wine, m: CLOTH.mustard }));
    poulaine(c, CLOTH.wine, GOLD);
  } });
  legs.push({ name: 'monk habit brown skirt sandals tan feet', draw(c) {
    art(c, ['.hhhhH', '.hhhhH', 'hhhhhH', 'hhHhhH', 'hhHhhH', 'hhHhhH', 'hhHhhH', 'hhHhhH', 'HHHHHH', '..sS..', '..lsl.', '..LLLL'], P({ h: HABIT, s: SKINS.tan, l: C.leather }));
    c.set(1, 0, lite(HABIT));
  } });
  legs.push({ name: 'gown wine long skirt gold hem cream panel woman', draw(c) {
    art(c, ['ccwwwW', 'ccwwwW', 'ccwwwW', 'ccwWwW', 'ccwWwW', 'ccwWwW', 'ccwWwW', 'ccwWwW', 'ccwWwW', 'ccwWwW', '******', 'WWWWWW'], P({ w: CLOTH.wine, c: CLOTH.cream }));
  } });

  return { heads, torsos, arms, legs };
};
