var coffee = require('../');
var should = require('should');
var coffeescript = require('coffee-script');
var gutil = require('gulp-util');
var fs = require('fs');
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

    it('should compile a file (no bare)', function(done) {
      var stream = coffee();
      var fakeFile = new gutil.File({
        path: "test/fixtures/grammar.coffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/grammar.coffee' )
      });
      var expected = coffeescript.compile(String(fakeFile.contents));

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/grammar.js");
        newFile.relative.should.equal("grammar.js");
        String(newFile.contents).should.equal(expected);
        done();
      });
      stream.write(fakeFile);
    });

    it('should compile a file (with bare)', function(done) {
      var stream = coffee({bare: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/grammar.coffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/grammar.coffee' )
      });
      var expected = coffeescript.compile(String(fakeFile.contents), {bare: true});

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/grammar.js");
        newFile.relative.should.equal("grammar.js");
        String(newFile.contents).should.equal(expected);
        done();
      });
      stream.write(fakeFile);
    });

    it('should compile a file with source map', function(done) {
      var stream = coffee({sourceMap: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/grammar.coffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/grammar.coffee' )
      });

      var expectedFilenames = ['grammar.js.map', 'grammar.js']
      var expected = coffeescript.compile(String(fakeFile.contents), {
        sourceMap: true,
        sourceFiles: ['grammar.coffee'],
        generatedFile: expectedFilenames[1]
      });
      expected = [
        expected.v3SourceMap,
        expected.js + "\n/*\n//@ sourceMappingURL=" + expectedFilenames[0] + "\n*/\n"
      ];
      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        var expectedFilename = expectedFilenames.shift()
        newFile.path.should.equal("test/fixtures/" + expectedFilename);
        newFile.relative.should.equal(expectedFilename);
        String(newFile.contents).should.equal(expected.shift());
        if(!expectedFilenames.length) done();
      });
      stream.write(fakeFile);
    });

    it('should compile a file with bare and with source map', function(done) {
      var stream = coffee({bare: true, sourceMap: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/grammar.coffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/grammar.coffee' )
      });

      var expectedFilenames = ['grammar.js.map', 'grammar.js']
      var expected = coffeescript.compile(String(fakeFile.contents), {
        bare: true,
        sourceMap: true,
        sourceFiles: ['grammar.coffee'],
        generatedFile: expectedFilenames[1]
      });
      expected = [
        expected.v3SourceMap,
        expected.js + "\n/*\n//@ sourceMappingURL=" + expectedFilenames[0] + "\n*/\n"
      ];

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        expectedFilename = expectedFilenames.shift()
        newFile.path.should.equal("test/fixtures/" + expectedFilename);
        newFile.relative.should.equal(expectedFilename);
        String(newFile.contents).should.equal(expected.shift());
        if(!expectedFilenames.length) done();
      });
      stream.write(fakeFile);
    });

    it('should compile a literate file', function(done) {
      var stream = coffee({literate: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/journo.litcoffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/journo.litcoffee' )
      });

      var expected = coffeescript.compile(String(fakeFile.contents), {literate: true});

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/journo.js");
        newFile.relative.should.equal("journo.js");
        String(newFile.contents).should.equal(expected);
        done();
      });
      stream.write(fakeFile);
    });

    it('should compile a literate file (implicit)', function(done) {
      var stream = coffee();
      var fakeFile = new gutil.File({
        path: "test/fixtures/journo.litcoffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/journo.litcoffee' )
      });

      var expected = coffeescript.compile(String(fakeFile.contents), {literate: true});

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/journo.js");
        newFile.relative.should.equal("journo.js");
        String(newFile.contents).should.equal(expected);
        done();
      });
      stream.write(fakeFile);
    });

    it('should compile a literate file (with bare)', function(done) {
      var stream = coffee({literate: true, bare: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/journo.litcoffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/journo.litcoffee' )
      });

      var expected = coffeescript.compile(String(fakeFile.contents), {literate: true, bare: true});

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal("test/fixtures/journo.js");
        newFile.relative.should.equal("journo.js");
        String(newFile.contents).should.equal(expected);
        done();
      });
      stream.write(fakeFile);
    });

    it('should compile a literate file with source map', function(done) {
      var stream = coffee({literate: true, sourceMap: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/journo.litcoffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/journo.litcoffee' )
      });

      var expectedFilenames = ['journo.js.map', 'journo.js']
      var expected = coffeescript.compile(String(fakeFile.contents), {
        literate: true,
        sourceMap: true,
        sourceFiles: ['journo.litcoffee'],
        generatedFile: expectedFilenames[1]
      });
      expected = [
        expected.v3SourceMap,
        expected.js + "\n/*\n//@ sourceMappingURL=" + expectedFilenames[0] + "\n*/\n"
      ];

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        expectedFilename = expectedFilenames.shift()
        newFile.path.should.equal("test/fixtures/" + expectedFilename);
        newFile.relative.should.equal(expectedFilename);
        String(newFile.contents).should.equal(expected.shift());
        if(!expectedFilenames.length) done();
      });
      stream.write(fakeFile);
    });

    it('should compile a literate file with bare and with source map', function(done) {
      var stream = coffee({literate: true, bare: true, sourceMap: true});
      var fakeFile = new gutil.File({
        path: "test/fixtures/journo.litcoffee",
        base: "test/fixtures",
        cwd: "test/",
        contents: fs.readFileSync( 'test/fixtures/journo.litcoffee' )
      });

      var expectedFilenames = ['journo.js.map', 'journo.js']
      var expected = coffeescript.compile(fakeFile.contents.toString('utf8'), {
        literate: true,
        bare: true,
        sourceMap: true,
        sourceFiles: ['journo.litcoffee'],
        generatedFile: expectedFilenames[1]
      });
      expected = [
        expected.v3SourceMap,
        expected.js + "\n/*\n//@ sourceMappingURL=" + expectedFilenames[0] + "\n*/\n"
      ];

      stream.on('error', done);
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        expectedFilename = expectedFilenames.shift()
        newFile.path.should.equal("test/fixtures/" + expectedFilename);
        newFile.relative.should.equal(expectedFilename);
        String(newFile.contents).should.equal(expected.shift());
        if(!expectedFilenames.length) done();
      });
      stream.write(fakeFile);
    });
  });
});
