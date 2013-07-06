var es = require('event-stream'),
  clone = require('clone'),
  path = require('path'),
  coffee = require('coffee-script'),
  util = require('gulp-util');

module.exports = function(opt){
  // clone options
  opt = opt ? clone(opt) : {};

  function modifyFile(file, cb){
    var newFile = clone(file);

    newFile.path = util.replaceExtension(newFile.path, ".js");
    newFile.shortened = util.replaceExtension(newFile.shortened, ".js");
    newFile.contents = coffee.compile(String(newFile.contents), opt);
    cb(null, newFile);
  }

  return es.map(modifyFile);

};