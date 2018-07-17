const db = require('./_dbPool.js');

exports.getUidByAccessToken = (access_token, callback) => {
  const query = `select id from users where access_token=$1;`;
  db.query(query, [access_token], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    if(result.rows.length !== 1){
      console.log('NO SUCH ACCESS TOKEN');
      callback('No Such Access Token');
    }
    else {
      console.log('REQ ID: '+result.rows[0].id);
      callback(null, result.rows[0].id);
    }
  });
};

exports.updateAccessToken = (uid, access_token, callback) => {

  const query = `update users set access_token=$2 where id=$1;`;
  db.query(query, [uid, access_token], (err, result)=>{
    callback(err, access_token);
  });
}
