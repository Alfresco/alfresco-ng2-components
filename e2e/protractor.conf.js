const { LocalStorageUtil, Logger } = require('@alfresco/adf-testing');
const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const retry = require('protractor-retry-angular-cli').retry;
const tsConfig = require('./tsconfig.e2e.json');
const testConfig = require('./test.config');
const RESOURCES = require('./util/resources');
const resolve = require('path').resolve;
const fs = require('fs');
const smartRunnerFactory = require('./smartrunner-factory');

const { uploadScreenshot } = require('./protractor/save-remote');
const argv = require('yargs').argv;

const width = 1657, height = 1657;

const ENV_FILE = process.env.ENV_FILE;
const GROUP_SUFFIX = process.env.PREFIX || process.env.GH_BUILD_NUMBER || 'adf';

if (ENV_FILE) {
    require('dotenv').config({ path: ENV_FILE });
}

const HOST = process.env.URL_HOST_ADF;
const BROWSER_RUN = [true, 'true'].includes(process.env.BROWSER_RUN);
const FOLDER = process.env.FOLDER || '';
const SELENIUM_SERVER = process.env.SELENIUM_SERVER || '';
const MAXINSTANCES = process.env.MAXINSTANCES || 1;
const MAX_RETRIES = process.env.MAX_RETRIES || 4;
const TIMEOUT = parseInt(process.env.TIMEOUT, 10);
const SAVE_SCREENSHOT = (process.env.SAVE_SCREENSHOT === 'true');
const LIST_SPECS = process.env.LIST_SPECS || [];
const LOG = !!process.env.LOG;

let arraySpecs = [];

console.log('Parallel e2e : ' + MAXINSTANCES);
console.log('Max fail Retry: ', MAX_RETRIES);

if (LOG) {
    console.log('======= PROTRACTOR CONFIGURATION ====== ');
    console.log('HOST: ', HOST);
    console.log('BROWSER_RUN : ' + BROWSER_RUN);
    console.log('SAVE_SCREENSHOT : ' + SAVE_SCREENSHOT);
    console.log('FOLDER : ' + FOLDER);
    console.log('LIST_SPECS : ' + LIST_SPECS);
    console.log('SELENIUM_SERVER : ' + SELENIUM_SERVER);
}

const downloadFolder = path.join(__dirname, '/downloads');

let specs = function () {
    let LIST_SPECS;

    if (process.env.LIST_SPECS) {
        LIST_SPECS = process.env.LIST_SPECS;
    }

    if (LIST_SPECS && LIST_SPECS !== '') {
        arraySpecs = LIST_SPECS.split(',');
        arraySpecs = arraySpecs.map((el) => './' + el.replace('e2e/', ''));

        specExists(arraySpecs);
    } else {
        const FOLDER = process.env.FOLDER || '';
        setProvider(FOLDER);
        const specsToRun = FOLDER ? `./${FOLDER}/**/*.e2e.ts` : './**/*.e2e.ts';
        arraySpecs = [specsToRun];
    }

    return arraySpecs;
};

let setProvider = function (folder) {
    if (folder === 'core') {
        testConfig.appConfig.provider = 'ALL';
    } else if (folder === 'content-services') {
        testConfig.appConfig.provider = 'ECM';
    } else if (folder === 'process-services') {
        testConfig.appConfig.provider = 'BPM';
    } else if (folder === 'insights') {
        testConfig.appConfig.provider = 'BPM';
    } else if (folder === 'search') {
        testConfig.appConfig.provider = 'ECM';
    } else if (folder === 'process-services-cloud') {
        testConfig.appConfig.provider = 'BPM';
    }
};

let specExists = function (listSpecs) {
    listSpecs.forEach((path) => {
        if (!fs.existsSync(resolve(__dirname, path))) {
            Logger.error(`Not valid spec path : ${resolve(__dirname, path)} valid path should be for example /search/search-component.e2e.ts`);
        }
    });
};

specs();

exports.config = {

    allScriptsTimeout: 30000,

    specs: arraySpecs,

    suites: {
        smokeTestCore: [
            "./core/login-sso/login-sso.e2e.ts",
            "./core/login/login-component.e2e.ts",
            "./core/login/remember-me.e2e.ts",
            "./core/viewer/**/*.e2e.ts"
        ],
        smokeTestCsSearch: [
            "./content-services/document-list/**/*.e2e.ts",
            "./content-services/metadata/**/*.e2e.ts",
            "./search/components/**/*.e2e.ts"
        ],
        smokeTestPs: [
            "./process-services/process/**/*.e2e.ts",
            "./process-services/form/**/*.e2e.ts",
            "./process-services-cloud/process/**/*.e2e.ts"
        ]
    },

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
                    'directory_upgrade': true,
                    'default_directory': downloadFolder
                },
                'browser': {
                    'setDownloadBehavior': {
                        'behavior': 'allow',
                        'downloadPath': downloadFolder
                    }
                }
            },
            args: [
                `--window-size=${width},${height}`,
                '--disable-gpu',
                '--no-sandbox',
                '--disable-web-security',
                '--disable-browser-side-navigation',
                '--allow-running-insecure-content',
                ...(BROWSER_RUN === true ? [] : ['--headless'])]
        }
    },

    directConnect: !SELENIUM_SERVER,

    baseUrl: HOST + '/#',

    params: {
        testConfig: testConfig,
        loginRoute: '/login',
        groupSuffix: GROUP_SUFFIX,
        identityAdmin: testConfig.identityAdmin,
        identityUser: testConfig.identityUser,
        resources: RESOURCES
    },

    framework: 'jasmine',

    getPageTimeout: 90000,

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 180000,
        includeStackTrace: true,
        print: () => {
        },
        ...(process.env.CI ? smartRunnerFactory.applyExclusionFilter() : {})
    },

    /**
     * The address of a running selenium server (must be manually start before running the tests). If this is specified seleniumServerJar and seleniumPort will be ignored.
     * @config {String} seleniumAddress
     */
    seleniumAddress: SELENIUM_SERVER,

    SELENIUM_PROMISE_MANAGER: false,

    plugins: [{
        package: 'protractor-screenshoter-plugin',
        screenshotPath: path.resolve(__dirname, '../e2e-output/'),
        screenshotOnExpect: 'failure',
        withLogs: true,
        writeReportFreq: 'end',
        imageToAscii: 'none',
        htmlOnExpect: 'none',
        htmlOnSpec: 'none',
        clearFoldersBeforeTest: false
    }],

    onCleanUp(results) {
        if (process.env.CI) {
            retry.onCleanUp(results);
        }
    },

    async onPrepare() {
        if (process.env.CI) {
            retry.onPrepare();
            smartRunnerFactory.getInstance().onPrepare();
        }

        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.e2e.json')
        });

        require('tsconfig-paths').register({
            project: './e2e/tsconfig.e2e.json',
            baseUrl: './e2e/',
            paths: tsConfig.compilerOptions.paths
        });

        // @ts-ignore
        browser.driver.sendChromiumCommand('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadFolder
        });

        // @ts-ignore
        browser.manage().window().setSize(width, height);

        jasmine.getEnv().addReporter(
            new SpecReporter({
                spec: {
                    displayStacktrace: 'raw',
                    displayDuration: true
                }
            })
        );

        function disableCSSAnimation() {
            const css = '* {' +
                '-webkit-transition-duration: 0s !important;' +
                'transition-duration: 0s !important;' +
                '-webkit-animation-duration: 0s !important;' +
                'animation-duration: 0s !important;' +
                '}';
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');

            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }

        // @ts-ignore
        await browser.driver.executeScript(disableCSSAnimation);

        // @ts-ignore
        await browser.waitForAngularEnabled(false);
        await browser.get(`${HOST}/#/settings`);
        await browser.waitForAngularEnabled(true);

        try {
            await LocalStorageUtil.clearStorage();
            // @ts-ignore
            await LocalStorageUtil.setStorageItem('ecmHost', browser.params.testConfig.appConfig.ecmHost);
            // @ts-ignore
            await LocalStorageUtil.setStorageItem('bpmHost', browser.params.testConfig.appConfig.bpmHost);
            // @ts-ignore
            await LocalStorageUtil.setStorageItem('providers', browser.params.testConfig.appConfig.provider);
            await LocalStorageUtil.setStorageItem('baseShareUrl', `${HOST}/#`);

            // @ts-ignore
            await LocalStorageUtil.setStorageItem('authType', browser.params.testConfig.appConfig.authType);

            // @ts-ignore
            if (browser.params.testConfig.appConfig.authType === 'OAUTH') {

                // @ts-ignore
                await LocalStorageUtil.setStorageItem('identityHost', browser.params.testConfig.appConfig.identityHost);
                // @ts-ignore
                await LocalStorageUtil.setStorageItem('oauth2', JSON.stringify(browser.params.testConfig.appConfig.oauth2));
            }

            await LocalStorageUtil.apiReset();

        } catch (error) {
            Logger.error(`====== Demo shell not able to start ======`);
            Logger.error(error);
            process.exit();
        }
    },

    afterLaunch: async function (statusCode) {
        if (SAVE_SCREENSHOT) {
            console.log(`Save screenshot enabled`);

            let retryCount = 1;
            if (argv.retry) {
                retryCount = ++argv.retry;
            }
            try {
                await uploadScreenshot(retryCount, (process.env.FOLDER || ''));
            } catch (error) {
                console.error('Error saving screenshot', error);
            }
        } else {
            console.log(`Save screenshot disabled`);
        }

        return retry.afterLaunch(MAX_RETRIES, statusCode);
    },

    onComplete: async function () {
        browser.manage().logs().get('browser').then(function (browserLog) {
            if (browserLog.length) {
                browserLog = browserLog.filter((log) => {
                    return log.level.name_ === 'SEVERE';
                })
                if (browserLog.length) {
                    console.error('\x1b[31m', '============ Browser console error ===========');

                    browserLog.forEach((log) => {
                        console.error('\x1b[31m', log.message);
                    })

                }
            }
        });
    }

};
