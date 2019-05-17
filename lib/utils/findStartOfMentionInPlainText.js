'use strict';

exports.__esModule = true;

var _iterateMentionsMarkup = require('./iterateMentionsMarkup');

var _iterateMentionsMarkup2 = _interopRequireDefault(_iterateMentionsMarkup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// For a given indexInPlainText that lies inside a mention,
// returns a the index of of the first char of the mention in the plain text.
// If indexInPlainText does not lie inside a mention, returns indexInPlainText.
var findStartOfMentionInPlainText = function findStartOfMentionInPlainText(value, config, indexInPlainText) {
  var result = indexInPlainText;
  var foundMention = false;

  var markupIteratee = function markupIteratee(markup, index, mentionPlainTextIndex, id, display, childIndex, lastMentionEndIndex) {
    if (mentionPlainTextIndex <= indexInPlainText && mentionPlainTextIndex + display.length > indexInPlainText) {
      result = mentionPlainTextIndex;
      foundMention = true;
    }
  };
  (0, _iterateMentionsMarkup2.default)(value, config, markupIteratee);

  if (foundMention) {
    return result;
  }
};

exports.default = findStartOfMentionInPlainText;
module.exports = exports['default'];