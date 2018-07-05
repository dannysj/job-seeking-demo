const nodemailer = require('nodemailer');
const config = require('../server/_config.js');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config.mail_config);

exports.sendEmail = (dest, subject, text, html, callback) => {
  // setup e-mail data
  let mailOptions = {
    from: '"同行平台" <' + config.mail_config.auth.user + '>', // sender address
    to: dest, // list of receivers
    subject: subject, // Subject line
    text: text, // plaintext body
    html: html// html body
  };


  // send mail with defined transport object
  // TODO Use PROMISE to handle this GOD DAMN callback cascade
  transporter.sendMail(mailOptions, (error, info) => {
    if(callback) {
      callback(error, info);
    }
  });
}

exports.sendWelcomeEmail = (dest, link, callback) => {
  this.sendEmail(dest, '欢迎您使用同行平台', link, `亲爱的用户您好：<br>
    感谢您注册使用同行平台，希望能和您一起在这里度过美好的时光！<br>
    <a href='`+link+`'>点击此处</a> 即可完成邮箱验证。<br>
    若无法点击，请使用此链接: `+link+`<br>
    如遇到问题可联系同行平台客服助手微信，微信号：tongxingplatform<br>`, callback);
}
