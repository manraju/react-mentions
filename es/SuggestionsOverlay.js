var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { defaultStyle } from 'substyle';

import { countSuggestions } from './utils';
import Suggestion from './Suggestion';
import LoadingIndicator from './LoadingIndicator';

var SuggestionsOverlay = (_temp = _class = function (_Component) {
  _inherits(SuggestionsOverlay, _Component);

  function SuggestionsOverlay() {
    _classCallCheck(this, SuggestionsOverlay);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  SuggestionsOverlay.prototype.componentDidUpdate = function componentDidUpdate() {
    if (!this.suggestionsRef || this.suggestionsRef.offsetHeight >= this.suggestionsRef.scrollHeight || !this.props.scrollFocusedIntoView) {
      return;
    }

    var scrollTop = this.suggestionsRef.scrollTop;

    var _suggestionsRef$child = this.suggestionsRef.children[this.props.focusIndex].getBoundingClientRect(),
        top = _suggestionsRef$child.top,
        bottom = _suggestionsRef$child.bottom;

    var _suggestionsRef$getBo = this.suggestionsRef.getBoundingClientRect(),
        topContainer = _suggestionsRef$getBo.top;

    top = top - topContainer + scrollTop;
    bottom = bottom - topContainer + scrollTop;

    if (top < scrollTop) {
      this.suggestionsRef.scrollTop = top;
    } else if (bottom > this.suggestionsRef.offsetHeight) {
      this.suggestionsRef.scrollTop = bottom - this.suggestionsRef.offsetHeight;
    }
  };

  SuggestionsOverlay.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        suggestions = _props.suggestions,
        isLoading = _props.isLoading,
        style = _props.style,
        onMouseDown = _props.onMouseDown;

    // do not show suggestions until there is some data

    if (countSuggestions(suggestions) === 0 && !isLoading) {
      return null;
    }

    return React.createElement(
      'div',
      _extends({}, style, { onMouseDown: onMouseDown }),
      React.createElement(
        'ul',
        _extends({
          ref: function ref(el) {
            _this2.suggestionsRef = el;
          }
        }, style('list')),
        this.renderSuggestions()
      ),
      this.renderLoadingIndicator()
    );
  };

  SuggestionsOverlay.prototype.renderSuggestions = function renderSuggestions() {
    var _this3 = this;

    return Object.values(this.props.suggestions).reduce(function (accResults, _ref) {
      var results = _ref.results,
          queryInfo = _ref.queryInfo;
      return [].concat(accResults, results.map(function (result, index) {
        return _this3.renderSuggestion(result, queryInfo, accResults.length + index);
      }));
    }, []);
  };

  SuggestionsOverlay.prototype.renderSuggestion = function renderSuggestion(result, queryInfo, index) {
    var _this4 = this;

    var id = this.getID(result);
    var isFocused = index === this.props.focusIndex;
    var childIndex = queryInfo.childIndex,
        query = queryInfo.query;
    var renderSuggestion = Children.toArray(this.props.children)[childIndex].props.renderSuggestion;


    return React.createElement(Suggestion, {
      style: this.props.style('item'),
      key: childIndex + '-' + id,
      id: id,
      query: query,
      index: index,
      renderSuggestion: renderSuggestion,
      suggestion: result,
      focused: isFocused,
      onClick: function onClick() {
        return _this4.select(result, queryInfo);
      },
      onMouseEnter: function onMouseEnter() {
        return _this4.handleMouseEnter(index);
      }
    });
  };

  SuggestionsOverlay.prototype.getID = function getID(suggestion) {
    if (suggestion instanceof String) {
      return suggestion;
    }

    return suggestion.id;
  };

  SuggestionsOverlay.prototype.renderLoadingIndicator = function renderLoadingIndicator() {
    if (!this.props.isLoading) {
      return;
    }

    return React.createElement(LoadingIndicator, this.props.style('loadingIndicator'));
  };

  SuggestionsOverlay.prototype.handleMouseEnter = function handleMouseEnter(index, ev) {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(index);
    }
  };

  SuggestionsOverlay.prototype.select = function select(suggestion, queryInfo) {
    this.props.onSelect(suggestion, queryInfo);
  };

  return SuggestionsOverlay;
}(Component), _class.defaultProps = {
  suggestions: {},
  onSelect: function onSelect() {
    return null;
  }
}, _temp);
SuggestionsOverlay.propTypes = process.env.NODE_ENV !== "production" ? {
  suggestions: PropTypes.object.isRequired,
  focusIndex: PropTypes.number,
  scrollFocusedIntoView: PropTypes.bool,
  isLoading: PropTypes.bool,
  onSelect: PropTypes.func,

  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
} : {};


var styled = defaultStyle(function (_ref2) {
  var position = _ref2.position;
  return _extends({
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'white',
    marginTop: 40,
    minWidth: 100
  }, position, {

    list: {
      margin: 0,
      padding: 0,
      listStyleType: 'none'
    }
  });
});

export default styled(SuggestionsOverlay);