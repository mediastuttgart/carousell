module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			folders: [
				'dist/'
			]
		},
		jshint: {
			files: [
				'gruntfile.js',
				'src/carousell.js'
			],
			options: {
				browser: true,
				globals: {
					define: true,
					eventie: true,
					Hammer: true,
					TweenMax: true,
					Expo: true
				}
			}
		},
		copy: {
			dist: {
				files: [
					{
						src: ['src/carousell.js'],
						dest: 'dist/carousell.js'
					}
				]
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					'bower_components/eventEmitter/EventEmitter.js',
					'bower_components/eventie/eventie.js',
					'bower_components/hammerjs/dist/hammer.js',
					'bower_components/greensock-js/src/uncompressed/TweenMax.js',
					'src/carousell.js'
				],
				dest: 'dist/carousell.pkgd.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> | version <%= pkg.version %> (<%= grunt.template.today("dd-mm-yyyy") %>) | author: <%= pkg.author.name %> | license: <%= pkg.license.type %> (<%= pkg.license.url %>) */\n'
			},
			dist: {
				files: {
					'dist/carousell.min.js': ['src/carousell.js'],
					'dist/carousell.pkgd.min.js': ['dist/carousell.pkgd.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['clean', 'jshint', 'copy', 'concat', 'uglify']);
};
