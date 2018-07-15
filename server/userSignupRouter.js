const db = {
  ...require('./userSignupDB.js'),
  ...require('./messageDB.js'),
  ...require('./userInfoDB')
};
const express = require('express');
const app = express.Router();
const config = require('./_config.js');
const security = require('./security');
const password_generator = require('generate-password');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config.mail_config);
const mailingDispatch = require('../mailing/mailingDispatch');


const generateVerificationCodeAndSendWelcomeEmail = async (hostname, email) => {
  let verificationCode = Math.random().toString(32).replace(/[^a-z]+/g, '');
  await db.addUserVerificationCode(email, verificationCode);
  const link = `http://${hostname}/activate?code=${verificationCode}`;
  await mailingDispatch.sendWelcomeEmail(email, link)
};

app.post('/api/create_user', async (req, res) => {
  try{
    req.body.password = security.getHashedPassword(req.body.password);
    const user = await db.createUser(req.body);
    await generateVerificationCodeAndSendWelcomeEmail(req.hostname, user.email);
    res.json({code: 0, user: user});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});

app.post('/api/resend_verification_code', async (req, res) => {
  try{
    const user = await db.getUserInfoByUID(req.body.uid);
    await generateVerificationCodeAndSendWelcomeEmail(req.hostname, user.email);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});

app.post('/api/forget_password', (req, res) => {

  db.getUidbyEmail(req.body.email, (err, uid) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }

    const newPassword = password_generator.generate({
      length: 10,
      numbers: true
    });

    const hashedPassword = security.getHashedPassword(newPassword);

    db.updateUser({uid, attr: 'password', val: hashedPassword}, (err) => {
      if (err) {
        console.log(err);
        res.json({code: 1, errMsg: 'Operation Forbidden'});
      }
    });

    const mailOptions = {
      from: '"同行平台" <' + config.mail_config.auth.user + '>', // sender address
      to: req.body.email, // list of receivers
      subject: '密码重置', // Subject line
      text: '密码重置', // plaintext body
      html: `亲爱的用户您好：<br>
        感谢您使用同行平台，希望能和您一起在这里度过美好的时光！<br>
        您的新密码是"${newPassword}", 请尽快修改默认密码
        如遇到问题可联系同行平台客服助手微信，微信号：tongxingplatform<br>` // html body
    };

    console.log(mailOptions)
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });

    res.json({code: 0});
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
