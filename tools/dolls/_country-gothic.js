/* Cathedral and crypt: bishop, hooded monk, vampire count and lady, gargoyle, choirboy, widow, flagellant, grave robber. */
module.exports = (kit, { P, art, blend, C }) => {
  const { SKINS, HAIR, CLOTH, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite } = kit;
  const heads = [], torsos = [], arms = [], legs = [];
  const H = (name, skin, expr, draw, extra) => heads.push({ name, skin, expr, draw, ...extra });
  const S = (name, draw, extra) => heads.push({ name, special: true, draw, ...extra });
  const NIGHT = hex('#2a2630'), NI = hex('#45404e'), STONE = C.stone, COWL = hex('#4a4038'), LINING = hex('#7a2228'), RAG = hex('#756a58');

  /* ---------------- heads ---------------- */
  H('bishop mitre white gold white hair old pale', 'pale', 'calm', (c, s) => {
    art(c, [
      '......++......',
      '.....+**+.....',
      '....++**+=....',
      '...********=..',
      '..+h......H=..',
      '..+h......H=..',
      '..+........=..',
      '..*........*..',
    ], P({ h: HAIR.white }), 0, 0);
  });
  S('hooded monk cowl shadowed face no face', (c) => {
    art(c, [
      '......hh......',
      '....hhhhhh....',
      '...hihhhhhhH..',
      '..hhh####hhH..',
      '..hh######hH..',
      '..hh######hH..',
      '..hh#e##e#hH..',
      '..hh######hH..',
      '..hh######hH..',
      '..hh######hH..',
      '..hh######hH..',
      '.hhhh####hhhH.',
      '.hhhhhHHhhhhH.',
    ], P({ h: COWL, i: lite(COWL), e: hex('#8a8468') }), 0, 0);
  });
  H('vampire count slicked black hair fangs high collar red pale', 'pale', 'angry', (c, s) => {
    art(c, [
      '....hhhhhh....',
      '...hhihhhhh...',
      '...hhhhhhhh...',
      '...hh.hh.hH...',
      '...h..........',
      '..............',
      '.k..........k.',
      '.kr........rk.',
      '.kr........rk.',
      '.kkr.+..+.rkk.',
      '..kr......rk..',
      '..kkr....rkk..',
    ], P({ h: HAIR.black, i: NI, k: NIGHT, r: LINING }), 0, 1);
  });
  H('vampire lady long black hair white streak blood woman pale', 'pale', 'calm', (c, s) => {
    art(c, [
      '....hhhhhh....',
      '...hhhh+hhh...',
      '..hhhhhh+hhH..',
      '..hhh.hh.+hH..',
      '..hh......hH..',
      '..h........H..',
      '..h........H..',
      '..h........H..',
      '..h........H..',
      '..hh....%.HH..',
      '.hhh....%.HHH.',
      '.hh........HH.',
    ], P({ h: HAIR.black }), 0, 1);
  });
  S('gargoyle stone horns fangs', (c) => {
    art(c, [
      '..a........a..',
      '..aa......aA..',
      '...aaaaaaaa...',
      'a.aiaaaaaaaa.A',
      'aaa###aa###AAA',
      '.aaa#yaay#aAA.',
      '..aaaaAAaaaA..',
      '..aaaAAAAaaA..',
      '..a+aaaaaa+A..',
      '..a+a####a+A..',
      '...aaaaaaaA...',
      '....aAmaAA....',
    ], P({ a: STONE, i: lite(STONE), y: hex('#b0a050'), m: C.moss }), 0, 0);
    c.set(3, 3, C.moss);
  });
  const choirboy = (name, skin, hair) =>
    H(name, skin, 'scared', (c, s) => {
      art(c, [
        '....bbbbbb....',
        '...bbbibbbb...',
        '...bbbbb.bB...',
        '...bb.....B...',
        '..............',
        '..............',
        '....r....r....',
        '..............',
        '..............',
        '..............',
        '..+=+=+=+=+=..',
      ], P({ b: hair, i: lite(hair), r: blend(s, RED, 0.3) }), 0, 2);
    });
  choirboy('choirboy blond parted hair ruff singing fair', 'fair', HAIR.blond);
  choirboy('choirboy black hair ruff singing brown', 'brown', HAIR.black);
  H('widow black lace veil weeping woman pale', 'pale', 'weeping', (c, s) => {
    art(c, [
      '....kkkkkk....',
      '...kkikkkkk...',
      '..kkkkkkkkkK..',
      '..kk.k.k.kkK..',
      '..k.k.k.k.kK..',
      '..kk..k...kK..',
      '..k.k.k.k.kK..',
      '..kk.k.k.kkK..',
      '..k.k....k.K..',
      '..kk.k.k.kkK..',
      '..k.........K.',
      '.kk.........KK',
    ], P({ k: NIGHT, i: NI }), 0, 1);
  });
  H('flagellant shaved head crown of thorns blood tan', 'tan', 'hollow', (c, s) => {
    art(c, [
      '....sdsdss....',
      '..t.s.t..d.t..',
      '..tttttttttt..',
      '...%.t....%...',
      '...%..........',
      '..........%...',
      '....d....d....',
    ], P({ s, d: mix(s, 0.72), t: hex('#4a3524') }), 0, 2);
  });
  H('grave robber battered top hat muffler stubble scar tan', 'tan', 'calm', (c, s) => {
    art(c, [
      '....kkkkk.....',
      '....kikkkK....',
      '....bbbbbb....',
      '..kkkkkkkkkK..',
      '...h......H...',
      '...h......H...',
      '..............',
      '.........x....',
      '....t....x....',
      '...tt....tt...',
      '...mmm..mmm...',
      '..mmmm..mmmM..',
      '..mMmmmmmMmM..',
    ], P({ k: NIGHT, i: NI, b: CLOTH.earth, h: HAIR.brown, t: mix(s, 0.66), x: blend(s, BLOOD, 0.5), m: hex('#6a5a3a') }), 0, 0);
  });
  S('stone angel statue weeping moss', (c) => {
    const a = STONE, f = hex('#a9aca2');
    art(c, [
      '....aaaaaa....',
      '...aaAaaAaa...',
      '..aAffffffAa..',
      '..affffffffA..',
      '..affffffffA..',
      '..afddffddfA..',
      '..affdffFffA..',
      '...ffdfffff...',
      '...fffddffF...',
      '....fffffF....',
      '.....fffF.....',
    ], P({ a, f, d: mix(a, 0.5) }), 0, 1);
    c.set(3, 3, C.moss);
    c.set(2, 4, C.moss);
    c.set(8, 3, K);
    c.set(9, 4, K);
  });
  H('nosferatu bald pointed ears rat teeth ashen', 'ashen', 'hollow', (c, s) => {
    art(c, [
      '.....ssss.....',
      '.s..sissss..S.',
      '.s..........S.',
      '.ss........SS.',
      '.ss........SS.',
      '..s........S..',
      '..............',
      '....d....d....',
      '..............',
      '......++......',
    ], P({ s, i: lite(s), d: mix(s, 0.7) }), 0, 1);
  });

  /* ---------------- torsos ---------------- */
  torsos.push({ name: 'cassock black white collar gold cross wine sash priest', draw(c) {
    art(c, [
      '.ikkk++kkkK.',
      '..kkk=kkkK..',
      '..kk*k*kkK..',
      '..kkk*kkkK..',
      '..kk***kkK..',
      '..kkk*kkkK..',
      '..wwwwwwwW..',
      '..kkk=kwkK..',
      '..kkk=kwkK..',
    ], P({ k: NIGHT, i: NI, w: CLOTH.wine }), 0, 1);
  } });
  torsos.push({ name: 'vestments white chasuble gold wine band bishop', draw(c) {
    art(c, [
      '.i++*ww*++=.',
      '..++*ww*+=..',
      '..+*****+=..',
      '..++*ww*+=..',
      '..++*ww*+=..',
      '..++*w**+=..',
      '..++*ww*+=..',
      '..=+*ww*+=..',
      '..==****==..',
    ], P({ i: lite(WHITE), w: CLOTH.wine }), 0, 1);
  } });
  torsos.push({ name: 'black frock coat red lined cloak cravat medallion vampire', draw(c) {
    art(c, [
      '.krkk++kkrK.',
      '.krkk++kkrK.',
      '.krkkk+kkrK.',
      '.krkk*kkkrK.',
      '.krkkkkkkrK.',
      '.krkk=kkkrK.',
      '.krkkkkkkrK.',
      '.krkk=kkkrK.',
      '.krkkkkkkrK.',
    ], P({ k: NIGHT, r: LINING }), 0, 1);
    c.set(1, 1, NI);
  } });
  torsos.push({ name: 'black lace gown low neck rose pale woman', draw(c) {
    art(c, [
      '.iksssssskK.',
      '..kssssssK..',
      '..kgsggsgK..',
      '..kkgkkgkK..',
      '..kkkkkkkK..',
      '..kk%kkkkK..',
      '..kkkkkkkK..',
      '..kgkgkgkK..',
      '..gkgkgkgK..',
    ], P({ k: NIGHT, i: NI, g: hex('#5d5868'), s: SKINS.pale }), 0, 1);
  } });
  torsos.push({ name: 'flagellant ragged habit torn bare chest whip marks rope tan', draw(c) {
    art(c, [
      '.ihhsssshh..',
      '..hss%sshH..',
      '..hs%ss%.H..',
      '..hhs%%shH..',
      '..hhhsshhH..',
      '..~~~~~~~=..',
      '..hhhh~hhH..',
      '..hh.hh=hH..',
      '..h.hh.hh...',
    ], P({ h: RAG, i: lite(RAG), s: SKINS.tan }), 0, 1);
  } });
  torsos.push({ name: 'choir surplice white ruff red cassock', draw(c) {
    art(c, [
      '.i+=+=+=+==.',
      '..++++++==..',
      '..+=++=++=..',
      '..+=++=++=..',
      '..+=++=++=..',
      '..+=++=++=..',
      '..=+==+===..',
      '..rrrrrrrR..',
      '..rrrrrrrR..',
    ], P({ i: lite(WHITE), r: LINING }), 0, 1);
  } });
  torsos.push({ name: 'grave robber muddy greatcoat sack strap', draw(c) {
    const g = hex('#4f4638'), m = hex('#6a5236');
    art(c, [
      '.igGg##gGgG.',
      '..ggg##g~G..',
      '..ggg#g~gG..',
      '..ggg#~ggG..',
      '..gg*~gggG..',
      '..gg~#gggG..',
      '..g~g#gggG..',
      '..~mg#gmgG..',
      '..mgm#mmgG..',
    ], P({ g, i: lite(g), m, '~': dark(BONE) }), 0, 1);
  } });
  torsos.push({ name: 'widow mourning dress black high collar shawl jet brooch', draw(c) {
    art(c, [
      '.ikkkkkkkkK.',
      '..sskk=ksS..',
      '..sssk=sSS..',
      '..ksssssSK..',
      '..kkssSSkK..',
      '..kkksSkkK..',
      '..kkkkkkkK..',
      '..kkkkkkkK..',
      '..kkkkkkkK..',
    ], P({ k: NIGHT, i: NI, s: hex('#4d4858') }), 0, 1);
    c.set(4, 6, hex('#4d4858')); // fringe
    c.set(7, 6, hex('#353040'));
  } });
  torsos.push({ name: 'stone statue body folded wings moss cracks gargoyle angel', draw(c) {
    art(c, [
      'A..........A',
      'AAaaaaaaaaAA',
      'A.iaaaaaaA.A',
      'A.aaAaaAaA.A',
      '..aaaAAaaA..',
      '..aaaaaaaA..',
      '..ama#aaaA..',
      '..aaaa#aaA..',
      '..mmaaa#aA..',
      '..amaaaaaA..',
    ], P({ a: STONE, i: lite(STONE), m: C.moss }), 0, 0);
  } });

  /* ---------------- arms ---------------- */
  arms.push({ name: 'black frock coat sleeve white cuff pale hand long nails ring', draw(c) {
    art(c, ['.ikK.', '.kkK.', '.kkK.', '.kkK.', '.kkK.', '.kkK.', '.kkK.', '.krK.', '.++=.', '.ssS.', '.s*S.', '.+.+.'], P({ k: NIGHT, i: NI, r: LINING, s: SKINS.pale }));
  } });
  arms.push({ name: 'vestment white wide sleeve gold trim pale hand', draw(c) {
    art(c, ['.i+=.', '.++=.', '.++=.', '.++=.', '+++==', '+++==', '++=+=', '*****', '.++=.', '.ssS.', '.ssS.'], P({ i: lite(WHITE), s: SKINS.pale }));
  } });
  arms.push({ name: 'black lace sleeve pale arm black glove', draw(c) {
    art(c, ['.kkK.', '.kkK.', '.ksk.', '.sks.', '.ksk.', '.sks.', '.ksk.', '.ggg.', '.kkK.', '.kkK.', '.kKK.'], P({ k: NIGHT, s: SKINS.pale, g: hex('#5d5868') }));
  } });
  arms.push({ name: 'flagellant ragged sleeve torn bare arm welts rope tan', draw(c) {
    art(c, ['.ihH.', '.hhH.', '.hhH.', '.h.H.', '.ssS.', '.s%S.', '.ssS.', '.%sS.', '.~~=.', '.ssS.', '.sSS.'], P({ h: RAG, i: lite(RAG), s: SKINS.tan }));
  } });
  arms.push({ name: 'stone arm claws moss gargoyle statue', draw(c) {
    art(c, ['.iaaA', '.aaaA', '.aaA.', '.amA.', '.aaA.', '.a#A.', '.aaA.', '.maA.', '.aaA.', 'aaaaA', 'a.a.A'], P({ a: STONE, i: lite(STONE), m: C.moss }));
  } });

  /* ---------------- legs ---------------- */
  legs.push({ name: 'cassock black long skirt buckled shoes priest', draw(c) {
    art(c, ['.kkkkK', '.kkkkK', 'kkkkkK', '=kKkkK', 'kkKkkK', '=kKkkK', 'kkKkkK', '=kKkkK', 'kkKkkK', 'KKKKKK', '..k=k.', '..kkkk'], P({ k: NIGHT }));
    c.set(1, 0, NI);
  } });
  legs.push({ name: 'alb white long skirt gold hem lace red shoes bishop', draw(c) {
    art(c, ['.++++=', '.++++=', '+++++=', '++=++=', '++=++=', '++=++=', '++=++=', '******', '+=+=+=', '=+=+=+', '..rrr.', '..RRRR'], P({ r: LINING }));
  } });
  legs.push({ name: 'black breeches white stockings buckled shoes', draw(c) {
    art(c, ['.ikkK.', '.kkkK.', '.kkkK.', '.kkkK.', '.*kk*.', '.+++=.', '.+++=.', '.+++=.', '.+++=.', '.+++=.', '.k==k.', '.kkkkk'], P({ k: NIGHT, i: NI, '=': dark(WHITE) }));
    c.set(2, 10, C.steel);
    c.set(3, 10, C.steel);
  } });
  legs.push({ name: 'black lace gown long skirt tiers woman', draw(c) {
    art(c, ['.kkkkK', '.kkkkK', 'kkkkkK', 'gkgkgK', 'kkkkkK', 'kkKkkK', 'kkKkkK', 'gkgkgk', 'kkkkkK', 'kkKkkK', 'gkgkgk', 'kgkgkg'], P({ k: NIGHT, g: hex('#5d5868') }));
  } });
  legs.push({ name: 'flagellant ragged habit hem bare legs sandals tan', draw(c) {
    art(c, ['.hhhhH', '.hhhhH', 'hhhhhH', 'hhHhhH', 'hh.hH.', 'h.sS.h', '..sS..', '..s%..', '..sS..', '..sS..', '..lsl.', '..LLLL'], P({ h: RAG, s: SKINS.tan, l: C.leather }));
    c.set(1, 0, lite(RAG));
  } });

  return { heads, torsos, arms, legs };
};
