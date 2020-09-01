const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const TestConfig = require('../test.config');
const AlfrescoApi = require('@alfresco/js-api').AlfrescoApiCompatibility;

function buildNumber() {
    let buildNumber = process.env.TRAVIS_BUILD_NUMBER;
    if (!buildNumber) {
        process.env.TRAVIS_BUILD_NUMBER = Date.now();
    }

    return process.env.TRAVIS_BUILD_NUMBER;
}

async function uploadScreenshot(retryCount, folder) {
    console.log(`Start uploading report ${retryCount}`);

    let alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.screenshot.url
    });

    await alfrescoJsApi.login(TestConfig.screenshot.username, TestConfig.screenshot.password);

    let folder;

    try {
        folder = await alfrescoJsApi.nodes.addNode('-my-', {
            'name': `retry-${retryCount}`,
            'relativePath': `Builds/${buildNumber()}/`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });
    } catch (error) {
        folder = await alfrescoJsApi.nodes.getNode('-my-', {
            'relativePath': `Builds/${buildNumber()}/retry-${retryCount}`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });
    }

    fs.renameSync(path.resolve(__dirname, '../../e2e-output/'), path.resolve(__dirname, `../../e2e-output-${retryCount}/`))

    const child_process = require("child_process");
    child_process.execSync(` tar -czvf ../e2e-result-${folder}-${retryCount}.tar .`, {
        cwd: path.resolve(__dirname, `../../e2e-output-${retryCount}/`)
    });

    let pathFile = path.join(__dirname, `../../e2e-result-${folder}-${retryCount}.tar`);
    let file = fs.createReadStream(pathFile);
    await alfrescoJsApi.upload.uploadFile(
        file,
        '',
        folder.entry.id,
        null,
        {
            'name': 'e2e-result.tar',
            'nodeType': 'cm:content',
            'autoRename': true
        }
    );
}

module.exports = {
    uploadScreenshot: uploadScreenshot
};
