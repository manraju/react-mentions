'use strict';

exports.__esModule = true;

var _react = require('react');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _markupToRegex = require('./markupToRegex');

var _markupToRegex2 = _interopRequireDefault(_markupToRegex);

var _countPlaceholders = require('./countPlaceholders');

var _countPlaceholders2 = _interopRequireDefault(_countPlaceholders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readConfigFromChildren = function readConfigFromChildren(children) {
  return _react.Children.toArray(children).map(function (_ref) {
    var _ref$props = _ref.props,
        markup = _ref$props.markup,
        regex = _ref$props.regex,
        displayTransform = _ref$props.displayTransform;
    return {
      markup: markup,
      regex: regex ? coerceCapturingGroups(regex, markup) : (0, _markupToRegex2.default)(markup),
      displayTransform: displayTransform || function (id, display) {
        return display || id;
      }
    };
  });
};

// make sure that the custom regex defines the correct number of capturing groups
var coerceCapturingGroups = function coerceCapturingGroups(regex, markup) {
  var numberOfGroups = new RegExp(regex.toString() + '|').exec('').length - 1;
  var numberOfPlaceholders = (0, _countPlaceholders2.default)(markup);

  (0, _invariant2.default)(numberOfGroups === numberOfPlaceholders, 'Number of capturing groups in RegExp ' + regex.toString() + ' (' + numberOfGroups + ') does not match the number of placeholders in the markup \'' + markup + '\' (' + numberOfPlaceholders + ')');

  return regex;
};

exports.default = readConfigFromChildren;
module.exports = exports['default'];