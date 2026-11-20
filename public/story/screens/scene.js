/* Director screens about the scene as a whole: moments and sounds, place, weather, music, title cards, narration, drawing, camera. */
import { SFX, SFX_GROUPS, MOODS } from '../../core/audio.js';
import { h, clamp } from '../../core/dom.js';
import { BURSTS, WEATHER } from '../../shared/options.js';
import { G, short } from '../guided.js';
import { BACKDROPS, backdropCss } from '../../core/catalog.js';
import { glyphNode } from '../../stage/render.js';

const PENS = ['#ffffff', '#15131c', '#ff5a5a', '#ffb454', '#ffe14d', '#57d38c', '#4db8ff', '#c77dff'];

/* ================= 💥 moment and sound ================= */
export function screenMoment(kit) {
  const { p, c, d, head, doneBtn, chips } = kit;
  head('Moment and sound', 'Happens once, as this step plays.');
  p.append(
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

/* ================= 🌄 scene ================= */
export function screenScene(kit) {
  const { p, c, d, S, ws, enter, done, head, opt } = kit;
  head('Change what about the scene?');
  p.append(
    h(
      'div',
      { class: 'gopts' },
      !ws && opt('🗺️', 'Go to a scene from the map', `${(S.scenes || []).length} on the map`, () => enter('scene:prepared')),
      opt('🌄', 'The place', 'A new backdrop', () => enter('scene:place')),
      ws &&
        S.rules.type === 'adventure' &&
        opt('🚪', 'Add an exit', 'A way out to another prepared scene', () => {
          const x = { id: c.rid(), to: '', label: 'Exit', x: 0.9, y: 0.6, locked: false };
          d.exits.push(x);
          G.exit = x.id;
          enter('exit');
        }),
      opt('🌦️', 'The weather', 'Rain, fog, darkness…', () => enter('scene:weather')),
      opt('🎵', 'The music', '', () => enter('scene:music')),
      !ws && opt('🎬', 'A title card', '“Chapter 2”, “Later that night”', () => enter('scene:card')),
      !ws &&
        opt('🎲', 'A surprise scene', 'A ready-made place and cast', async () => {
          if (await c.randomScene()) done('A whole new scene');
        }),
      !ws && opt('💡', 'Give me an idea', 'A random story twist', () => c.idea()),
    ),
  );
  return;
}

export function screenScenePrepared(kit) {
  const { p, c, S, done, head } = kit;
  head('Go to a scene from the map', 'It replaces the place, the level and everything on stage except the hero.');
  const list = S.scenes || [];
  p.append(
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
      : h('p', { class: 'dim' }, 'The map is empty. Build a scene and add it to the map first.'),
    h('button', { onclick: () => c.workshop() }, '🏗️ Build scene'),
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
  p.append(
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
  p.append(
    chips(WEATHER, 'weather'),
    doneBtn(() => `Weather: ${(WEATHER.find((w) => w[0] === d.weather) || WEATHER[0])[1]}`),
  );
  return;
}

export function screenSceneMusic(kit) {
  const { p, c, d, head, doneBtn } = kit;
  head('The music', 'Click a tune to hear it. It keeps playing until you change it.');
  p.append(
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
  p.append(
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

/* ================= 🎥 camera ================= */
export function screenCamera(kit) {
  const { p, c, d, code, head, doneBtn } = kit;
  head('Camera', 'The yellow frame shows what the Player will see. The camera moves there when this step plays.');
  const z = d.cam ? d.cam.z : 1;
  const look = (x, y) => {
    d.cam = { x, y, z: d.cam ? d.cam.z : 2 };
    c.rebuild();
  };
  p.append(
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

/* ================= 📝 narrate ================= */
export function screenNarrate(kit) {
  const { p, c, d, head, doneBtn } = kit;
  head('Narrate', 'Appears under the stage in this step. For another line later, start the next step and narrate again.');
  p.append(
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

/* ================= ✏️ draw ================= */
export function screenDraw(kit) {
  const { p, c, d, head, doneBtn } = kit;
  head('Draw on the stage', 'Drag on the stage to draw. New lines draw themselves when the step plays.');
  p.append(
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
