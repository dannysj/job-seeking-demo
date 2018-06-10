const db = require('../db.js');
const express = require('express');
const app = express.Router();


app.post('/api/apply.js', (req, res) => {
  db.verifyInfoCompletion(req.body.uid, (err, isCompleted) => {
    if (isCompleted) {
      db.createMentorApp(req.body, (err) => {
        if (err) {
          console.log(err);
          res.json({code: 1});
          return;
        }
        res.json({code: 0});
      });
    }
    else {
      res.json({code: 45});
    }
  });
});

app.post('/api/mentor_edit', (req, res) => {
  db.editMentorInfo(req.body, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/get_college_list', (req, res) => {
  db.getCollegeList(req.body.query, (err, list) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, list: list});
  });
});

module.exports = app;