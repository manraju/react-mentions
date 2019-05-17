import { Children } from 'react';
import invariant from 'invariant';
import markupToRegex from './markupToRegex';
import countPlaceholders from './countPlaceholders';

var readConfigFromChildren = function readConfigFromChildren(children) {
  return Children.toArray(children).map(function (_ref) {
    var _ref$props = _ref.props,
        markup = _ref$props.markup,
        regex = _ref$props.regex,
        displayTransform = _ref$props.displayTransform;
    return {
      markup: markup,
      regex: regex ? coerceCapturingGroups(regex, markup) : markupToRegex(markup),
      displayTransform: displayTransform || function (id, display) {
        return display || id;
      }
    };
  });
};

// make sure that the custom regex defines the correct number of capturing groups
var coerceCapturingGroups = function coerceCapturingGroups(regex, markup) {
  var numberOfGroups = new RegExp(regex.toString() + '|').exec('').length - 1;
  var numberOfPlaceholders = countPlaceholders(markup);

  invariant(numberOfGroups === numberOfPlaceholders, 'Number of capturing groups in RegExp ' + regex.toString() + ' (' + numberOfGroups + ') does not match the number of placeholders in the markup \'' + markup + '\' (' + numberOfPlaceholders + ')');

  return regex;
};

export default readConfigFromChildren;