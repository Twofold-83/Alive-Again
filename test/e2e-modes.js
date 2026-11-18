// Step order in playback, and the three Player modes + game movement. Desktop window, "both sides" mode.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const assert = require('assert');
const shots = process.argv[2];
(async () => {
  const PORT = 3127, base = `http://localhost:${PORT}`;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'twofold-'));
  const srv = spawn('node', [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT, DATA_DIR: dataDir }, stdio: 'inherit' });
  await new Promise((r) => setTimeout(r, 700));
  const browser = await chromium.launch();
  const errors = [];
  try {
    const p = await (await browser.newContext({ viewport: { width: 1366, height: 768 } })).newPage();
    p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/ERR_|Failed to load/.test(m.text())) errors.push(m.text()); });
    const shot = async (n) => { if (shots) await p.screenshot({ path: path.join(shots, n + '.png') }); };
    const opt = (label) => p.click(`.gopt:has-text("${label}")`);
    const cutDone = () => p.waitForFunction(() => !document.querySelector('#stage').classList.contains('cut'), null, { timeout: 40000 });
    const side = (who) => p.waitForFunction((w) => new RegExp(w).test(document.querySelector('#banner').textContent), who);
    const last = () => p.evaluate(async () => (await (await fetch(`/api/rooms/${location.hash.slice(1)}/history`)).json()).history.at(-1).scene);
    const end = () => p.click('#foot button.go');
    const heroX = () => p.evaluate(() => parseFloat(document.querySelector('.ent.hero').style.left) / 100);
    const dragHero = async (dx) => {
      const b = await p.locator('.ent.hero').boundingBox(), st = await p.locator('#stage').boundingBox();
      const x0 = b.x + b.width / 2, y0 = b.y + b.height - 4;
      await p.mouse.move(x0, y0); await p.mouse.down();
      for (let i = 1; i <= 12; i++) { await p.mouse.move(x0 + (st.width * dx * i) / 12, y0 - (i % 2) * 6); await p.waitForTimeout(70); }
      await p.mouse.up();
    };

    await p.goto(base); await p.click('#hotseat'); await p.waitForSelector('.gopts');
    const right = await p.locator('#right').boundingBox(), stage = await p.locator('#stage').boundingBox();
    assert(right.x >= stage.x + stage.width - 2 && right.width >= 400, 'desktop: tool column to the right of the stage');
    await shot('m-0-setup');

    /* ---- Narration mode: the Player only writes ---- */
    await opt('Rules of the story'); await p.click('[data-pmode=tell]'); await p.click('.gdone');
    await opt('Add something'); await opt('Search by name'); await p.fill('input[type=search]', 'wizard'); await p.click('.grid button'); await p.click('.gdone');
    await end(); await side('Player'); await cutDone();
    const x0 = await heroX();
    await p.mouse.click(stage.x + 80, stage.y + stage.height - 60);                 // the stage does not respond
    assert.equal(await heroX(), x0);
    assert.equal(await p.locator('#foot input').count(), 0, 'no say/do fields in narration mode');
    await p.fill('#tellBox', 'I walk to the old man and ask him the way to the castle.');
    assert.equal(await p.textContent('.strip.act'), '', 'nothing changes on the stage while writing');
    await shot('m-1-tell');
    await end(); await side('Director'); await cutDone();
    let sc = await last();
    assert.equal(sc.action, 'I walk to the old man and ask him the way to the castle.'); assert.equal(sc.entities.find((e) => e.id === sc.heroId).x, x0);

    /* ---- Director: five events, played back in exactly this order ---- */
    assert.match(await p.textContent('.card.told'), /ask him the way to the castle/);
    await opt('Change the scene'); await opt('The place'); await p.click('[data-mark="backdrop=b:forest"]'); await p.click('.gdone');
    await opt('Narrate'); await p.fill('#panel input', 'The road ends at a forest.'); await p.click('.gdone');
    await opt('Change the scene'); await opt('The weather'); await p.click('[data-mark="weather=rain"]'); await p.click('.gdone');
    await opt('Narrate'); assert.equal(await p.inputValue('#panel input'), '', 'a new narration starts empty');
    await p.fill('#panel input', 'It begins to rain.'); await p.click('.gdone');
    await opt('Someone speaks'); await p.click('#panel .grid button:not(.heroopt)'); await p.fill('#panel input', 'The castle? Follow the river.'); await p.click('.gdone');
    await shot('m-2-five-events');
    await p.evaluate(() => { window.__seq = []; setInterval(() => { const st = document.querySelector('#stage'); const k = [st.querySelector('.bg').style.background.includes('rgb(15, 61, 42)') ? 'forest' : 'room', st.querySelector('.weather').className.includes('rain') ? 'rain' : 'dry', st.querySelector('.strip.narr').textContent, st.querySelector('.bubbles').textContent].join('|'); if (window.__seq.at(-1) !== k) window.__seq.push(k); }, 40); });
    await end(); await side('Player'); await cutDone();
    const seq = await p.evaluate(() => window.__seq);
    const at = (re) => seq.findIndex((k) => re.test(k));
    const order = [at(/^forest\|dry\|\|$/), at(/^forest\|dry\|The road ends at a forest\.\|$/), at(/^forest\|rain\|The road ends at a forest\.\|$/), at(/^forest\|rain\|It begins to rain\.\|$/), at(/^forest\|rain\|It begins to rain\.\|The castle\? Follow the river\.$/)];
    assert(order.every((i) => i >= 0) && order.every((v, i) => i === 0 || v > order[i - 1]), 'the Player saw the events one by one, in order: ' + JSON.stringify(seq));
    sc = await last();
    assert.equal(sc.steps.length, 4);
    assert.deepEqual(sc.steps.map((f) => [f.backdrop, f.weather, f.narration]), [['b:forest', '', ''], ['b:forest', '', 'The road ends at a forest.'], ['b:forest', 'rain', 'The road ends at a forest.'], ['b:forest', 'rain', 'It begins to rain.']]);
    assert.equal(sc.narration, 'It begins to rain.');

    /* ---- Limited will: the Player must pick one of the Director's options ---- */
    await p.fill('#tellBox', 'I wait.'); await end(); await side('Director'); await cutDone();
    await opt('Rules of the story'); await p.click('[data-pmode=limited]'); await p.click('.gdone');
    await p.click('.card.ask button.primary');                                        // "write the options" reminder
    await p.fill('input[placeholder="Choice 1"]', 'Follow the river'); await p.fill('input[placeholder="Choice 2"]', 'Go back'); await p.click('.gdone');
    await end(); await side('Player'); await cutDone();
    assert(await p.isDisabled('#foot button.go'), 'cannot end the turn before choosing');
    assert.equal(await p.locator('#foot input').count(), 1, 'only the speech field');
    await p.click('#foot .choices button:has-text("Go back")'); await p.fill('#foot input', 'No thanks.');
    await shot('m-3-limited');
    await end(); await side('Director'); await cutDone();
    sc = await last(); assert.equal(sc.action, 'Go back'); assert.equal(sc.entities.find((e) => e.id === sc.heroId).say, 'No thanks.');

    /* ---- Adventure + free will + game movement ---- */
    await opt('Rules of the story'); await p.click('.card .chips button:has-text("Adventure")'); await p.click('[data-pmode=free]'); await p.click('[data-range="0.15"]'); await p.click('.gdone');
    await end(); await side('Player'); await cutDone();
    await p.waitForFunction(() => getComputedStyle(document.querySelector('#stage .range')).display === 'block');
    const xa = await heroX(); await dragHero(0.45); const xb = await heroX();
    assert(xb - xa > 0.1 && xb - xa <= 0.151, `walk limited to the range, moved ${xb - xa}`);
    await shot('m-4-range');
    await end(); await side('Director'); await cutDone();
    sc = await last(); assert(Math.abs(sc.entities.find((e) => e.id === sc.heroId).x - xb) < 0.01); assert.equal(sc.tracks.length, 0);
    // free will without a limit: the Player's own path is recorded and replayed
    await opt('Rules of the story'); await p.click('[data-range="0"]'); await p.click('.gdone');
    await end(); await side('Player'); await cutDone();
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector('#stage .range')).display), 'none');
    await dragHero(-0.4);
    await end(); await side('Director'); await cutDone();
    sc = await last();
    assert.equal(sc.tracks.length, 1); assert.equal(sc.tracks[0].id, sc.heroId); assert(sc.tracks[0].pts.length >= 12, 'the hero’s walk was recorded');
    assert.deepEqual(errors, []);
    console.log('E2E-MODES OK');
  } finally { await browser.close(); srv.kill(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(dataDir, { recursive: true, force: true }); } catch { /* still saving */ } }
})().catch((e) => { console.error(e); process.exit(1); });
