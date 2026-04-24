'use strict';
// CJS entry point - ensures require('baileys') returns the function directly
// while preserving all named exports via Object.assign
const baileys = require('./lib/index.js');
module.exports = baileys.default;
// Re-attach all named exports so destructuring works: const { makeWASocket } = require('baileys')
Object.assign(module.exports, baileys);
