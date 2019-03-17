"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendError = exports.sendSuccess = exports.throwIf = exports.throwError = void 0;

var throwError = function throwError(code, errorType, errorMessage) {
  return function (error) {
    if (!error) error = new Error(errorMessage || 'Default Error');
    error.status = code;
    error.errorType = errorType;
    throw error;
  };
};

exports.throwError = throwError;

var throwIf = function throwIf(fn, code, errorType, errorMessage) {
  return function (result) {
    if (fn(result)) {
      return throwError(code, errorType, errorMessage)();
    }

    return result;
  };
};

exports.throwIf = throwIf;

var sendSuccess = function sendSuccess(res, message) {
  return function (data) {
    res.status(200).json({
      type: 'success',
      message: message,
      data: data
    });
  };
};

exports.sendSuccess = sendSuccess;

var sendError = function sendError(res, status, message) {
  return function (error) {
    res.status(status || error.status).json({
      type: 'error',
      message: message || error.message,
      error: error
    });
  };
};

exports.sendError = sendError;