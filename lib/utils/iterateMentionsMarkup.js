'use strict';

exports.__esModule = true;

var _findPositionOfCapturingGroup = require('./findPositionOfCapturingGroup');

var _findPositionOfCapturingGroup2 = _interopRequireDefault(_findPositionOfCapturingGroup);

var _combineRegExps = require('./combineRegExps');

var _combineRegExps2 = _interopRequireDefault(_combineRegExps);

var _countPlaceholders = require('./countPlaceholders');

var _countPlaceholders2 = _interopRequireDefault(_countPlaceholders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyFn = function emptyFn() {};

// Finds all occurrences of the markup in the value and calls the `markupIteratee` callback for each of them.
// The optional `textIteratee` callback is called for each plain text ranges in between these markup occurrences.
var iterateMentionsMarkup = function iterateMentionsMarkup(value, config, markupIteratee) {
  var textIteratee = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFn;

  var regex = (0, _combineRegExps2.default)(config.map(function (c) {
    return c.regex;
  }));

  var accOffset = 2; // first is whole match, second is the for the capturing group of first regexp component
  var captureGroupOffsets = config.map(function (_ref) {
    var markup = _ref.markup;

    var result = accOffset;
    // + 1 is for the capturing group we add around each regexp component in combineRegExps
    accOffset += (0, _countPlaceholders2.default)(markup) + 1;
    return result;
  });

  var match = void 0;
  var start = 0;
  var currentPlainTextIndex = 0;

  // detect all mention markup occurrences in the value and iterate the matches
  while ((match = regex.exec(value)) !== null) {
    var offset = captureGroupOffsets.find(function (o) {
      return !!match[o];
    }); // eslint-disable-line no-loop-func
    var mentionChildIndex = captureGroupOffsets.indexOf(offset);
    var _config$mentionChildI = config[mentionChildIndex],
        markup = _config$mentionChildI.markup,
        displayTransform = _config$mentionChildI.displayTransform;

    var idPos = offset + (0, _findPositionOfCapturingGroup2.default)(markup, 'id');
    var displayPos = offset + (0, _findPositionOfCapturingGroup2.default)(markup, 'display');

    var id = match[idPos];
    var display = displayTransform(id, match[displayPos]);

    var substr = value.substring(start, match.index);
    textIteratee(substr, start, currentPlainTextIndex);
    currentPlainTextIndex += substr.length;

    markupIteratee(match[0], match.index, currentPlainTextIndex, id, display, mentionChildIndex, start);
    currentPlainTextIndex += display.length;
    start = regex.lastIndex;
  }

  if (start < value.length) {
    textIteratee(value.substring(start), start, currentPlainTextIndex);
  }
};

exports.default = iterateMentionsMarkup;
module.exports = exports['default'];