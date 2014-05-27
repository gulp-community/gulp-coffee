var es = require('event-stream');
var coffee = require('coffee-script');
var gutil = require('gulp-util');
var Buffer = require('buffer').Buffer;
var applySourceMap = require('vinyl-sourcemaps-apply');
var path = require('path');

module.exports = function (opt) {
  function modifyFile(file) {
    if (file.isNull()) return this.emit('data', file); // pass along
    if (file.isStream()) return this.emit('error', new Error("gulp-coffee: Streaming not supported"));

    var data;
    var str = file.contents.toString('utf8');
    var dest = gutil.replaceExtension(file.path, ".js");

    var options = {
      literate: /\.(litcoffee|coffee\.md)$/.test(file.path)
    };

    // TODO: this is horrible, figure out a better way to copy these options over
    if (opt) {
      options = {
        bare: opt.bare != null ? !! opt.bare : false,
        header: opt.header != null ? !! opt.header : false,
        literate: opt.literate != null ? !! opt.literate : options.literate,
        filename: file.path,
        sourceFiles: [path.basename(file.path)],
        generatedFile: path.basename(dest)
      };
    }

    if (file.sourceMap) options.sourceMap = true;

    try {
      data = coffee.compile(str, options);
    } catch (err) {
      return this.emit('error', new Error(err));
    }

    if (data.v3SourceMap && file.sourceMap) {
      applySourceMap(file, data.v3SourceMap);
      file.contents = new Buffer(data.js);
    } else {
      file.contents = new Buffer(data);
    }

    file.path = dest;
    this.emit('data', file);
  }

  return es.through(modifyFile);
};
