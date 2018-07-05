const db = {
  ...require('./newsDB.js'),
  ...require('./messageDB.js'),
  ...require('./followRelationDB.js'),
  ...require('./userInfoDB.js')
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


    db.findFollowersByAuthorID(req.body.author_id, (err, followerIDs) => {
      console.log(followerIDs);
      console.log(typeof followerIDs);

      // For in iterate through index, not value in javascript :( HATE JAVASCRIPT
      for (let index in followerIDs) {
        console.log(followerIDs[index]);
        db.sendSystemMessage(followerIDs[index]
          , "你关注的导师发了一篇文章 ：\"" + req.body.title + "\"。请阅读"
          , (err) => console.log(err))
      }
    });

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