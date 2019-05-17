var countSuggestions = function countSuggestions(suggestions) {
  return Object.values(suggestions).reduce(function (acc, _ref) {
    var results = _ref.results;
    return acc + results.length;
  }, 0);
};

export default countSuggestions;