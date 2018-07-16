const db = require('./_dbPool.js');

const selectClause = `
  select
    id,
    first,
    last,
    profile_pic,
    register_date,
    ismentor,
    isadmin,
    LOWER(email) as email,
    major,
    cover,
    balance,
    wechat,
    resume,
    isactivated,
    access_token,
    (select count(*)::int from message where is_read=false and destination = users.id) as num_notifications,
    array(select follow_rel.followee_uid from follow_rel where follow_rel.follower_uid = users.id) as followee
  from users
  `;

const userInfoCallBack = callback => (err, result) => {
  if (err) {
    callback(err);
    return;
  }

  if (result.rows.length === 0) {
    callback('No such email or password found');
    return;
  }

  let userAccount = result.rows[0];
  delete userAccount.password;
  callback(null, userAccount);
};

exports.getUserInfo = (uid, callback) => {
  const query = selectClause + `where users.id = $1;`;
  db.query(query, [uid], userInfoCallBack(callback));
};

exports.verifyUser = (user, callback) => {
  const query = selectClause + `where email=$1 and password=$2;`;
  db.query(query, [user.email, user.password], userInfoCallBack(callback));
};

exports.updateUser = (data, callback) => {
  const query = `update users set ` + data.attr + `=$1 where id=$2;`;
  db.query(query, [data.val, data.uid]).then(() => callback(null)).catch(e => callback(e));
};

// Set password, callback only accepts one
exports.changePassword = function(user, callback) {
    const query = `UPDATE users SET password=$1 WHERE id=$2;`;
    db.query(query, [user.password, user.uid])
        .then(res=> {
          callback(null);
          console.log("Has changed the password")
        })
        .catch(err => callback(err));
};
