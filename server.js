// Twofold — start with `node server.js`. The server itself lives in server/ (ES modules).
import('./server/index.js').catch((e) => { console.error(e); process.exit(1); });
