const pg = require('pg');
const config = require('./_config.js');
const db = new pg.Pool(config.db);

module.exports = db;