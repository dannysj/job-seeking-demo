var self = this;
var pg = require('pg');
var uuidv4 = require('uuid/v4');
var config = require('./config.js');
var db = new pg.Pool(config.db);
var fs = require('fs');

exports.patch = () => {
  // Patch mentor_comment
  const sql = fs.readFileSync('./db_patches/mentor_comment.sql').toString();
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Table mentor_comment Created');
  });
};

exports.reset = function(){
  var query = `
    drop table if exists mentor_rel;
    drop table if exists mentor_info;
    drop table if exists user_industry;
    drop table if exists industry;
    drop table if exists user_college;
    drop table if exists college;
    drop table if exists message;
    drop table if exists users;
    create table if not exists users (
      id serial unique primary key,
      first varchar(255),
      last varchar(255),
      dob date,
      profile_pic text,
      register_date date,
      ismentor boolean,
      isadmin boolean,
      password varchar(255),
      email varchar(255) unique,
      major text,
      cover text,
      balance numeric(8,2) default 0.00,
      wechat text,
      resume text,
      isactivated boolean
    );
    create table if not exists message (
      id serial unique primary key,
      origin int, -- Currently not used. Will be used when between-user messaging is implemented
      destination int references users(id),
      type int, -- 1 for text
      content text,
      timestamp timestamp with time zone,
      is_read boolean
    );
    create table if not exists industry (
      id serial unique primary key,
      name varchar(255)
    );
    create table if not exists user_industry (
      uid int references users(id),
      iid int references industry(id)
    );
    create table if not exists college (
      id serial unique primary key,
      name varchar(255)
    );
    create table if not exists user_college (
      uid int references users(id),
      cid int references college(id)
    );
    create table if not exists news (
      id serial unique primary key,
      author_id int references users(id),
      publish_time timestamp,
      title text,
      type int, -- 0 for official article, 1 for peer sharing
      thumbnail text,
      content text
    );
    create table if not exists college (
      id serial unique primary key,
      name varchar(255)
    );
    create table if not exists mentor_info (
      id serial unique primary key,
      uid int unique references users(id),
      isapproved boolean,
      submission_time timestamp,
      approval_time timestamp,
      cid int references college(id),
      offer_title varchar(255),
      offer_company varchar(255),
      bio text,
      service jsonb,
      resume text,
      num_weekly_slots int -- Number of slots available for a week
    );
    create table if not exists mentor_rel(
      id serial unique primary key,
      mid int references mentor_info(id),
      uid int references users(id),
      service_name text,
      service_price numeric(8,2),
      start_time timestamp,
      end_time timestamp,
      status int -- 1 for in progress, 2 for mentor confirmation, 3 for mentee confirmation
    );`;
  db.query(query, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    console.log('DB Reset Successful!');
  });
};

exports.getIndustryList = function(callback){
  var query = 'select * from industry;';
  db.query(query, function(err, result){
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};


exports.getMentorList = function(filter, callback){
  var query = `
    select u.first as first,
      u.profile_pic as profile_pic,
      u.last as last,
      u.major as major,
      c.name as college_name,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.id as mid
    from users u, mentor_info m, college c
    where m.uid = u.id and m.cid = c.id and u.ismentor = true;
  `;
  db.query(query, function(err, result){
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

// TODO: check and return proper error first if the user's email is duplicated
exports.createUser = function(user, callback){
  var query = `insert into users (first,last,password,email,profile_pic,register_date,isadmin,ismentor) values($1,$2,$3,$4,'/img/sample_profile.jpg',now(),false,false) returning *;`;
  db.query(query, [user.first, user.last, user.password, user.email], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    var userInfo = result.rows[0];
    userInfo.password = null;
    callback(null, userInfo);
  });
};

exports.verifyUser = function(user, callback){
  console.log(user.email);
  var query = `select * from users where email=$1 and password=$2;`;
  db.query(query, [user.email, user.password], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    if(result.rows.length==0){
      callback('No such email found');
      return;
    }
    var userAccount = result.rows[0];
    userAccount.password = null;
    callback(null, userAccount);
  });
};

exports.getUserInfo = (uid, callback) => {
  var query = `select * from users where id=$1;`;
  db.query(query, [uid], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    if(result.rows.length==0){
      callback('No such email found');
      return;
    }
    let userAccount = result.rows[0];
    userAccount.password = null;
    let query = `select count(*) as count from message where is_read=false and destination=$1`;
    db.query(query, [uid], (err, result)=>{
      if(err){
        callback(err);
        return;
      }
      userAccount.num_notifications = result.rows[0].count;
      callback(null, userAccount);
    });
  });
}

exports.createNews = (news, callback) => {
  var query = `insert into news (author_id,publish_time,type,title,thumbnail,content) values($1,now(),$2,$3,$4,$5) returning id;`;
  db.query(query, [news.author_id,news.type,news.title,news.thumbnail,news.content], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows[0].id);
  });
};

exports.getNewsDetail = (nid, callback) => {
  var query = `
    select n.title as title,
      u.first as author_first,
      u.last as author_last,
      u.profile_pic as profile_pic,
      u.cover as author_cover,
      n.type as type,
      to_char(n.publish_time,'DD Mon HH24:MI') as publish_time,
      n.thumbnail as thumbnail,
      n.content as content
    from news n, users u
    where n.author_id = u.id
      and n.id = $1`;
  db.query(query, [nid], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows[0]);
  });
};

exports.getNewsList = (batch_size, batch_num, callback) => {
  var query = `select n.*, to_char(n.publish_time,'DD Mon HH24:MI') as date, u.first as first, u.last as last from news n, users u where n.author_id = u.id  order by n.publish_time desc limit $2 offset $1;`;
  db.query(query, [batch_num*batch_size,batch_size], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.updateUser = (data, callback) => {
  var query = `update users set `+data.attr+`=$1 where id=$2;`;
  db.query(query, [data.val,data.uid], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.addUserVerificationCode = (email, verification_code, callback) => {
  let query = `
  insert into user_verification (uid, verification_code) values ((select id from users where email = $1),$2)
    on CONFLICT (uid) do update set verification_code = $2, time_added=now() returning * ;`;
  db.query(query, [email, verification_code], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows[0]);
  });
};

exports.confirmVerification = (verification_code, callback) => {
  let query = `update users set isactivated=true where id=(select uid from user_verification where verification_code=$1) returning id;`;
  db.query(query, [verification_code], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows[0].id);
  });
};

exports.verifyInfoCompletion = (uid, callback) => {
  let query = `select (major is not null
    and wechat is not null
    and resume is not null) as res
    from users where id=$1;`;
  db.query(query, [uid], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows[0].res)
  });
}

exports.createMentorApp = (mentor_info, callback) => {
  var query = `insert into mentor_info
    (uid,
      isapproved,
      submission_time,
      cid,
      offer_title,
      offer_company,
      bio,
      service,
      num_weekly_slots)
    values($1,false,now(),$2,$3,$4,$5,$6,$7);`
  db.query(query,
    [mentor_info.uid,
    mentor_info.cid,
    mentor_info.offer_title,
    mentor_info.offer_company,
    mentor_info.bio,
    JSON.stringify(mentor_info.services),
    mentor_info.num_weekly_slots], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.editMentorInfo = (mentor_info, callback) => {
  var query = `update mentor_info set
      cid=$1,
      offer_title=$2,
      offer_company=$3,
      bio=$4,
      service=$5,
      num_weekly_slots=$6 where uid=$7;`
  db.query(query,
    [mentor_info.cid,
    mentor_info.offer_title,
    mentor_info.offer_company,
    mentor_info.bio,
    JSON.stringify(mentor_info.services),
    mentor_info.num_weekly_slots,
    mentor_info.uid], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.getCollegeList = (search, callback) => {
  var query = `select id as value, name as text from college where UPPER(name) like UPPER($1) LIMIT 15;`;
  db.query(query, ['%' + search + '%'], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.getMentorDetail = (mid, callback) => {
  var query = `
    select u.id as uid,
      u.first as first,
      u.last as last,
      u.dob as dob,
      u.profile_pic as profile_pic,
      u.resume as resume,
      c.name as college_name,
      m.id as mid,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.bio as bio,
      m.service as service,
      m.num_weekly_slots as num_weekly_slots,
      m.num_weekly_slots - (select count(*) from mentor_rel
        where mid=m.id and now()-start_time<'1 week') as num_availability
    from users u, mentor_info m, college c
    where m.uid = u.id and m.cid = c.id and m.id = $1;
  `;
  db.query(query, [mid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows[0]);
  });
};

exports.getMentorComment = (mid, callback) => {
  const query = `select
    c.id as id,
    c.mid as mid,
    to_char(c.time_added,'DD Mon HH24:MI') as time_added,
    c.text as text,
    c.id as uid,
    c.reply as reply,
    u.first as first,
    u.last as last,
    u.profile_pic as profile_pic
    from users u, mentor_comment c
    where c.mid=$1 and c.uid=u.id;`;
  db.query(query, [mid], function(err, result){
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.createMentorComment = (comment, callback) => {
  const query = `insert into mentor_comment(
    mid,
    text,
    uid)
    values($1, $2, $3)
  `;
  db.query(query,
    [
      comment.mid,
      comment.text,
      comment.uid,
    ],
    (err, result)=>{
      if(err){
        callback(err);
        return;
      }
      callback(null);
    });
};

exports.createMentorReply = (comment, callback) => {
  const query = `update mentor_comment set reply = $2 where id=$1`;
  db.query(query,
    [
      comment.id,
      comment.reply
    ],
    (err, result)=>{
      if(err){
        callback(err);
        return;
      }
      callback(null);
    });
};
  exports.getMentorDetailByUid = (uid, callback) => {
  var query = `
    select u.id as uid,
      u.first as first,
      u.last as last,
      u.dob as dob,
      u.profile_pic as profile_pic,
      u.resume as resume,
      u.ismentor as ismentor,
      c.name as college_name,
      c.id as cid,
      m.id as mid,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.bio as bio,
      m.service as service,
      m.num_weekly_slots as num_weekly_slots
    from users u, mentor_info m, college c
    where m.uid = u.id and m.cid = c.id and u.id = $1;
  `;
  db.query(query, [uid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows[0]);
  });
};

exports.getMentorApplications = (callback) => {
  var query = `
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
  db.query(query, (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.approveMentor = (uid, mid, callback) => {
  console.log(uid);
  var query = `update users set ismentor=true where id=$1;`;
  db.query(query, [uid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.disapproveMentor = (uid, mid, callback) => {
  var query = `delete from mentor_info where id=$1;`;
  db.query(query, [mid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.addMentorShip = (uid, mid, service_name, service_price, callback) => {
  var query = `insert into mentor_rel (uid, mid, service_name, service_price, start_time, status) values(
    $1,$2,$3,$4,now(),1
  );`;
  db.query(query, [uid, mid, service_name, service_price], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.getRelMentors = (uid, callback) => {
  var query = `
  select u.first as first,
    u.profile_pic as profile_pic,
    u.last as last,
    u.email as email,
    c.name as college_name,
    m.offer_title as offer_title,
    m.offer_company as offer_company,
    m.id as mid,
    u.id as uid,
    mr.status as status,
    mr.start_time as start_time
  from users u, mentor_info m, college c, mentor_rel mr
  where m.uid = u.id and m.cid = c.id and mr.mid=m.id and mr.uid=$1;
  `;
  db.query(query, [uid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.getRelMentees = (uid, callback) => {
  var query = `
  select u.first as first,
    u.profile_pic as profile_pic,
    u.last as last,
    u.email as email,
    u.id as uid,
    mr.status as status,
    mr.start_time as start_time
  from users u, mentor_info m, mentor_rel mr
  where mr.uid=u.id and mr.mid=m.id and m.uid=$1;
  `;
  db.query(query, [uid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.setMentorConfirm = (mentor_uid, mentee_uid, callback)=>{
  var query = `
    update mentor_rel set status=2 where uid=$2 and mid=(
      select id from mentor_info where uid=$1
    );
  `;
  db.query(query, [mentor_uid, mentee_uid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.setMenteeConfirm = (uid, mid, callback)=>{
  var query = `
    update mentor_rel set status=3 where uid=$1 and mid=$2;
    `;
  db.query(query, [uid, mid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    var query = `update users set balance=balance+(
      select service_price from mentor_rel where uid=$1 and mid=$2
    ) where id=(select uid from mentor_info where id=$2);
    `
    db.query(query, [uid, mid], (err, result)=>{
      if(err){
        callback(err);
        return;
      }
      callback(null);
    });
  });

};

exports.setActivationLink = (uid, code, callback)=>{
  // TODO: code
  var query = `
    insert into user_act_rel
    (id, isactivated, code)
    values($1, false, $2)
  `;
  db.query(query, [uid, code], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.activateAccount = (code, callback)=>{
  var query = `
    update users set isactivated=true where id=(
      select
    );
    delete from user_act_rel where code=$1;
    `;
  db.query(query, [code], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.createMessage = (origin, dest, type, content, callback) =>{
  var query = `
    insert into message (origin,destination,type,content,timestamp,is_read)
    values($1,$2,$3,$4,now(),false);
  `;
  db.query(query, [origin, dest, type, content], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
}

exports.getNotificationsByUid = (uid, callback)=>{
  let query = `select * from message where origin=0 and destination=$1 order by timestamp desc;`;
  db.query(query, [uid], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
}

exports.setNotificationsAsRead = (uid, callback) => {
  let query = `update message set is_read=true where origin=0 and destination=$1;`;
  db.query(query, [uid], (err, result)=>{
    if(err){
      console.log(err);
    }
    if(callback)
      callback(err);
  });
}

exports.checkActivation = (code, callback)=>{
var query = `
  select * from user_act_rel where code=$1;
  `;
db.query(query, [code], (err, result) => {
  if(err){
    // means the account has been activated.
    callback(null);
    return;
  }
  // else,
  // TODO:
  callback(err);
});
};
