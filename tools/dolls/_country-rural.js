/* Lonely farmland, today or not long ago: farmer, farmer's wife, farmhand, vet, shepherd, a scarecrow of a stranger ... */
module.exports = (kit, { P, art, blend, C }) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  const heads = [], torsos = [], arms = [], legs = [];
  const H = (name, skin, expr, draw, extra) => heads.push({ name, skin, expr, draw, ...extra });
  const TWEED = hex('#6b6452'), WAX = C.olive, RUBBER = hex('#3f5a3c');

  /* ---------------- heads ---------------- */
  const flatcap = (name, skin, cap, hair, stubble) =>
    H(name, skin, 'calm', (c, s) => {
      art(c, [
        '....ccdccc....',
        '..ccdcccdccC..',
        '..CCCCCCCCCCC.',
        '...g......G...',
        '...g......G...',
        '...g......G...',
      ], P({ c: cap, d: lite(cap), g: hair }), 0, 1);
      c.set(4, 7, blend(s, RED, 0.35));
      c.set(9, 7, blend(s, RED, 0.35));
      if (stubble) art(c, ['...t......t...', '....tttttt....', '.....tttt.....'], P({ t: mix(s, 0.66) }), 0, 9);
    });
  flatcap('farmer flat cap tweed grey sideburns fair', 'fair', TWEED, HAIR.grey, false);
  flatcap('farmer flat cap brown stubble black hair tan', 'tan', CLOTH.earth, HAIR.black, true);
  const headscarf = (name, skin, col, dot, hair) =>
    H(name, skin, 'calm', (c, s) => {
      art(c, [
        '....rrrrrr....',
        '...rrorrrorr..',
        '..rrhhhhhhrrR.',
        '..rr......rR..',
        '..ro.......R..',
        '..r........R..',
        '..r........R..',
        '..rr.......R..',
        '..rr......rR..',
        '...rr....rR...',
        '....rr..rR....',
        '.....rrRR.....',
      ], P({ r: col, o: dot, h: hair }), 0, 1);
    });
  headscarf('farmers wife headscarf red dots grey hair woman pale', 'pale', hex('#8a3a30'), CLOTH.cream, HAIR.grey);
  headscarf('farmers wife headscarf navy black hair woman brown', 'brown', CLOTH.navy, CLOTH.ash, HAIR.black);
  H('farmhand straw hat stalk in mouth blond hair tan', 'tan', 'grin', (c, s) => {
    art(c, [
      '.....yyyy.....',
      '....yiyyyY....',
      '....bbbbbb....',
      'yyyyyyyyyyyyYY',
      '.Y.h......H.Y.',
      '...h......H...',
      '..............',
      '..............',
      '..............',
      '.........y....',
      '..........yy..',
    ], P({ y: C.straw, i: lite(C.straw), b: CLOTH.earth, h: HAIR.blond }), 0, 0);
  });
  const specs = (c, col = K) => { // glasses: a frame under and beside the eyes
    art(c, ['...g..gg..g...', '....gg..gg....'], { g: col }, 0, 6);
  };
  H('vet glasses ponytail brown hair woman pale', 'pale', 'calm', (c, s) => {
    HAIRS.ponytail(c, HAIR.brown);
    c.row(4, 3, 5, HAIR.brown);
    specs(c, C.steel);
    art(c, ['....g+..+g....'], P({ g: hex('#4f6b5a') }), 0, 12);
  });
  H('old shepherd woolly hat white beard fair', 'fair', 'calm', (c, s) => {
    art(c, [
      '....nnnnnn....',
      '...nnnnnnnnN..',
      '...NnNnNnNnN..',
      '..w........W..',
      '..w........W..',
      '..w........W..',
      '..ww......WW..',
      '..wwwwwwwwWW..',
      '..www....wWW..',
      '...wwwwwwwW...',
      '....wwwwwW....',
    ], P({ n: hex('#4a5a6e'), w: HAIR.white }), 0, 1);
    c.set(7, 7, blend(s, RED, 0.5));
  });
  H('scarecrow stranger black hat straw stitched mouth ashen', 'ashen', 'hollow', (c, s) => {
    const sh = mix(s, 0.7);
    art(c, [
      '.....####.....',
      '....##d###....',
      '....~~~~~~....',
      '##############',
      '..y#dddddd#y..',
      '.yy........yy.',
      '..y........y..',
      '..............',
      '....#....#....',
      '..............',
      '.....#..#.....',
      '...y......y...',
      '....y.yy.y....',
    ], P({ y: C.straw, d: sh }), 0, 0);
    c.row(2, 4, 9, dark(C.sack));
    c.set(1, 1, K); // the dented crown
  });
  const plaits = (name, skin, hair, bow) =>
    H(name, skin, 'calm', (c, s) => {
      art(c, [
        '....bbbbbb....',
        '...bbbbbbbb...',
        '..bbbbbbbbbB..',
        '..bbb....bbB..',
        '.oo........oo.',
        '.bb........bB.',
        '.Bb........BB.',
        '.bb........bB.',
        '.Bb........BB.',
        '.bb........bB.',
        '..b........B..',
      ], P({ b: hair, o: bow }), 0, 1);
      c.set(4, 7, dark(s)); // freckles
      c.set(9, 7, dark(s));
      c.set(6, 7, dark(s));
    });
  plaits('girl plaits blond red bows freckles fair', 'fair', HAIR.blond, RED);
  plaits('girl plaits red hair green bows freckles pale', 'pale', HAIR.red, CLOTH.forest);
  H('hunter deerstalker tweed moustache brown hair fair', 'fair', 'calm', (c, s) => {
    art(c, [
      '.....d##d.....',
      '...dddddddd...',
      '..dedddddedD..',
      '.DDDDDDDDDDDD.',
      '...h......H...',
      '...h......H...',
      '..............',
      '..............',
      '...hhhhhhhh...',
      '...h......h...',
    ], P({ d: hex('#7a6a48'), e: C.leather, h: HAIR.brown }), 0, 0);
  });
  H('tractor driver cap ear defenders orange brown', 'brown', 'calm', (c, s) => {
    art(c, [
      '....######....',
      '...#cccccc#...',
      '..#cccmmccc#..',
      '..#CCCCCCCC#..',
      '.oo........oO.',
      '.oo........oO.',
      '.oo........oO.',
      '..o........O..',
    ], P({ c: WAX, m: CLOTH.mustard, o: hex('#a85a2a') }), 0, 0);
  });
  H('old woman grey perm curls glasses pale', 'pale', 'calm', (c, s) => {
    art(c, [
      '....g.gg.g....',
      '...gggggggg...',
      '..gGggGggGgG..',
      '..ggGg..gGgG..',
      '..g........G..',
      '..g........G..',
      '..g........G..',
    ], P({ g: HAIR.grey }), 0, 0);
    specs(c, GOLD);
    c.set(2, 8, WHITE); // a pearl
    c.set(11, 8, WHITE);
  });

  /* ---------------- torsos ---------------- */
  const checks = (c, col, x0, y0, x1, y1) => {
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const a = x % 3 === 0, b = y % 3 === 0;
        c.set(x, y, a && b ? mix(col, 0.45) : a || b ? mix(col, 0.7) : col);
      }
  };
  const checked = (name, col, skin) =>
    torsos.push({ name, draw(c) {
      checks(c, col, 1, 1, 10, 1);
      checks(c, col, 2, 2, 9, 9);
      art(c, ['.i..+ss+....', '....+ss+....', '.....S......'], P({ i: lite(col), s: skin }), 0, 1);
      c.set(5, 5, WHITE);
      c.set(5, 7, WHITE);
    } });
  checked('checked shirt red open collar', C.brick, SKINS.fair);
  checked('checked shirt green open collar', hex('#4a6a4a'), SKINS.tan);
  torsos.push({ name: 'dungarees blue denim bib mustard shirt', draw(c) {
    art(c, [
      '.ihdhsshdhH.',
      '..hdhhhhdH..',
      '..hdhhhhdH..',
      '..d*dddd*D..',
      '..dddppddD..',
      '..ddp..pdD..',
      '..dddddddD..',
      '..dddddddD..',
      '..dddDdddD..',
    ], P({ h: hex('#9a8a5a'), i: lite(hex('#9a8a5a')), d: C.denim, p: lite(C.denim), s: SKINS.fair }), 0, 1);
    c.rect(5, 6, 6, 6, C.denim);
  } });
  torsos.push({ name: 'waxed jacket olive corduroy collar zip pockets', draw(c) {
    art(c, [
      '.iookssKooO.',
      '..ookkkKoO..',
      '..ooo#=ooO..',
      '..ooo#oooO..',
      '..ioo#oooO..',
      '..OOo#oOOO..',
      '..o*o#o*oO..',
      '..ooo#oooO..',
      '..ooo#oooO..',
    ], P({ o: WAX, i: lite(WAX), k: CLOTH.earth, s: SKINS.fair }), 0, 1);
  } });
  torsos.push({ name: 'body warmer quilted navy checked shirt', draw(c) {
    checks(c, C.brick, 1, 1, 10, 1);
    art(c, [
      '..nnn++nnN..',
      '..nnn+snnN..',
      '..llll#llL..',
      '..nnnn#nnN..',
      '..llll#llL..',
      '..nnnn#nnN..',
      '..llll#llL..',
      '..nnnn#nnN..',
      '..NNNN#NNN..',
    ], P({ n: CLOTH.navy, l: lite(lite(CLOTH.navy)), s: SKINS.fair }), 0, 1);
  } });
  torsos.push({ name: 'fair isle jumper cream knitted pattern', draw(c) {
    art(c, [
      '.iccCssCccC.',
      '..ccCCCCcC..',
      '..n!n!n!n!..',
      '..!n!n!n!n..',
      '..cccccccC..',
      '..cCcCcCcC..',
      '..cccccccC..',
      '..CcCcCcCC..',
      '..CcCcCcCC..',
    ], P({ c: CLOTH.cream, i: lite(CLOTH.cream), n: CLOTH.navy, '!': hex('#8a3a30'), s: SKINS.pale }), 0, 1);
  } });
  torsos.push({ name: 'vet overall green stethoscope pocket', draw(c) {
    const g = hex('#4f6b5a');
    art(c, [
      '.igg#ss#ggG.',
      '..gg#gg#gG..',
      '..gg#gg#gG..',
      '..ggg##ggG..',
      '..GGGg#ggG..',
      '..g+Gg==gG..',
      '..gggggggG..',
      '..gggggggG..',
      '..gggggggG..',
    ], P({ g, i: lite(g), s: SKINS.pale }), 0, 1);
  } });
  torsos.push({ name: 'housecoat pinafore floral lilac farmers wife', draw(c) {
    const p = hex('#6f6480');
    art(c, [
      '.ippcsscppP.',
      '..ppcsscpP..',
      '..p!pccp+P..',
      '..ppp+pppP..',
      '..+ppp!ppP..',
      '..cccccccC..',
      '..pp!pp+pP..',
      '..p+ppp!pP..',
      '..pppp+ppP..',
    ], P({ p, i: lite(p), c: CLOTH.cream, '!': hex('#8a3a30'), s: SKINS.pale }), 0, 1);
  } });
  torsos.push({ name: 'scarecrow coat black ragged straw rope patch', draw(c) {
    const k = hex('#2a2630');
    art(c, [
      '.ikkyyyykkK.',
      '..kkyKykkK..',
      '..kkkKkkkK..',
      '..kpp#kkkK..',
      '..kpp#k*kK..',
      '..kkk#kkkK..',
      '..~=~=~=~=..',
      '..kkk#kkyK..',
      '..k.kkk.ky..',
    ], P({ k, i: lite(lite(k)), y: C.straw, p: dark(CLOTH.rust) }), 0, 1);
  } });

  /* ---------------- arms ---------------- */
  arms.push({ name: 'checked shirt red sleeve rolled up tan forearm', draw(c) {
    checks(c, C.brick, 1, 0, 3, 4);
    art(c, ['.i...', '.....', '.....', '.....', '.....', '.rrR.', '.ssS.', '.ssS.', '.ssS.', '.ssS.', '.ssS.'], P({ i: lite(C.brick), r: lite(C.brick), s: SKINS.tan }));
  } });
  arms.push({ name: 'waxed jacket olive sleeve corduroy cuff fair hand', draw(c) {
    art(c, ['.ioO.', '.ooO.', '.ooO.', '.ooO.', '.OoO.', '.ooO.', '.ooO.', '.kkK.', '.kKK.', '.ssS.', '.ssS.'], P({ o: WAX, i: lite(WAX), k: CLOTH.earth, s: SKINS.fair }));
  } });
  arms.push({ name: 'fair isle jumper cream sleeve knitted pale hand', draw(c) {
    art(c, ['.icC.', '.ccC.', '.n!n.', '.!n!.', '.ccC.', '.ccC.', '.ccC.', '.CcC.', '.CcC.', '.ssS.', '.ssS.'], P({ c: CLOTH.cream, i: lite(CLOTH.cream), n: CLOTH.navy, '!': hex('#8a3a30'), s: SKINS.pale }));
  } });
  arms.push({ name: 'vet green sleeve long rubber glove bloody', draw(c) {
    const g = hex('#4f6b5a'), r = hex('#8fa6b0');
    art(c, ['.igG.', '.ggG.', '.ggG.', '.+++.', '.rrR.', '.irR.', '.rrR.', '.rrR.', '.r%R.', '.%rR.', '.rr%.'], P({ g, r, i: lite(r) }));
  } });
  arms.push({ name: 'scarecrow black ragged sleeve straw hand', draw(c) {
    const k = hex('#2a2630');
    art(c, ['.ikK.', '.kkK.', '.kkK.', '.kpK.', '.kkK.', '.kkK.', '.k.K.', '.yyy.', 'yyYyy', 'y.y.y', '.y.Y.'], P({ k, i: lite(lite(k)), y: C.straw, p: dark(CLOTH.rust) }));
  } });

  /* ---------------- legs ---------------- */
  const boot = (c, col) => art(c, ['.bbbB.', '.bbbbb', '.BBBBB'], P({ b: col }), 0, 9);
  legs.push({ name: 'corduroys brown ribbed boots', draw(c) {
    const k = hex('#6e5236');
    art(c, ['.ikkK.', '.kKkK.', '.kKkK.', '.kKkK.', '.kKkK.', '.kKkK.', '.kKkK.', '.kKkK.', '.kKkK.'], P({ k, i: lite(k) }));
    boot(c, hex('#3a2c22'));
  } });
  legs.push({ name: 'jeans green wellingtons', draw(c) {
    art(c, ['.iddD.', '.dddD.', '.dddD.', '.dddD.', '.llll.', '.rrrR.', '.irrR.', '.rrrR.', '.rrrR.', '.rrrR.', '.rrrrr', '.RRRRR'], P({ d: C.denim, i: lite(C.denim), r: RUBBER, l: lite(RUBBER) }));
  } });
  legs.push({ name: 'black wellingtons mud to the knee brown trousers', draw(c) {
    const r = hex('#24222a');
    art(c, ['.ittT.', '.tttT.', '.tmtT.', '.tttm.', '.llll.', '.rmrR.', '.rrrR.', '.mrmR.', '.rmmR.', '.mmrm.', '.mmmrm', '.MMMMM'], P({ t: CLOTH.earth, i: lite(CLOTH.earth), r, l: hex('#4a4852'), m: hex('#6a5236') }));
  } });
  legs.push({ name: 'dungarees blue denim knee patch work boots', draw(c) {
    art(c, ['.iddD.', '.dddD.', '.dddD.', '.dddD.', '.dppD.', '.dppD.', '.dddD.', '.dddD.', '.llll.'], P({ d: C.denim, i: lite(C.denim), p: mix(C.denim, 0.8), l: lite(C.denim) }));
    c.rect(2, 4, 3, 5, hex('#5a6f8c'));
    boot(c, hex('#7a5a34'));
  } });
  legs.push({ name: 'tweed skirt wool tights brogues woman', draw(c) {
    art(c, ['.ttdtT', '.tdttT', 'ttttdT', 'tdtttT', 'ttdttT', 'TTTTTT', '..wW..', '..wW..', '..wW..', '..wW..', '..bbb.', '..BBBB'], P({ t: TWEED, d: lite(TWEED), w: hex('#4b4038'), b: hex('#5a3a22') }));
  } });

  return { heads, torsos, arms, legs };
};
