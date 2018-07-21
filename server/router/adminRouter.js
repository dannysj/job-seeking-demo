const Mentor = require('../model/Mentor.js');
const Message = require('../model/Message.js');
const User = require("../model/User");

const app = require('express').Router();

app.post('/api/admin/get_applications', async (req, res) => {
  const {uid} = req.body;
  const isAdmin = await User.isUserAdmin(uid);
  if(!isAdmin) throw new PermissionError();
  const applications = await Mentor.getMentorApplications();
  res.json({code: 0, applications});
});

app.post('/api/admin/decide_mentor_app', async (req, res) => {
  const {uid, mid} = req.body;
  const isAdmin = await User.isUserAdmin(uid);
  if(!isAdmin) throw new PermissionError();
  const mentor_uid = Mentor.getUserIDByMentorID(mid);
  if (req.body.decision === 1) {
    await Mentor.approveMentor(mid);
    await Message.sendSystemMessage(mentor_uid, "您的导师申请已被通过。您的账户已成为导师账户，请经常查看系统通知并为Mentee提供优质服务");
  } else {
    await Mentor.disapproveMentor(mid);
    await Message.sendSystemMessage(mentor_uid, "我们抱歉地通知您，您的导师申请未被通过。您可以联系我们获得具体原因");
  }

  res.json({code: 0});
});


module.exports = app;