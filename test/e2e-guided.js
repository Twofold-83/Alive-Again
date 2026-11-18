// The guided (step-by-step) Director mode, in "both sides" mode on a phone, with a stand-in for Claude.
const { chromium, devices } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const assert = require('assert');
const shots = process.argv[2];
(async () => {
  const PORT = 3126, base = `http://localhost:${PORT}`;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'twofold-'));
  const srv = spawn('node', [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT, DATA_DIR: dataDir, DIRECTOR_AI: path.join(__dirname, 'fake-ai.js') }, stdio: 'inherit' });
  await new Promise((r) => setTimeout(r, 700));
  const browser = await chromium.launch();
  const errors = [];
  const shot = async (p, n) => { if (shots) await p.screenshot({ path: path.join(shots, n + '.png') }); };
  const cutDone = (p) => p.waitForFunction(() => !document.querySelector('#stage').classList.contains('cut'), null, { timeout: 30000 });
  const last = (p) => p.evaluate(async () => (await (await fetch(`/api/rooms/${location.hash.slice(1)}/history`)).json()).history.at(-1).scene);
  try {
    const c = await browser.newContext({ ...devices['iPhone 13'] });
    const p = await c.newPage(); p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/ERR_|Failed to load/.test(m.text())) errors.push(m.text()); });
    const opt = (label) => p.tap(`.gopt:has-text("${label}")`);
    await p.goto(base); await p.tap('#hotseat');
    await p.waitForSelector('.gopts');                                   // guided is the default
    assert.match(await p.textContent('.gtitle'), /Set the stage/);
    await p.tap('.typerow button:nth-of-type(2)');                        // adventure
    // add a character through the flow
    await opt('Add something'); await opt('A character');
    await p.tap('.chips button:has-text("Fantasy")'); await p.tap('.grid button[title^="wizard"]');
    await p.waitForSelector('.ghead:has-text("is on stage")');
    assert(await p.isDisabled('#foot button.go'), 'cannot end the turn in the middle of a step');
    await p.fill('#panel input', 'Welcome.'); await p.tap('.gdone');
    await p.waitForSelector('.gevents'); assert.match(await p.textContent('.gevents'), /1\. 🧙 appears/);
    // add a thing via search, then undo it
    await opt('Add something'); await opt('Search by name'); await p.fill('input[type=search]', 'old key'); await p.tap('.grid button'); await p.tap('.gdone');
    assert.equal(await p.locator('#stage .ent').count(), 3);
    await p.tap('.gevents button:has-text("Undo")');
    assert.equal(await p.locator('#stage .ent').count(), 2);
    // back out of a flow half-way: nothing changes
    await opt('Change the scene'); await opt('The weather'); await p.tap('[data-mark="weather=snow"]'); await p.tap('.gback'); await p.tap('.gback');
    await p.waitForSelector('.gopts'); assert.equal(await p.evaluate(() => document.querySelector('#stage .weather').className), 'weather');
    // scene: place
    await opt('Change the scene'); await opt('The place'); await p.tap('[data-mark="backdrop=b:forest"]'); await p.tap('.gdone');
    await shot(p, 'g-1-root');
    await p.tap('#foot button.go');
    await p.waitForFunction(() => /Player/.test(document.querySelector('#banner').textContent)); await cutDone(p);
    // Player
    await p.fill('#foot input >> nth=0', 'Who are you?'); await p.fill('#foot input >> nth=1', 'steps closer'); await p.tap('#foot button.go');
    await p.waitForFunction(() => /Director/.test(document.querySelector('#banner').textContent)); await cutDone(p);
    // Director sees what the Player did, then works in events
    await p.waitForSelector('.card.told');
    assert.match(await p.textContent('.card.told'), /Who are you\?.*steps closer/s);
    assert.match(await p.textContent('.gtitle'), /Event 1 of 5/);
    // 1: speak — answer "who?" by tapping the wizard on the stage
    await opt('Someone speaks'); await p.waitForSelector('.ghead:has-text("Who speaks")');
    await p.tap('#stage .ent:not(.hero)');
    await p.waitForSelector('.ghead:has-text("What does")'); await p.fill('#panel input', 'A friend. Follow me.'); await p.tap('.gdone');
    // 2: animate — walk to the hero
    await opt('Move or animate'); await p.tap('#panel .grid button:not(.heroopt)'); await opt('Walk to the hero');
    assert.match(await p.textContent('.gevents'), /2\. 🧙 walks up to the hero/);
    // 3: animate — jump (queued after the walk)
    await opt('Move or animate'); await p.tap('#panel .grid button:not(.heroopt)'); await opt('Jump');
    // 4: Claude
    await opt('Tell Claude'); await p.fill('#panel textarea', 'A dragon bursts in'); await p.tap('.gdone');
    await p.waitForSelector('.ghead:has-text("Claude staged it")');
    assert.match(await p.textContent('#panel .card'), /Staged: A dragon bursts in/);
    await shot(p, 'g-2-claude');
    await p.tap('.gdone');
    // 5: narrate -> limit reached
    await opt('Narrate'); await p.fill('#panel input', 'Nothing will be the same.'); await p.tap('.gdone');
    assert.match(await p.textContent('.gtitle'), /five events/); assert.equal(await p.locator('.gopts').count(), 0);
    await shot(p, 'g-3-five');
    await p.tap('#foot button.go');
    await p.waitForFunction(() => /Player/.test(document.querySelector('#banner').textContent));
    const sc = await last(p);
    const wiz = sc.entities.find((e) => e.asset === 's:wizard-mage'), dragon = sc.entities.find((e) => e.asset === 'e:🐉');
    assert.equal(wiz.say, 'A friend. Follow me.'); assert(dragon && dragon.say === 'ROAR!');
    // every event is its own moment, in the order it was made
    assert.equal(sc.steps.length, 4);
    assert.equal(sc.steps[0].entities.find((e) => e.id === wiz.id).say, 'A friend. Follow me.'); assert.equal(sc.steps[0].tracks.length, 0);
    assert.equal(sc.steps[1].tracks.length, 1); assert.equal(sc.steps[1].tracks[0].id, wiz.id);          // walks to the hero
    assert.equal(sc.steps[2].tracks.length, 1); assert(sc.steps[2].tracks[0].pts.length >= 12);          // jumps
    assert(!sc.steps[2].entities.some((e) => e.asset === 'e:🐉'), 'the dragon is not there before Claude’s step');
    assert.equal(sc.steps[3].backdrop, 'b:cave'); assert.equal(sc.steps[3].narration, 'The wall explodes.'); assert.equal(sc.steps[3].burst, 'shake');
    assert.equal(sc.steps[3].tracks[0].id, dragon.id);
    assert.equal(sc.narration, 'Nothing will be the same.'); assert.equal(sc.tracks.length, 0); assert.equal(sc.burst, '');
    assert.equal(sc.backdrop, 'b:cave'); assert.equal(sc.sheet.stats[0].value, 3);
    await cutDone(p);
    // switching to all tools and back keeps working
    await p.tap('#foot button.go'); await p.waitForFunction(() => /Director/.test(document.querySelector('#banner').textContent)); await cutDone(p);
    await p.tap('[data-mode=studio]'); await p.waitForSelector('.tabs'); await p.tap('[data-mode=guided]'); await p.waitForSelector('.gopts');
    assert.deepEqual(errors, []);
    console.log('E2E-GUIDED OK');
  } finally { await browser.close(); srv.kill(); await new Promise((r) => setTimeout(r, 400)); try { fs.rmSync(dataDir, { recursive: true, force: true }); } catch { /* still saving */ } }
})().catch((e) => { console.error(e); process.exit(1); });
