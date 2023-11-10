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

import { RenditionEntry } from '../model/renditionEntry';
import { RenditionPaging } from '../model/renditionPaging';
import { SharedLinkBodyCreate } from '../model/sharedLinkBodyCreate';
import { SharedLinkBodyEmail } from '../model/sharedLinkBodyEmail';
import { SharedLinkEntry } from '../model/sharedLinkEntry';
import { SharedLinkPaging } from '../model/sharedLinkPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

/**
 * Sharedlinks service.
 * @module SharedlinksApi
 */
export class SharedlinksApi extends BaseApi {
    /**
    * Create a shared link to a file
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Create a shared link to the file **nodeId** in the request body. Also, an optional expiry date could be set,
so the shared link would become invalid when the expiry date is reached. For example:

JSON
  {
    \"nodeId\": \"1ff9da1a-ee2f-4b9c-8c34-3333333333\",
    \"expiresAt\": \"2017-03-23T23:00:00.000+0000\"
  }

**Note:** You can create shared links to more than one file
specifying a list of **nodeId**s in the JSON body like this:

JSON
[
  {
    \"nodeId\": \"1ff9da1a-ee2f-4b9c-8c34-4444444444\"
  },
  {
    \"nodeId\": \"1ff9da1a-ee2f-4b9c-8c34-5555555555\"
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
    * @param sharedLinkBodyCreate The nodeId to create a shared link for.
    * @param opts Optional parameters
    * @return Promise<SharedLinkEntry>
    */
    createSharedLink(sharedLinkBodyCreate: SharedLinkBodyCreate, opts?: ContentIncludeQuery & ContentFieldsQuery): Promise<SharedLinkEntry> {
        throwIfNotDefined(sharedLinkBodyCreate, 'sharedLinkBodyCreate');

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/shared-links',
            queryParams,
            bodyParam: sharedLinkBodyCreate,
            returnType: SharedLinkEntry
        });
    }

    /**
     * Deletes a shared link
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * @param sharedId The identifier of a shared link to a file.
     * @return Promise<{}>
     */
    deleteSharedLink(sharedId: string): Promise<void> {
        throwIfNotDefined(sharedId, 'sharedId');

        const pathParams = {
            sharedId
        };

        return this.delete({
            path: '/shared-links/{sharedId}',
            pathParams
        });
    }

    /**
    * Email shared link
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Sends email with app-specific url including identifier **sharedId**.

The client and recipientEmails properties are mandatory in the request body. For example, to email a shared link with minimum info:
JSON
{
    \"client\": \"myClient\",
    \"recipientEmails\": [\"john.doe@acme.com\", \"joe.bloggs@acme.com\"]
}

A plain text message property can be optionally provided in the request body to customise the sent email.
Also, a locale property can be optionally provided in the request body to send the emails in a particular language (if the locale is supported by Alfresco).
For example, to email a shared link with a messages and a locale:
JSON
{
    \"client\": \"myClient\",
    \"recipientEmails\": [\"john.doe@acme.com\", \"joe.bloggs@acme.com\"],
    \"message\": \"myMessage\",
    \"locale\":\"en-GB\"
}

**Note:** The client must be registered before you can send a shared link email. See [server documentation]. However, out-of-the-box
 share is registered as a default client, so you could pass **share** as the client name:
JSON
{
    \"client\": \"share\",
    \"recipientEmails\": [\"john.doe@acme.com\"]
}

    *
    * @param sharedId The identifier of a shared link to a file.
    * @param sharedLinkBodyEmail The shared link email to send.
    * @return Promise<{}>
    */
    emailSharedLink(sharedId: string, sharedLinkBodyEmail: SharedLinkBodyEmail): Promise<any> {
        throwIfNotDefined(sharedId, 'sharedId');
        throwIfNotDefined(sharedLinkBodyEmail, 'sharedLinkBodyEmail');

        const pathParams = {
            sharedId
        };

        return this.post({
            path: '/shared-links/{sharedId}/email',
            pathParams,
            bodyParam: sharedLinkBodyEmail
        });
    }

    /**
     * Get a shared link
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * **Note:** No authentication is required to call this endpoint.
     *
     * @param sharedId The identifier of a shared link to a file.
     * @param opts Optional parameters
     * @return Promise<SharedLinkEntry>
     */
    getSharedLink(sharedId: string, opts?: ContentFieldsQuery): Promise<SharedLinkEntry> {
        throwIfNotDefined(sharedId, 'sharedId');

        const pathParams = {
            sharedId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/shared-links/{sharedId}',
            pathParams,
            queryParams,
            returnType: SharedLinkEntry
        });
    }

    /**
    * Get shared link content
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
    * **Note:** No authentication is required to call this endpoint.
    *
    * @param sharedId The identifier of a shared link to a file.
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

    * @return Promise<Blob>
    */
    getSharedLinkContent(
        sharedId: string,
        opts?: {
            attachment?: boolean;
            ifModifiedSince?: string;
            range?: string;
        }
    ): Promise<Blob> {
        throwIfNotDefined(sharedId, 'sharedId');

        const pathParams = {
            sharedId
        };

        const queryParams = {
            attachment: opts?.attachment
        };

        const headerParams = {
            'If-Modified-Since': opts?.ifModifiedSince,
            Range: opts?.range
        };

        return this.get({
            path: '/shared-links/{sharedId}/content',
            pathParams,
            queryParams,
            headerParams,
            accepts: ['application/octet-stream'],
            returnType: 'blob'
        });
    }

    /**
     * Get shared link rendition information
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * This API method returns rendition information where the rendition status is CREATED,
     * which means the rendition is available to view/download.
     *
     * **Note:** No authentication is required to call this endpoint.
     *
     * @param sharedId The identifier of a shared link to a file.
     * @param renditionId The name of a thumbnail rendition, for example *doclib*, or *pdf*.
     * @return Promise<RenditionEntry>
     */
    getSharedLinkRendition(sharedId: string, renditionId: string): Promise<RenditionEntry> {
        throwIfNotDefined(sharedId, 'sharedId');
        throwIfNotDefined(renditionId, 'renditionId');

        const pathParams = {
            sharedId,
            renditionId
        };

        return this.get({
            path: '/shared-links/{sharedId}/renditions/{renditionId}',
            pathParams,
            returnType: RenditionEntry
        });
    }
    /**
    * Get shared link rendition content
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Gets the rendition content for file with shared link identifier **sharedId**.

**Note:** No authentication is required to call this endpoint.

    *
    * @param sharedId The identifier of a shared link to a file.
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

    * @return Promise<Blob>
    */
    getSharedLinkRenditionContent(
        sharedId: string,
        renditionId: string,
        opts?: {
            attachment?: boolean;
            ifModifiedSince?: string;
            range?: string;
        }
    ): Promise<Blob> {
        throwIfNotDefined(sharedId, 'sharedId');
        throwIfNotDefined(renditionId, 'renditionId');

        const pathParams = {
            sharedId,
            renditionId
        };

        const queryParams = {
            attachment: opts?.attachment
        };

        const headerParams = {
            'If-Modified-Since': opts?.ifModifiedSince,
            Range: opts?.range
        };

        return this.get({
            path: '/shared-links/{sharedId}/renditions/{renditionId}/content',
            pathParams,
            queryParams,
            headerParams,
            accepts: ['application/octet-stream'],
            returnType: 'blob'
        });
    }
    /**
    * List renditions for a shared link
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Gets a list of the rendition information for the file with shared link identifier **sharedId**.

This API method returns rendition information, including the rendition id, for each rendition
where the rendition status is CREATED, which means the rendition is available to view/download.

**Note:** No authentication is required to call this endpoint.

    *
    * @param sharedId The identifier of a shared link to a file.
    * @return Promise<RenditionPaging>
    */
    listSharedLinkRenditions(sharedId: string): Promise<RenditionPaging> {
        throwIfNotDefined(sharedId, 'sharedId');

        const pathParams = {
            sharedId
        };

        return this.get({
            path: '/shared-links/{sharedId}/renditions',
            pathParams,
            returnType: RenditionPaging
        });
    }

    /**
    * List shared links
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Get a list of links that the current user has read permission on source node.

The list is ordered in descending modified order.

**Note:** The list of links is eventually consistent so newly created shared links may not appear immediately.

    *
    * @param opts Optional parameters
    * @param opts.where Optionally filter the list by \"sharedByUser\" userid of person who shared the link (can also use -me-)
*   where=(sharedByUser='jbloggs')
*   where=(sharedByUser='-me-')
    * @return Promise<SharedLinkPaging>
    */
    listSharedLinks(
        opts?: {
            where?: string;
        } & ContentPagingQuery &
            ContentIncludeQuery &
            ContentFieldsQuery
    ): Promise<SharedLinkPaging> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/shared-links',
            queryParams,
            returnType: SharedLinkPaging
        });
    }
}
