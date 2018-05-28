create table if not exists mentor_comment(
      id  serial not null
          constraint mentor_comment_id_pk
          primary key,
      mid int references mentor_info(id),
      author varchar(255) default '' :: character varying,
      text   varchar(255) default '' :: character varying,
      time_added   timestamp default now()
);