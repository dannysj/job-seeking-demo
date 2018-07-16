const express = require('express');
const app = express.Router();
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

// Reading every files ends with Router.js in the parent folder
const parentDir = path.join(__dirname, '..');
fs.readdirSync(parentDir).forEach(file => {
  if (file.endsWith('Router.js')) {
    const filePath = path.resolve(parentDir, file);
    const router = require(filePath);
    app.use('/', router);
  }
});


module.exports = app;