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
   (you take every turn yourself, handy for trying things out).
2. The Director sets the stage with no time limit, picks a story type, and taps
   **Begin the story**.
3. Turns alternate, each on a clock (1 minute by default, changeable under ⚙️ More).
   Every finished turn is first played back to the other side as a short cut scene
   (things glide, recorded moves play, lines appear one by one), then they take over.
   - **Player:** tap/drag to move, say and/or do something, pick an emote, tap an offered
     choice, reach for a thing, use an inventory item, roll a die.
   - **Director:** everything else — see the tabs below.
4. If the clock runs out, the turn is sent as it stands.
5. 📖 replays the whole story and can download it as a file.

### How a finished turn is shown

The other side watches a finished turn as a short film: black bars slide in with the
name of whose turn it was, things walk (bobbing, facing the way they go), newcomers
pop in, each line is typed out while its speaker bounces and the camera leans in a
little, earlier bubbles dim, narration appears as a subtitle, and at the end the bars
slide away with a "Your turn" cue. A click skips it.

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
change at a time), **Reset step** (undo the whole current step), **Clear steps** (start the turn over), and clicking an earlier step
goes back to it.

Inside a step the Director answers one question at a time: "What happens?" → a broad
choice → narrower choices.

| Choice | What it does |
| --- | --- |
| ➕ Add something | 3,369 pixel sprites and 670 emoji in searchable categories, plus your own photos, generated assets, or any emoji. |
| 💬 Someone speaks | A line and a face for any character. |
| 🚶 Move or animate | Glide, record a path (up to 10 seconds per step), walk to the hero, cross the stage, jump, tremble. Different things move together; one thing's moves follow each other. |
| 📝 Narrate | One narration per step. |
| 💥 Moment and sound | Shake, flash, confetti; 50 sound effects in five groups (action, magic, places, nature, people & spooks) — click one to hear it. |
| 🌄 Change the scene | A prepared scene, backdrop, weather, music, a title card, a random scene, story ideas. |
| ✏️ Draw on the stage | Freehand lines that draw themselves in playback. |
| 🏗️ Build scene / 🗺️ Map | Make places and keep them on the map, see below. |
| 🎒 The Player's sheet | Items, stats, a dice roll. |
| ❓ Offer choices | Up to three options for the Player. |
| 🤖 Tell Claude | Describe the step in words; Claude stages it (needs `ANTHROPIC_API_KEY` and `npm install`; `CLAUDE_MODEL`, `CLAUDE_MAX_PER_STORY`; see `director-ai.js`). |
| ⚙️ Story settings | Story type and layers, how the Player plays, turn time, invite link, end the story. |

Clicking anything on the stage opens its own tools (line, size, rotation, effect,
emote, move, turn into something else, copy, solid, give to the Player, remove);
dragging moves it.

### Adventure tools

| Tool | What it does |
| --- | --- |
| ❓ Ask the Player | The Director decides exactly what the Player may do next turn: pick one of up to three choices, roll a d6/d20 (optionally against a number to reach), go to one of several marked places, pick a target ("Attack", "Talk to"…), or give up an item. In limited will the Player must do it; in free will it is offered. |
| ⭐ Active objects | Any thing can be given a name and a set of actions (Look at, Use, Open, Talk to, your own…). The Player sees the name when pointing at it and picks an action by clicking it. |
| Use item on | The Player selects an inventory item, then clicks something on stage: "uses the key on Old chest". |
| 🔗 Tie | A thing can be tied to another (a sword to a character), in front of or behind it. It follows its holder everywhere, including walks, moves and travel. |
| 🎥 Camera | Zoom 1.5×, 2× or 3× onto a thing or a corner; the camera moves there when the step plays. The Director sees the framing as a yellow frame. |
| ➡️ Enter | "Move or animate → Enter from the left/right" brings a character in from outside the screen. |
| ⭐ Points | A layer; the Director awards points with a reason, shown to the Player as the step plays. |
| 🚪 Exits and the map | Scenes can have exits that lead to other prepared scenes, locked or open. The 🗺️ Map connects scenes. When the Player walks to an exit and the Director agrees, a "Traveling to…" card plays and the story continues in that scene, with the hero arriving at the way back. |
| ⚔️ Battle | The Director picks enemies and their health. The Player then chooses Attack, Defend or Flee each turn. The battle tools open by themselves on the Director's turn: one click on a damage number resolves the Player's blow, another the enemy's reply (strike, sword swing, shoot, magic, roar), each as its own step with animation, damage number, sound and health change. The battle ends by itself when the last enemy falls. |

Speech bubbles belong to the step they were said in: a new step starts without them,
and no line survives into the other side's turn.

### Build scene and the Map

Places are made in one spot only, apart from the turn. The Director can open it during
setup, during their own turn, and while waiting for the Player.

**🏗️ Build scene** has one scene on the bench:

- **Level tiles:** a 16 × 12 tile grid over the backdrop, painted with brush (1–3 tiles
  wide), box, fill, erase and pick tools, from 412 tiles in nine sets. Every tile is
  either **floor** (the hero can walk on it) or **wall** (it cannot).
- **Things & scene:** add things, make them solid or **active** (a name and verbs the
  Player can click), tie them together, set layers; backdrop, weather, music and
  **exits**. The hero marker sets where the Player starts. These construction tools are
  not in the turn menu any more — a turn is for telling the story.
- **💾 Add scene to map** keeps the scene. From then on it saves itself.
- **▶ Use in story** brings the scene on stage in the step being made (and adds it to
  the map if it was not there). **🎬 From stage** starts from a copy of what is on stage
  now; **＋ New** starts empty. Undo/redo with Ctrl+Z / Ctrl+Y, Ctrl+D copies a thing.

**🗺️ Map** shows every scene that was added. Drag to arrange; select one to rename,
edit (double-click), duplicate (Ctrl+D), delete, connect to another scene (adventure:
an exit in both, lockable) or to go there in the story. The whole map can be saved to a
file and loaded into another story.

Where a level exists the hero can only stand on floor tiles, and solid things block
it; the server enforces the same rule.

### How the Player plays

The Director chooses one of three modes (Rules of the story / ⚙️ More), and can
change it at any time:

| Mode | The Player… |
| --- | --- |
| 📝 Narration | only writes what they want to do. Nothing on stage moves until the Director stages it; the Player then watches it as a cut scene. |
| 🕹️ Free will | walks their hero, speaks, picks an emote, types an action, reaches for things. |
| 🎯 Limited will | must pick one of the options the Director offered for this turn; may also walk and add a line of speech. |

**Walking** (free and limited will): the Player presses "Walk" and clicks where the
hero should go. The hero finds its own way around walls and solid things and walks
there at an easy pace; the same walk is replayed for the Director. One walk per turn
(it can be taken back before the turn ends).

### Story types and layers

A story type is a preset of **layers**; the Director can also switch each layer on or
off at any time.

| Layer | Adds |
| --- | --- |
| 🎒 Inventory | The Player can reach for things on stage; the Director decides whether they get them. Items can be used on a later turn, and the Director decides whether they are used up. |
| ❤️ Stats | Named counters (Health, Gold, anything) that the Director adjusts. |
| 🎲 Dice | Either side can attach a d6 or d20 roll to a turn; the server rolls it. |

Types so far: **Free play** (no layers) and **Adventure** (all three). To add a type,
add a line to `TYPES` in `public/story/view.js` and `server/scene.js`; to add a layer, add it to
`MODULES` and the scene fields it needs (`public/shared/scene-model.js`, checked in `server/scene.js`).

The layout is made for computers for now (a phone design is still to come): the stage
sits on the left and the tools on the right; Ctrl+Enter ends
the turn, and with something selected the arrow keys move it, `+`/`-` resize, `r`
rotates, `f` flips and Delete removes.

## The look

Twofold looks like a game on an old computer in a dark room: one pixel typeface (VT323,
bundled in `public/fonts`, SIL Open Font License), hard edges, bone-white on near-black with
amber for what matters, faint scan lines, and a stage whose edges fall into shadow. There
are no emoji anywhere: the stage uses the pixel-art library only, menus use sprites from it
as icons, and what the Player did is read out like the log of an old adventure game
(`SAYS`, `DOES`, `GOES`, `ROLLS`), with a `> command line` on the stage during the replay.

- **Rooms in one click.** Build scene has 55 themes — old-house rooms (wallpapers, nursery,
  study, attic, bathroom …), institutions (asylum, morgue, hospital, prison, station, factory)
  and bleak outdoors (dead wood, marsh, moor, cemetery, catacomb, shipwreck, carnival …) — in four
  shapes; one press lays walls, floor and a few details. A new story opens in such a room.
- **Things can be clicked from the start.** Anything placed in Build scene gets a name and
  the verbs Look at / Use / Take; rename it or change the verbs under "Clickable".
- **Places with many rooms.** On the Map, "Room next door" adds a connected room in one
  press, and "Ready-made places" drops a furnished, connected set of rooms (the old house,
  the crypt, the lost mine) to play at once or change.
- **Thirty tunes**, eight of them made to unsettle: Dread, Crypt, Broken music box,
  Whispers, Heartbeat, Church organ, Lament, Drone.

## Paper-doll characters

Besides the ready-drawn sprites there is a **Character maker** (in the Director's menu, in
Build scene, and for the Player as "Make my character"). A person is put together from a
head, a torso, arms and legs — 500 parts in a muted old-home-computer palette (190 heads
from tired faces to plague doctors and drowned girls, 130 torsos, 90 arms, 90 legs), made by
`tools/make-dolls.js`.

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
keyboard. Active objects show their names without hovering. Build scene and the Map
stack the stage above the tools. Dungeon mode gets a thumb pad and sword, potion and bomb
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
The same idea everywhere — small files that each do one thing, named for what they do.

```
server.js                 start here: `node server.js`
server/                   the server (ES modules, no dependencies except the optional Claude SDK)
  index.js                HTTP, static files, event streams
  rooms.js                stories: who is in them, what each side sees, saving to disk
  turns.js                the clock, ending a turn, handing over, the computer partner
  scene.js                checks every scene a browser sends
  actions.js              everything a browser may ask for, by name
  director.js             Director-only requests: Tell Claude, the map's scenes, custom art
  dungeon.js              Dungeon mode: relays between the two sides, remembers the game
  bots.js                 computer partners for solo play (hook: BOT_PROVIDER)
  director-ai.js          "Tell Claude" (hook: DIRECTOR_AI)
  providers.js            making images (hook: ASSET_PROVIDER)
  config.js, util.js      limits and small helpers
public/                   the browser
  main.js                 start-up
  shared/                 used by browser AND server, so rules exist once
    rooms.js              rooms in one click: themes, shapes, the level they make
    scene-model.js        what a scene is: its fields by lifetime, where the hero may stand
    dungeon-rules.js      all rules of Dungeon mode (no drawing, no network)
  core/                   state.js (one `app` object), net.js, dom.js, history.js (undo),
                          audio.js, catalog.js, consts.js
  stage/                  render.js (draw a scene), playback.js (play a turn), level.js (tiles, walking)
  story/                  a story on screen
    turn.js               the draft, steps, undo, sending the turn
    input.js, walk.js     mouse, touch and keyboard on the stage
    view.js, player.js    the tool column; the Player's controls
    director.js           what the Director's menu can do to the turn
    guided.js, screens/   the Director's menu: one function per screen
    viewer.js             "the story so far"
  build/workshop.js       Build scene and the Map
  build/dollmaker.js      the character maker (paper dolls)
  dungeon/screen.js       Dungeon mode: editor, game canvas, controls, Overlord panel
  shell/                  home.js (start screen), chrome.js (top bar, clock), device.js (phone or computer), title.js
  css/                    nine style sheets by area; phone.css holds everything phone mode changes
  px/, packs/             the pixel-art library; better art that replaces it
test/                     `npm test` (protocol + 300 dungeon games), `npm run test:e2e` (five browser suites), `npm run sim`
tools/                    make-sprites.js (the art library), upgrade-sprites.js (fills packs/ from an image service)
```

How the pieces fit:

- **One scene model.** `shared/scene-model.js` says what a scene contains and how long each
  part lives (the place, the cast, one step's effects, what the Player did). Server and
  browser both import it, so a new field is added in one place.
- **One state object.** The browser keeps what it knows in `app` (`core/state.js`): the
  server's last word (`app.S`), my draft (`app.draft`), what is selected. Screens read it and
  redraw; nothing hides state in a corner.
- **Server decides, browsers draft.** A browser only edits its draft and sends it when the
  turn ends; `server/scene.js` checks every field. Dungeon mode is the one exception, on
  purpose: the hero's browser runs the rules so the controls have no lag.
- **One undo.** `core/history.js` serves the Director's turn, Build scene and the castle editor.
- **`npm run lint`** finds names that do not exist and code nobody uses; **`npm run format`**
  keeps the style even.

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
