const db = {
  ...require('./newsDB.js'),
  ...require('./messageDB.js')
};
const express = require('express');
const app = express.Router();

app.post('/api/create_news', function(req, res){
  // TODO: Authentication
  req.body.type=0; // News submitted by admin (Obselated, remove if necessary)
  db.createNews(req.body, (err, nid) => {
    if(err){
      console.log(err);
      res.json({code: 1});
      return;
    }


    // db.findFollowersByAuthorID(req.body.author_id, (err, result) => {
    //   followerIDs = result
    //   for (followerID in followerIDs) {
    //     // Create message for each follower
    //     db.getUserInfo(followerID, (err, followerAccount) => {
    //
    //       // userAccount contains: id, first, last, dob, ismentor, isadmin, email,
    //       followerName = followerAccount.last + followerAccount.first
    //       db.sendSystemMessage(followerID
    //         , "你关注的" + followerName + "发了一篇文章 ：\"" + req.body.title + "\"。请阅读"
    //         , (err) => console.log(err)
    //       )
    //
    //     })
    //   }
    // });

    res.json({code: 0, nid: nid});
  });
});

app.post('/api/get_news_list', (req, res) => {
  db.getNewsList(req.body.batch_size, req.body.batch_num, (err, news_list) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, news_list: news_list});
  });
});

app.post('/api/get_news_detail', function (req, res) {
  db.getNewsDetail(req.body.nid, (err, news) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, news: news});
  });
});


module.exports = app;