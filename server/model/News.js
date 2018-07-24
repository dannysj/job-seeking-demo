const db = require('./pool.js');

exports.createNews = async (news) => {
  const query = `insert into news (author_id, publish_time, type, title, thumbnail, content, delta)
                 values ($1, now(), $2, $3, $4, $5, $6) returning id;`;
  const {rows} = await db.query(query, [news.author_id, news.type, news.title, news.thumbnail, news.content, news.delta]);
  return rows[0].id;
};

exports.getNewsDetail = async (nid) => {
  const query = `
    select n.title                                   as title,
           u.first                                   as author_first,
           u.last                                    as author_last,
           u.profile_pic                             as profile_pic,
           u.cover                                   as author_cover,
           n.type                                    as type,
           to_char(n.publish_time, 'DD Mon HH24:MI') as publish_time,
           n.thumbnail                               as thumbnail,
           n.content                                 as content,
           n.delta                                   as delta,
           n.author_id                               as author_id
    from news n,
         users u
    where n.author_id = u.id
      and n.id = $1`;
  const {rows} = await db.query(query, [nid]);
  return rows[0];
};

exports.getNewsList = async (batch_size, batch_num) => {
  const query = `select n.*, to_char(n.publish_time, 'DD Mon HH24:MI') as date, u.first as first, u.last as last
                 from news n,
                      users u
                 where n.author_id = u.id
                 order by n.publish_time desc
                 limit $2
                 offset $1;`;
  const {rows} = await db.query(query, [batch_num * batch_size, batch_size]);
  return rows;
};
