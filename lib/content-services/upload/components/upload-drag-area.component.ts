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
    EXTENDIBLE_COMPONENT,
    FileInfo,
    FileModel,
    FileUtils,
    NodePermissionSubject,
    NotificationService,
    TranslationService,
    UploadService
} from '@alfresco/adf-core';
import { Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { UploadBase } from './base-upload/upload-base';

@Component({
    selector: 'adf-upload-drag-area',
    templateUrl: './upload-drag-area.component.html',
    styleUrls: ['./upload-drag-area.component.css'],
    host: {'class': 'adf-upload-drag-area'},
    viewProviders: [
        { provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadDragAreaComponent) }
    ],
    encapsulation: ViewEncapsulation.None
})
export class UploadDragAreaComponent extends UploadBase implements NodePermissionSubject {

    /** Toggle component disabled state. */
    @Input()
    disabled: boolean = false;

    /** When false, renames the file using an integer suffix if there is a name clash.
     * Set to true to indicate that a major version should be created instead.
     */
    @Input()
    versioning: boolean = false;

    /** ID of parent folder node. */
    @Input()
    parentId: string;

    /** Emitted when the file is uploaded. */
    @Output()
    success = new EventEmitter();

    /** Raised when the file upload goes in error. */
    @Output()
    error = new EventEmitter();

    constructor(private uploadService: UploadService,
                private translateService: TranslationService,
                private notificationService: NotificationService) {
                    super();
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param files - files dropped in the drag area.
     */
    onFilesDropped(files: File[]): void {
        if (!this.disabled && files.length) {
            const fileModels = files.map(file => new FileModel(file, {
                newVersion: this.versioning,
                path: '/',
                parentId: this.parentId
            })).filter(this.isFileAcceptable.bind(this));
            this.addNodeInUploadQueue(fileModels);
        }
    }

    /**
     * Called when the file are dropped in the drag area
     *
     * @param item - FileEntity
     */
    onFilesEntityDropped(item: any): void {
        if (!this.disabled) {
            item.file((file: File) => {
                const fileModel = new FileModel(file, {
                    newVersion: this.versioning,
                    parentId: this.parentId,
                    path: item.fullPath.replace(item.name, '')
                });
                if (this.isFileAcceptable(fileModel)) {
                    this.addNodeInUploadQueue([fileModel]);
                }
            });
        }
    }

    /**
     * Called when a folder are dropped in the drag area
     *
     * @param folder - name of the dropped folder
     */
    onFolderEntityDropped(folder: any): void {
        if (!this.disabled && folder.isDirectory) {
            FileUtils.flattern(folder).then(entries => {
                let files = entries.map(entry => {
                    return new FileModel(entry.file, {
                        newVersion: this.versioning,
                        parentId: this.parentId,
                        path: entry.relativeFolder
                    });
                }).filter(this.isFileAcceptable.bind(this));
                this.addNodeInUploadQueue(files);
            });
        }
    }

    private addNodeInUploadQueue(files: FileModel[]) {
        if (files.length) {
            this.uploadService.addToQueue(...files);
            this.uploadService.uploadFilesInTheQueue(this.success);
            this.uploadService.fileUploadError.subscribe((error) => {
                this.error.emit(error);
                });
        }
    }

    /**
     * Show undo notification bar.
     *
     * @param latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    showUndoNotificationBar(latestFilesAdded: FileModel[]) {
        let messageTranslate: any, actionTranslate: any;
        messageTranslate = this.translateService.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translateService.get('FILE_UPLOAD.ACTION.UNDO');

        this.notificationService.openSnackMessageAction(messageTranslate.value, actionTranslate.value, 3000).onAction().subscribe(() => {
            this.uploadService.cancelUpload(...latestFilesAdded);
        });
    }

    /** Returns true or false considering the component options and node permissions */
    isDroppable(): boolean {
        return !this.disabled;
    }

    /**
     * Handles 'upload-files' events raised by child components.
     *
     * @param event DOM event
     */
    onUploadFiles(event: CustomEvent) {
        event.stopPropagation();
        event.preventDefault();
        let isAllowed: boolean = this.hasCreatePermission(event.detail.data.obj.entry);
        if (isAllowed) {
            let files: FileInfo[] = event.detail.files;
            if (files && files.length > 0) {
                let parentId = this.parentId;
                if (event.detail.data && event.detail.data.obj.entry.isFolder) {
                    parentId = event.detail.data.obj.entry.id || this.parentId;
                }
                const fileModels = files.map(fileInfo => new FileModel(fileInfo.file, {
                    newVersion: this.versioning,
                    path: fileInfo.relativeFolder,
                    parentId: parentId
                })).filter(this.isFileAcceptable.bind(this));
                this.addNodeInUploadQueue(fileModels);
            }
        }
    }

    /**
     * Check if "create" permission is present on the given node
     *
     * @param node
     */
    private hasCreatePermission(node: any): boolean {
        let isPermitted = false;
        if (node && node['allowableOperations']) {
            let permFound = node['allowableOperations'].find(element => element === 'create');
            isPermitted = permFound ? true : false;
        }
        return isPermitted;
    }
}
