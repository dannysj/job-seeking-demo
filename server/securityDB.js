const db = require('./_dbPool.js');

exports.getUidByAccessToken = (access_token, callback) => {
  const query = `select id from users where access_token=$1;`;
  db.query(query, [access_token], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    if(result.rows.length != 1){
      callback('No Such Access Token');
    }
    else {
      callback(null, result.rows[0].id);
    }
  });
}
