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

import { RMNodeBodyCreate } from '../model/rMNodeBodyCreate';
import { UnfiledContainerAssociationPaging } from '../model/unfiledContainerAssociationPaging';
import { UnfiledContainerEntry } from '../model/unfiledContainerEntry';
import { UnfiledRecordContainerBodyUpdate } from '../model/unfiledRecordContainerBodyUpdate';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { RecordsIncludeQuery, RecordsPagingQuery, RecordsSourceQuery } from './types';

/**
 * Unfiled containers service.
 *
 * @module UnfiledContainersApi
 */
export class UnfiledContainersApi extends BaseApi {
    /**
    * Create a record or an unfiled record folder
    *
    * Creates a record or an unfiled record folder as a primary child of **unfiledContainerId**.

You can set the **autoRename** boolean field to automatically resolve name clashes. If there is a name clash, then
the API method tries to create a unique name using an integer suffix.

This endpoint supports both JSON and multipart/form-data (file upload).

**Using multipart/form-data**

Use the **filedata** field to represent the content to upload, for example, the following curl command will
create a node with the contents of test.txt in the test user's home folder.

curl -utest:test -X POST host:port/alfresco/api/-default-/public/gs/versions/1/unfiled-containers/{unfiledContainerId}/children -F filedata=@test.txt

This API method also supports record and unfiled record folder creation using application/json.

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

You can create an unfiled record folder like this:
JSON
{
  \"name\": \"My Unfiled Record Folder\",
  \"nodeType\": \"rma:unfiledRecordFolder\",
  \"properties\":
  {
    \"cm:title\": \"My Unfiled Record Folder Title\"
  }
}

Any missing aspects are applied automatically. You can set aspects explicitly, if needed, using an **aspectNames** field.

**Note:** You can create more than one child by
specifying a list of nodes in the JSON body. For example, the following JSON
body creates a record and an unfiled record folder inside the specified **unfiledContainerId**:
JSON
[
  {
    \"name\":\"My Record\",
    \"nodeType\":\"cm:content\"
  },
  {
    \"name\":\"My Unfiled Record Folder\",
    \"nodeType\":\"rma:unfiledRecordFolder\"
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
    * @param unfiledContainerId The identifier of an unfiled records container. You can use the **-unfiled-** alias.
    * @param nodeBodyCreate The node information to create.
    * @param opts Optional parameters
    * @param opts.autoRename If true, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
    * @return Promise<UnfiledContainerAssociationPaging>
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

    Mandatory fields and the unfiled records container's aspects and properties are returned by default.

    You can use the **include** parameter (include=allowableOperations) to return additional information.

        *
        * @param unfiledContainerId The identifier of an unfiled records container. You can use the **-unfiled-** alias.
        * @param opts Optional parameters
        * @return Promise<UnfiledContainerEntry>
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

    Minimal information for each child is returned by default.

    You can use the **include** parameter (include=allowableOperations) to return additional information.

        *
        * @param unfiledContainerId The identifier of an unfiled records container. You can use the **-unfiled-** alias.
        * @param opts Optional parameters
        * @param opts.where Optionally filter the list. Here are some examples:

    *   where=(isRecord=true)
    *   where=(isUnfiledRecordFolder=false)
    *   where=(nodeType='cm:content INCLUDESUBTYPES')
        * @param opts.includeSource Also include **source** (in addition to **entries**) with folder information on the parent node – the specified parent **unfiledContainerId**
        * @return Promise<UnfiledContainerAssociationPaging>
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
        * Updates unfiled record container **unfiledContainerId**. For example, you can rename an unfiled record container:
    JSON
    {
      \"name\":\"My new name\"
    }

    You can also set or update description and title properties:
    JSON
    {
      \"properties\":
        {
           \"cm:description\": \"New Description\",
           \"cm:title\":\"New Title\"
        }
    }

    **Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.

        *
        * @param unfiledContainerId The identifier of an unfiled records container. You can use the **-unfiled-** alias.
        * @param unfiledContainerBodyUpdate The unfiled record container information to update.
        * @param opts Optional parameters
        * @return Promise<UnfiledContainerEntry>
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
