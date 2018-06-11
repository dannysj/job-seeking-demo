const db = require('../pool.js');

// Table: follow_rel
// follower
// follower_uid
// followee_uid

/**************************************/
// Follower functions 
/************************************ */
exports.createFollowerFolloweeRelationship= (follower_uid, followee_uid, callback)=>{
 
    // Check whether the relationsip exists
    // What other information you might want? 
   
   //Check duplicate
   var attemptToSelectQuery = `SELECT * FROM follow_rel WHERE follower_uid = $1 AND followee_uid = $2;`;
   db.query(attemptToSelectQuery, [follower_uid, followee_uid])
       .then(res => {if (res.rowCount == 0) return 1})
       .catch(err => callback(err));
    
   // insert if none duplicate    
    var insertRelQuery = `INSERT INTO follow_rel (follower_uid, followee_uid, timestamp) 
           VALUES  ($1, $2, now()); `;
   db.query(insertRelQuery, [follower_uid, followee_uid ] )
       .then(res => callback(null) )
       .catch(err => callback(err) );
   }
   
   exports.deleteFollowerFolloweeRelationship= (follower_uid, followee_uid)=>{
     var deleteQuery = "DELETE FROM follow_rel WHERE follower_uid = $1 AND followee_uid = $2";
     db.query(deleteQuery, [follower_uid, followee_uid])
       .then(res=> callback(null))
       .catch(err=> callback(err));
   }
   
   exports.findFollowersByAuthorID= (author_id, callback )=>{
     var selectFollowersQuery = "SELECT follower_uid FROM follow_rel WHERE followee_uid = $1 ";
     db.query(selectFollowersQuery, [author_id])
          .then( res =>  {
             callback(null, res.rows.map(dic => dic["follower_uid"]));
          } )
          .catch( err => callback(err, []) )
   }
   
   exports.whether_followed = (follower_id, followee_uid, callback) =>{
     var selectFolloweesQuery = "SELECT * FROM follow_rel WHERE follower_uid = $1 AND followee_uid = $2";
     db.query(selectFolloweesQuery, [follower_id, followee_uid] )
       .then(res =>{
         // If exists. 
         if (res.rowCount > 0){
           callback(null, true)
         }
         callback(null, false)
       })
       .catch(err => callback(err, false))
   }
   
   exports.get_followers_for_followee  = (followee_id, dealWithFollowers) =>{
     var selectFollowersQuery = "SELECT follower_uid FROM  follow_rel WHERE followee_uid = $1";
     db.query(selectFollowersQuery, [followee_id])
       .then( res =>  dealWithFollowers(null, res.rows.map(dic=>dic["follower_uid"])) )
       .catch(err => dealWithFollowers(err, []))
   }