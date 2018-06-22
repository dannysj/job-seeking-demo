const db = require('./mentorMenteeDB.js');
const express = require('express');
const app = express.Router();
const messageDispatch = require('./messageDB.js');

app.post('/api/get_rel_mentors', (req, res) => {
  db.getRelMentors(req.body.uid, (err, mentors) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0, mentors: mentors});
  });
});

app.post('/api/get_rel_mentees', (req, res) => {
  db.getRelMentees(req.body.uid, (err, mentees) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0, mentees: mentees});
  });
});

app.post('/api/mentor_confirm', (req, res) => {
  db.setMentorConfirm(req.body.uid, req.body.mentee_uid, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/mentor_decision', (req, res) => {
  db.setMentorDecision(req.body.uid, req.body.mentee_uid, req.body.agreed, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0});
    let is_passed_str = (req.body.agreed == 1)?'通过':'拒绝';
    messageDispatch.sendSystemMessage(req.body.uid,
      `您刚刚${is_passed_str}了Mentee的申请，请前往“我的mentee页”查看`,
      (err)=>  console.log(err));
    messageDispatch.sendSystemMessage(req.body.mentee_uid,
      `您的申请已被${is_passed_str}，请前往“我的导师”页查看`,
      (err)=>  console.log(err));
  });
});

app.post('/api/mentee_confirm', (req, res) => {
  db.setMenteeConfirm(req.body.uid, req.body.mid, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0});
  });
});


// API follow_user. post: body:{follower_uid:, followee_uid:}
app.post('/api/follow_user', (req, res)=>{
  db.createFollowerFolloweeRelationship(req.body.follower_uid, req.body.followee_uid, (err)=>{
      if (err) {
        console.log(err);
        res.json({code: 1, errMsg: 'Database Error'});
        return;
      }
      res.json({code:0})
  });
})

// API: unfollow_user. post: body:{follower_uid:, followee_uid:}
// call db to delete followRelationship in a table.
app.post('/api/unfollow_user', (req, res)=>{
  db.deleteFollowerFolloweeRelationship(req.body.follower_uid, req.body.followee_uid, (err)=>{
      if (err) {
        console.log(err);
        res.json({code: 1, errMsg: 'Database Error'});
        return;
      }
      res.json({code:0})
  });
})

app.post('/api/whether_followed', (req, res) => {
  // Request body. req.body{follower_uid, followee_uid"}
  db.whetherFollowed(req.body.follower_uid, req.body.followee_uid,  (err, whetherFollowed) =>{
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    if (whetherFollowed){
      res.json({whetherFollowed: "true"})
    }else{ res.json({whetherFollowed: "false"}) }
  }
)
})
module.exports = app;
