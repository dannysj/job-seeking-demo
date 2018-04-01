var express = require('express');
var pg = require('pg');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./server/db.js');
var config = require('./server/config.js');
var http = require('http');
var https = require('https');
var multer  = require('multer');
var crypto = require('crypto');
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
  db.createUser(req.body, (err, user) => {
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    res.json({code: 0, user: user}); // TODO: Return token
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

var pendingPayments = {};

app.post('/api/callback/payment_complete', function(req, res){
  console.log(JSON.stringify(req.body));
  res.json();
  if(pendingPayments[req.body.orderid]){
    pendingPayments[req.body.orderid].json({code:0});
  }
  else{
// Error Handling
  }
});

app.post('/api/poll_payment', function(req, res){
  pendingPayments[req.body.order_id] = res;
  setTimeout(function(){
    res.json({code: 15});
    pendingPayments[req.body.order_id] = null;
  }, 10000);
});

app.post('/api/create_order', function(req, res){

  console.log(process.env.PAY_UID);
  var timestamp = new Date().getTime();
  var value_in_whole = timestamp+'-'+req.body.uid+'-'+req.body.mid +
    2+'http://job.y-l.me/callback/payment_complete'+timestamp+req.body.service_price+
    'http://job.y-l.me/mentor'+process.env.PAY_TOKEN+process.env.PAY_UID;
  var md5hash = crypto.createHash('md5').update(value_in_whole).digest("hex");
  var postData = JSON.stringify({
    uid: process.env.PAY_UID,
    goodsname: timestamp+'-'+req.body.uid+'-'+req.body.mid,
    istype: 2,
    notify_url: 'http://job.y-l.me/callback/payment_complete',
    orderid: timestamp,
    price: req.body.service_price,
    return_url: 'http://job.y-l.me/mentor',
    key: md5hash
  });
  let options = {
    hostname: 'pay.paysapi.com',
    port: 443,
    path: '/?format=json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };
  console.log(postData);
  var req = https.request(options, (resp) => {
    console.log('statusCode:', resp.statusCode);
    console.log('headers:', resp.headers);

    resp.on('data', (d) => {
      var result = JSON.parse(d);
      console.dir(result);
      pendingPayments[result.data.orderid] = true;
      res.json({code: 0, order_id:result.data.orderid, qr_code: result.data.qrcode});
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(postData);
  req.end();
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
