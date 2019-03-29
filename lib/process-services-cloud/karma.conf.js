// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '../../',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    files: [
        {pattern: 'lib/core/i18n/**/en.json', included: false, served: true, watched: false},
        {pattern: 'lib/config/app.config.json', included: false, served: true, watched: false},
    ],
    proxies: {
        '/base/assets/': '/base/lib/process-services-cloud/src/lib/assets/',
        '/assets/adf-core/i18n/en.json': '/base/lib/core/i18n/en.json',
        '/assets/adf-core/i18n/en-GB.json': '/base/lib/core/i18n/en.json',
        '/app.config.json': '/base/lib/config/app.config.json'
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-mocha-reporter')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage/process-services-cloud'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['mocha', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
