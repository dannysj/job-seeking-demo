/**
 * @module Major
 */

const db = require('./pool.js');

/**
 * @returns {Promise<Array<major>>} A list of majors
 */
exports.getMajorList = async () => {
  const {rows} = await db.query("select * from major order by text;");
  return rows;
};
