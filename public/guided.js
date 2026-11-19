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
import { MOODS, SFX, SFX_GROUPS } from './audio.js';
import { h, clone, clamp, glyphNode, actionText } from './stage.js';
import { FX, EMOTES, WEATHER, BURSTS } from './consts.js';

export const G = { path: [], sel: null, log: [], busy: false, cat: '', q: '', note: '', ask: '' };
export function resetGuided() { Object.assign(G, { path: [], sel: null, log: [], busy: false, cat: '', q: '', note: '', exit: null, pick: null, foe: null, askKind: '' }); }
export const guidedKey = () => [G.path.join('>'), G.sel, G.log.length, G.busy, G.cat, G.exit, G.pick, G.foe, G.style, (G.did || []).length].join('~');
/** At the start of the Director's turn: in a battle, the battle tools are what they need. */
export function guidedStart(d) { G.did = []; if (d && d.battle) G.path = ['battle']; }

/** Which stage tool the open screen needs: dragging records a path, or draws. */
export const guidedTool = () => { const top = G.path[G.path.length - 1]; return top === 'move:rec' ? 'rec' : top === 'draw' ? 'draw' : ''; };

const PICKERS = ['speak', 'move', 'give', 'tie'];   // questions that start with "which one?"
/** A tap on something on the stage: answers an open "which one?", otherwise opens that thing's own tools. */
export function guidedPick(id) {
  const top = G.path[G.path.length - 1] || '';
  if (top === 'tie') { G.pick = id; return; }
  if (PICKERS.includes(top) && !G.sel) { G.sel = id; return; }
  if (!top || top === 'thing' || top === 'exit') { G.path = ['thing']; G.sel = id; }
}
/** A click on an exit marker opens that exit's tools. */
export function guidedMark(exitId) {
  const top = G.path[G.path.length - 1] || '';
  if (!top || top === 'thing' || top === 'exit') { G.path = ['exit']; G.sel = null; G.exit = exitId; }
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
  const ws = c.mode === 'workshop';                       // the same tools, used on a prepared scene in the workshop
  const setup = ws || S.turn === 0, stepNo = ws ? 1 : d.steps.length + 1;
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
        h('button', { class: 'grow', id: 'undoBtn', title: 'Undo the last change (Ctrl+Z)', disabled: !c.canUndo(), onclick: () => c.undo() }, '↶ Undo'),
        h('button', { class: 'grow', id: 'resetStep', title: 'Undo everything in this step', onclick: () => c.resetStep() }, '⟲ Reset step'),
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
  /** Enter: start outside the screen and walk to where the thing stands now. */
  const comeIn = (fromX) => { const ms = clamp(Math.abs(sel.x - fromX) * 3200, 500, 3000); c.dropTrack(sel.id); d.tracks.push({ id: sel.id, pts: [0, fromX, sel.y, Math.round(ms), sel.x, sel.y] }); return true; };
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
      const ex = d.exit && d.exits.find((x) => x.id === d.exit);
      if (ex) p.append(h('div', { class: 'card ask' }, h('b', {}, `${S.names.player} heads for “${ex.label}” — do they go through?`),
        h('div', { class: 'row' }, h('button', { class: 'primary grow', id: 'travelYes', onclick: () => { const doc = c.travelTo(ex.to); if (doc) done(`Traveling to “${doc.name}”`); } }, '🚶 Yes, travel there'),
          h('button', { class: 'grow', onclick: () => { d.exit = null; c.rebuild(); } }, 'Not now'))));
      if (d.battle) p.append(h('div', { class: 'card ask' }, h('b', {}, `⚔️ Battle — round ${d.battle.round}`), h('button', { class: 'primary', id: 'battleOpen', onclick: () => enter('battle') }, 'Open the battle tools')));
      const used = d.use && d.sheet.inv.find((i) => i.id === d.use);
      if (used) p.append(h('div', { class: 'card ask' }, h('b', {}, `${S.names.player} uses `, glyphNode(code, used.asset, 'mini'), ' — is it used up?'),
        h('div', { class: 'row' }, h('button', { class: 'primary grow', onclick: () => { d.sheet.inv = d.sheet.inv.filter((i) => i !== used); d.use = null; done(`${assetLabel(used.asset, used.name)} is used up`); } }, 'Yes, it is gone'),
          h('button', { class: 'grow', onclick: () => { d.use = null; c.rebuild(); } }, 'No, they keep it'))));
      if (S.rules.player === 'limited' && !d.choices.filter(Boolean).length && !d.ask) p.append(h('div', { class: 'card ask' }, h('b', {}, `Limited will: ${S.names.player} needs options`),
        h('p', { class: 'dim small' }, 'Write up to three things they may do next turn. Without options they can act freely.'), h('button', { class: 'primary', onclick: () => enter('ask') }, '❓ Decide what they may do')));
    }
    p.append(h('div', { class: 'gtitle' }, h('b', {}, ws ? 'Things and scene' : setup ? 'Set the stage' : `Step ${stepNo} — what happens?`),
      h('small', { class: 'dim' }, ws ? 'The same tools as during a turn.' : setup ? 'Build the opening scene, then begin.' : 'All of it plays at the same time.')));
    if (!ws && setup) p.append(h('div', { class: 'row' }, h('button', { class: 'grow', id: 'undoBtn', disabled: !c.canUndo(), onclick: () => c.undo() }, '↶ Undo'), h('button', { class: 'grow', onclick: () => c.saveAsScene() }, '💾 Save as a prepared scene')));
    const sheet = c.mods().inventory || c.mods().stats || c.mods().dice;
    p.append(h('div', { class: 'gopts' },
      opt('➕', 'Add something', 'A character, a thing, an effect', () => enter('add')),
      !ws && opt('💬', 'Someone speaks', 'Give a character a line', () => enter('speak')),
      !ws && opt('🚶', 'Move or animate', 'Walk, jump, record a path', () => enter('move')),
      !ws && opt('📝', 'Narrate', 'Tell what happens in words', () => { d.narration = ''; enter('narrate'); }),
      !ws && opt('💥', 'Moment and sound', 'Shake, flash, boom, bell…', () => enter('moment')),
      opt('🌄', 'Change the scene', 'Place, weather, music, title', () => enter('scene')),
      !ws && opt('✏️', 'Draw on the stage', 'Freehand, in colour', () => enter('draw')),
      !ws && opt('🛠️', 'Scene workshop', 'Build levels, prepare scenes', () => c.workshop()),
      !ws && sheet && opt('🎒', `${S.names.player}’s sheet`, 'Items, stats, dice', () => enter('sheet')),
      !ws && opt('❓', `Ask ${S.names.player}`, 'Choices, a roll, a place, a target…', () => enter('ask')),
      !ws && opt('🎥', 'Camera', 'Zoom in on something', () => enter('camera')),
      !ws && c.mods().points && opt('⭐', 'Award points', `${d.sheet.points || 0} so far`, () => enter('award')),
      !ws && S.rules.type === 'adventure' && opt('⚔️', 'Battle', d.battle ? `Round ${d.battle.round}` : 'Enemies, attacks, damage', () => enter('battle')),
      !ws && opt('🤖', 'Tell Claude', 'Describe it, Claude stages it', () => enter('claude')),
      !ws && opt('⚙️', 'Story settings', 'Type, rules, time, invite', () => enter('rules'))));
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
    const lay = (v, label) => h('button', { 'data-lay': v, class: 'grow' + ((sel.layer || 0) === v ? ' on' : ''), onclick: () => { sel.layer = v; c.rebuild(); } }, label);
    p.append(!ws && sayInput('What does it say? (optional)'), lookRow(),
      !sel.tie && h('div', { class: 'row' }, h('span', { class: 'dim small' }, 'Layer'), lay(-1, '⬇ Behind all'), lay(0, 'By position'), lay(1, '⬆ In front')),
      h('div', { class: 'row' }, pickSel(FX, 'fx', 'Effect'), pickSel([['', 'No emote'], ...EMOTES.map((e) => [e, e])], 'emote', 'Emote')),
      h('div', { class: 'thingbtns' },
        !ws && b('🚶', 'Move / animate', () => enter('move')),
        b('🔄', 'Turn into…', () => { G.q = ''; enter('swap'); }),
        b('⧉', 'Copy', () => { const k = { ...clone(sel), id: Math.random().toString(36).slice(2, 10), x: clamp(sel.x + 0.09, 0, 1), say: '' }; d.entities.push(k); G.sel = k.id; c.select(k.id); c.rebuild(); }),
        !ws && b('🧑', 'Player’s character', () => { d.heroId = isHero ? null : sel.id; c.rebuild(); }, isHero),
        b('🧱', 'Solid', () => { sel.solid = !sel.solid; c.rebuild(); }, sel.solid),
        S.rules.type === 'adventure' && !isHero && b('⭐', 'Active object', () => enter('active'), !!sel.active),
        b('🔗', sel.tie ? 'Tied — change' : 'Tie to…', () => { G.pick = null; enter('tie'); }, !!sel.tie),
        !ws && c.mods().inventory && !isHero && b('🎒', `Give to ${S.names.player}`, () => { const l = lab(sel); c.giveToPlayer(sel); done(`${S.names.player} gets ${l}`); }),
        !(ws && isHero) && b('🗑️', 'Remove', () => { const l = lab(sel); c.removeEntity(sel); done(`${l} disappears`); })),
      ws && isHero && h('p', { class: 'dim small' }, 'This marks where the Player’s hero starts in this scene.'),
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
      opt('➡️', 'Enter from the left', 'Comes in from outside the screen', () => { if (comeIn(-0.18)) done(`${lab(sel)} enters from the left`); }),
      opt('⬅️', 'Enter from the right', 'Comes in from outside the screen', () => { if (comeIn(1.18)) done(`${lab(sel)} enters from the right`); }),
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
    p.append(h('small', { class: 'dim' }, 'On screen'), chips(BURSTS, 'burst'), h('small', { class: 'dim' }, 'Sound — click one to hear it'), chips([SFX[0]], 'sfx'),
      ...SFX_GROUPS.flatMap(([name, list]) => [h('small', { class: 'dim grp' }, name), chips(list, 'sfx', (v) => { c.audio.unlock(); c.audio.sfx(v); })]),
      doneBtn(() => [d.burst && (BURSTS.find((x) => x[0] === d.burst) || [])[1], d.sfx && (SFX.find((x) => x[0] === d.sfx) || [])[1]].filter(Boolean).join(' + ')));
    return;
  }

  /* ================= 🌄 scene ================= */
  if (top === 'scene') {
    head('Change what about the scene?');
    p.append(h('div', { class: 'gopts' },
      !ws && opt('📚', 'A prepared scene', `${(S.scenes || []).length} ready in the workshop`, () => enter('scene:prepared')),
      opt('🌄', 'The place', 'A new backdrop', () => enter('scene:place')),
      S.rules.type === 'adventure' && opt('🚪', 'Add an exit', 'A way out to another prepared scene', () => { const x = { id: c.rid(), to: '', label: 'Exit', x: 0.9, y: 0.6, locked: false }; d.exits.push(x); G.exit = x.id; enter('exit'); }),
      opt('🌦️', 'The weather', 'Rain, fog, darkness…', () => enter('scene:weather')),
      opt('🎵', 'The music', '', () => enter('scene:music')),
      !ws && opt('🎬', 'A title card', '“Chapter 2”, “Later that night”', () => enter('scene:card')),
      !ws && opt('💾', 'Save as a prepared scene', 'Keep this scene for later', () => c.saveAsScene()),
      !ws && S.rules.type === 'adventure' && opt('🗺️', 'The map', 'How your scenes connect', () => c.workshop({ map: true })),
      !ws && opt('🎲', 'A surprise scene', 'A ready-made place and cast', async () => { if (await c.randomScene()) done('A whole new scene'); }),
      !ws && opt('💡', 'Give me an idea', 'A random story twist', () => c.idea())));
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
    head('The music', 'Click a tune to hear it. It keeps playing until you change it.');
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
  /* ================= ❓ ask the Player: exactly what they may do next turn ================= */
  if (top === 'ask') {
    const kind = d.ask ? d.ask.kind : d.choices.filter(Boolean).length ? 'choice' : '';
    const mk = (k) => ({ kind: k, text: d.ask ? d.ask.text : '', sides: 6, dc: 0, verb: k === 'target' ? 'Attack' : '', places: [], targets: [] });
    const set = (k) => { if (k === 'choice' || !k) { d.ask = null; if (!k) d.choices = []; else for (let n = 0; n < 3; n++) d.choices[n] ||= ''; } else { d.ask = mk(k); d.choices = []; } G.askKind = k; c.rebuild(); };
    const cur = d.ask ? kind : G.askKind === 'choice' ? 'choice' : kind;
    head(`What may ${S.names.player} do next turn?`, S.rules.player === 'limited' ? 'Limited will: they must do this.' : 'Free will: this is offered, they may still do something else.');
    p.append(h('div', { class: 'gopts' },
      opt('🔘', 'Pick one of these', 'Up to three choices', () => set('choice'), cur === 'choice'),
      opt('🎲', 'Roll a die', 'd6 or d20, with a number to reach', () => set('roll'), cur === 'roll'),
      opt('📍', 'Go to a place', 'Mark places on the stage', () => set('place'), cur === 'place'),
      opt('🎯', 'Pick a target', 'Who to attack, talk to, save…', () => set('target'), cur === 'target'),
      c.mods().inventory && opt('🗑️', 'Give up an item', 'Discard one thing they carry', () => set('discard'), cur === 'discard'),
      opt('✖', 'Nothing special', 'Clear the request', () => set(''), !cur)));
    const a = d.ask;
    if (cur && cur !== 'choice') p.append(h('input', { id: 'askText', placeholder: 'Your question or instruction (optional)', maxlength: 120, value: a.text, oninput: (ev) => { a.text = ev.target.value; c.changedQuiet(); } }));
    if (cur === 'choice') {
      const inp = (i) => h('input', { placeholder: `Choice ${i + 1}`, maxlength: 40, value: d.choices[i] || '', oninput: (ev) => { for (let k = 0; k < 3; k++) d.choices[k] ||= ''; d.choices[i] = ev.target.value; c.changedQuiet(); } });
      p.append(inp(0), inp(1), inp(2));
    } else if (cur === 'roll') {
      p.append(h('div', { class: 'row' }, [6, 20].map((n) => h('button', { class: 'grow' + (a.sides === n ? ' on' : ''), onclick: () => { a.sides = n; a.dc = Math.min(a.dc, n); c.rebuild(); } }, `🎲 d${n}`))),
        h('small', { class: 'dim' }, 'They succeed on…'), h('div', { class: 'chips wrap' }, [0, ...(a.sides === 6 ? [2, 3, 4, 5, 6] : [5, 8, 10, 12, 15, 18])].map((n) => h('button', { 'data-dc': n, class: a.dc === n ? 'on' : '', onclick: () => { a.dc = n; c.rebuild(); } }, n ? `${n} or more` : 'any roll'))));
    } else if (cur === 'place') {
      p.append(a.places.map((pl, i) => h('div', { class: 'row' }, h('span', {}, '📍'), h('input', { maxlength: 30, value: pl.label, oninput: (ev) => { pl.label = ev.target.value; c.changedQuiet(); } }), h('button', { onclick: () => { a.places.splice(i, 1); c.rebuild(); } }, '✕'))),
        h('button', { id: 'addPlace', disabled: a.places.length >= 6, onclick: () => { a.places.push({ label: `Place ${a.places.length + 1}`, x: 0.2 + 0.2 * a.places.length, y: 0.7 }); c.rebuild(); } }, '＋ Add a place'),
        h('p', { class: 'dim small' }, 'Drag the 📍 markers on the stage to where they belong.'));
    } else if (cur === 'target') {
      p.append(h('input', { placeholder: 'What for? e.g. Attack, Talk to, Rescue', maxlength: 20, value: a.verb, oninput: (ev) => { a.verb = ev.target.value; c.changedQuiet(); } }),
        h('small', { class: 'dim' }, 'Who or what can be picked?'),
        h('div', { class: 'grid' }, d.entities.filter((e) => e.id !== d.heroId).map((e) => h('button', { class: a.targets.includes(e.id) ? 'on' : '', onclick: () => { a.targets = a.targets.includes(e.id) ? a.targets.filter((x) => x !== e.id) : [...a.targets, e.id]; c.rebuild(); } }, glyphNode(code, e.asset)))));
    } else if (cur === 'discard') p.append(h('p', { class: 'dim small' }, `${S.names.player} will choose one of their ${d.sheet.inv.length} item(s) to give up.`));
    p.append(doneBtn(() => (cur ? `${S.names.player} is asked: ${{ choice: 'pick a choice', roll: 'roll a die', place: 'go to a place', target: 'pick a target', discard: 'give up an item' }[cur]}` : '')));
    return;
  }

  /* ================= 🎥 camera ================= */
  if (top === 'camera') {
    head('Camera', 'The yellow frame shows what the Player will see. The camera moves there when this step plays.');
    const z = d.cam ? d.cam.z : 1;
    const look = (x, y) => { d.cam = { x, y, z: d.cam ? d.cam.z : 2 }; c.rebuild(); };
    p.append(h('small', { class: 'dim' }, 'Zoom'), h('div', { class: 'row' }, [1, 1.5, 2, 3].map((n) => h('button', { 'data-zoom': n, class: 'grow' + (z === n ? ' on' : ''), onclick: () => { d.cam = n === 1 ? null : { x: d.cam ? d.cam.x : 0.5, y: d.cam ? d.cam.y : 0.6, z: n }; c.rebuild(); } }, n === 1 ? 'Whole stage' : `${n}×`))),
      h('small', { class: 'dim' }, 'Look at'),
      h('div', { class: 'grid' }, d.entities.map((e) => h('button', { onclick: () => look(e.x, clamp(e.y - 0.08 * e.scale, 0, 1)) }, glyphNode(code, e.asset)))),
      h('div', { class: 'row' }, [['↖', 0.25, 0.3], ['↗', 0.75, 0.3], ['Centre', 0.5, 0.5], ['↙', 0.25, 0.75], ['↘', 0.75, 0.75]].map(([l, x, y]) => h('button', { class: 'grow', onclick: () => look(x, y) }, l))),
      doneBtn(() => (d.cam ? `Camera zooms in ${d.cam.z}×` : 'Camera shows the whole stage')));
    return;
  }

  /* ================= ⭐ points ================= */
  if (top === 'award') {
    head('Award points', `${S.names.player} has ${d.sheet.points || 0} points.`);
    const give = (n) => { const was = d.award ? d.award.n : 0; d.sheet.points = (d.sheet.points || 0) - was + n; d.award = n ? { n, text: d.award ? d.award.text : '' } : null; c.rebuild(); };
    p.append(h('div', { class: 'chips wrap' }, [0, 1, 5, 10, 25, 50, -5].map((n) => h('button', { 'data-pts': n, class: (d.award ? d.award.n : 0) === n ? 'on' : '', onclick: () => give(n) }, n ? `${n > 0 ? '+' : ''}${n}` : 'None'))),
      d.award && h('input', { placeholder: 'What for? (shown to the Player)', maxlength: 60, value: d.award.text, oninput: (ev) => { d.award.text = ev.target.value; c.changedQuiet(); } }),
      doneBtn(() => (d.award ? `${d.award.n > 0 ? '+' : ''}${d.award.n} points` : '')));
    return;
  }

  /* ================= ⭐ active object ================= */
  if (top === 'active') {
    if (!sel) return back();
    head(`${lab(sel)} as an active object`, `${S.names.player} sees its name when pointing at it, and can click it to choose one of the actions you allow.`);
    const on = !!sel.active, VERBS = ['Look at', 'Use', 'Open', 'Talk to', 'Take', 'Push', 'Read', 'Attack'];
    p.append(h('button', { id: 'activeToggle', class: on ? 'on' : '', onclick: () => { sel.active = on ? null : { name: '', verbs: ['Look at', 'Use', 'Open'] }; c.rebuild(); } }, on ? '⭐ Active — click to switch off' : 'Make it an active object'));
    if (on) {
      const custom = h('input', { placeholder: 'Your own action…', maxlength: 16 });
      p.append(h('input', { id: 'activeName', placeholder: 'Its name, e.g. “Old oak chest”', maxlength: 40, value: sel.active.name, oninput: (ev) => { sel.active.name = ev.target.value; c.changedQuiet(); } }),
        h('small', { class: 'dim' }, 'Actions offered'),
        h('div', { class: 'chips wrap' }, [...new Set([...VERBS, ...sel.active.verbs])].map((v) => h('button', { class: sel.active.verbs.includes(v) ? 'on' : '', onclick: () => { sel.active.verbs = sel.active.verbs.includes(v) ? sel.active.verbs.filter((x) => x !== v) : [...sel.active.verbs, v].slice(0, 6); c.rebuild(); } }, v))),
        h('div', { class: 'row' }, custom, h('button', { onclick: () => { const v = custom.value.trim(); if (v && sel.active.verbs.length < 6) { sel.active.verbs.push(v); c.rebuild(); } } }, 'Add')));
    }
    p.append(h('button', { class: 'primary gdone', onclick: () => { if (sel.active && !sel.active.name.trim()) sel.active.name = lab(sel).replace(/^the /, ''); if (!setup && sel.active) G.log.push(`${sel.active.name} can be used`); back(); } }, '✓ Done'));
    return;
  }

  /* ================= 🔗 tie: one thing holds or carries another ================= */
  if (top === 'tie') {
    if (!sel) return back();
    const par = sel.tie && d.entities.find((e) => e.id === sel.tie.to);
    if (G.pick && G.pick !== sel.id) { const to = d.entities.find((e) => e.id === G.pick); if (to && !to.tie) sel.tie = { to: to.id, dx: 0.05, dy: -0.02, front: true }; G.pick = null; return buildGuided((p.replaceChildren(), p), c); }
    head(par ? `${lab(sel)} is tied to ${lab(par)}` : `Tie ${lab(sel)} to…`, par ? 'It follows wherever that goes. Drag it on the stage to adjust how it is held.' : 'Pick who or what carries it: here, or by clicking on the stage.');
    if (!par) p.append(h('div', { class: 'grid' }, d.entities.filter((e) => e.id !== sel.id && !e.tie).map((e) => h('button', { onclick: () => { G.pick = e.id; c.rebuild(); } }, glyphNode(code, e.asset)))));
    else p.append(h('div', { class: 'row' },
      h('button', { 'data-layer': 'front', class: 'grow' + (sel.tie.front ? ' on' : ''), onclick: () => { sel.tie.front = true; c.rebuild(); } }, '⬆ In front'),
      h('button', { 'data-layer': 'back', class: 'grow' + (!sel.tie.front ? ' on' : ''), onclick: () => { sel.tie.front = false; c.rebuild(); } }, '⬇ Behind'),
      h('button', { class: 'grow', onclick: () => { const at = { x: clamp(par.x + sel.tie.dx * par.scale, 0, 1), y: clamp(par.y + sel.tie.dy * par.scale, 0.08, 1) }; sel.tie = null; Object.assign(sel, at); c.rebuild(); } }, '✂ Untie')));
    p.append(h('button', { class: 'primary gdone', onclick: () => { if (!setup && sel.tie && par) G.log.push(`${lab(sel)} is tied to ${lab(par)}`); back(); } }, '✓ Done'));
    return;
  }

  /* ================= 🚪 an exit to another scene ================= */
  if (top === 'exit') {
    const ex = d.exits.find((x) => x.id === G.exit);
    if (!ex) { home(); return buildGuided((p.replaceChildren(), p), c); }
    head('Exit', 'Drag it on the stage to where the way out is.');
    p.append(h('input', { placeholder: 'Label, e.g. “To the forest”', maxlength: 40, value: ex.label, oninput: (ev) => { ex.label = ev.target.value || 'Exit'; c.changedQuiet(); } }),
      h('small', { class: 'dim' }, 'Leads to'),
      h('select', { id: 'exitTo', onchange: (ev) => { ex.to = ev.target.value; const sc = (S.scenes || []).find((x) => x.id === ex.to); if (sc && (!ex.label || ex.label === 'Exit')) ex.label = sc.name; c.rebuild(); } }, h('option', { value: '' }, '— choose a prepared scene —'), (S.scenes || []).filter((x) => x.id !== d.sceneId).map((x) => h('option', { value: x.id, selected: ex.to === x.id }, x.name))),
      h('div', { class: 'row' },
        h('button', { id: 'exitLock', class: 'grow' + (ex.locked ? ' on' : ''), onclick: () => { ex.locked = !ex.locked; if (!setup) G.log.push(`“${ex.label}” is ${ex.locked ? 'locked' : 'unlocked'}`); c.rebuild(); } }, ex.locked ? '🔒 Locked — click to unlock' : '🔓 Open — click to lock'),
        !ws && h('button', { class: 'grow', disabled: !ex.to, onclick: () => { const doc = c.travelTo(ex.to); if (doc) done(`Traveling to “${doc.name}”`); } }, '🚶 Travel there now'),
        h('button', { class: 'danger', onclick: () => { d.exits = d.exits.filter((x) => x !== ex); home(); c.rebuild(); } }, '🗑')),
      doneBtn(''));
    return;
  }

  /* ================= ⚔️ battle ================= */
  if (top === 'battle') {
    const foes = d.entities.filter((e) => e.hp != null && e.id !== d.heroId);
    const hpStat = c.mods().stats && d.sheet.stats.find((st) => /health|hp|life/i.test(st.name));
    const heroHp = () => (hpStat ? hpStat.value : me && me.hp != null ? me.hp : null);
    const hurtHero = (n) => { if (hpStat) hpStat.value = clamp(hpStat.value - n, 0, hpStat.max ?? 9999); else if (me) { if (me.hp == null) { me.hp = 5; me.maxHp = 5; } me.hp = clamp(me.hp - n, 0, me.maxHp); } };
    const float = (id, text, col) => { d.floats = d.floats.filter((f) => f.id !== id); d.floats.push({ id, text, c: col }); };
    const held = (who) => d.entities.filter((e) => e.tie && e.tie.to === who.id);             // a tied sword swings with its owner
    const lunge = (a, b) => { if (!a || !b) return; const mx = a.x + (b.x - a.x) * 0.7, my = a.y + (b.y - a.y) * 0.7, ox = a.x, oy = a.y; c.autoTrack(a, [[220, mx, my], [120, mx, my], [260, ox, oy]]); };
    if (!d.battle) {
      head('Start a battle', 'Pick the enemies. The Player then chooses a move each turn, and you get tools for attacks, damage and checks.');
      G.foes ||= []; G.hp ||= 5;
      const cand = d.entities.filter((e) => e.id !== d.heroId && !e.tie);
      p.append(h('small', { class: 'dim' }, 'Enemies'), cand.length ? h('div', { class: 'grid' }, cand.map((e) => h('button', { class: G.foes.includes(e.id) ? 'on' : '', onclick: () => { G.foes = G.foes.includes(e.id) ? G.foes.filter((x) => x !== e.id) : [...G.foes, e.id]; c.rebuild(); } }, glyphNode(code, e.asset)))) : h('p', { class: 'dim' }, 'Add an enemy to the stage first.'),
        h('small', { class: 'dim' }, 'Health of each enemy'), h('div', { class: 'row' }, [2, 3, 5, 8, 12, 20].map((n) => h('button', { class: 'grow' + (G.hp === n ? ' on' : ''), onclick: () => { G.hp = n; c.rebuild(); } }, String(n)))),
        h('button', { class: 'primary gdone', id: 'battleStart', disabled: !G.foes.some((id) => cand.some((e) => e.id === id)), onclick: () => {
          for (const e of cand) if (G.foes.includes(e.id)) { e.hp = G.hp; e.maxHp = G.hp; }
          if (!hpStat && me && me.hp == null) { me.hp = 5; me.maxHp = 5; }
          d.battle = { round: 1 }; d.ask = { kind: 'battle', text: 'Battle! What do you do?', sides: 6, dc: 0, verb: '', places: [], targets: [] }; d.choices = [];
          d.sfx ||= 'alarm'; d.card ||= 'Battle!'; G.foes = [];
          if (!setup) G.log.push('A battle begins'); c.rebuild();
        } }, '⚔️ Begin the battle'));
      return;
    }
    head(`⚔️ Battle — round ${d.battle.round}`, 'One click per event. Each becomes its own step, so they play one after the other.');
    const foe = foes.find((e) => e.id === G.foe) || foes.find((e) => e.id === d.target) || foes[0];
    const a = d.answer, mv = a && a.kind === 'battle' ? a.move : '';
    const endBattle = (sound, card) => { const dd = c.draft; for (const e of dd.entities) { e.hp = null; e.maxHp = null; } dd.battle = null; dd.ask = null; dd.sfx = sound; if (card) dd.card = card; G.path = []; };
    /** Finish the event just built: it becomes a step of its own, and the tools stay open for the next one. */
    const stepOn = (label) => {
      const left = d.entities.some((e) => e.hp != null && e.id !== d.heroId && !e.temp), down = heroHp() === 0;
      c.nextStep(); G.log = []; G.path = ['battle'];
      if (!left) { endBattle('fanfare', 'Victory!'); c.toast('All enemies are down — the battle is over'); } else if (down) c.toast(`${S.names.player} is at 0 health — decide what happens`);
      if (label) G.did = [...(G.did || []), label].slice(-4);
      c.rebuild();
    };
    p.append(h('div', { class: 'card' }, h('small', { class: 'dim' }, 'Who is fighting'),
      h('div', { class: 'row statrow' }, h('b', { class: 'grow' }, '🧑 ', S.names.player, `  ❤ ${heroHp() ?? '–'}`), h('button', { onclick: () => { hurtHero(1); c.rebuild(); } }, '−'), h('button', { onclick: () => { hurtHero(-1); c.rebuild(); } }, '+')),
      foes.map((e) => h('div', { class: 'row statrow' }, h('button', { class: 'foe' + (e === foe ? ' on' : ''), title: 'Choose this enemy', onclick: () => { G.foe = e.id; c.rebuild(); } }, glyphNode(code, e.asset, 'mini')), h('b', { class: 'grow' }, ` ❤ ${e.hp}/${e.maxHp}`),
        h('button', { onclick: () => { e.hp = clamp(e.hp - 1, 0, e.maxHp); c.rebuild(); } }, '−'), h('button', { onclick: () => { e.hp = clamp(e.hp + 1, 0, e.maxHp); c.rebuild(); } }, '+')))));
    if (foe) {
      const hit = (n) => {                                                 // the Player's blow lands (or misses)
        lunge(me, foe); for (const w of me ? held(me) : []) w.once = 'swing';
        if (n) { foe.hp = clamp(foe.hp - n, 0, foe.maxHp); foe.once = 'hit'; float(foe.id, `-${n}`, '#ff5a5a'); d.sfx = 'boom'; } else { float(foe.id, 'miss', '#ffffff'); d.sfx = 'fail'; }
        if (foe.hp <= 0) { foe.once = 'die'; foe.temp = true; foe.say = ''; }
        stepOn(n ? `${S.names.player} hits ${lab(foe)} for ${n}${foe.hp <= 0 ? ' — it falls' : ''}` : `${S.names.player} misses`);
      };
      const strike = (style, n) => {                                       // the enemy's move against the hero
        const arms = held(foe);
        if (style === 'strike') { lunge(foe, me); d.sfx = 'boom'; }
        if (style === 'swing') { lunge(foe, me); if (arms.length) for (const w of arms) w.once = 'swing'; else foe.once = 'swing'; d.sfx = 'boom'; }
        if (style === 'shoot' || style === 'magic') {
          foe.once = 'cast'; d.sfx = style === 'magic' ? 'magic' : 'laser';
          if (me) { const shot = { id: c.rid(), asset: style === 'magic' ? 'e:🔥' : 'e:➤', x: me.x, y: me.y - 0.06, scale: 0.6, flip: me.x < foe.x, rot: 0, say: '', fx: '', emote: '', solid: false, active: null, tie: null, hp: null, maxHp: null, once: 'vanish', temp: true, layer: 1 };
            d.entities.push(shot); d.tracks.push({ id: shot.id, pts: [0, foe.x, foe.y - 0.08 * foe.scale, 420, me.x, me.y - 0.06] }); }
        }
        if (style === 'roar') { foe.once = 'roar'; d.burst = 'shake'; d.sfx = 'alarm'; }
        if (n && me) { hurtHero(n); me.once = 'hit'; float(me.id, `-${n}`, '#ff5a5a'); d.burst = 'hurt'; } else if (me && style !== 'roar') float(me.id, 'miss', '#ffffff');
        d.battle.round += 1;
        stepOn(`${lab(foe)} ${{ strike: 'strikes', swing: 'swings', shoot: 'shoots', magic: 'casts a spell', roar: 'roars' }[style]}${n ? ` for ${n}` : style === 'roar' ? '' : ' and misses'}`);
      };
      G.style ||= 'strike';
      const dmgRow = (fn, id) => h('div', { class: 'row', id }, [[0, 'Miss'], [1, '1'], [2, '2'], [3, '3'], [5, '5'], [8, '8']].map(([n, l]) => h('button', { 'data-dmg': n, class: 'grow', onclick: () => fn(n) }, l)));
      p.append(
        h('div', { class: 'card' }, h('b', {}, '1. ', mv === 'attack' ? `${S.names.player} attacks ` : mv === 'defend' ? `${S.names.player} defends. ` : mv === 'flee' ? `${S.names.player} tries to flee. ` : `${S.names.player}’s attack on `, mv === 'defend' || mv === 'flee' ? '' : glyphNode(code, foe.asset, 'mini')),
          mv === 'flee' ? h('div', { class: 'row' }, h('button', { class: 'grow', id: 'fleeYes', onclick: () => { endBattle('magic', ''); if (!setup) G.log.push(`${S.names.player} gets away`); c.rebuild(); } }, '🏃 They get away'), h('span', { class: 'dim small grow' }, 'or they fail: go on to 2.'))
            : mv === 'defend' ? h('small', { class: 'dim' }, 'Take it into account in the damage below.')
              : [h('small', { class: 'dim' }, 'How much damage does it do?'), dmgRow(hit, 'heroHits')]),
        h('div', { class: 'card' }, h('b', {}, '2. What ', glyphNode(code, foe.asset, 'mini'), ' does back'),
          h('div', { class: 'chips wrap' }, [['strike', '👊 Strike'], ['swing', '🗡️ Sword swing'], ['shoot', '🏹 Shoot'], ['magic', '🔥 Magic']].map(([id, l]) => h('button', { 'data-attack': id, class: G.style === id ? 'on' : '', onclick: () => { G.style = id; c.rebuild(); } }, l)),
            h('button', { 'data-attack': 'roar', onclick: () => strike('roar', 0) }, '😡 Just roars')),
          h('small', { class: 'dim' }, 'Damage to the hero'), dmgRow((n) => strike(G.style, n), 'foeHits')));
    }
    if (G.did && G.did.length) p.append(h('div', { class: 'card gevents' }, h('small', { class: 'dim' }, 'So far this turn'), G.did.map((l) => h('div', {}, '• ' + l))));
    p.append(h('div', { class: 'card' }, h('small', { class: 'dim' }, `What ${S.names.player} does next turn`),
        h('div', { class: 'row' }, h('button', { class: 'grow' + (d.ask && d.ask.kind === 'battle' ? ' on' : ''), onclick: () => { d.ask = { kind: 'battle', text: 'Your move!', sides: 6, dc: 0, verb: '', places: [], targets: [] }; c.rebuild(); } }, 'A battle move'),
          [[8, 'Check 8+'], [12, 'Check 12+'], [16, 'Check 16+']].map(([dc, l]) => h('button', { class: 'grow' + (d.ask && d.ask.kind === 'roll' && d.ask.dc === dc ? ' on' : ''), title: 'A d20 skill check', onclick: () => { d.ask = { kind: 'roll', text: 'Skill check!', sides: 20, dc, verb: '', places: [], targets: [] }; c.rebuild(); } }, l)))),
      h('div', { class: 'row' },
        h('button', { class: 'grow danger', id: 'battleEnd', onclick: () => { endBattle('fanfare', ''); if (!setup) G.log.push('The battle is over'); c.rebuild(); } }, '🏁 End the battle'),
        h('button', { class: 'grow', onclick: () => { home(); c.rebuild(); } }, 'Other tools')));
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
    const info = { title: S.info.title, text: S.info.text }; let infoT = 0;
    const saveInfo = () => { clearTimeout(infoT); infoT = setTimeout(() => c.setInfo({ ...info }), 500); };
    p.append(c.typeCard(),
      h('div', { class: 'card' }, h('h3', {}, '📜 Title screen and instructions'),
        h('input', { id: 'infoTitle', placeholder: 'Title of your story', maxlength: 60, value: info.title, oninput: (ev) => { info.title = ev.target.value; saveInfo(); } }),
        h('textarea', { id: 'infoText', rows: 4, maxlength: 800, placeholder: 'A few lines for the Player: what the story is about, how to play, what the goal is…', oninput: (ev) => { info.text = ev.target.value; saveInfo(); } }, info.text),
        h('p', { class: 'dim small' }, 'The Player sees this while you set the stage, the story opens on the title, and the instructions stay in their side panel.')),
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
