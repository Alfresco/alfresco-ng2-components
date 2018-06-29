import path = require('path');
import fs = require('fs');
import TestConfig = require('../../test.config.js');

export class UploadActions {

    uploadFile(alfrescoJsApi, fileLocation, fileName, parentFolderId) {
        let pathFile = path.join(TestConfig.main.rootPath + fileLocation);
        let file = fs.createReadStream(pathFile);

        return alfrescoJsApi.nodes.addNode(parentFolderId, {
            'name': fileName,
            'nodeType': 'cm:content'
        }, {}, {
            filedata: file
        });
    }

    createEmptyFilesViaAPI(alfrescoJsApi, emptyFileNames: string[], parentFolderId) {
        let filesRequest = [];

        for (let i = 0; i < emptyFileNames.length; i++) {
            let jsonItem = {};
            jsonItem['name'] = emptyFileNames[i];
            jsonItem['nodeType'] = 'cm:content';
            filesRequest.push(jsonItem);
        }

        return alfrescoJsApi.nodes.addNode(parentFolderId, filesRequest, {}, {
            filedata: ''
        });
    }

    uploadFolder(alfrescoJsApi, folderName, parentFolderId) {
        return alfrescoJsApi.nodes.addNode(parentFolderId, {
            'name': folderName,
            'nodeType': 'cm:folder'
        }, {}, {});
    }

}
