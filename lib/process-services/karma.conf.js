// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',

        files: [
            {pattern: '../../node_modules/core-js/client/core.js', included: true, watched: false},
            {pattern: '../../node_modules/tslib/tslib.js', included: true, watched: false},
            {pattern: '../../node_modules/hammerjs/hammer.min.js', included: true, watched: false},
            {pattern: '../../node_modules/hammerjs/hammer.min.js.map', included: false, watched: false},

            // pdf-js
            {pattern: '../../node_modules/pdfjs-dist/build/pdf.js', included: true, watched: false},
            {pattern: '../../node_modules/pdfjs-dist/build/pdf.worker.js', included: true, watched: false},
            {pattern: '../../node_modules/pdfjs-dist/web/pdf_viewer.js', included: true, watched: false},

            {
                pattern: '../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
                included: true,
                watched: false
            },

            {pattern: '../../node_modules/chart.js/dist/Chart.js', included: true, watched: false},
            {pattern: '../../node_modules/raphael/raphael.min.js', included: true, watched: false},
            {
                pattern: './node_modules/ng2-charts/bundles/ng2-charts.umd.js',
                included: false,
                served: true,
                watched: false
            },

            {pattern: '../../node_modules/alfresco-js-api/dist/alfresco-js-api.min.js', included: true, watched: false},
            {pattern: '../../node_modules/moment/min/moment.min.js', included: true, watched: false},

            {pattern: './i18n/**/en.json', included: false, served: true, watched: false},

            {pattern: './**/*.ts', included: false, served: true, watched: false},

            {pattern: '../config/app.config.json', included: false, served: true, watched: false}
        ],

        frameworks: ['jasmine-ajax', 'jasmine', '@angular-devkit/build-angular'],

        proxies: {
            '/app.config.json': '/base/../config/app.config.json',
            '/fake-test-file.pdf': '/base/viewer/assets/fake-test-file.pdf',
            '/fake-test-file.txt': '/base/viewer/assets/fake-test-file.txt',
            '/fake-test-password-file.pdf': '/base/viewer/assets/fake-test-password-file.pdf'
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
            dir: require('path').join(__dirname, '../../coverage'),
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        reporters: ['kjhtml', 'mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    });
};
