var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify'); 
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	 'react',
     'react-router'
];
var bundleFile = 'bundle.js';
var buildPath = './static/dist';

var browserifyTask = function (options) {

    // Our app bundler
	var appBundler = browserify({
		entries: [options.src], // Only need initial file, browserify finds the rest
        extensions: [".js", ".jsx"],
   	    transform: [babelify], // We want to convert JSX to normal javascript
		debug: options.development, // Gives us sourcemapping
		cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
	});

	// We set our dependencies as externals on our app bundler when developing.
    // You might consider doing this for production also and load two javascript
    // files (main.js and vendors.js), as vendors.js will probably not change and
    // takes full advantage of caching
    appBundler.external(options.development ? dependencies : []);

    // The rebundle process
    var rebundle = function () {
        var start = Date.now();
        console.log('Building APP bundle');
        appBundler
            .bundle()
            .on('error', gutil.log)
            .pipe(source(bundleFile))
            .pipe(gulpif(!options.development, streamify(uglify())))
            .pipe(gulp.dest(options.dest))
            .pipe(notify(function () {
                console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
            }));
    };

    // Fire up Watchify when developing
    if (options.development) {
        appBundler = watchify(appBundler);
        appBundler.on('update', rebundle);
    }
    
    rebundle();
    

    // We create a separate bundle for our dependencies as they
    // should not rebundle on file changes. This only happens when
    // we develop. When deploying the dependencies will be included 
    // in the application bundle
    if (options.development) {
        
        var vendorsBundler = browserify({
            debug: true,
            require: dependencies
        });

        // Run the vendor bundle
        var start = new Date();
        console.log('Building VENDORS bundle');
        vendorsBundler.bundle()
            .on('error', gutil.log)
            .pipe(source('vendors.js'))
            .pipe(gulpif(!options.development, streamify(uglify())))
            .pipe(gulp.dest(options.dest))
            .pipe(notify(function () {
                console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
            }));

    }

}

var cssTask = function (options) {
    var run = function() {
        gulp.src(options.src)
        .pipe(concat('style.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(options.dest)); 
    }
    run();
    if(options.development)
        gulp.watch(options.src, run);
}

gulp.task('clean', function(cb) {
    gulp.src(buildPath, {read: false}).pipe(clean());
    cb()
})


// Starts our development workflow
gulp.task('default', ['clean'], function () {

    cssTask({
            src: './css/**/*.css',
            dest: buildPath
    });

    browserifyTask({
        development: true,
        src: './index.js',
        dest: buildPath
    });

});

gulp.task('deploy', function () {
    
    browserifyTask({
        development: false,
        src: './index.js',
        dest: buildPath
    });
    
    cssTask({
        src: './css/**/*.css',
        dest: buildPath
    });

});