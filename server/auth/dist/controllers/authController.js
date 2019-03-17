"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logIn = exports.signUp = exports.makePayload = void 0;

var _argon = _interopRequireDefault(require("argon2"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _usersModel = _interopRequireDefault(require("../models/usersModel"));

var _fs = _interopRequireDefault(require("fs"));

var _errorHandling = require("../utils/errorHandling");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var privateKEY = _fs.default.readFileSync(__dirname + '/../../keys/jwtRS512.key', 'utf8');

var signOptions = {
  issuer: 'authService',
  subject: '',
  audience: 'moviesWebsite',
  expiresIn: '24h',
  algorithm: 'RS512'
};

var makePayload = function makePayload(userId) {
  return {
    id: userId
  };
};

exports.makePayload = makePayload;

var signUp =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, email, password, hashedPass, user, token;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            if (!req.body.email && !req.body.password) (0, _errorHandling.throwError)(400, 'Incorrect Request', 'Email or password is missing')();
            _req$body = req.body, email = _req$body.email, password = _req$body.password;
            _context.next = 5;
            return _usersModel.default.findOne({
              email: email
            }).then((0, _errorHandling.throwIf)(function (r) {
              return r;
            }, 409, 'Incorrect data', 'Email already in use!'), (0, _errorHandling.throwError)(500, 'Mongodb error'));

          case 5:
            _context.next = 7;
            return _argon.default.hash(password).then((0, _errorHandling.throwIf)(function (r) {
              return !r;
            }, 500, 'Argon error'), (0, _errorHandling.throwError)(500, 'Mongodb error'));

          case 7:
            hashedPass = _context.sent;
            _context.next = 10;
            return _usersModel.default.create({
              email: email,
              password: hashedPass
            }).then((0, _errorHandling.throwIf)(function (r) {
              return !r;
            }, 500, 'Mongo error', 'User not created'), (0, _errorHandling.throwError)(500, 'Mongo error'));

          case 10:
            user = _context.sent;
            signOptions = _objectSpread({}, signOptions, {
              subject: email
            });
            token = _jsonwebtoken.default.sign(makePayload(user._id), privateKEY, signOptions);
            if (!token) (0, _errorHandling.throwError)(500, 'Jwt sign error', 'Something went wrong with signing the jwt');
            (0, _errorHandling.sendSuccess)(res, 'User Created!')({
              token: token
            });
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            (0, _errorHandling.sendError)(res)(_context.t0);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 17]]);
  }));

  return function signUp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.signUp = signUp;

var logIn =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body2, _req$body2$email, email, _req$body2$password, password, user, token;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            if (!req.body.email && !req.body.password) (0, _errorHandling.throwError)(400, 'Incorrect request', 'Email or password is missing');
            _req$body2 = req.body, _req$body2$email = _req$body2.email, email = _req$body2$email === void 0 ? '' : _req$body2$email, _req$body2$password = _req$body2.password, password = _req$body2$password === void 0 ? '' : _req$body2$password;
            _context2.next = 5;
            return _usersModel.default.findOne({
              email: email
            }).then((0, _errorHandling.throwIf)(function (r) {
              return !r;
            }, 403, 'Not found', 'Email not found'), (0, _errorHandling.throwError)(500, 'Mongo error'));

          case 5:
            user = _context2.sent;
            _context2.next = 8;
            return _argon.default.verify(user.password, password).then((0, _errorHandling.throwIf)(function (r) {
              return !r;
            }, 403, 'Incorrect', 'Password is incorrect'), (0, _errorHandling.throwError)(500, 'Argon error'));

          case 8:
            _context2.next = 10;
            return _jsonwebtoken.default.sign(makePayload(user._id), privateKEY, signOptions).then((0, _errorHandling.throwError)(500, 'Jwt error'));

          case 10:
            token = _context2.sent;
            (0, _errorHandling.sendSuccess)(res, 'Authentication successful')({
              token: token
            });
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            (0, _errorHandling.sendError)(res)(_context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 14]]);
  }));

  return function logIn(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.logIn = logIn;