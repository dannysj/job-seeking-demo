const db = require('./model/pool.js');

exports.approveMentor = (uid, mid, callback) => {
  console.log(uid);
  const query = `update users set ismentor=true where id=(
    select uid from mentor_info where id=$1
  );`;
  db.query(query, [mid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.disapproveMentor = (uid, mid, callback) => {
  const query = `delete from mentor_info where id=$1;`;
  db.query(query, [mid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.getMentorApplications = (callback) => {
  const query = `
    select u.first as first,
      u.profile_pic as profile_pic,
      u.last as last,
      c.name as college_name,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.id as mid,
      u.id as uid
    from users u, mentor_info m, college c
    where m.uid = u.id and m.cid = c.id and u.ismentor = false;
  `;
  db.query(query, (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};
