var webpackConfig = require('./webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '',

        frameworks: ['jasmine-ajax', 'jasmine'],

        files: [
          { pattern: './config/karma-test-shim.js', watched: false },
          { pattern: 'src/assets/fake-test-file.pdf', included: false, served: true, watched: false },
        ],

        // proxied base paths
        proxies: {
          // required for component assets fetched by Angular's compiler
          '/src/': '/base/src/'
        },

        preprocessors: {
            './config/karma-test-shim.js': ['webpack', 'sourcemap'],
            './src/**/!(*spec).js': ['coverage']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['mocha', 'karma-remap-istanbul', 'karma-remap-istanbul'],
        remapIstanbulReporter: {
            remapOptions: {}, //additional remap options
            reportOptions: {}, //additional report options
            reports: {
                'html': './coverage',
                // 'text-summary': null, // to show summary in console
                'lcovonly': './coverage/lcov.info'
            }
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        customLaunchers: {
          Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
          }
        },
        singleRun: true
    };

    if (process.env.TRAVIS) {
      _config.browsers = ['Chrome_travis_ci'];
    }

    config.set(_config);
};
