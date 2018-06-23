/*****************************************************************
WARNING: DO NOT USE THIS SCRIPT UNLESS YOU KNOW WHAT YOU ARE DOING

This script regards all passwords in the database as unhashed
plain text, and performs one hash operation for each password

Running it against passwords that have already been hashed could
result in irrevertable consequences (i.e. failure in user auth)
*****************************************************************/


const security = require('../security');
const db = require('../_dbPool');

const selection_query = `select * from users;`;

db.query(selection_query, (err, result)=>{
  if(err){
    console.log(err);
    return;
  }
  let update_query_base = `update users set password = CASE id`;
  result.rows.forEach((user)=>{
    let hashed = security.getHashedPassword(user.password);
    update_query_base += ` when ${user.id} then '${hashed}' `;
  });
  update_query_base += ` else password end`;

  db.query(update_query_base, (err, result)=>{
    if(err){
      console.log(err);
      return;
    }
    console.log('Execution Success!');
  });
});
