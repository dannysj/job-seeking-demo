module.exports = {
  ...require('./db/admin.js'),
  ...require('./db/apply_mentor.js'),
  ...require('./db/login_signup.js'),
  ...require('./db/news.js'),
  ...require('./db/order.js'),
  ...require('./db/system.js'),
  ...require('./db/user_info.js'),
  ...require('./db/view_mentor.js')
};