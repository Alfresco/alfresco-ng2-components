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

import { TransferContainerAssociationPaging } from '../model/transferContainerAssociationPaging';
import { TransferContainerBodyUpdate } from '../model/transferContainerBodyUpdate';
import { TransferContainerEntry } from '../model/transferContainerEntry';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * TransferContainersApi service.
 */
export class TransferContainersApi extends BaseApi {
    /**
     * Get a transfer container
     *
     * Mandatory fields and the transfer container's aspects and properties are returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param transferContainerId The identifier of a transfer container. You can also use the -transfers- alias.
     * @param opts Optional parameters
     * @returns Promise<TransferContainerEntry>
     */
    getTransferContainer(transferContainerId: string, opts?: RecordsIncludeQuery): Promise<TransferContainerEntry> {
        throwIfNotDefined(transferContainerId, 'transferContainerId');

        const pathParams = {
            transferContainerId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/transfer-containers/{transferContainerId}',
            pathParams,
            queryParams,
            returnType: TransferContainerEntry
        });
    }

    /**
     * List transfer container's children
     *
     * Minimal information for each child is returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param transferContainerId The identifier of a transfer container. You can also use the -transfers- alias.
     * @param opts Optional parameters
     * @returns Promise<TransferContainerAssociationPaging>
     */
    listTransfers(
        transferContainerId: string,
        opts?: RecordsSourceQuery & RecordsIncludeQuery & RecordsPagingQuery
    ): Promise<TransferContainerAssociationPaging> {
        throwIfNotDefined(transferContainerId, 'transferContainerId');
        opts = opts || {};

        const pathParams = {
            transferContainerId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            include: buildCollectionParam(opts?.include, 'csv'),
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/transfer-containers/{transferContainerId}/transfers',
            pathParams,
            queryParams,
            returnType: TransferContainerAssociationPaging
        });
    }

    /**
     * Update transfer container
     * @param transferContainerId The identifier of a transfer container. You can also use the -transfers- alias.
     * @param nodeBodyUpdate The node information to update.
     * @param opts Optional parameters
     * @returns Promise<TransferContainerEntry>
     */
    updateTransferContainer(
        transferContainerId: string,
        nodeBodyUpdate: TransferContainerBodyUpdate,
        opts?: RecordsIncludeQuery
    ): Promise<TransferContainerEntry> {
        throwIfNotDefined(transferContainerId, 'transferContainerId');
        throwIfNotDefined(nodeBodyUpdate, 'nodeBodyUpdate');
        opts = opts || {};

        const pathParams = {
            transferContainerId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/transfer-containers/{transferContainerId}',
            pathParams,
            queryParams,
            bodyParam: nodeBodyUpdate,
            returnType: TransferContainerEntry
        });
    }
}
