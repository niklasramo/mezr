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

  stn.customLaunchers = {

    // Desktop - IE

    win7_ie9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9.0'
    },
    /*
    win8_ie10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8',
      version: '10.0'
    },
    win81_ie11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11.0'
    },
    */

    // Desktop - Edge

    win10_edge: {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10',
      version: '20.10240'
    }

    // Desktop - Firefox

    // Desktop - Chrome

    // Desktop - Safari

    // Mobile - IE

    // Mobile - Safari

    // Mobile - Chrome

    // Mobile - Android browser

  };

  stn.browsers = Object.keys(stn.customLaunchers);

  stn.captureTimeout = 60000;

  stn.browserDisconnectTolerance = 2;

  stn.browserDisconnectTimeout = 10000;

  stn.browserNoActivityTimeout = 120000;

  stn.singleRun = true;

  stn.sauceLabs = {
    testName: 'mezr.js unit tests'
  };

  stn.hostname = '127.0.0.1';

  config.set(stn);

};