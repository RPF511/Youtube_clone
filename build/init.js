"use strict";

require("regenerator-runtime");

require("dotenv/config");

require("./db");

require("./models/Video");

require("./models/User");

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//require('dotenv').config(); in this method, we have to include this line to all files which requires .env
var PORT = 4000;

var handleListening = function handleListening() {
  return console.log("Server listening on port  http://localhost:".concat(PORT));
};

_server["default"].listen(PORT, handleListening);