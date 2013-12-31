var es = require('event-stream');
var coffee = require('coffee-script');
var gutil = require('gulp-util');
var formatError = require('./lib/formatError');
var Buffer = require('buffer').Buffer;

module.exports = function(opt){
  function modifyFile(file, cb){
    if (file.isNull()) return cb(null, file); // pass along
    if (file.isStream()) return cb(new Error("gulp-coffee: Streaming not supported"));

    var str = file.contents.toString('utf8');

    try {
      file.contents = new Buffer(coffee.compile(str, opt));
    } catch (err) {
      var newError = formatError(file, err);
      return cb(newError);
    }
    file.path = gutil.replaceExtension(file.path, ".js");
    cb(null, file);
  }

  return es.map(modifyFile);
};