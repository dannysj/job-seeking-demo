const AppError = require('../error').AppError;

const error_handler = (err, req, res, next) => {
  if (!(err instanceof AppError)) {
    console.error(`System ${err.stack}`);
    const message = err.message ? err.message : '服务器错误';
    res.json({code: 1, message});
    return;
  }


  res.json({code: err.code, message: err.message});
};

module.exports = error_handler;