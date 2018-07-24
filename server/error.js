class AppError extends Error {
  constructor(message, code = 1) {
    super();
    this.message = message;
    this.code = code;
  }
}

/**
 * Access Token is invalid or expired
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
 * When Mentor/Mentee/News... is not found
 */
class ResourceNotFoundError extends AppError {
   constructor() {
    super('找不到对象');
  }
}

class UserNotFoundError extends AppError{
  constructor() {
    super('该用户不存在');
  }

}

class InvalidArgumentError extends AppError {
  constructor() {
    super('参数不正确');
  }
}

class FileUploadError extends AppError{
  constructor() {
    super('文件上传失败');
  }
}

class DuplicateEmailError extends AppError{
  constructor() {
    super('该邮箱地址已被别的账户使用');
  }
}

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