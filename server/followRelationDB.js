const db = require('./model/pool.js');
const _ = require('lodash');
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
exports.createFollowerFolloweeRelationship = (follower_uid, followee_uid, callback) => {

  // Check whether the relationsip exists
  // What other information you might want?

  //Check duplicate
  let attemptToSelectQuery = `SELECT *
                              FROM follow_rel
                              WHERE follower_uid = $1
                                AND followee_uid = $2;`;
  db.query(attemptToSelectQuery, [follower_uid, followee_uid])
    .then(res => {
        if (res.rowCount === 0) {
          // insert if none duplicate
          let insertRelQuery = `INSERT INTO follow_rel (follower_uid, followee_uid, timestamp)
                                VALUES ($1, $2, now()); `;
          db.query(insertRelQuery, [follower_uid, followee_uid])
            .then(res => callback(null))
            .catch(err => callback(err));
        }
      }
    )
    .catch(err => callback(err));
}

exports.deleteFollowerFolloweeRelationship = (follower_uid, followee_uid, callback) => {
  let deleteQuery = "DELETE FROM follow_rel WHERE follower_uid = $1 AND followee_uid = $2";
  db.query(deleteQuery, [follower_uid, followee_uid])
    .then(res => callback(null))
    .catch(err => callback(err));
};

exports.findFollowersByAuthorID = async (author_id) => {
  try {
    const selectFollowersQuery = "SELECT follower_uid FROM follow_rel WHERE followee_uid = $1 ";
    const {rows} = await db.query(selectFollowersQuery, [author_id]);
    return _.map(rows, dic => dic["follower_uid"]);
  } catch (e) {
    return []
  }
};

exports.whetherFollowed = (follower_id, followee_uid, callback) => {
  let selectFolloweesQuery = "SELECT * FROM follow_rel WHERE follower_uid = $1 AND followee_uid = $2";
  db.query(selectFolloweesQuery, [follower_id, followee_uid])
    .then(res => {
      console.log("--Check respons--")
      console.log(res.rows)
      // If exists.
      if (res.rowCount > 0) {
        callback(null, true)
        return
      }
      callback(null, false)
    })
    .catch(err => callback(err, false))
};

exports.getFollowersForFollowee = (followee_id, dealWithFollowers) => {
  let selectFollowersQuery = "SELECT follower_uid FROM  follow_rel WHERE followee_uid = $1";
  db.query(selectFollowersQuery, [followee_id])
    .then(res => dealWithFollowers(null, res.rows.map(dic => dic["follower_uid"])))
    .catch(err => dealWithFollowers(err, []))
};

/*
exports.getFolloweesForFollower = (followee_uid, callback)=>{
 let selectFolloweesQuery = "SELECT followee_uid FROM  follow_rel WHERE follower_uid = $1";
  db.query(selectFollowersQuery, [followee_uid])
    .then( res =>  callback(null, res.rows.map(dic=>dic["followee_uid"])) )
    .catch(err => dealWithFollowers(err, []))
};*/

