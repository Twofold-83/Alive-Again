/*
 * Asset catalog. Every visual in a scene is referenced by an asset id string:
 *
 *   e:<emoji or short text>   built-in glyph sprite (rendered as text)
 *   b:<name>                  built-in backdrop (CSS background)
 *   c:<id>                    custom image stored on the server for this story
 *                             (uploaded by the Director or produced by the
 *                             asset provider — this is where AI assets land)
 *   m:<name>                  music mood (see audio.js)
 *
 * Scenes never embed pixels, only ids, so swapping the art style later means
 * changing this file / the provider, not the game.
 */
const cat = (id, label, items) => ({
  id, label,
  items: items.split(',').map((s) => { const i = s.indexOf(' '); return { asset: 'e:' + s.slice(0, i), name: s.slice(i + 1) }; }),
});

export const CATEGORIES = [
  cat('people', 'People', '🧑 person,👩 woman,👨 man,🧒 child,👧 girl,👦 boy,👵 old woman grandma,👴 old man grandpa,👶 baby,🧔 bearded man,👱 blond,🧕 woman headscarf,🤵 groom suit,👰 bride,🤰 pregnant,👮 police officer cop,🕵️ detective spy,💂 guard,👷 builder worker,🧑‍⚕️ doctor nurse,🧑‍🍳 cook chef,🧑‍🚀 astronaut,🧑‍🌾 farmer,🧑‍🏫 teacher,🧑‍🎤 singer,🧑‍🎨 artist,🧑‍✈️ pilot,🧑‍🚒 firefighter,🧑‍⚖️ judge,🤴 prince king,👸 princess queen,🥷 ninja thief,🦸 superhero,🦹 villain,🤡 clown,🎅 santa'),
  cat('fantasy', 'Fantasy', '🧙 wizard mage,🧛 vampire,🧟 zombie,🧚 fairy,🧜 mermaid,🧝 elf,🧞 genie,👻 ghost,👽 alien,🤖 robot,👹 ogre demon,👺 goblin,💀 skull skeleton,👿 devil,😇 angel,🐉 dragon,🦄 unicorn,👾 monster,🧌 troll,🦖 dinosaur,🦕 dinosaur long neck,🧿 amulet,🔮 crystal ball,🪄 magic wand,⚗️ potion,🗡️ dagger,⚔️ swords,🛡️ shield,🏹 bow,👑 crown,💍 ring,🏺 urn vase,📜 scroll,🕯️ candle,⚰️ coffin,🪦 grave'),
  cat('animals', 'Animals', '🐕 dog,🐈 cat,🐎 horse,🐄 cow,🐖 pig,🐑 sheep,🐓 rooster chicken,🦆 duck,🐇 rabbit,🐁 mouse,🐀 rat,🦊 fox,🐺 wolf,🐻 bear,🦁 lion,🐅 tiger,🐘 elephant,🐒 monkey,🦌 deer,🦉 owl,🦅 eagle,🐦 bird,🦇 bat,🐍 snake,🐢 turtle,🐸 frog,🐊 crocodile,🐟 fish,🦈 shark,🐙 octopus,🐋 whale,🦀 crab,🕷️ spider,🐝 bee,🦋 butterfly,🐌 snail'),
  cat('nature', 'Nature', '🌳 tree,🌲 pine tree,🌴 palm tree,🌵 cactus,🌱 sprout,🌿 herb plant,🍄 mushroom,🌷 tulip flower,🌹 rose,🌻 sunflower,💐 bouquet,🍂 leaves,🪨 rock stone,⛰️ mountain,🌋 volcano,🏝️ island,🔥 fire,💧 water drop,🌊 wave,❄️ snowflake,⛄ snowman,☀️ sun,🌙 moon,⭐ star,☁️ cloud,🌧️ rain,⛈️ storm,🌈 rainbow,⚡ lightning,🌪️ tornado,🕳️ hole,🪵 log wood,🪺 nest'),
  cat('places', 'Places', '🏠 house home,🏡 house garden,🏚️ ruined house,🏰 castle,🏯 fortress,⛪ church,🏛️ temple museum,🏥 hospital,🏫 school,🏪 shop store,🏨 hotel,🏢 office building,🏭 factory,⛺ tent,🛖 hut,🗼 tower,⛲ fountain,🌉 bridge,🚪 door,🪟 window,🪜 ladder,🧱 wall bricks,🚧 barrier,🪧 sign,🗿 statue,⛩️ gate,🎪 circus,🎡 ferris wheel,🛝 slide playground,🚏 bus stop,⚓ anchor,🗺️ map'),
  cat('things', 'Things', '🪑 chair,🛏️ bed,🛋️ sofa couch,🚽 toilet,🛁 bath,📺 tv television,💻 laptop computer,📱 phone,☎️ telephone,💡 lamp light,🔦 flashlight,🔑 key,🗝️ old key,🔒 lock,📦 box,🧳 suitcase,💼 briefcase,🎒 backpack,📕 book,✉️ letter envelope,📰 newspaper,🖼️ painting picture,🪞 mirror,⏰ clock,💰 money bag,💎 gem diamond,🎁 gift present,🔨 hammer,🪓 axe,🔪 knife,🔫 water pistol,💣 bomb,🧨 dynamite,🔭 telescope,🎈 balloon,🧸 teddy bear,⚽ ball,🎸 guitar,🎹 piano,🪣 bucket,🧹 broom,🕰️ grandfather clock,🛒 cart,💊 pill medicine,🩹 bandage,🚬 cigarette,👓 glasses,🎩 hat,👗 dress,👞 shoe'),
  cat('food', 'Food', '🍎 apple,🍌 banana,🍇 grapes,🍓 strawberry,🥕 carrot,🌽 corn,🍞 bread,🧀 cheese,🍖 meat,🍗 chicken leg,🍔 burger,🍕 pizza,🍜 noodles soup,🍰 cake,🎂 birthday cake,🍪 cookie,🍫 chocolate,🍬 candy,🥚 egg,☕ coffee,🍵 tea,🥛 milk,🍺 beer,🍷 wine,🍾 bottle champagne,🧪 flask,🍽️ plate dinner,🥄 spoon'),
  cat('vehicles', 'Vehicles', '🚗 car,🚕 taxi,🚓 police car,🚑 ambulance,🚒 fire truck,🚌 bus,🚚 truck,🚜 tractor,🏍️ motorcycle,🚲 bicycle bike,🛴 scooter,🚂 train,🚇 metro subway,✈️ plane,🚁 helicopter,🚀 rocket,🛸 ufo,⛵ sailboat,🚤 speedboat,🚢 ship,🛶 canoe,🎠 carousel horse,🛷 sled,🪂 parachute'),
  cat('effects', 'Effects', '❗ exclamation,❓ question,💥 explosion bang,💢 anger,💤 sleep zzz,❤️ heart love,💔 broken heart,💦 sweat splash,💨 dash wind smoke,✨ sparkles magic,🎵 music note,💬 speech,💭 thought,👁️ eye,👣 footprints,🩸 blood,☠️ danger poison,🚫 forbidden,➡️ arrow right,⬅️ arrow left,⬆️ arrow up,⬇️ arrow down,⭕ circle,❌ cross,✅ check,🕸️ web,🎆 fireworks,🌫️ fog'),
];

const stars = 'radial-gradient(1px 1px at 12% 18%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 31% 9%,#fff 99%,transparent),radial-gradient(1px 1px at 47% 27%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 63% 13%,#fff 99%,transparent),radial-gradient(1px 1px at 78% 31%,#fff 99%,transparent),radial-gradient(1px 1px at 90% 8%,#fff 99%,transparent),radial-gradient(1px 1px at 22% 40%,#fff 99%,transparent),radial-gradient(1.5px 1.5px at 70% 45%,#fff 99%,transparent),';

export const BACKDROPS = [
  { id: 'b:room', name: 'Room', css: 'linear-gradient(#d9c7a8 0 58%,#6e4f33 58% 60%,#9a7350 60%)' },
  { id: 'b:darkroom', name: 'Dark room', css: 'linear-gradient(#3a3550 0 58%,#1c1a28 58% 60%,#2b2638 60%)' },
  { id: 'b:meadow', name: 'Meadow', css: 'linear-gradient(#8fd3ff 0,#d8f1ff 55%,#6cbf4b 55%,#3f8f2f)' },
  { id: 'b:forest', name: 'Forest', css: 'linear-gradient(#0f3d2a 0,#2f6b3a 50%,#1f4a24 50%,#16351a)' },
  { id: 'b:night', name: 'Night', css: stars + 'linear-gradient(#070b24 0,#1c2452 60%,#141a14 60%,#0c100c)' },
  { id: 'b:sunset', name: 'Sunset', css: 'linear-gradient(#3b2a6b 0,#e0637a 35%,#ffb46b 60%,#3a2a3a 60%,#221a26)' },
  { id: 'b:beach', name: 'Beach', css: 'linear-gradient(#7fd0ff 0,#c9eeff 40%,#2a8fd0 40%,#49b3e8 60%,#f2dc9c 60%,#e3c67a)' },
  { id: 'b:desert', name: 'Desert', css: 'linear-gradient(#ffd9a0 0,#ffeccc 52%,#e2a85a 52%,#c98a3e)' },
  { id: 'b:snow', name: 'Snow', css: 'linear-gradient(#a9c4de 0,#dbe8f4 55%,#fff 55%,#dfe9f2)' },
  { id: 'b:street', name: 'Street', css: 'linear-gradient(#9fb4c7 0,#c9d6e0 45%,#8a8f98 45%,#8a8f98 62%,#3d4047 62%,#2c2e33)' },
  { id: 'b:cave', name: 'Cave', css: 'radial-gradient(ellipse at 50% 45%,#5a4a3e 0,#2a221d 55%,#0d0a08 100%)' },
  { id: 'b:sea', name: 'Underwater', css: 'linear-gradient(#1fa3c9 0,#0b4f7a 70%,#c9b27a 70%,#a8915c)' },
  { id: 'b:space', name: 'Space', css: stars + 'radial-gradient(ellipse at 70% 80%,#2b1650 0,#05030f 70%)' },
  { id: 'b:stage', name: 'Theatre', css: 'linear-gradient(90deg,#7a1020 0 12%,transparent 12% 88%,#7a1020 88%),linear-gradient(#2a0a12 0 62%,#8a6238 62%,#5e4124)' },
  { id: 'b:white', name: 'Blank', css: '#f4f1ea' },
  { id: 'b:black', name: 'Void', css: '#000' },
];

export const assetUrl = (code, id) => `/api/rooms/${code}/assets/${id.slice(2)}`;

export function backdropCss(code, id) {
  if (id && id.startsWith('c:')) return `url("${assetUrl(code, id)}") center/cover no-repeat #000`;
  return (BACKDROPS.find((b) => b.id === id) || BACKDROPS[0]).css;
}
