// Simulation: play many random turns as cut scenes (sped up) and measure what the viewer sees.
// Usage: node test/sim-cuts.js [turns] [seed]   — prints a report; exits 1 if any hard problem is found.
const { setup } = require('./lib');
(async () => {
  const N = Number(process.argv[2]) || 60, SEED = Number(process.argv[3]) || 7;
  const t = await setup(3129);
  try {
    const x = await t.open(), p = x.p;
    await p.goto(t.base);
    const rep = await p.evaluate(async ([N, SEED]) => {
      const { renderStage, playTurn, norm } = await import('/stage.js');
      let s = SEED; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296), pick = (a) => a[Math.floor(rnd() * a.length)], chance = (q) => rnd() < q;
      const WORDS = 'the old door creaks and a cold wind follows you into the hall where something waits behind the curtain of dust nobody has dared to move for years'.split(' ');
      const text = (n) => { let o = ''; while (o.length < n) o += pick(WORDS) + ' '; return o.slice(0, n).trim() + pick(['.', '!', '?']); };
      const ASSETS = ['p:mage', 'p:knight', 'p:goblin', 'p:crate', 'p:key-gold', 'p:dragon', 'e:🧙', 'e:🐉'];
      const ent = (id, asset) => ({ id, asset, x: 0.08 + rnd() * 0.84, y: 0.45 + rnd() * 0.5, scale: pick([0.7, 1, 1, 1, 1.4, 2]), flip: false, rot: 0, say: '', fx: '', emote: '', solid: false, active: null, tie: null, hp: null, maxHp: null, once: '', temp: false, layer: 0 });
      const blank = () => norm({ backdrop: 'b:meadow', mood: 'm:none', narration: '', action: '', heroId: 'hero', entities: [ent('hero', 'p:hero')], drawing: [], weather: '', tracks: [], burst: '', sfx: '', card: '', choices: [], steps: [], sheet: { inv: [], stats: [] }, target: null, use: null, roll: null, level: null });
      const clone = (o) => JSON.parse(JSON.stringify(o));
      const stage = document.createElement('div'); stage.className = 'stage'; stage.style.cssText = 'position:fixed;left:0;top:0;width:800px;z-index:999'; document.body.append(stage);
      const issues = [], stats = { turns: 0, steps: 0, lines: 0, seconds: 0, longest: 0 };
      const note = (kind, detail) => issues.push({ kind, detail });
      const sig = () => JSON.stringify([[...stage.querySelectorAll('.ent')].map((e) => [e.dataset.id, e.style.left, e.style.top]).sort(), [...stage.querySelectorAll('.bubble')].map((b) => b.textContent).sort(), stage.querySelector('.strip.narr').textContent]);
      for (let n = 0; n < N; n++) {
        const before = blank();
        for (let i = 0, k = 1 + Math.floor(rnd() * 5); i < k; i++) before.entities.push(ent('e' + i, pick(ASSETS)));
        // a turn of 1-4 steps, each changing a few things
        let cur = clone(before); const frames = [];
        for (let st = 0, k = 1 + Math.floor(rnd() * 4); st < k; st++) {
          cur = clone(cur); Object.assign(cur, { tracks: [], burst: '', sfx: '', card: '', travel: '', award: null, floats: [] });
          for (const e of cur.entities) { e.say = ''; e.once = ''; }
          const others = cur.entities.filter((e) => e.id !== 'hero');
          if (chance(0.75)) for (const e of others.sort(() => rnd() - 0.5).slice(0, 1 + Math.floor(rnd() * 3))) e.say = text(pick([6, 20, 45, 90, 150]));
          if (chance(0.5)) cur.narration = text(pick([20, 60, 120, 230]));
          if (chance(0.4)) for (const e of others.slice(0, 2)) { e.x = 0.05 + rnd() * 0.9; e.y = 0.3 + rnd() * 0.68; }
          if (chance(0.3) && others[0]) { const e = others[0]; cur.tracks.push({ id: e.id, pts: [0, chance(0.5) ? -0.18 : e.x, e.y, 700, 0.2 + rnd() * 0.6, 0.4 + rnd() * 0.5, 1500, e.x, e.y] }); }
          if (chance(0.25)) cur.entities.push(ent('n' + n + st, pick(ASSETS)));
          if (chance(0.15) && others.length > 1) cur.entities = cur.entities.filter((e) => e !== others[others.length - 1]);
          if (chance(0.15)) cur.backdrop = pick(['b:forest', 'b:cave', 'b:night', 'b:room']);
          if (chance(0.12)) cur.card = 'Chapter ' + (st + 1);
          if (chance(0.12)) cur.cam = chance(0.5) ? { x: rnd(), y: rnd(), z: pick([1.5, 2, 3]) } : null;
          if (chance(0.1)) cur.award = { n: 10, text: 'Nice' };
          frames.push(norm(clone(cur)));
        }
        const after = { ...frames[frames.length - 1], steps: frames.slice(0, -1) };
        const SP = 8, seen = new Map(), t0 = performance.now(); let lastSig = '';
        const now = () => (performance.now() - t0) * SP;
        await new Promise((ok) => {
          const cut = playTurn(stage, before, after, { code: '', names: { player: 'Sam', director: 'Mia' }, by: 'director', speed: SP, who: 'sim' }, ok);
          const watch = () => {
            if (!stage.classList.contains('cine')) return;
            const st = stage.getBoundingClientRect(), bs = [...stage.querySelectorAll('.bubble')], narr = stage.querySelector('.strip.narr').getBoundingClientRect();
            const rects = bs.map((b) => ({ b, r: b.getBoundingClientRect(), old: b.classList.contains('old') }));
            for (const q of rects) {
              const key = q.b.dataset.id + '|' + stage.dataset.step, rec = seen.get(key) || { first: now(), max: '', fullAt: 0, last: 0 };
              if (q.b.textContent.length > rec.max.length) { rec.max = q.b.textContent; rec.fullAt = now(); }
              rec.last = now(); seen.set(key, rec);
              if (!q.old && (q.r.top < st.top - 1 || q.r.left < st.left - 1 || q.r.right > st.right + 1)) note('bubble leaves the stage', [Math.round(q.r.left - st.left), Math.round(q.r.top - st.top), Math.round(q.r.width), Math.round(q.r.height), q.b.style.transform, q.b.className].join(' '));
              if (!q.old && narr.height > 4 && q.r.bottom > narr.top + 2 && q.r.top < narr.bottom) note('bubble covers the narration', q.b.textContent.slice(0, 30));
            }
            for (let a = 0; a < rects.length; a++) for (let b = a + 1; b < rects.length; b++) {
              const A = rects[a].r, B = rects[b].r, w = Math.min(A.right, B.right) - Math.max(A.left, B.left), h = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
              if (w > 6 && h > 6 && (w * h) / Math.min(A.width * A.height, B.width * B.height) > 0.2) note('bubbles overlap', rects[a].b.textContent.slice(0, 20) + ' / ' + rects[b].b.textContent.slice(0, 20));
            }
            requestAnimationFrame(watch);
          };
          requestAnimationFrame(watch);
        });
        const dur = now();
        for (const rec of seen.values()) { stats.lines++; const read = rec.last - rec.fullAt, need = 400 + 20 * rec.max.length; if (read < need) note('line gone too soon', `${Math.round(read)}ms for ${rec.max.length} chars`); }
        const end = sig(); renderStage(stage, after, { code: '', names: { player: 'Sam', director: 'Mia' } });
        if (sig() !== end) note('end of playback differs from the real scene', 'turn ' + n);
        if (dur > 90000) note('turn plays longer than a minute and a half', Math.round(dur / 1000) + 's for ' + frames.length + ' steps');
        stats.turns++; stats.steps += frames.length; stats.seconds += dur / 1000; stats.longest = Math.max(stats.longest, dur / 1000);
      }
      const by = {}; for (const i of issues) (by[i.kind] ||= []).push(i.detail);
      return { stats, kinds: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, { count: v.length, e: v.slice(0, 3) }])) };
    }, [N, SEED]);
    const st = rep.stats;
    console.log(`simulated ${st.turns} turns, ${st.steps} steps, ${st.lines} lines; average ${(st.seconds / st.turns).toFixed(1)}s per turn, longest ${st.longest.toFixed(1)}s`);
    for (const [k, v] of Object.entries(rep.kinds)) console.log(`  ${k}: ${v.count}   e.g. ${JSON.stringify(v.e)}`);
    if (t.errors.length) console.log('  page errors:', t.errors.slice(0, 3));
    const hard = Object.keys(rep.kinds).length + t.errors.length;
    console.log(hard ? 'SIM FOUND PROBLEMS' : 'SIM OK');
    process.exitCode = hard ? 1 : 0;
  } finally { await t.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
