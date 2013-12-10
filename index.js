var es = require('event-stream');
var coffee = require('coffee-script');
var gutil = require('gulp-util');
var formatError = require('./lib/formatError');

module.exports = function(opt){
  function modifyFile(file, cb){
    try {
      file.contents = coffee.compile(String(file.contents), opt);
    } catch (err) {
      var newError = formatError(file, err);
      return cb(newError);
    }
    file.path = gutil.replaceExtension(file.path, ".js");
    cb(null, file);
  }

  return es.map(modifyFile);
};