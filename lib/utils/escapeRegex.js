'use strict';

exports.__esModule = true;
// escape RegExp special characters https://stackoverflow.com/a/9310752/5142490
var escapeRegex = function escapeRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

exports.default = escapeRegex;
module.exports = exports['default'];