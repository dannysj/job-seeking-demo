const db = require('./mentorInfoDB.js');
const express = require('express');
const app = express.Router();

app.post('/api/get_mentor_detail_by_uid', (req, res) => {
  db.getMentorDetailByUid(req.body.uid, (err, mentor) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    if (mentor) {
      res.json({code: 0, mentor: mentor});
    }
    else {
      res.json({code: 55})
    }
  });
});

app.post('/api/get_mentor_detail', (req, res) => {
  db.getMentorDetail(req.body.mid, (err, mentor) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }
    res.json({code: 0, mentor: mentor});
  });
});


app.post('/api/get_mentor_list', (req, res) => {
  db.getMentorList([], (err, list) => {
    if (err) {
      console.log(err);
      res.json({code: 1});
      return;
    }

    res.json({code: 0, list: list});
  });
});

module.exports = app;