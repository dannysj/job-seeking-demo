const db = require('./messageDB.js');
const express = require('express');
const app = express();

app.post('/api/get_system_notifications', (req, res) => {
  db.getNotificationsByUid(req.body.uid, (err, notifications) => {
    if (err) {
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0, messages: notifications});
  });
});

app.post('/api/read_system_notification', (req, res) => {
  db.setNotificationsAsRead(req.body.uid, (err)=>{
    if(err){
      res.json({code: 1, errMsg: 'Database Error'});
    }
    else{
      res.json({code: 0});
    }
  });
});

module.exports = app;