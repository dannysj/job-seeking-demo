const MentorRelation =require('../model/MentorRelation.js');
const app = require('express').Router();
const Message = require('../model/Message.js');

app.post('/api/get_rel_mentors', async (req, res) => {
  const mentors = await MentorRelation.getRelMentors(req.body.uid);
  res.json({code: 0, mentors});
});

app.post('/api/get_rel_mentees', async (req, res) => {
  const mentees = await MentorRelation.getRelMentees(req.body.uid);
  res.json({code: 0, mentees});
});

app.post('/api/mentor_confirm', async (req, res) => {
  const {uid, mrid} = req.body;
  await MentorRelation.setMentorConfirm(mrid);
  res.json({code: 0});
});

app.post('/api/mentor_decision', async (req, res) => {
  const {uid, mrid, agreed} = req.body;
  await MentorRelation.setMentorDecision(mrid, agreed);
  const mentee_uid = await MentorRelation.getMenteeUserIDbyRelationID(mrid);

  const is_passed_str = (req.body.agreed === 1) ? '通过' : '拒绝';
  await Promise.all([
    Message.sendSystemMessage(uid, `您刚刚${is_passed_str}了Mentee的申请，请前往“我的mentee页”查看`),
    Message.sendSystemMessage(mentee_uid, `您的申请已被${is_passed_str}，请前往“我的导师”页查看`)
  ]);

  res.json({code: 0});
});

app.post('/api/mentee_confirm', async (req, res) => {
  await MentorRelation.setMenteeConfirm(req.body.uid, req.body.mrid);
  res.json({code: 0});
});

module.exports = app;
