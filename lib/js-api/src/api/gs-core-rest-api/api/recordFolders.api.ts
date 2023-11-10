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
import { RMNodeBodyCreate } from '../model/rMNodeBodyCreate';
import { RecordEntry } from '../model/recordEntry';
import { RecordFolderAssociationPaging } from '../model/recordFolderAssociationPaging';
import { RecordFolderEntry } from '../model/recordFolderEntry';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * Record Folders service.
 * @module RecordFoldersApi
 */
export class RecordFoldersApi extends BaseApi {
    /**
    * Create a record
    *
    * Create a record as a primary child of **recordFolderId**.

This endpoint supports both JSON and multipart/form-data (file upload).

**Using multipart/form-data**

Use the **filedata** field to represent the content to upload, for example, the following curl command will
create a node with the contents of test.txt in the test user's home folder.

curl -utest:test -X POST host:port/alfresco/api/-default-/public/gs/versions/1/record-folders/{recordFolderId}/records -F filedata=@test.txt

This API method also supports record creation using application/json.

You must specify at least a **name** and **nodeType**.

You can create a non-electronic record like this:
JSON
{
  \"name\":\"My Non-electronic Record\",
  \"nodeType\":\"rma:nonElectronicDocument\",
  \"properties\":
    {
      \"cm:description\":\"My Non-electronic Record Description\",
      \"cm:title\":\"My Non-electronic Record Title\",
      \"rma:box\":\"My Non-electronic Record Box\",
      \"rma:file\":\"My Non-electronic Record File\",
      \"rma:numberOfCopies\":1,
      \"rma:physicalSize\":30,
      \"rma:shelf\":\"My Non-electronic Record Shelf\",
      \"rma:storageLocation\":\"My Non-electronic Record Location\"
    }
}

You can create an empty electronic record:
JSON
{
  \"name\":\"My Electronic Record\",
  \"nodeType\":\"cm:content\"
}

Any missing aspects are applied automatically. You can set aspects explicitly, if needed, using an **aspectNames** field.

**Note:** You can create more than one child by
specifying a list of nodes in the JSON body. For example, the following JSON
body creates a record category and a record folder inside the specified **categoryId**:
JSON
[
  {
    \"name\":\"Record 1\",
    \"nodeType\":\"cm:content\"
  },
  {
    \"name\":\"Record 2\",
    \"nodeType\":\"cm:content\"
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
    * @param recordFolderId The identifier of a record folder.
    * @param recordBodyCreate The record information to create. This field is ignored for multipart/form-data content uploads.
    * @param opts Optional parameters
    * @return Promise<RecordEntry>
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
        * Delete a record folder
        *
        * Deletes record folder **recordFolderId**. Deleted file plan components cannot be recovered, they are deleted permanently.

        *
        * @param recordFolderId The identifier of a record folder.
        * @return Promise<{}>
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
     * @return Promise<RecordFolderEntry>
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
     * Gets a list of records.
     *
     * Minimal information for each record is returned by default.
     *
     * The list of records includes primary children and secondary children, if there are any.
     *
     * You can use the **include** parameter (include=allowableOperations) to return additional information.
     *
     * @param recordFolderId The identifier of a record folder.
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list. Here are some examples:
     *   where=(nodeType='my:specialNodeType')
     *   where=(nodeType='my:specialNodeType INCLUDESUBTYPES')
     *   where=(isPrimary=true)
     * @return Promise<RecordFolderAssociationPaging>
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
        * Update a record folder
        *
        * Updates record folder **recordFolderId**. For example, you can rename a record folder:
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

    **Note:** if you want to add or remove aspects, then you must use **GET /record-folders/{recordFolderId}** first to get the complete set of *aspectNames*.

    **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.

        *
        * @param recordFolderId The identifier of a record folder.
        * @param recordFolderBodyUpdate The record folder information to update.
        * @param opts Optional parameters
        * @return Promise<RecordFolderEntry>
        */
    updateRecordFolder(recordFolderId: string, recordFolderBodyUpdate: FilePlanComponentBodyUpdate, opts?: RecordsIncludeQuery): Promise<RecordFolderEntry> {
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
