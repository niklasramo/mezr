module.exports = function (config) {

  var stn = {};

  stn.basePath = '';

  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  stn.frameworks = [
    'qunit'
  ];

  // plugins to use
  stn.plugins = [
    'karma-qunit',
    'karma-phantomjs-launcher',
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-ie-launcher',
    'karma-sauce-launcher',
    'karma-story-reporter',
    'karma-coveralls',
    'karma-coverage'
  ];

  // list of files / patterns to load in the browser
  stn.files = [];

  // list of files to exclude
  stn.exclude = [];

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  stn.preprocessors = {};

  // test results reporter to use
  // possible values: 'dots', 'progress', 'story'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  stn.reporters = ['dots'];

  // web server port
  stn.port = 8888;

  // enable / disable colors in the output (reporters and logs)
  stn.colors = true;

  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  stn.logLevel = config.LOG_INFO;

  // enable / disable watching file and executing tests whenever any file changes
  stn.autoWatch = false;

  // define custom launchers for browser config
  stn.customLaunchers = {
    IE11: {
      base: 'IE',
      'x-ua-compatible': 'IE=EmulateIE11'
    },
    IE10: {
      base: 'IE',
      'x-ua-compatible': 'IE=EmulateIE10'
    },
    IE9: {
      base: 'IE',
      'x-ua-compatible': 'IE=EmulateIE9'
    },
    IE8: {
      base: 'IE',
      'x-ua-compatible': 'IE=EmulateIE8'
    },
    IE7: {
      base: 'IE',
      'x-ua-compatible': 'IE=EmulateIE7'
    },
    SL_Chrome: {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    SL_Firefox: {
      base: 'SauceLabs',
      browserName: 'firefox'
    }
  };

  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  stn.browsers = [];

  // If browser does not capture in given timeout [ms], kill it
  stn.captureTimeout = 60000;

  stn.browserDisconnectTolerance = 2;
  stn.browserDisconnectTimeout = 10000;
  stn.browserNoActivityTimeout = 120000;

  stn.sauceLabs = {
    recordVideo: false,
    startConnect: true,
    tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    testName: process.env.COMMIT_MESSAGE,
    tags: ['mezr', 'test']
  };

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  stn.singleRun = true;

  config.set(stn);

};