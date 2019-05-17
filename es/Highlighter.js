var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { defaultStyle } from 'substyle';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';

import { iterateMentionsMarkup, mapPlainTextIndex, readConfigFromChildren } from './utils';

var _generateComponentKey = function _generateComponentKey(usedKeys, id) {
  if (!usedKeys.hasOwnProperty(id)) {
    usedKeys[id] = 0;
  } else {
    usedKeys[id]++;
  }
  return id + '_' + usedKeys[id];
};

var Highlighter = (_temp = _class = function (_Component) {
  _inherits(Highlighter, _Component);

  function Highlighter() {
    _classCallCheck(this, Highlighter);

    var _this = _possibleConstructorReturn(this, _Component.apply(this, arguments));

    _this.state = { lastPosition: {} };
    return _this;
  }

  Highlighter.prototype.componentDidMount = function componentDidMount() {
    this.notifyCaretPosition();
  };

  Highlighter.prototype.componentDidUpdate = function componentDidUpdate() {
    this.notifyCaretPosition();
  };

  Highlighter.prototype.notifyCaretPosition = function notifyCaretPosition() {
    if (!this.caretRef) {
      return;
    }

    var position = {
      left: this.caretRef.offsetLeft,
      top: this.caretRef.offsetTop
    };

    var lastPosition = this.state.lastPosition;


    if (isEqual(lastPosition, position)) {
      return;
    }

    this.setState({
      lastPosition: position
    });

    this.props.onCaretPositionChange(position);
  };

  Highlighter.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        selection = _props.selection,
        value = _props.value,
        style = _props.style,
        inputStyle = _props.inputStyle,
        children = _props.children;

    var config = readConfigFromChildren(children);

    // If there's a caret (i.e. no range selection), map the caret position into the marked up value
    var caretPositionInMarkup = void 0;
    if (selection.start === selection.end) {
      caretPositionInMarkup = mapPlainTextIndex(value, config, selection.start, 'START');
    }

    var resultComponents = [];
    var componentKeys = {};

    // start by appending directly to the resultComponents
    var components = resultComponents;
    var substringComponentKey = 0;

    var textIteratee = function textIteratee(substr, index, indexInPlainText) {
      // check whether the caret element has to be inserted inside the current plain substring
      if (isNumber(caretPositionInMarkup) && caretPositionInMarkup >= index && caretPositionInMarkup <= index + substr.length) {
        // if yes, split substr at the caret position and insert the caret component
        var splitIndex = caretPositionInMarkup - index;
        components.push(_this2.renderSubstring(substr.substring(0, splitIndex), substringComponentKey));

        // add all following substrings and mention components as children of the caret component
        components = [_this2.renderSubstring(substr.substring(splitIndex), substringComponentKey)];
      } else {
        // otherwise just push the plain text substring
        components.push(_this2.renderSubstring(substr, substringComponentKey));
      }

      substringComponentKey++;
    };

    var mentionIteratee = function mentionIteratee(markup, index, indexInPlainText, id, display, mentionChildIndex, lastMentionEndIndex) {
      // generate a component key based on the id
      var key = _generateComponentKey(componentKeys, id);
      components.push(_this2.getMentionComponentForMatch(id, display, mentionChildIndex, key));
    };

    iterateMentionsMarkup(value, config, mentionIteratee, textIteratee);

    // append a span containing a space, to ensure the last text line has the correct height
    components.push(' ');

    if (components !== resultComponents) {
      // if a caret component is to be rendered, add all components that followed as its children
      resultComponents.push(this.renderHighlighterCaret(components));
    }

    return React.createElement(
      'div',
      _extends({}, style, {
        style: _extends({}, inputStyle, style.style)
      }),
      resultComponents
    );
  };

  Highlighter.prototype.renderSubstring = function renderSubstring(string, key) {
    // set substring span to hidden, so that Emojis are not shown double in Mobile Safari
    return React.createElement(
      'span',
      _extends({}, this.props.style('substring'), { key: key }),
      string
    );
  };

  // Returns a clone of the Mention child applicable for the specified type to be rendered inside the highlighter


  Highlighter.prototype.getMentionComponentForMatch = function getMentionComponentForMatch(id, display, mentionChildIndex, key) {
    var props = { id: id, display: display, key: key };
    var child = Children.toArray(this.props.children)[mentionChildIndex];
    return React.cloneElement(child, props);
  };

  // Renders an component to be inserted in the highlighter at the current caret position


  Highlighter.prototype.renderHighlighterCaret = function renderHighlighterCaret(children) {
    var _this3 = this;

    return React.createElement(
      'span',
      _extends({}, this.props.style('caret'), {
        ref: function ref(el) {
          _this3.caretRef = el;
        },
        key: 'caret'
      }),
      children
    );
  };

  return Highlighter;
}(Component), _class.defaultProps = {
  value: '',
  inputStyle: {}
}, _temp);
Highlighter.propTypes = process.env.NODE_ENV !== "production" ? {
  selection: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number
  }).isRequired,
  value: PropTypes.string.isRequired,
  onCaretPositionChange: PropTypes.func.isRequired,
  inputStyle: PropTypes.object,

  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
} : {};


var styled = defaultStyle({
  position: 'relative',
  width: 'inherit',
  color: 'transparent',

  overflow: 'hidden',

  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',

  '&singleLine': {
    whiteSpace: 'pre',
    wordWrap: null
  },

  substring: {
    visibility: 'hidden'
  }
}, function (props) {
  return {
    '&singleLine': props.singleLine
  };
});

export default styled(Highlighter);