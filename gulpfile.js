var
fs = require('fs'),
gulp = require('gulp'),
jscs = require('gulp-jscs'),
karma = require('karma'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
size = require('gulp-size'),
argv = require('yargs').argv;

// Load environment variables if .env file exists
if (fs.existsSync('./.env')) {
  require('dotenv').load();
}

gulp.task('validate', function () {

  return gulp
  .src('./mezr.js')
  .pipe(jscs())
  .pipe(jscs.reporter());

});

gulp.task('compress', function() {

  return gulp
  .src('./mezr.js')
  .pipe(size({title: 'development'}))
  .pipe(uglify({
    preserveComments: 'some'
  }))
  .pipe(size({title: 'minified'}))
  .pipe(size({title: 'gzipped', gzip: true}))
  .pipe(rename('mezr.min.js'))
  .pipe(gulp.dest('./'));

});

gulp.task('test-local', function (done) {

  (new karma.Server({
    configFile: __dirname + '/karma.local-conf.js',
    action: 'run'
  }, done)).start();

});

gulp.task('test-sauce', function (done) {

  var
  opts = {
    configFile: __dirname + '/karma.sauce-conf.js',
    action: 'run'
  };

  if (argv.browsers) {
    opts.browsers = require('./karma.sauce-browsers.js').getBrowsers(argv.browsers);
  }

  (new karma.Server(opts, done)).start();

});

gulp.task('test-sauce-ci', function (done) {

  var
  opts = {
    configFile: __dirname + '/karma.sauce-conf.js',
    browsers: require('./karma.sauce-browsers.js').getSupportedBrowsers(),
    action: 'run'
  };

  (new karma.Server(opts, done)).start();

});

gulp.task('default', ['validate', 'test-sauce-ci']);