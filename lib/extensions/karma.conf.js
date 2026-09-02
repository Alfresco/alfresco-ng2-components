// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
/* eslint-env es6 */
const { join } = require('path');
const { constants } = require('karma');

module.exports = function (config) {
    config.set({
        basePath: '',
        files: [
            { pattern: '../../node_modules/pdfjs-dist/build/pdf.min.mjs', type: 'module', included: true, watched: false },
            { pattern: '../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs', type: 'module', included: true, watched: false }
        ],
        frameworks: ['jasmine'],
        plugins: [require('karma-jasmine'), require('karma-chrome-launcher'), require('karma-jasmine-html-reporter'), require('karma-coverage')],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },

        coverageReporter: {
            dir: join(__dirname, '../../coverage/extensions'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'lcov' }, { type: 'text-summary' }, { type: 'text-summary', subdir: '.', file: 'summary.txt' }],
            check: {
                global: {
                    statements: 75,
                    branches: 65,
                    functions: 73,
                    lines: 75
                }
            }
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: constants.LOG_INFO,
        browsers: ['ChromeHeadless'],
        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
            }
        },
        singleRun: true
    });
};
