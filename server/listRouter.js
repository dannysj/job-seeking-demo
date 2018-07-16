const db = require('./listDB.js');
const express = require('express');
const app = express.Router();

app.post('/api/get_major_list', (req, res) => {
  db.getMajorList((err, list) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});

module.exports = app;