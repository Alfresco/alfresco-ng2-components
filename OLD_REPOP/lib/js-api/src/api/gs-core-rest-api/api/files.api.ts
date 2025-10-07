/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { RecordEntry } from '../model/recordEntry';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery } from './types';

/**
 * Files service.
 * @module FilesApi
 */
export class FilesApi extends BaseApi {
    /**
     * Declare as record
     *
     * Declares the file **fileId** in the unfiled records container. The original file is moved to the Records Management site and a secondary parent association is created in the file's original site.
     * @param fileId The identifier of a non-record file.
     * @param opts Optional parameters
     * @param opts.hideRecord Flag to indicate whether the record should be hidden from the current parent folder. (default to false)
     * @returns Promise<RecordEntry>
     */
    declareRecord(
        fileId: string,
        opts?: {
            hideRecord?: boolean;
            parentId?: string;
        } & RecordsIncludeQuery
    ): Promise<RecordEntry> {
        throwIfNotDefined(fileId, 'fileId');

        const pathParams = {
            fileId
        };

        const queryParams = {
            hideRecord: opts?.hideRecord,
            parentId: opts?.parentId,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/files/{fileId}/declare',
            pathParams,
            queryParams,
            returnType: RecordEntry
        });
    }
}
