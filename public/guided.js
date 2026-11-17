/*
 * Guided Director mode: instead of tabs full of tools, the Director answers one
 * question at a time. "What happens next?" -> a broad choice -> narrower choices
 * -> done. Each finished path is one EVENT; a turn holds at most five.
 *
 * The flow is a small tree. G.path is where the Director is in it, G.sel the
 * character or thing the current question is about. Every event starts from a
 * snapshot of the draft, so Back/Cancel and "Undo last" are always exact.
 */
import { CATEGORIES, BACKDROPS, backdropCss, assetLabel } from './catalog.js';
import { MOODS, SFX } from './audio.js';
import { h, clone, clamp, glyphNode, actionText } from './stage.js';
import { FX, EMOTES, WEATHER, BURSTS } from './consts.js';

export const MAX_EVENTS = 5;
export const G = { path: [], sel: null, events: [], snap: null, busy: false, cat: '', q: '', note: '', ask: '' };
export function resetGuided() { Object.assign(G, { path: [], sel: null, events: [], snap: null, busy: false, cat: '', q: '', note: '', ask: '' }); }
export const guidedKey = () => [G.path.join('>'), G.sel, G.events.length, G.busy, G.cat].join('~');

const PICKERS = ['speak', 'move', 'edit', 'sheet:give'];   // steps that start with "which one?"
/** A tap on the stage while a "which one?" question is open answers it. */
export function guidedPick(id) {
  const top = G.path[G.path.length - 1];
  if (!PICKERS.includes(top) || G.sel) return false;
  G.sel = id;
  return true;
}

const GROUPS = {
  char: ['people', 'fantasy', 'animals', 'faces'],
  thing: ['things', 'tools', 'food', 'vehicles', 'wear', 'nature', 'places', 'blocks', 'body'],
  fx: ['effects'],
};
const short = (s, n = 28) => (s.length > n ? s.slice(0, n) + '…' : s);

export function buildGuided(p, c) {
  const d = c.draft, S = c.S, code = c.code, top = G.path[G.path.length - 1] || '';
  const sel = d.entities.find((e) => e.id === G.sel);
  const me = d.entities.find((e) => e.id === d.heroId);
  const lab = (e) => assetLabel(e.asset);
  const setup = S.turn === 0;
  if (p._gpath !== G.path.join('>') + G.sel) { p._gpath = G.path.join('>') + G.sel; p.scrollTop = 0; }   // each new question starts at the top

  /* ---------- navigation ---------- */
  const enter = (step) => { if (!G.path.length) G.snap = clone(d); G.path.push(step); c.setRec(step === 'move:rec'); c.select(G.sel); c.rebuild(); };
  const leave = () => { G.path = []; G.sel = null; G.snap = null; G.note = ''; c.setRec(false); c.select(null); };
  const cancel = () => { c.setDraft(G.snap); leave(); c.rebuild(); };
  const back = () => {
    if (PICKERS.includes(top) && G.sel) G.sel = null; else G.path.pop();
    if (!G.path.length) return cancel();
    c.setRec(false); c.select(G.sel); c.rebuild();
  };
  const done = (label) => { G.events.push({ label, snap: G.snap }); leave(); c.rebuild(); };
  const undo = () => { const ev = G.events.pop(); if (ev) { c.setDraft(ev.snap); leave(); c.rebuild(); } };

  /* ---------- building blocks ---------- */
  const head = (title, sub) => p.append(h('div', { class: 'ghead' }, h('button', { class: 'gback', onclick: back, 'aria-label': 'Back' }, '◀ Back'), h('div', {}, h('b', {}, title), sub && h('small', {}, sub))));
  const opt = (icon, label, hint, fn) => h('button', { class: 'gopt', onclick: fn }, h('span', { class: 'gi' }, icon), h('span', { class: 'gl' }, h('b', {}, label), hint && h('small', {}, hint)));
  const doneBtn = (label, text = '✓ Done') => h('button', { class: 'primary gdone', onclick: () => done(typeof label === 'function' ? label() : label) }, text);
  const picker = (title) => {
    head(title, 'Tap one here, or tap it on the stage.');
    const list = d.entities;
    p.append(list.length ? h('div', { class: 'grid' }, list.map((e) => h('button', { class: e.id === d.heroId ? 'heroopt' : '', onclick: () => { G.sel = e.id; c.select(e.id); c.rebuild(); } }, glyphNode(code, e.asset))))
      : h('p', { class: 'dim' }, 'The stage is empty. Go back and add something first.'));
  };
  const chips = (list, key, onPick) => h('div', { class: 'chips wrap' }, list.map(([v, label]) => h('button', {
    'data-mark': `${key}=${v}`, class: String(d[key] ?? '') === String(v) ? 'on' : '', onclick: () => { d[key] = v; if (onPick) onPick(v); c.changed(); } }, label)));
  const selChips = (list, key) => h('div', { class: 'chips wrap' }, list.map(([v, label]) => h('button', { class: sel[key] === v ? 'on' : '', onclick: () => { sel[key] = v; c.rebuild(); } }, label)));
  const lookRow = () => {
    const b = (label, title, fn) => h('button', { class: 'grow', title, 'aria-label': title, onclick: () => { fn(); c.changed(); } }, label);
    return h('div', { class: 'row' },
      b('➖', 'Smaller', () => { sel.scale = clamp(sel.scale / 1.3, 0.3, 6); }), b('➕', 'Bigger', () => { sel.scale = clamp(sel.scale * 1.3, 0.3, 6); }),
      b('↺', 'Rotate left', () => { sel.rot = (sel.rot - 15) % 360; }), b('↻', 'Rotate right', () => { sel.rot = (sel.rot + 15) % 360; }), b('↔️', 'Flip', () => { sel.flip = !sel.flip; }));
  };
  const sayInput = (ph) => h('input', { placeholder: ph, maxlength: 160, value: sel.say, enterkeyhint: 'done', oninput: (ev) => { sel.say = ev.target.value; c.changedQuiet(); } });
  const walk = (label, x, y) => {       // an automatic move, timed by distance
    const ms = clamp(Math.hypot(x - sel.x, y - sel.y) * 3200, 500, 3000);
    if (c.autoTrack(sel, [[ms, x, y]])) done(`${lab(sel)} ${label}`);
  };

  /* ================= root: what the Player did, then "what happens next?" ================= */
  if (!top) {
    if (!setup) {
      const lines = [];
      if (me && me.say) lines.push(h('div', {}, `“${me.say}”`));
      const did = actionText(d, S.names).replace(/^✋ [^:]*: /, '');
      if (did) lines.push(h('div', {}, h('i', {}, did)));
      p.append(h('div', { class: 'card told' }, h('small', { class: 'dim' }, `🧑 ${S.names.player} just…`), lines.length ? lines : h('div', { class: 'dim' }, me && S.turn > 1 ? 'moved, and said nothing.' : 'has not done anything yet.')));
      // direct answers to what the Player asked for
      const tgt = d.target && d.entities.find((e) => e.id === d.target);
      if (tgt && c.mods().inventory) p.append(h('div', { class: 'card ask' }, h('b', {}, `${S.names.player} reaches for `, glyphNode(code, tgt.asset, 'mini'), ' — do they get it?'),
        h('div', { class: 'row' }, h('button', { class: 'primary grow', onclick: () => { G.snap = clone(d); c.giveToPlayer(tgt); done(`${S.names.player} takes ${lab(tgt)}`); } }, '🎒 Yes, they take it'),
          h('button', { class: 'grow', onclick: () => { d.target = null; c.rebuild(); } }, 'No'))));
      const used = d.use && d.sheet.inv.find((i) => i.id === d.use);
      if (used) p.append(h('div', { class: 'card ask' }, h('b', {}, `${S.names.player} uses `, glyphNode(code, used.asset, 'mini'), ' — is it used up?'),
        h('div', { class: 'row' }, h('button', { class: 'primary grow', onclick: () => { G.snap = clone(d); d.sheet.inv = d.sheet.inv.filter((i) => i !== used); d.use = null; done(`${assetLabel(used.asset, used.name)} is used up`); } }, 'Yes, it is gone'),
          h('button', { class: 'grow', onclick: () => { d.use = null; c.rebuild(); } }, 'No, they keep it'))));
    }
    const full = !setup && G.events.length >= MAX_EVENTS;
    p.append(h('div', { class: 'gtitle' }, h('b', {}, setup ? 'Set the stage' : full ? 'That is five events' : 'What happens next?'),
      h('small', { class: 'dim' }, setup ? 'Build the opening scene, then begin.' : full ? 'End the turn, or undo one.' : `Event ${G.events.length + 1} of ${MAX_EVENTS}`)));
    if (!full) {
      const sheet = c.mods().inventory || c.mods().stats || c.mods().dice;
      p.append(h('div', { class: 'gopts' },
        opt('💬', 'Someone speaks', 'Give a character a line', () => enter('speak')),
        opt('🚶', 'Move or animate', 'Walk, jump, record a path', () => enter('move')),
        opt('➕', 'Add something', 'A character, a thing, an effect', () => enter('add')),
        opt('✏️', 'Change something', 'Size, look, effect, remove', () => enter('edit')),
        opt('🌄', 'Change the scene', 'Place, weather, music, sound', () => enter('scene')),
        opt('📝', 'Narrate', 'Tell what happens in words', () => enter('narrate')),
        sheet && opt('🎒', `${S.names.player}’s sheet`, 'Items, stats, dice', () => enter('sheet')),
        opt('🤖', 'Tell Claude', 'Describe it, Claude stages it', () => enter('claude'))));
    }
    if (G.events.length) {
      p.append(h('div', { class: 'card gevents' }, h('small', { class: 'dim' }, 'This turn so far'),
        G.events.map((ev, i) => h('div', {}, `${i + 1}. ${ev.label}`)),
        h('div', { class: 'row' }, h('button', { class: 'grow', onclick: undo }, '↶ Undo last'), h('button', { class: 'grow', onclick: c.preview }, c.cutting() ? '■ Stop' : '▶ Preview the turn'))));
    }
    return;
  }

  /* ================= 💬 speak ================= */
  if (top === 'speak') {
    if (!sel) return picker('Who speaks?');
    head(`What does ${lab(sel)} say?`);
    p.append(sayInput('Type the line…'), h('small', { class: 'dim' }, 'With a face (optional)'),
      h('div', { class: 'chips wrap' }, EMOTES.map((e) => h('button', { class: sel.emote === e ? 'on' : '', onclick: () => { sel.emote = sel.emote === e ? '' : e; c.rebuild(); } }, e))),
      doneBtn(() => (sel.say ? `${lab(sel)} says “${short(sel.say)}”` : `${lab(sel)} falls silent`)));
    return;
  }

  /* ================= 🚶 move / animate ================= */
  if (top === 'move') {
    if (!sel) return picker('Who or what moves?');
    head(`How does ${lab(sel)} move?`, 'The Player watches it happen before their turn.');
    const far = sel.x < 0.5 ? 0.92 : 0.08, edge = sel.x < 0.5 ? 0 : 1;
    p.append(h('div', { class: 'gopts' },
      opt('✋', 'Put it somewhere', 'Drag it; it glides there', () => enter('move:drag')),
      opt('🔴', 'Record a path', 'Drag it, your timing is kept', () => enter('move:rec')),
      me && sel !== me && opt('🧑', 'Walk to the hero', '', () => walk('walks up to the hero', clamp(me.x + (sel.x < me.x ? -0.13 : 0.13), 0.05, 0.95), me.y)),
      opt('↔️', 'Cross the stage', '', () => walk('crosses the stage', far, sel.y)),
      opt('🚪', 'Walk off to the side', '', () => walk('walks off', edge, sel.y)),
      opt('⤴️', 'Jump', '', () => { if (c.autoTrack(sel, [[220, sel.x, sel.y - 0.14], [220, sel.x, sel.y], [200, sel.x, sel.y - 0.09], [200, sel.x, sel.y]])) done(`${lab(sel)} jumps`); }),
      opt('〰️', 'Tremble', '', () => { const s = []; for (let i = 0; i < 10; i++) s.push([80, sel.x + (i % 2 ? 0.012 : -0.012), sel.y]); s.push([80, sel.x, sel.y]); if (c.autoTrack(sel, s)) done(`${lab(sel)} trembles`); }),
      opt('🌀', 'Keep moving on the spot', 'Bounce, spin, float…', () => enter('edit:fx'))));
    return;
  }
  if (top === 'move:drag') {
    head(`Drag ${lab(sel)} to its new place`, 'It will glide there when the turn plays.');
    p.append(doneBtn(() => `${lab(sel)} moves`));
    return;
  }
  if (top === 'move:rec') {
    const used = c.tracksEnd();
    head(`Recording ${lab(sel)}`, 'Drag it across the stage now. Lift your finger to stop; drag again to add more.');
    p.append(h('div', { class: 'meter' }, h('i', { style: `width:${used / 100}%` })), h('small', { class: 'dim' }, `${(used / 1000).toFixed(1)} of 10 seconds used this turn`),
      h('div', { class: 'row' }, h('button', { class: 'grow', onclick: c.preview }, c.cutting() ? '■ Stop' : '▶ Preview'), doneBtn(() => `${lab(sel)} moves along a path`)));
    return;
  }

  /* ================= ➕ add ================= */
  if (top === 'add') {
    head('Add what?');
    p.append(h('div', { class: 'gopts' },
      opt('🧑', 'A character', 'People, creatures, animals, faces', () => { G.cat = 'people'; enter('add:char'); }),
      opt('📦', 'A thing', 'Objects, places, vehicles, food…', () => { G.cat = 'things'; enter('add:thing'); }),
      opt('✨', 'An effect or sign', 'Explosions, hearts, arrows…', () => { G.cat = 'effects'; enter('add:fx'); }),
      opt('🔍', 'Search by name', 'Look through everything', () => { G.q = ''; enter('add:search'); }),
      opt('🖼️', 'Something of my own', 'A photo, a new creation, any emoji', () => enter('add:own'))));
    return;
  }
  const place = (asset) => { const e = c.addEntity(asset); if (e) { G.sel = e.id; G.path.push('added'); c.select(e.id); c.rebuild(); } };
  if (top === 'add:char' || top === 'add:thing' || top === 'add:fx') {
    const ids = GROUPS[top.slice(4)], cat = CATEGORIES.find((x) => x.id === G.cat) || CATEGORIES.find((x) => x.id === ids[0]);
    head('Pick one', 'It appears on the stage.');
    if (ids.length > 1) p.append(h('div', { class: 'chips' }, ids.map((id) => { const x = CATEGORIES.find((k) => k.id === id); return h('button', { class: x === cat ? 'on' : '', onclick: () => { G.cat = id; c.rebuild(); } }, x.label); })));
    p.append(h('div', { class: 'grid' }, cat.items.map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => place(i.asset) }, glyphNode(code, i.asset)))));
    return;
  }
  if (top === 'add:search') {
    head('Search');
    const grid = h('div', { class: 'grid' });
    const fill = () => {
      const q = G.q.trim().toLowerCase();
      const items = q ? CATEGORIES.flatMap((x) => x.items).filter((i) => i.name.includes(q)).slice(0, 120) : [];
      grid.replaceChildren(...items.map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => place(i.asset) }, glyphNode(code, i.asset))));
      if (q && !items.length) grid.append(h('p', { class: 'dim', style: 'grid-column:1/-1;margin:4px' }, 'Nothing found. Go back and try “Something of my own”.'));
    };
    p.append(h('input', { type: 'search', placeholder: 'dragon, door, key, angry…', value: G.q, enterkeyhint: 'search', oninput: (ev) => { G.q = ev.target.value; fill(); } }), grid);
    fill();
    return;
  }
  if (top === 'add:own') {
    head('Something of your own');
    const mine = S.assets.filter((a) => a.kind === 'sprite');
    const any = h('input', { placeholder: 'Any emoji or a short word', maxlength: 24 });
    if (mine.length) p.append(h('div', { class: 'grid' }, mine.map((a) => h('button', { title: a.name, onclick: () => place('c:' + a.id) }, glyphNode(code, 'c:' + a.id)))));
    p.append(c.maker('sprite', (id) => place('c:' + id)), h('div', { class: 'row' }, any, h('button', { onclick: () => { const v = any.value.trim(); if (v) place('e:' + v); } }, 'Add')));
    return;
  }
  if (top === 'added') {
    if (!sel) return cancel();
    head(`${lab(sel)} is on stage`, 'Drag it where it belongs.');
    p.append(lookRow(), sayInput('Does it say something? (optional)'), doneBtn(() => `${lab(sel)} appears`));
    return;
  }

  /* ================= ✏️ change ================= */
  if (top === 'edit') {
    if (!sel) return picker('Change which one?');
    head(`Change ${lab(sel)} how?`);
    const isHero = sel.id === d.heroId;
    p.append(h('div', { class: 'gopts' },
      opt('💬', 'What it says', '', () => enter('speak')),
      opt('📐', 'Size and direction', 'Bigger, smaller, rotate, flip', () => enter('edit:look')),
      opt('🌀', 'A looping effect', 'Bounce, glow, see-through…', () => enter('edit:fx')),
      opt('😀', 'Its mood', 'A small face above it', () => enter('edit:emote')),
      opt('🔄', 'Turn it into something else', 'Keeps its place and size', () => { G.q = ''; enter('edit:swap'); }),
      opt('⧉', 'Make a copy', '', () => { const k = { ...clone(sel), id: Math.random().toString(36).slice(2, 10), x: clamp(sel.x + 0.09, 0, 1), say: '' }; d.entities.push(k); done(`${lab(sel)} is copied`); }),
      opt('🧑', isHero ? 'No longer the Player’s character' : 'Make it the Player’s character', '', () => { d.heroId = isHero ? null : sel.id; done(isHero ? `${lab(sel)} is no longer the hero` : `${lab(sel)} becomes the hero`); }),
      c.mods().inventory && !isHero && opt('🎒', `Give it to ${S.names.player}`, 'Goes into their inventory', () => { const l = lab(sel); c.giveToPlayer(sel); done(`${S.names.player} gets ${l}`); }),
      opt('🗑️', 'Remove it', '', () => { const l = lab(sel); c.removeEntity(sel); done(`${l} disappears`); })));
    return;
  }
  if (top === 'edit:look') { head(`Size and direction of ${lab(sel)}`); p.append(lookRow(), doneBtn(() => `${lab(sel)} changes`)); return; }
  if (top === 'edit:fx') { head(`Effect on ${lab(sel)}`, 'It keeps doing this until you change it.'); p.append(selChips(FX, 'fx'), doneBtn(() => `${lab(sel)}: ${(FX.find((f) => f[0] === sel.fx) || FX[0])[1].toLowerCase()}`)); return; }
  if (top === 'edit:emote') { head(`Mood of ${lab(sel)}`); p.append(selChips([['', 'None'], ...EMOTES.map((e) => [e, e])], 'emote'), doneBtn(() => `${lab(sel)} ${sel.emote || 'calms down'}`)); return; }
  if (top === 'edit:swap') {
    head(`Turn ${lab(sel)} into…`);
    const grid = h('div', { class: 'grid' }), was = lab(sel);
    const fill = () => {
      const q = G.q.trim().toLowerCase();
      const items = q ? CATEGORIES.flatMap((x) => x.items).filter((i) => i.name.includes(q)).slice(0, 120) : [];
      grid.replaceChildren(...items.map((i) => h('button', { title: i.name, onclick: () => { sel.asset = i.asset; done(`${was} turns into ${lab(sel)}`); } }, glyphNode(code, i.asset))));
    };
    p.append(h('input', { type: 'search', placeholder: 'Search: frog, statue, skeleton…', value: G.q, oninput: (ev) => { G.q = ev.target.value; fill(); } }), grid);
    fill();
    return;
  }

  /* ================= 🌄 scene ================= */
  if (top === 'scene') {
    head('Change what about the scene?');
    p.append(h('div', { class: 'gopts' },
      opt('🌄', 'The place', 'A new backdrop', () => enter('scene:place')),
      opt('🌦️', 'The weather', 'Rain, fog, darkness…', () => enter('scene:weather')),
      opt('🎵', 'The music', '', () => enter('scene:music')),
      opt('💥', 'A sudden moment', 'Shake, flash, a sound', () => enter('scene:moment')),
      opt('🎬', 'A title card', '“Chapter 2”, “Later that night”', () => enter('scene:card')),
      opt('❓', 'Offer choices', `Quick options for ${S.names.player}`, () => enter('scene:choices')),
      opt('🎲', 'A surprise scene', 'A ready-made place and cast', async () => { G.snap = clone(d); if (await c.randomScene()) done('A whole new scene'); })));
    return;
  }
  if (top === 'scene:place') {
    head('Where are we now?');
    const drop = (id, name) => h('button', { 'data-mark': `backdrop=${id}`, class: d.backdrop === id ? 'on' : '', style: `background:${backdropCss(code, id)}`, onclick: () => { d.backdrop = id; c.changed(); } }, name);
    p.append(doneBtn('The place changes'), h('div', { class: 'grid drops' }, BACKDROPS.map((b) => drop(b.id, b.name)), S.assets.filter((a) => a.kind === 'backdrop').map((a) => drop('c:' + a.id, a.name))),
      c.maker('backdrop', (id) => { d.backdrop = 'c:' + id; c.rebuild(); }));
    return;
  }
  if (top === 'scene:weather') { head('The weather'); p.append(chips(WEATHER, 'weather'), doneBtn(() => `Weather: ${(WEATHER.find((w) => w[0] === d.weather) || WEATHER[0])[1]}`)); return; }
  if (top === 'scene:music') {
    head('The music');
    p.append(h('div', { class: 'list' }, MOODS.map((m) => h('button', { 'data-mark': `mood=${m.id}`, class: d.mood === m.id ? 'on' : '', onclick: () => { c.audio.unlock(); d.mood = m.id; c.changed(); } }, m.name))),
      doneBtn(() => `Music: ${(MOODS.find((m) => m.id === d.mood) || MOODS[0]).name}`));
    return;
  }
  if (top === 'scene:moment') {
    head('A sudden moment', 'Happens once, when the turn plays.');
    p.append(h('small', { class: 'dim' }, 'On screen'), chips(BURSTS, 'burst'), h('small', { class: 'dim' }, 'Sound'), chips(SFX, 'sfx', (v) => { c.audio.unlock(); c.audio.sfx(v); }), doneBtn('A sudden moment'));
    return;
  }
  if (top === 'scene:card') {
    head('Title card', 'Shown full-screen before the turn plays.');
    p.append(h('input', { placeholder: '“Chapter 2 — The Cave”', maxlength: 60, value: d.card, oninput: (ev) => { d.card = ev.target.value; c.changedQuiet(); } }), doneBtn(() => `Title card “${short(d.card)}”`));
    return;
  }
  if (top === 'scene:choices') {
    head(`Choices for ${S.names.player}`, 'They can tap one, or still type anything.');
    const inp = (i) => h('input', { placeholder: `Choice ${i + 1}`, maxlength: 40, value: d.choices[i] || '', oninput: (ev) => { for (let k = 0; k < 3; k++) d.choices[k] ||= ''; d.choices[i] = ev.target.value; c.changedQuiet(); } });
    p.append(inp(0), inp(1), inp(2), doneBtn('Choices offered'));
    return;
  }

  /* ================= 📝 narrate ================= */
  if (top === 'narrate') {
    head('Narrate', 'Shown under the stage, after everything else.');
    p.append(h('input', { placeholder: '“Suddenly, the lights go out.”', maxlength: 240, value: d.narration, enterkeyhint: 'done', oninput: (ev) => { d.narration = ev.target.value; c.changedQuiet(); } }),
      doneBtn(() => (d.narration ? `Narration “${short(d.narration)}”` : 'No narration')));
    return;
  }

  /* ================= 🎒 the Player's sheet ================= */
  if (top === 'sheet') {
    head(`${S.names.player}’s sheet`);
    const m = c.mods();
    if (m.stats) {
      p.append(h('small', { class: 'dim' }, 'Stats'), d.sheet.stats.map((st) => h('div', { class: 'row statrow' }, h('b', { class: 'grow' }, `${st.name}  ${st.value}${st.max != null ? '/' + st.max : ''}`),
        h('button', { onclick: () => { st.value = clamp(st.value - 1, -9999, 9999); c.rebuild(); } }, '−'), h('button', { onclick: () => { st.value = clamp(st.value + 1, -9999, st.max ?? 9999); c.rebuild(); } }, '+'))));
      if (!d.sheet.stats.length) p.append(h('p', { class: 'dim small' }, 'No stats yet. Add them with “+ stat” in the bar under the stage.'));
    }
    if (m.inventory) {
      p.append(h('small', { class: 'dim' }, 'Inventory'),
        d.sheet.inv.length ? h('div', { class: 'chips wrap' }, d.sheet.inv.map((it) => h('button', { title: 'Take it away', onclick: () => { d.sheet.inv = d.sheet.inv.filter((x) => x !== it); c.rebuild(); } }, glyphNode(code, it.asset, 'mini'), ' ✕'))) : h('p', { class: 'dim small' }, 'Empty.'),
        h('button', { onclick: () => enter('sheet:give') }, '🎒 Give them something from the stage'));
    }
    if (m.dice) p.append(h('small', { class: 'dim' }, 'Roll a die with this turn'), chips([[0, 'No roll'], [6, '🎲 d6'], [20, '🎲 d20']], 'rollWant'));
    p.append(doneBtn(`${S.names.player}’s sheet changes`));
    return;
  }
  if (top === 'sheet:give') {
    if (!sel) return picker(`Give ${S.names.player} which thing?`);
    if (sel.id === d.heroId) { G.sel = null; c.toast('That is the Player’s own character'); return picker(`Give ${S.names.player} which thing?`); }
    const l = lab(sel); c.giveToPlayer(sel); return done(`${S.names.player} gets ${l}`);
  }

  /* ================= 🤖 Claude ================= */
  if (top === 'claude') {
    head('Tell Claude what happens', 'Describe it in your own words. Claude sets it up on the stage; you can still change it.');
    if (!S.claude) { p.append(h('div', { class: 'card' }, h('b', {}, 'Claude is not connected yet'), h('p', { class: 'dim small' }, 'Whoever hosts this game needs to add an Anthropic API key (ANTHROPIC_API_KEY) to the server. Everything else works without it.'))); return; }
    const ta = h('textarea', { rows: 4, maxlength: 600, placeholder: 'e.g. “A dragon crashes through the wall, the wizard screams and runs off to the left, and it starts to rain.”' }, G.ask);
    ta.addEventListener('input', () => { G.ask = ta.value; });
    const go = h('button', { class: 'primary gdone', disabled: G.busy, onclick: async () => {
      const text = ta.value.trim(); if (!text) return ta.focus();
      G.busy = true; c.rebuild();
      try {
        const r = await c.act('claude', { text, scene: c.draft }, 1);
        const keep = c.draft;
        c.setDraft({ ...r.scene, action: keep.action, target: keep.target, use: keep.use, roll: keep.roll, rollWant: keep.rollWant });
        G.note = r.note || 'Done.'; G.path.push('claude:done');
      } catch (e) { c.toast(e.message); }
      G.busy = false; c.rebuild();
    } }, G.busy ? '🤖 Claude is setting the stage…' : '🤖 Make it happen');
    p.append(ta, go);
    return;
  }
  if (top === 'claude:done') {
    head('Claude staged it', 'Look at the stage. Drag things if you want them elsewhere.');
    p.append(h('div', { class: 'card' }, h('small', { class: 'dim' }, '🤖 Claude'), h('div', {}, G.note)),
      h('div', { class: 'row' }, h('button', { class: 'grow', onclick: c.preview }, c.cutting() ? '■ Stop' : '▶ Preview'), h('button', { class: 'grow', onclick: () => { c.setDraft(clone(G.snap)); G.path.pop(); c.rebuild(); } }, '↶ Try again')),
      doneBtn(() => `🤖 ${short(G.ask, 40)}`, '✓ Keep it'));
    return;
  }
  cancel();
}
