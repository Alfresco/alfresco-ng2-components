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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlfrescoTranslationService, FileInfo, FileModel, FileUtils, NotificationService, UploadService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-upload-drag-area, alfresco-upload-drag-area',
    templateUrl: './upload-drag-area.component.html',
    styleUrls: ['./upload-drag-area.component.css']
})
export class UploadDragAreaComponent {

    @Input()
    enabled: boolean = true;

    /**
     * @deprecated Deprecated in 1.6.0, you can use UploadService events and NotificationService api instead.
     *
     * @type {boolean}
     * @memberof UploadButtonComponent
     */
    @Input()
    showNotificationBar: boolean = true;

    @Input()
    versioning: boolean = false;

    /**
     * @deprecated Deprecated in 1.6.0, this property is not used for couple of releases already. Use rootFolderId instead.
     *
     * @type {string}
     * @memberof UploadDragAreaComponent
     */
    @Input()
    currentFolderPath: string = '/';

    /**
     * @deprecated Deprecated in 1.6.2, this property is not used for couple of releases already. Use parentId instead.
     *
     * @type {string}
     * @memberof UploadDragAreaComponent
     */
    @Input()
    rootFolderId: string = '-root-';

    @Input()
    parentId: string;

    @Output()
    onSuccess = new EventEmitter();

    constructor(private uploadService: UploadService,
                private translateService: AlfrescoTranslationService,
                private notificationService: NotificationService) {
    }

    /**
     * Handles 'upload-files' events raised by child components.
     * @param event DOM event
     */
    onUploadFiles(event: CustomEvent) {
        event.stopPropagation();
        event.preventDefault();
        let isAllowed: boolean = this.isAllowed(event.detail.data.obj.entry);
        if (isAllowed) {
            let files: FileInfo[] = event.detail.files;
            if (files && files.length > 0) {
                let parentId = this.parentId || this.rootFolderId;
                if (event.detail.data && event.detail.data.obj.entry.isFolder) {
                    parentId = event.detail.data.obj.entry.id || this.parentId || this.rootFolderId;
                }
                const fileModels = files.map(fileInfo => new FileModel(fileInfo.file, {
                    newVersion: this.versioning,
                    path: fileInfo.relativeFolder,
                    parentId: parentId
                }));
                this.uploadFiles(fileModels, isAllowed);
            }
        }
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesDropped(files: File[]): void {
        if (this.enabled && files.length) {
            const fileModels = files.map(file => new FileModel(file, {
                newVersion: this.versioning,
                path: '/',
                parentId: this.parentId || this.rootFolderId
            }));
            this.uploadService.addToQueue(...fileModels);
            this.uploadService.uploadFilesInTheQueue(this.onSuccess);
            let latestFilesAdded = this.uploadService.getQueue();
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(latestFilesAdded);
            }
        }
    }

    /**
     * Called when the file are dropped in the drag area
     * @param item - FileEntity
     */
    onFilesEntityDropped(item: any): void {
        if (this.enabled) {
            item.file((file: File) => {
                const fileModel = new FileModel(file, {
                    newVersion: this.versioning,
                    parentId: this.parentId || this.rootFolderId,
                    path: item.fullPath.replace(item.name, '')
                });
                this.uploadService.addToQueue(fileModel);
                this.uploadService.uploadFilesInTheQueue(this.onSuccess);
            });
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(item);
            }
        }
    }

    /**
     * Called when a folder are dropped in the drag area
     * @param folder - name of the dropped folder
     */
    onFolderEntityDropped(folder: any): void {
        if (this.enabled && folder.isDirectory) {
            FileUtils.flattern(folder).then(entries => {
                let files = entries.map(entry => {
                    return new FileModel(entry.file, {
                        newVersion: this.versioning,
                        parentId: this.parentId || this.rootFolderId,
                        path: entry.relativeFolder
                    });
                });
                this.uploadService.addToQueue(...files);
                /* @deprecated in 1.6.0 */
                if (this.showNotificationBar) {
                    let latestFilesAdded = this.uploadService.getQueue();
                    this.showUndoNotificationBar(latestFilesAdded);
                }
                this.uploadService.uploadFilesInTheQueue(this.onSuccess);
            });
        }
    }

    /**
     * Show undo notification bar.
     *
     * @param {FileModel[]} latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    showUndoNotificationBar(latestFilesAdded: FileModel[]) {
        let messageTranslate: any, actionTranslate: any;
        messageTranslate = this.translateService.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translateService.get('FILE_UPLOAD.ACTION.UNDO');

        this.notificationService.openSnackMessageAction(messageTranslate.value, actionTranslate.value, 3000).onAction().subscribe(() => {
            this.uploadService.cancelUpload(...latestFilesAdded);
        });
    }

    /**
     * Show the error inside Notification bar
     * @param Error message
     * @private
     */
    showErrorNotificationBar(errorMessage: string) {
        this.notificationService.openSnackMessage(errorMessage, 3000);
    }

    private uploadFiles(files: FileModel[], isAllowed: boolean): void {
        if (isAllowed && files.length) {
            this.uploadService.addToQueue(...files);
            this.uploadService.uploadFilesInTheQueue(this.onSuccess);
            let latestFilesAdded = this.uploadService.getQueue();
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(latestFilesAdded);
            }
        }
    }

    private hasCreatePermission(node: any): boolean {
        let isPermitted = false;
        if (node && node['allowableOperations']) {
            let permFound = node['allowableOperations'].find(element => element === 'create');
            isPermitted = permFound ? true : false;
        }
        return isPermitted;
    }

    private isAllowed(node: any) {
        return this.enabled || this.hasCreatePermission(node);
    }
}
