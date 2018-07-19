const db = require('../model/Message.js');
const express = require('express');
const app = express();

app.post('/api/get_system_notifications', async (req, res) => {
  const messages = await db.getNotificationsByUserID(req.body.uid);
  res.json({code: 0, messages});
});

app.post('/api/read_system_notification', async (req, res) => {
  await db.setNotificationsAsRead(req.body.uid);
  res.json({code: 0});
});

module.exports = app;