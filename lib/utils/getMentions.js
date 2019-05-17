'use strict';

exports.__esModule = true;

var _iterateMentionsMarkup = require('./iterateMentionsMarkup');

var _iterateMentionsMarkup2 = _interopRequireDefault(_iterateMentionsMarkup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMentions = function getMentions(value, config) {
  var mentions = [];
  (0, _iterateMentionsMarkup2.default)(value, config, function (match, index, plainTextIndex, id, display, childIndex, start) {
    mentions.push({
      id: id,
      display: display,
      childIndex: childIndex,
      index: index,
      plainTextIndex: plainTextIndex
    });
  });
  return mentions;
};

exports.default = getMentions;
module.exports = exports['default'];