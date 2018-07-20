const db = require('./pool.js');

exports.addMentorShip = async (uid, mid, service_name, service_price, note) => {
  // insert to mentor_rel
  const insert_query = `insert into mentor_rel (uid, mid, service_name, service_price, start_time, status, note)
                        values ($1, $2, $3, $4, now(), 20, $5);`;
  await db.query(insert_query, [uid, mid, service_name, service_price, note]);


  // get mentor info
  const mentor_query = `select m.uid as uid, concat(u.last, u.first) as mentor_name
                        from mentor_info m,
                             users u
                        where m.uid = u.id
                          and m.id = $1`;
  const mentor_result = db.query(mentor_query, [mid]);
  if (mentor_result.rows.length !== 1) throw new Error("No such mentor found");
  const {mentor_uid, mentor_name} = mentor_result.rows[0];


  // get mentee info
  const mentee_query = `select concat(last, first) as name
                        from users
                        where id = $1;`;
  const mentee_result = db.query(mentee_query, [uid]);
  if (mentee_result.rows.length !== 1) throw new Error("No such mentee found");
  const mentee_name = mentee_result.rows[0].name;


  return {mentee_name, mentor_uid, mentor_name};

};
