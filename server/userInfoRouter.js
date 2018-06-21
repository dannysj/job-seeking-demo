const db = require('./userInfoDB.js');
const express = require('express');
const app = express.Router();


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
  console.log("Verify user called");
  db.verifyUser(req.body, (err, user) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    res.json({code: 0, user: user});
  });
});


module.exports = app;


