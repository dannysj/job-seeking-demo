/**
 * @module model/Comment
 */

const db = require('./pool.js');


/**
 * Create comment for a given mentor
 * @param mid Mentor ID
 * @param text Comment text
 * @param uid User ID
 */

exports.createMentorComment = async (mid, text, uid) => {
  const query = `insert into mentor_comment (mid, text, uid)
                 values ($1, $2, $3)`;
  await db.query(query, [mid, text, uid]);
};

/**
 * The uid-comment_id comment ID relation is maintained by a table
 * to prevent one user click like multiple times
 *
 * @param comment_id Comment ID
 * @param uid User ID
 */
exports.createCommentLike = async (comment_id, uid) => {
  const query = `insert into mentor_comment_like (comment_id, uid)
                 values ($1, $2)`;
  await db.query(query, [comment_id, uid]);
};

/**
 *
 * @param comment_id Comment ID
 * @param reply Reply text
 */
exports.createMentorReply = async (comment_id, reply) => {
  const query = `update mentor_comment
                 set reply = $2
                 where id = $1`;
  await db.query(query, [comment_id, reply]);
};

exports.getMentorCommentsByMentorID = async (mid) => {
  const query = `select json_agg(
                   json_build_object('id', comment.id,
                                     'text', comment.text,
                                     'reply', comment.reply,
                                     'time_added', to_char(comment.time_added, 'DD Mon HH24:MI'),
                                     'first', u.first,
                                     'last', u.last,
                                     'profile_pic', u.profile_pic,
                                     'like', (select COUNT(*) from mentor_comment_like where mentor_comment_like.comment_id = comment.id))
                   order by time_added)
          from mentor_comment comment, users u
          where comment.mid = $1 and comment.uid = u.id
  `;
  const {rows} = await db.query(query, [mid]);
  const result = rows[0].json_agg;
  return result ? result : [];
};