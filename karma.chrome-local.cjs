module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-chrome-launcher'],
    files: ['./node_modules/chai/chai.js', './tests/unit/dist/index.js'],
    reporters: ['mocha'],
    singleRun: true,
    logLevel: config.LOG_INFO,
    colors: true,
    browsers: ['Chrome'],
  });
};
