const db = require('./model/pool.js');

exports.getRelMentors = (uid, callback) => {
  const query = `
  select
    mr.id as mrid,
    u.first as first,
    u.profile_pic as profile_pic,
    u.last as last,
    u.email as email,
    c.name as college_name,
    m.offer_title as offer_title,
    m.offer_company as offer_company,
    m.id as mid,
    u.id as uid,
    mr.status as status,
    mr.start_time as start_time
  from users u, mentor_info m, college c, mentor_rel mr
  where m.uid = u.id and m.cid = c.id and mr.mid=m.id and mr.uid=$1;
  `;
  db.query(query, [uid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.getRelMentees = (uid, callback) => {
  const query = `
  select
    mr.id as mrid,
    u.first as first,
    u.profile_pic as profile_pic,
    u.last as last,
    u.email as email,
    u.id as uid,
    mr.status as status,
    mr.start_time as start_time,
    mr.note as note
  from users u, mentor_info m, mentor_rel mr
  where mr.uid=u.id and mr.mid=m.id and m.uid=$1;
  `;
  db.query(query, [uid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.setMentorConfirm = (mentor_uid, mrid, callback) => {
  const query = `
    update mentor_rel set status=2 where id=$1;
  `;
  db.query(query, [mrid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.setMentorDecision = (mentor_uid, mrid, agreed, callback) => {
  let decision_status = (agreed == 1) ? 1 : 50;
  const query = `
    update mentor_rel set status=$2 where id=$1;
  `;
  db.query(query, [mrid,decision_status], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.setMenteeConfirm = (uid, mrid, callback) => {
  const query = `
    update mentor_rel set status=3 where id=$1;
    `;
  db.query(query, [mrid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    // const query = `update users set balance=balance+(
    //   select service_price from mentor_rel where id=$1
    // ) where id=(
    //   select uid from mentor_info where id=(
    //     select mid from mentor_rel where id=$1
    //   )
    // );
    // `;
    // db.query(query, [mrid], (err, result) => {
    //   if (err) {
    //     callback(err);
    //     return;
    //   }
      callback(null);
    // });
  });

};
