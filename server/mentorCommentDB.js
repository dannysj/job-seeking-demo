const db = require('./_dbPool.js');

// exports.getMentorComment = (mid, callback) => {
//   const query = `select
//     comment.text as text,
//     comment.reply as reply,
//     to_char(comment.time_added,'DD Mon HH24:MI') as time_added,
//     u.first as first,
//     u.last as last,
//     u.profile_pic as profile_pic
//     from users u, mentor_comment comment
//     where comment.mid=$1 and comment.uid=u.id;`;
//   db.query(query, [mid])
//     .then(() => callback(null, result.rows))
//     .catch(err => callback(err));
// };

exports.createMentorComment = (mid, text, uid, callback) => {
  const query = `insert into mentor_comment (mid,text,uid) values($1, $2, $3)`;
  db.query(query, [mid, text, uid])
    .then(() => callback(null))
    .catch(err => callback(err));
};


exports.createMentorReply = (comment_id, reply, uid, callback) => {
  const query = `select * from mentor_info
                  where uid = $2 and
                         id = (select mid from mentor_comment where id = $1)`;
  db.query(query, [comment_id, uid])
    .then((result) => {

      if(result.rows.length === 0){
        callback('Illegal');
        return;
      }

      const query = `update mentor_comment set reply = $2 where id=$1`;
      db.query(query, [comment_id, reply]).then(() => callback(null))


    })
    .catch(err => callback(err));
};