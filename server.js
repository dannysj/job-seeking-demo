const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./server/db.js');
const cors = require('cors');


const applyRouter = require('./server/routes/apply.js');
const mentorRouter = require('./server/routes/mentor.js');
const mentorMenteeRouter = require('./server/routes/mentor_mentee.js');
const newsRouter = require('./server/routes/news.js');
const orderRouter = require('./server/routes/order.js');
const signupRouter = require('./server/routes/signup.js');
const systemRouter = require('./server/routes/system');
const userRouter = require('./server/routes/user.js');

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


app.use('/', applyRouter);
app.use('/', mentorRouter);
app.use('/', mentorMenteeRouter);
app.use('/', newsRouter);
app.use('/', orderRouter);
app.use('/', signupRouter);
app.use('/', systemRouter);
app.use('/', userRouter);



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
