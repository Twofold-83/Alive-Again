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

### How the Director builds a turn

A turn is a list of **steps**. Everything done within one step plays at the same time
(a line of speech, an explosion and its sound, two characters moving); "＋ Next step"
starts what happens after that. There is no limit on steps. The step bar at the top
of the tool column shows them and offers **Preview turn**, **Reset step** (undo the
current step), **Clear steps** (start the turn over), and clicking an earlier step
goes back to it.

Inside a step the Director answers one question at a time: "What happens?" → a broad
choice → narrower choices.

| Choice | What it does |
| --- | --- |
| ➕ Add something | 500 pixel sprites and 670 emoji in searchable categories, plus your own photos, generated assets, or any emoji. |
| 💬 Someone speaks | A line and a face for any character. |
| 🚶 Move or animate | Glide, record a path (up to 10 seconds per step), walk to the hero, cross the stage, jump, tremble. Different things move together; one thing's moves follow each other. |
| 📝 Narrate | One narration per step. |
| 💥 Moment and sound | Shake, flash, confetti; boom, bell, magic and other sounds. |
| 🌄 Change the scene | Backdrop, weather, music, a title card, a ready-made scene, story ideas. |
| ✏️ Draw on the stage | Freehand lines that draw themselves in playback. |
| 🧱 Build the level | Adventure only, see below. |
| 🎒 The Player's sheet | Items, stats, a dice roll. |
| ❓ Offer choices | Up to three options for the Player. |
| 🤖 Tell Claude | Describe the step in words; Claude stages it (needs `ANTHROPIC_API_KEY` and `npm install`; `CLAUDE_MODEL`, `CLAUDE_MAX_PER_STORY`; see `director-ai.js`). |
| ⚙️ Story settings | Story type and layers, how the Player plays, turn time, invite link, end the story. |

Clicking anything on the stage opens its own tools (line, size, rotation, effect,
emote, move, turn into something else, copy, solid, give to the Player, remove);
dragging moves it.

### Levels (Adventure)

"Build the level" paints a 16 × 12 tile grid over the backdrop: **floor** tiles the
hero can walk on and **wall** tiles it cannot (any tile picture can be either).
Things on stage can be switched to **solid**. Once a level exists the Player's hero
can only stand on floor, slides along walls, and bumps into solid things; the server
enforces the same rule.

### How the Player plays

The Director chooses one of three modes (Rules of the story / ⚙️ More), and can
change it at any time:

| Mode | The Player… |
| --- | --- |
| 📝 Narration | only writes what they want to do. Nothing on stage moves until the Director stages it; the Player then watches it as a cut scene. |
| 🕹️ Free will | drags their hero (the path they draw is replayed for the Director), speaks, picks an emote, types an action, reaches for things. |
| 🎯 Limited will | must pick one of the options the Director offered for this turn; may also walk and add a line of speech. |

With free or limited will, **game movement** limits how far the hero can
walk per turn (a few steps, half the stage, most of the stage); the Player sees the
range as a circle.

### Story types and layers

A story type is a preset of **layers**; the Director can also switch each layer on or
off at any time.

| Layer | Adds |
| --- | --- |
| 🎒 Inventory | The Player can reach for things on stage; the Director decides whether they get them. Items can be used on a later turn, and the Director decides whether they are used up. |
| ❤️ Stats | Named counters (Health, Gold, anything) that the Director adjusts. |
| 🎲 Dice | Either side can attach a d6 or d20 roll to a turn; the server rolls it. |

Types so far: **Free play** (no layers) and **Adventure** (all three). To add a type,
add a line to `TYPES` in `public/app.js` and `server.js`; to add a layer, add it to
`MODULES` and the scene fields it needs (`newScene`/`cleanScene` in `server.js`).

The layout is made for computers for now (a phone design is still to come): the stage
sits on the left and the tools on the right; Ctrl+Enter ends
the turn, and with something selected the arrow keys move it, `+`/`-` resize, `r`
rotates, `f` flips and Delete removes.

## Built to be stable

- The server is the single source of truth; clients only edit a local draft.
- Every server message is the complete state, so a reconnect always heals itself.
- The clock pauses whenever either person is offline (locked phone, tunnel, app switch).
- Drafts survive a page reload; submits are retried and are idempotent per turn.
- Stories persist on disk and survive a server restart.

## Layout

| File | What it is |
| --- | --- |
| `server.js` | Rooms, roles, turn order, clock, validation, persistence, HTTP + SSE |
| `providers.js` | Asset generation hook (AI goes here) |
| `bots.js` | AI partners for solo play (scripted; language-model hook) |
| `director-ai.js` | "Tell Claude": the Claude call and the stage operations it may use |
| `public/guided.js` | The Director's panel: step bar and the question flow |
| `public/app.js` | The client UI |
| `public/stage.js` | Draws a scene; plays a turn back as a cut scene |
| `public/catalog.js` | Built-in sprite and backdrop library, asset ids, art packs |
| `public/px/` | The pixel-art sprite library (500 PNGs + `index.json`), generated by `tools/make-sprites.js` |
| `public/packs/` | Higher-quality art that replaces the placeholders (empty by default) |
| `tools/upgrade-sprites.js` | Fills `public/packs/` from an image service |
| `public/audio.js` | Music moods (generative WebAudio) |
| `test/` | `npm test` (protocol) and `npm run test:e2e` (two phones, needs Playwright) |

## Solo play

"Solo as Player" and "Solo as Director" on the start screen fill the other seat with
a built-in bot. The bots are scripted: the Director bot picks one of a few opening
scenes and reacts to keywords in what the Player says and does; the Player bot
answers questions, walks up to things and pokes at them. They cost nothing and need
no network. To put a language model behind either seat, export `playerMove(ctx)`
and/or `directorMove(ctx)` from a module and start with `BOT_PROVIDER=./my-bot.js`
(the contract is documented at the top of `bots.js`).

## Art: placeholders now, real art later

Scenes only store asset **ids** (`p:knight`, `s:wizard-mage`, `b:forest`, `c:<id>`),
never pixels. The main library is 500 pixel-art sprites in `public/px/` (ids `p:…`),
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

Run it without `--only`/`--limit` to redo the whole library (700+ images, so check
the service's price first). You can also drop hand-made images into `public/packs/`
and list them in the manifest yourself.

Without a provider, a small built-in procedural generator answers the "Create" box,
so the pipeline works today. Music moods and sound effects follow the same idea in
`public/audio.js`.
