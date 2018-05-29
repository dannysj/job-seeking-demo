create table if not exists mentor_comment
(
  id          serial  not null
    constraint mentor_comment_id_pk
    primary key,
  mid         integer
    constraint mentor_comment_mid_fkey
    references mentor_info,
  author      varchar(255) default '' :: character varying,
  text        varchar(255) default '' :: character varying,
  time_added  timestamp    default now(),
  uid         integer not null
    constraint mentor_comment_users_id_fk
    references users,
  profile_pic varchar(255)
);

