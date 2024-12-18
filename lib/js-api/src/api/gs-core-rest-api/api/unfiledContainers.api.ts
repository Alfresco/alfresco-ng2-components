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

import { RMNodeBodyCreate, UnfiledContainerAssociationPaging, UnfiledContainerEntry, UnfiledRecordContainerBodyUpdate } from '../model';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * Unfiled containers service.
 * @module UnfiledContainersApi
 */
export class UnfiledContainersApi extends BaseApi {
    /**
     * Creates a record or an unfiled record folder as a primary child of **unfiledContainerId**.
     * @param unfiledContainerId The identifier of an unfiled records container. You can use the **-unfiled-** alias.
     * @param nodeBodyCreate The node information to create.
     * @param opts Optional parameters
     * @param opts.autoRename If true, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
     * @returns Promise<UnfiledContainerAssociationPaging>
     */
    createUnfiledContainerChildren(
        unfiledContainerId: string,
        nodeBodyCreate: RMNodeBodyCreate,
        opts?: {
            autoRename?: boolean;
        } & RecordsIncludeQuery
    ): Promise<UnfiledContainerAssociationPaging> {
        throwIfNotDefined(unfiledContainerId, 'unfiledContainerId');
        throwIfNotDefined(nodeBodyCreate, 'nodeBodyCreate');

        const pathParams = {
            unfiledContainerId
        };

        const queryParams = {
            autoRename: opts?.autoRename,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        const contentTypes = ['application/json', 'multipart/form-data'];

        return this.post({
            path: '/unfiled-containers/{unfiledContainerId}/children',
            pathParams,
            queryParams,
            contentTypes,
            bodyParam: nodeBodyCreate,
            returnType: UnfiledContainerAssociationPaging
        });
    }

    /**
     * Get the unfiled records container
     *
     * Gets information for unfiled records container **unfiledContainerId**
     * Mandatory fields and the unfiled records container's aspects and properties are returned by default.
     *
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param unfiledContainerId The identifier of an unfiled records container. You can use the **-unfiled-** alias.
     * @param opts Optional parameters
     * @returns Promise<UnfiledContainerEntry>
     */
    getUnfiledContainer(unfiledContainerId: string, opts?: RecordsIncludeQuery): Promise<UnfiledContainerEntry> {
        throwIfNotDefined(unfiledContainerId, 'unfiledContainerId');

        const pathParams = {
            unfiledContainerId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/unfiled-containers/{unfiledContainerId}',
            pathParams,
            queryParams,
            returnType: UnfiledContainerEntry
        });
    }

    /**
     * List unfiled record container's children
     *
     * Returns a list of records or unfiled record folders.
     *
     * Minimal information for each child is returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param unfiledContainerId The identifier of an unfiled records container. You can use the **-unfiled-** alias.
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list. Here are some examples:
     *   - where=(isRecord=true)
     *   - where=(isUnfiledRecordFolder=false)
     *   - where=(nodeType='cm:content INCLUDESUBTYPES')
     * @param opts.includeSource Also include **source** (in addition to **entries**) with folder information on the parent node – the specified parent **unfiledContainerId**
     * @returns Promise<UnfiledContainerAssociationPaging>
     */
    listUnfiledContainerChildren(
        unfiledContainerId: string,
        opts?: {
            where?: string;
        } & RecordsSourceQuery &
            RecordsIncludeQuery &
            RecordsPagingQuery
    ): Promise<UnfiledContainerAssociationPaging> {
        throwIfNotDefined(unfiledContainerId, 'unfiledContainerId');

        const pathParams = {
            unfiledContainerId
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
            path: '/unfiled-containers/{unfiledContainerId}/children',
            pathParams,
            queryParams,
            returnType: UnfiledContainerAssociationPaging
        });
    }

    /**
     * Update an unfiled record container
     *
     * **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.
     * @param unfiledContainerId The identifier of an unfiled records container. You can use the **-unfiled-** alias.
     * @param unfiledContainerBodyUpdate The unfiled record container information to update.
     * @param opts Optional parameters
     * @returns Promise<UnfiledContainerEntry>
     */
    updateUnfiledContainer(
        unfiledContainerId: string,
        unfiledContainerBodyUpdate: UnfiledRecordContainerBodyUpdate,
        opts?: RecordsIncludeQuery
    ): Promise<UnfiledContainerEntry> {
        throwIfNotDefined(unfiledContainerId, 'unfiledContainerId');
        throwIfNotDefined(unfiledContainerBodyUpdate, 'unfiledContainerBodyUpdate');

        const pathParams = {
            unfiledContainerId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/unfiled-containers/{unfiledContainerId}',
            pathParams,
            queryParams,
            bodyParam: unfiledContainerBodyUpdate,
            returnType: UnfiledContainerEntry
        });
    }
}
