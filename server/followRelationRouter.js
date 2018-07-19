const db = require('./followRelationDB.js');
const express = require('express');
const app = express.Router();

app.post('/api/follow_user', (req, res) => {
  db.createFollowerFolloweeRelationship(req.body.uid, req.body.followee_uid, (err) =>{
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code:0})
  });
})

// API: unfollow_user. post: body:{uid:, followee_uid:}
// call db to delete followRelationship in a table.
app.post('/api/unfollow_user', (req, res) => {
  db.deleteFollowerFolloweeRelationship(req.body.uid, req.body.followee_uid, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0})
  });
})

app.post('/api/whether_followed', (req, res) => {
  // Request body. req.body{uid, followee_uid"}
  db.whetherFollowed(req.body.uid, req.body.followee_uid, (err, whetherFollowed) => {
      if (err) {
        console.log(err);
        res.json({code: 1, errMsg: 'Database Error'});
        return;
      }
      if (whetherFollowed) {
        res.json({whetherFollowed: true})
      } else {
        res.json({whetherFollowed: false})
      }
    }
  )

});

app.post('/api/get_followees_by_uid', (req, res) => {
  db.getFolloweesForFollower(req.body.uid, (err, list) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, followees: list})
  })
})

module.exports = app;