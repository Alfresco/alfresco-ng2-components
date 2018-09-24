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
import { DomSanitizer } from '@angular/platform-browser';
import { ContentApi, MinimalNodeEntryEntity, Node, NodeEntry } from 'alfresco-js-api';
import { Observable, Subject, from, throwError } from 'rxjs';
import { FolderCreatedEvent } from '../events/folder-created.event';
import { PermissionsEnum } from '../models/permissions.enum';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContentService {

    private saveData: Function;

    folderCreated: Subject<FolderCreatedEvent> = new Subject<FolderCreatedEvent>();
    folderCreate: Subject<MinimalNodeEntryEntity> = new Subject<MinimalNodeEntryEntity>();
    folderEdit: Subject<MinimalNodeEntryEntity> = new Subject<MinimalNodeEntryEntity>();

    constructor(public authService: AuthenticationService,
                public apiService: AlfrescoApiService,
                private logService: LogService,
                private sanitizer: DomSanitizer) {
        this.saveData = (function () {
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';

            return function (data, format, fileName) {
                let blob = null;

                if (format === 'blob' || format === 'data') {
                    blob = new Blob([data], { type: 'octet/stream' });
                }

                if (format === 'object' || format === 'json') {
                    let json = JSON.stringify(data);
                    blob = new Blob([json], { type: 'octet/stream' });
                }

                if (blob) {

                    if (typeof window.navigator !== 'undefined' && window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();

                        window.URL.revokeObjectURL(url);
                    }
                }
            };
        }());
    }

    /**
     * Invokes content download for a Blob with a file name.
     * @param blob Content to download.
     * @param fileName Name of the resulting file.
     */
    downloadBlob(blob: Blob, fileName: string): void {
        this.saveData(blob, 'blob', fileName);
    }

    /**
     * Invokes content download for a data array with a file name.
     * @param data Data to download.
     * @param fileName Name of the resulting file.
     */
    downloadData(data: any, fileName: string): void {
        this.saveData(data, 'data', fileName);
    }

    /**
     * Invokes content download for a JSON object with a file name.
     * @param json JSON object to download.
     * @param fileName Name of the resulting file.
     */
    downloadJSON(json: any, fileName: string): void {
        this.saveData(json, 'json', fileName);
    }

    /**
     * Creates a trusted object URL from the Blob.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     * @param  blob Data to wrap into object URL
     * @returns URL string
     */
    createTrustedUrl(blob: Blob): string {
        let url = window.URL.createObjectURL(blob);
        return <string> this.sanitizer.bypassSecurityTrustUrl(url);
    }

    private get contentApi(): ContentApi {
        return this.apiService.getInstance().content;
    }

    /**
     * Gets a thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @param ticket Custom ticket to use for authentication
     * @returns URL string
     */
    getDocumentThumbnailUrl(node: any, attachment?: boolean, ticket?: string): string {

        if (node && node.entry) {
            node = node.entry.id;
        }

        return this.contentApi.getDocumentThumbnailUrl(node, attachment, ticket);
    }

    /**
     * Gets a content URL for the given node.
     * @param node Node to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @param ticket Custom ticket to use for authentication
     * @returns URL string
     */
    getContentUrl(node: any, attachment?: boolean, ticket?: string): string {

        if (node && node.entry) {
            node = node.entry.id;
        }

        return this.contentApi.getContentUrl(node, attachment, ticket);
    }

    /**
     * Gets content for the given node.
     * @param nodeId ID of the target node
     * @returns Content data
     */
    getNodeContent(nodeId: string): Observable<any> {
        return from(this.apiService.getInstance().core.nodesApi.getFileContent(nodeId))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Creates a folder.
     * @param relativePath Location to create the folder
     * @param name Folder name
     * @param parentId Node ID of parent folder
     * @returns Information about the new folder
     */
    createFolder(relativePath: string, name: string, parentId?: string): Observable<NodeEntry> {
        return from(this.apiService.getInstance().nodes.createFolder(name, relativePath, parentId))
            .pipe(
                tap(data => {
                    this.folderCreated.next(<FolderCreatedEvent> {
                        relativePath: relativePath,
                        name: name,
                        parentId: parentId,
                        node: data
                    });
                }),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets a Node via its node ID.
     * @param nodeId ID of the target node
     * @param opts Options supported by JS-API
     * @returns Details of the folder
     */
    getNode(nodeId: string, opts?: any): Observable<NodeEntry> {
        return from(this.apiService.getInstance().nodes.getNode(nodeId, opts));
    }

    /**
     * Checks if the user has permissions on that node
     * @param node Node to check allowableOperations
     * @param permission Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
     * @returns True if the user has the required permissions, false otherwise
     */
    hasPermission(node: Node, permission: PermissionsEnum | string): boolean {
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

        if (permission === PermissionsEnum.COPY) {
            hasPermission = true;
        }

        if (permission === PermissionsEnum.LOCK) {
            hasPermission = node.isFile;

            if (node.isLocked && this.hasAllowableOperations(node)) {
                hasPermission = !!~node.allowableOperations.indexOf('updatePermissions');
            }
        }

        return hasPermission;
    }

    /**
     * Checks if the node has the properties allowableOperations
     * @param node Node to check allowableOperations
     * @returns True if the node has the property, false otherwise
     */
    hasAllowableOperations(node: any): boolean {
        return node && node.allowableOperations ? true : false;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
