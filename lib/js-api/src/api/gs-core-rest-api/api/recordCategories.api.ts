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
import { RMNodeBodyCreateWithRelativePath } from '../model/rMNodeBodyCreateWithRelativePath';
import { RecordCategoryChildEntry } from '../model/recordCategoryChildEntry';
import { RecordCategoryChildPaging } from '../model/recordCategoryChildPaging';
import { RecordCategoryEntry } from '../model/recordCategoryEntry';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * RecordCategoriesApi service.
 * @module RecordCategoriesApi
 */
export class RecordCategoriesApi extends BaseApi {
    /**
    * Create a record category or a record folder
    *
    * Create a record category or a record folder as a primary child of **recordCategoryId**.

You can set the **autoRename** boolean field to automatically resolve name clashes. If there is a name clash, then
the API method tries to create
a unique name using an integer suffix.

This API method also supports record category or record folder creation using application/json.

You must specify at least a **name** and **nodeType**.

You can create a category like this:
JSON
{
  \"name\":\"My Record Category\",
  \"nodeType\":\"rma:recordCategory\"
}

You can create a record folder like this:
JSON
{
  \"name\":\"My Record Folder\",
  \"nodeType\":\"rma:recordFolder\"
}

You can create a record folder inside a container hierarchy (applies to record categories as well):
JSON
{
  \"name\":\"My Fileplan Component\",
  \"nodeType\":\"rma:recordFolder\",
  \"relativePath\":\"X/Y/Z\"
}

The **relativePath** specifies the container structure to create relative to the node (record category or record folder). Containers in the
**relativePath** that do not exist are created before the node is created. The container type is decided considering
the type of the parent container and the type of the node to be created.

You can set properties when creating a record category (applies to record folders as well):
JSON
{
  \"name\":\"My Record Category\",
  \"nodeType\":\"rma:recordCategory\",
  \"properties\":
  {
    \"rma:vitalRecordIndicator\":\"true\",
    \"rma:reviewPeriod\":\"month|1\"
  }
}

Any missing aspects are applied automatically. You can set aspects explicitly, if needed, using an **aspectNames** field.

**Note:** You can create more than one child by
specifying a list of nodes in the JSON body. For example, the following JSON
body creates a record category and a record folder inside the specified **categoryId**:
JSON
[
  {
    \"name\":\"My Record Category\",
    \"nodeType\":\"rma:recordCategory\"
  },
  {
    \"name\":\"My Record Folder\",
    \"nodeType\":\"rma:recordFolder\"
  }
]

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
    * @param recordCategoryId The identifier of a record category.
    * @param nodeBodyCreate The node information to create.

    * @param opts Optional parameters
    * @param opts.autoRename If true, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
    * @return Promise<RecordCategoryChildEntry>
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
     *
     * @param recordCategoryId The identifier of a record category.
     * @return Promise<{}>
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
     *
     * @param recordCategoryId The identifier of a record category.
     * @param opts Optional parameters
     * @param opts.relativePath Return information on children in the record category resolved by this path. The path is relative to **recordCategoryId**.
     * @return Promise<RecordCategoryEntry>
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
     *
     * @param recordCategoryId The identifier of a record category.
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list. Here are some examples:
     *   where=(nodeType='rma:recordFolder')
     *   where=(nodeType='rma:recordCategory')
     *   where=(isRecordFolder=true AND isClosed=false)
     * @param opts.relativePath Return information on children in the record category resolved by this path. The path is relative to **recordCategoryId**.
     * @return Promise<RecordCategoryChildPaging>
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
        * Updates record category **recordCategoryId**. For example, you can rename a record category:
    JSON
    {
      \"name\":\"My new name\"
    }

    You can also set or update one or more properties:
    JSON
    {
      \"properties\":
        {
           \"rma:vitalRecordIndicator\": true,
           \"rma:reviewPeriod\":\"month|6\"
        }
    }

    **Note:** If you want to add or remove aspects, then you must use **GET /record-categories/{recordCategoryId}** first to get the complete set of *aspectNames*.

    **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.

        *
        * @param recordCategoryId The identifier of a record category.
        * @param recordCategoryBodyUpdate The record category information to update.
        * @param opts Optional parameters
        * @return Promise<RecordCategoryEntry>
        */
    updateRecordCategory(recordCategoryId: string, recordCategoryBodyUpdate: FilePlanComponentBodyUpdate, opts?: RecordsIncludeQuery): Promise<RecordCategoryEntry> {
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
