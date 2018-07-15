const config = require('./_config.js');
const bcrypt = require('bcrypt');
const uuid4 = require('uuid/v4');
const User = require("./model/user");

exports.getHashedPassword = (input) => {
  return bcrypt.hashSync(input, config.hash_salt);
};

exports.access_token_validator = async (req, res, next) => {
  req.body.uid = null;
  const access_token = req.get('access_token');
  if (!!access_token) {
    try {
      const {id} = await User.getUserByAccessToken(access_token);
      req.body.uid = id;
      console.log('UID SET: ' + id);
    } catch (e) {
      console.log(e);
    }
    next();
  }
  else {
    next();
  }
};

exports.update_access_token = async (uid) => {
  const access_token = uuid4();
  await User.updateUserAttribute(uid, 'access_token', access_token);
  return access_token;
};

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