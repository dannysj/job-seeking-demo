const config = require('./_config.js');
const bcrypt = require('bcrypt');

exports.getHashedPassword = (input) => {
  return bcrypt.hashSync(input, config.hash_salt);
}
