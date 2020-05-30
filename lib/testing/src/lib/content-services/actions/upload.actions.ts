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

import * as path from 'path';
import * as fs from 'fs';
import { NodeEntry } from '@alfresco/js-api/src/api/content-rest-api/model/nodeEntry';
import { ApiUtil } from '../../core/structure/api.util';
import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../core/actions/api.service';

export class UploadActions {

    api: ApiService;

    constructor(alfrescoJsApi: ApiService) {
        this.api = alfrescoJsApi;
    }

    async uploadFile(fileLocation, fileName, parentFolderId): Promise<any> {
        const file = fs.createReadStream(fileLocation);

        return this.api.apiService.upload.uploadFile(
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

        return this.api.apiService.nodes.addNode(parentFolderId, <any> filesRequest, {});
    }

    async createFolder(folderName, parentFolderId): Promise<NodeEntry> {
        return this.api.apiService.node.addNode(parentFolderId, {
            name: folderName,
            nodeType: 'cm:folder'
        }, {});
    }

    async deleteFileOrFolder(nodeId) {
        const apiCall = async () => {
            try {
                return this.api.apiService.node.deleteNode(nodeId, { permanent: true });
            } catch (error) {
                Logger.error('Error delete file or folder');
            }
        };

        return ApiUtil.waitForApi(apiCall, () => true);
    }

    async uploadFolder(sourcePath, folder) {
        const files = fs.readdirSync(sourcePath);
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
