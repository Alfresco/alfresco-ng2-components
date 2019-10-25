/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Injectable } from '@angular/core';
import { NodeEntry, MinimalNode, NodePaging } from '@alfresco/js-api';
import { Observable, from, throwError } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { UserPreferencesService } from './user-preferences.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NodesApiService {

    constructor(
        private api: AlfrescoApiService,
        private preferences: UserPreferencesService) {}

    private get nodesApi() {
        return this.api.getInstance().core.nodesApi;
    }

    private getEntryFromEntity(entity: NodeEntry) {
        return entity.entry;
    }

    /**
     * Gets the stored information about a node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns Node information
     */
    getNode(nodeId: string, options: any = {}): Observable<MinimalNode> {
        const defaults = {
            include: [ 'path', 'properties', 'allowableOperations', 'permissions' ]
        };
        const queryOptions = Object.assign(defaults, options);
        const promise = this.nodesApi
            .getNode(nodeId, queryOptions)
            .then(this.getEntryFromEntity);

        return from(promise).pipe(
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
            include: [ 'path', 'properties', 'allowableOperations', 'permissions' ]
        };
        const queryOptions = Object.assign(defaults, options);
        const promise = this.nodesApi
            .getNodeChildren(nodeId, queryOptions);

        return from(promise).pipe(
            catchError((err) => throwError(err))
        );
    }

    /**
     * Creates a new document node inside a folder.
     * @param parentNodeId ID of the parent folder node
     * @param nodeBody Data for the new node
     * @param options Optional parameters supported by JS-API
     * @returns Details of the new node
     */
    createNode(parentNodeId: string, nodeBody: any, options: any = {}): Observable<MinimalNode> {
        const promise = this.nodesApi
            .addNode(parentNodeId, nodeBody, options)
            .then(this.getEntryFromEntity);

        return from(promise).pipe(
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
    createFolder(parentNodeId: string, nodeBody: any, options: any = {}): Observable<MinimalNode> {
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
    updateNode(nodeId: string, nodeBody: any, options: any = {}): Observable<MinimalNode> {
        const defaults = {
            include: [ 'path', 'properties', 'allowableOperations', 'permissions' ]
        };
        const queryOptions = Object.assign(defaults, options);

        const promise = this.nodesApi
            .updateNode(nodeId, nodeBody, queryOptions)
            .then(this.getEntryFromEntity);

        return from(promise).pipe(
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
        const promise = this.nodesApi.deleteNode(nodeId, options);

        return from(promise).pipe(
            catchError((err) => throwError(err))
        );
    }

    /**
     * Restores a node previously moved to the trashcan.
     * @param nodeId ID of the node to restore
     * @returns Details of the restored node
     */
    restoreNode(nodeId: string): Observable<MinimalNode> {
        const promise = this.nodesApi
            .restoreNode(nodeId)
            .then(this.getEntryFromEntity);

        return from(promise).pipe(
            catchError((err) => throwError(err))
        );
    }
}
