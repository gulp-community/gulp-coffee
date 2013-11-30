var es = require('event-stream'),
  coffee = require('coffee-script'),
  util = require('gulp-util'),
  formatError = require('./lib/formatError');

module.exports = function(opt){
  function modifyFile(file, cb){
    try {
      file.contents = coffee.compile(String(file.contents), opt);
    } catch (err) {
      var newError = formatError(file, err);
      return cb(newError);
    }
    file.path = util.replaceExtension(file.path, ".js");
    file.shortened = util.replaceExtension(file.shortened, ".js");
    cb(null, file);
  }

  return es.map(modifyFile);

};