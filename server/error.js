module.exports.AppError = class AppError extends Error {
  constructor(message, code = 1) {
    super();
    this.message = message;
    this.code = code;
  }
};

/**
 * Access Token is invalid or expired
 */
module.exports.InvalidAccessTokenError = class InvalidAccessTokenError extends AppError {
  constructor() {
    super('登录信息已过期，请重新登录', 44);
  }
};

/**
 * Verification Code is invalid or expired
 */
module.exports.InvalidVerificationCodeError = class InvalidVerificationCodeError extends AppError {
  constructor() {
    super('验证码错误', 44);
  }
};

/**
 * Trying to get/change something that is not supposed to do
 */
module.exports.PermissionError = class PermissionError extends AppError {
  constructor() {
    super('您没有权限，禁止操作');
  }
};

/**
 * When User/Mentor/Mentee/News... is not found
 */
module.exports.ResourceNotFoundError = class ResourceNotFoundError extends AppError {
  constructor() {
    super('找不到对象');
  }

};

module.exports.InvalidArgumentError = class InvalidArgumentError extends AppError {
  constructor() {
    super('参数不正确');
  }
};