const db = require('./pool.js');
// Table: follow_rel
// follower
// follower_uid
// followee_uid


// whole idea
// In get mentor list, given a uid, and ask it get mentor list contains a list of follow user
// when rendering the segment, consult the user list. If user in the follow list, then show followed
//  If not, then show follow

// For follow button click
// get the uid and mentor uid, and call the api
// Add this user into the follow list

// For unfollow button click
// get the uid and mentor uid, call the delete api
// Delete this user from the follow list

/**************************************/
// Follower functions 
/************************************ */
exports.createFollowerFolloweeRelationship = async (follower_uid, followee_uid) => {

  // Check whether the relationsip exists
  // What other information you might want?

  //Check duplicate
  let selectQuery = `SELECT *
                     FROM follow_rel
                     WHERE follower_uid = $1
                       AND followee_uid = $2;`;
  const {rowCount} = await db.query(selectQuery, [follower_uid, followee_uid]);

  if (rowCount !== 0) return;

  const insertRelQuery = `INSERT INTO follow_rel (follower_uid, followee_uid, timestamp)
                          VALUES ($1, $2, now()); `;
  await db.query(insertRelQuery, [follower_uid, followee_uid]);

};

exports.deleteFollowerFolloweeRelationship = async (follower_uid, followee_uid) => {
  const deleteQuery = "DELETE FROM follow_rel WHERE follower_uid = $1 AND followee_uid = $2";
  await db.query(deleteQuery, [follower_uid, followee_uid]);
};

exports.findFollowersByAuthorID = async (author_id) => {
  const selectFollowersQuery = "SELECT follower_uid FROM follow_rel WHERE followee_uid = $1 ";
  const {rows} = await db.query(selectFollowersQuery, [author_id]);
  return rows.map(e => e.follower_uid);
};

exports.whetherFollowed = async (follower_id, followee_uid) => {
  const selectFolloweesQuery = "SELECT * FROM follow_rel WHERE follower_uid = $1 AND followee_uid = $2";
  const {rowCount} = await db.query(selectFolloweesQuery, [follower_id, followee_uid]);
  return rowCount > 0;
};

exports.getFollowersForFollowee = async (followee_id) => {
  const selectFollowersQuery = "SELECT follower_uid FROM  follow_rel WHERE followee_uid = $1";
  const {rows} = await db.query(selectFollowersQuery, [followee_id]);
  return rows.map(e => e.follower_uid);
};


exports.getFolloweesForFollower = async (followee_uid) => {
  const selectFolloweesQuery = "SELECT followee_uid FROM  follow_rel WHERE follower_uid = $1";
  const {rows} = await db.query(selectFolloweesQuery, [followee_uid]);
  return rows.map(e => e.followee_uid);
};

