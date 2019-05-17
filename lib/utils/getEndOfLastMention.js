'use strict';

exports.__esModule = true;

var _getMentions = require('./getMentions');

var _getMentions2 = _interopRequireDefault(_getMentions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getEndOfLastMention = function getEndOfLastMention(value, config) {
  var mentions = (0, _getMentions2.default)(value, config);
  var lastMention = mentions[mentions.length - 1];
  return lastMention ? lastMention.plainTextIndex + lastMention.display.length : 0;
};

exports.default = getEndOfLastMention;
module.exports = exports['default'];