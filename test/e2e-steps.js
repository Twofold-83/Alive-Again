// One person playing both sides: step tools, playback order, Player modes, game movement, the level builder, Claude (stand-in), inventory.
const assert = require('assert');
const path = require('path');
const { setup } = require('./lib');
(async () => {
  const t = await setup(3127, { DIRECTOR_AI: path.join(__dirname, 'fake-ai.js') });
  try {
    const x = await t.open(),
      p = x.p;
    const side = (who) => p.waitForFunction((w) => new RegExp(w).test(document.querySelector('#banner').textContent), who);
    const toPlayer = async () => {
      await x.end();
      await side('Player');
      await x.cutDone();
    };
    const toDirector = async () => {
      await x.end();
      await side('Director');
      await x.cutDone();
    };
    const settings = async (...clicks) => {
      await x.opt('Story settings');
      for (const c of clicks) await p.click(c);
      await x.done();
    };
    const narrate = async (text) => {
      await x.opt('Narrate');
      assert.equal(await p.inputValue('#panel input'), '');
      await p.fill('#panel input', text);
      await x.done();
    };
    const stage = () => p.locator('#stage').boundingBox();

    await p.goto(t.base);
    await p.click('#typeAdventure');
    await p.click('#hotseat');
    await p.waitForSelector('.gopts');
    const right = await p.locator('#right').boundingBox(),
      st0 = await stage();
    assert(right.x >= st0.x + st0.width - 2, 'tool column to the right of the stage');
    assert.equal(await p.locator('.modesw').count(), 0, 'one Director screen, no mode switch');

    /* ---- Narration mode ---- */
    await settings('[data-pmode=tell]');
    await x.add('mage');
    await x.done();
    await toPlayer();
    const [hx0] = await x.heroPos();
    await p.mouse.click(st0.x + 80, st0.y + st0.height - 60);
    assert.equal((await x.heroPos())[0], hx0, 'the stage does not respond in narration mode');
    assert.equal(await p.locator('#foot input').count(), 0);
    await p.fill('#tellBox', 'I ask the old man the way to the castle.');
    assert.equal(await p.textContent('.strip.act'), '');
    await toDirector();
    assert.match(await p.textContent('.card.told'), /way to the castle/);

    /* ---- steps: several things per step, any number of steps, played in order ---- */
    await x.opt('Change the scene');
    await x.opt('The weather');
    await p.click('[data-mark="weather=rain"]');
    await x.done(); // step 1: rain + narration together
    await narrate('It begins to rain.');
    await p.click('#nextStep');
    await narrate('The old man looks up.'); // step 2
    await p.click('#nextStep');
    await x.opt('Someone speaks');
    await p.click('#panel .grid button:not(.heroopt)');
    await p.fill('#panel input', 'Follow the river.');
    await x.done(); // step 3
    await x.opt('Moment and sound');
    await p.click('[data-mark="burst=shake"]');
    await x.done();
    // reset step: only step 3 is undone
    await p.click('#resetStep');
    assert.equal(await p.textContent('#stage .bubbles'), '');
    assert.match(await p.textContent('.strip.narr'), /old man looks up/);
    assert.match(await p.textContent('.gtitle'), /Step 3/);
    await x.opt('Someone speaks');
    await p.click('#panel .grid button:not(.heroopt)');
    await p.fill('#panel input', 'Follow the river.');
    await x.done();
    // go back to step 1: later steps are dropped
    await p.click('.stepchip >> nth=0');
    assert.match(await p.textContent('.gtitle'), /Step 1/);
    assert.match(await p.textContent('.strip.narr'), /begins to rain/);
    assert.equal(await p.locator('.stepchip').count(), 1);
    // clear steps: the turn starts over
    await p.click('#clearSteps');
    assert.equal(await p.textContent('.strip.narr'), '');
    assert.equal(await p.evaluate(() => document.querySelector('#stage .weather').className), 'weather');
    assert(await p.textContent('.card.told'), 'the Player’s request is still shown');
    // an empty step cannot be added
    await p.click('#nextStep');
    assert.match(await p.textContent('.gtitle'), /Step 1/);
    // now build nine steps
    const lines = ['One.', 'Two.', 'Three.', 'Four.', 'Five.', 'Six.', 'Seven.', 'Eight.'];
    await x.opt('Change the scene');
    await x.opt('The weather');
    await p.click('[data-mark="weather=rain"]');
    await x.done();
    for (const l of lines) {
      await narrate(l);
      await p.click('#nextStep');
    }
    await x.opt('Someone speaks');
    await p.click('#panel .grid button:not(.heroopt)');
    await p.fill('#panel input', 'Nine.');
    await x.done();
    assert.equal(await p.locator('.stepchip').count(), 9);
    await x.shot('s-1-nine-steps');
    await x.watch();
    await toPlayer();
    const seq = await x.seen();
    // the recording starts while the Director's own (final) view is still up: look only at what follows the first step's appearance
    const idx = [];
    let from = seq.findIndex((k) => k.includes('|One.|') && !k.includes('Nine.'));
    for (const want of [...lines.map((l) => '|' + l + '|'), 'Nine.']) {
      const i = seq.findIndex((k, n) => n >= from && k.includes(want));
      idx.push(i);
      from = i + 1;
      if (i < 0) break;
    }
    assert(idx.length === 9 && idx.every((i) => i >= 0), 'nine steps played in order: ' + JSON.stringify(idx) + ' ' + JSON.stringify(seq));
    assert(!seq.slice(idx[0], idx[7]).some((k) => k.includes('Nine.')), 'the last step did not show early');
    assert(seq[idx[0]].startsWith('w-rain'), 'rain and the first narration came together');
    let sc = await x.last();
    assert.equal(sc.steps.length, 8);
    assert.deepEqual(
      sc.steps.map((f) => f.narration),
      lines,
    );
    assert.equal(sc.steps[0].weather, 'rain');

    /* ---- limited will: must choose, may walk once ---- */
    await p.fill('#tellBox', 'I wait.');
    await toDirector();
    await settings('[data-pmode=limited]');
    assert.equal(await p.locator('[data-range]').count(), 0, 'no walking-distance options any more');
    await p.click('.card.ask button.primary');
    await x.opt('Pick one of these');
    await p.fill('input[placeholder="Choice 1"]', 'Follow the river');
    await p.fill('input[placeholder="Choice 2"]', 'Go back');
    await x.done();
    await toPlayer();
    assert(await p.isDisabled('#foot button.go'), 'cannot end the turn before choosing');
    await x.walk(0.8, 0.6);
    const [lx] = await x.heroPos();
    assert(Math.abs(lx - 0.8) < 0.02, 'limited will: the hero can walk');
    await p.click('#walkBtn');
    assert(Math.abs((await x.heroPos())[0] - lx) > 0.1, 'taking the walk back returns the hero');
    await x.walk(0.7, 0.6);
    await p.click('#foot .choices button:has-text("Go back")');
    await p.fill('#foot input', 'No thanks.');
    await toDirector();
    sc = await x.last();
    assert.equal(sc.action, 'Go back');
    assert(Math.abs(sc.entities.find((e) => e.id === sc.heroId).x - 0.7) < 0.02);

    /* ---- the scene workshop: build a level, prepare scenes, use them ---- */
    await settings('[data-pmode=free]');
    await x.opt('Build this room');
    await p.click('#roomPaint');
    await p.waitForSelector('#wsStage');
    await p.waitForSelector('#wsAdd'); // a scene on the bench is not on the map until you add it
    const ws = await p.locator('#wsStage').boundingBox(),
      cw = ws.width / 16,
      ch = ws.height / 12;
    const cell = (cx, cy) => [ws.x + cw * (cx + 0.5), ws.y + ch * (cy + 0.5)];
    const tileBtn = (kind) => ({
      click: async () => {
        await p.click(`.grid.tiles button >> nth=${kind === 'wall' ? 12 : 0}`);
        await p.click(`[data-kind=${kind === 'wall' ? 'w' : 'f'}]`);
      },
    });
    // a new prepared scene: floor everywhere, a wall across with a gap at the bottom, a solid crate
    await p.click('#wsNew');
    await tileBtn('floor').click();
    await p.click('#wsFillAll');
    assert.match(await p.textContent('#wsCount'), /192 floor · 0 wall/);
    await tileBtn('wall').click();
    await p.click('[data-tool=rect]');
    await p.mouse.move(...cell(10, 0));
    await p.mouse.down();
    await p.mouse.move(...cell(10, 5), { steps: 6 });
    await p.mouse.move(...cell(10, 9), { steps: 6 });
    await p.mouse.up();
    assert.match(await p.textContent('#wsCount'), /182 floor · 10 wall/);
    await p.keyboard.press('Control+z');
    assert.match(await p.textContent('#wsCount'), /192 floor · 0 wall/);
    await p.keyboard.press('Control+y');
    assert.match(await p.textContent('#wsCount'), /182 floor · 10 wall/);
    await p.click('[data-tool=pick]');
    await p.mouse.click(...cell(10, 3));
    assert(await p.locator('[data-kind=w].on').count(), 'picking a wall tile selects the wall brush');
    await p.click('[data-wtab=things]');
    await x.add('crate'); // the same add-and-change tools as during a turn
    await p.click('#viewRow [data-view=used]'); // a thing has hand-drawn pictures of itself used, and from the side
    assert.match(await p.getAttribute('#wsStage .ent.sel img', 'src'), /crate\.used\.png/);
    if (!(await p.locator('.thingbtns button.on:has-text("Solid")').count())) await p.click('.thingbtns button:has-text("Solid")'); // a crate blocks the way from the start
    const dragWs = async (sel, cx, cy) => {
      const b = await p.locator(sel).boundingBox();
      await p.mouse.move(b.x + b.width / 2, b.y + b.height - 3);
      await p.mouse.down();
      await p.mouse.move(...cell(cx, cy), { steps: 10 });
      await p.mouse.up();
    };
    await dragWs('#wsStage .ent.sel', 3, 5.4);
    await dragWs('#wsStage .ent.hero', 6, 5.4);
    await x.done();
    await p.fill('#wsName', 'The river crossing');
    await x.opt('Change the scene');
    await x.opt('The place');
    await p.click('[data-mark="backdrop=b:hall"]');
    await x.done();
    await p.click('#wsUndo');
    await p.click('button[title^="Redo"]'); // undo and redo work on everything here
    await x.shot('s-3-workshop');
    // a second prepared scene, by duplicating; the library is saved with the story
    await p.click('#wsAdd');
    await p.waitForSelector('#wsSaved');
    await p.click('#wsMap');
    await p.click('.wsmap .node');
    await p.click('#mapDup');
    assert.equal(await p.locator('.wsmap .node').count(), 2);
    // the whole map is saved as a campaign, and can be put on a map again
    await p.click('#campSave');
    assert.equal(await p.locator('#campaigns .myroom').count(), 1);
    assert.match(await p.evaluate(() => localStorage.getItem('tf.campaigns')), /The river crossing/);
    await p.click('.wsmap .node >> nth=0');
    assert.equal(await p.inputValue('#mapName'), 'The river crossing');
    await p.click('#mapUse'); // bring the prepared scene on stage, in this step
    await p.waitForSelector('#workshop', { state: 'hidden' });
    assert.equal(await p.locator('#stage .level i').count(), 192);
    assert.equal(await p.locator('#stage .ent').count(), 2);
    let saved = await p.evaluate(async () => {
      const r = await fetch(`/api/rooms/${location.hash.slice(1)}/events?token=${localStorage.getItem('tf.token')}`);
      const rd = r.body.getReader();
      let b = '';
      for (;;) {
        const { value } = await rd.read();
        b += new TextDecoder().decode(value);
        const i = b.indexOf('data: ');
        const e = b.indexOf('\n\n', i);
        if (i >= 0 && e > i) {
          rd.cancel();
          return JSON.parse(b.slice(i + 6, e)).scenes;
        }
      }
    });
    assert.equal(saved.length, 2);
    assert.equal(saved[0].name, 'The river crossing');
    assert(saved[0].scene.level && saved[0].scene.entities.some((e) => e.solid));
    await x.opt('Change the scene');
    assert.match(await p.textContent('.gopt:has-text("Go to a scene from the map")'), /2 on the map/);
    await p.click('.gback');
    await toPlayer();
    const [px, py] = await x.heroPos();
    assert(Math.abs(px - 6.5 / 16) < 0.03, `the hero starts where the prepared scene says (${px})`);
    // pointing past the wall: the hero finds the gap and walks around. The Player speaks first, then walks: the replay keeps that order
    await p.fill('#foot input[placeholder^="Say"]', 'Off I go!');
    await x.walk(13.5 / 16, 5.5 / 12);
    await p.fill('#foot input[placeholder^="Free"]', 'Looks around');
    await p.evaluate(() => {
      window.__beats = [];
      let last = null;
      const add = (k) => {
        if (!window.__beats.includes(k)) window.__beats.push(k);
      };
      setInterval(() => {
        const st = document.querySelector('#stage');
        if (!/\bcut\b/.test(st.className)) {
          last = null;
          return;
        }
        const h = st.querySelector('.ent.hero'),
          x = h && h.style.left;
        if (last != null && x !== last) add('walk');
        last = x;
        if (st.querySelector('.bubbles').textContent.trim()) add('say');
        if (/Looks around/.test(st.querySelector('.strip.act').textContent)) add('act');
      }, 30);
    });
    let [qx, qy] = await x.heroPos();
    assert(Math.abs(qx - 13.5 / 16) < 0.03 && Math.abs(qy - 5.5 / 12) < 0.03, `the hero walked around the wall (${qx}, ${qy})`);
    await x.shot('s-4-walked-around');
    await toDirector();
    sc = await x.last();
    assert.deepEqual(sc.order, ['say', 'walk', 'act'], 'the order the Player did things in is kept');
    assert.deepEqual(await p.evaluate(() => window.__beats), ['say', 'walk', 'act'], 'and the replay shows it in that order');
    let tr = sc.tracks[0].pts;
    assert(tr.length >= 12, 'the walk has corners: ' + tr.length / 3 + ' points');
    let low = 0;
    for (let i = 0; i < tr.length; i += 3) low = Math.max(low, tr[i + 2]);
    assert(low > 10 / 12, `it went through the gap at the bottom (lowest point ${low})`);
    for (let i = 0; i < tr.length; i += 3)
      assert(!(Math.floor(tr[i + 1] * 16) === 10 && tr[i + 2] < 10 / 12), 'no point of the walk is inside the wall');
    // close the gap in Build scene and use the scene again: the hero starts on the left and cannot cross
    await x.opt('Build this room');
    await p.click('#roomPaint');
    await p.waitForSelector('#wsStage');
    assert.equal(await p.inputValue('#wsName'), 'The river crossing');
    await tileBtn('wall').click();
    await p.click('[data-tool=brush]');
    await p.mouse.move(...cell(10, 10));
    await p.mouse.down();
    await p.mouse.move(...cell(10, 11), { steps: 4 });
    await p.mouse.up();
    await p.click('#wsUse');
    await p.waitForSelector('#workshop', { state: 'hidden' });
    assert.equal(await p.locator('#stage .ent').count(), 2);
    await toPlayer();
    await x.walk(13.5 / 16, 5.5 / 12); // towards the far side
    [qx] = await x.heroPos();
    assert(qx < 10 / 16, `walled in: the hero stays on its side, as near as it can get (${qx})`);
    await p.click('#walkBtn');
    await toDirector();
    await x.opt('Build this room');
    await p.click('#roomPaint');
    await p.waitForSelector('#wsStage');
    await p.click('[data-tool=erase]');
    await p.mouse.click(...cell(10, 10)); // an erased tile is a hole: still not walkable
    await tileBtn('floor').click();
    await p.mouse.click(...cell(10, 11)); // a floor tile reopens the way
    await p.click('#wsUse');
    await p.waitForSelector('#workshop', { state: 'hidden' });
    await toPlayer();
    await x.walk(3.5 / 16, 5.5 / 12); // straight at the solid crate
    [qx, qy] = await x.heroPos();
    assert(Math.hypot(qx - 3.5 / 16, (qy - 5.9 / 12) * 0.75) > 0.03 && qx < 6 / 16, `the hero stops beside the solid crate (${qx}, ${qy})`);
    await toDirector();
    sc = await x.last();
    assert(Math.abs(sc.entities.find((e) => e.id === sc.heroId).x - qx) < 0.01);
    // the server refuses a position inside a wall
    const code = await p.evaluate(() => location.hash.slice(1)),
      token = await p.evaluate(() => localStorage.getItem('tf.token'));
    await x.end();
    await side('Player');
    await x.cutDone();
    const turn = await p.evaluate(async () => (await (await fetch(`/api/rooms/${location.hash.slice(1)}/history`)).json()).history.length);
    await p.evaluate(
      async ([c, tk, tn]) => {
        await fetch(`/api/rooms/${c}/act`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tk, type: 'submit', turn: tn, x: 10.5 / 16, y: 0.3, say: 'cheat' }),
        });
      },
      [code, token, turn],
    );
    await side('Director');
    await x.cutDone();
    sc = await x.last();
    assert.equal(sc.entities.find((e) => e.id === sc.heroId).say, 'cheat');
    assert(Math.abs(sc.entities.find((e) => e.id === sc.heroId).x - qx) < 0.01, 'the hero was not moved into the wall');
    const st = await stage();

    /* ---- Claude (stand-in) fills a step; reaching for a thing and getting it ---- */
    await x.opt('Tell Claude');
    await p.fill('#panel textarea', 'A dragon bursts in');
    await x.done();
    await p.waitForSelector('.gevents:has-text("A dragon bursts in")');
    assert.equal(await p.locator('#stage .ent').count(), 3);
    await p.click('#resetStep');
    assert.equal(await p.locator('#stage .ent').count(), 2, 'reset step undoes what Claude staged');
    await x.add('brass key');
    const [kx, ky] = await p.evaluate(() => {
      const s = document.querySelector('.ent.sel').style;
      return [parseFloat(s.left) / 100, parseFloat(s.top) / 100];
    });
    await x.done();
    await toPlayer();
    await p.mouse.click(st.x + st.width * kx, st.y + st.height * ky - 10);
    await p.click('#cmTake'); // the click menu: walk here, look at, use, reach for
    await p.waitForSelector('.ent.target');
    await toDirector();
    await p.click('.card.ask button.primary');
    assert.equal(await p.locator('#sheet .chip.item').count(), 1);
    assert.deepEqual(t.errors, []);
    console.log('E2E-STEPS OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
