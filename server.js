var express = require('express');
var pg = require('pg');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./server/db.js');
var config = require('./server/config.js');
var http = require('http');
var https = require('https');
var app = express();
var args = process.argv.slice(2);
var PORT = process.env.PORT || 3005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.post('/api/industry_list', function(req, res){
  db.getIndustryList((err, list) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});

app.post('/api/get_mentor_list', function(req, res){
  db.getMentorList([], (err, list) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});

app.post('/api/create_user', function(req, res){
  db.createUser(req.body, (err) => {
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    res.json({code: 0}); // TODO: Return token
  });
});

app.post('/api/verify_user', function(req, res){
  db.verifyUser(req.body, (err, user) => {
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    res.json({code: 0, user: user});
  });
});

// Static resources
app.use(express.static(__dirname + '/build'));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/build/index.html');
});

function server() {
  app.listen(PORT, function() {
    console.log('Listening on port %d', PORT);
  });
}

function main() {
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
