"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _compression = _interopRequireDefault(require("compression"));

var _helmet = _interopRequireDefault(require("helmet"));

var _morgan = _interopRequireDefault(require("morgan"));

var _config = _interopRequireDefault(require("dotenv/config"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(app) {
  if (process.env.NODE_ENV === 'prod') {
    app.use((0, _compression.default)());
    app.use((0, _helmet.default)());
  }

  app.use(_express.default.urlencoded({
    extended: true
  }));
  app.use(_express.default.json());
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Credentials', "*");
    res.header('Access-Control-Expose-Headers', 'x-access-token');
    next();
  });

  if (process.env.NODE_ENV === 'development') {
    app.use((0, _morgan.default)('dev'));
  }
};

exports.default = _default;