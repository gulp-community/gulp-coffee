var es = require('event-stream');
var coffee = require('coffee-script');
var gutil = require('gulp-util');
var formatError = require('./lib/formatError');
var Buffer = require('buffer').Buffer;

module.exports = function(opt){
  function modifyFile(file, cb){
    try {
      file.contents = new Buffer(coffee.compile(String(file.contents), opt));
    } catch (err) {
      var newError = formatError(file, err);
      return cb(newError);
    }
    file.path = gutil.replaceExtension(file.path, ".js");
    cb(null, file);
  }

  return es.map(modifyFile);
};