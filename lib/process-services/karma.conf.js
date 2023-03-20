// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const { join } = require('path');
const { constants } = require('karma');

module.exports = function (config) {
    config.set({
        basePath: '../../',
        files: [
            { pattern: 'node_modules/pdfjs-dist/build/pdf.js', included: true, watched: false },
            { pattern: 'node_modules/pdfjs-dist/build/pdf.worker.js', included: true, watched: false },
            { pattern: 'node_modules/pdfjs-dist/web/pdf_viewer.js', included: true, watched: false },
            {
                pattern: 'node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
                included: true,
                watched: false
            },
            { pattern: 'node_modules/chart.js/dist/Chart.js', included: true, watched: false },
            { pattern: 'node_modules/raphael/raphael.min.js', included: true, watched: false },
            {
                pattern: 'node_modules/ng2-charts/bundles/ng2-charts.umd.js',
                included: false,
                served: true,
                watched: false
            },
            { pattern: 'node_modules/moment/min/moment.min.js', included: true, watched: false },
            { pattern: 'lib/core/src/lib/i18n/**/en.json', included: false, served: true, watched: false },
            { pattern: 'lib/content-services/src/lib/i18n/**/en.json', included: false, served: true, watched: false },
            { pattern: 'lib/process-services/src/lib/i18n/**/en.json', included: false, served: true, watched: false },
            { pattern: 'lib/process-services/**/*.ts', included: false, served: true, watched: false },
            { pattern: 'lib/config/app.config.json', included: false, served: true, watched: false }
        ],
        frameworks: ['jasmine-ajax', 'jasmine', '@angular-devkit/build-angular'],
        proxies: {
            '/assets/': '/base/lib/process-services/src/lib/assets/',
            '/assets/adf-core/i18n/en.json': '/base/lib/core/src/lib/i18n/en.json',
            '/assets/adf-content-services/i18n/en.json': '/base/lib/content-services/src/lib/i18n/en.json',
            '/assets/adf-process-services/i18n/en-GB.json': '/base/lib/process-services/src/lib/i18n/en.json',
            '/app.config.json': '/base/lib/config/app.config.json'
        },
        plugins: [
            require('karma-jasmine-ajax'),
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
            require('karma-mocha-reporter')
        ],
        client: {
            clearContext: false,
            jasmine: {
                random: false
            }
        },
        jasmineHtmlReporter: {
            suppressAll: true, // removes the duplicated traces
        },

        coverageReporter: {
            dir: join(__dirname, './coverage/process-services'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }],
            check: {
                global: {
                    statements: 80,
                    branches: 67,
                    functions: 70,
                    lines: 75
                }
            }
        },

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

        reporters: ['mocha', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: constants.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
    process.env.TZ = 'UTC';
};
