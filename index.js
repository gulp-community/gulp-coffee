var through = require('through2');
var coffee = require('coffee-script');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Buffer = require('buffer').Buffer;
var applySourceMap = require('vinyl-sourcemaps-apply');
var path = require('path');
var merge = require('merge');

module.exports = function (opt) {
  function transform(file, enc, cb) {
    if (file.isNull()) cb(null, file); // pass along
    if (file.isStream()) return cb(new PluginError('gulp-coffee', 'Streaming not supported'));

    var data;
    var str = file.contents.toString('utf8');
    var dest = gutil.replaceExtension(file.path, '.js');

    var options = merge({
      bare: false,
      header: false,
      sourceMap: !!file.sourceMap,
      sourceRoot: false,
      literate: /\.(litcoffee|coffee\.md)$/.test(file.path),
      filename: file.path,
      sourceFiles: [path.basename(file.path)],
      generatedFile: path.basename(dest)
    }, opt);

    try {
      data = coffee.compile(str, options);

      if (data.v3SourceMap && file.sourceMap) {
        applySourceMap(file, data.v3SourceMap);
        file.contents = new Buffer(data.js);
      } else {
        file.contents = new Buffer(data);
      }

      file.path = dest;
      cb(null, file);

    } catch (err) {
      cb(new PluginError('gulp-coffee', err));
    }
  }

  return through.obj(transform);
};
