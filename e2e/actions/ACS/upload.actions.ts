import path = require('path');
import fs = require('fs');
import TestConfig = require('../../test.config');

export class UploadActions {

    async uploadFile(alfrescoJsApi, fileLocation, fileName, parentFolderId) {

        let pathFile = path.join(TestConfig.main.rootPath + fileLocation);
        let file = fs.createReadStream(pathFile);

        return alfrescoJsApi.upload.uploadFile(
            file,
            '',
            parentFolderId,
            null,
            {
                'name': fileName,
                'nodeType': 'cm:content'
            }
        );
    }

    async createEmptyFiles(alfrescoJsApi, emptyFileNames: string[], parentFolderId) {
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

    async uploadFolder(alfrescoJsApi, folderName, parentFolderId) {
        return alfrescoJsApi.nodes.addNode(parentFolderId, {
            'name': folderName,
            'nodeType': 'cm:folder'
        }, {}, {});
    }

}
