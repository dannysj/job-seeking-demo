const User = require("../model/User");

const access_token_validator = async (req, res, next) => {
  req.body.uid = null;
  const access_token = req.get('access_token');
  if (access_token && access_token !== 'null') {
    console.log(access_token)
    req.body.uid = await User.getUserIDByAccessToken(access_token);
    console.log(`access_token: ${access_token} <-> UID: ${req.body.uid}`);

    next();
  } else {
    // If the request is a non-privilege function
    next();
  }
};

module.exports = access_token_validator;