/*****************************************************************
WARNING: DO NOT USE THIS SCRIPT UNLESS YOU KNOW WHAT YOU ARE DOING

This script regards all passwords in the database as unhashed
plain text, and performs one hash operation for each password

Running it against passwords that have already been hashed could
result in irrevertable consequences (i.e. failure in user auth)
*****************************************************************/


const security = require('../security');
const db = require('../model/pool');

const selection_query = `select id,service from mentor_info`;

db.query(selection_query, (err, result)=>{
  if(err){
    console.log(err);
    return;
  }
  result.rows.forEach((mentor_info)=>{
    mentor_info.service.forEach((service)=>{
      service.price = parseInt(service.price) ? parseInt(service.price) : 0;
    });
    let update_query = `update mentor_info set service=$1 where id=$2`;
    db.query(
      update_query,
      [JSON.stringify(mentor_info.service), mentor_info.id],
      (err)=>{
        
      if(err){
        console.log(`Error for ${mentor_info.id}: ${err}`);
      }
      else {
        console.log(`Successfully santicize for ${mentor_info.id}`);
      }
    });
  });
});
