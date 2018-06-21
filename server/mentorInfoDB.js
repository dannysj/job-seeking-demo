const db = require('./_dbPool.js');

exports.getMentorDetailByUid = (uid, callback) => {
  var query = `
    select u.id as uid,
      u.first as first,
      u.last as last,
      u.dob as dob,
      u.profile_pic as profile_pic,
      u.resume as resume,
      u.ismentor as ismentor,
      c.name as college_name,
      c.id as cid,
      m.id as mid,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.bio as bio,
      m.bios as bios,
      m.service as service,
      m.num_weekly_slots as num_weekly_slots
    from users u, mentor_info m, college c
    where m.uid = u.id and m.cid = c.id and u.id = $1;
  `;
  db.query(query, [uid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows[0]);
  });
};



exports.getMentorDetail = (mid, callback) => {
  const query = `
    select u.id as uid,
      u.first as first,
      u.last as last,
      u.dob as dob,
      u.profile_pic as profile_pic,
      u.resume as resume,
      c.name as college_name,
      m.id as mid,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.bio as bio,
      m.bios as bios,
      m.service as service,
      m.num_weekly_slots as num_weekly_slots,
      m.num_weekly_slots - (select count(*) from mentor_rel
        where mid=m.id and now()-start_time<'1 week') as num_availability
    from users u, mentor_info m, college c
    where m.uid = u.id and m.cid = c.id and m.id = $1;
  `;
  db.query(query, [mid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows[0]);
  });
};


exports.getMentorList = (filter, callback) => {
  const query = `
    select u.first as first,
      u.profile_pic as profile_pic,
      u.last as last,
      u.major as major,
      c.name as college_name,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.id as mid
    from users u, mentor_info m, college c
    where m.uid = u.id and m.cid = c.id and u.ismentor = true;
  `;
  db.query(query, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};
