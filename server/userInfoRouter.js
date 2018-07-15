const User = require('./model/user');
const express = require('express');
const app = express.Router();
const security = require('./security');


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
    await User.updateUserAttribute(uid, attr, val);
    res.json({code: 0});
  } catch (e) {
    res.json({code: 1, errMsg: 'Operation Forbidden'});
  }
});


app.post('/api/verify_user', async (req, res) => {
  try {
    let {email, password} = req.body;
    password = security.getHashedPassword(password);
    const user = await User.getUserByEmailAndPassword(email, password);
    user.access_token = await security.update_access_token(user.id);
    res.json({code: 0, user: user});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});

app.post('/api/change_password', async (req, res) => {
  try {
    let {uid, password} = req.body;
    password = security.getHashedPassword(password);
    await User.updateUserAttribute(uid, 'password', password);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1, errMsg: e});
  }
});


module.exports = app;
