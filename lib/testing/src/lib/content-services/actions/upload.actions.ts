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
import { NodeEntry } from '@alfresco/js-api/src/api/content-rest-api/model/nodeEntry';

export class UploadActions {
    alfrescoJsApi: AlfrescoApi = null;

    constructor(alfrescoJsApi: AlfrescoApi) {
        this.alfrescoJsApi = alfrescoJsApi;
    }

    async uploadFile(fileLocation, fileName, parentFolderId): Promise<any> {
        const pathFile = path.join(browser.params.rootPath + '/e2e' + fileLocation);
        const file = fs.createReadStream(pathFile);

        return this.alfrescoJsApi.upload.uploadFile(
            file,
            '',
            parentFolderId,
            null,
            {
                name: fileName,
                nodeType: 'cm:content',
                renditions: 'doclib'
            }
        );
    }

    async createEmptyFiles(emptyFileNames: string[], parentFolderId): Promise<NodeEntry> {
        const filesRequest = [];

        for (let i = 0; i < emptyFileNames.length; i++) {
            const jsonItem = {};
            jsonItem['name'] = emptyFileNames[i];
            jsonItem['nodeType'] = 'cm:content';
            filesRequest.push(jsonItem);
        }

        return this.alfrescoJsApi.nodes.addNode(parentFolderId, <any> filesRequest, {});
    }

    async createFolder(folderName, parentFolderId): Promise<NodeEntry> {
        return this.alfrescoJsApi.node.addNode(parentFolderId, {
            name: folderName,
            nodeType: 'cm:folder'
        }, {});
    }

    async deleteFileOrFolder(nodeId) {
        return this.alfrescoJsApi.node.deleteNode(nodeId, { permanent: true });
    }

    async uploadFolder(sourcePath, folder) {
        const absolutePath = 'e2e/' + sourcePath;
        const files = fs.readdirSync(path.join(browser.params.rootPath, absolutePath));
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
