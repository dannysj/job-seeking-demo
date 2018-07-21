const db = require('./pool.js');

exports.getRelMentors = async (uid) => {
  const query = `
    select mr.id           as mrid,
           u.first         as first,
           u.profile_pic   as profile_pic,
           u.last          as last,
           u.email         as email,
           c.name          as college_name,
           m.offer_title   as offer_title,
           m.offer_company as offer_company,
           m.id            as mid,
           u.id            as uid,
           mr.status       as status,
           mr.start_time   as start_time
    from users u,
         mentor_info m,
         college c,
         mentor_rel mr
    where m.uid = u.id
      and m.cid = c.id
      and mr.mid = m.id
      and mr.uid = $1;
  `;
  const {rows} = await db.query(query, [uid]);
  return rows;
};

exports.getRelMentees = async (uid) => {
  const query = `
    select mr.id         as mrid,
           u.first       as first,
           u.profile_pic as profile_pic,
           u.last        as last,
           u.email       as email,
           u.id          as uid,
           mr.status     as status,
           mr.start_time as start_time,
           mr.note       as note
    from users u,
         mentor_info m,
         mentor_rel mr
    where mr.uid = u.id
      and mr.mid = m.id
      and m.uid = $1;
  `;
  const {rows} = await db.query(query, [uid]);
  return rows;
};

exports.isMentorMenteeRelated = async (mentor_uid, mentee_uid) => {
  const query = `select *
                 from mentor_rel
                 where mid = (select id from mentor_info where uid = $1) and uid = $2`;
  const {rowCount} = await db.query(query, [mentor_uid, mentee_uid]);
  return rowCount > 0;
};

exports.setMentorConfirm = async (mentor_uid, mrid) => {
  const query = `
    update mentor_rel
    set status = 2
    where id = $1;
  `;
  await db.query(query, [mrid])
};

exports.setMentorDecision = async (mentor_uid, mrid, agreed) => {
  let decision_status = (agreed === 1) ? 1 : 50;
  const query = `
    update mentor_rel
    set status = $2
    where id = $1;
  `;
  await db.query(query, [mrid, decision_status]);
};

exports.setMenteeConfirm = async (uid, mrid) => {
  await db.query(`update mentor_rel
                  set status = 3
                  where id = $1;`, [mrid]);

  const query = `update users
                 set balance = balance + (select service_price
                                          from mentor_rel
                                          where id = $1)
                 where id = (select uid from mentor_info where id = (select mid from mentor_rel where id = $1));
  `;
  await db.query(query, [mrid]);

};


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
  const mentor_result = await db.query(mentor_query, [mid]);
  if (mentor_result.rows.length !== 1) throw new Error("No such mentor found");
  const {mentor_uid, mentor_name} = mentor_result.rows[0];


  // get mentee info
  const mentee_query = `select concat(last, first) as name
                        from users
                        where id = $1;`;
  const mentee_result = await db.query(mentee_query, [uid]);
  if (mentee_result.rows.length !== 1) throw new Error("No such mentee found");
  const mentee_name = mentee_result.rows[0].name;


  return {mentee_name, mentor_uid, mentor_name};
};
