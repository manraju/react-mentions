import mapPlainTextIndex from './mapPlainTextIndex';
import getPlainText from './getPlainText';
import spliceString from './spliceString';

// Applies a change from the plain text textarea to the underlying marked up value
// guided by the textarea text selection ranges before and after the change
var applyChangeToValue = function applyChangeToValue(value, plainTextValue, _ref, config) {
  var selectionStartBefore = _ref.selectionStartBefore,
      selectionEndBefore = _ref.selectionEndBefore,
      selectionEndAfter = _ref.selectionEndAfter;

  var oldPlainTextValue = getPlainText(value, config);

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

  var mappedSpliceStart = mapPlainTextIndex(value, config, spliceStart, 'START');
  var mappedSpliceEnd = mapPlainTextIndex(value, config, spliceEnd, 'END');

  var controlSpliceStart = mapPlainTextIndex(value, config, spliceStart, 'NULL');
  var controlSpliceEnd = mapPlainTextIndex(value, config, spliceEnd, 'NULL');
  var willRemoveMention = controlSpliceStart === null || controlSpliceEnd === null;

  var newValue = spliceString(value, mappedSpliceStart, mappedSpliceEnd, insert);

  if (!willRemoveMention) {
    // test for auto-completion changes
    var controlPlainTextValue = getPlainText(newValue, config);
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
      mappedSpliceStart = mapPlainTextIndex(value, config, spliceStart, 'START');
      mappedSpliceEnd = mapPlainTextIndex(value, config, spliceEnd, 'END');
      newValue = spliceString(value, mappedSpliceStart, mappedSpliceEnd, insert);
    }
  }

  return newValue;
};

export default applyChangeToValue;