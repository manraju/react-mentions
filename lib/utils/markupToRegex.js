'use strict';

exports.__esModule = true;

var _placeholders = require('./placeholders');

var _placeholders2 = _interopRequireDefault(_placeholders);

var _escapeRegex = require('./escapeRegex');

var _escapeRegex2 = _interopRequireDefault(_escapeRegex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var markupToRegex = function markupToRegex(markup) {
  var escapedMarkup = (0, _escapeRegex2.default)(markup);
  var charAfterDisplay = markup[markup.indexOf(_placeholders2.default.display) + _placeholders2.default.display.length];
  var charAfterId = markup[markup.indexOf(_placeholders2.default.display) + _placeholders2.default.display.length];
  return new RegExp(escapedMarkup.replace(_placeholders2.default.display, '([^' + (0, _escapeRegex2.default)(charAfterDisplay || '') + ']+?)').replace(_placeholders2.default.id, '([^' + (0, _escapeRegex2.default)(charAfterId || '') + ']+?)'));
};

exports.default = markupToRegex;
module.exports = exports['default'];