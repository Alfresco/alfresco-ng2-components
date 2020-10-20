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

async function uploadScreenshot(retryCount, suffixFileName) {
    console.log(`Start uploading report ${retryCount}`);

    let alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.screenshot.url
    });

    await alfrescoJsApi.login(TestConfig.users.screenshot.username, TestConfig.users.screenshot.password);

    let folderNode;

    try {
        folderNode = await alfrescoJsApi.nodes.addNode('-my-', {
            'name': `retry-${retryCount}`,
            'relativePath': `Builds/${buildNumber()}/`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });
    } catch (error) {
        folderNode = await alfrescoJsApi.nodes.getNode('-my-', {
            'relativePath': `Builds/${buildNumber()}/retry-${retryCount}`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });
    }

    fs.renameSync(path.resolve(__dirname, '../../e2e-output/'), path.resolve(__dirname, `../../e2e-output-${retryCount}/`))

    const child_process = require("child_process");
    child_process.execSync(` tar -czvf ../e2e-result-${suffixFileName}-${retryCount}.tar .`, {
        cwd: path.resolve(__dirname, `../../e2e-output-${retryCount}/`)
    });

    let pathFile = path.join(__dirname, `../../e2e-result-${suffixFileName}-${retryCount}.tar`);
    let file = fs.createReadStream(pathFile);
    await alfrescoJsApi.upload.uploadFile(
        file,
        '',
        folderNode.entry.id,
        null,
        {
            'name': `e2e-result-${suffixFileName}-${retryCount}.tar`,
            'nodeType': 'cm:content',
            'autoRename': true
        }
    );
}

module.exports = {
    uploadScreenshot: uploadScreenshot
};
