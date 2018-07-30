/**
 * @module model/MentorRelation
 */
const db = require('./pool.js');
const ResourceNotFoundError = require("../error").ResourceNotFoundError;

/**
 *
 * @param mrid Relation ID
 * @returns {Promise<number>} Mentor ID
 */
exports.getMentorIDbyRelationID = async (mrid) => {
  const query = `select mid from mentor_rel where id = $1`;
  const {rows} = await db.query(query, [mrid]);
  return rows[0].mid;
};

/**
 *
 * @param mrid Relation ID
 * @returns {Promise<number>} User ID of the mentee
 */
exports.getMenteeUserIDbyRelationID = async (mrid) => {
  const query = `select uid from mentor_rel where id = $1`;
  const {rows} = await db.query(query, [mrid]);
  return rows[0].uid;
};

/**
 *
 * @param mentor_uid
 * @param mentee_uid
 * @returns {Promise<boolean>} Whether mentor and mentee is related
 */
exports.isMentorMenteeRelated = async (mentor_uid, mentee_uid) => {
  const query = `select * from mentor_rel where mid = (select id from mentor_info where uid = $1) and uid = $2`;
  const {rowCount} = await db.query(query, [mentor_uid, mentee_uid]);
  return rowCount > 0;
};
/**
 *
 * @param uid
 * @returns {Promise<*>} A list of Mentors
 */
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

/**
 *
 * @param uid
 * @returns {Promise<*>} A list of Mentees
 */
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

/**
 *
 * @param mrid Relation ID
 */
exports.setMentorConfirm = async (mrid) => {
  const query = `update mentor_rel set status = 2 where id = $1;`;
  await db.query(query, [mrid])
};

/**
 *
 * @param mrid Relation ID
 * @param agreed
 */
exports.setMentorDecision = async (mrid, agreed) => {
  let decision_status = (agreed === 1) ? 1 : 50;
  const query = `update mentor_rel set status = $2 where id = $1; `;
  await db.query(query, [mrid, decision_status]);
};

/**
 *
 * @param mrid Relation ID
 */
exports.setMenteeConfirm = async (mrid) => {
  await db.query(`update mentor_rel set status = 3 where id = $1;`, [mrid]);

  const query = `update users
                 set balance = balance + (select service_price from mentor_rel where id = $1)
                 where id = (select uid from mentor_info where id = (select mid from mentor_rel where id = $1));
  `;
  await db.query(query, [mrid]);

};

/**
 *
 * @param uid
 * @param mid
 * @param service_name
 * @param service_price
 * @param note
 * @returns {Promise<{mentee_name, mentor_uid, mentor_name}>}
 */
exports.addMentorShip = async (uid, mid, service_name, service_price, note) => {
  // insert to mentor_rel
  const insert_query = `insert into mentor_rel (uid, mid, service_name, service_price, start_time, status, note)
                        values ($1, $2, $3, $4, now(), 20, $5);`;
  await db.query(insert_query, [uid, mid, service_name, service_price, note]);


  // get mentor info
  const mentor_query = `select m.uid as mentor_uid, concat(u.last, u.first) as mentor_name
                        from mentor_info m, users u
                        where m.uid = u.id  and m.id = $1`;
  const mentor_result = await db.query(mentor_query, [mid]);
  if (mentor_result.rows.length !== 1) throw new ResourceNotFoundError();
  const {mentor_uid, mentor_name} = mentor_result.rows[0];


  // get mentee info
  const mentee_query = `select concat(last, first) as name from users where id = $1;`;
  const mentee_result = await db.query(mentee_query, [uid]);
  if (mentee_result.rows.length !== 1) throw new ResourceNotFoundError();
  const mentee_name = mentee_result.rows[0].name;


  return {mentee_name, mentor_uid, mentor_name};
};
