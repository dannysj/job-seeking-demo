/**
 * @module security
 */

const bcrypt = require("bcrypt");
const config = require("./config");

/**
 * Generate hashed password from unhashed password
 * @param {string} password Unhashed password
 * @returns {string} hashed password
 */
exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, config.hash_salt);
};

/**
 * TODO: we might have to use GDPR standard in the future
 * It depends on the law in the US.
 * Since our transactions happen when the customer is physically in US,
 * This website might have to conform to GDPR standard if U.S. government
 * decides to endorse GDPR nation-wise.
 * If this happens, we need to santicize all email in database (hash them)
 *
 * Now this method only ensures the email to be lower case.
 * @param {string} email raw email address
 * @returns {string} sanitized email address
 */
exports.sanitizeEmail = (email) => {
  return email.toLowerCase();
};