const db = require('./_dbPool.js');


// TODO: check and return proper error first if the user's email is duplicated
exports.createUser = function (user, callback) {
  const query = `insert into users 
                 (first,last,password,email,profile_pic,register_date,isadmin,ismentor)
                 values($1,$2,$3,$4,'/img/sample_profile.jpg',now(),false,false)
                 returning *;`;
  db.query(query, [user.first, user.last, user.password, user.email], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    var userInfo = result.rows[0];
    userInfo.password = null;
    callback(null, userInfo);
  });
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
    callback(null, result.rows[0].id);
  });
};

exports.addUserVerificationCode = (email, verification_code, callback) => {
  const query = `insert into user_verification (uid, verification_code)
                  values ((select id from users where email = $1),$2)
                  on CONFLICT (uid) do update set verification_code = $2, time_added=now()
                  returning * ;`;
  db.query(query, [email, verification_code], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows[0]);
  });
};