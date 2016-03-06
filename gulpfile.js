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
var es = require('event-stream');
var rename = require('gulp-rename');


// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	'react',
    'react-addons-test-utils',
    'react-dom'
];
var src = './src/webapp/static/jsx/'
var mainJs = 'main.js';
var dest = './src/webapp/static/js/build';


var Browserify = function (options) {
    
    //reactify all js files in '/jsx/' folder
    glob(src + '*.js', function(err, files) {

        var tasks = files.map(function(entry) {
            var filename = entry.replace(/^.*[\\\/]/, '')
            var isMain = (filename == mainJs);
            
            var opts = { 
                entries: [ isMain ? src + mainJs : entry], 
                transform: [reactify],
                debug: !options.deploy, // Gives us sourcemapping
                cache: {}, 
                packageCache: {}, 
                fullPaths: !options.deploy 
            };
            
            //build dependencies only on main file
            var depend = [];
            if( !isMain ) depend = dependencies;
            
            var br = browserify(opts).external(depend)
            
            return br.bundle()
                .on('error', gutil.log)
                .pipe(source(filename))
                .pipe(gulpif(options.deploy, streamify(uglify())))
                .pipe(gulpif(!options.deploy, livereload()))
                .pipe(gulp.dest(dest));
        });
        es.merge(tasks);
         
    })
    
}

gulp.task('default', function () {
    
    Browserify({
        debug: true,
        deploy: false
    })
    
    gulp.start('watch');
    
});


gulp.task('watch', function() {
    // Watch .js files
    gulp.watch(src + '*.js', ['default']);
 });


gulp.task("deploy",function () {
     Browserify({
        debug: false,
        deploy: true
    })
  
});

gulp.task('clean', function () {
  return gulp.src([dest], {read: false})
    .pipe(clean());
});


