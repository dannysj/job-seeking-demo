const db = require('./pool.js');

exports.approveMentor = async (uid, mid) => {
  const query = `update users
                 set ismentor = true
                 where id = (select uid from mentor_info where id = $1);`;
  await db.query(query, [mid]);
};

exports.disapproveMentor = async (uid, mid) => {
  const query = `delete
                 from mentor_info
                 where id = $1;`;
  await db.query(query, [mid])
};

exports.getMentorApplications = async () => {
  const query = `
    select u.first         as first,
           u.profile_pic   as profile_pic,
           u.last          as last,
           c.name          as college_name,
           m.offer_title   as offer_title,
           m.offer_company as offer_company,
           m.id            as mid,
           u.id            as uid
    from users u,
         mentor_info m,
         college c
    where m.uid = u.id
      and m.cid = c.id
      and u.ismentor = false;
  `;
  const {rows} = db.query(query);
  return rows;
};

exports.verifyInfoCompletion = async (uid) => {
  const query = `select (major is not null
                         and wechat is not null) as res
                 from users
                 where id = $1;`;
  const {rows} = await db.query(query, [uid]);
  if (rows.length !== 1) throw new Error("No such user found");
  return rows[0].res;
};

exports.createMentorApp = async (mentor_info) => {
  const query = `insert into mentor_info (uid,
                                          isapproved,
                                          submission_time,
                                          cid,
                                          offer_title,
                                          offer_company,
                                          bio,
                                          bios,
                                          service,
                                          num_weekly_slots)
                 values ($1, false, now(), $2, $3, $4, $5, $6, $7, $8);`;
  await db.query(query,
    [mentor_info.uid,
      mentor_info.cid,
      mentor_info.offer_title,
      mentor_info.offer_company,
      mentor_info.bio,
      JSON.stringify(mentor_info.bios),
      JSON.stringify(mentor_info.service),
      mentor_info.num_weekly_slots])
};

exports.editMentorInfo = async (mentor_info) => {
  const query = `update mentor_info
                 set cid              = $1,
                     offer_title      = $2,
                     offer_company    = $3,
                     bio              = $4,
                     bios             = $5,
                     service          = $6,
                     num_weekly_slots = $7
                 where uid = $8;`;
  await db.query(query,
    [mentor_info.cid,
      mentor_info.offer_title,
      mentor_info.offer_company,
      mentor_info.bio,
      JSON.stringify(mentor_info.bios),
      JSON.stringify(mentor_info.service),
      mentor_info.num_weekly_slots,
      mentor_info.uid]);
};


const mentorSelectQuery = `
  select u.id                       as uid,
         u.first                    as first,
         u.last                     as last,
         u.dob                      as dob,
         u.profile_pic              as profile_pic,
         u.resume                   as resume,
         u.id                       as uid,
         c.id                       as cid,
         c.name                     as college_name,
         m.id                       as mid,
         m.offer_title              as offer_title,
         m.offer_company            as offer_company,
         m.bio                      as bio,
         m.bios                     as bios,
         m.service                  as service,
         m.num_weekly_slots         as num_weekly_slots,
         (m.num_weekly_slots - (select count(*) from mentor_rel where mid = m.id
                                                                  and status = 1
                                                                  and now() - start_time < '1 week')
             ) :: integer           as num_availability,
         (select json_agg(
                     json_build_object(
                         'id', comment.id,
                         'text', comment.text,
                         'reply', comment.reply,
                         'time_added', to_char(comment.time_added, 'DD Mon HH24:MI'),
                         'first', u.first,
                         'last', u.last,
                         'profile_pic', u.profile_pic,
                         'like',
                         (select COUNT(*) from mentor_comment_like where mentor_comment_like.comment_id = comment.id)
                     )
                     order by time_added
                     )
          from mentor_comment comment,
               users u
          where comment.mid = $1
            and comment.uid = u.id) as comments

  from users u,
       mentor_info m,
       college c

`;

exports.getMentorDetailByUid = async (uid) => {
  const query = mentorSelectQuery + ` where m.uid = u.id and m.cid = c.id and u.id = $1;`;
  const {rows} = await db.query(query, [uid]);
  return rows[0];
};


exports.getMentorDetail = async (mid) => {
  const query = mentorSelectQuery + ` where m.uid = u.id and m.cid = c.id and m.id = $1;`;
  const {rows} = await db.query(query, [mid]);
  return rows[0];
};


exports.getMentorList = async (filter) => {
  const query = `
    select u.first         as first,
           u.profile_pic   as profile_pic,
           u.last          as last,
           u.major         as major,
           c.name          as college_name,
           m.offer_title   as offer_title,
           m.offer_company as offer_company,
           m.id            as mid,
           u.id            as uid
    from users u,
         mentor_info m,
         college c
    where m.uid = u.id
      and m.cid = c.id
      and u.ismentor = true;
  `;
  const {rows} = await db.query(query);
  rows.filter(e => !e.major).forEach(e => e.major = []);
  return rows;
};