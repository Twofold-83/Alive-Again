/* Director screens about one character or thing: its tools, speaking, moving, adding, tying, active objects, exits. */
import { CATEGORIES, PIXEL } from '../../core/catalog.js';
import { h, clone, clamp } from '../../core/dom.js';
import { FX, EMOTES } from '../../core/consts.js';
import { G, buildGuided, short } from '../guided.js';
import { glyphNode } from '../../stage/render.js';

const EMOJI_GROUPS = {
  char: ['people', 'fantasy', 'animals', 'faces'],
  thing: ['things', 'tools', 'food', 'vehicles', 'wear', 'nature', 'places', 'body'],
  tile: ['blocks'],
  fx: ['effects'],
};
/** Categories for one "Add something" branch: pixel art first, then the emoji library. */
function groupCats(g) { return [...PIXEL.filter((c) => c.group === g), ...EMOJI_GROUPS[g].map((id) => { const c = CATEGORIES.find((k) => k.id === id); return { ...c, label: '😀 ' + c.label }; })]; }

/* ================= a selected character or thing: all its tools in one place ================= */
export function screenThing(kit) {
  const { p, c, d, S, sel, lab, ws, home, enter, done, head, doneBtn, lookRow, sayInput, pickSel } = kit;
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
        ws && b('🧱', 'Solid', () => { sel.solid = !sel.solid; c.rebuild(); }, sel.solid),
        ws && S.rules.type === 'adventure' && !isHero && b('⭐', 'Active object', () => enter('active'), !!sel.active),
        b('🔗', sel.tie ? 'Tied — change' : 'Tie to…', () => { G.pick = null; enter('tie'); }, !!sel.tie),
        !ws && c.mods().inventory && !isHero && b('🎒', `Give to ${S.names.player}`, () => { const l = lab(sel); c.giveToPlayer(sel); done(`${S.names.player} gets ${l}`); }),
        !(ws && isHero) && b('🗑️', 'Remove', () => { const l = lab(sel); c.removeEntity(sel); done(`${l} disappears`); })),
      ws && isHero && h('p', { class: 'dim small' }, 'This marks where the Player’s hero starts in this scene.'),
      sel.solid && h('p', { class: 'dim small' }, 'Solid: the Player’s hero cannot walk through it.'),
      doneBtn(''));
    return;
}

export function screenSwap(kit) {
  const { p, c, sel, lab, setup, head, searchGrid } = kit;
    head(`Turn ${lab(sel)} into…`, 'It keeps its place and size.');
    p.append(...searchGrid((i) => { const was = lab(sel); sel.asset = i.asset; G.path.pop(); if (!setup) G.log.push(`${was} turns into ${lab(sel)}`); c.rebuild(); }, 'Search: frog, statue, skeleton…'));
    return;
}

/* ================= 💬 speak ================= */
export function screenSpeak(kit) {
  const { p, c, sel, lab, head, doneBtn, picker, sayInput } = kit;
    if (!sel) return picker('Who speaks?');
    head(`What does ${lab(sel)} say?`);
    p.append(sayInput('Type the line…'), h('small', { class: 'dim' }, 'With a face (optional)'),
      h('div', { class: 'chips wrap' }, EMOTES.map((e) => h('button', { class: sel.emote === e ? 'on' : '', onclick: () => { sel.emote = sel.emote === e ? '' : e; c.rebuild(); } }, e))),
      doneBtn(() => (sel.say ? `${lab(sel)} says “${short(sel.say)}”` : `${lab(sel)} falls silent`)));
    return;
}

/* ================= 🚶 move / animate ================= */
export function screenMove(kit) {
  const { p, c, sel, me, lab, enter, done, head, opt, picker, walk, comeIn } = kit;
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

export function screenMoveDrag(kit) {
  const { p, sel, lab, head, doneBtn } = kit;
   head(`Drag ${lab(sel)} to its new place`, 'It glides there when the step plays.'); p.append(doneBtn(() => `${lab(sel)} moves`)); return;
}

export function screenMoveRec(kit) {
  const { p, c, sel, lab, head, doneBtn } = kit;
    const used = c.trackEnd(sel.id);
    head(`Recording ${lab(sel)}`, 'Drag it across the stage now. Release to stop; drag again to continue.');
    p.append(h('div', { class: 'meter' }, h('i', { style: `width:${used / 100}%` })), h('small', { class: 'dim' }, `${(used / 1000).toFixed(1)} of 10 seconds`),
      h('div', { class: 'row' }, h('button', { class: 'grow', onclick: () => { c.dropTrack(sel.id); c.rebuild(); } }, '✖ Start over'), doneBtn(() => `${lab(sel)} moves along a path`)));
    return;
}

/* ================= ➕ add ================= */
export function screenAdd(kit) {
  const { p, enter, head, opt } = kit;
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

export function screenAddChar(kit) {
  const { p, c, top, head, place, itemGrid } = kit;
    const cats = groupCats(top.slice(4)), cat = cats.find((x) => x.id === G.cat) || cats[0];
    head('Pick one', 'It appears on the stage.');
    if (cats.length > 1) p.append(h('div', { class: 'chips wrap' }, cats.map((x) => h('button', { class: x === cat ? 'on' : '', onclick: () => { G.cat = x.id; c.rebuild(); } }, x.label))));
    p.append(itemGrid(cat.items, (i) => place(i.asset)));
    return;
}

export function screenAddSearch(kit) {
  const { p, head, place, searchGrid } = kit;
   head('Search'); p.append(...searchGrid((i) => place(i.asset), 'dragon, door, key, angry…')); return;
}

export function screenAddOwn(kit) {
  const { p, c, S, code, head, place } = kit;
    head('Something of your own');
    const mine = S.assets.filter((a) => a.kind === 'sprite');
    const any = h('input', { placeholder: 'Any emoji or a short word', maxlength: 24 });
    if (mine.length) p.append(h('div', { class: 'grid' }, mine.map((a) => h('button', { title: a.name, onclick: () => place('c:' + a.id) }, glyphNode(code, 'c:' + a.id)))));
    p.append(c.maker('sprite', (id) => place('c:' + id)), h('div', { class: 'row' }, any, h('button', { onclick: () => { const v = any.value.trim(); if (v) place('e:' + v); } }, 'Add')));
    return;
}

/* ================= ⭐ active object ================= */
export function screenActive(kit) {
  const { p, c, S, sel, lab, setup, back, head } = kit;
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
export function screenTie(kit) {
  const { p, c, d, code, sel, lab, setup, back, head } = kit;
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
export function screenExit(kit) {
  const { p, c, d, S, ws, setup, home, done, head, doneBtn } = kit;
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
