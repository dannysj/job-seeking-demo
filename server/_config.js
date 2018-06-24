const url = require('url');

if (process.env.DATABASE_URL) {
  const db_params = url.parse(process.env.DATABASE_URL);
  const db_auth = db_params.auth.split(':');
  exports.db = {
    user: db_auth[0],
    password: db_auth[1],
    host: db_params.hostname,
    port: db_params.port,
    database: db_params.pathname.split('/')[1],
    max: 20,
    idleTimeoutMillis: 30000
  };
} else {
  console.log("Warning: DATABASE_URL should be passed as environment variable");
  exports.db = {
    user: 'postgres',
    database: 'db',
    password: 'dannychew7',
    host: 'localhost',
    port: 5080,
    max: 20,
    idleTimeoutMillis: 30000
  };
}


exports.hash_salt = (!!process.env.HASH_SALT) ? process.env.HASH_SALT : 'defaultsalt'

exports.jwtSecret = 'y8$8HBH+du6H3a[C7ticMF)Pf{]8tBDM';

exports.root_admin = {
  email: 'asampaioemello@gmail.com',
  password: 'Fontelonga1$',
  info: {
    name: 'Game Master',
    companyName: 'MasterCFO'
  }
};

exports.mail_config = {
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'non-reply@y-l.me',
    pass: 'nonreply123',
  }
};
