var webpackConfig = require('./webpack.test');

module.exports = function (config) {
  var _config = {
    basePath: '.',

    frameworks: ['jasmine-ajax', 'jasmine'],

    files: [
      './node_modules/hammerjs/hammer.js',
      {pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css', included: true, watched: false},

      //diagrams
      './node_modules/alfresco-js-api/dist/alfresco-js-api.js',
      './node_modules/moment/min/moment.min.js',

      {pattern: './node_modules/ng2-translate/**/*.js', included: false, watched: false},
      {pattern: './node_modules/moment/**/*.js', included: false, served: true, watched: false},

      {pattern: 'karma-test-shim.js', watched: false},
      {pattern: './src/assets/**/*.*', included: false, served: true, watched: false},
      {pattern: './src/i18n/**/*.*', included: false, served: true, watched: false},
      {pattern: './src/**/*.ts', included: false, served: true, watched: false}
    ],

    webpack: (config.mode === 'coverage') ? require('./webpack.coverage') : require('./webpack.test'),

    webpackMiddleware: {
      stats: 'errors-only'
    },

    port: 9876,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    colors: true,

    autoWatch: true,

    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,

    browsers: ['Chrome'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Karma plugins loaded
    plugins: [
      require('./node_modules/karma-jasmine'),
      require('./node_modules/karma-coverage'),
      require('./node_modules/karma-sourcemap-loader'),
      require('./node_modules/karma-jasmine-ajax'),
      require('./node_modules/karma-chrome-launcher'),
      require('./node_modules/karma-mocha-reporter'),
      require('./node_modules/karma-webpack'),
      require('./node_modules/karma-jasmine-html-reporter')
    ],

    webpackServer: {
      noInfo: true
    },

    // Coverage reporter generates the coverage
    reporters: ['mocha', 'coverage', 'kjhtml'],

    preprocessors: {
      'karma-test-shim.js': ['webpack', 'sourcemap'],
      './src/**/!(*spec|index|*mock|*model|*event).js': 'coverage'
    },

    coverageReporter: {
      includeAllSources: true,
      dir: 'coverage',
      subdir: 'report',
      reporters: [
        {type: 'text'},
        {type: 'text-summary'},
        {type: 'json', file: 'coverage-final.json'},
        {type: 'html'},
        {type: 'lcov'}
      ]
    }
  };

  if (process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci'];
  }

  config.set(_config);
};
