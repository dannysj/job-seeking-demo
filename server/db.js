var self = this;
var pg = require('pg');
var uuidv4 = require('uuid/v4');
var config = require('./config.js');
var db = new pg.Pool(config.db);

exports.reset = function(){
  // TODO: removal of all tables
  var query = `
    drop table if exists mentor_rel;
    drop table if exists mentor_info;
    drop table if exists user_industry;
    drop table if exists industry;
    drop table if exists user_college;
    drop table if exists college;
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
      resume text
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
      resume text
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
    var userAccount = result.rows[0];
    userAccount.password = null;
    callback(null, userAccount);
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
      n.type as type,
      n.publish_time as publish_time,
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
  var query = `select * from news order by publish_time desc limit $2 offset $1;`;
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
      resume)
    values($1,false,now(),$2,$3,$4,$5,$6,$7);`
  db.query(query,
    [mentor_info.uid,
    mentor_info.cid,
    mentor_info.offer_title,
    mentor_info.offer_company,
    mentor_info.bio,
    JSON.stringify(mentor_info.services),
    mentor_info.resume], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.getCollegeList = (callback) => {
  var query = `select * from college;`;
  db.query(query, (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.getMentorDetail = (mid, callback) => {
  var query = `
    select u.first as first,
      u.last as last,
      u.dob as dob,
      u.profile_pic as profile_pic,
      c.name as college_name,
      m.offer_title as offer_title,
      m.offer_company as offer_company,
      m.bio as bio,
      m.service as service,
      m.resume as resume
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

exports.getApplicationStatus = (uid, callback) => {
  var query = `select u.ismentor,m.id as ismentor from users u, mentor_info m where m.uid=u.id and u.id=$1;`;
  db.query(query, [uid], (err, result) => {
    if(err){
      callback(err);
      return;
    }
    if(result.rows.length == 0){
      callback(null, 0);
    }
    else{
      callback(null, 1);
    }
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
