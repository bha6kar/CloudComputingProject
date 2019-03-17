"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _authController = require("./controllers/authController");

var _asyncMiddleware = _interopRequireDefault(require("./utils/asyncMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = function routes(app) {
  app.route('/signup').post((0, _asyncMiddleware.default)(_authController.signUp));
  app.route('/login').post((0, _asyncMiddleware.default)(_authController.logIn));
};

var _default = routes;
exports.default = _default;