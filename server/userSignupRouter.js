const db = {
  ...require('./userSignupDB.js'),
  ...require('./messageDB.js')
};
const express = require('express');
const app = express.Router();
const nodemailer = require('nodemailer');
const config = require('./_config.js');


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config.mail_config);


app.post('/api/create_user', (req, res) => {
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
    var link = "http://" + req.get('host') + "/activate?code=" + verificationCode;

    // setup e-mail data
    let mailOptions = {
      from: '"Test Job Name" <' + config.mail_config.auth.user + '>', // sender address
      to: user.email, // list of receivers
      subject: 'Welcome to Buddy Career', // Subject line
      text: link, // plaintext body
      html: '<a href=' + link + '>Click here to verify</a>' // html body
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