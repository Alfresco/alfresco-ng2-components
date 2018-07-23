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

    async uploadFolderFiles(alfrescoJsApi, sourcePath, folder) {
        let absolutePath = '../../' + sourcePath;
        let files = fs.readdirSync(path.join(__dirname, absolutePath));
        let uploadedFiles = [];

        if (files && files.length > 0) {

            for (const fileName of files) {

                let pathFile = path.join(__dirname, absolutePath, fileName);
                let file = fs.createReadStream(pathFile);

                let curretnFile = await  alfrescoJsApi.upload.uploadFile(
                    file,
                    '',
                    folder.entry.id,
                    null,
                    {
                        'name': file.name,
                        'nodeType': 'cm:content'
                    }
                );

                uploadedFiles.push(curretnFile);
            }
        }

        return uploadedFiles;
    }
}
