const Message = require("../model/Message");
const News = require("../model/News");
const Follow = require('../model/Follow.js');
const app = require('express').Router();

app.post('/api/create_news', async (req, res) => {
  const {author_id, type, title, thumbnail, content, delta} = req.body;
  const nid = await News.createNews(author_id, type, title, thumbnail, content, delta);
  const followerIDs = await Follow.findFollowersByAuthorID(author_id);
  await Promise.all(followerIDs.map(e =>
    Message.sendSystemMessage(e, "你关注的导师发了一篇文章 ：\"" + title + "\"。请阅读")
  ));
  res.json({code: 0, nid});
});

app.post('/api/get_news_list', async (req, res) => {
  const {batch_size,batch_num} = req.body;
  const news_list = await News.getNewsList(batch_size, batch_num);
  res.json({code: 0, news_list});
});

app.post('/api/get_news_detail', async (req, res) => {
  const {nid} = req.body;
  const news = await News.getNewsDetail(nid);
  res.json({code: 0, news});
});


module.exports = app;