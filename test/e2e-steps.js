// One person playing both sides: step tools, playback order, Player modes, game movement, the level builder, Claude (stand-in), inventory.
const assert = require('assert');
const path = require('path');
const { setup } = require('./lib');
(async () => {
  const t = await setup(3127, { DIRECTOR_AI: path.join(__dirname, 'fake-ai.js') });
  try {
    const x = await t.open(), p = x.p;
    const side = (who) => p.waitForFunction((w) => new RegExp(w).test(document.querySelector('#banner').textContent), who);
    const toPlayer = async () => { await x.end(); await side('Player'); await x.cutDone(); };
    const toDirector = async () => { await x.end(); await side('Director'); await x.cutDone(); };
    const settings = async (...clicks) => { await x.opt('Story settings'); for (const c of clicks) await p.click(c); await x.done(); };
    const narrate = async (text) => { await x.opt('Narrate'); assert.equal(await p.inputValue('#panel input'), ''); await p.fill('#panel input', text); await x.done(); };
    const stage = () => p.locator('#stage').boundingBox();

    await p.goto(t.base); await p.click('#hotseat'); await p.waitForSelector('.gopts');
    const right = await p.locator('#right').boundingBox(), st0 = await stage();
    assert(right.x >= st0.x + st0.width - 2, 'tool column to the right of the stage');
    assert.equal(await p.locator('.modesw').count(), 0, 'one Director screen, no mode switch');

    /* ---- Narration mode ---- */
    await settings('[data-pmode=tell]');
    await x.add('mage'); await x.done();
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
    await x.opt('Change the scene'); await x.opt('The weather'); await p.click('[data-mark="weather=rain"]'); await x.done();   // step 1: rain + narration together
    await narrate('It begins to rain.');
    await p.click('#nextStep');
    await narrate('The old man looks up.');                                                                                    // step 2
    await p.click('#nextStep');
    await x.opt('Someone speaks'); await p.click('#panel .grid button:not(.heroopt)'); await p.fill('#panel input', 'Follow the river.'); await x.done();   // step 3
    await x.opt('Moment and sound'); await p.click('[data-mark="burst=shake"]'); await x.done();
    // reset step: only step 3 is undone
    await p.click('#resetStep');
    assert.equal(await p.textContent('#stage .bubbles'), ''); assert.match(await p.textContent('.strip.narr'), /old man looks up/); assert.match(await p.textContent('.gtitle'), /Step 3/);
    await x.opt('Someone speaks'); await p.click('#panel .grid button:not(.heroopt)'); await p.fill('#panel input', 'Follow the river.'); await x.done();
    // go back to step 1: later steps are dropped
    await p.click('.stepchip >> nth=0');
    assert.match(await p.textContent('.gtitle'), /Step 1/); assert.match(await p.textContent('.strip.narr'), /begins to rain/); assert.equal(await p.locator('.stepchip').count(), 1);
    // clear steps: the turn starts over
    await p.click('#clearSteps');
    assert.equal(await p.textContent('.strip.narr'), ''); assert.equal(await p.evaluate(() => document.querySelector('#stage .weather').className), 'weather');
    assert(await p.textContent('.card.told'), 'the Player’s request is still shown');
    // an empty step cannot be added
    await p.click('#nextStep'); assert.match(await p.textContent('.gtitle'), /Step 1/);
    // now build nine steps
    const lines = ['One.', 'Two.', 'Three.', 'Four.', 'Five.', 'Six.', 'Seven.', 'Eight.'];
    await x.opt('Change the scene'); await x.opt('The weather'); await p.click('[data-mark="weather=rain"]'); await x.done();
    for (const l of lines) { await narrate(l); await p.click('#nextStep'); }
    await x.opt('Someone speaks'); await p.click('#panel .grid button:not(.heroopt)'); await p.fill('#panel input', 'Nine.'); await x.done();
    assert.equal(await p.locator('.stepchip').count(), 9);
    await x.shot('s-1-nine-steps');
    await x.watch(); await toPlayer();
    const seq = await x.seen();
    const idx = [...lines.map((l) => seq.findIndex((k) => k.includes('|' + l + '|'))), seq.findIndex((k) => k.includes('Nine.'))];
    assert(idx.every((i) => i >= 0) && idx.every((v, i) => i === 0 || v > idx[i - 1]), 'nine steps played in order: ' + JSON.stringify(idx));
    assert(seq[idx[0]].startsWith('w-rain'), 'rain and the first narration came together');
    let sc = await x.last();
    assert.equal(sc.steps.length, 8); assert.deepEqual(sc.steps.map((f) => f.narration), lines); assert.equal(sc.steps[0].weather, 'rain');

    /* ---- limited will, with walking and game movement ---- */
    await p.fill('#tellBox', 'I wait.'); await toDirector();
    await settings('[data-pmode=limited]', '[data-range="0.15"]');
    await p.click('.card.ask button.primary');
    await p.fill('input[placeholder="Choice 1"]', 'Follow the river'); await p.fill('input[placeholder="Choice 2"]', 'Go back'); await x.done();
    await toPlayer();
    assert(await p.isDisabled('#foot button.go'), 'cannot end the turn before choosing');
    await p.waitForFunction(() => getComputedStyle(document.querySelector('#stage .range')).display === 'block');
    const [xa] = await x.heroPos(); await x.dragHero(0.45); const [xb] = await x.heroPos();
    assert(xb - xa > 0.1 && xb - xa <= 0.151, `limited will: the hero walks, but only within range (${xb - xa})`);
    await p.click('#foot .choices button:has-text("Go back")'); await p.fill('#foot input', 'No thanks.');
    await x.shot('s-2-limited-range');
    await toDirector();
    sc = await x.last(); assert.equal(sc.action, 'Go back'); assert(Math.abs(sc.entities.find((e) => e.id === sc.heroId).x - xb) < 0.01);

    /* ---- Adventure: build a level; floors, walls and solid things ---- */
    await settings('.card .chips button:has-text("Adventure")', '[data-pmode=free]', '[data-range="0"]');
    await x.opt('Build the level');
    await p.click('#fillAll');                                                    // floor everywhere
    await p.click('[data-kind=w]'); await p.click('#panel .grid button >> nth=12');
    const st = await stage(), cw = st.width / 16, ch = st.height / 12;
    await p.mouse.move(st.x + cw * 10.5, st.y + ch * 0.5); await p.mouse.down();      // a wall down column 10, with a gap in row 11
    await p.mouse.move(st.x + cw * 10.5, st.y + ch * 10.5, { steps: 30 }); await p.mouse.up();
    assert.equal(await p.locator('#stage .level i.wall').count(), 11);
    await x.shot('s-3-level');
    await x.done();
    // put the hero left of the wall and a solid crate in its way further left
    const dragTo = async (sel, fx, fy) => { const b = await p.locator(sel).boundingBox(); await p.mouse.move(b.x + b.width / 2, b.y + b.height - 3); await p.mouse.down(); await p.mouse.move(st.x + st.width * fx, st.y + st.height * fy, { steps: 12 }); await p.mouse.up(); };
    await dragTo('.ent.hero', 0.4, 0.5); await x.done();
    await x.add('crate'); await p.click('.thingbtns button:has-text("Solid")'); await dragTo('.ent.sel', 0.2, 0.5); await x.done();
    await toPlayer();
    assert.equal(await p.locator('#stage .level i').count(), 192);
    let [px, py] = await x.heroPos();
    await x.dragHero(0.5);                                                         // right, into the wall
    let [qx] = await x.heroPos();
    assert(qx > px + 0.1 && qx < 10 / 16, `the hero stops at the wall (x=${qx})`);
    await x.dragHero(-0.7);                                                        // left, into the solid crate
    [qx] = await x.heroPos();
    assert(qx > 0.2 + 0.03 && qx < 0.35, `the hero bumps into the solid crate (x=${qx})`);
    await x.shot('s-4-bump');
    await toDirector();
    sc = await x.last();
    assert(sc.level && sc.level.cells.length === 192); assert(Math.abs(sc.entities.find((e) => e.id === sc.heroId).x - qx) < 0.01);
    assert(sc.entities.some((e) => e.solid));
    // the server refuses a position inside a wall
    const code = await p.evaluate(() => location.hash.slice(1)), token = await p.evaluate(() => localStorage.getItem('tf.token'));
    await x.end(); await side('Player'); await x.cutDone();
    const turn = (await p.evaluate(async () => (await (await fetch(`/api/rooms/${location.hash.slice(1)}/history`)).json()).history.length));
    await p.evaluate(async ([c, tk, tn]) => { await fetch(`/api/rooms/${c}/act`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tk, type: 'submit', turn: tn, x: 10.5 / 16, y: 0.5, say: 'cheat' }) }); }, [code, token, turn]);
    await side('Director'); await x.cutDone();
    sc = await x.last(); assert.equal(sc.entities.find((e) => e.id === sc.heroId).say, 'cheat'); assert(Math.abs(sc.entities.find((e) => e.id === sc.heroId).x - qx) < 0.01, 'the hero was not moved into the wall');

    /* ---- Claude (stand-in) fills a step; reaching for a thing and getting it ---- */
    await x.opt('Tell Claude'); await p.fill('#panel textarea', 'A dragon bursts in'); await x.done();
    await p.waitForSelector('.gevents:has-text("A dragon bursts in")');
    assert.equal(await p.locator('#stage .ent').count(), 4);
    await p.click('#resetStep'); assert.equal(await p.locator('#stage .ent').count(), 3, 'reset step undoes what Claude staged');
    await x.add('gold key'); const [kx, ky] = await p.evaluate(() => { const s = document.querySelector('.ent.sel').style; return [parseFloat(s.left) / 100, parseFloat(s.top) / 100]; }); await x.done();
    await toPlayer();
    await p.mouse.click(st.x + st.width * kx, st.y + st.height * ky - 10);
    await p.waitForSelector('.ent.target'); await toDirector();
    await p.click('.card.ask button.primary');
    assert.equal(await p.locator('#sheet .chip.item').count(), 1);
    assert.deepEqual(t.errors, []);
    console.log('E2E-STEPS OK');
  } finally { await t.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
