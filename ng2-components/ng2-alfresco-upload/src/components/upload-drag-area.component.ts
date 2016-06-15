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
import { FileDraggableDirective } from '../directives/file-draggable.directive';
import { AlfrescoTranslationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { FileModel } from '../models/file.model';

declare let __moduleName: string;
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
    moduleId: __moduleName,
    directives: [FileDraggableDirective],
    templateUrl: './upload-drag-area.component.html',
    styleUrls: ['./upload-drag-area.component.css'],
    pipes: [AlfrescoPipeTranslate]
})
export class UploadDragAreaComponent {

    @ViewChild('undoNotificationBar')
    undoNotificationBar: any;

    @Input()
    showUdoNotificationBar: boolean = true;

    @Input()
    uploaddirectory: string = '';

    @Input()
    currentFolderPath: string = '/Sites/swsdp/documentLibrary';

    @Output()
    onSuccess = new EventEmitter();

    translate: AlfrescoTranslationService;

    constructor(private _uploaderService: UploadService,
                translate: AlfrescoTranslationService) {

        let site = this.getSiteId();
        let container = this.getContainerId();

        this._uploaderService.setOptions({
            formFields: {
                siteid: site,
                containerid: container
            }
        });

        this.translate = translate;
        this.translate.addTranslationFolder('node_modules/ng2-alfresco-upload');
    }

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    onFilesDropped(files: File[]): void {
        if (files.length) {
            this._uploaderService.addToQueue(files);
            this._uploaderService.uploadFilesInTheQueue(this.uploaddirectory, this.onSuccess);
            let latestFilesAdded = this._uploaderService.getQueue();
            if (this.showUdoNotificationBar) {
                this._showUndoNotificationBar(latestFilesAdded);
            }
        }
    }

    /**
     * Called when the file are dropped in the drag area
     * @param item - FileEntity
     */
    onFilesEntityDropped(item: any): void {
        let self = this;
        item.file(function (file: any) {
            self._uploaderService.addToQueue([file]);
            let path = item.fullPath.replace(item.name, '');
            let filePath = self.uploaddirectory + path;
            self._uploaderService.uploadFilesInTheQueue(filePath, self.onSuccess);
            let latestFilesAdded = self._uploaderService.getQueue();
            if (self.showUdoNotificationBar) {
                self._showUndoNotificationBar(latestFilesAdded);
            }
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

            this._uploaderService.createFolder(relativePath, folder.name)
                .subscribe(
                    message => {
                        let self = this;
                        let dirReader = folder.createReader();
                        dirReader.readEntries(function (entries: any) {
                            for (let i = 0; i < entries.length; i++) {
                                self._traverseFileTree(entries[i]);
                            }
                        });
                    },
                    error => {
                        let errorMessagePlaceholder = this.getErrorMessage(error.response);
                        let errorMessage = this.formatString(errorMessagePlaceholder, [folder.name]);
                        if (errorMessage) {
                            this._showErrorNotificationBar(errorMessage);
                        }
                        console.log(error);
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
            let self = this;
            self.onFilesEntityDropped(item);
        } else {
            if (item.isDirectory) {
                let self = this;
                self.onFolderEntityDropped(item);
            }
        }
    }

    /**
     * Return the site from the path
     * @returns {string}
     */
    private getSiteId(): string {
        return this.currentFolderPath.replace('/Sites/', '').split('/')[0];
    }

    /**
     * Return the container from the path
     * @returns {string}
     */
    private getContainerId(): string {
        return this.currentFolderPath.replace('/Sites/', '').split('/')[1];
    }

    /**
     * Show undo notification bar.
     *
     * @param {FileModel[]} latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    private _showUndoNotificationBar(latestFilesAdded: FileModel[]) {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

        let messageTranslate, actionTranslate: any;
        messageTranslate = this.translate.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translate.get('FILE_UPLOAD.ACTION.UNDO');

        this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
            message: messageTranslate.value,
            timeout: 3000,
            actionHandler: function () {
                latestFilesAdded.forEach((uploadingFileModel: FileModel) => {
                    uploadingFileModel.setAbort();
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
    private _showErrorNotificationBar(errorMessage: string) {
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
        if(response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST ) {
            let errorMessage: any;
            errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
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
        let i = keys.length;
        while (i--) {
            message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
        }
        return message;
    }
}
