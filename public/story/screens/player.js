/* Director screens about the Player: what to ask of them, points, their sheet, giving items, battles. */
import { assetUrl } from '../../core/catalog.js';
import { BATTLE_CMDS, WEAPON } from '../../shared/battle.js';
import { h, clamp, add } from '../../core/dom.js';
import { glyphNode } from '../../stage/render.js';
import { G } from '../guided.js';

/* ================= ? choices ================= */
/* ================= ? ask the Player: exactly what they may do next turn ================= */
export function screenAsk(kit) {
  const { p, c, d, S, code, head, opt, doneBtn } = kit;
  const kind = d.ask ? d.ask.kind : d.choices.filter(Boolean).length ? 'choice' : '';
  const mk = (k) => ({
    kind: k,
    image: '',
    back: false,
    text: d.ask ? d.ask.text : '',
    sides: 6,
    dc: 0,
    verb: k === 'target' ? 'Attack' : '',
    places: [],
    targets: [],
  });
  const set = (k) => {
    if (k === 'choice' || !k) {
      d.ask = null;
      if (!k) d.choices = [];
      else for (let n = 0; n < 3; n++) d.choices[n] ||= '';
    } else {
      d.ask = mk(k);
      d.choices = [];
    }
    G.askKind = k;
    c.rebuild();
  };
  const cur = d.ask ? kind : G.askKind === 'choice' ? 'choice' : kind;
  head(
    `What may ${S.names.player} do next turn?`,
    S.rules.player === 'limited' ? 'Limited will: they must do this.' : 'Free will: this is offered, they may still do something else.',
  );
  add(
    p,
    h(
      'div',
      { class: 'gopts' },
      opt('button', 'Pick one of these', 'Up to three choices', () => set('choice'), cur === 'choice'),
      opt('dice', 'Roll a die', 'd6 or d20, with a number to reach', () => set('roll'), cur === 'roll'),
      opt('painting', 'Show a picture', 'A cut scene: they click it and go on', () => set('image'), cur === 'image'),
      opt('map-pin', 'Go to a place', 'Mark places on the stage', () => set('place'), cur === 'place'),
      opt('archery-target', 'Pick a target', 'Who to attack, talk to, save…', () => set('target'), cur === 'target'),
      c.mods().inventory && opt('cross-box', 'Give up an item', 'Discard one thing they carry', () => set('discard'), cur === 'discard'),
      opt('cross', 'Nothing special', 'Clear the request', () => set(''), !cur),
    ),
  );
  const a = d.ask;
  if (cur && cur !== 'choice')
    add(
      p,
      h('input', {
        id: 'askText',
        placeholder:
          cur === 'roll'
            ? 'What is the check for? — “Picking the lock”'
            : cur === 'image'
              ? 'A line under the picture (optional)'
              : 'Your question or instruction (optional)',
        maxlength: 120,
        value: a.text,
        oninput: (ev) => {
          a.text = ev.target.value;
          c.changedQuiet();
        },
      }),
    );
  if (cur === 'choice') {
    const inp = (i) =>
      h('input', {
        placeholder: `Choice ${i + 1}`,
        maxlength: 40,
        value: d.choices[i] || '',
        oninput: (ev) => {
          for (let k = 0; k < 3; k++) d.choices[k] ||= '';
          d.choices[i] = ev.target.value;
          c.changedQuiet();
        },
      });
    add(p, inp(0), inp(1), inp(2));
  } else if (cur === 'image') {
    /* a picture of your own: uploaded, generated or drawn */
    const pics = S.assets.filter((x) => !x.part);
    add(
      p,
      h('small', { class: 'dim' }, 'Which picture?'),
      h(
        'div',
        { class: 'grid', id: 'askPics' },
        pics.map((x) =>
          h(
            'button',
            {
              class: a.image === 'c:' + x.id ? 'on' : '',
              title: x.name,
              onclick: () => {
                a.image = 'c:' + x.id;
                c.rebuild();
              },
            },
            h('img', { src: assetUrl(code, 'c:' + x.id), alt: x.name, class: 'ownimg' }),
          ),
        ),
      ),
      c.maker('backdrop', (id) => {
        a.image = 'c:' + id;
        c.rebuild();
      }),
      h('small', { class: 'dim' }, 'After they click it'),
      h(
        'div',
        { class: 'row' },
        h(
          'button',
          { id: 'picPlay', class: 'grow' + (!a.back ? ' on' : ''), onclick: () => ((a.back = false), c.rebuild()) },
          `${S.names.player} plays on`,
        ),
        h('button', { id: 'picBack', class: 'grow' + (a.back ? ' on' : ''), onclick: () => ((a.back = true), c.rebuild()) }, 'Straight back to me'),
      ),
    );
  } else if (cur === 'roll') {
    add(
      p,
      h(
        'div',
        { class: 'row' },
        [6, 20].map((n) =>
          h(
            'button',
            {
              class: 'grow' + (a.sides === n ? ' on' : ''),
              onclick: () => {
                a.sides = n;
                a.dc = Math.min(a.dc, n);
                c.rebuild();
              },
            },
            `d${n}`,
          ),
        ),
      ),
      h('small', { class: 'dim' }, 'They succeed on…'),
      h(
        'div',
        { class: 'chips wrap' },
        [0, ...(a.sides === 6 ? [2, 3, 4, 5, 6] : [5, 8, 10, 12, 15, 18])].map((n) =>
          h(
            'button',
            {
              'data-dc': n,
              class: a.dc === n ? 'on' : '',
              onclick: () => {
                a.dc = n;
                c.rebuild();
              },
            },
            n ? `${n} or more` : 'any roll',
          ),
        ),
      ),
    );
  } else if (cur === 'place') {
    add(
      p,
      a.places.map((pl, i) =>
        h(
          'div',
          { class: 'row' },
          h('input', {
            maxlength: 30,
            value: pl.label,
            oninput: (ev) => {
              pl.label = ev.target.value;
              c.changedQuiet();
            },
          }),
          h(
            'button',
            {
              onclick: () => {
                a.places.splice(i, 1);
                c.rebuild();
              },
            },
            '✕',
          ),
        ),
      ),
      h(
        'button',
        {
          id: 'addPlace',
          disabled: a.places.length >= 6,
          onclick: () => {
            a.places.push({ label: `Place ${a.places.length + 1}`, x: 0.2 + 0.2 * a.places.length, y: 0.7 });
            c.rebuild();
          },
        },
        '＋ Add a place',
      ),
      h('p', { class: 'dim small' }, 'Drag the markers on the stage to where they belong.'),
    );
  } else if (cur === 'target') {
    add(
      p,
      h('input', {
        placeholder: 'What for? e.g. Attack, Talk to, Rescue',
        maxlength: 20,
        value: a.verb,
        oninput: (ev) => {
          a.verb = ev.target.value;
          c.changedQuiet();
        },
      }),
      h('small', { class: 'dim' }, 'Who or what can be picked?'),
      h(
        'div',
        { class: 'grid' },
        d.entities
          .filter((e) => e.id !== d.heroId)
          .map((e) =>
            h(
              'button',
              {
                class: a.targets.includes(e.id) ? 'on' : '',
                onclick: () => {
                  a.targets = a.targets.includes(e.id) ? a.targets.filter((x) => x !== e.id) : [...a.targets, e.id];
                  c.rebuild();
                },
              },
              glyphNode(code, e.asset),
            ),
          ),
      ),
    );
  } else if (cur === 'discard')
    add(p, h('p', { class: 'dim small' }, `${S.names.player} will choose one of their ${d.sheet.inv.length} item(s) to give up.`));
  add(
    p,
    doneBtn(() =>
      cur
        ? `${S.names.player} is asked: ${{ choice: 'pick a choice', roll: 'roll a die', image: 'look at a picture', place: 'go to a place', target: 'pick a target', discard: 'give up an item' }[cur]}`
        : '',
    ),
  );
  return;
}

/* ================= * points ================= */
export function screenAward(kit) {
  const { p, c, d, S, head, doneBtn } = kit;
  head('Award points', `${S.names.player} has ${d.sheet.points || 0} points.`);
  const give = (n) => {
    const was = d.award ? d.award.n : 0;
    d.sheet.points = (d.sheet.points || 0) - was + n;
    d.award = n ? { n, text: d.award ? d.award.text : '' } : null;
    c.rebuild();
  };
  add(
    p,
    h(
      'div',
      { class: 'chips wrap' },
      [0, 1, 5, 10, 25, 50, -5].map((n) =>
        h(
          'button',
          { 'data-pts': n, class: (d.award ? d.award.n : 0) === n ? 'on' : '', onclick: () => give(n) },
          n ? `${n > 0 ? '+' : ''}${n}` : 'None',
        ),
      ),
    ),
    d.award &&
      h('input', {
        placeholder: 'What for? (shown to the Player)',
        maxlength: 60,
        value: d.award.text,
        oninput: (ev) => {
          d.award.text = ev.target.value;
          c.changedQuiet();
        },
      }),
    doneBtn(() => (d.award ? `${d.award.n > 0 ? '+' : ''}${d.award.n} points` : '')),
  );
  return;
}

/* ================= battle ================= */
export function screenBattle(kit) {
  const { p, c, d, S, code, me, lab, setup, home, head } = kit;
  const foes = d.entities.filter((e) => e.hp != null && e.id !== d.heroId);
  const hpStat = c.mods().stats && d.sheet.stats.find((st) => /health|hp|life/i.test(st.name));
  const heroHp = () => (hpStat ? hpStat.value : me && me.hp != null ? me.hp : null);
  const hurtHero = (n) => {
    if (hpStat) hpStat.value = clamp(hpStat.value - n, 0, hpStat.max ?? 9999);
    else if (me) {
      if (me.hp == null) {
        me.hp = 5;
        me.maxHp = 5;
      }
      me.hp = clamp(me.hp - n, 0, me.maxHp);
    }
  };
  const float = (id, text, col) => {
    d.floats = d.floats.filter((f) => f.id !== id);
    d.floats.push({ id, text, c: col });
  };
  const held = (who) => d.entities.filter((e) => e.tie && e.tie.to === who.id); // a tied sword swings with its owner
  const lunge = (a, b) => {
    if (!a || !b) return;
    const mx = a.x + (b.x - a.x) * 0.7,
      my = a.y + (b.y - a.y) * 0.7,
      ox = a.x,
      oy = a.y;
    c.autoTrack(a, [
      [220, mx, my],
      [120, mx, my],
      [260, ox, oy],
    ]);
  };
  if (!d.battle) {
    head('Start a battle', 'Pick the enemies. The Player then chooses a move each turn, and you get tools for attacks, damage and checks.');
    G.foes ||= [];
    G.hp ||= 5;
    G.bt ||= { auto: true, atk: 2, foeAtk: 1, heroHp: 8, flee: 50, cmds: BATTLE_CMDS.map((x) => x[0]) };
    const bt = G.bt;
    const chips = (label, key, values, fmt = String) =>
      h(
        'div',
        {},
        h('small', { class: 'dim' }, label),
        h(
          'div',
          { class: 'row' },
          values.map((n) =>
            h(
              'button',
              {
                [`data-${key.toLowerCase()}`]: n,
                class: 'grow' + (bt[key] === n ? ' on' : ''),
                onclick: () => {
                  bt[key] = n;
                  c.rebuild();
                },
              },
              fmt(n),
            ),
          ),
        ),
      );
    const cand = d.entities.filter((e) => e.id !== d.heroId && !e.tie);
    add(
      p,
      h('small', { class: 'dim' }, 'Enemies'),
      cand.length
        ? h(
            'div',
            { class: 'grid' },
            cand.map((e) =>
              h(
                'button',
                {
                  class: G.foes.includes(e.id) ? 'on' : '',
                  onclick: () => {
                    G.foes = G.foes.includes(e.id) ? G.foes.filter((x) => x !== e.id) : [...G.foes, e.id];
                    c.rebuild();
                  },
                },
                glyphNode(code, e.asset),
              ),
            ),
          )
        : h('p', { class: 'dim' }, 'Add an enemy to the stage first.'),
      h('small', { class: 'dim' }, 'Health of each enemy'),
      h(
        'div',
        { class: 'row' },
        [2, 3, 5, 8, 12, 20].map((n) =>
          h(
            'button',
            {
              class: 'grow' + (G.hp === n ? ' on' : ''),
              onclick: () => {
                G.hp = n;
                c.rebuild();
              },
            },
            String(n),
          ),
        ),
      ),
      /* the rules of this battle, decided before it starts */
      h(
        'div',
        { class: 'card', id: 'battleRules' },
        h('h3', {}, 'Rules of this battle'),
        h('small', { class: 'dim' }, 'Who moves the enemies?'),
        h(
          'div',
          { class: 'row' },
          h(
            'button',
            { id: 'btAuto', class: 'grow' + (bt.auto === true ? ' on' : ''), onclick: () => ((bt.auto = true), c.rebuild()) },
            'They fight on their own',
          ),
          h(
            'button',
            { id: 'btHand', class: 'grow' + (bt.auto === false ? ' on' : ''), onclick: () => ((bt.auto = false), c.rebuild()) },
            'I move each one',
          ),
          h(
            'button',
            { id: 'btManual', class: 'grow' + (bt.auto === null ? ' on' : ''), onclick: () => ((bt.auto = null), c.rebuild()) },
            'All by hand',
          ),
        ),
        h(
          'small',
          { class: 'dim' },
          bt.auto === null
            ? 'No rules: the Player picks Attack, Defend or Flee, and you decide every blow yourself.'
            : bt.auto
              ? 'Each round is settled when the Player ends the turn: their command, then every enemy strikes back. On your turn you can still step in: hurt, heal, add enemies, end it.'
              : 'The Player’s command is settled at once; then you make each enemy act with the tools here.',
        ),
        hpStat
          ? h('small', { class: 'dim' }, `${S.names.player}’s health is the “${hpStat.name}” stat: ${hpStat.value}`)
          : chips(`${S.names.player}’s health`, 'heroHp', [5, 8, 12, 20, 30]),
        chips(`${S.names.player}’s strength (a tied weapon adds ${WEAPON})`, 'atk', [1, 2, 3, 5]),
        chips('Enemies’ strength', 'foeAtk', [0, 1, 2, 3, 5]),
        chips('Chance to escape', 'flee', [0, 25, 50, 75, 100], (n) => n + '%'),
        h('small', { class: 'dim' }, `What ${S.names.player} may do`),
        h(
          'div',
          { class: 'chips wrap' },
          BATTLE_CMDS.map(([id, label]) =>
            h(
              'button',
              {
                'data-cmd': id,
                class: bt.cmds.includes(id) ? 'on' : '',
                disabled: id === 'attack',
                onclick: () => {
                  bt.cmds = bt.cmds.includes(id) ? bt.cmds.filter((x) => x !== id) : [...bt.cmds, id];
                  c.rebuild();
                },
              },
              label,
            ),
          ),
        ),
      ),
      h(
        'button',
        {
          class: 'primary gdone',
          id: 'battleStart',
          disabled: !G.foes.some((id) => cand.some((e) => e.id === id)),
          onclick: () => {
            for (const e of cand)
              if (G.foes.includes(e.id)) {
                e.hp = G.hp;
                e.maxHp = G.hp;
              }
            if (!hpStat && me) me.hp = me.maxHp = bt.heroHp; // a story with a Health stat keeps its own count
            d.battle =
              bt.auto === null
                ? { round: 1 }
                : { round: 1, auto: bt.auto, cmds: [...bt.cmds], atk: bt.atk, foeAtk: bt.foeAtk, flee: bt.flee, guard: false, log: [], over: '' };
            d.ask = { kind: 'battle', text: 'Battle! What do you do?', sides: 6, dc: 0, verb: '', places: [], targets: [] };
            d.choices = [];
            d.sfx ||= 'alarm';
            d.card ||= 'Battle!';
            G.foes = [];
            if (!setup) G.log.push('A battle begins');
            c.rebuild();
          },
        },
        'Begin the battle',
      ),
    );
    return;
  }
  const ruled = typeof d.battle.auto === 'boolean';
  head(
    `Battle — round ${d.battle.round}`,
    !ruled
      ? 'One click per event. Each becomes its own step, so they play one after the other.'
      : d.battle.auto
        ? 'The enemies fight on their own. Step in whenever you like: one click per event.'
        : 'The Player’s command is settled. Now move each enemy: one click per event.',
  );
  if (ruled && !d.ask && !d.battle.over)
    d.ask = { kind: 'battle', text: `Round ${d.battle.round} — what do you do?`, sides: 6, dc: 0, verb: '', places: [], targets: [] };
  if (ruled && d.battle.log.length)
    add(
      p,
      h(
        'div',
        { class: 'battlelog', id: 'battleLog' },
        d.battle.log.map((l) => h('p', {}, l)),
      ),
    );
  if (ruled && d.battle.over === 'lost')
    add(p, h('p', { class: 'warn' }, `${S.names.player} is beaten. Decide what happens: heal them, end the battle, or end the story.`));
  const foe = foes.find((e) => e.id === G.foe) || foes.find((e) => e.id === d.target) || foes[0];
  const a = d.answer,
    mv = a && a.kind === 'battle' ? a.move : '';
  const endBattle = (sound, card) => {
    const dd = c.draft;
    for (const e of dd.entities) {
      e.hp = null;
      e.maxHp = null;
    }
    dd.battle = null;
    dd.ask = null;
    dd.sfx = sound;
    if (card) dd.card = card;
    G.path = [];
  };
  /** Finish the event just built: it becomes a step of its own, and the tools stay open for the next one. */
  const stepOn = (label) => {
    const left = d.entities.some((e) => e.hp != null && e.id !== d.heroId && !e.temp),
      down = heroHp() === 0;
    c.nextStep();
    G.log = [];
    G.path = ['battle'];
    if (!left) {
      endBattle('fanfare', 'Victory!');
      c.toast('All enemies are down — the battle is over');
    } else if (down) c.toast(`${S.names.player} is at 0 health — decide what happens`);
    if (label) G.did = [...(G.did || []), label].slice(-4);
    c.rebuild();
  };
  add(
    p,
    h(
      'div',
      { class: 'card' },
      h('small', { class: 'dim' }, 'Who is fighting'),
      h(
        'div',
        { class: 'row statrow' },
        h('b', { class: 'grow' }, '', S.names.player, `  ${heroHp() ?? '–'}`),
        h(
          'button',
          {
            onclick: () => {
              hurtHero(1);
              c.rebuild();
            },
          },
          '−',
        ),
        h(
          'button',
          {
            onclick: () => {
              hurtHero(-1);
              c.rebuild();
            },
          },
          '+',
        ),
      ),
      foes.map((e) =>
        h(
          'div',
          { class: 'row statrow' },
          h(
            'button',
            {
              class: 'foe' + (e === foe ? ' on' : ''),
              title: 'Choose this enemy',
              onclick: () => {
                G.foe = e.id;
                c.rebuild();
              },
            },
            glyphNode(code, e.asset, 'mini'),
          ),
          h('b', { class: 'grow' }, ` ${e.hp}/${e.maxHp}`),
          h(
            'button',
            {
              onclick: () => {
                e.hp = clamp(e.hp - 1, 0, e.maxHp);
                c.rebuild();
              },
            },
            '−',
          ),
          h(
            'button',
            {
              onclick: () => {
                e.hp = clamp(e.hp + 1, 0, e.maxHp);
                c.rebuild();
              },
            },
            '+',
          ),
        ),
      ),
    ),
  );
  if (foe) {
    const hit = (n) => {
      // the Player's blow lands (or misses)
      lunge(me, foe);
      for (const w of me ? held(me) : []) w.once = 'swing';
      if (n) {
        foe.hp = clamp(foe.hp - n, 0, foe.maxHp);
        foe.once = 'hit';
        float(foe.id, `-${n}`, '#ff5a5a');
        d.sfx = 'boom';
      } else {
        float(foe.id, 'miss', '#ffffff');
        d.sfx = 'fail';
      }
      if (foe.hp <= 0) {
        foe.once = 'die';
        foe.temp = true;
        foe.say = '';
      }
      stepOn(n ? `${S.names.player} hits ${lab(foe)} for ${n}${foe.hp <= 0 ? ' — it falls' : ''}` : `${S.names.player} misses`);
    };
    const strike = (style, n) => {
      // the enemy's move against the hero
      const arms = held(foe);
      if (style === 'strike') {
        lunge(foe, me);
        d.sfx = 'boom';
      }
      if (style === 'swing') {
        lunge(foe, me);
        if (arms.length) for (const w of arms) w.once = 'swing';
        else foe.once = 'swing';
        d.sfx = 'boom';
      }
      if (style === 'shoot' || style === 'magic') {
        foe.once = 'cast';
        d.sfx = style === 'magic' ? 'magic' : 'laser';
        if (me) {
          const shot = {
            id: c.rid(),
            asset: style === 'magic' ? 'e:' : 'e:',
            x: me.x,
            y: me.y - 0.06,
            scale: 0.6,
            flip: me.x < foe.x,
            rot: 0,
            say: '',
            fx: '',
            emote: '',
            solid: false,
            active: null,
            tie: null,
            hp: null,
            maxHp: null,
            once: 'vanish',
            temp: true,
            layer: 1,
          };
          d.entities.push(shot);
          d.tracks.push({ id: shot.id, pts: [0, foe.x, foe.y - 0.08 * foe.scale, 420, me.x, me.y - 0.06] });
        }
      }
      if (style === 'roar') {
        foe.once = 'roar';
        d.burst = 'shake';
        d.sfx = 'alarm';
      }
      if (n && me) {
        hurtHero(n);
        me.once = 'hit';
        float(me.id, `-${n}`, '#ff5a5a');
        d.burst = 'hurt';
      } else if (me && style !== 'roar') float(me.id, 'miss', '#ffffff');
      d.battle.round += 1;
      stepOn(
        `${lab(foe)} ${{ strike: 'strikes', swing: 'swings', shoot: 'shoots', magic: 'casts a spell', roar: 'roars' }[style]}${n ? ` for ${n}` : style === 'roar' ? '' : ' and misses'}`,
      );
    };
    G.style ||= 'strike';
    const dmgRow = (fn, id) =>
      h(
        'div',
        { class: 'row', id },
        [
          [0, 'Miss'],
          [1, '1'],
          [2, '2'],
          [3, '3'],
          [5, '5'],
          [8, '8'],
        ].map(([n, l]) => h('button', { 'data-dmg': n, class: 'grow', onclick: () => fn(n) }, l)),
      );
    add(
      p,
      h(
        'div',
        { class: 'card' },
        h(
          'b',
          {},
          '1. ',
          mv === 'attack'
            ? `${S.names.player} attacks `
            : mv === 'defend'
              ? `${S.names.player} defends. `
              : mv === 'flee'
                ? `${S.names.player} tries to flee. `
                : `${S.names.player}’s attack on `,
          mv === 'defend' || mv === 'flee' ? '' : glyphNode(code, foe.asset, 'mini'),
        ),
        mv === 'flee'
          ? h(
              'div',
              { class: 'row' },
              h(
                'button',
                {
                  class: 'grow',
                  id: 'fleeYes',
                  onclick: () => {
                    endBattle('magic', '');
                    if (!setup) G.log.push(`${S.names.player} gets away`);
                    c.rebuild();
                  },
                },
                'They get away',
              ),
              h('span', { class: 'dim small grow' }, 'or they fail: go on to 2.'),
            )
          : mv === 'defend'
            ? h('small', { class: 'dim' }, 'Take it into account in the damage below.')
            : [h('small', { class: 'dim' }, 'How much damage does it do?'), dmgRow(hit, 'heroHits')],
      ),
      h(
        'div',
        { class: 'card' },
        h('b', {}, '2. What ', glyphNode(code, foe.asset, 'mini'), ' does back'),
        h(
          'div',
          { class: 'chips wrap' },
          [
            ['strike', 'Strike'],
            ['swing', 'Sword swing'],
            ['shoot', 'Shoot'],
            ['magic', 'Magic'],
          ].map(([id, l]) =>
            h(
              'button',
              {
                'data-attack': id,
                class: G.style === id ? 'on' : '',
                onclick: () => {
                  G.style = id;
                  c.rebuild();
                },
              },
              l,
            ),
          ),
          h('button', { 'data-attack': 'roar', onclick: () => strike('roar', 0) }, 'Just roars'),
        ),
        h('small', { class: 'dim' }, 'Damage to the hero'),
        dmgRow((n) => strike(G.style, n), 'foeHits'),
      ),
    );
  }
  if (G.did && G.did.length)
    add(
      p,
      h(
        'div',
        { class: 'card gevents' },
        h('small', { class: 'dim' }, 'So far this turn'),
        G.did.map((l) => h('div', {}, '• ' + l)),
      ),
    );
  add(
    p,
    h(
      'div',
      { class: 'card' },
      h('small', { class: 'dim' }, `What ${S.names.player} does next turn`),
      h(
        'div',
        { class: 'row' },
        h(
          'button',
          {
            class: 'grow' + (d.ask && d.ask.kind === 'battle' ? ' on' : ''),
            onclick: () => {
              d.ask = { kind: 'battle', text: 'Your move!', sides: 6, dc: 0, verb: '', places: [], targets: [] };
              c.rebuild();
            },
          },
          'A battle move',
        ),
        [
          [8, 'Check 8+'],
          [12, 'Check 12+'],
          [16, 'Check 16+'],
        ].map(([dc, l]) =>
          h(
            'button',
            {
              class: 'grow' + (d.ask && d.ask.kind === 'roll' && d.ask.dc === dc ? ' on' : ''),
              title: 'A d20 skill check',
              onclick: () => {
                d.ask = { kind: 'roll', text: 'Skill check!', sides: 20, dc, verb: '', places: [], targets: [] };
                c.rebuild();
              },
            },
            l,
          ),
        ),
      ),
    ),
    h(
      'div',
      { class: 'row' },
      h(
        'button',
        {
          class: 'grow danger',
          id: 'battleEnd',
          onclick: () => {
            endBattle('fanfare', '');
            if (!setup) G.log.push('The battle is over');
            c.rebuild();
          },
        },
        'End the battle',
      ),
      h(
        'button',
        {
          class: 'grow',
          onclick: () => {
            home();
            c.rebuild();
          },
        },
        'Other tools',
      ),
    ),
  );
  return;
}

/* ================= the Player's sheet ================= */
export function screenSheet(kit) {
  const { p, c, d, S, code, enter, head, doneBtn, chips } = kit;
  head(`${S.names.player}’s sheet`);
  const m = c.mods();
  if (m.stats) {
    add(
      p,
      h('small', { class: 'dim' }, 'Stats'),
      d.sheet.stats.map((st) =>
        h(
          'div',
          { class: 'row statrow' },
          h('b', { class: 'grow' }, `${st.name}  ${st.value}${st.max != null ? '/' + st.max : ''}`),
          h(
            'button',
            {
              onclick: () => {
                st.value = clamp(st.value - 1, -9999, 9999);
                c.rebuild();
              },
            },
            '−',
          ),
          h(
            'button',
            {
              onclick: () => {
                st.value = clamp(st.value + 1, -9999, st.max ?? 9999);
                c.rebuild();
              },
            },
            '+',
          ),
        ),
      ),
    );
    if (!d.sheet.stats.length) add(p, h('p', { class: 'dim small' }, 'No stats yet. Add them with “+ stat” in the bar under the stage.'));
  }
  if (m.inventory) {
    add(
      p,
      h('small', { class: 'dim' }, 'Inventory'),
      d.sheet.inv.length
        ? h(
            'div',
            { class: 'chips wrap' },
            d.sheet.inv.map((it) =>
              h(
                'button',
                {
                  title: 'Take it away',
                  onclick: () => {
                    d.sheet.inv = d.sheet.inv.filter((x) => x !== it);
                    c.rebuild();
                  },
                },
                glyphNode(code, it.asset, 'mini'),
                ' ✕',
              ),
            ),
          )
        : h('p', { class: 'dim small' }, 'Empty.'),
      h(
        'button',
        {
          onclick: () => {
            G.sel = null;
            enter('give');
          },
        },
        'Give them something from the stage',
      ),
    );
  }
  if (m.dice)
    add(
      p,
      h('small', { class: 'dim' }, 'Roll a die with this turn'),
      chips(
        [
          [0, 'No roll'],
          [6, 'd6'],
          [20, 'd20'],
        ],
        'rollWant',
      ),
    );
  add(p, doneBtn(''));
  return;
}

export function screenGive(kit) {
  const { c, d, S, sel, lab, done, picker } = kit;
  if (!sel || sel.id === d.heroId) {
    if (sel) {
      G.sel = null;
      c.toast('That is the Player’s own character');
    }
    return picker(`Give ${S.names.player} which thing?`);
  }
  const l = lab(sel);
  c.giveToPlayer(sel);
  return done(`${S.names.player} gets ${l}`);
}
