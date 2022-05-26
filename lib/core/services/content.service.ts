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
import { DomSanitizer } from '@angular/platform-browser';
import { MinimalNode, Node, NodeEntry, NodesApi } from '@alfresco/js-api';
import { Observable, Subject, from, throwError } from 'rxjs';
import { FolderCreatedEvent } from '../events/folder-created.event';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';
import { catchError } from 'rxjs/operators';
import { PermissionsEnum } from '../models/permissions.enum';
import { AllowableOperationsEnum } from '../models/allowable-operations.enum';
import { DownloadService } from './download.service';
import { ThumbnailService } from './thumbnail.service';
import { ApiClientsService } from '@alfresco/adf-core/api';

@Injectable({
    providedIn: 'root'
})
export class ContentService {

    folderCreated: Subject<FolderCreatedEvent> = new Subject<FolderCreatedEvent>();
    folderCreate: Subject<MinimalNode> = new Subject<MinimalNode>();
    folderEdit: Subject<MinimalNode> = new Subject<MinimalNode>();

    get contentApi() {
        return this.apiClientsService.get('ContentCustomClient.content');
    }

    _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    constructor(
        public authService: AuthenticationService,
        public apiService: AlfrescoApiService,
        private logService: LogService,
        private sanitizer: DomSanitizer,
        private downloadService: DownloadService,
        private thumbnailService: ThumbnailService,
        private apiClientsService: ApiClientsService
    ) {}

    /**
     * @deprecated in 3.2.0, use DownloadService instead.
     * Invokes content download for a Blob with a file name.
     * @param blob Content to download.
     * @param fileName Name of the resulting file.
     */
    downloadBlob(blob: Blob, fileName: string): void {
        this.downloadService.downloadBlob(blob, fileName);
    }

    /**
     * Creates a trusted object URL from the Blob.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     *
     * @param  blob Data to wrap into object URL
     * @returns URL string
     */
    createTrustedUrl(blob: Blob): string {
        const url = window.URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(url) as string;
    }

    /**
     * @deprecated in 3.2.0, use ThumbnailService instead.
     * Gets a thumbnail URL for the given document node.
     * @param node Node or Node ID to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @param ticket Custom ticket to use for authentication
     * @returns URL string
     */
    getDocumentThumbnailUrl(node: NodeEntry | string, attachment?: boolean, ticket?: string): string {
        return this.thumbnailService.getDocumentThumbnailUrl(node, attachment, ticket);
    }

    /**
     * Gets a content URL for the given node.
     *
     * @param node Node or Node ID to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @param ticket Custom ticket to use for authentication
     * @returns URL string or `null`
     */
    getContentUrl(node: NodeEntry | string, attachment?: boolean, ticket?: string): string {
        if (node) {
            let nodeId: string;

            if (typeof node === 'string') {
                nodeId = node;
            } else if (node.entry) {
                nodeId = node.entry.id;
            }

            return this.contentApi.getContentUrl(nodeId, attachment, ticket);
        }

        return null;
    }

    /**
     * Gets content for the given node.
     *
     * @param nodeId ID of the target node
     * @returns Content data
     */
    getNodeContent(nodeId: string): Observable<any> {
        return from(this.nodesApi.getNodeContent(nodeId))
            .pipe(
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Gets a Node via its node ID.
     *
     * @param nodeId ID of the target node
     * @param opts Options supported by JS-API
     * @returns Details of the folder
     */
    getNode(nodeId: string, opts?: any): Observable<NodeEntry> {
        return from(this.nodesApi.getNode(nodeId, opts));
    }

    /**
     * Checks if the user has permission on that node
     *
     * @param node Node to check permissions
     * @param permission Required permission type
     * @param userId Optional current user id will be taken by default
     * @returns True if the user has the required permissions, false otherwise
     */
    hasPermissions(node: Node, permission: PermissionsEnum | string, userId?: string): boolean {
        let hasPermissions = false;
        userId = userId ?? this.authService.getEcmUsername();

        const permissions = [...(node.permissions?.locallySet || []), ...(node.permissions?.inherited || [])]
            .filter((currentPermission) => currentPermission.authorityId === userId);
        if (permissions.length) {
            if (permission && permission.startsWith('!')) {
                hasPermissions = !permissions.find((currentPermission) => currentPermission.name === permission.replace('!', ''));
            } else {
                hasPermissions = !!permissions.find((currentPermission) => currentPermission.name === permission);
            }

        } else {

            if (permission === PermissionsEnum.CONSUMER) {
                hasPermissions = true;
            } else if (permission === PermissionsEnum.NOT_CONSUMER) {
                hasPermissions = false;
            } else if (permission && permission.startsWith('!')) {
                hasPermissions = true;
            }
        }

        return hasPermissions;
    }

    /**
     * Checks if the user has permissions on that node
     *
     * @param node Node to check allowableOperations
     * @param allowableOperation Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
     * @returns True if the user has the required permissions, false otherwise
     */
    hasAllowableOperations(node: Node, allowableOperation: AllowableOperationsEnum | string): boolean {
        let hasAllowableOperations = false;

        if (node && node.allowableOperations) {
            if (allowableOperation && allowableOperation.startsWith('!')) {
                hasAllowableOperations = !node.allowableOperations.find((currentOperation) => currentOperation === allowableOperation.replace('!', ''));
            } else {
                hasAllowableOperations = !!node.allowableOperations.find((currentOperation) => currentOperation === allowableOperation);
            }

        } else {
            if (allowableOperation && allowableOperation.startsWith('!')) {
                hasAllowableOperations = true;
            }
        }

        if (allowableOperation === AllowableOperationsEnum.COPY) {
            hasAllowableOperations = true;
        }

        if (allowableOperation === AllowableOperationsEnum.LOCK) {
            hasAllowableOperations = node.isFile;

            if (node.isLocked && node.allowableOperations) {
                hasAllowableOperations = !!~node.allowableOperations.indexOf('updatePermissions');
            }
        }

        return hasAllowableOperations;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
