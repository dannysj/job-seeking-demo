const db = require('./_dbPool.js');

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
