import invariant from 'invariant';

var combineRegExps = function combineRegExps(regExps) {
  var serializedRegexParser = /^\/(.+)\/(\w+)?$/;
  return new RegExp(regExps.map(function (regex) {
    var _serializedRegexParse = serializedRegexParser.exec(regex.toString()),
        regexString = _serializedRegexParse[1],
        regexFlags = _serializedRegexParse[2];

    invariant(!regexFlags, 'RegExp flags are not supported. Change /' + regexString + '/' + regexFlags + ' into /' + regexString + '/');

    return '(' + regexString + ')';
  }).join('|'), 'g');
};

export default combineRegExps;