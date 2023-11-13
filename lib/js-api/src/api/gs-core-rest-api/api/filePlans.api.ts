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

import { FilePlanBodyUpdate } from '../model/filePlanBodyUpdate';
import { FilePlanEntry } from '../model/filePlanEntry';
import { RecordCategoryEntry } from '../model/recordCategoryEntry';
import { RecordCategoryPaging } from '../model/recordCategoryPaging';
import { RootCategoryBodyCreate } from '../model/rootCategoryBodyCreate';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * FilePlansApi service.
 *
 * @module FilePlansApi
 */
export class FilePlansApi extends BaseApi {
    /**
    * Create record categories for a file plan
    *
    * Creates a record category as a primary child of **filePlanId**.

You can set the **autoRename** boolean field to automatically resolve name clashes. If there is a name clash, then
the API method tries to create
a unique name using an integer suffix.

This API method also supports record category creation using application/json.

You must specify at least a **name**.

You can create a category like this:
JSON
{
  \"name\":\"My Record Category\"
}

You can set properties when creating a record category:
JSON
{
  \"name\":\"My Record Category\",
  \"properties\":
  {
    \"rma:vitalRecordIndicator\":\"true\",
    \"rma:reviewPeriod\":\"month|1\"
  }
}

Any missing aspects are applied automatically. You can set aspects explicitly, if needed, using an **aspectNames** field.

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

JSON
{
  \"list\": {
    \"pagination\": {
      \"count\": 2,
      \"hasMoreItems\": false,
      \"totalItems\": 2,
      \"skipCount\": 0,
      \"maxItems\": 100
    },
    \"entries\": [
      {
        \"entry\": {
          ...
        }
      },
      {
        \"entry\": {
          ...
        }
      }
    ]
  }
}

    *
    * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
    * @param nodeBodyCreate The node information to create.
    * @param opts Optional parameters
    * @param opts.autoRename If true, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
    * @return Promise<RecordCategoryEntry>
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
        * Gets information for file plan **filePlanId**

    Mandatory fields and the file plan's aspects and properties are returned by default.

    You can use the **include** parameter (include=allowableOperations) to return additional information.

        *
        * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
        * @param opts Optional parameters
        * @return Promise<FilePlanEntry>
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
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param opts Optional parameters
     * @return Promise<RecordCategoryPaging>
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
     * Updates file plan **filePlanId**.
     * You can only set or update description and title properties:
     * JSON
     * {
     * \"properties\":
     * {
     *    \"cm:description\": \"New Description\",
     *    \"cm:title\":\"New Title\"
     * }
     *}
     *
     * **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param filePlanBodyUpdate The file plan information to update.
     * @param opts Optional parameters
     * @return Promise<FilePlanEntry>
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
}
