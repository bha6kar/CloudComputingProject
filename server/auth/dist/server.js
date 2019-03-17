"use strict";

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("./routes"));

var _conf = _interopRequireDefault(require("./conf"));

var _middleware = _interopRequireDefault(require("./middleware"));

require("./database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
(0, _middleware.default)(app);
(0, _routes.default)(app);
app.listen(_conf.default.PORT, function (err) {
  if (err) {
    throw err;
  } else {
    console.log("you are server is running on ".concat(_conf.default.PORT));
  }
});