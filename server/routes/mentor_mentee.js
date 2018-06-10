const db = require('../db.js');
const express = require('express');
const app = express.Router();

app.post('/api/get_rel_mentors', (req, res) => {
  db.getRelMentors(req.body.uid, (err, mentors) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0, mentors: mentors});
  });
});

app.post('/api/get_rel_mentees', (req, res) => {
  db.getRelMentees(req.body.uid, (err, mentees) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0, mentees: mentees});
  });
});

app.post('/api/mentor_confirm', (req, res) => {
  db.setMentorConfirm(req.body.uid, req.body.mentee_uid, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0});
  });
});

app.post('/api/mentee_confirm', (req, res) => {
  db.setMenteeConfirm(req.body.uid, req.body.mid, (err) => {
    if (err) {
      console.log(err);
      res.json({code: 1, errMsg: 'Database Error'});
      return;
    }
    res.json({code: 0});
  });
});

module.exports = app;