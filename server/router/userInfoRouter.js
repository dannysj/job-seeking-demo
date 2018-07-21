/**
 * @module router/user
 */

const User = require('../model/User');
const express = require('express');
const Email = require("../../mail/Mail");
const MentorRelation = require("../model/Order");
const app = express.Router();

app.post('/api/get_user_info', async (req, res) => {
  const {uid} = req.body;
  if (!uid) throw new InvalidArgumentError();
  const user = await User.getUserByUserID(uid);
  res.json({code: 0, user});
});

app.post('/api/get_mentee_info', async (req, res) => {
  const {uid, mentee_uid} = req.body;
  if (!uid || !mentee_uid) throw new InvalidArgumentError();
  const isMentorMenteeRelated = await MentorRelation.isMentorMenteeRelated(uid, mentee_uid);
  const isUserAdmin = await User.isUserAdmin(uid);
  if (!isMentorMenteeRelated && !isUserAdmin) throw new PermissionError();
  const user = await User.getUserByUserID(uid);
  res.json({code: 0, user});
});

app.post('/api/update_user', async (req, res) => {
  const {uid, attr, val} = req.body;
  const allowedAttr = ['profile_pic', 'resume', 'first', 'last', 'major', 'cover', 'email', 'wechat'];
  if (!allowedAttr.includes(attr) || !uid || !val) throw new InvalidArgumentError();
  await User.updateAttribute(uid, attr, val);
  res.json({code: 0});
});


app.post('/api/verify_user', async (req, res) => {
  const {email, password} = req.body;
  const user = await User.getUserByEmailAndPassword(email, password);
  await User.updateAccessToken(user);
  res.json({code: 0, user: user});
});

app.post('/api/change_password', async (req, res) => {
  const {uid, password} = req.body;
  await User.updatePassword(uid, password);
  res.json({code: 0});
});

app.post('/api/verify_new_email', async (req, res) => {
  const {new_email, uid} = req.body;
  const verificationCode = Math.random().toString(32).replace(/[^a-z]+/g, '');
  await User.addVerificationCodeByUserID(uid, verificationCode);
  await Email.sendVerificationCode(new_email, verificationCode);
  res.json({code: 0});
});

app.post('/api/verify_code', async (req, res) => {
  const {code, uid} = req.body;
  if (uid !== await User.confirmVerification(code)) throw new Error("Verification failed");
  res.json({code: 0});
});


module.exports = app;
