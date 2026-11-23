/* Director screens about the scene as a whole: moments and sounds, place, weather, music, title cards, narration, drawing, camera. */
import { SFX, SFX_GROUPS, MOODS } from '../../core/audio.js';
import { h, clamp, add } from '../../core/dom.js';
import { BURSTS, WEATHER, LIGHTS, DARKNESS } from '../../shared/options.js';
import { newEntity, freeSpot } from '../../shared/scene-model.js';
import { G, short } from '../guided.js';
import { BACKDROPS, backdropCss, PIXEL, pixelInfo } from '../../core/catalog.js';
import { setCell } from '../../stage/level.js';
import { LEVEL_W, LEVEL_H } from '../../shared/scene-model.js';
import { glyphNode } from '../../stage/render.js';
import { roomPicker, envOfTheme } from './pickers.js';
import { kept, keepRoom, enterRoom } from '../../core/kept.js';
import { ROOM_THEMES, ROOM_SHAPES, buildRoom, themeOf, roomArea } from '../../shared/rooms.js';
import { walkable } from '../../shared/scene-model.js';
import { toast } from '../../core/dom.js';

const PENS = ['#ffffff', '#15131c', '#ff5a5a', '#ffb454', '#ffe14d', '#57d38c', '#4db8ff', '#c77dff'];

/* ================= moment and sound ================= */
export function screenMoment(kit) {
  const { p, c, d, head, doneBtn, chips } = kit;
  head('Moment and sound', 'Happens once, as this step plays.');
  add(
    p,
    h('small', { class: 'dim' }, 'On screen'),
    chips(BURSTS, 'burst'),
    h('small', { class: 'dim' }, 'Sound — click one to hear it'),
    chips([SFX[0]], 'sfx'),
    ...SFX_GROUPS.flatMap(([name, list]) => [
      h('small', { class: 'dim grp' }, name),
      chips(list, 'sfx', (v) => {
        c.audio.unlock();
        c.audio.sfx(v);
      }),
    ]),
    doneBtn(() =>
      [d.burst && (BURSTS.find((x) => x[0] === d.burst) || [])[1], d.sfx && (SFX.find((x) => x[0] === d.sfx) || [])[1]].filter(Boolean).join(' + '),
    ),
  );
  return;
}

/* ================= scene ================= */
export function screenScene(kit) {
  const { p, c, d, S, enter, done, head, opt } = kit;
  head('Mood', 'Light and dark, weather, music: how the place feels.');
  add(
    p,
    h(
      'div',
      { class: 'gopts' },
      opt('map', 'Go to a scene from the map', `${(S.scenes || []).length} on the map`, () => enter('scene:prepared')),
      opt(
        'light-bulb',
        'Light and dark',
        d.dark ? DARKNESS[d.dark][1] + ', ' + d.entities.filter((e) => e.glow).length + ' lights' : 'A dark room, lamps, fire, neon',
        () => enter('scene:light'),
      ),
      S.rules.type === 'adventure' &&
        opt('door', 'Add an exit', 'A way out to another prepared scene', () => {
          const x = { id: c.rid(), to: '', label: 'Exit', x: 0.9, y: 0.6, locked: false };
          d.exits.push(x);
          G.exit = x.id;
          enter('exit');
        }),
      opt('rain-cloud', 'The weather', 'Rain, fog, darkness…', () => enter('scene:weather')),
      opt('music-note', 'The music', '', () => enter('scene:music')),
      opt('book-red', 'A title card', '“Chapter 2”, “Later that night”', () => enter('scene:card')),
      opt('dice', 'A surprise scene', 'A ready-made place and cast', async () => {
        if (await c.randomScene()) done('A whole new scene');
      }),
      opt('light-bulb', 'Give me an idea', 'A random story twist', () => c.idea()),
    ),
  );
  return;
}

export function screenScenePrepared(kit) {
  const { p, c, S, done, head } = kit;
  head('Go to a scene from the map', 'It replaces the place, the level and everything on stage except the hero.');
  const list = S.scenes || [];
  add(
    p,
    list.length
      ? h(
          'div',
          { class: 'col' },
          list.map((sc) =>
            h(
              'button',
              {
                class: 'prep',
                onclick: () => {
                  c.useScene(sc);
                  done(`The scene changes to “${sc.name}”`);
                },
              },
              h('b', {}, sc.name),
              h('small', { class: 'dim' }, `${sc.scene.entities.length - 1} things${sc.scene.level ? ' · has a level' : ''}`),
            ),
          ),
        )
      : h('p', { class: 'dim' }, 'The map is empty. Build a room on the stage and keep it on the map first.'),
    h('button', { onclick: () => c.map() }, 'Open the map'),
  );
  return;
}

export function screenScenePlace(kit) {
  const { p, c, d, S, code, head, doneBtn } = kit;
  head('Where are we now?');
  const drop = (id, name) =>
    h(
      'button',
      {
        'data-mark': `backdrop=${id}`,
        class: d.backdrop === id ? 'on' : '',
        style: `background:${backdropCss(code, id)}`,
        onclick: () => {
          d.backdrop = id;
          c.changed();
        },
      },
      name,
    );
  add(
    p,
    doneBtn('The place changes'),
    h(
      'div',
      { class: 'grid drops' },
      BACKDROPS.map((b) => drop(b.id, b.name)),
      S.assets.filter((a) => a.kind === 'backdrop').map((a) => drop('c:' + a.id, a.name)),
    ),
    c.maker('backdrop', (id) => {
      d.backdrop = 'c:' + id;
      c.rebuild();
    }),
  );
  return;
}

export function screenSceneWeather(kit) {
  const { p, d, head, doneBtn, chips } = kit;
  head('The weather');
  add(
    p,
    chips(WEATHER, 'weather'),
    doneBtn(() => `Weather: ${(WEATHER.find((w) => w[0] === d.weather) || WEATHER[0])[1]}`),
  );
  return;
}

export function screenSceneMusic(kit) {
  const { p, c, d, head, doneBtn } = kit;
  head('The music', 'Click a tune to hear it. It keeps playing until you change it.');
  add(
    p,
    h(
      'div',
      { class: 'list' },
      MOODS.map((m) =>
        h(
          'button',
          {
            'data-mark': `mood=${m.id}`,
            class: d.mood === m.id ? 'on' : '',
            onclick: () => {
              c.audio.unlock();
              d.mood = m.id;
              c.changed();
            },
          },
          m.name,
        ),
      ),
    ),
    doneBtn(() => `Music: ${(MOODS.find((m) => m.id === d.mood) || MOODS[0]).name}`),
  );
  return;
}

export function screenSceneCard(kit) {
  const { p, c, d, head, doneBtn } = kit;
  head('Title card', 'Shown full-screen before this step plays.');
  add(
    p,
    h('input', {
      placeholder: '“Chapter 2 — The Cave”',
      maxlength: 60,
      value: d.card,
      oninput: (ev) => {
        d.card = ev.target.value;
        c.changedQuiet();
      },
    }),
    doneBtn(() => (d.card ? `Title card “${short(d.card)}”` : '')),
  );
  return;
}

/* ================= camera ================= */
export function screenCamera(kit) {
  const { p, c, d, code, head, doneBtn } = kit;
  head('Camera', 'The yellow frame shows what the Player will see. The camera moves there when this step plays.');
  const z = d.cam ? d.cam.z : 1;
  const look = (x, y) => {
    d.cam = { x, y, z: d.cam ? d.cam.z : 2 };
    c.rebuild();
  };
  add(
    p,
    h('small', { class: 'dim' }, 'Zoom'),
    h(
      'div',
      { class: 'row' },
      [1, 1.5, 2, 3].map((n) =>
        h(
          'button',
          {
            'data-zoom': n,
            class: 'grow' + (z === n ? ' on' : ''),
            onclick: () => {
              d.cam = n === 1 ? null : { x: d.cam ? d.cam.x : 0.5, y: d.cam ? d.cam.y : 0.6, z: n };
              c.rebuild();
            },
          },
          n === 1 ? 'Whole stage' : `${n}×`,
        ),
      ),
    ),
    h('small', { class: 'dim' }, 'Look at'),
    h(
      'div',
      { class: 'grid' },
      d.entities.map((e) => h('button', { onclick: () => look(e.x, clamp(e.y - 0.08 * e.scale, 0, 1)) }, glyphNode(code, e.asset))),
    ),
    h(
      'div',
      { class: 'row' },
      [
        ['↖', 0.25, 0.3],
        ['↗', 0.75, 0.3],
        ['Centre', 0.5, 0.5],
        ['↙', 0.25, 0.75],
        ['↘', 0.75, 0.75],
      ].map(([l, x, y]) => h('button', { class: 'grow', onclick: () => look(x, y) }, l)),
    ),
    doneBtn(() => (d.cam ? `Camera zooms in ${d.cam.z}×` : 'Camera shows the whole stage')),
  );
  return;
}

/* ================= narrate ================= */
export function screenNarrate(kit) {
  const { p, c, d, head, doneBtn } = kit;
  head('Narrate', 'Appears under the stage in this step. For another line later, start the next step and narrate again.');
  add(
    p,
    h('input', {
      placeholder: '“Suddenly, the lights go out.”',
      maxlength: 240,
      value: d.narration,
      enterkeyhint: 'done',
      oninput: (ev) => {
        d.narration = ev.target.value;
        c.changedQuiet();
      },
    }),
    doneBtn(() => (d.narration ? `Narration “${short(d.narration)}”` : 'The narration clears')),
  );
  return;
}

/* ================= draw ================= */
export function screenDraw(kit) {
  const { p, c, d, head, doneBtn } = kit;
  head('Draw on the stage', 'Drag on the stage to draw. New lines draw themselves when the step plays.');
  add(
    p,
    h(
      'div',
      { class: 'row pens' },
      PENS.map((col) =>
        h('button', {
          class: 'pen' + (c.pen.c === col ? ' on' : ''),
          style: `background:${col}`,
          'aria-label': 'Colour',
          onclick: () => {
            c.pen.c = col;
            c.rebuild();
          },
        }),
      ),
    ),
    h(
      'div',
      { class: 'row' },
      [
        ['Thin', 2],
        ['Medium', 4],
        ['Thick', 9],
      ].map(([l, w]) =>
        h(
          'button',
          {
            class: 'grow' + (c.pen.w === w ? ' on' : ''),
            onclick: () => {
              c.pen.w = w;
              c.rebuild();
            },
          },
          l,
        ),
      ),
      h(
        'button',
        {
          class: 'grow',
          disabled: !d.drawing.length,
          onclick: () => {
            d.drawing.pop();
            c.rebuild();
          },
        },
        '↶ Undo',
      ),
      h(
        'button',
        {
          class: 'grow',
          disabled: !d.drawing.length,
          onclick: () => {
            d.drawing = [];
            c.rebuild();
          },
        },
        'Clear',
      ),
    ),
    doneBtn(() => (d.drawing.length ? 'A drawing' : '')),
  );
  return;
}

/* ================= build this room: walls and floor in one press, on the stage itself; rooms kept for every story ================= */
export function screenRoom(kit) {
  const { p, c, d, head, done } = kit;
  head('Build this room', 'Everything happens on the stage: pick walls and a floor, then add things from “Add something”.');
  G.roomTheme ||= 'oldhouse';
  G.roomShape ||= 'room';
  const hero = d.entities.find((e) => e.id === d.heroId);
  const lay = (theme, shape) => {
    G.roomTheme = theme;
    G.roomShape = shape;
    d.level = buildRoom(theme, shape);
    d.backdrop = 'b:black';
    if (d.mood === 'm:none' || ROOM_THEMES.some((t) => t.mood === d.mood)) d.mood = themeOf(theme).mood;
    if (hero && !walkable(d, hero.x, hero.y)) {
      const a = roomArea(shape);
      hero.x = (a.x0 + a.x1) / 2;
      hero.y = a.y0 + (a.y1 - a.y0) * 0.92;
    }
    c.changedQuiet();
    c.rebuild();
  };
  const name = h('input', {
    id: 'roomName',
    class: 'grow',
    placeholder: 'Name of this room',
    maxlength: 40,
    value: G.roomName || '',
    oninput: () => (G.roomName = name.value),
  });
  const rooms = kept.rooms.all();
  add(
    p,
    h(
      'div',
      { class: 'card roomcard' },
      h('h3', {}, 'Room in one click'),
      roomPicker({
        env: G.roomEnv || envOfTheme(G.roomTheme),
        theme: d.level ? G.roomTheme : '',
        onEnv: (id) => {
          G.roomEnv = id;
          c.rebuild();
        },
        onPick: (id) => lay(id, G.roomShape),
      }),
      h(
        'div',
        { class: 'chips wrap' },
        ROOM_SHAPES.map((s) =>
          h('button', { 'data-shape': s.id, class: G.roomShape === s.id ? 'on' : '', onclick: () => lay(G.roomTheme, s.id) }, s.name),
        ),
      ),
      h('div', { class: 'row' }, h('button', { class: 'grow', id: 'roomPaint', onclick: () => kit.enter('paint') }, 'Paint walls and floor by hand')),
    ),
    h(
      'div',
      { class: 'card', id: 'roomSaves' },
      h('h3', {}, 'Save room'),
      h(
        'div',
        { class: 'row' },
        name,
        h(
          'button',
          {
            id: 'roomSave',
            class: 'primary',
            onclick: () => {
              const nm = (G.roomName || '').trim() || 'A room';
              toast(keepRoom(nm, d) ? `“${nm}” is saved for every story` : 'This device has no room left to save it');
              c.rebuild();
            },
          },
          'Save room',
        ),
      ),
      h('b', { class: 'actlab' }, 'My saved rooms'),
      rooms.length
        ? rooms.map((r) =>
            h(
              'div',
              { class: 'row myroom' },
              h(
                'button',
                {
                  class: 'grow',
                  title: 'Bring this room on stage',
                  onclick: () => {
                    enterRoom(d, r);
                    c.changedQuiet();
                    done(`The scene changes to ${r.name}`);
                  },
                },
                h('b', {}, r.name),
                h('small', { class: 'dim' }, ` ${r.scene.entities.length - 1} things`),
              ),
              h(
                'button',
                {
                  title: 'Forget this room',
                  onclick: () => {
                    if (!confirm(`Forget “${r.name}”?`)) return;
                    kept.rooms.remove(r.id);
                    c.rebuild();
                  },
                },
                '✕',
              ),
            ),
          )
        : h('small', { class: 'dim' }, 'Nothing yet. A saved room stays on this device and can be brought on stage in any story.'),
    ),
  );
}

/* ================= light and dark: how dark the place is, and what shines in it ================= */
export function screenSceneLight(kit) {
  const { p, c, d, head, lab, doneBtn } = kit;
  head('Light and dark', 'Darken the place, then put light sources into it. Any thing can shine: press it on the stage and choose its light.');
  const lit = d.entities.filter((e) => e.glow);
  add(
    p,
    h('small', { class: 'dim' }, 'How dark is it?'),
    h(
      'div',
      { class: 'row', id: 'darkRow' },
      DARKNESS.map(([n, label]) =>
        h(
          'button',
          {
            'data-dark': n,
            class: 'grow' + ((d.dark || 0) === n ? ' on' : ''),
            onclick: () => {
              d.dark = n;
              c.changedQuiet();
              c.rebuild();
            },
          },
          label,
        ),
      ),
    ),
    h('small', { class: 'dim' }, 'Add a light source'),
    h(
      'div',
      { class: 'lightgrid', id: 'lightGrid' },
      LIGHTS.map(([id, label, col]) =>
        h(
          'button',
          {
            'data-light': id,
            onclick: () => {
              const e = c.addEntity(
                'p:' +
                  (id === 'candle'
                    ? 'candle-stub'
                    : id === 'fire'
                      ? 'campfire'
                      : id === 'screen'
                        ? 'monitor-text'
                        : id === 'moon'
                          ? 'window-frame-dark'
                          : 'lamp-bare-bulb'),
              );
              if (e) {
                e.glow = id;
                Object.assign(e, freeSpot(d));
              }
              c.changedQuiet();
              c.rebuild();
            },
          },
          h('i', { style: `background:${col};box-shadow:0 0 10px 3px ${col}` }),
          h('span', {}, label),
        ),
      ),
    ),
    lit.length > 0 && h('small', { class: 'dim' }, 'Shining now (drag them on the stage)'),
    lit.map((e) =>
      h(
        'div',
        { class: 'row' },
        h('span', { class: 'grow' }, lab(e), h('small', { class: 'dim' }, ' — ' + (LIGHTS.find((l) => l[0] === e.glow) || [0, ''])[1])),
        h(
          'button',
          {
            title: 'Put this light out',
            onclick: () => {
              e.glow = '';
              c.changedQuiet();
              c.rebuild();
            },
          },
          'Put out',
        ),
      ),
    ),
    doneBtn(() => (d.dark ? `It is ${DARKNESS[d.dark][1].toLowerCase()} now` : 'The light changes')),
  );
  void newEntity;
}

/* ================= paint walls and floor by hand, on the stage ================= */
/** Paint (or rub out) the tiles under a point of the stage with what is chosen on the Paint screen. */
export function paintAt(scene, x, y) {
  const P = G.paint;
  if (!P || (P.tool === 'brush' && !P.asset)) return false;
  const cx = Math.min(LEVEL_W - 1, Math.floor(x * LEVEL_W)),
    cy = Math.min(LEVEL_H - 1, Math.floor(y * LEVEL_H)),
    k = P.tool === 'erase' ? '' : pixelInfo(P.asset).kind === 'wall' ? 'w' : 'f';
  let any = false;
  for (let j = 0; j < P.size; j++)
    for (let i = 0; i < P.size; i++) {
      const X = cx + i - ((P.size - 1) >> 1),
        Y = cy + j - ((P.size - 1) >> 1);
      if (X < 0 || Y < 0 || X >= LEVEL_W || Y >= LEVEL_H) continue;
      if (setCell(scene, Y * LEVEL_W + X, k ? P.asset : '', k) !== false) any = true;
    }
  if (any && scene.backdrop !== 'b:black') scene.backdrop = 'b:black';
  return any;
}
export function screenPaint(kit) {
  const { p, c, d, head, doneBtn } = kit;
  const cats = PIXEL.filter((x) => x.group === 'tile');
  G.paint ||= { tool: 'brush', size: 1, cat: '', asset: '' };
  const P = G.paint,
    cat = cats.find((x) => x.id === P.cat) || cats[cats.length - 1];
  head('Paint walls and floor', 'Pick a tile, then drag on the stage. The hero walks on floor tiles; wall tiles block the way.');
  const chip = (label, on, fn, attr = {}) =>
    h(
      'button',
      {
        ...attr,
        class: 'grow' + (on ? ' on' : ''),
        onclick: () => {
          fn();
          c.rebuild();
        },
      },
      label,
    );
  const count = (k) => (d.level ? [...d.level.cells].filter((ch) => (d.level.pal[parseInt(ch, 36) - 1] || {}).k === k).length : 0);
  const tiles = (kind, title) => {
    const items = cat.items.filter((i) => (i.kind === 'wall' ? 'wall' : 'floor') === kind);
    return (
      items.length > 0 && [
        h('small', { class: 'dim' }, title),
        h(
          'div',
          { class: 'grid tiles', 'data-set': kind },
          items.map((i) =>
            h(
              'button',
              {
                title: i.name,
                class: P.asset === i.asset ? 'on' : '',
                onclick: () => {
                  P.asset = i.asset;
                  P.tool = 'brush';
                  c.rebuild();
                },
              },
              h('img', { src: `px/${i.asset.slice(2)}.png`, alt: '' }),
            ),
          ),
        ),
      ]
    );
  };
  add(
    p,
    h(
      'div',
      { class: 'row' },
      chip('Brush', P.tool === 'brush', () => (P.tool = 'brush'), { 'data-tool': 'brush' }),
      chip('Rub out', P.tool === 'erase', () => (P.tool = 'erase'), { 'data-tool': 'erase' }),
    ),
    h(
      'div',
      { class: 'row' },
      h('span', { class: 'dim small' }, 'Size'),
      [1, 2, 3].map((n) => chip(`${n}×${n}`, P.size === n, () => (P.size = n), { 'data-size': n })),
    ),
    h(
      'div',
      { class: 'chips wrap envchips' },
      cats.map((x) => h('button', { 'data-tcat': x.id, class: x === cat ? 'on' : '', onclick: () => ((P.cat = x.id), c.rebuild()) }, x.label)),
    ),
    tiles('floor', 'Floor — can be walked on'),
    tiles('wall', 'Walls — block the way'),
    h(
      'div',
      { class: 'row' },
      h(
        'button',
        {
          class: 'grow',
          id: 'paintClear',
          onclick: () => {
            d.level = null;
            c.changedQuiet();
            c.rebuild();
          },
        },
        'Take all tiles away',
      ),
      h(
        'button',
        {
          class: 'grow',
          id: 'paintFill',
          disabled: !P.asset,
          title: 'Cover the whole stage with the chosen tile',
          onclick: () => {
            const k = pixelInfo(P.asset).kind === 'wall' ? 'w' : 'f';
            for (let i = 0; i < LEVEL_W * LEVEL_H; i++) setCell(d, i, P.asset, k);
            d.backdrop = 'b:black';
            c.changedQuiet();
            c.rebuild();
          },
        },
        'Fill the stage',
      ),
      h('span', { class: 'dim small grow', id: 'paintCount' }, `${count('f')} floor · ${count('w')} wall tiles`),
    ),
    doneBtn(() => 'The room is repainted'),
  );
}
