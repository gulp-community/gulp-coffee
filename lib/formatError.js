var helpers = require('coffee-script').helpers;

module.exports = function(file, err) {
  var msg = helpers.prettyErrorMessage(err, file.path, String(file.contents), true);
  return new Error(msg);
};