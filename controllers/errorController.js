'use strict';

const AppError = require('./../utils/appError');

/* In this file, we just gonna export this function. Because other functions would be like helper functions and we won't export
* them */

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });

};

const sendErrorProd = (err, res) => {
  /* Operational errors that we trust: */
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  /* Programming or unknown errors and we don't want to leak details of error to the client: */
  else {
    console.error('ERROR 🧨', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });

  }
};

/* I called the arg of this function err instead of error, because it's kind of standard in express to name errors as err. Although
* we're sending a hard copy of err object which is named error to this function, we named the argument of this function err instead
* of error, because it's a standard in express to name errors, err.
*
* The goal of this function is to convert a weird mongoose CastError to our customized and understandable error by using the
* AppError class.*/
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {

  /* The value of field which is duplicated: */
  const value = err.keyValue.name;
  const duplicatedField = Object.keys(err).find(key => err.keyValue[key] === value);
  console.log(duplicatedField);
  const message = `Duplicate value ${value} in ${duplicatedField} field. Pleas use another value for that field.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  /* We use join('. ') to separate the error messages with a dot and a space between each of them. So it would be:
   <error message1>. <error message2>. <error message3> */
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//GLOBAL ERROR HANDLER MIDDLEWARE:
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {

    /* If the condition of this else if() statement would be false the request with weird id or other mongoose non operational errors,
    * takes a lot of time and the user don't get the response.
    *
    * I used err.name in the condition of if (err.name === 'CastError') , because error object which is the cloned version of
    * original err object, doesn't have the name property and therefore that condition always would be false because error.name would
    * be undefined. We're currently doing a shallow copy of err object, but even if you do a deep copy of err, name property won't
    * copied into error object. I don't know why error object doesn't get the name property from err object.
    * FIXME: console.log(error.name); returns undefined. error.name must be used in comparison*/

    let error = { ...err };

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

    sendErrorProd(error, res);
  }

};






