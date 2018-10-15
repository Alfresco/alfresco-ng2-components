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
    EXTENDIBLE_COMPONENT, FileInfo, FileModel, FileUtils, NodePermissionSubject,
    NotificationService, TranslationService, UploadService, ContentService, PermissionsEnum
} from '@alfresco/adf-core';
import { Component, forwardRef, Input, ViewEncapsulation, NgZone } from '@angular/core';
import { UploadBase } from './base-upload/upload-base';

@Component({
    selector: 'adf-upload-drag-area',
    templateUrl: './upload-drag-area.component.html',
    styleUrls: ['./upload-drag-area.component.css'],
    host: { 'class': 'adf-upload-drag-area' },
    viewProviders: [
        { provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadDragAreaComponent) }
    ],
    encapsulation: ViewEncapsulation.None
})
export class UploadDragAreaComponent extends UploadBase implements NodePermissionSubject {

    /**
     * ID of parent folder node
     * @deprecated 2.4.0 - use rootFolderId ID of parent folder node
     */
    @Input()
    set parentId(nodeId: string) {
        this.rootFolderId = nodeId;
    }

    constructor(protected uploadService: UploadService,
                protected translationService: TranslationService,
                private notificationService: NotificationService,
                private contentService: ContentService,
                protected ngZone: NgZone) {
        super(uploadService, translationService, ngZone);
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param files - files dropped in the drag area.
     */
    onFilesDropped(files: File[]): void {
        if (!this.disabled && files.length) {
            this.uploadFiles(files);
        }
    }

    /**
     * Called when the file are dropped in the drag area.
     * @deprecated in 2.4.0: use `onFilesDropped` instead
     * @param item - FileEntity
     */
    onFilesEntityDropped(item: any): void {
        if (!this.disabled) {
            item.file((file: File) => {
                // const fileModel = this.createFileModel(file, this.rootFolderId, item.fullPath.replace(item.name, ''));

                this.uploadFiles([file]);
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
            FileUtils.flatten(folder).then(filesInfo => {
                this.uploadFilesInfo(filesInfo);
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
        messageTranslate = this.translationService.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translationService.get('FILE_UPLOAD.ACTION.UNDO');

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
        let isAllowed: boolean = this.contentService.hasPermission(event.detail.data.obj.entry, PermissionsEnum.CREATE);
        if (isAllowed) {
            let fileInfo: FileInfo[] = event.detail.files;
            if (this.isTargetNodeFolder(event)) {
                const destinationFolderName = event.detail.data.obj.entry.name;
                fileInfo.map((file) => file.relativeFolder = destinationFolderName ? destinationFolderName.concat(file.relativeFolder) : file.relativeFolder);
            }
            if (fileInfo && fileInfo.length > 0) {
                this.uploadFilesInfo(fileInfo);
            }
        }
    }

    private isTargetNodeFolder(event: CustomEvent): boolean {
        return event.detail.data.obj && event.detail.data.obj.entry.isFolder;
    }

}
