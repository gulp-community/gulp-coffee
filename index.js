var es = require('event-stream'),
  coffee = require('coffee-script'),
  util = require('gulp-util');

module.exports = function(opt){
  function modifyFile(file, cb){
    file.path = util.replaceExtension(file.path, ".js");
    file.shortened = util.replaceExtension(file.shortened, ".js");
    file.contents = coffee.compile(String(file.contents), opt);
    cb(null, file);
  }

  return es.map(modifyFile);

};