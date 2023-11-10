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

import { FilePlanComponentBodyUpdate } from '../model/filePlanComponentBodyUpdate';
import { RecordEntry } from '../model/recordEntry';
import { RequestBodyFile } from '../model/requestBodyFile';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery } from './types';

/**
 * Records service.
 * @module RecordsApi
 */
export class RecordsApi extends BaseApi {
    /**
     * Complete a record
     *
     * @param recordId The identifier of a record.
     * @param opts Optional parameters
     * @return Promise<RecordEntry>
     */
    completeRecord(recordId: string, opts?: RecordsIncludeQuery): Promise<RecordEntry> {
        throwIfNotDefined(recordId, 'recordId');

        const pathParams = {
            recordId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/records/{recordId}/complete',
            pathParams,
            queryParams,
            returnType: RecordEntry
        });
    }

    /**
     * Delete a record. Deleted file plan components cannot be recovered, they are deleted permanently.
     *
     * @param recordId The identifier of a record.
     * @return Promise<{}>
     */
    deleteRecord(recordId: string): Promise<void> {
        throwIfNotDefined(recordId, 'recordId');

        const pathParams = {
            recordId
        };

        return this.delete({
            path: '/records/{recordId}',
            pathParams
        });
    }

    /**
     * File a record
     *
     * You need to specify the target record folder by providing its id **targetParentId**
     * If the record is already filed, a link to the target record folder is created.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     *
     * @param recordId The identifier of a record.
     * @param nodeBodyFile The target record folder id
     * @param opts Optional parameters
     * @return Promise<RecordEntry>
     */
    fileRecord(recordId: string, nodeBodyFile: RequestBodyFile, opts?: RecordsIncludeQuery): Promise<RecordEntry> {
        throwIfNotDefined(recordId, 'recordId');
        throwIfNotDefined(nodeBodyFile, 'nodeBodyFile');

        const pathParams = {
            recordId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/records/{recordId}/file',
            pathParams,
            queryParams,
            bodyParam: nodeBodyFile,
            returnType: RecordEntry
        });
    }

    /**
     * Get a record
     *
     * Mandatory fields and the record's aspects and properties are returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     *
     * @param recordId The identifier of a record.
     * @param opts Optional parameters
     * @return Promise<RecordEntry>
     */
    getRecord(recordId: string, opts?: RecordsIncludeQuery): Promise<RecordEntry> {
        throwIfNotDefined(recordId, 'recordId');

        const pathParams = {
            recordId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/records/{recordId}',
            pathParams,
            queryParams,
            returnType: RecordEntry
        });
    }

    /**
     * Get record content
     *
     * @param recordId The identifier of a record.
     * @param opts Optional parameters
     * @param opts.attachment **true** enables a web browser to download the file as an attachment.
     * **false** means a web browser may preview the file in a new tab or window, but not download the file.
     *
     * You can only set this parameter to **false** if the content type of the file is in the supported list;
     * for example, certain image files and PDF files.
     *
     * If the content type is not supported for preview, then a value of **false**  is ignored, and
     * the attachment will be returned in the response. (default to true)
     * @param opts.ifModifiedSince Only returns the content if it has been modified since the date provided.
     * Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.
     * @return Promise<{}>
     */
    getRecordContent(
        recordId: string,
        opts?: {
            attachment?: boolean;
            ifModifiedSince?: string;
        }
    ): Promise<any> {
        throwIfNotDefined(recordId, 'recordId');

        const pathParams = {
            recordId
        };

        const queryParams = {
            attachment: opts?.attachment
        };

        const headerParams = {
            'If-Modified-Since': opts?.ifModifiedSince
        };

        return this.get({
            path: '/records/{recordId}/content',
            pathParams,
            queryParams,
            headerParams
        });
    }

    /**
     * Update record
     *
     * Updates the record **recordId**. For example, you can rename a record:
     * JSON
     * {
     *   \"name\":\"My new name\"
     * }
     *
     * You can also set or update one or more properties:
     * JSON
     * {
     *   \"properties\":
     *     {
     *        \"cm:title\":\"New title\",
     *        \"cm:description\":\"New description\"
     *     }
     * }
     *
     * **Note:** if you want to add or remove aspects, then you must use **GET /records/{recordId}** first to get the complete set of *aspectNames*.
     * **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.
     *
     * @param recordId The identifier of a record.
     * @param recordBodyUpdate The record information to update.
     * @param opts Optional parameters
     * @return Promise<RecordEntry>
     */
    updateRecord(recordId: string, recordBodyUpdate: FilePlanComponentBodyUpdate, opts?: RecordsIncludeQuery): Promise<RecordEntry> {
        throwIfNotDefined(recordId, 'recordId');
        throwIfNotDefined(recordBodyUpdate, 'recordBodyUpdate');

        const pathParams = {
            recordId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/records/{recordId}',
            pathParams,
            queryParams,
            bodyParam: recordBodyUpdate,
            returnType: RecordEntry
        });
    }
}
