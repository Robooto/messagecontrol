var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var port = process.env.PORT || config.defaultPort;

var gulpinject = require('gulp-inject');
var gulputil = require('gulp-util');
var gulpnodemon = require('gulp-nodemon');

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

gulp.task('serve-dev', function() {
    var isDev = true;

    var nodeOptions = {
        script: config.nodeServer, //TODO
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server] //TODO define the files to restart on
    };

    return gulpnodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart: \n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now...');
                browserSync.reload({ stream: false });

            }, config.browserReloadDelay);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash', function() {
            log('*** nodemon crashed');
        })
        .on('exit', function() {
            log('*** nodemon exited');
        });
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

function startBrowserSync() {
    if(args.nosync || browserSync.active) {
        return;
    }
    
    log('Starting browser-syn on port ' + port);
    
    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            './js/**/*.js',
            'index.html',
            './css/**/*.css'
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 1000
    };
    
    browserSync(options);
}