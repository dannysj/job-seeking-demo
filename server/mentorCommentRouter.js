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
  db.createMentorComment(req.body.mid, req.body.text, req.body.uid, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/create_mentor_reply', (req, res) => {
  db.createCommentReply(req.body.id, req.body.reply, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/create_comment_like', (req, res) => {
  db.createCommentLike(req.body.comment_id, req.body.uid, (err) => {
    if (err) {
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

module.exports = app;