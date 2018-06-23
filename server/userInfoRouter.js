const db = require('./userInfoDB.js');
const express = require('express');
const app = express.Router();
const security = require('./security');


app.post('/api/get_user_info', (req, res) => {
  db.getUserInfo(req.body.uid, (err, user) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    res.json({code: 0, user: user});
  });
});

app.post('/api/update_user', (req, res) => {
  db.updateUser(req.body, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Operation Forbidden'});
      return;
    }
    res.json({code: 0});

  });
});


app.post('/api/verify_user', (req, res) => {
  req.body.password = security.getHashedPassword(req.body.password);
  db.verifyUser(req.body, (err, user) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    security.updateAccessToken(user.id, (err, access_token)=>{
      if(err){
        console.log(err);
        res.json({code: 1, errMsg: 'Cannot generate access token'});
        return;
      }
      user.access_token = access_token;
      res.json({code: 0, user: user});
    });
  });
});


module.exports = app;
