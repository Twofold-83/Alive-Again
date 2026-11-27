# Twofold

A two-player, turn-based storytelling stage for phones. One person is the **Player**
(the hero). The other is the **Director**, who controls everything else: the cast,
the place, the music, what every other character says and what happens next.

## Run it

```bash
node server.js
```

Open http://localhost:3000. The game itself has no dependencies and no build step
(Node 18+); `npm install` is only needed for the optional "Tell Claude" feature.
To play over the internet, put it on any host that runs Node or Docker
(Render, Railway, Fly.io, a VPS…): the start command is `node server.js`, it listens
on `$PORT`, and stories are saved as JSON files in `$DATA_DIR` (default `./data`) —
mount a persistent disk there if stories should survive redeploys.

## How a game goes

1. Start a story. With a partner: share the invite link or 5-letter code. On your own:
   **Solo Player / Solo Director** (an AI takes the other seat) or **Play both sides**
   (you take every turn yourself, handy for trying things out). **Prepare a campaign**
   opens a stage with no turns, for building ahead of time (see below).
2. The Director sets the stage with no time limit, picks a story type, and taps
   **Begin the story**.
3. Turns alternate, each on a clock (1 minute by default, changeable under ⚙️ More).
   Every finished turn is first played back to the other side as a short cut scene
   (things glide, recorded moves play, lines appear one by one), then they take over.
   - **Player:** walk, speak, act on things, strike a pose, answer what was asked, roll, fight.
   - **Director:** everything else — see below.
4. If the clock runs out, the turn is sent as it stands.
5. 📖 replays the whole story and can download it as a file.

### How a finished turn is shown

The other side watches a finished turn as a short film: black bars slide in with the
name of whose turn it was, things walk (bobbing, facing the way they go), newcomers
pop in, each line is typed out while its speaker bounces and the camera leans in a
little, earlier bubbles dim, narration appears as a subtitle, and at the end the bars
slide away with a "Your turn" cue. A click skips it. A Director's turn opens on the scene as it
was for a good two seconds — the room is still dark before the light comes on — and what the Player did is
typed out for the Director line by line, with what clickable things answered.

Speech bubbles are always placed fully on the stage, clear of the narration and of
each other; long lines are set smaller and wider. `npm run sim` plays random turns
sped up and checks exactly that (bubbles on stage, no overlap, lines readable long
enough, playback ending on the real scene).

The story type (Free play or Adventure) is chosen once, on the start screen. The
Director can give the story a **title screen and instructions** under Story settings:
the Player sees them while the stage is being set, the story opens on the title, and
the instructions stay in the Player's side panel.

### How the Director builds a turn

A turn is a list of **steps**. Everything done within one step plays at the same time
(a line of speech, an explosion and its sound, two characters moving); "＋ Next step"
starts what happens after that. There is no limit on steps. The step bar at the top
of the tool column shows them and offers **Preview turn**, **Undo** (Ctrl+Z, one
change at a time), **Reset step**, **Clear steps**, and clicking an earlier step goes
back to it.

Inside a step the Director answers one question at a time: "What happens?" → a broad
choice → narrower choices.

| Choice | What it does |
| --- | --- |
| Add something | The library by **Environment** (hospital, school, attic, street …), **Objects** and **Beings**, level pieces, effects, a search by name, your own drawings and uploads. The list stays open while you place things. |
| Someone speaks | A line for any character. |
| Move or animate | Pose a character (head, arms, legs, a feeling), glide, record a path (up to 10 seconds per step), walk to the hero, enter from outside the screen, jump, tremble. Different things move together; one thing's moves follow each other. |
| Narrate | One narration per step. |
| Moment and sound | Shake, flash, confetti; sound effects in five groups — click one to hear it. |
| Mood | Light and dark (four levels of darkness, 26 kinds of light that cut through it, each with its own strength), weather, music (57 tunes), a title card, a surprise scene, story ideas. |
| Draw on the stage | Freehand lines that draw themselves in playback. |
| Build this room | Walls and floor in one press (81 themes in four shapes), paint single tiles. |
| Save room | Keeps the stage as a room on this device, for any story; brings a saved room back. |
| Map & campaigns | The scenes kept for this story and the ways between them, see below. |
| The Player's sheet | Items, stats, points. |
| Ask the Player | Choices, a skill check, a picture to show, a place to go, a target to pick, a thing to give up. |
| Camera | Zoom 1.5×, 2× or 3× onto a thing or a corner; the camera moves there when the step plays. |
| Battle | Pick the enemies and one of six difficulties; the fight then belongs to the Player (see below). |
| Tell Claude | Describe the step in words; Claude stages it (needs `ANTHROPIC_API_KEY` and `npm install`; see `server/director-ai.js`). |
| Character maker, Sprite editor | Build people from parts (with mutations); draw or redraw things, all four pictures of them. |
| Story settings | Layers, how the Player plays, turn time, title screen and instructions, invite link, end the story. |

**A thing on the stage.** Clicking anything opens its tools; dragging moves it. Every thing has:

- a **name** — until the Director types one it has none, and everybody calls it "this";
- a **view**: as drawn, from the other side, and *used* (an open door, a lit lamp, a bed slept in) — four
  hand-drawn pictures per library sprite;
- a **base point**: the strip of floor it stands on. It decides what is drawn in front of what, and — if the
  thing is **solid** — where nobody can walk. It can be moved and made deeper;
- a **light** it carries (the light follows the thing) and how strongly it shines, an effect, an emote, a layer, a size;
- **clickable**: the actions the Player is offered on it, and for each a **reaction** the Player sees at once
  ("If the Player looks at it, show this text", optionally switching the thing to its used picture) — and a
  **trap**: if the hero walks close, "Something happened!" and the turn goes straight to the Director;
- **tie** (a sword to a hand, a candle to a table), copy, turn into something else, give to the Player, remove;
- for paper-doll characters: **Act** — a feeling that shows on the face, and a pose.

The **shelf** under the stage is the Director's alone: the cast from the character maker and anything put
aside with "Keep for later" wait there, and come back exactly as they were prepared.

### Rooms, the map and campaigns

Everything is built on the stage itself; there is no separate building mode.

- **Build this room** lays walls and floor for a theme and shape, and **Paint walls and floor** changes
  single tiles of the 16 × 12 grid. A tile is either floor (the hero can walk on it) or wall.
- **Save room** (in the main menu) keeps the stage as a room on this device, for any story; "My saved rooms"
  brings one back.
- **Map & campaigns** holds the scenes of this story. "Add the stage as a scene" keeps what is on stage;
  on the map scenes are arranged, renamed, duplicated, deleted and **connected** (an exit in both scenes,
  lockable). "Edit" or a double-click moves the story there; "Save the stage into it" updates a scene.
  Ready-made places (several furnished, connected rooms) can be dropped in.
- A **campaign** is the whole map — every scene, where it lies, the ways between them — kept on this device
  and usable in any story. The map can also be saved to a file and loaded elsewhere.

**Prepare a campaign** (on the start screen) is the place to do all of this ahead of time: the Director has
the stage and every tool, with no turns and no clock. The banner shows the campaign being worked on, with
**Save** (over that campaign), and **Save as / Load** (a new name; or another campaign to work on). Saving puts
the stage on the map and keeps the whole map on this device. **Test as Player** plays what is on the stage for
real — as many turns as you like, as both sides — and **End test** puts everything back as it was.

When the Player walks to an exit and the Director agrees, a "Traveling to…" card plays and the story
continues in that scene. Where a level exists the hero can only stand on floor tiles, and the base of a solid
thing blocks the way; the server enforces the same rule.

### How the Player plays

The Director chooses one of three modes under Story settings, and can change it at any time:

| Mode | The Player… |
| --- | --- |
| Narration | only writes what they want to do. Nothing on stage moves until the Director stages it. |
| Free will | walks, speaks, picks an emote, writes a **Free Action**, acts on things, strikes a pose. How the hero looks is the Director's to decide. |
| Limited will | must pick one of the options the Director offered, or do exactly what was asked; may also walk and speak. |

- **Point and click (adventures).** A turn holds **one walk and one action**. A click on the floor walks
  there. For the action, pick one of ten **Actions** (walk, look at, push, pull, open, use, pick up, give,
  talk to, attack) and click what it is about — a thing ("Open old chest") or a spot ("Push here") — or write
  a **Free Action** instead; whichever came last counts.
- **Clickable things** show the actions the Director offers on them. The hero has to stand close (about a tile
  and a half; the Director can let a thing answer from anywhere) — otherwise "It's too far away." If the
  Director prepared a reaction, the Player sees it at once, as often as they like: it is not the turn's action.
- **Walking.** The hero finds its own way around walls and solid things; the same walk is replayed for the
  Director. One walk per turn (it can be taken back).
- **Items.** Select an inventory item, then click something on stage: "uses the key on Old chest".
- **A skill check.** The Director writes what the check is for and what number is needed. The Player's turn
  opens on the card: Roll or Back out. The die tumbles, the result stands for three seconds, and the turn
  goes back to the Director.
- **A battle** is a classic turn-based fight. The Director sets only the enemies and the difficulty (very easy
  to basically impossible); the difficulty decides every number, and an estimate says what to expect. From then
  on the Player is locked into the fight — Attack, Defend, Item, Escape — and each round is *played* on both
  screens, blow by blow: the attacker winds up and darts in, the blow lands with a burst, the number flies up and
  the health bar drains at that moment, the beaten fall, and only after the last blow comes "Victory!". Nothing
  is shown before it has happened on the stage.
- **The Director's hand on a fight.** While it lasts the Director can pause it, give anyone a line (spoken at
  once, then taken down again), decide an enemy's next move (attack, heavy blow, guard, hold back, run away),
  change how hard it is, step in with every tool, or call it off.

Speech bubbles belong to the step they were said in: a new step starts without them, and no line survives
into the other side's turn.

### Story types and layers

A story type is a preset of **layers**; the Director can also switch each layer on or off at any time.

| Layer | Adds |
| --- | --- |
| Inventory | The Player can reach for things on stage; the Director decides whether they get them. |
| Stats | Named counters (Health, Gold, anything) that the Director adjusts. |
| Dice | The Director can roll with a step and ask the Player for a skill check; the Player rolls only when asked. The server rolls. |
| Points | The Director awards points with a reason, shown as the step plays. |

Types: **Free play** and **Adventure** (see `public/shared/rules.js`). On a computer the stage sits on the
left and the tools on the right; Ctrl+Enter ends the turn, and with something selected the arrow keys move
it, `+`/`-` resize, `r` rotates, `f` flips and Delete removes. On a phone the stage is on top.

## The look

Twofold looks like a game on an old computer in a dark room: one pixel typeface (VT323,
bundled in `public/fonts`, SIL Open Font License), hard edges, bone-white on near-black with
amber for what matters, faint scan lines, and a stage whose edges fall into shadow. There
are no emoji anywhere: the stage uses the pixel-art library only, menus use sprites from it
as icons, and what the Player did is read out like the log of an old adventure game
(`SAYS`, `DOES`, `GOES`, `ROLLS`), with a `> command line` on the stage during the replay.

- **Rooms in one press.** "Build this room" has 81 themes — old-house rooms, institutions (asylum, morgue,
  hospital, school, prison, station, factory), modern homes and streets, and bleak outdoors (dead wood, marsh,
  moor, cemetery, catacomb, shipwreck, carnival …) — in four shapes; one press lays walls, floor and a few
  details. A new story opens in such a room.
- **One scale for everything.** One pixel of any picture is the same size on the stage: a person is
  16 x 33, a floor tile 16 x 16, a bed two tiles wide, a door taller than a person. `tools/make-big.js`
  draws the library at that scale from the modules in `tools/big/`: 1,242 things and people of the house
  and its horrors (furniture, doors, kitchen, bathroom, attic, yard, graveyard, the occult, mad science,
  old machines, small finds, apparitions, and 233 ready-made people in the look of the paper dolls).
  Older 16 x 16 icons that do not belong in a house are no longer offered; their files remain for old
  stories, the menus' own icons and the Dungeon mode.
- **Everything is built on the stage.** There is no separate Build scene: "Build this room" lays walls and floor
  in one press, paints tiles by hand on the stage, and saves rooms for every story. Any thing can be made solid
  and has a base point (`baseOf` in `public/shared/scene-model.js`): a strip of floor that decides what it is
  drawn in front of and where it blocks. The Map is a plain overlay for connecting scenes and saving campaigns.
- **Four pictures per thing.** Front and side, and each of them after someone used the thing (an open fridge,
  an unmade bed, a lit lamp) — all drawn by hand next to the sprite itself (`views` in `tools/big/*.js`, see
  `tools/make-big.js`; `--dump=<slug>` prints a sprite as text). A View row on each thing switches between them.
- **Sprite editor.** Draws all four pictures of a thing. An edited library thing is saved as a campaign sprite
  with its views, or permanently alters the asset on this device; a new object (up to 3 x 2 tiles: a car, a wagon) goes into
  "My objects" or any category. Own objects are kept in the browser and sent into the story when used, so the
  other player sees them. The character maker has mutations: more heads, arms and legs.
- **Environments.** Things, beings and rooms are grouped by setting (`public/shared/environments.js`): Victorian,
  Modern home, Apartment complex, Child's room, Attic, Basement, Toilet, Cottage, Garden, School, Hospital,
  Electronics, Street, Urban, Horror, Graveyard, Dream world, Weird, Castle and dungeon, Wild places, Apocalypse,
  Suburban, Village, Rural, Medieval, Gothic, Apothecary, Old time, 1920's, Hell, Nightmare, Surreal. "Add
  something" offers Environment, Objects and Beings; every setting has rooms of its own (81 room themes).
- **Large things.** Each of the newer settings has things three tiles wide and two high — cars, trucks, wagons, a
  streetcar, a tank, a stagecoach, a pipe organ — with their four pictures like everything else. The sprite editor
  makes objects of that size too.
- **Mood.** Light and dark with light sources that glow (lamp, fluorescent, neon, fire, candle, moonlight, screen,
  alarm), weather and music. Any thing can be a light.
- **Adventure controls.** A click on the stage offers Walk here / Look at / Use; clickable things can answer by
  themselves and change to their used picture; a thing can be a trap; the Director can show a picture; a roll
  hands straight back to the Director. The Director's shelf under the stage holds the cast and prepared things.
- **Battles.** A round is worked out on the server and told as a list of events (`public/shared/battle.js`);
  `public/stage/fight.js` plays them on the stage one after the other, and the battle's panels
  (`public/story/battle-ui.js`) follow the stage, not the outcome the server already knows.
- **Invisible things.** Any thing — and any exit sign — can be made invisible to the Player: it is not drawn for
  them, not sent to them, not in their way and nothing to click; the Director sees it faintly.
- **Starting point.** The hero's panel sets where the hero stands when the story comes into a scene (a green
  START mark), whichever way they came.
- **Saved stage-sets** (Story settings): every place of the map keeps what happened in it — a fridge left open is
  still open when the story comes back.
- **Save the game** (Story settings): the Director saves a running game, on the device or as a file, and goes on
  with it another day from the start screen ("Continue a saved game") — as Director with a Player, or on one screen.
- **Pictures** the Director shows can lie on black or over the stage, with a narration typed out under them; the
  orange line of what the Player did can be switched off.
- **Title screens.** A story's title screen (a title, a few lines for the Player and a picture of your own) is
  set under Story settings. A campaign keeps its own: it is chosen on the Campaign screen while preparing, saved
  with the campaign (the picture too), and comes back when the campaign is loaded or put on a story's map.
- **Save room.** "Build this room → Save room" keeps the stage as a room on the device; "My saved rooms" brings
  it on stage in any story, or puts a copy on the map.
- **Rolls at once.** When the Director asks for a roll (with the number to reach), the Player presses Roll,
  sees the die and is told at once whether it was enough; the Director gets the result in words.
- **Feelings.** A paper-doll character can feel happy, sad, scared, angry, uneasy, curious, doubtful,
  surprised, tired or hurt: a few pixels of brow, eye and mouth, drawn for every head. Director and
  Player choose it in the same Act panel as the ready-made poses; the Director is told what the hero feels.
- **Ready-made places come alive.** The things in a ready-made place are named and clickable from the start
  (Look at / Use / Take); rename them or change the actions under "Clickable".
- **Places with many rooms.** On the Map, "Room next door" adds a connected room in one
  press, and "Ready-made places" drops a furnished, connected set of rooms (the old house,
  the crypt, the lost mine) to play at once or change.
- **57 tunes**, most of them made to unsettle: Dread, Crypt, Broken music box, Whispers, Heartbeat,
  Church organ, Lament, Drone and their kin.

## Paper-doll characters

Besides the ready-drawn sprites there is a **Character maker** (in the Director's menu,
and for the Player as "Make my character"). A person is put together from a
head, a torso, arms and legs — 1,504 parts in a muted old-home-computer palette (570 heads
from tired faces to plague doctors and drowned girls, 417 torsos, 255 arms, 262 legs), made by
`tools/make-dolls.js`. The first 500 are combinations of a few shapes; the other 1,004 are drawn one by one in
`tools/dolls/*.js` for the settings of the game.

- **By setting.** Every one of the 32 settings has heads, torsos, arms and legs that belong together — a nurse,
  a knight, a flapper, a demon, a survivor in a gas mask. A drop-down in the character maker shows the parts of
  one setting, and "Surprise me" then makes someone who belongs there.
- **Bare skin.** A bare chest and bare legs in small white shorts, in all seven skin tones; the "Bare skin"
  button undresses a figure to them, in the skin of its head.
- **Posing.** Drag the head, an arm or a leg and it turns at the joint; or press a ready
  pose (Stand, Arms up, Wave, Point, Reach, Cower, Stride, Run, Kick, Shrug, Hang head,
  Sprawl). The Director poses anyone ("Pose" on a selected figure); the Player poses their
  own hero. Within a turn the figure swings from the old pose into the new one, and its
  legs and arms move when it walks.
- **My cast.** Characters you keep are stored in the browser and offered in every story.
- On the stage a figure is an ordinary thing: `asset: 'd:h012.t033.a005.l010'` plus
  `pose: [head, left arm, right arm, left leg, right leg]` in degrees. See `public/core/dolls.js`.

## Screen filters

The **FX** button in the top bar (and the start screen) changes how the picture looks on
your own device: Old monitor, Clean, Green screen, Amber screen, Black and white, Old
photograph, Moonlight, Fever, Worn tape. It is remembered in the browser and changes
nothing for the other person. (`public/shell/display.js`, the looks are CSS.)

## Phone or computer

The start screen asks what you are playing on (it guesses the first time and remembers).
The 📱/💻 button in the top bar switches at any time.

**Phone mode** is laid out for one thumb in portrait: the stage fills the width on top,
the tools scroll under it, and the button that ends your turn stays at the bottom. Touch
targets are at least 44 px, text fields do not make iOS zoom, the layout respects the
notch and the home bar, and while you type the stage shrinks to leave room for the
keyboard. Named things show their names without hovering. The Map and the makers
stack their picture above the tools. Dungeon mode gets a thumb pad and sword, potion and bomb
buttons. Held sideways, the stage sits on the left and the tools on the right.

## Dungeon mode

A third kind of story, chosen on the start screen: an action game for two. The
**Hero** walks a castle with a sword; the **Overlord** built that castle and fights back.

- **Building.** The Overlord lays out up to 20 rooms on a board, paints walls, water,
  pits, barrels, doors (open, locked, gates), spikes, arrow traps, pressure plates,
  chests, loot and monsters, and places the hero's start and the crown. Each room can
  have a pressure-plate effect (ambush, doors slam shut, lights out, arrows, quake, open
  the gates) and a line the Overlord whispers when the hero walks in. "Random castle"
  builds a complete, winnable castle in one click.
- **Playing.** The hero moves with the arrow keys or WASD, swings the sword with Space,
  drinks potions (Q) and drops bombs (E). Hearts, keys, coins, levels, a golden sword and
  heart containers. Take the crown to win; run out of hearts and the Overlord wins.
- **The Overlord during play** earns *dread* and spends it: summon monsters anywhere away
  from the hero, drop spikes, put the lights out, fire the arrow traps, shake the ceiling
  down, mend monsters, slam the doors. Whispers and spooky noises are free.
- **Live or turn-based.** Live: everything moves at once. Turn-based: the hero takes five
  moves (the monsters answer each one), then the Overlord takes a turn.
- Works for two people, alone as the hero, alone as the Overlord (a computer hero
  explores), or one person on both sides.

The rules are in `public/shared/dungeon-rules.js` (no drawing, no network; `npm test` plays 300 whole
games computer-against-computer). The hero's browser runs the game so the controls have no
lag; the server keeps the castle, relays snapshots to the Overlord and the Overlord's
commands to the hero, and remembers the game across reloads. `public/dungeon/screen.js` is the screen.

## Built to be stable

- The server is the single source of truth; clients only edit a local draft.
- Every server message is the complete state, so a reconnect always heals itself.
- The clock pauses whenever either person is offline (locked phone, tunnel, app switch).
- Drafts survive a page reload; submits are retried and are idempotent per turn.
- Stories persist on disk and survive a server restart.

## How the code is laid out

Plain JavaScript modules, no build step: what is in the repository is what runs.
Small files that each do one thing, named for what they do.

```
server.js                 start here: `node server.js`
server/                   the server (ES modules, no dependencies except the optional Claude SDK)
  index.js                HTTP, static files, event streams
  rooms.js                stories: who is in them, what each side sees, saving to disk
  turns.js                the clock, ending a turn, handing over, dice, live battle rounds
  scene.js                checks every scene a browser sends
  actions.js              everything a browser may ask for, by name
  director.js             Director-only requests: Tell Claude, the map's scenes, a story's own pictures
  dungeon.js              Dungeon mode: relays between the two sides, remembers the game
  bots.js, director-ai.js computer partners for solo play; "Tell Claude"
  providers.js            making images (hook: ASSET_PROVIDER)
public/                   the browser
  main.js                 start-up
  shared/                 used by browser AND server, so every rule exists once
    scene-model.js        what a scene is: its fields by lifetime, names, base points, where the hero may stand
    battle.js             the battle: difficulty levels, planning a fight, one round
    rooms.js              rooms in one press: themes, shapes, the level they make
    environments.js       the library sorted into settings, objects and beings
    options.js, sounds.js, rules.js   effects, lights, weather, feelings; tunes and sounds; story types and layers
    dungeon-rules.js      all rules of Dungeon mode (no drawing, no network)
  core/
    state.js              one `app` object: the server's last word, my draft, what is selected
    net.js, dom.js, history.js, audio.js
    catalog.js            every asset id and how to find its pictures (front, side, used)
    dolls.js              paper-doll characters: parts, mutations, poses, feelings
    kept.js               everything kept on this device: cast, shelf, saved rooms, campaigns, own objects
    legacy-sprites.js     the first, emoji library — still drawn for old stories
  stage/                  render.js (draw a scene), playback.js (play a turn), level.js (tiles, finding a way)
  story/                  a story on screen
    turn.js               the draft, steps, undo, sending the turn, receiving the next
    input.js, walk.js     mouse, touch and keyboard on the stage; walking, the click menu, acting on things
    view.js               the tool column and the sheet
    player.js             the footer: the Player's controls, the button that ends a turn
    dice.js, battle-ui.js the skill check card; the battle for the Player, the watch card for the Director
    director.js           what the Director's menu can do to the turn
    prep.js               the Director's shelf
    guided.js, screens/   the Director's menu: one function per screen (things, scene, player, story)
    viewer.js             "the story so far"
  build/                  full-screen workbenches
    map.js                the map: scenes, connections, campaigns, ready-made places (scenarios.js)
    dollmaker.js          the character maker
    spriteed.js           the sprite editor: all four pictures of a thing
  dungeon/screen.js       Dungeon mode: editor, game canvas, controls, Overlord panel
  shell/                  home.js (start screen), chrome.js (top bar, clock), device.js, display.js (filters)
  css/                    style sheets by area; phone.css holds everything phone mode changes
  px/, doll/, packs/      the pixel-art library, the doll parts, art that replaces built-in pictures
test/                     `npm test` (protocol, dungeon games, rooms and rules), `npm run test:e2e` (ten browser suites), `npm run sim`
tools/                    make-big.js + big/ (the library, drawn in code), make-dolls.js, make-sprites.js
```

How the pieces fit:

- **One scene model.** `shared/scene-model.js` says what a scene contains and how long each part lives (the
  place, the cast, one step's effects, what the Player did). Server and browser both import it, so a new
  field is added in one place — and `normScene` brings older stories up to date when they are loaded.
- **One state object.** The browser keeps what it knows in `app` (`core/state.js`). Screens read it and
  redraw; nothing hides state in a corner.
- **Server decides, browsers draft.** A browser only edits its draft and sends it when the turn ends;
  `server/scene.js` checks every field. Two things are live on purpose: a dice roll and a battle round are
  carried out by the server the moment the Player asks, and shown to both. (Dungeon mode runs its rules in
  the hero's browser so the controls have no lag.)
- **One way to act.** Whatever the Player does to the stage is `point: { verb, id | x, y }` — from the click
  menu, the Actions list or a clickable thing alike. What they write is `action`.
- **One name, one base.** A thing's `name` is what everybody calls it; its base (`baseOf`) decides both
  drawing order and where it blocks the way.
- **One place for pictures.** `catalog.picturesOf` knows the four pictures of a library sprite, of a story's
  own drawing and of a drawing kept on the device.
- **One place for what the device keeps.** `core/kept.js`.
- **One undo.** `core/history.js` serves the Director's turn and the castle editor.
- **`npm run lint`** finds names that do not exist and code nobody uses; **`npm run format`** keeps the style even.

## Solo play

"Solo as Player" and "Solo as Director" on the start screen fill the other seat with
a built-in bot. The bots are scripted: the Director bot picks one of a few opening
scenes and reacts to keywords in what the Player says and does; the Player bot
answers questions, walks up to things and pokes at them. They cost nothing and need
no network. To put a language model behind either seat, export `playerMove(ctx)`
and/or `directorMove(ctx)` from a module and start with `BOT_PROVIDER=./my-bot.js`
(the contract is documented at the top of `server/bots.js`).

## Art: placeholders now, real art later

Scenes only store asset **ids** (`p:knight`, `s:wizard-mage`, `b:forest`, `c:<id>`),
never pixels. The main library is 3,369 pixel-art sprites in `public/px/` (including 412 level tiles
with joining edge and corner pieces) (ids `p:…`),
drawn by code in `tools/make-sprites.js`; behind it sits the older emoji library
(ids `s:…`), and every backdrop is a CSS gradient. Two hooks raise the quality without touching the game:

**1. One function for an image service.** The Director's "✨ Create" box and the bulk
tool below both call it:

```js
// my-provider.js
exports.generate = async ({ kind, prompt }) => {
  // kind is 'sprite' (transparent background) or 'backdrop' (4:3)
  const png = await callYourImageService(prompt, kind);
  return { mime: 'image/png', data: png, name: prompt };   // or null to fall back
};
```

```bash
ASSET_PROVIDER=./my-provider.js node server.js
```

**2. Art packs for the built-in library.** Anything listed in
`public/packs/manifest.json` replaces the placeholder with that slug everywhere,
including in stories already told:

```bash
ASSET_PROVIDER=./my-provider.js node tools/upgrade-sprites.js --only=fantasy --limit=10 --style="pixel art, 64px"
```

`--only=px` (or `--only=px-heroes`, `--only=px-dungeon`, …) sends the pixel-art library
through the same service; results are listed under `pixel` in the manifest and replace
the built-in pixel sprites everywhere.

Run it without `--only`/`--limit` to redo the whole library (700+ images, so check
the service's price first). You can also drop hand-made images into `public/packs/`
and list them in the manifest yourself.

Without a provider, a small built-in procedural generator answers the "Create" box,
so the pipeline works today. Music moods and sound effects follow the same idea in
`public/audio.js`.
