// Dungeon mode in real browsers: two people, a solo hero, a solo Overlord, and one person on both sides.
const assert = require('assert');
const { setup } = require('./lib');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const t = await setup(3131);
  const st = (x, f) => x.p.evaluate(`(() => { const st = window.rpgDebug.st; return ${f}; })()`);
  const tap = async (x, key, ms = 60) => { await x.p.keyboard.down(key); await sleep(ms); await x.p.keyboard.up(key); await sleep(170); };
  try {
    /* ---- two people ---- */
    const D = await t.open(); await D.p.goto(t.base); await D.p.fill('#name', 'Morgoth'); await D.p.click('#typeRpg');
    assert.match(await D.p.textContent('#newDirector'), /Overlord/);
    await D.p.click('#newDirector'); await D.p.waitForSelector('#rpgStart');
    const code = await D.p.evaluate(() => location.hash.slice(1));
    const P = await t.open(); await P.p.goto(t.base + '/#' + code); await P.p.fill('#name', 'Link-ish'); await P.p.click('#joinBtn');
    await P.p.waitForSelector('#rpgCard:not([hidden])'); assert.match(await P.p.textContent('#rpgCard'), /building the castle/);
    // the Overlord edits: paints a slime into the start room, picks turn-based and back
    const box = await D.p.locator('#rpgCanvas').boundingBox(), tile = (x, y) => [box.x + ((x + 0.5) / 15) * box.width, box.y + ((y + 0.5) / 11) * box.height];
    const before = await D.p.evaluate(() => JSON.stringify(window.rpgDebug.def));
    await D.p.click('[data-tool="1"]'); await D.p.mouse.click(...tile(2, 2)); await D.p.mouse.click(...tile(0, 0));
    const def = await D.p.evaluate(() => window.rpgDebug.def), start = Object.keys(def.rooms).find((k) => def.rooms[k].t.includes('S'));
    assert.equal(def.rooms[start].t[2 * 15 + 2], '1', 'painted a slime'); assert.equal(def.rooms[start].t[0], '#', 'the outer wall cannot be painted over');
    await D.p.click('#rpgUndo'); await D.p.click('#rpgUndo'); assert.equal(await D.p.evaluate(() => JSON.stringify(window.rpgDebug.def)), before, 'undo');
    await D.p.click('#rpgTurn'); await D.p.click('#rpgLive');
    await D.shot('rpg-1-editor');
    await D.p.click('#rpgStart');
    await P.p.waitForSelector('#rpgHearts'); await D.p.waitForSelector('#rpgDread');
    assert.equal(await st(P, 'st.mode'), 'live');
    // the hero walks; the Overlord sees it
    const x0 = await st(P, 'st.hero.x'), steps0 = await st(P, 'st.stats.steps');
    await tap(P, 'ArrowLeft'); await tap(P, 'ArrowLeft'); await tap(P, 'd'); await tap(P, ' ');
    assert(await st(P, 'st.stats.steps') > steps0, 'the hero walked');
    await D.p.waitForFunction((s) => window.rpgDebug.st && window.rpgDebug.st.stats.steps > s, steps0);
    // the Overlord summons a monster far from the hero and whispers
    const hx = await st(P, 'st.hero.x'), spot = await st(P, `(() => { const r = st.rooms[st.cur]; for (let y = 1; y < 10; y++) for (let x = 1; x < 14; x++) if (r.t[y * 15 + x] === '.' && Math.abs(x - st.hero.x) + Math.abs(y - st.hero.y) > 5 && !st.mobs.some((m) => m.r === st.cur && m.x === x && m.y === y) && !st.items.some((m) => m.r === st.cur && m.x === x && m.y === y)) return [x, y]; })()`);
    const mobs0 = await st(P, 'st.mobs.length');
    await D.p.click('[data-tool="slime"]'); await D.p.mouse.click(...tile(...spot));
    await P.p.waitForFunction((n) => window.rpgDebug.st.mobs.length === n + 1, mobs0);
    await D.p.fill('#rpgWhisper', 'I see you'); await D.p.keyboard.press('Enter');
    await P.p.waitForFunction(() => /I see you/.test(document.querySelector('#rpgMsg').textContent) && !document.querySelector('#rpgMsg').hidden);
    await D.p.click('[data-power="dark"]'); await P.p.waitForFunction(() => window.rpgDebug.st.dark > window.rpgDebug.st.t);
    await P.shot('rpg-2-hero'); await D.shot('rpg-3-overlord');
    // the hero's browser reloads: the game is still there
    const steps1 = await st(P, 'st.stats.steps');
    await sleep(400); await P.p.reload(); await P.p.waitForSelector('#rpgHearts');
    assert(await st(P, 'st.stats.steps') >= steps1, 'the game survives a reload'); assert(await st(P, 'st.mobs.length') >= mobs0 + 1);
    // the hero falls: both see the end, the Overlord goes back to the workshop
    await P.p.evaluate(() => { const s = window.rpgDebug.st; s.hero.hp = 0; s.phase = 'lost'; });
    await P.p.waitForSelector('#rpgCard:not([hidden])'); assert.match(await P.p.textContent('#rpgCard'), /You lose/);
    await D.p.waitForSelector('#rpgAgain'); assert.match(await D.p.textContent('#rpgCard'), /You win/);
    await D.p.click('#rpgAgain'); await D.p.waitForSelector('#rpgStart'); await P.p.waitForFunction(() => /building the castle/.test(document.querySelector('#rpgCard').textContent));
    await D.p.context().close(); await P.p.context().close();

    /* ---- alone as the hero, turn-based, against the computer Overlord ---- */
    const H = await t.open(); await H.p.goto(t.base); await H.p.click('#typeRpg'); await H.p.click('#soloPlayer');
    await H.p.waitForSelector('#rpgEnter'); await H.p.click('#rpgTurn'); await H.p.click('#rpgEnter'); await H.p.waitForSelector('#rpgTurnInfo');
    assert.equal(await st(H, 'st.mode'), 'turn'); assert.equal(await st(H, 'st.turn.ap'), 5);
    for (let i = 0; i < 5; i++) { await H.p.keyboard.press(i % 2 ? 'ArrowLeft' : 'ArrowRight'); await sleep(200); }
    if (await st(H, 'st.turn.who') === 'hero' && await st(H, 'st.turn.ap') > 0) for (let i = await st(H, 'st.turn.ap'); i > 0; i--) { await H.p.click('#rpgSword'); await sleep(200); }
    await H.p.waitForFunction(() => window.rpgDebug.st.turn.who === 'hero' && window.rpgDebug.st.turn.ap === 5 && window.rpgDebug.st.t > 1, null, { timeout: 8000 });   // the Overlord took its turn
    await H.shot('rpg-4-turn');
    await H.p.context().close();

    /* ---- alone as the Overlord: the computer hero explores by itself ---- */
    const O = await t.open(); await O.p.goto(t.base); await O.p.click('#typeRpg'); await O.p.click('#soloDirector');
    await O.p.waitForSelector('#rpgStart'); await O.p.click('#rpgRandom'); await O.p.click('#rpgStart'); await O.p.waitForSelector('#rpgDread');
    await O.p.waitForFunction(() => window.rpgDebug.st && window.rpgDebug.st.stats.steps > 12, null, { timeout: 15000 });
    await O.p.click('[data-power="quake"]').catch(() => {});
    await O.p.context().close();

    /* ---- one person on both sides ---- */
    const B = await t.open(); await B.p.goto(t.base); await B.p.click('#typeRpg'); await B.p.click('#hotseat');
    await B.p.waitForSelector('#rpgStart'); await B.p.click('#rpgStart'); await B.p.waitForSelector('#rpgDread'); await B.p.waitForSelector('#rpgSword');
    const s0 = await st(B, 'st.stats.steps');
    for (const k of ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']) await tap(B, k, 200);
    assert(await st(B, 'st.stats.steps') > s0);
    assert.equal(await B.p.evaluate(() => document.body.innerText.includes('null')), false, 'no stray "null" on screen');
    await B.p.click('#top button[aria-label="Leave"]'); await B.p.waitForSelector('#home:not([hidden])');
    await sleep(300);
    assert.deepEqual(t.errors, []);
    console.log('E2E-RPG OK');
  } catch (e) { console.error(e); console.error(t.errors); process.exitCode = 1; } finally { await t.browser.close(); t.srv.kill(); }
})();
