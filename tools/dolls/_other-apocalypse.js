/* APOCALYPSE: survivors of the end. 15 heads, 11 torsos, 7 arms, 7 legs. */
module.exports = (kit, tools) => {
  const { SKINS, HAIR, CLOTH, HAIRS, K, WHITE, BONE, BLOOD, RED, GOLD, hex, mix, dark, lite, body, shoe } = kit;
  const { pal, art, repaint, px } = tools;
  const { person, special, torso, arm, leg } = tools.theme('apocalypse');

  const OLIVE = hex('#55583a'),
    KHAKI = hex('#8a7d58'),
    RUBBER = hex('#34333c'),
    LENS = hex('#8fa6a0'),
    STEEL = hex('#6b6b70'),
    HAZ = hex('#b09a34'),
    TAPE = hex('#8d8a84'),
    TYRE = hex('#28262e'),
    LEATHER = hex('#3a2c22'),
    TARP = hex('#4f6272'),
    FUR = hex('#b0a488'),
    RAG = hex('#6e5a44');

  /* ---------------- heads ---------------- */
  special('gas mask hood olive rubber round lenses filter', (c) =>
    art(c, pal({ o: OLIVE, u: RUBBER, m: hex('#8a7a4a'), l: hex('#c4d6cf'), c: hex('#7a7a72') }), [
      '..............',
      '.....oooo.....',
      '....oooooo....',
      '..oooooooooo..',
      '..oouuuuuuoo..',
      '..ommmuummmo..',
      '..omlmuumlmo..',
      '..ommmuummmo..',
      '..ouuccccuuo..',
      '..ouucCcCuuo..',
      '..oOucCcCuOo..',
      '...oOccccOo...',
      '....oooooo....',
    ]),
  );
  special('hazmat hood yellow visor', (c) =>
    art(c, pal({ h: HAZ, j: lite(HAZ), v: hex('#34413f'), e: hex('#c8d0c8'), g: lite(hex('#34413f')) }), [
      '.....hhhh.....',
      '...hhhhhhhh...',
      '..hjhhhhhhhh..',
      '..hkkkkkkkkh..',
      '..hkvggvvvkh..',
      '..hkvgvvvvkh..',
      '..hkvevvevkh..',
      '..hkvvvvvvkh..',
      '..hkvvvvvvkh..',
      '..hkvvvvvvkh..',
      '..hkvvvvvVkh..',
      '..hhkkkkkkhh..',
      '...hHHHHHHh...',
    ]),
  );
  person('respirator goggles on forehead tan black cropped hair', 'tan', 'calm', (c) =>
    art(c, pal({ h: HAIR.black, l: LENS, d: hex('#5a5960'), f: hex('#7a4a5e') }), [
      '..............',
      '....hhhhhh....',
      '...hllhhllh...',
      '...kwlkkwlk...',
      '..............',
      '..............',
      '..............',
      '..............',
      '...kdddddDk...',
      '..ffddddddff..',
      '..fFdDdDdDfF..',
      '.....dddD.....',
      '..............',
    ]),
  );
  person('bandana over mouth red brown black wild hair', 'brown', 'angry', (c) => {
    HAIRS.wild(c, HAIR.black);
    art(c, pal({ b: hex('#7a3a2e'), c: CLOTH.cream }), [
      '..............',
      '..............',
      '..............',
      '..............',
      '..............',
      '..............',
      '..............',
      '..............',
      '...bbbbbbbbb..',
      '...bbcbbbcbBb.',
      '....bbbcbbB.B.',
      '.....bbbbB....',
      '......bbB.....',
    ]);
  });
  person('shaved head scar fair stubble', 'fair', 'angry', (c, s) => {
    const st = mix(s, 0.8);
    c.row(3, 4, 9, st);
    px(c, st, [[3, 4], [4, 10], [5, 11], [6, 11], [7, 11]]);
    px(c, dark(st), [[10, 4], [9, 10], [8, 11]]);
    px(c, s, [[2, 6]]);
    px(c, dark(s), [[11, 6]]);
    px(c, hex('#9c4a44'), [[5, 2], [5, 3], [4, 4], [4, 5], [4, 7], [3, 8]]);
    c.clear(5, 2);
    px(c, hex('#9c4a44'), [[5, 3]]);
  });
  person('parka hood fur ski goggles orange pale', 'pale', 'calm', (c) =>
    art(c, pal({ o: OLIVE, f: FUR, g: hex('#a8642c'), i: hex('#d9a060') }), [
      '..............',
      '....oooooo....',
      '...oooooooo...',
      '..oFffffffFo..',
      '..of......fo..',
      '..okgiggggko..',
      '..okggggGGko..',
      '..of......fo..',
      '..of......fo..',
      '..of......fo..',
      '..oof....foo..',
      '...oof..foo...',
      '....oOOOOo....',
    ]),
  );
  person('soldier helmet olive chin strap tan', 'tan', 'calm', (c, s) => {
    art(c, pal({ h: hex('#4d5236'), j: hex('#6a6f4c'), e: hex('#3a2c22') }), [
      '.....hhhh.....',
      '...hhhhhhhh...',
      '..hjjhhhhhhH..',
      '.hhhhhhhhhHHH.',
      '...e......e...',
      '...e......e...',
      '...e......e...',
      '...e......e...',
      '...e......e...',
      '...e......e...',
      '....e....e....',
      '.....eeee.....',
      '..............',
    ]);
    px(c, K, [[8, 1], [8, 2]]);
  });
  person('feral child matted hair dirt leaf pale brown hair', 'pale', 'scared', (c) =>
    art(c, pal({ h: hex('#3e2c20'), g: hex('#4f6a3a'), d: hex('#7a6a50') }), [
      '..h..h.hh.g...',
      '.hhhhhhhhghh..',
      '.hhhhhhhhhhhh.',
      '.hhhhhhhhhhhh.',
      '.hhh.h..h.hhh.',
      '.hh........hh.',
      '.hh........hH.',
      '..h........hH.',
      '.hh.d....d.h..',
      '..h.........H.',
      '.h..........h.',
      '..............',
      '..............',
    ]),
  );
  person('radiation burnt face sores tufts rotten white hair', 'rotten', 'hollow', (c, s) => {
    px(c, HAIR.white, [[4, 2], [4, 1], [5, 2], [9, 2], [10, 3], [3, 3], [2, 4]]);
    px(c, hex('#8a4a3e'), [[8, 3], [9, 3], [9, 4], [3, 7], [3, 8], [4, 8], [8, 10], [7, 11], [6, 4]]);
    px(c, hex('#c9b89a'), [[8, 4], [4, 7]]);
    px(c, BLOOD, [[9, 8]]);
  });
  const raider = (c, s, hair, paint) => {
    art(c, pal({ m: hair }), ['.....m.mm.....', '.....mmmm.....', '.....mmMm.....', '.....mmMm.....']);
    px(c, mix(s, 0.8), [[4, 3], [3, 4], [9, 3], [10, 4]]);
    repaint(c, s, paint, 3, 5, 10, 6);
    px(c, K, [[4, 7], [4, 8], [9, 7], [9, 8]]);
    c.row(8, 6, 8, BONE);
    c.set(8, 8, dark(BONE));
  };
  person('raider face paint white mohawk red tan bone nose', 'tan', 'angry', (c, s) => raider(c, s, HAIR.red, WHITE));
  person('old doctor cracked glasses pale white hair balding', 'pale', 'calm', (c, s) => {
    HAIRS.balding(c, HAIR.white);
    px(c, HAIR.white, [[2, 5], [2, 6], [3, 6]]);
    px(c, dark(HAIR.white), [[11, 5], [11, 6]]);
    const f = hex('#4a4850');
    px(c, f, [[3, 6], [6, 6], [7, 6], [10, 6], [4, 7], [5, 7], [8, 7], [9, 7]]);
    px(c, hex('#b9c8cc'), [[4, 6]]);
    px(c, WHITE, [[9, 6], [10, 5], [9, 7]]);
    px(c, dark(s), [[4, 9], [9, 9]]);
  });
  person('headscarf teal woman brown grey hair', 'brown', 'calm', (c) =>
    art(c, pal({ c: hex('#3f6466'), j: hex('#5c8182'), m: CLOTH.mustard, g: HAIR.grey }), [
      '..............',
      '....cccccc....',
      '...cjjccccc...',
      '..cmmmmmmmmC..',
      '..ccgg....cC..',
      '..c........C..',
      '..c........C..',
      '..c........C..',
      '..c........C..',
      '..cc......cC..',
      '...cc....cC...',
      '....cc..cC....',
      '.....ccCC.....',
    ]),
  );
  person('raider face paint red mohawk teal brown bone nose', 'brown', 'grin', (c, s) => raider(c, s, hex('#2e5658'), hex('#a33a30')));
  person('old woman knitted cap rust scarf mustard fair grey hair', 'fair', 'calm', (c) =>
    art(c, pal({ c: CLOTH.rust, b: hex('#a8683e'), p: CLOTH.cream, g: HAIR.grey, m: CLOTH.mustard }), [
      '......pp......',
      '....cccccc....',
      '...cccccccc...',
      '...bCbbCbbCb..',
      '..gg......gG..',
      '..g........G..',
      '..g........G..',
      '..g........G..',
      '..g........G..',
      '..............',
      '..............',
      '..mmmMmmMmmm..',
      '...mMmmMmmM...',
    ]),
  );
  person('eyepatch survivor ashen red ponytail collar up', 'ashen', 'calm', (c) => {
    HAIRS.ponytail(c, HAIR.red);
    c.rect(8, 5, 9, 6, K);
    px(c, K, [[10, 5], [7, 4]]);
    px(c, hex('#2a2830'), [[6, 3], [5, 2]]);
    px(c, BLOOD, [[3, 8], [4, 8]]);
    px(c, CLOTH.slate, [[2, 10], [3, 10], [3, 11], [4, 11], [4, 12], [5, 12]]);
    px(c, dark(CLOTH.slate), [[11, 10], [10, 10], [10, 11], [9, 11], [9, 12], [8, 12]]);
  });

  /* ---------------- torsos ---------------- */
  const parka = (col, patch) => (c) =>
    art(c, pal({ o: col, j: lite(col), f: FUR, p: patch }), [
      '............',
      '.joffffffoo.',
      '..jofFFfoo..',
      '..oooOoppo..',
      '..oooOoPpo..',
      '..oooOoooo..',
      '..OOoOoOOo..',
      '..oooOoooo..',
      '..oooOokoo..',
      '..OOOOOOOO..',
      '............',
    ]);
  torso('patched parka olive fur collar', parka(OLIVE, CLOTH.rust));
  torso('patched parka rust fur collar', parka(CLOTH.rust, CLOTH.slate));
  torso('tactical vest black pouches radio grey shirt', (c) =>
    art(c, pal({ g: CLOTH.ash, v: hex('#2c2a33'), j: hex('#44424c'), p: hex('#54543f'), t: TAPE, e: CLOTH.earth }), [
      '............',
      '.gvvggggvvg.',
      '..jvvggvvv..',
      '..vvvvvvvv..',
      '..vrvvvttv..',
      '..vvvvvvvv..',
      '..PPvPPvPP..',
      '..ppvppvpp..',
      '..vvvvvvvv..',
      '..eeeyeeee..',
      '............',
    ]),
  );
  torso('hazmat suit yellow taped zip', (c) =>
    art(c, pal({ h: HAZ, j: lite(HAZ), t: TAPE }), [
      '............',
      '.jhhkkkkhhh.',
      '..jhhHhhhh..',
      '..hhhHhkhh..',
      '..hhhHkhkh..',
      '..hhhHhhhh..',
      '..hHhHhhhh..',
      '..hhHHhhHh..',
      '..tttttttt..',
      '..hhhHhhhh..',
      '............',
    ]),
  );
  torso('bandolier bullets over rags brown', (c) => {
    body(c, RAG);
    px(c, SKINS.tan, [[7, 3], [8, 3], [3, 6], [3, 7]]);
    px(c, dark(RAG), [[6, 2], [4, 8], [8, 6]]);
    for (let i = 0; i < 8; i++) {
      c.set(1 + i, 1 + i, hex('#2a201a'));
      c.set(2 + i, 1 + i, i % 2 ? dark(GOLD) : GOLD);
    }
    c.set(9, 9, LEATHER);
    for (const [x, y] of [[2, 9], [5, 9], [8, 9]]) c.clear(x, y);
  });
  torso('tyre armour black rubber rings', (c) =>
    art(c, pal({ s: CLOTH.rust, e: hex('#8a7a5a'), t: TYRE, i: hex('#4c4a55') }), [
      '............',
      '.ssessssess.',
      '.tttttttttt.',
      '.tititititi.',
      '..ssessess..',
      '.tttttttttt.',
      '.ititititit.',
      '..ssessess..',
      '.tttttttttt.',
      '.tititititi.',
      '............',
    ]),
  );
  torso('road sign armour yellow warning red stop plate', (c) =>
    art(c, pal({ s: hex('#3c3b46'), m: hex('#b08e2e'), a: hex('#a33a30'), e: CLOTH.earth }), [
      '............',
      '.aaassssnnn.',
      '..wasmmsNn..',
      '..ssmkkmss..',
      '..smmkkmms..',
      '..mmmkkmmm..',
      '..smmmmmms..',
      '..ssmkkmss..',
      '..sssmMsss..',
      '..eeeeeeee..',
      '............',
    ]),
  );
  torso('mechanic jumpsuit teal oil stains name patch', (c) =>
    art(c, pal({ t: hex('#3a5c5e'), j: hex('#527a7c'), e: CLOTH.earth, o: hex('#1e2a2c') }), [
      '............',
      '.jttTwwTttt.',
      '..jtTwWTtt..',
      '..tttTtnrt..',
      '..tttTtttt..',
      '..tttTtttt..',
      '..tooTtttt..',
      '..toooTtot..',
      '..eeeeyeee..',
      '..tttTtttt..',
      '............',
    ]),
  );
  torso('raider leather jacket shoulder spikes skull shirt', (c) =>
    art(c, pal({ l: hex('#46362a'), j: hex('#66503c'), s: hex('#4a1c26'), g: hex('#9a9aa0'), e: hex('#241c18') }), [
      '.g.g....g.g.',
      '.jllssssllL.',
      '..jlssssll..',
      '..lLswwsLl..',
      '..lLsWksLl..',
      '..lLssssLl..',
      '..lLssssLl..',
      '..llssssll..',
      '..lllsslll..',
      '..yeyeeyey..',
      '............',
    ]),
  );
  torso('camouflage army shirt dog tags', (c) =>
    art(c, pal({ o: OLIVE, q: KHAKI, g: STEEL, i: hex('#b4b4b8'), e: CLOTH.earth }), [
      '............',
      '.oOooqqoqqo.',
      '..oOgqqgOo..',
      '..qqoggoOo..',
      '..oqoiioqq..',
      '..oOOoioqo..',
      '..oOOoooOo..',
      '..qqooOOOo..',
      '..eeeeyeee..',
      '..oOoqqooO..',
      '............',
    ]),
  );
  torso('tarpaulin poncho blue grey rope belt', (c) =>
    art(c, pal({ p: TARP, j: lite(TARP), t: TAPE, a: hex('#9a8660'), g: hex('#b4b4b8') }), [
      '............',
      '.jppppppppp.',
      '.pjpppppppp.',
      '.ppjppppttp.',
      '.pppjpppppp.',
      '.ppppjppppp.',
      '.aaaaaaAaaa.',
      '.ppppppApjp.',
      '.pppppppppj.',
      '.gpgpgpgpgp.',
      '............',
    ]),
  );

  /* ---------------- arms ---------------- */
  arm('wrapped forearm rags bandage tan', (c) =>
    art(c, pal({ s: SKINS.tan }), ['.sss.', '.sss.', '.sss.', '.nnn.', '.NNn.', '.nRN.', '.NNn.', 'nnnN.', 'N.nN.', '.nnn.', '.sss.', '.....']),
  );
  const parkaArm = (col, patch) => (c) =>
    art(c, pal({ o: col, j: lite(col), p: patch, f: FUR, e: LEATHER }), ['.joo.', '.ooo.', '.ooo.', '.ppo.', '.pPo.', '.ooo.', '.Ooo.', '.ooo.', '.fff.', '.eee.', '.eee.', '.....']);
  arm('patched parka sleeve olive mitten', parkaArm(OLIVE, CLOTH.rust));
  arm('hazmat sleeve yellow taped black rubber glove', (c) =>
    art(c, pal({ h: HAZ, j: lite(HAZ), t: TAPE, u: RUBBER, i: hex('#5a5862') }), ['.jhh.', '.hhh.', '.hhh.', '.hHh.', '.hhh.', '.Hhh.', '.hhh.', '.ttt.', '.uuu.', '.iuu.', '.uuu.', '.....']),
  );
  arm('tyre shoulder pad bare arm tattoo brown', (c) =>
    art(c, pal({ t: TYRE, i: hex('#5a5862'), e: hex('#8a7a5a'), s: SKINS.brown }), ['ttttt', 'ititi', 'ttttt', '.eee.', '.sss.', '.sks.', '.sss.', '.sks.', '.sss.', '.sss.', '.sss.', '.....']),
  );
  arm('raider leather sleeve spikes fingerless glove fair', (c) =>
    art(c, pal({ l: hex('#46362a'), j: hex('#66503c'), g: hex('#9a9aa0'), u: hex('#241c18'), s: SKINS.fair }), ['.jll.', 'gjll.', '.lll.', 'gjll.', '.lll.', '.lLl.', '.lll.', '.yly.', '.uuu.', '.uuu.', '.sss.', '.....']),
  );
  arm('camouflage sleeve rolled watch brown', (c) =>
    art(c, pal({ o: OLIVE, q: KHAKI, s: SKINS.brown, i: hex('#b4b4b8') }), ['.oOo.', '.ooq.', '.Ooo.', '.oqo.', '.qqq.', '.sss.', '.sss.', '.sss.', '.kik.', '.sss.', '.sss.', '.....']),
  );
  arm('patched parka sleeve rust mitten', parkaArm(CLOTH.rust, CLOTH.slate));

  /* ---------------- legs ---------------- */
  leg('patched trousers slate mismatched boot taped toe', (c) =>
    art(c, pal({ s: CLOTH.slate, p: CLOTH.rust, e: hex('#5a4030'), u: hex('#2a2830'), t: TAPE }), [
      '.ssss.',
      '.ssss.',
      '.ssss.',
      '.spps.',
      '.spPs.',
      '.ssss.',
      '.sSss.',
      '.eeee.',
      '.eeer.',
      '.eeee.',
      '.uutt.',
      '.UUUtT',
    ]),
  );
  leg('cargo trousers olive knee pads black boots', (c) =>
    art(c, pal({ o: OLIVE, v: hex('#2c2a33'), i: hex('#5a5862'), u: hex('#2a2422') }), [
      '.oooo.',
      '.oooo.',
      '.oOOo.',
      '.oOoo.',
      '.oooo.',
      '.vivv.',
      '.vvvv.',
      '.oooo.',
      '.uuuu.',
      '.uuuu.',
      '.uuuu.',
      '.UUUUU',
    ]),
  );
  leg('hazmat legs yellow taped black rubber boots', (c) =>
    art(c, pal({ h: HAZ, j: lite(HAZ), t: TAPE, u: RUBBER, i: hex('#5a5862') }), [
      '.jhhh.',
      '.hhhh.',
      '.hhHh.',
      '.hhhh.',
      '.hHhh.',
      '.hhhh.',
      '.tttt.',
      '.uuuu.',
      '.iuuu.',
      '.uuuu.',
      '.uuuu.',
      '.UUUUU',
    ]),
  );
  leg('ragged trousers brown wrapped shins rag feet tan', (c) =>
    art(c, pal({ e: RAG, s: SKINS.tan }), [
      '.eeee.',
      '.eeee.',
      '.eeEe.',
      '.eeee.',
      '.eses.',
      '.nnnn.',
      '.NNnn.',
      '.nnNN.',
      '.NNnn.',
      '.nnNN.',
      '.nnns.',
      '.NNNss',
    ]),
  );
  leg('camouflage trousers army boots', (c) =>
    art(c, pal({ o: OLIVE, q: KHAKI, u: hex('#2a2422'), e: hex('#4a3a2c') }), [
      '.oOoo.',
      '.ooqq.',
      '.Oooo.',
      '.oqoO.',
      '.qqoo.',
      '.oOOo.',
      '.ooqo.',
      '.eeee.',
      '.uuuu.',
      '.uuuu.',
      '.uuuu.',
      '.UUUUU',
    ]),
  );
  leg('tyre shin guards black rubber dark trousers', (c) =>
    art(c, pal({ d: hex('#3c3b46'), t: TYRE, i: hex('#5a5862'), u: hex('#2a2422') }), [
      '.dddd.',
      '.dddd.',
      '.ddDd.',
      '.dddd.',
      'tttttt',
      'tititi',
      'tttttt',
      'ititit',
      'tttttt',
      '.dddd.',
      '.uuuu.',
      '.UUUUU',
    ]),
  );
  leg('tarpaulin skirt blue grey heavy boots', (c) =>
    art(c, pal({ p: TARP, j: lite(TARP), g: hex('#b4b4b8'), d: hex('#3c3b46'), u: hex('#2a2422') }), [
      'pppppp',
      'pjpppp',
      'ppjppp',
      'pppjpp',
      'ppppjp',
      'pppppp',
      'gpgpgp',
      '..dd..',
      '..dD..',
      '.uuuu.',
      '.uuuu.',
      '.UUUUU',
    ]),
  );
};
