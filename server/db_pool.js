const pg = require('pg');
const config = require('./config.js');
const db = new pg.Pool(config.db);

module.exports = db;