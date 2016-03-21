var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();

var gulpinject = require('gulp-inject');
var gulputil = require('gulp-util');

gulp.task('hello-world', function() {
   log('Our first hellow world gulp task'); 
});

// adding in tags into our index.html 
gulp.task('wiredep', function() {
    log('Wire up the bower css js and our app js into the html');
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions(); //TODO add this
    return gulp
        .src(config.index) 
        .pipe(wiredep(options))
        .pipe(gulpinject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client)); 
});

//////////////

//custom logger method
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                gulputil.log(gulputil.colors.blue(msg[item]));
            }
        }
    } else {
        gulputil.log(gulputil.colors.blue(msg));
    }
}