/**
 * @module Comment
 */

const db = require('./pool.js');


/**
 * Create comment for a given mentor
 * @param mid Mentor ID
 * @param text Comment text
 * @param uid User ID
 */

exports.createMentorComment = async (mid, text, uid) => {
  const query = `insert into mentor_comment (mid,text,uid) values($1, $2, $3)`;
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
  const query = `insert into mentor_comment_like (comment_id, uid) values($1, $2)`;
  await db.query(query, [comment_id, uid]);
};

/**
 *
 * @param comment_id Comment ID
 * @param reply Reply text
 */
exports.createMentorReply = async (comment_id, reply) => {
  const query = `update mentor_comment set reply = $2 where id=$1`;
  await db.query(query, [comment_id, reply]);

  // TODO: Authentication
  // const query = `select * from mentor_info
  //                 where uid = $2 and
  //                        id = (select mid from mentor_comment where id = $1)`;
  // db.query(query, [comment_id, uid])
  //   .then((result) => {
  //
  //     if (result.rows.length === 0) {
  //       callback('Illegal');
  //       return;
  //     }
  //
  //
  //
  //
  //   })
  //   .catch(err => callback(err));
};