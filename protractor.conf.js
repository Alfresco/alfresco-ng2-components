const path = require('path');
const {SpecReporter} = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');
const htmlReporter = require('protractor-html-reporter-2');
const retry = require('protractor-retry').retry;

const AlfrescoApi = require('@alfresco/js-api');
const TestConfig = require('./e2e/test.config');
let argv = require('yargs').argv;

const fs = require('fs');
const rimraf = require('rimraf');

const projectRoot = path.resolve(__dirname);

const width = 1366;
const height = 768;

let HOST = process.env.URL_HOST_ADF;
let BROWSER_RUN = process.env.BROWSER_RUN;
let FOLDER = process.env.FOLDER || '';
let SELENIUM_SERVER = process.env.SELENIUM_SERVER || '';
let DIRECT_CONNECCT = SELENIUM_SERVER ? false : true;
let MAXINSTANCES = process.env.MAXINSTANCES || 1;
let TIMEOUT = parseInt(process.env.TIMEOUT, 10);
let SAVE_SCREENSHOT = (process.env.SAVE_SCREENSHOT == 'true');

let specsToRun = './**/' + FOLDER + '**/*.e2e.ts';

if (process.env.NAME_TEST) {
    specsToRun = './e2e/**/' + process.env.NAME_TEST;
}

let args_options = [];

if (BROWSER_RUN === 'true') {
    args_options = ['--incognito', '--window-size=1366,768', '--disable-gpu'];
} else {
    args_options = ['--incognito', '--headless', '--window-size=1366,768', '--disable-gpu'];
}

let downloadFolder = path.join(__dirname, 'e2e/downloads');

let buildNumber = () => {
    let buildNumber = process.env.TRAVIS_BUILD_NUMBER;
    if (!buildNumber) {
        process.env.TRAVIS_BUILD_NUMBER = Date.now();
    }

    return process.env.TRAVIS_BUILD_NUMBER;
};


saveScreenshots = async function (alfrescoJsApi, retryCount) {
    let files = fs.readdirSync(path.join(__dirname, './e2e-output/screenshots'));

    if (files && files.length > 0) {

        let folder;

        try {
            folder = await alfrescoJsApi.nodes.addNode('-my-', {
                'name': `retry-${retryCount}`,
                'relativePath': `Builds/${buildNumber()}/screenshot`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        } catch (error) {
            folder = await alfrescoJsApi.nodes.getNode('-my-', {
                'relativePath': `Builds/${buildNumber()}/screenshot/retry-${retryCount}`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        }

        for (const fileName of files) {
            let pathFile = path.join(__dirname, './e2e-output/screenshots', fileName);
            let file = fs.createReadStream(pathFile);

            let safeFileName = fileName.replace(new RegExp('"', 'g'), '');

            try {
                await alfrescoJsApi.upload.uploadFile(
                    file,
                    '',
                    folder.entry.id,
                    null,
                    {
                        'name': safeFileName,
                        'nodeType': 'cm:content',
                        'autoRename': true
                    }
                );
            }catch(error){
                console.log(error);
            }
        }
    }
};

saveReport = async function (filenameReport, alfrescoJsApi) {
    let pathFile = path.join(__dirname, './e2e-output/junit-report/html', filenameReport + '.html');
    let reportFile = fs.createReadStream(pathFile);

    let reportFolder;

    try {
        reportFolder = await alfrescoJsApi.nodes.addNode('-my-', {
            'name': 'report',
            'relativePath': `Builds/${buildNumber()}`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });
    } catch (error) {
        reportFolder = await alfrescoJsApi.nodes.getNode('-my-', {
            'relativePath': `Builds/${buildNumber()}/report`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });

    }

    try {
        await
            alfrescoJsApi.upload.uploadFile(
                reportFile,
                '',
                reportFolder.entry.id,
                null,
                {
                    'name': reportFile.name,
                    'nodeType': 'cm:content',
                    'autoRename': true
                }
            );

    } catch (error) {
        console.log('error' + error);

    }
};


exports.config = {
    allScriptsTimeout: TIMEOUT,

    specs: [
        specsToRun
    ],

    useAllAngular2AppRoots: true,

    capabilities: {
        browserName: 'chrome',

        shardTestFiles: true,
        maxInstances: MAXINSTANCES,
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
        retry.onPrepare();

        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
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

        let generatedSuiteName = Math.random().toString(36).substr(2, 5);
        let junitReporter = new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: `${projectRoot}/e2e-output/junit-report`,
            filePrefix: 'results.xml-' + generatedSuiteName,
        });
        jasmine.getEnv().addReporter(junitReporter);

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
        let reportsFolder = `${projectRoot}/e2e-output/junit-report/`;

        fs.exists(reportsFolder, function (exists, error) {
            if (exists) {
                rimraf(reportsFolder, function (err) {
                    console.log('[ERROR] rimraf: ', err);
                });
            }

            if (error) {
                console.log('[ERROR] fs', error);
            }
        });
    },

    afterLaunch: async function () {

        if (SAVE_SCREENSHOT) {
            let retryCount = 1;
            if (argv.retry) {
                retryCount = ++argv.retry;
            }

            let filenameReport = `ProtractorTestReport-${FOLDER.replace('/', '')}-${retryCount}`;

            let output = '';
            let savePath = `${projectRoot}/e2e-output/junit-report/`;
            let temporaryHtmlPath = savePath + 'html/temporaryHtml/';
            let lastFileName = '';

            let files = fs.readdirSync(savePath);

            if (files && files.length > 0) {
                for (const fileName of files) {
                    testConfigReport = {
                        reportTitle: 'Protractor Test Execution Report',
                        outputPath: temporaryHtmlPath,
                        outputFilename: Math.random().toString(36).substr(2, 5) + filenameReport,
                    };

                    let filePath = `${projectRoot}/e2e-output/junit-report/` + fileName;

                    new htmlReporter().from(filePath, testConfigReport);
                    lastFileName = testConfigReport.outputFilename;
                }
            }

            let lastHtmlFile = temporaryHtmlPath + lastFileName + '.html';

            if (!(fs.lstatSync(lastHtmlFile).isDirectory())) {
                output = output + fs.readFileSync(lastHtmlFile);
            }

            let fileName = savePath + 'html/' + filenameReport + '.html';

            fs.writeFileSync(fileName, output, 'utf8');

            let alfrescoJsApi = new AlfrescoApi({
                provider: 'ECM',
                hostEcm: TestConfig.adf.url
            });
            alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await saveScreenshots(alfrescoJsApi, retryCount);

            await saveReport(filenameReport, alfrescoJsApi);

            rimraf(`${projectRoot}/e2e-output/screenshots/`, function () {
                console.log('done delete screenshot');
            });

        }

        return retry.afterLaunch(3);
    }

};

