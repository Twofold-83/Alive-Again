/*
 * The Director's panel. A turn is built step by step:
 *
 *   - The step bar on top shows the steps of this turn. Everything done within
 *     one step plays at the same time; "+ Next step" starts what comes after.
 *     There is no limit on steps. A step can be reset, earlier steps can be
 *     returned to, and "Clear steps" starts the turn over.
 *   - Below it, one question at a time: "What happens in this step?" -> a broad
 *     choice -> narrower choices. Nothing here is modal: Back only navigates,
 *     and the stage always shows the step as it currently stands.
 *
 * G.path is where the Director is in the question tree, G.sel the character or
 * thing the current question is about.
 */
import { CATEGORIES, PIXEL, allItems, BACKDROPS, backdropCss, assetLabel } from './catalog.js';
import { MOODS, SFX } from './audio.js';
import { h, clone, clamp, glyphNode, actionText } from './stage.js';
import { FX, EMOTES, WEATHER, BURSTS } from './consts.js';

export const G = { path: [], sel: null, log: [], busy: false, cat: '', q: '', note: '', ask: '' };
export function resetGuided() { Object.assign(G, { path: [], sel: null, log: [], busy: false, cat: '', q: '', note: '' }); }
export const guidedKey = () => [G.path.join('>'), G.sel, G.log.length, G.busy, G.cat].join('~');

/** Which stage tool the open screen needs: dragging records a path, or draws. */
export const guidedTool = () => { const top = G.path[G.path.length - 1]; return top === 'move:rec' ? 'rec' : top === 'draw' ? 'draw' : ''; };

const PICKERS = ['speak', 'move', 'give'];   // questions that start with "which one?"
/** A tap on something on the stage: answers an open "which one?", otherwise opens that thing's own tools. */
export function guidedPick(id) {
  const top = G.path[G.path.length - 1] || '';
  if (PICKERS.includes(top) && !G.sel) { G.sel = id; return; }
  if (!top || top === 'thing') { G.path = ['thing']; G.sel = id; }
}

const EMOJI_GROUPS = {
  char: ['people', 'fantasy', 'animals', 'faces'],
  thing: ['things', 'tools', 'food', 'vehicles', 'wear', 'nature', 'places', 'body'],
  tile: ['blocks'],
  fx: ['effects'],
};
/** Categories for one "Add something" branch: pixel art first, then the emoji library. */
const groupCats = (g) => [...PIXEL.filter((c) => c.group === g), ...EMOJI_GROUPS[g].map((id) => { const c = CATEGORIES.find((k) => k.id === id); return { ...c, label: '😀 ' + c.label }; })];
const short = (s, n = 28) => (s.length > n ? s.slice(0, n) + '…' : s);
const PENS = ['#ffffff', '#15131c', '#ff5a5a', '#ffb454', '#ffe14d', '#57d38c', '#4db8ff', '#c77dff'];

export function buildGuided(p, c) {
  const d = c.draft, S = c.S, code = c.code, top = G.path[G.path.length - 1] || '';
  const sel = d.entities.find((e) => e.id === G.sel);
  const me = d.entities.find((e) => e.id === d.heroId);
  const lab = (e) => assetLabel(e.asset);
  const setup = S.turn === 0, stepNo = d.steps.length + 1;
  if (p._gpath !== G.path.join('>') + G.sel) { p._gpath = G.path.join('>') + G.sel; p.scrollTop = 0; }

  /* ---------- navigation ---------- */
  const home = () => { G.path = []; G.sel = null; c.select(null); };
  const enter = (step) => { G.path.push(step); c.select(G.sel); c.rebuild(); };
  const back = () => {
    if (PICKERS.includes(top) && G.sel && G.path.length === 1) G.sel = null; else G.path.pop();
    if (!G.path.length) G.sel = null;
    c.select(G.sel); c.rebuild();
  };
  const done = (label) => { if (label && !setup) G.log.push(label); home(); c.rebuild(); };

  /* ---------- the step bar ---------- */
  if (!setup) {
    p.append(h('div', { class: 'stepbar' },
      h('div', { class: 'steps' }, h('span', { class: 'dim small' }, 'Steps'),
        d.steps.map((_, i) => h('button', { class: 'stepchip', title: 'Go back to this step (later steps are removed)', onclick: () => { if (confirm(`Go back to step ${i + 1}? Steps after it will be removed.`)) c.gotoStep(i); } }, String(i + 1))),
        h('button', { class: 'stepchip on', title: 'The step you are working on' }, String(stepNo)),
        h('button', { class: 'stepadd', id: 'nextStep', title: 'Finish this step and start what happens after it', onclick: () => c.nextStep() }, '＋ Next step')),
      h('div', { class: 'row' },
        h('button', { class: 'grow', id: 'previewBtn', onclick: c.preview }, c.cutting() ? '■ Stop' : '▶ Preview turn'),
        h('button', { class: 'grow', id: 'resetStep', title: 'Undo everything in this step', onclick: () => c.resetStep() }, '↶ Reset step'),
        h('button', { class: 'grow', id: 'clearSteps', title: 'Start the whole turn over', onclick: () => { if (d.steps.length === 0 || confirm('Remove every step of this turn and start over?')) c.clearSteps(); } }, '🗑 Clear steps'))));
  }

  /* ---------- building blocks ---------- */
  const head = (title, sub) => p.append(h('div', { class: 'ghead' }, h('button', { class: 'gback', onclick: back, 'aria-label': 'Back' }, '◀ Back'), h('div', {}, h('b', {}, title), sub && h('small', {}, sub))));
  const opt = (icon, label, hint, fn, on) => h('button', { class: 'gopt' + (on ? ' on' : ''), onclick: fn }, h('span', { class: 'gi' }, icon), h('span', { class: 'gl' }, h('b', {}, label), hint && h('small', {}, hint)));
  const doneBtn = (label, text = '✓ Done') => h('button', { class: 'primary gdone', onclick: () => done(typeof label === 'function' ? label() : label) }, text);
  const picker = (title) => {
    head(title, 'Pick one here, or click it on the stage.');
    p.append(d.entities.length ? h('div', { class: 'grid' }, d.entities.map((e) => h('button', { class: e.id === d.heroId ? 'heroopt' : '', onclick: () => { G.sel = e.id; c.select(e.id); c.rebuild(); } }, glyphNode(code, e.asset))))
      : h('p', { class: 'dim' }, 'The stage is empty. Go back and add something first.'));
  };
  const chips = (list, key, onPick) => h('div', { class: 'chips wrap' }, list.map(([v, label]) => h('button', {
    'data-mark': `${key}=${v}`, class: String(d[key] ?? '') === String(v) ? 'on' : '', onclick: () => { d[key] = v; if (onPick) onPick(v); c.changed(); } }, label)));
  const lookRow = () => {
    const b = (label, title, fn) => h('button', { class: 'grow', title, 'aria-label': title, onclick: () => { fn(); c.changed(); } }, label);
    return h('div', { class: 'row' },
      b('➖', 'Smaller', () => { sel.scale = clamp(sel.scale / 1.3, 0.3, 6); }), b('➕', 'Bigger', () => { sel.scale = clamp(sel.scale * 1.3, 0.3, 6); }),
      b('↺', 'Rotate left', () => { sel.rot = (sel.rot - 15) % 360; }), b('↻', 'Rotate right', () => { sel.rot = (sel.rot + 15) % 360; }), b('↔️', 'Flip', () => { sel.flip = !sel.flip; }));
  };
  const sayInput = (ph) => h('input', { placeholder: ph, maxlength: 160, value: sel.say, enterkeyhint: 'done', oninput: (ev) => { sel.say = ev.target.value; c.changedQuiet(); } });
  const pickSel = (list, key, title) => h('select', { title, 'aria-label': title, onchange: (ev) => { sel[key] = ev.target.value; c.changedQuiet(); } }, list.map(([v, l]) => h('option', { value: v, selected: sel[key] === v }, l)));
  const walk = (label, x, y) => {       // an automatic move, timed by distance
    const ms = clamp(Math.hypot(x - sel.x, y - sel.y) * 3200, 500, 3000);
    if (c.autoTrack(sel, [[ms, x, y]])) done(`${lab(sel)} ${label}`);
  };
  const place = (asset) => { const e = c.addEntity(asset); if (e) { G.sel = e.id; G.path = ['thing']; if (!setup) G.log.push(`${lab(e)} appears`); c.select(e.id); c.rebuild(); } };
  const itemGrid = (items, onPick) => h('div', { class: 'grid' }, items.map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => onPick(i) }, glyphNode(code, i.asset))));
  const searchGrid = (onPick, ph) => {
    const grid = h('div', { class: 'grid' });
    const fill = () => {
      const q = G.q.trim().toLowerCase();
      const items = q ? allItems().filter((i) => i.name.includes(q)).slice(0, 150) : [];
      grid.replaceChildren(...items.map((i) => h('button', { title: i.name, 'aria-label': i.name, onclick: () => onPick(i) }, glyphNode(code, i.asset))));
      if (q && !items.length) grid.append(h('p', { class: 'dim', style: 'grid-column:1/-1;margin:4px' }, 'Nothing found.'));
    };
    fill();
    return [h('input', { type: 'search', placeholder: ph, value: G.q, enterkeyhint: 'search', oninput: (ev) => { G.q = ev.target.value; fill(); } }), grid];
  };

  /* ================= root ================= */
  if (!top) {
    if (!setup) {
      const did = actionText(d, S.names).replace(/^✋ [^:]*: /, '');
      p.append(h('div', { class: 'card told' }, h('small', { class: 'dim' }, `🧑 ${S.names.player} just…`), did ? h('div', {}, h('i', {}, did)) : h('div', { class: 'dim' }, S.turn > 1 ? 'moved, and said nothing.' : 'has not done anything yet.')));
      const tgt = d.target && d.entities.find((e) => e.id === d.target);
      if (tgt && c.mods().inventory) p.append(h('div', { class: 'card ask' }, h('b', {}, `${S.names.player} reaches for `, glyphNode(code, tgt.asset, 'mini'), ' — do they get it?'),
        h('div', { class: 'row' }, h('button', { class: 'primary grow', onclick: () => { const l = lab(tgt); c.giveToPlayer(tgt); done(`${S.names.player} takes ${l}`); } }, '🎒 Yes, they take it'),
          h('button', { class: 'grow', onclick: () => { d.target = null; c.rebuild(); } }, 'No'))));
      const used = d.use && d.sheet.inv.find((i) => i.id === d.use);
      if (used) p.append(h('div', { class: 'card ask' }, h('b', {}, `${S.names.player} uses `, glyphNode(code, used.asset, 'mini'), ' — is it used up?'),
        h('div', { class: 'row' }, h('button', { class: 'primary grow', onclick: () => { d.sheet.inv = d.sheet.inv.filter((i) => i !== used); d.use = null; done(`${assetLabel(used.asset, used.name)} is used up`); } }, 'Yes, it is gone'),
          h('button', { class: 'grow', onclick: () => { d.use = null; c.rebuild(); } }, 'No, they keep it'))));
      if (S.rules.player === 'limited' && !d.choices.filter(Boolean).length) p.append(h('div', { class: 'card ask' }, h('b', {}, `Limited will: ${S.names.player} needs options`),
        h('p', { class: 'dim small' }, 'Write up to three things they may do next turn. Without options they can act freely.'), h('button', { class: 'primary', onclick: () => enter('choices') }, '❓ Write the options')));
    }
    p.append(h('div', { class: 'gtitle' }, h('b', {}, setup ? 'Set the stage' : `Step ${stepNo} — what happens?`),
      h('small', { class: 'dim' }, setup ? 'Build the opening scene, then begin.' : 'All of it plays at the same time.')));
    const sheet = c.mods().inventory || c.mods().stats || c.mods().dice;
    p.append(h('div', { class: 'gopts' },
      opt('➕', 'Add something', 'A character, a thing, an effect', () => enter('add')),
      opt('💬', 'Someone speaks', 'Give a character a line', () => enter('speak')),
      opt('🚶', 'Move or animate', 'Walk, jump, record a path', () => enter('move')),
      opt('📝', 'Narrate', 'Tell what happens in words', () => { d.narration = ''; enter('narrate'); }),
      opt('💥', 'Moment and sound', 'Shake, flash, boom, bell…', () => enter('moment')),
      opt('🌄', 'Change the scene', 'Place, weather, music, title', () => enter('scene')),
      opt('✏️', 'Draw on the stage', 'Freehand, in colour', () => enter('draw')),
      opt('🛠️', 'Scene workshop', 'Build levels, prepare scenes', () => c.workshop()),
      sheet && opt('🎒', `${S.names.player}’s sheet`, 'Items, stats, dice', () => enter('sheet')),
      opt('❓', 'Offer choices', `Options for ${S.names.player}`, () => enter('choices')),
      opt('🤖', 'Tell Claude', 'Describe it, Claude stages it', () => enter('claude')),
      opt('⚙️', 'Story settings', 'Type, rules, time, invite', () => enter('rules'))));
    p.append(h('p', { class: 'dim small' }, 'Tip: click anything on the stage to change it, drag it to move it.'));
    if (G.log.length) p.append(h('div', { class: 'card gevents' }, h('small', { class: 'dim' }, `In step ${stepNo} so far`), G.log.map((l) => h('div', {}, '• ' + l))));
    return;
  }

  /* ================= a selected character or thing: all its tools in one place ================= */
  if (top === 'thing') {
    if (!sel) { home(); return buildGuided(p, c); }
    const isHero = sel.id === d.heroId;
    head(lab(sel), 'Drag it on the stage to move it.');
    const b = (icon, label, fn, on) => h('button', { class: on ? 'on' : '', onclick: fn }, icon + ' ' + label);
    p.append(sayInput('What does it say? (optional)'), lookRow(),
      h('div', { class: 'row' }, pickSel(FX, 'fx', 'Effect'), pickSel([['', 'No emote'], ...EMOTES.map((e) => [e, e])], 'emote', 'Emote')),
      h('div', { class: 'thingbtns' },
        b('🚶', 'Move / animate', () => enter('move')),
        b('🔄', 'Turn into…', () => { G.q = ''; enter('swap'); }),
        b('⧉', 'Copy', () => { const k = { ...clone(sel), id: Math.random().toString(36).slice(2, 10), x: clamp(sel.x + 0.09, 0, 1), say: '' }; d.entities.push(k); G.sel = k.id; c.select(k.id); c.rebuild(); }),
        b('🧑', 'Player’s character', () => { d.heroId = isHero ? null : sel.id; c.rebuild(); }, isHero),
        b('🧱', 'Solid', () => { sel.solid = !sel.solid; c.rebuild(); }, sel.solid),
        c.mods().inventory && !isHero && b('🎒', `Give to ${S.names.player}`, () => { const l = lab(sel); c.giveToPlayer(sel); done(`${S.names.player} gets ${l}`); }),
        b('🗑️', 'Remove', () => { const l = lab(sel); c.removeEntity(sel); done(`${l} disappears`); })),
      sel.solid && h('p', { class: 'dim small' }, 'Solid: the Player’s hero cannot walk through it.'),
      doneBtn(''));
    return;
  }
  if (top === 'swap') {
    head(`Turn ${lab(sel)} into…`, 'It keeps its place and size.');
    p.append(...searchGrid((i) => { const was = lab(sel); sel.asset = i.asset; G.path.pop(); if (!setup) G.log.push(`${was} turns into ${lab(sel)}`); c.rebuild(); }, 'Search: frog, statue, skeleton…'));
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
    head(`How does ${lab(sel)} move?`, 'Different things move at the same time; one thing’s moves follow each other.');
    const far = sel.x < 0.5 ? 0.92 : 0.08, edge = sel.x < 0.5 ? 0 : 1, moving = c.trackEnd(sel.id);
    p.append(h('div', { class: 'gopts' },
      opt('✋', 'Put it somewhere', 'Drag it; it glides there', () => enter('move:drag')),
      opt('🔴', 'Record a path', 'Drag it, your timing is kept', () => enter('move:rec')),
      me && sel !== me && opt('🧑', 'Walk to the hero', '', () => walk('walks up to the hero', clamp(me.x + (sel.x < me.x ? -0.13 : 0.13), 0.05, 0.95), me.y)),
      opt('↔️', 'Cross the stage', '', () => walk('crosses the stage', far, sel.y)),
      opt('🚪', 'Walk off to the side', '', () => walk('walks off', edge, sel.y)),
      opt('⤴️', 'Jump', '', () => { if (c.autoTrack(sel, [[220, sel.x, sel.y - 0.14], [220, sel.x, sel.y], [200, sel.x, sel.y - 0.09], [200, sel.x, sel.y]])) done(`${lab(sel)} jumps`); }),
      opt('〰️', 'Tremble', '', () => { const s = []; for (let i = 0; i < 10; i++) s.push([80, sel.x + (i % 2 ? 0.012 : -0.012), sel.y]); s.push([80, sel.x, sel.y]); if (c.autoTrack(sel, s)) done(`${lab(sel)} trembles`); }),
      moving > 0 && opt('✖', 'Forget its moves', `${(moving / 1000).toFixed(1)} s recorded in this step`, () => { c.dropTrack(sel.id); c.rebuild(); })));
    return;
  }
  if (top === 'move:drag') { head(`Drag ${lab(sel)} to its new place`, 'It glides there when the step plays.'); p.append(doneBtn(() => `${lab(sel)} moves`)); return; }
  if (top === 'move:rec') {
    const used = c.trackEnd(sel.id);
    head(`Recording ${lab(sel)}`, 'Drag it across the stage now. Release to stop; drag again to continue.');
    p.append(h('div', { class: 'meter' }, h('i', { style: `width:${used / 100}%` })), h('small', { class: 'dim' }, `${(used / 1000).toFixed(1)} of 10 seconds`),
      h('div', { class: 'row' }, h('button', { class: 'grow', onclick: () => { c.dropTrack(sel.id); c.rebuild(); } }, '✖ Start over'), doneBtn(() => `${lab(sel)} moves along a path`)));
    return;
  }

  /* ================= ➕ add ================= */
  if (top === 'add') {
    head('Add what?');
    p.append(h('div', { class: 'gopts' },
      opt('🧑', 'A character', 'Heroes, townsfolk, monsters, animals', () => { G.cat = ''; enter('add:char'); }),
      opt('📦', 'A thing', 'Items, furniture, nature, buildings…', () => { G.cat = ''; enter('add:thing'); }),
      opt('🧱', 'A level piece', 'Blocks and props to place freely', () => { G.cat = ''; enter('add:tile'); }),
      opt('✨', 'An effect or sign', 'Explosions, hearts, arrows…', () => { G.cat = ''; enter('add:fx'); }),
      opt('🔍', 'Search by name', 'Look through everything', () => { G.q = ''; enter('add:search'); }),
      opt('🖼️', 'Something of my own', 'A photo, a new creation, any emoji', () => enter('add:own'))));
    return;
  }
  if (top === 'add:char' || top === 'add:thing' || top === 'add:tile' || top === 'add:fx') {
    const cats = groupCats(top.slice(4)), cat = cats.find((x) => x.id === G.cat) || cats[0];
    head('Pick one', 'It appears on the stage.');
    if (cats.length > 1) p.append(h('div', { class: 'chips wrap' }, cats.map((x) => h('button', { class: x === cat ? 'on' : '', onclick: () => { G.cat = x.id; c.rebuild(); } }, x.label))));
    p.append(itemGrid(cat.items, (i) => place(i.asset)));
    return;
  }
  if (top === 'add:search') { head('Search'); p.append(...searchGrid((i) => place(i.asset), 'dragon, door, key, angry…')); return; }
  if (top === 'add:own') {
    head('Something of your own');
    const mine = S.assets.filter((a) => a.kind === 'sprite');
    const any = h('input', { placeholder: 'Any emoji or a short word', maxlength: 24 });
    if (mine.length) p.append(h('div', { class: 'grid' }, mine.map((a) => h('button', { title: a.name, onclick: () => place('c:' + a.id) }, glyphNode(code, 'c:' + a.id)))));
    p.append(c.maker('sprite', (id) => place('c:' + id)), h('div', { class: 'row' }, any, h('button', { onclick: () => { const v = any.value.trim(); if (v) place('e:' + v); } }, 'Add')));
    return;
  }

  /* ================= 💥 moment and sound ================= */
  if (top === 'moment') {
    head('Moment and sound', 'Happens once, as this step plays.');
    p.append(h('small', { class: 'dim' }, 'On screen'), chips(BURSTS, 'burst'), h('small', { class: 'dim' }, 'Sound'), chips(SFX, 'sfx', (v) => { c.audio.unlock(); c.audio.sfx(v); }),
      doneBtn(() => [d.burst && (BURSTS.find((x) => x[0] === d.burst) || [])[1], d.sfx && (SFX.find((x) => x[0] === d.sfx) || [])[1]].filter(Boolean).join(' + ')));
    return;
  }

  /* ================= 🌄 scene ================= */
  if (top === 'scene') {
    head('Change what about the scene?');
    p.append(h('div', { class: 'gopts' },
      opt('📚', 'A prepared scene', `${(S.scenes || []).length} ready in the workshop`, () => enter('scene:prepared')),
      opt('🌄', 'The place', 'A new backdrop', () => enter('scene:place')),
      opt('🌦️', 'The weather', 'Rain, fog, darkness…', () => enter('scene:weather')),
      opt('🎵', 'The music', '', () => enter('scene:music')),
      opt('🎬', 'A title card', '“Chapter 2”, “Later that night”', () => enter('scene:card')),
      opt('🎲', 'A surprise scene', 'A ready-made place and cast', async () => { if (await c.randomScene()) done('A whole new scene'); }),
      opt('💡', 'Give me an idea', 'A random story twist', () => c.idea())));
    return;
  }
  if (top === 'scene:prepared') {
    head('Bring in a prepared scene', 'It replaces the place, the level and everything on stage except the hero.');
    const list = S.scenes || [];
    p.append(list.length ? h('div', { class: 'col' }, list.map((sc) => h('button', { class: 'prep', onclick: () => { c.useScene(sc); done(`The scene changes to “${sc.name}”`); } }, h('b', {}, sc.name), h('small', { class: 'dim' }, `${sc.scene.entities.length - 1} things${sc.scene.level ? ' · has a level' : ''}`))))
      : h('p', { class: 'dim' }, 'No prepared scenes yet.'), h('button', { onclick: () => c.workshop() }, '🛠️ Open the scene workshop'));
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
  if (top === 'scene:card') {
    head('Title card', 'Shown full-screen before this step plays.');
    p.append(h('input', { placeholder: '“Chapter 2 — The Cave”', maxlength: 60, value: d.card, oninput: (ev) => { d.card = ev.target.value; c.changedQuiet(); } }), doneBtn(() => (d.card ? `Title card “${short(d.card)}”` : '')));
    return;
  }

  /* ================= ❓ choices ================= */
  if (top === 'choices') {
    head(`Choices for ${S.names.player}`, S.rules.player === 'limited' ? 'They must pick one of these next turn.' : 'They can tap one, or still type anything.');
    const inp = (i) => h('input', { placeholder: `Choice ${i + 1}`, maxlength: 40, value: d.choices[i] || '', oninput: (ev) => { for (let k = 0; k < 3; k++) d.choices[k] ||= ''; d.choices[i] = ev.target.value; c.changedQuiet(); } });
    p.append(inp(0), inp(1), inp(2), doneBtn(() => (d.choices.filter(Boolean).length ? 'Choices offered' : '')));
    return;
  }

  /* ================= 📝 narrate ================= */
  if (top === 'narrate') {
    head('Narrate', 'Appears under the stage in this step. For another line later, start the next step and narrate again.');
    p.append(h('input', { placeholder: '“Suddenly, the lights go out.”', maxlength: 240, value: d.narration, enterkeyhint: 'done', oninput: (ev) => { d.narration = ev.target.value; c.changedQuiet(); } }),
      doneBtn(() => (d.narration ? `Narration “${short(d.narration)}”` : 'The narration clears')));
    return;
  }

  /* ================= ✏️ draw ================= */
  if (top === 'draw') {
    head('Draw on the stage', 'Drag on the stage to draw. New lines draw themselves when the step plays.');
    p.append(h('div', { class: 'row pens' }, PENS.map((col) => h('button', { class: 'pen' + (c.pen.c === col ? ' on' : ''), style: `background:${col}`, 'aria-label': 'Colour', onclick: () => { c.pen.c = col; c.rebuild(); } }))),
      h('div', { class: 'row' }, [['Thin', 2], ['Medium', 4], ['Thick', 9]].map(([l, w]) => h('button', { class: 'grow' + (c.pen.w === w ? ' on' : ''), onclick: () => { c.pen.w = w; c.rebuild(); } }, l)),
        h('button', { class: 'grow', disabled: !d.drawing.length, onclick: () => { d.drawing.pop(); c.rebuild(); } }, '↶ Undo'),
        h('button', { class: 'grow', disabled: !d.drawing.length, onclick: () => { d.drawing = []; c.rebuild(); } }, 'Clear')),
      doneBtn(() => (d.drawing.length ? 'A drawing' : '')));
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
        h('button', { onclick: () => { G.sel = null; enter('give'); } }, '🎒 Give them something from the stage'));
    }
    if (m.dice) p.append(h('small', { class: 'dim' }, 'Roll a die with this turn'), chips([[0, 'No roll'], [6, '🎲 d6'], [20, '🎲 d20']], 'rollWant'));
    p.append(doneBtn(''));
    return;
  }
  if (top === 'give') {
    if (!sel || sel.id === d.heroId) { if (sel) { G.sel = null; c.toast('That is the Player’s own character'); } return picker(`Give ${S.names.player} which thing?`); }
    const l = lab(sel); c.giveToPlayer(sel); return done(`${S.names.player} gets ${l}`);
  }

  /* ================= ⚙️ settings ================= */
  if (top === 'rules') {
    head('Story settings', 'These apply from now on.');
    const time = h('select', { onchange: (ev) => c.act('settings', { turnSeconds: Number(ev.target.value) }, 3).catch((e) => c.toast(e.message)) },
      [[0, 'No time limit'], [30, '30 seconds'], [60, '1 minute'], [90, '1½ minutes'], [120, '2 minutes'], [180, '3 minutes'], [300, '5 minutes'], [600, '10 minutes']].map(([v, l]) => h('option', { value: v, selected: S.settings.turnSeconds === v }, l)));
    p.append(c.typeCard(),
      h('div', { class: 'card' }, h('h3', {}, '⏱ Time per turn'), time, h('p', { class: 'dim small' }, 'Applies from the next turn. The clock pauses if either of you drops off.')),
      h('div', { class: 'card' }, h('h3', {}, `Story code: ${code}`), h('div', { class: 'row' }, h('button', { class: 'grow', onclick: c.shareLink }, S.bot || S.hotseat ? '🔗 Let someone watch' : '🔗 Copy invite link'), h('button', { class: 'grow', onclick: c.openStory }, '📖 Story so far'))),
      h('div', { class: 'row' }, h('button', { class: 'danger grow', onclick: () => { if (confirm('End the story?')) c.act('end', {}, 3).catch((e) => c.toast(e.message)); } }, '🎬 End the story'), h('button', { class: 'grow', onclick: c.leave }, 'Leave to the start screen')),
      doneBtn(''));
    return;
  }

  /* ================= 🤖 Claude ================= */
  if (top === 'claude') {
    head('Tell Claude what happens', 'Describe this step in your own words. Claude sets it up on the stage; you can still change it.');
    if (!S.claude) { p.append(h('div', { class: 'card' }, h('b', {}, 'Claude is not connected yet'), h('p', { class: 'dim small' }, 'Whoever hosts this game needs to add an Anthropic API key (ANTHROPIC_API_KEY) to the server. Everything else works without it.'))); return; }
    const ta = h('textarea', { rows: 4, maxlength: 600, placeholder: 'e.g. “A dragon crashes through the wall, the wizard screams and runs off to the left, and it starts to rain.”' }, G.ask);
    ta.addEventListener('input', () => { G.ask = ta.value; });
    p.append(ta, h('button', { class: 'primary gdone', disabled: G.busy, onclick: async () => {
      const text = ta.value.trim(); if (!text) return ta.focus();
      G.busy = true; c.rebuild();
      try {
        const r = await c.act('claude', { text, scene: { ...c.draft, steps: [] } }, 1);
        const keep = c.draft;
        for (const k of Object.keys(r.scene)) if (!['steps', 'action', 'target', 'use', 'roll'].includes(k)) keep[k] = r.scene[k];
        G.note = r.note || 'Done.'; G.busy = false; c.toast('🤖 ' + G.note); return done(`🤖 ${short(text, 40)}`);
      } catch (e) { c.toast(e.message); }
      G.busy = false; c.rebuild();
    } }, G.busy ? '🤖 Claude is setting the stage…' : '🤖 Make it happen'), h('p', { class: 'dim small' }, 'Not happy with the result? “Reset step” at the top undoes it.'));
    return;
  }
  home(); buildGuided(p, c);
}
