import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const MAX_AI_CALLS = Number(process.env.CLAUDE_MAX_PER_STORY) || 150;   // per story, to keep API spending bounded

export const PORT = Number(process.env.PORT) || 3000;
export const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
export const PUBLIC = path.join(ROOT, 'public');

export const GRACE_MS = 4000;              // slack after the deadline for a client's auto-submit to arrive
export const MAX_BODY = 2 * 1024 * 1024;
export const MAX_ASSET_BYTES = 400 * 1024;
export const MAX_ENTITIES = 80;
export const MAX_ASSETS = 80;
export const MAX_HISTORY = 1000;
export const MAX_ROOMS = 5000;
export const ROOM_TTL_MS = 14 * 24 * 3600 * 1000;
export const ASSET_MIME = /^image\/(png|jpeg|webp|svg\+xml)$/; // codes of rooms whose bot is currently "thinking"
export const BOT_DELAY_MS = process.env.BOT_DELAY_MS != null ? Number(process.env.BOT_DELAY_MS) : null;

export const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
