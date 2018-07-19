const Mentor = require('../model/Mentor.js');
const Message = require('../model/Message.js');

const app = require('express').Router();

app.post('/api/admin/get_applications', async (req, res) => {
  const applications = await Mentor.getMentorApplications();
  res.json({code: 0, applications});
});

app.post('/api/admin/decide_mentor_app', async (req, res) => {
  if (req.body.decision === 1) {
    await Mentor.approveMentor(req.body.uid, req.body.mid);
    await Message.sendSystemMessage(req.body.uid, "您的导师申请已被通过。您的账户已成为导师账户，请经常查看系统通知并为Mentee提供优质服务");
    res.json({code: 0});
  }
  else {
    await Mentor.disapproveMentor(req.body.uid, req.body.mid);
    await Message.sendSystemMessage(req.body.uid, "我们抱歉地通知您，您的导师申请未被通过。您可以联系我们获得具体原因");
    res.json({code: 0});
  }
});


module.exports = app;