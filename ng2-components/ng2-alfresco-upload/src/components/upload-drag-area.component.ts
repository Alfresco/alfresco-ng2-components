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

import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { AlfrescoTranslateService } from 'ng2-alfresco-core';
import { FileModel } from '../models/file.model';

declare let componentHandler: any;

const ERROR_FOLDER_ALREADY_EXIST = 409;

/**
 * <alfresco-upload-drag-area (onSuccess)="customMethod($event)></alfresco-upload-drag-area>
 *
 * This component, provide a drag and drop are to upload files to alfresco.
 *
 * @Output - onSuccess - The event is emitted when the file is uploaded
 *
 * @returns {UploadDragAreaComponent} .
 */
@Component({
    selector: 'alfresco-upload-drag-area',
    moduleId: module.id,
    templateUrl: './upload-drag-area.component.html',
    styleUrls: ['./upload-drag-area.component.css']
})
export class UploadDragAreaComponent {

    private static DEFAULT_ROOT_ID: string = '-root-';

    @ViewChild('undoNotificationBar')
    undoNotificationBar: any;

    @Input()
    showUdoNotificationBar: boolean = true;

    @Input()
    versioning: boolean = false;

    @Input()
    currentFolderPath: string = '/';

    @Input()
    rootFolderId: string = UploadDragAreaComponent.DEFAULT_ROOT_ID;

    @Output()
    onSuccess = new EventEmitter();

    constructor(private uploadService: UploadService,
                private translateService: AlfrescoTranslateService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-upload', 'node_modules/ng2-alfresco-upload/src');
        }
    }

    ngOnChanges(changes) {
        let formFields = this.createFormFields();
        this.uploadService.setOptions(formFields, this.versioning);
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesDropped(files: File[]): void {
        if (files.length) {
            if (this.checkValidity(files)) {
                this.uploadService.addToQueue(files);
                this.uploadService.uploadFilesInTheQueue(this.rootFolderId, this.currentFolderPath, this.onSuccess);
                let latestFilesAdded = this.uploadService.getQueue();
                if (this.showUdoNotificationBar) {
                    this.showUndoNotificationBar(latestFilesAdded);
                }
            } else {
                let errorMessage: any;
                errorMessage = this.translateService.get('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
                if (this.showUdoNotificationBar) {
                    this.showErrorNotificationBar(errorMessage.value);
                } else {
                    console.error(errorMessage.value);
                }
            }
        }
    }

    /**
     * Check il the file is valid or not
     * @param files
     * @returns {boolean}
     */
    checkValidity(files: File[]): boolean {
        if (files.length && files[0].type === '') {
            return false;
        }
        return true;
    }

    /**
     * Called when the file are dropped in the drag area
     * @param item - FileEntity
     */
    onFilesEntityDropped(item: any): void {
        item.file( (file: any) => {
            this.uploadService.addToQueue([file]);
            let path = item.fullPath.replace(item.name, '');
            let filePath = this.currentFolderPath + path;
            this.uploadService.uploadFilesInTheQueue(this.rootFolderId, filePath, this.onSuccess);
        });
    }

    /**
     * Called when a folder are dropped in the drag area
     * @param folder - name of the dropped folder
     */
    onFolderEntityDropped(folder: any): void {
        if (folder.isDirectory) {
            let relativePath = folder.fullPath.replace(folder.name, '');
            relativePath = this.currentFolderPath + relativePath;

            this.uploadService.createFolder(relativePath, folder.name)
                .subscribe(
                    message => {
                        this.onSuccess.emit({
                            value: 'Created folder'
                        });
                        let dirReader = folder.createReader();
                        dirReader.readEntries((entries: any) => {
                            for (let i = 0; i < entries.length; i++) {
                                this._traverseFileTree(entries[i]);
                            }
                            if (this.showUdoNotificationBar) {
                                let latestFilesAdded = this.uploadService.getQueue();
                                this.showUndoNotificationBar(latestFilesAdded);
                            }
                        });
                    },
                    error => {
                        let errorMessagePlaceholder = this.getErrorMessage(error.response);
                        let errorMessage = this.formatString(errorMessagePlaceholder, [folder.name]);
                        if (this.showUdoNotificationBar) {
                            this.showErrorNotificationBar(errorMessage);
                        } else {
                            console.error(errorMessage);
                        }

                    }
                );
        }
    }

    /**
     * Travers all the files and folders, and create it on the alfresco.
     *
     * @param {Object} item - can contains files or folders.
     */
    private _traverseFileTree(item: any): void {
        if (item.isFile) {
            this.onFilesEntityDropped(item);
        } else {
            if (item.isDirectory) {
                this.onFolderEntityDropped(item);
            }
        }
    }

    /**
     * Show undo notification bar.
     *
     * @param {FileModel[]} latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    showUndoNotificationBar(latestFilesAdded: FileModel[]) {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

        let messageTranslate: any, actionTranslate: any;
        messageTranslate = this.translateService.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translateService.get('FILE_UPLOAD.ACTION.UNDO');

        this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
            message: messageTranslate.value,
            timeout: 3000,
            actionHandler: function () {
                latestFilesAdded.forEach((uploadingFileModel: FileModel) => {
                    uploadingFileModel.emitAbort();
                });
            },
            actionText: actionTranslate.value
        });
    }

    /**
     * Show the error inside Notification bar
     * @param Error message
     * @private
     */
    showErrorNotificationBar(errorMessage: string) {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

        this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
            message: errorMessage,
            timeout: 3000
        });
    }

    /**
     * Retrive the error message using the error status code
     * @param response - object that contain the HTTP response
     * @returns {string}
     */
    private getErrorMessage(response: any): string {
        if (response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
            let errorMessage: any;
            errorMessage = this.translateService.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            return errorMessage.value;
        }
    }

    /**
     * Replace a placeholder {0} in a message with the input keys
     * @param message - the message that conains the placeholder
     * @param keys - array of value
     * @returns {string} - The message without placeholder
     */
    private formatString(message: string, keys: any []) {
        if (message) {
            let i = keys.length;
            while (i--) {
                message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
            }
        }
        return message;
    }

    private createFormFields(): any {
        return {
            formFields: {
                overwrite: true
            }
        };
    }
}
