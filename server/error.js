class AppError extends Error {
  code = 1
}

/**
 * Access Token is invalid or expired
 */
class InvalidAccessTokenError extends AppError {
  code = 44;
  message = '登录信息已过期，请重新登录';
}

/**
 * Trying to get/change something that is not supposed to do
 */
class PermissionError extends AppError{
  message = '您没有权限，禁止操作';
}

/**
 * When User/Mentor/Mentee/News... is not found
 */
class ResourceNotFoundError extends AppError{
  message = '找不到对象'
}

class InvalidArgumentError {
  message = '参数不正确'
}