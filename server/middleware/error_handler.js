const error_handler = (err, req, res, next) => {
  res.json({code: 1, errMsg: err});
  // if (!err.message) {
  //   res.status(403);
  //   res.json({error: 'Unknown Error'});
  // }
  //
  // switch (err.message) {
  //   case 'access denied': {
  //     res.status(403);
  //     res.json({error: 'Access Denied'});
  //     break;
  //   }
  //
  //   case 'DB Error': { // TODO: fixme
  //     res.status(403);
  //     res.json({error: 'Database Error'});
  //     break;
  //   }
  //
  //   default: {
  //     res.status(403);
  //     res.json({error: err.message});
  //   }
  // }

  next(err);
};

module.exports = error_handler;