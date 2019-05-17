import iterateMentionsMarkup from './iterateMentionsMarkup';

var getPlainText = function getPlainText(value, config) {
  var result = '';
  iterateMentionsMarkup(value, config, function (match, index, plainTextIndex, id, display) {
    result += display;
  }, function (plainText) {
    result += plainText;
  });
  return result;
};

export default getPlainText;