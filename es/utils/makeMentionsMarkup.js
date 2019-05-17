import PLACEHOLDERS from './placeholders';

var makeMentionsMarkup = function makeMentionsMarkup(markup, id, display) {
  return markup.replace(PLACEHOLDERS.id, id).replace(PLACEHOLDERS.display, display);
};

export default makeMentionsMarkup;