// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const path = require('path');
const {SpecReporter} = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');
const retry = require('protractor-retry').retry;

const projectRoot = path.resolve(__dirname);

const width = 1366;
const height = 768;

var HOST = process.env.URL_HOST_ADF;
var BROWSER_RUN = process.env.BROWSER_RUN;
var FOLDER = process.env.FOLDER || '';
var SELENIUM_SERVER = process.env.SELENIUM_SERVER || '';
var DIRECT_CONNECCT = SELENIUM_SERVER ? false : true;
var NAME_TEST = process.env.NAME_TEST ? true : false

var specsToRun = './e2e/' + FOLDER + '**/*.e2e.ts';

if (process.env.NAME_TEST) {
    specsToRun =   './e2e/**/' + process.env.NAME_TEST;
}

var args_options = [];

if (BROWSER_RUN === 'true') {
    args_options = ['--incognito', '--window-size=1366,768', '--disable-gpu'];
} else {
    args_options = ['--incognito', '--headless', '--window-size=1366,768', '--disable-gpu'];
}

var downloadFolder = path.join(__dirname, 'e2e/downloads');

exports.config = {
    allScriptsTimeout: 60000,

    specs: [
        specsToRun
    ],

    capabilities: {
        browserName: 'chrome',

        shardTestFiles: true,
        maxInstances: 2,
        chromeOptions: {
            prefs: {
                'credentials_enable_service': false,
                'download': {
                    'prompt_for_download': false,
                    'default_directory': downloadFolder
                }
            },
            args: args_options
        }
    },

    directConnect: DIRECT_CONNECCT,

    baseUrl: "http://" + HOST,

    framework: 'jasmine2',

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 90000,
        print: function () {
        }
    },

    /**
     * The address of a running selenium server (must be manually start before running the tests). If this is specified seleniumServerJar and seleniumPort will be ignored.
     * @config {String} seleniumAddress
     */
    seleniumAddress: SELENIUM_SERVER,

    plugins: [{
        package: 'jasmine2-protractor-utils',
        disableHTMLReport: false,
        disableScreenshot: false,
        screenshotOnExpectFailure: true,
        screenshotOnSpecFailure: false,
        clearFoldersBeforeTest: true,
        htmlReportDir: `${projectRoot}/e2e-output/html-report/`,
        screenshotPath: `${projectRoot}/e2e-output/screenshots/`
    }],

    onCleanUp(results) {
        retry.onCleanUp(results);
    },

    onPrepare() {
        retry.onPrepare();

        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });

        browser.manage().window().setSize(width, height);

        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));

        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: `${projectRoot}/e2e-output/junit-report`,
            filePrefix: 'results.xml',
            useDotNotation: false,
            useFullTestName: false,
            reportFailedUrl: true
        }));

        return browser.driver.executeScript(disableCSSAnimation);

        function disableCSSAnimation() {
            var css = '* {' +
                '-webkit-transition-duration: 0s !important;' +
                'transition-duration: 0s !important;' +
                '-webkit-animation-duration: 0s !important;' +
                'animation-duration: 0s !important;' +
                '}',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }

    },

    afterLaunch() {
        return retry.afterLaunch(3);
    }
};
