/*jslint node: true*/
"use strict";

module.exports = function(grunt) {
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-release');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-watch');

	var srcFiles = [
		'Gruntfile.js',
		'index.js',
		'tasks/**/*.js'
	];
	var testFiles = [
		'test/**/*.test.js'
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: srcFiles,
			options: {
				curly: true,
				immed: true,
				newcap: true,
				noarg: true,
				sub: true,
				boss: true,
				eqnull: true,
				globals: {
				}
			}
		},
		mochaTest: {
			files: testFiles
		},
		watch: {
			files: [srcFiles, testFiles],
			tasks: 'check-code'
		},
		gluejs: {
			directory: {
				src: 'test/fixtures/package/*.js',
				dest: 'test/fixtures/index.js'
			},
			export_and_basepath: {
				options: {
					export: 'App',
					basepath: 'test/fixtures/package'
				},
				src: 'a.js',
				dest: 'test/fixtures/app.js'
			},
			replace: {
				options: {
					replace: {
						jquery: 'window.$'
					}
				},
				src: 'test/fixtures/package/jquery.js',
				dest: 'test/fixtures/jquery.js'
			},
			main: {
				options: {
					main: 'main.js'
				},
				src: 'test/fixtures/package/*.js',
				dest: 'test/fixtures/main.js'
			},
			amd: {
				options: {
					amd: true
				},
				src: 'test/fixtures/package/*.js',
				dest: 'test/fixtures/amd.js'
			}
		}
	});

	// Default task(s).
	grunt.registerTask('check-code', ['jshint', 'gluejs', 'mochaTest']);
	grunt.registerTask('default', ['check-code']);
};
