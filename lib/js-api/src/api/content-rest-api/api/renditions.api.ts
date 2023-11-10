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

import { DirectAccessUrlEntry } from '../model/directAccessUrlEntry';
import { RenditionBodyCreate } from '../model/renditionBodyCreate';
import { RenditionEntry } from '../model/renditionEntry';
import { RenditionPaging } from '../model/renditionPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * Renditions service.
 * @module RenditionsApi
 */
export class RenditionsApi extends BaseApi {
    /**
    * Create rendition
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

An asynchronous request to create a rendition for file **nodeId**.

The rendition is specified by name **id** in the request body:
JSON
{
  \"id\":\"doclib\"
}

 Multiple names may be specified as a comma separated list or using a list format:
JSON
[
  {
     \"id\": \"doclib\"
  },
  {
     \"id\": \"avatar\"
  }
]

    *
    * @param nodeId The identifier of a node.
    * @param renditionBodyCreate The rendition \"id\".
    * @return Promise<{}>
    */
    createRendition(nodeId: string, renditionBodyCreate: RenditionBodyCreate): Promise<any> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(renditionBodyCreate, 'renditionBodyCreate');

        const pathParams = {
            nodeId
        };

        return this.post({
            path: '/nodes/{nodeId}/renditions',
            pathParams,
            bodyParam: renditionBodyCreate
        });
    }

    /**
     * Get rendition information
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * @param nodeId The identifier of a node.
     * @param renditionId The name of a thumbnail rendition, for example *doclib*, or *pdf*.
     * @return Promise<RenditionEntry>
     */
    getRendition(nodeId: string, renditionId: string): Promise<RenditionEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(renditionId, 'renditionId');

        const pathParams = {
            nodeId,
            renditionId
        };

        return this.get({
            path: '/nodes/{nodeId}/renditions/{renditionId}',
            pathParams,
            returnType: RenditionEntry
        });
    }

    /**
    * Get rendition content
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
    *
    * @param nodeId The identifier of a node.
    * @param renditionId The name of a thumbnail rendition, for example *doclib*, or *pdf*.
    * @param opts Optional parameters
    * @param opts.attachment **true** enables a web browser to download the file as an attachment.
**false** means a web browser may preview the file in a new tab or window, but not
download the file.

You can only set this parameter to **false** if the content type of the file is in the supported list;
for example, certain image files and PDF files.

If the content type is not supported for preview, then a value of **false**  is ignored, and
the attachment will be returned in the response.
 (default to true)
    * @param opts.ifModifiedSince Only returns the content if it has been modified since the date provided.
Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.

    * @param opts.range The Range header indicates the part of a document that the server should return.
Single part request supported, for example: bytes=1-10.

    * @param opts.placeholder If **true** and there is no rendition for this **nodeId** and **renditionId**,
then the placeholder image for the mime type of this rendition is returned, rather
than a 404 response.
 (default to false)
    * @return Promise<Blob>
    */
    getRenditionContent(
        nodeId: string,
        renditionId: string,
        opts?: {
            attachment?: boolean;
            placeholder?: boolean;
            ifModifiedSince?: string;
            range?: string;
        }
    ): Promise<Blob> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(renditionId, 'renditionId');

        const pathParams = {
            nodeId,
            renditionId
        };

        const queryParams = {
            attachment: opts?.attachment,
            placeholder: opts?.placeholder
        };

        const headerParams = {
            'If-Modified-Since': opts?.ifModifiedSince,
            Range: opts?.range
        };

        const accepts = ['application/octet-stream'];

        return this.get({
            path: '/nodes/{nodeId}/renditions/{renditionId}/content',
            pathParams,
            queryParams,
            headerParams,
            accepts,
            returnType: 'blob'
        });
    }
    /**
    * List renditions
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Gets a list of the rendition information for each rendition of the the file **nodeId**, including the rendition id.

Each rendition returned has a **status**: CREATED means it is available to view or download, NOT_CREATED means the rendition can be requested.

You can use the **where** parameter to filter the returned renditions by **status**. For example, the following **where**
clause will return just the CREATED renditions:

(status='CREATED')

    *
    * @param nodeId The identifier of a node.
    * @param opts Optional parameters
    * @param opts.where A string to restrict the returned objects by using a predicate.
    * @return Promise<RenditionPaging>
    */
    listRenditions(nodeId: string, opts?: { where?: string }): Promise<RenditionPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        return this.get({
            path: '/nodes/{nodeId}/renditions',
            pathParams,
            queryParams: opts,
            returnType: RenditionPaging
        });
    }

    /**
     * Generate a direct access content url for a given rendition of a node
     *
     * **Note:** this endpoint is available in Alfresco 7.1 and newer versions.
     *
     * @param nodeId The identifier of a node.
     * @param renditionId The identifier of a version
     * @return Promise<DirectAccessUrlEntry>
     */
    requestDirectAccessUrl(nodeId: string, renditionId: string): Promise<DirectAccessUrlEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(renditionId, 'renditionId');

        const pathParams = {
            nodeId,
            renditionId
        };

        return this.post({
            path: '/nodes/{nodeId}/renditions/{renditionId}/request-direct-access-url',
            pathParams,
            returnType: DirectAccessUrlEntry
        });
    }
}
