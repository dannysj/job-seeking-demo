const db = require('../pool.js');

exports.approveMentor = (uid, mid, callback) => {
  console.log(uid);
  const query = `update users set ismentor=true where id=$1;`;
  db.query(query, [uid], (err, result) => {
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

exports.createMessage = (origin, dest, type, content, callback) => {
  const query = `
    insert into message (origin,destination,type,content,timestamp,is_read)
    values($1,$2,$3,$4,now(),false);
  `;
  db.query(query, [origin, dest, type, content], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.getNotificationsByUid = (uid, callback) => {
  const query = `select * from message where origin=0 and destination=$1 order by timestamp desc;`;
  db.query(query, [uid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.setNotificationsAsRead = (uid, callback) => {
  const query = `update message set is_read=true where origin=0 and destination=$1;`;
  db.query(query, [uid], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (callback)
      callback(err);
  });
};

exports.getMentorApplications = (callback) => {
  var query = `
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