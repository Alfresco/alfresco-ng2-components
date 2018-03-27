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
import { ContentApi, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FolderCreatedEvent } from '../events/folder-created.event';
import { PermissionsEnum } from '../models/permissions.enum';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';

@Injectable()
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
     *
     * @param blob Content to download.
     * @param fileName Name of the resulting file.
     *
     * @memberOf ContentService
     */
    downloadBlob(blob: Blob, fileName: string): void {
        this.saveData(blob, 'blob', fileName);
    }

    /**
     * Invokes content download for a data array with a file name.
     *
     * @param data Data to download.
     * @param fileName Name of the resulting file.
     *
     * @memberOf ContentService
     */
    downloadData(data: any, fileName: string): void {
        this.saveData(data, 'data', fileName);
    }

    /**
     * Invokes content download for a JSON object with a file name.
     *
     * @param json JSON object to download.
     * @param fileName Name of the resulting file.
     *
     * @memberOf ContentService
     */
    downloadJSON(json: any, fileName: string): void {
        this.saveData(json, 'json', fileName);
    }

    /**
     * Creates a trusted object URL from the Blob.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     * @param  blob Data to wrap into object URL
     *
     * @memberOf ContentService
     */
    createTrustedUrl(blob: Blob): string {
        let url = window.URL.createObjectURL(blob);
        return <string> this.sanitizer.bypassSecurityTrustUrl(url);
    }

    private get contentApi(): ContentApi {
        return this.apiService.getInstance().content;
    }

    /**
     * Get thumbnail URL for the given document node.
     *
     * @param node Node to get URL for.
     * @param [attachment] Retrieve content as an attachment for download
     * @param [ticket] Custom ticket to use for authentication
     */
    getDocumentThumbnailUrl(node: any, attachment?: boolean, ticket?: string): string {

        if (node && node.entry) {
            node = node.entry.id;
        }

        return this.contentApi.getDocumentThumbnailUrl(node, attachment, ticket);
    }

    /**
     * Get content URL for the given node.
     *
     * @param nodeId or node to get URL for.
     * @param [attachment] Retrieve content as an attachment for download
     * @param [ticket] Custom ticket to use for authentication
     */
    getContentUrl(node: any, attachment?: boolean, ticket?: string): string {

        if (node && node.entry) {
            node = node.entry.id;
        }

        return this.contentApi.getContentUrl(node, attachment, ticket);
    }

    /**
     * Get content for the given node.
     * @param nodeId ID of the target node
     *
     */
    getNodeContent(nodeId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().core.nodesApi.getFileContent(nodeId).then((dataContent) => {
            return dataContent;
        })).catch(this.handleError);
    }

    /**
     * Create a folder
     * @param relativePath Location to create the folder
     * @param name Folder name
     * @param parentId Node ID of parent folder
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
     * @param node Node to check allowableOperations
     * @param permission Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
     *
     */
    hasPermission(node: any, permission: PermissionsEnum | string): boolean {
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
            hasPermission = node.isFile; // todo check ownership permission
        }

        return hasPermission;
    }

    /**
     * Check if the node has the properties allowableOperations
     * @param node Node to check allowableOperations
     *
     */
    hasAllowableOperations(node: any): boolean {
        return node && node.allowableOperations ? true : false;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }
}
