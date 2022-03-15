const mongoose = require('mongoose');

// Let errorHandler figure out the error type and set the status code when possible
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : determineStatusCode(err); 

  res.status(statusCode).json({ 
    ErrorMessage: err.message,
    Stack: process.env.NODE_ENV === 'production' ? null : err.stack 
  });
}

// not pretty but more for logging purposes
const determineStatusCode = (err) => {
  if (err instanceof ReferenceError) {
    console.log('[[ReferenceError]]');
    return 400;
  }

  if (err instanceof RangeError) {
    console.log('[[RangeError]]');
    return 400;
  }

  if (err instanceof SyntaxError) {
    console.log('[[SyntaxError]]');
    return 400;
  }

  if (err instanceof mongoose.Error) {
    console.log('[[mongoose.Error]]');
    return 500;
  }

  console.log('<< Error Not Known >>')
  return 500;
}

module.exports = { errorHandler };