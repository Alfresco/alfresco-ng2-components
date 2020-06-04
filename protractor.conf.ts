// tslint:disable: no-var-requires
// tslint:disable: no-console

const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const retry = require('protractor-retry').retry;
const tsConfig = require('./e2e/tsconfig.e2e.json');
const testConfig = require('./e2e/test.config');
const RESOURCES = require('./e2e/util/resources');
const smartRunner = require('protractor-smartrunner');
const resolve = require('path').resolve;
const ACTIVITI_CLOUD_APPS = require('./lib/testing/src/lib/process-services-cloud/resources/resources.json');

const { uploadScreenshot, cleanReportFolder } = require('./e2e/protractor/save-remote');
const argv = require('yargs').argv;

const projectRoot = path.resolve(__dirname);
const width = 1657, height = 1657;

const ENV_FILE = process.env.ENV_FILE;
const GROUP_SUFFIX = process.env.PREFIX || 'adf';

RESOURCES.ACTIVITI_CLOUD_APPS = ACTIVITI_CLOUD_APPS;
if (ENV_FILE) {
    require('dotenv').config({ path: ENV_FILE });
}

const HOST = process.env.URL_HOST_ADF;
const BROWSER_RUN = !!process.env.BROWSER_RUN;
const FOLDER = process.env.FOLDER || '';
const SELENIUM_SERVER = process.env.SELENIUM_SERVER || '';
const DIRECT_CONNECCT = !SELENIUM_SERVER;
const MAXINSTANCES = process.env.MAXINSTANCES || 1;
const TIMEOUT = parseInt(process.env.TIMEOUT, 10);
const SAVE_SCREENSHOT = (process.env.SAVE_SCREENSHOT === 'true');
const LIST_SPECS = process.env.LIST_SPECS || [];
const LOG = !!process.env.LOG;

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

const downloadFolder = path.join(__dirname, 'e2e/downloads');

async function setStorageItem(field, value) {
    // @ts-ignore
    await browser.executeScript(
        'window.adf.setStorageItem(`' + field + '`, `' + value + '`);'
    );
}

async function apiReset() {
    // @ts-ignore
    await browser.executeScript(
        `window.adf.apiReset();`
    );
}

const specs = () => {
    const specsToRun = FOLDER ? './**/e2e/' + FOLDER + '/**/*.e2e.ts' : './**/e2e/**/*.e2e.ts';

    if (LIST_SPECS.length === 0) {
        arraySpecs = [specsToRun];
    } else {
        // @ts-ignore
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
            binary: require('puppeteer').executablePath(),
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
            args: ['--incognito',
                `--window-size=${width},${height}`,
                '--disable-gpu',
                '--no-sandbox',
                '--disable-web-security',
                '--disable-browser-side-navigation',
                ...(BROWSER_RUN === true ? [] : ['--headless'])]
        }
    },

    directConnect: !SELENIUM_SERVER,

    baseUrl: HOST,

    params: {
        testConfig,
        loginRoute: '/login',
        config: testConfig.appConfig,
        groupSuffix: GROUP_SUFFIX,
        identityAdmin: testConfig.identityAdmin,
        identityUser: testConfig.identityUser,
        rootPath: __dirname,
        resources: RESOURCES
    },

    framework: 'jasmine2',

    getPageTimeout: 90000,

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000,
        print: () => {},
        ...smartRunner.withOptionalExclusions(
            resolve(__dirname, './e2e/protractor.excludes.json')
        )
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

    async onPrepare() {
        retry.onPrepare();

        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

        require('ts-node').register({
            project: require('path').join(__dirname, './e2e/tsconfig.e2e.json')
        });

        require('tsconfig-paths').register({
            project: 'e2e/tsconfig.e2e.json',
            baseUrl: 'e2e/',
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
                    displayStacktrace: true,
                    displayDuration: true
                }
            })
        );

        await browser.driver.executeScript(disableCSSAnimation);
        await browser.get(`${HOST}/settings`);
        await browser.executeScript('window.adf.clearStorage();');

        await setStorageItem('ecmHost', browser.params.testConfig.appConfig.ecmHost);
        await setStorageItem('bpmHost', browser.params.testConfig.appConfig.bpmHost);
        await setStorageItem('providers', browser.params.testConfig.appConfig.provider);
        await setStorageItem('baseShareUrl', HOST);

        if (browser.params.testConfig.appConfig.authType === 'OAUTH') {
            await setStorageItem('authType', browser.params.testConfig.appConfig.authType);
            await setStorageItem('identityHost', browser.params.testConfig.appConfig.identityHost);
            await setStorageItem('oauth2', JSON.stringify(browser.params.testConfig.appConfig.oauth2));
        }

        await apiReset();

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
            try {
                await uploadScreenshot(retryCount);
            } catch (error) {
                console.error('Error saving screenshot', error);
            }
        }

        return retry.afterLaunch(4);
    }

};
