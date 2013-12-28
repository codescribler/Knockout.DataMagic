/**
 * Created by Danny on 27/12/13.
 */
module.exports = function(grunt){

    grunt.initConfig({
        jasmine : {
            pivotal : {
                src: ['javascripts/app/*.js', 'javascripts/app/adapters/*.js'],
                options:{
                    specs   : 'javascripts/tests/spec/*.js',
                    vendor  : ['javascripts/libs/jquery-1.10.2.min.js', 'javascripts/libs/bootstrap.min.js', 'javascripts/libs/knockout-3.0.0.js', 'javascripts/libs/firebase/*.js']
                }
            }
        },
        jshint: {
            all: ['javascripts/tests/spec/*.js', 'javascripts/app/knockout-datamagic.js', 'javascripts/app/adapters/**/*.js']
        },
        watch: {
            files: ['javascripts/app/**/*.js', 'javascripts/tests/spec/**/*.js'],
            tasks: ['jshint', 'jasmine']
        },
        uglify :{
            options: {
                mangle: false
            },
            js: {
                files: {
                    'javascripts/app/knockout-datamagic.min.js': ['javascripts/app/knockout-datamagic.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('default', ['jasmine']);

};