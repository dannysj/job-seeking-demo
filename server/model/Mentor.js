const db = require('./pool.js');

exports.approveMentor = async (uid, mid) => {
  const query = `update users set ismentor=true where id=(
    select uid from mentor_info where id=$1
  );`;
  await db.query(query, [mid]);
};

exports.disapproveMentor = async (uid, mid) => {
  const query = `delete from mentor_info where id=$1;`;
  await db.query(query, [mid])
};

exports.getMentorApplications = async () => {
  const query = `
    select u.first as first,
      u.profile_pic as profile_pic,
      u.last as last,
      c.name as college_name,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.id as mid,
      u.id as uid
    from users u, mentor_info m, college c
    where m.uid = u.id and m.cid = c.id and u.ismentor = false;
  `;
  const {rows} = db.query(query);
  return rows;
};
