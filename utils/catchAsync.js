/* We want to export this function:
* const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next)
      .catch(err => {
        next(err);
      });
  }
};
* So it would be:*/

module.exports = fn => {
  return (req, res, next) => {
    /* fn(req, res, next)
      .catch(err => {
        next(err);
      }); */

    fn(req, res, next)
      .catch(next);
  }
};





