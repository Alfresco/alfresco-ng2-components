const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const retry = require('protractor-retry').retry;
const tsConfig = require('./e2e/tsconfig.e2e.json');
const AlfrescoApi = require('@alfresco/js-api').AlfrescoApiCompatibility;
const TestConfig = require('./e2e/test.config');
const failFast = require('./e2e/protractor/fail-fast');
const { beforeAllRewrite, afterAllRewrite, beforeEachAllRewrite, afterEachAllRewrite } = require('./e2e/protractor/override-jasmine');
const { uploadScreenshot, saveReport, cleanReportFolder } = require('./e2e/protractor/save-remote');
const argv = require('yargs').argv;

const projectRoot = path.resolve(__dirname);
const width = 1366, height = 768;

let load_env_file = function () {
    let ENV_FILE = process.env.ENV_FILE;

    if (ENV_FILE) {
        require('dotenv').config({ path: ENV_FILE });
    }
};

load_env_file();

let HOST = process.env.URL_HOST_ADF;
let BROWSER_RUN = !!process.env.BROWSER_RUN;
let FOLDER = process.env.FOLDER || '';
let SELENIUM_SERVER = process.env.SELENIUM_SERVER || '';
let DIRECT_CONNECCT = !SELENIUM_SERVER;
let MAXINSTANCES = process.env.MAXINSTANCES || 1;
let TIMEOUT = parseInt(process.env.TIMEOUT, 10);
let SAVE_SCREENSHOT = (process.env.SAVE_SCREENSHOT == 'true');
let LIST_SPECS = process.env.LIST_SPECS || [];
let LOG = !!process.env.LOG;
let arraySpecs = [];

if (LOG) {
    console.log('======= PROTRACTOR CONFIGURATION ====== ');
    console.log('BROWSER_RUN : ' + BROWSER_RUN);
    console.log('SAVE_SCREENSHOT : ' + SAVE_SCREENSHOT);
    console.log('FOLDER : ' + FOLDER);
    console.log('MAXINSTANCES : ' + MAXINSTANCES);
    console.log('LIST_SPECS : ' + LIST_SPECS);
    console.log('SELENIUM_SERVER : ' + SELENIUM_SERVER);
}

let browser_options = function () {
    let args_options = ['--incognito', `--window-size=${width},${height}`, '--disable-gpu', '--disable-web-security', '--disable-browser-side-navigation'];

    if (BROWSER_RUN !== true) {
        args_options.push('--headless') ;
    }

    return args_options;
};

let args_options = browser_options();

let downloadFolder = path.join(__dirname, 'e2e/downloads');

let specs = () => {
    let specsToRun = './**/e2e/' + FOLDER + '/**/*.e2e.ts';

    if (LIST_SPECS.length === 0) {
        arraySpecs = [specsToRun];
    } else {
        arraySpecs = LIST_SPECS.split(',');
        arraySpecs = arraySpecs.map((el) => './' + el);
    }

    return arraySpecs;
};

specs();

exports.config = {
    allScriptsTimeout: TIMEOUT,

    specs: arraySpecs,

    useAllAngular2AppRoots: true,

    capabilities: {

        loggingPrefs: {
            browser: 'ALL' // "OFF", "SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST", "ALL".
        },

        browserName: 'chrome',

        maxInstances: MAXINSTANCES,

        shardTestFiles: true,

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

    baseUrl: HOST,

    params: {
        testConfig: TestConfig,
        config: TestConfig.appConfig,
        identityAdmin: TestConfig.identityAdmin,
        identityUser: TestConfig.identityUser,
        rootPath: __dirname
    },

    framework: 'jasmine2',

    getPageTimeout: 90000,

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000,
        print: function () {
        }
    },

    /**
     * The address of a running selenium server (must be manually start before running the tests). If this is specified seleniumServerJar and seleniumPort will be ignored.
     * @config {String} seleniumAddress
     */
    seleniumAddress: SELENIUM_SERVER,

    SELENIUM_PROMISE_MANAGER: false,

    plugins: [{
        package: 'jasmine2-protractor-utils',
        disableScreenshot: false,
        screenshotOnExpectFailure: true,
        screenshotOnSpecFailure: false,
        clearFoldersBeforeTest: true,
        screenshotPath: `${projectRoot}/e2e-output/screenshots/`
    }],

    onCleanUp(results) {
        retry.onCleanUp(results);
    },

    onPrepare() {
        afterEachAllRewrite();
        beforeEachAllRewrite();
        afterAllRewrite();
        beforeAllRewrite();

        retry.onPrepare();

        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
        jasmine.getEnv().addReporter(failFast.init());

        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });
        require("tsconfig-paths").register({
            project: 'e2e/tsconfig.e2e.json',
            baseUrl: 'e2e/',
            paths: tsConfig.compilerOptions.paths
        });

        browser.manage().window().setSize(width, height);

        jasmine.getEnv().addReporter(
            new SpecReporter({
                spec: {
                    displayStacktrace: true,
                    displayDuration: true
                }
            })
        );

        return browser.driver.executeScript(disableCSSAnimation);

        function disableCSSAnimation() {
            let css = '* {' +
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

    beforeLaunch: function () {
        if (SAVE_SCREENSHOT) {
            cleanReportFolder();
        }
    },

    afterLaunch: async function () {
        if (SAVE_SCREENSHOT) {

            let retryCount = 1;
            if (argv.retry) {
                retryCount = ++argv.retry;
            }

            let alfrescoJsApi = new AlfrescoApi({
                provider: 'ECM',
                hostEcm: TestConfig.adf.url
            });

            alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            try {
                await uploadScreenshot(alfrescoJsApi, retryCount);
            } catch (error) {
                console.error('Error saving screenshot', error);
            }

            try {
                await saveReport(alfrescoJsApi, retryCount);
            } catch (error) {
                console.error('Error saving Report', error);
            }
        }

        return retry.afterLaunch(4);
    }

};
