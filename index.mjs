// ESM entry point - ensures default import returns the function
// while preserving all named exports
import baileys from './lib/index.js';
export default baileys.default || baileys;
export const { makeWASocket, proto, ...rest } = baileys;
export * from './lib/index.js';
