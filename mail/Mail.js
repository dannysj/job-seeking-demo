/**
 * @module Mail
 */

const nodemailer = require('nodemailer');
const config = require('../server/config.js');
const transporter = nodemailer.createTransport(config.mail_config);

/**
 *
 * @param email receiver's email address
 * @param link activation link
 */
exports.sendWelcomeEmail = async (email, link) => {
  const subject = '欢迎您使用同行平台';
  const text = link;
  const html = `
    感谢您注册使用同行平台，希望能和您一起在这里度过美好的时光！<br>
    <a href='` + link + `'>点击此处</a> 即可完成邮箱验证。<br>
    若无法点击，请使用此链接: ` + link + `<br>`;

  await sendEmailHelper(email, subject, text, html);
};

/**
 *
 * @param email receiver's email address
 * @param newPassword new password generated
 */
exports.sendPasswordResetEmail = async (email, newPassword) => {
  const subject = '密码重置';
  const text = '密码重置';
  const html = `
    感谢您使用同行平台，希望能和您一起在这里度过美好的时光！<br>
    您的新密码是"${newPassword}", 请尽快修改默认密码`;

  await sendEmailHelper(email, subject, text, html);
};

/**
 *
 * @param email receiver's email address
 * @param verificationCode Verification Code
 */
exports.sendVerificationCode = async (email, verificationCode) => {
  const subject = '欢迎您使用同行平台';
  const text = '验证码';
  const html = `
    感谢您使用使用同行平台，希望能和您一起在这里度过美好的时光！<br>
    您的验证码是"${verificationCode}"。 <br>`;

  await sendEmailHelper(email, subject, text, html);
};


/**
 *
 * @param email receiver's email address
 * @param message in-site message
 */
exports.sendMessageEmail = async (email, message) => {
  const subject = '同行平台系统通知';
  const text = '您有新的通知请查看';
  const html = `
    您有一条来自同行平台的通知<br>
    通知内容：<br>
    ${message}<br>
    您可以前往同行平台查看<br>`;

  await sendEmailHelper(email, subject, text, html);
};

const sendEmailHelper = async (dest, subject, text, html) => {
  const before = `亲爱的用户您好：<br>`;
  const after = `如遇到问题可联系同行平台客服助手微信，微信号：tongxingplatform<br>`;
  html =  before + html + after;

  const mailOptions = {
    from: '"同行平台" <' + config.mail_config.auth.user + '>', // sender address
    to: dest, // list of receivers
    subject: subject, // Subject line
    text: text, // plaintext body
    html: html// html body
  };

  await transporter.sendMail(mailOptions);

  console.log('Email for message sent for: ' + dest);
};