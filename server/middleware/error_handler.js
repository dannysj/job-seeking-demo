const error_handler = (err, req, res, next) => {
  if (!err) {
    next(err);
  }

  if (!err.message) {
    res.json({code: 1, errMsg: err});
    next(err);
    return;
  }

  const errMsg = err.message;
  switch (errMsg) {
    case 'Access denied': {
      res.status(403);
      res.json({error: 'Access Denied'});
      break;
    }

    case 'Access token invalid': {
      res.json({code: 44, errMsg});
      break;
    }

    default: {
      res.json({code: 1, errMsg});
      break;
    }
  }

  next(err);
};

module.exports = error_handler;