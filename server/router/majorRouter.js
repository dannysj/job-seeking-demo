/**
 * @module router/major
 */
const Major = require("../model/Major");
const app = require('express').Router();

app.post('/api/get_major_list', async (req, res) => {
  const list = await Major.getMajorList();
  res.json({code: 0, list});
});

module.exports = app;