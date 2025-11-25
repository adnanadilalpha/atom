process.env.ATOM_SERVERLESS = 'true';
process.env.VERCEL = '1';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('../dist/server.js');
require('../dist/ssr.js');

let runner;
try {
    runner = require('../system/runner');
} catch (localErr) {
    try {
        runner = require('atom-framework/system/runner');
    } catch (pkgErr) {
        console.error('[ATOM] Unable to resolve system runner from "../system/runner" or "atom-framework/system/runner".');
        throw pkgErr;
    }
}

module.exports = runner;
