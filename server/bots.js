/*
 * AI partners for solo play.
 *
 * A bot takes one side of a story. On its turn the server calls
 *
 *     botMove({ role, scene, rules, names, turn, memory, history })
 *
 *   role 'player'   -> returns { x, y, say, emote, action, target, use, roll }
 *   role 'director' -> returns { scene }                   (the whole next scene)
 *
 * `scene` is a private copy the bot may edit freely; `memory` is a small object
 * saved with the story between turns; `history` holds the last few turns.
 * The result goes through exactly the same validation as a human's turn.
 *
 * The built-in bots below are scripted (keyword rules + a few story templates):
 * free, instant, no network. To put a language model behind them, write a module
 * exporting `playerMove(ctx)` and/or `directorMove(ctx)` with the same return
 * shapes and start the server with  BOT_PROVIDER=./my-bot.js . Returning null
 * (or throwing) falls back to the scripted bot for that turn.
 */
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);   // plug-in modules and optional libraries are loaded on demand

let custom = null;
if (process.env.BOT_PROVIDER) custom = require(path.resolve(process.env.BOT_PROVIDER));

async function botMove(ctx) {
  const fn = ctx.role === 'director' ? 'directorMove' : 'playerMove';
  if (custom && typeof custom[fn] === 'function') {
    try { const out = await custom[fn](ctx); if (out) return out; } catch (e) { console.error('BOT_PROVIDER failed, using scripted bot:', e.message); }
  }
  return ctx.role === 'director' ? directorMove(ctx) : playerMove(ctx);
}

const BOT_NAMES = ['Robin', 'Juno', 'Milo', 'Ada', 'Otis', 'Nova', 'Ivy', 'Felix'];
const botName = () => pick(BOT_NAMES);

/* ---------- helpers ---------- */
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const chance = (p) => Math.random() < p;
const uid = () => crypto.randomBytes(4).toString('hex');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const glyph = (e) => (e.asset.startsWith('e:') ? e.asset.slice(2) : 'the strange thing');
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const nearest = (from, list) => list.slice().sort((a, b) => dist(a, from) - dist(b, from))[0];
const ent = (kind, emoji, x, y, say = '', scale = 1) => ({ id: `${kind}-${uid()}`, asset: 'e:' + emoji, x, y, scale, flip: false, rot: 0, say, fx: '', emote: '' });

/* ====================================================================
 * Scripted PLAYER: looks at what is on stage and makes a simple choice.
 * ==================================================================== */
function playerMove({ scene, memory, rules }) {
  const hero = scene.entities.find((e) => e.id === scene.heroId);
  const others = scene.entities.filter((e) => e.id !== scene.heroId);
  const speakers = others.filter((e) => e.say);
  const asked = speakers.find((e) => e.say.includes('?'));
  const mods = (rules && rules.modules) || {};

  let say = '';
  if (asked) say = pick(['Yes.', 'No.', 'Maybe. Why do you ask?', "I don't know yet.", 'Who wants to know?', "I'd rather not say.", 'Yes… I think so.']);
  else if (speakers.length) say = pick(['Tell me more.', "I don't believe you.", 'What do you want from me?', 'Fine. Lead the way.', "That's not what I expected.", 'Why should I trust you?', 'Go on…', 'Then we should hurry.']);
  else if (scene.narration) say = pick(['Hello? Is anyone here?', 'What is this place?', 'I have a bad feeling about this.', 'Well. Here goes nothing.', '', '']);
  else say = pick(['Hello?', '…', '']);

  const out = { x: hero ? hero.x : 0.5, y: hero ? hero.y : 0.8, say, action: '', target: null, use: null, roll: 0,
    emote: chance(0.5) ? pick(['😀', '🤔', '😱', '😡', '😢', '😍']) : '' };

  const mode = (rules && rules.player) || 'free';
  if (scene.choices.length && (mode === 'limited' || chance(0.7))) { out.action = pick(scene.choices); return out; }
  if (mode === 'tell') { out.action = pick(['I walk up to whoever is closest and ask what is going on.', 'I search the place for anything useful.', 'I try the nearest door.', 'I hide and watch what happens.', 'I pick up the most interesting thing I can see.']); return out; }       // take an offered choice
  if (mods.inventory && scene.sheet.inv.length && chance(0.25)) { out.use = pick(scene.sheet.inv).id; return out; }
  if (mods.dice && chance(0.15)) out.roll = 6;

  // otherwise choose something on stage to deal with, preferably not the same thing as last turn
  const fresh = others.filter((e) => e.id !== memory.lastTarget);
  const target = speakers.length && chance(0.5) ? pick(speakers) : pick(fresh.length ? fresh : others);
  if (target && chance(0.75)) {
    memory.lastTarget = target.id;
    out.x = clamp(target.x + (target.x > 0.5 ? -0.13 : 0.13), 0.05, 0.95);
    out.y = clamp(target.y + 0.03, 0.15, 1);
    if (mods.inventory && chance(0.5)) out.target = target.id;
    else out.action = `${pick(['walks over to', 'takes a closer look at', 'points at', 'carefully touches', 'circles around', 'stops in front of'])} ${glyph(target)}`;
  } else if (chance(0.6)) {
    out.x = clamp(out.x + (Math.random() - 0.5) * 0.4, 0.05, 0.95);
    out.action = pick(['looks around', 'waits and listens', 'searches the ground', 'takes a step back', 'checks their pockets']);
  }
  if (!out.say && !out.action && !out.target) out.action = 'looks around';
  return out;
}

/* ====================================================================
 * Scripted DIRECTOR: a handful of places, and keyword-driven reactions.
 * ==================================================================== */
// cast rows: [kind, emoji, x, y, opening line, scale]   kind: npc | obj
const PLACES = [
  { id: 'forest', title: 'The Forest', backdrop: 'b:forest', mood: 'm:eerie',
    open: 'You wake in a forest you do not remember entering.', arrive: 'The path ends among tall, silent trees.',
    cast: [['npc', '🧙', 0.7, 0.8, 'Ah. You are finally awake.'], ['obj', '🌲', 0.1, 0.62, '', 2.4], ['obj', '🌲', 0.9, 0.6, '', 2.2], ['obj', '📦', 0.48, 0.93]] },
  { id: 'room', title: 'A Locked Room', backdrop: 'b:darkroom', mood: 'm:tense',
    open: 'Rain on the window. Someone has been in your room.', arrive: 'A dim room. The door clicks shut behind you.',
    cast: [['npc', '🕵️', 0.72, 0.82, 'Do not touch anything. Where were you last night?'], ['obj', '🚪', 0.12, 0.62, '', 1.8], ['obj', '✉️', 0.45, 0.9, '', 0.7], ['obj', '🕯️', 0.9, 0.6]] },
  { id: 'beach', title: 'The Shore', backdrop: 'b:beach', mood: 'm:sea',
    open: 'The tide brought you here. The boat is gone.', arrive: 'Sand under your feet, and the sound of waves.',
    cast: [['npc', '🦀', 0.66, 0.9, 'Psst. You. Tall one. Down here.', 0.8], ['obj', '🌴', 0.88, 0.66, '', 2.4], ['obj', '🍾', 0.3, 0.92, '', 0.7], ['obj', '🛶', 0.15, 0.6, '', 1.4]] },
  { id: 'space', title: 'Far From Home', backdrop: 'b:space', mood: 'm:space',
    open: 'Your ship has landed somewhere it should not have.', arrive: 'Stars in every direction. The ground hums.',
    cast: [['npc', '👽', 0.7, 0.8, 'Visitor. State your purpose.'], ['obj', '🚀', 0.14, 0.72, '', 2], ['obj', '🔮', 0.5, 0.92, '', 0.8]] },
  { id: 'cave', title: 'The Cave', backdrop: 'b:cave', mood: 'm:dungeon',
    open: 'The torch is almost out. Something breathes in the dark.', arrive: 'Cold stone, and a slow breathing ahead.',
    cast: [['npc', '🐉', 0.72, 0.78, 'Who dares wake me?', 1.8], ['obj', '💰', 0.5, 0.92], ['obj', '🪨', 0.12, 0.85, '', 1.4], ['obj', '🗡️', 0.3, 0.6, '', 0.8]] },
  { id: 'night', title: 'The Empty Village', backdrop: 'b:night', mood: 'm:sad',
    open: 'Midnight. The village is empty, except for one light.', arrive: 'Night has fallen. A single window glows.',
    cast: [['npc', '👻', 0.68, 0.72, 'You can see me? Nobody has seen me in years.'], ['obj', '🏚️', 0.2, 0.66, '', 2.4], ['obj', '🪦', 0.86, 0.86], ['obj', '🕯️', 0.5, 0.92, '', 0.7]] },
  { id: 'meadow', title: 'A Bright Morning', backdrop: 'b:meadow', mood: 'm:town',
    open: 'A bright morning. A stranger waves from across the field.', arrive: 'Sunlight, tall grass, and somebody waving.',
    cast: [['npc', '🧑‍🌾', 0.7, 0.82, 'You there! Have you seen a runaway pig?'], ['obj', '🌻', 0.12, 0.88], ['obj', '🏡', 0.86, 0.62, '', 2.2], ['obj', '🪣', 0.45, 0.92, '', 0.8]] },
  { id: 'castle', title: 'The Great Hall', backdrop: 'b:hall', mood: 'm:heroic',
    open: 'The great hall is silent. The throne is not empty.', arrive: 'Stone pillars. Torchlight. A throne.',
    cast: [['npc', '🤴', 0.7, 0.74, 'Kneel. Or explain yourself. Quickly.'], ['npc', '💂', 0.9, 0.84, ''], ['obj', '👑', 0.5, 0.93, '', 0.7], ['obj', '🚪', 0.1, 0.64, '', 1.8]] },
  { id: 'swamp', title: 'The Swamp', backdrop: 'b:swamp', mood: 'm:spooky',
    open: 'The mud pulls at your boots. Something is laughing.', arrive: 'Green fog, black water, and a croaking laugh.',
    cast: [['npc', '🐸', 0.66, 0.88, 'Ribbit. That is frog for: you owe me a favour.', 0.9], ['obj', '🍄', 0.2, 0.9, '', 0.8], ['obj', '🧳', 0.46, 0.93], ['obj', '🌿', 0.88, 0.8, '', 1.6]] },
];
const VISITORS = [['🧛', 'Good evening. I believe you have something of mine.'], ['👧', 'Are you lost too?'], ['🤖', 'SCANNING. You are not on the list.'], ['🐺', '…'], ['🧚', 'Shh! They will hear you.'], ['💂', 'Halt! Nobody passes without the word.'], ['🧝', 'We have been expecting you, though not so soon.'], ['🐈', 'Mrow.']];
const CLUES = ['🗝️', '📜', '👣', '✉️', '💍', '🔦', '🗺️'];
const LOOT = ['🔑', '💎', '📜', '🗡️', '🐍', '💰', '🧿', '🕷️'];
const CONTAINERS = ['📦', '🧳', '🎁', '💰', '🏺'];
const EXITS = ['🚪', '🏚️', '🏡', '🚀', '🛶'];

function buildPlace(scene, place, hero, narration) {
  scene.backdrop = place.backdrop; scene.mood = place.mood; scene.narration = narration; scene.card = place.title;
  scene.drawing = []; scene.weather = place.id === 'swamp' ? 'fog' : place.id === 'cave' ? 'dark' : '';
  scene.entities = place.cast.map(([kind, emoji, x, y, say, scale]) => ent(kind, emoji, x, y, say || '', scale || 1));
  if (hero) { hero.x = 0.3; hero.y = 0.82; scene.entities.push(hero); }
}
/** A ready-made scene the Director can drop in ("Random scene" button). */
function randomPlace() {
  const scene = {}; buildPlace(scene, pick(PLACES), null, '');
  const place = PLACES.find((p) => p.title === scene.card);
  return { backdrop: scene.backdrop, mood: scene.mood, weather: scene.weather, card: scene.card, narration: place.open, entities: scene.entities };
}

function directorMove({ scene, memory, turn, rules }) {
  const mods = (rules && rules.modules) || {};
  let hero = scene.entities.find((e) => e.id === scene.heroId);
  if (!hero) { hero = { id: 'hero', asset: 's:person', x: 0.3, y: 0.82, scale: 1, flip: false, rot: 0, say: '', fx: '', emote: '' }; scene.entities.push(hero); scene.heroId = hero.id; }
  const npcs = () => scene.entities.filter((e) => e.id.startsWith('npc-'));
  const objs = () => scene.entities.filter((e) => e.id.startsWith('obj-'));
  const offer = () => {                                    // quick choices for the Player's next turn
    const c = [];
    const box = objs().find((o) => CONTAINERS.includes(glyph(o))), small = objs().find((o) => o.scale < 1.6 && !CONTAINERS.includes(glyph(o))), who = npcs()[0];
    if (box) c.push(`Open ${glyph(box)}`);
    if (who) c.push(`Talk to ${glyph(who)}`);
    if (small) c.push(`Take ${glyph(small)}`);
    c.push(pick(['Look around', 'Leave this place', 'Wait and listen']));
    scene.choices = c.slice(0, 3);
  };
  Object.assign(scene, { tracks: [], burst: '', sfx: '', card: '', choices: [] });

  if (turn === 0 || !memory.place) {                       // opening scene
    const place = pick(PLACES);
    memory.place = place.id; memory.beat = 0;
    buildPlace(scene, place, hero, place.open);
    if (mods.stats && !scene.sheet.stats.length) scene.sheet.stats = [{ id: 'hp', name: '❤️ Health', value: 5, max: 5 }, { id: 'gold', name: '💰 Gold', value: 0, max: null }];
    offer();
    return { scene };
  }

  const said = hero.say || '';
  hero.say = '';                                           // the Player's line has been heard; it does not hang over the next scene
  const tgt = scene.entities.find((e) => e.id === scene.target);
  const item = scene.sheet.inv.find((i) => i.id === scene.use);
  let did = scene.action || '';
  if (tgt && !did) did = tgt.id.startsWith('npc-') ? (said ? '' : 'hello') : 'take';   // reaching for something means wanting it
  const text = ` ${said} ${did} `.toLowerCase();
  const has = (re) => re.test(text);

  // last turn's lines and effects are over
  scene.entities = scene.entities.filter((e) => !e.id.startsWith('fx-'));
  for (const e of scene.entities) if (e !== hero) { e.say = ''; e.emote = ''; }
  scene.narration = '';
  const remove = (e) => { scene.entities = scene.entities.filter((x) => x !== e); };
  const npc = (tgt && tgt.id.startsWith('npc-') && tgt) || nearest(hero, npcs());
  const speak = (lines) => { if (npc) { npc.say = pick(lines); npc.x = clamp(npc.x + (hero.x - npc.x) * 0.25, 0.05, 0.95); } return !!npc; };
  const fx = (emoji, at) => scene.entities.push({ ...ent('fx', emoji, clamp(at.x + 0.04, 0, 1), clamp(at.y - 0.1, 0.1, 1)), scale: 0.9, fx: 'pulse' });
  const visitor = () => { const [emoji, line] = pick(VISITORS); scene.entities.push(ent('npc', emoji, hero.x > 0.5 ? 0.12 : 0.88, 0.8, line)); };
  const stat = (re) => (mods.stats ? scene.sheet.stats.find((s) => re.test(s.name)) : null);
  const travel = (lead) => {
    const place = pick(PLACES.filter((p) => p.id !== memory.place));
    memory.place = place.id;
    buildPlace(scene, place, hero, `${lead} ${place.arrive}`);
    scene.sfx = 'magic';
  };
  memory.beat = (memory.beat || 0) + 1;
  let moved = false;

  if (item) {                                              // the Player used something from the inventory
    scene.sheet.inv = scene.sheet.inv.filter((i) => i !== item);
    const g = item.asset.startsWith('e:') ? item.asset.slice(2) : item.name || 'it';
    if (chance(0.5)) { travel(`You use ${g}. Something gives way, and you step through.`); moved = true; } else {
      scene.narration = `You use ${g}. ${pick(['It crumbles to dust — but it worked.', 'A hidden lock clicks open.', 'For a second, everything glows.'])}`;
      scene.burst = 'flash'; scene.sfx = 'magic';
      speak(['How did you know to do that?', 'Impossible…', 'Well done. I underestimated you.']);
    }
  } else if (!said && !did) {                              // the Player only moved, or ran out of time
    const o = nearest(hero, objs());
    if (o && dist(o, hero) < 0.2) scene.narration = `You stand beside ${glyph(o)}. It seems to be waiting for you to do something.`;
    else if (!speak(['Well? Say something.', 'You are very quiet.', 'Take your time. I have all night.', 'Cat got your tongue?'])) scene.narration = 'The silence stretches. Something has to give.';
  } else if (has(/\b(attack|hit|fight|kill|stab|punch|kick|shoot|slap|sword|destroy|smash|break|bite|strike)/)) {
    scene.mood = 'm:tense'; scene.burst = 'shake'; scene.sfx = 'boom';
    if (npc) {
      fx('💥', npc);
      if (chance(0.4)) { scene.narration = `${glyph(npc)} bolts into the distance. You are alone now.`; remove(npc); } else {
        npc.say = pick(['Ow! Was that really necessary?', 'So that is how it is going to be.', 'You will regret that.', 'Stop! I am on your side!']);
        npc.emote = '😡'; npc.fx = 'shake';
        npc.x = clamp(npc.x + (npc.x > hero.x ? 0.12 : -0.12), 0.05, 0.95);
        const hp = stat(/health|hp|life/i);
        if (hp && chance(0.6)) {
          hp.value -= 1; scene.burst = 'hurt'; scene.narration = 'It hits back. That hurt.';
          if (hp.value <= 0) { hp.value = hp.max || 5; travel('Everything goes dark. When you open your eyes again…'); moved = true; }
        }
      }
    } else {
      const o = nearest(hero, objs());
      if (o) { fx('💥', o); remove(o); scene.narration = `${glyph(o)} breaks apart. The noise carries a long way.`; } else scene.narration = 'You swing at nothing. The air does not mind.';
    }
  } else if (has(/\b(open|unlock|knock|enter|unwrap)/)) {
    const box = nearest(hero, objs().filter((o) => CONTAINERS.includes(glyph(o))));
    const door = objs().find((o) => EXITS.includes(glyph(o)));
    if (box) {
      const loot = pick(LOOT); scene.narration = `It creaks open. Inside: ${loot}`; box.asset = 'e:' + loot; box.id = 'obj-' + uid(); box.fx = 'glow'; scene.sfx = 'bell';
      const gold = stat(/gold|coin|money/i); if (gold && chance(0.5)) { gold.value += 3; scene.narration += ' — and a few coins.'; }
      speak(['I would be careful with that.', 'So it was there all along…', 'Close it. Close it now!']);
    } else if (door) { travel('You step through.'); moved = true; } else {
      scene.entities.push(ent('obj', '🚪', hero.x > 0.5 ? 0.1 : 0.9, 0.66, '', 1.8)); scene.sfx = 'knock';
      scene.narration = 'Nothing here opens. But a door you had not noticed stands in the shadows.';
    }
  } else if (has(/\b(take|pick|grab|steal|pocket|get|collect|keep|lift)/)) {
    const o = (tgt && tgt.id.startsWith('obj-') && tgt.scale < 1.6 && tgt) || nearest(hero, objs().filter((x) => x.scale < 1.6));
    if (o) {
      remove(o);
      if (mods.inventory) { scene.sheet.inv.push({ id: uid(), asset: o.asset, name: '' }); scene.narration = `You take ${glyph(o)}. It is yours now.`; } else scene.narration = `You take ${glyph(o)}. It is heavier than it looks.`;
      speak(['I saw that.', 'Keep it safe. You will need it.', 'That does not belong to you… but fine.']);
    } else scene.narration = tgt ? `${glyph(tgt)} will not budge.` : 'There is nothing here you can carry.';
  } else if (has(/\b(run|flee|escape|leave|go|walk|exit|follow|climb|swim|travel|continue|north|south|east|west|away|outside|jump|fly|sail|ride)/)) {
    travel(pick(['You press on.', 'You do not look back.', 'A long walk later:'])); moved = true;
  } else if (has(/\b(look|examine|search|inspect|read|check|investigate|listen|smell|touch|study|watch|closer)/)) {
    const clue = pick(CLUES);
    scene.entities.push({ ...ent('obj', clue, clamp(hero.x + (chance(0.5) ? 0.14 : -0.14), 0.06, 0.94), clamp(hero.y + 0.06, 0.2, 0.97), '', 0.7), fx: 'glow' });
    scene.narration = `You look closer and find something you missed before: ${clue}`;
    speak(['Hm. I was hoping you would not find that.', 'Now that is interesting.', 'Do you know what it means?']);
  } else if (has(/\b(sleep|wait|rest|sit|hide|nap)/)) {
    scene.backdrop = scene.backdrop === 'b:night' ? 'b:sunset' : 'b:night'; scene.mood = 'm:calm';
    scene.narration = 'Time passes. When you look up, the light has changed.';
    const hp = stat(/health|hp|life/i); if (hp && hp.max && hp.value < hp.max) hp.value += 1;
    if (chance(0.6)) visitor();
  } else if (has(/\b(love|kiss|hug|marry|dance|flirt)/)) {
    if (npc) { fx('❤️', npc); npc.say = pick(['Oh! This is… unexpected.', 'We have only just met!', 'Well. Nobody has asked me that before.']); npc.emote = '😳'; scene.mood = 'm:love'; } else scene.narration = 'A lovely thought, but there is nobody here to share it with.';
  } else if (has(/\b(give|offer|show|hand|pay|trade)/) && npc) {
    npc.say = pick(['For me? …I accept.', 'Keep it. You will need it more than I do.', 'That changes things. Follow me.']);
  } else if (said || has(/\b(talk|ask|speak|hello|greet)/)) { // talk
    const rules2 = [
      [/\b(who|name)\b/, ['Names have power here. Call me a friend.', 'Who I am matters less than who you are.', 'Nobody you need to fear. Probably.']],
      [/\bwhere\b/, ['Where? The very edge of the map.', 'Closer to home than you think.', 'Somewhere you were never meant to find.']],
      [/\bwhy\b/, ['Because someone must. Tonight, that someone is you.', 'I ask myself the same thing.', 'You would not like the answer.']],
      [/\b(what|how)\b/, ['It is simpler than it looks. Watch.', 'What you see is only half of it.', 'I will explain on the way. Come.']],
      [/\bhelp\b/, ['Help has a price. What will you give me?', 'I thought you would never ask.', 'I cannot. But I know who can.']],
      [/\b(yes|ok|okay|sure|fine|agreed)\b/, ['Good. Then we have no time to lose.', 'I knew you would say that.', 'Brave. Or foolish. We will see.']],
      [/\b(no|never|nope|refuse)\b/, ['No? A pity. The night is long.', 'Think again. I will wait.', 'Then you are on your own.']],
      [/\b(thank|thanks)\b/, ['Do not thank me yet.', 'Thank me when it is over.']],
      [/\b(hello|hi|hey|greetings|morning|evening|talk)\b/, ['Hello yourself. You look lost.', 'There you are. I was beginning to worry.', 'Hello. Keep your voice down.']],
      [/\b(sorry|apolog)/, ['Sorry mends nothing. But it is a start.', 'Forget it. We have bigger problems.']],
      [/\?/, ['A good question. I wish I had a good answer.', 'Ask me again when the sun is up.', 'You already know. You just do not like it.']],
    ];
    const hit = rules2.find(([re]) => re.test(text));
    const quote = said.length > 40 ? said.slice(0, 40) + '…' : said;
    const fallback = said ? [`“${quote}” — I have heard stranger things.`, 'Is that so?', 'Hm. Interesting.', 'You talk like someone I used to know.', `“${quote}”, you say. Then we must be careful.`] : ['Yes? I am listening.', 'Speak, then.'];
    if (!speak(hit ? hit[1] : fallback)) {
      scene.narration = 'Your voice echoes. For a while, nobody answers.';
      visitor();
    }
  } else {                                                 // an action we have no rule for
    scene.narration = pick(['You try it. Nothing happens — at first.', 'It works better than you expected.', 'Somewhere, something notices what you just did.', 'For a moment you are sure it was a mistake.']);
    speak(['Interesting choice.', 'I would not have done that.', 'Ha! Bold.', 'Careful…']);
  }

  if (scene.roll && scene.roll.by === 'player' && !moved) { // the dice had their say
    const good = scene.roll.value > scene.roll.sides / 2;
    scene.narration = `${scene.narration} ${good ? 'Luck is with you.' : 'Luck is not with you today.'}`.trim();
  }
  // every few beats, the world does something on its own
  if (!moved && memory.beat % 4 === 0) {
    if (npcs().length < 2 && chance(0.6)) { visitor(); scene.narration = (scene.narration + ' Someone else arrives.').trim(); } else {
      scene.mood = pick(['m:tense', 'm:eerie', 'm:quest']);
      scene.narration = (scene.narration + ' ' + pick(['Far away, a bell begins to ring.', 'The ground trembles, once.', 'The wind changes direction.', 'A light goes out.'])).trim();
    }
  }
  offer();
  return { scene };
}

export { botMove, botName, randomPlace };
