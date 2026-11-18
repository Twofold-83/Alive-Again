/* The stage: draws a scene, and plays a turn back as a short "cut scene". */
import { backdropCss, spriteView, assetLabel } from './catalog.js';

export function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}
export const clone = (o) => JSON.parse(JSON.stringify(o));
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Fill in fields that older saved scenes do not have. */
export function norm(sc) {
  if (!sc) return sc;
  sc.drawing ||= []; sc.tracks ||= []; sc.choices ||= []; sc.steps ||= [];
  for (const f of sc.steps) norm(f);
  sc.sheet ||= { inv: [], stats: [] }; sc.sheet.inv ||= []; sc.sheet.stats ||= [];
  for (const e of sc.entities) { e.rot ||= 0; e.fx ||= ''; e.emote ||= ''; }
  return sc;
}

export function glyphNode(code, asset, cls = '') {
  const v = spriteView(code, asset);
  return v.img ? h('img', { class: cls, src: v.img, alt: '', draggable: 'false' }) : h('span', { class: cls }, v.glyph);
}

/** The sentence describing what the Player did this turn. */
export function actionText(scene, names, pendingRoll) {
  const bits = [];
  const item = scene.use && scene.sheet.inv.find((i) => i.id === scene.use);
  if (item) bits.push('uses ' + assetLabel(item.asset, item.name));
  const t = scene.target && scene.entities.find((e) => e.id === scene.target);
  if (t) bits.push('reaches for ' + assetLabel(t.asset));
  if (scene.action) bits.push(scene.action);
  if (scene.roll && scene.roll.by === 'player') bits.push(`🎲 rolls ${scene.roll.value} (d${scene.roll.sides})`);
  else if (pendingRoll) bits.push(`🎲 will roll a d${pendingRoll}`);
  return bits.length ? `✋ ${names.player}: ${bits.join(' · ')}` : '';
}

const SVG = 'http://www.w3.org/2000/svg';

/**
 * Draw `scene` into `root`. Options:
 *   code, names        story code (for custom asset urls) and player names
 *   selId              entity to outline (Director editing)
 *   pendingRoll        die the Player has asked to roll this turn
 *   pop, card, dice, newStrokes   used by playCut while presenting
 */
export function renderStage(root, scene, o = {}) {
  if (!root._els) {
    root._els = new Map();
    const draw = document.createElementNS(SVG, 'svg');
    draw.setAttribute('class', 'draw'); draw.setAttribute('viewBox', '0 0 400 300'); draw.setAttribute('preserveAspectRatio', 'none');
    root.append(h('div', { class: 'bg' }), draw, h('div', { class: 'ents' }), h('div', { class: 'weather' }), h('div', { class: 'bubbles' }),
      h('div', { class: 'strip act' }), h('div', { class: 'strip narr' }), h('div', { class: 'cardov' }), h('div', { class: 'diceov' }), h('div', { class: 'range' }));
    const fit = () => root.style.setProperty('--u', root.clientWidth / 8 + 'px');
    new ResizeObserver(fit).observe(root); fit();
  }
  const [bg, draw, ents, weather, bubbles, actEl, narrEl, cardEl, diceEl, rangeEl] = root.children;
  // game movement: how far the hero may walk this turn (the stage is 4:3, so a circle on screen is an ellipse in stage units)
  rangeEl.style.cssText = o.range ? `display:block;left:${(o.range.x - o.range.r) * 100}%;top:${(o.range.y - o.range.r / 0.75) * 100}%;width:${o.range.r * 200}%;height:${(o.range.r / 0.75) * 200}%` : 'display:none';
  const code = o.code || '';
  const css = backdropCss(code, scene.backdrop);
  if (bg._css !== css) { bg._css = css; bg.style.background = css; }
  weather.className = 'weather' + (scene.weather ? ' w-' + scene.weather : '');

  const dkey = scene.drawing.map((d) => d.id + d.pts.length).join() + (o.newStrokes ? 'n' : '');
  if (draw._key !== dkey) {
    draw._key = dkey;
    draw.replaceChildren(...scene.drawing.map((d) => {
      const pl = document.createElementNS(SVG, 'polyline');
      let pts = '';
      for (let i = 0; i + 1 < d.pts.length; i += 2) pts += `${d.pts[i] * 400},${d.pts[i + 1] * 300} `;
      if (d.pts.length === 2) pts += pts;
      pl.setAttribute('points', pts); pl.setAttribute('stroke', d.c); pl.setAttribute('stroke-width', Number(d.w) || 4); pl.setAttribute('pathLength', '1');
      if (o.newStrokes && o.newStrokes.has(d.id)) pl.setAttribute('class', 'new');
      return pl;
    }));
  }

  const live = new Set();
  for (const e of scene.entities) {
    live.add(e.id);
    let el = root._els.get(e.id);
    if (!el) { el = h('div', { class: 'ent' }, h('div', { class: 'fxw' }), h('span', { class: 'emote' })); el.dataset.id = e.id; root._els.set(e.id, el); ents.append(el); }
    const [fxw, emote] = el.children;
    if (el._asset !== e.asset) { el._asset = e.asset; fxw.replaceChildren(glyphNode(code, e.asset, 'glyph')); }
    el.className = 'ent' + (e.id === scene.heroId ? ' hero' : '') + (e.id === o.selId ? ' sel' : '') + (e.id === scene.target ? ' target' : '')
      + (e.fresh ? ' fresh' : '') + (e.gone ? ' gone' : '') + (e.tracked ? ' tracked' : '');
    fxw.className = 'fxw' + (e.fx ? ' fx-' + e.fx : '');
    fxw.firstChild.style.transform = `rotate(${e.rot || 0}deg) scaleX(${e.flip ? -1 : 1})`;
    if (emote.textContent !== (e.emote || '')) emote.textContent = e.emote || '';
    el.style.left = e.x * 100 + '%'; el.style.top = e.y * 100 + '%';
    el.style.fontSize = `calc(var(--u) * ${e.scale})`;
    el.style.zIndex = Math.round(e.y * 1000) + 1;
  }
  for (const [id, el] of root._els) if (!live.has(id)) { el.remove(); root._els.delete(id); }

  bubbles.replaceChildren(...scene.entities.filter((e) => e.say && !e.gone).map((e) => h('div', {
    class: 'bubble' + (o.pop === e.id ? ' pop' : ''),
    style: `left:${clamp(e.x, 0.24, 0.76) * 100}%;bottom:min(calc(${(1 - e.y) * 100}% + var(--u) * ${e.scale * 1.22 + 0.12}),82%);z-index:${Math.round(e.y * 1000) + 2000}`,
  }, e.say)));
  actEl.textContent = o.noAct ? '' : actionText(scene, o.names || { player: 'Player' }, o.pendingRoll);
  const droll = scene.roll && scene.roll.by === 'director' ? `🎲 ${scene.roll.value} (d${scene.roll.sides})  ` : '';
  narrEl.textContent = droll + (scene.narration || '');
  if (cardEl.textContent !== (o.card || '')) cardEl.textContent = o.card || '';
  const dice = o.dice ? (o.dice.rolling ? '🎲' : String(o.dice.value)) : '';
  if (diceEl.textContent !== dice) diceEl.textContent = dice;
  diceEl.classList.toggle('rolling', !!(o.dice && o.dice.rolling));
}

/* ---------- cut scenes ---------- */
function sample(pts, t) {
  const n = pts.length;
  if (t < pts[0]) return null;
  if (t >= pts[n - 3]) return [pts[n - 2], pts[n - 1]];
  for (let i = 3; i < n; i += 3) {
    if (t <= pts[i]) {
      const k = (t - pts[i - 3]) / Math.max(1, pts[i] - pts[i - 3]);
      return [pts[i - 2] + (pts[i + 1] - pts[i - 2]) * k, pts[i - 1] + (pts[i + 2] - pts[i - 1]) * k];
    }
  }
  return null;
}
function burst(root, kind) {
  if (kind === 'confetti') {
    const box = h('div', { class: 'confetti' }, Array.from({ length: 28 }, (_, i) => h('i', {
      style: `left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.5}s;background:hsl(${i * 47} 90% 60%)` })));
    root.append(box); setTimeout(() => box.remove(), 2600);
    return;
  }
  root.classList.remove('b-shake', 'b-flash', 'b-hurt'); void root.offsetWidth;
  root.classList.add('b-' + kind);
  setTimeout(() => root.classList.remove('b-' + kind), 900);
}

/**
 * Present the step from scene `before` to scene `after`: things glide, recorded
 * moves play, new drawing draws itself, lines appear one after another.
 * o.by says whose turn produced `after`. Returns { skip() }.
 */
export function playCut(root, before, after, o, done) {
  const frame = clone(after);
  const prev = new Map((before ? before.entities : []).map((e) => [e.id, e]));
  const fin = new Map(after.entities.map((e) => [e.id, e]));
  const old = new Set((before ? before.drawing : []).map((d) => d.id));
  const newStrokes = new Set(after.drawing.filter((d) => !old.has(d.id)).map((d) => d.id));
  const tracks = after.tracks, tracked = new Set(tracks.map((t) => t.id));
  const trackEnd = Math.max(0, ...tracks.map((t) => t.pts[t.pts.length - 3]));
  let moved = false;
  for (const e of frame.entities) {
    const p = prev.get(e.id);
    if (!p || p.say !== e.say) e.say = '';          // unchanged lines simply stay up; new ones appear in turn
    e.emote = p ? p.emote : '';
    if (p) { if (p.x !== e.x || p.y !== e.y || p.scale !== e.scale || p.rot !== e.rot) moved = true; Object.assign(e, { x: p.x, y: p.y, scale: p.scale, rot: p.rot, flip: p.flip, fx: p.fx }); } else if (before) { e.fresh = true; moved = true; }
    if (tracked.has(e.id)) e.tracked = true;
  }
  for (const p of prev.values()) if (!fin.has(p.id)) { frame.entities.push({ ...p, say: '', emote: '' }); moved = true; }
  const sameNarr = !!before && before.narration === after.narration;
  Object.assign(frame, { narration: sameNarr ? after.narration : '', action: '', target: null, use: null, roll: null, drawing: after.drawing.filter((d) => !newStrokes.has(d.id)) });
  if (before) { frame.backdrop = before.backdrop; frame.weather = before.weather; }

  const view = { ...o }, steps = [];
  const at = (ms, fn) => steps.push({ ms, fn });
  let t = 0;
  if (before && before.backdrop !== after.backdrop) {                 // fade through black
    at(0, () => root.classList.add('fade')); at(380, () => { frame.backdrop = after.backdrop; }); at(760, () => root.classList.remove('fade')); t = 760;
  }
  if (after.card) { at(t, () => { view.card = after.card; }); t += 1900; at(t, () => { view.card = ''; }); t += 200; }
  const tM = t;
  at(tM, () => {                                                       // everything starts moving
    frame.weather = after.weather; frame.drawing = after.drawing; view.newStrokes = newStrokes;
    for (const e of frame.entities) {
      const f = fin.get(e.id);
      if (!f) { e.gone = true; continue; }
      e.fresh = false;
      Object.assign(e, { scale: f.scale, rot: f.rot, flip: f.flip, fx: f.fx });
      if (!f.say) e.emote = f.emote;
      if (!e.tracked) { e.x = f.x; e.y = f.y; }
    }
    if (after.burst) burst(root, after.burst);
    if (after.sfx && o.sfx) o.sfx(after.sfx);
  });
  t = tM + Math.max(trackEnd ? trackEnd + 250 : 0, moved || newStrokes.size ? 950 : 300);
  at(t, () => { for (const e of frame.entities) if (e.tracked) { const f = fin.get(e.id); e.tracked = false; e.x = f.x; e.y = f.y; } });
  const sayers = after.entities.filter((e) => e.say && !(prev.has(e.id) && prev.get(e.id).say === e.say));
  if (o.by === 'player') sayers.sort((a, b) => (b.id === after.heroId) - (a.id === after.heroId));
  for (const e of sayers) {
    at(t, () => { const fe = frame.entities.find((x) => x.id === e.id); fe.say = e.say; fe.emote = e.emote; view.pop = e.id; });
    t += 900 + 45 * e.say.length;
  }
  if (after.action || after.target || after.use) { at(t, () => { view.pop = null; frame.action = after.action; frame.target = after.target; frame.use = after.use; }); t += 1300; }
  if (after.roll) {
    at(t, () => { view.dice = { ...after.roll, rolling: true }; if (o.sfx) o.sfx('dice'); });
    at(t + 700, () => { view.dice = { ...after.roll }; });
    t += 1700; at(t, () => { view.dice = null; frame.roll = after.roll; });
  }
  if (after.narration && !sameNarr) { at(t, () => { view.pop = null; frame.narration = after.narration; }); t += Math.min(4500, 900 + 40 * after.narration.length); }
  const total = t + 250;
  steps.sort((a, b) => a.ms - b.ms);

  let i = 0, raf = 0, finished = false;
  const start = performance.now();
  const finish = () => {
    if (finished) return;
    finished = true; cancelAnimationFrame(raf); clearTimeout(guard);
    root.classList.remove('cut', 'fade');
    renderStage(root, after, o);
    if (done) done();
  };
  const tick = () => {
    if (finished) return;
    const el = performance.now() - start;
    let dirty = false;
    while (i < steps.length && steps[i].ms <= el) { steps[i++].fn(); dirty = true; }
    if (trackEnd && el >= tM && el <= tM + trackEnd + 250) {
      for (const tr of tracks) {
        const e = frame.entities.find((x) => x.id === tr.id), p = e && e.tracked && sample(tr.pts, el - tM);
        if (p) { e.x = p[0]; e.y = p[1]; }
      }
      dirty = true;
    }
    if (dirty) renderStage(root, frame, view);
    if (el >= total) return finish();
    raf = requestAnimationFrame(tick);
  };
  const guard = setTimeout(finish, total + 1500);    // background tabs pause animation frames
  root.classList.add('cut');
  renderStage(root, frame, view);
  raf = requestAnimationFrame(tick);
  return { skip: finish, total };
}

/**
 * Present a whole turn. A step-by-step turn carries its earlier moments in
 * after.steps; they are played one after another, in the order they were made,
 * each with its own moves, sounds and narration, ending on `after` itself.
 */
export function playTurn(root, before, after, o, done) {
  const frames = [...(after.steps || []), after];
  let i = 0, cur = null, stopped = false;
  const next = () => {
    if (stopped) return;
    if (i >= frames.length) { if (done) done(); return; }
    const prev = i ? frames[i - 1] : before, frame = frames[i++];
    cur = playCut(root, prev, frame, { ...o, by: o.by }, next);
  };
  next();
  return { skip() { if (stopped) return; stopped = true; const c = cur; cur = null; if (c) c.skip(); renderStage(root, after, o); if (done) done(); } };
}
