/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { NodeEntry, UploadApi, NodesApi } from '@alfresco/js-api';
import { ApiUtil } from '../../../shared/api/api.util';
import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../../shared/api/api.service';

export class UploadActions {

    api: ApiService;
    uploadApi: UploadApi;
    nodesApi: NodesApi;

    constructor(apiService: ApiService) {
        this.api = apiService;
        this.uploadApi = new UploadApi(apiService.getInstance());
        this.nodesApi = new NodesApi(apiService.getInstance());
    }

    async uploadFile(fileLocation, fileName, parentFolderId): Promise<any> {
        const file = fs.createReadStream(fileLocation);

        return this.uploadApi.uploadFile(
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

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < emptyFileNames.length; i++) {
            const jsonItem = {};
            jsonItem['name'] = emptyFileNames[i];
            jsonItem['nodeType'] = 'cm:content';
            filesRequest.push(jsonItem);
        }

        return this.nodesApi.createNode(parentFolderId, filesRequest as any, {});
    }

    async createFolder(folderName, parentFolderId): Promise<NodeEntry> {
        return this.nodesApi.createNode(parentFolderId, {
            name: folderName,
            nodeType: 'cm:folder'
        }, {});
    }

    async deleteFileOrFolder(nodeId) {
        const apiCall = async () => {
            try {
                return this.nodesApi.deleteNode(nodeId, { permanent: true });
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
