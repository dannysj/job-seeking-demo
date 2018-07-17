const db = require('./pool.js');

/**
 * Used for applying mentor
 *
 * @param search search query
 * @returns up to 20 colleges that matches the search query
 */
exports.getCollegeList = async (search) => {
  const query = `select id as value, name as text from college where UPPER(name) like UPPER($1) LIMIT 20;`;
  const {rows} = await db.query(query, ['%' + search + '%']);
  return rows;
};

/**
 *  add college to the college table
 *
 * @param college_name
 * @returns the college object with id and name
 */
exports.addCollege = async (college_name) => {
  const query = `insert into college (id, name) values((select max(id) from college)::int + 1, $1) returning *;`;
  const {rows} = await db.query(query, [college_name]);
  return rows[0];
};