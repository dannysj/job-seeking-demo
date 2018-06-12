const db = require('../pool.js');

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
      major.name as major,
      c.name as college_name,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.id as mid
    from users u, mentor_info m, college c, major
    where m.uid = u.id and m.cid = c.id and u.ismentor = true and u.major_id = major.id;
  `;
  db.query(query, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};


exports.getMentorComment = (mid, callback) => {
  const query = `select
    c.id as id,
    c.mid as mid,
    to_char(c.time_added,'DD Mon HH24:MI') as time_added,
    c.text as text,
    c.id as uid,
    c.reply as reply,
    u.first as first,
    u.last as last,
    u.profile_pic as profile_pic
    from users u, mentor_comment c
    where c.mid=$1 and c.uid=u.id;`;
  db.query(query, [mid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.createMentorComment = (comment, callback) => {
  const query = `insert into mentor_comment (mid,text,uid) values($1, $2, $3)`;
  db.query(query, [comment.mid, comment.text, comment.uid,], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.createMentorReply = (comment, callback) => {
  const query = `update mentor_comment set reply = $2 where id=$1`;
  db.query(query, [comment.id,comment.reply],
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
};
