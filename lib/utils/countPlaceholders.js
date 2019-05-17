'use strict';

exports.__esModule = true;
var countPlaceholders = function countPlaceholders(markup) {
  var count = 0;
  if (markup.indexOf('__id__') >= 0) count++;
  if (markup.indexOf('__display__') >= 0) count++;
  return count;
};

exports.default = countPlaceholders;
module.exports = exports['default'];