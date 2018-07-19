/*****************************************************************
WARNING: DO NOT USE THIS SCRIPT UNLESS YOU KNOW WHAT YOU ARE DOING

This script puts all email into lowercase
*****************************************************************/


const security = require('../security');
const db = require('../_dbPool');


db.query(`update users set email=LOWER(email);`, (err, result)=>{
  if(err){
    console.log(err);
    return;
  }

  console.log('Execution Success!');
});
