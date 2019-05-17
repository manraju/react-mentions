'use strict';

exports.__esModule = true;

var _placeholders = require('./placeholders');

var _placeholders2 = _interopRequireDefault(_placeholders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeMentionsMarkup = function makeMentionsMarkup(markup, id, display) {
  return markup.replace(_placeholders2.default.id, id).replace(_placeholders2.default.display, display);
};

exports.default = makeMentionsMarkup;
module.exports = exports['default'];