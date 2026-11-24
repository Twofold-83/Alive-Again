/* What the Director's menu can do to the turn: the bridge between the question tree (guided.js, screens/)
 * and the draft. Also going to scenes from the map, opening Build scene, and making custom art. */
import { isDoll } from '../core/dolls.js';
import { openDollMaker } from '../build/dollmaker.js';
import { normScene, newEntity, freeSpot, HERO_ASSET, MAX_ENTITIES } from '../shared/scene-model.js';
import { assetName } from '../core/catalog.js';
import { rid, toast, $ } from '../core/dom.js';
import { dropTrack, trackEnd, autoTrack } from './input.js';
import { audio } from '../core/audio.js';
import { pen, mods, hero, directing, app } from '../core/state.js';
import { act } from '../core/net.js';
import { kept, workingOn, workOn } from '../core/kept.js';
import {
  canUndo,
  undo,
  changed,
  changedQuiet,
  rebuild,
  stepEmpty,
  nextStep,
  resetStep,
  clearSteps,
  gotoStep,
  previewCut,
  finalScene,
  saveDraft,
  testPlay,
  ONE_STEP,
  PLAYERS,
} from './turn.js';
import { shareLink } from '../shell/chrome.js';
import { setRules, typeCard, render } from './view.js';
import { openStory } from './viewer.js';
import { leave } from '../shell/home.js';
import { clone, clamp, h } from '../core/dom.js';

import { openMap } from '../build/map.js';
import { resetGuided, guidedStart, guidedPick } from './guided.js';

const IDEAS = [
  'A stranger arrives who knows the hero’s name.',
  'Something on stage is not what it seems.',
  'The lights go out. When they return, one thing is missing.',
  'A character reveals they have been lying.',
  'A letter arrives. It is addressed to the hero.',
  'The weather turns, and with it the mood.',
  'An old friend appears — changed.',
  'A door that was locked is now open.',
  'Someone offers a deal that is too good.',
  'The ground shakes. Time is running out.',
  'A small animal leads the way somewhere unexpected.',
  'The hero finds an object from their own past.',
  'Two characters want opposite things from the hero.',
  'It was all a stage set. What is behind it?',
  'A countdown begins. Nobody says what happens at zero.',
];
function giveToPlayer(e) {
  if (app.draft.sheet.inv.length >= 24) return toast('The inventory is full');
  app.draft.sheet.inv.push({ id: rid(), asset: e.asset, name: assetName(e.asset) });
  removeEntity(e);
}
export function removeEntity(e) {
  app.draft.entities = app.draft.entities.filter((x) => x !== e);
  dropTrack(e.id);
  if (app.draft.heroId === e.id) app.draft.heroId = null;
  if (app.draft.target === e.id) app.draft.target = null;
  if (app.selId === e.id) app.selId = null;
}
export const guidedCtx = {
  get draft() {
    return app.draft;
  },
  get S() {
    return app.S;
  },
  get code() {
    return app.code;
  },
  pen,
  map: () => showMap(),
  get campaign() {
    return campaign; // preparing a campaign: save, save as, load
  },
  testPlay,
  useScene,
  travelTo: (id) => travelTo(id),
  rid,
  select(id) {
    app.selId = id || null;
  },
  nextStep,
  resetStep,
  clearSteps,
  gotoStep,
  stepEmpty,
  canUndo,
  undo,
  cutting: () => !!app.cut,
  preview: () => previewCut(),
  mods: () => mods(),
  trackEnd: (id) => trackEnd(id),
  dropTrack: (id) => dropTrack(id),
  toast,
  act,
  audio,
  rebuild: () => rebuild(),
  changed: () => changed(),
  changedQuiet: () => changedQuiet(),
  addEntity: (a) => addEntity(a),
  removeEntity: (e) => removeEntity(e),
  giveToPlayer: (e) => giveToPlayer(e),
  autoTrack: (e, st) => autoTrack(e, st),
  maker: (k, f) => maker(k, f),
  randomScene: () => randomScene(),
  typeCard: () => typeCard(),
  setRules: (r) => setRules(r),
  setInfo: (info) => {
    app.S.info = info;
    act('settings', { info }, 3).catch((e) => toast(e.message));
  },
  shareLink: () => shareLink(),
  openStory: () => openStory(),
  leave: () => leave(),
  idea: () => toast('' + IDEAS[Math.floor(Math.random() * IDEAS.length)]),
  dollMaker: (e) => showDollMaker(e),
};
/* ---------- the map: scenes kept for this story ---------- */
function blankHero() {
  return newEntity((hero(app.S.scene) || { asset: HERO_ASSET }).asset, { id: 'hero', y: 0.8 });
}
/** Bring a scene from the map on the stage, as part of the current step. The hero stays who they are, with what they hold. */
function useScene(doc) {
  const src = doc.scene,
    me = hero(app.draft),
    at = src.entities.find((e) => e.id === src.heroId),
    carried = me ? app.draft.entities.filter((e) => e.tie && e.tie.to === me.id) : [],
    cameFrom = app.draft.sceneId;
  Object.assign(app.draft, {
    backdrop: src.backdrop,
    mood: src.mood,
    weather: src.weather,
    dark: src.dark || 0,
    level: clone(src.level),
    drawing: clone(src.drawing || []),
    exits: clone(src.exits || []),
    sceneId: doc.id,
    tracks: [],
    cam: null,
  });
  const ids = new Map(src.entities.map((e) => [e.id, e.id === src.heroId && me ? me.id : rid()])); // ties keep pointing at the right thing
  app.draft.entities = src.entities
    .filter((e) => e.id !== src.heroId && !(me && e.tie && e.tie.to === src.heroId)) // what the hero holds comes from the hero on stage
    .map((e) => ({ ...clone(e), id: ids.get(e.id), say: '', tie: e.tie && ids.has(e.tie.to) ? { ...e.tie, to: ids.get(e.tie.to) } : null }));
  if (me) {
    const door = cameFrom && app.draft.exits.find((x) => x.to === cameFrom); // arrive at the way back to where they came from
    if (door) {
      me.x = clamp(door.x + (door.x < 0.5 ? 0.08 : -0.08), 0.04, 0.96);
      me.y = clamp(door.y + (door.y < 0.3 ? 0.14 : 0.05), 0.1, 1);
    } else if (at) {
      me.x = at.x;
      me.y = at.y;
    }
    app.draft.entities.push(me, ...carried);
  }
  app.selId = null;
  rebuild();
}
/** The Player goes through an exit: bring in the scene behind it with a "Traveling to" moment. */
function travelTo(sceneId) {
  const doc = (app.S.scenes || []).find((d) => d.id === sceneId);
  if (!doc) {
    toast('That exit does not lead to a prepared scene yet — connect it on the map');
    return null;
  }
  useScene(doc);
  app.draft.travel = doc.name;
  app.draft.exit = null;
  rebuild();
  return doc;
}
/** A copy of what is on stage, to keep on the map: the place and its things, without this turn's lines and moments. */
function stageCopy() {
  const scene = normScene({
    ...clone(app.draft),
    ...clone(ONE_STEP),
    ...PLAYERS,
    steps: [],
    narration: '',
    choices: [],
    ask: null,
    cam: null,
    battle: null,
    said: undefined,
    rollWant: undefined,
  });
  for (const e of scene.entities) Object.assign(e, { say: '', once: '' });
  return scene;
}
export function showMap() {
  const can = directing();
  $('#panel').replaceChildren();
  openMap({
    code: app.code,
    names: app.S.names,
    scenes: clone(app.S.scenes || []),
    blankHero,
    toast,
    stage: can ? stageCopy : null,
    sceneId: () => (can ? app.draft.sceneId : app.S.scene.sceneId),
    save: (scenes) => {
      app.S.scenes = clone(scenes);
      return act('saveScenes', { scenes }, 3).catch((e) => toast(e.message));
    },
    use: can ? useScene : null,
    closed: () => {
      resetGuided();
      if (directing()) guidedStart(app.draft);
      app.uiKey = '';
      render();
    },
  });
}

/* ---------- preparing a campaign: the map and the stage being worked on, kept on this device under a name ---------- */
/** The stage belongs on the map: its scene there is brought up to date, or it is added as a new one. */
function stageOnMap() {
  const scenes = clone(app.S.scenes || []),
    scene = stageCopy();
  let doc = scenes.find((s) => s.id === app.draft.sceneId);
  if (doc) doc.scene = scene;
  else scenes.push((doc = { id: rid(), name: `Scene ${scenes.length + 1}`, scene }));
  app.draft.sceneId = scene.sceneId = doc.id;
  return scenes;
}
function putScenes(scenes) {
  app.S.scenes = scenes;
  act('saveScenes', { scenes }, 3).catch((e) => toast(e.message));
}
const campaign = {
  current: () => workingOn(app.code),
  all: () => kept.campaigns.all(),
  /** Save over the campaign being worked on; with a name, save as a new one (and work on that from now on). */
  save(name) {
    const cur = workingOn(app.code);
    if (!name && !cur) return false;
    const scenes = stageOnMap(),
      c = { id: name ? rid() : cur.id, name: name || cur.name, at: Date.now(), scenes: clone(scenes) };
    putScenes(scenes);
    act('keepStage', { scene: finalScene() }, 3).catch(() => {}); // the story remembers the stage too
    const ok = kept.campaigns.add(c, name ? 'name' : 'id');
    if (ok) workOn(app.code, c.id);
    toast(ok ? `Campaign “${c.name}” is saved: ${scenes.length} scene${scenes.length === 1 ? '' : 's'}` : 'This device has no room left to save it');
    saveDraft();
    rebuild();
    return ok;
  },
  /** Work on a saved campaign: its scenes become the map, and the stage shows its first scene. */
  load(c) {
    const scenes = clone(c.scenes || [])
      .filter((s) => s && s.scene && Array.isArray(s.scene.entities))
      .map((s) => ({ ...s, scene: normScene(s.scene) }));
    putScenes(scenes);
    workOn(app.code, c.id);
    if (scenes[0]) useScene(scenes[0]);
    else rebuild();
    toast(`Working on “${c.name}”`);
  },
  forget(c) {
    kept.campaigns.remove(c.id);
    rebuild();
  },
};

/** The character maker, for a new person or (given a paper doll already on stage) to change how that one looks. */
function showDollMaker(edit) {
  const me = hero(app.draft);
  openDollMaker({
    asset: edit && isDoll(edit.asset) ? edit.asset : null,
    pose: edit && edit.pose,
    actions: edit
      ? [
          {
            label: 'Use this look',
            primary: true,
            run: (asset, pose) => {
              edit.asset = asset;
              edit.pose = pose;
              rebuild();
            },
          },
        ]
      : [
          {
            label: 'Put on the stage',
            primary: true,
            run: (asset, pose) => {
              const e = addEntity(asset);
              if (e) {
                e.pose = pose;
                guidedPick(e.id);
                rebuild();
              }
            },
          },
          me && {
            label: 'Make this the Player’s hero',
            run: (asset, pose) => {
              me.asset = asset;
              me.pose = pose;
              rebuild();
            },
          },
        ].filter(Boolean),
  });
}
function addEntity(asset) {
  if (app.draft.entities.length >= MAX_ENTITIES) return void toast('The stage is full');
  const e = newEntity(asset, { id: rid(), ...freeSpot(app.draft, 0.62) }); // on the ground of the backdrop
  app.draft.entities.push(e);
  app.selId = e.id;
  app.selInv = null;
  return e;
}
async function randomScene() {
  try {
    const { place } = await act('randomScene', {}, 2);
    const me = hero(app.draft);
    app.draft.entities = [...place.entities, ...(me ? [me] : [])];
    Object.assign(app.draft, {
      backdrop: place.backdrop,
      mood: place.mood,
      weather: place.weather,
      card: place.card,
      narration: place.narration,
      tracks: [],
      drawing: [],
    });
    if (me) {
      me.x = 0.3;
      me.y = 0.82;
    }
    app.selId = null;
    rebuild();
    return true;
  } catch (e) {
    toast(e.message);
    return false;
  }
}

/** Upload-or-generate box. Both paths end in a custom asset stored with the story. */
function maker(kind, onAsset) {
  const what = kind === 'backdrop' ? 'backdrop' : 'character or thing';
  const done = (r) => {
    app.uiKey = '';
    onAsset(r.asset.id);
  };
  const file = h('input', {
    type: 'file',
    accept: 'image/*',
    hidden: true,
    onchange: async () => {
      if (!file.files[0]) return;
      try {
        const f = file.files[0];
        done(await act('addAsset', { kind, name: f.name.replace(/\.\w+$/, ''), dataUrl: await fileToDataUrl(f, kind) }));
      } catch (e) {
        toast(e.message);
      }
      file.value = '';
    },
  });
  const promptEl = h('input', { placeholder: `Describe a ${what}…`, maxlength: 200, enterkeyhint: 'go' });
  const go = h(
    'button',
    {
      onclick: async () => {
        if (!promptEl.value.trim()) return promptEl.focus();
        go.disabled = true;
        go.textContent = '…';
        try {
          done(await act('generate', { kind, prompt: promptEl.value }));
        } catch (e) {
          toast(e.message);
          go.disabled = false;
          go.textContent = 'Create';
        }
      },
    },
    'Create',
  );
  return h(
    'div',
    { class: 'maker' },
    h('div', { class: 'row' }, promptEl, go),
    h('div', { class: 'row' }, h('button', { class: 'grow', onclick: () => file.click() }, 'Use a photo or image'), file),
    h('p', { class: 'hint' }, 'Created assets stay with this story.'),
  );
}
async function fileToDataUrl(f, kind) {
  const img = await new Promise((ok, no) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => no(new Error('Could not read that image'));
    i.src = URL.createObjectURL(f);
  });
  const c = document.createElement('canvas');
  if (kind === 'backdrop') {
    c.width = 640;
    c.height = 480;
    const s = Math.max(640 / img.width, 480 / img.height);
    c.getContext('2d').drawImage(img, (640 - img.width * s) / 2, (480 - img.height * s) / 2, img.width * s, img.height * s);
    return c.toDataURL('image/jpeg', 0.8);
  }
  const s = Math.min(1, 200 / Math.max(img.width, img.height));
  c.width = Math.max(1, Math.round(img.width * s));
  c.height = Math.max(1, Math.round(img.height * s));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/png');
}
