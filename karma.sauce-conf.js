module.exports = function (config) {

  var stn = {};

  stn.basePath = '';

  // https://npmjs.org/browse/keyword/karma-adapter
  stn.frameworks = [
    'qunit'
  ];

  // plugins to use
  stn.plugins = [
    'karma-qunit',
    'karma-sauce-launcher'
  ];

  // list of files / patterns to load in the browser
  stn.files = [
    './mezr.js',
    './tests/tests.js'
  ];

  // list of files to exclude
  stn.exclude = [];

  // possible values: 'dots', 'progress', 'story'
  // https://npmjs.org/browse/keyword/karma-reporter
  stn.reporters = [
    'dots',
    'saucelabs'
  ];

  // enable / disable colors in the output (reporters and logs)
  stn.colors = true;

  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  stn.logLevel = config.LOG_INFO;

  stn.autoWatch = false;

  stn.customLaunchers = require('./karma.sauce-browsers.js').getLaunchers();

  stn.browsers = require('./karma.sauce-browsers.js').getBrowsers();

  stn.captureTimeout = 240000;

  stn.browserDisconnectTimeout = 5000;

  stn.browserDisconnectTolerance = 4;

  stn.singleRun = true;

  stn.sauceLabs = {
    testName: 'mezr.js unit tests'
  };

  stn.hostname = '127.0.0.1';

  config.set(stn);

};