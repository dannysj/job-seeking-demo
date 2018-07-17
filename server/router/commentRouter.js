const Comment = require('../model/Comment.js');
const app = require('express').Router();


app.post('/api/create_mentor_comment', async (req, res) => {
  await Comment.createMentorComment(req.body.mid, req.body.text, req.body.uid);
  res.json({code: 0});
});

app.post('/api/create_mentor_reply', async (req, res) => {
  await Comment.createMentorReply(req.body.comment_id, req.body.reply);
  res.json({code: 0});
});

app.post('/api/create_comment_like', async (req, res) => {
  await Comment.createCommentLike(req.body.comment_id, req.body.uid);
  res.json({code: 0});
});

module.exports = app;