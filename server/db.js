var self = this;
var pg = require('pg');
var uuidv4 = require('uuid/v4');
var config = require('./config.js');
var db = new pg.Pool(config.db);

exports.reset = function(){
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
      email varchar(255)
    );
    create table if not exists industry (
      id serial unique primary key,
      name varchar(255)
    );
    create table if not exists user_industry (
      uid int references users(id),
      iid int references industry(id)
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
  var query = `insert into users (first,last,password,email,profile_pic) values($1,$2,$3,$4,'/img/sample_profile.jpg');`;
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
}
