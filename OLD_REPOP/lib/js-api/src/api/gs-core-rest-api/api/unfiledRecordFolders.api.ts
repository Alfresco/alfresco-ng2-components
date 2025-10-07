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

import { RMNodeBodyCreateWithRelativePath } from '../model/rMNodeBodyCreateWithRelativePath';
import { UnfiledRecordFolderAssociationPaging } from '../model/unfiledRecordFolderAssociationPaging';
import { UnfiledRecordFolderBodyUpdate } from '../model/unfiledRecordFolderBodyUpdate';
import { UnfiledRecordFolderEntry } from '../model/unfiledRecordFolderEntry';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * UnfiledRecordFoldersApi service.
 * @module UnfiledRecordFoldersApi
 */
export class UnfiledRecordFoldersApi extends BaseApi {
    /**
     * Create a record or an unfiled record folder
     * @param unfiledRecordFolderId The identifier of an unfiled record folder.
     * @param nodeBodyCreate The node information to create.
     * @param opts Optional parameters
     * @param opts.autoRename If true, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
     * @returns Promise<UnfiledRecordFolderAssociationPaging>
     */
    createUnfiledRecordFolderChildren(
        unfiledRecordFolderId: string,
        nodeBodyCreate: RMNodeBodyCreateWithRelativePath,
        opts?: {
            autoRename?: boolean;
        } & RecordsIncludeQuery
    ): Promise<UnfiledRecordFolderAssociationPaging> {
        throwIfNotDefined(unfiledRecordFolderId, 'unfiledRecordFolderId');
        throwIfNotDefined(nodeBodyCreate, 'nodeBodyCreate');

        const pathParams = {
            unfiledRecordFolderId
        };

        const queryParams = {
            autoRename: opts?.autoRename,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/unfiled-record-folders/{unfiledRecordFolderId}/children',
            pathParams,
            queryParams,
            bodyParam: nodeBodyCreate,
            contentTypes: ['application/json', 'multipart/form-data'],
            returnType: UnfiledRecordFolderAssociationPaging
        });
    }

    /**
     * Delete an unfiled record folder. Deleted file plan components cannot be recovered, they are deleted permanently.
     * @param unfiledRecordFolderId The identifier of an unfiled record folder.
     * @returns Promise<{}>
     */
    deleteUnfiledRecordFolder(unfiledRecordFolderId: string): Promise<void> {
        throwIfNotDefined(unfiledRecordFolderId, 'unfiledRecordFolderId');

        const pathParams = {
            unfiledRecordFolderId
        };

        return this.delete({
            path: '/unfiled-record-folders/{unfiledRecordFolderId}',
            pathParams
        });
    }

    /**
     * Get the unfiled record folder
     *
     * Mandatory fields and the unfiled record folder's aspects and properties are returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param unfiledRecordFolderId The identifier of an unfiled record folder.
     * @param opts Optional parameters
     * @param opts.relativePath Return information on children in the unfiled records container resolved by this path. The path is relative to **unfiledRecordFolderId**.
     * @returns Promise<UnfiledRecordFolderEntry>
     */
    getUnfiledRecordFolder(
        unfiledRecordFolderId: string,
        opts?: {
            relativePath?: string;
        } & RecordsIncludeQuery
    ): Promise<UnfiledRecordFolderEntry> {
        throwIfNotDefined(unfiledRecordFolderId, 'unfiledRecordFolderId');

        const pathParams = {
            unfiledRecordFolderId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            relativePath: opts?.relativePath,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/unfiled-record-folders/{unfiledRecordFolderId}',
            pathParams,
            queryParams,
            returnType: UnfiledRecordFolderEntry
        });
    }

    /**
     * List unfiled record folder's children
     *
     * Minimal information for each child is returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param unfiledRecordFolderId The identifier of an unfiled record folder.
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list. Here are some examples:
     *  - where=(isRecord=true)
     *  - where=(isUnfiledRecordFolder=false)
     *  - where=(nodeType='cm:content INCLUDESUBTYPES')
     * @param opts.relativePath Return information on children in the unfiled records container resolved by this path. The path is relative to **unfiledRecordFolderId**.
     * @returns Promise<UnfiledRecordFolderAssociationPaging>
     */
    listUnfiledRecordFolderChildren(
        unfiledRecordFolderId: string,
        opts?: {
            where?: string;
            relativePath?: string[];
        } & RecordsIncludeQuery &
            RecordsPagingQuery &
            RecordsSourceQuery
    ): Promise<UnfiledRecordFolderAssociationPaging> {
        throwIfNotDefined(unfiledRecordFolderId, 'unfiledRecordFolderId');
        opts = opts || {};

        const pathParams = {
            unfiledRecordFolderId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            relativePath: opts?.relativePath,
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/unfiled-record-folders/{unfiledRecordFolderId}/children',
            pathParams,
            queryParams,
            returnType: UnfiledRecordFolderAssociationPaging
        });
    }

    /**
     * Updates unfiled record folder **unfiledRecordFolderId**.
     * For example, you can rename a record folder:
     * @param unfiledRecordFolderId The identifier of an unfiled record folder.
     * @param unfiledRecordFolderBodyUpdate The record folder information to update.
     * @param opts Optional parameters
     * @returns Promise<UnfiledRecordFolderEntry>
     */
    updateUnfiledRecordFolder(
        unfiledRecordFolderId: string,
        unfiledRecordFolderBodyUpdate: UnfiledRecordFolderBodyUpdate,
        opts?: RecordsIncludeQuery & RecordsSourceQuery
    ): Promise<UnfiledRecordFolderEntry> {
        throwIfNotDefined(unfiledRecordFolderId, 'unfiledRecordFolderId');
        throwIfNotDefined(unfiledRecordFolderBodyUpdate, 'unfiledRecordFolderBodyUpdate');

        const pathParams = {
            unfiledRecordFolderId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/unfiled-record-folders/{unfiledRecordFolderId}',
            pathParams,
            queryParams,
            bodyParam: unfiledRecordFolderBodyUpdate,
            returnType: UnfiledRecordFolderEntry
        });
    }
}
