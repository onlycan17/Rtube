"use strict";

require("dotenv/config");

require("./db");

require("./models/Video");

require("./models/User");

require("./models/Comment");

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = 4000;

var handleListening = function handleListening() {
  return console.log("\u2705 Server listening on http://localhost:".concat(PORT));
};

_server["default"].listen(PORT, handleListening);