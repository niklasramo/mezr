var
fs = require('fs'),
gulp = require('gulp'),
jscs = require('gulp-jscs'),
karma = require('karma');

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

gulp.task('test-local', function (done) {

  (new karma.Server({
    configFile: __dirname + '/karma.local-conf.js',
    action: 'run'
  }, done)).start();

});

gulp.task('test-sauce', function (done) {

  (new karma.Server({
    configFile: __dirname + '/karma.sauce-conf.js',
    action: 'run'
  }, done)).start();

});

gulp.task('default', ['validate', 'test-sauce']);