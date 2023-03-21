// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const { join } = require('path');
const { constants } = require('karma');

module.exports = function (config) {
    config.set({
        basePath: '../../',

        files: [
            {pattern: 'node_modules/pdfjs-dist/build/pdf.js', included: true, watched: false},
            {pattern: 'node_modules/pdfjs-dist/build/pdf.worker.js', included: true, watched: false, served: true},
            {pattern: 'node_modules/pdfjs-dist/build/pdf.worker.min.js', included: true, watched: false, served: true},
            {pattern: 'node_modules/pdfjs-dist/web/pdf_viewer.js', included: true, watched: false},
            {
                pattern: 'node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
                included: true,
                watched: false
            },
            {pattern: 'node_modules/moment/min/moment.min.js', included: true, watched: false},
            {pattern: 'lib/core/src/lib/i18n/**/en.json', included: false, served: true, watched: false},
            {pattern: 'lib/core/**/*.ts', included: false, served: true, watched: false},
            {pattern: 'lib/core/src/lib/assets/**/*.svg', included: false, served: true, watched: false},
            {pattern: 'lib/core/src/lib/assets/**/*.png', included: false, served: true, watched: false},
            {pattern: 'lib/config/app.config.json', included: false, served: true, watched: false},
            {pattern: 'lib/core/src/lib/viewer/assets/fake-test-file.pdf', included: false, served: true, watched: false},
            {pattern: 'lib/core/src/lib/viewer/assets/fake-test-file.txt', included: false, served: true, watched: false},
            {pattern: 'lib/core/src/lib/viewer/assets/fake-test-video.mp4', included: false, served: true, watched: false},
            {
                pattern: 'lib/core//viewer/assets/fake-test-password-file.pdf',
                included: false,
                served: true,
                watched: false
            }
        ],

        frameworks: ['jasmine-ajax', 'jasmine', '@angular-devkit/build-angular'],

        proxies: {
            '/pdf.worker.min.js' :'/base/node_modules/pdfjs-dist/build/pdf.worker.min.js',
            '/pdf.worker.js' :'/base/node_modules/pdfjs-dist/build/pdf.worker.js',
            '/fake-url-file.png' :'/base/lib/core/src/lib/assets/images/logo.png',
            '/logo.png' :'/base/lib/core/src/lib/assets/images/logo.png',
            '/alfresco-logo.svg' :'/base/lib/core/src/lib/assets/images/alfresco-logo.svg',
            '/assets/images/': '/base/lib/core/src/lib/assets/images/',
            '/assets/images/ecm-background.png': '/base/lib/core/src/lib/assets/images/ecm-background.png',
            '/assets/images/bpm-background.png': '/base/lib/core/src/lib/assets/images/bpm-background.png',
            '/content.bin': '/base/lib/core/src/lib/viewer/assets/fake-test-file.pdf',
            '/base/assets/' :'/base/lib/core/src/lib/assets/',
            '/assets/adf-core/i18n/en.json': '/base/lib/core/src/lib/i18n/en.json',
            '/assets/adf-core/i18n/en-GB.json': '/base/lib/core/src/lib/i18n/en.json',
            '/assets/adf-core/i18n/en-US.json': '/base/lib/core/src/lib/i18n/en.json',
            '/fake-content-img' : '/base/lib/core/src/lib/assets/images/logo.png',
            '/fake-content-img.bin' : '/base/lib/core/src/lib/assets/images/logo.png',
            '/fake-test-file.pdf': '/base/lib/core/src/lib/viewer/assets/fake-test-file.pdf',
            '/fake-content-pdf': '/base/lib/core/src/lib/viewer/assets/fake-test-file.pdf',
            '/fake-content-pdf.bin': '/base/lib/core/src/lib/viewer/assets/fake-test-file.pdf',
            '/fake-test-file.txt': '/base/lib/core/src/lib/viewer/assets/fake-test-file.txt',
            '/fake-content-video.bin': '/base/lib/core/src/lib/viewer/assets/fake-test-video.mp4',
            '/fake-content-video': '/base/lib/core/src/lib/viewer/assets/fake-test-video.mp4',
            '/fake-content-txt.bin': '/base/lib/core/src/lib/viewer/assets/fake-test-file.txt',
            '/fake-test-password-file.pdf': '/base/lib/core/src/lib/viewer/assets/fake-test-password-file.pdf'
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
            dir: join(__dirname, './coverage/core'),
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
