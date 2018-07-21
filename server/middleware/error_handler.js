const AppError = require('../error').AppError;

const error_handler = (err, req, res, next) => {
  console.log(err.stack);
  if (err instanceof AppError) {
    res.json({code: err.code, errMsg: err.message});
    return;
  }

  const errMsg = err.message ? err.message : err;
  res.json({code: 1, errMsg});
};

module.exports = error_handler;