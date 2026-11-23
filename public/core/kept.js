/*
 * Kept on this device. What a person builds up apart from any one story — their cast of characters, the
 * Director's shelf, saved rooms, campaigns, objects they drew — lives in the browser's localStorage as short
 * lists, newest first. This is the one place that reads and writes them.
 *
 *   kept.cast       characters from the character maker        { asset, pose }
 *   kept.shelf      things the Director put aside               { asset, pose, name }
 *   kept.rooms      saved rooms, for any story                  { id, name, scene, at }
 *   kept.campaigns  whole maps: scenes and the ways between     { id, name, scenes, at }
 *   kept.objects    drawings from the sprite editor             (see catalog.js)
 *
 * Every write answers true or false: a device can be full, or refuse to keep anything at all.
 */
import { clone, rid } from './dom.js';
import { normScene } from '../shared/scene-model.js';

function list(key, max) {
  const all = () => {
    try {
      const l = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(l) ? l : [];
    } catch {
      return [];
    }
  };
  const set = (items) => {
    try {
      localStorage.setItem(key, JSON.stringify(items.slice(0, max)));
      return true;
    } catch {
      return false;
    }
  };
  return {
    all,
    set,
    /** Put one in front. An older one that is the same (by the field `same`) makes way for it. */
    add: (item, same = 'id') => set([item, ...all().filter((x) => x[same] !== item[same])]),
    remove: (value, by = 'id') => set(all().filter((x) => x[by] !== value)),
  };
}

export const kept = {
  cast: list('tf.cast', 60),
  shelf: list('tf.prep', 40),
  rooms: list('tf.savedRooms', 60),
  campaigns: list('tf.campaigns', 20),
  objects: list('tf.objects', 400),
};

/** Keep a scene as a room for any story. A saved room stands alone: no steps, no ways out, nobody speaking. */
export function keepRoom(name, scene) {
  const room = normScene(
    clone({
      backdrop: scene.backdrop,
      level: scene.level,
      weather: scene.weather,
      mood: scene.mood,
      dark: scene.dark,
      drawing: scene.drawing,
      entities: scene.entities,
      heroId: scene.heroId,
    }),
  );
  for (const e of room.entities) Object.assign(e, { say: '', once: '', emote: '' });
  return kept.rooms.add({ id: rid(), name, scene: room, at: Date.now() }, 'name');
}

/**
 * Bring a saved room into a scene: the place and its things arrive, the hero stays who they are (with whatever
 * they carry) and stands where the room's hero stood.
 */
export function enterRoom(scene, room) {
  const sc = normScene(clone(room.scene)),
    there = sc.entities.find((e) => e.id === sc.heroId),
    hero = scene.entities.find((e) => e.id === scene.heroId);
  Object.assign(scene, {
    backdrop: sc.backdrop,
    level: sc.level,
    weather: sc.weather,
    mood: sc.mood,
    dark: sc.dark,
    drawing: sc.drawing,
    exits: [],
    sceneId: '',
  });
  const ids = new Map(sc.entities.filter((e) => e.id !== sc.heroId).map((e) => [e.id, rid()])); // things tied to each other stay tied
  scene.entities = [
    ...scene.entities.filter((e) => e.id === scene.heroId || (e.tie && e.tie.to === scene.heroId)),
    ...sc.entities
      .filter((e) => ids.has(e.id))
      .map((e) => ({ ...e, id: ids.get(e.id), tie: e.tie && ids.has(e.tie.to) ? { ...e.tie, to: ids.get(e.tie.to) } : null })),
  ];
  if (hero && there) Object.assign(hero, { x: there.x, y: there.y });
  return scene;
}
