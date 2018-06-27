const db = require('./loggerDB.js');
const express = require('express');
const app = express.Router();

app.post('/api/save_logger',(req, res) => {
    db.saveLogger(req.body.logs, (err) =>{
        if (err){
            console.log(err);
            res.json({code: 1});
            return;
        }
        res.json({code:0})
    } )
   
})

module.exports = app;