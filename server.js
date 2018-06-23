const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./server/_dbInit');
const cors = require('cors');
const router = require('./server/_router');
const access_token_validator = require('./server/security').access_token_validator;

const app = express();
const args = process.argv.slice(2);
const PORT = process.env.PORT || 3005;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', )
app.use('/', router);


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
}

main();
