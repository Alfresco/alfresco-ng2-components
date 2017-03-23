'use strict';

module.exports = function (config) {
  var configuration = {
    basePath: '.',

    frameworks: ['jasmine-ajax', 'jasmine'],

    files: [
      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Polyfills
      'node_modules/core-js/client/shim.js',
      'node_modules/reflect-metadata/Reflect.js',

      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',
      'node_modules/hammerjs/hammer.js',

      // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false},

      'node_modules/alfresco-js-api/dist/alfresco-js-api.js',

      {pattern: 'node_modules/ng2-translate/**/*.js', included: false, watched: false},

      'karma-test-shim.js',

      // paths loaded via module imports
      {pattern: 'src/**/*.js', included: false, watched: true, nocache: true},
      {pattern: 'src/**/*.html', included: false, watched: true, nocache: true},
      {pattern: 'src/**/*.css', included: false, watched: true, nocache: true},

      // ng2-components
      { pattern: 'node_modules/ng2-alfresco-core/src/**/*.js', included: false, served: true, watched: false },
      { pattern: 'node_modules/ng2-alfresco-core/index.js', included: false, served: true, watched: false },

      { pattern: 'node_modules/ng2-alfresco-datatable/src/**/*.js', included: false, served: true, watched: false },
      { pattern: 'node_modules/ng2-alfresco-datatable/src/**/*.html', included: false, served: true, watched: false },
      { pattern: 'node_modules/ng2-alfresco-datatable/src/**/*.css', included: false, served: true, watched: false },
      { pattern: 'node_modules/ng2-alfresco-datatable/index.js', included: false, served: true, watched: false },

      // paths to support debugging with source maps in dev tools
      {pattern: 'src/**/*.ts', included: false, watched: false, nocache: true },
      {pattern: 'src/**/*.js.map', included: false, watched: false, nocache: true }
    ],

    exclude: [
      'node_modules/**/*spec.js'
    ],

    // proxied base paths
    proxies: {
      // required for component assets fetched by Angular's compiler
      '/src/': '/base/src/'
    },

    port: 9876,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    colors: true,

    autoWatch: true,

    browsers: ['Chrome'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Karma plugins loaded
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-jasmine-ajax',
      'karma-chrome-launcher',
      'karma-mocha-reporter',
      'karma-jasmine-html-reporter'
    ],

    // Coverage reporter generates the coverage
    reporters: ['mocha', 'coverage', 'kjhtml'],

    // Source files that you wanna generate coverage for.
    // Do not include tests or libraries (these files will be instrumented by Istanbul)
    preprocessors: {
      'src/**/!(*spec|index|*mock|*model|*event).js': 'coverage'
    },

    coverageReporter: {
      includeAllSources: true,
      dir: 'coverage/',
      subdir: 'report',
      reporters: [
        {type: 'text'},
        {type: 'json', file: 'coverage-final.json'},
        {type: 'html'},
        {type: 'lcov'}
      ]
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration)
};
