'use strict';

const AppError = require('./../utils/appError');

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }


  // B) RENDERED WEBSITE
  console.error('ERROR 🧨', err);
  // we want to RENDER an error page
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    /* Operational errors that we trust(so we CAN send message to the client, it won't harm us to expose the cause of error to them): */
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    /* Programming or unknown errors and we don't want to leak details of error to the client: */
    // 1) Log error
    console.error('ERROR 🧨', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }

  // B) RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }

  console.error('ERROR 🧨', err);

  // if it is a programming or unknown error for rendered website:
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  /* Instructor's code:
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    ...*/
  /* The value of field which is duplicated: */
  const value = err.keyValue.name;
  const duplicatedField = Object.keys(err).find(key => err.keyValue[key] === value);
  console.log(duplicatedField);
  const message = `Duplicate value ${value} in ${duplicatedField} field. Pleas use another value for that field.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401); // this will implicitly return whatever we put after => sign.

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again', 401);

//GLOBAL ERROR HANDLER MIDDLEWARE:
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {

    /* If the condition of this else if() statement would be false the request with weird id or other mongoose non operational errors,
    takes a lot of time and the user don't get the response.

    I used err.name in the condition of if (err.name === 'CastError') , because error object which is the cloned version of
    original err object, doesn't have the name property and therefore that condition always would be false because error.name would
    be undefined. We're currently doing a shallow copy of err object, but even if you do a deep copy of err, name property won't
    copied into error object. I don't know why error object doesn't get the name property from err object.
    FIXME: console.log(error.name); returns undefined. error.name must be used in comparison*/
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
      /* We're reassigning the error variable. So we must declare it with let in the beginning. */
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    if (err.name === 'JsonWebTokenError') error = handleJWTError();

    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }

};






