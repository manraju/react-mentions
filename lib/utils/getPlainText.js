'use strict';

exports.__esModule = true;

var _iterateMentionsMarkup = require('./iterateMentionsMarkup');

var _iterateMentionsMarkup2 = _interopRequireDefault(_iterateMentionsMarkup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPlainText = function getPlainText(value, config) {
  var result = '';
  (0, _iterateMentionsMarkup2.default)(value, config, function (match, index, plainTextIndex, id, display) {
    result += display;
  }, function (plainText) {
    result += plainText;
  });
  return result;
};

exports.default = getPlainText;
module.exports = exports['default'];