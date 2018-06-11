const db = require('../db.js');
const express = require('express');
const app = express.Router();
const multer = require('multer');
const msg = require('../message.js');
const messageDispatch = new msg(db);

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/static/files');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
});
var upload = multer({storage: storage});


app.post('/api/file/general_upload', upload.single('file'), (req, res) => {
  if (!req.file)
    return res.json({code: -21, errMsg: 'No files found'});

  res.json({code: 0, url: '/files/' + req.file.filename});
});

app.post('/api/admin/get_applications', (req, res) => {
  db.getMentorApplications((err, list) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Operation Forbidden'});
      return;
    }
    res.json({code: 0, applications: list});
  });
});

app.post('/api/admin/decide_mentor_app', (req, res) => {
  if (req.body.decision == 1) {
    db.approveMentor(req.body.uid, req.body.mid, (err) => {
      if (err) {
        console.log(err);
        res.json({code: 1, errMsg: 'Database Error'});
        return;
      }
      messageDispatch.sendSystemMessage(req.body.uid, "您的导师申请已被通过。您的账户已成为导师账户，请经常查看系统通知并为Mentee提供优质服务");
      res.json({code: 0});
    });
  }
  else {
    db.disapproveMentor(req.body.uid, req.body.mid, (err) => {
      if (err) {
        console.log(err);
        res.json({code: 1, errMsg: 'Database Error'});
        return;
      }
      messageDispatch.sendSystemMessage(req.body.uid, "我们抱歉地通知您，您的导师申请未被通过。您可以联系我们获得具体原因");
      res.json({code: 0});
    });
  }
});

app.post('/api/get_system_notifications', (req, res) => {
  messageDispatch.getNotifications(req.body.uid, (err, notifications) => {
    if (err) {
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0, messages: notifications});
  });
});

app.post('/api/read_system_notification', (req, res) => {
  messageDispatch.readNotifications(req.body.uid, (err)=>{
    if(err){
      res.json({code: 1, errMsg: 'Database Error'});
    }
    else{
      res.json({code: 0});
    }
  });
});

module.exports = app;