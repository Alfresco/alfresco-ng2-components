const htmlReporter = require('protractor-html-reporter-2');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const projectRoot = path.resolve(__dirname, '../../');

let FOLDER = process.env.FOLDER || '';

function buildNumber() {
    let buildNumber = process.env.TRAVIS_BUILD_NUMBER;
    if (!buildNumber) {
        process.env.TRAVIS_BUILD_NUMBER = Date.now();
    }

    return process.env.TRAVIS_BUILD_NUMBER;
}

async function uploadScreenshot(alfrescoJsApi, retryCount) {
    let files = fs.readdirSync(path.join(__dirname, '../../e2e-output/screenshots'));

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
            let pathFile = path.join(__dirname, '../../e2e-output/screenshots', fileName);
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

module.exports = {
    uploadScreenshot: uploadScreenshot
};
