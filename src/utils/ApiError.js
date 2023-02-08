class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
class BadRequestError extends ApiError {
  constructor(message, isOperational = true, stack = '') {
    super(400, message, isOperational, stack);
  }
}
class InternalServerError extends ApiError {
  constructor(message, isOperational = true, stack = '') {
    super(500, message, isOperational, stack);
  }
}
module.exports = {
  ApiError,
  BadRequestError,
  InternalServerError,
};
