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

import { UserPreferencesService } from '@alfresco/adf-core';
import {
    ContentPagingQuery,
    Node,
    NodeAssignedHold,
    NodeEntry,
    NodePaging,
    NodesApi,
    NodesIncludeQuery,
    TrashcanApi,
    SizeDetailsEntry,
    JobIdBodyEntry
} from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { from, Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NodeMetadata } from '../models/node-metadata.model';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class NodesApiService {
    /**
     * Publish/subscribe to events related to node updates.
     */
    nodeUpdated = new Subject<Node>();

    private _trashcanApi: TrashcanApi;
    get trashcanApi(): TrashcanApi {
        this._trashcanApi = this._trashcanApi ?? new TrashcanApi(this.apiService.getInstance());
        return this._trashcanApi;
    }

    private _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    constructor(private apiService: AlfrescoApiService, private preferences: UserPreferencesService) {}

    private getEntryFromEntity(entity: NodeEntry): Node {
        return entity.entry;
    }

    /**
     * Gets the stored information about a node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns Node information
     */
    getNode(nodeId: string, options: any = {}): Observable<Node> {
        const defaults = {
            include: ['path', 'properties', 'allowableOperations', 'permissions']
        };
        const queryOptions = Object.assign(defaults, options);

        return from(this.nodesApi.getNode(nodeId, queryOptions)).pipe(
            map(this.getEntryFromEntity),
            catchError((err) => throwError(err))
        );
    }

    /**
     * Gets the items contained in a folder node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns List of child items from the folder
     */
    getNodeChildren(nodeId: string, options: any = {}): Observable<NodePaging> {
        const defaults = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            include: ['path', 'properties', 'allowableOperations', 'permissions']
        };
        const queryOptions = Object.assign(defaults, options);

        return from(this.nodesApi.listNodeChildren(nodeId, queryOptions)).pipe(catchError((err) => throwError(err)));
    }

    /**
     * Creates a new document node inside a folder.
     * @param parentNodeId ID of the parent folder node
     * @param nodeBody Data for the new node
     * @param options Optional parameters supported by JS-API
     * @returns Details of the new node
     */
    createNode(parentNodeId: string, nodeBody: any, options: any = {}): Observable<Node> {
        return from(this.nodesApi.createNode(parentNodeId, nodeBody, options)).pipe(
            map(this.getEntryFromEntity),
            catchError((err) => throwError(err))
        );
    }

    /**
     * Creates a new folder node inside a parent folder.
     * @param parentNodeId ID of the parent folder node
     * @param nodeBody Data for the new folder
     * @param options Optional parameters supported by JS-API
     * @returns Details of the new folder
     */
    createFolder(parentNodeId: string, nodeBody: any, options: any = {}): Observable<Node> {
        const body = Object.assign({ nodeType: 'cm:folder' }, nodeBody);
        return this.createNode(parentNodeId, body, options);
    }

    /**
     * Updates the information about a node.
     * @param nodeId ID of the target node
     * @param nodeBody New data for the node
     * @param options Optional parameters supported by JS-API
     * @returns Updated node information
     */
    updateNode(nodeId: string, nodeBody: any, options: any = {}): Observable<Node> {
        const defaults = {
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'definition']
        };
        const queryOptions = Object.assign(defaults, options);

        return from(this.nodesApi.updateNode(nodeId, nodeBody, queryOptions)).pipe(
            map(this.getEntryFromEntity),
            catchError((err) => throwError(err))
        );
    }

    /**
     * Moves a node to the trashcan.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns Empty result that notifies when the deletion is complete
     */
    deleteNode(nodeId: string, options: any = {}): Observable<any> {
        return from(this.nodesApi.deleteNode(nodeId, options)).pipe(catchError((err) => throwError(err)));
    }

    /**
     * Restores a node previously moved to the trashcan.
     * @param nodeId ID of the node to restore
     * @returns Details of the restored node
     */
    restoreNode(nodeId: string): Observable<Node> {
        return from(this.trashcanApi.restoreDeletedNode(nodeId)).pipe(
            map(this.getEntryFromEntity),
            catchError((err) => throwError(err))
        );
    }

    /**
     * Get the metadata and the nodeType for a nodeId cleaned by the prefix.
     * @param nodeId ID of the target node
     * @returns Node metadata
     */
    getNodeMetadata(nodeId: string): Observable<NodeMetadata> {
        return from(this.nodesApi.getNode(nodeId)).pipe(map(this.cleanMetadataFromSemicolon));
    }

    /**
     * Gets the list of holds assigned to the node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @param options.includeSource Also include **source** (in addition to **entries**) with folder information on **nodeId**
     * @returns List of assigned holds Observable<Hold[]>
     */
    getNodeAssignedHolds(
        nodeId: string,
        options?: {
            includeSource?: boolean;
        } & NodesIncludeQuery &
            ContentPagingQuery
    ): Observable<NodeAssignedHold[]> {
        const queryOptions = Object.assign({ where: `(assocType='rma:frozenContent')` }, options);

        return from(this.nodesApi.listParents(nodeId, queryOptions)).pipe(
            map(({ list }) =>
                list.entries?.map(({ entry }) => ({
                    id: entry.id,
                    name: entry.name
                }))
            )
        );
    }

    /**
     * Gets content for the given node.
     * @param nodeId ID of the target node
     * @returns Content data
     */
    getNodeContent(nodeId: string): Observable<any> {
        return from(this.nodesApi.getNodeContent(nodeId)).pipe(catchError((err) => throwError(err)));
    }

    /**
     * Create a new Node inside `-root-` folder
     * @param name Node name
     * @param nodeType Node type
     * @param properties Node body properties
     * @param path Path to the node
     * @returns The created node
     */
    createNodeInsideRoot(name: string, nodeType: string, properties: any, path: string): Observable<NodeEntry> {
        const body = {
            name,
            nodeType,
            properties,
            relativePath: path
        };
        return from(this.nodesApi.createNode('-root-', body, {}));
    }

    /**
     * Create a new Node from form metadata.
     * @param nodeType Node type
     * @param nameSpace Namespace for properties
     * @param data Property data to store in the node under namespace
     * @param path Path to the node
     * @param name Node name
     * @returns The created node
     */
    createNodeMetadata(nodeType: string, nameSpace: any, data: any, path: string, name?: string): Observable<NodeEntry> {
        const properties = {};
        for (const key in data) {
            if (data[key]) {
                properties[nameSpace + ':' + key] = data[key];
            }
        }

        return this.createNodeInsideRoot(name || this.randomNodeName(), nodeType, properties, path);
    }

    /**
     * Initiate a new request to calculate folder size.
     *
     * @param nodeId Node Id
     * @returns The job id which can be used to track request status
     */
    initiateFolderSizeCalculation(nodeId: string): Observable<JobIdBodyEntry> {
        return from(this.nodesApi.initiateFolderSizeCalculation(nodeId));
    }

    /**
     * Gets the size of a folder.
     *
     * @param nodeId Node Id
     * @param jobId Job Id
     * @returns Folder details
     */
    getFolderSizeInfo(nodeId: string, jobId: string): Observable<SizeDetailsEntry> {
        return from(this.nodesApi.getFolderSizeInfo(nodeId, jobId));
    }

    private randomNodeName(): string {
        return `node_${Date.now()}`;
    }

    private cleanMetadataFromSemicolon(nodeEntry: NodeEntry): NodeMetadata {
        const metadata = {};

        if (nodeEntry?.entry.properties) {
            for (const key in nodeEntry.entry.properties) {
                if (key) {
                    if (key.indexOf(':') !== -1) {
                        metadata[key.split(':')[1]] = nodeEntry.entry.properties[key];
                    } else {
                        metadata[key] = nodeEntry.entry.properties[key];
                    }
                }
            }
        }

        return new NodeMetadata(metadata, nodeEntry.entry.nodeType);
    }
}
