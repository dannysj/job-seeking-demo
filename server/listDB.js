const db = require('./model/pool.js');


exports.getMajorList = (callback) => {
  const query = `select * from major order by text;`;
  db.query(query, (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};
