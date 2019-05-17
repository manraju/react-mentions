'use strict';

exports.__esModule = true;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _placeholders = require('./placeholders');

var _placeholders2 = _interopRequireDefault(_placeholders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findPositionOfCapturingGroup = function findPositionOfCapturingGroup(markup, parameterName) {
  (0, _invariant2.default)(parameterName === 'id' || parameterName === 'display', 'Second arg must be either "id" or "display", got: "' + parameterName + '"');

  // find positions of placeholders in the markup
  var indexDisplay = markup.indexOf(_placeholders2.default.display);
  var indexId = markup.indexOf(_placeholders2.default.id);

  // set indices to null if not found
  if (indexDisplay < 0) indexDisplay = null;
  if (indexId < 0) indexId = null;

  // markup must contain one of the mandatory placeholders
  (0, _invariant2.default)(indexDisplay !== null || indexId !== null, 'The markup \'' + markup + '\' does not contain either of the placeholders \'__id__\' or \'__display__\'');

  if (indexDisplay !== null && indexId !== null) {
    // both placeholders are used, return 0 or 1 depending on the position of the requested parameter
    return parameterName === 'id' && indexId <= indexDisplay || parameterName === 'display' && indexDisplay <= indexId ? 0 : 1;
  }

  // just one placeholder is being used, we'll use the captured string for both parameters
  return 0;
};

exports.default = findPositionOfCapturingGroup;
module.exports = exports['default'];