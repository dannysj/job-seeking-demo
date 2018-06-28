const db = require('./_dbPool.js');


/*
*   db_name: user_action_logs
*   db_structure: 
*      uid: -1 stands for guest 
*      user_action:
*      note:
*      timestamp:
*/
exports.saveLogger = (logs, callback) => {

    let allString = logs.map(l => "("+ l.uid + " , '"+ l.user_action + "' , '" + l.note +
                     "' , to_timestamp(" + l.timestamp + "))")
                        .join()

    let queryTest = ""
    
    console.log(allString)
    if (allString !== ""){
        queryTest = 'INSERT INTO user_action_logs (uid, user_action, note, timestamp)'+
                    ' VALUES ' + allString + " ;"    
    
        db.query(queryTest,(err) => {
            if (err){
                callback(err)
                return
            }
            callback(null);}
        )
    }else{
        callback(null);
    }
    
    console.log("****** SAVE LOG SUCCESS ******")
}