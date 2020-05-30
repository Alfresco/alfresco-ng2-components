const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const projectRoot = path.resolve(__dirname, '../../');
const TestConfig = require('../test.config');
const AlfrescoApi = require('@alfresco/js-api').AlfrescoApiCompatibility;

function buildNumber() {
    let buildNumber = process.env.TRAVIS_BUILD_NUMBER;
    if (!buildNumber) {
        process.env.TRAVIS_BUILD_NUMBER = Date.now();
    }

    return process.env.TRAVIS_BUILD_NUMBER;
}

async function uploadScreenshot(retryCount) {
    let files = fs.readdirSync(path.join(__dirname, '../../e2e-output/screenshots'));

    if (files && files.length > 0) {

        let alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.screenshot.url
        });

        await alfrescoJsApi.apiService.login(TestConfig.screenshot.username, TestConfig.screenshot.password);

        let folder;

        try {
            folder = await alfrescoJsApi.apiService.nodes.addNode('-my-', {
                'name': `retry-${retryCount}`,
                'relativePath': `Builds/${buildNumber()}/screenshot`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        } catch (error) {
            folder = await alfrescoJsApi.apiService.nodes.getNode('-my-', {
                'relativePath': `Builds/${buildNumber()}/screenshot/retry-${retryCount}`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        }

        for (const fileName of files) {
            let pathFile = path.join(__dirname, '../../e2e-output/screenshots', fileName);
            let file = fs.createReadStream(pathFile);

            let safeFileName = fileName.match(/\[(.*?)\]/);

            if (safeFileName) {
                const safeFileNameMatch = safeFileName[1];
                try {
                    await alfrescoJsApi.apiService.upload.uploadFile(
                        file,
                        '',
                        folder.entry.id,
                        null,
                        {
                            'name': safeFileNameMatch,
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
    cleanReportFolder: cleanReportFolder
};
