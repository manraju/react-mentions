import PLACEHOLDERS from './placeholders';
import escapeRegex from './escapeRegex';

var markupToRegex = function markupToRegex(markup) {
  var escapedMarkup = escapeRegex(markup);
  var charAfterDisplay = markup[markup.indexOf(PLACEHOLDERS.display) + PLACEHOLDERS.display.length];
  var charAfterId = markup[markup.indexOf(PLACEHOLDERS.display) + PLACEHOLDERS.display.length];
  return new RegExp(escapedMarkup.replace(PLACEHOLDERS.display, '([^' + escapeRegex(charAfterDisplay || '') + ']+?)').replace(PLACEHOLDERS.id, '([^' + escapeRegex(charAfterId || '') + ']+?)'));
};

export default markupToRegex;