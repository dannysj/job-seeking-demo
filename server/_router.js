const express = require('express');
const app = express.Router();
const fs = require("fs");
const path = require("path");

fs.readdirSync(__dirname).forEach(file => {
  if (file.endsWith('Router.js')) {
    const filePath = path.resolve(__dirname, file);
    const router = require(filePath);
    app.use('/', router);
  }
});


module.exports = app;