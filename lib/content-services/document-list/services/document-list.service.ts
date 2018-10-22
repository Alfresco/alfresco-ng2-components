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

import {
    AlfrescoApiService, AuthenticationService, ContentService, LogService,
    PermissionsEnum, ThumbnailService
} from '@alfresco/adf-core';

import { Injectable } from '@angular/core';
import { MinimalNodeEntity, MinimalNodeEntryEntity,  NodeEntry, NodePaging } from 'alfresco-js-api';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DocumentListService {

    static ROOT_ID = '-root-';

    constructor(authService: AuthenticationService,
                private contentService: ContentService,
                private apiService: AlfrescoApiService,
                private logService: LogService,
                private thumbnailService: ThumbnailService) {
    }

    private getNodesPromise(folder: string, opts?: any, includeFields: string[] = []): Promise<NodePaging> {

        let rootNodeId = DocumentListService.ROOT_ID;
        if (opts && opts.rootFolderId) {
            rootNodeId = opts.rootFolderId;
        }

        let includeFieldsRequest = ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));

        let params: any = {
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
        }

        return this.apiService.getInstance().nodes.getNodeChildren(rootNodeId, params);
    }

    /**
     * Deletes a node.
     * @param nodeId ID of the node to delete
     * @returns Empty response when the operation is complete
     */
    deleteNode(nodeId: string): Observable<any> {
        return from(this.apiService.getInstance().nodes.deleteNode(nodeId));
    }

    /**
     * Copy a node to destination node
     *
     * @param nodeId The id of the node to be copied
     * @param targetParentId The id of the folder where the node will be copied
     * @returns NodeEntry for the copied node
     */
    copyNode(nodeId: string, targetParentId: string) {
        return from(this.apiService.getInstance().nodes.copyNode(nodeId, { targetParentId })).pipe(
            catchError(err => this.handleError(err))
        );
    }

    /**
     * Moves a node to destination node.
     *
     * @param nodeId The id of the node to be moved
     * @param targetParentId The id of the folder where the node will be moved
     * @returns NodeEntry for the moved node
     */
    moveNode(nodeId: string, targetParentId: string) {
        return from(this.apiService.getInstance().nodes.moveNode(nodeId, { targetParentId })).pipe(
            catchError(err => this.handleError(err))
        );
    }

    /**
     * Creates a new folder in the path.
     * @param name Folder name
     * @param parentId Parent folder ID
     * @returns Details of the created folder node
     */
    createFolder(name: string, parentId: string): Observable<MinimalNodeEntity> {
        return from(this.apiService.getInstance().nodes.createFolder(name, '/', parentId))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets the folder node with the specified relative name path below the root node.
     * @param folder Path to folder.
     * @param opts Options.
     * @param includeFields Extra information to include (available options are "aspectNames", "isLink" and "association")
     * @returns Details of the folder
     */
    getFolder(folder: string, opts?: any, includeFields: string[] = []): Observable<NodePaging> {
        return from(this.getNodesPromise(folder, opts, includeFields))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets a node via its node ID.
     * @param nodeId ID of the target node
     * @param includeFields Extra information to include (available options are "aspectNames", "isLink" and "association")
     * @returns Details of the folder
     */
    getNode(nodeId: string, includeFields: string[] = []): Observable<NodeEntry> {

        let includeFieldsRequest = ['path', 'properties', 'allowableOperations', 'permissions', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));

        let opts: any = {
            includeSource: true,
            include: includeFieldsRequest
        };

        return this.contentService.getNode(nodeId, opts);
    }

    /**
     * Gets a folder node via its node ID.
     * @deprecated 2.3.0
     * @param nodeId ID of the folder node
     * @param includeFields Extra information to include (available options are "aspectNames", "isLink" and "association")
     * @returns Details of the folder
     */
    getFolderNode(nodeId: string, includeFields: string[] = []): Observable<MinimalNodeEntryEntity> {

        let includeFieldsRequest = ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));

        let opts: any = {
            includeSource: true,
            include: includeFieldsRequest
        };

        return from(this.apiService.getInstance().nodes.getNodeInfo(nodeId, opts));
    }
    /**
     * Get thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns Thumbnail URL string
     */
    getDocumentThumbnailUrl(node: MinimalNodeEntity): string {
        return this.thumbnailService.getDocumentThumbnailUrl(node);
    }

    /**
     * Gets the icon that represents a MIME type.
     * @param mimeType MIME type to get the icon for
     * @returns Path to the icon file
     */
    getMimeTypeIcon(mimeType: string): string {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    /**
     * Gets a default icon for MIME types with no specific icon.
     * @returns Path to the icon file
     */
    getDefaultMimeTypeIcon(): string {
        return this.thumbnailService.getDefaultMimeTypeIcon();
    }

    /**
     * Checks if a node has the specified permission.
     * @deprecated 2.3.0 - use the equivalent in the content service
     * @param node Target node
     * @param permission Permission level to query
     * @returns True if the node has the permission, false otherwise
     */
    hasPermission(node: any, permission: PermissionsEnum | string): boolean {
        return this.contentService.hasPermission(node, permission);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
