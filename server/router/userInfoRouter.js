/**
 * @module router/user
 */

const User = require('../model/User');
const express = require('express');
const Email = require("../../mail/Mail");
const MentorRelation = require("../model/Order");
const InvalidVerificationCodeError = require("../error").InvalidVerificationCodeError;
const PermissionError = require("../error").PermissionError;
const InvalidArgumentError = require("../error").InvalidArgumentError;
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
  const attrs = {
    'profile_pic': '头像',
    'resume': '简历',
    'first': '姓名',
    'last': '姓名',
    'major': '专业',
    'cover': ' 自我介绍',
    'email': '邮箱',
    'wechat': '微信号'
  };
  if (!Object.keys(attrs).includes(attr) || !uid || !val) throw new InvalidArgumentError();
  await User.updateAttribute(uid, attr, val);

  if (attr === 'last') // This prevent multiple notifications of changing fist name and last name
    res.json({code: 0});
  else
    res.json({code: 0, message: attrs[attr] + "更新成功"});
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
  res.json({code: 0, message: "密码更新成功"});
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
  if (uid !== await User.confirmVerification(code)) throw new InvalidVerificationCodeError();
  res.json({code: 0});
});


module.exports = app;
