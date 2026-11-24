/* The dungeon adventure: wizard, witch, ranger, dwarf, elf, orc, goblin, lich, barbarian, rogue. */
module.exports = (kit, { P, art, blend, C }) => {
  const { SKINS, HAIR, CLOTH, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite } = kit;
  const heads = [], torsos = [], arms = [], legs = [];
  const H = (name, skin, expr, draw, extra) => heads.push({ name, skin, expr, draw, ...extra });
  const S = (name, draw, extra) => heads.push({ name, special: true, draw, ...extra });
  const STEEL = C.steel, IRON = C.iron, PURPLE = C.purple, NIGHT = hex('#2a2630'), RUNE = hex('#7fb0a8'), BRONZE = hex('#8a733a'), ORC = C.orc, GOB = C.goblin, WOLF = hex('#6e665a');

  /* ---------------- heads ---------------- */
  const wizard = (name, skin, hat, beard) =>
    H(name, skin, 'calm', (c, s) => {
      art(c, [
        '........nn....',
        '......nnnN....',
        '.....nn*nnN...',
        '.nnnnnnnnnnnN.',
        '..w........W..',
        '..w........W..',
        '..w........W..',
        '..ww......WW..',
        '..wwwwwwwwWW..',
        '..www....wWW..',
        '...wwwwwwwW...',
        '...wwwwwwwW...',
        '....wwwwwW....',
      ], P({ n: hat, w: beard }), 0, 0);
      c.set(4, 3, lite(hat));
      c.set(9, 1, GOLD);
    });
  wizard('wizard pointed hat navy stars long white beard fair', 'fair', CLOTH.navy, HAIR.white);
  wizard('wizard pointed hat grey long grey beard brown', 'brown', hex('#5a5a66'), HAIR.grey);
  H('witch crooked black hat long black hair wart green rotten', 'rotten', 'grin', (c, s) => {
    art(c, [
      '....kk........',
      '.....kkk......',
      '....pp*ppK....',
      'kkkkkkkkkkkkkK',
      '..h........H..',
      '..h........H..',
      '.hh........HH.',
      '.h.....S...H..',
      '.hh....S.o.H..',
      '..h........H..',
      '.hh........HH.',
      '.h..........H.',
    ], P({ k: NIGHT, p: PURPLE, h: HAIR.black, S: dark(s), o: dark(dark(s)) }), 0, 0);
    c.set(1, 3, lite(lite(NIGHT)));
  });
  H('ranger green hood shadowed stubble tan', 'tan', 'calm', (c, s) => {
    art(c, [
      '........ff....',
      '.....fffff....',
      '...fiffffffF..',
      '..fffffffffF..',
      '..ffddddddfF..',
      '..ff......fF..',
      '..f........F..',
      '..f........F..',
      '..f........F..',
      '..ff.t..t.fF..',
      '..fff.tt.ffF..',
      '...fff..ffF...',
      '....ff*fFF....',
    ], P({ f: CLOTH.forest, i: lite(CLOTH.forest), d: mix(s, 0.7), t: mix(s, 0.66) }), 0, 0);
  });
  const dwarf = (name, skin, helm, beard) =>
    H(name, skin, 'angry', (c, s) => {
      art(c, [
        '....aaaaaa....',
        '...iaaaaaaA...',
        '..aaaaaaaaaA..',
        '..d*ddaadd*D..',
        '..b...aa...B..',
        '..b........B..',
        '.bb...ss...BB.',
        '.bbbbbssbbbBB.',
        '.bbbb....bbBB.',
        '.bbbbbbbbbbBB.',
        '..bb*bbbb*bB..',
        '..bB..bB..bB..',
      ], P({ a: helm, i: lite(helm), d: dark(helm), D: dark(dark(helm)), b: beard, s: blend(s, RED, 0.25) }), 0, 1);
    });
  dwarf('dwarf iron helm braided red beard fair', 'fair', STEEL, HAIR.red);
  dwarf('dwarf bronze helm braided black beard brown', 'brown', BRONZE, HAIR.black);
  const elf = (name, skin, expr, hair, gem) =>
    H(name, skin, expr, (c, s) => {
      art(c, [
        '....bbbbbb....',
        '...bibbbbbb...',
        '..bbbbbbbbbB..',
        's.bb==gg==BB.S',
        'sss........SSS',
        '.ss........SS.',
        '..b........B..',
        '..b........B..',
        '..b........B..',
        '..b........B..',
        '..bb......BB..',
        '..b........B..',
      ], P({ b: hair, i: lite(hair), s, g: gem, '=': STEEL }), 0, 1);
    });
  elf('elf pointed ears long blond hair circlet pale', 'pale', 'calm', HAIR.blond, hex('#3f7a5a'));
  elf('dark elf pointed ears white hair circlet ashen', 'ashen', 'angry', HAIR.white, BLOOD);
  S('orc green tusks top knot', (c) => {
    art(c, [
      '......##......',
      '.....g##g.....',
      '...gggggggg...',
      '..giggggggggG.',
      '.gg###gg###GG.',
      '.Ggg!#gg#!gGG.',
      '..ggggGGgggG..',
      '..g+ggGGgg+G..',
      '..g+g####g+G..',
      '..ggGggggGgG..',
      '...ggggggGG...',
      '....GGGGGG....',
    ], P({ g: ORC, i: lite(ORC) }), 0, 0);
  });
  S('goblin big ears yellow eyes long nose', (c) => {
    art(c, [
      '.....gggg.....',
      'g...gigggg...G',
      'gg.gggggggg.GG',
      '.ggg**gg**gGG.',
      '..gg*#gg#*gG..',
      '...gggGgggG...',
      '...ggGGGggG...',
      '...gg####gG...',
      '....g+gg+G....',
      '.....gggG.....',
    ], P({ g: GOB, i: lite(GOB), '*': hex('#d0b84a') }), 0, 2);
  });
  S('lich skull iron crown glowing eyes', (c) => {
    const b = hex('#b9b294'), glow = hex('#6fd0c0');
    art(c, [
      '...a.a..a.a...',
      '...aaaaaaaa...',
      '...apaapaapA..',
      '...bbbbbbbb...',
      '...bbbbbbbB...',
      '...b##bb##B...',
      '...b#cbbc#B...',
      '...bbb##bbB...',
      '....bbbbbB....',
      '....b#b#bB....',
      '.....bbbB.....',
      '.....b#bB.....',
    ], P({ a: IRON, p: PURPLE, b, c: glow }), 0, 0);
    c.set(3, 1, lite(IRON));
    c.set(9, 4, K); // a crack
    c.set(8, 3, K);
  });
  H('barbarian wild black mane headband war paint tan', 'tan', 'angry', (c, s) => {
    art(c, [
      '..h.h..h.h.h..',
      '..hhhhhhhhhh..',
      '.hhhhhhhhhhhH.',
      '.hhlll~~lllHH.',
      '.hh........HH.',
      '.hh........HH.',
      '.hh........HH.',
      '.hh.w....w.HH.',
      '.hh.w....w.HH.',
      '.hh........HH.',
      '.hhh......HHH.',
      '.hh........HH.',
      '.h..........H.',
    ], P({ h: HAIR.black, l: C.leather, w: hex('#3e5a7a') }), 0, 0);
  });
  H('rogue eye mask red bandana earring brown', 'brown', 'grin', (c, s) => {
    art(c, [
      '....rrrrrr....',
      '...rirrrrrrR..',
      '..rrrrrrrrrRr.',
      '...........Rr.',
      '...########.r.',
      '...##+##+##...',
      '..............',
      '..*...........',
    ], P({ r: hex('#7a2a2a'), i: hex('#9a4a40') }), 0, 1);
  });

  /* ---------------- torsos ---------------- */
  torsos.push({ name: 'wizard robes navy runes gold trim sash', draw(c) {
    art(c, [
      '.innn**nnnN.',
      '..nn*ss*nN..',
      '..nnn**nnN..',
      '..nrnnnnrN..',
      '..nnnrnnnN..',
      '..pppppppP..',
      '.nnrnnpnrnN.',
      '.nnnnrpnnnN.',
      '.nrnnnPnnnN.',
    ], P({ n: CLOTH.navy, i: lite(CLOTH.navy), r: RUNE, p: CLOTH.plum, s: SKINS.fair }), 0, 1);
  } });
  torsos.push({ name: 'witch dress black ragged bone necklace rotten', draw(c) {
    art(c, [
      '.ikkksskkkK.',
      '..kkssssKK..',
      '..k~s~~s~K..',
      '..kkk~kkkK..',
      '..ppkkkkpP..',
      '..kpkkkkkK..',
      '..kkkkpkkK..',
      '.kkkkkkkkkK.',
      '.k.kk.kk.k..',
    ], P({ k: NIGHT, i: lite(lite(NIGHT)), s: SKINS.rotten, p: PURPLE }), 0, 1);
  } });
  torsos.push({ name: 'leather armour brown straps studs', draw(c) {
    const l = C.leather;
    art(c, [
      '.iLlLssLlLL.',
      '..l=lddl=L..',
      '..llllllLL..',
      '..LLLLLLLL..',
      '..llll*llL..',
      '..LLLLLLLL..',
      '..lllllllL..',
      '..dddd=ddD..',
      '..lllllppL..',
    ], P({ l, i: lite(l), d: mix(l, 0.5), p: C.hide, s: SKINS.tan }), 0, 1);
  } });
  torsos.push({ name: 'barbarian fur vest bare chest scar skull belt tan', draw(c) {
    art(c, [
      '.fiffssfiff.',
      '..ffssssfF..',
      '..fiSssSfF..',
      '..ffssssiF..',
      '..fis%ssfF..',
      '..ffss%sfF..',
      '..fisSssfF..',
      '..bbb~~bbB..',
      '..bbb#~bbB..',
    ], P({ f: WOLF, i: lite(WOLF), s: SKINS.tan, b: mix(C.leather, 0.6) }), 0, 1);
  } });
  torsos.push({ name: 'scale mail bronze armour leather collar', draw(c) {
    for (let y = 1; y <= 9; y++)
      for (let x = y === 1 ? 1 : 2; x <= (y === 1 ? 10 : 9); x++)
        c.set(x, y, y % 2 ? ((x + (y >> 1)) % 2 ? BRONZE : lite(BRONZE)) : dark(BRONZE));
    c.col(9, 2, 9, mix(BRONZE, 0.5));
    art(c, ['....llLL....', '.....lL.....'], P({ l: C.leather }), 0, 1);
    art(c, ['..dddd*ddD..'], P({ d: mix(C.leather, 0.6) }), 0, 8);
  } });
  torsos.push({ name: 'dwarf plate armour stout big gold buckle', draw(c) {
    art(c, [
      '.iaaa##aaaA.',
      '.aaaaaaaaaA.',
      '.a=aaaaaa=A.',
      '.aaaaAAaaaA.',
      '.aaaaaaaaaA.',
      '.bbb****bbB.',
      '.bbb*##*bbB.',
      '.aaaaaaaaaA.',
      '.AaAaAaAaAA.',
    ], P({ a: STEEL, i: lite(STEEL), b: mix(C.leather, 0.7) }), 0, 1);
  } });
  torsos.push({ name: 'ranger cloak green leaf clasp quiver strap leather', draw(c) {
    const f = CLOTH.forest, l = C.leather;
    art(c, [
      '.iffffffffF.',
      '..fff**ffF..',
      '..ffl##lfF..',
      '..fdllllfF..',
      '..fldlllfF..',
      '..flldllfF..',
      '..fbbb*bfF..',
      '..fllllffF..',
      '..ffllffFF..',
    ], P({ f, i: lite(f), l, d: mix(l, 0.5), b: mix(l, 0.6) }), 0, 1);
  } });
  torsos.push({ name: 'orc bare green chest crossed straps iron shoulder spikes', draw(c) {
    art(c, [
      '.=.=........',
      '.aaaAgggggG.',
      '..lggggggl..',
      '..glggggLG..',
      '..ggl==LgG..',
      '..ggl==LgG..',
      '..glgGGgLG..',
      '..lggGGggL..',
      '..bbb~bbbB..',
      '..b.bbb.bB..',
    ], P({ g: ORC, a: IRON, l: C.leather, b: C.hide }), 0, 0);
  } });
  torsos.push({ name: 'lich tattered purple robe ribs bones', draw(c) {
    const b = hex('#b9b294');
    art(c, [
      '.ipp*bb*ppP.',
      '..pp#bb#pP..',
      '..pbbbbbbP..',
      '..p##bb##P..',
      '..pbbbbbbP..',
      '..p##bb##P..',
      '..pp*##*pP..',
      '..ppppp.pP..',
      '..p.pp.pp...',
    ], P({ p: PURPLE, i: lite(PURPLE), b }), 0, 1);
  } });

  /* ---------------- arms ---------------- */
  arms.push({ name: 'bare arm leather bracers armband tan', draw(c) {
    const s = SKINS.tan;
    art(c, ['.issS', '.sssS', '.lll.', '.ssS.', '.ssS.', '.lll.', '.l=L.', '.llL.', '.l=L.', '.ssS.', '.sSS.'], P({ s, i: lite(s), l: C.leather }));
  } });
  arms.push({ name: 'wizard robe navy wide sleeve gold trim rune fair hand', draw(c) {
    art(c, ['.inN.', '.nnN.', '.nrN.', '.nnN.', '.nnN.', 'nnnnN', 'nrnnN', 'nnnnN', '*****', '.ssS.', '.ssS.'], P({ n: CLOTH.navy, i: lite(CLOTH.navy), r: RUNE, s: SKINS.fair }));
  } });
  arms.push({ name: 'ranger green sleeve leather archer bracer glove', draw(c) {
    const f = CLOTH.forest;
    art(c, ['.ifF.', '.ffF.', '.ffF.', '.ffF.', '.ffF.', '.lll.', '.dlL.', '.dlL.', '.lll.', '.llL.', '.sSs.'], P({ f, i: lite(f), l: C.leather, d: mix(C.leather, 0.5), s: SKINS.tan }));
  } });
  arms.push({ name: 'orc green arm spiked iron bracer claws', draw(c) {
    art(c, ['.iggG', '.gggG', '.ggG.', '.gGG.', '.ggG.', '=aaa=', '.aaA.', '=aaa=', '.ggG.', '.gGg.', '.+.+.'], P({ g: ORC, i: lite(ORC), a: IRON }));
  } });
  arms.push({ name: 'lich bone arm tattered purple sleeve skeleton', draw(c) {
    const b = hex('#b9b294');
    art(c, ['.ipP.', '.ppP.', '.ppP.', '.p.P.', '..b..', '.bbB.', '..b..', '..b..', '.bbB.', '.b.b.', '.b.B.'], P({ p: PURPLE, i: lite(PURPLE), b }));
  } });
  arms.push({ name: 'scale mail bronze sleeve leather vambrace fair hand', draw(c) {
    for (let y = 0; y <= 5; y++) for (let x = 1; x <= 3; x++) c.set(x, y, y % 2 ? dark(BRONZE) : (x + (y >> 1)) % 2 ? BRONZE : lite(BRONZE));
    art(c, ['.lll.', '.llL.', '.lLL.', '.ssS.', '.ssS.'], P({ l: C.leather, s: SKINS.fair }), 0, 6);
  } });

  /* ---------------- legs ---------------- */
  legs.push({ name: 'barbarian fur loincloth fur boots bound tan', draw(c) {
    art(c, ['.fiffF', '.ffffF', '.f.fF.', '.sssS.', '.sssS.', 'ififif', '.fffF.', '.lllL.', '.fffF.', '.lllL.', '.ffiff', '.FFFFF'], P({ f: WOLF, i: lite(WOLF), s: SKINS.tan, l: C.leather }));
  } });
  legs.push({ name: 'wizard robe navy long skirt rune hem', draw(c) {
    art(c, ['.nnnnN', '.nnnnN', 'nnnnnN', 'nnNnnN', 'nnNnnN', 'nnNnnN', 'nnNnnN', 'nnNnnN', 'nrnnrN', '******', 'NNNNNN', '...lll'], P({ n: CLOTH.navy, r: RUNE, l: C.leather }));
  } });
  legs.push({ name: 'leather trousers high boots knife', draw(c) {
    const l = C.leather, b = mix(C.leather, 0.55);
    art(c, ['.illL.', '.lllL.', '.lllL.', '.lllL.', '.dddd.', '.bbbB.', '.b=bB.', '.b=bB.', '.bbbB.', '.bbbB.', '.bbbbb', '.BBBBB'], P({ l, i: lite(l), b, d: lite(b) }));
  } });
  legs.push({ name: 'dwarf plate legs stout heavy iron boots', draw(c) {
    art(c, ['.iaaaA', '.aaaaA', '.dddd.', 'iaaaaA', '.aaaaA', '.a=aaA', '.aaaaA', '.dddd.', 'kkkkkK', 'kikkkK', 'kkkkkk', 'KKKKKK'], P({ a: STEEL, i: lite(STEEL), d: mix(IRON, 0.7), k: IRON }));
  } });
  legs.push({ name: 'orc green legs hide loincloth clawed bare feet', draw(c) {
    art(c, ['.hhhhH', '.hhhH.', '.h.hH.', '.gggG.', '.gggG.', '.gGgG.', '.gggG.', '.gggG.', '.gggG.', '.gggG.', '.ggggg', '.G+G+G'], P({ h: C.hide, g: ORC }));
  } });
  legs.push({ name: 'lich tattered purple robe bone legs skeleton', draw(c) {
    const b = hex('#b9b294');
    art(c, ['.ppppP', '.ppppP', 'pppppP', 'ppPppP', 'pp.pP.', 'p.bB.p', '..bB..', '..bB..', '..bB..', '..bB..', '.bbbb.', '.BbBbB'], P({ p: PURPLE, b }));
  } });

  return { heads, torsos, arms, legs };
};
