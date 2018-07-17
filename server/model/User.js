const db = require('./pool.js');
const bcrypt = require("bcrypt");
const config = require("../config");
const uuid4 = require('uuid/v4');


/*                                                   Get User                                                        */
/**
 * @param uid User ID
 * @returns the user object without password entry
 */
exports.getUserByUID = async (uid) => {
  return await getUserHelper(`where id = $1;`, [uid]);
};

/**
 * This method is used to verify user information on log in
 *
 * @param email
 * @param password UNHASHED password
 * @returns the user object without password entry
 */
exports.getUserByEmailAndUnhashedPassword = async (email, password) => {
  return await getUserHelper(`where email=$1 and password=$2`, [sanitizeEmail(email), hashedPassword(password)]);
};

/**
 * A helper method used to get user information by passing the constraints
 * @param whereClause
 * @param values
 * @returns the user object without password entry
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
  if (rows.length === 0)
    throw new Error('No such user found');
  return rows[0];
};

/*                                                   Get User ID                                                      */

/**
 * This method is used when the user forget the password
 *
 * @param email
 * @returns User ID
 */
exports.getUserIDByEmail = async (email) => {
  return await getUserIDHelper(`where email=$1`, [sanitizeEmail(email)]);
};

/**
 * This method is used to convert access token to user id
 *
 * @param access_token
 * @returns user id
 */
exports.getUserIDByAccessToken = async (access_token) => {
  try {
    return await getUserIDHelper(`where access_token=$1`, [access_token]);
  } catch (e) {
    throw new Error('Access token invalid');
  }
};

/**
 * A helper method used to get user id by passing the constraints
 * @param whereClause
 * @param values
 * @returns user id
 */
const getUserIDHelper = async (whereClause, values) => {
  const query = `select id from users ${whereClause};`;
  const {rows} = await db.query(query, values);
  if (rows.length === 0)
    throw('No such user found');
  return rows[0].id;
};

/*                                                   Update User                                                     */
/**
 * This method is used to update a column for user table
 *
 * @param uid user id
 * @param attr column in the user table
 * @param val value you want to set
 */
exports.updateUserAttribute = async (uid, attr, val) => {
  const query = `update users set ${attr}=$1 where id=$2;`;
  await db.query(query, [val, uid]);
};

/**
 *
 * @param uid user id
 * @param password UNHASHED password
 */
exports.updateUserWithUnhashedPassword = async (uid, password) => {
  await this.updateUserAttribute(uid, 'password', hashedPassword(password));
};

/**
 * This method modify the given user object with new access token
 *
 * Note that this method take in the entire user object as parameter instead of uid
 *
 * @param user: the user object
 */
exports.updateUserAccessToken = async (user) => {
  const access_token = uuid4();
  await this.updateUserAttribute(user.id, 'access_token', access_token);
  user.access_token = access_token;
};

/*                                                   Create User                                                     */
/**
 *
 * @param first first name of the user
 * @param last last name of the user
 * @param password UNHASHED password of user
 * @param email email address of the user
 * @returns the user object without password entry
 */
exports.createUser = async (first, last, password, email) => {
  const query = `insert into users
                 (first,last,password,email,profile_pic,register_date,isadmin,ismentor)
                 values($1,$2,$3,$4,'/img/sample_profile.jpg',now(),false,false)
                 returning *;`;
  const {rows} = await db.query(query, [first, last, hashedPassword(password), sanitizeEmail(email)]);
  const userInfo = rows[0];
  delete userInfo.password;
  return userInfo;
};


/*                                                   Activate User                                                   */
/**
 * @param verification_code verification code of a given user
 * @returns User ID for sending message
 */
exports.confirmVerification = async (verification_code) => {
  const query = `update users set isactivated=true where
                id=(select uid from user_verification where verification_code=$1)
                returning id;`;
  const {rows} = await db.query(query, [verification_code]);
  if (rows.length === 0)
    throw (`No user with verification code "${verification_code}" found `);
  return rows[0].id;
};

/**
 *
 * @param email
 * @param verification_code
 */
exports.addVerificationCode = async (email, verification_code) => {
  const query = `insert into user_verification (uid, verification_code)
                  values ((select id from users where email = $1),$2)
                  on CONFLICT (uid) do update set verification_code = $2, time_added=now();`;
  await db.query(query, [sanitizeEmail(email), verification_code]);
};

/*                                                   Helper Methods                                                  */
/**
 * Generate hashed password from unhashed password
 * @param password
 * @returns hashed password
 */
const hashedPassword = (password) => {
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
 * @param email raw email address
 * @returns sanitized email address
 */
const sanitizeEmail = (email) => {
  return email.toLowerCase();
};