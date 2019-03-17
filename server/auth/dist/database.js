"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("dotenv/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uri = process.env.MONGO_URI;
_mongoose.default.Promise = Promise;

_mongoose.default.connect(uri, {
  useNewUrlParser: true
}).then(function () {
  console.log('connected to db');
} // err => {console.log('failed to connect')}
);

var db = _mongoose.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));