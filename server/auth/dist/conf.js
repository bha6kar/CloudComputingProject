"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("dotenv/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var default_config = {
  PORT: 8081,
  mysql: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dev'
  },
  salt: '1234s',
  secret: 'mysecretstring'
};
var config = {
  development: _objectSpread({}, default_config),
  production: _objectSpread({}, default_config),
  test: _objectSpread({}, default_config)
};
var _default = config[process.env.NODE_ENV];
exports.default = _default;