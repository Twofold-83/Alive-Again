// Adventure features, one person playing both sides: speech bubbles, asking the Player, active objects, use-item-on,
// tying, camera, enter, points, the scene map with exits and travel, and battles.
const assert = require('assert');
const { setup } = require('./lib');
(async () => {
  const t = await setup(3128);
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
    const ent = (slug) => `#stage .ent:has(img[src*="${slug}"])`;
    const thing = (label) => p.click(`.thingbtns button:has-text("${label}")`);
    const pos = (sel) =>
      p.evaluate((s) => {
        const st = document.querySelector(s).style;
        return [parseFloat(st.left) / 100, parseFloat(st.top) / 100];
      }, sel);
    const act = () => p.textContent('.strip.act');

    await p.goto(t.base);
    await p.click('#typeAdventure');
    await p.click('#hotseat');
    await p.waitForSelector('.gopts');
    await x.opt('Story settings');
    assert.match(await p.textContent('#panel .card'), /Adventure.*chosen when the story was created/s);
    await p.click('.chips button:has-text("Points")');
    await x.done();
    await x.add('mage');
    await x.done();
    assert.equal(await p.locator('#stage .ent').count(), 2);
    await p.click('#undoBtn');
    assert.equal(await p.locator('#stage .ent').count(), 1, 'undo takes the last change back');
    await x.add('mage');
    await p.click('[data-lay="1"]');
    assert(Number(await p.evaluate(() => document.querySelector('#stage .ent.sel').style.zIndex)) > 3000, 'brought to the front');
    await p.click('[data-lay="0"]');
    await x.done();
    // tie a sword to the hero: it is drawn where the hero is, and follows
    await x.add('iron sword');
    await thing('Tie to');
    await p.click('#panel .grid button >> nth=0');
    await p.waitForSelector('[data-layer=front].on');
    await p.click('[data-layer=back]');
    await p.click('[data-layer=front]');
    await x.done();
    await x.done();
    let [hx, hy] = await pos('#stage .ent.hero'),
      [sx, sy] = await pos(ent('sword'));
    assert(Math.abs(sx - hx) < 0.3 && Math.abs(sy - hy) < 0.3, 'the tied sword sits with the hero');
    // an active object
    // an active object is made in Build scene, where places are made; then the scene is used in the story
    assert.equal(await p.locator('.gopt:has-text("Add an exit")').count(), 0);
    await x.opt('Build scene');
    await p.waitForSelector('#wsStage');
    await p.waitForSelector('#wsAdd');
    await p.click('[data-wtab=things]');
    await x.add('treasure chest');
    await thing('Active object');
    await p.click('#activeToggle');
    await p.fill('#activeName', 'Old chest');
    await x.done();
    await x.done();
    await p.click('#wsUse');
    await p.waitForSelector('#workshop', { state: 'hidden' });
    assert.equal(await p.locator('#stage .ent').count(), 4, 'hero, tied sword, mage and chest are on stage');
    {
      const b = await p.locator(ent('chest')).boundingBox(),
        st = await p.locator('#stage').boundingBox(); // keep the chest near the middle, in view of the zoomed camera later
      await p.mouse.move(b.x + b.width / 2, b.y + b.height - 4);
      await p.mouse.down();
      await p.mouse.move(st.x + st.width * 0.62, st.y + st.height * 0.62, { steps: 8 });
      await p.mouse.up();
      await p.click('.gdone').catch(() => {});
    }
    await toPlayer();

    /* ---- active object: name on hover, verbs on click ---- */
    assert.equal(await p.getAttribute(ent('chest'), 'data-name'), 'Old chest');
    // a written action can point at a thing or a spot on the stage
    await p.click('#pointBtn');
    await p.click(ent('chest'));
    assert.match(await act(), /Look at 👉 Old chest/);
    {
      const b = await p.locator('#stage').boundingBox();
      await p.click('#pointBtn');
      await p.mouse.click(b.x + b.width * 0.12, b.y + b.height * 0.25);
    }
    await p.waitForSelector('#stage .pointmark');
    assert.match(await act(), /Look at 👉 that spot/);
    await p.click('#pointClear');
    assert.equal(await p.locator('#stage .pointmark').count(), 0);
    assert.equal(await p.locator('#pointClear').count(), 0);
    await p.click(ent('chest'));
    await p.waitForSelector('#verbs');
    assert.match(await p.textContent('#verbs'), /Old chest.*Look at.*Use.*Open/s);
    await p.click('#verbs button:has-text("Open")');
    assert.match(await act(), /Open: Old chest/);
    await x.walk(0.5, 0.9);
    [sx, sy] = await pos(ent('sword'));
    [hx, hy] = await x.heroPos();
    assert(Math.abs(sx - hx) < 0.3 && Math.abs(sy - hy) < 0.3, 'the sword walked along with the hero');
    await p.evaluate(() => {
      window.__gap = 0;
      window.__moved = 0;
      const x0 = parseFloat(document.querySelector('#stage .ent.hero').getBoundingClientRect().x);
      setInterval(() => {
        const h = document.querySelector('#stage .ent.hero').getBoundingClientRect(),
          s = document.querySelector('#stage .ent:has(img[src*="sword"])').getBoundingClientRect();
        window.__gap = Math.max(window.__gap, Math.hypot(h.x - s.x, h.y - s.y));
        window.__moved = Math.max(window.__moved, Math.abs(h.x - x0));
      }, 30);
    });
    await toDirector();
    {
      const g = await p.evaluate(() => [window.__gap, window.__moved]);
      assert(g[0] < 90, `the sword stayed in the hero’s hand while the walk was replayed (gap ${g[0]}px, hero moved ${g[1]}px)`);
    }
    assert.match(await p.textContent('.card.told'), /Open: Old chest/);
    let sc = await x.last();
    assert.equal(sc.verb, 'Open');
    assert(sc.entities.find((e) => e.id === sc.target).active);

    /* ---- speech bubbles belong to their step and do not survive a turn change ---- */
    await x.opt('Someone speaks');
    await p.click('#panel .grid button >> nth=1');
    await p.fill('#panel input', 'It is locked.');
    await x.done();
    assert.match(await p.textContent('#stage .bubbles'), /It is locked/);
    await p.click('#nextStep');
    assert.equal(await p.textContent('#stage .bubbles'), '', 'a new step starts without the old line');
    /* ---- ask for a roll; give an item; points; camera; enter ---- */
    await x.opt('Ask Player');
    await x.opt('Roll a die');
    await p.fill('#askText', 'Can you pick the lock?');
    await p.click('[data-dc="4"]');
    await x.done();
    await x.add('gold key');
    await thing('Give to');
    await x.opt('Award points');
    await p.click('[data-pts="10"]');
    await p.fill('#panel input', 'Good idea');
    await x.done();
    assert.match(await p.textContent('#points'), /10/);
    await x.opt('Camera');
    await p.click('[data-zoom="2"]');
    await x.done();
    assert.equal(
      await p.evaluate(() => getComputedStyle(document.querySelector('#stage .camframe')).display),
      'block',
      'the Director sees a frame, not a zoomed stage',
    );
    await x.opt('Move or animate');
    await p.click('#panel .grid button >> nth=1');
    await x.opt('Enter from the left');
    await p.evaluate(() => {
      window.__seen = { award: false, zoom: false };
      setInterval(() => {
        if (document.querySelector('#stage .awardov').textContent.includes('+10')) window.__seen.award = true;
        if (/scale\(2\)/.test(document.querySelector('#stage .world').style.transform)) window.__seen.zoom = true;
      }, 40);
    });
    await toPlayer();
    assert.deepEqual(await p.evaluate(() => window.__seen), { award: true, zoom: true }, 'the award and the zoom were shown');
    sc = await x.last();
    assert.equal(sc.steps.length, 1);
    assert.equal(sc.steps[0].entities.find((e) => e.say).say, 'It is locked.');
    assert(!sc.entities.some((e) => e.say), 'the line is gone in the next step');
    assert(sc.tracks[0].pts[1] < 0, 'the mage enters from outside the screen');
    assert.equal(sc.cam.z, 2);
    assert.equal(sc.award.n, 10);
    assert.equal(sc.sheet.points, 10);
    assert.equal(sc.ask.kind, 'roll');
    assert.equal(sc.sheet.inv.length, 1);
    // the Player: roll as asked, and use the key ON the chest (clicks still land right while zoomed in)
    assert.match(await p.textContent('.askbox'), /Can you pick the lock\?.*Roll the d6.*4 or more/s);
    await p.click('.askbox button');
    await p.click('#sheet .chip.item');
    await p.click(ent('chest'));
    assert.match(await act(), /uses .* on Old chest.*will roll a d6/s);
    await toDirector();
    sc = await x.last();
    assert.equal(sc.roll.by, 'player');
    assert.equal(sc.roll.sides, 6);
    assert.deepEqual(sc.answer, { kind: 'roll', dc: 4 });
    assert(sc.use && sc.target);
    assert.match(
      await p.textContent('.card.told'),
      new RegExp(`on Old chest.*rolls ${sc.roll.value} \\(d6\\) — ${sc.roll.value >= 4 ? 'success' : 'fails'}`, 's'),
    );
    assert(!sc.entities.some((e) => e.say), 'no speech bubble survives the turn change');

    /* ---- ask: go to a place ---- */
    await p.click('.card.ask button:has-text("No, they keep it")');
    await x.opt('Camera');
    await p.click('[data-zoom="1"]');
    await x.done();
    await x.opt('Ask Player');
    await x.opt('Go to a place');
    await p.click('#addPlace');
    await p.click('#addPlace');
    await x.done();
    await toPlayer();
    assert.equal(await p.locator('#stage .place').count(), 2);
    await p.click('#stage .place >> nth=1');
    await p.waitForFunction(() => /back/.test((document.querySelector('#walkBtn') || {}).textContent || ''));
    await p.waitForTimeout(3500);
    [hx, hy] = await x.heroPos();
    assert(Math.abs(hx - 0.4) < 0.03 && Math.abs(hy - 0.7) < 0.03, `the hero walked to the chosen place (${hx}, ${hy})`);
    await p.fill('#foot input[placeholder^="✋"]', 'Kick');
    await p.click('#pointBtn');
    {
      const b = await p.locator(ent('chest')).boundingBox();
      await p.mouse.click(b.x + b.width / 2, b.y + b.height - 4);
    }
    await toDirector();
    sc = await x.last();
    assert.deepEqual(sc.answer, { kind: 'place', label: 'Place 2' });
    assert.match(await p.textContent('.card.told'), /goes to Place 2/);
    assert(sc.point && sc.point.id, 'the action points at the chest');
    assert.equal(sc.action, 'Kick');
    assert.match(await p.textContent('.card.told'), /Kick 👉 Old chest/);
    /* ---- ask: pick a target; then give up an item ---- */
    await x.opt('Ask Player');
    await x.opt('Pick a target');
    await p.click('#panel > .grid button >> nth=0');
    await x.done();
    await toPlayer();
    await p.click('.askbox .choices button');
    await toDirector();
    sc = await x.last();
    assert.equal(sc.answer.kind, 'target');
    assert.equal(sc.answer.verb, 'Attack');
    assert(sc.target);
    assert.match(await p.textContent('.card.told'), /Attack: /);
    await x.opt('Ask Player');
    await x.opt('Give up an item');
    await x.done();
    await toPlayer();
    await p.click('.askbox .choices button');
    await toDirector();
    sc = await x.last();
    assert.equal(sc.answer.kind, 'discard');
    assert.equal(sc.sheet.inv.length, 0);
    assert.match(await p.textContent('.card.told'), /discards/);

    /* ---- the map: connect two prepared scenes, travel through an exit ---- */
    await x.opt('Map');
    await p.waitForSelector('.wsmap .node');
    assert.equal(await p.locator('.wsmap .node').count(), 1, 'the scene used earlier is on the map');
    await p.click('#mapNew');
    await p.waitForSelector('#wsAdd');
    await p.click('#wsAdd');
    await p.waitForSelector('#wsSaved');
    await p.click('#wsMap');
    await p.waitForSelector('.wsmap .node >> nth=1');
    await p.click('.wsmap .node >> nth=1');
    await p.click('#mapDup');
    assert.equal(await p.locator('.wsmap .node').count(), 3, 'duplicated on the map');
    await p.click('#mapDel');
    assert.equal(await p.locator('.wsmap .node').count(), 2, 'and deleted again');
    await p.click('.wsmap .node >> nth=0');
    await p.click('#mapLink');
    await p.click('.wsmap .node >> nth=1');
    await p.waitForSelector('.wsmap line', { state: 'attached' });
    assert.match(await p.textContent('.wstools'), /Connections \(1\).*Scene [12] ⇄ Scene [12]/s);
    await p.click('.conn button:has-text("Open")');
    await p.waitForSelector('.wsmap line.locked', { state: 'attached' });
    await p.click('.conn button:has-text("Locked")');
    await p.click('#mapEdit');
    await p.waitForSelector('#wsStage .exit');
    await x.shot('a-1-workshop-exit');
    await p.click('#wsUse');
    await p.waitForSelector('#workshop', { state: 'hidden' });
    assert.match(await p.textContent('#stage .exit'), /Scene 2/);
    await toPlayer();
    await p.click('#stage .exit');
    await p.waitForFunction(() => /back/.test((document.querySelector('#walkBtn') || {}).textContent || ''));
    assert.match(await act(), /heads for Scene 2/);
    await p.waitForTimeout(3000);
    await toDirector();
    assert.match(await p.textContent('.card.ask'), /heads for “Scene 2”/);
    await p.click('#travelYes');
    assert.match(await p.textContent('.gevents'), /Traveling to “Scene 2”/);
    await p.evaluate(() => {
      window.__travel = '';
      setInterval(() => {
        const c = document.querySelector('#stage .cardov');
        if (c.classList.contains('travel') && c.textContent) window.__travel = c.textContent;
      }, 40);
    });
    await x.end();
    await side('Player');
    await p.waitForTimeout(900);
    await x.shot('a-2-traveling');
    await x.cutDone();
    assert.match(await p.evaluate(() => window.__travel), /Traveling to\s+Scene 2/);
    sc = await x.last();
    assert.equal(sc.travel, 'Scene 2');
    assert.equal(sc.exits.length, 1);
    assert.equal(sc.exits[0].label, 'Scene 1');
    const hero = () => sc.entities.find((e) => e.id === sc.heroId);
    assert(Math.hypot(hero().x - sc.exits[0].x, hero().y - sc.exits[0].y) < 0.25, 'the hero arrives at the way back');
    assert(
      sc.entities.some((e) => e.tie),
      'the tied sword travelled along',
    );

    /* ---- a battle ---- */
    await toDirector();
    await x.add('goblin');
    await x.done();
    await x.opt('Battle');
    await p.click('#panel > .grid button >> nth=0');
    await p.click('.row button:has-text("3")');
    await p.click('#battleStart');
    assert.equal(
      await p.evaluate(() => getComputedStyle(document.querySelector('#stage .ent:has(img[src*="goblin"]) .hp')).display),
      'block',
      'the enemy shows a health bar',
    );
    await toPlayer();
    assert.match(await p.textContent('.askbox'), /Attack.*Defend.*Flee/s);
    await p.click('.askbox button:has-text("Attack")');
    assert.match(await act(), /attacks/);
    await toDirector();
    sc = await x.last();
    assert.deepEqual(sc.answer, { kind: 'battle', move: 'attack' });
    assert(sc.battle);
    await p.waitForSelector('#heroHits'); // the battle tools open by themselves
    await p.click('#heroHits [data-dmg="2"]'); // one click: animation, damage, sound, and its own step
    assert.equal(await p.locator('.stepchip').count(), 2);
    assert.match(await p.textContent('.statrow:has(.foe)'), /1\/3/);
    await p.click('[data-attack=swing]');
    await p.click('#foeHits [data-dmg="1"]');
    assert.equal(await p.locator('.stepchip').count(), 3);
    await x.shot('a-3-battle');
    await p.evaluate(() => {
      window.__float = [];
      setInterval(() => {
        for (const f of document.querySelectorAll('#stage .float'))
          if (f.textContent && !window.__float.includes(f.textContent)) window.__float.push(f.textContent);
      }, 40);
    });
    await toPlayer();
    assert.deepEqual((await p.evaluate(() => window.__float)).sort(), ['-1', '-2'], 'damage numbers floated over the goblin and the hero');
    sc = await x.last();
    assert.equal(sc.steps.length, 1);
    assert.equal(sc.steps[0].entities.find((e) => e.hp === 1).once, 'hit');
    assert.equal(sc.steps[0].floats[0].text, '-2');
    assert.equal(sc.sheet.stats[0].value, 4, 'the hero lost one health');
    assert.equal(sc.battle.round, 2);
    assert.equal(sc.burst, 'hurt');
    assert.equal(sc.ask.kind, 'battle');
    assert.equal(sc.entities.find((e) => e.tie && e.asset.includes('sword')).once, '', 'the hero’s sword swing belonged to the first step');
    assert.equal(sc.steps[0].entities.find((e) => e.tie).once, 'swing', 'the tied sword swung with the hero’s attack');
    // finish it
    await p.click('.askbox button:has-text("Attack")');
    await toDirector();
    await p.click('#heroHits [data-dmg="2"]'); // the last enemy falls: the battle ends by itself
    assert.match(await p.textContent('.gtitle'), /what happens/);
    await toPlayer();
    sc = await x.last();
    assert.equal(sc.battle, null);
    assert.equal(sc.ask, null);
    await x.walk(0.5, 0.8);
    await toDirector();
    sc = await x.last();
    assert(!sc.entities.some((e) => e.asset.includes('goblin')), 'the defeated goblin is gone');
    assert.deepEqual(t.errors, []);
    console.log('E2E-ADVENTURE OK');
  } finally {
    await t.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
