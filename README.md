# Twofold

A two-player, turn-based storytelling stage for phones. One person is the **Player**
(the hero). The other is the **Director**, who controls everything else: the cast,
the place, the music, what every other character says and what happens next.

## Run it

```bash
node server.js
```

Open http://localhost:3000. No dependencies, no build step (Node 18+).
To play over the internet, put it on any host that runs Node or Docker
(Render, Railway, Fly.io, a VPS…): the start command is `node server.js`, it listens
on `$PORT`, and stories are saved as JSON files in `$DATA_DIR` (default `./data`) —
mount a persistent disk there if stories should survive redeploys.

## How a game goes

1. One person starts a story and shares the invite link (or the 5-letter code).
2. The Director sets the stage with no time limit and taps **Begin the story**.
3. Turns alternate, each on a clock (1 minute by default, changeable under ⚙️ More):
   - **Player:** tap/drag the stage to move, type something to say and/or do, end turn.
   - **Director:** sees what the Player did, then drags things around, adds or removes
     cast, makes characters speak, changes backdrop and music, narrates, ends turn.
4. If the clock runs out, the turn is sent as it stands.
5. 📖 shows every turn so far as a flipbook, and can download the story as a file.

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
| `public/app.js` | The whole client UI |
| `public/catalog.js` | Built-in sprites and backdrops, asset id scheme |
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

## Adding AI-generated assets

Scenes only store asset **ids** (`e:🧙`, `b:forest`, `c:<id>`), never pixels. The
Director's "✨ Create" box sends a text prompt to the server, which calls one function
and stores whatever image comes back as a custom asset of that story:

```js
// my-provider.js
exports.generate = async ({ kind, prompt }) => {
  // kind is 'sprite' (transparent background) or 'backdrop' (4:3)
  const png = await callYourImageModel(prompt, kind);
  return { mime: 'image/png', data: png, name: prompt };   // or null to fall back
};
```

```bash
ASSET_PROVIDER=./my-provider.js node server.js
```

Without a provider, a small built-in procedural generator answers, so the whole
pipeline works today. Music moods follow the same idea in `public/audio.js`.
