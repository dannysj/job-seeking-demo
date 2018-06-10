const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./server/db.js');
const config = require('./server/config.js');
const multer  = require('multer');
const paypal = require('paypal-rest-sdk');
const nodemailer = require('nodemailer');
const msg = require('./server/message.js');
const messageDispatch = new msg(db);
const cors = require('cors');
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

app.use(cors())
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
  db.getMentorComment(req.body.mid, (err, list) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});

app.post('/api/create_mentor_comment', function(req, res){
  db.createMentorComment(req.body, (err) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/create_mentor_reply', function(req, res){
  db.createMentorReply(req.body, (err) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
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
  db.verifyInfoCompletion(req.body.uid, (err, isCompleted)=>{
    if(isCompleted){
      db.createMentorApp(req.body, (err) => {
        if(err){
          console.log(err);
          res.json({code: 1});
          return;
        }
        res.json({code: 0});
      });
    }
    else{
      res.json({code: 45});
    }
  });
});

app.post('/api/mentor_edit', function(req, res){
  db.editMentorInfo(req.body, (err) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/get_mentor_detail_by_uid', function(req, res){
  db.getMentorDetailByUid(req.body.uid, (err, mentor) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    if(mentor){
      res.json({code: 0, mentor: mentor});
    }
    else{
      res.json({code: 55})
    }
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
  db.getCollegeList(req.body.query, (err, list) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});

app.post('/api/create_news', function(req, res){
  // TODO: Authentication
  req.body.type=0; // News submitted by admin (Obselated, remove if necessary)
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

  db.confirmVerification(req.query.code, (error, uid) => {
    if (error) {
      res.redirect('/');
      return;
    }
    messageDispatch(uid, "欢迎来到伙伴求职。在这里您将接触到最好的求职干货和导师资源。如有任何疑问 ，可发送邮件至help@buddycareer.com联系我们");
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
      messageDispatch.sendSystemMessage(req.body.uid, "您的导师申请已被通过。您的账户已成为导师账户，请经常查看系统通知并为Mentee提供优质服务");
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
      messageDispatch.sendSystemMessage(req.body.uid, "我们抱歉地通知您，您的导师申请未被通过。您可以联系我们获得具体原因");
      res.json({code:0});
    });
  }
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
  // Temporary code for internal testing.
  // No payment required, get straight through as if payment confirmed
  db.addMentorShip(req.body.uid,
    req.body.mid,
    req.body.service_name,
    req.body.service_price,
    (err) => {
      if(err){
        console.log(err);
        res.json({code: 1});
      }
      res.json({code: 0, url: '/account/mentor'});
  });
//   var timestamp = new Date().getTime();
//
//   var create_payment_json = {
//     "intent": "sale",
//     "payer": {
//         "payment_method": "paypal"
//     },
//     "redirect_urls": {
//         "return_url": "http://job.y-l.me/return/payment_complete",
//         "cancel_url": "http://job.y-l.me/return/payment_cancel"
//     },
//     "transactions": [{
//         "item_list": {
//             "items": [{
//                 "name": req.body.service_name,
//                 "sku": req.body.service_name,
//                 "price": req.body.service_price,
//                 "currency": "USD",
//                 "quantity": 1
//             }]
//         },
//         "amount": {
//             "currency": "USD",
//             "total": req.body.service_price
//         },
//         "description": "Buddy Career 提供的服务"
//     }]
// };
//
//   paypal.payment.create(create_payment_json, function (err, payment) {
//     if (err) {
//       console.log(err);
//       res.json({code: 2, errMsg: 'Paypal API Error'});
//       return;
//     }
//
//     var redirect_url = '';
//     payment.links.forEach(function(el){
//       if(el.rel == 'approval_url')
//         redirect_url = el.href;
//     });
//
//     pendingPayments[payment.id] = {uid: req.body.uid, mid: req.body.mid, service_name: req.body.service_name, service_price: req.body.service_price};
//     console.dir(payment);
//     res.json({code: 0, url: redirect_url});
//   });
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

app.post('/api/get_system_notifications', (req, res)=>{
  messageDispatch.getNotifications(req.body.uid, (err, notifications)=>{
    if(err){
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0, messages:notifications});
  });
});

app.post('/api/read_system_notification', (req, res)=>{
  messageDispatch.readNotifications();
  res.json({code: 0});
})

// Static resources
app.use(express.static(__dirname + '/build'));

const send_index = (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
}

app.use(send_index);

const server = () => {
  app.listen(PORT, function() {
    console.log('Listening on port %d', PORT);
  });
}

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
