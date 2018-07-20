/**
 * @module router/user
 */

const db = {
  ...require('../messageDB.js'),
};
const User = require('../model/User');
const express = require('express');
const app = express.Router();
const password_generator = require('generate-password');
const Mail = require('../../mail/Mail');

/**
 * @param {string} first
 * @param {string} last
 * @param {string} password
 * @param {string} email
 */
app.post('/api/create_user', async (req, res) => {
  const {first, last, password, email} = req.body;
  const user = await User.createUser(first, last, password, email);
  await User.updateUserAccessToken(user);
  await verificationCodeHelper(req.hostname, user.email);
  res.json({code: 0, user: user});
});

app.post('/api/resend_verification_code', async (req, res) => {
  const user = await User.getUserByUID(req.body.uid);
  await verificationCodeHelper(req.hostname, user.email);
  res.json({code: 0});
});


app.post('/api/forget_password', async (req, res) => {
  const uid = await User.getUserIDByEmail(req.body.email);
  const password = password_generator.generate({length: 10});
  await User.updateUserWithUnhashedPassword(uid, password);
  await Mail.sendPasswordResetEmail(req.body.email, password);
  res.json({code: 0});
});

app.get('/activate', async (req, res) => {
  try {
    const uid = await User.confirmVerification(req.query.code);
    db.sendSystemMessage(uid, "欢迎来到伙伴求职。在这里您将接触到最好的求职干货和导师资源。如有任何疑问 ，可发送邮件至help@buddycareer.com联系我们");
    res.redirect('/account');
  } catch (e) {
    console.log(e);
    res.redirect('/');
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
  await Mail.sendActivationEmail(email, link)
};

module.exports = app;
