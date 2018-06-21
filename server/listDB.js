const db = require('./_dbPool.js');


exports.getCollegeList = (search, callback) => {
  const query = `select id as value, name as text from college
                 where UPPER(name) like UPPER($1) LIMIT 15;`;
  db.query(query, ['%' + search + '%'], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

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
