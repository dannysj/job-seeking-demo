const Mentor = require('../model/Mentor.js');
const app = require('express').Router();

app.post('/api/mentor_apply', async (req, res) => {
  const isCompleted = await Mentor.verifyInfoCompletion(req.body.uid);
  res.json({code: isCompleted ? 0 : 45});
});

app.post('/api/mentor_edit', async (req, res) => {
  await Mentor.editMentorInfo(req.body);
  res.json({code: 0});
});


app.post('/api/get_mentor_detail_by_uid', async (req, res) => {
  const mentor = await Mentor.getMentorDetailByUserID(req.body.uid);
  if (mentor)
    res.json({code: 0, mentor});
  else
    res.json({code: 55})
});

app.post('/api/get_mentor_detail', async (req, res) => {
  const mentor = await Mentor.getMentorDetailByMentorID(req.body.mid);
  res.json({code: 0, mentor});
});


app.post('/api/get_mentor_list', async (req, res) => {
  const list = await Mentor.getMentorList([]);

  res.json({code: 0, list});
});

module.exports = app;
