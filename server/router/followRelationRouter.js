const Follow = require('../model/Follow.js');
const app = require('express').Router();

app.post('/api/follow_user', async (req, res) => {
  await Follow.createFollowerFolloweeRelationship(req.body.uid, req.body.followee_uid);
  res.json({code: 0})
});

// API: unfollow_user. post: body:{uid:, followee_uid:}
// call db to delete followRelationship in a table.
app.post('/api/unfollow_user', async (req, res) => {
  await Follow.deleteFollowerFolloweeRelationship(req.body.uid, req.body.followee_uid);
  res.json({code: 0});
});


app.post('/api/whether_followed', async (req, res) => {
  // Request body. req.body{follower_uid, followee_uid"}
  const whetherFollowed = await Follow.whetherFollowed(req.body.follower_uid, req.body.followee_uid);
  res.json({whetherFollowed});
});

app.post('/api/get_followees_by_uid', async (req, res) => {
  const followees = await Follow.getFolloweesForFollower(req.body.uid);
  res.json({code: 0, followees})
});

module.exports = app;