/**
 * @module router/user
 */
const app = require('express').Router();
const Message = require('../model/Message.js');
const User = require('../model/User');
const Mail = require('../../mail/Mail');
const password_generator = require('generate-password');
const DuplicateEmailError = require("../error").DuplicateEmailError;

/**
 * @param {string} first
 * @param {string} last
 * @param {string} password
 * @param {string} email
 */
app.post('/api/create_user', async (req, res) => {
  const {first, last, password, email} = req.body;
  if (await User.doesEmailExist(email)) throw new DuplicateEmailError();
  const user = await User.createUser(first, last, password, email);
  await User.updateAccessToken(user);
  await verificationCodeHelper(req.hostname, user.email);
  res.json({code: 0, user: user, message: '注册成功，请检查邮件并激活此账号'});
});

app.post('/api/resend_verification_code', async (req, res) => {
  const user = await User.getUserByUserID(req.body.uid);
  await verificationCodeHelper(req.hostname, user.email);
  res.json({code: 0});
});


app.post('/api/forget_password', async (req, res) => {
  const uid = await User.getUserIDByEmail(req.body.email);
  const password = password_generator.generate({length: 10});
  await User.updatePassword(uid, password);
  await Mail.sendPasswordResetEmail(req.body.email, password);
  res.json({code: 0});
});

app.get('/activate', async (req, res) => {
  try {
    const uid = await User.confirmVerification(req.query.code);
    await Message.sendSystemMessage(uid, "欢迎来到伙伴求职。在这里您将接触到最好的求职干货和导师资源。如有任何疑问 ，可发送邮件至help@buddycareer.com联系我们");
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
  const verificationCode = Math.random().toString(32).replace(/[^a-z]+/g, '');
  await User.addVerificationCodeByEmail(email, verificationCode);
  const link = `http://${hostname}/activate?code=${verificationCode}`;
  await Mail.sendWelcomeEmail(email, link)
};

module.exports = app;
