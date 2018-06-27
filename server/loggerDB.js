const db = require('./_dbPool.js');

exports.saveLogger = (logs, callback) => {
    console.log(logs)
    console.log("****** SAVE LOG SUCCESS ******")
    callback(null)
}