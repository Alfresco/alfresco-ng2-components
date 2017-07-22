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
import { ContentApi } from 'alfresco-js-api';
import { Observable, Subject } from 'rxjs/Rx';
import { FolderCreatedEvent } from '../events/folder-created.event';
import { PermissionsEnum } from '../models/permissions.enum';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';

@Injectable()
export class AlfrescoContentService {

    folderCreated: Subject<FolderCreatedEvent> = new Subject<FolderCreatedEvent>();

    constructor(public authService: AuthenticationService,
                public apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    private get contentApi(): ContentApi {
        return this.apiService.getInstance().content;
    }

    /**
     * Get thumbnail URL for the given document node.
     *
     * @param {string|MinimalNodeEntity} nodeId Node to get URL for.
     * @param {boolean} [attachment] Retrieve content as an attachment for download
     * @param {string} [ticket] Custom ticket to use for authentication
     * @returns {string} The URL address pointing to the content.
     */
    getDocumentThumbnailUrl(nodeId: any, attachment?: boolean, ticket?: string): string {

        if (nodeId && nodeId.entry) {
            nodeId = nodeId.entry.id;
        }

        return this.contentApi.getDocumentThumbnailUrl(nodeId, attachment, ticket);
    }

    /**
     * Get content URL for the given node.
     *
     * @param nodeId {string|MinimalNodeEntity} Node to get URL for.
     * @param {boolean} [attachment] Retrieve content as an attachment for download
     * @param {string} [ticket] Custom ticket to use for authentication
     * @returns {string} The URL address pointing to the content.
     */
    getContentUrl(nodeId: any, attachment?: boolean, ticket?: string): string {

        if (nodeId && nodeId.entry) {
            nodeId = nodeId.entry.id;
        }

        return this.contentApi.getContentUrl(nodeId, attachment, ticket);
    }

    /**
     * Get content for the given node.
     * @param nodeId {string}.
     *
     * @returns {Observable<any>} URL address.
     */
    getNodeContent(nodeId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().core.nodesApi.getFileContent(nodeId).then((dataContent) => {
            return dataContent;
        })).catch(this.handleError);
    }

    /**
     * Create a folder
     * @param name - the folder name
     */
    createFolder(relativePath: string, name: string, parentId?: string): Observable<FolderCreatedEvent> {
        return Observable.fromPromise(this.apiService.getInstance().nodes.createFolder(name, relativePath, parentId))
            .do(data => {
                this.folderCreated.next(<FolderCreatedEvent> {
                    relativePath: relativePath,
                    name: name,
                    parentId: parentId,
                    node: data
                });
            })
            .catch(err => this.handleError(err));
    }

    /**
     * Check if the user has permissions on that node
     * @param MinimalNode -  node to check allowableOperations
     * @param PermissionsEnum - create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
     *
     * @returns {boolean} has permission
     */
    hasPermission(node: any, permission: PermissionsEnum|string): boolean {
        let hasPermission = false;

        if (this.hasAllowableOperations(node)) {
            if (permission && permission.startsWith('!')) {
                hasPermission = node.allowableOperations.find(currentPermission => currentPermission === permission.replace('!', '')) ? false : true;
            } else {
                hasPermission = node.allowableOperations.find(currentPermission => currentPermission === permission) ? true : false;
            }

        } else {
            if (permission && permission.startsWith('!')) {
                hasPermission = true;
            }
        }

        return hasPermission;
    }

    /**
     * Check if the node has the properties allowableOperations
     * @param MinimalNode -  node to check allowableOperations
     *
     * @returns {boolean} has AllowableOperations
     */
    hasAllowableOperations(node: any): boolean {
        return node && node.allowableOperations ? true : false;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }
}
