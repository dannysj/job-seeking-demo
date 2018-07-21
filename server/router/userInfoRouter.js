/**
 * @module router/user
 */

const User = require('../model/User');
const express = require('express');
const Email = require("../../mail/Mail");
const app = express.Router();

app.post('/api/get_user_info', async (req, res) => {
  if (!!!req.body.uid)
    throw new Error('Access Denied');

  const uid = req.body.mentee_uid || req.body.uid;
  // TODO: Here, verify the request owner (req.body.uid) has access to target uid (mentee_uid)
  const user = await User.getUserByUID(uid);
  res.json({code: 0, user});
});

app.post('/api/update_user', async (req, res) => {
  const {uid, attr, val} = req.body;
  const allowedAttr = ['profile_pic', 'resume', 'first', 'last', 'major', 'cover', 'email', 'wechat'];
  if (!allowedAttr.includes(attr))
    throw('Operation Forbidden');
  await User.updateUserAttribute(uid, attr, val);
  res.json({code: 0});
});


app.post('/api/verify_user', async (req, res) => {
  const {email, password} = req.body;
  const user = await User.getUserByEmailAndUnhashedPassword(email, password);
  await User.updateUserAccessToken(user);
  res.json({code: 0, user: user});
});

app.post('/api/change_password', async (req, res) => {
  const {uid, password} = req.body;
  await User.updateUserWithUnhashedPassword(uid, password);
  res.json({code: 0});
});

app.post('/api/change_email', async (req, res) => {
  const {new_email, uid} = req.body;
  const verificationCode = Math.random().toString(32).replace(/[^a-z]+/g, '');
  await User.addVerificationCodeByUserID(uid, verificationCode);
  await Email.sendVerificationCode(new_email, verificationCode);
  res.json({code: 0});
});

app.get('/api/verify_code', async (req, res) => {
  const {code, uid} = req.body;
  if (uid !== await User.confirmVerification(code)) throw new Error("Verification failed");
  res.json({code: 0});
});


module.exports = app;
