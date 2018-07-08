const db = {
  ...require('./userSignupDB.js'),
  ...require('./messageDB.js')
};
const express = require('express');
const app = express.Router();
const config = require('./_config.js');
const security = require('./security');
const mailingDispatch = require('../mailing/mailingDispatch');


app.post('/api/create_user', (req, res) => {

  req.body.password = security.getHashedPassword(req.body.password);

  db.createUser(req.body, (err, user) => {
    if (err) {
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
    let link = "http://" + req.get('host') + "/activate?code=" + verificationCode;

    mailingDispatch.sendWelcomeEmail(user.email, link, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });

    res.json({code: 0, user: user});
  });
});


app.get('/activate', (req, res) => {
  console.log("GET verify user called")

  db.confirmVerification(req.query.code, (error, uid) => {
    if (error) {
      res.redirect('/');
      return;
    }
    db.sendSystemMessage(uid, "欢迎来到伙伴求职。在这里您将接触到最好的求职干货和导师资源。如有任何疑问 ，可发送邮件至help@buddycareer.com联系我们");
    res.redirect('/account');
  });
});

module.exports = app;
