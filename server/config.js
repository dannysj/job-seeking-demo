var url = require('url');
var self = this;

if (process.env.DATABASE_URL) {
  var db_params = url.parse(process.env.DATABASE_URL);
  var db_auth = db_params.auth.split(':');
  self.db = {
    user: db_auth[0],
    password: db_auth[1],
    host: db_params.hostname,
    port: db_params.port,
    database: db_params.pathname.split('/')[1],
    max: 20,
    idleTimeoutMillis: 30000
  };
}
else {
  self.db = {
    user: 'postgres',
    database: 'db',
    password: 'dannychew7',
    host: 'localhost',
    port: 5080,
    max: 20,
    idleTimeoutMillis: 30000
  };
}

self.jwtSecret = 'y8$8HBH+du6H3a[C7ticMF)Pf{]8tBDM';

self.root_admin = {
  email: 'asampaioemello@gmail.com',
  password: 'Fontelonga1$',
  info: {
    name: 'Game Master',
    companyName: 'MasterCFO'
  }
};

self.mail_config = {
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'non-reply@y-l.me',
    pass: 'nonreply123',
  }
}

exports.self;
