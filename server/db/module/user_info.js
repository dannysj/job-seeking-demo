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
        db.query(`select major.name as major from users, major, user_major_rel
                where users.id = $1 and
                  users.id = user_major_rel.uid and
                  user_major_rel.major_id = major.id;`, [uid])
          .then(result2 => {
            userAccount.major = result2.rows.map(e => e.major);
            callback(null, userAccount);
          }).catch(err => callback(err));
      }).catch(err => callback(err))
  });
};

exports.updateUser = (data, callback) => {
  if (data.attr === 'major_id') {
    const deleteQuery = `delete from user_major_rel where uid = $1;`;
    const insertQuery = `insert into user_major_rel (uid, major_id) values($1, $2);`;

    db.query(deleteQuery, [data.uid]).then(() => {
      data.val.forEach(val => {
        db.query(insertQuery, [data.uid, val]).catch(err => callback(err));
      });
      callback(null);
    }).catch(err => callback(err));
  } else {
    const query = `update users set ` + data.attr + `=$1 where id=$2;`;
    db.query(query, [data.val, data.uid]).then(callback(null)).catch(err => callback(err));
  }
};

exports.getMajorList = (callback) => {
  const query = `select id as value, name as text from major`;
  db.query(query, (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};