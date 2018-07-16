const db = require('./_dbPool.js');

const selectClause = `
  select
    users.*,
    (select count(*)::int from message where is_read=false and destination = users.id) as num_notifications,
    array(select follow_rel.followee_uid from follow_rel where follow_rel.follower_uid = users.id) as followee
  from users
  `;

const processUserResult = (result) => {
  if (result.rows.length === 0)
    throw('No such email or password found');

  let user = result.rows[0];
  delete user.password;
  return user;
};

exports.getUserInfoByUID = async (uid) => {
  const query = selectClause + `where users.id = $1;`;
  const result = await db.query(query, [uid]);
  return processUserResult(result);
};

exports.getUserInfoByEmailAndPassword = async (email, password) => {
  const query = selectClause + `where email=$1 and password=$2;`;
  const result = await db.query(query, [email, password]);
  return processUserResult(result);
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