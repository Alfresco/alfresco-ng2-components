/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path = require('path');
import fs = require('fs');
import TestConfig = require('../../test.config');
import remote = require('selenium-webdriver/remote');

export class UploadActions {

    async uploadFile(alfrescoJsApi, fileLocation, fileName, parentFolderId) {
        browser.setFileDetector(new remote.FileDetector());

        let pathFile = path.join(TestConfig.main.rootPath + fileLocation);
        let file = fs.createReadStream(pathFile);

        return alfrescoJsApi.upload.uploadFile(
            file,
            '',
            parentFolderId,
            null,
            {
                'name': fileName,
                'nodeType': 'cm:content',
                'renditions': 'doclib'
            }
        );
    }

    async createEmptyFiles(alfrescoJsApi, emptyFileNames: string[], parentFolderId) {
        browser.setFileDetector(new remote.FileDetector());

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
        browser.setFileDetector(new remote.FileDetector());

        return alfrescoJsApi.nodes.addNode(parentFolderId, {
            'name': folderName,
            'nodeType': 'cm:folder'
        }, {}, {});
    }

    async deleteFilesOrFolder(alfrescoJsApi, folderId) {
        return alfrescoJsApi.nodes.deleteNode(folderId, { permanent: true } );
    }

}
