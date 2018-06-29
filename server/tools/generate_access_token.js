/*****************************************************************
WARNING: DO NOT USE THIS SCRIPT UNLESS YOU KNOW WHAT YOU ARE DOING

This script will generate a new access token for each user.
It may cause failure in almost all endpoints.
Use this script with caution
*****************************************************************/


const security = require('../security');
const db = require('../_dbPool');
const uuid4 = require('uuid/v4');

const selection_query = `select * from users;`;

db.query(selection_query, (err, result)=>{
  if(err){
    console.log(err);
    return;
  }
  let update_query_base = `update users set access_token = CASE id`;
  result.rows.forEach((user)=>{
    let access_token = uuid4();
    update_query_base += ` when ${user.id} then '${access_token}' `;
  });
  update_query_base += ` else 'not provided' end`;

  db.query(update_query_base, (err, result)=>{
    if(err){
      console.log(err);
      return;
    }
    console.log('Execution Success!');
  });
});
