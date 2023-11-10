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

import { DeletedNodeEntry } from '../model/deletedNodeEntry';
import { DeletedNodesPaging } from '../model/deletedNodesPaging';
import { DirectAccessUrlEntry } from '../model/directAccessUrlEntry';
import { NodeEntry } from '../model/nodeEntry';
import { RenditionEntry } from '../model/renditionEntry';
import { RenditionPaging } from '../model/renditionPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

/**
 * Trashcan service.
 * @module TrashcanApi
 */
export class TrashcanApi extends BaseApi {
    /**
     * Permanently delete a deleted node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * @param nodeId The identifier of a node.
     * @return Promise<{}>
     */
    deleteDeletedNode(nodeId: string): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        return this.delete({
            path: '/deleted-nodes/{nodeId}',
            pathParams
        });
    }

    /**
     * Get rendition information for a deleted node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * @param nodeId The identifier of a node.
     * @param renditionId The name of a thumbnail rendition, for example *doclib*, or *pdf*.
     * @return Promise<RenditionEntry>
     */
    getArchivedNodeRendition(nodeId: string, renditionId: string): Promise<RenditionEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(renditionId, 'renditionId');

        const pathParams = {
            nodeId,
            renditionId
        };

        return this.get({
            path: '/deleted-nodes/{nodeId}/renditions/{renditionId}',
            pathParams,
            returnType: RenditionEntry
        });
    }

    /**
    * Get rendition content of a deleted node
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
    getArchivedNodeRenditionContent(
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
        opts = opts || {};

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

        return this.get({
            path: '/deleted-nodes/{nodeId}/renditions/{renditionId}/content',
            pathParams,
            queryParams,
            headerParams,
            accepts: ['application/octet-stream']
        });
    }

    /**
     * Get a deleted node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @return Promise<DeletedNodeEntry>
     */
    getDeletedNode(nodeId: string, opts?: ContentIncludeQuery): Promise<DeletedNodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get({
            path: '/deleted-nodes/{nodeId}',
            pathParams,
            queryParams,
            returnType: DeletedNodeEntry
        });
    }

    /**
    * Get deleted node content
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
    *
    * @param nodeId The identifier of a node.
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
    getDeletedNodeContent(
        nodeId: string,
        opts?: {
            attachment?: boolean;
            ifModifiedSince?: string;
            range?: string;
        }
    ): Promise<Blob> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
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
            path: '/deleted-nodes/{nodeId}/content',
            pathParams,
            queryParams,
            headerParams,
            accepts,
            returnType: 'blob'
        });
    }

    /**
     * List renditions for a deleted node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Each rendition returned has a **status**: CREATED means it is available to view or download, NOT_CREATED means the rendition can be requested.
     *
     * You can use the **where** parameter to filter the returned renditions by **status**. For example, the following **where**
     * clause will return just the CREATED renditions:
     *
     * - (status='CREATED')
     *
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @param opts.where A string to restrict the returned objects by using a predicate.
     * @return Promise<RenditionPaging>
     */
    listDeletedNodeRenditions(nodeId: string, opts?: { where?: string }): Promise<RenditionPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            where: opts?.where
        };

        return this.get({
            path: '/deleted-nodes/{nodeId}/renditions',
            pathParams,
            queryParams,
            returnType: RenditionPaging
        });
    }

    /**
     * List deleted nodes
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets a list of deleted nodes for the current user.
     * If the current user is an administrator deleted nodes for all users will be returned.
     * The list of deleted nodes will be ordered with the most recently deleted node at the top of the list.
     *
     * @param opts Optional parameters
     * @return Promise<DeletedNodesPaging>
     */
    listDeletedNodes(opts?: ContentPagingQuery & ContentIncludeQuery): Promise<DeletedNodesPaging> {
        const queryParams = {
            ...(opts || {}),
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get({
            path: '/deleted-nodes',
            queryParams,
            returnType: DeletedNodesPaging
        });
    }

    /**
     * Restore a deleted node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Attempts to restore the deleted node **nodeId** to its original location or to a new location.
     *
     * If the node is successfully restored to its former primary parent, then only the
     * primary child association will be restored, including recursively for any primary
     * children. It should be noted that no other secondary child associations or peer
     * associations will be restored, for any of the nodes within the primary parent-child
     * hierarchy of restored nodes, irrespective of whether these associations were to
     * nodes within or outside the restored hierarchy.
     *
     * Also, any previously shared link will not be restored since it is deleted at the time
     * of delete of each node.
     *
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @param opts.deletedNodeBodyRestore The targetParentId if the node is restored to a new location.
     * @return Promise<NodeEntry>
     */
    restoreDeletedNode(
        nodeId: string,
        opts?: {
            deletedNodeBodyRestore?: {
                targetParentId?: string;
                assocType?: string;
            };
        } & ContentFieldsQuery
    ): Promise<NodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/deleted-nodes/{nodeId}/restore',
            pathParams,
            queryParams,
            bodyParam: opts?.deletedNodeBodyRestore,
            returnType: NodeEntry
        });
    }

    /**
     * Generate a direct access content url for a given deleted node
     *
     * **Note:** this endpoint is available in Alfresco 7.1 and newer versions.
     *
     * @param nodeId The identifier of a node.
     * @return Promise<DirectAccessUrlEntry>
     */
    requestDirectAccessUrl(nodeId: string): Promise<DirectAccessUrlEntry> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        return this.post({
            path: '/deleted-nodes/{nodeId}/request-direct-access-url',
            pathParams,
            returnType: DirectAccessUrlEntry
        });
    }

    /**
     * Generate a direct access content url for a given rendition of a deleted node
     *
     * **Note:** this endpoint is available in Alfresco 7.1 and newer versions.
     *
     * @param nodeId The identifier of a node.
     * @param renditionId The identifier of a version
     * @return Promise<DirectAccessUrlEntry>
     */
    requestRenditionDirectAccessUrl(nodeId: string, renditionId: string): Promise<DirectAccessUrlEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(renditionId, 'renditionId');

        const pathParams = {
            nodeId,
            renditionId
        };

        return this.post({
            path: '/deleted-nodes/{nodeId}/renditions/{renditionId}/request-direct-access-url',
            pathParams,
            returnType: DirectAccessUrlEntry
        });
    }
}
