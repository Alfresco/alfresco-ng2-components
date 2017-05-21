var webpackConfig = require('./webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '',

        frameworks: ['jasmine'],

        files: [
            './node_modules/hammerjs/hammer.js',

            { pattern: './config/karma-test-shim.js', watched: false }
        ],

        preprocessors: {
            './config/karma-test-shim.js': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,

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
            require('../node_modules/karma-jasmine'),
            require('../node_modules/karma-coverage'),
            require('../node_modules/karma-sourcemap-loader'),
            require('../node_modules/karma-chrome-launcher'),
            require('../node_modules/karma-mocha-reporter'),
            require('../node_modules/karma-webpack'),
            require('../node_modules/karma-jasmine-html-reporter')
        ],

        webpackServer: {
            noInfo: true
        },

        reporters: ['mocha']

    };

    if (process.env.TRAVIS) {
        config.browsers = ['Chrome_travis_ci'];
    }

    config.set(_config);
};
