require('express-async-errors');
const app = require('express').Router();
const fs = require("fs");
const path = require("path");

// Read every files in this folder except index.js
fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.js') {
    const filePath = path.resolve(__dirname, file);
    const router = require(filePath);
    app.use('/', router);
  }
});

module.exports = app;