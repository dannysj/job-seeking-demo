const User = require("../model/User");

const access_token_validator = async (req, res, next) => {
  req.body.uid = null;
  const access_token = req.get('access_token');
  if (!!access_token) {
    try {
      req.body.uid = await User.getUserIDByAccessToken(access_token);
      console.log(`access_token: ${access_token} <-> UID: ${req.body.uid}`);
    } catch (e) {
      console.log(e);
    }
    next();
  }
  else {
    next();
  }
};

module.exports = access_token_validator;