const Message = require("../model/Message");
const News = require("../model/News");
const Follow = require('../model/Follow.js');
const app = require('express').Router();

app.post('/api/create_news', async (req, res) => {
  const nid = await News.createNews(req.body);
  const followerIDs = await Follow.findFollowersByAuthorID(req.body.author_id);
  await Promise.all(followerIDs.map(e =>
    Message.sendSystemMessage(e, "你关注的导师发了一篇文章 ：\"" + req.body.title + "\"。请阅读")
  ));
  res.json({code: 0, nid});
});

app.post('/api/get_news_list', async (req, res) => {
  const news_list = await News.getNewsList(req.body.batch_size, req.body.batch_num);
  res.json({code: 0, news_list});
});

app.post('/api/get_news_detail', async (req, res) => {
  const news = await News.getNewsDetail(req.body.nid);
  res.json({code: 0, news});
});


module.exports = app;