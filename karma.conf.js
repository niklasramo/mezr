module.exports = function (config) {
  var pkg = require('./package.json');
  config.set({
    basePath: '',
    frameworks: ['qunit'],
    plugins: [
      'karma-qunit',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-sauce-launcher',
      'karma-story-reporter'
    ],
    files: [
      './' + pkg.main,
      './tests/testsuite.js',
      './tests/modules/dimensions.js',
      './tests/modules/offset.js',
      './tests/modules/rect.js',
      './tests/modules/containing-block.js',
      './tests/modules/intersection.js',
      './tests/modules/distance.js',
      './tests/modules/overflow.js',
      './tests/modules/place.js',
      './tests/run-tests.js'
    ],
    reporters: [
      'story',
      'saucelabs'
    ],
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    captureTimeout: 240000,
    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 10,
    concurrency: 1,
    singleRun: true,
    hostname: '127.0.0.1',
    sauceLabs: {testName: pkg.name + ' - ' + pkg.version + ' - unit tests'},
    customLaunchers: {
      slChrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 10',
        version: 'latest'
      },
      slFirefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest'
      },
      slSafari: {
        base: 'SauceLabs',
        browserName: 'safari',
        version: 'latest'
      },
      slEdge: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: 'latest'
      },
      slIE11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '11.0'
      },
      slIE10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '10.0'
      },
      slIE9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9.0'
      }
    }
  });
};