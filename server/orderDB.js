const db = require('./_dbPool.js');

exports.addMentorShip = (uid, mid, service_name, service_price, note, callback) => {
  const query = `insert into mentor_rel
                  (uid, mid, service_name, service_price, start_time, status, note)
                  values($1,$2,$3,$4,now(),1,$5);`;
  db.query(query, [uid, mid, service_name, service_price, note], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    let additional_query = `select uid from mentor_info where id=$1`;
    db.query(additional_query, [mid], (err, result)=>{
      if(err){
        callback(err);
        return;
      }
      let mentor_uid = result.rows[0].uid;
      let additional_query = `select concat(last,first) as name from users where id=$1;`
      db.query(additional_query, [uid], (err, result)=>{
        if(err){
          callback(err);
          return;
        }
        let mentee_name = result.rows[0].name;
        callback(null, mentee_name, mentor_uid);
      });
    });
  });
};
