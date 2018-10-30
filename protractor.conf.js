const path = require('path');
const {SpecReporter} = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');
const htmlReporter = require('protractor-html-reporter-2');
const retry = require('protractor-retry').retry;

const AlfrescoApi = require('alfresco-js-api-node');
const TestConfig = require('./e2e/test.config');
var argv = require('yargs').argv;

const fs = require('fs');
const rimraf = require('rimraf');

const projectRoot = path.resolve(__dirname);

const width = 1366;
const height = 768;

var HOST = process.env.URL_HOST_ADF;
var BROWSER_RUN = process.env.BROWSER_RUN;
var FOLDER = process.env.FOLDER || '';
var SELENIUM_SERVER = process.env.SELENIUM_SERVER || '';
var DIRECT_CONNECCT = SELENIUM_SERVER ? false : true;

var specsToRun = './**/' + FOLDER + '**/*.e2e.ts';

if (process.env.NAME_TEST) {
    specsToRun = './e2e/**/' + process.env.NAME_TEST;
}

var args_options = [];

if (BROWSER_RUN === 'true') {
    args_options = ['--incognito', '--window-size=1366,768', '--disable-gpu'];
} else {
    args_options = ['--incognito', '--headless', '--window-size=1366,768', '--disable-gpu'];
}

var downloadFolder = path.join(__dirname, 'e2e/downloads');

var buildNumber = () => {
    let buildNumber = process.env.TRAVIS_BUILD_NUMBER;
    if (!buildNumber) {
        process.env.TRAVIS_BUILD_NUMBER = Date.now();
    }

    return process.env.TRAVIS_BUILD_NUMBER;
}

exports.config = {
    allScriptsTimeout: 60000,

    specs: [
        specsToRun
    ],

    capabilities: {
        browserName: 'chrome',

        shardTestFiles: true,
        maxInstances: 1,
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

        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
        var generatedSuiteName = Math.random().toString(36).substr(2, 5);
        var junitReporter = new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: `${projectRoot}/e2e-output/junit-report`,
            filePrefix: 'results.xml-' + generatedSuiteName
        });
        jasmine.getEnv().addReporter(junitReporter);

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

    beforeLaunch: function () {
        var reportsFolder = `${projectRoot}/e2e-output/junit-report/`;

        fs.exists(reportsFolder, function(exists, error) {
            if (exists) {
                rimraf(reportsFolder, function(err) {
                    console.log('[ERROR] rimraf: ', err);
                });
            }

            if(error) {
                console.log('[ERROR] fs', error);
            }
        });
    },

    afterLaunch: async function () {

        let saveScreenshot = process.env.SAVE_SCREENSHOT;

        if (saveScreenshot) {
            var retryCount = 1;
            if (argv.retry) {
                retryCount = ++argv.retry;
            }

            let filenameReport = `ProtractorTestReport-${FOLDER.replace('/', '')}-${retryCount}`;

            console.log(filenameReport);

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
            };

            var lastHtmlFile = temporaryHtmlPath + lastFileName + '.html';

            if(!(fs.lstatSync(lastHtmlFile).isDirectory())) {
                output = output + fs.readFileSync(lastHtmlFile);
            };

            var fileName = savePath + 'html/' + filenameReport + '.html';

            fs.writeFileSync(fileName, output, 'utf8');

            let alfrescoJsApi = new AlfrescoApi({
                provider: 'ECM',
                hostEcm: TestConfig.adf.url
            });
            alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            if (saveScreenshot === 'true') {

                let files = fs.readdirSync(path.join(__dirname, './e2e-output/screenshots'));

                if (files && files.length > 0) {

                    try {
                        folder = await
                            alfrescoJsApi.nodes.addNode('-my-', {
                                'name': `retry-${retryCount}`,
                                'relativePath': `Builds/${buildNumber()}/screenshot`,
                                'nodeType': 'cm:folder'
                            }, {}, {
                                'overwrite': true
                            });
                    } catch (error) {
                        console.log('Folder screenshot already present');

                        folder = await
                            alfrescoJsApi.nodes.getNode('-my-', {
                                'relativePath': `Builds/${buildNumber()}/screenshot/retry-${retryCount}`,
                                'nodeType': 'cm:folder'
                            }, {}, {
                                'overwrite': true
                            });
                    }

                    for (const fileName of files) {

                        let pathFile = path.join(__dirname, './e2e-output/screenshots', fileName);
                        let file = fs.createReadStream(pathFile);

                        await
                            alfrescoJsApi.upload.uploadFile(
                                file,
                                '',
                                folder.entry.id,
                                null,
                                {
                                    'name': file.name,
                                    'nodeType': 'cm:content',
                                    'autoRename': true
                                }
                            );
                    }
                }
            }

            let pathFile = path.join(__dirname, './e2e-output/junit-report/html', filenameReport + '.html');
            let reportFile = fs.createReadStream(pathFile);

            let reportFolder;

            try {
                reportFolder = await
                    alfrescoJsApi.nodes.addNode('-my-', {
                        'name': 'report',
                        'relativePath': `Builds/${buildNumber()}`,
                        'nodeType': 'cm:folder'
                    }, {}, {
                        'overwrite': true
                    });
            } catch (error) {
                reportFolder = await
                    alfrescoJsApi.nodes.getNode('-my-', {
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

            if (saveScreenshot === 'true') {
                rimraf(`${projectRoot}/e2e-output/screenshots/`, function () {
                    console.log('done delete screenshot');
                });
            }

        }

        return retry.afterLaunch(3);
    }
};



