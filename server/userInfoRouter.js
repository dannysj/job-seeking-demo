const db = require('./userInfoDB.js');
const express = require('express');
const app = express.Router();
const security = require('./security');


app.post('/api/get_user_info', (req, res) => {
  if (!!!req.body.uid) {
    res.status(403).end();
    return;
  }

  let dest_uid = req.body.mentee_uid || req.body.uid;

  // TODO: Here, verify the request owner (req.body.uid) has access to target uid (mentee_uid)

  db.getUserInfo(dest_uid, (err, user) => {
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
  req.body.email = security.santicize_email(req.body.email);

  db.verifyUser(req.body, (err, user) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: err});
      return;
    }
    security.update_access_token(user.id, (err, access_token)=>{
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

// receive a user with its email, uid, and password
app.post('/api/change_password', (req, res) =>{

    req.body.password = security.getHashedPassword(req.body.password);

    db.changePassword(req.body, (err)=>{
        if (err) {
            console.log(err);
            res.json({code: 1, errMsg: err});
            return;
        }
        res.json({code: 0});
    })

});


module.exports = app;
