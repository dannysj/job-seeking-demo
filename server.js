var express = require('express');
var pg = require('pg');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./server/db.js');
var config = require('./server/config.js');
var http = require('http');
var https = require('https');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/public/files');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime()+'-'+file.originalname);
  }
});
var upload = multer({ storage: storage });
var app = express();
var args = process.argv.slice(2);
var PORT = process.env.PORT || 3005;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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

app.post('/api/get_news_list', function(req, res){
  db.getNewsList(req.body.batch_size, req.body.batch_num, (err, news_list) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, news_list: news_list});
  });
});

app.post('/api/get_news_detail', function(req, res){
  db.getNewsDetail(req.body.nid, (err, news) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, news: news});
  });
});

app.post('/api/mentor_apply', function(req, res){
  db.createMentorApp(req.body, (err) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/get_mentor_detail', function(req, res){
  db.getMentorDetail(req.body.mid, (err, mentor) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, mentor: mentor});
  });
});

app.post('/api/get_college_list', function(req, res){
  db.getCollegeList((err, list) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});

app.post('/api/admin/create_news', function(req, res){
  // TODO: Authentication
  req.body.type=0; // News submitted by admin
  db.createNews(req.body, (err, nid) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, nid: nid});
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

app.post('/api/update_user', function(req, res){
  db.updateUser(req.body, (err, user) => {
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: 'Operation Forbidden'});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/file/general_upload', upload.single('file'), function(req, res) {
  if (!req.file)
    return res.json({code: -21, errMsg: 'No files found'});

  res.json({code: 0, url:'/files/'+req.file.filename});
});

app.post('/api/admin/get_applications', function(req, res){
  db.getMentorApplications((err, list) => {
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: 'Operation Forbidden'});
      return;
    }
    res.json({code: 0, applications:list});
  });
});

app.post('/api/admin/decide_mentor_app', function(req, res){
  if(req.body.decision == 1){
    db.approveMentor(req.body.uid, req.body.mid, (err) => {
      if(err){
        console.log(err);
        res.json({code: 1, errMsg: 'Database Error'});
        return;
      }
      res.json({code:0});
    });
  }
  else{
    db.disapproveMentor(req.body.uid, req.body.mid, (err) => {
      if(err){
        console.log(err);
        res.json({code: 1, errMsg: 'Database Error'});
        return;
      }
      res.json({code:0});
    });
  }
});

app.post('/api/get_application_status', function(req, res){
  db.getApplicationStatus(req.body.uid, (err, status_code) => {
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0, status: status_code});
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
