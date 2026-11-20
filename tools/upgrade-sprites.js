#!/usr/bin/env node
/*
 * Replace the placeholder look of the built-in library with real art.
 *
 * Sends every built-in sprite and backdrop through the asset provider (the same
 * hook the in-game "Create" box uses, see providers.js) and writes the results to
 * public/packs/gen/ plus public/packs/manifest.json. The game picks the pack up
 * on the next page load; old stories get the new art too, because scenes only
 * store ids.
 *
 *   ASSET_PROVIDER=./my-provider.js node tools/upgrade-sprites.js [options]
 *
 *   --only=<category>   one emoji category id (people, fantasy, …), "backdrops", "px" (all pixel sprites)
 *                       or "px-<id>" for one pixel category (px-heroes, px-dungeon, …)
 *   --limit=<n>         stop after n new images (try a few before paying for all)
 *   --force             regenerate items that already have pack art
 *   --style="…"         text appended to every prompt, to keep one art style
 *   --placeholder       allow running without a provider (built-in procedural art; for testing only)
 *
 * Needs Node 22 or newer.
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = /^--([^=]+)(?:=(.*))?$/.exec(a);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);
const root = path.join(__dirname, '..');
const packDir = path.join(root, 'public', 'packs');
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg' };

(async () => {
  if (!process.env.ASSET_PROVIDER && !args.placeholder) {
    console.error(
      'No image service is plugged in. Set ASSET_PROVIDER=./your-provider.js (see server/providers.js), or pass --placeholder to test the pipeline.',
    );
    process.exit(1);
  }
  const { generateAsset } = await import(pathToFileURL(path.join(root, 'server', 'providers.js')));
  const { CATEGORIES, BACKDROPS } = await import(pathToFileURL(path.join(root, 'public', 'core', 'catalog.js')));
  const manifestFile = path.join(packDir, 'manifest.json');
  const manifest = { sprites: {}, backdrops: {}, pixel: {}, ...JSON.parse(fs.readFileSync(manifestFile, 'utf8')) };
  fs.mkdirSync(path.join(packDir, 'gen'), { recursive: true });

  const jobs = [];
  for (const c of CATEGORIES)
    if (!args.only || args.only === c.id)
      for (const it of c.items) jobs.push({ kind: 'sprite', slug: it.asset.slice(2), prompt: it.name, into: manifest.sprites });
  // the pixel-art library (public/px): --only=px for all of it, or --only=px-<category id>
  const px = JSON.parse(fs.readFileSync(path.join(root, 'public', 'px', 'index.json'), 'utf8'));
  for (const c of px.categories)
    if (!args.only || args.only === 'px' || args.only === 'px-' + c.id)
      for (const it of c.items)
        jobs.push({
          kind: 'sprite',
          slug: it.slug,
          prompt: it.name + (c.group === 'tile' ? ', seamless top-down game tile' : ''),
          into: manifest.pixel,
          prefix: 'px-',
        });
  if (!args.only || args.only === 'backdrops')
    for (const b of BACKDROPS) jobs.push({ kind: 'backdrop', slug: b.id.slice(2), prompt: b.name, into: manifest.backdrops });

  let made = 0;
  const limit = args.limit ? Number(args.limit) : Infinity;
  for (const job of jobs) {
    if (made >= limit) break;
    if (job.into[job.slug] && !args.force) continue;
    const prompt = job.prompt + (args.style ? ', ' + args.style : '');
    try {
      const out = await generateAsset({ kind: job.kind, prompt });
      const ext = EXT[out.mime];
      if (!ext) throw new Error('unsupported image type ' + out.mime);
      const file = `gen/${job.prefix || (job.kind === 'backdrop' ? 'bg-' : '')}${job.slug}.${ext}`;
      fs.writeFileSync(path.join(packDir, file), out.data);
      job.into[job.slug] = file;
      fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1)); // save as we go: a crash loses nothing paid for
      made++;
      console.log(`${made}  ${job.kind}  ${job.slug}`);
    } catch (e) {
      console.error(`failed  ${job.slug}: ${e.message}`);
    }
  }
  console.log(`Done: ${made} new image(s). ${jobs.length} items in scope.`);
})();
