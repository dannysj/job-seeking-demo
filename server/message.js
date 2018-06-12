module.exports = class MessageDispatch {
  // This class deals with function related to System Message.
  // It reads notification from db, and also set notification (another type of message) to is_read
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
