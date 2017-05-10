var webpackConfig = require('./webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '../ng2-components',

        frameworks: ['jasmine-ajax', 'jasmine'],

        files: [
            {pattern: './node_modules/hammerjs/hammer.js', included: true, watched: false},

            //diagrams
            {pattern: './node_modules/chart.js/dist/Chart.js', included: true, watched: false},
            {pattern: './node_modules/alfresco-js-api/dist/alfresco-js-api.js', included: true, watched: false},
            {pattern: './node_modules/raphael/raphael.js', included: true, watched: false},
            {pattern: './node_modules/moment/min/moment.min.js', included: true, watched: false},
            {pattern: './node_modules/md-date-time-picker/dist/js/mdDateTimePicker.js', included: true, watched: false},

            {pattern: './node_modules/ng2-translate/**/*.js', included: false, watched: false},
            {pattern: './node_modules/ng2-charts/**/*.js', included: false, served: true, watched: false},
            {pattern: './node_modules/md-date-time-picker/**/*.js', included: false, served: true, watched: false},
            {pattern: './node_modules/moment/**/*.js', included: false, served: true, watched: false},

            // pdf-js
            {pattern: './node_modules/pdfjs-dist/build/pdf.js', included: true, watched: false},
            {pattern: './node_modules/pdfjs-dist/build/pdf.worker.js', included: true, watched: false},
            {pattern: './node_modules/pdfjs-dist/web/pdf_viewer.js', included: true, watched: false},

            {pattern: './karma-test-shim.js', watched: false},
            {pattern: './ng2-**/dist/**/*.js', included: false, served: true, watched: false},
            {pattern: './ng2-**/dist/**/*.js.map', included: false, served: true, watched: false},
            {pattern: './ng2-**/src/assets/**/*.*', included: false, served: true, watched: false},
            {pattern: './ng2-**/src/i18n/**/*.*', included: false, served: true, watched: false},
            {pattern: './ng2-**/src/**/*.ts', included: false, served: true, watched: false}
        ],

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

        captureTimeout: 1800000,
        browserDisconnectTimeout: 1800000,
        browserDisconnectTolerance: 10,
        browserNoActivityTimeout: 3000000,

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
            require('../node_modules/karma-jasmine-ajax'),
            require('../node_modules/karma-chrome-launcher'),
            require('../node_modules/karma-mocha-reporter'),
            require('../node_modules/karma-webpack'),
            require('../node_modules/karma-jasmine-html-reporter')
        ],

        webpackServer: {
            noInfo: true
        },

        // Coverage reporter generates the coverage
        reporters: ['mocha', 'coverage', 'kjhtml'],

        preprocessors: {
            './karma-test-shim.js': ['webpack', 'sourcemap'],
            '(ng2-alfresco|ng2-activiti)/src/**/!(*spec|index|*mock|*model|*event).js': 'coverage'
        },

        coverageReporter: {
            includeAllSources: true,
            dir: './coverage/',
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
