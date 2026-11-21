/* Drawing a scene on a stage element: backdrop, level, things, bubbles, strips and overlays.
 * renderStage() can be called as often as you like; it only touches what changed. */
import { isDoll, dollNode, poseDoll, feelDoll } from '../core/dolls.js';
import { spriteView, assetLabel, backdropCss, pixelInfo } from '../core/catalog.js';
import { h, clamp } from '../core/dom.js';

/** Fill in fields that older saved scenes do not have. */
/** How big a thing of scale 1 is drawn, in units of --u (an eighth of the stage width): a person is a tile and a half tall. */
const SPRITE = 0.74;

/** How tall a thing stands, in em of its own font size (see .doll and img.glyph.sized in stage.css). */
function tallOf(asset) {
  if (isDoll(asset)) return 1.5;
  const h = pixelInfo(asset).h;
  return h ? h * 0.0422 + 0.12 : 1.22;
}
export function glyphNode(code, asset, cls = '', view = '') {
  if (isDoll(asset)) return dollNode(asset, cls);
  const v = spriteView(code, asset);
  const info = pixelInfo(asset),
    alt = view && info[view] && !v.img.startsWith('packs/'), // a thing seen from the side, or after it was used
    size = cls === 'glyph' && (alt ? info[view][0] : info.w); // on the stage a library sprite is drawn at its true size
  if (v.img && size)
    return h('img', {
      class: 'glyph sized',
      src: alt ? v.img.replace(/\.png$/, `.${view}.png`) : v.img,
      alt: '',
      draggable: 'false',
      style: `--w:${size}`,
    });
  if (v.img && cls === 'glyph' && asset.startsWith('c:')) {
    /* a drawing of your own is pixel art too: once loaded, a small one is shown at its true size */
    const im = h('img', { class: cls, src: v.img, alt: '', draggable: 'false' });
    im.addEventListener('load', () => {
      if (im.naturalWidth > 64 || im.naturalHeight > 64) return;
      im.classList.add('sized');
      im.style.setProperty('--w', im.naturalWidth);
    });
    return im;
  }
  return v.img ? h('img', { class: cls, src: v.img, alt: '', draggable: 'false' }) : h('span', { class: cls }, v.glyph);
}

/** What the Player did this turn, as rows of [kind, text]: says, does, goes, gives, rolls. */
export function actionParts(scene, pendingRoll) {
  const parts = [];
  const name = (e) => (e.active ? e.active.name : assetLabel(e.asset));
  if (scene.said) parts.push(['says', `“${scene.said}”`]);
  if (scene.felt) parts.push(['feels', 'feels ' + scene.felt]);
  const item = scene.use && scene.sheet.inv.find((i) => i.id === scene.use);
  const t = scene.target && scene.entities.find((e) => e.id === scene.target);
  const a = scene.answer;
  if (item && t) parts.push(['does', `uses ${assetLabel(item.asset, item.name)} on ${name(t)}`]);
  else if (item) parts.push(['does', 'uses ' + assetLabel(item.asset, item.name)]);
  else if (t && scene.verb)
    parts.push(['does', `${scene.verb}: ${name(t)}`]); // a verb on a clickable thing
  else if (t && a && a.kind === 'target') parts.push(['does', `${a.verb}: ${name(t)}`]);
  else if (t && a && a.kind === 'battle') parts.push(['does', `attacks ${name(t)}`]);
  else if (t) parts.push(['does', 'reaches for ' + name(t)]);
  if (a && a.kind === 'battle' && a.move !== 'attack') parts.push(['does', a.move === 'defend' ? 'defends' : 'tries to flee']);
  if (a && a.kind === 'roll' && a.declined) parts.push(['does', 'backs out of the roll']);
  if (a && a.kind === 'place') parts.push(['goes', 'goes to ' + a.label]);
  if (a && a.kind === 'discard') parts.push(['gives', 'discards ' + assetLabel(a.asset, a.name)]);
  const ex = scene.exit && (scene.exits || []).find((x) => x.id === scene.exit);
  if (ex) parts.push(['goes', 'heads for ' + ex.label]);
  const pt = scene.point,
    pe = pt && pt.id && scene.entities.find((e) => e.id === pt.id); // the action points at something on the stage
  if (pt) parts.push(['does', `${scene.action || 'Look at'} → ${pe ? name(pe) : 'that spot'}`]);
  else if (scene.action) parts.push(['does', scene.action]);
  if (scene.roll && scene.roll.by === 'player') {
    const need = a && a.kind === 'roll' && a.dc ? (scene.roll.value >= a.dc ? ` — success (needed ${a.dc})` : ` — fails (needed ${a.dc})`) : '';
    parts.push(['rolls', `rolls ${scene.roll.value} (d${scene.roll.sides})${need}`]);
  } else if (pendingRoll) parts.push(['rolls', `will roll a d${pendingRoll}`]);
  return parts;
}
/** The same as one line, for the strip on the stage. */
export function actionText(scene, names, pendingRoll) {
  const parts = actionParts(scene, pendingRoll);
  return parts.length ? `${names.player}: ${parts.map((x) => x[1]).join(' · ')}` : '';
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
    draw.setAttribute('class', 'draw');
    draw.setAttribute('viewBox', '0 0 400 300');
    draw.setAttribute('preserveAspectRatio', 'none');
    // the world (everything the camera looks at) and, over it, the things that stay put on the screen
    root.append(
      h(
        'div',
        { class: 'world' },
        h('div', { class: 'bg' }),
        h('div', { class: 'level' }),
        draw,
        h('div', { class: 'marks' }),
        h('div', { class: 'ents' }),
        h('div', { class: 'weather' }),
        h('div', { class: 'dest' }),
        h('div', { class: 'camframe' }),
      ),
      h('div', { class: 'strip act' }),
      h('div', { class: 'strip narr' }),
      h('div', { class: 'cardov' }),
      h('div', { class: 'diceov' }),
      h('div', { class: 'awardov' }),
      h('div', { class: 'bar top' }),
      h('div', { class: 'bar bot' }),
      h('div', { class: 'bubbles' }),
    );
    const fit = () => root.style.setProperty('--u', root.clientWidth / 8 + 'px');
    new ResizeObserver(fit).observe(root);
    fit();
  }
  const [world, actEl, narrEl, cardEl, diceEl, awardEl, , , bubbles] = root.children;
  const [bg, level, draw, marks, ents, weather, destEl, camEl] = world.children;
  const code = o.code || '';
  const css = backdropCss(code, scene.backdrop);
  if (bg._css !== css) {
    bg._css = css;
    bg.style.background = css;
  }
  weather.className = 'weather' + (scene.weather ? ' w-' + scene.weather : '');

  // camera: zoom the world onto a point (shown as a frame instead while the Director edits)
  const cam = scene.cam && scene.cam.z > 1 ? scene.cam : null;
  let zoom = 1,
    panX = 0,
    panY = 0; // where a point of the world ends up on screen (speech bubbles live on the screen)
  if (cam && !o.camFrame) {
    const c = (v) => clamp(50 - v * cam.z * 100, (1 - cam.z) * 100, 0);
    zoom = cam.z;
    panX = c(cam.x);
    panY = c(cam.y);
    world.style.transform = `translate(${panX}%, ${panY}%) scale(${zoom})`;
  } else world.style.transform = '';
  camEl.style.cssText =
    cam && o.camFrame
      ? `display:block;width:${100 / cam.z}%;height:${100 / cam.z}%;left:${clamp(cam.x - 0.5 / cam.z, 0, 1 - 1 / cam.z) * 100}%;top:${clamp(cam.y - 0.5 / cam.z, 0, 1 - 1 / cam.z) * 100}%`
      : 'display:none';

  const lkey = scene.level ? scene.level.cells + scene.level.pal.map((t) => t.a + t.k).join() + (o.showKinds ? 'k' : '') : '';
  if (level._key !== lkey) {
    level._key = lkey;
    level.replaceChildren(
      ...(scene.level
        ? [...scene.level.cells].map((ch) => {
            const t = scene.level.pal[parseInt(ch, 36) - 1],
              d = document.createElement('i');
            if (t) {
              d.style.backgroundImage = `url("px/${t.a.slice(2)}.png")`;
              if (o.showKinds && t.k === 'w') d.className = 'wall';
            }
            return d;
          })
        : []),
    );
  }
  destEl.style.cssText = o.dest ? `display:block;left:${o.dest.x * 100}%;top:${o.dest.y * 100}%` : 'display:none'; // where the hero is walking to

  // exits to other scenes, and places the Director marked for the Player to choose from
  const places = scene.ask && scene.ask.kind === 'place' ? scene.ask.places : [];
  const ptSpot = scene.point && scene.point.id == null ? scene.point : null;
  const mkey = JSON.stringify([scene.exits, places, scene.exit, o.pickPlace, ptSpot]);
  if (marks._key !== mkey) {
    marks._key = mkey;
    marks.replaceChildren(
      ...scene.exits.map((x) => {
        const d = h(
          'div',
          { class: 'exit' + (x.locked ? ' locked' : '') + (scene.exit === x.id ? ' on' : ''), style: `left:${x.x * 100}%;top:${x.y * 100}%` },
          (x.locked ? '' : '') + x.label,
        );
        d.dataset.exit = x.id;
        return d;
      }),
      ...(ptSpot ? [h('div', { class: 'pointmark', style: `left:${ptSpot.x * 100}%;top:${ptSpot.y * 100}%` }, '→')] : []),
      ...places.map((pl, i) => {
        const d = h('div', { class: 'place' + (o.pickPlace === i ? ' on' : ''), style: `left:${pl.x * 100}%;top:${pl.y * 100}%` }, '' + pl.label);
        d.dataset.place = i;
        return d;
      }),
    );
  }

  const dkey = scene.drawing.map((d) => d.id + d.pts.length).join() + (o.newStrokes ? 'n' : '');
  if (draw._key !== dkey) {
    draw._key = dkey;
    draw.replaceChildren(
      ...scene.drawing.map((d) => {
        const pl = document.createElementNS(SVG, 'polyline');
        let pts = '';
        for (let i = 0; i + 1 < d.pts.length; i += 2) pts += `${d.pts[i] * 400},${d.pts[i + 1] * 300} `;
        if (d.pts.length === 2) pts += pts;
        pl.setAttribute('points', pts);
        pl.setAttribute('stroke', d.c);
        pl.setAttribute('stroke-width', Number(d.w) || 4);
        pl.setAttribute('pathLength', '1');
        if (o.newStrokes && o.newStrokes.has(d.id)) pl.setAttribute('class', 'new');
        return pl;
      }),
    );
  }

  const byId = new Map(scene.entities.map((e) => [e.id, e]));
  const faces = (e) => e.flip !== e.face < 0; // mirrored: flipped by the Director, or walking to the left right now
  /** Where a thing is drawn: a tied thing follows whatever it is tied to, in front of or behind it. */
  const spot = (e) => {
    const p = e.tie && byId.get(e.tie.to);
    const lift = (e.layer || 0) * 3000; // sent to the back / brought to the front by the Director
    if (!p || p === e || p.tie) return { x: e.x, y: e.y, z: Math.round(e.y * 1000) + 1 + lift };
    return {
      x: p.x + e.tie.dx * p.scale * (faces(p) ? -1 : 1),
      y: p.y + e.tie.dy * p.scale,
      z: Math.round(p.y * 1000) + 1 + (p.layer || 0) * 3000 + (e.tie.front ? 1 : -1),
      held: p,
    };
  };
  const live = new Set(),
    floats = o.floats || [];
  for (const e of scene.entities) {
    live.add(e.id);
    let el = root._els.get(e.id);
    if (!el) {
      el = h(
        'div',
        { class: 'ent' },
        h('div', { class: 'fxw' }),
        h('span', { class: 'emote' }),
        h('div', { class: 'hp' }, h('i', {})),
        h('span', { class: 'float' }),
      );
      el.dataset.id = e.id;
      root._els.set(e.id, el);
      ents.append(el);
    }
    const [fxw, emote, hp, fl] = el.children,
      at = spot(e);
    if (el._asset !== e.asset + '|' + (e.view || '')) {
      el._asset = e.asset + '|' + (e.view || '');
      fxw.replaceChildren(glyphNode(code, e.asset, 'glyph', e.view));
    }
    if (isDoll(e.asset)) {
      poseDoll(fxw.firstChild, e.pose);
      feelDoll(fxw.firstChild, e.feel);
    }
    el.className =
      'ent' +
      (e.id === scene.heroId ? ' hero' : '') +
      (e.id === o.selId ? ' sel' : '') +
      (e.id === scene.target || (scene.point && e.id === scene.point.id) || (o.pickId && e.id === o.pickId) ? ' target' : '') +
      (e.fresh ? ' fresh' : '') +
      (e.gone ? ' gone' : '') +
      (e.tracked || (at.held && at.held.tracked) ? ' tracked' : '') +
      (at.held && (at.held.gone || at.held.fresh) ? ' gone' : '') +
      (o.showKinds && e.solid ? ' solid' : '') +
      (e.active ? ' active' : '') +
      (o.hot && o.hot.has(e.id) ? ' hot' : '') +
      (o.speaker === e.id ? ' speaking' : '') +
      (e.walk && !e.fx ? ' walk' : '') +
      (e.pop ? ' popin' : '');
    el.dataset.name = e.active ? e.active.name : '';
    fxw.className = 'fxw' + (e.fx ? ' fx-' + e.fx : '') + (o.playing && e.once ? ' once-' + e.once : '');
    fxw.firstChild.style.transform = `rotate(${e.rot || 0}deg) scaleX(${faces(e) !== !!(at.held && faces(at.held)) ? -1 : 1})`;
    if (emote.textContent !== (e.emote || '')) emote.textContent = e.emote || '';
    hp.style.display = e.hp == null ? 'none' : 'block';
    if (e.hp != null) hp.firstChild.style.width = clamp((e.hp / (e.maxHp || 1)) * 100, 0, 100) + '%';
    const f = floats.find((x) => x.id === e.id),
      ft = f ? f.text : '';
    if (fl.textContent !== ft) {
      fl.textContent = ft;
      fl.style.color = f ? f.c : '';
    }
    el.style.left = at.x * 100 + '%';
    el.style.top = at.y * 100 + '%';
    el.style.fontSize = `calc(var(--u) * ${e.scale * SPRITE})`;
    el.style.zIndex = at.z;
  }
  for (const [id, el] of root._els)
    if (!live.has(id)) {
      el.remove();
      root._els.delete(id);
    }

  const size = (n) => (n > 100 ? ' xlong' : n > 45 ? ' long' : ''); // longer text is set smaller and wider, so it never fills the stage
  const speakers = scene.entities.filter((e) => e.say && !e.gone).sort((a, b) => (b.id === o.speaker) - (a.id === o.speaker)); // whoever speaks now gets the best spot
  bubbles.replaceChildren(
    ...speakers.map((e) => {
      const at = spot(e),
        sx = at.x * 100 * zoom + panX,
        sy = at.y * 100 * zoom + panY;
      return h(
        'div',
        {
          class: 'bubble' + (o.pop === e.id ? ' pop' : '') + (o.speaker && o.speaker !== e.id ? ' old' : '') + size(e.sayLen || e.say.length),
          'data-id': e.id,
          style: `left:${clamp(sx, 4, 96)}%;bottom:calc(${100 - sy}% + var(--u) * ${(e.scale * SPRITE * tallOf(e.asset) + 0.12) * zoom})`,
        },
        e.say,
      );
    }),
  );
  const droll = scene.roll && scene.roll.by === 'director' ? `${scene.roll.value} (d${scene.roll.sides})  ` : '';
  narrEl.textContent = droll + (scene.narration || '');
  narrEl.className = 'strip narr' + size((scene.narrLen || (scene.narration || '').length) / 2);
  layoutBubbles(root, bubbles, narrEl);
  actEl.textContent = o.noAct ? '' : actionText(scene, o.names || { player: 'Player' }, o.pendingRoll);
  const card = o.travel ? 'Traveling to\n' + o.travel : o.card || '';
  if (cardEl.textContent !== card) cardEl.textContent = card;
  cardEl.classList.toggle('travel', !!o.travel);
  const dice = o.dice ? (o.dice.rolling ? '' : String(o.dice.value)) : '';
  if (diceEl.textContent !== dice) diceEl.textContent = dice;
  diceEl.classList.toggle('rolling', !!(o.dice && o.dice.rolling));
  const award = o.award ? `${o.award.n >= 0 ? '+' : ''}${o.award.n} *${o.award.text ? '\n' + o.award.text : ''}` : '';
  if (awardEl.textContent !== award) awardEl.textContent = award;
}

/** Place speech bubbles: always fully on the stage, clear of the narration, and not on top of each other. */
function layoutBubbles(root, layer, narrEl) {
  if (!layer.children.length) return;
  const st = root.getBoundingClientRect(),
    nb = narrEl.getBoundingClientRect();
  const floor = (nb.height > 4 ? nb.top : st.bottom) - 3,
    placed = [];
  for (const b of layer.children) {
    b.style.transform = 'translate(-50%, 0)';
    const r = b.getBoundingClientRect(),
      w = r.width,
      hh = r.height;
    const fit = (dx, dy) => {
      const L = Math.max(st.left + 3, Math.min(st.right - w - 3, r.left + dx)),
        T = Math.max(st.top + 3, Math.min(floor - hh, r.top + dy));
      return { L, T, R: L + w, B: T + hh };
    };
    const over = (q) =>
      placed.reduce((a, p) => a + Math.max(0, Math.min(q.R, p.R) - Math.max(q.L, p.L)) * Math.max(0, Math.min(q.B, p.B) - Math.max(q.T, p.T)), 0);
    // its natural spot if that is free; otherwise the free spot nearest to it, searched over the whole stage
    let best = { q: fit(0, 0), d: 0 };
    best.ov = over(best.q);
    if (best.ov) {
      for (let T = st.top + 3; T <= floor - hh; T += 14)
        for (const L of [r.left, st.left + 3, st.right - w - 3, (st.left + st.right - w) / 2, r.left - w * 0.6, r.left + w * 0.6]) {
          const q = fit(L - r.left, T - r.top),
            ov = over(q),
            d = Math.hypot(q.L - r.left, q.T - r.top);
          if (ov < best.ov - 1 || (Math.abs(ov - best.ov) <= 1 && d < best.d)) best = { q, ov, d };
        }
    }
    placed.push(best.q);
    const mx = best.q.L - r.left,
      my = best.q.T - r.top;
    b.style.transform = `translate(calc(-50% + ${mx}px), ${my}px)`;
    b.classList.toggle('moved', Math.abs(mx) > 10 || Math.abs(my) > 10); // its pointer would point at the wrong place
  }
}
export function burst(root, kind) {
  if (kind === 'confetti') {
    const box = h(
      'div',
      { class: 'confetti' },
      Array.from({ length: 28 }, (_, i) =>
        h('i', { style: `left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.5}s;background:hsl(${i * 47} 90% 60%)` }),
      ),
    );
    root.append(box);
    setTimeout(() => box.remove(), 2600);
    return;
  }
  root.classList.remove('b-shake', 'b-flash', 'b-hurt');
  void root.offsetWidth;
  root.classList.add('b-' + kind);
  setTimeout(() => root.classList.remove('b-' + kind), 900);
}
