module.exports = class MessageDispatch {
  constructor(db) {
    this.db = db;
  }

  sendSystemMessage(dest, content, callback){
    this.db.createMessage(0, dest, 1, content, (err)=>{
      if(callback)
        callback(err);
    });
  }

  getNotifications(uid, callback) {
    this.db.getNotificationsByUid(uid, callback);
  }

  readNotifications(uid, callback){
    this.db.setNotificationsAsRead(uid, callback);
  }
};
