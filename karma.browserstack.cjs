require('dotenv').config();

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-browserstack-launcher'],
    files: ['./node_modules/chai/chai.js', './tests/dist/index.js'],
    reporters: ['mocha', 'BrowserStack'],
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    singleRun: true,
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    },
    customLaunchers: {
      bsWinChrome: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '11',
      },
      bsWinEdge: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '11',
      },
      bsWinFirefox: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '11',
      },
      bsMacChrome: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Monterey',
      },
      bsMacEdge: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Monterey',
      },
      bsMacFirefox: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Monterey',
      },
      bsMacSafari: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Monterey',
      },
      bsIphoneSafari: {
        base: 'BrowserStack',
        device: 'iPhone 13',
        os: 'ios',
        real_mobile: true,
        os_version: '15.6',
      },
    },
    browsers: [
      'bsWinChrome',
      'bsWinEdge',
      'bsWinFirefox',
      'bsMacChrome',
      'bsMacEdge',
      'bsMacFirefox',
      'bsMacSafari',
      'bsIphoneSafari',
    ],
  });
};
