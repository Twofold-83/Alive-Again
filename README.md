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

### Two ways to direct

The Director's panel has a switch at the top.

**🧭 Step by step** (the default) asks one question at a time. It first shows what the
Player just did, then "What happens next?" with a handful of broad choices — someone
speaks, move or animate, add something, change something, change the scene, narrate,
the Player's sheet, tell Claude — each of which narrows down in one or two more taps.
A finished path is one *event*; a turn holds up to five, listed with an undo. Moves
are built in: walk to the hero, cross the stage, jump, tremble, or record a path.

**🤖 Tell Claude** (inside Step by step) lets the Director describe the turn in plain
words; Claude turns it into stage operations (add, move, speak, scene changes, items,
stats) on the Director's draft, which they can still adjust before ending the turn.
It needs an Anthropic API key on the server: set `ANTHROPIC_API_KEY` and run
`npm install`. Without a key the rest of the game works and the option says so.
`CLAUDE_MODEL` picks the model (default `claude-opus-5-5`), `CLAUDE_MAX_PER_STORY`
caps requests per story (default 150). See `director-ai.js`.

**🎛️ All tools** is the full toolbox, in tabs:


| Tab | What it does |
| --- | --- |
| 🎭 Cast | 670+ searchable sprites in 14 categories, plus your own photos, generated assets, or any emoji. Select one on stage to make it speak, resize, rotate, flip, copy, give it a looping effect or an emote, make it the hero, or give it to the Player. |
| 🌄 Place | 35 backdrops, plus your own. |
| 🎵 Mood | Background music. |
| 🎬 Animate | Record up to 10 seconds of movement by dragging characters (one after another or at the same time), preview the turn, and draw freehand on the stage. |
| ✨ Extras | Weather, a one-off moment (shake, flash, confetti…), a sound effect, a title card, quick choices for the Player, a dice roll, a random scene, story ideas. |
| ⚙️ More | Story type and layers, turn time, invite link, end the story. |

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

On a computer the stage sits on the left and the tools on the right; Ctrl+Enter ends
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
| `public/guided.js` | The step-by-step Director flow |
| `public/app.js` | The client UI |
| `public/stage.js` | Draws a scene; plays a turn back as a cut scene |
| `public/catalog.js` | Built-in sprite and backdrop library, asset ids, art packs |
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

Scenes only store asset **ids** (`s:wizard-mage`, `b:forest`, `c:<id>`), never pixels.
Every built-in sprite currently looks like an emoji and every backdrop is a CSS
gradient. Two hooks raise the quality without touching the game:

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
