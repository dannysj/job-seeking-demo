const db = require('./model/pool.js');

exports.patch = () => {
    db.query(`alter table mentor_info add bios jsonb`).catch(e => console.log(e));
    db.query(`alter table news add delta jsonb null`).catch(e => console.log(e));
};

exports.reset = function () {
  const query = `
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
      isactivated boolean,
      access_token varchar(255)
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
    create table if not exists major (
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
      status int, -- 20 for initialized; rejected: 50; approved: 1 for in progress, 2 for mentor confirmation, 3 for mentee confirmation
      note text
    );
    create table if not exists follow_rel(
      follower_uid int references users(id),
      followee_uid int references users(id),
      timestamp timestamp
    );
    
    drop table if mentor_comment_like;
    create table mentor_comment_like(
      comment_id int not null references mentor_comment(id),
      uid int not null references users(id),
      unique (comment_id, uid)
    );
    `;
  db.query(query, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('DB Reset Successful!');
  });
};
