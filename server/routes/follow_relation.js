const db = require('../db/index.js');
const express = require('express');
const app = express.Router();

// req.body contains:  author_id, publish_time, type, title, thumbnail.
app.post('/api/create_news', function(req, res){
    // TODO: Authentication
    req.body.type=0; // News submitted by admin (Obselated, remove if necessary)
    db.createNews(req.body, (err, nid) => {
      if(err){
        console.log(err);
        res.json({code: 1});
        return;
      }
  
             
    db.findFollowersByAuthorID(req.body.author_id, (err, result) =>{
      followerIDs = result
      for (followerID in followerIDs){
        // Create message for each follower
        db.getUserInfo(followerID, (err, followerAccount) => {
  
             // userAccount contains: id, first, last, dob, ismentor, isadmin, email, 
             followerName  = followerAccount.last + followerAccount.first 
             messageDispatch.sendSystemMessage(followerID
                                                                                         , "你关注的"+ followerName + "发了一篇文章 ：\"" + req.body.title + "\"。请阅读"
                                                                                         , (err)=>  console.log(err)
                                                                                         )
  
        })
        }
     } );
      res.json({code: 0, nid: nid});
    });
  });
  
  
  
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
    db.whether_followed(req.body.follower_uid, req.body.followee_uid,  (err, whether_followed) =>{
      if (err) {
        console.log(err);
        res.json({code: 1, errMsg: 'Database Error'});
        return;
      }
      if (whether_followed){
        res.json({whether_followed: "true"})
      }else{ res.json({whether_followed: "false"}) }
    }
  )
  
  })