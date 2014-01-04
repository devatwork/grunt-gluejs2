var fs = require('fs'),
	should = require('should');

describe('gluejs', function() {
	after(function() {
		fs.unlinkSync('test/fixtures/index.js');
		fs.unlinkSync('test/fixtures/app.js');
		fs.unlinkSync('test/fixtures/jquery.js');
		fs.unlinkSync('test/fixtures/main.js');
		fs.unlinkSync('test/fixtures/amd.js');
	});

	it('should build a directory module', function(done) {
		fs.exists('test/fixtures/main.js', function(exists) {
			exists.should.be.true;
			done();
		});
	});

	it('should export to the given export option', function(done) {
		fs.readFile('test/fixtures/app.js', 'utf8', function(err, content) {
			content.should.match(/App = require\(\'index.js\'\);/);
			done();
		});
	});

	it('should replace specified values', function(done) {
		fs.readFile('test/fixtures/jquery.js', 'utf8', function(err, content) {
			content.should.match(/"jquery": \{ exports: window\.\$ \}/);
			done();
		});
	});

	it('should use the specified main script', function(done) {
		fs.readFile('test/fixtures/main.js', 'utf8', function(err, content) {
			content.should.match(/App = require\(\'main\.js\'\);/);
			done();
		});
	});

	it('should set the specified base path', function(done) {
		fs.readFile('test/fixtures/app.js', 'utf8', function(err, content) {
			content.should.match(/require\.m\[0\] = \{(.|\n)\"a\.js\"/);
			done();
		});
	});

	it('should export using amd', function(done) {
		fs.readFile('test/fixtures/amd.js', 'utf8', function(err, content) {
			content.should.match(/define\("App"\, function\(\) \{ return require\(\'index\.js\'\); \}/);
			done();
		});
	});
});
