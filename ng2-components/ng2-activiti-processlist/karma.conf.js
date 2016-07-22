'use strict';

module.exports = function (config) {
  config.set({

    basePath: '.',

    frameworks: ['jasmine'],

    files: [
      // paths loaded by Karma
      {pattern: 'node_modules/reflect-metadata/Reflect.js', included: true, watched: true},
      {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/zone.js', included: true, watched: true},
      {pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/rxjs/**/*.map', included: false, watched: false},
      {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/@angular/**/*.map', included: false, watched: false},
      {pattern: 'node_modules/ng2-alfresco-core/dist/**/*.js', included: false, served: true, watched: false},
      {pattern: 'node_modules/ng2-alfresco-datatable/dist/**/*.js', included: false, served: true, watched: false},
      {pattern: 'node_modules/ng2-alfresco-datatable/dist/**/*.html', included: false, served: true, watched: false},
      {pattern: 'node_modules/ng2-alfresco-datatable/dist/**/*.css', included: false, served: true, watched: false},
      {pattern: 'node_modules/ng2-translate/**/*.js', included: false, served: true, watched: false},

      {pattern: 'karma-test-shim.js', included: true, watched: true},

      // paths loaded via module imports
      {pattern: 'dist/**/*.js', included: false, watched: true},
      {pattern: 'dist/**/*.html', included: true, served: true, watched: true},
      {pattern: 'dist/**/*.css', included: true, served: true, watched: true},

      // paths to support debugging with source maps in dev tools
      {pattern: 'src/**/*.ts', included: false, watched: false},
      {pattern: 'dist/**/*.js.map', included: false, watched: false}
    ],

    // proxied base paths
    proxies: {
      // required for component assets fetched by Angular's compiler
      '/src/': '/base/src/'
    },

    // list of files to exclude
    exclude: [
      'node_modules/**/*spec.js'
    ],

    port: 9876,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    colors: true,

    autoWatch: true,

    browsers: ['Chrome'],

    // Karma plugins loaded
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-mocha-reporter',
      'karma-jasmine-html-reporter'
    ],

    // Coverage reporter generates the coverage
    reporters: ['mocha', 'coverage', 'kjhtml'],

    // Source files that you wanna generate coverage for.
    // Do not include tests or libraries (these files will be instrumented by Istanbul)
    preprocessors: {
      'dist/**/!(*spec).js': ['coverage']
    },

    coverageReporter: {
      dir: 'coverage/',
      subdir: 'report',
      reporters: [
        {type: 'text'},
        {type: 'text-summary'},
        {type: 'json', file: 'coverage-final.json'},
        {type: 'html'}
      ]
    }
  })
};
