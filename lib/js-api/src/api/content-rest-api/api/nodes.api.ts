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

import {
    AssociationBody,
    AssociationEntry,
    ChildAssociationBody,
    ChildAssociationEntry,
    DirectAccessUrlEntry,
    NodeAssociationPaging,
    NodeBodyCopy,
    NodeBodyCreate,
    NodeBodyLock,
    NodeBodyMove,
    NodeBodyUpdate,
    NodeChildAssociationPaging,
    NodeEntry
} from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentPagingQuery } from './types';

export type NodesIncludeQuery = {
    /**
     * Returns additional information about the node. The following optional fields can be requested:
     * - allowableOperations
     * - association
     * - isLink
     * - isFavorite
     * - isLocked
     * - path
     * - permissions
     * - definition
     */
    include?: string[];

    /**
     * A list of field names.
     *
     * You can use this parameter to restrict the fields
     * returned within a response if, for example, you want to save on overall bandwidth.
     *
     * The list applies to a returned individual
     * entity or entries within a collection.
     *
     * If the API method also supports the **include**
     * parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     */
    fields?: string[];
};

export interface CreateNodeOpts extends NodesIncludeQuery {
    [key: string]: any;
    // If true, then a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
    autoRename?: boolean;
    // If true, then created node will be version 1.0 MAJOR. If false, then created node will be version 0.1 MINOR.
    majorVersion?: boolean;
    // If true, then created node will be versioned. If false, then created node will be unversioned and auto-versioning disabled.
    versioningEnabled?: boolean;
}

/**
 * Nodes service.
 */
export class NodesApi extends BaseApi {
    /**
     * Copy a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Copies the node **nodeId** to the parent folder node **targetParentId**. You specify the **targetParentId** in the request body.
     *
     * The new node has the same name as the source node unless you specify a new **name** in the request body.
     *
     * If the source **nodeId** is a folder, then all of its children are also copied.
     *
     * If the source **nodeId** is a file, it's properties, aspects and tags are copied, it's ratings, comments and locks are not.
     * @param nodeId The identifier of a node.
     * @param nodeBodyCopy The targetParentId and, optionally, a new name which should include the file extension.
     * @param opts Optional parameters
     * @returns Promise<NodeEntry>
     */
    copyNode(nodeId: string, nodeBodyCopy: NodeBodyCopy, opts?: NodesIncludeQuery): Promise<NodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(nodeBodyCopy, 'nodeBodyCopy');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/copy',
            pathParams,
            queryParams,
            bodyParam: nodeBodyCopy,
            returnType: NodeEntry
        });
    }

    /**
     * Create node association
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @param nodeId The identifier of a source node.
     * @param associationBodyCreate The target node id and assoc type.
     * @param opts Optional parameters
     * @param opts.fields A list of field names.
     * You can use this parameter to restrict the fields
     * returned within a response if, for example, you want to save on overall bandwidth.
     * The list applies to a returned individual entity or entries within a collection.
     * If the API method also supports the **include** parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     * @returns Promise<AssociationEntry>
     */
    createAssociation(nodeId: string, associationBodyCreate: AssociationBody, opts?: { fields?: string[] }): Promise<AssociationEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(associationBodyCreate, 'associationBodyCreate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/targets',
            pathParams,
            queryParams,
            bodyParam: associationBodyCreate
        });
    }

    /**
     * Create a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @param nodeId The identifier of a node. You can also use one of these well-known aliases:
     * -my-
     * -shared-
     * -root-
     * @param nodeBodyCreate The node information to create.
     * @param opts Optional parameters
     * @param opts.autoRename If true, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
     * @param opts.include Returns additional information about the node. The following optional fields can be requested:
     * - allowableOperations
     * - association
     * - isLink
     * - isFavorite
     * - isLocked
     * - path
     * - permissions
     * - definition
     * @param opts.fields A list of field names. You can use this parameter to restrict the fields
     * returned within a response if, for example, you want to save on overall bandwidth.
     * The list applies to a returned individual entity or entries within a collection.
     * If the API method also supports the **include** parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     * @param formParams parameters
     * @returns Promise<NodeEntry>
     */
    createNode(nodeId: string, nodeBodyCreate: NodeBodyCreate, opts?: CreateNodeOpts, formParams?: any): Promise<NodeEntry | any> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(nodeBodyCreate, 'nodeBodyCreate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            autoRename: opts?.autoRename,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        formParams = formParams || {};

        let contentTypes;
        let returnType;

        if (formParams.filedata) {
            contentTypes = ['multipart/form-data'];
        } else {
            contentTypes = ['application/json'];
            returnType = NodeEntry;
        }

        return this.post({
            path: '/nodes/{nodeId}/children',
            pathParams,
            queryParams,
            formParams,
            bodyParam: nodeBodyCreate,
            contentTypes,
            returnType
        });
    }

    /**
     * Create a folder
     * @param name - folder name
     * @param relativePath - The relativePath specifies the folder structure to create relative to the node identified by nodeId.
     * @param nodeId default value root.The identifier of a node where add the folder. You can also use one of these well-known aliases: -my- | -shared- | -root-
     * @param opts Optional parameters
     * @returns  A promise that is resolved if the folder is created and {error} if rejected.
     */
    createFolder(name: string, relativePath: string, nodeId: string, opts?: CreateNodeOpts): Promise<NodeEntry> {
        nodeId = nodeId || '-root-';

        const nodeBody = new NodeBodyCreate({
            name,
            relativePath,
            nodeType: 'cm:folder'
        });

        return this.createNode(nodeId, nodeBody, opts);
    }

    /**
     * Create secondary child
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @param nodeId The identifier of a parent node.
     * @param secondaryChildAssociationBodyCreate The child node id and assoc type.
     * @param opts Optional parameters
     * @param opts.fields A list of field names.
     * You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth.
     * The list applies to a returned individual entity or entries within a collection.
     * If the API method also supports the **include** parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     * @returns Promise<ChildAssociationEntry>
     */
    createSecondaryChildAssociation(
        nodeId: string,
        secondaryChildAssociationBodyCreate: ChildAssociationBody,
        opts?: {
            fields?: string[];
        }
    ): Promise<ChildAssociationEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(secondaryChildAssociationBodyCreate, 'secondaryChildAssociationBodyCreate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/secondary-children',
            pathParams,
            queryParams,
            bodyParam: secondaryChildAssociationBodyCreate,
            returnType: ChildAssociationEntry
        });
    }
    /**
     * Delete node association(s)
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Delete an association, or associations, from the source **nodeId* to a target node for the given association type.
     * If the association type is **not** specified, then all peer associations, of any type, in the direction
     * from source to target, are deleted.
     * **Note:** After removal of the peer association, or associations, from source to target, the two nodes may still have peer associations in the other direction.
     * @param nodeId The identifier of a source node.
     * @param targetId The identifier of a target node.
     * @param opts Optional parameters
     * @param opts.assocType Only delete associations of this type.
     * @returns Promise<{}>
     */
    deleteAssociation(nodeId: string, targetId: string, opts?: { assocType?: string }): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(targetId, 'targetId');

        const pathParams = {
            nodeId,
            targetId
        };

        const queryParams = {
            assocType: opts?.assocType
        };

        return this.delete({
            path: '/nodes/{nodeId}/targets/{targetId}',
            pathParams,
            queryParams
        });
    }
    /**
     * Delete a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * If **nodeId** is a folder, then its children are also deleted.
     * Deleted nodes move to the trashcan unless the **permanent** query parameter is **true** and the current user is the owner of the node or an admin.
     *
     * Deleting a node deletes it from its primary parent and also from any secondary parents. Peer associations are also deleted, where the deleted
     * node is either a source or target of an association. This applies recursively to any hierarchy of primary children of the deleted node.
     *
     * **Note:** If the node is not permanently deleted, and is later successfully restored to its former primary parent, then the primary
     * child association is restored. This applies recursively for any primary children. No other secondary child associations or
     * peer associations are restored for any of the nodes in the primary parent-child hierarchy of restored nodes, regardless of whether the original
     * associations were to nodes inside or outside the restored hierarchy.
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @param opts.permanent If **true** then the node is deleted permanently, without moving to the trashcan.
     * Only the owner of the node or an admin can permanently delete the node. (default to false)
     * @returns Promise<{}>
     */
    deleteNode(nodeId: string, opts?: { permanent?: boolean }): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            permanent: opts?.permanent
        };

        return this.delete({
            path: '/nodes/{nodeId}',
            pathParams,
            queryParams
        });
    }
    /**
     * Delete multiple nodes
     * @param nodeIds The list of node IDs to delete.
     * @param opts Optional parameters
     * @param opts.permanent If **true** then nodes are deleted permanently, without moving to the trashcan.
     * Only the owner of the node or an admin can permanently delete the node. (default to false)
     * @returns Promise<[]>
     */
    async deleteNodes(nodeIds: string[], opts?: { permanent?: boolean }): Promise<void[]> {
        throwIfNotDefined(nodeIds, 'nodeIds');

        const promises = [];

        for (const id of nodeIds) {
            promises.push(await this.deleteNode(id, opts));
        }

        return Promise.all(promises);
    }

    /**
     * Delete secondary child or children
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Delete secondary child associations between the parent **nodeId** and child nodes for the given association type.
     *
     * If the association type is **not** specified, then all secondary child associations, of any type in the direction
     * from parent to secondary child, will be deleted. The child will still have a primary parent and may still be
     * associated as a secondary child with other secondary parents.
     * @param nodeId The identifier of a parent node.
     * @param childId The identifier of a child node.
     * @param opts Optional parameters
     * @param opts.assocType Only delete associations of this type.
     * @returns Promise<{}>
     */
    deleteSecondaryChildAssociation(nodeId: string, childId: string, opts?: { assocType?: string }): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(childId, 'childId');

        const pathParams = {
            nodeId,
            childId
        };

        return this.delete({
            path: '/nodes/{nodeId}/secondary-children/{childId}',
            pathParams,
            queryParams: opts
        });
    }

    /**
     * Get a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * You can use the **include** parameter to return additional information.
     * @param nodeId The identifier of a node. You can also use one of these well-known aliases:
     * - -my-
     * - -shared-
     * - -root-
     * @param opts Optional parameters
     * @param opts.relativePath A path relative to the **nodeId**. If you set this, information is returned on the node resolved by this path.
     * @returns Promise<NodeEntry>
     */
    getNode(nodeId: string, opts?: { relativePath?: string } & NodesIncludeQuery): Promise<NodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            relativePath: opts?.relativePath,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}',
            pathParams,
            queryParams,
            returnType: NodeEntry
        });
    }

    /**
     * Get node content
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @param opts.attachment **true** enables a web browser to download the file as an attachment.
     * **false** means a web browser may preview the file in a new tab or window, but not download the file.
     * You can only set this parameter to **false** if the content type of the file is in the supported list;
     * for example, certain image files and PDF files.
     * If the content type is not supported for preview, then a value of **false**  is ignored, and
     * the attachment will be returned in the response. (default to true)
     * @param opts.ifModifiedSince Only returns the content if it has been modified since the date provided.
     * Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.
     * @param opts.range The Range header indicates the part of a document that the server should return.
     * Single part request supported, for example: bytes=1-10.
     * @returns Promise<Blob>
     */
    getNodeContent(
        nodeId: string,
        opts?: {
            attachment?: boolean;
            ifModifiedSince?: string;
            range?: string;
        }
    ): Promise<Blob> {
        throwIfNotDefined(nodeId, 'nodeId');

        opts = opts || {};

        const pathParams = {
            nodeId
        };

        const queryParams = {
            attachment: opts?.attachment ?? null
        };

        const headerParams = {};

        if (opts?.ifModifiedSince) {
            Object.defineProperty(headerParams, 'If-Modified-Since', { value: opts?.ifModifiedSince });
        }

        if (opts?.range) {
            Object.defineProperty(headerParams, 'Range', { value: opts?.range });
        }

        const accepts = ['application/octet-stream'];

        return this.get({
            path: '/nodes/{nodeId}/content',
            pathParams,
            queryParams,
            headerParams,
            accepts,
            returnType: 'blob'
        });
    }

    /**
     * List node children
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets a list of children of the parent node **nodeId**.
     * Minimal information for each child is returned by default.
     * You can use the **include** parameter to return additional information.
     * The list of child nodes includes primary children and secondary children, if there are any.
     * You can use the **include** parameter (include=association) to return child association details
     * for each child, including the **assocTyp**e and the **isPrimary** flag.
     *
     * The default sort order for the returned list is for folders to be sorted before files, and by ascending name.
     *
     * You can override the default using **orderBy** to specify one or more fields to sort by. The default order is always ascending, but
     * you can use an optional **ASC** or **DESC** modifier to specify an ascending or descending sort order.
     *
     * For example, specifying orderBy=name DESC returns a mixed folder/file list in descending **name** order.
     * You can use any of the following fields to order the results:
     * - isFolder
     * - name
     * - mimeType
     * - nodeType
     * - sizeInBytes
     * - modifiedAt
     * - createdAt
     * - modifiedByUser
     * - createdByUser
     * @param nodeId The identifier of a node. You can also use one of these well-known aliases:
     * - -my-
     * - -shared-
     * - -root-
     * @param opts Optional parameters
     * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields.
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     * @param opts.where Optionally filter the list. Here are some examples:
     * - where=(isFolder=true)
     * - where=(isFile=true)
     * - where=(nodeType='my:specialNodeType')
     * - where=(nodeType='my:specialNodeType INCLUDESUBTYPES')
     * - where=(isPrimary=true)
     * - where=(assocType='my:specialAssocType')
     * - where=(isPrimary=false and assocType='my:specialAssocType')
     * @param opts.relativePath Return information on children in the folder resolved by this path. The path is relative to **nodeId**.
     * @param opts.includeSource Also include **source** in addition to **entries** with folder information on the parent node – either the specified parent **nodeId**, or as resolved by **relativePath**.
     * @returns Promise<NodeChildAssociationPaging>
     */
    listNodeChildren(
        nodeId: string,
        opts?: {
            orderBy?: string[];
            where?: string;
            relativePath?: string;
            includeSource?: boolean;
        } & NodesIncludeQuery &
            ContentPagingQuery
    ): Promise<NodeChildAssociationPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            relativePath: opts?.relativePath,
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/children',
            pathParams,
            queryParams,
            returnType: NodeChildAssociationPaging
        });
    }

    /**
     * List parents
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets a list of parent nodes that are associated with the current child **nodeId**.
     * The list includes both the primary parent and any secondary parents.
     * @param nodeId The identifier of a child node. You can also use one of these well-known aliases:
     * - -my-
     * - -shared-
     * - -root-
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list by **assocType** and/or **isPrimary**. Here are some example filters:
     * - where=(assocType='my:specialAssocType')
     * - where=(isPrimary=true)
     * - where=(isPrimary=false and assocType='my:specialAssocType')
     * @param opts.includeSource Also include **source** (in addition to **entries**) with folder information on **nodeId**
     * @returns Promise<NodeAssociationPaging>
     */
    listParents(
        nodeId: string,
        opts?: {
            where?: string;
            includeSource?: boolean;
        } & NodesIncludeQuery &
            ContentPagingQuery
    ): Promise<NodeAssociationPaging> {
        throwIfNotDefined(nodeId, 'nodeId');
        opts = opts || {};

        const pathParams = {
            nodeId
        };

        const queryParams = {
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/parents',
            pathParams,
            queryParams,
            returnType: NodeAssociationPaging
        });
    }

    /**
     * List secondary children
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets a list of secondary child nodes that are associated with the current parent **nodeId**, via a secondary child association.
     * @param nodeId The identifier of a parent node. You can also use one of these well-known aliases:
     * -my-
     * -shared-
     * -root-
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list by assocType. Here's an example:
     * - where=(assocType='my:specialAssocType')
     * @param opts.includeSource Also include **source** (in addition to **entries**) with folder information on **nodeId**
     * @returns Promise<NodeChildAssociationPaging>
     */
    listSecondaryChildren(
        nodeId: string,
        opts?: {
            where?: string;
            includeSource?: boolean;
        } & NodesIncludeQuery &
            ContentPagingQuery
    ): Promise<NodeChildAssociationPaging> {
        throwIfNotDefined(nodeId, 'nodeId');
        opts = opts || {};

        const pathParams = {
            nodeId
        };

        const queryParams = {
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            includeSource: opts?.includeSource,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/secondary-children',
            pathParams,
            queryParams,
            returnType: NodeChildAssociationPaging
        });
    }

    /**
     * List source associations
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @param nodeId The identifier of a target node.
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list by **assocType**. Here's an example:
     * - where=(assocType='my:specialAssocType')
     * @returns Promise<NodeAssociationPaging>
     */
    listSourceAssociations(
        nodeId: string,
        opts?: {
            where?: string;
        } & NodesIncludeQuery
    ): Promise<NodeAssociationPaging> {
        throwIfNotDefined(nodeId, 'nodeId');
        opts = opts || {};

        const pathParams = {
            nodeId
        };

        const queryParams = {
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/sources',
            pathParams,
            queryParams,
            returnType: NodeAssociationPaging
        });
    }

    /**
     * List target associations
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Gets a list of target nodes that are associated with the current source **nodeId**.
     * @param nodeId The identifier of a source node.
     * @param opts Optional parameters
     * @param opts.where Optionally filter the list by **assocType**. Here's an example:
     * - where=(assocType='my:specialAssocType')
     * @returns Promise<NodeAssociationPaging>
     */
    listTargetAssociations(
        nodeId: string,
        opts?: {
            where?: string;
        } & NodesIncludeQuery &
            ContentPagingQuery
    ): Promise<NodeAssociationPaging> {
        throwIfNotDefined(nodeId, 'nodeId');
        opts = opts || {};

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/targets',
            pathParams,
            queryParams,
            returnType: NodeAssociationPaging
        });
    }

    /**
     * Lock a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * If a lock on the node cannot be taken, then an error is returned.
     * @param nodeId The identifier of a node.
     * @param nodeBodyLock Lock details.
     * @param opts Optional parameters
     * @returns Promise<NodeEntry>
     */
    lockNode(nodeId: string, nodeBodyLock: NodeBodyLock, opts?: NodesIncludeQuery): Promise<NodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(nodeBodyLock, 'nodeBodyLock');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/lock',
            pathParams,
            queryParams,
            bodyParam: nodeBodyLock,
            returnType: NodeEntry
        });
    }

    /**
     * Move a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * The **targetParentId** is specified in the in request body.
     * The moved node retains its name unless you specify a new **name** in the request body.
     * If the source **nodeId** is a folder, then its children are also moved.
     * The move will effectively change the primary parent.
     * @param nodeId The identifier of a node.
     * @param nodeBodyMove The targetParentId and, optionally, a new name which should include the file extension.
     * @param opts Optional parameters
     * @returns Promise<NodeEntry>
     */
    moveNode(nodeId: string, nodeBodyMove: NodeBodyMove, opts?: NodesIncludeQuery): Promise<NodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(nodeBodyMove, 'nodeBodyMove');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/move',
            pathParams,
            queryParams,
            bodyParam: nodeBodyMove,
            returnType: NodeEntry
        });
    }

    /**
     * Unlock a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * The current user must be the owner of the locks or have admin rights, otherwise an error is returned.
     * If a lock on the node cannot be released, then an error is returned.
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @returns Promise<NodeEntry>
     */
    unlockNode(nodeId: string, opts?: NodesIncludeQuery): Promise<NodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/unlock',
            pathParams,
            queryParams,
            returnType: NodeEntry
        });
    }

    /**
     * Update a node
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @param nodeId The identifier of a node.
     * @param nodeBodyUpdate The node information to update.
     * @param opts Optional parameters
     * @returns Promise<NodeEntry>
     */
    updateNode(nodeId: string, nodeBodyUpdate: NodeBodyUpdate, opts?: NodesIncludeQuery): Promise<NodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(nodeBodyUpdate, 'nodeBodyUpdate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/nodes/{nodeId}',
            pathParams,
            queryParams,
            bodyParam: nodeBodyUpdate,
            returnType: NodeEntry
        });
    }
    /**
     * Update node content
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @param nodeId The identifier of a node.
     * @param contentBodyUpdate The binary content
     * @param opts Optional parameters
     * @param opts.majorVersion If **true**, create a major version.
     * Setting this parameter also enables versioning of this node, if it is not already versioned. (default to false)
     * @param opts.comment Add a version comment which will appear in version history.
     * Setting this parameter also enables versioning of this node, if it is not already versioned.
     * @param opts.name Optional new name. This should include the file extension.
     * The name must not contain spaces or the following special characters: * \" < > \\ / ? : and |.
     * The character . must not be used at the end of the name.
     * @returns Promise<NodeEntry>
     */
    updateNodeContent(
        nodeId: string,
        contentBodyUpdate: string,
        opts?: {
            majorVersion?: boolean;
            comment?: string;
            name?: string;
        } & NodesIncludeQuery
    ): Promise<NodeEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(contentBodyUpdate, 'contentBodyUpdate');
        opts = opts || {};

        const pathParams = {
            nodeId
        };

        const queryParams = {
            majorVersion: opts?.majorVersion,
            comment: opts?.comment,
            name: opts?.name,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/nodes/{nodeId}/content',
            pathParams,
            queryParams,
            contentTypes: ['application/octet-stream'],
            bodyParam: contentBodyUpdate,
            returnType: NodeEntry
        });
    }

    /**
     * Generate a direct access content url for a given node
     *
     * **Note:** this endpoint is available in Alfresco 7.1 and newer versions.
     * @param nodeId The identifier of a node.
     * @returns Promise<DirectAccessUrlEntry>
     */
    requestDirectAccessUrl(nodeId: string): Promise<DirectAccessUrlEntry> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        return this.post({
            path: '/nodes/{nodeId}/request-direct-access-url',
            pathParams,
            returnType: DirectAccessUrlEntry
        });
    }
}
