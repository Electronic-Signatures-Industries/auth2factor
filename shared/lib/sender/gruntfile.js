/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'spec/**/*.js']
            }
        },
        babel: {
            es6: {
                files: [
                    {
                        expand: true,
                        //          cwd: "<%= cwd %>",
                        src: ['*.es6','lib/**/*.es6', 'spec/**/*.es6'],
                        //          dest: "<%= cwd %>",
                        ext: ".js"
        }
    ],
                options: {}
            }
        }
    });


    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('jshinting', ['jshint']);
    grunt.registerTask('build', ['babel:es6']);

};