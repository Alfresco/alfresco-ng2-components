/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { browser } from 'protractor';
import * as path from 'path';
import * as fs from 'fs';

export class UploadActions {

    async uploadFile(alfrescoJsApi, fileLocation, fileName, parentFolderId) {
        const pathFile = path.join(browser.config.rootPath + fileLocation);
        const file = fs.createReadStream(pathFile);

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
        const filesRequest = [];

        for (let i = 0; i < emptyFileNames.length; i++) {
            const jsonItem = {};
            jsonItem['name'] = emptyFileNames[i];
            jsonItem['nodeType'] = 'cm:content';
            filesRequest.push(jsonItem);
        }

        return alfrescoJsApi.nodes.addNode(parentFolderId, filesRequest, {}, {
            filedata: ''
        });
    }

    async createFolder(alfrescoJsApi, folderName, parentFolderId) {
        return alfrescoJsApi.nodes.addNode(parentFolderId, {
            'name': folderName,
            'nodeType': 'cm:folder'
        }, {}, {});
    }

    async deleteFilesOrFolder(alfrescoJsApi, folderId) {
        return alfrescoJsApi.nodes.deleteNode(folderId, { permanent: true } );
    }

    async uploadFolder(alfrescoJsApi, sourcePath, folder) {
        const absolutePath = '../../' + sourcePath;
        const files = fs.readdirSync(path.join(browser.config.rootPath , absolutePath));
        let uploadedFiles;
        const promises = [];

        if (files && files.length > 0) {

            for (const fileName of files) {
                const pathFile = path.join(sourcePath, fileName);
                promises.push(this.uploadFile(alfrescoJsApi, pathFile, fileName, folder));
            }
            uploadedFiles = await Promise.all(promises);
        }

        return uploadedFiles;
    }
}
