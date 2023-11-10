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
import { RevertBody } from '../model/revertBody';
import { VersionEntry } from '../model/versionEntry';
import { VersionPaging } from '../model/versionPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

/**
 * Versions service.
 * @module VersionsApi
 */
export class VersionsApi extends BaseApi {
    /**
    * Create rendition for a file version
    *
    * **Note:** this endpoint is available in Alfresco 7.0.0 and newer versions.

An asynchronous request to create a rendition for version of file **nodeId** and **versionId**.

The version rendition is specified by name **id** in the request body:
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
    * @param versionId The identifier of a version, ie. version label, within the version history of a node.
    * @param renditionBodyCreate The rendition \"id\".
    * @return Promise<{}>
    */
    createVersionRendition(nodeId: string, versionId: string, renditionBodyCreate: RenditionBodyCreate): Promise<any> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');
        throwIfNotDefined(renditionBodyCreate, 'renditionBodyCreate');

        const pathParams = {
            nodeId,
            versionId
        };

        return this.post({
            path: '/nodes/{nodeId}/versions/{versionId}/renditions',
            pathParams,
            bodyParam: renditionBodyCreate
        });
    }
    /**
    * Delete a version
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Delete the version identified by **versionId** and **nodeId*.

If the version is successfully deleted then the content and metadata for that versioned node
will be deleted and will no longer appear in the version history. This operation cannot be undone.

If the most recent version is deleted the live node will revert to the next most recent version.

We currently do not allow the last version to be deleted. If you wish to clear the history then you
can remove the \"cm:versionable\" aspect (via update node) which will also disable versioning. In this
case, you can re-enable versioning by adding back the \"cm:versionable\" aspect or using the version
params (majorVersion and comment) on a subsequent file content update.

    *
    * @param nodeId The identifier of a node.
    * @param versionId The identifier of a version, ie. version label, within the version history of a node.
    * @return Promise<{}>
    */
    deleteVersion(nodeId: string, versionId: string): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');

        const pathParams = {
            nodeId,
            versionId
        };

        return this.delete({
            path: '/nodes/{nodeId}/versions/{versionId}',
            pathParams
        });
    }

    /**
    * Get version information
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Gets the version information for **versionId** of file node **nodeId**.

    *
    * @param nodeId The identifier of a node.
    * @param versionId The identifier of a version, ie. version label, within the version history of a node.
    * @return Promise<VersionEntry>
    */
    getVersion(nodeId: string, versionId: string): Promise<VersionEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');

        const pathParams = {
            nodeId,
            versionId
        };

        return this.get({
            path: '/nodes/{nodeId}/versions/{versionId}',
            pathParams,
            returnType: VersionEntry
        });
    }
    /**
    * Get version content
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Gets the version content for **versionId** of file node **nodeId**.

    *
    * @param nodeId The identifier of a node.
    * @param versionId The identifier of a version, ie. version label, within the version history of a node.
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
    getVersionContent(
        nodeId: string,
        versionId: string,
        opts?: {
            attachment?: boolean;
            ifModifiedSince?: string;
            range?: string;
        }
    ): Promise<Blob> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');

        const pathParams = {
            nodeId,
            versionId
        };

        const queryParams = {
            attachment: opts?.attachment
        };

        const headerParams = {
            'If-Modified-Since': opts?.ifModifiedSince,
            Range: opts?.range
        };

        const accepts = ['application/octet-stream'];

        return this.get({
            path: '/nodes/{nodeId}/versions/{versionId}/content',
            pathParams,
            queryParams,
            headerParams,
            accepts,
            returnType: 'blob'
        });
    }
    /**
    * Get rendition information for a file version
    *
    * **Note:** this endpoint is available in Alfresco 7.0.0 and newer versions.

Gets the rendition information for **renditionId** of version of file **nodeId** and **versionId**.

    *
    * @param nodeId The identifier of a node.
    * @param versionId The identifier of a version, ie. version label, within the version history of a node.
    * @param renditionId The name of a thumbnail rendition, for example *doclib*, or *pdf*.
    * @return Promise<RenditionEntry>
    */
    getVersionRendition(nodeId: string, versionId: string, renditionId: string): Promise<RenditionEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');
        throwIfNotDefined(renditionId, 'renditionId');

        const pathParams = {
            nodeId,
            versionId,
            renditionId
        };

        return this.get({
            path: '/nodes/{nodeId}/versions/{versionId}/renditions/{renditionId}',
            pathParams,
            returnType: RenditionEntry
        });
    }

    /**
    * Get rendition content for a file version
    *
    * **Note:** this endpoint is available in Alfresco 7.0.0 and newer versions.

Gets the rendition content for **renditionId** of version of file **nodeId** and **versionId**.

    *
    * @param nodeId The identifier of a node.
    * @param versionId The identifier of a version, ie. version label, within the version history of a node.
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
    getVersionRenditionContent(
        nodeId: string,
        versionId: string,
        renditionId: string,
        opts?: {
            attachment?: boolean;
            placeholder?: boolean;
            ifModifiedSince?: string;
            range?: string;
        }
    ): Promise<Blob> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');
        throwIfNotDefined(renditionId, 'renditionId');

        opts = opts || {};

        const pathParams = {
            nodeId,
            versionId,
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
            path: '/nodes/{nodeId}/versions/{versionId}/renditions/{renditionId}/content',
            pathParams,
            queryParams,
            headerParams,
            accepts,
            returnType: 'blob'
        });
    }

    /**
     * List version history
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets the version history as an ordered list of versions for the specified **nodeId**.
     *
     * The list is ordered in descending modified order. So the most recent version is first and
     * the original version is last in the list.
     *
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @return Promise<VersionPaging>
     */
    listVersionHistory(nodeId: string, opts?: ContentPagingQuery & ContentIncludeQuery & ContentFieldsQuery): Promise<VersionPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv'),
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems
        };

        return this.get({
            path: '/nodes/{nodeId}/versions',
            pathParams,
            queryParams,
            returnType: VersionPaging
        });
    }

    /**
    * List renditions for a file version
    *
    * **Note:** this endpoint is available in Alfresco 7.0.0 and newer versions.

Gets a list of the rendition information for each rendition of the version of file **nodeId** and **versionId**, including the rendition id.

Each rendition returned has a **status**: CREATED means it is available to view or download, NOT_CREATED means the rendition can be requested.

You can use the **where** parameter to filter the returned renditions by **status**. For example, the following **where**
clause will return just the CREATED renditions:

(status='CREATED')

    *
    * @param nodeId The identifier of a node.
    * @param versionId The identifier of a version, ie. version label, within the version history of a node.
    * @param opts Optional parameters
    * @param opts.where A string to restrict the returned objects by using a predicate.
    * @return Promise<RenditionPaging>
    */
    listVersionRenditions(nodeId: string, versionId: string, opts?: { where?: string }): Promise<RenditionPaging> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');

        const pathParams = {
            nodeId,
            versionId
        };

        return this.get({
            path: '/nodes/{nodeId}/versions/{versionId}/renditions',
            pathParams,
            queryParams: opts,
            returnType: RenditionPaging
        });
    }

    /**
    * Revert a version
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Attempts to revert the version identified by **versionId** and **nodeId** to the live node.

If the node is successfully reverted then the content and metadata for that versioned node
will be promoted to the live node and a new version will appear in the version history.

    *
    * @param nodeId The identifier of a node.
    * @param versionId The identifier of a version, ie. version label, within the version history of a node.
    * @param revertBody Optionally, specify a version comment and whether this should be a major version, or not.
    * @param opts Optional parameters
    * @return Promise<VersionEntry>
    */
    revertVersion(nodeId: string, versionId: string, revertBody: RevertBody, opts?: ContentFieldsQuery): Promise<VersionEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');
        throwIfNotDefined(revertBody, 'revertBody');

        const pathParams = {
            nodeId,
            versionId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/versions/{versionId}/revert',
            pathParams,
            queryParams,
            bodyParam: revertBody,
            returnType: VersionEntry
        });
    }

    /**
     * Generate a direct access content url for a given version of a node
     *
     * **Note:** this endpoint is available in Alfresco 7.1 and newer versions.
     *
     * @param nodeId The identifier of a node.
     * @param versionId The identifier of a version
     * @return Promise<DirectAccessUrlEntry>
     */
    requestDirectAccessUrl(nodeId: string, versionId: string): Promise<DirectAccessUrlEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(versionId, 'versionId');

        const pathParams = {
            nodeId,
            versionId
        };

        return this.post({
            path: '/nodes/{nodeId}/versions/{versionId}/request-direct-access-url',
            pathParams,
            returnType: DirectAccessUrlEntry
        });
    }
}
