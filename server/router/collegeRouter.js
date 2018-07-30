/**
 * @module router/college
 */

const College = require("../model/College");
const app = require('express').Router();

app.post('/api/get_college_list', async (req, res) => {
  const list = await College.getCollegeList(req.body.query);
  res.json({code: 0, list});
});

app.post('/api/add_college', async (req, res) => {
  const college = await College.addCollege(req.body.college_name);
  res.json({code: 0, college, message: '添加大学成功'});
});

module.exports = app;