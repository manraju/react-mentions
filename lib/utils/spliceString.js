"use strict";

exports.__esModule = true;
var spliceString = function spliceString(str, start, end, insert) {
  return str.substring(0, start) + insert + str.substring(end);
};

exports.default = spliceString;
module.exports = exports["default"];