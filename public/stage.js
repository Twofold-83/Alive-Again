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
  if (sc.level === undefined) sc.level = null;
  sc.exits ||= []; sc.floats ||= []; sc.sceneId ||= ''; sc.travel ||= ''; sc.verb ||= '';
  for (const k of ['ask', 'answer', 'exit', 'cam', 'award', 'battle', 'point']) if (sc[k] === undefined) sc[k] = null;
  if (sc.sheet.points == null) sc.sheet.points = 0;
  for (const e of sc.entities) { e.rot ||= 0; e.fx ||= ''; e.emote ||= ''; e.solid = !!e.solid; e.once ||= ''; e.temp = !!e.temp; e.layer ||= 0; if (e.active === undefined) e.active = null; if (e.tie === undefined) e.tie = null; if (e.hp === undefined) { e.hp = null; e.maxHp = null; } }
  return sc;
}

export function glyphNode(code, asset, cls = '') {
  const v = spriteView(code, asset);
  return v.img ? h('img', { class: cls, src: v.img, alt: '', draggable: 'false' }) : h('span', { class: cls }, v.glyph);
}

/** The sentence describing what the Player did this turn. */
export function actionText(scene, names, pendingRoll) {
  const bits = [];
  if (scene.said) bits.push(`“${scene.said}”`);
  const item = scene.use && scene.sheet.inv.find((i) => i.id === scene.use);
  const t = scene.target && scene.entities.find((e) => e.id === scene.target);
  const tl = t && (t.active ? t.active.name : assetLabel(t.asset));
  const a = scene.answer;
  if (item && t) bits.push(`uses ${assetLabel(item.asset, item.name)} on ${tl}`);               // use item + on
  else if (item) bits.push('uses ' + assetLabel(item.asset, item.name));
  else if (t && scene.verb) bits.push(`${scene.verb}: ${tl}`);                                   // a verb on an active object
  else if (t && a && a.kind === 'target') bits.push(`${a.verb}: ${tl}`);
  else if (t && a && a.kind === 'battle') bits.push(`⚔️ attacks ${tl}`);
  else if (t) bits.push('reaches for ' + tl);
  if (a && a.kind === 'battle' && a.move !== 'attack') bits.push(a.move === 'defend' ? '🛡️ defends' : '🏃 tries to flee');
  if (a && a.kind === 'place') bits.push('goes to ' + a.label);
  if (a && a.kind === 'discard') bits.push('discards ' + assetLabel(a.asset, a.name));
  const ex = scene.exit && (scene.exits || []).find((x) => x.id === scene.exit);
  if (ex) bits.push('heads for ' + ex.label);
  const pt = scene.point, pe = pt && pt.id && scene.entities.find((e) => e.id === pt.id);          // the action points at something on the stage
  if (pt) bits.push(`${scene.action || 'Look at'} 👉 ${pe ? (pe.active ? pe.active.name : assetLabel(pe.asset)) : 'that spot'}`);
  else if (scene.action) bits.push(scene.action);
  if (scene.roll && scene.roll.by === 'player') bits.push(`🎲 rolls ${scene.roll.value} (d${scene.roll.sides})${a && a.kind === 'roll' && a.dc ? (scene.roll.value >= a.dc ? ` — success (needed ${a.dc})` : ` — fails (needed ${a.dc})`) : ''}`);
  else if (pendingRoll) bits.push(`🎲 will roll a d${pendingRoll}`);
  return bits.length ? `✋ ${names.player}: ${bits.join(' · ')}` : '';
}

const SVG = 'http://www.w3.org/2000/svg';

/* ---------- levels: a 16 x 12 tile grid; floors can be walked on, walls cannot ---------- */
export const LEVEL_W = 16, LEVEL_H = 12, EMPTY_CELLS = '0'.repeat(LEVEL_W * LEVEL_H);
export const cellAt = (x, y) => Math.min(LEVEL_H - 1, Math.floor(y * LEVEL_H)) * LEVEL_W + Math.min(LEVEL_W - 1, Math.floor(x * LEVEL_W));
/** May the hero stand here? (Same rule as on the server.) */
export function walkable(scene, x, y) {
  if (scene.level) {
    const t = scene.level.pal[parseInt(scene.level.cells[cellAt(x, y)], 36) - 1];
    if (!t || t.k !== 'f') return false;
  }
  for (const e of scene.entities) {
    if (!e.solid || e.id === scene.heroId) continue;
    if (Math.hypot((x - e.x) / (0.065 * e.scale), ((y - e.y + 0.02 * e.scale) * 0.75) / (0.04 * e.scale)) < 1) return false;
  }
  return true;
}
/** Put a tile on one cell of a scene's level (a = asset, k = 'f' floor | 'w' wall; k '' erases). Returns false if nothing changed. */
export function setCell(scene, c, a, k) {
  const lv = scene.level || { pal: [], cells: EMPTY_CELLS };
  let ch = '0';
  if (k && a) {
    let i = lv.pal.findIndex((t) => t.a === a && t.k === k);
    if (i < 0) { if (lv.pal.length >= 35) return false; lv.pal.push({ a, k }); i = lv.pal.length - 1; }
    ch = (i + 1).toString(36);
  }
  if (lv.cells[c] === ch) return false;
  lv.cells = lv.cells.slice(0, c) + ch + lv.cells.slice(c + 1);
  scene.level = /[^0]/.test(lv.cells) ? lv : null;
  return true;
}

/* ---------- walking: the hero finds its own way to where the Player points ---------- */
const NAV_W = 64, NAV_H = 48;                                    // navigation grid (finer than the tiles)
const WALK_SPEED = 0.17;                                         // stage widths per second: an unhurried walk
/**
 * A walk from (x,y) towards (tx,ty) around walls and solid things, as a track
 * [ms, x, y, ...] at walking pace. Stops as near to the target as it can get.
 * Returns null if the hero cannot move from where it stands.
 */
export function findWalk(scene, x, y, tx, ty) {
  const at = (i, j) => [(i + 0.5) / NAV_W, (j + 0.5) / NAV_H];
  const cell = (px, py) => [Math.min(NAV_W - 1, Math.floor(px * NAV_W)), Math.min(NAV_H - 1, Math.floor(py * NAV_H))];
  const ok = new Uint8Array(NAV_W * NAV_H);
  for (let j = 0; j < NAV_H; j++) for (let i = 0; i < NAV_W; i++) ok[j * NAV_W + i] = walkable(scene, ...at(i, j)) ? 1 : 0;
  const [si, sj] = cell(x, y), start = sj * NAV_W + si;
  ok[start] = 1;                                                 // wherever the hero stands, it may leave
  const dist = new Float32Array(NAV_W * NAV_H).fill(Infinity), from = new Int32Array(NAV_W * NAV_H).fill(-1);
  dist[start] = 0;
  const queue = [start];                                         // Dijkstra with a simple queue: the grid is small
  while (queue.length) {
    let bi = 0; for (let q = 1; q < queue.length; q++) if (dist[queue[q]] < dist[queue[bi]]) bi = q;
    const cur = queue.splice(bi, 1)[0], ci = cur % NAV_W, cj = (cur - ci) / NAV_W;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue;
      const ni = ci + di, nj = cj + dj;
      if (ni < 0 || nj < 0 || ni >= NAV_W || nj >= NAV_H) continue;
      const n = nj * NAV_W + ni;
      if (!ok[n] || (di && dj && (!ok[cj * NAV_W + ni] || !ok[nj * NAV_W + ci]))) continue;   // no cutting corners
      const nd = dist[cur] + (di && dj ? 1.414 : 1);
      if (nd < dist[n]) { if (dist[n] === Infinity) queue.push(n); dist[n] = nd; from[n] = cur; }
    }
  }
  let best = -1, bestD = Infinity;                               // the reachable spot nearest to where the Player pointed
  for (let n = 0; n < dist.length; n++) {
    if (dist[n] === Infinity) continue;
    const [cx, cy] = at(n % NAV_W, Math.floor(n / NAV_W)), d = Math.hypot(cx - tx, (cy - ty) * 0.75);
    if (d < bestD) { bestD = d; best = n; }
  }
  if (best < 0 || best === start) return null;
  const cells = [];
  for (let n = best; n !== -1 && n !== start; n = from[n]) cells.unshift(n);
  let pts = [[x, y], ...cells.map((n) => at(n % NAV_W, Math.floor(n / NAV_W)))];
  if (bestD < 0.6 / NAV_W && walkable(scene, tx, ty)) pts[pts.length - 1] = [tx, ty];   // arrive exactly where they pointed
  const clear = (a, b) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * NAV_W * 2); for (let k = 1; k < n; k++) if (!walkable(scene, a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n)) return false; return true; };
  const smooth = [pts[0]];                                       // straighten the staircase the grid produces
  for (let i = 0; i < pts.length - 1;) { let j = pts.length - 1; while (j > i + 1 && !clear(pts[i], pts[j])) j--; smooth.push(pts[j]); i = j; }
  pts = smooth;
  let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], (pts[i][1] - pts[i - 1][1]) * 0.75);
  const speed = Math.max(WALK_SPEED, len / 9.5);                 // never longer than the 10 seconds a move may last
  const track = [0, pts[0][0], pts[0][1]]; let t = 0;
  for (let i = 1; i < pts.length; i++) { t += (Math.hypot(pts[i][0] - pts[i - 1][0], (pts[i][1] - pts[i - 1][1]) * 0.75) / speed) * 1000; track.push(Math.round(t), Math.round(pts[i][0] * 1000) / 1000, Math.round(pts[i][1] * 1000) / 1000); }
  return track;
}

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
    // the world (everything the camera looks at) and, over it, the things that stay put on the screen
    root.append(h('div', { class: 'world' }, h('div', { class: 'bg' }), h('div', { class: 'level' }), draw, h('div', { class: 'marks' }), h('div', { class: 'ents' }), h('div', { class: 'weather' }), h('div', { class: 'dest' }), h('div', { class: 'camframe' })),
      h('div', { class: 'strip act' }), h('div', { class: 'strip narr' }), h('div', { class: 'cardov' }), h('div', { class: 'diceov' }), h('div', { class: 'awardov' }), h('div', { class: 'bar top' }), h('div', { class: 'bar bot' }), h('div', { class: 'bubbles' }));
    const fit = () => root.style.setProperty('--u', root.clientWidth / 8 + 'px');
    new ResizeObserver(fit).observe(root); fit();
  }
  const [world, actEl, narrEl, cardEl, diceEl, awardEl, , , bubbles] = root.children;
  const [bg, level, draw, marks, ents, weather, destEl, camEl] = world.children;
  const code = o.code || '';
  const css = backdropCss(code, scene.backdrop);
  if (bg._css !== css) { bg._css = css; bg.style.background = css; }
  weather.className = 'weather' + (scene.weather ? ' w-' + scene.weather : '');

  // camera: zoom the world onto a point (shown as a frame instead while the Director edits)
  const cam = scene.cam && scene.cam.z > 1 ? scene.cam : null;
  let zoom = 1, panX = 0, panY = 0;                            // where a point of the world ends up on screen (speech bubbles live on the screen)
  if (cam && !o.camFrame) { const c = (v) => clamp(50 - v * cam.z * 100, (1 - cam.z) * 100, 0); zoom = cam.z; panX = c(cam.x); panY = c(cam.y); world.style.transform = `translate(${panX}%, ${panY}%) scale(${zoom})`; } else world.style.transform = '';
  camEl.style.cssText = cam && o.camFrame ? `display:block;width:${100 / cam.z}%;height:${100 / cam.z}%;left:${clamp(cam.x - 0.5 / cam.z, 0, 1 - 1 / cam.z) * 100}%;top:${clamp(cam.y - 0.5 / cam.z, 0, 1 - 1 / cam.z) * 100}%` : 'display:none';

  const lkey = scene.level ? scene.level.cells + scene.level.pal.map((t) => t.a + t.k).join() + (o.showKinds ? 'k' : '') : '';
  if (level._key !== lkey) {
    level._key = lkey;
    level.replaceChildren(...(scene.level ? [...scene.level.cells].map((ch) => {
      const t = scene.level.pal[parseInt(ch, 36) - 1], d = document.createElement('i');
      if (t) { d.style.backgroundImage = `url("px/${t.a.slice(2)}.png")`; if (o.showKinds && t.k === 'w') d.className = 'wall'; }
      return d;
    }) : []));
  }
  destEl.style.cssText = o.dest ? `display:block;left:${o.dest.x * 100}%;top:${o.dest.y * 100}%` : 'display:none';   // where the hero is walking to

  // exits to other scenes, and places the Director marked for the Player to choose from
  const places = scene.ask && scene.ask.kind === 'place' ? scene.ask.places : [];
  const ptSpot = scene.point && scene.point.id == null ? scene.point : null;
  const mkey = JSON.stringify([scene.exits, places, scene.exit, o.pickPlace, ptSpot]);
  if (marks._key !== mkey) {
    marks._key = mkey;
    marks.replaceChildren(
      ...scene.exits.map((x) => { const d = h('div', { class: 'exit' + (x.locked ? ' locked' : '') + (scene.exit === x.id ? ' on' : ''), style: `left:${x.x * 100}%;top:${x.y * 100}%` }, (x.locked ? '🔒 ' : '🚪 ') + x.label); d.dataset.exit = x.id; return d; }),
      ...(ptSpot ? [h('div', { class: 'pointmark', style: `left:${ptSpot.x * 100}%;top:${ptSpot.y * 100}%` }, '👉')] : []),
      ...places.map((pl, i) => { const d = h('div', { class: 'place' + (o.pickPlace === i ? ' on' : ''), style: `left:${pl.x * 100}%;top:${pl.y * 100}%` }, '📍 ' + pl.label); d.dataset.place = i; return d; }));
  }

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

  const byId = new Map(scene.entities.map((e) => [e.id, e]));
  const faces = (e) => e.flip !== (e.face < 0);                // mirrored: flipped by the Director, or walking to the left right now
  /** Where a thing is drawn: a tied thing follows whatever it is tied to, in front of or behind it. */
  const spot = (e) => {
    const p = e.tie && byId.get(e.tie.to);
    const lift = (e.layer || 0) * 3000;                      // sent to the back / brought to the front by the Director
    if (!p || p === e || p.tie) return { x: e.x, y: e.y, z: Math.round(e.y * 1000) + 1 + lift };
    return { x: p.x + e.tie.dx * p.scale * (faces(p) ? -1 : 1), y: p.y + e.tie.dy * p.scale, z: Math.round(p.y * 1000) + 1 + (p.layer || 0) * 3000 + (e.tie.front ? 1 : -1), held: p };
  };
  const live = new Set(), floats = o.floats || [];
  for (const e of scene.entities) {
    live.add(e.id);
    let el = root._els.get(e.id);
    if (!el) { el = h('div', { class: 'ent' }, h('div', { class: 'fxw' }), h('span', { class: 'emote' }), h('div', { class: 'hp' }, h('i', {})), h('span', { class: 'float' })); el.dataset.id = e.id; root._els.set(e.id, el); ents.append(el); }
    const [fxw, emote, hp, fl] = el.children, at = spot(e);
    if (el._asset !== e.asset) { el._asset = e.asset; fxw.replaceChildren(glyphNode(code, e.asset, 'glyph')); }
    el.className = 'ent' + (e.id === scene.heroId ? ' hero' : '') + (e.id === o.selId ? ' sel' : '') + (e.id === scene.target || (scene.point && e.id === scene.point.id) || (o.pickId && e.id === o.pickId) ? ' target' : '')
      + (e.fresh ? ' fresh' : '') + (e.gone ? ' gone' : '') + (e.tracked || (at.held && at.held.tracked) ? ' tracked' : '') + (at.held && (at.held.gone || at.held.fresh) ? ' gone' : '') + (o.showKinds && e.solid ? ' solid' : '') + (e.active ? ' active' : '') + (o.hot && o.hot.has(e.id) ? ' hot' : '')
      + (o.speaker === e.id ? ' speaking' : '') + (e.walk && !e.fx ? ' walk' : '') + (e.pop ? ' popin' : '');
    el.dataset.name = e.active ? e.active.name : '';
    fxw.className = 'fxw' + (e.fx ? ' fx-' + e.fx : '') + (o.playing && e.once ? ' once-' + e.once : '');
    fxw.firstChild.style.transform = `rotate(${e.rot || 0}deg) scaleX(${faces(e) !== !!(at.held && faces(at.held)) ? -1 : 1})`;
    if (emote.textContent !== (e.emote || '')) emote.textContent = e.emote || '';
    hp.style.display = e.hp == null ? 'none' : 'block';
    if (e.hp != null) hp.firstChild.style.width = clamp((e.hp / (e.maxHp || 1)) * 100, 0, 100) + '%';
    const f = floats.find((x) => x.id === e.id), ft = f ? f.text : '';
    if (fl.textContent !== ft) { fl.textContent = ft; fl.style.color = f ? f.c : ''; }
    el.style.left = at.x * 100 + '%'; el.style.top = at.y * 100 + '%';
    el.style.fontSize = `calc(var(--u) * ${e.scale})`;
    el.style.zIndex = at.z;
  }
  for (const [id, el] of root._els) if (!live.has(id)) { el.remove(); root._els.delete(id); }

  const size = (n) => (n > 100 ? ' xlong' : n > 45 ? ' long' : '');   // longer text is set smaller and wider, so it never fills the stage
  const speakers = scene.entities.filter((e) => e.say && !e.gone).sort((a, b) => (b.id === o.speaker) - (a.id === o.speaker));   // whoever speaks now gets the best spot
  bubbles.replaceChildren(...speakers.map((e) => { const at = spot(e), sx = at.x * 100 * zoom + panX, sy = at.y * 100 * zoom + panY; return h('div', {
    class: 'bubble' + (o.pop === e.id ? ' pop' : '') + (o.speaker && o.speaker !== e.id ? ' old' : '') + size(e.sayLen || e.say.length), 'data-id': e.id,
    style: `left:${clamp(sx, 4, 96)}%;bottom:calc(${100 - sy}% + var(--u) * ${(e.scale * 1.22 + 0.12) * zoom})`,
  }, e.say); }));
  const droll = scene.roll && scene.roll.by === 'director' ? `🎲 ${scene.roll.value} (d${scene.roll.sides})  ` : '';
  narrEl.textContent = droll + (scene.narration || '');
  narrEl.className = 'strip narr' + size((scene.narrLen || (scene.narration || '').length) / 2);
  layoutBubbles(root, bubbles, narrEl);
  actEl.textContent = o.noAct ? '' : actionText(scene, o.names || { player: 'Player' }, o.pendingRoll);
  const card = o.travel ? '🚶 Traveling to\n' + o.travel : o.card || '';
  if (cardEl.textContent !== card) cardEl.textContent = card;
  cardEl.classList.toggle('travel', !!o.travel);
  const dice = o.dice ? (o.dice.rolling ? '🎲' : String(o.dice.value)) : '';
  if (diceEl.textContent !== dice) diceEl.textContent = dice;
  diceEl.classList.toggle('rolling', !!(o.dice && o.dice.rolling));
  const award = o.award ? `${o.award.n >= 0 ? '+' : ''}${o.award.n} ⭐${o.award.text ? '\n' + o.award.text : ''}` : '';
  if (awardEl.textContent !== award) awardEl.textContent = award;
}

/** Place speech bubbles: always fully on the stage, clear of the narration, and not on top of each other. */
function layoutBubbles(root, layer, narrEl) {
  if (!layer.children.length) return;
  const st = root.getBoundingClientRect(), nb = narrEl.getBoundingClientRect();
  const floor = (nb.height > 4 ? nb.top : st.bottom) - 3, placed = [];
  for (const b of layer.children) {
    b.style.transform = 'translate(-50%, 0)';
    const r = b.getBoundingClientRect(), w = r.width, hh = r.height;
    const fit = (dx, dy) => { const L = Math.max(st.left + 3, Math.min(st.right - w - 3, r.left + dx)), T = Math.max(st.top + 3, Math.min(floor - hh, r.top + dy)); return { L, T, R: L + w, B: T + hh }; };
    const over = (q) => placed.reduce((a, p) => a + Math.max(0, Math.min(q.R, p.R) - Math.max(q.L, p.L)) * Math.max(0, Math.min(q.B, p.B) - Math.max(q.T, p.T)), 0);
    // its natural spot if that is free; otherwise the free spot nearest to it, searched over the whole stage
    let best = { q: fit(0, 0), d: 0 }; best.ov = over(best.q);
    if (best.ov) {
      for (let T = st.top + 3; T <= floor - hh; T += 14) for (const L of [r.left, st.left + 3, st.right - w - 3, (st.left + st.right - w) / 2, r.left - w * 0.6, r.left + w * 0.6]) {
        const q = fit(L - r.left, T - r.top), ov = over(q), d = Math.hypot(q.L - r.left, q.T - r.top);
        if (ov < best.ov - 1 || (Math.abs(ov - best.ov) <= 1 && d < best.d)) best = { q, ov, d };
      }
    }
    placed.push(best.q);
    const mx = best.q.L - r.left, my = best.q.T - r.top;
    b.style.transform = `translate(calc(-50% + ${mx}px), ${my}px)`;
    b.classList.toggle('moved', Math.abs(mx) > 10 || Math.abs(my) > 10);   // its pointer would point at the wrong place
  }
}

/* ---------- cut scenes ---------- */
export function sample(pts, t) {
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
    e.once = '';
    if (p) { if (p.x !== e.x || p.y !== e.y || p.scale !== e.scale || p.rot !== e.rot) moved = true; Object.assign(e, { x: p.x, y: p.y, scale: p.scale, rot: p.rot, flip: p.flip, fx: p.fx }); } else if (before) { e.fresh = true; moved = true; }
    if (tracked.has(e.id)) e.tracked = true;
  }
  for (const p of prev.values()) if (!fin.has(p.id)) { frame.entities.push({ ...p, say: '', emote: '' }); moved = true; }
  const sameNarr = !!before && before.narration === after.narration;
  Object.assign(frame, { narration: sameNarr ? after.narration : '', action: '', target: null, point: null, use: null, roll: null, drawing: after.drawing.filter((d) => !newStrokes.has(d.id)) });
  if (before) { frame.backdrop = before.backdrop; frame.weather = before.weather; frame.cam = before.cam; frame.exits = before.exits; frame.level = before.level; }
  frame.exit = null; frame.answer = null; frame.verb = '';

  const view = { ...o, playing: true }, steps = [];
  const sp = o.speed || 1, types = [];                         // sp > 1 plays faster (used by the simulations); types: lines being typed out
  const autoCam = o.autoCam !== false && !after.cam && !(before && before.cam);
  const at = (ms, fn) => steps.push({ ms, fn });
  let t = 0;
  const swap = () => { frame.backdrop = after.backdrop; frame.level = after.level; frame.exits = after.exits; };
  if (after.travel) {                                                   // "Traveling to ..." between two places
    at(0, () => { root.classList.add('fade'); if (o.sfx) o.sfx('whoosh'); }); at(380, () => { swap(); view.travel = after.travel; }); at(2300, () => { view.travel = ''; root.classList.remove('fade'); }); t = 2600;
  } else if (before && (before.backdrop !== after.backdrop || JSON.stringify(before.level) !== JSON.stringify(after.level))) {   // fade through black
    at(0, () => root.classList.add('fade')); at(380, swap); at(760, () => root.classList.remove('fade')); t = 760;
  } else swap();
  if (after.card) { at(t, () => { view.card = after.card; }); t += 1900; at(t, () => { view.card = ''; }); t += 200; }
  const tM = t;
  let popped = false;
  at(tM, () => {                                                       // everything starts moving
    frame.weather = after.weather; frame.drawing = after.drawing; view.newStrokes = newStrokes; frame.cam = after.cam;
    for (const e of frame.entities) {
      const f = fin.get(e.id);
      if (!f) { e.gone = true; continue; }
      if (e.fresh) { e.pop = true; if (o.sfx && !after.sfx && !popped) { popped = true; o.sfx('pop'); } }   // newcomers pop in
      e.fresh = false;
      if (e.tracked || f.x !== e.x || f.y !== e.y) { e.walk = true; e.face = Math.sign(f.x - e.x); }   // on the move: bob along, face the way it goes
      Object.assign(e, { scale: f.scale, rot: f.rot, flip: f.flip, fx: f.fx, once: f.once, hp: f.hp, maxHp: f.maxHp, tie: f.tie });
      if (!f.say) e.emote = f.emote;
      if (!e.tracked) { e.x = f.x; e.y = f.y; }
    }
    if (after.burst) burst(root, after.burst);
    if (after.sfx && o.sfx) o.sfx(after.sfx);
  });
  if (after.floats.length) { at(tM + 300, () => { view.floats = after.floats; if (o.sfx && !after.sfx) o.sfx('hit'); }); at(tM + 1700, () => { view.floats = []; }); }
  const camMoved = JSON.stringify(before ? before.cam : null) !== JSON.stringify(after.cam), acting = after.entities.some((e) => e.once) || after.floats.length;
  t = tM + Math.max(trackEnd ? trackEnd + 250 : 0, moved || newStrokes.size || camMoved ? 950 : 300, acting ? 1100 : 0);
  if (after.award) { at(t, () => { view.award = after.award; if (o.sfx) o.sfx(after.award.n < 0 ? 'fail' : 'coin'); }); t += 1600; at(t, () => { view.award = null; }); }
  const tEnd = t;
  at(t, () => { for (const e of frame.entities) { e.walk = false; e.face = 0; if (e.tracked) { const f = fin.get(e.id); e.tracked = false; e.x = f.x; e.y = f.y; } } });
  const sayers = after.entities.filter((e) => e.say && !(prev.has(e.id) && prev.get(e.id).say === e.say));
  if (o.by === 'player') sayers.sort((a, b) => (b.id === after.heroId) - (a.id === after.heroId));
  for (const e of sayers) {                                            // each line is typed out, the camera leans in on who speaks
    at(t, () => { const fe = frame.entities.find((x) => x.id === e.id); fe.emote = e.emote; view.pop = e.id; view.speaker = e.id; if (autoCam) frame.cam = { x: e.x, y: Math.max(0, e.y - 0.1 * e.scale), z: 1.16 }; });
    types.push({ t0: t, id: e.id, text: e.say, n: 0 });
    frame.entities.find((x) => x.id === e.id).sayLen = e.say.length;
    t += Math.min(7500, e.say.length * 24 + Math.max(1100, 600 + 28 * e.say.length));
  }
  if (sayers.length) at(t, () => { view.speaker = null; view.pop = null; frame.cam = after.cam; });
  if (o.by === 'player' && (after.action || after.target || after.point || after.use || after.exit || after.answer)) { at(t, () => { view.pop = null; frame.action = after.action; frame.target = after.target; frame.point = after.point; frame.use = after.use; frame.exit = after.exit; frame.answer = after.answer; frame.verb = after.verb; }); t += 1300; }
  if (after.roll && after.roll.by === o.by) {
    at(t, () => { view.dice = { ...after.roll, rolling: true }; if (o.sfx) o.sfx('dice'); });
    at(t + 700, () => { view.dice = { ...after.roll }; });
    t += 1700; at(t, () => { view.dice = null; frame.roll = after.roll; });
  }
  if (after.narration && !sameNarr) { frame.narrLen = after.narration.length; types.push({ t0: t, id: null, text: after.narration, n: 0 }); t += Math.min(8000, after.narration.length * 22 + Math.max(1300, 700 + 26 * after.narration.length)); }
  const total = t + 250;
  steps.sort((a, b) => a.ms - b.ms);

  let i = 0, raf = 0, finished = false, lastStep = -999;
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
    const el = (performance.now() - start) * sp;
    let dirty = false;
    while (i < steps.length && steps[i].ms <= el) { steps[i++].fn(); dirty = true; }
    if (trackEnd && el >= tM && el <= tM + trackEnd + 250) {
      for (const tr of tracks) {
        const e = frame.entities.find((x) => x.id === tr.id), p = e && e.tracked && sample(tr.pts, el - tM);
        if (p) { if (Math.abs(p[0] - e.x) > 0.0008) e.face = Math.sign(p[0] - e.x); e.x = p[0]; e.y = p[1]; }
      }
      dirty = true;
    }
    for (const ty of types) {                                         // typewriter, with a soft tick every few letters
      if (el < ty.t0 || ty.n >= ty.text.length) continue;
      const n = Math.min(ty.text.length, Math.floor((el - ty.t0) / (ty.id ? 24 : 22)) + 1);
      if (n === ty.n) continue;
      if (o.sfx && Math.floor(n / 3) !== Math.floor(ty.n / 3)) o.sfx(ty.id ? 'talk' : 'type');
      ty.n = n; dirty = true;
      if (ty.id) { const fe = frame.entities.find((x) => x.id === ty.id); if (fe) fe.say = ty.text.slice(0, n); } else frame.narration = ty.text.slice(0, n);
    }
    if (o.sfx && el >= tM && el < tEnd && el - lastStep > 290 && frame.entities.some((e) => e.walk && !e.gone)) { lastStep = el; o.sfx('step'); }
    if (dirty) renderStage(root, frame, view);
    if (el >= total) return finish();
    raf = requestAnimationFrame(tick);
  };
  const guard = setTimeout(finish, total / sp + 1500);    // background tabs pause animation frames
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
  let i = 0, cur = null, stopped = false, wait = 0;
  const bars = () => root.querySelectorAll('.bar');
  const end = () => {                                                  // curtain: bars away, and a "Your turn" cue if control comes back to this player
    root.classList.remove('cine'); for (const b of bars()) b.textContent = '';
    if (o.stinger) { const st = h('div', { class: 'stinger' }, o.stinger); root.append(st); setTimeout(() => st.remove(), 1500); }
    if (done) done();
  };
  const next = () => {
    if (stopped) return;
    if (i >= frames.length) return end();
    const prev = i ? frames[i - 1] : before, frame = frames[i++];
    root.dataset.step = i;
    cur = playCut(root, prev, frame, o, () => { cur = null; wait = setTimeout(next, 220 / (o.speed || 1)); });
  };
  renderStage(root, before || frames[0], o);                           // make sure the stage exists before the bars are labelled
  root.classList.add('cine');
  if (bars()[0]) bars()[0].textContent = o.who ? `${o.who}${frames.length > 1 ? `  ·  ${frames.length} moments` : ''}  ·  click to skip` : '';
  next();
  return { skip() { if (stopped) return; stopped = true; clearTimeout(wait); const c = cur; cur = null; if (c) c.skip(); renderStage(root, after, o); end(); } };
}
