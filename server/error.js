/**
 * @module error
 */

/**
 * Error caused by users
 */
class AppError extends Error {
  constructor(message, code = 1) {
    super();
    this.message = message;
    this.code = code;
  }
}

/**
 * Access Token is invalid or expired
 *
 */
class InvalidAccessTokenError extends AppError {
  constructor() {
    super('登录信息已过期，请重新登录', 44);
  }
}

/**
 * Verification Code is invalid or expired
 */
class InvalidVerificationCodeError extends AppError {
  constructor() {
    super('验证码错误', 44);
  }
}

/**
 * Trying to get/change something that is not supposed to do
 */
class PermissionError extends AppError {
  constructor() {
    super('您没有权限，禁止操作');
  }
}

/**
 *  When argument is missing or invalid
 */
class InvalidArgumentError extends AppError {
  constructor() {
    super('参数不正确');
  }
}

/**
 * See uploadRouter.js
 */
class FileUploadError extends AppError{
  constructor() {
    super('文件上传失败');
  }
}


/**
 * A generic error when Mentor/Mentee/News... is not found
 *
 * If user not found, please use @see{UserNotFoundError}
 */
class ResourceNotFoundError extends AppError {
  constructor() {
    super('找不到对象');
  }
}

/**
 * When user is not found
 */
class UserNotFoundError extends AppError{
  constructor() {
    super('该用户不存在');
  }

}

/**
 * When an email address is already in use
 */
class DuplicateEmailError extends AppError{
  constructor() {
    super('该邮箱地址已被别的账户使用');
  }
}

/**
 * When password does not match the user name
 */
class PasswordIncorrectError extends AppError{
  constructor() {
    super('密码不正确，请重新输入');
  }
}

module.exports = {
  AppError,
  InvalidAccessTokenError,
  InvalidVerificationCodeError,
  PermissionError,
  ResourceNotFoundError,
  InvalidArgumentError,
  FileUploadError,
  DuplicateEmailError,
  PasswordIncorrectError,
  UserNotFoundError
};