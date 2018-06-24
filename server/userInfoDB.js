const db = require('./_dbPool.js');

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
        userAccount.num_notifications = parseInt(result.rows[0].count);
        callback(null, userAccount);
      }).catch(err => callback(err))
  });
};

exports.updateUser = (data, callback) => {
  const query = `update users set ` + data.attr + `=$1 where id=$2;`;
  db.query(query, [data.val, data.uid]).then(() => callback(null)).catch(e => callback(e));
};

exports.verifyUser = function (user, callback) {
  console.log(user.email);
  const query = `select * from users where email=$1 and password=$2;`;
  db.query(query, [user.email, user.password], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    if (result.rows.length === 0) {
      callback('No such email found');
      return;
    }
    var userAccount = result.rows[0];
    delete userAccount.password;
    callback(null, userAccount);
  });
};