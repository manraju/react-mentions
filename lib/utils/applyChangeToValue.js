'use strict';

exports.__esModule = true;

var _mapPlainTextIndex = require('./mapPlainTextIndex');

var _mapPlainTextIndex2 = _interopRequireDefault(_mapPlainTextIndex);

var _getPlainText = require('./getPlainText');

var _getPlainText2 = _interopRequireDefault(_getPlainText);

var _spliceString = require('./spliceString');

var _spliceString2 = _interopRequireDefault(_spliceString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Applies a change from the plain text textarea to the underlying marked up value
// guided by the textarea text selection ranges before and after the change
var applyChangeToValue = function applyChangeToValue(value, plainTextValue, _ref, config) {
  var selectionStartBefore = _ref.selectionStartBefore,
      selectionEndBefore = _ref.selectionEndBefore,
      selectionEndAfter = _ref.selectionEndAfter;

  var oldPlainTextValue = (0, _getPlainText2.default)(value, config);

  var lengthDelta = oldPlainTextValue.length - plainTextValue.length;
  if (selectionStartBefore === 'undefined') {
    selectionStartBefore = selectionEndAfter + lengthDelta;
  }

  if (selectionEndBefore === 'undefined') {
    selectionEndBefore = selectionStartBefore;
  }

  // Fixes an issue with replacing combined characters for complex input. Eg like acented letters on OSX
  if (selectionStartBefore === selectionEndBefore && selectionEndBefore === selectionEndAfter && oldPlainTextValue.length === plainTextValue.length) {
    selectionStartBefore = selectionStartBefore - 1;
  }

  // extract the insertion from the new plain text value
  var insert = plainTextValue.slice(selectionStartBefore, selectionEndAfter);

  // handling for Backspace key with no range selection
  var spliceStart = Math.min(selectionStartBefore, selectionEndAfter);

  var spliceEnd = selectionEndBefore;
  if (selectionStartBefore === selectionEndAfter) {
    // handling for Delete key with no range selection
    spliceEnd = Math.max(selectionEndBefore, selectionStartBefore + lengthDelta);
  }

  var mappedSpliceStart = (0, _mapPlainTextIndex2.default)(value, config, spliceStart, 'START');
  var mappedSpliceEnd = (0, _mapPlainTextIndex2.default)(value, config, spliceEnd, 'END');

  var controlSpliceStart = (0, _mapPlainTextIndex2.default)(value, config, spliceStart, 'NULL');
  var controlSpliceEnd = (0, _mapPlainTextIndex2.default)(value, config, spliceEnd, 'NULL');
  var willRemoveMention = controlSpliceStart === null || controlSpliceEnd === null;

  var newValue = (0, _spliceString2.default)(value, mappedSpliceStart, mappedSpliceEnd, insert);

  if (!willRemoveMention) {
    // test for auto-completion changes
    var controlPlainTextValue = (0, _getPlainText2.default)(newValue, config);
    if (controlPlainTextValue !== plainTextValue) {
      // some auto-correction is going on

      // find start of diff
      spliceStart = 0;
      while (plainTextValue[spliceStart] === controlPlainTextValue[spliceStart]) {
        spliceStart++;
      } // extract auto-corrected insertion
      insert = plainTextValue.slice(spliceStart, selectionEndAfter);

      // find index of the unchanged remainder
      spliceEnd = oldPlainTextValue.lastIndexOf(plainTextValue.substring(selectionEndAfter));

      // re-map the corrected indices
      mappedSpliceStart = (0, _mapPlainTextIndex2.default)(value, config, spliceStart, 'START');
      mappedSpliceEnd = (0, _mapPlainTextIndex2.default)(value, config, spliceEnd, 'END');
      newValue = (0, _spliceString2.default)(value, mappedSpliceStart, mappedSpliceEnd, insert);
    }
  }

  return newValue;
};

exports.default = applyChangeToValue;
module.exports = exports['default'];