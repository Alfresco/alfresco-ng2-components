const htmlReporter = require('protractor-html-reporter-2');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');

function buildNumber() {
    let buildNumber = process.env.TRAVIS_BUILD_NUMBER;
    if (!buildNumber) {
        process.env.TRAVIS_BUILD_NUMBER = Date.now();
    }

    return process.env.TRAVIS_BUILD_NUMBER;
}

async function uploadScreenshot(alfrescoJsApi, retryCount) {
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
            } catch (error) {
                console.log(error);
            }
        }
    }
}

async function uploadReport(alfrescoJsApi, filenameReport) {
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
        await alfrescoJsApi.upload.uploadFile(
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
}

async function saveReport(alfrescoJsApi, retryCount) {
    let filenameReport = `ProtractorTestReport-${FOLDER}-${retryCount}`;

    let output = '';
    let savePath = `${projectRoot}/e2e-output/junit-report/`;
    let temporaryHtmlPath = savePath + 'html/temporaryHtml/';
    let lastFileName = '';

    let files = fs.readdirSync(savePath);

    if (files && files.length > 0) {
        for (const fileName of files) {
            const testConfigReport = {
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

    await uploadReport(alfrescoJsApi, filenameReport);

    rimraf(`${projectRoot}/e2e-output/screenshots/`, function () {
        console.log('done delete screenshot');
    });
}

async function cleanReportFolder() {
    let reportsFolder = `${projectRoot}/e2e-output/junit-report/`;

    fs.exists(reportsFolder, function (exists, error) {
        if (exists) {
            rimraf(reportsFolder, function (err) {
            });
        }

        if (error) {
            console.error('[ERROR] fs', error);
        }
    });
}

module.exports = {
    uploadScreenshot: uploadScreenshot,
    uploadReport: uploadReport,
    cleanReportFolder: cleanReportFolder,
    saveReport: saveReport
};
