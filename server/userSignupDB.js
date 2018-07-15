const db = require('./_dbPool.js');


// TODO: check and return proper error first if the user's email is duplicated
exports.createUser = async (user) => {
  const query = `insert into users
                 (first,last,password,email,profile_pic,register_date,isadmin,ismentor)
                 values($1,$2,$3,$4,'/img/sample_profile.jpg',now(),false,false)
                 returning *;`;
  const result = await db.query(query, [user.first, user.last, user.password, user.email]);
  const userInfo = result.rows[0];
  delete userInfo.password;
  return userInfo;
};


exports.confirmVerification = (verification_code, callback) => {
  const query = `update users set isactivated=true where
                id=(select uid from user_verification where verification_code=$1)
                returning id;`;
  db.query(query, [verification_code], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    if (result.rows.length === 0) {
      callback(`No user with verification code "${verification_code}" found `);
      return;
    }
    callback(null, result.rows[0].id);
  });
};

exports.addUserVerificationCode = async (email, verification_code) => {
  const query = `insert into user_verification (uid, verification_code)
                  values ((select id from users where email = $1),$2)
                  on CONFLICT (uid) do update set verification_code = $2, time_added=now()
                  returning * ;`;
  const result = await db.query(query, [email, verification_code]);
  return result.rows[0];
};


exports.getUidbyEmail = function (email, callback) {
  console.log(email)
  const query = `select users.id from users where email=$1`;
  db.query(query, [email], (err, result) => {
    if (err) {
      callback(err);
      return;
    }

    if (result.rows.length === 0) {
      callback('No such email found');
      return;
    }

    const uid = result.rows[0].id;
    callback(null, uid);
  });
};