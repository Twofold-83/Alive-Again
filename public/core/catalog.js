/*
 * Asset catalog. Every visual in a scene is referenced by an asset id string:
 *
 *   s:<slug>    built-in sprite from the library below (e.g. s:wizard)
 *   b:<slug>    built-in backdrop
 *   c:<id>      custom image stored with one story (uploaded or generated)
 *   e:<text>    raw emoji / short text typed by the Director
 *   m:<name>    music mood (see audio.js)
 *
 * Scenes never embed pixels, only ids. Each built-in sprite has a placeholder
 * look (an emoji) and a stable slug. To raise the art quality later, add image
 * files and list them in public/packs/manifest.json:
 *
 *   { "sprites": { "wizard": "hd/wizard.png" }, "backdrops": { "forest": "hd/forest.jpg" } }
 *
 * Anything listed there replaces the placeholder everywhere, in old stories too.
 * tools/upgrade-sprites.js fills that folder by sending every item below through
 * the asset provider (providers.js), i.e. through whatever paid image service is
 * plugged in. Do not rename an item once stories use it: the slug comes from the name.
 */
import { SPRITE_WIDTH } from '../shared/scene-model.js';

export const SPRITES = new Map(); // slug -> { glyph, name, asset }
function cat(id, label, items) {
  return {
    id,
    label,
    items: items.split(',').map((s) => {
      const i = s.indexOf(' '),
        glyph = s.slice(0, i),
        name = s.slice(i + 1);
      let slug = name.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      while (SPRITES.has(slug)) slug += '-x';
      const item = { glyph, name, asset: 's:' + slug };
      SPRITES.set(slug, item);
      return item;
    }),
  };
}

export const CATEGORIES = [
  cat(
    'people',
    'People',
    '🧑 person,👩 woman,👨 man,🧒 child,👧 girl,👦 boy,👵 old woman grandma,👴 old man grandpa,👶 baby,🧔 bearded man,👱 blond,🧕 woman headscarf,🤵 groom suit,👰 bride,🤰 pregnant,👮 police officer cop,🕵️ detective spy,💂 guard,👷 builder worker,🧑‍⚕️ doctor nurse,🧑‍🍳 cook chef,🧑‍🚀 astronaut,🧑‍🌾 farmer,🧑‍🏫 teacher,🧑‍🎤 singer,🧑‍🎨 artist,🧑‍✈️ pilot,🧑‍🚒 firefighter,🧑‍⚖️ judge,🤴 prince king,👸 princess queen,🥷 ninja thief,🦸 superhero,🦹 villain,🤡 clown,🎅 santa,🧑‍🔬 scientist,🧑‍💻 hacker programmer,🧑‍🔧 mechanic,🧑‍🎓 student,🧑‍💼 office worker,🏃 runner,🧎 kneeling,🧍 standing,💃 dancer woman,🕺 dancer man,🧗 climber,🏊 swimmer,🤺 fencer,🏇 jockey rider,🧘 meditating,🛌 sleeping in bed,👪 family,👫 couple,👯 twins',
  ),
  cat(
    'fantasy',
    'Fantasy',
    '🧙 wizard mage,🧛 vampire,🧟 zombie,🧚 fairy,🧜 mermaid,🧝 elf,🧞 genie,👻 ghost,👽 alien,🤖 robot,👹 ogre demon,👺 goblin,💀 skull skeleton,👿 devil,😇 angel,🐉 dragon,🦄 unicorn,👾 monster,🧌 troll,🦖 dinosaur,🦕 dinosaur long neck,🧿 amulet,🔮 crystal ball,🪄 magic wand,⚗️ potion,🗡️ dagger,⚔️ swords,🛡️ shield,🏹 bow,👑 crown,💍 ring,🏺 urn vase,📜 scroll,🕯️ candle,⚰️ coffin,🪦 grave,🐲 dragon head,🦇 bat,🕷️ spider,🧸 cursed teddy,🪬 hamsa charm,🔱 trident,⚱️ funeral urn,🦴 bone,☠️ skull crossbones,🎃 pumpkin lantern,🌀 portal',
  ),
  cat(
    'faces',
    'Faces',
    '😀 happy face,😂 laughing face,😊 smiling face,😍 in love face,😘 kiss face,😎 cool face,🤔 thinking face,😐 neutral face,🙄 eye roll face,😏 smirk face,😴 sleeping face,😢 crying face,😭 sobbing face,😡 angry face,🤬 cursing face,😱 screaming face,😨 scared face,😰 nervous face,😳 embarrassed face,🥺 pleading face,😤 huffing face,🤢 sick face,🤮 vomiting face,🤕 hurt face,🤒 fever face,🥶 freezing face,🥵 hot face,😵 dizzy face,🤯 mind blown face,🤫 shushing face,🤥 liar face,😈 evil grin face,🥳 party face,🤑 greedy face,🥱 yawning face,😬 grimace face,🫣 peeking face,🤐 zipped mouth face,😶 speechless face,🤨 suspicious face',
  ),
  cat(
    'body',
    'Body',
    '👁️ eye,👀 eyes,👄 mouth,👅 tongue,👃 nose,👂 ear,🦷 tooth,🧠 brain,🫀 heart organ,🫁 lungs,💪 arm muscle,🦵 leg,🦶 foot,👋 waving hand,✋ raised hand,🖐️ open hand,👆 finger pointing up,👉 finger pointing right,👈 finger pointing left,👇 finger pointing down,👍 thumbs up,👎 thumbs down,✊ fist,👏 clapping hands,🤝 handshake,🙏 praying hands,✌️ peace hand,🤞 crossed fingers,🤙 call me hand,🦾 robot arm,🦿 robot leg,💅 nails,👣 footprints,🩸 blood drop,💋 lips kiss mark,🧔‍♂️ beard,👤 silhouette,👥 two silhouettes,🫂 hug,🦻 hearing aid ear',
  ),
  cat(
    'animals',
    'Animals',
    '🐕 dog,🐈 cat,🐎 horse,🐄 cow,🐖 pig,🐑 sheep,🐓 rooster chicken,🦆 duck,🐇 rabbit,🐁 mouse,🐀 rat,🦊 fox,🐺 wolf,🐻 bear,🦁 lion,🐅 tiger,🐘 elephant,🐒 monkey,🦌 deer,🦉 owl,🦅 eagle,🐦 bird,🐍 snake,🐢 turtle,🐸 frog,🐊 crocodile,🐟 fish,🦈 shark,🐙 octopus,🐋 whale,🦀 crab,🐝 bee,🦋 butterfly,🐌 snail,🦍 gorilla,🐼 panda,🐨 koala,🦘 kangaroo,🦒 giraffe,🦓 zebra,🐪 camel,🦏 rhino,🦛 hippo,🐧 penguin,🦜 parrot,🦢 swan,🦩 flamingo,🐬 dolphin,🦭 seal,🐜 ant,🪲 beetle,🦂 scorpion,🐛 caterpillar,🦔 hedgehog,🐿️ squirrel,🦝 raccoon,🐐 goat,🦃 turkey',
  ),
  cat(
    'nature',
    'Nature',
    '🌳 tree,🌲 pine tree,🌴 palm tree,🌵 cactus,🌱 sprout,🌿 herb plant,🍄 mushroom,🌷 tulip flower,🌹 rose,🌻 sunflower,💐 bouquet,🍂 leaves,🪨 rock stone,⛰️ mountain,🌋 volcano,🏝️ island,🔥 fire,💧 water drop,🌊 wave,❄️ snowflake,⛄ snowman,☀️ sun,🌙 moon,⭐ star,☁️ cloud,🌧️ rain cloud,⛈️ storm cloud,🌈 rainbow,⚡ lightning,🌪️ tornado,🕳️ hole,🪵 log wood,🪺 nest,🌾 wheat grass,🍀 clover,🌸 blossom,🪷 lotus,🐚 shell,🪸 coral,🌕 full moon,🌑 dark moon,🪐 planet,🌍 earth globe,☄️ comet,🌫️ fog',
  ),
  cat(
    'places',
    'Places',
    '🏠 house home,🏡 house garden,🏚️ ruined house,🏰 castle,🏯 fortress,⛪ church,🏛️ temple museum,🏥 hospital,🏫 school,🏪 shop store,🏨 hotel,🏢 office building,🏭 factory,⛺ tent,🛖 hut,🗼 tower,⛲ fountain,🌉 bridge,🚪 door,🪟 window,🧱 wall bricks,🚧 barrier,🪧 sign,🗿 statue,⛩️ gate,🎪 circus,🎡 ferris wheel,🛝 slide playground,🚏 bus stop,⚓ anchor,🗺️ map,🏦 bank,🏟️ stadium arena,🕌 mosque,🛕 shrine temple,🗽 liberty statue,🏗️ construction crane,🛤️ railway track,🛣️ highway road,⛽ gas station,🏕️ campsite,🎢 roller coaster,💒 wedding chapel,🏤 post office',
  ),
  cat(
    'blocks',
    'Level pieces',
    '🟫 brown block dirt,🟩 green block grass,🟦 blue block water,🟥 red block lava,🟨 yellow block sand,⬜ white block snow,⬛ black block,🟪 purple block,🟧 orange block,🪜 ladder,🚩 flag,🏁 finish flag,🎯 target,🪤 trap,⛓️ chains,🪝 hook,🧲 magnet,⚙️ gear,🪙 coin,💠 crystal,🔶 orange diamond,🔷 blue diamond,🔺 red spike,🔻 hanging spike,⚪ white ball,🔴 red ball,🟢 green ball,🔵 blue ball,🟡 yellow ball,🟣 purple ball,⚫ black ball,🛢️ barrel,📍 pin marker,🏆 trophy,🔘 button,🎚️ lever,💈 pole,🚥 traffic light,🛗 elevator,🕹️ joystick,🔲 frame,🧨 dynamite,💣 bomb,🗝️ old key,🔑 key,🔒 lock,🔓 open lock,❤️‍🔥 extra life heart',
  ),
  cat(
    'things',
    'Things',
    '🪑 chair,🛏️ bed,🛋️ sofa couch,🚽 toilet,🛁 bath,📺 tv television,💻 laptop computer,📱 phone,☎️ telephone,💡 lamp light,🔦 flashlight,📦 box,🧳 suitcase,💼 briefcase,🎒 backpack,📕 book,✉️ letter envelope,📰 newspaper,🖼️ painting picture,🪞 mirror,⏰ clock,💰 money bag,💎 gem diamond,🎁 gift present,🔨 hammer,🪓 axe,🔪 knife,🔫 water pistol,🔭 telescope,🎈 balloon,🧸 teddy bear,⚽ ball,🎸 guitar,🎹 piano,🪣 bucket,🧹 broom,🕰️ grandfather clock,🛒 cart,💊 pill medicine,🩹 bandage,🚬 cigarette,🚿 shower,🧻 toilet paper,🧼 soap,🧺 basket,🛎️ service bell,🗑️ trash can,🧯 fire extinguisher,🪴 potted plant,🖥️ desktop computer,📻 radio,🎙️ microphone,📷 camera,🎥 movie camera,🔋 battery,🧊 ice cube,🍳 frying pan,🫖 teapot,🗄️ cabinet,📚 books,🪆 nesting doll,🎨 palette,🧩 puzzle piece,♟️ chess pawn,🎲 die,🃏 joker card,🎰 slot machine,🥁 drum,🎺 trumpet,🎻 violin,🪕 banjo,📯 horn',
  ),
  cat(
    'tools',
    'Tools & science',
    '⛏️ pickaxe,🪚 saw,🔧 wrench,🔩 bolt,🧰 toolbox,🪛 screwdriver,✂️ scissors,📎 paperclip,📏 ruler,🖊️ pen,✏️ pencil,🔬 microscope,🧬 dna,💉 syringe,🩺 stethoscope,🧫 petri dish,🌡️ thermometer,⚖️ scales,🧭 compass,⏳ hourglass,📡 satellite dish,🛰️ satellite,🧪 test tube,🔗 chain link,🪢 rope knot,🧵 thread,🪡 needle,🧶 yarn,🔌 plug,🪫 empty battery,💾 disk,📼 tape,🧮 abacus,🪙 token,🎣 fishing rod,🪃 boomerang,🥊 boxing glove,🏒 hockey stick,🎿 skis,🛹 skateboard',
  ),
  cat(
    'wear',
    'Clothes',
    '🎩 top hat,👒 sun hat,🧢 cap,🎓 graduation hat,⛑️ rescue helmet,🪖 army helmet,👓 glasses,🕶️ sunglasses,🥽 goggles,🧣 scarf,🧤 gloves,🧥 coat,👕 shirt,👖 jeans,👗 dress,👘 kimono,🩳 shorts,👙 bikini,👠 high heel,👞 shoe,👢 boot,👟 sneaker,🥾 hiking boot,🧦 socks,👜 handbag,👛 purse,🎭 theatre masks,🎀 ribbon bow,💄 lipstick,🌂 umbrella closed,☂️ umbrella,🦯 cane,📿 beads,🥇 medal,🎖️ military medal,👔 tie,🥼 lab coat,🦺 safety vest,🩱 swimsuit,🪭 fan',
  ),
  cat(
    'food',
    'Food',
    '🍎 apple,🍌 banana,🍇 grapes,🍓 strawberry,🥕 carrot,🌽 corn,🍞 bread,🧀 cheese,🍖 meat,🍗 chicken leg,🍔 burger,🍕 pizza,🍜 noodles soup,🍰 cake,🎂 birthday cake,🍪 cookie,🍫 chocolate,🍬 candy,🥚 egg,☕ coffee,🍵 tea,🥛 milk,🍺 beer,🍷 wine,🍾 bottle champagne,🍽️ plate dinner,🥄 spoon,🍉 watermelon,🍋 lemon,🍒 cherries,🥑 avocado,🌶️ chili pepper,🧅 onion,🥔 potato,🥐 croissant,🥞 pancakes,🍟 fries,🌭 hot dog,🍣 sushi,🍦 ice cream,🍩 donut,🍯 honey pot,🧂 salt,🥫 can,🍲 stew pot,🧃 juice box,🥤 soda cup',
  ),
  cat(
    'vehicles',
    'Vehicles',
    '🚗 car,🚕 taxi,🚓 police car,🚑 ambulance,🚒 fire truck,🚌 bus,🚚 truck,🚜 tractor,🏍️ motorcycle,🚲 bicycle bike,🛴 scooter,🚂 train,🚇 metro subway,✈️ plane,🚁 helicopter,🚀 rocket,🛸 ufo,⛵ sailboat,🚤 speedboat,🚢 ship,🛶 canoe,🎠 carousel horse,🛷 sled,🪂 parachute,🚙 jeep,🏎️ race car,🚐 van,🛻 pickup truck,🚛 big truck,🛵 moped,🛺 rickshaw,🚠 cable car,🛳️ cruise ship,⛴️ ferry,🚃 train car,🛩️ small plane,🎈 hot air balloon,🛞 wheel,🚨 police light',
  ),
  cat(
    'effects',
    'Effects',
    '❗ exclamation,❓ question,💥 explosion bang,💢 anger mark,💤 sleep zzz,❤️ heart love,💔 broken heart,💦 sweat splash,💨 dash wind smoke,✨ sparkles magic,🎵 music note,💬 speech mark,💭 thought cloud,🚫 forbidden,➡️ arrow right,⬅️ arrow left,⬆️ arrow up,⬇️ arrow down,⭕ circle,❌ cross,✅ check,🕸️ web,🎆 fireworks,💫 dizzy stars,🌟 glowing star,💯 hundred,‼️ double exclamation,⁉️ exclamation question,〰️ wavy line,🔆 brightness,🔔 bell,📢 loudspeaker,🗯️ angry speech,♨️ steam,☢️ radioactive,☣️ biohazard,⚠️ warning,⛔ no entry,🆘 sos,💲 dollar sign,🎶 music notes,➕ plus,➖ minus,💕 two hearts,💘 heart arrow,🫧 bubbles,🎇 sparkler,🎉 party popper,🎊 confetti ball,👑 winner crown,🏳️ white flag,🏴‍☠️ pirate flag,🔅 dim light,🧿 evil eye,🪩 disco ball,🕐 clock face,🌠 shooting star,☮️ peace sign',
  ),
];

const stars =
  'radial-gradient(1px 1px at 12% 18%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 31% 9%,#fff 99%,transparent),radial-gradient(1px 1px at 47% 27%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 63% 13%,#fff 99%,transparent),radial-gradient(1px 1px at 78% 31%,#fff 99%,transparent),radial-gradient(1px 1px at 90% 8%,#fff 99%,transparent),radial-gradient(1px 1px at 22% 40%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 70% 45%,#fff 99%,transparent),';
function sun(x, y, c) {
  return `radial-gradient(circle at ${x}% ${y}%,${c} 0 6%,transparent 6.5%),`;
}

export const BACKDROPS = [
  { id: 'b:room', name: 'Room', css: 'linear-gradient(#d9c7a8 0 58%,#6e4f33 58% 60%,#9a7350 60%)' },
  { id: 'b:darkroom', name: 'Dark room', css: 'linear-gradient(#3a3550 0 58%,#1c1a28 58% 60%,#2b2638 60%)' },
  {
    id: 'b:kitchen',
    name: 'Kitchen',
    css: 'linear-gradient(transparent 60%,rgba(0,0,0,.25)),repeating-conic-gradient(#e9e4d8 0 25%,#b9b2a2 0 50%) 0 100%/12% 16%,linear-gradient(#bfe0d8 0 60%,#8a7 60%)',
  },
  {
    id: 'b:hall',
    name: 'Great hall',
    css: 'repeating-linear-gradient(90deg,transparent 0 18%,#3b3340 18% 23%),linear-gradient(#57506a 0 60%,#2a2530 60% 62%,#7a6a5a 62%)',
  },
  {
    id: 'b:dungeon',
    name: 'Dungeon',
    css: 'repeating-linear-gradient(0deg,transparent 0 11%,rgba(0,0,0,.35) 11% 12%),repeating-linear-gradient(90deg,transparent 0 15%,rgba(0,0,0,.3) 15% 16%),linear-gradient(#4b4f58 0 64%,#23252b 64%)',
  },
  {
    id: 'b:ship',
    name: 'Spaceship',
    css: 'repeating-linear-gradient(90deg,transparent 0 24%,#5b6f86 24% 25%),radial-gradient(ellipse at 50% 30%,#061a3a 0 22%,transparent 22.5%),linear-gradient(#aebccb 0 62%,#44505f 62% 64%,#7d8b9b 64%)',
  },
  { id: 'b:meadow', name: 'Meadow', css: sun(80, 18, '#fff6b0') + 'linear-gradient(#8fd3ff 0,#d8f1ff 55%,#6cbf4b 55%,#3f8f2f)' },
  { id: 'b:forest', name: 'Forest', css: 'linear-gradient(#0f3d2a 0,#2f6b3a 50%,#1f4a24 50%,#16351a)' },
  {
    id: 'b:mountain',
    name: 'Mountains',
    css: 'conic-gradient(from 150deg at 30% 30%,#7d8aa0 0 60deg,transparent 0),conic-gradient(from 150deg at 68% 22%,#5f6c84 0 60deg,transparent 0),linear-gradient(#b9dcff 0,#e8f4ff 62%,#5c8a4a 62%,#3c6a34)',
  },
  {
    id: 'b:lake',
    name: 'Lake',
    css: sun(22, 16, '#fff') + 'linear-gradient(#9fd4f5 0,#e6f5ff 45%,#3f7f5a 45% 50%,#3d8ec2 50%,#2a6a9a 82%,#6cab54 82%)',
  },
  { id: 'b:swamp', name: 'Swamp', css: 'linear-gradient(#3d4a2a 0,#6b7a3a 52%,#2f3a1f 52%,#1d2614 70%,#33412a 70%)' },
  { id: 'b:night', name: 'Night', css: stars + sun(82, 16, '#f3f0d8') + 'linear-gradient(#070b24 0,#1c2452 60%,#141a14 60%,#0c100c)' },
  { id: 'b:graveyard', name: 'Graveyard', css: stars + 'linear-gradient(#0d1420 0,#27384a 58%,#1b2a1c 58%,#0e160f)' },
  { id: 'b:sunset', name: 'Sunset', css: sun(50, 56, '#ffe9a8') + 'linear-gradient(#3b2a6b 0,#e0637a 35%,#ffb46b 60%,#3a2a3a 60%,#221a26)' },
  {
    id: 'b:beach',
    name: 'Beach',
    css: sun(15, 14, '#fff6b0') + 'linear-gradient(#7fd0ff 0,#c9eeff 40%,#2a8fd0 40%,#49b3e8 60%,#f2dc9c 60%,#e3c67a)',
  },
  { id: 'b:desert', name: 'Desert', css: sun(78, 20, '#fff') + 'linear-gradient(#ffd9a0 0,#ffeccc 52%,#e2a85a 52%,#c98a3e)' },
  { id: 'b:snow', name: 'Snow', css: 'linear-gradient(#a9c4de 0,#dbe8f4 55%,#fff 55%,#dfe9f2)' },
  { id: 'b:icecave', name: 'Ice cave', css: 'radial-gradient(ellipse at 50% 45%,#d8f4ff 0,#7fc4e8 50%,#1f4f7a 100%)' },
  {
    id: 'b:volcano',
    name: 'Volcano',
    css: 'conic-gradient(from 150deg at 50% 25%,#3a2622 0 60deg,transparent 0),linear-gradient(#2a0f0f 0,#8a2a12 55%,#ff6a1a 55% 58%,#3a1a12 58%)',
  },
  { id: 'b:hell', name: 'Underworld', css: 'radial-gradient(ellipse at 50% 110%,#ffb020 0,#d02a10 35%,#2a0505 75%)' },
  {
    id: 'b:clouds',
    name: 'Above the clouds',
    css: 'radial-gradient(ellipse at 20% 85%,#fff 0 22%,transparent 22.5%),radial-gradient(ellipse at 55% 92%,#fff 0 28%,transparent 28.5%),radial-gradient(ellipse at 88% 84%,#fff 0 20%,transparent 20.5%),linear-gradient(#5fb0ff,#cfe9ff)',
  },
  { id: 'b:street', name: 'Street', css: 'linear-gradient(#9fb4c7 0,#c9d6e0 45%,#8a8f98 45%,#8a8f98 62%,#3d4047 62%,#2c2e33)' },
  {
    id: 'b:city',
    name: 'City night',
    css:
      stars +
      'repeating-linear-gradient(90deg,#141a2e 0 9%,transparent 9% 11%,#1c2440 11% 17%,transparent 17% 18%) 0 100%/100% 46% no-repeat,linear-gradient(#0a1030 0,#3a2f6a 62%,#23262e 62%)',
  },
  {
    id: 'b:road',
    name: 'Open road',
    css: 'repeating-linear-gradient(90deg,#f3e9a0 0 6%,transparent 6% 12%) 0 82%/100% 2% no-repeat,linear-gradient(#8fd0ff 0,#dff2ff 56%,#7fb25a 56% 66%,#44474e 66%)',
  },
  { id: 'b:cave', name: 'Cave', css: 'radial-gradient(ellipse at 50% 45%,#5a4a3e 0,#2a221d 55%,#0d0a08 100%)' },
  { id: 'b:sea', name: 'Underwater', css: 'linear-gradient(#1fa3c9 0,#0b4f7a 70%,#c9b27a 70%,#a8915c)' },
  { id: 'b:space', name: 'Space', css: stars + 'radial-gradient(ellipse at 70% 80%,#2b1650 0,#05030f 70%)' },
  { id: 'b:moon', name: 'Moon surface', css: stars + sun(20, 18, '#4f8fd0') + 'linear-gradient(#02030a 0,#0b0d18 58%,#b9b9c2 58%,#77777f)' },
  {
    id: 'b:level',
    name: 'Platform level',
    css: 'repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 1px,transparent 1px 10%) 0 100%/100% 22% no-repeat,linear-gradient(#6ec6ff 0 78%,#59b33c 78% 82%,#8a5a34 82%)',
  },
  {
    id: 'b:grid',
    name: 'Retro grid',
    css: 'repeating-linear-gradient(0deg,rgba(255,60,220,.5) 0 1px,transparent 1px 10%),repeating-linear-gradient(90deg,rgba(60,220,255,.45) 0 1px,transparent 1px 7.5%),linear-gradient(#12002a,#2a0050)',
  },
  { id: 'b:dream', name: 'Dream', css: 'linear-gradient(135deg,#ffc3e8,#c3d4ff 50%,#c9ffe6)' },
  { id: 'b:alert', name: 'Red alert', css: 'radial-gradient(ellipse at 50% 50%,#ff3b3b 0,#5a0000 80%)' },
  {
    id: 'b:stage',
    name: 'Theatre',
    css: 'linear-gradient(90deg,#7a1020 0 12%,transparent 12% 88%,#7a1020 88%),linear-gradient(#2a0a12 0 62%,#8a6238 62%,#5e4124)',
  },
  { id: 'b:white', name: 'Blank', css: '#f4f1ea' },
  { id: 'b:black', name: 'Void', css: '#000' },
];

/* ---------- the pixel-art library (public/px, made by tools/make-sprites.js) ----------
 * Asset ids p:<slug>. PIXEL holds its categories once loaded; each has a group:
 * char | thing | tile | fx, used by the step-by-step "Add something" questions. */
export const PIXEL = [];
const PX = new Map();
export async function loadPixel() {
  try {
    const r = await fetch('px/index.json', { cache: 'no-cache' });
    if (!r.ok) return;
    for (const c of (await r.json()).categories) {
      const items = c.items.map((i) => {
        const it = { name: i.name, asset: 'p:' + i.slug, kind: i.kind, solid: !!i.solid, group: c.group, w: i.w || 16, h: i.h || 16 };
        PX.set(i.slug, it);
        SPRITE_WIDTH.set(it.asset, it.w);
        return it;
      });
      PIXEL.push({ id: 'px-' + c.id, label: c.label, group: c.group, items });
    }
  } catch {
    /* no pixel pack: the emoji library is used */
  }
}
/** Every searchable built-in sprite, pixel art first. */
export function allItems() {
  return PIXEL.flatMap((c) => c.items); // the emoji library is still understood (old stories use it) but no longer offered
}

/* ---------- art packs (higher quality replacements for the placeholders) ---------- */
export const PACK = { sprites: {}, backdrops: {}, pixel: {} };
export async function loadPack() {
  try {
    const r = await fetch('packs/manifest.json', { cache: 'no-cache' });
    if (r.ok) {
      const j = await r.json();
      Object.assign(PACK.sprites, j.sprites);
      Object.assign(PACK.backdrops, j.backdrops);
      Object.assign(PACK.pixel, j.pixel);
    }
  } catch {
    /* no pack installed: placeholders are used */
  }
}

export function assetUrl(code, id) {
  return `/api/rooms/${code}/assets/${id.slice(2)}`;
}

/** How to draw a sprite asset: { img: url } or { glyph: text }. */
export function spriteView(code, asset) {
  if (asset.startsWith('c:')) return { img: assetUrl(code, asset) };
  if (asset.startsWith('p:')) return { img: PACK.pixel[asset.slice(2)] ? 'packs/' + PACK.pixel[asset.slice(2)] : `px/${asset.slice(2)}.png` }; // an art pack can replace any pixel sprite
  if (asset.startsWith('s:')) {
    const slug = asset.slice(2),
      it = SPRITES.get(slug);
    return PACK.sprites[slug] ? { img: 'packs/' + PACK.sprites[slug] } : { glyph: it ? it.glyph : '❓' };
  }
  return { glyph: asset.slice(2) };
}
/** Short text for an asset, for sentences like "reaches for 🔑". */
export function assetLabel(asset, name) {
  if (asset.startsWith('d:')) return name || 'the figure';
  const v = spriteView('', asset);
  if (v.glyph) return v.glyph;
  const it = asset.startsWith('s:') ? SPRITES.get(asset.slice(2)) : asset.startsWith('p:') ? PX.get(asset.slice(2)) : null;
  return name || (it ? 'the ' + it.name.split(' ').slice(0, 3).join(' ') : 'it');
}
/** Catalog facts about a pixel sprite: { kind: 'floor'|'wall' } for tiles, { solid } for props. */
export function pixelInfo(asset) {
  return (asset.startsWith('p:') && PX.get(asset.slice(2))) || {};
}
/** A plain name for a pixel sprite, good enough to show the Player: 'p:old-oak-chest' -> 'Old oak chest'. */
export function spriteTitle(asset) {
  const words = asset.replace(/^[a-z]:/, '').replace(/-/g, ' ');
  return words ? words[0].toUpperCase() + words.slice(1) : 'Thing';
}
export function assetName(asset) {
  const it = asset.startsWith('s:') ? SPRITES.get(asset.slice(2)) : asset.startsWith('p:') ? PX.get(asset.slice(2)) : null;
  return it ? it.name.split(' ').slice(0, 2).join(' ') : '';
}

export function backdropCss(code, id) {
  if (id && id.startsWith('c:')) return `url("${assetUrl(code, id)}") center/cover no-repeat #000`;
  if (id && PACK.backdrops[id.slice(2)]) return `url("packs/${PACK.backdrops[id.slice(2)]}") center/cover no-repeat #000`;
  return (BACKDROPS.find((b) => b.id === id) || BACKDROPS[0]).css;
}
