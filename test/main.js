var coffee = require('../');
var should = require('should');
var coffeescript = require('coffee-script');
var gutil = require('gulp-util');
require('mocha');

describe('gulp-coffee', function() {
  describe('coffee()', function() {
    it('should concat two files', function(done) {
      var stream = coffee({bare: true});
      var fakeFile = new gutil.File({
        path: "/home/contra/test/file.coffee",
        base: "/home/contra/test/",
        cwd: "/home/contra/",
        contents: new Buffer("a = 2")
      });

      var expected = coffeescript.compile(String(fakeFile.contents), {bare:true});
      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("/home/contra/test/file.js");
        newFile.relative.should.equal("file.js");
        String(newFile.contents).should.equal(expected);
        done();
      });
      stream.write(fakeFile);
    });

    it('should emit errors correctly', function(done) {
      var stream = coffee({bare: true});
      var fakeFile = new gutil.File({
        path: "/home/contra/test/file.coffee",
        base: "/home/contra/test/",
        cwd: "/home/contra/",
        contents: new Buffer("if a()\r\n  then huh")
      });

      var expected = "";

      stream.on('error', function(err){
        err.message.indexOf(fakeFile.path).should.not.equal(-1);
        done();
      });
      stream.on('data', function(newFile){
        throw new Error("no file should have been emitted!");
      });
      stream.write(fakeFile);
    });

  });
});
