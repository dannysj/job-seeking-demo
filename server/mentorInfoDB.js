const db = require('./_dbPool.js');


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

exports.createMentorApp = (mentor_info, callback) => {
  const query = `insert into mentor_info
    (uid,
      isapproved,
      submission_time,
      cid,
      offer_title,
      offer_company,
      bio,
      bios,
      service,
      num_weekly_slots)
    values($1,false,now(),$2,$3,$4,$5,$6,$7,$8);`;
  db.query(query,
    [mentor_info.uid,
      mentor_info.cid,
      mentor_info.offer_title,
      mentor_info.offer_company,
      mentor_info.bio,
      JSON.stringify(mentor_info.bios),
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
      bios=$5,
      service=$6,
      num_weekly_slots=$7 where uid=$8;`;
  db.query(query,
    [mentor_info.cid,
      mentor_info.offer_title,
      mentor_info.offer_company,
      mentor_info.bio,
      JSON.stringify(mentor_info.bios),
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
      (m.num_weekly_slots - (select count(*) from mentor_rel
        where mid=m.id and now()-start_time<'1 week'))::integer as num_availability,
        
      (select json_agg(json_build_object(
          'id', comment.id,
          'text', comment.text,
          'reply', comment.reply,
          'time_added', to_char(comment.time_added,'DD Mon HH24:MI'),
          'first', u.first,
          'last', u.last,
          'profile_pic', u.profile_pic
        ))
        from mentor_comment comment, users u
        where comment.mid= 2 and comment.uid=u.id
       ) as comments
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
