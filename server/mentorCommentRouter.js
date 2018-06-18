const db = require('./mentorCommentDB.js');
const express = require('express');
const app = express.Router();


app.post('/api/get_mentor_comment', (req, res) => {
  db.getMentorComment(req.body.mid, (err, list) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});


app.post('/api/create_mentor_comment', (req, res) => {
  db.createMentorComment(req.body, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/create_mentor_reply', (req, res) => {
  db.createMentorReply(req.body, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

module.exports = app;