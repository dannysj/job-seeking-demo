const AppError = require('../error').AppError;

const error_handler = (err, req, res, next) => {
  if (!(err instanceof AppError)) console.error(`System ${err.stack}`);

  const code = err.code ? err.code : 1;
  const message = err instanceof AppError ? err.message : '未知服务器错误';
  res.status(403).json({code, message});
};

module.exports = error_handler;