const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./server/db/index.js');
const cors = require('cors');

const adminRouter = require('./server/routes/admin.js');                // upload, admin, notification
const applyMentorRouter = require('./server/routes/apply_mentor.js');   // apply & edit mentor info, get college list
const loginSignupRouter = require('./server/routes/login_signup.js');   // create, activate & verify user
const mentorMenteeRouter = require('./server/routes/mentor_mentee.js'); // mentor/mentee rel, mentor/mentee confirm
const newsRouter = require('./server/routes/news.js');                  // create news, news list, news detail
const orderRouter = require('./server/routes/order.js');                // create order, payment
const userInfoRouter = require('./server/routes/user_info.js');         // get user info, update user, major list
const viewMentorRouter = require('./server/routes/view_mentor.js');     // mentor detail, mentor list, mentor comment
//const followRelationRouter = require('./server/routes/follow_relation.js')

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


app.use('/', adminRouter);
app.use('/', applyMentorRouter);
app.use('/', loginSignupRouter);
app.use('/', mentorMenteeRouter);
app.use('/', newsRouter);
app.use('/', orderRouter);
app.use('/', userInfoRouter);
app.use('/', viewMentorRouter);
//app.use('/'. followRelationRouter);


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
