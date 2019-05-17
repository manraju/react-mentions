'use strict';

exports.__esModule = true;
exports.makeTriggerRegex = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _substyle = require('substyle');

var _utils = require('./utils');

var _SuggestionsOverlay = require('./SuggestionsOverlay');

var _SuggestionsOverlay2 = _interopRequireDefault(_SuggestionsOverlay);

var _Highlighter = require('./Highlighter');

var _Highlighter2 = _interopRequireDefault(_Highlighter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var makeTriggerRegex = exports.makeTriggerRegex = function makeTriggerRegex(trigger) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (trigger instanceof RegExp) {
    return trigger;
  } else {
    var allowSpaceInQuery = options.allowSpaceInQuery;

    var escapedTriggerChar = (0, _utils.escapeRegex)(trigger);

    // first capture group is the part to be replaced on completion
    // second capture group is for extracting the search query
    return new RegExp('(?:^|\\s)(' + escapedTriggerChar + '([^' + (allowSpaceInQuery ? '' : '\\s') + escapedTriggerChar + ']*))$');
  }
};

var getDataProvider = function getDataProvider(data) {
  if (data instanceof Array) {
    // if data is an array, create a function to query that
    return function (query, callback) {
      var results = [];
      for (var i = 0, l = data.length; i < l; ++i) {
        var display = data[i].display || data[i].id;
        if (display.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          results.push(data[i]);
        }
      }
      return results;
    };
  } else {
    // expect data to be a query function
    return data;
  }
};

var KEY = { TAB: 9, RETURN: 13, ESC: 27, UP: 38, DOWN: 40 };

var isComposing = false;

var propTypes = {
  /**
   * If set to `true` a regular text input element will be rendered
   * instead of a textarea
   */
  singleLine: _propTypes2.default.bool,

  value: _propTypes2.default.string,
  onKeyDown: _propTypes2.default.func,
  onSelect: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  suggestionsPortalHost: typeof Element === 'undefined' ? _propTypes2.default.any : _propTypes2.default.PropTypes.instanceOf(Element),
  inputRef: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.shape({
    current: typeof Element === 'undefined' ? _propTypes2.default.any : _propTypes2.default.instanceOf(Element)
  })]),

  children: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.arrayOf(_propTypes2.default.element)]).isRequired
};

var MentionsInput = (_temp = _class = function (_React$Component) {
  _inherits(MentionsInput, _React$Component);

  function MentionsInput(props) {
    _classCallCheck(this, MentionsInput);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    _this.suggestions = {};

    _this.state = {
      focusIndex: 0,

      selectionStart: null,
      selectionEnd: null,

      suggestions: {},

      caretPosition: null,
      suggestionsPosition: null
    };
    return _this;
  }

  MentionsInput.prototype.render = function render() {
    var _this2 = this;

    return _react2.default.createElement(
      'div',
      _extends({
        ref: function ref(el) {
          _this2.containerRef = el;
        }
      }, this.props.style),
      this.renderControl(),
      this.renderSuggestionsOverlay()
    );
  };

  // Returns the text to set as the value of the textarea with all markups removed


  // Handle input element's change event


  // Handle input element's select event


  MentionsInput.prototype.componentDidMount = function componentDidMount() {
    this.updateSuggestionsPosition();
  };

  MentionsInput.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    // Update position of suggestions unless this componentDidUpdate was
    // triggered by an update to suggestionsPosition.
    if (prevState.suggestionsPosition === this.state.suggestionsPosition) {
      this.updateSuggestionsPosition();
    }

    // maintain selection in case a mention is added/removed causing
    // the cursor to jump to the end
    if (this.state.setSelectionAfterMentionChange) {
      this.setState({ setSelectionAfterMentionChange: false });
      this.setSelection(this.state.selectionStart, this.state.selectionEnd);
    }
  };

  return MentionsInput;
}(_react2.default.Component), _class.defaultProps = {
  singleLine: false,
  onKeyDown: function onKeyDown() {
    return null;
  },
  onSelect: function onSelect() {
    return null;
  },
  onBlur: function onBlur() {
    return null;
  }
}, _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.getInputProps = function (isTextarea) {
    var _props = _this3.props,
        readOnly = _props.readOnly,
        disabled = _props.disabled,
        style = _props.style;

    // pass all props that we don't use through to the input control

    var props = (0, _omit2.default)(_this3.props, 'style', (0, _keys2.default)(propTypes));

    return _extends({}, props, style('input'), {

      value: _this3.getPlainText()

    }, !readOnly && !disabled && {
      onChange: _this3.handleChange,
      onSelect: _this3.handleSelect,
      onKeyDown: _this3.handleKeyDown,
      onBlur: _this3.handleBlur,
      onCompositionStart: _this3.handleCompositionStart,
      onCompositionEnd: _this3.handleCompositionEnd,
      onScroll: _this3.updateHighlighterScroll
    });
  };

  this.renderControl = function () {
    var _props2 = _this3.props,
        singleLine = _props2.singleLine,
        style = _props2.style;

    var inputProps = _this3.getInputProps(!singleLine);

    return _react2.default.createElement(
      'div',
      style('control'),
      _this3.renderHighlighter(inputProps.style),
      singleLine ? _this3.renderInput(inputProps) : _this3.renderTextarea(inputProps)
    );
  };

  this.renderInput = function (props) {
    return _react2.default.createElement('input', _extends({ type: 'text', ref: _this3.setInputRef }, props));
  };

  this.renderTextarea = function (props) {
    return _react2.default.createElement('textarea', _extends({ ref: _this3.setInputRef }, props));
  };

  this.setInputRef = function (el) {
    _this3.inputRef = el;
    var inputRef = _this3.props.inputRef;

    if (typeof inputRef === 'function') {
      inputRef(el);
    } else if (inputRef) {
      inputRef.current = el;
    }
  };

  this.renderSuggestionsOverlay = function () {
    if (!(0, _isNumber2.default)(_this3.state.selectionStart)) {
      // do not show suggestions when the input does not have the focus
      return null;
    }

    var suggestionsNode = _react2.default.createElement(
      _SuggestionsOverlay2.default,
      {
        style: _this3.props.style('suggestions'),
        position: _this3.state.suggestionsPosition,
        focusIndex: _this3.state.focusIndex,
        scrollFocusedIntoView: _this3.state.scrollFocusedIntoView,
        ref: function ref(el) {
          _this3.suggestionsRef = el;
        },
        suggestions: _this3.state.suggestions,
        onSelect: _this3.addMention,
        onMouseDown: _this3.handleSuggestionsMouseDown,
        onMouseEnter: function onMouseEnter(focusIndex) {
          return _this3.setState({
            focusIndex: focusIndex,
            scrollFocusedIntoView: false
          });
        },
        isLoading: _this3.isLoading()
      },
      _this3.props.children
    );
    if (_this3.props.suggestionsPortalHost) {
      return _reactDom2.default.createPortal(suggestionsNode, _this3.props.suggestionsPortalHost);
    } else {
      return suggestionsNode;
    }
  };

  this.renderHighlighter = function (inputStyle) {
    var _state = _this3.state,
        selectionStart = _state.selectionStart,
        selectionEnd = _state.selectionEnd;
    var _props3 = _this3.props,
        singleLine = _props3.singleLine,
        children = _props3.children,
        value = _props3.value,
        style = _props3.style;


    return _react2.default.createElement(
      _Highlighter2.default,
      {
        ref: function ref(el) {
          _this3.highlighterRef = el;
        },
        style: style('highlighter'),
        inputStyle: inputStyle,
        value: value,
        singleLine: singleLine,
        selection: {
          start: selectionStart,
          end: selectionEnd
        },
        onCaretPositionChange: function onCaretPositionChange(position) {
          return _this3.setState({ caretPosition: position });
        }
      },
      children
    );
  };

  this.getPlainText = function () {
    return (0, _utils.getPlainText)(_this3.props.value || '', (0, _utils.readConfigFromChildren)(_this3.props.children));
  };

  this.executeOnChange = function (event) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (_this3.props.onChange) {
      var _props4;

      return (_props4 = _this3.props).onChange.apply(_props4, [event].concat(args));
    }

    if (_this3.props.valueLink) {
      var _props$valueLink;

      return (_props$valueLink = _this3.props.valueLink).requestChange.apply(_props$valueLink, [event.target.value].concat(args));
    }
  };

  this.handleChange = function (ev) {
    // if we are inside iframe, we need to find activeElement within its contentDocument
    var currentDocument = document.activeElement && document.activeElement.contentDocument || document;
    if (currentDocument.activeElement !== ev.target) {
      // fix an IE bug (blur from empty input element with placeholder attribute trigger "input" event)
      return;
    }

    var value = _this3.props.value || '';
    var config = (0, _utils.readConfigFromChildren)(_this3.props.children);

    var newPlainTextValue = ev.target.value;

    // Derive the new value to set by applying the local change in the textarea's plain text
    var newValue = (0, _utils.applyChangeToValue)(value, newPlainTextValue, {
      selectionStartBefore: _this3.state.selectionStart,
      selectionEndBefore: _this3.state.selectionEnd,
      selectionEndAfter: ev.target.selectionEnd
    }, config);

    // In case a mention is deleted, also adjust the new plain text value
    newPlainTextValue = (0, _utils.getPlainText)(newValue, config);

    // Save current selection after change to be able to restore caret position after rerendering
    var selectionStart = ev.target.selectionStart;
    var selectionEnd = ev.target.selectionEnd;
    var setSelectionAfterMentionChange = false;

    // Adjust selection range in case a mention will be deleted by the characters outside of the
    // selection range that are automatically deleted
    var startOfMention = (0, _utils.findStartOfMentionInPlainText)(value, config, selectionStart);

    if (startOfMention !== undefined && _this3.state.selectionEnd > startOfMention) {
      // only if a deletion has taken place
      selectionStart = startOfMention;
      selectionEnd = selectionStart;
      setSelectionAfterMentionChange = true;
    }

    _this3.setState({
      selectionStart: selectionStart,
      selectionEnd: selectionEnd,
      setSelectionAfterMentionChange: setSelectionAfterMentionChange
    });

    var mentions = (0, _utils.getMentions)(newValue, config);

    // Propagate change
    // let handleChange = this.getOnChange(this.props) || emptyFunction;
    var eventMock = { target: { value: newValue }
      // this.props.onChange.call(this, eventMock, newValue, newPlainTextValue, mentions);
    };_this3.executeOnChange(eventMock, newValue, newPlainTextValue, mentions);
  };

  this.handleSelect = function (ev) {
    // keep track of selection range / caret position
    _this3.setState({
      selectionStart: ev.target.selectionStart,
      selectionEnd: ev.target.selectionEnd
    });

    // do nothing while a IME composition session is active
    if (isComposing) return;

    // refresh suggestions queries
    var el = _this3.inputRef;
    if (ev.target.selectionStart === ev.target.selectionEnd) {
      _this3.updateMentionsQueries(el.value, ev.target.selectionStart);
    } else {
      _this3.clearSuggestions();
    }

    // sync highlighters scroll position
    _this3.updateHighlighterScroll();

    _this3.props.onSelect(ev);
  };

  this.handleKeyDown = function (ev) {
    // do not intercept key events if the suggestions overlay is not shown
    var suggestionsCount = (0, _utils.countSuggestions)(_this3.state.suggestions);

    var suggestionsComp = _this3.suggestionsRef;
    if (suggestionsCount === 0 || !suggestionsComp) {
      _this3.props.onKeyDown(ev);

      return;
    }

    if ((0, _values2.default)(KEY).indexOf(ev.keyCode) >= 0) {
      ev.preventDefault();
    }

    switch (ev.keyCode) {
      case KEY.ESC:
        {
          _this3.clearSuggestions();
          return;
        }
      case KEY.DOWN:
        {
          _this3.shiftFocus(+1);
          return;
        }
      case KEY.UP:
        {
          _this3.shiftFocus(-1);
          return;
        }
      case KEY.RETURN:
        {
          _this3.selectFocused();
          return;
        }
      case KEY.TAB:
        {
          _this3.selectFocused();
          return;
        }
      default:
        {
          return;
        }
    }
  };

  this.shiftFocus = function (delta) {
    var suggestionsCount = (0, _utils.countSuggestions)(_this3.state.suggestions);

    _this3.setState({
      focusIndex: (suggestionsCount + _this3.state.focusIndex + delta) % suggestionsCount,
      scrollFocusedIntoView: true
    });
  };

  this.selectFocused = function () {
    var _state2 = _this3.state,
        suggestions = _state2.suggestions,
        focusIndex = _state2.focusIndex;
    var _Object$values$reduce = Object.values(suggestions).reduce(function (acc, _ref) {
      var results = _ref.results,
          queryInfo = _ref.queryInfo;
      return [].concat(acc, results.map(function (result) {
        return { result: result, queryInfo: queryInfo };
      }));
    }, [])[focusIndex],
        result = _Object$values$reduce.result,
        queryInfo = _Object$values$reduce.queryInfo;


    _this3.addMention(result, queryInfo);

    _this3.setState({
      focusIndex: 0
    });
  };

  this.handleBlur = function (ev) {
    var clickedSuggestion = _this3._suggestionsMouseDown;
    _this3._suggestionsMouseDown = false;

    // only reset selection if the mousedown happened on an element
    // other than the suggestions overlay
    if (!clickedSuggestion) {
      _this3.setState({
        selectionStart: null,
        selectionEnd: null
      });
    }

    window.setTimeout(function () {
      _this3.updateHighlighterScroll();
    }, 1);

    _this3.props.onBlur(ev, clickedSuggestion);
  };

  this.handleSuggestionsMouseDown = function (ev) {
    _this3._suggestionsMouseDown = true;
  };

  this.updateSuggestionsPosition = function () {
    var caretPosition = _this3.state.caretPosition;


    if (!caretPosition || !_this3.suggestionsRef) {
      return;
    }

    var suggestions = _reactDom2.default.findDOMNode(_this3.suggestionsRef);
    var highlighter = _reactDom2.default.findDOMNode(_this3.highlighterRef);

    if (!suggestions) {
      return;
    }

    var position = {};

    // if suggestions menu is in a portal, update position to be releative to its portal node
    if (_this3.props.suggestionsPortalHost) {
      // first get viewport-relative position (highlighter is offsetParent of caret):
      var caretOffsetParentRect = highlighter.getBoundingClientRect();
      var caretHeight = getComputedStyleLengthProp(highlighter, 'font-size');
      var viewportRelative = {
        left: caretOffsetParentRect.left + caretPosition.left,
        top: caretOffsetParentRect.top + caretPosition.top + caretHeight
      };
      position.position = 'fixed';
      var left = viewportRelative.left;
      position.top = viewportRelative.top;
      // absolute/fixed positioned elements are positioned according to their entire box including margins; so we remove margins here:
      left -= getComputedStyleLengthProp(suggestions, 'margin-left');
      position.top -= getComputedStyleLengthProp(suggestions, 'margin-top');
      // take into account highlighter/textinput scrolling:
      left -= highlighter.scrollLeft;
      position.top -= highlighter.scrollTop;
      // guard for mentions suggestions list clipped by right edge of window
      var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if (left + suggestions.offsetWidth > viewportWidth) {
        position.left = Math.max(0, viewportWidth - suggestions.offsetWidth);
      } else {
        position.left = left;
      }
    } else {
      var _left = caretPosition.left - highlighter.scrollLeft;
      // guard for mentions suggestions list clipped by right edge of window
      if (_left + suggestions.offsetWidth > _this3.containerRef.offsetWidth) {
        position.right = 0;
      } else {
        position.left = _left;
      }
      position.top = caretPosition.top - highlighter.scrollTop;
    }

    if ((0, _isEqual2.default)(position, _this3.state.suggestionsPosition)) {
      return;
    }

    _this3.setState({
      suggestionsPosition: position
    });
  };

  this.updateHighlighterScroll = function () {
    if (!_this3.inputRef || !_this3.highlighterRef) {
      // since the invocation of this function is deferred,
      // the whole component may have been unmounted in the meanwhile
      return;
    }
    var input = _this3.inputRef;
    var highlighter = _reactDom2.default.findDOMNode(_this3.highlighterRef);
    highlighter.scrollLeft = input.scrollLeft;
    highlighter.scrollTop = input.scrollTop;
    highlighter.height = input.height;
  };

  this.handleCompositionStart = function () {
    isComposing = true;
  };

  this.handleCompositionEnd = function () {
    isComposing = false;
  };

  this.setSelection = function (selectionStart, selectionEnd) {
    if (selectionStart === null || selectionEnd === null) return;

    var el = _this3.inputRef;
    if (el.setSelectionRange) {
      el.setSelectionRange(selectionStart, selectionEnd);
    } else if (el.createTextRange) {
      var range = el.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  };

  this.updateMentionsQueries = function (plainTextValue, caretPosition) {
    // Invalidate previous queries. Async results for previous queries will be neglected.
    _this3._queryId++;
    _this3.suggestions = {};
    _this3.setState({
      suggestions: {}
    });

    var value = _this3.props.value || '';
    var children = _this3.props.children;

    var config = (0, _utils.readConfigFromChildren)(children);

    var positionInValue = (0, _utils.mapPlainTextIndex)(value, config, caretPosition, 'NULL');

    // If caret is inside of mention, do not query
    if (positionInValue === null) {
      return;
    }

    // Extract substring in between the end of the previous mention and the caret
    var substringStartIndex = (0, _utils.getEndOfLastMention)(value.substring(0, positionInValue), config);
    var substring = plainTextValue.substring(substringStartIndex, caretPosition);

    // Check if suggestions have to be shown:
    // Match the trigger patterns of all Mention children on the extracted substring
    _react2.default.Children.forEach(children, function (child, childIndex) {
      if (!child) {
        return;
      }

      var regex = makeTriggerRegex(child.props.trigger, _this3.props);
      var match = substring.match(regex);
      if (match) {
        var querySequenceStart = substringStartIndex + substring.indexOf(match[1], match.index);
        _this3.queryData(match[2], childIndex, querySequenceStart, querySequenceStart + match[1].length, plainTextValue);
      }
    });
  };

  this.clearSuggestions = function () {
    // Invalidate previous queries. Async results for previous queries will be neglected.
    _this3._queryId++;
    _this3.suggestions = {};
    _this3.setState({
      suggestions: {},
      focusIndex: 0
    });
  };

  this.queryData = function (query, childIndex, querySequenceStart, querySequenceEnd, plainTextValue) {
    var mentionChild = _react.Children.toArray(_this3.props.children)[childIndex];
    var provideData = getDataProvider(mentionChild.props.data);
    var syncResult = provideData(query, _this3.updateSuggestions.bind(null, _this3._queryId, childIndex, query, querySequenceStart, querySequenceEnd, plainTextValue));
    if (syncResult instanceof Array) {
      _this3.updateSuggestions(_this3._queryId, childIndex, query, querySequenceStart, querySequenceEnd, plainTextValue, syncResult);
    }
  };

  this.updateSuggestions = function (queryId, childIndex, query, querySequenceStart, querySequenceEnd, plainTextValue, results) {
    var _extends2;

    // neglect async results from previous queries
    if (queryId !== _this3._queryId) return;

    // save in property so that multiple sync state updates from different mentions sources
    // won't overwrite each other
    _this3.suggestions = _extends({}, _this3.suggestions, (_extends2 = {}, _extends2[childIndex] = {
      queryInfo: {
        childIndex: childIndex,
        query: query,
        querySequenceStart: querySequenceStart,
        querySequenceEnd: querySequenceEnd,
        plainTextValue: plainTextValue
      },
      results: results
    }, _extends2));

    var focusIndex = _this3.state.focusIndex;

    var suggestionsCount = (0, _utils.countSuggestions)(_this3.suggestions);
    _this3.setState({
      suggestions: _this3.suggestions,
      focusIndex: focusIndex >= suggestionsCount ? Math.max(suggestionsCount - 1, 0) : focusIndex
    });
  };

  this.addMention = function (_ref2, _ref3) {
    var id = _ref2.id,
        display = _ref2.display;
    var childIndex = _ref3.childIndex,
        querySequenceStart = _ref3.querySequenceStart,
        querySequenceEnd = _ref3.querySequenceEnd,
        plainTextValue = _ref3.plainTextValue;

    // Insert mention in the marked up value at the correct position
    var value = _this3.props.value || '';
    var config = (0, _utils.readConfigFromChildren)(_this3.props.children);
    var mentionsChild = _react.Children.toArray(_this3.props.children)[childIndex];
    var _mentionsChild$props = mentionsChild.props,
        markup = _mentionsChild$props.markup,
        displayTransform = _mentionsChild$props.displayTransform,
        appendSpaceOnAdd = _mentionsChild$props.appendSpaceOnAdd,
        onAdd = _mentionsChild$props.onAdd;


    var start = (0, _utils.mapPlainTextIndex)(value, config, querySequenceStart, 'START');
    var end = start + querySequenceEnd - querySequenceStart;
    var insert = (0, _utils.makeMentionsMarkup)(markup, id, display);
    if (appendSpaceOnAdd) {
      insert += ' ';
    }
    var newValue = (0, _utils.spliceString)(value, start, end, insert);

    // Refocus input and set caret position to end of mention
    _this3.inputRef.focus();

    var displayValue = displayTransform(id, display);
    if (appendSpaceOnAdd) {
      displayValue += ' ';
    }
    var newCaretPosition = querySequenceStart + displayValue.length;
    _this3.setState({
      selectionStart: newCaretPosition,
      selectionEnd: newCaretPosition,
      setSelectionAfterMentionChange: true
    });

    // Propagate change
    var eventMock = { target: { value: newValue } };
    var mentions = (0, _utils.getMentions)(newValue, config);
    var newPlainTextValue = (0, _utils.spliceString)(plainTextValue, querySequenceStart, querySequenceEnd, displayValue);

    _this3.executeOnChange(eventMock, newValue, newPlainTextValue, mentions);

    if (onAdd) {
      onAdd(id, display);
    }

    // Make sure the suggestions overlay is closed
    _this3.clearSuggestions();
  };

  this.isLoading = function () {
    var isLoading = false;
    _react2.default.Children.forEach(_this3.props.children, function (child) {
      isLoading = isLoading || child && child.props.isLoading;
    });
    return isLoading;
  };

  this._queryId = 0;
}, _temp);

/**
 * Returns the computed length property value for the provided element.
 * Note: According to spec and testing, can count on length values coming back in pixels. See https://developer.mozilla.org/en-US/docs/Web/CSS/used_value#Difference_from_computed_value
 */

MentionsInput.propTypes = process.env.NODE_ENV !== "production" ? propTypes : {};
var getComputedStyleLengthProp = function getComputedStyleLengthProp(forElement, propertyName) {
  var length = parseFloat(window.getComputedStyle(forElement, null).getPropertyValue(propertyName));
  return isFinite(length) ? length : 0;
};

var isMobileSafari = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);

var styled = (0, _substyle.defaultStyle)({
  position: 'relative',
  overflowY: 'visible',

  input: {
    display: 'block',
    position: 'absolute',
    top: 0,
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    width: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit'
  },

  '&multiLine': {
    input: _extends({
      width: '100%',
      height: '100%',
      bottom: 0,
      overflow: 'hidden',
      resize: 'none'

    }, isMobileSafari ? {
      marginTop: 1,
      marginLeft: -3
    } : null)
  }
}, function (_ref4) {
  var singleLine = _ref4.singleLine;
  return {
    '&singleLine': singleLine,
    '&multiLine': !singleLine
  };
});

exports.default = styled(MentionsInput);