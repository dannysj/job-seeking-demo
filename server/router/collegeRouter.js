const College = require("../model/College");
const app = require('express').Router();

app.post('/api/get_college_list', async (req, res) => {
  try {
    const list = await College.getCollegeList(req.body.query);
    res.json({code: 0, list});
  } catch (e) {
    console.log(e);
    res.json({code: 1});
  }
});

app.post('/api/add_college', async (req, res) => {
  try {
    const college = await College.addCollege(req.body.college_name);
    res.json({code: 0, college});
  } catch (e) {
    console.log(e);
    res.json({code: 1});
  }
});

module.exports = app;