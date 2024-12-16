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

import {
    FilePlanComponentBodyUpdate,
    RecordCategoryChildEntry,
    RecordCategoryChildPaging,
    RecordCategoryEntry,
    RMNodeBodyCreateWithRelativePath
} from '../model';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * RecordCategoriesApi service.
 */
export class RecordCategoriesApi extends BaseApi {
    /**
     * Create a record category or a record folder
     * @param recordCategoryId The identifier of a record category.
     * @param nodeBodyCreate The node information to create.
     * @param opts Optional parameters
     * @param opts.autoRename If `true`, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
     * @returns Promise<RecordCategoryChildEntry>
     */
    createRecordCategoryChild(
        recordCategoryId: string,
        nodeBodyCreate: RMNodeBodyCreateWithRelativePath,
        opts?: {
            autoRename?: boolean;
        } & RecordsIncludeQuery
    ): Promise<RecordCategoryChildEntry> {
        throwIfNotDefined(recordCategoryId, 'recordCategoryId');
        throwIfNotDefined(nodeBodyCreate, 'nodeBodyCreate');

        const pathParams = {
            recordCategoryId
        };

        const queryParams = {
            autoRename: opts?.autoRename,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/record-categories/{recordCategoryId}/children',
            pathParams,
            queryParams,
            bodyParam: nodeBodyCreate,
            returnType: RecordCategoryChildEntry
        });
    }

    /**
     * Delete a record category
     * @param recordCategoryId The identifier of a record category.
     * @returns Promise<{}>
     */
    deleteRecordCategory(recordCategoryId: string): Promise<void> {
        throwIfNotDefined(recordCategoryId, 'recordCategoryId');

        const pathParams = {
            recordCategoryId
        };

        return this.delete({
            path: '/record-categories/{recordCategoryId}',
            pathParams
        });
    }

    /**
     * Get a record category
     *
     * Mandatory fields and the record category's aspects and properties are returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param recordCategoryId The identifier of a record category.
     * @param opts Optional parameters
     * @param opts.relativePath Return information on children in the record category resolved by this path. The path is relative to **recordCategoryId**.
     * @returns Promise<RecordCategoryEntry>
     */
    getRecordCategory(
        recordCategoryId: string,
        opts?: {
            relativePath?: string;
        } & RecordsIncludeQuery
    ): Promise<RecordCategoryEntry> {
        throwIfNotDefined(recordCategoryId, 'recordCategoryId');

        const pathParams = {
            recordCategoryId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            relativePath: opts?.relativePath,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/record-categories/{recordCategoryId}',
            pathParams,
            queryParams,
            returnType: RecordCategoryEntry
        });
    }

    /**
     * List record category's children
     *
     * Minimal information for each child is returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     *
     * The list of child nodes includes primary children and secondary children, if there are any.
     * @param recordCategoryId The identifier of a record category.
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list. Here are some examples:
     *   where=(nodeType='rma:recordFolder')
     *   where=(nodeType='rma:recordCategory')
     *   where=(isRecordFolder=true AND isClosed=false)
     * @param opts.relativePath Return information on children in the record category resolved by this path. The path is relative to **recordCategoryId**.
     * @returns Promise<RecordCategoryChildPaging>
     */
    listRecordCategoryChildren(
        recordCategoryId: string,
        opts?: {
            where?: string;
            relativePath?: string;
        } & RecordsIncludeQuery &
            RecordsPagingQuery &
            RecordsSourceQuery
    ): Promise<RecordCategoryChildPaging> {
        throwIfNotDefined(recordCategoryId, 'recordCategoryId');

        const pathParams = {
            recordCategoryId
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
            path: '/record-categories/{recordCategoryId}/children',
            pathParams,
            queryParams,
            returnType: RecordCategoryChildPaging
        });
    }

    /**
     * Update a record category
     *
     * **Note:** If you want to add or remove aspects, then you must use **GET /record-categories/{recordCategoryId}** first to get the complete set of *aspectNames*.
     * **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.
     * @param recordCategoryId The identifier of a record category.
     * @param recordCategoryBodyUpdate The record category information to update.
     * @param opts Optional parameters
     * @returns Promise<RecordCategoryEntry>
     */
    updateRecordCategory(
        recordCategoryId: string,
        recordCategoryBodyUpdate: FilePlanComponentBodyUpdate,
        opts?: RecordsIncludeQuery
    ): Promise<RecordCategoryEntry> {
        throwIfNotDefined(recordCategoryId, 'recordCategoryId');
        throwIfNotDefined(recordCategoryBodyUpdate, 'recordCategoryBodyUpdate');

        const pathParams = {
            recordCategoryId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/record-categories/{recordCategoryId}',
            pathParams,
            queryParams,
            bodyParam: recordCategoryBodyUpdate,
            returnType: RecordCategoryEntry
        });
    }
}
