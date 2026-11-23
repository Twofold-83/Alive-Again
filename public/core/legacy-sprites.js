/*
 * The first sprite library: emoji with stable names (asset ids s:<slug>). Nothing offers these any more — every
 * picker shows the pixel-art library — but stories told before it still refer to them, so they are still drawn.
 * Do not rename an item: the slug comes from the name.
 */
export const LEGACY_SPRITES = new Map(); // slug -> { glyph, name, asset }
function cat(id, label, items) {
  return {
    id,
    label,
    items: items.split(',').map((s) => {
      const i = s.indexOf(' '),
        glyph = s.slice(0, i),
        name = s.slice(i + 1);
      let slug = name.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      while (LEGACY_SPRITES.has(slug)) slug += '-x';
      const item = { glyph, name, asset: 's:' + slug };
      LEGACY_SPRITES.set(slug, item);
      return item;
    }),
  };
}

[
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
