/**
 * @module College
 */

const db = require('./pool.js');

/**
 * Used for applying mentor
 *
 * @param search search query
 * @returns {Promise<Array<college>>} up to 20 college objects that matches the search query
 */

exports.getCollegeList = async (search_query) => {
  const query = `select id as value, name as text from college where UPPER(name) like UPPER($1) LIMIT 20;`;
  const {rows} = await db.query(query, ['%' + search_query + '%']);
  return rows;
};

/**
 *  add college to the college table
 *
 * @param college_name
 * @returns {Promise<college>} the college object with id and name
 */
exports.addCollege = async (college_name) => {
  const query = `insert into college (id, name) values((select max(id) from college)::int + 1, $1) returning *;`;
  const {rows} = await db.query(query, [college_name]);
  return rows[0];
};