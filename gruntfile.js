/**
 * Created by kimzhang on 2015/7/3.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        concat : {
            optinss : {
                separator: ';'
            },
            dist: {
                src: [ 'app/node_modules/jquery/dist/jquery.min.js',
                        'app/node_modules/bootstarp/dist/js/bootstrap.min.js',
                        'app/node_modules/angular/angular.min.js',
                        'app/node_modules/angular-route/angular-route.min.js',
                        'app/node_modules/vis/dist/vis.min.js',
                        'app/app.js',
                        'app/point/*.js',
                        'app/contract/*.js',
                        'app/about/*.js',
                        'app/privacy/*.js'
                        ],
                dest: 'build/sewing.js'
            }
        },

        uglify: {
            build: {
                src: 'build/sewing.js',
                dest: 'build/sewing.min.js'
            }
        },

        cssmin: {
            css: {
                src: [ 'app/node_modules/bootstrap/dist/css/bootstrap.min.css',
                        'app/node_modules/vis/dist/vis.min.css',
                        'app/app.css'],
                dest: 'build/sewing.min.css'
            }
        },

        //usemin: {
        //  html: ['index.html','point/*.html', 'privacy/*.html', 'about/*.html', 'contract/*.html']
        //},

        htmlmin: {
            options : {
                removeComments : true,
                removeCommentsFromCDATA: true,
                collapseWhitespace:true,
                collapseBooleanAttributes:true,
                removeAttributeQuotes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },

            html: {
                files: [
                    {
                        expand:true,
                        cwd: 'app/',
                        src:['index.html','point/*.html', 'privacy/*.html', 'about/*.html', 'contract/*.html'],
                        dest: 'build/'
                    }
                ]
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd:  'app/point/img',
                    src:  ['**/*.{png,jpg,giif}'],
                    dest: 'build/point/img/'
                }]
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-usemin');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin','htmlmin', 'imagemin']);
}