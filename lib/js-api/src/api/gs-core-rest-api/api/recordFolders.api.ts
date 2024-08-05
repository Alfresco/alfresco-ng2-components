/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FilePlanComponentBodyUpdate, RecordEntry, RecordFolderAssociationPaging, RecordFolderEntry, RMNodeBodyCreate } from '../model';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * Record Folders service.
 */
export class RecordFoldersApi extends BaseApi {
    /**
     * Create a record
     *
     * Create a record as a primary child of **recordFolderId**.
     * This endpoint supports both JSON and multipart/form-data (file upload).
     *
     * @param recordFolderId The identifier of a record folder.
     * @param recordBodyCreate The record information to create. This field is ignored for multipart/form-data content uploads.
     * @param opts Optional parameters
     * @returns Promise<RecordEntry>
     */
    createRecordFolderChild(recordFolderId: string, recordBodyCreate: RMNodeBodyCreate, opts?: RecordsIncludeQuery): Promise<RecordEntry> {
        throwIfNotDefined(recordFolderId, 'recordFolderId');
        throwIfNotDefined(recordBodyCreate, 'recordBodyCreate');

        const pathParams = {
            recordFolderId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/record-folders/{recordFolderId}/records',
            pathParams,
            queryParams,
            bodyParam: recordBodyCreate,
            returnType: RecordEntry
        });
    }

    /**
     * Deletes record folder **recordFolderId**.
     * Deleted file plan components cannot be recovered, they are deleted permanently.
     *
     * @param recordFolderId The identifier of a record folder.
     * @returns Promise<{ /* empty */ }>
     */
    deleteRecordFolder(recordFolderId: string): Promise<void> {
        throwIfNotDefined(recordFolderId, 'recordFolderId');

        const pathParams = {
            recordFolderId
        };

        return this.delete({
            path: '/record-folders/{recordFolderId}',
            pathParams
        });
    }

    /**
     * Get a record folder
     *
     * Mandatory fields and the record folder's aspects and properties are returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     *
     * @param recordFolderId The identifier of a record folder.
     * @param opts Optional parameters
     * @returns Promise<RecordFolderEntry>
     */
    getRecordFolder(recordFolderId: string, opts?: RecordsIncludeQuery): Promise<RecordFolderEntry> {
        throwIfNotDefined(recordFolderId, 'recordFolderId');

        const pathParams = {
            recordFolderId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/record-folders/{recordFolderId}',
            pathParams,
            queryParams,
            returnType: RecordFolderEntry
        });
    }

    /**
     * List records
     *
     * Minimal information for each record is returned by default.
     * The list of records includes primary children and secondary children, if there are any.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     *
     * @param recordFolderId The identifier of a record folder.
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list. Here are some examples:
     *   - where=(nodeType='my:specialNodeType')
     *   - where=(nodeType='my:specialNodeType INCLUDESUBTYPES')
     *   - where=(isPrimary=true)
     * @returns Promise<RecordFolderAssociationPaging>
     */
    listRecordFolderChildren(
        recordFolderId: string,
        opts?: {
            where?: string;
        } & RecordsPagingQuery &
            RecordsIncludeQuery &
            RecordsSourceQuery
    ): Promise<RecordFolderAssociationPaging> {
        throwIfNotDefined(recordFolderId, 'recordFolderId');

        const pathParams = {
            recordFolderId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/record-folders/{recordFolderId}/records',
            pathParams,
            queryParams,
            returnType: RecordFolderAssociationPaging
        });
    }

    /**
     * Updates record folder **recordFolderId**. For example, you can rename a record folder:
     *
     * **Note:** if you want to add or remove aspects, then you must use **GET /record-folders/{recordFolderId}** first to get the complete set of *aspectNames*.
     * **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.
     *
     * @param recordFolderId The identifier of a record folder.
     * @param recordFolderBodyUpdate The record folder information to update.
     * @param opts Optional parameters
     * @returns Promise<RecordFolderEntry>
     */
    updateRecordFolder(
        recordFolderId: string,
        recordFolderBodyUpdate: FilePlanComponentBodyUpdate,
        opts?: RecordsIncludeQuery
    ): Promise<RecordFolderEntry> {
        throwIfNotDefined(recordFolderId, 'recordFolderId');
        throwIfNotDefined(recordFolderBodyUpdate, 'recordFolderBodyUpdate');

        const pathParams = {
            recordFolderId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/record-folders/{recordFolderId}',
            pathParams,
            queryParams,
            bodyParam: recordFolderBodyUpdate,
            returnType: RecordFolderEntry
        });
    }
}
