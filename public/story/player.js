/* The Player's controls under the tool column: speak, act, point, walk, answer, roll, end the turn.
 * (The Director's side of the same footer is just the button that ends the turn.) */
import { isDoll, poseEditor } from '../core/dolls.js';
import { openDollMaker } from '../build/dollmaker.js';
import { assetLabel, assetUrl } from '../core/catalog.js';
import { h, add } from '../core/dom.js';
import { openCheck } from './dice.js';
import { livingFoes, heroHealth, weaponOf, itemHeals } from '../shared/battle.js';
import { glyphNode } from '../stage/render.js';
import { EMOTES } from '../shared/options.js';
import { $ } from '../core/dom.js';
import { myTurn, other, hero, mods, app } from '../core/state.js';
import { saveDraft, changedQuiet, rebuild, submit } from './turn.js';
import { walkHero, undoWalk, setReply } from './walk.js';
import { render } from './view.js';
import { openStory } from './viewer.js';
import { leave } from '../shell/home.js';

/* ---------- footer: what I say / narrate, and the End turn button ---------- */
/** A picture the Director shows: over the whole stage; a click closes it — and, if the Director said so, ends the turn. */
function showPicture(ask) {
  let el = document.querySelector('#picture');
  if (!el) document.body.append((el = h('div', { id: 'picture' })));
  el.hidden = false;
  el.replaceChildren(
    h('img', { src: assetUrl(app.code, ask.image), alt: '' }),
    ask.text ? h('p', {}, ask.text) : '',
    h('small', {}, 'Click to go on'),
  );
  el.onclick = () => {
    el.hidden = true;
    el.replaceChildren();
    setReply({ seen: true });
    saveDraft();
    if (ask.back) return submit();
    rebuild();
  };
}
/** The card for a roll the Director asked for; what the Player decided goes into the draft. */
function check(ask) {
  if (document.querySelector('#check:not([hidden])')) return;
  openCheck(ask, (r) => {
    if (r.rolled) {
      if (app.draft.ask) app.draft.ask.rolled = r.rolled;
      setReply({ roll: true });
      saveDraft();
      return submit(); // rolled: the Director takes over at once
    }
    setReply({ decline: true });
    saveDraft();
    rebuild();
  });
}

export function buildFoot() {
  const f = $('#foot');
  f.replaceChildren();
  f.classList.remove('tight');
  const tl = () => h('span', { id: 'tlabel' });
  const side = app.S.hotseat ? (app.S.whose === 'director' ? 'Director' : 'Player') + '’s ' : '';
  if (app.S.ended)
    return void add(
      f,
      h('button', { class: 'go primary', onclick: openStory }, 'Read the story'),
      h('button', { class: 'link', onclick: () => leave() }, 'Start a new story'),
    );
  if (app.S.you === 'spectator') return void add(f, h('div', { class: 'status' }, `${app.S.names[app.S.whose]}'s turn`, tl()));
  if (!myTurn())
    return void add(f, h('div', { class: 'status' }, `Waiting for ${app.S.joined[other()] ? app.S.names[other()] : 'your partner'}`, tl()));
  if (app.submitting) return void add(f, h('div', { class: 'status' }, 'Sending…'));
  if (app.S.you === 'director') {
    const ready = app.S.joined.player;
    add(
      f,
      h(
        'button',
        { class: 'go primary', disabled: !ready, onclick: submit },
        ready ? (app.S.turn === 0 ? 'Begin the story ▶' : `End ${side}turn ▶`) : 'Waiting for your Player to join…',
        tl(),
      ),
    );
    f.classList.add('tight');
  } else {
    const me = hero(app.draft),
      mode = app.S.rules.player;
    const dice =
      mods().dice &&
      h(
        'button',
        {
          class: 'dice' + (app.draft.rollWant ? ' on' : ''),
          title: 'Roll a die with this turn',
          onclick: () => {
            app.draft.rollWant = app.draft.rollWant === 0 ? 6 : app.draft.rollWant === 6 ? 20 : 0;
            rebuild();
          },
        },
        app.draft.rollWant ? `d${app.draft.rollWant}` : 'Die',
      );
    const walkBtn =
      mode !== 'tell' &&
      me &&
      (app.draft.walked
        ? h('button', { id: 'walkBtn', class: 'grow', onclick: undoWalk }, '↶ Take the walk back')
        : h(
            'button',
            {
              id: 'walkBtn',
              class: 'grow' + (app.walkMode ? ' recording' : ''),
              onclick: () => {
                app.walkMode = !app.walkMode;
                app.pointMode = false;
                render();
              },
            },
            app.walkMode ? 'Click on the stage where to go…' : 'Walk',
          ));
    const end = (off) =>
      h('div', { class: 'row' }, dice, h('button', { class: 'go primary grow', disabled: !!off, onclick: submit }, `End ${side}turn ▶`, tl()));
    const pointed = () => {
      const pt = app.draft.point,
        e = pt && pt.id && app.draft.entities.find((x) => x.id === pt.id);
      return e ? (e.active ? e.active.name : assetLabel(e.asset)) : 'that spot';
    };
    /* a paper-doll hero: strike a pose by dragging the limbs, or decide how the hero looks */
    const dollRow = () =>
      mode !== 'tell' &&
      me &&
      h(
        'div',
        { class: 'row', id: 'dollRow' },
        isDoll(me.asset) &&
          h(
            'button',
            {
              id: 'poseBtn',
              class: 'grow' + (app.poseOpen ? ' on' : ''),
              onclick: () => {
                app.poseOpen = !app.poseOpen;
                rebuild();
              },
            },
            'Act',
          ),
        h(
          'button',
          {
            id: 'lookBtn',
            class: 'grow',
            onclick: () =>
              openDollMaker({
                title: 'Your character',
                asset: isDoll(me.asset) ? me.asset : null,
                pose: me.pose,
                actions: [
                  {
                    label: 'This is me',
                    primary: true,
                    run: (asset, pose) => {
                      me.asset = asset;
                      me.pose = pose;
                      app.draft.look = asset;
                      rebuild();
                    },
                  },
                ],
              }),
          },
          isDoll(me.asset) ? 'Change my look' : 'Make my character',
        ),
      );
    const poser = () =>
      app.poseOpen &&
      me &&
      isDoll(me.asset) &&
      poseEditor(
        me.asset,
        me.pose,
        (pose) => {
          me.pose = pose;
          changedQuiet();
        },
        {
          feel: me.feel,
          onFeel: (feel) => {
            me.feel = feel;
            changedQuiet();
          },
        },
      );
    const pointRow = () =>
      app.S.rules.type === 'adventure' &&
      h(
        'div',
        { class: 'row', id: 'pointRow' },
        h(
          'button',
          {
            id: 'pointBtn',
            class: 'grow' + (app.pointMode ? ' recording' : app.draft.point ? ' on' : ''),
            title: 'Tie what you wrote to something on the stage',
            onclick: () => {
              app.pointMode = !app.pointMode;
              app.walkMode = false;
              render();
            },
          },
          app.pointMode
            ? 'Click a thing or a spot on the stage…'
            : app.draft.point
              ? `→ ${pointed()} — click to point at something else`
              : '→ Point at something on the stage',
        ),
        app.draft.point &&
          h(
            'button',
            {
              id: 'pointClear',
              title: 'Point at nothing',
              onclick: () => {
                app.draft.point = null;
                if (app.draft.action === 'Look at') app.draft.action = '';
                rebuild();
              },
            },
            '✕',
          ),
      );
    const say = () =>
      h('input', {
        id: 'sayInput',
        placeholder: 'Say something…',
        maxlength: 160,
        value: me ? me.say : '',
        disabled: !me,
        enterkeyhint: 'next',
        oninput: (ev) => {
          me.say = ev.target.value;
          changedQuiet();
        },
      });
    const pick = () =>
      h(
        'div',
        { class: 'chips wrap choices' },
        app.draft.choices.map((c) =>
          h(
            'button',
            {
              class: app.draft.action === c ? 'on' : '',
              onclick: () => {
                app.draft.action = app.draft.action === c ? '' : c;
                rebuild();
              },
            },
            c,
          ),
        ),
      );
    const ask = app.draft.ask,
      rp = app.draft.reply || {};
    let asked = null,
      answered = true;
    if (ask && mode !== 'tell') {
      // the Director asked for something specific
      const opt = (label, on, fn) =>
        h(
          'button',
          {
            class: on ? 'on' : '',
            onclick: () => {
              fn();
              rebuild();
            },
          },
          label,
        );
      const lab = (id) => {
        const e = app.draft.entities.find((x) => x.id === id);
        return e ? (e.active ? e.active.name : glyphNode(app.code, e.asset, 'mini')) : '?';
      };
      let body;
      if (ask.kind === 'image') {
        /* a picture from the Director: it fills the stage until it is clicked */
        answered = !!rp.seen;
        body = opt(rp.seen ? 'Look at the picture again' : 'Look at the picture', false, () => showPicture(ask));
        if (!rp.seen && app.pictureSeen !== app.S.turn) {
          app.pictureSeen = app.S.turn;
          setTimeout(() => showPicture(ask), 350);
        }
      } else if (ask.kind === 'roll') {
        /* the die falls at once: the Player sees the number, and whether it was enough */
        const got = ask.rolled;
        answered = !!got;
        body = got
          ? h(
              'div',
              { id: 'rolled', class: 'rolled ' + (!ask.dc ? '' : got.value >= ask.dc ? 'good' : 'bad') },
              h('b', {}, String(got.value)),
              h(
                'span',
                {},
                !ask.dc
                  ? `You rolled ${got.value} on the d${got.sides}.`
                  : got.value >= ask.dc
                    ? `Success! You needed ${ask.dc} or more.`
                    : `Failed. You needed ${ask.dc} or more.`,
              ),
            )
          : opt(
              rp.decline ? 'You backed out — roll after all?' : `Roll the d${ask.sides}${ask.dc ? ` — you need ${ask.dc} or more` : ''}`,
              false,
              () => check(ask),
            );
        if (rp.decline) answered = true;
        /* the turn opens on the skill check card, once */
        if (!got && !rp.decline && app.checkSeen !== app.S.turn) {
          app.checkSeen = app.S.turn;
          setTimeout(() => check(ask), 350);
        }
      } else if (ask.kind === 'discard') {
        answered = !!rp.id || !app.draft.sheet.inv.length;
        body = app.draft.sheet.inv.length
          ? app.draft.sheet.inv.map((it) =>
              opt(glyphNode(app.code, it.asset, 'mini'), rp.id === it.id, () => {
                setReply({ id: it.id });
              }),
            )
          : h('span', { class: 'dim' }, 'You have nothing to give up.');
      } else if (ask.kind === 'place') {
        answered = rp.index != null;
        body = ask.places.map((pl, i) =>
          opt(pl.label, rp.index === i, () => {
            setReply({ index: i });
            if (!app.draft.walked) setTimeout(() => walkHero(pl.x, pl.y), 0);
          }),
        );
      } else if (ask.kind === 'target') {
        answered = !!rp.id;
        body = ask.targets.map((id) =>
          opt(lab(id), rp.id === id, () => {
            setReply({ id });
          }),
        );
      } else if (app.draft.battle && typeof app.draft.battle.auto === 'boolean') {
        /* a battle with rules: Attack, Defend, Item, Escape, Speak — whatever the Director allowed */
        const b = app.draft.battle,
          foes = livingFoes(app.draft),
          hp = heroHealth(app.draft),
          weapon = weaponOf(app.draft),
          pick = app.battleMenu || '';
        answered = !!rp.move;
        const menu = (id) => () => {
          app.battleMenu = app.battleMenu === id ? '' : id;
          rebuild();
        };
        const cmd = {
          attack: () =>
            opt(
              weapon ? 'Attack (armed)' : 'Attack',
              rp.move === 'attack' || pick === 'attack',
              foes.length === 1 ? () => (setReply({ move: 'attack', id: foes[0].id }), (app.battleMenu = '')) : menu('attack'),
            ),
          defend: () =>
            opt('Defend', rp.move === 'defend', () => {
              app.battleMenu = '';
              setReply({ move: 'defend' });
            }),
          item: () => opt(`Item (${app.draft.sheet.inv.length})`, rp.move === 'item' || pick === 'item', menu('item')),
          escape: () =>
            opt(`Escape (${b.flee}%)`, rp.move === 'escape', () => {
              app.battleMenu = '';
              setReply({ move: 'escape' });
            }),
          speak: () =>
            opt(
              'Speak',
              rp.move === 'speak' || pick === 'speak',
              foes.length === 1
                ? () => (
                    setReply({ move: 'speak', id: foes[0].id }),
                    (app.battleMenu = ''),
                    setTimeout(() => $('#sayInput') && $('#sayInput').focus(), 50)
                  )
                : menu('speak'),
            ),
        };
        body = [
          h(
            'div',
            { class: 'battlehud', id: 'battleHud' },
            h(
              'div',
              { class: 'bar hero' },
              h('b', {}, app.S.names.player),
              h('span', {}, `${hp.get()} / ${hp.max}`),
              h('i', { style: `width:${(hp.get() / (hp.max || 1)) * 100}%` }),
            ),
            foes.map((e) =>
              h(
                'div',
                { class: 'bar foe' },
                h('b', {}, lab(e.id)),
                h('span', {}, `${e.hp} / ${e.maxHp}`),
                h('i', { style: `width:${(e.hp / (e.maxHp || 1)) * 100}%` }),
              ),
            ),
          ),
          h(
            'div',
            { class: 'battlecmds' },
            b.cmds.map((k) => cmd[k]()),
          ),
          (pick === 'attack' || pick === 'speak') &&
            h(
              'div',
              { class: 'battlepick' },
              foes.map((e) =>
                opt([pick === 'attack' ? 'Attack ' : 'Speak to ', lab(e.id)], rp.id === e.id && rp.move === pick, () => {
                  setReply({ move: pick, id: e.id });
                  app.battleMenu = '';
                }),
              ),
            ),
          pick === 'item' &&
            h(
              'div',
              { class: 'battlepick' },
              app.draft.sheet.inv.length
                ? app.draft.sheet.inv.map((it) =>
                    opt(
                      [glyphNode(app.code, it.asset, 'mini'), ` ${it.name || ''} — ${itemHeals(it) ? 'heals you' : 'throw it'}`],
                      rp.item === it.id,
                      () => {
                        setReply({ move: 'item', item: it.id, id: foes[0] && foes[0].id });
                        app.battleMenu = '';
                      },
                    ),
                  )
                : h('small', { class: 'dim' }, 'You carry nothing.'),
            ),
          b.log.length > 0 &&
            h(
              'div',
              { class: 'battlelog' },
              b.log.slice(-4).map((l) => h('p', {}, l)),
            ),
        ].filter(Boolean);
      } else {
        answered = !!rp.move;
        body = [
          ...app.draft.entities
            .filter((e) => e.hp != null && e.id !== app.draft.heroId)
            .map((e) =>
              opt(['Attack ', lab(e.id)], rp.move === 'attack' && rp.id === e.id, () => {
                setReply({ move: 'attack', id: e.id });
              }),
            ),
          opt('Defend', rp.move === 'defend', () => {
            setReply({ move: 'defend' });
          }),
          opt('Flee', rp.move === 'flee', () => {
            setReply({ move: 'flee' });
          }),
        ];
      }
      const def = {
        roll: 'Roll the die.',
        image: 'A picture',
        discard: 'Give up one of your things.',
        place: 'Where do you go?',
        target: `${ask.verb || 'Choose'} — who or what?`,
        battle: 'Battle! What do you do?',
      }[ask.kind];
      asked = h('div', { class: 'askbox' }, h('b', {}, ask.text || def), h('div', { class: 'chips wrap choices' }, body));
    }
    const must = mode === 'limited' && ask && ask.kind !== 'battle' && !answered;
    if (mode === 'tell') {
      // narration: only words; the Director stages them
      const ta = h(
        'textarea',
        { id: 'tellBox', rows: 3, maxlength: 300, placeholder: `What do you want to do? ${app.S.names.director} will make it happen.` },
        app.draft.action,
      );
      ta.addEventListener('input', () => {
        app.draft.action = ta.value;
        saveDraft();
      });
      add(f, ta, pointRow(), end());
    } else if (mode === 'limited' && app.draft.choices.length) {
      // limited will: one of the Director's options
      add(
        f,
        h('div', { class: 'dim small' }, `Choose what you do — ${app.S.names.director} decided the options:`),
        pick(),
        asked,
        say(),
        dollRow(),
        poser(),
        walkBtn,
        end(!app.draft.choices.includes(app.draft.action) || must),
      );
    } else if (mode === 'limited' && ask) {
      // limited will: do exactly what was asked
      add(f, asked, say(), ask.kind === 'place' ? null : walkBtn, end(must));
    } else {
      if (asked) add(f, asked);
      if (app.draft.choices.length) add(f, pick());
      if (me)
        add(
          f,
          h(
            'div',
            { class: 'chips emotes' },
            EMOTES.slice(0, 8).map((e) =>
              h(
                'button',
                {
                  class: me.emote === e ? 'on' : '',
                  'aria-label': 'Emote ' + e,
                  onclick: () => {
                    me.emote = me.emote === e ? '' : e;
                    rebuild();
                  },
                },
                e,
              ),
            ),
          ),
        );
      add(
        f,
        say(),
        h('input', {
          placeholder: 'Do something… (“open the drawer”)',
          maxlength: 160,
          value: app.draft.action,
          enterkeyhint: 'done',
          oninput: (ev) => {
            app.draft.action = ev.target.value;
            changedQuiet();
          },
        }),
        pointRow(),
        dollRow(),
        poser(),
        walkBtn,
        end(),
      );
    }
  }
}
