const db = require('./_dbPool.js');

exports.createMessage = (origin, dest, type, content, callback) => {
  const query = `
    insert into message (origin,destination,type,content,timestamp,is_read)
    values($1,$2,$3,$4,now(),false);
  `;
  db.query(query, [origin, dest, type, content], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

exports.sendSystemMessage = (dest, content, callback) => {
  this.createMessage(0, dest, 1, content, (err)=>{
    if(callback)
      callback(err);
  });
};

exports.getNotificationsByUid = (uid, callback) => {
  const query = `select * from message where origin=0 and destination=$1 order by timestamp desc;`;
  db.query(query, [uid], (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, result.rows);
  });
};

exports.setNotificationsAsRead = (uid, callback) => {
  const query = `update message set is_read=true where origin=0 and destination=$1;`;
  db.query(query, [uid], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (callback)
      callback(err);
  });
};