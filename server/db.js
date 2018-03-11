var self = this;
var pg = require('pg');
var uuidv4 = require('uuid/v4');
var config = require('./config.js');
var db = new pg.Pool(config.db);

exports.reset = function(){
  // TODO: removal of all tables
  var query = `
    drop table if exists user_industry;
    drop table if exists industry;
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
      email varchar(255),
      cover text
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
      uid int references users(id),
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
  `;
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
  var query = 'select * from users where ismentor=true;';
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
  var query = `insert into users (first,last,password,email,profile_pic,register_date) values($1,$2,$3,$4,'/img/sample_profile.jpg',now());`;
  db.query(query, [user.first, user.last, user.password, user.email], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null);
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

exports.createMentorApp = (mentor_info, callback) => {
  uid int references users(id),
  isapproved boolean,
  submission_time timestamp,
  approval_time timestamp,
  cid int references college(id),
  offer_title varchar(255),
  offer_company varchar(255),
  bio text,
  service jsonb,
  resume text
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
    mentor_info.services,
    mentor_info.resume], (err, result)=>{
    if(err){
      callback(err);
      return;
    }
    callback(null);
  });
}
