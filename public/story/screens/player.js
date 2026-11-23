/* Director screens about the Player: what to ask of them, points, their sheet, giving items, battles. */
import { assetUrl } from '../../core/catalog.js';
import { BATTLE_LEVELS, planBattle } from '../../shared/battle.js';
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
  const { p, c, d, S, code, me, lab, setup, home, head, doneBtn } = kit;
  const hpStat = c.mods().stats && d.sheet.stats.find((st) => /health|hp|life/i.test(st.name));
  const heroHp = () => (hpStat ? hpStat.value : me && me.hp != null ? me.hp : 10);
  const armed = d.entities.some((e) => e.tie && e.tie.to === d.heroId);
  const levelName = (id) => (BATTLE_LEVELS.find((l) => l[0] === id) || [0, ''])[1];
  if (!d.battle) {
    /* before the battle: who the enemies are, and how hard it is — nothing else */
    head(
      'Start a battle',
      `Pick the enemies and how hard it is. Then the whole fight is ${S.names.player}’s: you watch every blow, and can pause it whenever you like.`,
    );
    G.foes ||= [];
    G.level ||= 'medium';
    const cand = d.entities.filter((e) => e.id !== d.heroId && !e.tie),
      chosen = cand.filter((e) => G.foes.includes(e.id)),
      plan = planBattle(G.level, { heroHp: heroHp(), weapon: armed, foes: chosen.length });
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
        : h('p', { class: 'dim' }, 'Put an enemy on the stage first.'),
      h('small', { class: 'dim' }, 'How hard is it?'),
      h(
        'div',
        { class: 'levelgrid', id: 'battleLevels' },
        BATTLE_LEVELS.map(([id, label]) =>
          h(
            'button',
            {
              'data-level': id,
              class: G.level === id ? 'on' : '',
              onclick: () => {
                G.level = id;
                c.rebuild();
              },
            },
            label,
          ),
        ),
      ),
      h(
        'p',
        { class: 'estimate', id: 'btEstimate' },
        chosen.length
          ? `${levelName(G.level)}: ${S.names.player} (${heroHp()} health${armed ? ', armed' : ''}) against ${chosen.length} ${chosen.length > 1 ? 'enemies' : 'enemy'} with ${plan.foeHp} health each — about ${plan.rounds} rounds, costing about ${Math.min(plan.damage, 99)} health. ${S.names.player} hits ${plan.hit} times in 100, an enemy ${plan.foeHit}; escaping works ${plan.flee} times in 100.`
          : 'Pick at least one enemy.',
      ),
      h(
        'button',
        {
          class: 'primary gdone',
          id: 'battleStart',
          disabled: !chosen.length,
          onclick: () => {
            for (const e of chosen) e.hp = e.maxHp = plan.foeHp;
            if (!hpStat && me && me.hp == null) me.hp = me.maxHp = 10;
            d.battle = {
              level: plan.level,
              round: 1,
              atk: plan.atk,
              hit: plan.hit,
              foeAtk: plan.foeAtk,
              foeHit: plan.foeHit,
              flee: plan.flee,
              guard: false,
              paused: false,
              log: [],
            };
            d.ask = null;
            d.choices = [];
            d.sfx ||= 'alarm';
            d.card ||= 'Battle!';
            G.foes = [];
            if (!setup) G.log.push(`A ${levelName(plan.level).toLowerCase()} battle begins when you end your turn`);
            home();
            c.rebuild();
          },
        },
        'Begin the battle',
      ),
    );
    return;
  }
  /* the battle is paused (or about to begin): it is the Director's turn */
  const foes = d.entities.filter((e) => e.hp != null && e.hp > 0 && e.id !== d.heroId);
  head(
    d.battle.paused ? 'The battle is paused' : 'The battle is about to begin',
    `Stage whatever you like with the usual tools. When you end your turn the fight is ${S.names.player}’s again.`,
  );
  add(
    p,
    h(
      'div',
      { class: 'card' },
      h('b', {}, `${levelName(d.battle.level)} — round ${d.battle.round}`),
      h('div', { class: 'row statrow' }, h('span', { class: 'grow' }, S.names.player), h('b', {}, `${heroHp()} health`)),
      foes.map((e) => h('div', { class: 'row statrow' }, h('span', { class: 'grow' }, lab(e)), h('b', {}, `${e.hp} / ${e.maxHp}`))),
      d.battle.log.length > 0 &&
        h(
          'div',
          { class: 'battlelog', id: 'battleLog' },
          d.battle.log.map((l) => h('p', {}, l)),
        ),
    ),
    h('small', { class: 'dim' }, 'Change how hard it is from here on'),
    h(
      'div',
      { class: 'levelgrid' },
      BATTLE_LEVELS.map(([id, label]) =>
        h(
          'button',
          {
            'data-level': id,
            class: d.battle.level === id ? 'on' : '',
            onclick: () => {
              const plan = planBattle(id, { heroHp: heroHp(), weapon: armed, foes: Math.max(1, foes.length) });
              Object.assign(d.battle, { level: id, hit: plan.hit, foeAtk: plan.foeAtk, foeHit: plan.foeHit, flee: plan.flee });
              c.changedQuiet();
              c.rebuild();
            },
          },
          label,
        ),
      ),
    ),
    h(
      'button',
      {
        id: 'battleEnd',
        onclick: () => {
          for (const e of d.entities) if (e.id !== d.heroId) e.hp = e.maxHp = null;
          d.battle = null;
          d.ask = null;
          if (!setup) G.log.push('The battle is called off');
          home();
          c.rebuild();
        },
      },
      'Call the battle off',
    ),
    doneBtn(() => ''),
  );
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
