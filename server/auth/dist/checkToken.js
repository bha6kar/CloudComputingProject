"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.checkToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _fs = _interopRequireDefault(require("fs"));

var _errorHandling = require("./errorHandling");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var publicKey = _fs.default.readFileSync(__dirname + '/../../keys/jwtRS512.key.pub', 'utf8');

var checkToken =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            token = parseHeaders(req);
            if (token !== null) (0, _errorHandling.throwError)(401, 'Invalid request', 'No auth token supplied');
            console.log(token);
            _context.next = 6;
            return _jsonwebtoken.default.verify(token, publicKey).then((0, _errorHandling.throwIf)(function (r) {
              return !r;
            }, 401, 'Forbidden', 'Auth token is invalid'), (0, _errorHandling.throwError)(500, 'JWT ERROR'));

          case 6:
            req.auth = true;
            next();
            _context.next = 14;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
            (0, _errorHandling.sendError)(res)(_context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 10]]);
  }));

  return function checkToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.checkToken = checkToken;

var parseHeaders = function parseHeaders(req) {
  var token = req.headers['authorization'] || null;

  if (token !== null) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
  }

  return token;
};

var _default = checkToken;
exports.default = _default;