/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { MinimalNodeEntity, MinimalNodeEntryEntity, NodePaging } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService } from './alfresco-api.service';
import { UserPreferencesService } from './user-preferences.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';

@Injectable()
export class NodesApiService {

    constructor(
        private api: AlfrescoApiService,
        private preferences: UserPreferencesService) {}

    private get nodesApi() {
        return this.api.getInstance().core.nodesApi;
    }

    private getEntryFromEntity(entity: MinimalNodeEntity) {
        return entity.entry;
    }

    /**
     * Gets the stored information about a node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JSAPI
     */
    getNode(nodeId: string, options: any = {}): Observable<MinimalNodeEntryEntity> {
        const { nodesApi, handleError, getEntryFromEntity } = this;
        const defaults = {
            include: [ 'path', 'properties', 'allowableOperations' ]
        };
        const queryOptions = Object.assign(defaults, options);
        const promise = nodesApi
            .getNode(nodeId, queryOptions)
            .then(getEntryFromEntity);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    /**
     * Gets the items contained in a folder node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JSAPI
     */
    getNodeChildren(nodeId: string, options: any = {}): Observable<NodePaging> {
        const { nodesApi, handleError } = this;
        const defaults = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            include: [ 'path', 'properties', 'allowableOperations' ]
        };
        const queryOptions = Object.assign(defaults, options);
        const promise = nodesApi
            .getNodeChildren(nodeId, queryOptions);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    /**
     * Creates a new document node inside a folder.
     * @param parentNodeId ID of the parent folder node
     * @param nodeBody Data for the new node
     * @param options Optional parameters supported by JSAPI
     */
    createNode(parentNodeId: string, nodeBody: any, options: any = {}): Observable<MinimalNodeEntryEntity> {
        const { nodesApi, handleError, getEntryFromEntity } = this;
        const promise = nodesApi
            .addNode(parentNodeId, nodeBody, options)
            .then(getEntryFromEntity);

        return Observable.fromPromise(promise).catch(handleError);
    }

    /**
     * Creates a new folder node inside a parent folder.
     * @param parentNodeId ID of the parent folder node
     * @param nodeBody Data for the new folder
     * @param options Optional parameters supported by JSAPI
     */
    createFolder(parentNodeId: string, nodeBody: any, options: any = {}): Observable<MinimalNodeEntryEntity> {
        const body = Object.assign({ nodeType: 'cm:folder' }, nodeBody);
        return this.createNode(parentNodeId, body, options);
    }

    /**
     * Updates the information about a node.
     * @param nodeId ID of the target node
     * @param nodeBody New data for the node
     * @param options Optional parameters supported by JSAPI
     */
    updateNode(nodeId: string, nodeBody: any, options: any = {}): Observable<MinimalNodeEntryEntity> {
        const { nodesApi, handleError, getEntryFromEntity } = this;
        const promise = nodesApi
            .updateNode(nodeId, nodeBody, options)
            .then(getEntryFromEntity);

        return Observable.fromPromise(promise).catch(handleError);
    }

    /**
     * Moves a node to the trashcan.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JSAPI
     */
    deleteNode(nodeId: string, options: any = {}): Observable<void> {
        const { nodesApi, handleError } = this;
        const promise = nodesApi
            .deleteNode(nodeId, options);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    /**
     * Restores a node previously moved to the trashcan.
     * @param nodeId ID of the node to restore
     */
    restoreNode(nodeId: string): Observable<MinimalNodeEntryEntity> {
        const { nodesApi, handleError, getEntryFromEntity } = this;
        const promise = nodesApi
            .restoreNode(nodeId)
            .then(getEntryFromEntity);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    /**
     * Reports an error.
     * @param error Object representing the error
     */
    handleError(error: any): Observable<any> {
        return Observable.throw(error);
    }
}
