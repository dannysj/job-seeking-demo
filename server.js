const express = require('express');
const bodyParser = require('body-parser');
const db = require('./server/dangerous/db_reset');
const cors = require('cors');
const router = require('./server/router/index');
const access_token_validator = require('./server/middleware/access_token_validator');
const error_handler = require('./server/middleware/error_handler');

const app = express();
const args = process.argv.slice(2);
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(access_token_validator);
app.use('/', router);
app.use(error_handler);

const send_index = (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
};

app.use(send_index);

const server = () => {
  app.listen(PORT, function() {
    console.log('Listening on port %d', PORT);
  });
};

const main = () => {
  if (process.env.INSTALL === 'yes') {
    db.reset();
  }
  else if (process.env.PATCH === 'yes') {
    db.patch();
  }
  if (args.length === 0 || args[0] === 'server') {
    server();
  }
  else if (args[0] === 'reset' || args[0] === 'install') {
    db.reset();
  }
  else if (args[0] === 'patch') {
    db.patch();
  }
  else if (args[0] === 'clear' && args[1]) {
    db.clear_table(args[1]);
  }
  else {
    console.log('Invalid command.');
  }
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

main();
