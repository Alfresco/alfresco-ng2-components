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

import { Injectable } from '@angular/core';
import { ContentApi, Node, NodeEntry } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { AuthenticationService, ThumbnailService } from '@alfresco/adf-core';
import { PermissionsEnum } from '../models/permissions.enum';
import { AllowableOperationsEnum } from '../models/allowable-operations.enum';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

export interface FolderCreatedEvent {
    name: string;
    relativePath?: string;
    parentId?: string;
    node?: NodeEntry;
}

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    folderCreated = new Subject<FolderCreatedEvent>();
    folderCreate = new Subject<Node>();
    folderEdit = new Subject<Node>();

    private _contentApi: ContentApi;
    get contentApi(): ContentApi {
        this._contentApi = this._contentApi ?? new ContentApi(this.apiService.getInstance());
        return this._contentApi;
    }

    constructor(public authService: AuthenticationService, public apiService: AlfrescoApiService, private thumbnailService?: ThumbnailService) {}

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

    getDocumentThumbnailUrl(nodeId: string, attachment?: boolean, ticket?: string): string {
        return this.contentApi.getDocumentThumbnailUrl(nodeId, attachment, ticket);
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

        const permissions = [...(node.permissions?.locallySet || []), ...(node.permissions?.inherited || [])].filter(
            (currentPermission) => currentPermission.authorityId === userId
        );
        if (permissions.length) {
            if (permission?.startsWith('!')) {
                hasPermissions = !permissions.find((currentPermission) => currentPermission.name === permission.replace('!', ''));
            } else {
                hasPermissions = !!permissions.find((currentPermission) => currentPermission.name === permission);
            }
        } else {
            if (permission === PermissionsEnum.CONSUMER) {
                hasPermissions = true;
            } else if (permission === PermissionsEnum.NOT_CONSUMER) {
                hasPermissions = false;
            } else if (permission?.startsWith('!')) {
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

        if (node?.allowableOperations) {
            if (allowableOperation?.startsWith('!')) {
                hasAllowableOperations = !node.allowableOperations.find(
                    (currentOperation) => currentOperation === allowableOperation.replace('!', '')
                );
            } else {
                hasAllowableOperations = !!node.allowableOperations.find((currentOperation) => currentOperation === allowableOperation);
            }
        } else {
            if (allowableOperation?.startsWith('!')) {
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

    getNodeIcon(node: Node): string {
        if (node?.isFolder) {
            return this.getFolderIcon(node);
        }
        if (node?.isFile) {
            return this.thumbnailService.getMimeTypeIcon(node?.content?.mimeType);
        }
        return this.thumbnailService.getDefaultMimeTypeIcon();
    }

    private getFolderIcon(node: Node): string {
        if (this.isSmartFolder(node)) {
            return this.thumbnailService.getMimeTypeIcon('smartFolder');
        } else if (this.isRuleFolder(node)) {
            return this.thumbnailService.getMimeTypeIcon('ruleFolder');
        } else if (this.isLinkFolder(node)) {
            return this.thumbnailService.getMimeTypeIcon('linkFolder');
        } else {
            return this.thumbnailService.getMimeTypeIcon('folder');
        }
    }

    isSmartFolder(node: Node): boolean {
        if (node) {
            return this.hasAspect(node, 'smf:customConfigSmartFolder') || this.hasAspect(node, 'smf:systemConfigSmartFolder');
        }
        return false;
    }

    isRuleFolder(node: Node): boolean {
        if (node) {
            return this.hasAspect(node, 'rule:rules');
        }
        return false;
    }

    isLinkFolder(node: Node): boolean {
        return node?.nodeType === 'app:folderlink';
    }

    private hasAspect(node: Node, aspectName: string): boolean {
        return node?.aspectNames?.includes(aspectName);
    }
}
