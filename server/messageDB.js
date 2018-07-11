const db = require('./_dbPool.js');
const mailingDispatch = require('../mailing/mailingDispatch');

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

    let query_user_email = `select email from users where id=$1;`;
    db.query(query_user_email, [dest], (err, result) => {
      if (err || result.rows.length != 1) {
        console.log('DB Error for sending email for message: '+err);
        return;
      }

      let email = result.rows[0].email;
      console.log('FUCKKKKKKKKK! '+email);

      mailingDispatch.sendEmail((email, '同行平台系统通知', '您有新的通知请查看', `亲爱的用户您好：<br>
        您有一条来自同行平台的通知<br>
        通知内容：<br>
        ${content}<br>
        您可以前往同行平台查看<br>
        如遇到问题可联系同行平台客服助手微信，微信号：tongxingplatform<br>`, (err, info) => {
          if(err){
            console.log('Unable to send emails for message: '+info);
          }
          else{
            console.log('Email for message sent for: uid' + destination);
          }
        }));
    });

    callback(null);
  });
};

exports.sendSystemMessage = (dest, content, callback) => {
  this.createMessage(0, dest, 1, content, (err)=>{
    if(callback) {
      callback(err);
    }
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
