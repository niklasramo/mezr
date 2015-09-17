var
paths = {
  mezr: './mezr.js',
  tests: './tests/tests.js',
  jscsRules: './jscsrc.json',
  karmaConf: './karma.conf.js'
},
gulp = require('gulp'),
gulpJscs = require('gulp-jscs'),
gulpKarma = require('gulp-karma'),
rimraf = require('rimraf'),
runSequence = require('run-sequence');

gulp.task('validate', function () {

  return gulp
  .src(paths.mezr)
  .pipe(gulpJscs(paths.jscsRules));

});

gulp.task('test', function (cb) {

  return gulp
  .src([paths.mezr, paths.tests])
  .pipe(gulpKarma({
    configFile: paths.karmaConf,
    action: 'run'
  }))
  .on('error', function (err) {
    throw err;
  });

});

gulp.task('default', function (cb) {

  runSequence('validate', 'test', cb);

});