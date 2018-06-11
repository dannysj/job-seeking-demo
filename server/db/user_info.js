const db = require('../db_pool.js');

exports.getUserInfo = (uid, callback) => {
  const query = `select * from users where id=$1;`;
  db.query(query, [uid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    if (result.rows.length === 0) {
      callback('No such email found');
      return;
    }
    let userAccount = result.rows[0];
    userAccount.password = null;
    let query = `select count(*) as count from message where is_read=false and destination=$1`;
    db.query(query, [uid], (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      userAccount.num_notifications = result.rows[0].count;
      callback(null, userAccount);
    });
  });
};


exports.updateUser = (data, callback) => {
  const query = `update users set ` + data.attr + `=$1 where id=$2;`;
  db.query(query, [data.val, data.uid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.getMajorList = function (callback) {
  const query = 'select id as value, name as text from major;';
  db.query(query, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};