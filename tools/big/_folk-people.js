/*
 * The ready-made people, put together from what each one is called in public/px/index.json: "old man flat cap
 * grey beard" becomes an old build, a flat cap and a grey beard. The rules below read the words; folk.js draws.
 * A person not covered by any rule still comes out as a plainly dressed man or woman.
 */
const fs = require('fs');
const path = require('path');

module.exports = ({ P, I, CLOTH }) => {
  const index = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'px', 'index.json'), 'utf8'));
  const hash = (s) => {
    let h = 7;
    for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  };
  const COLOURS = {
    red: 'wine',
    blue: 'navy',
    green: 'forest',
    yellow: 'mustard',
    orange: 'orange',
    purple: 'plum',
    pink: 'pink',
    white: 'white',
    black: 'black',
    gold: 'gold',
    grey: 'grey',
    brown: 'earth',
    dark: 'charcoal',
  };
  const PLAIN = ['navy', 'forest', 'wine', 'slate', 'earth', 'teal', 'plum', 'rust', 'mustard', 'ash', 'denim', 'khaki'];

  for (const id of ['heroes', 'townsfolk', 'people', 'cast']) {
    for (const it of index.categories.find((c) => c.id === id).items) {
      const n = ' ' + it.name + ' ' + it.slug.replace(/-/g, ' ') + ' ',
        has = (re) => re.test(n),
        k = hash(it.slug),
        pick = (list, salt = 0) => list[(k >>> salt) % list.length];
      const colourWord = Object.keys(COLOURS).find(
        (w) =>
          new RegExp(`\\b${w}\\b`).test(n) && !new RegExp(`${w} (beard|hair|hat|cap|helmet|bandana|hood|eye|nose|gloves|tie|plume|belt)`).test(n),
      );
      const col = colourWord ? COLOURS[colourWord] : null;
      const o = {};
      const extras = [];
      const hold = (fn) => extras.push(fn);

      /* build */
      const kid = has(/\b(kid|child|baby|schoolboy|schoolgirl|cabin boy|scout|karate kid)\b/) || it.slug === 'boy' || it.slug === 'girl';
      const old = has(/\b(old|elder|grandpa|grandma|granny|sensei|professor|santa|mrs claus)\b/);
      const small = has(/\b(dwarf|leprechaun|christmas elf)\b/);
      const teen = has(/\b(teen|student|schoolboy|schoolgirl|prince|princess|karate)\b/) && !kid;
      o.g = kid ? 'kid' : small ? 'short' : old ? 'old' : teen ? 'teen' : 'adult';
      const woman =
        has(
          /\b(woman|girl|heroine|queen|princess|priestess|sorceress|witch|maid|mum|grandma|granny|bride|waitress|lady|mrs|ballerina|businesswoman|superheroine|valkyrie|swordswoman|cowgirl|mermaid|fairy|noblewoman|hostess|fortune|schoolgirl|nurse|librarian|florist|singer)\b/,
        ) && !has(/nurse man/);

      /* skin and hair */
      o.skin = has(/dark skin|afro/) ? 'brown' : pick(['pale', 'fair', 'fair', 'tan', 'fair', 'brown', 'pale', 'tan'], 3);
      const hairCol = has(/white (beard|hair)|wild white/)
        ? 'white'
        : has(/grey/) || old
          ? pick(['grey', 'white', 'grey'], 5)
          : has(/orange beard|ginger/)
            ? 'ginger'
            : pick(['black', 'brown', 'brown', 'red', 'blond', 'black'], 7);
      const style = has(/afro/)
        ? 'afro'
        : has(/curly/)
          ? 'curls'
          : has(/\bbun\b/)
            ? 'bun'
            : has(/\bbob\b/)
              ? 'bob'
              : has(/ponytail/)
                ? 'ponytail'
                : has(/pigtails/)
                  ? 'pigtails'
                  : has(/mohawk|punk/)
                    ? 'mohawk'
                    : has(/\bbald\b|strongman|monk/)
                      ? 'bald'
                      : has(/wild|professor|caveman|werewolf/)
                        ? 'wild'
                        : has(/long hair/)
                          ? 'long'
                          : woman
                            ? pick(old ? ['bun', 'curls', 'bob'] : ['long', 'bob', 'ponytail', 'bun', 'flowing', 'curls'], 9)
                            : pick(old ? ['balding', 'cropped', 'sides'] : ['cropped', 'parted', 'quiff', 'cropped', 'fringe'], 9);
      o.hair = `${style} ${hairCol}`;
      if (has(/white beard|grey beard|dwarf|santa|prospector|sensei|elder old man|ship captain|pirate captain/)) o.beard = `full ${hairCol}`;
      else if (has(/orange beard/)) o.beard = 'full ginger';
      else if (has(/beard/)) o.beard = 'full';
      else if (has(/mustache|moustache/)) o.beard = 'tache';
      else if (has(/caveman|lumberjack|barbarian|viking/)) o.beard = 'full';

      /* on the head */
      const hat = (h) => (o.hat = h);
      if (has(/pharaoh/)) hat('nemes gold');
      else if (has(/christmas elf/)) hat('elfcap green');
      else if (has(/\bking\b|queen|prince\b/)) hat('crown gold');
      else if (has(/princess|tiara/)) hat('tiara gold');
      else if (has(/pharaoh/)) hat('nemes gold');
      else if (has(/viking|horned/)) hat('horned steel');
      else if (has(/valkyrie/)) hat('winged steel');
      else if (has(/red knight/)) hat('plume steel');
      else if (has(/guard captain/)) hat('plume steel');
      else if (has(/space trooper/)) hat('greathelm white');
      else if (has(/paladin|samurai|knight/)) hat(has(/paladin/) ? 'helm gold' : has(/samurai/) ? 'kettle wine' : 'helm steel');
      else if (has(/\bguard soldier|lancer|gladiator/)) hat('kettle steel');
      else if (has(/witch/)) hat('witch black');
      else if (has(/wizard|\bmage\b|warlock|sorceress|alchemist/)) hat(`wizard ${col || 'navy'}`);
      else if (has(/straw hat/)) hat('straw straw');
      else if (has(/sun hat/)) hat('sunhat straw');
      else if (has(/chef|\bcook\b|baker/)) hat('chef white');
      else if (has(/police/)) hat('custodian navy');
      else if (has(/hard hat|builder|engineer/)) hat('hardhat yellow');
      else if (has(/firefighter/)) hat(has(/yellow/) ? 'firehelm yellow' : 'firehelm red');
      else if (has(/miner|prospector/)) hat('minerhelm yellow');
      else if (has(/soldier army/)) hat('armyhelm green');
      else if (has(/cyclist|skater|delivery rider/)) hat('bikehelm red');
      else if (has(/beanie/)) hat(`beanie ${pick(['wine', 'teal', 'mustard'], 4)}`);
      else if (has(/turban/)) hat('turban cream');
      else if (has(/hijab/)) hat(`hijab ${pick(['teal', 'plum', 'navy'], 4)}`);
      else if (has(/beret|artist/)) hat('beret wine');
      else if (has(/cowboy|cowgirl|sheriff|outlaw|park ranger|lion tamer/)) hat('cowboy earth');
      else if (has(/pirate captain|pirate hero/)) hat('tricorn black');
      else if (has(/sailor/)) hat('sailor white');
      else if (has(/flat cap/)) hat('flatcap slate');
      else if (has(/detective|\bspy\b/)) hat('fedora earth');
      else if (has(/safari|pith/)) hat('pith khaki');
      else if (has(/santa|mrs claus/)) hat('santa red');
      else if (has(/christmas elf/)) hat('elfcap green');
      else if (has(/party hat|birthday/)) hat('party pink');
      else if (has(/graduate/)) hat('mortar black');
      else if (has(/judge/)) hat('judgewig white');
      else if (has(/bride/)) hat('veil white');
      else if (has(/jester/)) hat('jester wine');
      else if (has(/ninja/)) hat(`ninja ${col === 'wine' ? 'wine' : col === 'navy' ? 'navy' : 'black'}`);
      else if (has(/swimmer|swim cap/)) hat('swimcap navy');
      else if (has(/headphones|\bdj\b/)) hat('phones black');
      else if (has(/clown/)) hat('clownwig red');
      else if (has(/top hat|magician|ringmaster|leprechaun/)) hat(has(/leprechaun/) ? 'tophat green' : 'tophat black');
      else if (has(/ship captain|pilot|conductor|security|mail carrier|bus driver|space captain/)) hat('peaked navy');
      else if (has(/\bcap\b|plumber|coach|courier|scout/)) hat(`cap ${has(/plumber|red cap/) ? 'red' : pick(['navy', 'forest', 'wine'], 4)}`);
      else if (has(/nurse/) && woman) hat('nurse white');
      else if (has(/granny|maid|mrs claus/)) hat('bonnet white');
      else if (has(/bandana|pirate/)) hat(`bandana ${has(/red|pirate/) ? 'red' : 'navy'}`);
      else if (has(/hood|rogue|assassin|ranger|beggar|hacker|druid|cleric|ghost/))
        hat(`hood ${has(/assassin/) ? 'wine' : has(/ghost/) ? 'white' : has(/druid|ranger/) ? 'forest' : has(/beggar/) ? 'earth' : 'charcoal'}`);
      if (has(/elf\b/) && !has(/christmas/)) o.hair = `long blond`;

      const wear = [];
      if (has(/sunglasses|secret agent|lifeguard/)) wear.push('shades');
      else if (has(/glasses|programmer|scientist|librarian|professor|grandpa|grandma/)) wear.push('glasses');
      if (has(/eyepatch|pirate captain/)) wear.push('patch');
      if (has(/superhero|superheroine|burglar|villain/)) wear.push('domino');
      if (has(/outlaw|bandit/)) wear.push('scarfmask:wine');
      if (has(/surgeon/)) wear.push('surgical');
      if (has(/\belf\b|fairy|christmas elf/)) wear.push('elfears');
      if (has(/clown/)) wear.push('rednose');
      if (has(/vampire/)) wear.push('fangs');
      if (has(/scuba|ski/)) wear.push('goggles');
      if (has(/cyborg/)) wear.push('patch');
      if (wear.length) o.wear = wear;
      o.expr = has(/villain|warlock|outlaw|assassin|burglar|frankenstein|werewolf|boss/)
        ? 'stern'
        : has(/clown|jester|birthday|santa|kid balloon/)
          ? 'smile'
          : old
            ? 'old'
            : 'calm';

      /* clothes */
      const c1 = col || pick(PLAIN, 11),
        dressCol = col || pick(['wine', 'teal', 'plum', 'navy', 'forest', 'mustard'], 13);
      let legs = `trousers ${pick(['slate', 'earth', 'charcoal', 'denim', 'navy'], 15)}`;
      const robe = (c) => {
        o.top = `robe ${c}`;
        o.skirt = `${c} long`;
      };
      const dress = (c, len = 'long') => {
        o.top = `dress ${c}`;
        o.skirt = `${c} ${len}`;
        legs = 'stockings cream';
      };
      if (has(/astronaut|space girl|space suit/)) {
        o.top = `spacesuit ${has(/orange/) ? 'orange' : has(/pink/) ? 'pink' : 'white'}`;
        legs = `trousers ${has(/orange/) ? 'orange' : has(/pink/) ? 'pink' : 'white'} grey`;
        if (!has(/space girl/)) o.hat = 'greathelm white';
      } else if (has(/android|robot/)) {
        o.top = 'robot silver';
        o.arms = 'robot silver';
        legs = 'robot silver';
        o.skin = 'ashen';
        o.hair = 'bald';
      } else if (has(/space trooper/)) {
        o.top = 'plate white';
        legs = 'plate white';
      } else if (has(/paladin/)) {
        o.top = 'plate gold';
        legs = 'plate gold';
      } else if (has(/samurai|red knight/)) {
        o.top = 'plate wine';
        legs = 'plate wine';
      } else if (has(/knight|valkyrie|guard captain/)) {
        o.top = 'plate steel';
        legs = 'plate steel';
      } else if (has(/guard soldier|lancer|viking|dwarf|swordswoman/)) {
        o.top = 'mail steel';
        legs = 'boots earth';
      } else if (has(/gladiator|barbarian|caveman|strongman|boxer|swimmer|lifeguard|genie|mermaid|baby/)) {
        o.top = 'bare';
        legs = has(/baby/) ? 'shorts white' : has(/boxer|swimmer|lifeguard/) ? 'shorts red' : has(/genie/) ? 'trousers sky' : 'shorts earth';
        if (has(/genie/)) o.skin = 'drowned';
        if (has(/mermaid/)) {
          o.top = 'bodice teal';
          o.skirt = 'green long';
        }
      } else if (has(/werewolf/)) {
        o.top = 'rags earth';
        o.arms = 'fur earth';
        legs = 'fur earth';
        o.skin = 'brown';
      } else if (has(/frankenstein/)) {
        o.top = 'jacket charcoal';
        o.skin = 'rotten';
        o.hair = 'cropped black';
        legs = 'trousers charcoal';
      } else if (has(/easter bunny/)) {
        o.top = 'jumper white';
        o.arms = 'fur white';
        legs = 'fur white';
        o.hat = 'hood white';
      } else if (has(/ghost/)) robe('white');
      else if (has(/pumpkin/)) {
        o.top = 'jumper orange';
        o.skin = [184, 100, 31];
        o.hair = 'bald';
        o.expr = 'hollow';
      } else if (has(/\bking\b/)) {
        robe('wine');
        o.cape = 'wine';
      } else if (has(/queen|princess|noblewoman|bride|mrs claus|fairy/))
        dress(
          has(/bride/) ? 'white' : has(/queen/) ? 'plum' : has(/princess/) ? 'pink' : has(/mrs claus/) ? 'red' : has(/fairy/) ? 'lime' : 'navy',
          has(/fairy/) ? 'knee' : 'long',
        );
      else if (has(/santa/)) {
        o.top = 'coat red';
        legs = 'trousers red black';
      } else if (has(/priest black|\bpriest\b/) && !has(/priestess/)) {
        o.top = 'cassock black';
        o.skirt = 'black long';
      } else if (has(/monk/)) robe(has(/orange/) ? 'orange' : 'earth');
      else if (has(/priestess|cleric/)) robe('white');
      else if (has(/judge|warlock|witch|graduate/)) robe('black');
      else if (has(/mage fire|fire mage/)) robe('wine');
      else if (has(/ice mage/)) robe('sky');
      else if (has(/sorceress|fortune/)) robe('plum');
      else if (has(/druid|alchemist/)) robe('forest');
      else if (has(/wizard|\bmage\b|pharaoh|sensei/)) robe(has(/pharaoh|sensei/) ? 'white' : col || 'navy');
      else if (has(/karate|ninja/)) {
        o.top = `gi ${has(/karate/) ? 'white' : col || 'black'}`;
        legs = `trousers ${has(/karate/) ? 'white' : col || 'black'}`;
      } else if (has(/doctor|scientist|professor/)) o.top = 'labcoat white';
      else if (has(/surgeon|nurse man|scrubs/)) {
        o.top = 'tee scrubs';
        legs = 'trousers scrubs';
      } else if (has(/nurse/)) dress('white', 'knee');
      else if (has(/paramedic|builder|engineer|crossing guard|cleaner/)) o.top = 'hivis yellow';
      else if (
        has(/police|pilot|captain|conductor|security|soldier|park ranger|scout|bus driver|mail|flight attendant|sheriff|safari|space captain/)
      ) {
        const u = has(/soldier|park ranger|scout/) ? 'green' : has(/safari|sheriff/) ? 'khaki' : has(/mail/) ? 'blue' : 'navy';
        o.top = `uniform ${u}`;
        legs = `trousers ${u}`;
      } else if (has(/firefighter/)) {
        o.top = 'coat charcoal';
        legs = 'trousers charcoal';
      } else if (has(/groom|waiter|magician|butler|ringmaster/)) {
        o.top = has(/ringmaster/) ? 'coat red' : 'tux black';
        legs = 'trousers black';
      } else if (has(/suit|boss|businesswoman|office|agent|nobleman|reporter|teacher man|spy woman|supervillain/)) {
        o.top = `${has(/boss|nobleman/) ? 'pinstripe' : 'suit'} ${has(/black|agent|boss|villain|spy/) ? 'black' : pick(['slate', 'navy', 'charcoal'], 4)}`;
        legs = `trousers ${has(/black|agent|boss|villain|spy/) ? 'black' : 'slate'}`;
      } else if (has(/detective|\bspy\b|trench/)) o.top = 'trench khaki';
      else if (has(/winter coat|mountaineer|hiker/)) o.top = `coat ${pick(['wine', 'teal', 'navy'], 4)}`;
      else if (has(/mechanic|plumber|overalls|house painter/)) o.top = `overalls ${has(/painter/) ? 'white' : has(/plumber/) ? 'blue' : 'denim'}`;
      else if (has(/apron|shopkeeper|blacksmith|barista|baker|chef|\bcook\b|innkeeper|waitress|maid|hairdresser|florist/)) {
        o.top = `apron ${has(/green/) ? 'green' : has(/red apron/) ? 'red' : has(/blacksmith/) ? 'leather' : 'white'}`;
        if (woman) {
          o.skirt = `${has(/maid/) ? 'black' : dressCol} ${has(/maid/) ? 'long' : 'knee'}`;
          legs = 'stockings cream';
        }
      } else if (has(/burglar|referee|first mate|sailor|pirate with/))
        o.top = `stripes ${has(/referee/) ? 'black' : has(/sailor/) ? 'navy' : 'wine'}`;
      else if (has(/hoodie|hacker|programmer|teen boy/)) o.top = `hoodie ${col || pick(['slate', 'teal', 'wine'], 4)}`;
      else if (has(/jumper|winter|grandpa|old man|elder|dad|villager|fisherman/)) o.top = `jumper ${c1}`;
      else if (has(/basketball|runner|tank/)) {
        o.top = `tank ${pick(['wine', 'navy', 'mustard'], 4)}`;
        legs = 'shorts black';
      } else if (has(/footballer|football|tennis|skater|cyclist|tourist|kid|boy\b|coach|dj|guitarist|juggler|acrobat|delivery|courier/)) {
        o.top = `tee ${has(/tennis/) ? 'white' : has(/tourist/) ? 'orange' : c1}`;
        if (has(/football|tennis|skater|cyclist|kid football|boy\b/)) legs = 'shorts navy';
      } else if (has(/beggar/)) o.top = 'rags earth';
      else if (has(/superhero|superheroine/)) {
        o.top = `tee ${woman ? 'wine' : 'blue'}`;
        legs = `trousers ${woman ? 'wine' : 'blue'} red`;
        o.cape = 'red';
      } else if (has(/pirate|cowboy|cowgirl|outlaw|prospector|innkeeper|bard|lion tamer/))
        o.top = `waistcoat ${pick(['wine', 'earth', 'leather'], 4)}`;
      else if (has(/rogue|thief|assassin|ranger|archer|lumberjack|shepherd|gravedigger|hero\b|adventurer|elf|farmer|miner|merchant/)) {
        o.top = `${has(/rogue|thief|assassin|ranger/) ? 'jerkin' : 'tunic'} ${has(/assassin/) ? 'wine' : has(/ranger|archer|elf|hero\b|adventurer/) ? 'forest' : has(/rogue|thief/) ? 'charcoal' : c1}`;
        legs = 'boots earth';
      } else if (has(/heroine/)) {
        o.top = 'tunic teal';
        legs = 'boots earth';
      } else if (has(/ballerina/)) {
        o.top = 'bodice pink';
        o.skirt = 'pink short 2';
        o.tutu = true;
        legs = 'stockings pink';
      } else if (has(/dress|granny|grandma|old woman|woman sunhat|girl|gardener|singer/) && woman)
        dress(dressCol, kid || has(/summer|girl/) ? 'knee' : 'long');
      else if (woman) {
        o.top = `blouse ${c1}`;
        if (has(/skirt/) || k % 3 === 0) {
          o.skirt = `${pick(['slate', 'navy', 'earth', 'plum'], 6)} knee`;
          legs = 'stockings cream';
        }
      } else o.top = `shirt ${c1}`;
      if (has(/cape|supervillain|vampire/) && !o.cape) o.cape = has(/vampire|villain|dark/) ? 'black' : 'red';
      if (kid && /^trousers/.test(legs) && !has(/schoolboy|karate|costume|ghost/)) legs = `shorts ${legs.split(' ')[1]}`;
      if (has(/pegleg|peg leg/)) o.legR = 'pegleg';
      if (has(/hook/)) o.armR = 'hook';
      if (has(/boxer|red gloves/)) o.arms = 'glove red';
      o.legs = legs;

      /* in the hands */
      if (has(/sword|knight|samurai|ninja red|swordswoman/) && !has(/paladin/)) hold((s, m) => I.sword(s, m, m.RX));
      if (has(/shield|knight\b|gladiator/)) hold((s, m) => I.shield(s, m, has(/red/) ? CLOTH.wine : CLOTH.navy));
      if (has(/staff|\bmage\b|wizard|druid|warlock|sorceress/)) hold((s, m) => I.staff(s, m, m.RX, 2, undefined, true));
      if (has(/spear|lancer|valkyrie/)) hold((s, m) => I.spear(s, m, m.RX, 0));
      if (has(/dagger/)) hold((s, m) => I.dagger(s, m, m.RX));
      if (has(/\baxe\b/)) hold((s, m) => I.axe(s, m, m.RX, 6, has(/barbarian|viking/)));
      if (has(/hammer/)) hold((s, m) => I.hammer(s, m, m.RX, 6));
      if (has(/\bbow\b/) && !has(/bow tie/)) hold((s, m) => (I.bow(s, m, m.LX), I.quiver(s, m)));
      if (has(/broom/)) hold((s, m) => I.broom(s, m, m.RX, 4));
      if (has(/pitchfork/)) hold((s, m) => I.fork(s, m, m.RX, 2));
      if (has(/pickaxe/)) hold((s, m) => I.pick(s, m, m.RX, 6));
      if (has(/gravedigger/)) hold((s, m) => (I.shovel(s, m, m.LX, 4), I.lantern(s, m, m.RX)));
      else if (has(/lantern|torch/)) hold((s, m) => I.lantern(s, m, m.RX));
      if (has(/crook|walking stick/)) hold((s, m) => I.crook(s, m, m.RX, 2));
      if (has(/\bcane\b|elder old man/)) hold((s, m) => I.cane(s, m, m.RX));
      if (has(/sack/)) hold((s, m) => I.sack(s, m, CLOTH.khaki, true));
      if (has(/backpack|hiker|mountaineer/)) o.back = (s, m) => I.pack(s, m, CLOTH.forest);
      if (has(/\bbook|librarian|scholar/)) hold((s, m) => I.book(s, m, m.LX));
      if (has(/clipboard|ticket|letter/)) hold((s, m) => I.clipboard(s, m, m.LX));
      if (has(/\bmug\b|coffee/)) hold((s, m) => I.mug(s, m, m.RX));
      if (has(/tray/)) hold((s, m) => I.tray(s, m, m.RX, m.HY - 2));
      if (has(/balloon/)) hold((s, m) => I.balloon(s, m, m.RX, CLOTH.red));
      if (has(/bouquet/)) hold((s, m) => I.bouquet(s, m, m.cx, m.HY, CLOTH.pink));
      else if (has(/flower/)) hold((s, m) => I.flower(s, m.RX, m.HY - 3, CLOTH.pink));
      if (has(/football|soccer|basketball/)) hold((s, m) => I.ball(s, m.RX + 2, m.FY - 3, has(/basketball/) ? CLOTH.orange : CLOTH.white, 3));
      if (has(/camera|photographer/)) hold((s, m) => I.camera(s, m.cx - 2, m.armY + 3));
      if (has(/briefcase/)) hold((s, m) => I.briefcase(s, m, m.RX));
      if (has(/scarf|winter/)) hold((s, m) => I.scarf(s, m, CLOTH.wine));
      if (has(/\btie\b/) && !has(/bow tie/)) hold((s, m) => I.tie(s, m, has(/gold tie/) ? CLOTH.gold : CLOTH.wine));
      if (has(/stethoscope|doctor/)) hold((s, m) => I.stetho(s, m));
      if (has(/sheriff|police|badge/)) hold((s, m) => I.badge(s, m));
      if (has(/fairy/)) o.back = (s, m) => I.wings(s, m, CLOTH.sky, false);
      for (const [word, kind] of [
        ['wrench', 'wrench'],
        ['brush', 'brush'],
        ['scissors', 'scissors'],
        ['microphone', 'mic'],
        ['wand', 'wand'],
        ['magnifier', 'wand'],
      ])
        if (n.includes(word)) hold((s, m) => I.tool(s, m, m.RX, kind));
      if (extras.length)
        o.extra = (s, m) => {
          for (const fn of extras)
            try {
              fn(s, m);
            } catch {
              /* a prop that does not fit this build is left out */
            }
        };
      try {
        P(it.slug, o);
      } catch (e) {
        /* a combination folk.js cannot draw: fall back to plain clothes rather than lose the person */
        P(it.slug, { g: o.g, skin: typeof o.skin === 'string' ? o.skin : 'fair', hair: o.hair, top: `shirt ${c1}`, legs: 'trousers slate' });
        console.warn(`people: ${it.slug} drawn plainly (${e.message})`);
      }
    }
  }
};
