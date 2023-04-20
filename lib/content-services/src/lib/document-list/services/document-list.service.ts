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

import { AlfrescoApiService, LogService, PaginationModel } from '@alfresco/adf-core';
import { NodesApiService } from '../../common/services/nodes-api.service';

import { Injectable } from '@angular/core';
import { MinimalNode, NodeEntry, NodePaging, NodesApi } from '@alfresco/js-api';
import { DocumentLoaderNode } from '../models/document-folder.model';
import { Observable, from, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DocumentListLoader } from '../interfaces/document-list-loader.interface';
import { CustomResourcesService } from './custom-resources.service';

const ROOT_ID = '-root-';

@Injectable({
    providedIn: 'root'
})
export class DocumentListService implements DocumentListLoader {

    private _nodesApi: NodesApi;
    get nodes(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    constructor(private nodesApiService: NodesApiService,
                private apiService: AlfrescoApiService,
                private logService: LogService,
                private customResourcesService: CustomResourcesService) {
    }

    /**
     * Deletes a node.
     *
     * @param nodeId ID of the node to delete
     * @returns Empty response when the operation is complete
     */
    deleteNode(nodeId: string): Observable<any> {
        return from(this.nodes.deleteNode(nodeId));
    }

    /**
     * Copy a node to destination node
     *
     * @param nodeId The id of the node to be copied
     * @param targetParentId The id of the folder where the node will be copied
     * @returns NodeEntry for the copied node
     */
    copyNode(nodeId: string, targetParentId: string): Observable<NodeEntry> {
        return from(this.nodes.copyNode(nodeId, { targetParentId })).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Moves a node to destination node.
     *
     * @param nodeId The id of the node to be moved
     * @param targetParentId The id of the folder where the node will be moved
     * @returns NodeEntry for the moved node
     */
    moveNode(nodeId: string, targetParentId: string): Observable<NodeEntry> {
        return from(this.nodes.moveNode(nodeId, { targetParentId })).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets the folder node with the specified relative name path below the root node.
     *
     * @param folder Path to folder.
     * @param opts Options.
     * @param includeFields Extra information to include (available options are "aspectNames", "isLink" and "association")
     * @returns Details of the folder
     */
    getFolder(folder: string, opts?: any, includeFields: string[] = []): Observable<NodePaging> {
        let rootNodeId = ROOT_ID;
        if (opts && opts.rootFolderId) {
            rootNodeId = opts.rootFolderId;
        }

        const includeFieldsRequest = ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));

        const params: any = {
            includeSource: true,
            include: includeFieldsRequest
        };

        if (folder) {
            params.relativePath = folder;
        }

        if (opts) {
            if (opts.maxItems) {
                params.maxItems = opts.maxItems;
            }
            if (opts.skipCount) {
                params.skipCount = opts.skipCount;
            }
            if (opts.where) {
                params.where = opts.where;
            }
            if (opts.orderBy) {
                params.orderBy = opts.orderBy;
            }
        }

        return from(this.nodes.listNodeChildren(rootNodeId, params)).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets a node via its node ID.
     *
     * @param nodeId ID of the target node
     * @param includeFields Extra information to include (available options are "aspectNames", "isLink" and "association")
     * @returns Details of the folder
     */
    getNode(nodeId: string, includeFields: string[] = []): Observable<MinimalNode> {
        const includeFieldsRequest = ['path', 'properties', 'allowableOperations', 'permissions', 'definition', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));

        const opts: any = {
            includeSource: true,
            include: includeFieldsRequest
        };

        return this.nodesApiService.getNode(nodeId, opts);
    }

    /**
     * Gets a folder node via its node ID.
     *
     * @param nodeId ID of the folder node
     * @param includeFields Extra information to include (available options are "aspectNames", "isLink" and "association")
     * @returns Details of the folder
     */
    getFolderNode(nodeId: string, includeFields: string[] = []): Observable<NodeEntry> {
        const includeFieldsRequest = ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));

        const opts: any = {
            includeSource: true,
            include: includeFieldsRequest
        };

        return from(this.nodes.getNode(nodeId, opts)).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    isCustomSourceService(nodeId): boolean {
        return this.customResourcesService.isCustomSource(nodeId);
    }

    /**
     * Load a folder by Node Id.
     *
     * @param nodeId ID of the folder node
     * @param pagination
     * @param includeFields List of data field names to include in the results
     * @param where  Optionally filter the list
     * @param orderBy order by node property
     * @returns Details of the folder
     */
    loadFolderByNodeId(nodeId: string, pagination: PaginationModel, includeFields: string[], where?: string, orderBy?: string[]): Observable<DocumentLoaderNode> {
        if (this.customResourcesService.isCustomSource(nodeId)) {
            return this.customResourcesService.loadFolderByNodeId(nodeId, pagination, includeFields, where).pipe(
                map((result: any) => new DocumentLoaderNode(null, result))
            );
        } else {
            return this.retrieveDocumentNode(nodeId, pagination, includeFields, where, orderBy);
        }
    }

    private retrieveDocumentNode(nodeId: string, pagination: PaginationModel, includeFields: string[], where?: string, orderBy?: string[]): Observable<DocumentLoaderNode> {
        return forkJoin([
            this.getFolderNode(nodeId, includeFields),
            this.getFolder(null, {
                maxItems: pagination.maxItems,
                skipCount: pagination.skipCount,
                orderBy,
                rootFolderId: nodeId,
                where
            }, includeFields)]).pipe(
                map((results) => new DocumentLoaderNode(results[0], results[1]))
            );
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
