module.exports = {
  ...require('./module/admin.js'),        // approve/disapprove mentor, notifications, get mentor applications
  ...require('./module/apply_mentor.js'), // create/edit mentor application, college list, verify info completion
  ...require('./module/login_signup.js'), // create/verify user, verification code
  ...require('./module/mentor_mentee.js'),// getRelMentors, getRelMentees, setConfirm
  ...require('./module/news.js'),         // create/get news
  ...require('./module/order.js'),        // addMentorShip
  ...require('./module/system.js'),       // patch, reset
  ...require('./module/user_info.js'),    // getUserInfo, updateUser, getMajorList
  ...require('./module/view_mentor.js'),   // MentorDetail, MentorComment
  ...require('./module/follow_relation.js') // create follow and followee rel
};