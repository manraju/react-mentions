import iterateMentionsMarkup from './iterateMentionsMarkup';

var getMentions = function getMentions(value, config) {
  var mentions = [];
  iterateMentionsMarkup(value, config, function (match, index, plainTextIndex, id, display, childIndex, start) {
    mentions.push({
      id: id,
      display: display,
      childIndex: childIndex,
      index: index,
      plainTextIndex: plainTextIndex
    });
  });
  return mentions;
};

export default getMentions;