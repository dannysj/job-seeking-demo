const config = require('./_config.js');
const bcrypt = require('bcrypt');
const db = require('./securityDB.js');

exports.getHashedPassword = (input) => {
  return bcrypt.hashSync(input, config.hash_salt);
}

exports.access_token_validator = (req, res, next) => {
  if(!!!req.get('access_token')) {
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
}
