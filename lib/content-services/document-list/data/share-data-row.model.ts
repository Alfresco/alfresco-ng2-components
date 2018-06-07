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

import { DataRow, ObjectUtils, ThumbnailService } from '@alfresco/adf-core';
import { MinimalNode, MinimalNodeEntity } from 'alfresco-js-api';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { DocumentListService } from './../services/document-list.service';

export class ShareDataRow implements DataRow {

    static ERR_OBJECT_NOT_FOUND: string = 'Object source not found';

    cache: { [key: string]: any } = {};
    isSelected: boolean = false;
    isDropTarget: boolean;
    cssClass: string = '';

    get node(): MinimalNodeEntity {
        return this.obj;
    }

    constructor(private obj: MinimalNodeEntity,
                private documentListService: DocumentListService,
                private permissionsStyle: PermissionStyleModel[],
                private thumbnailService?: ThumbnailService) {
        if (!obj) {
            throw new Error(ShareDataRow.ERR_OBJECT_NOT_FOUND);
        }

        this.isDropTarget = this.isFolderAndHasPermissionToUpload(obj);

        if (permissionsStyle) {
            this.cssClass = this.getPermissionClass(obj);
        }
    }

    getPermissionClass(nodeEntity: MinimalNodeEntity): string {
        let permissionsClasses = '';

        this.permissionsStyle.forEach((currentPermissionsStyle: PermissionStyleModel) => {

            if (this.applyPermissionStyleToFolder(nodeEntity.entry, currentPermissionsStyle) || this.applyPermissionStyleToFile(nodeEntity.entry, currentPermissionsStyle)) {

                if (this.documentListService.hasPermission(nodeEntity.entry, currentPermissionsStyle.permission)) {
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

    isFolderAndHasPermissionToUpload(obj: MinimalNodeEntity): boolean {
        return this.isFolder(obj) && this.documentListService.hasPermission(obj.entry, 'create');
    }

    isFolder(obj: MinimalNodeEntity): boolean {
        return obj.entry && obj.entry.isFolder;
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

    imageErrorResolver(event: Event): any {
        return this.thumbnailService.getMimeTypeIcon(this.obj.entry.content.mimeType);
    }

    hasValue(key: string): boolean {
        return this.getValue(key) !== undefined;
    }
}
