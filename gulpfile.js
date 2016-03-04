var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');
var glob = require('glob');


// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	'react',
  'react-addons-test-utils'
];
var src = './src/webapp/static/jsx/main.js';
var dest = './src/webapp/static/js/build';


var browserifyTask = function (options) {

  // Our app bundler
	var appBundler = browserify({
		entries: [options.src], // Only need initial file, browserify finds the rest
   	transform: [reactify], // We want to convert JSX to normal javascript
		debug: options.development, // Gives us sourcemapping
		cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
	});

	// We set our dependencies as externals on our app bundler when developing
	(options.development ? dependencies : []).forEach(function (dep) {
		appBundler.external(dep);
	});

  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('main.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(gulpif(options.development, livereload()))
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

  	var testFiles = glob.sync('./src/webapp/static/jsx/*.js');
		var testBundler = browserify({
			entries: testFiles,
			debug: true, // Gives us sourcemapping
			transform: [reactify],
			cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
		});

		testBundler.external(dependencies);

  	var rebundleTests = function () {
  		var start = Date.now();
  		console.log('Building TEST bundle');
  		testBundler.bundle()
      .on('error', gutil.log)
	      .pipe(source('specs.js'))
	      .pipe(gulp.dest(options.dest))
	      .pipe(livereload())
	      .pipe(notify(function () {
	        console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
	      }));
  	};

    testBundler = watchify(testBundler);
    testBundler.on('update', rebundleTests);
    rebundleTests();

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



gulp.task('default', function() {
  gulp.start('clean');
  livereload.listen();

    browserifyTask({
      development: true,
      src: src,
      dest: dest
    });

});

gulp.task("deploy",function () {
  gulp.start('clean');
  browserifyTask({
      development: false,
      src: src,
      dest: dest
    });
    
});

gulp.task('clean', function () {
  return gulp.src([dest], {read: false})
    .pipe(clean());
});