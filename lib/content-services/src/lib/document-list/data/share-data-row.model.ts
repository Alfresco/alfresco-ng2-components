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

import { DataRow, ObjectUtils, ThumbnailService } from '@alfresco/adf-core';
import { MinimalNode, NodeEntry } from '@alfresco/js-api';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { ContentService } from './../../common/services/content.service';

export const ERR_OBJECT_NOT_FOUND: string = 'Object source not found';

export class ShareDataRow implements DataRow {
    cache: { [key: string]: any } = {};
    isSelected: boolean = false;
    isDropTarget: boolean;
    cssClass: string = '';
    id: string;

    get node(): NodeEntry {
        return this.obj;
    }

    set node(value: NodeEntry) {
        this.obj = value;
        this.cache = {};
    }

    constructor(private obj: NodeEntry,
                private contentService: ContentService,
                private permissionsStyle: PermissionStyleModel[],
                private thumbnailService?: ThumbnailService,
                private allowDropFiles?: boolean) {
        if (!obj) {
            throw new Error(ERR_OBJECT_NOT_FOUND);
        }

        this.isDropTarget = allowDropFiles !== undefined ? this.allowDropFiles && this.checkNodeTypeAndPermissions(obj) : this.checkNodeTypeAndPermissions(obj);
        if (permissionsStyle) {
            this.cssClass = this.getPermissionClass(obj);
        }
        this.id = this.getId();
    }

    checkNodeTypeAndPermissions(nodeEntry: NodeEntry) {
        return this.isFolderAndHasPermissionToUpload(nodeEntry) || this.isFileAndHasParentFolderPermissionToUpload(nodeEntry);
    }

    getPermissionClass(nodeEntity: NodeEntry): string {
        let permissionsClasses = '';

        this.permissionsStyle.forEach((currentPermissionsStyle: PermissionStyleModel) => {

            if (this.applyPermissionStyleToFolder(nodeEntity.entry, currentPermissionsStyle) || this.applyPermissionStyleToFile(nodeEntity.entry, currentPermissionsStyle)) {

                if (this.contentService.hasAllowableOperations(nodeEntity.entry, currentPermissionsStyle.permission)) {
                    permissionsClasses += ` ${currentPermissionsStyle.css}`;
                }
            }

        });

        return permissionsClasses;
    }

    private applyPermissionStyleToFile(node: MinimalNode, currentPermissionsStyle: PermissionStyleModel): boolean {
        return (currentPermissionsStyle.isFile && node.isFile);
    }

    private applyPermissionStyleToFolder(node: MinimalNode, currentPermissionsStyle: PermissionStyleModel): boolean {
        return (currentPermissionsStyle.isFolder && node.isFolder);
    }

    isFolderAndHasPermissionToUpload(nodeEntry: NodeEntry): boolean {
        return this.isFolder(nodeEntry) && this.contentService.hasAllowableOperations(nodeEntry.entry, 'create');
    }

    isFileAndHasParentFolderPermissionToUpload(nodeEntry: NodeEntry): boolean {
        return this.isFile(nodeEntry) && this.contentService.hasAllowableOperations(nodeEntry.entry, 'update');
    }

    isFile(nodeEntry: NodeEntry): boolean {
        return nodeEntry.entry && nodeEntry.entry.isFile;
    }

    isFolder(nodeEntry: NodeEntry): boolean {
        return nodeEntry.entry && nodeEntry.entry.isFolder;
    }

    cacheValue(key: string, value: any): any {
        this.cache[key] = value;
        return value;
    }

    getValue(key: string): any {
        if (this.cache[key] !== undefined) {
            return this.cache[key];
        }
        return ObjectUtils.getValue(this.obj.entry, key);
    }

    imageErrorResolver(): any {
        if (this.obj.entry.content) {
            return this.thumbnailService.getMimeTypeIcon(this.obj.entry.content.mimeType);
        }
    }

    hasValue(key: string): boolean {
        return this.getValue(key) !== undefined;
    }

    getId(): string {
        return this.obj.entry.id || undefined;
    }
}
