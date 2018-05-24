const webpackCoverage = require('./webpack.coverage');
const webpackTest = require('./webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '../',

        frameworks: ['jasmine-ajax', 'jasmine'],

        files: [
            {pattern: './node_modules/core-js/client/core.js', included: true, watched: false},
            {pattern: './node_modules/tslib/tslib.js', included: true, watched: false},
            {pattern: './node_modules/hammerjs/hammer.min.js', included: true, watched: false},
            {pattern: './node_modules/hammerjs/hammer.min.js.map', included: false, watched: false},

            // pdf-js
            {pattern: './node_modules/pdfjs-dist/build/pdf.js', included: true, watched: false},
            {pattern: './node_modules/pdfjs-dist/build/pdf.worker.js', included: true, watched: false},
            {pattern: './node_modules/pdfjs-dist/web/pdf_viewer.js', included: true, watched: false},

            {
                pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
                included: true,
                watched: false
            },

            //diagrams
            {pattern: './node_modules/chart.js/dist/Chart.js', included: true, watched: false},
            {pattern: './node_modules/alfresco-js-api/dist/alfresco-js-api.min.js', included: true, watched: false},
            {pattern: './node_modules/raphael/raphael.min.js', included: true, watched: false},
            {pattern: './node_modules/moment/min/moment.min.js', included: true, watched: false},
            {
                pattern: './node_modules/ng2-charts/bundles/ng2-charts.umd.js',
                included: false,
                served: true,
                watched: false
            },

            {pattern: './lib/core/i18n/**/en.json', included: false, served: true, watched: false},
            {pattern: './lib/content-services/i18n/**/en.json', included: false, served: true, watched: false},
            {pattern: './lib/process-services/i18n/**/en.json', included: false, served: true, watched: false},

            {pattern: './lib/**/*.ts', included: false, served: true, watched: false},

            {pattern: './lib/config/app.config.json', included: false, served: true, watched: false},
            {pattern: './lib/core/viewer/assets/fake-test-file.pdf', included: false, served: true, watched: false},
            {pattern: './lib/core/viewer/assets/fake-test-file.txt', included: false, served: true, watched: false},
            {
                pattern: './lib/core/viewer/assets/fake-test-password-file.pdf',
                included: false,
                served: true,
                watched: false
            },

            {pattern: './lib/' + config.component + '/karma-test-shim.js', watched: false}
        ],

        webpack: (config.mode === 'coverage') ? webpackCoverage(config) : webpackTest(config),

        webpackMiddleware: {
            noInfo: true,
            stats: {
                chunks: false
            }
        },

        port: 9876,

        proxies: {
            '/app.config.json': '/base/lib/config/app.config.json',
            '/fake-test-file.pdf': '/base/lib/core/viewer/assets/fake-test-file.pdf',
            '/fake-test-file.txt': '/base/lib/core/viewer/assets/fake-test-file.txt',
            '/fake-test-password-file.pdf': '/base/lib/core/viewer/assets/fake-test-password-file.pdf'
        },

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DISABLE,

        colors: true,

        autoWatch: false,

        browserDisconnectTimeout: 200000,
        browserNoActivityTimeout: 2400000,
        captureTimeout: 1200000,
        browsers: ['Chrome'],
        // browsers: ['ChromeHeadless'],

        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: [
                    '--no-sandbox',
                    '--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=9222'
                ]
            }
        },

        // Karma plugins loaded
        plugins: [
            require('../../node_modules/karma-jasmine'),
            require('../../node_modules/karma-coverage'),
            require('../../node_modules/karma-sourcemap-loader'),
            require('../../node_modules/karma-jasmine-ajax'),
            require('../../node_modules/karma-chrome-launcher'),
            require('../../node_modules/karma-webpack'),
            require('../../node_modules/karma-jasmine-html-reporter'),
            require('../../node_modules/karma-mocha-reporter')
        ],

        webpackServer: {
            noInfo: true
        },

        // Coverage reporter generates the coverage
        reporters: ['mocha', 'coverage', 'kjhtml'],

        mochaReporter: {
            ignoreSkipped: true
        },

        preprocessors: {
            '**/karma-test-shim.js': ['webpack'],
            '(core|content-services|process-services)/**/!(*spec|index|*mock|*model|*event).js': 'coverage'
        },

        coverageReporter: {
            includeAllSources: true,
            dir: './lib/coverage/' + config.component + '/',
            subdir: 'report',
            reporters: [
                {type: 'text'},
                {type: 'text-summary'},
                {type: 'json', file: 'coverage-final.json'},
                {type: 'html'},
                {type: 'lcov'}
            ]
        },

        client: {
            jasmine: {
                random: true
            }
        }
    };

    config.set(_config);
};
