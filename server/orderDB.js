const db = require('./_dbPool.js');

exports.addMentorShip = (uid, mid, service_name, service_price, note, callback) => {
  const query = `insert into mentor_rel
                  (uid, mid, service_name, service_price, start_time, status, note)
                  values($1,$2,$3,$4,now(),20,$5);`;
  db.query(query, [uid, mid, service_name, service_price, note], (err, result) => {
    if (err) {
      callback(`Error: ${err}`);
      return;
    }
    let additional_query = `select m.uid as uid, concat(u.last,u.first) as mentor_name
      from mentor_info m, users u
      where m.uid=u.id and m.id=$1`;
    db.query(additional_query, [mid], (err, result)=>{
      if(err || result.rows.length != 1){
        callback(`Error: ${err}`);
        return;
      }
      let mentor_uid = result.rows[0].uid;
      let mentor_name = result.rows[0].mentor_name;
      let additional_query = `select concat(last,first) as name from users where id=$1;`
      db.query(additional_query, [uid], (err, result)=>{
        if(err || result.rows.length != 1){
          callback(`Error: ${err}`);
          return;
        }
        let mentee_name = result.rows[0].name;
        callback(null, mentee_name, mentor_uid, mentor_name);
      });
    });
  });
};
