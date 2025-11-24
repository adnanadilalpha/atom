process.env.ATOM_SERVERLESS = 'true';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('../dist/server.js');
require('../dist/ssr.js');

module.exports = require('../system/runner');
