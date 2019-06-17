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
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

export class UploadActions {
    alfrescoJsApi: any = null;

    constructor(alfrescoJsApi: AlfrescoApi) {
        this.alfrescoJsApi = alfrescoJsApi;
    }

    async uploadFile(fileLocation, fileName, parentFolderId) {
        const pathFile = path.join(browser.config.rootPath + fileLocation);
        const file = fs.createReadStream(pathFile);

        return this.alfrescoJsApi.upload.uploadFile(
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

    async createEmptyFiles(emptyFileNames: string[], parentFolderId) {
        const filesRequest = [];

        for (let i = 0; i < emptyFileNames.length; i++) {
            const jsonItem = {};
            jsonItem['name'] = emptyFileNames[i];
            jsonItem['nodeType'] = 'cm:content';
            filesRequest.push(jsonItem);
        }

        return this.alfrescoJsApi.nodes.addNode(parentFolderId, filesRequest, {}, {
            filedata: ''
        });
    }

    async createFolder(folderName, parentFolderId) {
        return this.alfrescoJsApi.nodes.addNode(parentFolderId, {
            'name': folderName,
            'nodeType': 'cm:folder'
        }, {}, {});
    }

    async deleteFileOrFolder(nodeId) {
        return this.alfrescoJsApi.nodes.deleteNode(nodeId, { permanent: true } );
    }

    async uploadFolder(sourcePath, folder) {
        const absolutePath = '../../' + sourcePath;
        const files = fs.readdirSync(path.join(browser.config.rootPath , absolutePath));
        let uploadedFiles;
        const promises = [];

        if (files && files.length > 0) {

            for (const fileName of files) {
                const pathFile = path.join(sourcePath, fileName);
                promises.push(this.uploadFile(pathFile, fileName, folder));
            }
            uploadedFiles = await Promise.all(promises);
        }

        return uploadedFiles;
    }
}
