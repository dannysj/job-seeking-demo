/**
 * @module model/User
 */

const db = require('./pool.js');
const uuid4 = require('uuid/v4');
const security = require('../security');
const InvalidVerificationCodeError = require("../error").InvalidVerificationCodeError;
const ResourceNotFoundError = require("../error").ResourceNotFoundError;
const InvalidAccessTokenError = require("../error").InvalidAccessTokenError;

/**
 * @typedef {Object} user
 *
 * @global
 * @static
 *
 * @property {number} id User ID
 * @property {number} uid User ID
 * @property {string} first First Name
 * @property {string} last Last Name
 * @property {string} profile_pic Profile Picture
 * @property {Date} register_date When the user is registered
 * @property {boolean} ismentor Whether the user is a mentor
 * @property {boolean} isadmin Whether the user is a system administrator
 * @property {string} email Sanitized Email Address
 * @property {Array<string>} major A list of major
 * @property {string} cover Self Introduction
 * @property {number} balance Balance Available
 * @property {string} wechat WeChat Number
 * @property {string} resume Relative Path to the Resume File
 * @property {boolean} isactivated Whether the user is activated
 * @property {string} access_token Access Token
 * @property {number} num_notifications Number of Notifications
 * @property {Array<number>} followee A List of User ID the User is Following
 *
 */


/*                                                   Get User                                                        */
/**
 * @param {number} uid User ID
 * @returns {user} the user object without password entry
 */
exports.getUserByUserID = async (uid) => {
  return await getUserHelper(`where id = $1;`, [uid]);
};

/**
 * This method is used to verify user information on log in
 *
 * @param {string} email Unsanitized Email
 * @param {string} password UNHASHED password
 * @returns {user} the user object without password entry
 */
exports.getUserByEmailAndPassword = async (email, password) => {
  return await getUserHelper(`where email=$1 and password=$2`, [security.sanitizeEmail(email), security.hashPassword(password)]);
};

/**
 * A helper method used to get user information by passing the constraints
 * @param {string} whereClause
 * @param {Array<*>} values
 * @returns {user} the user object without password entry
 */
const getUserHelper = async (whereClause, values) => {
  const query = `
  select
    id,
    first,
    last,
    profile_pic,
    register_date,
    ismentor,
    isadmin,
    LOWER(email) as email,
    major,
    cover,
    balance,
    wechat,
    resume,
    isactivated,
    access_token,
    (select count(*)::int from message where is_read=false and destination = users.id) as num_notifications,
    array(select follow_rel.followee_uid from follow_rel where follow_rel.follower_uid = users.id) as followee
  from users ${whereClause};`;
  const {rows} = await db.query(query, values);
  if (rows.length === 0) throw new ResourceNotFoundError();
  return rows[0];
};

/*                                                   Get User Info                                                    */

/**
 * This method is used when the user forget the password
 *
 * @param {string} email Unsanitized Email
 * @returns {number} User ID
 */
exports.getUserIDByEmail = async (email) => {
  return await getUserInfoHelper('id', `where email = $1`, [security.sanitizeEmail(email)]);
};

/**
 * This method is used to convert access token to user id
 *
 * @param {string} access_token User's Access Token
 * @returns {number} User ID
 */
exports.getUserIDByAccessToken = async (access_token) => {
  try {
    return await getUserInfoHelper('id', `where access_token = $1`, [access_token]);
  } catch (e) {
    throw new InvalidAccessTokenError();
  }
};

/**
 * Whether a given user is admin
 *
 * @param {number} uid User ID
 * @returns {boolean} isAdmin
 */
exports.isUserAdmin = async (uid) => {
  return await getUserInfoHelper('isadmin', `where id = $1`, [uid]);
};

/**
 * Get the email address for a given user
 *
 * @param {number} uid User ID
 * @returns {string} Email Address
 */
exports.getUserEmail = async (uid) => {
  return await getUserInfoHelper('email', `where id = $1`, [uid]);
};

/**
 * A helper method used to get user info by passing the constraints
 * @param {string} column
 * @param {string} whereClause
 * @param {Array<*>} values
 * @returns {number} User ID
 */
const getUserInfoHelper = async (column, whereClause, values) => {
  const query = `select ${column} from users ${whereClause};`;
  const {rows} = await db.query(query, values);
  if (rows.length === 0) throw new ResourceNotFoundError();
  return rows[0][column];
};

/*                                                  Update User Info                                                  */
/**
 * This method is used to update a column for user table
 *
 * @param {number} uid User ID
 * @param {string} attr Column in the user table
 * @param {*} val The value you want to set to
 */
exports.updateAttribute = async (uid, attr, val) => {
  const query = `update users set ${attr}=$1 where id=$2;`;
  await db.query(query, [val, uid]);
};

/**
 *
 * @param {number} uid User ID
 * @param {string} password UNHASHED password
 */
exports.updatePassword = async (uid, password) => {
  await this.updateAttribute(uid, 'password', security.hashPassword(password));
};

/**
 * This method modify the given user object with new access token
 *
 * Note that this method take in the entire user object as parameter instead of uid
 *
 * @param {user} user the user object
 */
exports.updateAccessToken = async (user) => {
  const access_token = uuid4();
  await this.updateAttribute(user.id, 'access_token', access_token);
  user.access_token = access_token;
};

/*                                                   Create User                                                     */
/**
 *
 * @param {string} first first name of the user
 * @param {string} last last name of the user
 * @param {string} password UNHASHED password of user
 * @param {string} email email address of the user
 * @returns {user} the user object without password entry
 */
exports.createUser = async (first, last, password, email) => {
  const query = `insert into users (first, last, password, email, profile_pic, register_date, isadmin, ismentor)
                 values ($1, $2, $3, $4, '/img/sample_profile.jpg', now(), false, false)
      returning *;`;
  const {rows} = await db.query(query, [first, last, security.hashPassword(password), security.sanitizeEmail(email)]);
  const userInfo = rows[0];
  delete userInfo.password;
  return userInfo;
};


/*                                                   Activate User                                                   */
/**
 * @param {string} verification_code verification code of a given user
 * @returns {number} User ID for sending message
 */
exports.confirmVerification = async (verification_code) => {
  const query = `update users
                 set isactivated = true
                 where id = (select uid from user_verification where verification_code = $1)
      returning id;`;
  const {rows} = await db.query(query, [verification_code]);
  if (rows.length === 0) throw new InvalidVerificationCodeError();
  return rows[0].id;
};

/**
 *
 * @param {string} email Unsanitized Email
 * @param {string} verification_code
 */
exports.addVerificationCodeByEmail = async (email, verification_code) => {
  const query = `insert into user_verification (uid, verification_code)
                  values ((select id from users where email = $1),$2)
                  on conflict (uid) do update set verification_code = $2, time_added=now();`;
  await db.query(query, [security.sanitizeEmail(email), verification_code]);
};

/**
 *
 * @param {string} uid User ID
 * @param {string} verification_code
 */
exports.addVerificationCodeByUserID = async (uid, verification_code) => {
  const query = `insert into user_verification (uid, verification_code)
                  values ($1,$2)
                  on conflict (uid) do update set verification_code = $2, time_added=now();`;
  await db.query(query, [uid, verification_code]);
};

exports.checkEmailExist = async (email) => {
  const query = `select * from users where email = $1`;
  const {rows} = await db.query(query, [email])
  return rows.length !== 0
}