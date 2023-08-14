const fs = require('fs');
const path = require('path');
const child_process = require("child_process");
const TestConfig = require('../test.config');
const { AlfrescoApi, NodesApi, UploadApi } = require('@alfresco/js-api');

function buildNumber() {
    let buildNumber = process.env.GH_BUILD_NUMBER;
    if (!buildNumber) {
        process.env.GH_BUILD_NUMBER = Date.now();
    }

    return process.env.GH_BUILD_NUMBER;
}

async function uploadScreenshot(retryCount, suffixFileName) {
    console.log(`Start uploading report ${retryCount}`);

    const alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.screenshot.url
    });

    const nodesApi = new NodesApi(alfrescoJsApi);
    const uploadApi = new UploadApi(alfrescoJsApi);

    await alfrescoJsApi.login(TestConfig.users.screenshot.username, TestConfig.users.screenshot.password);

    let folderNode;

    try {
        folderNode = await nodesApi.createNode('-my-', {
            'name': `retry-${retryCount}`,
            'relativePath': `Builds/${buildNumber()}/`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });
    } catch (error) {
        folderNode = await nodesApi.createNode('-my-', {
            'relativePath': `Builds/${buildNumber()}/retry-${retryCount}`,
            'nodeType': 'cm:folder'
        }, {}, {
            'overwrite': true
        });
    }

    suffixFileName = suffixFileName.replace(/\//g, '-');

    fs.renameSync(path.resolve(__dirname, '../../e2e-output/'), path.resolve(__dirname, `../../e2e-output-${retryCount}-${process.env.GH_ACTION_RETRY_COUNT}/`))

    child_process.execSync(` tar -czvf ../e2e-result-${suffixFileName}-${retryCount}.tar .`, {
        cwd: path.resolve(__dirname, `../../e2e-output-${retryCount}-${process.env.GH_ACTION_RETRY_COUNT}/`)
    });

    const pathFile = path.join(__dirname, `../../e2e-result-${suffixFileName}-${retryCount}.tar`);
    const file = fs.createReadStream(pathFile);

    await uploadApi.uploadFile(
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
