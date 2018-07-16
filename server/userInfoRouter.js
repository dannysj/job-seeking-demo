const User = require('./model/User');
const express = require('express');
const app = express.Router();


app.post('/api/get_user_info', async (req, res) => {
  if (!!!req.body.uid) {
    res.status(403).end();
    return;
  }
  const uid = req.body.mentee_uid || req.body.uid;
  // TODO: Here, verify the request owner (req.body.uid) has access to target uid (mentee_uid)
  try {
    const user = await User.getUserByUID(uid);
    res.json({code: 0, user});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});

app.post('/api/update_user', async (req, res) => {
  try {
    const {uid, attr, val} = req.body;
    const allowedAttr = ['profile_pic', 'resume', 'first', 'last', 'major', 'cover', 'email', 'wechat'];
    if (!allowedAttr.contains(attr))
      throw('Operation Forbidden');
    await User.updateUserAttribute(uid, attr, val);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: 'Operation Forbidden'});
  }
});


app.post('/api/verify_user', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.getUserByEmailAndUnhashedPassword(email, password);
    await User.updateUserAccessToken(user);
    res.json({code: 0, user: user});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});

app.post('/api/change_password', async (req, res) => {
  try {
    const {uid, password} = req.body;
    await User.updateUserWithUnhashedPassword(uid, password);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});


module.exports = app;
