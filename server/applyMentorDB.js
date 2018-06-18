const db = require('./_dbPool.js');


exports.createMentorApp = (mentor_info, callback) => {
  const query = `insert into mentor_info
    (uid,
      isapproved,
      submission_time,
      cid,
      offer_title,
      offer_company,
      bio,
      service,
      num_weekly_slots)
    values($1,false,now(),$2,$3,$4,$5,$6,$7);`;
  db.query(query,
    [mentor_info.uid,
      mentor_info.cid,
      mentor_info.offer_title,
      mentor_info.offer_company,
      mentor_info.bio,
      JSON.stringify(mentor_info.services),
      mentor_info.num_weekly_slots], (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
};

exports.editMentorInfo = (mentor_info, callback) => {
  const query = `update mentor_info set
      cid=$1,
      offer_title=$2,
      offer_company=$3,
      bio=$4,
      service=$5,
      num_weekly_slots=$6 where uid=$7;`;
  db.query(query,
    [mentor_info.cid,
      mentor_info.offer_title,
      mentor_info.offer_company,
      mentor_info.bio,
      JSON.stringify(mentor_info.services),
      mentor_info.num_weekly_slots,
      mentor_info.uid], (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
};

exports.getCollegeList = (search, callback) => {
  const query = `select id as value, name as text from college
                 where UPPER(name) like UPPER($1) LIMIT 15;`;
  db.query(query, ['%' + search + '%'], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.verifyInfoCompletion = (uid, callback) => {
  let query = `select (major is not null
    and wechat is not null
    and resume is not null) as res
    from users where id=$1;`;
  db.query(query, [uid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows[0].res)
  });
};

