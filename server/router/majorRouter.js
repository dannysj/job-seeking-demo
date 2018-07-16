const Major = require("../model/Major");
const app = require('express').Router();

app.post('/api/get_major_list', async (req, res) => {
  try {
    const list = await Major.getMajorList();
    res.json({code: 0, list});
  } catch (e) {
    console.log(e);
    res.json({code: 1});
  }
});

module.exports = app;