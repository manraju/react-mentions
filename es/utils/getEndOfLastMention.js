import getMentions from './getMentions';

var getEndOfLastMention = function getEndOfLastMention(value, config) {
  var mentions = getMentions(value, config);
  var lastMention = mentions[mentions.length - 1];
  return lastMention ? lastMention.plainTextIndex + lastMention.display.length : 0;
};

export default getEndOfLastMention;