/*jslint node: true*/
"use strict";

var Glue = require('gluejs'),
	path = require('path');

module.exports = function(grunt) {
	// Use multitask because multiple targets are supported
	grunt.registerMultiTask('gluejs', 'Grunt plugin for GlueJS v2.2+', function() {
		var options = this.options(),
			done = this.async(),
			base = process.cwd();

		// Iterate over all specified file groups.
		this.files.forEach(function(file) {
			var glue = new Glue();

			// Pass all options to glue
			if (options.include) {
				glue.include(options.include);
			}
			if (options.exclude) {
				glue.exclude(options.exclude);
			}
			if (options.export) {
				glue.export(options.export);
			}
			if (options.basepath) {
				glue.basepath(path.resolve(options.basepath));
				// We need to tell GlueJS to work from the basepath dir., not from Gruntfile dir.
				grunt.file.setBase(path.resolve(options.basepath));
			} else {
				glue.basepath(base); // process.cwd()
			}
			glue.main(options.main || 'index.js');
			if (options.replace) {
				glue.replace(options.replace);
			}
			if (options.remap) {
				if ('object' !== grunt.util.kindOf(options.remap)) {
					grunt.log.error('remap options should be provided as an Object where key is the module being mapped and value is a module name or expression');
				} else {
					Object.keys(options.remap).forEach(function(key) {
						glue.remap(key, options.remap[key]);
					});
				}
			}
			if (options['source-url']) {
				glue.set('source-url', options['source-url']);
			}
			if (options.command) {
				glue.set('command', options.command);
			}
			if (options.transform) {
				glue.set('transform', options.transform);
			}
			if (options.jobs) {
				glue.set('jobs', options.jobs);
			}
			if (options['cache-path']) {
				glue.set('cache-path', options['cache-path']);
			}
			if (options['cache-method']) {
				glue.set('cache-method', options['cache-method']);
			}
			if (options.cache) {
				glue.set('cache', options.cache);
			}
			if (!!options.globalRequire) {
				glue.set('global-require', true);
			}
			if (options.amd) {
				glue.set('amd', options.amd);
			}
			if (options.verbose) {
				glue.set('verbose', options.verbose);
			}
			if (options.silent) {
				glue.set('silent', options.silent);
			}

			// Add all the source files, except if it is the destination file
			file.src.forEach(function(src) {
				if (src !== file.dest) {
					glue.include(src);
				}
			});

			// Reinstate the original working directory, if it was changed for basepath
			if (options.basepath) {
				grunt.file.setBase(base);
			}

			grunt.log.write('Glueing ' + file.dest + '...');
			glue.render(function(err, output) {
				if (err) {
					grunt.log.error();
					grunt.event.emit('gluejs.fail');
					done(false);
				} else {
					grunt.file.write(file.dest, output);
					grunt.event.emit('gluejs.done');
					grunt.log.ok();
					done();
				}
			});
		});
	});
};
