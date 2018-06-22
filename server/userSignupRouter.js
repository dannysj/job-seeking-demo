const db = {
  ...require('./userSignupDB.js'),
  ...require('./messageDB.js')
};
const express = require('express');
const app = express.Router();
const nodemailer = require('nodemailer');
const config = require('./_config.js');
const security = require('./security');


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config.mail_config);


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
    var link = "http://" + req.get('host') + "/activate?code=" + verificationCode;

    // setup e-mail data
    let mailOptions = {
      from: '"同行平台" <' + config.mail_config.auth.user + '>', // sender address
      to: user.email, // list of receivers
      subject: '欢迎您使用同行平台', // Subject line
      text: link, // plaintext body
      html: `亲爱的用户您好：<br>
        感谢您注册使用同行平台，希望能和您一起在这里度过美好的时光！<br>
        <a href=' + link + '>点击此处</a>即可完成邮箱验证。<br>
        如遇到问题可联系同行平台客服助手微信，微信号：tongxingplatform<br>` // html body
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
