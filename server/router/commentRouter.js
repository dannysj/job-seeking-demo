const db = require('../model/Comment.js');
const express = require('express');
const app = express.Router();


app.post('/api/create_mentor_comment', async (req, res) => {
  try {
    await db.createMentorComment(req.body.mid, req.body.text, req.body.uid);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1});
  }
});

app.post('/api/create_mentor_reply', async (req, res) => {
  try {
    await db.createMentorReply(req.body.comment_id, req.body.reply);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1});
  }
});

app.post('/api/create_comment_like', async (req, res) => {
  try {
    await db.createCommentLike(req.body.comment_id, req.body.uid);
    res.json({code: 0});
  } catch (e) {
    console.log(e);
    res.json({code: 1});
  }
});

module.exports = app;