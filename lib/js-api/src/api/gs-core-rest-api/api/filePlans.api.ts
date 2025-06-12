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

import { FilePlanBodyUpdate } from '../model/filePlanBodyUpdate';
import { FilePlanEntry } from '../model/filePlanEntry';
import { RecordCategoryEntry } from '../model/recordCategoryEntry';
import { RecordCategoryPaging } from '../model/recordCategoryPaging';
import { RootCategoryBodyCreate } from '../model/rootCategoryBodyCreate';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';
import { FilePlanRolePaging, FilePlanRoleParameters } from '../model';

/**
 * FilePlansApi service.
 */
export class FilePlansApi extends BaseApi {
    /**
     * Create record categories for a file plan
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param nodeBodyCreate The node information to create.
     * @param opts Optional parameters
     * @param opts.autoRename If `true`, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
     * @returns Promise<RecordCategoryEntry>
     */
    createFilePlanCategories(
        filePlanId: string,
        nodeBodyCreate: RootCategoryBodyCreate,
        opts?: {
            autoRename?: boolean;
        } & RecordsIncludeQuery
    ): Promise<RecordCategoryEntry> {
        throwIfNotDefined(filePlanId, 'filePlanId');
        throwIfNotDefined(nodeBodyCreate, 'nodeBodyCreate');

        const pathParams = {
            filePlanId
        };

        const queryParams = {
            autoRename: opts?.autoRename,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/file-plans/{filePlanId}/categories',
            pathParams,
            queryParams,
            contentTypes: ['application/json', 'multipart/form-data'],
            bodyParam: nodeBodyCreate,
            returnType: RecordCategoryEntry
        });
    }

    /**
     * Get a file plan
     *
     * Mandatory fields and the file plan's aspects and properties are returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param opts Optional parameters
     * @returns Promise<FilePlanEntry>
     */
    getFilePlan(filePlanId: string, opts?: RecordsIncludeQuery): Promise<FilePlanEntry> {
        throwIfNotDefined(filePlanId, 'filePlanId');

        const pathParams = {
            filePlanId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/file-plans/{filePlanId}',
            pathParams,
            queryParams,
            returnType: FilePlanEntry
        });
    }

    /**
     * List file plans's children
     *
     * Minimal information for each child is returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param opts Optional parameters
     * @returns Promise<RecordCategoryPaging>
     */
    getFilePlanCategories(filePlanId: string, opts?: RecordsIncludeQuery & RecordsPagingQuery & RecordsSourceQuery): Promise<RecordCategoryPaging> {
        throwIfNotDefined(filePlanId, 'filePlanId');

        const pathParams = {
            filePlanId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            include: buildCollectionParam(opts?.include, 'csv'),
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/file-plans/{filePlanId}/categories',
            pathParams,
            queryParams,
            returnType: RecordCategoryPaging
        });
    }

    /**
     * Update a file plan
     *
     * **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param filePlanBodyUpdate The file plan information to update.
     * @param opts Optional parameters
     * @returns Promise<FilePlanEntry>
     */
    updateFilePlan(filePlanId: string, filePlanBodyUpdate: FilePlanBodyUpdate, opts?: RecordsIncludeQuery): Promise<FilePlanEntry> {
        throwIfNotDefined(filePlanId, 'filePlanId');
        throwIfNotDefined(filePlanBodyUpdate, 'filePlanBodyUpdate');

        const pathParams = {
            filePlanId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/file-plans/{filePlanId}',
            pathParams,
            queryParams,
            bodyParam: filePlanBodyUpdate,
            returnType: FilePlanEntry
        });
    }

    /**
     * Gets a list of roles for the specified file plan.
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param parameters Optional parameters
     * @returns Promise<FilePlanEntry>
     */
    getFilePlanRoles(filePlanId: string, parameters?: FilePlanRoleParameters): Promise<FilePlanRolePaging> {
        throwIfNotDefined(filePlanId, 'filePlanId');
        const whereConditions: string[] = [];
        if (parameters?.where) {
            if (parameters.where.personId) {
                whereConditions.push(`personId='${parameters.where.personId}'`);
            }
            if (parameters.where.capabilityNames) {
                whereConditions.push(`capabilityName in (${parameters.where.capabilityNames.map((value) => "'" + value + "'").join(', ')})`);
            }
        }
        return this.get({
            path: '/file-plans/{filePlanId}/roles',
            pathParams: {
                filePlanId
            },
            queryParams: {
                where: whereConditions.length ? `(${whereConditions.join(' and ')})` : undefined
            }
        });
    }
}
