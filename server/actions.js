/* Everything a client may ask for, by name. Each handler takes (room, body, who) with who = { role, token }. */
import { fail } from './util.js';
import { roleOf } from './rooms.js';
import { actSubmit, actSettings, actEnd } from './turns.js';
import { actClaude, actSaveScenes, actRandomScene, actAddAsset, actGenerate } from './director.js';
import { actRpgDef, actRpgStart, actRpgAgain, actRpgCmd, actRpgSnap } from './dungeon.js';

const ACTIONS = {
  submit: actSubmit, settings: actSettings, claude: actClaude, saveScenes: actSaveScenes, randomScene: actRandomScene, end: actEnd, addAsset: actAddAsset, generate: actGenerate,
  rpgDef: actRpgDef, rpgStart: actRpgStart, rpgAgain: actRpgAgain, rpgCmd: actRpgCmd, rpgSnap: actRpgSnap,
};
export async function act(room, token, body) {
  const handler = Object.hasOwn(ACTIONS, body.type) ? ACTIONS[body.type] : null;
  if (!handler) throw fail(400, 'Unknown action');
  return handler(room, body, { role: roleOf(room, token), token });
}
