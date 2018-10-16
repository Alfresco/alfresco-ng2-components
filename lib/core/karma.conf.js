// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '../../',

        files: [
            {pattern: 'node_modules/core-js/client/core.js', included: true, watched: false},
            {pattern: 'node_modules/tslib/tslib.js', included: true, watched: false},
            {pattern: 'node_modules/hammerjs/hammer.min.js', included: true, watched: false},
            {pattern: 'node_modules/hammerjs/hammer.min.js.map', included: false, watched: false},

            // pdf-js
            {pattern: 'node_modules/pdfjs-dist/build/pdf.js', included: true, watched: false},
            {pattern: 'node_modules/pdfjs-dist/build/pdf.worker.js', included: true, watched: false, served: true},
            {pattern: 'node_modules/pdfjs-dist/build/pdf.worker.min.js', included: true, watched: false, served: true},
            {pattern: 'node_modules/pdfjs-dist/web/pdf_viewer.js', included: true, watched: false},

            {
                pattern: 'node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
                included: true,
                watched: false
            },

            {pattern: 'node_modules/alfresco-js-api/dist/alfresco-js-api.min.js', included: true, watched: false},
            {pattern: 'node_modules/moment/min/moment.min.js', included: true, watched: false},

            {pattern: 'lib/core/i18n/**/en.json', included: false, served: true, watched: false},

            {pattern: 'lib/core/**/*.ts', included: false, served: true, watched: false},
            {pattern: 'lib/core/assets/**/*.svg', included: false, served: true, watched: false},

            {pattern: 'lib/config/app.config.json', included: false, served: true, watched: false},
            {pattern: 'lib/core/viewer/assets/fake-test-file.pdf', included: false, served: true, watched: false},
            {pattern: 'lib/core/viewer/assets/fake-test-file.txt', included: false, served: true, watched: false},
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
            '/fake-url-file.png' :'/base/lib/core/assets/images/logo.png',
            '/assets/images/': '/base/lib/core/assets/images/',
            '/content.bin': '/base/lib/core/viewer/assets/fake-test-file.pdf',
            '/base/assets/' :'/base/lib/core/assets/',
            '/assets/adf-core/i18n/en.json': '/base/lib/core/i18n/en.json',
            '/app.config.json': '/base/lib/config/app.config.json',
            '/fake-test-file.pdf': '/base/lib/core/viewer/assets/fake-test-file.pdf',
            '/fake-test-file.txt': '/base/lib/core/viewer/assets/fake-test-file.txt',
            '/fake-test-password-file.pdf': '/base/lib/core/viewer/assets/fake-test-password-file.pdf'
        },

        plugins: [
            require('karma-jasmine-ajax'),
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
            require('karma-mocha-reporter')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: './lib/coverage/core/',
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        colors: true,

        autoWatch: false,

        browserDisconnectTimeout: 200000,
        browserNoActivityTimeout: 2400000,
        captureTimeout: 1200000,

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
        browsers: ['Chrome'],
        singleRun: false
    });
};
