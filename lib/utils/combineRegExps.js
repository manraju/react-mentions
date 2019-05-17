'use strict';

exports.__esModule = true;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combineRegExps = function combineRegExps(regExps) {
  var serializedRegexParser = /^\/(.+)\/(\w+)?$/;
  return new RegExp(regExps.map(function (regex) {
    var _serializedRegexParse = serializedRegexParser.exec(regex.toString()),
        regexString = _serializedRegexParse[1],
        regexFlags = _serializedRegexParse[2];

    (0, _invariant2.default)(!regexFlags, 'RegExp flags are not supported. Change /' + regexString + '/' + regexFlags + ' into /' + regexString + '/');

    return '(' + regexString + ')';
  }).join('|'), 'g');
};

exports.default = combineRegExps;
module.exports = exports['default'];