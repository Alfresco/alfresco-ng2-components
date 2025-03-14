// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
/* eslint-env es6 */
const { join } = require('path');
const { constants } = require('karma');

module.exports = function (config) {
    config.set({
        basePath: '../../',
        files: [
            { pattern: 'node_modules/pdfjs-dist/build/pdf.min.mjs', type: 'module', included: true, watched: false },
            { pattern: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs', type: 'module', included: true, watched: false },
            { pattern: 'node_modules/pdfjs-dist/web/pdf_viewer.mjs', type: 'module', included: true, watched: false },
            {
                pattern: 'node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
                included: true,
                watched: false
            },
            { pattern: 'node_modules/raphael/raphael.min.js', included: true, watched: false },
            { pattern: 'lib/core/src/lib/i18n/**/en.json', included: false, served: true, watched: false },
            { pattern: 'lib/process-services-cloud/src/lib/i18n/*.json', included: false, served: true, watched: false },
            { pattern: 'lib/process-services-cloud/src/lib/mock/*.json', included: false, served: true, watched: false },
            { pattern: 'lib/process-services-cloud/**/*.ts', included: false, served: true, watched: false },
            { pattern: 'lib/config/app.config.json', included: false, served: true, watched: false }
        ],
        frameworks: ['jasmine-ajax', 'jasmine', '@angular-devkit/build-angular'],
        proxies: {
            '/assets/': '/base/lib/process-services-cloud/src/lib/assets/',
            '/resources/i18n/en.json': '/base/lib/process-services-cloud/src/lib/mock/en.json',
            '/resources/i18n/fr.json': '/base/lib/process-services-cloud/src/lib/mock/fr.json',
            '/base/assets/': '/base/lib/process-services/assets/',
            '/assets/adf-core/i18n/en.json': '/base/lib/core/src/lib/i18n/en.json',
            '/assets/adf-core/i18n/en-GB.json': '/base/lib/core/src/lib/i18n/en.json',
            '/assets/adf-process-services-cloud/i18n/en.json': '/base/lib/process-services-cloud/lib/i18n/en.json',
            '/assets/adf-process-services-cloud/i18n/en-GB.json': '/base/lib/process-services-cloud/lib/i18n/en.json',
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
            suppressAll: true // removes the duplicated traces
        },
        mochaReporter: {
            ignoreSkipped: process.env?.KARMA_IGNORE_SKIPPED === 'true'
        },

        coverageReporter: {
            dir: join(__dirname, './coverage/process-service-cloud'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }],
            check: {
                global: {
                    statements: 75,
                    branches: 67,
                    functions: 73,
                    lines: 75
                }
            }
        },

        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
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
