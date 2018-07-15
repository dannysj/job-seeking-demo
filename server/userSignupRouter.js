const db = {
  ...require('./messageDB.js'),
};
const User = require('./model/user');
const express = require('express');
const app = express.Router();
const security = require('./security');
const password_generator = require('generate-password');
const mailingDispatch = require('../mailing/mailingDispatch');

app.post('/api/create_user', async (req, res) => {
  try {
    let {first, last, password, email} = req.body;

    // Pre processing for password and email
    password = security.getHashedPassword(password);
    email = security.santicize_email(email);

    const user = await User.createUser(first, last, password, email);

    // Post processing for access_token
    user.access_token = await security.update_access_token(user.id);

    await verificationCodeHelper(req.hostname, user.email);
    res.json({code: 0, user: user});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});

app.post('/api/resend_verification_code', async (req, res) => {
  try {
    const user = await User.getUserByUID(req.body.uid);
    await verificationCodeHelper(req.hostname, user.email);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});

/**
 * 1. Generate the verification code
 * 2. Add it to database
 * 3. Send email
 *
 * @param hostname
 * @param email
 * @returns {Promise<void>}
 */
const verificationCodeHelper = async (hostname, email) => {
  let verificationCode = Math.random().toString(32).replace(/[^a-z]+/g, '');
  await User.addVerificationCode(email, verificationCode);
  const link = `http://${hostname}/activate?code=${verificationCode}`;
  await mailingDispatch.sendActivationEmail(email, link)
};

app.post('/api/forget_password', async (req, res) => {
  try {
    const {id} = await User.getUserByEmail(req.body.email);
    const newPassword = password_generator.generate({length: 10});
    const hashedPassword = security.getHashedPassword(newPassword);
    await User.updateUserAttribute(id, 'password', hashedPassword);
    await mailingDispatch.sendPasswordResetEmail(req.body.email, newPassword);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});


app.get('/activate', async (req, res) => {
  try{
    const uid = await User.confirmVerification(req.query.code);
    db.sendSystemMessage(uid, "欢迎来到伙伴求职。在这里您将接触到最好的求职干货和导师资源。如有任何疑问 ，可发送邮件至help@buddycareer.com联系我们");
    res.redirect('/account');
  } catch (e) {
    res.redirect('/');
  }
});

module.exports = app;
