const db = require('../pool.js');

exports.getUserInfo = (uid, callback) => {
  const query = `select * from users where users.id = $1`;
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
    db.query(`select count(*) as count from message
              where is_read=false and destination=$1`, [uid])
      .then(result => {
        userAccount.num_notifications = result.rows[0].count;
        callback(null, userAccount);
      }).catch(err => callback(err))
  });
};

exports.updateUser = (data, callback) => {
    const query = `update users set ` + data.attr + `=$1 where id=$2;`;
    db.query(query, [data.val, data.uid]).then(callback(null)).catch(err => callback(err));
};

exports.getMajorList = (callback) => {
  const query = `select * from major`;
  db.query(query, (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};