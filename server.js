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
var paypal = require('paypal-rest-sdk');
var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(config.mail_config);




paypal.configure({
  'mode': 'live', //sandbox or live
  'client_id': process.env.PAYPAL_ID,
  'client_secret': process.env.PAYPAL_SECRET
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/static/files');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime()+'-'+file.originalname);
  }
});
var upload = multer({ storage: storage });
var app = express();
var args = process.argv.slice(2);
var PORT = process.env.PORT || 3005;

app.use(express.static(__dirname + '/static'));
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

app.post('/api/get_mentor_comment', function(req, res){
  db.getMentorComment([], (err, list) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});

app.post('/api/get_news_list', (req, res) => {
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

app.post('/api/get_user_info', (req, res) => {
  db.getUserInfo(req.body.uid, (err, user)=>{
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    res.json({code: 0, user: user});
  });
});

app.post('/api/create_user', function(req, res){
  db.createUser(req.body, (err, user) => {
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }

    let verificationCode = Math.random().toString(32).replace(/[^a-z]+/g, '');

    db.addUserVerificationCode(user.email, verificationCode, (error, data) => {
      if (error) {
        console.log(error);
        res.json({code: 1, errMsg: error});
      }
    });

    var host=req.get('host');
    var link="http://"+req.get('host')+"/activate?code="+verificationCode ;

    // setup e-mail data
    let mailOptions = {
      from: '"Test Job Name" <' + config.mail_config.auth.user + '>', // sender address
      to: user.email, // list of receivers
      subject: 'Welcome to Buddy Career', // Subject line
      text: link, // plaintext body
      html: '<a href='+link+'>Click here to verify</a>' // html body
    };


    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });

    res.json({code: 0, user: user});
  });
});

app.post('/api/verify_user', function(req, res){
  console.log("Verify user called");
  db.verifyUser(req.body, (err, user) => {
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    res.json({code: 0, user: user});
  });
});

app.get('/activate', function(req, res) {
  console.log("GET verify user called")

  db.confirmVerification(req.query.code, error => {
    if (error) {
      res.redirect('/');
      return;
    }
    res.redirect('/account');
  });

});

app.post('/api/update_user', function(req, res){
  db.updateUser(req.body, (err) => {
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

app.post('/callback/payment_complete', function(req, res){
  console.log(JSON.stringify(req.body));
  res.json();
  if(pendingPayments[req.body.orderid].res){
    db.addMentorShip(pendingPayments[req.body.orderid].uid,
      pendingPayments[req.body.orderid].mid,
      pendingPayments[req.body.orderid].service_name,
      pendingPayments[req.body.orderid].service_price,
      (err) => {
        if(err){
          console.log(err);
          pendingPayments[req.body.orderid].res.json({code: 1, errMsg: 'Database Error'});
          pendingPayments[req.body.order_id] = null;
          return;
        }
        pendingPayments[req.body.orderid].res.json({code:0});
        pendingPayments[req.body.order_id] = null;
    });
  }
  else{
// Error Handling
  }
});

app.post('/api/poll_payment', function(req, res){
  pendingPayments[req.body.order_id].res = res;
  setTimeout(function(){
    try{
      res.json({code: 15});
    }catch(e){}
    pendingPayments[req.body.order_id].res = null;
  }, 10000);
  // setTimeout(function(){
  //   db.addMentorShip(pendingPayments[req.body.order_id].uid,
  //     pendingPayments[req.body.order_id].mid,
  //     pendingPayments[req.body.order_id].service_name,
  //     pendingPayments[req.body.order_id].service_price,
  //     (err) => {
  //       if(err){
  //         console.log(err);
  //         res.json({code: 1, errMsg: 'Database Error'});
  //         return;
  //       }
  //       res.json({code:0});
  //   });
  //   pendingPayments[req.body.order_id] = null;
  // }, 3000);
});

app.post('/api/get_rel_mentors', (req, res)=>{
  db.getRelMentors(req.body.uid, (err, mentors)=>{
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code:0, mentors: mentors});
  });
});

app.post('/api/get_rel_mentees', (req, res)=>{
  db.getRelMentees(req.body.uid, (err, mentees)=>{
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code:0, mentees: mentees});
  });
});

app.post('/api/create_order', function(req, res){
  var timestamp = new Date().getTime();

  var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://job.y-l.me/return/payment_complete",
        "cancel_url": "http://job.y-l.me/return/payment_cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": req.body.service_name,
                "sku": req.body.service_name,
                "price": req.body.service_price,
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": req.body.service_price
        },
        "description": "Buddy Career 提供的服务"
    }]
};

  paypal.payment.create(create_payment_json, function (err, payment) {
    if (err) {
      console.log(err);
      res.json({code: 2, errMsg: 'Paypal API Error'});
      return;
    }

    var redirect_url = '';
    payment.links.forEach(function(el){
      if(el.rel == 'approval_url')
        redirect_url = el.href;
    });

    pendingPayments[payment.id] = {uid: req.body.uid, mid: req.body.mid, service_name: req.body.service_name, service_price: req.body.service_price};
    console.dir(payment);
    res.json({code: 0, url: redirect_url});
  });

  // var value_in_whole = timestamp+'-'+req.body.uid+'-'+req.body.mid +
  //   2+'http://job.y-l.me/callback/payment_complete'+timestamp+parseFloat(req.body.service_price).toFixed(2)+
  //   'http://job.y-l.me/mentor'+process.env.PAY_TOKEN+process.env.PAY_UID;
  // var md5hash = crypto.createHash('md5').update(value_in_whole).digest("hex");
  // var postData = JSON.stringify({
  //   uid: process.env.PAY_UID,
  //   goodsname: timestamp+'-'+req.body.uid+'-'+req.body.mid,
  //   istype: 2,
  //   notify_url: 'http://job.y-l.me/callback/payment_complete',
  //   orderid: timestamp,
  //   price: parseFloat(req.body.service_price).toFixed(2),
  //   return_url: 'http://job.y-l.me/mentor',
  //   key: md5hash
  // });
  // let options = {
  //   hostname: 'pay.paysapi.com',
  //   port: 443,
  //   path: '/?format=json',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Content-Length': postData.length
  //   }
  // };
  // console.log(postData);
  // var reqp = https.request(options, (resp) => {
  //   console.log('statusCode:', resp.statusCode);
  //   console.log('headers:', resp.headers);
  //
  //   resp.on('data', (d) => {
  //     var result = JSON.parse(d);
  //     console.dir(result);
  //     pendingPayments[result.data.orderid] = {uid: req.body.uid, mid: req.body.mid, service_name: req.body.service_name, service_price: req.body.service_price};
  //     res.json({code: 0, order_id:result.data.orderid, qr_code: result.data.qrcode});
  //   });
  // });
  //
  // reqp.on('error', (e) => {
  //   console.error(e);
  // });
  //
  // reqp.write(postData);
  // reqp.end();
});

app.get('/return/payment_complete', (req, res)=>{
  paypal.payment.get(req.query.paymentId, (err, payment) => {
    console.dir(payment);
    if (err) {
      console.log(err);
      res.json({code: 2, errMsg: 'Paypal API Error'});
      return;
    }

    // if(payment.payer.status == 'VERIFIED'){ // TODO: uncommment these

      db.addMentorShip(pendingPayments[payment.id].uid,
        pendingPayments[payment.id].mid,
        pendingPayments[payment.id].service_name,
        pendingPayments[payment.id].service_price,
        (err) => {
          if(err){
            console.log(err);
            pendingPayments[payment.id] = null;
            return;
          }
          pendingPayments[payment.id] = null;
          res.redirect('/account/mentor');
      });

    // }
    // else{
      // res.redirect('/account/payment_fail');
    // }
  });
});

app.post('/api/mentor_confirm', (req, res)=>{
  db.setMentorConfirm(req.body.uid, req.body.mentee_uid, (err)=>{
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code:0});
  });
});

app.post('/api/mentee_confirm', (req, res)=>{
  db.setMenteeConfirm(req.body.uid, req.body.mid, (err)=>{
    if(err){
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code:0});
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
