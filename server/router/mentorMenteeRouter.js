const db = {...require('../model/Order.js'), ... require('../model/Follow')};
const app = require('express').Router();
const Message = require('../model/Message.js');

app.post('/api/get_rel_mentors', async (req, res) => {
  const mentors = await db.getRelMentors(req.body.uid);
  res.json({code: 0, mentors});
});

app.post('/api/get_rel_mentees', async (req, res) => {
  const mentees = await db.getRelMentees(req.body.uid);
  res.json({code: 0, mentees});
});

app.post('/api/mentor_confirm', async (req, res) => {
  await db.setMentorConfirm(req.body.uid, req.body.mrid);
  res.json({code: 0});
});

app.post('/api/mentor_decision', async (req, res) => {
  const {uid, mrid, agreed, mentee_uid} = req.body;
  await db.setMentorDecision(uid, mrid, agreed);

  const is_passed_str = (req.body.agreed === 1) ? '通过' : '拒绝';
  await Message.sendSystemMessage(uid, `您刚刚${is_passed_str}了Mentee的申请，请前往“我的mentee页”查看`,);
  await Message.sendSystemMessage(mentee_uid, `您的申请已被${is_passed_str}，请前往“我的导师”页查看`,);

  res.json({code: 0});
});

app.post('/api/mentee_confirm', async (req, res) => {
  await db.setMenteeConfirm(req.body.uid, req.body.mrid);
  res.json({code: 0});
});

module.exports = app;
