/* Director screens: the main menu of a step, story settings, and "Tell Claude". */
import { assetLabel, assetUrl } from '../../core/catalog.js';
import { h, add } from '../../core/dom.js';
import { glyphNode, actionParts } from '../../stage/render.js';
import { G, short } from '../guided.js';

/* ================= root ================= */
export function screenRoot(kit) {
  const { p, c, d, S, code, lab, ws, setup, stepNo, enter, done, opt } = kit;
  if (!setup) {
    /* what the Player just did: read out like the log of an old adventure game */
    const parts = actionParts(d),
      hero = d.entities.find((e) => e.id === d.heroId);
    add(
      p,
      h(
        'div',
        { class: 'card told' },
        h(
          'div',
          { class: 'toldhead' },
          hero && glyphNode(code, hero.asset),
          h('b', {}, S.names.player),
          h('small', {}, parts.length ? 'last turn' : ''),
        ),
        parts.length
          ? parts.map(([kind, text]) => h('div', { class: 'toldrow ' + kind }, h('span', {}, kind), h('p', {}, text)))
          : h(
              'div',
              { class: 'toldrow none' },
              h('span', {}, '…'),
              h('p', {}, S.turn > 1 ? 'moved, and said nothing.' : 'has not done anything yet.'),
            ),
      ),
    );
    const tgt = d.target && d.entities.find((e) => e.id === d.target);
    if (tgt && c.mods().inventory)
      add(
        p,
        h(
          'div',
          { class: 'card ask' },
          h('b', {}, `${S.names.player} reaches for `, glyphNode(code, tgt.asset, 'mini'), ' — do they get it?'),
          h(
            'div',
            { class: 'row' },
            h(
              'button',
              {
                class: 'primary grow',
                onclick: () => {
                  const l = lab(tgt);
                  c.giveToPlayer(tgt);
                  done(`${S.names.player} takes ${l}`);
                },
              },
              'Yes, they take it',
            ),
            h(
              'button',
              {
                class: 'grow',
                onclick: () => {
                  d.target = null;
                  c.rebuild();
                },
              },
              'No',
            ),
          ),
        ),
      );
    const ex = d.exit && d.exits.find((x) => x.id === d.exit);
    if (ex)
      add(
        p,
        h(
          'div',
          { class: 'card ask' },
          h('b', {}, `${S.names.player} heads for “${ex.label}” — do they go through?`),
          h(
            'div',
            { class: 'row' },
            h(
              'button',
              {
                class: 'primary grow',
                id: 'travelYes',
                onclick: () => {
                  const doc = c.travelTo(ex.to);
                  if (doc) done(`Traveling to “${doc.name}”`);
                },
              },
              'Yes, travel there',
            ),
            h(
              'button',
              {
                class: 'grow',
                onclick: () => {
                  d.exit = null;
                  c.rebuild();
                },
              },
              'Not now',
            ),
          ),
        ),
      );
    if (d.battle)
      add(
        p,
        h(
          'div',
          { class: 'card ask' },
          h('b', {}, `Battle — round ${d.battle.round}`),
          h('button', { class: 'primary', id: 'battleOpen', onclick: () => enter('battle') }, 'Open the battle tools'),
        ),
      );
    const used = d.use && d.sheet.inv.find((i) => i.id === d.use);
    if (used)
      add(
        p,
        h(
          'div',
          { class: 'card ask' },
          h('b', {}, `${S.names.player} uses `, glyphNode(code, used.asset, 'mini'), ' — is it used up?'),
          h(
            'div',
            { class: 'row' },
            h(
              'button',
              {
                class: 'primary grow',
                onclick: () => {
                  d.sheet.inv = d.sheet.inv.filter((i) => i !== used);
                  d.use = null;
                  done(`${assetLabel(used.asset, used.name)} is used up`);
                },
              },
              'Yes, it is gone',
            ),
            h(
              'button',
              {
                class: 'grow',
                onclick: () => {
                  d.use = null;
                  c.rebuild();
                },
              },
              'No, they keep it',
            ),
          ),
        ),
      );
    if (S.rules.player === 'limited' && !d.choices.filter(Boolean).length && !d.ask)
      add(
        p,
        h(
          'div',
          { class: 'card ask' },
          h('b', {}, `Limited will: ${S.names.player} needs options`),
          h('p', { class: 'dim small' }, 'Write up to three things they may do next turn. Without options they can act freely.'),
          h('button', { class: 'primary', onclick: () => enter('ask') }, '? Decide what they may do'),
        ),
      );
  }
  add(
    p,
    h(
      'div',
      { class: 'gtitle' },
      h('b', {}, ws ? 'Things and scene' : setup ? 'Set the stage' : `Step ${stepNo} — what happens?`),
      h(
        'small',
        { class: 'dim' },
        ws
          ? 'Add things, make them solid or active, set the place, exits, weather and music.'
          : setup
            ? 'Build the opening scene, then begin.'
            : 'All of it plays at the same time.',
      ),
    ),
  );
  if (!ws && setup)
    add(p, h('div', { class: 'row' }, h('button', { class: 'grow', id: 'undoBtn', disabled: !c.canUndo(), onclick: () => c.undo() }, '↶ Undo')));
  const sheet = c.mods().inventory || c.mods().stats || c.mods().dice;
  add(
    p,
    h(
      'div',
      { class: 'gopts' },
      opt('plus', 'Add something', 'A character, a thing, an effect', () => enter('add')),
      !ws && opt('speech-bubble', 'Someone speaks', 'Give a character a line', () => enter('speak')),
      !ws && opt('boot', 'Move or animate', 'Walk, jump, record a path', () => enter('move')),
      !ws &&
        opt('scroll', 'Narrate', 'Tell what happens in words', () => {
          d.narration = '';
          enter('narrate');
        }),
      !ws && opt('explosion', 'Moment and sound', 'Shake, flash, boom, bell…', () => enter('moment')),
      opt('painting', 'Change the scene', 'Place, weather, music, title', () => enter('scene')),
      !ws && opt('pencil', 'Draw on the stage', 'Freehand, in colour', () => enter('draw')),
      !ws && opt('hammer', 'Build this room', 'Walls and floor in one press, save rooms', () => enter('room')),
      !ws && opt('map', 'Map & campaigns', `${(S.scenes || []).length} scenes — connect, copy, save the lot`, () => c.workshop({ map: true })),
      !ws && sheet && opt('backpack', `${S.names.player}’s sheet`, 'Items, stats, dice', () => enter('sheet')),
      !ws && opt('question', `Ask ${S.names.player}`, 'Choices, a roll, a place, a target…', () => enter('ask')),
      !ws && opt('camera', 'Camera', 'Zoom in on something', () => enter('camera')),
      !ws && c.mods().points && opt('star', 'Award points', `${d.sheet.points || 0} so far`, () => enter('award')),
      !ws &&
        S.rules.type === 'adventure' &&
        opt('sword', 'Battle', d.battle ? `Round ${d.battle.round}` : 'Enemies, attacks, damage', () => enter('battle')),
      !ws && opt('robot', 'Tell Claude', 'Describe it, Claude stages it', () => enter('claude')),
      opt('doll', 'Character maker', 'Build a person: head, body, arms, legs', () => c.dollMaker()),
      opt('paint-can', 'Sprite editor', 'Draw your own things, pixel by pixel', () => enter('add:own')),
      !ws && opt('cog', 'Story settings', 'Type, rules, time, invite', () => enter('rules')),
    ),
  );
  add(p, h('p', { class: 'dim small' }, 'Tip: click anything on the stage to change it, drag it to move it.'));
  if (G.log.length)
    add(
      p,
      h(
        'div',
        { class: 'card gevents' },
        h('small', { class: 'dim' }, `In step ${stepNo} so far`),
        G.log.map((l) => h('div', {}, '• ' + l)),
      ),
    );
  return;
}

/* ================= settings ================= */
export function screenRules(kit) {
  const { p, c, S, code, head, doneBtn } = kit;
  head('Story settings', 'These apply from now on.');
  const time = h(
    'select',
    { onchange: (ev) => c.act('settings', { turnSeconds: Number(ev.target.value) }, 3).catch((e) => c.toast(e.message)) },
    [
      [0, 'No time limit'],
      [30, '30 seconds'],
      [60, '1 minute'],
      [90, '1½ minutes'],
      [120, '2 minutes'],
      [180, '3 minutes'],
      [300, '5 minutes'],
      [600, '10 minutes'],
    ].map(([v, l]) => h('option', { value: v, selected: S.settings.turnSeconds === v }, l)),
  );
  const info = { title: S.info.title, text: S.info.text, image: S.info.image || '', onTop: !!S.info.onTop };
  let infoT = 0;
  const saveInfo = () => {
    clearTimeout(infoT);
    infoT = setTimeout(() => c.setInfo({ ...info }), 500);
  };
  add(
    p,
    c.typeCard(),
    h(
      'div',
      { class: 'card' },
      h('h3', {}, 'Title screen and instructions'),
      h('input', {
        id: 'infoTitle',
        placeholder: 'Title of your story',
        maxlength: 60,
        value: info.title,
        oninput: (ev) => {
          info.title = ev.target.value;
          saveInfo();
        },
      }),
      h(
        'textarea',
        {
          id: 'infoText',
          rows: 4,
          maxlength: 800,
          placeholder: 'A few lines for the Player: what the story is about, how to play, what the goal is…',
          oninput: (ev) => {
            info.text = ev.target.value;
            saveInfo();
          },
        },
        info.text,
      ),
      h(
        'p',
        { class: 'dim small' },
        'The Player sees this while you set the stage, the story opens on the title, and the instructions stay in their side panel.',
      ),
      /* a title card of your own: any picture you upload or draw fills the title screen */
      h('b', { class: 'actlab' }, 'Title picture'),
      h(
        'div',
        { class: 'grid', id: 'titlePics' },
        h(
          'button',
          {
            class: info.image ? '' : 'on',
            onclick: () => {
              info.image = '';
              saveInfo();
              c.rebuild();
            },
          },
          'None',
        ),
        S.assets.map((a) =>
          h(
            'button',
            {
              class: info.image === 'c:' + a.id ? 'on' : '',
              title: a.name,
              onclick: () => {
                info.image = 'c:' + a.id;
                saveInfo();
                c.rebuild();
              },
            },
            h('img', { src: assetUrl(code, 'c:' + a.id), alt: a.name, class: 'ownimg' }),
          ),
        ),
      ),
      c.maker('backdrop', (id) => {
        info.image = 'c:' + id;
        saveInfo();
        c.rebuild();
      }),
      h(
        'label',
        { class: 'row' },
        h('input', {
          type: 'checkbox',
          checked: info.onTop,
          onchange: (ev) => {
            info.onTop = ev.target.checked;
            saveInfo();
          },
        }),
        h('span', {}, 'The picture already holds the title: do not write it over the picture'),
      ),
    ),
    h(
      'div',
      { class: 'card' },
      h('h3', {}, 'Time per turn'),
      time,
      h('p', { class: 'dim small' }, 'Applies from the next turn. The clock pauses if either of you drops off.'),
    ),
    h(
      'div',
      { class: 'card' },
      h('h3', {}, `Story code: ${code}`),
      h(
        'div',
        { class: 'row' },
        h('button', { class: 'grow', onclick: c.shareLink }, S.bot || S.hotseat ? 'Let someone watch' : 'Copy invite link'),
        h('button', { class: 'grow', onclick: c.openStory }, 'Story so far'),
      ),
    ),
    h(
      'div',
      { class: 'row' },
      h(
        'button',
        {
          class: 'danger grow',
          onclick: () => {
            if (confirm('End the story?')) c.act('end', {}, 3).catch((e) => c.toast(e.message));
          },
        },
        'End the story',
      ),
      h('button', { class: 'grow', onclick: c.leave }, 'Leave to the start screen'),
    ),
    doneBtn(''),
  );
  return;
}

/* ================= Claude ================= */
export function screenClaude(kit) {
  const { p, c, S, done, head } = kit;
  head('Tell Claude what happens', 'Describe this step in your own words. Claude sets it up on the stage; you can still change it.');
  if (!S.claude) {
    add(
      p,
      h(
        'div',
        { class: 'card' },
        h('b', {}, 'Claude is not connected yet'),
        h(
          'p',
          { class: 'dim small' },
          'Whoever hosts this game needs to add an Anthropic API key (ANTHROPIC_API_KEY) to the server. Everything else works without it.',
        ),
      ),
    );
    return;
  }
  const ta = h(
    'textarea',
    {
      rows: 4,
      maxlength: 600,
      placeholder: 'e.g. “A dragon crashes through the wall, the wizard screams and runs off to the left, and it starts to rain.”',
    },
    G.ask,
  );
  ta.addEventListener('input', () => {
    G.ask = ta.value;
  });
  add(
    p,
    ta,
    h(
      'button',
      {
        class: 'primary gdone',
        disabled: G.busy,
        onclick: async () => {
          const text = ta.value.trim();
          if (!text) return ta.focus();
          G.busy = true;
          c.rebuild();
          try {
            const r = await c.act('claude', { text, scene: { ...c.draft, steps: [] } }, 1);
            const keep = c.draft;
            for (const k of Object.keys(r.scene)) if (!['steps', 'action', 'target', 'use', 'roll'].includes(k)) keep[k] = r.scene[k];
            G.note = r.note || 'Done.';
            G.busy = false;
            c.toast('' + G.note);
            return done(`${short(text, 40)}`);
          } catch (e) {
            c.toast(e.message);
          }
          G.busy = false;
          c.rebuild();
        },
      },
      G.busy ? 'Claude is setting the stage…' : 'Make it happen',
    ),
    h('p', { class: 'dim small' }, 'Not happy with the result? “Reset step” at the top undoes it.'),
  );
  return;
}
