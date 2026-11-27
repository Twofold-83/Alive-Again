/* Director screens: the main menu of a step, story settings, and "Tell Claude". */
import { assetLabel, assetUrl } from '../../core/catalog.js';
import { h, add } from '../../core/dom.js';
import { glyphNode, actionParts } from '../../stage/render.js';
import { G, short } from '../guided.js';

/* ================= the title screen: what the Player sees before the story begins ================= */
/** A small picture of the title screen as the Player will see it. */
function titlePreview(code, info) {
  const has = info.title || info.text || info.image;
  return h(
    'div',
    {
      class: 'titleprev' + (info.image ? ' pic' : ''),
      id: 'titlePreview',
      style: info.image ? `background-image:linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.6)), url("${assetUrl(code, info.image)}")` : '',
    },
    has
      ? [!(info.image && info.onTop) && h('b', {}, info.title || 'A new story'), info.text && h('p', {}, info.text)]
      : h('small', { class: 'dim' }, 'No title screen: the story opens straight on the stage.'),
  );
}
/** Title, instructions, a picture of your own: for the story, and kept with a campaign when it is saved. */
export function titleCard(kit, heading = 'Title screen and instructions', note = '') {
  const { c, S, code } = kit;
  const info = { title: S.info.title, text: S.info.text, image: S.info.image || '', onTop: !!S.info.onTop };
  let infoT = 0;
  const saveInfo = (now) => {
    clearTimeout(infoT);
    if (now) return c.setInfo({ ...info });
    infoT = setTimeout(() => c.setInfo({ ...info }), 500);
  };
  let preview = titlePreview(code, info);
  const typed = () => {
    const now = titlePreview(code, info); // the preview follows every letter
    preview.replaceWith(now);
    preview = now;
    saveInfo();
  };
  const pick = (image) => {
    info.image = image;
    if (!image) info.onTop = false;
    saveInfo(true);
    c.rebuild();
  };
  return h(
    'div',
    { class: 'card', id: 'titleCard' },
    h('h3', {}, heading),
    preview,
    h('input', {
      id: 'infoTitle',
      placeholder: 'Title of your story',
      maxlength: 60,
      value: info.title,
      oninput: (ev) => {
        info.title = ev.target.value;
        typed();
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
          typed();
        },
      },
      info.text,
    ),
    h(
      'p',
      { class: 'dim small' },
      note || 'The Player sees this while you set the stage, the story opens on the title, and the instructions stay in their side panel.',
    ),
    /* a title card of your own: any picture you upload or draw fills the title screen */
    h('b', { class: 'actlab' }, 'Title picture'),
    h(
      'div',
      { class: 'grid', id: 'titlePics' },
      h('button', { class: info.image ? '' : 'on', onclick: () => pick('') }, 'None'),
      S.assets
        .filter((a) => !a.part)
        .map((a) =>
          h(
            'button',
            { class: info.image === 'c:' + a.id ? 'on' : '', title: a.name, onclick: () => pick('c:' + a.id) },
            h('img', { src: assetUrl(code, 'c:' + a.id), alt: a.name, class: 'ownimg' }),
          ),
        ),
    ),
    c.maker('backdrop', (id) => pick('c:' + id)),
    info.image &&
      h(
        'label',
        { class: 'row' },
        h('input', {
          type: 'checkbox',
          checked: info.onTop,
          onchange: (ev) => {
            info.onTop = ev.target.checked;
            saveInfo(true);
            c.rebuild();
          },
        }),
        h('span', {}, 'The picture already holds the title: do not write it over the picture'),
      ),
  );
}

/* ================= preparing a campaign: save, save as, load ================= */
export function screenCampaign(kit) {
  const { p, c, S, head } = kit,
    cur = c.campaign.current(),
    all = c.campaign.all();
  head('Campaign', 'The whole map and the stage you are working on, kept on this device under a name.');
  const name = h('input', { id: 'campAsName', class: 'grow', placeholder: 'Name for a new campaign', maxlength: 40 });
  add(
    p,
    h(
      'div',
      { class: 'card' },
      h('h3', {}, cur ? `Working on “${cur.name}”` : 'Not saved yet'),
      h('p', { class: 'dim small' }, `${(S.scenes || []).length} scenes on the map. Saving puts the stage on the map too.`),
      h(
        'button',
        { id: 'campSaveCur', class: 'primary', disabled: !cur, title: cur ? '' : 'Give it a name first: Save as', onclick: () => c.campaign.save() },
        cur ? `Save “${short(cur.name, 22)}”` : 'Save',
      ),
      h(
        'div',
        { class: 'row' },
        name,
        h(
          'button',
          {
            id: 'campSaveAs',
            onclick: () => {
              const n = name.value.trim().slice(0, 40);
              if (!n) return c.toast('Type a name for the new campaign first');
              if (all.some((x) => x.name === n) && !confirm(`There is a campaign “${n}” already. Save over it?`)) return;
              c.campaign.save(n);
            },
          },
          'Save as',
        ),
      ),
    ),
    h(
      'div',
      { class: 'card', id: 'campList' },
      h('h3', {}, 'Load a campaign'),
      all.length
        ? all.map((x) =>
            h(
              'div',
              { class: 'row myroom' },
              h(
                'button',
                {
                  class: 'grow' + (cur && cur.id === x.id ? ' on' : ''),
                  title: 'Work on this campaign: its scenes become the map',
                  onclick: () => {
                    if ((S.scenes || []).length && !confirm(`Load “${x.name}”? The map of this story is replaced by it.`)) return;
                    c.campaign.load(x);
                  },
                },
                h('b', {}, x.name),
                h('small', { class: 'dim' }, ` ${x.scenes.length} scenes${c.campaign.hasTitle(x.title) ? ' · title screen' : ''}`),
              ),
              h(
                'button',
                {
                  title: 'Forget this campaign',
                  onclick: () => {
                    if (confirm(`Forget the campaign “${x.name}”?`)) c.campaign.forget(x);
                  },
                },
                '✕',
              ),
            ),
          )
        : h('small', { class: 'dim' }, 'No campaigns on this device yet.'),
    ),
    titleCard(
      kit,
      'Title screen of this campaign',
      'Saved with the campaign. A story that opens with this campaign opens on this title, and the Player keeps the instructions in their side panel.',
    ),
    h('p', { class: 'dim small' }, 'In a story, “Map & campaigns” puts a saved campaign on the map — and offers its title screen.'),
  );
}

/* ================= root ================= */
export function screenRoot(kit) {
  const { p, c, d, S, code, lab, setup, stepNo, enter, done, opt } = kit;
  const prep = S.prep && !S.testing, // a campaign is being prepared: no turns, nothing is played
    cur = prep ? c.campaign.current() : null;
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
    const wants = d.target || (d.point && d.point.verb === 'Pick up' && d.point.id), // reached for, or picked up from the Actions list
      tgt = wants && d.entities.find((e) => e.id === wants && e.id !== d.heroId);
    if (tgt && c.mods().inventory)
      add(
        p,
        h(
          'div',
          { class: 'card ask' },
          h('b', {}, `${S.names.player} ${d.target ? 'reaches for' : 'wants to pick up'} `, glyphNode(code, tgt.asset, 'mini'), ' — do they get it?'),
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
                  if (d.point && d.point.id === tgt.id) d.point = null;
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
          h('b', {}, d.battle.paused ? `The battle is paused — round ${d.battle.round}` : 'A battle begins when you end your turn'),
          h('small', { class: 'dim' }, 'Stage what you like; ending your turn gives the fight back.'),
          h('button', { id: 'battleOpen', onclick: () => enter('battle') }, 'Battle: difficulty, call it off'),
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
      h('b', {}, prep ? 'Prepare your campaign' : setup ? 'Set the stage' : `Step ${stepNo} — what happens?`),
      h(
        'small',
        { class: 'dim' },
        prep
          ? 'Build scenes, keep them on the map, save — and test them as the Player.'
          : setup
            ? 'Build the opening scene, then begin.'
            : 'All of it plays at the same time.',
      ),
    ),
  );
  if (setup)
    add(p, h('div', { class: 'row' }, h('button', { class: 'grow', id: 'undoBtn', disabled: !c.canUndo(), onclick: () => c.undo() }, '↶ Undo')));
  const sheet = c.mods().inventory || c.mods().stats || c.mods().dice;
  add(
    p,
    h(
      'div',
      { class: 'gopts' },
      prep &&
        opt('book-red', 'Campaign', cur ? `Working on “${short(cur.name, 20)}” — save, save as, load` : 'Not saved yet — save, save as, load', () =>
          enter('campaign'),
        ),
      opt('plus', 'Add something', 'A character, a thing, an effect', () => enter('add')),
      opt('speech-bubble', 'Someone speaks', 'Give a character a line', () => enter('speak')),
      opt('boot', 'Move or animate', 'Walk, jump, record a path', () => enter('move')),
      opt('scroll', 'Narrate', 'Tell what happens in words', () => {
        d.narration = '';
        enter('narrate');
      }),
      opt('explosion', 'Moment and sound', 'Shake, flash, boom, bell…', () => enter('moment')),
      opt('rain-cloud', 'Mood', 'Light and dark, weather, music, title', () => enter('scene')),
      opt('pencil', 'Draw on the stage', 'Freehand, in colour', () => enter('draw')),
      opt('hammer', 'Build this room', 'Walls and floor in one press, paint tiles', () => enter('room')),
      opt('floppy-disk', 'Save room', 'Keep this room for any story, bring a saved one back', () => enter('saveroom')),
      opt('map', 'Map & campaigns', `${(S.scenes || []).length} scenes — connect, copy, save the lot`, () => c.map()),
      sheet && opt('backpack', `${S.names.player}’s sheet`, 'Items, stats, dice', () => enter('sheet')),
      opt('question', `Ask ${S.names.player}`, 'Choices, a roll, a place, a target…', () => enter('ask')),
      opt('camera', 'Camera', 'Zoom in on something', () => enter('camera')),
      c.mods().points && opt('star', 'Award points', `${d.sheet.points || 0} so far`, () => enter('award')),
      S.rules.type === 'adventure' &&
        opt('sword', 'Battle', d.battle ? `Paused in round ${d.battle.round}` : 'Pick the enemies and how hard it is', () => enter('battle')),
      opt('robot', 'Tell Claude', 'Describe it, Claude stages it', () => enter('claude')),
      opt('doll', 'Character maker', 'Build a person: head, body, arms, legs', () => c.dollMaker()),
      opt('paint-can', 'Sprite editor', 'Draw your own things, pixel by pixel', () => enter('add:own')),
      opt('cog', 'Story settings', 'Type, rules, time, invite', () => enter('rules')),
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
  add(
    p,
    c.typeCard(),
    titleCard(kit),
    h(
      'div',
      { class: 'card', id: 'playCard' },
      h('h3', {}, 'While you play'),
      h(
        'label',
        { class: 'row' },
        h('input', {
          type: 'checkbox',
          id: 'keepSets',
          checked: !!S.settings.keepSets,
          onchange: (ev) => {
            S.settings.keepSets = ev.target.checked;
            c.act('settings', { keepSets: ev.target.checked }, 3).catch((e) => c.toast(e.message));
          },
        }),
        h(
          'span',
          {},
          h('b', {}, 'Saved stage-sets'),
          ' — every place keeps what happened in it: a fridge left open is still open when the story comes back',
        ),
      ),
      h(
        'label',
        { class: 'row' },
        h('input', {
          type: 'checkbox',
          id: 'actLine',
          checked: S.settings.actLine !== false,
          onchange: (ev) => {
            S.settings.actLine = ev.target.checked;
            c.act('settings', { actLine: ev.target.checked }, 3).catch((e) => c.toast(e.message));
            c.rebuild();
          },
        }),
        h('span', {}, h('b', {}, 'The orange line on top'), ` — what ${S.names.player} did, written across the top of the stage`),
      ),
    ),
    h(
      'div',
      { class: 'card', id: 'saveGameCard' },
      h('h3', {}, 'Save the game'),
      h(
        'p',
        { class: 'dim small' },
        'Taking a break? Save the game as it stands — the stage, the map, the sheet, the title, every picture of your own — and go on with it another day from the start screen. (This is not the same as saving a prepared campaign.)',
      ),
      (() => {
        const name = h('input', {
          id: 'saveGameName',
          class: 'grow',
          maxlength: 40,
          placeholder: S.info.title || 'Name of the save',
          value: S.info.title || '',
        });
        const go = (toFile) => c.saveGame(name.value.trim() || S.info.title || 'Saved game', toFile).catch((e) => c.toast(e.message));
        return h(
          'div',
          { class: 'col' },
          name,
          h(
            'div',
            { class: 'row' },
            h('button', { id: 'saveGameBtn', class: 'primary grow', onclick: () => go(false) }, 'Save on this device'),
            h('button', { id: 'saveGameFile', class: 'grow', onclick: () => go(true) }, 'Save as a file'),
          ),
        );
      })(),
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
