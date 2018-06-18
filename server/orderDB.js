const db = require('./_dbPool.js');

exports.addMentorShip = (uid, mid, service_name, service_price, callback) => {
  const query = `insert into mentor_rel
                  (uid, mid, service_name, service_price, start_time, status)
                  values($1,$2,$3,$4,now(),1);`;
  db.query(query, [uid, mid, service_name, service_price], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};