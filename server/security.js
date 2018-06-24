const config = require('./_config.js');
const bcrypt = require('bcrypt');
const db = require('./securityDB.js');
const uuid4 = require('uuid/v4');

exports.getHashedPassword = (input) => {
  return bcrypt.hashSync(input, config.hash_salt);
}

exports.access_token_validator = (req, res, next) => {
  if(!!req.get('access_token')) {
    db.getUidByAccessToken(req.get('access_token'), (err, uid) => {
      if(err) {
        console.log(err);
      }
      else {
        req.body.uid = uid;
      }
      next();
    });
  }
  next();
}

exports.update_access_token = (uid, callback) => {
  let access_token = uuid4();
  db.updateAccessToken(uid, access_token, callback);
}
