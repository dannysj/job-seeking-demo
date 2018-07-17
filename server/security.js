const config = require('./_config.js');
const bcrypt = require('bcrypt');
const db = require('./securityDB.js');
const uuid4 = require('uuid/v4');

exports.getHashedPassword = (input) => {
  return bcrypt.hashSync(input, config.hash_salt);
}

exports.access_token_validator = (req, res, next) => {

  // I probably can chop off the code here
  console.log('VALIDATING ACCESS TOKEN: '+req.get('access_token'));
  req.body.uid = null;

  if(!!req.get('access_token') && req.get('access_token') !== "null") {
    db.getUidByAccessToken(req.get('access_token'), (err, uid) => {

      if(err) {
        console.log("ERROR: 44 "+ err);
        res.json({code:44})
      }
      else {
        req.body.uid = uid;
        console.log('UID SET: '+req.body.uid);
        next();
      }
    });
  }
  else{
    // If the request is a non-privilege function
    next();
  }
}

exports.update_access_token = (uid, callback) => {
  let access_token = uuid4();
  db.updateAccessToken(uid, access_token, callback);
}

exports.santicize_email = (email) => {

  // TODO: we might have to use GDPR standard in the future
  // It depends on the law in the US.
  // Since our transactions happen when the customer is physically in US,
  // This website might have to conform to GDPR standard if U.S. government
  // decides to endorse GDPR nation-wise.
  // If this happens, we need to santicize all email in database (hash them)
  //
  // Now this method only ensures the email to be lower case.
  return email.toLowerCase();
}
