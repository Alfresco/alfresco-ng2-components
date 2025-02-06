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

import { TransferAssociationPaging } from '../model/transferAssociationPaging';
import { TransferEntry } from '../model/transferEntry';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * Transfers service.
 * @module TransfersApi
 */
export class TransfersApi extends BaseApi {
    /**
     * Get a transfer
     *
     * Mandatory fields and the transfer's aspects and properties are returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param transferId The identifier of a transfer.
     * @param opts Optional parameters
     * @returns Promise<TransferEntry>
     */
    getTransfer(transferId: string, opts?: RecordsIncludeQuery): Promise<TransferEntry> {
        throwIfNotDefined(transferId, 'transferId');

        const pathParams = {
            transferId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/transfers/{transferId}',
            pathParams,
            queryParams,
            returnType: TransferEntry
        });
    }

    /**
     * List transfer's children
     *
     * Minimal information for each child is returned by default.
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     * @param transferId The identifier of a transfer.
     * @param opts Optional parameters
     * @returns Promise<TransferAssociationPaging>
     */
    listTransfersChildren(
        transferId: string,
        opts?: RecordsSourceQuery & RecordsIncludeQuery & RecordsPagingQuery
    ): Promise<TransferAssociationPaging> {
        throwIfNotDefined(transferId, 'transferId');

        const pathParams = {
            transferId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            include: buildCollectionParam(opts?.include, 'csv'),
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/transfers/{transferId}/children',
            pathParams,
            queryParams,
            returnType: TransferAssociationPaging
        });
    }
}
