/**
 * @module model/Message
 */
const db = require('./pool.js');
const Mail = require('../../mail/Mail');
const User = require("./User");

const createMessage = async (origin, dest, type, content) => {
  const query = `
    insert into message (origin, destination, type, content, timestamp, is_read)
    values ($1, $2, $3, $4, now(), false);`;
  await db.query(query, [origin, dest, type, content]);
  const email = await User.getUserEmail(dest);
  await Mail.sendMessageEmail(email, content);
};

/**
 *
 * @param dest User ID
 * @param content Content of the message
 * @returns {Promise<void>}
 */
exports.sendSystemMessage = async (dest, content) => {
  await createMessage(0, dest, 1, content)
};

/**
 *
 * @param uid User ID
 * @returns {Promise<*>} A list of notifications
 */
exports.getNotificationsByUserID = async (uid) => {
  const query = `select *
                 from message
                 where origin = 0
                   and destination = $1
                 order by timestamp desc;`;
  const {rows} = await db.query(query, [uid]);
  return rows;
};

/**
 *
 * @param uid User ID
 */
exports.setNotificationsAsRead = async (uid) => {
  const query = `update message
                 set is_read = true
                 where origin = 0
                   and destination = $1;`;
  await db.query(query, [uid]);
};
